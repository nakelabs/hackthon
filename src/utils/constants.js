// ─── API ─────────────────────────────────────────────────────────────────────
// Set VITE_API_BASE_URL in a .env file once your FastAPI backend is ready.
// Example: VITE_API_BASE_URL=https://api.nigeriacelebrates.com/api/v1
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || "";

// ─── App Meta ─────────────────────────────────────────────────────────────────
export const APP_NAME = "Nigeria Celebrates";
export const APP_TAGLINE = "One Nation. Infinite Talent. Endless Pride.";

// ─── Talent Categories ────────────────────────────────────────────────────────
export const TALENT_CATEGORIES = [
  { id: "music", label: "Music", emoji: "🎵", description: "Singing, rap, spoken word, instrumentals" },
  { id: "dance", label: "Dance", emoji: "💃", description: "Afrobeats, contemporary, street dance & more" },
  { id: "comedy", label: "Comedy", emoji: "😂", description: "Stand-up, skits, and satirical content" },
  { id: "fashion", label: "Fashion", emoji: "👗", description: "Style, design, modelling & fashion photography" },
  { id: "art", label: "Visual Art", emoji: "🎨", description: "Painting, sculpture, digital art & illustration" },
  { id: "culinary", label: "Culinary Arts", emoji: "🍲", description: "Cooking, baking & Nigerian cuisine mastery" },
  { id: "sport", label: "Sports", emoji: "⚽", description: "Athletic skills, fitness & sports excellence" },
  { id: "tech", label: "Technology", emoji: "💻", description: "Innovation, coding & tech entrepreneurship" },
  { id: "acting", label: "Acting & Drama", emoji: "🎭", description: "Film, theatre, Nollywood & screen performance" },
  { id: "writing", label: "Creative Writing", emoji: "✍️", description: "Poetry, fiction, journalism & storytelling" },
  { id: "business", label: "Entrepreneurship", emoji: "🚀", description: "Business innovation & startup excellence" },
];

// ─── Quiz Config ──────────────────────────────────────────────────────────────
export const QUIZ_QUESTION_DURATION_SECONDS = 30;

// ─── Local Storage Keys ───────────────────────────────────────────────────────
export const LS_TOKEN_KEY = "nc_auth_token";
export const LS_USER_KEY = "nc_user";

// ─── Mock Leaderboard Data ────────────────────────────────────────────────────
export const MOCK_STATE_LEADERBOARD = [
  { rank: 1, state: "Lagos", score: "84.2K", tag: "Engagement" },
  { rank: 2, state: "Abuja", score: "62.1K", tag: "Engagement" },
  { rank: 3, state: "Rivers", score: "58.9K", tag: "Engagement" },
  { rank: 4, state: "Oyo", score: "45.3K", tag: "Engagement" },
  { rank: 5, state: "Kano", score: "39.8K", tag: "Engagement" },
  { rank: 6, state: "Enugu", score: "32.4K", tag: "Engagement" },
];

export const MOCK_STATE_PARTICIPANTS = {
  "Lagos": [
    { name: "Wale Adebayo", category: "Music", votes: "24.1K" },
    { name: "Chioma Chukwu", category: "Tech", votes: "19.5K" },
    { name: "Tunde O.", category: "Comedy", votes: "15.2K" },
  ],
  "Abuja": [
    { name: "Fatima Sani", category: "Art", votes: "18.3K" },
    { name: "John Doe", category: "Fashion", votes: "14.1K" },
    { name: "Abubakar M.", category: "Tech", votes: "11.0K" },
  ],
  "Rivers": [
    { name: "Precious I.", category: "Music", votes: "16.8K" },
    { name: "David E.", category: "Dance", votes: "13.2K" },
    { name: "Joy N.", category: "Comedy", votes: "9.5K" },
  ],
  "Oyo": [
    { name: "Bisi A.", category: "Tech", votes: "12.1K" },
    { name: "Segun O.", category: "Art", votes: "8.4K" },
  ],
  "Kano": [
    { name: "Mustapha I.", category: "Tech", votes: "11.2K" },
    { name: "Aisha B.", category: "Fashion", votes: "7.9K" },
  ],
  "Enugu": [
    { name: "Chinedu E.", category: "Music", votes: "10.1K" },
    { name: "Ngozi O.", category: "Dance", votes: "6.5K" },
  ]
};
