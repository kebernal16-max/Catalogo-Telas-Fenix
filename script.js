let carrito = [];
let productoActual = {};

function mostrarCatalogo() {
    document.getElementById('bienvenida').classList.add('hidden');
    document.getElementById('catalogo').classList.remove('hidden');
    window.scrollTo(0,0);
}

function verDetalle(tipo) {
    document.getElementById('catalogo').classList.add('hidden');
    document.getElementById('detalle-tecnico').classList.remove('hidden');
    
    // Aquí es donde agregamos la información que me mostraste
    const select = document.getElementById('opcion-producto');
    const infoPrecios = document.querySelector('.info-precios');
    select.innerHTML = "";

    // Limpiamos o creamos el contenedor de especificaciones
    let infoTecnica = document.getElementById('info-tecnica-extra');
    if(!infoTecnica) {
        infoTecnica = document.createElement('div');
        infoTecnica.id = 'info-tecnica-extra';
        infoPrecios.after(infoTecnica);
    }

    if (tipo === 'fenix') {
        productoActual = { nombre: "Línea Fénix Premium", precio: 95000, tipo: 'prenda', foto: 'fenix1.jpg' };
        ['S', 'M', 'L', 'XL'].forEach(t => select.innerHTML += `<option value="${t}">${t}</option>`);
        
        infoTecnica.innerHTML = `
            <div style="background: rgba(204,0,0,0.1); border: 1px solid var(--rojo); padding: 10px; border-radius: 8px; margin: 15px 0;">
                <p style="color: #ffcc00; font-weight: bold;">✨ PERSONALIZACIÓN INCLUIDA:</p>
                <ul style="font-size: 0.9rem; margin-left: 15px;">
                    <li>Todo va BORDADO</li>
                    <li>Grupo Sanguíneo (RH)</li>
                    <li>Nombre y un Apellido</li>
                    <li>Bandera del país que elijas</li>
                </ul>
            </div>
            <div style="font-size: 0.85rem; color: #ccc;">
                <p><strong>ESPECIFICACIONES TÉCNICAS:</strong></p>
                <ul>
                    <li>Drill Vulcano / Triple costura / 4 broches</li>
                </ul>
            </div>`;

    } else if (tipo === 'estandar') {
        productoActual = { nombre: "Línea Estándar", precio: 85000, tipo: 'prenda', foto: 'estandar1.jpg' };
        ['S', 'M', 'L', 'XL'].forEach(t => select.innerHTML += `<option value="${t}">${t}</option>`);
        
        infoTecnica.innerHTML = `
            <div style="background: rgba(204,0,0,0.1); border: 1px solid var(--rojo); padding: 10px; border-radius: 8px; margin: 15px 0;">
                <p style="color: #ffcc00; font-weight: bold;">✨ PERSONALIZACIÓN INCLUIDA:</p>
                <ul style="font-size: 0.9rem; margin-left: 15px;">
                    <li>Todo va BORDADO</li>
                    <li>Grupo Sanguíneo (RH)</li>
                    <li>Nombre y un Apellido</li>
                    <li>Bandera del país que elijas</li>
                </ul>
            </div>
            <div style="font-size: 0.85rem; color: #ccc;">
                <p><strong>ESPECIFICACIONES TÉCNICAS:</strong></p>
                <ul>
                    <li>Drill grueso / Jean de alta calidad</li>
                    <li>Doble costura reforzada / 1 broche en el puño</li>
                </ul>
            </div>`;

    } else if (tipo === 'capuchon') {
        productoActual = { nombre: "Capuchón Industrial", precio: 12000, tipo: 'capuchon', foto: 'cap-mixto.jpg' };
        select.innerHTML = `
            <option value="Dacron" data-p="12000">Dacrón ($12.000)</option>
            <option value="Mixto" data-p="14000">Mixto ($14.000)</option>
            <option value="Drill" data-p="16000">Drill ($16.000)</option>`;
        infoTecnica.innerHTML = `<p style="margin: 15px 0; color: #ccc;">Protección ideal para trabajo industrial pesado.</p>`;
    }

    document.getElementById('detalle-titulo').innerText = productoActual.nombre;
    document.getElementById('imagen-principal').src = productoActual.foto;
    document.getElementById('precio-unitario').innerText = "$" + productoActual.precio.toLocaleString('es-CO');
    actualizarCalculos();
}

// ... EL RESTO DEL CÓDIGO (actualizarCalculos, agregarAlCarrito, enviarWhatsApp) SIGUE IGUAL QUE EL ANTERIOR ...

function actualizarCalculos() {
    const cant = parseInt(document.getElementById('cantidad-input').value) || 1;
    const select = document.getElementById('opcion-producto');
    let precioBase = productoActual.precio;

    if(productoActual.tipo === 'capuchon') {
        precioBase = parseInt(select.options[select.selectedIndex].getAttribute('data-p'));
    }

    let desc = 0;
    if (productoActual.tipo === 'prenda') {
        if (cant >= 6 && cant < 11) desc = 0.05;
        else if (cant >= 12) desc = 0.10;
    }

    const total = (precioBase * (1 - desc)) * cant;
    document.getElementById('subtotal-valor').innerText = "$" + Math.round(total).toLocaleString('es-CO');
    productoActual.totalF = Math.round(total);
}

function agregarAlCarrito() {
    const cant = document.getElementById('cantidad-input').value;
    const opcion = document.getElementById('opcion-producto').value;
    carrito.push({ nombre: productoActual.nombre, opcion: opcion, cant: cant, total: productoActual.totalF });
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
    const lista = document.getElementById('lista-carrito');
    lista.innerHTML = "";
    let granTotal = 0;
    carrito.forEach(item => {
        lista.innerHTML += `<div style="border-bottom:1px solid #333; padding:10px 0;"><p><strong>${item.nombre}</strong></p><p>Talla/Mat: ${item.opcion} | Cant: ${item.cant}</p><p>Subtotal: $${item.total.toLocaleString('es-CO')}</p></div>`;
        granTotal += item.total;
    });
    document.getElementById('total-precio').innerText = "$" + granTotal.toLocaleString('es-CO');
}

function enviarWhatsApp() {
    const nombre = document.getElementById('nombre-cliente').value;
    const ciudad = document.getElementById('ciudad-cliente').value;
    if(!nombre || !ciudad) return alert("Por favor, ingresa tu nombre y ciudad.");
    let mensaje = `*PEDIDO TELAS FÉNIX*%0A*Cliente:* ${nombre}%0A*Ciudad:* ${ciudad}%0A%0A`;
    let totalFinal = 0;
    carrito.forEach(item => {
        mensaje += `- ${item.nombre} (${item.opcion}) x${item.cant}: $${item.total.toLocaleString('es-CO')}%0A`;
        totalFinal += item.total;
    });
    mensaje += `%0A*TOTAL: $${totalFinal.toLocaleString('es-CO')}*`;
    window.open(`https://api.whatsapp.com/send?phone=573184250115&text=${mensaje}`);
}
