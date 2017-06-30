var app = angular.module('smack', ['ngRoute', 'ngCookies', 'ngMessages'])

app.config(function($routeProvider){
  $routeProvider
  //root route= find team (from find team can redirect to a logged in team)
  .when('/',{
    templateUrl:'partials/findteam.html',
    controller:'findTeamController'
  })
  .when('/createteam',{
    templateUrl:'partials/createteam.html',
    controller:'findTeamController'
  })
  //login to team
  .when('/:teamURL/',{
    templateUrl:'partials/login.html',
    controller:'loginController'
  })
  //invite to team
  .when('/:teamURL/invite',{
    templateUrl:'partials/invite.html',
    controller:'loginController'
  })
  //the APP
  .when('/:teamURL/:channelId',{
    templateUrl:'partials/main.html',
    controller:'mainController'
  })
  .when('/:teamURL/messages',{
    templateUrl:'partials/main.html',
    controller:'mainController'
  })
  .otherwise({
    redirectTo:'/'
  });
});

module.exports = app




//directive to compare passwords and confirm match
var compareTo = function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
};

app.directive("compareTo", compareTo);
app.directive('myAutocomplete', myAutocomplete);

myAutocomplete.$inject = ['$http', '$interpolate', '$parse'];
function myAutocomplete($http, $interpolate, $parse) {

    // Usage:

    //  For a simple array of items
    //  <input type="text" class="form-control" my-autocomplete url="/some/url" ng-model="criteria.employeeNumber"  />

    //  For a simple array of items, with option to allow custom entries
    //  <input type="text" class="form-control" my-autocomplete url="/some/url" allow-custom-entry="true" ng-model="criteria.employeeNumber"  />

    //  For an array of objects, the label attribute accepts an expression.  NgModel is set to the selected object.
    //  <input type="text" class="form-control" my-autocomplete url="/some/url" label="{{lastName}}, {{firstName}} ({{username}})" ng-model="criteria.employeeNumber"  />

    //  Setting the value attribute will set the value of NgModel to be the property of the selected object.
    //  <input type="text" class="form-control" my-autocomplete url="/some/url" label="{{lastName}}, {{firstName}} ({{username}})" value="id" ng-model="criteria.employeeNumber"  />

    var directive = {            
        restrict: 'A',
        require: 'ngModel',
        compile: compile
    };

    return directive;

    function compile(elem, attrs) {
        var modelAccessor = $parse(attrs.ngModel),
            labelExpression = attrs.label;

        return function (scope, element, attrs) {
            var
                mappedItems = null,
                allowCustomEntry = attrs.allowCustomEntry || false;

            element.autocomplete({
                source: function (request, response) {
                    $http({
                        url: attrs.url,
                        method: 'GET',
                        params: { term: request.term }
                    })
                    .success(function (data) {
                        mappedItems = $.map(data, function (item) {
                            var result = {};

                            if (typeof item === 'string') {
                                result.label = item;
                                result.value = item;

                                return result;
                            }

                            result.label = $interpolate(labelExpression)(item);

                            if (attrs.value) {
                                result.value = item[attrs.value];
                            }
                            else {
                                result.value = item;
                            }

                            return result;
                        });

                        return response(mappedItems);
                    });
                },

                select: function (event, ui) {
                    scope.$apply(function (scope) {
                        modelAccessor.assign(scope, ui.item.value);
                    });

                    if (attrs.onSelect) {
                        scope.$apply(attrs.onSelect);
                    }

                    element.val(ui.item.label);

                    event.preventDefault();
                },

                change: function () {
                    var
                        currentValue = element.val(),
                        matchingItem = null;

                    if (allowCustomEntry) {
                        return;
                    }

                    if (mappedItems) {
                        for (var i = 0; i < mappedItems.length; i++) {
                            if (mappedItems[i].label === currentValue) {
                                matchingItem = mappedItems[i].label;
                                break;
                            }
                        }
                    }

                    if (!matchingItem) {
                        scope.$apply(function (scope) {
                            modelAccessor.assign(scope, null);
                        });
                    }
                }
            });
        };
    }
};
