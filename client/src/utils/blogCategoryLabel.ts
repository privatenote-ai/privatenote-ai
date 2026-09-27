import type { BlogCategory } from "@shared/blogCategories";
import type { Translations } from "@/utils/translations/types";

/** Localized display label for a primary blog category. */
export function blogCategoryLabel(category: BlogCategory, t: Translations): string {
  switch (category) {
    case "secrets":
      return t.blogCategorySecrets;
    case "encryption":
      return t.blogCategoryEncryption;
    case "privacy":
      return t.blogCategoryPrivacy;
    case "ai":
      return t.blogCategoryAi;
    case "developers":
      return t.blogCategoryDevelopers;
    default: {
      const _exhaustive: never = category;
      return _exhaustive;
    }
  }
}

/** Localized landing-page description for a primary blog category. */
export function blogCategoryDescription(category: BlogCategory, t: Translations): string {
  switch (category) {
    case "secrets":
      return t.blogCategorySecretsDescription;
    case "encryption":
      return t.blogCategoryEncryptionDescription;
    case "privacy":
      return t.blogCategoryPrivacyDescription;
    case "ai":
      return t.blogCategoryAiDescription;
    case "developers":
      return t.blogCategoryDevelopersDescription;
    default: {
      const _exhaustive: never = category;
      return _exhaustive;
    }
  }
}
