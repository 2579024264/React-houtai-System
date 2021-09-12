import React, { PureComponent ,Component} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Tree
} from 'antd'

import menuList from '../../config/menuConfig'
const Item =Form.Item

export default class AuthForm extends PureComponent {
  static propTypes={
    role:PropTypes.object.isRequired,
  }
  state={
    menus:[]
  }
  //选中某个node时的回调
  onCheck = (checkedKeys) => {
    this.setState({menus:checkedKeys})
    this.checkedKeys=[...checkedKeys]
  }
  //返回选中的权限
  getCheckedKeys=()=>{
    return this.checkedKeys
  }
  componentDidMount(){
    //默认状态是选中用户的所有权限
    this.setState({
      menus:this.props.role.menus
    })
  }
  //当用户传入的参数发生变化的时候，这里使用该生命周期的作用是，当外部修改选中的用户时
  componentWillReceiveProps(nextProps) {
     this.setState({
       menus:nextProps.role.menus
     })
 }
  render() {
    const {role}=this.props
    const {menus} =this.state
    const formItemLayout={
      labelCol:{span:4}, 
      wrapperCol:{span:17},
    }
    return (
      <div>
        <Item label='角色名称'  {...formItemLayout}>
          <Input value={role.name}/>
        </Item>
        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={menus}
          onCheck={this.onCheck}
          treeData={menuList}
      />
      </div>
    )
  }

}
