app.controller('surveypopupCtrl', surveypopupCtrl);
function surveypopupCtrl($scope, Restangular, item, $modal, ngTableParams, toaster, $window, $rootScope, $location, $translate, $modalInstance, userService, $filter, ngnotifyService) {
    $rootScope.uService.EnterController("surveypopupCtrl");
    $scope.item = {};
    $scope.surveyresults = [];
    $scope.points = [{ point: 1 }, { point: 2 }, { point: 3 }, { point: 4 }, { point: 5 }, { point: 6 }, { point: 7 }, { point: 8 }, { point: 9 }, { point: 10 }];
    $scope.showsurvey = false;
    $scope.translate = function () {
        $scope.trSurveyType = $translate.instant('main.SURVEYTYPE');
        $scope.trSMSApproved = $translate.instant('main.SMSAPPROVED');
        $scope.trEmailApproved = $translate.instant('main.EMAILAPPROVED');
        $scope.trKVKKApproved = $translate.instant('main.KVKAPPROVED');
        $scope.trSurveyDate = $translate.instant('main.SURVEYDATE');
        $scope.trNotes = $translate.instant('main.NOTES');
        $scope.trLastOrder = $translate.instant('main.LASTORDER');
        $scope.trOrderID = $translate.instant('main.ORDERID');
        $scope.trOrderDate = $translate.instant('main.ORDERDATE');
        $scope.trOrderAmount = $translate.instant('main.ORDERAMOUNT');
        $scope.trOrderPoint = $translate.instant('main.ORDERPOINT');
        $scope.result = $translate.instant('main.RESULT');
    };
    $scope.translate();
    var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.GetMarketingPermission = function (PersonID) {
        Restangular.all('MarketingPermission').getList({
            pageNo: 1,
            pageSize: 10,
            search: "PersonID='" + item + "'"
        }).then(function (result) {
            $scope.ShowMarketinPermission = true;
            $scope.MPSMS = {};
            $scope.MPEMAIL = {};
            $scope.MPKVKK = {};
            for (var i = 0; i < result.length; i++) {
                if (result[i].MarketingPermissionType == 0)
                    $scope.item.SMSApproved = result[i].Approved;
                if (result[i].MarketingPermissionType == 1)
                    $scope.item.EmailApproved = result[i].Approved;
                if (result[i].MarketingPermissionType == 2)
                    $scope.item.KVKApproved = result[i].Approved;
            }
        });
    };
    $scope.GetMarketingPermission();
    $scope.SaveMarketingPermission = function (Type, Value) {
        if (Type == 0) {
            $scope.item.SMSApproved = Value;
        }
        if (Type == 1) {
            $scope.item.EmailApproved = Value;
        }
        if (Type == 2) {
            $scope.item.KVKApproved = Value;
        }
    };
    $scope.SaveData = function (data) {
        $scope.item.SurveyTypeID = 0;
        $scope.item.SurveySourceID = 0;
        $scope.item.PersonID = item;
        $scope.item.SurveyDate = new Date();
        $scope.item.OrderID = $scope.PersonOrders.id;
        $scope.item.UserID = $rootScope.user.id;
        Restangular.restangularizeElement('', $scope.item, 'personsurvey')
        $scope.item.post().then(function (resp) {
            toaster.pop("success",$translate.instant('personfile.DataSaved'), $translate.instant('orderfile.Saved'));
            $scope.tableParams.reload();
            $scope.ok();
        }, function (response) {
            toaster.pop('Warning',  $translate.instant('personfile.AproblemhasoccurredTryAgain '), response);
        });
    };
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    }, {
            getData: function ($defer, params) {
                Restangular.all('personsurvey').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: "PersonID='" + item + "'"
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        });

    $scope.changecombobox = function (itemID) {
        $scope.showsurvey = false;
        $scope.showsurveynote = false;
        $scope.showsurveydetail = false;
        for (var j = 0; j < $scope.surveyresults.length; j++) {
            if ($scope.surveyresults[j].id == itemID) {
                if ($scope.surveyresults[j].UpdateMarketingPermissions == true) {
                    $scope.showsurveynote = true;
                    $scope.showsurvey = true;
                } else {
                    $scope.showsurveynote = true;
                    $scope.showsurvey = false;
                }
            }
        }
        $scope.showsurveydetail = true;
    };
    $scope.GetCombobox = function (data) {
        $scope.showsurvey = false;
        $scope.showsurveynote = false;
        $scope.showsurveydetail = false;
        $scope.showcombobox = false;
        $scope.surveyresults = [];
        if (data == 'REACHED') {
            for (var i = 0; i < $scope.surveyresult.length; i++) {
                if ($scope.surveyresult[i].isReached == true) {
                    $scope.surveyresults.push($scope.surveyresult[i]);
                }
            }
            $scope.showcombobox = true;
        }
        if (data == 'NOTREACHED') {
            for (var i = 0; i < $scope.surveyresult.length; i++) {
                if ($scope.surveyresult[i].isReached == false) {
                    $scope.surveyresults.push($scope.surveyresult[i]);
                }
            }
            $scope.showcombobox = true;
        }
    };
    $scope.BuildSearchString = function (src) {
        var result = [];

        if (item) {
            result.push("OrderPersons.PersonID='" + item + "'");
            result.push("OrderStateID=10");
            result.push("OrderTypeID = 2");
            result.push("OrderTypeID = 7");
            return result;
        }
    };
    $scope.GetPersonOrders = function () {
        if (item) {
            Restangular.all('order').getList({
                sort: "-OrderDate",
                search: $scope.BuildSearchString(),
            }).then(function (result) {
                $scope.PersonOrders = angular.copy(result[0]);
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        } else {
            $scope.PersonOrders = null;
        }
    };
    $scope.GetPersonOrders();
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.surveyresult = [];
    $scope.loadEntitiesCache('cache/surveyresults', 'surveyresult');
    $scope.ok = function () {
        $modalInstance.close($scope.item.PersonPhone);
    };
    $scope.cancel = function () {
        $modalInstance.close($scope.item.PersonPhone);
    };
    $scope.$on('$destroy', function () {
        tranlatelistener();
        $rootScope.uService.ExitController("surveypopupCtrl");
    });
};