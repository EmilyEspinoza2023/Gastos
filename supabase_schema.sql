-- Tabla de categorias
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  icon text not null default '📦',
  color text not null default '#6b7280',
  type text not null check (type in ('income', 'expense')),
  created_at timestamptz default now()
);

-- Tabla de transacciones
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete set null,
  type text not null check (type in ('income', 'expense')),
  amount numeric(12,2) not null check (amount > 0),
  description text,
  date date not null default current_date,
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.categories enable row level security;
alter table public.transactions enable row level security;

-- Politicas: cada usuario solo ve sus propios datos
create policy "Users manage own categories"
  on public.categories for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own transactions"
  on public.transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
