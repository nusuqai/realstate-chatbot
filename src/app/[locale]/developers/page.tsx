import Link from 'next/link'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { ArrowRight, Award, Building2, CalendarDays, Globe2, MapPin, Star, TrendingUp } from 'lucide-react'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale, localePath, type Locale } from '@/i18n/config'
import { getMarketStats, getRealEstateData, getTopDevelopers } from '@/lib/real-estate-data'
import { getDeveloperInitials, getDeveloperProjects, getPortfolioSize } from '@/lib/page-assets'

type DevelopersPageProps = {
  params: Promise<{ locale: string }>
}

export default async function DevelopersPage({ params }: DevelopersPageProps) {
  const { locale: rawLocale } = await params

  if (!isLocale(rawLocale)) {
    notFound()
  }

  const locale = rawLocale as Locale
  const isAr = locale === 'ar'
  const dictionary = getDictionary(locale)
  const data = getRealEstateData(locale)
  const developers = getTopDevelopers(data)
  const stats = getMarketStats(data, locale)
  const leader = developers[0]
  const earliestFounded = Math.min(...developers.map((developer) => developer.founded))
  const activeCities = new Set(developers.map((developer) => developer.city)).size

  return (
    <main className="subpage immersive-page">
      <section className="page-hero developer-hero">
        <div className="page-hero-copy reveal-up">
          <span className="eyebrow">{dictionary.nav.developers}</span>
          <h1>{dictionary.pages.developersTitle}</h1>
          <p>{dictionary.pages.developersIntro}</p>
        </div>
      </section>

      <section className="stat-glass-board">
        <Metric icon={<Award size={21} />} value={developers.length} label={dictionary.labels.developers} />
        <Metric icon={<CalendarDays size={21} />} value={earliestFounded} label={dictionary.labels.founded} />
        <Metric icon={<Globe2 size={21} />} value={activeCities} label={dictionary.labels.city} />
        <Metric icon={<Building2 size={21} />} value={stats.projectCount} label={dictionary.labels.projects} />
      </section>

      <section className="developer-command-center cleaner-developers">
        <aside className="leaderboard-card glass-surface">
          <div className="panel-heading">
            <strong>{isAr ? 'ترتيب المطورين' : 'Developer leaderboard'}</strong>
            <Link
              href={`${localePath(locale, '/chat')}?prompt=${encodeURIComponent('How should I compare developers in this dataset?')}`}
            >
              {isAr ? 'اسأل المنهجية' : 'Ask methodology'}
            </Link>
          </div>
          {developers.slice(0, 6).map((developer, index) => (
            <div className="leader-row" key={developer.id}>
              <span>{index + 1}</span>
              <b>{getDeveloperInitials(developer.name)}</b>
              <div>
                <strong>{developer.name}</strong>
                <small>{developer.focus.join(', ')}</small>
              </div>
              <em>{developer.rating}</em>
            </div>
          ))}
        </aside>

        <section className="developer-card-grid clean-grid">
          {developers.map((developer, index) => {
            const portfolioSize = getPortfolioSize(data, developer)
            const flagshipProjects = getDeveloperProjects(data, developer)

            return (
              <article className="developer-profile-card glass-surface" key={developer.id}>
                <div className="developer-profile-top">
                  <span className="rank-chip">{index + 1}</span>
                  <span className="rating-chip">
                    <Star size={15} />
                    {developer.rating}
                  </span>
                </div>
                <div className="developer-logo">{getDeveloperInitials(developer.name)}</div>
                <div className="developer-title-row simple">
                  <div>
                    <h2>{developer.name}</h2>
                    <p>
                      <MapPin size={14} />
                      {developer.city}
                    </p>
                  </div>
                </div>
                <dl className="mini-metrics developer-metrics">
                  <div>
                    <dt>{dictionary.labels.founded}</dt>
                    <dd>{developer.founded}</dd>
                  </div>
                  <div>
                    <dt>{dictionary.labels.focus}</dt>
                    <dd>{developer.focus.join(', ')}</dd>
                  </div>
                  <div>
                    <dt>{dictionary.labels.projects}</dt>
                    <dd>{portfolioSize}</dd>
                  </div>
                </dl>
                <div className="flagship-row">
                  {flagshipProjects.map((project) => (
                    <span key={project.id}>{project.name}</span>
                  ))}
                </div>
                <div className="tag-row">
                  {developer.tags.slice(0, 3).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <Link className="profile-link" href={developerPromptHref(locale, developer.name)}>
                  {isAr ? 'اسأل عن المطور' : 'Ask about developer'}
                  <ArrowRight size={15} />
                </Link>
              </article>
            )
          })}
        </section>
      </section>

      {leader ? (
        <section className="developer-spotlight glass-surface">
          <div>
            <span className="eyebrow">{dictionary.labels.topProject}</span>
            <h2>{leader.name}</h2>
            <p>
              {isAr
                ? 'يتصدر القائمة بناء على التقييم وعمق المحفظة في البيانات الثابتة.'
                : 'Leading the current bench by rating and portfolio depth in the static dataset.'}
            </p>
          </div>
          <TrendingUp size={54} />
        </section>
      ) : null}
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

function developerPromptHref(locale: Locale, name: string) {
  const prompt = `Analyze ${name} as a developer and compare it with similar developers.`
  return `${localePath(locale, '/chat')}?prompt=${encodeURIComponent(prompt)}`
}
