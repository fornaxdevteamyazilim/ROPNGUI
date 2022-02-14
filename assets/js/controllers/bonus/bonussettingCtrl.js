app.controller('bonussettingCtrl', bonussettingCtrl);
function bonussettingCtrl($rootScope, $scope, NG_SETTING, $translate, $element,localStorageService) {
    $rootScope.uService.EnterController("bonussettingCtrl");
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
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxBonusSetting",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxBonusSetting",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxBonusSetting",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxBonusSetting",
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
        filterPanel: { visible: true },
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
        },
        columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        remoteOperations: true,
        columns: [
            { dataField: "name", caption:  $translate.instant('bonussetting.Name')  },
            { dataField: "isActive", caption:  $translate.instant('bonussetting.isActive')  },
           
            { dataField: "StartDate", caption:  $translate.instant('bonussetting.StartDate') , dataType: "datetime", format: 'dd.MM.yyyy HH:mm' },
                       
        ],
        export: { enabled: true, fileName: "bonussettinglist", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("bonussettingCtrl");
    });
};