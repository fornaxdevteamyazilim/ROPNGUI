'use strict';
app.controller('orderdriverlistCtrl', orderdriverlistCtrl);
function orderdriverlistCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, $interval, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $timeout, NG_SETTING, ngnotifyService, $element, userService, Excel) {
    $rootScope.uService.EnterController("orderdriverlistCtrl");    
    userService.userAuthorizated();
    $scope.userroles = userService.getUserRoles($rootScope.user.UserRole.MemberID);
    if (!$scope.StartDate) {
        $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if (!$scope.EndDate) {
        $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD ');
    }
    $scope.BuildSearchString = function (StoreID) {
       var DriverRoles = $filter('filter')($scope.userroles, { name: 'Rest. Driver'}).map(function (elem) {
            return elem.id;  
        }).join(",");
        var result = []
        result.push(" UserRoleID in (" + DriverRoles + ")");
        result.push(" StoreID='" + StoreID + "'");
        return result;
    };
    $scope.Time = ngnotifyService.ServerTime();

    $scope.Driver = [];
    $scope.GetDrivers = function (StoreID) {
        Restangular.all('user').getList(
            {
                search: $scope.BuildSearchString(StoreID),
                 pageNo: 1,
                pageSize: 1000,
            }
        ).then(function (result) {
            $scope.Drivers = result;
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.getDriverName = function (DriverID) {
        $scope.DriverName = $filter('filter')($scope.Driver, { id: DriverID });
    };
    $scope.Drivers = {};
    $scope.DriverStats = [];
    $scope.DriverList = [];
    $scope.LoadDriverList = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('order/reports/orderdriverslist').getList(
            {
                StartDate: $scope.StartDate,
                EndDate: $scope.EndDate,
                StoreID: ($scope.StoreID) ? $scope.StoreID : $rootScope.user.StoreID,
                DriverID: ($scope.DriverID) ? $scope.DriverID : ''
            }
        ).then(function (result) {
            if ($scope.DriverStats.length) {
                $scope.DriverStats = [];
            }
            $scope.isWaiting = false;
            $scope.total = result.length;
            $scope.totalAmount = $scope.sumColumnJS(result, "Amount");
            for (var i = 0; i < result.length; i++) {
                var dr = $filter('filter')($scope.DriverStats, function (d) { return d.Driver == result[i].Driver; })[0];
                if (dr) {
                    dr.OrdersCount++;
                    dr.Amount += result[i].Amount;
                }
                else {
                    $scope.DriverStats.push({ Driver: result[i].Driver, OrdersCount: 1, Amount: result[i].Amount });
                }
                for (var j = 0; j < $scope.Driver.length; j++) {
                    if ($scope.Driver[j].FullName == result[i].Driver) {
                        $scope.Driver[j].OrdersCount = $scope.Driver[j].OrdersCount ? $scope.Driver[j].OrdersCount + 1 : 1;
                    }
                }
            }
            $scope.DriverList = result;
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.sumColumnJS = function sumColumnJS(array, col) {
        var sum = 0;
        array.forEach(function (value, index, array) {
            sum += value[col];
        });
        return sum;
    };

    $scope.GetSoreID = function (data) {
        $scope.StoreID = data;
        $scope.GetDrivers($scope.StoreID)
        $scope.selectedStore = $filter('filter')($scope.user.userstores, { id: data });
    };

    //    $scope.exportToExcel = function (tableId) {
    //    var blob = new Blob([document.querySelector(tableId).innerHTML], {
    //        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
    //    });
    //    var downloadLink = angular.element('<a></a>');
    //    downloadLink.attr('href', window.URL.createObjectURL(blob));
    //    downloadLink.attr('download', 'SiparisSurucuListesi.xls');
    //    downloadLink[0].click();
    //};

        $scope.exportToExcel = function (tableId) {
            $scope.exportHref = Excel.tableToExcel(tableId, 'SiparisSurucuListesi');
        $timeout(function () { location.href = $scope.exportHref }, 1);
    };

    $scope.RunOrderDetail = function (itemID) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/reports/ordersreports/deletedorderitemsdetails.html',
            controller: 'deletedorderitemsdetailsCtrl',
            size: 'lg',
            backdrop: '',
            resolve: {
                OrderID: function () {
                    return itemID;
                }
            }
        });
        modalInstance.result.then(function (item) {
        })
    };
    $scope.GetDriver = function (DriverID) {
        $scope.DriverID = DriverID;
        $scope.selectedDriver = $filter('filter')($scope.Drivers, { id: DriverID });
    };
    $scope.FindDriver = function (driverName) {
        for (var i = 0; i < $scope.Driver.length; i++) {
            if ($scope.Driver[i].FullName == driverName)
                return $scope.Driver[i];
        }
        return null;
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
            $scope.StartDate = $filter('date')(data, 'yyyy-MM-dd ');
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
            $scope.EndDate = $filter('date')(data, 'yyyy-MM-dd ');
        })
    };
    $scope.Back = function () {
        $window.history.back();
    };
    if ($rootScope.user && $rootScope.user.userstores.length < 2) {
        $scope.GetDrivers($rootScope.user.StoreID);
    }

        $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("orderdriverlistCtrl");
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