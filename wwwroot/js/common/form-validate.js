class FormValidate {
    debugger;
    valid(container) {
        if (container === undefined) {
            container = 'html';
        } else {
            container = `#${container}`;
        }
        const elements = document.querySelectorAll(`${container} [required]`);
        if ((elements === undefined) || (elements === null) || (elements.length <= 0)) {
            return -2;
        }

        let retorno = 1;
        for (const el of elements) {
            if (el.tagName === 'SELECT') {
                if ((el.value === '') || (el.value === '0')) {
                    const msg = el.getAttribute('valid-message')
                    if (msg !== undefined) {
                        retorno = 0;
                        alert(msg);
                    }
                }
            } else if (el.tagName === 'INPUT') {
                if (el.value === '') {
                    const msg = el.getAttribute('valid-message')
                    if (msg !== undefined) {
                        retorno = 0;
                        alert(msg);
                    }
                }
                //if ((el.classList.contains('money')) && (el.classList.contains('more-zero'))) {
                if (el.hasAttribute('more-zero')) {
                    const floatValue = parseFloatGr(el.value);
                    if (floatValue <= 0) {
                        const msg = el.getAttribute('valid-message')
                        if (msg !== undefined) {
                            retorno = 0;
                            alert(msg);
                        }
                    }
                }
            }
        }
        return retorno;
    }
}

