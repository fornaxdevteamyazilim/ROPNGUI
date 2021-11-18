'use strict';
app.controller('kitchenperformanceCtrl', kitchenperformanceCtrl);
function kitchenperformanceCtrl($scope, $log, $modal, $timeout, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $rootScope, $location, $translate, NG_SETTING, userService, ngnotifyService, $element) {
            $rootScope.uService.EnterController("kitchenperformanceCtrl");
    userService.userAuthorizated();
    if (!$scope.StartDate) {
        $scope.StartDate = $filter('date')(new Date(), 'yyyy-MM-dd ');
    }
    if (!$scope.EndDate) {
        $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD ');
    }
    $scope.Time = new Date();
    $scope.formatTimeFromSeconds = function (cellInfo) {
        var sec = cellInfo * 1000;
        var dateObj = new Date(sec);
        var hours = dateObj.getUTCHours();
        var minutes = dateObj.getUTCMinutes();
        var seconds = dateObj.getSeconds();
        var timeString = hours.toString().padStart(2, '0') + ':' +
            minutes.toString().padStart(2, '0') + ':' +
            seconds.toString().padStart(2, '0');
        return (cellInfo) ? timeString : "-";
    };
    $scope.Orders = [];
    $scope.LoadOrders = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('order/reports/deliveryperformance').getList(
            {
                EndDate: $scope.EndDate,
                StartDate: $scope.StartDate,
                OrderType: ($scope.OrderType == null) ? '' : $scope.OrderType,
                StoreID: ($scope.StoreID) ? $scope.StoreID : $rootScope.user.StoreID,
            }).then(function (result) {
                $scope.linage = result.length;
                $scope.TotalExit = 0;
                $scope.lineaverage = 0;
                $scope.PreparinDuration = 0;
                $scope.PreparinDurationMakeTable = 0;
                $scope.PreparinDurationCutTable = 0;
                $scope.PeparedDuration = 0;
                $scope.DeliveryPeriod = 0;
                $scope.AwaitingAuthDuration = 0;
                $scope.TransferredDuration = 0;
                $scope.OrderOutPeriod = 0;
                $scope.isWaiting = false;
                $scope.Orders = angular.copy(result);
                for (var i = 0; i < result.length; i++) {
                    $scope.lineaverage += result[i].DeliveryPeriod;
                    $scope.TotalExit += result[i].OrderOutPeriod;
                    $scope.PreparinDuration += result[i].PeparingDuration;
                    $scope.PreparinDurationMakeTable += result[i].PeparingMakeTableDuration;
                    $scope.PreparinDurationCutTable += result[i].PeparingCutTableDuration;
                    $scope.PeparedDuration += result[i].PeparedDuration;
                    $scope.DeliveryPeriod += result[i].DeliveryPeriod;
                    $scope.AwaitingAuthDuration += result[i].AwaitingAuthDuration;
                    $scope.TransferredDuration += result[i].TransferredDuration;
                    $scope.OrderOutPeriod += result[i].OrderOutPeriod;
                }
            }, function (response) {
                $scope.isWaiting = false;
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
    };
    $scope.GetSoreID = function (data) {
        $scope.StoreID = data;
        $scope.selectedStore = $filter('filter')($scope.user.userstores, { id: data });
    }
    $scope.PerformanceExcel = function () {
        location.href = NG_SETTING.apiServiceBaseUri + '/api/order/reports/deliveryperformancexls?StartDate=' + $scope.StartDate + '&EndDate=' + $scope.EndDate + '&StoreID=' + $scope.StoreID;
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
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length || $scope[Container].length == 0) {
            Restangular.all(EntityType).getList().then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.ordertypes = [];
    $scope.loadEntities('enums/ordertype', 'ordertypes');
    $scope.OrderType = "-1";
    $scope.OrderType = "1";
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.exportToExcel = function (tableId) {
        var blob = new Blob([document.querySelector(tableId).innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', 'MutfakPerformanslari.xls');
        downloadLink[0].click();
    };

    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("kitchenperformanceCtrl");
    });
};
