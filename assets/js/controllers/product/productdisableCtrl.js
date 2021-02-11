'use strict';
app.controller('productdisableCtrl', productdisableCtrl);
function productdisableCtrl($rootScope, $scope, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $("#search").focus();
    $rootScope.uService.EnterController("productdisableCtrl");
    var pd = this;
    $scope.translate = function () {
        $scope.trProduct = $translate.instant('main.PRODUCT');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trOrderType = $translate.instant('main.ORDERTYPE');
        $scope.trStart = $translate.instant('main.STARTHOUR');
        $scope.trisActive = $translate.instant('main.ISACTIVE');
        $scope.trEnd = $translate.instant('main.ENDHOUR');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    })
    $scope.translate();
    $scope.item = {};
    pd.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
 {
     getData: function ($defer, params) {
         Restangular.all('productdisable').getList({ //todo  controller name
             pageNo: params.page(),
             pageSize: params.count(),
             sort: params.orderBy(),
         }).then(function (items) {
             params.total(items.paging.totalRecordCount);
             $defer.resolve(items);
         }, function (response) {
             toaster.pop('warning', $translate.instant('Server.ServerError'), response);
         });
     }
 });
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                pd.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'productdisable')
            data.post().then(function (res) {
                pd.tableParams.reload();
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
        if (!pd.tableParams.data[pd.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pd.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled') );
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled') );
        }
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('orderfile.Sure') ,
            text:  $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:    $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText:   $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (pd.tableParams.data[index].fromServer) {
                    pd.tableParams.data[index].remove();
                }
                pd.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (pd.tableParams.data[index].fromServer) {
            pd.tableParams.data[index].remove();
        }
        pd.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        pd.tableParams.data.push({});
    };
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || null;
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 10000,
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
    $scope.products = [];
    $scope.loadEntities('product', 'products');
    $scope.ordertypes = [];
    $scope.loadEntities('enums/ordertype', 'ordertypes');

    $scope.DatePopupStoreRoutingStart = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/stores/storeroutedate.html',
            controller: 'StoreRoutingDateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.Start
                }
            }
        });
        modalInstance.result.then(function (result) {
            //$scope.isVisibleDeliverDate = true;
            item.Start = result;
        })
    };

    $scope.DatePopupStoreRoutingEnd = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/stores/storeroutedate.html',
            controller: 'StoreRoutingDateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.End
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
        $rootScope.uService.ExitController("productdisableCtrl");
    });
};
app.controller('StoreRoutingDateCtrl', StoreRoutingDateCtrl);
function StoreRoutingDateCtrl($rootScope, $scope,$translate, $modalInstance, $filter, DateTime, $log, toaster, $window, ngnotifyService) {
    $rootScope.uService.EnterController("StoreRoutingDateCtrl");
    $scope.DateTime = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss');
    $scope.Time = ngnotifyService.ServerTime(DateTime);
    $scope.hstep = 1;
    $scope.mstep = 3;
    $scope.ismeridian = true;
    $scope.toggleMode = function () {
        $scope.ismeridian = !$scope.ismeridian;
    };
    $scope.today = function () {
        $scope.DateTime = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss');
    };
    $scope.clear = function () {
        $scope.DateTime = null;
    };
    $scope.ok = function (data) {
        var now = ngnotifyService.ServerTime();
        $modalInstance.close($scope.Date = $filter('date')(data, 'yyyy-MM-dd HH:mm:ss'));
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("productdisableCtrl");
    });
};