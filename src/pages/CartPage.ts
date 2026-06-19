import { Page, expect } from "@playwright/test";

export class CartPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/cart.html");
  }

  async expectItem(name: string) {
    await expect(this.page.getByRole("cell", { name })).toBeVisible();
  }

  async goToCheckout() {
    await this.page.getByRole("link", { name: /checkout/i }).click();
  }
}
