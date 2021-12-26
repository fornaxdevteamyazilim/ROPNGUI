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
                    { dataField: "YemekSepeti_Active", dataType: "string", caption: $translate.instant('storeaggregatorstatus.ys_isOpen'), name: "YemekSepeti_Active", dataType: "string", allowEditing: false,
                    calculateCellValue: function (item) {
                        return (item.YemekSepeti_Active && "Açık"|| "Kapalı" )
                    }
                     },
                    { dataField: "YemekSepeti_Enabled", name: "YemekSepeti_Enabled" ,caption: $translate.instant('storeaggregatorstatus.ys_Enabled'), dataType: "string",
                    calculateCellValue: function (item) {
                        return (item.YemekSepeti_Enabled && "Açık"|| "Kapalı" )
                    }
                    },
                    { dataField: "YemekSepeti_ServiceTime", caption: $translate.instant('storeaggregatorstatus.ys_ServiceTime'), dataType: "string",allowEditing: false, },
                    { dataField: "YemekSepeti_Name", caption: $translate.instant('storeaggregatorstatus.YemekSepeti_Name'), dataType: "string",visible: false ,allowEditing: false,},  
                    { dataField: "YemekSepeti_StoreID", caption: $translate.instant('storeaggregatorstatus.YemekSepeti_StoreID'), dataType: "number",visible: false,allowEditing: false, },
                    { dataField: "YemekSepeti_sid", caption: $translate.instant('storeaggregatorstatus.YemekSepeti_sid'), dataType: "number",visible: false,allowEditing: false, },
                    { dataField: "YemekSepeti_Status", caption: $translate.instant('storeaggregatorstatus.YemekSepeti_Status'), dataType: "string",allowEditing: false,visible: false },
                   
                ]
            },
            {
                caption: $translate.instant('storeaggregatorstatus.Getir'), name: "Getir",
                columns: [
                    { dataField: "Getir_Active", dataType: "string",name: "Getir_Active", caption: $translate.instant('storeaggregatorstatus.Getir_Active'), dataType: "string",allowEditing: false, 
                    calculateCellValue: function (item) {
                        return (item.Getir_Active && "Açık"|| "Kapalı" )
                    } },
                    { dataField: "Getir_Enabled", name: "Getir_Enabled", caption: $translate.instant('storeaggregatorstatus.Getir_Enabled'), dataType: "string",
                    calculateCellValue: function (item) {
                        return (item.Getir_Enabled && "Açık"|| "Kapalı" )
                    }
                },
                    { dataField: "Getir_ServiceTime", caption: $translate.instant('storeaggregatorstatus.Getir_ServiceTime'), dataType: "number",allowEditing: false, },
                    { dataField: "Getir_Name", caption: $translate.instant('storeaggregatorstatus.Getir_Name'), dataType: "string", allowEditing: false, visible: false ,},
                    { dataField: "Getir_StoreID", caption: $translate.instant('storeaggregatorstatus.Getir_StoreID'), dataType: "number", allowEditing: false, visible: false },
                    { dataField: "Getir_sid", caption: $translate.instant('storeaggregatorstatus.Getir_sid'),  dataType: "number", allowEditing: false, visible: false },
                    { dataField: "Getir_Status", caption: $translate.instant('storeaggregatorstatus.Getir_Status'), dataType: "string", allowEditing: false, visible: false },
                ]
            },
            {
                caption: $translate.instant('storeaggregatorstatus.Trendyol'), name: "Trendyol",
                columns: [
                    { dataField: "Trendyol_Active", dataType: "string", name: "Trendyol_Active",caption: $translate.instant('storeaggregatorstatus.Trendyol_Active'), dataType: "string",allowEditing: false,
                    calculateCellValue: function (item) {
                        return (item.Trendyol_Active && "Açık"|| "Kapalı" )
                    }
                },
                    { dataField: "Trendyol_Enabled",name: "Trendyol_Enabled", caption: $translate.instant('storeaggregatorstatus.Trendyol_Enabled'), dataType: "string",allowUpdating: true,
                    calculateCellValue: function (item) {
                        return (item.Trendyol_Enabled && "Açık"|| "Kapalı" )
                    }
                    },
                    { dataField: "Trendyol_ServiceTime", caption: $translate.instant('storeaggregatorstatus.Trendyol_ServiceTime'), dataType: "number", allowEditing: false,},
                    { dataField: "Trendyol_Name", caption: $translate.instant('storeaggregatorstatus.Trendyol_Name'), dataType: "string",visible: false ,allowEditing: false,},
                    { dataField: "Trendyol_Status", caption: $translate.instant('storeaggregatorstatus.Trendyol_Status'), dataType: "string",visible: false ,allowEditing: false,},
                    { dataField: "Trendyol_sid", caption: $translate.instant('storeaggregatorstatus.Trendyol_sid'), dataType: "number",visible: false,allowEditing: false, },
                    { dataField: "Trendyol_StoreID", caption: $translate.instant('storeaggregatorstatus.Trendyol_StoreID'), dataType: "number",visible: false,allowEditing: false, },
                ],
              
            },                                                    
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
                if (options.column.name && options.column.name == "YemekSepeti_Active") {
                    if (options.row.data["YemekSepeti_Active"] != false) {

                        if (options.row.data["YemekSepeti_Active"] < true)
                            options.cellElement.css({ 'color': '#f00' });
                        else
                            options.cellElement.css({ 'color': '#2ab71b' });
                    }

                }
                if (options.column.name && options.column.name == "YemekSepeti_Enabled") {
                    if (options.row.data["YemekSepeti_Enabled"] != false) {

                        if (options.row.data["YemekSepeti_Enabled"] < true)
                            options.cellElement.css({ 'color': '#f00' });
                        else
                            options.cellElement.css({ 'color': '#2ab71b' });
                    }

                }
                if (options.column.name && options.column.name == "Getir_Active") {
                    if (options.row.data["Getir_Active"] != false) {

                        if (options.row.data["Getir_Active"] < true)
                            options.cellElement.css({ 'color': '#f00' });
                        else
                            options.cellElement.css({ 'color': '#2ab71b' });
                    }

                }
                if (options.column.name && options.column.name == "Getir_Enabled") {
                    if (options.row.data["Getir_Enabled"] != false) {

                        if (options.row.data["Getir_Enabled"] <true)
                            options.cellElement.css({ 'color': '#f00' });
                        else
                            options.cellElement.css({ 'color': '#2ab71b' });
                    }

                }
                if (options.column.name && options.column.name == "Trendyol_Active") {
                    if (options.row.data["Trendyol_Active"] != false) {

                        if (options.row.data["Trendyol_Active"] < true)
                            options.cellElement.css({ 'color': '#f00' });
                        else
                            options.cellElement.css({ 'color': '#2ab71b' });
                    }

                }
                if (options.column.name && options.column.name == "Trendyol_Enabled") {
                    if (options.row.data["Trendyol_Enabled"] != false) {

                        if (options.row.data["Trendyol_Enabled"] <true)
                            options.cellElement.css({ 'color': '#f00' });
                        else
                            options.cellElement.css({ 'color': '#2ab71b' });
                    }

                }
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