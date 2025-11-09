
import { Button, InputNumber, Space } from 'antd'
import React, { Component } from 'react'

import './index.css'
import '../index.css'
import { connect } from 'react-redux'
import {updateObj, setProcessing} from '../../../redux/actions/ActionApp'
import {message} from 'antd'

class Line extends Component {
  handleChange = (name) => {
    return (value) => {
      if(value === null){
        value = 0
      }
      const {data} = this.props.currentObj.userData
      data[name] = value
      this.props.updateObj(this.props.currentObj)
      this.forceUpdate()
    }
  }
  handleProcess = async () => {
    if(this.props.isProcessing){
      message.warn("加工进行中")
    }
    else{
      this.props.setProcessing(true)
      message.loading({content:'加工中', key:'process', duration:0})
      let re = await window.grpc.processLine({...this.props.currentObj.userData.data, isLast: true})
      message.success({content:'加工完毕', key:'process', duration:2})
      this.props.setProcessing(false)
      console.log(re)
    }
  }
  render() {
    
    const {data} = this.props.currentObjData

    return (
      <Space direction='vertical'>
        起点：
        <Space>
          
          <InputNumber value={data.X1} onChange={this.handleChange('X1')} defaultValue={0} controls={false} addonBefore='X' size='small' />
          <InputNumber value={data.Y1} onChange={this.handleChange('Y1')} defaultValue={0} controls={false} addonBefore='Y' size='small' />
          <InputNumber value={data.Z1} onChange={this.handleChange('Z1')} defaultValue={0} controls={false} addonBefore='Z' size='small' />
          
        </Space>
        <Space>
          <InputNumber value={data.A1} onChange={this.handleChange('A1')} defaultValue={0} controls={false} addonBefore='A' size='small' />
          <InputNumber value={data.B1} onChange={this.handleChange('B1')} defaultValue={0} controls={false} addonBefore='B' size='small' />
        </Space>
        终点：
        <Space>
          <InputNumber value={data.X2} onChange={this.handleChange('X2')} defaultValue={0} controls={false} addonBefore='X' size='small' />
          <InputNumber value={data.Y2} onChange={this.handleChange('Y2')} defaultValue={0} controls={false} addonBefore='Y' size='small' />
          <InputNumber value={data.Z2} onChange={this.handleChange('Z2')} defaultValue={0} controls={false} addonBefore='Z' size='small' />
          
        </Space>
        <Space>
          <InputNumber value={data.A2} onChange={this.handleChange('A2')} defaultValue={0} controls={false} addonBefore='A' size='small' />
          <InputNumber value={data.B2} onChange={this.handleChange('B2')} defaultValue={0} controls={false} addonBefore='B' size='small' />
        </Space>
        <Space className='begin-button'>
          <Button onClick={this.handleProcess}  type='primary'>加工</Button>
        </Space>
        
      </Space>  
    )
  }
}
export default connect(
  state => ({
    currentObj: state.app.currentObj,
    currentObjData: state.app.currentObjData,
    isProcessing: state.app.isProcessing,
  }),
  {
    updateObj,
    setProcessing,
  }
)(Line)