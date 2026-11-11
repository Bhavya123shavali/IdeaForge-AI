from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4


MEMORY_PATH = Path(__file__).resolve().parent / "data" / "memory_store.json"


def _ensure_store() -> None:
    MEMORY_PATH.parent.mkdir(parents=True, exist_ok=True)
    if not MEMORY_PATH.exists():
        MEMORY_PATH.write_text("[]", encoding="utf-8")


def load_entries() -> list[dict[str, Any]]:
    _ensure_store()
    raw = MEMORY_PATH.read_text(encoding="utf-8").strip()
    if not raw:
        return []
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return []
    return data if isinstance(data, list) else []


def save_entry(idea: dict[str, Any], report: dict[str, Any]) -> dict[str, Any]:
    entries = load_entries()
    entry = {
        "id": str(uuid4()),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "idea": idea,
        "report": report,
    }
    entries.append(entry)
    MEMORY_PATH.write_text(json.dumps(entries, indent=2), encoding="utf-8")
    return entry


def get_entry(entry_id: str) -> dict[str, Any] | None:
    return next((entry for entry in load_entries() if entry.get("id") == entry_id), None)


def delete_entry(entry_id: str) -> bool:
    entries = load_entries()
    remaining = [entry for entry in entries if entry.get("id") != entry_id]
    if len(remaining) == len(entries):
        return False
    MEMORY_PATH.write_text(json.dumps(remaining, indent=2), encoding="utf-8")
    return True


def compare_with_history(current_idea: dict[str, Any], entries: list[dict[str, Any]]) -> dict[str, Any]:
    current_blob = " ".join(
        [
            current_idea.get("idea_name", ""),
            current_idea.get("problem_statement", ""),
            current_idea.get("target_audience", ""),
            current_idea.get("revenue_model", ""),
        ]
    ).lower()
    current_tokens = {token for token in current_blob.split() if len(token) > 3}

    similar_entries: list[dict[str, Any]] = []
    repeated_patterns: list[str] = []
    historical_warnings: list[str] = []

    for entry in entries:
        idea = entry.get("idea", {})
        report = entry.get("report", {})
        past_blob = " ".join(
            [
                idea.get("idea_name", ""),
                idea.get("problem_statement", ""),
                idea.get("target_audience", ""),
                idea.get("revenue_model", ""),
            ]
        ).lower()
        past_tokens = {token for token in past_blob.split() if len(token) > 3}
        overlap = len(current_tokens & past_tokens)
        score = overlap / max(len(current_tokens), 1)
        if score >= 0.18:
            similar_entries.append(
                {
                    "id": entry.get("id"),
                    "idea_name": idea.get("idea_name"),
                    "similarity": round(score, 2),
                    "score": report.get("score"),
                    "competition": report.get("competition"),
                }
            )

        for gap in report.get("gaps", []):
            if gap not in repeated_patterns:
                repeated_patterns.append(gap)

        low_score = report.get("score", 0) <= 5
        missing_diff = any("different" in suggestion.lower() for suggestion in report.get("suggestions", []))
        if low_score and missing_diff:
            historical_warnings.append(
                f"Past idea '{idea.get('idea_name')}' scored poorly and needed stronger differentiation."
            )

    return {
        "similar_entries": sorted(similar_entries, key=lambda item: item["similarity"], reverse=True)[:3],
        "repeated_patterns": repeated_patterns[:5],
        "historical_warnings": historical_warnings[:3],
        "entry_count": len(entries),
    }
