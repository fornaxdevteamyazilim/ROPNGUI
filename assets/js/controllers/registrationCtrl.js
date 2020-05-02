(function () {
    'use strict';
    app.controller('registrationCtrl', registrationCtrl);
    function registrationCtrl($scope, toaster, Restangular, $window, $location) {


        $scope.SaveUser = function (data) {
            if (data == undefined) {

            } else {
                     Restangular.restangularizeElement('', data, 'user')
            data.post().then(function (resp) {
                data.id = resp.id;
                swal("Saved!", "Register Successfully Saved", "success");
            });
            }
           
        }

    };
})();