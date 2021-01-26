app.controller('productpriceeditCtrl', productpriceeditCtrl);
function productpriceeditCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, ngnotifyService, userService, $element, Excel, $timeout, NG_SETTING) {
    $rootScope.uService.EnterController("productpriceeditCtrl");
    var ppe = this;
    userService.userAuthorizated();
    $scope.item = {};
    $scope.ProductPrototype = { name: '' };
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.translate = function () {
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.description = $translate.instant('main.DESCRIPTION');
        $scope.note = $translate.instant('main.NOTE');
        $scope.date = $translate.instant('main.DATE');
        $scope.delete = $translate.instant('main.DELETE');
        $scope.save = $translate.instant('main.SAVE');
        $scope.edit = $translate.instant('main.EDIT');
        $scope.back = $translate.instant('main.BACK');
        $scope.autoapply = $translate.instant('main.AUTOAPPLY');
        $scope.trProductPrototype = $translate.instant('main.PRODUCTPROTOTYPE');
        $scope.trProductPrice = $translate.instant('main.PRODUCTPRICE');
        $scope.trPrice = $translate.instant('main.PRICE');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    if (!$scope.item.CountDate) {
        $scope.item.CountDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if ($stateParams.id != 'new') {
        Restangular.one('ProductPriceList', $stateParams.id).get().then
            (function (restresult) {
                $scope.Showtable = true;
                $scope.item = Restangular.copy(restresult);
                if ($scope.item.items.length > 0) {
                    ppe.tableParams.reload();
                }
            })
    } else {
        $scope.Showtable = false;
        $scope.item = {};
        //$scope.item.InventoryCountTypeID = "0";
    }
    var ProductPrototypeGroup = function (item) {
        return item.ProductPrototypeGroup;
    };
    ppe.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    }, {
            getData: function ($defer, params) {
                if ($scope.item.items.length > 0)
                    $defer.resolve($scope.item.items);
            }
        });
    $scope.SaveData = function () {
        if ($scope.item.restangularized && $scope.item.id) {
            $scope.ShowObject = true;
            $scope.item.put().then(function (resp) {
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('storefile.Saveddatatoserver'));
                $location.path('/app/product/product/productprice/list');
                $scope.ShowObject = false;
            }, function (response) {
                $scope.ShowObject = false;
                toaster.pop('Warning', "Error!", response.data.ExceptionMessage);
            });
        }
        else {
            $scope.ShowObject = true;
            Restangular.restangularizeElement('', $scope.item, 'ProductPriceList')
            $scope.item.post().then(function (resp) {
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('storefile.Saveddatatoserver'));
                $scope.Showtable = true;
                $scope.item = {};
                $scope.item = Restangular.copy(resp);
                ppe.tableParams.reload();
                $scope.ShowObject = false;
            }, function (response) {
                $scope.ShowObject = false;
                toaster.pop('error', "Error!", response.data.ExceptionMessage);
            });
        }
    };
    //$scope.exportToExcel = function (tableId) { // ex: '#my-table'
    //    $scope.exportHref = Excel.tableToExcel(tableId, 'Sayimlar');
    //    $timeout(function () { location.href = $scope.exportHref }, 1); // trigger download
    //};
    //$scope.InventoryCountExcel = function () {
    //    location.href = NG_SETTING.apiServiceBaseUri + '/api/inventorycount/itemstoexcelxls?InventoryCountID=' + $stateParams.id;
    //};
    ppe.search = '';

    $scope.FormKeyPress = function (event, rowform, data, index) {
        if (event.keyCode === 13 && rowform.$visible) {
            rowform.$submit();
            $scope.addItem();
        }
        if (event.keyCode === 27 && rowform.$visible) {
            $scope.cancelForm(rowform);
        }
    };
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!idi.tableParams.data[idi.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(idi.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'),  $translate.instant('personfile.Insertcancelled') );
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'),  $translate.instant('personfile.Editcancelled'));
        }
    };
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
                    SweetAlert.swal( $translate.instant('orderfile.Deleted'),  $translate.instant('orderfile.RecordDeleted'), "success");
                    $location.path('/app/product/product/productprice/list');
                });
            }
            else {
                SweetAlert.swal( $translate.instant('orderfile.Cancelled'), $translate.instant('orderfile.DeletionCanceled'), "error");
            }
        });
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
                pageSize: 1000,
                search: filter,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.productprototypes = [];
    $scope.loadEntities('productprototype', 'productprototypes');
    $scope.datepopup = function (item) {
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
        modalInstance.result.then(function (item) {
            $scope.item.StartingDate = item;
        })
    };

    $scope.selecttag = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/reports/reportspopup/selecttag.html',
            controller: 'selecttagCtrl',
            size: '',
            backdrop: '',
            resolve: {
            }
        });
        modalInstance.result.then(function (item) {
            $scope.TagName = item;
        })
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("productpriceeditCtrl");
    });
};
app.directive('replacecomma', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            scope.$watch(attrs.ngModel, function (newVal) {
                if (newVal !== undefined && newVal !== null) {
                    ngModelCtrl.$setViewValue(String(newVal).replace(/,/g, '.'));
                    element.val(String(newVal).replace(/,/g, '.'));
                }
            })

        }
    }
});

app.factory('Excel', function ($window) {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
        format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
    return {
        tableToExcel: function (tableId, worksheetName) {
            var table = document.querySelector(tableId),
                ctx = { worksheet: worksheetName, table: table.innerHTML },
                href = uri + base64(format(template, ctx));
            return href;
        }
    };
})