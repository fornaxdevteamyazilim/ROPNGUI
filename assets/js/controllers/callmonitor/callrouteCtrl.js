app.controller('callrouteCtrl', callrouteCtrl);
function callrouteCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("callrouteCtrl");
    $("#search").focus();
    var sr = this;
    $scope.translate = function () {
        $scope.trNgStore = $translate.instant('main.STORE');
        $scope.trRouteTo = $translate.instant('main.ROUTETO');
        $scope.trStopRouting = $translate.instant('main.STOPROUTING');
        $scope.trStopRouting18_21 = $translate.instant('main.STOPROUTING18_21');
        $scope.trStopRouting09_18 = $translate.instant('main.STOPROUTING09_18');
        $scope.trStopRouting18_02 = $translate.instant('main.STOPROUTING18_02');
        $scope.trCommands = $translate.instant('main.COMMANDS');

    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    })
    $scope.translate();
    $scope.item = {};
    sr.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {

        }
    },
 {
     getData: function ($defer, params) {
         Restangular.all('callroute').getList({//todo  controller name
             pageNo: params.page(),
             pageSize: params.count(),
             sort: params.orderBy(),
             search: (sr.search) ? "Stores.name like '%" + sr.search + "%'" : "",
         }).then(function (items) {
             params.total(items.paging.totalRecordCount);
             $defer.resolve(items);
         }, function (response) {
             toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
         });
     }
 });
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                sr.tableParams.reload();
                toaster.pop('success', "Güncellendi.", 'Updated.');
            }, function (response) {
                toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'callroute')
            data.post().then(function (res) {
                sr.tableParams.reload();
                toaster.pop('success', "Saved.", 'Saved.');
            }, function (response) {
                toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
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
        if (!sr.tableParams.data[sr.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(sr.tableParams.data.length - 1, 1);
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
                if (sr.tableParams.data[index].fromServer) {
                    sr.tableParams.data[index].remove();
                }
                sr.tableParams.data.splice(index, 1);
                toaster.pop("error", "Attention !", "Record Deleted !");
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (sr.tableParams.data[index].fromServer) {
            sr.tableParams.data[index].remove();
        }
        sr.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        sr.tableParams.data.push({});
    };
    $scope.$watch(angular.bind(sr, function () {
        return sr.search;
    }), function (value) {
        sr.tableParams.reload();
    });
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
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
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("callrouteCtrl");
    });
};
