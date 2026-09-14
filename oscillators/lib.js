af.Events.mixTo( Carousel.prototype );

function Carousel( opts ) {
  
    opts = af.defaults( opts, {

        children: [], 
        childWidth: 300, 
        restEasing: 0.25, 
        grabEasing: 0.8, 
        listenerTarget: window, 
        scale: 1, 
        loop: false,
        disableFeedback: false

    } );

    this.loop = opts.loop;

    this.container = new PIXI.Container();
    this.children = opts.children;
    this.childWidth = opts.childWidth;

    this.grabEasing = opts.grabEasing;
    this.restEasing = opts.restEasing;

    this.easing = this.restEasing;

    this.listenerTarget = opts.listenerTarget;
    this.disableFeedback = opts.disableFeedback;

    this.grabbed = false;

    this.grabTarget = 0;

    this.prevButton = document.createElement( 'div' );
    this.prevButton.className = 'puck-button prev';

    this.nextButton = document.createElement( 'div' );
    this.nextButton.className = 'puck-button next';
    
    container.appendChild( this.nextButton );
    container.appendChild( this.prevButton );

    this.nextListener = new PressListener( this.nextButton, this.next.bind( this ) );
    this.prevListener = new PressListener( this.prevButton, this.prev.bind( this ) );

    this.scale = opts.scale;

    for ( var i = 0, l = this.children.length; i < l; i++ ) { 
        this.container.addChild( this.children[ i ] );
    }

    this.setChildWidth( this.childWidth );
    this.bindListeners( this.listenerTarget );


    this.setActive = af.debounce( this.setActive.bind( this ), 10, true );

    this.setActive( 0 );

};

Carousel.prototype.bindListeners = function( target ) {
    
    var SWIPE_THRESH = 0.2;

    var grabbedPosition;
    var dragged = false;

    var _this = this;

    var dx = 0;
    var dy = 0;

    var $ = new Hammer.Manager( pixi.renderer.view, {
        recognizers: [
            [ Hammer.Pan, { direction: Hammer.DIRECTION_HORIZONTAL, event: 'pan', threshold: 10 } ], 
            [ Hammer.Press, { time: 5, event: 'press' } ], 
        ]
    } );

    $.on( 'press', function() {
        dx = 0;
        dy = 0;
        dragged = false;
        
        _this.grab();
        _this.grabTarget = _this.container.position.x;

        grabbedPosition = _this.grabTarget;

    } );

    $.on( 'pressup', function() {
        _this.release();

    } );

    $.on( 'panend', function( e ) {

        _this.release();

        var delta = e.deltaX / _this.scale;

        if ( activeCharacter.playing ) return; //hack

        if ( dy > dx ) return; 

        if ( -delta > 50 ) {
            _this.next();
        } else if ( delta > 50  ) {
            _this.prev();
        }
        
    } );
    
    $.on( 'pan', function( e ) {

        e.preventDefault();
        dragged = true;

        dx += Math.abs(e.pointers[0].movementX);
        dy += Math.abs(e.pointers[0].movementY);

        _this.grabTarget = grabbedPosition + e.deltaX / _this.scale;
        _this.targetXPosition = _this.grabTarget;

    } );

};

Carousel.prototype.setChildWidth = function( cw ) {
    
    this.childWidth = cw;

    for ( var i = 0, l = this.children.length; i < l; i++ ) { 
        var child = this.children[ i ];
        child.position.x = i * this.childWidth;
    }

    this.setActive( this.activeChildIndex );

};

Carousel.prototype.setActive = function( index ) {

    this.activeChildIndex = index;
    this.targetXPosition = -this.activeChildIndex * this.childWidth;

    this.fire( 'change', index );

    this.prevButton.classList.toggle( 'hidden', this.activeChildIndex === 0 );
    this.nextButton.classList.toggle( 'hidden', this.activeChildIndex === this.children.length - 1 );

};

Carousel.prototype.grab = function() {

    this.grabbed = true;

};

Carousel.prototype.release = function() {
    
    this.grabbed = false;

};

Carousel.prototype.grabMove = function( x ) {
    
    this.container.position.x = x;

};

Carousel.prototype.next = function() {

        
    var index= this.activeChildIndex + 1;

    if ( this.loop ) {
        index %= this.children.length;
    } else { 
        index = Math.min( this.children.length - 1, index );
    }


    this.setActive( index );


};

