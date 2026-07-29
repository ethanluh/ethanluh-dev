#!/usr/bin/env bash
# Blocks "gh pr create"/"gh pr edit" commands whose body is missing Quire's
# <!-- declared-direction: ... --> marker. Installed by Quire's repo setup — see CLAUDE.md.
#
# Regex here is POSIX ERE only (no -P) since BSD grep on macOS doesn't support
# PCRE and this hook runs on both mac and linux. jq (not regex) parses the
# JSON payload once we already know it's PR-relevant — the previous regex
# extraction stopped at the first embedded quote (eg. from --title "..."),
# silently dropping everything after it including --body-file.
set -euo pipefail

input="$(cat)"

# Cheap prefilter on the raw payload so ordinary Bash calls never touch jq.
if ! printf '%s' "$input" | grep -qE 'gh[[:space:]]+pr[[:space:]]+(create|edit)'; then
  exit 0
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "check-declared-direction.sh needs jq to parse the hook payload but jq isn't on PATH. Install it (eg. 'brew install jq' / 'apt install jq') to keep this check enforced." >&2
  exit 2
fi

command="$(printf '%s' "$input" | jq -r '.tool_input.command // empty')"

if ! printf '%s' "$command" | grep -qE 'gh pr (create|edit)'; then
  exit 0
fi

marker_re='<!--[[:space:]]*declared-direction:[[:space:]]*[^[:space:]].*-->'

if printf '%s' "$command" | grep -qE "$marker_re"; then
  exit 0
fi

# The marker usually lives in a --body-file target, not the inline command.
# xargs tokenizes with real quote-awareness, so a quoted/spaced path stays
# one token instead of splitting on its internal whitespace.
body_file=""
prev=""
while IFS= read -r tok; do
  if [[ "$prev" == "--body-file" ]]; then
    body_file="$tok"
    break
  fi
  prev="$tok"
done < <(printf '%s' "$command" | xargs -n1 -- printf '%s\n' 2>/dev/null || true)

if [[ -n "$body_file" && -f "$body_file" ]] && grep -qE "$marker_re" "$body_file"; then
  exit 0
fi

echo "This PR body is missing a <!-- declared-direction: ... --> marker. Add one describing this PR's product-direction intent before opening/editing the PR." >&2
exit 2
