﻿app.controller('nguserroleCtrl', nguserroleCtrl);
function nguserroleCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element) {
    $rootScope.uService.EnterController("nguserroleCtrl");
    var ngur = this;
    $scope.translate = function () {
        $scope.trName = $translate.instant('main.NAME');
        $scope.trMember = $translate.instant('main.MEMBER');
        $scope.trOrderSource = $translate.instant('main.ORDERSOURCE');
        $scope.trIPFilterEnabled = $translate.instant('main.IPFILTERENABLED');
        $scope.trDetectStoreByIP = $translate.instant('main.DETECTSTOREBYIP');
        $scope.trShiftControl = $translate.instant('main.SHIFTCONTROL');
        $scope.trIsAdmin = $translate.instant('main.ISADMIN');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trUserCardLogin = $translate.instant('main.USERCARDLOGIN');
        $scope.trPasswordLogin = $translate.instant('main.PASSWORDLOGIN');
        $scope.trisDriverRole = $translate.instant('main.ISDRIVERROLE');
        $scope.trEmployeeMeal = $translate.instant('main.EMPLOYEEMEAL');

    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                ngur.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Updated'), $translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'nguserrole')
            data.post().then(function (res) {
                ngur.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Saved'),$translate.instant('difinitions.Saved'));
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
        if (!ngur.tableParams.data[ngur.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ngur.tableParams.data.length - 1, 1);
            toaster.pop('warning',$translate.instant('difinitions.Cancelled'),$translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning',$translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    ngur.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            Name:'asc'
        }
    },
    {
        getData: function ($defer, params) {
            Restangular.all('nguserrole').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "MemberID = '" + $rootScope.user.UserRole.MemberID + "'" && (ngur.search) ? "name like '%" + ngur.search + "%'" : ""
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    }); 
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
                if (ngur.tableParams.data[index].fromServer) {
                    ngur.tableParams.data[index].remove();
                    $scope.$emit('DeleteUserRoles', "ReloadUserRoles");
                }
                ngur.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };
    $scope.addItem = function () {
        ngur.tableParams.data.push({});
    };
    $scope.cancelremove = function (index) {
        if (ngur.tableParams.data[index].fromServer) {
            ngur.tableParams.data[index].remove();
        }
        ngur.tableParams.data.splice(index, 1);
    };
    var deregistration1 = $scope.$watch(angular.bind(ngur, function () {
        return ngur.search;
    }), function (value) {
        ngur.tableParams.reload();
    });
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
    $scope.ordersources = [];
    $scope.loadEntities('ordersource', 'ordersources');
    $scope.members = [];
    $scope.loadEntities('member', 'members');
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("nguserroleCtrl");
    });
};
