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

        this.speed = 0;     /* (px/frame) */

        /* 世界の情報 */
        this.world_width = 800; //px
        /* 前回値更新 */
        this.x0 = this.x;
    }

    /* 自動ブレーキ */
    auto_brake(){
        var eye_range=10;
        var brake_amp=0;
        if(this.speed > 0){
            eye_range = 10;
            brake_amp = -2;
        }else{
            eye_range = -10;
            brake_amp  = 2;
        }

        if(this.watch_ahead(eye_range) == true){
            this.accell_move(brake_amp)
            console.log("brake");
        }
    }

    /* eye_range: (正の整数) 視界距離 */
    /* return true:前方に障害物あり */
    watch_ahead(eye_range){
        var eye_x;
        for(eye_x=0;eye_x<=eye_range;eye_x++){
            if(this.watch_a_point(eye_x) == true){
                return(true);
            };
        }
    }

    /* 自分から進行方向に range 離れた点(pixel)を見る。物体があれば(背景と異なる色であれば)true*/
    watch_a_point(range){
        /* 進行方向を考慮 */
        if(this.speed < 0){
            range = (-1) * range;
        }
        if(this.speed == 0){
            console.log("stop");
        }

        /* 見るべき画像の位置を計算 */
        var x_px_watch = this.x + range;
        if(x_px_watch > this.world_width){
            x_px_watch = x_px_watch %this.world_width;
        }else if(this.x < 0){
            x_px_watch = this.world_width - x_px_watch;
        }
        var y_px_watch = this.y;

        /* road01の画像取得 */
        var imagedata = ctx.getImageData(x_px_watch, y_px_watch, 1, 1);

        var ret = false;
        if(   (imagedata.data[0] > 0)
            ||(imagedata.data[1] > 0)
            ||(imagedata.data[2] > 0)){
            //||(imagedata.data[3] > 0)){

                ret = true;
                console.log(ret);
        }
        //console.log(imagedata.data);
        //console.log(imagedata.data[1]);
        //console.log(imagedata.data[2]);
        //console.log(imagedata.data[3]);

        return ret;
    }
    /* 加速 */
    /* accell (px/frame/frame) */
    accell_move(accell){
        this.speed = this.speed + accell;
        this.move_inertial();
    }

    /* 慣性運動 */
    move_inertial(){
        this.auto_brake();
        this.move(this.speed);
    }

    move(speed){
        /* 世界の大きさを考慮 */    //[TODO]値のsetterにも考慮させるべきか
        this.x = this.x + speed;
        if(this.x > this.world_width){
            this.x = (this.x + speed)%this.world_width;
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
    car3.speed = 1;
    car4 = new car_x(100,80,"blue",ctx);
    car4.bgcolor = "blanchedalmond";
    car5 = new car_x(200,80,"red",ctx);
    car5.bgcolor = "blanchedalmond";


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

    car3.move_inertial();
    car3.auto_brake();

    /* アニメーションループ */
    window.requestAnimationFrame((x)=>loop_animation(x));
}
/*
[TODO]
[]世界の1ターンの同時性 先行が有利？
[]car.move(1.5) としたときに残像が残る問題
*/