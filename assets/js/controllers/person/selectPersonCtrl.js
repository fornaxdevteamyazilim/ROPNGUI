app.controller('selectPersonCtrl', selectPersonCtrl);
function selectPersonCtrl($rootScope, $scope, $modalInstance, $translate, Restangular, ngTableParams, $filter, searchname, searchphone, $log, $window) {
    $rootScope.uService.EnterController("selectPersonCtrl");
    $scope.SelectedItem = null;
    $scope.ShowDetail = false;
    $scope.searchName = (searchname) ? searchname : '';
    $scope.searchPhone = (searchphone) ? searchphone : '';

    $scope.SelectItem = function (data) {
        $scope.person = data;
        $scope.ok();
    };
    $scope.GetSearchString = function () {
        var SearchFilter = ($scope.searchName && $scope.searchName.length > 0) ? "name  like '" + $scope.searchName + "%'" : "";
        if ($scope.searchPhone && $scope.searchPhone.length > 0) {
            SearchFilter = SearchFilter + ((SearchFilter.length > 0) ? " and " : "");
            SearchFilter = SearchFilter + "Number  like '%" + $scope.searchPhone + "%'"
        }
        return SearchFilter;
    }
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10
    },
      {
          counts: [],
          getData: function ($defer, params) {
              if ($scope.searchName == '' && $scope.searchPhone == '') {
                  $defer.resolve(null);
                  return;
              }
              Restangular.all('person').getList({
                  pageNo: params.page(),
                  pageSize: params.count(),
                  search: $scope.GetSearchString(),
                  sort: params.orderBy()
              }).then(function (items) {
                  params.total(items.paging.totalRecordCount);
                  $scope.SelectedItem = items.length > 0 ? items[0].id : null;
                  $defer.resolve(items);
                  $scope.isSearching(false);
              }, function (response) {
                  toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
              });
          }

      });

    $scope.FormKeyPress = function (event) {
        if (event.keyCode === 13) {
            $scope.isSearching(true);
            $scope.tableParams.reload();
        }
    };
    $scope.ShowArray = function (emails, prop) {
        var result = _.pluck(emails, prop);
        return result.toString();
    }
    $scope.$on('$destroy', function() {
        unbindWatcher();
        unbindWatcher2();
        $rootScope.uService.ExitController("selectPersonCtrl");
    });
    $scope.ok = function () {
        $modalInstance.close($scope.person);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};