import React from 'react';
// 导入 ThreeDViewer 组件
import ThreeDViewer from './components/ThreeDViewer';

// 确保你已经安装并使用了必要的依赖：
// import * as THREE from 'three'; 
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// ... 等等。

function App() {
    return (
        // 使用一个 div 包裹 ThreeDViewer，并确保它占满您希望的空间
        <div style={{
            height: '100vh',  // 100% 视口高度
            width: '100vw',   // 100% 视口宽度
            backgroundColor: '#333' // 可选：设置一个背景色
        }}>
            <ThreeDViewer />
        </div>
    );
}

export default App;