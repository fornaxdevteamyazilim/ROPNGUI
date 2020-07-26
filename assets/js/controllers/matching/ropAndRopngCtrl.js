﻿'use strict';
app.controller('ropAndRopngCtrl', ropAndRopngCtrl);
function ropAndRopngCtrl($rootScope, $scope, $log, $modal, $http, Restangular, ngTableParams, SweetAlert, toaster, $window, $location, $translate, $element) {
    $("#search").focus();
    $rootScope.uService.EnterController("ropAndRopngCtrl");
    var ng = this;
    ng.search = '';
    $scope.translate = function () {
        $scope.trNGProduct = $translate.instant('main.NGPRODUCTNAME');
        $scope.trNGProductPrice = $translate.instant('main.NGPRODUCTPRICE');
        $scope.trROPProduct = $translate.instant('main.ROPPRODUCT');
        $scope.trROPMainProduct = $translate.instant('main.ROPMAINPRODUCT');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.item = {};
    ng.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
 {
     getData: function ($defer, params) {
         Restangular.all('rop6productmap').getList({
             pageNo: params.page(),
             pageSize: params.count(),
             sort: params.orderBy(),
             search: (ng.search.length > 0) ? "Products.name like '%" + ng.search + "%'" : "",
         }).then(function (items) {
             params.total(items.paging.totalRecordCount);
             $defer.resolve(items);
         }, function (response) {
             toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
         });
     }
 });
    $scope.productprice2 = [];
    $scope.GetPrice = function (data) {
        Restangular.all('productprice').getList({
            pageNo: 1,
            pageSize: 1000000,
            search: (data) ? " ProductPrototypeID='" + data.ProductPrototypeID + "'" : ""
        }).then(function (result) {
            $scope.productprice2=result;
        }, function (response) {
            toaster.pop('error', "Server Error", response.data.ExceptionMessage);
        });
    };
    $scope.GetPrdoduct = function (data) {
        Restangular.one('product', data).get({
         pageNo: 1,
            pageSize: 1000000,
        }).then
       (function (result) {
           $scope.GetPrice(result);
       },
       function (response) {
           toaster.pop('error', "Server Error", response.data.ExceptionMessage);
       });
    };
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                ng.tableParams.reload();
                toaster.pop('success', $translate.instant('difinitions.Updated'), 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'rop6productmap')
            data.post().then(function (res) {
                ng.tableParams.reload();
                toaster.pop('success', $translate.instant('difinitions.Saved'), 'Saved.');
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
        if (!ng.tableParams.data[ng.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ng.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'), 'Insert cancelled !');
        } else {
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'), 'Edit cancelled !');
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
                if (ng.tableParams.data[index].fromServer) {
                    ng.tableParams.data[index].remove();
                }
                ng.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (ng.tableParams.data[index].fromServer) {
            ng.tableParams.data[index].remove();
        }
        ng.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        ng.tableParams.data.push({});
    };
    var deregistration1 = $scope.$watch(angular.bind(ng, function () {
        return ng.search;
    }), function (value) {
        ng.tableParams.reload();
    });
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.ShowObject2 = function (Container, idName, idvalue, resName, size) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName]+'['+$scope[Container][i][size]+']';
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
            });
        }
    };
    $scope.products = [];
    $scope.loadEntities('product', 'products');
    $scope.ropproducts = [];
    $scope.loadEntities('rop6/product', 'ropproducts');
    $scope.productprice = [];
    $scope.loadEntities('productprice', 'productprice');
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("ropAndRopngCtrl");
    });
};
