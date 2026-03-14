from fastapi.testclient import TestClient

from app.dependencies import get_claude_service
from app.main import app


class StructuredCoverLetterClaudeService:
    async def generate_response(
        self,
        prompt: str,
        *,
        system_prompt: str | None = None,
        context: dict | None = None,
        skills: list[str] | None = None,
        max_tokens: int = 1024,
    ) -> dict:
        assert "cover_letter, key_points_used, warnings" in prompt
        assert system_prompt is not None
        assert skills == ["generate-anschreiben"]
        assert max_tokens == 1600
        assert context is not None
        assert context["candidate_profile"]["full_name"] == "Maria Keller"
        assert context["job_posting"]["title"] == "Ausbildung Fachinformatik"

        return {
            "text": """
            {
              "cover_letter": "Sehr geehrte Damen und Herren,\\n\\nmit grossem Interesse bewerbe ich mich um die Ausbildung Fachinformatik bei der Beispiel GmbH in Hamburg. Durch meine ersten Python-Projekte, meine strukturierte Arbeitsweise und meine hohe Motivation bringe ich eine gute Grundlage fuer den Einstieg mit. Besonders spricht mich an, dass Ihre Ausbildung praxisnah aufgebaut ist und einen klaren Schwerpunkt auf Softwareentwicklung legt.\\n\\nGerne ueberzeuge ich Sie in einem persoenlichen Gespraech von meiner Motivation und Lernbereitschaft.\\n\\nMit freundlichen Gruessen\\nMaria Keller",
              "key_points_used": ["Python projects", "Strong motivation for Ausbildung", "Interest in software development"],
              "warnings": ["Review the employer salutation before sending"]
            }
            """.strip(),
            "model": "mock-claude",
            "usage": {"input_tokens": 55, "output_tokens": 120},
        }


class RawCoverLetterClaudeService:
    def __init__(self) -> None:
        self.skills_seen: list[list[str] | None] = []

    async def generate_response(
        self,
        prompt: str,
        *,
        system_prompt: str | None = None,
        context: dict | None = None,
        skills: list[str] | None = None,
        max_tokens: int = 1024,
    ) -> dict:
        self.skills_seen.append(skills)

        if skills == ["analyze-job-posting"]:
            assert "Industriekaufmann" in prompt
            assert context == {"source_url": "https://example.com/ausbildung"}
            return {
                "text": """
                {
                  "title": "Ausbildung Industriekaufmann",
                  "employer": "Nordhandel AG",
                  "location": "Bremen",
                  "employment_type": "ausbildung",
                  "language": "de",
                  "requirements": ["Organisation", "Deutsch B2", "Teamfaehigkeit"],
                  "summary": "Ausbildung im kaufmaennischen Bereich in Bremen.",
                  "missing_information": ["start date"]
                }
                """.strip(),
                "model": "mock-claude",
                "usage": {"input_tokens": 30, "output_tokens": 60},
            }

        if skills == ["generate-anschreiben"]:
            assert system_prompt is not None
            assert context is not None
            assert context["candidate_profile"]["full_name"] == "Lukas Braun"
            assert context["job_posting"]["title"] == "Ausbildung Industriekaufmann"
            assert max_tokens == 1600
            return {
                "text": """
                {
                  "cover_letter": "Sehr geehrte Damen und Herren,\\n\\nmit grossem Interesse bewerbe ich mich um die Ausbildung zum Industriekaufmann bei der Nordhandel AG. Meine strukturierte Arbeitsweise, mein Interesse an kaufmaennischen Prozessen und meine Motivation fuer den Beruf machen mich zu einem passenden Bewerber.\\n\\nIch freue mich darauf, Sie in einem Gespraech kennenzulernen.\\n\\nMit freundlichen Gruessen\\nLukas Braun",
                  "key_points_used": ["Organizational skills", "Motivation for commercial work", "Relevant location match"],
                  "warnings": ["Check whether a specific contact person is available"]
                }
                """.strip(),
                "model": "mock-claude",
                "usage": {"input_tokens": 45, "output_tokens": 100},
            }

        raise AssertionError(f"Unexpected skills payload: {skills}")


