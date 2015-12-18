'use strict';

angular.module('mean.BYOD').factory('BYODservice', function () {

    var bottle = {}, createdBottle = {};

    return {
        saveBottle:function (data) {
            bottle = data;
        },
        getBottle:function () {
            return bottle;
        },
        saveCreatedBottle:function (data) {
            createdBottle = data;
        },
        getCreatedBottle:function () {
            return createdBottle;
        }
    };
});
