app.controller('reportspageCtrl', reportspageCtrl);
function reportspageCtrl($scope, SweetAlert, toaster, $window, Restangular, $stateParams, $location, $translate, $rootScope, $element) {
    $rootScope.uService.EnterController("reportspageCtrl");

    $scope.StockandCost = false;
    $scope.OtherReport = false;
    $scope.GiroReport = false;
    $scope.ProductSaleReport = false;
    $scope.ConsolidatedReport = false;
    $scope.OrdersReport = false;
    $scope.CallcenterReport = false;
    $scope.ComplaintReport = false;
    $scope.StoreLogsReport = false;
    $scope.AccountingReport = false;
    $scope.FSRReport = false;
    $scope.MGMGTReport = false;
    $scope.AUDITReports = false;
    $scope.SOSReports = false;
    $scope.goReportsPage = function (page) {
        $location.path(page);
    };
    $scope.close = function (data) {
        if (data == 'StockandCost')
            $scope.StockandCost = false;
        if (data == 'OtherReport')
            $scope.OtherReport = false;
        if (data == 'GiroReport')
            $scope.GiroReport = false;
        if (data == 'ProductSaleReport')
            $scope.ProductSaleReport = false;
        if (data == 'ConsolidatedReport')
            $scope.ConsolidatedReport = false;
        if (data == 'OrdersReport')
            $scope.OrdersReport = false;
        if (data == 'CallcenterReport')
            $scope.CallcenterReport = false;
        if (data == 'ComplaintReport')
            $scope.ComplaintReport = false;
        if (data == 'SmsListReport')
            $scope.StoreLogsReport = false;
        if (data == 'StoreLogsReport')
            $scope.StoreLogsReport = false;
        if (data == 'AccountingReport')
            $scope.AccountingReport = false;
        if (data == 'StaffShiftReport')
            $scope.StaffShiftReport = false;
        if (data == 'FSRReport')
            $scope.FSRReport = false;
        if (data == 'MGMGTReport')
            $scope.MGMGTReport = false;
        if (data == 'SOSReports')
            $scope.SOSReports = false;
        if (data == 'AUDITReports')
            $scope.AUDITReports = false;
    };
    $scope.loadSCRPage = function () {
        $scope.ProductSaleReport = false;
        $scope.GiroReport = false;
        $scope.OtherReport = false;
        $scope.ConsolidatedReport = false;
        $scope.OrdersReport = false;
        $scope.CallcenterReport = false;
        $scope.ComplaintReport = false;
        $scope.SmsListReport = false;
        $scope.StockandCost = true;
        $scope.StoreLogsReport = false;
        $scope.AccountingReport = false;
        $scope.StaffShiftReport = false;
        $scope.FSRReport = false;
        $scope.MGMGTReport = false;
        $scope.AUDITReports = false;
        $scope.SOSReports = false;
    };
    $scope.loadOtherPage = function () {
        $scope.ProductSaleReport = false;
        $scope.GiroReport = false;
        $scope.StockandCost = false;
        $scope.ConsolidatedReport = false;
        $scope.OrdersReport = false;
        $scope.CallcenterReport = false;
        $scope.ComplaintReport = false;
        $scope.SmsListReport = false;
        $scope.OtherReport = true;
        $scope.StoreLogsReport = false;
        $scope.AccountingReport = false;
        $scope.StaffShiftReport = false;
        $scope.FSRReport = false;
        $scope.MGMGTReport = false;
        $scope.AUDITReports = false;
        $scope.SOSReports = false;
    };
    $scope.loadGiroPage = function () {
        $scope.ProductSaleReport = false;
        $scope.StockandCost = false;
        $scope.OtherReport = false;
        $scope.ConsolidatedReport = false;
        $scope.CallcenterReport = false;
        $scope.ComplaintReport = false;
        $scope.SmsListReport = false;
        $scope.GiroReport = true;
        $scope.StoreLogsReport = false;
        $scope.AccountingReport = false;
        $scope.StaffShiftReport = false;
        $scope.FSRReport = false;
        $scope.MGMGTReport = false;
        $scope.AUDITReports = false;
        $scope.SOSReports = false;
    };
    $scope.loadProductSalePage = function () {
        $scope.StockandCost = false;
        $scope.OtherReport = false;
        $scope.GiroReport = false;
        $scope.ConsolidatedReport = false;
        $scope.OrdersReport = false;
        $scope.CallcenterReport = false;
        $scope.ComplaintReport = false;
        $scope.SmsListReport = false;
        $scope.ProductSaleReport = true;
        $scope.StoreLogsReport = false;
        $scope.AccountingReport = false;
        $scope.StaffShiftReport = false;
        $scope.FSRReport = false;
        $scope.MGMGTReport = false;
        $scope.AUDITReports = false;
        $scope.SOSReports = false;
    };
    $scope.loadConsolidatedPage = function () {
        $scope.StockandCost = false;
        $scope.OtherReport = false;
        $scope.GiroReport = false;
        $scope.ProductSaleReport = false;
        $scope.OrdersReport = false;
        $scope.CallcenterReport = false;
        $scope.ComplaintReport = false;
        $scope.SmsListReport = false;
        $scope.ConsolidatedReport = true;
        $scope.StoreLogsReport = false;
        $scope.AccountingReport = false;
        $scope.StaffShiftReport = false;
        $scope.FSRReport = false;
        $scope.MGMGTReport = false;
        $scope.AUDITReports = false;
        $scope.SOSReports = false;

    };
    $scope.loadOrdersPage = function () {
        $scope.StockandCost = false;
        $scope.OtherReport = false;
        $scope.GiroReport = false;
        $scope.ProductSaleReport = false;
        $scope.ConsolidatedReport = false;
        $scope.CallcenterReport = false;
        $scope.ComplaintReport = false;
        $scope.SmsListReport = false;
        $scope.OrdersReport = true;
        $scope.StoreLogsReport = false;
        $scope.AccountingReport = false;
        $scope.StaffShiftReport = false;
        $scope.FSRReport = false;
        $scope.MGMGTReport = false;
        $scope.AUDITReports = false;
        $scope.SOSReports = false;

    };
    $scope.loadCallcenterPage = function () {
        $scope.StockandCost = false;
        $scope.OtherReport = false;
        $scope.GiroReport = false;
        $scope.ProductSaleReport = false;
        $scope.ConsolidatedReport = false;
        $scope.OrdersReport = false;
        $scope.ComplaintReport = false;
        $scope.SmsListReport = false;
        $scope.CallcenterReport = true;
        $scope.StoreLogsReport = false;
        $scope.AccountingReport = false;
        $scope.StaffShiftReport = false;
        $scope.FSRReport = false;
        $scope.MGMGTReport = false;
        $scope.AUDITReports = false;
        $scope.SOSReports = false;

    };
    $scope.loadComplaintPage = function () {
        $scope.StockandCost = false;
        $scope.OtherReport = false;
        $scope.GiroReport = false;
        $scope.ProductSaleReport = false;
        $scope.ConsolidatedReport = false;
        $scope.OrdersReport = false;
        $scope.ComplaintReport = false;
        $scope.CallcenterReport = false;
        $scope.SmsListReport = false;
        $scope.ComplaintReport = true;
        $scope.StoreLogsReport = false;
        $scope.AccountingReport = false;
        $scope.StaffShiftReport = false;
        $scope.FSRReport = false;
        $scope.MGMGTReport = false;
        $scope.AUDITReports = false;
        $scope.SOSReports = false;

    };
    $scope.loadSmsListPage = function () {
        $scope.StockandCost = false;
        $scope.OtherReport = false;
        $scope.GiroReport = false;
        $scope.ProductSaleReport = false;
        $scope.ConsolidatedReport = false;
        $scope.OrdersReport = false;
        $scope.ComplaintReport = false;
        $scope.CallcenterReport = false;
        $scope.ComplaintReport = false;
        $scope.SmsListReport = true;
        $scope.StoreLogsReport = false;
        $scope.AccountingReport = false;
        $scope.StaffShiftReport = false;
        $scope.FSRReport = false;
        $scope.MGMGTReport = false;
        $scope.AUDITReports = false;
        $scope.SOSReports = false;

    };
    $scope.loadStoreLogsPage = function () {
        $scope.StockandCost = false;
        $scope.OtherReport = false;
        $scope.GiroReport = false;
        $scope.ProductSaleReport = false;
        $scope.ConsolidatedReport = false;
        $scope.OrdersReport = false;
        $scope.ComplaintReport = false;
        $scope.CallcenterReport = false;
        $scope.ComplaintReport = false;
        $scope.SmsListReport = false;
        $scope.StoreLogsReport = true;
        $scope.AccountingReport = false;
        $scope.StaffShiftReport = false;
        $scope.FSRReport = false;
        $scope.MGMGTReport = false;
        $scope.AUDITReports = false;
        $scope.SOSReports = false;

    };
    $scope.loadAccountingPage = function () {
        $scope.StockandCost = false;
        $scope.OtherReport = false;
        $scope.GiroReport = false;
        $scope.ProductSaleReport = false;
        $scope.ConsolidatedReport = false;
        $scope.OrdersReport = false;
        $scope.ComplaintReport = false;
        $scope.CallcenterReport = false;
        $scope.ComplaintReport = false;
        $scope.SmsListReport = false;
        $scope.StoreLogsReport = false;
        $scope.AccountingReport = true;
        $scope.StaffShiftReport = false;
        $scope.FSRReport = false;
        $scope.MGMGTReport = false;
        $scope.AUDITReports = false;
        $scope.SOSReports = false;

    };
    $scope.loadStaffShiftPage = function () {
        $scope.StockandCost = false;
        $scope.OtherReport = false;
        $scope.GiroReport = false;
        $scope.ProductSaleReport = false;
        $scope.ConsolidatedReport = false;
        $scope.OrdersReport = false;
        $scope.ComplaintReport = false;
        $scope.CallcenterReport = false;
        $scope.ComplaintReport = false;
        $scope.SmsListReport = false;
        $scope.StoreLogsReport = false;
        $scope.AccountingReport = false;
        $scope.StaffShiftReport = true;
        $scope.FSRReport = false;
        $scope.MGMGTReport = false;
        $scope.AUDITReports = false;
        $scope.SOSReports = false;
    };
    $scope.loadFsrReportPage = function () {
        $scope.StockandCost = false;
        $scope.OtherReport = false;
        $scope.GiroReport = false;
        $scope.ProductSaleReport = false;
        $scope.ConsolidatedReport = false;
        $scope.OrdersReport = false;
        $scope.ComplaintReport = false;
        $scope.CallcenterReport = false;
        $scope.ComplaintReport = false;
        $scope.SmsListReport = false;
        $scope.StoreLogsReport = false;
        $scope.AccountingReport = false;
        $scope.StaffShiftReport = false;
        $scope.FSRReport = true;
        $scope.MGMGTReport = false;
        $scope.AUDITReports = false;
        $scope.SOSReports = false;

    };
    $scope.loadFsrReportPage = function () {
        $scope.StockandCost = false;
        $scope.OtherReport = false;
        $scope.GiroReport = false;
        $scope.ProductSaleReport = false;
        $scope.ConsolidatedReport = false;
        $scope.OrdersReport = false;
        $scope.ComplaintReport = false;
        $scope.CallcenterReport = false;
        $scope.ComplaintReport = false;
        $scope.SmsListReport = false;
        $scope.StoreLogsReport = false;
        $scope.AccountingReport = false;
        $scope.StaffShiftReport = false;
        $scope.FSRReport = true;
        $scope.MGMGTReport = false;
        $scope.AUDITReports = false;
        $scope.SOSReports = false;

    };
    $scope.loadMGMGTReporPage = function () {
        $scope.StockandCost = false;
        $scope.OtherReport = false;
        $scope.GiroReport = false;
        $scope.ProductSaleReport = false;
        $scope.ConsolidatedReport = false;
        $scope.OrdersReport = false;
        $scope.ComplaintReport = false;
        $scope.CallcenterReport = false;
        $scope.ComplaintReport = false;
        $scope.SmsListReport = false;
        $scope.StoreLogsReport = false;
        $scope.AccountingReport = false;
        $scope.StaffShiftReport = false;
        $scope.FSRReport = false;
        $scope.MGMGTReport = true;
        $scope.AUDITReports = false;
        $scope.SOSReports = false;

    };
    $scope.loadSOSReportsPage = function () {
        $scope.StockandCost = false;
        $scope.OtherReport = false;
        $scope.GiroReport = false;
        $scope.ProductSaleReport = false;
        $scope.ConsolidatedReport = false;
        $scope.OrdersReport = false;
        $scope.ComplaintReport = false;
        $scope.CallcenterReport = false;
        $scope.ComplaintReport = false;
        $scope.SmsListReport = false;
        $scope.StoreLogsReport = false;
        $scope.AccountingReport = false;
        $scope.StaffShiftReport = false;
        $scope.FSRReport = false;
        $scope.MGMGTReport =false;
        $scope.FSRReport = false;
        $scope.AUDITReports = false;
        $scope.SOSReports = true;

    };
    $scope.loadAUDITReportPage = function () {
        $scope.StockandCost = false;
        $scope.OtherReport = false;
        $scope.GiroReport = false;
        $scope.ProductSaleReport = false;
        $scope.ConsolidatedReport = false;
        $scope.OrdersReport = false;
        $scope.ComplaintReport = false;
        $scope.CallcenterReport = false;
        $scope.ComplaintReport = false;
        $scope.SmsListReport = false;
        $scope.StoreLogsReport = false;
        $scope.AccountingReport = false;
        $scope.StaffShiftReport = false;
        $scope.FSRReport = false;
        $scope.MGMGTReport = false;
        $scope.AUDITReports = true;
        $scope.SOSReports = false;

    };


    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("reportspageCtrl");
    });
};