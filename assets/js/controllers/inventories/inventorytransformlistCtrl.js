'use strict';
app.controller('inventorytransformlistCtrl', inventorytransformlistCtrl);
function inventorytransformlistCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $rootScope, $location, $translate, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("inventorytransformlistCtrl");
    var itr = this;
    $scope.item = {};
    $scope.objectType = 'inventorytransform';
    $scope.SelectedItem = null;
    itr.search = '';
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/inventory/inventorytransform/edit/' + $scope.SelectedItem;
    };
        if (!$rootScope.ReportParameters.StartDate && !$rootScope.ReportParameters.EndDate) {
        $rootScope.ReportParameters.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
        $rootScope.ReportParameters.EndDate = moment().add(1, 'days').format('YYYY-MM-DD');
    }
    $scope.translate = function () {
        $scope.trInventoryRecipe = $translate.instant('main.RECIPE');
        $scope.trRepository = $translate.instant('main.REPOSITORY');
        $scope.trOutputFactor = $translate.instant('main.OUTPUTFACTOR');
        $scope.trDescription = $translate.instant('main.DESCRIPTION');
        $scope.trTransformDate = $translate.instant('main.TRANSFORMDATE');
        $scope.trNote = $translate.instant('main.NOTE');
        $scope.trDateTime = $translate.instant('main.DATETIME');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.searchbyrecipename = $translate.instant('main.SEARCHBYRECIPENAME');
        $scope.addnewtransform = $translate.instant('main.ADDNEWTRANSFORM');
        $scope.edit = $translate.instant('main.EDIT');
        $scope.delete = $translate.instant('main.DELETE');
        $scope.tag = $translate.instant('main.TAG');
        $scope.selectstore = $translate.instant('main.SELECTSTORE');
        $scope.startdate = $translate.instant('main.STARTDATE');
        $scope.enddate = $translate.instant('main.ENDDATE');
        $scope.showtransforms = $translate.instant('main.SHOWTRANSFORMS');

    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
        $scope.BuildSearchString = function (src) {
        var result = [];
        if ($rootScope.ReportParameters.StartDate && $rootScope.ReportParameters.EndDate && $scope.StoreID) {
            result.push("TransformDate between'" + $rootScope.ReportParameters.StartDate + "'and'" + $rootScope.ReportParameters.EndDate + "'");
            result.push(($scope.StoreID) ? "Repository.StoreID='" + $scope.StoreID + "'" : "Repository.StoreID='" + $rootScope.user.StoreID + "'");
        }
        else if ($rootScope.ReportParameters.StartDate && $rootScope.ReportParameters.EndDate && !$scope.StoreID) {
            result.push("TransformDate between'" + $rootScope.ReportParameters.StartDate + "'and'" + $rootScope.ReportParameters.EndDate + "'");
            result.push("Repository.StoreID='" + $rootScope.user.StoreID + "'");
        }
        return result;
    };
    itr.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    },{
        getData: function ($defer, params) {
            if ($scope.StoreID || $rootScope.user.StoreID && $rootScope.ReportParameters.StartDate && $rootScope.ReportParameters.EndDate) {
                $scope.isWaiting = true;
            Restangular.all($scope.objectType).getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: $scope.BuildSearchString(),
                sort: '-TransformDate',
            }).then(function (items) {
                $scope.isWaiting = false;
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                $scope.isWaiting = false;
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
            }

        }
    });
    $scope.ChangeStore = function (StoreID) {
        $scope.StoreID = StoreID;
    };
    $scope.repositories = [];
    $scope.loadrepository = function () {
        if (!$scope.repositories.length) {
            Restangular.all('repository').getList({
                pageNo: 1,
                pageSize: 1000,
                //search: "StoreID='" + $rootScope.user.StoreID + "'"
            }).then(function (result) {
                $scope.repositories = result;
                if (result && result.length > 0) {
                    $scope.RepositoryID = result[0].id;
                }
            }, function (response) {
                toaster.pop('error',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadrepository();
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
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.inventories = [];
    $scope.loadEntitiesCache('cache/inventory', 'inventories');
    $scope.inventoryunits = [];
    $scope.loadEntitiesCache('cache/inventoryunit', 'inventoryunits');
    $scope.inventoryrecipes = [];
    $scope.loadEntities('inventoryrecipe', 'inventoryrecipes');

    $scope.LoadTransforms = function () {
        itr.tableParams.reload();
    };
    $scope.saveData = function (data) {
        if (data.restangularized) {
            data.put().then(function (res) { itr.tableParams.reload(); toaster.pop('success', $translate.instant('invantories.Updated'),$translate.instant('invantories.Updated')); });
        }
        else {
            Restangular.restangularizeElement('', data, $scope.objectType)
            data.post().then(function (res) { itr.tableParams.reload(); toaster.pop('success', $translate.instant('difinitions.Saved'), $translate.instant('difinitions.Saved')); });
            data.get();
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
        if (!itr.tableParams.data[itr.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(itr.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
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
                if (itr.tableParams.data[index].fromServer) {
                    itr.tableParams.data[index].remove();
                }
                itr.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'),$translate.instant('invantories.RecordDeleted'));
            }
        });
        itr.tableParams.reload();
    };
    $scope.cancelremove = function (index) {
        if (id.tableParams.data[index].fromServer) {
            id.tableParams.data[index].remove();
        }
        id.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        if (!$scope.item.TransformDate) {
            $scope.item.TransformDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
        }
        itr.tableParams.data.push({ RepositoryID: $scope.RepositoryID, TransformDate: $scope.item.TransformDate });
    };

    $scope.SelectStartDate = function (item) {
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
            var data = new Date(item);
            $rootScope.ReportParameters.StartDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.SelectEndDate = function (item) {
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
            var data = new Date(item);
            $rootScope.ReportParameters.EndDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };


    var deregistration1 = $scope.$watch(angular.bind(itr, function () {
        return itr.search;
    }), function (value) {
        itr.tableParams.reload();
    });
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
        }, function () {
        });
    };
    $scope.saveItem = function (data) {
        _update(data, this.item);
        $scope.saveData(this.item);
        return this.item;
    };
    function _update(srcObj, destObj) {
        for (var key in srcObj) {
            if (destObj.hasOwnProperty(key) && srcObj.hasOwnProperty(key)) {
                destObj[key] = (srcObj[key] != undefined) ? srcObj[key] : '';
            }
            if (!destObj.hasOwnProperty(key) && srcObj.hasOwnProperty(key)) {
                destObj[key] = (srcObj[key] != undefined) ? srcObj[key] : '';
            }
        }
    };
    $scope.datepopuptransformdate = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.TransformDate;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.TransformDate = result;
        })
    };
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("inventorytransformlistCtrl");
    });
};