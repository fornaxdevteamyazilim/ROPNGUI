app.directive('orderable', orderable);
function orderable($compile, $modal,$translate) {
    var directive = {
        restrict: 'E',
        template:            
            "<div class='row col-lg-12 col-md-12 col-sm-12 col-xs-12'>" +
            "<input type='text' placeholder='Promosyon Kodu' class='col-lg-3 col-md-3 col-sm-6 col-xs-6 pull-right' ng-model='item.PromotionCode' ng-if='item.CodeRequired==true'>" +
            "</div>" +
            "<div class='row col-lg-12 col-md-12 col-sm-12 col-xs-12 pull-right margin-bottom-5' ng-if='item.isOrderItem'> " +
            "<button class='col-lg-2 col-md-2 col-sm-4 col-xs-6 btn-red btn-sm tooltips radius-3 pull-right' style='height:33px' ng-hide='!item.canSave' ng-click='SaveToOrder(item)'ng-disabled='ButtonActive == false'><label class='fa fa-spin fa-spinner' ng-if='ButtonActive == false'></label><span> {{:: 'main.SAVE' | translate}} </span></button>" +
            "<span class='col-lg-2 col-md-2 col-sm-4 col-xs-6 pull-right'><input type='text' ng-model='item.Quantity' touchspin data-min='1' data-max='30' data-step='1'  data-stepinterval='50' data-maxboostedstep='10'/></span>" +
            "<label class='col-lg-2 col-md-2 col-sm-4 col-xs-6 pull-right margin-top-5 text-bold text-dark' style='color:black;'>{{:: 'main.TOTALAMOUNT' | translate}}: {{itemAmount| number : 2}} {{:: 'main.CURRENCY_SYMBOL' | translate}}</label>" +
            "<label class='col-lg-5 col-md-5 col-sm-4 col-xs-6 pull-left margin-top-5 text-bold text-dark' style='color:black;'>{{item.name}}</label>" +
            "</div>" +
            "<orderableoption class='fade-in' ng-if='option.OptionIndex>-2' bindonce ng-repeat='option in item.Options' option='option' order='OrderID'></orderableoption>" +
            "<div class='no-margin fade-in' id='details'>" +
            "<input type='text' placeholder='Ürün notu' class='col-lg-9 col-md-9 col-sm-9 col-xs-9' ng-model='item.Notes' ng-if='item.isOrderItem'>" +
            "<button ng-if='item.isOrderItem' class='col-lg-3 col-md-3 col-sm-4 col-xs-6 btn-red btn-md tooltips radius-3 pull-right' style='height:33px' ng-hide='!item.canSave' ng-click='SaveToOrder(item)'ng-disabled='ButtonActive == false'><label class='fa fa-spin fa-spinner' ng-if='ButtonActive == false'></label><span> {{:: 'main.SAVE' | translate}} </span></button>",

        controller: function ($scope, $element, $attrs, $transclude, $rootScope, $translate, $modal, Restangular, toaster) {
            $scope.itemPrice = 0;
            $scope.itemAmount = 0;
            $scope.OrderableID = $attrs.item;
            $scope.$on('$destroy', function () {
                $scope.DisableWatch();
                $element.remove();
            });
            $scope.LoadItem = function (Order, Item) {
                var oi = ($attrs.orderitem != undefined) ? $attrs.orderitem : '';
                Restangular.all('OrderableItem').getList({
                    pageNo: 1,
                    pageSize: 1000,
                    CalcParameters: [($scope.OrderID) ? "OrderID='" + $scope.OrderID + "'" : ""],
                    Search: ["ItemID='" + $attrs.item + "'", "OrderItemID='" + oi + "'"],
                }).then(function (result) {
                    if (result.length > 0) {
                        $scope.item = $scope.UpdateOrderableSelections(result[0]);
                        $scope.item.OrderID = $scope.OrderID;
                        $scope.item.CalcPrice = 0;
                        $scope.item.OrderItemID = oi;
                        if ($scope.item.Options)
                            for (var a = 0; a < $scope.item.Options.length; a++) {
                                if ($scope.item.Options[a].Items)
                                    for (var b = 0; b < $scope.item.Options[a].Items.length; b++) {
                                        $scope.item.Options[a].Items[b].OrderID = $scope.OrderID;
                                    }
                            }
                    }
                }, function (response) {
                    toaster.pop('Warning', $translate.instant('Server.ServerError'), "Warning!");
                });
            };
            $scope.LoadOptionItem = function (Option) {
                var oi = ($attrs.orderitem != undefined) ? $attrs.orderitem : '';
                if (Option.SelectedItems && Option.SelectedItems.OrderItemID)
                    oi = Option.SelectedItems.OrderItemID;
                Restangular.all('OrderableItem').getList({
                    pageNo: 1,
                    pageSize: 1000,
                    CalcParameters: [($scope.OrderID) ? "OrderID='" + $scope.OrderID + "'" : "", "OptionID='" + Option.id + "'", "ParentID='" + $scope.item.id + "'"],
                    Search: [(Option.SelectedItems && Option.SelectedItems.id) ? "ItemID='" + Option.SelectedItems.id + "'" : "ItemID=''", "OrderItemID='" + oi + "'", "OptionID='" + Option.id + "'"],
                }).then(function (result) {
                    if (result.length > 0) {
                        Option.SelectedItems = $scope.UpdateOrderableSelections(result[0]);
                        Option.SelectedItems.OrderID = $scope.OrderID;
                        Option.SelectedItems.CalcPrice = 0;
                        if (Option.SelectedItems.Options)
                            for (var a = 0; a < Option.SelectedItems.Options.length; a++) {
                                if (Option.SelectedItems.Options[a].Items)
                                    for (var b = 0; b < Option.SelectedItems.Options[a].Items.length; b++) {
                                        Option.SelectedItems.Options[a].Items[b].OrderID = $scope.OrderID;
                                    }
                            }
                    }
                }, function (response) {
                    toaster.pop('Warning', $translate.instant('Server.ServerError'), "Warning!");
                });
            };
            $scope.DisableWatch = $scope.$watch(watchItem, function () {
                if ($scope.item) {
                    $scope.item.CalcPrice = $scope.CalculatePrice($scope.item, true);
                    $scope.itemAmount = $scope.item.CalcPrice * $scope.item.Quantity;
                    $scope.item.canSave = $scope.canSaveItem($scope.item);
                }
            }, true);
            $scope.UpdateDetails = function (element, Option) {
                $scope.LoadOptionItem(Option);
            }
            $scope.FindRelatedOption = function (Option, Options) {
                for (var i = 0; i < Options.length; i++) {
                    if (Options[i].id == Option.RelatedOpiton)
                        return Options[i];
                }
            }
            $scope.CalcRelatedOptionPrice = function (option) {
                if (!option || !option.SelectedItems) return 0;
                return (option.SelectedItems.Price != null) ? option.SelectedItems.Price.Price : 0;
            }

            $scope.PriceModifierExists = function (modifiyer, inModifiyers) {
                if (inModifiyers && inModifiyers.length)
                    for (var i = 0; i < inModifiyers.length; i++) {
                        if (inModifiyers[i] === modifiyer) {
                            return true;
                        }
                    }
                return false;
            }
            $scope.CalculatePrice = function (item, includeItemPrice) {
                if (item) {
                    var price = (item.Price != null && includeItemPrice) ? item.Price.Price : 0;
                    if (item.Options != null)
                        for (var i = 0; i < item.Options.length; i++) {
                            if (!$scope.PriceModifierExists("None", item.Options[i].PriceModifiyers)) {
                                if (item.Options[i].OptionType == 3) {
                                    var GroupData = [];
                                    var foundgroup = false;
                                    for (var a = 0; a < item.Options[i].Items.length; a++) {
                                        foundgroup = false;
                                        for (var g = 0; g < GroupData.length; g++) {
                                            if (item.Options[i].Items[a].OptionGroup == GroupData[g].name) {
                                                GroupData[g].count += (item.Options[i].Items[a].Quantity > 0) ? item.Options[i].Items[a].Quantity : 0;
                                                GroupData[g].dcount += item.Options[i].Items[a].DefaultQuantity;
                                                GroupData[g].decreased += (item.Options[i].Items[a].DefaultQuantity > item.Options[i].Items[a].Quantity) ? (item.Options[i].Items[a].DefaultQuantity - item.Options[i].Items[a].Quantity) : 0;
                                                GroupData[g].increased += (item.Options[i].Items[a].DefaultQuantity < item.Options[i].Items[a].Quantity) ? (item.Options[i].Items[a].Quantity - item.Options[i].Items[a].DefaultQuantity) : 0;
                                                foundgroup = true;
                                                if (foundgroup) break;
                                            }
                                        }
                                        if (!foundgroup && item.Options[i].Items[a].OptionGroup != null) {
                                            GroupData.push(
                                                {
                                                    name: item.Options[i].Items[a].OptionGroup,
                                                    count: (item.Options[i].Items[a].Quantity > 0) ? item.Options[i].Items[a].Quantity : 0,
                                                    dcount: item.Options[i].Items[a].DefaultQuantity,
                                                    decreased: (item.Options[i].Items[a].DefaultQuantity > item.Options[i].Items[a].Quantity) ? (item.Options[i].Items[a].DefaultQuantity - item.Options[i].Items[a].Quantity) : 0,
                                                    increased: (item.Options[i].Items[a].DefaultQuantity < item.Options[i].Items[a].Quantity) ? (item.Options[i].Items[a].Quantity - item.Options[i].Items[a].DefaultQuantity) : 0,
                                                    freecount: item.Options[i].FreeCount
                                                });
                                        }
                                    }
                                    for (var a = 0; a < item.Options[i].Items.length; a++) {
                                        if (GroupData.length == 0) {
                                            price += ($scope.PriceModifierExists("Changed", item.Options[i].PriceModifiyers) && item.Options[i].Items[a].DefaultQuantity == item.Options[i].Items[a].Quantity) ? 0 :
                                                (item.Options[i].Items[a].Quantity > item.Options[i].Items[a].DefaultQuantity) ? ($scope.CalculatePrice(item.Options[i].Items[a], true)
                                                    * (item.Options[i].Items[a].Quantity - item.Options[i].Items[a].DefaultQuantity)) : 0;
                                        }
                                        else {


                                            if (item.Options[i].Items[a].Quantity > item.Options[i].Items[a].DefaultQuantity) {
                                                var cgroup = null;
                                                for (var g = 0; g < GroupData.length; g++) {
                                                    if (item.Options[i].Items[a].OptionGroup == GroupData[g].name)
                                                        cgroup = GroupData[g];
                                                }
                                                if ((cgroup != null)) {
                                                    var itemq =(item.Options[i].Items[a].Quantity - item.Options[i].Items[a].DefaultQuantity);
                                                    var freeItemsLimit = cgroup.name == "Default" ? (cgroup.freecount < 0 ? 0 : Math.abs(cgroup.freecount)) :
                                                        cgroup.decreased > Math.abs(cgroup.freecount) ?
                                                            Math.abs(cgroup.freecount) : cgroup.decreased;
                                                    if (freeItemsLimit < 0) freeItemsLimit = 0;
                                                    var PaidItemsQuantity = (freeItemsLimit >= itemq) ? 0 : itemq - freeItemsLimit;
                                                    if (PaidItemsQuantity < 0)
                                                        PaidItemsQuantity = 0;
                                                    price += $scope.CalculatePrice(item.Options[i].Items[a], true) * PaidItemsQuantity;
                                                    if (itemq >= cgroup.freecount && cgroup.decreased > 0)
                                                        cgroup.freecount = 0;
                                                    else {
                                                        cgroup.freecount = cgroup.freecount - (itemq - PaidItemsQuantity);
                                                        cgroup.decreased = cgroup.decreased - (itemq - PaidItemsQuantity);
                                                        if (cgroup.decreased < 0) cgroup.decreased = 0;
                                                    }
                                                    cgroup.count = cgroup.count - itemq;
                                                }
                                                else {
                                                    price += $scope.CalculatePrice(item.Options[i].Items[a], true) * (item.Options[i].Items[a].Quantity - item.Options[i].Items[a].DefaultQuantity);
                                                }
                                            }


                                        }
                                    }
                                }
                                else {
                                    for (var a = 0; a < item.Options[i].Items.length; a++) {
                                        //if (item.Options[i].Items[a].Price != null) {
                                            if (item.Options[i].SelectedItems) {
                                                if (item.Options[i].Items[a].id == item.Options[i].SelectedItems.id) {
                                                    var iPrice = (item.Options[i].Items[a].Price) ? item.Options[i].Items[a].Price.Price : 0;
                                                    if ($scope.PriceModifierExists("MostExpesive", item.Options[i].PriceModifiyers)) {
                                                        var relPrice = $scope.CalcRelatedOptionPrice($scope.FindRelatedOption(item.Options[i], item.Options));
                                                        var cPrice = (relPrice >= iPrice) ? relPrice : iPrice;
                                                        var cPrice = (relPrice = iPrice) ? (($scope.FindRelatedOption(item.Options[i], item.Options).OptionIndex > item.Options[i].OptionIndex) ? 0 : cPrice) : cPrice;
                                                        price += cPrice;
                                                        price += ($scope.PriceModifierExists("Changed", item.Options[i].PriceModifiyers) && item.Options[i].Items[a].DefaultQuantity == item.Options[i].Items[a].Quantity) ? 0 : $scope.CalculatePrice(item.Options[i].SelectedItems, false);
                                                    }
                                                    else {
                                                        price += iPrice;
                                                        price += ($scope.PriceModifierExists("Changed", item.Options[i].PriceModifiyers) && item.Options[i].Items[a].DefaultQuantity == item.Options[i].Items[a].Quantity) ? 0 : $scope.CalculatePrice(item.Options[i].SelectedItems, false);

                                                    }
                                                }
                                            }
                                            else {
                                                price += ($scope.PriceModifierExists("Changed", item.Options[i].PriceModifiyers) && item.Options[i].Items[a].DefaultQuantity == item.Options[i].Items[a].Quantity) ? 0 : (item.Options[i].Items[a].Quantity > 0) ? $scope.CalculatePrice(item.Options[i].Items[a], true) : 0;
                                            }

                                        //}


                                    }
                                }
                            }
                            else {
                                for (var a = 0; a < item.Options[i].Items.length; a++) {
                                    if (item.Options[i].Items[a].Price != null) {
                                        if (item.Options[i].SelectedItems) {
                                            if (item.Options[i].Items[a].id == item.Options[i].SelectedItems.id) {
                                                price += $scope.CalculatePrice(item.Options[i].SelectedItems, true);
                                            }
                                        }
                                    }
                                    else
                                        price += (item.Options[i].Items[a].Quantity > 0) ? $scope.CalculatePrice(item.Options[i].Items[a], !$scope.PriceModifierExists("None", item.Options[i].Items[a])) : 0;
                                }
                            }
                        }
                }
                return (price >= 0) ? price : 0;
            }
            function watchItem() {
                return $scope.item;
            }
            function without(obj, keys) {
                return Object.keys(obj).filter(function (key) {
                    return keys.indexOf(key) === -1;
                }).reduce(function (result, key) {
                    result[key] = obj[key];
                    return result;
                }, {});
            }
            $scope.LoadItem($scope.OrderID, $attrs.item);
            $scope.UpdateOrderableSelections = function (item) {
                if (item.Options) {
                    for (var i = 0; i < item.Options.length; i++) {
                        for (var a = 0; a < item.Options[i].Items.length; a++) {
                             //if (item.Options[i].OptionType == 1 || item.Options[i].OptionType == 3 || item.Options[i].OptionType == 4) {
                            if (item.Options[i].OptionType == 3) {
                                item.Options[i].Items[a].name = (item.Options[i].Items[a].Price) ? item.Options[i].Items[a].name + ' ' + item.Options[i].Items[a].Price.Price : item.Options[i].Items[a].name;
                            }
                            if (item.Options[i].OptionType == 1 && item.Options[i].Items[a].Quantity > 0) {
                                item.Options[i].SelectedItems = item.Options[i].Items[a];
                            }
                            if (item.Options[i].OptionType == 4 && item.Options[i].Items[a].Quantity > 0) {
                                item.Options[i].SelectedItems = item.Options[i].Items[a];
                            }
                            $scope.UpdateOrderableSelections(item.Options[i].Items[a]);
                        }
                    }
                }
                return item;
            }
            $scope.UpdateSelections = function (item) {
                if (item.Options) {
                    for (var i = 0; i < item.Options.length; i++) {
                        if (item.Options[i].OptionType == 1 || item.Options[i].OptionType == 4) {
                            for (var a = 0; a < item.Options[i].Items.length; a++) {
                                item.Options[i].Items[a].Quantity = 0;
                            }
                            if (item.Options[i].SelectedItems) {
                                for (var a = 0; a < item.Options[i].Items.length; a++) {
                                    if (item.Options[i].Items[a].id == item.Options[i].SelectedItems.id) {
                                        item.Options[i].Items[a].Options = item.Options[i].SelectedItems.Options;
                                        item.Options[i].Items[a].Quantity = 1;
                                    }
                                }
                            }
                        }
                        for (var a = 0; a < item.Options[i].Items.length; a++) {
                            $scope.UpdateSelections(item.Options[i].Items[a]);
                        }
                    }
                }
                return item;
            };
            $scope.ControlOptions = function (item) {
                if (item.OptionsCount && item.OptionsCount > 1) {
                    $scope.$emit('EditItem', { ObjectID: item.id, OrderID: item.OrderID });
                } else {
                    var data = $scope.UpdateSelections((item) ? item : $scope.item);
                    if (data.restangularized && data.OrderItemID != null && data.OrderItemID != '') {
                        data.put().then(
                            function (res) {
                                $scope.$emit('LoadOrderItems', $translate.instant('orderfile.Updated'));
                                toaster.pop('success',  $translate.instant('yemeksepetifile.UpdatedOrderItem '));                                
                            });
                    }
                    else {
                        data.OrderID = $scope.OrderID;
                        data.OrderPersonID = $scope.CurrentPersonID;
                        data.OrderSplitID = $scope.CurrentSplitID;
                        Restangular.restangularizeElement('', data, 'orderableitem');
                        data.post().then(
                            function (res) {
                                toaster.pop("success",  $translate.instant('yemeksepetifile.OrderItemAdded '));
                                $scope.$emit('LoadOrderItems', $translate.instant('orderfile.Updated'));
                            },
                            function (res) {
                                if (res.data.ExceptionMessage)
                                    toaster.pop("error", res.data.ExceptionMessage);
                                else
                                    toaster.pop("error",  $translate.instant('yemeksepetifile.UnableToAddOrderItem '));
                            });
                    }
                }
            };
            $scope.ButtonActive = true;
            $scope.isActiveButton = function (value) {
                $scope.ButtonActive = value;
            };
            $scope.SaveToOrder = function (item) {
                $scope.isActiveButton(false);
                var data = $scope.UpdateSelections((item) ? item : $scope.item);
                if (data.restangularized && data.OrderItemID != null && data.OrderItemID != '') {
                    data.put().then(
                        function (res) {
                            $scope.$emit('LoadOrderItems', $translate.instant('orderfile.Updated'));
                            toaster.pop('success',  $translate.instant('yemeksepetifile.UpdatedOrderItem '));
                            if (res.id) {
                                $scope.ok();
                            }
                        },
                        function (res) {
                            $scope.isActiveButton(true);
                            if (res.data.ExceptionMessage)
                                toaster.pop("error", res.data.ExceptionMessage);
                            else
                                toaster.pop("error", );
                        });
                }
                else {
                    data.OrderID = $scope.OrderID;
                    data.OrderPersonID = $scope.CurrentPersonID;
                    data.OrderSplitID = $scope.CurrentSplitID;
                    Restangular.restangularizeElement('', data, 'orderableitem');
                    data.post().then(
                        function (res) {
                            toaster.pop("success",  $translate.instant('yemeksepetifile.OrderItemAdded '));
                            $scope.$emit('LoadOrderItems', $translate.instant('orderfile.Updated'));
                            if (res.id) {
                                $scope.ok();
                            }
                        },
                        function (res) {
                            $scope.isActiveButton(true);
                            if (res.data.ExceptionMessage)
                                toaster.pop("error", res.data.ExceptionMessage);
                            else
                                toaster.pop("error",  $translate.instant('yemeksepetifile.UnableToAddOrderItem '));
                        });
                }
            };
            $scope.canSaveItem = function (item) {
                if (!item) return false;
                if (!item.Options || !item.Options.length)
                    return true;
                var selecteditems = 0;
                for (var a = 0; a < item.Options.length; a++) {
                    if (item.Options[a].OptionIndex < 0)
                        continue;
                    selecteditems = 0;
                    if (item.Options[a].SelectedItems) {
                        selecteditems += $scope.canSaveItem(item.Options[a].SelectedItems) ? 1 : 0;
                    }
                    else
                        for (var i = 0; i < item.Options[a].Items.length; i++) {
                            selecteditems += item.Options[a].Items[i].Quantity;
                        }
                    if (selecteditems > item.Options[a].MaxCount || selecteditems < item.Options[a].MinCount) {
                        return false;
                    }
                }
                return true;
            };
            $scope.CheckOptionsLimit = function (item, option) {
                var selecteditems = 0;
                for (var i = 0; i < option.Items.length; i++) {
                    selecteditems += option.Items[i].Quantity;
                }
                option.limit = selecteditems >= option.MaxCount;
            };
        }
    };
    return directive;
}
app.directive('checkImage', checkImage);
function checkImage($q) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            attrs.$observe('ngSrc', function (ngSrc) {
                var deferred = $q.defer();
                var image = new Image();
                image.onerror = function () {
                    deferred.resolve(false);
                    element.attr('src', 'assets/images/lc/products/pizza.png');
                };
                image.onload = function () {
                    deferred.resolve(true);
                };
                image.src = ngSrc;
                return deferred.promise;
            });
        }
    };
}
app.directive('contentClick', contentClick);
function contentClick() {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind("click", function (e) {
                $(element).parent().find('.hideContent').slideToggle(0);
                $(element).parent().find('.hidedContent').slideToggle(0);
                $(element).parent().find('.hideContentMaterial').slideToggle(0);
                $(element).toggleClass("active");
                $(element).find('.indicator').toggleClass("rotate");
            });
            $(element).prepend('<span class="indicator">+</span>');
        }
    };
}
app.directive('ngCheckbox', ngCheckbox);
function ngCheckbox($rootScope) {
    return {
        restrict: 'E',
        template: '<div ng-click="toggle()">{{editorValue.Quantity}} x {{:: editorValue.name}}</div>',
        replace: true,
        require: 'ngModel',
        link: function (scope, element, attrs, model) {
            model.$formatters.unshift(function (value) {
                scope.editorValue = value;
                return value;
            });
            scope.toggle = function () {
                if (scope.editorValue.Quantity >= parseInt(attrs['ngMaxcount']))
                    scope.editorValue.Quantity = parseInt(attrs['ngMincount']);
                else
                    scope.editorValue.Quantity++;

                model.$setViewValue(scope.editorValue);

            }
        }
    };
}
app.directive('ngRadio', ngRadio);
function ngRadio() {
    return {
        restrict: 'E',
        template: '<div ng-click="toggle()">{{item.Quantity}} x {{:: item.name}}</div>',
        replace: true,
        require: 'ngModel',
        link: function (scope, element, attrs, model) {

            model.$formatters.unshift(function (value) {
                scope.editorValue = value;
                return value;
            });

            scope.toggle = function () {
                if (scope.editorValue.Quantity > 1)
                    scope.editorValue.Quantity = 0;
                else
                    scope.editorValue.Quantity++;

                model.$setViewValue(scope.editorValue);
            }
        }
    };
}
app.directive('optionClick', optionClick);
function optionClick($compile, $log, $modal, $timeout) {
    var directive = {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind("click", function (e) {
                if (!scope.item.isOrderItem) {
                    var container = $(element).closest("orderableoption").next("#details");
                }
                else {
                    scope.$emit('EditItem', { ObjectID: scope.item.id, OrderID: scope.item.OrderID });
                    return;
                }
                var template = '<orderable item="' + scope.item.id + '" order="' + $(element).attr("order") + '" parent="' + scope.Parent + '" style="display: none;"></orderable>'
                var childNode = $compile(template)(scope);
                container.html(childNode);
                childNode.show('fast');
            });
        },
    };
    return directive;
}
app.directive('orderableoption', orderableoption);
function orderableoption() {
    var directive = {
        restrict: 'EA',
        template: function (tElement, tAttrs) {
            var result =
                "<div class='btn-group col-lg-12 col-md-12 col-sm-12 col-xs-12' >" +
                "<optionitem-smallbutton ng-if='option.OptionIndex==-1' bindonce ng-repeat='item in option.Items' item='item' ng-class=\"{'active':person.id==CurrentPersonID}\"></optionitem-smallbutton>" +
                "<optionitem-image ng-if='option.OptionIndex==0' bindonce='item' ng-repeat='item in option.Items' item='item'></optionitem-image>" +
                "<div ng-if='option.OptionIndex>0'>" +
                "<div class='col-lg-12 text-bold text-dark' style='color:black;' ng-if='option.OptionType==1'><optionitem-combo order='order'></optionitem-combo></div>" +   //ComboBox
                "<div class='col-lg-12' ng-if='option.OptionType==2'>" +  //CheckBox
                "<h4  class='hideContentHeader col-lg-12'>" +
                "<div class='visibleContent text-capitalize text-bold'>" +
                "{{:: option.name}}" + "<label class='pull-right text-bold' style='color:white;'><span class='pull-right'><input type='checkbox' class='check-lg' id='optionssettings' ng-model='option.Items[0].Quantity' ng-true-value='{{option.Items[0].Quantity}}' ng-false-value='0' />{{option.Items[0].Quantity}} X {{:: option.Items[0].name}}</span></label>" +
                "</div>" +
                "</h4>" +
                "</div>" +
                "<div ng-if='option.OptionType==3'>" +   //CheckBoxList
                "<h4 class='hideContentHeader col-xs-12 col-lg-12 col-md-12 col-sm-12 text-capitalize' content-click>" +
                "{{:: option.name}}" +
                "</h4>" +
                "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 hideContentMaterial' ng-if='user.UserRole.MemberID == 106851154380'>" +
                "<div class='col-lg-4 col-md-4 col-sm-12 col-xs-12'>" +
                "<label class='col-lg-12 col-md-12 col-sm-6 col-xs-6 text-bold text-dark text-large' style='white-space: nowrap; overflow:hidden; text-overflow:clip;' ng-if='item.DefaultQuantity>0' ng-class=\"{'text-bold':item.DefaultQuantity>0}\" bindonce='item'  ng-repeat='item in option.Items |orderBy:\"-DefaultQuantity\"'><ng-Checkbox ng-class=\"{'strike':item.Quantity<=0,'underline':item.Quantity>=2}\" ng-change='CheckOptionsLimit(item,option)' ng-disabled='option.limit && item.Quantity<1' class='check-lg ' ng-true-value='1' ng-false-value='0' ng-model='item' ng-maxcount='{{option.MaxItemCount}}' ng-mincount='{{option.MinItemCount}}'><span>&nbsp;{{:: item.name}}&nbsp;&nbsp;&nbsp;&nbsp;</span></label>" +
                "</div>" +
                "<div class='col-lg-8 col-md-8 col-sm-12 col-xs-12'>" +
                "<label class='col-lg-6 col-md-6 col-sm-6 col-xs-6 text-dark text-large' style='white-space: nowrap; overflow:hidden; text-overflow:clip;' ng-if='item.DefaultQuantity<1' ng-class=\"{'text-bold':item.DefaultQuantity>0}\" bindonce='item' ng-repeat='item in option.Items |orderBy:\"+name\"'><ng-Checkbox ng-class=\"{'text-bold':item.Quantity>=1,'underline':item.Quantity>=2}\" ng-change='CheckOptionsLimit(item,option)' ng-disabled='option.limit && item.Quantity<1' class='check-lg ' ng-true-value='1' ng-false-value='0' ng-model='item' ng-maxcount='{{option.MaxItemCount}}' ng-mincount='{{option.MinItemCount}}'>&nbsp;{{:: item.name}}&nbsp;&nbsp;&nbsp;&nbsp;</label>" +
                "</div>" +
                "</div>" +

                "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 hideContentMaterial' ng-if='user.UserRole.MemberID != 106851154380'>" +
                "<div class='col-lg-4 col-md-4 col-sm-12 col-xs-12'>" +
                "<label class='col-lg-12 col-md-12 col-sm-6 col-xs-6 text-bold text-dark text-large' style='white-space: nowrap; overflow:hidden; text-overflow:clip;' ng-if='item.DefaultQuantity>0' ng-class=\"{'text-bold':item.DefaultQuantity>0}\" bindonce='item'  ng-repeat='item in option.Items |orderBy:\"-DefaultQuantity\"'><ng-Checkbox ng-class=\"{'strike':item.Quantity<=0}\" ng-change='CheckOptionsLimit(item,option)' ng-disabled='option.limit && item.Quantity<1' class='check-lg ' ng-true-value='1' ng-false-value='0' ng-model='item' ng-maxcount='{{option.MaxItemCount}}' ng-mincount='{{option.MinItemCount}}'><span>&nbsp;{{:: item.name}}&nbsp;&nbsp;&nbsp;&nbsp;</span></label>" +
                "</div>" +
                "<div class='col-lg-8 col-md-8 col-sm-12 col-xs-12'>" +
                "<label class='col-lg-6 col-md-6 col-sm-6 col-xs-6 text-dark text-large' style='white-space: nowrap; overflow:hidden; text-overflow:clip;' ng-if='item.DefaultQuantity<1' ng-class=\"{'text-bold':item.DefaultQuantity>0}\" bindonce='item' ng-repeat='item in option.Items |orderBy:\"+name\"'><ng-Checkbox ng-class=\"{'text-bold':item.Quantity>=1}\" ng-change='CheckOptionsLimit(item,option)' ng-disabled='option.limit && item.Quantity<1' class='check-lg ' ng-true-value='1' ng-false-value='0' ng-model='item' ng-maxcount='{{option.MaxItemCount}}' ng-mincount='{{option.MinItemCount}}'>&nbsp;{{:: item.name}}&nbsp;&nbsp;&nbsp;&nbsp;</label>" +
                "</div>" +
                "</div>" +


                "</div>" +
                "<div class='col-lg-12 text-bold text-dark' style='color:black;' ng-if='option.OptionType==4'><optionitem-radio order='order'></optionitem-radio></div>" +   //Radio
                "</div>" +
                "</div>";
            return result;
        },
    };
    return directive;
}
app.directive('optionitemCombo', optionitemCombo);
function optionitemCombo($compile) {
    var directive = {
        restrict: 'EA',
        scope: true,
        template:
            //large & medium
            "<h4  class='hideContentHeader col-lg-9 col-md-9  visible-lg visible-md' content-click >" +
            "{{:: option.name}}" +
            "</h4>" +
            "<h4 class='col-lg-3 col-md-3 visible-lg visible-md'>" +
            "<select ng-disabled=\"true\" id='orderselect' style='min-height:40px;' ng-options=\" q.id as q.name for q in ::option.Items | orderBy:['+Price.Price','+name']\" class='form-control col-lg-4 col-md-4 pull-right' ng-change='UpdateDetails($event,option)' ng-init='UpdateDetails($event,option)' ng-model='option.SelectedItems.id'>" +
            "</select>" +
            "</h4>" +
            "<div class='hidedContent btn-group col-lg-12 col-md-12' data-toggle='buttons'>" +
            "<label class='btn btn-red col-lg-3 col-md-3' ng-repeat='item in option.Items' ng-class=\"{'btn-o':item.id!=option.SelectedItems.id}\">" +
            "<input type='radio' name='' ng-value='item.id' ng-model='option.SelectedItems.id' ng-click='UpdateDetails($event,option)' ng-init='UpdateDetails($event,option)'   >" +
            "<div class='col-lg-11 col-md-11'> <div class='col-lg-10 col-md-10' style='overflow-y: hidden;height: 20px;' >{{:: item.name}}</div><div ng-if='item.Price.Price>0' class='col-lg-2 col-md-2 style='text-align: left;'> {{:: item.Price.Price| number:2}}</div></div></label>" +
            "</div>" +
            "<div class='hidedContent col-lg-11 margin-left-30' id='contentdetail'>" +
            "<div id='optdetail'></div>" +
            "</div>",
        link: function (scope, element, attr) {
            var container = $(element).children("#contentdetail").children("#optdetail");
            var newElement = angular.element("<orderableoption class='col-lg-12 col-md-12 col-sm-12 col-xs-12' bindonce='option'  ng-repeat='option in option.SelectedItems.Options' option='option' order='OrderID'></orderableoptiondetail>");
            container.html(newElement);
            $compile(newElement)(scope);

            $("container").animate({ scrollTop: newElement.offset().top }, "fast")
        }
    };
    return directive;
}
app.directive('optionitemRadio', optionitemRadio);
function optionitemRadio($compile) {
    var directive = {
        restrict: 'EA',
        scope: true,
        template:
            "<div ng-if='option.OptionType==4'>" +   //RadioButton
            "<h4  class='hideContentHeader col-xs-12 col-lg-12 col-md-12 col-sm-12 text-capitalize' content-click>" +
            "{{:: option.name}}" +
            "</h4>" +
            "<div class='hideContent btn-group col-lg-12 col-md-12' data-toggle='buttons'>" +
            "<label class='btn btn-red col-lg-3 col-md-3' ng-repeat='item in option.Items' ng-class=\"{'btn-o':item.id!=option.SelectedItems.id}\">" +
            "<input type='radio' name='' ng-value='item.id' ng-model='option.SelectedItems.id' ng-click='UpdateDetails($event,option)' ng-init='UpdateDetails($event,option)'   >" +
            "<div class='col-lg-11 col-md-11'> <div class='col-lg-10 col-md-10' style='overflow-y: hidden;height: 20px;' >{{:: item.name}}</div><div ng-if='item.Price.Price>0' class='col-lg-2 col-md-2 style='text-align: left;'> {{:: item.Price.Price| number:2}}</div></div></label>" +
            "</div>" +
            "</div>" +
            "<div class='hideContent col-lg-12' id='contentdetail'>" +
            "<div id='optdetail'></div>" +
            "</div>",
        link: function (scope, element, attr) {
            var container = $(element).children("#contentdetail").children("#optdetail");
            var newElement = angular.element("<orderableoption class='col-lg-11 col-md-11 col-sm-11 col-xs-11 margin-left-30' bindonce='option'  ng-repeat='option in option.SelectedItems.Options' option='option' order='OrderID'></orderableoptiondetail>");
            container.html(newElement);
            $compile(newElement)(scope);

            $("container").animate({ scrollTop: newElement.offset().top }, "fast")
        }
    };
    return directive;
}
app.directive('optionitemImage', optionitemImage);
function optionitemImage() {
    var directive = {
        restrict: 'EA',
        require: '^orderableoption',
        template:
            "<div class='btn btn-wide btn-o  btn-warning col-lg-2 col-md-3 col-sm-8 col-xs-12 margin-top-5 margin-right-5' style='width:150px; height:90px;' ng-if='user.UserRole.MemberID == 106851154380'>" +
            "<div class='col-lg-12 col-md-12 col-sm-12' style='max-height:90px; min-height:90px;'>" +
            "<label id='txshdw' class='col-lg-12 col-md-12 col-sm-12 col-xs-12 text-capitalize text-bold' style='overflow:hidden; text-overflow:clip; color:black; min-height:50px; max-height:50px;' >{{:: item.name}} / {{item.Price.Price| number : 2}} {{:: 'main.CURRENCY_SYMBOL' | translate}}</label>" +
            "<button class='col-lg-6 col-md-6 col-sm-6 col-xs-6 btn-red ti-zoom-in radius-3' style='height:25px;' option-click ></button>" +
            "<button class='col-lg-6 col-md-6 col-sm-6 col-xs-6 btn-dark-yellow ti-plus radius-3' style='height:25px;' ng-click='ControlOptions(item)'></button>" +
            "</div>" +
            "</div>" +



            "<div class='btn btn-wide btn-o  btn-red col-lg-2 col-md-3 col-sm-8 col-xs-12 margin-top-5 margin-right-5' style='width:150px; height:120px;' ng-if='user.UserRole.MemberID != 106851154380'>" +
            "<div class='col-lg-12 col-md-12 col-sm-12' style='max-height:120px; min-height:120px;'>" +
            "<label id='txshdw' class='col-lg-12 col-md-12 col-sm-12 col-xs-12 text-capitalize text-bold' style='overflow:hidden; text-overflow:clip; color:black; min-height:70px; max-height:70px;' >{{:: item.name}} / {{item.Price.Price| number : 2}} {{:: 'main.CURRENCY_SYMBOL' | translate}}</label>" +
            "<button class='col-lg-6 col-md-6 col-sm-6 col-xs-6 btn-dark-red ti-zoom-in radius-3' style='height:25px;' option-click ></button>" +
            "<button class='col-lg-6 col-md-6 col-sm-6 col-xs-6 btn-light-red ti-plus radius-3' style='height:25px;' ng-click='ControlOptions(item)'></button>" +
            "</div>" +
            "</div>"

       
    };
    return directive;
}
app.directive('optionitemSmallbutton', optionitemSmallbutton);
function optionitemSmallbutton() {
    var directive = {
        restrict: 'EA',
        require: '^orderableoption',
        template:
            //visible-lg visible-md
            "<button type='button' class=' btn btn-wide btn-o btn-dark-red col-lg-2 col-md-6 col-sm-8 col-xs-8 margin-top-5 margin-right-5 visible-lg visible-md' ng-if='user.UserRole.MemberID != 106851154380 && item.ItemType==\"ProductPrototype\"'  style='width:150px; height:60px;' item='item' order='OrderID' option-click>" + //btn-squared
            "<div class='col-lg-12'>" +
            "<label class='col-lg-1 col-md-1 col-sm-1 col-xs-1 text-bold' ng-if='user.UserRole.MemberID != 106851154380 && item.ItemType==\"ProductPrototype\"' style='color:black;'>*</label>" +
            "<label id='txshdw' class='col-lg-11 col-md-11 col-sm-11 col-xs-11 text-capitalize text-bold' style='overflow:hidden; color:black;'>{{:: item.name}}</label>" +
            "</div>" +
            "</button>" +

            "<button type='text' class='col-lg-2 col-md-6 col-sm-8 col-xs-8 btn btn-wide btn-default margin-top-5 margin-right-5 visible-lg visible-md' ng-if='user.UserRole.MemberID != 106851154380 && item.ItemType==\"Product\"'  style='width:150px; height:80px;' item='item' order='OrderID' option-click>" +  //border:inset;
            "<div class='row center'>" +
            "<div class='view view-second center '>" +
            "</div>" +
            "</div>" +
            "<div class='col-lg-12'>" +
            "<label id='txshdw' class='col-lg-11 col-md-11 col-sm-11 col-xs-11 text-capitalize text-bold' style=' overflow:hidden; text-overflow:clip;  color:black;'>{{:: item.name}}</label>" +
            "</div>" +
            "</button>" +

            //visible-sm visible-xs
            "<button type='button' class='btn btn-wide btn-o btn-dark-red col-sm-4 col-xs-4 margin-top-5 margin-right-5 visible-sm visible-xs' ng-if='user.UserRole.MemberID != 106851154380 && item.ItemType==\"ProductPrototype\"'  style='width:150px; height:60px;' item='item' order='OrderID' option-click>" + //btn-squared
            "<div class='col-lg-12'>" +
            "<label class='col-lg-1 col-md-1 col-sm-1 col-xs-1 text-bold' ng-if='user.UserRole.MemberID != 106851154380 && item.ItemType==\"ProductPrototype\"' style='color:black;'>*</label>" +
            "<label id='txshdw' class='col-lg-11 col-md-11 col-sm-11 col-xs-11 text-capitalize text-bold' style='white-space: nowrap; overflow:hidden; text-overflow:clip;  color:black;'>{{:: item.name}}</label>" +
            "</div>" +
            "</button>" +

            "<button type='text' class='col-sm-4 col-xs-4 btn btn-wide btn-o btn-default margin-top-5 margin-right-5 visible-sm visible-xs' ng-if='user.UserRole.MemberID != 106851154380 && item.ItemType==\"Product\"' style='width:150px; height:80px;' item='item' order='OrderID' option-click>" +
            "<div class='col-lg-12'>" +
            "<label id='txshdw' class='col-lg-11 col-md-11 col-sm-11 col-xs-11 text-capitalize text-bold' style='white-space: nowrap; overflow:hidden; text-overflow:clip;  color:black;'>{{:: item.name}}</label>" +
            "</div>" +
            "</button>"

    };
    return directive;

}

