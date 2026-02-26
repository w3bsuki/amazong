import type { EvalCase } from "@/lib/ai/eval/harness"

export const listingAutofillGoldenSet: EvalCase[] = [
  {
    id: "autofill-en-iphone-used-excellent",
    locale: "en",
    input: {
      imageDescription:
        "Black Apple iPhone 13 in hand, visible dual camera, minor edge wear, no box.",
    },
    expected: {
      titleKeywords: ["iphone", "13", "black"],
      categorySlug: "phones",
      condition: "used-excellent",
    },
  },
  {
    id: "autofill-bg-zara-jacket-like-new",
    locale: "bg",
    input: {
      imageDescription:
        "Дамско яке Zara в бежов цвят, чисто, без следи от носене, на закачалка.",
    },
    expected: {
      titleKeywords: ["zara", "яке", "бежово"],
      categorySlug: "women-clothing",
      condition: "used-like-new",
    },
  },
  {
    id: "autofill-en-ps5-new-without-tags",
    locale: "en",
    input: {
      imageDescription:
        "PlayStation 5 console with controller and cables on table, looks unused, open box.",
    },
    expected: {
      titleKeywords: ["playstation", "ps5", "console"],
      categorySlug: "video-games-consoles",
      condition: "new-without-tags",
    },
  },
  {
    id: "autofill-bg-nike-sneakers-used-good",
    locale: "bg",
    input: {
      imageDescription:
        "Маратонки Nike Air, бяло/черни, видими следи от носене по подметките.",
    },
    expected: {
      titleKeywords: ["nike", "маратонки", "air"],
      categorySlug: "shoes",
      condition: "used-good",
    },
  },
  {
    id: "autofill-en-office-chair-used-fair",
    locale: "en",
    input: {
      imageDescription:
        "Gray ergonomic office chair with worn armrests and small tear on seat fabric.",
    },
    expected: {
      titleKeywords: ["office", "chair", "ergonomic"],
      categorySlug: "office-furniture",
      condition: "used-fair",
    },
  },
]
