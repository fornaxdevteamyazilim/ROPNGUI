app.controller('predefinednoteCtrl', predefinednoteCtrl);
function predefinednoteCtrl($rootScope, $scope, Restangular, ngTableParams, toaster, $location, $translate, $element, SweetAlert) {
    $rootScope.uService.EnterController("predefinednoteCtrl");
    var pdn = this;
    $scope.translate = function () {
        $scope.trNoteAlias = $translate.instant('main.NOTEALIAS');
        $scope.trNoteType = $translate.instant('main.NOTETYPE');
        $scope.trNote = $translate.instant('main.NOTE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                pdn.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Updated') , $translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'predefinednote')
            this.item.post().then(function (res) {
                pdn.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Saved') , $translate.instant('difinitions.Saved'));
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
        if (!pdn.tableParams.data[pdn.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pdn.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    pdn.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            Note:'asc'
        }
    }, {
        getData: function ($defer, params) {
            Restangular.all('predefinednote').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: (pdn.search) ? "Name like '%" + pdn.search + "%'" : ""
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
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
                if (pdn.tableParams.data[index].fromServer) {
                    pdn.tableParams.data[index].remove();
                }
                pdn.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (pdn.tableParams.data[index].fromServer) {
            pdn.tableParams.data[index].remove();
        }
        pdn.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        pdn.tableParams.data.push({});
    };
    var deregistration1 = $scope.$watch(angular.bind(pdn, function () {
        return pdn.search;
    }), function (value) {
        pdn.tableParams.reload();
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
    $scope.notetype = [];
    $scope.loadEntities('enums/notetype', 'notetype');
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("predefinednoteCtrl");
    });
};