class MissingApiKeyClaudeService:
    async def generate_response(
        self,
        prompt: str,
        *,
        system_prompt: str | None = None,
        context: dict | None = None,
        skills: list[str] | None = None,
        max_tokens: int = 1024,
    ) -> dict:
        _ = (prompt, system_prompt, context, skills, max_tokens)
        raise RuntimeError("ANTHROPIC_API_KEY is not configured.")


def test_generate_cover_letter_with_structured_job_input() -> None:
    app.dependency_overrides[get_claude_service] = lambda: StructuredCoverLetterClaudeService()

    try:
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/applications/cover-letter",
                json={
                    "candidate_profile": {
                        "full_name": "Maria Keller",
                        "summary": "Motivated candidate with first Python projects.",
                        "skills": ["Python", "Teamwork"],
                        "languages": ["German C1", "English B2"],
                    },
                    "job_posting": {
                        "title": "Ausbildung Fachinformatik",
                        "employer": "Beispiel GmbH",
                        "location": "Hamburg",
                        "employment_type": "ausbildung",
                        "language": "de",
                        "requirements": ["Python", "Motivation", "Teamfaehigkeit"],
                        "summary": "Ausbildung im Bereich Softwareentwicklung.",
                        "missing_information": []
                    }
                },
            )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json() == {
        "cover_letter": "Sehr geehrte Damen und Herren,\n\nmit grossem Interesse bewerbe ich mich um die Ausbildung Fachinformatik bei der Beispiel GmbH in Hamburg. Durch meine ersten Python-Projekte, meine strukturierte Arbeitsweise und meine hohe Motivation bringe ich eine gute Grundlage fuer den Einstieg mit. Besonders spricht mich an, dass Ihre Ausbildung praxisnah aufgebaut ist und einen klaren Schwerpunkt auf Softwareentwicklung legt.\n\nGerne ueberzeuge ich Sie in einem persoenlichen Gespraech von meiner Motivation und Lernbereitschaft.\n\nMit freundlichen Gruessen\nMaria Keller",
        "key_points_used": ["Python projects", "Strong motivation for Ausbildung", "Interest in software development"],
        "warnings": ["Review the employer salutation before sending"],
    }


def test_generate_cover_letter_reuses_job_analysis_for_raw_text() -> None:
    mock_service = RawCoverLetterClaudeService()
    app.dependency_overrides[get_claude_service] = lambda: mock_service

    try:
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/applications/cover-letter",
                json={
                    "candidate_profile": {
                        "full_name": "Lukas Braun",
                        "summary": "Motivated applicant for a commercial Ausbildung.",
                        "skills": ["Organisation", "Communication"],
                        "desired_roles": ["Industriekaufmann"],
                        "desired_locations": ["Bremen"],
                        "languages": ["German C1"],
                    },
                    "raw_text": (
                        "Ausbildung Industriekaufmann (m/w/d) bei Nordhandel AG in Bremen. "
                        "Wir suchen Organisation, Teamfaehigkeit und Deutsch B2."
                    ),
                    "source_url": "https://example.com/ausbildung",
                },
            )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json() == {
        "cover_letter": "Sehr geehrte Damen und Herren,\n\nmit grossem Interesse bewerbe ich mich um die Ausbildung zum Industriekaufmann bei der Nordhandel AG. Meine strukturierte Arbeitsweise, mein Interesse an kaufmaennischen Prozessen und meine Motivation fuer den Beruf machen mich zu einem passenden Bewerber.\n\nIch freue mich darauf, Sie in einem Gespraech kennenzulernen.\n\nMit freundlichen Gruessen\nLukas Braun",
        "key_points_used": ["Organizational skills", "Motivation for commercial work", "Relevant location match"],
        "warnings": ["Check whether a specific contact person is available"],
    }
    assert mock_service.skills_seen == [["analyze-job-posting"], ["generate-anschreiben"]]


