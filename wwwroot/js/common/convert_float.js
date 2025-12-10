function parseFloatGr(val) {
    if ((val === undefined) || (val === null)) {
        console.info("file convert_float.js value pass is empty");
        return 0.0;
    }

    if (typeof val !== 'string') {
        console.info(`file convert_float.js val is not a string ${val}`);
        return val;
    }

    let valResult = 0.0,
        valStr = val;

    //if (_user.language.includes('en')) {
    //    if ((valStr.includes(',')) && (valStr.includes('.'))) {
    //        valStr = valStr.replace(',', '');
    //    } else if (valStr.includes(',')) {
    //        valStr = valStr.replace(',', '.');
    //    }
    //    valResult = parseFloat(valStr);
    //} else {
        if ((valStr.includes('.')) && (valStr.includes(','))) {
            valStr = valStr.replace('.', '');
        } else if (valStr.includes('.')) {
            valStr = valStr.replace('.', ',');
        }
        valResult = valStr.toFloat();
    //}
    return valResult;
}