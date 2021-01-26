app.controller('storesalesforecastCtrl', storesalesforecastCtrl);
function storesalesforecastCtrl($rootScope, $scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $translate, $element) {
    $rootScope.uService.EnterController("storesalesforecastCtrl");
    var ssc = this;
    $scope.translate = function () {
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trTC = $translate.instant('main.TARGETTC');
        $scope.trSales = $translate.instant('main.TARGETSALES');
        $scope.trPeriod = $translate.instant('main.PERIOD');
        $scope.trNewCustomers = $translate.instant('main.NEWCUSTOMER');
        $scope.trAC = $translate.instant('main.TARGETAC');
        $scope.trMonth = $translate.instant('main.MONTHH');
        $scope.trYear = $translate.instant('main.YEAR');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trSalesBudget = $translate.instant('main.SALESBUDGET');

        $scope.trSalesDelivery = $translate.instant('main.DELIVERYSALES');
        $scope.trTCDelivery = $translate.instant('main.DELIVERYTC');
        $scope.trSalesInStore = $translate.instant('main.DINEINSALES');
        $scope.trTCInStore = $translate.instant('main.DINEINTC');
        $scope.trSalesTakeAway = $translate.instant('main.TAKEAWAYSALES');
        $scope.trTCTakeAway = $translate.instant('main.TAKEAWAYTC');

    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.objectType = 'StoreSalesTarget';
    $scope.SelectedItem = null;
    ssc.search = '';
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
    };
    $scope.saveData = function (data) {
        if (data.restangularized) {
            data.put().then(function (res) { ssc.tableParams.reload(); toaster.pop('success',$translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated')); });
        }
        else {
            Restangular.restangularizeElement('', data, $scope.objectType)
            data.post().then(function (res) { ssc.tableParams.reload(); toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved')); });
        }
        data.get();
    }
    $scope.FormKeyPress = function (event, rowform, data, index) {
        if (event.keyCode === 13 && rowform.$visible) {
            _update(rowform.$data, data);
            $scope.saveData(data);
            rowform.$cancel();
            return data;
        }
        if (event.keyCode === 27 && rowform.$visible) {
            $scope.cancelForm(rowform);
        }
    };
    $scope.Edit = function(rowForm){
        if ($rootScope.user.restrictions.storesalesforecastedit == 'Enable')
            rowform.$show();
    };
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!ssc.tableParams.data[ssc.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ssc.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'),  $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'),  $translate.instant('difinitions.Editcancelled'));
        }
    };
    ssc.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    },
    {
        getData: function ($defer, params) {
            Restangular.all($scope.objectType).getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy()
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $scope.SelectedItem = (items && items.length > 0) ? items[0].id : null;
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
        });

    $scope.finalDate = '';
    $scope.today = new Date();
    //$scope.currentYear = $scope.today.getFullYear();
    $scope.currentYear = '2020';

    // 10 Years from current year
    $scope.maxYear = new Date($scope.today.setFullYear($scope.today.getFullYear() + 10)).getFullYear();
    $scope.isDateValid = false;
    $scope.dateValidationText = '';

    $scope.days = [{
        Id: '',
        Name: 'DAY'
    }];

    for (x = 1; x <= 31; x++) {
        $scope.days.push({ Id: x, Name: x });
    }

    $scope.months = [{
        Id: 1,
        Name: 'JANUARY'
    }, {
        Id: 2,
        Name: 'FEBRUARY'
    }, {
        Id: 3,
        Name: 'MARCH'
    }, {
        Id: 4,
        Name: 'APRIL'
    }, {
        Id: 5,
        Name: 'MAY'
    }, {
        Id: 6,
        Name: 'JUNE'
    }, {
        Id: 7,
        Name: 'JULY'
    }, {
        Id: 8,
        Name: 'AUGUST'
    }, {
        Id: 9,
        Name: 'SEPTEMBER'
    }, {
        Id: 10,
        Name: 'OCTOBER'
    }, {
        Id: 11,
        Name: 'NOVEMBER'
    }, {
        Id: 12,
        Name: 'DECEMBER'
    }];

    $scope.years = [{
        Id: '',
        Name: ''
    }];

    for (x = $scope.currentYear; x <= $scope.maxYear; x++) {
        $scope.years.push({ Id: x, Name: x });
    }

    $scope.isLeapYear = false;
    $scope.yearType = '';
    $scope.GetSoreID = function (data) {
        $scope.StoreID = data;
        $scope.selectedStore = $filter('filter')($scope.user.userstores, { id: data });
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
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if ($scope[Container] && !$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.stores = $rootScope.user.userstores;
    $scope.periods = [];
    $scope.loadEntities('period', 'periods');

    if ($rootScope.user.userstores && $rootScope.user.userstores.length > 1) {
        $scope.selectStore = true;
    } else {
        $scope.loadEntitiesCache($rootScope.user.StoreID);
    }

    $scope.saveItem = function (data) {
        _update(data, this.item);
        $scope.saveData(this.item);
        return this.item;
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
                if (ssc.tableParams.data[index].fromServer) {
                    ssc.tableParams.data[index].remove();
                }
                ssc.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (ssc.tableParams.data[index].fromServer) {
            ssc.tableParams.data[index].remove();
        }
        ssc.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        ssc.tableParams.data.push({});
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
        $rootScope.uService.ExitController("storesalesforecastCtrl");
    });
};