app.controller('shiftplanedit2Ctrl', shiftplanedit2Ctrl);
function shiftplanedit2Ctrl($rootScope, $scope, NG_SETTING, $translate, $element, localStorageService,$http) {
    $rootScope.uService.EnterController("shiftplanedit2Ctrl");
    var ngurr = this;
    $scope.NGUserRoleID = '';

    $scope.translate = function () {
        $scope.trNGUser = $translate.instant('main.USER');
        $scope.trLaborCostType = $translate.instant('main.LABORCOSTTYPE');
        $scope.trStaffPosition = $translate.instant('main.STAFFPOSITION');
        $scope.trD1ShiftStart = $translate.instant('main.D1SHIFTSTART');
        $scope.trD1ShiftEnd = $translate.instant('main.D1SHIFTEND');
        $scope.trD1isOff = $translate.instant('main.D1ISOFF');
        $scope.trD2ShiftStart = $translate.instant('main.D2SHIFTSTART');
        $scope.trD2ShiftEnd = $translate.instant('main.D2SHIFTEND');
        $scope.trD2isOff = $translate.instant('main.D2ISOFF');
        $scope.trD3ShiftStart = $translate.instant('main.D3SHIFTSTART');
        $scope.trD3ShiftEnd = $translate.instant('main.D3SHIFTEND');
        $scope.trD3isOff = $translate.instant('main.D3ISOFF');
        $scope.trD4ShiftStart = $translate.instant('main.D4SHIFTSTART');
        $scope.trD4ShiftEnd = $translate.instant('main.D4SHIFTEND');
        $scope.trD4isOff = $translate.instant('main.D4ISOFF');
        $scope.trD5ShiftStart = $translate.instant('main.D5SHIFTSTART');
        $scope.trD5ShiftEnd = $translate.instant('main.D5SHIFTEND');
        $scope.tr51isOff = $translate.instant('main.D5ISOFF');
        $scope.trD6ShiftStart = $translate.instant('main.D6SHIFTSTART');
        $scope.trD6ShiftEnd = $translate.instant('main.D6SHIFTEND');
        $scope.trD6isOff = $translate.instant('main.D6ISOFF');
        $scope.trD7ShiftStart = $translate.instant('main.D7SHIFTSTART');
        $scope.trD7ShiftEnd = $translate.instant('main.D7SHIFTEND');
        $scope.trD7isOff = $translate.instant('main.D7ISOFF');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.delete = $translate.instant('main.DELETE');

    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });

    var OrderSourceDataSource = {
        store: new DevExpress.data.CustomStore({
            key: "id",
            //loadMode: "raw",
            load: function() {
                // Returns an array of objects that have the following structure:
                // { id: 1, name: "John Doe" }
                //return $.getJSON(NG_SETTING.apiServiceBaseUri + "/api/ordersource");
                return $http.get(NG_SETTING.apiServiceBaseUri + "/api/ShiftPlanItem")
                                    .then(function (response) {
                                        return {
                                            data: response.data,
                                            totalCount: 10
                                        };
                                    }, function (response) {
                                        return $q.reject("Data Loading Error");
                                    });
            }
        }),
        sort: "name"
    }
    var lookupDataSource2 = {
        store: new DevExpress.data.CustomStore({
            key: "id",
            loadMode: "raw",
            load: function() {
                // Returns an array of objects that have the following structure:
                // { id: 1, name: "John Doe" }
                return $.getJSON(NG_SETTING.apiServiceBaseUri + "/api/ShiftPlan");
            }
        }),
        sort: "name"
    }
    $scope.dataGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/ShiftPlanItem",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/ShiftPlanItem",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/ShiftPlanItem",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/ShiftPlanItem",
            onBeforeSend: function (method, ajaxOptions) {
                //if (request.method === "PUT") {
                //    updateUrl = NG_SETTING.apiServiceBaseUri + "/api/dxUser"+
                //}
                var authData = localStorageService.get('authorizationData');
                if (authData) {

                    ajaxOptions.headers = {
                        Authorization: 'Bearer ' + authData.token//,
                        //'Content-type': 'application/json'
                    };
                }
            }
        }),
        //filterValue: getFilter(),
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: false,
        showRowLines: true,
        rowAlternationEnabled: true,
        showBorders: true,
        allowColumnReordering: true,
        filterRow: { visible: true },
        filterPanel: { visible: true },
        headerFilter: { visible: true },
        //grouping: { autoExpandAll: false },
        searchPanel: { visible: true },
        //groupPanel: { visible: true },
        editing: {
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            allowInserting: true,
            useIcons: true,
            mode: "popup",
            popup: {
                title: "Edit Details",
                showTitle: true,
                // width: 700,
                // height: 525,
                // position: {
                //     my: "top",
                //     at: "top",
                //     of: window
                // }
            }
        },
        columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        remoteOperations: true,
        columns: [
            { dataField: "name", caption: "Name", allowEditing: true },
            { dataField: "description", caption: "Description", allowEditing: true },
            {
                dataField: "BonusSettingID", caption: "Bonus Setting",
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxBonusSetting",
                            onBeforeSend: function (method, ajaxOptions) {
                                var authData = localStorageService.get('authorizationData');
                                if (authData) {
                                    ajaxOptions.headers = {
                                        Authorization: 'Bearer ' + authData.token,
                                        
                                    };
                                }
                            }
                        }),
                        sort: "name",
                        headerFilter: { allowSearch: true }
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }
                },
            },
            {
                dataField: "isActiveFilter", caption: "Filter",
                lookup: {
                    valueExpr: "id",
                    displayExpr: "Name",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxFilter",
                            onBeforeSend: function (method, ajaxOptions) {
                                var authData = localStorageService.get('authorizationData');
                                if (authData) {
                                    ajaxOptions.headers = {
                                        Authorization: 'Bearer ' + authData.token,                                        
                                    };
                                }
                            }
                        }),
                        sort: "Name",
                        headerFilter: { allowSearch: true }
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }
                },
            },
            { dataField: "fk_ObjectUpdate_id", caption: "DokumanNummer"  },
            { dataField: "isActiveValue", caption: "ActiveValue"  },
            { dataField: "ConfirmImmediately", caption: "ConfirmImmediately"  },
            { dataField: "Multiplier", caption: "Multiplier"  },
            { dataField: "BonusTransactionEventID", caption: "BonusTransaction"  },
             {
                dataField: "OrderSourceID", caption: "Order Source",
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    dataSource: OrderSourceDataSource,
                },

            } ,
            


        ],
        export: { enabled: true, fileName: "bonusearningrulelist", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("bonusearningruleCtrl");
    });
};