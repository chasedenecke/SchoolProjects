module.exports.html = `
    <canvas id="myCanvas" width="500" height="100" style="border:1px solid #000000;">
    </canvas>
    <img src="./hand.png" alt="Italian Trulli">
`;

module.exports.javascript = `
    var canvas = document.getElementById("myCanvas"),
    ctx = canvas.getContext("2d");

    canvas.width = 903;
    canvas.height = 657;


    var background = new Image();
    background.src = "./hand.png";

    // Make sure the image is loaded first otherwise nothing will draw.
    background.onload = function(){
        ctx.drawImage(background,0,0);   
    }

    // Draw whatever else over top of it on the canvas.
`;