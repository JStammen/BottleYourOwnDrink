'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    async = require('async'),
    config = require('meanio').loadConfig(),
    crypto = require('crypto'),
    nodemailer = require('nodemailer'),
    templates = require('../template');

exports.test = function (req, res) {  //
    console.log('Received a front end request');
    res.send('Request has arrived at the backend.');
};

/**
 * This function retrieves a single user that can be send back as JSON in a response.
 *
 * @param userID the filter for finding the user.
 */
function getSingleUser(userID) {
    //Create userID objectID
    var id = mongoose.Types.ObjectId(userID);
    User
        .findOne({
            _id: id
        })
        .exec(function (err, user) {
            if (err) console.log(err);
            if (!user) console.log('User is not found!');
            if (user) console.log('User is found!!');
            return user;
        });
}

/**
 * Update the users profile information and return the updated user object.
 */
exports.updateProfileInformation = function (req, res) {
    console.log('Received a change profile information post');
    if (req.params.userID) {
        //User ID pushed into a ObjectId object
        var userID = mongoose.Types.ObjectId(req.params.userID);
        //Qeury variables set
        var conditions = {_id: userID},
            update = {email: req.body.email, username: req.body.username, name: req.body.name},
            options = {};

        User.update(conditions, update, options).exec(function (err) {
            console.log('User is updated trying to retrieve him.');
            var user = getSingleUser(userID);
            res.send(user);
        });
    }
};
/**
 * Change the users password
 */
exports.changePassword = function (req, res) {
    console.log('Received a change password request');

    //Validating the req passwords
    req.assert('password', 'Wachtwoord moet tussen de 8-20 karakters zijn.').len(8, 20);
    req.assert('confirmPassword', 'Wachtwoorden zijn niet gelijk').equals(req.body.password);

    //Send possible errors
    var errors = req.validationErrors();
    if (errors) {
        return res.send(errors);
    } else if (req.params.userID && !errors) {
        var userID = mongoose.Types.ObjectId(req.params.userID);
        //HASH the password
         User
            .findOne({
                _id: userID
            })
            .exec(function (err, user) {
                if (err) console.log(err);
                if (!user) console.log('User is not found!');
                if (user) console.log('User is found!!');

                var salt = user.salt;
                var hashed_password = crypto.pbkdf2Sync(req.body.password, salt, 10000, 64).toString('base64');

                console.log('Hash is complete, now storing the new password in the database');
                var conditions = {_id: userID},
                    update = {hashed_password: hashed_password},
                    options = {};

                User.update(conditions, update, options).exec(function (err) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    } else {
                        res.json({
                            msg: 'Uw wachtwoord is nu bijgewerkt'
                        });
                    }
                });
            });
    }
};

/**
 *This retrieves a single user for the profile dashboard
 *
 * @param req contains information on the requesting page element.
 * @param res This is the response that gets send back to the front end and
 *           will be interpreted by the controller there
 */
exports.getProfileInformation = function (req, res) {  //
    console.log('Received a profile information request');
    console.log('Profile ID: ' + req.params.userID);

    if (req.params.userID) {
        var id = mongoose.Types.ObjectId(req.params.userID);
        User
            .findOne({
                _id: id
            })
            .exec(function (err, user) {
                if (err) console.log(err);
                if (!user) console.log('User is not found!');
                if (user) console.log('User is found!!');
                res.send(user);
            });
    }
};

/**
 * Change the users password
 */
exports.sendSwagger = function (req, res) {
    //var swaggerJSON = 'users/swagger.json';
    //console.dir(swaggerJSON);

    var options = {
        root: __dirname,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    var fileName = 'swagger.json';

    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            console.log('Sent:', fileName);
        }
    });
    //res.sendfile('users/swagger.json');
};

/**
 * This mmethod creates a new order within the user
 *
 * @param req contains information on the requesting page element.
 * @param res This is the response that gets send back to the front end and
 *           will be interpreted by the controller there
 */
