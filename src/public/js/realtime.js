const socket = io();

const form = document.getElementById("productForm");
const list = document.getElementById("productsList");

form.addEventListener("submit", e => {
  e.preventDefault();

  const data = new FormData(form);
  const product = {
    title: data.get("title"),
    price: Number(data.get("price"))
  };

  socket.emit("addProduct", product);
  form.reset();
});

function deleteProduct(id) {
  socket.emit("deleteProduct", id);
}

socket.on("productsUpdated", products => {
  list.innerHTML = "";

  products.forEach(p => {
    list.innerHTML += `
      <li>
        ${p.title} - $${p.price}
        <button onclick="deleteProduct('${p.id}')">Eliminar</button>
      </li>
    `;
  });
});
