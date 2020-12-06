app.controller('bonusearningruleCtrl', bonusearningruleCtrl);
function bonusearningruleCtrl($rootScope, $scope, NG_SETTING, $translate, $element, localStorageService,$http) {
    $rootScope.uService.EnterController("bonusearningruleCtrl");
    var ngurr = this;
    $scope.NGUserRoleID = '';

    $scope.translate = function () {
        $scope.trUserRole = $translate.instant('main.USERROLE');
        $scope.trUserRestriction = $translate.instant('main.USERRESTRICTIONS');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    var OrderSourceDataSource = {
        store: new DevExpress.data.CustomStore({
            key: "id",
            //loadMode: "raw",
            load: function() {
                return $http.get(NG_SETTING.apiServiceBaseUri + "/api/ordersource")
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
                return $.getJSON(NG_SETTING.apiServiceBaseUri + "/api/ordersource");
            }
        }),
        sort: "name"
    }
    $scope.dataGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxBonusEarningRule",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxBonusEarningRule",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxBonusEarningRule",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxBonusEarningRule",
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
            { name:"Name", dataField: "name", caption: "Name", allowEditing: true },
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
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("bonusearningruleCtrl");
    });
};