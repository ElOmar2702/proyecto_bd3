const API_URL = "http://localhost:3000";

const listaProductos = document.getElementById("listaProductos");
const formulario = document.getElementById("formularioProducto");
const productoId = document.getElementById("productoId");
const nombreInput = document.getElementById("nombre");
const precioInput = document.getElementById("precio");
const stockInput = document.getElementById("stock");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const tituloFormulario = document.getElementById("tituloFormulario");
const formContacto = document.getElementById("formularioContacto");
const listaContactos = document.getElementById("listaContactos");

async function cargarProductos() {
  if (!listaProductos) return;

  try {
    const respuesta = await fetch(`${API_URL}/Producto`);
    const productos = await respuesta.json();

    listaProductos.innerHTML = "";

    if (productos.length === 0) {
      listaProductos.innerHTML = "<p style='color: #64748b;'>No hay productos registrados.</p>";
      return;
    }

    productos.forEach((producto) => {
      const elemento = document.createElement("div");
      elemento.classList.add("producto");

      elemento.innerHTML = `
        <div>
          <h3>${producto.nombre}</h3>
          <p class="producto-precio">Precio: $${producto.precio}</p>
          <p>Stock: ${producto.stock} unidades</p>
        </div>
        <div class="acciones">
          <button class="btn-editar" onclick="cargarEnFormulario(${producto.id}, '${producto.nombre}', ${producto.precio}, ${producto.stock})">Editar</button>
          <button class="btn-eliminar" onclick="eliminarProducto(${producto.id})">Eliminar</button>
        </div>
      `;

      listaProductos.appendChild(elemento);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

function cargarEnFormulario(id, nombre, precio, stock) {
  productoId.value = id;
  nombreInput.value = nombre;
  precioInput.value = precio;
  stockInput.value = stock;

  tituloFormulario.textContent = "Editar Producto";
  btnGuardar.textContent = "Actualizar Producto";
  btnCancelar.style.display = "block";
  nombreInput.focus();
}

function cancelarEdicion() {
  formulario.reset();
  productoId.value = "";
  tituloFormulario.textContent = "Registrar Producto";
  btnGuardar.textContent = "Guardar Producto";
  btnCancelar.style.display = "none";
}

if (btnCancelar) {
  btnCancelar.addEventListener("click", cancelarEdicion);
}

if (formulario) {
  formulario.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = productoId.value;
    const nombre = nombreInput.value;
    const precio = precioInput.value;
    const stock = stockInput.value;

    try {
      if (id) {
        await fetch(`${API_URL}/Producto/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio, stock }),
        });
      } else {
        await fetch(`${API_URL}/Producto`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio, stock }),
        });
      }

      cancelarEdicion();
      cargarProductos();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  });
}

async function eliminarProducto(id) {
  const confirmar = confirm("¿Deseas eliminar este producto de la base de datos?");
  if (!confirmar) return;

  try {
    await fetch(`${API_URL}/Producto/${id}`, {
      method: "DELETE",
    });

    if (productoId.value == id) {
      cancelarEdicion();
    }

    cargarProductos();
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  }
}

async function cargarContactos() {
  if (!listaContactos) return;

  try {
    const respuesta = await fetch(`${API_URL}/Contactos`);
    const contactos = await respuesta.json();

    listaContactos.innerHTML = "";

    if (contactos.length === 0) {
      listaContactos.innerHTML = "<p style='color: #64748b;'>No hay mensajes de contacto registrados.</p>";
      return;
    }

    contactos.forEach((c) => {
      const elemento = document.createElement("div");
      elemento.classList.add("producto");

      const fechaFormateada = c.fecha_creacion ? new Date(c.fecha_creacion).toLocaleString() : '';

      elemento.innerHTML = `
        <div>
          <h3>Asunto: ${c.asunto}</h3>
          <p><strong>De:</strong> ${c.nombre} (${c.correo})</p>
          <p><strong>Mensaje:</strong> ${c.mensaje}</p>
          <p style="font-size: 0.85rem; color: #64748b; margin-top: 5px;"><strong>Fecha:</strong> ${fechaFormateada}</p>
        </div>
        <div class="acciones">
          <button class="btn-eliminar" onclick="eliminarContacto(${c.id})">Eliminar</button>
        </div>
      `;

      listaContactos.appendChild(elemento);
    });
  } catch (error) {
    console.error("Error al cargar los contactos:", error);
  }
}

if (formContacto) {
  formContacto.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nombre = document.getElementById("nombreContacto").value;
    const correo = document.getElementById("correoContacto").value;
    const asunto = document.getElementById("asuntoContacto").value;
    const mensaje = document.getElementById("mensajeContacto").value;

    try {
      const respuesta = await fetch(`${API_URL}/Contactos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, asunto, mensaje }),
      });

      if (respuesta.ok) {
        alert("¡Mensaje enviado y guardado en la base de datos con éxito!");
        formContacto.reset();
        cargarContactos();
      } else {
        alert("Hubo un error al guardar el contacto.");
      }
    } catch (error) {
      console.error("Error al enviar el formulario de contacto:", error);
    }
  });
}

async function eliminarContacto(id) {
  const confirmar = confirm("¿Deseas eliminar este mensaje de contacto?");
  if (!confirmar) return;

  try {
    const respuesta = await fetch(`${API_URL}/Contactos/${id}`, {
      method: "DELETE",
    });

    if (respuesta.ok) {
      cargarContactos();
    } else {
      alert("No se pudo eliminar el contacto.");
    }
  } catch (error) {
    console.error("Error al eliminar contacto:", error);
  }
}

cargarProductos();
cargarContactos();