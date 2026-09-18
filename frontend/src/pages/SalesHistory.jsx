// Workshop Index design: sales history uses a chronological receipt register with compact total markers instead of undifferentiated cards.

import {
  RefreshCw,
  ReceiptText,
} from 'lucide-react';

import {
  useEffect,
  useState,
} from 'react';

import api, { messageFrom } from '../services/api.js';

const money = (value) =>
  `रु${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0))}`;

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] =
    useState(true);

  const load = async () => {
    setLoading(true);

    try {
      const { data } = await api.get('/sales');

      setSales(data.sales);
      setError('');
    } catch (err) {
      setError(messageFrom(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">
            SALES HISTORY / 04
          </p>

          <h1>
            Recorded <em>sales.</em>
          </h1>

          <p className="subhead">
            Every committed transaction, in reverse
            chronological order.
          </p>
        </div>

        <button
          className="icon-button"
          onClick={load}
          aria-label="Refresh sales history"
        >
          <RefreshCw size={17} />
        </button>
      </header>

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      <section className="sheet history-sheet">
        <div className="history-intro">
          <ReceiptText size={20} />

          <span>
            TRANSACTION REGISTER
          </span>

          <small>
            {sales.length} entries
          </small>
        </div>

        {loading ? (
          <div className="loading-sheet">
            Reading transaction history…
          </div>
        ) : sales.length ? (
          <div className="sale-history-list">
            {sales.map((sale) => (
              <article
                className="history-row"
                key={sale.id}
              >
                <span className="sale-date">
                  <b>
                    {new Date(
                      sale.created_at
                    ).toLocaleDateString(
                      undefined,
                      {
                        month: 'short',
                        day: '2-digit',
                      }
                    )}
                  </b>

                  <small>
                    {new Date(
                      sale.created_at
                    ).toLocaleTimeString(
                      [],
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </small>
                </span>

                <span className="sale-number">
                  <code>
                    {sale.sale_number}
                  </code>

                  <small>
                    {sale.item_count} line item
                    {sale.item_count === 1
                      ? ''
                      : 's'}{' '}
                    · {sale.payment_method}
                  </small>
                </span>

                <span className="sale-note">
                  {sale.notes ||
                    'No register note'}
                </span>

                <strong>
                  {money(
                    sale.total_amount
                  )}
                </strong>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-table">
            No sales have been recorded yet.
            Use{' '}
            <a href="#/new-sale">
              Record sale
            </a>{' '}
            to create the first transaction.
          </div>
        )}
      </section>
    </div>
  );
}