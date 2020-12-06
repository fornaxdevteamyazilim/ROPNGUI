app.controller('complainteditCtrl', complainteditCtrl);
function complainteditCtrl($rootScope, $scope, $modal, $log, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, callsService, userService, $element) {
    $rootScope.uService.EnterController("complainteditCtrl");
    var vm = this;
    $scope.item = {};
    $scope.CallReason = function (type) {
        if (userService.userIsInRole("CALLCENTER")|| userService.userIsInRole("CCBACKOFFICE")|| userService.userIsInRole("CMRESTORANHATTI")) {
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
        $scope.trComplainActionResult = $translate.instant('main.COMPLAINTACTIONRESULT');
        $scope.trNotes = $translate.instant('main.NOTE');
        $scope.trActionDate = $translate.instant('main.ACTIONDATE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    if ($stateParams.id != 'new')
        Restangular.one('complaint', $stateParams.id).get().then
            (function (restresult) {
                $scope.original = restresult;
                $scope.item = Restangular.copy(restresult);
            })
    else {
        $scope.item = {};
        if ($rootScope.Order) {
            $scope.OrderNumber = angular.copy($rootScope.Order.OrderNumber);
            $scope.item.IncidentDate = $filter('date')(angular.copy($rootScope.Order.OrderDate), 'yyyy-MM-dd HH:mm:ss');
            $scope.item.ComplaintDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
        }
        else {
            $scope.item.IncidentDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $scope.item.ComplaintDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
        }
    }
    $scope.ButtonActive = true;
    $scope.isActiveButton = function (value) {
        $scope.ButtonActive = value;
    };
    $scope.saveData = function (data) {
        $scope.isActiveButton(false);
        if ($rootScope.Order) {
            data.StoreID = angular.copy($rootScope.Order.StoreID);
            data.OrderID = angular.copy($rootScope.Order.id);
            data.PersonID = angular.copy($rootScope.PersonID);
        }
        else {
            if ($rootScope.PersonID) {
                data.PersonID = angular.copy($rootScope.PersonID);
            }
            else {
                toaster.pop('error',$translate.instant('accounting.InvalidRegistration') );
            }
        }
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                $scope.CallReason(4);
                toaster.pop('success',  $translate.instant('accounting.Updated'),$translate.instant('accounting.Updated'));
                $scope.isActiveButton(true);
            }, function (response) {
                $scope.isActiveButton(true);
                toaster.pop('error', $translate.instant('accounting.RegistrationRealized'), response.data.ExceptionMessage);
            });
        }
        else {
            data.ComplaintStatusID = 0;
            Restangular.restangularizeElement('', data, 'complaint')
            data.post().then(function (res) {
                $scope.CallReason(4);
                toaster.pop('success', $translate.instant('accounting.Saved') ,$translate.instant('accounting.Saved'));
                $scope.isActiveButton(true);
                $location.path('app/complaints/complaints/list');
            }, function (response) {
                $scope.isActiveButton(true);
                toaster.pop('error',$translate.instant('accounting.RegistrationRealized'), response.data.ExceptionMessage);
            });
            data.get();
        }
    };
    var deregistration2 = $scope.$on('ComplaintAction', function (event, data) {
        $scope.ComplaintActions = data;
    });
    $scope.closecomplaint = function (data) {
        data.ComplaintStatusID = 1;
        Restangular.restangularizeElement('', data, 'complaint')
        data.put().then(function (res) {
            toaster.pop('success',$translate.instant('accounting.Updated'), $translate.instant('accounting.Updated'));
            $location.path('app/complaints/complaints/list');
        });
    }
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.isClean = function () {
        return angular.equals($scope.original, $scope.item);
    }
    vm.search = '';
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
        if (!vm.tableParams.data[vm.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(vm.tableParams.data.length - 1, 1);
            toaster.pop('warning',  $translate.instant('accounting.Cancelled'), $translate.instant('accounting.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('accounting.Cancelled'), $translate.instant('accounting.Editcancelled')
            );
        }
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.complaintstatuses = [];
    $scope.loadEntities('enums/complaintstatus', 'complaintstatuses');
    $scope.complainttypes = [];
    $scope.loadEntities('enums/complainttype', 'complainttypes');
    $scope.complaintconclusions = [];
    $scope.loadEntities('enums/complaintconclusion', 'complaintconclusions');
    $scope.complaintsources = [];
    $scope.loadEntities('complaintsource', 'complaintsources');
    $scope.complaintsubjects = [];
    $scope.loadEntities('complaintsubject', 'complaintsubjects');
    $scope.complaintreactions = [];
    $scope.loadEntities('complaintreaction', 'complaintreactions');
    $scope.complaintrelations = [];
    $scope.loadEntities('complaintrelation', 'complaintrelations');
    $scope.removedata = function (SelectItem) {
        SweetAlert.swal({
            title:  $translate.instant('accounting.Sure') ,
            text:  $translate.instant('accounting.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:    $translate.instant('accounting.confirmButtonText'),
            cancelButtonText:   $translate.instant('accounting.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                $scope.item.remove().then(function () {
                    SweetAlert.swal( $translate.instant('accounting.Deleted'),  $translate.instant('accounting.RecordDeleted'), "success");
                    $location.path('app/complaints/complaints/list');
                });
            }
            else {
                SweetAlert.swal( $translate.instant('accounting.Cancelled'), $translate.instant('accounting.DeletionCanceled'), "error");
            }
        });
    };
    $scope.ComplaintDatePopup = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.ComplaintDate = result;
        })
    };
    $scope.IncidentDatePopup = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.IncidentDate = result;
        })
    };
    $scope.$on('$destroy', function () {
        $rootScope.Order = '';
        $rootScope.PersonID = null;
        deregistration();
        deregistration2();
        $element.remove();
        $rootScope.uService.ExitController("complainteditCtrl");
    });
};
app.controller('complaintactionsCtrl', complaintactionsCtrl);
function complaintactionsCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, callsService, userService, $element) {
    $rootScope.uService.EnterController("complaintactionsCtrl");
    var car = this;
    $scope.item = {};
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
    $scope.ComplaintID = $stateParams.id;
    if ($stateParams.id != 'new')
        Restangular.one('complaint', $stateParams.id).get().then
            (function (restresult) {
                $scope.original = restresult;
                $scope.item = Restangular.copy(restresult);
            })
    else {
        $scope.item = {};
    }
    $scope.item = {};
    car.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
        {
            getData: function ($defer, params) {
                    Restangular.all('complaintaction').getList({
                        pageNo: params.page(),
                        pageSize: params.count(),
                        sort: params.orderBy(),
                        search: ($stateParams.id == 'new') ? "ComplaintID = null":"ComplaintID = '" + $stateParams.id + "'"
                    }).then(function (items) {
                        params.total(items.paging.totalRecordCount);
                        $defer.resolve(items);
                        if (items && items.length > 0) {
                            $scope.$emit('ComplaintAction', true);
                        }
                        else {
                            $scope.$emit('ComplaintAction', false);
                        }
                    }, function (response) {
                        toaster.pop('warning', $translate.instant('Server.ServerError'), response);
                    });
            }
        });
    $scope.SaveDataItem = function (data) {
        data.ComplaintID = $stateParams.id
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                $scope.CallReason(4);
                car.tableParams.reload();
                toaster.pop('success',$translate.instant('accounting.Updated'),$translate.instant('accounting.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'complaintaction')
            data.ComplaintID = $stateParams.id
            data.post().then(function (res) {
                $scope.CallReason(4);
                car.tableParams.reload();
                toaster.pop('success', $translate.instant('accounting.Saved'), $translate.instant('accounting.Saved'));
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
            toaster.pop('warning', $translate.instant('accounting.Cancelled'), $translate.instant('accounting.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('accounting.Cancelled'), $translate.instant('accounting.Editcancelled'));
        }
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('accounting.Sure') ,
            text:  $translate.instant('accounting.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:    $translate.instant('accounting.confirmButtonText'),
            cancelButtonText:   $translate.instant('accounting.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (car.tableParams.data[index].fromServer) {
                    car.tableParams.data[index].remove();
                }
                car.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('accounting.Attention'),$translate.instant('accounting.RecordDeleted'));
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
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.complaintactionresults = [];
    $scope.loadEntities('complaintactionresult', 'complaintactionresults');
    $scope.ActionDatePopup = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.ActionDate = result;
        })
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("complaintactionsCtrl");
    });
};