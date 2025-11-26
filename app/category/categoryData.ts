export const categoryItems = {
  restaurant: {
    classic: [
      {
        id: 1,
        businessName: "Classic Bistro",
        title: "Gourmet Dinner Experience",
        description: "Traditional dishes with modern twist",
        image: "https://picsum.photos/seed/classic-1/600/400",
        rating: 4.8,
        applications: 89,
        location: "Downtown",
      },
      {
        id: 2,
        businessName: "Heritage Restaurant",
        title: "Family Style Dining",
        description: "Authentic recipes passed through generations",
        image: "https://picsum.photos/seed/classic-2/600/400",
        rating: 4.6,
        applications: 67,
        location: "Old Town",
      },
    ],
    "fast food": [
      {
        id: 3,
        businessName: "Burger Express",
        title: "Combo Meal Promotion",
        description: "Try our new burger lineup",
        image: "https://picsum.photos/seed/fastfood-1/600/400",
        rating: 4.3,
        applications: 123,
        location: "Mall District",
      },
    ],
    "world cuisine": [
      {
        id: 4,
        businessName: "Global Flavors",
        title: "International Food Festival",
        description: "Taste dishes from around the world",
        image: "https://picsum.photos/seed/world-1/600/400",
        rating: 4.9,
        applications: 156,
        location: "Cultural Center",
      },
    ],
  },
  beauty: {
    "hair salon": [
      {
        id: 5,
        businessName: "Luxe Hair Studio",
        title: "Complete Hair Transformation",
        description: "Cut, color, and styling package",
        image: "https://picsum.photos/seed/hair-1/600/400",
        rating: 4.7,
        applications: 78,
        location: "Uptown",
      },
    ],
    spa: [
      {
        id: 6,
        businessName: "Serenity Spa",
        title: "Full Day Spa Package",
        description: "Relax and rejuvenate with our premium treatments",
        image: "https://picsum.photos/seed/spa-1/600/400",
        rating: 4.9,
        applications: 94,
        location: "Wellness District",
      },
    ],
  },
  fitness: {
    "martial arts": [
      {
        id: 7,
        businessName: "Flow Combat Studio",
        title: "Kickboxing Training Session",
        description: "High-energy martial arts class including gear",
        image: "https://picsum.photos/seed/fitness-1/600/400",
        rating: 4.8,
        applications: 64,
        location: "Sports District",
      },
    ],
    yoga: [
      {
        id: 8,
        businessName: "Zen Yoga Hub",
        title: "Mindful Yoga Experience",
        description: "Private instructor-led zen yoga session",
        image: "https://picsum.photos/seed/fitness-2/600/400",
        rating: 4.7,
        applications: 72,
        location: "Green Park",
      },
    ],
  },
  fashion: {
    streetwear: [
      {
        id: 9,
        businessName: "Urban Threads",
        title: "Streetwear Capsule Launch",
        description: "Outfit styling and content for new capsule pieces",
        image: "https://picsum.photos/seed/fashion-1/600/400",
        rating: 4.6,
        applications: 82,
        location: "City Center",
      },
    ],
    luxury: [
      {
        id: 10,
        businessName: "Maison Elegante",
        title: "Runway Inspired Collaboration",
        description: "Showcase limited edition designer looks",
        image: "https://picsum.photos/seed/fashion-2/600/400",
        rating: 4.9,
        applications: 58,
        location: "Fashion Avenue",
      },
    ],
  },
  travel: {
    "boutique hotel": [
      {
        id: 11,
        businessName: "Sunset Cove Suites",
        title: "Weekend Stay Experience",
        description: "Highlight the boutique hotel's amenities and dining",
        image: "https://picsum.photos/seed/travel-1/600/400",
        rating: 4.8,
        applications: 73,
        location: "Coastal District",
      },
    ],
    adventure: [
      {
        id: 12,
        businessName: "Peak Trails Co.",
        title: "Mountain Adventure Retreat",
        description: "Document a curated hiking and wellness itinerary",
        image: "https://picsum.photos/seed/travel-2/600/400",
        rating: 4.7,
        applications: 65,
        location: "Highlands",
      },
    ],
  },
  // Add more categories and types as needed
};

export const isCategoryKey = (
  value: string
): value is keyof typeof categoryItems => value in categoryItems;

export const hasTypeKey = <T extends Record<string, unknown>>(
  obj: T,
  key: string
): key is Extract<keyof T, string> => key in obj;

