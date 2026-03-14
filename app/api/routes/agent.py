from fastapi import APIRouter, Depends, HTTPException, status

from app.agents.job_agent import JobAgent
from app.dependencies import get_job_agent
from app.models.agent_io import AgentRequest, AgentResponse

router = APIRouter(prefix="/agent", tags=["agent"])


@router.post("/run", response_model=AgentResponse, summary="Run the job agent")
async def run_job_agent(
    payload: AgentRequest,
    agent: JobAgent = Depends(get_job_agent),
) -> AgentResponse:
    try:
        return await agent.run(
            prompt=payload.prompt,
            context=payload.context,
            skills=payload.skills,
        )
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
