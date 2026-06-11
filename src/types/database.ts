export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// ─── Enums ────────────────────────────────────────────────────────────────────

export type Gender = 'male' | 'female' | 'other' | 'undisclosed';
export type Role = 'user' | 'host' | 'admin';
export type EventSource = 'official' | 'host';
export type EventStatus = 'draft' | 'pending' | 'published' | 'closed' | 'cancelled';
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'free_confirmed';
export type PayoutStatus = 'pending' | 'paid' | 'hold';

// ─── Table Rows ───────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  nationality: string;
  gender: Gender;
  birth_date: string;
  referral_source: string | null;
  avatar_url: string | null;
  role: Role;
  created_at: string;
}

export interface SiteSetting {
  key: string;
  value: Json;
  updated_at: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description_html: string | null;
  category: string | null;
  source: EventSource;
  host_id: string | null;
  detail_page_html: string | null;
  detail_video_url: string | null;
  starts_at: string;
  ends_at: string | null;
  venue_name: string | null;
  venue_address: string | null;
  venue_lat: number | null;
  venue_lng: number | null;
  is_free: boolean;
  price_krw: number;
  capacity: number;
  cover_image_url: string | null;
  images: string[];
  status: EventStatus;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  event_id: string;
  user_id: string;
  quantity: number;
  amount_krw: number;
  status: OrderStatus;
  payment_id: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface Payout {
  id: string;
  event_id: string | null;
  host_id: string | null;
  gross_krw: number;
  fee_rate: number;
  fee_krw: number;
  net_krw: number;
  status: PayoutStatus;
  bank_name: string | null;
  account_number: string | null;
  account_holder: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface ChatRoom {
  id: string;
  event_id: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  body: string;
  created_at: string;
}

export interface ChatMember {
  room_id: string;
  user_id: string;
  joined_at: string;
}

// ─── View ─────────────────────────────────────────────────────────────────────

export interface EventStats {
  event_id: string;
  capacity: number;
  sold: number;
  remaining: number;
}

// ─── Joined / Extended Types ──────────────────────────────────────────────────

export interface EventWithStats extends Event {
  event_stats?: EventStats;
  profiles?: Pick<Profile, 'id' | 'display_name' | 'avatar_url'>;
}

export interface OrderWithEvent extends Order {
  events?: Pick<Event, 'id' | 'slug' | 'title' | 'cover_image_url' | 'starts_at' | 'venue_name'>;
}

export interface ChatMessageWithProfile extends ChatMessage {
  profiles?: Pick<Profile, 'id' | 'display_name' | 'avatar_url'>;
}

// ─── Site Settings Typed Values ───────────────────────────────────────────────

export interface HeroSettings {
  title_en: string;
  title_kr: string;
  subtitle: string;
  cta: string;
}

export interface BrandSettings {
  name: string;
  logo_play: string;
  tagline: string;
}

export interface ThemeSettings {
  primary: string;
  bg: string;
  surface: string;
  text: string;
}

// ─── Supabase DB Type Map ─────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'> & { created_at?: string };
        Update: Partial<Omit<Profile, 'id'>>;
      };
      events: {
        Row: Event;
        Insert: Omit<Event, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<Event, 'id'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Order, 'id'>>;
      };
      payouts: {
        Row: Payout;
        Insert: Omit<Payout, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Payout, 'id'>>;
      };
      chat_rooms: {
        Row: ChatRoom;
        Insert: Omit<ChatRoom, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<ChatRoom, 'id'>>;
      };
      chat_messages: {
        Row: ChatMessage;
        Insert: Omit<ChatMessage, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<ChatMessage, 'id'>>;
      };
      chat_members: {
        Row: ChatMember;
        Insert: ChatMember;
        Update: Partial<ChatMember>;
      };
      site_settings: {
        Row: SiteSetting;
        Insert: Omit<SiteSetting, 'updated_at'> & { updated_at?: string };
        Update: Partial<SiteSetting>;
      };
    };
    Views: {
      event_stats: {
        Row: EventStats;
      };
    };
  };
}
