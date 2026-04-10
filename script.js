let carrito = [];
let productoActual = {};

// CONFIGURACIÓN DE GALERÍA DE FOTOS
const fotosProductos = {
    'fenix': ['fenix1.jpg', 'fenix2.jpg', 'fenix3.jpg', 'fenix4.jpg', 'fenix5.jpg', 'fenix6.jpg', 'fenix7.jpg', 'fenix8.jpg'], 
    'estandar': ['estandar1.jpg', 'estandar2.jpg', 'estandar3.jpg', 'estandar4.jpg', 'estandar5.jpg', 'estandar6.jpg'],
    'capuchon': ['cap-mixto.jpg', 'cap-drill.jpg', 'cap-dacron.jpg']
};

window.onload = function() {
    const carritoGuardado = localStorage.getItem('carritoReyand');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        document.getElementById('cart-count').innerText = carrito.length;
    }
};

function guardarEnMemoria() {
    localStorage.setItem('carritoReyand', JSON.stringify(carrito));
}

// NAVEGACIÓN
function abrirAyuda() {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById('seccion-ayuda').classList.remove('hidden');
}

function cerrarAyuda() {
    mostrarCatalogo();
}

function mostrarCatalogo() {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById('catalogo').classList.remove('hidden');
}

function volverAlCatalogo() {
    mostrarCatalogo();
}

// DETALLES Y GALERÍA
function verDetalle(tipo) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById('detalle-tecnico').classList.remove('hidden');
    
    const select = document.getElementById('opcion-producto');
    const miniaturasContenedor = document.getElementById('miniaturas-contenedor');
    
    select.innerHTML = "";
    miniaturasContenedor.innerHTML = ""; 
    document.getElementById('personalizacion-texto').value = ""; 

    const listaFotos = fotosProductos[tipo] || [];
    if (listaFotos.length > 0) {
        document.getElementById('imagen-principal').src = listaFotos[0];
        listaFotos.forEach((foto, index) => {
            const imgMin = document.createElement('img');
            imgMin.src = foto;
            imgMin.classList.add('miniatura');
            if (index === 0) imgMin.classList.add('active');
            imgMin.onclick = () => {
                document.getElementById('imagen-principal').src = foto;
                document.querySelectorAll('.miniatura').forEach(m => m.classList.remove('active'));
                imgMin.classList.add('active');
            };
            miniaturasContenedor.appendChild(imgMin);
        });
    }

    if (tipo === 'fenix') {
        productoActual = { nombre: "Línea Fénix Premium", precio: 95000 };
        ['S', 'M', 'L', 'XL'].forEach(t => select.innerHTML += `<option value="${t}">${t}</option>`);
    } else if (tipo === 'estandar') {
        productoActual = { nombre: "Línea Estándar", precio: 85000 };
        ['S', 'M', 'L', 'XL'].forEach(t => select.innerHTML += `<option value="${t}">${t}</option>`);
    } else if (tipo === 'capuchon') {
        productoActual = { nombre: "Capuchón Industrial", precio: 12000 };
        select.innerHTML = `
            <option value="Dacron" data-p="12000">Dacrón ($12.000)</option>
            <option value="Mixto" data-p="14000">Mixto ($14.000)</option>
            <option value="Drill" data-p="16000">Drill ($16.000)</option>
        `;
    }
    document.getElementById('detalle-titulo').innerText = productoActual.nombre;
    actualizarCalculos();
}

function actualizarCalculos() {
    const cant = parseInt(document.getElementById('cantidad-input').value) || 1;
    let precio = productoActual.precio;
    const sel = document.getElementById('opcion-producto');
    if(sel.selectedOptions[0]?.dataset.p) precio = parseInt(sel.selectedOptions[0].dataset.p);
    document.getElementById('subtotal-valor').innerText = "$" + (precio * cant).toLocaleString();
    document.getElementById('precio-unitario').innerText = "$" + precio.toLocaleString();
}

// GESTIÓN DEL CARRITO
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    document.getElementById('cart-count').innerText = carrito.length;
    guardarEnMemoria();
    if (carrito.length === 0) volverAlCatalogo(); else irAlCarrito();
}

function agregarAlCarrito() {
    const cant = parseInt(document.getElementById('cantidad-input').value);
    const opcion = document.getElementById('opcion-producto').value;
    const color = document.getElementById('color-prenda').value;
    const detalle = document.getElementById('personalizacion-texto').value;
    const precio = parseInt(document.getElementById('precio-unitario').innerText.replace('$','').split('.').join(''));
    
    carrito.push({ nombre: productoActual.nombre, opcion, color, detalle: detalle || "Sin detalles", cant, subtotal: precio * cant });
    document.getElementById('cart-count').innerText = carrito.length;
    guardarEnMemoria();

    const toast = document.createElement('div');
    toast.innerText = "✅ Añadido al pedido";
    toast.className = "toast-notificacion";
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); volverAlCatalogo(); }, 1500);
}

function irAlCarrito() {
    if(carrito.length === 0) return alert("El carrito está vacío.");
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById('carrito-seccion').classList.remove('hidden');
    const lista = document.getElementById('lista-carrito');
    lista.innerHTML = "";
    let total = 0;
    carrito.forEach((i, idx) => {
        total += i.subtotal;
        lista.innerHTML += `
            <div class="carrito-item">
                <button onclick="eliminarDelCarrito(${idx})" class="btn-borrar">🗑️</button>
                <p><strong>${i.cant}x ${i.nombre}</strong></p>
                <p>${i.opcion} | ${i.color}</p>
                <p class="precio-sub">$${i.subtotal.toLocaleString()}</p>
            </div>`;
    });
    document.getElementById('total-precio').innerText = "$" + total.toLocaleString();
}

function vaciarCarrito() {
    if(confirm("¿Borrar todo el pedido?")) {
        carrito = [];
        document.getElementById('cart-count').innerText = "0";
        localStorage.removeItem('carritoReyand');
        volverAlCatalogo();
    }
}

function enviarWhatsApp() {
    const nombre = document.getElementById('nombre-cliente').value;
    if(!nombre) return alert("Ingresa tu nombre.");
    let msj = `Hola Andrea, soy ${nombre}. Mi pedido de Reyand Clothing es:\n\n`;
    carrito.forEach(i => {
        msj += `✅ *${i.cant}x ${i.nombre}*\n - Talla/Mat: ${i.opcion}\n - Color: ${i.color}\n - Detalle: ${i.detalle}\n - Valor: $${i.subtotal.toLocaleString()}\n\n`;
    });
    msj += `*TOTAL: ${document.getElementById('total-precio').innerText}*`;
    window.open(`https://wa.me/573184250115?text=${encodeURIComponent(msj)}`);
}
