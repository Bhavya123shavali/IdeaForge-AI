from __future__ import annotations

import json
import os
import re
from statistics import mean
from typing import Any

import httpx


REPORT_SCHEMA = {
    "type": "object",
    "properties": {
        "score": {"type": "integer", "minimum": 1, "maximum": 10},
        "competition": {"type": "string", "enum": ["Low", "Medium", "High"]},
        "swot": {
            "type": "object",
            "properties": {
                "strengths": {"type": "array", "items": {"type": "string"}},
                "weaknesses": {"type": "array", "items": {"type": "string"}},
                "opportunities": {"type": "array", "items": {"type": "string"}},
                "threats": {"type": "array", "items": {"type": "string"}},
            },
            "required": ["strengths", "weaknesses", "opportunities", "threats"],
            "additionalProperties": False,
        },
        "gaps": {"type": "array", "items": {"type": "string"}},
        "suggestions": {"type": "array", "items": {"type": "string"}},
        "competitors": {"type": "array", "items": {"type": "object"}},
        "feasibility": {
            "type": "object",
            "properties": {
                "product": {"type": "string"},
                "go_to_market": {"type": "string"},
                "operations": {"type": "string"},
                "notes": {"type": "string"},
            },
            "required": ["product", "go_to_market", "operations", "notes"],
            "additionalProperties": False,
        },
        "market_pulse": {
            "type": "object",
            "properties": {
                "demand": {"type": "number"},
                "timing": {"type": "string"},
                "confidence": {"type": "string"},
            },
            "required": ["demand", "timing", "confidence"],
            "additionalProperties": False,
        },
        "memory_insights": {"type": "object"},
    },
    "required": [
        "score",
        "competition",
        "swot",
        "gaps",
        "suggestions",
        "competitors",
        "feasibility",
        "market_pulse",
        "memory_insights",
    ],
    "additionalProperties": False,
}


def _build_prompt(idea: dict[str, str], competitors: list[dict[str, Any]], memory_context: dict[str, Any]) -> str:
    return f"""
You are StartupScope AI, an elite startup validation analyst.
Return only valid JSON that matches this schema:
{json.dumps(REPORT_SCHEMA, indent=2)}

Idea:
{json.dumps(idea, indent=2)}

Competitors:
{json.dumps(competitors, indent=2)}

Memory context:
{json.dumps(memory_context, indent=2)}

Requirements:
- score from 1 to 10
- competition must be Low, Medium, or High
- gaps should be blunt, specific, and different for different ideas
- the first gap must mention the idea's real domain, audience, workflow, or monetization risk
- suggestions should be strategic, practical, and tailored to this exact idea
- avoid generic repeated lines such as "Differentiation is not obvious" unless you explain exactly what differentiation is missing
- keep competitors in the response and enrich them if useful
- use memory_insights to explain historical patterns
"""


def _parse_json_text(text: str) -> dict[str, Any] | None:
    cleaned = text.strip()
    fenced = re.search(r"```(?:json)?\s*(.*?)```", cleaned, flags=re.DOTALL | re.IGNORECASE)
    if fenced:
        cleaned = fenced.group(1).strip()

    try:
        parsed = json.loads(cleaned)
    except json.JSONDecodeError:
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start == -1 or end == -1 or end <= start:
            return None
        try:
            parsed = json.loads(cleaned[start : end + 1])
        except json.JSONDecodeError:
            return None

    return parsed if isinstance(parsed, dict) else None


