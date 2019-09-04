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
        //自身を描画
    }

    randomove(context){
        this.x += (Math.random()-0.5)*2;
        this.y += (Math.random()-0.5)*2;

        context.fillRect(this.x,this.y,4,4);
    }

    heading_target(context,target_car){
        var dir_x = target_car.x - this.x;
        var dir_y = target_car.y - this.y;
        var denominator = Math.sqrt(dir_x**2+dir_y**2);

        this.x += dir_x/denominator + (Math.random()-0.5)*2;
        this.y += dir_y/denominator + (Math.random()-0.5)*2;
        context.fillRect(this.x,this.y,4,4);
    }

    escape_enemy(context,enemy_car){
        var dir_x = this.x - enemy_car.x;
        var dir_y = this.y - enemy_car.y;
        var denominator = Math.sqrt(dir_x**2+dir_y**2);

        this.x += dir_x/denominator +(Math.random()-0.5)*2;
        this.y += dir_y/denominator +(Math.random()-0.5)*2;
        context.fillRect(this.x,this.y,4,4);
    }
}

class magnet{
    constructor(context,x_,y_){
        this.x = x_;
        this.y = y_;
        //自身を描画
        context.fillRect(this.x,this.y,5,5);//center:(x+3,y+3)
    }

    pull_car(context,car){
        var dir_x = this.x+3 - car.x;
        var dir_y = this.y+3 - car.y;
        var denominator = Math.sqrt(dir_x**2+dir_y**2);

        car.x  += dir_x/denominator*0.5;
        car.y  += dir_y/denominator*0.5;
        context.fillRect(car.x,car.y,4,4);
    }
}

function main(){
var canvas = document.getElementById("field");
canvas.innerText = "test";

ctx = canvas.getContext('2d');

car1 = new car(10,40);
car2 = new car(300,200);
mag1 = new magnet(ctx,200,200);

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

    //car2.randomove(ctx);
    //car1.randomove(ctx);
    car1.heading_target(ctx,car2);
    car2.escape_enemy(ctx,car1);
    mag1.pull_car(ctx,car2);
    window.requestAnimationFrame((x)=>loop_animation(x));
}