import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
} from 'antd'
const Item=Form.Item
 class AddForm extends Component {
   //指定传递参数的数据类型
  static propTypes={
    catgoryName:PropTypes.string.isRequired,
    setForm:PropTypes.func.isRequired
  }
  componentWillMount(){
    //将form对象通过setForm()传递父组件
    this.props.setForm(this.props.form)
  }
  render() {
    const {categoryName} =this.props
    const {getFieldDecorator} =this.props.form
    return (
      <Form>
        <Item>
          {
            //这里是有关表单的配置
            getFieldDecorator('categoryName',{
              initialValue:categoryName,
              rules:[
                {required:true,message:"分类名称必须输入"}
              ]
            })(
              <Input placeholder="请输入分类名称"></Input>
            )
          }
        </Item>
      </Form>
    )
  }
}
export default Form.create()(AddForm)
