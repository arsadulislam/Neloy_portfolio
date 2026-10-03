import { MetadataRoute } from 'next'
import { SITE_METADATA } from '@/lib/site-metadata'

export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date()

	return [
		{
			url: SITE_METADATA.siteUrl,
			lastModified,
			changeFrequency: 'monthly',
			priority: 1,
		},
		{
			url: `${SITE_METADATA.siteUrl}/about`,
			lastModified,
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${SITE_METADATA.siteUrl}/projects`,
			lastModified,
			changeFrequency: 'weekly',
			priority: 0.9,
		},
	]
}
