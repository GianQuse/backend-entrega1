import express from "express";
import http from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";

import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
import ProductManager from "./managers/ProductManager.js";
const productManager = new ProductManager("./products.json");

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.use(express.static("./src/public"));

//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

io.on("connection", socket => {
  console.log("Cliente conectado");

  socket.on("addProduct", async product => {
    await productManager.addProduct(product);
    const products = await productManager.getProducts();
    io.emit("productsUpdated", products);
  });

  socket.on("deleteProduct", async id => {
    await productManager.deleteProduct(id);
    const products = await productManager.getProducts();
    io.emit("productsUpdated", products);
  });
});


//Servidor
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
