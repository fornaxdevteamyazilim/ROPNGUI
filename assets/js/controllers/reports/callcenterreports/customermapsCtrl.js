'use strict';
app.controller('customermapsCtrl', customermapsCtrl);
function customermapsCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q) {
    var ctrl = this;
    //var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
    //    $scope.translate();
    //});
    //DevExpress.localization.locale("tr");
    //Globalize.locale('tr');
    Date.prototype.addDays = Date.prototype.addDays || function (days) {
        return this.setTime(864E5 * days + this.valueOf()) && this;
    };
    $scope.DateRange = {
        fromDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.fromDate.value"
            },
            value: (new Date()).addDays(0),
            labelLocation: "top", // or "left" | "right"  

        },
        toDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.toDate.value"
            },
            value: (new Date()).addDays(1),
            label: {
                location: "top",
                alignment: "right" // or "left" | "center"
            }
        }
    };
    $scope.VeiwHeader = {};
    $scope.reportButtonOptions = {
        text: $translate.instant('reportcommands.GetData'),
        onClick: function () {
            var dataGrid = $('#gridContainer').dxDataGrid('instance');
            dataGrid.refresh();
        }
    };
    // $scope.resetlayout = $translate.instant('main.RESETLAYOUT');
    // $scope.resetButtonOptions = {
    //     text: $scope.resetlayout,
    //     onClick: function () {
    //         $("#sales").dxPivotGrid("instance").getDataSource().state({});
    //     }
    // };

    var store = new DevExpress.data.CustomStore({
       // key: "id",
        load: function (loadOptions) {
            var params = {
                EndDate: $scope.DateRange.toDate.value,
                StartDate: $scope.DateRange.fromDate.value
               
            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/reports/callcenter/customermaps", { params: params })
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
    $scope.gridOptions = {
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
        grouping: { autoExpandAll: false },
        searchPanel: { visible: true },
        groupPanel: { visible: false },
        columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        remoteOperations: false,
        repaintChangesOnly: true,
        highlightChanges: true,
        hoverStateEnabled: true,
        twoWayBindingEnabled: false,
        repaintChangesOnly: true,
        loadPanel: { enabled: false },
        columns: [
            {
                dataField: "FullName", caption: "FullName",
            },
            {
                dataField: "GetirMaps", caption: "GetirMaps",
            },
            {
                dataField: "YemeksepetiMaps", caption: "YemeksepetiMaps",
            },
            {
                dataField: "TrendyolMaps", caption: "TrendyolMaps",
            },
            {
                dataField: "Total", caption: "Total",calculateCellValue: function (data) { return data.GetirMaps + data.YemeksepetiMaps + data.TrendyolMaps; }, visibleIndex: 8, format: { type: "fixedPoint", precision: 0 }
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
            fileName: "customermaps",
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
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.LoadData = function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.refresh();
    };

}