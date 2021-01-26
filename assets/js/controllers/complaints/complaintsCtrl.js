app.controller('complaintsCtrl', complaintsCtrl);
function complaintsCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, callsService, userService, $element) {
    $rootScope.uService.EnterController("complaintsCtrl");
    var comp = this;
    $scope.ShowObject = true;
    $scope.translate = function () {
        $scope.trPerson = $translate.instant('main.PERSON');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trComplainStatus = $translate.instant('main.COMPLAINSTATUS');
        $scope.trComplaintType = $translate.instant('main.COMPLAINTTYPE');
        $scope.trComplaintSource = $translate.instant('main.COMPLAINTSOURCE');
        $scope.trComplaintSubject = $translate.instant('main.COMPLAINTSUBJECT');
        $scope.trComplaintReaction = $translate.instant('main.COMPLAINTREACTION');
        $scope.trComplaintConclusion = $translate.instant('main.COMPLAINTCONCLUSION');
        $scope.trIncidentDate = $translate.instant('main.INCIDENTDATE');
        $scope.trComplaintDate = $translate.instant('main.COMPLAINTDATE');
        $scope.trIncidentNotes = $translate.instant('main.INCIDENTNOTES');
        $scope.trComplaintNote = $translate.instant('main.COMPLAINTNOTE');
        $scope.trCustomerReacitonNotes = $translate.instant('main.CUSTOMERREACTIONNOTES');
        $scope.trConclusionNotes = $translate.instant('main.CONCLUSIONNOTES');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trOppenedByUser = $translate.instant('main.OPPENEDBYUSER');
        $scope.trClosedByUser = $translate.instant('main.CLOSEDBYUSER');
        $scope.selectstore = $translate.instant('main.SELECTSTORE');
        $scope.selectcomplaintstatus = $translate.instant('main.SELECTCOMPLAINTSTATUS');

    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    if (userService.userIsInRole("Admin") || userService.userIsInRole("CCMANAGER") ||  userService.userIsInRole("CCBACKOFFICE") || userService.userIsInRole("CMRESTORANHATTI") || userService.userIsInRole("LC") || userService.userIsInRole("AREAMANAGER") || userService.userIsInRole("ACCOUNTING") || userService.userIsInRole("PH") || userService.userIsInRole("MarketingDepartment") || userService.userIsInRole("PHAdmin") || userService.userIsInRole("OperationDepartment") || userService.userIsInRole("FinanceDepartment") || userService.userIsInRole("PHAdmin")) {
        $scope.StoreID = '';
        $scope.ShowStores = true;
    } else {
        $scope.StoreID = $rootScope.user.StoreID;
    }
    if (userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CCMANAGER") || userService.userIsInRole("CMRESTORANHATTI")|| userService.userIsInRole("CCBACKOFFICE")) {
        Restangular.all('callreason').getList({
            pageNo: 1,
            pageSize: 1000,
            search: "CallReasonType='" + 4 + "'"
        }).then(function (result) {
            callsService.SetCurrentCallType(result[0].id);
        });
    }
    $scope.ComplaintStatusID = "ComplaintStatusID = 0";
    $scope.BuildSearchString = function (src) {
        var result = [];
        if ($rootScope.user.UserRole.Name != "CALLCENTER" && $rootScope.user.UserRole.Name != "CCMANAGER" && $rootScope.user.UserRole.Name != "LC" && $rootScope.user.UserRole.Name != "Admin" && $rootScope.user.UserRole.Name != "PHAdmin" && $rootScope.user.StoreID)
            result.push("StoreID=" + $rootScope.user.StoreID + "");
        if (comp.search && comp.search.length > 1)
            result.push("Persons.name like '%" + comp.search + "%'");
        result.push($scope.ComplaintStatusID);
        if ($scope.StoreID)
            result.push("StoreID=" + $scope.StoreID + "");
        return result;
    };
    $scope.SelectItem = function (id) {
        location.href = '#/app/complaints/complaints/edit/' + id;
    };
    $scope.item = {};
    comp.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
 {
     getData: function ($defer, params) {
         $scope.ShowObject = true;
         Restangular.all('complaint').getList({
             pageNo: params.page(),
             pageSize: params.count(),
             sort: params.orderBy(),
             search: $scope.BuildSearchString(),
         }).then(function (items) {
             params.total(items.paging.totalRecordCount);
             $defer.resolve(items);
             $scope.ShowObject = false;
         }, function (response) {
             toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
             $scope.ShowObject = false;
         });
     }
 });
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.GetStore = function (data) {
        $scope.StoreID = data;
        comp.tableParams.reload();
    }
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
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    var deregistrwatch1 = $scope.$watch(angular.bind(comp, function () {
        return $scope.ComplaintStatusID;
    }), function (value) {
        comp.tableParams.reload();
    });
    var deregistrwatch2 = $scope.$watch(angular.bind(comp, function () {
        return comp.search;
    }), function (value) {
        comp.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistrwatch1();
        deregistrwatch2();
        $element.remove();
        $rootScope.uService.ExitController("complaintactionsCtrl");
    });
};