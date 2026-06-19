import { test, expect } from "@playwright/test";
import data from "../../src/fixtures/data.json";

test.describe("ShopCheck API", () => {
  test("GET /api/health returns ok", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBeTruthy();
    await expect(response.json()).resolves.toEqual({
      status: "ok",
      service: "shopcheck",
    });
  });

  test("GET /api/products returns catalog", async ({ request }) => {
    const response = await request.get("/api/products");
    expect(response.ok()).toBeTruthy();
    const products = await response.json();
    expect(products.length).toBeGreaterThanOrEqual(4);
    expect(products[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      price: expect.any(Number),
      stock: expect.any(Number),
    });
  });

  test("GET /api/products/:id returns 404 for unknown product", async ({ request }) => {
    const response = await request.get("/api/products/unknown-id");
    expect(response.status()).toBe(404);
  });

  test("POST /api/coupons/validate accepts valid percent coupon", async ({ request }) => {
    const response = await request.post("/api/coupons/validate", {
      data: { code: data.coupons.validPercent, subtotal: 100 },
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toMatchObject({ valid: true, type: "percent", value: 10 });
  });

  test("POST /api/coupons/validate rejects expired coupon", async ({ request }) => {
    const response = await request.post("/api/coupons/validate", {
      data: { code: data.coupons.expired, subtotal: 100 },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.valid).toBe(false);
  });

  test("POST /api/coupons/validate enforces minimum subtotal", async ({ request }) => {
    const response = await request.post("/api/coupons/validate", {
      data: { code: data.coupons.validPercent, subtotal: 10 },
    });
    expect(response.status()).toBe(400);
  });

  test("POST /api/orders creates order with valid payload", async ({ request }) => {
    const response = await request.post("/api/orders", {
      data: {
        customer: data.customer,
        items: [{ productId: data.products.postits, quantity: 2 }],
      },
    });
    expect(response.status()).toBe(201);
    const order = await response.json();
    expect(order).toMatchObject({
      id: expect.stringMatching(/^ord-/),
      status: "confirmed",
      total: expect.any(Number),
      items: expect.any(Array),
    });
  });

  test("POST /api/orders rejects empty cart", async ({ request }) => {
    const response = await request.post("/api/orders", {
      data: { customer: data.customer, items: [] },
    });
    expect(response.status()).toBe(400);
  });

  test("POST /api/orders rejects missing customer fields", async ({ request }) => {
    const response = await request.post("/api/orders", {
      data: {
        customer: { name: "Iron" },
        items: [{ productId: data.products.postits, quantity: 1 }],
      },
    });
    expect(response.status()).toBe(400);
  });
});
