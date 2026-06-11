'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as PortOne from '@portone/browser-sdk/v2';
import { createClient } from '@/lib/supabase/client';
import type { Event, Profile } from '@/types/database';
import Spinner from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';

interface BookingButtonProps {
  event: Event;
  profile: Profile | null;
  existingOrder: { id: string; status: string } | null;
  isSoldOut: boolean;
}

export default function BookingButton({ event, profile, existingOrder, isSoldOut }: BookingButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Already registered
  if (existingOrder) {
    return (
      <div className="text-center">
        <div className="badge badge-green w-full justify-center py-3 text-sm mb-3">
          ✓ You&apos;re registered!
        </div>
        <button
          onClick={() => router.push(`/chat/${event.id}`)}
          className="btn-secondary w-full text-sm"
        >
          Open event chat →
        </button>
      </div>
    );
  }

  if (isSoldOut) {
    return (
      <button disabled className="btn-primary w-full opacity-40 cursor-not-allowed">
        Sold Out
      </button>
    );
  }

  if (event.status !== 'published') {
    return (
      <button disabled className="btn-primary w-full opacity-40 cursor-not-allowed">
        Not available
      </button>
    );
  }

  async function handleBook() {
    if (!profile) {
      router.push(`/login?redirect=/events/${event.slug}`);
      return;
    }

    setLoading(true);

    try {
      if (event.is_free) {
        // Free event: directly create order
        const supabase = createClient();
        const { error } = await supabase.from('orders').insert({
          event_id: event.id,
          user_id: profile.id,
          quantity: 1,
          amount_krw: 0,
          status: 'free_confirmed',
        });
        if (error) throw error;
        toast('You\'re in! 🎉', 'success');
        router.refresh();
        return;
      }

      // Paid: PortOne payment
      const paymentId = `${event.id}-${profile.id}-${Date.now()}`;

      // Prepare order on server
      const prepRes = await fetch('/api/payments/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, eventId: event.id, quantity: 1 }),
      });
      if (!prepRes.ok) throw new Error('Failed to prepare payment');

      // Launch PortOne popup
      const response = await PortOne.requestPayment({
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
        channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!,
        paymentId,
        orderName: event.title,
        totalAmount: event.price_krw,
        currency: 'KRW',
        customer: {
          customerId: profile.id,
          fullName: profile.display_name ?? undefined,
          email: profile.email,
        },
        redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/verify`,
      });

      if (response?.code) {
        throw new Error(response.message ?? 'Payment failed');
      }

      // Verify on server
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, eventId: event.id }),
      });

      if (!verifyRes.ok) {
        const err = await verifyRes.json();
        throw new Error(err.error ?? 'Verification failed');
      }

      toast('Payment complete! 🎉', 'success');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleBook} disabled={loading} className="btn-primary w-full justify-center">
      {loading ? (
        <Spinner size={18} />
      ) : event.is_free ? (
        'Register for free →'
      ) : (
        `Buy ticket →`
      )}
    </button>
  );
}
