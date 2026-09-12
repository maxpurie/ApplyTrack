from typing import Any

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.api.deps import CurrentUser
from app.core.config import settings

router = APIRouter(prefix="/career", tags=["career"])


class CareerCopilotRequest(BaseModel):
    resume_text: str = Field(min_length=40, max_length=12000)
    job_description: str = Field(min_length=40, max_length=12000)


class CareerCopilotResponse(BaseModel):
    advice: str


@router.post("/copilot", response_model=CareerCopilotResponse)
def run_career_copilot(
    payload: CareerCopilotRequest, _current_user: CurrentUser
) -> Any:
    """Create private, tailored application advice without persisting the input."""
    if not settings.OPENAI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="AI Copilot is not configured. Add OPENAI_API_KEY to your local .env.",
        )

    instructions = (
        "You are ApplyTrack's concise career copilot. Compare the candidate resume "
        "with the job description. Return markdown with exactly these sections: "
        "Match summary, strongest evidence, gaps to address, and a tailored next step. "
        "Do not invent experience or recommend dishonest claims."
    )
    prompt = f"RESUME:\n{payload.resume_text}\n\nJOB DESCRIPTION:\n{payload.job_description}"
    try:
        response = httpx.post(
            "https://api.openai.com/v1/responses",
            headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
            json={
                "model": settings.OPENAI_MODEL,
                "instructions": instructions,
                "input": prompt,
                "store": False,
            },
            timeout=30,
        )
        response.raise_for_status()
        advice = response.json().get("output_text")
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail="AI Copilot request failed.") from exc

    if not advice:
        raise HTTPException(status_code=502, detail="AI Copilot returned no advice.")
    return CareerCopilotResponse(advice=advice)
