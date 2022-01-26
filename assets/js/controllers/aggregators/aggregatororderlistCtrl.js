'use strict';
app.controller('aggregatororderlistCtrl', aggregatororderlistCtrl);
function aggregatororderlistCtrl($scope,$modal, toaster, $interval, $http, NG_SETTING, $q, $rootScope, $location, $translate, $timeout, $element, userService) {
    $rootScope.uService.EnterController("aggregatororderlistCtrl");
    //  userService.userAuthorizated();
    var promise;

    $scope.translate = function () {        

    };
    $scope.translate();
    var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });

    $scope.sumColumnJS = function sumColumnJS(array, col) {
        var sum = 0;
        array.forEach(function (value, index, array) {
            sum += value[col];
        });
        return sum;
    }

    $scope.TrendsGridOptions = {
        dataSource: new DevExpress.data.CustomStore({
            key: "id",
            load: function (loadOptions) {
                var params = {
                    /* StoreID: $scope.item.StoreID,
                     */
                };

                return $http.get(NG_SETTING.apiServiceBaseUri + "/api/aggregator/unmappedorders", { params: params })
                    .then(function (response) {
                        return {
                            data: response.data,
                            totalCount: 10
                        };
                    }, function (response) {
                        return $q.reject("Data Loading Error");
                    });
            }
        }),
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        allowColumnReordering: true,
        filterRow: { visible: true },
        //filterPanel: { visible: true },
        headerFilter: { visible: true },
        grouping: { autoExpandAll: true },
        searchPanel: { visible: true },
        //groupPanel: { visible: true },
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        remoteOperations: false,
        repaintChangesOnly: true,
        highlightChanges: true,
        hoverStateEnabled: true,
        twoWayBindingEnabled: false,
        repaintChangesOnly: true,
        loadPanel: { enabled: false },
        // stateStoring: {
        //     enabled: true,
        //     type: "localStorage",
        //     storageKey: "dx-trendsGrid"
        // },
        columns: [
            { dataField: "Store", caption: $translate.instant('trends.Store'), visibleIndex: 0, fixed: true, dataType: "string", sortIndex: 0, sortOrder: "asc" },
            { dataField: "id", visible: false },
            { dataField: "Reservation.NGUser.FullName",   caption: "Reservation", },
            { dataField: "AggregatorOrderID", visible: false },
            { dataField: "ClientID", visible: false },
            { dataField: "AddressID", visible: false },
            { dataField: "AggregatorOrderStateID", visible: false },
            
            { dataField: "Aggregator",   caption: $translate.instant('unmappedorders.Aggregator'),width:70 },
            { dataField: "Name",   caption: $translate.instant('unmappedorders.Name'), },
            { dataField: "ClientPhone",   caption:"ClientPhone",width:120 },
            
            { dataField: "Address",  caption: $translate.instant('unmappedorders.Address'),width:600 },
            { dataField: "Notes",   caption: $translate.instant('unmappedorders.Notes'),width:285 },
           // "Aggregator", "Name", "Address", "Notes", //"OrderDate",
            {
                caption: $translate.instant('unmappedorders.OrderDate'),
                dataField: "OrderDate",
                dataType: "date",
                format: "yyyy-MM-dd HH:mm",
                width:110
                //{ year: "2-digit", month: "narrow", day: "2-digit" }
            },
           
            {             
                caption: $translate.instant('unmappedorders.Commands'),
                //dataField: "Store",
                type: "buttons",
                buttons: [{
                    text: "Customer Map",
                    icon: "repeat",
                    hint: "Customer Map",
                    visible: function (e) {
                        return !e.row.isEditing && e.row.data.AggregatorOrderStateID == 1;//!e.row.isEditing && !isChief(e.row.data.Position);
                    },
                    onClick: function (e) {
                        if (e.row.data.Reservation && e.row.data.Reservation.UserID != $rootScope.user.id) {
                            toaster.pop('error',  $translate.instant('orderfile.Recordlocked'), e.row.data.Reservation.NGUser.FullName);
                        } else {
                        if (e.row.data.AggregatorOrderStateID == 1)
                            $location.path('/app/aggregators/customermap/' + e.row.data.id);
                        }
                    }
                },
                {
                    text: "Change Store",
                    icon: "refresh",
                    hint: "Change Store",
                    visible: function (e) {
                        return !e.row.isEditing && e.row.data.AggregatorOrderStateID == 1;//!e.row.isEditing && !isChief(e.row.data.Position);
                    },
                    onClick: function (e) {
                        var modalInstance = $modal.open({
                            templateUrl: 'assets/views/orderdisplay/changeysorderstore.html',
                            controller: 'changeysorderstoreCtrl',
                            size: '',
                            backdrop: '',
                            resolve: {
                                order: function () {
                                    return e.row.data;
                                },
                            }
                        });
                        modalInstance.result.then(function (result) {
                            if (result == 'OK') {
                                refreshData();  
                            }
                            else {
                                refreshData();
                            }
                        })
                    }
                },
                {
                    text: "Reject",
                    icon: "remove",//"fa fa-home",
                    hint: "Reject Order",
                    onClick: function (e) {
                        //DevExpress.ui.notify("Reject order", "warning");
                        var modalInstance = $modal.open({
                            templateUrl: 'assets/views/orderdisplay/ysorderrejectreason.html',
                            controller: 'ysorderrejectreasonCtrl',
                            size: '',
                            backdrop: '',
                            resolve: {
                                order: function () {
                                    return e.row.data;
                                },
                            }
                        });
                        modalInstance.result.then(function (result) {
                            if (result == 'OK') {
                                refreshData();  
                            }
                            else {
                                refreshData();
                            }
                        })
                        
                    },
                }]
            }
        ],
        summary: {
            totalItems: [{ column: "Store", summaryType: "count", displayFormat: "{0}" },
            ],
            groupItems: [
                { column: "Store", summaryType: "count", displayFormat: "{0}" },
            ],
        },
        onCellPrepared: function (options) {
            if (options.rowType == 'data') {
                var fieldData = options.value;
                if (options.rowType == 'data' && options.column.name && options.column.name.length > 5 && options.column.name == "TodayIncome") {
                    var fieldData = options.value;
                    var fieldHtml = "";
                    if (options.row.data["TodayIncome"] != options.row.data["PrewWeekIncome"]) {
                        options.cellElement.addClass((options.row.data["TodayIncome"] > options.row.data["PrewWeekIncome"]) ? "inc" : "dec");
                        fieldHtml += "<div class='current-value'>" +
                            "</div> <div class='diff'>" +
                            parseInt(fieldData).toLocaleString() +
                            "  </div>";
                    }
                    /* else {
                        fieldHtml = fieldData.value;
                    } */
                    options.cellElement.html(fieldHtml);
                }
                // if (options.column.name && options.column.name == "TodayIncome") {
                //     if (options.row.data["TodayIncome"] != options.row.data["PrewWeekIncome"]) {

                //         if (options.row.data["TodayIncome"] < options.row.data["PrewWeekIncome"])
                //             options.cellElement.css({ 'color': '#f00' });
                //         else
                //             options.cellElement.css({ 'color': '#2ab71b' });
                //     }

                // }
                if (options.column.name && options.column.name == "TodayTC") {
                    if (options.row.data["TodayTC"] != options.row.data["PrewWeekTC"]) {

                        if (options.row.data["TodayTC"] < options.row.data["PrewWeekTC"])
                            options.cellElement.css({ 'color': '#f00' });
                        else
                            options.cellElement.css({ 'color': '#2ab71b' });
                    }

                }
                if (options.column.name && options.column.name == "HitRate") {
                    if (options.row.data["HitRate"] != 0) {

                        if (options.row.data["HitRate"] < 0)
                            options.cellElement.css({ 'color': '#f00' });
                        else
                            options.cellElement.css({ 'color': '#2ab71b' });
                    }

                }
            }
        },
        onRowClick: function (rowInfo) {
            if (rowInfo.data.Reservation && rowInfo.data.Reservation.UserID != $rootScope.user.id) {
                toaster.pop('error', $translate.instant('orderfile.Recordlocked'), rowInfo.data.Reservation.NGUser.FullName);
            } else {
                if (rowInfo.rowType == "data" && rowInfo.data.AggregatorOrderStateID == 1)
                    $location.path('/app/aggregators/customermap/' + rowInfo.data.id);
            }
        },
        onDataErrorOccurred: function (e) {
            console.log(e.error);
        },
        export: {
            enabled: ($rootScope.user.restrictions.UnmapedAggregatorOrdesex == 'Enable'),
            fileName: "Unmaped Aggregator Ordes",
            customizeExcelCell: (options) => {
                var gridCell = options.gridCell;
                var fieldData = options.value;
                if (!gridCell) {
                    return;
                }
                if (options.gridCell.rowType == 'data' && gridCell.column.name && gridCell.column.name == "TodayIncome")
                    if (gridCell.data && gridCell.data["TodayIncome"] != gridCell.data["PrewWeekIncome"])
                        if (gridCell.data["TodayIncome"] > gridCell.data["PrewWeekIncome"])
                            options.font.color = '#008000';
                        else
                            options.font.color = '#FF0000';
                if (options.gridCell.rowType == 'data' && gridCell.column.name && gridCell.column.name == "TodayTC")
                    if (gridCell.data && gridCell.data["TodayTC"] != gridCell.data["PrewWeekTC"])
                        if (gridCell.data["TodayTC"] > gridCell.data["PrewWeekTC"])
                            options.font.color = '#008000';
                        else
                            options.font.color = '#FF0000';
                if (options.gridCell.rowType == 'data' && gridCell.column.name && gridCell.column.name == "HitRate")
                    if (gridCell.data && gridCell.data["HitRate"] != 0)
                        if (gridCell.data["HitRate"] > 0)
                            options.font.color = '#008000';
                        else
                            options.font.color = '#FF0000';
            }


        },
        scrolling: { mode: "virtual" },
        //height: 600
    };
    function numberWithCommas(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
    var refreshData = function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.refresh();
    }
    var onAggregatorOrder = $scope.$on('AggregatorOrderUpdate', function (event, data) { 
        refreshData(); 
    });
    
    // var onAggregatorOrder = $scope.$on('AggregatorOrder', function (event, data) {
    //    refreshData();
    // });
    // $scope.start = function () {
    //     $scope.stop();
    //     promise = $interval(refreshData, 30000);
    // };

    // $scope.stop = function () {
    //     $interval.cancel(promise);
    // };
    // $scope.start();

    $scope.$on('$destroy', function () {
        //$scope.stop();
        onAggregatorOrder();
        refreshData();
        //NewAggregatorOrderfresh();
        tranlatelistener();
        $element.remove();
        $rootScope.uService.ExitController("aggregatororderlistCtrl");
    });
};
