'use strict';
/** 
  * controllers for angular-nestable 
  * Angular module for jQuery nestable plugin
*/
app.controller('nestableCtrl', function ($scope) {
    $scope.mdl = [{
        item: {
            text: 'Products',
            type:"Test"
        },
        children: [{
            item: {
                text: 'Features',
                type: "Test"
            }
        }, {
            item: {
                text: 'Gallery'
            },
            children: []
        }, {
            item: {
                text: 'Plans'
            },
            children: [{
                item: {
                    text: 'Purchase'
                },
                children: []
            }, {
                item: {
                    text: 'Confirmation'
                },
                children: []
            }]
        }]
    }, {
        item: {
            text: 'About Us'
        },
        children: [{
            item: {
                text: 'Executive Team'
            },
            children: []
        }, {
            item: {
                text: 'Corporate Responsibility'
            },
            children: []
        }]
    }, {
        item: {
            text: 'Careers'
        },
        children: [{
            item: {
                text: 'Search Jobs'
            },
            children: []
        }, {
            item: {
                text: 'Events'
            },
            children: []
        }]
    }, {
        item: {
            text: 'Contact Us'
        },
        children: []
    }];
});
