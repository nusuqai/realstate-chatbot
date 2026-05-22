import type { Developer, Project, RealEstateData } from './real-estate-data'

const FALLBACK_PROPERTY_IMAGE =
  'https://marassi.eg/wp-content/uploads/2025/07/Marassi-Marassi-Marina-Yacht-Club-7.jpg'

const PROJECT_IMAGES: Record<string, string> = {
  proj_001:
    'https://new-projects-media.propertyfinder.com/project/a65ce635-d3cc-4d9a-af7e-88786db805fd/gallery/image/uDhWULepbkOt_pCvHVqppgvROlKAxxQ6MH4nMyRTW1M=/medium.webp',
  proj_002:
    'https://new-projects-media.propertyfinder.com/project/85d18102-e152-4d03-9552-782293d007be/gallery/image/bpm67nVY1iYGmSLfRxNVSelbIV4TiIRz3OpvifgcI94=/medium.webp',
  proj_003:
    'https://new-projects-media.propertyfinder.com/project/b0cc0fa9-bd24-42d0-83f5-cbf1ea9c32bc/gallery/image/4gr77VWt6vNQ5_GoSEnoY3oy1nZbtL7Joq6L76frxOs=/medium.webp',
  proj_004: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/ALrehab1.JPG?width=1200',
  proj_005:
    'https://new-projects-media.propertyfinder.com/project/8368258b-42a6-4d6a-82b5-df2c705f2bd8/gallery/image/vfS8cCnlCHn_8KfHEBw5bgUsmRz-XJR9_d4hHwIKVNE=/medium.webp',
  proj_006:
    'https://new-projects-media.propertyfinder.com/project/76194b1b-3109-4f26-944f-0fe2d9799fb0/gallery/image/pCoyr21WO2hRREJt5PV8I8w08yeRuvzswaBg4EvWdFg=/medium.webp',
  proj_007:
    'https://new-projects-media.propertyfinder.com/project/3e01b5df-51d3-4b38-9161-76393674044c/gallery/image/FwlYyyyQSnDoZSgVykPgDLIOdzPlfNTHhhFAVTrYWFQ=/medium.webp',
  proj_008: 'https://selecthouse.co/wp-content/uploads/2022/06/palm-hills-compound-in-october.jpg',
  proj_009:
    'https://new-projects-media.propertyfinder.com/project/d2d1a370-3ee5-4407-828c-aafc05d7f361/gallery/image/dWjMwk65Tta62x7Cl7as3qlajU6HlwphuOav7hYlTiY=/medium.webp',
  proj_010:
    'https://new-projects-media.propertyfinder.com/project/f12e4fc3-2710-4c11-b6ef-d0e08e9d018b/gallery/image/FYnWrwujbc1-Qict2cLrE91ZxauAFVUHuhlAcf8cpqk=/medium.webp',
  proj_011: 'https://www.propertyfinder.eg/blog/wp-content/uploads/2020/04/westown-800x466.jpg',
  proj_012:
    'https://new-projects-media.propertyfinder.com/project/eb5daf32-2a15-466e-9d24-96bcd0c14733/gallery/image/CsBsrIti8KHDF3oXaT8KiZOg7GTLaeSfGsErK7cqgRk=/medium.webp',
  proj_013:
    'https://new-projects-media.propertyfinder.com/project/82976357-90b0-4072-beda-98c53253e61f/gallery/image/xLDoS3e04eiSJlkHY_TluE97GtMhzOnjk_FoPz83JDk=/medium.webp',
  proj_014:
    'https://new-projects-media.propertyfinder.com/project/608c56cf-216a-4415-b177-b7859e1e88cb/gallery/image/RujINT7twHGBjcGKEqfOaYVMdGBwr-JfYgnFM5xAfEc=/medium.webp',
  proj_015:
    'https://new-projects-media.propertyfinder.com/project/5f08d7f9-a6ca-4abe-94fe-594241e54dad/gallery/image/YWEQDnYH4AM9euJaC7Q-i0AvfwSJII_vx0Z2gZfCJio=/medium.webp',
  proj_016:
    'https://new-projects-media.propertyfinder.com/project/894abd49-21d3-4d6a-bca8-f83238fa6da8/gallery/image/ElLiX7c9z9rdZVkIGRqHU_g_IQKGAVlQkA_66Lc5EsA=/medium.webp',
  proj_017:
    'https://static.wixstatic.com/media/8994b1_0ffc43c16ab044389523a633accdf5fe~mv2.png/v1/fit/w_1440,h_1080,q_90,enc_avif,quality_auto/8994b1_0ffc43c16ab044389523a633accdf5fe~mv2.png',
  proj_018:
    'https://new-projects-media.propertyfinder.com/project/d9e0c7f4-66c8-44fd-92c0-9fc6fa483ab4/gallery/image/X-HkhPp81YkOyLNGQ0JuTgnT2NeqIR13gmLBH4nKZ1o=/medium.webp',
  proj_019:
    'https://new-projects-media.propertyfinder.com/project/7f84ab0a-97b0-4e6c-9d78-4645c1f5a243/gallery/image/HUGItMHOq6tkPnE0oIF-xE7rLGogAPqJYUiUNtwNtQ0=/medium.webp',
  proj_020:
    'https://new-projects-media.propertyfinder.com/project/513f156f-f890-47af-b481-9e07032a2967/gallery/image/cGS8DXBj1F9d9JZgzfsX4UPSjF2lX6F1LWsTQZ30CXg=/medium.webp',
  proj_021:
    'https://new-projects-media.propertyfinder.com/project/e431a499-7287-488d-9185-6652969ce114/gallery/image/ngL1jWOXn0Lqyh6PtH8fP1UvlCJIaSAqE1OQZLz41B4=/medium.webp',
  proj_022:
    'https://new-projects-media.propertyfinder.com/project/0a7f5fcb-8dd6-4515-b75c-bd8a2749a0ce/gallery/image/48v15fVpRVNMTZoS_iZILxQ1X7vTML7BL_hmu2kwC9c=/medium.webp',
  proj_023:
    'https://new-projects-media.propertyfinder.com/project/b8c3251e-8a11-40df-9b7d-a1dcdde3bfae/gallery/image/E9hQ3Xsgez_KPjtilYVttUnkiaLnN4V_6Kb5iOGe2R0=/medium.webp',
  proj_024:
    'https://new-projects-media.propertyfinder.com/project/85bebc9f-cb5d-4947-accd-4b167b21e492/gallery/image/o9AXDNWesz4ipU3unAgoiQYPVF5VEMl0tSiPLZwLsu4=/medium.webp',
  proj_025:
    'https://new-projects-media.propertyfinder.com/project/f5400c9c-ef83-4b79-9095-04a72d9eeeb1/gallery/image/ep02XxPWCct1v45JOGTm6gzrtNp08-6md1IQ9kZmqug=/medium.webp',
  proj_026:
    'https://new-projects-media.propertyfinder.com/project/e6bf94b3-95a6-4372-8ba7-7d114d6fa162/gallery/image/KG6Es6tWc3eIDqdq2w4pvpiG9Hx2BOFBKGVQry7ZMi0=/medium.webp',
  proj_027:
    'https://new-projects-media.propertyfinder.com/project/7f2452ab-f9d5-4175-91ee-ff59218b7f0c/gallery/image/2hh7n4rUl4nU7Pkrp-Si6DoJsyfIy7XlXb7v3aJ4IU8=/medium.webp',
  proj_028:
    'https://new-projects-media.propertyfinder.com/project/c2ba7763-2268-489b-9de8-a3bdeeb29e77/gallery/image/JL9fD-I6S3JHXFHxhLcD06CL0TuRDDTg-4Rohpvw1UQ=/medium.webp',
  proj_029:
    'https://new-projects-media.propertyfinder.com/project/97950bf8-2029-429d-a36f-60c870b8db45/gallery/image/aRUH85W28EZmQn-kIGEfTBG7aI_OeUkYTb9TEYYlt9I=/medium.webp',
  proj_030:
    'https://new-projects-media.propertyfinder.com/project/165f714b-e618-4794-a1da-260561e08bc9/gallery/image/AZLCvs4MHjD026sPh5oGYm2-E-J0cUgysshHSqbTlu0=/medium.webp',
}

