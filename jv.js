
var canvas = $('#canvas'),
        released,
        ctx = canvas[0].getContext('2d');

sizeCanvas();
$(window).resize(sizeCanvas);
canvas.show();

function sizeCanvas() {
    theBody = $('body'),
            bodyWidth = theBody.innerWidth(),
            bodyHeight = theBody.innerHeight();
    canvas.attr("width", bodyWidth - 40);
    canvas.attr("height", bodyHeight - 100);
}
canvas.mousedown(function(e) {
    console.log(e);
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);//move to defines beginning of line lineto is the end of line and stroke draws it
    ctx.fillRect(e.offsetX, e.offsetY,1,1);//change the rect to thickness of line
    released = false;
    drawLine();

});

function drawLine() {

    canvas.mousemove(function(e) {

        if (!released) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();

        }
    });
    canvas.mouseup(function(e) {
        released = true;
    });
}