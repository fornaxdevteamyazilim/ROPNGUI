app.controller('complaintreactionsCtrl', complaintreactionsCtrl);
function complaintreactionsCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("complaintreactionsCtrl");
    var cr = this;
    $scope.translate = function () {
        $scope.trComplaintReactionsName = $translate.instant('main.COMPLAINTREACTIONNAME');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.translate();
    $scope.item = {};
    cr.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        name:'asc'
        }
    },
 {
     getData: function ($defer, params) {
         Restangular.all('complaintreaction').getList({
             pageNo: params.page(),
             pageSize: params.count(),
             sort: params.orderBy(),
             search: (cr.search) ? "name like '%" + cr.search + "%'" : ""
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
                cr.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Updated'), $translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'complaintreaction')
            data.post().then(function (res) {
                cr.tableParams.reload();
                toaster.pop('success',  $translate.instant('difinitions.Saved'), $translate.instant('difinitions.Saved'));
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
        if (!cr.tableParams.data[cr.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(cr.tableParams.data.length - 1, 1);
            toaster.pop('warning',$translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning',$translate.instant('difinitions.Cancelled'),$translate.instant('difinitions.Editcancelled'));
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
                if (cr.tableParams.data[index].fromServer) {
                    cr.tableParams.data[index].remove();
                }
                cr.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (cr.tableParams.data[index].fromServer) {
            cr.tableParams.data[index].remove();
        }
        cr.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        cr.tableParams.data.push({});
    };
    var deregistration1 = $scope.$watch(angular.bind(cr, function () {
        return cr.search;
    }), function (value) {
        cr.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("complaintreactionsCtrl");
    });
};
