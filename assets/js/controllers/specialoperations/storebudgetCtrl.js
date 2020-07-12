app.controller('storebudgetCtrl', storebudgetCtrl);
function storebudgetCtrl($rootScope, $scope, NG_SETTING, $translate, $element,localStorageService) {
    $rootScope.uService.EnterController("storebudgetCtrl");
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
    $scope.dataGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxstorebudget",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxstorebudget",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxstorebudget",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxstorebudget",
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
            { dataField: "id", caption: "ID", allowEditing: false  },

          
            {
                dataField: "StoreID", caption: "Store",
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStore",
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
            }  ,
            { dataField: "Year",caption: "Year", allowEditing: true },  
            { dataField: "Week",caption: "Week", allowEditing: true },  
            { dataField: "Sales",caption: "Sales", allowEditing: true },  
            { dataField: "TC",caption: "TC", allowEditing: true },  
            { dataField: "NewCustomers",caption: "NewCustomers", allowEditing: true },  
            // { dataField: "Sales InStore",caption: "SalesInStore", allowEditing: true },  
            // { dataField: "TC InStore",caption: "TCInStore", allowEditing: true },  
            // { dataField: "Sales TakeAway",caption: "SalesTakeAway", allowEditing: true },
            // { dataField: "TC TakeAway",caption: "TCTakeAway", allowEditing: true },  
            // { dataField: "Sales Delivery",caption: "SalesDelivery", allowEditing: true },  
            // { dataField: "TC Delivery",caption: "TCDelivery", allowEditing: true },    

                       
        ],
        export: { enabled: true, fileName: "storebudgetlist", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("storebudgetCtrl");
    });
};