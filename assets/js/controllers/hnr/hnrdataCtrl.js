app.controller('hnrdataCtrl', hnrdataCtrl);
function hnrdataCtrl($scope, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, userService, $element) {
    $rootScope.uService.EnterController("hnrdataCtrl");
    var hnrd = this;
    userService.userAuthorizated();
    $scope.HotandReady = function (ID) {
        location.href = '#/app/hnr/hotandready/' + ID;
    };
    $scope.translate = function () {
        $scope.trForDate = $translate.instant('main.DATE');
        $scope.trFactor = $translate.instant('main.FACTOR');
        $scope.trUseDataFrom = $translate.instant('main.DATE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.translate();
    $scope.item = {};
    hnrd.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
 {
     getData: function ($defer, params) {
         Restangular.all('hnrdata').getList({
             pageNo: params.page(),
             pageSize: params.count(),
             sort: params.orderBy(),
         }).then(function (items) {
             params.total(items.paging.totalRecordCount);
             $defer.resolve(items);
         }, function (response) {
             toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
         });
     }
 });
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                hnrd.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Updated'), $translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'hnrdata')
            data.post().then(function (res) {
                hnrd.tableParams.reload();
                toaster.pop('success', $translate.instant('difinitions.Saved'),  $translate.instant('difinitions.Saved'));
            });
            data.get();
        }
    };
    $scope.FormKeyPress = function (event, rowform, data, index) {
        if (event.keyCode === 13 && rowform.$visible) {
            rowform.$submit();
            return data;
        }
        if (event.keyCode === 27 && rowform.$visible) {
            $scope.cancelForm(rowform);
        }
    };
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!hnrd.tableParams.data[hnrd.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(hnrd.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'),$translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'),$translate.instant('difinitions.Editcancelled'));
        }
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('difinitions.Sure') ,
            text:  $translate.instant('difinitions.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:    $translate.instant('difinitions.confirmButtonText'),
            cancelButtonText:   $translate.instant('difinitions.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (hnrd.tableParams.data[index].fromServer) {
                    hnrd.tableParams.data[index].remove();
                }
                hnrd.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (hnrd.tableParams.data[index].fromServer) {
            hnrd.tableParams.data[index].remove();
        }
        hnrd.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        hnrd.tableParams.data.push({ StoreID: $rootScope.user.StoreID });
    };
    var deregistration1 = $scope.$watch(angular.bind(hnrd, function () {
        return hnrd.search;
    }), function (value) {
        hnrd.tableParams.reload();
    });
    $scope.SelectForDate = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.ForDate;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.ForDate = $filter('date')(result, 'yyyy-MM-dd');
        })
    };
    $scope.SelectUseDataFromDate = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.UseDataFrom;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.UseDataFrom = $filter('date')(result, 'yyyy-MM-dd');
        })
    };
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("hnrdataCtrl");
    });
};
