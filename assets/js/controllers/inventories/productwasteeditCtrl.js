app.controller('productwasteeditCtrl', productwasteeditCtrl);
function productwasteeditCtrl($scope, $filter, SweetAlert, Restangular, ngTableParams, $modal, toaster, $window, $stateParams, $rootScope, $location, $translate, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("productwasteeditCtrl");
    var pwe = this;
    userService.userAuthorizated();
    $scope.item = {};
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.translate = function () {
        $scope.trProduct = $translate.instant('main.PRODUCT');
        $scope.trProductCount = $translate.instant('main.PRODUCTCOUNT');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.back = $translate.instant('main.BACK');
        $scope.date = $translate.instant('main.DATE');
        $scope.repository = $translate.instant('main.REPOSITORY');
        $scope.ordertype = $translate.instant('main.ORDERTYPE');
        $scope.ordersource = $translate.instant('main.ORDERSOURCE');
        $scope.note = $translate.instant('main.NOTE');
        $scope.delete = $translate.instant('main.DELETE');
        $scope.save = $translate.instant('main.SAVE');
        $scope.addproductwasteitem = $translate.instant('main.ADDPRODUCTWASTEITEM');
        $scope.edit = $translate.instant('main.EDIT');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.ProductWasteID = $stateParams.id;
    if ($stateParams.id != 'new') {
        Restangular.one('productwaste', $stateParams.id).
            get().then(function (restresult) {
                $scope.original = restresult;
                $scope.item = Restangular.copy(restresult);
            })
    } else {
        $scope.item = {};
    }
    $scope.SaveData = function () {
        if ($scope.item.restangularized && $scope.item.id) {
            $scope.item.put().then(function (resp) {
                swal($translate.instant('difinitions.Updated'), $translate.instant('difinitions.Updated'), "success");
                $location.path('app/inventory/productwaste/list');
                if ($stateParams.id == 'new') {
                    $scope.ProductWasteID = $stateParams.id = resp.id;
                }
            },
            function (response) {
                $scope.isWaiting = false;
                toaster.pop('error',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
        else {
            Restangular.restangularizeElement('', $scope.item, 'productwaste')
            $scope.item.post().then(function (resp) {
                $scope.item.id = resp.id;
                if ($stateParams.id == 'new') {
                    $scope.ProductWasteID = $stateParams.id = resp.id;
                }
                swal( $translate.instant('difinitions.Saved'),$translate.instant('invantories.SuccessfullySaved') , "success");
            },
            function (response) {
                $scope.isWaiting = false;
                toaster.pop('error',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.removedata = function (SelectItem) {
        SweetAlert.swal({
            title:  $translate.instant('invantories.Sure') ,
            text:  $translate.instant('invantories.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:    $translate.instant('invantories.confirmButtonText'),
            cancelButtonText:   $translate.instant('invantories.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                $scope.item.remove().then(function () {
                    SweetAlert.swal($translate.instant('invantories.Deleted'),  $translate.instant('invantories.RecordDeleted'), "success");
                    $location.path('/app/inventory/productwaste/list');
                });
            } else {
                SweetAlert.swal($translate.instant('invantories.Cancelled'), $translate.instant('invantories.DeletionCanceled'), "error");
            }
        });
    };
    $scope.datepopup = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            $scope.item.OperationDate = item;
        })
    };
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container, filter) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
                search: filter,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.ordersources = [];
    $scope.loadEntities('ordersource', 'ordersources');
    $scope.ordertypes = [];
    $scope.loadEntities('enums/ordertype', 'ordertypes');
    $scope.repositories = [];
    $scope.loadrepository = function () {
        if (!$scope.repositories.length) {
            Restangular.all('repository').getList({
                pageNo: 1,
                pageSize: 1000,
                sort: 'id',
                //search: "StoreID='" + $rootScope.user.StoreID + "'"
            }).then(function (result) {
                $scope.repositories = result;
                $scope.item.RepositoryID = result[0].id;
            }, function (response) {
                toaster.pop('error',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadrepository();
    $scope.ordersources = [];
    $scope.loadordersources = function () {
        if (!$scope.ordersources.length) {
            Restangular.all('ordersource').getList({
                pageNo: 1,
                pageSize: 1000,
                sort: 'id',
            }).then(function (result) {
                $scope.ordersources = result;
                if ($stateParams.id == 'new') {
                    $scope.item.OrderSourceID = result[1].id;
                }
            }, function (response) {
                toaster.pop('error',$translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.loadordersources();
    if (!$scope.item.OperationDate) {
        $scope.item.OperationDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    }
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("productwasteeditCtrl");
    });
};
app.controller('productwasteitemCtrl', productwasteitemCtrl);
function productwasteitemCtrl($rootScope, $scope, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window,$translate, $stateParams, $location, $element) {
    $rootScope.uService.EnterController("productwasteitemCtrl");
    var pwi = this;
    $scope.item = {};
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };

    $scope.loadEntities = function (EntityType, Container, filter) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 100000,
                search: filter,
            }).then(function (result) {
                $scope[Container] = result;
                pwi.tableParams.reload();
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.products = [];
    $scope.loadEntities('product', 'products');
    pwi.tableParams = new ngTableParams({
        page: 1,
        count: 100
    }, {
        getData: function ($defer, params) {
            if ($scope.ProductWasteID == 'new' && $stateParams.id == 'new') {
                $scope.ProductWasteID = 0;
            }
            Restangular.all('productwasteitem').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "ProductWasteID='" + $scope.ProductWasteID + "'",
            }).then(function (items) {
                for (var i = 0; i < items.length; i++) {
                    items[i].Product = $scope.ShowObject('products', 'id', items[i].ProductID, 'name');
                }
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.saveData = function (data, rowform) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                rowform.$data.Product = $scope.ShowObject('products', 'id', data.ProductID, 'name');
                data.Product = rowform.$data.Product;
                toaster.pop('success',$translate.instant('invantories.Updated') ,$translate.instant('invantories.Updatedapplied') );
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'productwasteitem')
            data.post().then(function (res) {
                rowform.$data.Product = $scope.ShowObject('products', 'id', data.ProductID, 'name');
                data.Product = rowform.$data.Product;
                toaster.pop('success', $translate.instant('invantories.Saved') ,$translate.instant('invantories.Savedserver') );
            });
        }
    };
    $scope.FormKeyPress = function (event, rowform, data, index) {
        if (event.keyCode === 13 && rowform.$visible) {
            rowform.$submit();
            $scope.addItem();
        }
        if (event.keyCode === 27 && rowform.$visible) {
            $scope.cancelForm(rowform);
        }
    };
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!pwi.tableParams.data[pwi.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pwi.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('invantories.Cancelled'),$translate.instant('difinitions.Insertcancelled') );
        } else {
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Editcancelled') );
        }
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('invantories.Sure') ,
            text:  $translate.instant('invantories.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:  $translate.instant('invantories.confirmButtonText'),
            cancelButtonText:  $translate.instant('invantories.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (pwi.tableParams.data[index].fromServer) {
                    pwi.tableParams.data[index].remove();
                }
                pwi.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'),$translate.instant('invantories.RecordDeleted'));
            }
        });
       // pwi.tableParams.reload();
    };
    $scope.cancelremove = function (index) {
        if (pwi.tableParams.data[index].fromServer) {
            pwi.tableParams.data[index].remove();
        }
        pwi.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        pwi.tableParams.data.push({ ProductWasteID: $stateParams.id });
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("productwasteitemCtrl");
    });
};