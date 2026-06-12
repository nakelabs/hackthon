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
  { id: "music", label: "Music / Songs", dbName: "Music", emoji: "🎵", description: "Singing, rap, spoken word, instrumentals" },
  { id: "football", label: "Football Freestyle", dbName: "Football Freestyle", emoji: "⚽", description: "Football juggling and tricks" },
  { id: "basketball", label: "Basketball Freestyle", dbName: "Basketball Freestyle", emoji: "🏀", description: "Basketball handling and tricks" },
  { id: "comedy", label: "Comedy Skits", dbName: "Comedy Skits", emoji: "😂", description: "Stand-up, skits, and satirical content" },
  { id: "artwork", label: "Artwork (Handmade Only)", dbName: "Handmade Artwork", emoji: "🎨", description: "Pencil drawings, paintings, sculptures, beadwork, traditional craft (no digital art)" },
  { id: "hair", label: "Hair Artistry", dbName: "Hair Artistry", emoji: "✂️", description: "Braiding, styling, creative hair designs, short styling videos" },
  { id: "fashion", label: "Fashion Showcase", dbName: "Fashion", emoji: "👗", description: "Style, design, modelling & fashion" },
  { id: "film", label: "My Nigeria Story (Short Film)", dbName: "Short Film", emoji: "🎬", description: "Short films and cinematic storytelling" },
  { id: "photography", label: "Photography", dbName: "Photography", emoji: "📸", description: "Capturing Nigeria through the lens" },
  { id: "tech", label: "Tech Innovation", dbName: "Tech Innovation", emoji: "💻", description: "Innovation, coding & tech entrepreneurship" },
  { id: "logo", label: "Logo Design", dbName: "Logo Design", emoji: "💡", description: "Original logos, branding concepts, mockups, optional explanation videos" },
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