def test_generate_cover_letter_returns_503_when_api_key_is_missing() -> None:
    app.dependency_overrides[get_claude_service] = lambda: MissingApiKeyClaudeService()

    try:
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/applications/cover-letter",
                json={
                    "candidate_profile": {
                        "full_name": "Lukas Braun",
                        "skills": ["Organisation"],
                    },
                    "job_posting": {
                        "title": "Ausbildung Industriekaufmann",
                        "employer": "Nordhandel AG",
                        "location": "Bremen",
                        "employment_type": "ausbildung",
                        "language": "de",
                        "requirements": ["Organisation"],
                        "summary": "Ausbildung im kaufmaennischen Bereich.",
                        "missing_information": []
                    }
                },
            )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 503
    assert response.json() == {
        "detail": "ANTHROPIC_API_KEY is not configured."
    }


class StructuredCVTailoringClaudeService:
    async def generate_response(
        self,
        prompt: str,
        *,
        system_prompt: str | None = None,
        context: dict | None = None,
        skills: list[str] | None = None,
        max_tokens: int = 1024,
    ) -> dict:
        assert "tailored_summary, highlighted_skills, suggested_experience_points, warnings" in prompt
        assert system_prompt is not None
        assert skills == ["tailor-cv"]
        assert max_tokens == 1400
        assert context is not None
        assert context["candidate_profile"]["full_name"] == "Sofia Weber"
        assert context["job_posting"]["title"] == "Junior Data Analyst"

        return {
            "text": """
            {
              "tailored_summary": "Data-oriented Berufseinsteigerin mit soliden SQL- und Python-Grundlagen, die analytisches Denken, strukturierte Arbeitsweise und hohe Lernbereitschaft in eine Junior-Data-Analyst-Rolle einbringt.",
              "highlighted_skills": ["SQL", "Python", "Excel", "Analytisches Denken"],
              "suggested_experience_points": ["Analysierte Projekt-Datensaetze mit SQL und bereitete Ergebnisse strukturiert auf.", "Unterstuetzte die Auswertung kleiner Reports mit Python und Excel.", "Arbeitete sorgfaeltig und termingerecht in teamuebergreifenden Aufgaben."],
              "warnings": ["Quantify analysis project results if possible"]
            }
            """.strip(),
            "model": "mock-claude",
            "usage": {"input_tokens": 60, "output_tokens": 110},
        }


class RawCVTailoringClaudeService:
    def __init__(self) -> None:
        self.skills_seen: list[list[str] | None] = []

    async def generate_response(
        self,
        prompt: str,
        *,
        system_prompt: str | None = None,
        context: dict | None = None,
        skills: list[str] | None = None,
        max_tokens: int = 1024,
    ) -> dict:
        self.skills_seen.append(skills)

        if skills == ["analyze-job-posting"]:
            assert "Mechatroniker" in prompt
            assert context == {"source_url": "https://example.com/mechatroniker"}
            return {
                "text": """
                {
                  "title": "Ausbildung Mechatroniker",
                  "employer": "Werktechnik Nord GmbH",
                  "location": "Hannover",
                  "employment_type": "ausbildung",
                  "language": "de",
                  "requirements": ["Technisches Interesse", "Sorgfalt", "Teamarbeit"],
                  "summary": "Ausbildung mit technischem Schwerpunkt in Hannover.",
                  "missing_information": ["salary range"]
                }
                """.strip(),
                "model": "mock-claude",
                "usage": {"input_tokens": 28, "output_tokens": 58},
            }

        if skills == ["tailor-cv"]:
            assert system_prompt is not None
            assert context is not None
            assert context["candidate_profile"]["full_name"] == "Jonas Richter"
            assert context["job_posting"]["title"] == "Ausbildung Mechatroniker"
            assert max_tokens == 1400
            return {
                "text": """
                {
                  "tailored_summary": "Technisch interessierter Bewerber mit praktischer Lernbereitschaft, sorgfaeltiger Arbeitsweise und Motivation fuer eine Ausbildung im mechatronischen Umfeld.",
                  "highlighted_skills": ["Technisches Interesse", "Sorgfalt", "Teamarbeit"],
                  "suggested_experience_points": ["Unterstuetzte praktische Schulprojekte mit technischem Bezug verantwortungsbewusst.", "Arbeitete zuverlaessig und genau bei teamorientierten Aufgaben.", "Zeigte hohes Interesse an technischen Ablaeufen und systematischem Lernen."],
                  "warnings": ["Add concrete technical project examples if available"]
                }
                """.strip(),
                "model": "mock-claude",
                "usage": {"input_tokens": 40, "output_tokens": 95},
            }

        raise AssertionError(f"Unexpected skills payload: {skills}")


