'use strict';
app.controller('shiftplanactualCtrl', shiftplanactualCtrl);
function shiftplanactualCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q, userService, localStorageService) {
    if (!$rootScope.ReportParameters.StartDate) {
        $rootScope.ReportParameters.StartDate = moment().add(-1, 'days').format('YYYY-MM-DD ');//$filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if (!$rootScope.ReportParameters.EndDate) {
        $rootScope.ReportParameters.EndDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    //DevExpress.localization.locale("tr");
    $scope.NewDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    var ctrl = this;
    $scope.Time = ngnotifyService.ServerTime();
    function ISO8601_week_no(dt) {
        var tdt = new Date(dt.valueOf());
        var dayn = (dt.getDay() + 6) % 7;
        tdt.setDate(tdt.getDate() - dayn + 3);
        var firstThursday = tdt.valueOf();
        tdt.setMonth(0, 1);
        if (tdt.getDay() !== 4) {
            tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
        }
        return 1 + Math.ceil((firstThursday - tdt) / 604800000);
    }
    var cYeaar = parseInt(((new Date()).getFullYear()));
    $scope.startYear = cYeaar;
    $scope.endYear = cYeaar;
    var minYear = parseInt(cYeaar - 4);
    var maxYear = parseInt(cYeaar);
    var vNumber = ISO8601_week_no((new Date()));
    $scope.startWeek = parseInt(vNumber - 2);
    $scope.endWeek = parseInt(vNumber - 1);
    $scope.VeiwHeader = {};
    $scope.startYearButton = {
        bindingOptions: {
            value: "startYear"
        },
        min: minYear,
        max: maxYear,
        showSpinButtons: true
    };
    $scope.startWeekButton = {
        bindingOptions: {
            value: "startWeek"
        },
        min: 1,
        max: 53,
        showSpinButtons: true
    };
    $scope.endYearButton = {
        bindingOptions: {
            value: "endYear"
        },
        min: minYear,
        max: maxYear,
        showSpinButtons: true
    };
    $scope.endWeekButton = {
        bindingOptions: {
            value: "endWeek"
        },
        min: 1,
        max: 53,
        showSpinButtons: true
    };
    $scope.addNewButtonOptions = {
        text: $scope.addnewdelivery,
        onClick: function () {
            location.href = '#/app/specialoperations/shiftplanactualedit/';
        }
    };
    $scope.resetlayout = $translate.instant('main.RESETLAYOUT');
    $scope.resetButtonOptions = {
        text: $scope.resetlayout,
        onClick: function () {
            $("#gridContainer").dxPivotGrid("instance").getDataSource().state({});
        }
    };
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
        var result= 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
        return result>52?0:result;
        //return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    }

    function getDateRangeOfWeek(weekNo, y) {
        var d1, numOfdaysPastSinceLastMonday, rangeIsFrom, rangeIsTo;
        d1 = new Date('' + y + '');
        numOfdaysPastSinceLastMonday = d1.getDay() - 1;
        d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
        d1.setDate(d1.getDate() + (7 * (weekNo - d1.getWeek())));
        rangeIsFrom = d1.getDate() + "-" + (d1.getMonth() + 1) + "-" + d1.getFullYear();
        d1.setDate(d1.getDate() + 6);
        rangeIsTo = d1.getDate() + "-" + (d1.getMonth() + 1) + "-" + d1.getFullYear();
        return rangeIsFrom + " to " + rangeIsTo;
    };
    function getStaratOfWeek(weekNo, y) {
        var d1, numOfdaysPastSinceLastMonday, rangeIsFrom, rangeIsTo;
        d1 = new Date('' + y + '');
        numOfdaysPastSinceLastMonday = d1.getDay() - 1;
        d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
        d1.setDate(d1.getDate() + (7 * (weekNo - d1.getWeek())));
        return d1;
    };
    $scope.dataGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxShiftActuals",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxShiftActuals",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxShiftActuals",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxShiftActuals",
            onBeforeSend: function (method, ajaxOptions) {
                //if (request.method === "PUT") {
                //    updateUrl = NG_SETTING.apiServiceBaseUri + "/api/dxUser"+
                //}
                var authData = localStorageService.get('authorizationData');
                if (authData) {

                    ajaxOptions.headers = {
                        Authorization: 'Bearer ' + authData.token//,
                        //'Content-type': 'application/json'
                    };
                }
                
            },
            onAjaxError: function (e) {
                //var emsg=e.xhr.responseText.map(item => ExceptionMessage);
                var obj = JSON.parse(e.xhr.responseText);
                //console.log(obj.ExceptionMessage);
                toaster.pop('error', obj.Message, obj.ExceptionMessage);
            },
            remoteOperations: {
                filtering: true,
                sorting: true,
                grouping: true
            },

        }),
        remoteOperations:true,
        showBorders: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showBorders: true,
        filterRow: { visible: true },
        //filterPanel: { visible: true },
        headerFilter: { visible: true },
        columnChooser: {
            enabled: true
        },
        columnFixing: {
            enabled: true
        },
        sorting: {
            mode: "single"
        },
        editing: {
            allowAdding: true,
            allowDeleting: ($rootScope.user.restrictions.shiftplanactual_delete == 'Enable'),
            useIcons: true
        },
        columns: [
            // {
            //     type: "buttons", width: 100, buttons: [{ hint: "edit", icon: "edit", onClick: function (e) { location.href = '#/app/specialoperations/shiftplanedit2/' + e.row.data.id; } }
            //         , "save", "cancel"]
            // },
            {
                dataField: "StoreID", caption: $translate.instant('main.STORE'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStore",
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
            { dataField: "PeriodYear", sortIndex: 0, sortOrder: "desc" ,caption: $translate.instant('main.YEAR')},
            { dataField: "PeriodWeek", sortIndex: 1, sortOrder: "desc",caption: $translate.instant('main.WEEK') },

            {
                caption: $translate.instant('main.FROMDATE'),
                calculateCellValue: function (data) {
                    return DevExpress.localization.formatDate(getStaratOfWeek(data.PeriodWeek, data.PeriodYear), "dd.MM.yyyy");
                    //return getDateRangeOfWeek(data.PeriodWeek,data.PeriodYear);
                },
                //sortOrder: "asc"
            }

        ],
        onInitNewRow: function (e) {
            e.data.PeriodYear = new Date().getFullYear();
            e.data.PeriodWeek = ISO8601_week_no((new Date()));
            e.data.StoreID = $rootScope.user.StoreID;
        },
        onRowInserted: function (e) {
            //location.href = '#/app/specialoperations/shiftplanedit2/' + e.key;
        },
        export: {
            enabled: true,
            fileName: "ShiftPlan List"
        },
        scrolling: {
            mode: "virtual"
        },
        onRowDblClick: function (e) {
            if (!e.isNewRow)
                location.href = '#/app/specialoperations/shiftplanactualedit/' + e.key;
        },
        onRowClick: function (rowInfo) {
            if (!rowInfo.isNewRow)
                location.href = '#/app/specialoperations/shiftplanactualedit/' + rowInfo.key;
            //rowInfo.component.editRow(rowInfo.rowIndex);  
        },
    };
    $scope.selectBox = {
        dataSourceUsage: {
            dataSource: new DevExpress.data.ArrayStore({
                data: $filter('orderBy')($rootScope.user.userstores, 'name'),
                key: "id"
            }),
            displayExpr: "name",
            valueExpr: "id",
            placeholder: "Select Store...",
            value: $rootScope.user.StoreID,
            bindingOptions: {
                value: "StoreID"
            }
        },
    };
    $scope.NewShiftPlan = function () {
        var item = {};
        if (userService.userIsInRole("STOREMANAGER")) {
            item.StoreID = $rootScope.user.StoreID;
        }
        else {
            item.StoreID = $scope.StoreID;
        }
        item.PeriodYear = $scope.Year;
        item.PeriodWeek = $scope.Week;
        Restangular.restangularizeElement('', item, 'ShiftPlan')
        item.post().then(function (resp) {
            location.href = '#/app/specialoperations/shiftplanedit2/' + resp.id;
        }, function (response) {
            toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };

    $scope.LoadData = function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.refresh();
    };

}