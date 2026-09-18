// Workshop Index design: reports treat charts as analytical fields within a printed register, supported by clearly labeled decision metrics.

import {
  BarChart3,
  RefreshCw,
} from 'lucide-react';

import { useEffect, useState } from 'react';

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import MetricCard from '../components/MetricCard.jsx';
import api, { messageFrom } from '../services/api.js';

const money = (value) =>
  `रु${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0))}`;

export default function Reports() {
  const [inventory, setInventory] = useState(null);
  const [sales, setSales] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    try {
      const [inv, sal] = await Promise.all([
        api.get('/reports/inventory'),
        api.get('/reports/sales'),
      ]);

      setInventory(inv.data);
      setSales(sal.data);
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
            REPORTS / 05
          </p>

          <h1>
            Decisions, <em>indexed.</em>
          </h1>

          <p className="subhead">
            Revenue, product velocity, and stock
            exposure in a clear operating report.
          </p>
        </div>

        <button
          className="icon-button"
          onClick={load}
          aria-label="Refresh reports"
        >
          <RefreshCw size={17} />
        </button>
      </header>

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      {loading ? (
        <div className="loading-sheet">
          Assembling reporting record…
        </div>
      ) : (
        <>
          <section className="metric-row">
            <MetricCard
              label="SALES / REPORT RANGE"
              value={
                sales?.summary?.sale_count || 0
              }
              note={`${sales?.range?.from} — ${sales?.range?.to}`}
              tone="cobalt"
            />

            <MetricCard
              label="AVERAGE SALE"
              value={money(
                sales?.summary?.average_sale
              )}
              note="transaction total"
            />

            <MetricCard
              label="LOW STOCK EXPOSURE"
              value={
                inventory?.summary
                  ?.low_stock_count || 0
              }
              note="product records"
              tone={
                inventory?.summary
                  ?.low_stock_count
                  ? 'warning'
                  : 'ink'
              }
            />
          </section>

          <section className="report-grid">
            <article className="sheet top-product-sheet">
              <div className="sheet-title">
                <div>
                  <span className="index-dot" />

                  <p className="eyebrow">
                    PRODUCT VELOCITY
                  </p>

                  <h2>
                    Top products by units sold
                  </h2>
                </div>

                <BarChart3 size={21} />
              </div>

              <div className="bar-chart-wrap">
                {sales?.topProducts?.length ? (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={sales.topProducts}
                      layout="vertical"
                      margin={{
                        top: 4,
                        right: 20,
                        left: 4,
                        bottom: 0,
                      }}
                    >
                      <XAxis
                        type="number"
                        hide
                      />

                      <YAxis
                        dataKey="product_name"
                        type="category"
                        width={120}
                        tick={{
                          fontSize: 11,
                          fill: '#394155',
                        }}
                        tickLine={false}
                        axisLine={false}
                      />

                      <Tooltip
                        formatter={(
                          value,
                          name
                        ) => [
                          name === 'units_sold'
                            ? `${value} units`
                            : money(value),
                          name === 'units_sold'
                            ? 'Units'
                            : 'Revenue',
                        ]}
                      />

                      <Bar
                        dataKey="units_sold"
                        radius={[
                          0,
                          2,
                          2,
                          0,
                        ]}
                      >
                        {sales.topProducts.map(
                          (_, index) => (
                            <Cell
                              key={index}
                              fill={
                                index === 0
                                  ? '#2453ff'
                                  : '#9db1ff'
                              }
                            />
                          )
                        )}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="empty-inline">
                    Top product activity will appear
                    after sales are recorded.
                  </p>
                )}
              </div>
            </article>

            <article className="sheet stock-report">
              <div className="sheet-title">
                <div>
                  <span className="index-dot" />

                  <p className="eyebrow">
                    LOW-STOCK REVIEW
                  </p>

                  <h2>
                    Reorder candidates
                  </h2>
                </div>

                <span className="range-label">
                  {inventory?.summary
                    ?.low_stock_count || 0}{' '}
                  flagged
                </span>
              </div>

              <div className="stock-report-list">
                {inventory?.items?.filter(
                  (item) => item.is_low_stock
                ).length ? (
                  inventory.items
                    .filter(
                      (item) => item.is_low_stock
                    )
                    .map((item) => (
                      <div
                        className="stock-report-row"
                        key={item.id}
                      >
                        <span>
                          <b>{item.name}</b>

                          <small>
                            {item.sku}
                          </small>
                        </span>

                        <span>
                          <strong>
                            {item.quantity}
                          </strong>{' '}
                          <small>
                            on hand /{' '}
                            {item.reorder_level}{' '}
                            threshold
                          </small>
                        </span>

                        <b>
                          {money(item.stock_value)}
                        </b>
                      </div>
                    ))
                ) : (
                  <div className="empty-inline">
                    No products are below their
                    reorder level.
                  </div>
                )}
              </div>
            </article>
          </section>
        </>
      )}
    </div>
  );
}