def test_tailor_cv_with_structured_job_input() -> None:
    app.dependency_overrides[get_claude_service] = lambda: StructuredCVTailoringClaudeService()

    try:
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/applications/tailor-cv",
                json={
                    "candidate_profile": {
                        "full_name": "Sofia Weber",
                        "summary": "Entry-level analyst with SQL and Python coursework.",
                        "skills": ["SQL", "Python", "Excel"],
                        "languages": ["German C1", "English B2"],
                    },
                    "job_posting": {
                        "title": "Junior Data Analyst",
                        "employer": "Datahaus Berlin",
                        "location": "Berlin",
                        "employment_type": "full-time",
                        "language": "de",
                        "requirements": ["SQL", "Excel", "Analytisches Denken"],
                        "summary": "Junior analytics role with reporting and data support tasks.",
                        "missing_information": []
                    }
                },
            )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json() == {
        "tailored_summary": "Data-oriented Berufseinsteigerin mit soliden SQL- und Python-Grundlagen, die analytisches Denken, strukturierte Arbeitsweise und hohe Lernbereitschaft in eine Junior-Data-Analyst-Rolle einbringt.",
        "highlighted_skills": ["SQL", "Python", "Excel", "Analytisches Denken"],
        "suggested_experience_points": [
            "Analysierte Projekt-Datensaetze mit SQL und bereitete Ergebnisse strukturiert auf.",
            "Unterstuetzte die Auswertung kleiner Reports mit Python und Excel.",
            "Arbeitete sorgfaeltig und termingerecht in teamuebergreifenden Aufgaben.",
        ],
        "warnings": ["Quantify analysis project results if possible"],
    }


def test_tailor_cv_reuses_job_analysis_for_raw_text() -> None:
    mock_service = RawCVTailoringClaudeService()
    app.dependency_overrides[get_claude_service] = lambda: mock_service

    try:
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/applications/tailor-cv",
                json={
                    "candidate_profile": {
                        "full_name": "Jonas Richter",
                        "summary": "Motivated school graduate with technical interest.",
                        "skills": ["Teamarbeit", "Sorgfalt"],
                        "desired_roles": ["Mechatroniker"],
                        "desired_locations": ["Hannover"],
                        "languages": ["German C1"],
                    },
                    "raw_text": (
                        "Ausbildung Mechatroniker (m/w/d) bei Werktechnik Nord GmbH in Hannover. "
                        "Gesucht werden technisches Interesse, Sorgfalt und Teamarbeit."
                    ),
                    "source_url": "https://example.com/mechatroniker",
                },
            )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json() == {
        "tailored_summary": "Technisch interessierter Bewerber mit praktischer Lernbereitschaft, sorgfaeltiger Arbeitsweise und Motivation fuer eine Ausbildung im mechatronischen Umfeld.",
        "highlighted_skills": ["Technisches Interesse", "Sorgfalt", "Teamarbeit"],
        "suggested_experience_points": [
            "Unterstuetzte praktische Schulprojekte mit technischem Bezug verantwortungsbewusst.",
            "Arbeitete zuverlaessig und genau bei teamorientierten Aufgaben.",
            "Zeigte hohes Interesse an technischen Ablaeufen und systematischem Lernen.",
        ],
        "warnings": ["Add concrete technical project examples if available"],
    }
    assert mock_service.skills_seen == [["analyze-job-posting"], ["tailor-cv"]]


