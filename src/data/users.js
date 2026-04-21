export const JORDAN_ID = "u-jordan";

export const users = [
  {
    id: JORDAN_ID,
    name: "Jordan Chen",
    firstName: "Jordan",
    major: "Computer Science",
    year: "Junior",
    zotId: "88",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    completedTrades: 14,
    memberSince: "Sep 2023",
    bio: "CS junior — rotating desk gear, textbooks, and the occasional impulse buy.",
    venmo: "@JordanC-UCI",
    homeZoneId: "zone-alp",
  },
  {
    id: "u-aiden",
    name: "Aiden Park",
    firstName: "Aiden",
    major: "Computer Science",
    year: "Senior",
    zotId: "42",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    completedTrades: 21,
    memberSince: "Aug 2022",
    bio: "Senior CS — clearing out my setup before graduation.",
    venmo: "@AidenP",
  },
  {
    id: "u-maya",
    name: "Maya Patel",
    firstName: "Maya",
    major: "Data Science",
    year: "Sophomore",
    zotId: "73",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    rating: 4.7,
    completedTrades: 9,
    memberSince: "Sep 2024",
    bio: "Data sci — upgrading hardware, selling the old stuff.",
    venmo: "@MayaP",
  },
  {
    id: "u-sam",
    name: "Sam Rivera",
    firstName: "Sam",
    major: "Biology",
    year: "Sophomore",
    zotId: "56",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    rating: 4.6,
    completedTrades: 6,
    memberSince: "Sep 2024",
    bio: "Pre-med — lab gear and bio textbooks.",
    venmo: "@SamR",
  },
  {
    id: "u-emma",
    name: "Emma Zhao",
    firstName: "Emma",
    major: "Public Health",
    year: "Freshman",
    zotId: "19",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    completedTrades: 3,
    memberSince: "Sep 2025",
    bio: "New to UCI — decluttering my dorm.",
    venmo: "@EmmaZ",
  },
  {
    id: "u-alex",
    name: "Alex Kim",
    firstName: "Alex",
    major: "Studio Art",
    year: "Senior",
    zotId: "31",
    avatar:
      "https://images.unsplash.com/photo-1502767089025-6572583495b4?auto=format&fit=crop&w=400&q=80",
    rating: 5.0,
    completedTrades: 28,
    memberSince: "Aug 2022",
    bio: "Studio art — supplies, prints, dorm decor.",
    venmo: "@AlexKimArt",
  },
  {
    id: "u-taylor",
    name: "Taylor Nguyen",
    firstName: "Taylor",
    major: "Business Economics",
    year: "Junior",
    zotId: "64",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    rating: 4.5,
    completedTrades: 7,
    memberSince: "Sep 2023",
    bio: "Biz econ — interview wear and dorm stuff.",
    venmo: "@TaylorN-UCI",
  },
];

export function userById(id) {
  return users.find((u) => u.id === id) ?? null;
}
