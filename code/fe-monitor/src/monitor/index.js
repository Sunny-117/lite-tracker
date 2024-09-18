import { blankScreen } from './lib/blankScreen';
import { injectJsError } from './lib/jsError';
import { injectXHR } from './lib/xhr';
injectJsError();
injectXHR()
blankScreen() // 因为这段代码是插入到head里面，所以白屏会一直上报，所以可以放到onload.js里面
