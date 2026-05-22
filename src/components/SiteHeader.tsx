import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import type { Dictionary } from '@/i18n/dictionaries'
import { localePath, type Locale } from '@/i18n/config'
import { BrandLogo } from './BrandLogo'

type SiteHeaderProps = {
  dictionary: Dictionary
  locale: Locale
  switchHref: string
}

export function SiteHeader({ dictionary, locale, switchHref }: SiteHeaderProps) {
  const navItems = [
    ['home', dictionary.nav.home, '/'],
    ['projects', dictionary.nav.projects, '/projects'],
    ['locations', dictionary.nav.locations, '/locations'],
    ['developers', dictionary.nav.developers, '/developers'],
  ] as const

  return (
    <header className="site-header">
      <BrandLogo brand={dictionary.brand} locale={locale} />

      <nav className="site-nav" aria-label="Primary navigation">
        {navItems.map(([key, label, href]) => (
          <Link href={localePath(locale, href)} key={key}>
            {label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <Link className="ghost-link" href={switchHref}>
          {dictionary.actions.switchLanguage}
        </Link>
        <Link className="solid-link" href={localePath(locale, '/chat')}>
          <Sparkles size={16} />
          {dictionary.nav.chat}
        </Link>
      </div>
    </header>
  )
}
