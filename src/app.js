import './style/style.css';
import getRect from './script/rect';
import {Point, Rectangle} from "./util/geometry";
window.onload = function (event) {
  window.addEventListener('resize',()=>location.reload());
  const colors = ['#CC6699','#FFFF7A','#FFCC33',"#279B61"];
  let rectangle = getRect();//随机获取两个模拟方块数组中的一个
  var data = rectangle.data;//获取方块数组
  let sWidth = rectangle.screenWidth,//当前屏幕的想象宽度（是后台返回用于实际坐标以及宽高的参考值）
    sHeight = rectangle.screenHeight;//当前屏幕的想象高度（是后台返回用于实际坐标以及宽高的参考值）
  let docWidth = document.documentElement.offsetWidth;//当前文档的实际宽度
  let docHeight = document.documentElement.offsetHeight;//当前文档的实际高度
  let ratio = docWidth/sWidth;//实际长度值与想象长度值之间的比例关系。
  let app = document.querySelector('#app');
  let bodyHeight = Math.max(sHeight * ratio,docHeight);
  document.body.style.setProperty('height',bodyHeight+'px');
  let cnt = 0;

  /**
   *
   * @param px 左上角顶点x
   * @param py 左上角顶点y
   * @param w 矩形元素div的宽
   * @param h 矩形元素div的高
   * @param color 矩形元素的填充色
   * @param visitedCnt 浏览量m
   */
  function createDiv(px,py,w,h,color,visitedCnt) {
    let div = document.createElement('div');
    div.classList.add('rect');
    div.style.setProperty('left',px+'px');
    div.style.setProperty('top',py+'px');
    div.style.width = w+'px';
    div.style.height = h+'px';
    div.style.setProperty('background-color',color);
    div.innerText = '节目'+(++cnt)+'\n'+'浏览量'+ visitedCnt;
    app.appendChild(div);
  }

  let rectModels = [];
  //根据方块数组中的坐标以及长宽信息创建矩形数组
  for(let item of data){
    let x = item.x * ratio ;
    let y = item.y * ratio ;
    let w = item.w * ratio ;
    let h = item.h * ratio ;
    let tempRect = new Rectangle(new Point(x,y),new Point(x+w,y),new Point(x,y+h),new Point(x+w,y+h));
    //遍历矩形数组，获取与该tempRect矩形相邻的所有矩形
    let neighbours = rectModels.filter(function (e,i,arr) {
      return tempRect.isOverlapTo(e);
    });
    //过滤掉相邻矩形的颜色后，剩下的颜色组成的数组
    let availableColors = colors.filter(function (c) {
      return !neighbours.some(function (e) {
        return e.color === c;
      })
    });
    //然后在可选颜色中随机挑选一种填充色
    tempRect.color = availableColors[Math.trunc(Math.random()*availableColors.length)];
    tempRect.visitedCnt = item.visitedCnt;
    tempRect.px  = x;
    tempRect.py = y;
    tempRect.w = w;
    tempRect.h = h;
    //放入矩形数组中
    rectModels.push(tempRect);
  }
  rectModels.forEach(function (rect) {
    createDiv(rect.px,rect.py,rect.w,rect.h,rect.color,rect.visitedCnt);
  });
};