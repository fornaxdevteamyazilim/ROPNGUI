'use strict';
app.controller('fsrcomparisonbudgetCtrl', fsrcomparisonbudgetCtrl);
function fsrcomparisonbudgetCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q) {
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
    $scope.startWeek = parseInt(vNumber - 1);
    $scope.endWeek = parseInt(vNumber);
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
            $("#sales").dxPivotGrid("instance").getDataSource().state({});
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

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/fsr/comparisonbudget", { params: params })
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
        columnChooser: {            enabled: true        },
        columnFixing: {            enabled: true        },
        groupPanel: {            visible: true        },
        columns: [{
            dataField: "Area",
            dataType: "string",
            width: 230,
            fixed: true,
            groupIndex: 0
        },
        {
            dataField: "Week",
            dataType: "number",
            fixed: true,
        }, {
            caption: "Total",
            columns: [
                { 
                    caption: "Sales",
                    columns: [
                        { caption: $scope.startYear, dataField: "Sales", dataType: "number", format: "fixedPoint", },
                        { caption: $scope.startYear - 1, dataField: "SalesPrev", dataType: "number", format: "fixedPoint" },
                        { caption: "Chg%", dataField: "ChgPercent", dataType: "number", format: { type: "percent", precision: 2 }, },
                        { caption: "Budget", dataField: "SalesBudget", dataType: "number", format: "fixedPoint", },
                        { caption: "Chg%", dataField: "ChgBudgetPercent", dataType: "number", format: { type: "percent", precision: 2 } }
                    ]                    
                }, {
                    caption: "TRX",
                    columns: [
                        { caption: $scope.startYear, dataField: "Trx", dataType: "number", format: "fixedPoint", },
                        { caption: $scope.startYear - 1, dataField: "TrxPrev", dataType: "number", format: "fixedPoint" },
                        { caption: "Chg%", dataField: "ChgPercentTrx", dataType: "number", format: { type: "percent", precision: 2 }, },
                        { caption: "Budget", dataField: "TCBudget", dataType: "number", format: "fixedPoint", },
                        { caption: "Chg%", dataField: "ChgBudgetPercentTrx", dataType: "number", format: { type: "percent", precision: 2 } }
                    ]
                }],
                fixed: true
        },
        {
            caption: "HDS",
            columns: [
                {
                    caption: "Sales",
                    columns: [
                        { caption: $scope.startYear, dataField: "HDSSales", dataType: "number", format: "fixedPoint", },
                        { caption: $scope.startYear - 1, dataField: "HDSSalesPrev", dataType: "number", format: "fixedPoint" },
                        { caption: "Chg%", dataField: "HDSChgPercent", dataType: "number", format: { type: "percent", precision: 2 }, },
                        { caption: "Budget", dataField: "SalesDeliveryBudget", dataType: "number", format: "fixedPoint", },
                        { caption: "Chg%", dataField: "HDSChgBudgetPercent", dataType: "number", format: { type: "percent", precision: 2 } }
                    ]
                }, {
                    caption: "TRX",
                    columns: [
                        { caption: $scope.startYear, dataField: "HDSTrx", dataType: "number", format: "fixedPoint", },
                        { caption: $scope.startYear - 1, dataField: "HDSTrxPrev", dataType: "number", format: "fixedPoint" },
                        { caption: "Chg%", dataField: "HDSChgPercentTrx", dataType: "number", format: { type: "percent", precision: 2 }, },
                        { caption: "Budget", dataField: "TCDeliveryBudget", dataType: "number", format: "fixedPoint", },
                        { caption: "Chg%", dataField: "HDSChgBudgetPercentTrx", dataType: "number", format: { type: "percent", precision: 2 } }
                    ]
                }]
        },
        {
            caption: "DIN",
            columns: [
                {
                    caption: "Sales",
                    columns: [
                        { caption: $scope.startYear, dataField: "DINSales", dataType: "number", format: "fixedPoint", },
                        { caption: $scope.startYear - 1, dataField: "DINSalesPrev", dataType: "number", format: "fixedPoint" },
                        { caption: "Chg%", dataField: "DINChgPercent", dataType: "number", format: { type: "percent", precision: 2 }, },
                        { caption: "Budget", dataField: "SalesInStoreBudget", dataType: "number", format: "fixedPoint", },
                        { caption: "Chg%", dataField: "DINChgBudgetPercent", dataType: "number", format: { type: "percent", precision: 2 } }
                    ]
                }, {  
                    caption: "TRX",
                    columns: [
                        { caption: $scope.startYear, dataField: "DINTrx", dataType: "number", format: "fixedPoint", },
                        { caption: $scope.startYear - 1, dataField: "DINTrxPrev", dataType: "number", format: "fixedPoint" },
                        { caption: "Chg%", dataField: "DINChgPercentTrx", dataType: "number", format: { type: "percent", precision: 2 }, },
                        { caption: "Budget", dataField: "TCInStoreBudget", dataType: "number", format: "fixedPoint", },
                        { caption: "Chg%", dataField: "DINChgBudgetPercentTrx", dataType: "number", format: { type: "percent", precision: 2 } }
                    ]
                }]
        },
        {
            caption: "CO",
            columns: [
                {
                    caption: "Sales",
                    columns: [
                        { caption: $scope.startYear, dataField: "COSales", dataType: "number", format: "fixedPoint", },
                        { caption: $scope.startYear - 1, dataField: "COSalesPrev", dataType: "number", format: "fixedPoint" },
                        { caption: "Chg%", dataField: "COChgPercent", dataType: "number", format: { type: "percent", precision: 2 }, },
                        { caption: "Budget", dataField: "SalesTakeAwayBudget", dataType: "number", format: "fixedPoint", },
                        { caption: "Chg%", dataField: "COChgBudgetPercent", dataType: "number", format: { type: "percent", precision: 2 } }
                    ]
                }, {
                    caption: "TRX",
                    columns: [
                        { caption: $scope.startYear, dataField: "COTrx", dataType: "number", format: "fixedPoint", },
                        { caption: $scope.startYear - 1, dataField: "COTrxPrev", dataType: "number", format: "fixedPoint" },
                        { caption: "Chg%", dataField: "COChgPercentTrx", dataType: "number", format: { type: "percent", precision: 2 }, },
                        { caption: "Budget", dataField: "TCTakeAwayBudget", dataType: "number", format: "fixedPoint", },
                        { caption: "Chg%", dataField: "COChgBudgetPercentTrx", dataType: "number", format: { type: "percent", precision: 2 } }
                    ]
                }]
        }
        ],
        onRowPrepared: function (e) {
            if (e.rowType === 'data') {
                if (e.data.Delta === true) {
                    //e.rowElement.addClass('place');
                    e.rowElement.css({ 'font-weight': 'bold', 'background': '#ebb3af' });
                }
                //else {
                //    e.data.place = "";
                //}
            }
        },
        export: {
            enabled: true,
            fileName: "FSR Comparison Budget",
            customizeExcelCell: (options) => {
                var gridCell = options.gridCell;
                if (!gridCell) {
                    return;
                }
                if (gridCell.rowType === 'data') {
                    if (gridCell.data.Delta === true) {
                        options.font.bold = true;
                        options.backgroundColor = '#FFBB00';
                    }
                }
            }
        },
        scrolling: {
            mode: "virtual"
        },
        //scrolling: {
        //    columnRenderingMode: "virtual"
        //},
        //paging: {
        //    enabled: false
        //}
    };

    $scope.LoadData = function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.refresh();
    };

}