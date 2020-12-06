app.controller('ysproductmergeCtrl', ysproductmergeCtrl);
function ysproductmergeCtrl($scope, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element) {
    $("#searchbyysproductname").focus();
    $rootScope.uService.EnterController("ysproductmergeCtrl");
    var yspm = this;
    yspm.search = '';
    $scope.translate = function () {
        $scope.trMember = $translate.instant('main.MEMBER');
        $scope.trYSProductID = $translate.instant('main.YSPRODUCTID');
        $scope.trYSProductName = $translate.instant('main.YSPRODUCTNAME');
        $scope.trRopNGProduct = $translate.instant('main.ROPNGPRODUCTNAME');
        $scope.trSize = $translate.instant('main.SIZE');
        $scope.trMultiplayer = $translate.instant('main.MULTIPLAYER');
        $scope.trMapOptionsLevel = $translate.instant('main.MAPOPTIONSLEVEL');
        $scope.trMapToOption = $translate.instant('main.MAPTOOPTION');
        $scope.trOption = $translate.instant('main.OPTIONS');
        $scope.trFixedSize = $translate.instant('main.FIXEDSIZE');
        $scope.trPromotion = $translate.instant('main.PROMOTION');
        $scope.trMapByPrototype = $translate.instant('main.MAPBYPROTOTYPE');
        $scope.trSkipProduct = $translate.instant('main.SKIPPRODUCT');
        $scope.trAutoAddProduct = $translate.instant('main.AUTOADDPRODUCT');
        $scope.trMapOptionsLevel = $translate.instant('main.MAPOPTIONSLEVEL');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trmultiplier = $translate.instant('main.MULTIPLIER');
        $scope.trAutoAddProduct2 = $translate.instant('main.AUTOADDPRODUCT2');
        $scope.trmultiplier2 = $translate.instant('main.MULTIPLIER2');
        $scope.trMapToOption2 = $translate.instant('main.MAPTOOPTION2');
        $scope.trMapOptionsLevel2 = $translate.instant('main.MAPOPTIONSLEVEL2');
        $scope.trAddDefaults = $translate.instant('main.ADDDEFAULTS');
        $scope.trChildName = $translate.instant('main.CHILDNAME');


    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.translate();
    $scope.item = {};
    $scope.mapoptionlevels = [{ id: 0, name: 'Kendi' }, { id: 1, name: 'Altına' }, { id: 10, name: 'Otomatik Ürünün Altına' }]
    yspm.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    }, {
        getData: function ($defer, params) {
            Restangular.all('yemeksepetiproduct').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: (yspm.search.length > 0) ? "YSProductName like '%" + yspm.search + "%'" : "",
                sort: params.orderBy(),
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                yspm.tableParams.reload();
                toaster.pop('success', $translate.instant('yemeksepetifile.Updated'),  $translate.instant('yemeksepetifile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'yemeksepetiproduct')
            data.post().then(function (res) {
                yspm.tableParams.reload();
                toaster.pop('success', $translate.instant('yemeksepetifile.Saved'),  $translate.instant('yemeksepetifile.Saved'));
            });
            data.get();
        }
    };
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container, filter) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 100000,
                search: filter,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.members = [];
    $scope.loadEntities('member', 'members');
    $scope.products = [];
    $scope.loadEntities('product', 'products');
    $scope.promotions = [];
    $scope.loadEntities('promotion', 'promotions');
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
        if (!yspm.tableParams.data[yspm.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(yspm.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('yemeksepetifile.Cancelled'), $translate.instant('yemeksepetifile.Insertcancelled') );
        } else {
            toaster.pop('warning', $translate.instant('yemeksepetifile.Cancelled'), $translate.instant('yemeksepetifile.Editcancelled') );
        }
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('orderfile.Sure') ,
            text:  $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:  $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText:  $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (yspm.tableParams.data[index].fromServer) {
                    yspm.tableParams.data[index].remove();
                }
                yspm.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('yemeksepetifile.Attention'),$translate.instant('yemeksepetifile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (yspm.tableParams.data[index].fromServer) {
            yspm.tableParams.data[index].remove();
        }
        yspm.tableParams.data.splice(index, 1);
    };
    var deregistration1 = $scope.$watch(angular.bind(yspm, function () {
        return yspm.search;
    }), function (value) {
        yspm.tableParams.reload();
    });
    $scope.addItem = function () {
        yspm.tableParams.data.push({});
    };
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("ysproductmergeCtrl");
    });
};
