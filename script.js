let carrito = [];
let productoActual = {};

function mostrarCatalogo() {
    document.getElementById('bienvenida').style.display = 'none';
    document.getElementById('catalogo').classList.remove('hidden');
    window.scrollTo(0,0);
}

function verDetalle(tipo) {
    document.getElementById('catalogo').classList.add('hidden');
    document.getElementById('detalle-tecnico').classList.remove('hidden');
    const select = document.getElementById('opcion-producto');
    select.innerHTML = "";

    if (tipo === 'fenix') {
        productoActual = { tipo: 'prenda', nombre: "Línea Fénix Premium", precio: 95000, fotos: ['fenix1.jpg'] };
        ['S', 'M', 'L', 'XL'].forEach(t => select.innerHTML += `<option value="${t}">${t}</option>`);
    } else if (tipo === 'estandar') {
        productoActual = { tipo: 'prenda', nombre: "Línea Estándar", precio: 85000, fotos: ['estandar1.jpg'] };
        ['S', 'M', 'L', 'XL'].forEach(t => select.innerHTML += `<option value="${t}">${t}</option>`);
    } else if (tipo === 'capuchon') {
        productoActual = { tipo: 'capuchon', nombre: "Capuchón Industrial", precio: 12000, fotos: ['cap-mixto.jpg'] };
        select.innerHTML = `<option value="Dacron" data-p="12000">Dacrón ($12k)</option><option value="Mixto" data-p="14000">Mixto ($14k)</option><option value="Drill" data-p="16000">Drill ($16k)</option>`;
    }

    document.getElementById('detalle-titulo').innerText = productoActual.nombre;
    document.getElementById('imagen-principal').src = productoActual.fotos[0];
    actualizarCalculos();
}

function actualizarCalculos() {
    const cant = parseInt(document.getElementById('cantidad-input').value) || 1;
    const select = document.getElementById('opcion-producto');
    let precioBase = productoActual.precio;

    if(productoActual.tipo === 'capuchon') {
        precioBase = parseInt(select.options[select.selectedIndex].getAttribute('data-p'));
    }

    let desc = 0;
    if (productoActual.tipo === 'prenda') {
        if (cant >= 6 && cant < 12) desc = 0.05;
        else if (cant >= 12) desc = 0.10;
    }

    const total = (precioBase * (1 - desc)) * cant;
    document.getElementById('subtotal-valor').innerText = "$" + total.toLocaleString('es-CO');
    productoActual.totalCalculado = total;
}

function agregarAlCarrito() {
    carrito.push({ nombre: productoActual.nombre, cant: document.getElementById('cantidad-input').value, total: productoActual.totalCalculado });
    document.getElementById('cart-count').innerText = carrito.length;
    alert("¡Producto añadido!");
    volverAlCatalogo();
}

function volverAlCatalogo() {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById('catalogo').classList.remove('hidden');
}

function irAlCarrito() {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById('carrito-seccion').classList.remove('hidden');
    let lista = document.getElementById('lista-carrito');
    lista.innerHTML = "";
    let granTotal = 0;
    carrito.forEach(i => {
        lista.innerHTML += `<p>${i.nombre} x${i.cant}: $${i.total.toLocaleString('es-CO')}</p>`;
        granTotal += i.total;
    });
    document.getElementById('total-precio').innerText = "$" + granTotal.toLocaleString('es-CO');
}

function enviarWhatsApp() {
    const nombre = document.getElementById('nombre-cliente').value;
    if(!nombre) return alert("Por favor escribe tu nombre");
    let msg = `Hola Andrea Villalba, soy ${nombre}. Mi pedido: `;
    carrito.forEach(i => msg += `- ${i.nombre} x${i.cant} `);
    window.open(`https://api.whatsapp.com/send?phone=573184250115&text=${msg}`);
}
