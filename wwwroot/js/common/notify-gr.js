var _notifyGr = function (msg, type) {

    let _icon = 'glyphicon glyphicon-ok-sign';
    let sTitle = '<strong>Sucesso!! </strong><br/>';
    let sMsg = (msg === undefined ? 'Operação realizada.' : msg);
    switch (type) {
        case 'danger': sTitle = '<strong>Ops!! </strong><br/>';
            sMsg = '' + //'Informe o erro abaixo e tente novamente. Por Favor! <br/>' +
                (msg === undefined ? '' : msg);
            _icon = 'glyphicon glyphicon-thumbs-down';
            break;
        case 'warning': sTitle = '<strong>Atenção!! </strong><br/>';
            _icon = 'glyphicon glyphicon-warning-sign';
            break;
        case 'info': sTitle = '<strong>Aviso!! </strong><br/>';
            _icon = 'glyphicon glyphicon-info-sign';
            break;
    }


    $.notify(
        {
            message: sMsg,
            title: sTitle,
            icon: _icon
        },
        {
            type: (((type === undefined) || (type ==='')) ? 'success' : type),
            allow_dismiss: false,
            placement: {
                from: 'bottom',
                align: 'center'
            },
            animate: {
                enter: "animated fadeInUp",
                exit: "animated fadeOutDown"
            }
        });
};