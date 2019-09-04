window.onload = main;

var ctx;        //global  canvasのcontext
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
/* car : only move x directive */
class car_x{
    constructor(x_,y_,color_,){
        this.x = x_;
        this.y = y_;            //ground position
        this.color = color_;
        this.draw_self();
        this.bgcolor = "gray";

        /* 世界の情報 */
        this.world_width = 800; //px
        /* 前回値更新 */
        this.x0 = this.x;
    }

    move(x_move){
        /* 世界の大きさを考慮 */    //[TODO]値のsetterにも考慮させるべきか
        this.x = this.x + x_move;
        if(this.x > this.world_width){
            this.x = (this.x + x_move)%this.world_width;
        }else if(this.x < 0){
            this.x = this.world_width - this.x;
        }

        this.delete_oldme();
        this.draw_self();

        /* 前回値更新 */
        this.x0 = this.x;
    }
    draw_self(){
        ctx.beginPath();
        ctx.fillStyle = (this.color);
        ctx.fillRect(this.x,this.y,4,4);
    }
    delete_oldme(){
        ctx.beginPath();
        ctx.fillStyle = (this.bgcolor);
        ctx.fillRect(this.x0,this.y,4,4);
    }
}
function main(){
    ctx = document.getElementById("field").getContext('2d');

    car1 = new car(10,40);
    car2 = new car(300,200);

    /* Road01 */
    ctx = document.getElementById("road01").getContext('2d');
    car3 = new car_x(50,80,"black",ctx);
    car3.bgcolor = "blanchedalmond";

    window.requestAnimationFrame(()=>loop_animation());
}

function loop_animation(){
    /* 経過時間計算 */
    var now_time = performance.now();
    var delta_time = now_time - last_time;
    last_time = now_time;
    var delta_x = delta_time/60;

    /* field */
    ctx = document.getElementById("field").getContext('2d');
    ctx.fillRect(x,20,4,4);
    x = x+1;

    car1.heading_target(ctx,car2);
    car2.escape_enemy(ctx,car1);

    /* Road01 */
    ctx = document.getElementById("road01").getContext('2d');
    car3.move(1);


    /* アニメーションループ */
    window.requestAnimationFrame((x)=>loop_animation(x));
}