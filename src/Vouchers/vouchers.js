function Vouchers(Inputs, Outputs) {
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

    // Responsys List Name
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

    // Field Parameters
    var sNroVoucher: chars = Inputs.GetProperty("NroVoucher");
    var sPrincipal: chars = Inputs.GetProperty("Principal");
    var sFechaVigencia: chars = Inputs.GetProperty("FechaVigencia");
    var sFechaEmision: chars = Inputs.GetProperty("FechaEmision");
    var sFechaFinal: chars = Inputs.GetProperty("FechaFinal");
    var sDiasVoucher: chars = Inputs.GetProperty("DiasVoucher");
    var sLinea: chars = Inputs.GetProperty("Linea");
    var sCantSolicitantes: chars = Inputs.GetProperty("CantSolicitantes");
    var sDestino: chars = Inputs.GetProperty("Destino");
    var sTipoVenta: chars = Inputs.GetProperty("TipoVenta");
    var sEstado: chars = Inputs.GetProperty("TipoVenta");
    var sIndicadorCliente: chars = Inputs.GetProperty("IndicadorCliente");
    var sMotivoBajaVoucher: chars = Inputs.GetProperty("MotivoBajaVoucher");
    var sOrganizacionEmisora: chars = Inputs.GetProperty("OrganizacionEmisora");
    var sConvenio: chars = Inputs.GetProperty("Convenio");
    var sSponsorCorpoVoucher: chars = Inputs.GetProperty("SponsorCorpoVoucher");
    var sContrato: chars = Inputs.GetProperty("Contrato");
    var sReferido: chars = Inputs.GetProperty("Referido");
    var sNroLead: chars = Inputs.GetProperty("NroLead");
    var sCanalDeVenta: chars = Inputs.GetProperty("CanalDeVenta");
    var sEdad: chars = Inputs.GetProperty("Edad");
    var sVendedor: chars = Inputs.GetProperty("Vendedor");
    var sTipoCuenta: chars = Inputs.GetProperty("TipoCuenta");
    var sApellidoPasajero: chars = Inputs.GetProperty("ApellidoPasajero");
    var sNombrePasajero: chars = Inputs.GetProperty("NombrePasajero");
    var sTipoDocumento: chars = Inputs.GetProperty("TipoDocumento");
    var sNroDocumento: chars = Inputs.GetProperty("NroDocumento");
    var sEmailAddress: chars = Inputs.GetProperty("EmailAddress");
    var sFechaCreacionSiebel: chars = Inputs.GetProperty("FechaCreacionSiebel");
    var sCustomerID: chars = Inputs.GetProperty("CustomerID");
    var sTelefonoContacto: chars = Inputs.GetProperty("TelefonoContacto");
    var sMotivo: chars = Inputs.GetProperty("Motivo");
    var sProductoDenominacion: chars = Inputs.GetProperty(
      "ProductoDenominacion"
    );
    var sProductoNombre: chars = Inputs.GetProperty("ProductoNombre");

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

    // Build request Body
    var sRequest =
      '{"recordData": ' +
      '{"fieldNames":' +
      "[" +
      '"QA_NRO_VOUCHER",' +
      '"QA_PRINCIPAL",' +
      '"QA_FECHA_VIGENCIA",' +
      '"QA_FECHA_EMISION",' +
      '"QA_FECHA_FINAL",' +
      '"QA_DIAS_VOUCHER",' +
      '"QA_LINEA",' +
      '"QA_CANT_SOLICITANTES",' +
      '"QA_DESTINO",' +
      '"QA_TIPO_VENTA",' +
      '"QA_ESTADO",' +
      '"QA_INDICADOR_CLIENTE",' +
      '"QA_MOTIVO_BAJA_VOUCHER",' +
      '"QA_ORGANIZACION_EMISORA",' +
      '"QA_CONVENIO",' +
      '"QA_SPONSOR_CORPO_VOUCHER",' +
      '"QA_CONTRATO",' +
      '"QA_REFERIDO",' +
      '"QA_NRO_LEAD",' +
      '"QA_CANAL_DE_VENTA",' +
      '"QA_EDAD",' +
      '"QA_VENDEDOR",' +
      '"QA_TIPO_CUENTA",' +
      '"QA_APELLIDO_PASAJERO",' +
      '"QA_NOMBRE_PASAJERO",' +
      '"QA_TIPO_DOCUMENTO",' +
      '"QA_NRO_DOCUMENTO",' +
      '"EMAIL_ADDRESS_",' +
      '"QA_FECHA_CREACION_SIEBEL",' +
      '"CUSTOMER_ID",' +
      '"QA_TELEFONO_CONTACTO",' +
      '"QA_MOTIVO",' +
      '"QA_PRODUCTO_DENOMINACION",' +
      '"QA_PRODUCTO_NOMBRE"' +
      "]," +
      '"records":[' +
      "[" +
      '"' +
      sNroVoucher +
      '",' +
      '"' +
      sPrincipal +
      '",' +
      '"' +
      sFechaVigencia +
      '",' +
      '"' +
      sFechaEmision +
      '",' +
      '"' +
      sFechaFinal +
      '",' +
      '"' +
      sDiasVoucher +
      '",' +
      '"' +
      sLinea +
      '",' +
      '"' +
      sCantSolicitantes +
      '",' +
      '"' +
      sDestino +
      '",' +
      '"' +
      sTipoVenta +
      '",' +
      '"' +
      sEstado +
      '",' +
      '"' +
      sIndicadorCliente +
      '",' +
      '"' +
      sMotivoBajaVoucher +
      '",' +
      '"' +
      sOrganizacionEmisora +
      '",' +
      '"' +
      sConvenio +
      '",' +
      '"' +
      sSponsorCorpoVoucher +
      '",' +
      '"' +
      sContrato +
      '",' +
      '"' +
      sReferido +
      '",' +
      '"' +
      sNroLead +
      '",' +
      '"' +
      sCanalDeVenta +
      '",' +
      '"' +
      sEdad +
      '",' +
      '"' +
      sVendedor +
      '",' +
      '"' +
      sTipoCuenta +
      '",' +
      '"' +
      sApellidoPasajero +
      '",' +
      '"' +
      sNombrePasajero +
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
      sFechaCreacionSiebel +
      '",' +
      '"' +
      sCustomerID +
      '",' +
      '"' +
      sTelefonoContacto +
      '",' +
      '"' +
      sMotivo +
      '",' +
      '"' +
      sProductoDenominacion +
      '",' +
      '"' +
      sProductoNombre +
      '"]' +
      "]," +
      '"mapTemplateName":null},' +
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
    var smsgText = "";

    //Get Response
    var cmdArray = sResponse.split('"');
    for (var i = 0; i < cmdArray.length; i++)
      smsgText = smsgText + cmdArray[i] + "\n";

    // Returns Request and Response only if Debug mode in enable.
    if (sDebugMode == "Y") {
      Outputs.SetProperty("Request", sRequest);
      Outputs.SetProperty("Response", smsgText);
    }

    Outputs.SetProperty("ErrorCode", 00);
    Outputs.SetProperty("ErrorMessagge", "Success");
  } catch (e) {
    Outputs.SetProperty("Response", e.toString());
    Outputs.SetProperty("ErrorCode", 99);
    Outputs.SetProperty("ErrorMessagge", "Unhandled error");
    TheApplication().RaiseErrorText(
      "Business Service Outputs: " + Outputs + " Errors " + e.toString()
    );
  } finally {
    sNroVoucher = "";
    sPrincipal = "";
    sFechaVigencia = "";
    sFechaEmision = "";
    sFechaFinal = "";
    sDiasVoucher = "";
    sLinea = "";
    sCantSolicitantes = "";
    sDestino = "";
    sTipoVenta = "";
    sEstado = "";
    sIndicadorCliente = "";
    sMotivoBajaVoucher = "";
    sOrganizacionEmisora = "";
    sConvenio = "";
    sSponsorCorpoVoucher = "";
    sContrato = "";
    sReferido = "";
    sNroLead = "";
    sCanalDeVenta = "";
    sEdad = "";
    sVendedor = "";
    sTipoCuenta = "";
    sApellidoPasajero = "";
    sNombrePasajero = "";
    sTipoDocumento = "";
    sNroDocumento = "";
    sEmailAddress = "";
    sFechaCreacionSiebel = "";
    sEmailAddress = "";
    sTelefonoContacto = "";
    sMotivo = "";
    sProductoDenominacion = "";
    sProductoNombre = "";

    sFolderName = "";
    sListName = "";
    sURL = "";
    sRequest = "";
    sAuthToken = "";
    smsgText = "";
    sDebugMode = "";
  }
}
