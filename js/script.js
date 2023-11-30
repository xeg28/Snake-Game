
var cols;
var rows;

var snake = [];
var target = [];
var snakeDirection = "";
var prevDirection = "";
var isStarted = false;
var isPaused = false;
var score = 0;
var highScore = 0;
var frameTime = 33.3;
var lastFrameTime = 0;

function start() {
    onStart();
    isStarted = true;
    document.getElementById("title-screen").classList.add("hide");
    document.getElementById("score").innerHTML = "Score: 0";

    const canvas = document.getElementById("canvas");
    var start = {row: Math.round(rows/2), col: Math.round(cols/2)};

    var row = canvas.children[start.row];
    var col = row.children[start.col];
    col.firstChild.classList.add("snake");
    snake = [];
    snake.push([start.row, start.col]);

    
    generateTarget();

    // Start the loop
    loop(frameTime);
}

function deathAnimation(index) {
    var canvas = document.getElementById("canvas");
    
    var row = canvas.children[snake[index][0]];
    var col = row.children[snake[index][1]];
    col.firstChild.classList.remove("snake");
    col.firstChild.classList.add("death");

    if(index < snake.length - 1) {
        setTimeout(function() {
            deathAnimation(index + 1);
        }, 50);
    } 
    else {
        var titleScreen = document.getElementById("title-screen");
        titleScreen.classList.remove("hide");  
    }
} 

function saveHighScore() {
    highScore = score;
    localStorage.setItem("highScore", score.toString());
}

function setHighScore() {
    var savedHighScore = localStorage.getItem("highScore"); 
    if(savedHighScore) {
        highScore = parseInt(savedHighScore);
    }
}


function loop(timestamp) {
    const elapsed = timestamp - lastFrameTime;
    if(elapsed < frameTime) {
        requestAnimationFrame(loop);
        return;
    }
    const canvas = document.getElementById("canvas");
    var row = canvas.children[snake[0][0]];
    var col = row.children[snake[0][1]];
    if(!isStarted || isPaused) {
        return;
    }

    if(snakeDirection == "up") {
        moveDirection(canvas, row, col, -1);
    }
    else if(snakeDirection == "left") {
        moveDirection(canvas, row, col, -1);
    }
    else if(snakeDirection == "down") {
        moveDirection(canvas, row, col, 1);
    }
    else {
        moveDirection(canvas, row, col, 1);
    }
    lastFrameTime = timestamp;
    if(frameTime == 22.22) setTimeout(loop, 22.2);
    else requestAnimationFrame(loop);
}

function endOfGame() {
    deathAnimation(0);
    var tab = "&nbsp&nbsp&nbsp&nbsp";
    var titleMessage = document.getElementById("title-message");
    var scores = document.getElementById("scores");
    var keyText = document.getElementById("start-key");
    if(score > highScore) saveHighScore();
    
    titleMessage.innerHTML = "Game Over";
    scores.innerHTML = "Your Score: " + score + tab + "High Score: " + highScore;
    keyText.innerHTML = "Press space to start";

    isStarted = false;
    score = 0;  
}

function checkOverflow(val, type) {
    if(val == -1 && type == "row") { return rows - 1; }
    else if(type == "row") { return val % rows; }
    else if(val == -1 && type == "col") { return cols - 1; }
    else if(type == "col") { return val % cols; }
}

function checkIfBackwards() {
    if(snake[0][0] == snake[2][0] && snake[0][1] == snake[2][1]) {
        console.log("backwards detected");
        return true;
    }
    return false;
}


function moveDirection(canvas, row, col, shiftValue){
    if(snakeDirection == "up" || snakeDirection == "down") {
        snake.unshift([checkOverflow(snake[0][0] + shiftValue, "row"), snake[0][1]]);
    } else {
        snake.unshift([snake[0][0], checkOverflow(snake[0][1] + shiftValue, "col")]);
    }

    if(snake.length > 2 && checkIfBackwards()) {
        snake.shift();
        if(prevDirection == "down") snake.unshift([checkOverflow(snake[0][0] + 1, "row"), snake[0][1]]);
        else if(prevDirection == "up") snake.unshift([checkOverflow(snake[0][0] - 1, "row"), snake[0][1]]);
        else if(prevDirection == "left") snake.unshift([snake[0][0], checkOverflow(snake[0][1] - 1, "col")]);
        else snake.unshift([snake[0][0], checkOverflow(snake[0][1] + 1, "col")]);
    }

    row = canvas.children[snake[0][0]];
    col = row.children[snake[0][1]];

    if(col.firstChild.classList.contains("snake")){ 
        snake.shift();
        endOfGame();
        return;
    }   
    else {col.firstChild.classList.add("snake");}
    
    if(col.firstChild.classList.contains("target")){
        col.firstChild.classList.remove("target");
        generateTarget();
        score++;
        document.getElementById("score").innerHTML = "Score: " + score;
    }
    else {
        var tail = snake.pop();
        row = canvas.children[tail[0]];
        col = row.children[tail[1]];
        col.firstChild.classList.remove("snake");
    }
}


