app.controller('hnrproductCtrl', hnrproductCtrl);
function hnrproductCtrl($rootScope, $scope, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("hnrproductCtrl");
    var hnrp = this;
    $scope.translate = function () {
        $scope.trProduct = $translate.instant('main.PRODUCT');
        $scope.trName = $translate.instant('main.NAME');
        $scope.trPrice = $translate.instant('main.PRICE');
        $scope.trPrecent1 = $translate.instant('main.PERCENT1');
        $scope.trPrecent2 = $translate.instant('main.PERCENT2');
        $scope.trCalctype = $translate.instant('main.CALCTYPE');
        $scope.trHnrgroup = $translate.instant('main.HNRGROUP');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.translate();
    $scope.item = {};
    hnrp.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
 {
     getData: function ($defer, params) {
         Restangular.all('hnrproduct').getList({
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
                hnrp.tableParams.reload();
                toaster.pop('success', $translate.instant('difinitions.Updated'), $translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'hnrproduct')
            data.post().then(function (res) {
                hnrp.tableParams.reload();
                toaster.pop('success', $translate.instant('difinitions.Saved'), $translate.instant('difinitions.Saved'));
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
        if (!hnrp.tableParams.data[hnrp.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(hnrp.tableParams.data.length - 1, 1);
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
                if (hnrp.tableParams.data[index].fromServer) {
                    hnrp.tableParams.data[index].remove();
                }
                hnrp.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (hnrp.tableParams.data[index].fromServer) {
            hnrp.tableParams.data[index].remove();
        }
        hnrp.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        hnrp.tableParams.data.push({});
    };
    var deregistration1 = $scope.$watch(angular.bind(hnrp, function () {
        return hnrp.search;
    }), function (value) {
        hnrp.tableParams.reload();
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
    $scope.products = [];
    $scope.loadEntities('product', 'products');
    $scope.hnrgroups = [];
    $scope.loadEntities('hnrgroup', 'hnrgroups');
    $scope.clactype = [{ id: 0, value: 'Tüm Gün' }, { id: 1, value: '12-14 / 18-20' }];
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("hnrproductCtrl");
    });
};
