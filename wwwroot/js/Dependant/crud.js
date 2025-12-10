class SectorCrud {
    constructor() {
        this._init();
    }

    _init() {
        
    }

    save() {
        event.preventDefault();
        $("#cover-spin").show();

        const isInvalid = new FormValidate().valid('frm-crud');
        if (isInvalid <= 0)
            return;

        const frmSave = document.getElementById('frm-crud');
        frmSave.submit();
    }
}
const controller = new SectorCrud();