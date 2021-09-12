import React, { Component } from 'react'
import {
  Card,
  Icon,
  List,

} from 'antd'
import LinkButton from '../../components/link-button'
import {BASE_IMG_URL} from '../../utils/constants'
import {reqCategory} from '../../api/index'
import memoryUtils from '../../utils/memoryUtils'
import { CodeOutlined } from '@ant-design/icons'
const Item=List.Item
/*Prodcut的详情子路由组件 */
export default class ProductDetail extends Component {
  state={
    cName1:"",//一级分类名称
    cName2:"",//二级分类名称
  }
  async componentDidMount(){
    //得到当前商品的分类ID
    console.log(memoryUtils.product);
    const {pCategoryId,categoryId} =memoryUtils.product
    if(pCategoryId==='0'){    //一级分类下的商品
      const result=await reqCategory(categoryId)
      const cName1=result.data.name
      this.setState({cName1})
    }else{      //二级分类下的商品
      //一次性发送放多个请求，只有都成功了，才正常处理
      const results= await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)],)
      const cName1=results[0].data.name
      const cName2=results[1].data.name
      this.setState({
        cName1,
        cName2
      })
    }
  }
    /*
  在卸载之前清除保存的数据
  */
  componentWillUnmount () {
    memoryUtils.product = {}
  }
  render() {
    //读取携带过来的state数据，下面是使用this.history.push()方法跳转携带数据时的读取方法
    const {name,desc,price,detail,imgs}=memoryUtils.product

    const {cName1,cName2} =this.state
    const title=(
      <span>
        <LinkButton>
          <Icon 
             type="arrow-left" 
             style={{color:"green",marginRight:10,fontSize:20}}
             onClick={()=>this.props.history.goBack()}   
          ></Icon>
        </LinkButton>
        <span>商品详情</span>
      </span>
    )
    return (
      <Card title={title} className="product-detail">
        <List>
          <Item>
              <span className="left">商品名称:</span>
              <span>{name}</span>
          </Item>
          <Item>
              <span className="left">商品描述:</span>
              <span>{desc}</span>
          </Item>
          <Item>
              <span className="left">商品价格:</span>
              <span>{price}</span>
          </Item>
          <Item>
              <span className="left">所属分类:</span>
              <span>{cName1}{cName2 ? '-->'+cName2 :""}</span>
          </Item>
          <Item>
              <span className="left">商品图片:</span>
              <span>
               {
                  imgs.map(img=>(
                    <img
                    key={img}
                      className="product-img"
                      src={BASE_IMG_URL+img}
                    />  
                  ))
               }
              </span>
          </Item>
          <Item>
              <span className="left">商品详情:</span>
              <span dangerouslySetInnerHTML={{__html:detail}}></span>
          </Item>
        </List>
      </Card>
    )
  }
}
