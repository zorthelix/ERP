import pool from '../config/database.js';

const productSelect = `
  SELECT
    p.id,
    p.sku,
    p.name,
    p.description,
    p.unit_price,
    p.is_active,
    p.created_at,
    p.updated_at,
    i.quantity,
    i.reorder_level,
    i.updated_at AS inventory_updated_at
  FROM products p
  JOIN inventory i ON i.product_id = p.id
  WHERE p.owner_id = $1
`;

async function findProduct(id, userId) {
  const result = await pool.query(
    `${productSelect} AND p.id = $2`,
    [userId, id]
  );

  return result.rows[0];
}

export async function createProduct(req, res, next) {
  const client = await pool.connect();

  try {
    const {
      sku,
      name,
      description = null,
      unitPrice,
      quantity,
      reorderLevel = 0
    } = req.body;

    await client.query('BEGIN');

    const product = await client.query(
      `
        INSERT INTO products (
          owner_id,
          sku,
          name,
          description,
          unit_price
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `,
      [
        req.user.sub,
        sku.trim().toUpperCase(),
        name.trim(),
        description?.trim() || null,
        Number(unitPrice)
      ]
    );

    await client.query(
      `
        INSERT INTO inventory (
          product_id,
          quantity,
          reorder_level
        )
        VALUES ($1, $2, $3)
      `,
      [
        product.rows[0].id,
        Number(quantity),
        Number(reorderLevel)
      ]
    );

    await client.query('COMMIT');

    return res.status(201).json({
      product: await findProduct(
        product.rows[0].id,
        req.user.sub
      )
    });
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
}

export async function getProducts(req, res, next) {
  try {
    const { search = '', active } = req.query;

    const values = [req.user.sub];
    let sql = productSelect;

    if (search) {
      values.push(`%${search}%`);

      sql += `
        AND (
          p.name ILIKE $${values.length}
          OR p.sku ILIKE $${values.length}
        )
      `;
    }

    if (active === 'true' || active === 'false') {
      values.push(active === 'true');

      sql += `
        AND p.is_active = $${values.length}
      `;
    }

    const result = await pool.query(
      `${sql} ORDER BY p.name ASC`,
      values
    );

    return res.json({
      products: result.rows
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateProduct(req, res, next) {
  const client = await pool.connect();

  try {
    const id = Number(req.params.id);

    const {
      sku,
      name,
      description,
      unitPrice,
      quantity,
      reorderLevel,
      isActive
    } = req.body;

    await client.query('BEGIN');

    const fields = [];
    const values = [];

    const addField = (column, value) => {
      values.push(value);
      fields.push(`${column} = $${values.length}`);
    };

    if (sku !== undefined) {
      addField('sku', sku.trim().toUpperCase());
    }

    if (name !== undefined) {
      addField('name', name.trim());
    }

    if (description !== undefined) {
      addField(
        'description',
        description?.trim() || null
      );
    }

    if (unitPrice !== undefined) {
      addField('unit_price', Number(unitPrice));
    }

    if (isActive !== undefined) {
      addField('is_active', Boolean(isActive));
    }

    if (fields.length) {
      values.push(id, req.user.sub);

      const updated = await client.query(
        `
          UPDATE products
          SET ${fields.join(', ')},
              updated_at = NOW()
          WHERE id = $${values.length - 1}
            AND owner_id = $${values.length}
          RETURNING id
        `,
        values
      );

      if (!updated.rowCount) {
        const error = new Error('Product not found.');
        error.status = 404;
        error.expose = true;
        throw error;
      }
    } else if (!(await findProduct(id, req.user.sub))) {
      const error = new Error('Product not found.');
      error.status = 404;
      error.expose = true;
      throw error;
    }

    if (
      quantity !== undefined ||
      reorderLevel !== undefined
    ) {
      const inventoryFields = [];
      const inventoryValues = [];

      if (quantity !== undefined) {
        inventoryValues.push(Number(quantity));

        inventoryFields.push(
          `quantity = $${inventoryValues.length}`
        );
      }

      if (reorderLevel !== undefined) {
        inventoryValues.push(Number(reorderLevel));

        inventoryFields.push(
          `reorder_level = $${inventoryValues.length}`
        );
      }

      inventoryValues.push(id);

      await client.query(
        `
          UPDATE inventory
          SET ${inventoryFields.join(', ')},
              updated_at = NOW()
          WHERE product_id = $${inventoryValues.length}
        `,
        inventoryValues
      );
    }

    await client.query('COMMIT');

    return res.json({
      product: await findProduct(id, req.user.sub)
    });
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const result = await pool.query(
      `
        DELETE FROM products
        WHERE id = $1
          AND owner_id = $2
        RETURNING id
      `,
      [
        req.params.id,
        req.user.sub
      ]
    );

    if (!result.rowCount) {
      return res
        .status(404)
        .json({ error: 'Product not found.' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}