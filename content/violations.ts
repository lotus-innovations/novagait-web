/**
 * Exhibit annotations for the 12 seeded violations. Single source of truth
 * for the /accessibility-demo walkthrough; keep in sync with
 * docs/seeded-violations.md (the reconciliation contract).
 */

export type SeededViolation = {
  id: string;
  title: string;
  sc: string;
  scName: string;
  detection: "axe" | "manual";
  axeRule?: string;
  beforePage: string;
  afterPage: string;
  affected: string;
  barrier: string;
  fix: string;
  beforeCode: string;
  afterCode: string;
};

export const seededViolations: SeededViolation[] = [
  {
    id: "V1",
    title: "Form inputs without labels",
    sc: "3.3.2",
    scName: "Labels or Instructions (also 1.3.1, 4.1.2)",
    detection: "axe",
    axeRule:
      "select-name (the placeholder-only text inputs PASS automated checks; catching them takes a human)",
    beforePage: "/before/contact",
    afterPage: "/contact",
    affected:
      "Screen reader users hear “edit text” with no clue what to type; voice-control users cannot name the field; everyone loses the hint once the placeholder disappears.",
    barrier:
      "Every input on the contact form is labeled only by placeholder text, which vanishes on entry and is not a programmatic label.",
    fix: "Every field gets a visible <label> tied to the input with htmlFor/id; hints use aria-describedby.",
    beforeCode: '<input name="phone" placeholder="Phone" />',
    afterCode:
      '<label htmlFor="field-phone">Phone number</label>\n<input id="field-phone" name="phone" type="tel" autoComplete="tel" aria-describedby="hint-phone" />',
  },
  {
    id: "V2",
    title: "Clickable divs posing as buttons",
    sc: "2.1.1",
    scName: "Keyboard (also 4.1.2 Name, Role, Value)",
    detection: "manual",
    beforePage: "/before/services",
    afterPage: "/services",
    affected:
      "Keyboard and switch users cannot reach the cards at all; screen readers announce them as plain text, not as something operable.",
    barrier:
      "Service cards navigate with a mouse onClick on a <div>: no role, no tabindex, no keyboard handler.",
    fix: "Cards are real links: the whole affordance is an <a> (Next <Link>), natively focusable and operable.",
    beforeCode:
      '<div onClick={() => router.push("/before/services#slug")} className="cursor-pointer">…</div>',
    afterCode: '<Link href="/services#slug">Orthopedic rehabilitation</Link>',
  },
  {
    id: "V3",
    title: "Text contrast below 4.5:1",
    sc: "1.4.3",
    scName: "Contrast (Minimum)",
    detection: "axe",
    axeRule: "color-contrast",
    beforePage: "/before",
    afterPage: "/",
    affected:
      "Low-vision users, older users, and anyone on a phone in sunlight simply cannot read the hero or the footer links.",
    barrier:
      "Hero headings render at roughly 2.2:1 and footer links at roughly 2.4:1 against their backgrounds.",
    fix: "Every text/background pair comes from design-tokens.json, where each pair is unit-tested to pass 4.5:1 (AA).",
    beforeCode: '<p className="text-[#b6bcc9]">Feel better, move better</p>',
    afterCode:
      '/* tokens: light text #0F172A on #FFFFFF = 17.85:1, tested in CI */\n<h1 className="text-fg">A stronger stride starts here.</h1>',
  },
  {
    id: "V4",
    title: "Focus indicator removed globally",
    sc: "2.4.7",
    scName: "Focus Visible",
    detection: "manual",
    beforePage: "/before",
    afterPage: "/",
    affected:
      "Sighted keyboard users lose their place instantly: there is no way to see which element will activate on Enter.",
    barrier:
      "One CSS rule, *:focus { outline: none }, applied to the whole before-variant with no replacement styling.",
    fix: "A global 3px high-contrast :focus-visible outline (token-colored, 7.9:1) with offset, never removed without a replacement.",
    beforeCode: ".before-scope *:focus { outline: none; }",
    afterCode:
      ":focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }",
  },
  {
    id: "V5",
    title: "Missing and junk alt text",
    sc: "1.1.1",
    scName: "Non-text Content",
    detection: "axe",
    axeRule: "image-alt",
    beforePage: "/before/providers",
    afterPage: "/providers",
    affected:
      "Screen reader users hear the raw filename or nothing at all where a staff photo should be described, or should be silent.",
    barrier:
      "Two provider images have no alt attribute; a third carries alt=“IMG_4821.JPG”.",
    fix: "Decorative imagery is marked decorative (empty alt or aria-hidden); meaning lives in adjacent text, monograms are hidden from the tree.",
    beforeCode:
      '<img src="/before/provider-1.svg" />\n<img src="/before/provider-3.svg" alt="IMG_4821.JPG" />',
    afterCode:
      '<div aria-hidden="true" class="…monogram…">MO</div>\n<h2>Maren Oduya, PT, DPT, OCS</h2>',
  },
  {
    id: "V6",
    title: "Broken heading hierarchy",
    sc: "1.3.1",
    scName: "Info and Relationships (heading structure)",
    detection: "axe",
    axeRule: "heading-order",
    beforePage: "/before",
    afterPage: "/",
    affected:
      "Screen reader users navigating by headings get a skeleton that jumps from h1 to h4: sections seem missing and the outline is meaningless.",
    barrier:
      "Every section heading on the before-variant is an <h4> directly under the page <h1>.",
    fix: "A strict h1 > h2 > h3 outline; sections are labeled by their headings via aria-labelledby.",
    beforeCode: '<h1>…</h1>\n<h4 className="text-2xl">Our services</h4>',
    afterCode:
      '<h1>A stronger stride starts here.</h1>\n<h2 id="services-heading">Care built around how you move</h2>\n<h3>Orthopedic rehabilitation</h3>',
  },
  {
    id: "V7",
    title: "Keyboard trap in a popup",
    sc: "2.1.2",
    scName: "No Keyboard Trap",
    detection: "axe",
    axeRule: "aria-dialog-name (the trap itself is a manual finding)",
    beforePage: "/before",
    afterPage: "/",
    affected:
      "Keyboard users are stuck: Tab is swallowed, Escape does nothing, and the only close control is mouse-only. The session ends with the browser tab.",
    barrier:
      "A newsletter popup opens on its own, swallows Tab and Shift+Tab, ignores Escape, has a mouse-only close, and no accessible name.",
    fix: "The after-site has no self-opening popup at all. Its one dialog-like moment (the form success panel) moves focus in, is named by its heading, and never traps.",
    beforeCode:
      'function trap(e) { if (e.key === "Tab") e.preventDefault(); }\n<div role="dialog">…<span onClick={close}>×</span></div>',
    afterCode:
      "/* No modal. Success panel: */\n<h2 ref={successRef} tabIndex={-1}>Request received…</h2>",
  },
  {
    id: "V8",
    title: "Auto-playing motion that ignores reduced-motion",
    sc: "2.2.2",
    scName: "Pause, Stop, Hide (also 2.3.3 Animation from Interactions)",
    detection: "axe",
    axeRule: "button-name (carousel controls; the motion itself is manual)",
    beforePage: "/before",
    afterPage: "/",
    affected:
      "Vestibular-disorder users get motion they asked the OS to suppress; screen reader users hear unnamed buttons; nobody can pause the carousel.",
    barrier:
      "The hero carousel auto-advances forever, overrides the reduced-motion kill switch with !important, has no pause control, and its arrows are unnamed icon buttons.",
    fix: "No carousel. The hero animates once (a line-draw), fully gated behind prefers-reduced-motion; under reduced motion nothing moves.",
    beforeCode:
      ".before-carousel-track { animation: … infinite !important; }\n<button><svg>…</svg></button>",
    afterCode:
      "@media (prefers-reduced-motion: no-preference) {\n  .stride-path .stride-line { animation: stride-draw 1.4s ease-out both; }\n}",
  },
  {
    id: "V9",
    title: "Touch targets under 24px",
    sc: "2.5.8",
    scName: "Target Size (Minimum)",
    detection: "axe",
    axeRule: "target-size + link-name",
    beforePage: "/before",
    afterPage: "/",
    affected:
      "Users with tremor or limited dexterity, and anyone on a bumpy commute, cannot reliably hit 16px icon links; screen readers announce them as nothing.",
    barrier:
      "Footer social links are 16x16px icon-only anchors with no accessible name.",
    fix: "All interactive targets are at least 44px (tokens.touchTarget); icon-only controls carry accessible names or are dropped.",
    beforeCode: '<a href="…" className="block h-4 w-4"><svg>…</svg></a>',
    afterCode:
      '/* 44px minimum enforced via min-h-11 utilities on every control */\n<Link className="inline-flex min-h-11 items-center …">Services</Link>',
  },
  {
    id: "V10",
    title: "Errors shown by color alone",
    sc: "3.3.1",
    scName: "Error Identification (also 1.4.1 Use of Color)",
    detection: "manual",
    beforePage: "/before/contact",
    afterPage: "/contact",
    affected:
      "Blind users hear nothing happen after submitting; colorblind users see nothing change; nobody is told what to fix.",
    barrier:
      "Invalid fields get a red border. No text, no aria-invalid, no focus move, no announcement.",
    fix: "An error summary (role=alert) receives focus and links each problem to its field; every field gets a text error via aria-describedby and aria-invalid.",
    beforeCode:
      'className={bad.has("phone") ? "border-[#dc2626] border-2" : "border"}',
    afterCode:
      '<div ref={summaryRef} tabIndex={-1} role="alert">…There are 2 problems…</div>\n<input aria-invalid aria-describedby="error-phone" />\n<p id="error-phone">Error: Enter a phone number…</p>',
  },
  {
    id: "V11",
    title: "Sticky header hides focused elements",
    sc: "2.4.11",
    scName: "Focus Not Obscured (Minimum)",
    detection: "manual",
    beforePage: "/before/locations",
    afterPage: "/locations",
    affected:
      "Keyboard users tabbing backward watch their focus disappear under the sticky header: the focused link is on screen but invisible.",
    barrier:
      "The before-header is position: sticky with no scroll-padding or scroll-margin anywhere, so focused elements scroll underneath it.",
    fix: "The after-header is not sticky; were it sticky, scroll-padding-top would reserve its height so focused elements stay visible.",
    beforeCode: '<header className="sticky top-0 z-40 …">',
    afterCode:
      "/* non-sticky header; sticky pattern requires: */\nhtml { scroll-padding-top: 5rem; }",
  },
  {
    id: "V12",
    title: "Redundant entry",
    sc: "3.3.7",
    scName: "Redundant Entry",
    detection: "axe",
    axeRule:
      "label (the confirm fields are pseudo-labeled: visible text, no association)",
    beforePage: "/before/contact",
    afterPage: "/contact",
    affected:
      "Users with cognitive or motor disabilities pay double for every field; on mobile everyone does.",
    barrier:
      "The form re-asks for the name and phone number the user just typed, behind visible pseudo-labels that are not programmatically associated.",
    fix: "Ask once. The after-form collects each fact exactly one time and says so.",
    beforeCode:
      '<p>Confirm your name</p>\n<input name="nameConfirm" type="text" />',
    afterCode:
      "/* one name field, one phone field; copy: */\n<p>Tell us once. We will not ask you to repeat any of this when we call back.</p>",
  },
];
