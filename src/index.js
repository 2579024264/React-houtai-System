import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'

import store from './redux/store'
import App from './App';

ReactDOM.render((
  //通过Provider的方式将一些内容传给下面的子组件
  <Provider store={store}>
    <App/>
  </Provider>
  ),
  document.getElementById('root')
);

