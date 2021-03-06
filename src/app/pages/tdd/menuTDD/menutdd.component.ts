import { Component, OnInit } from "@angular/core";
import { Http, Response, Headers,  URLSearchParams, RequestOptions } from "@angular/http";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from "@angular/router";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ConsultaSaldosTddService } from '../../../services/saldosTDD/consultaSaldos.service';
import { SesionTDDService } from '../../../services/breadcrums/breadcroms.service';
import { ResponseWS } from '../../../services/response/response.service';
import $ from "jquery";
import { DOCUMENT } from "@angular/platform-browser";
import { Session } from "protractor";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { consultaCatalogos } from '../../../services/consultaCatalogos/consultaCatalogos.service';

declare var $: $;

@Component({
  selector: "app-menutdd",
  templateUrl: "./menutdd.component.html",
  styles: []
})
export class MenutddComponent implements OnInit {
  loadingM: boolean;
  responseCampania: any;
  stringUrl: string;
  sicCifrado: string;
  idSucursal: string;
  numeroCuentaTitular: string;
  contenido: any;
  urlProperty: any;
  sesionBrowser: any;
  AlertasActivas = false;
  ArrayAlertasCliente: Array<any> = [];
  Prieba: boolean;
  constructor(private router: Router, private http: Http, private _service: ConsultaSaldosTddService, 
    private _serviceSesion: SesionTDDService, private serviceTdd: ResponseWS) {}

  ngOnInit() {
    // $('div').removeClass('modal-backdrop');
      this.getidSesion();
      if (sessionStorage.getItem("campania") === null)      {
        sessionStorage.setItem("campania", "activa");
      }
    }
  conAlertas() {
        
    const div4 = document.getElementById('Alertas');
    div4.style.display = "none";
    const div5 = document.getElementById('alertasTxt');
    div5.style.display = "none";
  }

  mandarPage(id) {
    console.log(id);

    switch (id) {
      case "saldosMov":
        this.router.navigate(["/movimientoSaldo"]);
        break;
       case 'edc':
       this.router.navigate(['/impresion-edc']);
       break;
      case "compraTA":
        this.router.navigate(["/compraTiempoAire"]);
        break;
      case "spei":
        this.router.navigate(["/spei"]);
        break;
      case "transBanorte":
        this.router.navigate(["/transBanorte"]);
        break;
      case "pagoServ":
        this.router.navigate(["/pagoServiciosTDD"]);
        break;
      case "mantoBeneficiarios":
        this.router.navigate(["/mantoBeneficiarios"]);
        break;
      case "pagoCredito":
        this.router.navigate(["/pagoCredito"]);
        break;
      case "actDatosContacto":
        this.router.navigate(["/actualizarDatosContactoTDD"]);
        break;
        case "actAlertas":
        this.router.navigate(["/activarAlertasTDD"]);
        break;

      default:
        this.router.navigate(["/menuTdd"]);
    }
  }

  compraTA() {
    this.router.navigate(["/compraTA"]);
    $("div").removeClass("modal-backdrop");
  }

  moreOptions() {
    setTimeout(() => {

    document.getElementById("operacionesFrecuentes").style.display = "none";
    document.getElementById("opciones").style.display = "none";
    document.getElementById("masOpciones").style.display = "block";
    document.getElementById("regresar").style.display = "block";
    $('#operacionesFrecuentes').removeClass('animated fadeOutUp slow');
    $('#opciones').removeClass('flipOutY fast');


    }, 2000);

    $('#operacionesFrecuentes').addClass('animated fadeOutUp slow');
    $('#masOpciones').addClass('animated fadeInUp slow');

    $('#opciones').addClass('flipOutY fast');
    $('#regresar').addClass('flipInY slow');
  // habilitar o desabilitar boton Alertas

  const this_aux = this;
  this_aux.consultaAlertas();

  }

 consultaAlertas() {

      const this_aux = this;
    const operaciones: consultaCatalogos = new consultaCatalogos();
      operaciones.mantieneAlertas().then(
        function(detalleAlertas) {
              const detalle = detalleAlertas.responseJSON;
              let AlertasActivas_true = false;
              console.log(detalle);
              if (detalle .Id === '1') {

                const alertas = detalle.AlertasXCliente;
                this_aux.ArrayAlertasCliente = alertas;
                alertas.forEach(alerta => {
                    if (alerta.IndicadorServicio === 'S' ) {   AlertasActivas_true = true;
                    }
                });
                this_aux.AlertasActivas = AlertasActivas_true;
                console.log('this_aux.AlertasActivas' + this_aux.AlertasActivas);
                if (this_aux.AlertasActivas) {
                  
                  this_aux.conAlertas();
                } else {
                  this_aux.sinAlertas();
                }


                
              } else {
                this_aux.sinAlertas();
                this_aux.showErrorSucces(detalle);      
              }
              setTimeout( () => $('#_modal_please_wait').modal('hide'), 700 );
        }, function(error) {
          this_aux.sinAlertas();
          setTimeout( () => $('#_modal_please_wait').modal('hide'), 700 );
          this_aux.showErrorPromise(error);    }
      );
    }

