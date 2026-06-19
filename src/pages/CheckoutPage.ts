import { Page, expect } from "@playwright/test";

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/checkout.html");
  }

  async fillCustomer(data: { name: string; email: string; address: string }) {
    await this.page.getByLabel(/nome completo/i).fill(data.name);
    await this.page.getByLabel(/e-mail/i).fill(data.email);
    await this.page.getByLabel(/endereço/i).fill(data.address);
  }

  async applyCoupon(code: string) {
    await this.page.getByLabel(/cupom/i).fill(code);
    await this.page.getByRole("button", { name: /aplicar cupom/i }).click();
  }

  async placeOrder() {
    await this.page.getByRole("button", { name: /confirmar pedido/i }).click();
  }

  async expectCouponMessage(text: string | RegExp) {
    await expect(this.page.locator("#coupon-feedback")).toContainText(text);
  }
}
