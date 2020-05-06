function newGame() {
    const gameHeight = document.getElementById("canvasHeight").value;
    const gameWidth = document.getElementById("canvasWidth").value;
    const CANVAS_BORDER_COLOUR = 'black';
    const CANVAS_BACKGROUND_COLOUR = 'white';
    const SNAKE_COLOUR = 'lightgreen';
    const SNAKE_BORDER_COLOUR = 'darkgreen';
    const FOOD_COLOUR = 'red';
    const FOOD_BORDER_COLOUR = 'darkred';
    displayScore();

    // Set game speed
    let speedValue;
    if (document.getElementById("easy").checked) {
        speedValue = document.getElementById("easy").value;
    }
    if (document.getElementById("medium").checked) {
        speedValue = document.getElementById("medium").value;
    }
    if (document.getElementById("hard").checked) {
        speedValue = document.getElementById("hard").value;
    }
    const GAME_SPEED = speedValue;

    // Set Canvas Height
    console.log(gameHeight, gameWidth, GAME_SPEED)
    let gameCanva = document.getElementById("gameCanvas");
    gameCanva.height = gameHeight;
    gameCanva.width = gameWidth;

    // Display Score Board
    function displayScore() {
        document.getElementById("scoreBox").style.display = "block";
    }

    let snake = [
        {x: 150, y: 150},
        {x: 140, y: 150},
        {x: 130, y: 150},
        {x: 120, y: 150},
        {x: 110, y: 150},
    ]

    // User Initial Score
    let score = 0;
    // When set true the snake is changing direction
    let changingDirection = false;
    // Food x-coordinate
    let foodX;
    // Food y-coordinate
    let foodY;
    // Horizontal velocity
    let dx = 10;
    // Vertical velocity
    let dy = 0;

    // Get the canvas element
    const gameCanvas = document.getElementById("gameCanvas");
    // Return 2D drawing context
    const ctx = gameCanvas.getContext("2d");

    // Start Game
    main();
    // Create first food location
    createFood();
    // Call changeDirection whenever a key is pressed
    document.addEventListener("keydown", changeDirection);

    // Initialize New Game
    function main() {
        if (isGameOver()) return;

        setTimeout(function onTick() {
            changingDirection = false;
            clearCanvas();
            drawFood();
            advanceSnake();
            drawSnake();

            // Start new game
            main();
        }, GAME_SPEED)
    }

    // Alter CANVAS_BACKGROUND_COLOUR
    function clearCanvas() {
        // Select colour to fill the canvas
        ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
        // Select border colour for canvas
        ctx.strokeStyle = CANVAS_BORDER_COLOUR;

        // Draw a filled rectangle to cover the entire canvas
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        // Draw border around entire canvas
        ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
    }

    // Draw food on the canvas
    function drawFood() {
        ctx.fillStyle = FOOD_COLOUR;
        ctx.strokeStyle = FOOD_BORDER_COLOUR;
        ctx.fillRect(foodX, foodY, 10, 10);
        ctx.strokeRect(foodX, foodY, 10, 10);
    }

    // Advance snake by changing the x-coordinates of its parts
    // According to the horizontal velocity and the y-coordinates of its parts
    // according to the vertical velocity
    function advanceSnake() {
        // Create new Snake's head
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        // Add new head to beginning of snake
        snake.unshift(head);

        const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
        if (didEatFood) {
            // Increase score
            score += 10;
            // Display score
            document.getElementById('scoreResult').innerHTML = score;
            // Generate new food location
            createFood();
        } else {
            // Remove the last part of snake body
            snake.pop();
        }
    }

    // Return true if:
    // Head of snake touched another part of the game
    // or any of the walls
    function isGameOver() {
        for (let i = 4; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) 
            return true
        }

        const hitLeftWall = snake[0].x < 0;
        const hitRightWall = snake[0].x > gameCanvas.width - 10;
        const hitTopWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y > gameCanvas.height - 10;

        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
        
    }

    /* Generate a random number that is multiple of 10 given min & max
     * @param { number } min - the mininmum number
     * @param { number } max - the maximum number
    */ 
    function randomTen(min, max) {
        return Math.round((Math.random() * (max-min) + min) / 10 ) * 10
    }

    // Create random set of coordinates for the snake food
    function createFood() {
        // Generate random foodX
        foodX = randomTen(0, gameCanvas.width - 10);
        // Generate random foodY
        foodY = randomTen(0, gameCanvas.height - 10);

        // If createFood intersects snake, regenerate
        snake.forEach(function isFoodOnSnake(part) {
            const foodIntSnake = part.x == foodX && part.y == foodY;
            if (foodIntSnake) createFood();
        });
    }

    // Draw snake on canvas
    function drawSnake() {
        snake.forEach(drawSnakePart)
    }

    /* Draws part of snake on the canvas
     * @param { object } snakePart - coordinates where Part should be drawn
    */
    function drawSnakePart(snakePart) {
        // set color & border of part
        ctx.fillStyle = SNAKE_COLOUR;
        ctx.strokeSyle = SNAKE_BORDER_COLOUR;

        // Draw filled rectangle to represent snakePart at coordinate
        ctx.fillRect(snakePart.x, snakePart.y, 10, 10);

        // Draw border around snakePart
        ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
    }

    /* Changes vertical/horizontal velocity of snake according to KeyPress
     * Direction cannot be reveresed
     * ie. 'right' direction cannot become 'left'
     * @param { object } event - keydown event
    */
    function changeDirection(event) {
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;
        // Prevent reversal
        if (changingDirection) return;
        changingDirection= true;
        
        const keyPressed = event.keyCode;

        const goingUp = dy === -10;
        const goingDown = dy === 10;
        const goingRight = dx === -10;
        const goingLeft = dx === -10;

        if (keyPressed === LEFT_KEY && !goingRight) {
            dx = -10;
            dy = 0;
        }
        if (keyPressed === UP_KEY && !goingDown) {
            dx = 0;
            dy = -10;
        }
        if (keyPressed === RIGHT_KEY && !goingLeft) {
            dx = 10;
            dy = 0;
        }
        if (keyPressed === DOWN_KEY && !goingUp) {
            dx = 0;
            dy = 10;
        }
    }
}