Carousel.prototype.prev = function() {
    
        
    var index= this.activeChildIndex - 1;

    if ( this.loop ) {
        if ( index < 0 ) {
            index += this.children.length;
        }
    } else { 
        index = Math.max( index, 0 );
    }

    this.setActive( index );


};

Carousel.prototype.update = function() {
  
    var target = this.grabbed ? this.grabTarget : ( -this.activeChildIndex * this.childWidth );
    this.easing = this.grabbed ? ( this.disableFeedback ? 0 : 0.5 ) : this.restEasing;

    var delta = ( target - this.container.position.x );
    var ad = Math.abs( delta );

    if ( ad > 0 && ad < 1 ) {
        this.container.position.x = target;
    } else { 
        this.container.position.x += delta * this.easing;
    }


};

Carousel.prototype.arrive = function() {
    var target = this.grabbed ? this.grabTarget : this.targetXPosition;
    this.container.position.x = target;
};
function Character( opts ) {
    
    this.container = DebugContainer();

    this.style = {
        stretch: 0, 
        open: 0, 
        vibrato: 0, 
    };

    this.body = {

        top: DebugContainer( opts.body.top ), 
        middle: DebugContainer( opts.body.middle ), 
        bottom: DebugContainer( opts.body.bottom )

    };

    this.shadow = new PIXI.Graphics();

    this.shadow.beginFill( 0xefefef );
    this.shadow.drawEllipse( 0, 0, 150, 30 );
    this.shadow.endFill();

    this.shadow.position.y = 60;

    this.container.addChild( this.shadow );


    this.bodyContainer = new PIXI.Container();



    // legs

    
    this.legs = { 
        left: this.makeLimb( 0, -55, 70, 115 ),
        right: this.makeLimb( 0, -55, 70, 115 ),
    }
    
    this.armDistance = 250;

    this.arms = { 
        left: this.makeLimb( -this.armDistance, -225, 70, 100 ),
        right: this.makeLimb( this.armDistance, -225, 70, 100 ),
    }

    this.legContainer = new PIXI.Container();

    this.jumpContainer = new PIXI.Container();
    this.jumpContainer.addChild( this.legContainer );
    this.jumpContainer.addChild( this.bodyContainer );

    this.container.addChild( this.jumpContainer );

    this.legContainer.addChild( this.legs.left );
    this.legContainer.addChild( this.legs.right );

    this.armContainer = new PIXI.Container();
    this.bodyContainer.addChild( this.armContainer );

    this.armContainer.addChild( this.arms.left );
    this.armContainer.addChild( this.arms.right );

    if ( this.body.top ) this.bodyContainer.addChild( this.body.top );
    if ( this.body.middle ) this.bodyContainer.addChild( this.body.middle );
    if ( this.body.bottom ) this.bodyContainer.addChild( this.body.bottom );

    // eyes

    this.eyes = new Eyes();
    this.eyesRestY = -this.body.middle.height + 140;
    this.eyes.container.position.y = this.eyesRestY;

    this.bodyContainer.addChild( this.eyes.container );

    // mouth

    this.mouth = new Mouth( opts.mouth );
    this.mouthRestY = -this.body.middle.height / 3;

    this.mouth.container.position.y = this.mouthRestY;

    this.bodyContainer.addChild( this.mouth.container );
    

    //

    this.jumpTimeline = new TimelineMax( { paused: true } );


    this.jumpTimeline.to( this.jumpContainer, 0.1, { rotation: -0.07, ease: Quad.easeOut } );
    this.jumpTimeline.to( this.jumpContainer, 0.15, { rotation: 0.03 } );
    this.jumpTimeline.to( this.jumpContainer, 0.2, { rotation: 0.0, ease: Quad.easeIn } );

    this.jumpTimeline.to( this.jumpContainer.position, 0.2, { y: -120, ease: Quad.easeOut }, 0 );
    this.jumpTimeline.to( this.jumpContainer.position, 0.3, { y: 0, ease: Quad.easeIn }, 0.2 );
    this.update();



};

Character.prototype.makeLimb = function( x, y, width, height ) {

    var limb = new PIXI.Graphics();
    limb.beginFill( 0x3bc16f );
    limb.drawRoundedRect( -width / 2, -15, width, height, width / 2 );
    limb.endFill();
    limb.scale.y = 1.3;

    limb.position.set( x, y -15 );

    return limb;

};

