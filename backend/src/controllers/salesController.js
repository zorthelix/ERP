import pool from '../config/database.js';

function saleNumber() { const day = new Date().toISOString().slice(0, 10).replaceAll('-', ''); return `SALE-${day}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`; }

export async function createSale(req, res, next) {
  const client = await pool.connect();
  try {
    const { items, taxRate = 0, paymentMethod = 'cash', notes = null } = req.body; await client.query('BEGIN'); let subtotal = 0; const checkedItems = [];
    for (const item of items) {
      const result = await client.query(`SELECT p.id, p.sku, p.name, p.unit_price, p.is_active, i.quantity FROM products p JOIN inventory i ON i.product_id = p.id WHERE p.id = $1 AND p.owner_id = $2 FOR UPDATE`, [item.productId, req.user.sub]);
      const product = result.rows[0]; const quantity = Number(item.quantity);
      if (!product || !product.is_active) { const error = new Error(`Product ${item.productId} is unavailable.`); error.status = 422; error.expose = true; throw error; }
      if (product.quantity < quantity) { const error = new Error(`Insufficient inventory for ${product.name}. Available: ${product.quantity}.`); error.status = 422; error.expose = true; throw error; }
      const unitPrice = Number(product.unit_price); const lineTotal = unitPrice * quantity; subtotal += lineTotal; checkedItems.push({ product, quantity, unitPrice, lineTotal }); await client.query('UPDATE inventory SET quantity = quantity - $1, updated_at = NOW() WHERE product_id = $2', [quantity, product.id]);
    }
    const taxAmount = Number((subtotal * (Number(taxRate) / 100)).toFixed(2)); const totalAmount = Number((subtotal + taxAmount).toFixed(2));
    const insertedSale = await client.query(`INSERT INTO sales (owner_id, sale_number, subtotal, tax_amount, total_amount, payment_method, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [req.user.sub, saleNumber(), subtotal, taxAmount, totalAmount, paymentMethod, notes?.trim() || null]);
    for (const item of checkedItems) await client.query(`INSERT INTO sale_items (sale_id, product_id, product_name, sku, unit_price, quantity, line_total) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [insertedSale.rows[0].id, item.product.id, item.product.name, item.product.sku, item.unitPrice, item.quantity, item.lineTotal]);
    await client.query('COMMIT'); return res.status(201).json({ sale: insertedSale.rows[0] });
  } catch (error) { await client.query('ROLLBACK'); return next(error); } finally { client.release(); }
}

export async function getSales(req, res, next) {
  try { const limit = Math.min(Number(req.query.limit || 50), 200); const result = await pool.query(`SELECT s.*, COUNT(si.id)::int AS item_count FROM sales s LEFT JOIN sale_items si ON si.sale_id = s.id WHERE s.owner_id = $1 GROUP BY s.id ORDER BY s.created_at DESC LIMIT $2`, [req.user.sub, limit]); return res.json({ sales: result.rows }); } catch (error) { return next(error); }
}

