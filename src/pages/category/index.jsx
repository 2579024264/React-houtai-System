import React, { Component } from 'react'
import { Card, Table, Button, Icon, message, Modal } from 'antd'

import LinkButton from '../../components/link-button'
import { reqCategorys, addCategorys, updateCategorys } from '../../api'

import AddForm from './AddForm/add-form'
import UpdateForm from './AddForm/update-form'
export default class Categroy extends Component {
  state = {
    loading: false,//判断是否发送请求
    categorys: [],//一级分类列表
    subCategorys: [],//二级分类列表
    parentId: '0',//当前需要显示的分类列表的parentId父分类id
    parentName: "",//当前需要显示的分类列表的父分类名称
    showStatus: 0,//标识添加更新的确认框是否显示，0：都不显示，1：显示添加，2:显示更新
  }
  //获取表格属性
  initColumns = () => {
    this.columns = [
      {
        title: '分类的名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        width: 300,
        //这里的参数值是每一行对应的数据对象
        render: (category) => (  //返回需要显示的界面标签
          //这里需要一个根组件将多个标签进行包裹
          <span>
            <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>

            {/* 如何向事件回调函数传递参数：先定义一个匿名函数，在函数调用处理的函数并传入数据 */}
            {this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}

          </span>
        )
      },
    ];
  }
  /*异步获取一级分类列表显示
   parentId:如果没有指定根据状态中的parentId请求，如果指定了根据指定的请求，就用指定的parentId
   这样做的好处就是修改categorys中的数据，但是不改变状态中的parentId,这样在访问数据的时候就不会因为状态的改变调用render函数
   */
  getCategory = async (parentId_p) => {
    //在请求前，显示loading
    this.setState({ loading: true })
    //在默认情况下使用parentId：0
    const parentId = parentId_p || this.state.parentId
    const result = await reqCategorys(parentId)
    //在请求完成后，移除loading
    this.setState({ loading: false })
    if (result.status === 0) {
      const categorys = result.data
      //初始化一级列表的时候parentId:0
      if (parentId === '0') {
        //更新一级分类状态
        this.setState({ categorys })
      } else {
        //二级列表跟一级列表使用的是同一个请求函数，如果parentId!==0,表明获取的是二级列表
        this.setState({ subCategorys: categorys })
      }

    } else {
      message.error("获取分类列表数据失败")
    }
  }
  //显示指定一级分类对象的子列表
  showSubCategorys = (category) => {
    console.log(category);
    //但问题是setState是一个异步行为，所以要把getCategory这个方法用在回调函数中
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => {  //在状态更新且重新render()后执行
      this.getCategory()
    })

  }
  //显示一级分类列表(从二级列表返回时显示)
  showCategory = () => {
    //更新为一级列表的状态
    this.setState({
      parentId: "0",
      parentName: "",
      subCategorys: []
    }, () => {
      this.getCategory()
    })
  }
  //点击对话框的取消按钮时,隐藏对话框
  handleCancel = () => {
    this.setState({ showStatus: 0 })
  }
  /*显示添加对话框*/
  showAdd = () => {
    this.setState({ showStatus: 1 })
  }
  /*添加分类 */
  addCategory =  () => {
    this.form.validateFields(async(err, values) => {
      if (!err) {
        //隐藏确认框
        this.setState({
          showStatus: 0
        })

        //收集数据，并提交添加分类的请求
        const { parentId, categoryName } = values
        //清除输入数据
        this.form.resetFields()

        const result = await addCategorys(parentId, categoryName)
        if (result.status === 0) {
          //添加的分类就是当前分类列表的分类
          if (parentId === this.state.parentId) {
            //重新获取分类列表显示
            this.getCategory()
          } else if (parentId === '0') { //在二级分类列表下添加一级分类，重新获取一级分类列表，但不需要显示一级列表
            this.getCategory('0')

          }

        }
      }
    })

  }


  /*显示更新对话框 */
  showUpdate = (category) => {
    //保存分类对象
    this.category = category;
    //更新状态
    this.setState({ showStatus: 2 })
  }
  /*更新分类 */
  updateCategory = () => {
    //进行表单验证，只有通过了才处理
    this.form.validateFields(async (err, values) => {
      //验证通过时，err的值是false
      if (!err) {
        //1.隐藏确定框
        this.setState({
          showStatus: 0
        })
        //准备数据
        const categoryId = this.category._id
        //这里的this.form是子组件传递过来的值
        const { categoryName } = values
        //重置所有的表单项
        this.form.resetFields()
        //2.发请求更新分类
        const result = await updateCategorys(categoryId, categoryName)
        if (result.status === 0) {
          //3.重新显示列表
          this.getCategory()
        }
      }
    })


  }
  /*为第一次render()准备数据 */
  componentWillMount() {
    this.initColumns()
  }
  //发异步ajax请求
  componentDidMount() {
    this.getCategory()
  }
  render() {
    const { categorys, loading, subCategorys, parentId, parentName, showStatus } = this.state
    //读取指定的分类
    const category = this.category || {}
    //card的左侧
    const title = parentId === '0' ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.showCategory}>一级分类列表</LinkButton>
        <Icon type="arrow-right" style={{ marginRight: 10 }} />
        <span>{parentName}</span>
      </span>)
    //card的右侧
    const extra = (
      <Button type="primary" onClick={this.showAdd}>
        <Icon type="plus"/>
        添加
      </Button>
    )
    return (
      //分别来显示card的左右两边
      <Card title={title} extra={extra} >

        <Table
          bordered
          loading={loading}
          dataSource={parentId === '0' ? categorys : subCategorys}
          columns={this.columns}
          rowKey="_id"
          pagination={{ defaultPageSize: 5, showQuickJumper: true }}
        />;
        <Modal title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}>
          <AddForm categorys={categorys} parentId={parentId} setForm={(form) => { this.form = form }} />
        </Modal>
        <Modal title="修改分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}>
          {/* 这里需要将子组件中的数据传递给父组件，传递的方法就是使用props， */}
          {/* 父组件中的传递的参数是一个函数，子组件中调用，从而将子组件中的数据传递给父组件 */}
          <UpdateForm categoryName={category.name} setForm={(form) => { this.form = form }} />
        </Modal>
      </Card>

    )
  }
}