Character.prototype.update = function() {

    // this.style.open = 1;

    var t = this.style.stretch + this.style.vibrato * 0.01;

    if ( t >= 0.0 ) {
        this.body.middle.scale.y = t *1.5 + 1;
        this.body.middle.scale.x = 1 / ( t * 0.5 + 1 );
    } else { 
        this.body.middle.scale.y = 1.0 - Math.sqrt( -t ) * 0.3
        this.body.middle.scale.x = 1 / ( 1.0 - Math.sqrt( -t ) * 0.6 );
    }

    this.eyes.container.position.y = this.eyesRestY - t * 50;

    this.mouth.open.visible = this.style.playing;

    this.mouth.closed.scale.set( 1.0 - this.style.open );

    this.mouth.container.scale.x = this.body.middle.scale.x;
    this.mouth.container.scale.y = t * 0.2 + 1;


    this.legs.left.scale.x = -t * 0.3 + 1;
    this.legs.right.scale.x = -t * 0.3 + 1;
    this.legs.left.position.x = -60 + Math.max( -0.5, t ) * 30;
    this.legs.right.position.x = -this.legs.left.position.x;

    this.bodyContainer.position.y = -t * 20;

    this.shadow.scale.x = ( this.body.middle.scale.x - 1 ) * 0.5 + 1;
    this.shadow.scale.x *= 1.0 + this.jumpContainer.position.y * 0.005
    this.shadow.scale.y = 1.0 + this.jumpContainer.position.y * 0.005

    // this.mouth.closed.scale.y = this.body.middle.scale.y ;
    // this.mouth.closed.scale.x = ( this.body.middle.scale.y - 1 ) * 2 + 1;



    var circular = -af.clamp( this.style.stretch, -1.0, -0.5 ) - 0.5;
    circular /= 0.5;

    this.mouth.container.position.y = this.mouthRestY + af.lerp( 100, 0, this.style.open ) + af.lerp( 0, 28, circular );

    this.armContainer.position.y = -t * 50;
    this.arms.left.position.x = -this.armDistance * this.body.middle.scale.x - 30 - Math.min( t, 0 ) * 30;
    this.arms.right.position.x = -this.arms.left.position.x;

    this.eyes.left.position.x = -this.eyes.right.position.x;
    return;//

    this.mouth.mask.scale.x = af.lerp( 1, 0.3 * 1.5 / this.mouth.container.scale.x, circular ) * this.style.open;
    this.mouth.mask.scale.y = af.lerp( 1, 0.3 * 1.5, circular ) * this.style.open;
    this.mouth.mask.position.y = af.lerp( -150, 7, circular );
    this.mouth.black.position.y = af.lerp( 0, -40, circular );


};
function Character2( opts ) {

    opts = af.defaults( opts, {

        vibratoStrength: 50,
        minFrequency: af.url.number('min', 1),
        maxFrequency: 1500,
        type: 'square',
        volume: -20,
        color: 0x3bc16f,
        armX: 250,
        armY: -225,
        armRotation: 0,
        armSpacing: 30,
        eyeDisplacement: 50
    } );

    this.type = opts.type;
    this.minFrequency = opts.minFrequency;
    this.maxFrequency = opts.maxFrequency;
    this.color = opts.color;
    this.volume = opts.volume;
    this.armX = opts.armX;
    this.armY = opts.armY;
    this.armRotation = opts.armRotation;
    this.armSpacing = opts.armSpacing;
    this.eyeDisplacement = opts.eyeDisplacement;

    this.cssColor = this.color.toString( 16 );
    for ( var i = this.cssColor.length; i < 6; i++ ) {
        this.cssColor = '0' + this.cssColor;
    }

    this.cssColor = '#' + this.cssColor;

    this.map = new af.Map();
    this.shoulderRotationNode = new af.Node( this.map, af.Node.types.ease );

    this.stretchNode = new af.Node( this.map, af.Node.types.elastic );
    this.mouthOpenNode = new af.Node( this.map, af.Node.types.elastic );
    this.shoulderRotationNode = new af.Node( this.map, af.Node.types.ease );

    // quick fix to make the global volume quiet, otherwise you get a loud pop
    this.vol = new Tone.Volume(-50).toDestination();
    this.vol.volume.value = 0;
    this.osc = new Tone.Oscillator( {
        frequency: 440,
        type: this.type
    } ).connect(this.vol);


    this.vibrato = new Tone.LFO( '8n', -opts.vibratoStrength / 2, opts.vibratoStrength / 2 );

    this.vibrato.connect( this.osc.detune );

    if ( af.url.boolean( 'vibrato', true ) ) {
        this.vibrato.start();
    }

    ////

    this.container = DebugContainer();

    this.style = {
        stretch: 0,
        open: 0,
        vibrato: 0,
    };


    this.shadow = new PIXI.Graphics();

    this.shadow.beginFill( 0xefefef );
    this.shadow.drawEllipse( 0, 0, 150, 30 );
    this.shadow.endFill();

    this.shadow.position.y = 60;

    this.container.addChild( this.shadow );

    this.bodyContainer = new PIXI.Container();


    // legs

    this.legs = {
        left: this.makeLimb( 0, -55, 70, 115 ),
        right: this.makeLimb( 0, -55, 70, 115 ),
    }

    this.arms = {
        left: this.makeLimb( -this.armX, this.armY, 70, 100 ),
        right: this.makeLimb( this.armX, this.armY, 70, 100 ),
    }

    this.legContainer = new PIXI.Container();

    this.jumpContainer = new PIXI.Container();
    this.jumpContainer.addChild( this.legContainer );
    this.jumpContainer.addChild( this.bodyContainer );

    this.container.addChild( this.jumpContainer );

    this.legContainer.addChild( this.legs.left );
    this.legContainer.addChild( this.legs.right );

    this.armContainer = new PIXI.Container();
    this.bodyContainer.addChild( this.armContainer );

    this.armContainer.addChild( this.arms.left );
    this.armContainer.addChild( this.arms.right );


    this.body = {};

    for ( var i in opts.body ) {
        this.makeBodySegment( i, opts.body[ i ] );
    }

    // eyes

    this.eyes = new Eyes();
    this.eyesRestY = -this.body.middle.height + ( opts.eyeY || 140 );
    this.eyes.container.position.y = this.eyesRestY;

    this.bodyContainer.addChild( this.eyes.container );

    // mouth

    this.mouth = new Mouth( opts.mouth );
    this.mouthRestY = opts.mouthY || ( -this.body.middle.height / 3 );

    this.mouth.container.position.y = this.mouthRestY;

    this.bodyContainer.addChild( this.mouth.container );


    //

    this.jumpTimeline = new TimelineLite( { paused: true } );

    this.jumpFrame1 = { rotation: -0.07, ease: Quad.easeOut };
    this.jumpFrame2 = { rotation: 0.03 };
    this.jumpFramePosition = { y: 0, ease: Quad.easeOut };


    this.jumpTimeline.to( this.jumpContainer, 0.1, this.jumpFrame1 );
    this.jumpTimeline.to( this.jumpContainer, 0.15, this.jumpFrame2 );
    this.jumpTimeline.to( this.jumpContainer, 0.2, { rotation: 0.0, ease: Quad.easeIn } );

    this.jumpTimeline.to( this.jumpContainer.position, 0.2, this.jumpFramePosition, 0 );
    this.jumpTimeline.to( this.jumpContainer.position, 0.3, { y: 0, ease: Quad.easeIn }, 0.2 );


///

    this.debounceBlink = af.debounce( this.eyes.blink.bind( this.eyes ), 500, true );





///


    this.update();

};

