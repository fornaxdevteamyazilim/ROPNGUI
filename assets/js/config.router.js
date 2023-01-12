'use strict';

/**
 * Config for the router
 */
app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'JS_REQUIRES',
    function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, jsRequires) {
        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.factory = $provide.factory;
        app.service = $provide.service;
        app.constant = $provide.constant;
        app.value = $provide.value;

        // LAZY MODULES
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: jsRequires.modules
        });

        // APPLICATION ROUTES
        // -----------------------------------
        //$urlRouterProvider.otherwise("/login/signin");
        $urlRouterProvider.otherwise("/app/mainscreen");
        //returned
        // Set up the states
        $stateProvider.state('app', {
            url: "/app",
            templateUrl: "assets/views/app.html",
            resolve: loadSequence('modernizr', 'moment', 'angularMoment', 'uiSwitch', 'perfect-scrollbar-plugin', 'perfect_scrollbar', 'ngAside', 'sweet-alert', 'toaster', 'chartjs', 'tc.chartjs', 'oitozero.ngSweetAlert', 'chatCtrl', 'storephonesCtrl', 'currentcallreasonCtrl', 'uistatusdisplayCtrl', 'billboardCtrl'),
            abstract: true,
        }).state('app.dashboard', {
            url: "/dashboard",
            templateUrl: "assets/views/dashboard.html",
            resolve: loadSequence('jquery-sparkline', 'sparkline', 'dashboardCtrl'),
            title: 'Dashboard',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Dashboard'
            }
        }).state('app.mainscreen', {
            url: "/mainscreen",
            templateUrl: "assets/views/mainscreen/mainscreen.html",
            resolve: loadSequence('jquery-sparkline', 'sparkline', 'mainscreenCtrl', 'loginpasswordCtrl', 'checkoutcashCtrl', 'cashdrawerCtrl', 'ngTable', 'currentendCtrl', 'notpaidCtrl', 'treatCtrl', 'acentextensionCtrl', 'ngAudio', 'dashboardCtrl', 'authcodeCtrl', 'ysstoreeditCtrl'),
            title: 'mainscreen',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'mainscreen'
            }
        }).state('app.maindashboard', {
            url: "/maindashboard",
            templateUrl: "assets/views/mainscreen/maindashboard.html",
            resolve: loadSequence('jquery-sparkline', 'sparkline', 'maindashboardCtrl', 'ngTable', 'ngAudio'),
            title: 'maindashboard',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'maindashboard'
            }
        }).state('app.callcenterdashboard', {
            url: '/callcenterdashboard',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'Callcenter Dashboard',
            ncyBreadcrumb: {
                label: 'Callcenter Dashboard'
            }
        }).state('app.callcenterdashboard.activeorders', {
            url: '/activeorders',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.callcenterdashboard.activeorders.list', {
            url: '/list',
            templateUrl: "assets/views/callcenterdashboard/activeorders.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'activeordersCtrl', 'changestoredataCtrl', 'changeorderstoreCtrl', 'dateCtrl'),
            title: 'Active Orders',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Active Orders'
            }
        }).state('app.callcenterdashboard.activeorders.orderdetails', {
            url: '/orderdetails/:id',
            templateUrl: "assets/views/callcenterdashboard/orderdeteails.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'callcenterorderdetailsCtrl', 'dateCtrl', 'loginpasswordCtrl'),
            title: 'Order Details',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Order Details'
            }
        }).state('app.store', {
            url: '/store',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'Store',
            ncyBreadcrumb: {
                label: 'Store'
            }
        }).state('app.store.store', {
            url: '/store',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.store.store.list', {
            url: '/list',
            templateUrl: "assets/views/stores/storelist.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'storelistCtrl', 'TagModalCtrl', 'dateCtrl'),
            title: 'store',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'store'
            }
        }).state('app.store.store.storenotelist', {
            url: '/storenoteslist',
            templateUrl: "assets/views/stores/storenotelist.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'storenotelistCtrl', 'dateCtrl'),
            title: 'storenoteslist',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'storenoteslist'
            }
        }).state('app.store.store.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/stores/store.edit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'storeeditCtrl', 'TagModalCtrl', 'dateCtrl', 'StreetAddressSelectorCtrl', 'useremailCtrl', 'usertrainingCtrl'),
            title: 'Store Edit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Store Edit'
            }
        }).state('app.store.store.activestores', {
            url: '/activestores',
            templateUrl: "assets/views/stores/activestores.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'activestoresCtrl', 'dateCtrl'),
            title: 'Active Stores',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Active Stores'
            }
        }).state('app.store.store.storerouting', {
            url: '/storerouting',
            templateUrl: "assets/views/stores/storerouting.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'storeroutingCtrl', 'dateCtrl'),
            title: 'Store Routing',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Store Routing'
            }
        }).state('app.store.store.storesaletypes', {
            url: '/storesaletypes',
            templateUrl: "assets/views/stores/storesaletypes.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'storesaletypesCtrl', 'dateCtrl'),
            title: 'storesaletypes',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'storesaletypes'
            }
        }).state('app.store.store.storesalesforecast', {
            url: '/storesalesforecast',
            templateUrl: "assets/views/stores/storesalesforecast.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'storesalesforecastCtrl', 'dateCtrl'),
            title: 'storesalesforecast',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'storesalesforecast'
            }
        }).state('app.store.store.storeregion', {
            url: '/storeregion',
            templateUrl: "assets/views/stores/storeregion.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'storeregionCtrl'),
            title: 'storeregion',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'storeregion'
            }
        }).state('app.store.store.fingerprintenroll', {
            url: "/fingerprintenroll",
            templateUrl: "assets/views/stores/fingerprintenroll.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'fingerprintenrollCtrl'),
            title: 'Finger Print Enroll',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Fingerprintenroll'
            }
        }).state('app.promotion', {
            url: '/promotion',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'promotion',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'promotion'
            }
        }).state('app.promotion.promotions', {
            url: '/promotions',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.promotion.promotions.list', {
            url: '/list',
            templateUrl: "assets/views/promotions/promotions.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'promotionsCtrl', 'dateCtrl', 'TagModalCtrl'),
            title: 'promotions',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'promotions'
            }
        }).state('app.promotion.promotioncode', {
            url: '/promotioncode',
            templateUrl: "assets/views/promotions/promotioncode.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'promotioncodeCtrl', 'dateCtrl'),
            title: 'Promotion Code',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Promotion Code'
            }
        }).state('app.promotion.promotioncodesource', {
            url: '/promotioncodesource',
            templateUrl: "assets/views/promotions/promotioncodesource.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'promotioncodesourceCtrl', 'dateCtrl'),
            title: 'Promotion Code Source',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Promotion Code Source'
            }
        }).state('app.promotion.promotions.promotionscodevalidators', {
            url: '/promotionscodevalidators',
            templateUrl: "assets/views/promotions/promotionscodevalidators.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'promotionscodevalidatorsCtrl'),
            title: 'promotionscodevalidators',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'promotionscodevalidators'
            }
        }).state('app.promotion.giftpromotion', {
            url: '/giftpromotion',
            templateUrl: "assets/views/promotions/giftpromotion.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'giftpromotionCtrl', 'dateCtrl'),
            title: 'giftpromotion',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'giftpromotion'
            }
        }).state('app.promotion.giftpromotionCode', {
            url: '/giftpromotionCode',
            templateUrl: "assets/views/promotions/giftpromotionCode.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'giftpromotionCodeCtrl', 'dateCtrl'),
            title: 'giftpromotionCode',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'giftpromotionCode'
            }
        }).state('app.promotion.giftpromotionOrderSource', {
            url: '/giftpromotionOrderSource',
            templateUrl: "assets/views/promotions/giftpromotionOrderSource.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'giftpromotionOrderSourceCtrl', 'dateCtrl'),
            title: 'giftpromotionOrderSource',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'giftpromotionOrderSource'
            }
        }).state('app.promotion.promotionearningrule', {
            url: '/promotionearningrule',
            templateUrl: "assets/views/promotions/promotionearningrule.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'promotionearningruleCtrl', 'dateCtrl', 'TagModalCtrl'),
            title: 'promotionearningrule',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'promotionearningrule'
            }
        }).state('app.promotion.Automaticorderitemsetting', {
            url: '/Automaticorderitemsetting',
            templateUrl: "assets/views/promotions/Automaticorderitemsetting.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'AutomaticorderitemsettingCtrl', 'dateCtrl'),
            title: 'Automaticorderitemsetting',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Automaticorderitemsetting'
            }
        }).state('app.promotion.automaticOrderItemEarning', {
            url: '/automaticOrderItemEarning',
            templateUrl: "assets/views/promotions/automaticOrderItemEarning.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'automaticOrderItemEarningCtrl', 'dateCtrl'),
            title: 'automaticOrderItemEarning',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'automaticOrderItemEarning'
            }
        }).state('app.promotion.promotionsetting', {
            url: '/promotionsetting',
            templateUrl: "assets/views/promotions/promotionsetting.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'promotionsettingCtrl', 'dateCtrl'),
            title: 'promotionsetting',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'promotionsetting'
            }
        }).state('app.promotion.giftpromotionblacklist', {
            url: '/giftpromotionblacklist',
            templateUrl: "assets/views/promotions/giftpromotionblacklist.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'giftpromotionblacklistCtrl', 'dateCtrl'),
            title: 'giftpromotionblacklist',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'giftpromotionblacklist'
            }
        }).state('app.product', {
            url: '/product',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'Products',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Products'
            }
        }).state('app.product.product', {
            url: '/product',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.product.product.list', {
            url: '/list',
            templateUrl: "assets/views/product/productprototypelist.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'productprototypelistCtrl', 'TagModalCtrl'),
            title: 'product',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'product'
            }
        }).state('app.product.product.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/product/productprototypeedit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'productprototypeeditCtrl', 'TagModalCtrl', 'dateCtrl'),
            title: 'product Edit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'product Edit'
            }
        }).state('app.product.productdisable', {
            url: '/productdisable',
            templateUrl: "assets/views/product/productdisable.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'productdisableCtrl', 'dateCtrl'),
            title: 'Product Disable',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Product Disable'
            }
        }).state('app.product.productrecomendedpromotion', {
            url: '/productrecomendedpromotion',
            templateUrl: "assets/views/product/productrecomendedpromotion.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'productrecomendedpromotionCtrl'),
            title: 'Product Recomended Promotion',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Product Recomended Promotion'
            }
        }).state('app.product.product.productprice', {
            url: '/productprice',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.product.product.productprice.list', {
            url: '/list',
            templateUrl: "assets/views/product/productpricelist.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'productpricelistCtrl', 'dateCtrl'),
            title: 'Product Price List',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Product Price List'
            }
        }).state('app.product.product.productprice.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/product/productpriceedit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'productpriceeditCtrl', 'ngTable', 'ui.select', 'dateCtrl', 'selecttagCtrl', 'angularBootstrapNavTree'),
            title: 'Product Price Edit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Product Price Edit'
            }

        }).state('app.filter', {
            url: '/filter',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'filter',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'filter'
            }
        }).state('app.filter.filter', {
            url: '/filter',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.filter.filter.list', {
            url: '/list',
            templateUrl: "assets/views/filters/filterlist.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'filterlistCtrl', 'TagModalCtrl'),
            title: 'filter',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'filter'
            }
        }).state('app.filter.filter.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/filters/filter.edit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'filtereditCtrl', 'ngTable', 'ui.select'),
            title: 'Filteritem Edit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Filteritem Edit'
            }

        }).state('app.inventory', {
            url: '/inventory',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'Inventory',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Inventory'
            }
        }).state('app.inventory.inventoryadjust', {
            url: '/inventoryadjust',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.inventory.inventoryadjust.list', {
            url: '/list',
            templateUrl: "assets/views/inventories/inventoryadjustlist.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'inventoryadjustlistCtrl', 'dateCtrl'),
            title: 'inventoryadjust',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventoryadjust'
            }
        }).state('app.inventory.inventoryadjust.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/inventories/inventoryadjust.edit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'inventoryadjusteditCtrl', 'ngTable', 'ui.select', 'dateCtrl'),
            title: 'inventoryadjustitem Edit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventoryadjustitem Edit'
            }
        }).state('app.inventory.inventorycount', {
            url: '/inventorycount',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.inventory.inventorycount.list', {
            url: '/list',
            templateUrl: "assets/views/inventories/inventorycountlist.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'inventorycountlistCtrl', 'dateCtrl'),
            title: 'inventorycount',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventorycount'
            }
        }).state('app.inventory.inventorycount.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/inventories/inventorycount.edit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'inventorycounteditCtrl', 'ngTable', 'ui.select', 'dateCtrl', 'selecttagCtrl', 'angularBootstrapNavTree'),
            title: 'Inventorycountitem Edit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Inventorycountitem Edit'
            }
        }).state('app.inventory.inventorypurchase', {
            url: '/inventorypurchase',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.inventory.inventorypurchase.list', {
            url: '/list',
            templateUrl: "assets/views/inventories/inventorypurchaselist.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'inventorypurchaselistCtrl'),
            title: 'inventorypurchase',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventorypurchase'
            }
        }).state('app.inventory.inventorypurchase.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/inventories/inventorypurchase.edit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'inventorypurchaseeditCtrl', 'ngTable', 'ui.select', 'dateCtrl'),
            title: 'Inventorypurchaseitem Edit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Inventorypurchaseitem Edit'
            }
        }).state('app.inventory.inventorydeliveries', {
            url: '/inventorydeliveries',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.inventory.inventorydeliveries.list', {
            url: '/list',
            templateUrl: "assets/views/inventories/inventorydeliverylist.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'inventorydeliverylistCtrl', 'dateCtrl'),
            title: 'inventorydeliveries',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventorydeliveries'
            }
        }).state('app.inventory.inventorydeliveries.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/inventories/inventorydelivery.edit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'inventorydeliveryeditCtrl', 'dateCtrl'),
            title: 'Inventorydeliveryitems Edit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Inventorydeliveryitems Edit'
            }
        }).state('app.inventory.inventorytransfer', {
            url: '/inventorytransfer',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.inventory.inventorytransfer.list', {
            url: '/list',
            templateUrl: "assets/views/inventories/inventorytransferlist.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'inventorytransferlistCtrl', 'dateCtrl'),
            title: 'inventorytransfer',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventorytransfer'
            }
        }).state('app.inventory.inventorytransfer.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/inventories/inventorytransfer.edit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'inventorytransfereditCtrl', 'ngTable', 'ui.select', 'dateCtrl'),
            title: 'Inventorytransferitem Edit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Inventorytransferitem Edit'
            }
        }).state('app.inventory.inventories', {
            url: '/inventories',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.inventory.inventories.list', {
            url: '/list',
            templateUrl: "assets/views/inventories/inventory.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'inventoryCtrl', 'TagModalCtrl'),
            title: 'Inventories',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Inventories'
            }
        }).state('app.inventory.inventories.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/inventories/inventory.edit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'inventoryeditCtrl', 'dateCtrl', 'InventorysuppliyerCtrl', 'TagModalCtrl'),
            title: 'Inventoriesedit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Inventoriesedit'
            }
        }).state('app.inventory.inventoryprice', {
            url: '/inventoryprice',
            templateUrl: "assets/views/inventories/inventoryprice.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'inventorypriceCtrl', 'dateCtrl'),
            title: 'inventoryprice',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventoryprice'
            }
        }).state('app.inventory.inventoryunits', {
            url: '/inventoryunits',
            templateUrl: "assets/views/inventories/inventoryunit.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'TagModalCtrl', 'inventoryunitCtrl'),
            title: 'Inventoryunitunits',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Inventoryunits'
            }
        }).state('app.inventory.inventorysale', {
            url: '/inventorysale',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.inventory.inventorysale.list', {
            url: '/list',
            templateUrl: "assets/views/inventories/inventorysalelist.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'inventorysalelistCtrl', 'dateCtrl'),
            title: 'inventorysale',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventorysale'
            }
        }).state('app.inventory.inventorysale.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/inventories/inventorysale.edit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'inventorysaleeditCtrl', 'dateCtrl'),
            title: 'Inventorydsale Edit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventorysale Sale'
            }
        }).state('app.inventory.inventorytransform', {
            url: '/inventorytransform',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.inventory.inventorytransform.list', {
            url: '/list',
            templateUrl: "assets/views/inventories/inventorytransformlist.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'inventorytransformlistCtrl', 'dateCtrl'),
            title: 'inventorytransform',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventorytransform'
            }
        }).state('app.inventory.inventorytransform.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/inventories/inventorytransform.edit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'inventorytransformeditCtrl', 'ui.select', 'dateCtrl'),
            title: 'inventorytransform Edit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventorytransform Edit'
            }
        }).state('app.inventory.inventoryrecipe', {
            url: '/inventoryrecipe',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.inventory.inventoryrecipe.list', {
            url: '/list',
            templateUrl: "assets/views/inventories/inventoryrecipelist.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'inventoryrecipelistCtrl'),
            title: 'inventoryrecipe',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventoryrecipe'
            }
        }).state('app.inventory.inventoryrecipe.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/inventories/inventoryrecipe.edit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'inventoryrecipeeditCtrl', 'ui.select'),
            title: 'Inventoryrecipeitem Edit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Inventoryrecipeitem Edit'
            }
        }).state('app.inventory.productwaste', {
            url: '/productwaste',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.inventory.productwaste.list', {
            url: '/list',
            templateUrl: "assets/views/inventories/productwastelist.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'productwastelistCtrl', 'dateCtrl'),
            title: 'productwastelist',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'productwastelist'
            }
        }).state('app.inventory.productwaste.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/inventories/productwaste.edit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'productwasteeditCtrl', 'ngTable', 'ui.select', 'dateCtrl'),
            title: 'productwaste Edit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'productwaste Edit'
            }
        }).state('app.inventory.storepaymenttype', {
            url: '/storepaymenttype',
            templateUrl: "assets/views/stores/storepaymenttype.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'storepaymenttypeCtrl'),
            title: 'Storepaymenttype',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Storepaymenttype'
            }
        }).state('app.inventory.inventoryrequirments', {
            url: '/inventoryrequirments',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.inventory.inventoryrequirments.list', {
            url: '/list',
            templateUrl: "assets/views/inventories/InventoryRequirments.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'InventoryRequirmentsCtrl', 'dateCtrl', 'selectInventorySupplyCtrl', 'TagModalCtrl'),
            title: 'inventoryrequirments',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventoryrequirments'
            }
        }).state('app.inventory.inventoryrequirments.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/inventories/InventoryRequirmentItems.edit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'InventoryRequirmentsEditCtrl', 'ui.select', 'dateCtrl'),
            title: 'InventoryRequirmentItems',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'InventoryRequirmentItems'
            }
        }).state('app.inventory.inventorydemands', {
            url: '/inventorydemands',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.inventory.inventorydemands.list', {
            url: '/list',
            templateUrl: "assets/views/inventories/InventoryDemands.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'InventoryDemandsCtrl', 'dateCtrl'),
            title: 'inventorydemands',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventorydemands'
            }
        }).state('app.inventory.inventorydemands.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/inventories/InventoryDemandItems.edit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'InventoryDemandsEditCtrl', 'ui.select', 'dateCtrl'),
            title: 'InventoryDemandsItems',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'InventoryDemandsItems'
            }
        }).state('app.inventory.inventorydemandrule', {
            url: '/inventorydemandrule',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.inventory.inventorydemandrule.list', {
            url: '/list',
            templateUrl: "assets/views/inventories/inventorydemandrule.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'inventorydemandruleCtrl', 'dateCtrl'),
            title: 'inventorydemandrule',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventorydemandrule'
            }
        }).state('app.inventory.inventorydemandrule.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/inventories/inventorydemandruleitem.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'inventorydemandruleitemCtrl', 'ui.select', 'dateCtrl'),
            title: 'inventorydemandruleitem',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventorydemandruleitem'
            }
        }).state('app.inventory.inventorysupplies', {
            url: '/inventorysupplies',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.inventory.inventorysupplies.list', {
            url: '/list',
            templateUrl: "assets/views/inventories/InventorySupplies.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'InventorySuppliesCtrl', 'dateCtrl'),
            title: 'inventorysupplies',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventorysupplies'
            }
        }).state('app.inventory.inventorysupplies.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/inventories/InventorySupplies.edit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'InventorySuppliesEditCtrl', 'ui.select', 'dateCtrl', 'InventorySupplyApprovalsCtrl', 'InventorySupplyAuditsCtrl'),
            title: 'inventorysuppliesItems',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventorysuppliesItems'
            }
        }).state('app.inventory.inventorydeals', {
            url: '/inventorydeals',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.inventory.inventorydeals.list', {
            url: '/list',
            templateUrl: "assets/views/inventories/inventorydeals.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'inventorydealsCtrl', 'dateCtrl'),
            title: 'inventorydeals',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventorydeals'
            }
        }).state('app.inventory.inventorydeals.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/inventories/inventorydealitem.edit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'ui.select', 'dateCtrl', 'inventorydealitemCtrl'),
            title: 'inventorydealitem',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventorydealitem'
            }
        }).state('app.inventory.getdemandlist', {
            url: '/getdemandlist',
            templateUrl: "assets/views/inventories/getdemandlist.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'getdemandlistCtrl', 'dateCtrl'),
            title: 'getdemandlist',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'getdemandlist'
            }
        }).state('app.inventory.inventorydeliveryinvoice', {
            url: '/inventorydeliveryinvoice',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.inventory.inventorydeliveryinvoice.list', {
            url: '/list',
            templateUrl: "assets/views/inventories/inventorydeliveryinvoice.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'inventorydeliveryinvoiceCtrl', 'dateCtrl'),
            title: 'inventorydeliveryinvoice',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventorydeliveryinvoice'
            }
        }).state('app.inventory.inventorydeliveryinvoice.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/inventories/inventorydeliveryinvoice.edit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'inventorydeliveryinvoiceeditCtrl', 'ui.select', 'dateCtrl', 'inventorydeliveryinvoicerelationCtrl'),
            title: 'inventorydeliveryinvoiceedit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventorydeliveryinvoiceedit'
            }
        }).state('app.accountingintegration', {
            url: '/accountingintegration',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'accountingintegration',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'accountingintegration'
            }
        }).state('app.accountingintegration.inventorysale', {
            url: '/inventorysale',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.accountingintegration.inventorysale.list', {
            url: '/list',
            templateUrl: "assets/views/inventories/inventorysalelist.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'inventorysalelistCtrl', 'dateCtrl'),
            title: 'inventorysale',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventorysale'
            }
        }).state('app.accountingintegration.inventorysale.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/inventories/inventorysale.edit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'inventorysaleeditCtrl', 'dateCtrl'),
            title: 'Inventorydsale Edit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventorysale Sale'
            }
        }).state('app.accountingintegration.inventorydeliveries', {
            url: '/inventorydeliveries',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.accountingintegration.inventorydeliveries.list', {
            url: '/list',
            templateUrl: "assets/views/inventories/inventorydeliverylist.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'inventorydeliverylistCtrl', 'dateCtrl'),
            title: 'inventorydeliveries',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventorydeliveries'
            }
        }).state('app.accountingintegration.inventorydeliveries.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/inventories/inventorydelivery.edit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'inventorydeliveryeditCtrl', 'dateCtrl'),
            title: 'Inventorydeliveryitems Edit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Inventorydeliveryitems Edit'
            }
        }).state('app.accountingintegration.inventorydeliveryinvoice', {
            url: '/inventorydeliveryinvoice',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.accountingintegration.inventorydeliveryinvoice.list', {
            url: '/list',
            templateUrl: "assets/views/inventories/inventorydeliveryinvoice.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'inventorydeliveryinvoiceCtrl', 'dateCtrl'),
            title: 'inventorydeliveryinvoice',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventorydeliveryinvoice'
            }
        }).state('app.accountingintegration.inventorydeliveryinvoice.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/inventories/inventorydeliveryinvoice.edit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'inventorydeliveryinvoiceeditCtrl', 'ui.select', 'dateCtrl', 'inventorydeliveryinvoicerelationCtrl'),
            title: 'inventorydeliveryinvoiceedit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'inventorydeliveryinvoiceedit'
            }
        }).state('app.accountingintegration.incomeslip', {
            url: '/incomeslip',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.accountingintegration.incomeslip.list', {
            url: '/list',
            templateUrl: "assets/views/accountingintegration/incomeslip.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'incomeslipCtrl', 'dateCtrl'),
            title: 'incomeslip',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'incomeslip'
            }
        }).state('app.accountingintegration.incomeslip.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/accountingintegration/incomeslip.edit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'incomeslipeditCtrl', 'ui.select', 'dateCtrl'),
            title: 'incomeslipedit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'incomeslipedit'
            }
        }).state('app.accountingintegration.materialslip', {
            url: '/materialslip',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.accountingintegration.materialslip.list', {
            url: '/list',
            templateUrl: "assets/views/accountingintegration/materialslip.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'materialslipCtrl', 'dateCtrl'),
            title: 'materialslip',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'materialslip'
            }
        }).state('app.accountingintegration.materialslip.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/accountingintegration/materialslip.edit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'materialslipeditCtrl', 'ui.select', 'dateCtrl'),
            title: 'materialslipedit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'materialslipedit'
            }
        }).state('app.schedule', {
            url: '/schedule',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'Schedule',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Schedule'
            }
        }).state('app.schedule.schedule', {
            url: '/schedule',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.schedule.schedule.list', {
            url: '/list',
            templateUrl: "assets/views/schedule/schedulelist.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'schedulelistCtrl'),
            title: 'Schedule',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Schedule'
            }
        }).state('app.schedule.schedule.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/schedule/schedule.edit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'scheduleeditCtrl', 'ui.select'),
            title: 'Schedule Edit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Schedule Edit'
            }
        }).state('app.sale', {
            url: '/sale',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'Sales',
            ncyBreadcrumb: {
                label: 'Sales'
            }
        }).state('app.alive', {
            url: '/alive',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'Alive',
            ncyBreadcrumb: {
                label: 'Alive'
            }
        }).state('app.orders', {
            url: '/orders',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'orders',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'orders'
            }
        }).state('app.orders.order', {
            url: '/order/:id',
            templateUrl: "assets/views/order/order.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'touchspin-plugin', 'angular-bootstrap-touchspin', 'orderCtrl', 'orderproductitemsCtrl', 'orderpaymentCtrl', 'orderpromotionsCtrl', 'changeorderstateCtrl', 'orderinvoiceCtrl'),
            title: 'Order',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Order'
            }
        }).state('app.orders.orderStore', {
            url: '/orderStore/:id',
            templateUrl: "assets/views/order/orderPageStore.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'touchspin-plugin', 'angular-bootstrap-touchspin', 'orderCtrl', 'orderproductitemsCtrl', 'orderpaymentCtrl', 'orderpromotionsCtrl', 'changeorderstateCtrl', 'orderpersonaddresseditCtrl', 'previousorderCtrl', 'marketingpermissionCtrl', 'orderinvoiceCtrl'),
            title: 'OrderStore',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'OrderStore'
            }
        }).state('app.orders.orderStoreTable', {
            url: '/orderStoreTable/:id',
            templateUrl: "assets/views/order/orderPageStoreTable.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'touchspin-plugin', 'angular-bootstrap-touchspin', 'orderCtrl', 'orderproductitemsCtrl', 'orderpaymentCtrl', 'orderpromotionsCtrl', 'changeorderstateCtrl', 'splitaccountCtrl', 'orderinvoiceCtrl', 'gastropayCtrl'),
            title: 'OrderStoreTable',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'OrderStoreTable'
            }
        }).state('app.orders.takeaway', {
            url: '/takeaway',
            templateUrl: "assets/views/order/takeaway.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'touchspin-plugin', 'angular-bootstrap-touchspin', 'takeawayCtrl', 'orderpaymentCtrl', 'orderinvoiceCtrl', 'gastropayCtrl'),
            title: 'takeaway',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'takeaway'
            }
        }).state('app.orders.WebDineIn', {
            url: '/WebDineIn',
            templateUrl: "assets/views/order/WebDineIn.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'touchspin-plugin', 'angular-bootstrap-touchspin', 'WebDineInCtrl', 'orderpaymentCtrl', 'orderinvoiceCtrl', 'changeorderstateWebDineInCtrl'),
            title: 'WebDineIn',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'WebDineIn'
            }
        }).state('app.orders.drivethru', {
            url: '/drivethru',
            templateUrl: "assets/views/order/drivethru.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'touchspin-plugin', 'angular-bootstrap-touchspin', 'drivethruCtrl', 'orderpaymentCtrl', 'orderinvoiceCtrl'),
            title: 'drivethru',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'drivethru'
            }
        }).state('app.orders.stafforder', {
            url: '/stafforder',
            templateUrl: "assets/views/order/stafforder.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'touchspin-plugin', 'angular-bootstrap-touchspin', 'stafforderCtrl', 'orderpaymentCtrl', 'orderinvoiceCtrl'),
            title: 'stafforder',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'stafforder'
            }
        }).state('app.orders.pickup', {
            url: '/pickup',
            templateUrl: "assets/views/order/pickup.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'touchspin-plugin', 'angular-bootstrap-touchspin', 'pickupCtrl', 'orderpaymentCtrl', 'orderinvoiceCtrl'),
            title: 'pickup',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'pickup'
            }
        }).state('app.orders.mall', {
            url: '/mall',
            templateUrl: "assets/views/order/mall.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'touchspin-plugin', 'angular-bootstrap-touchspin', 'mallCtrl', 'orderpaymentCtrl', 'orderinvoiceCtrl'),
            title: 'mall',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'mall'
            }
        }).state('app.orders.orderlist', {
            url: '/orderlist',
            templateUrl: "assets/views/order/orderlist.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'orderlistCtrl', 'dateCtrl'),
            title: 'Orderlist',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Orderlist'
            }
        }).state('app.orders.orderlisttwo', {
            url: '/orderlisttwo',
            templateUrl: "assets/views/order/orderlisttwo.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'orderlisttwoCtrl', 'dateCtrl'),
            title: 'orderlisttwo',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'orderlisttwo'
            }
        }).state('app.orders.tablePlan', {
            url: '/tablePlan',
            templateUrl: "assets/views/tableplan/tablePlan.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'tablePlanCtrl', 'orderpaymentCtrl', 'ui.select', 'splitaccountCtrl'),
            title: 'Table Plan',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Table Plan'
            }
        }).state('app.orders.tablePlantwo', {
            url: '/tablePlantwo',
            templateUrl: "assets/views/order/tablePlantwo.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'tablePlantwoCtrl', 'orderpaymentCtrl', 'ui.select', 'splitaccountCtrl'),
            title: 'Table Plan Two',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Table Plan Two'
            }
        }).state('app.orders.orderDetail', {
            url: '/orderDetail/:id',
            templateUrl: "assets/views/order/orderDetail.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'updatecodeCtrl', 'ngTable', 'orderdetailsCtrl', 'personaddresseslistCtrl', 'changeorderstate2Ctrl', 'changeorderstateCtrl', 'tablePlanCtrl', 'mapsCtrl', 'ui.select', 'orderpromotionsCtrl', 'orderpaymentCtrl', 'changeorderdriverCtrl', 'orderpaymenttypesCtrl', 'deleteorderpromotionCtrl', 'loginpasswordCtrl'),
            title: 'Order Detail',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Order Detail'
            }
        }).state('app.orders.yemeksepetiorderlist', {
            url: '/yemeksepetiorderlist',
            templateUrl: "assets/views/order/yemeksepetiorderlist.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'updatecodeCtrl', 'ngTable', 'yemeksepetiorderlistCtrl', 'dateCtrl'),
            title: 'YS Order List',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'YS Order List'
            }

        }).state('app.orders.person', {
            url: '/person',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.orders.person.list', {
            url: '/list',
            templateUrl: "assets/views/person/personlist.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'selectdepartmentCtrl', 'selectstoreCtrl', 'personlistCtrl', 'personaddresseslistCtrl', 'acentextensionCtrl'),
            title: 'Person',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Person'
            }
        }).state('app.orders.personorder', {
            url: '/personorder',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.orders.personorder.list', {
            url: '/list',
            templateUrl: "assets/views/person/personlist.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'selectdepartmentCtrl', 'selectstoreCtrl', 'personlistCtrl', 'personaddresseslistCtrl', 'acentextensionCtrl', 'personorderitemsCtrl'),
            title: 'Person',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Person'
            }
        }).state('app.orders.personpage', {
            url: '/personpage',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.orders.personpage.list', {
            url: '/list',
            templateUrl: "assets/views/person/person2.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'selectdepartmentCtrl', 'selectstoreCtrl', 'personlistCtrl', 'personaddresseslistCtrl', 'acentextensionCtrl', 'newpersonCtrl', 'StreetAddressSelectorCtrl', 'surveypopupCtrl', 'SearchAddressSelectorCtrl'),
            title: 'Person Page',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Person Page'
            }
        }).state('app.orders.person.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/person/person.edit.html",
            resolve: loadSequence('selectdepartmentCtrl', 'xeditable', 'config-xeditable', 'ngTable', 'personaddresseslistCtrl', 'personeditCtrl', 'dateCtrl', 'ui.select'),
            title: 'Personitem Edit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Personitem Edit'
            }
        }).state('app.orders.getirperson.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/person/getirpersonedit.html",
            resolve: loadSequence('selectdepartmentCtrl', 'xeditable', 'config-xeditable', 'ngTable', 'personaddresseslistCtrl', 'personeditCtrl', 'dateCtrl', 'ui.select'),
            title: 'GetirPersonitem Edit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'GetirPersonitem Edit'
            }
        }).state('app.orders.person.personaddressedit', {
            url: '/personaddressedit/:id',
            templateUrl: "assets/views/person/personaddressedit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'personaddresseditCtrl', 'ui.select', 'StreetAddressSelectorCtrl'),
            title: 'PersonAddress Item',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'PersonAddress Item'
            }
        }).state('app.orders.person.getirpersonaddressedit', {
            url: '/getirpersonaddressedit/:id',
            templateUrl: "assets/views/person/getirpersonaddressedit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'personaddresseditCtrl', 'ui.select', 'StreetAddressSelectorCtrl'),
            title: 'Getir PersonAddress Item',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Getir PersonAddress Item'
            }
        }).state('app.orders.person.migrospersonaddressedit', {
            url: '/migrospersonaddressedit/:id',
            templateUrl: "assets/views/person/migrospersonaddressedit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'personaddresseditCtrl', 'ui.select', 'StreetAddressSelectorCtrl'),
            title: 'Migros PersonAddress Item',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Migros PersonAddress Item'
            }
        }).state('app.orders.getirpersonpage', {
            url: '/getirpersonpage',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.orders.getirpersonpage.list', {
            url: '/list',
            templateUrl: "assets/views/person/getirperson2.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'selectdepartmentCtrl', 'selectstoreCtrl', 'personlistCtrl', 'personaddresseslistCtrl', 'acentextensionCtrl', 'newpersonCtrl', 'StreetAddressSelectorCtrl', 'surveypopupCtrl', 'SearchAddressSelectorCtrl', 'newpersonGetirCtrl'),
            title: 'Person Page',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Person Page'
            }
        }).state('app.orders.getirpersonpage.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/person/getirperson.edit.html",
            resolve: loadSequence('selectdepartmentCtrl', 'xeditable', 'config-xeditable', 'ngTable', 'personaddresseslistCtrl', 'personeditCtrl', 'dateCtrl', 'ui.select'),
            title: 'Personitem Edit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Personitem Edit'
            }
        }).state('app.orders.getirpersonpage.personaddressedit', {
            url: '/personaddressedit/:id',
            templateUrl: "assets/views/person/personaddressedit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'personaddresseditCtrl', 'ui.select', 'StreetAddressSelectorCtrl'),
            title: 'PersonAddress Item',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'PersonAddress Item'
            }
        }).state('app.orders.migrosperson', {
            url: '/migrosperson',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.orders.migrosperson.list', {
            url: '/list',
            templateUrl: "assets/views/person/migrosperson.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'selectdepartmentCtrl', 'selectstoreCtrl', 'personlistCtrl', 'personaddresseslistCtrl', 'acentextensionCtrl', 'newpersonCtrl', 'StreetAddressSelectorCtrl', 'surveypopupCtrl', 'SearchAddressSelectorCtrl', 'newpersonMigrosCtrl'),
            title: 'Person Page',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Migros Person Page'
            }
        }).state('app.orders.migrosperson.edit', {
            url: '/edit/:id',
            templateUrl: "assets/views/person/migrosperson.edit.html",
            resolve: loadSequence('selectdepartmentCtrl', 'xeditable', 'config-xeditable', 'ngTable', 'personaddresseslistCtrl', 'personeditCtrl', 'dateCtrl', 'ui.select'),
            title: 'Personitem Edit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Migros Personitem Edit'
            }
        }).state('app.orders.migrosperson.personaddressedit', {
            url: '/migrospersonaddressedit/:id',
            templateUrl: "assets/views/person/migrospersonaddressedit.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'personaddresseditCtrl', 'ui.select', 'StreetAddressSelectorCtrl'),
            title: 'PersonAddress Item',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Migros PersonAddress Item'
            }
            
        }).state('app.users', {
            url: '/users',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'Users',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Users'
            }
        }).state('app.users.drivers', {
            url: '/drivers',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('app.users.drivers.list', {
            url: '/list',
            templateUrl: "assets/views/users/drivers.list.html",
            resolve: loadSequence('underscore', 'driverslistCtrl', 'xeditable', 'config-xeditable', 'ngTable'),
            title: 'Drivers',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'drivers'
            }
        }).state('app.users.userlist', {
            url: '/userlist',
            templateUrl: "assets/views/users/userlist.html",
            resolve: loadSequence('underscore', 'usermainCtrl', 'userlistCtrl', 'xeditable', 'config-xeditable', 'ngTable'),
            title: 'userlist',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'users'
            }
        }).state('app.users.useredit', {
            url: '/useredit/:id',
            templateUrl: "assets/views/users/useredit.html",
            resolve: loadSequence('underscore', 'usermainCtrl', 'useraccountCtrl', 'xeditable', 'config-xeditable', 'ngTable', 'userextensionCtrl', 'useremailCtrl', 'usertrainingCtrl', 'dateCtrl'),
            title: 'User Edit',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'User Edit'
            }
        }).state('app.users.drivers.orderlist', {
            url: '/orderlist/:id',
            templateUrl: "assets/views/users/drivers.orderlist.html",
            resolve: loadSequence('underscore', 'xeditable', 'driversorderlistCtrl', 'config-xeditable', 'ngTable'),
            title: 'drivers',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'drivers'
            }
        }).state('app.users.changepassword', {
            url: '/changepassword',
            templateUrl: "assets/views/users/changepassword.html",
            resolve: loadSequence('underscore', 'xeditable', 'changepasswordCtrl', 'config-xeditable', 'ngTable'),
            title: 'Change Password',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Change Password'
            }
        }).state('app.users.userstore', {
            url: '/userstore',
            templateUrl: "assets/views/users/userrelationshipstore/userstore.html",
            resolve: loadSequence('xeditable', 'underscore', 'xeditable', 'config-xeditable', 'ngTable', 'userstoreCtrl'),
            title: 'userstore',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'userstore'
            }
        }).state('app.users.storegroup', {
            url: '/storegroup',
            templateUrl: "assets/views/users/userrelationshipstore/storegroup.html",
            resolve: loadSequence('xeditable', 'underscore', 'xeditable', 'config-xeditable', 'ngTable', 'storegroupCtrl', 'storegroupitemCtrl'),
            title: 'storegroup',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'storegroup'
            }
        }).state('app.users.userstoregroup', {
            url: '/userstoregroup',
            templateUrl: "assets/views/users/userrelationshipstore/userstoregroup.html",
            resolve: loadSequence('xeditable', 'underscore', 'xeditable', 'config-xeditable', 'ngTable', 'userstoregroupCtrl'),
            title: 'userstoregroup',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'userstoregroup'
            }
        }).state('app.users.userautomaticreport', {
            url: '/userautomaticreport',
            templateUrl: "assets/views/users/userautomaticreport.html",
            resolve: loadSequence('underscore', 'usermainCtrl', 'userautomaticreportCtrl', 'xeditable', 'config-xeditable', 'ngTable'),
            title: 'userautomaticreport',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'userautomaticreport'
            }
        }).state('app.users.operationmanager', {
            url: '/operationmanager',
            templateUrl: "assets/views/users/operationmanager.html",
            resolve: loadSequence('underscore', 'usermainCtrl', 'operationmanagerCtrl', 'xeditable', 'config-xeditable', 'ngTable'),
            title: 'operationmanager',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'operationmanager'
            }
        }).state('app.reports', {
            url: '/reports',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'Report',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'Report'
            }
        }).state('app.reports.reportspage', {
            url: '/reportspage',
            templateUrl: "assets/views/reports/reportspage.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'jquery-nestable-plugin', 'ng-nestable', 'ui.select', 'reportspageCtrl'),
            title: 'reports',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'reports'
            }
        }).state('app.reports.smsreports', {
            url: '/smsreports',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'smsreports',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'smsreports'
            }
        }).state('app.reports.smsreports.smslist', {
            url: '/smslist',
            templateUrl: "assets/views/reports/sms/smslist.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'smslistCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'selecttagCtrl', 'ui.select', 'dateCtrl', 'angularBootstrapNavTree', 'selectanyCtrl'),
            title: 'Sms Listesi',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'smslist'
            }
        }).state('app.reports.smsreports.generalsmslist', {
            url: '/generalsmslist',
            templateUrl: "assets/views/reports/sms/generalsmslist.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'generalsmslistCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'selecttagCtrl', 'ui.select', 'dateCtrl', 'angularBootstrapNavTree', 'selectanyCtrl'),
            title: 'Genel Sms Listesi',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'generalsmslist'
            }
        }).state('app.reports.fsr', {
            url: '/fsr',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'fsr',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'fsr'
            }
        }).state('app.reports.fsr.transactions', {
            url: '/fsrtransactions',
            templateUrl: "assets/views/reports/fsr/transactionsreport.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'transactionsCtrl', 'dateCtrl'),
            title: 'FSR Segmentations & Transactions',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'transactions'
            }
        }).state('app.reports.fsr.sosreport', {
            url: '/sosreport',
            templateUrl: "assets/views/reports/sos/sosreport.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'sosreportCtrl', 'dateCtrl'),
            title: 'Speed Of Service Report',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'sos'
            }
        }).state('app.reports.fsr.fsrspeedofservice', {
            url: '/fsrspeedofservice',
            templateUrl: "assets/views/reports/fsr/fsrspeedofservice.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'fsrspeedofserviceCtrl', 'dateCtrl'),
            title: 'FSR Speed Of Service',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'fsrspeedofservice'
            }
        }).state('app.reports.fsr.fsractualtheoretical', {
            url: '/fsractualtheoretical',
            templateUrl: "assets/views/reports/fsr/fsractualtheoretical.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'fsractualtheoreticalCtrl', 'dateCtrl'),
            title: 'FSR Actual Theoretical',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'fsractualtheoretical'
            }
        }).state('app.reports.fsr.fsrcomparisonbudget', {
            url: '/fsrcomparisonbudget',
            templateUrl: "assets/views/reports/fsr/fsrcomparisonbudget.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'fsrcomparisonbudgetCtrl', 'dateCtrl'),
            title: 'FSR Comparison Budget',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'fsrcomparisonbudget'
            }
        }).state('app.reports.storereports', {
            url: '/storereports',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'storereports',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'storereports'
            }
        }).state('app.reports.storereports.storelogs', {
            url: '/storelogs',
            templateUrl: "assets/views/reports/storereports/storelogs.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'storelogsCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'selecttagCtrl', 'ui.select', 'dateCtrl', 'angularBootstrapNavTree', 'selectanyCtrl'),
            title: 'Restoran Loglari Raporu',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'storelogs'
            }
        }).state('app.reports.storereports.storeperformances', {
            url: '/storeperformances',
            templateUrl: "assets/views/reports/storereports/storeperformance.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'storeperformancereportCtrl', 'dateCtrl'),
            title: 'Restoran Analizi Raporu',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'storeperformances'
            }
        }).state('app.reports.storereports.storeanalisys', {
            url: '/storeanalisys',
            templateUrl: "assets/views/reports/storereports/storeanalisys.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'storeanalisysCtrl', 'dateCtrl'),
            title: 'Restoran Analizi Detay Raporu',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'storeanalisys'
            }
        }).state('app.reports.staffshiftreports', {
            url: '/staffshiftreports',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'staffshiftreports',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'staffshiftreports'
            }
        }).state('app.reports.staffshiftreports.staffshiftdiff', {
            url: '/staffshiftdiff',
            templateUrl: "assets/views/reports/staffshiftreports/staffshiftdiff.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'staffshiftdiffCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'selecttagCtrl', 'ui.select', 'dateCtrl', 'angularBootstrapNavTree', 'selectanyCtrl'),
            title: 'staff shift diff',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'staffshiftdiff'
            }
        }).state('app.reports.staffshiftreports.weeklycol', {
            url: '/weeklycol',
            templateUrl: "assets/views/reports/staffshiftreports/weeklycol.html",
            resolve: loadSequence('weeklycolCtrl'),
            title: 'weekly col',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'weeklycol'
            }
        }).state('app.reports.staffshiftreports.weeklycolsummary', {
            url: '/weeklycolsummary',
            templateUrl: "assets/views/reports/staffshiftreports/weeklycolsummary.html",
            resolve: loadSequence('weeklycolsummaryCtrl'),
            title: 'weekly col summary',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'weeklycolsummary'
            }
        }).state('app.reports.staffshiftreports.staffcost', {
            url: '/staffcost',
            templateUrl: "assets/views/reports/staffshiftreports/staffcost.html",
            resolve: loadSequence('staffcostCtrl'),
            title: 'Staff Cost',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'staffcost'
            }
        }).state('app.reports.staffshiftreports.staffcostdetail', {
            url: '/staffcostdetail',
            templateUrl: "assets/views/reports/staffshiftreports/staffcostdetail.html",
            resolve: loadSequence('staffcostdetailCtrl'),
            title: 'Staff Cost Detail',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'staffcostdetail'
            }
        }).state('app.reports.staffshiftreports.diffbyhour', {
            url: '/diffbyhour',
            templateUrl: "assets/views/reports/staffshiftreports/diffbyhour.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'diffbyhourCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'selecttagCtrl', 'ui.select', 'dateCtrl', 'angularBootstrapNavTree', 'selectanyCtrl'),
            title: ' diffby hour',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'diffbyhour'
            }
        }).state('app.reports.staffshiftreports.diffbyhourreq', {
            url: '/diffbyhourreq',
            templateUrl: "assets/views/reports/staffshiftreports/diffbyhour_req.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'diffbyhourCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'selecttagCtrl', 'ui.select', 'dateCtrl', 'angularBootstrapNavTree', 'selectanyCtrl'),
            title: 'diffby hour req',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'diffbyhourreq'
            }

        }).state('app.reports.staffshiftreports.shiftpersontotals', {
            url: '/shiftpersontotals',
            templateUrl: "assets/views/reports/staffshiftreports/shiftpersontotals.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'shiftpersontotalsCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'selecttagCtrl', 'ui.select', 'dateCtrl', 'angularBootstrapNavTree', 'selectanyCtrl'),
            title: 'shift person totals',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'clockinout'
            }
        }).state('app.reports.staffshiftreports.shiftactualtotals', {
            url: '/shiftactualtotals',
            templateUrl: "assets/views/reports/staffshiftreports/shiftactualtotals.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'shiftactualtotalsCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'selecttagCtrl', 'ui.select', 'dateCtrl', 'angularBootstrapNavTree', 'selectanyCtrl'),
            title: 'shift actual totals',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'shiftactualtotals'
            }
        }).state('app.reports.staffshiftreports.weeklyanalysis', {
            url: '/weeklyanalysis',
            templateUrl: "assets/views/reports/staffshiftreports/weeklyanalysis.html",
            resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'weeklyanalysisCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'selecttagCtrl', 'ui.select', 'dateCtrl', 'angularBootstrapNavTree', 'selectanyCtrl'),
            title: 'weekly analysis',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'weeklyanalysis'
            }
        }).state('app.reports.staffshiftreports.clockinout', {
            url: '/clockinoutreport',
            templateUrl: "assets/views/reports/staffshiftreports/clockinoutreport.html",
            resolve: loadSequence('clockinoutreportCtrl'),
            title: 'clock in out report',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'clockinout'
            }
        }).state('app.reports.staffshiftreports.clockinoutstats', {
            url: '/cloclinoutstats',
            templateUrl: "assets/views/reports/staffshiftreports/ClockInOutStats.html",
            resolve: loadSequence('ClockInOutStatsCtrl'),
            title: 'Clock In Out Stats',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'clockinoutstats'
            }
        }).state('app.reports.accounting', {
            url: '/accounting',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'accounting',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'accounting'
            }
        }).state('app.reports.accounting.realpaymentspivot', {
            url: '/realpaymentspivot',
            templateUrl: "assets/views/reports/accounting/realpaymentspivot.html",
            resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'realpaymentspivotCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree'),
            title: 'Gerceklesen Odemelere Gore Ciro Raporu',
            authenticate: true,
            ncyBreadcrumb: {
                label: 'realpaymentspivot'
            }
        })
            .state('app.reports.accounting.monthlysalesvsbudget', {
                url: '/monthlysalesvsbudget',
                templateUrl: "assets/views/reports/accounting/monthlysalesvsbudget.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'monthlysalesvsbudgetCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree'),
                title: 'Aylık Satışlar vs Bütçe Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'monthlysalesvsbudget'
                }
            }).state('app.reports.accounting.weeklysalescompare', {
                url: '/weeklysalescompare',
                templateUrl: "assets/views/reports/accounting/weeklysalescompare.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'weeklysalescompareCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree'),
                title: 'Haftalık Satış Karşılaştırması',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'weeklysalescompare'
                }
            }).state('app.reports.accounting.unpaiddeliveries', {
                url: '/unpaiddeliveries',
                templateUrl: "assets/views/reports/accounting/unpaiddeliveries.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'unpaiddeliveriesCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree'),
                title: 'unpaiddeliveries',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'unpaiddeliveries'
                }
            }).state('app.reports.otherreports', {
                url: '/otherreports',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'otherreports',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'otherreports'
                }
            }).state('app.reports.otherreports.customerlist', {
                url: '/customerlist',
                templateUrl: "assets/views/reports/others/customerlist.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'customerlistCtrl', 'dateCtrl'),
                title: 'Musteri Listesi',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'customerlist'
                }
            }).state('app.reports.otherreports.orderlistreport', {
                url: '/orderlistreport',
                templateUrl: "assets/views/reports/others/orderlistreport.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'orderlistreportCtrl', 'dateCtrl', 'orderlistreportdetailCtrl'),
                title: 'Siparis Listesi',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'orderlistreport'
                }
            }).state('app.reports.otherreports.recorddatareport', {
                url: '/recorddatareport',
                templateUrl: "assets/views/reports/others/recorddatareport.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'recorddatareportCtrl', 'dateCtrl'),
                title: 'Yeni Kayit Musteriler',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'recorddatareport'
                }
            }).state('app.reports.otherreports.regionanalisys', {
                url: '/regionanalisys',
                templateUrl: "assets/views/reports/others/regionanalisys.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'regionanalisysCtrl', 'dateCtrl'),
                title: 'Bolge Analizi Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'regionanalisys'
                }
            }).state('app.reports.otherreports.servicesareareport', {
                url: '/servicesareareport',
                templateUrl: "assets/views/reports/others/servicesareareport.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'servicesareareportCtrl'),
                title: 'Restoran Servis Bolgeleri',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'servicesareareport'
                }
            }).state('app.reports.otherreports.customerconsuptionreport', {
                url: '/customerconsuptionreport',
                templateUrl: "assets/views/reports/others/customerconsuptionreport.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'customerconsuptionreportCtrl', 'dateCtrl'),
                title: 'Musteri Tuketim Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'customerconsuptionreport'
                }
            }).state('app.reports.otherreports.newcustomers', {
                url: '/newcustomers',
                templateUrl: "assets/views/reports/others/newcustomers.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'newcustomersCtrl', 'dateCtrl', 'orderlistreportdetailCtrl'),
                title: 'Ilk Siparis Musteri Listesi',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'newcustomers'
                }
            }).state('app.reports.otherreports.segmentationreport', {
                url: '/segmentationreport',
                templateUrl: "assets/views/reports/others/segmentationreport.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'segmentationreportCtrl', 'dateCtrl', 'orderlistreportdetailCtrl'),
                title: 'segmentationreport',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'segmentationreport'
                }
            }).state('app.reports.stockandcostreports', {
                url: '/stockandcostreports',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'stockandcostreports',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'stockandcostreports'
                }
            }).state('app.reports.stockandcostreports.usagereport', {
                url: '/usagereport',
                templateUrl: "assets/views/reports/stockandcostreports/usagereport.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'usagereportCtrl', 'dateCtrl', 'selecttagCtrl', 'angularBootstrapNavTree'),
                title: 'Uretim Kontrol Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'usagereport'
                }
            }).state('app.reports.stockandcostreports.transactionreport', {
                url: '/transactionreport',
                templateUrl: "assets/views/reports/stockandcostreports/inventorytransactions.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'inventorytransactionsCtrl', 'ui.select', 'dateCtrl', 'selecttagCtrl', 'angularBootstrapNavTree'),
                title: 'Malzeme Hareket Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'transactionreport'
                }
            }).state('app.reports.stockandcostreports.consuptionreport', {
                url: '/consuptionreport',
                templateUrl: "assets/views/reports/stockandcostreports/inventoryconsuptions.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'inventoryconsuptionsCtrl', 'ui.select', 'dateCtrl', 'selecttagCtrl', 'angularBootstrapNavTree'),
                title: 'Kullanilan Malzeme Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Consuptions Report'
                }
            }).state('app.reports.stockandcostreports.comparereport', {
                url: '/comparereport',
                template: '<div ui-view class="fade-in-up"></div>'
            }).state('app.reports.stockandcostreports.comparereport.list', {
                url: '/list',
                templateUrl: "assets/views/reports/stockandcostreports/comparereportlist.html",
                resolve: loadSequence('usagereportselectedCtrl', 'underscore', 'xeditable', 'config-xeditable', 'ngTable', 'comparereportlistCtrl', 'selectanyCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'selecttagCtrl', 'ui.select', 'dateCtrl', 'angularBootstrapNavTree'),
                title: 'Gerceklesen Maliyet',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'comparereport'
                }
            }).state('app.reports.stockandcostreports.actualcalculated', {
                url: '/actualcalculated',
                templateUrl: "assets/views/reports/stockandcostreports/actualcalculated.html",
                resolve: loadSequence('usagereportselectedCtrl', 'underscore', 'xeditable', 'config-xeditable', 'ngTable', 'comparereportlistCtrl', 'selectanyCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'selecttagCtrl', 'ui.select', 'dateCtrl', 'angularBootstrapNavTree'),
                title: 'Gercek/Hesaplanan Bakiye Listesi',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'actualcalculated'
                }
            }).state('app.reports.stockandcostreports.usagereportselected', {
                url: '/usagereportselected',
                templateUrl: "assets/views/reports/stockandcostreports/usagereportselected.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'usagereportselectedCtrl', 'ngTable', 'ui.select', 'dateCtrl'),
                title: 'Uretim Kontrol',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Usage Report Selected'
                }
            }).state('app.reports.stockandcostreports.balancelist', {
                url: '/balancelist',
                templateUrl: "assets/views/reports/stockandcostreports/balancelist.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'balancelistCtrl', 'selectanyCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'selecttagCtrl', 'ui.select', 'dateCtrl', 'angularBootstrapNavTree'),
                title: 'Bakiye Listesi',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'balancelist'
                }
            }).state('app.reports.stockandcostreports.inventorywasteconsuptions', {
                url: '/inventorywasteconsuptions',
                templateUrl: "assets/views/reports/stockandcostreports/inventorywasteconsuptions.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'inventorywasteconsuptionsCtrl', 'selectanyCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'selecttagCtrl', 'ui.select', 'dateCtrl', 'angularBootstrapNavTree'),
                title: 'Envanter Atik Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'inventorywasteconsuptions'
                }
            }).state('app.reports.stockandcostreports.wasteproduct', {
                url: '/wasteproduct',
                templateUrl: "assets/views/reports/stockandcostreports/wasteproduct.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'wasteproductCtrl', 'selectanyCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'selecttagCtrl', 'ui.select', 'dateCtrl', 'angularBootstrapNavTree'),
                title: 'Urun Atik Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'wasteproduct'
                }
            }).state('app.reports.stockandcostreports.inventorybalancelist', {
                url: '/inventorybalancelist',
                templateUrl: "assets/views/reports/stockandcostreports/inventorybalancelist.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'inventorybalancelistCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Donem Sonu Bakiye Listesi',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'inventorybalancelist'
                }
            }).state('app.reports.stockandcostreports.awaitingsupplies', {
                url: '/awaitingsupplies',
                templateUrl: "assets/views/reports/stockandcostreports/awaitingsupplies.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'awaitingsuppliesCtrl'),
                title: 'Malzeme Onaylari',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'awaitingsupplies'
                }
            }).state('app.reports.stockandcostreports.supplyreport', {
                url: '/supplyreport',
                templateUrl: "assets/views/reports/stockandcostreports/supplyreport.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'supplyreportCtrl', 'dateCtrl'),
                title: 'supplyreport',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'supplyreport'
                }
            }).state('app.reports.stockandcostreports.inventorycosts', {
                url: '/inventorycosts',
                templateUrl: "assets/views/reports/stockandcostreports/inventorycosts.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'inventorycostsCtrl', 'dateCtrl'),
                title: 'inventorycosts',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'inventorycosts'
                }
            }).state('app.reports.stockandcostreports.inventoryperiodiccosts', {
                url: '/inventoryperiodiccosts',
                templateUrl: "assets/views/reports/stockandcostreports/inventoryperiodiccosts.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'inventoryperiodiccostsCtrl', 'dateCtrl'),
                title: 'inventoryperiodiccosts',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'inventoryperiodiccosts'
                }
            }).state('app.reports.stockandcostreports.inventoryrecipes', {
                url: '/inventoryrecipes',
                templateUrl: "assets/views/reports/stockandcostreports/inventoryrecipes.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'inventoryrecipesCtrl', 'dateCtrl'),
                title: 'inventoryrecipes',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'inventoryrecipes'
                }
            }).state('app.reports.stockandcostreports.productcostgroups', {
                url: '/productcostgroups',
                templateUrl: "assets/views/reports/stockandcostreports/productcostgroups.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'productcostgroupsCtrl'),
                title: 'productcostgroups',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'productcostgroups'
                }
            }).state('app.reports.stockandcostreports.inventoryusagedetail', {
                url: '/inventoryusagedetail',
                templateUrl: "assets/views/reports/stockandcostreports/inventoryusagedetail.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'inventoryusagedetailCtrl', 'dateCtrl'),
                title: 'inventoryusagedetail',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'inventoryusagedetail'
                }
            }).state('app.reports.stockandcostreports.doughchart', {
                url: '/doughchart',
                templateUrl: "assets/views/reports/stockandcostreports/doughchart.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'doughchartCtrl'),
                title: 'doughchart',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'doughchart'
                }
            }).state('app.reports.stockandcostreports.doughchartdata', {
                url: '/doughchartdata',
                templateUrl: "assets/views/reports/stockandcostreports/doughchartdata.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'doughchartdataCtrl'),
                title: 'doughchartdata',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'doughchartdata'
                }
            }).state('app.reports.stockandcostreports.dailyorganizationchart', {
                url: '/dailyorganizationchart',
                templateUrl: "assets/views/reports/stockandcostreports/dailyorganizationchart.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'dailyorganizationchartCtrl'),
                title: 'dailyorganizationchart',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'dailyorganizationchart'
                }
            }).state('app.reports.stockandcostreports.inventorycostsummary', {
                url: '/inventorycostsummary',
                templateUrl: "assets/views/reports/stockandcostreports/inventorycostsummary.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'inventorycostsummaryCtrl'),
                title: 'inventorycostsummary',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'inventorycostsummary'
                }
            }).state('app.reports.stockandcostreports.storefoodcost', {
                url: '/storefoodcost',
                templateUrl: "assets/views/reports/stockandcostreports/storefoodcost.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'storefoodcostCtrl', 'dateCtrl'),
                title: 'storefoodcost',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'storefoodcost'
                }
            }).state('app.reports.stockandcostreports.actualvstheoritical', {
                url: '/actualvstheoritical',
                templateUrl: "assets/views/reports/stockandcostreports/actualvstheoritical.html",
                resolve: loadSequence('actualvstheoriticalCtrl'),
                title: 'Actual vs Theoritical',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'actualvstheoritical'
                }
            }).state('app.reports.stockandcostreports.inventoryconsuptiontransactions', {
                url: '/inventoryconsuptiontransactions',
                templateUrl: "assets/views/reports/stockandcostreports/inventoryconsuptiontransactions.html",
                resolve: loadSequence('inventoryconsuptiontransactionsCtrl'),
                title: 'inventoryconsuptiontransactionsCtrl',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'inventoryconsuptiontransactionsCtrl'
                }
            }).state('app.reports.giroreports', {
                url: '/giroreports',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'giroreports',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'giroreports'
                }
            }).state('app.reports.giroreports.cashreport', {
                url: '/cashreport',
                templateUrl: "assets/views/reports/giroreports/cashreport.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'cashreportCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'selecttagCtrl', 'ui.select', 'dateCtrl', 'angularBootstrapNavTree'),
                title: 'Kasa Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Cash Report'
                }
            }).state('app.reports.giroreports.maincashreport', {
                url: '/maincashreport',
                templateUrl: "assets/views/reports/giroreports/cashreport.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'cashreportCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'selecttagCtrl', 'ui.select', 'dateCtrl', 'angularBootstrapNavTree'),
                title: 'Kasa Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Cash Report'
                }
            }).state('app.reports.giroreports.storecashcontrol', {
                url: '/storecashcontrol',
                templateUrl: "assets/views/reports/giroreports/storecashcontrol.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'storecashcontrolCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'selecttagCtrl', 'ui.select', 'dateCtrl', 'angularBootstrapNavTree'),
                title: 'Kasa Icmal',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'storecashcontrol Report'
                }
            }).state('app.reports.giroreports.orderpayments', {
                url: '/orderpayments',
                templateUrl: "assets/views/reports/giroreports/orderpayments.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'orderpaymentsCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'selecttagCtrl', 'ui.select', 'dateCtrl', 'angularBootstrapNavTree', 'splitaccountCtrl', 'orderpaymentdetailsCtrl'),
                title: 'Gerceklesen Odemeler Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'orderpayments'
                }
            }).state('app.reports.giroreports.giroreport', {
                url: '/giroreport',
                templateUrl: "assets/views/reports/giroreports/giroreport.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'giroreportCtrl', 'dateCtrl'),
                title: 'Ciro Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Giro'
                }
            }).state('app.reports.giroreports.declaredrevenuee', {
                url: '/declaredrevenuee/:id',
                templateUrl: "assets/views/reports/giroreports/declaredrevenuee.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'declaredrevenueeCtrl', 'dateCtrl'),
                title: 'declaredrevenuee',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'declaredrevenuee'
                }
            }).state('app.reports.giroreports.giroanalysis', {
                url: '/giroanalysis',
                templateUrl: "assets/views/reports/giroreports/giroanalysis.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'giroanalysisCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree'),
                title: 'Gunlere Gore Urun Satis Dagilimi Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'giroanalysis'
                }
            }).state('app.reports.giroreports.turnoverbydaysreport', {
                url: '/turnoverbydaysreport',
                templateUrl: "assets/views/reports/giroreports/turnoverbydaysreport.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'turnoverbydaysreportCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree'),
                title: 'Gunlere Gore Ciro Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'turnoverbydaysreport'
                }
            }).state('app.reports.giroreports.turnoverbydaysreportpivot', {
                url: '/turnoverbydaysreportpivot',
                templateUrl: "assets/views/reports/giroreports/turnoverbydaysreportpivot.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'turnoverbydaysreportpivotCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree'),
                title: 'Gunlere Gore Ciro Raporu Pivot',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'turnoverbydaysreportpivot'
                }
            }).state('app.reports.giroreports.turnoverbyhoursreport', {
                url: '/turnoverbyhoursreport',
                templateUrl: "assets/views/reports/giroreports/turnoverbyhoursreport.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'turnoverbyhoursreportCtrl', 'dateCtrl', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree', 'pivottable'),
                title: 'Saatlere Gore Ciro Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'turnoverbyhoursreport'
                }
            }).state('app.reports.giroreports.paymentbydaysreport', {
                url: '/paymentbydaysreport',
                templateUrl: "assets/views/reports/giroreports/paymentbydaysreport.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'paymentbydaysreportCtrl', 'dateCtrl', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree', 'pivottable'),
                title: 'Siparis Tipine Gore Odeme(Tutar) Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'paymentbydaysreport'
                }
            }).state('app.reports.giroreports.orderbyhoursreport', {
                url: '/orderbyhoursreport',
                templateUrl: "assets/views/reports/giroreports/ordersbyhoursreport.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'orderbyhoursreportCtrl', 'dateCtrl', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree', 'pivottable'),
                title: 'Saatlere Gore Adisyon Ciro Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'orderbyhoursreport'
                }
            }).state('app.reports.giroreports.orderpaymentcomparepivot', {
                url: '/orderpaymentcomparepivot',
                templateUrl: "assets/views/reports/giroreports/orderpaymentcomparepivot.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'orderpaymentcomparepivotCtrl', 'dateCtrl', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree', 'pivottable'),
                title: 'Siparis Odemeleri Karsilastirma Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'orderpaymentcomparepivot'
                }
            }).state('app.reports.giroreports.trends', {
                url: '/trends',
                templateUrl: "assets/views/reports/giroreports/trends.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'trendsCtrl', 'dateCtrl', 'jqueryui', 'jquery-nestable-plugin', 'angularBootstrapNavTree'),
                title: 'Trend Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'trends'
                }
            }).state('app.reports.giroreports.accountbalancereport', {
                url: '/accountbalancereport',
                templateUrl: "assets/views/reports/giroreports/accountbalancereport.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'accountbalancereportCtrl', 'accountbalancereportdeteailCtrl'),
                title: 'Cari Borc Durumu Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'accountbalancereport'
                }
            }).state('app.reports.giroreports.cumulativesales', {
                url: '/cumulativesales',
                templateUrl: "assets/views/reports/giroreports/cumulativesales.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'cumulativesalesCtrl'),
                title: 'Kumulatif Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'cumulativesales'
                }
            }).state('app.reports.giroreports.storeranking', {
                url: '/storeranking',
                templateUrl: "assets/views/reports/giroreports/storeranking.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'storerankingCtrl'),
                title: 'Satis Siralamasi Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'storeranking'
                }
            }).state('app.reports.giroreports.salesbysource', {
                url: '/salesbysource',
                templateUrl: "assets/views/reports/giroreports/salesbysource.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'salesbysourceCtrl'),
                title: 'sales by source',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'salesbysource'
                }
            }).state('app.reports.giroreports.scorecard', {
                url: '/scorecard',
                templateUrl: "assets/views/reports/giroreports/scorecard.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'scoreCardCtrl'),
                title: 'Score Card',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'scorecard'
                }
            }).state('app.reports.productsalesreports', {
                url: '/productsalesreports',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'productsalesreports',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'productsalesreports'
                }
            }).state('app.reports.productsalesreports.productsalesstatistics', {
                url: '/productsalesstatistics',
                templateUrl: "assets/views/reports/productsalesreports/productsalesstatistics.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'productsalesstatisticsCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree'),
                title: 'Urun Satis Istatistikleri (Adet) Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'productsalesstatistics'
                }
            }).state('app.reports.productsalesreports.productgroupstrikerate', {
                url: '/productgroupstrikerate',
                templateUrl: "assets/views/reports/productsalesreports/productgroupstrikerate.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'productgroupstrikerateCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree'),
                title: 'product group strikerate',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'productgroupstrikerate'
                }
            }).state('app.reports.productsalesreports.productsalessummary', {
                url: '/productsalessummary',
                templateUrl: "assets/views/reports/productsalesreports/productsalessummary.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'productsalessummaryCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree'),
                title: 'product sales summary',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'productsalessummary'
                }
            }).state('app.reports.productsalesreports.productsalesstatisticspivot', {
                url: '/productsalesstatisticspivot',
                templateUrl: "assets/views/reports/productsalesreports/productsalesstatisticspivot.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'productsalesstatisticspivotCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree'),
                title: 'Urun Satis Istatistikleri (Adet) Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'productsalesstatisticspivot'
                }
            }).state('app.reports.productsalesreports.productsalesstatisticsamount', {
                url: '/productsalesstatisticsamount',
                templateUrl: "assets/views/reports/productsalesreports/productsalesstatisticsamount.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'productsalesstatisticsamountCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree'),
                title: 'Urun Satis Istatistikleri (Tutar) Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'productsalesstatisticsamount'
                }
            }).state('app.reports.productsalesreports.productsalesbydays', {
                url: '/productsalesbydays',
                templateUrl: "assets/views/reports/productsalesreports/productsalesbydays.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'productsalesbydaysCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree'),
                title: 'Gunlere Gore Urun Satis Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'productsalesbydays'
                }
            }).state('app.reports.productsalesreports.productsalesbyhours', {
                url: '/productsalesbyhours',
                templateUrl: "assets/views/reports/productsalesreports/productsalesbyhours.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'productsalesbyhoursCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree'),
                title: 'Saatlere Gore Urun Satis Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'productsalesbyhours'
                }
            }).state('app.reports.productsalesreports.productsalesbyweeks', {
                url: '/productsalesbyweeks',
                templateUrl: "assets/views/reports/productsalesreports/productsalesbyweeks.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'productsalesbyweeksCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree', 'pivottable'),
                title: 'productsalesbyweeks',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'productsalesbyweeks'
                }
            }).state('app.reports.productsalesreports.productusagecounts', {
                url: '/productusagecounts',
                templateUrl: "assets/views/reports/productsalesreports/productusagecounts.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'productusagecountsCtrl', 'dateCtrl'),
                title: 'Urun Satis Listesi',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'productusagecountsCtrl'
                }
            }).state('app.reports.productsalesreports.storesalesstatistics', {
                url: '/storesalesstatistics',
                templateUrl: "assets/views/reports/productsalesreports/storesalesstatistics.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'storesalesstatisticsCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Restoran Satis Istatistikleri',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'storesalesstatistics'
                }
            }).state('app.reports.productsalesreports.productwithrelations', {
                url: '/productwithrelations',
                templateUrl: "assets/views/reports/productsalesreports/productwithrelations.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'productwithrelationsCtrl', 'dateCtrl'),
                title: 'Menu Urun Satis Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'productwithrelations'
                }
            }).state('app.reports.productsalesreports.promotionanaisys', {
                url: '/promotionanaisys',
                templateUrl: "assets/views/reports/productsalesreports/promotionanaisys.html",
                resolve: loadSequence('promotionanaisysCtrl'),
                title: 'Promosyon Analizi Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'promotionanaisys'
                }
            }).state('app.reports.productsalesreports.menuincom', {
                url: '/menuincom',
                templateUrl: "assets/views/reports/productsalesreports/menuincom.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'menuincomCtrl', 'dateCtrl'),
                title: 'Menu Satis Geliri Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'menuincom'
                }
            }).state('app.reports.productsalesreports.productcostdetails', {
                url: '/productcostdetails',
                templateUrl: "assets/views/reports/productsalesreports/productcostdetails.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'productcostdetailsCtrl', 'dateCtrl'),
                title: 'Urun Maliyet Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'productcostdetails'
                }
            }).state('app.reports.productsalesreports.productsalesbyproto', {
                url: '/productsalesbyproto',
                templateUrl: "assets/views/reports/productsalesreports/productsalesbyproto.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'productsalesbyprotoCtrl', 'dateCtrl'),
                title: 'Urun Prototip Satis Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'productsalesbyproto'
                }
            }).state('app.reports.productsalesreports.productsalespochette', {
                url: '/productsalespochette',
                templateUrl: "assets/views/reports/productsalesreports/productsalespochette.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'productsalespochetteCtrl', 'dateCtrl'),
                title: 'Tasima Poseti Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'productsalespochette'
                }
            }).state('app.reports.consolidatedreports', {
                url: '/consolidatedreports',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'consolidatedreports',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'consolidatedreports'
                }
            }).state('app.reports.consolidatedreports.turnoverbydays', {
                url: '/turnoverbydays',
                templateUrl: "assets/views/reports/consolidatedreports/turnoverbydays.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'turnoverbydaysCtrl', 'dateCtrl', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree', 'pivottable'),
                title: 'turnoverbydays',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'turnoverbydays'
                }
            }).state('app.reports.consolidatedreports.ordersbydays', {
                url: '/ordersbydays',
                templateUrl: "assets/views/reports/consolidatedreports/ordersbydays.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'ordersbydaysreportCtrl', 'dateCtrl', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'TagModalCtrl', 'angularBootstrapNavTree', 'pivottable'),
                title: 'ordersbydays',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'ordersbydays'
                }
            }).state('app.reports.consolidatedreports.paymentamount', {
                url: '/paymentamount',
                templateUrl: "assets/views/reports/consolidatedreports/paymentamount.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'paymentamountCtrl', 'dateCtrl', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree', 'pivottable'),
                title: 'paymentamount',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'paymentamount'
                }
            }).state('app.reports.consolidatedreports.paymentquantity', {
                url: '/paymentquantity',
                templateUrl: "assets/views/reports/consolidatedreports/paymentquantity.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'paymentquantityCtrl', 'dateCtrl', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree', 'pivottable'),
                title: 'paymentquantity',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'paymentquantity'
                }
            }).state('app.reports.consolidatedreports.turnoverbyhours', {
                url: '/turnoverbyhours',
                templateUrl: "assets/views/reports/consolidatedreports/turnoverbyhours.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'turnoverbyhoursCtrl', 'dateCtrl', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree', 'pivottable'),
                title: 'turnoverbyhours',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'turnoverbyhours'
                }
            }).state('app.reports.consolidatedreports.ordersbyhours', {
                url: '/ordersbyhours',
                templateUrl: "assets/views/reports/consolidatedreports/ordersbyhours.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'ordersbyhoursCtrl', 'dateCtrl', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree', 'pivottable'),
                title: 'ordersbyhours',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'ordersbyhours'
                }
            }).state('app.reports.consolidatedreports.productsalesamount', {
                url: '/productsalesamount',
                templateUrl: "assets/views/reports/consolidatedreports/productsalesamount.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'productsalesamountCtrl', 'dateCtrl', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree', 'pivottable'),
                title: 'productsalesamount',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'productsalesamount'
                }
            }).state('app.reports.consolidatedreports.productsalesquantity', {
                url: '/productsalesquantity',
                templateUrl: "assets/views/reports/consolidatedreports/productsalesquantity.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'productsalesquantityCtrl', 'dateCtrl', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree', 'pivottable'),
                title: 'productsalesquantity',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'productsalesquantity'
                }
            }).state('app.reports.consolidatedreports.productsalesbytotalhours', {
                url: '/productsalesbytotalhours',
                templateUrl: "assets/views/reports/consolidatedreports/productsalesbytotalhours.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'productsalesbytotalhoursCtrl', 'dateCtrl', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree', 'pivottable'),
                title: 'productsalesbytotalhours',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'productsalesbytotalhours'
                }
            }).state('app.reports.consolidatedreports.productsalesbymounts', {
                url: '/productsalesbymounts',
                templateUrl: "assets/views/reports/consolidatedreports/productsalesbymounts.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'productsalesbymountsCtrl', 'dateCtrl', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree', 'pivottable'),
                title: 'productsalesbymounts',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'productsalesbymounts'
                }
            }).state('app.reports.consolidatedreports.productsalesbyweeks', {
                url: '/productsalesbyweeks',
                templateUrl: "assets/views/reports/consolidatedreports/productsalesbyweeks.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'productsalesbyweeksreportCtrl', 'dateCtrl', 'jqueryui', 'selecttagCtrl', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree', 'pivottable'),
                title: 'productsalesbyweeks',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'productsalesbyweeks'
                }
            }).state('app.reports.callcenterreports', {
                url: '/callcenterreports',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'callcenterreports',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'callcenterreports'
                }
            }).state('app.reports.callcenterreports.agentorders', {
                url: '/agentorders',
                templateUrl: "assets/views/reports/callcenterreports/agentorders.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'agentordersCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Agent Satislari Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'agentorders'
                }
            }).state('app.reports.callcenterreports.ordertotals', {
                url: '/ordertotals',
                templateUrl: "assets/views/reports/callcenterreports/ordertotals.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'ordertotalsCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Siparis Toplamlari Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'ordertotals'
                }
            }).state('app.reports.callcenterreports.storeorders', {
                url: '/storeorders',
                templateUrl: "assets/views/reports/callcenterreports/storeorders.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'storeordersCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Sube Siparisleri Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'storeorders'
                }
            }).state('app.reports.callcenterreports.agentsalesstatistics', {
                url: '/agentsalesstatistics',
                templateUrl: "assets/views/reports/callcenterreports/agentsalesstatistics.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'agentsalesstatisticsCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Agent Satis Istatistikleri',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'agentsalesstatistics'
                }
            }).state('app.reports.callcenterreports.hourlyorders', {
                url: '/hourlyorders',
                templateUrl: "assets/views/reports/callcenterreports/hourlyorders.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'hourlyordersCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Saatlik Siparis (Adet) Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'hourlyorders'
                }
            }).state('app.reports.callcenterreports.hourlyorderslist', {
                url: '/hourlyorderslist',
                templateUrl: "assets/views/reports/callcenterreports/hourlyorderslist.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'hourlyorderslistCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Saatlik Siparis Listesi',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'hourlyorderslist'
                }
            }).state('app.reports.callcenterreports.dailytotals', {
                url: '/dailytotals',
                templateUrl: "assets/views/reports/callcenterreports/dailytotals.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'dailytotalsCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Gunluk Toplamlar Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'dailytotals'
                }
            }).state('app.reports.callcenterreports.hourlytotals', {
                url: '/hourlytotals',
                templateUrl: "assets/views/reports/callcenterreports/hourlytotals.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'hourlytotalsCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Saatlere Gore Gunluk Toplamlar Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'hourlytotals'
                }
            }).state('app.reports.callcenterreports.storepayenttypes', {
                url: '/storepayenttypes',
                templateUrl: "assets/views/reports/callcenterreports/storepayenttypes.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'storepayenttypesCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Restoranlarin Odeme Dagilimlari Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'storepayenttypes'
                }
            }).state('app.reports.callcenterreports.dailysales', {
                url: '/dailysales',
                templateUrl: "assets/views/reports/callcenterreports/dailysales.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'dailysalesCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'dailysales',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'dailysales'
                }
            }).state('app.reports.callcenterreports.callreasonreport', {
                url: '/callreasonreport',
                templateUrl: "assets/views/reports/callcenterreports/callreasonreport.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'callreasonreportCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Cagri Sebebi Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'callreasonreport'
                }
            }).state('app.reports.callcenterreports.callreasonreportpivot', {
                url: '/callreasonreportpivot',
                templateUrl: "assets/views/reports/callcenterreports/callreasonreportpivot.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'callreasonreportpivotCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'callreasonreportpivot',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'callreasonreportpivot'
                }
            }).state('app.reports.callcenterreports.customermaps', {
                url: '/customermaps',
                templateUrl: "assets/views/reports/callcenterreports/customermaps.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'customermapsCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'customermaps',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'customermaps'
                }
            }).state('app.reports.callcenterreports.personsurvey', {
                url: '/personsurvey',
                templateUrl: "assets/views/reports/callcenterreports/personsurvey.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'personsurveyCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Anket Sonuclari Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'personsurvey'
                }
            }).state('app.reports.callcenterreports.callcenterorders', {
                url: '/callcenterorders',
                templateUrl: "assets/views/reports/callcenterreports/callcenterorders.html",
                resolve: loadSequence('callcenterordersCtrl'),
                title: 'Call Center Orders',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'callcenterorders'
                }
            }).state('app.reports.callcenterreports.aggregatorordersreport', {
                url: '/aggregatorordersreport',
                templateUrl: "assets/views/reports/callcenterreports/aggregatorordersreport.html",
                resolve: loadSequence('aggregatorordersreportCtrl'),
                title: 'aggregator orders report',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'aggregatorordersreport'
                }
            })
            .state('app.reports.callcenterreports.marketingpermissions', {
                url: '/marketingpermissions',
                templateUrl: "assets/views/reports/callcenterreports/marketingpermissions.html",
                resolve: loadSequence('marketingpermissionsCtrl'),
                title: 'Marketing Permissions',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'marketingpermissions'
                }
            }).state('app.reports.callcenterreports.poductsalesccoreboard', {
                url: '/poductsalesccoreboard',
                templateUrl: "assets/views/reports/callcenterreports/poductsalesccoreboard.html",
                resolve: loadSequence('poductsalesccoreboardCtrl'),
                title: 'CallCenter Product Sales Scoreboard',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'poductsalesccoreboard'
                }
            }).state('app.reports.complaintreports', {
                url: '/complaintreports',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'complaintreports',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'complaintreports'
                }
            }).state('app.reports.complaintreports.complaintlistreports', {
                url: '/complaintlistreports',
                templateUrl: "assets/views/reports/complaintreports/complaintlistreports.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'complaintlistreportsCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Sikayet Listesi',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'complaintlistreports'
                }
            }).state('app.reports.ordersreports', {
                url: '/ordersreports',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'ordersreports',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'ordersreports'
                }
            }).state('app.reports.ordersreports.ordertotalsstorebyordertype', {
                url: '/ordertotalsstorebyordertype',
                templateUrl: "assets/views/reports/ordersreports/ordertotalsstorebyordertype.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'OrderTotalsStoreByOrderTypeCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'ordertotalsstorebyordertype',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'ordertotalsstorebyordertype'
                }
            }).state('app.reports.ordersreports.ordertotals', {
                url: '/ordertotals',
                templateUrl: "assets/views/reports/ordersreports/ordertotals.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'ordertotalsCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Siparis Toplamlari Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'ordertotals'
                }
            }).state('app.reports.ordersreports.orderpaymentscheck', {
                url: '/orderpaymentscheck',
                templateUrl: "assets/views/reports/ordersreports/orderpaymentscheck.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'orderpaymentscheckCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Siparis Ödeme Tipleri Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'orderpaymentscheck'
                }
            }).state('app.reports.ordersreports.staffordersreport', {
                url: '/staffordersreport',
                templateUrl: "assets/views/reports/ordersreports/staffordersreport.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'staffordersreportCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Staff Orders Report',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'staffordersreport'
                }
            }).state('app.reports.ordersreports.DriversTransactions', {
                url: '/DriversTransactions',
                templateUrl: "assets/views/reports/ordersreports/DriversTransactions.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'DriversTransactionsCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Drivers Transactions',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'DriversTransactions'
                }
            }).state('app.reports.ordersreports.orderrouted', {
                url: '/orderrouted',
                templateUrl: "assets/views/reports/ordersreports/orderrouted.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'orderroutedCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Order Routed Report',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'orderrouted'
                }
            }).state('app.reports.ordersreports.performance', {
                url: '/performance',
                templateUrl: "assets/views/reports/ordersreports/performance.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'performanceCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Siparis Performanslari Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'performance'
                }
            }).state('app.reports.ordersreports.OrderCountsByPamentType', {
                url: '/OrderCountsByPamentType',
                templateUrl: "assets/views/reports/ordersreports/OrderCountsByPamentTypePivot.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'OrderCountsByPamentTypePivotCtrl', 'dateCtrl', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Odeme Tiplerine Gore Siparis Adetleri Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Order Counts By Pament Type Pivot'
                }
            }).state('app.reports.ordersreports.OrderTotalsBySourceType', {
                url: '/OrderTotalsBySourceType',
                templateUrl: "assets/views/reports/ordersreports/OrderTotalsBySourceType.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'OrderTotalsBySourceTypeCtrl', 'dateCtrl', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Siparis Kaynagina Gore Siparis Toplamlari Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Order Totals By Source Type'
                }
            }).state('app.reports.ordersreports.OrderCountsBySourceType', {
                url: '/OrderCountsBySourceType',
                templateUrl: "assets/views/reports/ordersreports/OrderCountsBySourceType.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'OrderCountsBySourceTypeCtrl', 'dateCtrl', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Siparis Kaynagina Gore Siparis Adetleri Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Order Counts By Source Type'
                }
            }).state('app.reports.ordersreports.orderdriverlist', {
                url: '/orderdriverlist',
                templateUrl: "assets/views/reports/ordersreports/orderdriverlist.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'orderdriverlistCtrl', 'deletedorderitemsdetailsCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Siparis Surucu Listesi',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'orderdriverlist'
                }
            }).state('app.reports.ordersreports.orderlog', {
                url: '/orderlog',
                templateUrl: "assets/views/reports/ordersreports/orderlog.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'orderlogCtrl', 'dateCtrl', 'orderlistreportdetailCtrl'),
                title: 'Siparis Log Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'orderlog'
                }
            }).state('app.reports.ordersreports.ordertotalsbypaymenttypepivot', {
                url: '/ordertotalsbypaymenttypepivot',
                templateUrl: "assets/views/reports/ordersreports/ordertotalsbypaymenttypepivot.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'ordertotalsbypaymenttypepivotCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Odeme Tiplerine Gore Siparis Toplamlari Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'ordertotalsbypaymenttypepivot'
                }
            }).state('app.reports.ordersreports.OrderTotalsStoreByOrderType', {
                url: '/OrderTotalsStoreByOrderType',
                templateUrl: "assets/views/reports/ordersreports/OrderTotalsStoreByOrderType.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'OrderTotalsStoreByOrderTypeCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'OrderTotalsStoreByOrderType',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'OrderTotalsStoreByOrderType'
                }
            }).state('app.reports.ordersreports.OrderPayments', {
                url: '/OrderPayments',
                templateUrl: "assets/views/reports/ordersreports/OrderPayments.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'OrderPaymentsCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Odeme Tiplerine Gore Siparisler (Tutar) Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'OrderPayments'
                }
            }).state('app.reports.ordersreports.ProductSales', {
                url: '/ProductSales',
                templateUrl: "assets/views/reports/ordersreports/ProductSales.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'ProductSalesCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Urun Satis Listesi',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'ProductSales'
                }
            }).state('app.reports.ordersreports.userproductsales', {
                url: '/userproductsales',
                templateUrl: "assets/views/reports/ordersreports/userproductsales.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'userproductsalesCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Kullanici Urun Satis Listesi',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'userproductsales'
                }
            }).state('app.reports.ordersreports.InventoryUsages', {
                url: '/InventoryUsages',
                templateUrl: "assets/views/reports/ordersreports/InventoryUsages.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'InventoryUsagesCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Malzeme Tuketim Analiz Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'InventoryUsages'
                }
            }).state('app.reports.ordersreports.ReturnedProducts', {
                url: '/ReturnedProducts',
                templateUrl: "assets/views/reports/ordersreports/ReturnedProducts.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'ReturnedProductsCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable', 'angularBootstrapNavTree'),
                title: 'Return (Iptal Adisyon) Urun Listesi Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'ReturnedProducts'
                }
            }).state('app.reports.ordersreports.ReturnedProductsDetailed', {
                url: '/ReturnedProductsDetailed',
                templateUrl: "assets/views/reports/ordersreports/ReturnedProductsDetailed.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'ReturnedProductsDetailedCtrl', 'dateCtrl', 'returnreportorderdetailsCtrl', 'orderlistreportdetailCtrl'),
                title: 'Return (Iptal Adisyon) Urun Listesi Detay Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'ReturnedProductsDetailed'
                }
            }).state('app.reports.ordersreports.deletedorderitems', {
                url: '/deletedorderitems',
                templateUrl: "assets/views/reports/ordersreports/deletedorderitems.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'deletedorderitemsCtrl', 'dateCtrl', 'deletedorderitemsdetailsCtrl'),
                title: 'Silinen Siparis Kalemleri Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'deletedorderitems'
                }
            }).state('app.reports.ordersreports.orderpromotion', {
                url: '/orderpromotion',
                templateUrl: "assets/views/reports/ordersreports/orderpromotion.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'orderpromotionCtrl', 'dateCtrl', 'orderpromotionorderdetailsCtrl'),
                title: 'Siparis Indirim Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'orderpromotion'
                }
            }).state('app.reports.ordersreports.kitchenperformance', {
                url: '/kitchenperformance',
                templateUrl: "assets/views/reports/ordersreports/kitchenperformance.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'kitchenperformanceCtrl', 'deletedorderitemsdetailsCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Mutfak Performanslari Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'kitchenperformance'
                }
            }).state('app.reports.ordersreports.orderlaststates', {
                url: '/orderlaststates',
                templateUrl: "assets/views/reports/ordersreports/orderlaststates.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'orderlaststatesCtrl', 'dateCtrl', 'pivottable', 'jqueryui', 'jquery-nestable-plugin', 'ng-nestable'),
                title: 'Siparis Durumlari Toplami Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'orderlaststates'
                }
            }).state('app.reports.ordersreports.changeorderpayments', {
                url: '/changeorderpayments',
                templateUrl: "assets/views/reports/ordersreports/changeorderpayments.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'changeorderpaymentsCtrl', 'dateCtrl', 'returnreportorderdetailsCtrl'),
                title: 'Odeme Tipleri Degisen Siparisler Raporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'changeorderpayments'
                }
            }).state('app.reports.ordersreports.promotioncodedetails', {
                url: '/promotioncodedetails',
                templateUrl: "assets/views/reports/ordersreports/promotioncodedetails.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'promotioncodedetailsCtrl', 'dateCtrl', 'orderpromotionorderdetailsCtrl'),
                title: 'Promosyon Kod Detayları',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'promotioncodedetails'
                }
            }).state('app.reports.management', {
                url: '/ordersreports',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'managementreports',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'managementreports'
                }
            }).state('app.reports.management.podsreport', {
                url: '/podsreport',
                templateUrl: "assets/views/reports/management/podsreport.html",
                resolve: loadSequence('PodsReportCtrl'),
                title: 'Pods Report',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'podsreport'
                }
            }).state('app.reports.management.productwastes', {
                url: '/productwastesreport',
                templateUrl: "assets/views/reports/management/ProductWastesReport.html",
                resolve: loadSequence('ProductWastesReportCtrl'),
                title: 'ProductWastes Report',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'productwastesreport'
                }
            }).state('app.reports.management.voidorders', {
                url: '/voidorders',
                templateUrl: "assets/views/reports/ordersreports/voidorders.html",
                resolve: loadSequence('VoidOrdersCtrl'),
                title: 'VoidOrders Report',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'voidorders'
                }
            }).state('app.reports.loyalty', {
                url: '/ordersreports',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'loyalty',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'loyalty'
                }
            }).state('app.reports.loyalty.punchcardtransactions', {
                url: '/punchcardtransactions',
                templateUrl: "assets/views/reports/loyalty/punchcardtransactions.html",
                resolve: loadSequence('punchcardtransactionsCtrl'),
                title: 'punch card transactions Report',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'punchcardtransactions'
                }
            }).state('app.reports.loyalty.bonustransactions', {
                url: '/bonustransactions',
                templateUrl: "assets/views/reports/loyalty/bonustransactions.html",
                resolve: loadSequence('bonustransactionsCtrl'),
                title: 'bonus transactions Report',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'bonustransactions'
                }
            }).state('app.reports.loyalty.bonusstats', {
                url: '/bonusstats',
                templateUrl: "assets/views/reports/loyalty/bonusstats.html",
                resolve: loadSequence('bonusstatsCtrl'),
                title: 'Bonus Stats Report',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'bonusstats'
                }
            }).state('app.reports.loyalty.punchcardstorecompare', {
                url: '/punchcardstorecompare',
                templateUrl: "assets/views/reports/loyalty/PunchCardStoreCompare.html",
                resolve: loadSequence('PunchCardStoreCompareCtrl'),
                title: 'Punch Card Store Compare Report',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'punchcardstorecompare'
                }
            }).state('app.reports.web', {
                url: '/web',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'web',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'web'
                }
            }).state('app.reports.web.webusers', {
                url: '/webusers',
                templateUrl: "assets/views/reports/web/webusers.html",
                resolve: loadSequence('webusersCtrl'),
                title: 'Web Users Report',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'webusers'
                }
            }).state('app.aggregators', {
                url: '/aggregators',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'Aggregators',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Aggregators'
                }
            }).state('app.aggregators.orders', {
                url: '/orders',
                templateUrl: "assets/views/aggregators/aggregatororderlist.html",
                resolve: loadSequence('aggregatororderlistCtrl', 'ysorderrejectreasonCtrl', 'changeysorderstoreCtrl'),
                title: 'orderlist',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'orderlist'
                }
            }).state('app.aggregators.mapping', {
                url: '/mapping',
                templateUrl: "assets/views/aggregators/aggregatormapping.html",
                resolve: loadSequence('aggregatormappingCtrl'),
                title: 'aggregatormapping',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'aggregatormapping'
                }
            }).state('app.aggregators.trendyolmapping', {
                url: '/trendyolmapping',
                templateUrl: "assets/views/aggregators/trendyolmapping.html",
                resolve: loadSequence('trendyolmappingCtrl'),
                title: 'trendyolmapping',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'trendyolmapping'
                }
              }).state('app.aggregators.migrosmapping', {
                url: '/migrosmapping',
                templateUrl: "assets/views/aggregators/migrosmapping.html",
                resolve: loadSequence('migrosmappingCtrl'),
                title: 'migrosmapping',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'migrosmapping'
                }
            }).state('app.aggregators.customermap', {
                url: '/customermap/:id',
                templateUrl: "assets/views/aggregators/aggregatorcustomer.html",
                resolve: loadSequence('ngTable', 'aggregatorcustomerCtrl', 'newregisterpersonCtrl', 'addnewaddressCtrl', 'StreetAddressSelectorCtrl'),
                title: 'customermap',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'customermap'
                }
            }).state('app.aggregators.storeaggregatorstatus', {
                url: '/storeaggregatorstatus',
                templateUrl: "assets/views/aggregators/storeaggregatorstatus.html",
                resolve: loadSequence('storeaggregatorstatusCtrl'),
                title: 'storeaggregatorstatus',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'storeaggregatorstatus'
                }
            }).state('app.aggregators.AggregatorStoreStatus', {
                url: '/AggregatorStoreStatus',
                templateUrl: "assets/views/aggregators/AggregatorStoreStatus.html",
                resolve: loadSequence('AggregatorStoreStatusCtrl'),
                title: 'AggregatorStoreStatus',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'AggregatorStoreStatus'
                }
            }).state('app.addresses', {
                url: '/addresses',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'Addresses',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Addresses'
                }
            }).state('app.addresses.streetaddress', {
                url: '/streetaddress',
                templateUrl: "assets/views/streetaddress/streetaddress.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'streetaddressCtrl', 'storestreetaddressesCtrl', 'streetaddresseditCtrl'),
                title: 'Streetaddress',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Streetaddress'
                }
            }).state('app.addresses.quarters', {
                url: '/quarter',
                templateUrl: "assets/views/streetaddress/quarters.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'quarterCtrl'),
                title: 'Quarters',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Quarters'
                }
            }).state('app.addresses.subcitys', {
                url: '/subcitys',
                templateUrl: "assets/views/streetaddress/subcitys.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'subcityCtrl'),
                title: 'Subcitys',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Subcitys'
                }
            }).state('app.addresses.towns', {
                url: '/towns',
                templateUrl: "assets/views/streetaddress/towns.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'townCtrl'),
                title: 'Towns',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Towns'
                }
            }).state('app.mergeaddresses', {
                url: '/mergeaddresses',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'Merge Addresses',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Merge Addresses'
                }
            }).state('app.mergeaddresses.mergetowns', {
                url: '/mergetowns',
                templateUrl: "assets/views/mergeaddresses/mergetowns.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'mergetownsCtrl'),
                title: 'Merge Towns',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Merge Towns'
                }
            }).state('app.mergeaddresses.mergesubcities', {
                url: '/mergesubcities',
                templateUrl: "assets/views/mergeaddresses/mergesubcities.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'mergesubcitiesCtrl'),
                title: 'Merge Subcities',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Merge Subcities'
                }
            }).state('app.mergeaddresses.mergequarters', {
                url: '/mergequarters',
                templateUrl: "assets/views/mergeaddresses/mergequarters.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'mergequartersCtrl'),
                title: 'Merge Quarters',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Merge Quarters'
                }
            }).state('app.mergeaddresses.mergestreetaddress', {
                url: '/mergestreetaddress',
                templateUrl: "assets/views/mergeaddresses/mergestreetaddress.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'mergestreetaddressCtrl'),
                title: 'Merge Street Address',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Merge Street Address'
                }
            }).state('app.orderdisplay', {
                url: '/orderdisplay',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'orderdisplay',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'orderdisplay'
                }
            }).state('app.orderdisplay.orderdisplay', {
                url: '/orderdisplay',
                templateUrl: "assets/views/orderdisplay/orderdisplay.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'orderdisplayCtrl', 'changeorderstateCtrl', 'ysorderrejectreasonCtrl', 'changeysorderstoreCtrl'),
                title: 'Order Display',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Order Display'
                }
            })
            .state('app.orderdisplay.orderCarrierSelection', {
                url: '/orderCarrierSelection',
                templateUrl: "assets/views/orderdisplay/orderCarrierSelection.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'carrierCtrl' ,'orderCarrierSelectionCtrl'),
                title: 'Order Carrier Selection',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Order Carrier Selection'
                }
            }).state('app.orderdisplay.ysordersdisplay', {
                url: '/ysordersdisplay',
                templateUrl: "assets/views/orderdisplay/ysordersdisplay.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'ysordersdisplayCtrl', 'ysorderrejectreasonCtrl', 'changeysorderstoreCtrl'),
                title: 'ysordersdisplay',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'ysordersdisplay'
                }
            }).state('app.kitchendisplay', {
                url: '/kitchendisplay',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'kitchendisplay',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'kitchendisplay'
                }
            }).state('app.kitchendisplay.kitchendisplay', {
                url: '/kitchendisplay',
                templateUrl: "assets/views/kitchenDisplay/kitchenDisplay.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'kdsCtrl'),
                title: 'Kitchen Display',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Kitchen Display'
                }
            }).state('app.kitchendisplay.kitchendisplay2', {
                url: '/kitchendisplay2',
                templateUrl: "assets/views/kitchenDisplay/kitchenDisplay2.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'kds2Ctrl', 'kdslastordersCtrl', 'dashboardCtrl'),
                title: 'Kitchen Display',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Kitchen Display'
                }
            }).state('app.Carriers', {
                url: '/Carriers',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'Carriers',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Carriers'
                }
            }).state('app.Carriers.Carrier', {
                url: '/Carrier',
                templateUrl: "assets/views/Carriers/Carrier.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'CarrierCtrl'),
                title: 'Carrier',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Carrier'
                }
            }).state('app.Carriers.CourierTransactionPrice', {
                url: '/CourierTransactionPrice',
                templateUrl: "assets/views/Carriers/CourierTransactionPrice.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'CourierTransactionPriceCtrl', 'dateCtrl'),
                title: 'Courier Transaction Price',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Courier Transaction Price'
                }
            }).state('app.bonus', {
                url: '/bonus',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'bonus',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'bonus'
                }
            }).state('app.bonus.bonusearningrule', {
                url: '/bonusearningrule',
                templateUrl: "assets/views/bonus/bonusearningrule.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'bonusearningruleCtrl', 'dashboardCtrl','TagModalCtrl'),
                title: 'Bonus Earning Rule',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Bonus Earning Rule'
                }
            }).state('app.bonus.bonusspendingrule', {
                url: '/bonusspendingrule',
                templateUrl: "assets/views/bonus/bonusspendingrule.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'bonusspendingruleCtrl', 'dashboardCtrl'),
                title: 'Bonus Spending Rule',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Bonus Spending Rule'
                }
            }).state('app.bonus.punchcardsetting', {
                url: '/punchcardsetting',
                templateUrl: "assets/views/bonus/punchcardsetting.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'punchcardsettingCtrl'),
                title: 'Punchcard Setting',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Punchcard Setting'
                }
            }).state('app.bonus.punchcardearningrule', {
                url: '/punchcardearningrule',
                templateUrl: "assets/views/bonus/punchcardearningrule.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'punchcardearningruleCtrl', 'dashboardCtrl'),
                title: 'Punchcard Earning Rule',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Punchcard Earning Rule'
                }
            }).state('app.bonus.punchcardspendingrule', {
                url: '/punchcardspendingrule',
                templateUrl: "assets/views/bonus/punchcardspendingrule.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'punchcardspendingruleCtrl', 'dashboardCtrl'),
                title: 'Punchcard Spending Rule',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Punchcard Spending Rule'
                }
            }).state('app.hnr', {
                url: '/hnr',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'HNR',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'HNR'
                }
            }).state('app.hnr.hnrdata', {
                url: '/hnrdata',
                templateUrl: "assets/views/hnr/hnrdata.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'dateCtrl', 'hnrdataCtrl'),
                title: 'HNRDATA',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'HNRDATA'
                }
            }).state('app.hnr.hnrgroup', {
                url: '/hnrgroup',
                templateUrl: "assets/views/hnr/hnrgroup.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'dateCtrl', 'hnrgroupCtrl'),
                title: 'HNRGROUP',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'HNRGROUP'
                }
            }).state('app.hnr.hnrproduct', {
                url: '/hnrproduct',
                templateUrl: "assets/views/hnr/hnrproduct.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'hnrproductCtrl'),
                title: 'HNRPRODUCt',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'HNRPRODUCT'
                }
            }).state('app.hnr.hotandready', {
                url: '/hotandready/:id',
                templateUrl: "assets/views/hnr/hotandready.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'hotandreadyCtrl'),
                title: 'hotandready',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'hotandready'
                }
            }).state('app.callcenterlastorders', {
                url: '/callcenterlastorders',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'Callcenter Last Orders',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Callcenter Last Orders'
                }
            }).state('app.callcenterlastorders.callcentersales', {
                url: '/callcentersales',
                templateUrl: "assets/views/callcenterlastorders/lastorders.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'lastordersCtrl'),
                title: 'Callcenter Last Orders',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Callcenter Last Orders'
                }
            }).state('app.callmonitor', {
                url: '/callmonitor',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'callmonitor',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'callmonitor'
                }
            }).state('app.yemeksepetistats', {
                url: '/yemeksepetistats',
                templateUrl: "assets/views/yemeksepeti/yemeksepetistats.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'yemeksepetistatsCtrl'),
                title: 'yemeksepetistats',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'yemeksepetistats'
                }
            }).state('app.getirstats', {
                url: '/getirstats',
                templateUrl: "assets/views/yemeksepeti/getirstats.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'getirstatsCtrl'),
                title: 'getirstats',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'getirstats'
                }
            }).state('app.reports.yemeksepetistatsdetail', {
                url: '/yemeksepetistatsdetail',
                templateUrl: "assets/views/yemeksepeti/yemeksepetistatsdetail.html",
                resolve: loadSequence('yemeksepetistatsdetailCtrl'),
                title: 'yemeksepetistatsdetail',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'yemeksepetistatsdetail'
                }
            }).state('app.reports.getirstatsdetail', {
                url: '/getirstatsdetail',
                templateUrl: "assets/views/yemeksepeti/getirstatsdetail.html",
                resolve: loadSequence('getirstatsdetailCtrl'),
                title: 'Aggregator İstatistik Detayı',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'getirstatsdetail'
                }
            }).state('app.callmonitor.callmonitor', {
                url: '/callmonitor',
                templateUrl: "assets/views/callmonitor/callmonitor.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'callmonitorCtrl'),
                title: 'Call Monitor',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Call Monitor'
                }
            }).state('app.callroute', {
                url: '/callroute',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'callroute',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'callroute'
                }
            }).state('app.callroute.callroute', {
                url: '/callroute',
                templateUrl: "assets/views/callmonitor/callroute.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'callrouteCtrl'),
                title: 'callroute',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'callroute'
                }
            }).state('app.staffpayments', {
                url: '/staffpayments',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'staffpayments',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'staffpayments'
                }
            }).state('app.staffpayments.staffpayments', {
                url: '/staffpayments',
                templateUrl: "assets/views/staffpayments/staffpayments.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'staffpaymentsCtrl', 'updateorderpaymenttypeCtrl', 'orderpaymentCtrl', 'changeorderdriverCtrl', 'loginpasswordCtrl'),
                title: 'Staff Payments',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Staff Payments'
                }
            }).state('app.specialoperations.openorders', {
                url: '/openorders',
                templateUrl: "assets/views/specialoperations/openorders.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'openordersCtrl', 'orderpaymentCtrl', 'staffpaymentsCtrl'),
                title: 'Open Orders',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Open Orders'
                }
            }).state('app.dispatcher', {
                url: '/dispatcher',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'dispatcher',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'dispatcher'
                }
            }).state('app.dispatcher.dispatcher', {
                url: '/dispatcher',
                templateUrl: "assets/views/dispatch/dispatcher.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'dispatcherCtrl', 'drivervehicleCtrl', 'driverlistCtrl', 'orderpaymentCtrl'),
                title: 'Dispatcher Display',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Dispatcher Display'
                }
            }).state('app.dispatcher.dispatcherList', {
                url: '/dispatcherList',
                templateUrl: "assets/views/dispatch/dispatcherList.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'dispatcherCtrl', 'drivervehicleCtrl', 'driverlistCtrl'),
                title: 'DispatcherList Display',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'DispatcherList Display'
                }
            }).state('app.dispatcher.dispatcherFirst', {
                url: '/dispatcherFirst',
                templateUrl: "assets/views/dispatch/dispatcherFirst.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'dispatcherCtrl', 'drivervehicleCtrl', 'driverlistCtrl'),
                title: 'DispatcherFirst Display',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'DispatcherFirst Display'
                }
            }).state('app.specialoperations', {
                url: '/specialoperations',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'specialoperations',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'specialoperations'
                }
            }).state('app.specialoperations.endofday', {
                url: '/endofday',
                templateUrl: "assets/views/specialoperations/endofday.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'endofdayCtrl'),
                title: 'endofday',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'endofday'
                }
            }).state('app.specialoperations.currentend', {
                url: '/currentend',
                templateUrl: "assets/views/specialoperations/currentend.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'currentendCtrl'),
                title: 'currentend',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'currentend'
                }
            }).state('app.specialoperations.transactionaccounts', {
                url: '/transactionaccounts',
                templateUrl: "assets/views/specialoperations/transactionaccounts.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'transactionaccountsCtrl', 'dateCtrl'),
                title: 'transactionaccounts',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'transactionaccounts'
                }
            }).state('app.specialoperations.declaredrevenue', {
                url: '/declaredrevenue',
                templateUrl: "assets/views/specialoperations/declaredrevenuelist.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'declaredrevenuelistCtrl', 'dateCtrl'),
                title: 'declaredrevenuelist',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'declaredrevenuelist'
                }
            }).state('app.specialoperations.declaredrevenueedit', {
                url: '/declaredrevenueedit/:id',
                templateUrl: "assets/views/specialoperations/declaredrevenueedit.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'declaredrevenueeditCtrl', 'dateCtrl'),
                title: 'declaredrevenueedit',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'declaredrevenueedit'
                }
            }).state('app.specialoperations.storesalestarget', {
                url: '/storesalestarget',
                templateUrl: "assets/views/specialoperations/storesalestarget.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'storesalestargetCtrl'),
                title: 'storesalestarget',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'storesalestarget'
                }
            }).state('app.specialoperations.indeximport', {
                url: '/indeximport',
                templateUrl: "assets/views/specialoperations/indeximport.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'indeximportCtrl'),
                title: 'indeximport',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'indeximport'
                }
            }).state('app.specialoperations.declaredrevenueelist', {
                url: '/declaredrevenueelist',
                templateUrl: "assets/views/specialoperations/declaredrevenueelist.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'declaredrevenueelistCtrl', 'dateCtrl'),
                title: 'declaredrevenueelist',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'declaredrevenueelist'
                }
            }).state('app.specialoperations.storebudget', {
                url: '/storebudget',
                templateUrl: "assets/views/specialoperations/storebudget.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'storebudgetCtrl'),
                title: 'storebudget',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'storebudget'
                }
            }).state('app.specialoperations.storestaffshift', {
                url: '/storestaffshift',
                templateUrl: "assets/views/specialoperations/storestaffshift.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'storestaffshiftCtrl', 'dateCtrl'),
                title: 'storestaffshift',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'storestaffshift'
                }
            }).state('app.specialoperations.storestaffshiftedit', {
                url: '/storestaffshiftedit/:id',
                templateUrl: "assets/views/specialoperations/storestaffshiftedit.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'storestaffshifteditCtrl', 'dateCtrl'),
                title: 'storestaffshiftedit',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'storestaffshiftedit'
                }

            }).state('app.specialoperations.shiftplan', {
                url: '/shiftplan',
                templateUrl: "assets/views/specialoperations/shiftplan.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'shiftplanCtrl', 'dateCtrl'),
                title: 'shiftplan',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'shiftplan'
                }
            }).state('app.specialoperations.shiftplan2', {
                url: '/shiftplan2',
                templateUrl: "assets/views/specialoperations/shiftplan2.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'shiftplan2Ctrl', 'dateCtrl'),
                title: 'shiftplan2',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'shiftplan2'
                }
            }).state('app.specialoperations.shiftplanedit', {
                url: '/shiftplanedit/:id',
                templateUrl: "assets/views/specialoperations/shiftplanitem.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'shiftplaneditCtrl', 'dateCtrl'),
                title: 'shiftplanedit',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'shiftplanedit'
                }
            }).state('app.specialoperations.shiftplanedit2', {
                url: '/shiftplanedit2/:id',
                templateUrl: "assets/views/specialoperations/shiftplanedit2.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'shiftplanedit2Ctrl', 'dateCtrl'),
                title: 'shiftplanedit2',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'shiftplanedit2'
                }
            }).
            state('app.specialoperations.staffpermitts', {
                url: '/staffpermitts/:id',
                templateUrl: "assets/views/specialoperations/staffpermitts.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'staffpermittsCtrl', 'dateCtrl'),
                title: 'staffpermitts',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'staffpermitts'
                }
            }).
            state('app.specialoperations.hourlywages', {
                url: '/hourlywages',
                templateUrl: "assets/views/specialoperations/hourlywages.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'hourlywagesCtrl', 'dateCtrl'),
                title: 'hourlywages',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'hourlywages'
                }
            }).state('app.specialoperations.shiftplanactual', {
                url: '/shiftplanactual',
                templateUrl: "assets/views/specialoperations/shiftplanactual.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'shiftplanactualCtrl', 'dateCtrl'),
                title: 'shiftplanactual',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'shiftplanactual'
                }
            }).state('app.specialoperations.shiftplanactualedit', {
                url: '/shiftplanactualedit/:id',
                templateUrl: "assets/views/specialoperations/shiftplanactualitem.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'shiftplanactualeditCtrl', 'dateCtrl'),
                title: 'shiftplanactualedit',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'shiftplanactualedit'
                }
            }).state('app.staffshiftplan', {
                url: '/staffshiftplan',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'staffshiftplan',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'staffshiftplan'
                }
            }).state('app.tempaddresses', {
                url: '/tempaddresses',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'tempaddresses',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'tempaddresses'
                }
            }).state('app.orderinvoice', {
                url: '/orderinvoice',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'orderinvoice',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'orderinvoice'
                }
            }).state('app.orderinvoice.orderinvoicelist', {
                url: '/orderinvoicelist',
                templateUrl: "assets/views/orderinvoice/orderinvoicelist.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'orderinvoicelistCtrl'),
                title: 'Order Invoice List',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Order Invoice List'
                }
            }).state('app.tempaddresses.tempaddresses', {
                url: '/tempaddresses',
                templateUrl: "assets/views/person/tempaddress.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'tempaddressCtrl'),
                title: 'tempaddresses',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'tempaddresses'
                }
            }).state('app.definitions', {
                url: '/definitions',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'Definitions',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Definitions'
                }
            }).state('app.definitions.tagdefinitions', {
                url: '/tags',
                templateUrl: "assets/views/definitions/tag.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'tagCtrl', 'TagModalCtrl'),
                title: 'tags',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'tags'
                }

            }).state('app.definitions.orderreasons', {
                url: '/orderreasons',
                templateUrl: "assets/views/definitions/orderreasons.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'orderreasonsCtrl'),
                title: 'Order Reasons',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Order Reasons'
                }
            }).state('app.definitions.complaintactionresults', {
                url: '/complaintactionresults',
                templateUrl: "assets/views/definitions/complaintactionresults.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'complaintactionresultsCtrl'),
                title: 'Complaint Actions Result',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Complaint Actions Results'
                }
            }).state('app.definitions.grids', {
                url: '/grid',
                templateUrl: "assets/views/definitions/grid.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'gridCtrl'),
                title: 'Grid',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Grid'
                }
            }).state('app.definitions.brand', {
                url: '/brands',
                templateUrl: "assets/views/definitions/brand.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'brandCtrl'),
                title: 'brands',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'brands'
                }
            }).state('app.definitions.baseunits', {
                url: '/baseunits',
                templateUrl: "assets/views/definitions/baseunits.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'baseunitsCtrl'),
                title: 'baseunits',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'baseunits'
                }
            }).state('app.definitions.ingredients', {
                url: '/ingredients',
                templateUrl: "assets/views/definitions/ingredients.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'ingredientsCtrl'),
                title: 'ingredients',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'ingredients'
                }
            }).state('app.definitions.translateitem', {
                url: '/translateitem',
                templateUrl: "assets/views/definitions/translateitem.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'translateitemCtrl'),
                title: 'translateitem',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'translateitem'
                }
            }).state('app.definitions.members', {
                url: '/members',
                templateUrl: "assets/views/definitions/member.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'memberCtrl'),
                title: 'members',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'members'
                }
            }).state('app.definitions.paymenttypes', {
                url: '/paymenttypes',
                templateUrl: "assets/views/definitions/paymenttypes.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'TagModalCtrl', 'paymenttypesCtrl'),
                title: 'paymenttypes',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'paymenttypes'
                }
            }).state('app.definitions.vehicle', {
                url: '/vehicle',
                templateUrl: "assets/views/definitions/vehicle.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'vehicleCtrl', 'dateCtrl'),
                title: 'Vehicle',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Vehicle'
                }
            }).state('app.definitions.companies', {
                url: '/companies',
                templateUrl: "assets/views/definitions/companylist.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'companylistCtrl'),
                title: 'companies',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'companies'
                }
            }).state('app.definitions.companyedit', {
                url: '/companyedit/:id',
                templateUrl: "assets/views/definitions/companyedit.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'companyeditCtrl'),
                title: 'companyedit',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'companyedit'
                }
            }).state('app.definitions.repositories', {
                url: '/repository',
                templateUrl: "assets/views/definitions/repository.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'repositoryCtrl'),
                title: 'Repository',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Repository'
                }
            }).state('app.definitions.period', {
                url: '/period',
                templateUrl: "assets/views/definitions/period.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'periodCtrl', 'dateCtrl'),
                title: 'Period',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Period'
                }
            }).state('app.definitions.departments', {
                url: '/departments',
                templateUrl: "assets/views/definitions/departments.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'departmentsCtrl'),
                title: 'departments',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'departments'
                }
            }).state('app.definitions.productionpoints', {
                url: '/productionpoints',
                templateUrl: "assets/views/definitions/productionpoints.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'productionpointsCtrl'),
                title: 'productionpoints',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'productionpoints'
                }
            }).state('app.definitions.taghierarchy', {
                url: '/taghierarchy',
                templateUrl: "assets/views/definitions/taghierarchy.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'jquery-nestable-plugin', 'ng-nestable', 'ngTable', 'taghierarchyCtrl'),
                title: 'taghierarchy',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'taghierarchy'
                }
            }).state('app.definitions.preference', {
                url: '/preference',
                templateUrl: "assets/views/definitions/preference.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'preferenceCtrl'),
                title: 'preference',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'preference'
                }
            }).state('app.definitions.pbxextensions', {
                url: '/pbxextensions',
                templateUrl: "assets/views/definitions/pbxextensions.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'pbxextensionsCtrl'),
                title: 'pbxextensions',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'pbxextensions'
                }
            }).state('app.definitions.preferences', {
                url: '/preferences',
                templateUrl: "assets/views/definitions/preferences.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'preferencesCtrl'),
                title: 'preferences',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'preferences'
                }
            }).state('app.definitions.nguserrestrictiondef', {
                url: '/nguserrestrictiondef',
                templateUrl: "assets/views/definitions/nguserrestrictiondef.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'nguserrestrictiondefCtrl'),
                title: 'User Restriction',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'User Restriction'
                }
            }).state('app.definitions.nguserrolerestriction', {
                url: '/nguserrolerestriction',
                templateUrl: "assets/views/definitions/nguserrolerestriction.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'nguserrolerestrictionCtrl'),
                title: 'User Role Restriction',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'User Role Restriction'
                }
            }).state('app.definitions.usertransfer', {
                url: '/usertransfer',
                templateUrl: "assets/views/definitions/usertransfer.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'usertransferCtrl'),
                title: 'User Transfer',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'User Transfer'
                }
            }).state('app.definitions.nguserrestriction', {
                url: '/nguserrestriction',
                templateUrl: "assets/views/definitions/nguserrestriction.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'nguserrestrictionCtrl'),
                title: 'User Role Restriction',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'User Role Restriction'
                }
            }).state('app.definitions.nguserrole', {
                url: '/nguserrole',
                templateUrl: "assets/views/definitions/nguserrole.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'nguserroleCtrl'),
                title: 'User Role',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'User Role'
                }
            }).state('app.definitions.ordersource', {
                url: '/ordersource',
                templateUrl: "assets/views/definitions/ordersource.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'ordersourceCtrl'),
                title: 'ordersource',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'ordersource'
                }
            }).state('app.definitions.complaintreactions', {
                url: '/complaintreactions',
                templateUrl: "assets/views/definitions/complaintreactions.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'complaintreactionsCtrl'),
                title: 'complaintreactions',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'complaintreactions'
                }
            }).state('app.definitions.complaintsubjects', {
                url: '/complaintsubjects',
                templateUrl: "assets/views/definitions/complaintsubjects.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'complaintsubjectsCtrl'),
                title: 'Complaint Subjects',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Complaint Subjects'
                }
            }).state('app.definitions.CashDrawerOpenReasons', {
                url: '/CashDrawerOpenReasons',
                templateUrl: "assets/views/definitions/CashDrawerOpenReasons.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'CashDrawerOpenReasonsCtrl'),
                title: 'Cash Drawer Open Reasons',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Cash Drawer Open Reasons'
                }
            }).state('app.definitions.complaintsourcies', {
                url: '/complaintsourcies',
                templateUrl: "assets/views/definitions/complaintsourcies.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'complaintsourciesCtrl'),
                title: 'Complaint Sourcies',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Complaint Sourcies'
                }
            }).state('app.definitions.complaintrelation', {
                url: '/complaintrelation',
                templateUrl: "assets/views/definitions/complaintrelation.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'complaintrelationCtrl'),
                title: 'Complaint Relation',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Complaint Relation'
                }
            }).state('app.definitions.callreasons', {
                url: '/callreasons',
                templateUrl: "assets/views/definitions/callreasons.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'callreasonsCtrl'),
                title: 'Call Reasons',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Call Reasons'
                }
            }).state('app.definitions.auditmedia', {
                url: '/auditmedia',
                templateUrl: "assets/views/definitions/auditmedia.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'auditmediaCtrl'),
                title: 'Audit Media',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Audit Media'
                }
            }).state('app.definitions.auditmediaoutputtemplates', {
                url: '/auditmediaoutputtemplates',
                templateUrl: "assets/views/definitions/auditmediaoutputtemplates.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'auditmediaoutputtemplatesCtrl'),
                title: 'Audit Media Output Templates',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Audit Media Output Templates'
                }
            }).state('app.definitions.ECRs', {
                url: '/ECRs',
                templateUrl: "assets/views/definitions/ECRs.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'ECRsCtrl'),
                title: 'ECRs',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'ECRs'
                }
            }).state('app.definitions.reports', {
                url: '/reports',
                templateUrl: "assets/views/definitions/reports.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'reportsCtrl'),
                title: 'ReportsDefinition',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'ReportsDefinition'
                }
            }).state('app.definitions.accounttransactiongroup', {
                url: '/accounttransactiongroup',
                templateUrl: "assets/views/definitions/accounttransactiongroup.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'accounttransactiongroupCtrl', 'TagModalCtrl'),
                title: 'accounttransactiongroup',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'accounttransactiongroup'
                }
            }).state('app.definitions.predefinednote', {
                url: '/predefinednote',
                templateUrl: "assets/views/definitions/predefinednote.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'predefinednoteCtrl'),
                title: 'predefinednote',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'predefinednote'
                }
            }).state('app.definitions.surveyresults', {
                url: '/surveyresults',
                templateUrl: "assets/views/definitions/surveyresults.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'surveyresultsCtrl'),
                title: 'surveyresults',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'surveyresults'
                }
            }).state('app.definitions.yemeksepetirejectreason', {
                url: '/yemeksepetirejectreason',
                templateUrl: "assets/views/definitions/yemeksepetirejectreason.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'yemeksepetirejectreasonCtrl'),
                title: 'yemeksepetirejectreason',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'yemeksepetirejectreason'
                }
            }).state('app.definitions.ngsettingitem', {
                url: '/ngsettingitem',
                templateUrl: "assets/views/definitions/ngsettingitem.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'ngsettingitemCtrl'),
                title: 'ngsettingitem',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'ngsettingitem'
                }
            }).state('app.definitions.settingitem', {
                url: '/settingitem',
                templateUrl: "assets/views/definitions/settingitem.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'settingitemCtrl', 'dateCtrl'),
                title: 'settingitem',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'settingitem'
                }
            }).state('app.definitions.accounttools', {
                url: '/accounttools',
                templateUrl: "assets/views/definitions/accounttools.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'accounttoolsCtrl', 'dateCtrl'),
                title: 'accounttools',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'accounttools'
                }
            }).state('app.definitions.stafftypes', {
                url: '/stafftypes',
                templateUrl: "assets/views/definitions/stafftype.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'stafftypeCtrl'),
                title: 'stafftypes',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'stafftypes'
                }
            }).state('app.definitions.staffshift', {
                url: '/staffshift',
                templateUrl: "assets/views/definitions/staffshift.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'staffshiftCtrl'),
                title: 'staffshift',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'staffshift'
                }
            }).state('app.definitions.verifonemerchant', {
                url: '/verifonemerchant',
                templateUrl: "assets/views/definitions/verifonemerchant.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'verifonemerchantCtrl'),
                title: 'verifonemerchant',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'verifonemerchant'
                }
            }).state('app.definitions.quitreason', {
                url: '/quitreason',
                templateUrl: "assets/views/definitions/quitreason.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'quitreasonCtrl'),
                title: 'quitreason',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'quitreason'
                }
            }).state('app.definitions.staffposition', {
                url: '/staffposition',
                templateUrl: "assets/views/definitions/staffposition.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'staffpositionCtrl'),
                title: 'staffposition',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'staffposition'
                }
            }).state('app.definitions.training', {
                url: '/training',
                templateUrl: "assets/views/definitions/training.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'trainingCtrl'),
                title: 'training',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'training'
                }
            }).state('app.definitions.staffofftype', {
                url: '/staffofftype',
                templateUrl: "assets/views/definitions/staffofftype.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'staffofftypeCtrl'),
                title: 'staffofftype',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'staffofftype'
                }
            }).state('app.definitions.laborcosttype', {
                url: '/laborcosttype',
                templateUrl: "assets/views/definitions/laborcosttype.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'laborcosttypeCtrl'),
                title: 'laborcosttype',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'laborcosttype'
                }
            }).state('app.definitions.logosettings', {
                url: '/logosettings',
                templateUrl: "assets/views/definitions/logosettings.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'logosettingsCtrl'),
                title: 'logosettings',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'logosettings'
                }
            }).state('app.definitions.positioncapacity', {
                url: '/positioncapacity',
                templateUrl: "assets/views/definitions/positioncapacity.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'positioncapacityCtrl'),
                title: 'positioncapacity',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'positioncapacity'
                }
            }).state('app.definitions.automaticreport', {
                url: '/automaticreport',
                templateUrl: "assets/views/definitions/automaticreport.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'automaticreportCtrl'),
                title: 'automaticreport',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'automaticreport'
                }
            }).state('app.matching', {
                url: '/matching',
                template: '<div ui-view class="fade-in-up"></div>',
            }).state('app.matching.inventorypricematching', {
                url: '/inventorypricematching',
                templateUrl: "assets/views/matching/inventorypricematching.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'inventorypricematchingCtrl'),
                title: 'Inventory Unit Matching',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Inventory Unit Matching'
                }
            }).state('app.matching.storematching', {
                url: '/matching',
                templateUrl: "assets/views/matching/storematching.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'storematchingCtrl', 'dateCtrl'),
                title: 'matching',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'matching'
                }
            }).state('app.matching.productropAndRopng', {
                url: '/ropAndRopng',
                templateUrl: "assets/views/matching/ropAndRopng.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'ropAndRopngCtrl'),
                title: 'Rop and Ropng',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Rop and Ropng'
                }
            }).state('app.matching.productitemmatching', {
                url: '/productitemmatching',
                templateUrl: "assets/views/matching/productitemmatching.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'productitemmatchingCtrl'),
                title: 'Product Item Matching',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Product Item Matching'
                }
            }).state('app.matching.inventoryunitmatching', {
                url: '/inventoryunitmatching',
                templateUrl: "assets/views/matching/inventoryunitmatching.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'inventoryunitmatchingCtrl'),
                title: 'inventoryunitmatching',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'inventoryunitmatching'
                }
            }).state('app.matching.paymentmaching', {
                url: '/paymentmaching',
                templateUrl: "assets/views/matching/paymentmaching.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'paymentmachingCtrl'),
                title: 'Payment Maching',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Payment Maching'
                }
            }).state('app.schedule.scheduletypes', {
                url: '/scheduletypes',
                template: '<div ui-view class="fade-in-up"></div>',
            }).state('app.schedule.scheduletypes.list', {
                url: '/list',
                templateUrl: "assets/views/schedule/scheduletypelist.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'scheduletypelistCtrl'),
                title: 'scheduletypes',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'scheduletypes'
                }
            }).state('app.schedule.scheduletypes.edit', {
                url: '/edit/:id',
                templateUrl: "assets/views/schedule/scheduletype.edit.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'scheduletypeeditCtrl', 'ngTable', 'ui.select', 'dateCtrl'),
                title: 'scheduletypeitem Edit',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'scheduletypeitem Edit'
                }
            }).state('app.complaints', {
                url: '/complaints',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'complaints',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'complaints'
                }
            }).state('app.complaints.complaints', {
                url: '/complaints',
                template: '<div ui-view class="fade-in-up"></div>',
            }).state('app.complaints.complaints.list', {
                url: '/list',
                templateUrl: "assets/views/complaints/complaint.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'complaintsCtrl'),
                title: 'complaints',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'complaints'
                }
            }).state('app.complaints.complaints.edit', {
                url: '/edit/:id',
                templateUrl: "assets/views/complaints/complaintedit.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'complainteditCtrl', 'ngTable', 'ui.select', 'dateCtrl'),
                title: 'Complaints Edit',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Complaints Edit'
                }
            }).state('app.complaints.complaints.add', {
                url: '/add/:id',
                templateUrl: "assets/views/complaints/complaintadd.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'complainteditCtrl', 'ngTable', 'ui.select', 'dateCtrl'),
                title: 'Complaints Add',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Complaints Add'
                }
            }).state('app.complaints.complaintaudits', {
                url: '/complaintaudits',
                templateUrl: "assets/views/complaints/complaintaudits.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'complaintauditsCtrl'),
                title: 'Complaint Audits',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Complaint Audits'
                }
            }).state('app.complaints.complaintactions', {
                url: '/complaintactions',
                templateUrl: "assets/views/complaints/complaintactions.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'complaintactionsCtrl'),
                title: 'Complaint Actions',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Complaint Actions'
                }
            }).state('app.complaints.mail', {
                url: '/mail',
                templateUrl: "assets/views/complaints/mail.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'complaintMailCtrl'),
                title: 'Complaint Mail',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Complaint Mail'
                }
            }).state('app.help', {
                url: '/help',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'help',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'help'
                }
            }).state('app.help.videos', {
                url: '/videos',
                templateUrl: "assets/views/help/videos.html",
                resolve: loadSequence('underscore', 'videosCtrl'),
                title: 'videos',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'videos'
                }
            }).state('app.help.documents', {
                url: '/documents',
                templateUrl: "assets/views/help/documents.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'documents',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'documents'
                }
            }).state('app.help.docCariEkrani', {
                url: '/docCariEkrani',
                templateUrl: "assets/views/help/docCariEkrani.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docCariEkrani',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docCariEkrani'
                }
            }).state('app.help.docAnaEkran', {
                url: '/docAnaEkran',
                templateUrl: "assets/views/help/docAnaEkran.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docAnaEkran',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docAnaEkran'
                }
            }).state('app.help.docSifreDegisimi', {
                url: '/docSifreDegisimi',
                templateUrl: "assets/views/help/docSifreDegisimi.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docSifreDegisimi',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docSifreDegisimi'
                }
            }).state('app.help.docKokpit', {
                url: '/docKokpit',
                templateUrl: "assets/views/help/docKokpit.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docKokpit',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docKokpit'
                }
            }).state('app.help.docHesapIsl', {
                url: '/docHesapIsl',
                templateUrl: "assets/views/help/docHesapIsl.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docHesapIsl',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docHesapIsl'
                }
            }).state('app.help.docMasaPlaniDuz', {
                url: '/docMasaPlaniDuz',
                templateUrl: "assets/views/help/docMasaPlaniDuz.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docMasaPlaniDuz',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docMasaPlaniDuz'
                }
            }).state('app.help.docSikayetler', {
                url: '/docSikayetler',
                templateUrl: "assets/views/help/docSikayetler.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docSikayetler',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docSikayetler'
                }
            }).state('app.help.docSikayetEkleDuz', {
                url: '/docSikayetEkleDuz',
                templateUrl: "assets/views/help/docSikayetEkleDuz.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docSikayetEkleDuz',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docSikayetEkleDuz'
                }
            }).state('app.help.docKapanisIslemleri', {
                url: '/docKapanisIslemleri',
                templateUrl: "assets/views/help/docKapanisIslemleri.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docKapanisIslemleri',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docKapanisIslemleri'
                }
            }).state('app.help.docCariHesOlus', {
                url: '/docCariHesOlus',
                templateUrl: "assets/views/help/docCariHesOlus.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docCariHesOlus',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docCariHesOlus'
                }
            }).state('app.help.docKasaRaporu', {
                url: '/docKasaRaporu',
                templateUrl: "assets/views/help/docKasaRaporu.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docKasaRaporu',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docKasaRaporu'
                }
            }).state('app.help.docCCSubeAyarlari', {
                url: '/docCCSubeAyarlari',
                templateUrl: "assets/views/help/docCCSubeAyarlari.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docCCSubeAyarlari',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docCCSubeAyarlari'
                }
            }).state('app.help.docGunSonuIslemi', {
                url: '/docGunSonuIslemi',
                templateUrl: "assets/views/help/docGunSonuIslemi.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docGunSonuIslemi',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docGunSonuIslemi'
                }
            }).state('app.help.docKasaGirisCikis', {
                url: '/docKasaGirisCikis',
                templateUrl: "assets/views/help/docKasaGirisCikis.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docKasaGirisCikis',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docKasaGirisCikis'
                }
            }).state('app.help.docMutfakEkrani', {
                url: '/docMutfakEkrani',
                templateUrl: "assets/views/help/docMutfakEkrani.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docMutfakEkrani',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docMutfakEkrani'
                }
            }).state('app.help.docPersonelAdisEkr', {
                url: '/docPersonelAdisEkr',
                templateUrl: "assets/views/help/docPersonelAdisEkr.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docPersonelAdisEkr',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docPersonelAdisEkr'
                }
            }).state('app.help.docSiparisEkranlari', {
                url: '/docSiparisEkranlari',
                templateUrl: "assets/views/help/docSiparisEkranlari.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docSiparisEkranlari',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docSiparisEkranlari'
                }
            }).state('app.help.docSiparisListesi', {
                url: '/docSiparisListesi',
                templateUrl: "assets/views/help/docSiparisListesi.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docSiparisListesi',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docSiparisListesi'
                }
            }).state('app.help.docSiparisYonetimi', {
                url: '/docSiparisYonetimi',
                templateUrl: "assets/views/help/docSiparisYonetimi.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docSiparisYonetimi',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docSiparisYonetimi'
                }

            }).state('app.help.reportDocuments', {
                url: '/reportDocuments',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'reportDocuments',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'reportDocuments'
                }
            }).state('app.help.reportDocuments.docKasaRap', {
                url: '/docKasaRap',
                templateUrl: "assets/views/help/reportDocuments/docKasaRaporu.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docKasaRap',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docKasaRap'
                }
            }).state('app.help.reportDocuments.docBakLis', {
                url: '/docBakLis',
                templateUrl: "assets/views/help/reportDocuments/docBakLis.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docBakLis',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docBakLis'
                }
            }).state('app.help.reportDocuments.docGercOdem', {
                url: '/docGercOdem',
                templateUrl: "assets/views/help/reportDocuments/docGercOdem.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docGercOdem',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docGercOdem'
                }
            }).state('app.help.reportDocuments.docGerHesBakLis', {
                url: '/docGerHesBakLis',
                templateUrl: "assets/views/help/reportDocuments/docGerHesBakLis.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docGerHesBakLis',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docGerHesBakLis'
                }
            }).state('app.help.reportDocuments.docGunGoreCiro', {
                url: '/docGunGoreCiro',
                templateUrl: "assets/views/help/reportDocuments/docGunGoreCiro.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docGunGoreCiro',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docGunGoreCiro'
                }
            }).state('app.help.reportDocuments.docGunlukUrunSatLis', {
                url: '/docGunlukUrunSatLis',
                templateUrl: "assets/views/help/reportDocuments/docGunlukUrunSatList.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docGunlukUrunSatLis',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docGunlukUrunSatLis'
                }
            }).state('app.help.reportDocuments.docKasaIcmal', {
                url: '/docKasaIcmal',
                templateUrl: "assets/views/help/reportDocuments/docKasaIcmal.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docKasaIcmal',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docKasaIcmal'
                }
            }).state('app.help.reportDocuments.docKulMalzRap', {
                url: '/docKulMalzRap',
                templateUrl: "assets/views/help/reportDocuments/docKulMalzRap.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docKulMalzRap',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docKulMalzRap'
                }
            }).state('app.help.reportDocuments.docMalHarRap', {
                url: '/docMalHarRap',
                templateUrl: "assets/views/help/reportDocuments/docMalzemeHareket.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docMalHarRap',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docMalHarRap'
                }
            }).state('app.help.reportDocuments.docGercMalRap', {
                url: '/docGercMalRapdocGercMalRap',
                templateUrl: "assets/views/help/reportDocuments/docGerceklesenMal.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docGercMalRap',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docGercMalRap'
                }
            }).state('app.help.reportDocuments.docMenuSatGeliri', {
                url: '/docMenuSatGeliri',
                templateUrl: "assets/views/help/reportDocuments/docMenuSatGeliri.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docMenuSatGeliri',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docMenuSatGeliri'
                }
            }).state('app.help.reportDocuments.docMenuUrunSat', {
                url: '/docMenuUrunSat',
                templateUrl: "assets/views/help/reportDocuments/docMenuUrunSat.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docMenuUrunSat',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docMenuUrunSat'
                }
            }).state('app.help.reportDocuments.docSipList', {
                url: '/docSipList',
                templateUrl: "assets/views/help/reportDocuments/docSipList.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docSipList',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docSipList'
                }
            }).state('app.help.reportDocuments.docSipPerf', {
                url: '/docSipPerf',
                templateUrl: "assets/views/help/reportDocuments/docSipPerf.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docSipPerf',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docSipPerf'
                }
            }).state('app.help.reportDocuments.docSipSurucuLis', {
                url: '/docSipSurucuLis',
                templateUrl: "assets/views/help/reportDocuments/docSipSurucuLis.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docSipSurucuLis',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docSipSurucuLis'
                }
            }).state('app.help.reportDocuments.docUreKont', {
                url: '/docUreKont',
                templateUrl: "assets/views/help/reportDocuments/docUreKont.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docUreKont',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docUreKont'
                }
            }).state('app.help.reportDocuments.docYeniKayitMust', {
                url: '/docYeniKayitMust',
                templateUrl: "assets/views/help/reportDocuments/docYeniKayMust.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docYeniKayitMust',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docYeniKayitMust'
                }
            }).state('app.help.reportDocuments.docBolgeAnaliziRap', {
                url: '/docBolgeAnaliziRap',
                templateUrl: "assets/views/help/reportDocuments/docBolgeAnaliziRap.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docBolgeAnaliziRap',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docBolgeAnaliziRap'
                }
            }).state('app.help.reportDocuments.docGunGoreUrSat', {
                url: '/docGunGoreUrSat',
                templateUrl: "assets/views/help/reportDocuments/docGunGoreUrSat.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docGunGoreUrSat',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docGunGoreUrSat'
                }
            }).state('app.help.reportDocuments.docUrunMaliyet', {
                url: '/docUrunMaliyet',
                templateUrl: "assets/views/help/reportDocuments/docUrunMaliyet.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docUrunMaliyet',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docUrunMaliyet'
                }
            }).state('app.help.reportDocuments.docOdeTipGorSip', {
                url: '/docOdeTipGorSip',
                templateUrl: "assets/views/help/reportDocuments/docOdeTipGorSip.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docOdeTipGorSip',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docOdeTipGorSip'
                }
            }).state('app.help.reportDocuments.docSipLogRap', {
                url: '/docSipLogRap',
                templateUrl: "assets/views/help/reportDocuments/docSipLogRap.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docSipLogRap',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docSipLogRap'
                }
            }).state('app.help.reportDocuments.docReturnLisAdet', {
                url: '/docReturnLisAdet',
                templateUrl: "assets/views/help/reportDocuments/docReturnLisAdet.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docReturnLisAdet',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docReturnLisAdet'
                }
            }).state('app.help.reportDocuments.docReturnLisDetay', {
                url: '/docReturnLisDetay',
                templateUrl: "assets/views/help/reportDocuments/docReturnLisDetay.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docReturnLisDetay',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docReturnLisDetay'
                }
            }).state('app.help.reportDocuments.docSilinenSipKal', {
                url: '/docSilinenSipKal',
                templateUrl: "assets/views/help/reportDocuments/docSilinenSipKal.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docSilinenSipKal',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docSilinenSipKal'
                }
            }).state('app.help.reportDocuments.docSipIndRap', {
                url: '/docSipIndRap',
                templateUrl: "assets/views/help/reportDocuments/docSipIndRap.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docSipIndRap',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docSipIndRap'
                }
            }).state('app.help.reportDocuments.docSipTopRap', {
                url: '/docSipTopRap',
                templateUrl: "assets/views/help/reportDocuments/docSipTopRap.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docSipTopRap',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docSipTopRap'
                }
            }).state('app.help.reportDocuments.docMutPerf', {
                url: '/docMutPerf',
                templateUrl: "assets/views/help/reportDocuments/docMutPerf.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docMutPerf',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docMutPerf'
                }
            }).state('app.help.reportDocuments.docResSatisIstRap', {
                url: '/docResSatisIstRap',
                templateUrl: "assets/views/help/reportDocuments/docResSatisIstRap.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docResSatisIstRap',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docResSatisIstRap'
                }
            }).state('app.help.reportDocuments.docServisBolRap', {
                url: '/docServisBolRap',
                templateUrl: "assets/views/help/reportDocuments/docServisBolRap.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docServisBolRap',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docServisBolRap'
                }
            }).state('app.help.reportDocuments.docTrendRap', {
                url: '/docTrendRap',
                templateUrl: "assets/views/help/reportDocuments/docTrendRap.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docTrendRap',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docTrendRap'
                }
            }).state('app.help.reportDocuments.docCariBorRap', {
                url: '/docCariBorRap',
                templateUrl: "assets/views/help/reportDocuments/docCariBorRap.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docCariBorRap',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docCariBorRap'
                }
            }).state('app.help.reportDocuments.docSipDurTop', {
                url: '/docSipDurTop',
                templateUrl: "assets/views/help/reportDocuments/docSipDurTop.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docSipDurTop',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docSipDurTop'
                }
            }).state('app.help.reportDocuments.docSikayetListRap', {
                url: '/docSikayetListRap',
                templateUrl: "assets/views/help/reportDocuments/docSikayetListRap.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docSikayetListRap',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docSikayetListRap'
                }
            }).state('app.help.reportDocuments.docRestAnaliziRap', {
                url: '/docRestAnaliziRap',
                templateUrl: "assets/views/help/reportDocuments/docRestAnaliziRap.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docRestAnaliziRap',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docRestAnaliziRap'
                }
            }).state('app.help.reportDocuments.docSmsListRap', {
                url: '/docSmsListRap',
                templateUrl: "assets/views/help/reportDocuments/docSmsListRap.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docSmsListRap',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docSmsListRap'
                }
            }).state('app.help.reportDocuments.docGenelSmsListRap', {
                url: '/docGenelSmsListRap',
                templateUrl: "assets/views/help/reportDocuments/docGenelSmsListRap.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docGenelSmsListRap',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docGenelSmsListRap'
                }
            }).state('app.help.reportDocuments.docGercOdemGoreCiro', {
                url: '/docGercOdemGoreCiro',
                templateUrl: "assets/views/help/reportDocuments/docGercOdemGoreCiro.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docGercOdemGoreCiro',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docGercOdemGoreCiro'
                }
            }).state('app.help.reportDocuments.docEnvAtikRap', {
                url: '/docEnvAtikRap',
                templateUrl: "assets/views/help/reportDocuments/docEnvAtikRap.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docEnvAtikRap',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docEnvAtikRap'
                }
            }).state('app.help.reportDocuments.docMalzTukeAnlRap', {
                url: '/docMalzTukeAnlRap',
                templateUrl: "assets/views/help/reportDocuments/docMalzTukeAnlRap.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docMalzTukeAnlRap',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docMalzTukeAnlRap'
                }
            }).state('app.help.reportDocuments.docUrunAtikRap', {
                url: '/docUrunAtikRap',
                templateUrl: "assets/views/help/reportDocuments/docUrunAtikRap.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docUrunAtikRap',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docUrunAtikRap'
                }
            }).state('app.help.reportDocuments.docAktifDonMaliyetRap', {
                url: '/docAktifDonMaliyetRap',
                templateUrl: "assets/views/help/reportDocuments/docAktifDonMaliyetRap.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docAktifDonMaliyetRap',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docAktifDonMaliyetRap'
                }
            }).state('app.help.reportDocuments.docDonemselMaliyetRap', {
                url: '/docDonemselMaliyetRap',
                templateUrl: "assets/views/help/reportDocuments/docDonemselMaliyetRap.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docDonemselMaliyetRap',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docDonemselMaliyetRap'
                }
            }).state('app.help.reportDocuments.docEnvRec', {
                url: '/docEnvRec',
                templateUrl: "assets/views/help/reportDocuments/docEnvRec.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docEnvRec',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docEnvRec'
                }
            }).state('app.help.reportDocuments.docUrunMalList', {
                url: '/docUrunMalList',
                templateUrl: "assets/views/help/reportDocuments/docUrunMalList.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docUrunMalList',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docUrunMalList'
                }
            }).state('app.help.reportDocuments.docSipTipGoreSip', {
                url: '/docSipTipGoreSip',
                templateUrl: "assets/views/help/reportDocuments/docSipTipGoreSip.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docSipTipGoreSip',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docSipTipGoreSip'
                }
            }).state('app.help.reportDocuments.docUrunSatLis', {
                url: '/docUrunSatLis',
                templateUrl: "assets/views/help/reportDocuments/docUrunSatLis.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docUrunSatLis',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docUrunSatLis'
                }
            }).state('app.help.reportDocuments.docKulUrunSatLis', {
                url: '/docKulUrunSatLis',
                templateUrl: "assets/views/help/reportDocuments/docKulUrunSatLis.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docKulUrunSatLis',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docKulUrunSatLis'
                }
            }).state('app.help.reportDocuments.docSipKayGoreSipAd', {
                url: '/docSipKayGoreSipAd',
                templateUrl: "assets/views/help/reportDocuments/docSipKayGoreSipAd.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docSipKayGoreSipAd',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docSipKayGoreSipAd'
                }
            }).state('app.help.reportDocuments.docOdemTipGoreSipTop', {
                url: '/docOdemTipGoreSipTop',
                templateUrl: "assets/views/help/reportDocuments/docOdemTipGoreSipTop.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docOdemTipGoreSipTop',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docOdemTipGoreSipTop'
                }
            }).state('app.help.reportDocuments.docRestLog', {
                url: '/docRestLog',
                templateUrl: "assets/views/help/reportDocuments/docRestLog.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docRestLog',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docRestLog'
                }
            }).state('app.help.reportDocuments.docDonemSonuBakLis', {
                url: '/docDonemSonuBakLis',
                templateUrl: "assets/views/help/reportDocuments/docDonemSonuBakLis.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docDonemSonuBakLis',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docDonemSonuBakLis'
                }
            }).state('app.help.reportDocuments.docMustList', {
                url: '/docMustList',
                templateUrl: "assets/views/help/reportDocuments/docMustList.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docMustList',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docMustList'
                }
            }).state('app.help.reportDocuments.docMustTukRap', {
                url: '/docMustTukRap',
                templateUrl: "assets/views/help/reportDocuments/docMustTukRap.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docMustTukRap',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docMustTukRap'
                }
            }).state('app.help.CCreportDocuments', {
                url: '/CCreportDocuments',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'CCreportDocuments',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'CCreportDocuments'
                }
            }).state('app.help.CCreportDocuments.docAgentSat', {
                url: '/docAgentSat',
                templateUrl: "assets/views/help/CCreportDocuments/docAgentSat.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docAgentSat',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docAgentSat'
                }
            }).state('app.help.CCreportDocuments.docAgentSatIst', {
                url: '/docAgentSatIst',
                templateUrl: "assets/views/help/CCreportDocuments/docAgentSatIst.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docAgentSatIst',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docAgentSatIst'
                }
            }).state('app.help.CCreportDocuments.docGunlukTop', {
                url: '/docGunlukTop',
                templateUrl: "assets/views/help/CCreportDocuments/docGunlukTop.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docGunlukTop',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docGunlukTop'
                }
            }).state('app.help.CCreportDocuments.docRestOdemeDag', {
                url: '/docRestOdemeDag',
                templateUrl: "assets/views/help/CCreportDocuments/docRestOdemDag.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docRestOdemeDag',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docRestOdemeDag'
                }
            }).state('app.help.CCreportDocuments.docSaatlereGoreGunTop', {
                url: '/docSaatlereGoreGunTop',
                templateUrl: "assets/views/help/CCreportDocuments/docSaatlereGoreGunTop.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docSaatlereGoreGunTop',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docSaatlereGoreGunTop'
                }
            }).state('app.help.CCreportDocuments.docSaatlikSip', {
                url: '/docSaatlikSip',
                templateUrl: "assets/views/help/CCreportDocuments/docSaatlikSip.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docSaatlikSip',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docSaatlikSip'
                }
            }).state('app.help.CCreportDocuments.docSaatlikSipLis', {
                url: '/docSaatlikSipLis',
                templateUrl: "assets/views/help/CCreportDocuments/docSaatlikSipLis.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docSaatlikSipLis',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docSaatlikSipLis'
                }
            }).state('app.help.CCreportDocuments.docSipTop', {
                url: '/docSipTop',
                templateUrl: "assets/views/help/CCreportDocuments/docSipTop.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docSipTop',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docSipTop'
                }
            }).state('app.help.CCreportDocuments.docSubeSip', {
                url: '/docSubeSip',
                templateUrl: "assets/views/help/CCreportDocuments/docSubeSip.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docSubeSip',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docSubeSip'
                }
            }).state('app.help.updateLog', {
                url: '/updateLog',
                templateUrl: "assets/views/help/updateLog/updateLog.html",
                resolve: loadSequence('underscore', 'updateLogCtrl'),
                title: 'updateLog',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'updateLog'
                }
            }).state('app.help.updateLogPL', {
                url: '/updateLogPL',
                templateUrl: "assets/views/help/updateLog/updateLogPL.html",
                resolve: loadSequence('underscore', 'updateLogCtrl'),
                title: 'updateLogPL',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'updateLogPL'
                }
            }).state('app.help.updateLogJB', {
                url: '/updateLogJB',
                templateUrl: "assets/views/help/updateLog/updateLogJB.html",
                resolve: loadSequence('underscore', 'updateLogCtrl'),
                title: 'updateLogJB',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'updateLogJB'
                }
            }).state('app.help.updateLogPS', {
                url: '/updateLogPS',
                templateUrl: "assets/views/help/updateLog/updateLogPS.html",
                resolve: loadSequence('underscore', 'updateLogCtrl'),
                title: 'updateLogPS',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'updateLogPS'
                }
            }).state('app.help.GunSonuAlmaAdimlari', {
                url: '/GunSonuAlmaAdimlari',
                templateUrl: "assets/views/help/GunSonuAlmaAdimlari.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'GunSonuAlmaAdimlari',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'GunSonuAlmaAdimlari'
                }
            }).state('app.help.Sistemdesiparisdegisikiğikisitlamalri', {
                url: '/Sistemdesiparisdegisikiğikisitlamalri',
                templateUrl: "assets/views/help/Sistemdesiparisdegisikiğikisitlamalri.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'Sistemdesiparisdegisikiğikisitlamalri',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Sistemdesiparisdegisikiğikisitlamalri'
                }
            }).state('app.help.Poskurumlari', {
                url: '/Poskurumlari',
                templateUrl: "assets/views/help/Poskurumlari.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'Poskurumlari',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Poskurumlari'
                }
            }).state('app.help.YSSiparisleri', {
                url: '/YsSiparisleri',
                templateUrl: "assets/views/help/YsSiparisleri.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'YsSiparisleri',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'YsSiparisleri'
                }
            }).state('app.help.Listeler', {
                url: '/Listeler',
                templateUrl: "assets/views/help/Listeler.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'Listeler',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Listeler'
                }
            }).state('app.help.CCDocuments', {
                url: '/CCDocuments',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'CCDocuments',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'CCDocuments'
                }
            }).state('app.help.CCDocuments.docCmAnaSayfa', {
                url: '/docCmAnaSayfa',
                templateUrl: "assets/views/help/CCDocuments/docCmAnaSayfa.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docCmAnaSayfa',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docCmAnaSayfa'
                }
            }).state('app.help.CCDocuments.docCmSiparisleri', {
                url: '/docCmSiparisleri',
                templateUrl: "assets/views/help/CCDocuments/docCmSiparisleri.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docCmSiparisleri',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docCmSiparisleri'
                }
            }).state('app.help.CCDocuments.docCmCagriEkrani', {
                url: '/docCmCagriEkrani',
                templateUrl: "assets/views/help/CCDocuments/docCmCagriEkrani.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docCmCagriEkrani',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docCmCagriEkrani'
                }
            }).state('app.help.CCDocuments.docCmCagriYonlendirme', {
                url: '/docCmCagriYonlendirme',
                templateUrl: "assets/views/help/CCDocuments/docCmCagriYonlendirme.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docCmCagriYonlendirme',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docCmCagriYonlendirme'
                }
            }).state('app.help.CCDocuments.docCmRestoranlar', {
                url: '/docCmRestoranlar',
                templateUrl: "assets/views/help/CCDocuments/docCmRestoranlar.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docCmRestoranlar',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docCmRestoranlar'
                }
            }).state('app.help.CCDocuments.docCmRestoranNotList', {
                url: '/docCmRestoranNotList',
                templateUrl: "assets/views/help/CCDocuments/docCmRestoranNotList.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docCmRestoranNotList',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docCmRestoranNotList'
                }
            }).state('app.help.CCDocuments.docCmRestoranYonl', {
                url: '/docCmRestoranYonl',
                templateUrl: "assets/views/help/CCDocuments/docCmRestoranYonl.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docCmRestoranYonl',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docCmRestoranYonl'
                }
            }).state('app.help.CCDocuments.docCmAdresler', {
                url: '/docCmAdresler',
                templateUrl: "assets/views/help/CCDocuments/docCmAdresler.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docCmAdresler',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docCmAdresler'
                }
            }).state('app.help.CCDocuments.docCmAdresBirlestirme', {
                url: '/docCmAdresBirlestirme',
                templateUrl: "assets/views/help/CCDocuments/docCmAdresBirlestirme.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docCmAdresBirlestirme',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docCmAdresBirlestirme'
                }
            }).state('app.help.CCDocuments.docCmSikayetYonetimi', {
                url: '/docCmSikayetYonetimi',
                templateUrl: "assets/views/help/CCDocuments/docCmSikayetYonetimi.html",
                resolve: loadSequence('underscore', 'documentsCtrl'),
                title: 'docCmSikayetYonetimi',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'docCmSikayetYonetimi'
                }
            }).state('app.billboard', {
                url: '/billboard',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'billboard',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'billboard'
                }
            }).state('app.billboard.billboarditem', {
                url: '/billboarditem',
                templateUrl: "assets/views/help/billboarditem.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ngTable', 'dateCtrl', 'billboarditemCtrl'),
                title: 'billboarditem',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'billboarditem'
                }
            }).state('app.SMS', {
                url: '/SMS',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'SMS',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'SMS'
                }
            }).state('app.SMS.SMSProvider', {
                url: '/SMSProvider',
                templateUrl: "assets/views/SMS/SMSProvider.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'SMSProviderCtrl'),
                title: 'SMSProvider',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'SMSProvider'
                }
            }).state('app.yemeksepeti', {
                url: '/yemeksepeti',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'yemeksepeti',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'yemeksepeti'
                }
            }).state('app.yemeksepeti.yemeksepetisettings', {
                url: '/yemeksepetisettings',
                templateUrl: "assets/views/yemeksepeti/yemeksepetisettings.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'yemeksepetisettingsCtrl'),
                title: 'yemeksepetisettings',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'yemeksepetisettings'
                }
            }).state('app.yemeksepeti.yemeksepetimerge', {
                url: '/yemeksepetimerge/:id',
                templateUrl: "assets/views/yemeksepeti/yemeksepetimerge.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'yemeksepetimergeCtrl', 'newregisterpersonCtrl', 'addnewaddressCtrl', 'StreetAddressSelectorCtrl'),
                title: 'yemeksepetimerge',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'yemeksepetimerge'
                }
            }).state('app.yemeksepeti.yspaymentmerge', {
                url: '/yspaymentmerge',
                templateUrl: "assets/views/yemeksepeti/yspaymentmerge.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'yspaymentmergeCtrl'),
                title: 'yemeksepetipaymentmerge',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'yemeksepetipaymentmerge'
                }
            }).state('app.yemeksepeti.ysproductmerge', {
                url: '/ysproductmerge',
                templateUrl: "assets/views/yemeksepeti/ysproductmerge.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'ysproductmergeCtrl', 'ui.select'),
                title: 'yemeksepetiproductmerge',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'yemeksepetiproductmerge'
                }
            }).state('app.yemeksepeti.ysstoremerge', {
                url: '/ysstoremerge',
                templateUrl: "assets/views/yemeksepeti/ysstoremerge.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'ysstoremergeCtrl'),
                title: 'yemeksepetistoremerge',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'yemeksepetistoremerge'
                }
            }).state('app.yemeksepeti.yemeksepetireason', {
                url: '/yemeksepetireason',
                templateUrl: "assets/views/yemeksepeti/yemeksepetireason.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'yemeksepetireasonCtrl'),
                title: 'yemeksepeti reason',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'yemeksepeti reason'
                }
            }).state('app.yemeksepeti.ysstoresetting', {
                url: '/ysstoresetting',
                templateUrl: "assets/views/yemeksepeti/ysstoresetting.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'ysstoresettingCtrl'),
                title: 'ysstoresetting',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'ysstoresetting'
                }
                //}).state('app.yemeksepeti.storeysstatusCtrl', {
                //    url: '/storeysstatus',
                //    templateUrl: "assets/views/yemeksepeti/storeysstatus.html",
                //    resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'storeysstatusCtrl'),
                //    title: 'storeysstatus',
                //    authenticate: true,
                //    ncyBreadcrumb: {
                //        label: 'storeysstatus'
                //    }
            }).state('app.settings', {
                url: '/settings',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'settings',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'settings'
                }
            }).state('app.settings.tablePlan', {
                url: '/tablePlan',
                templateUrl: "assets/views/tableplan/tablePlan.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'tablePlanCtrl', 'orderpaymentCtrl', 'ui.select', 'splitaccountCtrl'),
                title: 'Table Plan',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Table Plan'
                }
            }).state('app.settings.tablePlanEdit', {
                url: '/tablePlanEdit',
                templateUrl: "assets/views/tableplan/tablePlanEdit.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'tablePlanEditCtrl', 'ui.select', 'loginpasswordCtrl'),
                title: 'Table Plan Edit',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Table Plan Edit'
                }

            }).state('app.samples', {
                url: "/samples",
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'Samples',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Samples'
                }
            }).state('app.samples.systems', {
                templateUrl: "assets/views/systems.html",
                url: '/systems'
            }).state('app.samples.systems.list', {
                url: '/list',
                templateUrl: "assets/views/systems.list.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'ngTable', 'systemsCtrl'),
                title: 'systems',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'systems'
                }
            }).state('app.samples.systems.edit', {
                url: '/edit/:id',
                templateUrl: "assets/views/systems.edit.html",
                resolve: loadSequence('xeditable', 'config-xeditable', 'systemsCtrl'),
                title: 'Systems Edit',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Systems edit'
                }
            }).state('app.samples.ui', {
                url: '/ui',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'UI Elements',
                ncyBreadcrumb: {
                    label: 'UI Elements'
                }
            }).state('app.samples.ui.elements', {
                url: '/elements',
                templateUrl: "assets/views/ui_elements.html",
                title: 'Elements',
                authenticate: true,
                icon: 'ti-layout-media-left-alt',
                ncyBreadcrumb: {
                    label: 'Elements'
                }
            }).state('app.samples.ui.buttons', {
                url: '/buttons',
                templateUrl: "assets/views/ui_buttons.html",
                title: 'Buttons',
                authenticate: true,
                resolve: loadSequence('spin', 'ladda', 'angular-ladda', 'laddaCtrl'),
                ncyBreadcrumb: {
                    label: 'Buttons'
                }
            }).state('app.samples.ui.links', {
                url: '/links',
                templateUrl: "assets/views/ui_links.html",
                title: 'Link Effects',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Link Effects'
                }
            }).state('app.samples.ui.icons', {
                url: '/icons',
                templateUrl: "assets/views/ui_icons.html",
                title: 'Font Awesome Icons',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Font Awesome Icons'
                },
                resolve: loadSequence('iconsCtrl')
            }).state('app.samples.ui.lineicons', {
                url: '/line-icons',
                templateUrl: "assets/views/ui_line_icons.html",
                title: 'Linear Icons',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Linear Icons'
                },
                resolve: loadSequence('iconsCtrl')
            }).state('app.samples.ui.modals', {
                url: '/modals',
                templateUrl: "assets/views/ui_modals.html",
                title: 'Modals',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Modals'
                },
                resolve: loadSequence('asideCtrl')
            }).state('app.samples.ui.toggle', {
                url: '/toggle',
                templateUrl: "assets/views/ui_toggle.html",
                title: 'Toggle',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Toggle'
                }
            }).state('app.samples.ui.tabs_accordions', {
                url: '/accordions',
                templateUrl: "assets/views/ui_tabs_accordions.html",
                title: "Tabs & Accordions",
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Tabs & Accordions'
                },
                resolve: loadSequence('vAccordionCtrl')
            }).state('app.samples.ui.panels', {
                url: '/panels',
                templateUrl: "assets/views/ui_panels.html",
                title: 'Panels',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Panels'
                }
            }).state('app.samples.ui.notifications', {
                url: '/notifications',
                templateUrl: "assets/views/ui_notifications.html",
                title: 'Notifications',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Notifications'
                },
                resolve: loadSequence('toasterCtrl', 'sweetAlertCtrl')
            }).state('app.samples.ui.treeview', {
                url: '/treeview',
                templateUrl: "assets/views/ui_tree.html",
                title: 'TreeView',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Treeview'
                },
                resolve: loadSequence('angularBootstrapNavTree', 'treeCtrl')
            }).state('app.samples.ui.media', {
                url: '/media',
                templateUrl: "assets/views/ui_media.html",
                title: 'Media',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Media'
                }
            }).state('app.samples.ui.nestable', {
                url: '/nestable2',
                templateUrl: "assets/views/ui_nestable.html",
                title: 'Nestable List',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Nestable List'
                },
                resolve: loadSequence('jquery-nestable-plugin', 'ng-nestable', 'nestableCtrl')
            }).state('app.samples.ui.typography', {
                url: '/typography',
                templateUrl: "assets/views/ui_typography.html",
                title: 'Typography',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Typography'
                }
            }).state('app.samples.table', {
                url: '/table',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'Tables',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Tables'
                }
            }).state('app.samples.table.basic', {
                url: '/basic',
                templateUrl: "assets/views/table_basic.html",
                title: 'Basic Tables',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Basic'
                }
            }).state('app.samples.table.responsive', {
                url: '/responsive',
                templateUrl: "assets/views/table_responsive.html",
                title: 'Responsive Tables',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Responsive'
                }
            }).state('app.samples.table.data', {
                url: '/data',
                templateUrl: "assets/views/table_data.html",
                title: 'ngTable',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'ngTable'
                },
                resolve: loadSequence('ngTable', 'ngTableCtrl')
            }).state('app.samples.table.export', {
                url: '/export',
                templateUrl: "assets/views/table_export.html",
                title: 'Table',
                authenticate: true,
            }).state('app.samples.form', {
                url: '/form',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'Forms',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Forms'
                }
            }).state('app.samples.form.elements', {
                url: '/elements',
                templateUrl: "assets/views/form_elements.html",
                title: 'Forms Elements',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Elements'
                },
                resolve: loadSequence('ui.select', 'ui.mask', 'monospaced.elastic', 'touchspin-plugin', 'angular-bootstrap-touchspin', 'selectCtrl')
            }).state('app.samples.form.xeditable', {
                url: '/xeditable',
                templateUrl: "assets/views/form_xeditable.html",
                title: 'Angular X-Editable',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'X-Editable'
                },
                resolve: loadSequence('xeditable', 'config-xeditable', 'checklist-model', 'xeditableCtrl')
            }).state('app.samples.form.texteditor', {
                url: '/editor',
                templateUrl: "assets/views/form_text_editor.html",
                title: 'Text Editor',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Text Editor'
                },
                resolve: loadSequence('ckeditor-plugin', 'ckeditor', 'ckeditorCtrl')
            }).state('app.samples.form.wizard', {
                url: '/wizard',
                templateUrl: "assets/views/form_wizard.html",
                title: 'Form Wizard',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Wizard'
                },
                resolve: loadSequence('wizardCtrl')
            }).state('app.samples.form.validation', {
                url: '/validation',
                templateUrl: "assets/views/form_validation.html",
                title: 'Form Validation',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Validation'
                },
                resolve: loadSequence('validationCtrl')
            }).state('app.samples.form.cropping', {
                url: '/image-cropping',
                templateUrl: "assets/views/form_image_cropping.html",
                title: 'Image Cropping',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Image Cropping'
                },
                resolve: loadSequence('ngImgCrop', 'cropCtrl')
            }).state('app.samples.form.upload', {
                url: '/file-upload',
                templateUrl: "assets/views/form_file_upload.html",
                title: 'Multiple File Upload',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'File Upload'
                },
                resolve: loadSequence('angularFileUpload', 'uploadCtrl')
            }).state('app.samples.pages', {
                url: '/pages',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'Pages',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Pages'
                }
            }).state('app.samples.pages.user', {
                url: '/user',
                templateUrl: "assets/views/pages_user_profile.html",
                title: 'User Profile',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'User Profile'
                },
                resolve: loadSequence('flow', 'userCtrl')
            }).state('app.samples.pages.invoice', {
                url: '/invoice',
                templateUrl: "assets/views/pages_invoice.html",
                title: 'Invoice',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Invoice'
                }
            }).state('app.samples.pages.timeline', {
                url: '/timeline',
                templateUrl: "assets/views/pages_timeline.html",
                title: 'Timeline',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Timeline'
                },
                resolve: loadSequence('ngMap')
            }).state('app.samples.pages.calendar', {
                url: '/calendar',
                templateUrl: "assets/views/pages_calendar.html",
                title: 'Calendar',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Calendar'
                },
                resolve: loadSequence('moment', 'mwl.calendar', 'calendarCtrl')
            }).state('app.samples.pages.messages', {
                url: '/messages',
                templateUrl: "assets/views/pages_messages.html",
                authenticate: true,
                resolve: loadSequence('truncate', 'htmlToPlaintext', 'inboxCtrl')
            }).state('app.samples.pages.messages.inbox', {
                url: '/inbox/:inboxID',
                authenticate: true,
                templateUrl: "assets/views/pages_inbox.html",
                controller: 'ViewMessageCrtl'
            }).state('app.samples.pages.blank', {
                url: '/blank',
                templateUrl: "assets/views/pages_blank_page.html",
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Starter Page'
                }
            }).state('app.utilities', {
                url: '/utilities',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'Utilities',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Utilities'
                }
            }).state('app.utilities.search', {
                url: '/search',
                templateUrl: "assets/views/utility_search_result.html",
                title: 'Search Results',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Search Results'
                }
            }).state('app.samples.utilities.pricing', {
                url: '/pricing',
                templateUrl: "assets/views/utility_pricing_table.html",
                title: 'Pricing Table',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Pricing Table'
                }
            }).state('app.samples.maps', {
                url: "/maps",
                templateUrl: "assets/views/maps.html",
                resolve: loadSequence('ngMap', 'mapsCtrl'),
                title: "Maps",
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Maps'
                }
            }).state('app.samples.charts', {
                url: "/charts",
                templateUrl: "assets/views/charts.html",
                resolve: loadSequence('chartjs', 'tc.chartjs', 'chartsCtrl'),
                title: "Charts",
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Charts'
                }
            }).state('app.documentation', {
                url: "/documentation",
                templateUrl: "assets/views/documentation.html",
                title: "Documentation",
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Documentation'
                }
            }).state('error', {
                url: '/error',
                template: '<div ui-view class="fade-in-up"></div>'
            }).state('error.404', {
                url: '/404',
                templateUrl: "assets/views/utility_404.html",
            }).state('error.500', {
                url: '/500',
                templateUrl: "assets/views/utility_500.html",
            })
            // Login routes
            .state('login', {
                url: '/login',
                template: '<div ui-view class="fade-in-right-big smooth"></div>',
                abstract: true
            }).state('login.logout', {
                url: '/logout/:command',
                templateUrl: "assets/views/login_login.html",
                resolve: loadSequence('underscore', 'loginCtrl', 'toaster', 'sweet-alert')
            }).state('login.signin', {
                url: '/signin',
                templateUrl: "assets/views/login_login.html",
                resolve: loadSequence('underscore', 'loginCtrl', 'toaster', 'sweet-alert')
            }).state('login.forgot', {
                url: '/forgot',
                templateUrl: "assets/views/login_forgot.html",
            }).state('login.registration', {
                url: '/registration',
                templateUrl: "assets/views/login_registration.html",
                resolve: loadSequence('underscore', 'xeditable', 'config-xeditable', 'ui.select', 'registrationCtrl', 'sweet-alert', 'toaster')
            }).state('login.lockscreen', {
                url: '/lock',
                templateUrl: "assets/views/login_lock_screen.html",
                resolve: loadSequence('underscore', 'login_lockCtrl', 'toaster', 'sweet-alert')
            }).state('login.clockinout', {
                url: '/clockinout',
                templateUrl: "assets/views/clockinout/clockinout.html",
                resolve: loadSequence('underscore', 'clockinoutCtrl', 'toaster', 'sweet-alert')
            });
        // Generates a resolve object previously configured in constant.JS_REQUIRES (config.constant.js)
        function loadSequence() {
            var _args = arguments;
            return {
                deps: ['$ocLazyLoad', '$q',
                    function ($ocLL, $q) {
                        var promise = $q.when(1);
                        for (var i = 0, len = _args.length; i < len; i++) {
                            promise = promiseThen(_args[i]);
                        }
                        return promise;
                        function promiseThen(_arg) {
                            if (typeof _arg == 'function')
                                return promise.then(_arg);
                            else
                                return promise.then(function () {
                                    var nowLoad = requiredData(_arg);
                                    if (!nowLoad)
                                        return $.error('Route resolve: Bad resource name [' + _arg + ']');
                                    return $ocLL.load(nowLoad);
                                });
                        }
                        function requiredData(name) {
                            if (jsRequires.modules)
                                for (var m in jsRequires.modules)
                                    if (jsRequires.modules[m].name && jsRequires.modules[m].name === name)
                                        return jsRequires.modules[m];
                            return jsRequires.scripts && jsRequires.scripts[name];
                        }
                    }]
            };
        }
    }]);