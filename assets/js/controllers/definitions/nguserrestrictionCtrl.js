﻿app.controller('nguserrestrictionCtrl', nguserrestrictionCtrl);
function nguserrestrictionCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("nguserrestrictionCtrl");
    var ngur = this;
    $scope.translate = function () {
        $scope.trName = $translate.instant('main.NAME');
        $scope.trDescription = $translate.instant('main.DESCRIPTION');
        $scope.trUserRestrictionType = $translate.instant('main.USERRESTRICTIONTYPE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                ngur.tableParams.reload();
                $scope.$emit('LoadUserRestrictions', "ReloadUserRestrictions");
                toaster.pop('success', "Updated.", 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'nguserrestriction')
            this.item.post().then(function (res) {
                ngur.tableParams.reload();
                $scope.$emit('LoadUserRestrictions', "ReloadUserRestrictions");
                toaster.pop('success', "Saved.", 'Saved.');
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
        if (!ngur.tableParams.data[ngur.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ngur.tableParams.data.length - 1, 1);
            toaster.pop('warning', "It is cancelled !", 'Insert cancelled !');
        } else {
            toaster.pop('warning', "It is cancelled !", 'Edit cancelled !');
        }
    };
    ngur.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            Name :'asc'
        }
    },
    {
        getData: function ($defer, params) {
            Restangular.all('nguserrestriction').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: (ngur.search) ? "Name like '%" + ngur.search + "%'" : ""
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
            });
        }
    });
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: "ARE YOU SURE ?",
            text: "Are you sure you want to delete the record ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Delete !",
            cancelButtonText: "No, Deletion !",
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (ngur.tableParams.data[index].fromServer) {
                    ngur.tableParams.data[index].remove();
                }
                ngur.tableParams.data.splice(index, 1);
                toaster.pop("error", "Attention !", "Record Deleted !");
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (ngur.tableParams.data[index].fromServer) {
            ngur.tableParams.data[index].remove();
        }
        ngur.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        ngur.tableParams.data.push({});
    };
    var deregistration1 = $scope.$watch(angular.bind(ngur, function () {
        return ngur.search;
    }), function (value) {
        ngur.tableParams.reload();
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
                toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
            });
        }
    };
    $scope.userrestrictiontypes = [];
    $scope.loadEntities('enums/userrestrictiontype', 'userrestrictiontypes');
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("nguserrestrictionCtrl");
    });
};
