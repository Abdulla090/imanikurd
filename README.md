# Imani Kurd (ئیمانی کورد)

A comprehensive Islamic web application tailored for the Kurdish speaking community. It provides a rich set of spiritual tools, educational resources, and daily utilities designed with a modern, fast, and accessible user interface.

## Table of Contents
- Features
- Architecture & Technologies
- Getting Started
- Installation
- Development
- Resources & APIs
- License

## Features

- Holy Quran & Tafsir
  - Full Quranic text with 13 distinct Kurdish translations and interpretations (Tafsir).
  - High-quality audio recitations featuring Kurdish reciters (Peshawa Qadr) and renowned Arabic reciters.
  - Advanced reading interface with bookmarking, offline caching, search, and customizable typography.

- Prayer Times & Qibla
  - Accurate, localized prayer times specifically calibrated for cities across the Kurdistan Region.
  - Interactive Qibla compass utilizing device geolocation and orientation sensors for precision alignment.

- Daily Spiritual Tools
  - Digital Tasbih with customizable counters, goal tracking, haptic feedback, and modern animations.
  - Comprehensive Azkar library categorized for morning, evening, and specific occasions.
  - Zakat Calculator with configurable minimum thresholds (Nisab) and asset categorization for accurate religious calculations.

- Educational Resources
  - Asmaul Husna (99 Names of Allah) with translations, meanings, and audio pronunciations.
  - Authentic Hadith collections translated into Kurdish.
  - Detailed biographies of the Prophet Muhammad (Seerah) and esteemed Companions (Sahabah).
  - Interactive Islamic Library and Multimedia sections.

- Advanced Functionalities
  - Ramadan Hub and daily fasting tracker with personalized analytics.
  - Progress tracker for daily prayers and religious duties.
  - Intelligent Chat Assistant for interactive Islamic inquiries and guidance.
  - Progressive Web App (PWA) architecture for offline access and native-like mobile experience.

## Architecture & Technologies

The application is built using a modern frontend stack to ensure performance, maximum maintainability, and exceptional user experience.

- Core Framework: React 18, TypeScript, Vite
- Styling & UI: Tailwind CSS, CSS Modules (for custom animations), Framer Motion (for fluid transitions), shadcn/ui components
- State & Data Management: React Query for robust asynchronous caching, normalized local storage, custom hooks
- Maps & Geolocation: HTML5 Geolocation API, DeviceOrientation API, DeviceMotionEvent API
- Audio: HTML5 Audio API with custom wrapper components for continuous playback

## Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Abdulla090/imanikurd.git
   ```
2. Navigate to the project directory:
   ```bash
   cd imanikurd
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server with hot-module replacement (HMR), run:

```bash
npm run dev
```

To build the optimized application for production, run:

```bash
npm run build
```

To preview the production build locally, run:

```bash
npm run preview
```

## Resources & APIs

The application utilizes several selected open resources to ensure authenticity and quality:
- Audio Recitations: mp3quran.net and localized GitHub repositories for Kurdish audio assets.
- Prayer Data: Core local geospatial calculation database with fallback to AlAdhan API.
- UI Elements: Lucide React icons, Tailwind-based design systems, and custom Radix UI primitives.

## License

This project is open-source and intended for educational, spiritual, and religious purposes. Please refer to the repository for detailed licensing information.
