from __future__ import annotations

import os
from typing import Any

import httpx


FIRECRAWL_ENDPOINT = "https://api.firecrawl.dev/v1/search"


def _simulated_competitors(idea_name: str, target_audience: str) -> list[dict[str, Any]]:
    audience_hint = target_audience.split(",")[0].strip() or "general users"
    normalized = idea_name.strip() or "Startup"
    return [
        {
            "name": f"{normalized} Lite",
            "summary": f"A lightweight competitor targeting {audience_hint} with faster onboarding and basic analytics.",
            "strength": "Simple onboarding flow and lower price point.",
            "weakness": "Limited product differentiation and weak retention loops.",
            "source": "simulated",
        },
        {
            "name": f"{normalized} Pro",
            "summary": f"A premium-focused product serving {audience_hint} with automation and team collaboration.",
            "strength": "Strong feature breadth and credible premium positioning.",
            "weakness": "More complex setup and higher adoption friction.",
            "source": "simulated",
        },
        {
            "name": "Legacy Incumbent",
            "summary": f"An established category player solving adjacent needs for {audience_hint}.",
            "strength": "Brand trust, distribution, and larger sales capacity.",
            "weakness": "Slower innovation and dated user experience.",
            "source": "simulated",
        },
    ]


async def fetch_competitors(idea_name: str, problem_statement: str, target_audience: str) -> list[dict[str, Any]]:
    api_key = os.getenv("FIRECRAWL_API_KEY")
    if not api_key:
        return _simulated_competitors(idea_name, target_audience)

    query = f"{idea_name} {problem_statement} {target_audience} startup competitors"
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {"query": query, "limit": 5, "scrapeOptions": {"formats": ["markdown"]}}

    try:
        async with httpx.AsyncClient(timeout=25.0) as client:
            response = await client.post(FIRECRAWL_ENDPOINT, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
    except Exception:
        return _simulated_competitors(idea_name, target_audience)

    competitors: list[dict[str, Any]] = []
    for item in data.get("data", [])[:5]:
        title = item.get("title") or item.get("metadata", {}).get("title") or "Unnamed competitor"
        description = item.get("description") or item.get("markdown", "")[:220]
        competitors.append(
            {
                "name": title,
                "summary": description.strip() or "No summary returned from Firecrawl.",
                "strength": "Observed from search presence and positioning.",
                "weakness": "Needs deeper product teardown for certainty.",
                "source": item.get("url") or "firecrawl",
            }
        )

    return competitors or _simulated_competitors(idea_name, target_audience)
