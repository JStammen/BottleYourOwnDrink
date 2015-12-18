'use strict';

angular.module('mean.users')
    .controller('AuthCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
        function ($scope, $rootScope, $http, $location, Global) {
            // This object will contain list of available social buttons to authorize
            $scope.socialButtonsCounter = 0;
            $scope.global = Global;

            $http.get('/get-config')
                .success(function (config) {
                    $scope.socialButtons = config;
                });
        }
    ])
    .controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
        function ($scope, $rootScope, $http, $location, Global) {
            // This object will be filled by the form
            $scope.user = {};
            $scope.global = Global;
            $scope.global.registerForm = false;
            $scope.input = {
                type: 'password',
                placeholder: 'Password',
                confirmPlaceholder: 'Repeat Password',
                iconClass: '',
                tooltipText: 'Show password'
            };

            $scope.togglePasswordVisible = function () {
                $scope.input.type = $scope.input.type === 'text' ? 'password' : 'text';
                $scope.input.placeholder = $scope.input.placeholder === 'Password' ? 'Visible Password' : 'Password';
                $scope.input.iconClass = $scope.input.iconClass === 'icon_hide_password' ? '' : 'icon_hide_password';
                $scope.input.tooltipText = $scope.input.tooltipText === 'Show password' ? 'Hide password' : 'Show password';
            };

            // Register the login() function
            $scope.login = function () {
                $http.post('/login', {
                    email: $scope.user.email,
                    password: $scope.user.password
                })
                    .success(function (response) {
                        // authentication OK
                        $scope.loginError = 0;
                        $rootScope.user = response.user;
                        $rootScope.$emit('loggedin');
                        if (response.redirect) {
                            if (window.location.href === response.redirect) {
                                //This is so an admin user will get full admin page
                                window.location.reload();
                            } else {
                                window.location = response.redirect;
                            }
                        } else {
                            $location.url('/');
                        }
                    })
                    .error(function () {
                        $scope.loginerror = 'Authentication failed.';
                    });
            };
        }
    ])
    .controller('RegisterCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
        function ($scope, $rootScope, $http, $location, Global) {
            $scope.user = {};
            $scope.global = Global;
            $scope.global.registerForm = true;
            $scope.input = {
                type: 'password',
                placeholder: 'Password',
                placeholderConfirmPass: 'Repeat Password',
                iconClassConfirmPass: '',
                tooltipText: 'Show password',
                tooltipTextConfirmPass: 'Show password'
            };

            $scope.togglePasswordVisible = function () {
                $scope.input.type = $scope.input.type === 'text' ? 'password' : 'text';
                $scope.input.placeholder = $scope.input.placeholder === 'Password' ? 'Visible Password' : 'Password';
                $scope.input.iconClass = $scope.input.iconClass === 'icon_hide_password' ? '' : 'icon_hide_password';
                $scope.input.tooltipText = $scope.input.tooltipText === 'Show password' ? 'Hide password' : 'Show password';
            };
            $scope.togglePasswordConfirmVisible = function () {
                $scope.input.type = $scope.input.type === 'text' ? 'password' : 'text';
                $scope.input.placeholderConfirmPass = $scope.input.placeholderConfirmPass === 'Repeat Password' ? 'Visible Password' : 'Repeat Password';
                $scope.input.iconClassConfirmPass = $scope.input.iconClassConfirmPass === 'icon_hide_password' ? '' : 'icon_hide_password';
                $scope.input.tooltipTextConfirmPass = $scope.input.tooltipTextConfirmPass === 'Show password' ? 'Hide password' : 'Show password';
            };

            $scope.register = function () {
                $scope.usernameError = null;
                $scope.registerError = null;
                $http.post('/register', {
                    email: $scope.user.email,
                    password: $scope.user.password,
                    confirmPassword: $scope.user.confirmPassword,
                    username: $scope.user.username,
                    name: $scope.user.name
                })
                    .success(function () {
                        // authentication OK
                        $scope.registerError = 0;
                        $rootScope.user = $scope.user;
                        Global.user = $rootScope.user;
                        Global.authenticated = !!$rootScope.user;
                        $rootScope.$emit('loggedin');
                        $location.url('/');
                    })
                    .error(function (error) {
                        // Error: authentication failed
                        if (error === 'Username already taken') {
                            $scope.usernameError = error;
                        } else if (error === 'Email already taken') {
                            $scope.emailError = error;
                        } else $scope.registerError = error;
                    });
            };
        }
    ])
    .controller('ForgotPasswordCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
        function ($scope, $rootScope, $http, $location, Global) {
            $scope.user = {};
            $scope.global = Global;
            $scope.global.registerForm = false;
            $scope.forgotpassword = function () {
                $http.post('/forgot-password', {
                    text: $scope.user.email
                })
                    .success(function (response) {
                        $scope.validationError = response;
                    })
                    .error(function (error) {
                        $scope.validationError = error;
                    });
            };
        }
    ])
