export const phenotypes = {
  "Computer Science": ["tech", "keyboards", "monitor", "CS", "laptop", "desk setup", "STEM", "calculator", "accessories"],
  "Data Science": ["tech", "laptop", "STEM", "monitor"],
  Biology: ["textbooks", "bio", "science", "lab"],
  "Studio Art": ["art", "supplies", "creative", "dorm"],
  "Business Economics": ["textbooks", "clothing", "professional"],
  "Public Health": ["textbooks", "wellness", "dorm"],
  Engineering: ["tech", "tools", "textbooks", "STEM"],
  Psychology: ["textbooks", "dorm", "wellness"],
};

export function tagsForMajor(major) {
  return phenotypes[major] ?? [];
}

export function matchesMajor(listing, major) {
  const tags = new Set(tagsForMajor(major));
  return listing.tags?.some((t) => tags.has(t));
}
