app.controller('complaintsubjectsCtrl', complaintsubjectsCtrl);
function complaintsubjectsCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("complaintsubjectsCtrl");
    var cs = this;
    $scope.Values = [{
        name: {
            text: 'Evet'
        }, item: {
            text: 'Hayır'
        }
    }];
    $scope.translate = function () {
        $scope.trComplaintName = $translate.instant('main.COMPLAINTNAME');
        $scope.trTip = $translate.instant('main.TIP');
        $scope.trAuditStore = $translate.instant('main.AUDITSTORE');
        $scope.trOwertime = $translate.instant('main.OWERTIME');
        $scope.trCommands = $translate.instant('main.COMMANDS');

    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.item = {};
    cs.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        name:'asc'
        }
    },
 {
     getData: function ($defer, params) {
         Restangular.all('complaintsubject').getList({
             pageNo: params.page(),
             pageSize: params.count(),
             sort: params.orderBy(),
             search: (cs.search) ? "name like '%" + cs.search + "%'" : ""
         }).then(function (items) {
             params.total(items.paging.totalRecordCount);
             $defer.resolve(items);
         }, function (response) {
             toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
         });
     }
 });
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                cs.tableParams.reload();
                toaster.pop('success', $translate.instant('difinitions.Updated'),$translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'complaintsubject')
            data.post().then(function (res) {
                cs.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Saved'),$translate.instant('difinitions.Saved'));
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
        if (!cs.tableParams.data[cs.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(cs.tableParams.data.length - 1, 1);
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
            cancelButtonText:  $translate.instant('difinitions.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (cs.tableParams.data[index].fromServer) {
                    cs.tableParams.data[index].remove();
                }
                cs.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (cs.tableParams.data[index].fromServer) {
            cs.tableParams.data[index].remove();
        }
        cs.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        cs.tableParams.data.push({});
    };

    var deregistration1 = $scope.$watch(angular.bind(cs, function () {
        return cs.search;
    }), function (value) {
        cs.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("complaintsubjectsCtrl");
    });
};
