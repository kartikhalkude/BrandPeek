# Brand Explorer App

A React Native app showcasing a brand catalog fetched from Supabase with offline fallback and caching.

---

## Features

- Browse brands with logos, descriptions, categories
- Search and filter brands
- Offline fallback using cached data
- Health check for backend connection

---

## Backend Used

- [Supabase](https://supabase.com) - open-source Firebase alternative with PostgreSQL database, RESTful API, and real-time features.

---

## Project Structure

- `/src` — React Native components, services, constants
- `/src/apiService.js` — Data fetching from Supabase with caching and fallback
- `/assets` — Static assets like images and icons
- `App.js` — Main entry point
- `.env` — Environment variables (not committed)

---

## Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (for development)
- [EAS CLI](https://docs.expo.dev/eas-cli/install/) (for building APKs)

---

## Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/your-username/brand-explorer.git
cd brand-explorer

```
### 2.Install dependencies

```bash
npm install
```

### 3.Create a .env file in the root folder with your Supabase credentials

```ini
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4.Start the Expo development server

```bash
npm start
```

### Open the project on your device:

### Scan the QR code shown in the terminal or Expo Dev Tools with the Expo Go app (available on iOS and Android), OR

### Use the Expo Go link provided in the terminal
