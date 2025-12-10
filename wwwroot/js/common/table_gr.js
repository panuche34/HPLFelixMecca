class TableGr {
    constructor(options) {

        this._table = null;
        this._tableId = "";
        this._objCols = null;
        this._isUseCacheLoadTime = true;
        this._defineTypesDate = [];

        this.create(options)
    }

    adjust(millisecondsToTimeout) {
        if (!millisecondsToTimeout) {
            millisecondsToTimeout = 1000;
        }
        setTimeout(() => { this._table.columns.adjust(); }, millisecondsToTimeout);
    }

    create(options) {
        let _table = null;
        options = $.extend({
            serverSide: false,
            processing: false,
            changeCallBack: null,
            onAjaxSuccessCallBack: null,
            visibleFirstColumn: false,
            isSelect: false,
            searching: true,
            paging: true,
            initComplete: null,
            info: true,
            bFilter: false,
            bLengthChange: false,
            autoWidth: true,
            scrollX: true,
            isUseCache: true,
            cacheForSession: false,
            language: {
                //    url: "//cdn.datatables.net/plug-ins/1.10.20/i18n/Portuguese-Brasil.json"
                sSearch: ""
            },
            columnDefs: [
                { targets: [0], visible: options.visibleFirstColumn },
                { targets: [0], orderable: false },
                { targets: [0], className: (options.visibleFirstColumn ? 'dt-center' : 'dt-left') },
                { targets: [1], orderable: options.visibleFirstColumn },
                { targets: [1], className: (options.visibleFirstColumn ? 'dt-left' : 'dt-center') }
            ],
            success: (d) => {
                _table.draw();
            },
            //"rowCallback": function (row, data, index) {
            //    setTimeout(function () {
            //        this._table.columns.adjust().draw();
            //    }, 100);
            //},
            infoCallback: function (settings, start, end, max, total, pre) {
                if ((options.changeCallBack != null) && (total > 0)) {
                    options.changeCallBack(_table);
                }
                return `${start} de ${end} de ${max}`;
            }
        }, options);

        this._tableId = options.idTable;
        if (options.columns === undefined) {
            const grid = document.querySelector(`#${this._tableId}`);
            const cols = grid.querySelectorAll('th');
            const gridCols = new Array();
            for (const th of cols) {
                const prop = th.getAttribute('property');
                if (prop != null) {
                    gridCols.push({ data: prop });
                    const propType = th.getAttribute('property-type');
                    if (propType != null) {
                        this._defineTypesDate.push({ prop: prop, type: propType })
                    }
                }
            }
            options.columns = gridCols;
        }
        if (options.isSelect) {
            options.select = {
                style: 'single'
            };
        }

        let handleError = function (xhr) {
            if (xhr !== undefined)
                new _notifyGr(xhr.responseText, 'danger');
            return '';
        };       

        if ((options.onAjaxErrorCallback !== undefined) && (options.onAjaxErrorCallback !== '')) {
            handleError = onAjaxErrorCallback;
        }
        let _data = null;
        if ((options.endPointList !== undefined) && (options.endPointList !== '')) {
            if (options.serverSide === true) {
                options.ajax = {
                    url: options.endPointList,
                    type: "POST",
                    //headers: {
                    //    'X-XSRF-TOKEN': getCookie('obras.mayaragallo.com.br')
                    //},
                    data: (d) => {
                        const formValues = new FormValues();
                        let model = null;
                        if ((options.isUseCache) && (this._isUseCacheLoadTime)) {
                            const cache = options.cacheForSession ?
                                this._getSearchToSessionStorage() : this._getSearchToLocalStorage();
                            if (cache == null) {
                                model = new FormValues().get('form-filter')
                            } else {
                                formValues.set('form-filter', cache);
                                model = cache;
                            }
                            this._isUseCacheLoadTime = false;
                        } else {
                            model = new FormValues().get('form-filter')
                        }
                        formValues.appPropTo(model, d);
                        if (options.isUseCache) {
                            options.cacheForSession ? this._setSearchToSessionStorage(d) : this._setSearchToLocalStorage(d);
                        }
                    },
                    dataFilter: function (data) {
                        if (options.onAjaxSuccessCallBack != null) {
                            var json = jQuery.parseJSON(data);
                            options.onAjaxSuccessCallBack(json.footerInfo);
                        }
                        return data; // return JSON string
                    },
                    error: handleError,
                };
            } else {
                options.ajax = {
                    url: options.endPointList,
                    headers: {
                        'X-XSRF-TOKEN': getCookie('obras.mayaragallo.com.br')
                    },
                    error: handleError,
                    dataSrc: ''
                };
            }
        }

        if ((options.dataSet !== undefined) && (options.dataSet !== null)) {
            options.data = dataSet;
        }

        if ((options.buttons !== undefined) && (options.buttons !== null)) {
            options.dom = 'Bfrtip';
            options.buttons = buttons;
        }

        this._table = $(`#${this._tableId}`).DataTable(options);
        _table = this._table;
    }

    table() {
        return this._table;
    }

    add(objNew) {
        this._setColsObj()

        new FormValues().copyTo(objNew, this._objCols)
        this._table.row.add(this._objCols).draw();
        let self = this._table;
        setTimeout(function () { self.columns.adjust().draw(); }, 1000);
    }

    addAll(arryNew) {
        this._setColsObj()

        for (const objNew of arryNew) {
            new FormValues().copyTo(objNew, this._objCols)
            this._table.row.add(this._objCols).draw();
        }

        let self = this._table;
        setTimeout(function () { self.columns.adjust().draw(); }, 1000);
    }

    reload() {
        this._table.ajax.reload();
    }

    remove(idx) {
        this._table.rows(idxToReplace).remove();
        let self = this._table;
        setTimeout(function () { self.columns.adjust().draw(); }, 1000);
    }

    removeAll(idx) {
        this._table.clear().draw();
        let self = this._table;
        setTimeout(function () { self.columns.adjust().draw(); }, 1000);
    }

    replace(idxToReplace, objNew) {
        this._setColsObj();
        new FormValues().copyTo(objNew, this._objCols)
        this._formatColsValues();
        this._table.rows(idxToReplace).remove();
        this._table.row.add(this._objCols).draw();

        let self = this._table;
        setTimeout(function () { self.columns.adjust().draw(); }, 1000);
    }

    replaceAll(arryNew) {
        this._setColsObj();

        for (const objNew of arryNew) {
            new FormValues().copyTo(objNew, this._objCols)
            this._table.rows(idxToReplace).remove();
            this._table.row.add(this._objCols).draw();
        }

        let self = this._table;
        setTimeout(function () { self.columns.adjust().draw(); }, 1000);
    }

    _formatColsValues() {
        for (const propTable in this._objCols) {
            const propFinded = this._defineTypesDate.find(f => f.prop == propTable);
            if (propFinded) {
                switch (propFinded.type) {
                    case "date":
                        const data1 = new Date(this._objCols[propTable]);
                        const opcoes1 = { year: 'numeric', month: '2-digit', day: '2-digit' };
                        const formatDate1 = data1.toLocaleString('pt-BR', opcoes1);
                        this._objCols[propTable] = formatDate1;
                        break;
                    case "datetime":
                        const data2 = new Date(this._objCols[propTable]);
                        const opcoes2 = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                        const formatDate2 = data2.toLocaleString('pt-BR', opcoes2);
                        this._objCols[propTable] = formatDate2;
                        break;
                }
            }
        }
    }

    _setColsObj() {
        if (this._objCols == null) {
            const cols = this._table.columns().header();
            this._objCols = {}
            cols.each((th, index) => {
                const prop = th.getAttribute('property');
                if (prop !== null) {
                    this._objCols[prop] = null;
                    if (prop === 'Buttons') {
                        this._objCols[prop] = _BTN_EDIT + _BTN_DELETE;
                    }
                }
            });
        }
    }

    _getSearchToLocalStorage() {
        const key = `${this._tableId.toUpperCase()}_SEARCH`;
        if (!localStorage.getItem(key)) {
            return null;
        }
        const lastSearch = localStorage.getItem(key);
        if (lastSearch == '') {
            return null;
        }

        let search = JSON.parse(lastSearch);
        if (search === undefined) {
            return null;
        }
        return search;
    }

    _setSearchToLocalStorage(filter) {
        localStorage.setItem(`${this._tableId.toUpperCase()}_SEARCH`, JSON.stringify(filter));
    }

    _getSearchToSessionStorage() {
        const key = `${this._tableId.toUpperCase()}_SEARCH`;
        if (!sessionStorage.getItem(key)) {
            return null;
        }
        const lastSearch = sessionStorage.getItem(key);
        if (lastSearch == '') {
            return null;
        }

        let search = JSON.parse(lastSearch);
        if (search === undefined) {
            return null;
        }
        return search;
    }

    _setSearchToSessionStorage(filter) {
        sessionStorage.setItem(`${this._tableId.toUpperCase()}_SEARCH`, JSON.stringify(filter));
    }

    getSelectedAllData() {
        let obj = this._table.rows('.selected').data()[0];
        if (!obj) {
            obj = []
            this._table.rows().every(function () {
                var checkbox = $(this.node()).find('input[type="checkbox"]');
                if (checkbox.is(':checked')) {
                    obj.push(this.data());
                }
            });
        }
        return obj;
    }

};