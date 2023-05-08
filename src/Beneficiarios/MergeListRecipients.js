function MergeListRecipients(Inputs, Outputs) {
    try {
      var EAISiebelAdapter = TheApplication().GetService("EAI HTTP Transport");
      var PsPUTOutputs = TheApplication().NewPropertySet();
      var PsPUTInputs = TheApplication().NewPropertySet();
    
      // Add Request and Response in the response.
      var sDebugMode:chars = Inputs.GetProperty("DebugMode");
  
      // Responsys List Name 
      var sListName:chars = Inputs.GetProperty("ListName");
      if (sListName == null) {
        Outputs.SetProperty("Response", null);
        Outputs.SetProperty("ErrorCode", 01);
        Outputs.SetProperty("ErrorMessagge", "Error geting ListName Value");
        TheApplication().RaiseErrorText("Error geting ListName Value");
      }
  
      var sRowId:chars = Inputs.GetProperty("RowId");
      if (sRowId == null) {
        Outputs.SetProperty("Response", null);
        Outputs.SetProperty("ErrorCode", 02);
        Outputs.SetProperty("ErrorMessagge", "Error geting RowId Value");
        TheApplication().RaiseErrorText("Error geting RowId Value");
      }
  
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
      "lists/" +
      sListName + 
      "/members"
      ;
  
      var sRequest = '{\"recordData\": ' + '{\"fieldNames\":[';
      var sLeftFiller = '\"';
      var sRightFiller = '\",';
      var aInterface = new Array();
      // Set master Data
      aInterface[0] = new Element("CUSTOMER_ID_","CustomerID","","string","FINS Members","Y","ID Type","ID Information");
      aInterface[1] = new Element("EMAIL_ADDRESS_","EmailAddress","","string","FINS Members","N","Email Address");
      aInterface[2] = new Element("MOBILE_NUMBER_","MobileNumber","","number","FINS Members","N","Home Phone #");
      aInterface[3] = new Element("QA_SR_SRA","SrSra","","string","FINS Members","N","M/M");
      aInterface[4] = new Element("QA_APELLIDOS","Apellidos","","string","FINS Members","N","Last Name");
      aInterface[5] = new Element("QA_NOMBRES","Nombres","","string","FINS Members","N","First Name");
      aInterface[6] = new Element("QA_FECHA_NAC","FechaNac","","string","FINS Members","N","Birth Date");
      aInterface[7] = new Element("QA_FECHA_CUMPL_DIA","FechaCumpleDia","","string","FINS Members","N","UA Birth Day");
      aInterface[8] = new Element("QA_FECHA_CUMPL_MES","FechaCumpleMes","","string","FINS Members","N","UA Birth Month");
      aInterface[9] = new Element("QA_SEXO","Sexo","","string","FINS Members","N","M/F");
      aInterface[10] = new Element("QA_EDAD","Edad","","string","FINS Members","N","Age");
      aInterface[11] = new Element("QA_VIP","VIP","","string","FINS Members","N","UA VIP");
      aInterface[12] = new Element("QA_NO_LLAMAR_NUNCA","NoLlamarNunca","","string","FINS Members","N","Suppress All Calls");
      aInterface[13] = new Element("QA_CLIENTE","Cliente","","string","FINS Members","N","Account");   
      aInterface[14] = new Element("QA_DIRECCION","Direccion","","string","FINS Members","N","Personal Street Address");
      aInterface[15] = new Element("QA_NO_LLAMAR_NUNCA_CORREO","NoLlamarNuncaCorreo","","string","FINS Members","N","Suppress All Mailings");
      aInterface[16] = new Element("QA_NRO_DE_AFILIADO","NroDeAfiliado","","string","FINS Members","N","Member Number");      
      aInterface[17] = new Element("COUNTRY_","Country","","string","FINS Members","N","Personal City"); 
  
      // Get member data
      var boMembers = TheApplication().GetBusObject("FINS Members");
      var bcMembers = boMembers.GetBusComp("FINS Members");
      
      //bcMembers.SetViewMode("FINS Member Benefits View");
      bcMembers.ClearToQuery(); 
      bcMembers.SetSearchSpec("Id", sRowId);
  
      bcMembers.ExecuteQuery(ForwardOnly);
  
      // Activate Siebel Fields. 
      for ( var i = 0; i < getArrayLength(aInterface); i++ ) {

        aInterface[i].bcName.ActivateField(aInterface[i].bcFieldName1);

        if (aInterface[i].composedFlg == "Y") {
            aInterface[i].bcName.ActivateField(aInterface[i].bcFieldName2);
        }
      }  

      // Get and Set field values into array.
      for ( i = 0; i < getArrayLength(aInterface); i++ ) {

        aInterface[i].value = aInterface[i].bcName.GetFieldValue(bcFieldName1.aInterface[i]);

        if (composedFlg.aInterface[i] == "Y") {
            aInterface[i].value = aInterface[i].value + aInterface[i].bcName.GetFieldValue(bcFieldName2.aInterface[i]);
        }
      }
      
      // Generate Json responsys columns
      for ( i = 0; i < getArrayLength(aInterface); i++ ) {
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
          else 
        { 
          Outputs.SetProperty("Response", null);
          Outputs.SetProperty("ErrorCode", 04);
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
        
        // TODO: Update Flag
        UpdateStatus("FINS Members","FINS Members",sRowId,"UA Responsys Flag","Y");
  
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
  
  
