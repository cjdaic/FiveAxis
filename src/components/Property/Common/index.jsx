import {InputNumber, Space } from 'antd'
import React, { Component } from 'react'
import './index.css'
import { connect } from 'react-redux'
import {updateObj} from '../../../redux/actions/ActionApp'

class Common extends Component {
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

  render() {
    const {data} = this.props.currentObj.userData
    return (
      <Space direction='vertical'>
        <InputNumber value={data.speed} onChange={this.handleChange('speed')} controls={false} addonBefore='速度' addonAfter='mm/s' size='small' />
        {/* <InputNumber value={data.jump_speed} onChange={this.handleChange('jump_speed')} addonBefore='跳转' addonAfter='次' size='small' /> */}
        <InputNumber value={data.times} onChange={this.handleChange('times')} addonBefore='重复次数' addonAfter='次' size='small' />
      </Space>
    )
  }
}

export default connect(
  state => ({
    currentObj: state.app.currentObj
  }),
  {
    updateObj
  }
)(Common)
