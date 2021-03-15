app.controller('companyCtrl', companyCtrl);
function companyCtrl($rootScope, $scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $translate, $element) {
    $rootScope.uService.EnterController("companyCtrl");
    var vm = this;
    $scope.objectType = 'company';
    $scope.SelectedItem = null;
    vm.search = '';
    $scope.translate = function () {
        $scope.trCompanyName = $translate.instant('main.COMPANYNAME');
        $scope.trCompanyNotes = $translate.instant('main.COMPANYNOTES');
        $scope.trCompanyTaxOffice = $translate.instant('main.COMPANYTAXOFFICE');
        $scope.trCompanyTaxNumber = $translate.instant('main.COMPANYTAXNUMBER');
        $scope.trCompanyContactPerson = $translate.instant('main.COMPANYCONTACTPERSON');
        $scope.trCompanyPhone = $translate.instant('main.COMPANYPHONE');
        $scope.trCompanyFax = $translate.instant('main.COMPANYFAX');
        $scope.trCompanyEmail = $translate.instant('main.COMPANYEMAIL');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trCompanyItemCode = $translate.instant('main.COMPANYITEMCODE');
        $scope.trisActiveValue = $translate.instant('main.COMPANYSTATE');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/definitions/companyedit/' + $scope.SelectedItem;
    };
    vm.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            name: 'asc'
        }
    },
    {
        getData: function ($defer, params) {
            Restangular.all($scope.objectType).getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: (vm.search) ? "Name like '%" + vm.search + "%'" : "",
                sort: params.orderBy()
            }).then(function (items) {
                if (items && items.length > 0) {
                    params.total(items.paging.totalRecordCount);
                    $scope.SelectedItem = items[0].id;
                    $defer.resolve(items);
                }               
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.open = function (ObjectID) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tags/ObjectTagEditModalContent.html',
            controller: 'TagModalCtrl',
            size: '',
            backdrop: '',
            resolve: {
                ObjectID: function () {
                    return ObjectID;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.result = selectedItem;
        });
    };
     var deregistration1 = $scope.$watch(angular.bind(vm, function () {
        return vm.search;
    }), function (value) {
        vm.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("companyCtrl");
    });
};
