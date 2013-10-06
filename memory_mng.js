var timer = new Timer();
var ctx;
var left = false;
var right = false;
var jump = false;
var memMan = new MemoryMng();
var offSetX;
var offSetY;
var playerKo = false;
var playerImmune = false;
var startX;
var startY;
var showTriggers = true;
var lockKeys = false;

function init(canvas) {

    var tempCtx = document.getElementById(canvas);
    ctx = tempCtx.getContext("2d");
    offSetX = 440 - memMan.tileSize;
    offSetY = 293 - memMan.tileSize;

    startX = memMan.player[0].x;
    startY = memMan.player[0].y;

    memMan.addSprite("heart", "images/heart.png", 32, 32, 0, 0,1,0);
    memMan.addSprite("coin1", "images/coin.png", 32, 32, 0, 0,1,0);

    setInterval(kernal, 100);

}

function kernal() {

    render();
    renderEnemy();
    stateUpdate1();
    renderChars();
}

function isPassable(y,x){

    var tile = memMan.gameMap[y][x];
    

    if(tile != null){

        var terrain = memMan.terrain[tile].solid;

        switch(terrain){

            case "sides":
            case "all":

                return false;
                break;

            default:

                return true;
                break;
        }
    }
    else{

        return true;
    }
}

function stateUpdate1(){

    var player = memMan.player[0];
    var gameMap = memMan.gameMap;
    var terrain = memMan.terrain;

    if (left == true) {

        player.x -= 8;        

        var playerLeftX = parseInt(player.x / memMan.tileSize);
        var playerLeftY = parseInt(player.y / memMan.tileSize);

        if(!isPassable(playerLeftY,playerLeftX) || !isPassable(playerLeftY + 1,playerLeftX)){

            player.x = playerLeftX * memMan.tileSize + (player.width / 2);
            //player.x += 8;
        }        
        else if(player.x < 0){              

            player.x += 8;
        }

    }
    else if (right == true) {

        player.x += 8;        
        var maxX = (gameMap[0].length - 1) * memMan.tileSize;

        var playerRightX = parseInt((player.x + player.width - 1) / memMan.tileSize);
        var playerRightY = parseInt(player.y / memMan.tileSize);

        if(!isPassable(playerRightY,playerRightX) || !isPassable(playerRightY + 1,playerRightX)){                       

            player.x = playerRightX * memMan.tileSize - player.width; 
            //player.x -= 8;           
        }
        else if (player.x > maxX) {
            
            player.x -= 8;
        }
    }

    var playerX = parseInt((player.x) / memMan.tileSize);
    var playerY = parseInt((player.y) / memMan.tileSize);

    if (jump == true && (player.jumpPos < player.maxJump)) {


        if (gameMap[playerY][playerX] != null && 
            terrain[gameMap[playerY][playerX]].solid == "swim") {

            player.y -= 8;
            player.jumpPos = 0;             
        }
        else {

            player.y -= 16;
            player.jumpPos += 16; 

            if(player.y < 0){
                player.y += 16;
                player.jumpPos = player.maxJump;
            }
        }
        
        var playerXRight = parseInt((player.x + 31) / memMan.tileSize);
        var playerTopY = parseInt((player.y) / memMan.tileSize);

        if(!isPassable(playerTopY,playerX)){
        

            player.y = playerTopY * memMan.tileSize + memMan.tileSize; 
            
        }
        else if(!isPassable(playerTopY,playerXRight)){            

            player.y = playerTopY * memMan.tileSize + memMan.tileSize;            
        }

    }
    else {

        if (gameMap[playerY][playerX] != null && 
            terrain[gameMap[playerY][playerX]].solid == "swim") {

            player.y += 8;
            player.jumpPos = 0;
        }
        else {

            player.y += 15;
            var maxY = (gameMap.length - 1) * memMan.tileSize;
            player.jumpPos = player.maxJump;  

            if(player.y + player.height > maxY){

                player.y -= 15;
            }          
        }

        var playerXRight = parseInt((player.x + player.width -1) / memMan.tileSize);
        var playerBottomY = parseInt((player.y + player.height) / memMan.tileSize);
        var ignore = false;

        // if(!isPassable(playerTopY,playerXRight) &&
        //     terrain[gameMap[playerBottomY][playerX]].solid == "top"){

        //     player.y = playerBottomY * memMan.tileSize - player.height;
        //     player.jumpPos = 0;
        //     ignore = true; 
        // }

        if (gameMap[playerBottomY][playerX] != null) {

            if (terrain[gameMap[playerBottomY][playerX]].solid == "top" || 
                terrain[gameMap[playerBottomY][playerX]].solid == "all") {

                player.y = playerBottomY * memMan.tileSize - player.height;
                player.jumpPos = 0;
                ignore = true; 
            }
        }

        var maxY = (gameMap.length - 1) * memMan.tileSize;

        if (gameMap[playerBottomY][playerXRight] != null && ignore == false) {

            if (terrain[gameMap[playerBottomY][playerXRight]].solid == "top" || 
                terrain[gameMap[playerBottomY][playerXRight]].solid == "all") {

                player.y = playerBottomY * memMan.tileSize - player.height;
                player.jumpPos = 0;                
            }
        }
        else if (player.y > maxY) {

            //memMan.player[0].y = playerBottomY * memMan.tileSize - memMan.tileSize;
            //memMan.player[0].jumpPos = 0;

        }

        playerX = parseInt((player.x + 16) / memMan.tileSize);
        playerBottomY = parseInt((player.y + 31) / memMan.tileSize);

        if (gameMap[playerBottomY][playerX] != null) {

            var maxX = gameMap[0].length;
            var maxY = gameMap.length;             
        }
    }

    var noEnemy = memMan.enemy.length;

    var enemyRight;
    var enemyLeft;
    var enemyBottom;
    var enemyX;

    var maxX = gameMap[0].length;
    var maxY = gameMap.length;
    var tempOffSetX = offSetX;

    if (tempOffSetX > 0) {

       tempOffSetX = 0;
    }

    for (i = 0; i < noEnemy; i++) {

        var enemy = memMan.enemy[i];
        enemyRight = parseInt((enemy.x + 32) / memMan.tileSize);
        enemyLeft = parseInt((enemy.x - 1) / memMan.tileSize);
        enemyBottom = parseInt((enemy.y + 31) / memMan.tileSize);
        enemyBottomY = parseInt((enemy.y + 31) / memMan.tileSize);
        enemyY = parseInt((enemy.y) / memMan.tileSize);
        enemyX = parseInt((enemy.x + 16) / memMan.tileSize);

        if ((gameMap[enemyBottom][enemyRight] == null || 
            gameMap[enemyY][enemyRight] != null) || 
            (gameMap[enemyBottom][enemyRight] != null && terrain[gameMap[enemyBottom][enemyRight]].solid == "slope") || 
            (gameMap[enemyBottom][enemyRight] != null && gameMap[enemyBottom][enemyRight] == "spikes")) {

           enemy.left = true;
           enemy.right = false;
        }
        else if ((gameMap[enemyBottom][enemyLeft] == null || 
            gameMap[enemyY][enemyLeft] != null) || 
            (gameMap[enemyBottom][enemyLeft] != null && terrain[gameMap[enemyBottom][enemyLeft]].solid == "slope") || 
            (gameMap[enemyBottom][enemyLeft] != null && gameMap[enemyBottom][enemyLeft] == "spikes")) {

           enemy.left = false;
           enemy.right = true;
        }

        if ((gameMap[enemyY][enemyRight] != null && terrain[gameMap[enemyY][enemyRight]].solid == "all") || 
            (gameMap[enemyY][enemyRight] != null && terrain[gameMap[enemyY][enemyRight]].solid == "slope")) {

           enemy.left = true;
           enemy.right = false;
        }
        else if ((gameMap[enemyY][enemyLeft] != null && terrain[gameMap[enemyY][enemyLeft]].solid == "all") || 
            (gameMap[enemyY][enemyLeft] != null && terrain[gameMap[enemyY][enemyLeft]].solid == "slope")) {

           enemy.left = false;
           enemy.right = true;
        }


        if (enemy.right == true) {

           enemy.x += 8;
        }
        else {

           enemy.x -= 8;
        }

        enemy.y += 15;

        ignore = false;

        if (gameMap[enemyBottom][enemyX] != null) {

           if (terrain[gameMap[enemyBottom][enemyX]].solid == "top" || 
            terrain[gameMap[enemyBottom][enemyX]].solid == "all") {

               enemy.y = enemyBottom * memMan.tileSize - 31;

               ignore = true;
           }
        }

        if (gameMap[enemyBottom][enemyX] != null && ignore == false) {

           if (terrain[gameMap[enemyBottom][enemyX]].solid == "top" || 
            terrain[gameMap[enemyBottom][enemyX]].solid == "all") {

               player.y = enemyBottom * memMan.tileSize - 31;

           }
        }


        if (intersectRect(i) && playerImmune == false) {
           playerImmune = true;
           playerKo = true;
           player.lives--;
           left = false;
           jump = false;
           right = false;

           setTimeout(revivePlayer, 3000);
        }

        enemyX = parseInt((enemy.x + 16) / memMan.tileSize);
        enemyBottomY = parseInt((enemy.y + 31) / memMan.tileSize);
        memMan.enemy[i] = enemy;
    }

    memMan.player[0] = player;

    var noItems = memMan.items.length;

    for (n = 0; n < noItems; n++) {

        if (intersectItems(n) && memMan.items[n].show == 1) {

            memMan.addInventory(memMan.items[n].sprite);
            memMan.removeItem(n);
        }

    }


    var noTriggers = memMan.trigger.length;

    for (n = 0; n < noTriggers; n++) {

        if (intersectTriggers(n)) {

            eval(memMan.trigger[n].action);
        }
    }
}

