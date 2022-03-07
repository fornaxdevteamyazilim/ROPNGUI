app.directive('ngFiles', ['$parse', function ($parse) {

    function fn_link(scope, element, attrs) {
        var onChange = $parse(attrs.ngFiles);
        element.on('change', function (event) {
            onChange(scope, { $files: event.target.files });
        });
    };

    return {
        link: fn_link
    }
}]);
app.controller('indeximportCtrl', indeximportCtrl);
function indeximportCtrl($rootScope, $scope, NG_SETTING, $translate, $element, localStorageService, $http, Restangular, toaster) {
    $rootScope.uService.EnterController("indeximportCtrl");
    var ngurr = this;

    $scope.selectedFile = null;
    $scope.msg = "";

    $scope.getTheFiles = function ($files) {
        $scope.selectedFile = $files[0];
        // angular.forEach($files, function (value, key) {
        //     formdata.append(key, value);
        // });
    };
    $scope.handleFile = function () {
        var file = $scope.selectedFile;
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                var workbook = XLSX.read(data, { type: 'binary' });
                var first_sheet_name = workbook.SheetNames[0];
                var dataObjects = XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name]);
                //console.log(excelData);    
                if (dataObjects.length > 0) {
                    $scope.save(dataObjects);
                } else {
                    $scope.msg = "Error : Something Wrong !";
                }
            }
            reader.onerror = function (ex) {
            }
            reader.readAsBinaryString(file);
        }
    }
    $scope.save = function (data) {
        $http({
            method: "POST",
            url: NG_SETTING.apiServiceBaseUri + "/api/tools/UploadStreetAddressImportData",
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (data) {
            if (data.status) {
                toaster.pop('success', "Data has been inserted ! ");
                $scope.msg = "Data has been inserted ! ";
                $scope.LoadData();
            }
            else {
                $scope.msg = "Error : Something Wrong";
                toaster.pop('warning', "Error : Something Wrong");
            }
        }, function (error) {
            $scope.msg = "Error : Something Wrong";
            toaster.pop('warning', "Error : Something Wrong");
        })
    }
    $scope.ClearData = function () {
        Restangular.one('/tools/ClearAddressData').get().then(function (restresult) {
            toaster.pop('success', 'Data Cleared');
            $scope.LoadData();
        }, function (response) {
            toaster.pop('warning', "warning...", response.data.ExceptionMessage);
        });
    };
    $scope.ImportData = function () {
        Restangular.one('/tools/ImportAddressData').get().then(function (restresult) {
            toaster.pop('success', 'Address Data Imported');
            $scope.LoadData();
        }, function (response) {
            toaster.pop('warning', "warning...", response.data.ExceptionMessage);
        });
    };
    $scope.LoadData = function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.refresh();
    };
    $scope.translate = function () {
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trYear = $translate.instant('main.YEAR');
        $scope.trMonth = $translate.instant('main.MONTH');
        $scope.trAmount = $translate.instant('main.AMOUNT');
        $scope.trTC = $translate.instant('main.TC');
        $scope.trAC = $translate.instant('main.AC');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };

    $scope.dataGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStreetAddressImportData",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStreetAddressImportData",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStreetAddressImportData",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStreetAddressImportData",
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
            { dataField: "id", caption: "ID", allowEditing: false },
            { dataField: "Store", caption: "Store" },
            { dataField: "Grid", caption: "Grid" },
            { dataField: "DeliveryTime", caption: "DeliveryTime " },
            { dataField: "Mesafe", caption: "Mesafe " },
            { dataField: "Adress", caption: "Adress " },
            { dataField: "Type", caption: "Type " },
            { dataField: "QuarterCode", caption: "QuarterCode " },
            { dataField: "PointX", caption: "PointX " },
            { dataField: "PointY", caption: "PointY " },
            { dataField: "WDT", caption: "WDT " },
            { dataField: "CSBM", caption: "CSBM " },
            { dataField: "ObjectId", caption: "ObjectId  " },
            { dataField: "Quarter", caption: "Quarter  " },
            { dataField: "SubCity", caption: "SubCity  " },
            { dataField: "Town", caption: "Town  " },


        ],
        export: { enabled: true, fileName: "indeximport" },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("indeximportCtrl");
    });
};