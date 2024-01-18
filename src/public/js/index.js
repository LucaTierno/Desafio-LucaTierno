const socket = io();

socket.on("productos", (data) => {
  renderProductos(data);
});

const renderProductos = (productos) => {
  const contenedorProductos = document.getElementById("contenedorProductos");
  contenedorProductos.innerHTML = "";

  productos.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
            <p class="card-title">${item.title} </p>
            <p class="card-id">Id del producto: ${item.id} </p>
            <p class="card-price">$${item.price} </p>
            <button class="card-btn-eliminar">Eliminar Producto</button>
        `;
    contenedorProductos.appendChild(card);

    card.querySelector("button").addEventListener("click", () => {
      eliminarProducto(item.id);
    });
  });
};

const eliminarProducto = (id) => {
  socket.emit("eliminarProducto", id);
};

document.getElementById("btnEnviar").addEventListener("click", () => {
  agregarProducto();
});

const agregarProducto = () => {
  const producto = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
    status: document.getElementById("status").value === "true",
  };

  socket.emit("agregarProducto", producto);
};
