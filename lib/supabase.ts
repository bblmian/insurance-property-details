import { createClient } from '@supabase/supabase-js';

let supabase;

// 在服务器端构建时跳过
if (typeof window === 'undefined') {
  // 提供默认值以避免构建错误
  supabase = createClient(
    'https://placeholder-url.supabase.co',
    'placeholder-key'
  );
} else {
  // 客户端运行时检查环境变量
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase }; 