/**
 * This controller is used to request the swagger json file from the server.
 */
    .controller('SwaggerCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
        function ($scope, $rootScope, $http) {
            $http.get('/api-docs')
                .success(function (response) {
                    console.log('Swagger GET call was successful');
                    console.dir(response);
                });
        }
    ])

/**
 * The controller that is responsible for managing the change password page within the profile. The content
 * of the password inputs is send to the backend of the application through a http REST post.
 */
    .controller('ProfileCtrlPassword', ['$scope', '$rootScope', '$http', '$location', 'Global',
        function ($scope, $rootScope, $http, $location, Global) {
            $scope.user = {};
            $scope.global = Global;

            $scope.changeUserPassword = function () {
                console.log('User is trying to change his password');
                //console.log('DEBUG: ' + $scope.user.name + ' ' +  $scope.user.username + '' + $scope.user.email);
                $http.post('/changePassword/' + $scope.global.user._id, {
                    oldPassword: $scope.user.oldPassword,
                    password: $scope.user.password,
                    confirmPassword : $scope.user.confirmPassword
                })
                    .success(function (response) {
                        console.dir(response);
                        if(response.msg){
                            $scope.validationError = response.msg;
                        }else{
                            $scope.validationError = response;
                        }
                    })
                    .error(function (response) {
                            $scope.validationError = response;
                    });
            };
        }])
    .controller('ProfileCtrlMain', ['$scope', '$rootScope', '$http', '$location', 'Global',
        function ($scope, $rootScope, $http, $location, Global) {
            $scope.user = {};
            $scope.global = Global;

            var userID = $scope.global.user._id;

            $http.get('/user/' + userID).success(function (response) {
                console.log('Account informatie is binnen');
                console.dir(response);
                $scope.name = response.name;
                $scope.username = response.username;
                $scope.email = response.email;
            }).error(function () {
                console.log('Account informatie is niet opgehaald.');
            });

            $scope.changeUserInformation = function () {
                console.log('User is trying to update his personal information');
                $http.post('/updateProfile/' + $scope.global.user._id, {
                    name: $scope.user.name,
                    username: $scope.user.username,
                    email : $scope.user.email
                })
                    .success(function (response) {
                        console.dir(response);
                        $scope.name = response.name;
                        $scope.username = response.username;
                        $scope.email = response.email;
                        $scope.message = 'Account informatie is succesvol geupdatet.';
                        $location.url('/auth/profile/overzicht/' + $scope.global.user._id);
                    })
                    .error(function (error) {
                        if(error){
                            console.dir(error);
                        }else{
                            console.log('Error with resetting the users password');
                        }
                    });
            };
        }
    ])
/**
 * Controller that binds the orders of the user to the front end view through a http REST request to the backend.
 */
    .controller('ProfileCtrlOrders', ['$scope', '$rootScope', '$http', '$location', 'Global',
        function ($scope, $rootScope, $http, $location, Global) {
            $scope.user = {};
            $scope.global = Global;

            var username = $scope.global.user._id;

            //Get all the bestellingen from the backend
            $http.get('/user/' + username).success(function (response) {
                console.log('Bestellingen zijn binnen');
                $scope.orderList = response.orders;
                // }

            }).error(function () {
                console.log('Er zijn geen bestellingen binnengekomen');
            });
        }
    ])
    .controller('ResetPasswordCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', 'Global',
        function ($scope, $rootScope, $http, $location, $stateParams, Global) {
            $scope.user = {};
            $scope.global = Global;
            $scope.global.registerForm = false;
            $scope.resetpassword = function () {
                $http.post('/reset/' + $scope.global.user._id, {
                    password: $scope.user.password,
                    confirmPassword: $scope.user.confirmPassword
                })
                    .success(function (response) {
                        $rootScope.user = response.user;
                        $rootScope.$emit('loggedin');
                        if (response.redirect) {
                            if (window.location.href === response.redirect) {
                                //This is so an admin user will get full admin page
                                window.location.reload();
                            } else {
                                window.location = response.redirect;
                            }
                        } else {
                            $location.url('/');
                        }
                    })
                    .error(function (error) {
                        if (error.msg === 'Token invalid or expired')
                            $scope.resetpassworderror = 'Could not update password as token is invalid or may have expired';
                        else
                            $scope.validationError = error;
                    });
            };
        }
    ]);

