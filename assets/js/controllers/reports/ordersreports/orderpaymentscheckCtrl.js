'use strict';
app.controller('orderpaymentscheckCtrl', orderpaymentscheckCtrl);
function orderpaymentscheckCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q) {
    var ctrl = this;
    //var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
    //    $scope.translate();
    //});
    
    DevExpress.localization.locale("tr");
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
        text: "Get Data",
        onClick: function () {
            var dataGrid = $('#gridContainer').dxDataGrid('instance');
            dataGrid.refresh();
        }
    };
  
    var store = new DevExpress.data.CustomStore({
        key: "StoreID",
        load: function () {
            var params = {
                fromDate: $scope.DateRange.fromDate.value,
                toDate: $scope.DateRange.toDate.value
            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/order/reports/orderpaymentscheck", { params: params })
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
        filterRow: {
            visible: true
        },
        headerFilter: {
            visible: true
        },
        searchPanel: {
            visible: true
        },
        groupPanel: {
            visible: true
        },
        columnChooser: {
            enabled: false
        },
        columnFixing: {
            enabled: true
        },
        columns: [
            // { dataField: "StoreID", dataType: "string", fixed: true },//, groupIndex: 0 },
            // { dataField: "OrderID", dataType: "string",  fixed: true },//, groupIndex: 0 },
            {  caption:"Restorant",dataField: "Store", dataType: "string", width: 230, fixed: true },//, groupIndex: 0 },
            {  caption:"Bölge Müdürü",dataField: "RegionManager", dataType: "string", width: 230, fixed: true, visible: true },
            {  caption:"Sipariş Türü",dataField: "StoreFilterType", dataType: "string", visible: true   },//, groupIndex: 0 },
            { caption:"Mağza Türü",dataField: "StoreType", dataType: "string" , visible: true },
            { caption:"Sipariş Tarihi",dataField: "OrderDate", dataType: "date", format: 'dd.MM.yyyy HH:mm'},
            { caption:"Sipariş No",dataField: "OrderNumber", dataType: "string" },
            { caption:"Kullanıcı Adı" ,dataField: "User", dataType: "string"  },
            { caption: "Sipariş Tutarı", dataField: "OrderAmount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "Gerçekleşen Ödeme Tutarı", dataField: "PaymentAmount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption:"Sipariş Ödeme Tipi ",dataField: "DeclaredPaymntType", dataType: "string" },
            { caption:"Kaynak",dataField: "ActualPaymentType", dataType: "string" },
            { caption:"Otomatik Ödeme",dataField: "isAutomaticPayment", displayFormat: "bool", },
        ],
        summary: {
            totalItems: [{ column: "OrderAmount", summaryType: "count", displayFormat: "{0}" },
                { column: "OrderAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },       
            ],
            groupItems: [{ column: "PaymentAmount", summaryType: "count", displayFormat: "{0}" },
                    { column: "PaymentAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            ]
         
        },
     
        onRowPrepared: function (e) {
            if (e.rowType === 'data') {
                if (e.data.OrderState === 'Cancel') {
                    //e.rowElement.addClass('place');
                    e.rowElement.css({  'color': 'red' });
                }
                //else {
                //    e.data.place = "";
                //}
            }
        },
        export: {
            enabled: true,
            fileName: "orderpaymentscheckReport",
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
        height: 600
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