function stateUpdate() {

    if (left == true) {

        memMan.player[0].x -= 8;
        offSetX += 8;

        var playerLeftX = parseInt(memMan.player[0].x / memMan.tileSize);
        var playerLeftY = parseInt(memMan.player[0].y / memMan.tileSize);

        if (memMan.gameMap[playerLeftY][playerLeftX] != null) {

            if (memMan.terrain[memMan.gameMap[playerLeftY][playerLeftX]].solid == "sides" || memMan.terrain[memMan.gameMap[playerLeftY][playerLeftX]].solid == "all") {

                offSetX -= (playerLeftX * memMan.tileSize + memMan.tileSize) - memMan.player[0].x;

                memMan.player[0].x = playerLeftX * memMan.tileSize + memMan.tileSize;

            }
        }
        else if(memMan.player[0].x < 0){
            
            offSetX -= 8;

            memMan.player[0].x += 8;
        }

    }
    else if (right == true) {

        memMan.player[0].x += 8;
        offSetX -= 8;
        var maxX = (memMan.gameMap[0].length - 1) * memMan.tileSize;

        var playerRightX = parseInt((memMan.player[0].x + memMan.tileSize) / memMan.tileSize);
        var playerRightY = parseInt(memMan.player[0].y / memMan.tileSize);

        if (memMan.gameMap[playerRightY][playerRightX] != null) {

            if (memMan.terrain[memMan.gameMap[playerRightY][playerRightX]].solid == "sides" || memMan.terrain[memMan.gameMap[playerRightY][playerRightX]].solid == "all") {



                offSetX -= (playerRightX * memMan.tileSize - memMan.tileSize) - memMan.player[0].x;

                memMan.player[0].x = playerRightX * memMan.tileSize - memMan.tileSize;

            }
        }
        else if (memMan.player[0].x > maxX) {

            offSetX += 8;

            memMan.player[0].x -= 8;
        }
    }


    var playerX = parseInt((memMan.player[0].x) / memMan.tileSize);
    var playerY = parseInt((memMan.player[0].y) / memMan.tileSize);


    if (jump == true && (memMan.player[0].jumpPos < memMan.player[0].maxJump)) {


        if (memMan.gameMap[playerY][playerX] != null && memMan.terrain[memMan.gameMap[playerY][playerX]].solid == "swim") {

            memMan.player[0].y -= 8;
            memMan.player[0].jumpPos = 0;
            offSetY += 8;
            
        }
        else {

            memMan.player[0].y -= 16;
            memMan.player[0].jumpPos += 16;
            offSetY += 16;
        }


        var playerX = parseInt((memMan.player[0].x) / memMan.tileSize);
        var playerXRight = parseInt((memMan.player[0].x + 31) / memMan.tileSize);


        var playerTopY = parseInt((memMan.player[0].y) / memMan.tileSize);

        if (memMan.gameMap[playerTopY][playerX] != null) {

            if (memMan.terrain[memMan.gameMap[playerTopY][playerX]].solid == "all") {

                memMan.player[0].y = playerTopY * memMan.tileSize + memMan.tileSize;
                //memMan.player[0].jumpPos = memMan.player[0].maxJump;
                offSetY -= 16;

            }

        }
        else {

            if (memMan.gameMap[playerTopY][playerXRight] != null) {

                if (memMan.terrain[memMan.gameMap[playerTopY][playerXRight]].solid == "all") {

                    memMan.player[0].y = playerTopY * memMan.tileSize + memMan.tileSize;
                    //memMan.player[0].jumpPos = memMan.player[0].maxJump;
                    offSetY -= 16;
                }
            }
        }

    }
    else {

        if (memMan.gameMap[playerY][playerX] != null && memMan.terrain[memMan.gameMap[playerY][playerX]].solid == "swim") {

            memMan.player[0].y += 8;
            memMan.player[0].jumpPos = 0;           

        }
        else {

            memMan.player[0].y += 16;
            memMan.player[0].jumpPos = memMan.player[0].maxJump;
            offSetY -= 16;
        }

        var playerXRight = parseInt((memMan.player[0].x + 31) / memMan.tileSize);
        var playerBottomY = parseInt((memMan.player[0].y + memMan.tileSize) / memMan.tileSize);
        var ignore = false;

        if (memMan.gameMap[playerBottomY][playerX] != null) {

            if (memMan.terrain[memMan.gameMap[playerBottomY][playerX]].solid == "top" || memMan.terrain[memMan.gameMap[playerBottomY][playerX]].solid == "all") {

                memMan.player[0].y = playerBottomY * memMan.tileSize - memMan.tileSize;
                memMan.player[0].jumpPos = 0;
                ignore = true;
                offSetY += 16;
                
            }
        }

        var maxY = (memMan.gameMap.length - 1) * memMan.tileSize;
        if (memMan.gameMap[playerBottomY][playerXRight] != null && ignore == false) {

            if (memMan.terrain[memMan.gameMap[playerBottomY][playerXRight]].solid == "top" || memMan.terrain[memMan.gameMap[playerBottomY][playerXRight]].solid == "all") {

                memMan.player[0].y = playerBottomY * memMan.tileSize - memMan.tileSize;
                memMan.player[0].jumpPos = 0;
                offSetY += 16;
                
            }
        }
        else if (memMan.player[0].y > maxY) {

            //memMan.player[0].y = playerBottomY * memMan.tileSize - memMan.tileSize;
            //memMan.player[0].jumpPos = 0;

        }


        playerX = parseInt((memMan.player[0].x + 16) / memMan.tileSize);
        playerBottomY = parseInt((memMan.player[0].y + 31) / memMan.tileSize);

        if (memMan.gameMap[playerBottomY][playerX] != null) {

            var maxX = memMan.gameMap[0].length;
            var maxY = memMan.gameMap.length;
            var tempOffSetX = offSetX;

            if (tempOffSetX > 0) {

                tempOffSetX = 0;
            }

            //if (memMan.terrain[memMan.gameMap[playerBottomY][playerX]].solid == "slope") {

            //    var imageData = ctx.getImageData(memMan.player[0].x + 16 + tempOffSetX, memMan.player[0].y + memMan.tileSize, 1, 1);

            //    if (imageData.data[3] == 0) {

            //        for (i = 1; i <= memMan.tileSize; i++) {

            //            imageData = ctx.getImageData(memMan.player[0].x + 16 + tempOffSetX, memMan.player[0].y + memMan.tileSize, 1, 1);

            //            if (imageData.data[3] != 0) {

            //                memMan.player[0].y++;
            //            }
            //            else {

            //                break;
            //            }
            //        }
            //    }
            //    else {

            //        for (i = 0; i <= memMan.tileSize; i++) {

            //            imageData = ctx.getImageData(memMan.player[0].x + 16 + tempOffSetX, memMan.player[0].y + memMan.tileSize, 1, 1);

            //            if (imageData.data[3] != 0) {

            //                memMan.player[0].y--;
            //            }
            //            else {

            //                break;
            //            }
            //        }
            //    }


            //}
        }

    }

    var playerX = parseInt((memMan.player[0].x + 10) / memMan.tileSize);
    var playerXRight = parseInt((memMan.player[0].x + 16) / memMan.tileSize);
    var playerY = parseInt((memMan.player[0].y + 16) / memMan.tileSize);
    var playerYBottom = parseInt((memMan.player[0].y + 16) / memMan.tileSize);

    if ((memMan.gameMap[playerYBottom][playerXRight] != null && memMan.terrain[memMan.gameMap[playerYBottom][playerXRight]].safe == 0 && playerImmune == false) || (memMan.gameMap[playerYBottom][playerX] != null && memMan.terrain[memMan.gameMap[playerYBottom][playerX]].safe == 0 && playerImmune == false) || (memMan.gameMap[playerY][playerX] != null && memMan.terrain[memMan.gameMap[playerY][playerX]].safe == 0 && playerImmune == false) || (memMan.gameMap[playerY][playerXRight] != null && memMan.terrain[memMan.gameMap[playerY][playerXRight]].safe == 0 && playerImmune == false)) {

        playerImmune = true;
        playerKo = true;
        memMan.player[0].lives--;
        left = false;
        jump = false;
        right = false;

        setTimeout(revivePlayer, 3000);
    }

    var noItems = memMan.items.length;

    for (n = 0; n < noItems; n++) {

        if (intersectItems(n) && memMan.items[n].show == 1) {

            memMan.addInventory(memMan.items[n].sprite);
            memMan.removeItem(n);
        }

    }


    var noTriggers = memMan.trigger.length;

    for (n = 0; n < noTriggers; n++) {

        if (intersectTriggers(n)) {

            eval(memMan.trigger[n].action);
        }
    }




    //var noEnemy = memMan.enemy.length;

    //var enemyRight;
    //var enemyLeft;
    //var enemyBottom;
    //var enemyX;

    //var maxX = memMan.gameMap[0].length;
    //var maxY = memMan.gameMap.length;
    //var tempOffSetX = offSetX;

    //if (tempOffSetX > 0) {

    //    tempOffSetX = 0;
    //}

    //for (i = 0; i < noEnemy; i++) {

    //    enemyRight = parseInt((memMan.enemy[i].x + memMan.tileSize) / memMan.tileSize);
    //    enemyLeft = parseInt((memMan.enemy[i].x) / memMan.tileSize);
    //    enemyBottom = parseInt((memMan.enemy[i].y + memMan.tileSize) / memMan.tileSize);
    //    enemyBottomY = parseInt((memMan.enemy[i].y + 31) / memMan.tileSize);
    //    enemyY = parseInt((memMan.enemy[i].y) / memMan.tileSize);
    //    enemyX = parseInt((memMan.enemy[i].x + 16) / memMan.tileSize);

    //    if ((memMan.gameMap[enemyBottom][enemyRight] == null || memMan.gameMap[enemyY][enemyRight] != null) || (memMan.gameMap[enemyBottom][enemyRight] != null && memMan.terrain[memMan.gameMap[enemyBottom][enemyRight]].solid == "slope") || (memMan.gameMap[enemyBottom][enemyRight] != null && memMan.gameMap[enemyBottom][enemyRight] == "spikes")) {

    //        memMan.enemy[i].left = true;
    //        memMan.enemy[i].right = false;
    //    }
    //    else if ((memMan.gameMap[enemyBottom][enemyLeft] == null || memMan.gameMap[enemyY][enemyLeft] != null) || (memMan.gameMap[enemyBottom][enemyLeft] != null && memMan.terrain[memMan.gameMap[enemyBottom][enemyLeft]].solid == "slope") || (memMan.gameMap[enemyBottom][enemyLeft] != null && memMan.gameMap[enemyBottom][enemyLeft] == "spikes")) {

    //        memMan.enemy[i].left = false;
    //        memMan.enemy[i].right = true;
    //    }

    //    if ((memMan.gameMap[enemyY][enemyRight] != null && memMan.terrain[memMan.gameMap[enemyY][enemyRight]].solid == "all") || (memMan.gameMap[enemyY][enemyRight] != null && memMan.terrain[memMan.gameMap[enemyY][enemyRight]].solid == "slope")) {

    //        memMan.enemy[i].left = true;
    //        memMan.enemy[i].right = false;
    //    }
    //    else if ((memMan.gameMap[enemyY][enemyLeft] != null && memMan.terrain[memMan.gameMap[enemyY][enemyLeft]].solid == "all") || (memMan.gameMap[enemyY][enemyLeft] != null && memMan.terrain[memMan.gameMap[enemyY][enemyLeft]].solid == "slope")) {

    //        memMan.enemy[i].left = false;
    //        memMan.enemy[i].right = true;
    //    }

    //    if (memMan.enemy[i].right == true) {

    //        memMan.enemy[i].x += 8;
    //    }
    //    else {

    //        memMan.enemy[i].x -= 8;
    //    }

    //    memMan.enemy[i].y += 16;

    //    ignore = false;

    //    if (memMan.gameMap[enemyBottom][enemyX] != null) {

    //        if (memMan.terrain[memMan.gameMap[enemyBottom][enemyX]].solid == "top" || memMan.terrain[memMan.gameMap[enemyBottom][enemyX]].solid == "all") {

    //            memMan.enemy[i].y = enemyBottom * memMan.tileSize - memMan.tileSize;

    //            ignore = true;
    //        }
    //    }

    //    if (memMan.gameMap[enemyBottom][enemyX] != null && ignore == false) {

    //        if (memMan.terrain[memMan.gameMap[enemyBottom][enemyX]].solid == "top" || memMan.terrain[memMan.gameMap[enemyBottom][enemyX]].solid == "all") {

    //            memMan.player[0].y = enemyBottom * memMan.tileSize - memMan.tileSize;

    //        }
    //    }

        
        //if (intersectRect(i) && playerImmune == false) {
        //    playerImmune = true;
        //    playerKo = true;
        //    memMan.player[0].lives--;
        //    left = false;
        //    jump = false;
        //    right = false;

        //    setTimeout(revivePlayer, 3000);
        //}

        //enemyX = parseInt((memMan.enemy[i].x + 16) / memMan.tileSize);
        //		enemyBottomY = parseInt((memMan.enemy[i].y + 31) / memMan.tileSize);
        //		
        //		
        //		if(memMan.gameMap[enemyBottomY][enemyX] != null){
        //			
        //			
        //			
        //			
        //			if(memMan.terrain[memMan.gameMap[enemyBottomY][enemyX]].solid == "slope"){
        //				
        //								
        //				imageData = ctx.getImageData(memMan.enemy[i].x + 16 + tempOffSetX, memMan.enemy[i].y + memMan.tileSize, 1, 1);
        //				
        //				if(imageData.data[3] == 0){
        //					
        //					for(n = 1; n <= memMan.tileSize; n++){
        //						
        //						imageData = ctx.getImageData(memMan.enemy[i].x + 16 + tempOffSetX, memMan.enemy[i].y + memMan.tileSize, 1, 1);
        //						
        //						if(imageData.data[3] != 0){
        //							
        //							memMan.enemy[i].y++;
        //						}
        //						else{
        //							
        //							break;
        //						}
        //					}
        //				}
        //				else{
        //					
        //					for(n = 0; n <= memMan.tileSize; n++){
        //						
        //						imageData = ctx.getImageData(memMan.enemy[i].x + 16 + tempOffSetX, memMan.enemy[i].y + memMan.tileSize, 1, 1);
        //						
        //						if(imageData.data[3] != 0){
        //							
        //							memMan.enemy[i].y--;
        //						}
        //						else{
        //							
        //							break;
        //						}
        //					}
        //				}
        //				
        //				
        //			}
        //		}



    //}
}

