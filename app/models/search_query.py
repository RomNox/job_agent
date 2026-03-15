from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class SearchQuery(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    keywords: str = Field(
        ...,
        min_length=1,
        description="Search keywords submitted by the user.",
    )
    location: str | None = Field(
        default=None,
        description="Optional search location such as Berlin or Germany.",
    )
    remote_only: bool = Field(
        default=False,
        description="Whether to keep only remote-friendly results.",
    )
    employment_type: str | None = Field(
        default=None,
        description="Optional employment type filter.",
    )
    page: int = Field(default=1, ge=1)
    results_per_page: int = Field(default=20, ge=1, le=50)
    source: Literal["jooble"] = Field(default="jooble")