def _domain_insights(idea: dict[str, str]) -> dict[str, list[str]]:
    name_problem = " ".join(
        [
            idea.get("idea_name", ""),
            idea.get("problem_statement", ""),
        ]
    ).lower()
    blob = " ".join(
        [
            idea.get("idea_name", ""),
            idea.get("problem_statement", ""),
            idea.get("target_audience", ""),
            idea.get("revenue_model", ""),
        ]
    ).lower()

    if any(token in name_problem for token in ["study", "exam", "revision", "notes", "doubt"]):
        return {
            "gaps": [
                "The study workflow must show measurable exam improvement, not only combine notes, doubt solving, and revision in one place.",
                "Retention risk is high unless the product creates daily study momentum before exam week.",
            ],
            "suggestions": [
                "Pilot one exam category and track weekly revision completion, doubt resolution time, and score improvement.",
                "Differentiate with adaptive revision plans based on weak topics rather than a general AI study assistant.",
            ],
        }

    if any(token in blob for token in ["career", "job", "placement", "skill", "resume"]):
        return {
            "gaps": [
                "Career guidance must prove it can map students to real hiring outcomes, not just recommend generic skill paths.",
                "Trust will depend on verified employer, mentor, or placement signals that students cannot already get from free content.",
            ],
            "suggestions": [
                "Start with one placement segment, such as final-year engineering students, and measure interview conversions.",
                "Build a proof loop around skill assessment, project evidence, and employer feedback instead of broad career advice.",
            ],
        }

    if any(token in blob for token in ["study", "student", "exam", "revision", "notes", "doubt"]):
        return {
            "gaps": [
                "The study workflow must show measurable exam improvement, not only combine notes, doubt solving, and revision in one place.",
                "Retention risk is high unless the product creates daily study momentum before exam week.",
            ],
            "suggestions": [
                "Pilot one exam category and track weekly revision completion, doubt resolution time, and score improvement.",
                "Differentiate with adaptive revision plans based on weak topics rather than a general AI study assistant.",
            ],
        }

    if any(token in blob for token in ["farm", "agri", "produce", "restaurant", "retailer"]):
        return {
            "gaps": [
                "The marketplace must solve supply reliability, payment trust, and repeat ordering before discovery has value.",
                "Cold-start risk is high because both farmers and buyers need liquidity in the same local cluster.",
            ],
            "suggestions": [
                "Launch with one crop category and ten repeat buyers to validate fulfillment reliability.",
                "Add simple quality grading and payment assurance before expanding the marketplace.",
            ],
        }

    if any(token in blob for token in ["fitness", "coach", "workout", "health"]):
        return {
            "gaps": [
                "The fitness concept must explain why busy users will stay consistent after the first two weeks.",
                "Generic workout plans are crowded; the retention hook needs to be sharper than AI coaching alone.",
            ],
            "suggestions": [
                "Validate a seven-minute routine habit with one professional segment before adding broader coaching.",
                "Use accountability, calendar friction, and progress proof as the main differentiation.",
            ],
        }

    return {
        "gaps": [
            "The first customer workflow needs a sharper proof point before the product promise will feel defensible.",
            "The idea needs a clearer unfair advantage in acquisition, data, workflow ownership, or retention.",
        ],
        "suggestions": [
            "Pick one narrow early adopter group and define the before-and-after workflow in measurable terms.",
            "Create a paid pilot around the riskiest assumption instead of validating broad interest.",
        ],
    }


def _extract_gaps(idea: dict[str, str], competitors: list[dict[str, Any]], memory_context: dict[str, Any]) -> list[str]:
    insights = _domain_insights(idea)
    gaps: list[str] = [insights["gaps"][0]]
    if len(idea.get("target_audience", "").strip()) < 18:
        gaps.append("Target audience is too broad or under-defined.")
    if len(idea.get("revenue_model", "").strip()) < 12:
        gaps.append("Business model needs clearer monetization mechanics.")
    problem = idea.get("problem_statement", "").lower()
    if not any(keyword in problem for keyword in ["unlike", "faster", "cheaper", "better", "first", "only", "specific"]):
        gaps.append(insights["gaps"][1])
    if competitors and len(competitors) >= 3:
        gaps.append("Competitive pressure is meaningful; positioning must be sharper.")
    if memory_context.get("similar_entries"):
        gaps.append("This idea resembles previous submissions and may need stronger novelty.")
    return gaps[:5]


def contextual_top_gap(idea: dict[str, str], gap: str | None) -> str:
    generic = {
        "",
        "Differentiation is not obvious from the problem framing.",
        "Target audience is too broad or under-defined.",
    }
    if (gap or "").strip() not in generic:
        return gap or _domain_insights(idea)["gaps"][0]
    return _domain_insights(idea)["gaps"][0]


