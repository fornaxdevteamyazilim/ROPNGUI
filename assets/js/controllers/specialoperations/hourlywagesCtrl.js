app.controller('hourlywagesCtrl', hourlywagesCtrl);
function hourlywagesCtrl($rootScope, $scope, NG_SETTING, $translate, $element, localStorageService) {
    $rootScope.uService.EnterController("hourlywagesCtrl");
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
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStaffPositionHourlyWedges",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStaffPositionHourlyWedges",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStaffPositionHourlyWedges",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStaffPositionHourlyWedges",
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
                dataField: "StaffPositionID", caption: "Position",
                visibleIndex: 0,
                sortIndex:1, 
                sortOrder:"asc",
                //groupIndex: 0,
                setCellValue: function (rowData, value) {
                    rowData.StaffPositionID = value;
                    rowData.NGUserID = null;
                },
                lookup: {
                    valueExpr: "id",
                    displayExpr: function(item) {
                        // "item" can be null
                        return item && item.OrderIndex + '-' + item.Name;
                    },
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStaffPositions",
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
                        sort: "OrderIndex",
                        headerFilter: { allowSearch: true }
                    }
                    
                },
                calculateSortValue: function (data) {
                    var value = this.calculateCellValue(data);
                    return this.lookup.calculateCellValue(value);
                }
            },
            { dataField: "ValidFrom", alignment: "right", dataType: "date", format: 'dd.MM.yyyy',sortIndex:0, 
            sortOrder:"asc" },
            { dataField: "Price", alignment: "right", dataType: "money" }
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
        export: { enabled: true, fileName: "hourlywages", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("hourlywagesCtrl");
    });
};