import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  { name: "home", path: "/" },
  { name: "cart", path: "/cart.html" },
  { name: "checkout", path: "/checkout.html" },
];

for (const target of pages) {
  test(`a11y scan — ${target.name} has no critical violations`, async ({ page }) => {
    await page.goto(target.path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const serious = results.violations.filter(
      (violation) => violation.impact === "critical" || violation.impact === "serious"
    );

    expect(serious, formatViolations(serious)).toEqual([]);
  });
}

test("checkout form fields are properly labeled", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem(
      "shopcheck_cart",
      JSON.stringify([
        {
          productId: "prod-002",
          name: "Caneca Regression Coffee",
          price: 49.9,
          quantity: 1,
        },
      ])
    );
  });

  await page.goto("/checkout.html");

  await expect(page.getByLabel(/nome completo/i)).toBeVisible();
  await expect(page.getByLabel(/e-mail/i)).toBeVisible();
  await expect(page.getByLabel(/endereço/i)).toBeVisible();
  await expect(page.getByLabel(/cupom/i)).toBeVisible();
});

test("skip link moves focus to main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: /pular para o conteúdo/i })).toBeFocused();
});

function formatViolations(
  violations: { id: string; impact?: string | null; nodes: unknown[] }[]
) {
  return violations
    .map((v) => `${v.id} (${v.impact}) — ${v.nodes.length} node(s)`)
    .join("\n");
}
