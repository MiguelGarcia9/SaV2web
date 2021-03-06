export class OperacionesBXI {

    getSaldo(numCuenta_seleccionada): any {

        const formParameters1 = {
            numCuenta : numCuenta_seleccionada
          };
          const resourceRequest1 = new WLResourceRequest(
            'adapters/AdapterBanorteSucursAppsBEL/resource/getSaldoCuenta', WLResourceRequest.POST);
            resourceRequest1.setTimeout(30000);

            return resourceRequest1.sendFormParameters(formParameters1);

    }

    getSaldoTDC(numCuenta_seleccionada): any {

        const formParameters1 = {
                cuenta: numCuenta_seleccionada
          };
          const resourceRequest1 = new WLResourceRequest(
            'adapters/AdapterBanorteSucursAppsBEL2/resource/consultaSaldosTarjetas', WLResourceRequest.POST);
            resourceRequest1.setTimeout(30000);

            return resourceRequest1.sendFormParameters(formParameters1);

    }

    consultaClabeSaldo(): any {

        console.log("adentro cnsultaCuentas");

        let tipoMovimiento = "1";
        let numeroCuenta = "0665815063";

        const THIS: any = this;

        const formParameters = {
            tipoMovimiento:  tipoMovimiento,
            numeroCuenta: numeroCuenta

        };

        const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursAppsBEL/resource/consultaClabeSaldo',
            WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
        resourceRequest
            .sendFormParameters(formParameters);

            return resourceRequest.sendFormParameters(formParameters);

    }

    consultaEmpresas() {

    const formParameters = { };
    const resourceRequest = new WLResourceRequest(
        'adapters/AdapterBanorteSucursAppsBEL/resource/getEmpresas', WLResourceRequest.POST);
       resourceRequest.setTimeout(30000);

       return resourceRequest.sendFormParameters(formParameters);
    }

    consultaDetalleEmpresa(idFacturador): any {

        const formParameters = {
            empresaSeleccionada: idFacturador
          };

          const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursAppsBEL/resource/getDetalleEmpresa', WLResourceRequest.POST);
          resourceRequest.setTimeout(30000);

         return  resourceRequest.sendFormParameters(formParameters);
    }

    pagaServicio(idFacturador, montoAPagar, referencia, cuentaCargo, fechaVencimiento): any {
        const formParameters = {
            idFacturador: idFacturador,
            montoAPagar: montoAPagar,
            referencia: referencia,
            cuentaCargo: cuentaCargo,
            fechaVencimiento: fechaVencimiento
          };
          let resourceRequest;
          if (idFacturador === '1310' || idFacturador === '88924') {
             resourceRequest = new WLResourceRequest(
                'adapters/AdapterBanorteSucursAppsBEL2/resource/pagoDisposicionCredito', WLResourceRequest.POST);
          } else {
             resourceRequest = new WLResourceRequest(
                'adapters/AdapterBanorteSucursAppsBEL2/resource/pagoConcentracionEmpresarial', WLResourceRequest.POST);
          }
          resourceRequest.setTimeout(30000);

          return resourceRequest.sendFormParameters(formParameters);
    }

    getCatEmpresas(): any {


        const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursAppsBEL2/resource/consultaCatalogoEmpresaTel',
            WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);

           return resourceRequest.send();
    }

    getSaldoCompany(id): any {


        const formParameters = {

            IdCatEmpresa: id

          };

          const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursAppsBEL2/resource/consultaImporteTiempoAire', WLResourceRequest.POST);
           resourceRequest.setTimeout(30000);

           return resourceRequest.sendFormParameters(formParameters);

      }

      compraTA(ctaO, cveTelefonica, numTel, importeTel): any {

       let formParameters = {
           ctaO: ctaO,
           cveTelefonica: cveTelefonica,
           numTel: numTel,
           importeTel:  importeTel
         };


         const resourceRequest = new WLResourceRequest(
           'adapters/AdapterBanorteSucursAppsBEL2/resource/compraTiempoAire', WLResourceRequest.POST);
          resourceRequest.setTimeout(30000);

      return resourceRequest.sendFormParameters(formParameters);
     }

     confirmaTransferSPEI(ctaO, ctaDest, sic, bancoRecep, clabe,
                          nombreBene, ref, importe, descripcion, correo,
                          rfcEmi, aliasCta): any {


         let formParameters = {
           ctaO: ctaO,
           ctaDest: ctaDest,
           sic: sic,
           bancoRecep:  bancoRecep,
           clabe: clabe,
           nombreBene: nombreBene,
           ref: ref,
           importe: importe,
           descripcion: descripcion,
           correo: correo,
           rfcEmi: rfcEmi,
           aliasCta: aliasCta
         };

               const resourceRequest = new WLResourceRequest(
                 'adapters/AdapterBanorteSucursAppsBEL/resource/transferInterSPEI', WLResourceRequest.POST);
                resourceRequest.setTimeout(30000);

            return resourceRequest.sendFormParameters(formParameters);


       }

       confirmaTransferTEF(sic, aliasCtaOrigen, cuentaCargo ,
                           rfcOrdenante, bancReceptor, aliasCuentaDestino,
                           clabe, nombreUsuario, importe, descripcion, referencia): any {


           let formParameters = {
               sic: sic,
               aliasCtaOrigen: aliasCtaOrigen,
               cuentaCargo: cuentaCargo,
               rfcOrdenante:  rfcOrdenante,
               bancReceptor: bancReceptor,
               aliasCuentaDestino: aliasCuentaDestino,
               clabe: clabe,
               nombreUsuario: nombreUsuario,
               importe: importe,
               descripcion: descripcion,
               referencia: referencia
           };


                 const resourceRequest = new WLResourceRequest(
                     'adapters/AdapterBanorteSucursAppsBEL/resource/transferInterTEF', WLResourceRequest.POST);
                    resourceRequest.setTimeout(30000);


              return resourceRequest.sendFormParameters(formParameters);

         }

         confirmaTransferQUICK(ctaO, ctaDest, sic, bancoRecep, //clabe,
             nombreBene, ref, importe, descripcion, correo,
             rfcEmi): any {


             let formParameters = {
             ctaO: ctaO,
             ctaDest: ctaDest,
             sic: sic,
             bancoRecep:  bancoRecep,
             //clabe: clabe,
             nombreBene: nombreBene,
             ref: ref,
             importe: importe,
             descripcion: descripcion,
             correo: correo,
             rfcEmi: rfcEmi
             };

             const resourceRequest = new WLResourceRequest(
             'adapters/AdapterBanorteSucursAppsBEL/resource/transferInterQUICK', WLResourceRequest.POST);
             resourceRequest.setTimeout(30000);

             return resourceRequest.sendFormParameters(formParameters);


         }


         confirmaTransferPropTerBanorte(cveCliente, paramEmailBeneficiario, paramMnsEmail,
             paramAliasCuentaOrigen, paramNumeroCuentaCargo,
             paramCuentaAbono, paramImporte, conceptoDePago, paramNombreUsuario): any {


             let formParameters = {
                 cveCliente: cveCliente,
                 paramEmailBeneficiario: paramEmailBeneficiario,
                 paramMnsEmail: paramMnsEmail,
                 paramAliasCuentaOrigen:  paramAliasCuentaOrigen,
                 paramNumeroCuentaCargo: paramNumeroCuentaCargo,
                 paramCuentaAbono: paramCuentaAbono,
                 paramImporte: paramImporte,
                 conceptoDePago: conceptoDePago,
                 paramNombreUsuario: paramNombreUsuario
             };

             const resourceRequest = new WLResourceRequest(
             'adapters/AdapterBanorteSucursAppsBEL/resource/transferPropTercBanorte', WLResourceRequest.POST);
             resourceRequest.setTimeout(30000);

             return resourceRequest.sendFormParameters(formParameters);


         }

    consultaCuentasBeneficiarios(usuarioBXI) {

        const formParameters = {
            usuario : usuarioBXI
          };

        const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursAppsBEL2/resource/getCuentasBeneficiarios',
            WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
        resourceRequest
            .sendFormParameters(formParameters);


         return resourceRequest.sendFormParameters(formParameters);
    }

    pagoTarjetaCredito(tipoTarjeta, montoAPagar, cuentaAbono, cuentaCargo): any {
        const formParameters = {
            tipoTarjeta: tipoTarjeta,
            montoAPagar: montoAPagar,
            cuentaAbono: cuentaAbono,
            cuentaCargo: cuentaCargo,
          };

         const    resourceRequest = new WLResourceRequest(
                'adapters/AdapterBanorteSucursAppsBEL2/resource/pagoTarjetaCredito', WLResourceRequest.POST);
          resourceRequest.setTimeout(30000);

          return resourceRequest.sendFormParameters(formParameters);
    }

    mantieneAlertas(opc , sic, I , TDD , TDC, numeroCuenta) {
        const formParameters = {
            opc: opc,
            sic: sic,
            I: I,
            TDD: TDD,
            TDC: TDC,
            numeroCuenta: numeroCuenta
          };

          const    resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursAppsBEL2/resource/consultaServicioAlertas', WLResourceRequest.POST);
      resourceRequest.setTimeout(30000);

      return resourceRequest.sendFormParameters(formParameters);
    }

    consultaDatosContacto(sic) {

        const formParameters = {
            sic: sic,
          };

          const    resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursAppsBEL2/resource/consultaDatosContacto', WLResourceRequest.POST);
      resourceRequest.setTimeout(30000);

      return resourceRequest.sendFormParameters(formParameters);
    }

    actualizaDatosContacto(sic, correo, celular) {

        const formParameters = {
            sic: sic,
            correo: correo,
            celular: celular
          };

          const    resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursAppsBEL2/resource/actualizaDatosContacto', WLResourceRequest.POST);
      resourceRequest.setTimeout(30000);

      return resourceRequest.sendFormParameters(formParameters);
    }

    altaServicioAlertas(opc , sic, I , TDD , TDC, numeroCuenta, servicio) {
        const formParameters = {
            opc: opc,
            sic: sic,
            I: I,
            TDD: TDD,
            TDC: TDC,
            numeroCuenta: numeroCuenta,
            servicio: servicio
          };

          const    resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursAppsBEL2/resource/altaServicioAlertas', WLResourceRequest.POST);
      resourceRequest.setTimeout(30000);

      return resourceRequest.sendFormParameters(formParameters);
    }


    consultaMovimientos (cuenta, fechaDesde, fechaHasta, Comision, Pagina, numeroRegistros) {

        const formParameters = {
            cuenta: cuenta,
            fechaDesde: fechaDesde,
            fechaHasta: fechaHasta,
            Comision: Comision,
            Pagina: Pagina,
            numeroRegistros: numeroRegistros,
          };

         const    resourceRequest = new WLResourceRequest(
                'adapters/AdapterBanorteSucursAppsBEL/resource/consultaMovimientos', WLResourceRequest.POST);
          resourceRequest.setTimeout(30000);

          return resourceRequest.sendFormParameters(formParameters);
    }

    mantEDC(ctaO): any {
       const formParameters = {
           ctaO: ctaO
       };

       const    resourceRequest = new WLResourceRequest(
           'adapters/AdapterBanorteSucursAppsBEL2/resource/mantenimientoEDC', WLResourceRequest.POST);
     resourceRequest.setTimeout(30000);

     return resourceRequest.sendFormParameters(formParameters);
   }

   getListaDocumentos(documeto): any {

    const formParameters = {
        documeto: documeto
    };
       const resourceRequest = new WLResourceRequest(
           'adapters/AdapterBanorteSucursAppsBEL2/resource/listaDocs',
           WLResourceRequest.POST);
       resourceRequest.setTimeout(30000);

          return resourceRequest.sendFormParameters(formParameters);
   }

   preparaAutenticacion () {

     const    resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursAppsBEL/resource/preparaAutenticacion', WLResourceRequest.POST);
      resourceRequest.setTimeout(30000);

      return resourceRequest.send();
    }

    cerrarSesionBEL() {
        const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursAppsBEL/resource/cerrarSession',
            WLResourceRequest.POST);
           resourceRequest.setTimeout(30000);

            return resourceRequest.send();
        }

        getDocumento(fechaCorte, idDocumento, id): any {
            const formParameters = {
                fechaCorte: fechaCorte,
                idDocumento: idDocumento,
                id: id
            };

            const    resourceRequest = new WLResourceRequest(
                'adapters/AdapterBanorteSucursAppsBEL2/resource/obtenerDoc', WLResourceRequest.POST);
          resourceRequest.setTimeout(100000);

          return resourceRequest.sendFormParameters(formParameters);
        }

        mantenimientoCancelacionEDC (opcion, solicitud, cuenta) {
            const formParameters = {
                opcion: opcion,
                solicitud: solicitud,
                cuenta: cuenta
            };

            const    resourceRequest = new WLResourceRequest(
                'adapters/AdapterBanorteSucursAppsBEL2/resource/mantoCancelacionEnvioEDC', WLResourceRequest.POST);
          resourceRequest.setTimeout(30000);

          return resourceRequest.sendFormParameters(formParameters);
        }

        envioEDC(fechaCorte, idDocumento, psw, correo, id, nombre): any {
            const formParameters = {
                fechaCorte: fechaCorte,
                idDocumento: idDocumento,
                psw: psw,
                correo: correo,
                id: id,
                nombre: nombre
            };

            const    resourceRequest = new WLResourceRequest(
                'adapters/AdapterBanorteSucursAppsBEL/resource/envioDoc', WLResourceRequest.POST);
          resourceRequest.setTimeout(100000);

          return resourceRequest.sendFormParameters(formParameters);

        }

        // tslint:disable-next-line:indent
	consultaBancos() {

            const resourceRequest = new WLResourceRequest(
                "adapters/AdapterBanorteSucursAppsBEL2/resource/consultaTablaCorporativaBancos",
                WLResourceRequest.POST);

                resourceRequest.setTimeout(30000);
                return resourceRequest.send();
        }

    consultaTablaYValidaSaldo(cuenta, importe) {
        const formParameters = {
            cuenta: cuenta,
            importe: importe
        };
      const resourceRequest = new WLResourceRequest(
        "adapters/AdapterBanorteSucursAppsBEL2/resource/consultaMontosMaximos",
        WLResourceRequest.POST
      );
      resourceRequest.setTimeout(30000);
      return resourceRequest.sendFormParameters(formParameters);
    }

    mascaraNumeroCuenta(numCtaSel) {

        const tamNumCta = numCtaSel.length;
        const numCta_aux = numCtaSel.substring(tamNumCta - 4, tamNumCta);
        const numCuenta_show = '******' + numCta_aux;

        return numCuenta_show;
    }

    mascaraNumeroTarjeta(numCtaSel) {

        const tamNumCta = numCtaSel.length;
        const numCta_aux = numCtaSel.substring(tamNumCta - 4, tamNumCta);
        const numCuenta_show = '************' + numCta_aux;

        return numCuenta_show;
    }


}
