'use strict';
app.controller('productprototypelistCtrl', productprototypelistCtrl);
function productprototypelistCtrl($scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $location, $translate, $element) {
    $("#searchbyproductname").focus();
    $rootScope.uService.EnterController("productprototypelistCtrl");
    var pr = this;
    $scope.objectType = 'productprototype';
    $scope.SelectedItem = null;
    pr.search = '';
    $scope.translate = function () {
        $scope.trName = $translate.instant('main.NAME');
        $scope.trFilter = $translate.instant('main.FILTER');
        $scope.trActive = $translate.instant('main.ACTIVE');
        $scope.trOrderableFilter = $translate.instant('main.ORDERABLEFILTER');
        $scope.trOrderableValue = $translate.instant('main.ORDERABLEVALUE');
        $scope.trPrice = $translate.instant('main.PRICE');
        $scope.trMember = $translate.instant('main.MEMBER');
        $scope.trPluname = $translate.instant('main.PLUNAME');
        $scope.trExtname = $translate.instant('main.EXTNAME');
        $scope.vat = $translate.instant('main.VAT');

    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });

    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/product/product/edit/' + $scope.SelectedItem;
    };
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!pr.tableParams.data[pr.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pr.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Editcancelled'));
        }
    };
    pr.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            name: 'asc'
        }
    },
    {
        getData: function ($defer, params) {
            Restangular.all($scope.objectType).getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: (pr.search.length > 0) ? "name like '%" + pr.search + "%'" : "",
                sort: params.orderBy()
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                if (items.length > 0)
                    $scope.SelectedItem = items[0].id;
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
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
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.getproductctrl = function () {
        Restangular.all('product').getList({
            pageNo: params.page(),
            pageSize: params.count(),
            sort: params.orderBy(),
            search: "ProductPrototypeID='" + $scope.ProductPrototypeID + "'"
        }).then(function (items) {
            params.total(items.paging.totalRecordCount);
            $defer.resolve(items);
        }, function (response) {
            toaster.pop('warning', $translate.instant('Server.ServerError'), response);
        });
    }
    $scope.members = [];
    $scope.loadEntities('member', 'members');
    $scope.filters = [];
    $scope.loadEntities('filter', 'filters');
    $scope.productprices = [];
    $scope.loadEntities('productprice', 'productprices');
    $scope.cancelremove = function (index) {
        if (pr.tableParams.data[index].fromServer) {
            pr.tableParams.data[index].remove();
        }
        pr.tableParams.data.splice(index, 1);
    };
    $scope.$watch(angular.bind(pr, function () {
        return pr.search;
    }), function (value) {
        pr.tableParams.reload();
    });
    $scope.open = function (ObjectID) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tags/ObjectTagEditModalContent.html',
            controller: 'TagModalCtrl',
            size: '',
            backdrop: '',
            resolve: {
                ObjectID: function () {
                    return ObjectID;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.result = selectedItem;
        });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("productrecipeitemCtrl");
    });
};

