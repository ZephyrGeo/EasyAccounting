/**
 * 数据库迁移脚本：将支出交易的金额转为负数
 *
 * 运行方式：
 * npx tsx scripts/migrate-negative-amounts.ts
 *
 * 或者添加到 package.json：
 * "scripts": {
 *   "migrate:amounts": "tsx scripts/migrate-negative-amounts.ts"
 * }
 * 然后运行：npm run migrate:amounts
 */

import { createClient } from '@supabase/supabase-js';
import { EXPENSE_CATEGORIES } from '../src/constants/categories';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// 加载环境变量
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// 创建 Supabase 客户端
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 错误: 缺少 Supabase 配置');
  console.error('请确保 .env.local 文件中包含 VITE_SUPABASE_URL 和 VITE_SUPABASE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface Transaction {
  id: string;
  amount: number;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
}

async function migrateAmountsToNegative() {
  console.log('🚀 开始迁移交易金额...\n');

  try {
    // 1. 获取所有分类
    console.log('📋 Step 1: 获取所有分类...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name');

    if (categoriesError) {
      throw new Error(`获取分类失败: ${categoriesError.message}`);
    }

    console.log(`✅ 找到 ${categories?.length || 0} 个分类\n`);

    // 2. 找出所有支出分类的 ID
    const expenseCategoryIds = categories
      ?.filter((cat: Category) => EXPENSE_CATEGORIES.includes(cat.name as any))
      .map((cat: Category) => cat.id) || [];

    console.log('📊 支出分类列表:');
    categories
      ?.filter((cat: Category) => expenseCategoryIds.includes(cat.id))
      .forEach((cat: Category) => console.log(`   - ${cat.name}`));
    console.log('');

    // 3. 获取所有金额为正数的支出交易
    console.log('🔍 Step 2: 查找需要迁移的交易...');
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('id, amount, category_id')
      .in('category_id', expenseCategoryIds)
      .gt('amount', 0); // 只获取金额为正数的

    if (transactionsError) {
      throw new Error(`获取交易失败: ${transactionsError.message}`);
    }

    if (!transactions || transactions.length === 0) {
      console.log('✅ 没有需要迁移的交易！所有支出金额已经是负数。\n');
      return;
    }

    console.log(`📝 找到 ${transactions.length} 笔需要转为负数的支出交易\n`);

    // 4. 显示迁移预览（前5笔）
    console.log('📋 迁移预览（前5笔）:');
    transactions.slice(0, 5).forEach((tx: Transaction) => {
      console.log(`   ID: ${tx.id.slice(0, 8)}... | ${tx.amount} → ${-tx.amount}`);
    });
    if (transactions.length > 5) {
      console.log(`   ... 还有 ${transactions.length - 5} 笔交易\n`);
    } else {
      console.log('');
    }

    // 5. 执行迁移
    console.log('🔄 Step 3: 执行迁移...');
    let successCount = 0;
    let errorCount = 0;

    for (const tx of transactions) {
      const { error } = await supabase
        .from('transactions')
        .update({ amount: -Math.abs(tx.amount) })
        .eq('id', tx.id);

      if (error) {
        console.error(`❌ 迁移失败 (ID: ${tx.id}): ${error.message}`);
        errorCount++;
      } else {
        successCount++;
      }
    }

    // 6. 显示结果
    console.log('\n✨ 迁移完成！\n');
    console.log('📊 迁移统计:');
    console.log(`   ✅ 成功: ${successCount} 笔`);
    console.log(`   ❌ 失败: ${errorCount} 笔`);
    console.log(`   📝 总计: ${transactions.length} 笔\n`);

    // 7. 验证迁移结果
    console.log('🔍 Step 4: 验证迁移结果...');
    const { data: positiveAmounts, error: verifyError } = await supabase
      .from('transactions')
      .select('id, amount, category_id')
      .in('category_id', expenseCategoryIds)
      .gt('amount', 0);

    if (verifyError) {
      console.warn(`⚠️  验证失败: ${verifyError.message}`);
    } else if (positiveAmounts && positiveAmounts.length > 0) {
      console.warn(`⚠️  警告: 仍有 ${positiveAmounts.length} 笔支出交易的金额为正数！`);
    } else {
      console.log('✅ 验证通过：所有支出交易的金额都已转为负数！\n');
    }

  } catch (error) {
    console.error('\n❌ 迁移失败:', error);
    process.exit(1);
  }
}

// 执行迁移
migrateAmountsToNegative()
  .then(() => {
    console.log('🎉 迁移脚本执行完成！');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 发生错误:', error);
    process.exit(1);
  });