Character2.prototype.makeBodySegment = function( key, generator ) {

    var g;

    if ( generator ) {

        g = new PIXI.Graphics();
        g.beginFill( this.color );
        generator( g );
        g.endFill();

    }

    this.body[ key ] = DebugContainer( g );
    this.bodyContainer.addChild( this.body[ key ] );

};

Character2.prototype.makeLimb = function( x, y, width, height ) {

    var limb = new PIXI.Graphics();
    limb.beginFill( this.color );
    limb.drawRoundedRect( -width / 2, -15, width, height, width / 2 );
    limb.endFill();
    limb.scale.y = 1.3;

    limb.position.set( x, y -15 );

    return limb;

};

Character2.prototype.start = function() {

    this.playing = true;

    if (Tone.context.state !== "running") {
      Tone.start();
    }

    this.osc.volume.value = -Infinity;
    this.osc.volume.rampTo( this.volume, 0.01 );

    this.vibrato.amplitude.value = 0;
    this.vibrato.amplitude.rampTo( 1, 0.7 );

    if (this.osc.state !== "started") {
        this.osc.start( 0 );
    }

    this.stretchNode.set( {
        k: 2.0,
        damping: 0.3
    } );

    this.mouthOpenNode.set( {
        k: 0.3,
        damping: 0.67,
        in: 1,
        out: 0.4
    } );

    this.debounceBlink();

};

