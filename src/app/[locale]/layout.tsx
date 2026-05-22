import { notFound } from 'next/navigation'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale, localePath, oppositeLocale, type Locale } from '@/i18n/config'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

type LocaleLayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }]
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: rawLocale } = await params

  if (!isLocale(rawLocale)) {
    notFound()
  }

  const locale = rawLocale as Locale
  const dictionary = getDictionary(locale)
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <div className="locale-shell" lang={locale} dir={dir}>
      <SiteHeader
        dictionary={dictionary}
        locale={locale}
        switchHref={localePath(oppositeLocale(locale))}
      />
      {children}
      <SiteFooter dictionary={dictionary} locale={locale} />
    </div>
  )
}
