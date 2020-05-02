app.controller('nguserrolerestrictionCtrl', nguserrolerestrictionCtrl);
function nguserrolerestrictionCtrl($rootScope, $scope, NG_SETTING, $translate, $element) {
    $rootScope.uService.EnterController("nguserrolerestrictionCtrl");
    var ngurr = this;
    $scope.NGUserRoleID = '' ;
    
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
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxUserRoleRestriction",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxUserRoleRestriction",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxUserRoleRestriction",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxUserRoleRestriction",
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
        filterPanel: { visible: true },
        headerFilter: { visible: true },
        //grouping: { autoExpandAll: false },
        searchPanel: { visible: true },
        //groupPanel: { visible: true },
        editing: {
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            allowInserting: true
        },
        columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        remoteOperations: true,
        columns: [
            {
                dataField: "NGUserRoleID", caption: "Role",
                lookup: {
                    valueExpr: "id",
                    displayExpr: "Name",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxUserRole"
                        }),
                        sort: "Name",
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
            {
                dataField: "NGUserRestrictionID", caption: "UserRestriction",
                lookup: {
                    valueExpr: "id",
                    displayExpr: "Name",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxUserRestriction"
                        }),
                        sort: "Name"
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }  
                },
                //fixed: true,
                //groupIndex: 1
            }
        ],
        export: { enabled: true, fileName: "UserRoles", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.$on('$destroy', function () {        
        $element.remove();
        $rootScope.uService.ExitController("nguserrolerestrictionCtrl");
    });
};