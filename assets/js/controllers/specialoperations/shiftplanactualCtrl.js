app.controller('shiftplanactualCtrl', shiftplanactualCtrl);
function shiftplanactualCtrl($rootScope, $scope, Restangular, ngTableParams, toaster, $translate, $element, $modal, $filter, userService, SweetAlert) {
    $rootScope.uService.EnterController("shiftplanactualCtrl");
    var shap = this;
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
        location.href = '#/app/specialoperations/shiftplanactualedit/' + $scope.SelectedItem;
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

    shap.tableParams = new ngTableParams({
        page: 1,
        count: 1000,
    },
        {
            getData: function ($defer, params) {
                $scope.isWaiting = true;
                Restangular.all('ShiftActual').getList({
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
                    toaster.pop('warning', "Sunucu Hatası", response.data.ExceptionMessage);
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
        Restangular.restangularizeElement('', item, 'ShiftActual')
        item.post().then(function (resp) {
            location.href = '#/app/specialoperations/shiftplanactualedit/' + resp.id;
        }, function (response) {
            toaster.pop('warning', "Sunucu Hatası", response.data.ExceptionMessage);
        });
    };

    $scope.removedata = function (SelectItem) {
        SweetAlert.swal({
            title: "EMİN MİSİNİZ ?",
            text: "Kaydı Silmek İstediğinize Emin misiniz ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Evet, Sil !",
            cancelButtonText: "Hayır, Silme !",
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                $scope.item.remove().then(function () {
                    SweetAlert.swal("Silindi.", "Kayıt Silindi.", "success");
                    //$location.path('app/inventory/inventoryadjust/list');
                });
            }
            else {
                SweetAlert.swal("İptal edildi !", "Silme İşlemi İptal edildi !", "error");
            }
        });
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: "EMİN MİSİNİZ ?",
            text: "Kaydı Silmek İstediğinize Emin misiniz ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Evet, Sil !",
            cancelButtonText: "Hayır, Silme !",
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (shap.tableParams.data[index].fromServer) {
                    shap.tableParams.data[index].remove();
                }
                shap.tableParams.data.splice(index, 1);
                toaster.pop("error", "Dikkat !", "Kayıt Silindi !");
            }
        });
    };

    //$scope.ShowObject = function (Container, idName, idvalue, resName) {
    //    for (var i = 0; i < $scope[Container].length; i++) {
    //        if ($scope[Container][i][idName] == idvalue)
    //            return $scope[Container][i][resName];
    //    }
    //    return idvalue || 'Not set';
    //};
    //$scope.loadEntities = function (EntityType, Container) {
    //    if (!$scope[Container].length) {
    //        Restangular.all(EntityType).getList({
    //            pageNo: 1,
    //            pageSize: 10000,
    //        }).then(function (result) {
    //            $scope[Container] = result;
    //        }, function (response) {
    //            toaster.pop('Warning', "Sunucu hatası", response.data.ExceptionMessage);
    //        });
    //    }
    //};
    //$scope.loadEntitiesCache = function (EntityType, Container) {
    //    if (!$scope[Container].length) {
    //        Restangular.all(EntityType).getList({}).then(function (result) {
    //            $scope[Container] = result;
    //        }, function (response) {
    //            toaster.pop('Warning', "Sunucu Hatası", response);
    //        });
    //    }
    //};
    //$scope.stores = [];
    //$scope.loadEntitiesCache('cache/store', 'stores');


    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("shiftplanactualCtrl");
    });
};
