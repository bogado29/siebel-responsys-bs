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
    aInterface[0] = new Element("CUSTOMER_ID", "CustomerID", "", "string");
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
    var bcLeads = boLeads.GetBusComp("Lead");
    bcLeads.ClearToQuery(); 
    bcLeads.SetSearchSpec("Id", sRowId);
    bcLeads.ExecuteQuery(ForwardOnly);

    // Validate if get a record
    if (!bcLeads.FirstRecord()) {
      Outputs.SetProperty("Response", null);
      Outputs.SetProperty("ErrorCode", 04);
      Outputs.SetProperty("ErrorMessagge", "Failed to retrieve records on ROW_ID");
      TheApplication().RaiseErrorText("Failed to retrieve records on ROW_ID");
    }

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
    bcLeads.ActivateField("UA TLMK Template Cotizacion");
    bcLeads.ActivateField("UA Regreso Viaje");
    bcLeads.ActivateField("UA Edad Pax 1");
    bcLeads.ActivateField("UA Tipo de Organizacion");
    bcLeads.ActivateField("UA Pais de la Organizacion");
    bcLeads.ActivateField("UA Created");
    bcLeads.ActivateField("UA Organizacion Id");
    bcLeads.ActivateField("Owner");
    //bcLeads.ActivateField("UA Canal Venta"); -- Hay un problema con este campo. 
    bcLeads.ActivateField("Contact Id");
    bcLeads.ActivateField("Contact Last Name");
    bcLeads.ActivateField("Prospect Last Name");
    bcLeads.ActivateField("Calc First Name");
    bcLeads.ActivateField("UA Contact Document Type");
    bcLeads.ActivateField("UA Tipo Doc Prospecto");
    bcLeads.ActivateField("UA Numero Doc Prospecto");
    bcLeads.ActivateField("UA Contact Document Number");
    bcLeads.ActivateField("UA Calc Home Phone");
    bcLeads.ActivateField("Calc Mobile Phone");

    // Get Lead Contact data
    var uaParentesco = "";
/*    if (bcLeads.GetFieldValue("Contact Id") != null) {
      var bcLeadContact = boLeads.GetBusComp("UA Lead Contact BC");    
      bcLeadContact.ClearToQuery(); 
      bcLeadContact.SetSearchSpec("Id", bcLeads.GetFieldValue("Contact Id"));
      bcLeadContact.ExecuteQuery(ForwardOnly);
      bcLeadContact.ActivateField("UA Parentesco");
      uaParentesco = bcLeadContact.GetFieldValue("UA Parentesco");
    } */

    aInterface[0].value = bcLeads.GetFieldValue("UA Contact Document Type") + bcLeads.GetFieldValue("UA Contact Document Number");
    aInterface[1].value = bcLeads.GetFieldValue("Calc Email Address");
    aInterface[2].value = bcLeads.GetFieldValue("Lead Num");
    aInterface[3].value = bcLeads.GetFieldValue("Lead Status");
    aInterface[4].value = bcLeads.GetFieldValue("UA Organization Name");
    aInterface[5].value = bcLeads.GetFieldValue("UA Origen Lead");
    aInterface[6].value = bcLeads.GetFieldValue("UA Sub Origen Lead");
    aInterface[7].value = bcLeads.GetFieldValue("UA Detalle Sub Origen");
    aInterface[8].value = bcLeads.GetFieldValue("UA Tipo Viaje");
    aInterface[9].value = bcLeads.GetFieldValue("UA Origen Viaje");
    aInterface[10].value = bcLeads.GetFieldValue("UA Destino Viaje");
    aInterface[11].value = bcLeads.GetFieldValue("UA Salida Viaje");
    aInterface[12].value = bcLeads.GetFieldValue("UA Regreso Viaje");
    aInterface[13].value = bcLeads.GetFieldValue("UA Dias Viajes");
    aInterface[14].value = bcLeads.GetFieldValue("UA Cant Pasajeros");
    aInterface[15].value = bcLeads.GetFieldValue("UA Edad Pax 1");
    aInterface[16].value = bcLeads.GetFieldValue("UA Convenio");
    aInterface[17].value = bcLeads.GetFieldValue("UA Sponsor");
    aInterface[18].value = bcLeads.GetFieldValue("UA Cliente Corporativo");
    aInterface[19].value = bcLeads.GetFieldValue("UA Producto");
    aInterface[20].value = bcLeads.GetFieldValue("UA Fecha Cotizacion");
    aInterface[21].value = bcLeads.GetFieldValue("Date Converted");
    aInterface[22].value = bcLeads.GetFieldValue("UA Voucher Num");
    aInterface[23].value = bcLeads.GetFieldValue("Date Retired");
    aInterface[24].value = bcLeads.GetFieldValue("Retire Reason Code");
    aInterface[25].value = bcLeads.GetFieldValue("UA TLMK Template Cotizacion");
    aInterface[26].value = uaParentesco;
    aInterface[27].value = bcLeads.GetFieldValue("Owner");
    //aInterface[28].value = bcLeads.GetFieldValue("UA Canal Venta");
    aInterface[28].value = "";
    aInterface[29].value = bcLeads.GetFieldValue("Contact Last Name");
    aInterface[30].value = bcLeads.GetFieldValue("Calc First Name");
    aInterface[31].value = bcLeads.GetFieldValue("UA Calc Home Phone");
    aInterface[32].value = bcLeads.GetFieldValue("UA Created");

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
    Outputs.SetProperty("URL", sURL);

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
      TheApplication().RaiseErrorText("Cannot get Authorization Token value");
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

    // Returns Request and Response only if Debug mode in enable.    
    if (sDebugMode == "Y") {
      Outputs.SetProperty("Request", sRequest);
      Outputs.SetProperty("Response", smsgText);        
    }
      
    // Update Flag / Status
    UpdateStatus("Lead","Lead",sRowId,"UA Estado Responsys","OK - Updated");

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
    
  }
}

function Element(jsonElement, propName, value, type)
{
   this.jsonElement = jsonElement;
   this.propName = propName;
   this.value = value;
   this.type = type;
}