# Founder Repository

This repository contains multiple projects:

## Projects

### 📊 Founder Radar
Location: `/founder-radar`

Founder tracking and analytics system.

[See founder-radar README →](./founder-radar/README.md)

---

### 📰 BoardSignal (Portman)
Location: `/portman`

A minimal, production-ready web app for VC/PE professionals to track news signals for their portfolio companies.

**Features:**
- Follow companies by name and ticker
- Unified news feed with impact scoring (0-10)
- Clean, professional UI
- Works with mock data or real NewsAPI integration

**Quick Start:**
```bash
cd portman
npm install
npx prisma migrate dev --name init
npm run dev
```

[See BoardSignal README →](./portman/README.md)

[Deployment Guide →](./portman/DEPLOY.md)

---

## Repository Structure

```
founder/
├── founder-radar/          # Founder tracking system
│   ├── src/
│   └── ...
│
└── portman/                # BoardSignal app
    ├── app/                # Next.js app routes
    ├── components/         # React components
    ├── lib/                # Utilities & business logic
    ├── prisma/             # Database schema
    └── README.md           # Full documentation
```

---

## Getting Started

Choose the project you want to work with and navigate to its directory:

```bash
# For Founder Radar
cd founder-radar
npm install
npm run dev

# For BoardSignal (Portman)
cd portman
npm install
npx prisma migrate dev --name init
npm run dev
```

---

## Tech Stack

### Founder Radar
- Node.js + TypeScript
- See founder-radar/README.md for details

### BoardSignal (Portman)
- Next.js 14 + TypeScript
- Prisma ORM + PostgreSQL
- Tailwind CSS
- NewsAPI.org integration

---

## Documentation

- **Founder Radar**: See [founder-radar/README.md](./founder-radar/README.md)
- **BoardSignal**: See [portman/README.md](./portman/README.md)
- **Deploy BoardSignal**: See [portman/DEPLOY.md](./portman/DEPLOY.md)

---

## License

MIT
