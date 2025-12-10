String.prototype.toFloat = function () {
    let num = this;
    num = num.replace('.', ';');
    num = num.replace(',', '.');
    num = num.replace(';', '');
    var aux = parseFloat(num);
    if (isNaN(aux))
        return 0;
    else
        return aux;
};

var isInteger = function (obj) {
    obj.value = obj.value.match(/\d+/g);
};

String.prototype.toInt = function () {
    let num = this;
    if (!isInteger(num))
        return 0;
    return parseInt(num, 10);
};
