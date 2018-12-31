let rectangles = [
  {
    screenWidth:100,
    screenHeight:200,
    data:[
      {x:0,y:0,w:30,h:50},
      {x:0,y:50,w:30,h:40},
      {x:0,y:90,w:15,h:70},
      {x:0,y:160,w:15,h:20},
      {x:0,y:180,w:45,h:20},
      {x:30,y:0,w:25,h:60},
      {x:30,y:60,w:25,h:30},
      {x:55,y:0,w:45,h:30},
      {x:55,y:30,w:45,h:60},
      {x:15,y:90,w:30,h:40},
      {x:45,y:90,w:55,h:60},
      {x:15,y:130,w:30,h:50},
      {x:45,y:150,w:27,h:50},
      {x:72,y:150,w:28,h:50}
    ]
  },
  {
    screenWidth:100,
    screenHeight:200,
    data:[
      {x:0,y:0,w:70,h:30},
      {x:0,y:30,w:35,h:30},
      {x:0,y:60,w:25,h:60},
      {x:0,y:120,w:90,h:50},
      {x:0,y:170,w:90,h:30},
      {x:35,y:30,w:35,h:30},
      {x:70,y:0,w:30,h:60},
      {x:25,y:60,w:45,h:60},
      {x:70,y:60,w:20,h:60},
      {x:90,y:60,w:10,h:140}
    ]
  }
];
module.exports = function () {
  rectangles.forEach((rect)=>{
    rect.data.forEach((d)=>{
      d.visitedCnt = Math.trunc(Math.random()*10000);//模拟浏览量
    });
  });
  return rectangles[Math.trunc(Math.random()*rectangles.length)];
};