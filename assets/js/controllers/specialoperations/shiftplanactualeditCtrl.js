app.controller('shiftplanactualeditCtrl', shiftplanactualeditCtrl);
function shiftplanactualeditCtrl($rootScope, $scope, NG_SETTING, $translate, $element, localStorageService, $http, $window, $stateParams, Restangular, toaster, $filter) {
    $rootScope.uService.EnterController("shiftplanactualeditCtrl");
    var ngurr = this;
    $scope.NGUserRoleID = '';
    //DevExpress.localization.locale("tr");
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
        $scope.trOffType = $translate.instant('main.OFFTYPE');
        $scope.trIgnoreOvertime = $translate.instant('main.IGNOREOVERTIME');
        $scope.trShifts = $translate.instant('main.SHIFTS');
        $scope.trEditShifts = $translate.instant('main.EDITSHIFTS');
        $scope.trStartShifts = $translate.instant('main.STARTSHIFT');
        $scope.trEndShift = $translate.instant('main.ENDSHIFT');
        $scope.trIsOff = $translate.instant('main.ISOFFDAY');
        $scope.trTotalHours = $translate.instant('main.TOTALHOURS');
        $scope.trOvertime = $translate.instant('main.OVERTIME');
        $scope.trTotalAmount = $translate.instant('main.TOTALAMOUNT');
        $scope.trShowAll = $translate.instant('main.SHOWALL');
        $scope.trTotal = $translate.instant('main.TOTAL');
        $scope.Vacations = $translate.instant('main.VACATIONS');
        $scope.Paid = $translate.instant('main.PAID');
        $scope.Free = $translate.instant('main.FREE');
        $scope.Required = $translate.instant('main.REQUIRED');
        $scope.Plan = $translate.instant('main.PLAN');
        $scope.Status = $translate.instant('main.STATUS');
        $scope.Position = $translate.instant('main.POSITION');
        $scope.WeekDay = $translate.instant('main.WEEKDAY');
        $scope.OrderType = $translate.instant('main.ORDERTYPE');
        $scope.Hour = $translate.instant('main.HOUR');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== "";
    }
    Date.prototype.getWeek = function () {
        var date = new Date(this.getTime());
        date.setHours(0, 0, 0, 0);
        // Thursday in current week decides the year.
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        // January 4 is always in week 1.
        var week1 = new Date(date.getFullYear(), 0, 4);
        // Adjust to Thursday in week 1 and count number of weeks from date to week1.
        var result = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
        return result > 52 ? 0 : result;
        //return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    }
    String.prototype.format = function () {
        var formatted = this;
        for (var i = 0; i < arguments.length; i++) {
            var regexp = new RegExp('\\{' + i + '\\}', 'gi');
            formatted = formatted.replace(regexp, arguments[i]);
        }
        return formatted;
    };
    function getDateRangeOfWeek(weekNo, y) {
        var d1, numOfdaysPastSinceLastMonday, rangeIsFrom, rangeIsTo;
        d1 = new Date('' + y + '');
        numOfdaysPastSinceLastMonday = d1.getDay() - 1;
        d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
        d1.setDate(d1.getDate() + (7 * (weekNo - d1.getWeek())));
        rangeIsFrom = d1.getDate() + "." + (d1.getMonth() + 1) + "." + d1.getFullYear();
        d1.setDate(d1.getDate() + 6);
        rangeIsTo = d1.getDate() + "." + (d1.getMonth() + 1) + "." + d1.getFullYear();
        return rangeIsFrom + " - " + rangeIsTo;
    };
    function getStaratOfWeek(weekNo, y) {
        var d1, numOfdaysPastSinceLastMonday, rangeIsFrom, rangeIsTo;
        d1 = new Date('' + y + '');
        numOfdaysPastSinceLastMonday = d1.getDay() - 1;
        d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
        d1.setDate(d1.getDate() + (7 * (weekNo - d1.getWeek())));
        return d1;
    };
    function ConvertToSeconds(time) {
        if (time) {
            var splitTime = time.split(":");
            if (time.split(":").length > 1)
                return splitTime[0] * 3600 + splitTime[1] * 60;
            else
                return -1;
        }
        else
            return 0;
    }
    function SumHoursStr(startTime, endTime, isOff, IgnoreOvertime, userID) {
        if (isOff) return "";
        var dd = SumHours(startTime, endTime, isOff, IgnoreOvertime, userID);
        return dd == 0 ? "" : "[" + dd + "]";

    }
    function GetMaxHours(actualHours, IgnoreOvertime, userID) {
        if (IgnoreOvertime) {
            var maxHours = GetUserMaxHours(userID);
            return actualHours > maxHours ? maxHours : actualHours;
        }
        else {
            return actualHours;
        }
    }
    function SumHours(startTime, endTime, isOff, IgnoreOvertime, userID) {
        if (isOff) return 0;
        var diff = CalcHours(startTime, endTime);
        var result = diff - ((diff >= 7.5) ? 0.5 : 0);
        result = GetMaxHours(result, IgnoreOvertime, userID);
        return result;
    }
    function CalcHours(startTime, endTime) {
        var diff = 0;
        if (startTime && endTime) {
            var smon = ConvertToSeconds(startTime);
            var fmon = ConvertToSeconds(endTime);
            if (smon > fmon) { fmon += 86400; }
            if (smon < 0 || fmon < 0) { diff = 0; } else { diff = Math.abs(fmon - smon); }
        }
        return diff / 3600;
    }
    function GetNormalHours(startTime, endTime, isOff, IgnoreOvertime, userID) {
        if (isOff) return 0;
        var lct = GetUserLabourCostType(userID);
        if (lct && lct.maxWorkingHours < 7.5)
            return CalcHours(startTime, endTime);
        var diff = GetMaxHours(CalcHours(startTime, endTime), true, userID);
        return diff - ((diff >= 7.5) ? 0.5 : 0);
    }
    function GetOvertimeHours(startTime, endTime, isOff, IgnoreOvertime, userID) {
        if (isOff || IgnoreOvertime) return 0;
        var lct = GetUserLabourCostType(userID);
        if (lct && lct.maxWorkingHours < 7.5)
            return 0;
        var diff = CalcHours(startTime, endTime);
        return diff > GetMaxHours(diff, true, userID) ? diff - GetMaxHours(diff, true, userID) : 0;
    }
    function LaborCost(startTime, endTime, isOff, IgnoreOvertime, userID, StaffPositionID, StaffOffTypeID) {
        // return (GetNormalHours(startTime, endTime, isOff, IgnoreOvertime, userID) +
        //     (GetOvertimeHours(startTime, endTime, isOff, IgnoreOvertime, userID) * 1.5))
        //     ;

        return (GetNormalHours(startTime, endTime, isOff, IgnoreOvertime, userID) +
            (GetOvertimeHours(startTime, endTime, isOff, IgnoreOvertime, userID) * 1.5)
            + GetOffPaidHours(userID, isOff, StaffOffTypeID)
        )
            * HourlyWage(StaffPositionID);
    };
    function GetDefaultOffHours(userID, TotalNormalHours) {
        //return 0;
        if (TotalNormalHours == 0) return 0;
        var h = GetUserMaxHours(userID);
        return h - ((h >= 7.5) ? 0.5 : 0);
    };
    function GetOffPaidHours(userID, isOff, StaffOffTypeID) {
        if (!isOff) return 0;
        var ot = $scope.GetOffType(StaffOffTypeID);
        if (ot) {
            if (!ot.isPaid) return 0.0;
            var h = GetUserMaxHours(userID);
            if (ot && (ot.isDefault && h < 7.5))
                return 0.0; //Part time not paid for weekly off
            return h - ((h >= 7.5) ? 0.5 : 0);
        }
        return 0.0;
    };
    function GetOffFreeHours(userID, isOff, StaffOffTypeID) {
        if (!isOff) return 0;
        var ot = $scope.GetOffType(StaffOffTypeID);
        if (ot) {
            if (ot.isPaid) return 0.0;
            var h = GetUserMaxHours(userID);
            if (ot && (ot.isDefault && h < 7.5))
                return 0.0; //Part time not paid for weekly off
            return h - ((h >= 7.5) ? 0.5 : 0);
        }
        return 0.0;
    };
    function HourlyWage(StaffPositionID) {
        if (StaffPositionID) {
            for (var i = 0; i < wages.length; i++) {
                if (wages[i].StaffPositionID == StaffPositionID)
                    return wages[i].Price;
            }
            return 0.0;
        }
        return 0.0;
    };
    $scope.GetOffTypeName = function (StaffOffTypeID) {
        if (StaffOffTypeID) {
            for (var i = 0; i < OffTypes.length; i++) {
                if (OffTypes[i].id == StaffOffTypeID)
                    return OffTypes[i].Name;
            }
        }
        return "N/A";
    };
    $scope.GetOffType = function (StaffOffTypeID) {
        if (StaffOffTypeID) {
            for (var i = 0; i < OffTypes.length; i++) {
                if (OffTypes[i].id == StaffOffTypeID)
                    return OffTypes[i];
            }
        }
        return null;
    };
    $scope.GetDefaultOffType = function () {
        for (var i = 0; i < OffTypes.length; i++) {
            if (OffTypes[i].isDefault)
                return OffTypes[i];
        }
        return null;
    };

    $scope.GetLaborCostTypeMaxHours = function (LaborCostTypeID) {
        if (LaborCostTypeID) {
            for (var i = 0; i < LaborCostTypes.length; i++) {
                if (LaborCostTypes[i].id == LaborCostTypeID)
                    return LaborCostTypes[i].maxWorkingHours;
            }
        }
        return 8.0;
    };
    GetLaborCostType = function (LaborCostTypeID) {
        if (LaborCostTypeID) {
            for (var i = 0; i < LaborCostTypes.length; i++) {
                if (LaborCostTypes[i].id == LaborCostTypeID)
                    return LaborCostTypes[i];
            }
        }
        return null;
    };
    GetUserMaxHours = function (UserID) {
        var defaultHours = 8.0;
        if (UserID) {
            var lct = GetUserLabourCostType(UserID);
            return lct ? lct.maxWorkingHours : defaultHours;
        }
        return defaultHours;
    };
    GetUserLabourCostType = function (UserID) {
        if (UserID) {
            for (var i = 0; i < users.length; i++) {
                if (users[i].id == UserID) {
                    return users[i].LaborCostType ? users[i].LaborCostType : GetLaborCostType(users[i].LaborCostTypeID);
                }
            }
        }
        return null;
    };
    var hours = ['00', '01', '02', '03', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    WeekDayToIndex = function (WeekDAy) {
        var a = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(WeekDAy);
        if (a > -1)
            return a + 1;
        a = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"].indexOf(WeekDAy);
        return (a > -1) ? a + 1 : a;
    }

    GetTCTotal = function (WeekDay) {
        var total = 0;
        for (var i = 0; i < advdata.length; i++) {
            if (WeekDayToIndex(advdata[i].WeekDay) == WeekDay && advdata[i].Position == DriverPossition.Name)
                for (var h = 0; h < hours.length; h++)
                    total += (advdata[i]["AvgTC_{0}".format(hours[h])]);
        }
        return total;
    };
    GetTXWage = function (WeekDay) {
        return GetTCTotal(WeekDay) * txWage;
    };
    //staffpositions
    function maxWorkingHours(LaborCostTypeID) {
        if (LaborCostTypeID) {
            for (var i = 0; i < LaborCostTypes.length; i++) {
                if (LaborCostTypes[i].id == LaborCostTypeID)
                    return LaborCostTypes[i].maxWorkingHours ?? 7.5;
            }
        }
        return 7.5;
    };
    function DeliveryWage(StaffPossitionID) {
        if (StaffPossitionID) {
            var selected = wages.filter(function (item) {
                return item.StaffPossitionID === StaffPossitionID;
            });
            return (selected.length) ? selected[0].OrderDeliveryPrice ?? 0 : 0;
        }
        return "N/A";
    };
    function secondsTohhmmss(secs) {
        var hours = parseInt(secs / 3600);
        var seconds = parseInt(secs % 3600);
        var minutes = parseInt(seconds / 60);
        return hours + ":" + minutes;
    }
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.AddRow = function () {
        $('#gridContainer').dxDataGrid('instance').addRow();
    };
    var users = [];
    var OffTypes = [];
    var LaborCostTypes = [];
    var Possitions = [];
    var DriverPossition = null;
    var txWage = 0;
    Restangular.all('StaffOffType').getList({
        pageNo: 1,
        pageSize: 10000,
    }).then(function (result) {
        OffTypes = result;
    }, function (response) {
        toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
    });
    Restangular.all('cache/LaborCostTypes').getList().then(function (result) {
        LaborCostTypes = result;
    }, function (response) {
        toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
    });
    Restangular.all('cache/StaffPositions').getList().then(function (result) {
        Possitions = result;
        for (var i = 0; i < Possitions.length; i++) {
            if (Possitions[i].TCOrderType == "2")
                DriverPossition = Possitions[i];
        }

    }, function (response) {
        toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
    });

    var wages = [];
    var advdata = [];
    Restangular.all('cache/Users').getList().then(function (result) {
        users = result;
        Restangular.one('ShiftActual', $stateParams.id).get().then(function (restresult) {
            $scope.item = Restangular.copy(restresult);
            $http.get(NG_SETTING.apiServiceBaseUri + "/api/fsr/hourlywages", {
                params: {
                    theYear: $scope.item.PeriodYear,
                    theWeek: $scope.item.PeriodWeek
                }
            })
                .then(function (response) {
                    wages = response.data;
                    for (var i = 0; i < wages.length; i++) {
                        if (wages[i].StaffPositionID == DriverPossition.id)
                            txWage = wages[i].OrderDeliveryPrice;
                    }
                }, function (response) {
                    toaster.pop('warning', $translate.instant('Server.ServerError'), $translate.instant('Server.DataLoadingError'));
                });
        }, function (restresult) {
            toaster.pop('warning', $translate.instant('Server.ServerError'), restresult.data.ExceptionMessage);

        })
    }, function (response) {
        toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
    });
    var hstep = ['-', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
        '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
        '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00', '00:30',
        '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30'];
    

    $scope.tabPanelOptions = {
        height: 260,
        //dataSource: tabPanelItems,
        itemTemplate: "customer",
        bindingOptions: {
            selectedIndex: "selectedIndex",
            loop: "loop",
            animationEnabled: "animationEnabled",
            swipeEnabled: "swipeEnabled"
        }
    };

    $scope.advPivotOptions = {
        allowSortingBySummary: true,
        allowFiltering: true,
        allowExpandAll: true,
        showDataFields: true,
        showRowFields: true,
        showColumnFields: true,
        showFilterFields: true,
        allowFieldDragging: true,
        height: 600,
        showBorders: true,
        dataFieldArea: "row",
        rowHeaderLayout: "tree",
        showTotalsPrior: "row",
        fieldChooser: {
            enabled: true,
            allowSearch: true
        },
        "export": {
            enabled: true,
            fileName: "StaffPlanSummary"
        },
        fieldPanel: {
            visible: true
        },
        onCellPrepared: function (e) {
            if (e.area == 'data' && e.cell.value != 0) {
                if (e.cell.value < 0)
                    e.cellElement.css({ 'color': '#f00' });
                else
                    e.cellElement.css({ 'color': '#2ab71b' });
                //if (e.cell.rowPath.indexOf("Status")>-1)
                e.cellElement.css({ 'font-weight': 'bold' });
                // if (e.cell.value > 0)
                //     e.cellElement.text("+" + e.cell.text);
            }
        },
        customizeExcelCell: (options) => {
            var gridCell = options.gridCell;
            if (!gridCell) {
                return;
            }
            if (gridCell.column.dataField == 'data') {
                if (gridCell.data[gridCell.column.dataField] > 0)
                    options.font.color = '#008000';
                else
                    options.font.color = '#FF0000';
            }
        }
    };
    $scope.dataGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxShiftActualItems",
            loadParams: { ShiftActualID: $stateParams.id },
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxShiftActualItems",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxShiftActualItems",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxShiftActualItems",
            onBeforeSend: function (method, ajaxOptions) {
                var authData = localStorageService.get('authorizationData');
                if (authData) {
                    ajaxOptions.headers = { Authorization: 'Bearer ' + authData.token};//, "Accept-Language": "tr-TR" };
                }
            },
            onLoaded: function (result) {
                //result["333"]=33;// Your code goes here
                //r = response.data;
                for (var i = 0; i < result.length; i++) {
                    var offNotExist = !(result[i].D1isOff || result[i].D2isOff || result[i].D3isOff || result[i].D4isOff || result[i].D5isOff || result[i].D6isOff || result[i].D7isOff);
                    result[i]["NormalHours"] =
                        GetNormalHours(result[i].D1ShiftStart, result[i].D1ShiftEnd, result[i].D1isOff, result[i].D1IgnoreOvertime, result[i].NGUserID) +
                        GetNormalHours(result[i].D2ShiftStart, result[i].D2ShiftEnd, result[i].D2isOff, result[i].D2IgnoreOvertime, result[i].NGUserID) +
                        GetNormalHours(result[i].D3ShiftStart, result[i].D3ShiftEnd, result[i].D3isOff, result[i].D3IgnoreOvertime, result[i].NGUserID) +
                        GetNormalHours(result[i].D4ShiftStart, result[i].D4ShiftEnd, result[i].D4isOff, result[i].D4IgnoreOvertime, result[i].NGUserID) +
                        GetNormalHours(result[i].D5ShiftStart, result[i].D5ShiftEnd, result[i].D5isOff, result[i].D5IgnoreOvertime, result[i].NGUserID) +
                        GetNormalHours(result[i].D6ShiftStart, result[i].D6ShiftEnd, result[i].D6isOff, result[i].D6IgnoreOvertime, result[i].NGUserID) +
                        GetNormalHours(result[i].D7ShiftStart, result[i].D7ShiftEnd, result[i].D7isOff, result[i].D7IgnoreOvertime, result[i].NGUserID);// +
                    //((offNotExist ? (GetDefaultOffHours()) : 0) * 1.5);
                    result[i]["Paid"] = GetOffPaidHours(result[i].NGUserID, result[i].D1isOff, result[i].D1OffTypeID) +
                        GetOffPaidHours(result[i].NGUserID, result[i].D2isOff, result[i].D2OffTypeID) +
                        GetOffPaidHours(result[i].NGUserID, result[i].D3isOff, result[i].D3OffTypeID) +
                        GetOffPaidHours(result[i].NGUserID, result[i].D4isOff, result[i].D4OffTypeID) +
                        GetOffPaidHours(result[i].NGUserID, result[i].D5isOff, result[i].D5OffTypeID) +
                        GetOffPaidHours(result[i].NGUserID, result[i].D6isOff, result[i].D6OffTypeID) +
                        GetOffPaidHours(result[i].NGUserID, result[i].D7isOff, result[i].D7OffTypeID);
                    result[i]["Free"] = GetOffFreeHours(result[i].NGUserID, result[i].D1isOff, result[i].D1OffTypeID) +
                        GetOffFreeHours(result[i].NGUserID, result[i].D2isOff, result[i].D2OffTypeID) +
                        GetOffFreeHours(result[i].NGUserID, result[i].D3isOff, result[i].D3OffTypeID) +
                        GetOffFreeHours(result[i].NGUserID, result[i].D4isOff, result[i].D4OffTypeID) +
                        GetOffFreeHours(result[i].NGUserID, result[i].D5isOff, result[i].D5OffTypeID) +
                        GetOffFreeHours(result[i].NGUserID, result[i].D6isOff, result[i].D6OffTypeID) +
                        GetOffFreeHours(result[i].NGUserID, result[i].D7isOff, result[i].D7OffTypeID);
                    result[i]["OvertimeHours"] = GetOvertimeHours(result[i].D1ShiftStart, result[i].D1ShiftEnd, result[i].D1isOff, result[i].D1IgnoreOvertime, result[i].NGUserID) +
                        GetOvertimeHours(result[i].D2ShiftStart, result[i].D2ShiftEnd, result[i].D2isOff, result[i].D2IgnoreOvertime, result[i].NGUserID) +
                        GetOvertimeHours(result[i].D3ShiftStart, result[i].D3ShiftEnd, result[i].D3isOff, result[i].D3IgnoreOvertime, result[i].NGUserID) +
                        GetOvertimeHours(result[i].D4ShiftStart, result[i].D4ShiftEnd, result[i].D4isOff, result[i].D4IgnoreOvertime, result[i].NGUserID) +
                        GetOvertimeHours(result[i].D5ShiftStart, result[i].D5ShiftEnd, result[i].D5isOff, result[i].D5IgnoreOvertime, result[i].NGUserID) +
                        GetOvertimeHours(result[i].D6ShiftStart, result[i].D6ShiftEnd, result[i].D6isOff, result[i].D6IgnoreOvertime, result[i].NGUserID) +
                        GetOvertimeHours(result[i].D7ShiftStart, result[i].D7ShiftEnd, result[i].D7isOff, result[i].D7IgnoreOvertime, result[i].NGUserID) +
                        ((offNotExist ? (GetDefaultOffHours(result[i].NGUserID, result[i]["NormalHours"])) : 0));
                    result[i]["Monday"] = (result[i].D1isOff) ? $scope.GetOffTypeName(result[i].D1OffTypeID) : [result[i].D1ShiftStart, result[i].D1ShiftEnd].join("-") + " " + SumHoursStr(result[i].D1ShiftStart, result[i].D1ShiftEnd, result[i].D1isOff, result[i].D1IgnoreOvertime, result[i].NGUserID);
                    result[i]["Tuesday"] = (result[i].D2isOff) ? $scope.GetOffTypeName(result[i].D2OffTypeID) : [result[i].D2ShiftStart, result[i].D2ShiftEnd].join("-") + " " + SumHoursStr(result[i].D2ShiftStart, result[i].D2ShiftEnd, result[i].D2isOff, result[i].D2IgnoreOvertime, result[i].NGUserID);
                    result[i]["Wednesday"] = (result[i].D3isOff) ? $scope.GetOffTypeName(result[i].D3OffTypeID) : [result[i].D3ShiftStart, result[i].D3ShiftEnd].join("-") + " " + SumHoursStr(result[i].D3ShiftStart, result[i].D3ShiftEnd, result[i].D3isOff, result[i].D3IgnoreOvertime, result[i].NGUserID);
                    result[i]["Thursday"] = (result[i].D4isOff) ? $scope.GetOffTypeName(result[i].D4OffTypeID) : [result[i].D4ShiftStart, result[i].D4ShiftEnd].join("-") + " " + SumHoursStr(result[i].D4ShiftStart, result[i].D4ShiftEnd, result[i].D4isOff, result[i].D4IgnoreOvertime, result[i].NGUserID);
                    result[i]["Friday"] = (result[i].D5isOff) ? $scope.GetOffTypeName(result[i].D5OffTypeID) : [result[i].D5ShiftStart, result[i].D5ShiftEnd].join("-") + " " + SumHoursStr(result[i].D5ShiftStart, result[i].D5ShiftEnd, result[i].D5isOff, result[i].D5IgnoreOvertime, result[i].NGUserID);
                    result[i]["Saturday"] = (result[i].D6isOff) ? $scope.GetOffTypeName(result[i].D6OffTypeID) : [result[i].D6ShiftStart, result[i].D6ShiftEnd].join("-") + " " + SumHoursStr(result[i].D6ShiftStart, result[i].D6ShiftEnd, result[i].D6isOff, result[i].D6IgnoreOvertime, result[i].NGUserID);
                    result[i]["Sunday"] = (result[i].D7isOff) ? $scope.GetOffTypeName(result[i].D7OffTypeID) : [result[i].D7ShiftStart, result[i].D7ShiftEnd].join("-") + " " + SumHoursStr(result[i].D7ShiftStart, result[i].D7ShiftEnd, result[i].D7isOff, result[i].D7IgnoreOvertime, result[i].NGUserID);
                    result[i]["TotalAmount"] = LaborCost(result[i].D1ShiftStart, result[i].D1ShiftEnd, result[i].D1isOff, result[i].D1IgnoreOvertime, result[i].NGUserID, result[i].StaffPositionID, result[i].D1OffTypeID) +
                        LaborCost(result[i].D2ShiftStart, result[i].D2ShiftEnd, result[i].D2isOff, result[i].D2IgnoreOvertime, result[i].NGUserID, result[i].StaffPositionID, result[i].D2OffTypeID) +
                        LaborCost(result[i].D3ShiftStart, result[i].D3ShiftEnd, result[i].D3isOff, result[i].D3IgnoreOvertime, result[i].NGUserID, result[i].StaffPositionID, result[i].D3OffTypeID) +
                        LaborCost(result[i].D4ShiftStart, result[i].D4ShiftEnd, result[i].D4isOff, result[i].D4IgnoreOvertime, result[i].NGUserID, result[i].StaffPositionID, result[i].D4OffTypeID) +
                        LaborCost(result[i].D5ShiftStart, result[i].D5ShiftEnd, result[i].D5isOff, result[i].D5IgnoreOvertime, result[i].NGUserID, result[i].StaffPositionID, result[i].D5OffTypeID) +
                        LaborCost(result[i].D6ShiftStart, result[i].D6ShiftEnd, result[i].D6isOff, result[i].D6IgnoreOvertime, result[i].NGUserID, result[i].StaffPositionID, result[i].D6OffTypeID) +
                        LaborCost(result[i].D7ShiftStart, result[i].D7ShiftEnd, result[i].D7isOff, result[i].D7IgnoreOvertime, result[i].NGUserID, result[i].StaffPositionID, result[i].D7OffTypeID)
                        + (offNotExist ? (GetDefaultOffHours(result[i].NGUserID, result[i]["NormalHours"]) * 1.5 * HourlyWage(result[i].StaffPositionID)) : 0);
                    result[i]["Wage"] = HourlyWage(result[i].StaffPositionID);

                }

            },
            loadParams: { filter: JSON.stringify(["ShiftActualID", "=", $stateParams.id]) },
            // errorHandler: function(e) {
            //     console.log('hit');
            // },
            onAjaxError: function (e) {
                //var emsg=e.xhr.responseText.map(item => ExceptionMessage);
                var obj = JSON.parse(e.xhr.responseText);
                //console.log(obj.ExceptionMessage);
                toaster.pop('error', obj.Message, obj.ExceptionMessage);
            }
        }),
        //filterValue: ["ShiftPlanID", "=", $stateParams.id],
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        showBorders: true,
        allowColumnReordering: true,
        //filterRow: { visible: true },
        //filterPanel: { visible: true },
        //headerFilter: { visible: true },
        grouping: { autoExpandAll: true },
        //searchPanel: { visible: true },
        //groupPanel: { visible: true },
        editing: {
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: ($rootScope.user.restrictions.shiftplanactualedit_delete == 'Enable'),
            allowInserting: true,
            useIcons: true,
            mode: "popup",

            popup: {
                title: $scope.trEditShifts, showTitle: true,
                fullScreen: true
            },
            form: {
                labelLocation: "top",
                items: [{
                    itemType: "group",
                    colCount: 3,
                    colSpan: 2,
                    items: ["StaffPositionID", "NGUserID", { dataField: "ShowAllUsers", label: { text: $scope.trShowAll } }]
                }, {
                    itemType: "group",
                    colCount: 6,
                    colSpan: 2,
                    caption: $scope.trShifts,
                    items: ["D1ShiftStart", "D1ShiftEnd", "D1isOff", { colSpan: 2, dataField: "D1OffTypeID" }, "D1IgnoreOvertime"]
                },
                {
                    itemType: "group",
                    colCount: 6,
                    colSpan: 2,
                    items: ["D2ShiftStart", "D2ShiftEnd", "D2isOff", { colSpan: 2, dataField: "D2OffTypeID" }, "D2IgnoreOvertime"]
                },
                {
                    itemType: "group",
                    colCount: 6,
                    colSpan: 2,
                    items: ["D3ShiftStart", "D3ShiftEnd", "D3isOff", { colSpan: 2, dataField: "D3OffTypeID" }, "D3IgnoreOvertime"]
                },
                {
                    itemType: "group",
                    colCount: 6,
                    colSpan: 2,
                    items: ["D4ShiftStart", "D4ShiftEnd", "D4isOff", { colSpan: 2, dataField: "D4OffTypeID" }, "D4IgnoreOvertime"
                    ]
                },
                {
                    itemType: "group",
                    colCount: 6,
                    colSpan: 2,
                    //caption: "Friday",
                    items: ["D5ShiftStart", "D5ShiftEnd", "D5isOff", { colSpan: 2, dataField: "D5OffTypeID" }, "D5IgnoreOvertime"]
                },
                {
                    itemType: "group",
                    colCount: 6,
                    colSpan: 2,
                    //caption: "Saturday",
                    items: ["D6ShiftStart", "D6ShiftEnd", "D6isOff", { colSpan: 2, dataField: "D6OffTypeID" }, "D6IgnoreOvertime"]
                },
                {
                    itemType: "group",
                    colCount: 6,
                    colSpan: 2,
                    //caption: "Sunday",
                    items: ["D7ShiftStart", "D7ShiftEnd", "D7isOff", { colSpan: 2, dataField: "D7OffTypeID" }, "D7IgnoreOvertime"]
                }]
            }
        },
        columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        remoteOperations: false,
        // onRowClick: function (rowInfo) {
        //     if (rowInfo.rowType == "data")
        //         rowInfo.component.editRow(rowInfo.rowIndex);
        // },
        onInitNewRow: function (e) {
            e.data.ShiftActualID = $scope.item.id;
        },
        onRowInserted: function (e) {
            // var dataGrid = $('#advgridContainer').dxDataGrid('instance');
            // dataGrid.refresh();
        },
        onRowUpdated: function (e) {
            // var dataGrid = $('#advgridContainer').dxDataGrid('instance');
            // dataGrid.refresh();
        },
        onEditorPreparing: function (e) {
            if (e.parentType === "dataRow" && e.dataField === "NGUserID") {
                e.editorOptions.disabled = (typeof e.row.data.StaffPositionID !== "number") || (typeof e.row.data.NGUserID === "number");
            }
            if (e.parentType === "dataRow" && e.dataField === "StaffPositionID") {
                e.editorOptions.disabled = (typeof e.row.data.NGUserID === "number");
            }
            if (e.parentType === "dataRow" && e.dataField === "D1OffTypeID") { e.editorOptions.disabled = (!e.row.data.D1isOff); }
            if (e.parentType === "dataRow" && e.dataField === "D1ShiftStart") { e.editorOptions.disabled = (e.row.data.D1isOff); }
            if (e.parentType === "dataRow" && e.dataField === "D1ShiftEnd") { e.editorOptions.disabled = (e.row.data.D1isOff); }
            if (e.parentType === "dataRow" && e.dataField === "D2OffTypeID") { e.editorOptions.disabled = (!e.row.data.D2isOff); }
            if (e.parentType === "dataRow" && e.dataField === "D2ShiftStart") { e.editorOptions.disabled = (e.row.data.D2isOff); }
            if (e.parentType === "dataRow" && e.dataField === "D2ShiftEnd") { e.editorOptions.disabled = (e.row.data.D2isOff); }
            if (e.parentType === "dataRow" && e.dataField === "D3OffTypeID") { e.editorOptions.disabled = (!e.row.data.D3isOff); }
            if (e.parentType === "dataRow" && e.dataField === "D3ShiftStart") { e.editorOptions.disabled = (e.row.data.D3isOff); }
            if (e.parentType === "dataRow" && e.dataField === "D3ShiftEnd") { e.editorOptions.disabled = (e.row.data.D3isOff); }
            if (e.parentType === "dataRow" && e.dataField === "D4OffTypeID") { e.editorOptions.disabled = (!e.row.data.D4isOff); }
            if (e.parentType === "dataRow" && e.dataField === "D4ShiftStart") { e.editorOptions.disabled = (e.row.data.D4isOff); }
            if (e.parentType === "dataRow" && e.dataField === "D4ShiftEnd") { e.editorOptions.disabled = (e.row.data.D4isOff); }
            if (e.parentType === "dataRow" && e.dataField === "D5OffTypeID") { e.editorOptions.disabled = (!e.row.data.D5isOff); }
            if (e.parentType === "dataRow" && e.dataField === "D5ShiftStart") { e.editorOptions.disabled = (e.row.data.D5isOff); }
            if (e.parentType === "dataRow" && e.dataField === "D5ShiftEnd") { e.editorOptions.disabled = (e.row.data.D5isOff); }
            if (e.parentType === "dataRow" && e.dataField === "D6OffTypeID") { e.editorOptions.disabled = (!e.row.data.D6isOff); }
            if (e.parentType === "dataRow" && e.dataField === "D6ShiftStart") { e.editorOptions.disabled = (e.row.data.D6isOff); }
            if (e.parentType === "dataRow" && e.dataField === "D6ShiftEnd") { e.editorOptions.disabled = (e.row.data.D6isOff); }
            if (e.parentType === "dataRow" && e.dataField === "D7OffTypeID") { e.editorOptions.disabled = (!e.row.data.D7isOff); }
            if (e.parentType === "dataRow" && e.dataField === "D7ShiftStart") { e.editorOptions.disabled = (e.row.data.D7isOff); }
            if (e.parentType === "dataRow" && e.dataField === "D7ShiftEnd") { e.editorOptions.disabled = (e.row.data.D7isOff); }

        },
        columns: [
            {
                caption: "Shift Plan",
                name: "main",
                columns: [
                    {
                        dataField: "ShowAllUsers", caption: $scope.trShowAll, visible: false, dataType: "boolean",
                        setCellValue: function (rowData, value) {
                            $scope.ShowAllUsers = !$scope.ShowAllUsers;
                            rowData.ShowAllUsers = value;
                            //rowData.NGUserID = null;
                        },
                    },
                    { dataField: "ShiftActualID", caption: "Name", visible: false, formItem: { visible: false } },
                    {
                        dataField: "StaffPositionID", caption: $scope.trStaffPosition,
                        visibleIndex: 0,
                        sortIndex: 0,
                        sortOrder: "asc",
                        //groupIndex: 0,
                        setCellValue: function (rowData, value) {
                            rowData.StaffPositionID = value;
                            rowData.NGUserID = null;
                        },
                        lookup: {
                            valueExpr: "id",
                            displayExpr: function (item) {
                                // "item" can be null
                                return item && item.OrderIndex + '-' + item.Name;
                            },
                            dataSource: {
                                store: DevExpress.data.AspNet.createStore({
                                    key: "id",
                                    loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStaffPositions",
                                    onBeforeSend: function (method, ajaxOptions) {
                                        var authData = localStorageService.get('authorizationData');
                                        if (authData) {
                                            ajaxOptions.headers = {
                                                Authorization: 'Bearer ' + authData.token,
                                                'Content-type': 'application/json'
                                            };
                                        }
                                    }
                                }),
                                sort: "OrderIndex",
                                headerFilter: { allowSearch: true }
                            }

                        },
                        validationRules: [{
                            type: "required",
                            message: "Possition is required"
                        }],
                        calculateSortValue: function (data) {
                            var value = this.calculateCellValue(data);
                            return this.lookup.calculateCellValue(value);
                        }
                    },
                    {
                        dataField: "NGUserID",
                        name: "NGUserIDHidden",
                        caption: $scope.trNGUser,
                        visible: false,
                        editable: true,
                        lookup: {
                            dataSource: function (options) {
                                var filtr = [];
                                if (options.data) {
                                    filtr.push(["StaffPositionID", "=", options.data.StaffPositionID]);
                                    if (!options.data.ShowAllUsers && !options.data.NGUserID) {
                                        filtr.push("and");
                                        filtr.push(["StoreID", "=", $scope.item.StoreID]);
                                    }
                                }
                                return {
                                    store: users,
                                    //filter: options.data ? [["StaffPositionID", "=", options.data.StaffPositionID],"and",["StoreID","=",$scope.item.StoreID]] : null
                                    filter: filtr
                                    //"StoreID='" + $scope.item.StoreID 
                                };
                            },
                            valueExpr: "id",
                            displayExpr: function (item) {
                                // "item" can be null
                                return item && item.FullName + ((item.LaborCostType) ? (' (' + item.LaborCostType.Name) + ') ' : '')
                                    + ((item.Store) ? ('[' + item.Store.name + ']') : '');
                            },
                        },
                        validationRules: [{
                            type: "required",
                            message: "Staff is required"
                        }]
                    },

                    {
                        dataField: "NGUserID",
                        caption: $scope.trNGUser,
                        visibleIndex: 1,
                        formItem: {
                            visible: false
                        },
                        lookup: {
                            valueExpr: "id",
                            displayExpr: function (item) {
                                // "item" can be null
                                //return item && item.FullName +' [' + item.LaborCostType + '](' +item.StoreName+')';
                                return item && item.FullName + ' [' + item.LaborCostType + ']' + ($scope.item && $scope.item.Store != item.StoreName ? ('(' + item.StoreName + ')') : '');
                            },
                            dataSource: {
                                store: DevExpress.data.AspNet.createStore({
                                    key: "id",
                                    loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxUserDetails",
                                    onBeforeSend: function (method, ajaxOptions) {
                                        var authData = localStorageService.get('authorizationData');
                                        if (authData) {
                                            ajaxOptions.headers = {
                                                Authorization: 'Bearer ' + authData.token,
                                                'Content-type': 'application/json'
                                            };
                                        }
                                    }
                                }),
                                filter: ($scope.item) ? ["StoreID", "=", $scope.item.StoreID] : null,
                                headerFilter: { allowSearch: true }
                            },
                            calculateSortValue: function (data) {
                                var value = this.calculateCellValue(data);
                                return this.lookup.calculateCellValue(value);
                            }
                        },
                    },
                    {
                        dataField: "D1OffTypeID", caption: $scope.trOffType,
                        visible: false,
                        lookup: {
                            valueExpr: "id",
                            displayExpr: "Name",
                            dataSource: {
                                store: DevExpress.data.AspNet.createStore({
                                    key: "id",
                                    loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStaffOffTypes",
                                    onBeforeSend: function (method, ajaxOptions) {
                                        var authData = localStorageService.get('authorizationData');
                                        if (authData) {
                                            ajaxOptions.headers = {
                                                Authorization: 'Bearer ' + authData.token,
                                                'Content-type': 'application/json'
                                            };
                                        }
                                    }
                                }),
                                sort: "name",
                                headerFilter: { allowSearch: true }
                            },
                            calculateSortValue: function (data) {
                                var value = this.calculateCellValue(data);
                                return this.lookup.calculateCellValue(value);
                            }
                        },
                        validationRules: [{
                            type: "custom",
                            validationCallback: function (e) {
                                return (!(e.data.D1isOff && e.value == null));
                            },
                            message: "Off Type is expected"
                        }]
                    },
                    {
                        dataField: "D1ShiftStart",
                        caption: $scope.trD1ShiftStart + " " + $scope.trStartShifts,
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    {
                        dataField: "D1ShiftEnd",
                        caption: $scope.trEndShift,
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    {
                        dataField: "D1IgnoreOvertime", caption: $scope.trIgnoreOvertime, visible: false, dataType: "boolean"
                    },
                    {
                        dataField: "D1isOff", caption: $scope.trIsOff, visible: false,
                        setCellValue: function (rowData, value) {
                            rowData.D1isOff = value;
                            rowData.D1OffTypeID = null;
                        }
                    },
                    {
                        dataField: "D2OffTypeID", caption: $scope.trOffType,
                        visible: false,

                        lookup: {
                            valueExpr: "id",
                            displayExpr: "Name",
                            dataSource: {
                                store: DevExpress.data.AspNet.createStore({
                                    key: "id",
                                    loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStaffOffTypes",
                                    onBeforeSend: function (method, ajaxOptions) {
                                        var authData = localStorageService.get('authorizationData');
                                        if (authData) {
                                            ajaxOptions.headers = {
                                                Authorization: 'Bearer ' + authData.token,
                                                'Content-type': 'application/json'
                                            };
                                        }
                                    }
                                }),
                                sort: "name",
                                headerFilter: { allowSearch: true }
                            },
                            calculateSortValue: function (data) {
                                var value = this.calculateCellValue(data);
                                return this.lookup.calculateCellValue(value);
                            }
                        },
                        validationRules: [{
                            type: "custom",
                            validationCallback: function (e) {
                                return (!(e.data.D2isOff && e.value == null));
                            },
                            message: "Off Type is expected"
                        }]
                    },
                    {
                        dataField: "D2ShiftStart",
                        caption: $scope.trD2ShiftStart + " " + $scope.trStartShifts,
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    {
                        dataField: "D2ShiftEnd",
                        caption: $scope.trEndShift,
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    {
                        dataField: "D2isOff", caption: $scope.trIsOff, visible: false, setCellValue: function (rowData, value) {
                            rowData.D2isOff = value;
                            rowData.D2OffTypeID = null;
                        }
                    },
                    {
                        dataField: "D2IgnoreOvertime", caption: $scope.trIgnoreOvertime, visible: false, dataType: "boolean"
                    },

                    {
                        dataField: "D3OffTypeID", caption: $scope.trOffType,
                        visible: false,
                        lookup: {
                            valueExpr: "id",
                            displayExpr: "Name",
                            dataSource: {
                                store: DevExpress.data.AspNet.createStore({
                                    key: "id",
                                    loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStaffOffTypes",
                                    onBeforeSend: function (method, ajaxOptions) {
                                        var authData = localStorageService.get('authorizationData');
                                        if (authData) {
                                            ajaxOptions.headers = {
                                                Authorization: 'Bearer ' + authData.token,
                                                'Content-type': 'application/json'
                                            };
                                        }
                                    }
                                }),
                                sort: "name",
                                headerFilter: { allowSearch: true }
                            },
                            calculateSortValue: function (data) {
                                var value = this.calculateCellValue(data);
                                return this.lookup.calculateCellValue(value);
                            }
                        },
                        validationRules: [{
                            type: "custom",
                            validationCallback: function (e) {
                                return (!(e.data.D3isOff && e.value == null));
                            },
                            message: "Off Type is expected"
                        }]
                    },
                    {
                        dataField: "D3ShiftStart",
                        caption: $scope.trD3ShiftStart + " " + $scope.trStartShifts,
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    {
                        dataField: "D3ShiftEnd",
                        caption: $scope.trEndShift,
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    {
                        dataField: "D3isOff", caption: $scope.trIsOff, visible: false, setCellValue: function (rowData, value) {
                            rowData.D3isOff = value;
                            rowData.D3OffTypeID = null;
                        }
                    },
                    {
                        dataField: "D3IgnoreOvertime", caption: $scope.trIgnoreOvertime, visible: false, dataType: "boolean"
                    },
                    {
                        dataField: "D4OffTypeID", caption: $scope.trOffType,
                        visible: false,
                        lookup: {
                            valueExpr: "id",
                            displayExpr: "Name",
                            dataSource: {
                                store: DevExpress.data.AspNet.createStore({
                                    key: "id",
                                    loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStaffOffTypes",
                                    onBeforeSend: function (method, ajaxOptions) {
                                        var authData = localStorageService.get('authorizationData');
                                        if (authData) {
                                            ajaxOptions.headers = {
                                                Authorization: 'Bearer ' + authData.token,
                                                'Content-type': 'application/json'
                                            };
                                        }
                                    }
                                }),
                                sort: "name",
                                headerFilter: { allowSearch: true }
                            },
                            calculateSortValue: function (data) {
                                var value = this.calculateCellValue(data);
                                return this.lookup.calculateCellValue(value);
                            }
                        },
                        validationRules: [{
                            type: "custom",
                            validationCallback: function (e) {
                                return (!(e.data.D4isOff && e.value == null));
                            },
                            message: "Off Type is expected"
                        }]
                    },
                    {
                        dataField: "D4ShiftStart",
                        caption: $scope.trD4ShiftStart + " " + $scope.trStartShifts,
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    {
                        dataField: "D4ShiftEnd",
                        caption: $scope.trEndShift,
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    {
                        dataField: "D4isOff", caption: $scope.trIsOff, visible: false, setCellValue: function (rowData, value) {
                            rowData.D4isOff = value;
                            rowData.D4OffTypeID = null;
                        }
                    },
                    {
                        dataField: "D4IgnoreOvertime", caption: $scope.trIgnoreOvertime, visible: false, dataType: "boolean"
                    },
                    {
                        dataField: "D5OffTypeID", caption: $scope.trOffType,
                        visible: false,
                        lookup: {
                            valueExpr: "id",
                            displayExpr: "Name",
                            dataSource: {
                                store: DevExpress.data.AspNet.createStore({
                                    key: "id",
                                    loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStaffOffTypes",
                                    onBeforeSend: function (method, ajaxOptions) {
                                        var authData = localStorageService.get('authorizationData');
                                        if (authData) {
                                            ajaxOptions.headers = {
                                                Authorization: 'Bearer ' + authData.token,
                                                'Content-type': 'application/json'
                                            };
                                        }
                                    }
                                }),
                                sort: "name",
                                headerFilter: { allowSearch: true }
                            },
                            calculateSortValue: function (data) {
                                var value = this.calculateCellValue(data);
                                return this.lookup.calculateCellValue(value);
                            }
                        },
                        validationRules: [{
                            type: "custom",
                            validationCallback: function (e) {
                                return (!(e.data.D5isOff && e.value == null));
                            },
                            message: "Off Type is expected"
                        }]
                    },
                    {
                        dataField: "D5ShiftStart",
                        caption: $scope.trD5ShiftStart + " " + $scope.trStartShifts,
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    {
                        dataField: "D5ShiftEnd",
                        caption: $scope.trEndShift,
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    {
                        dataField: "D5isOff", caption: $scope.trIsOff, visible: false, setCellValue: function (rowData, value) {
                            rowData.D5isOff = value;
                            rowData.D5OffTypeID = null;
                        }
                    },
                    {
                        dataField: "D5IgnoreOvertime", caption: $scope.trIgnoreOvertime, visible: false, dataType: "boolean"
                    },
                    {
                        dataField: "D6OffTypeID", caption: $scope.trOffType,
                        visible: false,
                        lookup: {
                            valueExpr: "id",
                            displayExpr: "Name",
                            dataSource: {
                                store: DevExpress.data.AspNet.createStore({
                                    key: "id",
                                    loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStaffOffTypes",
                                    onBeforeSend: function (method, ajaxOptions) {
                                        var authData = localStorageService.get('authorizationData');
                                        if (authData) {
                                            ajaxOptions.headers = {
                                                Authorization: 'Bearer ' + authData.token,
                                                'Content-type': 'application/json'
                                            };
                                        }
                                    }
                                }),
                                sort: "name",
                                headerFilter: { allowSearch: true }
                            },
                            calculateSortValue: function (data) {
                                var value = this.calculateCellValue(data);
                                return this.lookup.calculateCellValue(value);
                            }
                        },
                        validationRules: [{
                            type: "custom",
                            validationCallback: function (e) {
                                return (!(e.data.D6isOff && e.value == null));
                            },
                            message: "Off Type is expected"
                        }]
                    },
                    {
                        dataField: "D6ShiftStart",
                        caption: $scope.trD6ShiftStart + " " + $scope.trStartShifts,
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    {
                        dataField: "D6ShiftEnd",
                        caption: $scope.trEndShift,
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    {
                        dataField: "D6isOff", caption: $scope.trIsOff, visible: false, setCellValue: function (rowData, value) {
                            rowData.D6isOff = value;
                            rowData.D6OffTypeID = null;
                        }
                    },
                    {
                        dataField: "D6IgnoreOvertime", caption: $scope.trIgnoreOvertime, visible: false, dataType: "boolean"
                    },
                    {
                        dataField: "D7OffTypeID", caption: $scope.trOffType,
                        visible: false,
                        lookup: {
                            valueExpr: "id",
                            displayExpr: "Name",
                            dataSource: {
                                store: DevExpress.data.AspNet.createStore({
                                    key: "id",
                                    loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStaffOffTypes",
                                    onBeforeSend: function (method, ajaxOptions) {
                                        var authData = localStorageService.get('authorizationData');
                                        if (authData) {
                                            ajaxOptions.headers = {
                                                Authorization: 'Bearer ' + authData.token,
                                                'Content-type': 'application/json'
                                            };
                                        }
                                    }
                                }),
                                sort: "name",
                                headerFilter: { allowSearch: true }
                            },
                            calculateSortValue: function (data) {
                                var value = this.calculateCellValue(data);
                                return this.lookup.calculateCellValue(value);
                            }
                        },
                        validationRules: [{
                            type: "custom",
                            validationCallback: function (e) {
                                return (!(e.data.D7isOff && e.value == null));
                            },
                            message: "Off Type is expected"
                        }]
                    },
                    {
                        dataField: "D7ShiftStart",
                        caption: $scope.trD7ShiftStart + " " + $scope.trStartShifts,
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    {
                        dataField: "D7ShiftEnd",
                        caption: $scope.trEndShift,
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    {
                        dataField: "D7isOff", caption: $scope.trIsOff, visible: false, setCellValue: function (rowData, value) {
                            rowData.D7isOff = value;
                            rowData.D7OffTypeID = null;
                        }
                    },
                    { dataField: "D7IgnoreOvertime", caption: $scope.trIgnoreOvertime, visible: false, dataType: "boolean" },
                    { caption: $scope.trD1ShiftStart, name: "Monday", dataField: "Monday", visibleIndex: 5 },
                    { caption: $scope.trD2ShiftStart, name: "Tuesday", dataField: "Tuesday", visibleIndex: 6 },
                    { caption: $scope.trD3ShiftStart, name: "Wednesday", dataField: "Wednesday", visibleIndex: 7 },
                    { caption: $scope.trD4ShiftStart, name: "Thursday", dataField: "Thursday", visibleIndex: 8 },
                    { caption: $scope.trD5ShiftStart, name: "Friday", dataField: "Friday", visibleIndex: 9 },
                    { caption: $scope.trD6ShiftStart, name: "Saturday", dataField: "Saturday", visibleIndex: 10 },
                    { caption: $scope.trD7ShiftStart, name: "Sunday", dataField: "Sunday", visibleIndex: 11 },
                    {
                        caption: $scope.trTotalHours,
                        name: "NormalHours",
                        dataField: "NormalHours",
                        visibleIndex: 12,
                        format: { type: "fixedPoint", precision: 2 }
                    },
                    {
                        caption: $scope.Vacations,
                        name: "vacations",
                        columns: [
                            {
                                caption: $scope.Paid,
                                name: "Paid",
                                dataField: "Paid",
                                format: { type: "fixedPoint", precision: 2 }
                            },
                            {
                                caption: $scope.Free,
                                name: "Free",
                                dataField: "Free",
                                format: { type: "fixedPoint", precision: 2 }
                            }]
                    },
                    //GetOffPaidHours(userID, isOff, StaffOffTypeID)
                    {
                        caption: $scope.trOvertime,
                        name: "OvertimeHours",
                        dataField: "OvertimeHours",
                        format: { type: "fixedPoint", precision: 2 }
                    },
                    {
                        caption: "Wage",
                        name: "Wage",
                        dataField: "Wage",
                        visible: false,
                        format: { type: "fixedPoint", precision: 2 }
                    },
                    {
                        caption: $scope.trTotalAmount,
                        name: "TotalAmount",
                        dataField: "TotalAmount",
                        format: { type: "fixedPoint", precision: 2 }
                    },

                ]
            }
        ],
        summary: {
            totalItems: [
                { column: $scope.Paid, name: "paid", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
                { column: $scope.Free, name: "free", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
                { column: "NormalHours", name: "NormalHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
                { column: "OvertimeHours", name: "OvertimeHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
                { column: "TotalAmount", name: "TotalAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
                { name: "GrandTotal", showInColumn: "TotalAmount", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "+TC:{0}" },
                { name: "StaffD1", showInColumn: "Monday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "Staff:{0}" },
                { name: "StaffD2", showInColumn: "Tuesday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "Staff:{0}" },
                { name: "StaffD3", showInColumn: "Wednesday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "Staff:{0}" },
                { name: "StaffD4", showInColumn: "Thursday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "Staff:{0}" },
                { name: "StaffD5", showInColumn: "Friday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "Staff:{0}" },
                { name: "StaffD6", showInColumn: "Saturday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "Staff:{0}" },
                { name: "StaffD7", showInColumn: "Sunday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "Staff:{0}" },
                { name: "NormalHoursD1", showInColumn: "Monday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "Hours:{0}" },
                { name: "NormalHoursD2", showInColumn: "Tuesday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "Hours:{0}" },
                { name: "NormalHoursD3", showInColumn: "Wednesday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "Hours:{0}" },
                { name: "NormalHoursD4", showInColumn: "Thursday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "Hours:{0}" },
                { name: "NormalHoursD5", showInColumn: "Friday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "Hours:{0}" },
                { name: "NormalHoursD6", showInColumn: "Saturday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "Hours:{0}" },
                { name: "NormalHoursD7", showInColumn: "Sunday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "Hours:{0}" },
                { name: "OvertimeHoursD1", showInColumn: "Monday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "OverT:{0}" },
                { name: "OvertimeHoursD2", showInColumn: "Tuesday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "OverT:{0}" },
                { name: "OvertimeHoursD3", showInColumn: "Wednesday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "OverT:{0}" },
                { name: "OvertimeHoursD4", showInColumn: "Thursday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "OverT:{0}" },
                { name: "OvertimeHoursD5", showInColumn: "Friday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "OverT:{0}" },
                { name: "OvertimeHoursD6", showInColumn: "Saturday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "OverT:{0}" },
                { name: "OvertimeHoursD7", showInColumn: "Sunday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "OverT:{0}" },
                { name: "TX_1", showInColumn: "Monday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "Del TC:{0}" },
                { name: "TX_2", showInColumn: "Tuesday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "Del TC:{0}" },
                { name: "TX_3", showInColumn: "Wednesday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "Del TC:{0}" },
                { name: "TX_4", showInColumn: "Thursday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "Del TC:{0}" },
                { name: "TX_5", showInColumn: "Friday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "Del TC:{0}" },
                { name: "TX_6", showInColumn: "Saturday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "Del TC:{0}" },
                { name: "TX_7", showInColumn: "Sunday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "Del TC:{0}" },
                { name: "LaborD1", showInColumn: "Monday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "Cost:{0}" },
                { name: "LaborD2", showInColumn: "Tuesday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "Cost:{0}" },
                { name: "LaborD3", showInColumn: "Wednesday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "Cost:{0}" },
                { name: "LaborD4", showInColumn: "Thursday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "Cost:{0}" },
                { name: "LaborD5", showInColumn: "Friday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "Cost:{0}" },
                { name: "LaborD6", showInColumn: "Saturday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "Cost:{0}" },
                { name: "LaborD7", showInColumn: "Sunday", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "Cost:{0}" },

            ],
            calculateCustomSummary: function (options) {
                if (options.name === "StaffD1") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue += (GetNormalHours(options.value.D1ShiftStart, options.value.D1ShiftEnd, options.value.D1isOff, options.value.D1IgnoreOvertime, options.value.NGUserID) > 0 ? 1 : 0);
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue;
                            break;
                    }
                }
                if (options.name === "StaffD2") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue += (GetNormalHours(options.value.D2ShiftStart, options.value.D2ShiftEnd, options.value.D2isOff, options.value.D2IgnoreOvertime, options.value.NGUserID) > 0 ? 1 : 0);
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue;
                            break;
                    }
                }
                if (options.name === "StaffD3") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue += (GetNormalHours(options.value.D3ShiftStart, options.value.D3ShiftEnd, options.value.D3isOff, options.value.D3IgnoreOvertime, options.value.NGUserID) > 0 ? 1 : 0);
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue;
                            break;
                    }
                }
                if (options.name === "StaffD4") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue += (GetNormalHours(options.value.D4ShiftStart, options.value.D4ShiftEnd, options.value.D4isOff, options.value.D4IgnoreOvertime, options.value.NGUserID) > 0 ? 1 : 0);
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue;
                            break;
                    }
                }
                if (options.name === "StaffD5") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue += (GetNormalHours(options.value.D5ShiftStart, options.value.D5ShiftEnd, options.value.D5isOff, options.value.D5IgnoreOvertime, options.value.NGUserID) > 0 ? 1 : 0);
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue;
                            break;
                    }
                }
                if (options.name === "StaffD6") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue += (GetNormalHours(options.value.D6ShiftStart, options.value.D6ShiftEnd, options.value.D6isOff, options.value.D6IgnoreOvertime, options.value.NGUserID) > 0 ? 1 : 0);
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue;
                            break;
                    }
                }
                if (options.name === "StaffD7") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue += (GetNormalHours(options.value.D7ShiftStart, options.value.D7ShiftEnd, options.value.D7isOff, options.value.D7IgnoreOvertime, options.value.NGUserID) > 0 ? 1 : 0);
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue;
                            break;
                    }
                }
                if (options.name === "NormalHoursD1") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue + (GetNormalHours(options.value.D1ShiftStart, options.value.D1ShiftEnd, options.value.D1isOff, options.value.D1IgnoreOvertime, options.value.NGUserID));
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue;
                            break;
                    }
                }
                if (options.name === "NormalHoursD2") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue + (GetNormalHours(options.value.D2ShiftStart, options.value.D2ShiftEnd, options.value.D2isOff, options.value.D2IgnoreOvertime, options.value.NGUserID));
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue;
                            break;
                    }
                }
                if (options.name === "NormalHoursD3") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue + (GetNormalHours(options.value.D3ShiftStart, options.value.D3ShiftEnd, options.value.D3isOff, options.value.D3IgnoreOvertime, options.value.NGUserID));
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue;
                            break;
                    }
                }
                if (options.name === "NormalHoursD4") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue + (GetNormalHours(options.value.D4ShiftStart, options.value.D4ShiftEnd, options.value.D4isOff, options.value.D4IgnoreOvertime, options.value.NGUserID));
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue;
                            break;
                    }
                }
                if (options.name === "NormalHoursD5") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue + (GetNormalHours(options.value.D5ShiftStart, options.value.D5ShiftEnd, options.value.D5isOff, options.value.D5IgnoreOvertime, options.value.NGUserID));
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue;
                            break;
                    }
                }
                if (options.name === "NormalHoursD6") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue + (GetNormalHours(options.value.D6ShiftStart, options.value.D6ShiftEnd, options.value.D6isOff, options.value.D6IgnoreOvertime, options.value.NGUserID));
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue;
                            break;
                    }
                }
                if (options.name === "NormalHoursD7") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue + (GetNormalHours(options.value.D7ShiftStart, options.value.D7ShiftEnd, options.value.D7isOff, options.value.D7IgnoreOvertime, options.value.NGUserID));
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue;
                            break;
                    }
                }
                if (options.name === "OvertimeHoursD1") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue + (GetOvertimeHours(options.value.D1ShiftStart, options.value.D1ShiftEnd, options.value.D1isOff, options.value.D1IgnoreOvertime, options.value.NGUserID));
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue;
                            break;
                    }
                }
                if (options.name === "OvertimeHoursD2") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue + (GetOvertimeHours(options.value.D2ShiftStart, options.value.D2ShiftEnd, options.value.D2isOff, options.value.D2IgnoreOvertime, options.value.NGUserID));
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue;
                            break;
                    }
                }
                if (options.name === "OvertimeHoursD3") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue + (GetOvertimeHours(options.value.D3ShiftStart, options.value.D3ShiftEnd, options.value.D3isOff, options.value.D3IgnoreOvertime, options.value.NGUserID));
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue;
                            break;
                    }
                }
                if (options.name === "OvertimeHoursD4") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue + (GetOvertimeHours(options.value.D4ShiftStart, options.value.D4ShiftEnd, options.value.D4isOff, options.value.D4IgnoreOvertime, options.value.NGUserID));
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue;
                            break;
                    }
                }
                if (options.name === "OvertimeHoursD5") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue + (GetOvertimeHours(options.value.D5ShiftStart, options.value.D5ShiftEnd, options.value.D5isOff, options.value.D5IgnoreOvertime, options.value.NGUserID));
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue;
                            break;
                    }
                }
                if (options.name === "OvertimeHoursD6") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue + (GetOvertimeHours(options.value.D6ShiftStart, options.value.D6ShiftEnd, options.value.D6isOff, options.value.D6IgnoreOvertime, options.value.NGUserID));
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue;
                            break;
                    }
                }
                if (options.name === "OvertimeHoursD7") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue + (GetOvertimeHours(options.value.D7ShiftStart, options.value.D7ShiftEnd, options.value.D7isOff, options.value.D7IgnoreOvertime, options.value.NGUserID));
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue;
                            break;
                    }
                }
                if (options.name === "LaborD1") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue + (LaborCost(options.value.D1ShiftStart, options.value.D1ShiftEnd, options.value.D1isOff, options.value.D1IgnoreOvertime, options.value.NGUserID, options.value.StaffPositionID, options.value.D1OffTypeID));
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue + GetTXWage(1);;
                            break;
                    }
                }
                if (options.name === "LaborD2") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue + (LaborCost(options.value.D2ShiftStart, options.value.D2ShiftEnd, options.value.D2isOff, options.value.D2IgnoreOvertime, options.value.NGUserID, options.value.StaffPositionID, options.value.D2OffTypeID));
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue + GetTXWage(2);;
                            break;
                    }
                }
                if (options.name === "LaborD3") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue + (LaborCost(options.value.D3ShiftStart, options.value.D3ShiftEnd, options.value.D3isOff, options.value.D3IgnoreOvertime, options.value.NGUserID, options.value.StaffPositionID, options.value.D3OffTypeID));
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue + GetTXWage(3);;
                            break;
                    }
                }
                if (options.name === "LaborD4") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue + (LaborCost(options.value.D4ShiftStart, options.value.D4ShiftEnd, options.value.D4isOff, options.value.D4IgnoreOvertime, options.value.NGUserID, options.value.StaffPositionID, options.value.D4OffTypeID));
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue + GetTXWage(4);;
                            break;
                    }
                }
                if (options.name === "LaborD5") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue + (LaborCost(options.value.D5ShiftStart, options.value.D5ShiftEnd, options.value.D5isOff, options.value.D5IgnoreOvertime, options.value.NGUserID, options.value.StaffPositionID, options.value.D5OffTypeID));
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue + GetTXWage(5);;
                            break;
                    }
                }
                if (options.name === "LaborD6") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue + (LaborCost(options.value.D6ShiftStart, options.value.D6ShiftEnd, options.value.D6isOff, options.value.D6IgnoreOvertime, options.value.NGUserID, options.value.StaffPositionID, options.value.D6OffTypeID));
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue + GetTXWage(6);;
                            break;
                    }
                }
                if (options.name === "LaborD7") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue + (LaborCost(options.value.D7ShiftStart, options.value.D7ShiftEnd, options.value.D7isOff, options.value.D7IgnoreOvertime, options.value.NGUserID, options.value.StaffPositionID, options.value.D7OffTypeID));
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue + GetTXWage(7);
                            break;
                    }
                }
                if (options.name === "TX_1") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            //options.totalValue = options.totalValue + (GetTCTotal(1));
                            break;
                        case "finalize":
                            options.totalValue = GetTCTotal(1);
                            break;
                    }
                }
                if (options.name === "TX_2") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            //options.totalValue = options.totalValue + (GetTCTotal(1));
                            break;
                        case "finalize":
                            options.totalValue = GetTCTotal(2);
                            break;
                    }
                }
                if (options.name === "TX_3") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            //options.totalValue = options.totalValue + (GetTCTotal(1));
                            break;
                        case "finalize":
                            options.totalValue = GetTCTotal(3);
                            break;
                    }
                }
                if (options.name === "TX_4") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            //options.totalValue = options.totalValue + (GetTCTotal(1));
                            break;
                        case "finalize":
                            options.totalValue = GetTCTotal(4);
                            break;
                    }
                }
                if (options.name === "TX_5") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            //options.totalValue = options.totalValue + (GetTCTotal(1));
                            break;
                        case "finalize":
                            options.totalValue = GetTCTotal(5);
                            break;
                    }
                }
                if (options.name === "TX_6") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            //options.totalValue = options.totalValue + (GetTCTotal(1));
                            break;
                        case "finalize":
                            options.totalValue = GetTCTotal(6);
                            break;
                    }
                }
                if (options.name === "TX_7") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            //options.totalValue = options.totalValue + (GetTCTotal(1));
                            break;
                        case "finalize":
                            options.totalValue = GetTCTotal(7);
                            break;
                    }
                }
                if (options.name === "GrandTotal") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            options.totalValue += options.value.TotalAmount
                            // (LaborCost(options.value.D1ShiftStart, options.value.D1ShiftEnd, options.value.D1isOff, options.value.D1IgnoreOvertime, options.value.NGUserID, options.value.StaffPositionID, options.value.D1OffTypeID) +
                            // LaborCost(options.value.D2ShiftStart, options.value.D2ShiftEnd, options.value.D2isOff, options.value.D2IgnoreOvertime, options.value.NGUserID, options.value.StaffPositionID, options.value.D2OffTypeID) +
                            // LaborCost(options.value.D3ShiftStart, options.value.D3ShiftEnd, options.value.D3isOff, options.value.D3IgnoreOvertime, options.value.NGUserID, options.value.StaffPositionID, options.value.D3OffTypeID) +
                            // LaborCost(options.value.D4ShiftStart, options.value.D4ShiftEnd, options.value.D4isOff, options.value.D4IgnoreOvertime, options.value.NGUserID, options.value.StaffPositionID, options.value.D4OffTypeID) +
                            // LaborCost(options.value.D5ShiftStart, options.value.D5ShiftEnd, options.value.D5isOff, options.value.D5IgnoreOvertime, options.value.NGUserID, options.value.StaffPositionID, options.value.D5OffTypeID) +
                            // LaborCost(options.value.D6ShiftStart, options.value.D6ShiftEnd, options.value.D6isOff, options.value.D6IgnoreOvertime, options.value.NGUserID, options.value.StaffPositionID, options.value.D6OffTypeID) +
                            // LaborCost(options.value.D7ShiftStart, options.value.D7ShiftEnd, options.value.D7isOff, options.value.D7IgnoreOvertime, options.value.NGUserID, options.value.StaffPositionID, options.value.D7OffTypeID));
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue + (GetTXWage(1) + GetTXWage(2) + GetTXWage(3) + GetTXWage(4) + GetTXWage(5) + GetTXWage(6) + GetTXWage(7))
                            //options.totalValue =  (GetTXWage(1) + GetTXWage(2) + GetTXWage(3) + GetTXWage(4) + GetTXWage(5) + GetTXWage(6) + GetTXWage(7))
                            break;
                    }
                }

                // function (data) {
                //     return LaborCost(data.D1ShiftStart, data.D1ShiftEnd, data.D1isOff, data.D1IgnoreOvertime, data.NGUserID, data.StaffPositionID) +
                //         LaborCost(data.D2ShiftStart, data.D2ShiftEnd, data.D2isOff, data.D2IgnoreOvertime, data.NGUserID, data.StaffPositionID) +
                //         LaborCost(data.D3ShiftStart, data.D3ShiftEnd, data.D3isOff, data.D3IgnoreOvertime, data.NGUserID, data.StaffPositionID) +
                //         LaborCost(data.D4ShiftStart, data.D4ShiftEnd, data.D4isOff, data.D4IgnoreOvertime, data.NGUserID, data.StaffPositionID) +
                //         LaborCost(data.D5ShiftStart, data.D5ShiftEnd, data.D5isOff, data.D5IgnoreOvertime, data.NGUserID, data.StaffPositionID) +
                //         LaborCost(data.D6ShiftStart, data.D6ShiftEnd, data.D6isOff, data.D6IgnoreOvertime, data.NGUserID, data.StaffPositionID) +
                //         LaborCost(data.D7ShiftStart, data.D7ShiftEnd, data.D7isOff, data.D7IgnoreOvertime, data.NGUserID, data.StaffPositionID);
            }
        },
        onDataErrorOccurred: function (e) {
            console.log(e.error);
        },
        onCellPrepared: function (e) {
            if (e.rowType == 'data' || e.rowType == 'group') {
                if (e.data.D1isOff) {
                    if (e.column.name === 'Monday') {
                        e.cellElement.css({ 'background-color': '#DCDCDC' });
                        if (typeof e.row.data.D1OffTypeID !== "number")
                            e.cellElement.css({ 'color': '#f00' });
                    }

                }
                else {
                    if ((e.data.D1ShiftStart == null || e.data.D1ShiftEnd == null)) {
                        if (e.column.name === 'Monday') {
                            e.cellElement.css({ 'background-color': '#FF0000', 'color': '#f00' });
                        }
                    }
                    else {
                        if (SumHours(e.data.D1ShiftStart, e.data.D1ShiftEnd, e.data.D1isOff, e.data.D1IgnoreOvertime) == 0 || SumHours(e.data.D1ShiftStart, e.data.D1ShiftEnd, e.data.D1isOff, e.data.D1IgnoreOvertime, e.data.NGUserID) > 8.0) {
                            if (e.column.name === 'Monday') {
                                e.cellElement.css({ 'color': '#f00' });
                            }
                        }
                    }
                }

                if (e.data.D2isOff) {
                    if (e.column.name === 'Tuesday') {
                        e.cellElement.css({ 'background-color': '#DCDCDC' });
                        if (typeof e.row.data.D2OffTypeID !== "number")
                            e.cellElement.css({ 'color': '#f00' });
                    }
                }
                else {
                    if ((e.data.D2ShiftStart == null || e.data.D2ShiftEnd == null)) {
                        if (e.column.name === 'Tuesday') {
                            e.cellElement.css({ 'background-color': '#FF0000', 'color': '#f00' });
                        }
                    }
                    else {
                        if (SumHours(e.data.D2ShiftStart, e.data.D2ShiftEnd, e.data.D2isOff, e.data.D2IgnoreOvertime) == 0 || SumHours(e.data.D2ShiftStart, e.data.D2ShiftEnd, e.data.D2isOff, e.data.D2IgnoreOvertime, e.data.NGUserID) > 8.0) {
                            if (e.column.name === 'Tuesday') {
                                e.cellElement.css({ 'color': '#f00' });
                            }
                        }
                    }
                }
                if (e.data.D3isOff) {
                    if (e.column.name === 'Wednesday') {
                        e.cellElement.css({ 'background-color': '#DCDCDC' });
                        if (typeof e.row.data.D3OffTypeID !== "number")
                            e.cellElement.css({ 'color': '#f00' });
                    }
                }
                else {
                    if ((e.data.D3ShiftStart == null || e.data.D3ShiftEnd == null)) {
                        if (e.column.name === 'Wednesday') {
                            e.cellElement.css({ 'background-color': '#FF0000', 'color': '#f00' });
                        }
                    }
                    else {
                        if (SumHours(e.data.D3ShiftStart, e.data.D3ShiftEnd, e.data.D3isOff, e.data.D3IgnoreOvertime) == 0 || SumHours(e.data.D3ShiftStart, e.data.D3ShiftEnd, e.data.D3isOff, e.data.D3IgnoreOvertime, e.data.NGUserID) > 8.0) {
                            if (e.column.name === 'Wednesday') {
                                e.cellElement.css({ 'color': '#f00' });
                            }
                        }
                    }
                }
                if (e.data.D4isOff) {
                    if (e.column.name === 'Thursday') {
                        e.cellElement.css({ 'background-color': '#DCDCDC' });
                        if (typeof e.row.data.D4OffTypeID !== "number")
                            e.cellElement.css({ 'color': '#f00' });
                    }
                }
                else {
                    if ((e.data.D4ShiftStart == null || e.data.D4ShiftEnd == null)) {
                        if (e.column.name === 'Thursday') {
                            e.cellElement.css({ 'background-color': '#FF0000', 'color': '#f00' });
                        }
                    }
                    else {
                        if (SumHours(e.data.D4ShiftStart, e.data.D4ShiftEnd, e.data.D4isOff, e.data.D4IgnoreOvertime) == 0 || SumHours(e.data.D4ShiftStart, e.data.D4ShiftEnd, e.data.D4isOff, e.data.D4IgnoreOvertime, e.data.NGUserID) > 8.0) {
                            if (e.column.name === 'Thursday') {
                                e.cellElement.css({ 'color': '#f00' });
                            }
                        }
                    }
                }
                if (e.data.D5isOff) {
                    if (e.column.name === 'Friday') {
                        e.cellElement.css({ 'background-color': '#DCDCDC' });
                        if (typeof e.row.data.D5OffTypeID !== "number")
                            e.cellElement.css({ 'color': '#f00' });
                    }
                }
                else {
                    if ((e.data.D5ShiftStart == null || e.data.D5ShiftEnd == null)) {
                        if (e.column.name === 'Friday') {
                            e.cellElement.css({ 'background-color': '#FF0000', 'color': '#f00' });
                        }
                    }
                    else {
                        if (SumHours(e.data.D5ShiftStart, e.data.D5ShiftEnd, e.data.D5isOff, e.data.D5IgnoreOvertime) == 0 || SumHours(e.data.D5ShiftStart, e.data.D5ShiftEnd, e.data.D5isOff, e.data.D5IgnoreOvertime, e.data.NGUserID) > 8.0) {
                            if (e.column.name === 'Friday') {
                                e.cellElement.css({ 'color': '#f00' });
                            }
                        }
                    }
                }
                if (e.data.D6isOff) {
                    if (e.column.name === 'Saturday') {
                        e.cellElement.css({ 'background-color': '#DCDCDC' });
                        if (typeof e.row.data.D6OffTypeID !== "number")
                            e.cellElement.css({ 'color': '#f00' });
                    }
                }
                else {
                    if ((e.data.D6ShiftStart == null || e.data.D6ShiftEnd == null)) {
                        if (e.column.name === 'Saturday') {
                            e.cellElement.css({ 'background-color': '#FF0000', 'color': '#f00' });
                        }
                    }
                    else {
                        if (SumHours(e.data.D6ShiftStart, e.data.D6ShiftEnd, e.data.D6isOff, e.data.D6IgnoreOvertime) == 0 || SumHours(e.data.D6ShiftStart, e.data.D6ShiftEnd, e.data.D6isOff, e.data.D6IgnoreOvertime, e.data.NGUserID) > 8.0) {
                            if (e.column.name === 'Saturday') {
                                e.cellElement.css({ 'color': '#f00' });
                            }
                        }
                    }
                }
                if (e.data.D7isOff) {
                    if (e.column.name === 'Sunday') {
                        e.cellElement.css({ 'background-color': '#DCDCDC' });
                        if (typeof e.row.data.D7OffTypeID !== "number")
                            e.cellElement.css({ 'color': '#f00' });
                    }
                }
                else {
                    if ((e.data.D7ShiftStart == null || e.data.D7ShiftEnd == null)) {
                        if (e.column.name === 'Sunday') {
                            e.cellElement.css({ 'background-color': '#FF0000', 'color': '#f00' });

                        }
                    }
                    else {
                        if (SumHours(e.data.D7ShiftStart, e.data.D7ShiftEnd, e.data.D7isOff, e.data.D7IgnoreOvertime) == 0 || SumHours(e.data.D7ShiftStart, e.data.D7ShiftEnd, e.data.D7isOff, e.data.D7IgnoreOvertime, e.data.NGUserID) > 8.0) {
                            if (e.column.name === 'Sunday') {
                                e.cellElement.css({ 'color': '#f00' });
                            }
                        }
                    }
                }
            }
        },
        export: {
            enabled: true, fileName: "ShiftPlan",
            customizeExcelCell: (options) => {
                var gridCell = options.gridCell;
                if (!gridCell) {
                    return;
                }
                if (gridCell.rowType === 'data') {

                    if (gridCell.data.D1isOff) {
                        if (gridCell.column.name === 'Monday') {
                            options.backgroundColor = '#DCDCDC';
                            if (typeof gridCell.data.D1OffTypeID !== "number")
                                options.font.color = '#FF0000';
                        }
                    }
                    else {
                        if ((gridCell.data.D1ShiftStart == null || gridCell.data.D1ShiftEnd == null)) {
                            if (gridCell.column.name === 'Monday') {
                                options.backgroundColor = '#FF0000';
                            }
                        }
                        else {
                            if (SumHours(gridCell.data.D1ShiftStart, gridCell.data.D1ShiftEnd, gridCell.data.D1isOff, gridCell.data.D1IgnoreOvertime) == 0 || SumHours(gridCell.data.D1ShiftStart, gridCell.data.D1ShiftEnd, gridCell.data.D1isOff, gridCell.data.D1IgnoreOvertime, gridCell.data.NGUserID) > 8.0) {
                                if (gridCell.column.name === 'Monday')
                                    options.font.color = '#FF0000';
                            }
                        }
                    }
                }
                if (gridCell.rowType === 'data') {

                    if (gridCell.data.D2isOff) {
                        if (gridCell.column.name === 'Tuesday') {
                            options.backgroundColor = '#DCDCDC';
                            if (typeof gridCell.data.D2OffTypeID !== "number")
                                options.font.color = '#FF0000';
                        }
                    }
                    else {
                        if ((gridCell.data.D2ShiftStart == null || gridCell.data.D2ShiftEnd == null)) {
                            if (gridCell.column.name === 'Tuesday') {
                                options.backgroundColor = '#FF0000';
                            }
                        }
                        else {
                            if (SumHours(gridCell.data.D2ShiftStart, gridCell.data.D2ShiftEnd, gridCell.data.D2isOff, gridCell.data.D2IgnoreOvertime) == 0 || SumHours(gridCell.data.D2ShiftStart, gridCell.data.D2ShiftEnd, gridCell.data.D2isOff, gridCell.data.D2IgnoreOvertime, gridCell.data.NGUserID) > 8.0) {
                                if (gridCell.column.name === 'Tuesday')
                                    options.font.color = '#FF0000';
                            }
                        }
                    }
                }
                if (gridCell.rowType === 'data') {

                    if (gridCell.data.D3isOff) {
                        if (gridCell.column.name === 'Wednesday') {
                            options.backgroundColor = '#DCDCDC';
                            if (typeof gridCell.data.D3OffTypeID !== "number")
                                options.font.color = '#FF0000';
                        }
                    }
                    else {
                        if ((gridCell.data.D3ShiftStart == null || gridCell.data.D3ShiftEnd == null)) {
                            if (gridCell.column.name === 'Wednesday') {
                                options.backgroundColor = '#FF0000';
                            }
                        }
                        else {
                            if (SumHours(gridCell.data.D3ShiftStart, gridCell.data.D3ShiftEnd, gridCell.data.D3isOff, gridCell.data.D3IgnoreOvertime) == 0 || SumHours(gridCell.data.D3ShiftStart, gridCell.data.D3ShiftEnd, gridCell.data.D3isOff, gridCell.data.D3IgnoreOvertime, gridCell.data.NGUserID) > 8.0) {
                                if (gridCell.column.name === 'Wednesday')
                                    options.font.color = '#FF0000';
                            }
                        }
                    }
                }
                if (gridCell.rowType === 'data') {

                    if (gridCell.data.D4isOff) {
                        if (gridCell.column.name === 'Thursday') {
                            options.backgroundColor = '#DCDCDC';
                            if (typeof gridCell.data.D4OffTypeID !== "number")
                                options.font.color = '#FF0000';
                        }
                    }
                    else {
                        if ((gridCell.data.D4ShiftStart == null || gridCell.data.D4ShiftEnd == null)) {
                            if (gridCell.column.name === 'Thursday') {
                                options.backgroundColor = '#FF0000';
                            }
                        }
                        else {
                            if (SumHours(gridCell.data.D4ShiftStart, gridCell.data.D4ShiftEnd, gridCell.data.D4isOff, gridCell.data.D4IgnoreOvertime) == 0 || SumHours(gridCell.data.D4ShiftStart, gridCell.data.D4ShiftEnd, gridCell.data.D4isOff, gridCell.data.D4IgnoreOvertime, gridCell.data.NGUserID) > 8.0) {
                                if (gridCell.column.name === 'Thursday')
                                    options.font.color = '#FF0000';
                            }
                        }
                    }
                }
                if (gridCell.rowType === 'data') {

                    if (gridCell.data.D5isOff) {
                        if (gridCell.column.name === 'Friday') {
                            options.backgroundColor = '#DCDCDC';
                            if (typeof gridCell.data.D5OffTypeID !== "number")
                                options.font.color = '#FF0000';
                        }
                    }
                    else {
                        if ((gridCell.data.D5ShiftStart == null || gridCell.data.D5ShiftEnd == null)) {
                            if (gridCell.column.name === 'Friday') {
                                options.backgroundColor = '#FF0000';
                            }
                        }
                        else {
                            if (SumHours(gridCell.data.D5ShiftStart, gridCell.data.D5ShiftEnd, gridCell.data.D5isOff, gridCell.data.D5IgnoreOvertime) == 0 || SumHours(gridCell.data.D5ShiftStart, gridCell.data.D5ShiftEnd, gridCell.data.D5isOff, gridCell.data.D5IgnoreOvertime, gridCell.data.NGUserID) > 8.0) {
                                if (gridCell.column.name === 'Friday')
                                    options.font.color = '#FF0000';
                            }
                        }
                    }
                }
                if (gridCell.rowType === 'data') {

                    if (gridCell.data.D6isOff) {
                        if (gridCell.column.name === 'Saturday') {
                            options.backgroundColor = '#DCDCDC';
                            if (typeof gridCell.data.D6OffTypeID !== "number")
                                options.font.color = '#FF0000';
                        }
                    }
                    else {
                        if ((gridCell.data.D6ShiftStart == null || gridCell.data.D6ShiftEnd == null)) {
                            if (gridCell.column.name === 'Saturday') {
                                options.backgroundColor = '#FF0000';
                            }
                        }
                        else {
                            if (SumHours(gridCell.data.D6ShiftStart, gridCell.data.D6ShiftEnd, gridCell.data.D6isOff, gridCell.data.D6IgnoreOvertime) == 0 || SumHours(gridCell.data.D6ShiftStart, gridCell.data.D6ShiftEnd, gridCell.data.D6isOff, gridCell.data.D6IgnoreOvertime, gridCell.data.NGUserID) > 8.0) {
                                if (gridCell.column.name === 'Saturday')
                                    options.font.color = '#FF0000';
                            }
                        }
                    }
                }
                if (gridCell.rowType === 'data') {

                    if (gridCell.data.D7isOff) {
                        if (gridCell.column.name === 'Sunday') {
                            options.backgroundColor = '#DCDCDC';
                            if (typeof gridCell.data.D7OffTypeID !== "number")
                                options.font.color = '#FF0000';
                        }
                    }
                    else {
                        if ((gridCell.data.D7ShiftStart == null || gridCell.data.D7ShiftEnd == null)) {
                            if (gridCell.column.name === 'Sunday') {
                                options.backgroundColor = '#FF0000';
                            }
                        }
                        else {
                            if (SumHours(gridCell.data.D7ShiftStart, gridCell.data.D7ShiftEnd, gridCell.data.D7isOff, gridCell.data.D7IgnoreOvertime) == 0 || SumHours(gridCell.data.D7ShiftStart, gridCell.data.D7ShiftEnd, gridCell.data.D7isOff, gridCell.data.D7IgnoreOvertime, gridCell.data.NGUserID) > 8.0) {
                                if (gridCell.column.name === 'Sunday')
                                    options.font.color = '#FF0000';
                            }
                        }
                    }
                }
            }
        },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("shiftplanedit2Ctrl");
    });
};