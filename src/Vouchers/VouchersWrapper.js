function VouchersWrapper(Inputs, Outputs) {
  try {
    var oVSInputs = TheApplication().NewPropertySet();
    var oVSOutputs = TheApplication().NewPropertySet();
    var oTokenOutputs = TheApplication().NewPropertySet();

    // oVSInputs.SetProperty("FolderName", Inputs.GetProperty("VoucherFolderName"));
    // oVSInputs.SetProperty("ListName", Inputs.GetProperty("VoucherListName"));
    oVSInputs.SetProperty("FolderName", "QA");
    oVSInputs.SetProperty("ListName", "QA_VOUCHER");
    oVSInputs.SetProperty("DebugMode", "Y");

    // Field Parameters
    oVSInputs.SetProperty("NroVoucher", "12345");
    oVSInputs.SetProperty("CustomerID", "123456");
    oVSInputs.SetProperty("EmailAddress", "bogado@gmail.com");


    var sTokenResponse = oTokenOutputs.GetProperty("Response");
    var sTokenCode = oTokenOutputs.GetProperty("ErrorCode");

    Outputs.SetProperty("TokenResponse", sTokenResponse);
    Outputs.SetProperty("TokenErrCode", sTokenCode);

    Vouchers(oVSInputs, oVSOutputs);

    Outputs.SetProperty("VouchersRequest", oVSOutputs.GetProperty("Request"));
    Outputs.SetProperty("VouchersResponse", oVSOutputs.GetProperty("Response"));
    Outputs.SetProperty("VouchersErrCode", oVSOutputs.GetProperty("ErrorCode"));
    Outputs.SetProperty("VouchersErrMsg", oVSOutputs.GetProperty("ErrorMessagge"));
    
    

  } catch (e) {
    Outputs.SetProperty("Response", e.toString());
    Outputs.SetProperty("ErrorCode", 99);
    Outputs.SetProperty("ErrorMessagge", "Unhandled error");
    TheApplication().RaiseErrorText(
      "Business Service Outputs: " + Outputs + " Errors " + e.toString()
    );
  } finally {
    sTokenResponse = "";
    sTokenCode = "";

  }
}
