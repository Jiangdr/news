/**
 * Created by px on 2017/5/4.
 */
/**
 *获取节点
 */
var navNode = {//导航栏节点
    user: document.getElementById("user"),
    nav: document.getElementById("nav"),
    menu: document.getElementById("menu"),
    rightMenu: document.getElementById("rightMenu"),
    content: document.getElementById("contContainer")
}
var userNode = {//用户信息界面节点
    userBox : document.getElementById("userBox"),
    userIntro : document.getElementById("userIntro"),
    mask : document.getElementById("mask"),
    newsCont : document.getElementById("newsCont")//新闻内容顶层节点
}
var dataObj ;
var moveStatus = false;//左侧界面状态
var imgStatus = false;//图片状态

/**
 * 页面打开时加载内容
 */
window.onload = function () {
    var getMain = getData();//请求主页数据
    getMain.getJson("data/data", function (obj) {
        dataObj = obj;
        secondRequest();
    })
}
function secondRequest() {
    var json = new getData();//二次请求导航栏数据
    json.getJson("data/nav", function (obj) {
        //个人主页
        var uA = document.createElement("a");
        var uI = document.createElement("i");
        uI.style.backgroundImage = "url(img/" + obj.nav.user.userPicture + ")";
        uA.appendChild(uI);
        navNode.user.appendChild(uA);
        userNode.userBox.scrollLeft = parseInt(getStyle(userNode.userIntro, "width"));//隐藏用户信息界面
        showUserIntro(obj.nav.user);//加载用户界面内容
        navNode.user.addEventListener("click", function () {//点击显示用户信息
            userIntroMove(1, false);
        })
        //频道菜单
        var nA = document.createElement("a");
        var nI = document.createElement("i");
        nA.appendChild(nI);
        navNode.menu.appendChild(nA);
        //右面频道菜单
        var nDiv = document.createElement("div");
        nDiv.classList.add("clearFix");
        nDiv.innerHTML = `
            <a href="javaScript:;" class="fl">
	            <i class="fa fa-angle-left fa-1-2x"></i>
            </a>
            <span>频道管理</span>
            <a href="javaScript:;" class="fr">
                <i class="fa fa-search"></i>
            </a>
        `
        var topDl = document.createElement("dl");
        var botDl = document.createElement("dl");
        topDl.classList.add("clearFix");
        botDl.classList.add("clearFix");
        navNode.rightMenu.appendChild(nDiv);
        navNode.rightMenu.appendChild(topDl);
        navNode.rightMenu.appendChild(botDl);
        var topDt =document.createElement("dt");
        var botDt =document.createElement("dt");
        topDt.innerHTML = "我的频道（拖动调整顺序）";
        botDt.innerHTML = "热门频道（点击添加更多）";
        topDl.appendChild(topDt);
        botDl.appendChild(botDt);
        rightMenuAdd(topDl, botDl, obj.nav.navMenu);
        nDiv.children[0].addEventListener("click", function () {//隐藏按钮
            navNode.rightMenu.classList.remove("leftMove");
            addNav();
        })
        nA.addEventListener("click", function () {//显示按钮
            navNode.rightMenu.classList.add("leftMove");
        })
        //导航栏
        addNav();
    })
}
/**
 * 功能：屏幕触摸事件
 */
function touch() {
    document.addEventListener("touchstart", touchType, false);
    document.addEventListener("touchmove", touchType, false);
    document.addEventListener("touchend", touchType, false);
    function touchType() {
        var event = event || window.event;
    }
}
/**
 * 功能：点击弹出新闻内容
 * 参数1：新闻分类
 * 参数2：新闻列表下标
 */
