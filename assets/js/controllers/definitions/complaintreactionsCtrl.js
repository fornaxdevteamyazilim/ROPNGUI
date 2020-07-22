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
             toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
         });
     }
 });
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                cr.tableParams.reload();
                toaster.pop('success', "Updated.", 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'complaintreaction')
            data.post().then(function (res) {
                cr.tableParams.reload();
                toaster.pop('success', "Saved.", 'Saved.');
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
            toaster.pop('warning', "It is cancelled !", 'Insert cancelled !');
        } else {
            toaster.pop('warning', "It is cancelled !", 'Edit cancelled !');
        }
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: "ARE YOU SURE ?",
            text: "Are you sure you want to delete the record ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Delete !",
            cancelButtonText: "No, Deletion !",
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (cr.tableParams.data[index].fromServer) {
                    cr.tableParams.data[index].remove();
                }
                cr.tableParams.data.splice(index, 1);
                toaster.pop("error", "Attention !", "Record Deleted !");
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
