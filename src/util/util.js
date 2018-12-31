/*eslint-disable*/
/*获取当前javascript文件的路径，注意要把这方法拷贝到想知道路径的那个js文件里*/
export var getScriptURL = function() {
  var scripts = document.getElementsByTagName('script');
  var index = scripts.length - 1;
  var myScript = scripts[index];
  return myScript.src;
};
/**
 * 获取当前script标签，注意要把这方法拷贝到想知道路径的那个js文件里
 */
export var getCurrentScript = function() {
  var scripts = document.getElementsByTagName('script');
  var index = scripts.length - 1;
  var myScript = scripts[index];
  return myScript;
};
/**
 * 以相对路径的方式跳转到指定Url
 * 例如当前的页面为http://www.programstorm.com/test/abc.html，如果调用
 * loctaion.goToRelativePath('http://www.programstorm.com/test/other/efg.html'),
 * 则会把Location设成'/other/efg.html'这个相对路径的形式跳过去，而不是绝对路径
 * @param otherPath 目的Url
 * @param isReplace 是否在history中以覆盖原来Url地址方式入栈
 */
location.constructor.prototype.goToRelativePath=function(otherPath,isReplace){
  var url = relatePath(this.pathname,otherPath);
  if(!isReplace) {
    location.href = url;
  }else{
    location.replace(url);
  }
};

/**
 * 绝对Url转相对Url
 * @param urlFrom 源url
 * @param urlTo 目的url
 */
export function relativeURL(urlFrom,urlTo){
  if(realTypeof(urlFrom)=="location"||urlFrom.replace||urlFrom.assign||urlFrom.href){
    urlFrom = urlFrom.href;
  }
  var prefix = /^(?:http|ftp|https):\/{2,}(?:\w+(?:(?:\.\w+)+)?)(?:\:\d+)?/;
  var match = urlFrom.match(prefix),match2 = urlTo.match(prefix);
  if(!match||!match2){
    throw new Error("invalid Url.")
  }
  match = match[0];match2=match2[0];
  if(match!=match2){
    throw new Error("No relative urls.Same domain needed.");
  }
  var i=match.length;
  var pathF = urlFrom.substr(i),pathT = urlTo.substr(i);
  return relatePath(pathF,pathT);
}

/**
 * 绝对路径转相对路径
 * @param pathNameFrom
 * @param pathNameTo
 * @returns {string}
 */
