class fetchUtils {

    static MethodParamType = {

        FromBody: 'FromBody',
        FromForm: 'FromForm',
        FromQuery: 'FromQuery',
        FromRoute: 'FromRoute'
    };

    static MethodType = {
        DELETE: 'DELETE',
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        INSERT: 'INSERT'
    };

    constructor() {
        this._token = null;
        this._divNomesobrenome = document.getElementById('nomesobrenome');
    }

    _getDataFormFrom(dataFormRef, dataToSender) {
        for (let propriedade in dataToSender) {
            if (dataToSender.hasOwnProperty(propriedade)) {
                const valor = dataToSender[propriedade];
                dataFormRef.append(propriedade, valor);
            }
        }
    }

    _fetchPrepare(url, dataToSender, methodType, methodParamType) {
        const data = {
            method: methodType === undefined ? fetchUtils.MethodType.POST : fetchUtils.MethodType[methodType],
            // mode: 'cors', // Se a chamada for para outro domínio, você pode definir o modo CORS
            // credentials: 'same-origin', // Se necessário, você pode enviar as credenciais do usuário
            // cache: 'no-cache', // Se necessário, você pode definir a política de cache
        };

        let contentType = 'application/json; charset=utf-8';
        let body = null;
        let queryString = '';
        let urlSender = url;
        switch (methodParamType) {
            case fetchUtils.MethodParamType.FromForm:
                contentType = 'application/x-www-form-urlencoded; charset=utf-8';
                body = new URLSearchParams();
                this._getDataFormFrom(body, dataToSender)
                data.body = body.toString();
                break;
            case fetchUtils.MethodParamType.FromQuery:
                if (dataToSender === undefined) {
                    queryString = "";
                } else {
                    queryString = Object.keys(dataToSender)
                        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(dataToSender[key]))
                        .join('&');
                }
                urlSender += queryString == '' ? '' : `?${queryString}`;
                break;
            case fetchUtils.MethodParamType.FromRoute:
                queryString = Object.keys(dataToSender)
                    .map(key => encodeURIComponent(dataToSender[key]))
                    .join('/');
                urlSender += urlSender.endsWith('/') ? '' : '/';
                urlSender += queryString;
                break;
            case fetchUtils.MethodParamType.FromBody:
                data.body = JSON.stringify(dataToSender);
                //${ new URLSearchParams(body) }
                break;
            // teoricamente se a action fosse sem o [FromBody] deveria funcioinar igual
            //, mas não, tem que mandar assim, agora preciso ver se é só no post
            default:
                contentType = '';
                body = new FormData();
                this._getDataFormFrom(body, dataToSender);
                data.body = body;
                break;
        }

