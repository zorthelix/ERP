// Workshop Index design: the overview pairs a document-like masthead with narrow metrics, an operational alert rail, and clean charted records.

import {
  AlertTriangle,
  ArrowRight,
  PackagePlus,
  RefreshCw,
} from 'lucide-react';

import { useEffect, useState } from 'react';

import {
  Area,
  AreaChart,
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

export default function Dashboard() {
  const [inventory, setInventory] = useState(null);
  const [sales, setSales] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError('');

    try {
      const [inv, sal] = await Promise.all([
        api.get('/reports/inventory'),
        api.get('/reports/sales'),
      ]);

      setInventory(inv.data);
      setSales(sal.data);
    } catch (err) {
      setError(messageFrom(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const lowStock =
    inventory?.items?.filter(
      (item) => item.is_low_stock
    ) || [];

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">
            OVERVIEW / 01
          </p>

          <h1>
            Today’s <em>register.</em>
          </h1>

          <p className="subhead">
            A clear view of stock movement and sales activity.
          </p>
        </div>

        <div className="head-actions">
          <button
            className="icon-button"
            onClick={load}
            aria-label="Refresh overview"
          >
            <RefreshCw size={17} />
          </button>

          <a
            className="button"
            href="#/new-sale"
          >
            <PackagePlus size={17} />
            Record sale
          </a>
        </div>
      </header>

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      {loading ? (
        <div className="loading-sheet">
          Loading operational record…
        </div>
      ) : (
        <>
          <section className="metric-row">
            <MetricCard
              label="REVENUE / 30 DAYS"
              value={money(
                sales?.summary?.revenue
              )}
              note={`${sales?.summary?.sale_count || 0} recorded sales`}
              tone="cobalt"
            />

            <MetricCard
              label="INVENTORY VALUE"
              value={money(
                inventory?.summary?.inventory_value
              )}
              note={`${inventory?.summary?.units_on_hand || 0} units on hand`}
            />

            <MetricCard
              label="LOW STOCK"
              value={
                inventory?.summary?.low_stock_count || 0
              }
              note="records need review"
              tone={
                lowStock.length
                  ? 'warning'
                  : 'ink'
              }
            />
          </section>

          <section className="overview-grid">
            <article className="sheet chart-sheet">
              <div className="sheet-title">
                <div>
                  <span className="index-dot" />

                  <p className="eyebrow">
                    REVENUE RUNRATE
                  </p>

                  <h2>
                    Sales, day by day
                  </h2>
                </div>

                <span className="range-label">
                  {sales?.range?.from} —{' '}
                  {sales?.range?.to}
                </span>
              </div>

              <div className="chart-wrap">
                {sales?.dailySales?.length ? (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <AreaChart
                      data={sales.dailySales}
                      margin={{
                        top: 12,
                        right: 6,
                        left: -20,
                        bottom: 0,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id="revenue"
                          x1="0"
                          x2="0"
                          y1="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#2453ff"
                            stopOpacity=".26"
                          />

                          <stop
                            offset="100%"
                            stopColor="#2453ff"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>

                      <XAxis
                        dataKey="day"
                        tick={{
                          fontSize: 11,
                          fill: '#788093',
                        }}
                        tickLine={false}
                        axisLine={false}
                      />

                      <YAxis
                        tickFormatter={(v) =>
                          `रु${v}`
                        }
                        tick={{
                          fontSize: 11,
                          fill: '#788093',
                        }}
                        tickLine={false}
                        axisLine={false}
                      />

                      <Tooltip
                        formatter={(v) =>
                          money(v)
                        }
                        labelStyle={{
                          color: '#162237',
                        }}
                      />

                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#2453ff"
                        fill="url(#revenue)"
                        strokeWidth={2.5}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="empty-inline">
                    Your daily revenue line appears
                    after the first recorded sale.
                  </p>
                )}
              </div>
            </article>

            <aside className="alert-rail">
              <div className="rail-heading">
                <AlertTriangle size={18} />
                <span>STOCK WATCH</span>
              </div>

              {lowStock.length ? (
                lowStock
                  .slice(0, 4)
                  .map((item) => (
                    <div
                      className="low-row"
                      key={item.id}
                    >
                      <span>
                        <b>{item.name}</b>
                        <small>{item.sku}</small>
                      </span>

                      <strong>
                        {item.quantity}
                        <small>
                          {' '}
                          / {item.reorder_level}
                        </small>
                      </strong>
                    </div>
                  ))
              ) : (
                <div className="rail-empty">
                  Everything is above its reorder level.
                </div>
              )}

              <a
                href="#/inventory"
                className="rail-link"
              >
                Review inventory
                <ArrowRight size={15} />
              </a>
            </aside>
          </section>

          <section className="sheet product-glance">
            <div className="sheet-title">
              <div>
                <span className="index-dot" />

                <p className="eyebrow">
                  INVENTORY REGISTER
                </p>

                <h2>
                  Stock, at a glance
                </h2>
              </div>

              <a href="#/inventory">
                Open inventory
                <ArrowRight size={15} />
              </a>
            </div>

            <div className="mini-table">
              <div className="mini-head">
                <span>Product</span>
                <span>On hand</span>
                <span>Value</span>
                <span>State</span>
              </div>

              {inventory?.items
                ?.slice(0, 5)
                .map((item) => (
                  <div
                    className="mini-row"
                    key={item.id}
                  >
                    <span>
                      <b>{item.name}</b>
                      <small>{item.sku}</small>
                    </span>

                    <span>
                      {item.quantity}
                    </span>

                    <span>
                      {money(item.stock_value)}
                    </span>

                    <span>
                      <i
                        className={
                          item.is_low_stock
                            ? 'status-dot low'
                            : 'status-dot'
                        }
                      />

                      {item.is_low_stock
                        ? 'Reorder'
                        : 'Ready'}
                    </span>
                  </div>
                ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}