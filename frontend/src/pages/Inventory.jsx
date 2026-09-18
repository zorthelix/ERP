// Workshop Index design: inventory is treated as an editable stock ledger, with controls hidden behind a deliberate side-sheet editor rather than inline clutter.

import {
  Edit3,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';

import { useEffect, useState } from 'react';

import ProductForm from '../components/ProductForm.jsx';
import api, { messageFrom } from '../services/api.js';

const money = (value) =>
  `रु${Number(value || 0).toFixed(2)}`;

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async (term = search) => {
    setLoading(true);

    try {
      const { data } = await api.get('/products', {
        params: term ? { search: term } : {},
      });

      setProducts(data.products);
      setError('');
    } catch (err) {
      setError(messageFrom(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load('');
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    load(search);
  };

  const save = async (values) => {
    setBusy(true);

    try {
      if (editing) {
        await api.put(
          `/products/${editing.id}`,
          values
        );
      } else {
        await api.post('/products', values);
      }

      setEditorOpen(false);
      setEditing(null);

      await load();
    } catch (err) {
      setError(messageFrom(err));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (product) => {
    if (
      !window.confirm(
        `Delete ${product.name}? Products referenced by sales cannot be deleted.`
      )
    ) {
      return;
    }

    try {
      await api.delete(`/products/${product.id}`);
      await load();
    } catch (err) {
      setError(messageFrom(err));
    }
  };

  const openNew = () => {
    setEditing(null);
    setEditorOpen(true);
  };

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">
            INVENTORY / 02
          </p>

          <h1>
            Stock <em>ledger.</em>
          </h1>

          <p className="subhead">
            Products, quantities, and reorder points
            in one working register.
          </p>
        </div>

        <button
          className="button"
          onClick={openNew}
        >
          <Plus size={17} />
          Add product
        </button>
      </header>

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      <section className="sheet inventory-sheet">
        <div className="inventory-tools">
          <form
            onSubmit={submitSearch}
            className="search-box"
          >
            <Search size={17} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search product or Code"
            />

            <button aria-label="Search">
              Search
            </button>
          </form>

          <p>
            {products.length} records shown
          </p>
        </div>

        <div className="ledger-table">
          <div className="ledger-head">
            <span>Product</span>
            <span>Code</span>
            <span>On hand</span>
            <span>Reorder at</span>
            <span>Unit price</span>
            <span>State</span>
            <span />
          </div>

          {loading ? (
            <div className="loading-sheet">
              Reading inventory…
            </div>
          ) : products.length ? (
            products.map((product) => (
              <div
                className="ledger-row"
                key={product.id}
              >
                <span>
                  <b>{product.name}</b>

                  <small>
                    {product.description ||
                      'No product note'}
                  </small>
                </span>

                <code>{product.sku}</code>

                <strong
                  className={
                    product.quantity <=
                    product.reorder_level
                      ? 'qty-low'
                      : ''
                  }
                >
                  {product.quantity}
                </strong>

                <span>
                  {product.reorder_level}
                </span>

                <span>
                  {money(product.unit_price)}
                </span>

                <span>
                  <i
                    className={
                      product.quantity <=
                      product.reorder_level
                        ? 'status-dot low'
                        : 'status-dot'
                    }
                  />

                  {product.quantity <=
                  product.reorder_level
                    ? 'Reorder'
                    : product.is_active
                      ? 'Ready'
                      : 'Paused'}
                </span>

                <span className="row-actions">
                  <button
                    onClick={() => {
                      setEditing(product);
                      setEditorOpen(true);
                    }}
                    aria-label={`Edit ${product.name}`}
                  >
                    <Edit3 size={16} />
                  </button>

                  <button
                    onClick={() => remove(product)}
                    aria-label={`Delete ${product.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </span>
              </div>
            ))
          ) : (
            <div className="empty-table">
              No products match this register query.
            </div>
          )}
        </div>
      </section>

      {editorOpen && (
        <div className="drawer-layer">
          <button
            className="drawer-scrim"
            onClick={() =>
              setEditorOpen(false)
            }
            aria-label="Close editor"
          />

          <aside className="product-drawer">
            <ProductForm
              product={editing}
              onSave={save}
              onCancel={() =>
                setEditorOpen(false)
              }
              busy={busy}
            />
          </aside>
        </div>
      )}
    </div>
  );
}