app.controller('addnewaddressCtrl', addnewaddressCtrl);
function addnewaddressCtrl($rootScope, $translate, $scope, $modalInstance, $filter, item, $modal, $log, $window, Restangular, SweetAlert, toaster, NG_SETTING) {
    $rootScope.uService.EnterController("addnewaddressCtrl");
    $scope.item = {};
    $scope.item.ysaddress = item.ysaddress;
    $scope.item.name = item.name;
    $scope.item.number = item.PersonPhones[0].Number;
    $scope.item.ysstore = item.ysstore;
    $scope.item.Landmark = item.ysaddress;
    $scope.item.ysaddress = item.ysaddress + '[' + item.ysstore + ']';
    $scope.item.Region = item.Region;
    $scope.item.City = item.City;
    $scope.StreetAddressSelector = function (StreetAddressID) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/streetaddress/StreetAddressSelector.html',
            controller: 'StreetAddressSelectorCtrl',
            size: '',
            backdrop: '',
            resolve: {
                StreetAddressID: function () {
                    return StreetAddressID;
                }
                ,
                InfoNotes: function () {
                    return item.ysaddress;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.item.streetAddress = { StreetAddress: selectedItem.name + "/" + selectedItem.Quarter, StreetAddressID: selectedItem.id };
        });
    };
    $scope.SaveData = function () {
        if ($scope.item.streetAddress) {
            var data = $scope.item;
            data.StreetAddressID = $scope.item.streetAddress.StreetAddressID;
            data.StreetAddress = $scope.item.streetAddress.StreetAddress;
            Restangular.restangularizeElement('', data, 'address_streetaddress');
            if (data.streetAddress.restangularized && data.id) {
                data.put().then(function (resp) {
                    $scope.SaveDeliveryAddress(resp.id, item.id);
                });
            }
            else {
                Restangular.restangularizeElement('', data, 'address_streetaddress');
                data.post().then(function (resp) {
                    $scope.SaveDeliveryAddress(resp.id, item.id);

                });
            }
        }
        else {
            toaster.pop('warning',  $translate.instant('yemeksepetifile.Selectaddress '));
        }
    };
    $scope.SaveDeliveryAddress = function (AID, personID) {
        var personAddress = {};
        personAddress.PersonID = personID;
        personAddress.AddressID = AID;
        Restangular.restangularizeElement('', personAddress, 'person_deliveryaddress');
        if (personAddress.restangularized && personAddress.id) {
            personAddress.put().then(function (resp) {
                toaster.pop('success', $translate.instant('yemeksepetifile.Updated') , $translate.instant('yemeksepetifile.Updated'));
                $scope.ok();
            });
        }
        else {
            personAddress.post().then(function (resp) {
                toaster.pop('success', $translate.instant('yemeksepetifile.Saved') , $translate.instant('yemeksepetifile.Updated'));
                $scope.ok();
            });
        }
    };
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length || $scope[Container].length == 0) {
            Restangular.all(EntityType).getList().then(function (result) {
                angular.copy(result.plain(), $scope[Container]);
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.addresstypes = [];
    $scope.loadEntities('enums/addresstype', 'addresstypes');
    $scope.gendertypes = [];
    $scope.loadEntities('enums/gendertype', 'gendertypes');
    $scope.ok = function () {
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("addnewaddressCtrl");
    });
    //var gDataSource = {
    //    remoteOperations: true,
    //    store: DevExpress.data.AspNet.createStore({
    //        key: "unid",
    //        loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxServiceArea",
    //    }),
    //    //filter: getFilter(),
    //    //fields: [
    //    //    { caption: "Category", dataField: "ProductCategory", width: 250, expanded: true, sortBySummaryField: "SalesAmount", sortBySummaryPath: [], sortOrder: "desc", area: "row" },
    //    //    { caption: "Product", dataField: "name", area: "row", sortBySummaryField: "SalesAmount", sortBySummaryPath: [], sortOrder: "desc", width: 250 },
    //    //    { caption: "Parent", dataField: "ParentName", area: "row", sortBySummaryField: "SalesAmount", sortBySummaryPath: [], sortOrder: "desc", width: 250 },
    //    //    //{ caption: "Date", dataField: "OperationDate", dataType: "date", area: "column" },
    //    //    { dataField: "Year", dataType: "number", area: "column" },
    //    //    { dataField: "MonthNumber", dataType: "number", area: "column" },
    //    //    { dataField: "Day", dataType: "number", area: "column" },
    //    //    { caption: "Quantity", dataField: "Quantity", summaryType: "sum", area: "data" },
    //    //    { caption: "Amount", dataField: "Amount", summaryType: "sum", format: "fixedPoint", area: "data" },
    //    //    { caption: "Store", dataField: "Store" }
    //    //]
    //};
    //$scope.gridBoxOptions = {
    //    bindingOptions: {
    //        value: "gridBoxValue"
    //    },
    //    valueExpr: "ID",
    //    deferRendering: false,
    //    placeholder: "Select a value...",
    //    displayExpr: function (item) {
    //        return item && item.name + " <" + item.QuarterName + ">";
    //    },
    //    onValueChanged: function (e) {
    //        $scope.gridSelectedRowKeys = e.value || [];
    //    },
    //    showClearButton: true,
    //    dataSource: gDataSource,
    //    dataGrid: {
    //        dataSource: gDataSource,
    //        columns: ["name", "QuarterName", "Subcity","Town"],
    //        hoverStateEnabled: true,
    //        paging: { enabled: true, pageSize: 10 },
    //        filterRow: { visible: true },
    //        scrolling: { mode: "infinite" },
    //        selection: { mode: "single" },
    //        height: "100%",
    //        bindingOptions: {
    //            "selectedRowKeys": "gridSelectedRowKeys"
    //        },
    //        onSelectionChanged: function (selectedItems) {
    //            var keys = selectedItems.selectedRowKeys;
    //            $scope.gridBoxValue = keys.length && keys[0] || null;
    //        }
    //    }
    //};
};
