const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const PUERTO = 8080;

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Routing:
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

//Escuchamos en el PUERTO 8080:
const server = app.listen(PUERTO, () => {
  console.log(
    `Escuchando en el puerto: ${PUERTO}, link: http://localhost:${PUERTO}/`
  );
});

//Socket.io:
const ProductManager = require("./controllers/product-manager.js");
const productManager = new ProductManager("./src/models/products.json");

const io = socket(server);

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");

  socket.emit("productos", await productManager.getProducts());

  socket.on("eliminarProducto", async (id) => {
    await productManager.deleteProduct(id);
    io.socket.emit("productos", await productManager.getProducts());
  });

  socket.on("agregarProducto", async (producto) => {
    await productManager.addProduct(producto);
    io.socket.emit("productos", await productManager.getProducts());
  })
});
