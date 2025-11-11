import 'antd/dist/antd.min.css';
import React, { Component, createRef } from 'react';
import MyScene from './components/MyScene';
import Property from './components/Property/'
import Project from './components/Project';
import { Layout, Menu } from 'antd'
import './App.css'
import * as THREE from 'three'
import { connect } from 'react-redux'
import { delCurrentObj } from './redux/actions/ActionApp'
import MyMenu from './components/MyMenu';
class App extends Component {

  propertyRef = createRef()
  state = {
    propertyResize: false,
    propertyWidth: 350,
    projectResize: false,
    projectWidth: 250,
  }
  componentDidMount() {
    window.onkeydown = this.handleKeyDown
  }

  handlePropertyResizeBegin = () => {
    window.onmousemove = this.handleResize
    window.onmouseup = this.handleResizeEnd
    this.setState({ propertyResize: true })
  }
  handleProjectResizeBegin = () => {
    this.setState({ projectResize: true })
    window.onmousemove = this.handleResize
    window.onmouseup = this.handleResizeEnd
  }

  handleResize = (event) => {
    if (this.state.propertyResize) {
      this.setState({ propertyWidth: document.body.offsetWidth - event.clientX })
    }
    else if (this.state.projectResize) {
      this.setState({ projectWidth: event.clientX + 3 })
    }
  }

  handleResizeEnd = () => {
    this.setState({ propertyResize: false, projectResize: false })
    window.onmousemove = null
    window.onmouseup = null
  }
  handleKeyDown = (event) => {
    if (event.key === 'Delete') {
      this.props.delCurrentObj()
    }
    // else if(event.key === 'a'){
    //   this.test = {...this.test,a:1}
    // }
    // else if(event.key === 'd'){
    //   this.test = ({...this.test,d:1})
    // }
    // console.log(this.test)
  }
  handleClickTest = () => {
    //console.log(this.state.THREEScene)
  }

  render() {
    return (
      <Layout className='layout' onClick={this.handleClickTest}>
        <Layout.Header className='layout-header'>
          <MyMenu />
        </Layout.Header>
        <Layout>
          <Layout.Sider className='layout-project' width={this.state.projectWidth}>
            <Project />
            <div className='drag-bar-right' onMouseDown={this.handleProjectResizeBegin}></div>
          </Layout.Sider>
          <Layout.Content className='layout-scene'>
            <MyScene />
          </Layout.Content>
          <Layout.Sider ref={this.propertyRef} className='layout-property' width={this.state.propertyWidth} >
            <div className='drag-bar-left' onMouseDown={this.handlePropertyResizeBegin}></div>
            <Property />
          </Layout.Sider>
        </Layout>


      </Layout>

    )
  }

}

export default connect(
  state => ({
    isProcessing: state.app.isProcessing
  }),
  {
    delCurrentObj,
  }
)(App)
