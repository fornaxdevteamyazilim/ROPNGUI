'use strict';
app.controller('VisitsCtrl', function ($scope, $rootScope, Restangular, $location, $translate, $filter, userService, $window, $element) {
    $rootScope.uService.EnterController("VisitsCtrl");
    $rootScope.ShowSpinnerObject = true;
    userService.userAuthorizated();
    $scope.InventoryCost = {};
    //$scope.YemekSepetiStore = {};
    $scope.InventoryCostIdealData = [
    {
        value: 100,
        color: '#F7464A',
        highlight: '#FF5A5E',
    },
    {
        value: 100,
        color: '#46BFBD',
        highlight: '#5AD3D1'
    }
    ];
    $scope.InventoryCostRealData = [
    {
        value: 100,
        color: '#F7464A',
        highlight: '#FF5A5E',
    },
    {
        value: 100,
        color: '#FDB45C',
        highlight: '#FFC870',
    }
    ];
    $scope.InventoryCostWasteData = [
   {
       value: 100,
       color: '#F7464A',
       highlight: '#FF5A5E',
   },
   {
       value: 100,
       color: '#4d88ff',
       highlight: '#4d88ff'
   }
    ];
    $scope.Back = function () {
        $window.history.back();
    };
    if ($rootScope.SelectedData) {
        $scope.selectedStoreID = $rootScope.SelectedData.id;
        $scope.selectedStoreName = $rootScope.SelectedData.name;
    }
    $scope.OrdersOrderType = [];
    $scope.GetData = function () {
        Restangular.one('dashboard/storestats').get({
            // StoreID: $rootScope.user.StoreID,
            StoreID: ($scope.selectedStoreID) ? $scope.selectedStoreID : $rootScope.user.StoreID,
        }).then(function (result) {
            $rootScope.ShowSpinnerObject = false;
            if (result.InventoryCost && (result.InventoryCost.Ideal > 0 || result.InventoryCost.Real > 0)) {
                $scope.InventoryCost = angular.copy(result.InventoryCost);
                $scope.InventoryCost.IdealTXT = $filter('number')($scope.InventoryCost.Ideal*100, 2);
                $scope.InventoryCost.RealTXT = $filter('number')($scope.InventoryCost.Real * 100, 2);
                $scope.InventoryCost.WasteTXT = $filter('number')($scope.InventoryCost.Waste * 100, 2);
                $scope.InventoryCost.FromDateTXT = $filter('date')($scope.InventoryCost.FromDate, 'dd-MM-yyyy');
                $scope.InventoryCost.ToDateTXT = $filter('date')($scope.InventoryCost.ToDate, 'dd-MM-yyyy');
                $scope.InventoryCost.CalculationTimeTXT = $filter('date')($scope.InventoryCost.CalculationTime, 'HH:mm');
                $scope.InventoryCostIdealData[0].value = (result.InventoryCost.Ideal * 100);
                $scope.InventoryCostIdealData[1].value = (100 - (result.InventoryCost.Ideal * 100));
                $scope.InventoryCostRealData[0].value = (result.InventoryCost.Real * 100);
                $scope.InventoryCostRealData[1].value = (100 - (result.InventoryCost.Real * 100));
                $scope.InventoryCostWasteData[0].value = (result.InventoryCost.Waste * 100);
                $scope.InventoryCostWasteData[1].value = (100 - (result.InventoryCost.Waste * 100));
            }
            $scope.storePerformanceData = angular.copy(result.storePerformanceData);
            $scope.AwaitingAuthDuration = angular.copy(result.AwaitingAuthDuration);
            $scope.Below30 = angular.copy(result.Below30);
            $scope.Beyond30 = angular.copy(result.Beyond30);
            $scope.Beyond45 = angular.copy(result.Beyond45);
            $scope.BuildingDuration = angular.copy(result.BuildingDuration);
            $scope.DeliveryPeriod = angular.copy(result.DeliveryPeriod);
            $scope.OrdersCount = angular.copy(result.OrdersCount);
            $scope.OutDuration = angular.copy(result.OutDuration);
            $scope.PeparedDuration = angular.copy(result.PeparedDuration);
            $scope.PeparingDuration = angular.copy(result.PeparingDuration);
            $scope.RealDeliveryTime = angular.copy(result.RealDeliveryTime);
            $scope.TransferredDuration = angular.copy(result.TransferredDuration);
            $scope.WaitingPeriod = angular.copy(result.WaitingPeriod);
            $scope.isFinalizeRequired=angular.copy(result.isFinalizeRequired);
            angular.copy(result.statsByOrderType, $scope.OrdersOrderType);
            $scope.OrderTotalCount = 0;
            $scope.OrderTotalAmount = 0;
            for (var i = 0; i < $scope.OrdersOrderType.length; i++) {
                $scope.OrderTotalCount += $scope.OrdersOrderType[i].OrdersCount;
                $scope.OrderTotalAmount += $scope.OrdersOrderType[i].OrdersAmount;
                switch (i) {
                    case 0: $scope.OrdersOrderType[i].color="danger"; break;
                    case 1: $scope.OrdersOrderType[i].color = "info"; break;
                    case 2: $scope.OrdersOrderType[i].color = "warning"; break;
                    case 3: $scope.OrdersOrderType[i].color = "purple"; break;
                    default: $scope.OrdersOrderType[i].color = "danger"

                }
            }
            //$scope.OrderTotalAmountTXT = $filter('number')($scope.OrderTotalAmount / 1.08, 2);
            //$scope.OrderACTXT = $filter('number')(($scope.OrderTotalAmount / $scope.OrderTotalCount) / 1.08, 2);

             $scope.OrderTotalAmountTXT = $filter('number')($scope.OrderTotalAmount, 2);
            $scope.OrderACTXT = $filter('number')(($scope.OrderTotalAmount / $scope.OrderTotalCount), 2);

        },
           function (restresult) {
               $rootScope.ShowSpinnerObject = false;
           })
        };
    $scope.GetData();
    $scope.saless = [600, 923, 482, 1211, 490, 1125, 1487];
    $scope.earnings = [400, 650, 886, 443, 502, 412, 353];
    $scope.referrals = [4879, 6567, 5022, 5890, 9234, 7128, 4811];
    $scope.translate = function () {
        $scope.sales = $translate.instant('main.SALES');
        $scope.totalnetamount = $translate.instant('main.TOTALNETAMOUNT');
        $scope.totalamount = $translate.instant('main.TOTALAMOUNT');
        $scope.average = $translate.instant('main.AVERAGE');
        $scope.totalorders = $translate.instant('main.TOTALORDERS');
        $scope.piece = $translate.instant('main.PIECE');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    var OrderRefresh = $scope.$on('OrderChange', function (event, data) {
        $scope.GetData();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        $rootScope.SelectedData = {};
        OrderRefresh();        
        $element.remove();
        $rootScope.uService.ExitController("VisitsCtrl");
    });  
});
app.controller('SalesCtrl', function ($scope, $rootScope, Restangular, $translate, userService, $element) {
    $rootScope.uService.EnterController("SalesCtrl");
    $scope.PaymentStates = [];
    $scope.PaymentTypes = [];
    $scope.Amount = [];
    if ($rootScope.SelectedData) {
        $scope.selectedStoreID = $rootScope.SelectedData.id;
        $scope.selectedStoreName = $rootScope.SelectedData.name;
    }
    $scope.GetData = function () {
        Restangular.one('dashboard/storestats').get({
            // StoreID: $rootScope.user.StoreID,
            StoreID: ($scope.selectedStoreID) ? $scope.selectedStoreID : $rootScope.user.StoreID,
        }).then(function (result) {
            $rootScope.ShowSpinnerObject = false;
            angular.copy(result.paymetStats, $scope.PaymentStates);
            angular.copy(result.paymetStats, $scope.PaymentStates);
            for (var i = 0; i < result.paymetStats.length; i++) {
                $scope.PaymentTypes[i] = result.paymetStats[i].storePaymentType.PaymentType.name;
                $scope.Amount[i] = parseFloat(Math.round(result.paymetStats[i].Amount * 100) / 100).toFixed(2);
            }
        },
           function (restresult) {
               $rootScope.ShowSpinnerObject = false;
           })
    };
    $scope.GetData();
    $scope.data = {
        labels: $scope.PaymentTypes,
        datasets: [
          {
              label: 'Gunluk Odeme Tipleri',
              fillColor: 'rgba(151,187,205,0.5)',
              strokeColor: 'rgba(151,187,205,0.8)',
              highlightFill: 'rgba(151,187,205,0.75)',
              highlightStroke: 'rgba(151,187,205,1)',
              data: $scope.Amount
          }
        ]
    };
    // Chart.js Options
    $scope.options = {
        maintainAspectRatio: false,

        // Sets the chart to be responsive
        responsive: true,

        //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero: true,

        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: true,

        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth: 1,

        //Boolean - If there is a stroke on each bar
        barShowStroke: true,

        //Number - Pixel width of the bar stroke
        barStrokeWidth: 2,

        //Number - Spacing between each of the X value sets
        barValueSpacing: 5,

        //Number - Spacing between data sets within X values
        barDatasetSpacing: 1,

        //String - A legend template
        legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("SalesCtrl");
    });
});
app.controller('OnotherCtrl', function ($scope, $rootScope, Restangular, $translate, userService, $element) {
    $rootScope.uService.EnterController("OnotherCtrl");
    $scope.HourlyName = [];
    $scope.HourlyOrdersCount = [];
    $scope.HourlyOrdersAmount = [];
    if ($rootScope.SelectedData) {
        $scope.selectedStoreID = $rootScope.SelectedData.id;
        $scope.selectedStoreName = $rootScope.SelectedData.name;
    }
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
    $scope.GetData();
    $scope.data = {
        labels: $scope.HourlyName,
        datasets: [
          {
              label: 'Number Orders',
              fillColor: 'rgba(220,220,220,0.2)',
              strokeColor: 'rgba(220,220,220,1)',
              pointColor: 'rgba(220,220,220,1)',
              pointStrokeColor: '#fff',
              pointHighlightFill: '#fff',
              pointHighlightStroke: 'rgba(220,220,220,1)',
              data: $scope.HourlyOrdersCount
          },
          {
              label: 'Order Amount',
              fillColor: 'rgba(151,187,205,0.2)',
              strokeColor: 'rgba(151,187,205,1)',
              pointColor: 'rgba(151,187,205,1)',
              pointStrokeColor: '#fff',
              pointHighlightFill: '#fff',
              pointHighlightStroke: 'rgba(151,187,205,1)',
              data: $scope.HourlyOrdersAmount
          }
        ]
    };
    $scope.options = {

        maintainAspectRatio: false,

        // Sets the chart to be responsive
        responsive: true,

        ///Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: true,

        //String - Colour of the grid lines
        scaleGridLineColor: 'rgba(0,0,0,.05)',

        //Number - Width of the grid lines
        scaleGridLineWidth: 1,

        //Boolean - Whether the line is curved between points
        bezierCurve: false,

        //Number - Tension of the bezier curve between points
        bezierCurveTension: 0.4,

        //Boolean - Whether to show a dot for each point
        pointDot: true,

        //Number - Radius of each point dot in pixels
        pointDotRadius: 4,

        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth: 1,

        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius: 20,

        //Boolean - Whether to show a stroke for datasets
        datasetStroke: true,

        //Number - Pixel width of dataset stroke
        datasetStrokeWidth: 2,

        //Boolean - Whether to fill the dataset with a colour
        datasetFill: true,

        // Function - on animation progress
        onAnimationProgress: function () { },

        // Function - on animation complete
        onAnimationComplete: function () { },

        //String - A legend template
        legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("OnotherCtrl");
    });
});
//app.controller('OnotherCtrl', function ($scope) {

