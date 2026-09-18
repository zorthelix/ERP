import pool from '../config/database.js';

export async function inventoryReport(req, res, next) {
  try {
    const [items, summary] = await Promise.all([
      pool.query(`SELECT p.id, p.sku, p.name, p.unit_price, p.is_active, i.quantity, i.reorder_level, (i.quantity * p.unit_price)::numeric(12,2) AS stock_value, (i.quantity <= i.reorder_level) AS is_low_stock FROM products p JOIN inventory i ON i.product_id = p.id WHERE p.owner_id = $1 ORDER BY is_low_stock DESC, p.name ASC`, [req.user.sub]),
      pool.query(`SELECT COUNT(*)::int AS product_count, COALESCE(SUM(i.quantity), 0)::int AS units_on_hand, COALESCE(SUM(i.quantity * p.unit_price), 0)::numeric(12,2) AS inventory_value, COUNT(*) FILTER (WHERE i.quantity <= i.reorder_level)::int AS low_stock_count FROM products p JOIN inventory i ON i.product_id = p.id WHERE p.owner_id = $1`, [req.user.sub])
    ]);
    return res.json({ summary: summary.rows[0], items: items.rows });
  } catch (error) { return next(error); }
}

export async function salesReport(req, res, next) {
  try {
    const from = req.query.from || new Date(Date.now() - 29 * 86_400_000).toISOString().slice(0, 10); const to = req.query.to || new Date().toISOString().slice(0, 10); const parameters = [req.user.sub, from, to]; const range = `WHERE s.owner_id = $1 AND s.created_at >= $2::date AND s.created_at < ($3::date + INTERVAL '1 day')`;
    const [summary, dailySales, topProducts] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS sale_count, COALESCE(SUM(s.total_amount), 0)::numeric(12,2) AS revenue, COALESCE(AVG(s.total_amount), 0)::numeric(12,2) AS average_sale FROM sales s ${range}`, parameters),
      pool.query(`SELECT TO_CHAR(s.created_at::date, 'YYYY-MM-DD') AS day, COUNT(*)::int AS sale_count, COALESCE(SUM(s.total_amount), 0)::numeric(12,2) AS revenue FROM sales s ${range} GROUP BY s.created_at::date ORDER BY s.created_at::date`, parameters),
      pool.query(`SELECT si.product_id, si.product_name, si.sku, SUM(si.quantity)::int AS units_sold, SUM(si.line_total)::numeric(12,2) AS revenue FROM sale_items si JOIN sales s ON s.id = si.sale_id ${range} GROUP BY si.product_id, si.product_name, si.sku ORDER BY units_sold DESC, revenue DESC LIMIT 8`, parameters)
    ]);
    return res.json({ range: { from, to }, summary: summary.rows[0], dailySales: dailySales.rows, topProducts: topProducts.rows });
  } catch (error) { return next(error); }
}

