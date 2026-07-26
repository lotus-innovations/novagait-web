import { expect, test } from "@playwright/test";

test.describe("after-site navigation", () => {
  const pages = [
    { path: "/", h1: "A stronger stride starts here." },
    { path: "/services", h1: "What we treat, and how" },
    { path: "/providers", h1: "The people behind the plans" },
    { path: "/locations", h1: "Three clinics, all step-free" },
    { path: "/contact", h1: "Request an appointment" },
    { path: "/accessibility-demo", h1: "The same site, twice" },
    { path: "/accessibility-demo/audit", h1: "Before, after, and the diff" },
    { path: "/accessibility-demo/vpat", h1: "Draft ACR: WCAG 2.2 A and AA" },
  ];
  for (const p of pages) {
    test(`renders ${p.path} with its h1 and disclaimer`, async ({ page }) => {
      await page.goto(p.path);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(p.h1);
      await expect(
        page.getByText("is a fictional brand", { exact: false }).first(),
      ).toBeVisible();
    });
  }

  test("header navigation reaches every section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Services" }).first().click();
    await expect(page).toHaveURL(/\/services$/);
    await page.getByRole("link", { name: "Providers" }).first().click();
    await expect(page).toHaveURL(/\/providers$/);
  });
});

test.describe("appointment form", () => {
  test("error path: summary alert receives focus and links to fields", async ({
    page,
  }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send request" }).click();
    // Next.js injects a route-announcer with role=alert; scope to ours.
    const alert = page
      .getByRole("alert")
      .filter({ hasText: "problems with your request" });
    await expect(alert).toContainText("problems with your request");
    await expect(alert).toBeFocused();
    // Follow the first error link to its field.
    await alert.getByRole("link").first().click();
    await expect(page.locator("#field-name")).toBeFocused();
    // Field-level error is associated programmatically.
    await expect(page.locator("#field-name")).toHaveAttribute(
      "aria-describedby",
      "error-name",
    );
  });

  test("happy path: success confirmation receives focus with a reference", async ({
    page,
  }) => {
    await page.goto("/contact");
    await page.locator("#field-name").fill("Playwright Test");
    await page.locator("#field-phone").fill("(555) 010-7777");
    await page.locator("#field-service").selectOption("gait-running");
    await page.locator("#field-location").selectOption("eastbrook");
    await page.getByRole("radio", { name: /Mornings/ }).check();
    await page.getByRole("button", { name: "Send request" }).click();
    const confirmation = page.getByRole("heading", {
      name: /Request received: reference NG-/,
    });
    await expect(confirmation).toBeVisible();
    await expect(confirmation).toBeFocused();
  });
});

test.describe("exhibit", () => {
  test("view toggle switches between frames", async ({ page }) => {
    await page.goto("/accessibility-demo");
    await expect(
      page.frameLocator('iframe[title^="Before version"]').locator("body"),
    ).toBeTruthy();
    await page.getByRole("radio", { name: "After only" }).check();
    await expect(page.locator('iframe[title^="Before version"]')).toHaveCount(
      0,
    );
    await page.getByRole("radio", { name: "Before only" }).check();
    await expect(
      page.locator('iframe[title^="Accessible after version"]'),
    ).toHaveCount(0);
  });

  test("all 12 barrier annotations render with chips", async ({ page }) => {
    await page.goto("/accessibility-demo");
    for (let i = 1; i <= 12; i++) {
      await expect(page.locator(`#v${i}`)).toBeVisible();
    }
    await expect(page.getByText("Caught by axe:")).toHaveCount(8);
    await expect(page.getByText("Human judgment required")).toHaveCount(4);
  });
});

test.describe("keyboard access", () => {
  test("tab-walk: skip link first, focus visible, main reachable", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to main content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
    // Walk the first dozen stops; every one must show a focus indicator.
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      const visible = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        const cs = getComputedStyle(el);
        return (
          el.matches(":focus-visible") &&
          cs.outlineStyle !== "none" &&
          parseFloat(cs.outlineWidth) > 0
        );
      });
      expect(visible, `tab stop ${i + 1} shows a focus indicator`).toBe(true);
    }
  });

  test("before-variant service cards are NOT keyboard reachable (seeded V2)", async ({
    page,
  }) => {
    await page.goto("/before/services");
    const reachable = await page.evaluate(() => {
      const cards = document.querySelectorAll("div.cursor-pointer");
      return [...cards].some((c) => (c as HTMLElement).tabIndex >= 0);
    });
    expect(reachable).toBe(false);
  });
});