function intersectItems(id) {
    return !(memMan.player[0].x + 5 > (memMan.items[id].x * memMan.tileSize) + (memMan.player[0].width - 3) ||
             memMan.player[0].x + (memMan.player[0].width - 3) < (memMan.items[id].x * memMan.tileSize) + 5 ||
             memMan.player[0].y + 5 > (memMan.items[id].y * memMan.tileSize) + (memMan.player[0].height - 3) ||
             memMan.player[0].y + (memMan.player[0].height - 3) < (memMan.items[id].y * memMan.tileSize) + 5);
}



function intersectTriggers(id) {
    return !(memMan.player[0].x > memMan.trigger[id].x + memMan.trigger[id].width ||
             memMan.player[0].x + memMan.tileSize < memMan.trigger[id].x ||
             memMan.player[0].y > memMan.trigger[id].y + memMan.trigger[id].height ||
             memMan.player[0].y + memMan.tileSize < memMan.trigger[id].y);
}

function intersectRect(id) {
    return !(memMan.player[0].x + 5 > memMan.enemy[id].x + (memMan.player[0].width - 3) ||
             memMan.player[0].x + (memMan.player[0].width - 3) < memMan.enemy[id].x + 5 ||
             memMan.player[0].y + 5 > memMan.enemy[id].y + (memMan.player[0].height - 3) ||
             memMan.player[0].y + (memMan.player[0].height - 3) < memMan.enemy[id].y + 5);
}


