import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const url = request.nextUrl.searchParams.get("url");

	if (!url) {
		return NextResponse.json(
			{ error: "Missing url parameter" },
			{ status: 400 }
		);
	}

	// Extract owner/repo from GitHub URL
	// Supports: https://github.com/owner/repo or https://github.com/owner/repo.git
	const match = url.match(
		/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/|$)/
	);
	if (!match) {
		return NextResponse.json(
			{ error: "Invalid GitHub URL" },
			{ status: 400 }
		);
	}

	const [, owner, repo] = match;

	// Try main branch first, fallback to master, and try different casing
	for (const branch of ["main", "master"]) {
		for (const filename of ["README.md", "readme.md"]) {
			try {
				const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filename}`;
				const res = await fetch(rawUrl, {
					next: { revalidate: 3600 }, // Cache for 1 hour
				});

				if (res.ok) {
					const markdown = await res.text();
					return NextResponse.json({ markdown, owner, repo, branch });
				}
			} catch {
				// Continue to next combination
			}
		}
	}

	return NextResponse.json(
		{ error: "README not found" },
		{ status: 404 }
	);
}
