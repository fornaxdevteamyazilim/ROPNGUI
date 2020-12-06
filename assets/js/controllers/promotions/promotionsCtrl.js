'use strict';
app.controller('promotionsCtrl', promotionsCtrl);
function promotionsCtrl($rootScope, $scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $translate, $element) {
    $rootScope.uService.EnterController("promotionsCtrl");
    var pro = this;
    $scope.translate = function () {
        $scope.trPromotionName = $translate.instant('main.PROMOTIONNAME');
        $scope.trPromotion = $translate.instant('main.PROMOTION');
        $scope.trPromotionRequirement = $translate.instant('main.PROMOTIONREQUIREMENT');
        $scope.trMember = $translate.instant('main.MEMBER');
        $scope.trStartDate = $translate.instant('main.STARTDATE');
        $scope.trEndDate = $translate.instant('main.ENDDATE');
        $scope.trFilter = $translate.instant('main.FILTER');
        $scope.trisActiveValue = $translate.instant('main.ACTIVEFILTER');
        $scope.trPromotionType = $translate.instant('main.PROMOTIONTYPE');
        $scope.trPromotionScenario = $translate.instant('main.PROMOTIONSCENARIO');
        $scope.trPromotionRule = $translate.instant('main.PROMOTIONRULE');
        $scope.trPomotionCodeValidatorType = $translate.instant('main.PROMOTIONCODEVALIDATORTYPE');
        $scope.trPromotionCodeValidator = $translate.instant('main.PROMOTIONCODEVALIDATOR');
        $scope.trNewCodeLength = $translate.instant('main.NEWCODELENGTH');
        $scope.trPomotionCodeGenerator = $translate.instant('main.PROMOTIONCODEGENERATOR');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trModifyValue = $translate.instant('main.MODIFYVALUE');
        $scope.trMinAmount = $translate.instant('main.MINAMOUNT');
        $scope.trPromotionid = $translate.instant('main.PROMOTIONID');


    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.item = {};
    pro.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
  {
      getData: function ($defer, params) {
          Restangular.all('promotion').getList({
              pageNo: params.page(),
              pageSize: params.count(),
              sort: params.orderBy(),
              search: (pro.search) ? "name like '%" + pro.search + "%'" : ""
          }).then(function (items) {
              params.total(items.paging.totalRecordCount);
              $defer.resolve(items);
          }, function (response) {
              toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
          });
      }
  });
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                pro.tableParams.reload();
                toaster.pop('success', $translate.instant('difinitions.Updated'),  $translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'promotion')
            data.post().then(function (res) {
                pro.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Saved'),  $translate.instant('difinitions.Saved'));
            });

        }
        data.get();
    }
    $scope.FormKeyPress = function (event, rowform, data, index) {
        if (event.keyCode === 13 && rowform.$visible) {
            rowform.$submit();
            return data;
        }
        if (event.keyCode === 27 && rowform.$visible) {
            $scope.cancelForm(rowform);
        }
    };
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!pro.tableParams.data[pro.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pro.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        }
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('difinitions.Sure') ,
            text:  $translate.instant('difinitions.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:  $translate.instant('difinitions.confirmButtonText'),
            cancelButtonText:  $translate.instant('difinitions.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (pro.tableParams.data[index].fromServer) {
                    pro.tableParams.data[index].remove();
                }
                pro.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (pro.tableParams.data[index].fromServer) {
            pro.tableParams.data[index].remove();
        }
        pro.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        pro.tableParams.data.push({});
    };
    $scope.$watch(angular.bind(pro, function () {
        return pro.search;
    }), function (value) {
        pro.tableParams.reload();
    });
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.members = [];
    $scope.loadEntities('member', 'members');
    $scope.filters = [];
    $scope.loadEntities('filter', 'filters');
    $scope.promotiontypes = [];
    $scope.loadEntities('enums/promotiontype', 'promotiontypes');
    $scope.promotionscenarios = [];
    $scope.loadEntities('enums/promotionscenario', 'promotionscenarios');
    $scope.promotionrules = [];
    $scope.loadEntities('enums/promotionrule', 'promotionrules');
    $scope.promotioncodevalidators = [];
    $scope.loadEntities('enums/promotioncodevalidator', 'promotioncodevalidators');
    $scope.promotioncodegenerators = [];
    $scope.loadEntities('enums/promotioncodegenerator', 'promotioncodegenerators');
    $scope.promotionrequirements = [];
    $scope.loadEntities('enums/promotionrequirement', 'promotionrequirements');
    $scope.StartDatePopup = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.RegistrationDate;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.StartDate = result;
        })
    };
    $scope.EndDatePopup = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.RegistrationDate;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.EndDate = result;
        })
    };
    $scope.open = function (ObjectID) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tags/ObjectTagEditModalContent.html',
            controller: 'TagModalCtrl',
            size: '',
            backdrop: '',
            resolve: {
                ObjectID: function () {
                    return ObjectID;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.result = selectedItem;
        });
    };
    var deregistration1 = $scope.$watch(angular.bind(pro, function () {
        return pro.search;
    }), function (value) {
        pro.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("promotionsCtrl");
    });
};