def test_tailor_cv_returns_503_when_api_key_is_missing() -> None:
    app.dependency_overrides[get_claude_service] = lambda: MissingApiKeyClaudeService()

    try:
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/applications/tailor-cv",
                json={
                    "candidate_profile": {
                        "full_name": "Jonas Richter",
                        "skills": ["Sorgfalt"],
                    },
                    "job_posting": {
                        "title": "Ausbildung Mechatroniker",
                        "employer": "Werktechnik Nord GmbH",
                        "location": "Hannover",
                        "employment_type": "ausbildung",
                        "language": "de",
                        "requirements": ["Sorgfalt"],
                        "summary": "Technische Ausbildung.",
                        "missing_information": []
                    }
                },
            )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 503
    assert response.json() == {
        "detail": "ANTHROPIC_API_KEY is not configured."
    }


class StructuredApplicationPackageClaudeService:
    def __init__(self) -> None:
        self.skills_seen: list[list[str] | None] = []

    async def generate_response(
        self,
        prompt: str,
        *,
        system_prompt: str | None = None,
        context: dict | None = None,
        skills: list[str] | None = None,
        max_tokens: int = 1024,
    ) -> dict:
        self.skills_seen.append(skills)

        if skills == ["match-candidate"]:
            assert context is not None
            assert context["candidate_profile"]["full_name"] == "Nina Vogel"
            return {
                "text": """
                {
                  "match_score": 79,
                  "summary": "The candidate is a good match for the Ausbildung.",
                  "strengths": ["Communication", "Motivation", "Location fit"],
                  "gaps": ["Limited office experience"],
                  "recommended_next_steps": ["Add school project examples"]
                }
                """.strip(),
                "model": "mock-claude",
                "usage": {"input_tokens": 40, "output_tokens": 65},
            }

        if skills == ["generate-anschreiben"]:
            return {
                "text": """
                {
                  "cover_letter": "Sehr geehrte Damen und Herren,\\n\\nmit grossem Interesse bewerbe ich mich um die Ausbildung zur Kauffrau fuer Bueromanagement bei der Hanse Office GmbH. Meine strukturierte Arbeitsweise, meine Motivation und mein Interesse an organisatorischen Aufgaben passen gut zu Ihrem Ausbildungsprofil.\\n\\nMit freundlichen Gruessen\\nNina Vogel",
                  "key_points_used": ["Structured work style", "Motivation", "Interest in office processes"],
                  "warnings": ["Review the salutation before sending"]
                }
                """.strip(),
                "model": "mock-claude",
                "usage": {"input_tokens": 42, "output_tokens": 90},
            }

        if skills == ["tailor-cv"]:
            return {
                "text": """
                {
                  "tailored_summary": "Motivierte Berufseinsteigerin mit organisatorischem Interesse, strukturierter Arbeitsweise und hoher Lernbereitschaft fuer eine Ausbildung im Bueromanagement.",
                  "highlighted_skills": ["Organisation", "Kommunikation", "Sorgfalt"],
                  "suggested_experience_points": ["Unterstuetzte schulische Organisationsaufgaben zuverlaessig.", "Kommunizierte freundlich und strukturiert in Gruppenprojekten."],
                  "warnings": ["Add more concrete administration examples if available"]
                }
                """.strip(),
                "model": "mock-claude",
                "usage": {"input_tokens": 38, "output_tokens": 85},
            }

        if skills == ["prepare-application"]:
            assert "checklist, warnings" in prompt
            assert system_prompt is not None
            assert context is not None
            assert context["job_posting"]["title"] == "Ausbildung Kauffrau Bueromanagement"
            return {
                "text": """
                {
                  "checklist": ["Verify the contact person", "Review the cover letter salutation", "Add school project examples to the CV"],
                  "warnings": ["Employer contact name is still missing", "Office-related experience is lightly evidenced"]
                }
                """.strip(),
                "model": "mock-claude",
                "usage": {"input_tokens": 30, "output_tokens": 50},
            }

        raise AssertionError(f"Unexpected skills payload: {skills}")


