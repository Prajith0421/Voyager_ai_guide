# Voyager — AI Local Guide

I wanted a travel companion that actually knows where you are — not one that serves up generic listicles of "top 10 things to do" with no connection to what's around you right now. What's actually open nearby? Can you build me a day itinerary from only real places I can walk to? So I built a React + TypeScript web app that pulls live place data from OpenStreetMap and Geoapify, layers it on an interactive Leaflet map, and connects it to a Gemini-powered AI chat that can only recommend places that genuinely exist in the current data. The pipeline is: sign in → location detection → live place fetch → AI conversation → map highlights.

---

## What It Does

Voyager answers the questions a good local friend would answer:

- **What's around me right now?** — restaurants, cafes, malls, parks, museums, hotels, and nightlife fetched live within a 5 km radius of your position
- **Can you plan my day?** — the AI builds itineraries using only real places in the current dataset, never invented ones
- **What's the forecast?** — current conditions plus a 5-day weather strip (daily high/low, description) fetched from Open-Meteo, no API key required
- **What's the vibe?** — live weather is injected into the AI context so recommendations match conditions
- **Where exactly is that?** — when the AI mentions a place by name, the map automatically highlights and focuses it, keeping chat and map in sync
- **Save what matters** — bookmark places to your account and retrieve them on any device

---

## What the App Is Not

Worth being upfront about a few specific limits:

- **Auth is required.** Every route sits behind a `ProtectedRoute` — there is no guest or preview mode. The app redirects to `/login` on first load and stays there until Supabase is configured and the user is signed in.
- **Place data is only as good as its sources.** Geoapify coverage and OpenStreetMap community contributions vary by city. Smaller or less-mapped cities may return sparse results, and the AI reflects that sparseness honestly rather than filling gaps with invented places.
- **The AI sees at most 100 places per turn.** In dense urban areas with hundreds of results, the assistant reasons only over that window and cannot reference places it was not given.
- **Weather descriptions use a local WMO code lookup.** Open-Meteo returns integer weather codes; Voyager maps them to human-readable descriptions via `weatherCodes.ts`. Codes not in the table fall back to a generic label.
- **Saved chats are stored but not yet browsable.** The `saved_chats` Supabase table and the `saveChat` service function are fully wired up, but there is no UI for listing or restoring past conversations — that is the most obvious next feature to build.

---

## Key Features

**Full Supabase auth.** Sign in and sign up live on the same `/login` page. Session state is managed via `useAuth`, which subscribes to `onAuthStateChange` so tabs and page refreshes stay in sync without an extra round-trip. `ProtectedRoute` redirects unauthenticated users to login; `GuestRoute` redirects already-authenticated users away from it.

**Free 5-day weather via Open-Meteo.** No API key required. A single call fetches current conditions plus a daily forecast, parses WMO codes into plain-language descriptions, and produces a typed `WeatherData` object that flows into both the UI widgets and the AI system prompt.

**AI chat grounded in real data.** The Gemini 2.0 Flash system prompt (via OpenRouter) receives the current location, live weather, category counts, and up to 100 real nearby places as JSON. Hallucinating a place name is explicitly blocked by prompt rule — if a category returns zero results, the model must say so and suggest a category that actually has data.

**Dual place sources with automatic fallback.** The app tries Geoapify first (structured category batches, cleaner data) and silently falls back to OpenStreetMap via the Overpass API if Geoapify is unconfigured or returns nothing. Both sources are deduplicated and normalised into the same internal `Place` type.

**Map–chat sync.** `matchPlacesInText` scans every AI response for place names present in the current dataset and calls `focusPlacesOnMap` automatically — the map pans and highlights exactly the places the assistant just mentioned.

**Saved places context.** `SavedPlacesProvider` manages bookmark state globally. `isSaved`, `savePlace`, and `removePlace` are available to any component via `useSavedPlaces()`. Deduplication via `placesMatch` silently prevents saving the same place twice from different data sources.

**Supabase Row Level Security.** `schema.sql` enables RLS on both `saved_places` and `saved_chats` and creates policies that enforce `auth.uid() = user_id` on every read and write — data is isolated per user at the database level, not just the application level.

**Animated polish.** `AnimatedBackground` runs three overlapping blur orbs in continuous Framer Motion loops. `PageTransition` and `PageTransitionItem` stagger child elements into view on mount with a custom cubic-bezier ease for intentional, fluid route changes.

---

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router v6
- Framer Motion (page transitions, animated background)
- Leaflet + React Leaflet (interactive map)
- OpenRouter API → Google Gemini 2.0 Flash (AI chat)
- Open-Meteo (weather — free, no key needed)
- Geoapify Places API (primary place data)
- OpenStreetMap / Overpass API (fallback place data)
- Nominatim (city geocoding)
- Supabase (auth, saved places, saved chats, RLS)
- react-markdown (AI response rendering)

---

## How to Run

```bash
# 1. Clone and install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
# Edit .env and fill in:
#   VITE_OPENROUTER_API_KEY   → https://openrouter.ai/keys          (required)
#   VITE_GEOAPIFY_API_KEY     → https://myprojects.geoapify.com/     (optional, improves place data)
#   VITE_SUPABASE_URL         → https://supabase.com/dashboard       (required)
#   VITE_SUPABASE_ANON_KEY    → your Supabase anon key               (required)
#   VITE_OPENROUTER_MODEL     → defaults to google/gemini-2.0-flash-001

# 3. Set up the Supabase database
# In your Supabase project, open the SQL editor and run:
#   supabase/schema.sql
# This creates the saved_places and saved_chats tables with RLS enabled.

# 4. Start the development server
npm run dev

# 5. Build for production
npm run build

# 6. Preview the production build locally
npm run preview
```

