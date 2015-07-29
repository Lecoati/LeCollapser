

angular.module("umbraco").directive('uskyGrid', function ($compile) {

    return {
        restrict: 'C',
        link: function (scope, element, attrs) {

            var el = angular.element("<div ng-hide=\"!model.value || model.value == ''\" class=\"collapse-all-tools\" />");
            el.append("<button class=\"btn btn-small\" ng-click=\"gridCollapseAll()\" prevent-default>Collapse all</button>")
            el.append("<button class=\"btn btn-small\" ng-click=\"gridUncollapseAll()\" prevent-default>Uncollapse all</button>")
            $compile(el)(scope);
            element.prepend(el);


            // Collapse all
            scope.gridCollapseAll = function () {
                angular.forEach(scope.model.value.sections, function (section, indexSection) {
                    angular.forEach(section.rows, function (row, indexRow) {
                        row.$collapsed = true;
                    });
                });
            }

            // Uncollapse all
            scope.gridUncollapseAll = function () {
                angular.forEach(scope.model.value.sections, function (section, indexSection) {
                    angular.forEach(section.rows, function (row, indexRow) {
                        row.$collapsed = false;
                    });
                });
            }

            scope.$on("formSubmitted", function (e, args) {
                scope.storedUncollapsedRows = [];
                angular.forEach(scope.model.value.sections, function (section, indexSection) {
                    angular.forEach(section.rows, function (row, indexRow) {
                        if (!row.$collapsed) {
                            scope.storedUncollapsedRows.push(row.id);
                        }
                    });
                });
            });


        }
    }

});

// Transclude the row element within a collapsible countainer 
angular.module("umbraco").directive('uskyRow', function ($compile) {

    return {
        restrict: 'C',
        transclude: true,
        scope: true,
        template: "<div class=\"collapse-countainer\" ng-class=\"{'le-collapse':row.$collapsed}\" ng-transclude></div>",
        link: function (scope, element, attrs) {

            // Restore the $collapsed after formSubmitted
            if (!scope.row.$collapsed &&
                scope.storedUncollapsedRows &&
                scope.storedUncollapsedRows.indexOf(scope.row.id) != -1) {
                scope.row.$collapsed = false;
            }
            else {

                // by default, if the row is empty, the row is uncollapsed
                scope.row.$collapsed = true;

                // by default if the row isn't empty, the row is collapsed
                angular.forEach(scope.row.areas, function (area, indexArea) {
                    if (area.controls.length > 0) {
                        scope.row.$collapsed = true;
                    }
                });
            }

            // uncollapse if click on the row
            element.on(
                "click.bnDelegate",
                ".mainTb",
                function (event) {
                    if (!scope.row.$collapsed) {
                        scope.row.$collapsed = !scope.row.$collapsed;
                    }
                }
            );

        }
    }

});

// Add a toggle collapse action to the Row label
angular.module("umbraco").directive('itemLabel', function ($compile) {
    return {
        restrict: 'C',
        transclude: true,
        scope: true,
        template: "<span ng-click=\"rowCollapse()\" ng-transclude><i class=\"icon icon-navigation-right\" ng-show=\"row.$collapsed\" title=\"Settings\" localize=\"title\"></i>" +
                  "<i class=\"icon icon-navigation-down\" ng-click=\"rowCollapse()\" ng-show=\"!row.$collapsed\" title=\"Settings\" localize=\"title\"></i></span>",
        link: function (scope, element, attrs) {

            // Toggle current row $collapsed
            scope.rowCollapse = function () {
                scope.row.$collapsed = !scope.row.$collapsed;
            }

        }
    }
});
