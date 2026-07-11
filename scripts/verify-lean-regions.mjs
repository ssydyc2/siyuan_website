import { readFileSync } from 'node:fs';

const markdownPath = new URL('../src/content/blog/abel-ruffini-backwards.md', import.meta.url);
const leanPath = new URL('../formal/abel-ruffini/AbelRuffini.lean', import.meta.url);
const markdown = readFileSync(markdownPath, 'utf8');
const lean = readFileSync(leanPath, 'utf8');

function collectMatches(source, pattern, label) {
  const values = [];
  const seen = new Set();

  for (const match of source.matchAll(pattern)) {
    const value = match[1];

    if (seen.has(value)) {
      throw new Error(`Duplicate ${label}: ${value}`);
    }

    seen.add(value);
    values.push(value);
  }

  return values;
}

const directiveIds = collectMatches(
  markdown,
  /^:::\s+proof-lean\s+([a-z0-9-]+)\s*$/gim,
  'proof-lean directive',
);
const regionIds = collectMatches(
  lean,
  /^\s*--\s*region\s+([a-z0-9-]+)\s*$/gim,
  'Lean region',
);
const endRegionIds = collectMatches(
  lean,
  /^\s*--\s*endregion\s+([a-z0-9-]+)\s*$/gim,
  'Lean endregion',
);

const directiveSet = new Set(directiveIds);
const regionSet = new Set(regionIds);
const endRegionSet = new Set(endRegionIds);
const missingRegions = directiveIds.filter((id) => !regionSet.has(id));
const unusedRegions = regionIds.filter((id) => !directiveSet.has(id));
const unclosedRegions = regionIds.filter((id) => !endRegionSet.has(id));
const strayEndRegions = endRegionIds.filter((id) => !regionSet.has(id));

if (missingRegions.length || unusedRegions.length || unclosedRegions.length || strayEndRegions.length) {
  throw new Error([
    missingRegions.length ? `Missing regions: ${missingRegions.join(', ')}` : '',
    unusedRegions.length ? `Unused regions: ${unusedRegions.join(', ')}` : '',
    unclosedRegions.length ? `Unclosed regions: ${unclosedRegions.join(', ')}` : '',
    strayEndRegions.length ? `Stray endregions: ${strayEndRegions.join(', ')}` : '',
  ].filter(Boolean).join('\n'));
}

console.log(`Verified ${directiveIds.length} article-to-Lean proof regions.`);
