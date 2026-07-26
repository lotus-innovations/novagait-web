import { describe, expect, it } from "vitest";
import tokens from "../../design-tokens.json";

/** WCAG 2.x relative luminance of a #RRGGBB hex color. */
function luminance(hex: string): number {
  const channel = (i: number) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

function contrastRatio(fg: string, bg: string): number {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

describe("design token contrast (WCAG 2.2 AA)", () => {
  it.each(tokens.contrastPairs)(
    "$name: $fg on $bg >= $min:1",
    ({ fg, bg, min }) => {
      expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(min);
    },
  );

  it("covers every color token that is used as text on bg or surface", () => {
    // Guard against tokens being added without a corresponding contrast pair.
    const paired = new Set(tokens.contrastPairs.flatMap((p) => [p.fg, p.bg]));
    for (const theme of Object.values(tokens.color)) {
      for (const [name, value] of Object.entries(theme)) {
        if (["border"].includes(name)) continue; // decorative, not a text pair
        expect(
          paired,
          `token ${value} (${name}) missing a contrast pair`,
        ).toContain(value);
      }
    }
  });
});