Character2.prototype.stop = function() {

    this.playing = false;

    this.osc.volume.exponentialRampToValueAtTime( -Infinity, "+0.5" );

    this.stretchNode.set( {
        in: 0,
        k: 0.4,
        damping: 0.67
    } );

    this.mouthOpenNode.set( {
        in: 0,
        // k: 1.0,
        // damping: 0.1
    } );

    this.debounceBlink();

}

Character2.prototype.stretch = function( t ) {

    this.stretchNode.signals.in.value = af.clamp( t, -1, 1 );

    if ( this.stretchNode.signals.vel.value > 0.124 && this.stretchNode.signals.in.value > 0 ) {
        this.jump();
    }

};

Character2.prototype.jump = function() {

    if ( this.jumpTimeline.isActive() ) {
        return;
    }

    var sign = af.random.sign();

    this.jumpFrame1.rotation *= sign;
    this.jumpFrame2.rotation *= sign;

    this.jumpFramePosition.y = af.random( -90, -220 );

    this.jumpTimeline.timeScale( 1 );
    this.jumpTimeline.invalidate();
    this.jumpTimeline.restart();

};

// Welcome to magic number city!!!
Character2.prototype.update = function() {

    this.stretchNode.update();
    this.mouthOpenNode.update();
    this.shoulderRotationNode.update();

    var t = this.stretchNode.signals.out.value;

    var freq = af.cmap( t , -1, 1, this.minFrequency, this.maxFrequency );

    this.currentFrequency = freq;

    if ( this.playing && this.stretchNode.signals.out.updated ) {

        if ( af.ua.firefox )
            this.osc.frequency.value = freq;
        else
            this.osc.frequency.rampTo( freq, 0.05 );

        if ( this === activeCharacter ) domFreq.innerHTML = Math.round( this.currentFrequency );

    }

    this.style.stretch = t;
    this.style.open = this.mouthOpenNode.signals.out.value;
    this.style.vibrato = this.playing ? Math.sin( Date.now() * 0.025 ) : 0;

    this.style.shoulderRotation = this.shoulderRotationNode.signals.out.value;
    this.style.shoulderRotation += af.lerp( -1.5, -0.6, t ) + this.style.vibrato * 0.1;
    this.style.shoulderRotation *= this.style.open;

    this.shoulderRotationNode.signals.in.value = Math.max( this.stretchNode.signals.vel.value * 4.0, -Math.PI * 0.5 );

    var easing;

    if ( this.shoulderRotationNode.signals.in.value > this.arms.right.rotation ) {
        easing = this.playing ? af.map( t, -1, 1, 0.1, 0.1 ) : 1.0
    } else {
        easing = 0.6;
    }

    this.shoulderRotationNode.signals.k.value = easing;


    this.arms.right.rotation = this.style.shoulderRotation - this.armRotation;
    this.arms.left.rotation = - this.arms.right.rotation;

    this.jumpTimeline.timeScale( af.math.cmap( t, -1, 0, 6, 1 ) );
    // this.style.open = 1;

    var t = this.style.stretch + this.style.vibrato * 0.01;

    if ( t >= 0.0 ) {
        this.body.middle.scale.y = t * 1.3 + 1;
        this.body.middle.scale.x = 1 / ( t * 0.5 + 1 );
        var tt = af.pointer.down ? this.stretchNode.signals.in.value : this.stretchNode.signals.out.value;
        // this.jumpContainer.scale.set( af.math.cmap( tt, 0, 1, 1, 0.9 ) );
    } else {
        this.body.middle.scale.y = 1.0 - Math.sqrt( -t ) * 0.3
        this.body.middle.scale.x = 1 / ( 1.0 - Math.sqrt( -t ) * 0.6 );
        this.jumpContainer.scale.set( af.math.cmap( t, 0, -1, 1, 0.75 ) );
    }
        this.container.position.y = 180// + af.math.map( tt, 0, 1, 0, 130 );

    this.eyes.container.position.y = this.eyesRestY - t * this.eyeDisplacement;

    this.mouth.open.visible = this.playing;

    this.mouth.closed.scale.set( 1.0 - this.style.open );

    this.mouth.container.scale.x = this.body.middle.scale.x;


    this.mouth.container.scale.y = t * 0.2 + 1;

    this.legs.left.scale.x = -t * 0.3 + 1;
    this.legs.right.scale.x = -t * 0.3 + 1;
    this.legs.left.position.x = -60 + Math.max( -0.5, t ) * 30;
    this.legs.right.position.x = -this.legs.left.position.x;

    this.bodyContainer.position.y = -t * 20;

    this.shadow.scale.x = ( this.body.middle.scale.x - 1 ) * 0.5 + 1;
    this.shadow.scale.x *= 1.0 + this.jumpContainer.position.y * 0.003
    this.shadow.scale.y = 1.0 + this.jumpContainer.position.y * 0.003

    // this.mouth.closed.scale.y = this.body.middle.scale.y ;
    // this.mouth.closed.scale.x = ( this.body.middle.scale.y - 1 ) * 2 + 1;

    var circular = -af.clamp( this.style.stretch, -1.0, -0.5 ) - 0.5;
    circular /= 0.5;

    this.mouth.container.position.y = this.mouthRestY + af.lerp( 100, 0, this.style.open ) + af.lerp( 0, 28, circular );

    this.armContainer.position.y = -t * 50;
    this.arms.left.position.x = -this.armX * this.body.middle.scale.x - this.armSpacing - Math.min( t, 0 ) * this.armSpacing;
    this.arms.right.position.x = -this.arms.left.position.x;

    this.eyes.left.position.x = -this.eyes.right.position.x;

    this.mouth.setFrequency( t );


    if ( this.type === 'sine' ) {
        this.mouth.container.scale.x *= t >= 0 ? 0.8 : 1
        this.mouth.container.position.y = this.mouthRestY + af.lerp( 100, -20, this.style.open ) + af.lerp( 0, 28, circular );
    }

    if ( af.url.boolean( 'circular' ) ) {

        this.mouth.mask.scale.x = af.lerp( 1, 0.3 * 1.5 / this.mouth.container.scale.x, circular ) * this.style.open;
        this.mouth.mask.scale.y = af.lerp( 1, 0.3 * 1.5, circular ) * this.style.open;
        this.mouth.mask.position.y = af.lerp( -150, 7, circular );
        this.mouth.black.position.y = af.lerp( 0, -40, circular );

    }



};


