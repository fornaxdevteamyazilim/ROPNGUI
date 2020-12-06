app.controller('tagCtrl', tagCtrl);
function tagCtrl($rootScope, $scope, $log, Restangular, $modal, ngTableParams, SweetAlert, toaster, $window, $translate, $element) {
    $rootScope.uService.EnterController("tagCtrl");
    var tag = this;
    $scope.translate = function () {
        $scope.trTagType = $translate.instant('main.TAGTYPE');
        $scope.trTagName = $translate.instant('main.TAGNAME');
        $scope.trSystemTag = $translate.instant('main.SYSTEMTAG');
        $scope.trOrderIndex = $translate.instant('main.TAGORDERINDEX');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });

    tag.search = '';
    $scope.gettags = [];
    $scope.onChange = function (data) {
        Restangular.all('tag').getList({
            pageNo: 1,
            pageSize: 1000,
            search: (data) ? "TagType='" + data + "'" : ""
        }).then(function (result) {
            $scope.gettags = result;
        });
    };
    $scope.saveData = function (data) {
        if (data.id) {
            data.put().then(
                function (res) {
                    tag.tableParams.reload();
                    toaster.pop('success', $translate.instant('difinitions.Updated'), $translate.instant('difinitions.Updated'));
                },
                function (response) {
                    toaster.pop('error',$translate.instant('difinitions.Updatedapplied'), response.data.ExceptionMessage);
                }
                 );
        }
        else {
            Restangular.restangularizeElement('', data, 'tag')
            data.post().then(
                function (res) {
                    tag.tableParams.reload();
                    toaster.pop('success', $translate.instant('difinitions.Saved'), $translate.instant('difinitions.Saved'));
                },
                    function (response) {
                        toaster.pop('error', $translate.instant('difinitions.InsertFailed '), response.data.ExceptionMessage);
                    }
            );
            data.get();
        }
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
        if (!tag.tableParams.data[tag.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(tag.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'),  $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'),  $translate.instant('difinitions.Editcancelled'));
        }
    };
    tag.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            name: 'asc'
        }
    },
    {
        getData: function ($defer, params) {
            Restangular.all('tag').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: (tag.search) ? "name like '%" + tag.search + "%'" : "",
                sort: params.orderBy()
            }).then(function (items) {
                if (items && items.length > 0) {
                params.total(items.paging.totalRecordCount);
                $scope.SelectedItem = items[0].id;
                $defer.resolve(items);
                }
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length || $scope[Container].length == 0) {
            Restangular.all(EntityType).getList().then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.tagtypes = [];
    $scope.loadEntities('enums/tagtype', 'tagtypes');
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('difinitions.Sure') ,
            text:  $translate.instant('difinitions.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:    $translate.instant('difinitions.confirmButtonText'),
            cancelButtonText:   $translate.instant('difinitions.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (tag.tableParams.data[index].fromServer) {
                    tag.tableParams.data[index].remove();
                }
                tag.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (tag.tableParams.data[index].fromServer) {
            tag.tableParams.data[index].remove();
        }
        tag.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        tag.tableParams.data.push({});
    };
    var deregistration1 = $scope.$watch(angular.bind(tag, function () {
        return tag.search;
    }), function (value) {
        tag.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("tagCtrl");
    });
};
