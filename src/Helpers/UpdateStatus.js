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