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
      
    // Build request Body
    var sRequest = '{"recordData": ' + '{"fieldNames":[';
    var sLeftFiller = '"';
    var sRightFiller = '",';
    var aInterface = new Array();
    aInterface[0] = new Element(sScope +"NRO_VOUCHER", "NroVoucher", "", "string");
    aInterface[1] = new Element(sScope +"PRINCIPAL", "Principal", "", "string");
    aInterface[2] = new Element(sScope + "FECHA_VIGENCIA", "FechaVigencia", "", "string");
    aInterface[3] = new Element(sScope + "FECHA_EMISION", "FechaEmision", "", "string");
    aInterface[4] = new Element(sScope + "FECHA_FINAL","FechaFinal","","string");
    aInterface[5] = new Element(sScope + "DIAS_VOUCHER", "DiasVoucher", "", "string");
    aInterface[6] = new Element(sScope + "LINEA","Linea","","string");
    aInterface[7] = new Element(sScope + "CANT_SOLICITANTES","CantSolicitantes","","string");
    aInterface[8] = new Element(sScope + "DESTINO","Destino","","string");
    aInterface[9] = new Element(sScope + "TIPO_VENTA", "TipoVenta", "", "string");
    aInterface[10] = new Element(sScope + "ESTADO", "Estado", "", "string");
    aInterface[11] = new Element(sScope + "INDICADOR_CLIENTE", "IndicadorCliente", "", "string");
    aInterface[12] = new Element(sScope + "MOTIVO_BAJA_VOUCHER", "MotivoBajaVoucher", "", "string");
    aInterface[13] = new Element(sScope + "ORGANIZACION_EMISORA", "OrganizacionEmisora", "", "string");
    aInterface[14] = new Element(sScope + "CONVENIO", "Convenio", "", "string");
    aInterface[15] = new Element(sScope + "SPONSOR_CORPO_VOUCHER", "SponsorCorpoVoucher", "", "string");
    aInterface[16] = new Element(sScope + "CONTRATO", "Contrato", "", "string");
    aInterface[17] = new Element(sScope + "REFERIDO", "Referido", "", "string");
    aInterface[18] = new Element(sScope + "NRO_LEAD", "NroLead", "", "string");
    aInterface[19] = new Element(sScope + "CANAL_DE_VENTA", "CanalDeVenta", "", "string");
    aInterface[20] = new Element(sScope + "EDAD", "Edad", "", "string");
    aInterface[21] = new Element(sScope + "VENDEDOR", "Vendedor", "", "string");
    aInterface[22] = new Element(sScope + "TIPO_CUENTA", "TipoCuenta", "", "string");
    aInterface[23] = new Element(sScope + "APELLIDO_PASAJERO", "ApellidoPasajero", "", "string");
    aInterface[24] = new Element(sScope + "NOMBRE_PASAJERO", "NombrePasajero", "", "string");
    aInterface[25] = new Element(sScope + "TIPO_DOCUMENTO", "TipoDocumento", "", "string");
    aInterface[26] = new Element(sScope + "NRO_DOCUMENTO", "NroDocumento", "", "string");
    aInterface[27] = new Element("EMAIL_ADDRESS_", "EmailAddress", "", "string");
    aInterface[28] = new Element(sScope + "FECHA_CREACION_SIEBEL", "FechaCreacionSiebel", "", "string");
    aInterface[29] = new Element("CUSTOMER_ID_", "CustomerID", "", "string");
    aInterface[30] = new Element(sScope + "TELEFONO_CONTACTO", "TelefonoContacto", "", "string");
    aInterface[31] = new Element(sScope + "MOTIVO", "Motivo", "", "string");
    aInterface[32] = new Element(sScope + "PRODUCTO_DENOMINACION", "ProductoDenominacion", "", "string");
    aInterface[33] = new Element(sScope + "PRODUCTO_NOMBRE", "ProductoNombre", "", "string");
    
    
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
