import {InputNumber, Space , Card, Button, message, Switch} from 'antd'
import React, { Component } from 'react'
import './index.css'
import { connect } from 'react-redux'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import {updateObj, setProcessing} from '../../../redux/actions/ActionApp'

class Rectangle extends Component {
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
      let re = await window.grpc.processRectangle({...this.props.currentObj.userData.data, isLast:true})
      message.success({content:'加工完毕', key:'process', duration:2})
      this.props.setProcessing(false)
      console.log(re)
    }
  }

  render() {
    const {data} = this.props.currentObj.userData
    return (
      <Space direction='vertical'>
        <Space>
          <InputNumber value={data.X0} onChange={this.handleChange('X0')} addonBefore='X0' size='small' />
          <InputNumber value={data.Y0} onChange={this.handleChange('Y0')} addonBefore='Y0' size='small' />
        </Space>
        <Space>
          <InputNumber value={data.X1} onChange={this.handleChange('X1')} addonBefore='X1' size='small' />
          <InputNumber value={data.Y1} onChange={this.handleChange('Y1')} addonBefore='Y1' size='small' />
        </Space>
        <Space>
          <InputNumber value={data.taper_A_Max} onChange={this.handleChange('taper_A_Max')} addonBefore='锥度A' size='small' />
          <InputNumber value={data.taper_B_Max} onChange={this.handleChange('taper_B_Max')} addonBefore='锥度B' size='small' />
        </Space>
        <Space>
          填充
          <Switch 
            checked={data.filled}
            onChange={this.handleChange('filled')}
            checkedChildren={<CheckOutlined/>}
            unCheckedChildren={<CloseOutlined/>}/>
        </Space>
        <Space style={{'display':data.filled ? 'block':'none'}}>
          <Card size='small' title='填充' headStyle={{textAlign:'left'}}>
            <Space direction='vertical'>
              <Space>
                <InputNumber value={data.X2} onChange={this.handleChange('X2')} addonBefore='X2' size='small' />
                <InputNumber value={data.Y2} onChange={this.handleChange('Y2')} addonBefore='Y2' size='small' />
              </Space>
              <InputNumber value={data.FeedSpacing_X} onChange={this.handleChange('FeedSpacing_X')} min={0.005} addonBefore='填充间隔X' size='small' />
              <InputNumber value={data.FeedSpacing_Y} onChange={this.handleChange('FeedSpacing_Y')} min={0.005} addonBefore='填充间隔Y' size='small' />
            </Space>
            
          </Card>
          
          <Card size='small' title='Z轴' headStyle={{textAlign:'left'}}>
            <Space direction='vertical'>
              <InputNumber value={data.z_start} onChange={this.handleChange('z_start')} controls={false} addonBefore='Z轴起点' size='small' />
              <InputNumber value={data.z_end} onChange={this.handleChange('z_end')} controls={false} addonBefore='Z轴终点' size='small' />
              <InputNumber value={data.z_interval} onChange={this.handleChange('z_interval')} controls={false} addonBefore='Z轴进给' size='small' />
            </Space>
          </Card>
          <Card size='small' title='边缘整形' headStyle={{textAlign:'left'}}>
            <Space direction='vertical'>
              <InputNumber value={data.circle_num_repair} onChange={this.handleChange('circle_num_repair')} controls={false} addonBefore='圈数' size='small' />
              <InputNumber value={data.times_repair} onChange={this.handleChange('times_repair')} controls={false} addonBefore='次数' size='small' />
            </Space>
          </Card>
        </Space>
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
)(Rectangle)
