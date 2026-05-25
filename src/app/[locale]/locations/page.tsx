import Link from 'next/link'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { ArrowRight, Building2, Compass, Layers3, Map, MapPin, Star } from 'lucide-react'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale, localePath, type Locale } from '@/i18n/config'
import { getLocationGroups, getRealEstateData } from '@/lib/real-estate-data'
import { getAverageRating, getCityImage, getCityProjectCount } from '@/lib/page-assets'

type LocationsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function LocationsPage({ params }: LocationsPageProps) {
  const { locale: rawLocale } = await params

  if (!isLocale(rawLocale)) {
    notFound()
  }

  const locale = rawLocale as Locale
  const isAr = locale === 'ar'
  const dictionary = getDictionary(locale)
  const data = getRealEstateData(locale)
  const groups = getLocationGroups(data)

  return (
    <main className="subpage immersive-page">
      <section className="page-hero locations-hero">
        <div className="page-hero-copy reveal-up">
          <span className="eyebrow">{dictionary.nav.locations}</span>
          <h1>{dictionary.pages.locationsTitle}</h1>
          <p>{dictionary.pages.locationsIntro}</p>
        </div>
      </section>

      <section className="stat-glass-board">
        <Metric icon={<Map size={21} />} value={groups.length} label={dictionary.labels.city} />
        <Metric icon={<MapPin size={21} />} value={data.locations.length} label={dictionary.labels.locations} />
        <Metric icon={<Building2 size={21} />} value={data.projects.length} label={dictionary.labels.projects} />
        <Metric icon={<Star size={21} />} value={getAverageRating(data.projects)} label={dictionary.labels.avgRating} />
      </section>

      <section className="destination-grid">
        {groups.map(([city, locations], index) => {
          const projectCount = getCityProjectCount(data, city)
          const cityProjects = data.projects.filter((project) => project.city === city)

          return (
            <Link
              className={`destination-card reveal-up delay-${(index % 3) + 1}`}
              href={`${localePath(locale, '/projects')}?city=${encodeURIComponent(city)}`}
              key={city}
            >
              <img alt={city} src={getCityImage(city, 900, 600)} />
              <div className="destination-overlay">
                <span className="pill glass-pill">{locations[0]?.type ?? dictionary.labels.location}</span>
                <h2>{city}</h2>
                <p>
                  {locations.map((location) => location.name).slice(0, 4).join(', ')}
                  {locations.length > 4 ? ` +${locations.length - 4}` : ''}
                </p>
                <dl className="mini-metrics">
                  <div>
                    <dt>{dictionary.labels.projects}</dt>
                    <dd>{projectCount}</dd>
                  </div>
                  <div>
                    <dt>{dictionary.labels.avgRating}</dt>
                    <dd>{getAverageRating(cityProjects)}</dd>
                  </div>
                  <div>
                    <dt>{dictionary.labels.type}</dt>
                    <dd>{locations[0]?.tags[0] ?? locations[0]?.type}</dd>
                  </div>
                </dl>
              </div>
            </Link>
          )
        })}
      </section>

      <section className="corridor-section">
        <div className="section-heading airy">
          <span className="eyebrow">{isAr ? 'ممرات السوق' : 'Market corridors'}</span>
          <h2>{isAr ? 'اقرأ المناطق حسب أسلوب الحياة ومستوى الطلب.' : 'Read locations by lifestyle and demand.'}</h2>
        </div>
        <div className="corridor-grid">
          {groups.slice(0, 4).map(([city, locations]) => (
            <article className="corridor-card glass-surface" key={city}>
              <Compass size={22} />
              <h3>{city}</h3>
              <p>
                {isAr
                  ? `${locations.length} منطقة مع ${getCityProjectCount(data, city)} مشروع ضمن العرض الحالي.`
                  : `${locations.length} districts with ${getCityProjectCount(data, city)} projects in the current market view.`}
              </p>
              <div className="location-chip-list">
                {locations.slice(0, 5).map((location) => (
                  <span key={location.id}>{location.name}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="inline-cta">
        <div>
          <Layers3 size={22} />
          <h2>{isAr ? 'قارن المناطق بالمساعد.' : 'Compare locations with the assistant.'}</h2>
        </div>
        <Link className="solid-link" href={locationPromptHref(locale)}>
          {dictionary.actions.askAgent}
          <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  )
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: number | string
}) {
  return (
    <div className="stat-item">
      <span>{icon}</span>
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  )
}

function locationPromptHref(locale: Locale) {
  const prompt =
    locale === 'ar'
      ? 'قارن أبرز المناطق العقارية وساعدني على اختيار الأنسب حسب أسلوب الحياة وفرص الاستثمار.'
      : 'Compare the strongest real-estate locations and help me choose based on lifestyle and investment potential.'
  return `${localePath(locale, '/chat')}?prompt=${encodeURIComponent(prompt)}`
}
