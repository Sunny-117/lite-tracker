export default function getEventPath(event) {
    // return event.path || (event.composedPath && event.composedPath()) // path为非标准属性，chrome在新版本中将其删除了
    // promiseError中的event连composedPath()也获取不到，下面是兼容写法
    if (event.path) {
        console.log(111)
        return event.path;
    } else if (event.composedPath) {
        const p = event.composedPath()
        console.log(p, 'composedPath')
        if (p.length > 0) return p
    }
    let target = event.target;
    console.log(333)
    event.path = [];
    // target.parentNode 获取父元素的 dom 节点
    while (target.parentNode !== null) {
        event.path.push(target);
        target = target.parentNode;
    }
    event.path.push(document, window);
    // console.log(event.path)
    return event.path;
}