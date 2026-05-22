import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { localePath } from '@/i18n/config'

type BrandLogoProps = {
  brand: string
  href?: string
  locale: Locale
}

export function BrandLogo({ brand, href, locale }: BrandLogoProps) {
  return (
    <Link className="brand-lockup" href={href ?? localePath(locale)}>
      <span className="brand-mark image-mark">
        <Image alt="" height={42} src="/aqar-lens-logo.png" width={42} priority />
      </span>
      <span>{brand}</span>
    </Link>
  )
}
