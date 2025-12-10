class BaseList {
    constructor() {
        this._basePath = window.location.pathname;
        this._table = null;
    }

    //edit(rowId) {
    //    if (this._hasOwnEdit("edit")) {
    //        this.edit(rowId);
    //    } else {
    //        window.location.href = `${this._basePath}/Crud/${rowId}`;
    //    }
    //}

    //async delete(rowId) {
    //    if (this._hasOwnEdit("delete")) {
    //        this.delete(rowId);
    //    } else {
    //        gLayout.modalDeleteShow(async () => {
    //            try {
    //                const result = await gFetch.get(`${this._basePath}/Delete/`, { id: rowId }, FetchUtils.MethodParamType.FromQuery);
    //                if ((result) && (result.HasError)) {
    //                    throw new Error(result.Message);
    //                }

    //                this._table.reload();
    //                gToast.showSuccess('Item Excluido!');
    //            } catch (error) {
    //                gToast.showDanger(`Error: ${error.message}`);
    //            }
    //        });
    //    }
    //}

    //async reactive(rowId) {
    //    if (this._hasOwnEdit("reactive")) {
    //        this.reactive(rowId);
    //    } else {
    //        try {
    //            const result = await gFetch.get(`${this._basePath}/Reactive/`, { id: rowId }, FetchUtils.MethodParamType.FromQuery);
    //            if ((result) && (result.HasError)) {
    //                throw new Error(result.Message);
    //            }
    //            this._table.reload();
    //            gToast.showSuccess("sucesso!");
    //        } catch (error) {
    //            gToast.showDanger(`Error: ${error.message}`);
    //        }
    //    }
    //}

    _hasOwnEdit(className) {
        return Object.getPrototypeOf(this).hasOwnProperty(className);
    }
}