import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input
} from 'antd'

const Item =Form.Item

 class AddForm extends Component {
  componentWillMount(){
    this.props.setForm(this.props.form)
  }
  static propTypes={
    setForm:PropTypes.func.isRequired
  }
  render() {
    const formItemLayout={
      labelCol:{span:4}, 
      wrapperCol:{span:17},
    }
    const {getFieldDecorator}=this.props.form
    return (
     
      <Form {...formItemLayout}>
        <Item label='角色名称'>
          {
            getFieldDecorator('roleName',{
              initivalValue:"",
              rules:[
                {required:true,message:"分类名称必须输入"}
              ]
            })(
              <Input placeholder="请输入角色名称"/>
            )
          }
        </Item>
      </Form>
    )
  }
}
export default Form.create()(AddForm)
