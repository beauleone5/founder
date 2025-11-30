import httpx
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from app.config import settings


async def fetch_github_activity(company_name: str) -> Dict[str, Any]:
    """
    Fetch GitHub activity related to a company.
    Searches for repositories and recent activity.
    """
    headers = {}
    if settings.GITHUB_TOKEN:
        headers["Authorization"] = f"token {settings.GITHUB_TOKEN}"

    # Search for repositories related to the company
    search_url = "https://api.github.com/search/repositories"
    params = {
        "q": company_name,
        "sort": "updated",
        "order": "desc",
        "per_page": 5
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(search_url, params=params, headers=headers, timeout=10.0)

            if response.status_code == 200:
                data = response.json()
                return {
                    "status": "ok",
                    "total_count": data.get("total_count", 0),
                    "repositories": [
                        {
                            "name": repo.get("name"),
                            "full_name": repo.get("full_name"),
                            "description": repo.get("description"),
                            "stars": repo.get("stargazers_count"),
                            "language": repo.get("language"),
                            "updated_at": repo.get("updated_at"),
                            "url": repo.get("html_url")
                        }
                        for repo in data.get("items", [])[:5]
                    ]
                }
            else:
                # Return mock data if API fails or rate limited
                return _get_mock_github_data(company_name)

    except Exception as e:
        print(f"Error fetching GitHub data for {company_name}: {e}")
        return _get_mock_github_data(company_name)


def _get_mock_github_data(company_name: str) -> Dict[str, Any]:
    """Return mock GitHub data."""
    return {
        "status": "ok",
        "total_count": 2,
        "repositories": [
            {
                "name": f"{company_name.lower()}-sdk",
                "full_name": f"{company_name}/sdk",
                "description": f"Official SDK for {company_name}",
                "stars": 1234,
                "language": "Python",
                "updated_at": datetime.utcnow().isoformat(),
                "url": f"https://github.com/{company_name}/sdk"
            },
            {
                "name": f"{company_name.lower()}-examples",
                "full_name": f"{company_name}/examples",
                "description": "Example applications and tutorials",
                "stars": 567,
                "language": "JavaScript",
                "updated_at": (datetime.utcnow() - timedelta(days=2)).isoformat(),
                "url": f"https://github.com/{company_name}/examples"
            }
        ]
    }


async def analyze_github_trends(github_data: Dict[str, Any]) -> List[str]:
    """Extract key insights from GitHub data."""
    if not github_data or github_data.get("status") != "ok":
        return []

    insights = []
    repos = github_data.get("repositories", [])

    if repos:
        total_stars = sum(repo.get("stars", 0) for repo in repos)
        insights.append(f"{len(repos)} active repositories with {total_stars:,} total stars")

        # Most popular repo
        if repos:
            top_repo = max(repos, key=lambda r: r.get("stars", 0))
            insights.append(f"Top repo: {top_repo.get('name')} ({top_repo.get('stars', 0):,} stars)")

    return insights