function generateTarget() {
    const canvas = document.getElementById("canvas");
    var rowIndex = Math.floor(Math.random() * rows);
    var colIndex =  Math.floor(Math.random() * cols);

    var foundCollision = false;
    for(let index = 0; index < snake.length; index++) {
        if(snake[index][0] == rowIndex && snake[index][1] == colIndex) {
            console.log("found a collision");
            foundCollision = true;
            break;
        }
    }

    if (foundCollision) {
        generateTarget();
        return;
    }

    var row = canvas.children[rowIndex];
    var col = row.children[colIndex];
    col.firstChild.classList.add("target");
    target = [rowIndex, colIndex];
}


function setUpTitleScreen() {
    setHighScore();
    var score = document.getElementById("scores");
    document.getElementById("title-message").innerHTML = "Snake Game";
    document.getElementById("start-key").innerHTML = "Press space to start";
    score.innerHTML= "High Score: " + highScore; 
}

function onStart() {
    const canvas = document.getElementById("canvas");
    score = 0;
    setUpTitleScreen();
    document.getElementById('start-key').addEventListener("touchstart", e => {
        if(!isStarted) {
            isStarted = true;
            start();
        }
    });
    if(isStarted) {
        isStarted = false;
        document.getElementById("title-screen").classList.remove("hide");   
    }

    if(isPaused) {
        isPaused = false;
    }

    while (canvas.firstChild) {
        canvas.removeChild(canvas.firstChild);
    }
    const bodyWidth = window.innerWidth;
    const bodyHeight = window.innerHeight;
    cols = Math.round(bodyWidth / 19 - 1);
    rows = Math.round(bodyHeight / 19);
    

    for(let j = 0; j < rows; j++) {
        const row = document.createElement("div");
        row.classList.add("row");
        for(let i = 0; i < cols; i++) {
            const square = document.createElement("div");
            square.classList.add("square");

            const column = document.createElement("div");
            column.classList.add("col");
            column.appendChild(square);
    
            row.appendChild(column);
        }
        canvas.appendChild(row);
    }
}

document.addEventListener("keyup", (event) => {
    let titleScreen = document.getElementById("title-screen");
    if(isPaused && !titleScreen.classList.contains('hide')) {
        var resumed = true;
        titleScreen.classList.add("hide");
        isPaused = false;
        loop();
    }
    if(event.key == 'p' && !isPaused && !resumed && isStarted) {
        isPaused = true;
        pause();
    }
});

document.addEventListener("keypress", (event) => {
    let titleScreen = document.getElementById("title-screen");
    if(event.key == " " && !isStarted && !titleScreen.classList.contains('hide')) {
        start();
    }
    if(snakeDirection != "down" && event.key == 'w') {
        prevDirection = snakeDirection;
        snakeDirection = 'up';
    }
    if(snakeDirection != "up" && event.key == 's') {
        prevDirection = snakeDirection;
        snakeDirection = 'down';
    }
    if(snakeDirection != "left" && event.key == 'd') {
        prevDirection = snakeDirection;
        snakeDirection = 'right';
    }
    if(snakeDirection != "right" && event.key == 'a') {
        prevDirection = snakeDirection;
        snakeDirection = 'left';
    }

});

function pause() {
    var tab = "&nbsp&nbsp&nbsp&nbsp";
    var titleScreen = document.getElementById("title-screen");
    var title = document.getElementById("title-message");
    var scores = document.getElementById("scores");
    var keyText = document.getElementById("start-key");
    scores.innerHTML = "Current Score: " + score + tab + "High Score: " + highScore;
    title.innerHTML = "Paused";
    keyText.innerHTML = "Press any key to resume"
    titleScreen.classList.remove("hide");
}

function speedMenu() {
    document.getElementById("title-screen").classList.toggle("hide");
    document.getElementById("speed-menu").classList.toggle("hide");
}

function controls() {
    document.getElementById("title-screen").classList.toggle("hide");
    document.getElementById("control-menu").classList.toggle("hide");
}

function changeSpeed(speed) {
    document.getElementById("title-screen").classList.toggle("hide");
    document.getElementById("speed-menu").classList.toggle("hide");
    frameTime = speed;
}


// Mobile controls
var touchstartX = 0;
var touchendX = 0;
var touchstartY = 0;
var touchendY = 0;
    
function checkDirection() {
    let totalX = touchendX - touchstartX;
    let totalY = touchendY - touchstartY;
    if(totalX === 0 && totalY === 0) return snakeDirection;
    if(totalX === 0) {
        return (totalY < 0) ? "up" : "down";
    }
    if(totalY === 0) {
        return (totalX < 0) ? "left" : "right";
    }

    if(Math.abs(totalX) > Math.abs(totalY)) return (totalX < 0) ? "left" : "right";
    else return (totalY < 0) ? "up" : "down";
}

document.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
    touchstartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchmove', e => {
    touchendX = e.changedTouches[0].screenX;
    touchendY = e.changedTouches[0].screenY;
    let directionDetected = checkDirection();
    if(prevDirection != "up" && directionDetected == "down") {
        prevDirection = snakeDirection;
        snakeDirection = directionDetected;
    }
    else if(prevDirection != "down" && directionDetected == "up") {
        prevDirection = snakeDirection;
        snakeDirection = directionDetected;
    }
    else if(prevDirection != "left" && directionDetected == "right") {
        prevDirection = snakeDirection;
        snakeDirection = directionDetected;
    }
    else if(prevDirection != "right" && directionDetected == "left") {
        prevDirection = snakeDirection;
        snakeDirection = directionDetected;
    }
});

window.onload = onStart;
window.addEventListener("resize", onStart);



