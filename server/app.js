const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 8000;

// 数据文件路径
const TRANSACTIONS_FILE = path.join(__dirname, '..', 'data', 'transactions.json');

// 中间件
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 辅助函数：读取交易数据
async function readTransactions() {
  try {
    const data = await fs.readFile(TRANSACTIONS_FILE, 'utf8');
    const parsed = JSON.parse(data);
    return parsed.transactions || [];
  } catch (error) {
    console.error('读取交易数据失败:', error);
    return [];
  }
}

// 辅助函数：写入交易数据
async function writeTransactions(transactions) {
  try {
    const data = {
      transactions: transactions
    };
    await fs.writeFile(TRANSACTIONS_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('写入交易数据失败:', error);
    return false;
  }
}

// 辅助函数：验证交易数据
function validateTransaction(transaction) {
  const required = ['amount', 'category', 'subCategory', 'merchant', 'date', 'time'];
  
  for (const field of required) {
    if (!transaction[field]) {
      return `缺少必填字段: ${field}`;
    }
  }
  
  if (typeof transaction.amount !== 'number' || transaction.amount <= 0) {
    return '金额必须是正数';
  }
  
  if (!Array.isArray(transaction.tags)) {
    transaction.tags = [];
  }
  
  return null;
}

// API 路由

// 获取所有交易记录
app.get('/transactions', async (req, res) => {
  try {
    const transactions = await readTransactions();
    
    // 支持查询参数过滤
    let filteredTransactions = transactions;
    
    // 按日期范围过滤
    if (req.query.startDate || req.query.endDate) {
      filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date.split('/').reverse().join('-'));
        const start = req.query.startDate ? new Date(req.query.startDate) : new Date('1900-01-01');
        const end = req.query.endDate ? new Date(req.query.endDate) : new Date('2100-12-31');
        return transactionDate >= start && transactionDate <= end;
      });
    }
    
    // 按分类过滤
    if (req.query.category) {
      filteredTransactions = filteredTransactions.filter(t => 
        t.category.toLowerCase().includes(req.query.category.toLowerCase())
      );
    }
    
    // 按商户过滤
    if (req.query.merchant) {
      filteredTransactions = filteredTransactions.filter(t => 
        t.merchant.toLowerCase().includes(req.query.merchant.toLowerCase())
      );
    }
    
    // 排序
    const sortBy = req.query.sortBy || 'date';
    const sortOrder = req.query.sortOrder || 'desc';
    
    filteredTransactions.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'date') {
        aVal = new Date(a.date.split('/').reverse().join('-'));
        bVal = new Date(b.date.split('/').reverse().join('-'));
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    res.json(filteredTransactions);
  } catch (error) {
    console.error('获取交易记录失败:', error);
    res.status(500).json({ error: '获取交易记录失败' });
  }
});

// 获取单个交易记录
app.get('/transactions/:id', async (req, res) => {
  try {
    const transactions = await readTransactions();
    const transaction = transactions.find(t => t.id === req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ error: '交易记录不存在' });
    }
    
    res.json(transaction);
  } catch (error) {
    console.error('获取交易记录失败:', error);
    res.status(500).json({ error: '获取交易记录失败' });
  }
});

