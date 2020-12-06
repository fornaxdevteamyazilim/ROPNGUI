//app.controller('productrecomendedpromotionCtrl', productrecomendedpromotionCtrl);
//function productrecomendedpromotionCtrl($scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $translate, $element) {
//    $rootScope.uService.EnterController("productrecomendedpromotionCtrl");
//    var prp = this;
//    $scope.translate = function () {
//        $scope.trProduct = $translate.instant('main.PRODUCT');
//        $scope.trPromotion = $translate.instant('main.PROMOTION');
//        $scope.trIndex = $translate.instant('main.INDEX');
//        $scope.trisActive = $translate.instant('main.ISACTIVE');
//        $scope.trCommands = $translate.instant('main.COMMANDS');
//    }
//    var deregistration = $scope.translate();
//    $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
//        $scope.translate();
//    });

//    $scope.objectType = 'productrecommendpromotion';
//    $scope.SelectedItem = null;
//    prp.search = '';

//    prp.search = '';
//    $scope.getproductrecommendpromotion = [];
//    $scope.onChange = function (data) {
//        Restangular.all('productrecommendpromotion').getList({
//            pageNo: 1,
//            pageSize: 10000,
//            //search: (data) ? "TagType='" + data + "'" : ""
//        }).then(function (result) {
//            $scope.getproductrecommendpromotion = result;
//        });
//    };


//    $scope.SelectItem = function (id) {
//        $scope.SelectedItem = id;
//    };
//    $scope.saveData = function (data) {
//        if (data.restangularized) {
//            data.put().then(function (res) { prp.tableParams.reload(); toaster.pop('success', "Güncellendi.",  $translate.instant('orderfile.Updated')); });
//        }
//        else {
//            Restangular.restangularizeElement('', data, $scope.objectType)
//            data.post().then(function (res) { prp.tableParams.reload(); toaster.pop('success', "Kaydedildi.", $translate.instant('orderfile.Saved')); });
//            data.get();
//        }
//    }

//    //   $scope.saveData = function (data) {
//    //    if (data.id) {
//    //        data.put().then(
//    //            function (res) {
//    //                prp.tableParams.reload();
//    //                toaster.pop('success', "Güncellendi.",  $translate.instant('orderfile.Updated'));
//    //            },
//    //            function (response) {
//    //                toaster.pop('error', "Update Failed!", response.data.ExceptionMessage);
//    //            }
//    //             );
//    //    }
//    //    else {
//    //        Restangular.restangularizeElement('', data, 'productrecommendpromotion')
//    //        data.post().then(
//    //            function (res) {
//    //                prp.tableParams.reload();
//    //                toaster.pop('success', "Kaydedildi.", $translate.instant('orderfile.Saved'));
//    //            },
//    //                function (response) {
//    //                    toaster.pop('error', "Data Insert Failed!", response.data.ExceptionMessage);
//    //                }
//    //        );
//    //        data.get();
//    //    }
//    //}


//    $scope.FormKeyPress = function (event, rowform, data, index) {
//        if (event.keyCode === 13 && rowform.$visible) {
//            rowform.$submit();
//            return data;
//        }
//        if (event.keyCode === 27 && rowform.$visible) {
//            $scope.cancelForm(rowform);
//        }
//    };
//    $scope.cancelForm = function (rowform) {
//        rowform.$cancel();
//        if (!prp.tableParams.data[prp.tableParams.data.length - 1].restangularized) {
//            $scope.cancelremove(prp.tableParams.data.length - 1, 1);
//            toaster.pop('warning', "İptal edildi !", $translate.instant('personfile.Insertcancelled'));
//        } else {
//            toaster.pop('warning', "İptal edildi !", $translate.instant('personfile.Editcancelled'));
//        }
//    };

//    prp.tableParams = new ngTableParams({
//        page: 1,
//        count: 10,
//        sorting: {
//            //name: 'asc'
//        }
//    },
//    {
//        getData: function ($defer, params) {
//            Restangular.all('productrecommendpromotion').getList({
//                pageNo: params.page(),
//                pageSize: params.count(),
//                //search: (prp.search) ? "name like '%" + prp.search + "%'" : "",
//                sort: params.orderBy()
//            }).then(function (items) {
//                if (items && items.length > 0) {
//                    params.total(items.paging.totalRecordCount);
//                    $scope.SelectedItem = items[0].id;
//                    $defer.resolve(items);
//                }
//            }, function (response) {
//                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
//            });
//        }
//    });
//      $scope.ShowObject = function (Container, idName, idvalue, resName) {
//        for (var i = 0; i < $scope[Container].length; i++) {
//            if ($scope[Container][i][idName] == idvalue)
//                return $scope[Container][i][resName];
//        }
//        return idvalue || 'Not set';
//    };
//    $scope.ShowObject2 = function (Container, idName, idvalue, resName, size) {
//        for (var i = 0; i < $scope[Container].length; i++) {
//            if ($scope[Container][i][idName] == idvalue)
//                return $scope[Container][i][resName]+'['+$scope[Container][i][size]+']';
//        }
//        return idvalue || 'Not set';
//    };
//    $scope.loadEntities = function (EntityType, Container) {
//        if (!$scope[Container].length) {
//            Restangular.all(EntityType).getList({
//                pageNo: 1,
//                pageSize: 10000,
//            }).then(function (result) {
//                $scope[Container] = result;
//            }, function (response) {
//                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
//            });
//        }
//    };
//    $scope.products = [];
//    $scope.loadEntities('product', 'products');

