import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager("./products.json");

router.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

router.get("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const product = await productManager.getProductById(id);
    if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(product);
});

router.post("/", async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const updated = await productManager.updateProduct(id, req.body);
    if (!updated) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(updated);
});

router.delete("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const deleted = await productManager.deleteProduct(id);
    if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
})

export default router;