﻿app.controller('ordersourceCtrl', ordersourceCtrl);
function ordersourceCtrl($rootScope, $scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $translate, $element) {
    $rootScope.uService.EnterController("ordersourceCtrl");
    var os = this;
    $scope.translate = function () {
        $scope.trName = $translate.instant('main.NAME');
        $scope.trDepartment = $translate.instant('main.DEPARTMENT');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trAuthorizeOrders = $translate.instant('main.AUTHORIZEORDERS');
        $scope.trOrderNumberPrefix = $translate.instant('main.ORDERNUMBERPREFIX');


    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.item = {};
    os.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            name:'asc'
        }
    },
 {
     getData: function ($defer, params) {
         Restangular.all('ordersource').getList({
             pageNo: params.page(),
             pageSize: params.count(),
             sort: params.orderBy(),
             search: (os.search) ? "name like '%" + os.search + "%'" : ""
         }).then(function (items) {
             params.total(items.paging.totalRecordCount);
             $defer.resolve(items);
         }, function (response) {
             toaster.pop('warning', "Server Error ", response.data.ExceptionMessage);
         });
     }
 });
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                os.tableParams.reload();
                toaster.pop('success', "Updated.", 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'ordersource')
            data.post().then(function (res) {
                os.tableParams.reload();
                toaster.pop('success', "Saved.", 'Saved.');
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
        if (!os.tableParams.data[os.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(os.tableParams.data.length - 1, 1);
            toaster.pop('warning', "It is cancelled !", 'Insert cancelled !');
        } else {
            toaster.pop('warning', "It is cancelled !", 'Edit cancelled !');
        }
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: "ARE YOU SURE ?",
            text: "Are you sure you want to delete the record ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Delete !",
            cancelButtonText: "No, Deletion !",
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (os.tableParams.data[index].fromServer) {
                    os.tableParams.data[index].remove();
                }
                os.tableParams.data.splice(index, 1);
                toaster.pop("error", "Attention !", "Record Deleted !");
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (os.tableParams.data[index].fromServer) {
            os.tableParams.data[index].remove();
        }
        os.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        os.tableParams.data.push({});
    };
    var deregistration1 = $scope.$watch(angular.bind(os, function () {
        return os.search;
    }), function (value) {
        os.tableParams.reload();
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
                toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
            });
        }
    };
    $scope.departments = [];
    $scope.loadEntities('department', 'departments');
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("ordersourceCtrl");
    });
};
