app.controller('logosettingsCtrl', logosettingsCtrl);
function logosettingsCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element) {
    $rootScope.uService.EnterController("logosettingsCtrl");
    var lgs = this;
    $scope.translate = function () {
        $scope.trServiceUser = $translate.instant('main.SERVICEUSER');
        $scope.trMember = $translate.instant('main.MEMBER');
        $scope.trServicePassword = $translate.instant('main.SERVICEPASSWORD');
        $scope.trEInvoiceNameFormat = $translate.instant('main.EINVOICENAMEFORMAT');
        $scope.trEArchiveNameFormat = $translate.instant('main.EARCHIVENAMEFORMAT');
        $scope.trVKN = $translate.instant('main.VKN');
        $scope.trCompanyName = $translate.instant('main.COMPANYNAME');
        $scope.trGB_IDENTITY = $translate.instant('main.GBIDENTITY');
        $scope.trTICARETSICILNO = $translate.instant('main.TICARETSICILNO');
        $scope.trMERSISNO = $translate.instant('main.MERSISNO');
        $scope.trUserUpdate = $translate.instant('main.USERUPDATE');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trCommands = $translate.instant('main.COMMANDS');

    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                lgs.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Updated'), $translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'nguserrole')
            data.post().then(function (res) {
                lgs.tableParams.reload();
                toaster.pop('success', $translate.instant('difinitions.Saved'),$translate.instant('difinitions.Saved'));
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
        if (!lgs.tableParams.data[lgs.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(lgs.tableParams.data.length - 1, 1);
            toaster.pop('warning',$translate.instant('difinitions.Cancelled'),$translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning',$translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    lgs.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            //Name: 'asc'
        }
    },
        {
            getData: function ($defer, params) {
                Restangular.all('logosetting').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    //search: "MemberID = '" + $rootScope.user.UserRole.MemberID + "'" && (lgs.search) ? "name like '%" + lgs.search + "%'" : ""
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
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
                if (lgs.tableParams.data[index].fromServer) {
                    lgs.tableParams.data[index].remove();
                    $scope.$emit('DeleteUserRoles', "ReloadUserRoles");
                }
                lgs.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };
    $scope.addItem = function () {
        lgs.tableParams.data.push({});
    };
    $scope.cancelremove = function (index) {
        if (lgs.tableParams.data[index].fromServer) {
            lgs.tableParams.data[index].remove();
        }
        lgs.tableParams.data.splice(index, 1);
    };
    var deregistration1 = $scope.$watch(angular.bind(lgs, function () {
        return lgs.search;
    }), function (value) {
        lgs.tableParams.reload();
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
    $scope.members = [];
    $scope.loadEntities('member', 'members');
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("logosettingsCtrl");
    });
};