// 创建新交易记录
app.post('/transactions', async (req, res) => {
  try {
    const newTransaction = req.body;
    
    // 验证数据
    const validationError = validateTransaction(newTransaction);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    
    // 生成ID
    if (!newTransaction.id) {
      newTransaction.id = `T${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
    }
    
    const transactions = await readTransactions();
    
    // 检查ID是否已存在
    if (transactions.find(t => t.id === newTransaction.id)) {
      return res.status(400).json({ error: '交易ID已存在' });
    }
    
    transactions.push(newTransaction);
    
    const success = await writeTransactions(transactions);
    if (!success) {
      return res.status(500).json({ error: '保存交易记录失败' });
    }
    
    res.status(201).json({
      message: '交易记录创建成功',
      transaction: newTransaction
    });
  } catch (error) {
    console.error('创建交易记录失败:', error);
    res.status(500).json({ error: '创建交易记录失败' });
  }
});

// 更新所有交易记录（批量更新）
app.put('/transactions', async (req, res) => {
  try {
    const { transactions } = req.body;
    
    if (!Array.isArray(transactions)) {
      return res.status(400).json({ error: '无效的交易数据格式' });
    }
    
    // 验证所有交易记录
    for (const transaction of transactions) {
      const validationError = validateTransaction(transaction);
      if (validationError) {
        return res.status(400).json({ 
          error: `交易记录 ${transaction.id || '未知'} 验证失败: ${validationError}` 
        });
      }
    }
    
    const success = await writeTransactions(transactions);
    if (!success) {
      return res.status(500).json({ error: '保存交易记录失败' });
    }
    
    res.json({
      message: '交易数据已成功保存',
      count: transactions.length
    });
  } catch (error) {
    console.error('更新交易记录失败:', error);
    res.status(500).json({ error: '更新交易记录失败' });
  }
});

// 更新单个交易记录
app.put('/transactions/:id', async (req, res) => {
  try {
    const transactions = await readTransactions();
    const index = transactions.findIndex(t => t.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: '交易记录不存在' });
    }
    
    const updatedTransaction = { ...transactions[index], ...req.body, id: req.params.id };
    
    // 验证数据
    const validationError = validateTransaction(updatedTransaction);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    
    transactions[index] = updatedTransaction;
    
    const success = await writeTransactions(transactions);
    if (!success) {
      return res.status(500).json({ error: '保存交易记录失败' });
    }
    
    res.json({
      message: '交易记录更新成功',
      transaction: updatedTransaction
    });
  } catch (error) {
    console.error('更新交易记录失败:', error);
    res.status(500).json({ error: '更新交易记录失败' });
  }
});

// 删除交易记录
app.delete('/transactions/:id', async (req, res) => {
  try {
    const transactions = await readTransactions();
    const index = transactions.findIndex(t => t.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: '交易记录不存在' });
    }
    
    const deletedTransaction = transactions.splice(index, 1)[0];
    
    const success = await writeTransactions(transactions);
    if (!success) {
      return res.status(500).json({ error: '保存交易记录失败' });
    }
    
    res.json({
      message: '交易记录删除成功',
      transaction: deletedTransaction
    });
  } catch (error) {
    console.error('删除交易记录失败:', error);
    res.status(500).json({ error: '删除交易记录失败' });
  }
});

// 获取统计信息
app.get('/transactions/stats/summary', async (req, res) => {
  try {
    const transactions = await readTransactions();
    
    const stats = {
      totalTransactions: transactions.length,
      totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
      categories: {},
      merchants: {},
      monthlyStats: {}
    };
    
    transactions.forEach(t => {
      // 分类统计
      if (!stats.categories[t.category]) {
        stats.categories[t.category] = { count: 0, amount: 0 };
      }
      stats.categories[t.category].count++;
      stats.categories[t.category].amount += t.amount;
      
      // 商户统计
      if (!stats.merchants[t.merchant]) {
        stats.merchants[t.merchant] = { count: 0, amount: 0 };
      }
      stats.merchants[t.merchant].count++;
      stats.merchants[t.merchant].amount += t.amount;
      
      // 月度统计
      const monthKey = t.date.substring(0, 5); // YY/MM
      if (!stats.monthlyStats[monthKey]) {
        stats.monthlyStats[monthKey] = { count: 0, amount: 0 };
      }
      stats.monthlyStats[monthKey].count++;
      stats.monthlyStats[monthKey].amount += t.amount;
    });
    
    res.json(stats);
  } catch (error) {
    console.error('获取统计信息失败:', error);
    res.status(500).json({ error: '获取统计信息失败' });
  }
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 EasyAccounting 后端服务器已启动`);
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`📊 API文档:`);
  console.log(`   GET    /transactions        - 获取所有交易记录`);
  console.log(`   GET    /transactions/:id    - 获取单个交易记录`);
  console.log(`   POST   /transactions        - 创建新交易记录`);
  console.log(`   PUT    /transactions        - 批量更新交易记录`);
  console.log(`   PUT    /transactions/:id    - 更新单个交易记录`);
  console.log(`   DELETE /transactions/:id    - 删除交易记录`);
  console.log(`   GET    /transactions/stats/summary - 获取统计信息`);
  console.log(`   GET    /health              - 健康检查`);
  console.log(`\n✅ 服务器运行正常，等待请求...\n`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ 端口 ${PORT} 已被占用，请检查是否有其他服务在运行`);
    console.error('可以尝试以下解决方案:');
    console.error(`1. 查找占用进程: lsof -i :${PORT}`);
    console.error('2. 终止占用进程: kill -9 <PID>');
    console.error('3. 或修改 PORT 环境变量使用其他端口');
  } else {
    console.error('❌ 服务器启动失败:', err);
  }
  process.exit(1);
});

module.exports = app;