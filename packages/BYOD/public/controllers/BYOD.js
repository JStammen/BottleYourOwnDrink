/*globals angular, fabric, FileReader, $ */
'use strict';

angular.module('mean.BYOD')
    .controller('BYODController', ['$scope', 'Global', function ($scope, Global) {
        $scope.global = Global;
    }])
    .controller('BYODControllerStep1', ['$scope', 'Global', 'BYODservice', function ($scope, Global, BYODservice) {
        $scope.global = Global;

        /**
         * Here are our predefined bottles stored. Because there are only three bottles these are stored in the frontend controllers.
         * But it is possible to store these files as JSON elsewhere.
         * We only store the name and images of a bottle.
         * @type {{name: string, image: string, imageTop: string, imageBase: string, imageBottom: string}[]}
         */
        $scope.bottles = [
            {
                'name': 'X-02',
                'image': '/BYOD/assets/img/bottle/bottle1.PNG',
                'imageTop': '/BYOD/assets/img/bottle/bottleTop1.PNG',
                'imageBase': '/BYOD/assets/img/bottle/bottleBase1.PNG',
                'imageBottom': '/BYOD/assets/img/bottle/bottleBottom1.PNG'
            },
            {
                'name': 'Energizer',
                'image': '/BYOD/assets/img/bottle/bottle1.PNG',
                'imageTop': '/BYOD/assets/img/bottle/bottleTop1.PNG',
                'imageBase': '/BYOD/assets/img/bottle/bottleBase1.PNG',
                'imageBottom': '/BYOD/assets/img/bottle/bottleBottom1.PNG'
            },
            {
                'name': 'Berserker',
                'image': '/BYOD/assets/img/bottle/bottle1.PNG',
                'imageTop': '/BYOD/assets/img/bottle/bottleTop1.PNG',
                'imageBase': '/BYOD/assets/img/bottle/bottleBase1.PNG',
                'imageBottom': '/BYOD/assets/img/bottle/bottleBottom1.PNG'
            }
        ];

        /* It expects a bottle from the bottle list. This will get passed in the view and stored in the BYODservice
         * this will make it possible to use the chosen bottle in a new view.
         * @param bottle
         */
        $scope.selection = function (bottle) {
            BYODservice.saveBottle(bottle);

        };
    }])
    .controller('BYODControllerStep2', ['$scope', 'Global', 'BYODservice', function ($scope, Global, BYODservice) {
        $scope.global = Global;


        var imageSaver, imageLoader, canvas = new fabric.Canvas('canvas');

        /**
         * A function to retrieve the bottle from step 1 and load the top,base and bottom of the bottle directly into the canvas.
         */
        $scope.retrievePickedBottle = function () {
            $scope.bottle = BYODservice.getBottle();
            //add bottle top to canvas
            fabric.Image.fromURL($scope.bottle.imageTop, function (oImg) {
                oImg.set('selectable', false); // make object unselectable
                canvas.add(oImg);
            });
            //add bottle base to canvas
            fabric.Image.fromURL($scope.bottle.imageBase, function (oImg) {
                oImg.set('selectable', false); // make object unselectable
                canvas.add(oImg);
            });
            //add bottle bottom to canvas
            fabric.Image.fromURL($scope.bottle.imageBottom, function (oImg) {
                oImg.set('selectable', false); // make object unselectable
                canvas.add(oImg);
            });
        };

        /**
         * A function to change to colour of the bottle using a variable for the colour and an id called field,
         * which translates to the top base or bottom
         * @param colour
         * @param field
         */
        $scope.changeColour = function (colour, field) {
            document.getElementById('id' + field).style.backgroundColor = colour;
            canvas.item(field).filters.pop();
            canvas.item(field).filters.push(new fabric.Image.filters.Blend({color: colour}));
            canvas.item(field).applyFilters(canvas.renderAll.bind(canvas));
            canvas.renderAll();
        };


        /* Function to reset the canvas. It clears everything from the canvas except the bottle.
         * It loops trough every object of the canvas and deletes it if it isn't the top base or bottom
         */
        $scope.clearCanvas = function () {
            var index, list = canvas.getObjects();
            while (list.length > 3 || canvas.item(0).filters.length > 0 || canvas.item(1).filters.length > 0 || canvas.item(2).filters.length > 0) {
                for (index = 0; index < list.length; index += 1) {
                    if (index < 3) {
                        document.getElementById('id' + index).style.backgroundColor = '#FFFFFF';
                        canvas.item(index).filters.pop();
                        canvas.item(index).applyFilters(canvas.renderAll.bind(canvas));
                    } else if (((index > 2) && (canvas.item(index) instanceof fabric.Text)) || ((index > 2) && (canvas.item(index) instanceof fabric.Image))) {
                        canvas.remove(canvas.item(index));
                    }
                }
                canvas.renderAll();
            }
        };

        /**
         * Function to add text to the bottle on the canvas. Whenever the user adds the text and re-enters something else
         * The first entered text will be deleted first. If there isn't text on the canvas it will add it without deleting anything.
         * @param filledText
         */
        $scope.addText = function (filledText) {
            var index, counter = canvas.getObjects().length, list = canvas.getObjects(), text = new fabric.Text(filledText, {
                left: 150,
                top: 100,
                fontFamily: 'Calibri'
            });

            while (counter > 0) {
                for (index = 0; index < list.length; index += 1) {
                    if (canvas.item(index) instanceof fabric.Text) {
                        canvas.remove(canvas.item(index));
                    } else {
                        canvas.add(text);
                    }
                }
                canvas.renderAll();
                counter -= 1;
            }
        };

        /**
         * Function to load image into the canvas this uses FileAPI from W3C
         * @param e
         */
        function handleImage(e) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var img = new Image();
                img.onload = function () {
                    var imgInstance = new fabric.Image(img, {
                        scaleX: 0.2,
                        scaleY: 0.2
                    });
                    canvas.add(imgInstance);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        }

        imageLoader = document.getElementById('imageLoader');
        imageLoader.addEventListener('change', handleImage, false);


        /**
         * Function to save the canvas as an image to your computer.
         *
         */
        function SaveImage() {
            this.href = canvas.toDataURL({
                format: 'png',
                quality: 2.0
            });
            this.download = 'default.png';
        }

        imageSaver = document.getElementById('imageSaver');
        imageSaver.addEventListener('click', SaveImage, false);


        /**
         * function to save the created bottle using a fabric function to turn the canvas in a SVG string
         */
        $scope.saveMadeBottle = function () {
            var svgString = canvas.toSVG();
            BYODservice.saveCreatedBottle(svgString);
        };
    }])
    .controller('BYODControllerStep3', ['$scope', 'Global', 'BYODservice', function ($scope, Global) {
        $scope.global = Global;
        //var canvas = new fabric.Canvas('canvas');

        $scope.fruits = [
            {'imgsrc': '/BYOD/assets/img/fruit/banana.jpg', 'id': 1, 'name': 'banana'},
            {'imgsrc': '/BYOD/assets/img/fruit/apple.jpg', 'id': 2, 'name': 'apple'},
            {'imgsrc': '/BYOD/assets/img/fruit/pineapple.jpg', 'id': 3, 'name': 'pineapple'},
            {'imgsrc': '/BYOD/assets/img/fruit/strawberry.jpg', 'id': 4, 'name': 'strawberry'}

        ];

        $scope.dairy = [
            {'imgsrc': '/BYOD/assets/img/dairy/chocmilk.jpg', 'id': 1, 'name': 'chocolate milk'},
            {'imgsrc': '/BYOD/assets/img/dairy/milk.jpg', 'id': 2, 'name': 'milk'},
            {'imgsrc': '/BYOD/assets/img/dairy/soymilk.jpg', 'id': 3, 'name': 'soymilk'},
            {'imgsrc': '/BYOD/assets/img/dairy/yoghurt.jpg', 'id': 4, 'name': 'yoghurt'}
        ];

    }])
    .controller('PaymentController', ['$scope', '$rootScope', '$http', '$location', 'Global', 'BYODservice',
        function ($scope, $rootScope, $http, $location, Global, BYODservice) {
            // Original scaffolded code.
            $scope.global = Global;

            var link = '', linkToConfirmation = location.origin + '#!/betaling/' + $scope.global.user._id, canvaspayment = new fabric.Canvas('canvaspayment'), svg = BYODservice.getCreatedBottle();

            //function for letting only one checkbox be checked
            $scope.updateSelection = function (position, entities, obj) {
                link = obj.target.attributes.data.value;
                angular.forEach(entities, function (subscription, index) {
                    if (position !== index) {
                        subscription.checked = false;
                    }
                });
            };

            //validate zip code dutch style
            $scope.zipPattern = (function () {
                var regexp = /^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/;
                return {
                    test: function (value) {
                        if ($scope.requireZip === false) {
                            return true;
                        }
                        return regexp.test(value);
                    }
                };
            }());
            //If the form is valid open the link to confirmation page
            $scope.submitForm = function (isValid) {
                // check to make sure the form is completely valid
                if (isValid) {
                    window.open(linkToConfirmation + link);
                }

            };
            $(document).ready(function () {
                //Calculate the total price and add it to the totalsum element
                var price = $('#price').val();
                $('#productAmount').bind('keyup mouseup', function () {
                    var amount = $('#productAmount').val(), totalsum = amount * price;
                    $('#totalsum').val(totalsum);
                });
            });

            /**
             * Load the bottle onto the canvas in payment view
             */
            $scope.retrieveMadeBottle = function () {
                fabric.loadSVGFromString(svg, function (objects, options) {
                    var obj = fabric.util.groupSVGElements(objects, options);
                    obj.set('selectable', false);
                    canvaspayment.add(obj).renderAll();
                });
            };

            $http.get('/user/' + $scope.global.user._id).success(function (response) {
                console.log('Account informatie is binnen');
                console.dir(response);
                $scope.name = response.name;
                $scope.username = response.username;
                $scope.email = response.email;
            }).error(function () {
                console.log('Account informatie is niet opgehaald.');
            });

            $scope.createNewOrder = function () {
                console.log('User is creating a new order');
                //console.dir($scope.bottle);
                var testBottle = {
                    name: 'testBottle'
                };

                $http.post('/createOrder/' + $scope.global.user._id, {
                    bottle: testBottle
                })
                    .success(function (response) {
                        $scope.message = response.msg;
                        $location.url('/payment/complete/');
                    })
                    .error(function (error) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Er is iets fout gegaan bij het maken van de nieuwe bestelling');
                        }
                    });
            };
        }]);