const CITY_IMAGES: Record<string, string> = {
  Cairo: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Cairo%20skyline%2C%20Nile%20River%2C%20Egypt.jpg?width=1200',
  Giza: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/October%20city.jpg?width=1200',
  'New Capital':
    'https://commons.wikimedia.org/wiki/Special:Redirect/file/The%20Government%20District%2C%20New%20Capital%201.jpg?width=1200',
  'North Coast': FALLBACK_PROPERTY_IMAGE,
  'Red Sea': 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Hurghada%20from%20the%20sea.jpg?width=1200',
}

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

export function getProjectImage(project: Project, width = 800, height = 500) {
  void width
  void height

  return PROJECT_IMAGES[project.id] ?? FALLBACK_PROPERTY_IMAGE
}

export function getHeroImage(width = 1200, height = 700) {
  void width
  void height

  return FALLBACK_PROPERTY_IMAGE
}

export function getCityImage(city: string, width = 800, height = 500) {
  void width
  void height

  const normalized = city.toLowerCase()

  if (CITY_IMAGES[city]) {
    return CITY_IMAGES[city]
  }

  if (normalized.includes('cairo') || city.includes('القاهرة')) {
    return CITY_IMAGES.Cairo
  }

  if (normalized.includes('giza') || city.includes('الجيزة')) {
    return CITY_IMAGES.Giza
  }

  if (normalized.includes('capital') || city.includes('العاصمة')) {
    return CITY_IMAGES['New Capital']
  }

  if (normalized.includes('coast') || city.includes('الساحل')) {
    return CITY_IMAGES['North Coast']
  }

  if (normalized.includes('red sea') || city.includes('البحر')) {
    return CITY_IMAGES['Red Sea']
  }

  return FALLBACK_PROPERTY_IMAGE
}
