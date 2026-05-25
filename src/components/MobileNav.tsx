'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import type { Dictionary } from '@/i18n/dictionaries'
import { localePath, type Locale } from '@/i18n/config'

type MobileNavProps = {
  dictionary: Dictionary
  locale: Locale
  switchHref: string
}

export function MobileNav({ dictionary, locale, switchHref }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [close])

  const navItems = [
    ['home', dictionary.nav.home, '/'],
    ['projects', dictionary.nav.projects, '/projects'],
    ['locations', dictionary.nav.locations, '/locations'],
    ['developers', dictionary.nav.developers, '/developers'],
  ] as const

  return (
    <>
      {/* Hamburger trigger */}
      <button
        className="mobile-menu-trigger"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        id="mobile-menu-open"
      >
        <Menu size={22} />
      </button>

      {/* Backdrop */}
      <div
        className={`sidebar-backdrop ${open ? 'sidebar-backdrop--visible' : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Sidebar drawer */}
      <aside
        className={`sidebar-drawer ${open ? 'sidebar-drawer--open' : ''}`}
        aria-label="Mobile navigation"
        role="dialog"
        aria-modal={open}
      >
        {/* Close button */}
        <div className="sidebar-top">
          <button
            className="sidebar-close"
            onClick={close}
            aria-label="Close menu"
            id="mobile-menu-close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="sidebar-nav">
          {navItems.map(([key, label, href]) => (
            <Link
              href={localePath(locale, href)}
              key={key}
              className="sidebar-link"
              onClick={close}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="sidebar-actions">
          <Link className="ghost-link sidebar-action-link" href={switchHref} onClick={close}>
            {dictionary.actions.switchLanguage}
          </Link>
        </div>
      </aside>
    </>
  )
}