function DebugContainer( child ) {
    return child || new PIXI.Container();
    
    var container = new PIXI.Container();
    if ( child ) { 
        container.addChild( child );
    }
    var registration = new PIXI.Sprite( af.assets( 'texture/registration@2x.png' ) );
    registration.tint = 0xff00ff;
    registration.alpha = 0.5;
    registration.scale.set( 0.25 );
    registration.pivot.set( registration.texture.width / 2, registration.texture.height / 2 );
    container.addChild( registration );
    return container;
};

var EasyPIXI = function( opts ) {
    
    opts = af.defaults( opts, {
        
        fullscreen: true, 

        width: window.innerWidth,   // ignored if fullscreen is true
        height: window.innerHeight, // ignored if fullscreen is true

        viewboxWidth: 800, 
        viewboxHeight: 600, 

        antialias: af.ua.pixelRatio < 2, 
        resolution: af.ua.pixelRatio, 
        backgroundColor: 0xffffff,
        transparent: false,

        container: document.getElementById( 'container' )

    } );

    PIXI.ticker.shared.autoStart = false;
    PIXI.ticker.shared.stop();

    this.renderer = PIXI.autoDetectRenderer( opts.width, opts.height, {
        antialias: opts.antialias, 
        transparent: opts.transparent, 
        resolution: opts.resolution, 
        backgroundColor: opts.backgroundColor
    } );

    this.stage = new PIXI.Container();

    this.viewbox = new PIXI.Container();
    this.viewboxWidth = opts.viewboxWidth;
    this.viewboxHeight = opts.viewboxHeight;


    this.stage.addChild( this.viewbox );

    if ( opts.fullscreen ) {
        
        window.addEventListener( 'resize', this.resizeFullscreen.bind( this ) );
        this.resizeFullscreen();

    } else { 
        
        this.setSize( opts.width, opts.height );

    }
    
    window.addEventListener( 'resize', this.updateViewbox.bind( this ) );
    this.updateViewbox();
    this.render();

    opts.container.appendChild( this.renderer.view );

};

