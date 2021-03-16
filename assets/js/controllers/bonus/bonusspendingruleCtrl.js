app.controller('bonusspendingruleCtrl', bonusspendingruleCtrl);
function bonusspendingruleCtrl($rootScope, $scope, NG_SETTING, $translate,$http, $element,localStorageService) {
    $rootScope.uService.EnterController("bonusspendingruleCtrl");
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
            load: function () {
                // Returns an array of objects that have the following structure:
                // { id: 1, name: "John Doe" }
                //return $.getJSON(NG_SETTING.apiServiceBaseUri + "/api/ordersource");
                return $http.get(NG_SETTING.apiServiceBaseUri + "/api/ordersource")
                    .then(function (response) {
                        return {
                            data: response.data.Items,
                            totalCount: 10
                        };
                    }, function (response) {
                        return $q.reject("Data Loading Error");
                    });
            }
        }),
        sort: "name"
    }
    var BonusTransactionEventDS = {
        store: new DevExpress.data.CustomStore({
            key: "Value",
            load: function () {
                return $http.get(NG_SETTING.apiServiceBaseUri + "/api/enums/BonusTransactionEvent")
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
        sort: "Value"
    }
    var lookupDataSource2 = {
        store: new DevExpress.data.CustomStore({
            key: "id",
            loadMode: "raw",
            load: function () {
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
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxBonusSpendingRule",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxBonusSpendingRule",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxBonusSpendingRule",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxBonusSpendingRule",
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
            useIcons: true
        },
        columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        remoteOperations: true,
        columns: [
            { dataField: "name", caption: $translate.instant('bonusearningrule.Name'), allowEditing: true },
            {
                dataField: "BonusSettingID", caption:$translate.instant('bonusspendingrule.BonusSetting'),
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
                                        'Content-type': 'application/json'
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
                dataField: "isActiveFilter", caption: $translate.instant('punchcardearningrule.isActiveFilter'),
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
                                        'Content-type': 'application/json'
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
            } ,
            {
                dataField: "BonusTransactionEventID", caption: $translate.instant('bonusspendingrule.BonusTransaction'),
                lookup: {
                    valueExpr: "Value",
                    displayExpr: "Name",
                    dataSource: BonusTransactionEventDS,
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }
                }
            },
            {
                dataField: "OrderSourceID", caption: $translate.instant('punchcardearningrule.OrderSourceID'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    dataSource: OrderSourceDataSource,
                },

            },
                       
        ],
        export: { enabled: true, fileName: "bonusspendingrulelist", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("bonusspendingruleCtrl");
    });
};