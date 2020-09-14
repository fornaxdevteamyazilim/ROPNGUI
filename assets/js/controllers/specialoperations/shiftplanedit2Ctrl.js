app.controller('shiftplanedit2Ctrl', shiftplanedit2Ctrl);
function shiftplanedit2Ctrl($rootScope, $scope, NG_SETTING, $translate, $element, localStorageService, $http, $window, $stateParams, Restangular, toaster, $filter) {
    $rootScope.uService.EnterController("shiftplanedit2Ctrl");
    var ngurr = this;
    $scope.NGUserRoleID = '';

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
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    }

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
    $scope.Back = function () {
        $window.history.back();
    };
    var users = [];
    var OffTypes = [];
    Restangular.all('StaffOffType').getList({
        pageNo: 1,
        pageSize: 10000,
    }).then(function (result) {
        OffTypes = result;
    }, function (response) {
        toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
    });
    Restangular.one('ShiftPlan', $stateParams.id).get().then(function (restresult) {
        $scope.item = Restangular.copy(restresult);

        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.columnOption("main", 'caption', "Shift Plan [" + $scope.item.Store + "] Week: [" + $scope.item.PeriodWeek + "] Year: [" + $scope.item.PeriodYear + "]  (" + $scope.item.DateRange + ")");

        Restangular.all('user').getList({
            pageNo: 1,
            pageSize: 10000,
            search: "StoreID='" + $scope.item.StoreID + "'"
        }).then(function (result) {
            users = result;
        }, function (response) {
            toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
        });

    }, function (restresult) {
        toaster.pop('warning', "Server Error", restresult.data.ExceptionMessage);
        swal("Hata!", "Warning");
    })
    var hstep = ['-', '01:00', '01:15', '01:30', '01:45', '02:00', '02:15', '02:30', '02:45', '03:00', '03:15', '03:30', '03:45', '04:00', '04:15', '04:30', '04:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30',
        '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00',
        '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30',
        '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45', '00:00', '00:15', '00:30', '00:45'];
    $scope.GetOffType = function (StaffOffTypeID) {
        if (StaffOffTypeID) {
            var selected = $filter('filter')(OffTypes, {
                id: StaffOffTypeID
            });
            return (selected.length) ? selected[0].Name : "Not set";
        }
        return "N/A";
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
                    ajaxOptions.headers = { Authorization: 'Bearer ' + authData.token };
                }
            }
        }),
        filterValue: ["ShiftPlanID", "=", $stateParams.id],
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: false,
        showRowLines: true,
        rowAlternationEnabled: true,
        showBorders: true,
        allowColumnReordering: true,
        filterRow: { visible: true },
        //filterPanel: { visible: true },
        headerFilter: { visible: true },
        //grouping: { autoExpandAll: false },
        searchPanel: { visible: true },
        //groupPanel: { visible: true },
        editing: {
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            allowInserting: true,
            useIcons: true,
            mode: "popup",

            popup: { title: "Edit Staff Shift", showTitle: true, fullScreen: true },
            form: {
                labelLocation: "top",
                items: [{
                    itemType: "group",
                    colCount: 2,
                    colSpan: 2,
                    items: ["StaffPositionID", "NGUserID"]
                }, {
                    itemType: "group",
                    colCount: 5,
                    colSpan: 2,
                    caption: "Shifts",
                    items: ["D1ShiftStart", "D1ShiftEnd", "D1isOff", { colSpan: 2, dataField: "D1OffTypeID" }]
                },
                {
                    itemType: "group",
                    colCount: 5,
                    colSpan: 2,
                    //caption: "Tuesday",
                    items: ["D2ShiftStart", "D2ShiftEnd", "D2isOff", { colSpan: 2, dataField: "D2OffTypeID" }]
                },
                {
                    itemType: "group",
                    colCount: 5,
                    colSpan: 2,
                    //caption: "Wednesday",
                    items: ["D3ShiftStart", "D3ShiftEnd", "D3isOff", { colSpan: 2, dataField: "D3OffTypeID" }
                    ]
                },
                {
                    itemType: "group",
                    colCount: 5,
                    colSpan: 2,
                    //caption: "Thursday",
                    items: ["D4ShiftStart", "D4ShiftEnd", "D4isOff", { colSpan: 2, dataField: "D4OffTypeID" }
                    ]
                },
                {
                    itemType: "group",
                    colCount: 5,
                    colSpan: 2,
                    //caption: "Friday",
                    items: ["D5ShiftStart", "D5ShiftEnd", "D5isOff", { colSpan: 2, dataField: "D5OffTypeID" }]
                },
                {
                    itemType: "group",
                    colCount: 5,
                    colSpan: 2,
                    //caption: "Saturday",
                    items: ["D6ShiftStart", "D6ShiftEnd", "D6isOff", { colSpan: 2, dataField: "D6OffTypeID" }]
                },
                {
                    itemType: "group",
                    colCount: 5,
                    colSpan: 2,
                    //caption: "Sunday",
                    items: ["D7ShiftStart", "D7ShiftEnd", "D7isOff", { colSpan: 2, dataField: "D7OffTypeID" }]
                }]
            }
        },
        columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        remoteOperations: true,
        onRowClick: function (rowInfo) {
            rowInfo.component.editRow(rowInfo.rowIndex);
        },
        onInitNewRow: function (e) {
            e.data.ShiftPlanID = $scope.item.id;
        },
        columns: [
            {
                caption: "Shift Plan",
                name: "main",
                columns: [
                    { dataField: "ShiftPlanID", caption: "Name", visible: false, formItem: { visible: false } },
                    {
                        dataField: "StaffPositionID", caption: "Position",
                        visibleIndex: 0,
                        //groupIndex:0,
                        lookup: {
                            valueExpr: "id",
                            displayExpr: "Name",
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
                                sort: "name",
                                headerFilter: { allowSearch: true }
                            },
                            calculateSortValue: function (data) {
                                var value = this.calculateCellValue(data);
                                return this.lookup.calculateCellValue(value);
                            }
                        },
                    },
                    {
                        dataField: "NGUserID",
                        caption: "Staff",
                        visible: false,
                        editable: true,
                        lookup: {
                            dataSource: function (options) {
                                return {
                                    store: users,
                                    filter: options.data ? ["StaffPositionID", "=", options.data.StaffPositionID] : null
                                };
                            },
                            valueExpr: "id",
                            displayExpr: "FullName"
                        }
                    },

                    {
                        dataField: "NGUserID",
                        caption: "Staff Name",
                        visibleIndex: 1,
                        formItem: {
                            visible: false
                        },
                        lookup: {
                            valueExpr: "id",
                            displayExpr: "FullName",
                            dataSource: {
                                store: DevExpress.data.AspNet.createStore({
                                    key: "id",
                                    loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxUser",
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
                        dataField: "D1OffTypeID", caption: "Off Type",
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
                    },
                    {
                        dataField: "D1ShiftStart",
                        caption: "Monday - Start",
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    {
                        dataField: "D1ShiftEnd",
                        caption: "End",
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    { dataField: "D1isOff", caption: "Off day", visible: false },
                    {
                        dataField: "D2OffTypeID", caption: "Off Type",
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
                    },
                    {
                        dataField: "D2ShiftStart",
                        caption: "Tuesday - Start",
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    {
                        dataField: "D2ShiftEnd",
                        caption: "End",
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    { dataField: "D2isOff", caption: "Off day", visible: false },


                    {
                        dataField: "D3OffTypeID", caption: "Off Type",
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
                    },
                    {
                        dataField: "D3ShiftStart",
                        caption: "Wednesday - Start",
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    {
                        dataField: "D3ShiftEnd",
                        caption: "End",
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    { dataField: "D3isOff", caption: "Off day", visible: false },

                    {
                        dataField: "D4OffTypeID", caption: "Off Type",
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
                    },
                    {
                        dataField: "D4ShiftStart",
                        caption: "Thursday - Start",
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    {
                        dataField: "D4ShiftEnd",
                        caption: "End",
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    { dataField: "D4isOff", caption: "Off day", visible: false },

                    {
                        dataField: "D5OffTypeID", caption: "Off Type",
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
                    },
                    {
                        dataField: "D5ShiftStart",
                        caption: "Friday - Start",
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    {
                        dataField: "D5ShiftEnd",
                        caption: "End",
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    { dataField: "D5isOff", caption: "Off day", visible: false },

                    {
                        dataField: "D6OffTypeID", caption: "Off Type",
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
                    },
                    {
                        dataField: "D6ShiftStart",
                        caption: "Saturday - Start",
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    {
                        dataField: "D6ShiftEnd",
                        caption: "End",
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    { dataField: "D6isOff", caption: "Off day", visible: false },

                    {
                        dataField: "D7OffTypeID", caption: "Off Type",
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
                    },
                    {
                        dataField: "D7ShiftStart",
                        caption: "Sunday - Start",
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    {
                        dataField: "D7ShiftEnd",
                        caption: "End",
                        visible: false,
                        editable: true,
                        lookup: { dataSource: function (options) { return { store: hstep }; }, }
                    },
                    { dataField: "D7isOff", caption: "Off day", visible: false },
                    {
                        caption: "Monday",
                        name: "Monday",
                        visibleIndex: 5,
                        calculateCellValue: function (data) {
                            if (data.D1isOff)
                                return $scope.GetOffType(data.D1OffTypeID);
                            return [data.D1ShiftStart,
                            data.D1ShiftEnd]
                                .join("-");
                        }
                    },
                    {
                        caption: "Tuesday",
                        name: "Tuesday",
                        visibleIndex: 6,
                        calculateCellValue: function (data) {
                            if (data.D2isOff)
                                return $scope.GetOffType(data.D2OffTypeID);
                            return [data.D2ShiftStart,
                            data.D2ShiftEnd]
                                .join("-");
                        }
                    },
                    {
                        caption: "Wednesday",
                        name: "Wednesday",
                        visibleIndex: 7,
                        calculateCellValue: function (data) {
                            if (data.D3isOff)
                                return $scope.GetOffType(data.D3OffTypeID);
                            return [data.D3ShiftStart,
                            data.D3ShiftEnd]
                                .join("-");
                        }
                    },
                    {
                        caption: "Thursday",
                        name: "Thursday",
                        visibleIndex: 8,
                        calculateCellValue: function (data) {
                            if (data.D4isOff)
                                return $scope.GetOffType(data.D4OffTypeID);
                            return [data.D4ShiftStart,
                            data.D4ShiftEnd]
                                .join("-");
                        }
                    },
                    {
                        caption: "Friday",
                        name: "Friday",
                        visibleIndex: 9,
                        calculateCellValue: function (data) {
                            if (data.D5isOff)
                                return $scope.GetOffType(data.D5OffTypeID);
                            return [data.D5ShiftStart,
                            data.D5ShiftEnd]
                                .join("-");
                        }
                    },
                    {
                        caption: "Saturday",
                        name: "Saturday",
                        visibleIndex: 10,
                        calculateCellValue: function (data) {
                            if (data.D6isOff)
                                return $scope.GetOffType(data.D6OffTypeID);
                            return [data.D6ShiftStart,
                            data.D6ShiftEnd]
                                .join("-");
                        }
                    },
                    {
                        caption: "Sunday",
                        name: "Sunday",
                        visibleIndex: 11,
                        calculateCellValue: function (data) {
                            if (data.D7isOff)
                                return $scope.GetOffType(data.D7OffTypeID);
                            return [data.D7ShiftStart,
                            data.D7ShiftEnd]
                                .join("-");
                        }
                    },




                ]
            }
        ],
        onCellPrepared: function (e) {
            if (e.rowType == 'data' || e.rowType == 'group') {
                if (e.data.D1isOff) {
                    if (e.column.name === 'Monday') { e.cellElement.css({ 'background-color': '#DCDCDC' }); }
                }
                else {
                    if ((e.data.D1ShiftStart == null || e.data.D1ShiftEnd == null)) {
                        if (e.column.name === 'Monday') {
                            e.cellElement.css({ 'background-color': '#FF0000', 'color': '#f00' });
                        }
                    }
                }

                if (e.data.D2isOff) {
                    if (e.column.name === 'Tuesday') { e.cellElement.css({ 'background-color': '#DCDCDC' }); }
                }
                else {
                    if ((e.data.D2ShiftStart == null || e.data.D2ShiftEnd == null)) {
                        if (e.column.name === 'Tuesday') {
                            e.cellElement.css({ 'background-color': '#FF0000', 'color': '#f00' });
                        }
                    }
                }
                if (e.data.D3isOff) {
                    if (e.column.name === 'Wednesday') { e.cellElement.css({ 'background-color': '#DCDCDC' }); }
                }
                else {
                    if ((e.data.D3ShiftStart == null || e.data.D3ShiftEnd == null)) {
                        if (e.column.name === 'Wednesday') {
                            e.cellElement.css({ 'background-color': '#FF0000', 'color': '#f00' });
                        }
                    }
                }
                if (e.data.D4isOff) {
                    if (e.column.name === 'Thursday') { e.cellElement.css({ 'background-color': '#DCDCDC' }); }
                }
                else {
                    if ((e.data.D4ShiftStart == null || e.data.D4ShiftEnd == null)) {
                        if (e.column.name === 'Thursday') {
                            e.cellElement.css({ 'background-color': '#FF0000', 'color': '#f00' });
                        }
                    }
                }
                if (e.data.D5isOff) {
                    if (e.column.name === 'Friday') { e.cellElement.css({ 'background-color': '#DCDCDC' }); }
                }
                else {
                    if ((e.data.D5ShiftStart == null || e.data.D5ShiftEnd == null)) {
                        if (e.column.name === 'Friday') {
                            e.cellElement.css({ 'background-color': '#FF0000', 'color': '#f00' });
                        }
                    }
                }
                if (e.data.D6isOff) {
                    if (e.column.name === 'Saturday') { e.cellElement.css({ 'background-color': '#DCDCDC' }); }
                }
                else {
                    if ((e.data.D6ShiftStart == null || e.data.D6ShiftEnd == null)) {
                        if (e.column.name === 'Saturday') {
                            e.cellElement.css({ 'background-color': '#FF0000', 'color': '#f00' });
                        }
                    }
                }
                if (e.data.D7isOff) {
                    if (e.column.name === 'Sunday') { e.cellElement.css({ 'background-color': '#DCDCDC' }); }
                }
                else {
                    if ((e.data.D7ShiftStart == null || e.data.D7ShiftEnd == null)) {
                        if (e.column.name === 'Sunday') {
                            e.cellElement.css({ 'background-color': '#FF0000', 'color': '#f00' });
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
                        if (gridCell.column.name === 'Monday')
                            options.backgroundColor = '#DCDCDC';
                    }
                    else {
                        if ((gridCell.data.D1ShiftStart == null || gridCell.data.D1ShiftEnd == null)) {
                            if (gridCell.column.name === 'Monday') {
                                options.backgroundColor = '#FF0000';
                            }
                        }
                    }
                }
                if (gridCell.rowType === 'data') {

                    if (gridCell.data.D2isOff) {
                        if (gridCell.column.name === 'Tuesday')
                            options.backgroundColor = '#DCDCDC';
                    }
                    else {
                        if ((gridCell.data.D2ShiftStart == null || gridCell.data.D2ShiftEnd == null)) {
                            if (gridCell.column.name === 'Tuesday') {
                                options.backgroundColor = '#FF0000';
                            }
                        }
                    }
                }
                if (gridCell.rowType === 'data') {

                    if (gridCell.data.D3isOff) {
                        if (gridCell.column.name === 'Wednesday')
                            options.backgroundColor = '#DCDCDC';
                    }
                    else {
                        if ((gridCell.data.D3ShiftStart == null || gridCell.data.D3ShiftEnd == null)) {
                            if (gridCell.column.name === 'Wednesday') {
                                options.backgroundColor = '#FF0000';
                            }
                        }
                    }
                }
                if (gridCell.rowType === 'data') {

                    if (gridCell.data.D4isOff) {
                        if (gridCell.column.name === 'Thursday')
                            options.backgroundColor = '#DCDCDC';
                    }
                    else {
                        if ((gridCell.data.D4ShiftStart == null || gridCell.data.D4ShiftEnd == null)) {
                            if (gridCell.column.name === 'Thursday') {
                                options.backgroundColor = '#FF0000';
                            }
                        }
                    }
                }
                if (gridCell.rowType === 'data') {

                    if (gridCell.data.D5isOff) {
                        if (gridCell.column.name === 'Friday')
                            options.backgroundColor = '#DCDCDC';
                    }
                    else {
                        if ((gridCell.data.D5ShiftStart == null || gridCell.data.D5ShiftEnd == null)) {
                            if (gridCell.column.name === 'Friday') {
                                options.backgroundColor = '#FF0000';
                            }
                        }
                    }
                }
                if (gridCell.rowType === 'data') {

                    if (gridCell.data.D6isOff) {
                        if (gridCell.column.name === 'Saturday')
                            options.backgroundColor = '#DCDCDC';
                    }
                    else {
                        if ((gridCell.data.D6ShiftStart == null || gridCell.data.D6ShiftEnd == null)) {
                            if (gridCell.column.name === 'Saturday') {
                                options.backgroundColor = '#FF0000';
                            }
                        }
                    }
                }
                if (gridCell.rowType === 'data') {

                    if (gridCell.data.D7isOff) {
                        if (gridCell.column.name === 'Sunday')
                            options.backgroundColor = '#DCDCDC';
                    }
                    else {
                        if ((gridCell.data.D7ShiftStart == null || gridCell.data.D7ShiftEnd == null)) {
                            if (gridCell.column.name === 'Sunday') {
                                options.backgroundColor = '#FF0000';
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