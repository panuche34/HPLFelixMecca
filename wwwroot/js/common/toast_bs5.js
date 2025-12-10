function userAlert(title, description, type) {
    $("#title-toast").text(title);
    $("#description-toast").text(description);

    switch (type) {
        case "danger":
            $('#liveToast').css("background-color", "#D34346");
            break;
        case "warning":
            $('#liveToast').css("background-color", "#FCE852");
            break;
        case "success":
            $('#liveToast').css("background-color", "#43D36A");
            break;
        default:
    }

    var toastById = document.getElementById('liveToast');
    var toastCreated = bootstrap.Toast.getOrCreateInstance(toastById);
    toastCreated._config.delay = 5000;
    toastCreated.show();
}

function userAlertSuccess() {
    $("#title-toast").text("OK");
    $("#description-toast").text("Atividade realizada com sucesso.");
    $('#liveToast').css("background-color", "#43D36A");

    var toastById = document.getElementById('liveToast');
    var toastCreated = bootstrap.Toast.getOrCreateInstance(toastById);
    toastCreated._config.delay = 5000;
    toastCreated.show();
}