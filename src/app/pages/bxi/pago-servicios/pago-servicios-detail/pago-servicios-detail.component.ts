import { Autenticacion } from './../../autenticacion';
import { SesionBxiService } from './../../sesion-bxi.service';
import { OperacionesBXI } from './../../operacionesBXI';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, Renderer2  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgControl, FormControl } from '@angular/forms';
import {CurrencyPipe} from '@angular/common';

declare var jquery: any; // jquery
declare var $: any;

@Component({
  selector: 'app-pago-servicios-detail',
  templateUrl: './pago-servicios-detail.component.html',
  styleUrls: []
})
export class PagoServiciosDetailComponent implements OnInit {

 @ViewChild('rImporte', { read: ElementRef}) rImporte: ElementRef ;

  myForm: FormGroup;
  labelTipoAutentica: string;
  nombreServicio: any;
  cuentaCargo: string;
  importe: string;
  referenciaPago: string;
  fechaVencimiento: string;
  importeAux: string;
  showFocus = true;
  NumeroSeguridad: string;
  importeShow: number;

  constructor( private service: SesionBxiService, private fb: FormBuilder, private router: Router, private currencyPipe: CurrencyPipe) {

    this.myForm = this.fb.group({
     fcTelefono: ['', [Validators.required, Validators.minLength(10),  Validators.maxLength(10)]],
     fcReferencia: ['', [Validators.required]],
     fcDigitoVerificador: ['', [Validators.required, Validators.maxLength(1)]],
     fcFechaVencimiento: ['', [Validators.required , Validators.pattern(/^\d{2,4}\-\d{1,2}\-\d{1,2}$/)]],
     fcImporte: ['', [Validators.required ]],
     fcToken: []

    });
   }

  ngOnInit() {
    const this_aux = this;
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
    $( ".cdk-visually-hidden" ).css( "margin-top", "17%" );
        const detalleEmpresa = JSON.parse(this_aux.service.detalleEmpresa_PS);
          this_aux.nombreServicio =  detalleEmpresa.empresa;
          this_aux.service.nombreServicio = this_aux.nombreServicio;
          this_aux.cuentaCargo = operacionesbxi.mascaraNumeroCuenta(this_aux.service.numCuentaSeleccionado);

          if (this_aux.service.idFacturador === '1310') {
            $('#ModalLectordeRecibo').modal('show');
            $('#ModalLectordeRecibo').on('shown.bs.modal', function() {
              $(this).find('input:first').focus();
            });
              this_aux.myForm.removeControl('fcReferencia');
          } else {

              if (this_aux.service.idFacturador === '88924') {
                $('#ModalLectordeRecibo').modal('show');
                $('#ModalLectordeRecibo').on('shown.bs.modal', function() {
                  $(this).find('input:first').focus();
                });
              }
              this_aux.myForm.removeControl('fcTelefono');
              this_aux.myForm.removeControl('fcDigitoVerificador');
          }
    setTimeout(function() {

          $('#_modal_please_wait').modal('hide');
    }, 500);

    // ESTILOS Preferente
    let storageTipoClienteBEL = localStorage.getItem("tipoClienteBEL");
    let btnContinuar = document.getElementById("contiuar");

    if (storageTipoClienteBEL === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
    }


    

  }

