# job-agent

`job-agent` is a minimal, production-ready skeleton for an AI agent that helps users find jobs and Ausbildung positions in Germany. The repository is intentionally light on business logic and heavy on clean boundaries so you can extend it with job-board integrations, parsers, ranking logic, and application workflows later.

## Purpose

- Provide a FastAPI service with a clean entrypoint and versioned API router.
- Wrap the Anthropic Claude API behind a service layer.
- Support local Claude Agent Skills stored in `.claude/skills/`.
- Keep the core agent, tools, services, and models separated for easier extension.

## Architecture

The project follows a simple clean architecture split:

- `app/`: application package root
- `app/api/`: FastAPI routers and HTTP-facing schemas
- `app/agents/`: orchestration logic, including `JobAgent`
- `app/services/`: integrations such as Claude API access and skill loading
- `app/tools/`: placeholder functions for job search and application generation tasks
- `app/models/`: pydantic data models for job and candidate workflows
- `frontend/`: Next.js workspace for the product UI
- `data/`: local data files or fixtures
- `tests/`: automated tests
- `scripts/`: helper scripts such as the local uvicorn runner

Current project tree:

```text
job-agent/
├── .claude/
│   └── skills/
│       ├── analyze-job-posting/
│       │   └── SKILL.md
│       ├── generate-anschreiben/
│       │   └── SKILL.md
│       ├── match-candidate/
│       │   └── SKILL.md
│       ├── prepare-application/
│       │   └── SKILL.md
│       └── tailor-cv/
│           └── SKILL.md
├── app/
│   ├── __init__.py
│   ├── agents/
│   │   ├── __init__.py
│   │   └── job_agent.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── router.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── agent.py
│   │       ├── applications.py
│   │       ├── health.py
│   │       ├── jobs.py
│   │       └── meta.py
│   ├── config.py
│   ├── dependencies.py
│   ├── main.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── agent_io.py
│   │   ├── application_package.py
│   │   ├── candidate_profile.py
│   │   ├── cover_letter.py
│   │   ├── cv_tailoring.py
│   │   ├── job_analysis.py
│   │   ├── job_match.py
│   │   ├── job_parsing.py
│   │   ├── job_posting.py
│   │   └── match_result.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── application_package_service.py
│   │   ├── claude_service.py
│   │   ├── cover_letter_service.py
│   │   ├── cv_tailoring_service.py
│   │   ├── job_analysis_service.py
│   │   ├── job_match_service.py
│   │   ├── job_parsing_service.py
│   │   ├── structured_response_parser.py
│   │   └── skill_registry.py
│   └── tools/
│       ├── __init__.py
│       ├── generate_cover_letter.py
│       ├── parse_job_posting.py
│       ├── search_jobs.py
│       └── tailor_cv.py
├── data/
│   └── .gitkeep
├── frontend/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── application-workspace.tsx
│   │   ├── candidate-profile-form.tsx
│   │   ├── checklist-card.tsx
│   │   ├── cover-letter-card.tsx
│   │   ├── cv-tailoring-card.tsx
│   │   ├── job-input-form.tsx
│   │   ├── match-result-card.tsx
│   │   ├── progress-indicator.tsx
│   │   ├── section-card.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       └── textarea.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── schemas.ts
│   │   └── utils.ts
│   ├── types/
│   │   └── api.ts
│   ├── components.json
│   ├── next-env.d.ts
│   ├── next.config.mjs
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── scripts/
│   └── run_server.sh
├── skills/
│   └── README.md
├── tests/
│   ├── test_applications_api.py
│   ├── test_agent_api.py
│   ├── test_job_parsing_api.py
│   ├── test_jobs_api.py
│   └── test_health.py
├── .env.example
├── .gitignore
├── README.md
├── requirements-dev.txt
└── requirements.txt
```

## Skills

Claude Agent Skills live in `.claude/skills/`:

- `.claude/skills/analyze-job-posting/`
- `.claude/skills/match-candidate/`
- `.claude/skills/generate-anschreiben/`
- `.claude/skills/prepare-application/`
- `.claude/skills/tailor-cv/`

The root `skills/` directory is reserved for shared prompt assets or future non-Claude skill helpers.

## Run Locally

Use Python 3.11.

Backend:

```bash
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
./scripts/run_server.sh
```

The API will start on `http://127.0.0.1:8000`.
The backend accepts browser requests from `http://localhost:3000` and `http://127.0.0.1:3000` for the local frontend workspace.

Frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend assumes the backend is available at `http://127.0.0.1:8000`.
Override it with `NEXT_PUBLIC_API_BASE_URL` if needed.

To run tests:

```bash
pip install -r requirements-dev.txt
pytest
```

## Endpoints

- `GET /health`: health check
- `GET /api/v1/info`: service metadata and available skills
- `POST /api/v1/agent/run`: basic agent execution endpoint
- `POST /api/v1/jobs/analyze`: structured analysis of a raw job posting
- `POST /api/v1/jobs/parse`: fetch and extract readable job-posting text from a URL
- `POST /api/v1/jobs/match`: candidate-to-job match analysis
- `POST /api/v1/applications/cover-letter`: tailored German cover letter generation
- `POST /api/v1/applications/tailor-cv`: tailored CV summary and highlights
- `POST /api/v1/applications/prepare`: complete application package assembly

## Frontend

The frontend is a minimal Next.js App Router workspace under `frontend/`.

- Install with `cd frontend && npm install`
- Run with `npm run dev`
- Check with `npm run lint` and `npm run build`
- Default backend base URL: `http://127.0.0.1:8000`
- The local backend already allows requests from `http://localhost:3000` and `http://127.0.0.1:3000`
- The UI provides a workflow-oriented workspace for parsing a job URL, filling in a candidate profile, and reviewing the prepared application package

## Notes

- Claude calls require `ANTHROPIC_API_KEY` in `.env`.
- Tool modules are placeholders by design and currently return stubbed results.
- The scaffold is ready for new services, tools, and skill definitions without changing the top-level layout.
