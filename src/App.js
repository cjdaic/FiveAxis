import 'antd/dist/antd.min.css';
import React, { Component, createRef } from 'react';
import { Layout, Menu, Button, Space, message, Input } from 'antd';
import { UploadOutlined, PlaneOutlined } from '@ant-design/icons';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import Property from './components/Property/';
import Project from './components/Project';
import MyMenu from './components/MyMenu';
import { connect } from 'react-redux';
import { delCurrentObj, setScene } from './redux/actions/ActionApp';
import './App.css';

const { Header, Content, Sider } = Layout;

class App extends Component {
  // 状态管理
  state = {
    propertyResize: false,
    propertyWidth: 350,
    projectResize: false,
    projectWidth: 250,
    model: null,
    plane: null,
    clippedMesh: null,
    transformControls: null,
  };

  // 引用
  containerRef = createRef();
  propertyRef = createRef();
  renderer = null;
  camera = null;
  scene = null;
  controls = null;

  componentDidMount() {
    // 初始化Three.js场景
    this.initThreeScene();
    // 键盘事件监听
    window.onkeydown = this.handleKeyDown;
    // 窗口大小调整监听
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
    window.onkeydown = null;
    if (this.renderer) {
      this.containerRef.current.removeChild(this.renderer.domElement);
    }
  }

