import Swal from 'sweetalert2';
import axios from 'axios';

const $btnEliminar = document.querySelector('#eliminar-proyecto');
if ($btnEliminar) {
  $btnEliminar.addEventListener('click', (e) => {
    const urlProyecto = e.target.dataset.proyectoUrl;
    Swal.fire({
      title: 'Estas Seguro de Eliminar este proyecto?',
      text: 'Un proyecto eliminado no se puede recuperar',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        //enviar datos para Eliminar
        const url = `${location.origin}/proyectos/${urlProyecto}`;

        axios
          .delete(url, {params: {urlProyecto}})
          .then((respuesta) => {
            Swal.fire('Eliminado', respuesta.data, 'success');
            //redireccionar al home
            setTimeout(() => {
              window.location.href = '/';
            }, 2000);
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
  });
}

export default $btnEliminar;
