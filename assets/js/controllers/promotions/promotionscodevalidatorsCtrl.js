'use strict';
app.controller('promotionscodevalidatorsCtrl', promotionscodevalidatorsCtrl);
function promotionscodevalidatorsCtrl($rootScope, $scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $translate, $element) {
    $rootScope.uService.EnterController("promotionscodevalidatorsCtrl");
    var pcv = this;
    $scope.translate = function () {
        $scope.trName = $translate.instant('main.NAME');
        $scope.trisExternal = $translate.instant('main.ISEXTERNAL');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.item = {};
    pcv.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
  {
      getData: function ($defer, params) {
          Restangular.all('promotioncodevalidator').getList({
              pageNo: params.page(),
              pageSize: params.count(),
              sort: params.orderBy(),
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
                pcv.tableParams.reload();
                toaster.pop('success', "Updated.", 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'promotioncodevalidator')
            data.post().then(function (res) {
                pcv.tableParams.reload();
                toaster.pop('success', "Saved.", 'Saved.');
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
        if (!pcv.tableParams.data[pcv.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pcv.tableParams.data.length - 1, 1);
            toaster.pop('warning', "It is cancelled !", 'Insert cancelled !');
        } else {
            toaster.pop('warning', "It is cancelled !", 'Insert cancelled !');
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
                if (pcv.tableParams.data[index].fromServer) {
                    prd.tableParams.data[index].remove();
                }
                pcv.tableParams.data.splice(index, 1);
                toaster.pop("error", "Attention !", "Record Deleted !");
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (pcv.tableParams.data[index].fromServer) {
            pcv.tableParams.data[index].remove();
        }
        pcv.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        pcv.tableParams.data.push({});
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("promotionscodevalidatorsCtrl");
    });
};
