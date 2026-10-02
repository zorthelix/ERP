// Workshop Index design: registration mirrors the editorial sign-in sheet while using practical language that introduces the new register.

import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

import brandImage from '../components/image.png';
import api, { messageFrom } from '../services/api.js';

export default function Register({ onAuthenticated }) {
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();

    if (
      !values.fullName ||
      !values.email ||
      !values.password
    ) {
      return setError(
        'Complete every field to create the register.'
      );
    }

    if (values.password.length < 8) {
      return setError(
        'Use a password of at least 8 characters.'
      );
    }

    if (
      values.password !== values.confirmPassword
    ) {
      return setError(
        'The password confirmation does not match.'
      );
    }

    setBusy(true);
    setError('');

    try {
      const { data } = await api.post(
        '/auth/register',
        {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
        }
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
            src={brandImage}
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
            NEW REGISTER / 02
          </p>

          <span
            className="auth-index-tab"
            aria-hidden="true"
          />

          <h1>
            Start with
            <br />
            <em>a clear count.</em>
          </h1>

          <p>
            Set up your first workspace, then add the
            products your business moves every day.
          </p>
        </div>

        <footer>
          WORKSHOP INDEX
        </footer>
      </section>

      <section className="auth-form-panel">
        <div className="auth-image compact">
          <img
            src="/manus-storage/store-manager-stock-detail_df5fb47b.png"
            alt="Inventory carton with cobalt index tab"
          />
        </div>

        <form
          onSubmit={submit}
          className="auth-form"
        >
          <p className="eyebrow">
            CREATE ACCOUNT / 02
          </p>

          <h2>
            Build your stock register
          </h2>

          <div className="document-band">
            <span>REGISTER ENTRY</span>
            <span>ACCOUNT SETUP</span>
          </div>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <label>
            Your name

            <input
              value={values.fullName}
              onChange={(e) =>
                setValues({
                  ...values,
                  fullName: e.target.value,
                })
              }
              autoComplete="name"
              placeholder="Nurag Nayak"
            />
          </label>

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
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
          </label>

          <label>
            Confirm password

            <input
              value={values.confirmPassword}
              onChange={(e) =>
                setValues({
                  ...values,
                  confirmPassword: e.target.value,
                })
              }
              type="password"
              autoComplete="new-password"
              placeholder="Repeat password"
            />
          </label>

          <button
            className="button auth-submit"
            disabled={busy}
          >
            {busy ? (
              'Creating…'
            ) : (
              <>
                Create workspace
                <ArrowRight size={17} />
              </>
            )}
          </button>

          <p className="auth-switch">
            Already have a register?{' '}
            <a href="#/login">
              Sign in
            </a>
          </p>
        </form>
      </section>
    </div>
  );
}