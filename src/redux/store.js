/*
  redux最核心的管理对象store
*/
import {createStore,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
/*引入redux调试工具插件 */
import {composeWithDevTools} from 'redux-devtools-extension'

import reducer from './reducer'

//向外暴露store
export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))