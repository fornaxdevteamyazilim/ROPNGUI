app.controller('inventorytransferrCtrl', inventorytransferrCtrl);
function inventorytransferrCtrl($rootScope, $scope, NG_SETTING, $translate, $element, localStorageService) {
    $rootScope.uService.EnterController("inventorytransferrCtrl");
    var ngurr = this;
    $scope.NGUserRoleID = '';

    $scope.translate = function () {
        $scope.trDate = $translate.instant('main.DATE');
        $scope.trDocumentNumber = $translate.instant('main.DOCUMENTNUMBER');
        $scope.trFromRepository = $translate.instant('main.FROMREPOSITORY');
        $scope.trToRepository = $translate.instant('main.TOREPOSITORY');
        $scope.trDescription = $translate.instant('main.DESCRIPTION');
        $scope.trNote = $translate.instant('main.NOTE');
        $scope.trInventorySupplyState = $translate.instant('main.INVENTORYSUPPLYSTATE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.selectstore = $translate.instant('main.SELECTSTORE');
        $scope.startdate = $translate.instant('main.STARTDATE');
        $scope.enddate = $translate.instant('main.ENDDATE');
        $scope.showtransfer = $translate.instant('main.SHOWTRANSFER');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.dataGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/inventorytransfer",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/inventorytransfer",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/inventorytransfer",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/inventorytransfer",
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
            //allowAdding: true,
            allowUpdating: true,
            //allowDeleting: true,
            //allowInserting: true
            useIcons: true
        },
        columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        remoteOperations: true,
        columns: [
            { dataField: "DocumentNumber", dataType: "string" },
            { dataField: "TransferDate", alignment: "right", dataType: "date", width: 80, format: 'dd.MM.yyyy' },
         
            { dataField: "InventorySupplyState", allowEditing: false },
            { dataField: "Description", allowEditing: false },
            
           
        ],
        export: { enabled: true, fileName: "transferlist", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("inventorytransferrCtrl");
    });
};