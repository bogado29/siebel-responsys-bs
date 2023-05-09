function MergeListRecipients(Inputs, Outputs) {
    try {
      var EAISiebelAdapter = TheApplication().GetService("EAI HTTP Transport");
      var PsPUTOutputs = TheApplication().NewPropertySet();
      var PsPUTInputs = TheApplication().NewPropertySet();
  
      // Field Parameters
      var sCustomerID:chars = Inputs.GetProperty("CustomerID");
      var sEmailAddress:chars = Inputs.GetProperty("EmailAddress");
      var sMobileNumber:chars = Inputs.GetProperty("MobileNumber");
      var sSrSra:chars = Inputs.GetProperty("SrSra");
      var sApellidos:chars = Inputs.GetProperty("Apellidos");
      var sNombres:chars = Inputs.GetProperty("Nombres");
      var sFechaNac:chars = Inputs.GetProperty("FechaNac");
      var sFechaCumpleDia:chars = Inputs.GetProperty("FechaCumpleDia");
      var sFechaCumpleMes:chars = Inputs.GetProperty("FechaCumpleMes");
      var sSexo:chars = Inputs.GetProperty("Sexo");
      var sEdad:chars = Inputs.GetProperty("Edad");
      var sVIP:chars = Inputs.GetProperty("VIP");
      var sNoLlamarNunca:chars = Inputs.GetProperty("NoLlamarNunca");
      var sCliente:chars = Inputs.GetProperty("Cliente");
      var sDireccion:chars = Inputs.GetProperty("Direccion");
      var sNoLlamarNuncaCorreo:chars = Inputs.GetProperty("NoLlamarNuncaCorreo");
      var sNroDeAfiliado:chars = Inputs.GetProperty("NroDeAfiliado");
      var sCountry:chars = Inputs.GetProperty("Country");
    
      // Responsys List Name 
      var sListName:chars;
  
      var sHostname = TheApplication().InvokeMethod(
        "LookupValue",
        "UA_RESPONSYS_LOV",
        "HOSTNAME"
      );
      if (sHostname == null) {
        TheApplication().RaiseErrorText("Error geting HOSTNAME LOV Value");
      }
  
      // Build POST Endpoint
      var sURL =
      "https://" +
      sHostname +
      ".responsys.ocs.oraclecloud.com/rest/api/v1.3/" +
      "lists/" +
      sListName + 
      "/members"
      ;
  
      var sRequest2 = '{\"recordData\": ' + '{\"fieldNames\":';
      var sLeftFiller = '[\"';
      var sRightFiller = '\",';
      var interface = BeneficiariosInterface();
  
      // display the sorted colors
      for ( var i = 0; i <= getArrayLength(interface); i++ ) {
          sRequest2 = sRequest2 + sLeftFiller + colors[i].jsonElement + sRightFiller ;
      }
  
      Outputs.SetProperty("Request2", sRequest2);
  
      
      // Build request Body
      var sRequest = '{\"recordData\": ' +
              '{\"fieldNames\":' +
                  '[\"CUSTOMER_ID_\",' +
                  '\"EMAIL_ADDRESS_\",' +
                  '\"MOBILE_NUMBER_\",' +
                  '\"QA_SR_SRA\",' +
                  '\"QA_APELLIDOS\",' +
                  '\"QA_NOMBRES\",' +
                  '\"QA_FECHA_NAC\",' +
                  '\"QA_FECHA_CUMPL_DIA\",' +
                  '\"QA_FECHA_CUMPL_MES\",' +
                  '\"QA_SEXO\",' +
                  '\"QA_EDAD\",' +
                  '\"QA_VIP\",' +
                  '\"QA_NO_LLAMAR_NUNCA\",' +
                  '\"QA_CLIENTE\",' +
                  '\"QA_DIRECCION\",' +
                  '\"QA_NO_LLAMAR_NUNCA_CORREO\",' +
                  '\"QA_NRO_DE_AFILIADO\",' +
                  '\"COUNTRY_\"],' +
              '\"records\":[' +
                  '[\"'+ sCustomerID +'\",' +
                  '\"'+ sEmailAddress + '\",' +
                  ''+ sMobileNumber +',' +
                  '\"'+ sSrSra +'\",' +
                  '\"'+ sApellidos +'\",' +
                  '\"'+ sNombres +'\",' +
                  '\"'+ sFechaNac +'\",' +
                  '\"'+ sFechaCumpleDia +'\",' +
                  '\"'+ sFechaCumpleMes +'\",' +
                  '\"'+ sSexo +'\",' +
                  '\"'+ sEdad +'\",' +
                  '\"'+ sVIP +'\",' +
                  '\"'+ sNoLlamarNunca +'\",' +
                  '\"'+ sCliente +'\",' +
                  '\"'+ sDireccion +'\",' +
                  '\"'+ sNoLlamarNuncaCorreo +'\",' +
                  '\"'+ sNroDeAfiliado +'\",' +
                  '\"'+ sCountry +'\"]' +
              '],' +
                  '\"mapTemplateName\":null},' +
                  '\"mergeRule\":{' +
                      '\"htmlValue\":\"H\",' +
                      '\"optinValue\":\"I\",' +
                      '\"textValue\":\"T\",' +
                      '\"insertOnNoMatch\":true,' +
                      '\"updateOnMatch\":\"REPLACE_ALL\",' +
                      '\"matchColumnName1\":\"CUSTOMER_ID_\",' +
                      '\"matchOperator\":\"NONE\",' +
                      '\"optoutValue\":\"O\",' +
                      '\"rejectRecordIfChannelEmpty\":null,' +
                      '\"defaultPermissionStatus\":\"OPTIN\"}}';
  
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
        else return("none");
  
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
  
    } catch (e) {
      TheApplication().RaiseErrorText(
        "Business Service: " + Outputs + " Errors " + e.toString()
      );
    } finally {
    }
  }
  
  function Element(jsonElement, propName)
  {
     this.jsonElement = jsonElement;
     this.propName = propName;
  }
  
  function BeneficiariosInterface() {
     var element = new Array();
     Array[0] = Element("CUSTOMER_ID","sCustomerID");
     Array[1] = Element("EMAIL_ADDRESS_","sEmailAddress");
     Array[2] = Element("MOBILE_NUMBER_","sMobileNumber");
     Array[3] = Element("QA_SR_SRA","sSrSra");
     Array[4] = Element("QA_APELLIDOS","sApellidos");
     Array[5] = Element("QA_NOMBRES","sNombres");
     Array[6] = Element("QA_FECHA_NAC","sFechaNac");
     Array[7] = Element("QA_FECHA_CUMPL_DIA","sFechaCumpleDia");
     Array[8] = Element("QA_FECHA_CUMPL_MES","sFechaCumpleMes");
     Array[9] = Element("QA_SEXO","sSexo");
     Array[10] = Element("QA_EDAD","sEdad");
     Array[11] = Element("QA_VIP","sVIP");
     Array[12] = Element("QA_NO_LLAMAR_NUNCA","sNoLlamarNunca");
     Array[13] = Element("QA_CLIENTE","sCliente");   
     Array[14] = Element("QA_DIRECCION","sDireccion");
     Array[15] = Element("QA_NO_LLAMAR_NUNCA_CORREO","sNoLlamarNuncaCorreo");
     Array[16] = Element("QA_NRO_DE_AFILIADO","sNroDeAfiliado");      
     Array[17] = Element("COUNTRY_","sCountry"); 
     return element;
  }
  