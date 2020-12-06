app.controller('storesaletypesCtrl', storesaletypesCtrl);
function storesaletypesCtrl($scope, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element) {
    $rootScope.uService.EnterController("storesaletypesCtrl");
    var sst = this;
    if ($rootScope.user && $rootScope.user.StoreID) {
        $scope.ShowStore = false;
    } else {
       $scope.ShowStore=true;
    }
    $scope.translate = function () {
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trOrderSource = $translate.instant('main.ORDERSOURCE');
        $scope.trOrderType = $translate.instant('main.ORDERTYPE');
        $scope.trStart = $translate.instant('main.STARTDATE');
        $scope.trEnd = $translate.instant('main.ENDDATE');
        $scope.trOpen = $translate.instant('main.CLOSE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.translate();
    $scope.item = {};
    sst.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
 {
     getData: function ($defer, params) {
         Restangular.all('StoreSaleType').getList({
             pageNo: params.page(),
             pageSize: params.count(),
             search: ($rootScope.user.StoreID) ? "StoreID='" + $rootScope.user.StoreID + "'":"",
         }).then(function (items) {
             params.total(items.paging.totalRecordCount);
             $defer.resolve(items);
         }, function (response) {
             toaster.pop('warning', $translate.instant('Server.ServerError'), response);
         });
     }
 });
    $scope.saveData = function (data) {
        if ($rootScope.user && $rootScope.user.StoreID) {
            data.StoreID = $rootScope.user.StoreID;
        }
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                sst.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'StoreSaleType')
            data.post().then(function (res) {
                sst.tableParams.reload();
                toaster.pop('success',$translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
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
        if (!sst.tableParams.data[sst.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(sst.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('orderfile.Sure') ,
            text:  $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:  $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText:  $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (sst.tableParams.data[index].fromServer) {
                    sst.tableParams.data[index].remove();
                }
                sst.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (sst.tableParams.data[index].fromServer) {
            sst.tableParams.data[index].remove();
        }
        sst.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        sst.tableParams.data.push({});
    };
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
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.ordersours = [];
    $scope.loadEntities('ordersource', 'ordersours');
    $scope.ordertypes = [];
    $scope.loadEntities('enums/ordertype', 'ordertypes');
    $scope.startdate = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.Start;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.Start = result;
        })
    };
    $scope.enddate = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.End;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.End = result;
        })
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("storesaletypesCtrl");
    });
};