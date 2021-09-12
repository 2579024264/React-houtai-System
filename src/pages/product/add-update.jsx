import React, { Component } from 'react'
import {
  Card,
  Form,
  Input,
  Cascader,
  Button,
  Icon,
  message
} from 'antd'
import LinkButton from '../../components/link-button'
import {reqCategorys,reqAddOrUpdateProduct} from '../../api'
import memoryUtils from '../../utils/memoryUtils'

import PicturesWall from './picture-wall'
import RichTextEditor from './rich-text-editor'
const {Item}=Form
const {TextArea}=Input
/*Product的添加和更新的子路由组件*/
class ProductAddUpdate extends Component {
  /*React.createRef调用后可以返回一个容器，该容器可以存储被ref所标识的节点 */
  myRef=React.createRef()
  editor=React.createRef()
  state={
   options:[]
  }
 

  initOptions=async(categorys)=>{
    //根据categorys生成options数组,这里生成的是一级列表的options
     const options= categorys.map(c=>({
        value:c._id,
        label:c.name,
        isLeaf:false,//不是

      }))
    //如果是修改的情况，二级列表数据需要加载出来，这样才能实现匹配
    const {isUpdate,product}=this
    const {pCategoryId}=product
    if(isUpdate&&pCategoryId!=='0'){
      //获取对应的二级分类列表
     const subCategorys=await this.getCategorys(pCategoryId)
     //生成二级下拉列表的options
     const childOptions=subCategorys.map(c=>({
       value:c._id,
       label:c.name,
       isLeaf:true
     }))
     //找到当前商品对应的一级option对象
     const targetOption=options.find(option=>option.value===pCategoryId)
     //关联到对应的一级option上
     targetOption.children=childOptions
    }
    //更新options状态,这里的options可能是一个数组，也可能是一个元素对象(带有children属性)
    this.setState({
      options
    })
  }

  /*异步获取一级/二级分类列表，并显示 
    async函数返回的是一个promise数据对象，promise对象的值取决于return的值
  */
  getCategorys=async(parentId)=>{
    const result=await reqCategorys(parentId) 
    if(result.status===0){
      const categorys=result.data
      //如果是一级分类列表
      if(parentId==='0'){
        //初始化数据  这里获取到的是所有的一级列表
        this.initOptions(categorys)
      }else{  //是所有父级id相同的二级列表元素
        return categorys //返回二级列表===>当前async函数返回的promise就会成功且value为categorys
      }
    }
  }

  /*验证价格的自定义函数 */
  validatePrice=(rule,value,callback)=>{
    //下面这个判断既判断了它是否是数值类型，有判断了它是否是正数
    if(value*1 > 0){
      callback()//验证通过
    }else{
      callback("价格必须大于0") //验证没通过
    }
  }

  /*表单提交 */
  submit=()=>{
      //进行表单验证，如果通过了，才发送请求
      this.props.form.validateFields(async(err,values)=>{
        if(!err){
          //1.收集数据,并封装成product对象
          const {name,desc,price,categoryIds}=values
          let pCategoryId, categoryId
          if(categoryIds.length===1){
            pCategoryId='0'
            categoryId=categoryIds[0]
          }else{
            pCategoryId=categoryIds[0]
            categoryId=categoryIds[1]
          }
            //这里的this.myRef.current代表myRef容器中的组件对象，然后调用该组件中的方法getImgs()
            const imgs=this.myRef.current.getImgs()
            const detail=this.editor.current.getDetail()
          const product={name,desc,price,imgs,detail,pCategoryId,categoryId}
          //如果是更新，需要添加_id
          if(this.isUPdate){
            product._id=this.product._id
          }
          //2.调用接口请求函数去添加/更新
          const result=await reqAddOrUpdateProduct(product)
          //3.根据结果提示
          if(result.status===0){
            message.success(`${this.isUpdate ? '更新':'添加'}商品成功`)
            this.props.history.goBack()
          }else{
            message.error(`${this.isUpdate ? '更新':'添加'}商品失败`)
          }
        
        }
      })
  }

