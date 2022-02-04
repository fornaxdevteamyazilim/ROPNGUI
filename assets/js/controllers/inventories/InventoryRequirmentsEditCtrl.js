'use strict';
app.controller('InventoryRequirmentsEditCtrl', InventoryRequirmentsEditCtrl);
function InventoryRequirmentsEditCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, ngnotifyService, userService, $element, $http, NG_SETTING) {
    $rootScope.uService.EnterController("InventoryRequirmentsEditCtrl");
    $scope.item = {};
    $scope.deliverydates = [];
    $scope.cdate = false;
    $scope.item.Amount = 0;
    $scope.item.UnitCustom = 0;
    $scope.item.UnitPrice = 0;
    $scope.item.GrandTotal = 0;
    $scope.canDelete = false;
    userService.userAuthorizated();
    $scope.Back = function () {
        $location.path('app/inventory/inventoryrequirments/list');
    };
    var deregistration = $scope.$on('isSipnner', function (event, data) {
        $scope.isSpinner = data;
    });
    $scope.translate = function () {
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trInventory = $translate.instant('main.INVENTORY');
        $scope.trCalculatedCount = $translate.instant('main.CALCULATEDCOUNT');
        $scope.trInventoryUnit = $translate.instant('main.INVENTORYUNIT');
        $scope.trUnitPrice = $translate.instant('main.UNITPRICE');
        $scope.trDemandCount = $translate.instant('main.DEMANDCOUNT');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trisProcesseed = $translate.instant('main.STATE');
        $scope.back = $translate.instant('main.BACK');
        $scope.note = $translate.instant('main.NOTE');
        $scope.datetime = $translate.instant('main.DATETIME');
        $scope.deliverydatetime = $translate.instant('main.DELIVERYDATE');
        $scope.save = $translate.instant('main.SAVE');
        $scope.delete = $translate.instant('main.DELETE');
        $scope.print = $translate.instant('main.PRINT');
        $scope.addrequirmentitem = $translate.instant('main.ADDREQUIRMENTITEM');
        $scope.trSupplyDescription = $translate.instant('main.DESCRIPTION');
        $scope.edit = $translate.instant('main.EDIT');
        $scope.selectinventorygroup = $translate.instant('main.SELECTINVENTORYGROUP');
        $scope.amount = $translate.instant('main.AMOUNT₺');
        $scope.vat = $translate.instant('main.VAT₺');
        $scope.vatdiscount = $translate.instant('main.VATDISCOUNT%');
        $scope.discount = $translate.instant('main.DISCOUNT₺');
        $scope.grandtotal = $translate.instant('main.GRANDTOTAL');
        $scope.assigntoinvoice = $translate.instant('main.ASSIGNTOINVOICE');
        $scope.send = $translate.instant('main.SEND');
        $scope.ispaid = $translate.instant('main.ISPAID');
        $scope.trVATRatio = $translate.instant('main.VATRATIO');
        $scope.trVat = $translate.instant('main.VAT');
        $scope.trAmount = $translate.instant('main.AMOUNT');
        $scope.Processed = $translate.instant('main.PROCESSED');
        $scope.Process = $translate.instant('main.PROCESS');
        $scope.trfactor = $translate.instant('main.FACTOR');
        $scope.trBaseUnit = $translate.instant('main.BASEUNIT');
        $scope.trRequirment = $translate.instant('main.REQUIRMENTFACTOR');

    };

    $scope.translate();
    var deregistration1 = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });

    $scope.InventoryRequirmentID = $stateParams.id;
    if ($stateParams.id != 'new')
        Restangular.one('InventoryRequirment', $stateParams.id).get().then(function (restresult) {
            $scope.original = restresult;
            $scope.canDelete = !restresult.isProcesseed && $rootScope.user.restrictions.requirmentsdeletes == 'Enable';
            $scope.cdate = !restresult.isProcesseed;
            if (restresult.isProcesseed == true)
                restresult.isProcesseed = $scope.Processed;
            if (restresult.isProcesseed == false)
                restresult.isProcesseed = $scope.Process;
            $scope.item = Restangular.copy(restresult);
            $scope.item.Date = $filter('date')($scope.item.Date, 'yyyy-MM-dd')
            $location.path('app/inventory/inventoryrequirments/edit/' + restresult.id);
            $scope.$broadcast('newRequirmentData', restresult);
        })
    else {
        $scope.item = {};
        $scope.item.Date = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    }
    $scope.SaveData = function (processaftersave) {

        if ($scope.item.restangularized && $scope.item.id) {
            $scope.item.put().then(function (resp) {
                if (processaftersave)
                    $scope.processrequirment();
                else
                    $location.path('app/inventory/inventoryrequirments/list');
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                $scope.ShowObject = false;
            });
        } else {
            $scope.ShowObject = true;
            Restangular.restangularizeElement('', $scope.item, 'InventoryRequirment')
            $scope.item.post().then(function (resp) {
                $scope.item.id = resp.id;
                $scope.InventoryRequirmentID = resp.id;
                if (processaftersave)
                    $scope.processrequirment();
                else
                    $location.path('app/inventory/inventoryrequirments/edit/' + resp.id);
                $scope.ShowObject = false;
                $scope.$broadcast('newRequirmentData', resp);
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                $scope.ShowObject = false;
            });
        }


    };
    $scope.processrequirment = function () {
        SweetAlert.swal({
            title: $translate.instant('invantories.Sure'),
            text: $translate.instant('invantories.DoYouWantToProcessTheNeedsList'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('invantories.YesWithWork'),
            cancelButtonText: $translate.instant('invantories.Nodontprocess'),
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {

                if (isConfirm) {
                    $scope.isSpinner = true;
                    Restangular.all('InventorySupply/processrequirment').getList({
                        InventoryRequirmentID: $stateParams.id
                    }).then(function (result) {
                        $scope.isSpinner = false;
                        toaster.pop('success', $translate.instant('orderfile.Updated'));
                        Restangular.one('InventoryRequirment', $stateParams.id).get().then(function (restresult) {
                            $location.path('app/inventory/inventoryrequirments/list');
                            $scope.original = restresult;
                            $scope.item = Restangular.copy(restresult);
                        })
                    }, function (response) {
                        toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                        $scope.isSpinner = false;
                    });
                    SweetAlert.swal($translate.instant('invantories.Processed'), $translate.instant('invantories.Yourlistofneedshasbeenprocessed'), "success");
                } else {
                    SweetAlert.swal($translate.instant('invantories.Notprocessed'), $translate.instant('invantories.Yourlistofneedshasnotbeenprocessed'), "error");
                }
            });
    };
    $scope.removedata = function (SelectItem) {
        SweetAlert.swal({
            title: $translate.instant('invantories.Sure'),
            text: $translate.instant('invantories.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('invantories.confirmButtonText'),
            cancelButtonText: $translate.instant('invantories.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                $scope.item.remove().then(function () {
                    SweetAlert.swal($translate.instant('invantories.Deleted'), $translate.instant('invantories.RecordDeleted'), "success");
                    $location.path('app/inventory/inventoryrequirments/list');
                }, function (response) {
                    toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
            else {
                SweetAlert.swal($translate.instant('invantories.Cancelled'), $translate.instant('invantories.DeletionCanceled'), "error");
            }
        });
    };
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
            $scope.item.Date = item;

        })
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
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({ Calculate: false }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.saveItem = function () {
        $scope.isSpinner = true;
        $scope.$emit('isSipnner', $scope.isSpinner);
        $scope.requirment = $scope.requirmentData;
        $scope.requirment.items = $scope.requirmentItem;
        Restangular.restangularizeElement('', $scope.requirment, 'InventoryRequirment')
        $scope.requirment.put().then(function (resp) {
            $scope.isSpinner = false;
            $scope.$emit('isSipnner', $scope.isSpinner);
            iri.tableParams.reload();
            toaster.pop('success', $translate.instant('invantories.Saved'), $translate.instant('invantories.Savedserver'));
        }, function (response) {
            $scope.isSpinner = false;
            $scope.$emit('isSipnner', $scope.isSpinner);
            toaster.pop('warning', $translate.instant('invantories.NotSaved'), response.data.ExceptionMessage);
        });
    };
    var params = {
        InventoryRequirmentID: $stateParams.id,
    };
    $http.get(NG_SETTING.apiServiceBaseUri + "/api/InventorySupply/deliverydates", { params: params })
        .then(function (response) {
            $scope.deliverydates = response.data;
            // $scope.deliverydates.forEach(function(part, index, theArray) {
            //     theArray[index].lDATUField = new Date(theArray[index].lDATUField);
            //   });
            //$scope.cdate = (($scope.item.InventorySupplyState == 0) && ($scope.deliverydates.length > 0));
            // if ($scope.deliverydates.length > 0) {
            //     $scope.item.Date = $scope.deliverydates.filter(d => new Date(d.lDATUField) == new Date($scope.item.Date)).length>0?$scope.deliverydates.filter(d => new Date(d.lDATUField) == new Date($scope.item.Date)):null;
            //     //if (!$scope.item.Date || $scope.item.Date.length==0)
            //  $scope.item.Date = $scope.deliverydates[0].lDATUField;
            //$scope.item.Date = $scope.item.Date ?? $scope.deliverydates[0].lDATUField;                   
            //}
        }, function (response) {
            return $q.reject("Data Loading Error");
        });
    $http.get(NG_SETTING.apiServiceBaseUri + "/api/InventoryRequirmentItem/defaultitems", { params: params })
        .then(function (response) {
            $scope.item.items = response.data;
            var dataGrid = $('#gridContainer').dxDataGrid('instance');
            dataGrid.option("dataSource", $scope.item.items);
        }, function (response) {
            return $q.reject("Data Loading Error");
        });
    $scope.dataGridOptions = {
        dataSource: $scope.item.items,
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        //keyExpr: "id",
        hoverStateEnabled: true,
        allowColumnReordering: true,
        filterRow: { visible: true },
        headerFilter: { visible: true },
        searchPanel: { visible: true },
        groupPanel: { visible: true },
        noDataText: $translate.instant('InventoryRequirmentItem.Calculatingrequirments'),
        paging: {
            enabled: false
        },
        editing: {
            mode: "cell",
            allowUpdating: true
        },
        columns: [
            {
                caption: $translate.instant('InventoryRequirmentItem.Inventory'), name: "Inventory",
                columns: [
                    {
                        dataField: "InventoryUnitID", caption: $translate.instant('InventoryRequirmentItem.InventoryUnitID'), //fixed: true,width: 200,    
                        visibleIndex: 0,
                        lookup: {
                            valueExpr: "InventoryUnitID",
                            displayExpr: "ItemCode",
                            searchMode: "contains",
                            dataSource: {
                                store: DevExpress.data.AspNet.createStore({
                                    key: "InventoryUnitID",
                                    loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxInventoryUnits"
                                }),
                                sort: "InventoryUnitName",
                                headerFilter: { allowSearch: true }
                            },
                            calculateSortValue: function (data) {
                                var value = this.calculateCellValue(data);
                                return this.lookup.calculateCellValue(value);
                            },
                        },
                    },
                    { caption: $translate.instant('InventoryRequirmentItem.InventoryUnit'), dataField: "InventoryUnit", dataType: "string", allowEditing: false, visibleIndex: 1 },
                    { caption: "Group", dataField: "InventoryGroup", dataType: "string", allowEditing: false, visibleIndex: 2 },
                    { caption: $translate.instant('InventoryRequirmentItem.factor'), dataField: "factor", dataType: "number", allowEditing: false, visibleIndex: 3 },
                    { caption: $translate.instant('InventoryRequirmentItem.BaseUnit'), dataField: "BaseUnit", dataType: "string", allowEditing: false, visibleIndex: 4 },
                    { caption: $translate.instant('InventoryRequirmentItem.UnitPrice'), dataField: "UnitPrice", dataType: "number", format: { type: "fixedPoint", precision: 2 }, allowEditing: false, visibleIndex: 5 },
                ]
            },
            {
                caption: $translate.instant('InventoryRequirmentItem.Requirment'), name: "İhtiyaç", //İhtiyaç
                columns: [
                   // { caption: $translate.instant('InventoryRequirmentItem.UnitCount'), dataField: "UnitCount", dataType: "number", format: { type: "fixedPoint", precision: 0 }, allowEditing: false, visibleIndex: 6 },
                    {
                        caption: $translate.instant('InventoryRequirmentItem.UnitCustom'), dataField: "UnitCustom", dataType: "number", format: { type: "fixedPoint", precision: 0 }, allowEditing: true, visibleIndex: 7,
                        validationRules: [{
                            type: "range",
                            min: 0,
                            message: "Minimum value must be 0!"
                        }]
                    },
                    { name: "Total", caption: $translate.instant('InventoryRequirmentItem.Total'), calculateCellValue: function (data) { return data.UnitCustom * data.UnitPrice; }, visibleIndex: 8, format: { type: "fixedPoint", precision: 2 } },
                ]
            },
            { caption: $translate.instant('InventoryRequirmentItem.InventoryUnitID'), dataField: "InventoryUnitID", dataType: "number", allowEditing: false, visible: false, visible: false, visibleIndex: 9 },
            { caption: $translate.instant('InventoryRequirmentItem.SupplyDescription'), dataField: "SupplyDescription", dataType: "string", allowEditing: false, visibleIndex: 10 }, //Tedarik edilecek yer

        ],
        summary: {
            totalItems: [
                { column: "Total", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
                //{ name: "UnitCustom", showInColumn: "UnitCustom", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            ],
            groupItems: [
                //{ name: "UnitCustom", showInColumn: "UnitCustom", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "Total", showInColumn: "Total", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            ],
        },
        // onContentReady(e) {
        //     document.querySelector('.dx-datagrid-rowsview').before(document.querySelector('.dx-datagrid-total-footer'));
        //     }
        export: {
            enabled: true,
            fileName: "InventoryRequirment",
        }
    };
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("InventoryRequirmentsEditCtrl");
    });
};


app.directive('clickAndDisable', function () {
    return {
        scope: {
            clickAndDisable: '&'
        },
        link: function (scope, iElement, iAttrs) {
            iElement.bind('click', function () {
                iElement.prop('disabled', true);
                scope.clickAndDisable().finally(function () {
                    iElement.prop('disabled', false);
                })
            });
        }
    };
});
