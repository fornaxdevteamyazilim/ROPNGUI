'use strict';
app.controller('scheduleeditCtrl', scheduleeditCtrl);
function scheduleeditCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("scheduleeditCtrl");
    var si = this;
    $scope.translate = function () {
        $scope.trScheduleType = $translate.instant('main.SCHEDULETYPE');
        $scope.trScheduleItemOperation = $translate.instant('main.SCHEDULEITEMOPERATION');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });

    $scope.Back = function () {
        $window.history.back();
    };
    $scope.item = {};
    $scope.ScheduleID = $stateParams.id;
    if ($stateParams.id != 'new')
        Restangular.one('schedule', $stateParams.id).get().then
         (function (restresult) {
             $scope.original = restresult;
             $scope.item = Restangular.copy(restresult);
         })
    else {
        $scope.item = {};
    }
    $scope.SaveData = function () {
        $scope.item.items = si.tableParams.data;
        if ($scope.item.restangularized && $scope.item.id) {
            $scope.item.put().then(function (resp) {
               swal($translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'), "success");
                $scope.ScheduleID = resp.id;
            });
        }
        else {
            Restangular.restangularizeElement('', $scope.item, 'schedule')
            $scope.item.post().then(function (resp) {
                $scope.item.id = resp.id;
                swal($translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'), "success");
                $scope.ScheduleID = resp.id;
            });
        }
    }
    $scope.UpdateData = function (data) {
        if (data.restangularized) {
            data.put().then(function (res) {
                si.tableParams.reload();
               swal($translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'), "success");

            });
        }
        else {
            Restangular.restangularizeElement('', data, 'scheduleitem')
            data.post().then(function (res) {
                si.tableParams.reload();
                swal($translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'), "success");

            });
        }
    }
    $scope.saveItem = function (data) {
        _update(data, this.item);
        $scope.UpdateData(this.item);
        return this.item;
    }
    $scope.savetoaster = function () {
        toaster.pop('success',$translate.instant('orderfile.DataAdded'),$translate.instant('orderfile.Saveddata'));
    }
    function _update(srcObj, destObj) {
        for (var key in srcObj) {
            if (destObj.hasOwnProperty(key) && srcObj.hasOwnProperty(key)) {
                destObj[key] = (srcObj[key] != undefined) ? srcObj[key] : '';
            }
            if (!destObj.hasOwnProperty(key) && srcObj.hasOwnProperty(key)) {
                destObj[key] = (srcObj[key] != undefined) ? srcObj[key] : '';
            }
        }
    }
    $scope.isClean = function () {
        return angular.equals($scope.original, $scope.item);
    }
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
        if (!si.tableParams.data[si.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(si.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled') );
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        }
    };
    si.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    },
   {
       getData: function ($defer, params) {
           Restangular.all('scheduleitem').getList({
               pageNo: params.page(),
               pageSize: params.count(),
               sort: params.orderBy(),
               search: "ScheduleID='" + $scope.ScheduleID + "'"
           }).then(function (items) {
               params.total(items.paging.totalRecordCount);

               $defer.resolve(items);
           }, function (response) {
               toaster.pop('warning', $translate.instant('Server.ServerError'), response);
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
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.scheduletypes = [];
    $scope.loadEntities('scheduletype', 'scheduletypes');
    $scope.scheduleitemoperations = [];
    $scope.loadEntities('enums/scheduleitemoperation', 'scheduleitemoperations');
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
                    $location.path('app/schedule/schedule/list');
                });
            }
            else {
                SweetAlert.swal( $translate.instant('orderfile.Cancelled'), $translate.instant('orderfile.DeletionCanceled'), "error");
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
                if (si.tableParams.data[index].fromServer) {
                    si.tableParams.data[index].remove();
                }
                si.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (si.tableParams.data[index].fromServer) {
            si.tableParams.data[index].remove();
        }
        si.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        si.tableParams.data.push({ ScheduleID: $scope.ScheduleID });
    };
    var deregistration1 = $scope.$watch(angular.bind(si, function () {
        return $scope.ScheduleID;
    }), function (value) {
        si.tableParams.reload();
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
        }, function () {
        });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("scheduleeditCtrl");
    });
};