EasyPIXI.prototype.resizeFullscreen = function() {
    
    this.setSize( window.innerWidth, window.innerHeight );

};

EasyPIXI.prototype.updateViewbox = function() {
    
    this.viewbox.position.x = this.width / 2;
    this.viewbox.position.y = this.height / 2;

    var scale = Math.min( this.width / this.viewboxWidth, this.height / this.viewboxHeight );
    this.viewbox.scale.set( scale );

};

EasyPIXI.prototype.setSize = function( width, height ) {
    
    this.width = width;
    this.height = height;

    this.renderer.resize( width, height );
    this.renderer.view.style.width = width + 'px';
    this.renderer.view.style.height = height + 'px';

};

EasyPIXI.prototype.render = function() {
  
    this.renderer.render( this.stage );

};
var Eyes = function() {

    this.container = new PIXI.Container();

    this.left = new PIXI.Graphics();

    this.left.beginFill( 0xffffff );
    this.left.drawCircle( -42, 0, 25 );
    this.left.endFill();

    this.right = new PIXI.Graphics();

    this.right.beginFill( 0xffffff );
    this.right.drawCircle( 42, 0, 25 );
    this.right.endFill();

    this.mask = new PIXI.Graphics();
    this.mask.beginFill();
    this.mask.drawRect( -400, -25, 800, 50 );
    this.mask.endFill();
    

    this.container.addChild( this.mask );
    this.container.addChild( this.left );
    this.container.addChild( this.right );

    this.left.mask = this.mask;
    this.right.mask = this.mask;

    var open = 1;

    Object.defineProperty( this, 'open', {

        get: function() {
            return open;
        }, 

        set: function( b ) {
            open = b;
            this.mask.scale.y = open;
        }

    } );

    this.blinkTimeline = new TimelineLite( {
        onComplete: this.onComplete, 
        onCompleteScope: this
    } );

    this.blinkTimeline.to( this, 0.075, { open: 0 } );
    this.blinkTimeline.to( this, 0.1, { open: 1 }, '+=0.1' );

};

Eyes.prototype.blink = function() {
    
    this.blinkTimeline.timeScale( 1.0 );
    this.blinkTimeline.restart();

};

Eyes.prototype.getRepeatDelay = function() {

    var r = af.random();

    return af.lerp( 4.0, 0.5, r * r * r );
  
};

Eyes.prototype.onComplete = function() {
  
    if ( af.random.chance( 0.1 ) ) {

        // double blink
        this.blinkTimeline.timeScale( 1.2 );
        this.blinkTimeline.delay( 0 );

    } else { 

        this.blinkTimeline.timeScale( af.random( 0.8, 1.1 ) );
        this.blinkTimeline.delay( this.getRepeatDelay() );

    }


    this.blinkTimeline.restart( true );

};
function Mouth( opts ) {



    var tex = af.assets( opts.pattern );

    this.container = DebugContainer();

    this.open = DebugContainer();

    this.pattern = new PIXI.extras.TilingSprite( tex, 800, 86 );
    this.pattern.position.y = 5;

    this.black = new PIXI.Graphics();

    this.black.beginFill( 0x000000 );
    this.black.drawRect( 0, 0, 800, 300 );
    this.black.endFill();

    var width = 400 * ( opts.scale || 1 );

    this.mask = new PIXI.Graphics();
    this.mask.beginFill();
    this.mask.drawRoundedRect( -width/2, -450/2, width, 450, 200 * ( opts.scale || 1 * opts.radius || 1 ) );
    this.mask.position.y = -150;
    this.mask.endFill();

    this.open.addChild( this.black );
    this.open.addChild( this.pattern );
    
    this.black.pivot.x = ~~( this.black.width / 2 );
    this.black.pivot.y = 60;

    this.pattern.pivot.x = ~~( this.pattern.width / 2 );
    this.pattern.pivot.y = ~~( this.pattern.height / 2 );

    this.open.mask = this.mask;

    var width = 30;
    var height = 13;

    this.closed = new PIXI.Graphics();

    this.closed.beginFill( 0xfffffff );
    this.closed.drawRoundedRect( -width / 2, -height / 2, width, height, height / 2 );
    this.closed.endFill();

    this.closed.position.y = -60;


    this.container.addChild( this.mask );
    this.container.addChild( this.closed );
    this.container.addChild( this.open );

};


