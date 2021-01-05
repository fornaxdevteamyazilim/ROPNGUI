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
            { dataField: "GetirProductID", caption: "GetirProductID", visible: false },
            { dataField: "GetirProductName", caption: "GetirProductName",visibleIndex: 0,fixed: true },
            {
                dataField: "ProductID", caption: "Product", fixed: true,width: 200,    
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
            "FixedSize",
            "MapByPrototype",
            "SkipProduct",
            "AutoAddProductID",
            "AutoAddMapToOption",
            "AutoAddProductQuantity",
            "AutoAddMapOptionsLevel"
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
                dataField: "MemberID", caption: "Member",
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
                dataField: "AggregatorID", caption: "Aggregator",
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
            "type","name",
            {
                dataField: "PaymentTypeID", caption: "PaymentType",
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
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("aggregatormappingCtrl");
    });
}