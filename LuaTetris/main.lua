Shape1 = {
    {0,0,0,0},
    {1,1,1,1},
    {0,0,0,0},
    {0,0,0,0}
}

Shape2 = {
    {1,1},
    {1,1}
}

Shape3 = {
    {1,0,0},
    {1,0,0},
    {1,1,0}
}

Shape4 = {
    {0,1,0},
    {0,1,0},
    {1,1,0}
}

Shape5 = {
    {0,1,1},
    {1,1,0},
    {0,0,0}
}

Shape6 = {
    {1,1,0},
    {0,1,1},
    {0,0,0}
}

Shape7 = {
    {0,1,0},
    {1,1,1},
    {0,0,0}
}

ShapeColors = {
    {1,0,0,1},
    {0,1,0,1},
    {0,0,1,1},
    {1,1,0,1},
    {1,0,1,1},
    {0,1,1,1},
    {0.5,0.5,0.5,1}
}

ShapesArray = {
    Shape1,
    Shape2,
    Shape3,
    Shape4,
    Shape5,
    Shape6,
    Shape7
}

CurrentShape = Shape1
CurrentShapeX = 0;
CurrentShapeY = 0;
CurrentShapeRotation = 0;
CurrentShapeColor = 1;

CurrentPoints = 0;
PointMultipliers = {100, 300, 500, 800}

FrameTimer = 0;

GameMatrix = {}
GameMatrixSizeX = 10;
GameMatrixSizeY = 22;

GameEnd = -1

function rotateI(x, y, size, rotation)
    rotation = 4 - rotation
    for i=0, rotation do
        local tempX = x
        x = y;
        y = ((size+1) - tempX)
    end
    return (x-1)
end

function rotateJ(x, y, size, rotation)
    rotation = 4 - rotation
    for i=0, rotation do
        local tempX = x
        x = y;
        y = ((size+1) - tempX)
    end
    y = ((size+1) - y)
    return y
end