Mouth.prototype.setFrequency = function( t ) {

    var tt = ( t + 1 ) / 2;
    var minSpeed = af.url.boolean( 'circular' ) ? 5 : 10;

    this.pattern.tilePosition.x -= af.lerp( minSpeed, 40, Math.pow( af.clamp( tt, 0, 1 ), 2 ) );

};
function PressListener( el, listener ) {
    
    this.el = el;

    this.listener = listener;

    this.onPress = this.onPress.bind( this );
    this.onRelease = this.onRelease.bind( this );
    
    this.on();

};

PressListener.prototype.onPress = function( e ) {
    
    e.preventDefault();
    
    this.el.classList.add( 'active' );

};

PressListener.prototype.onRelease = function( e ) {
    
    e.preventDefault();

    this.listener();
    this.el.classList.remove( 'active' );

};

PressListener.prototype.on = function() {

    this.active = true;
  
    this.el.addEventListener( 'touchstart', this.onPress, false );
    this.el.addEventListener( 'touchend', this.onRelease, false );

    this.el.addEventListener( 'mousedown', this.onPress, false );
    this.el.addEventListener( 'mouseup', this.onRelease, false );

};

PressListener.prototype.off = function() {
    
    this.active = false;
    
    this.el.removeEventListener( 'touchstart', this.onPress, false );
    this.el.removeEventListener( 'touchend', this.onRelease, false );

    this.el.removeEventListener( 'mousedown', this.onPress, false );
    this.el.removeEventListener( 'mouseup', this.onRelease, false );


};
// Perform mobile touchstart operations
(function() {
  var ua = navigator.userAgent;
  var isTouch = 'ontouchstart' in document.documentElement;
  var ios = ua.match(/iPhone|iPad|iPod/i);
  var outerDiv = document.createElement('div');
  var innerDiv = document.createElement('div');

  var style = document.createElement('style');
  style.innerText = '#start:active, #start:focus { transform: scale(1.1); };';
  document.head.appendChild(style);

  if (isTouch || ios) {
    outerDiv.style.top = 0;
    outerDiv.style.left = 0;
    outerDiv.style.position = 'absolute';
    outerDiv.style.height = '100%';
    outerDiv.style.width = '100%';
    outerDiv.style.textAlign = 'center';
    outerDiv.style.zIndex = 99999;

    innerDiv.style.borderRadius = '5px';
    innerDiv.style.font = 'normal 4vmin/6vmin Poppins, Helvetica, Arial';
    innerDiv.style.color = 'white';
    innerDiv.style.margin = '0 auto';
    innerDiv.style.zIndex = 999;
    innerDiv.style.textAlign = 'center';
    innerDiv.style.padding = '10px';

    if (ios) {
      innerDiv.style.background = '#707070';
      innerDiv.style.marginTop = '15%';
      innerDiv.style.width = '75%';
      innerDiv.innerText = 'Heads up — if you have your iOS device in Silent Mode, audio playback is affected.';
    } else {
      outerDiv.style.display = 'flex';
      outerDiv.style.alignItems = 'center';
      outerDiv.style.background = '#fff';
      innerDiv.style.padding = '0';
      innerDiv.id = 'start';
      innerDiv.style.width = '5pc';
      innerDiv.style.height = '5pc';
      innerDiv.style.display = 'flex';
      innerDiv.style.alignItems = 'center';
      innerDiv.style.justifyContent = 'center';
      innerDiv.style.lineHeight = '5pc';
      innerDiv.style.backgroundColor = '#fff';
      innerDiv.style.boxShadow = '0 0 10px 0 rgba(0, 0, 0, 0.4)';
      innerDiv.style.borderRadius = '50%';
      innerDiv.style.color = '#646464';
      innerDiv.style.transition = 'transform .05s ease-in';
      innerDiv.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
    }

    outerDiv.appendChild(innerDiv);
    document.body.appendChild(outerDiv);
  }

  var start = !ios && isTouch ? document.querySelector('#start') : window;
  var event = !ios && isTouch ? 'touchend' : 'touchstart';

  start.addEventListener(event,
    function firstTouch() {
      innerDiv.style.display = 'none';
      outerDiv.style.display = 'none';

      start.removeEventListener(event, firstTouch, false);
    },
    false
  );
})();

//# sourceMappingURL=sourcemaps/lib.js.map
