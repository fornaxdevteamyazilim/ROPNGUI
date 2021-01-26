'use strict';
app.controller('promotioncodeCtrl', promotioncodeCtrl);
function promotioncodeCtrl($rootScope, $scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $translate, $element) {
    $rootScope.uService.EnterController("promotioncodesourceCtrl");
    var pca = this;
    $scope.translate = function () {
        $scope.trName = $translate.instant('main.SOURCENAME');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.item = {};
    pca.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
  {
      getData: function ($defer, params) {
          Restangular.all('promotioncodesource').getList({
              pageNo: params.page(),
              pageSize: params.count(),
              sort: params.orderBy(),
              search: (pca.search) ? "name like '%" + pca.search + "%'" : ""
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
                pca.tableParams.reload();
                toaster.pop('success', $translate.instant('difinitions.Updated') , $translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'promotioncodesource')
            data.post().then(function (res) {
                pca.tableParams.reload();
                toaster.pop('success', $translate.instant('difinitions.Saved') , $translate.instant('difinitions.Saved'));
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
        if (!pca.tableParams.data[pca.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pca.tableParams.data.length - 1, 1);
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
            confirmButtonText:  $translate.instant('difinitions.confirmButtonText'),
            cancelButtonText:  $translate.instant('difinitions.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (pca.tableParams.data[index].fromServer) {
                    pca.tableParams.data[index].remove();
                }
                pca.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (pca.tableParams.data[index].fromServer) {
            pca.tableParams.data[index].remove();
        }
        pca.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        pca.tableParams.data.push({});
    };

    var deregistration1 = $scope.$watch(angular.bind(pca, function () {
        return pca.search;
    }), function (value) {
        pca.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("promotioncodesourceCtrl");
    });
};
