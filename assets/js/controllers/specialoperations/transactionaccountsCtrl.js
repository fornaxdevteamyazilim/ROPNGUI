app.controller('transactionaccountsCtrl', transactionaccountsCtrl);
function transactionaccountsCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, Excel, ngnotifyService, userService, $element) {
    $rootScope.uService.EnterController("transactionaccountsCtrl");
    var trna = this;
    $scope.ShowObject = true;
    userService.userAuthorizated();
    $scope.Time = ngnotifyService.ServerTime();
    $scope.translate = function () {
        $scope.trTransactionTypeDescrition = $translate.instant('main.TRANSACTIONTYPEDESCRIPTION');
        $scope.trPaymentType = $translate.instant('main.PAYMENTTYPE');
        $scope.trDescription = $translate.instant('main.DESCRIPTION');
        $scope.trTransacitonDate = $translate.instant('main.TRANSACTIONDATE');
        $scope.trOperationDate = $translate.instant('main.OPERATIONDATE');
        $scope.trAmountTL = $translate.instant('main.AMOUNTTL');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.person = $translate.instant('main.PERSON');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    if (!$scope.StartDate) {
        $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    } else {
        $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    }
    if (!$scope.EndDate) {
        $scope.EndDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    } else {
        $scope.EndDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    }
    $scope.GetSoreID = function (data) {
        $scope.StoreID = data;
    };
    $scope.BuildSearchString = function (src) {
        var result = [];
        result.push(($scope.StoreID) ? "StoreID=" + $scope.StoreID : "StoreID=" + $rootScope.user.StoreID);
        result.push("TransacitonDate between '" + $scope.StartDate + "'" + 'and' + "'" + $scope.EndDate + "'");
        if ($scope.TransactionType) {
            result.push("TransactionType=" + $scope.TransactionType + "");
        }
        if ($scope.AccountTransactionGroupID) {
            result.push("AccountTransactionGroupID=" + $scope.AccountTransactionGroupID + "");
        }
        return result;
    };
    $scope.LoadAccountTransactions = function () {
        trna.tableParams.reload();
    };
    trna.tableParams = new ngTableParams({
        page: 1,
        count: 1000,
        sorting: {
            TransacitonDate: 'desc'
        }
    },
{
    getData: function ($defer, params) {
        $scope.ShowObject = true;
        $scope.isWaiting = true;
        Restangular.all('accounttransaction').getList({
            pageNo: params.page(),
            pageSize: params.count(),
            sort: params.orderBy(),
            search: $scope.BuildSearchString(),
        }).then(function (items) {
            $scope.isWaiting = false;
            params.total(items.paging.totalRecordCount);
            $scope.AccountTransactions = items;
            $scope.myValues = $filter('orderBy')($scope.AccountTransactions, params.orderBy());
            $defer.resolve($scope.AccountTransactions);
            $scope.AccountTransactions = items;
            $scope.ShowObject = false;
            $scope.Total = 0;
            for (var i = 0; i < items.length; i++) {
                $scope.Total += items[i].Amount;
            }
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            $scope.ShowObject = false;
        });
    }
});
    $scope.item = {};
    $scope.saveData = function (data) {
        if (data.restangularized) {
            data.put().then(function (res) { trna.tableParams.reload(); toaster.pop('success',$translate.instant('orderfile.Updated'), 'Updated.'); });
        }
        else {
            Restangular.restangularizeElement('', data, $scope.objectType)
            data.post().then(function (res) { trna.tableParams.reload(); toaster.pop('success', $translate.instant('orderfile.Saved'), 'Saved.'); });
            data.get();
        }
    }

    $scope.exportToExcel = function (tableId) {
        var blob = new Blob([document.querySelector(tableId).innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', 'Account Operations.xls');
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
        if (!trna.tableParams.data[trna.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(trna.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning',$translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    $scope.ChangeAccountTransactionType = function (TransactionType) {
        $scope.TransactionType = TransactionType;
    };
    $scope.ChangeAccountTransactionGroups = function (AccountTransactionGroupID) {
        $scope.AccountTransactionGroupID = AccountTransactionGroupID;
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
                if (trna.tableParams.data[index].fromServer) {
                    trna.tableParams.data[index].remove();
                }
                trna.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));
            }
        });
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
    $scope.accounttransactionstypes = [];
    $scope.loadEntities('enums/accounttransactiontype', 'accounttransactionstypes');
    $scope.AccountTransactionGroups = [];
    $scope.loadEntities('AccountTransactionGroup', 'AccountTransactionGroups');
    $scope.cancelremove = function (index) {
        if (trna.tableParams.data[index].fromServer) {
            trna.tableParams.data[index].remove();
        }
        trna.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        trna.tableParams.data.push({});
    };
    $scope.SelectStartDate = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            var data = new Date(item);
            $scope.StartDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.SelectEndDate = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            var data = new Date(item);
            $scope.EndDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };

    $scope.Back = function () {
        $window.history.back();
    };

    var deregistration1 = $scope.$watch(angular.bind(trna, function () {
        return trna.search;
    }), function (value) {
        //trna.tableParams.reload();
    });
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
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("transactionaccountsCtrl");
    });
};
app.factory('Excel', function ($window) {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
        format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
    return {
        tableToExcel: function (tableId, worksheetName) {
            var table = document.querySelector(tableId),
                ctx = { worksheet: worksheetName, table: table.innerHTML },
                href = uri + base64(format(template, ctx));
            return href;
        }
    };
})