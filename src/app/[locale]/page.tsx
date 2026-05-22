import Link from 'next/link'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Building2,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale, localePath, type Locale } from '@/i18n/config'
import {
  formatDate,
  formatMoney,
  getAmenityCategories,
  getFeaturedProjects,
  getFeedbackByProject,
  getInvestmentLeaders,
  getLocationGroups,
  getMarketStats,
  getRealEstateData,
  getTopDevelopers,
} from '@/lib/real-estate-data'
import {
  getAverageRating,
  getDeveloperInitials,
  getHeroImage,
  getProjectImage,
  getProjectSummary,
} from '@/lib/page-assets'

type HomePageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: HomePageProps) {
  const { locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : 'en'
  const dictionary = getDictionary(locale)

  return {
    title: dictionary.metaTitle,
    description: dictionary.metaDescription,
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params

  if (!isLocale(rawLocale)) {
    notFound()
  }

  const locale = rawLocale as Locale
  const isAr = locale === 'ar'
  const dictionary = getDictionary(locale)
  const data = getRealEstateData(locale)
  const stats = getMarketStats(data, locale)
  const featuredProjects = getFeaturedProjects(data).slice(0, 3)
  const investments = getInvestmentLeaders(data).slice(0, 4)
  const developers = getTopDevelopers(data).slice(0, 4)
  const locationGroups = getLocationGroups(data).slice(0, 5)
  const feedback = getFeedbackByProject(data).slice(0, 3)
  const amenities = getAmenityCategories(data).slice(0, 6)

  const workflow = isAr
    ? [
        'نقرأ قاعدة المعرفة الثابتة ونرتب إشارات السعر والموقع والتسليم.',
        'نربط المطورين بالمشروعات والتقييمات ومؤشرات المخاطر.',
        'نحول السؤال إلى مقارنة قابلة للقرار مع مصادر ورسوم.',
      ]
    : [
        'Read the static knowledge base and rank price, location, and delivery signals.',
        'Connect developers to projects, ratings, amenities, and risk metrics.',
        'Turn each question into a sourced, chart-ready decision brief.',
      ]

  return (
    <main>
      <section className="home-hero">
        <div className="page-container hero-grid">
          <div className="hero-copy reveal-up">
            <span className="eyebrow">{dictionary.home.eyebrow}</span>
            <h1>{dictionary.home.title}</h1>
            <p>{dictionary.home.subtitle}</p>
            <div className="hero-actions">
              <Link className="solid-link large" href={localePath(locale, '/projects')}>
                {dictionary.actions.exploreProjects}
                <ArrowRight size={17} />
              </Link>
              <Link className="ghost-link large" href={localePath(locale, '/chat')}>
                <Sparkles size={17} />
                {dictionary.actions.askAgent}
              </Link>
            </div>
          </div>

          <div className="hero-visual reveal-up delay-1" aria-hidden="true">
            <div className="hero-glass-card hero-search-card">
              <Search size={18} />
              <span>
                {stats.projectCount} {dictionary.labels.projects} / {stats.developerCount}{' '}
                {dictionary.labels.developers}
              </span>
            </div>
            <div className="hero-property-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={stats.topProject} src={getHeroImage()} />
              <div className="hero-data-visual" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 18, background: 'linear-gradient(0deg, rgba(8,18,15,0.6), transparent 60%)', color: '#fff', pointerEvents: 'none' }}>
                <span style={{ width: 'fit-content', borderRadius: 999, padding: '7px 10px', background: 'rgba(255,255,255,0.16)', fontSize: 11, fontWeight: 900, textTransform: 'uppercase' as const }}>{dictionary.labels.topProject}</span>
                <strong style={{ marginTop: 12, fontSize: 'clamp(24px, 4vw, 48px)', lineHeight: 0.96 }}>{stats.topProject}</strong>
              </div>
              <div className="hero-price-card">
                <span>{dictionary.labels.avgEntry}</span>
                <strong>{stats.avgEntry}</strong>
              </div>
            </div>
            <div className="hero-glass-card hero-score-card">
              <TrendingUp size={18} />
              <div>
                <strong>{investments[0]?.value}%</strong>
                <span>{investments[0]?.project}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container metric-glass-row" aria-label="Market snapshot">
        <Metric icon={<Building2 size={22} />} label={dictionary.labels.projects} value={stats.projectCount} />
        <Metric icon={<ShieldCheck size={22} />} label={dictionary.labels.developers} value={stats.developerCount} />
        <Metric icon={<MapPin size={22} />} label={dictionary.labels.locations} value={stats.locationCount} />
        <Metric icon={<Star size={22} />} label={dictionary.labels.avgRating} value={stats.avgRating} />
      </section>

      <section className="page-container editorial-section">
        <div className="section-heading airy">
          <span className="eyebrow">{dictionary.home.featured}</span>
          <h2>{dictionary.home.featuredText}</h2>
          <p>
            {isAr
              ? 'بطاقات بصرية تربط السعر، التسليم، المطور، والتقييم في قراءة واحدة.'
              : 'Visual project cards connect price, delivery, developer quality, and rating in one scan.'}
          </p>
        </div>
        <div className="featured-property-grid">
          {featuredProjects.map((project, index) => (
            <article className={`property-showcase-card reveal-up delay-${index + 1}`} key={project.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={project.name} src={getProjectImage(project, 900, 600)} />
              <div className="property-showcase-overlay">
                <span className="pill glass-pill">{project.project_type}</span>
                <h3>{project.name}</h3>
                <p>{getProjectSummary(project)}</p>
                <div className="property-facts">
                  <span>{formatMoney(project.price_min, locale)}</span>
                  <span>{formatDate(project.delivery_date, locale)}</span>
                  <span>{project.rating}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="market-intelligence-section">
        <div className="page-container intelligence-grid">
          <div className="section-heading airy">
            <span className="eyebrow">{dictionary.home.market}</span>
            <h2>{dictionary.home.marketText}</h2>
            <p>
              {isAr
                ? 'الرؤى تجمع مؤشرات العائد والنمو وسرعة التسليم والتقييمات لتقليل الضوضاء قبل القرار.'
                : 'The intelligence layer blends ROI, growth, delivery speed, and reviews to reduce noise before a decision.'}
            </p>
          </div>
          <div className="signal-stack">
            {investments.map((investment) => (
              <article className="signal-card" key={investment.id}>
                <div>
                  <span>{investment.metric.replace(/_/g, ' ')}</span>
                  <h3>{investment.project}</h3>
                </div>
                <strong>{investment.value}%</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-container editorial-section">
        <div className="section-heading airy centered-heading">
          <span className="eyebrow">{dictionary.home.locations}</span>
          <h2>{dictionary.home.locationsText}</h2>
        </div>
        <div className="region-rail">
          {locationGroups.map(([city, locations]) => (
            <article className="region-tile" key={city}>
              <MapPin size={20} />
              <strong>{city}</strong>
              <span>{locations.length} {dictionary.labels.locations}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="page-container split-story-section">
        <div className="story-panel glass-surface">
          <span className="eyebrow">{dictionary.home.workflow}</span>
          <h2>{dictionary.home.ctaTitle}</h2>
          <div className="workflow-list">
            {workflow.map((item, index) => (
              <div className="workflow-row" key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
          <Link className="solid-link large" href={localePath(locale, '/chat')}>
            <BrainCircuit size={17} />
            {dictionary.actions.compare}
          </Link>
        </div>
        <div className="developer-snapshot glass-surface">
          <div className="snapshot-header">
            <BarChart3 size={21} />
            <strong>{dictionary.pages.developersTitle}</strong>
          </div>
          {developers.map((developer) => (
            <div className="snapshot-row" key={developer.id}>
              <span>{getDeveloperInitials(developer.name)}</span>
              <div>
                <strong>{developer.name}</strong>
                <small>{developer.focus.join(', ')}</small>
              </div>
              <b>{developer.rating}</b>
            </div>
          ))}
        </div>
      </section>

      <section className="page-container data-life-section">
        <div className="review-panel glass-surface">
          {feedback.map((item) => (
            <blockquote key={item.id}>
              <p>{item.comment}</p>
              <footer>
                {item.project} / {item.rating}
              </footer>
            </blockquote>
          ))}
        </div>
        <div className="amenity-cloud glass-surface">
          <span className="eyebrow">{dictionary.labels.amenities}</span>
          <h2>{isAr ? 'نمط الحياة يظهر في التفاصيل.' : 'Lifestyle shows up in the details.'}</h2>
          <div className="tag-row">
            {amenities.map(([category, count]) => (
              <span key={category}>
                {category} ({count})
              </span>
            ))}
          </div>
          <p>
            {isAr
              ? `متوسط تقييم المشروعات المختارة ${getAverageRating(featuredProjects)} من البيانات الحالية.`
              : `Featured communities average ${getAverageRating(featuredProjects)} rating across the current dataset.`}
          </p>
        </div>
      </section>

      <section className="cta-section upgraded-cta">
        <div>
          <span className="eyebrow">{dictionary.nav.chat}</span>
          <h2>{dictionary.home.ctaTitle}</h2>
          <p>{dictionary.home.ctaText}</p>
        </div>
        <Link className="solid-link large" href={localePath(locale, '/chat')}>
          {dictionary.actions.askAgent}
          <ArrowRight size={17} />
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
    <div className="metric-item">
      <span>{icon}</span>
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  )
}
