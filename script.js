const SHAPES =[
    [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0]
    ],
    [
        [0,1,0],
        [0,1,0],
        [1,1,0]
    ],
    [
        [0,1,0],
        [0,1,0],
        [0,1,1]
    ],
    [
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ],
    [
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ],
    [
        [1,1,1],
        [0,1,0],
        [0,0,0]
    ],
    [
        [1,1],
        [1,1]
    ],
    [
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ]
]
// colors for the blocks
const COLORS =[
    "#fff" ,//index-0 for empty cells 
    "#9b5fe0","#16a4d8","#60dbe8","#8bd346","#efdf48","#f9a52c","#d64612", "#ff69b4"
]

//definging rows and columns
const ROWS = 18;
const COLS = 10;

let canvas=document.querySelector("#block");
let scoreboard =document.querySelector("h2");
//ctx as drawing pen cnavas as drawing board
let ctx=canvas.getContext("2d"); //2d drawing bpoard
ctx.scale(30,30);

let pieceObject=null;
let grid=generateGrid();
let score=0;
console.log(grid);

// generating for our memeory
function generateRandomPiece(){
    let ran= Math.floor(Math.random()*8);
    //console.log(SHAPES[ran]);
    let piece=SHAPES[ran];
    let colorIndex =ran+1;
    let x=4;
    let y=0;
    return {piece,x,y,colorIndex};
}

setInterval(newGameState,500);
function newGameState(){
    checkGrid();
    if(pieceObject == null){
        pieceObject=generateRandomPiece();
        renderPiece();
    }
    moveDown();
}

function checkGrid(){
    let count=0
    for(let i=0;i<grid.length;i++){
        let allfilled=true;
        for(let j=0;j<grid[i].length;j++){
            if(grid[i][j]==0){
                allfilled=false;
            }
        }
        if(allfilled){
            grid.splice(i,1); //delete the full row
            grid.unshift([0,0,0,0,0,0,0,0,0,0]);
            count++;
        }
    }
    //for upadting score
    if(count ==1 ){
        score+=10;
    }else if(count ==2 ){
        score+=20;
    }else if(count ==3 ){
        score+=30;
    }else if(count >3 ){
        score+=50;
    }
    scoreboard.innerHTML = "Score: "+ score;
}


//showing piece on UI
function renderPiece(){
    let piece= pieceObject.piece;
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            if(piece[i][j]==1){
                ctx.fillStyle = COLORS[pieceObject.colorIndex];
                ctx.fillRect(pieceObject.x+j,pieceObject.y+i,1,1); //(x-cor,y-cor,width,height)
                
            }
        }
    }
}

//to motion the pieces

function moveDown(){
    if(!collision(pieceObject.x,pieceObject.y+1))
        pieceObject.y+=1; //for the memory
    else{
        let piece = pieceObject.piece;
        for(let i=0;i<piece.length;i++){
            for(let j=0;j<piece[i].length;j++){
                if(pieceObject.piece[i][j]==1){
                    let p=pieceObject.x+j;
                    let q=pieceObject.y+i;
                    //fixing the grid coclor
                    grid[q][p]= pieceObject.colorIndex;
                }
            }
        }
        if(pieceObject.y==0){
            alert("Game Over");
            grid=generateGrid();//new Game
            score=0;
        }
        pieceObject=null;
    }
    renderGrid(); 
}

function moveLeft(){
    if(!collision(pieceObject.x-1,pieceObject.y))
        pieceObject.x-=1;
  
    
    renderGrid(); 
}


function moveRight(){
    if(!collision(pieceObject.x+1,pieceObject.y))
        pieceObject.x+=1;
    renderGrid(); 
}

function rotate(){
    let rotatedPiece =[];
    let piece=pieceObject.piece;
    for(let i=0;i<piece.length;i++){
        rotatedPiece.push([]);
        for(let j=0;j<piece[i].length;j++){
            rotatedPiece[i].push(0);
        }
    }
    //transpose
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            rotatedPiece[i][j]=piece[j][i];
        }
    }
    for(let i=0;i<rotatedPiece.length;i++){
        rotatedPiece[i]=rotatedPiece[i].reverse();
    }

    if(!collision(pieceObject.x,pieceObject.y,rotatedPiece))
        pieceObject.piece=rotatedPiece;
    renderGrid();
}


//to stop the pices at the boders
function collision(x,y,rotatedPiece){
    let piece= rotatedPiece||pieceObject.piece;
     for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            if(piece[i][j]==1){
                //check with grid coordinates
                let p=x+j;
                let q=y+i;
                if(p>=0 && p<COLS && q>=0 && q<ROWS ){
                    //we are inside the canvas
                    if(grid[q][p]>0){
                        return true;
                    }
                }else{
                    //collision happens
                    return true;
                }
            }
        }
    }
    return false;
}

function generateGrid(){
    let grid = [];
    for(let i=0;i<ROWS;i++){
        grid.push([]);
        for(let j=0;j<COLS;j++){
            grid[i].push(0);
        }
    }
    return grid;
}

function renderGrid(){
    for(let i=0;i<grid.length;i++){
        for(let j=0;j<grid[i].length;j++){
            
                ctx.fillStyle = COLORS[grid[i][j]];
                ctx.fillRect(j,i,1,1); 
                
        }
    }
    renderPiece();
}

//event listerner to move the piece
document.addEventListener("keydown",function(e){
    console.log("Key pressed:", e.code);
    let key=e.code;
    if(key == "ArrowDown"){
        moveDown();
    }else if(key == "ArrowLeft"){
        moveLeft();
    }else if(key == "ArrowRight"){
        moveRight();
    }else if(key == "ArrowUp"){
        rotate();
    }

})