exports.createNewOrder = function (req, res) {  //
    console.log('Order placement call received');

    if (req.params.userID) {
        var userID = mongoose.Types.ObjectId(req.params.userID);
        User
            .findOne({
                _id: userID
            })
            .exec(function (err, user) {
                if (err) console.log(err);
                if (!user) console.log('User is not found!');
                if (user) console.log('User is found!!');

                console.log('BottleType: ' + req.body.bottle.name);
                //Order insertables
                var orderID = 1,
                    //orderDate =  Date.now,
                    bottleType = 'Test bottle type',
                    orderAmount = 1,
                    orderPrice = 10,
                    bottle = {
                        name: 'testBottle'
                    };

                //TODO use these variables
                //var orderID = 1,
                //    orderDate =  Date.now,
                //    bottleType = req.body.bottleType,
                //    orderAmount = req.body.orderAmount,
                //    orderPrice = req.boddy.orderPrice,
                //    bottle = req.body.bottle;

                console.log('Inserting new order into the user.');
                //Queury updateables
                var conditions = {_id: userID},
                    //update = { $push: {orderID : orderID, orderDate: orderDate, bottleType: bottleType, orderAmount: orderAmount, orderPrice: orderPrice, bottle : bottle}},
                    update = { $set: { 'orders.$.orderID' : orderID, 'orders.$.orderDate' : '01-01-2015', 'orders.$.bottleType' : bottleType, 'orders.$.orderAmount' : orderAmount, 'orders.$.orderPrice' : orderPrice, 'orders.$.bottle' : bottle} },
                    options = {};

                User.update(conditions, update, options).exec(function (err) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    } else {
                        console.log('Order has been added to the user.');
                        res.json({
                            msg: 'Uw bestelling is succesvol opgenomen'
                        });
                    }
                });
            });
    }
};

/**
 * Auth callback
 */
exports.authCallback = function (req, res) {
    res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.redirect('#!/login');
};

/**
 * Logout
 */
exports.signout = function (req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * Session
 */
exports.session = function (req, res) {
    res.redirect('/');
};

/**
 * Create user
 */
exports.create = function (req, res, next) {
    var user = new User(req.body);

    user.provider = 'local';

    // because we set our user.provider to local our models/user.js validation will always be true
    req.assert('name', 'Je moet een naam invullen').notEmpty();
    req.assert('email', 'Je moet een valide e-mail opgeven').isEmail();
    req.assert('password', 'Wachtwoord moet tussen de 8-20 karakters zijn.').len(8, 20);
    req.assert('username', 'Gebruikersnaam kan niet langer zijn dan 20 karakters').len(1, 20);
    req.assert('confirmPassword', 'Wachtwoorden zijn niet gelijk').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }

    // Hard coded for now. Will address this with the user permissions system in v0.3.5
    user.roles = ['authenticated'];
    user.save(function (err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    res.status(400).json([{
                        msg: 'Gebruikersnaam is al in gebruik',
                        param: 'username'
                    }]);
                    break;
                default:
                    var modelErrors = [];

                    if (err.errors) {

                        for (var x in err.errors) {
                            modelErrors.push({
                                param: x,
                                msg: err.errors[x].message,
                                value: err.errors[x].value
                            });
                        }

                        res.status(400).json(modelErrors);
                    }
            }

            return res.status(400);
        }
        req.logIn(user, function (err) {
            if (err) return next(err);
            return res.redirect('/');
        });
        res.status(200);
    });
};
/**
 * Send User
 */
exports.me = function (req, res) {

    res.json(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function (req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function (err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Gebruiker kan niet geladen worden: ' + id));
            req.profile = user;
            next();
        });
};

/**
 * Resets the password
 */

exports.resetpassword = function (req, res, next) {
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, function (err, user) {
        if (err) {
            return res.status(400).json({
                msg: err
            });
        }
        if (!user) {
            return res.status(400).json({
                msg: 'Token invalid or expired'
            });
        }
        req.assert('password', 'Wachtwoord moet tussen de 8 en 20 karakters zijn').len(8, 20);
        req.assert('confirmPassword', 'Wachtwoorden zijn niet gelijk').equals(req.body.password);
        var errors = req.validationErrors();
        if (errors) {
            return res.status(400).send(errors);
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.save(function (err) {
            req.logIn(user, function (err) {
                if (err) return next(err);
                return res.send({
                    user: user
                });
            });
        });
    });
};

/**
 * Send reset password email
 */
function sendMail(mailOptions) {
    var transport = nodemailer.createTransport(config.mailer);
    transport.sendMail(mailOptions, function (err, response) {
        if (err) return err;
        return response;
    });
}

/**
 * Callback for forgot password link
 */
exports.forgotpassword = function (req, res, next) {
    async.waterfall([

            function (done) {
                crypto.randomBytes(20, function (err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function (token, done) {
                User.findOne({
                    $or: [{
                        email: req.body.text
                    }, {
                        username: req.body.text
                    }]
                }, function (err, user) {
                    if (err || !user) return done(true);
                    done(err, user, token);
                });
            },
            function (user, token, done) {
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                user.save(function (err) {
                    done(err, token, user);
                });
            },
            function (token, user, done) {
                var mailOptions = {
                    to: user.email,
                    from: config.emailFrom
                };
                mailOptions = templates.forgot_password_email(user, req, token, mailOptions);
                sendMail(mailOptions);
                done(null, true);
            }
        ],
        function (err, status) {
            var response = {
                message: 'Mail is verstuurd',
                status: 'success'
            };
            if (err) {
                response.message = 'Gebruiker bestaat niet';
                response.status = 'danger';
            }
            res.json(response);
        }
    );
};
