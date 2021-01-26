app.controller('yspaymentmergeCtrl', yspaymentmergeCtrl);
function yspaymentmergeCtrl($scope, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element) {
    $rootScope.uService.EnterController("yspaymentmergeCtrl");
    var yspaym = this;
    $scope.translate = function () {
        $scope.trMember = $translate.instant('main.MEMBER');
        $scope.trYSPaymentTypeName = $translate.instant('main.YSPAYMENTTYPENAME');
        $scope.trYSName = $translate.instant('main.YSNAME');
        $scope.trYSDescription = $translate.instant('main.YSDESCRIPTION');
        $scope.trRopNGPaymentTypeName = $translate.instant('main.ROPNGPAYMENTTYPENAME');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.translate();
    $scope.item = {};
    yspaym.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    }, {
        getData: function ($defer, params) {
            Restangular.all('yemeksepetipayment').getList({
                pageNo: params.page(),
                pageSize: params.count(),
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
                yspaym.tableParams.reload();
                toaster.pop('success', $translate.instant('yemeksepetifile.Updated') ,  $translate.instant('yemeksepetifile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'yemeksepetipayment')
            data.post().then(function (res) {
                yspaym.tableParams.reload();
                toaster.pop('success', $translate.instant('yemeksepetifile.Saved') ,  $translate.instant('yemeksepetifile.Saved'));
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
                pageSize: 1000,
                search: filter,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.members = [];
    $scope.loadEntities('member', 'members');
    $scope.paymenttypes = [];
    $scope.loadEntities('paymenttype', 'paymenttypes');
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
        if (!yspaym.tableParams.data[yspaym.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(yspaym.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('yemeksepetifile.Cancelled'), $translate.instant('yemeksepetifile.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('yemeksepetifile.Cancelled'), $translate.instant('yemeksepetifile.Editcancelled'));
        }
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('orderfile.Sure') ,
            text:  $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:    $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText:   $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (yspaym.tableParams.data[index].fromServer) {
                    yspaym.tableParams.data[index].remove();
                }
                yspaym.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('yemeksepetifile.Attention'),$translate.instant('yemeksepetifile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (yspaym.tableParams.data[index].fromServer) {
            yspaym.tableParams.data[index].remove();
        }
        yspaym.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        yspaym.tableParams.data.push({ MemberID: $rootScope.user.StoreMemberID }); // TODO : MemberID : $rootScope.user.Store.Member.id
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("yspaymentmergeCtrl");
    });
};
