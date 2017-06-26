/*

Copyright (C) 2013 David Dupplaw

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


*/

/**
 *	The level widget provides a means for storing
 *	and displaying a value as a needle on a dial
 * 
 * 	@author David Dupplaw <dpd@ecs.soton.ac.uk>
 *	@created December 2011
 *	@updated 28th October 2013 - Updated to latest jQuery Widget Factory
 *	@version 1.0
 */
(function($){

var MeterWidget = {
	
	/** Get the current level of the meter */
	getLevel: function() { return this.options.level; },
	
	/** Set the current meter value. */
	setLevel: function(x) 
	{
		if( this.options.useStoppers && x > this.getMaxLevel() )
			x = this.getMaxLevel();

		if( this.options.useStoppers && x < this.getMinLevel() )
			x = this.getMinLevel();
			
		if( !this.options.useEasing )
		{ 
			this.options.level = x; 
			this._updateLevel();
		}
		else
		{ 
			this._finalLevel = x;
			this._startEase();
		}
	},

	/** Get the maximum level of the meter */
	getMaxLevel: function() { return this.options.maxLevel; },
	
	/** Set the maximum level of the meter. Fixes the scaling of the meter */
	setMaxLevel: function(m) { this.options.maxLevel = m; this._updateLevel(); },

	/** Get the minimum level on the meter */
	getMinLevel: function() { return this.options.minLevel; },
	
	/** Set the minimum level of the meter. Fixes the value scaling */
	setMinLevel: function(m) { this.options.minLevel = m; this._updateLevel(); },

	/** Get the minimum angle of the needle on the meter */
	getMinAngle: function() { return this.options.minAngle; },
	
	/** Set the minimum angle of the needle on the meter */
	setMinAngle: function(a) { this.options.minAngle = m; _updateLevel(); },

	/** Get the maximum angle of the needle on the meter */
	getMaxAngle: function() { return this.options.maxAngle; },

	/** Set the maximum angle of the needle on the meter */
	setMaxAngle: function(a) { this.options.maxAngle = m; _updateLevel(); },

	/** Get the width of the widget */
	getWidth: function() { return this.options.width; },
	
	/** Set the width of the widget */
	setWidth: function(w) { this.options.width = w; this.element.width(w); this._updateLevel(); },

	/** Get the height of the widget */
	getHeight: function() { return this.options.height; },
	
	/** Set the height of the widget */
	setHeight: function(h) { this.options.height = h; this.element.height(h); this._updateLevel(); },

	/** Get the offset of the background */
	getBackgroundOffset: function() { return this.options.backgroundOffset; },

	/** Get the offset of the shadow */
	getShadowOffset: function() { return this.options.shadowOffset; },

	/** Get the image being used for the meter */
	getMeterImg: function() { return this.options.meter; },
	
	/** Get the image being used for the glass overlay */
	getGlassImg: function() { return this.options.glass; },

	/** Set the meter image to use */
	setMeterImg: function(i) 
	{ 
		var img = new Image();
		img.src = i;
		var x = this;
		img.onload = function() { x._meterImg = img; x._updateLevel(); }
	},

	/** Set the glass overlay image to use */
	setGlassImg: function(i)
	{
		var img = new Image();
		img.src = i;
		var x = this;
		img.onload = function() { x._glassImg = img; x._updateLevel(); }
	},

	/** Force an update of the display */
	_updateLevel: function() 
	{ 
		var canvas = document.getElementById(this.element.attr("id")+"_canvas");
		var ctx = canvas.getContext('2d');

		canvas.width = this.getWidth();
		canvas.height = this.getHeight();
	
		this._drawMeter( ctx );
		this._drawNeedle( ctx );
		this._drawGlass( ctx );
	},

	/** Draw the beter backdrop */
	_drawMeter: function( ctx )
	{
		var x = this.getBackgroundOffset();
		var i = this._meterImg;
		if( i ) ctx.drawImage( i, x[0], x[1] );
	},

	/** Draw the need on top of the meter */
	_drawNeedle: function( ctx )
	{
		if( this.options.useClip )
		{
			var clipping = this.options.needleClip;
			setClip( ctx, clipping );
		}

		var a = this.calculateAngle();
		var needlePos = this.options.needlePosition;

		// Draw the base of the needle
		ctx.globalAlpha = 1;
		if( this.options.showShadow )
		{
			var tt = this.getShadowOffset();
			ctx.shadowOffsetX = tt[0];
			ctx.shadowOffsetY = tt[1];
			ctx.shadowBlur = 5;
			ctx.shadowColor = 'rgba(0,0,0,0.5)';
		}
		ctx.strokeStyle = this.options.needleColour;
		ctx.fillStyle = this.options.needleColour;
		var x = this.options.needleShape;
		x = scaleShape( x, this.options.needleScale );
		x = rotateShape( x, a*0.0174532925 );
		x = translateShape( x, needlePos[0], needlePos[1] );
		fillPolygon( ctx, x );

		// Draw the needle highlights and shadows
		ctx.shadowOffsetX = ctx.shadowOffsetY = ctx.shadowBlur = 0;
		ctx.shadowColor = 'rgba(0,0,0,0)';
		ctx.fillStyle = this.options.needleHighlightColour;
		var x = this.options.needleHighlight;
		x = scaleShape( x, this.options.needleScale );
		x = rotateShape( x, a*0.0174532925 );
		x = translateShape( x, needlePos[0], needlePos[1] );
		fillPolygon( ctx, x );

		ctx.fillStyle = this.options.needleShadowColour;
		var x = this.options.needleShadow;
		x = scaleShape( x, this.options.needleScale );
		x = rotateShape( x, a*0.0174532925 );
		x = translateShape( x, needlePos[0], needlePos[1] );
		fillPolygon( ctx, x );

		// Stroke the needle
		ctx.strokeStyle = this.options.needleColour;
		var x = this.options.needleShape;
		x = scaleShape( x, this.options.needleScale );
		x = rotateShape( x, a*0.0174532925 );
		x = translateShape( x, needlePos[0], needlePos[1] );
		drawPolygon( ctx, x );
	},

	/** Draw the glass overlay */
	_drawGlass: function( ctx )
	{
		var x = this.getBackgroundOffset();
		var i = this._glassImg;
		if( i ) ctx.drawImage( i, x[0], x[1] );
	},

	/** Calculates the angle for the given level */
	calculateAngle: function()
	{
		// assumption is that 0 degrees is straight up.
		var angleDiff = this.getMaxAngle() - this.getMinAngle();
		var levelDiff = this.getMaxLevel() - this.getMinLevel();

		var levelRatio = (this.getLevel()-this.getMinLevel()) / levelDiff;

		var newAngle = angleDiff * levelRatio;

		return newAngle + this.getMinAngle();
	},
	
	/** Starts the movement of the needle to its new position */
	_startEase: function()
	{
		var f = this._finalLevel;
		var level = this.getLevel();
		
		if( Math.abs(f-level) > this.options.easeEnd )
		{
			var diff = f - level;
			level += diff * this.options.easeAmount;
			this.options.level = level;
			this._updateLevel();
			var x = this;
			var speed = this.options.easeSpeed;
			this.element.oneTime( speed, function(){
				x._startEase(); 
			});
		}
	},
	
	/** Constructor */
	_create: function() 
	{ 
		var caption = $("<p id='"+this.element.attr("id")+"_caption' class='caption'>"+this.options.title+"</p>");
		
		if( this.options.titlePosition == "above" && this.options.title != "" )
			this.element.append( caption );
		
		this.element.append( "<canvas id='"+
			this.element.attr("id")+"_canvas' />" );

		if( this.options.titlePosition == "below" && this.options.title != "" )
			this.element.append( caption );

		this.setLevel(this.getLevel()); 
		this.setWidth(this.getWidth());
		this.setHeight(this.getHeight());	
		this.setMaxLevel(this.getMaxLevel());
		this.setMinLevel(this.getMinLevel());

		this.setMeterImg( this.getMeterImg() );
		this.setGlassImg( this.getGlassImg() );
	},
	
	options: 
	{
		// The initial level of the meter
		level: 4,
	
		// Maximum and minimum values
		maxLevel: 8,
		minLevel: 0,
	
		// Specifies the maxmimum and minimum
		// value rest angles
		minAngle: -61,
		maxAngle: 61,
	
		// The width and height of the canvas
		width: 357,
		height: 185,
	
		// Offset for the drawing of the background
		// graphics, if they aren't fititng well
		backgroundOffset: [0,0],
		
		// Whether to limit the needle to the max and
		// minimum values
		useStoppers: true,
		
		// Whether to use a clipping region. Use this
		// if your needle needs to be hidden behind
		// part of your meter graphics (that aren't
		// on the glass pane)
		useClip: true,
	
		// Which image to use for the background graphics
		meter: '/images/dial-back.png',
		
		// Which image to overlay after the needle is drawn
		glass: '/images/glass.png',
	
		// Whether to add a shadow on the needle
		showShadow: true,
		
		// Whether to smoothly move the needle from
		// value to value
		useEasing: true,
		
		// Speed and smoothness of the animation
		easeAmount: 0.1,
		easeSpeed: 10,
		easeEnd: 0.01,
	
		// The colour of the needle
		needleColour: '#700',
		needleHighlightColour: '#D44',
		needleShadowColour: '#B00',
		
		// The colour of the shadow
		shadowColour: '#444',
		shadowOffset: [-2,-2],
	
		// The scale of the needle size
		// Use this to fit the needle to your
		// background graphics
		needleScale: 1.8,
	
		// The position of the needle on the
		// background graphics.
		needlePosition: [178,175],
	
		// This is the default shape of the needle, its
		// highlight and shadow regions
		needleShape: [ [2,4],[-2,4],[-4,0],[0,-70],[4,0] ],
		needleHighlight: [ [2,4],[0,4],[0,-70],[4,0] ],
		needleShadow: [ [-2,4],[0,4],[0,-70],[-4,0] ],
	
		// This is the default clipping region of the needle
		// for the supplied graphics
		needleClip: [ [0,180],[370,175],[370,0],[0,0] ],
		
		// A caption to show under the meter
		title: "",
	
		// Whether the position is above or below the widget
		titlePosition: "below"
	}
};

// ------------------------------------
// Create the widget
// ------------------------------------
$.widget("dd.meter", MeterWidget );

}(jQuery));