app.controller('productionpointsCtrl', productionpointsCtrl);
function productionpointsCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element) {
    $rootScope.uService.EnterController("productionpointsCtrl");
    var pp = this;
    $scope.translate = function () {
        $scope.trProductionPointName = $translate.instant('main.PRODUCTIONPOINTNAME');
        $scope.trMember = $translate.instant('main.MEMBER');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });

    $scope.item = {};
    pp.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            name: 'asc'
        }
    },
 {
     getData: function ($defer, params) {
         Restangular.all('productionpoint').getList({
             pageNo: params.page(),
             pageSize: params.count(),
             sort: params.orderBy(),
             search: (pp.search) ? "name like '%" + pp.search + "%'" : ""
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
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                pp.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Updated'), $translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'productionpoint')
            data.post().then(function (res) {
                pp.tableParams.reload();
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
        if (!pp.tableParams.data[pp.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pp.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
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
                if (pp.tableParams.data[index].fromServer) {
                    pp.tableParams.data[index].remove();
                }
                pp.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (pp.tableParams.data[index].fromServer) {
            pp.tableParams.data[index].remove();
        }
        pp.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        pp.tableParams.data.push({ MemberID: $rootScope.user.UserRole.MemberID });
    };
    var deregistration1 = $scope.$watch(angular.bind(pp, function () {
        return pp.search;
    }), function (value) {
        pp.tableParams.reload();
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
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.members = [];
    $scope.loadEntities('member', 'members');
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("productionpointsCtrl");
    });
};