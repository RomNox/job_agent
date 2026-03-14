from pydantic import BaseModel, Field


class MatchResult(BaseModel):
    match_score: float = Field(ge=0, le=100)
    summary: str
    strengths: list[str] = Field(default_factory=list)
    gaps: list[str] = Field(default_factory=list)
    recommended_next_steps: list[str] = Field(default_factory=list)
