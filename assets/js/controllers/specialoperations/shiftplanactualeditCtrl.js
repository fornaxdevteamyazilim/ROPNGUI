'use strict';
app.controller('shiftplanactualeditCtrl', shiftplanactualeditCtrl);
function shiftplanactualeditCtrl($scope, $log, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element, userService, $modal, ngnotifyService, Excel, $timeout) {
    $rootScope.uService.EnterController("shiftplanactualeditCtrl");
    userService.userAuthorizated();
    var spai = this;
    $scope.item = {};
    $scope.Back = function () {
        $window.history.back();
    };
        $scope.Time = ngnotifyService.ServerTime();

    $scope.translate = function () {
        $scope.trNGUser = $translate.instant('main.USER');
        $scope.trLaborCostType = $translate.instant('main.LABORCOSTTYPE');
        $scope.trStaffPosition = $translate.instant('main.STAFFPOSITION');
        $scope.trD1ShiftStart = $translate.instant('main.D1SHIFTSTART');
        $scope.trD1ShiftEnd = $translate.instant('main.D1SHIFTEND');
        $scope.trD1isOff = $translate.instant('main.D1ISOFF');
        $scope.trD2ShiftStart = $translate.instant('main.D2SHIFTSTART');
        $scope.trD2ShiftEnd = $translate.instant('main.D2SHIFTEND');
        $scope.trD2isOff = $translate.instant('main.D2ISOFF');
        $scope.trD3ShiftStart = $translate.instant('main.D3SHIFTSTART');
        $scope.trD3ShiftEnd = $translate.instant('main.D3SHIFTEND');
        $scope.trD3isOff = $translate.instant('main.D3ISOFF');
        $scope.trD4ShiftStart = $translate.instant('main.D4SHIFTSTART');
        $scope.trD4ShiftEnd = $translate.instant('main.D4SHIFTEND');
        $scope.trD4isOff = $translate.instant('main.D4ISOFF');
        $scope.trD5ShiftStart = $translate.instant('main.D5SHIFTSTART');
        $scope.trD5ShiftEnd = $translate.instant('main.D5SHIFTEND');
        $scope.tr51isOff = $translate.instant('main.D5ISOFF');
        $scope.trD6ShiftStart = $translate.instant('main.D6SHIFTSTART');
        $scope.trD6ShiftEnd = $translate.instant('main.D6SHIFTEND');
        $scope.trD6isOff = $translate.instant('main.D6ISOFF');
        $scope.trD7ShiftStart = $translate.instant('main.D7SHIFTSTART');
        $scope.trD7ShiftEnd = $translate.instant('main.D7SHIFTEND');
        $scope.trD7isOff = $translate.instant('main.D7ISOFF');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.delete = $translate.instant('main.DELETE');

    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.changestart = function (item, field,value) {
            item[field] = $scope.addTime(value, 8, 30);
    };
    $scope.addTime = function (time,addhours,addminutes) {
        var i = time.indexOf(":");
        var hour = parseInt(time.substring(0, i));
        var minute = parseInt(time.substring(i + 1, time.length));
        hour += addhours;
        minute += addminutes;
        if (minute >= 60) {
            hour++;
            minute = minute - 60;
        }
        hour = hour > 24 ? hour - 24 : hour;
        return (hour < 10 ? "0" + hour.toString() : hour.toString()) + ":" + (minute < 10 ? "0" + minute.toString() : minute.toString());
    }
    if ($stateParams.id != 'new') {
        Restangular.one('ShiftActual', $stateParams.id).get().then(function (restresult) {
            $scope.item = Restangular.copy(restresult);
            if ($scope.item.items.length > 0) {
                spai.tableParams.reload();
            }
            Restangular.all('user').getList({
                pageNo: 1,
                pageSize: 10000,
                search: "StoreID='" + $scope.item.StoreID + "'"
            }).then(function (result) {
                $scope.storeUsers = result;
            }, function (response) {
                toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
            });
        }, function (restresult) {
            toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
            swal("Hata!", "Warning");
        })
    }
    else {
        $scope.item = {};
    }
    $scope.storeUsers = [];
    $scope.ToggleOff = function (rowform, data,index,field,thefield) {
        if (rowform.$visible) {
            thefield[field] = !thefield[field];
            rowform.$data[field] = !rowform.$data[field];
        }
        else
        {
            rowform.$show();
        }
    };

    $scope.FormKeyPress = function (event, rowform, data, index) {
        if (event.keyCode === 13 && rowform.$visible) {
            rowform.$submit();
            //$scope.addItem();
        }
        if (event.keyCode === 27 && rowform.$visible) {
            $scope.cancelForm(rowform);
        }
    };
    $scope.addItem = function (item) {
        spai.tableParams.data.push({
            StaffPositionID: item.StaffPositionID,
            StaffPosition: item.StaffPosition,
            D1isOff: false,
            D2isOff: false,
            D3isOff: false,
            D4isOff: false,
            D5isOff: false,
            D6isOff: false,
            D7isOff: false,
            ShiftActualID: item.ShiftActualID
        });
    };
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!spai.tableParams.data[spai.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(spai.tableParams.data.length - 1, 1);
            toaster.pop('warning', "It is cancelled !", 'Insert cancelled !');
        } else {
            toaster.pop('warning', "It is cancelled !", 'Edit cancelled !');
        }
    };
    $scope.cancelremove = function (index) {
        if (spai.tableParams.data[index].fromServer) {
            spai.tableParams.data[index].remove();
        }
        spai.tableParams.data.splice(index, 1);
    };
    spai.tableParams = new ngTableParams({
        page: 1,
        count: 100,
        group: "StaffPosition"
    }, {
        getData: function ($defer, params) {
            Restangular.all('ShiftActualItem').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: 'ShiftActualID=' + $stateParams.id
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
            });
        }
        });

    //$scope.hstep = 1;

    $scope.options = {
        hstep: ['-', '01:00', '01:15', '01:30', '01:45', '02:00', '02:15', '02:30', '02:45', '03:00', '03:15', '03:30', '03:45', '04:00', '04:15', '04:30', '04:45','08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30',
            '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00',
            '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30',
            '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45', '00:00', '00:15', '00:30', '00:45']
    };


    $scope.AddItems = function (item) {
        item.ShiftActualID = $stateParams.id;
        Restangular.restangularizeElement('', item, 'ShiftActualItem')
        item.post().then(function (resp) {
            spai.tableParams.reload();
            toaster.pop("success", "Updated.", "Updated");
            spai.tableParams.reload();
        });
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
                    SweetAlert.swal("Deleted.", "Record Deleted.", "success");
                    $location.path('/app/specialoperations/shiftplanactual');
                });
            }
            else {
                SweetAlert.swal("It is cancelled !", "Deletion canceled !", "error");
            }
        });
    };
    $scope.removeItem = function (index) {
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
                if (spai.tableParams.data[index].fromServer) {
                    spai.tableParams.data[index].remove();
                }
                spai.tableParams.data.splice(index, 1);
                toaster.pop("error", "Attention !", "Record Deleted !");
            }
        });
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
    $scope.shiftactuals = [];
    $scope.loadEntities('shiftactual', 'shiftactuals');
    $scope.staffpositions = [];
    $scope.loadEntities('staffposition', 'staffpositions');
    $scope.laborcosttypes = [];
    $scope.loadEntities('laborcosttype', 'laborcosttypes');


    $scope.saveData = function () {
        if ($scope.item.restangularized && $scope.item.id) {
            $scope.item.put().then(function (resp) {
                swal("Güncellendi.", "Updated.", "success");
                $rootScope.ShiftActualID = resp.id;
                $scope.$broadcast('ShiftActual', resp);
            }, function (response) {
                toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
            });
        }
        else {
            Restangular.restangularizeElement('', $scope.item, 'ShiftActual')
            $scope.item.post().then(function (resp) {
                $scope.item.id = resp.id;
                swal("Kaydedildi.", "Saved.", "success");
                $rootScope.ShiftActualID = resp.id;
                $scope.$broadcast('ShiftActual', resp);
            }, function (response) {
                toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
            });

        }
    }

    $scope.SaveItem = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                spai.tableParams.reload();
                toaster.pop('success', "Güncellendi.", 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'ShiftActualItem')
            this.item.post().then(function (res) {
                spai.tableParams.reload();
                toaster.pop('success', "Kaydedildi.", 'Saved.');
            });
            this.item.get();
        }
    }

    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        $scope.exportHref = Excel.tableToExcel(tableId, 'Vardiya Planı Gerceklesen');
        $timeout(function () { location.href = $scope.exportHref }, 1); // trigger download
    };

    $scope.isClean = function () {
        return angular.equals($scope.original, $scope.item);
    }
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("shiftplanactualeditCtrl");
    });
};
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
app.filter('abs', function () {
    return function (val) {
        return Math.abs(val);
    }
});