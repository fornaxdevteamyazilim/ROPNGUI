app.controller('staffpermittsCtrl', staffpermittsCtrl);
function staffpermittsCtrl($rootScope, $scope, NG_SETTING, $translate, $element, localStorageService) {
    $rootScope.uService.EnterController("staffpermittsCtrl");
    var ngurr = this;
    $scope.NGUserRoleID = '';

    $scope.translate = function () {
        $scope.trUserRole = $translate.instant('main.USERROLE');
        $scope.trUserRestriction = $translate.instant('main.USERRESTRICTIONS');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.dataGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStaffPermits",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStaffPermits",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStaffPermits",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStaffPermits",
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
        //filterValue: getFilter(),
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: false,
        showRowLines: true,
        rowAlternationEnabled: true,
        showBorders: true,
        allowColumnReordering: true,
        filterRow: { visible: true },
        //filterPanel: { visible: true },
        headerFilter: { visible: true },
        //grouping: { autoExpandAll: false },
        searchPanel: { visible: true },
        //groupPanel: { visible: true },
        editing: {
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            allowInserting: true,
            useIcons: true
            // mode: "popup",
            // popup: {
            //     title: "StaffPermit",
            //     showTitle: true,
            //     //fullScreen:true,
            //     form: {
            //         items: [{
            //             itemType: "group",
            //             colCount: 3,
            //             colSpan: 3,
            //             items: ["StoreID",""]
            //         }
            //         ]
            //     }                             
            //},
        },
        columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        remoteOperations: true,
        columns: [
            {
                dataField: "StoreID", caption: "Store",
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
                dataField: "NGUserID", caption: "User", allowEditing: true,
                lookup: {
                    valueExpr: "id",
                    displayExpr: "FullName",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxUser",
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
                        sort: "FullName",
                        headerFilter: { allowSearch: true }
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }
                },
            },
            { 
                dataField: "StaffOffTypeID", caption: "OffType", allowEditing: true,
                lookup: {
                    valueExpr: "id",
                    displayExpr: "Name",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStaffOffTypes",
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
                        sort: "Name",
                        headerFilter: { allowSearch: true }
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }
                },
            },
            { dataField: "Days", dataType: "number", format: { type: "fixedPoint", precision: 0 } },
            { dataField: "Hours", dataType: "number", format: { type: "fixedPoint", precision: 0 } },
            { dataField: "InTime", alignment: "right", dataType: "date", width: 80, format: 'dd.MM.yyyy' },
            { dataField: "OutTime", alignment: "right", dataType: "date", width: 80, format: 'dd.MM.yyyy' }
        ],
        onInitNewRow: function(e) {
            e.data.InTime = new Date();
            e.data.OutTime = new Date();
            e.data.StoreID = $rootScope.user.StoreID;
            // e.promise = getDefaultData().done(function(data) {
            //     e.data.ID = data.ID;
            //     e.data.position = data.Position;
            // });
        },
        onRowClick: function (rowInfo) {
            rowInfo.component.editRow(rowInfo.rowIndex);
        },
        export: { enabled: true, fileName: "StaffPermits", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("staffpermittsCtrl");
    });
};