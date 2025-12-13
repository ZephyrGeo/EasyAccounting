-- ============================================
-- 配置 Row Level Security (RLS) 策略
-- 用于 anon key 访问
-- ============================================

-- 1. 为 transactions 表启用 RLS 并创建策略
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 删除旧策略（如果存在）
DROP POLICY IF EXISTS "Enable read access for all users" ON transactions;
DROP POLICY IF EXISTS "Enable insert for all users" ON transactions;
DROP POLICY IF EXISTS "Enable update for all users" ON transactions;
DROP POLICY IF EXISTS "Enable delete for all users" ON transactions;

-- 创建新策略：允许所有人读取
CREATE POLICY "Enable read access for all users" ON transactions
FOR SELECT USING (true);

-- 创建新策略：允许所有人插入
CREATE POLICY "Enable insert for all users" ON transactions
FOR INSERT WITH CHECK (true);

-- 创建新策略：允许所有人更新
CREATE POLICY "Enable update for all users" ON transactions
FOR UPDATE USING (true);

-- 创建新策略：允许所有人删除
CREATE POLICY "Enable delete for all users" ON transactions
FOR DELETE USING (true);

-- 2. 为 categories 表启用 RLS 并创建策略
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON categories;
DROP POLICY IF EXISTS "Enable insert for all users" ON categories;

CREATE POLICY "Enable read access for all users" ON categories
FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON categories
FOR INSERT WITH CHECK (true);

-- 3. 为 merchants 表启用 RLS 并创建策略
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON merchants;
DROP POLICY IF EXISTS "Enable insert for all users" ON merchants;

CREATE POLICY "Enable read access for all users" ON merchants
FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON merchants
FOR INSERT WITH CHECK (true);

-- ============================================
-- 验证 RLS 配置
-- ============================================

-- 查看所有表的 RLS 状态
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('transactions', 'categories', 'merchants');

-- 查看所有策略
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('transactions', 'categories', 'merchants')
ORDER BY tablename, policyname;
