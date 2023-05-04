function Casos(Inputs, Outputs) {
  try {
    var EAISiebelAdapter = TheApplication().GetService("EAI HTTP Transport");
    var PsPUTOutputs = TheApplication().NewPropertySet();
    var PsPUTInputs = TheApplication().NewPropertySet();

    // Field Parameters
    var sNroCaso:chars = Inputs.GetProperty("NroCaso");
    var sTipoCaso:chars = Inputs.GetProperty("TipoCaso");
    var sTipoDocumento:chars = Inputs.GetProperty("TipoDocumento");
    var sNroDocumento:chars = Inputs.GetProperty("NroDocumento");
    var sOrganizacion:chars = Inputs.GetProperty("Organizacion");
    var sPaisOrigen:chars = Inputs.GetProperty("PaisOrigen");
    var sFechaInicioCaso:chars = Inputs.GetProperty("FechaInicioCaso");
    var sFechaFinCaso:chars = Inputs.GetProperty("FechaFinCaso");
    var sEstadoCaso:chars = Inputs.GetProperty("EstadoCaso");
    var sTipoVenta:chars = Inputs.GetProperty("TipoVenta");
    var sLineaNegocio:chars = Inputs.GetProperty("LineaNegocio");
    var sFechaCreacion:chars = Inputs.GetProperty("FechaCreacion");
    var sFechaCierre:chars = Inputs.GetProperty("FechaCierre");
    var sTipoAsistencia:chars = Inputs.GetProperty("TipoAsistencia");
    var sPaisCaso:chars = Inputs.GetProperty("PaisCaso");
    var sCiudadCaso:chars = Inputs.GetProperty("CiudadCaso");
    var sFechaSalida:chars = Inputs.GetProperty("FechaSalida");
    var sTelfResidencia:chars = Inputs.GetProperty("TelfResidencia");
    var sNombrePasajero:chars = Inputs.GetProperty("NombrePasajero");
    var sApellidoPasajero:chars = Inputs.GetProperty("ApellidoPasajero"); 
    var sNoEnviarEmail:chars = Inputs.GetProperty("NoEnviarEmail");
    var sPaisBeneficiario:chars = Inputs.GetProperty("PaisBeneficiario");
    var sTipoCuenta:chars = Inputs.GetProperty("TipoCuenta");
    var sTipoRegistro:chars = Inputs.GetProperty("TipoRegistro");
    var sIDOrganizacion:chars = Inputs.GetProperty("IDOrganizacion");
    var sUsuarioCreador:chars = Inputs.GetProperty("UsuarioCreador");
    var sNVoucherCobertura:chars = Inputs.GetProperty("NVoucherCobertura");
    var sAsignado:chars = Inputs.GetProperty("Asignado");
    var sAplicaFranquicia:chars = Inputs.GetProperty("AplicaFranquicia");
    var sEmailAddress:chars = Inputs.GetProperty("EmailAddress");
    var sFechaCreacionSiebel:chars = Inputs.GetProperty("FechaCreacionSiebel");
    var sTipoAsistenciaOriginal:chars = Inputs.GetProperty("TipoAsistenciaOriginal");
    var sDerivacionOriginal:chars = Inputs.GetProperty("DerivacionOriginal");
    var sSintoma1:chars = Inputs.GetProperty("Sintoma1");
    var sSintoma2:chars = Inputs.GetProperty("Sintoma2");
    var sSintoma3:chars = Inputs.GetProperty("Sintoma3");
    var sUrgencia:chars = Inputs.GetProperty("Urgencia");
    var sDerivacion:chars = Inputs.GetProperty("Derivacion");
    var sSubestado:chars = Inputs.GetProperty("Subestado");
    var sSubtipo:chars = Inputs.GetProperty("Subtipo");
    var sCustomerID:chars = Inputs.GetProperty("CustomerID");
    var sTelefonoContacto:chars = Inputs.GetProperty("TelefonoContacto");

    // Add Request and Response in the response.
    var sDebugMode:chars = Inputs.GetProperty("DebugMode");    

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
    var sRequest = '{\"recordData\": ' +
            '{\"fieldNames\":' +
            '[' +
              '\"QA_NRO_CASO\",' +
              '\"QA_TIPO_CASO\",' +
              '\"QA_TIPO_DOCUMENTO\",' +
              '\"QA_NRO_DOCUMENTO\",' +
              '\"QA_ORGANIZACION\",' +
              '\"QA_PAIS_ORIGEN",' +
              '\"QA_FECHA_INICIO_CASO\",' +
              '\"QA_FECHA_FIN_CASO\",' +
              '\"QA_ESTADO_CASO\",' +
              '\"QA_TIPO_VENTA\",' +
              '\"QA_LINEA_NEGOCIO\",' +
              '\"QA_FECHA_CREACION\",' +
              '\"QA_FECHA_CIERRE\",' +
              '\"QA_TIPO_ASISTENCIA\",' +
              '\"QA_PAIS_CASO\",' +
              '\"QA_CIUDAD_CASO\",' +
              '\"QA_FECHA_SALIDA\",' +
              '\"QA_TELF_RESIDENCIA\",' +
              '\"QA_NOMBRE_PASAJERO\",' +
              '\"QA_APELLIDO_PASAJERO\",' +
              '\"QA_NO_ENVIAR_EMAIL\",' +
              '\"QA_PAIS_BENEFICIARIO\",' +
              '\"QA_TIPO_CUENTA\",' +
              '\"QA_TIPO_REGISTRO\",' +
              '\"QA_ID_ORGANIZACION\",' +
              '\"QA_USUARIO_CREADOR\",' +
              '\"QA_N_VOUCHER_COBERTURA\",' +
              '\"QA_ASIGNADO\",' +
              '\"QA_APLICA_FRANQUICIA\",' +
              '\"EMAIL_ADDRESS_\",' +
              '\"QA_FECHA_CREACION_SIEBEL\",' +
              '\"QA_TIPO_ASISTENCIA_ORIGINAL\",' +
              '\"QA_DERIVACION_ORIGINAL\",' +
              '\"QA_SINTOMA_1\",' +
              '\"QA_SINTOMA_2\",' +
              '\"QA_SINTOMA_3\",' +
              '\"QA_URGENCIA\",' +
              '\"QA_DERIVACION\",' +
              '\"QA_SUBESTADO\",' +
              '\"QA_SUBTIPO\",' +
              '\"CUSTOMER_ID\",' +
              '\"QA_TELEFONO_CONTACTO\"],' +
    '\"records\":[' +
            '[' +
            '\"'+ sNroCaso +'\",' +
            '\"'+ sTipoCaso +'\",' +
            '\"'+ sTipoDocumento +'\",' +
            '\"'+ sNroDocumento +'\",' +
            '\"'+ sOrganizacion +'\",' +
            '\"'+ sPaisOrigen +'\",' +
            '\"'+ sFechaInicioCaso +'\",' +
            '\"'+ sFechaFinCaso +'\",' +
            '\"'+ sEstadoCaso +'\",' +
            '\"'+ sTipoVenta +'\",' +
            '\"'+ sLineaNegocio +'\",' +
            '\"'+ sFechaCreacion +'\",' +
            '\"'+ sFechaCierre +'\",' +
            '\"'+ sTipoAsistencia +'\",' +
            '\"'+ sPaisCaso +'\",' +
            '\"'+ sCiudadCaso +'\",' +
            '\"'+ sFechaSalida +'\",' +
            '\"'+ sTelfResidencia +'\",' +
            '\"'+ sNombrePasajero +'\",' +
            '\"'+ sApellidoPasajero +'\",' +
            '\"'+ sNoEnviarEmail +'\",' +
            '\"'+ sPaisBeneficiario +'\",' +
            '\"'+ sTipoCuenta +'\",' +
            '\"'+ sTipoRegistro +'\",' +
            '\"'+ sIDOrganizacion +'\",' +
            '\"'+ sUsuarioCreador +'\",' +
            '\"'+ sNVoucherCobertura +'\",' +
            '\"'+ sAsignado +'\",' +
            '\"'+ sAplicaFranquicia +'\",' +
            '\"'+ sEmailAddress +'\",' +
            '\"'+ sFechaCreacionSiebel +'\",' +
            '\"'+ sTipoAsistenciaOriginal +'\",' +
            '\"'+ sDerivacionOriginal +'\",' +
            '\"'+ sSintoma1 +'\",' +
            '\"'+ sSintoma2 +'\",' +
            '\"'+ sSintoma3 +'\",' +
            '\"'+ sUrgencia +'\",' +
            '\"'+ sDerivacion +'\",' +
            '\"'+ sSubestado +'\",' +
            '\"'+ sSubtipo +'\",' +
            '\"'+ sCustomerID +'\",' +
            '\"'+ sTelefonoContacto +'\"]' +
      '],' +
          '\"mapTemplateName\":null},' +
          '\"insertOnNoMatch\": true,' +
          '\"updateOnMatch\": \"REPLACE_ALL\"' +
       '}';

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
     sNroCaso ="";
     sTipoCaso ="";
     sTipoDocumento ="";
     sNroDocumento ="";
     sOrganizacion ="";
     sPaisOrigen ="";
     sFechaInicioCaso ="";
     sFechaFinCaso ="";
     sEstadoCaso ="";
     sTipoVenta ="";
     sLineaNegocio ="";
     sFechaCreacion ="";
     sFechaCierre ="";
     sTipoAsistencia ="";
     sPaisCaso ="";
     sCiudadCaso ="";
     sFechaSalida ="";
     sTelfResidencia ="";
     sNombrePasajero ="";
     sApellidoPasajero ="";
     sNoEnviarEmail ="";
     sPaisBeneficiario ="";
     sTipoCuenta ="";
     sTipoRegistro ="";
     sIDOrganizacion ="";
     sUsuarioCreador ="";
     sNVoucherCobertura ="";
     sAsignado ="";
     sAplicaFranquicia ="";
     sEmailAddress ="";
     sFechaCreacionSiebel ="";
     sTipoAsistenciaOriginal ="";
     sDerivacionOriginal ="";
     sSintoma1 ="";
     sSintoma2 ="";
     sSintoma3 ="";
     sUrgencia ="";
     sDerivacion ="";
     sSubestado ="";
     sSubtipo ="";
     sCustomerID ="";
     sTelefonoContacto ="";
    
    sFolderName = "";
    sListName = "";
    sURL = "";
    sRequest = "";
    sAuthToken = "";
    smsgText = "";
    sDebugMode ="";
  }
}