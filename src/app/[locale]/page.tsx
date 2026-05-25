import Link from 'next/link'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import {
  ArrowRight,
  Building2,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
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
  return { title: dictionary.metaTitle, description: dictionary.metaDescription }
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) notFound()

  const locale = rawLocale as Locale
  const isAr = locale === 'ar'
  const dictionary = getDictionary(locale)
  const data = getRealEstateData(locale)
  const stats = getMarketStats(data, locale)
  const featuredProjects = getFeaturedProjects(data).slice(0, 3)
  const investments = getInvestmentLeaders(data).slice(0, 4)
  const developers = getTopDevelopers(data).slice(0, 4)
  const feedback = getFeedbackByProject(data).slice(0, 3)
  const amenities = getAmenityCategories(data).slice(0, 6)

  return (
    <main>
      {/* ── Hero ── */}
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
            <Link className="hero-ai-btn" href={localePath(locale, '/chat')}>
              <Sparkles size={18} />
              {dictionary.nav.chat}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Metrics Strip ── */}
      <section className="page-container metric-glass-row" aria-label="Market snapshot">
        <Metric icon={<Building2 size={22} />} label={dictionary.labels.projects} value={stats.projectCount} />
        <Metric icon={<ShieldCheck size={22} />} label={dictionary.labels.developers} value={stats.developerCount} />
        <Metric icon={<MapPin size={22} />} label={dictionary.labels.locations} value={stats.locationCount} />
        <Metric icon={<Star size={22} />} label={dictionary.labels.avgRating} value={stats.avgRating} />
      </section>

      {/* ── Featured Projects (with rich hover) ── */}
      <section className="page-container editorial-section">
        <div className="section-heading airy">
          <span className="eyebrow">{dictionary.home.featured}</span>
          <h2>{dictionary.home.featuredText}</h2>
          <p>
            {isAr
                ? 'بطاقات واضحة تجمع السعر وموعد التسليم والمطور والتقييم في قراءة واحدة.'
                : 'Clear project cards bring price, delivery, developer quality, and rating into one quick view.'}
          </p>
        </div>
        <div className="featured-property-grid">
          {featuredProjects.map((project, index) => {
            const prompt = `Analyze ${project.name} and compare it with similar projects in ${project.location}.`
            return (
              <Link
                className={`property-showcase-card rich-hover-card reveal-up delay-${index + 1}`}
                href={`${localePath(locale, '/chat')}?prompt=${encodeURIComponent(prompt)}`}
                key={project.id}
              >
                <img alt={project.name} src={getProjectImage(project, 900, 600)} />

                {/* Default overlay — visible at rest */}
                <div className="property-showcase-overlay rich-overlay-rest">
                  <span className="pill glass-pill">{project.project_type}</span>
                  <h3>{project.name}</h3>
                  <p className="card-location">
                    <MapPin size={13} />
                    {project.location}
                  </p>
                </div>

                {/* Hover overlay — slides up on hover */}
                <div className="rich-hover-overlay">
                  <div className="rich-hover-top">
                    <span className="pill glass-pill">{project.project_type}</span>
                    <span className="rich-rating">
                      <Star size={13} />
                      {project.rating}
                    </span>
                  </div>
                  <h3>{project.name}</h3>
                  <p className="rich-summary">{getProjectSummary(project)}</p>
                  <dl className="rich-metrics">
                    <div>
                      <dt>{dictionary.labels.developer}</dt>
                      <dd>{project.developer}</dd>
                    </div>
                    <div>
                      <dt>{dictionary.labels.price}</dt>
                      <dd>{formatMoney(project.price_min, locale)}</dd>
                    </div>
                    <div>
                      <dt>{dictionary.labels.delivery}</dt>
                      <dd>{formatDate(project.delivery_date, locale)}</dd>
                    </div>
                  </dl>
                  <span className="rich-cta">
                    {isAr ? 'اسأل المساعد' : 'Ask the agent'}
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── Market Intelligence ── */}
      <section className="market-intelligence-section">
        <div className="page-container intelligence-grid">
          <div className="section-heading airy">
            <span className="eyebrow">{dictionary.home.market}</span>
            <h2>{dictionary.home.marketText}</h2>
            <p>
              {isAr
                ? 'الرؤى تجمع العائد والنمو وسرعة التسليم والانطباعات لتقريبك من القرار المناسب.'
                : 'The intelligence layer brings together ROI, growth, delivery speed, and reviews to help you move closer to the right decision.'}
            </p>
          </div>
          <div className="signal-stack">
            <div className="signal-card">
              <div>
                <span>{isAr ? 'أعلى عوائد' : 'Top returns'}</span>
                <h3>{isAr ? 'قادة الاستثمار' : 'Investment leaders'}</h3>
              </div>
              <div className="signal-rows">
                {investments.map((inv) => (
                  <div className="signal-data-row" key={inv.project}>
                    <span className="signal-label">{inv.project}</span>
                    <strong className="signal-value">{inv.value}%</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="signal-card">
              <div>
                <span>{isAr ? 'أفضل مطورين' : 'Top developers'}</span>
                <h3>{isAr ? 'المطورون المميزون' : 'Developer spotlight'}</h3>
              </div>
              <div className="signal-rows">
                {developers.map((developer) => (
                  <div className="signal-data-row" key={developer.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="dev-initials">{getDeveloperInitials(developer.name)}</span>
                      <div>
                        <strong className="signal-label" style={{ color: '#fff' }}>{developer.name}</strong>
                        <small style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{developer.focus.join(', ')}</small>
                      </div>
                    </div>
                    <strong className="signal-value">{developer.rating}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Data Life ── */}
      <section className="page-container data-life-section">
        <div className="review-panel glass-surface">
          {feedback.map((item) => (
            <blockquote key={item.id}>
              <p>{item.comment}</p>
              <footer>{item.project} / {item.rating}</footer>
            </blockquote>
          ))}
        </div>
        <div className="amenity-cloud glass-surface">
          <span className="eyebrow">{dictionary.labels.amenities}</span>
          <h2>{isAr ? 'نمط الحياة يظهر في التفاصيل.' : 'Lifestyle shows up in the details.'}</h2>
          <div className="tag-row">
            {amenities.map(([category, count]) => (
              <span key={category}>{category} ({count})</span>
            ))}
          </div>
          <p>
            {isAr
                ? `تحقق المشروعات المختارة متوسط تقييم ${getAverageRating(featuredProjects)} ضمن العرض الحالي.`
                : `Featured communities average a ${getAverageRating(featuredProjects)} rating in the current market view.`}
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="home-cta-section">
        <div className="home-cta-inner page-container">
          <div className="home-cta-copy">
            <span className="eyebrow">{dictionary.nav.chat}</span>
            <h2>{dictionary.home.ctaTitle}</h2>
            <p>{dictionary.home.ctaText}</p>
          </div>
          <Link className="solid-link large home-cta-btn" href={localePath(locale, '/chat')}>
            {dictionary.actions.askAgent}
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  )
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: number | string }) {
  return (
    <div className="metric-item">
      <span>{icon}</span>
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  )
}
