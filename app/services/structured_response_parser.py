from __future__ import annotations

import json
from json import JSONDecodeError
from typing import TypeVar

from pydantic import BaseModel, ValidationError

ModelT = TypeVar("ModelT", bound=BaseModel)


def parse_structured_response(
    response_text: str,
    model_type: type[ModelT],
    *,
    error_message: str,
) -> ModelT:
    try:
        payload_text = _extract_json_payload(response_text)
    except ValueError as exc:
        raise ValueError(error_message) from exc

    try:
        payload = json.loads(payload_text)
        return model_type.model_validate(payload)
    except (JSONDecodeError, ValidationError) as exc:
        raise ValueError(error_message) from exc


def _extract_json_payload(response_text: str) -> str:
    cleaned = response_text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.startswith("json"):
            cleaned = cleaned[4:].strip()

    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1 or end < start:
        raise ValueError("Claude returned an invalid structured response.")
    return cleaned[start : end + 1]
