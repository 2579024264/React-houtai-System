import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Input,
} from 'antd'
const Item=Form.Item
const Option=Select.Option
/*添加分类的form组件 */
 class AddForm extends Component {
   static propTypes={
     setForm:PropTypes.func.isRequired,//用来传递form对象的函数
     categorys:PropTypes.array.isRequired,
     parentId:PropTypes.string.isRequired
   }
   componentWillMount(){
    
     //将表单信息传递给父组件
     this.props.setForm(this.props.form)
   }
  render() {
    const {getFieldDecorator} =this.props.form
    const {categorys,parentId}=this.props
    return (
      <Form>
        <Item>
          {
            getFieldDecorator('parentId',{
              // 这里表示该表单项选中的默认值
              initialValue:parentId,

            })(
              <Select>
              <Option value='0'>一级分类</Option>
              {/* 遍历一级列表 */}
          {
              categorys.map(c=><Option value={c._id} key={c._id}>{c.name}</Option>)
          }
            </Select>
            )
          }
         
        </Item>
        <Item>
          {
            getFieldDecorator('categoryName',{
              initialValue:"",
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
