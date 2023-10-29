
var cols;
var rows;

var snake = [];
var target = [];
var snakeDirection = "";
var prevDirection = "";
var isStarted = false;
var isPaused = false;
var score = 1;
var highScore = 0;

function start() {
    onStart();
    isStarted = true;
    document.getElementById("popup").classList.add("hide");

    const canvas = document.getElementById("canvas");
    var start = {row: Math.round(rows/2), col: Math.round(cols/2)};

    var row = canvas.children[start.row];
    var col = row.children[start.col];
    col.firstChild.classList.add("snake");
    snake = [];
    snake.push([start.row, start.col]);

    
    generateTarget();

    // Start the loop
    loop();
}

function deathAnimation(index) {
    var canvas = document.getElementById("canvas");
    
    var row = canvas.children[snake[index][0]];
    var col = row.children[snake[index][1]];
    col.firstChild.classList.remove("snake");
    col.firstChild.classList.add("target");

    if(index < snake.length - 1) {
        setTimeout(function() {
            deathAnimation(index + 1);
        }, 100);
    } 
    else {
        var popup = document.getElementById("popup");
        popup.classList.remove("hide");  
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


function loop() {
    const canvas = document.getElementById("canvas");

    if(!isStarted) {
        return;
    }

    if(snakeDirection == "up") {
       moveUp(canvas);
    }
    else if(snakeDirection == "left") {
        moveLeft(canvas);
    }
    else if(snakeDirection == "down") {
        moveDown(canvas);
    }
    else {
        moveRight(canvas);
    }
    
    // Check if the loop should continue
    if (isStarted && !isPaused) {
        // If count is less than 5, pause for 1 second and then continue the loop
        setTimeout(loop, 50); 
    } 
}

function endOfGame() {
    deathAnimation(0);
    var tab = "&nbsp&nbsp&nbsp&nbsp";
    var titleMessage = document.getElementById("title-message");
    var scores = document.getElementById("scores");
    if(score > highScore) saveHighScore();
    

    titleMessage.innerHTML = "Game Over";
    scores.innerHTML = "Your Score: " + score + tab + "High Score: " + highScore;

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
        var canvas = document.getElementById("canvas");
        snake.shift();
        if(prevDirection == 'up') {
            moveUp(canvas);
        }
        else if(prevDirection == 'down') {
            moveDown(canvas);
        }
        else if(prevDirection == 'right') {
            moveRight(canvas);
        }
        else {
            moveLeft(canvas);
        }
        return true;
    }
    return false;
}


function moveUp(canvas){ 
    var row = canvas.children[snake[0][0]];
    var col = row.children[snake[0][1]];
    var targetCaught = false;
    snake.unshift([checkOverflow(snake[0][0] - 1, "row"), snake[0][1]]);

    if(snake.length > 2 && checkIfBackwards()) return;

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
        targetCaught = true;
        generateTarget();
        score++;
    }
    if(!targetCaught) {
        var tail = snake.pop();
        row = canvas.children[tail[0]];
        col = row.children[tail[1]];
        col.firstChild.classList.remove("snake");
    }
}

function moveDown(canvas) {
    var row = canvas.children[snake[0][0]];
    var col = row.children[snake[0][1]];
    var targetCaught = false;
    snake.unshift([checkOverflow(snake[0][0] + 1, "row"), snake[0][1]]);

    if(snake.length > 2 && checkIfBackwards()) return;
    
    row = canvas.children[snake[0][0]];
    col = row.children[snake[0][1]];

    if(col.firstChild.classList.contains("snake")) {
        snake.shift();
        endOfGame();
        return;
    }    
    else {col.firstChild.classList.add("snake");}

    if(col.firstChild.classList.contains("target")) {
        col.firstChild.classList.remove("target");
        targetCaught = true;
        generateTarget();
        score++;
    }
    if(!targetCaught) {
        var tail = snake.pop();
        row = canvas.children[tail[0]];
        col = row.children[tail[1]];
        col.firstChild.classList.remove("snake");
    }
}

function moveLeft(canvas) {
    var row = canvas.children[snake[0][0]];
    var col = row.children[snake[0][1]];
    var targetCaught = false;
    snake.unshift([snake[0][0], checkOverflow(snake[0][1] - 1, "col")]);

    if(snake.length > 2 && checkIfBackwards()) return;
    
    row = canvas.children[snake[0][0]];
    col = row.children[snake[0][1]];

    if(col.firstChild.classList.contains("snake")) {
        snake.shift();
        endOfGame();
        return;
    }     
    else {col.firstChild.classList.add("snake");}

    if(col.firstChild.classList.contains("target")) {
        col.firstChild.classList.remove("target");
        targetCaught = true;
        generateTarget();
        score++
    }
    if(!targetCaught) {
        var tail = snake.pop();
        row = canvas.children[tail[0]];
        col = row.children[tail[1]];
        col.firstChild.classList.remove("snake");
    }
}

function moveRight(canvas) {
    var row = canvas.children[snake[0][0]];
    var col = row.children[snake[0][1]];
    var targetCaught = false;
    snake.unshift([snake[0][0], checkOverflow(snake[0][1] + 1, "col")]);

    if(snake.length > 2 && checkIfBackwards()) return;

    var row = canvas.children[snake[0][0]];
    var col = row.children[snake[0][1]];

    if(col.firstChild.classList.contains("snake")) {
        snake.shift();
        endOfGame();
        return;
    }    
    else {col.firstChild.classList.add("snake");}
    
    if(col.firstChild.classList.contains("target")) {
        col.firstChild.classList.remove("target");
        targetCaught = true;
        generateTarget();
        score++;
    }
    if(!targetCaught) {
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
    snake.forEach((coord) => {
        if(coord[0] == rowIndex && coord[1] == colIndex) {
            foundCollision = true;
            return;
        }
    });

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
    var popup = document.getElementById("popup");
    var score = document.getElementById("scores");
    score.innerHTML= "High Score: " + highScore; 
}

function onStart() {
    const canvas = document.getElementById("canvas");
    setUpTitleScreen();
    if(isStarted) {
        isStarted = false;
        document.getElementById("popup").classList.remove("hide");   
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

document.addEventListener("keypress", (event) => {
    if(event.key == " " && !isStarted) {
        start();
    }
    if(isPaused) {
        var resumed = true;
        document.getElementById("popup").classList.add("hide");
        isPaused = false;
        loop();
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
    if(event.key == 'p' && !isPaused && !resumed) {
        isPaused = true;
        pause();
    }
});

function pause() {
    var tab = "&nbsp&nbsp&nbsp&nbsp";
    var popup = document.getElementById("popup");
    var title = document.getElementById("title-message");
    var scores = document.getElementById("scores");
    var keyText = document.getElementById("start-key");
    scores.innerHTML = "Your Score: " + score + tab + "High Score: " + highScore;
    title.innerHTML = "Paused";
    keyText.innerHTML = "Press any key to resume"
    popup.classList.remove("hide");
}


window.onload = onStart;
window.addEventListener("resize", onStart);
