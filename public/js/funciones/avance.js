const Swal = require('sweetalert2');

export const actualizarAvance = () => {
  //selecionar las tareas existentes
  const tareas = document.querySelectorAll('li.tarea');

  if (tareas.length) {
    //selecionar las tareas completadas
    const tareasCompletas = document.querySelectorAll('i.completo');
    //calcular y actualizar Avance
    const avance = Math.round((tareasCompletas.length / tareas.length) * 100);
    //mostrar el avance
    const porcentaje = document.querySelector('#porcentaje');

    porcentaje.style.width = avance + '%';
    if (avance === 100) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Completaste el proyecto.',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }
};
