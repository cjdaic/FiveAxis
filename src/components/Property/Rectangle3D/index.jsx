import {InputNumber, Space , Card, Button, message, Switch} from 'antd'
import React, { Component } from 'react'
import './index.css'
import { connect } from 'react-redux'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import {updateObj, setProcessing} from '../../../redux/actions/ActionApp'

class Rectangle3D extends Component {
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
  handleProcess = async() => {
    if(this.props.isProcessing){
      message.warn("加工进行中")
    }
    else{
      this.props.setProcessing(true)
      message.loading({content:'加工中', key:'process', duration:0})
      let re = await window.grpc.processRectangle3D({...this.props.currentObj.userData.data, isLast:true})
      message.success({content:'加工完毕', key:'process', duration:2})
      this.props.setProcessing(false)
      console.log(re)
    }
  }

  render() {
    const {data} = this.props.currentObj.userData
    return (
      <Space direction='vertical'>
          <InputNumber value={data.X0} onChange={this.handleChange('X0')} addonBefore='X0' controls={false} size='small' />
          <InputNumber value={data.Y0} onChange={this.handleChange('Y0')} addonBefore='Y0' controls={false} size='small' />
          <InputNumber value={data.Z0} onChange={this.handleChange('Z0')} addonBefore='Z0' controls={false} size='small' />
          <InputNumber value={data.X1} onChange={this.handleChange('X1')} addonBefore='X1' controls={false} size='small' />
          <InputNumber value={data.Y1} onChange={this.handleChange('Y1')} addonBefore='Y1' controls={false} size='small' />
          <InputNumber value={data.Z1} onChange={this.handleChange('Z1')} addonBefore='Z1' controls={false} size='small' />
          <InputNumber value={data.interval} onChange={this.handleChange('interval')} addonBefore='间隔' size='small' />
          <Space className='begin-button'>
            <Button onClick={this.handleProcess} type='primary'>加工</Button>
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
)(Rectangle3D)
