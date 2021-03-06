import { Component, OnInit, Self } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { SesionTDDService } from '../services/breadcrums/breadcroms.service';
import { ResponseWS } from '../services/response/response.service';
import $ from 'jquery';
import { HttpHeaders } from '@angular/common/http';
import { DOCUMENT } from '@angular/platform-browser';
declare var $: $;


@Component({
  selector: 'app-home',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent {

  forma: string;
  tarjeta: string;
  postResp;
  contenido: any;
  datosLegacy = "";
  respuestaTrjeta = "";

  constructor( private _http: Http,
               private router: Router,
               private _service: SesionTDDService, private serviceTdd: ResponseWS  ) {}


               onPlasticLogin() {
                const this_aux = this;
                 $('#ModalTDDLogin').modal('show');
                 document.getElementById('capturaInicio').style.display = 'block';
                 document.getElementById('caputuraSesion').style.display = 'none';
                 setTimeout(function() {
                 
                 const securityCheckName = 'banorteSecurityCheckSa';
                 const userLoginChallengeHandler = WL.Client
                     .createSecurityCheckChallengeHandler(securityCheckName);
                 const usr_ca = 'sucursApps';
                 const tarjet = 'adm-sucusWeb';
                 console.log(usr_ca);
                 console.log(tarjet);

                     WLAuthorizationManager.login(securityCheckName, {
                         'usr_ca': usr_ca,
                         'tarjet': tarjet
                     }).then(
                         function() {
                            const usuarioAgent = navigator.userAgent;
                            console.log('login onSuccess');
                            setTimeout(function() {
                             this_aux.getUsrPassLegacy(usuarioAgent);
                            }, 1000);

                     }, function(error) {
                         console.log(error);
                         $('#ModalTDDLogin').modal('hide');
                         setTimeout( () => $('#ModalTDDLogin').modal('hide'), 500 );
                     });                     
                   }, 30000);
               }

               



  onPlasticLoginafterSecurity() {
    const this_aux = this;
    // this.getPosts().subscribe( result => {this.postResp = result; });

    // console.log(this.postResp);

    //setTimeout(function() {

      let tr2 = localStorage.getItem("tr2");
     let np = localStorage.getItem("np");
     let respTar = localStorage.getItem("res");
     this.respuestaTrjeta = respTar;
     let descripcion = localStorage.getItem("des");



      if ((respTar !== "NO_OK") && (respTar !== null)) {


        const THIS: any = this;

        const formParameters = {
            tarjeta: tr2,
             // tarjeta: '4334540109018154=151022110000865',
            nip: np
             // nip: 'D4D60267FBB0BB28'
        };

        const resourceRequest = new WLResourceRequest(
        'adapters/AdapterBanorteSucursApps/resource/validaNip',
        WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
        resourceRequest
        .sendFormParameters(formParameters)
        .then(
           function(response) {

             let res = response.responseJSON;

             if (res.Id === "1") {

              THIS._service.datosBreadCroms.numeroCliente = res.Tran_NumeroCliente;
              THIS._service.datosBreadCroms.nombreUsuarioTDD = res.Tran_NombrePersona;
              THIS._service.datosBreadCroms.sicUsuarioTDD = res.Tran_NumeroCliente;
              // setTimeout( () => $('#ModalTDDLogin').modal('hide'), 500 );
 
              let tipoPreferencia = res.DetalleClave;
              let validaPreferencia = true;
               this_aux.comienzaContador();
 
               if (this_aux.includesL(validaPreferencia, "PREFERENTE")) {
                 // PREFERENTE
                 validaPreferencia = false;
                 localStorage.setItem("tipoClienteTar", validaPreferencia.toString() );
               } else {
                 // NORMAL
                 localStorage.setItem("tipoClienteTar", validaPreferencia.toString()  );
               }
 
               $('#ModalTDDLogin').modal('hide');
              THIS.router.navigate(['/menuTdd']);
              //    this_aux.consultaTablaCorpBancosService();
              localStorage.setItem("validaNipServ", "1");

             } else {
              
              
              localStorage.removeItem("des");
              localStorage.removeItem("np");
              localStorage.removeItem("res");
              localStorage.removeItem("tr2");
              localStorage.removeItem("tr2_serv");
              localStorage.removeItem("np_serv");
              localStorage.removeItem("res_serv");
              
              setTimeout( () => $('#ModalTDDLogin').modal('hide'), 500 );


              // tslint:disable-next-line:max-line-length
              document.getElementById('mnsError').innerHTML = "Por el momento este servicio no est&aacute; disponible, favor de intentar de nuevo m&aacute;s tarde.";
              $('#errorModal').modal('show');
             }
             
        
      },
      function(error) {


             setTimeout( () => $('#ModalTDDLogin').modal('hide'), 500 );


               // tslint:disable-next-line:max-line-length
               document.getElementById('mnsError').innerHTML = "Por el momento este servicio no est&aacute; disponible, favor de intentar de nuevo m&aacute;s tarde.";
               $('#errorModal').modal('show');

           });

         } else {

           setTimeout( () => $('#ModalTDDLogin').modal('hide'), 500 );


               // tslint:disable-next-line:max-line-length
               console.log("Pinpad respondio con " + this.respuestaTrjeta);
               document.getElementById('mnsError').innerHTML = "Por el momento este servicio no est&aacute; disponible, favor de intentar de nuevo m&aacute;s tarde.";
               $('#errorModal').modal('show');

         }

   // }, 50000);


  }

  getUsrPassLegacy(usrAgent) {
    const this_aux = this;

        const patron = /@/g;
        usrAgent = usrAgent.replace(patron, '');

        const formParameters = {
            terminal: usrAgent
                // terminal: 'T002'
        };
        const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursApps/resource/consultaUsrLegacy',
            WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
        resourceRequest.sendFormParameters(formParameters).then(
            function(response) {
                this_aux.datosLegacy = response.responseJSON;
                console.log( this_aux.datosLegacy);
                console.log("El servcio de informacion Legacy respondio correctamente");
                this_aux.idSession();
                this_aux.tokenOperacion();
              },
            function(error) {
              WLAuthorizationManager.logout('banorteSecurityCheckSa');
                console.log("Ocurrio un error con el servcio de informacion Legacy");
                $('#errorModal').modal('show');
                $('#ModalTDDLogin').modal('hide');
            });
}
  comienzaContador() {
  const this_aux = this;
  const body = $('body');
  body.on('click', function() {
    localStorage.setItem('TimeOut', localStorage.getItem('TimeOutIni'));
  });

  setInterval(function() {
   const valueNewTimeOut = +localStorage.getItem('TimeOut') - 1;
   localStorage.setItem('TimeOut', valueNewTimeOut.toString());
   if (valueNewTimeOut === 0) {
    this_aux.cerrarSesion();
   }
  }, 1000);
}


cerrarSesion() {

  const THIS: any = this;

  console.log("Cerrar sesion");
  sessionStorage.removeItem("campania");
  localStorage.removeItem("validaNipServ");
  localStorage.removeItem("des");
  localStorage.removeItem("np");
  localStorage.removeItem("res");
  localStorage.removeItem("tr2");
  const resourceRequest = new WLResourceRequest(
    'adapters/AdapterBanorteSucursApps2/resource/cerrarSesion',
    WLResourceRequest.POST);
resourceRequest.setTimeout(30000);
resourceRequest.send().then(
        function(response) {

          console.log(response);

          WLAuthorizationManager.logout('banorteSecurityCheckSa');
          location.reload(true);
          THIS.router.navigate(['/login']);

        },
        function(error) {

          WLAuthorizationManager.logout('banorteSecurityCheckSa');
          console.log(error);
          THIS.router.navigate(['/login']);

        });

}

  idSession() {
    const this_aux = this;
    const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursApps/resource/getSessionId',
      WLResourceRequest.POST);
  resourceRequest.setTimeout(30000);
  resourceRequest
      .send()
      .then(
          function(response) {
              let resp = response.responseJSON;
              this_aux.serviceTdd.sesionTdd = response.responseText;
              console.log(response.responseText);
          } ,

          function(error) {
              console.log(error.responseText);
               WLAuthorizationManager.logout('banorteSecurityCheckSa');

          });
  }

  BxiLogin() {
    console.log("en funcion de bxi");
    $('#ModalBXILogin').modal('show');


  }

  //TODO
includesL(container, value) {
 let returnValue = false;
 let pos = String(container).indexOf(value);

 if (pos >= 0) {
   returnValue = true;
 }
 return returnValue;
}


  getPosts() {
    return this._http.get('http://localhost:8081/sucursappsdevices/pinpad/read')
                            .map(res => res.json());
  }

  tokenOperacion() {
    const this_aux = this;
    const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursApps/resource/tokenOperacion',
      WLResourceRequest.POST);
  resourceRequest.setTimeout(30000);
  resourceRequest
      .send()
      .then(
          function(response) {
              let resp = response.responseJSON;
              console.log(response.responseText);              
              this_aux.onPlasticLoginafterSecurity();
          } ,
          function(error) {
              console.log(error.responseText);
  
          });
  }

  consultaTablaCorpBancosService() {
    const this_aux = this;
    $("#_modal_please_wait").modal("show");
    const resourceRequest = new WLResourceRequest(
      "adapters/AdapterBanorteSucursApps2/resource/consultaMontosMaximos",
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.send().then(
      function(response) {
        console.log(response);
        $("#_modal_please_wait").modal("hide");
      },
      function(error) {
        console.error("El WS respondio incorrectamente");
        $("#_modal_please_wait").modal("hide");
        $("#errorModal").modal("show");
      }
    );
  }


}
