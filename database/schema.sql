CREATE TABLE items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid NOT NULL references auth.users(id) on delete cascade,
  title text NOT NULL,
  content text,
  ai_response text,
  created_at timestamptz default now()
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own items" ON items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own items" ON items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own items" ON items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own items" ON items FOR DELETE USING (auth.uid() = user_id);
