app.controller('shiftplanCtrl', shiftplanCtrl);
function shiftplanCtrl($rootScope, $scope, Restangular, ngTableParams, toaster, $translate, $element, $modal, $filter, userService, SweetAlert) {
    $rootScope.uService.EnterController("shiftplanCtrl");
    var shp = this;
    userService.userAuthorizated();
    $scope.translate = function () {
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trPeriodWeek = $translate.instant('main.WEEK');
        $scope.trPeriodYear = $translate.instant('main.YEAR');
        $scope.trDateRange = $translate.instant('main.DATERANGE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/specialoperations/shiftplanedit/' + $scope.SelectedItem;
    };
    $scope.GetSoreID = function (data) {
        $scope.StoreID = data;
    };
    $scope.BuildSearchString = function (shp) {
        var result = [];
        if (userService.userIsInRole("STOREMANAGER")) {
            result.push("StoreID =" + $rootScope.user.StoreID);
        }
        return result;
    };
    $scope.GetWeek = function (data) {
        $scope.Week = data;
    };
    $scope.GetYear = function (data) {
        $scope.Year = data;
    };
    $scope.finalDate = '';
    $scope.today = new Date();
    //$scope.currentYear = $scope.today.getFullYear();
    $scope.currentYear = '2018';

    // 10 Years from current year
    $scope.maxYear = new Date($scope.today.setFullYear($scope.today.getFullYear() + 10)).getFullYear();
    $scope.isDateValid = false;
    $scope.dateValidationText = '';

    $scope.weeks = [{
        Id: '',
        Name: ''
    }];

    for (x = 1; x <= 52; x++) {
        $scope.weeks.push({ Id: x, Name: x });
    }

    $scope.months = [{
        Id: '',
        Name: 'MONTH'
    }, {
        Id: 0,
        Name: 'JANUARY'
    }, {
        Id: 1,
        Name: 'FEBRUARY'
    }, {
        Id: 2,
        Name: 'MARCH'
    }, {
        Id: 3,
        Name: 'APRIL'
    }, {
        Id: 4,
        Name: 'MAY'
    }, {
        Id: 5,
        Name: 'JUNE'
    }, {
        Id: 6,
        Name: 'JULY'
    }, {
        Id: 7,
        Name: 'AUGUST'
    }, {
        Id: 8,
        Name: 'SEPTEMBER'
    }, {
        Id: 9,
        Name: 'OCTOBER'
    }, {
        Id: 10,
        Name: 'NOVEMBER'
    }, {
        Id: 11,
        Name: 'DECEMBER'
    }];

    $scope.years = [{
        Id: '',
        Name: ''
    }];

    for (x = $scope.currentYear; x <= $scope.maxYear; x++) {
        $scope.years.push({ Id: x, Name: x });
    }

    $scope.isLeapYear = false;
    $scope.yearType = '';

    shp.tableParams = new ngTableParams({
        page: 1,
        count: 1000,
        //sort: '+FirstDate'
    },
        {
            getData: function ($defer, params) {
                $scope.isWaiting = true;
                Restangular.all('ShiftPlan').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: $scope.BuildSearchString(),
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                    $scope.isWaiting = false;
                    }, function (response) {
                        $scope.isWaiting = false;
                    toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        });
    $scope.NewShiftPlan = function () {
        var item = {};
        if (userService.userIsInRole("STOREMANAGER")) {
            item.StoreID = $rootScope.user.StoreID;
        }
        else {
            item.StoreID = $scope.StoreID;
        }
        item.PeriodYear = $scope.Year;
        item.PeriodWeek = $scope.Week;
        Restangular.restangularizeElement('', item, 'ShiftPlan')
        item.post().then(function (resp) {
            location.href = '#/app/specialoperations/shiftplanedit2/' + resp.id;
        }, function (response) {
            toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };

    $scope.removedata = function (SelectItem) {
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
                $scope.item.remove().then(function () {
                    SweetAlert.swal($translate.instant('orderfile.Deleted'),  $translate.instant('orderfile.RecordDeleted'), "success");
                    //$location.path('app/inventory/inventoryadjust/list');
                });
            }
            else {
                SweetAlert.swal($translate.instant('orderfile.Cancelled'), $translate.instant('orderfile.DeletionCanceled'), "error");
            }
        });
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('orderfile.Sure') ,
            text:  $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:  $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText:  $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (shp.tableParams.data[index].fromServer) {
                    shp.tableParams.data[index].remove();
                }
                shp.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));
            }
        });
    };

    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("shiftplanCtrl");
    });
};
