import { test, expect } from "@playwright/test";
import data from "../../src/fixtures/data.json";
import { ShopPage } from "../../src/pages/ShopPage";
import { CartPage } from "../../src/pages/CartPage";
import { CheckoutPage } from "../../src/pages/CheckoutPage";

test.describe("ShopCheck E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("user can complete purchase happy path", async ({ page }) => {
    const shop = new ShopPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await shop.addProductToCart("Camiseta QA Explorer");
    await shop.addProductToCart("Kit Post-it Edge Cases");
    await shop.openCart();

    await cart.expectItem("Camiseta QA Explorer");
    await cart.expectItem("Kit Post-it Edge Cases");
    await cart.goToCheckout();

    await checkout.fillCustomer(data.customer);
    await checkout.applyCoupon(data.coupons.validPercent);
    await checkout.expectCouponMessage(/10%/i);
    await checkout.placeOrder();

    await expect(page).toHaveURL(/confirmation\.html/);
    await expect(page.getByRole("heading", { name: /pedido confirmado/i })).toBeVisible();
    await expect(page.locator("#order-id")).toContainText(/ord-/);
  });

  test("out of stock product cannot be added", async ({ page }) => {
    const shop = new ShopPage(page);
    const button = shop
      .productCard("Mousepad Smoke Test")
      .getByRole("button", { name: /adicionar/i });

    await expect(button).toBeDisabled();
  });

  test("empty cart shows empty state", async ({ page }) => {
    const cart = new CartPage(page);
    await cart.goto();
    await expect(page.getByText(/carrinho está vazio/i)).toBeVisible();
  });

  test("invalid coupon shows feedback on checkout", async ({ page }) => {
    const shop = new ShopPage(page);
    const checkout = new CheckoutPage(page);

    await shop.addProductToCart("Caneca Regression Coffee");
    await shop.openCart();
    await page.getByRole("link", { name: /checkout/i }).click();

    await checkout.applyCoupon(data.coupons.invalid);
    await checkout.expectCouponMessage(/não encontrado/i);
  });
});