class RawApplicationPackageClaudeService:
    def __init__(self) -> None:
        self.skills_seen: list[list[str] | None] = []

    async def generate_response(
        self,
        prompt: str,
        *,
        system_prompt: str | None = None,
        context: dict | None = None,
        skills: list[str] | None = None,
        max_tokens: int = 1024,
    ) -> dict:
        self.skills_seen.append(skills)

        if skills == ["analyze-job-posting"]:
            assert "Elektroniker" in prompt
            assert context == {"source_url": "https://example.com/elektroniker"}
            return {
                "text": """
                {
                  "title": "Ausbildung Elektroniker",
                  "employer": "TechnikWerk AG",
                  "location": "Stuttgart",
                  "employment_type": "ausbildung",
                  "language": "de",
                  "requirements": ["Technisches Interesse", "Sorgfalt", "Teamarbeit"],
                  "summary": "Technische Ausbildung in Stuttgart.",
                  "missing_information": ["salary range"]
                }
                """.strip(),
                "model": "mock-claude",
                "usage": {"input_tokens": 28, "output_tokens": 58},
            }

        if skills == ["match-candidate"]:
            return {
                "text": """
                {
                  "match_score": 81,
                  "summary": "The candidate is a promising fit for the technical Ausbildung.",
                  "strengths": ["Technical motivation", "Careful work style", "Relevant location preference"],
                  "gaps": ["Few documented technical projects"],
                  "recommended_next_steps": ["Add practical technical examples"]
                }
                """.strip(),
                "model": "mock-claude",
                "usage": {"input_tokens": 35, "output_tokens": 60},
            }

        if skills == ["generate-anschreiben"]:
            return {
                "text": """
                {
                  "cover_letter": "Sehr geehrte Damen und Herren,\\n\\nmit grossem Interesse bewerbe ich mich um die Ausbildung zum Elektroniker bei der TechnikWerk AG. Mein technisches Interesse, meine sorgfaeltige Arbeitsweise und meine Motivation fuer praktische Aufgaben passen gut zu Ihrem Ausbildungsprofil.\\n\\nMit freundlichen Gruessen\\nTim Berger",
                  "key_points_used": ["Technical interest", "Careful work style", "Motivation for practical tasks"],
                  "warnings": ["Check whether a named contact person is available"]
                }
                """.strip(),
                "model": "mock-claude",
                "usage": {"input_tokens": 40, "output_tokens": 88},
            }

        if skills == ["tailor-cv"]:
            return {
                "text": """
                {
                  "tailored_summary": "Technisch interessierter Bewerber mit hoher Lernbereitschaft, sorgfaeltiger Arbeitsweise und Motivation fuer eine Ausbildung im elektronischen Umfeld.",
                  "highlighted_skills": ["Technisches Interesse", "Sorgfalt", "Teamarbeit"],
                  "suggested_experience_points": ["Bearbeitete technische Schulaufgaben zuverlaessig und genau.", "Zeigte Interesse an praktischen technischen Zusammenhaengen in Projekten."],
                  "warnings": ["Add hands-on technical examples if available"]
                }
                """.strip(),
                "model": "mock-claude",
                "usage": {"input_tokens": 36, "output_tokens": 80},
            }

        if skills == ["prepare-application"]:
            return {
                "text": """
                {
                  "checklist": ["Add practical technical examples", "Review the cover letter contact details", "Confirm the application deadline"],
                  "warnings": ["Salary range is still unknown", "Technical project evidence is limited"]
                }
                """.strip(),
                "model": "mock-claude",
                "usage": {"input_tokens": 28, "output_tokens": 45},
            }

        raise AssertionError(f"Unexpected skills payload: {skills}")


