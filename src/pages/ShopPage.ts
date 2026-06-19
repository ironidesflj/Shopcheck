import { Page, expect } from "@playwright/test";

export class ShopPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/");
  }

  productCard(name: string) {
    return this.page.getByRole("article").filter({ hasText: name });
  }

  async addProductToCart(name: string) {
    const card = this.productCard(name);
    await card.getByRole("button", { name: /adicionar/i }).click();
  }

  async openCart() {
    await this.page.getByRole("link", { name: /carrinho/i }).click();
  }
}
