#!/usr/bin/env bash
# Blocks "gh pr create"/"gh pr edit" commands whose body is missing Quire's
# <!-- declared-direction: ... --> marker. Installed by Quire's repo setup — see CLAUDE.md.
set -euo pipefail

input="$(cat)"
command="$(printf '%s' "$input" | jq -r '.tool_input.command // empty')"

if ! printf '%s' "$command" | grep -qE 'gh pr (create|edit)'; then
  exit 0
fi

marker_re='<!--[[:space:]]*declared-direction:[[:space:]]*[^[:space:]].*-->'

if printf '%s' "$command" | grep -qE "$marker_re"; then
  exit 0
fi

# --body-file points the marker at a file instead of the inline command
# string; the pr skill always writes the body to a file, so check that too.
body_file="$(printf '%s' "$command" | grep -oE -- '--body-file[= ][^[:space:]"]+' | head -n1 | sed -E 's/^--body-file[= ]//' || true)"
if [[ -n "$body_file" && -f "$body_file" ]] && grep -qE "$marker_re" "$body_file"; then
  exit 0
fi

echo "This PR body is missing a <!-- declared-direction: ... --> marker. Add one describing this PR's product-direction intent before opening/editing the PR." >&2
exit 2
