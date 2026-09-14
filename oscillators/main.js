var carousel;

var domType = document.getElementById( 'type-value' );
var domFreq = document.getElementById( 'freq-value' );

var ua = navigator.userAgent;
var ios = ua.match(/iPhone|iPad|iPod/i);
var isTouch = 'ontouchstart' in document.documentElement;

var characters = [], pixi, activeCharacter;

var MOBILE_BREAKPOINT = 600; // duplicated in main.styl

var dragged = false;

af.main( {

    assets: [

        'texture/registration@2x.png',
        'texture/puppets_sine@2x.png',
        'texture/puppets_square@2x.png',
        'texture/puppets_triangle@2x.png',
        'texture/puppets_saw@2x.png',

        'image/ui_arrow.svg'


    ],

    init: function() {

        pixi = new EasyPIXI( {
            viewboxWidth: 1100 * 1.1,
            viewboxHeight: 1600 * 1.1,
        } );

        var middle = new PIXI.Graphics()

        var config = [

            {
                type: 'square',
                mouth: {
                    pattern: 'texture/puppets_square@2x.png',
                },
                body: {
                    middle: function( g ) {
                        var width = 465;
                        var height = 420;
                        g.drawRoundedRect( -width / 2, -height, width, height, 30 );
                    }
                },
                volume: -20
            },
            {
                type: 'sawtooth',
                mouthY: -125,
                mouth: {
                    pattern: 'texture/puppets_saw@2x.png',
                },
                eyeY: 220,
                body: {
                    middle: function( g ) {

                        var width = 465;
                        var height = 350;
                        var spike = 120;
                        g.moveTo( -width / 2, 0 );
                        g.lineTo( -width / 2, -height );
                        g.lineTo( -width / 6, -height - spike );
                        g.lineTo( -width / 6, -height );
                        g.lineTo( width / 6, -height - spike );
                        g.lineTo( width / 6, -height );
                        g.lineTo( width / 2, -height - spike );
                        g.lineTo( width / 2, -height );
                        g.lineTo( width / 2, 0 );
                    }
                },
                volume: -20,
                color: 0xffb729
            },
            {
                type: 'triangle',
                mouthY: -100,
                armX: 130,
                armY: -180,
                armSpacing: 70,
                armRotation: 0.6,
                mouth: {
                    pattern: 'texture/puppets_triangle@2x.png',
                    scale: 0.6,
                    radius: 0.8,
                },
                body: {
                    middle: function( g ) {

                        var width = 465;
                        var height = 465;
                        var radius = 90;
                        var c = 4 / 3 * ( Math.sqrt( 2 ) - 1 );

                        var angle = Math.atan2( height, -width / 2 );

                        g.moveTo( 195, 0 );
                        g.bezierCurveTo(
                            195 + 28, 0, // cp1
                            241, -31, // cp2
                            227, -55 // p
                        );
                        g.lineTo( 32, -394 );
                        g.bezierCurveTo(
                            25, -406,
                            12.5, -412.5,
                            0, -412.5
                        );
                        g.bezierCurveTo(
                            -25, -406,
                            -12.5, -412.5,
                            -32, -394
                        );
                        g.lineTo( -227, -55 );
                        g.bezierCurveTo(
                            -241, -31, // cp1
                            -195 -28, 0, // cp2
                            -195, 0
                        );

                        // g.moveTo( -width / 2, 0 );
                        // g.lineTo( width / 2, 0 );
                        // g.lineTo( 0, -height );

                    }
                },
                eyeY: 210,
                eyeDisplacement: 10,
                volume: -10,
                color: 0xff4582
            },

                    {
                        type: 'sine',
                        mouth: {
                            pattern: 'texture/puppets_sine@2x.png',
                        },
                        body: {
                            middle: function( g ) {

                                var width = 465;
                                var height = 420;
                                g.drawEllipse( 0, -width / 2, width / 2, width / 2 * 0.95 );
                            }
                        },
                        eyeY: 170,
                        eyeDisplacement: 30,
                        color: 0x00b6ee,
                        volume: -10
                    }
            ,

        ];



        for ( var i = 0, l = config.length; i < l; i++ ) {
            var character = new Character2( config[ i ] );
            characters.push( character );
            character.container.position.y = character.container.height / 4;
            // character.container.position.x = ( i - ( ( l - 1 ) / 2 ) ) * 800;
        }

        activeCharacter = characters[ 0 ];
        NEXT_PERCENT = 0.2;


        carousel = new Carousel( {
            children: af.pluck( characters, 'container' ),
            childWidth: pixi.viewboxWidth,
            disableFeedback: true
        } );

        carousel.on( 'change', function( i ) {
            activeCharacter = characters[ i ];
            carousel.container.addChild( activeCharacter.container );
            updateDom();
        } );
            carousel.container.addChild( activeCharacter.container );

        updateDom();

        window.addEventListener( 'resize', resize, false );
        resize();

        var start = document.querySelector('#start');

        if (isTouch && !ios) {
            start.addEventListener('touchend', init, false);
        } else {
            init();
        }

        window.parent.postMessage('loaded','*');
        window.parent.postMessage('ready','*');
    },

    loop: function() {

        carousel.update();

        for ( var i = 0, l = characters.length; i < l; i++ ) {
            characters[ i ].update();
        }

        pixi.render();

    }

} );

function init() {
    af.pointer
      .on('down', function() {
        // for ( var i = 0, l = characters.length; i < l; i++ ) {
        // var character = characters[ i ];
        carousel.disableFeedback = false;
        dragged = false;

        dx = 0;
        if (af.pointer.nx > NEXT_PERCENT && af.pointer.nx < 1.0 - NEXT_PERCENT) {
          // else {
          carousel.disableFeedback = true;
          var character = activeCharacter;
          var t = 1 - af.pointer.ny * 2;
          character.start();
          character.stretch(t);
          if (t > 0) character.jump();
          domFreq.innerHTML = Math.round(character.currentFrequency);
          // }
          // }
        }
      })
      .on('up', function() {
        if (!dragged) {
          if (af.pointer.nx < NEXT_PERCENT && carousel.activeChildIndex != 0) {
            carousel.prev();
          } else if (af.pointer.nx > 1.0 - NEXT_PERCENT && carousel.activeChildIndex != carousel.children.length - 1) {
            carousel.next();
          }
        }

        for (var i = 0, l = characters.length; i < l; i++) {
          characters[i].stop();
        }
        carousel.grabbed = false;
        // activeCharacter.stop();
        // activeCharacter = characters[( characters.indexOf( activeCharacter)+1 )%characters.length]
      })
      .on('drag', function(e) {
        var y = af.cmap(af.pointer.ny, 0, 1 - af.url.number('onehz', 0.05), 0, 1);

        var t = 1 - y * 2;

        dragged = true;

        // for ( var i = 0, l = characters.length; i < l; i++ ) {
        //     var character = characters[ i ];
        if (activeCharacter.playing) {
          activeCharacter.stretch(t);
        }

        // }
      });

    caption.style.display = 'block';

    pixi.viewbox.addChild(carousel.container);
}


function resize() {
    carousel.scale = pixi.viewbox.scale.x;
    // carousel.container.position.y = window.innerHeight / 2 - 200;
    var peekSize = window.innerWidth < MOBILE_BREAKPOINT ? 200 : 500;

    carousel.setChildWidth( window.innerWidth / 2 / carousel.scale + peekSize );
    carousel.arrive();
}

function updateDom() {

    domType.innerHTML = "'" + activeCharacter.type + "'";
    domType.style.color = activeCharacter.cssColor;
    domFreq.style.color = activeCharacter.cssColor;
}