def _heuristic_report(idea: dict[str, str], competitors: list[dict[str, Any]], memory_context: dict[str, Any]) -> dict[str, Any]:
    target_bonus = 1 if len(idea.get("target_audience", "")) > 25 else 0
    revenue_bonus = 1 if any(token in idea.get("revenue_model", "").lower() for token in ["subscription", "fee", "saas", "commission"]) else 0
    clarity_bonus = 1 if len(idea.get("problem_statement", "")) > 80 else 0
    memory_penalty = 1 if memory_context.get("similar_entries") else 0
    competition_count = len(competitors)
    score = max(3, min(10, 6 + target_bonus + revenue_bonus + clarity_bonus - memory_penalty))

    if competition_count >= 4:
        competition = "High"
    elif competition_count >= 2:
        competition = "Medium"
    else:
        competition = "Low"

    domain_insights = _domain_insights(idea)
    gaps = _extract_gaps(idea, competitors, memory_context)
    suggestions = [
        *domain_insights["suggestions"],
        "Turn differentiation into a product promise that incumbents do not serve well.",
        "Define a clearer retention loop so the value compounds after the first week.",
    ]
    if memory_context.get("historical_warnings"):
        suggestions.insert(0, "Address patterns from prior weak ideas before expanding the roadmap.")

    similar_names = [entry["idea_name"] for entry in memory_context.get("similar_entries", [])]
    swot = {
        "strengths": [
            "Problem appears commercially relevant and understandable.",
            "Revenue path is present instead of being postponed.",
            "Can be validated quickly through interviews and lightweight pilots.",
        ],
        "weaknesses": gaps[:3] or ["Early concept still needs sharper execution detail."],
        "opportunities": [
            "A focused niche can create faster early adoption and better messaging.",
            "Historical insight can help avoid repeated positioning mistakes.",
            "Competitor weaknesses create room for a simpler or more verticalized offer.",
        ],
        "threats": [
            "Established players can copy lightweight features quickly.",
            "Customer willingness to pay may lag unless ROI is explicit.",
            f"Similarity to past ideas ({', '.join(similar_names)}) could reduce novelty." if similar_names else "Crowded categories demand a stronger distribution advantage.",
        ],
    }

    return {
        "score": score,
        "competition": competition,
        "swot": swot,
        "gaps": gaps,
        "suggestions": suggestions[:5],
        "competitors": competitors,
        "feasibility": {
            "product": "Moderate",
            "go_to_market": "Moderate",
            "operations": "Moderate",
            "notes": "Execution risk is manageable if the first segment and differentiation are narrowed early.",
        },
        "market_pulse": {
            "demand": round(mean([score, max(4, 10 - competition_count)]), 1),
            "timing": "Good",
            "confidence": "Medium" if memory_penalty else "Medium-High",
        },
        "memory_insights": memory_context,
    }


async def _openai_report(idea: dict[str, str], competitors: list[dict[str, Any]], memory_context: dict[str, Any]) -> dict[str, Any] | None:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None

    try:
        from openai import AsyncOpenAI
    except ImportError:
        return None

    model = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")
    client = AsyncOpenAI(api_key=api_key)
    prompt = _build_prompt(idea, competitors, memory_context)

    try:
        response = await client.responses.create(
            model=model,
            input=prompt,
            text={
                "format": {
                    "type": "json_schema",
                    "name": "startup_validation_report",
                    "schema": REPORT_SCHEMA,
                    "strict": True,
                }
            },
        )
        return json.loads(response.output_text)
    except Exception:
        return None


async def _gemini_report(idea: dict[str, str], competitors: list[dict[str, Any]], memory_context: dict[str, Any]) -> dict[str, Any] | None:
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return None

    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    prompt = _build_prompt(idea, competitors, memory_context)
    payload = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.35,
            "responseMimeType": "application/json",
        },
    }
    headers = {"Content-Type": "application/json", "x-goog-api-key": api_key}

    try:
        async with httpx.AsyncClient(timeout=45.0) as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
    except Exception:
        return None

    parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
    text = "".join(part.get("text", "") for part in parts)
    return _parse_json_text(text)


async def generate_validation_report(
    idea: dict[str, str], competitors: list[dict[str, Any]], memory_context: dict[str, Any]
) -> dict[str, Any]:
    provider = os.getenv("LLM_PROVIDER", "auto").strip().lower()
    if provider == "openai":
        providers = [_openai_report, _gemini_report]
    elif provider == "gemini":
        providers = [_gemini_report, _openai_report]
    else:
        providers = [_gemini_report, _openai_report]

    report = None
    for provider_fn in providers:
        report = await provider_fn(idea, competitors, memory_context)
        if report:
            break

    if report:
        report["competitors"] = report.get("competitors") or competitors
        report["memory_insights"] = memory_context
        return report
    return _heuristic_report(idea, competitors, memory_context)
