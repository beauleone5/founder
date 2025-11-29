# Founder Radar API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

Currently, no authentication is required. For production use, implement API key authentication.

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "data": { ... }
}
```

Or for errors:

```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Configuration Endpoints

### GET /api/config

Get the current configuration.

**Response:**
```json
{
  "success": true,
  "config": {
    "sources": { ... },
    "filters": { ... },
    "weights": { ... },
    "scraping": { ... }
  }
}
```

### POST /api/config/update

Update the entire configuration.

**Request Body:**
```json
{
  "sources": {
    "producthunt": true,
    "hackernews": false
  },
  "filters": {
    "min_execution_score": 15
  }
}
```

**Response:**
```json
{
  "success": true,
  "config": { ... }
}
```

### POST /api/config/sources

Update source toggles.

**Request Body:**
```json
{
  "producthunt": true,
  "hackernews": true,
  "github_trending": false
}
```

**Response:**
```json
{
  "success": true,
  "sources": { ... }
}
```

### POST /api/config/filters

Update filter settings.

**Request Body:**
```json
{
  "university": ["Stanford", "MIT"],
  "location": ["SF Bay Area"],
  "product_niche": ["AI infra", "DevTools"],
  "min_execution_score": 15,
  "min_technical_score": 12
}
```

**Response:**
```json
{
  "success": true,
  "filters": { ... }
}
```

### POST /api/config/weights

Update scoring weights.

**Request Body:**
```json
{
  "execution_velocity": 0.30,
  "technical_depth": 0.30,
  "momentum_score": 0.20,
  "market_potential": 0.15,
  "credibility": 0.05
}
```

**Note:** Weights must sum to 1.0

**Response:**
```json
{
  "success": true,
  "weights": { ... }
}
```

---

## Founder Endpoints

### POST /api/founders/fetch

Fetch founders from all enabled sources.

**Response:**
```json
{
  "success": true,
  "count": 47,
  "founders": [
    {
      "founder_id": 1,
      "name": "John Doe",
      "startup_name": "AI Startup",
      "sources": ["producthunt", "hackernews"],
      "urls": {
        "product": "https://...",
        "github": "https://..."
      }
    }
  ]
}
```

### POST /api/founders/manual

