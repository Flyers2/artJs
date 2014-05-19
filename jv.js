/*jslint unparam: true */
/*global $ */
var canvas = $('#canvas'),
    released,
    ctx = canvas[0].getContext('2d'),
    lines = [],
    lineArray = [],
    redoArray = [],
    color = 'black';

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
    redraw(lines);
}
function mouseBind() {
    canvas.mousedown(function(e) {
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
        console.log(e.offsetX, e.offsetY);//move to defines beginning of line lineto is the end of line and stroke draws it
        //ctx.fillRect(e.offsetX, e.offsetY, 1, 1);//need to change the rect to thickness of line
        released = false;
        drawLine();
    })
}
;


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
            deleteStack = true;
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.strokeStyle = color;
            ctx.stroke();
            var point = {X: e.offsetX, Y: e.offsetY, color: color};
            lineArray.push(point);

        }
        if (deleteStack === true) {
            redoArray = [];
            (deleteStack === false);
        }
    });
    canvas.mouseleave(function(e) {
        stopDraw();
    });
    canvas.mouseup(function(e) {
        console.log("up");
        stopDraw();
    });


}
//canvas.mouseenter(function(){
//    if(mouseLeft=true && is mouse currently down then startdraw)
//})
function stopDraw() {
    canvas.unbind();
    lines.push(lineArray);
    lineArray = [];
    released = true;
    linesStored = JSON.stringify(lines);
    localStorage.setItem('savedLines', linesStored);
    $.post('savedArt.php', {drawings: linesStored}, function(data) {
        console.log(data + " this was data")
    });
    mouseBind();
}
function undo() {
    if (lines.length > 0) {
        redoArray.push(lines.pop());
        localStorage.setItem('savedLines', JSON.stringify(lines));
        ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);
        redraw(lines);
    }
}
function redo() {
    temp = redoArray.pop();
    if (temp) {
        tempArray = [temp];
        lines.push(temp);
        console.log(tempArray[0]);
        localStorage.setItem('savedLines', JSON.stringify(lines));
        redraw(lines);
    }
}
function eraseCanvas() {
    lines = [];
    lineArray = [];
    localStorage.clear();
    ctx.clearRect(0, 0, canvas[0].width, canvas[0].height)
}
function redraw(arrayOfLines) {
    lines = [];//without this lines will just add all the stuff on top of what it has
    $.each(arrayOfLines, function(i, line) {
        ctx.beginPath();
        ctx.moveTo(line[0].X, line[0].Y);
        $.each(line, function(j, point) {
            ctx.lineTo(point.X, point.Y);
            ctx.strokeStyle = point.color;
            ctx.stroke();
            lineArray.push(point);
        });
        lines.push(lineArray);
        lineArray = [];
    });
}
function drawFromLocal() {
    var localSt = window.localStorage["savedLines"];
    if (localSt) {
        linesArray = JSON.parse(localSt);

        redraw(linesArray);
    }
}
//drawFromLocal();


$('.colorClass').each(function() {
    $(this).css("background-color", this.id);
    $(this).click(function() {
        color = this.value;
        ctx.strokeStyle = color;
        $('input[type=color]').val(color);
    });
});

$('input[type=color]').change(function() {
    color = this.value;
    ctx.strokeStyle = color;
});

mouseBind();
 