def test_prepare_application_with_structured_job_input() -> None:
    mock_service = StructuredApplicationPackageClaudeService()
    app.dependency_overrides[get_claude_service] = lambda: mock_service

    try:
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/applications/prepare",
                json={
                    "candidate_profile": {
                        "full_name": "Nina Vogel",
                        "summary": "Motivated applicant with strong organization skills.",
                        "skills": ["Organisation", "Kommunikation", "Sorgfalt"],
                        "desired_roles": ["Kauffrau Bueromanagement"],
                        "desired_locations": ["Hamburg"],
                        "languages": ["German C1"],
                    },
                    "job_posting": {
                        "title": "Ausbildung Kauffrau Bueromanagement",
                        "employer": "Hanse Office GmbH",
                        "location": "Hamburg",
                        "employment_type": "ausbildung",
                        "language": "de",
                        "requirements": ["Organisation", "Kommunikation", "Sorgfalt"],
                        "summary": "Ausbildung im kaufmaennischen Umfeld.",
                        "missing_information": ["contact person"]
                    }
                },
            )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json() == {
        "job_posting": {
            "title": "Ausbildung Kauffrau Bueromanagement",
            "employer": "Hanse Office GmbH",
            "location": "Hamburg",
            "employment_type": "ausbildung",
            "language": "de",
            "requirements": ["Organisation", "Kommunikation", "Sorgfalt"],
            "summary": "Ausbildung im kaufmaennischen Umfeld.",
            "missing_information": ["contact person"],
        },
        "match_result": {
            "match_score": 79.0,
            "summary": "The candidate is a good match for the Ausbildung.",
            "strengths": ["Communication", "Motivation", "Location fit"],
            "gaps": ["Limited office experience"],
            "recommended_next_steps": ["Add school project examples"],
        },
        "cover_letter": {
            "cover_letter": "Sehr geehrte Damen und Herren,\n\nmit grossem Interesse bewerbe ich mich um die Ausbildung zur Kauffrau fuer Bueromanagement bei der Hanse Office GmbH. Meine strukturierte Arbeitsweise, meine Motivation und mein Interesse an organisatorischen Aufgaben passen gut zu Ihrem Ausbildungsprofil.\n\nMit freundlichen Gruessen\nNina Vogel",
            "key_points_used": ["Structured work style", "Motivation", "Interest in office processes"],
            "warnings": ["Review the salutation before sending"],
        },
        "cv_tailoring": {
            "tailored_summary": "Motivierte Berufseinsteigerin mit organisatorischem Interesse, strukturierter Arbeitsweise und hoher Lernbereitschaft fuer eine Ausbildung im Bueromanagement.",
            "highlighted_skills": ["Organisation", "Kommunikation", "Sorgfalt"],
            "suggested_experience_points": [
                "Unterstuetzte schulische Organisationsaufgaben zuverlaessig.",
                "Kommunizierte freundlich und strukturiert in Gruppenprojekten.",
            ],
            "warnings": ["Add more concrete administration examples if available"],
        },
        "checklist": [
            "Verify the contact person",
            "Review the cover letter salutation",
            "Add school project examples to the CV",
        ],
        "warnings": [
            "Employer contact name is still missing",
            "Office-related experience is lightly evidenced",
        ],
    }
    assert mock_service.skills_seen == [
        ["match-candidate"],
        ["generate-anschreiben"],
        ["tailor-cv"],
        ["prepare-application"],
    ]


