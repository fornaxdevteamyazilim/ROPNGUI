app.controller('inventorydeliverylistCtrl', inventorydeliverylistCtrl);
function inventorydeliverylistCtrl($scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $filter, ngnotifyService, $element, $location, userService, $timeout, $translate, NG_SETTING, $http, $q) {
    $rootScope.uService.EnterController("inventorydeliverylistCtrl");
    var id = this;
    id.search = '';
    userService.userAuthorizated();
    if ($rootScope.user && $rootScope.user.UserRole && $rootScope.user.UserRole.MemberID == "111679600561") {
        $scope.ShowInventoryInvoiceButton = true;
    }
    $scope.params = userService.getParameter('inventorydeliverylist',
        {
        fromDate: $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd'),
        toDate: moment().add(1, 'days').format('YYYY-MM-DD')
        }
    ).Parameters;
    
    $scope.translate = function () {
        $scope.trDateTime = $translate.instant('main.DATETIME');
        $scope.trDocumentNumber = $translate.instant('main.DOCUMENTNUMBER');
        $scope.trPaymentTerm = $translate.instant('main.PAYMENTTERM');
        $scope.trCompany = $translate.instant('main.COMPANY');
        $scope.trRepository = $translate.instant('main.REPOSITORY');
        $scope.trDocumentType = $translate.instant('main.DOCUMENTTYPE');
        $scope.trGrandTotal = $translate.instant('main.GRANDTOTAL');
        $scope.addnewdelivery = $translate.instant('main.ADDNEW');
        $scope.search = $translate.instant('main.SEARCH');
        $scope.selectcompany = $translate.instant('main.SELECTCOMPANY');
        $scope.startdate = $translate.instant('main.STARTDATE');
        $scope.enddate = $translate.instant('main.ENDDATE');
        $scope.showinvoices = $translate.instant('main.GETLIST');
        $scope.seacrhbydocumentnumber = $translate.instant('main.SEARCHBYDOCUMENTNUMBER');
        $scope.assigntoinvoice = $translate.instant('main.ASSIGNTOINVOICE');
        $scope.selectstore = $translate.instant('main.SELECTSTORE');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
        
    $scope.CreatInvoice = function (data) {
        var item = {};
        item.InventoryDeliveryIDs = [];
        item.InvoiceDocumentNumber = '';
        item.InvoiceDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
        for (var i = 0; i < id.tableParams.data.length; i++) {
            if (id.tableParams.data[i].isSelected == true) {
                item.InventoryDeliveryIDs.push(id.tableParams.data[i].id)
            }
        }        
        Restangular.restangularizeElement('', item, 'inventorydelivery/assigntoinvoice')
        item.post().then(function (resp) {
            swal("Kaydedildi!", "Data Successfully Saved!", "success");
            $location.path('app/inventory/inventorydeliveryinvoice/edit/'+ resp.id);
        });
    };
    var store = new DevExpress.data.CustomStore({
        key: "id",
        load: function (loadOptions) {
            var params = {
                fromDate: $scope.DateRange.fromDate.value,
                toDate: $scope.DateRange.toDate.value,
                pageSize: 100000,
                pageNo: 1,
                search: "DeliveryDate between '" + $filter('date')($scope.params.fromDate, 'yyyy-MM-dd') + "' and '" + $filter('date')($scope.params.toDate, 'yyyy-MM-dd') + "'"
            };
            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/inventorydelivery", { params: params })
                .then(function (response) {
                    return {
                        data: response.data.Items,
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
        stateStoring: {
            enabled: true,
            type: "custom",
            customLoad: function () {
                return $scope.params.gridState;
            },
            customSave: function (state) {
                $scope.params.gridState= state;
            }
        },
        //stateStoring: {
        //    enabled: true,
        //    type: "localStorage",
        //    storageKey: "storage"
        //},
        columns: [
            { type: "buttons", width: 50, buttons: [{ hint: "edit", icon: "edit", onClick: function (e) { location.href = '#/app/inventory/inventorydeliveries/edit/' + e.row.data.id; } }] },
            { dataField: "id", dataType: "number", visible: false },
            { dataField: "DocumentNumber", dataType: "string" },
            { dataField: "DocumentType", dataType: "string" },
            { dataField: "Company", dataType: "string" },
            { dataField: "Repository", dataType: "string", width: 80 },
            { dataField: "DeliveryDate", alignment: "right", dataType: "date", width: 80, format: 'dd.MM.yyyy' },
            { dataField: "VAT", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { dataField: "Amount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { dataField: "GrandTotal", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { dataField: "Description", dataType: "string" },

        ],
        export: {
            enabled: true,
            fileName: "InventoryDeliveries",
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
        height: 600,
        paging: {
            enabled: true
        }
    };
    $scope.LoadData = function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.refresh();
    };
    $scope.reportButtonOptions = {
        text: $scope.showinvoices,
        onClick: function () {
            var dataGrid = $('#gridContainer').dxDataGrid('instance');
            dataGrid.refresh();
        }
    };
    $scope.addNewButtonOptions = {
        text: $scope.addnewdelivery,
        onClick: function () {
            location.href = '#/app/inventory/inventorydeliveries/edit/new';
        }
    };
    $scope.DateRange = {
        fromDate: {
            max: $scope.params.toDate,
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "params.fromDate"
            },
            value: $scope.params.fromDate.value
        },
        toDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "params.toDate"
            },
            value: $scope.params.toDate.value
        }
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("inventorydeliverylistCtrl");
    });
};
