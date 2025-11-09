import React, { Component } from 'react'
import Line from './Line'
import Common from './Common'
import Circle from './Circle'
import Ellipse from './Ellipse'
import {message,  Button, Collapse} from 'antd'
import './index.css'
import { connect } from 'react-redux'
import Rectangle from './Rectangle'
import Rectangle3D from './Rectangle3D'


class Property extends Component {

  state = {
    resizeClick:false,
    isProcessing:false,
  }
  mouseStartPos = 0;
  propertyStartWidth = 0;
  refDiv= React.createRef()
  handleResizeBegin = (event) => {
    this.mouseStartPos = event.clientX;
    this.propertyStartWidth = this.refDiv.current.scrollWidth
    this.setState({resizeClick:true})
  }

  handleResize = (event) => {
    if(this.state.resizeClick){
      const m_div = this.refDiv.current
      m_div.style.width = `${this.propertyStartWidth - event.clientX + this.mouseStartPos}px`
    }   
  }

  handleResizeEnd = () => {
    this.propertyStartWidth = this.refDiv.current.scrollWidth
    this.setState({resizeClick:false})
  }

  componentDidMount(){
    
  }

  handleHello = async () =>{
    if (this.state.isProcessing) {
      message.warn("加工进行中")
    }
    {
      this.setState({isProcessing:true})
      message.loading({content:'加工中', key:'process', duration:0})
      let a = await window.grpc.test1({message:"req", code:'1'})
      message.success({content:'加工完毕', key:'process', duration:2})
      this.setState({isProcessing:false})
    }
  }
  handleHi = async () =>{
    console.log(process.env);
    if (this.state.isProcessing) {
      message.warn("加工进行中")
    }
    {
      this.setState({isProcessing:true})
      message.loading({content:'加工中', key:'process', duration:0})
      let a = await window.grpc.test2({message:"req", code:'1'})
      message.success({content:'加工完毕', key:'process', duration:2})
      this.setState({isProcessing:false})
      console.log(a);
    }
  }
  render() {
    const propertyElement = []
    const propertyNameMap = {common:'通用', line:'直线', circle:'圆', cilledCircle:'同心圆', rectangle:'矩形', ellipse:'椭圆', rectangle3D:'矩形3D'}
    const propertyComponentMap = {
      common:<Common/>, 
      line:<Line/>, 
      circle:<Circle/>, 
      rectangle:<Rectangle/>,
      ellipse:<Ellipse/>,
      rectangle3D:<Rectangle3D/>,
      cilledCircle:'同心圆'
    }
    if(this.props.currentObj !== null && this.props.currentObj !== undefined && this.props.currentObj !== this.props.scene){
      const {userData} = this.props.currentObj
      propertyElement.push('common')
      propertyElement.push(userData.type)
    } 
    
    return (
      
      <div ref={this.refDiv}>
        
        <Collapse activeKey={propertyElement} className='property-item'>
          {
            propertyElement.map(item => {
              return (
                <Collapse.Panel showArrow={false} className='panel' header={propertyNameMap[item]} key={item} >
                  {propertyComponentMap[item]}
                </Collapse.Panel>
              )
            })
          }
        </Collapse>  
        <Button onClick={this.handleHello} type='primary'>test1</Button>
        <Button onClick={this.handleHi} type='primary'>test2</Button>
        
      </div>
    )
  }
}

export default connect(
  state => ({
    currentObj: state.app.currentObj,
    scene: state.app.scene,
  }),
  {}
)(Property)