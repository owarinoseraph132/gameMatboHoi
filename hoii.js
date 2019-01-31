var myGamePiece;
var score = 0;
document.getElementById("score").innerHTML = `<h3 style="color:red">Score: ${score}</h3>`
var box = [];
var boxBlack = [];
var mySound;
var myMusic;
var mymusic;


function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}


var hihi = document.getElementById("choilai");
console.log(hihi)
hihi.style.display = 'none';

function restart(){
    window.location.protocol = 'file:///C:/baicode/index.html'
}
hihi.addEventListener("click", restart)


function startGame() {
    mySound = new sound("bounce.mp3");
    myMusic = new sound("gametheme.mp3");
    mymusic = new sound("bounce.mp3")
    myGamePiece = new component(40, 40, "a.png", 225, 225, "image");
    for (var i = 0; i < 4; i++) {
        var x = Math.floor(Math.random() * 900) + 1;
        var y = Math.floor(Math.random() * 500) + 1;
        box.push(new component(20, 20, "a.jpg", x, y, "image"))
        
    }

    for (var i = 0; i < 6 ; i++) {
        var x = Math.floor(Math.random() * 900) + 1;
        var y = Math.floor(Math.random() * 500) + 1;
        // myGamePiece la box do
        //Neu vi tri mygamePiece ma khac voi ca x, y (x,y la sinh random)
        //thi moi in ra box
        //Con khong thi se random lai den khi n khac thi moi in ra box
        if (myGamePiece.x !== x && myGamePiece.y !== y) {
            boxBlack.push(new component(50, 50, "cc.jpg", x, y, "image"))
        } else {
            var x = Math.floor(Math.random() * 900) + 1;
            var y = Math.floor(Math.random() * 500) + 1;
            boxBlack.push(new component(50, 50, "cc.jpg", x, y, "image"))
        }    
    }
    myGameArea.start();

}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 900;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            e.preventDefault();
            console.log(e)
            myGameArea.keys = (myGameArea.keys || []);
            console.log(myGameArea.keys[e.keyCode])
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
    },
    stop : function() {
        clearInterval(this.interval);
    },    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
}

function component(width, height, color, x, y, type = undefined) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.angle = 0;
    this.moveAngle = 0;
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        if (type == "image") {
            ctx.drawImage(this.image, 
              this.width / -2,
              this.height / -2,
              this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        }
        ctx.restore();
    }
    this.newPos = function() {
        this.angle += this.moveAngle * Math.PI / 180;
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
        mymusic.play();
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
        (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright)) {
          crash = false;
        }
        return crash;
      }
}

var startMove = false;
function updateGameArea() {
    myGameArea.clear();
    myGamePiece.moveAngle = 0;
    myGamePiece.speed = 0;
    if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.moveAngle = -10; }
    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.moveAngle = 10; }

    // Bat event nut bam, keyCode = 13 tuong duong voi nut Enter
    // Khi ma nut enter duowc bam thi StartMove => True
    if (myGameArea.keys && myGameArea.keys[13]) {  
        startMove = true
    }

    // Khi startMove = True thi bat dau cho di chuyen
    if (startMove) {
        myGamePiece.speed= 8;
    }
    myGamePiece.newPos();
    myGamePiece.update();



    // Cap nhat trang thai cac hop
    for (var i = 0; i < box.length; i++) {
        box[i].update();
    }
    for (var i = 0; i < boxBlack.length; i++) {
        boxBlack[i].update();
    }

    myMusic.play()
    // Xu ly khi va cham
    for (var i = 0; i < box.length; i++) {
        if (myGamePiece.crashWith(box[i])) {
            // Xu ly login khi va cham voi hop box xanh
            score += 1;
            document.getElementById("score").innerHTML = `<h3 style="color:red">Score: ${score}</h3>`
            var x = Math.floor(Math.random() * 900) + 1;
            var y = Math.floor(Math.random() * 500) + 1;
            box[i].x = x;
            box[i].y = y;
        }
    }  
    for (var j = 0; j < boxBlack.length; j++) {
        if (myGamePiece.crashWith(boxBlack[j])) {
            // Xu ly login khi va cham voi hop box xanh
            document.getElementById("thongbao").innerHTML = "<h4>Game over??? Reset the game to play more</h4>"
            mySound.play();
            myGameArea.stop();
            myMusic.stop();
            hihi.style.display = 'block';
        }
    }  

}
