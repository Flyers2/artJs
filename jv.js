/*jslint unparam: true */
/*global $ */
var canvas = $('#canvas'),
    released,
    ctx = canvas[0].getContext('2d'),
    lines = [],
    lineArray = [],
    redoArray = [];

sizeCanvas();
$(window).resize(sizeCanvas);
canvas.show();



function sizeCanvas() {
    'use strict';
    var theBody = $('body'),
        bodyWidth = theBody.innerWidth(),
        bodyHeight = theBody.innerHeight();
    canvas.attr("width", bodyWidth - 40);
    canvas.attr("height", bodyHeight - 100);
}
function mouseBind() {
    canvas.mousedown(function(e) {
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
        console.log(e.offsetX, e.offsetY);//move to defines beginning of line lineto is the end of line and stroke draws it

        ctx.fillRect(e.offsetX, e.offsetY, 1, 1);//need to change the rect to thickness of line
        released = false;
        drawLine();

    });
}
;



mouseBind();

$('#clear').click(function() {
    eraseCanvas();
});

$('#undo').click(function() {
    undo();
});
$('#redo').click(function() {
    redo();
});
function drawLine() {

    canvas.mousemove(function(e) {

        if (!released) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            point = {X: e.offsetX, Y: e.offsetY};
            lineArray.push(point);


        }
    });
    canvas.mouseup(function(e) {
        canvas.unbind();
        lines.push(lineArray);
        lineArray = [];
        released = true;
        linesStored = JSON.stringify(lines);
        localStorage.setItem('savedLines', linesStored);
        mouseBind();
    });


}
function undo() {
    if(lines.length>0){
        redoArray.push(lines.pop());
        localStorage.setItem('savedLines', JSON.stringify(lines));
        ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);
        redraw(lines);
    }
}
function redo() {
    temp = redoArray.pop()
    tempArray=[temp];
    if(tempArray){
        lines.push(temp);
        console.log(tempArray[0]);
        localStorage.setItem('savedLines', JSON.stringify(lines));
        redraw(tempArray);
    }
}
function eraseCanvas() {
    lines = [];
    lineArray = [];
    localStorage.clear();
    console.log(localSt);
    ctx.clearRect(0, 0, canvas[0].width, canvas[0].height)
}
function redraw(arrayOfLines) {
    lines = [];
    $.each(arrayOfLines, function(i, line) {
        ctx.beginPath();
        ctx.moveTo(line[0].X, line[0].Y);
        $.each(line, function(j, point) {
            ctx.lineTo(point.X, point.Y);
            ctx.stroke();
            lineArray.push(point);
        });
        lines.push(lineArray);
        lineArray = [];
    });
}
var localSt = window.localStorage["savedLines"];
if (localSt) {
    linesArray = JSON.parse(localSt);
    redraw(linesArray);

}