'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, MapPin, Search, SlidersHorizontal, Star } from 'lucide-react'
import type { Dictionary } from '@/i18n/dictionaries'
import { localePath, type Locale } from '@/i18n/config'
import { formatDate, formatMoney, type Project } from '@/lib/real-estate-data'
import { getProjectImage, getProjectSummary } from '@/lib/page-assets'

type ProjectExplorerProps = {
  dictionary: Dictionary
  locale: Locale
  projects: Project[]
}

type SortKey = 'rating' | 'entry' | 'delivery'

export function ProjectExplorer({ dictionary, locale, projects }: ProjectExplorerProps) {
  const isAr = locale === 'ar'
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('all')
  const [developer, setDeveloper] = useState('all')
  const [type, setType] = useState('all')
  const [minRating, setMinRating] = useState('all')
  const [sort, setSort] = useState<SortKey>('rating')

  const cities = useMemo(() => unique(projects.map((project) => project.city)), [projects])
  const developers = useMemo(() => unique(projects.map((project) => project.developer)), [projects])
  const types = useMemo(() => unique(projects.map((project) => project.project_type)), [projects])

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const minRatingValue = minRating === 'all' ? 0 : Number(minRating)

    return projects
      .filter((project) => {
        const haystack = [
          project.name,
          project.developer,
          project.city,
          project.location,
          project.project_type,
          ...project.tags,
        ]
          .join(' ')
          .toLowerCase()

        return (
          (!normalizedQuery || haystack.includes(normalizedQuery)) &&
          (city === 'all' || project.city === city) &&
          (developer === 'all' || project.developer === developer) &&
          (type === 'all' || project.project_type === type) &&
          project.rating >= minRatingValue
        )
      })
      .sort((a, b) => {
        if (sort === 'entry') {
          return a.price_min - b.price_min
        }

        if (sort === 'delivery') {
          return new Date(a.delivery_date).getTime() - new Date(b.delivery_date).getTime()
        }

        return b.rating - a.rating || a.price_min - b.price_min
      })
  }, [city, developer, minRating, projects, query, sort, type])

  function resetFilters() {
    setQuery('')
    setCity('all')
    setDeveloper('all')
    setType('all')
    setMinRating('all')
    setSort('rating')
  }

  return (
    <section className="project-explorer-section">
      <div className="catalog-toolbar">
        <div>
          <SlidersHorizontal size={18} />
          <strong>
            {filteredProjects.length} {dictionary.labels.projects}
          </strong>
        </div>
        <button onClick={resetFilters} type="button">
          {isAr ? 'مسح الفلاتر' : 'Clear filters'}
        </button>
      </div>

      <div className="filter-dock glass-surface">
        <label className="search-control">
          <Search size={16} />
          <input
            aria-label={isAr ? 'بحث في المشروعات' : 'Search projects'}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={isAr ? 'ابحث بالمشروع أو المطور أو المنطقة...' : 'Search projects, developers, or locations...'}
            value={query}
          />
        </label>

        <FilterSelect label={dictionary.labels.city} onChange={setCity} value={city}>
          <option value="all">{isAr ? 'كل المدن' : 'All cities'}</option>
          {cities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect label={dictionary.labels.developer} onChange={setDeveloper} value={developer}>
          <option value="all">{isAr ? 'كل المطورين' : 'All developers'}</option>
          {developers.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect label={dictionary.labels.type} onChange={setType} value={type}>
          <option value="all">{isAr ? 'كل الأنواع' : 'All types'}</option>
          {types.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect label={dictionary.labels.rating} onChange={setMinRating} value={minRating}>
          <option value="all">{isAr ? 'كل التقييمات' : 'Any rating'}</option>
          <option value="4.5">4.5+</option>
          <option value="4.2">4.2+</option>
          <option value="4">4.0+</option>
        </FilterSelect>

        <FilterSelect label={isAr ? 'الترتيب' : 'Sort'} onChange={(value) => setSort(value as SortKey)} value={sort}>
          <option value="rating">{isAr ? 'الأعلى تقييما' : 'Top rated'}</option>
          <option value="entry">{isAr ? 'الأقل سعرا' : 'Lowest entry'}</option>
          <option value="delivery">{isAr ? 'الأقرب تسليما' : 'Soonest delivery'}</option>
        </FilterSelect>
      </div>

      <div className="modern-project-grid">
        {filteredProjects.map((project) => (
          <article className="modern-project-card glass-surface" key={project.id}>
            <div className="modern-card-media">
              <span>{project.project_type}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={project.name} src={getProjectImage(project)} />
            </div>
            <div className="modern-card-body">
              <div className="modern-card-title">
                <div>
                  <h2>{project.name}</h2>
                  <p>
                    <MapPin size={14} />
                    {project.location}, {project.city}
                  </p>
                </div>
                <span className="rating-chip">
                  <Star size={15} />
                  {project.rating}
                </span>
              </div>
              <p>{getProjectSummary(project)}</p>
              <dl className="mini-metrics">
                <div>
                  <dt>{dictionary.labels.priceRange}</dt>
                  <dd>{formatMoney(project.price_min, locale)}</dd>
                </div>
                <div>
                  <dt>{dictionary.labels.delivery}</dt>
                  <dd>
                    <CalendarDays size={13} />
                    {formatDate(project.delivery_date, locale)}
                  </dd>
                </div>
                <div>
                  <dt>{dictionary.labels.developer}</dt>
                  <dd>{project.developer}</dd>
                </div>
              </dl>
              <div className="card-action-row">
                <div className="tag-row">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <Link href={projectPromptHref(locale, project.name, project.location)}>
                  {dictionary.actions.askAgent}
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function FilterSelect({
  children,
  label,
  onChange,
  value,
}: {
  children: ReactNode
  label: string
  onChange: (value: string) => void
  value: string
}) {
  return (
    <label className="filter-select">
      <span>{label}</span>
      <select onChange={(event) => onChange(event.target.value)} value={value}>
        {children}
      </select>
    </label>
  )
}

function unique(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b))
}

function projectPromptHref(locale: Locale, name: string, location: string) {
  const prompt = `Analyze ${name} and compare it with similar projects in ${location}.`
  return `${localePath(locale, '/chat')}?prompt=${encodeURIComponent(prompt)}`
}
