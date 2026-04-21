import { JORDAN_ID } from "./users";

const hoursAgo = (h) => new Date(Date.now() - h * 3600 * 1000).toISOString();
const daysAgo = (d) => new Date(Date.now() - d * 24 * 3600 * 1000).toISOString();

export const initialTrades = [
  {
    id: "t-inc-1",
    listingId: "l3",
    buyerId: "u-aiden",
    sellerId: JORDAN_ID,
    offerType: "buy",
    amount: 60,
    offeredListingId: null,
    note: "Would love to grab this — cash today, can meet at Langson.",
    status: "offer_sent",
    meetup: null,
    buyerConfirmed: false,
    sellerConfirmed: false,
    messages: [
      {
        id: "m1",
        fromId: "u-aiden",
        text: "Would love to grab this — cash today, can meet at Langson.",
        at: hoursAgo(3),
      },
    ],
    rating: null,
    createdAt: hoursAgo(3),
  },
  {
    id: "t-out-1",
    listingId: "l1",
    buyerId: JORDAN_ID,
    sellerId: "u-aiden",
    offerType: "buy",
    amount: 55,
    offeredListingId: null,
    note: "Interested! Would $55 work? Could meet tomorrow.",
    status: "offer_sent",
    meetup: null,
    buyerConfirmed: false,
    sellerConfirmed: false,
    messages: [
      {
        id: "m2",
        fromId: JORDAN_ID,
        text: "Interested! Would $55 work? Could meet tomorrow.",
        at: hoursAgo(20),
      },
    ],
    rating: null,
    createdAt: hoursAgo(20),
  },
  {
    id: "t-done-1",
    listingId: "l-past-1",
    buyerId: JORDAN_ID,
    sellerId: "u-alex",
    offerType: "buy",
    amount: 45,
    offeredListingId: null,
    note: "Picked up at Aldrich — perfect condition.",
    status: "complete",
    meetup: { zoneId: "zone-aldrich", time: daysAgo(6) },
    buyerConfirmed: true,
    sellerConfirmed: true,
    messages: [],
    rating: null,
    createdAt: daysAgo(7),
    completedAt: daysAgo(6),
  },
];

export const initialNotifications = [
  {
    id: "n1",
    type: "favorite",
    title: "Someone favorited your listing",
    message: "Aiden Park favorited your TI-84 Plus CE Calculator.",
    link: "/item/l3",
    read: false,
    at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: "n2",
    type: "offer",
    title: "New offer on your listing",
    message: "Aiden Park offered $60 on your TI-84 Plus CE.",
    link: "/trade/t-inc-1",
    read: false,
    at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "n3",
    type: "complete",
    title: "Trade complete — leave a rating",
    message: "You traded with Alex Kim for a Fujifilm Instax Mini 11.",
    link: "/trade/t-done-1/rate",
    read: false,
    at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
