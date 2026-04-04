// Agrega estas funciones al inicio de tu archivo script.js
function abrirAyuda() {
    document.getElementById('bienvenida').classList.add('hidden');
    document.getElementById('seccion-ayuda').classList.remove('hidden');
    window.scrollTo(0,0);
}

function cerrarAyuda() {
    document.getElementById('seccion-ayuda').classList.add('hidden');
    mostrarCatalogo();
}

// Modifica la función mostrarCatalogo existente para que incluya ocultar la ayuda
function mostrarCatalogo() {
    document.getElementById('bienvenida').classList.add('hidden');
    document.getElementById('seccion-ayuda').classList.add('hidden'); 
    document.getElementById('catalogo').classList.remove('hidden');
    window.scrollTo(0,0);
}
