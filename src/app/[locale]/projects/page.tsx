import Link from 'next/link'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { ArrowRight, Building2, MapPin, SlidersHorizontal, Star, TrendingUp } from 'lucide-react'
import { ProjectExplorer } from '@/components/ProjectExplorer'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale, localePath, type Locale } from '@/i18n/config'
import {
  formatDate,
  formatMoney,
  getFeaturedProjects,
  getMarketStats,
  getRealEstateData,
} from '@/lib/real-estate-data'
import { getProjectImage, getProjectSummary } from '@/lib/page-assets'

type ProjectsPageProps = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProjectsPage({ params, searchParams }: ProjectsPageProps) {
  const { locale: rawLocale } = await params
  const resolvedSearchParams = await searchParams
  const initialCity = typeof resolvedSearchParams.city === 'string' ? resolvedSearchParams.city : undefined

  if (!isLocale(rawLocale)) {
    notFound()
  }

  const locale = rawLocale as Locale
  const isAr = locale === 'ar'
  const dictionary = getDictionary(locale)
  const data = getRealEstateData(locale)
  const stats = getMarketStats(data, locale)
  const heroProjects = getFeaturedProjects(data).slice(0, 3)

  return (
    <main className="subpage immersive-page">
      <section className="page-hero project-hero">
        <div className="page-hero-copy reveal-up">
          <span className="eyebrow">{dictionary.nav.projects}</span>
          <h1>{dictionary.pages.projectsTitle}</h1>
          <p>{dictionary.pages.projectsIntro}</p>
        </div>
      </section>

      <section className="stat-glass-board">
        <Metric icon={<Building2 size={21} />} value={data.projects.length} label={dictionary.labels.projects} />
        <Metric icon={<MapPin size={21} />} value={data.locations.length} label={dictionary.labels.locations} />
        <Metric icon={<Star size={21} />} value={`${stats.avgRating}/5`} label={dictionary.labels.avgRating} />
        <Metric icon={<TrendingUp size={21} />} value={stats.avgEntry} label={dictionary.labels.avgEntry} />
      </section>

      <div className="section-heading airy">
        <span className="eyebrow">{isAr ? 'المشاريع المميزة' : 'Featured Projects'}</span>
        <h2>{isAr ? 'الأعلى تقييماً في السوق' : 'Top rated in the market'}</h2>
      </div>

      <section className="project-feature-row">
        {heroProjects.map((project, index) => (
          <Link
            className={`featured-project-card reveal-up delay-${index + 1}`}
            href={projectPromptHref(locale, project.name, project.location)}
            key={project.id}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={project.name} src={getProjectImage(project, 900, 600)} />
            <div className="project-badge-row">
              <span className="pill glass-pill">{project.project_type}</span>
            </div>
            <div className="featured-project-content">
              <div>
                <h2>{project.name}</h2>
                <p>
                  <MapPin size={15} />
                  {project.location}, {project.city}
                </p>
              </div>
              <span className="rating-chip">
                <Star size={15} />
                {project.rating}
              </span>
              <p>{getProjectSummary(project)}</p>
              <dl className="mini-metrics">
                <div>
                  <dt>{dictionary.labels.developer}</dt>
                  <dd>{project.developer}</dd>
                </div>
                <div>
                  <dt>{dictionary.labels.priceRange}</dt>
                  <dd>
                    {formatMoney(project.price_min, locale)} - {formatMoney(project.price_max, locale)}
                  </dd>
                </div>
                <div>
                  <dt>{dictionary.labels.delivery}</dt>
                  <dd>{formatDate(project.delivery_date, locale)}</dd>
                </div>
              </dl>
              <div className="card-action-row">
                <div className="tag-row">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <span className="ghost-link">
                  {isAr ? 'اسأل عن المشروع' : 'Ask about it'}
                  <ArrowRight size={15} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <ProjectExplorer
        dictionary={dictionary}
        initialCity={initialCity}
        locale={locale}
        projects={data.projects}
      />

      <section className="inline-cta glass-surface compact-cta">
        <div>
          <SlidersHorizontal size={22} />
          <h2>{dictionary.actions.compare}</h2>
        </div>
        <Link className="solid-link" href={localePath(locale, '/chat')}>
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

function projectPromptHref(locale: Locale, name: string, location: string) {
  const prompt = `Analyze ${name} and compare it with similar projects in ${location}.`
  return `${localePath(locale, '/chat')}?prompt=${encodeURIComponent(prompt)}`
}
