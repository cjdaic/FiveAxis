import { Button, Row, Col, Image, message, Space, Layout, Radio, Modal } from 'antd'
import React, { Component, createRef } from 'react'
import { MyGridHelper } from './MyGridHelper'
import * as THREE from 'three'
import './index.css'
import { ReactComponent as lineIcon } from './icons/line.svg'
import { ReactComponent as circleIcon } from './icons/circle.svg'
import { ReactComponent as pointerIcon } from './icons/pointer.svg'
import { ReactComponent as rectangleIcon } from './icons/rectangle.svg'
import { ReactComponent as ellipseIcon } from './icons/Ellipse.svg'
import Icon from '@ant-design/icons/lib/components/Icon'
import LineData from '../ObjectData/LineData'
import CircleData from '../ObjectData/CircleData'
import RectangleData from '../ObjectData/RectangleData'
import EllipseData from '../ObjectData/EllipseData'
import { connect } from 'react-redux'
import { updateObj, setScene, setCurrentObj } from '../../redux/actions/ActionApp'
import Rectangle3DData from '../ObjectData/Rectangle3DData'
import ThreeDViewer from '../ThreeDViewer/ThreeDViewer'

class MyScene extends Component {
  state = {
    drawMode: 'pointer',
    moveMode: 'none',
    clientX: 0,
    clientY: 0,
    axisStartX: 0,
    axisStartY: 0,
    viewerVisible: false,
  }
  componentDidMount() {
    this.container = document.getElementById("webgl-output")
    this.initRenderer()
    this.initCamera()
    this.initScene()
    this.initGrid()
    this.initObject()
    this.animate()
    this.props.setScene(this.userScene)
  }

  openViewer = () => {
    this.setState({ viewerVisible: true })
  }

  closeViewer = () => {
    this.setState({ viewerVisible: false })
  }

  componentWillUnmount() {
    // clearInterval(this.timer)
    // this.renderer.forceContextLoss();
    // this.renderer = null;
  }


