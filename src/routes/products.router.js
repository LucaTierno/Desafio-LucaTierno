const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/product-manager.js");
const productManager = new ProductManager("./src/models/products.json");

//Routes:

router.get("/", async (req, res) => {
  try {
    const arrayProductos = await productManager.leerArchivo();
    let limit = parseInt(req.query.limit);
    if (limit) {
      const arrayConLimite = arrayProductos.slice(0, limit);
      return res.send(arrayConLimite);
    } else {
      return res.send(arrayProductos);
    }
  } catch (error) {
    console.log(error);
    return res.send("Error al procesar la solicitud");
  }
});

router.get("/:pid", async (req, res) => {
  try {
    let pid = parseInt(req.params.pid);
    const buscado = await productManager.getProductsById(pid);
    if (buscado) {
      return res.send(buscado);
    } else {
      return res.send("ID de producto incorrecto.");
    }
  } catch (error) {
    console.log(error);
    res.send("Error");
  }
});

router.post("/", async (req, res) => {
  try {
    const nuevoProducto = req.body;
    await productManager.addProduct(nuevoProducto);
  } catch (error) {
    console.log(error);
    res.send("Error");
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    const actualizarProducto = req.body;

    if (!actualizarProducto.hasOwnProperty("id")) {
      actualizarProducto.id = pid;
    }

    await productManager.updateProduct(pid, actualizarProducto);
    res.send("Producto actualizado con éxito");
  } catch (error) {
    res.send("Error al actualizar el producto");
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    const eliminarProducto = pid;
    await productManager.deleteProduct(eliminarProducto);
    res.send("Producto eliminado con éxito");
  } catch (error) {
    console.log("No se pudo eliminar el producto seleccionado")
  }
});

module.exports = router;