        const hders = new Headers();
        if (contentType !== '') {
            hders.append('Content-Type', contentType);
        }
        if (this._token) {
            hders.append('Authorization', 'Bearer ' + this._token);
        }
        data.headers = hders;
        return {
            data: data,
            urlSender: urlSender
        };
    }

    async _fetch(url, data, showSpinnerProccess) {
        let req = await fetch(url, data);

        if (req.status == 401) {
            location.href = '/login';
        }
        if (!req.ok) {
            const txt = await req.text();
            throw new Error(txt);
        }

        const resp = await req.text();
        if ((resp == null) || (resp == "")) {
            return null;
        } else {
            const respJson = JSON.parse(resp);
            return respJson;
        }
        return null;
    }

    async delete(url, dataToSender, methodParamType, showSpinnerProccess) {
        const fetchPrepare = this._fetchPrepare(url, dataToSender, fetchUtils.MethodType.DELETE, methodParamType)
        return await this._fetch(fetchPrepare.urlSender, fetchPrepare.data, showSpinnerProccess);
    }

    async get(url, dataToSender, methodParamType, showSpinnerProccess) {
        if ((methodParamType === fetchUtils.MethodParamType.FromForm) || (methodParamType === fetchUtils.MethodParamType.FromBody)) {
            throw new Error("Get, não pode conter informação no body, ou seja, não funciona para FromForm e FromBody");
        }

        if (methodParamType === undefined) {
            methodParamType = fetchUtils.MethodParamType.FromBody;
        }

        const fetchPrepare = this._fetchPrepare(url, dataToSender, fetchUtils.MethodType.GET, methodParamType)
        return await this._fetch(fetchPrepare.urlSender, fetchPrepare.data, showSpinnerProccess);
    }

    async post(url, dataToSender, methodParamType, showSpinnerProccess) {
        if (methodParamType === undefined) {
            methodParamType = fetchUtils.MethodParamType.FromQuery;
        }
        const fetchPrepare = this._fetchPrepare(url, dataToSender, fetchUtils.MethodType.POST, methodParamType)
        return await this._fetch(fetchPrepare.urlSender, fetchPrepare.data, showSpinnerProccess);
    }

    async put(url, dataToSender, methodParamType, showSpinnerProccess) {
        const fetchPrepare = this._fetchPrepare(url, dataToSender, fetchUtils.MethodType.DELETE, methodParamType)
        return await this._fetch(fetchPrepare.urlSender, fetchPrepare.data, showSpinnerProccess);
    }

    async exMyAjax() {
        const nome = document.getElementById('nome');
        const sobrenome = document.getElementById('sobrenome');
        const dataToSender = {
            nome: nome.value,
            sobrenome: sobrenome.value
        };

        let ret = await this.post('/Home/FromForm/', dataToSender, fetchUtils.MethodParamType.FromForm);
        let log = `post/FromForm: ${JSON.stringify(ret)}`;

        ret = await this.post('/Home/FromBody/', dataToSender, fetchUtils.MethodParamType.FromBody);
        log += `<br />post/FromBody: ${JSON.stringify(ret)}`;

        ret = await this.post('/Home/FromNoBody/', dataToSender);
        log += `<br />post/FromNoBody: ${JSON.stringify(ret)}`;

        ret = await this.post('/Home/FromQuery/', dataToSender, fetchUtils.MethodParamType.FromQuery);
        log += `<br />post/FromQuery/: ${JSON.stringify(ret)}`;

        ret = await this.post('/Home/FromQuery', dataToSender, fetchUtils.MethodParamType.FromQuery);
        log += `<br />post/FromQuery: ${JSON.stringify(ret)}`;

        ret = await this.post('/Home/FromRoute/', dataToSender, fetchUtils.MethodParamType.FromRoute);
        log += `<br />post/FromRoute/: ${JSON.stringify(ret)}`;

        ret = await this.post('/Home/FromRoute', dataToSender, fetchUtils.MethodParamType.FromRoute);
        log += `<br />post/FromRoute: ${JSON.stringify(ret)}`;

        //// get
        ret = await this.get('/Home/GetFromForm/', dataToSender, fetchUtils.MethodParamType.FromForm);
        log += `<br /><br />get/FromForm: ${JSON.stringify(ret)}`;

        ret = await this.get('/Home/GetFromBody/', dataToSender, fetchUtils.MethodParamType.FromQuery);
        log += `<br />get/FromBody: ${JSON.stringify(ret)}`;

        ret = await this.get('/Home/GetFromNoBody/', dataToSender);
        log += `<br />get/FromNoBody: ${JSON.stringify(ret)}`;

        ret = await this.get('/Home/GetFromQuery/', dataToSender, fetchUtils.MethodParamType.FromQuery);
        log += `<br />get/FromQuery/: ${JSON.stringify(ret)}`;

        ret = await this.get('/Home/GetFromQuery', dataToSender, fetchUtils.MethodParamType.FromQuery);
        log += `<br />get/FromQuery: ${JSON.stringify(ret)}`;

        ret = await this.get('/Home/GetFromRoute/', dataToSender, fetchUtils.MethodParamType.FromRoute);
        log += `<br />get/FromRoute/: ${JSON.stringify(ret)}`;

        ret = await this.get('/Home/GetFromRoute', dataToSender, fetchUtils.MethodParamType.FromRoute);
        log += `<br />get/FromRoute: ${JSON.stringify(ret)}`;

        this._divNomesobrenome.innerHTML = log;
    }
}
var gFetch = new fetchUtils();