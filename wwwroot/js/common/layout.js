let _layout = function () {
    this.showModalConfirmLogOut = function () {
        showModal("modal-confirm-logout");
    }

    this.confirmLogOut = function () {
        hideModal();
        $("#cover-spin").show();
        location.href = "/Login/SignOut";
    }

    //this.showHideTextSidebar = function () {
    //    const width = window.innerWidth;
    //    if ($('.text-hide-toggle-menu').hasClass("d-sm-inline")) {
    //        if (width >= 576) {
    //            $('.sidebar').removeClass("col-md-3 col-xl-2")
    //        }
    //        $('.text-hide-toggle-menu').removeClass("d-sm-inline");
    //    }
    //    else {
    //        if (width >= 576) {
    //            $('.sidebar').addClass("col-md-3 col-xl-2")
    //        }
    //        $('.text-hide-toggle-menu').addClass("d-sm-inline");
    //    }

    //}

    this.showHideTextSidebar = function () {
        const $labels = $('.text-hide-toggle-menu');
        const isVisible = $labels.hasClass("d-sm-inline");

        if (isVisible) {
            // Esconde os textos
            $labels.removeClass("d-sm-inline");
        } else {
            // Mostra os textos
            $labels.addClass("d-sm-inline");
        }

        // Depois de mudar os textos, sincroniza a largura da sidebar
        document.dispatchEvent(new CustomEvent('thr:syncSidebar'));
    }


    var _timer = 30000;
    function getOnOffWhatsapp() {       
        const msg =
            "Para conectar o WhatsApp no App:\n\n" +
            "\u2022 Abra o WhatsApp no celular\n" +
            "\u2022 V\u00E1 em \"Dispositivos conectados\"\n" +
            "\u2022 Toque em \"Conectar um dispositivo\"\n" +
            "\u2022 Acesse o modulo \"Whatsapp QR Code\"\n" +
            "\u2022 Aponte a c\u00E2mera para o QR Code";
    $.ajax({
        type: "GET",
        url: "/Home/GetStatusWhatsapp",
        dataType: "json",
        success: function (response) {
            _timer = 30000;
            console.log("Resposta recebida:", response); // Para depuração
            console.log("Valor de IsWhatsapp:", response.IsWhatsapp, "Tipo:", typeof response.IsWhatsapp); // Para verificar o valor
           

            $('#spanWhatsapp').removeClass("cursor-pointer").off('click', callWhatsappQRCode);
            if (response.IsWhatsapp.trim() === 'A') {                
                $('#spanWhatsapp').text("Whatsapp Conectado");
                $('#spanWhatsapp').css({ "background-color": "#198754"});
                if (window.location.pathname.indexOf('/WhatsappQRCode') !== -1) {
                    window.location.href = '/Home/';
                }
            }
            else if (response.IsWhatsapp.trim() === 'D') {               
                _timer = 3000;
                $('#spanWhatsapp').text("Whatsapp Desconectado");
                $('#spanWhatsapp').css({ "background-color": "#DC3545" });
                $('#spanWhatsapp').addClass("cursor-pointer");
                $('#spanWhatsapp').click(() => {
                    alert(msg);
                   // window.location.href = '/WhatsappQRCode/';
                });
            }            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Erro na requisição:", textStatus, errorThrown); // Log de erro
        },
        complete: function () {
            setTimeout(getOnOffWhatsapp, _timer);
        }
    });

    }
    var callWhatsappQRCode = () => {
        //$.ajax({
        //    type: "GET",
        //    url: "/WhatsappQRCode/",
        //    dataType: "json",
        //    success: function (response) {
        //        console.log(response);
        //    }
        //});
        if (e && e.preventDefault) e.preventDefault();

        const msg =
            "Para conectar o WhatsApp Web:\n\n" +
            "\u2022 Abra o WhatsApp no celular\n" +
            "\u2022 V\u00E1 em \"Dispositivos conectados\"\n" +
            "\u2022 Toque em \"Conectar um dispositivo\"\n" +
            "\u2022 Aponte a c\u00E2mera para o QR Code";

        alert(msg); 

    }
$(document).ready(function() {
    getOnOffWhatsapp();
});

    $(function () {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        })
    });

    //#endregion
}
var layout = new _layout();