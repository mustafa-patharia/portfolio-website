import { MetadataRoute } from 'next'
import { CASE_STUDIES } from '@/lib/case-studies'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mustafapatharia.vercel.app'

  const caseStudies = CASE_STUDIES.map((study) => ({
    url: `${baseUrl}/case-study/${study.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...['about', 'work', 'capabilities', 'journey', 'contact'].map((scene) => ({
      url: `${baseUrl}/${scene}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...caseStudies,
  ]
}
