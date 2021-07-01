var MarcUtility = Java.type("org.folio.rest.utility.MarcUtility");
var marcUtility = new MarcUtility();

var fields = JSON.parse(marcUtility.getFieldsFromMarcJson(records[loopCounter], ['245', '980']));

var getSubfield = function (fields, tag, code) {
  for (var i = 0; i < fields.length; ++i) {
    if (fields[i].tag === tag) {
      for (var j = 0; j < fields[i].subfields.length; ++j) {
        if (fields[i].subfields[j].code === code) {
          return fields[i].subfields[j].data;
        }
      }
    }
  }
};

var getMultipleSubfield = function (fields, tag, code) {
  var data = [];
  for (var i = 0; i < fields.length; ++i) {
    if (fields[i].tag === tag) {
      for (var j = 0; j < fields[i].subfields.length; ++j) {
        if (fields[i].subfields[j].code === code) {
          data.push(fields[i].subfields[j].data);
        }
      }
      break
    }
  }
  return data;
};

print('\nfields = ' + JSON.stringify(fields, null, 2) + '\n');

var title = getSubfield(fields, '245', 'a');
if (title.endsWith(' :')) {
  title = title.substring(0, title.length - 1);
  title += getSubfield(fields, '245', 'b');
}
if (title.endsWith(' ;')) {
  title = title.substring(0, title.length - 2);
}
if (title.endsWith(' =')) {
  title = title.substring(0, title.length - 2);
}
if (title.endsWith(' /')) {
  title = title.substring(0, title.length - 2);
}

/* TODO: Ask about MARC title parsing */

var marcOrderData = {
  title: title,
  objectCode: getSubfield(fields, '980', 'o'),
  projectCode: getSubfield(fields, '980', 'r'),
  fundCode: getSubfield(fields, '980', 'b'),
  vendorCode:  getSubfield(fields, '980', 'v'),
  notes:  getMultipleSubfield(fields, '980', 'n'),
  price: getSubfield(fields, '980', 'm'),
  electronicIndicator: getSubfield(fields, '980', 'z'),
  vendorItemId: getSubfield(fields, '980', 'c')
};

execution.setVariableLocal('marcOrderData', S(JSON.stringify(marcOrderData)));