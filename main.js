window.onload = main;

var ctx;
var last_time;
var x;
var car1;
var car2;

class car{
    constructor(x_,y_){
        this.x = x_;
        this.y = y_;
        this.color = "black";
        //自身を描画
    }

    randomove(context){
        this.x += (Math.random()-0.5)*2;
        this.y += (Math.random()-0.5)*2;
        context.beginPath();
        context.arc(this.x,this.y,2,0,Math.PI*2,true);
        context.fillStyle = ("green");
        context.fill();
    }

    heading_target(context,target_car){
        var dir_x = target_car.x - this.x;
        var dir_y = target_car.y - this.y;
        var denominator = Math.sqrt(dir_x**2+dir_y**2);

        this.x += dir_x/denominator + (Math.random()-0.5)*2;
        this.y += dir_y/denominator + (Math.random()-0.5)*2;
        context.beginPath()
        context.arc(this.x,this.y,2,0,Math.PI*2,true);
        context.fillStyle = (this.color);
        context.fill();
    }

    escape_enemy(context,enemy_car){
        var dir_x = this.x - enemy_car.x;
        var dir_y = this.y - enemy_car.y;
        var denominator = Math.sqrt(dir_x**2+dir_y**2);

        this.x += dir_x/denominator +(Math.random()-0.5)*2;
        this.y += dir_y/denominator +(Math.random()-0.5)*2;
        context.beginPath()
        context.arc(this.x,this.y,2,0,Math.PI*2,true);
        context.fillStyle = (this.color);
        context.fill();
    }
}

function main(){
var canvas = document.getElementById("field");
canvas.innerText = "test";

ctx = canvas.getContext('2d');

car1 = new car(10,40);
car2 = new car(300,200);

window.requestAnimationFrame(()=>loop_animation());
}

function loop_animation(){
/* 経過時間計算 */
var now_time = performance.now();
var delta_time = now_time - last_time;
last_time = now_time;
var delta_x = delta_time/60;

    ctx.fillRect(x,20,4,4);
    x = x+1;

    car1.heading_target(ctx,car2);
    car2.escape_enemy(ctx,car1);
    window.requestAnimationFrame((x)=>loop_animation(x));
}