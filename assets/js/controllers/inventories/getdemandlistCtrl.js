'use strict';
app.controller('getdemandlistCtrl', getdemandlistCtrl);
function getdemandlistCtrl($scope, $filter, Restangular, toaster, $window, $stateParams, $rootScope, $location, ngTableParams, userService, ngnotifyService, $translate, $element, $modal) {
    $rootScope.uService.EnterController("getdemandlistCtrl");
    var gdl = this;
    $scope.SelectedDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    $scope.translate = function () {
        $scope.save = $translate.instant('main.SENDTRANSFER');
        $scope.startdate = $translate.instant('main.STARTDATE');
        $scope.getlist = $translate.instant('main.GETLIST');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.getDemandList = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('InventorySupply/getdemandlist').getList({
            BeforeDate: ($scope.SelectedDate) ? $scope.SelectedDate : ''
        }).then(function (result) {
            $scope.isWaiting = false;
            for (var i = 0; i < result.length; i++) {
                result[i]['groupTotal'] = 0;
                for (var j = 0; j < result[i].items.length; j++) {
                    result[i].items[j].isSelected = true;
                    result[i].groupTotal += result[i].items[j].UnitsRequired
                }
            }
            $scope.result = result;
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.getDemandList();
    $scope.SaveData = function (data) {
        $scope.isSpinner = true;
        Restangular.restangularizeElement('', data, 'InventorySupply/createtransfers')
        data.post().then(function (resp) {
            $scope.isSpinner = false;
            $scope.result = resp;
            toaster.pop("success", $translate.instant('orderfile.Saved'));
        }, function (response) {
            $scope.isSpinner = false;
            toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.checkedData = function (data) {
        if (data.isSelected == true) {
            for (var i = 0; i < $scope.result.length; i++) {
                if ($scope.result[i].InventoryUnitID == data.InventoryUnitID)
                    $scope.result[i].groupTotal += data.UnitsRequired
            }
        }
        if (data.isSelected == false) {
            for (var i = 0; i < $scope.result.length; i++) {
                if ($scope.result[i].InventoryUnitID == data.InventoryUnitID)
                    $scope.result[i].groupTotal -= data.UnitsRequired
            }
        }
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
            $scope.SelectedDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("getdemandlistCtrl");
    });
};