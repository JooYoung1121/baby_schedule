import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const targets = [
  {
    id: "bebecook",
    name: "베베쿡",
    url: "https://www.bebecook.com/page/exhibition/131?_bannerId=11005",
  },
  {
    id: "sangol",
    name: "산골이유식",
    url: "https://www.ssg.com/item/itemView.ssg?itemId=1000552209224",
  },
  {
    id: "jjangjuk",
    name: "짱죽",
    url: "https://www.jjangjuk.com/?device=mobile",
  },
  {
    id: "alvins",
    name: "엘빈즈",
    url: "https://www.alvins.co.kr/category/%EC%B4%88%EA%B8%B01-%284~5%EA%B0%9C%EC%9B%94%29/48/",
  },
  {
    id: "lusol",
    name: "루솔",
    url: "https://www.lusol.co.kr/",
  },
];

const promoKeywords = [
  "할인",
  "쿠폰",
  "특가",
  "이벤트",
  "기획전",
  "체험",
  "증정",
  "무료배송",
  "적립",
  "신규",
  "첫구매",
  "첫 구매",
  "Sale",
];

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function htmlToText(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function titleFromHtml(html, fallback) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  return title ? htmlToText(title).slice(0, 80) : fallback;
}

function unique(values) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function isUsefulSnippet(value) {
  if (value.includes("{{") || value.includes("}}")) return false;
  if (value.includes("alert") || value.includes("confirm")) return false;
  if (value.length < 8) return false;
  return true;
}

function extractPriceSnippets(text) {
  const matches = [];
  const pricePattern = /(?:\d{1,3}(?:,\d{3})+|\d{3,5})\s*원~?/g;
  for (const match of text.matchAll(pricePattern)) {
    const start = Math.max(0, match.index - 42);
    const end = Math.min(text.length, match.index + match[0].length + 42);
    matches.push(text.slice(start, end).replace(/\s+/g, " "));
  }
  return unique(matches).filter(isUsefulSnippet).slice(0, 8);
}

function extractPromoSnippets(text) {
  const matches = [];
  for (const keyword of promoKeywords) {
    let cursor = 0;
    while (matches.length < 12) {
      const index = text.indexOf(keyword, cursor);
      if (index === -1) break;
      const start = Math.max(0, index - 34);
      const end = Math.min(text.length, index + keyword.length + 54);
      matches.push(text.slice(start, end).replace(/\s+/g, " "));
      cursor = index + keyword.length;
    }
  }
  return unique(matches).filter(isUsefulSnippet).slice(0, 8);
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "baby-schedule-price-monitor/0.1 (+https://github.com/JooYoung1121/baby_schedule)",
        "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.5",
      },
    });
    const html = await response.text();
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return html;
  } finally {
    clearTimeout(timeout);
  }
}

async function scrapeTarget(target) {
  const checkedAt = new Date().toISOString();
  try {
    const html = await fetchWithTimeout(target.url);
    const text = htmlToText(html);
    return {
      id: target.id,
      name: target.name,
      url: target.url,
      checkedAt,
      status: "ok",
      title: titleFromHtml(html, target.name),
      priceSnippets: extractPriceSnippets(text),
      promoSnippets: extractPromoSnippets(text),
    };
  } catch (error) {
    return {
      id: target.id,
      name: target.name,
      url: target.url,
      checkedAt,
      status: "error",
      priceSnippets: [],
      promoSnippets: [],
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

const snapshot = {
  generatedAt: new Date().toISOString(),
  vendors: await Promise.all(targets.map(scrapeTarget)),
};

const outputPath = path.join(process.cwd(), "public", "vendor-snapshot.json");
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
console.log(`Wrote ${outputPath}`);
