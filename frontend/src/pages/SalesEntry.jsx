// Workshop Index design: the sale entry screen is a two-part counter sheet, separating product selection from the committed transaction total.

import {
  Check,
  Search,
  ShoppingBag,
} from 'lucide-react';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import SaleLine from '../components/SaleLine.jsx';
import api, { messageFrom } from '../services/api.js';

export default function SalesEntry() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [query, setQuery] = useState('');
  const [taxRate, setTaxRate] = useState('0');
  const [paymentMethod, setPaymentMethod] =
    useState('card');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get('/products', {
        params: { active: true },
      });

      setProducts(
        data.products.filter(
          (p) => p.quantity > 0
        )
      );
    } catch (err) {
      setError(messageFrom(err));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const shownProducts = useMemo(
    () =>
      products.filter((p) =>
        `${p.name} ${p.sku}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [products, query]
  );

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.unitPrice * item.quantity,
    0
  );

  const tax =
    subtotal *
    (Number(taxRate || 0) / 100);

  const total = subtotal + tax;

  const add = (product) =>
    setCart((old) => {
      const found = old.find(
        (item) =>
          item.productId === product.id
      );

      if (found) {
        return old.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + 1,
                  item.quantityAvailable
                ),
              }
            : item
        );
      }

      return [
        ...old,
        {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          unitPrice: Number(
            product.unit_price
          ),
          quantity: 1,
          quantityAvailable: product.quantity,
        },
      ];
    });

  const changeQuantity = (
    id,
    quantity
  ) =>
    setCart((old) =>
      quantity < 1
        ? old.filter(
            (item) =>
              item.productId !== id
          )
        : old.map((item) =>
            item.productId === id
              ? {
                  ...item,
                  quantity: Math.min(
                    quantity,
                    item.quantityAvailable
                  ),
                }
              : item
          )
    );

  const record = async () => {
    if (!cart.length) {
      return setError(
        'Add at least one product before recording a sale.'
      );
    }

    setBusy(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await api.post(
        '/sales',
        {
          items: cart.map(
            ({
              productId,
              quantity,
            }) => ({
              productId,
              quantity,
            })
          ),
          taxRate: Number(
            taxRate || 0
          ),
          paymentMethod,
          notes,
        }
      );

      setSuccess(
        `Sale ${data.sale.sale_number} recorded. Inventory has been updated.`
      );

      setCart([]);
      setNotes('');

      await load();
    } catch (err) {
      setError(messageFrom(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">
            RECORD SALE / 03
          </p>

          <h1>
            Counter <em>entry.</em>
          </h1>

          <p className="subhead">
            Build the sale, confirm the total,
            and update stock in one transaction.
          </p>
        </div>
      </header>

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      {success && (
        <p className="success-note">
          <Check size={16} />
          {success}
        </p>
      )}

      <section className="sale-entry-grid">
        <article className="sheet product-picker">
          <div className="sheet-title">
            <div>
              <span className="index-dot" />

              <p className="eyebrow">
                AVAILABLE STOCK
              </p>

              <h2>
                Add products
              </h2>
            </div>
          </div>

          <div className="search-box picker-search">
            <Search size={17} />

            <input
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              placeholder="Find by product or Code"
            />
          </div>

          <div className="pick-list">
            {shownProducts.map(
              (product) => (
                <button
                  className="pick-row"
                  onClick={() =>
                    add(product)
                  }
                  key={product.id}
                >
                  <span>
                    <b>
                      {product.name}
                    </b>

                    <small>
                      {product.sku} ·{' '}
                      {product.quantity}{' '}
                      on hand
                    </small>
                  </span>

                  <strong>
                    रु
                    {Number(
                      product.unit_price
                    ).toFixed(2)}
                  </strong>
                </button>
              )
            )}
          </div>
        </article>

        <aside className="sale-register">
          <div className="register-head">
            <ShoppingBag size={19} />
            <span>CURRENT SALE</span>
          </div>

          <div className="cart-lines">
            {cart.length ? (
              cart.map((item) => (
                <SaleLine
                  key={item.productId}
                  item={item}
                  onChangeQuantity={
                    changeQuantity
                  }
                  onRemove={(id) =>
                    setCart((old) =>
                      old.filter(
                        (line) =>
                          line.productId !==
                          id
                      )
                    )
                  }
                />
              ))
            ) : (
              <div className="cart-empty">
                Select products from the stock
                register to begin this sale.
              </div>
            )}
          </div>

          <div className="register-fields">
            <label>
              Tax rate

              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={taxRate}
                onChange={(e) =>
                  setTaxRate(
                    e.target.value
                  )
                }
              />

              <span>%</span>
            </label>

            <label>
              Payment

              <select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              >
                <option value="card">
                  Card
                </option>

                <option value="cash">
                  Cash
                </option>

                <option value="transfer">
                  Transfer
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </label>

            <label className="full">
              Sale note

              <textarea
                value={notes}
                onChange={(e) =>
                  setNotes(
                    e.target.value
                  )
                }
                placeholder="Optional register note"
                rows="2"
              />
            </label>
          </div>

          <div className="sale-total">
            <span>
              <small>Subtotal</small>
              <b>
                रु{subtotal.toFixed(2)}
              </b>
            </span>

            <span>
              <small>Tax</small>
              <b>
                रु{tax.toFixed(2)}
              </b>
            </span>

            <strong>
              <small>TOTAL</small>
              रु{total.toFixed(2)}
            </strong>
          </div>

          <button
            className="button sale-submit"
            disabled={
              busy || !cart.length
            }
            onClick={record}
          >
            {busy
              ? 'Recording…'
              : 'Record sale — update inventory'}
          </button>
        </aside>
      </section>
    </div>
  );
}