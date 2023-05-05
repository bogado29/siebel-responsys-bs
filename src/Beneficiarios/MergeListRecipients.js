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
    aInterface[0] = new Element("CUSTOMER_ID_","CustomerID","","string");
    aInterface[1] = new Element("EMAIL_ADDRESS_","EmailAddress","","string");
    aInterface[2] = new Element("MOBILE_NUMBER_","MobileNumber","","number");
    aInterface[3] = new Element("QA_SR_SRA","SrSra","","string");
    aInterface[4] = new Element("QA_APELLIDOS","Apellidos","","string");
    aInterface[5] = new Element("QA_NOMBRES","Nombres","","string");
    aInterface[6] = new Element("QA_FECHA_NAC","FechaNac","","string");
    aInterface[7] = new Element("QA_FECHA_CUMPL_DIA","FechaCumpleDia","","string");
    aInterface[8] = new Element("QA_FECHA_CUMPL_MES","FechaCumpleMes","","string");
    aInterface[9] = new Element("QA_SEXO","Sexo","","string");
    aInterface[10] = new Element("QA_EDAD","Edad","","string");
    aInterface[11] = new Element("QA_VIP","VIP","","string");
    aInterface[12] = new Element("QA_NO_LLAMAR_NUNCA","NoLlamarNunca","","string");
    aInterface[13] = new Element("QA_CLIENTE","Cliente","","string");   
    aInterface[14] = new Element("QA_DIRECCION","Direccion","","string");
    aInterface[15] = new Element("QA_NO_LLAMAR_NUNCA_CORREO","NoLlamarNuncaCorreo","","string");
    aInterface[16] = new Element("QA_NRO_DE_AFILIADO","NroDeAfiliado","","string");      
    aInterface[17] = new Element("COUNTRY_","Country","","string"); 

    // Get member data
    var boMembers = TheApplication().GetBusObject("FINS Members");
    var bcMembers = boMembers.GetBusComp("FINS Members");
    
    //bcMembers.SetViewMode("FINS Member Benefits View");
    bcMembers.ClearToQuery(); 
    bcMembers.SetSearchSpec("Id", sRowId);

    bcMembers.ExecuteQuery(ForwardOnly);

    bcMembers.ActivateField("Birth Date");
    bcMembers.ActivateField("M/F");
    bcMembers.ActivateField("Age");
    bcMembers.ActivateField("First Name");
    bcMembers.ActivateField("Last Name");
    bcMembers.ActivateField("M/M");
    bcMembers.ActivateField("Suppress All Mailings");
    bcMembers.ActivateField("Suppress All Calls");
    bcMembers.ActivateField("Account");
    bcMembers.ActivateField("UA VIP");
    bcMembers.ActivateField("Personal Street Address");
    bcMembers.ActivateField("Email Address");
    bcMembers.ActivateField("UA Created");
    bcMembers.ActivateField("UA Birth Day");
    bcMembers.ActivateField("UA Birth Month");
    bcMembers.ActivateField("Member Number");
    bcMembers.ActivateField("ID Information");
    bcMembers.ActivateField("ID Type");
    bcMembers.ActivateField("Home Phone #");
    bcMembers.ActivateField("Personal City");

    aInterface[0].value = bcMembers.GetFieldValue("ID Type") +  bcMembers.GetFieldValue("ID Information");
    aInterface[1].value = bcMembers.GetFieldValue("Email Address");
    aInterface[2].value = bcMembers.GetFieldValue("Home Phone #");
    aInterface[3].value = bcMembers.GetFieldValue("M/M");
    aInterface[4].value = bcMembers.GetFieldValue("Last Name");
    aInterface[5].value = bcMembers.GetFieldValue("First Name");
    aInterface[6].value = bcMembers.GetFieldValue("Birth Date");
    aInterface[7].value = bcMembers.GetFieldValue("UA Birth Day");
    aInterface[8].value = bcMembers.GetFieldValue("UA Birth Month");
    aInterface[9].value = bcMembers.GetFieldValue("M/F");
    aInterface[10].value = bcMembers.GetFieldValue("Age");
    aInterface[11].value = bcMembers.GetFieldValue("UA VIP");
    aInterface[12].value = bcMembers.GetFieldValue("Suppress All Calls");
    aInterface[13].value = bcMembers.GetFieldValue("Account");
    aInterface[14].value = bcMembers.GetFieldValue("Personal Street Address");
    aInterface[15].value = bcMembers.GetFieldValue("Suppress All Mailings");
    aInterface[16].value = bcMembers.GetFieldValue("Member Number");
    aInterface[17].value = bcMembers.GetFieldValue("Personal City");
    
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

function Element(jsonElement, propName, value, type)
{
   this.jsonElement = jsonElement;
   this.propName = propName;
   this.value = value;
   this.type = type;
}

function UpdateStatus(bcName, boName, rowId, fieldValue, statusValue) {
    
  try {
    // Update value on Siebel App.
    var bo = TheApplication().GetBusObject(boName);
    var bc = bo.GetBusComp(bcName);
      
    bc.ClearToQuery();
    bc.ActivateField(fieldValue);
    bc.SetSearchSpec("Id", sRowId);
    bc.ExecuteQuery();
    if (bc.FirstRecord()) {
      bc.SetFieldValue(fieldValue, statusValue);
      bcName.WriteRecord();
    }
  } catch (e) {
    TheApplication().RaiseErrorText(
      "UpdateStatus Helper: " + " Errors " + e.toString()
    );
  } finally {

  }    
}