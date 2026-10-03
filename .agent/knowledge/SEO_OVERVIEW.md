# SEO Configuration Overview

This document provides a summary of the SEO strategy and configurations implemented for **VirajMavani.dev**. It details what is configured, which files handle it, and why it's important for your search engine visibility.

## 1. Core Meta Data
**File**: `src/lib/site-metadata.ts`
**Purpose**: Centralized source of truth for all brand and personal data. This prevents inconsistencies across the site.

### Data Points to Confirm:
*   **Site Name**: `VirajMavani.dev`
*   **Official URL**: `https://virajmavani.dev`
*   **Description**: `Full Stack AI Engineer. Merging Full Stack Engineering with AI Research to create production-grade solutions.`
*   **Keywords**: `Viraj Mavani, AI Engineer, Full Stack Developer, AI Research, Machine Learning`

### Social Media Handles:
*   **GitHub**: `https://github.com/Viraj-Mavani`
*   **LinkedIn**: `https://www.linkedin.com/in/viraj-mavani/`
*   **Twitter/X**: `https://twitter.com/Viraj__Mavani`
*   **Discord**: `https://discord.com/users/atom1zer`
*   **Instagram**: `https://www.instagram.com/veer.mavani`

---

## 2. Global Metadata & Social Sharing
**File**: `src/app/layout.tsx`
**Purpose**: Injects the metadata into every page of the site.

*   **Canonical Tags**: Tells Google that `https://virajmavani.dev` is the primary version of your site, preventing "duplicate content" issues.
*   **Open Graph (OG)**: Controls how your site looks when shared on Facebook, LinkedIn, etc.
*   **Twitter Cards**: Controls the appearance on X (formerly Twitter), including account attribution.
*   **Theme Color**: Set to `#0A0A0A` for a premium browser UI experience.

---

## 3. Search Engine Infrastructure
These files help Google's "bots" understand and index your site effectively.

### Sitemap
**File**: `src/app/sitemap.ts`
**Purpose**: A map for Google. It lists all important pages (`/`, `/about`, `/projects`) and tells Google how often they change and their priority level.

### Robots.txt
**File**: `src/app/robots.ts`
**Purpose**: Tells crawlers like Googlebot which parts of the site they are allowed to scan. It also points them directly to your Sitemap.

---

## 4. Structured Data (JSON-LD)
**File**: `src/app/layout.tsx` (Injected via `<script type="application/ld+json">`)
**Purpose**: This is "machine-readable" data. While humans don't see it, search engines use it to generate "Rich Results" (like your name appearing as a distinguished entity in search panels).

*   **WebSite Object**: Declares your official site name and URL.
*   **Person Object**: Directly links **Viraj Mavani** to your website and all your social media profiles listed above. This is crucial for "owning" the search results for your name.

---

## 5. Summary of Best Practices Applied
1.  **Unique Title Tag Hierarchy**: Global title with page-specific templates (e.g., "About | Viraj Mavani").
2.  **Semantic HTML**: Proper use of `<header>`, `<main>`, and `<footer>` tags.
3.  **Image Optimization Logic**: Alt tags and metadata sync for the Open Graph image.
4.  **No Contradictory Meta**: Verified that no page-specific metadata overrides the global setup in a way that would confuse search engines.
