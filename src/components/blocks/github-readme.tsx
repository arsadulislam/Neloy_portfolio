"use client";

import { useEffect, useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { FileText } from "lucide-react";

interface GitHubReadmeProps {
	githubUrl: string;
}

export function GitHubReadme({ githubUrl }: GitHubReadmeProps) {
	const [markdown, setMarkdown] = useState<string | null>(null);
	const [repoMeta, setRepoMeta] = useState<{
		owner: string;
		repo: string;
		branch: string;
	} | null>(null);
	const [status, setStatus] = useState<"loading" | "success" | "error">(
		"loading"
	);

	useEffect(() => {
		let cancelled = false;

		async function fetchReadme() {
			try {
				const res = await fetch(
					`/api/readme?url=${encodeURIComponent(githubUrl)}`
				);
				if (!res.ok) throw new Error("Failed to fetch");
				const data = await res.json();
				if (!cancelled) {
					setMarkdown(data.markdown);
					setRepoMeta({
						owner: data.owner,
						repo: data.repo,
						branch: data.branch,
					});
					setStatus("success");
				}
			} catch {
				if (!cancelled) setStatus("error");
			}
		}

		fetchReadme();
		return () => {
			cancelled = true;
		};
	}, [githubUrl]);

	// Build base URL for resolving relative images
	const imageBaseUrl = useMemo(() => {
		if (!repoMeta) return "";
		return `https://raw.githubusercontent.com/${repoMeta.owner}/${repoMeta.repo}/${repoMeta.branch}`;
	}, [repoMeta]);

	// Custom components for react-markdown to match the portfolio UI
	const components: Components = useMemo(
		() => ({
			// Headings
			h1: ({ children }) => (
				<h3 className="mb-4 mt-8 first:mt-0 border-b border-border pb-2 font-mono text-base font-semibold tracking-wide text-foreground">
					{children}
				</h3>
			),
			h2: ({ children }) => (
				<h4 className="mb-3 mt-6 border-b border-border/50 pb-1.5 font-mono text-sm font-semibold tracking-wide text-foreground">
					{children}
				</h4>
			),
			h3: ({ children }) => (
				<h5 className="mb-2 mt-5 font-mono text-sm font-medium text-foreground">
					{children}
				</h5>
			),
			h4: ({ children }) => (
				<h6 className="mb-2 mt-4 font-mono text-xs font-medium text-foreground">
					{children}
				</h6>
			),
			h5: ({ children }) => (
				<h6 className="mb-1 mt-3 font-mono text-xs font-medium text-muted-foreground">
					{children}
				</h6>
			),
			h6: ({ children }) => (
				<h6 className="mb-1 mt-3 font-mono text-[11px] font-medium text-muted-foreground">
					{children}
				</h6>
			),

			// Paragraphs
			p: ({ children }) => (
				<p className="mb-3 text-xs leading-relaxed text-muted-foreground md:text-sm">
					{children}
				</p>
			),

			// Links
			a: ({ href, children }) => (
				<a
					href={href}
					target="_blank"
					rel="noopener noreferrer"
					className="text-primary underline-offset-2 transition-colors hover:underline"
				>
					{children}
				</a>
			),

			// Lists
			ul: ({ children }) => (
				<ul className="mb-3 ml-4 list-disc space-y-1 text-xs text-muted-foreground md:text-sm">
					{children}
				</ul>
			),
			ol: ({ children }) => (
				<ol className="mb-3 ml-4 list-decimal space-y-1 text-xs text-muted-foreground md:text-sm">
					{children}
				</ol>
			),
			li: ({ children }) => (
				<li className="leading-relaxed">{children}</li>
			),

			// Code blocks
			pre: ({ children }) => (
				<pre className="mb-3 overflow-x-auto rounded-sm border border-border bg-secondary/50 p-4 text-[11px] leading-relaxed md:text-xs">
					{children}
				</pre>
			),
			code: ({ className, children }) => {
				const isBlock = className?.includes("language-");
				if (isBlock) {
					return (
						<code className="font-mono text-foreground">
							{children}
						</code>
					);
				}
				return (
					<code className="rounded-sm bg-secondary px-1.5 py-0.5 font-mono text-[11px] text-primary">
						{children}
					</code>
				);
			},

			// Block quotes
			blockquote: ({ children }) => (
				<blockquote className="mb-3 border-l-2 border-primary/40 pl-4 text-xs italic text-muted-foreground md:text-sm">
					{children}
				</blockquote>
			),

			// Horizontal rules
			hr: () => <hr className="my-6 border-border" />,

			// Tables
			table: ({ children }) => (
				<div className="mb-3 overflow-x-auto rounded-sm border border-border">
					<table className="w-full text-xs md:text-sm">
						{children}
					</table>
				</div>
			),
			thead: ({ children }) => (
				<thead className="border-b border-border bg-secondary/50">
					{children}
				</thead>
			),
			tbody: ({ children }) => <tbody>{children}</tbody>,
			tr: ({ children }) => (
				<tr className="border-b border-border/50 last:border-0">
					{children}
				</tr>
			),
			th: ({ children }) => (
				<th className="px-3 py-2 text-left font-mono text-xs font-medium text-foreground">
					{children}
				</th>
			),
			td: ({ children }) => (
				<td className="px-3 py-2 text-muted-foreground">
					{children}
				</td>
			),

			// Images — resolve relative paths to raw.githubusercontent
			img: ({ src, alt }) => {
				let resolvedSrc = String(src || "");
				// If it's a relative path, resolve against the repo's raw URL
				if (
					resolvedSrc &&
					!resolvedSrc.startsWith("http") &&
					imageBaseUrl
				) {
					resolvedSrc = `${imageBaseUrl}/${resolvedSrc.replace(/^\.?\//, "")}`;
				}
				return (
					<span className="my-3 block">
						<img
							src={resolvedSrc}
							alt={alt || ""}
							className="max-w-full rounded-sm border border-border"
							loading="lazy"
						/>
					</span>
				);
			},

			// Strong / emphasis
			strong: ({ children }) => (
				<strong className="font-semibold text-foreground">
					{children}
				</strong>
			),
			em: ({ children }) => <em className="italic">{children}</em>,
		}),
		[imageBaseUrl]
	);

	// Don't render anything if error — layout stays clean
	if (status === "error") return null;

	// Loading skeleton
	if (status === "loading") {
		return (
			<div className="mt-2">
				<h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-primary md:text-sm">
					README.md
				</h3>
				<div className="space-y-3 rounded-sm border border-border bg-secondary/20 p-6">
					<div className="h-3 w-3/4 animate-pulse rounded bg-border" />
					<div className="h-3 w-full animate-pulse rounded bg-border" />
					<div className="h-3 w-5/6 animate-pulse rounded bg-border" />
					<div className="h-3 w-2/3 animate-pulse rounded bg-border" />
					<div className="mt-4 h-3 w-full animate-pulse rounded bg-border" />
					<div className="h-3 w-4/5 animate-pulse rounded bg-border" />
				</div>
			</div>
		);
	}

	if (!markdown) return null;

	return (
		<div className="mt-2 w-0 min-w-full">
			<div className="mb-4 flex items-center gap-2">
				<FileText className="h-4 w-4 text-primary" />
				<h3 className="font-mono text-xs uppercase tracking-widest text-primary md:text-sm">
					README.md
				</h3>
			</div>
			<div className="overflow-x-auto rounded-sm border border-border bg-secondary/10 p-3 md:p-5 lg:p-6">
				<ReactMarkdown
					remarkPlugins={[remarkGfm]}
					components={components}
				>
					{markdown}
				</ReactMarkdown>
			</div>
		</div>
	);
}
