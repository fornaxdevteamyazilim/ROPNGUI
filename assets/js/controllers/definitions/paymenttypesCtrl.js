app.controller('paymenttypesCtrl', paymenttypesCtrl);
function paymenttypesCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("paymenttypesCtrl");
    var pt = this;
    $scope.item = {};
    $scope.translate = function () {
        $scope.trMember = $translate.instant('main.MEMBER');
        $scope.trName = $translate.instant('main.NAME');
        $scope.trPaymentTypeID = $translate.instant('main.PAYMENTTYPE');
        $scope.trIndex = $translate.instant('main.INDEX');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trACItemcode = $translate.instant('main.ACITEMCOD');
        $scope.trACAccountcode = $translate.instant('main.ACACCOUNTCODE');
        $scope.trACVATAccountcode = $translate.instant('main.ACVATACCOUNTCODE');
        $scope.trACServiceAccount = $translate.instant('main.ACSERVICEACCOUNT');
        $scope.trACServiceVATAccount = $translate.instant('main.ACSERVICEVATACCOUNT');
        $scope.trAutoSendToEcr = $translate.instant('main.AUTOSENDTOECR');
        $scope.trEcrPaymentType = $translate.instant('main.ECRPAYMENTTYPE');
        $scope.trOpenDrawer = $translate.instant('main.OPENDRAWER');
        

    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.saveData = function () {
        if (this.item.restangularized && this.item.id) {
            this.item.put().then(function (res) {
                pt.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Updated'),$translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'paymenttype')
            this.item.post().then(function (res) {
                pt.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Saved'), $translate.instant('difinitions.Saved'));
            });
            this.item.get();
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
        if (!pt.tableParams.data[pt.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pt.tableParams.data.length - 1, 1);
            toaster.pop('warning',$translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning',$translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    pt.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            OrderIndex:'asc'
        }
    },
    {
        getData: function ($defer, params) {
            Restangular.all('paymenttype').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: (pt.search) ? "name like '%" + pt.search + "%'" : ""
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
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
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };

    $scope.paymenttypes = [];
    $scope.loadEntities('enums/basepaymenttype', 'paymenttypes');
    $scope.members = [];
    $scope.loadEntities('member', 'members');

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
                if (pt.tableParams.data[index].fromServer) {
                    pt.tableParams.data[index].remove();
                }
                pt.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };

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

    $scope.cancelremove = function (index) {
        if (pt.tableParams.data[index].fromServer) {
            pt.tableParams.data[index].remove();
        }
        pt.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        pt.tableParams.data.push({});
    };
    var deregistration1 = $scope.$watch(angular.bind(pt, function () {
        return pt.search;
    }), function (value) {
        pt.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("paymenttypesCtrl");
    });
};