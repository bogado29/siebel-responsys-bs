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
        sScopeCust = "";
        break;
      case "QA":
        sScope = "QA_";
        sScopeCust = "Q";
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

    // Build request Body
    var sRequest = '{"recordData": ' + '{"fieldNames":[';
    var sLeftFiller = '"';
    var sRightFiller = '",';
    var aInterface = new Array();
    aInterface[0] = new Element(sScope + "NRO_SOLICITUD", "NroSolicitud", "", "string");
    aInterface[1] = new Element(sScope + "USUARIO_CAMBIO_ESTADO", "UsuarioCambioEstado", "", "string");
    aInterface[2] = new Element(sScope + "SUBESTADO_REINTEGRO", "SubestadoReintegro", "", "string");
    aInterface[3] = new Element(sScope + "ESTADO_INFORMAR", "EstadoInformar", "", "string");
    aInterface[4] = new Element(sScope + "ORIGEN_SOLICITUD", "OrigenSolicitud", "", "string");
    aInterface[5] = new Element(sScope + "UNIDAD_OPERATIVA", "UnidadOperativa", "", "string");
    aInterface[6] = new Element(sScope + "MOTIVO_CASO", "MotivoCaso", "", "string");
    aInterface[7] = new Element(sScope + "VOUCHER_COBERTURA_DE_CASO", "VoucherCoberturaDeCaso", "", "string");
    aInterface[8] = new Element(sScope + "N_DE_CASO_ASOCIADO", "NDeCasoAsociado", "", "string");
    aInterface[9] = new Element(sScope + "CLIENTE_CASO_ASOCIADO", "ClienteCasoAsociado", "", "string");
    aInterface[10] = new Element(sScopeCust + "ORGANIZACION_EMISORA_DEL_CASO", "OrganizacionDelCaso", "", "string");
    aInterface[11] = new Element(sScope + "EMAIL_REINTEGRO", "EmailReintegro", "", "string");
    aInterface[12] = new Element(sScope + "N_PRESTACION_PRINCIPAL", "NPrestacionPrincipal", "", "string");
    aInterface[13] = new Element(sScope + "NOMENCLADOR", "Nomenclador", "", "string");
    aInterface[14] = new Element(sScope + "PAGADO_REINTEGRO", "PagadoReintegro", "", "string");
    aInterface[15] = new Element(sScope + "FECHA_DE_PAGO", "FechaDePago", "", "string");
    aInterface[16] = new Element(sScope + "DIAS_AUDITORIA_PAGO", "DiasAuditoriaPago", "", "string");
    aInterface[17] = new Element(sScope + "CONFIRMACION_PAGO", "ConfirmacionPago", "", "string");
    aInterface[18] = new Element(sScope + "ESTADO", "Estado", "", "string");
    aInterface[19] = new Element(sScope + "FECHA_CREACION_SIEBEL", "FechaCreacionSiebel", "", "string");
    aInterface[20] = new Element(sScope + "PAIS", "Pais", "", "string");
    aInterface[21] = new Element(sScope + "APELLIDO_PASAJERO", "ApellidoPasajero", "", "string");
    aInterface[22] = new Element(sScope + "NOMBRE_PASAJERO", "NombrePasajero", "", "string");
    aInterface[23] = new Element(sScope + "FECHA_CAMBIO_ESTADO", "FechaCambioEstado", "", "string");
    aInterface[24] = new Element(sScope + "FECHA_AUDITORIA", "FechaAuditoria", "", "string");
    aInterface[25] = new Element(sScope + "AUDITADO_MARCA_FLAG", "AuditadoMarcaFlag", "", "string");
    aInterface[26] = new Element(sScope + "NRO_DE_CASO", "NroDeCaso", "", "string");
    aInterface[27] = new Element(sScope + "MONTO_PRESENTADO", "MontoPresentado", "", "string");
    aInterface[28] = new Element(sScope + "MONTO_AUTORIZADO", "MontoAutorizado", "", "string");
    aInterface[29] = new Element(sScope + "MONTO_RECHAZADO", "MontoRechazado", "", "string");
    aInterface[30] = new Element(sScope + "MONEDA", "Moneda", "", "string");
    aInterface[31] = new Element(sScope + "TIPO_DOCUMENTO", "TipoDocumento", "", "string");
    aInterface[32] = new Element(sScope + "NRO_DOCUMENTO", "NroDocumento", "", "string");
    aInterface[33] = new Element("EMAIL_ADDRESS_", "EmailAddress", "", "string");
    aInterface[34] = new Element("CUSTOMER_ID_", "CustomerID", "", "string");
    aInterface[35] = new Element(sScope + "TELEFONO_CONTACTO", "TelefonoContacto", "", "string");



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
