import httpx
from typing import Dict, Any, List
from datetime import datetime, timedelta
from app.config import settings


async def fetch_company_news(company_name: str, website: str = None) -> Dict[str, Any]:
    """
    Fetch recent news articles about a company.
    Uses NewsAPI if API key is available, otherwise returns mock data.
    """
    if not settings.NEWS_API_KEY:
        # Return mock news data when API key is not available
        return {
            "status": "ok",
            "totalResults": 3,
            "articles": [
                {
                    "title": f"{company_name} announces major product update",
                    "description": f"{company_name} has released a significant update to their platform with new features.",
                    "url": f"https://example.com/news/{company_name.lower()}-update",
                    "publishedAt": datetime.utcnow().isoformat(),
                    "source": {"name": "Tech News"}
                },
                {
                    "title": f"{company_name} raises funding round",
                    "description": f"Reports indicate {company_name} has secured additional funding.",
                    "url": f"https://example.com/news/{company_name.lower()}-funding",
                    "publishedAt": (datetime.utcnow() - timedelta(days=1)).isoformat(),
                    "source": {"name": "VC Beat"}
                },
                {
                    "title": f"Industry analysis: {company_name}'s market position",
                    "description": f"Analysts discuss {company_name}'s competitive positioning.",
                    "url": f"https://example.com/news/{company_name.lower()}-analysis",
                    "publishedAt": (datetime.utcnow() - timedelta(days=2)).isoformat(),
                    "source": {"name": "Market Insider"}
                }
            ]
        }

    # Use NewsAPI to fetch real news
    url = "https://newsapi.org/v2/everything"
    params = {
        "q": company_name,
        "apiKey": settings.NEWS_API_KEY,
        "sortBy": "publishedAt",
        "language": "en",
        "pageSize": 10,
        "from": (datetime.utcnow() - timedelta(days=7)).isoformat()
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=10.0)
            response.raise_for_status()
            return response.json()
    except Exception as e:
        print(f"Error fetching news for {company_name}: {e}")
        return {
            "status": "error",
            "totalResults": 0,
            "articles": []
        }


async def summarize_news(news_data: Dict[str, Any]) -> List[str]:
    """Extract key news headlines."""
    if not news_data or news_data.get("status") != "ok":
        return []

    articles = news_data.get("articles", [])
    return [article.get("title", "") for article in articles[:5]]
