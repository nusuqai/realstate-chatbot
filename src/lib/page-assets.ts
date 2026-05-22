import type { Developer, Project, RealEstateData } from './real-estate-data'

export function getProjectVisualClass(project: Project) {
  const tags = project.tags.join(' ').toLowerCase()

  if (tags.includes('beach') || tags.includes('coastal') || project.city.includes('Coast')) {
    return 'visual-coastal'
  }

  if (tags.includes('destination') || tags.includes('lagoon') || project.city.includes('Sea')) {
    return 'visual-destination'
  }

  if (project.project_type.includes('mixed')) {
    return 'visual-mixed'
  }

  if (tags.includes('value') || tags.includes('emerging')) {
    return 'visual-growth'
  }

  return 'visual-residential'
}

export function getCityVisualClass(city: string) {
  const normalized = city.toLowerCase()

  if (normalized.includes('coast') || normalized.includes('sea')) {
    return 'visual-coastal'
  }

  if (normalized.includes('giza') || normalized.includes('october')) {
    return 'visual-west'
  }

  if (normalized.includes('capital')) {
    return 'visual-growth'
  }

  return 'visual-residential'
}

export function getProjectSummary(project: Project) {
  const tag = project.tags[0] ?? project.project_type

  return `${tag} community in ${project.location} with ${project.rating.toFixed(1)} rating, ${project.developer} delivery, and a ${project.project_type} positioning.`
}

export function getDeveloperInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function getDeveloperProjects(data: RealEstateData, developer: Developer) {
  return data.projects
    .filter((project) => project.developer_id === developer.id || project.developer === developer.name)
    .slice(0, 3)
}

export function getPortfolioSize(data: RealEstateData, developer: Developer) {
  return data.projects.filter(
    (project) => project.developer_id === developer.id || project.developer === developer.name,
  ).length
}

export function getCityProjectCount(data: RealEstateData, city: string) {
  return data.projects.filter((project) => project.city === city).length
}

export function getAverageRating(projects: Project[]) {
  if (!projects.length) {
    return '0.0'
  }

  return (projects.reduce((total, project) => total + project.rating, 0) / projects.length).toFixed(1)
}

/** Returns a deterministic placeholder image URL for a project */
export function getProjectImage(project: Project, width = 800, height = 500) {
  // Use a numeric seed derived from the project id for consistency
  const seed = project.id.replace(/\D/g, '') || '1'
  return `https://picsum.photos/seed/realestate${seed}/${width}/${height}`
}

/** Returns a placeholder image URL for the hero section */
export function getHeroImage(width = 1200, height = 700) {
  return `https://picsum.photos/seed/hero-property/${width}/${height}`
}

