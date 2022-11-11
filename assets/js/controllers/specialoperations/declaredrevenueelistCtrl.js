'use strict';
app.controller('declaredrevenueelistCtrl', declaredrevenueelistCtrl);
function declaredrevenueelistCtrl($scope, $filter, $modal, $log, localStorageService, Restangular, ngTableParams, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING) {
    $rootScope.uService.EnterController("declaredrevenueelistCtrl");
    if (!$rootScope.ReportParameters.StartDate) {
        $rootScope.ReportParameters.StartDate = moment().add(-1, 'days').format('YYYY-MM-DD ');//$filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if (!$rootScope.ReportParameters.EndDate) {
        $rootScope.ReportParameters.EndDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    //$scope.NewDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    var ctrl = this;
    $scope.Time = ngnotifyService.ServerTime();
    if (!$rootScope.user || !$rootScope.user.UserRole || !$rootScope.user.UserRole.Name) {
        $location.path('/login/signin');
    };
    $scope.FromDate = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            var data = new Date(item);
            $rootScope.ReportParameters.StartDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.ToDate = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            var data = new Date(item);
            $rootScope.ReportParameters.EndDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.resetlayout = $translate.instant('main.FILTERRESET');
    $scope.resetButtonOptions = {
        text: $scope.resetlayout,
        onClick: function () {
            $('#gridContainer').dxDataGrid('instance').state({});
        }
    };
    $scope.reportButtonOptions = {
        text: $translate.instant('reportcommands.GetData'),
        onClick: function () {
            var dataGrid = $('#gridContainer').dxDataGrid('instance');
            var gridDS = dataGrid.getDataSource();
            dataGrid.clearFilter();
            gridDS.filter(getFilter());
            dataGrid.refresh();
        }
    };
    $scope.inittable = function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        var gridDS = dataGrid.getDataSource();
        gridDS.filter(getFilter());
        dataGrid.refresh();
    }
    // function BuildUserStoresArray(src) {
    //     var result = [];
    //     if (src) {
    //         for (var i = 0; i < src.length; i++) {
    //             result.push(["StoreID", "=", src[i].id]);
    //             if (src.length > 0)
    //                 result.push("or");
    //         }
    //     }
    //     else
    //         return null;
    //     return result;
    // };
    function getFilter() {

        return [["OperationDate", ">=", $rootScope.ReportParameters.StartDate], "and", ["OperationDate", "<=", $rootScope.ReportParameters.EndDate]];
    }

    $scope.gridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxdeclaredrevenue",
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
        filterValue: getFilter(),
        remoteOperations: true,
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        //keyExpr: "id",
        columnChooser: { enabled: true },
        showBorders: true,
        hoverStateEnabled: true,
        allowColumnReordering: true,
        searchPanel: { visible: true },
        showBorders: true,
        fieldChooser: {
            enabled: true
        },

        columns: [
            { type: "buttons", width: 50, buttons: [{ hint: "edit", icon: "edit", onClick: function (e) { location.href = '#/app/reports/giroreports/declaredrevenuee/' + e.row.data.id; } }] },
            { dataField: "id", caption: "id", visible: false },
            { dataField: "OperationDate", alignment: "right", dataType: "date", format: 'dd.MM.yyyy', caption: $translate.instant('declaredrevenuelist.OperationDate'), sortIndex: 0, sortOrder: "desc" },
            //{ dataField: "fk_ObjectUpdate_id", caption: $translate.instant('declaredrevenuelist.fk_ObjectUpdate_id') }, 
            {
                dataField: "StoreID", caption: $translate.instant('declaredrevenuelist.StoreID'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStore",
                            onBeforeSend: function (method, ajaxOptions) {
                                var authData = localStorageService.get('authorizationData');
                                if (authData) {
                                    ajaxOptions.headers = {
                                        Authorization: 'Bearer ' + authData.token,
                                        'Content-type': 'application/json'
                                    };
                                }
                            }
                        }),
                        sort: "name",
                        headerFilter: { allowSearch: true }
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }
                },

            },
            {
                dataField: "StoreID", caption: $translate.instant('declaredrevenuelist.AC_CostCenter'), width: 200,    
                lookup: {
                    valueExpr: "id",
                    displayExpr: "AC_CostCenter",
                    searchMode:"contains",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStore" 
                        }),
                        sort: "AC_CostCenter",
                        headerFilter: { allowSearch: true }
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }  
                },

                //fixed: true,
                //groupIndex: 0
            },
       
            { dataField: "DeclaredAmount", caption: $translate.instant('declaredrevenuelist.DeclaredAmount'), format: { type: "fixedPoint", precision: 2 } },
            { dataField: "ActualAmount", caption: $translate.instant('declaredrevenuelist.ActualAmount'), format: { type: "fixedPoint", precision: 2 } },
            { dataField: "TotalCash", caption: $translate.instant('declaredrevenuelist.TotalCash'), format: { type: "fixedPoint", precision: 2 } },
            { dataField: "DeltaCash", caption: $translate.instant('declaredrevenuelist.DeltaCash'), format: { type: "fixedPoint", precision: 2 } },
            { dataField: "DepositedAmount", caption: $translate.instant('declaredrevenuelist.DepositedAmount'), minWidth: 100, },
            { dataField: "ReceiptNumber", caption: $translate.instant('declaredrevenuelist.ReceiptNumber'), minWidth: 100, },
            { dataField: "ATMID", caption: $translate.instant('declaredrevenuelist.ATMID'), minWidth: 100, },
            { dataField: "Notes", caption: $translate.instant('declaredrevenuelist.Notes'), minWidth: 200, },
            { dataField: "isCharged", caption: $translate.instant('declaredrevenuelist.isCharged'), visible: false },
            { dataField: "isOk", caption: $translate.instant('declaredrevenuelist.isOk') },
            { dataField: "SendDate", caption: $translate.instant('declaredrevenuelist.SendDate') }

        ],
        summary: {
            totalItems: [
                { column: "StoreID", showInColumn: "Total", summaryType: "count", },
                //{ column: "ActualAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            ],
            groupItems: [
                //{ name: "StoreID", showInColumn: "Total", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                //{ name: "ActualAmount", showInColumn: "Total", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            ],
        },
        filterRow: {
            visible: true
        },
        headerFilter: {
            visible: true
        },
        "export": {
            enabled: true,
            fileName: "dxdeclaredrevenue",
        },
        scrolling: {
            mode: "virtual"
        },
        height: 600,
        showBorders: true,
        summary: {
            totalItems: [{
                column: "id",
                summaryType: "count"
            }]
        }
    };


    $scope.LoadData = function () {

    };
    //$scope.inittable();
    $scope.$on('$destroy', function () {
        $element.remove();
    });

    $scope.Back = function () {
        $window.history.back();
    };
};
