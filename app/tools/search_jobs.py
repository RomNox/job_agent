from app.models.job_posting import JobPosting


async def search_jobs(query: str, location: str = "Germany") -> list[JobPosting]:
    """Placeholder for future job board and ATS integrations."""
    _ = (query, location)
    return []
