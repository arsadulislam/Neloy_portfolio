import React from "react"
import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from "@/components/layout/theme-provider"
import { SITE_METADATA } from "@/lib/site-metadata"
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { AmbientCursor } from "@/components/layout/ambient-cursor"
import { PremiumBackground } from '@/components/layout/premium-background'
import { AccessibilityProvider } from "@/contexts/accessibility-context"
import { NavigationHubProvider } from "@/contexts/navigation-hub-context"
import { AccessibilityMenu } from "@/components/blocks/accessibility-menu"
import { ClientShell } from "@/components/layout/client-shell"
import localFont from 'next/font/local'

import "./globals.css"

const googleSans = localFont({
	src: '../../public/fonts/GoogleSans-VariableFont_GRAD,opsz,wght.ttf',
	variable: '--font-google-sans',
	display: 'swap'
})

const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata: Metadata = {
	metadataBase: new URL(SITE_METADATA.siteUrl),
	title: {
		default: SITE_METADATA.title,
		template: `%s | ${SITE_METADATA.title}`,
	},
	description: SITE_METADATA.description,
	keywords: SITE_METADATA.keywords,
	authors: [{ name: "Arsadul Islam (Neloy)", url: SITE_METADATA.siteUrl }],
	creator: "Arsadul Islam (Neloy)",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: SITE_METADATA.siteUrl,
		siteName: SITE_METADATA.siteName,
		title: SITE_METADATA.title,
		description: SITE_METADATA.description,
		images: [
			{
				url: "/og-image.png", // need to be changed
				width: 1200,
				height: 630,
				alt: SITE_METADATA.title,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: SITE_METADATA.title,
		description: SITE_METADATA.description,
		images: ["/og-image.png"], // need to be changed
		creator: "@arsadulislam",
	},
	icons: {
		icon: SITE_METADATA.favicon,
		shortcut: SITE_METADATA.favicon,
		apple: SITE_METADATA.favicon,
	},
	alternates: {
		canonical: "/",
	},
}

export const viewport: Viewport = {
	themeColor: '#0A0A0A',
}

const jsonLd = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "WebSite",
			"@id": `${SITE_METADATA.siteUrl}/#website`,
			"url": SITE_METADATA.siteUrl,
			"name": SITE_METADATA.siteName,
			"description": SITE_METADATA.description,
			"publisher": {
				"@id": `${SITE_METADATA.siteUrl}/#person`
			},
			"inLanguage": "en-US"
		},
		{
			"@type": "Person",
			"@id": `${SITE_METADATA.siteUrl}/#person`,
			"name": "Arsadul Islam (Neloy)",
			"url": SITE_METADATA.siteUrl,
			"image": {
				"@type": "ImageObject",
				"@id": `${SITE_METADATA.siteUrl}/#logo`,
				"url": `${SITE_METADATA.siteUrl}${SITE_METADATA.logo}`,
				"contentUrl": `${SITE_METADATA.siteUrl}${SITE_METADATA.logo}`,
				"caption": "Arsadul Islam (Neloy)"
			},
			"logo": {
				"@id": `${SITE_METADATA.siteUrl}/#logo`
			},
			"sameAs": [
				SITE_METADATA.social.github,
				SITE_METADATA.social.linkedin,
				SITE_METADATA.social.twitter,
				SITE_METADATA.social.instagram
			],
			"jobTitle": "IT Support & Network Engineer"
		}
	]
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" className={`${googleSans.variable} ${jetbrains.variable}`} suppressHydrationWarning>
			<head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
			</head>
			<body className="font-sans antialiased" suppressHydrationWarning>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<AccessibilityProvider>
						<NavigationHubProvider>
							<AmbientCursor />
							<PremiumBackground />
							<ClientShell>
								{children}
							</ClientShell>
							<AccessibilityMenu />
						</NavigationHubProvider>
					</AccessibilityProvider>
				</ThemeProvider>
				<SpeedInsights />
				<Analytics />
			</body>
		</html>
	);
}