function revivePlayer() {

    if (memMan.player[0].lives < 1) {

        memMan.inventory = new Object();
        memMan.inventory["coin"] = 0;

        var noItems = memMan.items.length;

        for (n = 0; n < noItems; n++) {

            memMan.items[n].show = 1;
        }

        memMan.player[0].lives = 3;
        memMan.player[0].x = startX;
        memMan.player[0].y = startY;
        offSetX = memMan.player[0].x + 320 - 64;
        playerImmune = false;
        playerKo = false;
    }
    else {


        playerKo = false;
        setTimeout(revivePlayer1, 3000);
    }


}

function revivePlayer1() {

    playerImmune = false;
}

this.addEventListener("keydown", onKeyDown, false);
this.addEventListener("keyup", onKeyUp, false);



function onKeyDown(evt) {

    if (playerKo == false && lockKeys == false) {
        if (evt.keyCode == 65) {

            left = true;

        }
        else if (evt.keyCode == 68) {

            right = true;

        }
        else if (evt.keyCode == 87) {

            jump = true;

        }
    }
}

function onKeyUp(evt) {

    if (evt.keyCode == 65) {

        left = false;
    }
    else if (evt.keyCode == 68) {

        right = false;
    }
    else if (evt.keyCode == 87) {

        jump = false;
    }
}

