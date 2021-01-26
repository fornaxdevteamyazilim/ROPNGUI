app.controller('accounttransactiongroupCtrl', accounttransactiongroupCtrl);
function accounttransactiongroupCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("accounttransactiongroupCtrl");
    var atg = this;
    $scope.translate = function () {
        $scope.trName = $translate.instant('main.NAME');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.item = {};
    atg.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        name: 'asc'
        }
    },
 {
     getData: function ($defer, params) {
         Restangular.all('AccountTransactionGroup').getList({
             pageNo: params.page(),
             pageSize: params.count(),
             sort: params.orderBy(),
         }).then(function (items) {
             params.total(items.paging.totalRecordCount);
             $defer.resolve(items);
             $scope.DriverVehicle = items;
         }, function (response) {
             toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
         });
     }
 });
    $scope.saveData = function (data) {
        if (data.restangularized) {
            data.put().then(function (res) {
                atg.tableParams.reload();
                toaster.pop('success', $translate.instant('difinitions.Updated'), $translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'AccountTransactionGroup')
            data.post().then(function (res) {
                atg.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Saved'), $translate.instant('difinitions.Saved'));
            });
            data.get();
        }
    }
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
        if (!atg.tableParams.data[atg.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(atg.tableParams.data.length - 1, 1);
            toaster.pop('warning',  $translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Editcancelled'));
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
                if (atg.tableParams.data[index].fromServer) {
                    atg.tableParams.data[index].remove();
                }
                atg.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (atg.tableParams.data[index].fromServer) {
            atg.tableParams.data[index].remove();
        }
        atg.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        atg.tableParams.data.push({});
    };


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
    var deregistrwatch1 = $scope.$watch(angular.bind(atg, function () {
        return atg.search;
    }), function (value) {
        atg.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistrwatch1();
        $element.remove();
        $rootScope.uService.ExitController("accounttransactiongroupCtrl");
    });
};