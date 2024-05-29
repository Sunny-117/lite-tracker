console.log('hello')
import monitor from 'lite-tracker'

window.onload = function () {
    monitor.init({});
    monitor.pageStayTime();
    monitor.pageChange();

    const jsError = document.getElementById('jsError');
    const promiseError = document.getElementById('promiseError');
    const resourceError = document.getElementById('resourceError');
    const img1 = document.getElementById('img1');

    resourceError.addEventListener('click', function () {
        img1.setAttribute('src', '../assets/logo1.png')
    })

    promiseError.addEventListener('click', function () {
        Promise.reject(Error('promise error'));
    })

    jsError.addEventListener('click', function jsErrorFn() {
        let str = null;
        console.log(str.length);
    })
}
