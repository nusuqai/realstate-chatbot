import Link from 'next/link'
import type { Dictionary } from '@/i18n/dictionaries'
import { localePath, type Locale } from '@/i18n/config'
import { BrandLogo } from './BrandLogo'

type SiteFooterProps = {
  dictionary: Dictionary
  locale: Locale
}

export function SiteFooter({ dictionary, locale }: SiteFooterProps) {
  return (
    <footer className="site-footer-glass">
      <div className="footer-glass-inner page-container">
        <div className="footer-brand-col">
          <BrandLogo brand={dictionary.brand} locale={locale} />
          <p className="footer-desc">{dictionary.metaDescription}</p>
        </div>
        <nav className="footer-nav-col" aria-label="Footer navigation">
          <span className="footer-nav-label">Explore</span>
          <Link href={localePath(locale, '/projects')}>{dictionary.nav.projects}</Link>
          <Link href={localePath(locale, '/locations')}>{dictionary.nav.locations}</Link>
          <Link href={localePath(locale, '/developers')}>{dictionary.nav.developers}</Link>
          <Link href={localePath(locale, '/chat')}>{dictionary.nav.chat}</Link>
        </nav>
      </div>
      <div className="footer-glass-bottom page-container">
        <span>© {new Date().getFullYear()} {dictionary.brand}. All rights reserved.</span>
      </div>
    </footer>
  )
}
