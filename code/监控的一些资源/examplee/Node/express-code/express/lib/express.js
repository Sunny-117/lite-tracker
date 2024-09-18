
const Application = require('./application');

function createApplication() {
    return new Application();
}

// 提供一个Router类 这个类可以new 也可以当做函数来执行
createApplication.Router = require('./router');
module.exports = createApplication;