function drawShape(shapeArray, x, y, rotation, color)

    for i=1, #shapeArray, 1 do
        local shapeArrayRow = shapeArray[i]
        for j=1, #shapeArrayRow, 1 do
            if shapeArrayRow[j] == 1 then
                love.graphics.setColor( ShapeColors[color] )
                love.graphics.rectangle("fill", (rotateJ(j,i,#shapeArray,rotation)*20) + (x*20), (rotateI(j,i,#shapeArray,rotation)*20) + (y*20), 20, 20)
            end
        end
    end
end

function gameTick(dt)

    FrameTimer = FrameTimer + dt

    if FrameTimer > 1 then
       FrameTimer = FrameTimer - 1
       attemptMoveDown(CurrentShape, CurrentShapeX, CurrentShapeY, CurrentShapeRotation, CurrentShapeColor)
    end

end

function attemptMoveDown(shapeArray, x, y, rotation, color)

    local tempY = y + 1
    local tempX = x

    local canMove = 1

    for i=1, #shapeArray, 1 do
        local shapeArrayRow = shapeArray[i]
        for j=1, #shapeArrayRow, 1 do
            if shapeArrayRow[j] == 1 and canMove == 1 then
                if ((rotateI(j,i,#shapeArray,rotation)+tempY) <= GameMatrixSizeY) then
                    if (GameMatrix[rotateJ(j,i,#shapeArray,rotation)+tempX][rotateI(j,i,#shapeArray,rotation)+tempY] ~= 0) then
                        placeShape(shapeArray, x, y, rotation, color)
                        canMove = 0
                    end
                else
                    placeShape(shapeArray, x, y, rotation, color)
                    canMove = 0
                end
            end
        end
    end

    if canMove == 1 then
        CurrentShapeY = CurrentShapeY + 1
    end

end

function attemptMoveSideways(shapeArray, x, y, rotation, color, side)

    local tempY = y
    local tempX = x + side

    local canMove = 1

    for i=1, #shapeArray, 1 do
        local shapeArrayRow = shapeArray[i]
        for j=1, #shapeArrayRow, 1 do
            if shapeArrayRow[j] == 1 then
                if (((rotateJ(j,i,#shapeArray,rotation)+tempX) > GameMatrixSizeX) or ((rotateJ(j,i,#shapeArray,rotation)+tempX) < 1)) then
                    canMove = 0
                else
                    if (GameMatrix[rotateJ(j,i,#shapeArray,rotation)+tempX][rotateI(j,i,#shapeArray,rotation)+tempY] ~= 0) then
                        canMove = 0
                    end
                end
            end
        end
    end

    if canMove == 1 then
        CurrentShapeX = CurrentShapeX + side
    end

end

function attemptRotate(shapeArray, x, y, rotation, color, direction)

    local tempY = y
    local tempX = x
    local tempRotation = rotation + direction

    local canRotate = 1

    for i=1, #shapeArray, 1 do
        local shapeArrayRow = shapeArray[i]
        for j=1, #shapeArrayRow, 1 do
            if shapeArrayRow[j] == 1 then

                if ((rotateJ(j,i,#shapeArray,tempRotation)+tempX) > GameMatrixSizeX) or ((rotateJ(j,i,#shapeArray,tempRotation)+tempX) < 1) or (rotateI(j,i,#shapeArray,tempRotation)+tempY) > GameMatrixSizeY then
                    canRotate = 0
                else
                    if (GameMatrix[rotateJ(j,i,#shapeArray,tempRotation)+tempX][rotateI(j,i,#shapeArray,tempRotation)+tempY] ~= 0) then
                        canRotate = 0
                    end
                end
            end
        end
    end

    if canRotate == 1 then
        CurrentShapeRotation = CurrentShapeRotation + direction
    end

    if(CurrentShapeRotation < 0) then
        CurrentShapeRotation = 4 + CurrentShapeRotation
    end

    CurrentShapeRotation = CurrentShapeRotation%4

    print(CurrentShapeRotation)

end

function placeShape(shapeArray, x, y, rotation, color)

    local isGameEnd = 0;
    for i=1, #shapeArray, 1 do
        local shapeArrayRow = shapeArray[i]
        for j=1, #shapeArrayRow, 1 do
            if shapeArrayRow[j] == 1 then
                if (rotateI(j,i,#shapeArray,rotation)+y) > 2 then
                    GameMatrix[rotateJ(j,i,#shapeArray,rotation)+x][rotateI(j,i,#shapeArray,rotation)+y]=color
                    getNewShape();
                else
                    isGameEnd = 1
                end
            end
        end
    end

    if isGameEnd == 0 then
        getNewShape();
    else
        GameEnd = 1
    end


    local shouldErase = 1
    local shouldShift = 0
    local totalShift = 0

    for j=GameMatrixSizeY, 1, -1 do

        shouldErase = 1
        shouldShift = 0

        for i=1, GameMatrixSizeX, 1 do
            if GameMatrix[i][j] ~= 0 then
                shouldShift = 1
            else
                shouldErase = 0
            end
        end

        if shouldShift == 1 then
            if shouldErase == 1 then
                totalShift = totalShift + 1
                for k=1, GameMatrixSizeX, 1 do
                    GameMatrix[k][j] = 0
                end             
            elseif totalShift > 0 then
                for k=1, GameMatrixSizeX, 1 do
                    GameMatrix[k][j+totalShift] = GameMatrix[k][j]
                    GameMatrix[k][j] = 0;
                end
            end
        end
    end

    if totalShift > 0 then
        CurrentPoints = CurrentPoints + PointMultipliers[totalShift]
    end

end

function getNewShape()
    math.randomseed(os.time())
    CurrentShape = ShapesArray[math.random(#ShapesArray)]
    CurrentShapeColor = math.random(#ShapeColors)
    CurrentShapeY = 1
    CurrentShapeX = math.random(GameMatrixSizeX - #CurrentShape)
    CurrentShapeRotation = 0
end

function love.keypressed( key, scancode, isrepeat )
    if scancode == "k" then
        attemptRotate(CurrentShape, CurrentShapeX, CurrentShapeY, CurrentShapeRotation, CurrentShapeColor, -1)
    elseif scancode == "l" then
        attemptRotate(CurrentShape, CurrentShapeX, CurrentShapeY, CurrentShapeRotation, CurrentShapeColor, 1)
    elseif scancode == "a" then
        attemptMoveSideways(CurrentShape, CurrentShapeX, CurrentShapeY, CurrentShapeRotation, CurrentShapeColor, -1)
    elseif scancode == "d" then
        attemptMoveSideways(CurrentShape, CurrentShapeX, CurrentShapeY, CurrentShapeRotation, CurrentShapeColor, 1)
    elseif scancode == "s" then
        attemptMoveDown(CurrentShape, CurrentShapeX, CurrentShapeY, CurrentShapeRotation, CurrentShapeColor)
    end
end

function love.load()
    for i=1, GameMatrixSizeX, 1 do
        GameMatrix[i] = {}
        for j=1, GameMatrixSizeY, 1 do
            GameMatrix[i][j] = 0
        end
    end
end

function love.draw()

    if GameEnd == 0 then

        love.graphics.setColor( 1, 1, 1, 1 )

        for i=1, GameMatrixSizeX, 1 do
            for j=1, GameMatrixSizeY, 1 do
                if GameMatrix[i][j] == 0 then
                    love.graphics.setColor( {1,1,1,1} )
                    love.graphics.rectangle("line", i*20, j*20, 20, 20)
                else
                    love.graphics.setColor( ShapeColors[GameMatrix[i][j]] )
                    love.graphics.rectangle("fill", i*20, j*20, 20, 20)
                end
            end
        end

        drawShape(CurrentShape, CurrentShapeX, CurrentShapeY, CurrentShapeRotation, CurrentShapeColor)
        love.graphics.setColor( {1,1,1,1} )
        love.graphics.print( "Points: " .. CurrentPoints, 240, 40, 0, 2, 2)

    else
        love.graphics.setColor( {1,1,1,1} )
        love.graphics.print( "Game over ", 100, 100, 0, 4, 4)
        love.graphics.print( "Points: " .. CurrentPoints, 100, 200, 0, 4, 4)
    end
    
end

function love.update(dt)

    if GameEnd == -1 then
        getNewShape()
        GameEnd = 0
    end
    if GameEnd == 0 then
        gameTick(dt)
    end
    

end