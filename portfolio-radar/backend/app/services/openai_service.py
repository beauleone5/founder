import json
from typing import Dict, Any
from openai import AsyncOpenAI
from app.config import settings

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


async def generate_company_insights(
    company_name: str,
    news_data: Dict[str, Any],
    github_data: Dict[str, Any],
    competitor_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Generate AI insights for a company using OpenAI.

    Returns a structured JSON with:
    - daily_summary: str
    - top_insights: List[str]
    - risk_score: float (0-100)
    - opportunity_score: float (0-100)
    - must_know: str (one sentence for VC partner)
    """
    prompt = f"""
You are an AI intelligence analyst for a venture capital firm. Analyze the following data for {company_name} and provide today's intelligence summary.

NEWS DATA:
{json.dumps(news_data, indent=2)}

GITHUB ACTIVITY:
{json.dumps(github_data, indent=2)}

COMPETITOR MENTIONS:
{json.dumps(competitor_data, indent=2)}

Based on this data, provide a comprehensive analysis in the following JSON format:
{{
    "daily_summary": "A comprehensive 2-3 sentence summary of today's key developments",
    "top_insights": ["insight 1", "insight 2", "insight 3"],
    "risk_score": <number between 0-100>,
    "opportunity_score": <number between 0-100>,
    "must_know": "One critical sentence the VC partner must know today"
}}

Consider:
- Risk factors: negative news, competitor advances, technical issues
- Opportunities: positive news, product launches, partnerships, talent acquisition
- Market position: how the company compares to competitors

Return ONLY valid JSON, no additional text.
"""

    try:
        response = await client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": "You are a VC intelligence analyst. Return only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )

        content = response.choices[0].message.content.strip()

        # Remove markdown code blocks if present
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]

        insights = json.loads(content.strip())

        # Validate the response has required fields
        required_fields = ["daily_summary", "top_insights", "risk_score", "opportunity_score", "must_know"]
        for field in required_fields:
            if field not in insights:
                insights[field] = None

        return insights

    except Exception as e:
        print(f"Error generating insights for {company_name}: {e}")
        # Return default values on error
        return {
            "daily_summary": f"Unable to generate insights for {company_name} at this time.",
            "top_insights": [],
            "risk_score": 50.0,
            "opportunity_score": 50.0,
            "must_know": "Data analysis temporarily unavailable."
        }
