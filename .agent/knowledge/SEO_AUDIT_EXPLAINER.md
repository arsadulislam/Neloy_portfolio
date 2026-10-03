# SEO & Performance Audit Explainer

This document breaks down the results from your page speed and SEO reports. It explains the terminology, why it matters, and how we are addressing it for **VirajMavani.dev**.

---

## 1. Meta-Information (What Bots See First)

### Page Title Length
*   **Term**: The `<title>` tag in your HTML.
*   **The Issue**: "Viraj Mavani" is 12 characters. Auditors recommend 50–60 characters (or ~580 pixels) to fill the space in Google search results. 
*   **Why it matters**: A longer, keyword-rich title helps Google understand that you aren't just a "Person," but a specific type of professional (e.g., "AI Engineer").
*   **Action**: We will change it to something like `Viraj Mavani | Full Stack AI Engineer & Research`.

### H1 Heading
*   **Term**: The "Main Header" of your page. There should only be one `<h1>`.
*   **The Issue**: "Hello, I am VM." is short and doesn't contain your full name or keywords.
*   **Why it matters**: The H1 is the strongest signal to Google about what the page is about.
*   **Action**: We will expand this to be more descriptive, like `Hello, I'm Viraj Mavani, a Full Stack AI Engineer.`

---

## 2. Content Structure & Density

### Headings (Count & Duplication)
*   **Term**: `<h2>`, `<h3>`, tags used for sub-sections.
*   **The Issue**: Duplicate heading texts or a high number of headings relative to text.
*   **Why it matters**: If you have 30 headings but very little "body text," Google might think the page is a list of links rather than high-quality content. 
*   **Context**: In a "Bento" style portfolio, many headers are used for grid labels. This often triggers "Warning" flags even if the design is intentional.

### Internal Links
*   **Term**: Links that point to other pages or sections *inside* your own website.
*   **The Issue**: You only have 3.
*   **Why it matters**: Google "crawls" your site by following links. If there are few links, the bot might not discover all your content.
*   **Action**: We can add anchor links (e.g., `#projects`, `#about`) to your navigation to increase this density.

---

## 3. Technical Performance

### Website Download Size (6.13MB)
*   **Term**: The total weight of all files (HTML, CSS, JS, Images) sent to the user.
*   **The Issue**: Over the 5MB "safe limit."
*   **Why it matters**: High file size = slow loading on mobile/slow 4G. Slow sites are penalized by Google.
*   **Likely Cause**: Your high-quality photos (Bento gallery) are likely the reason. 
*   **Action**: We need to ensure we are using Next.js `next/image` component which automatically shrinks and compresses these images.

### HTTP2 Usage
*   **Term**: A modern way for the browser to talk to the server (more efficient than HTTP/1.1).
*   **Context**: This is handled by your **hosting provider** (like Vercel or Netlify). On your local "dev" server, it might show as outdated, but once deployed to a modern cloud provider, it will automatically use HTTP/2 or HTTP/3.

### Inline Styles
*   **Term**: CSS code written directly inside HTML tags (e.g., `<div style="...">`).
*   **Why it matters**: It's harder for browsers to cache and can lead to messy code.
*   **Context**: We use **Tailwind CSS**. Some auditors mistakenly flag Tailwind's utility classes or the "framer-motion" animations as inline styles. This is usually a false positive, but we will minimize explicit `style` props where possible.

---

## 4. Connectivity & Authority

### Backlinks
*   **Term**: Other websites linking *to* your portfolio.
*   **The Issue**: You have few "referring domains."
*   **Why it matters**: This is the "Credit Score" of the internet. The more reputable sites link to you, the higher you rank.
*   **Action**: This is not a code fix. You improve this by sharing your site on LinkedIn, GitHub, and other blogs over time.

### Facebook Pixel / Page
*   **Term**: Tracking code used for Facebook Ads.
*   **Why it matters**: Only important if you plan to pay Facebook to show people your site. 
*   **Action**: For a personal developer portfolio, a Facebook Pixel is usually **not recommended** as it adds unnecessary tracking and slows down the page.

---

## 5. Critical Issues

### Structured Data (Red Flag)
*   **Term**: The JSON-LD code we added for Google to understand you.
*   **The Issue**: Audit reported "Critical Errors."
*   **Action**: I am re-verifying the formatting. Common errors include missing a comma or using an "incomplete" social link. I will check this immediately.

### DOM Size
*   **Term**: The total number of elements (boxes, text, images) on the page.
*   **The Issue**: "Unable to retrieve."
*   **Context**: This usually happens if the auditing tool timed out because the site's animations (which we have many of) made it hard for the bot to finish "reading" the page.