  validarSaldo(myForm) {
    const this_aux = this;
    $('#_modal_please_wait').modal('show');
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
    if (this_aux.importeAux === undefined) {
       this_aux.importeAux = this_aux.replaceSimbolo( this_aux.myForm.get('fcImporte').value); 
     }  
    this_aux.importe = this_aux.importeAux;
    operacionesbxi.consultaTablaYValidaSaldo(this_aux.cuentaCargo, this_aux.importe).then(
      function(response) {
        let DatosJSON = response.responseJSON;
        console.log(response.responseText);
        if (DatosJSON.Id === "1") {
          console.log("Pago validado");
          this_aux.showDetallePago(myForm);
        } else if ( DatosJSON.Id === "4" ) {
          $('#modalLimiteDiario').modal('show');
        } else if ( DatosJSON.Id === "5" ) {
          $('#modalLimiteMensual').modal('show');
        } else {
          $('#errorModal').modal('show');
        }
        setTimeout(function() {
          $('#_modal_please_wait').modal('hide');
        }, 500);
        
      }, function(error) {
        setTimeout(function() {
          $('#_modal_please_wait').modal('hide');
       this_aux.showErrorPromise(error);
        }, 500);
       
  });
  }
  showDetallePago(myForm) {
    const this_aux = this;
       if (this_aux.importeAux === undefined) { 
         this_aux.importeAux = this_aux.replaceSimbolo( this_aux.myForm.get('fcImporte').value); 
        }
       this_aux.importe = this_aux.importeAux;
       this_aux.importeShow = parseInt(this_aux.importe, 10);
      console.log(this_aux.importe);
      this_aux.fechaVencimiento = myForm.fcFechaVencimiento.toString();
      if (this_aux.service.idFacturador === '1310') {
        this_aux.referenciaPago = myForm.fcTelefono.toString() + myForm.fcDigitoVerificador.toString();
      } else {
        this_aux.referenciaPago = myForm.fcReferencia.toString();
      }
       this_aux.setTipoAutenticacionOnModal();
  }