//    $scope.saveItem = function (data) {
//        _update(data, this.item);
//        $scope.saveData(this.item);
//        return this.item;
//    }

//    function _update(srcObj, destObj) {
//        for (var key in srcObj) {
//            if (destObj.hasOwnProperty(key) && srcObj.hasOwnProperty(key)) {
//                destObj[key] = (srcObj[key] != undefined) ? srcObj[key] : '';
//            }
//            if (!destObj.hasOwnProperty(key) && srcObj.hasOwnProperty(key)) {
//                destObj[key] = (srcObj[key] != undefined) ? srcObj[key] : '';
//            }
//        }
//    }
//    $scope.removeItem = function (index) {
//        SweetAlert.swal({
//            title: "EMİN MİSİNİZ ?",
//            text: "Kaydı Silmek İstediğinize Emin misiniz ?",
//            type: "warning",
//            showCancelButton: true,
//            confirmButtonColor: "#DD6B55",
//            confirmButtonText: "Evet, Sil !",
//            cancelButtonText: "Hayır, Silme !",
//            closeOnConfirm: true,
//            closeOnCancel: true
//        }, function (isConfirm) {
//            if (isConfirm) {
//                if (prp.tableParams.data[index].fromServer) {
//                    prp.tableParams.data[index].remove();
//                }
//                prp.tableParams.data.splice(index, 1);
//                toaster.pop("error", "Dikkat !", "Kayıt Silindi !");
//            }
//        });
//    };
//    $scope.cancelremove = function (index) {
//        if (prp.tableParams.data[index].fromServer) {
//            prp.tableParams.data[index].remove();
//        }
//        prp.tableParams.data.splice(index, 1);
//    };
//    $scope.addItem = function () {
//        prp.tableParams.data.push({});
//    };
//    var deregistration1 = $scope.$watch(angular.bind(prp, function () {
//        return prp.search;
//    }), function (value) {
//        prp.tableParams.reload();
//    });

//    $scope.$on('$destroy', function () {
//        deregistration();
//        deregistration1();
//        $element.remove();
//        $rootScope.uService.ExitController("productrecomendedpromotionCtrl");
//    });
//};


'use strict';
app.controller('productrecomendedpromotionCtrl', productrecomendedpromotionCtrl);
function productrecomendedpromotionCtrl($rootScope, $scope, $log, $modal, $http, Restangular, ngTableParams, SweetAlert, toaster, $window, $location, $translate, $element) {
    $("#search").focus();
    $rootScope.uService.EnterController("productrecomendedpromotionCtrl");
    var prp = this;
    prp.search = '';
    $scope.translate = function () {
        $scope.trProduct = $translate.instant('main.PRODUCT');
        $scope.trPromotion = $translate.instant('main.PROMOTION');
        $scope.trIndex = $translate.instant('main.INDEX');
        $scope.trisActive = $translate.instant('main.ISACTIVE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.item = {};
    prp.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
 {
     getData: function ($defer, params) {
         Restangular.all('productrecommendpromotion').getList({
             pageNo: params.page(),
             pageSize: params.count(),
             sort: params.orderBy(),
             search: (prp.search.length > 0) ? "Products.name like '%" + prp.search + "%'" : "",
         }).then(function (items) {
             params.total(items.paging.totalRecordCount);
             $defer.resolve(items);
         }, function (response) {
             toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
         });
     }
 });

    $scope.GetPrdoduct = function (data) {
        Restangular.one('product', data).get({
        }).then
       (function (result) {
           $scope.GetPrice(result);
       },
       function (response) {
           toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
       });
    };
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                prp.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'),  $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'productrecommendpromotion')
            data.post().then(function (res) {
                prp.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
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
        if (!prp.tableParams.data[prp.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(prp.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Editcancelled'));
        }
    };
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
                if (prp.tableParams.data[index].fromServer) {
                    prp.tableParams.data[index].remove();
                }
                prp.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (prp.tableParams.data[index].fromServer) {
            prp.tableParams.data[index].remove();
        }
        prp.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        prp.tableParams.data.push({});
    };
    var deregistration1 = $scope.$watch(angular.bind(prp, function () {
        return prp.search;
    }), function (value) {
        prp.tableParams.reload();
    });
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.ShowObject2 = function (Container, idName, idvalue, resName, size) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName] + '[' + $scope[Container][i][size] + ']';
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
    $scope.products = [];
    $scope.loadEntities('product', 'products');
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("productrecomendedpromotionCtrl");
    });
};
