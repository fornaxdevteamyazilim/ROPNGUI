app.controller('storeaggregatorstatusCtrl', storeaggregatorstatusCtrl);
function storeaggregatorstatusCtrl($rootScope, $scope, NG_SETTING, $translate, $element, localStorageService, $http, $window, $stateParams, Restangular, toaster, $filter) {
    $rootScope.uService.EnterController("storeaggregatorstatusCtrl");
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
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStoreAggregatorStatus",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStoreAggregatorStatus",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStoreAggregatorStatus",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStoreAggregatorStatus",
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
            storageKey: "dx-storeaggregatorstatus-storing"
        },
        columns: [


            { dataField: "Store", caption: $translate.instant('storeaggregatorstatus.Store'), visibleIndex: 0, fixed: true, allowEditing: false, dataType: "string", sortIndex: 0, sortOrder: "asc" },


            {
                caption: $translate.instant('storeaggregatorstatus.YS'), name: "YS",
                columns: [
                    {
                        dataField: "YemekSepeti_Active", dataType: "string", caption: $translate.instant('storeaggregatorstatus.ys_isOpen'), name: "YemekSepeti_Active", allowEditing: false,
                        lookup: { dataSource: { store: { type: 'array', data: [{ id: false, name: $translate.instant('storeaggregatorstatus.Passive') }, { id: true, name: $translate.instant('storeaggregatorstatus.Active') },], key: "id" }, }, valueExpr: 'id', displayExpr: 'name' }
                    },
                    {
                        dataField: "YemekSepeti_Enabled",caption: $translate.instant('storeaggregatorstatus.ys_Enabled'),
                        lookup: { dataSource: { store: { type: 'array', data: [{ id: false, name: $translate.instant('storeaggregatorstatus.Passive') }, { id: true, name: $translate.instant('storeaggregatorstatus.Active') },], key: "id" }, }, valueExpr: 'id', displayExpr: 'name' }
                    },
                    { dataField: "YemekSepeti_ServiceTime", caption: $translate.instant('storeaggregatorstatus.ys_ServiceTime'), dataType: "string", allowEditing: false, },
                    { dataField: "YemekSepeti_Name", caption: $translate.instant('storeaggregatorstatus.YemekSepeti_Name'), dataType: "string", visible: false, allowEditing: false, },
                    { dataField: "YemekSepeti_StoreID", caption: $translate.instant('storeaggregatorstatus.YemekSepeti_StoreID'), dataType: "number", visible: false, allowEditing: false, },
                    { dataField: "YemekSepeti_sid", caption: $translate.instant('storeaggregatorstatus.YemekSepeti_sid'), dataType: "number", visible: false, allowEditing: false, },
                    { dataField: "YemekSepeti_Status", caption: $translate.instant('storeaggregatorstatus.YemekSepeti_Status'), dataType: "string", allowEditing: false, visible: false },

                ]
            },
            {
                caption: $translate.instant('storeaggregatorstatus.Getir'), name: "Getir",
                columns: [
                    {
                        dataField: "Getir_Active", dataType: "string", name: "Getir_Active", caption: $translate.instant('storeaggregatorstatus.Getir_Active'), allowEditing: false,
                        lookup: { dataSource: { store: { type: 'array', data: [{ id: false, name: $translate.instant('storeaggregatorstatus.Passive') }, { id: true, name: $translate.instant('storeaggregatorstatus.Active') },], key: "id" }, }, valueExpr: 'id', displayExpr: 'name' }
                    },
                    {
                        dataField: "Getir_Enabled", name: "Getir_Enabled", caption: $translate.instant('storeaggregatorstatus.Getir_Enabled'), dataType: "string",
                        lookup: { dataSource: { store: { type: 'array', data: [{ id: false, name: $translate.instant('storeaggregatorstatus.Passive') }, { id: true, name: $translate.instant('storeaggregatorstatus.Active') },], key: "id" }, }, valueExpr: 'id', displayExpr: 'name' }
                    },
                    { dataField: "Getir_ServiceTime", caption: $translate.instant('storeaggregatorstatus.Getir_ServiceTime'), dataType: "number", allowEditing: false, },
                    { dataField: "Getir_Name", caption: $translate.instant('storeaggregatorstatus.Getir_Name'), dataType: "string", allowEditing: false, visible: false, },
                    { dataField: "Getir_StoreID", caption: $translate.instant('storeaggregatorstatus.Getir_StoreID'), dataType: "number", allowEditing: false, visible: false },
                    { dataField: "Getir_sid", caption: $translate.instant('storeaggregatorstatus.Getir_sid'), dataType: "number", allowEditing: false, visible: false },
                    { dataField: "Getir_Status", caption: $translate.instant('storeaggregatorstatus.Getir_Status'), dataType: "string", allowEditing: false, visible: false },
                ]
            },
            {
                caption: $translate.instant('storeaggregatorstatus.Trendyol'), name: "Trendyol",
                columns: [
                    {
                        dataField: "Trendyol_Active", dataType: "string", name: "Trendyol_Active", caption: $translate.instant('storeaggregatorstatus.Trendyol_Active'), dataType: "string", allowEditing: false,
                        lookup: { dataSource: { store: { type: 'array', data: [{ id: false, name: $translate.instant('storeaggregatorstatus.Passive') }, { id: true, name: $translate.instant('storeaggregatorstatus.Active') },], key: "id" }, }, valueExpr: 'id', displayExpr: 'name' }
                    },
                    {
                        dataField: "Trendyol_Enabled", name: "Trendyol_Enabled", caption: $translate.instant('storeaggregatorstatus.Trendyol_Enabled'), dataType: "string", allowUpdating: true,
                        lookup: { dataSource: { store: { type: 'array', data: [{ id: false, name: $translate.instant('storeaggregatorstatus.Passive') }, { id: true, name: $translate.instant('storeaggregatorstatus.Active') },], key: "id" }, }, valueExpr: 'id', displayExpr: 'name' }
                    },
                    { dataField: "Trendyol_ServiceTime", caption: $translate.instant('storeaggregatorstatus.Trendyol_ServiceTime'), dataType: "number", allowEditing: false, },
                    { dataField: "Trendyol_Name", caption: $translate.instant('storeaggregatorstatus.Trendyol_Name'), dataType: "string", visible: false, allowEditing: false, },
                    { dataField: "Trendyol_Status", caption: $translate.instant('storeaggregatorstatus.Trendyol_Status'), dataType: "string", visible: false, allowEditing: false, },
                    { dataField: "Trendyol_sid", caption: $translate.instant('storeaggregatorstatus.Trendyol_sid'), dataType: "number", visible: false, allowEditing: false, },
                    { dataField: "Trendyol_StoreID", caption: $translate.instant('storeaggregatorstatus.Trendyol_StoreID'), dataType: "number", visible: false, allowEditing: false, },
                ],

            },
            {
                caption: $translate.instant('storeaggregatorstatus.Migros'), name: "Migros",
                columns: [
                    {
                        dataField: "Migros_Active", dataType: "string", name: "Migros_Active", caption: $translate.instant('storeaggregatorstatus.Migros_Active'), dataType: "string", allowEditing: false,
                        lookup: { dataSource: { store: { type: 'array', data: [{ id: false, name: $translate.instant('storeaggregatorstatus.Passive') }, { id: true, name: $translate.instant('storeaggregatorstatus.Active') },], key: "id" }, }, valueExpr: 'id', displayExpr: 'name' }
                    },
                    {
                        dataField: "Migros_Enabled", name: "Migros_Enabled", caption: $translate.instant('storeaggregatorstatus.Migros_Enabled'), dataType: "string", allowUpdating: true,
                        lookup: { dataSource: { store: { type: 'array', data: [{ id: false, name: $translate.instant('storeaggregatorstatus.Passive') }, { id: true, name: $translate.instant('storeaggregatorstatus.Active') },], key: "id" }, }, valueExpr: 'id', displayExpr: 'name' }
                    },
                    { dataField: "Migros_ServiceTime", caption: $translate.instant('storeaggregatorstatus.Migros_ServiceTime'), dataType: "number", allowEditing: false, },
                    { dataField: "Migros_Name", caption: $translate.instant('storeaggregatorstatus.Migros_Name'), dataType: "string", visible: false, allowEditing: false, },
                    { dataField: "Migros_Status", caption: $translate.instant('storeaggregatorstatus.Migros_Status'), dataType: "string", visible: false, allowEditing: false, },
                    { dataField: "Migros_sid", caption: $translate.instant('storeaggregatorstatus.Migros_sid'), dataType: "number", visible: false, allowEditing: false, },
                    { dataField: "Migros_StoreID", caption: $translate.instant('storeaggregatorstatus.Migros_StoreID'), dataType: "number", visible: false, allowEditing: false, },
                ]
            }
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
                if (options.column.name && options.column.name == "YemekSepeti_Active")
                    options.cellElement.css({ 'color': options.row.data["YemekSepeti_Active"] ? '#2ab71b' : '#f00' });
                if (options.column.name && options.column.name == "YemekSepeti_Enabled")
                    options.cellElement.css({ 'color': options.row.data["YemekSepeti_Enabled"] ? '#2ab71b' : '#f00' });
                if (options.column.name && options.column.name == "Getir_Active")
                    options.cellElement.css({ 'color': options.row.data["Getir_Active"] ? '#2ab71b' : '#f00' });
                if (options.column.name && options.column.name == "Getir_Enabled")
                    options.cellElement.css({ 'color': options.row.data["Getir_Enabled"] ? '#2ab71b' : '#f00' });
                if (options.column.name && options.column.name == "Trendyol_Active")
                    options.cellElement.css({ 'color': options.row.data["Trendyol_Active"] ? '#2ab71b' : '#f00' });
                if (options.column.name && options.column.name == "Trendyol_Enabled")
                    options.cellElement.css({ 'color': options.row.data["Trendyol_Enabled"] ? '#2ab71b' : '#f00' });
                if (options.column.name && options.column.name == "Migros_Active")
                    options.cellElement.css({ 'color': options.row.data["Migros_Active"] ? '#2ab71b' : '#f00' });
                if (options.column.name && options.column.name == "Migros_Enabled")
                    options.cellElement.css({ 'color': options.row.data["Migros_Enabled"] ? '#2ab71b' : '#f00' });
            }
        },
        onRowClick: function (rowInfo) {
            if (rowInfo.rowType == "data")
                rowInfo.component.editRow(rowInfo.rowIndex);
        },
        export: { enabled: true, fileName: "storeaggregatorstatus", },
        scrolling: { mode: "virtual" },
        height: 600
    };


    $scope.Back = function () {
        $window.history.back();
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("storeaggregatorstatusCtrl");
    });
}