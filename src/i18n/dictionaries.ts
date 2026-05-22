import type { Locale } from './config'

export const dictionaries = {
  en: {
    brand: 'AqarLens',
    metaTitle: 'AqarLens | AI real-estate intelligence',
    metaDescription:
      'Explore Egyptian real-estate projects, developers, locations, investment metrics, amenities, and AI-powered comparisons.',
    nav: {
      home: 'Home',
      projects: 'Projects',
      locations: 'Locations',
      developers: 'Developers',
      insights: 'Insights',
      chat: 'AI Chat',
    },
    actions: {
      exploreProjects: 'Explore projects',
      askAgent: 'Ask the agent',
      viewInsights: 'View insights',
      compare: 'Compare with AI',
      switchLanguage: 'العربية',
      newChat: 'New chat',
    },
    home: {
      eyebrow: 'Real-estate intelligence for Egypt',
      title: 'Find the right compound with data you can actually act on.',
      subtitle:
        'AqarLens turns project records, developer history, location signals, investment metrics, amenities, and user feedback into a focused buying and investment experience.',
      heroNote: 'AI-backed discovery across Cairo, Giza, the North Coast, the Red Sea, and the New Capital.',
      featured: 'Featured projects',
      featuredText: 'A quick look at high-signal communities from the copied static dataset.',
      market: 'Market lenses',
      marketText: 'Useful ways to read the same inventory before opening a deeper comparison.',
      locations: 'Location coverage',
      locationsText: 'Explore the districts and destination markets represented in the knowledge base.',
      workflow: 'How the intelligence layer helps',
      ctaTitle: 'Bring the analyst into the conversation.',
      ctaText:
        'The chatbot remains available as its own page and still calls the live structured real-estate agent endpoint.',
    },
    pages: {
      projectsTitle: 'Project portfolio',
      projectsIntro:
        'Browse projects by price band, developer, location, delivery timing, rating, and lifestyle tags.',
      locationsTitle: 'Locations',
      locationsIntro:
        'Understand where the inventory is concentrated and which areas serve residential, coastal, emerging, and premium use cases.',
      developersTitle: 'Developer bench',
      developersIntro:
        'Compare developer focus areas, founding history, ratings, and positioning signals.',
      insightsTitle: 'Investment insights',
      insightsIntro:
        'Read ROI, growth, yield, delivery speed, sentiment, and amenity signals from the static knowledge base.',
      chatTitle: 'AI real-estate analyst',
      chatIntro:
        'Ask comparisons, price questions, ROI questions, developer questions, and follow-ups with session memory.',
    },
    labels: {
      city: 'City',
      location: 'Location',
      developer: 'Developer',
      delivery: 'Delivery',
      rating: 'Rating',
      price: 'Price',
      priceRange: 'Price range',
      type: 'Type',
      focus: 'Focus',
      founded: 'Founded',
      risk: 'Risk',
      horizon: 'Horizon',
      metric: 'Metric',
      value: 'Value',
      sentiment: 'Sentiment',
      amenities: 'Amenities',
      projects: 'Projects',
      developers: 'Developers',
      locations: 'Locations',
      avgRating: 'Avg. rating',
      avgEntry: 'Avg. entry',
      topProject: 'Top project',
    },
    chat: {
      title: 'Intelligence Assistant',
      subtitle: 'Ask about projects, prices, developers, ROI, delivery, and comparisons.',
      online: 'Online',
      emptyTitle: 'Start a new analysis',
      emptyText: 'Choose a prompt above or ask your own real-estate question.',
      placeholder: 'Ask anything about real estate...',
      loading: 'Searching project data and preparing a structured answer',
      tabsChat: 'Chat',
      tabsInsights: 'Insights',
      decision: 'Decision Snapshot',
      summary: 'Project Summary',
      sources: 'Sources',
      emptySources: 'Sources will appear after an answer.',
      liveIssue: 'The live service needs attention.',
    },
    prompts: [
      ['Compare ZED East vs Mivida', 'Which is the better option between ZED East and Mivida?'],
      ['Best ROI compound', 'Which compound has the best ROI in New Cairo?'],
      ['Average sqm price', 'What is the average price per sqm in New Cairo?'],
      ['Top rated developers', 'Who are the top rated developers in Egypt?'],
      ['Delivery timeline', 'Compare delivery time for New Cairo projects.'],
      [
        'Follow-up memory',
        'Remember that I prefer New Cairo and delivery before 2027. What should I compare next?',
      ],
    ],
  },
  ar: {
    brand: 'AqarLens',
    metaTitle: 'AqarLens | ذكاء عقاري',
    metaDescription:
      'استكشف المشروعات العقارية والمطورين والمناطق وفرص الاستثمار والمرافق والمقارنات المدعومة بالذكاء الاصطناعي.',
    nav: {
      home: 'الرئيسية',
      projects: 'المشروعات',
      locations: 'المناطق',
      developers: 'المطورون',
      insights: 'الرؤى',
      chat: 'المساعد',
    },
    actions: {
      exploreProjects: 'استكشف المشروعات',
      askAgent: 'اسأل المساعد',
      viewInsights: 'عرض الرؤى',
      compare: 'قارن بالذكاء الاصطناعي',
      switchLanguage: 'English',
      newChat: 'محادثة جديدة',
    },
    home: {
      eyebrow: 'ذكاء عقاري للسوق المصري',
      title: 'اختر الكمباوند المناسب ببيانات واضحة قابلة للتنفيذ.',
      subtitle:
        'تجمع AqarLens بيانات المشروعات والمطورين والمناطق ومؤشرات الاستثمار والمرافق وآراء العملاء داخل تجربة بحث ومقارنة دقيقة.',
      heroNote: 'اكتشاف مدعوم بالذكاء الاصطناعي في القاهرة والجيزة والساحل الشمالي والبحر الأحمر والعاصمة الجديدة.',
      featured: 'مشروعات مختارة',
      featuredText: 'نظرة سريعة على مجتمعات عالية الأهمية من البيانات الثابتة المنسوخة.',
      market: 'زوايا قراءة السوق',
      marketText: 'طرق عملية لقراءة نفس المخزون قبل فتح مقارنة أعمق.',
      locations: 'تغطية المناطق',
      locationsText: 'استكشف المناطق والأسواق الوجهة الموجودة في قاعدة المعرفة.',
      workflow: 'كيف تساعد طبقة الذكاء',
      ctaTitle: 'ابدأ الحوار مع محلل عقاري ذكي.',
      ctaText:
        'صفحة المحادثة ما زالت مستقلة وتستخدم نفس نقطة الاتصال الحية الخاصة بالمساعد العقاري المنظم.',
    },
    pages: {
      projectsTitle: 'محفظة المشروعات',
      projectsIntro:
        'تصفح المشروعات حسب السعر والمطور والمنطقة وموعد التسليم والتقييم ووسوم نمط الحياة.',
      locationsTitle: 'المناطق',
      locationsIntro:
        'افهم توزيع المخزون والمناطق المناسبة للسكن والساحل والأسواق الناشئة والفاخرة.',
      developersTitle: 'المطورون',
      developersIntro:
        'قارن مجالات تركيز المطورين وتاريخ التأسيس والتقييمات وإشارات التميز.',
      insightsTitle: 'رؤى الاستثمار',
      insightsIntro:
        'اقرأ مؤشرات العائد والنمو والعائد الإيجاري وسرعة التسليم والمشاعر والمرافق من قاعدة المعرفة الثابتة.',
      chatTitle: 'محلل عقاري بالذكاء الاصطناعي',
      chatIntro:
        'اسأل عن المقارنات والأسعار والعائد والمطورين والمتابعات مع ذاكرة للجلسة.',
    },
    labels: {
      city: 'المدينة',
      location: 'المنطقة',
      developer: 'المطور',
      delivery: 'التسليم',
      rating: 'التقييم',
      price: 'السعر',
      priceRange: 'نطاق السعر',
      type: 'النوع',
      focus: 'التركيز',
      founded: 'تأسس',
      risk: 'المخاطر',
      horizon: 'الأفق',
      metric: 'المؤشر',
      value: 'القيمة',
      sentiment: 'الانطباع',
      amenities: 'المرافق',
      projects: 'المشروعات',
      developers: 'المطورون',
      locations: 'المناطق',
      avgRating: 'متوسط التقييم',
      avgEntry: 'متوسط البداية',
      topProject: 'أفضل مشروع',
    },
    chat: {
      title: 'مساعد التحليل',
      subtitle: 'اسأل عن المشروعات والأسعار والمطورين والعائد والتسليم والمقارنات.',
      online: 'متصل',
      emptyTitle: 'ابدأ تحليلا جديدا',
      emptyText: 'اختر سؤالا مقترحا أو اكتب سؤالك العقاري.',
      placeholder: 'اسأل أي شيء عن العقارات...',
      loading: 'يتم البحث في بيانات المشروعات وتجهيز إجابة منظمة',
      tabsChat: 'المحادثة',
      tabsInsights: 'الرؤى',
      decision: 'ملخص القرار',
      summary: 'ملخص المشروع',
      sources: 'المصادر',
      emptySources: 'ستظهر المصادر بعد الإجابة.',
      liveIssue: 'الخدمة الحية تحتاج إلى مراجعة.',
    },
    prompts: [
      ['قارن بين ZED East و Mivida', 'Which is the better option between ZED East and Mivida?'],
      ['أفضل عائد استثماري', 'Which compound has the best ROI in New Cairo?'],
      ['متوسط سعر المتر', 'What is the average price per sqm in New Cairo?'],
      ['أفضل المطورين', 'Who are the top rated developers in Egypt?'],
      ['مواعيد التسليم', 'Compare delivery time for New Cairo projects.'],
      [
        'ذاكرة المتابعة',
        'Remember that I prefer New Cairo and delivery before 2027. What should I compare next?',
      ],
    ],
  },
} as const

export type Dictionary = (typeof dictionaries)[Locale]

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
