﻿'use strict';
app.controller('personinvoiceinfoCtrl', personinvoiceinfoCtrl);
function personinvoiceinfoCtrl($scope, $log, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $filter, $translate) {
    var pii = this;
    $rootScope.uService.EnterController("personinvoiceinfoCtrl");
    $scope.item = {};
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                pii.tableParams.reload();
                toaster.pop('success', "Updated.", 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'personinvoiceinfo')
            this.item.post().then(function (res) {
                pii.tableParams.reload();
                toaster.pop('success', "Saved.", 'Saved.');
            });
            this.item.get();
        }
    }
    $scope.translate = function () {
        $scope.trTaxOffice = $translate.instant('main.TAXOFFICE');
        $scope.trTaxNumber = $translate.instant('main.TAXNUMBER');
        $scope.trTittle = $translate.instant('main.TITTLE');
        $scope.trAddress = $translate.instant('main.ADDRESS');
        $scope.trCommands = $translate.instant('main.COMMANDS');

    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
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
        if (!pii.tableParams.data[pii.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pii.tableParams.data.length - 1, 1);
            toaster.pop('warning', "It is cancelled!", 'Insert cancelled !' );
        } else {
            toaster.pop('warning', "It is cancelled!", 'Insert cancelled !' );
        }
    };
    pii.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
    {
        getData: function ($defer, params) {
            Restangular.all('personinvoiceinfo').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "PersonID='" + $rootScope.PersonID + "'"
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
                if (pii.tableParams.data[index].fromServer) {
                    pii.tableParams.data[index].remove();
                }
                pii.tableParams.data.splice(index, 1);
                toaster.pop("error", "Attention !", "Record Deleted !");
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (pii.tableParams.data[index].fromServer) {
            pii.tableParams.data[index].remove();
        }
        pii.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        pii.tableParams.data.push({ PersonID: $rootScope.PersonID });
    };
    var unbindWatcher = $scope.$watch(angular.bind(pii, function () {
        return $rootScope.PersonID;
    }), function (value) {
        pii.tableParams.reload();
    });
    $scope.ok = function () {
        $modalInstance.close('return');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        unbindWatcher();
        deregistration();
        $rootScope.uService.ExitController("personinvoiceinfoCtrl");
    });
};
