# Contributing

## Branch naming

`<type>/<short-description>`, e.g. `fix/off-by-one-in-parser`,
`feat/add-retry-logic`. Types: `feat`, `fix`, `docs`, `refactor`, `test`,
`chore`.

## Commit style

Terse, imperative mood, no trailing period (e.g. `Fix off-by-one in parser`).

## Pull request checklist

- [ ] `pytest -q` passes
- [ ] `ruff check . && ruff format --check .` passes
- [ ] `mypy src` passes
- [ ] `cmake --build cpp/build` passes (if `cpp/` touched)
- [ ] PR description explains *why*, not just *what*