function newsAdd(type, liIdx) {
    userNode.newsCont.style.left = "0";
    if (liIdx > 1){
        userNode.newsCont.innerHTML = `没有内容，别点了`;
        return;
    }
    var getNews = getData();//请求新闻数据
    getNews.getJson("data/" + type, function (data) {
        if (type == "picture"){
            userNode.newsCont.innerHTML = `
            <div class="newsHead">
                <a href="JavaScript:;" id="imgBack"><img src="img/svg/left.svg" alt=""></a>
                <a href="JavaScript:;">纯净版</a>
                <a href="JavaScript:;"><img src="img/svg/file.svg" alt="">更多图片</a>
                <a href="JavaScript:;"><img src="img/svg/praise.svg" alt="">赞</a>
                <a href="JavaScript:;"><img src="img/svg/share.svg" alt=""></a>
                <a href="JavaScript:;"><img src="img/svg/list.svg" alt=""></a>
            </div>
            <div class="newsMain">
                <h4>${data[liIdx].title}</h4>
                <p>${data[liIdx].content}</p>
                <p>
                    <span id="imgFlag">1</span>
                    <span>/</span>
                    <span>${data[liIdx].img.length}</span>
                </p>
                <p class="clearFix">
                    <input type="text" class="fl" placeholder="我要说...">
                    <a href="JavaScript:;" class="fl">评论<img src="img/svg/message.svg" alt=""></a>
                </p>
            </div>
            <div class="figBox">
                <figure class="newsFig"></figure>
            </div>
        `
            var imgBack = document.getElementById("imgBack");
            imgBack.addEventListener("click", function () {
                userNode.newsCont.style.left = "";
            })
            var imgWei = parseInt(getStyle(userNode.newsCont, "width"));
            var figTop = parseInt(getStyle(userNode.newsCont.children[2], "height"));
            var arr = [];//图片移动范围
            for (var i = 0; i < data[liIdx].img.length; i++){
                var img = document.createElement("img");
                img.setAttribute("src", "img/menu1/" + data[liIdx].img[i]);
                userNode.newsCont.children[2].children[0].appendChild(img);
                img.style.width = imgWei + "px";
                img.style.left = imgWei * i + "px";
                arr[i] = imgWei * (i + 1);
            }
            userNode.newsCont.children[2].children[0].style.width = imgWei * data[liIdx].img.length + "px" ;
            // userNode.newsCont.children[2].children[0].style.marginTop = parseInt(getStyle(userNode.newsCont, "height")) * 0.5 - parseInt(getStyle(userNode.newsCont.children[2].children[0], "height")) * 0.5 + "px";
        }
        var imgFlag = document.getElementById("imgFlag");
        userNode.newsCont.children[2].children[0].addEventListener("touchend", function () {//图片滑动效果
            var scrL = userNode.newsCont.children[2].scrollLeft;
            for (var s of arr){
                if (s < scrL){
                    continue;
                }
                if (scrL > s - imgWei && scrL <= s - imgWei / 2){
                    imgScroll(1, scrL - s + imgWei, s - imgWei, false, function (pageF) {
                        imgFlag.innerHTML = Math.floor(pageF / imgWei) + 1;
                    });
                    break;
                }else if (scrL > s - imgWei / 2 && scrL < s){
                    imgScroll(-1, s - scrL, false, s, function (pageF) {
                        imgFlag.innerHTML = Math.floor(pageF / imgWei) + 1;
                    });
                    break;
                }
            }
        })
    })
}
/**
 * 功能：图片滑动效果
 * 参数1：=1为右移，= -1为左移
 * 参数2：位移距离
 * 参数3：右移停止位
 * 参数4：左移停止位
 */
var imgTime = null;
function imgScroll(flag, s, stopR, stopL, callback) {
    clearInterval(imgTime)
    var duration = 400;
    var interval = 15;
    var speed = s / duration * interval;
    imgTime = setInterval(function () {
        userNode.newsCont.children[2].scrollLeft -= speed * flag;
        if (userNode.newsCont.children[2].scrollLeft <= stopR && flag == 1){
            userNode.newsCont.children[2].scrollLeft = stopR;
            clearInterval(imgTime);
            callback(userNode.newsCont.children[2].scrollLeft);
        }else if (userNode.newsCont.children[2].scrollLeft >= stopL && flag == -1){
            userNode.newsCont.children[2].scrollLeft = stopL;
            clearInterval(imgTime);
            callback(userNode.newsCont.children[2].scrollLeft);
        }
    },interval);
}
/**
 * 功能：导航栏滚动显示不同样式
 */
navNode.nav.onscroll = function () {
    var s = parseInt(getStyle(navNode.nav.children[0], "width")) - parseInt(getStyle(navNode.nav, "width"));
    var item = navNode.nav.scrollLeft;
    if (s <= 0){
        navNode.nav.classList.remove("aft");
        return;
    }
    if (item == 0){
        navNode.nav.classList.remove("bef");
        navNode.nav.classList.add("aft");
    }else if (item < s){
        navNode.nav.classList.add("bef", "aft");
    }else {
        navNode.nav.classList.remove("aft");
    }
}
/**
 * 功能：左边用户信息界面加载内容
 */