function Timer() {

    this.date = new Date();

    this.update = function () {

        var d = new Date();
        this.date = d;
    }

    this.getMilliseconds = function () {

        return this.date.getTime();
    }

    this.getSeconds = function () {

        return Math.round(this.date.getTime() / 1000);
    }
}

function Enemy(_sprite, _x, _y) {

    this.sprite = _sprite;
    this.x = _x;
    this.y = _y;
    this.right = true;
    this.left = false;
    this.width = 32;
    this.height = 32;
}

function Player(_sprite, _spriteWalk, _spriteJump, _spriteSwim, _spriteKo, _x, _y) {

    this.sprite = _sprite;
    this.spriteWalk = _spriteWalk;
    this.spriteJump = _spriteJump;
    this.spriteSwim = _spriteSwim;
    this.spriteKo = _spriteKo;
    this.x = _x;
    this.y = _y;
    this.maxJump = 70;
    this.jumpPos = 0;
    this.lives = 3;
    this.width = 32;
    this.height = 32;
}

function renderChars() {

   var tempOffSetX = -memMan.player[0].x + 420;
   var tempOffSetY = -memMan.player[0].y + 293;
   var maxX = memMan.gameMap[0].length;
   var maxY = memMan.gameMap.length;

   var tempMaxX = 0 - ((maxX * memMan.tileSize) - 880);
   var tempMaxY = 0 - ((maxX * memMan.tileSize) - 586);
    


   // if (tempOffSetX > 0) {

   //     tempOffSetX = 0;
   // }
   // else if (tempOffSetX < tempMaxX) {

   //     tempOffSetX = tempMaxX;
   // }

   // if (tempOffSetY > 0) {

   //     tempOffSetY = 0;
   // }
   // else if (tempOffSetY < tempMaxY) {

   //     tempOffSetY = tempMaxY;
   // }

   var playerX = parseInt((memMan.player[0].x) / memMan.tileSize);
   var playerY = parseInt((memMan.player[0].y) / memMan.tileSize);

   if (playerKo == true) {

       memMan.sprites[memMan.player[0].spriteKo].setPosition(memMan.player[0].x + tempOffSetX, memMan.player[0].y + tempOffSetY);
       memMan.sprites[memMan.player[0].spriteKo].animate(ctx, timer);
       memMan.sprites[memMan.player[0].spriteKo].draw(ctx);
   }
   else {

       if (right == true) {

           if (memMan.gameMap[playerY][playerX] != null && memMan.terrain[memMan.gameMap[playerY][playerX]].solid == "swim") {

               memMan.sprites[memMan.player[0].spriteSwim].setPosition(memMan.player[0].x + tempOffSetX, memMan.player[0].y + tempOffSetY);
               memMan.sprites[memMan.player[0].spriteSwim].animate(ctx, timer);
               memMan.sprites[memMan.player[0].spriteSwim].draw(ctx);
           }
           else {

               if (jump == true) {

                   memMan.sprites[memMan.player[0].spriteJump].setPosition(memMan.player[0].x + tempOffSetX, memMan.player[0].y + tempOffSetY);
                   memMan.sprites[memMan.player[0].spriteJump].animate(ctx, timer);
                   memMan.sprites[memMan.player[0].spriteJump].draw(ctx);
               }
               else {

                   memMan.sprites[memMan.player[0].spriteWalk].setPosition(memMan.player[0].x + tempOffSetX, memMan.player[0].y + tempOffSetY);
                   memMan.sprites[memMan.player[0].spriteWalk].animate(ctx, timer);
                   memMan.sprites[memMan.player[0].spriteWalk].draw(ctx);
               }
           }


       }
       else if (left == true) {

           // ctx.save();
           // ctx.translate(memMan.player[0].width * 0.5, +memMan.player[0].height * 0.5);
           // ctx.scale(-1, 1);
           // ctx.translate(-memMan.tileSize * 0.5, -memMan.tileSize * 0.5);

            ctx.save();
            ctx.translate(30 * 0.5, +30 * 0.5);
            ctx.scale(-1, 1);
            ctx.translate(-30 * 0.5, -30 * 0.5);

           if (memMan.gameMap[playerY][playerX] != null && memMan.terrain[memMan.gameMap[playerY][playerX]].solid == "swim") {

               memMan.sprites[memMan.player[0].spriteSwim].setPosition(-memMan.player[0].x - tempOffSetX, memMan.player[0].y + tempOffSetY);
               memMan.sprites[memMan.player[0].spriteSwim].animate(ctx, timer);
               memMan.sprites[memMan.player[0].spriteSwim].draw(ctx);
           }
           else {

               if (jump == true) {

                   memMan.sprites[memMan.player[0].spriteJump].setPosition(-memMan.player[0].x - tempOffSetX, memMan.player[0].y + tempOffSetY);
                   memMan.sprites[memMan.player[0].spriteJump].animate(ctx, timer);
                   memMan.sprites[memMan.player[0].spriteJump].draw(ctx);
               }
               else {

                   memMan.sprites[memMan.player[0].spriteWalk].setPosition(-memMan.player[0].x - tempOffSetX, memMan.player[0].y + tempOffSetY);
                   memMan.sprites[memMan.player[0].spriteWalk].animate(ctx, timer);
                   memMan.sprites[memMan.player[0].spriteWalk].draw(ctx);
               }
           }

           ctx.restore();

       }
       else {

            memMan.sprites[memMan.player[0].sprite].setPosition(memMan.player[0].x + tempOffSetX, memMan.player[0].y + tempOffSetY);
            memMan.sprites[memMan.player[0].sprite].animate(ctx, timer);
            memMan.sprites[memMan.player[0].sprite].draw(ctx); 
       }
   }
}

