app.controller('storesalestargetCtrl', storesalestargetCtrl);
function storesalestargetCtrl($rootScope, $scope, Restangular, ngTableParams, toaster, $translate, $element, $modal, $filter) {
    $rootScope.uService.EnterController("storesalestargetCtrl");
    var sst = this;
    $scope.translate = function () {
        ///**********************************
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trYear = $translate.instant('main.YEAR');
        $scope.trMonth = $translate.instant('main.MONTH');
        $scope.trAmount = $translate.instant('main.AMOUNT');
        $scope.trTC = $translate.instant('main.TC');
        $scope.trAC = $translate.instant('main.AC');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                sst.tableParams.reload();
                toaster.pop('success',$translate.instant('orderfile.Updated') , 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'storesalestarget')
            this.item.post().then(function (res) {
                sst.tableParams.reload();
                toaster.pop('success',$translate.instant('orderfile.Saved') , 'Saved.');
            });
            this.item.get();
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
        if (!sst.tableParams.data[sst.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(sst.tableParams.data.length - 1, 1);
            toaster.pop('warning',$translate.instant('orderfile.Cancelled'), 'Insert cancelled !');
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), 'Edit cancelled !');
        }
    };
    sst.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    }, {
        getData: function ($defer, params) {
            Restangular.all('storesalestarget').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', "Server error", response.data.ExceptionMessage);
            });
        }
    });
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
                if (sst.tableParams.data[index].fromServer) {
                    sst.tableParams.data[index].remove();
                }
                sst.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (sst.tableParams.data[index].fromServer) {
            sst.tableParams.data[index].remove();
        }
        sst.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        sst.tableParams.data.push({});
    };
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', "Server error", response);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    //$scope.storepaymenttypes = [];
    //$scope.loadEntitiesCache('cache/storepaymenttype', 'storepaymenttypes');
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("storesalestargetCtrl");
    });
};
