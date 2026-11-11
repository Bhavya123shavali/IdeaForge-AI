from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


def load_env_file(path: Path) -> None:
    try:
        from dotenv import load_dotenv

        load_dotenv(path)
        return
    except ImportError:
        pass

    if not path.exists():
        return

    for line in path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        key, value = stripped.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


load_env_file(Path(__file__).resolve().parent / ".env")

from firecrawl_utils import fetch_competitors
from llm_utils import contextual_top_gap, generate_validation_report
from memory import compare_with_history, delete_entry, get_entry, load_entries, save_entry


class IdeaInput(BaseModel):
    idea_name: str = Field(..., min_length=2, max_length=120)
    problem_statement: str = Field(..., min_length=20, max_length=1000)
    target_audience: str = Field(..., min_length=5, max_length=500)
    revenue_model: str = Field(..., min_length=5, max_length=500)


class CompareRequest(BaseModel):
    entry_ids: list[str] = Field(..., min_length=2, max_length=4)


app = FastAPI(title="StartupScope AI API", version="1.0.0")

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin, "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/sample-ideas")
async def sample_ideas() -> list[dict[str, Any]]:
    sample_path = Path(__file__).resolve().parent / "data" / "sample_ideas.json"
    return json.loads(sample_path.read_text(encoding="utf-8"))


@app.get("/api/history")
async def history() -> list[dict[str, Any]]:
    entries = load_entries()
    return list(reversed(entries))


@app.get("/api/history/{entry_id}")
async def history_entry(entry_id: str) -> dict[str, Any]:
    entry = get_entry(entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry


@app.delete("/api/history/{entry_id}")
async def delete_history_entry(entry_id: str) -> dict[str, str]:
    if not delete_entry(entry_id):
        raise HTTPException(status_code=404, detail="Entry not found")
    return {"status": "deleted", "id": entry_id}


@app.post("/api/validate")
async def validate_idea(payload: IdeaInput) -> dict[str, Any]:
    idea = payload.model_dump()
    history_entries = load_entries()
    memory_context = compare_with_history(idea, history_entries)
    competitors = await fetch_competitors(
        payload.idea_name,
        payload.problem_statement,
        payload.target_audience,
    )
    report = await generate_validation_report(idea, competitors, memory_context)
    saved = save_entry(idea, report)
    return saved


@app.post("/api/compare")
async def compare_ideas(payload: CompareRequest) -> dict[str, Any]:
    entries = [get_entry(entry_id) for entry_id in payload.entry_ids]
    if any(entry is None for entry in entries):
        raise HTTPException(status_code=404, detail="One or more entries not found")

    valid_entries = [entry for entry in entries if entry]
    comparison = []
    for entry in valid_entries:
        report = entry["report"]
        comparison.append(
            {
                "id": entry["id"],
                "idea_name": entry["idea"]["idea_name"],
                "score": report.get("score"),
                "competition": report.get("competition"),
                "top_gap": contextual_top_gap(entry["idea"], report.get("gaps", [""])[0]),
                "best_suggestion": report.get("suggestions", ["No suggestion available"])[0],
            }
        )

    winner = max(comparison, key=lambda item: item["score"])
    return {"comparison": comparison, "leader": winner}