def test_prepare_application_reuses_job_analysis_for_raw_text() -> None:
    mock_service = RawApplicationPackageClaudeService()
    app.dependency_overrides[get_claude_service] = lambda: mock_service

    try:
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/applications/prepare",
                json={
                    "candidate_profile": {
                        "full_name": "Tim Berger",
                        "summary": "Technically motivated applicant with careful work habits.",
                        "skills": ["Sorgfalt", "Teamarbeit"],
                        "desired_roles": ["Elektroniker"],
                        "desired_locations": ["Stuttgart"],
                        "languages": ["German C1"],
                    },
                    "raw_text": (
                        "Ausbildung Elektroniker (m/w/d) bei TechnikWerk AG in Stuttgart. "
                        "Gefragt sind technisches Interesse, Sorgfalt und Teamarbeit."
                    ),
                    "source_url": "https://example.com/elektroniker",
                },
            )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json() == {
        "job_posting": {
            "title": "Ausbildung Elektroniker",
            "employer": "TechnikWerk AG",
            "location": "Stuttgart",
            "employment_type": "ausbildung",
            "language": "de",
            "requirements": ["Technisches Interesse", "Sorgfalt", "Teamarbeit"],
            "summary": "Technische Ausbildung in Stuttgart.",
            "missing_information": ["salary range"],
        },
        "match_result": {
            "match_score": 81.0,
            "summary": "The candidate is a promising fit for the technical Ausbildung.",
            "strengths": ["Technical motivation", "Careful work style", "Relevant location preference"],
            "gaps": ["Few documented technical projects"],
            "recommended_next_steps": ["Add practical technical examples"],
        },
        "cover_letter": {
            "cover_letter": "Sehr geehrte Damen und Herren,\n\nmit grossem Interesse bewerbe ich mich um die Ausbildung zum Elektroniker bei der TechnikWerk AG. Mein technisches Interesse, meine sorgfaeltige Arbeitsweise und meine Motivation fuer praktische Aufgaben passen gut zu Ihrem Ausbildungsprofil.\n\nMit freundlichen Gruessen\nTim Berger",
            "key_points_used": ["Technical interest", "Careful work style", "Motivation for practical tasks"],
            "warnings": ["Check whether a named contact person is available"],
        },
        "cv_tailoring": {
            "tailored_summary": "Technisch interessierter Bewerber mit hoher Lernbereitschaft, sorgfaeltiger Arbeitsweise und Motivation fuer eine Ausbildung im elektronischen Umfeld.",
            "highlighted_skills": ["Technisches Interesse", "Sorgfalt", "Teamarbeit"],
            "suggested_experience_points": [
                "Bearbeitete technische Schulaufgaben zuverlaessig und genau.",
                "Zeigte Interesse an praktischen technischen Zusammenhaengen in Projekten.",
            ],
            "warnings": ["Add hands-on technical examples if available"],
        },
        "checklist": [
            "Add practical technical examples",
            "Review the cover letter contact details",
            "Confirm the application deadline",
        ],
        "warnings": [
            "Salary range is still unknown",
            "Technical project evidence is limited",
        ],
    }
    assert mock_service.skills_seen == [
        ["analyze-job-posting"],
        ["match-candidate"],
        ["generate-anschreiben"],
        ["tailor-cv"],
        ["prepare-application"],
    ]


def test_prepare_application_returns_503_when_api_key_is_missing() -> None:
    app.dependency_overrides[get_claude_service] = lambda: MissingApiKeyClaudeService()

    try:
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/applications/prepare",
                json={
                    "candidate_profile": {
                        "full_name": "Tim Berger",
                        "skills": ["Sorgfalt"],
                    },
                    "job_posting": {
                        "title": "Ausbildung Elektroniker",
                        "employer": "TechnikWerk AG",
                        "location": "Stuttgart",
                        "employment_type": "ausbildung",
                        "language": "de",
                        "requirements": ["Sorgfalt"],
                        "summary": "Technische Ausbildung.",
                        "missing_information": []
                    }
                },
            )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 503
    assert response.json() == {
        "detail": "ANTHROPIC_API_KEY is not configured."
    }
