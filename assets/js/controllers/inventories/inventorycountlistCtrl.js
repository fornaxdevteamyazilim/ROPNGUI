app.controller('inventorycountlistCtrl', inventorycountlistCtrl);
function inventorycountlistCtrl($scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $filter, ngnotifyService, $element, $location, userService, $timeout, $translate, NG_SETTING, $http, $q) {
    $rootScope.uService.EnterController("inventorycountlistCtrl");
    var id = this;
    id.search = '';
    userService.userAuthorizated();
    if ($rootScope.user && $rootScope.user.UserRole && $rootScope.user.UserRole.MemberID == "111679600561") {
        $scope.ShowInventoryInvoiceButton = true;
    }
    $scope.params = userService.getParameter('inventorycountlist',
        {
            fromDate: $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd'),
            toDate: moment().add(0, 'days').format('YYYY-MM-DD')
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
        $scope.trCountType = $translate.instant('main.COUNTTYPE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });

    $scope.CreatInvoice = function (data) {
        var item = {};
        item.InventoryCountIDs = [];
        item.InvoiceDocumentNumber = '';
        item.InvoiceDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
        for (var i = 0; i < id.tableParams.data.length; i++) {
            if (id.tableParams.data[i].isSelected == true) {
                item.InventoryCountIDs.push(id.tableParams.data[i].id)
            }
        }
        Restangular.restangularizeElement('', item, 'inventorycount/assigntoinvoice')
        item.post().then(function (resp) {
            swal("success" ,$translate.instant('invantories.Saved'), $translate.instant('difinitions.DataSuccessfullySaved') );
            $location.path('app/inventory/inventorycount/edit/' + resp.id);
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
                search: "CountDate between '" + $filter('date')($scope.params.fromDate, 'yyyy-MM-dd') + "' and '" + $filter('date')($scope.params.toDate, 'yyyy-MM-dd') + "'"
            };
            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/dxInventoryCount", { params: params })
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
                $scope.params.gridState = state;
            }
        },
        //stateStoring: {
        //    enabled: true,
        //    type: "localStorage",
        //    storageKey: "storage"
        //},
        columns: [
            { caption: $scope.trCommands ,type: "buttons",  buttons: [{ hint: "edit", icon: "edit", onClick: function (e) { location.href = '#/app/inventory/inventorycount/edit/' + e.row.data.id; } }] },
            { caption: "id",dataField: "id", dataType: "number", visible: false },
            { caption: $scope.trDateTime, dataField: "CountDate", alignment: "right", dataType: "date", format: 'dd.MM.yyyy',sortIndex: 0,sortOrder: "desc" },
            { caption: $scope.trDescription, dataField: "Description", dataType: "string" },
            { caption: $scope.trRepository, dataField: "Repository", dataType: "string" },
            { caption: $scope.trCountType, dataField: "InventoryCountType", dataType: "string" },


        ],
        export: {
            enabled: true,
            fileName: "InventoryCounts",
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
        },
        // masterDetail: {
        //     enabled: true,
        //     template: "detail"
        // }
    };
    // $scope.getDetailGridSettings = function (key) {
    //     return {
    //         dataSource: new DevExpress.data.DataSource({
    //             store: new DevExpress.data.CustomStore({
    //                 key: "$stateParams.id",
    //                 load: function (loadOptions) {
    //                     var params = {
    //                         pageSize: 100000,
    //                         pageNo: 1,
    //                         search: "InventoryCountID= '" + key + "'"
    //                     };
    //                     return $http.get(NG_SETTING.apiServiceBaseUri + "/api/inventorycount", { params: params })
    //                         .then(function (response) {
    //                             return {
    //                                 data: response.data.Items,
    //                                 totalCount: 10
    //                             };
    //                         }, function (response) {
    //                             return $q.reject("Data Loading Error");
    //                         });
    //                 }
    //             })
    //         }),
    //         columnAutoWidth: true,
    //         showBorders: true,
    //         columns: ['InventoryUnit',
    //             { dataField: "InventoryGroup" },
    //             { dataField: "UnitCount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
    //             { dataField: "UnitPrice", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
    //         ],
    //         export: {
    //             enabled: true,
    //             fileName: "InventoryCountIDItems",
    //             customizeExcelCell: (options) => {
    //                 var gridCell = options.gridCell;
    //                 if (!gridCell) {
    //                     return;
    //                 }
    //                 if (gridCell.rowType === 'data') {
    //                     if (gridCell.data.Delta === true) {
    //                         options.font.bold = true;
    //                         options.backgroundColor = '#FFBB00';
    //                     }
    //                 }
    //             }
    //         },
    //     };
    // }
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
            location.href = '#/app/inventory/inventorycount/edit/new';
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
        $rootScope.uService.ExitController("inventorycountlistCtrl");
    });
};
