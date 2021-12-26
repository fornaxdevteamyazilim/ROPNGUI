'use strict';
app.controller('orderroutedCtrl', orderroutedCtrl);
function orderroutedCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q) {
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
        key: "StoreID",
        load: function () {
            var params = {
                fromDate: $scope.DateRange.fromDate.value,
                toDate: $scope.DateRange.toDate.value
            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/order/reports/orderrouted", { params: params })
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
        showColumnLines: false,
        showRowLines: true,
        rowAlternationEnabled: true,
        showBorders: true,
        allowColumnReordering: true,
        filterRow: { visible: true },
        headerFilter: { visible: true },
        searchPanel: { visible: true },
        groupPanel: { visible: true },
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        grouping: { autoExpandAll: false },
        stateStoring: {
            enabled: true,
            type: "localStorage",
            storageKey: "dx-orderrouted-storing"
        },
        columns: [
            { caption:$translate.instant('orderrouted.OrderID'), dataField: "id", dataType: "number", fixed: true, visible: true },
            { caption: $translate.instant('orderrouted.ordertransmittedstore'), dataField: "ordertransmittedstore", dataType: "string", width: 230, fixed: true },
            { caption: $translate.instant('orderrouted.orderroutingstore'), dataField: "orderroutingstore", dataType: "string" },
            { caption: $translate.instant('orderrouted.customername'),dataField: "customername", dataType: "string" }, 
            { caption: $translate.instant('orderrouted.customerphone'), dataField: "customerphone", dataType: "number" },
            { caption: $translate.instant('orderrouted.customeradress'), dataField: "customeradress",  dataType: "string"},

                    
        ],
     
        

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
            fileName: "orderrouted",
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