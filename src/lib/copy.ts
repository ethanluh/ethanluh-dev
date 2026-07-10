import COPY from "../../copy";

function lookup(key: string): string {
  const value = key.split(".").reduce<unknown>((node, segment) => {
    if (node && typeof node === "object" && segment in node) {
      return (node as Record<string, unknown>)[segment];
    }
    return undefined;
  }, COPY);

  if (typeof value !== "string") {
    throw new Error(`Missing copy.ts key: "${key}"`);
  }
  return value;
}

/** Look up a copy.ts entry by dot-path key (e.g. "home.hero.headline"). */
export function copy(key: string): string {
  return lookup(key);
}

/** Look up a copy.ts entry and fill in {{placeholder}} tokens. */
export function copyTemplate(key: string, vars: Record<string, string | number>): string {
  let text = lookup(key);
  for (const [name, value] of Object.entries(vars)) {
    text = text.replaceAll(`{{${name}}}`, String(value));
  }
  return text;
}
