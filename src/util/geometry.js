/**
 * Created by cai yi hui on 2016/3/9.
 */
/* eslint-disable*/
const minDeltaK = 0.01;//两线段要平行的话，斜率相差的最小值
const zeroDistance = 3;//两线段相差3个像素时，认为是距离相等
const verticalK = 99999999;//当线段垂直横轴时，斜率设值
/*计算任意两点之间的距离 p = {x:1,y:1}*/
export function pointDistance(p1,p2){
    if(regardAsPoint(p1)&&regardAsPoint(p2)){
        return Math.sqrt(Math.pow(p1["x"]-p2["x"],2)+Math.pow(p1["y"]-p2["y"],2));
    }
}
/*判断两线段是否平行line = { p1:{x:1,y:1}, p2:{x:1,y:1} }*/
export function isParallel(line1,line2){
    if(regardAsLine(line1)&&regardAsLine(line2)){
        var deltaX1 = line1["p1"]["x"]-line1["p2"]["x"];
        var deltaX2 = line2["p1"]["x"]-line2["p2"]["x"];
        var deltaY1 = line1["p1"]["y"]-line1["p2"]["y"];
        var deltaY2 = line2["p1"]["y"]-line2["p2"]["y"];
        if(deltaX1===0&&deltaX2===0){//两线段垂直于横轴
            return true;
        }else if(deltaX1!==0&&deltaX2!==0){
            var k1 = deltaY1/deltaX1;
            var k2 = deltaY2/deltaX2;
            var deltaK = k2-k1;//两线段的斜率之差
            if(deltaK<minDeltaK){
                return true;
            }
        }
    }
    return false;
}
export function Point(x,y){
    if(arguments&&arguments[0]&&regardAsPoint(arguments[0])){
        this.x = arguments[0].x;
        this.y = arguments[0].y;
        this.setX = arguments[0].setX;
        this.setY = arguments[0].setY;
        this.distanceTo = arguments[0].distanceTo;
    }else{
        this.x = x;
        this.y = y;
    }
    if(!this.distanceTo){
        this.distanceTo = function(other){
            return Math.sqrt(Math.pow(this.x-other.x,2)+Math.pow(this.y-other.y,2));
        }
    }
    if(!this.setX){
    	this.setX = function(x){
    		if(x instanceof Number){
    			this.x = x;
    		}
            return this;
    	}
    }
    if(!this.setY){
    	this.setY = function(y){
    		if(y instanceof Number){
    			this.y = y;
    		}
            return this;
    	}
    }
}
function regardAsPoint(p){
  return p&& p.hasOwnProperty("x")&& p.hasOwnProperty("y")
    /*&& p.hasOwnProperty("distanceTo")*/;
}
export function Line(p1,p2){
    if(arguments&&arguments[0]&&regardAsLine(arguments[0])){
        this.p1 = arguments[0].p1;
        this.p2 = arguments[0].p2;
        this.distanceToPoint = arguments[0].distanceToPoint;
        this.distanceToLine = arguments[0].distanceToLine;
        this.getK = arguments[0].getK;
        this.isParallel = arguments[0].isParallel;
        this.isOverlap = arguments[0].isOverlap;
        this.length = arguments[0].length;
        this.setP1 = arguments[0].setP1;
        this.setP2 = arguments[0].setP2;
    }else{
        this.p1 = p1;//第一个点
        this.p2 = p2;//第二个点
    }
    if(!this.distanceToPoint){
        //点与线段的距离
        this.distanceToPoint = function(point){
            if(this.getK()===verticalK){
                return Math.abs(this.p1.x-point.x);
            }else{
                //线段方程为y = kx + b; 因此 y = this.getK()*x + b;所以b = this.p1.y - this.getK()*this.p1.x;
                var k = this.getK();
                var b = this.p1.y - k*this.p1.x;//计算线段截距
                return Math.abs(k*point.x + b-point.y)/Math.sqrt(Math.pow(k,2)+1);
            }
        };
    }
    if(!this.distanceToLine){
        //线段与线段之间的距离
        this.distanceToLine = function (line) {
            if(isParallel(this,line)){
                return this.distanceToPoint(line.p1);
            }
        };
    }
    if(!this.getK){
        //线段斜率
        this.getK = function(){
            var deltaX = this.p1.x-this.p2.x;
            var deltaY = this.p1.y-this.p2.y;
            if(deltaX===0){
                return verticalK;
            }else{
                var K = deltaY/deltaX;
                return K>verticalK?verticalK:K;
            }
        };
    }
    if(!this.isParallel){
        //是否与另一线段平行
        this.isParallel = function(line){
            return isParallel(this,line);
        };
    }
    if(!this.isOverlap){
        //两线段是否有重叠
        this.isOverlap = function (line){
            if(this.isParallel(line)){
                this.isOverlap.currentDistance = this.distanceToLine(line);
                if(this.isOverlap.currentDistance<zeroDistance){
                    var minX,maxX,minY,maxY;
                    var array = [this.p1,this.p2,line.p1,line.p2];
                    if(this.getK()===verticalK){
                        array.sort(function(a,b){
                            return a.y - b.y;
                        });
                    }else{
                        array.sort(function(a,b){
                            return a.x - b.x;
                        });
                    }
                    minX = array[0].x;
                    minY = array[0].y;
                    maxX = array[3].x;
                    maxY = array[3].y;
                    var lineLengthSum = this.length()+Math.sqrt(Math.pow(line.p1.x-line.p2.x,2)+Math.pow(line.p1.y-line.p2.y,2));
                    var twoFarthestPointDistance = Math.sqrt(Math.pow(maxX-minX,2)+Math.pow(maxY-minY,2));
                    return twoFarthestPointDistance<lineLengthSum;//重合后的总线段的长度小于两线段的长度之和，则证明有重叠了
                }
            }
            return false;
        }
    }
    if(!this.length){
        //计算线段的自身长度
        this.length = function(){
            return Math.sqrt(Math.pow(this.p1.x-this.p2.x,2)+Math.pow(this.p1.y-this.p2.y,2));
        }
    }
    if(!this.setP1){
        this.setP1 = function (p1) {
            if(regardAsPoint(p1)){
                this.p1 = p1;
            }
            return this;
        }
    }
    if(!this.setP2){
        this.setP2 = function (p2) {
            if(regardAsPoint(p2)){
                this.p2 = p2;
            }
            return this;
        }
    }
}
function regardAsLine(line){
  return line&&line.hasOwnProperty("p1")&&line.hasOwnProperty("p2")&&regardAsPoint(line.p1)&&regardAsPoint(line.p2)
    /* &&line.hasOwnProperty("getK")
     &&line.hasOwnProperty("distanceToPoint")&&line.hasOwnProperty("distanceToLine")
     &&line.hasOwnProperty("isParallel")&&line.hasOwnProperty("isOverlap")&&line.hasOwnProperty("length")*/;
}
/**
 *
 * @param p_lt 左上角顶点    或    上边的线段
 * @param p_rt 右上角顶点    或    右边的线段
 * @param p_lb 左下角顶点    或    下边的线段
 * @param p_rb 右下角顶点    或    左边的线段
 * @param color 矩形的填充颜色
 * @constructor
 */
