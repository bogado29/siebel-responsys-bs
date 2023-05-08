function Element(jsonElement, propName, value, type,bcName,composedFlg,bcFieldName1,bcFieldName2)
{
   this.jsonElement = jsonElement; // Responsys JSON tag.
   this.propName = propName; // Only if BS get field values as input params.
   this.value = value; // Data value.
   this.type = type; // Data type -  string or number.
   this.bcName = bcName; // Siebel BC Name - Used for activate fields.
   this.composedFlg = composedFlg; // Only if JSON tag is composed by n fields - Y or N.
   this.bcFieldName1 = bcFieldName1; // Siebel Field Name 1 - Used in GetFieldValue.
   this.bcFieldName2 = bcFieldName2; // Siebel Field Name 2 - Used in GetFieldValue.
}