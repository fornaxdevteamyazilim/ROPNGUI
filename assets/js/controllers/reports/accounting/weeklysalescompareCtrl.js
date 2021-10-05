'use strict';
app.controller('weeklysalescompareCtrl', weeklysalescompareCtrl);
function weeklysalescompareCtrl($scope, Restangular, toaster, $interval, $http, NG_SETTING, $q, $rootScope, $location, $translate, $timeout, $element, userService, ngnotifyService) {
    $rootScope.uService.EnterController("weeklysalescompareCtrl");
    userService.userAuthorizated();
    var promise;

    $scope.translate = function () {
        $scope.trREPORT = $translate.instant('main.REPORT');
        $scope.trEXCEL = $translate.instant('main.EXCEL');
        $scope.trPRINT = $translate.instant('main.PRINT');
        $scope.trTODAYINCOME = $translate.instant('main.TODAYINCOME');
        $scope.trTODAYTC = $translate.instant('main.TODAYTC');
        $scope.trPREWEEKINCOME = $translate.instant('main.PREWEEKINCOME');
        $scope.trPREWEEKTC = $translate.instant('main.PREWEEKTC');
        $scope.trPREWEEKAC = $translate.instant('main.PREWEEKAC');
        $scope.SALESTARGET = $translate.instant('main.PREWEEKAC');
        $scope.TCTARGET = $translate.instant('main.PREWEEKAC');
        $scope.ACTARGET = $translate.instant('main.PREWEEKAC');

    };
    $scope.selectedStore = function (StoreID, Store) {
        var data = {};
        data.id = StoreID;
        data.name = Store;
        $rootScope.SelectedData = data;
       // $location.path('/app/dashboard');
    };
    $scope.translate();
    var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });

    $scope.sumColumnJS = function sumColumnJS(array, col) {
        var sum = 0;
        array.forEach(function (value, index, array) {
            sum += value[col];
        });
        return sum;
    }
    $scope.resetlayout = $translate.instant('main.FILTERRESET');
    $scope.resetButtonOptions = {
        text: $scope.resetlayout,
        onClick: function () {
            $('#gridContainer').dxDataGrid('instance').state({});
        }
    };
    $scope.Time = ngnotifyService.ServerTime();
    function ISO8601_week_no(dt) {
        var tdt = new Date(dt.valueOf());
        var dayn = (dt.getDay() + 6) % 7;
        tdt.setDate(tdt.getDate() - dayn + 3);
        var firstThursday = tdt.valueOf();
        tdt.setMonth(0, 1);
        if (tdt.getDay() !== 4) {
            tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
        }
        return 1 + Math.ceil((firstThursday - tdt) / 604800000);
    }
    var cYeaar = parseInt(((new Date()).getFullYear()));
    $scope.startYear = cYeaar;
    $scope.endYear = cYeaar;
    var minYear = parseInt(cYeaar - 4);
    var maxYear = parseInt(cYeaar);
    var vNumber = ISO8601_week_no((new Date()));
    $scope.startWeek = parseInt(vNumber - 2);
    $scope.endWeek = parseInt(vNumber - 1);
    $scope.VeiwHeader = {};
    $scope.startYearButton = {
        bindingOptions: {
            value: "startYear"
        },
        min: minYear,
        max: maxYear,
        showSpinButtons: true
    };
    $scope.weekCaption1 = $translate.instant('fsrweeklysalescompare.Week') + " " + $scope.startWeek;
    $scope.weekCaption2 = $translate.instant('fsrweeklysalescompare.Week') + " " + $scope.endWeek;
    $scope.startWeekButton = {
        bindingOptions: {
            value: "startWeek"
        },
        min: 1,
        max: 53,
        showSpinButtons: true
    };


    $scope.reportButtonOptions = {
        text: $translate.instant('reportcommands.GetData'),
        onClick: function () {
            var dataGrid = $('#gridContainer').dxDataGrid('instance');
            dataGrid.refresh();
            $scope.weekCaption1 = "Week " + $scope.startWeek;
            $scope.weekCaption2 = "Week " + $scope.endWeek;
            dataGrid.columnOption("week1bump", 'caption', $scope.weekCaption1);
            dataGrid.columnOption("week1ys", 'caption', $scope.weekCaption1);
            dataGrid.columnOption("week2bump", 'caption', $scope.weekCaption2);
            dataGrid.columnOption("week2ys", 'caption', $scope.weekCaption2);
        }
    };
    $scope.resetlayout = $translate.instant('main.RESETLAYOUT');
    $scope.resetButtonOptions = {
        text: $scope.resetlayout,
        onClick: function () {
            $("#gridContainer").dxPivotGrid("instance").getDataSource().state({});
        }
    };
    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== "";
    }
    function formatTime(cellInfo) {
        var sec = cellInfo.value * 60 * 1000;
        var dateObj = new Date(sec);
        var hours = dateObj.getUTCHours();
        var minutes = dateObj.getUTCMinutes();
        var seconds = dateObj.getSeconds();
        var timeString = hours.toString().padStart(2, '0') + ':' +
            minutes.toString().padStart(2, '0') + ':' +
            seconds.toString().padStart(2, '0');
        return (cellInfo.value) ? timeString : "-";
    };
    
    var store = new DevExpress.data.CustomStore({
        key: "StoreID",
        load: function (loadOptions) {
            var params = {
                Year: $scope.startYear,
                Week: $scope.startWeek,
                //IncludeTotals:false
            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/fsr/weeklysalescompare", { params: params })
                .then(function (response) {
                    return {
                        data: response.data,
                        totalCount: 10
                    };
                }, function (response) {
                    return $q.reject("Data Loading Error");
                });
        }
    });
    $scope.WeeklysalescompareGridOptions = {
        dataSource: store,
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        allowColumnReordering: true,
        filterRow: { visible: true },
        //filterPanel: { visible: true },
        headerFilter: { visible: true },
        grouping: { autoExpandAll: true },
        searchPanel: { visible: true },
        groupPanel: { visible: true },
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        remoteOperations: false,
        repaintChangesOnly: true,
        highlightChanges: true,
        hoverStateEnabled: true,
        twoWayBindingEnabled: false,
        repaintChangesOnly: true,
        loadPanel: { enabled: false },
        stateStoring: {
            enabled: true,
            type: "localStorage",
            storageKey: "dx-weeklysalescompareGrid"
        },
        columns: [

            { dataField: "RegionManager", caption: $translate.instant('weeklysalescompare.RegionManager'), dataType: "string", fixed: true, },
            { dataField: "Store", caption: $translate.instant('weeklysalescompare.Store'), visibleIndex: 0, fixed: true, dataType: "string", sortIndex: 0, sortOrder: "asc" },

            // { dataField: "StoreFilterType", caption: $translate.instant('weeklysalescompare.StoreFilterType'), fixed: false, dataType: "string", },
            // { dataField: "StoreType", caption: $translate.instant('weeklysalescompare.regionRank'), fixed: false, dataType: "string", },
            {
                caption: $translate.instant('weeklysalescompare.Sales'), name: "Sales",
                columns: [
                    { dataField: "SalesCY", dataType: "number", caption: $translate.instant('weeklysalescompare.SalesCY'), dataType: "number", name: "SalesCY", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "SalesLY", caption: $translate.instant('weeklysalescompare.SalesLY'), dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "SalesCHG", caption: $translate.instant('weeklysalescompare.SalesCHG'), name: "SalesCHG", dataType: "number", format: { type: "percent", precision: 2 } },
                ]
            },
            {
                caption: $translate.instant('weeklysalescompare.Transactions'), name: "Transactions",
                columns: [
                    { dataField: "TransactionsCY", caption: $translate.instant('weeklysalescompare.TransactionsCY'), format: { type: "fixedPoint", precision: 0 } },
                    { dataField: "TransactionsLY", caption: $translate.instant('weeklysalescompare.TransactionsLY'), format: { type: "fixedPoint", precision: 0 } },
                    { dataField: "TransactionsCHG", caption: $translate.instant('weeklysalescompare.TransactionsCHG'), name: "TransactionsCHG", dataType: "number", format: { type: "percent", precision: 2 } },
                ]
            },
            {
                caption: $translate.instant('weeklysalescompare.GCAvg'), name: "GCAvg",
                columns: [
                    { dataField: "GCAvgCY", caption: $translate.instant('weeklysalescompare.GCAvgCY'), format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "GCAvgLY", caption: $translate.instant('weeklysalescompare.GCAvgLY'), format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "GCAvgCHG", caption: $translate.instant('weeklysalescompare.GCAvgCHG'), name: "GCAvgCHG", dataType: "number", format: { type: "percent", precision: 2 } },
                ]
            },
            {
                caption: $translate.instant('weeklysalescompare.DeliverySales'), name: "DeliverySales",
                columns: [
                    { dataField: "DeliverySalesCY", caption: $translate.instant('weeklysalescompare.DeliverySalesCY'), format: { type: "fixedPoint", precision: 0 } },
                    { dataField: "DeliverySalesLY", caption: $translate.instant('weeklysalescompare.DeliverySalesLY'), format: { type: "fixedPoint", precision: 0 } },
                    { dataField: "DeliverySalesCHG", caption: $translate.instant('weeklysalescompare.DeliverySalesCHG'), name: "DeliverySalesCHG", dataType: "number", format: { type: "percent", precision: 2 } },
                ]
            },
            {
                caption: $translate.instant('weeklysalescompare.DeliveryTransactions'), name: "DeliveryTransactions",
                columns: [
                    { dataField: "DeliveryTransactionsCY", caption: $translate.instant('weeklysalescompare.DeliveryTransactionsCY'), format: { type: "fixedPoint", precision: 0 } },
                    { dataField: "DeliveryTransactionsLY", caption: $translate.instant('weeklysalescompare.DeliveryTransactionsLY'), format: { type: "fixedPoint", precision: 0 } },
                    { dataField: "DeliveryTransactionsCHG", caption: $translate.instant('weeklysalescompare.DeliveryTransactionsCHG'), name: "DeliveryTransactionsCHG", dataType: "number", format: { type: "percent", precision: 2 } },
                ]
            },
            {
                caption: $translate.instant('weeklysalescompare.DeliveryGCAvg'), name: "DeliveryGCAvg",
                columns: [
                    { dataField: "DeliveryGCAvgCY", caption: $translate.instant('weeklysalescompare.DeliveryGCAvgCY'), format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "DeliveryGCAvgLY", caption: $translate.instant('weeklysalescompare.DeliveryGCAvgLY'), format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "DeliveryGCAvgCHG", caption: $translate.instant('weeklysalescompare.DeliveryGCAvgCHG'), name: "DeliveryGCAvgCHG", dataType: "number", format: { type: "percent", precision: 2 } },
                ]
            },


        ],
        summary: {
            totalItems: [{ column: "Store", summaryType: "count", displayFormat: "{0}" },
            { column: "SalesCY", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "SalesLY", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            //{ column: "SalesCHG", summaryType: "avg",name:"SalesCHG", dataType: "number",valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" ,},
            { name: "SalesCHGSummary", showInColumn: "SalesCHG", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { column: "TransactionsCY", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "TransactionsLY", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
           // { column: "TransactionsCHG", summaryType: "avg",  dataType: "number",valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "TransactionsCHGSummary", showInColumn: "TransactionsCHG", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "GCAvgCYSummary", showInColumn: "GCAvgCY", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { name: "GCAvgLYSummary", showInColumn: "GCAvgLY", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            //{ column: "GCAvgCHG", summaryType: "avg",  dataType: "number",valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "GCAvgCHGSummary", showInColumn: "GCAvgCHG", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { column: "DeliverySalesCY", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "DeliverySalesLY", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            //{ column: "DeliverySalesCHG", summaryType: "avg",  dataType: "number",valueFormat: { type: "percent", precision: 2 },displayFormat: "{0}" },
            { name: "DeliverySalesCHGSummary", showInColumn: "DeliverySalesCHG", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { column: "DeliveryTransactionsCY", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "DeliveryTransactionsLY", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            //{ column: "DeliveryTransactionsCHG", summaryType: "avg",   dataType: "number",valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "DeliveryTransactionsCHGSummary", showInColumn: "DeliveryTransactionsCHG", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "DeliveryGCAvgCYSummary", showInColumn: "DeliveryGCAvgCY", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { name: "DeliveryGCAvgLYSummary", showInColumn: "DeliveryGCAvgLY", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            //{ column: "DeliveryGCAvgCHG", summaryType: "avg", dataType: "number",valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "DeliveryGCAvgCHGSummary", showInColumn: "DeliveryGCAvgCHG", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            ],
            groupItems: [
                { column: "Store", summaryType: "count", displayFormat: "{0}" },
                { column: "SalesCY", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "SalesLY", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                //{ column: "SalesCHG",summaryType: "avg",name:"SalesCHG", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true ,                 },
                { name: "SalesCHGSummary", showInColumn: "SalesCHG", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TransactionsCY", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TransactionsLY", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                //{ column: "TransactionsCHG", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { name: "TransactionsCHGSummary", showInColumn: "TransactionsCHG", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { name: "GCAvgCYSummary", showInColumn: "GCAvgCY", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { name: "GCAvgLYSummary", showInColumn: "GCAvgLY", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                //{ column: "GCAvgCHG", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true  },
                { name: "GCAvgCHGSummary", showInColumn: "GCAvgCHG", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "DeliverySalesCY", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "DeliverySalesLY", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
               // { column: "DeliverySalesCHG",summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true  },
                { name: "DeliverySalesCHGSummary", showInColumn: "DeliverySalesCHG", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "DeliveryTransactionsCY", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "DeliveryTransactionsLY", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
               // { column: "DeliveryTransactionsCHG",summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true  },
                { name: "DeliveryTransactionsCHGSummary", showInColumn: "DeliveryTransactionsCHG", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { name: "DeliveryGCAvgCYSummary", showInColumn: "DeliveryGCAvgCY", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { name: "DeliveryGCAvgLYSummary", showInColumn: "DeliveryGCAvgLY", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                //{ column: "DeliveryGCAvgCHG",summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true  },
                { name: "DeliveryGCAvgCHGSummary", showInColumn: "DeliveryGCAvgCHG", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },

            ],
            calculateCustomSummary: function (options) {
                if (options.name === "SalesCHGSummary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.dg = 0;
                            break;
                        case "calculate":
                                options.dg = options.dg + options.value.SalesLY;
                                options.totalValue = options.totalValue + options.value.SalesCY;
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue / options.dg-1;
                            break;
                    }
                }
                if (options.name === "TransactionsCHGSummary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.dg = 0;
                            break;
                        case "calculate":
                                options.dg = options.dg + options.value.TransactionsLY;
                                options.totalValue = options.totalValue + options.value.TransactionsCY;
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue / options.dg-1;
                            break;
                    }
                }
                if (options.name === "GCAvgCHGSummary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.TranCY=0;
                            options.TranLY=0;
                            options.SalesCY=0;
                            options.SalesLY=0;
                            break;
                        case "calculate":
                            options.TranLY = options.TranLY + options.value.TransactionsLY;
                            options.TranCY = options.TranCY + options.value.TransactionsCY;
                            options.SalesLY=options.SalesLY + options.value.SalesLY;
                            options.SalesCY=options.SalesCY + options.value.SalesCY;
                            break;
                        case "finalize":
                            options.totalValue = (options.SalesCY/options.TranCY)/(options.SalesLY/options.TranLY)-1;
                            break;
                    }
                }
                if (options.name === "GCAvgCYSummary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.TranCY=0;
                            options.SalesCY=0;
                            break;
                        case "calculate":
                            options.TranCY = options.TranCY + options.value.TransactionsCY;
                            options.SalesCY=options.SalesCY + options.value.SalesCY;
                            break;
                        case "finalize":
                            options.totalValue = (options.SalesCY/options.TranCY);
                            break;
                    }
                }if (options.name === "GCAvgLYSummary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.TranLY=0;
                            options.SalesLY=0;
                            break;
                        case "calculate":
                            options.TranLY = options.TranLY + options.value.TransactionsLY;
                            options.SalesLY=options.SalesLY + options.value.SalesLY;
                            break;
                        case "finalize":
                            options.totalValue = (options.SalesLY/options.TranLY);
                            break;
                    }
                }
                if (options.name === "DeliveryGCAvgCYSummary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.TranCY=0;
                            options.SalesCY=0;
                            break;
                        case "calculate":
                            options.TranCY = options.TranCY + options.value.DeliveryTransactionsCY;
                            options.SalesCY=options.SalesCY + options.value.DeliverySalesCY;
                            break;
                        case "finalize":
                            options.totalValue = (options.SalesCY/options.TranCY);
                            break;
                    }
                }if (options.name === "DeliveryGCAvgLYSummary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.TranLY=0;
                            options.SalesLY=0;
                            break;
                        case "calculate":
                            options.TranLY = options.TranLY + options.value.DeliveryTransactionsLY;
                            options.SalesLY=options.SalesLY + options.value.DeliverySalesLY;
                            break;
                        case "finalize":
                            options.totalValue = (options.SalesLY/options.TranLY);
                            break;
                    }
                }
                if (options.name === "DeliverySalesCHGSummary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.dg = 0;
                            break;
                        case "calculate":
                                options.dg = options.dg + options.value.DeliverySalesLY;
                                options.totalValue = options.totalValue + options.value.DeliverySalesCY;
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue / options.dg-1;
                            break;
                    }
                }
                if (options.name === "DeliveryTransactionsCHGSummary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.dg = 0;
                            break;
                        case "calculate":
                                options.dg = options.dg + options.value.DeliveryTransactionsLY;
                                options.totalValue = options.totalValue + options.value.DeliveryTransactionsCY;
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue / options.dg-1;
                            break;
                    }
                }
                if (options.name === "DeliveryGCAvgCHGSummary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.TranCY=0;
                            options.TranLY=0;
                            options.SalesCY=0;
                            options.SalesLY=0;
                            break;
                        case "calculate":
                            options.TranLY = options.TranLY + options.value.DeliveryTransactionsLY;
                            options.TranCY = options.TranCY + options.value.DeliveryTransactionsCY;
                            options.SalesLY=options.SalesLY + options.value.DeliverySalesLY;
                            options.SalesCY=options.SalesCY + options.value.DeliverySalesCY;
                            break;
                        case "finalize":
                            options.totalValue = (options.SalesCY/options.TranCY)/(options.SalesLY/options.TranLY)-1 ;
                            break;
                    }
                }
            }
        },
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
                if (options.column.name && options.column.name == "SalesCHG") {
                    if (options.row.data["SalesCHG"] != 0) {

                        if (options.row.data["SalesCHG"] < 0)
                            options.cellElement.css({ 'color': '#f00' });
                        else
                            options.cellElement.css({ 'color': '#2ab71b' });
                    }

                }
                if (options.column.name && options.column.name == "TransactionsCHG") {
                    if (options.row.data["TransactionsCHG"] != 0) {

                        if (options.row.data["TransactionsCHG"] < 0)
                            options.cellElement.css({ 'color': '#f00' });
                        else
                            options.cellElement.css({ 'color': '#2ab71b' });
                    }

                }
                if (options.column.name && options.column.name == "GCAvgCHG") {
                    if (options.row.data["GCAvgCHG"] != 0) {

                        if (options.row.data["GCAvgCHG"] < 0)
                            options.cellElement.css({ 'color': '#f00' });
                        else
                            options.cellElement.css({ 'color': '#2ab71b' });
                    }

                }
                if (options.column.name && options.column.name == "DeliverySalesCHG") {
                    if (options.row.data["DeliverySalesCHG"] != 0) {

                        if (options.row.data["DeliverySalesCHG"] < 0)
                            options.cellElement.css({ 'color': '#f00' });
                        else
                            options.cellElement.css({ 'color': '#2ab71b' });
                    }

                }
                if (options.column.name && options.column.name == "DeliveryTransactionsCHG") {
                    if (options.row.data["DeliveryTransactionsCHG"] != 0) {

                        if (options.row.data["DeliveryTransactionsCHG"] < 0)
                            options.cellElement.css({ 'color': '#f00' });
                        else
                            options.cellElement.css({ 'color': '#2ab71b' });
                    }

                }
                if (options.column.name && options.column.name == "DeliveryGCAvgCHG") {
                    if (options.row.data["DeliveryGCAvgCHG"] != 0) {

                        if (options.row.data["DeliveryGCAvgCHG"] < 0)
                            options.cellElement.css({ 'color': '#f00' });
                        else
                            options.cellElement.css({ 'color': '#2ab71b' });
                    }

                }
            }
        },
        onDataErrorOccurred: function (e) {
            console.log(e.error);
        },
    
        export: {
            enabled: true,
            fileName: "Weekly Sales Compare Report",
            customizeExcelCell: (options) => {
                var gridCell = options.gridCell;
                var fieldData = options.value;
                if (!gridCell) {
                    return;
                }
                if (options.gridCell.rowType == 'data' && gridCell.column.name && gridCell.column.name == "SalesCHG")
                    if (gridCell.data && gridCell.data["SalesCHG"] != 0)
                        if (gridCell.data["SalesCHG"] > 0)
                            options.font.color = '#008000';
                        else
                            options.font.color = '#FF0000';
                if (options.gridCell.rowType == 'data' && gridCell.column.name && gridCell.column.name == "TransactionsCHG")
                    if (gridCell.data && gridCell.data["TransactionsCHG"] != 0)
                        if (gridCell.data["TransactionsCHG"] > 0)
                            options.font.color = '#008000';
                        else
                            options.font.color = '#FF0000';
                if (options.gridCell.rowType == 'data' && gridCell.column.name && gridCell.column.name == "GCAvgCHG")
                    if (gridCell.data && gridCell.data["GCAvgCHG"] != 0)
                        if (gridCell.data["GCAvgCHG"] > 0)
                            options.font.color = '#008000';
                        else
                            options.font.color = '#FF0000';
                if (options.gridCell.rowType == 'data' && gridCell.column.name && gridCell.column.name == "DeliverySalesCHG")
                    if (gridCell.data && gridCell.data["DeliverySalesCHG"] != 0)
                        if (gridCell.data["DeliverySalesCHG"] > 0)
                            options.font.color = '#008000';
                        else
                            options.font.color = '#FF0000';
                if (options.gridCell.rowType == 'data' && gridCell.column.name && gridCell.column.name == "DeliveryTransactionsCHG")
                    if (gridCell.data && gridCell.data["DeliveryTransactionsCHG"] != 0)
                        if (gridCell.data["DeliveryTransactionsCHG"] > 0)
                            options.font.color = '#008000';
                        else
                            options.font.color = '#FF0000';
                if (options.gridCell.rowType == 'data' && gridCell.column.name && gridCell.column.name == "DeliveryGCAvgCHG")
                    if (gridCell.data && gridCell.data["DeliveryGCAvgCHG"] != 0)
                        if (gridCell.data["DeliveryGCAvgCHG"] > 0)
                            options.font.color = '#008000';
                        else
                            options.font.color = '#FF0000';
            }


        },
        scrolling: { mode: "virtual" },
        //height: 600
    };
    function numberWithCommas(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
    var refreshData = function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.refresh();
    }
    $scope.start = function () {
        $scope.stop();
        promise = $interval(refreshData, 30000);
    };

    $scope.stop = function () {
        $interval.cancel(promise);
    };
    $scope.start();

    $scope.$on('$destroy', function () {
        $scope.stop();
        tranlatelistener();
        $element.remove();
        $rootScope.uService.ExitController("weeklysalescompareCtrl");
    });
};
