// Workshop Index design: the cobalt tab and ink index spine are the stable navigation anchor for every operational view.

import {
  BarChart3,
  Boxes,
  LogOut,
  Menu,
  PackagePlus,
  ReceiptText,
  X,
} from 'lucide-react';

import { useState } from 'react';
import brandImage from './image.png';

const links = [
  {
    id: 'dashboard',
    label: 'Overview',
    icon: BarChart3,
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: Boxes,
  },
  {
    id: 'new-sale',
    label: 'Record sale',
    icon: PackagePlus,
  },
  {
    id: 'sales',
    label: 'Sales history',
    icon: ReceiptText,
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
  },
];

export default function AppShell({
  user,
  activeView,
  onSignOut,
  children,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-frame">
      <button
        className="mobile-menu"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <Menu size={21} />
      </button>

      <aside
        className={`index-spine ${open ? 'is-open' : ''}`}
      >
        <div className="spine-head">
          <a
            href="#/dashboard"
            className="brand-lockup"
          >
            <img
              src={brandImage}
              width="50"
              height="50"
              alt=""
            />

            <span>
              STORE
              <br />
              MANAGER
            </span>
          </a>

          <button
            className="close-menu"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <p className="spine-caption">
          OPERATIONS / 01
        </p>

        <nav>
          {links.map(
            ({ id, label, icon: Icon }, index) => (
              <a
                href={`#/${id}`}
                key={id}
                onClick={() => setOpen(false)}
                className={
                  activeView === id
                    ? 'nav-link active'
                    : 'nav-link'
                }
              >
                <span className="nav-number">
                  0{index + 1}
                </span>

                <Icon
                  size={17}
                  strokeWidth={1.8}
                />

                <span>{label}</span>
              </a>
            )
          )}
        </nav>

        <div className="spine-bottom">
          <div className="user-stamp">
            <span className="avatar">
              {user.fullName
                ?.slice(0, 1)
                .toUpperCase()}
            </span>

            <span>
              <b>{user.fullName}</b>
              <small>{user.email}</small>
            </span>
          </div>

          <button
            className="sign-out"
            onClick={onSignOut}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {open && (
        <button
          className="screen-scrim"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <main className="workspace">
        {children}
      </main>
    </div>
  );
}