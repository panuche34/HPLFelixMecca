class DependentIndex {
    constructor() {
        this._CONTROLLER_NAME = 'Children'
        this._table = null;
        //this._initTable();
    }

    _initTable() {
        this._table = new TableGr({
            idTable: 'tbl-items',
            searching: true,
            columnDefs: [
                { targets: [0], visible: false },
                { targets: [1, 2, 3, 4, 5], className: 'dt-center' }
            ],
            order: [2, 'asc'],
            serverSide: true,
            processing: true,
            isUseCache: false,
            cacheForSession: false,
            endPointList: `/${this._CONTROLLER_NAME}/ListForDataTable`
        });
    }

    editClick(row, choice) {
        const objLinha = this._table.table().row(row).data();
        window.location.href = `/${this._CONTROLLER_NAME}/Crud/${objLinha.Id}`;
    }

    async deleteClick(row, choice) {
        showModal(`modal-delete-item`);
        const button = document.getElementById("btn-delete-item");
        const objLinha = this._table.table().row(row).data();
        const this_ControllerName = this._CONTROLLER_NAME;
        const this_Table = this._table;
        async function delCallBack() {
            button.removeEventListener("click", async () => { });
            hideModal();

            try {
                await gFetch.get(`/${this_ControllerName}/Delete/`, { id: objLinha.Id }, fetchUtils.MethodParamType.FromQuery);
                this_Table.reload();
                userAlertSuccess()
            } catch (error) {
                userAlert("Erro", error.message, 'danger')
            }
        }
        button.addEventListener("click", delCallBack);
    }

    reactiveClick = async function (row, choice) {
        try {
            const objLinha = this._table.table().row(row).data();
            await gFetch.get(`/${this._CONTROLLER_NAME}/Reactive/`, { id: objLinha.Id }, fetchUtils.MethodParamType.FromQuery);
            this._table.reload();
            userAlertSuccess()
        } catch (error) {
            userAlert("Erro", error.message, 'danger')
        }
    }
}
const controller = new DependentIndex();