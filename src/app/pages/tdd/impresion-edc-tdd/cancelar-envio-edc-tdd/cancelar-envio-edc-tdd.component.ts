import { Component, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { ResponseWS } from '../../../../services/response/response.service';
import { consultaCatalogos } from '../../../../services/consultaCatalogos/consultaCatalogos.service';
declare var jquery: any; // jquery
declare var $: any;

@Component({
  selector: 'app-cancelar-envio-edc-tdd',
  templateUrl: './cancelar-envio-edc-tdd.component.html'
})
export class CancelarEnvioEdcTddComponent implements OnInit {

  botonAceptar: any = 0;
  botonTerminos: any = 0;
  terminacionTarjeta: string;
  constructor(private router: Router, private serviceTdd: ResponseWS) {}

  ngOnInit() {
    let tamanio =  this.serviceTdd.numeroCuentaTdd.length;
    this.terminacionTarjeta = this.serviceTdd.numeroCuentaTdd.substring(tamanio - 4, tamanio);
    $('#_modal_please_wait').modal('show');
    this.consultarDatos();
  }

  consultarDatos() {
    const this_aux = this;
    const operaciones: consultaCatalogos = new consultaCatalogos();
    let btnContinuar = document.getElementById('continuarCancelacion');
    operaciones.consultarDatosContacto().then(
      function(respPago) {

        const jsonRespuesta = respPago.responseJSON;
        if (jsonRespuesta.Id === '1') {
          if (jsonRespuesta.Email === '') {
            $('#registraCorreo').modal('show');
            btnContinuar.style.display = 'none';
          } else {
            this_aux.serviceTdd.email = jsonRespuesta.Email;
          }
        } else {
          this_aux.showErrorSucces(jsonRespuesta);
          btnContinuar.style.display = 'none';
          console.log("No hay Datos");
        }

        setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);
      }, function(error) { 
        this_aux.showErrorPromise(error); 
        btnContinuar.style.display = 'none';
        $('#_modal_please_wait').modal('hide');
      });
  }

  checkBox(id) {
    const this_aux = this;
    let imagenAcept = document.getElementById("imageAcept");
    let imagenTerminos = document.getElementById("imageTerminos");

    if (id === 1) {
      if (this_aux.botonAceptar === 0) {
        imagenAcept.setAttribute("src", "./assets/img/cancelacionEDCselected.png");
        this_aux.botonAceptar = 1;
      } else {
        imagenAcept.setAttribute("src", "./assets/img/cancelacionEDC.png");
        this_aux.botonAceptar = 0;
      }
    } else {
      if (this_aux.botonTerminos === 0) {
        imagenTerminos.setAttribute("src", "./assets/img/cancelacionEDCselected.png");
        this_aux.botonTerminos = 1;
      } else {
        imagenTerminos.setAttribute("src", "./assets/img/cancelacionEDC.png");
        this_aux.botonTerminos = 0;
      }
    }    
  }

  mostrarTerminos () {
    $('#modalTerminos').modal('show');
  }

  activarCancelacion() {
    $('#_modal_please_wait').modal('show');
    const this_aux = this;

    const formParameters = {
      opcion: '3',
      solicitud: 'A',
    };

    const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursApps2/resource/mantoCancelacionEnvioEDC',
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.sendFormParameters(formParameters).then(
      function(response) {
        setTimeout(function() {
          const detalleMant = response.responseJSON;
          if (detalleMant.Id === "1") {
          this_aux.router.navigate(['/cancelarEnvioEDCDomicilioFinish']);
          } else {
            $('#errorModal').modal('show');
          }
          $('#_modal_please_wait').modal('hide');
       }, 3000); 
      },
        function(error) {
          $('#_modal_please_wait').modal('hide');
          console.error("Error");
          $('#errorModal').modal('show');
        });
  }


  showErrorSucces(json) {
    setTimeout(function() {
      console.log(json.Id + json.MensajeAUsuario);
      document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
      $('#_modal_please_wait').modal('hide');
      $('#errorModal').modal('show');
    }, 500);
  }

  showErrorPromise(error) {

    setTimeout(function() {
      $('#modal_please_wait').modal('hide');
      $('#errorModal').modal('show');
        document.getElementById('mnsError').innerHTML = 'El servicio no esta disponible, favor de intentar mas tarde';
    }, 500);
  }

}
