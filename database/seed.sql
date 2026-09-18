-- Sample data for local development. The sample account password is "password".
-- Run schema.sql first, then: psql "$DATABASE_URL" -f database/seed.sql

INSERT INTO users (full_name, email, password_hash)
VALUES ('Morgan Avery', 'morgan@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy')
ON CONFLICT (email) DO NOTHING;

WITH owner_row AS (SELECT id FROM users WHERE email = 'morgan@example.com'),
source_products AS (SELECT * FROM (VALUES
  ('MUG-COBALT', 'Cobalt Stoneware Mug', 'Hand-finished 12 oz stoneware mug.', 18.50::numeric),
  ('NOTE-GRID', 'Grid Notebook', 'A5 lay-flat notebook with dot grid paper.', 12.00::numeric),
  ('TOTE-CANVAS', 'Canvas Market Tote', 'Heavyweight cotton tote with reinforced handles.', 24.00::numeric),
  ('CANDLE-CEDAR', 'Cedar Desk Candle', 'Small-batch cedar and bergamot soy candle.', 22.00::numeric),
  ('PEN-GRAPHITE', 'Graphite Gel Pen', 'Fine-point archival black gel pen.', 4.50::numeric)
) AS values_(sku, name, description, unit_price)),
inserted_products AS (
  INSERT INTO products (owner_id, sku, name, description, unit_price)
  SELECT o.id, s.sku, s.name, s.description, s.unit_price FROM owner_row o CROSS JOIN source_products s
  ON CONFLICT (owner_id, sku) DO NOTHING RETURNING id, sku
), all_products AS (SELECT p.id, p.sku FROM products p JOIN owner_row o ON p.owner_id = o.id)
INSERT INTO inventory (product_id, quantity, reorder_level)
SELECT ap.id, CASE ap.sku WHEN 'MUG-COBALT' THEN 18 WHEN 'NOTE-GRID' THEN 42 WHEN 'TOTE-CANVAS' THEN 7 WHEN 'CANDLE-CEDAR' THEN 4 ELSE 65 END,
  CASE ap.sku WHEN 'MUG-COBALT' THEN 6 WHEN 'NOTE-GRID' THEN 12 WHEN 'TOTE-CANVAS' THEN 8 WHEN 'CANDLE-CEDAR' THEN 6 ELSE 20 END
FROM all_products ap ON CONFLICT (product_id) DO NOTHING;

WITH owner_row AS (SELECT id FROM users WHERE email = 'morgan@example.com'),
new_sale AS (
  INSERT INTO sales (owner_id, sale_number, subtotal, tax_amount, total_amount, payment_method, notes, created_at)
  SELECT id, 'SALE-SEED-0001', 27.50, 2.20, 29.70, 'card', 'Sample counter sale', NOW() - INTERVAL '2 days' FROM owner_row
  ON CONFLICT (sale_number) DO NOTHING RETURNING id
)
INSERT INTO sale_items (sale_id, product_id, product_name, sku, unit_price, quantity, line_total)
SELECT ns.id, p.id, p.name, p.sku, p.unit_price, CASE p.sku WHEN 'MUG-COBALT' THEN 1 ELSE 2 END,
  CASE p.sku WHEN 'MUG-COBALT' THEN p.unit_price ELSE p.unit_price * 2 END
FROM new_sale ns JOIN products p ON p.sku IN ('MUG-COBALT', 'PEN-GRAPHITE');

