const axios = require('axios');
const Swal = require('sweetalert2');

import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
  tareas.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-check-circle')) {
      const icono = e.target;
      const idTarea = icono.parentElement.parentElement.dataset.tarea;
      //request hacia /tareas/:id
      const url = `${location.origin}/tareas/${idTarea}`;
      axios.patch(url, {idTarea}).then((respuesta) => {
        if (respuesta.status === 200) {
          icono.classList.toggle('completo');
          actualizarAvance();
        }
      });
    }

    if (e.target.classList.contains('fa-trash')) {
      const tareaTHML = e.target.parentElement.parentElement;
      const idTarea = tareaTHML.dataset.tarea;
      Swal.fire({
        title: 'Estas Seguro de Eliminar esta Tarea?',
        text: 'Una tarea eliminada no se puede recuperar',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si Eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          //enviar datos para Eliminar
          const url = `${location.origin}/tareas/${idTarea}`;

          axios
            .delete(url, {params: {idTarea}})
            .then((respuesta) => {
              if (respuesta.status === 200) {
                tareaTHML.parentElement.removeChild(tareaTHML);

                Swal.fire('Eliminado', respuesta.data, 'success');
                actualizarAvance();
              }
            })
            .catch(() => {
              Swal.fire({
                icon: 'error',
                title: 'Error al eliminar',
                text: 'No se pudo eliminar el proyecto'
              });
            });
        }
      });
    }
  });
}

export default tareas;
