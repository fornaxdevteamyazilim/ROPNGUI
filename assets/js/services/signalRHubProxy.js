'use strict';
app.factory('signalRHubProxy', ['$rootScope', 'signalRServer', function ($rootScope, signalRServer) {
    function signalRHubProxyFactory(serverUrl, hubName, startOptions) {
        var connection = $.hubConnection(signalRServer);
        var proxy = connection.createHubProxy(hubName);
        //connection.start(startOptions).done(function () { });
        // anonymous function to pass any number of args in $scope.$apply
        var clbk = function (args, callback) {
            if (callback) callback.apply(this, args);
        }

        return {
            on: function (eventName, callback) {
                proxy.on(eventName, function () {
                    $rootScope.$apply(clbk(arguments, callback));
                });
            },
            off: function (eventName, callback) {
                proxy.off(eventName, function () {
                    $rootScope.$apply(clbk(arguments, callback));
                });
            },
            invoke: function (methodName, args, callback) {
                var args = Array.prototype.slice.call(arguments);
                if (typeof (arguments[arguments.length - 1]) == "function") {
                    var callback = args.pop();
                }
                proxy.invoke.apply(proxy, args)
                    .done(function (result) {
                        $rootScope.$apply(clbk(args, callback));
                    });
            },
            connection: connection
        };
    };
    return signalRHubProxyFactory;
}]);
