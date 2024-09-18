let lastEvent

['click', 'touchstart', 'mousedown', 'keydown', 'mouseover'].forEach(eventType => {
    document.addEventListener(eventType, (event) => {
        lastEvent = event;
    }, {
        capture: true, // 捕获阶段执行
        passive: true, // 默认不阻止默认事件，即不等该监听函数执行完 是一种优化行为
    })
})

export default function() {
    return lastEvent;
}