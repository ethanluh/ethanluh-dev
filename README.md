# template-repo

This is a **template repository**, not a project. It provides a starting
point for Python/C++ (research + general software) repos: tooling, lint/type
checks, CI, and doc scaffolding already wired up.

## Usage

Create a new repo from this template:

```
gh repo create <new-repo-name> --template ethluh/template-repo --private
```

Or use the "Use this template" button on GitHub.

Then:

1. Update `pyproject.toml` (`name`, `description`) and `CLAUDE.md` (project
   description).
2. Run `make setup` to install dependencies and pre-commit hooks.

## What to prune

- `cpp/` — delete if this is a pure-Python project.
- `docs/decisions/0001-template.md` — replace with project-specific ADRs.
- `LICENSE` — add one appropriate to the new project.

## License

No license is included by default — add one (e.g. MIT, Apache-2.0) before
treating a derived project as open source.
