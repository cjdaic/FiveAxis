import { Button, Dropdown, InputNumber, Menu, Modal, message } from 'antd'
import React, { Component, createRef } from 'react'


export default class MyMenu extends Component {
  state = {
    freq: false,
    delay: false
  }
  freqRef = createRef()
  JUMP_SPEED = createRef()
  LASER_ON_DELAY = createRef()
  LASER_OFF_DELAY = createRef()
  MARK_DELAY = createRef()
  JUMP_DELAY = createRef()
  POLYGON_DELAY = createRef()

  handleConfigClick = (event) => {
    this.setState({[event.key]:true})
  }
  handleOk =  (key) => {
    return async () => {
      switch (key) {
        case 'freq':{
          message.loading({content:'配置中', key:'config', duration:0})
          let re = await window.grpc.setLaserFreq({freq:this.freqRef.current.value})
          message.success({content:'配置完毕', key:'config', duration:2})
          console.log(re)
          break;
        }
          
        
        case 'delay':{

          message.loading({content:'配置中', key:'config', duration:0})
          let re = await window.grpc.setDelay({
            JUMP_SPEED:this.JUMP_SPEED.current.value,
            LASER_ON_DELAY:this.LASER_ON_DELAY.current.value,
            LASER_OFF_DELAY:this.LASER_OFF_DELAY.current.value,
            MARK_DELAY:this.MARK_DELAY.current.value,
            JUMP_DELAY:this.JUMP_DELAY.current.value,
            POLYGON_DELAY:this.POLYGON_DELAY.current.value,
          })
          message.success({content:'配置完毕', key:'config', duration:2})
          console.log(re)
          break;
        }
          
          
        default:
          break;
      }
      this.setState({[key]:false})
    }
  }
  handleCancel = (key) => {
    return () => {
      this.setState({[key]:false})
    }
    
  }
  MenuConfig = (
    <Menu onClick={this.handleConfigClick}>
      <Menu.Item key="freq">激光频率</Menu.Item>
      <Menu.Item key="delay">Delay</Menu.Item>
      <Menu.Item key="correction">矫正文件</Menu.Item>
    </Menu>
  )
  
  
  render() {
    return (
      <div>
        <Dropdown overlay={this.MenuConfig} arrow>
          <Button>配置</Button>
        </Dropdown>
        <Modal title='激光频率' visible={this.state.freq} onOk={this.handleOk('freq')} onCancel={this.handleCancel('freq')}>
          <InputNumber ref={this.freqRef} max={200} min={1} defaultValue={200} addonAfter='kHz'/>
        </Modal>

        <Modal title='delay' visible={this.state.delay} onOk={this.handleOk('delay')} onCancel={this.handleCancel('delay')}>
          <InputNumber ref={this.JUMP_SPEED} max={1000} min={1} defaultValue={500} addonBefore='跳转速度' addonAfter='mm/s'/>
          <InputNumber ref={this.LASER_ON_DELAY} max={10000} min={10} defaultValue={200} addonBefore='开光延时' addonAfter='us'/>
          <InputNumber ref={this.LASER_OFF_DELAY} max={10000} min={10} defaultValue={600} addonBefore='关光延时' addonAfter='us'/>
          <InputNumber ref={this.MARK_DELAY} max={10000} min={10} defaultValue={600} addonBefore='打标延时' addonAfter='us'/>
          <InputNumber ref={this.JUMP_DELAY} max={10000} min={10} defaultValue={600} addonBefore='跳转延时' addonAfter='us'/>
          <InputNumber ref={this.POLYGON_DELAY} max={10000} min={10} defaultValue={400} addonBefore='多边延时' addonAfter='us'/>
        </Modal>
      </div>
    )
  }
}
