class FormValues {
    get(container) {
        if (container === undefined) {
            container = 'html';
        } else {
            container = `#${container}`;
        }
        const elements = document.querySelectorAll(`${container} [field]`);
        if ((elements === undefined) || (elements === null) || (elements.length <= 0)) {
            return null;
        }
        let model = {};
        for (const el of elements) {
            const fieldName = el.getAttribute('id');
            if (el.tagName === 'SELECT') {
                model[fieldName] = el.value.match(/\d+/g) !== null ? parseFloatGr(el.value) : el.value;
                model[`${fieldName}Str`] = el.options[el.selectedIndex].text;
            } else if (el.type == 'checkbox') {
                model[fieldName] = el.checked;
            } else {
                switch (el.tagName) {
                    case 'INPUT':
                    case 'TEXTAREA':
                        model[fieldName] = el.classList.contains('money') ? parseFloatGr(el.value) : el.value;
                        break;
                    default:
                        model[fieldName] = el.classList.contains('money') ? parseFloatGr(el.value) : el.value;
                        break
                }
            }
        }
        return model;
    }

    set(container, model) {
        if (container === undefined) {
            container = 'html';
        } else {
            container = `#${container}`;
        }
        const elements = document.querySelectorAll(`${container} [field]`);
        if ((elements === undefined) || (elements === null) || (elements.length <= 0)) {
            return null;
        }

        for (const el of elements) {
            const fieldName = el.getAttribute('id');
            if (el.tagName === 'SELECT') {
                const opcaoDesejada = Array
                    .from(el.options)
                    .find(option => option.value == model[fieldName]);

                if (opcaoDesejada) {
                    opcaoDesejada.selected = true;
                }
            } else {
                switch (el.tagName) {
                    case 'INPUT':
                    case 'TEXTAREA':
                        el.value = model[fieldName];
                        break;
                    default:
                        el.value = model[fieldName];
                }
            }
        }
    }

    copyTo(fromObj, toObj) {
        for (const prop in fromObj) {
            if ((fromObj.hasOwnProperty(prop)) && (toObj.hasOwnProperty(prop))) {
                toObj[prop] = fromObj[prop];
            }
        }
    }

    appPropTo(fromObj, toObj) {
        for (const prop in fromObj) {
            toObj[prop] = fromObj[prop];
        }
    }

    clear(container) {
        if (container === undefined) {
            container = 'html';
        } else {
            container = `#${container}`;
        }
        const elements = document.querySelectorAll(`${container} [field]`);
        if ((elements === undefined) || (elements === null) || (elements.length <= 0)) {
            return null;
        }

        for (const el of elements) {
            if (el.tagName === 'SELECT') {
                el.selectedIndex = 0;
            } else {
                switch (el.tagName) {
                    case 'INPUT':
                    case 'TEXTAREA':
                        el.value = "";
                        break;
                    default:
                        el.value = "";
                }
            }
        }
    }
}