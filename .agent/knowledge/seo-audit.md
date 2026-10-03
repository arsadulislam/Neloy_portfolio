# Persistent SEO Audit Log & Roadmap

This file serves as a long-term memory for SEO improvements and audit results for **VirajMavani.dev**. This ensures that the context persists across different AI sessions.

## 1. Audit Points (Found March 16, 2026)

### High Priority Fixes
- **Title Length**: Currently ~110px. Needs to be ~580px (approx. 50-60 characters).
- **H1 Heading**: Currently "Hello, I am VM." (15 chars). Needs to be >20 chars and keyword-rich.
- **Structured Data**: Tool reported "Critical Errors." 
  - *Status*: I have dynamicized the JSON-LD in `layout.tsx` to use `SITE_METADATA`, but a direct schema validation on a production URL is needed to clear the final "red flags."
- **Internal Links**: Only 3 detected.
  - *Strategy*: Increase internal anchor links in the navigation and content.

### Performance & Technical
- **Page Size**: 6.13MB (Goal: <5MB).
  - *Strategy*: Audit image sizes in `public/photos/` and ensure `next/image` is fully optimized.
- **DOM Size**: Reported as unreachable/unstable.
  - *Strategy*: Monitor if animations (framer-motion) are creating too many hidden DOM nodes.
- **Inline Styles**: Flagged as bad practice.
  - *Strategy*: Most are likely Tailwind/Motion false positives, but we should audit for explicit `style={{...}}` props.

## 2. Future Context (Do Not Re-Ask)

- **Social Links**: Confirmed and verified as follows:
  - GitHub: `https://github.com/Viraj-Mavani`
  - LinkedIn: `https://www.linkedin.com/in/viraj-mavani/`
  - Twitter: `https://twitter.com/Viraj__Mavani`
  - Discord: `https://discord.com/users/atom1zer`
  - Instagram: `https://www.instagram.com/veer.mavani`
- **OG Image**: We are currently using a 1200x630 premium text-based image. We decided to "leave it" for now to focus on technical SEO.
- **HTTP2**: This is a hosting-level feature (handled by Vercel/Netlify) and not a code-level bug.

## 3. SEO Knowledge Artifacts
- [SEO_OVERVIEW.md](file:///d:/Projects/my-portfolio/.agent/knowledge/SEO_OVERVIEW.md) - The "What/Where/Why" guide.
- [SEO_AUDIT_EXPLAINER.md](file:///d:/Projects/my-portfolio/.agent/knowledge/SEO_AUDIT_EXPLAINER.md) - Deep dive into audit terminology.
