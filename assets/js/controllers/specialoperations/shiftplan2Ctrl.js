'use strict';
app.controller('shiftplan2Ctrl', shiftplan2Ctrl);
function shiftplan2Ctrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q) {
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
    $scope.addNewButtonOptions = {
        text: $scope.addnewdelivery,
        onClick: function () {
            location.href = '#/app/specialoperations/shiftplan/';
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
        //key: "id",
        load: function (loadOptions) {
            var params = {
                firstYear: $scope.startYear,
                firstWeek: $scope.startWeek,
                secondYear: $scope.endYear,
                secondWeek: $scope.endWeek
            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/ShiftPlan", { params: params })
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
        showRowLines: true,
        rowAlternationEnabled: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showBorders: true,
        filterRow: { visible: true },
        //filterPanel: { visible: true },
        headerFilter: { visible: true },
        columnChooser: {
            enabled: true
        },
        columnFixing: {
            enabled: true
        },
        sorting: {
            mode: "none"
        },
        columns: [
            { type: "buttons", width: 50, buttons: [{ hint: "edit", icon: "edit", onClick: function (e) { location.href = '#/app/specialoperations/shiftplanedit2/' + e.row.data.id; } }] },
            { dataField: "Store", dataType: "string", width: 180, fixed: true, },
            { dataField: "PeriodWeek", dataType: "number", fixed: true, },
            { dataField: "PeriodYear", dataType: "string", width: 180, fixed: true, },
            { dataField: "PeriodWeek", dataType: "number", fixed: true, },
         
            
        ],

        onRowPrepared: function (e) {
            if (e.rowType === 'data') {
                if (!e.data.Store) {
                    e.rowElement.css({ 'font-weight': 'bold', 'background': '#dcdcdc' });
                }
            }
        },
        onCellPrepared: function (options) {
            var fieldData = options.value;
            var ColoredFileds = ["Sales", "HDSSales", "HDSSalesPercent", "DINSales", "DINSalesPercent", "COSales", "COSalesPercent", "HDSTrx", "HDSTrxPercent", "DINTrx", "DINTrxPercent",
                "COTrx", "COTrxPercent", "AvgGC", "HDSAvgGC", "DINAvgGC", "COAvgGC"];
            if (fieldData && options.row.data.Delta === true && ColoredFileds.indexOf(options.column.dataField) > -1) {
                if (options.value < 0)
                    options.cellElement.css({ 'color': '#f00' });
                else
                    options.cellElement.css({ 'color': '#2ab71b' });
                
            }
            if (options.column.dataField === 'x') {
                options.cellElement.css({ 'background-color': '#DCDCDC' });  
            }

        },
        export: {
            enabled: true,
            fileName: "Actual Theoretical COS COL",
            customizeExcelCell: (options) => {
                var gridCell = options.gridCell;
                if (!gridCell) {
                    return;
                }
                var ColoredFileds = ["Sales", "HDSSales", "HDSSalesPercent", "DINSales", "DINSalesPercent", "COSales", "COSalesPercent", "HDSTrx", "HDSTrxPercent", "DINTrx", "DINTrxPercent",
                    "COTrx", "COTrxPercent", "AvgGC", "HDSAvgGC", "DINAvgGC", "COAvgGC"];
                if (ColoredFileds.indexOf(gridCell.column.dataField) > -1) {
                    if (gridCell.data && gridCell.data.Delta === true)
                        if (gridCell.data[gridCell.column.dataField] > 0)
                            options.font.color = '#008000';
                        else
                            options.font.color = '#FF0000';
                }
                if (gridCell.rowType === 'data') {
                    if (!gridCell.data.Store) {
                        options.font.bold = true;
                        options.backgroundColor = '#DCDCDC';
                    }
                    
                }
                if (gridCell.column.dataField === 'x') {
                    options.backgroundColor = '#000000';
                }
            }
        },
        scrolling: {
            mode: "virtual"
        },

    };
    $scope.selectBox = {
        dataSourceUsage: {
            dataSource: new DevExpress.data.ArrayStore({
                data: $filter('orderBy')($rootScope.user.userstores, 'name'),
                key: "id"
            }),
            displayExpr: "name",
            valueExpr: "id",
            placeholder: "Select Store...",
            value: $rootScope.user.StoreID,
            bindingOptions: {
                value: "StoreID"
            }
        },
    };
    $scope.NewShiftPlan = function () {
        var item = {};
        if (userService.userIsInRole("STOREMANAGER")) {
            item.StoreID = $rootScope.user.StoreID;
        }
        else {
            item.StoreID = $scope.StoreID;
        }
        item.PeriodYear = $scope.Year;
        item.PeriodWeek = $scope.Week;
        Restangular.restangularizeElement('', item, 'ShiftPlan')
        item.post().then(function (resp) {
            location.href = '#/app/specialoperations/shiftplanedit2/' + resp.id;
        }, function (response) {
            toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
        });
    };

    $scope.LoadData = function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.refresh();
    };

}