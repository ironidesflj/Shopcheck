const express = require("express");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, "db.json");
const SHIPPING_FEE = 15.9;

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "shopcheck" });
});

app.get("/api/products", (_req, res) => {
  const { products } = readDb();
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = readDb().products.find((item) => item.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

app.post("/api/coupons/validate", (req, res) => {
  const code = String(req.body?.code || "").trim().toUpperCase();
  const subtotal = Number(req.body?.subtotal || 0);

  if (!code) {
    return res.status(400).json({ valid: false, error: "Informe um cupom." });
  }

  const coupon = readDb().coupons.find((item) => item.code === code);
  if (!coupon) {
    return res.status(404).json({ valid: false, error: "Cupom não encontrado" });
  }

  if (!coupon.active) {
    return res.status(400).json({ valid: false, error: "Cupom expirado ou inativo" });
  }

  if (subtotal < coupon.minSubtotal) {
    return res.status(400).json({
      valid: false,
      error: `Subtotal mínimo de R$ ${coupon.minSubtotal.toFixed(2)} necessário`,
    });
  }

  res.json({
    valid: true,
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    message:
      coupon.type === "shipping"
        ? "Frete grátis aplicado"
        : `Desconto de ${coupon.value}% aplicado`,
  });
});

app.post("/api/orders", (req, res) => {
  const { customer, items, couponCode } = req.body || {};

  if (!customer?.email || !customer?.name || !customer?.address) {
    return res.status(400).json({ error: "Customer name, email and address are required" });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Order must contain at least one item" });
  }

  const db = readDb();
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = db.products.find((p) => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ error: `Product ${item.productId} not found` });
    }
    if (product.stock < item.quantity) {
      return res.status(409).json({
        error: `Insufficient stock for ${product.name}`,
        available: product.stock,
      });
    }

    const lineTotal = roundMoney(product.price * item.quantity);
    subtotal = roundMoney(subtotal + lineTotal);
    orderItems.push({
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity: item.quantity,
      lineTotal,
    });
  }

  let discount = 0;
  let shipping = SHIPPING_FEE;
  let appliedCoupon = null;

  if (couponCode) {
    const coupon = db.coupons.find(
      (c) => c.code === String(couponCode).trim().toUpperCase() && c.active
    );
    if (!coupon) {
      return res.status(400).json({ error: "Invalid or inactive coupon" });
    }
    if (subtotal < coupon.minSubtotal) {
      return res.status(400).json({ error: "Subtotal does not meet coupon minimum" });
    }
    appliedCoupon = coupon.code;
    if (coupon.type === "percent") {
      discount = roundMoney(subtotal * (coupon.value / 100));
    } else if (coupon.type === "shipping") {
      shipping = 0;
    }
  }

  const total = roundMoney(subtotal - discount + shipping);
  const order = {
    id: `ord-${Date.now()}`,
    customer,
    items: orderItems,
    subtotal,
    discount,
    shipping,
    total,
    coupon: appliedCoupon,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  for (const item of items) {
    const product = db.products.find((p) => p.id === item.productId);
    product.stock -= item.quantity;
  }

  db.orders.push(order);
  writeDb(db);

  res.status(201).json(order);
});

app.get("/api/orders/:id", (req, res) => {
  const order = readDb().orders.find((item) => item.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json(order);
});

app.listen(PORT, () => {
  console.log(`ShopCheck running at http://localhost:${PORT}`);
});
