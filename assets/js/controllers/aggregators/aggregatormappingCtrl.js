app.controller('aggregatormappingCtrl', aggregatormappingCtrl);
function aggregatormappingCtrl($rootScope, $scope, NG_SETTING, $translate, $element, localStorageService, $http, $window, $stateParams, Restangular, toaster, $filter) {
    $rootScope.uService.EnterController("aggregatormappingCtrl");
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
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxGetirStore",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxGetirStore",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxGetirStore",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxGetirStore",
            onBeforeSend: function (method, ajaxOptions) {ajaxOptions.headers = {Authorization: 'Bearer ' + localStorageService.get('authorizationData').token};}
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
                dataField: "MemberID", caption: $translate.instant('dxGetirStore.MemberID'), fixed: true,width: 200,   
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
            { dataField: "name", caption: $translate.instant('dxGetirStore.GetirStoreName'),visibleIndex: 1 },
            {
                dataField: "AggregatorID", caption: $translate.instant('dxGetirStore.AggregatorID'),width: 200,  
                lookup: {
                    valueExpr: "id",
                    displayExpr: "Name",
                    searchMode:"contains",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxGetirAggregator" 
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
            
            { dataField: "AggregatorStoreID", caption: $translate.instant('dxGetirStore.AggregatorStoreID') },
            {
                dataField: "StoreID", caption: $translate.instant('dxGetirStore.StoreID'), width: 200,    
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
            { dataField: "averagePreparationTime", caption: $translate.instant('dxGetirStore.averagePreparationTime') },
            { dataField: "status", caption: $translate.instant('dxGetirStore.status') },
            { dataField: "isCourierAvailable", caption: $translate.instant('dxGetirStore.isCourierAvailable') },
            { dataField: "restaurantSecretKey", caption: $translate.instant('dxGetirStore.restaurantSecretKey') },
            { dataField: "isActive", caption: $translate.instant('dxGetirStore.isActive') },
             { dataField: "isEnabled", caption: $translate.instant('dxGetirStore.isEnabled') },
             { dataField: "Alias", caption:'Alias' },

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
        export: { enabled: true, fileName: "GetirProducts", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.productGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxGetirProduct",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxGetirProduct",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxGetirProduct",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxGetirProduct",
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
            { dataField: "GetirProductID", caption: $translate.instant('dxGetirProduct.GetirProductID'), visible: false },
            { dataField: "GetirProductName", caption: $translate.instant('dxGetirProduct.GetirProductName'),visibleIndex: 0,fixed: true },
            {
                dataField: "ProductID", caption: $translate.instant('dxGetirProduct.ProductID'), fixed: true,width: 200,    
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
            { dataField: "FixedSize", caption: $translate.instant('dxGetirProduct.FixedSize') },
            { dataField: "MapByPrototype", caption: $translate.instant('dxGetirProduct.MapByPrototype') },
            { dataField: "SkipProduct", caption: $translate.instant('dxGetirProduct.SkipProduct') },
            { dataField: "AutoAddProductID", caption: $translate.instant('dxGetirProduct.AutoAddProductID') },
            { dataField: "AutoAddMapToOption", caption: $translate.instant('dxGetirProduct.AutoAddMapToOption') },
            { dataField: "AutoAddProductQuantity", caption: $translate.instant('dxGetirProduct.AutoAddProductQuantity') },
            { dataField: "AutoAddMapOptionsLevel", caption: $translate.instant('dxGetirProduct.AutoAddMapOptionsLevel') },

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
        export: { enabled: true, fileName: "GetirProducts", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.paymentaGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxGetirPaymentType",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxGetirPaymentType",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxGetirPaymentType",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxGetirPaymentType",
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
            {
                dataField: "MemberID", caption:  $translate.instant('dxGetirProduct.AggregatorID') ,
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

                //fixed: true,
                //groupIndex: 0
            },
            {
                dataField: "AggregatorID", caption:  $translate.instant('dxGetirProduct.MemberID'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "Name",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxGetirAggregator" 
                        }),
                        sort: "Name",
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
            { dataField: "type",   caption: $translate.instant('dxGetirProduct.type'), },
            { dataField: "name",   caption: $translate.instant('dxGetirProduct.Name'), },
           // "type","name",
            {
                dataField: "PaymentTypeID", caption: $translate.instant('dxGetirProduct.PaymentType'),
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

                //fixed: true,
                //groupIndex: 0
            }
        ],
        export: { enabled: true, fileName: "GetirPaymentTypes", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("aggregatormappingCtrl");
    });
}