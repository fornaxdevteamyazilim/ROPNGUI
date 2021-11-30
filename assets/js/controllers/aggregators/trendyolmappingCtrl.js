app.controller('trendyolmappingCtrl', trendyolmappingCtrl);
function trendyolmappingCtrl($rootScope, $scope, NG_SETTING, $translate, $element, localStorageService, $http, $window, $stateParams, Restangular, toaster, $filter) {
    $rootScope.uService.EnterController("trendyolmappingCtrl");
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
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxTrendyolStore",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxTrendyolStore",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxTrendyolStore",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxTrendyolStore",
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
                dataField: "MemberID", caption: $translate.instant('dxTrendyolStore.MemberID'), fixed: true,width: 200,   
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
            { dataField: "name", caption: $translate.instant('dxTrendyolStore.TrendyolStoreName'),visibleIndex: 1 },
            {
                dataField: "AggregatorID", caption: $translate.instant('dxTrendyolStore.AggregatorID'),width: 200,  
                lookup: {
                    valueExpr: "id",
                    displayExpr: "Name",
                    searchMode:"contains",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxTrendyolAggregator" 
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
            
            { dataField: "AggregatorStoreID", caption: $translate.instant('dxTrendyolStore.AggregatorStoreID') },
            {
                dataField: "StoreID", caption: $translate.instant('dxTrendyolStore.StoreID'), width: 200,    
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
            { dataField: "averagePreparationTime", caption: $translate.instant('dxTrendyolStore.averagePreparationTime') },
            { dataField: "status", caption: $translate.instant('dxTrendyolStore.status') },
            { dataField: "isCourierAvailable", caption: $translate.instant('dxTrendyolStore.isCourierAvailable') },
            { dataField: "restaurantSecretKey", caption: $translate.instant('dxTrendyolStore.restaurantSecretKey') },
            { dataField: "isActive", caption: $translate.instant('dxTrendyolStore.isActive') },
            { dataField: "isEnabled", caption: $translate.instant('dxTrendyolStore.isEnabled') },

            //"FixedSize",
            //"MapByPrototype",
            // "SkipProduct",
            // "AutoAddProductID",
            // "AutoAddMapToOption",
            // "AutoAddProductQuantity",
            // "AutoAddMapOptionsLevel"
        ],
        onRowClick: function (rowInfo) {
            if (rowInfo.rowType == "data")
                rowInfo.component.editRow(rowInfo.rowIndex);
        },
        export: { enabled: true, fileName: "TrendyolProducts", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.dxTrendyolAggregatorGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxTrendyolAggregator",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxTrendyolAggregator",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxTrendyolAggregator",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxTrendyolAggregator",
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
            { dataField: "name", caption: "name" }, 
            { dataField: "SupplierID", caption: "SupplierID" }, 
            { dataField: "apiAgentName", caption: "apiAgentName" },
            { dataField: "HostAddress", caption: "HostAddress"},
            { dataField: "apiKey", caption: "apiKey" },
            { dataField: "apiSecret", caption: "apiSecret" },
            { dataField: "isActive", caption: "isActive" },
            { dataField: "TransferOrdersInstant", caption: "TransferOrdersInstant" },
            { dataField: "apiExecutorUser", caption: "apiExecutorUser" },

            //"FixedSize",
            //"MapByPrototype",
            // "SkipProduct",
            // "AutoAddProductID",
            // "AutoAddMapToOption",
            // "AutoAddProductQuantity",
            // "AutoAddMapOptionsLevel"
        ],
        onRowClick: function (rowInfo) {
            if (rowInfo.rowType == "data")
                rowInfo.component.editRow(rowInfo.rowIndex);
        },
        export: { enabled: true, fileName: "TrendyolProducts", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.productGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxTrendyolProduct",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxTrendyolProduct",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxTrendyolProduct",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxTrendyolProduct",
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
            { dataField: "TrendyolProductID", caption: $translate.instant('dxTrendyolProduct.TrendyolProductID'), visible: false },
            { dataField: "TrendyolProductName", caption: $translate.instant('dxTrendyolProduct.TrendyolProductName'),visibleIndex: 0,fixed: true },
            {
                dataField: "ProductID", caption: $translate.instant('dxTrendyolProduct.ProductID'), fixed: true,width: 200,    
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
            { dataField: "FixedSize", caption: $translate.instant('dxTrendyolProduct.FixedSize') },
            { dataField: "MapByPrototype", caption: $translate.instant('dxTrendyolProduct.MapByPrototype') },
            { dataField: "SkipProduct", caption: $translate.instant('dxTrendyolProduct.SkipProduct') },
            { dataField: "AutoAddProductID", caption: $translate.instant('dxTrendyolProduct.AutoAddProductID') },
            { dataField: "AutoAddMapToOption", caption: $translate.instant('dxTrendyolProduct.AutoAddMapToOption') },
            { dataField: "AutoAddProductQuantity", caption: $translate.instant('dxTrendyolProduct.AutoAddProductQuantity') },
            { dataField: "AutoAddMapOptionsLevel", caption: $translate.instant('dxTrendyolProduct.AutoAddMapOptionsLevel') },

            //"FixedSize",
            //"MapByPrototype",
            // "SkipProduct",
            // "AutoAddProductID",
            // "AutoAddMapToOption",
            // "AutoAddProductQuantity",
            // "AutoAddMapOptionsLevel"
        ],
        onRowClick: function (rowInfo) {
            if (rowInfo.rowType == "data")
                rowInfo.component.editRow(rowInfo.rowIndex);
        },
        export: { enabled: true, fileName: "TrendyolProducts", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.rejectreasonGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxTrendyolRejectReason",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxTrendyolRejectReason",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxTrendyolRejectReason",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxTrendyolRejectReason",
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
        export: { enabled: true, fileName: "TrendyolRejectReasons", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("trendyolmappingCtrl");
    });
}