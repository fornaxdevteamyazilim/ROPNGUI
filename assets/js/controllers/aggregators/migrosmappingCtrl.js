app.controller('migrosmappingCtrl', migrosmappingCtrl);
function migrosmappingCtrl($rootScope, $scope, NG_SETTING, $translate, $element, localStorageService, $http, $window, $stateParams, Restangular, toaster, $filter) {
    $rootScope.uService.EnterController("migrosmappingCtrl");
    $scope.translate = function () {
        //$scope.trNGUser = $translate.instant('main.USER');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.storeGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMigrosStore",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMigrosStore",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMigrosStore",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMigrosStore",
        }),
        //filterValue: getFilter(),
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
            allowInserting: true
        },
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        remoteOperations: true,
        columns: [
            { dataField: "id", caption: "id", visible: false },
            {
                dataField: "MemberID", caption: $translate.instant('dxMigrosStore.MemberID'), fixed: true,width: 200,   
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    searchMode:"contains",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMember" 
                        }),
                        sort: "name",
                        headerFilter: { allowSearch: true }
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }  
                },

                //fixed: true,
                //groupIndex: 0
            },
            { dataField: "name", caption: $translate.instant('dxMigrosStore.MigrosStoreName'),visibleIndex: 1 },
            {
                dataField: "AggregatorID", caption: $translate.instant('dxMigrosStore.AggregatorID'),width: 200,  
                lookup: {
                    valueExpr: "id",
                    displayExpr: "Name",
                    searchMode:"contains",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMigrosAggregator" 
                        }),
                        sort: "name",
                        headerFilter: { allowSearch: true }
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }  
                },

                //fixed: true,
                //groupIndex: 0
            },
            
            { dataField: "AggregatorStoreID", caption: $translate.instant('dxMigrosStore.AggregatorStoreID') },
            {
                dataField: "StoreID", caption: $translate.instant('dxMigrosStore.StoreID'), width: 200,    
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    searchMode:"contains",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStore" 
                        }),
                        sort: "name",
                        headerFilter: { allowSearch: true }
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }  
                },

                //fixed: true,
                //groupIndex: 0
            },
            { dataField: "averagePreparationTime", caption: $translate.instant('dxMigrosStore.averagePreparationTime') },
            // { dataField: "status", caption: $translate.instant('dxMigrosStore.status') },
            { dataField: "isCourierAvailable", caption: $translate.instant('dxMigrosStore.isCourierAvailable') },
            { dataField: "restaurantSecretKey", caption: $translate.instant('dxMigrosStore.restaurantSecretKey') },
            { dataField: "isActive", caption: $translate.instant('dxMigrosStore.isActive') },
            { dataField: "isEnabled", caption: $translate.instant('dxMigrosStore.isEnabled') },
        ],
        onRowClick: function (rowInfo) {
            if (rowInfo.rowType == "data")
                rowInfo.component.editRow(rowInfo.rowIndex);
        },
        export: { enabled: true, fileName: "MigrosProducts", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.dxMigrosAggregatorGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMigrosAggregator",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMigrosAggregator",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMigrosAggregator",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMigrosAggregator",
        }),
        //filterValue: getFilter(),
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
            allowInserting: true
        },
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        remoteOperations: true,
        columns: [
            { dataField: "id", caption: "id", visible: false },
            { dataField: "Name", caption: $translate.instant('dxMigrosAggregator.Name')  }, 
            { dataField: "HostAddress", caption: $translate.instant('dxMigrosAggregator.HostAddress') },
            { dataField: "appSecretKey", caption: $translate.instant('dxMigrosAggregator.SecretKey') },
            { dataField: "chainCode", caption: $translate.instant('dxMigrosAggregator.chainCode') },
            { dataField: "isActive", caption: $translate.instant('dxMigrosAggregator.isActive') },
            { dataField: "TransferOrdersInstant", caption: $translate.instant('dxMigrosAggregator.TransferOrdersInstant') },
        ],
        onRowClick: function (rowInfo) {
            if (rowInfo.rowType == "data")
                rowInfo.component.editRow(rowInfo.rowIndex);
        },
        export: { enabled: true, fileName: "MigrosProducts", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.productGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMigrosProduct",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMigrosProduct",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMigrosProduct",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMigrosProduct",
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
            allowInserting: true
        },
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        remoteOperations: true,
        columns: [
            { dataField: "id", caption: "id", visible: false },
            { dataField: "MigrosProductID", caption: $translate.instant('dxMigrosProduct.TrendyolProductID'), visible: false },
            { dataField: "MigrosProductName", caption: $translate.instant('dxMigrosProduct.TrendyolProductName'),visibleIndex: 0,fixed: true },
            {
                dataField: "ProductID", caption: $translate.instant('dxMigrosProduct.ProductID'), fixed: true,width: 200,    
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    searchMode:"contains",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxProduct" 
                        }),
                        sort: "name",
                        headerFilter: { allowSearch: true }
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }  
                },

                //fixed: true,
                //groupIndex: 0
            },
            { dataField: "FixedSize", caption: $translate.instant('dxMigrosProduct.FixedSize') },
            { dataField: "MapByPrototype", caption: $translate.instant('dxMigrosProduct.MapByPrototype') },
            { dataField: "SkipProduct", caption: $translate.instant('dxMigrosProduct.SkipProduct') },
            { dataField: "AutoAddProductID", caption: $translate.instant('dxMigrosProduct.AutoAddProductID') },
            { dataField: "AutoAddMapToOption", caption: $translate.instant('dxMigrosProduct.AutoAddMapToOption') },
            { dataField: "AutoAddProductQuantity", caption: $translate.instant('dxMigrosProduct.AutoAddProductQuantity') },
            { dataField: "AutoAddMapOptionsLevel", caption: $translate.instant('dxMigrosProduct.AutoAddMapOptionsLevel') },
        ],
        onRowClick: function (rowInfo) {
            if (rowInfo.rowType == "data")
                rowInfo.component.editRow(rowInfo.rowIndex);
        },
        export: { enabled: true, fileName: "MigrosProducts", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.paymentaGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMigrosPaymentType",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMigrosPaymentType",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMigrosPaymentType",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMigrosPaymentType",
        }),
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
        searchPanel: { visible: true },
        editing: {
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            allowInserting: true
        },
        columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        remoteOperations: true,
        columns: [
            {
                dataField: "MemberID", caption:  $translate.instant('dxMigrosProduct.AggregatorID') ,
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMember" 
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
                dataField: "AggregatorID", caption:  $translate.instant('dxMigrosProduct.MemberID'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "Name",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMigrosAggregator" 
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
            { dataField: "type",   caption: $translate.instant('dxMigrosProduct.type'), },
            { dataField: "name",   caption: $translate.instant('dxMigrosProduct.Name'), },
            {
                dataField: "PaymentTypeID", caption: $translate.instant('dxMigrosProduct.PaymentType'),
                lookup: {
                    valueExpr: "id", 
                    displayExpr: "name",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxPaymentType" 
                        }),
                        sort: "name",
                        headerFilter: { allowSearch: true }
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }  
                },
            }
        ],
        export: { enabled: true, fileName: "MigrosPaymentTypes", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.rejectreasonGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMigrosRejectReason",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMigrosRejectReason",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMigrosRejectReason",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMigrosRejectReason",
        }),
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
        searchPanel: { visible: true },
        editing: {
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            allowInserting: true
        },
        columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        remoteOperations: true,
        columns: [
            { dataField: "id", caption: "id", visible: false },
            { dataField: "Code",   caption: $translate.instant('dxTrendyolRejectReason.Code'), },
            { dataField: "Reason",   caption: $translate.instant('dxTrendyolRejectReason.Reason'), },
            { dataField: "Description",   caption: $translate.instant('dxTrendyolRejectReason.Description'), },
            { dataField: "isActive",   caption: $translate.instant('dxTrendyolRejectReason.isActive'), },
        ],
        export: { enabled: true, fileName: "MigrosRejectReasons", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("migrosmappingCtrl");
    });
}