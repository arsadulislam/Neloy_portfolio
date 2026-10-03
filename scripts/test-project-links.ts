/**
 * Test script to verify all GitHub links in project-data.ts
 *
 * Checks:
 * 1. GitHub repo exists and is accessible (200 from API)
 * 2. README.md exists (via raw.githubusercontent.com)
 * 3. Live links are accessible (if present)
 *
 * Usage:  npx tsx scripts/test-project-links.ts
 */

import { projects } from "../src/lib/project-data";

const GITHUB_API = "https://api.github.com/repos";
const RAW_GITHUB = "https://raw.githubusercontent.com";

interface TestResult {
  project: string;
  repoUrl: string | undefined;
  repoExists: boolean | null;
  readmeExists: boolean | null;
  readmeBranch: string | null;
  liveUrl: string | undefined;
  liveAccessible: boolean | null;
  errors: string[];
}

function extractOwnerRepo(url: string): [string, string] | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/|$)/);
  if (!match) return null;
  return [match[1], match[2]];
}

async function testProject(project: (typeof projects)[0]): Promise<TestResult> {
  const result: TestResult = {
    project: project.title,
    repoUrl: project.github,
    repoExists: null,
    readmeExists: null,
    readmeBranch: null,
    liveUrl: project.live,
    liveAccessible: null,
    errors: [],
  };

  // ─── Test GitHub repo ───────────────────────────────────
  if (project.github) {
    const parsed = extractOwnerRepo(project.github);
    if (!parsed) {
      result.errors.push(`Invalid GitHub URL format: ${project.github}`);
      result.repoExists = false;
    } else {
      const [owner, repo] = parsed;

      // Check repo exists
      try {
        const res = await fetch(`${GITHUB_API}/${owner}/${repo}`, {
          headers: { "User-Agent": "portfolio-link-tester" },
        });
        result.repoExists = res.ok;
        if (!res.ok) {
          result.errors.push(`Repo returned ${res.status}: ${GITHUB_API}/${owner}/${repo}`);
        }
      } catch (e) {
        result.repoExists = false;
        result.errors.push(`Repo fetch failed: ${(e as Error).message}`);
      }

      // Check README exists (try main, then master)
      for (const branch of ["main", "master"]) {
        try {
          const rawUrl = `${RAW_GITHUB}/${owner}/${repo}/${branch}/README.md`;
          const res = await fetch(rawUrl);
          if (res.ok) {
            result.readmeExists = true;
            result.readmeBranch = branch;
            break;
          }
        } catch {
          // continue
        }
      }
      if (result.readmeExists === null) {
        result.readmeExists = false;
        result.errors.push("README.md not found on main or master branch");
      }
    }
  }

  // ─── Test live URL ──────────────────────────────────────
  if (project.live) {
    try {
      const res = await fetch(project.live, {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(10000),
      });
      result.liveAccessible = res.ok;
      if (!res.ok) {
        result.errors.push(`Live URL returned ${res.status}: ${project.live}`);
      }
    } catch (e) {
      result.liveAccessible = false;
      result.errors.push(`Live URL fetch failed: ${(e as Error).message}`);
    }
  }

  return result;
}

async function main() {
  console.log("╔═══════════════════════════════════════════════════╗");
  console.log("║     Portfolio Project Link Tester                 ║");
  console.log("╚═══════════════════════════════════════════════════╝\n");
  console.log(`Testing ${projects.length} projects...\n`);

  const results: TestResult[] = [];

  for (const project of projects) {
    process.stdout.write(`  Testing: ${project.title.substring(0, 45).padEnd(45)} `);
    const result = await testProject(project);
    results.push(result);

    if (result.errors.length === 0) {
      console.log("✅ PASS");
    } else {
      console.log("❌ FAIL");
      for (const err of result.errors) {
        console.log(`     └─ ${err}`);
      }
    }
  }

  // ─── Summary ──────────────────────────────────────────
  console.log("\n─────────────────────────────────────────────────────");
  const passed = results.filter((r) => r.errors.length === 0).length;
  const failed = results.filter((r) => r.errors.length > 0).length;
  console.log(`Results: ${passed} passed, ${failed} failed out of ${results.length} total\n`);

  // Detail table for repos
  console.log("GitHub Repos:");
  for (const r of results) {
    if (!r.repoUrl) {
      console.log(`  ⚪ ${r.project} — no GitHub link`);
      continue;
    }
    const repoIcon = r.repoExists ? "✅" : "❌";
    const readmeIcon = r.readmeExists ? `✅ (${r.readmeBranch})` : "❌ MISSING";
    console.log(`  ${repoIcon} ${r.project}`);
    console.log(`     Repo: ${repoIcon}  README: ${readmeIcon}`);
  }

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(console.error);
