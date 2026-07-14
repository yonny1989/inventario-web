async function guardar() {

    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;
    const cantidad = document.getElementById("cantidad").value;
    const categoria = document.getElementById("categoria").value;

    await fetch("/productos", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            nombre,
            precio,
            cantidad,
            categoria
        })

    });

    cargarProductos();

}

async function cargarProductos() {

    const respuesta = await fetch("/productos");

    const productos = await respuesta.json();

    const tabla = document.getElementById("tablaProductos");

    tabla.innerHTML = "";

    let total = productos.length;

    let agotados = productos.filter(p => p.cantidad == 0).length;

    let valor = 0;

    productos.forEach(producto => {

        valor += producto.precio * producto.cantidad;

        tabla.innerHTML += `

            <tr>

                <td>${producto.id}</td>

                <td>${producto.nombre}</td>

                <td>${producto.precio}</td>

                <td>${producto.cantidad}</td>

                <td>${producto.categoria}</td>

                <td>

                    <button onclick="editarProducto(
                        ${producto.id},
                        '${producto.nombre}',
                        ${producto.precio},
                        ${producto.cantidad},
                        '${producto.categoria}'
                    )">
                        Editar
                    </button>

                    <button onclick="eliminarProducto(${producto.id})">
                        Eliminar
                    </button>

                </td>

            </tr>

        `;

    });

    document.getElementById("totalProductos").innerText = total;

    document.getElementById("agotados").innerText = agotados;

    document.getElementById("valorTotal").innerText = "$" + valor;

}

async function eliminarProducto(id) {

    await fetch(`/productos/${id}`, {
        method: "DELETE"
    });

    cargarProductos();

}

async function editarProducto(id, nombre, precio, cantidad, categoria) {

    const nuevoNombre = prompt("Editar nombre:", nombre);

    const nuevoPrecio = prompt("Editar precio:", precio);

    const nuevaCantidad = prompt("Editar cantidad:", cantidad);

    const nuevaCategoria = prompt("Editar categoría:", categoria);

    await fetch(`/productos/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            nombre: nuevoNombre,
            precio: nuevoPrecio,
            cantidad: nuevaCantidad,
            categoria: nuevaCategoria

        })

    });

    cargarProductos();

}

function buscarProducto() {

    let input = document.getElementById("buscar").value.toLowerCase();

    let filas = document.querySelectorAll("#tablaProductos tr");

    filas.forEach(fila => {

        let texto = fila.innerText.toLowerCase();

        fila.style.display = texto.includes(input)
            ? ""
            : "none";

    });

}

function modoOscuro(){

    document.body.classList.toggle("dark-mode");

}

cargarProductos();