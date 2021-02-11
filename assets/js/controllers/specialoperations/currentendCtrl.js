'use strict';
app.controller('currentendCtrl', currentendCtrl);
function currentendCtrl($scope, $log, $modal, Restangular, SweetAlert, ngTableParams, toaster, $window, $location, $translate, $modalInstance, $rootScope, userService) {
    $rootScope.uService.EnterController("currentendCtrl");
    $scope.Amount = {};
    $scope.Description = {};
    $scope.Person = {};
    $scope.SaveAccountPayments = function (data, PersonID) {
        Restangular.all('store/accountpayment').post(
            {
                StoreID: $rootScope.user.StoreID,
                PersonID: $scope.PersonID,
                PaymentTypeID: data.PaymentTypeID,
                Amount: data.Amount,
                Description: data.Description
            }
        ).then(function (result) {
            toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
            $scope.ok();
            location.href = '#/app/mainscreen'
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    }
    $scope.selectPerson = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/order/selectPerson.html',
            controller: 'selectPersonCtrl',
            size: '',
            backdrop: '',
            resolve: {
                searchname: function () {
                    return item;
                },
                searchphone: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            $scope.Person.name = item.name;
            $scope.PersonID = item.id;
            $scope.loadCurrents(item.id);

        });
    }
    $scope.loadCurrents = function (data) {
        Restangular.all('personaccount').getList({
            pageNo: 1,
            pageSize: 1000,
            sort: 'id',
            search: "PersonID='" + data + "'"
        }).then(function (result) {
            $scope.current = result;
        }, function (response) {
            toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };

    $scope.storepaymenttypes = [];
    $scope.loadStorePaymentTypes = function () {
        if (!$scope.storepaymenttypes.length) {
            Restangular.all('paymenttype').getList({
                pageNo: 1,
                pageSize: 1000,
                sort: 'id',
            }).then(function (result) {
                $scope.storepaymenttypes = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadStorePaymentTypes();
    $scope.ok = function () {
        $modalInstance.close('ok');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("currentendCtrl");
    });
};
app.controller('selectPersonCtrl', selectPersonCtrl);
function selectPersonCtrl($rootScope, $scope, $modalInstance, $translate, Restangular, ngTableParams, $filter, searchname, searchphone, $log, $window) {
    $rootScope.uService.EnterController("selectPersonCtrl");
    $scope.SelectedItem = null;
    $scope.ShowDetail = false;
    $scope.searchName = (searchname) ? searchname : '';
    $scope.searchPhone = (searchphone) ? searchphone : '';
    $scope.SlectedItem = {};
    $scope.SelectItem = function () {
        $scope.person = $scope.SlectedItem;
        $scope.ok();
    };
    $scope.GetSearchString = function () {
        var SearchFilter = ($scope.searchName && $scope.searchName.length > 0) ? "name  like '" + $scope.searchName + "%'" + "and CurrentStatus<>0 " : "";
        if ($scope.searchPhone && $scope.searchPhone.length > 0) {
            SearchFilter = SearchFilter + ((SearchFilter.length > 0) ? " and " : "");
            SearchFilter = SearchFilter + "Number  like '%" + $scope.searchPhone + "%'" + "and CurrentStatus<>0 "
        }
        return SearchFilter;
    }
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10
    },
        {
            counts: [],
            getData: function ($defer, params) {
                if ($scope.searchName == '' && $scope.searchPhone == '') {
                    $defer.resolve(null);
                    return;
                }
                Restangular.all('person').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    search: $scope.GetSearchString(),
                    sort: params.orderBy()
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $scope.SelectedItem = items.length > 0 ? items[0].id : null;
                    $defer.resolve(items);
                    $scope.isSearching(false);
                }, function (response) {
                    toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }

        });
    $scope.isSearching = function (value) {
        $scope.isSearch = value;
    };
    $scope.FormKeyPress = function (event) {
        if (event.keyCode === 13) {
            $scope.isSearching(true);
            $scope.tableParams.reload();
        }
    };
    $scope.ShowArray = function (emails, prop) {
        var result = _.pluck(emails, prop);
        return result.toString();
    };
    $scope.loadCurrents = function (data) {
        if (data) {
            $scope.SlectedItem = data;
            Restangular.all('personaccount').getList({
                pageNo: 1,
                pageSize: 1000,
                sort: 'id',
                search: "PersonID='" + data.id + "'"
            }).then(function (result) {
                $scope.personcurrent = result[0];
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.ok = function () {
        $modalInstance.close($scope.person);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("selectPersonCtrl");
    });
};
app.filter('roundup', function () {
    return function (value) {
        return Math.ceil(value);
    };
})