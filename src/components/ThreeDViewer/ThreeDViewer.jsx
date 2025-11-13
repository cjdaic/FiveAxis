import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';


const ThreeDViewer = () => {

  const mountRef = useRef(null);
  const modelRef = useRef(null);
  const [status, setStatus] = useState(" OBJ/STL Files...");
  const [gizmoMode, setGizmoMode] = useState('translate');


  const scene = useRef(null);
  const camera = useRef(null);
  const renderer = useRef(null);
  const controls = useRef(null);
  const transformControls = useRef(null);
  const clippingPlane = useRef(null);
  const gizmoPlane = useRef(null);

  //初始化场景
  useEffect(() => {

    scene.current = new THREE.Scene();
    scene.current.background = new THREE.Color(0x222222); // 背景


    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    camera.current = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.current.position.set(5, 5, 5);


    renderer.current = new THREE.WebGLRenderer({ antialias: true });
    renderer.current.setSize(width, height);
    renderer.current.localClippingEnabled = true; // 剪裁
    renderer.current.shadowMap.enabled = true; // 阴影
    mountRef.current.appendChild(renderer.current.domElement);

    // 4. 控制器 (OrbitControls 用于场景交互)
    controls.current = new OrbitControls(camera.current, renderer.current.domElement);
    controls.current.enableDamping = true;

    // 5. 光源
    scene.current.add(new THREE.AmbientLight(0xffffff, 0.6));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    scene.current.add(directionalLight);

    // 6. 初始化 Gizmo 和剪裁平面
    setupClippingGizmo();

    // 7. 动画循环
    const animate = () => {
      requestAnimationFrame(animate);
      controls.current.update(); // 更新控制器
      renderer.current.render(scene.current, camera.current);
    };
    animate();

    // 窗口大小变化处理
    const handleResize = () => {
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      camera.current.aspect = newWidth / newHeight;
      camera.current.updateProjectionMatrix();
      renderer.current.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // 清理函数 (组件卸载时)
    return () => {
      window.removeEventListener('resize', handleResize);
      if (renderer.current) {
        renderer.current.dispose();
        mountRef.current.removeChild(renderer.current.domElement);
      }
    };
  }, []);

  // --- Gizmo 和剪裁平面设置 ---
  const setupClippingGizmo = useCallback(() => {
    // 创建剪裁平面 (默认在 y=0 处)
    clippingPlane.current = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // 法线向上 (Y+), 距离原点 0

    // 注册到渲染器
    renderer.current.clippingPlanes = [clippingPlane.current];

    // 1. 可视化 Gizmo 平面 (半透明网格)
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0x0bffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
      clippingPlanes: [],
      clipShadows: true,
    });
    gizmoPlane.current = new THREE.Mesh(planeGeometry, planeMaterial);
    gizmoPlane.current.rotation.x = -Math.PI / 2; // 默认水平
    gizmoPlane.current.position.y = 0;
    scene.current.add(gizmoPlane.current);

    // 2. 变换控制器 (TransformControls)
    transformControls.current = new TransformControls(camera.current, renderer.current.domElement);
    transformControls.current.attach(gizmoPlane.current);
    transformControls.current.setMode(gizmoMode);
    scene.current.add(transformControls.current);

    // 3. 事件监听：Gizmo 变换时，更新剪裁平面
    transformControls.current.addEventListener('objectChange', () => {
      // 获取 Gizmo 的世界位置和世界法线
      const position = new THREE.Vector3();
      gizmoPlane.current.getWorldPosition(position);

      // Gizmo 的默认法线是局部 Y+ (0, 1, 0)。我们需要将其转换为世界坐标系。
      const normal = new THREE.Vector3(0, 1, 0).applyQuaternion(gizmoPlane.current.getWorldQuaternion(new THREE.Quaternion()));

      // 更新剪裁平面。
      // normal 向量指向被裁剪的部分（本例中是平面下方），保留上方部分。
      clippingPlane.current.set(normal, -normal.dot(position));

      setStatus(`Gizmo 位置: (X:${position.x.toFixed(2)}, Y:${position.y.toFixed(2)}, Z:${position.z.toFixed(2)})`);
    });

    // 4. 解决 Gizmo 和 OrbitControls 冲突
    transformControls.current.addEventListener('dragging-changed', (event) => {
      controls.current.enabled = !event.value;
    });

    // 5. 初始状态提示
    setStatus(`Gizmo 已激活 (模式: ${gizmoMode === 'translate' ? '平移' : '旋转'})。请加载模型。`);

  }, [gizmoMode]);

  // --- 模型加载逻辑 ---
  const loadModel = useCallback((file, loader) => {
    setStatus("正在加载模型...");

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        let geometry;
        // STLLoader 返回 Geometry 或 BufferGeometry
        if (loader instanceof STLLoader) {
          geometry = loader.parse(event.target.result);
        }
        // OBJLoader 返回 Group
        else if (loader instanceof OBJLoader) {
          const group = loader.parse(event.target.result);
          // 假设 OBJ 只有一个网格，或者取第一个
          group.traverse(child => {
            if (child.isMesh) {
              geometry = child.geometry;
            }
          });
          if (!geometry) {
            setStatus("OBJ 文件中未找到有效的网格数据。");
            return;
          }
        }

        // 确保几何体是 BufferGeometry
        if (geometry.isGeometry) {
          geometry = new THREE.BufferGeometry().fromGeometry(geometry);
        }

        // 计算边界框用于居中和缩放
        geometry.computeBoundingBox();

        // 默认材质，用于显示被剪裁的模型
        const material = new THREE.MeshStandardMaterial({
          color: 0x00aaff, // 醒目的蓝色
          metalness: 0.1,
          roughness: 0.5,
          // 关键：将剪裁平面附加到模型的材质上
          clippingPlanes: [clippingPlane.current],
          clipIntersection: false, // 裁剪掉平面法线指向的“下方”，保留上方
          side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // 清除旧模型
        if (modelRef.current) {
          scene.current.remove(modelRef.current);
          modelRef.current.geometry.dispose();
          modelRef.current.material.dispose();
        }

        // 居中和缩放模型
        const box = geometry.boundingBox;
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // 归一化缩放：使最大尺寸约为 5
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5 / maxDim;
        mesh.scale.set(scale, scale, scale);

        // 居中
        mesh.position.sub(center).multiplyScalar(scale);

        modelRef.current = mesh;
        scene.current.add(mesh);

        setStatus(`模型 "${file.name}" 加载成功！Gizmo已激活，拖动它进行截取。`);
      } catch (error) {
        console.error("模型解析失败:", error);
        setStatus("模型解析失败，请检查文件格式。");
      }
    };

    if (file.name.toLowerCase().endsWith('.obj')) {
      reader.readAsText(file); // OBJ 通常是文本
    } else if (file.name.toLowerCase().endsWith('.stl')) {
      reader.readAsArrayBuffer(file); // STL 通常是二进制
    }
  }, []);


  // --- 文件输入处理 ---
  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    let loader;
    if (type === 'obj') {
      loader = new OBJLoader();
    } else if (type === 'stl') {
      loader = new STLLoader();
    }

    if (loader) {
      loadModel(file, loader);
    }
  };

  // --- Gizmo 模式切换 ---
  const toggleGizmoMode = (mode) => {
    setGizmoMode(mode);
    transformControls.current.setMode(mode);
    setStatus(`Gizmo 模式已切换为: ${mode === 'translate' ? '平移' : '旋转'}`);
  };

  // --- 渲染 UI ---
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* 3D 渲染容器 */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* 左上角控制区 */}
      <div className="controls">
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>五轴模型操作台</h3>

        {/* 模型加载 */}
        <div style={{ marginBottom: '15px' }}>
          <label className="file-label file-obj" htmlFor="file-input-obj">💾 加载 OBJ</label>
          <input
            type="file"
            id="file-input-obj"
            accept=".obj"
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange(e, 'obj')}
          />
          <label className="file-label file-stl" htmlFor="file-input-stl">💾 加载 STL</label>
          <input
            type="file"
            id="file-input-stl"
            accept=".stl"
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange(e, 'stl')}
          />
        </div>

        {/* Gizmo 模式切换 */}
        <div style={{ paddingTop: '10px', borderTop: '1px solid #444' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#ccc' }}>Gizmo 模式 (按 T/R 键切换):</p>
          <button
            className={`mode-btn ${gizmoMode === 'translate' ? 'active' : ''}`}
            onClick={() => toggleGizmoMode('translate')}
          >
            平移
          </button>
          <button
            className={`mode-btn ${gizmoMode === 'rotate' ? 'active' : ''}`}
            onClick={() => toggleGizmoMode('rotate')}
          >
            旋转
          </button>
        </div>
      </div>

      {/* 状态栏 */}
      <div className="status">
        {status}
      </div>

      {/* 使用 JSX style 实现样式 (模拟 Tailwind/CSS) */}
      <style jsx="true">{`
                .controls {
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    background: rgba(34, 34, 34, 0.95);
                    padding: 20px;
                    border-radius: 12px;
                    color: white;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                    z-index: 10;
                    min-width: 250px;
                }
                .file-label {
                    display: inline-block;
                    padding: 10px 15px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s;
                    margin-right: 10px;
                    user-select: none;
                    text-align: center;
                }
                .file-obj {
                    background-color: #4CAF50; /* Green */
                }
                .file-obj:hover { background-color: #45a049; }
                
                .file-stl {
                    background-color: #2196F3; /* Blue */
                }
                .file-stl:hover { background-color: #0b7dda; }

                .mode-btn {
                    background-color: #555;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 8px;
                    transition: background-color 0.2s;
                }
                .mode-btn.active {
                    background-color: #ff9800; /* Orange for active */
                    box-shadow: 0 0 10px #ff980088;
                }
                .mode-btn:not(.active):hover {
                    background-color: #666;
                }

                .status {
                    position: absolute;
                    bottom: 20px;
                    left: 20px;
                    color: white;
                    background: rgba(34, 34, 34, 0.9);
                    padding: 10px 15px;
                    border-radius: 8px;
                    z-index: 10;
                    font-size: 0.9rem;
                    max-width: 80%;
                }
            `}</style>
    </div>
  );
};

export default ThreeDViewer