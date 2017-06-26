function initCanvas(canvas) 
{
	if (window.G_vmlCanvasManager && window.attachEvent && !window.opera) 
	{
    	canvas = window.G_vmlCanvasManager.initElement(canvas);
	}
	
	return canvas;
}

function setClip( ctx, poly )
{
	if( poly.length == 0 ) return;
    ctx.beginPath();
	makePath( ctx, poly );
    ctx.closePath();
	ctx.clip();
}

function drawPolygon(ctx, poly) 
{
    if (poly.length == 0) return;
    ctx.beginPath();
    makePath( ctx, poly );
    ctx.closePath();
    ctx.stroke();
}

function fillPolygon(ctx, poly) 
{
    if (poly.length == 0) return;
    ctx.beginPath();
    makePath( ctx, poly );
    ctx.closePath();
    ctx.fill();
}

function drawLine( ctx, points )
{
    if (points.length == 0) return;
    ctx.beginPath();
    makePath( ctx, points );
	ctx.stroke();
    ctx.closePath();
}

function makePath( ctx, poly )
{
    var start = poly[0];
    ctx.moveTo(start[0], start[1]);

    for (i = 1; i < poly.length; i++)
    	ctx.lineTo(poly[i][0], poly[i][1] );
}

function drawPolygonList(ctx, polylist, color) {
    if (polylist.length == 0) return;

    if (color) ctx.strokeStyle = color;
    for (var i=0; i<polylist.length; i++)
  		drawPolygon(ctx, polylist[i]);
}

function translateShape(shape,x,y) {
    var rv = [];
    for(p in shape)
        rv.push([ shape[p][0] + x, shape[p][1] + y ]);
    return rv;
};

function rotateShape(shape,ang) {
    var rv = [];
    for(p in shape)
        rv.push(rotatePoint(ang,shape[p][0],shape[p][1]));
    return rv;
};

function rotatePoint(ang,x,y) {
    return [
        (x * Math.cos(ang)) - (y * Math.sin(ang)),
        (x * Math.sin(ang)) + (y * Math.cos(ang))
    ];
};

function scaleShape(shape,amount)
{
	var rv = [];
	for( p in shape )
		rv.push( [shape[p][0]*amount,shape[p][1]*amount] );
	return rv;
}

var arrow = [
    [ 2, 0 ],
    [ -10, -4 ],
    [ -10, 4]
];

function drawLineArrow(x1,y1,x2,y2) {
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    var ang = Math.atan2(y2-y1,x2-x1);
    drawFilledPolygon(translateShape(rotateShape(arrow,ang),x2,y2));
};

