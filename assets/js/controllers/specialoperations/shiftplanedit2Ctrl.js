app.controller('shiftplanedit2Ctrl', shiftplanedit2Ctrl);
function shiftplanedit2Ctrl($rootScope, $scope, NG_SETTING, $translate, $element, localStorageService, $http, $window, $stateParams, Restangular, toaster, $filter) {
    $rootScope.uService.EnterController("shiftplanedit2Ctrl");
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
    function GetDefaultOffHours(userID,TotalNormalHours) {
        //return 0;
        if (TotalNormalHours==0) return 0;
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

        Restangular.one('ShiftPlan', $stateParams.id).get().then(function (restresult) {
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


            $http.get(NG_SETTING.apiServiceBaseUri + "/api/fsr/ShiftAdviceData", {
                params: {
                    StoreID: $scope.item.StoreID,
                    theYear: $scope.item.PeriodYear,
                    theWeek: $scope.item.PeriodWeek,
                    AllPositions: true,
                    ProductRelated: true,
                    ShowHourly: false
                }
            })
                .then(function (response) {
                    advdata = response.data;
                    var dataGrid = $('#gridContainer').dxDataGrid('instance');
                    dataGrid.columnOption("main", 'caption', $translate.instant('main.SHIFTPLAN') + " [" + $scope.item.Store + "] " + $translate.instant('main.WEEK') + ": [" + $scope.item.PeriodWeek + "] " + $translate.instant('main.YEAR') + ": [" + $scope.item.PeriodYear + "]  (" + $scope.item.DateRange + ")");
                    dataGrid.refresh();
                }, function (response) {
                    toaster.pop('warning', $translate.instant('Server.ServerError'),$translate.instant('Server.DataLoadingError'));
                });



            // $http.get(NG_SETTING.apiServiceBaseUri + "/api/LaborCostType", {
            //     params: {

            //     }
            // })
            //     .then(function (response) {
            //         LaborCostTypes = response.data.Items;
            //     }, function (response) {
            //         toaster.pop('warning', $translate.instant('Server.ServerError'), $translate.instant('Server.DataLoadingError'));
            //     });

            var dataGrid = $('#costgridContainer').dxDataGrid('instance');
            dataGrid.option("dataSource",
                new DevExpress.data.CustomStore({
                    //key: "id",
                    load: function (loadOptions) {
                        var params = {
                            StoreID: $scope.item.StoreID,
                            theYear: $scope.item.PeriodYear,
                            theWeek: $scope.item.PeriodWeek,
                            AllPositions: true,
                            ProductRelated: true,
                            ShowHourly: true
                        };

                        return $http.get(NG_SETTING.apiServiceBaseUri + "/api/fsr/ShiftAdviceData", { params: params })
                            .then(function (response) {
                                return {
                                    data: response.data,
                                    totalCount: 10
                                };
                            }, function (response) {
                                return $q.reject("Data Loading Error");
                            });
                    }
                }));
            var dataGrid = $('#productgridContainer').dxDataGrid('instance');
            dataGrid.option("dataSource",
                new DevExpress.data.CustomStore({
                    //key: "id",
                    load: function (loadOptions) {
                        var params = {
                            StoreID: $scope.item.StoreID,
                            theYear: $scope.item.PeriodYear,
                            theWeek: $scope.item.PeriodWeek,
                            AllPositions: false,
                            ProductRelated: true,
                            ShowHourly: false
                        };

                        return $http.get(NG_SETTING.apiServiceBaseUri + "/api/fsr/ShiftAdviceData", { params: params })
                            .then(function (response) {
                                return {
                                    data: response.data,
                                    totalCount: 10
                                };
                            }, function (response) {
                                return $q.reject("Data Loading Error");
                            });
                    }
                }));
            var dataGrid = $('#advstatgridContainer').dxDataGrid('instance');
            dataGrid.option("dataSource",
                new DevExpress.data.CustomStore({
                    //key: "id",
                    load: function (loadOptions) {
                        var params = {
                            StoreID: $scope.item.StoreID,
                            theYear: $scope.item.PeriodYear,
                            theWeek: $scope.item.PeriodWeek,
                            AllPositions: false,
                            ProductRelated: true,
                            ShowHourly: true
                        };

                        return $http.get(NG_SETTING.apiServiceBaseUri + "/api/fsr/ShiftAdviceData", { params: params })
                            .then(function (response) {
                                return {
                                    data: response.data,
                                    totalCount: 10
                                };
                            }, function (response) {
                                return $q.reject("Data Loading Error");
                            });
                    }
                }));
            var dataGrid = $('#advsalesgridContainer').dxDataGrid('instance');
            dataGrid.option("dataSource",
                new DevExpress.data.CustomStore({
                    //key: "id",
                    load: function (loadOptions) {
                        var params = {
                            StoreID: $scope.item.StoreID,
                            theYear: $scope.item.PeriodYear,
                            theWeek: $scope.item.PeriodWeek,
                            AllPositions: false,
                            ProductRelated: false,
                            ShowHourly: true
                        };

                        return $http.get(NG_SETTING.apiServiceBaseUri + "/api/fsr/ShiftAdviceData", { params: params })
                            .then(function (response) {
                                return {
                                    data: response.data,
                                    totalCount: 10
                                };
                            }, function (response) {
                                return $q.reject("Data Loading Error");
                            });
                    }
                }));
            //dataGrid.refresh(); 


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
    $scope.summaryTabSelected = function () {
        var dataGrid = $('#advPivotContainer').dxPivotGrid('instance');
        dataGrid.option("dataSource",
            {
                fields: [{
                    caption: $scope.Position,
                    width: 120,
                    dataField: "Position",
                    area: "row",
                    autoExpandGroup: true,
                    allowExpandAll: true
                }, {
                    caption: $scope.WeekDay,
                    dataField: "WeekDay",
                    width: 150,
                    area: "row",
                    autoExpandGroup: true,
                    allowExpandAll: true,
                    sortingMethod: function (a, b) {
                        var txt1 = a.value;
                        var txt2 = b.value;
                        switch (txt1) {
                            case "Monday":
                                txtindex1 = 1;
                                break;
                            case "Pazartesi":
                                txtindex1 = 1;
                                break;
                            case "Tuesday":
                                txtindex1 = 2;
                                break;
                            case "Salı":
                                txtindex1 = 2;
                                break;
                            case "Wednesday":
                                txtindex1 = 3;
                                break;
                            case "Çarşamba":
                                txtindex1 = 3;
                                break;
                            case "Thursday":
                                txtindex1 = 4;
                                break;
                            case "Perşembe":
                                txtindex1 = 4;
                                break;
                            case "Friday":
                                txtindex1 = 5;
                                break;
                            case "Cuma":
                                txtindex1 = 5;
                                break;
                            case "Saturday":
                                txtindex1 = 6;
                                break;
                            case "Cumartesi":
                                txtindex1 = 6;
                                break;
                            case "Sunday":
                                txtindex1 = 7;
                                break;
                            case "Pazar":
                                txtindex1 = 7;
                                break;
                        }
                        switch (txt2) {
                            case "Monday":
                                txtindex2 = 1;
                                break;
                            case "Pazartesi":
                                txtindex2 = 1;
                                break;
                            case "Tuesday":
                                txtindex2 = 2;
                                break;
                            case "Salı":
                                txtindex2 = 2;
                                break;
                            case "Wednesday":
                                txtindex2 = 3;
                                break;
                            case "Çarşamba":
                                txtindex2 = 3;
                                break;
                            case "Thursday":
                                txtindex2 = 4;
                                break;
                            case "Perşembe":
                                txtindex2 = 4;
                                break;
                            case "Friday":
                                txtindex2 = 5;
                                break;
                            case "Cuma":
                                txtindex2 = 5;
                                break;
                            case "Saturday":
                                txtindex2 = 6;
                                break;
                            case "Cumartesi":
                                txtindex2 = 6;
                                break;
                            case "Sunday":
                                txtindex2 = 7;
                                break;
                            case "Pazar":
                                txtindex2 = 7;
                                break;
                        }
                        if (txtindex1 < txtindex2)
                            return -1;
                        else if (txtindex1 > txtindex2)
                            return 1;
                        else
                            return 0;

                    },
                }, {
                    caption: $scope.Hour,
                    dataField: "Hour",
                    area: "column",
                    allowSorting: false,
                    allowExpandAll: true,
                    sortingMethod: function (a, b) {
                        var txtindex1 = a.value;
                        var txtindex2 = b.value;
                        if (txtindex1 < 4)
                            txtindex1 += 24;
                        if (txtindex2 < 4)
                            txtindex2 += 24;
                        if (txtindex1 < txtindex2)
                            return -1;
                        else if (txtindex1 > txtindex2)
                            return 1;
                        else
                            return 0;

                    },
                    autoExpandGroup: true
                }, {
                    caption: $scope.Required,
                    dataField: "Req",
                    dataType: "number",
                    summaryType: "sum",
                    area: "data"
                },
                {
                    caption: $scope.Plan,
                    dataField: "Plan",
                    dataType: "number",
                    summaryType: "sum",
                    area: "data"
                },
                {
                    caption: $scope.Status,
                    dataField: "Status",
                    dataType: "number",
                    summaryType: "sum",
                    area: "data"
                },
                    // {
                    //     caption: "CostReq", dataField: "CostReq", dataType: "number", summaryType: "sum", area: "filter",
                    //     format: {
                    //         type: "fixedPoint",
                    //         precision: 2
                    //     }
                    // },
                    // {
                    //     caption: "CostPlan", dataField: "CostPlan", dataType: "number", summaryType: "sum", area: "filter",
                    //     format: {
                    //         type: "fixedPoint",
                    //         precision: 2
                    //     }
                    // },
                ],
                store: DevExpress.data.AspNet.createStore({
                    key: "id",
                    loadUrl: NG_SETTING.apiServiceBaseUri + "/api/fsr/ShiftAdviceDatav2",
                    loadParams: {
                        StoreID: $scope.item.StoreID,
                        theYear: $scope.item.PeriodYear,
                        theWeek: $scope.item.PeriodWeek,
                        AllPositions: false,
                        ProductRelated: true,
                        ShowHourly: true
                    },
                    onBeforeSend: function (method, ajaxOptions) {
                        var authData = localStorageService.get('authorizationData');
                        if (authData) {
                            ajaxOptions.headers = {
                                Authorization: 'Bearer ' + authData.token,
                                "Accept-Language": $rootScope.locale
                            };
                        }
                    }
                })
                /* stroe: DevExpress.data.CustomStore({
                    load: function (loadOptions) {
                        var params = {
                            StoreID: $scope.item.StoreID,
                            theYear: $scope.item.PeriodYear,
                            theWeek: $scope.item.PeriodWeek
                        };
                        return $http.get(NG_SETTING.apiServiceBaseUri + "/api/fsr/ShiftAdviceDatav2", { params: params })
                            .then(function (response) {
                                return {
                                    data: response
                                };
                            }, function (response) {
                                return $q.reject("Data Loading Error");
                            });
                    }
                }) */
            });
        dataGrid.getDataSource().expandAll("Position");
    }

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
    $scope.advdataGridOptions = {
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
        groupPanel: { visible: true },
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        remoteOperations: false,
        repaintChangesOnly: true,
        highlightChanges: true,
        twoWayBindingEnabled: false,
        columns: [
            { dataField: "Position", caption: $scope.Position, visibleIndex: 0, groupIndex: 0, fixed: true, dataType: "string" },
            { dataField: "WeekDay", caption: $scope.WeekDay, visibleIndex: 1, fixed: true, dataType: "string" },
            { name: "Status_08", dataField: "Status_08", caption: "08", dataType: "number" },
            { name: "Status_09", dataField: "Status_09", caption: "09", dataType: "number" },
            { name: "Status_10", dataField: "Status_10", caption: "10", dataType: "number" },
            { name: "Status_11", dataField: "Status_11", caption: "11", dataType: "number" },
            { name: "Status_12", dataField: "Status_12", caption: "12", dataType: "number" },
            { name: "Status_13", dataField: "Status_13", caption: "13", dataType: "number" },
            { name: "Status_14", dataField: "Status_14", caption: "14", dataType: "number" },
            { name: "Status_15", dataField: "Status_15", caption: "15", dataType: "number" },
            { name: "Status_16", dataField: "Status_16", caption: "16", dataType: "number" },
            { name: "Status_17", dataField: "Status_17", caption: "17", dataType: "number" },
            { name: "Status_18", dataField: "Status_18", caption: "18", dataType: "number" },
            { name: "Status_19", dataField: "Status_19", caption: "19", dataType: "number" },
            { name: "Status_20", dataField: "Status_20", caption: "20", dataType: "number" },
            { name: "Status_21", dataField: "Status_21", caption: "21", dataType: "number" },
            { name: "Status_22", dataField: "Status_22", caption: "22", dataType: "number" },
            { name: "Status_23", dataField: "Status_23", caption: "23", dataType: "number" },
            { name: "Status_00", dataField: "Status_00", caption: "00", dataType: "number" },
            { name: "Status_01", dataField: "Status_01", caption: "01", dataType: "number" },
            { name: "Status_02", dataField: "Status_02", caption: "02", dataType: "number" },
            { name: "Status_03", dataField: "Status_03", caption: "03", dataType: "number" }
        ],
        // onCellPrepared: function (e) {
        //     if (e.rowType == 'data' && e.column.name && e.column.name.length > 5 && e.column.name.substring(0, 6) == "Status") {
        //         var fieldData = e.value;
        //         var fieldHtml = "";
        //         if (fieldData != 0) {
        //             e.cellElement.addClass((fieldData <= 0) ? "inc" : "dec");
        //             if (fieldData != 0)
        //                 fieldHtml += "</div> <div class='diff'>" +
        //                     Math.abs(fieldData.toFixed(2)) +
        //                     "  </div>";
        //         }
        //         e.cellElement.html(fieldHtml);
        //     }
        // },
        onDataErrorOccurred: function (e) {
            console.log(e.error);
        },
        export: {
            enabled: true, fileName: "ShiftPlanAdvice",

        },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.plandataGridOptions = {
        //dataSource: store,
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
        groupPanel: { visible: true },
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        remoteOperations: false,
        repaintChangesOnly: true,
        highlightChanges: true,
        twoWayBindingEnabled: false,
        columns: [
            { dataField: "Position", caption: $scope.Position, visibleIndex: 0, groupIndex: 0, fixed: true, dataType: "string" },
            { dataField: "WeekDay", caption: $scope.WeekDay, visibleIndex: 1, fixed: true, dataType: "string" },
            { name: "Plan_08", dataField: "Plan_08", caption: "08", dataType: "number" },
            { name: "Plan_09", dataField: "Plan_09", caption: "09", dataType: "number" },
            { name: "Plan_10", dataField: "Plan_10", caption: "10", dataType: "number" },
            { name: "Plan_11", dataField: "Plan_11", caption: "11", dataType: "number" },
            { name: "Plan_12", dataField: "Plan_12", caption: "12", dataType: "number" },
            { name: "Plan_13", dataField: "Plan_13", caption: "13", dataType: "number" },
            { name: "Plan_14", dataField: "Plan_14", caption: "14", dataType: "number" },
            { name: "Plan_15", dataField: "Plan_15", caption: "15", dataType: "number" },
            { name: "Plan_16", dataField: "Plan_16", caption: "16", dataType: "number" },
            { name: "Plan_17", dataField: "Plan_17", caption: "17", dataType: "number" },
            { name: "Plan_18", dataField: "Plan_18", caption: "18", dataType: "number" },
            { name: "Plan_19", dataField: "Plan_19", caption: "19", dataType: "number" },
            { name: "Plan_20", dataField: "Plan_20", caption: "20", dataType: "number" },
            { name: "Plan_21", dataField: "Plan_21", caption: "21", dataType: "number" },
            { name: "Plan_22", dataField: "Plan_22", caption: "22", dataType: "number" },
            { name: "Plan_23", dataField: "Plan_23", caption: "23", dataType: "number" },
            { name: "Plan_00", dataField: "Plan_00", caption: "00", dataType: "number" },
            { name: "Plan_01", dataField: "Plan_01", caption: "01", dataType: "number" },
            { name: "Plan_02", dataField: "Plan_02", caption: "02", dataType: "number" },
            { name: "Plan_03", dataField: "Plan_03", caption: "03", dataType: "number" }
        ],
        // onCellPrepared: function (e) {

        //     if (e.rowType == 'data' && e.column.name && e.column.name.length > 5 && e.column.name.substring(0, 6) == "Status") {
        //         var fieldData = e.value;
        //         var fieldHtml = "";
        //         if (fieldData != 0) {
        //             e.cellElement.addClass((fieldData <= 0) ? "inc" : "dec");
        //             if (fieldData != 0)
        //                 fieldHtml += "</div> <div class='diff'>" +
        //                     Math.abs(fieldData.toFixed(2)) +
        //                     "  </div>";
        //         }
        //         e.cellElement.html(fieldHtml);
        //     }
        // },
        onDataErrorOccurred: function (e) {
            console.log(e.error);
        },
        export: {
            enabled: true, fileName: "ShiftPlan_Planed",

        },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.costdataGridOptions = {
        //dataSource: store,
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
        groupPanel: { visible: true },
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        remoteOperations: false,
        repaintChangesOnly: true,
        highlightChanges: true,
        twoWayBindingEnabled: false,
        columns: [
            { dataField: "Position", caption: $scope.Position, visibleIndex: 0, groupIndex: 0, fixed: true, dataType: "string" },
            { dataField: "WeekDay", caption: $scope.WeekDay, visibleIndex: 1, fixed: true, dataType: "string" },
            { name: "CostPlan_08", dataField: "CostPlan_08", caption: "08", format: { type: "fixedPoint", precision: 2 } },
            { name: "CostPlan_09", dataField: "CostPlan_09", caption: "09", format: { type: "fixedPoint", precision: 2 } },
            { name: "CostPlan_10", dataField: "CostPlan_10", caption: "10", format: { type: "fixedPoint", precision: 2 } },
            { name: "CostPlan_11", dataField: "CostPlan_11", caption: "11", format: { type: "fixedPoint", precision: 2 } },
            { name: "CostPlan_12", dataField: "CostPlan_12", caption: "12", format: { type: "fixedPoint", precision: 2 } },
            { name: "CostPlan_13", dataField: "CostPlan_13", caption: "13", format: { type: "fixedPoint", precision: 2 } },
            { name: "CostPlan_14", dataField: "CostPlan_14", caption: "14", format: { type: "fixedPoint", precision: 2 } },
            { name: "CostPlan_15", dataField: "CostPlan_15", caption: "15", format: { type: "fixedPoint", precision: 2 } },
            { name: "CostPlan_16", dataField: "CostPlan_16", caption: "16", format: { type: "fixedPoint", precision: 2 } },
            { name: "CostPlan_17", dataField: "CostPlan_17", caption: "17", format: { type: "fixedPoint", precision: 2 } },
            { name: "CostPlan_18", dataField: "CostPlan_18", caption: "18", format: { type: "fixedPoint", precision: 2 } },
            { name: "CostPlan_19", dataField: "CostPlan_19", caption: "19", format: { type: "fixedPoint", precision: 2 } },
            { name: "CostPlan_20", dataField: "CostPlan_20", caption: "20", format: { type: "fixedPoint", precision: 2 } },
            { name: "CostPlan_21", dataField: "CostPlan_21", caption: "21", format: { type: "fixedPoint", precision: 2 } },
            { name: "CostPlan_22", dataField: "CostPlan_22", caption: "22", format: { type: "fixedPoint", precision: 2 } },
            { name: "CostPlan_23", dataField: "CostPlan_23", caption: "23", format: { type: "fixedPoint", precision: 2 } },
            { name: "CostPlan_00", dataField: "CostPlan_00", caption: "00", format: { type: "fixedPoint", precision: 2 } },
            { name: "CostPlan_01", dataField: "CostPlan_01", caption: "01", format: { type: "fixedPoint", precision: 2 } },
            { name: "CostPlan_02", dataField: "CostPlan_02", caption: "02", format: { type: "fixedPoint", precision: 2 } },
            { name: "CostPlan_03", dataField: "CostPlan_03", caption: "03", format: { type: "fixedPoint", precision: 2 } },
            {
                caption: $scope.trTotal,
                name: "Total",
                //visibleIndex: 12,
                calculateCellValue: function (data) {
                    return data.CostPlan_08 + data.CostPlan_09 + data.CostPlan_10 + data.CostPlan_11 + data.CostPlan_12 + data.CostPlan_13 +
                        data.CostPlan_14 + data.CostPlan_15 + data.CostPlan_16 + data.CostPlan_17 + data.CostPlan_18 + data.CostPlan_19 + data.CostPlan_20 +
                        data.CostPlan_21 + data.CostPlan_22 + data.CostPlan_23 + data.CostPlan_00 + data.CostPlan_01 + data.CostPlan_02 + data.CostPlan_03;
                },
                format: { type: "fixedPoint", precision: 0 }
            },
        ],
        summary: {
            totalItems: [
                {
                    column: "Total",
                    name: "Total",
                    summaryType: "sum",
                    valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}"
                    //, summaryType: "custom"
                    //    , valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" 
                },
            ],
            groupItems: [
                {
                    column: "Total",
                    name: "Total",
                    summaryType: "sum",
                    valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}",
                    alignByColumn: true
                },
            ],
            calculateCustomSummary: function (options) {
                if (options.name === "Total") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            //options.dg = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue +
                                options.CostPlan_08 + options.CostPlan_09 + options.CostPlan_10 + options.CostPlan_11 + options.CostPlan_12 + options.CostPlan_13 +
                                options.CostPlan_14 + options.CostPlan_15 + options.CostPlan_16 + options.CostPlan_17 + options.CostPlan_18 + options.CostPlan_19 + options.CostPlan_20 +
                                options.CostPlan_21 + options.CostPlan_22 + options.CostPlan_23 + options.CostPlan_00 + options.CostPlan_01 + options.CostPlan_02 + options.CostPlan_03;
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue;
                            break;
                    }
                }
            }
        },
        onDataErrorOccurred: function (e) {
            console.log(e.error);
        },
        export: {
            enabled: true, fileName: "ShiftPlanCost",

        },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.productdataGridOptions = {
        //dataSource: store,
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
        groupPanel: { visible: true },
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        remoteOperations: false,
        repaintChangesOnly: true,
        highlightChanges: true,
        twoWayBindingEnabled: false,
        columns: [
            { dataField: "Position", caption: $scope.Position, visibleIndex: 0, groupIndex: 0, fixed: true, dataType: "string" },
            { dataField: "WeekDay", caption: $scope.WeekDay, visibleIndex: 1, fixed: true, dataType: "string" },
            { name: "AvgFPSales_08", dataField: "AvgFPSales_08", caption: "08", format: { type: "fixedPoint", precision: 0 } },
            { name: "AvgFPSales_09", dataField: "AvgFPSales_09", caption: "09", format: { type: "fixedPoint", precision: 0 } },
            { name: "AvgFPSales_10", dataField: "AvgFPSales_10", caption: "10", format: { type: "fixedPoint", precision: 0 } },
            { name: "AvgFPSales_11", dataField: "AvgFPSales_11", caption: "11", format: { type: "fixedPoint", precision: 0 } },
            { name: "AvgFPSales_12", dataField: "AvgFPSales_12", caption: "12", format: { type: "fixedPoint", precision: 0 } },
            { name: "AvgFPSales_13", dataField: "AvgFPSales_13", caption: "13", format: { type: "fixedPoint", precision: 0 } },
            { name: "AvgFPSales_14", dataField: "AvgFPSales_14", caption: "14", format: { type: "fixedPoint", precision: 0 } },
            { name: "AvgFPSales_15", dataField: "AvgFPSales_15", caption: "15", format: { type: "fixedPoint", precision: 0 } },
            { name: "AvgFPSales_16", dataField: "AvgFPSales_16", caption: "16", format: { type: "fixedPoint", precision: 0 } },
            { name: "AvgFPSales_17", dataField: "AvgFPSales_17", caption: "17", format: { type: "fixedPoint", precision: 0 } },
            { name: "AvgFPSales_18", dataField: "AvgFPSales_18", caption: "18", format: { type: "fixedPoint", precision: 0 } },
            { name: "AvgFPSales_19", dataField: "AvgFPSales_19", caption: "19", format: { type: "fixedPoint", precision: 0 } },
            { name: "AvgFPSales_20", dataField: "AvgFPSales_20", caption: "20", format: { type: "fixedPoint", precision: 0 } },
            { name: "AvgFPSales_21", dataField: "AvgFPSales_21", caption: "21", format: { type: "fixedPoint", precision: 0 } },
            { name: "AvgFPSales_22", dataField: "AvgFPSales_22", caption: "22", format: { type: "fixedPoint", precision: 0 } },
            { name: "AvgFPSales_23", dataField: "AvgFPSales_23", caption: "23", format: { type: "fixedPoint", precision: 0 } },
            { name: "AvgFPSales_00", dataField: "AvgFPSales_00", caption: "00", format: { type: "fixedPoint", precision: 0 } },
            { name: "AvgFPSales_01", dataField: "AvgFPSales_01", caption: "01", format: { type: "fixedPoint", precision: 0 } },
            { name: "AvgFPSales_02", dataField: "AvgFPSales_02", caption: "02", format: { type: "fixedPoint", precision: 0 } },
            { name: "AvgFPSales_03", dataField: "AvgFPSales_03", caption: "03", format: { type: "fixedPoint", precision: 0 } },
            {
                caption: $scope.trTotal,
                name: "Total",
                //visibleIndex: 12,
                calculateCellValue: function (data) {
                    return data.AvgFPSales_08 + data.AvgFPSales_09 + data.AvgFPSales_10 + data.AvgFPSales_11 + data.AvgFPSales_12 + data.AvgFPSales_13 +
                        data.AvgFPSales_14 + data.AvgFPSales_15 + data.AvgFPSales_16 + data.AvgFPSales_17 + data.AvgFPSales_18 + data.AvgFPSales_19 + data.AvgFPSales_20 +
                        data.AvgFPSales_21 + data.AvgFPSales_22 + data.AvgFPSales_23 + data.AvgFPSales_00 + data.AvgFPSales_01 + data.AvgFPSales_02 + data.AvgFPSales_03;
                },
                format: { type: "fixedPoint", precision: 0 }
            },
        ],
        summary: {
            totalItems: [
                {
                    column: "Total",
                    name: "Total",
                    summaryType: "sum",
                    valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}"
                    //, summaryType: "custom"
                    //    , valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" 
                },
            ],
            groupItems: [
                {
                    column: "Total",
                    name: "Total",
                    summaryType: "sum",
                    valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}",
                    alignByColumn: true
                },
            ],
            calculateCustomSummary: function (options) {
                if (options.name === "Total") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            //options.dg = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue +
                                options.CostPlan_08 + options.CostPlan_09 + options.CostPlan_10 + options.CostPlan_11 + options.CostPlan_12 + options.CostPlan_13 +
                                options.CostPlan_14 + options.CostPlan_15 + options.CostPlan_16 + options.CostPlan_17 + options.CostPlan_18 + options.CostPlan_19 + options.CostPlan_20 +
                                options.CostPlan_21 + options.CostPlan_22 + options.CostPlan_23 + options.CostPlan_00 + options.CostPlan_01 + options.CostPlan_02 + options.CostPlan_03;
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue;
                            break;
                    }
                }
            }
        },
        onDataErrorOccurred: function (e) {
            console.log(e.error);
        },
        export: {
            enabled: true, fileName: "ShiftPlanProductStats",

        },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.reqdataGridOptions = {
        //dataSource: store,
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
        groupPanel: { visible: true },
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        remoteOperations: false,
        repaintChangesOnly: true,
        highlightChanges: true,
        twoWayBindingEnabled: false,
        columns: [
            { dataField: "Position", caption: $scope.Position, visibleIndex: 0, groupIndex: 0, fixed: true, dataType: "string" },
            { dataField: "WeekDay", caption: $scope.WeekDay, visibleIndex: 1, fixed: true, dataType: "string" },
            { name: "Req_08", dataField: "Req_08", caption: "08", dataType: "number" },
            { name: "Req_09", dataField: "Req_09", caption: "09", dataType: "number" },
            { name: "Req_10", dataField: "Req_10", caption: "10", dataType: "number" },
            { name: "Req_11", dataField: "Req_11", caption: "11", dataType: "number" },
            { name: "Req_12", dataField: "Req_12", caption: "12", dataType: "number" },
            { name: "Req_13", dataField: "Req_13", caption: "13", dataType: "number" },
            { name: "Req_14", dataField: "Req_14", caption: "14", dataType: "number" },
            { name: "Req_15", dataField: "Req_15", caption: "15", dataType: "number" },
            { name: "Req_16", dataField: "Req_16", caption: "16", dataType: "number" },
            { name: "Req_17", dataField: "Req_17", caption: "17", dataType: "number" },
            { name: "Req_18", dataField: "Req_18", caption: "18", dataType: "number" },
            { name: "Req_19", dataField: "Req_19", caption: "19", dataType: "number" },
            { name: "Req_20", dataField: "Req_20", caption: "20", dataType: "number" },
            { name: "Req_21", dataField: "Req_21", caption: "21", dataType: "number" },
            { name: "Req_22", dataField: "Req_22", caption: "22", dataType: "number" },
            { name: "Req_23", dataField: "Req_23", caption: "23", dataType: "number" },
            { name: "Req_00", dataField: "Req_00", caption: "00", dataType: "number" },
            { name: "Req_01", dataField: "Req_01", caption: "01", dataType: "number" },
            { name: "Req_02", dataField: "Req_02", caption: "02", dataType: "number" },
            { name: "Req_03", dataField: "Req_03", caption: "03", dataType: "number" }
        ],
        // onCellPrepared: function (e) {

        //     if (e.rowType == 'data' && e.column.name && e.column.name.length > 5 && e.column.name.substring(0, 6) == "Status") {
        //         var fieldData = e.value;
        //         var fieldHtml = "";
        //         if (fieldData != 0) {
        //             e.cellElement.addClass((fieldData > 0) ? "inc" : "dec");
        //             fieldHtml += "<div class='current-value'>" +
        //                 e.row.data["Req_" + e.column.dataField.split("_")[1]] +
        //                 "</div> <div class='diff'>" +
        //                 Math.abs(fieldData.toFixed(2)) +
        //                 "  </div>";
        //         }
        //         e.cellElement.html(fieldHtml);
        //     }
        // },
        onDataErrorOccurred: function (e) {
            console.log(e.error);
        },
        export: {
            enabled: true, fileName: "ShiftPlanRequirment",

        },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.advstatdataGridOptions = {
        //dataSource: store,
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
        groupPanel: { visible: true },
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        remoteOperations: false,
        repaintChangesOnly: true,
        highlightChanges: true,
        twoWayBindingEnabled: false,
        columns: [
            { dataField: "Position", caption: $scope.Position, visibleIndex: 0, groupIndex: 0, fixed: true, dataType: "string" },
            { dataField: "WeekDay", caption: $scope.WeekDay, visibleIndex: 1, fixed: true, dataType: "string" },
            { name: "Status_08", dataField: "AvgTC_08", caption: "08", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_09", dataField: "AvgTC_09", caption: "09", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_10", dataField: "AvgTC_10", caption: "10", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_11", dataField: "AvgTC_11", caption: "11", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_12", dataField: "AvgTC_12", caption: "12", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_13", dataField: "AvgTC_13", caption: "13", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_14", dataField: "AvgTC_14", caption: "14", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_15", dataField: "AvgTC_15", caption: "15", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_16", dataField: "AvgTC_16", caption: "16", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_17", dataField: "AvgTC_17", caption: "17", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_18", dataField: "AvgTC_18", caption: "18", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_19", dataField: "AvgTC_19", caption: "19", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_20", dataField: "AvgTC_20", caption: "20", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_21", dataField: "AvgTC_21", caption: "21", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_22", dataField: "AvgTC_22", caption: "22", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_23", dataField: "AvgTC_23", caption: "23", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_00", dataField: "AvgTC_00", caption: "00", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_01", dataField: "AvgTC_01", caption: "01", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_02", dataField: "AvgTC_02", caption: "02", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_03", dataField: "AvgTC_03", caption: "03", format: { type: "fixedPoint", precision: 2 } },
            {
                caption: $scope.trTotal,
                name: "Total",
                //visibleIndex: 12,
                calculateCellValue: function (data) {
                    return data.AvgTC_08 + data.AvgTC_09 + data.AvgTC_10 + data.AvgTC_11 + data.AvgTC_12 + data.AvgTC_13 +
                        data.AvgTC_14 + data.AvgTC_15 + data.AvgTC_16 + data.AvgTC_17 + data.AvgTC_18 + data.AvgTC_19 + data.AvgTC_20 +
                        data.AvgTC_21 + data.AvgTC_22 + data.AvgTC_23 + data.AvgTC_00 + data.AvgTC_01 + data.AvgTC_02 + data.AvgTC_03;
                },
                format: { type: "fixedPoint", precision: 0 }
            },
        ],
        summary: {
            // totalItems: [
            //     {
            //         column: "Total",
            //         name: "Total",
            //         summaryType: "sum",
            //         valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}"
            //         //, summaryType: "custom"
            //         //    , valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" 
            //     },
            // ],
            groupItems: [
                {
                    column: "Total",
                    name: "Total",
                    summaryType: "sum",
                    valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}",
                    alignByColumn: true
                },
            ],

        },
        // onCellPrepared: function (e) {
        //     if (e.rowType == 'data' && e.column.name && e.column.name.length > 5 && e.column.name.substring(0, 6) == "Status") {
        //         var fieldData = e.value;
        //         var fieldHtml = "";
        //         if (fieldData != 0) {
        //             e.cellElement.addClass((fieldData > 0) ? "inc" : "dec");
        //             fieldHtml += "<div class='current-value'>" +
        //                 e.row.data["Req_" + e.column.dataField.split("_")[1]] +
        //                 "</div> <div class='diff'>" +
        //                 Math.abs(fieldData.toFixed(2)) +
        //                 "  </div>";
        //         }
        //         /* else {
        //             fieldHtml = fieldData.value;
        //         } */
        //         e.cellElement.html(fieldHtml);
        //     }
        // },
        onDataErrorOccurred: function (e) {
            console.log(e.error);
        },
        export: {
            enabled: true, fileName: "ShiftPlanTransactions",

        },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.advsalesdataGridOptions = {
        //dataSource: store,
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
        groupPanel: { visible: true },
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        remoteOperations: false,
        repaintChangesOnly: true,
        highlightChanges: true,
        twoWayBindingEnabled: false,
        columns: [
            { dataField: "Position", caption: $scope.Position, visibleIndex: 0, groupIndex: 0, fixed: true, dataType: "string" },
            { dataField: "WeekDay", caption: $scope.WeekDay, visibleIndex: 1, fixed: true, dataType: "string" },
            { name: "Status_08", dataField: "AvgSales_08", caption: "08", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_09", dataField: "AvgSales_09", caption: "09", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_10", dataField: "AvgSales_10", caption: "10", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_11", dataField: "AvgSales_11", caption: "11", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_12", dataField: "AvgSales_12", caption: "12", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_13", dataField: "AvgSales_13", caption: "13", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_14", dataField: "AvgSales_14", caption: "14", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_15", dataField: "AvgSales_15", caption: "15", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_16", dataField: "AvgSales_16", caption: "16", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_17", dataField: "AvgSales_17", caption: "17", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_18", dataField: "AvgSales_18", caption: "18", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_19", dataField: "AvgSales_19", caption: "19", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_20", dataField: "AvgSales_20", caption: "20", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_21", dataField: "AvgSales_21", caption: "21", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_22", dataField: "AvgSales_22", caption: "22", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_23", dataField: "AvgSales_23", caption: "23", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_00", dataField: "AvgSales_00", caption: "00", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_01", dataField: "AvgSales_01", caption: "01", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_02", dataField: "AvgSales_02", caption: "02", format: { type: "fixedPoint", precision: 2 } },
            { name: "Status_03", dataField: "AvgSales_03", caption: "03", format: { type: "fixedPoint", precision: 2 } },
            {
                caption: $scope.trTotal,
                name: "Total",
                //visibleIndex: 12,
                calculateCellValue: function (data) {
                    return data.AvgSales_08 + data.AvgSales_09 + data.AvgSales_10 + data.AvgSales_11 + data.AvgSales_12 + data.AvgSales_13 +
                        data.AvgSales_14 + data.AvgSales_15 + data.AvgSales_16 + data.AvgSales_17 + data.AvgSales_18 + data.AvgSales_19 + data.AvgSales_20 +
                        data.AvgSales_21 + data.AvgSales_22 + data.AvgSales_23 + data.AvgSales_00 + data.AvgSales_01 + data.AvgSales_02 + data.AvgSales_03;
                },
                format: { type: "fixedPoint", precision: 0 }
            },
        ],
        summary: {
            // totalItems: [
            //     {
            //         column: "Total",
            //         name: "Total",
            //         summaryType: "sum",
            //         valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}"
            //         //, summaryType: "custom"
            //         //    , valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" 
            //     },
            // ],
            groupItems: [
                {
                    column: "Total",
                    name: "Total",
                    summaryType: "sum",
                    valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}",
                    alignByColumn: true
                },
            ],

        },
        // onCellPrepared: function (e) {
        //     if (e.rowType == 'data' && e.column.name && e.column.name.length > 5 && e.column.name.substring(0, 6) == "Status") {
        //         var fieldData = e.value;
        //         var fieldHtml = "";
        //         if (fieldData != 0) {
        //             e.cellElement.addClass((fieldData > 0) ? "inc" : "dec");
        //             fieldHtml += "<div class='current-value'>" +
        //                 e.row.data["Req_" + e.column.dataField.split("_")[1]] +
        //                 "</div> <div class='diff'>" +
        //                 Math.abs(fieldData.toFixed(2)) +
        //                 "  </div>";
        //         }
        //         /* else {
        //             fieldHtml = fieldData.value;
        //         } */
        //         e.cellElement.html(fieldHtml);
        //     }
        // },
        onDataErrorOccurred: function (e) {
            console.log(e.error);
        },
        export: {
            enabled: true, fileName: "ShiftPlanSales",

        },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.salesbytypeGridOptions = {
        //dataSource: store,
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
        grouping: { autoExpandAll: false },
        //searchPanel: { visible: true },
        groupPanel: { visible: true },
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        remoteOperations: false,
        repaintChangesOnly: true,
        highlightChanges: true,
        twoWayBindingEnabled: false,
        columns: [
            { dataField: "OrderType", caption: $scope.OrderType, visibleIndex: 0, groupIndex: 0, fixed: true, dataType: "string" },
            { dataField: "WeekDay", caption: $scope.WeekDay, visibleIndex: 1, fixed: true, dataType: "string" },
            { name: "AvgTC_08", dataField: "AvgTC_08", caption: "08", format: { type: "fixedPoint", precision: 2 } },
            { name: "AvgTC_09", dataField: "AvgTC_09", caption: "09", format: { type: "fixedPoint", precision: 2 } },
            { name: "AvgTC_10", dataField: "AvgTC_10", caption: "10", format: { type: "fixedPoint", precision: 2 } },
            { name: "AvgTC_11", dataField: "AvgTC_11", caption: "11", format: { type: "fixedPoint", precision: 2 } },
            { name: "AvgTC_12", dataField: "AvgTC_12", caption: "12", format: { type: "fixedPoint", precision: 2 } },
            { name: "AvgTC_13", dataField: "AvgTC_13", caption: "13", format: { type: "fixedPoint", precision: 2 } },
            { name: "AvgTC_14", dataField: "AvgTC_14", caption: "14", format: { type: "fixedPoint", precision: 2 } },
            { name: "AvgTC_15", dataField: "AvgTC_15", caption: "15", format: { type: "fixedPoint", precision: 2 } },
            { name: "AvgTC_16", dataField: "AvgTC_16", caption: "16", format: { type: "fixedPoint", precision: 2 } },
            { name: "AvgTC_17", dataField: "AvgTC_17", caption: "17", format: { type: "fixedPoint", precision: 2 } },
            { name: "AvgTC_18", dataField: "AvgTC_18", caption: "18", format: { type: "fixedPoint", precision: 2 } },
            { name: "AvgTC_19", dataField: "AvgTC_19", caption: "19", format: { type: "fixedPoint", precision: 2 } },
            { name: "AvgTC_20", dataField: "AvgTC_20", caption: "20", format: { type: "fixedPoint", precision: 2 } },
            { name: "AvgTC_21", dataField: "AvgTC_21", caption: "21", format: { type: "fixedPoint", precision: 2 } },
            { name: "AvgTC_22", dataField: "AvgTC_22", caption: "22", format: { type: "fixedPoint", precision: 2 } },
            { name: "AvgTC_23", dataField: "AvgTC_23", caption: "23", format: { type: "fixedPoint", precision: 2 } },
            { name: "AvgTC_00", dataField: "AvgTC_00", caption: "00", format: { type: "fixedPoint", precision: 2 } },
            { name: "AvgTC_01", dataField: "AvgTC_01", caption: "01", format: { type: "fixedPoint", precision: 2 } },
            { name: "AvgTC_02", dataField: "AvgTC_02", caption: "02", format: { type: "fixedPoint", precision: 2 } },
            { name: "AvgTC_03", dataField: "AvgTC_03", caption: "03", format: { type: "fixedPoint", precision: 2 } }
        ],
        // onCellPrepared: function (e) {
        //     if (e.rowType == 'data' && e.column.name && e.column.name.length > 5 && e.column.name.substring(0, 6) == "Status") {
        //         var fieldData = e.value;
        //         var fieldHtml = "";
        //         if (fieldData != 0) {
        //             e.cellElement.addClass((fieldData > 0) ? "inc" : "dec");
        //             fieldHtml += "<div class='current-value'>" +
        //                 e.row.data["Req_" + e.column.dataField.split("_")[1]] +
        //                 "</div> <div class='diff'>" +
        //                 Math.abs(fieldData.toFixed(2)) +
        //                 "  </div>";
        //         }
        //         /* else {
        //             fieldHtml = fieldData.value;
        //         } */
        //         e.cellElement.html(fieldHtml);
        //     }
        // },
        summary: {
            totalItems: [
                { column: "AvgTC_08", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_09", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_10", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_11", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_12", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_13", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_14", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_15", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_16", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_17", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_18", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_19", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_20", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_21", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_22", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_23", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_00", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_01", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_02", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_03", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },

            ],
            groupItems: [
                { column: "AvgTC_08", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_09", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_10", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_11", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_12", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_13", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_14", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_15", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_16", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_17", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_18", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_19", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_20", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_21", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_22", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_23", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_00", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_01", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_02", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgTC_03", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },

            ]
        },
        onDataErrorOccurred: function (e) {
            console.log(e.error);
        },
        export: {
            enabled: true, fileName: "ShiftPlanSalesByType",

        },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.dataGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxShiftPlanItems",
            loadParams: { ShiftPlanID: $stateParams.id },
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxShiftPlanItems",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxShiftPlanItems",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxShiftPlanItems",
            onBeforeSend: function (method, ajaxOptions) {
                var authData = localStorageService.get('authorizationData');
                if (authData) {
                    ajaxOptions.headers = { Authorization: 'Bearer ' + authData.token, "Accept-Language": "tr-TR" };
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
                        ((offNotExist ? (GetDefaultOffHours(result[i].NGUserID,result[i]["NormalHours"])) : 0));
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
                        + (offNotExist ? (GetDefaultOffHours(result[i].NGUserID,result[i]["NormalHours"]) * 1.5 * HourlyWage(result[i].StaffPositionID)) : 0);
                    result[i]["Wage"] = HourlyWage(result[i].StaffPositionID);

                }

            },
            loadParams: { filter: JSON.stringify(["ShiftPlanID", "=", $stateParams.id]) },
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
            allowUpdating: ($rootScope.user.restrictions.shiftplanedit2_update == 'Enable'),
            allowDeleting: ($rootScope.user.restrictions.shiftplanedit2_delete == 'Enable'),
            allowInserting: ($rootScope.user.restrictions.shiftplanedit2_insert == 'Enable'),
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
            e.data.ShiftPlanID = $scope.item.id;
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
                    { dataField: "ShiftPlanID", caption: "Name", visible: false, formItem: { visible: false } },
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
                                    filtr.push(["isActive", "=", 1]);
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
                        visible:false,
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