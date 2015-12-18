'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User');

//Get the users profile information
exports.getProfileInformation = function (req, res) {
    console.log('Received a profile information request');
    console.log('Profile ID: ' + req.params.userID);

    if (req.params.userID) {
        var userID = mongoose.Types.ObjectId(req.params.userID);
        User
            .findOne({
                _id: userID
            })
            .exec(function (err, user) {
                if (err) console.log(err);
                if (!user) console.log('User is niet gevonden!');
                if (user) console.log('User is gevonden!');
                res.send(user);
            });
    }
};