export function Rectangle(p_lt,p_rt,p_lb,p_rb,color){
    this.makeTinyDistanceToZero = false;
    if(regardAsPoint(p_lt)&&regardAsPoint(p_rt)&&regardAsPoint(p_lb)&&regardAsPoint(p_rb)){
        this.lineTop = new Line(p_lt,p_rt);
        this.lineRight= new Line(p_rt,p_rb);
        this.lineBottom = new Line(p_rb,p_lb);
        this.lineLeft = new Line(p_lb,p_lt);
        this.p_lt = p_lt;
        this.p_rt = p_rt;
        this.p_rb = p_rb;
        this.p_lb = p_lb;
    }else if(regardAsLine(p_lt)&&regardAsLine(p_rt)&&regardAsLine(p_lb)&&regardAsLine(p_rb)){
        this.p_lt = p_lt.p1;
        this.p_rt = p_lt.p2;
        this.p_rb = p_lb.p2;
        this.p_lb = p_lb.p1;
        this.lineTop = p_lt;
        this.lineRight= p_rt;
        this.lineBottom = p_lb;
        this.lineLeft = p_rb;
    }
    if(color){
        this.color = color;
    }
    /**
     * 看两个不交叉的矩形是否有一边重合
     * @param other
     * @returns {boolean}
     */
    this.isOverlapTo = function(other){
        var isOverlap = false;
        if(this.lineTop.isOverlap(other.lineBottom)){
            isOverlap = true;
            if(this.makeTinyDistanceToZero){
                var delta = this.lineTop.isOverlap.currentDistance;
                if(delta!==0){
                    this.shrink({
                        "down":delta
                    });
                }
            }
        }else if(this.lineRight.isOverlap(other.lineLeft)){
            isOverlap = true;
            if(this.makeTinyDistanceToZero){
                var delta = this.lineRight.isOverlap.currentDistance;
                if(delta!==0){
                    this.shrink({
                        "left":delta
                    });
                }
            }
        }else if(this.lineBottom.isOverlap(other.lineTop)){
            isOverlap = true;
            if(this.makeTinyDistanceToZero){
                var delta = this.lineBottom.isOverlap.currentDistance;
                if(delta!==0){
                    this.shrink({
                        "up":delta
                    });
                }
            }
        }else if(this.lineLeft.isOverlap(other.lineRight)){
            isOverlap = true;
            if(this.makeTinyDistanceToZero){
                var delta = this.lineLeft.isOverlap.currentDistance;
                if(delta!==0){
                    this.shrink({
                        "right":delta
                    });
                }
            }
        }
        return isOverlap;
    }
    this.refreshLine = function () {
        this.lineBottom = this.lineBottom.setP1(this.p_lb).setP2(this.p_rb);
        this.lineLeft = this.lineLeft.setP1(this.p_lt).setP2(this.p_lb);
        this.lineRight = this.lineRight.setP1(this.p_rt).setP2(this.p_rb);
        this.lineTop = this.lineTop.setP1(this.p_lt).setP2(this.p_rt);
        return this;
    }
    /**
     * 矩形的收缩方法，某一边（或几条）往矩形中心移动。可向下、向左、向上、向右平移收缩
     * 向下为正方向，向右为正方向
     * shrinkObj = {
     *      "down":100,
     *      "up":20,
     *      "right":12,
     *      "left":30
     * }
     */
    this.shrink = function (shrinkObj) {
        if(shrinkObj){
            if(shrinkObj.up){
                var up = shrinkObj.up;
                this.p_lb = {x:this.p_lb.x,y:this.p_lb.y-up};
                this.p_rb = {x:this.p_rb.x,y:this.p_rb.y-up};
                this.refreshLine();
            }
            if(shrinkObj.down){
                var down = shrinkObj.down;
                this.p_lt = {x:this.p_lt.x,y:this.p_lt.y+down};
                this.p_rt = {x:this.p_rt.x,y:this.p_rt.y+down};
                this.refreshLine();
            }
            if(shrinkObj.left){
                var left = shrinkObj.left;
                this.p_rt = {x:this.p_rt.x-left,y:this.p_rt.y};
                this.p_rb = {x:this.p_rb.x-left,y:this.p_rb.y};
                this.refreshLine();
            }
            if(shrinkObj.right){
                var right = shrinkObj.right;
                this.p_lt = {x:this.p_lt.x+right,y:this.p_lt.y};
                this.p_lb = {x:this.p_lb.x+right,y:this.p_lb.y};
                this.refreshLine();
            }

        }
        return this;
    }
    this.setMakeTinyDistanceToZero = function (enable) {
        this.makeTinyDistanceToZero = enable;
        return this;
    }
    this.width = function () {
        return this.lineTop.length();
    }
    this.height = function () {
        return this.lineLeft.length();
    }
}
/**
 * 根据左上角顶点，以及宽和高，颜色来创建矩形
 */
