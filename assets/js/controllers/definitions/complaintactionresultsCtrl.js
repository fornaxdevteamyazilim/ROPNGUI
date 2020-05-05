app.controller('complaintactionresultsCtrl', complaintactionresultsCtrl);
function complaintactionresultsCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, callsService, userService, $element) {
    $rootScope.uService.EnterController("complaintactionresultsCtrl");
    var car = this;
    car.search = '';
    $scope.CallReason = function (type) {
        if (userService.userIsInRole("CALLCENTER")) {
                Restangular.all('callreason').getList({
                    pageNo: 1,
                    pageSize: 1000,
                    search: "CallReasonType='" + type + "'"
                }).then(function (result) {
                    callsService.SetCurrentCallType(result[0].id);
                });
        }
    };
    $scope.translate = function () {
        $scope.trName = $translate.instant('main.NAME');
        $scope.trCommands = $translate.instant('main.COMMANDS');

    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.translate();
    $scope.item = {};
    car.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            name:'asc'
        }
    },
 {
     getData: function ($defer, params) {
         Restangular.all('complaintactionresult').getList({
             pageNo: params.page(),
             pageSize: params.count(),
             search: (car.search) ? "Name like '%" + car.search + "%'" : "",
             sort: params.orderBy(),
         }).then(function (items) {
             params.total(items.paging.totalRecordCount);
             $defer.resolve(items);
         }, function (response) {
             toaster.pop('warning', "Sunucu Hatası", response.data.ExceptionMessage);
         });
     }
 });
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                $scope.CallReason(4);
                car.tableParams.reload();
                toaster.pop('success', "Güncellendi.", 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'complaintactionresult')
            data.post().then(function (res) {
                $scope.CallReason(4);
                car.tableParams.reload();
                toaster.pop('success', "Kaydedildi.", 'Saved.');
            });
            data.get();
        }
    };
    $scope.FormKeyPress = function (event, rowform, data, index) {
        if (event.keyCode === 13 && rowform.$visible) {
            rowform.$submit();
            return data;
        }
        if (event.keyCode === 27 && rowform.$visible) {
            $scope.cancelForm(rowform);
        }
    };
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!car.tableParams.data[car.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(car.tableParams.data.length - 1, 1);
            toaster.pop('warning', "İptal edildi !", 'Insert cancelled !');
        } else {
            toaster.pop('warning', "İptal edildi !", 'Edit cancelled !');
        }
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
                if (car.tableParams.data[index].fromServer) {
                    car.tableParams.data[index].remove();
                }
                car.tableParams.data.splice(index, 1);
                toaster.pop("error", "Dikkat !", "Kayıt Silindi !");
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (car.tableParams.data[index].fromServer) {
            car.tableParams.data[index].remove();
        }
        car.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        car.tableParams.data.push({});
    };
    var deregistration1 = $scope.$watch(angular.bind(car, function () {
        return car.search;
    }), function (value) {
        car.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("complaintactionresultsCtrl");
    });
};
