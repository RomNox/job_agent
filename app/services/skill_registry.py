from __future__ import annotations

from pathlib import Path
from typing import Sequence


class ClaudeSkillRegistry:
    def __init__(self, skills_dir: Path) -> None:
        self._skills_dir = skills_dir

    def available_skills(self) -> list[str]:
        if not self._skills_dir.exists():
            return []
        return sorted(path.name for path in self._skills_dir.iterdir() if path.is_dir())

    def load_skill(self, skill_name: str) -> str:
        skill_path = self._skills_dir / skill_name / "SKILL.md"
        if not skill_path.exists():
            raise FileNotFoundError(
                f"Skill '{skill_name}' was not found in {self._skills_dir}."
            )
        return skill_path.read_text(encoding="utf-8").strip()

    def render_skill_context(self, skill_names: Sequence[str]) -> str:
        sections = []
        for skill_name in skill_names:
            sections.append(f"Skill: {skill_name}\n{self.load_skill(skill_name)}")
        return "\n\n".join(sections)
