function Reintegros(Inputs, Outputs) {
  try {
    var EAISiebelAdapter = TheApplication().GetService("EAI HTTP Transport");
    var PsPUTOutputs = TheApplication().NewPropertySet();
    var PsPUTInputs = TheApplication().NewPropertySet();

    // Add Request and Response in the response.
    var sDebugMode: chars = Inputs.GetProperty("DebugMode");

    // Responsys Folder name Input Parameter:
    var sFolderName: chars = Inputs.GetProperty("FolderName");
    if (sFolderName == null) {
      Outputs.SetProperty("Response", null);
      Outputs.SetProperty("ErrorCode", 01 - 1);
      Outputs.SetProperty("ErrorMessagge", "Error geting ListName Value");
      TheApplication().RaiseErrorText("Error geting ListName Value");
    }

    // Responsys ListName name Input Parameter:
    var sListName: chars = Inputs.GetProperty("ListName");
    if (sListName == null) {
      Outputs.SetProperty("Response", null);
      Outputs.SetProperty("ErrorCode", 01);
      Outputs.SetProperty("ErrorMessagge", "Error geting ListName Value");
      TheApplication().RaiseErrorText("Error geting ListName Value");
    }

    // Siebel ROW_ID Input Parameter:
    var sRowId: chars = Inputs.GetProperty("RowId");
    if (sRowId == null) {
      Outputs.SetProperty("Response", null);
      Outputs.SetProperty("ErrorCode", 02);
      Outputs.SetProperty("ErrorMessagge", "Error geting RowId Value");
      TheApplication().RaiseErrorText("Error geting RowId Value");
    }
    
    // Responsys Hostname name LOV Parameter:
    var sHostname = TheApplication().InvokeMethod(
      "LookupValue",
      "UA_RESPONSYS_LOV",
      "HOSTNAME"
    );
    if (sHostname == null) {
      Outputs.SetProperty("Response", null);
      Outputs.SetProperty("ErrorCode", 03);
      Outputs.SetProperty("ErrorMessagge", "Error geting HOSTNAME LOV Value");
      TheApplication().RaiseErrorText("Error geting HOSTNAME LOV Value");
    }

    // Responsys Scope Name LOV Parameter:
    var sScope: chars = TheApplication().InvokeMethod(
      "LookupValue",
      "UA_RESPONSYS_LOV",
      "SCOPE"
    );

    switch (sScope) {
      case null:
        Outputs.SetProperty("Response", null);
        Outputs.SetProperty("ErrorCode", 05);
        Outputs.SetProperty("ErrorMessagge", "Error geting SCOPE LOV Value");
        TheApplication().RaiseErrorText("Error geting SCOPE LOV Value");
        break;
      case "PROD":
        sScope = "";
        break;
      case "QA":
        sScope = "QA_";
        break;
      default:
        Outputs.SetProperty("Response", null);
        Outputs.SetProperty("ErrorCode", 05);
        Outputs.SetProperty("ErrorMessagge", "Error geting SCOPE LOV Value");
        TheApplication().RaiseErrorText("Error geting SCOPE LOV Value");
        break;
    }    

    // Build POST Endpoint
    var sURL =
      "https://" +
      sHostname +
      ".responsys.ocs.oraclecloud.com/rest/api/v1.3/" +
      "folders/" +
      sFolderName +
      "/suppData/" +
      sListName +
      "/members";

      
    // Field Parameters
    var sNroSolicitud: chars = Inputs.GetProperty("NroSolicitud");
    var sUsuarioCambioEstado: chars = Inputs.GetProperty("UsuarioCambioEstado");
    var sSubEstadoReintegro: chars = Inputs.GetProperty("SubEstadoReintegro");
    var sEstadoInformar: chars = Inputs.GetProperty("EstadoInformar");
    var sOrigenSolicitud: chars = Inputs.GetProperty("OrigenSolicitud");
    var sUnidadOperativa: chars = Inputs.GetProperty("UnidadOperativa");
    var sMotivoCaso: chars = Inputs.GetProperty("MotivoCaso");
    var sVoucherCoberturaDeCaso: chars = Inputs.GetProperty(
      "VoucherCoberturaDeCaso"
    );
    var sNDeCasoAsociado: chars = Inputs.GetProperty("NDeCasoAsociado");
    var sClienteCasoAsociado: chars = Inputs.GetProperty("ClienteCasoAsociado");
    var sOrganizacionEmisoraDelCaso: chars = Inputs.GetProperty(
      "OrganizacionEmisoraDelCaso"
    );
    var sEmailReintegro: chars = Inputs.GetProperty("EmailReintegro");
    var sNPrestacionPrincipal: chars = Inputs.GetProperty(
      "NPrestacionPrincipal"
    );
    var sNomenclador: chars = Inputs.GetProperty("Nomenclador");
    var sPagadoReintegro: chars = Inputs.GetProperty("PagadoReintegro");
    var sFechaDePago: chars = Inputs.GetProperty("FechaDePago");
    var sDiasAuditoriaPago: chars = Inputs.GetProperty("DiasAuditoriaPago");
    var sConfirmacionPago: chars = Inputs.GetProperty("ConfirmacionPago");
    var sEstado: chars = Inputs.GetProperty("Estado");
    var sFechaCreacionSiebel: chars = Inputs.GetProperty("FechaCreacionSiebel");
    var sPais: chars = Inputs.GetProperty("Pais");
    var sApellidoPasajero: chars = Inputs.GetProperty("ApellidoPasajero");
    var sNombrePasajero: chars = Inputs.GetProperty("NombrePasajero");
    var sFechaCambioEstado: chars = Inputs.GetProperty("FechaCambioEstado");
    var sFechaAuditoria: chars = Inputs.GetProperty("FechaAuditoria");
    var sAuditadoMarcaFlag: chars = Inputs.GetProperty("AuditadoMarcaFlag");
    var sNroDeCaso: chars = Inputs.GetProperty("NroDeCaso");
    var sMontoPresentado: chars = Inputs.GetProperty("MontoPresentado");
    var sMontoAutorizado: chars = Inputs.GetProperty("MontoAutorizado");
    var sMontoRechazado: chars = Inputs.GetProperty("MontoRechazado");
    var sMoneda: chars = Inputs.GetProperty("Moneda");
    var sTipoDocumento: chars = Inputs.GetProperty("TipoDocumento");
    var sNroDocumento: chars = Inputs.GetProperty("NroDocumento");
    var sEmailAddress: chars = Inputs.GetProperty("EmailAddress");
    var sCustomerId: chars = Inputs.GetProperty("CustomerId");
    var sTelefonoContacto: chars = Inputs.GetProperty("TelefonoContacto");

    // Build request Body
    var sRequest =
      "{" +
      '"recordData": {' +
      '"fieldNames": [' +
      '"QA_NRO_SOLICITUD",' +
      '"QA_USUARIO_CAMBIO_ESTADO",' +
      '"QA_SUBESTADO_REINTEGRO",' +
      '"QA_ESTADO_INFORMAR",' +
      '"QA_ORIGEN_SOLICITUD",' +
      '"QA_UNIDAD_OPERATIVA",' +
      '"QA_MOTIVO_CASO",' +
      '"QA_VOUCHER_COBERTURA_DE_CASO",' +
      '"QA_N_DE_CASO_ASOCIADO",' +
      '"QA_CLIENTE_CASO_ASOCIADO",' +
      '"QORGANIZACION_EMISORA_DEL_CASO",' +
      '"QA_EMAIL_REINTEGRO",' +
      '"QA_N_PRESTACION_PRINCIPAL",' +
      '"QA_NOMENCLADOR",' +
      '"QA_PAGADO_REINTEGRO",' +
      '"QA_FECHA_DE_PAGO",' +
      '"QA_DIAS_AUDITORIA_PAGO",' +
      '"QA_CONFIRMACION_PAGO",' +
      '"QA_ESTADO",' +
      '"QA_FECHA_CREACION_SIEBEL",' +
      '"QA_PAIS",' +
      '"QA_APELLIDO_PASAJERO",' +
      '"QA_NOMBRE_PASAJERO",' +
      '"QA_FECHA_CAMBIO_ESTADO",' +
      '"QA_FECHA_AUDITORIA",' +
      '"QA_AUDITADO_MARCA_FLAG",' +
      '"QA_NRO_DE_CASO",' +
      '"QA_MONTO_PRESENTADO",' +
      '"QA_MONTO_AUTORIZADO",' +
      '"QA_MONTO_RECHAZADO",' +
      '"QA_MONEDA",' +
      '"QA_TIPO_DOCUMENTO",' +
      '"QA_NRO_DOCUMENTO",' +
      '"EMAIL_ADDRESS_",' +
      '"CUSTOMER_ID",' +
      '"QA_TELEFONO_CONTACTO"' +
      "]," +
      '"records": [' +
      "[" +
      '"' +
      sNroSolicitud +
      '",' +
      '"' +
      sUsuarioCambioEstado +
      '",' +
      '"' +
      sSubEstadoReintegro +
      '",' +
      '"' +
      sEstadoInformar +
      '",' +
      '"' +
      sOrigenSolicitud +
      '",' +
      '"' +
      sUnidadOperativa +
      '",' +
      '"' +
      sMotivoCaso +
      '",' +
      '"' +
      sVoucherCoberturaDeCaso +
      '",' +
      '"' +
      sNDeCasoAsociado +
      '",' +
      '"' +
      sClienteCasoAsociado +
      '",' +
      '"' +
      sOrganizacionEmisoraDelCaso +
      '",' +
      '"' +
      sEmailReintegro +
      '",' +
      '"' +
      sNPrestacionPrincipal +
      '",' +
      '"' +
      sNomenclador +
      '",' +
      "" +
      sPagadoReintegro +
      "," +
      '"' +
      sFechaDePago +
      '",' +
      "" +
      sDiasAuditoriaPago +
      "," +
      "" +
      sConfirmacionPago +
      "," +
      '"' +
      sEstado +
      '",' +
      '"' +
      sFechaCreacionSiebel +
      '",' +
      '"' +
      sPais +
      '",' +
      '"' +
      sApellidoPasajero +
      '",' +
      '"' +
      sNombrePasajero +
      '",' +
      '"' +
      sFechaCambioEstado +
      '",' +
      '"' +
      sFechaAuditoria +
      '",' +
      "" +
      sAuditadoMarcaFlag +
      "," +
      '"' +
      sNroDeCaso +
      '",' +
      "" +
      sMontoPresentado +
      "," +
      "" +
      sMontoAutorizado +
      "," +
      "" +
      sMontoRechazado +
      "," +
      '"' +
      sMoneda +
      '",' +
      '"' +
      sTipoDocumento +
      '",' +
      '"' +
      sNroDocumento +
      '",' +
      '"' +
      sEmailAddress +
      '",' +
      '"' +
      sCustomerId +
      '",' +
      '"' +
      sTelefonoContacto +
      '"' +
      "]" +
      "]," +
      '"mapTemplateName": null' +
      "}," +
      '"insertOnNoMatch": true,' +
      '"updateOnMatch": "REPLACE_ALL"' +
      "}";

    Outputs.SetProperty("Request", sRequest);

    // Get authorization token
    var boListOfVal = TheApplication().GetBusObject("List Of Values");
    var bcListOfVal = boListOfVal.GetBusComp("List Of Values");
    bcListOfVal.ClearToQuery();
    bcListOfVal.ActivateField("Description");
    bcListOfVal.SetSearchSpec("Name", "CURRENT_TOKEN");
    bcListOfVal.SetSearchSpec("Type", "UA_RESPONSYS_LOV");
    bcListOfVal.ExecuteQuery();
    if (bcListOfVal.FirstRecord()) {
      var sAuthToken = bcListOfVal.GetFieldValue("Description");
    } else {
      Outputs.SetProperty("Response", null);
      Outputs.SetProperty("ErrorCode", 02);
      Outputs.SetProperty(
        "ErrorMessagge",
        "Cannot get Authorization Token value"
      );
      TheApplication().RaiseErrorText("Error geting HOSTNAME LOV Value");
    }

    // Add headers and body
    PsPUTInputs.SetValue(sRequest);
    PsPUTInputs.SetProperty("HTTPRequestURLTemplate", sURL);
    PsPUTInputs.SetProperty("HTTPRequestMethod", "POST");
    PsPUTInputs.SetProperty("CharSetConversion", "UTF-8");
    PsPUTInputs.SetProperty("HTTPContentType", "application/json");
    PsPUTInputs.SetProperty("HTTPAccept", "*/*");
    PsPUTInputs.SetProperty("HDR.Authorization", sAuthToken);

    // Invoke API
    EAISiebelAdapter.InvokeMethod("SendReceive", PsPUTInputs, PsPUTOutputs);

    //Transcode the JSON response into UTF-8
    var oTransService = TheApplication().GetService("Transcode Service");
    var oTransOutputs = TheApplication().NewPropertySet();
    PsPUTOutputs.SetProperty("ConversionMode", "EncodingToString");
    PsPUTOutputs.SetProperty("TargetEncoding", "UTF-16");
    PsPUTOutputs.SetProperty("SourceEncoding", "UTF-8");
    oTransService.InvokeMethod("Convert", PsPUTOutputs, oTransOutputs);
    var sResponse = oTransOutputs.GetValue().toString();
    var msgText = "";

    //Get Response
    var cmdArray = sResponse.split('"');
    for (var i = 0; i < cmdArray.length; i++)
      msgText = msgText + cmdArray[i] + "\n";

    Outputs.SetProperty("Response", msgText);
    Outputs.SetProperty("ErrorCode", 00);
    Outputs.SetProperty("ErrorMessagge", "Succes");
  } catch (e) {
    Outputs.SetProperty("Response", e.toString());
    Outputs.SetProperty("ErrorCode", 99);
    Outputs.SetProperty("ErrorMessagge", "Unhandled error");
    TheApplication().RaiseErrorText(
      "Business Service: " + Outputs + " Errors " + e.toString()
    );
  } finally {
    sNroSolicitud = "";
    sUsuarioCambioEstado = "";
    sSubEstadoReintegro = "";
    sEstadoInformar = "";
    sOrigenSolicitud = "";
    sUnidadOperativa = "";
    sMotivoCaso = "";
    sVoucherCoberturaDeCaso = "";
    sNDeCasoAsociado = "";
    sClienteCasoAsociado = "";
    sOrganizacionEmisoraDelCaso = "";
    sEmailReintegro = "";
    sNPrestacionPrincipal = "";
    sNomenclador = "";
    sPagadoReintegro = "";
    sFechaDePago = "";
    sDiasAuditoriaPago = "";
    sConfirmacionPago = "";
    sEstado = "";
    sFechaCreacionSiebel = "";
    sPais = "";
    sApellidoPasajero = "";
    sNombrePasajero = "";
    sFechaCambioEstado = "";
    sFechaAuditoria = "";
    sAuditadoMarcaFlag = "";
    sNroDeCaso = "";
    sMontoPresentado = "";
    sMontoAutorizado = "";
    sMontoRechazado = "";
    sMoneda = "";
    sTipoDocumento = "";
    sNroDocumento = "";
    sEmailAddress = "";
    sCustomerId = "";
    sTelefonoContacto = "";

    sFolderName = "";
    sListName = "";
    sURL = "";
    sRequest = "";
    sAuthToken = "";
    msgText = "";
  }
}