  setTipoAutenticacionOnModal() {
      const this_aux = this;
      const divChallenge = document.getElementById('challenger');
      const divTokenPass = document.getElementById('divPass');

      const control: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^([0-9])*$/)]);
      this_aux.myForm.setControl('fcToken', control );

      if (this_aux.service.metodoAutenticaMayor.toString() === '5') {

        $('#_modal_please_wait').modal('show');

        this_aux.labelTipoAutentica = 'Token Celular';
        divTokenPass.setAttribute('style', 'display: flex');
        const operacionesbxi: OperacionesBXI = new OperacionesBXI();
        operacionesbxi.preparaAutenticacion().then(
          function(response) {
            const detallePrepara = response.responseJSON;
            console.log(detallePrepara);
            if (detallePrepara.Id === 'SEG0001') {
              divChallenge.setAttribute('style', 'display: flex');
              this_aux.NumeroSeguridad = detallePrepara.MensajeUsuarioUno;
              setTimeout(() => {
                $('#_modal_please_wait').modal('hide');
             }, 500);

            } else {

              setTimeout(() => {
                $('#_modal_please_wait').modal('hide');
                this_aux.showErrorSucces(detallePrepara);
             }, 1000);
            }
          }, function(error) {

            setTimeout(() => {
              $('#_modal_please_wait').modal('hide');
              this_aux.showErrorPromise(error);
           }, 1000);

          });

      } else if (this_aux.service.metodoAutenticaMayor.toString()  === '0') {

        divChallenge.setAttribute('style', 'display: none');
        divTokenPass.setAttribute('style', 'display: flex');
        this_aux.labelTipoAutentica = 'Contrase&atilde;a';
      } else if (this_aux.service.metodoAutenticaMayor.toString()  === '1') {

        
        divChallenge.setAttribute('style', 'display: none');
        divTokenPass.setAttribute('style', 'display: flex');
        this_aux.labelTipoAutentica = 'Token Fisico';
      }

      setTimeout(function() {
        $( ".cdk-visually-hidden" ).css( "margin-top", "19%" );
        $('#confirmModal').modal('show');
      }, 500);
  }

  confirmarPago(token) {
    $('#_modal_please_wait').modal('show');
      const this_aux = this;
      const autenticacion: Autenticacion = new Autenticacion();
      const operacionesbxi: OperacionesBXI = new OperacionesBXI();
      let mensajeError;
      if (this_aux.importeAux === undefined) { this_aux.importeAux = this_aux.replaceSimbolo( this_aux.myForm.get('fcImporte').value); }
      const patron = /,/g;  
    this_aux.importeAux = this_aux.importeAux.replace(patron, '');
      autenticacion.autenticaUsuario(token, this_aux.service.metodoAutenticaMayor).then(
        function(detalleAutentica) {
              // console.log(detalleAutentica.responseJSON);
              const infoUsuarioJSON = detalleAutentica.responseJSON;
              if (infoUsuarioJSON.Id === 'SEG0001') {

                console.log('Pago validado');

                  operacionesbxi.pagaServicio(this_aux.service.idFacturador, this_aux.importeAux, this_aux.referenciaPago
                  , this_aux.service.numCuentaSeleccionado, this_aux.fechaVencimiento).then(
                    function(respPago) {

                      const jsonDetallePago = respPago.responseJSON;
                      if (jsonDetallePago.Id === '1') {
                        this_aux.service.detalleConfirmacionPS = respPago.responseText;
                        $('div').removeClass('modal-backdrop');
                        this_aux.router.navigate(['/pagoservicios_verify']);
                      } else {

                        setTimeout(function() {
                          $('#_modal_please_wait').modal('hide');
                          this_aux.showErrorSucces(jsonDetallePago);
                        }, 500);
                      }
                    }, function(error) {
                         setTimeout(function() {
                          $('#_modal_please_wait').modal('hide');
                          this_aux.showErrorPromiseMoney(error);   
                        }, 500);
                      }
                  );
              } else {
                      setTimeout(function() {
                        $('#_modal_please_wait').modal('hide');
                          console.log(infoUsuarioJSON.Id + infoUsuarioJSON.MensajeAUsuario);
                          mensajeError = this_aux.controlarError(infoUsuarioJSON);
                          document.getElementById('mnsError').innerHTML =  mensajeError;
                          $('#errorModal').modal('show');
                      }, 500);
              }
        }, function(error) {

          setTimeout(function() {
            $('#_modal_please_wait').modal('hide');
            this_aux.showErrorPromiseMoney(error);
          }, 500);
        });

  }

  transformAmount(importe) {
    const this_aux = this;
    if (importe !== '') {
      const control: FormControl = new FormControl('');
      this_aux.myForm.setControl('fcImporte', control);
      this_aux.importeAux = this_aux.replaceSimbolo(importe);
      this_aux.rImporte.nativeElement.value = this_aux.currencyPipe.transform(this_aux.importeAux, 'USD');
      this_aux.importeAux = this_aux.replaceSimbolo( this_aux.rImporte.nativeElement.value) ;

    } else {
        if (this_aux.myForm.get('fcImporte').errors === null) {
          const control: FormControl = new FormControl('', Validators.required);
          this_aux.myForm.setControl('fcImporte', control );
        }
    }
  }

  replaceSimbolo(importe) {
    const this_aux = this;
    let importeAux = importe.replace('$', '');
    const re = /\,/g;
    importeAux = importeAux.replace(re, '');
    console.log(importeAux);

        return importeAux;
  }


  controlarError(json) {

    const id = json.Id ;
    const mensajeUsuario = json.MensajeAUsuario;
    let mensajeError;

    switch (id) {

      case 'SEG0003': mensajeError = "Usuario bloqueado, favor de esperar 15 minutos e intentar nuevamente.";
                    break;
      case 'SEG0004': mensajeError =  "Usuario bloqueado, favor de marcar a Banortel.";
                    break;
      case 'SEG0005': mensajeError =  "Los datos proporcionados son incorrectos, favor de verificar.";
                    break;
      case 'SEG0007': mensajeError = "Los datos proporcionados son incorrectos, favor de verificar.";
                    break;
      case 'SEG0008':  mensajeError = "La sesión ha caducado.";
                    break;
      case 'SEG0009':  mensajeError = "Límite de sesiones superado, favor de cerrar las sesiones de banca en línea activas.";
                    break;
      // tslint:disable-next-line:max-line-length
      case 'SEGTK03': mensajeError = "Token desincronizado."; // Ingresa a Banca en Línea. Selecciona la opción Token Celular, elige sincronizar Token y sigue las instrucciones";
                     break;
      // tslint:disable-next-line:max-line-length
      case 'SEGOTP1': mensajeError = "Token desincronizado. Ingresa a Banca en Línea. Selecciona la opción Token Celular, elige sincronizar Token y sigue las instrucciones";
                    break;
      case 'SEGOTP2': mensajeError = "Token bloqueado, favor de marcar a Banortel.";
                    break;
      case 'SEGOTP3': mensajeError = "Token deshabilitado, favor de marcar a Banortel.";
                    break;
      case 'SEGOTP4': mensajeError = "Token no activado, favor de marcar a Banortel.";
                    break;
      // tslint:disable-next-line:max-line-length
      case 'SEGAM81': mensajeError = "Token desincronizado. Ingresa a Banca en Línea. Selecciona la opción Token Celular, elige sincronizar Token y sigue las instrucciones";
                    break;
      case 'SEGAM82': mensajeError = "Token bloqueado, favor de marcar a Banortel.";
                    break;
      case 'SEGAM83': mensajeError = "Token deshabilitado, favor de marcar a Banortel.";
                    break;
      case 'SEGAM84': mensajeError = "Token no activado, favor de marcar a Banortel.";
                    break;
      case '2'      : mensajeError = mensajeUsuario;
    }

    return mensajeError;
  }

  showErrorPromise(error) {

      $('#errorModal').modal('show');
      if (error.errorCode === 'API_INVOCATION_FAILURE') {
          document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
      } else {
        document.getElementById('mnsError').innerHTML = 'El servicio no esta disponible, favor de intentar mas tarde';
      }
  }

  showErrorPromiseMoney(error) {

   
    if (error.errorCode === 'API_INVOCATION_FAILURE') {
      $('#errorModal').modal('show'); 
      document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
    } else {
      document.getElementById('msgError').innerHTML =   "No fue posible confirmar la operación. Por favor verifica tu saldo.";
      $('#ModalErrorTransaccion').modal('show');
    }
}

  showErrorSucces(json) {
      console.log(json.Id + json.MensajeAUsuario);
      document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
      $('#errorModal').modal('show');
  }

  irMenuBXI() {
     this.router.navigate(['/menuBXI']);
  }

  irPagoServiciosIni() {
    this.router.navigate(['/pagoservicios_ini']);
  }


  leeCodeBar(value) {
      const this_aux = this;
      console.log(value);
      console.log(value.length);

      if (this_aux.service.idFacturador === '1310') {

        if (value.length === 20) {
          const telefono = value.substring(0, 10);
          const centavos = '.' + value.substring(17, 19);
          const unidades = '$' + parseInt(value.substring(10, 17), 10) ;
          const importe = unidades + centavos;
          const digito = value.substring(19, 20);
          // tslint:disable-next-line:max-line-length
          const controlTelefono: FormControl = new FormControl(telefono, [Validators.required, Validators.minLength(10), Validators.maxLength(1)]);
          const controlDigito: FormControl = new FormControl(digito, [Validators.required, Validators.maxLength(1)]);
          const controlImporte: FormControl = new FormControl(importe, Validators.required);
          this_aux.myForm.setControl('fcImporte', controlImporte );
          this_aux.myForm.setControl('fcTelefono', controlTelefono );
          this_aux.myForm.setControl('fcDigitoVerificador', controlDigito );

          $('#ModalLectordeRecibo').modal('hide');

        }
      } else {
        if (value.length === 30) {

          const referencia = value.substring(2, 14);
          const importe = '$' + parseInt(value.substring(20, 29), 10) + '.00';
          const anio = '20' + value.substring(14, 16);
          const mes = value.substring(16, 18);
          const dia = value.substring(18, 20);
          const fecha = anio + '-' + mes + '-' + dia;
          const controlReferencia: FormControl = new FormControl(referencia, Validators.required);
          // tslint:disable-next-line:max-line-length
          const controlFecha: FormControl = new FormControl(fecha, [Validators.required,  Validators.pattern(/^\d{2,4}\-\d{1,2}\-\d{1,2}$/)]);
          const controlImporte: FormControl = new FormControl(importe, Validators.required);
          this_aux.myForm.setControl('fcImporte', controlImporte );
          this_aux.myForm.setControl('fcReferencia', controlReferencia );
          this_aux.myForm.setControl('fcFechaVencimiento', controlFecha );
          $('#ModalLectordeRecibo').modal('hide');
        }
     }
  }

  ocultaModal() {
    const this_aux = this;
    const control: FormControl = new FormControl('');
    this_aux.myForm.setControl('fcToken', control );
  }
}