app.directive('orderitemClick', orderitemClick);
function orderitemClick() {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind("click", function (e) {
                scope.$emit('EditItem', { ObjectID: scope.member.ProductID, OrderID: scope.member.OrderID, OrderItemID: scope.member.id });
            });
        }
    };
}
app.directive('orderItem', orderItem);
function orderItem($compile) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            member: '=',
            persons: '=',
            splits: '=',
        },
        template:
            "<div class='col-lg-12 col-sm-12 col-md-12 col-xs-12'>" +
            "<div class='col-lg-7 col-md-7 col-sm-7 col-xs-7 margin-top-5'>" +
            "<label class='text-bold text-large' ng-model='member.Quantity' orderitem-click  style='white-space:nowrap; overflow:hidden; text-overflow:clip;'><strong>{{member.Quantity}}</strong> X {{member.Product || member.ProductPrototype}} </label></br>" +
            "</div>" +
            "<div class='col-lg-3 col-md-3 col-sm-3 col-xs-3 margin-top-5'>" +
            "<label class='text-bold pull-right text-large text-red'>{{member.TotalAmount| number : 2}} {{:: 'main.CURRENCY_SYMBOL' | translate}}</label>" +
            "</div>" +
            "<div class='col-lg-1 col-md-1 col-sm-1 col-xs-1 margin-top-5 pull-right'>" +
            "<span class='text-extra-large text-dark ng ti-close' ng-click='DeleteAndEdit()'><span class='text-large text-bold'></span>" + "</button>" +
            "</div>" +
            "</div>",


        controller: function ($scope, $element, $attrs, $modal, $rootScope) {
            $scope.DeleteAndEdit = function () {
                $scope.Remove();
            };
            $scope.$on('$destroy', function () {
                $element.remove();
            });
            $scope.orderItemDiscount = function (item) {
                var modalInstance = $modal.open({
                    templateUrl: 'assets/views/order/orderItemDiscount.html',
                    controller: 'orderItemDiscountCtrl',
                    size: '',
                    backdrop: '',
                    resolve: {
                        Order: function () {
                            return item;
                        },
                    }
                });
                modalInstance.result.then(function (item) {
                    if (item == 'remove') {
                        $scope.$emit('RemoveItem', { id: $scope.member.id });
                    }
                    if (item == 'Treat') {
                        $scope.$emit('Treat', { id: $scope.member.id });
                    }
                })
            };
            $scope.Remove = function () {
                $scope.$emit('RemoveItem', { id: $scope.member.id });
            }
            $scope.$on('ChangePerson', function (event, data) {
                $scope.CurrentPerson = data;
            });
        },
        link: function (scope, element, attrs) {
            if (scope.member.Notes){
                var newElement2 = angular.element("<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 text-extra-small' ng-if='member.Notes'><span bindonce='mmber'>Not:{{member.Notes}}</span></div>");
                element.append(newElement2);
                $compile(newElement2)(scope);
            }
            if (angular.isArray(scope.member.items)) {
                var newElement = angular.element("<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'><span bindonce='mmber'  ng-repeat='mmber in member.items'><detailorder-item  member='mmber'></detailorder-item></span></div>");
                element.append(newElement);
                $compile(newElement)(scope);
            }
            
        }
    };
}
app.directive('detailorderItem', detailorderItem);
function detailorderItem($compile) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            member: '='
        },
        template:
            //large & medium & small
            "<div class='row col-lg-12 col-md-12 col-sm-12 col-xs-12'>" +
            "<label class='col-lg-9 col-md-9 col-sm-9 col-xs-9 text-capitalize' style='font-size:medium;'><span>{{member.Quantity}} X {{:: member.Product}} </span></label>" +
            "<label class='col-lg-3 col-md-3 col-sm-3 col-xs-3 text-large pull-right'><span class='pull-right'> {{member.Amount| number : 2}} <span ng-if='member.Amount >= 0'>{{:: 'main.CURRENCY_SYMBOL' | translate}}</span></span></label>" +
            "</div>",
        controller: function ($scope, $element, $attrs) {
            $scope.$on('$destroy', function () {
                $element.remove();
            });
            $scope.Remove = function () {
                $scope.$emit('RemoveItem', { id: $scope.member.id });
            }

        },
        link: function (scope, element, attrs) {
            if (angular.isArray(scope.member.items)) {
                var newElement = angular.element("<span bindonce='mmber'  ng-repeat='mmber in member.items'><detailorder-item  member='mmber'></detailorder-item></span>");
                element.append(newElement);
                $compile(newElement)(scope);
            }
        }
    };
}
app.directive("addsplitbutton", addsplitbutton);
function addsplitbutton(Restangular,$translate, toaster) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind("click", function () {
                var ordersplit = { OrderID: scope._order.id, SplitIndex: scope._order.splits.length + 1 };
                Restangular.restangularizeElement('', ordersplit, 'ordersplit');
                ordersplit.post().then(function (resp) {
                    toaster.pop("success", $translate.instant('orderfile.SplitAdded'));
                    scope._order.splits.push(resp);
                },
                    function (resp) {
                        toaster.pop('error', $translate.instant('orderfile.Couldnotcreatenewsplit'), "error");
                    });
            });
        }
    }
}
app.directive("addpersonbutton", addpersonbutton);
function addpersonbutton(Restangular,$translate, toaster) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind("click", function () {
                var orderperson = { OrderID: scope._order.id, PersonIndex: scope._order.persons.length + 1 };
                Restangular.restangularizeElement('', orderperson, 'orderperson');
                orderperson.post().then(function (resp) {
                    toaster.pop("success", $translate.instant('orderfile.PeopleAdded'));
                    scope._order.persons.push(resp);
                },
                    function (resp) {
                        toaster.pop('error', $translate.instant('orderfile.Couldnotcreatenewcontact'), "error");
                    });
            });
        }
    }
}
app.directive("personClick", personClick);
function personClick() {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind("click", function () {
                scope.$emit('ChangePerson', attr['orderitemid']);
            });
        }
    }
}
app.directive("splitClick", splitClick);
function splitClick() {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind("click", function () {
                scope.$emit('ChangeSplit', attr['orderitemid']);
            });
        }
    }
}
app.directive('orderItems', orderItems);
function orderItems($compile) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            member: '=',
        },
        template:
            "<div class='col-lg-12 col-sm-12 col-md-12 col-xs-12'>" +
            "<div class='row text-dark text-bold text-extra-large'>" +
            "<div id='div2' class='col-lg-7 col-md-7 col-sm-7 col-xs-7 margin-top-5'>" +
            "<label class='text-bold text-extra-large' ng-model='member.Quantity'><strong>{{member.Quantity}}</strong>  x </label>" +
            "&nbsp; <label class='text-bold text-extra-large text-capitalize ng'><strong> {{member.Product || member.ProductPrototype}} </strong></label>" +
            "</div>" +
            "<div id='div2' class='col-lg-3 col-md-3 col-sm-3 col-xs-3 margin-top-5'>" +
            "<label class='text-bold text-extra-large'>{{member.Amount| number : 2}} {{:: 'main.CURRENCY_SYMBOL' | translate}}</label>" +
            "</div>" +
            "<div id='div2' class='col-lg-1 col-md-1 col-sm-1 col-xs-1 margin-top-5'>" +
            "<label class='text-extra-small'>({{member.AddDate| date:'HH:mm:ss'}})</label>" +
            "</div>" +
            "</div>" +
            "</div>",
        controller: function ($scope, $element, $attrs, $modal) {
            $scope.$on('$destroy', function () {
                $element.remove();
            });
        },
        link: function (scope, element, attrs) {
            if (angular.isArray(scope.member.items)) {
                var newElement = angular.element("<div class='col-lg-10'><span ng-repeat='mmber in member.items'><detailorder-items  member='mmber'></detailorder-items></span></div>");
                element.append(newElement);
                $compile(newElement)(scope);
            }
        }
    };
};
app.directive('detailorderItems', detailorderItems)
function detailorderItems($compile) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            member: '='
        },
        template:
            "<div class='row col-lg-12 col-md-12 col-sm-12 col-xs-12'>" +
            "<label class='col-lg-7 col-md-7 col-sm-7 col-xs-7 text-capitalize' style='font-size:medium;'>" +
            "<span class='margin-left-5'>{{member.Quantity}} X {{member.Product}}</span></label>" +
            "<label class='pull-right text-extra-small'>({{member.AddDate| date:'HH:mm:ss'}})</label>" +
            "<label class='col-lg-3 col-md-3 col-sm-3 col-xs-3 text-large'>" +
            "<span>{{member.Amount | number : 2}} {{:: 'main.CURRENCY_SYMBOL' | translate}}</span>" +
            "</label>" +
            "</div>",
        controller: function ($scope, $element, $attrs) {
            $scope.$on('$destroy', function () {
                $element.remove();
            });
        },
        link: function (scope, element, attrs) {
            if (angular.isArray(scope.member.items)) {
                var newElement = angular.element("<span ng-repeat='mmber in member.items'><detailorder-items  member='mmber'></detailorder-items></span>");
                element.append(newElement);
                $compile(newElement)(scope);
            }
        }
    };
};
app.directive('kvsdetailorderItems', kvsdetailorderItems);
function kvsdetailorderItems() {
    return {
        restrict: "E",
        replace: true,
        scope: {
            collection: '=',
        },
        template:
            "<div class='col-lg-12'>" +
            "<div ng-repeat='member in collection'>" +
            "<kvsdetailorder-item  member='member'></kvsdetailorder-item>" +
            "</div>" +
            "</div>",
    };
};
app.directive('kvsdetailorderItem', kvsdetailorderItem);
function kvsdetailorderItem($compile) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            member: '='
        },
        template:
            "<label>" +
            "<span>{{member.Quantity}} X </span><span ng-class='{\"strike\":member.Quantity < 0 }'>{{member.Product||(member.Product.ProductPrototype+' ('+member.Product.Size+')')}}</span>" +
            "</label>",

        controller: function ($scope, $element, $attrs) {
            $scope.Remove = function () {
            }
            $scope.$on('$destroy', function () {
                $element.remove();
            });
        },
        link: function (scope, element, attrs) {
            if (angular.isArray(scope.member.items)) {
                element.append("<kvsdetailorder-items collection='member.items'></kvsdetailorder-items>");
                $compile(element.contents())(scope);
            }
        }
    };
};
app.directive('kvsorderItem', kvsorderItem);
function kvsorderItem($compile) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            member: '='
        },
        template:
            "<div class='form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 '>" +
            "<label class='text-bold text-dark'>" +
            "<i class='ti-shopping-cart-full'></i><kvsorderitem-click> {{member.Quantity}} X {{member.Product||(member.Product.ProductPrototype+'('+member.Product.Size+')')}}" +
            "</label>" +
            "</div>",

        controller: function ($scope, $element, $attrs) {
            $scope.Remove = function () {
                $scope.$emit('RemoveItem', { id: $scope.member.id });
            }
            $scope.$on('$destroy', function () {
                $element.remove();
            });
        },
        link: function (scope, element, attrs) {
            if (angular.isArray(scope.member.items)) {
                var newElement = angular.element("<kvsdetailorder-items collection='member.items'></kvsdetailorder-items>");
                element.append(newElement);
                $compile(newElement)(scope);
            }
        }
    };
};
app.directive('modalMovable', ['$document',
    function ($document) {
        return {
            restrict: 'AC',
            link: function (scope, iElement, iAttrs) {
                var startX = 0,
                    startY = 0,
                    x = 0,
                    y = 0;

                var dialogWrapper = iElement.parent();

                dialogWrapper.css({
                    position: 'relative'
                });

                dialogWrapper.on('mousedown', function (event) {
                    // Prevent default dragging of selected content
                    event.preventDefault();
                    startX = event.pageX - x;
                    startY = event.pageY - y;
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                });

                function mousemove(event) {
                    y = event.pageY - startY;
                    x = event.pageX - startX;
                    dialogWrapper.css({
                        top: y + 'px',
                        left: x + 'px'
                    });
                }

                function mouseup() {
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);
                }
            }
        };
    }
]);
