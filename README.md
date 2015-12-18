# BottleYourOwnDrink

CRIA project Hogeschool Arnhem Nijmegen

BottleYourOwnDrink is the project concept the SGOP will be realizing during the eight
weeks of the project. This repository contains all the source files and the different
branches.

This application is based on a MEAN.IO stack that was pulled from their website.

SETUP:

1. Clone the directory into a folder on your system.
2. Configure both MongoDB and Node.js according to the tutorials on their websites.
3. Open up a command line in the BottleYourOwnDrink root folder.
4. Retrieve all front and backend dependicies with the command: 'npm install'
5. Make sure that you have installed Gulp. If not run 'npm install gulp'.
6. Start the MongoDB service -> leave this command window open.
7. Run the command "gulp" and the application will start up -> leave this command window open as well.
8. The application will now be started on http://localhost:1337.

Possible problems:

Common troubleshooting answers can be found here: http://learn.mean.io/. This page describes the structure and use of
all the different components within this MEAN stack.

-ERR: Git is not found. Check if the Git PATH variable is correct and not corrupt.
-ERR: ECONRESET. Then you should npm config set registry 'http://registry.npmjs.org'. This will change HTTPS to HTTP.
-ERR: gulp: to solve add : "meanio": "0.7.4", and "postinstall": "node node_modules/meanio/node_modules/mean-cli/bin/mean-postinstall" in the package.json file
