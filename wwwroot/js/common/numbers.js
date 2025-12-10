Number.prototype.display = function (nDecimal) {
    let languageSet = false; // seto como portugues, aqui não sei se vamos deixar nossos sistemas multlingua sempre
    if (typeof _user !== 'undefined') {
        languageSet = _user.language.includes('en');
    }

    nDecimal = (nDecimal == undefined ? 2 : nDecimal);
    const param = {
        minimumFractionDigits: nDecimal,
        maximumFractionDigits: nDecimal
    };
    let result = '';
    if (languageSet) {
        result = this.toLocaleString("en-US", param);
    } else {
        result = this.toLocaleString("pt-BR", param);
    }
    return result;
};