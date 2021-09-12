import React, { Component } from 'react'
import {
  Card,
  Select,
  Input,
  Button,
  Icon,
  Table,
  message
} from 'antd'

import LinkButton from '../../components/link-button'
import {reqProducts, reqSearchProducts,reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'
import memoryUtils from '../../utils/memoryUtils'
const Option=Select.Option
/*Product的默认子路由组件 */
export default class ProductHome extends Component {
  state={
    products:[],//商品的数组
    total:0,//商品的总数量
    loading:false,//是否正在加载中
    searchName:"",//搜索的关键字
    searchType:'productName',//根据那个字段搜索 productName
  }
  /*初始化table的列的数组 */
  initColumns=()=>{
    this.columns=[
      {
        width:200,
        title:"商品名称",
        dataIndex:'name'
      },
      {
        title:"商品描述",
        dataIndex:'desc'
      },
      {
        width:100,
        title:"价格",
        dataIndex:"price",
        render:(price)=>'￥'+price //当前指定了对应的属性，传入的是对应的属性值
      },
      {
        width:100,
        title:"状态",
        render:(product=>{
          const {status,_id}=product
          //取反当前的status的值
          const newStatus=status===1 ? 2 : 1
          return(
            <span>
              <Button 
                type="primary"
                onClick={()=>{this.updateStatus(_id,newStatus)}}  
              >
                {

                 status===1 ? '下架':'上架'
                }
              </Button>
              <span>
                {
                 status===1 ? "在售":"已下架"
                }
              </span>
            </span>
          )
        })
      },
      {
        width:100,
        title:"操作",
        render:(product)=>{
          return(
            <span>
              {/* 将product作为state数据传递给路由组件*/}
              <LinkButton type="primary" onClick={()=>this.showDetail(product)}>详情</LinkButton>
              <LinkButton type="primary" onClick={()=>this.showUpdate(product)}>修改</LinkButton>
            </span>
          )
        }
      }
    ]//商品的数组
  }
 /*显示商品详情界面 */
  showDetail=(product)=>{
    //缓存product对象==>给detail组件使用
    memoryUtils.product=product
    console.log(memoryUtils.product)
    this.props.history.push('/product/detail')
  }
 /*显示修改商品界面 */
  showUpdate=(product)=>{
    //缓存product对象===>给detail组件使用
    memoryUtils.product=product
    this.props.history.push('/product/addupdate')
  }

  /*获取指定页码的列表数据显示 每传入一个页码就发起一次请求 */
  getProducts=async(pageNum)=>{
    this.pageNum=pageNum //保存当前的pageNum,让其他的方法可以看到
    //发送请求之前loading为true表示开始加载
    this.setState({loading:true})
    const {searchName,searchType}=this.state
    //如果搜索关键字有值，说明我们要做搜索分页
    let result
    if(searchName){
       result= await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
    }else{
       result=await reqProducts(pageNum,PAGE_SIZE)
    }
    this.setState({loading:false})//隐藏loading
    if(result.status===0){
     const {total,list}= result.data
     this.setState({
       total,
       products:list
     })
    }
  }
  /*更新指定商品的状态 */
  updateStatus=async(productId,status)=>{
   const result=await reqUpdateStatus(productId,status)
   if(result.status===0){
     message.success("更新商品成功")
     this.getProducts(this.pageNum)
   }
  }
  componentWillMount(){
    this.initColumns()
  }
  componentDidMount(){
    this.getProducts(1)
  }
  render() {
    //取出状态数据
    const {products,total,loading,searchType,searchName} =this.state
    const title = (
      <span>
          <Select 
            value={searchType}
            style={{width:150}} 
            onChange={value => this.setState({searchType:value})}
            >
            <Option value="productName">按名称搜索</Option>
            <Option value="productDesc">按描述搜索</Option>
          </Select>
          <Input  placeholder="关键字"
                  style={{width:150,margin:'0 15px'}} 
                  value={searchName}
                  onChange={event=>this.setState({searchName:event.target.value})}
                  />
          <Button type="primary" onClick={()=>{this.getProducts(1)}}>搜索</Button>
      </span>
    )

    const extra=(
      <Button type='primary'onClick={()=>this.props.history.push('/product/addupdate')}>
        <Icon type="plus" ></Icon>
        添加商品
      </Button>
    )
    return (
     <Card title={title} extra={extra}>
      <Table 
       bordered
       dataSource={products} 
       columns={this.columns} 
       rowKey='_id'
      //  这里分页传入的属性有total和PAGE_SIZE，两个属性来确定分页的页数
       pagination={{
         total,
         defaultPageSize:PAGE_SIZE,
         showQuickJUmper:true,
         onChange:this.getProducts
        }}
        loading={loading}
       />;
     </Card>
    )
  }
}