//    // Chart.js Data
//    $scope.data = [
//      {
//          value: 300,
//          color: '#F7464A',
//          highlight: '#FF5A5E',
//          label: 'Yiyecekler'
//      },
//      {
//          value: 50,
//          color: '#46BFBD',
//          highlight: '#5AD3D1',
//          label: 'Tatlilar'
//      },
//      {
//          value: 100,
//          color: '#FDB45C',
//          highlight: '#FFC870',
//          label: 'Icecekler'
//      }
//    ];
//    $scope.total = 450;
//    // Chart.js Options
//    $scope.options = {

//        // Sets the chart to be responsive
//        responsive: false,

//        //Boolean - Whether we should show a stroke on each segment
//        segmentShowStroke: true,

//        //String - The colour of each segment stroke
//        segmentStrokeColor: '#fff',

//        //Number - The width of each segment stroke
//        segmentStrokeWidth: 2,

//        //Number - The percentage of the chart that we cut out of the middle
//        percentageInnerCutout: 50, // This is 0 for Pie charts

//        //Number - Amount of animation steps
//        animationSteps: 100,

//        //String - Animation easing effect
//        animationEasing: 'easeOutBounce',

//        //Boolean - Whether we animate the rotation of the Doughnut
//        animateRotate: true,

//        //Boolean - Whether we animate scaling the Doughnut from the centre
//        animateScale: false,

