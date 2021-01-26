app.controller('ysstoresettingCtrl', ysstoresettingCtrl);
function ysstoresettingCtrl($scope, $modalInstance, $log, $rootScope, toaster, Restangular, $window, $location, callsService, localStorageService, userService, $translate, ngTableParams ) {
    var yss = this; 
    $rootScope.uService.EnterController("ysstoresettingCtrl");
    $scope.translate = function () {
        $scope.trMember = $translate.instant('main.MEMBER');
        $scope.trDisplayName = $translate.instant('main.DISPLAYNAME');
        $scope.trCatalogName = $translate.instant('main.CATALOGNAME');
        $scope.trCategoryName = $translate.instant('main.CATEGORYNAME');
        $scope.trServiceTime = $translate.instant('main.SERVICETIME');
        $scope.trSpeed = $translate.instant('main.SPEED');
        $scope.trServing = $translate.instant('main.SERVING');
        $scope.trFlavour = $translate.instant('main.FLAVOUR');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trIsOpen = $translate.instant('main.ISOPEN');

    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.translate();
    $scope.item = {};
    //yss.tableParams = new ngTableParams({
    //    page: 1,
    //    count: 10,
    //    sorting: {
    //        DisplayName: 'asc'
    //    }
    //}, {
    //    getData: function ($defer, params) {
    //        Restangular.all('yemeksepetistore').getList({
    //            pageNo: params.page(),
    //            pageSize: params.count(),
    //            sort: params.orderBy(),
    //        }).then(function (items) {
    //            params.total(items.paging.totalRecordCount);
    //            $defer.resolve(items);
    //        }, function (response) {
    //            toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
    //        });
    //    }
    //});


    $scope.GetData = function () {
        Restangular.one('dashboard/storestats').get({
            // StoreID: $rootScope.user.StoreID,
            StoreID: ($scope.selectedStoreID) ? $scope.selectedStoreID : $rootScope.user.StoreID,
        }).then(function (result) {
            $rootScope.ShowSpinnerObject = false;
            angular.copy(result.statsByOrderType, $scope.OrdersOrderType);
            for (var i = 0; i < result.statsByHour.length; i++) {
                $scope.HourlyName[i] = result.statsByHour[i].Hour;
                $scope.HourlyOrdersCount[i] = result.statsByHour[i].OrdersCount;
                $scope.HourlyOrdersAmount[i] = result.statsByHour[i].OrdersAmount;
            }
        },
            function (restresult) {
                $rootScope.ShowSpinnerObject = false;
            })
    };

    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        $scope.exportHref = Excel.tableToExcel(tableId, 'YsRestoranEslestirme');
        $timeout(function () { location.href = $scope.exportHref }, 1); // trigger download
    };

    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                yss.tableParams.reload();
                toaster.pop('success', $translate.instant('yemeksepetifile.Updated'),  $translate.instant('yemeksepetifile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'yemeksepetistore')
            data.post().then(function (res) {
                yss.tableParams.reload();
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
                pageSize: 1000,
                search: filter,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.members = [];
    $scope.loadEntities('member', 'members');
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
        if (!yss.tableParams.data[yss.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(yss.tableParams.data.length - 1, 1);
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
                if (yss.tableParams.data[index].fromServer) {
                    yss.tableParams.data[index].remove();
                }
                yss.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('yemeksepetifile.Attention'),$translate.instant('yemeksepetifile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (yss.tableParams.data[index].fromServer) {
            yss.tableParams.data[index].remove();
        }
        yss.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        yss.tableParams.data.push({ MemberID: $rootScope.user.StoreMemberID });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("ysstoresettingCtrl");
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