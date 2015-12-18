'use strict';

describe('BYOD step 1 controller', function () {
    describe('test', function () {
        it('assert', function () {
            expect(1).toBe(1);
        });
    });

    describe('BYOD step 1 controller', function () {
        beforeEach(module('BYOD'));

        var $controller;

        beforeEach(inject(function (_$controller_) {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            $controller = _$controller_;
        }));

        describe('BYODController step 1 tests', function () {
            it('test if the scope contains enough objects', function () {
                var $scope = {};
                var controller = $controller('BYODControllerStep1', {$scope: $scope});

                expect(controller.$scope.bottles.length).toEqual(3);
            });
        });
    });

});
