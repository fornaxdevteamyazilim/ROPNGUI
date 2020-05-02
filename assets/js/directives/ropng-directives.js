app.directive('ignoreMouseWheel', function ($rootScope, $timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('mousewheel', function (event) {
                element.blur();
                $timeout(function () {
                    element.focus();
                }, 10);
            });
        }
    }
});
