from app.models.job_posting import JobPosting


def parse_job_posting(raw_text: str, source_url: str | None = None) -> JobPosting:
    """Placeholder parser that preserves the raw posting text."""
    return JobPosting(
        title="Unparsed job posting",
        employer="Unknown employer",
        location="Germany",
        description=raw_text,
        source_url=source_url,
    )
