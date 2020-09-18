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
    function ConvertToSeconds(time) {
        if (time) {
            var splitTime = time.split(":");
            return splitTime[0] * 3600 + splitTime[1] * 60;
        }
        else
            return 0;
    }
    function SumHoursStr(startTime, endTime) {
        var dd = SumHours(startTime, endTime);
        return dd == 0 ? "" : "[" + dd + "]";

    }
    function SumHours(startTime, endTime) {
        var diff = 0;
        if (startTime && endTime) {
            var smon = ConvertToSeconds(startTime);
            var fmon = ConvertToSeconds(endTime);
            if (smon > fmon) {
                fmon += 86400;
            }
            diff = Math.abs(fmon - smon);

        }
        return diff / 3600;
    }
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
        var dataGrid = $('#advgridContainer').dxDataGrid('instance');
        dataGrid.option("dataSource",
            new DevExpress.data.CustomStore({
                //key: "id",
                load: function (loadOptions) {
                    var params = {
                        StoreID: $scope.item.StoreID,
                        theYear: $scope.item.PeriodYear,
                        theWeek: $scope.item.PeriodWeek
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
    var hstep = ['-', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
        '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
        '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00', '00:30', '00:45',
        '01:00', '01:30', '02:00', '02:30', '03:00', '03:15', '03:30', '03:45', '04:00', '04:30'];
    $scope.GetOffType = function (StaffOffTypeID) {
        if (StaffOffTypeID) {
            var selected = $filter('filter')(OffTypes, {
                id: StaffOffTypeID
            });
            return (selected.length) ? selected[0].Name : "Not set";
        }
        return "N/A";
    };
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
    $scope.advdataGridOptions = {
        //dataSource: store,
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        showBorders: true,
        allowColumnReordering: true,
        filterRow: { visible: true },
        //filterPanel: { visible: true },
        headerFilter: { visible: true },
        grouping: { autoExpandAll: true },
        searchPanel: { visible: true },
        groupPanel: { visible: true },
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        remoteOperations: false,
        repaintChangesOnly: true,
        highlightChanges: true,
        twoWayBindingEnabled: false,
        columns: [
            { dataField: "Position", caption: "Position", visibleIndex: 0, groupIndex: 0, fixed: true, dataType: "string" },
            { dataField: "WeekDay", caption: "WeekDay", visibleIndex: 1, fixed: true, dataType: "string" },
            { name: "Status_08",dataField: "Status_08", caption: "08", dataType: "number" },
            { name: "Status_09",dataField: "Status_09", caption: "09", dataType: "number" },
            { name: "Status_10",dataField: "Status_10", caption: "10", dataType: "number" },
            { name: "Status_11",dataField: "Status_11", caption: "11", dataType: "number" },
            { name: "Status_12",dataField: "Status_12", caption: "12", dataType: "number" },
            { name: "Status_13",dataField: "Status_13", caption: "13", dataType: "number" },
            { name: "Status_14",dataField: "Status_14", caption: "14", dataType: "number" },
            { name: "Status_15",dataField: "Status_15", caption: "15", dataType: "number" },
            { name: "Status_16",dataField: "Status_16", caption: "16", dataType: "number" },
            { name: "Status_17",dataField: "Status_17", caption: "17", dataType: "number" },
            { name: "Status_18",dataField: "Status_18", caption: "18", dataType: "number" },
            { name: "Status_19",dataField: "Status_19", caption: "19", dataType: "number" },
            { name: "Status_20",dataField: "Status_20", caption: "20", dataType: "number" },
            { name: "Status_21",dataField: "Status_21", caption: "21", dataType: "number" },
            { name: "Status_22",dataField: "Status_22", caption: "22", dataType: "number" },
            { name: "Status_23",dataField: "Status_23", caption: "23", dataType: "number" },
            { name: "Status_00",dataField: "Status_00", caption: "00", dataType: "number" },
            { name: "Status_01",dataField: "Status_01", caption: "01", dataType: "number" },
            { name: "Status_02",dataField: "Status_02", caption: "02", dataType: "number" },
            { name: "Status_03",dataField: "Status_03", caption: "03", dataType: "number" }
        ],
        onCellPrepared: function (e) {
            
            if (e.rowType == 'data' && e.column.name && e.column.name.length>5 && e.column.name.substring(0,6)=="Status") {
                var fieldData = e.value;
                var fieldHtml = "";
                if (fieldData != 0) {
                    e.cellElement.addClass((fieldData > 0) ? "inc" : "dec");
                    fieldHtml += "<div class='diff'>" +
                        Math.abs(fieldData.toFixed(2)) +
                        "  </div>";
                } 
                /* else {
                    fieldHtml = fieldData.value;
                } */
                e.cellElement.html(fieldHtml);
            }
        },
        onDataErrorOccurred: function (e) {
            console.log(e.error);
        },
        export: {
            enabled: true, fileName: "ShiftPlan",

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
        filterValue: ["ShiftPlanID", "=", $stateParams.id],
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        showBorders: true,
        allowColumnReordering: true,
        filterRow: { visible: true },
        //filterPanel: { visible: true },
        headerFilter: { visible: true },
        grouping: { autoExpandAll: true },
        searchPanel: { visible: true },
        groupPanel: { visible: true },
        editing: {
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            allowInserting: true,
            useIcons: true,
            mode: "popup",

            popup: {
                title: "Edit Staff Shift", showTitle: true,
                //fullScreen: true 
            },
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
        remoteOperations: false,
        onRowClick: function (rowInfo) {
            if (rowInfo.rowType == "data")
                rowInfo.component.editRow(rowInfo.rowIndex);
        },
        onInitNewRow: function (e) {
            e.data.ShiftPlanID = $scope.item.id;
        },
        onRowInserted: function (e) {
            var dataGrid = $('#advgridContainer').dxDataGrid('instance');
            dataGrid.refresh();
        },
        onRowUpdated: function (e) {
            var dataGrid = $('#advgridContainer').dxDataGrid('instance');
            dataGrid.refresh();
        },
        onEditorPreparing: function (e) {
            if (e.parentType === "dataRow" && e.dataField === "NGUserID") {
                e.editorOptions.disabled = (typeof e.row.data.StaffPositionID !== "number");
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
                    { dataField: "ShiftPlanID", caption: "Name", visible: false, formItem: { visible: false } },
                    {
                        dataField: "StaffPositionID", caption: "Position",
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
                        calculateSortValue: function (data) {
                            var value = this.calculateCellValue(data);
                            return this.lookup.calculateCellValue(value);
                        }
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
                    {
                        dataField: "D1isOff", caption: "Off day", visible: false,
                        setCellValue: function (rowData, value) {
                            rowData.D1isOff = value;
                            rowData.D1OffTypeID = null;
                        }
                    },
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
                    {
                        dataField: "D2isOff", caption: "Off day", visible: false, setCellValue: function (rowData, value) {
                            rowData.D2isOff = value;
                            rowData.D2OffTypeID = null;
                        }
                    },


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
                    {
                        dataField: "D3isOff", caption: "Off day", visible: false, setCellValue: function (rowData, value) {
                            rowData.D3isOff = value;
                            rowData.D3OffTypeID = null;
                        }
                    },

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
                    {
                        dataField: "D4isOff", caption: "Off day", visible: false, setCellValue: function (rowData, value) {
                            rowData.D4isOff = value;
                            rowData.D4OffTypeID = null;
                        }
                    },

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
                    {
                        dataField: "D5isOff", caption: "Off day", visible: false, setCellValue: function (rowData, value) {
                            rowData.D5isOff = value;
                            rowData.D5OffTypeID = null;
                        }
                    },

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
                    {
                        dataField: "D6isOff", caption: "Off day", visible: false, setCellValue: function (rowData, value) {
                            rowData.D6isOff = value;
                            rowData.D6OffTypeID = null;
                        }
                    },

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
                    {
                        dataField: "D7isOff", caption: "Off day", visible: false, setCellValue: function (rowData, value) {
                            rowData.D7isOff = value;
                            rowData.D7OffTypeID = null;
                        }
                    },
                    {
                        caption: "Monday",
                        name: "Monday",
                        visibleIndex: 5,
                        calculateCellValue: function (data) {
                            if (data.D1isOff)
                                return $scope.GetOffType(data.D1OffTypeID);
                            return [data.D1ShiftStart,
                            data.D1ShiftEnd]
                                .join("-") + " " + SumHoursStr(data.D1ShiftStart, data.D1ShiftEnd);
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
                                .join("-") + " " + SumHoursStr(data.D2ShiftStart, data.D2ShiftEnd);
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
                                .join("-") + " " + SumHoursStr(data.D3ShiftStart, data.D3ShiftEnd);
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
                                .join("-") + " " + SumHoursStr(data.D4ShiftStart, data.D4ShiftEnd);
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
                                .join("-") + " " + SumHoursStr(data.D5ShiftStart, data.D5ShiftEnd);
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
                                .join("-") + " " + SumHoursStr(data.D6ShiftStart, data.D6ShiftEnd);
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
                                .join("-") + " " + SumHoursStr(data.D7ShiftStart, data.D7ShiftEnd);
                        }
                    },
                    {
                        caption: "Total Hours",
                        name: "TotalHours",
                        visibleIndex: 12,
                        calculateCellValue: function (data) {
                            return SumHours(data.D1ShiftStart, data.D1ShiftEnd) +
                                SumHours(data.D2ShiftStart, data.D2ShiftEnd) +
                                SumHours(data.D3ShiftStart, data.D3ShiftEnd) +
                                SumHours(data.D4ShiftStart, data.D4ShiftEnd) +
                                SumHours(data.D5ShiftStart, data.D5ShiftEnd) +
                                SumHours(data.D6ShiftStart, data.D6ShiftEnd) +
                                SumHours(data.D7ShiftStart, data.D7ShiftEnd);
                        },
                        format: { type: "fixedPoint", precision: 2 }
                    },



                ]
            }
        ],
        summary: {
            totalItems: [
                {
                    column: "TotalHours",
                    name: "TotalHours",
                    summaryType: "sum",
                    valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}"
                    //, summaryType: "custom"
                    //    , valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" 
                }
            ],
            calculateCustomSummary: function (options) {
                if (options.name === "TotalHours") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            //options.dg = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue + SumHours(options.value.D7ShiftStart, options.value.D7ShiftEnd);
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
                        if (SumHours(e.data.D1ShiftStart, e.data.D1ShiftEnd) == 0 || SumHours(e.data.D1ShiftStart, e.data.D1ShiftEnd) > 8.5) {
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
                        if (SumHours(e.data.D2ShiftStart, e.data.D2ShiftEnd) == 0 || SumHours(e.data.D2ShiftStart, e.data.D2ShiftEnd) > 8.5) {
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
                        if (SumHours(e.data.D3ShiftStart, e.data.D3ShiftEnd) == 0 || SumHours(e.data.D3ShiftStart, e.data.D3ShiftEnd) > 8.5) {
                            if (e.column.name === 'Wednesday') {
                                e.cellElement.css({ 'color': '#f00' });
                            }
                        }
                    }
                }
                if (e.data.D4isOff) {
                    if (e.column.name === 'Thursday') {
                        e.cellElement.css({ 'background-color': '#DCDCDC' });
                        if (typeof e.row.data.D3OffTypeID !== "number")
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
                        if (SumHours(e.data.D4ShiftStart, e.data.D4ShiftEnd) == 0 || SumHours(e.data.D4ShiftStart, e.data.D4ShiftEnd) > 8.5) {
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
                        if (SumHours(e.data.D5ShiftStart, e.data.D5ShiftEnd) == 0 || SumHours(e.data.D5ShiftStart, e.data.D5ShiftEnd) > 8.5) {
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
                        if (SumHours(e.data.D6ShiftStart, e.data.D6ShiftEnd) == 0 || SumHours(e.data.D6ShiftStart, e.data.D6ShiftEnd) > 8.5) {
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
                        if (SumHours(e.data.D7ShiftStart, e.data.D7ShiftEnd) == 0 || SumHours(e.data.D7ShiftStart, e.data.D7ShiftEnd) > 8.5) {
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
                            if (SumHours(gridCell.data.D1ShiftStart, gridCell.data.D1ShiftEnd) == 0 || SumHours(gridCell.data.D1ShiftStart, gridCell.data.D1ShiftEnd) > 8.5) {
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
                            if (SumHours(gridCell.data.D2ShiftStart, gridCell.data.D2ShiftEnd) == 0 || SumHours(gridCell.data.D2ShiftStart, gridCell.data.D2ShiftEnd) > 8.5) {
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
                            if (SumHours(gridCell.data.D3ShiftStart, gridCell.data.D3ShiftEnd) == 0 || SumHours(gridCell.data.D3ShiftStart, gridCell.data.D3ShiftEnd) > 8.5) {
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
                            if (SumHours(gridCell.data.D4ShiftStart, gridCell.data.D4ShiftEnd) == 0 || SumHours(gridCell.data.D4ShiftStart, gridCell.data.D4ShiftEnd) > 8.5) {
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
                            if (SumHours(gridCell.data.D5ShiftStart, gridCell.data.D5ShiftEnd) == 0 || SumHours(gridCell.data.D5ShiftStart, gridCell.data.D5ShiftEnd) > 8.5) {
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
                            if (SumHours(gridCell.data.D6ShiftStart, gridCell.data.D6ShiftEnd) == 0 || SumHours(gridCell.data.D6ShiftStart, gridCell.data.D6ShiftEnd) > 8.5) {
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
                            if (SumHours(gridCell.data.D7ShiftStart, gridCell.data.D7ShiftEnd) == 0 || SumHours(gridCell.data.D7ShiftStart, gridCell.data.D7ShiftEnd) > 8.5) {
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