function GetToken(Inputs, Outputs) {
  try {
    var EAISiebelAdapter = TheApplication().GetService("EAI HTTP Transport");
    var EAIJsonConverter = TheApplication().GetService("EAI JSON Converter");
    var Inputs = TheApplication().NewPropertySet();
    var PsPUTOutputs = TheApplication().NewPropertySet();
    var PSOutput = TheApplication().NewPropertySet();

    var sHostname = TheApplication().InvokeMethod(
      "LookupValue",
      "UA_RESPONSYS_LOV",
      "HOSTNAME"
    );
    if (sHostname == null) {
      Outputs.SetProperty("ErrorCode", 01);
      Outputs.SetProperty("ErrorMessagge", "Error geting HOSTNAME LOV Value");
      TheApplication().RaiseErrorText("Error geting HOSTNAME LOV Value");
    }

    var sUserName = TheApplication().InvokeMethod(
      "LookupValue",
      "UA_RESPONSYS_LOV",
      "USERNAME"
    );
    if (sUserName == null) {
      Outputs.SetProperty("ErrorCode", 02);
      Outputs.SetProperty("ErrorMessagge", "Error geting USERNAME LOV Value");
      TheApplication().RaiseErrorText("Error geting USERNAME LOV Value");
    }

    var sPass = TheApplication().InvokeMethod(
      "LookupValue",
      "UA_RESPONSYS_LOV",
      "PASS"
    );
    if (sPass == null) {
      Outputs.SetProperty("ErrorCode", 03);
      Outputs.SetProperty("ErrorMessagge", "Error geting PASS LOV Value");
      TheApplication().RaiseErrorText("Error geting PASS LOV Value");
    }

    var sAuthType = TheApplication().InvokeMethod(
      "LookupValue",
      "UA_RESPONSYS_LOV",
      "AUTH_TYPE"
    );
    if (sAuthType == null) {
      Outputs.SetProperty("ErrorCode", 04);
      Outputs.SetProperty("ErrorMessagge", "Error geting AUTH_TYPE LOV Value");
      TheApplication().RaiseErrorText("Error geting AUTH_TYPE LOV Value");
    }

    var sAuthTokenMethod = TheApplication().InvokeMethod(
      "LookupValue",
      "UA_RESPONSYS_LOV",
      "AUTH_TOKEN_ENDPOINT"
    );
    if (sAuthTokenMethod == null) {
      Outputs.SetProperty("ErrorCode", 05);
      Outputs.SetProperty("ErrorMessagge", "Error geting AUTH_TOKEN_ENDPOINT LOV Value");
      TheApplication().RaiseErrorText("Error geting AUTH_TOKEN_ENDPOINT LOV Value");
    }

    // Build POST Endpoint
    var sURL =
      "https://" +
      sHostname +
      ".responsys.ocs.oraclecloud.com/rest/api/v1.3/" +
      sAuthTokenMethod;

    // Build request Body
    var sRequest =
      "user_name=" +
      sUserName +
      "&password=" +
      sPass +
      "&auth_type=" +
      sAuthType;

    // Add headers and body
    Inputs.SetValue(sRequest);
    Inputs.SetProperty("HTTPRequestURLTemplate", sURL);
    Inputs.SetProperty("HTTPRequestMethod", "POST");
    Inputs.SetProperty("CharSetConversion", "UTF-8");
    Inputs.SetProperty("HTTPContentType", "application/x-www-form-urlencoded");
    Inputs.SetProperty("HTTPAccept", "*/*");

    // Invoke API
    EAISiebelAdapter.InvokeMethod("SendReceive", Inputs, PsPUTOutputs);

    //Transcode the JSON response into UTF-8
    var oTransService = TheApplication().GetService("Transcode Service");
    var oTransOutputs = TheApplication().NewPropertySet();
    PsPUTOutputs.SetProperty("ConversionMode", "EncodingToString");
    PsPUTOutputs.SetProperty("TargetEncoding", "UTF-16");
    PsPUTOutputs.SetProperty("SourceEncoding", "UTF-8");
    oTransService.InvokeMethod("Convert", PsPUTOutputs, oTransOutputs);
    var sResponse = oTransOutputs.GetValue().toString();
    var msgText = "";

    //Get the tokens
    var cmdArray = sResponse.split('"');
    for (var i = 0; i < cmdArray.length; i++)
      msgText = msgText + cmdArray[i] + "\n";

    //Save token
    if (cmdArray[1] != "authToken" || cmdArray[3] == null) {
      TheApplication().RaiseErrorText(
        "There was an error during service invocation. "
      );
    } else {
      //Save the token for future use
      var boListOfVal = TheApplication().GetBusObject("List Of Values");
      var bcListOfVal = boListOfVal.GetBusComp("List Of Values");

      bcListOfVal.ClearToQuery();
      bcListOfVal.ActivateField("Description");
      bcListOfVal.SetSearchSpec("Name", "CURRENT_TOKEN");
      bcListOfVal.SetSearchSpec("Type", "UA_RESPONSYS_LOV");
   
      bcListOfVal.ExecuteQuery();
      if (bcListOfVal.FirstRecord()) {
        bcListOfVal.SetFieldValue("Description", cmdArray[3]);
        bcListOfVal.WriteRecord();
      }
      Outputs.SetProperty("authToken", cmdArray[3]);
      Outputs.SetProperty("ErrorCode", 00);
      Outputs.SetProperty("ErrorMessagge", "Success");
    }
    
  } catch (e) {
    TheApplication().RaiseErrorText("There was an Error on : " + e.toString());
  } finally {
    sHostname = "";
    sUserName = "";
    sPass = "";
    sAuthType = "";
    sAuthTokenMethod = "";
    sURL = "";
    sRequest = "";
    sResponse = "";
    msgText = "";
    cmdArray = "";
  }
}
