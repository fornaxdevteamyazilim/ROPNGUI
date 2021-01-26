'use strict';
app.controller('inventoryrecipeoutputitemCtrl', inventoryrecipeoutputitemCtrl);
function inventoryrecipeoutputitemCtrl($rootScope, $scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $translate, $element) {
    $rootScope.uService.EnterController("inventoryrecipeoutputitemCtrl");
    var iro = this;
    $scope.objectType = 'inventoryrecipeoutputitem';
    $scope.SelectedItem = null;
    iro.search = '';
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
    };
    $scope.saveData = function (data) {
        if (data.restangularized) {
            data.put().then(function (res) { iro.tableParams.reload(); toaster.pop('success',$translate.instant('invantories.Updated'), $translate.instant('invantories.Updated')); });
        }
        else {
            Restangular.restangularizeElement('', data, $scope.objectType)
            data.post().then(function (res) { iro.tableParams.reload(); toaster.pop('success', $translate.instant('invantories.Saved'), $translate.instant('invantories.Saved')); });
            data.get();
        }
    };
    $scope.FormKeyPress = function (event, rowform, data, index) {
        if (event.keyCode === 13 && rowform.$visible) {
            _update(rowform.$data, data);
            $scope.saveData(data);
            rowform.$cancel();
            return data;
        }
        if (event.keyCode === 27 && rowform.$visible) {
            $scope.cancelForm(rowform);
        }
    };
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!iro.tableParams.data[iro.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(iro.tableParams.data.length - 1, 1);
            toaster.pop('warning',$translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning',$translate.instant('invantories.Cancelled'),  $translate.instant('difinitions.Editcancelled'));
        }
    };
    iro.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    },{
        getData: function ($defer, params) {
            Restangular.all($scope.objectType).getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy()
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $scope.SelectedItem = items[0].id;
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('error',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.date = new Date();
    $scope.saveItem = function (data) {
        _update(data, this.item);
        $scope.saveData(this.item);
        return this.item;
    };
    function _update(srcObj, destObj) {
        for (var key in srcObj) {
            if (destObj.hasOwnProperty(key) && srcObj.hasOwnProperty(key)) {
                destObj[key] = (srcObj[key] != undefined) ? srcObj[key] : '';
            }
            if (!destObj.hasOwnProperty(key) && srcObj.hasOwnProperty(key)) {
                destObj[key] = (srcObj[key] != undefined) ? srcObj[key] : '';
            }
        }
    }
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('invantories.Sure') ,
            text:  $translate.instant('invantories.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:  $translate.instant('invantories.confirmButtonText'),
            cancelButtonText:  $translate.instant('invantories.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (iro.tableParams.data[index].fromServer) {
                    iro.tableParams.data[index].remove();
                }
                iro.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'),$translate.instant('invantories.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (iro.tableParams.data[index].fromServer) {
            iro.tableParams.data[index].remove();
        }
        iro.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        iro.tableParams.data.push({});
    };
    var deregistration = $scope.$watch(angular.bind(iro, function () {
        return iro.search;
    }), function (value) {
        iro.tableParams.reload();
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
        $rootScope.uService.ExitController("inventoryrecipeoutputitemCtrl");
    });
};
