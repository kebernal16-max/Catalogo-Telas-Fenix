let carrito = [];
let productoActual = {};

// Configuración de fotos por producto
const fotosProductos = {
    'fenix': ['fenix1.jpg', 'fenix2.jpg', 'fenix3.jpg'],
    'estandar': ['estandar1.jpg', 'estandar2.jpg'],
    'capuchon': ['cap-mixto.jpg', 'cap-drill.jpg']
};

function abrirAyuda() {
    document.getElementById('bienvenida').classList.add('hidden');
    document.getElementById('seccion-ayuda').classList.remove('hidden');
}

function cerrarAyuda() {
    document.getElementById('seccion-ayuda').classList.add('hidden');
    mostrarCatalogo();
}

function mostrarCatalogo() {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById('catalogo').classList.remove('hidden');
}

function verDetalle(tipo) {
    document.getElementById('catalogo').classList.add('hidden');
    document.getElementById('detalle-tecnico').classList.remove('hidden');
    
    const select = document.getElementById('opcion-producto');
    const contenedorMiniaturas = document.getElementById('miniaturas-contenedor');
    contenedorMiniaturas.innerHTML = "";
    select.innerHTML = "";

    // Cargar fotos y miniaturas
    const fotos = fotosProductos[tipo] || [];
    if(fotos.length > 0) {
        document.getElementById('imagen-principal').src = fotos[0];
        fotos.forEach((foto, index) => {
            const img = document.createElement('img');
            img.src = foto;
            img.className = 'miniatura' + (index === 0 ? ' active' : '');
            img.onclick = () => {
                document.getElementById('imagen-principal').src = foto;
                document.querySelectorAll('.miniatura').forEach(m => m.classList.remove('active'));
                img.classList.add('active');
            };
            contenedorMiniaturas.appendChild(img);
        });
    }

    if (tipo === 'fenix') {
        productoActual = { nombre: "Línea Fénix Premium", precio: 95000 };
        ['S', 'M', 'L', 'XL'].forEach(t => select.innerHTML += `<option value="${t}">${t}</option>`);
    } else if (tipo === 'estandar') {
        productoActual = { nombre: "Línea Estándar", precio: 85000 };
        ['S', 'M', 'L', 'XL'].forEach(t => select.innerHTML += `<option value="${t}">${t}</option>`);
    } else if (tipo === 'capuchon') {
        productoActual = { nombre: "Capuchón", precio: 12000 };
        select.innerHTML = '<option value="Dacron" data-p="12000">Dacrón ($12.000)</option><option value="Mixto" data-p="14000">Mixto ($14.000)</option><option value="Drill" data-p="16000">Drill ($16.000)</option>';
    }

    document.getElementById('detalle-titulo').innerText = productoActual.nombre;
    actualizarCalculos();
}

function actualizarCalculos() {
    const cant = parseInt(document.getElementById('cantidad-input').value) || 1;
    let precio = productoActual.precio;
    const sel = document.getElementById('opcion-producto');
    if(sel.selectedOptions[0]?.dataset.p) precio = parseInt(sel.selectedOptions[0].dataset.p);
    
    document.getElementById('precio-unitario').innerText = "$" + precio.toLocaleString();
    document.getElementById('subtotal-valor').innerText = "$" + (precio * cant).toLocaleString();
}

function agregarAlCarrito() {
    const cant = parseInt(document.getElementById('cantidad-input').value);
    const opcion = document.getElementById('opcion-producto').value;
    const precioTxt = document.getElementById('precio-unitario').innerText.replace('$','').replace('.','');
    const precio = parseInt(precioTxt);
    
    carrito.push({ nombre: productoActual.nombre, opcion, cant, subtotal: precio * cant });
    document.getElementById('cart-count').innerText = carrito.length;
    alert("¡Producto añadido al pedido!");
    volverAlCatalogo();
}

function volverAlCatalogo() {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById('catalogo').classList.remove('hidden');
}

function irAlCarrito() {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById('carrito-seccion').classList.remove('hidden');
    const lista = document.getElementById('lista-carrito');
    lista.innerHTML = "";
    let total = 0;
    carrito.forEach(i => {
        total += i.subtotal;
        lista.innerHTML += `<div style="border-bottom:1px solid #333; padding:10px;"><p>${i.cant}x ${i.nombre} (${i.opcion})</p><p>Subtotal: $${i.subtotal.toLocaleString()}</p></div>`;
    });
    document.getElementById('total-precio').innerText = "$" + total.toLocaleString();
}

function enviarWhatsApp() {
    const nombre = document.getElementById('nombre-cliente').value;
    if(!nombre) return alert("Por favor, ingresa tu nombre");
    let msj = `Hola Andrea, soy ${nombre}. Quisiera realizar el siguiente pedido:\n\n`;
    carrito.forEach(i => msj += `- ${i.cant} ${i.nombre} (Talla/Mat: ${i.opcion}) - $${i.subtotal.toLocaleString()}\n`);
    msj += `\n*TOTAL: ${document.getElementById('total-precio').innerText}*`;
    window.open(`https://wa.me/573184250115?text=${encodeURIComponent(msj)}`);
}