function renderEnemy() {

   var tempOffSetX = -memMan.player[0].x + 420;
   var tempOffSetY = -memMan.player[0].y + 293;
   var maxX = memMan.gameMap[0].length;
   var maxY = memMan.gameMap.length;

   var tempMaxX = 0 - ((maxX * memMan.tileSize) - 880);
  

   var noEnemy = memMan.enemy.length;

   for (i = 0; i < noEnemy; i++) {

       if (memMan.enemy[i].right == true) {

           memMan.sprites[memMan.enemy[i].sprite].setPosition(memMan.enemy[i].x + tempOffSetX, memMan.enemy[i].y + tempOffSetY);
           memMan.sprites[memMan.enemy[i].sprite].animate(ctx, timer);
           memMan.sprites[memMan.enemy[i].sprite].draw(ctx);
       }
       else {

           ctx.save();
            ctx.translate(30 * 0.5, +30 * 0.5);
            ctx.scale(-1, 1);
            ctx.translate(-30 * 0.5, -30 * 0.5);

           memMan.sprites[memMan.enemy[i].sprite].setPosition(-memMan.enemy[i].x - tempOffSetX, memMan.enemy[i].y + tempOffSetY);
           memMan.sprites[memMan.enemy[i].sprite].animate(ctx, timer);
           memMan.sprites[memMan.enemy[i].sprite].draw(ctx);

           ctx.restore();
       }
   }
}

