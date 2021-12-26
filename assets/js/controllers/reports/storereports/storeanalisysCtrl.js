app.controller('storeanalisysCtrl', storeanalisysCtrl);
function storeanalisysCtrl($scope, $modal, $filter, SweetAlert, Restangular,$translate, toaster, $window, $rootScope, $location, Excel, $timeout, NG_SETTING, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("storeanalisysCtrl");
    userService.userAuthorizated();
    if (!$rootScope.ReportParameters.StartDate) {
        $rootScope.ReportParameters.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if (!$rootScope.ReportParameters.EndDate) {
        $rootScope.ReportParameters.EndDate = moment().add(1, 'days').format('YYYY-MM-DD ');
    }
    if (userService.userIsInRole("Admin") || userService.userIsInRole("CCMANAGER") || userService.userIsInRole("LC") || userService.userIsInRole("AREAMANAGER") || userService.userIsInRole("ACCOUNTING") || userService.userIsInRole("PH") || userService.userIsInRole("MarketingDepartment") || userService.userIsInRole("PHAdmin") || userService.userIsInRole("OperationDepartment") || userService.userIsInRole("FinanceDepartment")) {
        $scope.StoreID = '';
        $scope.ShowStores = true;
    } else {
        $scope.StoreID = $rootScope.user.StoreID;
    }
    $scope.SetStoreID = function (FromValue) {
        $scope.StoreID = FromValue;
        $scope.selectedStore = $filter('filter')($scope.stores, { id: FromValue });
    };
    $scope.SetStoreTypeID = function (FromValue) {
        $scope.StoreTypeID = FromValue;
        $scope.selectedStoreType = $filter('filter')($scope.storetypes, { id: FromValue });
    };
    $scope.Time = ngnotifyService.ServerTime();
    $scope.StoreAnalisys = [];
    $scope.StoreTypeID = -1;
    $scope.LoadStoreAnalisys = function (FromValue) {
        var totalGiro = 0;
        var totalTC = 0;
        var totalFirstTimeTC = 0;
        var totalFirstTimeTL = 0;
        var totalFirstTimePercent = 0;
        var totalSecondTimeTC = 0;
        var totalSecondTimeTL = 0;
        var totalThirdTimeTC = 0;
        var totalThirdTimeTL = 0;
        var totalInstore = 0;
        var totalHomeDelivery = 0;
        var totalTakeaway = 0;
        var totalHnr = 0;
        var totalStaff = 0;
        var totalHomeDeliveryCount = 0;
        var totalBelow30 = 0;
        var totalBeyond30 = 0;
        var totalBeyond45 = 0;
        var totalPaketTC = 0;
        var totalPaketTL = 0;
        var totalGelAlTC = 0;
        var totalGelAlTL = 0;
        var totalMasaTC = 0;
        var totalMasaTL = 0;
        var totalPersonelTC = 0;
        var totalPersonelTL = 0;
        var totalAvmTC = 0;
        var totalAvmTL = 0;
        var totalPickupTC = 0;
        var totalPickupTL = 0;
        var totalGlovoTC = 0;
        var totalGlovoTL = 0;
        var totalRestoranTC = 0;
        var totalRestoranTL = 0;
        var totalYsTC = 0;
        var totalYsTL = 0;
        var totalCCTC = 0;
        var totalCCTL = 0;
        var totalWebTC = 0;
        var totalWebTL = 0;
        var totalIOSTC = 0;
        var totalIOSTL = 0;
        var totalAndroidTC = 0;
        var totalAndroidTL = 0;
        var totalMusteriSayisi = 0;
        var totalActiveCustomer = 0;
        var totalNewCustomer = 0;
        var totalDiscount = 0;
        var totalDiscountTL = 0;
        var totalOtherDiscount = 0;
        var totalOtherDiscountTL = 0;
        var totalReturnTC = 0;
        var totalReturnTL = 0;
        var totalCancelledTC = 0;
        var totalCancelledTL = 0;
        var totalRejectedTC = 0;
        var totalRejectedTL = 0;
        var totalAccountPayments = 0;
        var totalAccountExpencess = 0;
        var totalSideCount = 0;
        var totalSideTC = 0;
        var totalSideAmount = 0;
        var totalNefisKenarCount = 0;
        var totalNefisKenarTC = 0;
        var totalNefisKenarAmount = 0;
        var totalLSM = 0;
        var totalYSDiscount = 0;
        var totalYSDiscountTL = 0;
        var total30DKDiscount = 0;
        var total30DKDiscountTL = 0;
        var totalStaffAmount = 0;
        var totalStaffPercent = 0;
        var totalStaffTC = 0;
        var totalInStoreAmount = 0;
        var totalInStorePercent = 0;
        var totalInStoreTC = 0;
        var totalTakeAwayAmount = 0;
        var totalTakeAwayPercent = 0;
        var totalTakeAwayTC = 0;
        var totalHomeDeliveryAmount = 0;
        var totalHomeDeliveryPercent = 0;
        var totalHomeDeliveryTC = 0;
        var DeliveryU30 = 0;
        

        $scope.isWaiting = true;
        Restangular.all('StoreReports/StoreAnalisys').getList(
            {
                StoreID: $scope.StoreID,
                StartDate: $rootScope.ReportParameters.StartDate,
                EndDate: $rootScope.ReportParameters.EndDate,
                StoreTypeID: $scope.StoreTypeID
            }).then(function (result) {
                $scope.isWaiting = false;
                $scope.totalGiro = $scope.sumColumnJS(result, "Sales");
                $scope.totalTC = $scope.sumColumnJS(result, "TC");
                $scope.totalFirstTimeTC = $scope.sumColumnJS(result, "FirstTimeZoneTC");
                $scope.totalFirstTimeTL = $scope.sumColumnJS(result, "FirstTimeZoneSales");
                $scope.totalSecondTimeTC = $scope.sumColumnJS(result, "SecondTimeZoneTC");
                $scope.totalSecondTimeTL = $scope.sumColumnJS(result, "SecondTimeZoneSales");
                $scope.totalThirdTimeTC = $scope.sumColumnJS(result, "ThirdTimeZoneTC");
                $scope.totalThirdTimeTL = $scope.sumColumnJS(result, "ThirdTimeZoneSales");
                $scope.totalBelow30 = $scope.sumColumnJS(result, "Below30");
                $scope.totalBeyond30 = $scope.sumColumnJS(result, "Beyond30");
                $scope.totalBeyond45 = $scope.sumColumnJS(result, "Beyond45");
                $scope.totalPaketTC = $scope.sumColumnJS(result, "Paket_TC");
                $scope.totalPaketTL = $scope.sumColumnJS(result, "Paket_Amount");
                $scope.totalGelAlTC = $scope.sumColumnJS(result, "GelAl_Siparis_TC");
                $scope.totalGelAlTL = $scope.sumColumnJS(result, "GelAl_Siparis_Amount");
                $scope.totalMasaTC = $scope.sumColumnJS(result, "Masa_Siparisi_TC");
                $scope.totalMasaTL = $scope.sumColumnJS(result, "Masa_Siparisi_Amount");
                $scope.totalGlovoTC = $scope.sumColumnJS(result, "Glovo_TC");
                $scope.totalGlovoTL = $scope.sumColumnJS(result, "Glovo_Amount");
                $scope.totalGetirTC = $scope.sumColumnJS(result, "Getir_TC");
                $scope.totalGetirTL = $scope.sumColumnJS(result, "Getir_Amount");
                $scope.totalTrendyolTC = $scope.sumColumnJS(result, "Trendyol_TC");
                $scope.totalTrendyolTL = $scope.sumColumnJS(result, "Trendyol_Amount");
                $scope.totalPersonelTC = $scope.sumColumnJS(result, "Personel_TC");
                $scope.totalPersonelTL = $scope.sumColumnJS(result, "Personel_Amount");
                $scope.totalAvmTC = $scope.sumColumnJS(result, "AVM_TC");
                $scope.totalAvmTL = $scope.sumColumnJS(result, "AVM_Amount");
                $scope.totalPickupTC = $scope.sumColumnJS(result, "PickUp_TC");
                $scope.totalPickupTL = $scope.sumColumnJS(result, "PickUp_Amount");
                $scope.totalRestoranTC = $scope.sumColumnJS(result, "Store_TC");
                $scope.totalRestoranTL = $scope.sumColumnJS(result, "Store_Amount");
                $scope.totalYsTC = $scope.sumColumnJS(result, "YemekSepeti_TC");
                $scope.totalYsTL = $scope.sumColumnJS(result, "YemekSepeti_Amount");
                $scope.totalCCTC = $scope.sumColumnJS(result, "CallCenter_TC");
                $scope.totalCCTL = $scope.sumColumnJS(result, "CallCenter_Amount");
                $scope.totalWebTC = $scope.sumColumnJS(result, "Web_TC");
                $scope.totalWebTL = $scope.sumColumnJS(result, "Web_Amount");
                $scope.totalIOSTC = $scope.sumColumnJS(result, "IOS_TC");
                $scope.totalIOSTL = $scope.sumColumnJS(result, "IOS_Amount");
                $scope.totalAndroidTC = $scope.sumColumnJS(result, "Android_TC");
                $scope.totalAndroidTL = $scope.sumColumnJS(result, "Android_Amount");
                $scope.totalMusteriSayisi = $scope.sumColumnJS(result, "TotalPersons");
                $scope.totalActiveCustomer = $scope.sumColumnJS(result, "ActivePersons");
                $scope.totalNewCustomer = $scope.sumColumnJS(result, "NewPersons");
                $scope.totalDiscount = $scope.sumColumnJS(result, "Discounts_Count");
                $scope.totalDiscountTL = $scope.sumColumnJS(result, "Discounts_Amount");
                $scope.totalOtherDiscount = $scope.sumColumnJS(result, "OtherDiscount_Count");
                $scope.totalOtherDiscountTL = $scope.sumColumnJS(result, "OtherDiscount_Amount");
                $scope.totalReturnTC = $scope.sumColumnJS(result, "Control_OrdersReturned");
                $scope.totalReturnTL = $scope.sumColumnJS(result, "Control_OrdersReturnedAmount");
                $scope.totalCancelledTC = $scope.sumColumnJS(result, "Control_OrdersCancelled");
                $scope.totalCancelledTL = $scope.sumColumnJS(result, "Control_OrdersCancelledAmount");
                $scope.totalRejectedTC = $scope.sumColumnJS(result, "Control_OrdersRejected");
                $scope.totalRejectedTL = $scope.sumColumnJS(result, "Control_OrdersRejectedAmount");
                $scope.totalAccountPayments = $scope.sumColumnJS(result, "Control_AccountPayments");
                $scope.totalAccountExpencess = $scope.sumColumnJS(result, "Control_AccountExpencess");
                $scope.totalSideCount = $scope.sumColumnJS(result, "Sides_ProductCount");
                $scope.totalSideTC = $scope.sumColumnJS(result, "Sides_TCCount");
                $scope.totalSideAmount = $scope.sumColumnJS(result, "Sides_Amount");
                $scope.totalNefisKenarCount = $scope.sumColumnJS(result, "NefisKenarYanUrun_ProductCount");
                $scope.totalNefisKenarTC = $scope.sumColumnJS(result, "NefisKenarYanUrun_TCCount");
                $scope.totalNefisKenarAmount = $scope.sumColumnJS(result, "NefisKenarYanUrun_Amount");
                $scope.totalLSM = $scope.sumColumnJS(result, "LSM");
                $scope.totalYSDiscount = $scope.sumColumnJS(result, "Ys_Ind_Count");
                $scope.totalYSDiscountTL = $scope.sumColumnJS(result, "Ys_Ind_Amount");
                $scope.total30DKDiscount = $scope.sumColumnJS(result, "Dk_Ind_Count");
                $scope.total30DKDiscountTL = $scope.sumColumnJS(result, "Dk_Ind_Amount");
                

                angular.copy(result, $scope.StoreAnalisys);
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
    $scope.StoreAnalisysExcel = function () {
        location.href = NG_SETTING.apiServiceBaseUri + '/api/StoreReports/StoreAnalisysxls?StoreID=' + $scope.StoreID + '&StartDate=' + $rootScope.ReportParameters.StartDate + '&EndDate=' + $rootScope.ReportParameters.EndDate + '&StoreTypeID=' + $scope.StoreTypeID;
    };
    $scope.exportToExcel = function (tableId) {
        var blob = new Blob([document.querySelector(tableId).innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', 'RestoranAnalizi.xls');
        downloadLink[0].click();
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
            $rootScope.ReportParameters.StartDate = $filter('date')(data, 'yyyy-MM-dd');
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
            $rootScope.ReportParameters.EndDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
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
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 10000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.storetypes = [];
    $scope.loadEntities('enums/storetype', 'storetypes');
    $scope.StoreType = "-1";
    $scope.GetStoreType = function (data) {
        $scope.StoreTypeID = data;
        $scope.selectedType = $filter('filter')($scope.storetypes, { Value: data });
    };
    $scope.Back = function () {
        $window.history.back();
    };

    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("storeanalisysCtrl");
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