//        //String - A legend template
//        legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'

//    };

//});
//app.controller('LastCtrl', function ($scope) {

//    // Chart.js Data
//    $scope.data = {
//        labels: ['Yiyecekler', 'Icecekler', 'Tatlilar', 'Corbalar', 'Ara Sicaklar'],
//        datasets: [
//          {
//              label: 'Onceki Donem',
//              fillColor: 'rgba(220,220,220,0.2)',
//              strokeColor: 'rgba(220,220,220,1)',
//              pointColor: 'rgba(220,220,220,1)',
//              pointStrokeColor: '#fff',
//              pointHighlightFill: '#fff',
//              pointHighlightStroke: 'rgba(220,220,220,1)',
//              data: [65, 59, 90, 81, 56]
//          },
//          {
//              label: 'Simdiki Donem',
//              fillColor: 'rgba(151,187,205,0.2)',
//              strokeColor: 'rgba(151,187,205,1)',
//              pointColor: 'rgba(151,187,205,1)',
//              pointStrokeColor: '#fff',
//              pointHighlightFill: '#fff',
//              pointHighlightStroke: 'rgba(151,187,205,1)',
//              data: [28, 48, 40, 19, 96]
//          }
//        ]
//    };

//    // Chart.js Options
//    $scope.options = {

