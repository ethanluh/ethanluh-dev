# 0001. Use this template repo structure

## Context

New projects need a consistent starting point for tooling, CI, and docs so
that setup time isn't spent re-deriving the same conventions each time.

## Decision

Adopt this repo's structure (uv-managed Python, optional CMake C++, ruff/mypy,
GitHub Actions CI) as the default template for new research and general
software projects.

## Consequences

- New repos start with working lint/type-check/test CI out of the box.
- Deviating from the template (e.g. dropping `cpp/`, swapping test runners)
  is expected and should be recorded as a new ADR in this directory.
