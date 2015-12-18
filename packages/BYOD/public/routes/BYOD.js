'use strict';

angular.module('mean.BYOD').config(['$meanStateProvider',
    function ($meanStateProvider) {

        $meanStateProvider.state('Home page', {
            url: '/',
            templateUrl: 'BYOD/views/index.html'
        });

        //PAYMENT ROUTES

        $meanStateProvider.state('Payment page', {
            url: '/betaling/:userID',
            templateUrl: 'BYOD/views/payment.html'
        });

        //PAYMENT CONFIRMATION ROUTES

        $meanStateProvider.state('Payment confirmation page Paypal', {
            url: '/betaling/:userID/confirmatie-paypal',
            templateUrl: 'BYOD/views/confirmationPaypal.html'
        });
        $meanStateProvider.state('Payment confirmation page Ideal', {
            url: '/betaling/:userID/confirmatie-ideal',
            templateUrl: 'BYOD/views/confirmationIdeal.html'
        });
        $meanStateProvider.state('Payment confirmation page Coupon', {
            url: '/betaling/:userID/confirmatie-coupon',
            templateUrl: 'BYOD/views/confirmationCoupon.html'
        });
        $meanStateProvider.state('Payment confirmation page Credit', {
            url: '/betaling/:userID/confirmatie-credit',
            templateUrl: 'BYOD/views/confirmationCredit.html'
        });

        //FINAL ROUTES FOR THE BYOD FUNCTIONALITY

        $meanStateProvider.state('Bottle step 1', {
            url: '/choose/option',
            templateUrl: 'BYOD/views/bottle1.html'
        });
        $meanStateProvider.state('Bottle step 2', {
            url: '/choose/bottle',
            templateUrl: 'BYOD/views/bottle2.html'
        });
        $meanStateProvider.state('Bottle step 3', {
            url: '/create/bottle',
            templateUrl: 'BYOD/views/bottle3.html'
        });
        $meanStateProvider.state('bottle step 4', {
            url: '/create/drink',
            templateUrl: 'BYOD/views/bottle4.html'
        });

    }
]);

