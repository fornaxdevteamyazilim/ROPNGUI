app.controller('surveyresultsCtrl', surveyresultsCtrl);
function surveyresultsCtrl($rootScope, $scope, Restangular, ngTableParams, toaster, $location, $translate, $element, SweetAlert) {
    $rootScope.uService.EnterController("surveyresultsCtrl");
    var sr = this;
    $scope.truefalsearray = [{ Value: true, Name: 'True' }, { Value: false, Name: 'False' }];
    $scope.translate = function () {
        $scope.trDescription = $translate.instant('main.DESCRIPTION');
        $scope.trCallAgain  = $translate.instant('main.CALLAGAIN');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trisReached = $translate.instant('main.ISREACHED');
        $scope.trUpdateMarketingPermissions = $translate.instant('main.UPDATEMARKETTINGPERMISIONS');
        $scope.trIndex = $translate.instant('main.INDEX');
        $scope.trCommands = $translate.instant('main.COMMANDS');

    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                sr.tableParams.reload();
                toaster.pop('success', $translate.instant('difinitions.Updated'),  $translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'surveyresult')
            this.item.post().then(function (res) {
                sr.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Saved'),  $translate.instant('difinitions.Saved'));
            });
            this.item.get();
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
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    sr.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            Descrition : 'asc'
        }
    }, {
            getData: function ($defer, params) {
                Restangular.all('surveyresult').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: (sr.search) ? "Name like '%" + sr.search + "%'" : ""
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
                if (sr.tableParams.data[index].fromServer) {
                    sr.tableParams.data[index].remove();
                }
                sr.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
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
    var deregistration1 = $scope.$watch(angular.bind(sr, function () {
        return sr.search;
    }), function (value) {
        sr.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("surveyresultsCtrl");
    });
};