function render() {

    ctx.clearRect(0, 0, 1000, 640);
    timer.update();


    // var tempOffSetX = offSetX;
    // var tempOffSetY = offSetY;

    var tempOffSetX = -memMan.player[0].x + 420;
    var tempOffSetY = -memMan.player[0].y + 293;
    
    var maxX = memMan.gameMap[0].length;
    var maxY = memMan.gameMap.length;

    // var tempMaxX = 0 - ((maxX * memMan.tileSize) - 880);
    // var tempMaxY = 0 - ((maxY * memMan.tileSize) - 586);

    // if (tempOffSetX > 0) {

    //     tempOffSetX = 0;
    // }
    // else if (tempOffSetX < tempMaxX) {

    //     tempOffSetX = tempMaxX;
    // }

    // if (tempOffSetY > 0) {

    //     tempOffSetY = 0;
    // }
    // else if (tempOffSetY < tempMaxY) {

    //     tempOffSetY = tempMaxY;
    // }




    for (y = 0; y < maxY; y++) {

        for (x = 0; x < maxX; x++) {

            if (memMan.gameMap[y][x] != null) {

                //if (memMan.terrain[memMan.gameMap[y][x]].speed > 0) {

                //    if (memMan.terrain[memMan.gameMap[y][x]].coords[3] == 1 && (memMan.terrain[memMan.gameMap[y][x]].coords[1] * memMan.tileSize) > x + memMan.terrain[memMan.gameMap[y][x]].coords[2]) {

                //        memMan.terrain[memMan.gameMap[y][x]].coords[2] += memMan.terrain[memMan.gameMap[y][x]].speed;
                //        memMan.sprites[memMan.terrain[memMan.gameMap[y][x]].sprite].setPosition(x * memMan.tileSize + memMan.terrain[memMan.gameMap[y][x]].coords[2], y * memMan.tileSize);
                //    }
                //    else {

                //        memMan.terrain[memMan.gameMap[y][x]].coords[3] = 0;
                //        memMan.terrain[memMan.gameMap[y][x]].coords[2] -= memMan.terrain[memMan.gameMap[y][x]].speed;
                //        memMan.sprites[memMan.terrain[memMan.gameMap[y][x]].sprite].setPosition(x * memMan.tileSize + memMan.terrain[memMan.gameMap[y][x]].coords[2], y * memMan.tileSize);

                //        if (memMan.terrain[memMan.gameMap[y][x]].coords[3] == 0 && (memMan.terrain[memMan.gameMap[y][x]].coords[0] * memMan.tileSize) > x + memMan.terrain[memMan.gameMap[y][x]].coords[2]) {

                //            memMan.terrain[memMan.gameMap[y][x]].coords[3] = 1;
                //        }
                //    }

                //}
                //else {

                memMan.sprites[memMan.terrain[memMan.gameMap[y][x]].sprite].setPosition((x * memMan.tileSize) + tempOffSetX, (y * memMan.tileSize) + tempOffSetY);
                //}


                memMan.sprites[memMan.terrain[memMan.gameMap[y][x]].sprite].animate(ctx, timer);
                memMan.sprites[memMan.terrain[memMan.gameMap[y][x]].sprite].draw(ctx);
            }

        }
    }


    

    var noItems = memMan.items.length;

    for (n = 0; n < noItems; n++) {

        if (memMan.items[n].show == 1) {
            memMan.sprites[memMan.items[n].sprite].setPosition((memMan.items[n].x * memMan.tileSize) + tempOffSetX, (memMan.items[n].y * memMan.tileSize) + tempOffSetY);
            memMan.sprites[memMan.items[n].sprite].animate(ctx, timer);
            memMan.sprites[memMan.items[n].sprite].draw(ctx);
        }
    }

    if (showTriggers == true) {

        var noTriggers = memMan.trigger.length;

        for (n = 0; n < noTriggers; n++) {

            ctx.beginPath();
            ctx.strokeStyle = "#ff0000";
            ctx.rect(memMan.trigger[n].x + tempOffSetX, memMan.trigger[n].y + tempOffSetY, memMan.trigger[n].width, memMan.trigger[n].height);
            ctx.stroke();
        }
    }

    memMan.sprites["heart"].setPosition(5,5);
    memMan.sprites["heart"].animate(ctx, timer);
    memMan.sprites["heart"].draw(ctx);

    ctx.font = "20pt Calibri";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "white";
    ctx.fillText(memMan.player[0].lives, 42, 0);

    memMan.sprites["coin1"].setPosition(5,42);
    memMan.sprites["coin1"].animate(ctx, timer);
    memMan.sprites["coin1"].draw(ctx);

    ctx.font = "20pt Calibri";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "white";
    ctx.fillText(memMan.inventory["coin"], 42, 42);

}

function Trigger(_x, _y, _width, _height, _action) {

    this.x = _x;
    this.y = _y;
    this.width = _width;
    this.height = _height;
    this.action = _action;
}

