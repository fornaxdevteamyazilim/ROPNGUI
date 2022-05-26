'use strict';
app.controller('InventoryRequirmentCtrl', InventoryRequirmentCtrl);
function InventoryRequirmentCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $rootScope, $translate, userService, ngnotifyService, $location, $element, NG_SETTING, $http, localStorageService) {
    $rootScope.uService.EnterController("InventoryRequirmentCtrl");
    var ir = this;
    userService.userAuthorizated();
    $scope.SelectedItem = null;
    ir.search = '';
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/inventory/inventoryrequirments/edit/' + $scope.SelectedItem;
    };
    $scope.params = userService.getParameter('inventorydeliverylist',
    {
        fromDate: $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd'),
        toDate: moment().add(ngnotifyService.ServerTime(), 'days').format('YYYY-MM-DD')
    }
).Parameters;
    $scope.newRequirment = function () {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/inventories/selectInventorySupply.html',
            controller: 'selectInventorySupplyCtrl',
            size: '',
            backdrop: '',
            resolve: {}
        });
        modalInstance.result.then(function (InventorySupplyID) {
            $scope.isWaiting = true;
            Restangular.one('InventorySupply/buildrequirment').get({
                StoreID: $rootScope.user.StoreID,
                ForDate: $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd'),
                InventorySupplyID: InventorySupplyID,
            }).then(function (result) {
                location.href = '#/app/inventory/inventoryrequirments/edit/' + result.id;
                $scope.isWaiting = false;
            }, function (response) {
                toaster.pop('error',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                $scope.isWaiting = false;
            });
        });
    };
    $scope.newRequirmentStore = function () {
        var data = {};
        data.StoreID = $rootScope.user.StoreID,
        data.Date = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd'),
        data.Notes = 'ROPNG ' + $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm') + ' İhtiyaç Listesi'
        Restangular.restangularizeElement('', data, 'InventoryRequirment')
        data.post().then(function (resp) {
            $location.path('app/inventory/inventoryrequirments/edit/' + resp.id);
            $scope.$broadcast('newRequirmentData', resp);
        }, function (response) {
            toaster.pop('error',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.translate = function () {
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trDateTime = $translate.instant('main.DATETIME');
        $scope.trNote = $translate.instant('main.NOTE');
        $scope.trDeliveryDate = $translate.instant('main.DELIVERYDATE');
        $scope.trInventoryRequirment = $translate.instant('main.INVENTORYREQUIRMENT');
        $scope.trInventorySupplyState = $translate.instant('main.INVENTORYSUPPLYSTATE');
        $scope.trisProcesseed = $translate.instant('main.STATE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trEmailConfirmed = $translate.instant('main.EMAILCONFIRMED');
        $scope.trisSended = $translate.instant('main.REQUIRMENTSISSENDED'); 
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.BuildSearchString = function (src) {
        var result = [];
        if (userService.userIsInRole("STOREMANAGER")) {
            result.push("StoreID =" + $rootScope.user.StoreID);
        }
        return result;
    };
    ir.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            Date: 'desc'
        }
    }, {
        getData: function ($defer, params) {
            Restangular.all('InventoryRequirment').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: $scope.BuildSearchString(),
                sort: params.orderBy()
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                if (items && items.length > 0)
                    $scope.SelectedItem = items[0].id;
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });

    $scope.resetlayout = $translate.instant('main.FILTERRESET');
    $scope.resetButtonOptions = {
        text: $scope.resetlayout,
        onClick: function () {
            $('#gridContainer').dxDataGrid('instance').state({});
        }
    }; 
    var InventorySupplyStates = {
        store: new DevExpress.data.CustomStore({
            key: "Value",
            load: function () {
                return $http.get(NG_SETTING.apiServiceBaseUri + "/api/enums/InventorySupplyState")
                    .then(function (response) {
                        return {
                            data: response.data,
                            totalCount: 10
                        };
                    }, function (response) {
                        return $q.reject("Data Loading Error");
                    });
            }
        }),
        sort: "Value"
    }
    // var store = new DevExpress.data.CustomStore({
    //     //key: "id",
    //     load: function (loadOptions) {
    //         var params = {
    //             pageNo: 1,
    //             pageSize: 10000,
    //            // search: "date between '" + $filter('date')($scope.params.fromDate, 'yyyy-MM-dd') + "' and '" + $filter('date')($scope.params.toDate, 'yyyy-MM-dd') + "'"
    //         };
    //         return $http.get(NG_SETTING.apiServiceBaseUri + "/api/dxInventoryRequirment", { params: params })
    //             .then(function (response) {
    //                 return {
    //                     data: response.data.Items,
    //                     totalCount: 10
    //                 };
    //             }, function (response) {
    //                 return $q.reject("Data Loading Error");
    //             });
    //     }
    // });
    $scope.dataGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxInventoryRequirment",
            /* insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxPunchcardSpendingRule",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxPunchcardSpendingRule",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxPunchcardSpendingRule", */
            onBeforeSend: function (method, ajaxOptions) {
                //if (request.method === "PUT") {
                //    updateUrl = NG_SETTING.apiServiceBaseUri + "/api/dxUser"+
                //}
                var authData = localStorageService.get('authorizationData');
                if (authData) {
                    
                    ajaxOptions.headers = {
                        Authorization: 'Bearer ' + authData.token//,
                        //'Content-type': 'application/json'
                    };  
                }                
            }
        }),
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        keyExpr: "id",
        showBorders: true,
        hoverStateEnabled: true,
        allowColumnReordering: true,
        filterRow: { visible: true },
        headerFilter: { visible: true },
        searchPanel: { visible: true },
        // stateStoring: {
        //     enabled: true,
        //     type: "custom",
        //     customLoad: function () {
        //         return $scope.params.gridState;
        //     },
        //     customSave: function (state) {
        //         $scope.params.gridState = state;
        //     }
        // },
        scrolling: { mode: "virtual" },
        stateStoring: {
           enabled: true,
           type: "localStorage",
           storageKey: "inv-req-list-storage"
        },
        columns: [
            { type: "buttons", width: 50, buttons: [{ hint: "edit", icon: "edit", onClick: function (e) { location.href = '#/app/inventory/inventoryrequirments/edit/' + e.row.data.id; } }] },
            { dataField: "id", dataType: "number", visible: false },
            { caption: $translate.instant('InventoryRequirment.StoreID'), dataField: "StoreID", dataType: "string" ,
            lookup: {
                valueExpr: "id",
                displayExpr: "name",
                searchMode:"contains",
                dataSource: {
                    store: DevExpress.data.AspNet.createStore({
                        key: "id",
                        loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStore" 
                    }),
                    sort: "name",
                    headerFilter: { allowSearch: true }
                },
                calculateSortValue: function (data) {
                    var value = this.calculateCellValue(data);
                    return this.lookup.calculateCellValue(value);
                }  
            },},
            { caption: $translate.instant('InventoryRequirment.DateTime'), dataField: "Date", alignment: "right", dataType: "date", format: 'dd.MM.yyyy', sortIndex: 0,sortOrder: "desc" },
            //{ caption: $translate.instant('InventoryRequirment.DeliveryDate'), dataField: "DeliveryDate", alignment: "right", dataType: "date",  format: 'dd.MM.yyyy' },
            //{ caption: $translate.instant('InventoryRequirment.Amount'), dataField: "Amount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('InventoryRequirment.Notes'), dataField: "Notes", dataType: "string" },
            { caption: $translate.instant('inventorypurchase.Amount'), dataField: "Amount", dataType: "number", format: { type: "fixedPoint", precision: 2 }, visibleIndex: 5 },
            { caption: $translate.instant('InventoryRequirment.InventorySupplyState'), dataField: "InventorySupplyState", dataType: "string",
            lookup: {
                valueExpr: "Value",
                displayExpr: "Name",
                dataSource: InventorySupplyStates,
                calculateSortValue: function (data) {
                    var value = this.calculateCellValue(data);
                    return this.lookup.calculateCellValue(value);
                }
            }},
            { caption: $translate.instant('InventoryRequirment.isSended'), dataField: "isProcesseed", dataType: "string" ,
            calculateCellValue: function (item) {
                return (item.isProcesseed && "evet"|| "hayır" )
            },},
            


        ],
        export: {
            enabled: true,
            fileName: "InventoryRequirment",
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
        
        height: 600,
        paging: {
            enabled: true
        },
    };
    $scope.LoadData = function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.refresh();
    };
    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }
    $scope.DateRange = {
        fromDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "params.fromDate"
            },
            value: (new Date()).addDays(-1),
        },
        toDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "params.toDate"
            },
            value: (new Date()).addDays(-1),
        }
    };
    $scope.open = function (ObjectID) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tags/ObjectTagEditModalContent.html',
            controller: 'TagModalCtrl',
            size: '',
            backdrop: '',
            resolve: {
                ObjectID: function () {
                    return ObjectID;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.result = selectedItem;
        });
    };
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container, filter) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
                search: filter,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({Calculate:false}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.InventorySupplyStates = [];
    $scope.loadEntities('enums/InventorySupplyState', 'InventorySupplyStates');
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("InventoryRequirmentCtrl");
    });
};
