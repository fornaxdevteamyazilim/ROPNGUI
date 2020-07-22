app.controller('complaintrelationCtrl', complaintrelationCtrl);
function complaintrelationCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("complaintrelationCtrl");
    var cs = this;
    $scope.translate = function () {
        $scope.trComplaintRelationName = $translate.instant('main.COMPLAINTRELATIONNAME');
        $scope.trCommands = $translate.instant('main.COMMANDS');

    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.translate();
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
         Restangular.all('complaintrelation').getList({
             pageNo: params.page(),
             pageSize: params.count(),
             sort: params.orderBy(),
             search: (cs.search) ? "name like '%" + cs.search + "%'" : ""
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
                cs.tableParams.reload();
                toaster.pop('success', "Updated.", 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'complaintrelation')
            data.post().then(function (res) {
                cs.tableParams.reload();
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
        if (!cs.tableParams.data[cs.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(cs.tableParams.data.length - 1, 1);
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
                if (cs.tableParams.data[index].fromServer) {
                    cs.tableParams.data[index].remove();
                }
                cs.tableParams.data.splice(index, 1);
                toaster.pop("error", "Attention !", "Record Deleted !");
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
        $rootScope.uService.ExitController("complaintrelationCtrl");
    });
};
