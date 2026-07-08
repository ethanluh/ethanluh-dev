# CLAUDE.md

## Project
<one-line description — fill in per-project>

## Stack
Python 3.12 (uv), optional C++20/CMake in `cpp/`.

## Commands
- Test: `pytest -q`
- Lint: `ruff check . && ruff format --check .`
- Type check: `mypy src`
- Build (C++): `cmake -B cpp/build -S cpp && cmake --build cpp/build`

## Conventions
- Terse commit messages, imperative mood, no trailing period.
- Prefer smallest adequate file format (.md over .docx, .csv over .xlsx).
- No comments unless logic is non-obvious.
- Type hints on all Python function signatures.

## Directory map
- `src/` — library code
- `tests/` — pytest suite, mirrors `src/` structure
- `cpp/` — optional native extensions / standalone C++ components
- `docs/` — architecture notes, ADRs, setup instructions

## Out of scope
Claude Code should not modify `.github/workflows/` without explicit request.
