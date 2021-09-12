import { Upload, Modal, message } from 'antd';
import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types'

import {reqDeleteImg} from '../../api'
import { BASE_IMG_URL } from '../../utils/constants'

/*用于图片上传的组件 */
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  //得到的默认的图片信息
  static propTypes={
    imgs:PropTypes.array
  }
  constructor(props){
    super(props)
    let fileList=[]
    //如果传入了imgs属性
    const {imgs}=this.props
    if(imgs && imgs.length>0){
      //生成初始的fileList
      fileList=imgs.map((img,index)=>({
        uid:-index,
        name:img,
        status:'done',
        url:BASE_IMG_URL+img
      }))
    }
    //初始化状态
    this.state={
      previewVisible:false,//表示是否显示大图预览Modal
      previewImage:'',//大图的url
      fileList
    }
  }
 /*隐藏modal */
  handleCancel = () => this.setState({ previewVisible: false });
  //显示指定file对应的大图
  handlePreview = async file => {
    //点开的大图会自动拥有url,preview这两个属性
    if (!file.url && !file.preview) {
      //如果图片没有url，则通过base64的方式显示
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };
  /*
    file:当前操作的图片文件(上传/删除)
    fileList:所有已上传图片文件对象的数组
  */
  handleChange = async({file, fileList }) => {
    //一旦上传成功，将当前上传的file的信息修正(name,url)
    if(file.status==='done'){
      const result=file.response     //{status:0,data:{name:'xxx.jpg',url:'图片地址'}}
      if(result.status===0){
        message.success("上传图片成功!")
        const {name,url}=result.data
        /*这里修改的是fileList中的file对象 */
        file=fileList[fileList.length-1]
        file.name=name
        file.url=url
      }else{
        message.error("上传图片失败!")
      }
    }else if(file.status==='removed'){ //删除图片
      const result= await reqDeleteImg(file.name)
      if(result.status===0){
        message.success("删除图片成功!")
      }else{
        message.error("删除图片失败!")
      }
    }

    /*在操作(上传/删除)过程中更新fileList状态 */
    this.setState({ fileList })
  
  };
  /*获取所有已上传图片文件名的数组 */
  getImgs=()=>{
    return this.state.fileList.map(file=>file.name)
  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
       {/* 图片上传 */}
        <Upload
          accept='image/*' /*只接收图片格式 */
          action="/manage/img/upload" /*上传图片的接口地址 */
          listType="picture-card"/*卡片样式 */
          name='image'//上传给后台的请求参数名
          fileList={fileList}/*所有已上传图片文件对象的数组 */
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}