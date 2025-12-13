import { createClient } from '@supabase/supabase-js';

// Supabase 配置
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Supabase 配置缺失！请检查 .env.local 文件中的配置：');
  console.error('- VITE_SUPABASE_URL');
  console.error('- VITE_SUPABASE_KEY');
}

// 创建 Supabase 客户端
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
