const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET /api/categories
router.get('/categories', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Categories error:', err.message);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      sort = 'popularity', // 'popularity', 'price_asc', 'price_desc', 'rating'
      limit = 50,
      page = 1
    } = req.query;

    let conditions = ['is_available = 1'];
    let params = [];
    let pIdx = 1;

    if (category && category !== 'All') {
      conditions.push(`category = $${pIdx++}`);
      params.push(category);
    }

    if (search) {
      conditions.push(`(name ILIKE $${pIdx} OR description ILIKE $${pIdx} OR tags ILIKE $${pIdx})`);
      params.push(`%${search}%`);
      pIdx++;
    }

    if (minPrice) {
      conditions.push(`price >= $${pIdx++}`);
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      conditions.push(`price <= $${pIdx++}`);
      params.push(Number(maxPrice));
    }

    let orderClause = 'ORDER BY popularity_score DESC';
    if (sort === 'price_asc') orderClause = 'ORDER BY price ASC';
    else if (sort === 'price_desc') orderClause = 'ORDER BY price DESC';
    else if (sort === 'rating') orderClause = 'ORDER BY rating DESC';

    const whereStr = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const querySql = `SELECT * FROM products ${whereStr} ${orderClause} LIMIT ${parseInt(limit)} OFFSET ${offset}`;
    const result = await db.query(querySql, params);

    const countSql = `SELECT COUNT(*) as total FROM products ${whereStr}`;
    const countRes = await db.query(countSql, params);
    const total = countRes.rows[0]?.total || result.rows.length;

    // Parse specs and tags if JSON strings
    const products = result.rows.map(p => {
      let specs = p.specs;
      let tags = p.tags;
      try { if (typeof specs === 'string') specs = JSON.parse(specs); } catch (e) {}
      try { if (typeof tags === 'string') tags = JSON.parse(tags); } catch (e) {}
      return { ...p, specs, tags };
    });

    res.json({
      products,
      total: Number(total),
      page: Number(page),
      totalPages: Math.ceil(Number(total) / Number(limit))
    });
  } catch (err) {
    console.error('Products error:', err.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = result.rows[0];
    try { if (typeof product.specs === 'string') product.specs = JSON.parse(product.specs); } catch (e) {}
    try { if (typeof product.tags === 'string') product.tags = JSON.parse(product.tags); } catch (e) {}

    // Find complementary cross-sell products
    let crossSellCategory = 'Accessories';
    if (product.category === 'Accessories') crossSellCategory = 'Audio';
    
    const crossSellRes = await db.query(
      'SELECT * FROM products WHERE category = $1 AND id != $2 ORDER BY rating DESC LIMIT 3',
      [crossSellCategory, id]
    );

    const crossSell = crossSellRes.rows.map(p => {
      try { if (typeof p.specs === 'string') p.specs = JSON.parse(p.specs); } catch (e) {}
      return p;
    });

    res.json({
      product,
      crossSell
    });
  } catch (err) {
    console.error('Product details error:', err.message);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

module.exports = router;
