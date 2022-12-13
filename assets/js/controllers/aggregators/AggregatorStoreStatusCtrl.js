app.controller('AggregatorStoreStatusCtrl', AggregatorStoreStatusCtrl);
function AggregatorStoreStatusCtrl($rootScope, $scope, NG_SETTING, $translate, $element, localStorageService, $http, $window, $stateParams, Restangular, toaster, $filter) {
    $rootScope.uService.EnterController("AggregatorStoreStatusCtrl");
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
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxAggregatorStoreStatus",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxAggregatorStoreStatus",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxAggregatorStoreStatus",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxAggregatorStoreStatus",
            onBeforeSend: function (method, ajaxOptions) {

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
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: true,
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
            allowAdding: false,
            allowUpdating: true,
            allowDeleting: false,
            allowInserting: false
        },
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        remoteOperations: true,
        stateStoring: {
            enabled: true,
            type: "localStorage",
            storageKey: "dx-AggregatorStoreStatus-storing"
        },
        columns: [

            { dataField: "id", caption: "id",  allowEditing: false, visible:false,stateStoring:false },
            // { dataField: "StoreID", caption: $translate.instant('AggregatorStoreStatus.StoreID'), dataType: "string",},
            {
                dataField: "StoreID", caption: $translate.instant('AggregatorStoreStatus.StoreID'), width: 200,    
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
                allowEditing: false, 
                //fixed: true,
                //groupIndex: 0
            },

            {
                dataField: "Aggregator", dataType: "string", caption: $translate.instant('AggregatorStoreStatus.Aggregator'), allowEditing: false,  
            },
            { dataField: "Aggregator_Name", caption: $translate.instant('AggregatorStoreStatus.Aggregator_Name'), dataType: "string", allowEditing: false, },
            { dataField: "Aggregator_StoreID", caption: $translate.instant('AggregatorStoreStatus.Aggregator_StoreID'), dataType: "string",  allowEditing: false,},
            {
                dataField: "Aggregator_Enabled", name: "Aggregator_Enabled", caption: $translate.instant('AggregatorStoreStatus.Aggregator_Enabled'), dataType: "string", allowUpdating: true,
                lookup: { dataSource: { store: { type: 'array', data: [{ id: false, name: $translate.instant('storeaggregatorstatus.Passive') }, { id: true, name: $translate.instant('storeaggregatorstatus.Active') },], key: "id" }, }, valueExpr: 'id', displayExpr: 'name' }
            },
            {
                dataField: "Aggregator_Active", name: "Aggregator_Active", caption: $translate.instant('AggregatorStoreStatus.Aggregator_Active'), dataType: "string", allowEditing: false,
                lookup: { dataSource: { store: { type: 'array', data: [{ id: false, name: $translate.instant('storeaggregatorstatus.Passive') }, { id: true, name: $translate.instant('storeaggregatorstatus.Active') },], key: "id" }, }, valueExpr: 'id', displayExpr: 'name' }
            },
            { dataField: "Aggregator_Status", caption: $translate.instant('AggregatorStoreStatus.Aggregator_Status'), dataType: "string",allowEditing: false, },            
            { dataField: "Aggregator_ServiceTime", caption: $translate.instant('AggregatorStoreStatus.Aggregator_ServiceTime'), dataType: "number", allowEditing: false, stateStoring:false},
            //{ dataField: "Aggregator_sid", caption: $translate.instant('AggregatorStoreStatus.Aggregator_sid'), dataType: "number", allowEditing: false, },

          
        
        ],
        onCellPrepared: function (options) {
            if (options.rowType == 'data') {
                var fieldData = options.value;
                if (options.rowType == 'data' && options.column.name && options.column.name.length > 5 && options.column.name == "TodayIncome") {
                    var fieldData = options.value;
                    var fieldHtml = "";
                    if (options.row.data["TodayIncome"] != options.row.data["PrewWeekIncome"]) {
                        options.cellElement.addClass((options.row.data["TodayIncome"] > options.row.data["PrewWeekIncome"]) ? "inc" : "dec");
                        fieldHtml += "<div class='current-value'>" +
                            "</div> <div class='diff'>" +
                            parseInt(fieldData).toLocaleString() +
                            "  </div>";
                    }
                    /* else {
                        fieldHtml = fieldData.value;
                    } */
                    options.cellElement.html(fieldHtml);
                }
                // if (options.column.name && options.column.name == "TodayIncome") {
                //     if (options.row.data["TodayIncome"] != options.row.data["PrewWeekIncome"]) {

                //         if (options.row.data["TodayIncome"] < options.row.data["PrewWeekIncome"])
                //             options.cellElement.css({ 'color': '#f00' });
                //         else
                //             options.cellElement.css({ 'color': '#2ab71b' });
                //     }

                // }
                if (options.column.name && options.column.name == "Aggregator_Active")
                    options.cellElement.css({ 'color': options.row.data["Aggregator_Active"] ? '#2ab71b' : '#f00' });
                if (options.column.name && options.column.name == "Aggregator_Enabled")
                    options.cellElement.css({ 'color': options.row.data["Aggregator_Enabled"] ? '#2ab71b' : '#f00' });
                // if (options.column.name && options.column.name == "Aggregator_Status")
                //     options.cellElement.css({ 'color': options.row.data["Aggregator_Status"] ? '#2ab71b' : '#f00' });

            }
        },
        onRowClick: function (rowInfo) {
            if (rowInfo.rowType == "data")
                rowInfo.component.editRow(rowInfo.rowIndex);
        },
        export: { enabled: true, fileName: "AggregatorStoreStatus", },
        scrolling: { mode: "virtual" },
        height: 600
    };


    $scope.Back = function () {
        $window.history.back();
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("AggregatorStoreStatusCtrl");
    });
}