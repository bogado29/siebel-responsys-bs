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
        
    // Get Vouchers data
    var boVouchers = TheApplication().GetBusObject("UA FINS Health Individual Policy");
    var bcVouchers = boVouchers.GetBusComp("FINS Health Individual Policy");
    bcVouchers.ClearToQuery(); 
    bcVouchers.SetSearchSpec("Id", sRowId);
    bcVouchers.ExecuteQuery(ForwardOnly);
    
    // Validate if get a record
    if (!bcVouchers.FirstRecord()) {
      Outputs.SetProperty("Response", null);
      Outputs.SetProperty("ErrorCode", 04);
      Outputs.SetProperty("ErrorMessagge", "Failed to retrieve records on ROW_ID");
      TheApplication().RaiseErrorText("Failed to retrieve records on ROW_ID");
    }
    
    bcVouchers.ActivateField("Policy Number");
    bcVouchers.ActivateField("UA Indicador Cliente");
    bcVouchers.ActivateField("Primary Organization Id");
    bcVouchers.ActivateField("Status");
    bcVouchers.ActivateField("UA Motivo baja");
    bcVouchers.ActivateField("Organization");
    bcVouchers.ActivateField("UA Convenios");
    bcVouchers.ActivateField("UA Sponsor Venta");
    bcVouchers.ActivateField("UA Contrato Name");
    bcVouchers.ActivateField("UA Lead Num");
    bcVouchers.ActivateField("UA Referido");
    bcVouchers.ActivateField("UA Tipo Venta Voucher");
    bcVouchers.ActivateField("UA Tipo Org");
    bcVouchers.ActivateField("UA Prim Org Country");
    bcVouchers.ActivateField("UA Created");
    bcVouchers.ActivateField("Total Premium Exchange Date");
    bcVouchers.ActivateField("UA Canal Venta Org");
    bcVouchers.ActivateField("Rate State");
    bcVouchers.ActivateField("Prim Con  Id");
    bcVouchers.ActivateField("Owner");
    bcVouchers.ActivateField("UA Tipo Cuenta");
    bcVouchers.ActivateField("UA Default Telefono contacto");
    bcVouchers.ActivateField("Sub Status");
    bcVouchers.ActivateField("UA Cant Solicitantes Display");
    bcVouchers.ActivateField("Line Of Business");
    bcVouchers.ActivateField("UA Dias");
    bcVouchers.ActivateField("End Date");
    bcVouchers.ActivateField("Effective Date");
    bcVouchers.ActivateField("Full Name");    
    
    // Get Vouchers Product Data
    var bcProduct = boVouchers.GetBusComp("FINS Enrolled Product");
    bcProduct.ClearToQuery(); 
    bcProduct.SetSearchSpec("Asset Id", sRowId);
    bcProduct.ExecuteQuery(ForwardOnly);
    
    // Validate if get a record
    if (!bcProduct.FirstRecord()) {
      Outputs.SetProperty("Response", null);
      Outputs.SetProperty("ErrorCode", 04);
      Outputs.SetProperty("ErrorMessagge", "Failed to retrieve records on ROW_ID - bcProduct");
      TheApplication().RaiseErrorText("Failed to retrieve records on ROW_ID - bcProduct");
    }else {
      bcProduct.ActivateField("UA Denominación");
      bcProduct.ActivateField("Product Name");  
    }

    // Get Vouchers Contact Data
    var bcPolicyContact = boVouchers.GetBusComp("FINS Health Individual Policy Contacts");
    bcPolicyContact.ClearToQuery(); 
    bcPolicyContact.SetSearchSpec("Id", bcVouchers.GetFieldValue("Prim Con  Id"));
    bcPolicyContact.ExecuteQuery(ForwardOnly);
    
    // Validate if get a record
    if (!bcPolicyContact.FirstRecord()) {
      Outputs.SetProperty("Response", null);
      Outputs.SetProperty("ErrorCode", 04);
      Outputs.SetProperty("ErrorMessagge", "Failed to retrieve records on ROW_ID - bcPolicyContact");
      TheApplication().RaiseErrorText("Failed to retrieve records on ROW_ID - bcPolicyContact");
    }else {
      bcPolicyContact.ActivateField("UA Tipo documento");
      bcPolicyContact.ActivateField("Last Name");
      bcPolicyContact.ActivateField("Email Address");
      bcPolicyContact.ActivateField("UA Numero documento");
      bcPolicyContact.ActivateField("Age");
      bcPolicyContact.ActivateField("First Name");
    }

    aInterface[0].value = bcVouchers.GetFieldValue("Policy Number");
    aInterface[1].value = bcVouchers.GetFieldValue("Full Name");
    aInterface[2].value = bcVouchers.GetFieldValue("Effective Date");
    aInterface[3].value = bcVouchers.GetFieldValue("Total Premium Exchange Date");
    aInterface[4].value = bcVouchers.GetFieldValue("End Date");
    aInterface[5].value = bcVouchers.GetFieldValue("UA Dias");
    aInterface[6].value = bcVouchers.GetFieldValue("Line Of Business");
    aInterface[7].value = bcVouchers.GetFieldValue("UA Cant Solicitantes Display");
    aInterface[8].value = bcVouchers.GetFieldValue("Rate State");
    aInterface[9].value = bcVouchers.GetFieldValue("UA Tipo Venta Voucher");
    aInterface[10].value = bcVouchers.GetFieldValue("Status");
    aInterface[11].value = bcVouchers.GetFieldValue("UA Indicador Cliente");
    aInterface[12].value = bcVouchers.GetFieldValue("UA Motivo baja");
    aInterface[13].value = bcVouchers.GetFieldValue("Organization");
    aInterface[14].value = bcVouchers.GetFieldValue("UA Convenios");
    aInterface[15].value = bcVouchers.GetFieldValue("UA Sponsor Venta");
    aInterface[16].value = bcVouchers.GetFieldValue("UA Contrato Name");
    aInterface[17].value = bcVouchers.GetFieldValue("UA Referido");
    aInterface[18].value = bcVouchers.GetFieldValue("UA Lead Num");
    aInterface[19].value = bcVouchers.GetFieldValue("UA Canal Venta Org");
    aInterface[20].value = bcPolicyContact.GetFieldValue("Age");
    aInterface[21].value = bcVouchers.GetFieldValue("Owner");
    aInterface[22].value = bcVouchers.GetFieldValue("UA Tipo Cuenta");
    aInterface[23].value = bcPolicyContact.GetFieldValue("Last Name");
    aInterface[24].value = bcPolicyContact.GetFieldValue("First Name");
    aInterface[25].value = bcPolicyContact.GetFieldValue("UA Tipo documento");
    aInterface[26].value = bcPolicyContact.GetFieldValue("UA Numero documento");
    aInterface[27].value = bcPolicyContact.GetFieldValue("Email Addres");
    aInterface[28].value = bcVouchers.GetFieldValue("UA Created");
    aInterface[29].value = bcPolicyContact.GetFieldValue("UA Tipo documento") + bcPolicyContact.GetFieldValue("UA Numero documento");
    aInterface[30].value = bcVouchers.GetFieldValue("UA Default Telefono contacto");
    aInterface[31].value = bcVouchers.GetFieldValue("Sub Status");
    aInterface[32].value = bcProduct.GetFieldValue("UA Denominación");
    aInterface[33].value = bcProduct.GetFieldValue("Product Name");

    // Generate Json responsys columns
    for ( var i = 0; i < getArrayLength(aInterface); i++ ) {
      if (aInterface[i].value == "" ) {
        continue;
      }  
      
      if (i != (getArrayLength(aInterface)-1)) {
          sRequest = sRequest + sLeftFiller + aInterface[i].jsonElement + sRightFiller;
        }else {
          // On last element
          sRequest = sRequest + sLeftFiller + aInterface[i].jsonElement + '\"';
        }
    }

    // Delete undesired ','
    if (sRequest.charAt(sRequest.length - 1) == ',') {
      sRequest = sRequest.substring(0, sRequest.length - 1);
    }

    // Add JSON middle filler 
    sRequest = sRequest + '],' + '\"records\":[['; 
    
    // Generate Json responsys data
    for ( i = 0; i < getArrayLength(aInterface); i++ ) {
            
      if (aInterface[i].value == "" ) {
        continue;
      }  

      if (i != (getArrayLength(aInterface)-1)) {
        
          if (aInterface[i].type == "number") {
            // If element type is number dont wrap with "" the value.
            sRequest = sRequest + aInterface[i].value + ',';
          } else {
            sRequest = sRequest + sLeftFiller + aInterface[i].value + sRightFiller;
          }
      }else {
          if (aInterface[i].type == "number") {
            // If element type is number dont wrap with "" the value.
            sRequest = sRequest + aInterface[i].value ;
          } else {
          // On last element
          sRequest = sRequest + sLeftFiller + aInterface[i].value + '\"';
          }
      }
    }

    // Delete undesired ','
    if (sRequest.charAt(sRequest.length - 1) == ',') {
      sRequest = sRequest.substring(0, sRequest.length - 1);
    }

    // Add JSON end filler
    sRequest = sRequest + ']],' +
    '\"mapTemplateName\":null},' +
    '\"insertOnNoMatch\":true,' +
    '\"updateOnMatch\":\"REPLACE_ALL\"}';
      
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

    // Update Flag / Status
    UpdateStatus("UA FINS Health Individual Policy","FINS Health Individual Policy",sRowId,"UA Estado Responsys","OK - Updated");

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
