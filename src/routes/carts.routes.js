import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager("./carts.json");

router.post("/", async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

router.get("/:cid", async (req, res) => {
  const id = parseInt(req.params.cid);
  const cart = await cartManager.getCartById(id);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart.products);
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);

  const updatedCart = await cartManager.addProductToCart(cartId, productId);
  if (!updatedCart) return res.status(404).json({ error: "Carrito o producto no encontrado" });

  res.json(updatedCart);
});

export default router;