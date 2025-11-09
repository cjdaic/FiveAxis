
import { Button, InputNumber, Space, Radio, Switch, Card, message } from 'antd'
import React, { Component } from 'react'
import './index.css'
import '../index.css'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import {updateObj, setProcessing} from '../../../redux/actions/ActionApp'


class Ellipse extends Component {
  handleChange = (name) => {
    return (value) => {
      if(value === null){
        value = 0
      }
      const {data} = this.props.currentObj.userData
      data[name] = value
      console.log(data[name])
      this.props.updateObj(this.props.currentObj)
    }
  }
  handleRadio = (name) => {
    return (event) => {
      const {data} = this.props.currentObj.userData
      data[name] = event.target.value
      this.props.updateObj(this.props.currentObj)
    }
  }

  handleProcess = async() => {
    if(this.props.isProcessing){
      message.warn("加工进行中")
    }
    else{
      this.props.setProcessing(true)
      message.loading({content:'加工中', key:'process', duration:0})
      let re = await window.grpc.processEllipse({...this.props.currentObj.userData.data, isLast:true})
      message.success({content:'加工完毕', key:'process', duration:2})
      this.props.setProcessing(false)
      console.log(re)
    }
  }
  render() {
    const {data} = this.props.currentObjData
    const userData = this.props.currentObjData
    return (
      <Space direction='vertical' >
        <Space>
          圆心：
          <InputNumber value={data.X0} onChange={this.handleChange('X0')} controls={false} addonBefore='X' size='small' />
          <InputNumber value={data.Y0} onChange={this.handleChange('Y0')} controls={false} addonBefore='Y' size='small' />
        </Space>
        
        <Space>
          半径：
          <InputNumber value={data.a_Max} onChange={this.handleChange('a_Max')} controls={false} addonBefore='a' size='small' />
          <InputNumber value={data.b_Max} onChange={this.handleChange('b_Max')} controls={false} addonBefore='b' size='small' />
        </Space>


        <Space>
          <InputNumber value={data.taper_A_Max} onChange={this.handleChange('taper_A_Max')} controls={360} addonBefore='锥度A' size='small' />
          <InputNumber value={data.taper_B_Max} onChange={this.handleChange('taper_B_Max')} controls={360} addonBefore='锥度B' size='small' />
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
          <Card size='small' title='半径' headStyle={{textAlign:'left'}}>
            <Space direction='vertical'>
              <InputNumber value={data.a_Min} max={data.a_Max} onChange={this.handleChange('a_Min')} controls={false} addonBefore='a_Min' size='small' />
              <InputNumber value={data.b_Min} max={data.b_Max} onChange={this.handleChange('b_Min')} controls={false} addonBefore='b_Min' size='small' />
              <InputNumber value={data.FeedSpacing_X} onChange={this.handleChange('FeedSpacing_X')} controls={false} addonBefore='X填充间隔' size='small' />
              <InputNumber value={data.FeedSpacing_Y} onChange={this.handleChange('FeedSpacing_Y')} controls={false} addonBefore='Y填充间隔' size='small' />
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
)(Ellipse)