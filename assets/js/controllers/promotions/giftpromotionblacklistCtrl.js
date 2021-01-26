'use strict';
app.controller('giftpromotionblacklistCtrl', giftpromotionblacklistCtrl);
function giftpromotionblacklistCtrl($rootScope, $scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $translate, $element) {
    $rootScope.uService.EnterController("giftpromotionblacklistCtrl");
    var gpbl = this;
    $scope.translate = function () {
        $scope.trGiftPromotion = $translate.instant('main.GIFTPROMOTION');
        $scope.trCommands = $translate.instant('main.COMMANDS');

    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.item = {};
    gpbl.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            //SendDate: 'desc'
        }
    },
        {
            getData: function ($defer, params) {
                Restangular.all('giftpromotionblacklistitem').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: (gpbl.search) ? "Recipient like '%" + gpbl.search + "%'" : ""
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
                gpbl.tableParams.reload();
                toaster.pop('success', $translate.instant('difinitions.Updated') , $translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'giftpromotionblacklistitem')
            data.post().then(function (res) {
                gpbl.tableParams.reload();
                toaster.pop('success', $translate.instant('difinitions.Saved') ,$translate.instant('difinitions.Saved'));
            });
            data.get();
        }
    }

    $scope.exportToExcel = function (tableId) {
        var blob = new Blob([document.querySelector(tableId).innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', 'HediyePromosyonKaraListe.xls');
        downloadLink[0].click();
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
        if (!gpbl.tableParams.data[gpbl.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(gpbl.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Editcancelled'));
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
                if (gpbl.tableParams.data[index].fromServer) {
                    gpbl.tableParams.data[index].remove();
                }
                gpbl.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (gpbl.tableParams.data[index].fromServer) {
            gpbl.tableParams.data[index].remove();
        }
        gpbl.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        gpbl.tableParams.data.push({});
    };

    $scope.UsedAtPopup = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.RegistrationDate;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.UsedAt = result;
        })
    };
    $scope.StartDatePopup = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.RegistrationDate;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.StartDate = result;
        })
    };
    $scope.EndDatePopup = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.RegistrationDate;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.EndDate = result;
        })
    };

    var deregistration1 = $scope.$watch(angular.bind(gpbl, function () {
        return gpbl.search;
    }), function (value) {
        gpbl.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("giftpromotionblacklistCtrl");
    });
};
