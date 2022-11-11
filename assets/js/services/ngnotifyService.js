app.factory('ngnotifyService', ['$http', '$rootScope', '$location', '$timeout', 'ngAuthSettings', 'signalRServer', 'signalRHubProxy', 'localStorageService', 'toaster', '$translate','Restangular','NG_SETTING', ngnotifyService]);
function ngnotifyService($http, $rootScope, $location, $timeout, ngAuthSettings, signalRServer, signalRHubProxy, localStorageService, toaster, $translate,Restangular,NG_SETTING) {
    var ngnotifyServiceFactory = {};
    var _serverDate = new Date();
    var _groups = [];
    var _timeDelta = 0;
    var _storeID = "";
    var ngnotifyHubProxy = signalRHubProxy(signalRServer, 'NGNotifyHub');
    //var ngnotifyHubProxy = signalRHubProxy($location.host()+':9065', 'NGNotifyHub');
    _setStoreID = function (groupName) {
        if (groupName) {
            localStorageService.set('StoreID', groupName);
            _storeID = groupName.toString();
            _JoinGroup(_storeID);
        }
    };
    _startServerDate = function () {
        _JoinGroup("ServerTime");
    };
    _JoinGroup = function (groupName) {
        if (_groups.indexOf(groupName) === -1)
            _groups.push(groupName);
        ngnotifyHubProxy.invoke('JoinGroup', groupName, function () {
            console.log('Invocation of JoinGroup succeeded');
        });

    };
    _reJoinToGroups = function () {
        angular.forEach(_groups, function (value, key) {
            _JoinGroup(value);
        });
    };
    _LeaveGroup = function (groupName) {
        ngnotifyHubProxy.invoke('LeaveGroup', groupName, function () {
            console.log('Invocation of LeaveGroup [' + groupName + '] succeeded');
        });
    };
    addZero = function (i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    function TimeToString(d) {
        var h = addZero(d.getHours());
        var m = addZero(d.getMinutes());
        var s = addZero(d.getSeconds());
        return h + ":" + m + ":" + s;
    }
    function DateToString(d) {
        var y = d.getFullYear();
        var m = addZero(d.getMonth() + 1);
        var d = addZero(d.getDate());
        return y + '-' + m + '-' + d;
    }
    _GetOnlyDate = function (d) {
        var y = d.getFullYear();
        var m = addZero(d.getMonth() + 1);
        var d = addZero(d.getDate());
        return new Date(y, m, d, 0, 0, 0);
    }

    _ServerOperationDate = function () {
        var theDate = new Date(_ServerTime());
        if (theDate.getHours() < 10) {
            theDate.setDate(theDate.getDate() - 1);
        }
        return theDate;
    };
    _ServerTime = function (time) {
        var now = time ? new Date(time) : new Date();
        return now - _timeDelta;
    };
    ngnotifyHubProxy.on('serverTime', function (data) {
        var now = new Date();
        var serverdate = new Date(data);
        _timeDelta = now - serverdate;
        $rootScope.$broadcast('ServerTime', data);
    });
    ngnotifyHubProxy.on('setApiUrl', function (apiUrl) {
        console.log('setApiUrl message Recieved:'+apiUrl);
        toaster.pop('Warning', 'setApiUrl message Recieved', apiUrl);
        if (ngAuthSettings.dynamicApiEnable){
            Restangular.setBaseUrl(apiUrl+'/api/');
            ngAuthSettings.apiServiceBaseUri=apiUrl+'/';
            ngAuthSettings.apiAsiggned=true;
            NG_SETTING.apiServiceBaseUri=apiUrl;
            console.log('ApiUrl updated to:'+apiUrl);
            toaster.pop('Warning', 'ApiUrl updated to:', apiUrl);
            }
        else
        {
            console.log('Skipping setApiUrl message');
            toaster.pop('Warning', 'Skipping setApiUrl message Recieved', apiUrl);        
        }
    });
    ngnotifyHubProxy.on('NewOrder', function (data) {
        //string id,Enums.OrderStatus oldStatus, Enums.OrderStatus newStatus,string storeID
        $rootScope.$broadcast('NewOrder', data);
    });
    ngnotifyHubProxy.on('UpdateStats', function (data) {
        $rootScope.$broadcast('UpdateStats', data);
    });
    ngnotifyHubProxy.on('YSOrder', function (data) {
        $rootScope.$broadcast('YSOrder', data);
    });
    ngnotifyHubProxy.on('YSStatUpdate', function (data) {
        $rootScope.$broadcast('YSStatUpdate', data);
    });
    ngnotifyHubProxy.on('YSOrderUpdate', function (data) {
        $rootScope.$broadcast('YSOrderUpdate', data);
    });
    ngnotifyHubProxy.on('AggregatorOrder', function (data) {
        $rootScope.$broadcast('AggregatorOrder', data);
    });
    ngnotifyHubProxy.on('AggregatorStatUpdate', function (data) {
        $rootScope.$broadcast('AggregatorStatUpdate', data);
    });
    ngnotifyHubProxy.on('AggregatorOrderUpdate', function (data) {
        $rootScope.$broadcast('AggregatorOrderUpdate', data);
    });
    ngnotifyHubProxy.on('OrderChange', function (data) {
        //string id,Enums.OrderStatus oldStatus, Enums.OrderStatus newStatus,string storeID
        $rootScope.$broadcast('OrderChange', data);
    });
    ngnotifyHubProxy.on('OrderUpdated', function (data) {
        $rootScope.$broadcast('OrderUpdated', data);
    });
    ngnotifyHubProxy.on('ClientMessage', function (data) {
        $rootScope.$broadcast('ClientMessage', data);
        if (data.MessageType == "Error") {
            toaster.pop('error', data.MessageType, data.Message);
        }
        else {
            toaster.pop('success', data.MessageType, data.Message);
        }
    });
    ngnotifyHubProxy.on('Identification', function (data) {
        if (data.StationID == localStorageService.get('ClientName')) {
            $rootScope.$broadcast('Identification', data);
            toaster.pop('Warning', data.MessageType, 'Recieved FingerPrintID info!');
        }
    });
    ngnotifyHubProxy.on('MSRIdentification', function (data) {
        if (data.StationID == localStorageService.get('ClientName')) {
            $rootScope.$broadcast('MSRIdentification', data);
            toaster.pop('Warning', data.MessageType, 'Recieved Magnetic Card info!');
        }
    });
    ngnotifyHubProxy.on('KDSUpdate', function (data) {
        $rootScope.$broadcast('KDSUpdate', data);
        //toaster.pop('Warning', data.MessageType, 'Recieved KDSNotify info!');        
    });
    ngnotifyHubProxy.on('CustomerArrived', function (data) {
        $rootScope.$broadcast('CustomerArrived', data);
        toaster.pop('Warning', 'CustomerArrived', 'Recieved CustomerArrived Event!');
    });
    ngnotifyHubProxy.on('BumpBarData', function (data) {
        $rootScope.$broadcast('BumpBarData', data);
        //toaster.pop('Warning', data.MessageType, 'Recieved BumpBarData info!');
    });
    ngnotifyHubProxy.on('StoreUpdate', function (data) {
        //string StoreID,string Message "FinalizeOperationDay"
        $rootScope.$broadcast('StoreUpdate', data);
        if (data.Message == "FinalizeOperationDay") {
            $rootScope.$broadcast('OperationDayChanged', '')
        }
        if (data.Message == "OperationDayChanged") {
            $rootScope.$broadcast('OperationDayChanged', data.OperationDate)
        }
    });
    //ngnotifyHubProxy.on('PingUser', function (userName) {
    //    console.log('Ping User message Recieved');
    //    if ($rootScope.user && $rootScope.user.name==userName)
    //    ngnotifyHubProxy.invoke('PongUser', data, function () {
    //        console.log('Pong User invoked');
    //    });
    //});
    //$scope.$on('PingUser', function (event, data) {
    //    ngnotifyHubProxy.invoke('PingUser', data, function () {
    //        console.log('Ping User invoked');
    //    });
    //});
    ngnotifyHubProxy.on('PongUser', function (userName) {
        console.log('Pong User message Recieved');
        $rootScope.$broadcast('KDSUpdate', data);
    });
    ngnotifyHubProxy.connection.start().done(function () {
        ngAuthSettings.connected=true;
        _JoinGroup("ServerTime");
        var _storeID = localStorageService.get('StoreID');
        if (_storeID) {
            _JoinGroup(_storeID.toString());
        }
        $rootScope.$broadcast('Signalr','Connected');
        //toaster.pop('success', $translate.instant('SignalR.ConnectionInfo'), $translate.instant('SignalR.ConnectionOk'));
        DevExpress.ui.notify({
            message: $translate.instant('SignalR.ConnectionOk'),
            type: "success",
            displayTime: 3000,
        });
    });
    ngnotifyHubProxy.connection.connectionSlow(function () {
        console.log('We are currently experiencing difficulties with the connection.');
        //toaster.pop('warning', $translate.instant('SignalR.ConnectionInfo'), $translate.instant('SignalR.ConnectionSlow'));
        DevExpress.ui.notify($translate.instant('SignalR.ConnectionSlow'), 'warning',3000);
    });
    // ngnotifyHubProxy.connection.disconnected(function () {
    //     ngAuthSettings.connected=false;
    //     if (ngnotifyHubProxy.connection.lastError) {
    //         //toaster.pop('error', $translate.instant('SignalR.ConnectionLost'), ngnotifyHubProxy.connection.lastError.message);
    //         DevExpress.ui.notify($translate.instant('SignalR.ConnectionLost'), 'error',3000);
    //         DevExpress.ui.notify(ngnotifyHubProxy.connection.lastError.message, 'error',3000);
    //         //alert("Disconnected. Reason: " + ngnotifyHubProxy.connection.lastError.message);
    //     }
    //     else
    //         DevExpress.ui.notify($translate.instant('SignalR.ConnectionLost'), 'error',3000);
    //     //toaster.pop('error', $translate.instant('SignalR.ConnectionInfo'), $translate.instant('SignalR.ConnectionLost'));
    // });
    ngnotifyHubProxy.connection.error(function (error) {
        //toaster.pop('error', $translate.instant('SignalR.ConnectionInfo'), $translate.instant('SignalR.ConnectionError'));
        DevExpress.ui.notify($translate.instant('SignalR.ConnectionError'), 'error',3000);
        console.log('SignalR error: ' + error);
    });
    ngnotifyHubProxy.connection.reconnecting(function () {
        //notifyUserOfTryingToReconnect(); // Your function to notify user.
        console.log('SignalR Reconnecting...');
        //toaster.pop('warning', $translate.instant('SignalR.ConnectionInfo'), $translate.instant('SignalR.Reconnecting'));
        DevExpress.ui.notify($translate.instant('SignalR.Reconnecting'), 'warning',3000);
    });
    ngnotifyHubProxy.connection.disconnected(function () {
        ngAuthSettings.connected=false;
        setTimeout(function () {
            //toaster.pop('warning', $translate.instant('SignalR.ConnectionInfo'), $translate.instant('SignalR.Reconnecting'));
            DevExpress.ui.notify($translate.instant('SignalR.Reconnecting'), 'warning',3000);
            ngnotifyHubProxy.connection.start().done(function () {
                ngAuthSettings.connected=true;
                _reJoinToGroups();
                $rootScope.$broadcast('Signalr','reConnected');
                //toaster.pop('success', $translate.instant('SignalR.ConnectionInfo'), $translate.instant('SignalR.ConnectionOk'));
                DevExpress.ui.notify($translate.instant('SignalR.ConnectionOk'), 'success',3000);
            });
        }, 5000); // Restart connection after 5 seconds.
    });
    ngnotifyServiceFactory.ServerTime = _ServerTime;
    ngnotifyServiceFactory.StartServerDate = _startServerDate;
    ngnotifyServiceFactory.LeaveGroup = _LeaveGroup;
    ngnotifyServiceFactory.SetStoreID = _setStoreID;
    ngnotifyServiceFactory.JoinGroup = _JoinGroup;
    ngnotifyServiceFactory.ServerDate = _serverDate;
    ngnotifyServiceFactory.ServerOperationDate = _ServerOperationDate;
    return ngnotifyServiceFactory;
};