'use strict';
app.controller('productprototypeeditCtrl', productprototypeeditCtrl);
function productprototypeeditCtrl($scope, $log, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element) {
    $("#name").focus();
    $rootScope.uService.EnterController("productprototypeeditCtrl");
    var pe = this;
    $scope.item = {};
    $rootScope.ProductPrototypeID = $stateParams.id;
    $scope.original = {};

    $scope.translate = function () {
        $scope.trName = $translate.instant('main.NAME');
        $scope.trSize = $translate.instant('main.SIZE');
        $scope.trFilter = $translate.instant('main.FILTER');
        $scope.trActive = $translate.instant('main.ACTIVE');
        $scope.trIndex = $translate.instant('main.INDEX');
        $scope.trProductOptionType = $translate.instant('main.PRODUCTOPTIONTYPE');
        $scope.trRelatedOption = $translate.instant('main.RELATEDOPTION');
        $scope.trMinCount = $translate.instant('main.MINCOUNT');
        $scope.trMaxCount = $translate.instant('main.MAXCOUNT');
        $scope.trQuantity = $translate.instant('main.QUANTITY');
        $scope.trFreeCount = $translate.instant('main.FREECOUNT');
        $scope.trRequired = $translate.instant('main.REQUIRED');
        $scope.trReadOnly = $translate.instant('main.READONLY');
        $scope.trProductionTime = $translate.instant('main.PRODUCTIONTIME');
        $scope.trDescription = $translate.instant('main.DESCRIPTION');
        $scope.trPrice = $translate.instant('main.PRICE');
        $scope.trOrderableFilter = $translate.instant('main.ORDERABLEFILTER');
        $scope.trOrderableValue = $translate.instant('main.ORDERABLEVALUE');
        $scope.trisDefault = $translate.instant('main.ISDEFAULT');
        $scope.trPriority = $translate.instant('main.PRIORITY');
        $scope.trPeriod = $translate.instant('main.PERIOD');
        $scope.trDuration = $translate.instant('main.DURATION');
        $scope.trStateIndex = $translate.instant('main.STATEINDEX');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.productprototypename = $translate.instant('main.PRODUCTPROTOTYPENAME');
        $scope.member = $translate.instant('main.MEMBER');
        $scope.filter = $translate.instant('main.FILTER');
        $scope.orderablefilter = $translate.instant('main.ORDERABLEFILTER');
        $scope.price = $translate.instant('main.PRICE');
        $scope.description = $translate.instant('main.DESCRIPTION');
        $scope.saveproduct = $translate.instant('main.SAVEPRODUCT');
        $scope.deleteproduct = $translate.instant('main.DELETEPRODUCT');
        $scope.productprototypeoption = $translate.instant('main.PRODUCTPROTYPEOPTION');
        $scope.addproductprototypeoption = $translate.instant('main.ADDPRODUCTPROTOTYPEOPTION');
        $scope.add = $translate.instant('main.ADD');
        $scope.edit = $translate.instant('main.EDIT');
        $scope.tag = $translate.instant('main.TAG');
        $scope.delete = $translate.instant('main.DELETE');
        $scope.product = $translate.instant('main.PRODUCT');
        $scope.addproduct = $translate.instant('main.ADDPRODUCT');
        $scope.productprice = $translate.instant('main.PRODUCTPRICE');
        $scope.addproductprice = $translate.instant('main.ADDPRODUCTPRICE');
        $scope.productrecipe = $translate.instant('main.PRODUCTRECIPE');
        $scope.addproductrecipe = $translate.instant('main.ADDPRODUCTRECIPE');
        $scope.productstates = $translate.instant('main.PRODUCTSTATES');
        $scope.addstate = $translate.instant('main.ADDSTATE');
        $scope.index = $translate.instant('main.INDEX');
        $scope.trACItemcode = $translate.instant('main.ACITEMCOD');
        $scope.trACAccountcode = $translate.instant('main.ACACCOUNTCODE');
        $scope.trACVATAccountcode = $translate.instant('main.ACVATACCOUNTCODE');
        $scope.trProductItemCode = $translate.instant('main.PRODUCTITEMCODE');
        $scope.trProductId = $translate.instant('main.PRODUCTID');
        $scope.vat = $translate.instant('main.VAT');
        $scope.trpluname = $translate.instant('main.PLUNAME');
        $scope.trextname = $translate.instant('main.EXTNAME');
        $scope.copyprototype = $translate.instant('main.COPYPROTOTYPE');
        $scope.trMaxItemCount = $translate.instant('main.MAXITEMCOUNT');
        $scope.trMinItemCount = $translate.instant('main.MINITEMCOUNT');
        $scope.trMicrosItemID = $translate.instant('main.MICROSITEMID');
        $scope.trMicrossubitemid = $translate.instant('main.MICROSSUBITEMID');
        $scope.trMicrosComboMealID  = $translate.instant('main.MICROSCOMBOMEALID ');
        $scope.trMicrosDeliveryItemID = $translate.instant('main.MICROSDELIVERYITEMID');
        $scope.trMicrosDeliverySubItemID = $translate.instant('main.MICROSDELIVERYSUBITEMID');


    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.Back = function () {
        $window.history.back();
    };
    if ($stateParams.id == 'new') {
        $scope.item.MemberID = $rootScope.user.UserRole.MemberID;
    }
    else {
        Restangular.one('productprototype', $stateParams.id).get().then
            (function (restresult) {
                $scope.original = restresult;
                $scope.item = Restangular.copy(restresult);
            },
                function (restresult) {
                    toaster.pop('warning', $translate.instant('orderfile.Cancelled'),  $translate.instant('personfile.Editcancelled') );
                    swal("Error!", $translate.instant('Server.DataError'), "Warning");
                })
    }

    $scope.saveData = function () {
        if ($scope.item.restangularized && $scope.item.id) {
            $scope.item.put().then(function (resp) {
                $rootScope.ProductPrototypeID = resp.id;
                swal($translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'), "success");
            });
        }
        else {
            Restangular.restangularizeElement('', $scope.item, 'productprototype')
            $scope.item.post().then(function (resp) {
                $scope.item.id = resp.id;
                $rootScope.ProductPrototypeID = resp.id;
                swal($translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'), "success");
            });
        }
    }
    $scope.isClean = function () {
        return angular.equals($scope.original, $scope.item);
    }
    pe.search = '';
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
        if (!pe.tableParams.data[pe.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pe.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Editcancelled'));
        }
    };


    $scope.copyPrototype = function () {
        Restangular.all('tools/cloneprototype').getList({
            ProductPrototypeID: $scope.ProductPrototypeID,
            NewPrototypeName: $scope.NewPrototypeName,
        }).then(function (result) {
            toaster.pop('success', $translate.instant('orderfile.NewPrototypeCreated'), '');
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
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
                pageSize: 10000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };

    $scope.members = [];
    $scope.loadEntities('member', 'members');
    $scope.filters = [];
    $scope.loadEntities('filter', 'filters');

    $scope.removedata = function (SelectItem) {
        SweetAlert.swal({
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                $scope.item.remove().then(function () {
                    SweetAlert.swal("Deleted.", "Record Deleted.", "success");
                    $location.path('app/product/product/list');
                });
            }
            else {
                SweetAlert.swal($translate.instant('orderfile.Cancelled'), $translate.instant('orderfile.DeletionCanceled'), "error");
            }
        });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("productdisableCtrl");
    });
};
app.controller('productpriceCtrl', productpriceCtrl);
function productpriceCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element) {
    $rootScope.uService.EnterController("productpriceCtrl");
    var pp = this;
    $scope.item = {};
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                pp.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'productprice')
            this.item.post().then(function (res) {
                pp.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
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
        if (!pp.tableParams.data[pp.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pp.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Editcancelled'));
        }
    };
    pp.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
        {
            getData: function ($defer, params) {
                if ($scope.ProductPrototypeID == 'new' && $stateParams.id == 'new') {
                    $scope.ProductPrototypeID = 0;
                }
                Restangular.all('productprice').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: "ProductPrototypeID='" + $scope.ProductPrototypeID + "'"
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
        return idvalue || 'Not Set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 10000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.sizes = [];
    $scope.loadEntities('enums/size', 'sizes');
    $scope.filters = [];
    $scope.loadEntities('filter', 'filters');
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (pp.tableParams.data[index].fromServer) {
                    pp.tableParams.data[index].remove();
                }
                pp.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'), $translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (pp.tableParams.data[index].fromServer) {
            pp.tableParams.data[index].remove();
        }
        pp.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        pp.tableParams.data.push({ ProductPrototypeID: $rootScope.ProductPrototypeID, Priority: 1 });
    };
    $scope.$watch(angular.bind(pp, function () {
        return $rootScope.ProductPrototypeID;
    }), function (value) {
        pp.tableParams.reload();
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
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("productpriceCtrl");
    });
};
app.controller('productCtrl', productCtrl);
function productCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location,  $translate, $element) {
    $rootScope.uService.EnterController("productCtrl");
    var ps = this;
    $scope.item = {};
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                ps.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            }, function (response) {
                toaster.pop('warning', $translate.instant('orderfile.OperationFailed'), response.data.ExceptionMessage);
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'product')
            this.item.post().then(function (res) {
                ps.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'),$translate.instant('orderfile.Saved'));
            }, function (response) {
                toaster.pop('warning', $translate.instant('orderfile.OperationFailed'), response.data.ExceptionMessage);
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
        if (!ps.tableParams.data[ps.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ps.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Editcancelled'));
        }
    };
    ps.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            name: 'asc'
        }
    },
        {
            getData: function ($defer, params) {
                if ($scope.ProductPrototypeID == 'new' && $stateParams.id == 'new') {
                    $scope.ProductPrototypeID = 0;
                }
                Restangular.all('product').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: "ProductPrototypeID='" + $scope.ProductPrototypeID + "'"
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
                pageSize: 10000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.sizes = [];
    $scope.loadEntities('enums/size', 'sizes');
    $scope.productprototypes = [];
    $scope.loadEntities('productprototype', 'productprototypes');
    $scope.productprices = [];
    $scope.loadEntities('productprice', 'productprices');
    $scope.filters = [];
    $scope.loadEntities('filter', 'filters');
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (ps.tableParams.data[index].fromServer) {
                    ps.tableParams.data[index].remove();
                }
                ps.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'), $translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (ps.tableParams.data[index].fromServer) {
            ps.tableParams.data[index].remove();
        }
        ps.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        ps.tableParams.data.push({ ProductPrototypeID: $rootScope.ProductPrototypeID });
    };
    $scope.$watch(angular.bind(ps, function () {
        return $rootScope.ProductPrototypeID;
    }), function (value) {
        ps.tableParams.reload();
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
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("productCtrl");
    });
};
app.controller('productoptionCtrl', productoptionCtrl);
function productoptionCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element) {
    $rootScope.uService.EnterController("productoptionCtrl");
    var ps = this;
    $scope.item = {};
    $scope.SelectedItem = 0;
    $scope.SelectItem = function (id) {
        if ($scope.SelectedItem == id) {
            $scope.ShowDetail = !$scope.ShowDetail;
        }
        else
            $scope.ShowDetail = true;
        if ($scope.ShowDetail)
            $scope.$broadcast('ProductOption', id);
        $scope.SelectedItem = id;

    };
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                ps.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'productoption')
            this.item.post().then(function (res) {
                ps.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
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
        if (!ps.tableParams.data[ps.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ps.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Editcancelled'));
        }
    };
    ps.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
        {
            getData: function ($defer, params) {
                if ($scope.ProductPrototypeID == 'new' && $stateParams.id == 'new') {
                    $scope.ProductPrototypeID = 0;
                }
                Restangular.all('productoption').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: "ProductPrototypeID='" + $scope.ProductPrototypeID + "'"
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('warning', $translate.instant('Server.ServerError'), response);
                });
            }
        });
    $scope.productoptions = [];
    $scope.LoadProductOptions = function () {
        if ($scope.ProductPrototypeID == 'new' && $stateParams.id == 'new') {
            $scope.ProductPrototypeID = 0;
        }
        Restangular.all('productoption').getList({
            pageNo: 1,
            pageSize: 10000,
            search: "ProductPrototypeID='" + $scope.ProductPrototypeID + "'"
        }).then(function (result) {
            $scope.productoptions = result;
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response);
        });
    };
    $scope.LoadProductOptions();

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
                pageSize: 10000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.sizes = [];
    $scope.loadEntities('enums/size', 'sizes');
    $scope.productprices = [];
    $scope.loadEntities('productprice', 'productprices');
    $scope.filters = [];
    $scope.loadEntities('filter', 'filters');
    $scope.productoptiontypes = [];
    $scope.loadEntities('enums/productoptiontype', 'productoptiontypes');
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (ps.tableParams.data[index].fromServer) {
                    ps.tableParams.data[index].remove();
                }
                ps.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'), $translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (ps.tableParams.data[index].fromServer) {
            ps.tableParams.data[index].remove();
        }
        ps.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        ps.tableParams.data.push({ ProductPrototypeID: $scope.ProductPrototypeID, Index: 0, MinCount: 1, MaxCount: 1, Quantity: 1 });
    };
    $scope.$watch(angular.bind(ps, function () {
        return $rootScope.ProductPrototypeID;
    }), function (value) {
        ps.tableParams.reload();
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
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("productoptionCtrl");
    });
};
app.controller('productoptionprototypeitemCtrl', productoptionprototypeitemCtrl);
function productoptionprototypeitemCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element) {
    $rootScope.uService.EnterController("productoptionprototypeitemCtrl");
    var pro = this;
    $scope.item = {};
    $scope.search = '';
    $scope.ProductOptionID = 0;
    $scope.translate = function () {
        $scope.trFilter = $translate.instant('main.FILTER');
        $scope.trActive = $translate.instant('main.ACTIVE');
        $scope.trQuantity = $translate.instant('main.QUANTITY');
        $scope.trProductPrototype = $translate.instant('main.PRODUCTPROTOTYPE');
        $scope.trSize = $translate.instant('main.SIZE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    var deregistration1 = $scope.$on('ProductOption', function (event, data) {
        $scope.ProductOptionID = data;
    });
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                pro.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'productoptionprototypeitem')
            this.item.post().then(function (res) {
                pro.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
            });
            this.item.get();
        }
    }
    $scope.GetProductOptionID = function () {
        return $scope.ProductOptionID;
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
        if (!pro.tableParams.data[pro.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pro.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Editcancelled'));
        }
    };
    pro.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
        {
            getData: function ($defer, params) {
                Restangular.all('productoptionprototypeitem').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: "ProductOptionID='" + $scope.GetProductOptionID() + "'"
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
        return idvalue || 'Not Set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 10000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.sizes = [];
    $scope.loadEntities('enums/size', 'sizes');
    $scope.productprototypes = [];
    $scope.loadEntities('productprototype', 'productprototypes');
    $scope.filters = [];
    $scope.loadEntities('filter', 'filters');

    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (pro.tableParams.data[index].fromServer) {
                    pro.tableParams.data[index].remove();
                }
                pro.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'), $translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (pro.tableParams.data[index].fromServer) {
            pro.tableParams.data[index].remove();
        }
        pro.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        pro.tableParams.data.push({ ProductOptionID: $scope.ProductOptionID });
    };
    $scope.$watch(angular.bind(pro, function () {
        return $scope.ProductOptionID;
    }), function (value) {
        pro.tableParams.reload();
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
        $scope.$on('$destroy', function () {
            deregistration();
            deregistration1();
            $element.remove();
            $rootScope.uService.ExitController("productoptionprototypeitemCtrl");
        });
    };

};
app.controller('productoptionproductitemCtrl', productoptionproductitemCtrl);
function productoptionproductitemCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element) {
    $rootScope.uService.EnterController("productoptionproductitemCtrl");
    var popi = this;
    $scope.item = {};
    $scope.ProductOptionID = 0;
    var deregistration = $scope.$on('ProductOption', function (event, data) {
        $scope.ProductOptionID = data;

    });
    $scope.translate = function () {
        $scope.trProduct = $translate.instant('main.PRODUCT');
        $scope.trFilter = $translate.instant('main.FILTER');
        $scope.trActive = $translate.instant('main.ACTIVE');
        $scope.trQuantity = $translate.instant('main.QUANTITY');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration1 = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                popi.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'productoptionproductitem')
            this.item.post().then(function (res) {
                popi.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
            });
            this.item.get();
        }
    }
    $scope.GetProductOptionID = function () {
        return $scope.ProductOptionID;
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
        if (!popi.tableParams.data[popi.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(popi.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Editcancelled'));
        }
    };
    popi.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
        {
            getData: function ($defer, params) {
                Restangular.all('productoptionproductitem').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: "ProductOptionID='" + $scope.GetProductOptionID() + "'"
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
        return idvalue || 'Not Set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 10000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.sizes = [];
    $scope.loadEntities('enums/size', 'sizes');
    $scope.products = [];
    $scope.loadEntities('product', 'products');
    $scope.filters = [];
    $scope.loadEntities('filter', 'filters');
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (popi.tableParams.data[index].fromServer) {
                    popi.tableParams.data[index].remove();
                }
                popi.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'), $translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (popi.tableParams.data[index].fromServer) {
            popi.tableParams.data[index].remove();
        }
        popi.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        popi.tableParams.data.push({ ProductOptionID: $scope.ProductOptionID });
    };
    $scope.$watch(angular.bind(popi, function () {
        return $scope.ProductOptionID;
    }), function (value) {
        popi.tableParams.reload();
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
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("productoptionproductitemCtrl");
    });
};
app.controller('productoptionfilteritemCtrl', productoptionfilteritemCtrl);
function productoptionfilteritemCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element) {
    $rootScope.uService.EnterController("productoptionfilteritemCtrl");
    var pf = this;
    $scope.item = {};
    $scope.ProductOptionID = 0;
    $scope.translate = function () {
        $scope.trFilter = $translate.instant('main.FILTER');
        $scope.trActive = $translate.instant('main.ACTIVE');
        $scope.trSize = $translate.instant('main.SIZE');
        $scope.trOptionItemFilter = $translate.instant('main.OPTIONITEMFILTER');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    var deregistration1 = $scope.$on('ProductOption', function (event, data) {
        $scope.ProductOptionID = data;

    });
    $scope.StartEdit = function (rf) {
        rf.$show();
    }
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                pf.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'productoptionfilteritem')
            this.item.post().then(function (res) {
                pf.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
            });
            this.item.get();
        }
    }
    $scope.GetProductOptionID = function () {
        return $scope.ProductOptionID;
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
        if (!pf.tableParams.data[pf.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pf.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Editcancelled'));
        }
    };
    pf.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
        {
            getData: function ($defer, params) {
                Restangular.all('productoptionfilteritem').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: "ProductOptionID='" + $scope.GetProductOptionID() + "'"
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
        return idvalue || 'Not Set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 10000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.sizes = [];
    $scope.loadEntities('enums/size', 'sizes');
    $scope.filters = [];
    $scope.loadEntities('filter', 'filters');
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (pf.tableParams.data[index].fromServer) {
                    pf.tableParams.data[index].remove();
                }
                pf.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'), $translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (pf.tableParams.data[index].fromServer) {
            pf.tableParams.data[index].remove();
        }
        pf.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        pf.tableParams.data.push({ ProductOptionID: $scope.ProductOptionID });
    };
    $scope.$watch(angular.bind(pf, function () {
        return $scope.ProductOptionID;
    }), function (value) {
        pf.tableParams.reload();
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
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("productoptionfilteritemCtrl");
    });
};
app.controller('productstateCtrl', productstateCtrl);
function productstateCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element) {
    $rootScope.uService.EnterController("productstateCtrl");
    var pstate = this;
    $scope.item = {};
    $scope.KDisplayIndexess = [{ id: 0, name: "Make Table" }, { id: 1, name: "Cut Table" }];
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                pstate.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'productstate')
            this.item.post().then(function (res) {
                pstate.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
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
        if (!pstate.tableParams.data[pstate.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pstate.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Editcancelled'));
        }
    };
    pstate.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
        {
            getData: function ($defer, params) {
                if ($scope.ProductPrototypeID == 'new' && $stateParams.id == 'new') {
                    $scope.ProductPrototypeID = 0;
                }
                Restangular.all('productstate').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: "ProductPrototypeID='" + $scope.ProductPrototypeID + "'"
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
        return idvalue || 'Not Set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 10000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.sizes = [];
    $scope.loadEntities('enums/size', 'sizes');
    $scope.filters = [];
    $scope.loadEntities('filter', 'filters');
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (pstate.tableParams.data[index].fromServer) {
                    pstate.tableParams.data[index].remove();
                }
                pstate.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'), $translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (pstate.tableParams.data[index].fromServer) {
            pstate.tableParams.data[index].remove();
        }
        pstate.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        pstate.tableParams.data.push({ ProductPrototypeID: $rootScope.ProductPrototypeID });
    };
    var deregistration = $scope.$watch(angular.bind(pstate, function () {
        return $rootScope.ProductPrototypeID;
    }), function (value) {
        pstate.tableParams.reload();
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
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("productstateCtrl");
    });
};
app.controller('productrecipeCtrl', productrecipeCtrl);
function productrecipeCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element) {
    $rootScope.uService.EnterController("productrecipeCtrl");
    var prec = this;
    $scope.item = {};
    $scope.SelectedItem = 0;
    $scope.SelectItem = function (id) {
        if ($scope.SelectedItem == id) {

            $scope.ShowDetail = !$scope.ShowDetail;
        }
        else
            $scope.ShowDetail = true;
        if ($scope.ShowDetail)
            $scope.$broadcast('ProductRecipe', id);
        $scope.SelectedItem = id;
    };
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                prec.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'productrecipe')
            this.item.post().then(function (res) {
                prec.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
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
        if (!prec.tableParams.data[prec.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(prec.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Editcancelled'));
        }
    };
    prec.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
        {
            getData: function ($defer, params) {
                if ($scope.ProductPrototypeID == 'new' && $stateParams.id == 'new') {
                    $scope.ProductPrototypeID = 0;
                }
                Restangular.all('productrecipe').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: "ProductPrototypeID='" + $scope.ProductPrototypeID + "'"
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
                pageSize: 10000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.periods = [];
    $scope.loadEntities('period', 'periods');
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (prec.tableParams.data[index].fromServer) {
                    prec.tableParams.data[index].remove();
                }
                prec.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'), $translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (prec.tableParams.data[index].fromServer) {
            prec.tableParams.data[index].remove();
        }
        prec.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        prec.tableParams.data.push({ ProductPrototypeID: $rootScope.ProductPrototypeID, });
    };
    var deregistration = $scope.$watch(angular.bind(prec, function () {
        return $rootScope.ProductPrototypeID;
    }), function (value) {
        prec.tableParams.reload();
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
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("productrecipeCtrl");
    });
};
app.controller('productrecipeitemCtrl', productrecipeitemCtrl);
function productrecipeitemCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element) {
    $rootScope.uService.EnterController("productrecipeitemCtrl");
    var pri = this;
    $scope.item = {};
    $scope.ProductRecipeID = 0;
    $scope.translate = function () {
        $scope.trFilter = $translate.instant('main.FILTER');
        $scope.trActive = $translate.instant('main.ACTIVE');
        $scope.trSize = $translate.instant('main.SIZE');
        $scope.trInventory = $translate.instant('main.INVENTORY');
        $scope.trUnitCount = $translate.instant('main.UNITCOUNT');
        $scope.trInventoryUnit = $translate.instant('main.INVENTORYUNIT');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trOrderType = $translate.instant('main.ORDERTYPE');
        $scope.trStartDate = $translate.instant('main.STARTDATE');
        $scope.trEndDate = $translate.instant('main.ENDDATE');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    var deregistration1 = $scope.$on('ProductRecipe', function (event, data) {
        $scope.ProductRecipeID = data;
    });
    $scope.LoadInventorySpecificUnits = function (InvID) {
        $scope.inventoryunits = [];
        $scope.loadEntities('inventoryunit', 'inventoryunits', "InventoryID='" + InvID + "'");
    }
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                pri.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'productrecipeitem')
            this.item.post().then(function (res) {
                pri.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
            });
            this.item.get();
        }
    }
    $scope.GetProductRecipeID = function () {
        return $scope.ProductRecipeID;
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
        if (!pri.tableParams.data[pri.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pri.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Editcancelled'));
        }
    };
    pri.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
        {
            getData: function ($defer, params) {
                $scope.isWaiting = true;
                Restangular.all('productrecipeitem').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: "ProductRecipeID='" + $scope.GetProductRecipeID() + "'"
                }).then(function (items) {
                    $scope.isWaiting = false;
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    $scope.isWaiting = false;
                    toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        });
    $scope.DatePopup = function (item,member) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item[member];
                }
            }
        });
        modalInstance.result.then(function (result) {
            item[member] = result;
        })
    };
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container, filter) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 10000,
                search: filter,
            }).then(function (result) {
                $scope[Container] = result;
                if (EntityType == "enums/ordertype") {
                    $scope[Container].push({ Value: -1, Name: "Tümü!", EnumValue: -1 })
                }
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
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
    $scope.inventories = [];
    $scope.loadEntitiesCache('cache/inventory', 'inventories');
    $scope.inventoryunits = [];
    $scope.loadEntitiesCache('cache/inventoryunit', 'inventoryunits');
    //$scope.inventoryunitstoshow = [];
    //$scope.loadEntities('inventoryunit', 'inventoryunitstoshow');
    $scope.filters = [];
    $scope.loadEntities('filter', 'filters');
    $scope.sizes = [];
    $scope.loadEntities('enums/size', 'sizes');
    $scope.ordertypes = [];
    $scope.loadEntities('enums/ordertype', 'ordertypes');


    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (pri.tableParams.data[index].fromServer) {
                    pri.tableParams.data[index].remove();
                }
                pri.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'), $translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (pri.tableParams.data[index].fromServer) {
            pri.tableParams.data[index].remove();
        }
        pri.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        pri.tableParams.data.push({ ProductRecipeID: $scope.ProductRecipeID });
    };
    var deregistration2 = $scope.$watch(angular.bind(pri, function () {
        return $scope.ProductRecipeID;
    }), function (value) {
        pri.tableParams.reload();
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
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        deregistration2();
        $element.remove();
        $rootScope.uService.ExitController("productrecipeitemCtrl");
    });
};