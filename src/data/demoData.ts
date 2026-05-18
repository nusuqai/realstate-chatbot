import type { AgentResponse, ChatMessage, PromptCard } from '../types/agent'

export const endpoint = '/real-estate/query'

export const promptCards: PromptCard[] = [
  {
    icon: 'balance',
    label: 'Compare ZED East vs Mivida',
    query: 'Which is the better option between ZED East and Mivida?',
  },
  {
    icon: 'chart',
    label: 'Best ROI compound',
    query: 'Which compound has the best ROI in New Cairo?',
  },
  {
    icon: 'building',
    label: 'Average sqm price',
    query: 'What is the average price per sqm in New Cairo?',
  },
  {
    icon: 'star',
    label: 'Top rated developers',
    query: 'Who are the top rated developers in Egypt?',
  },
  {
    icon: 'truck',
    label: 'Delivery timeline',
    query: 'Compare delivery time for New Cairo projects.',
  },
  {
    icon: 'memory',
    label: 'Follow-up memory',
    query:
      'Remember that I prefer New Cairo and delivery before 2027. What should I compare next?',
  },
]

export const emptyResponse: AgentResponse = {
  text: '',
  charts: null,
  highlights: null,
  sources: null,
  followUpQuestions: null,
}

export const sampleResponse: AgentResponse = {
  text: `### Price Comparison between ZED East and Mivida

#### ZED East
- **Developer:** SODIC
- **Location:** New Cairo
- **Price Range:** 3,600,000 EGP - 9,800,000 EGP
- **Delivery Date:** October 2026
- **Rating:** 4.3

#### Mivida
- **Developer:** Emaar Misr
- **Location:** New Cairo
- **Price Range:** 4,200,000 EGP - 12,000,000 EGP
- **Delivery Date:** December 2025
- **Rating:** 4.5

### Summary
- **ZED East** has a lower price range starting from **3,600,000 EGP** compared to **Mivida** which starts from **4,200,000 EGP**.
- **Mivida** has a higher maximum price of **12,000,000 EGP** compared to **ZED East**'s maximum of **9,800,000 EGP**.
- **Mivida** has a slightly better rating of **4.5** compared to **ZED East**'s **4.3**.

### Conclusion
If you are looking for a more affordable option, **ZED East** is better. However, if you prioritize a higher rating and are willing to invest more, **Mivida** may be the better choice.`,
  charts: [
    {
      chartType: 'bar',
      title: 'Price Comparison of ZED East and Mivida',
      xField: 'Project',
      yField: 'Price (EGP)',
      series: [
        {
          name: 'ZED East',
          data: [
            { x: 'Min Price', y: 3600000 },
            { x: 'Max Price', y: 9800000 },
          ],
        },
        {
          name: 'Mivida',
          data: [
            { x: 'Min Price', y: 4200000 },
            { x: 'Max Price', y: 12000000 },
          ],
        },
      ],
      unit: 'EGP',
      notes: 'Comparison of minimum and maximum prices for both projects.',
    },
  ],
  highlights: [
    'ZED East is the more affordable entry point.',
    'Mivida has the higher rating and higher max price.',
    'Mivida delivers earlier based on the retrieved records.',
  ],
  sources: [
    {
      id: 'proj_022',
      title: 'ZED East',
      source: 'projects.en',
      score: 0.532395422,
    },
    {
      id: 'proj_002',
      title: 'Mivida',
      source: 'projects.en',
      score: 0.474077433,
    },
  ],
  followUpQuestions: [
    'What is the payment plan for ZED East?',
    'How do Mivida amenities compare to ZED East?',
    'Which New Cairo projects deliver before 2026?',
    'What is the average resale value in Mivida?',
  ],
}

export const initialMessages: ChatMessage[] = [
]
