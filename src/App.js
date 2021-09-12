import React ,{Component} from 'react'
import { BrowserRouter,HashRouter,Route,Switch} from 'react-router-dom'
import Login from './pages/login'
import Admin from './pages/admin'
export default class App extends Component{
  

  render(){
    return(
      <HashRouter>
      {/* 会自动匹配其中一个路由，显示组件 */}
       <Switch>  
          <Route path="/login" component={Login}></Route>
          <Route path="/" component={Admin}></Route>
       </Switch>
        
        
      </HashRouter>
    )
  }

}
