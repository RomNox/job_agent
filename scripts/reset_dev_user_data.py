#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.config import get_settings
from app.repositories.sqlite_database import SQLiteDatabase


def main() -> None:
    settings = get_settings()
    db_path = settings.auth_db_path

    if db_path.exists():
        db_path.unlink()

    SQLiteDatabase(db_path)
    print(f"Reset dev user data at {db_path}")


if __name__ == "__main__":
    main()
