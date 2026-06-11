create or replace function public.create_order(p_event_id uuid, p_quantity int)
returns uuid language plpgsql security definer as $$
declare
  v_event public.events; v_sold int; v_order_id uuid; v_uid uuid := auth.uid();
begin
  select * into v_event from public.events where id = p_event_id for update;
  if v_event.status <> 'published' then raise exception 'unavailable'; end if;
  select coalesce(sum(quantity),0) into v_sold from public.orders
    where event_id = p_event_id and status in ('paid','free_confirmed','pending');
  if v_sold + p_quantity > v_event.capacity then raise exception 'sold out'; end if;
  insert into public.orders (event_id, user_id, quantity, amount_krw, status, payment_id)
    values (p_event_id, v_uid, p_quantity, v_event.price_krw * p_quantity,
            case when v_event.is_free then 'free_confirmed' else 'pending' end,
            'kjc_' || replace(uuid_generate_v4()::text, '-', ''))
    returning id into v_order_id;
  return v_order_id;
end $$;
