'use strict';
app.controller('orderinvoicelistCtrl', orderinvoicelistCtrl);
function orderinvoicelistCtrl($scope, $log, $filter, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $location, $translate, $interval, userService, $element) {
    $rootScope.uService.EnterController("orderinvoicelistCtrl");
    var oil = this;
    userService.userAuthorizated();
    $scope.objectType = 'orderinvoice';
    $scope.SelectedItem = null;
    oil.search = '';
    $scope.translate = function () {
        $scope.trid = $translate.instant('main.ORDERINVOICEID');
        $scope.trResultMessage = $translate.instant('main.RESULTMESSAGE');
        $scope.trDocReferance = $translate.instant('main.DOCREFERANCE');
        $scope.trDocumentState = $translate.instant('main.DOCUMENTSTATE');
        $scope.trFileName = $translate.instant('main.FILENAME');
        $scope.trAddress = $translate.instant('main.ADDRESS');
        $scope.trTitle = $translate.instant('main.TITLE');
        $scope.trPhoneNumber = $translate.instant('main.PHONENUMBER');
        $scope.trTaxNumber = $translate.instant('main.TAXNUMBER');
        $scope.trTaxOffice = $translate.instant('main.TAXOFFICE');
        $scope.trOrderID = $translate.instant('main.ORDERID');
        $scope.trEmail = $translate.instant('main.EMAIL');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    //$scope.SelectItem = function (id) {
    //    $scope.SelectedItem = id;
    //    if ($rootScope.user && $rootScope.user.UserRole) {
    //        if ($rootScope.user.restrictions.storeedit == 'Enable') {
    //            location.href = '#/app/store/store/edit/' + $scope.SelectedItem;
    //        } else {
    //            toaster.pop('warning', "Unauthorized Access Request.");
    //        }
    //    }
    //};
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!oil.tableParams.data[oil.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(oil.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled') );
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled') );
        }
    };
    //$scope.BuildSearchString = function () {
    //    var result = [];
    //    if ($rootScope.user && $rootScope.user.UserRole && $rootScope.user.UserRole.Name == "MemberAdmin" || $rootScope.user.UserRole.Name == "LC" || $rootScope.user.UserRole.Name == "LCAyar" || $rootScope.user.UserRole.Name == "CCMANAGER") {
    //        if (oil.search) {
    //            result.push("name like '%" + oil.search + "%'");
    //        }
    //    } else {
    //        if ($rootScope.user.StoreID) {
    //            result.push("tt.id in ('" + $rootScope.user.StoreID + "')");
    //        }
    //    }
    //    return result;
    //};
    $scope.BuildSearchString = function () {
        var result = [];
        if (oil.search) {
            result.push("id like '%" + oil.search + "%'");
        }
        return result;
    };
    oil.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            //name: 'asc'
        }
    }, {
            getData: function ($defer, params) {
                Restangular.all($scope.objectType).getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    search: $scope.BuildSearchString(),
                    sort: params.orderBy()
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('error', $translate.instant('Server.ServerError'), response);
                    SweetAlert.swal($translate.instant('Server.ServerError'), angular.toJson(response, false), "error");
                });
            }
        });
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.filters = [];
    $scope.loadEntities('filter', 'filters');

    $scope.cancelremove = function (index) {
        if (oil.tableParams.data[index].fromServer) {
            oil.tableParams.data[index].remove();
        }
        oil.tableParams.data.splice(index, 1);
    };
    var deregistration1 = $scope.$watch(angular.bind(oil, function () {
        return oil.search;
    }), function (value) {
        oil.tableParams.reload();
    });
    $scope.open = function (ObjectID) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tags/ObjectTagEditModalContent.html',
            controller: 'TagModalCtrl',
            size: '',
            backdrop: '',
            resolve: {
                ObjectID: function () {
                    return ObjectID;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.result = selectedItem;
        });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("orderinvoicelistCtrl");
    });
};
