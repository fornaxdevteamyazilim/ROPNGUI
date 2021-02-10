app.directive('ngDraggable', ngDraggable);
function ngDraggable($document, $rootScope, $window) {
    $rootScope.uService.EnterController("ngDraggable");
    function makeDraggable(scope, element, attr) {
        var startX = 0;
        var startY = 0;
        for (var i = 0; i < scope.tableplans.length; i++) {
            for (var j = 0; j < scope.tableplans[i].tables.length; j++) {
            if (scope.tableplans[i].tables[j].id == attr.id) {
                scope.x = scope.tableplans[i].tables[j].LocationX;
                scope.y = scope.tableplans[i].tables[j].LocationY;
            }
            }
        }
        element.css({
            position: 'fixed',
            cursor: 'pointer',
            top: scope.y + 'px',
            left: scope.x + 'px'
        });
        element.on('mousedown', function (event) {
            event.preventDefault();
            startX = event.pageX - scope.x;
            startY = event.pageY - scope.y;
            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
        });
        function mousemove(event) {
            scope.y = event.pageY - startY;
            scope.x = event.pageX - startX;

            element.css({
                top: scope.y + 'px',
                left: scope.x + 'px'
            });
        }
        function mouseup() {
            $document.unbind('mousemove', mousemove);
            $document.unbind('mouseup', mouseup);
        }
    }
    return {
        link: makeDraggable,
        controller: function ($scope, $element, $attrs) {
            $scope.SaveLocation = function (data) {
                $scope.$emit('SaveLocation', { id: data.id, name: data.name, StoreID: data.StoreID, TablePlanID: data.TablePlanID, LocationX: $scope.x, LocationY: $scope.y });
            }
        }
    }
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("ngDraggable");
    });
};
app.controller('tablePlanEditCtrl', tablePlanEditCtrl);
function tablePlanEditCtrl($scope, $log, $modal, Restangular, ngTableParams, $translate, SweetAlert, toaster, $filter, $window, $rootScope, $location, userService, $element) {
    $rootScope.uService.EnterController("tablePlanEditCtrl");
    $scope.tableplans = [];
    $scope.PersonCount = []; 
    userService.userAuthorizated();
    $scope.dragOptions = {
        start: function (e) {
            console.log("STARTING");
        },
        drag: function (e) {
            console.log("DRAGGING");
        },
        stop: function (e) {
            console.log("STOPPING");
        },
        container: 'container-id'
    };
    $scope.LoadStoreTablePlans = function () {
        Restangular.all('tableplan').getList({
            pageNo: 1,
            pageSize: 1000,
            search: "StoreID = '" + $rootScope.user.StoreID + "'"
        }).then(function (result) {
            $scope.tableplans = result;
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.LoadStoreTablePlans();
    $scope.CheckCode = function (item, root) {
        if ($rootScope.user.restrictions.editstoretable == "Enable") {
            var modalInstance = $modal.open({
                templateUrl: 'assets/views/mainscreen/loginpassword.html',
                controller: 'loginpasswordCtrl',
                size: '',
                backdrop: '',
            });
            modalInstance.result.then(function (password) {
                if (password != "cancel") {
                    userService.cardLogin(password,true).then(function (response) {
                        if (root == 'edittableplan') {
                        $scope.ShowEditButton = true;
                        userService.stopTimeout();
                        }
                        if (root == 'addtableplan')
                            $scope.addstoretable();
                    }, function (err) {
                        if (err) {
                            toaster.pop('warrning', $translate.instant('Server.PasswordError'), err.error_description);
                            return 'No'
                        }
                        else {
                            //toaster
                            $scope.message = "Unknown error";
                            return 'No'
                        }
                    });

                }
            })
        } else {
            toaster.pop("warning",  $translate.instant('yemeksepetifile.YOUARENOTAUTHORIZEDFORTHISPROCEDURE'));
            return 'No';
        }
    };
    $scope.addstoretable = function () {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/tableplan/addstoretable.html',
            controller: 'addstoretableCtrl',
            size: 'lg',
            backdrop: '',
        });
        modalInstance.result.then(function (value) {
            if (value == 'ok') {
                $scope.LoadStoreTablePlans();
            }
        })
    };
    var deregistration = $scope.$on('SaveLocation', function (event, data) {
        if (data) {
            Restangular.restangularizeElement('', data, 'storetable');
            data.put().then(function (resp) {
                toaster.pop('success', $translate.instant('margeaddress.Saved'));
            },
                function (resp) {
                    toaster.pop('error', $translate.instant('margeaddress.ChangesNotSaved'), "error");
                });
        }
    });
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("tablePlanEditCtrl");
    });
};
app.controller('addstoretableCtrl', addstoretableCtrl);
function addstoretableCtrl($scope, $modal, $filter, SweetAlert, Restangular, $translate, ngTableParams, $modalInstance, toaster, $window, $stateParams, $rootScope, $location, $translate) {
    $rootScope.uService.EnterController("addstoretableCtrl");
    $scope.item = {};
    $scope.translate = function () {
        $scope.trName = $translate.instant('main.NAME');
        $scope.trTablePlan = $translate.instant('main.TABLEPLAN');
        $scope.trLocationX = $translate.instant('main.LOCATIONX');
        $scope.trLocationY = $translate.instant('main.LOCATIONY');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                $scope.tableParams.reload();
                toaster.pop('success', $translate.instant('margeaddress.Updated'), $translate.instant('margeaddress.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'storetable')
            this.item.post().then(function (res) {
                $scope.tableParams.reload();
                toaster.pop('success', $translate.instant('margeaddress.Saved'), $translate.instant('margeaddress.Saved'));
            });
            this.item.get();
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
        if (!$scope.tableParams.data[$scope.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove($scope.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('margeaddress.Cancelled'), $translate.instant('margeaddress.Insertcancelled'));
        } else {
            toaster.pop('warning',$translate.instant('margeaddress.Cancelled'), $translate.instant('margeaddress.Editcancelled'));
        }
    };
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },{
        getData: function ($defer, params) {
            Restangular.all('storetable').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "StoreID='" + $rootScope.user.StoreID + "'"
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
                search: "StoreID = '" + $rootScope.user.StoreID + "'"
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.tableplans = [];
    $scope.loadEntities('tableplan', 'tableplans');
    $scope.removeItem = function (index) {
                if ($scope.tableParams.data[index].fromServer) {
                    $scope.tableParams.data[index].remove();
                }
                $scope.tableParams.data.splice(index, 1);
        toaster.pop("error", $translate.instant('margeaddress.Attention'), $translate.instant('margeaddress.RecordDeleted'));
    };

    $scope.cancelremove = function (index) {
        if ($scope.tableParams.data[index].fromServer) {
            $scope.tableParams.data[index].remove();
        }
        $scope.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        $scope.tableParams.data.push({ StoreID: $rootScope.user.StoreID });
    };
    var deregistration1 = $scope.$watch(angular.bind($scope, function () {
        return $rootScope.StoreID;
    }), function (value) {
        $scope.tableParams.reload();
    });
    $scope.ok = function () {
        $modalInstance.close('ok');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $rootScope.uService.ExitController("tablePlanEditCtrl");
    });
};

