app.controller('periodCtrl', periodCtrl);
function periodCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("periodCtrl");
    var prd = this;
    $scope.translate = function () {
        $scope.trPeriodName = $translate.instant('main.PERIODNAME');
        $scope.trInitialCount = $translate.instant('main.INITIALCOUNT');
        $scope.trFinalCount = $translate.instant('main.FINALCOUNT');
        $scope.trPeriodState = $translate.instant('main.PERIODSTATE');
        $scope.trStartDate = $translate.instant('main.STARTDATE');
        $scope.trEndDate = $translate.instant('main.ENDDATE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.item = {};
    prd.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            EndDate: 'desc'
        }
    },
 {
     getData: function ($defer, params) {
         Restangular.all('period').getList({
             pageNo: params.page(),
             pageSize: params.count(),
             sort: params.orderBy(),
             search: (prd.search) ? "name like '%" + prd.search + "%'" : ""
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
        if (data.restangularized) {
            data.put().then(function (res) {
                prd.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Updated'), $translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'period')
            data.post().then(function (res) {
                prd.tableParams.reload();
                toaster.pop('success', $translate.instant('difinitions.Saved'), $translate.instant('difinitions.Saved'));
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
        if (!prd.tableParams.data[prd.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(prd.tableParams.data.length - 1, 1);
            toaster.pop('warning',$translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning',$translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Editcancelled'));
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
                if (prd.tableParams.data[index].fromServer) {
                    prd.tableParams.data[index].remove();
                }
                prd.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (prd.tableParams.data[index].fromServer) {
            prd.tableParams.data[index].remove();
        }
        prd.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        prd.tableParams.data.push({});
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
    $scope.periodstates = [];
    $scope.loadEntities('enums/periodstate', 'periodstates');
    $scope.datepopupStartDate = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.StartDate;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.StartDate = result;
        })
    };
    $scope.datepopupEndDate = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.EndDate;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.EndDate = result;
        })
    };
    var deregistration1 = $scope.$watch(angular.bind(prd, function () {
        return prd.search;
    }), function (value) {
        prd.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("periodCtrl");
    });
};