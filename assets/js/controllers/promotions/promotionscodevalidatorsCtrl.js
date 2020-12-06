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
              toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
          });
      }
  });
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                pcv.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Updated') ,$translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'promotioncodevalidator')
            data.post().then(function (res) {
                pcv.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Saved') , $translate.instant('difinitions.Saved'));
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
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
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
                if (pcv.tableParams.data[index].fromServer) {
                    prd.tableParams.data[index].remove();
                }
                pcv.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
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
