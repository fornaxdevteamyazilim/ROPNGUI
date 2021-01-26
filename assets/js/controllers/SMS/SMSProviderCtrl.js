app.controller('SMSProviderCtrl', SMSProviderCtrl);
function SMSProviderCtrl($rootScope, $scope, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("SMSProviderCtrl");
    var smsp = this;
    $scope.translate = function () {
        $scope.trUserName = $translate.instant('main.USERNAME');
        $scope.trUserPassword = $translate.instant('main.USERPASSWORD');
        $scope.trOriginator = $translate.instant('main.ORIGINATOR');
        $scope.trLimit = $translate.instant('main.LIMIT');
        $scope.trChannelName = $translate.instant('main.CHANELNAME');
        $scope.trisDefault= $translate.instant('main.ISDEFAULT');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.translate();
    $scope.item = {};
    smsp.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
 {
     getData: function ($defer, params) {
         Restangular.all('SMSProvider').getList({
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
                smsp.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'SMSProvider')
            data.post().then(function (res) {
                smsp.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
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
        if (!smsp.tableParams.data[smsp.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(smsp.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
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
                if (smsp.tableParams.data[index].fromServer) {
                    smsp.tableParams.data[index].remove();
                }
                smsp.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (smsp.tableParams.data[index].fromServer) {
            smsp.tableParams.data[index].remove();
        }
        smsp.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        smsp.tableParams.data.push({});
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("SMSProviderCtrl");
    });
};