Add a founder manually.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "url": "https://linkedin.com/in/janedoe",
  "startup_name": "DevTools Co",
  "description": "Building next-gen developer tools"
}
```

**Response:**
```json
{
  "success": true,
  "founder": {
    "founder_id": 48,
    "name": "Jane Doe",
    ...
  }
}
```

### POST /api/founders/:id/enrich

Enrich a specific founder with AI analysis.

**Parameters:**
- `id` (number) - Founder ID

**Response:**
```json
{
  "success": true,
  "founder": {
    "founder_id": 1,
    "name": "John Doe",
    "ai_bio": "John is a...",
    "ai_execution_evidence": "Shipped 3 products...",
    "score": {
      "execution_velocity": 18.5,
      "technical_depth": 21.0,
      "total_score": 82.3
    }
  }
}
```

### POST /api/founders/enrich-all

Enrich all unenriched founders.

**Response:**
```json
{
  "success": true,
  "enriched": 23
}
```

**Note:** This endpoint may take several minutes to complete.

### GET /api/founders

Get all founders with scores.

**Response:**
```json
{
  "success": true,
  "count": 47,
  "founders": [
    {
      "founder_id": 1,
      "name": "John Doe",
      "startup_name": "AI Startup",
      "score": {
        "total_score": 82.3
      }
    }
  ]
}
```

### GET /api/founders/:id

Get a specific founder.

**Parameters:**
- `id` (number) - Founder ID

**Response:**
```json
{
  "success": true,
  "founder": {
    "founder_id": 1,
    "name": "John Doe",
    "startup_name": "AI Startup",
    "university": "Stanford",
    "ai_bio": "...",
    "ai_email_template": "...",
    "score": { ... }
  }
}
```

### GET /api/founders/filter

Get founders after applying filters.

**Response:**
```json
{
  "success": true,
  "count": 15,
  "founders": [ ... ]
}
```

### GET /api/founders/top10

Get top N founders by score.

**Query Parameters:**
- `limit` (number, optional) - Number of founders to return (default: 10)

**Example:**
```
GET /api/founders/top10?limit=20
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "founders": [
    {
      "founder_id": 5,
      "name": "Alice Johnson",
      "score": {
        "total_score": 89.5
      }
    }
  ]
}
```

---

## Health Endpoint

### GET /api/health

Check API health status.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Data Models

### Founder Object

```typescript
{
  founder_id: number;
  name: string;
  startup_name?: string;
  age?: number;
  location?: string;
  university?: string;
  niche?: string;
  sources?: string[];
  urls?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
    product?: string;
  };
  raw_data?: object;
  ai_bio?: string;
  ai_execution_evidence?: string;
  ai_technical_summary?: string;
  ai_market_summary?: string;
  ai_momentum_signals?: string;
  ai_risks?: string;
  ai_email_template?: string;
  created_at?: Date;
  updated_at?: Date;
}
```

### Score Object

```typescript
{
  score_id?: number;
  founder_id: number;
  execution_velocity: number;  // 0-25
  technical_depth: number;     // 0-25
  momentum_score: number;      // 0-20
  market_potential: number;    // 0-20
  credibility: number;         // 0-10
  total_score: number;         // 0-100
  score_explanation?: string;
  created_at?: Date;
  updated_at?: Date;
}
```

### Config Object

```typescript
{
  sources: {
    producthunt: boolean;
    hackernews: boolean;
    github_trending: boolean;
    angellist: boolean;
    yc_directory: boolean;
    perplexity_universities: boolean;
    manual_input: boolean;
  };
  filters: {
    university?: string[];
    age_range?: [number, number];
    location?: string[];
    product_niche?: string[];
    technical_background?: string[];
    min_execution_score?: number;
    min_technical_score?: number;
    exclude_non_technical?: boolean;
  };
  weights: {
    execution_velocity: number;
    technical_depth: number;
    momentum_score: number;
    market_potential: number;
    credibility: number;
  };
  scraping: {
    max_items_per_source: number;
    fetch_interval_hours: number;
  };
}
```

---

## Error Codes

- `400` - Bad Request (invalid input)
- `404` - Not Found (founder doesn't exist)
- `500` - Internal Server Error

---

## Rate Limiting

Currently, no rate limiting is implemented. For production use, implement rate limiting using tools like `express-rate-limit`.

---

## Example Workflows

### Workflow 1: Complete First-Time Setup

```bash
# 1. Fetch founders
curl -X POST http://localhost:3000/api/founders/fetch

# 2. Enrich all founders
curl -X POST http://localhost:3000/api/founders/enrich-all

# 3. View top 10
curl http://localhost:3000/api/founders/top10
```

### Workflow 2: Customize and Filter

```bash
# 1. Update filters
curl -X POST http://localhost:3000/api/config/filters \
  -H "Content-Type: application/json" \
  -d '{"university": ["Stanford"], "min_execution_score": 18}'

# 2. View filtered results
curl http://localhost:3000/api/founders/filter

# 3. Adjust scoring weights
curl -X POST http://localhost:3000/api/config/weights \
  -H "Content-Type: application/json" \
  -d '{
    "execution_velocity": 0.35,
    "technical_depth": 0.35,
    "momentum_score": 0.15,
    "market_potential": 0.10,
    "credibility": 0.05
  }'

# 4. View new top 10
curl http://localhost:3000/api/founders/top10
```

### Workflow 3: Add Manual Founder

```bash
# 1. Add founder
curl -X POST http://localhost:3000/api/founders/manual \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Elon Musk",
    "url": "https://twitter.com/elonmusk",
    "startup_name": "SpaceX",
    "description": "Making life multiplanetary"
  }'

# Response includes founder_id: 99

# 2. Enrich the founder
curl -X POST http://localhost:3000/api/founders/99/enrich

# 3. View the founder
curl http://localhost:3000/api/founders/99
```

---

## Webhooks (Future Feature)

In the future, webhooks will be added to notify you when:
- New founders are discovered
- Weekly reports are generated
- Scores change significantly

---

## GraphQL Support (Future Feature)

A GraphQL endpoint may be added for more flexible querying.

---

For more information, see the [README.md](README.md) and [SETUP.md](SETUP.md).
