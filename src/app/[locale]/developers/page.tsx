import Link from 'next/link'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import {
  ArrowRight,
  Award,
  Building2,
  CalendarDays,
  Globe2,
  MapPin,
  Star,
  TrendingUp,
} from 'lucide-react'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale, localePath, type Locale } from '@/i18n/config'
import { getMarketStats, getRealEstateData, getTopDevelopers } from '@/lib/real-estate-data'
import { getDeveloperInitials, getDeveloperProjects, getPortfolioSize } from '@/lib/page-assets'

type DevelopersPageProps = {
  params: Promise<{ locale: string }>
}

export default async function DevelopersPage({ params }: DevelopersPageProps) {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) notFound()

  const locale = rawLocale as Locale
  const isAr = locale === 'ar'
  const dictionary = getDictionary(locale)
  const data = getRealEstateData(locale)
  const developers = getTopDevelopers(data)
  const stats = getMarketStats(data, locale)
  const earliestFounded = Math.min(...developers.map((d) => d.founded))
  const activeCities = new Set(data.projects.map((p) => p.city)).size

  return (
    <main className="devpage">
      {/* ── Hero ── */}
      <section className="devpage-hero">
        <div className="devpage-hero-inner page-container">
          <div className="devpage-hero-copy reveal-up">
            <span className="eyebrow">{dictionary.nav.developers}</span>
            <h1>{dictionary.pages.developersTitle}</h1>
            <p>{dictionary.pages.developersIntro}</p>
          </div>
          {/* Leaderboard pill strip */}
          <div className="devpage-hero-strip reveal-up delay-1">
            {developers.slice(0, 5).map((dev, i) => (
              <div className="devpage-strip-pill" key={dev.id}>
                <span className="devpage-strip-rank">#{i + 1}</span>
                <span className="devpage-strip-initials">{getDeveloperInitials(dev.name)}</span>
                <span className="devpage-strip-name">{dev.name}</span>
                <span className="devpage-strip-score">
                  <Star size={11} />
                  {dev.rating}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="page-container stat-glass-board">
        <Metric icon={<Award size={21} />} value={developers.length} label={dictionary.labels.developers} />
        <Metric icon={<CalendarDays size={21} />} value={earliestFounded} label={dictionary.labels.founded} />
        <Metric icon={<Globe2 size={21} />} value={activeCities} label={isAr ? 'مدن المشروعات' : 'Cities'} />
        <Metric icon={<Building2 size={21} />} value={stats.projectCount} label={dictionary.labels.projects} />
      </section>

      {/* ── Developer Cards ── */}
      <section className="page-container devpage-grid-section">
        <div className="devpage-grid">
          {developers.map((developer, index) => {
            const portfolioSize = getPortfolioSize(data, developer)
            const flagshipProjects = getDeveloperProjects(data, developer)
            const initials = getDeveloperInitials(developer.name)
            const promptHref = `${localePath(locale, '/chat')}?prompt=${encodeURIComponent(`Analyze ${developer.name} as a developer and compare it with similar developers.`)}`

            return (
              <article className="devcard" key={developer.id}>
                {/* Card header */}
                <div className="devcard-header">
                  <div className="devcard-logo">{initials}</div>
                  <div className="devcard-header-meta">
                    <span className="devcard-rank">#{index + 1}</span>
                    <span className="devcard-rating">
                      <Star size={13} />
                      {developer.rating}
                    </span>
                  </div>
                </div>

                {/* Identity */}
                <div className="devcard-identity">
                  <h2>{developer.name}</h2>
                  <p className="devcard-city">
                    <MapPin size={13} />
                    {developer.city}
                  </p>
                </div>

                {/* Stats row */}
                <div className="devcard-stats">
                  <div>
                    <strong>{developer.founded}</strong>
                    <small>{dictionary.labels.founded}</small>
                  </div>
                  <div>
                    <strong>{portfolioSize}</strong>
                    <small>{dictionary.labels.projects}</small>
                  </div>
                  <div>
                    <strong>{developer.focus.length}</strong>
                    <small>{isAr ? 'مجالات' : 'Focus areas'}</small>
                  </div>
                </div>

                {/* Focus tags */}
                <div className="devcard-focus">
                  {developer.focus.map((f) => (
                    <span key={f} className="devcard-focus-tag">{f}</span>
                  ))}
                </div>

                {/* Flagship projects */}
                {flagshipProjects.length > 0 && (
                  <div className="devcard-projects">
                    <span className="devcard-projects-label">
                      {isAr ? 'المشروعات' : 'Flagship projects'}
                    </span>
                    <div className="devcard-project-pills">
                      {flagshipProjects.map((proj) => (
                        <span key={proj.id}>{proj.name}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Positioning tags */}
                {developer.tags.length > 0 && (
                  <div className="devcard-tags">
                    {developer.tags.slice(0, 3).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                )}

                {/* Reliability bar */}
                <div className="devcard-reliability">
                  <div className="devcard-reliability-bar">
                    <div
                      className="devcard-reliability-fill"
                      style={{ width: `${(developer.rating / 5) * 100}%` }}
                    />
                  </div>
                  <span>{((developer.rating / 5) * 100).toFixed(0)}% reliability</span>
                </div>

                {/* CTA */}
                <Link className="devcard-cta" href={promptHref}>
                  {isAr ? 'اسأل عن المطور' : 'Ask about developer'}
                  <ArrowRight size={14} />
                </Link>
              </article>
            )
          })}
        </div>
      </section>

      {/* ── Leader spotlight ── */}
      {developers[0] && (
        <section className="devpage-spotlight page-container">
          <div className="devpage-spotlight-inner glass-surface">
            <div className="devpage-spotlight-left">
              <span className="eyebrow">{isAr ? 'قائد السوق' : 'Market leader'}</span>
              <h2>{developers[0].name}</h2>
              <p>
                {isAr
                  ? 'يتصدر القائمة بناء على التقييم وعمق المحفظة في البيانات الثابتة.'
                  : 'Leading the current bench by rating and portfolio depth in the static dataset.'}
              </p>
              <Link
                className="solid-link"
                href={`${localePath(locale, '/chat')}?prompt=${encodeURIComponent(`Tell me everything about ${developers[0].name} and why they lead the developer rankings.`)}`}
              >
                {isAr ? 'تحليل عمق' : 'Deep analysis'}
                <ArrowRight size={15} />
              </Link>
            </div>
            <div className="devpage-spotlight-right">
              <div className="devpage-spotlight-logo">{getDeveloperInitials(developers[0].name)}</div>
              <div className="devpage-spotlight-score">
                <TrendingUp size={18} />
                <strong>{developers[0].rating}</strong>
                <span>/ 5.0</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: number | string }) {
  return (
    <div className="stat-item">
      <span>{icon}</span>
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  )
}
