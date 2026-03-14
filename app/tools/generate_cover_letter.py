from app.models.candidate_profile import CandidateProfile
from app.models.job_posting import JobPosting


def generate_cover_letter(
    job_posting: JobPosting,
    candidate_profile: CandidateProfile,
) -> str:
    """Placeholder for Claude-assisted cover letter generation."""
    _ = (job_posting, candidate_profile)
    return "Cover letter generation has not been implemented yet."
