﻿app.controller('usermainCtrl', usermainCtrl);
function usermainCtrl($rootScope, $scope, $window, $stateParams, Restangular, SweetAlert, ngTableParams, toaster, $location, $element, $modal, userService) {
    $rootScope.uService.EnterController("usermainCtrl");
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.saveData = function (data) {
        Restangular.restangularizeElement('', data, 'user');
        if (data.Password || (!data.Password && userService.isAdmin())) {
            if (data.restangularized && data.id) {
                data.put().then(function (res) {
                    toaster.pop('success', $translate.instant('orderfile.Updated'), 'Updated.');
                });
            }
            else {
                Restangular.restangularizeElement('', data, 'user')
                data.post().then(function (res) {
                    toaster.pop('success', $translate.instant('orderfile.Saved'), 'Saved.');
                }, function (response) {
                    toaster.pop('error', "Server Error", response.data.ExceptionMessage);
                });
            }
        } else {
            toaster.pop('warning',$translate.instant('userfile.Sorry'), $translate.instant('userfile.EnterPassword'));
        }
    };
    if ($stateParams.id != 'new') {
        Restangular.one('user', $stateParams.id).get().then
            (function (restresult) {
                $scope.original = restresult;
                $scope.item = Restangular.copy(restresult);
            },
           function (restresult) {
               toaster.pop('warning', $translate.instant('orderfile.Cancelled'), 'Edit cancelled !');
               swal("Error!", "Data Error!", "Warning");
           }
           )
    }
    $scope.CheckFingerPrint = function () {
        Restangular.all('NGUserFingerPrint').getList({
            search: 'NGUserID=' + $stateParams.id
        }).then(function (result) {
            $scope.fingerPrintExists = result.length;
        }, function (response) {
            toaster.pop('error', "Server Error", response.data.ExceptionMessage);
        });
    }
    $scope.deleteFingerPrint = function () {
        Restangular.all('user/deletefingerprints').getList({
            UserID: $stateParams.id
        }).then(function (result) {
            toaster.pop('success', $translate.instant('orderfile.Deleted'), 'Deleted.');
        }, function (response) {
            toaster.pop('error', "Server Error", response.data.ExceptionMessage);
        });
    }
    $scope.CheckFingerPrint();
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', "Server Error", response);
            });
        }
    };
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', "Server Error", response);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.nguserroles = [];
    $scope.loadEntities('nguserrole', 'nguserroles');
    $scope.staffpositions = [];
    $scope.loadEntities('staffposition', 'staffpositions');
        $scope.quitreasons = [];
        $scope.loadEntities('quitreason', 'quitreasons');
        $scope.trainings = [];
        $scope.loadEntities('training', 'trainings');
        $scope.laborcosttypes = [];
        $scope.loadEntities('laborcosttype', 'laborcosttypes');


        $scope.datepopupTrainingDate = function (item) {
            var modalInstance = $modal.open({
                templateUrl: 'assets/views/Tools/date.html',
                controller: 'dateCtrl',
                size: '',
                backdrop: '',
                resolve: {
                    DateTime: function () {
                        return item.TrainingDate;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                item.TrainingDate = result;
            })
        };

    var deregistration = $scope.$on('LoadUserRole', function () {
        $scope.$broadcast('ChangeUserRoles', 'Reload');
    });
    var deregistration1 = $scope.$on('DeleteUserRoles', function () {
        $scope.$broadcast('DeleteLoadUserRoles', 'Reload');
    });
    var deregistration2 = $scope.$on('LoadUserRestrictions', function () {
        $scope.$broadcast('ChangeUserRestrictions', 'Reload');
    });
    $scope.removedata = function (SelectItem) {
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
                $scope.item.remove().then(function () {
                    SweetAlert.swal($translate.instant('orderfile.Deleted'),  $translate.instant('orderfile.RecordDeleted'), "success");
                    $location.path('app/users/userlist');
                }, function (response) {
                    toaster.pop('error', "Server Error", response.data.ExceptionMessage);
                });
            }
            else {
                SweetAlert.swal($translate.instant('orderfile.Cancelled'),  $translate.instant('orderfile.DeletionCanceled'), "error");
            }
        });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        deregistration2();
        $element.remove();
        $rootScope.uService.ExitController("usermainCtrl");
    });
};