> **Note:** The app redirects to `/login` on first load. Supabase must be configured before the app is usable — the login page displays a configuration warning if `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are missing.

---

## Project Structure

```
src/
├── main.tsx                          # App entry point
├── App.tsx                           # Router + provider tree (Auth → SavedPlaces → Location → UI)
├── index.css                         # Global styles
├── pages/
│   ├── LoginPage.tsx                 # Sign in / sign up with animated background
│   ├── DashboardPage.tsx             # Main split-pane view (chat + map)
│   ├── ExplorePage.tsx               # Places list with category filter
│   ├── MapPage.tsx                   # Full-screen map view
│   ├── ChatPage.tsx                  # Full-screen chat view
│   ├── SavedPage.tsx                 # Saved places
│   └── ProfilePage.tsx               # User profile + sign out
├── components/
│   ├── auth/
│   │   ├── ProtectedRoute.tsx        # Redirects to /login if unauthenticated
│   │   └── GuestRoute.tsx            # Redirects to / if already authenticated
│   ├── dashboard/                    # DashboardHeader, DashboardSearch, DashboardMap, DashboardChat, PlaceDetailPanel
│   ├── places/                       # PlaceCard, PlaceDetail, PlacesList
│   ├── chat/                         # ChatPanel, ChatMessage, CategoryChips, SuggestionChips
│   ├── map/                          # MapPanel
│   ├── search/                       # SearchBar
│   ├── layout/                       # DesktopTopBar, MobileNav, Sidebar
│   ├── weather/                      # WeatherWidget (current + 5-day forecast)
│   └── ui/
│       ├── AnimatedBackground.tsx    # Drifting gradient orbs (Framer Motion loops)
│       ├── PageTransition.tsx        # Staggered mount animation for page content
│       ├── InteractiveCard.tsx       # Hover/tap card wrapper
│       ├── Icons.tsx
│       ├── MapLegend.tsx
│       └── PageHeader.tsx
├── hooks/
│   ├── useAuth.tsx                   # Supabase auth context (user, session, signIn, signUp, logout)
│   ├── useSavedPlaces.tsx            # Saved-places context (isSaved, savePlace, removePlace)
│   ├── useLocationContext.tsx        # Global location, places, and weather state
│   ├── useChat.ts                    # Chat state + AI request + map sync
│   └── useAppUI.tsx                  # UI state (panel focus, map highlights)
├── services/
│   ├── gemini.ts                     # OpenRouter / Gemini system prompt + API call
│   ├── weather.ts                    # Open-Meteo fetch → typed WeatherData + 5-day forecast
│   ├── geoapify.ts                   # Geoapify Places API (primary source)
│   ├── overpass.ts                   # OpenStreetMap Overpass API (fallback)
│   ├── nominatim.ts                  # City geocoding
│   ├── location.ts                   # Browser GPS
│   └── supabase.ts                   # Supabase client, auth, saved places, saved chats
├── layouts/
│   ├── AppLayout.tsx
│   ├── DashboardLayout.tsx
│   └── WorkspaceLayout.tsx
├── types/
│   └── index.ts                      # Place, WeatherData, ForecastDay, ChatMessage, SavedPlace, SavedChat, UserProfile
└── utils/
    ├── weatherCodes.ts               # WMO code → human-readable description lookup
    ├── placeMatching.ts              # Extract named places from AI response text
    ├── placeHelpers.ts               # Trending cities, placesMatch, savedPlaceToPlace
    └── leafletIcons.ts               # Custom category marker icons
supabase/
└── schema.sql                        # saved_places + saved_chats tables with RLS policies
```

---

## What I Learned

The hardest constraint to get right was the AI grounding. Early versions of the system prompt would still occasionally invent place names when the user asked confidently for something not in the data — "where's the best sushi?" in a city with no sushi restaurants would produce a hallucinated recommendation. The fix wasn't more instructions; it was injecting the category counts explicitly (e.g. `{"restaurant": 12, "cafe": 8, "mall": 0}`) so the model could self-check before responding. Giving the AI a structured inventory to reason against worked far better than telling it not to hallucinate.

Making auth required changed the app architecture more than I expected. Once everything sits behind `ProtectedRoute`, the provider nesting order in `App.tsx` becomes a dependency graph: `AuthProvider` must resolve before `SavedPlacesProvider` tries to fetch, which must resolve before the dashboard renders. Getting that order wrong produces subtle load-order bugs — a save attempt that fires before the user ID is available, a redirect loop while the session check is still in flight — that only show up on cold load.

Switching to Open-Meteo for weather was the easiest call in the whole project. Zero configuration, a typed response, and a 5-day forecast included at no extra cost. The only real work was building `weatherCodes.ts` — WMO codes are a flat integer space with gaps, and mapping them to friendly strings by hand is tedious but not hard. The result is a weather layer that any fork can use without hunting for API keys.

If I were continuing this, two things stand out: surfacing saved chat history in the UI (the table and service are complete, the browse page is not), and enriching the place detail panel — Geoapify returns structured opening hours, website URLs, and phone numbers on many nodes, but none of that is parsed into the `Place` type yet. Adding those fields would make the difference between "I know this place exists" and "I know when it opens."
