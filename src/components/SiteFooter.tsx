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
    <footer className="site-footer">
      <div>
        <BrandLogo brand={dictionary.brand} locale={locale} />
        <p>{dictionary.metaDescription}</p>
      </div>
      <div className="footer-links">
        <Link href={localePath(locale, '/projects')}>{dictionary.nav.projects}</Link>
        <Link href={localePath(locale, '/locations')}>{dictionary.nav.locations}</Link>
        <Link href={localePath(locale, '/developers')}>{dictionary.nav.developers}</Link>
        <Link href={localePath(locale, '/chat')}>{dictionary.nav.chat}</Link>
      </div>
    </footer>
  )
}