  // 初始化Three.js场景
  initThreeScene = () => {
    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(
      this.containerRef.current.clientWidth,
      this.containerRef.current.clientHeight
    );
    this.renderer.setClearColor(0xf0f0f0);
    this.containerRef.current.appendChild(this.renderer.domElement);

    // 创建场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    this.props.setScene(this.scene); // 同步到Redux

    // 创建相机
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.containerRef.current.clientWidth / this.containerRef.current.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // 创建轨道控制器
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    // 添加网格辅助线
    const gridHelper = new THREE.GridHelper(10, 10, 0xcccccc, 0xeeeeee);
    this.scene.add(gridHelper);

    // 创建裁剪平面
    const planeGeometry = new THREE.PlaneGeometry(5, 5);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.name = 'clippingPlane';
    this.scene.add(plane);
    this.setState({ plane });

    // 创建平面变换控制器
    const transformControls = new TransformControls(this.camera, this.renderer.domElement);
    transformControls.attach(plane);
    transformControls.setMode('translate');
    this.scene.add(transformControls);
    this.setState({ transformControls });

    // 动画循环
    this.animate();

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);
  };

  // 动画循环
  animate = () => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  // 窗口大小调整
  handleWindowResize = () => {
    if (!this.camera || !this.renderer || !this.containerRef.current) return;

    const width = this.containerRef.current.clientWidth;
    const height = this.containerRef.current.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  // 处理属性面板大小调整
  handlePropertyResizeBegin = () => {
    window.onmousemove = this.handleResize;
    window.onmouseup = this.handleResizeEnd;
    this.setState({ propertyResize: true });
  };

  // 处理项目面板大小调整
  handleProjectResizeBegin = () => {
    this.setState({ projectResize: true });
    window.onmousemove = this.handleResize;
    window.onmouseup = this.handleResizeEnd;
  };

  // 调整大小逻辑
  handleResize = (event) => {
    if (this.state.propertyResize) {
      this.setState({ propertyWidth: document.body.offsetWidth - event.clientX });
    } else if (this.state.projectResize) {
      this.setState({ projectWidth: event.clientX + 3 });
    }
    // 触发场景大小调整
    this.handleWindowResize();
  };

  // 结束大小调整
  handleResizeEnd = () => {
    this.setState({ propertyResize: false, projectResize: false });
    window.onmousemove = null;
    window.onmouseup = null;
  };

  // 键盘事件处理
  handleKeyDown = (event) => {
    if (event.key === 'Delete') {
      this.props.delCurrentObj();
    }
  };

  // 模型文件上传处理
  handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const reader = new FileReader();

    if (fileName.endsWith('.stl')) {
      reader.onload = (e) => {
        const loader = new STLLoader();
        const geometry = loader.parse(e.target.result);
        const material = new THREE.MeshStandardMaterial({
          color: 0x7777ff,
          wireframe: false
        });
        const mesh = new THREE.Mesh(geometry, material);
        this.processLoadedModel(mesh);
      };
      reader.readAsArrayBuffer(file);
    } else if (fileName.endsWith('.obj')) {
      reader.onload = (e) => {
        const loader = new OBJLoader();
        const content = new TextDecoder().decode(e.target.result);
        const object = loader.parse(content);
        object.children.forEach(child => {
          child.material = new THREE.MeshStandardMaterial({
            color: 0x7777ff
          });
        });
        this.processLoadedModel(object);
      };
      reader.readAsArrayBuffer(file);
    } else {
      message.error('请上传OBJ或STL格式的模型文件');
    }
  };

  // 处理加载后的模型
  processLoadedModel = (mesh) => {
    // 移除旧模型
    if (this.state.model) {
      this.scene.remove(this.state.model);
    }
    if (this.state.clippedMesh) {
      this.scene.remove(this.state.clippedMesh);
    }

    // 模型缩放和居中
    mesh.scale.set(0.01, 0.01, 0.01);
    mesh.center();
    mesh.name = 'loadedModel';

    // 添加到场景
    this.scene.add(mesh);
    this.setState({ model: mesh });
    message.success('模型加载成功');
  };

  // 执行平面裁剪
  handleClip = () => {
    const { model, plane } = this.state;
    if (!model || !plane) return;

    // 克隆模型用于裁剪显示
    const clonedModel = model.clone();

    // 获取平面参数
    const planeNormal = new THREE.Vector3();
    plane.getWorldDirection(planeNormal);
    const planePosition = new THREE.Vector3();
    plane.getWorldPosition(planePosition);

    // 设置材质裁剪平面
    clonedModel.traverse(child => {
      if (child.isMesh) {
        child.material = child.material.clone();
        child.material.clippingPlanes = [
          new THREE.Plane(planeNormal, -planeNormal.dot(planePosition))
        ];
        child.material.clipShadows = true;
      }
    });

    // 移除旧裁剪模型
    if (this.state.clippedMesh) {
      this.scene.remove(this.state.clippedMesh);
    }

    // 添加裁剪后模型
    this.scene.add(clonedModel);
    this.setState({ clippedMesh: clonedModel });
    message.success('已截取平面上方模型部分');
  };

  render() {
    return (
      <Layout className='layout' style={{ height: '100vh' }}>
        <Header className='layout-header'>
          <MyMenu />
        </Header>
        <Layout>
          {/* 项目面板 */}
          <Sider
            className='layout-project'
            width={this.state.projectWidth}
            style={{ position: 'relative' }}
          >
            <Project />
            <div
              className='drag-bar-right'
              onMouseDown={this.handleProjectResizeBegin}
            ></div>
          </Sider>

          {/* 3D场景区域 */}
          <Content className='layout-scene' style={{ position: 'relative' }}>
            {/* 左上角控制区 */}
            <div style={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 100,
              background: 'rgba(255,255,255,0.8)',
              padding: '10px',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}>
              <Space>
                <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                  <Button icon={<UploadOutlined />} type="primary">
                    选择模型
                  </Button>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".obj,.stl"
                    onChange={this.handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                <Button
                  icon={<PlaneOutlined />}
                  onClick={this.handleClip}
                  disabled={!this.state.model}
                >
                  平面截取
                </Button>
              </Space>
            </div>

            {/* 3D渲染容器 */}
            <div
              ref={this.containerRef}
              style={{ width: '100%', height: '100%' }}
              id="webgl-output"
            />
          </Content>

          {/* 属性面板 */}
          <Sider
            ref={this.propertyRef}
            className='layout-property'
            width={this.state.propertyWidth}
            style={{ position: 'relative' }}
          >
            <div
              className='drag-bar-left'
              onMouseDown={this.handlePropertyResizeBegin}
            ></div>
            <Property />
          </Sider>
        </Layout>
      </Layout>
    );
  }
}

export default connect(
  state => ({
    isProcessing: state.app.isProcessing,
    scene: state.app.scene
  }),
  {
    delCurrentObj,
    setScene
  }
)(App);