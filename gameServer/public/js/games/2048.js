let canvas = $("#canvas")[0];
let ctx = canvas.getContext('2d');

let scoreLabel = $("#score");

let score = 0;
let size = 4;
let width = canvas.width / size - 6;

let cells = [];
let fontSize;
let loss = false;

$(() => {
    let socket = io();

    socket.on('connect', () => {
        console.log('WS Opened');
        socket.emit('updateUserData', {});
        socket.emit('startGame', {});

        setInterval(() => {
            socket.volatile.emit('updateUserData', {});
        }, (60 * 1000) * 10);
    });

    socket.on('startGameCb', (res) => {
        if(res.status == 500)
        {
            // TODO: add faild to load error msg
        }
        else if(res.status == 200)
        {
            cells = res.cells;
            size = res.size;
            score = res.score;
            $("canvas").css({"display":"block"});
            drawAllCells();
            $(".start2").css({"display":"none"});

            if(res.highScore !== undefined)
            {
                $('#bestScore').text(`High Score: ${res.highScore}`);
            }

            $('#score').text(`Score: ${res.score}`)
        }
    });

    socket.on('gameLoss', (res) => {
        cells = res.cells;
        drawAllCells();
        score = res.score;
        finishGame();
    });

    socket.on('gameData', (res) => {
        cells = res.cells;
        size = res.size;
        score = res.score;
        drawAllCells();
    });

    $(document).keydown((event) => {
        if(!loss){
            if(event.keyCode == 38 || event.keyCode == 87)
            {
                socket.emit('moveUp', {});
            } //moveUp();
            else if(event.keyCode == 39 || event.keyCode == 68)
            {
                socket.emit('moveRight', {});
            } //moveRight();
            else if(event.keyCode == 40 || event.keyCode == 83)
            {
                socket.emit('moveDown', {});
            } //moveDown();
            else if(event.keyCode == 37 || event.keyCode == 65)
            {
                socket.emit('moveLeft', {});
            } //moveLeft();
            scoreLabel.html("Score: " + score);

            if(score > parseInt($('#bestScore').text()))
            {
                $('#bestScore').text(`High Score: ${score}`);
            }
        }
    });

    $(".reset").click(() => {
        socket.emit('restartGame', {});
        $('.start2').css('display', 'none');
        $('.lose').css('display', 'none');
        loss = false;
        canvas.style.opacity = '1.0';
    });
});

function canvasClear()
{
    ctx.clearRect(0,0,300,300);
}


function finishGame()
{
    canvas.style.opacity = '0.3';
    loss = true;
    $(".lose").css({"display":"block"});
}

function drawCell(cell){
    ctx.beginPath();
    ctx.rect(cell.x, cell.y, width, width);

    let fontColor;

    ctx.fillStyle = "#384081";

    switch(cell.value)
    {
        case 0 : ctx.fillStlye = "rgb(135,200,116)"; fontColor = "white"; break;
        case 2 : ctx.fillStyle = "rgb(135,200,116)"; fontColor = "white"; break;
        case 4 : ctx.fillStyle = "rgb(95,149,212)"; fontColor = "white"; break;
        case 8 : ctx.fillStyle = "rgb(139,89,177)"; fontColor = "white"; break;
        case 16 : ctx.fillStyle = "rgb(229,195,81)"; fontColor = "white"; break;
        case 32 : ctx.fillStyle = "rgb(202,77,64)"; fontColor = "white"; break;
        case 64 : ctx.fillStyle = "rgb(108,129,112)"; fontColor = "white"; break;
        case 128 : ctx.fillStyle = "rgb(207,126,63)"; fontColor = "white"; break;
        case 256 : ctx.fillStyle = "rgb(82,125,124)"; fontColor = "white"; break;
        case 512 : ctx.fillStyle = "rgb(191,76,134)"; fontColor = "white"; break;
        case 1024 : ctx.fillStyle = "rgb(119,41,92)"; fontColor = "white"; break;
        case 2048 : ctx.fillStyle = "rgb(118,179,194)"; fontColor = "white"; break;
        case 4096 : ctx.fillStyle = "rgb(52,63,79)"; fontColor = "white"; break;
        default : ctx.fillStyle = "rgba(70,80,161,0.8)"; fontColor = "white"; 
    }

    ctx.fill();
    if(cell.value)
    {
       fontSize = width/2;
       ctx.font = fontSize + "px Viga";
       ctx.fillStyle = fontColor;
       ctx.textAlign = "center";
      //  ctx.textBaseline = "middle";
       ctx.fillText(cell.value, cell.x+width/2, cell.y+width/1.5);
    }
}

function drawAllCells()
{
    for(let i = 0; i < size; i++)
    {
        for(let j = 0; j < size; j++)
        {
            drawCell(cells[i][j]);
        }
    }
}