    sinAlertas() {
      const div = document.getElementById('mantenimientoIMG');
      div.classList.remove("espacioBotones");
      
      const div2 = document.getElementById('mantenimiento');
      div2.classList.remove("espacioBotones");
     
     const div4 = document.getElementById('Alertas');
     div4.style.display = "block";
     const div5 = document.getElementById('alertasTxt');
     div5.style.display = "block";
    }
    showErrorPromise(error) {

      $('#errorModal').modal('show');
      if (error.errorCode === 'API_INVOCATION_FAILURE') {
          document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
      } else {
        document.getElementById('mnsError').innerHTML = 'El servicio no esta disponible, favor de intentar mas tarde';
      }
    
    }

    showErrorSucces(json) {

      console.log(json.Id + json.MensajeAUsuario);
      document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
      $('#errorModal').modal('show');
    
    }

  regresar() {
    setTimeout(() => {

    document.getElementById("operacionesFrecuentes").style.display = "block";
    document.getElementById("opciones").style.display = "block";
    document.getElementById("masOpciones").style.display = "none";
    document.getElementById("regresar").style.display = "none";

    $('#masOpciones').removeClass('animated fadeOutUp slow');
    $('#regresar').removeClass('flipOutY fast');

    }, 2000);

    $('#masOpciones').addClass('animated fadeOutUp slow');
    $('#operacionesFrecuentes').addClass('animated fadeInUp slow');

    $('#regresar').addClass('flipOutY fast');
    $('#opciones').addClass('flipInY slow');

  }

  cargarcampanias() {
    const this_aux = this;
    let params: URLSearchParams = new URLSearchParams();
    params.set("param1", decodeURIComponent(this_aux.sicCifrado));
    params.set("param2", "SUCA");
    params.set("sesion", this_aux.sesionBrowser);
    params.set("param3", "1003");

    // Http request-
    // this_aux.stringUrl = this_aux.urlProperty + "/ade-front/existeEvento.json?param1=cGP7ZYTkSjuaCtabUn%2BA2Q%3D%3D";
     this_aux.stringUrl = this_aux.urlProperty + "/ade-front/existeEvento.json";
    // this_aux.urlProperty + "/ade-front/existeEvento.json";

    this.http
      .get(this_aux.stringUrl, {
        search: params
      })
      .subscribe(response => (this_aux.responseCampania = response));
     if (this_aux.responseCampania._body !== "false") {
        let cadena = this_aux.responseCampania._body;
        let val1 = cadena.indexOf(",");
        let val2 = cadena.indexOf(",", val1 + 1);
        let ancho = cadena.substring(val1 + 1, val2);
        let alto = cadena.substring(val2 + 1);

       document.getElementById("frameCampania").setAttribute("src",
      this_aux.urlProperty + "/ade-front/ade.htm?param1=" + this_aux.sicCifrado +
      "&param2=SUCA&sesion=" + this_aux.sesionBrowser + "&param3=" + this_aux.idSucursal);
       document.getElementById("frameCampania").style.height = "100%";
       document.getElementById("divLargo").style.maxWidth = ancho.toString() + "px";
       document.getElementById("divAltura").style.maxHeight = alto.toString() + "px";
       document.getElementById("divAltura").style.height = alto.toString() + "px";
       $("#campaniaModal").modal("show");
    }
  }

  encriptarSic() {

    const this_aux = this;
    const THIS: any = this;
    console.log("adentro encriptar sic: " + this_aux._serviceSesion.datosBreadCroms.sicUsuarioTDD);

    const formParameters = {
        //sic: this_aux._serviceSesion.datosBreadCroms.sicUsuarioTDD
        sic: '51984872'
    };

    const resourceRequest = new WLResourceRequest(
       'adapters/AdapterBanorteSucursApps2/resource/encriptarSic',
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.sendFormParameters(formParameters).then(
      function(response) {
        let DatosJSON = response.responseJSON;
        if (DatosJSON.Id === "1") {
            this_aux.sicCifrado = DatosJSON.SicEncriptado;
            this_aux.idSucursal = DatosJSON.idSucuarsal;
            this_aux.urlProperty = DatosJSON.urlCampania;
            this_aux.cargarcampanias();
        } else {
            console.log("Ocurrio un error al encriptar sic");
        }
      },
      function(error) {
        THIS.loading = false;
        console.log("Error al encriptar sic");
      }
    );
    console.log("Salió de encriptar sic");
  }

  getidSesion() {
    const this_aux = this;
    this_aux.sesionBrowser = this_aux.serviceTdd.sesionTdd;
    console.log(this_aux.sesionBrowser);

    if (sessionStorage.getItem("campania") === "activa") {
      this_aux.encriptarSic();
    }
}


 send(msg) {
    const this_aux = this;
    let popupIframe = document.getElementsByTagName('iframe')[0];
   this_aux.contenido = (popupIframe.contentWindow ? popupIframe.contentWindow : popupIframe.contentDocument);
    this_aux.contenido.postMessage(msg, this_aux.urlProperty + '/ade-front/');
    sessionStorage.setItem("campania", "inactivo");
    $('#campaniaModal').modal('toggle');
    return false;
    }

  

}


