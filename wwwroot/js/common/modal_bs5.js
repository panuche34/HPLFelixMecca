let modal = null;
var showModal = function (id) {
    modal = new bootstrap.Modal(document.getElementById(id), {
        keyboard: false
    });
    modal.show();
}

var hideModal = function (id) {
    if (modal != null) {
        modal.hide();
    }
}