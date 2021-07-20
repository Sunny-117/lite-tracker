var sendInp = document.getElementById('send-inp');
var sendBtn = document.getElementById('send-btn');
sendInp.onkeyup = function (e) {
    // 键盘的enter
    if (e.which == 13) {
        // 
        sendBtn.click();
    }
}
sendBtn.onclick = function () {
    var val = sendInp.value.trim();
    if (val) {
        renderDom('mine', val);
        sendInp.value = '';
        getData(val);
    }
}

// 发送请求函数
function getData(val) {
    ajax({
        url: 'http://localhost:3000/chat',
        // url: 'https://developer.duyiedu.com/edu/turing/chat',
        type: 'get',
        data: 'text=' + val,
        success: function (res) {
            renderDom('robot', res.text);// 返回的text渲染到页面
        }
    })
}


// 渲染内容区
function renderDom(className, text) {
    var oDiv = document.createElement('div');
    oDiv.className = 'clearfix ' + className;
    oDiv.innerHTML = `  <div class="avator"></div>
    <div class="text">${text}</div>`;
    var content = document.querySelector('.content');
    content.appendChild(oDiv);
    // console.log(content, content.scrollHeight);
    // scrollTo(0,offsetHeight):offsetHeight不变，一直是一个位置
    // 应该是里面内容区的最底部
    // content.scrollTo(0, content.scrollHeight)传递的是滚动条到达的坐标
    content.scrollTop = content.scrollHeight - content.clientHeight;
}

// clientHeight不包含边框  offsetHeight包含边框
// scrollHeight 表示的是在没有滚动条的时候 该区域如果被内容区撑开的高度
// window.innerHeight    元素身上没有
// 元素身上有offsetHeight,clientHeight
// 127.0.0.1  localhost   
// 127.0.0.1  aaaa