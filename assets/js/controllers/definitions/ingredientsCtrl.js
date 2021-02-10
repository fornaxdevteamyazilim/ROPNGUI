app.controller('ingredientsCtrl', ingredientsCtrl);
function ingredientsCtrl($scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $location, $translate, $element) {
    $rootScope.uService.EnterController("ingredientsCtrl");
    var ing = this;
    $scope.objectType = 'ingredient';
    $scope.translate = function () {
        $scope.trGlobalInventory = $translate.instant('main.GLOBALINVENTORY');
        $scope.trIngredientGlobalInventory = $translate.instant('main.INGREDIENTGLOBALINVENTORY');
        $scope.trAmount = $translate.instant('main.AMOUNT');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.saveData = function (data) {
        if (data.restangularized) {
            data.put().then(function (res) { ing.tableParams.reload(); toaster.pop('success', $translate.instant('difinitions.Updated'), $translate.instant('difinitions.Updated')); });
        }
        else {
            Restangular.restangularizeElement('', data, $scope.objectType)
            data.post().then(function (res) { ing.tableParams.reload(); toaster.pop('success',$translate.instant('difinitions.Saved'), $translate.instant('difinitions.Saved')); });
            data.get();
        }
    }
    $scope.FormKeyPress = function (event, rowform, data, index) {
        if (event.keyCode === 13 && rowform.$visible) {
            _update(rowform.$data, data);
            $scope.saveData(data);
            rowform.$cancel();
            return data;
        }
        if (event.keyCode === 27 && rowform.$visible) {
            $scope.cancelForm(rowform);
        }
        if (event.keyCode === 119) {
            $location.path('/app/orders/orderlist');
        }
    };
    $scope.GetGlobalInventory = function (data) {
        $scope.GlobalInventoryID = data.GlobalInventoryID;
    };
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!ing.tableParams.data[ing.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ing.tableParams.data.length - 1, 1);
            toaster.pop('warning',$translate.instant('difinitions.Cancelled'),  $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning',$translate.instant('difinitions.Cancelled'),  $translate.instant('difinitions.Editcancelled'));
        }
    };
    ing.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    },
    {
        getData: function ($defer, params) {
            Restangular.all($scope.objectType).getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: " GlobalInventoryID = '" + $scope.GlobalInventoryID + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response);
            });
        }
    });

    $scope.saveItem = function (data) {
        _update(data, this.item);
        $scope.saveData(this.item);
        return this.item;
    }
    function _update(srcObj, destObj) {
        for (var key in srcObj) {
            if (destObj.hasOwnProperty(key) && srcObj.hasOwnProperty(key)) {
                destObj[key] = (srcObj[key] != undefined) ? srcObj[key] : '';
            }
            if (!destObj.hasOwnProperty(key) && srcObj.hasOwnProperty(key)) {
                destObj[key] = (srcObj[key] != undefined) ? srcObj[key] : '';
            }
        }
    }
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: $translate.instant('difinitions.Sure') ,
            text:  $translate.instant('difinitions.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:   $translate.instant('difinitions.confirmButtonText'),
            cancelButtonText:  $translate.instant('difinitions.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (ing.tableParams.data[index].fromServer) {
                    ing.tableParams.data[index].remove();
                }
                ing.tableParams.data.splice(index, 1);
                toaster.pop("error",$translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (ing.tableParams.data[index].fromServer) {
            ing.tableParams.data[index].remove();
        }
        ing.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        ing.tableParams.data.push({});
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
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.globalinventories = [];
    $scope.loadEntities('globalinventory', 'globalinventories');
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
        $element.remove();
        $rootScope.uService.ExitController("ingredientsCtrl");
    });
};
