# News Tak - Modern React News Portal

A modern, responsive editorial news web application built with **React 18**, **Tailwind CSS**, **React Router v6**, and powered by **NewsData.io API**.

---

## Features

- 📰 **Real-Time News Feeds**: Latest news across categories (`General`, `Business`, `Entertainment`, `Health`, `Science`, `Sports`, `Technology`).
- 🔍 **Live Search**: Instant news search powered by NewsData.io query endpoint.
- 📖 **Full Article Detail View**: Comprehensive editorial article layout with hero imagery, publisher metadata, readable typography, and external link to original source.
- 🌓 **Dark Mode**: Built-in dark mode toggle with persistent local storage preference.
- 📱 **Responsive Grid**: Adaptive card grid with hover scaling, source favicons, and relative publication timestamps.
- ⚡ **Skeleton Loading & Error States**: Graceful UI placeholders during fetches, rate-limit warnings, and key configuration guides.

---

## Getting Started

### 1. Prerequisites

- Node.js (v16+)
- Free API Key from [NewsData.io](https://newsdata.io/)

### 2. Environment Setup

Copy `.env.example` to `.env` or create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Add your NewsData.io API Key to `.env`:

```env
REACT_APP_NEWSDATA_API_KEY=your_newsdata_api_key_here
```

> ⚠️ **Note**: Never commit your `.env` file containing private API keys. `.env` is ignored in `.gitignore`.

### 3. Installation

Install project dependencies:

```bash
npm install
```

### 4. Running Locally

Start the React development server:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

---

## Build & Deployment

To generate a production build:

```bash
npm run build
```

To deploy to GitHub Pages:

```bash
npm run deploy
```
