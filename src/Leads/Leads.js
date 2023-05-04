function Leads(Inputs, Outputs) {
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
    var sHostname: chars = TheApplication().InvokeMethod(
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

    // Build POST Endpoint.
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
    aInterface[0] = new Element("CUSTOMER_ID_", "CustomerID", "", "string");
    aInterface[1] = new Element("EMAIL_ADDRESS_", "EmailAddress", "", "string");
    aInterface[2] = new Element(sScope + "NRO_LEAD", "NroDeAfiliado", "", "string");
    aInterface[3] = new Element(sScope + "ESTADO", "Estado", "", "string");
    aInterface[4] = new Element(sScope + "ORGANIZACION_EMISORA","OrganizacionEmisora","","string");
    aInterface[5] = new Element(sScope + "ORIGEN_LEAD", "OrigenLead", "", "string");
    aInterface[6] = new Element(sScope + "SUB_ORIGEN_LEAD","SubOrigenLead","","string");
    aInterface[7] = new Element(sScope + "DETALLE_SUB_ORIGEN","DetalleSubOrigen","","string");
    aInterface[8] = new Element(sScope + "TIPO_VIAJE","DetalleSubOrigen","","string");
    aInterface[9] = new Element(sScope + "ORIGEN_PAIS", "OrigenPais", "", "string");
    aInterface[10] = new Element(sScope + "DESTINO", "Destino", "", "string");
    aInterface[11] = new Element(sScope + "SALIDA", "Salida", "", "string");
    aInterface[12] = new Element(sScope + "REGRESO", "Regreso", "", "string");
    aInterface[13] = new Element(sScope + "DIAS", "Dias", "", "string");
    aInterface[14] = new Element(sScope + "CANTIDAD_PASAJEROS", "CantidadPasajeros", "", "string");
    aInterface[15] = new Element(sScope + "EDAD_PASAJEROS", "EdadPasajeros", "", "string");
    aInterface[16] = new Element(sScope + "CONTRATO", "Contrato", "", "string");
    aInterface[17] = new Element(sScope + "SPONSOR_CORPO_LEAD", "SponsorCorpoLead", "", "string");
    aInterface[18] = new Element(sScope + "CLIENTE_CORPORATIVO", "ClientCorporativo", "", "string");
    aInterface[19] = new Element(sScope + "PRODUCTOS_INTERES", "ProductosInteres", "", "string");
    aInterface[20] = new Element(sScope + "FECHA_COTIZACION", "FechaCotizacion", "", "string");
    aInterface[21] = new Element(sScope + "FECHA_CONVERSION", "FechaConversion", "", "string");
    aInterface[22] = new Element(sScope + "NRO_VOUCHER", "NroVoucher", "", "string");
    aInterface[23] = new Element(sScope + "FECHA_BAJA", "FechaBaja", "", "string");
    aInterface[24] = new Element(sScope + "MOTIVO_BAJA", "MotivoBaja", "", "string");
    aInterface[25] = new Element(sScope + "TEMPL_COTIZACION", "TemplCotizacion", "", "string");
    aInterface[26] = new Element(sScope + "PARENTESCO", "Parentesco", "", "string");
    aInterface[27] = new Element(sScope + "PROPIETARIO", "Propietario", "", "string");
    aInterface[28] = new Element(sScope + "CANAL_VENTA", "CanalVenta", "", "string");
    aInterface[29] = new Element(sScope + "APELLIDO_CONTACTO", "ApellidoContacto", "", "string");
    aInterface[30] = new Element(sScope + "NOMBRE_CONTACTO", "NombreContacto", "", "string");
    aInterface[31] = new Element(sScope + "TELEFONO_CONTACTO", "TelefonoContacto", "", "string");
    aInterface[32] = new Element(sScope + "FECHA_CREACION_SIEBEL", "FechaCreacionSiebel", "", "string");
    
    // Get Leads data
    var boLeads = TheApplication().GetBusObject("Lead");
    var bcLeads = boMembers.GetBusComp("Lead");
    
    bcLeads.ClearToQuery(); 
    bcLeads.SetSearchSpec("Id", sRowId);
    bcLeads.ExecuteQuery(ForwardOnly);

    bcLeads.ActivateField("UA Voucher Num");
    bcLeads.ActivateField("UA Tipo Viaje");
    bcLeads.ActivateField("UA Destino Viaje");
    bcLeads.ActivateField("UA Cant Pasajeros");
    bcLeads.ActivateField("UA Origen Lead");
    bcLeads.ActivateField("UA Dias Viajes");
    bcLeads.ActivateField("UA Sub Origen Lead");
    bcLeads.ActivateField("UA Origen Viaje");
    bcLeads.ActivateField("UA Salida Viaje");
    bcLeads.ActivateField("UA Cliente Corporativo");
    bcLeads.ActivateField("Lead Status");
    bcLeads.ActivateField("Calc Email Address");
    bcLeads.ActivateField("UA Producto");
    bcLeads.ActivateField("UA Organization Name");
    bcLeads.ActivateField("Date Retired");
    bcLeads.ActivateField("UA Sponsor");
    bcLeads.ActivateField("UA Convenio");
    bcLeads.ActivateField("Lead Num");
    bcLeads.ActivateField("UA Detalle Sub Origen");
    bcLeads.ActivateField("Date Converted");
    bcLeads.ActivateField("UA Fecha Cotizacion");
    bcLeads.ActivateField("Retire Reason Code");
    bcLeads.ActivateField("UA TLMK Template Cotization");
    bcLeads.ActivateField("UA Regreso Viaje");
    bcLeads.ActivateField("UA Edad Pax 1");
    bcLeads.ActivateField("UA Tipo de Organizacion");
    bcLeads.ActivateField("UA Pais de la Organizacion");
    bcLeads.ActivateField("UA Created");
    bcLeads.ActivateField("UA Organizacion Id");
    bcLeads.ActivateField("Owner");
    bcLeads.ActivateField("UA Canal Venta");
    bcLeads.ActivateField("Contact Id");
    bcLeads.ActivateField("Contact Last Name");
    bcLeads.ActivateField("Prospect Last Name");
    bcLeads.ActivateField("Calc First Name");
    bcLeads.ActivateField("UA Contact Document Type");
    bcLeads.ActivateField("UA Tipo Doc Prospecto");
    bcLeads.ActivateField("UA Numero Doc Prospecto");
    bcLeads.ActivateField("UA Contact Document Number");



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
      "Business Service Outputs: " + Outputs + " Errors " + e.toString()
    );
  } finally {
    sCustomerID = "";
    sEmailAddress = "";
    sNroLead = "";
    sEstado = "";
    sOrganizacionEmisora = "";
    sOrigenLead = "";
    sSubOrigenLead = "";
    sDetalleSubOrigen = "";
    sTipoViaje = "";
    sDestino = "";
    sSalida = "";
    sRegreso = "";
    sDias = "";
    sCantidadPasajeros = "";
    sEdadPasajeros = "";
    sContrato = "";
    sSponsorCorpoLead = "";
    sClienteCorporativo = "";
    sProductosInteres = "";
    sFechaCotizacion = "";
    sFechaConversion = "";
    sNroVoucher = "";
    sFechaBaja = "";
    sMotivoBaja = "";
    sTempCotizacion = "";
    sParentesco = "";
    sPropietario = "";
    sCanalVenta = "";
    sApellidoContacto = "";
    sNombreContacto = "";
    sTelefonoContacto = "";
    sFechaCreacionSiebel = "";

    sFolderName = "";
    sListName = "";
    sURL = "";
    sRequest = "";
    sAuthToken = "";
    msgText = "";
  }
}

function Element(jsonElement, propName, value, type)
{
   this.jsonElement = jsonElement;
   this.propName = propName;
   this.value = value;
   this.type = type;
}