function MemoryMng() {

    this.sprites = new Object();
    this.terrain = new Object();
    this.gameMap = new Array();
    this.player = new Array();
    this.enemy = new Array();
    this.trigger = new Array();
    this.items = new Array();
    this.inventory = new Object();
    this.tileSize = 16;
    this.levelName = "";


    this.addInventory = function (id) {

        if (this.inventory[id] != undefined) {

            this.inventory[id]++;
        }
        else {

            this.inventory[id] = 1;
        }

    }

    this.addItem = function (_sprite, _x, _y) {

        this.items.push(new Item(_sprite, _x, _y));
    }

    this.removeItem = function (id) {

        this.items[id].show = 0;
    }

    this.addTrigger = function (_x, _y, _width, _height, _action) {

        this.trigger.push(new Trigger(_x, _y, _width, _height, _action));
    }

    this.addSprite = function (_id, _spritesheet, _width, _height, _x, _y, _noAnim, _dur) {

        this.sprites[_id] = new Sprite(_spritesheet, _width, _height, _x, _y, _noAnim, _dur);
    }

    this.addTerrain = function (_id, _sprite, _solid, _safe, _speed, _coords, _conv) {

        this.terrain[_id] = new Terrain(_sprite, _solid, _safe, _speed, _coords, _conv);
    }

    this.addPlayer = function (_sprite, _spriteWalk, _spriteJump, _spriteSwim, _spriteKo, _x, _y) {

        this.player[0] = new Player(_sprite, _spriteWalk, _spriteJump, _spriteSwim, _spriteKo, _x, _y);
    }

    this.addEnemy = function (_sprite, _x, _y) {

        this.enemy.push(new Enemy(_sprite, _x, _y));
    }


}

function Item(_sprite, _x, _y) {


    this.sprite = _sprite;
    this.x = _x;
    this.y = _y;
    this.show = 1;
}

function Terrain(_sprite, _solid, _safe, _speed, _coords, _conv) {

    //this.id 		= _id;
    this.sprite = _sprite;
    this.solid = _solid; // top, sides, all, none.
    this.safe = _safe; // 0 = kills player.
    this.speed = _speed // Speed terrain moves
    this.coords = _coords // Start and return pos.
    this.conveyor = _conv; // true is the terrain acts as a converyor belt.
}

//#######################################################################################################
// This class if from the book Making Isometric Social Real time Games and is available from
// https://github.com/andrespagella/Making-Isometric-Real-time-Games/blob/master/examples/sprite.js

var Sprite = function (src, width, height, offsetX, offsetY, frames, duration) {
    this.spritesheet = null;
    this.offsetX = 0;
    this.offsetY = 0;
    this.width = width;
    this.height = height;
    this.frames = 1;
    this.currentFrame = 0;
    this.duration = 1;
    this.posX = 0;
    this.posY = 0;
    this.shown = true;
    this.zoomLevel = 1;
    this.shadow = null;

    this.setSpritesheet(src);
    this.setOffset(offsetX, offsetY);
    this.setFrames(frames);
    this.setDuration(duration);

    var d = new Date();

    if (this.duration > 0 && this.frames > 0) {

        this.ftime = d.getTime() + (this.duration / this.frames);
    }
    else {
        this.ftime = 0;
    }
}

Sprite.prototype.setSpritesheet = function (src) {
    if (src instanceof Image) {

        this.spritesheet = src;
    }
    else {
        this.spritesheet = new Image();
        this.spritesheet.src = src;
    }
}

Sprite.prototype.setPosition = function (x, y) {
    this.posX = x;
    this.posY = y;
}

Sprite.prototype.setOffset = function (x, y) {
    this.offsetX = x;
    this.offsetY = y;
}

Sprite.prototype.setFrames = function (fcount) {
    this.currentFrame = 0;
    this.frames = fcount;
}

Sprite.prototype.setDuration = function (duration) {
    this.duration = duration;
}

Sprite.prototype.animate = function (c, t) {
    if (t.getMilliseconds() > this.ftime) {

        this.nextFrame();
    }
}

Sprite.prototype.nextFrame = function () {

    if (this.duration > 0) {

        var d = new Date();

        if (this.duration > 0 && this.frames > 0) {

            this.ftime = d.getTime() + (this.duration / this.frames);
        }
        else {

            this.ftime = 0;
        }

        this.offsetX = this.width * this.currentFrame;

        if (this.currentFrame === (this.frames - 1)) {

            this.currentFrame = 0;
        }
        else {

            this.currentFrame++;
        }
    }
}

Sprite.prototype.draw = function (c, drawShadow) {

    if (this.shown) {
        if (drawShadow !== undefined && drawShadow) {
            if (this.shadow === null) { // Shadow not created yet
                var sCnv = document.createElement("canvas");
                var sCtx = sCnv.getContext("2d");

                sCnv.width = this.width;
                sCnv.height = this.height;

                sCtx.drawImage(this.spritesheet,
				this.offsetX,
				this.offsetY,
				this.width,
				this.height,
				0,
				0,
				this.width * this.zoomLevel,
				this.height * this.zoomLevel);

                var idata = sCtx.getImageData(0, 0, sCnv.width, sCnv.height);

                for (var i = 0, len = idata.data.length; i < len; i += 4) {
                    idata.data[i] = 0; // R
                    idata.data[i + 1] = 0; // G
                    idata.data[i + 2] = 0; // B
                }

                sCtx.clearRect(0, 0, sCnv.width, sCnv.height);
                sCtx.putImageData(idata, 0, 0);

                this.shadow = sCtx;
            }

            c.save();
            c.globalAlpha = 0.1;
            var sw = this.width * this.zoomLevel;
            var sh = this.height * this.zoomLevel;
            c.drawImage(this.shadow.canvas, this.posX, this.posY - sh, sw, sh * 2);
            c.restore();
        }

        c.drawImage(this.spritesheet,
		this.offsetX,
		this.offsetY,
		this.width,
		this.height,
		this.posX,
		this.posY,
		this.width * this.zoomLevel,
		this.height * this.zoomLevel);
    }
}
//######################################################################################################