  loadData = async selectedOptions => {
      //得到选择的options对象
    const targetOption = selectedOptions[0]
    //显示loading
    targetOption.loading = true

    //根据选中的分类，请求获取二级分类列表,因为getCategorys的返回值是一个promise对象，所以await返回的的是promise的值
     const subCategory= await this.getCategorys(targetOption.value)
     //隐藏loading
     targetOption.loading=false
    if(subCategory && subCategory.length>0){  //如果存在二级列表
     const childOptions= subCategory.map(c=>({
          value:c._id,
          label:c.name,
          isLeaf:true,
        })
      )
      //关联到当前的options上
      targetOption.children=childOptions
    }else{  //当前选中的分类没有二级分类
        targetOption.isLeaf=true
    }
    //更新options的数据，重新渲染级联选择器
    this.setState({
      options:[...this.state.options]
    })
   
  };
  
  componentDidMount(){
    this.getCategorys('0')
  }
  componentWillMount(){
    //取出携带的state
    let product=memoryUtils.product // 如果是添加没值，否则有值
    //保存是否是更新的标识，这里的!!product得到的是一个布尔值
    this.isUpdate=!!product._id
    //保存商品(如果没有，保存值是对象)
    this.product=product || {}
  }
   /*
    在卸载之前清除保存的数据
 */
 componentWillUnmount () {
  memoryUtils.product = {}
}
  render() {
    const {isUpdate,product} =this
    const {pCategoryId,categoryId,imgs,detail}=product
    //用来接收级联分类ID的数组
    const categoryIds=[]
    if(isUpdate){
      //商品是一个一级分类的商品，只保存该商品的id值
      if(pCategoryId === '0'){
        categoryIds.push(categoryId)
      }else{
        // 如果商品是一个二阶分类的商品， 先保存父级的id值，在保存自身的id值
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }
    //指定item布局的配置对象
    const formItemLayout={
      labelCol:{span:2}, //左侧label的宽度
      wrapperCol:{span:8},//指定右侧包裹的宽度
    }
    const title=(
      <span>
         <LinkButton onClick={()=>this.props.history.goBack()}>
          <Icon type='arrow-left' style={{fontSize:20}}></Icon>
        </LinkButton>
        <span>{isUpdate ? '修改商品':'添加商品'}</span>
      </span>
    )
    const {getFieldDecorator}=this.props.form
    return (
      <Card title={title}>
       <Form {...formItemLayout}>
         <Item label="商品名称">
           {
             getFieldDecorator('name',{
              initialValue:product.name,
              rules:[
                {required:true,message:"必须输入商品名称"}
              ]

            })
            (<Input placeholder="请输入商品名称"/>)
           }
         </Item>
         <Item label="商品描述">
         {
             getFieldDecorator('desc',{
              initialValue:product.desc,
              rules:[
                {required:true,message:"必须输入商品的描述"},
              ]

            })
            (<TextArea placeholder="请输入商品描述" autoSize={{minRows:2,maxRows:6}}/>)
           }
         </Item>
         <Item label="商品价格">
          {
              getFieldDecorator('price',{
                initialValue:product.price,
                rules:[
                  {required:true,message:"必须输入商品的价格"},
                  {validator:this.validatePrice}
                ]

              })
              (<Input type='number' placeholder="请输入商品价格" addonAfter="元"/>)
            }
          
         </Item>
         {/* 这里使用级联选择器，默认值是一个数组ids,与之匹配的数据是一个带有value，name属性的数组，先进行父元素的匹配，再进行子元素的匹配*/}
         <Item label="商品分类">
         {
              getFieldDecorator('categoryIds',{
                initialValue:categoryIds,
                rules:[
                  {required:true,message:"必须指定商品分类"},
                ]

              })
              (<Cascader 
                options={this.state.options} //需要显示的列表数据数组
                loadData={this.loadData} //当选择某个列表项，加载下一级列表的监听回调
            />)
            }
        
         </Item>
         <Item label="商品图片">
           {/* 这里就相当于把PicturesWall这个组件添加到myRef这个容器中 */}
          <PicturesWall ref={this.myRef} imgs={imgs}/> 
         </Item>
         <Item label="商品详情" labelCol={{span:2}} wrapperCol={{span:20}}>
            <RichTextEditor ref={this.editor} detail={detail}/>
         </Item>
         <Item>
           <Button type="primary" onClick={()=>this.submit()}>提交</Button>
         </Item>
       </Form>
      </Card>
    )
  }
}
export default Form.create()(ProductAddUpdate)
