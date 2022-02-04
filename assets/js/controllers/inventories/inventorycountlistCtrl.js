'use strict';
app.controller('inventorycountlistCtrl', inventorycountlistCtrl);
function inventorycountlistCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q, localStorageService) {

    var ctrl = this;
    $scope.Time = ngnotifyService.ServerTime();

    if (!$rootScope.user || !$rootScope.user.UserRole || !$rootScope.user.UserRole.Name) {
        $location.path('/login/signin');
    }
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
            value: (new Date()).addDays(0),
            label: {
                location: "top",
                alignment: "right" // or "left" | "center"
            }
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
    $scope.addNewButtonOptions = {
        text: $translate.instant('reportcommands.ADDNEWCOUNT'),
        onClick: function () {
            location.href = '#/app/inventory/inventorycount/edit/new';
        }
    };
    $scope.inittable=function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        var gridDS = dataGrid.getDataSource();
        gridDS.filter(getFilter());
        dataGrid.refresh();
    }
    function BuildUserStoresArray(src) {
        var result = [];
        if (src) {
            for (var i = 0; i < src.length; i++) {
                result.push(["StoreID", "=", src[i].id]);
                if (src.length > 0)
                    result.push("or");
            }
        }
        else
            return null;
        return result;
    };
    function getFilter() { //"and",["!",["OrderType","=",""]]
        var s = BuildUserStoresArray($rootScope.user.userstores);
        var fdate = new Date($scope.DateRange.fromDate.value.getFullYear(), $scope.DateRange.fromDate.value.getMonth(), $scope.DateRange.fromDate.value.getDate());
        var tdate = new Date($scope.DateRange.toDate.value.getFullYear(), $scope.DateRange.toDate.value.getMonth(), $scope.DateRange.toDate.value.getDate());

        if ($scope.StoreID) {
            return [[["CountDate", ">=", fdate], "and", ["CountDate", "<=", tdate]], "and", ["StoreID", "=", $scope.StoreID]];
        }
        else {
            //var s= BuildUserStoresArray($rootScope.user.userstores);
            //if (s)
            //    return [["CountDate", ">=", fdate], "and", ["CountDate", "<=", tdate], [s]];
            //else
                return [["CountDate", ">=", fdate], "and", ["CountDate", "<=", tdate]];
        }
    };
    var InventoryCountTypes = {
        store: new DevExpress.data.CustomStore({
            key: "Value",
            load: function () {
                return $http.get(NG_SETTING.apiServiceBaseUri + "/api/enums/InventoryCountType")
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
    $scope.dataGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxInventoryCount",
            onBeforeSend: function (method, ajaxOptions) {
                var authData = localStorageService.get('authorizationData');
                if (authData) {
                    ajaxOptions.headers = {
                        Authorization: 'Bearer ' + authData.token,
                    };
                }
            },
            //onBeforeSend: function (method, ajaxOptions) {
            //    ajaxOptions.xhrFields = { withCredentials: true };
            //}
            //loadParams: {
            //    filter: JSON.stringify(getFilter()),
            //},
            //filter: getFilter(),
        
            remoteOperations: true,
        }),
        //filter: getFilter(),
        filterValue: getFilter(),
        remoteOperations: true,
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        columns: [
            { caption: $translate.instant('InventoryCounts.Commands'), type: "buttons",  buttons: [{ hint: "edit", icon: "edit", onClick: function (e) { location.href = '#/app/inventory/inventorycount/edit/' + e.row.data.id; } }] },
            { caption: "id",dataField: "id", dataType: "number", visible: false },
            {
                caption: $translate.instant('InventoryCounts.RepositoryID'), dataField: "RepositoryID",
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/cache/Repository",
                            onBeforeSend: function (method, ajaxOptions) {
                                var authData = localStorageService.get('authorizationData');
                                if (authData) {
                                    ajaxOptions.headers = {
                                        Authorization: 'Bearer ' + authData.token,
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
            { caption: $translate.instant('InventoryCounts.CountDate'), dataField: "CountDate", alignment: "right", dataType: "date", format: 'dd.MM.yyyy' },
            { caption: $translate.instant('InventoryCounts.Description'), dataField: "Description", dataType: "string" },
            //{ caption: $translate.instant('InventoryCounts.Notes'), dataField: "Notes", dataType: "string" }, 
            { caption: $translate.instant('InventoryCounts.InventoryCountTypeID'), dataField: "InventoryCountTypeID", dataType: "string",
            lookup: {
                valueExpr: "Value",
                displayExpr: "Name",
                dataSource: InventoryCountTypes,
                calculateSortValue: function (data) {
                    var value = this.calculateCellValue(data);
                    return this.lookup.calculateCellValue(value);
                }
            } },
            //{ caption: $translate.instant('InventoryCounts.fk_ObjectUpdate_id'), dataField: "fk_ObjectUpdate_id", dataType: "string" },

        ],
        filterRow: {
            visible: true
        },
        headerFilter: {
            visible: true
        },
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
