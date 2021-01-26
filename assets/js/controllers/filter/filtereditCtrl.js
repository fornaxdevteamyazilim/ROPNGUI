app.controller('filtereditCtrl', filtereditCtrl);
function filtereditCtrl($rootScope, $scope, $log, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("filtereditCtrl");
    var ici = this;
    $scope.translate = function () {
        $scope.trSchedule = $translate.instant('main.SCHEDULE');
        $scope.trFilterOperation = $translate.instant('main.FILTEROPERATION');
        $scope.trFilterCommand = $translate.instant('main.FILTERCOMMAND');
        $scope.trFilterParameter = $translate.instant('main.FILTERPARAMETER');
        $scope.trFilterCondition = $translate.instant('main.FILTERCONDITION');
        $scope.trFilterValue = $translate.instant('main.FILTERVALUE');
        $scope.trActive = $translate.instant('main.ACTIVE');
        $scope.trRow = $translate.instant('main.ROW');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.item = { FilterObjectID: null };
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.FilterID = null;
    if ($stateParams.id != 'new') {
        $scope.FilterID = $stateParams.id;
        Restangular.one('filter', $stateParams.id).get().then(function (restresult) {
            $scope.original = restresult;
            $scope.item = Restangular.copy(restresult);
        })
    }
    else {
        $scope.item = { FilterObjectID: null };
    }
    $scope.SaveData = function () {
        $scope.item.items = ici.tableParams.data;
        if ($scope.item.restangularized && $scope.item.id) {
            $scope.item.put().then(function (resp) {
                swal($translate.instant('orderfile.Updated'),$translate.instant('difinitions.Updated'), "success");
                $location.path('app/filter/filter/list');
            });
        }
        else {
            Restangular.restangularizeElement('', $scope.item, 'filter')
            $scope.item.post().then(function (resp) {
                $scope.item.id = resp.id;
                swal($translate.instant('difinitions.Saved'), $translate.instant('difinitions.Updated'), "success");
                $location.path('app/filter/filter/list');
            });
        }
    }
    $scope.saveItem = function (data) {
        $scope.savetoaster();
    }
    $scope.savetoaster = function () {
        toaster.pop('success',$translate.instant('difinitions.Saved'),$translate.instant('difinitions.Saved'));
    }
    $scope.isClean = function () {
        return angular.equals($scope.original, $scope.item);
    }
    ici.search = '';
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
        if (!ici.tableParams.data[ici.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ici.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    ici.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            OrderNumber: 'asc'
        }
    },
    {
        getData: function ($defer, params) {
            Restangular.all('filteritem').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "FilterID='" + $scope.FilterID + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length || $scope[Container].length == 0) {
            Restangular.all(EntityType).getList().then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadEntities2 = function (EntityType, Container) {
        if (!$scope[Container].length || $scope[Container].length == 0) {
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
    $scope.filterlevels = [];
    $scope.loadEntities('enums/FilterLevel', 'filterlevels');
    $scope.filtertypes = [];
    $scope.loadEntities('enums/filtertype', 'filtertypes');
    $scope.filteritemoperations = [];
    $scope.loadEntities('enums/filteritemoperation', 'filteritemoperations');
    $scope.filterobjects = [];
    $scope.loadEntities('enums/filterobject', 'filterobjects');
    $scope.filterconditions = [];
    $scope.loadEntities('enums/filtercondition', 'filterconditions');
    $scope.schedules = [];
    $scope.loadEntities2('schedule', 'schedules');
    $scope.filtercommands = [];
    $scope.removedata = function (SelectItem) {
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
                $scope.item.remove().then(function () {
                    $location.path('app/filter/filter/list');
                });
            }
        });
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
                if (ici.tableParams.data[index].fromServer) {
                    ici.tableParams.data[index].remove();
                }
                ici.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };
    var deregistration1 = $scope.$watch(angular.bind($scope, function () {
        return $scope.item.FilterObjectID;
    }), function (value) {
        $scope.filtercommands = [];
        if (value != 'new' && value != null) {
            $scope.loadEntities('enums/FilterCommands/' + value, 'filtercommands');
        }
    });
    $scope.cancelremove = function (index) {
        if (ici.tableParams.data[index].fromServer) {
            ici.tableParams.data[index].remove();
        }
        ici.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        ici.tableParams.data.push({ FilterID: $scope.FilterID });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("filtereditCtrl");
    });
};
