'use strict';
/*
  This is the main app.js for the bottle your own drink application.
 */
/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var BYOD = new Module('BYOD');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
BYOD.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  BYOD.routes(app, auth, database);

  BYOD.aggregateAsset('css', 'BYOD.css');
  BYOD.angularDependencies(['mean.system', 'ngAnimate']);

  return BYOD;
});
