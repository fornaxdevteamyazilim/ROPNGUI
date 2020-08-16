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
} ]);
app.controller('storesalestargetCtrl', storesalestargetCtrl);
function storesalestargetCtrl($rootScope, $scope, NG_SETTING, $translate, $element,localStorageService,$http) {
    $rootScope.uService.EnterController("storesalestargetCtrl");
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
            url: NG_SETTING.apiServiceBaseUri + "/api/tools/UploadStoreSalesTargets",  
            data: JSON.stringify(data),  
            headers: {  
                'Content-Type': 'application/json'  
            }    
        }).then(function (data) {  
            if (data.status) {  
                $scope.msg = "Data has been inserted ! ";  
                $scope.LoadData();
            }  
            else {  
                $scope.msg = "Error : Something Wrong";  
            }  
        }, function (error) {  
            $scope.msg = "Error : Something Wrong";  
        })  
      }  
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
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxstoresalestarget",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxstoresalestarget",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxstoresalestarget",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxstoresalestarget",
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
            { dataField: "id", caption: "ID", allowEditing: false ,visible:false }, 
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
            }  , 
            { dataField: "Year",caption: "Year", allowEditing: true },  
             { dataField: "Month",caption: "Month", allowEditing: true },  
             { dataField: "Amount",caption: "Amount", allowEditing: true },  
             { dataField: "TC",caption: "TC", allowEditing: true },  
             { dataField: "AC",caption: "AC", allowEditing: true },
             { dataField: "SalesInStore",caption: "SalesInStore", allowEditing: true },  
             { dataField: "TCInStore",caption: "TCInStore", allowEditing: true },  
             { dataField: "SalesTakeAway",caption: "SalesTakeAway", allowEditing: true },
             { dataField: "TCTakeAway",caption: "TCTakeAway", allowEditing: true },  
             { dataField: "SalesDelivery",caption: "SalesDelivery", allowEditing: true },  
             { dataField: "TCDelivery",caption: "TCDelivery", allowEditing: true },  

                       
        ],
        export: { enabled: true, fileName: "storesalestargetlist"},
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("storesalestargetCtrl");
    });
};