  initRenderer = () => {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    //this.renderer.setSize(2000, 1000)
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight)
    this.container.appendChild(this.renderer.domElement)
  }

  initCamera = () => {
    this.camera = new THREE.PerspectiveCamera(90, this.container.offsetWidth / this.container.offsetHeight, 0.01, 1000)
    this.camera.position.z = 2
  }

  initScene = () => {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xffffffff)
  }

  initGrid = () => {
    var size = 50;
    var divisions = 50;
    var gridSmall = new MyGridHelper(size, divisions * 5, 0x444444, '#DCDCDC');
    var gridLarge = new MyGridHelper(size, divisions);
    this.scene.add(gridSmall, gridLarge);
  }

  initObject = () => {
    // let geometry = new THREE.BoxBufferGeometry( 0.2, 0.2, 0.2 );
    // let material = new THREE.MeshNormalMaterial();
    // this.mesh = new THREE.Mesh( geometry, material );
    // this.scene.add( this.mesh );
    this.userScene = new THREE.Object3D();
    this.userScene.name = 'SCENE'
    this.scene.add(this.userScene)
  }

  animate = () => {
    requestAnimationFrame(this.animate)
    this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight)
    if (this.state.moveMode !== 'none') {
      this.props.updateObj(this.props.currentObj)
    }

    this.renderer.render(this.scene, this.camera);
  }

  handleWheel = (event) => {
    const fix = 0.1
    if (event.deltaY > 0) {
      this.camera.position.z += fix;
    }
    else if (event.deltaY < 0) {
      this.camera.position.z -= fix;
    }
  }
  handleKeyPress = (event) => {
    const fix = 0.1
    switch (event.key) {
      case 'w':
        this.camera.position.y += fix
        break
      case 'a':
        this.camera.position.x -= fix
        break
      case 's':
        this.camera.position.y -= fix
        break
      case 'd':
        this.camera.position.x += fix
        break
      default:
        break;
    }
  }
  handleMouseEnter = () => {
    document.getElementById('id-layout').focus()
  }
  handleMoveClear = () => {
    this.setState({ moveMode: 'none' })
    window.onmousemove = null
    window.onmouseup = null
  }

  handleMouseDown = (event) => {
    if (event.button === 0) {
      switch (this.state.drawMode) {
        case 'line': {
          const offsetX = event.nativeEvent.offsetX
          const offsetY = event.nativeEvent.offsetY
          const axisStartX = this.calAxisX(offsetX)
          const axisStartY = this.calAxisY(offsetY)
          this.setState({
            axisStartX: this.calAxisX(offsetX),
            axisStartY: this.calAxisY(offsetY),
          })
          let lineData = new LineData()
          lineData.data.X1 = axisStartX
          lineData.data.Y1 = axisStartY
          lineData.data.X2 = axisStartX
          lineData.data.Y2 = axisStartY
          const material = new THREE.LineBasicMaterial({ color: 0x0000ff })
          let line = new THREE.Line(lineData.genGeometry(), material)
          line.name = `line${line.id}`
          line.userData = lineData
          this.userScene.add(line)
          this.props.setCurrentObj(line)
          break;
        }
        case 'circle': {
          let offsetX = event.nativeEvent.offsetX
          let offsetY = event.nativeEvent.offsetY
          const axisStartX = this.calAxisX(offsetX)
          const axisStartY = this.calAxisY(offsetY)
          this.setState({
            axisStartX: axisStartX,
            axisStartY: axisStartY,
          })
          let circleData = new CircleData()
          circleData.data.X1 = axisStartX
          circleData.data.Y1 = axisStartY
          circleData.data.X2 = axisStartX
          circleData.data.Y2 = axisStartY
          const geometry = circleData.genGeometry()

          const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })

          let circle = new THREE.LineSegments(geometry, material)
          circle.name = `circle${circle.id}`

          circle.userData = circleData
          this.userScene.add(circle)
          this.props.setCurrentObj(circle)
          console.log(circle)
          break;
        }
        case 'rectangle': {
          let offsetX = event.nativeEvent.offsetX
          let offsetY = event.nativeEvent.offsetY
          const axisStartX = this.calAxisX(offsetX)
          const axisStartY = this.calAxisY(offsetY)
          this.setState({
            axisStartX: axisStartX,
            axisStartY: axisStartY,
          })
          let rectangleData = new RectangleData()
          rectangleData.data.X0 = axisStartX
          rectangleData.data.Y0 = axisStartY
          rectangleData.data.X1 = axisStartX
          rectangleData.data.Y1 = axisStartY

          const geometry = rectangleData.genGeometry()
          const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
          let rectangle = new THREE.LineSegments(geometry, material)
          rectangle.name = `rectangle${rectangle.id}`
          rectangle.userData = rectangleData
          this.userScene.add(rectangle)
          this.props.setCurrentObj(rectangle)
          break
        }
        case 'ellipse': {
          let offsetX = event.nativeEvent.offsetX
          let offsetY = event.nativeEvent.offsetY
          const axisStartX = this.calAxisX(offsetX)
          const axisStartY = this.calAxisY(offsetY)
          this.setState({
            axisStartX: axisStartX,
            axisStartY: axisStartY,
          })
          let ellipseData = new EllipseData()
          ellipseData.data.X0 = axisStartX
          ellipseData.data.Y0 = axisStartY

          const geometry = ellipseData.genGeometry()
          const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
          let ellipse = new THREE.LineSegments(geometry, material)
          ellipse.name = `ellipse${ellipse.id}`
          ellipse.userData = ellipseData
          this.userScene.add(ellipse)
          this.props.setCurrentObj(ellipse)
          break
        }

        case 'rectangle3D': {
          let offsetX = event.nativeEvent.offsetX
          let offsetY = event.nativeEvent.offsetY
          const axisStartX = this.calAxisX(offsetX)
          const axisStartY = this.calAxisY(offsetY)
          this.setState({
            axisStartX: axisStartX,
            axisStartY: axisStartY,
          })
          let rectangle3DData = new Rectangle3DData()
          rectangle3DData.data.X0 = axisStartX
          rectangle3DData.data.Y0 = axisStartY
          rectangle3DData.data.Z0 = 0
          rectangle3DData.data.X1 = axisStartY
          rectangle3DData.data.Y1 = axisStartX
          rectangle3DData.data.Z1 = 0

          const geometry = rectangle3DData.genGeometry()
          const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
          let rectangle3D = new THREE.LineSegments(geometry, material)
          rectangle3D.name = `rectangle3D${rectangle3D.id}`
          rectangle3D.userData = rectangle3DData
          this.userScene.add(rectangle3D)
          this.props.setCurrentObj(rectangle3D)
          break
        }

        default: {

          break;
        }

      }
      this.setState({ moveMode: 'left' })
    }
    else if (event.button === 1) {
      this.setState({ moveMode: 'mid' })
    }
    else if (event.button === 2) {
      this.setState({ moveMode: 'right' })
    }
    this.setState({ clientX: event.clientX, clientY: event.clientY })
    this.setState({ axisX: 0, axisY: 0 })
    window.onmousemove = this.handleMouseMove
    window.onmouseup = this.handleMoveClear
  }

  handleMouseMove = (event) => {
    const fix = 0.0022 * this.camera.position.z
    switch (this.state.moveMode) {
      case 'mid':
        this.camera.position.x -= fix * (event.clientX - this.state.clientX)
        this.camera.position.y += fix * (event.clientY - this.state.clientY)
        this.setState({ clientX: event.clientX, clientY: event.clientY })
        break
      case 'right':
        break

      default:
        break
    }
  }
  handleDraw = (event) => {
    if (this.state.moveMode === 'left') {
      switch (this.state.drawMode) {
        case 'pointer':

          break;
        case 'line': {
          let offsetX = event.nativeEvent.offsetX
          let offsetY = event.nativeEvent.offsetY
          const axisEndX = this.calAxisX(offsetX)
          const axisEndY = this.calAxisY(offsetY)

          let lineData = this.props.currentObj.userData.data
          lineData.X2 = axisEndX
          lineData.Y2 = axisEndY

          break
        }

        case 'circle': {
          let offsetX = event.nativeEvent.offsetX
          let offsetY = event.nativeEvent.offsetY
          const axisEndX = this.calAxisX(offsetX)
          const axisEndY = this.calAxisY(offsetY)
          let circleData = this.props.currentObj.userData.data
          circleData.X2 = axisEndX
          circleData.Y2 = axisEndY
          break
        }

        case 'rectangle': {
          let offsetX = event.nativeEvent.offsetX
          let offsetY = event.nativeEvent.offsetY
          const axisEndX = this.calAxisX(offsetX)
          const axisEndY = this.calAxisY(offsetY)
          let rectangleData = this.props.currentObj.userData.data
          rectangleData.X1 = axisEndX
          rectangleData.Y1 = axisEndY
          break
        }
        case 'ellipse': {
          let offsetX = event.nativeEvent.offsetX
          let offsetY = event.nativeEvent.offsetY
          const axisEndX = this.calAxisX(offsetX)
          const axisEndY = this.calAxisY(offsetY)
          let ellipse = this.props.currentObj.userData.data
          ellipse.a_Max = axisEndX - ellipse.X0
          ellipse.b_Max = axisEndY - ellipse.Y0
          break
        }
        case 'rectangle3D': {
          let offsetX = event.nativeEvent.offsetX
          let offsetY = event.nativeEvent.offsetY
          const axisEndX = this.calAxisX(offsetX)
          const axisEndY = this.calAxisY(offsetY)
          let rectangle3DData = this.props.currentObj.userData.data
          rectangle3DData.X1 = axisEndX
          rectangle3DData.Y1 = axisEndY
          break
        }

        default:
          break;
      }
    }

  }
  handleDrawMode = (event) => {
    let mode = event.target.value
    if (mode === 'pointer') {
      this.container.style.cursor = 'default'
    }
    else {
      this.container.style.cursor = 'crosshair'
    }
    this.setState({ drawMode: mode })
  }
  calAxisX = (offsetX) => {
    let fixX = this.camera.position.z * this.container.offsetWidth / this.container.offsetHeight
    return this.camera.position.x - fixX * (1 - offsetX / this.container.offsetWidth * 2)
  }
  calAxisY = (offsetY) => {
    let fixY = this.camera.position.z
    return this.camera.position.y + fixY * (1 - offsetY / this.container.offsetHeight * 2)
  }
  clickTest = (event) => {
    let offsetX = event.nativeEvent.offsetX
    let offsetY = event.nativeEvent.offsetY
    let fixX = this.camera.position.z * this.container.offsetWidth / this.container.offsetHeight
    let fixY = this.camera.position.z

    // console.log('x: ', this.camera.position.x - fixX * (1 - offsetX / this.container.offsetWidth * 2))
    // console.log('y: ', this.camera.position.y + fixY * (1 - offsetY / this.container.offsetHeight * 2))
  }
  render() {
    console.log('myscene')
    return (
      <Layout id='id-layout' tabIndex="0" className='scene' onMouseMove={this.handleMouseEnter}>
        <Layout.Header style={{ backgroundColor: 'aliceblue' }}>
          <Radio.Group buttonStyle="solid" value={this.state.drawMode} onChange={this.handleDrawMode}>
            <Radio.Button value={'pointer'}>
              <Icon component={pointerIcon} />
            </Radio.Button>
            <Radio.Button value={'line'}>
              <Icon component={lineIcon} />
            </Radio.Button>
            <Radio.Button value={'circle'}>
              <Icon component={circleIcon} />
            </Radio.Button>
            <Radio.Button value={'rectangle'}>
              <Icon component={rectangleIcon} />
            </Radio.Button>
            <Radio.Button value={'ellipse'}>
              <Icon component={ellipseIcon} />
            </Radio.Button>
            <Radio.Button value={'rectangle3D'}>
              矩形3D
            </Radio.Button>
          </Radio.Group>
          <Button type="primary" onClick={this.openViewer}>
            打开3D模型处理
          </Button>
        </Layout.Header>
        <Layout.Content id='webgl-output'
          onWheel={this.handleWheel}
          onKeyPress={this.handleKeyPress}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleDraw}
          onClick={this.clickTest}
          onMouseUp={this.handleMoveClear}
        ></Layout.Content >
        <Modal
          title="3D 模型处理"
          open={this.state.viewerVisible}
          onCancel={this.closeViewer}
          width="80%"
          footer={null}
          bodyStyle={{ height: '80vh', padding: 0 }}
        >
          <ThreeDViewer />
        </Modal>
      </Layout>

    )
  }
}
export default connect(
  state => ({
    currentObj: state.app.currentObj,
    scene: state.app.scene,
  }),
  {
    updateObj,
    setScene,
    setCurrentObj,
  }
)(MyScene)