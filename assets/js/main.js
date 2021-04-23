var app = angular.module('ropngApp', ['clip-two']);
app.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
}]);
app.config(['VKI_CONFIG', function (VKI_CONFIG) {
    VKI_CONFIG.layout['T\u00fcrk\u00e7e Q'] = {
        'name': "Turkish Q", 'keys': [
            [['"', "\u00e9", "<"], ["1", "!", ">"], ["2", "'", "\u00a3"], ["3", "^", "#"], ["4", "+", "$"], ["5", "%", "\u00bd"], ["6", "&"], ["7", "/", "{"], ["8", "(", '['], ["9", ")", ']'], ["0", "=", "}"], ["*", "?", "\\"], ["-", "_", "|"], ["Bksp", "Bksp"]],
            [["Tab", "Tab"], ["q", "Q", "@"], ["w", "W"], ["e", "E", "\u20ac"], ["r", "R"], ["t", "T"], ["y", "Y"], ["u", "U"], ["\u0131", "I", "i", "\u0130"], ["o", "O"], ["p", "P"], ["\u011f", "\u011e", "\u00a8"], ["\u00fc", "\u00dc", "~"], [",", ";", "`"]],
            [["Caps", "Caps"], ["a", "A", "\u00e6", "\u00c6"], ["s", "S", "\u00df"], ["d", "D"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L"], ["\u015f", "\u015e", "\u00b4"], ["i", "\u0130"], ["Enter", "Enter"]],
            [["Shift", "Shift"], ["<", ">", "|"], ["z", "Z"], ["x", "X"], ["c", "C"], ["v", "V"], ["b", "B"], ["n", "N"], ["m", "M"], ["\u00f6", "\u00d6"], ["\u00e7", "\u00c7"], [".", ":"], ["Shift", "Shift"]],
            [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
        ], 'lang': ["tr"]
    };
    VKI_CONFIG.layout['T\u00fcrk\u00e7e F'] = {
        'name': "Turkish F", 'keys': [
            [['+', "*", "\u00ac"], ["1", "!", "\u00b9", "\u00a1"], ["2", '"', "\u00b2"], ["3", "^", "#", "\u00b3"], ["4", "$", "\u00bc", "\u00a4"], ["5", "%", "\u00bd"], ["6", "&", "\u00be"], ["7", "'", "{"], ["8", "(", '['], ["9", ")", ']'], ["0", "=", "}"], ["/", "?", "\\", "\u00bf"], ["-", "_", "|"], ["Bksp", "Bksp"]],
            [["Tab", "Tab"], ["f", "F", "@"], ["g", "G"], ["\u011f", "\u011e"], ["\u0131", "I", "\u00b6", "\u00ae"], ["o", "O"], ["d", "D", "\u00a5"], ["r", "R"], ["n", "N"], ["h", "H", "\u00f8", "\u00d8"], ["p", "P", "\u00a3"], ["q", "Q", "\u00a8"], ["w", "W", "~"], ["x", "X", "`"]],
            [["Caps", "Caps"], ["u", "U", "\u00e6", "\u00c6"], ["i", "\u0130", "\u00df", "\u00a7"], ["e", "E", "\u20ac"], ["a", "A", " ", "\u00aa"], ["\u00fc", "\u00dc"], ["t", "T"], ["k", "K"], ["m", "M"], ["l", "L"], ["y", "Y", "\u00b4"], ["\u015f", "\u015e"], ["Enter", "Enter"]],
            [["Shift", "Shift"], ["<", ">", "|", "\u00a6"], ["j", "J", "\u00ab", "<"], ["\u00f6", "\u00d6", "\u00bb", ">"], ["v", "V", "\u00a2", "\u00a9"], ["c", "C"], ["\u00e7", "\u00c7"], ["z", "Z"], ["s", "S", "\u00b5", "\u00ba"], ["b", "B", "\u00d7"], [".", ":", "\u00f7"], [",", ";", "-"], ["Shift", "Shift"]],
            [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
        ]
    };
    VKI_CONFIG.deadkey['\u02d8'] = { // Romanian and Turkish breve
        'a': "\u0103", 'g': "\u011f",
        'A': "\u0102", 'G': "\u011e"
    };
    VKI_CONFIG.kt = 'T\u00fcrk\u00e7e Q';
    VKI_CONFIG.numberPad = true;
    VKI_CONFIG.showKbSelect = true;
    VKI_CONFIG.layout.Numerico = {
        'name': "Numerico", 'keys': [
            [["1", '1'], ["2", "2"], ["3", "3"], ["Bksp", "Bksp"]],
            [["4", "4"], ["5", "5"], ["6", '6'], ["Enter", "Enter"]],
            [["7", "7"], ["8", "8"], ["9", "9"], []],
            [["0", "0"], ["-"], ["+"], [","]]
        ], 'lang': ["pt-BR-num"]
    };
    VKI_CONFIG.relative = true;
    VKI_CONFIG.sizeAdj = true;
    VKI_CONFIG.enableVK = false; //To enable globbaly VK
}]);
app.run(['$rootScope', '$state', '$browser', '$stateParams', '$location', 'authService', 'ngnotifyService', 'toaster','$translate',
    function ($rootScope, $state, $browser, $stateParams, $location, authService, ngnotifyService, toaster,$translate) {
        // Attach Fastclick for eliminating the 300ms delay between a physical tap and the firing of a click event on mobile browsers
        FastClick.attach(document.body);
        // Set some reference to access them from any scope
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        //Page Navigationcontroll
        var _preventNavigation = false;
        var _preventNavigationUrl = null;
        var preventcounter = 0;
        $rootScope.allowNavigation = function () {
            _preventNavigation = false;
            _preventNavigationUrl = null;
            $rootScope.setSessionTimeOutState(true);
        };
        $rootScope.preventNavigation = function () {
            _preventNavigation = true;
            _preventNavigationUrl = $location.absUrl();
            $rootScope.setSessionTimeOutState(false);
        }
        $rootScope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {
            // Allow navigation if our old url wasn't where we prevented navigation from
            if (_preventNavigationUrl != oldUrl || _preventNavigationUrl == null) {                
                $rootScope.allowNavigation();
                _lastNavigationURL=null;
                return;
            }
            if (_preventNavigation) {//&& !confirm("Unsaved Changes Bulunuyor, Çıkmak İstediğinize Emin Misiniz? ")) {
                event.preventDefault();
                toaster.pop('error', $translate.instant('systemmessages.BrowseDisabledShort'), $translate.instant('systemmessages.BrowseDisabled')); 
            }
            else {
                $rootScope.allowNavigation();
            }
        });
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (_preventNavigation) {
                toaster.pop('error', $translate.instant('systemmessages.BrowseDisabledShort'), $translate.instant('systemmessages.BrowseDisabled'));
                event.preventDefault();
            }
        });
        // Take care of preventing navigation out of our angular app
        window.onbeforeunload = function () {
            // Use the same data that we've set in our angular app
            if (_preventNavigation && $location.absUrl() == _preventNavigationUrl) {
                return "Do you want to leave ROPNG Application?";
            }
        }
        // GLOBAL APP SCOPE
        // set below basic information
        $rootScope.app = {
            name: 'ROP NG',
            author: 'Fornax A.Ş.',
            description: 'Retail Operation Platform NG',
            version: '1.0.665',
            year: ((new Date()).getFullYear()),
            isMobile: (function () {// true if the browser is a mobile device
                var check = false;
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    check = true;
                };
                return check;
            })(),
            layout: {
                isNavbarFixed: true, //true if you want to initialize the template with fixed header
                isSidebarFixed: true, // true if you want to initialize the template with fixed sidebar
                isSidebarClosed: false, // true if you want to initialize the template with closed sidebar
                isFooterFixed: false, // true if you want to initialize the template with fixed footer
                theme: 'theme-1', // indicate the theme chosen for your project
                logo: 'assets/images/logo.png', // relative path of the project logo
            }
        };
        $rootScope.user = {
            restrictions: {
                name: '',
            }
        };
        $rootScope.ReportParameters = {
            StartDate: '',
            EndDate: '',
        };
    }]);

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
    $httpProvider.interceptors.push(function ($templateCache) {
        return {
            'request': function (request) {
                if (request.url.endsWith(".html") && !request.url.includes("tabset.html")) {
                    if ($templateCache.get(request.url) === undefined) { // cache miss
                        // Item is not in $templateCache so add our query string
                        request.url = request.url + '?v=0665';
                    }
                }
                return request;
            }
        };
    });
});
app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);
app.run(['userService', function (userService) { }]);
//app.value('signalRServer', 'http://10.101.252.149:9065');//Little Caesars
app.value('signalRServer', 'http://192.168.9.40:9065');//PH
//app.value('signalRServer', 'http://10.0.0.245:9065');//MAROCCO
//app.value('signalRServer', 'http://localhost:9065');//localhost
//app.value('signalRServer', 'http://78.135.103.74:9065');//ROPNG TEST
app.run(['callsService', function (callsService) { }]);
app.run(['ngnotifyService', function (ngnotifyService) { }]);
// translate config
app.config(['$translateProvider',
    function ($translateProvider) {
        // prefix and suffix information  is required to specify a pattern
        // You can simply use the static-files loader with this pattern:
        $translateProvider.useStaticFilesLoader({
            prefix: 'assets/i18n/',
            suffix: '.json'
        });
        // Since you've now registered more then one translation table, angular-translate has to know which one to use.
        // This is where preferredLanguage(langKey) comes in.
        $translateProvider.preferredLanguage('tr_TR');
        // Store the language in the local storage
        $translateProvider.useLocalStorage();
    }]);
// Angular-Loading-Bar
// configuration
app.config(['cfpLoadingBarProvider',
    function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeBar = true;
        cfpLoadingBarProvider.includeSpinner = true;
    }]);
app.config(['$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
    }]);
app.config(['$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|content|blob|chrome-extension)|data:image\/|\/?img\//);
    }]);

app.config(['KeepaliveProvider', 'IdleProvider', function (KeepaliveProvider, IdleProvider) {
    // configure Idle settings
    IdleProvider.idle(120);
    IdleProvider.timeout(10);
    KeepaliveProvider.interval(10);
    IdleProvider.interrupt('keydown wheel mousedown touchstart touchmove scroll');
}]);

/* app.run(function(Idle){
	// start watching when the app runs. also starts the Keepalive service by default.
	Idle.watch();
}); */
//Chrome Application için gerekli bölüm

//app.config(function (localStorageServiceProvider) {
//    localStorageServiceProvider
//      .setStorageType('sessionStorage');
//});
//----------------------------------//
//app.config([
//    '$compileProvider',
//    function ($compileProvider) {
//        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
//        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|content|blob|chrome-extension)|data:image\/|\/?img\//);
//    }
//]);
//Chrome Application için gerekli bölüm
app.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
}]);