export function relatePath(pathNameFrom,pathNameTo){
  if(pathNameFrom.pathname){
    pathNameFrom = pathNameFrom.pathname;
  }
  if(pathNameTo.pathname){
    pathNameTo = pathNameTo.pathname;
  }
  var prefix = /^(?:http|ftp|https):\/{2,}(?:\w+(?:(?:\.\w+)+)?)(?:\:\d+)?/;
  var match = pathNameFrom.match(prefix),match2 = pathNameTo.match(prefix);
  function verifyPathName(pathName){
    var reg = /^(\/(?:\w|\-)+)+(?:\/?|(?:\.\w+)?)([&=#a-zA-Z\-0-9]+)?$/;
    if(pathName){
      var index = pathName.indexOf("?");
      if(index>=0){
        pathName = pathName.substr(0,index);
      }
    }
    return reg.test(pathName);
  }
  var i=match?match[0].length:0,j=match2?match2[0].length:0;
  var pathFF = pathNameFrom.substr(i),pathTT = pathNameTo.substr(j);
  var index1 = pathFF.indexOf("\?"),index2 = pathTT.indexOf("\?");
  var pathF = pathFF,pathT=pathTT;
  if(index1>=0){
    pathF = pathF.substring(0,index1);
  }
  if(index2>=0){
    pathT = pathT.substring(0,index2);
  }
  if(verifyPathName(pathF)&&verifyPathName(pathT)){
    var ps1 = pathF.split("/");
    var ps2 = pathT.split("/");
    var paths1=[],paths2=[];
    ps1.every(function (e,i,arr) {
      if(/\w+/.test(e)){
        paths1.push(e)
      }
      return true;
    });
    ps2.every(function (e,i,arr) {
      if(/\w+/.test(e)){
        paths2.push(e)
      }
      return true;
    });
    var r = "";
    var same = true;
    var bingo=undefined;
    for(var g= 0,gl=paths1.length,pl=paths2.length;g<gl;g++){
      r+="../";
      if(g<pl){
        var item1 = paths1[g],item2 = paths2[g];
        if(item1==item2){
          if(same){
            bingo = item1;
            r= r.substr(3);
          }
        }else {
          same=false;
        }
      }else{

      }
    }
    if(r){
      r = r.substr(3);
    }
    var suffix;
    if(!r){
      suffix = pathTT;
    }else if (bingo){
      suffix = pathTT.substr(pathTT.indexOf(bingo)+bingo.length+1);
    }else{
      suffix=pathT;
    }
    r+=suffix;
    return r;
  }else{
    throw new Error("invalid path was detected.");
  }
}
export function getImgUrl(url,prefix) {
  if (url && (url.indexOf('https://') > -1||url.indexOf('http://') > -1 || url.indexOf('/sns/') > -1 || url.indexOf('image_data') != -1)) {
    return url;
  }
  if (url) {
    return prefix + url;
  }
  return '';
}
/**
 * 获取当前加载当前页面的地址里的query字符串的键值，如http://www.test.com?name=smith&age=20

 中的?name=smith&age=20
 * @param name 键,若name,age.该参数必填
 * @param locationSearch 备用query字符串，该参数可选.
 * @returns {*} 例如，传入"name",将得到"smith";
 */
export function getSearchParam(name, locationSearch) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = (locationSearch ? locationSearch : window.location.search).substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return "";
}
if (!Element.prototype.matches)
  Element.prototype.matches = Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;

if (!Element.prototype.closest)
  Element.prototype.closest = function(s) {
    var el = this;
    if (!document.documentElement.contains(el)) return null;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
/**非数字返回'--',数字返回相应位数的小数,例如nDigitsPlease(1.901,2)返回1.90*/
export function nDigitsPlease(digit,n) {
  digit = parseFloat(digit);
  digit = isNaN(digit)?'--':Math.round(digit*Math.pow(10,n))/Math.pow(10,n);
  if(digit!=='--'){
    var matches = (digit+'').match(/\.\d+/);//匹配小数部分
    var gidN = 0;
    if(matches){
      var match = matches[0];
      gidN = match.length-1;//小数的位数
    }
    if(gidN===0){
      digit+='.';
    }
    for(var i=gidN;i<n;i++){
      digit+='0';
    }
  }
  return digit;
}
/**埋点方法*/
export function doLog(eventId){
  function loadURL(url) {
    var iFrame;
    iFrame = document.createElement("iframe");
    iFrame.setAttribute("src", url);
    iFrame.setAttribute("style", "display:none;");
    iFrame.setAttribute("height", "0px");
    iFrame.setAttribute("width", "0px");
    iFrame.setAttribute("frameborder", "0");
    document.body.appendChild(iFrame);
    iFrame.parentNode.removeChild(iFrame);
    iFrame = null;
  }
  function exec(funName, args) {
    var commend = {
      functionName:funName,
      arguments:args
    };
    var jsonStr = encodeURIComponent(JSON.stringify(commend));
    var url = "reyun:" + jsonStr;
    console.log(url);
    loadURL(url);
  }
  exec("trackEvent", [{
    "Key": eventId
  }]);
}
//计算元素的坐标
export function getOffset(elem, rendered) {
  if (rendered == false || rendered == "false") {
    return getOffsetSum(elem);
  } else {
    return getOffsetRect(elem);
  }
}
export function getOffsetToViewport(elem, rendered) {
  if (rendered == true || rendered == "true") {
    return getOffsetRect(elem, true);
  } else {
    if (elem.getBoundingClientRect) {
      return getOffsetRect(elem, true);
    } else {
      return getOffsetSum(elem, true);
    }
  }
}
export function getOffsetRect(elem, relateToViewPort) {
  var box = elem.getBoundingClientRect();

  var body = document.body;
  var docElem = document.documentElement;

  var clientTop = docElem.clientTop || body.clientTop || 0;
  var clientLeft = docElem.clientLeft || body.clientLeft || 0;

  var top = box.top - clientTop;
  var left = box.left - clientLeft;
  if (!relateToViewPort) {
    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
    top += scrollTop;
    left += scrollLeft;
  }
  return { top: Math.round(top), left: Math.round(left), width: box.width, height: box.height};
}
export function getOffsetSum(elem, relateToViewPort) {
  var top = 0, left = 0, width = elem.offsetWidth, height = elem.offsetHeight;
  while (elem) {
    top = top + parseFloat(elem.offsetTop);
    left = left + parseFloat(elem.offsetLeft);
    if (elem.offsetChild) {
      top += parseFloat(getComputedStyle(elem.offsetChild).borderTopWidth);
      left += parseFloat(getComputedStyle(elem.offsetChild).borderLeftWidth);
    }
    elem.offsetParent && (elem.offsetParent.offsetChild = elem);
    elem = elem.offsetParent;
    if (!relateToViewPort) {
      var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
      var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
      top += scrollTop;
      left += scrollLeft;
    }
  }
  return {top: top, left: left, width: width, height: height};
}
window.requestIdleCallback = window.requestIdleCallback?window.requestIdleCallback:setTimeout;