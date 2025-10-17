// Utilities for working with NewsItem data without hardcoding content.
import type { NewsItem } from "./types"

export function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function slugifyCategory(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export function getCategories(items: NewsItem[]) {
  if (!Array.isArray(items)) {
    return []
  }
  const set = new Set(
    items.filter((i) => i.categrory_Name?.trim()).map((i) => i.categrory_Name.trim()),
  )
  return Array.from(set).sort()
}

export function getBySlug(items: NewsItem[], slug: string) {
  if (!Array.isArray(items)) {
    return undefined
  }
  return items.find((i) => i.slug === slug)
}

export function filterByCategory(items: NewsItem[], categorySlug: string) {
  if (!Array.isArray(items)) {
    return []
  }
  return items.filter((i) => slugifyCategory(i.categrory_Name) === categorySlug)
}

export function getCategoryFromSlug(items: NewsItem[], categorySlug: string) {
  if (!Array.isArray(items)) {
    return categorySlug
  }
  const found = items.find((i) => slugifyCategory(i.categrory_Name) === categorySlug)
  return found?.categrory_Name || categorySlug
}

// Convert simple HTML content to plaintext for previews. Keeps basic text, strips tags.
export function htmlToText(html?: string) {
  if (!html || typeof html !== "string") return ""
  // Replace line breaks and list tags with separators
  const withBreaks = html
    .replace(/<\/(p|div|li|h\d)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
  // Remove all remaining tags
  const text = withBreaks.replace(/<[^>]+>/g, "")
  // Decode basic HTML entities
  const decoded = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
  return decoded.replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim()
}

// Ensure image URL is absolute and allowed by next/image. Fallback to placeholder.
export function normalizeImage(url?: string) {
  if (!url || typeof url !== "string") return "/placeholder.svg"
  try {
    // Many API URLs are already absolute; return as-is
    const u = new URL(url, typeof window === 'undefined' ? 'https://newssiteimages.timesmed.com' : window.location.origin)
    return u.toString()
  } catch {
    return "/placeholder.svg"
  }
}
