'use strict';
app.controller('productsalessummaryCtrl', productsalessummaryCtrl);
function productsalessummaryCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q) {
    var ctrl = this;
    //var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
    //    $scope.translate();
    //});

    //DevExpress.localization.locale("tr");
    //Globalize.locale('tr');
    $scope.DateRange = {
        fromDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.fromDate.value"
            },
            value: new Date()
        },
        toDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.toDate.value"
            },
            value: new Date()
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
    $scope.resetlayout = $translate.instant('main.RESETLAYOUT');
    $scope.resetButtonOptions = {
        text: $scope.resetlayout,
        onClick: function () {
            $('#gridContainer').dxDataGrid('instance').state({});
        }
    };    
    var store = new DevExpress.data.CustomStore({
        //key: "StoreID",
        load: function () {
            var params = {
                fromDate: $scope.DateRange.fromDate.value,
                toDate: $scope.DateRange.toDate.value
            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/reports/productsalessummary", { params: params })
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
        showColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        //keyExpr: "id",
        showBorders: true,
        hoverStateEnabled: true,
        allowColumnReordering: true,
        filterRow: { visible: true },
        headerFilter: { visible: true },
        searchPanel: { visible: true },
   
        columns: [
            // { dataField: "StoreID", dataType: "string", fixed: true },//, groupIndex: 0 },
            { caption: $translate.instant('productsalessummary.ProductID'), dataField: "UrunID", dataType: "number",},
            { caption: $translate.instant('productsalessummary.ProductName'),dataField: "UrunAdi",dataType: "string" },//displayFormat: "bool" },
            { caption: $translate.instant('productsalessummary.SaleSource'), dataField: "SatisKanali", dataType: "string" },//, groupIndex: 0 },
            { caption: $translate.instant('productsalessummary.SaleType'), dataField: "SatisTipi", dataType: "string" },//, groupIndex: 0 }, 
            { caption:$translate.instant('productsalessummary.Quantiy'), dataField: "Adet", dataType: "number",},//, groupIndex: 0 },
         
        ],
        summary: {
            totalItems: [
                { column: "Adet", summaryType: "sum", displayFormat: "{0}" },
            { column: "SingleDispatchAmount",  summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            ],
            groupItems: [
                { column: "UndeliveredOrders", summaryType: "sum", displayFormat: "{0}" },
            { column: "DoubleDispatchAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 },displayFormat: "{0}", alignByColumn: true },
            { column: "TotalDispatchAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            
            ],
            
        },

        onRowPrepared: function (e) {
            if (e.rowType === 'data') {
                if (e.data.isDfferent) {
                    //e.rowElement.addClass('place');
                    e.rowElement.css({ 'color': 'red' });
                }
                //else {
                //    e.data.place = "";
                //}
            }
        },
        export: {
            enabled: true,
            fileName: "productsalessummary",
            customizeExcelCell: (options) => {
                var gridCell = options.gridCell;
                if (!gridCell) {
                    return;
                }
                if (gridCell.rowType === 'data') {
                    if (gridCell.data.isDfferent === true) {
                        //options.font.bold = true;
                        options.backgroundColor = '#FFBB00';
                    }
                }
            }
        },
        scrolling: {
            mode: "virtual"
        },
        height: 600,
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