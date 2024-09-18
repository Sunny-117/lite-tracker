const DEV_URL = 'http://localhost:3000'
const MOCK_URL = '' // mock数据获取地址
const PRO_URL = '/'
const BASE_URL = process.env.NODE_ENV === 'development' ? DEV_URL : PRO_URL;
export default BASE_URL