function showUserIntro(intro) {
    userNode.userIntro.innerHTML = `
        <div>
            <a href="JavaScript:;">
                <img src="img/${intro.userPicture}" alt="">
            </a>    
            <span>${intro.id}</span>
        </div>
        <div>
            <ul>
                <li><a href="JavaScript:;"><figure></figure>评论</a></li>
                <li><a href="JavaScript:;"><figure></figure>收藏</a></li>
                <li><a href="JavaScript:;"><figure></figure>消息</a></li>
                <li><a href="JavaScript:;"><figure></figure>设置</a></li>
            </ul>
        </div>
        <div><a href="JavaScript:;"><figure></figure>吐个槽</a></div>
    `
    userNode.userBox.children[1].addEventListener("click", function () {//隐藏左侧界面
        if (event.target == this && !moveStatus){
            userIntroMove(-1, false);
        }
    })
    userNode.userBox.children[1].addEventListener("touchend", function () {//左侧界面还原
        if (event.target == this && !moveStatus){
            return;
        }
        var s = parseInt(getStyle(userNode.userIntro, "width"));
        var scrLeft = userNode.userBox.scrollLeft;
        if (scrLeft >= s * 0.5 && scrLeft < s){
            userIntroMove(-1, scrLeft);
        }else if (scrLeft < s * 0.5 && scrLeft >0){
            userIntroMove(1, scrLeft);
        }
    })
}
/**
 * 功能：用户信息界面滚动条监听事件
 */
userNode.userBox.onscroll = function () {
    userNode.userBox.style.left = "0";
    userNode.mask.style.display = "block";
    var s = parseInt(getStyle(userNode.userIntro, "width"));
    var scrLeft = userNode.userBox.scrollLeft;
    if (scrLeft == s) {
        userNode.mask.style.display = "";
        userNode.userBox.style.left = "";
    }
    userNode.mask.style.opacity = (1 - scrLeft / s) * 0.5 + 0.2;
}
/**
 * 功能：左侧用户界面滑动事件
 * 参数1：=1为右移，= -1为左移
 * 参数2：当前位置
 */
function userIntroMove(flag, s) {
    moveStatus = true;
    var maxS = parseInt(getStyle(userNode.userIntro, "width"));
    s = s ? s : maxS;
    var duration = 400;
    var interval = 15;
    var speed = s / duration * interval;
    var interTime = setInterval(function () {
        userNode.userBox.scrollLeft -= speed * flag;
        if (userNode.userBox.scrollLeft <= 0 && flag == 1){
            userNode.userBox.scrollLeft = 0;
            clearInterval(interTime);
            moveStatus = false;
        }else if (userNode.userBox.scrollLeft >= maxS && flag == -1){
            userNode.userBox.scrollLeft = maxS;
            clearInterval(interTime);
            moveStatus = false;
        }
    },interval);
}
/**
 * 功能：加载导航栏
 */
function addNav() {
    navNode.nav.innerHTML = "";
    var ul = document.createElement("ul");
    ul.setAttribute("id", "navUl");
    ul.classList.add("clearFix");
    navNode.nav.appendChild(ul);
    var ddArr = Array.prototype.slice.call(navNode.rightMenu.children[1].children);
    ddArr.shift();
    var ulWidth = 0;
    var liWidth = window.screen.width;
    liWidth = (liWidth - 80) * 0.2 + "px";
    for (var i in ddArr){
        ulWidth += parseFloat(liWidth);
        var idx = i;
        var li = document.createElement("li");
        li.style.width = liWidth;
        li.classList.add("fl");
        ul.appendChild(li);
        li.index = ddArr[idx].index;
        li.innerHTML = `
            <a href="JavaScript:;">${ddArr[idx].children[0].childNodes[0].nodeValue.trim()}</a>
        `
    }
    ul.onclick = function () {
        if (!event.target.nodeName){
            addMain(false);
            ul.children[0].classList.add("checked");
        }else if (!event.target.parentNode.index){
            ul.firstElementChild.classList.add("checked");
            addMain(ul.firstElementChild.index);
        }else {
            for (var i = 0; i < ul.children.length; i++){
                if (ul.children[i].classList.contains("checked")){
                    ul.children[i].classList.remove("checked");
                    break;
                }
            }
            event.target.parentNode.classList.add("checked");
            addMain(event.target.parentNode.index);
        }
    }
    ul.onclick();
    ul.style.width = ulWidth + "px";
    navNode.nav.onscroll();
}
/**
 * 功能：加载主页新闻内容
 */
