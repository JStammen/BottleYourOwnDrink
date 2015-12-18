'use strict';

(function() {
  // Login Controller Spec
  describe('MEAN controllers', function() {
    describe('LoginCtrl', function() {
      beforeEach(function() {
        jasmine.addMatchers({
          toEqualData: function() {
            return {
              compare: function(actual, expected) {
                return {
                  pass: angular.equals(actual, expected)
                };
              }
            };
          }
        });
      });

      beforeEach(function() {
        module('mean');
        module('mean.system');
        module('mean.users');
      });

      var LoginCtrl,
        scope,
        $rootScope,
        $httpBackend,
        $location;

      beforeEach(inject(function($controller, _$rootScope_, _$location_, _$httpBackend_) {

        scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;

        LoginCtrl = $controller('LoginCtrl', {
          $scope: scope,
          $rootScope: _$rootScope_
        });

        $httpBackend = _$httpBackend_;

        $location = _$location_;

      }));

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      //!!Custom tests for the profile pages!!

      //Custom test for the profile dashboard page.

      it('should retrieve a user and display the information', function() {

        // test expected GET request
        $httpBackend.when('GET', '/auth/profile/overzicht/:userID').respond(200, {
          user: 'test',
          name:  'Test',
          username: 'testuser',
          email: 'test@test.com'
        });
        $httpBackend.flush();
        // test scope value
        expect(scope.name).toEqual('test');
        expect(scope.username).toEqual('Test');
        expect(scope.email).toEqual('test@test.com');
        expect($location.url()).toEqual('/auth/profile/overzicht/:userID');
      });

      //Custom test for the change profile information functionality

      it('should display the updated information of the user.', function() {

        // test expected GET request
        $httpBackend.when('POST', '/updateProfile/:userID').respond(200, {
            user: 'test',
            name: 'test'
        });
        scope.changeUserInformation();
        $httpBackend.flush();
        // test scope value
        expect(scope.name).toEqual('test');
        expect($location.url()).toEqual('/auth/profile/overzicht/:userID');
      });

      //Custom test for the change profile information functionality

      it('should display the orders of the current user', function() {

        // test expected GET request
        $httpBackend.when('GET', '/auth/profile/bestellingen/:userID').respond(200, {
          email: 'test@test.com',
          username: 'test',
          name: 'test',
          orders: [{orderID : 1, orderDate : '01-01-2015', bottleType : 'testBottle', orderAmount : 1, orderPrice : 10 }]
        });
        $httpBackend.flush();
        // test scope value
        expect(scope.orderList).to.not.be.empty();
        expect($location.url()).toEqual('/auth/profile/bestellingen/:userID');
      });



      it('should login with a correct user and password', function() {

        spyOn($rootScope, '$emit');
        // test expected GET request
        $httpBackend.when('POST', '/login').respond(200, {
          user: 'Fred'
        });
        scope.login();
        $httpBackend.flush();
        // test scope value
        expect($rootScope.user).toEqual('Fred');
        expect($rootScope.$emit).toHaveBeenCalledWith('loggedin');
        expect($location.url()).toEqual('/');
      });



      it('should fail to log in ', function() {
        $httpBackend.expectPOST('/login').respond(400, 'Authentication failed');
        scope.login();
        $httpBackend.flush();
        // test scope value
        expect(scope.loginerror).toEqual('Authentication failed.');

      });
    });

    describe('RegisterCtrl', function() {
      beforeEach(function() {
        jasmine.addMatchers({
          toEqualData: function() {
            return {
              compare: function(actual, expected) {
                return {
                  pass: angular.equals(actual, expected)
                };
              }
            };
          }
        });
      });

      beforeEach(function() {
        module('mean');
        module('mean.system');
        module('mean.users');
      });

      var RegisterCtrl,
        scope,
        $rootScope,
        $httpBackend,
        $location;

      beforeEach(inject(function($controller, _$rootScope_, _$location_, _$httpBackend_) {

        scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;

        RegisterCtrl = $controller('RegisterCtrl', {
          $scope: scope,
          $rootScope: _$rootScope_
        });

        $httpBackend = _$httpBackend_;

        $location = _$location_;

      }));

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should register with correct data', function() {

        spyOn($rootScope, '$emit');
        // test expected GET request
        scope.user.name = 'Fred';
        $httpBackend.when('POST', '/register').respond(200, 'Fred');
        scope.register();
        $httpBackend.flush();
        // test scope value
        expect($rootScope.user.name).toBe('Fred');
        expect(scope.registerError).toEqual(0);
        expect($rootScope.$emit).toHaveBeenCalledWith('loggedin');
        expect($location.url()).toBe('/');
      });



      it('should fail to register with duplicate Username', function() {
        $httpBackend.when('POST', '/register').respond(400, 'Username already taken');
        scope.register();
        $httpBackend.flush();
        // test scope value
        expect(scope.usernameError).toBe('Username already taken');
        expect(scope.registerError).toBe(null);
      });

      it('should fail to register with non-matching passwords', function() {
        $httpBackend.when('POST', '/register').respond(400, 'Password mismatch');
        scope.register();
        $httpBackend.flush();
        // test scope value
        expect(scope.usernameError).toBe(null);
        expect(scope.registerError).toBe('Password mismatch');
      });
    });

    describe('ForgotPasswordCtrl', function() {
      beforeEach(function() {
        jasmine.addMatchers({
          toEqualData: function() {
            return {
              compare: function(actual, expected) {
                return {
                  pass: angular.equals(actual, expected)
                };
              }
            };
          }
        });
      });

      beforeEach(function() {
        module('mean');
        module('mean.system');
        module('mean.users');
      });

      var ForgotPasswordCtrl,
          scope,
          $rootScope,
          $httpBackend ;

      beforeEach(inject(function($controller, _$rootScope_, _$httpBackend_) {

        scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;

        ForgotPasswordCtrl = $controller('ForgotPasswordCtrl', {
          $scope: scope,
          $rootScope: _$rootScope_
        });

        $httpBackend = _$httpBackend_;

      }));

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should display success response on success', function() {
        scope.user.email = 'test@test.com';
        $httpBackend.when('POST', '/forgot-password').respond(200,'Mail successfully sent');
        scope.forgotpassword();
        $httpBackend.flush();

        expect(scope.response).toEqual('Mail successfully sent');

      });
      it('should display error response on failure', function() {
        scope.user.email = 'test@test.com';
        $httpBackend.when('POST', '/forgot-password').respond(400,'User does not exist');
        scope.forgotpassword();
        $httpBackend.flush();

        expect(scope.response).toEqual('User does not exist');

      });

    });
  });


}());
