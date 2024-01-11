const fs = require("fs").promises;

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
    this.ultId = 0;
  }

  //METODOS:

  async addProduct(nuevoObjeto) {
    let { title, description, code, price, status, stock, category } =
      nuevoObjeto;

    if (
      !title ||
      !description ||
      !code ||
      !price ||
      !status ||
      !stock ||
      !category
    ) {
      console.log(
        "Todos los campos son obligatorios. Por favor ingresar todos."
      );
      return;
    }

    if (this.products.length > 0) {
      this.ultId = Math.max(...this.products.map((product) => product.id));
    }

    const newProduct = {
      id: ++this.ultId,
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
    };

    if (this.products.some((item) => item.code === code)) {
      console.log("Código en uso");
      return;
    }

    this.products.push(newProduct);

    const existingProducts = await this.leerArchivo();

    if (existingProducts.some((item) => item.code === code)) {
      console.log("Código en uso");
      return;
    }

    existingProducts.push(newProduct);

    await this.guardarArchivo(existingProducts);

    console.log("Producto agregado con éxito");
  }

  //Tomar los productos:

  async getProducts() {
    try {
      const arrayProductos = this.leerArchivo();
      return arrayProductos;
    } catch (error) {
      console.log("Error al leer el archivo", error);
    }
  }

  //Encontrar un producto por ID:

  async getProductsById(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const buscado = arrayProductos.find((item) => item.id === id);

      if (!buscado) {
        console.log("Producto no encontrado");
      } else {
        console.log("Producto encontrado! ");
        return buscado;
      }
    } catch (error) {
      console.log("Error al leer ese archivo", error);
    }
  }

  //Leer los productos

  async leerArchivo() {
    try {
      const respuesta = await fs.readFile(this.path, "utf-8");
      const arrayProductos = JSON.parse(respuesta);
      return arrayProductos;
    } catch (error) {
      console.log("Error al leer un archivo", error);
      throw error;
    }
  }

  //Guardar archivo:

  async guardarArchivo(arrayProductos) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.log("Error al guardar el archivo", error);
    }
  }

  //Actualizar producto:

  async updateProduct(id, productoActualizado) {
    try {
      const arrayProductos = await this.leerArchivo();
      const index = arrayProductos.findIndex((item) => item.id === id);
      if (index !== -1) {
        arrayProductos.splice(index, 1, productoActualizado);
        await this.guardarArchivo(arrayProductos);
      } else {
        console.log("No se encontro el producto");
      }
    } catch (error) {
      console.log("Error al actualizar el producto ", error);
    }
  }

  //Eliminar producto por ID:

  async deleteProduct(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const index = arrayProductos.findIndex((item) => item.id === id);
      if (index !== -1) {
        arrayProductos.splice(index, 1);
        await this.guardarArchivo(arrayProductos);
      } else {
        console.log("No se encontro el producto");
      }
    } catch (error) {
      console.log("Error al eliminar el producto ", error);
    }
  }

}

module.exports = ProductManager;
