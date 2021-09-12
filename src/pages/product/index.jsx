import React, { Component } from 'react'
import {Switch,Route} from 'react-router-dom'

import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'
import './product.less'

export default class Product extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/product' component={ProductHome}></Route>
        <Route exact path='/product/addupdate' component={ProductAddUpdate}></Route>
        <Route exact path='/product/detail' component={ProductDetail}></Route>
      </Switch>
    )
  }
}
