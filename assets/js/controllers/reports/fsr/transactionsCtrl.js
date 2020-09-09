'use strict';
app.controller('    ', transactionsCtrl);
function transactionsCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q) {
    if (!$rootScope.ReportParameters.StartDate) {
        $rootScope.ReportParameters.StartDate = moment().add(-1, 'days').format('YYYY-MM-DD ');//$filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if (!$rootScope.ReportParameters.EndDate) {
        $rootScope.ReportParameters.EndDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    $scope.NewDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    var ctrl = this;
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
    $scope.endWeek = parseInt(vNumber-1);
    $scope.VeiwHeader = {};
    $scope.startYearButton = {
        bindingOptions: {
            value: "startYear"
        },
        min: minYear,
        max: maxYear,
        showSpinButtons: true
    };
    $scope.startWeekButton = {
        bindingOptions: {
            value: "startWeek"
        },
        min: 1,
        max: 52,
        showSpinButtons: true
    };
    $scope.endYearButton = {
        bindingOptions: {
            value: "endYear"
        },
        min: minYear,
        max: maxYear,
        showSpinButtons: true
    };
    $scope.endWeekButton = {
        bindingOptions: {
            value: "endWeek"
        },
        min: 1,
        max: 52,
        showSpinButtons: true
    };
    $scope.reportButtonOptions = {
        text: "Get Data",
        onClick: function () {
            var dataGrid = $('#gridContainer').dxDataGrid('instance');
            dataGrid.refresh();
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
    var store = new DevExpress.data.CustomStore({
        key: "id",
        load: function (loadOptions) {
            var params = {
                firstYear: $scope.startYear,
                firstWeek: $scope.startWeek,
                secondYear: $scope.endYear,
                secondWeek: $scope.endWeek
            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/fsr/transactions", { params: params })
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
    $scope.dataGridOptions = {
        dataSource: store,
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showBorders: true,
        columnChooser: {
            enabled: true
        },
        columnFixing: {
            enabled: true
        },
        columns: [
            { dataField: "Area", dataType: "string", width: 230, fixed: true, },
            { dataField: "Year", dataType: "number", fixed: true, },
            { dataField: "Week", dataType: "number", fixed: true, },
            { dataField: "Sales", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { dataField: "HDSSales", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "HDS %", dataField: "HDSSalesPercent", dataType: "number", format: { type: "percent", precision: 2 } },
            { dataField: "DINSales", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "DIN %", dataField: "DINSalesPercent", dataType: "number", format: { type: "percent", precision: 2 } },
            { dataField: "COSales", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "CO %", dataField: "COSalesPercent", dataType: "number", format: { type: "percent", precision: 2 } },
            { caption: "HDS Trx", dataField: "HDSTrx", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "HDS Tx %", dataField: "HDSTrxPercent", dataType: "number", format: { type: "percent", precision: 2 } },
            { caption: "DIN Trx", dataField: "DINTrx", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "DIN Tx %", dataField: "DINTrxPercent", dataType: "number", format: { type: "percent", precision: 2 } },
            { caption: "CO Trx", dataField: "COTrx", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "CO Tx %", dataField: "COTrxPercent", dataType: "number", format: { type: "percent", precision: 2 } },
            { caption: "Avg GC", dataField: "AvgGC", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "HDS Avg GC", dataField: "HDSAvgGC", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "DIN Avg GC", dataField: "DINAvgGC", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "CO Avg GC", dataField: "COAvgGC", dataType: "number", format: { type: "fixedPoint", precision: 2 } }
        ],
        onRowPrepared: function (e) {
            if (e.rowType === 'data') {
                if (e.data.Delta === true) {
                    e.rowElement.css({ 'font-weight': 'bold', 'background': '#dcdcdc' });
                }
            }
        },
        onCellPrepared: function (options) {
            var fieldData = options.value;
            var ColoredFileds = ["Sales","HDSSales","HDSSalesPercent","DINSales","DINSalesPercent","COSales","COSalesPercent","HDSTrx","HDSTrxPercent","DINTrx","DINTrxPercent",
            "COTrx","COTrxPercent","AvgGC","HDSAvgGC","DINAvgGC","COAvgGC"];
            if (fieldData && options.row.data.Delta === true && ColoredFileds.indexOf(options.column.dataField)>-1) {
                if (options.value < 0)
                    options.cellElement.css({ 'color': '#f00' });
                else
                    options.cellElement.css({ 'color': '#2ab71b' });
            }
        },
        export: {
            enabled: true,
            fileName: "FSR Transactions",
            customizeExcelCell: (options) => {
                var gridCell = options.gridCell;
                if (!gridCell) {
                    return;
                }
                var ColoredFileds = ["Sales","HDSSales","HDSSalesPercent","DINSales","DINSalesPercent","COSales","COSalesPercent","HDSTrx","HDSTrxPercent","DINTrx","DINTrxPercent",
                "COTrx","COTrxPercent","AvgGC","HDSAvgGC","DINAvgGC","COAvgGC"];
                if (ColoredFileds.indexOf(gridCell.column.dataField)>-1) {
                    if (gridCell.data && gridCell.data.Delta === true)
                        if (gridCell.data[gridCell.column.dataField] > 0)
                            options.font.color = '#008000';
                        else
                            options.font.color = '#FF0000';
                }
                if (gridCell.rowType === 'data') {
                    if (gridCell.data.Delta === true) {
                        options.font.bold = true;
                        options.backgroundColor = '#DCDCDC';
                    }
                }
            }
        },
        scrolling: {
            mode: "virtual"
        },

    };

    $scope.LoadData = function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.refresh();
    };

}