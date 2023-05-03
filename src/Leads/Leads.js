function Leads(Inputs, Outputs) {
  try {
    var EAISiebelAdapter = TheApplication().GetService("EAI HTTP Transport");
    var PsPUTOutputs = TheApplication().NewPropertySet();
    var PsPUTInputs = TheApplication().NewPropertySet();

    // Add Request and Response in the response.
    var sDebugMode:chars = Inputs.GetProperty("DebugMode");

    // Field Parameters
    var sCustomerID:chars = Inputs.GetProperty("CustomerID");
	  var sEmailAddress:chars = Inputs.GetProperty("EmailAddress");
    var sNroLead:chars = Inputs.GetProperty("NroLead");
    var sEstado:chars = Inputs.GetProperty("Estado");
    var sOrganizacionEmisora:chars = Inputs.GetProperty("OrganizacionEmisora");
    var sOrigenLead:chars = Inputs.GetProperty("OrigenLead");
    var sSubOrigenLead:chars = Inputs.GetProperty("SubOrigenLead");
    var sDetalleSubOrigen:chars = Inputs.GetProperty("DetalleSubOrigen");
    var sTipoViaje:chars = Inputs.GetProperty("TipoViaje");
    var sOrigenPais:chars = Inputs.GetProperty("OrigenPais");
    var sDestino:chars = Inputs.GetProperty("Destino");
    var sSalida:chars = Inputs.GetProperty("Salida");
    var sRegreso:chars = Inputs.GetProperty("Regreso");
    var sDias:chars = Inputs.GetProperty("Dias");
    var sCantidadPasajeros:chars = Inputs.GetProperty("CantidadPasajeros");
    var sEdadPasajeros:chars = Inputs.GetProperty("EdadPasajeros");
    var sContrato:chars = Inputs.GetProperty("Contrato");
    var sSponsorCorpoLead:chars = Inputs.GetProperty("SponsorCorpoLead");
    var sClienteCorporativo:chars = Inputs.GetProperty("ClienteCorporativo");
    var sProductosInteres:chars = Inputs.GetProperty("ProductosInteres");
    var sFechaCotizacion:chars = Inputs.GetProperty("FechaCotizacion");
    var sFechaConversion:chars = Inputs.GetProperty("FechaConversion");
    var sNroVoucher:chars = Inputs.GetProperty("NroVoucher");
    var sFechaBaja:chars = Inputs.GetProperty("FechaBaja");
    var sMotivoBaja:chars = Inputs.GetProperty("MotivoBaja");
    var sTempCotizacion:chars = Inputs.GetProperty("TempCotizacion");
    var sParentesco:chars = Inputs.GetProperty("Parentesco");
    var sPropietario:chars = Inputs.GetProperty("Propietario");
    var sCanalVenta:chars = Inputs.GetProperty("CanalVenta");
    var sApellidoContacto:chars = Inputs.GetProperty("ApellidoContacto");
    var sNombreContacto:chars = Inputs.GetProperty("NombreContacto");
    var sTelefonoContacto:chars = Inputs.GetProperty("TelefonoContacto");
    var sFechaCreacionSiebel:chars = Inputs.GetProperty("FechaCreacionSiebel");
  
    // Responsys Folder name Input Parameter:
    var sFolderName:chars = Inputs.GetProperty("FolderName");
    if (sFolderName == null) {
      Outputs.SetProperty("Response", null);
      Outputs.SetProperty("ErrorCode", 01-1);
      Outputs.SetProperty("ErrorMessagge", "Error geting ListName Value");
      TheApplication().RaiseErrorText("Error geting ListName Value");
    }

    // Responsys ListName name Input Parameter:
    var sListName:chars = Inputs.GetProperty("ListName");
    if (sListName == null) {
      Outputs.SetProperty("Response", null);
      Outputs.SetProperty("ErrorCode", 01);
      Outputs.SetProperty("ErrorMessagge", "Error geting ListName Value");
      TheApplication().RaiseErrorText("Error geting ListName Value");
    }

    // Siebel ROW_ID Input Parameter:
    var sRowId:chars = Inputs.GetProperty("RowId");
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

    // Build POST Endpoint
    var sURL =
    "https://" +
    sHostname +
    ".responsys.ocs.oraclecloud.com/rest/api/v1.3/" +
    "folders/" +
    sFolderName +
    "/suppData/" +
    sListName + 
    "/members"
    ;

    // Build request Body
    var sRequest = '{\"recordData\": ' + '{\"fieldNames\":[';
    var sLeftFiller = '\"';
    var sRightFiller = '\",';
    var aInterface = new Array();
    aInterface[0] = new Element("CUSTOMER_ID_","CustomerID","","string");
    aInterface[1] = new Element("EMAIL_ADDRESS_","EmailAddress","","string");
    aInterface[2] = new Element("QA_NRO_LEAD","NroDeAfiliado","","string");      


    var sRequest = '{\"recordData\": ' +
            '{\"fieldNames\":' +
                '[\"CUSTOMER_ID\",' +
                '\"EMAIL_ADDRESS_\",' +
                '\"QA_NRO_LEAD\",' +
                '\"QA_ESTADO\",' +
                '\"QA_ORGANIZACION_EMISORA\",' +
                '\"QA_ORIGEN_LEAD\",' +
                '\"QA_SUB_ORIGEN_LEAD\",' +
                '\"QA_DETALLE_SUB_ORIGEN\",' +
                '\"QA_TIPO_VIAJE\",' +
                '\"QA_ORIGEN_PAIS\",' +
                '\"QA_DESTINO\",' +
                '\"QA_SALIDA\",' +
                '\"QA_REGRESO\",' +
                '\"QA_DIAS\",' +
                '\"QA_CANTIDAD_PASAJEROS\",' +
                '\"QA_EDAD_PASAJEROS\",' +
                '\"QA_CONTRATO\",' +
                '\"QA_SPONSOR_CORPO_LEAD\",' +
                '\"QA_CLIENTE_CORPORATIVO\",' +
                '\"QA_PRODUCTOS_INTERES\",' +
                '\"QA_FECHA_COTIZACION\",' +
                '\"QA_FECHA_CONVERSION\",' +
                '\"QA_NRO_VOUCHER\",' +
                '\"QA_FECHA_BAJA\",' +
                '\"QA_MOTIVO_BAJA\",' +
                '\"QA_TEMPL_COTIZACION\",' +
                '\"QA_PARENTESCO\",' +
                '\"QA_PROPIETARIO\",' +
                '\"QA_CANAL_VENTA\",' +
                '\"QA_APELLIDO_CONTACTO\",' +
                '\"QA_NOMBRE_CONTACTO\",' +
                '\"QA_TELEFONO_CONTACTO\",' +                
                '\"QA_FECHA_CREACION_SIEBEL\"],' +
            '\"records\":[' +
                '[\"'+ sCustomerID +'\",' +
                '\"'+ sEmailAddress + '\",' +
                '\"'+ sNroLead + '\",' +
                '\"'+ sEstado +'\",' +
                '\"'+ sOrganizacionEmisora +'\",' +
                '\"'+ sOrigenLead +'\",' +
                '\"'+ sSubOrigenLead +'\",' +
                '\"'+ sDetalleSubOrigen +'\",' +
                '\"'+ sTipoViaje +'\",' +
                '\"'+ sOrigenPais +'\",' +
                '\"'+ sDestino +'\",' +
                '\"'+ sSalida +'\",' +
                '\"'+ sRegreso +'\",' +
                ''+ sDias +',' +
                ''+ sCantidadPasajeros +',' +
                '\"'+ sEdadPasajeros +'\",' +
                '\"'+ sContrato +'\",' +
                '\"'+ sSponsorCorpoLead +'\",' +
                '\"'+ sClienteCorporativo +'\",' +
                '\"'+ sProductosInteres +'\",' +
                '\"'+ sFechaCotizacion +'\",' +
                '\"'+ sFechaConversion +'\",' +
                '\"'+ sNroVoucher +'\",' +
                '\"'+ sFechaBaja +'\",' +
                '\"'+ sMotivoBaja +'\",' +
                '\"'+ sTempCotizacion +'\",' +
                '\"'+ sParentesco +'\",' +
                '\"'+ sPropietario +'\",' +
                '\"'+ sCanalVenta +'\",' +
                '\"'+ sApellidoContacto +'\",' +
                '\"'+ sNombreContacto +'\",' +
                '\"'+ sTelefonoContacto +'\",' +
                '\"'+ sFechaCreacionSiebel +'\"]' +
            '],' +
                '\"mapTemplateName\":null},' +
                '\"insertOnNoMatch\": true,' +
                '\"updateOnMatch\": \"REPLACE_ALL\"' +
                '}';                
    
    Outputs.SetProperty("Request", sRequest);

    // Get authorization token
    var boListOfVal = TheApplication().GetBusObject("List Of Values");
	  var bcListOfVal = boListOfVal.GetBusComp("List Of Values");
	  bcListOfVal.ClearToQuery();
	  bcListOfVal.ActivateField("Description");
	  bcListOfVal.SetSearchSpec("Name","CURRENT_TOKEN");
	  bcListOfVal.SetSearchSpec("Type","UA_RESPONSYS_LOV");
	  bcListOfVal.ExecuteQuery();
	  if(bcListOfVal.FirstRecord()){
		  var sAuthToken = bcListOfVal.GetFieldValue("Description");
	  }
	  else 
    { 
      Outputs.SetProperty("Response", null);
      Outputs.SetProperty("ErrorCode", 02);
      Outputs.SetProperty("ErrorMessagge", "Cannot get Authorization Token value");
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