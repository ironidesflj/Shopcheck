import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export const options = {
  stages: [
    { duration: "15s", target: 10 },
    { duration: "30s", target: 25 },
    { duration: "15s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
};

const customer = {
  name: "Load Test User",
  email: "load@teste.com",
  address: "Rua Performance, 100",
};

export default function () {
  const health = http.get(`${BASE_URL}/api/health`);
  check(health, { "health is 200": (r) => r.status === 200 });

  const products = http.get(`${BASE_URL}/api/products`);
  check(products, {
    "products is 200": (r) => r.status === 200,
    "products payload not empty": (r) => JSON.parse(r.body).length > 0,
  });

  const productId = JSON.parse(products.body)[0].id;
  const orderPayload = JSON.stringify({
    customer,
    items: [{ productId, quantity: 1 }],
  });

  const order = http.post(`${BASE_URL}/api/orders`, orderPayload, {
    headers: { "Content-Type": "application/json" },
  });

  check(order, {
    "order created or stock conflict handled": (r) =>
      r.status === 201 || r.status === 409,
  });

  sleep(1);
}
