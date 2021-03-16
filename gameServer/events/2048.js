let UserGameData = require('../models/user_game_data');
let User = require('../models/user');
let UserData = require('../models/user_data');
let utils = require('../utils/functions');
let Cell = require('./objects/2048/cell');

module.exports = (socket, io) => {
    // GET USER MOONGOSE DB ID
    let userId = socket.request.session.passport.user;

    /* GAME DATA */
    let size = 4;
    let cells = [];
    let score = 0;
    let width = 300 / 4 - 6;
    let loss = false;

    function createCells(width)
    {
        for(let i = 0; i < size; i++)
        {
            cells[i] = [];
            for(let j = 0; j < size; j++)
            {
                cells[i][j] = new Cell(i, j, width);
            } 
        } 
    }

    function pasteNewCell()
    {
        let countFree = 0;
        let i, j;
        for(i = 0; i < size; i++)
        {
            for(j = 0; j < size; j++)
            {
                if(!cells[i][j].value)
                {
                    countFree++;
                }
            }
        }

        if(!countFree)
        {
            loss = true;
            // Wipe SaveGame
            UserGameData.findOne({ userId: userId }, (err, data) => {
                if(err)
                {
                    console.error(err);
                }
                else
                {
                    if(data)
                    {
                        if(score > data.game2048.highScore)
                        {
                            data.game2048.highScore = score;
                        }

                        data.set('game2048.saveGame.score', 0);
                        data.set('game2048.saveGame.cells', []);

                        data.markModified('game2048');

                        data.save((err) => {
                            if(err) console.error(err);
                        });
                    }
                }
            });

            User.findOne({ _id: userId }, (err, usr) => {
                if(err)
                {
                    console.error(err);
                }
                else
                {
                    if(usr)
                    {
                        let user = usr;
                        UserData.findOne({ user_id: user.discordId }, (err, data) => {
                            if(err)
                            {
                                console.error(err);
                            }
                            else
                            {
                                let xpReward = Math.floor(score * 0.1);
                                if(xpReward > 1500)
                                {
                                    xpReward = Math.floor(score * 0.05);
                                }
                                
                                if(xpReward > 25000)
                                {
                                    xpReward = Math.floor((score / 100) * 0.25);
                                }
                                
                                if(data)
                                {
                                    let newXpTotal = data.xp + xpReward;
                                    data.xp = newXpTotal;
                                    let nextLevelXpNeeded = utils.getLevel(data.level + 1);

                                    if(newXpTotal >= nextLevelXpNeeded)
                                    {
                                        let levelUps = 1;
                                        for(let i = data.level + 2; i < 10; i++)
                                        {
                                            let xpNeeded = utils.getLevel(i);
                                            if(newXpTotal >= xpNeeded)
                                            {
                                                levelUps++;
                                            }
                                        }

                                        data.level = data.level + levelUps;
                                        data.markModified('xp');
                                        data.markModified('level');
                                        data.save((err) => {
                                            if(err) console.error(err);
                                        });
                                    }
                                    else
                                    {
                                        data.markModified('xp');
                                        data.save((err) => {
                                            if(err) console.error(err);
                                        });
                                    }
                                }
                                else
                                {
                                    let userData = new UserData({
                                        user_id: user.discordId,
                                        username: user.username,
                                        xp: xpReward,
                                        level: 0,
                                        last_rewarded: Math.floor(new Date().getTime() / 1000.0)
                                    });

                                    userData.xp = xpReward;
                                    let nextLevelXpNeeded = utils.getLevel(userData.level + 1);

                                    if(xpReward >= nextLevelXpNeeded)
                                    {
                                        let levelUps = 1;
                                        for(let i = userData.level + 2; i < 10; i++)
                                        {
                                            let xpNeeded = utils.getLevel(i);
                                            if(newXpTotal >= xpNeeded)
                                            {
                                                levelUps++;
                                            }
                                            else
                                            {
                                                return;
                                            }

                                            userData.level = userData.level + levelUps;
                                            userData.save((err) => {
                                                if(err) console.error(err);
                                            });
                                        }
                                    }
                                    else
                                    {
                                        userData.save((err) => {
                                            if(err) console.error(err);
                                        });
                                    }
                                }
                            }
                        });
                    }
                }
            });

            socket.emit('gameLoss', {
                cells: cells,
                score: score
            });
            return;
        }

        while(true)
        {
            let row = Math.floor(Math.random() * size);
            let col = Math.floor(Math.random() * size);
            if(!cells[row][col].value)
            {
                cells[row][col].value = 2 * Math.ceil(Math.random() * 2);
                return;
            }
        }
    }

    function lostGame()
    {
        let countFree = 0;
        let i, j;
        for(i = 0; i < size; i++)
        {
            for(j = 0; j < size; j++)
            {
                if(!cells[i][j].value)
                {
                    countFree++;
                }
            }
        }

        if(!countFree)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    socket.on('restartGame', async (data) => {
        // Just Reset no XP Reward
        cells = [];
        score = 0;
        await createCells(width);
        pasteNewCell();
        pasteNewCell();

        socket.emit('gameData', {
            cells: cells,
            size: size,
            score: score,
            width: width
        });
        
        saveGameState();
    });

    socket.on('startGame', (data) => {
        UserGameData.findOne({ userId: userId }, (err, data) => {
            if(err)
            {
                socket.emit('startGameCb', {
                    status: 500
                });
            }
            else
            {
                if(data)
                {
                    if(data.game2048.saveGame.cells.length > 0)
                    {
                        // Get Save Game
                        score = data.game2048.saveGame.score;
                        width = data.game2048.saveGame.width;
                        size = data.game2048.saveGame.size;
                        savedCells = data.game2048.saveGame.cells;
                        createCells(width);
                        let cell = 0;

                        for(i = 0; i < size; i++)
                        {
                            for(j = 0; j < size; j++)
                            {
                                cells[i][j].value = savedCells[cell].value;
                                cells[i][j].x = savedCells[cell].x;
                                cells[i][j].y = savedCells[cell].y;
                                cell++;
                            }
                        }

                        socket.emit('startGameCb', {
                            status: 200,
                            cells: cells,
                            size: size,
                            score: score,
                            highScore: data.game2048.highScore,
                            width: width
                        });
                    }
                    else
                    {
                        // Create New Game
                        createCells(width);
                        pasteNewCell();
                        pasteNewCell();
                        socket.emit('startGameCb', {
                            status: 200,
                            cells: cells,
                            size: size,
                            score: score,
                            width: width
                        });
                    }
                }
                else
                {
                    // Create New Game and UserGameData
                    createCells(width);
                    pasteNewCell();
                    pasteNewCell();
                    socket.emit('startGameCb', {
                        status: 200,
                        cells: cells,
                        size: size,
                        score: score,
                        width: width
                    });
                }
            }
        });
    });

    socket.on('moveLeft', (data) => {
        let i, j, col;
        for(i = 0; i < size; i++)
        {
            for(j = 1; j < size; j++)
            {
                if(cells[i][j].value)
                {
                    col = j;
                    while(col - 1 >= 0)
                    {
                        if(!cells[i][col - 1].value)
                        {
                            cells[i][col - 1].value = cells[i][col].value;
                            cells[i][col].value = 0;
                            col--;
                        }
                        else if(cells[i][col].value == cells[i][col - 1].value)
                        {
                            cells[i][col - 1].value *= 2;
                            score +=   cells[i][col - 1].value;
                            cells[i][col].value = 0;
                            break;
                        }
                        else
                        {
                            break; 
                        }
                    }
                }
            }
        }

        pasteNewCell();
        socket.emit('gameData', {
            cells: cells,
            size: size,
            score: score,
            width: width
        });
    });

    socket.on('moveRight', (data) => {
        let i, j, col;
        for(i = 0; i < size; i++)
        {
            for(j = size - 2; j >= 0; j--)
            {
                if(cells[i][j].value)
                {
                    col = j;
                    while(col + 1 < size)
                    {
                        if(!cells[i][col + 1].value)
                        {
                            cells[i][col + 1].value = cells[i][col].value;
                            cells[i][col].value = 0;
                            col++;
                        }
                        else if (cells[i][col].value == cells[i][col + 1].value)
                        {
                            cells[i][col + 1].value *= 2;
                            score +=  cells[i][col + 1].value;
                            cells[i][col].value = 0;
                            break;
                        }
                        else
                        {
                            break;
                        }
                    }
                }
            }
        }

        pasteNewCell();
        socket.emit('gameData', {
            cells: cells,
            size: size,
            score: score,
            width: width
        });
    });

    socket.on('moveUp', (data) => {
        let i, j, row;
        for(j = 0; j < size; j++)
        {
            for(i = 1; i < size; i++)
            {
                if(cells[i][j].value)
                {
                    row = i;
                    while(row > 0)
                    {
                        if(!cells[row - 1][j].value)
                        {
                            cells[row - 1][j].value = cells[row][j].value;
                            cells[row][j].value = 0;
                            row--;
                        }
                        else if (cells[row][j].value == cells[row - 1][j].value)
                        {
                            cells[row - 1][j].value *= 2;
                            score +=  cells[row - 1][j].value;
                            cells[row][j].value = 0;
                            break;
                        }
                        else
                        {
                            break; 
                        }
                    }
                }
            }
        }

        pasteNewCell();
        socket.emit('gameData', {
            cells: cells,
            size: size,
            score: score,
            width: width
        });
    });

    socket.on('moveDown', (data) => {
        let i, j, row;
        for(j = 0; j < size; j++)
        {
            for(i = size - 2; i >= 0; i--)
            {
                if(cells[i][j].value)
                {
                    row = i;
                    while(row + 1 < size)
                    {
                        if(!cells[row + 1][j].value)
                        {
                            cells[row + 1][j].value = cells[row][j].value;
                            cells[row][j].value = 0;
                            row++;
                        }
                        else if (cells[row][j].value == cells[row + 1][j].value)
                        {
                            cells[row + 1][j].value *= 2;
                            score +=  cells[row + 1][j].value;
                            cells[row][j].value = 0;
                            break;
                        }
                        else
                        {
                            break; 
                        }
                    }
                }
            }
        }

        pasteNewCell();
        socket.emit('gameData', {
            cells: cells,
            size: size,
            score: score,
            width: width
        });
    });

    socket.on('disconnecting', () => {
        saveGameState();
    });

    function saveGameState()
    {
        UserGameData.findOne({ userId: userId }, (err, data) => {
            if(err)
            {
                console.error(err);
            }
            else
            {
                if(data && !lostGame())
                {
                    if(data.game2048.saveGame.cells.length > 0)
                    {
                        let saveCells = [];

                        for(i = 0; i < size; i++)
                        {
                            for(j = 0; j < size; j++)
                            {
                                saveCells.push({
                                    value: cells[i][j].value,
                                    x: cells[i][j].x,
                                    y: cells[i][j].y
                                });
                            }
                        }

                        data.game2048.saveGame = {                           
                            score: score,
                            width: width,
                            size: size,
                            cells: saveCells
                        };

                        if(score > data.game2048.highScore)
                        {
                            data.game2048.highScore = score;
                        }

                        data.markModified('game2048');

                        data.save((err) => {
                            if(err) console.error(err);
                        });
                    }
                    else
                    {
                        if(cells.length > 0)
                        {
                            let saveCells = [];

                            for(i = 0; i < size; i++)
                            {
                                for(j = 0; j < size; j++)
                                {
                                    saveCells.push({
                                        value: cells[i][j].value,
                                        x: cells[i][j].x,
                                        y: cells[i][j].y
                                    });
                                }
                            }

                            if(score > data.game2048.highScore)
                            {
                                data.game2048.highScore = score;
                            }

                            data.game2048.saveGame = {
                                score: score,
                                width: width,
                                size: size,
                                cells: saveCells
                            };
                            data.markModified('game2048');

                            data.save((err) => {
                                if(err) console.error(err);
                            });
                        }
                    }
                }
                else
                {
                    if(!lostGame())
                    {
                        let saveCells = [];

                        for(i = 0; i < size; i++)
                        {
                            for(j = 0; j < size; j++)
                            {
                                saveCells.push({
                                    value: cells[i][j].value,
                                    x: cells[i][j].x,
                                    y: cells[i][j].y
                                });
                            }
                        }

                        let gameData = new UserGameData({
                            userId: userId,
                            game2048: {
                                highScore: score,
                                saveGame: {
                                    score: score,
                                    width: width,
                                    size: size,
                                    cells: saveCells
                                }
                            }
                        });

                        gameData.save((err) => {
                            if(err) console.error(err);
                        });
                    }
                }
            }
        });
    }
}