//        // Sets the chart to be responsive
//        responsive: true,

//        //Boolean - Whether to show lines for each scale point
//        scaleShowLine: true,

//        //Boolean - Whether we show the angle lines out of the radar
//        angleShowLineOut: true,

//        //Boolean - Whether to show labels on the scale
//        scaleShowLabels: false,

//        // Boolean - Whether the scale should begin at zero
//        scaleBeginAtZero: true,

//        //String - Colour of the angle line
//        angleLineColor: 'rgba(0,0,0,.1)',

//        //Number - Pixel width of the angle line
//        angleLineWidth: 1,

//        //String - Point label font declaration
//        pointLabelFontFamily: '"Arial"',

//        //String - Point label font weight
//        pointLabelFontStyle: 'normal',

//        //Number - Point label font size in pixels
//        pointLabelFontSize: 10,

//        //String - Point label font colour
//        pointLabelFontColor: '#666',

//        //Boolean - Whether to show a dot for each point
//        pointDot: true,

//        //Number - Radius of each point dot in pixels
//        pointDotRadius: 3,

//        //Number - Pixel width of point dot stroke
//        pointDotStrokeWidth: 1,

//        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
//        pointHitDetectionRadius: 20,

//        //Boolean - Whether to show a stroke for datasets
//        datasetStroke: true,

//        //Number - Pixel width of dataset stroke
//        datasetStrokeWidth: 2,

//        //Boolean - Whether to fill the dataset with a colour
//        datasetFill: true,

//        //String - A legend template
//        legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
//    };

//});
