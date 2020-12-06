app.controller('yemeksepetisettingsCtrl', yemeksepetisettingsCtrl);
function yemeksepetisettingsCtrl($rootScope, $scope, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("yemeksepetisettingsCtrl");
    var yss = this;
    $scope.translate = function () {
        $scope.trMember = $translate.instant('main.MEMBER');
        $scope.trServiceAddress = $translate.instant('main.SERVICEADDRESS');
        $scope.trServiceUser = $translate.instant('main.SERVICEUSER');
        $scope.trServicePassword = $translate.instant('main.SERVICEPASSWORD');
        $scope.trSendOkMessage = $translate.instant('main.SENDOKMESSAGE');
        $scope.trisActive = $translate.instant('main.ISACTIVE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trMultipliyer = $translate.instant('main.MULTIPLAYER');
        $scope.trOrderSourceName = $translate.instant('main.ORDERSOURCENAME');
        

    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.translate();
    $scope.item = {};
    yss.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    }, {
        getData: function ($defer, params) {
            Restangular.all('yemeksepetisetting').getList({
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
                yss.tableParams.reload();
                toaster.pop('success', $translate.instant('yemeksepetifile.Updated'),  $translate.instant('yemeksepetifile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'yemeksepetisetting')
            data.post().then(function (res) {
                yss.tableParams.reload();
                toaster.pop('success', $translate.instant('yemeksepetifile.Saved'),  $translate.instant('yemeksepetifile.Saved'));
            });
            data.get();
        }
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
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.members = [];
    $scope.loadEntities('member', 'members');
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
        if (!yss.tableParams.data[yss.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(yss.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('yemeksepetifile.Cancelled'), $translate.instant('yemeksepetifile.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('yemeksepetifile.Cancelled'), $translate.instant('yemeksepetifile.Editcancelled'));
        }
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('orderfile.Sure') ,
            text:  $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:    $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText:   $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (yss.tableParams.data[index].fromServer) {
                    yss.tableParams.data[index].remove();
                }
                yss.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('yemeksepetifile.Attention'),$translate.instant('yemeksepetifile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (yss.tableParams.data[index].fromServer) {
            yss.tableParams.data[index].remove();
        }
        yss.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        yss.tableParams.data.push({});
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("yemeksepetisettingsCtrl");
    });
};