function addMain(i) {
    i = i ? i : "0";
    navNode.content.innerHTML = "";
    for (var idx in dataObj[Object.keys(dataObj)[i]]){
        var obj = dataObj[Object.keys(dataObj)[i]][idx];
        var li = document.createElement("li");
        var imgBox = document.createElement("div");
        var flag = 0;
        // li.style.height = (scrHei - 40) *
        imgBox.classList.add("imgBox");
        for (var n in obj.img){
            flag += 1;
            var img = document.createElement("img");
            img.setAttribute("src", obj.img[n]);
            imgBox.appendChild(img);
        }
        navNode.content.appendChild(li);
        // (function (liIdx) {
        //     li.addEventListener("click", function () {
        //         newsAdd(i, liIdx);
        //     })
        // })(idx);

        li.index = idx;
        li.addEventListener("click", function () {
            newsAdd(Object.keys(dataObj)[i], this.index);
        })
        li.innerHTML = `
            <h4>${obj.title}</h4>
            <div class="clearFix">
                <span class="fl">${obj.author}</span>
                <i class="fa fa-close fr"></i>
                <span class="fr">${obj.hot}</span>
            </div>
        `
        if (flag == 1){
            li.classList.add("styleOne", "clearFix");
            imgBox.classList.add("imgBox", "fl");
            li.children[0].classList.add("fl")
        }else {
            li.classList.add("styleTwo", "clearFix");
        }
        li.insertBefore(imgBox, li.children[1]);
    }
}
/**
 *获取JSON的AJAX请求
 *参数1：请求的URL
 * 参数2：回调处理函数
 */
function getData() {
    function getJson(url, callback) {
        var xhr = new XMLHttpRequest();
        url += ".json";
        xhr.open("GET", url, true);
        xhr.send(null);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200){
                var jsonStr = xhr.responseText;
                var jsObj = JSON.parse(jsonStr);
                callback(jsObj);
            }
        }
    }
    return {
        getJson: getJson
    }
}
/**
 * 功能：右面菜单加载内容
 * 参数1：顶部dl
 * 参数2：底部dl
 * 参数3：频道菜单数据
 */
function rightMenuAdd(add, reduce, Arr) {
    for (var idx in Arr){
        if (idx < 9){
            var dd = document.createElement("dd");
            dd.classList.add("fl");
            dd.index = idx;
            dd.innerHTML = `
                <a href="JavaScript:;">${Arr[idx]}
	                <i class="">-</i>
                </a>
            `;
            add.appendChild(dd);
            var btnStatus = true;
            dd.addEventListener("click", function () {
                if (btnStatus && add.children.length > 2){
                    topChange(this);
                    btnStatus = false;
                }
            })
            function topChange(old) {
                ddMove(old, reduce);
                var timeout = setTimeout(function () {
                    old.remove();
                    var dd = document.createElement("dd");
                    dd.classList.add("fl");
                    dd.index = old.index;
                    dd.innerHTML = `
                <a href="JavaScript:;">${old.children[0].childNodes[0].nodeValue.trim()}
	                <i class="">+</i>
                </a>
            `;
                    reduce.appendChild(dd);
                    dd.addEventListener("click", function () {
                        if (btnStatus){
                            botChange(this);
                            btnStatus = false;
                        }
                    })
                    btnStatus = true;
                },600)
            }
        }
    }
    for (var idx in Arr){
        if (idx > 8){
            var dd = document.createElement("dd");
            dd.classList.add("fl");
            dd.index = idx;
            dd.innerHTML = `
                <a href="JavaScript:;">${Arr[idx]}
	                <i class="">+</i>
                </a>
            `;
            reduce.appendChild(dd);
            dd.addEventListener("click", function () {
                if (btnStatus){
                    botChange(this);
                    btnStatus = false;
                }
            })
            function botChange(old) {
                ddMove(old, add);
                var timeout = setTimeout(function () {
                    old.remove();
                    var dd = document.createElement("dd");
                    dd.classList.add("fl");
                    dd.index = old.index;
                    dd.innerHTML = `
                <a href="JavaScript:;">${old.children[0].childNodes[0].nodeValue.trim()}
	                <i class="">-</i>
                </a>
            `;
                    add.appendChild(dd);
                    dd.addEventListener("click", function () {
                        if (btnStatus){
                            topChange(this);
                            btnStatus = false;
                        }
                    })
                    btnStatus = true;
                },600)
            }
        }
    }
}
/**
 * 功能：dd标签移动
 * 参数1：dd标签
 * 参数2：结束位置容器
 */
function ddMove(dd, reduce) {
    var start = {
        x: dd.offsetLeft,
        y: dd.offsetTop
    }
    dd.style.position = "absolute";
    var end = {
        x: reduce.lastElementChild.offsetLeft,
        y: reduce.lastElementChild.offsetTop
    }
    dd.style.left = start.x + "px";
    dd.style.top = start.y + "px";
    var width = parseInt(getStyle(dd, "width"));
    end.x = end.x + width;
    if (end.x > width * 2.5){
        end.x = 0;
        end.y = end.y + parseInt(getStyle(dd, "height"));
    }
    dd.style.left = end.x + "px";
    dd.style.top = end.y + "px";
}