export function makeRectangle(p_lt,width,height,color){
    if(regardAsPoint(p_lt)){
        var x = p_lt.x;
        var y = p_lt.y;
        return new Rectangle(p_lt,{x:x+width,y:y},{x:x,y:y+height},{x:x+width,y:y+height},color);
    }
}
/**
 * 求两矩形的交叉区域，如存在则返回交叉矩形的对象，如果不存在，则返回undefined
 * @param rect1
 * @param rect2
 */
export function intersectionOfRectangles(rect1,rect2){
    var rect1_p_lt = rect1.p_lt,rect1p_p_lb = rect1.p_lb,rect1p_p_rt = rect1.p_rt,rect1p_p_rb = rect1.p_rb;
    var rect2_p_lt = rect2.p_lt,rect2p_p_lb = rect2.p_lb,rect2p_p_rt = rect2.p_rt,rect2p_p_rb = rect2.p_rb;
    var width1 = rect1.lineTop.length(),height1 = rect1.lineLeft.length();
    var width2 = rect2.lineTop.length(),height2 = rect2.lineLeft.length();
    var horizontalPoints = [rect1_p_lt,rect1p_p_rt,rect2_p_lt,rect2p_p_rt];
    var verticalPoints = [rect1_p_lt,rect1p_p_lb,rect2_p_lt,rect2p_p_lb];
    horizontalPoints.sort(function (a,b) {
        return a.x- b.x;
    });
    verticalPoints.sort(function (a,b) {
        return a.y- b.y;
    });
    if(horizontalPoints[3].x-horizontalPoints[0].x>=width1+width2||verticalPoints[3].y-verticalPoints[0].y>=height1+height2){

    }else{
        var intersectionWidth = (width1+width2)-(horizontalPoints[3].x-horizontalPoints[0].x);
        var intersectionHeight = (height1+height2)-(verticalPoints[3].y-verticalPoints[0].y);
        return makeRectangle(
            {x:horizontalPoints[1].x,y:verticalPoints[1].y},intersectionWidth,intersectionHeight);
    }
}


