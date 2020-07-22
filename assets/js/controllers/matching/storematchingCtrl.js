'use strict';
app.controller('storematchingCtrl', storematchingCtrl);
function storematchingCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("storematchingCtrl");
    var sm = this;
    sm.search = '';
    $scope.translate = function () {
        $scope.trNgStore = $translate.instant('main.NGSTORE');
        $scope.trPdsStore = $translate.instant('main.PDSSTORE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    })
    $scope.translate();
    $scope.item = {};
    sm.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
 {
     getData: function ($defer, params) {
         Restangular.all('externalobjectmap').getList({//todo  controller name
             pageNo: params.page(),
             pageSize: params.count(),
             sort: params.orderBy(),
             search: "ExternalObjectName='Store'",
         }).then(function (items) {
             params.total(items.paging.totalRecordCount);
             $defer.resolve(items);
         }, function (response) {
             toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
         });
     }
 });
    $scope.saveData = function (data) {
        data.ExternalSystem='pds';
        data.ExternalObjectName='Store';
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                sm.tableParams.reload();
                toaster.pop('success', "Updated.", 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'externalobjectmap')
            data.post().then(function (res) {
                sm.tableParams.reload();
                toaster.pop('success', "Saved.", 'Saved.');
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
        if (!sm.tableParams.data[sm.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(sm.tableParams.data.length - 1, 1);
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
                if (sm.tableParams.data[index].fromServer) {
                    sm.tableParams.data[index].remove();
                }
                sm.tableParams.data.splice(index, 1);
                toaster.pop("error", "Attention !", "Record Deleted !");
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (sm.tableParams.data[index].fromServer) {
            sm.tableParams.data[index].remove();
        }
        sm.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        sm.tableParams.data.push({});
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
                toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', "Server Error", response);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.pdsstores = [];
    $scope.loadEntities('pds/store', 'pdsstores');
    var deregistration1 = $scope.$watch(angular.bind(sm, function () {
        return sm.search;
    }), function (value) {
        sm.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("storematchingCtrl");
    });
};

