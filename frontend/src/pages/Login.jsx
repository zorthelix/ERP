// Workshop Index design: authentication is an editorial opening sheet, pairing warm physical inventory imagery with direct operations copy.

import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

import api, { messageFrom } from '../services/api.js';

export default function Login({ onAuthenticated }) {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();

    if (!values.email || !values.password) {
      return setError(
        'Enter your email and password.'
      );
    }

    setBusy(true);
    setError('');

    try {
      const { data } = await api.post(
        '/auth/login',
        values
      );

      onAuthenticated(data);
    } catch (err) {
      setError(messageFrom(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-copy">
        <a
          href="#/login"
          className="brand-lockup light"
        >
          <img
            src="D:\projects\6sem\StoreManagerIII\frontend\src\components\image.png"
            alt=""
          />

          <span>
            STORE
            <br />
            MANAGER
          </span>
        </a>

        <div className="auth-pitch">
          <p className="eyebrow">
            RETAIL OPERATIONS / 2026
          </p>

          <span
            className="auth-index-tab"
            aria-hidden="true"
          />

          <h1>
            Count less.
            <br />
            <em>Know more.</em>
          </h1>

          <p>
            One deliberate record for stock, sales,
            and the decisions that keep your shelves
            moving.
          </p>
        </div>

        <footer>
          INDEX COBALT / #2453FF
        </footer>
      </section>

      <section className="auth-form-panel">
        <div className="auth-image">
          <img
            src="/manus-storage/store-manager-login-editorial_35146a7c.png"
            alt="Cobalt shelf divider and inventory materials"
          />
        </div>

        <form
          onSubmit={submit}
          className="auth-form"
        >
          <p className="eyebrow">
            SIGN IN / 01
          </p>

          <h2>
            Open your stock register
          </h2>

          <div className="document-band">
            <span>REGISTER ENTRY</span>
            <span>SECURE SESSION</span>
          </div>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <label>
            Work email

            <input
              value={values.email}
              onChange={(e) =>
                setValues({
                  ...values,
                  email: e.target.value,
                })
              }
              type="email"
              autoComplete="email"
              placeholder="you@shop.com"
            />
          </label>

          <label>
            Password

            <input
              value={values.password}
              onChange={(e) =>
                setValues({
                  ...values,
                  password: e.target.value,
                })
              }
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </label>

          <button
            className="button auth-submit"
            disabled={busy}
          >
            {busy ? (
              'Signing in…'
            ) : (
              <>
                Sign in
                <ArrowRight size={17} />
              </>
            )}
          </button>

          <p className="auth-switch">
            New to the register?{' '}
            <a href="#/register">
              Create an account
            </a>
          </p>
        </form>
      </section>
    </div>
  );
}