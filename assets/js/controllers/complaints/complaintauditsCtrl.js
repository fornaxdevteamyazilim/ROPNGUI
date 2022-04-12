app.controller('complaintauditsCtrl', complaintauditsCtrl);
function complaintauditsCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, callsService, userService, $element) {
    $rootScope.uService.EnterController("complaintauditsCtrl");
    var ca = this;
    $scope.CallReason = function (type) {
            if (userService.userIsInRole("CALLCENTER" || userService.userIsInRole("CCBACKOFFICE"))) {
                Restangular.all('callreason').getList({
                    pageNo: 1,
                    pageSize: 1000,
                    search: "CallReasonType='" + type + "'"
                }).then(function (result) {
                    callsService.SetCurrentCallType(result[0].id);
                });
            }
    };
    $scope.translate = function () {
        $scope.trComplaintSubject = $translate.instant('main.COMPLAINTSUBJECT');
        $scope.trNgUser = $translate.instant('main.NGUSER');
        $scope.trOnOpen = $translate.instant('main.ONOPEN');
        $scope.trOnClose = $translate.instant('main.ONCLOSE');
        $scope.trStillOpenHours = $translate.instant('main.STILLOPENHOURS');
        $scope.trDailyCount = $translate.instant('main.DAILYCOUNT');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.translate();
    $scope.item = {};
    ca.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    }, {
        getData: function ($defer, params) {
            Restangular.all('complaintaudit').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                $scope.CallReason(4);
                ca.tableParams.reload();
                toaster.pop('success', $translate.instant('accounting.Updated'), $translate.instant('accounting.Updated'));
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'complaintaudit')
            data.post().then(function (res) {
                $scope.CallReason(4);
                ca.tableParams.reload();
                toaster.pop('success',$translate.instant('accounting.Saved'), $translate.instant('accounting.Saved'));
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
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
        if (!ca.tableParams.data[ca.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ca.tableParams.data.length - 1, 1);
            toaster.pop('warning',  $translate.instant('accounting.Cancelled'), $translate.instant('callmonitor.Insertcancelled'));
        } else {
            toaster.pop('warning',  $translate.instant('accounting.Cancelled'), $translate.instant('callmonitor.Editcancelled'));
        }
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('accounting.Sure') ,
            text:  $translate.instant('accounting.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:    $translate.instant('accounting.confirmButtonText'),
            cancelButtonText:   $translate.instant('accounting.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (ca.tableParams.data[index].fromServer) {
                    ca.tableParams.data[index].remove();
                }
                ca.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('accounting.Attention'),$translate.instant('accounting.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (ca.tableParams.data[index].fromServer) {
            ca.tableParams.data[index].remove();
        }
        ca.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        ca.tableParams.data.push({});
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
                pageSize: 100000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', "Error!", response.data.ExceptionMessage);
            });
        }
    };
    $scope.complaintsubjects = [];
    $scope.loadEntities('complaintsubject', 'complaintsubjects');
    $scope.ngusers = [];
    $scope.loadEntities('cache/users', 'ngusers');
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("complaintauditsCtrl");
    });
};
