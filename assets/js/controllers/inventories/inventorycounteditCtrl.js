app.controller('inventorycounteditCtrl', inventorycounteditCtrl);
function inventorycounteditCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, ngnotifyService, userService, $element, Excel, $timeout, NG_SETTING) {
    $rootScope.uService.EnterController("inventorycounteditCtrl");
    var ici = this;
    userService.userAuthorizated();
    $scope.item = {};
    $scope.TagData = { name: '' };
    $scope.groupItem = [];
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.translate = function () {
        $scope.trInventory = $translate.instant('main.INVENTORY');
        $scope.trUnitCount = $translate.instant('main.UNITCOUNT');
        $scope.trUnitPrice = $translate.instant('main.UNITPRICE');
        $scope.trInventoryUnit = $translate.instant('main.INVENTORYUNIT');
        $scope.trUnit = $translate.instant('main.UNIT');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.description = $translate.instant('main.DESCRIPTION');
        $scope.note = $translate.instant('main.NOTE');
        $scope.repository = $translate.instant('main.REPOSITORY');
        $scope.counttype = $translate.instant('main.COUNTTYPE');
        $scope.datetime = $translate.instant('main.DATETIME');
        $scope.delete = $translate.instant('main.DELETE');
        $scope.save = $translate.instant('main.SAVE');
        $scope.edit = $translate.instant('main.EDIT');
        $scope.selectinventorygroup = $translate.instant('main.SELECTINVENTORYGROUP');
        $scope.back = $translate.instant('main.BACK');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    if (!$scope.item.CountDate) {
        $scope.item.CountDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if ($stateParams.id != 'new') {
        Restangular.one('inventorycount', $stateParams.id).get().then
            (function (restresult) {
                $scope.Showtable = true;
                $scope.item = Restangular.copy(restresult);
                if ($scope.item.items.length > 0) {
                    ici.tableParams.reload();
                }
            })
    } else {
        $scope.Showtable = false;
        $scope.item = {};
        $scope.item.InventoryCountTypeID = "0";
    }
    var searchText='';
    var inventoryUnit= function(item){
        return item.InventoryUnit;
    }
    var InventoryGroup = function (item) {
        return item.InventoryGroup;
    };
    ici.tableParams = new ngTableParams({
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
                toaster.pop('success', "Updated.", 'Saved data to server.');
                $location.path('/app/inventory/inventorycount/list');
                $scope.ShowObject = false;
            }, function (response) {
                $scope.ShowObject = false;
                toaster.pop('Warning', "Error!", response.data.ExceptionMessage);
            });
        }
        else {
            $scope.ShowObject = true;
            Restangular.restangularizeElement('', $scope.item, 'inventorycount')
            $scope.item.post().then(function (resp) {
                toaster.pop('success', "Saved.", 'Saved data to server.');
                $scope.Showtable = true;
                $scope.item = {};
                $scope.item = Restangular.copy(resp);
                ici.tableParams.reload();
                $scope.ShowObject = false;
            }, function (response) {
                $scope.ShowObject = false;
                toaster.pop('error', "Error!", response.data.ExceptionMessage);
            });
        }
    };
    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        $scope.exportHref = Excel.tableToExcel(tableId, 'Census');
        $timeout(function () { location.href = $scope.exportHref }, 1); // trigger download
    };
    $scope.InventoryCountExcel = function () {
        location.href = NG_SETTING.apiServiceBaseUri + '/api/inventorycount/itemstoexcelxls?InventoryCountID=' + $stateParams.id;
    };
    ici.search = '';
    $scope.FormKeyPress = function (event, rowform, data, index) {
        $('.inputs').keydown(function (e) {
            if (e.which === 107) {
                var index = $('.inputs').index(this) - 1;
                $('.inputs').eq(index).focus().select();
            }
            if (e.which === 13) {
                var index = $('.inputs').index(this) + 1;
                $('.inputs').eq(index).focus().select();
            }
            if (e.which === 37) {
                var index = $('.inputs').index(this) - 1;
                $('.inputs').eq(index).focus().select();
            }
            if (e.which === 39) {
                var index = $('.inputs').index(this) + 1;
                $('.inputs').eq(index).focus().select();
            }
        });
        if (event.keyCode === 27 && rowform.$visible) {
            $scope.cancelForm(rowform);
        }
    };
    $scope.removedata = function (SelectItem) {
        SweetAlert.swal({
            title: "ARE YOU SURE ?",
            text: "Are you sure you want to delete the record ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Delete !",
            cancelButtonText: "No, Deletion !",
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                $scope.item.remove().then(function () {
                    SweetAlert.swal("Delete.", "Record Deleted.", "success");
                    $location.path('/app/inventory/inventorycount/list');
                });
            }
            else {
                SweetAlert.swal("It is cancelled!", "Deletion canceled !", "error");
            }
        });
    };
    $scope.repositories = [];
    $scope.loadRepository = function () {
        if (!$scope.repositories.length) {
            Restangular.all('repository').getList({
                pageNo: 1,
                pageSize: 1000,
                sort: 'id',
                search: "StoreID='" + $rootScope.user.StoreID + "'"
            }).then(function (result) {
                if (result && result.length > 0) {
                    $scope.repositories = result;
                    $scope.item.RepositoryID = result[0].id;
                }
            }, function (response) {
                toaster.pop('Warning', "Server Error", response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadRepository();
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
                toaster.pop('Warning', "Server Error", response.data.ExceptionMessage);
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
    $scope.inventoryunits = [];
    $scope.loadEntitiesCache('cache/inventoryunit', 'inventoryunits');
    $scope.counttypes = [];
    $scope.loadEntities('enums/inventorycounttype', 'counttypes');
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
            $scope.item.CountDate = item;
        })
    };
    $scope.LoadTags = function (data) {
        Restangular.all('tag/array').getList({
            id: data
        }).then(function (result) {
            $scope.tags = Restangular.copy(result[0].item);
            $scope.groupItem.push({ name: '*Tümü', id: 000000000001 });
            for (var i = 0; i < $scope.tags.children.length; i++) {
                $scope.groupItem.push({ name: $scope.tags.children[i].name, id: $scope.tags.children[i].id })
                if ($scope.tags.children[i].children) {
                    for (var j = 0; j < $scope.tags.children[i].children.length; j++) {
                        $scope.groupItem.push({ name: $scope.tags.children[i].children[j].name, id: $scope.tags.children[i].children[j].id })
                        if ($scope.tags.children[i].children[j].children) {
                            for (var k = 0; k < $scope.tags.children[i].children[j].children.length; k++) {
                                $scope.groupItem.push({ name: $scope.tags.children[i].children[j].children[k].name, id: $scope.tags.children[i].children[j].children[k].id })
                                if ($scope.tags.children[i].children[j].children) {
                                    for (var l = 0; l < $scope.tags.children[i].children[j].children[k].children.length; l++) {
                                        $scope.groupItem.push({ name: $scope.tags.children[i].children[j].children[k].children[l].name, id: $scope.tags.children[i].children[j].children[k].children[l].id })
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for (var m = 0; m < $scope.groupItem.length; m++) {
                if ($scope.groupItem[m].name == 'Haftalık') {
                    $scope.groupItem.splice(m, 1);
                }
                if ($scope.groupItem[m].name == 'Günlük') {
                    $scope.groupItem.splice(m, 1);
                }
            }
        }, function (response) {
            toaster.pop('error', "Server Error", response);
        });
    };
    $scope.LoadTags(20);
    $scope.getListGroup = function (dataID) {
        if (dataID == 1) {
            $scope.TagName = Restangular.copy({ name: '' });
        } else {
            var data = $filter('filter')($scope.groupItem, { id: dataID });
            $scope.TagName = Restangular.copy(data[0]);
        }
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
        $rootScope.uService.ExitController("inventorycounteditCtrl");
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