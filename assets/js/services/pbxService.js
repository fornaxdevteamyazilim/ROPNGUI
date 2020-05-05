app.factory('callsService', ['$http', '$rootScope', '$location', '$timeout', 'ngAuthSettings', 'signalRServer', 'signalRHubProxy', 'localStorageService', callsService]);
function callsService($http, $rootScope, $location, $timeout, ngAuthSettings, signalRServer, signalRHubProxy, localStorageService) {
    var callsServiceFactory = {};
    var _calls = [];
    var clientPushHubProxy = signalRHubProxy(signalRServer, 'CallHub');
    //var _currentExtension = "";
    var _lastCallerID = "";
    var _currentExtension = localStorageService.get('ExtensionNumber');
    var BroadcastCallData = true;
    var CurrentCall = {};
    clientPushHubProxy.on('AddEntry', function (data) {
        if (data.CallerID.substring(0, 1) == '0') {
            data.CallerID = data.CallerID.substring(1);
            // _lastCallerID = CallerID;
        }
        if (data.CallerID.substring(0, 1) != '0' && data.CallerID.substring(0, 1) != 'T') {
            data.CallerID = data.CallerID;
        }
        if (data.CallerID.substring(0, 1) == 'T') {
            data.CallerID = 'Unknown'
            data.CallerID = data.CallerID;
        }
        if (data != null) {
            if (!_isCallExist(data)) {
                _calls.push(data);
                if (BroadcastCallData)
                    $rootScope.$broadcast('pbxCallChange', angular.copy(data));
                if (BroadcastCallData && _currentExtension == data.Extension && data.Status == "Ringing")
                    $rootScope.$broadcast('pbxCallRing', angular.copy(data));
                if (BroadcastCallData && _currentExtension == data.Extension && data.Status == "Connected")
                    $rootScope.$broadcast('pbxCallConnect', angular.copy(data));
                if (BroadcastCallData && _currentExtension == data.Extension && data.Status == "Connected") {
                    _setLastCallerID(data);
                    _setCurrentCallData(data);
                }
            }
        }
    });
    clientPushHubProxy.on('ChangeEntry', function (data) {
        for (var i = 0; i < _calls.length; i++) {
            if (_calls[i].UCID == data.UCID) {
                angular.copy(data, _calls[i]);
                if (BroadcastCallData)
                    $rootScope.$broadcast('pbxCallChange', _calls[i]);
                if (BroadcastCallData && _currentExtension == _calls[i].Extension && _calls[i].Status == "Ringing")
                    $rootScope.$broadcast('pbxCallRing', _calls[i]);
                if (BroadcastCallData && _currentExtension == _calls[i].Extension && _calls[i].Status == "Connected") {
                    $rootScope.$broadcast('pbxCallConnect', _calls[i]);
                    //angular.copy(data, CurrentCall.call);
                    CurrentCall.CallType = null;
                    _setLastCallerID(data);
                    _setCurrentCallData(data);
                }
            }
        }
    });
    clientPushHubProxy.on('RemoveEntry', function (data) {
        if (data != null) {
            for (var i = 0; i < _calls.length; i++) {
                if (_calls[i].Extension == data.Extension) {
                    
                    if (BroadcastCallData)
                        $rootScope.$broadcast('pbxCallChange', angular.copy(data));
                    if (BroadcastCallData && _currentExtension == _calls[i].Extension) {
                        $rootScope.$broadcast('pbxCallDisconnect', _calls[i]);
                        _setCurrentCallData(null);
                    }                    
                    _calls.splice(i, 1);
                    break;
                }
            }
            if (BroadcastCallData)
                $rootScope.$broadcast('pbxCallChange', _calls[i]);
        }
    });
    _isCallExist = function (data) {
        for (var i = 0; i < _calls.length; i++) {
            if (_calls[i].Extension == data.Extension) {
                return true;
            }
        }
        return false;
    }
    _setClientCallerID = function (number) {
        _currentExtension = number;
        localStorageService.set('ExtensionNumber', number);
    };
    _setClientName = function (name) {
        localStorageService.set('ClientName', name);
    };
    _updateCalls = function () {
        clientPushHubProxy.invoke(null, function (data) {
            angular.copy(data, _calls);
            if (BroadcastCallData)
                $rootScope.$broadcast('pbxCallUpdate', _calls);
            return data;
        });
    };
    _setLastCallerID = function (CallerID) {
        angular.copy(CallerID, _lastCallerID);
    };
    _getCalls = function () {
        if (BroadcastCallData)
            $rootScope.$broadcast('pbxCallUpdate', _calls);
        return angular.copy(_calls);
    };
    _getLastCallerID = function () {
        return _lastCallerID;
    };
    clientPushHubProxy.connection.start().done(function () {
        _updateCalls();
    });
    _setCurrentCallData = function (CallData) {
        angular.copy(CallData, CurrentCall);
    };
    _getCurrentCall = function () {
        return CurrentCall;
    }
    _setCurrentCallType = function (type, StoreID) {
        CurrentCall.CallType = type;
        CurrentCall.StoreID = (StoreID) ? StoreID : null;
    }
    _isTypeRequired = function () {
        return CurrentCall.CallType == null;
    }
    _resCurrentCall = function () {
        CurrentCall.CallType = null;
    }
    _EnableBroadcastCalls = function (enable) {
        BroadcastCallData = enable;
    }
    callsServiceFactory.SetCurrentCallType = _setCurrentCallType;
    callsServiceFactory.isTypeRequired = _isTypeRequired;
    callsServiceFactory.GetCurrentCall = _getCurrentCall
    callsServiceFactory.ResCurrentCall = _resCurrentCall
    callsServiceFactory.UpdateCalls = _updateCalls;
    callsServiceFactory.currentExtension = _currentExtension;
    callsServiceFactory.GetCalls = _getCalls;
    callsServiceFactory.SetClientCallerID = _setClientCallerID;
    callsServiceFactory.SetClientName = _setClientName;
    callsServiceFactory.calls = _calls;
    callsServiceFactory.GetLastCallerID = _getLastCallerID;
    callsServiceFactory.EnableBroadcastCalls = _EnableBroadcastCalls
    return callsServiceFactory;
};