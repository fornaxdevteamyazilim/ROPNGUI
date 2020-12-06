﻿'use strict';
app.controller('promotioncodeCtrl', promotioncodeCtrl);
function promotioncodeCtrl($rootScope, $scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $translate, $element) {
    $rootScope.uService.EnterController("promotioncodeCtrl");
    var pc = this;
    $scope.translate = function () {
        $scope.trPromotion = $translate.instant('main.PROMOTION');
        $scope.trCode = $translate.instant('main.CODE');
        $scope.trUsedAt = $translate.instant('main.USEDAT');
        $scope.trStation = $translate.instant('main.STATION');
        $scope.trStartDate = $translate.instant('main.STARTDATE');
        $scope.trEndDate = $translate.instant('main.ENDDATE');
        $scope.trCreateDate = $translate.instant('main.CREATEDATE');
        $scope.trMaxAmount = $translate.instant('main.MAXAMOUNT');
        $scope.trPomotionCodeState = $translate.instant('main.PROMOTIONCODESTATE');
        $scope.trProduct = $translate.instant('main.PRODUCT');
        $scope.trConfirmCode = $translate.instant('main.CONFIRMCODE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trUsedOrderID = $translate.instant('main.USEDORDERNO');
        $scope.trUsedStore = $translate.instant('main.USEDSTORE');

    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.item = {};
    pc.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
  {
      getData: function ($defer, params) {
          Restangular.all('promotioncode').getList({
              pageNo: params.page(),
              pageSize: params.count(),
              sort: params.orderBy(),
              search: (pc.search) ? "Code like '%" + pc.search + "%'" : ""
          }).then(function (items) {
              params.total(items.paging.totalRecordCount);
              $defer.resolve(items);
          }, function (response) {
              toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
          });
      }
  });
    $scope.saveData = function (data) {
        data.OrderPromotionID = 100719014269;
        data.PromotionCodeSourceID = 11111111;
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                pc.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Updated') , $translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'promotioncode')
            data.post().then(function (res) {
                pc.tableParams.reload();
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
        if (!pc.tableParams.data[pc.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pc.tableParams.data.length - 1, 1);
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
                if (pc.tableParams.data[index].fromServer) {
                    pc.tableParams.data[index].remove();
                }
                pc.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (pc.tableParams.data[index].fromServer) {
            pc.tableParams.data[index].remove();
        }
        pc.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        pc.tableParams.data.push({});
    };
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 100000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.promotions = [];
    $scope.loadEntities('promotion', 'promotions');
    $scope.promotioncodestates = [];
    $scope.loadEntities('enums/promotioncodestate', 'promotioncodestates');
    $scope.products = [];
    $scope.loadEntities('product', 'products');
    $scope.stations = [];
    $scope.loadEntities('cache/store', 'stations');
    $scope.UsedAtPopup = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.RegistrationDate;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.UsedAt = result;
        })
    };
    $scope.StartDatePopup = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.RegistrationDate;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.StartDate = result;
        })
    };
    $scope.EndDatePopup = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.RegistrationDate;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.EndDate = result;
        })
    };

    var deregistration1 = $scope.$watch(angular.bind(pc, function () {
        return pc.search;
    }), function (value) {
        pc.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("promotioncodeCtrl");
    });
};
