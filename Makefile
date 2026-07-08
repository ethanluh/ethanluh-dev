.PHONY: setup test lint format build clean

setup:
	uv sync
	pre-commit install

test:
	pytest -q

lint:
	ruff check .
	ruff format --check .
	mypy src

format:
	ruff check --fix .
	ruff format .

build:
	uv sync
	uv run python -m build
	cmake -B cpp/build -S cpp
	cmake --build cpp/build

clean:
	rm -rf dist build cpp/build .mypy_cache .ruff_cache .pytest_cache
	find . -type d -name "__pycache__" -exec rm -rf {} +
