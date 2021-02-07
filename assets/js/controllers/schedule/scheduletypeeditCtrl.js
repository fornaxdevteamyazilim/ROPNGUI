'use strict';
app.controller('scheduletypeeditCtrl', scheduletypeeditCtrl);
function scheduletypeeditCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element) {
    $rootScope.uService.EnterController("scheduletypeeditCtrl");
    var st = this;
    $scope.translate = function () {
        $scope.trStartTime = $translate.instant('main.STARTTIME');
        $scope.trEndTime = $translate.instant('main.ENDTIME');
        $scope.trWeekdays = $translate.instant('main.WEEKDAYS');
        $scope.trStartDate = $translate.instant('main.STARTDATE');
        $scope.trEndDate = $translate.instant('main.ENDDATE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration =  $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });

    $scope.item = {};
    $scope.Back = function () {
        $window.history.back();
    };
    $rootScope.ScheduleTypeID = null;
    if ($stateParams.id != 'new') {
        Restangular.one('scheduletype', $stateParams.id).get().then
            (function (restresult) {
                $scope.original = restresult;
                $scope.item = Restangular.copy(restresult);
                $rootScope.ScheduleTypeID = restresult.id;
            },
           function (restresult) {
               toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
               swal("error!", $translate.instant('Server.DataError'), "Warning");
           }
           )
    }
    $scope.saveData = function () {
        if ($scope.item.restangularized && $scope.item.id) {
            $scope.item.put().
                then(function (resp) {
                    $rootScope.ScheduleTypeID = resp.id;
                    swal($translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'), "success");
                });
        }
        else {
            Restangular.restangularizeElement('', $scope.item, 'scheduletype')
            $scope.item.post().then(function (resp) {
                $scope.item.id = resp.id;
                $rootScope.ScheduleTypeID = resp.id;
                swal($translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'), "success");
            });
        }
    }
    $scope.isClean = function () {
        return angular.equals($scope.original, $scope.item);
    }
    st.search = '';
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
                    SweetAlert.swal("Delete.", "Record Deleted.", "success");
                    $location.path('app/schedule/scheduletypes/list');
                });
            }
            else {
                SweetAlert.swal($translate.instant('orderfile.Cancelled'),$translate.instant('orderfile.DeletionCanceled'), "error");
            }
        });
    };
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
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("scheduletypeeditCtrl");
    });
};
app.controller('scheduletypetimerangesCtrl', scheduletypetimerangesCtrl);
function scheduletypetimerangesCtrl($scope, $log, $filter, SweetAlert, Restangular, ngTableParams, toaster, $translate, $window, $stateParams, $rootScope, $location, ngnotifyService, $element) {
    $rootScope.uService.EnterController("scheduletypetimerangesCtrl");
    var sttr = this;
    $scope.date = $filter('date')(ngnotifyService.ServerTime(), 'HH:mm');
    $scope.saveData = function (item) {
        if (this.item.restangularized && item.id) {
            this.item.put().then(function (resp) {
                resp.StartTime = $filter('date')(resp.StartTime, 'HH:mm');
                resp.EndTime = $filter('date')(resp.EndTime, 'HH:mm');
                sttr.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', item, 'scheduletypetimerange')
            this.item.post().then(function (resp) {
                resp.StartTime = $filter('date')(resp.StartTime, 'HH:mm');
                resp.EndTime = $filter('date')(resp.EndTime, 'HH:mm');
                sttr.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
            });
            this.item.get();
        }
    }
    $scope.GetScheduleTypeID = function () {
        return $rootScope.ScheduleTypeID;
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
        if (!sttr.tableParams.data[sttr.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(sttr.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    sttr.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {

        }
    },
    {
        getData: function ($defer, params) {
            Restangular.all('scheduletypetimerange').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "ScheduleTypeID='" + $scope.GetScheduleTypeID() + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                  toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.removeItem = function (index) {
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
                if (sttr.tableParams.data[index].fromServer) {
                    sttr.tableParams.data[index].remove();
                }
                sttr.tableParams.data.splice(index, 1);
                 toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));;
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (sttr.tableParams.data[index].fromServer) {
            sttr.tableParams.data[index].remove();
        }
        sttr.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        sttr.tableParams.data.push({ ScheduleTypeID: $scope.GetScheduleTypeID(), StartTime: $scope.date, EndTime: $scope.date });
    };
    var deregistration = $scope.$watch(angular.bind($rootScope, function () {
        return $rootScope.ScheduleTypeID;
    }), function (value) {
        sttr.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("scheduletypetimerangesCtrl");
    });
};
app.controller('scheduletypeweekdayCtrl', scheduletypeweekdayCtrl);
function scheduletypeweekdayCtrl($scope, $log, $filter, SweetAlert, Restangular, $translate, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $element) {
    $rootScope.uService.EnterController("scheduletypeweekdayCtrl");
    var stw = this;
    $scope.item = {};
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                stw.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'scheduletypeweekday')
            this.item.post().then(function (res) {
                stw.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
            });
            this.item.get();
        }
    }
    $scope.GetScheduleTypeID = function () {
        return $rootScope.ScheduleTypeID;
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
        if (!stw.tableParams.data[stw.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(stw.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    stw.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
    {
        getData: function ($defer, params) {
            Restangular.all('scheduletypeweekday').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "ScheduleTypeID='" + $scope.GetScheduleTypeID() + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                  toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
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
    }
    $scope.weekdays = [];
    $scope.loadEntities('enums/weekdays', 'weekdays');
    $scope.removeItem = function (index) {
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
                if (stw.tableParams.data[index].fromServer) {
                    stw.tableParams.data[index].remove();
                }
                stw.tableParams.data.splice(index, 1);
                 toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));;
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (stw.tableParams.data[index].fromServer) {
            stw.tableParams.data[index].remove();
        }
        stw.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        stw.tableParams.data.push({ ScheduleTypeID: $scope.GetScheduleTypeID() });
    };
    var deregistration =  $scope.$watch(angular.bind($rootScope, function () {
        return $rootScope.ScheduleTypeID;
    }), function (value) {
        stw.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("scheduletypeweekdayCtrl");
    });
};
app.controller('scheduletypedaterangeCtrl', scheduletypedaterangeCtrl);
function scheduletypedaterangeCtrl($scope, $modal, $log, $filter, SweetAlert, Restangular, $translate, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $element) {
    $rootScope.uService.EnterController("scheduletypedaterangeCtrl");
    var stdr = this;
    $scope.item = {};
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                stdr.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'scheduletypedaterange')
            this.item.post().then(function (res) {
                stdr.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
            });
            this.item.get();
        }
    }
    $scope.GetScheduleTypeID = function () {
        return $rootScope.ScheduleTypeID;
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
        if (!stdr.tableParams.data[stdr.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(stdr.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    stdr.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
    {
        getData: function ($defer, params) {
            Restangular.all('scheduletypedaterange').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "ScheduleTypeID='" + $scope.GetScheduleTypeID() + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                  toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.removeItem = function (index) {
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
                if (stdr.tableParams.data[index].fromServer) {
                    stdr.tableParams.data[index].remove();
                }
                stdr.tableParams.data.splice(index, 1);
                 toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));;
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (stdr.tableParams.data[index].fromServer) {
            stdr.tableParams.data[index].remove();
        }
        stdr.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        stdr.tableParams.data.push({ ScheduleTypeID: $scope.GetScheduleTypeID() });
    };
    $scope.datepopupStartDate = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.StartDate;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.StartDate = result;
        })
    };
    $scope.datepopupEndDate = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.EndDate;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.EndDate = result;
        })
    };
    var deregistration = $scope.$watch(angular.bind($rootScope, function () {
        return $rootScope.ScheduleTypeID;
    }), function (value) {
        stdr.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("scheduletypedaterangeCtrl");
    });
};

