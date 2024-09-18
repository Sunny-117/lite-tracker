module.exports = {
  _body: null,
  get body() {
    return this._body
  },
  set body(val) {
    this.res.statusCode = 200 // 如果有设置 body 更改状态码为 200
    this._body = val
  }
}