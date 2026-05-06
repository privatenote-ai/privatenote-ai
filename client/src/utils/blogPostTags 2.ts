/** `blog_posts.tags` is stored as a JSON string in SQLite. */
export function parseBlogPostTags(tags: string | null | undefined): string[] {
  if (tags == null || tags === "") return [];
  try {
    const parsed = JSON.parse(tags) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((t): t is string => typeof t === "string");
    }
    return [];
  } catch {
    return [];
  }
}
