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
            $('#err-msg').text('Unnable to establish a connection to a game server');
            $('.start2').css('display', 'none');
            $('.retry').css('display', 'block');
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
        scoreLabel.html("Score: " + score);
        
        if(score > parseInt($('#bestScore').text()))
        {
            $('#bestScore').text(`High Score: ${score}`);
        }
    });

    $(document).keydown((event) => {
        if(!loss){
            if(event.keyCode == 38 || event.keyCode == 87)
            {
                socket.emit('moveUp', {});
            }
            else if(event.keyCode == 39 || event.keyCode == 68)
            {
                socket.emit('moveRight', {});
            }
            else if(event.keyCode == 40 || event.keyCode == 83)
            {
                socket.emit('moveDown', {});
            }
            else if(event.keyCode == 37 || event.keyCode == 65)
            {
                socket.emit('moveLeft', {});
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

    $('.retry').click(() => {
        socket.emit('startGame', {});
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

function drawCell(cell)
{
    ctx.beginPath();
    ctx.rect(cell.x, cell.y, width, width);

    let fontColor;

    ctx.fillStyle = "#9f8b77";

    switch(cell.value)
    {
        case 0 : ctx.fillStlye = "rgb(204, 192, 179)"; fontColor = "gray"; break;
        case 2 : ctx.fillStyle = "rgb(238, 228, 218)"; fontColor = "gray"; break;
        case 4 : ctx.fillStyle = "rgb(237, 224, 200)"; fontColor = "gray"; break;
        case 8 : ctx.fillStyle = "rgb(242, 177, 121)"; fontColor = "white"; break;
        case 16 : ctx.fillStyle = "rgb(245, 149, 99)"; fontColor = "white"; break;
        case 32 : ctx.fillStyle = "rgb(246, 124, 95)"; fontColor = "white"; break;
        case 64 : ctx.fillStyle = "rgb(246, 94, 59)"; fontColor = "white"; break;
        case 128 : ctx.fillStyle = "rgb(237, 207, 114)"; fontColor = "white"; break;
        case 256 : ctx.fillStyle = "rgb(237, 204, 97)"; fontColor = "white"; break;
        case 512 : ctx.fillStyle = "rgb(237, 200, 80)"; fontColor = "white"; break;
        case 1024 : ctx.fillStyle = "rgb(237, 197, 63)"; fontColor = "white"; break;
        case 2048 : ctx.fillStyle = "rgb(237, 194, 46)"; fontColor = "white"; break;
        case 4096 : ctx.fillStyle = "rgb(0, 0, 0)"; fontColor = "white"; break;
        default : ctx.fillStyle = "rgba(70,80,161,0.8)"; fontColor = "white"; 
    }

    ctx.fill();
    if(cell.value)
    {
       fontSize = width / 2;
       ctx.font = fontSize + "px Viga";
       ctx.fillStyle = fontColor;
       ctx.textAlign = "center";
      //  ctx.textBaseline = "middle";
       ctx.fillText(cell.value, cell.x + width / 2, cell.y + width / 1.5);
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