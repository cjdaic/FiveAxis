import * as THREE from 'three'
import CommonData from './CommonData'

export default class RectangleData extends CommonData{
  constructor(){
    super()
    this.type = 'rectangle'

    this.data = {
      ...this.data,
      X0 : 0,
      Y0 : 0,
      X1 : 0,
      Y1 : 0,
      
      taper_A_Max : 0,
      taper_B_Max : 0,
      filled : false,
      FeedSpacing_X : 0.1,
      FeedSpacing_Y : 0.1,
      z_start : 0,
      z_end : 0,
      z_interval : 0,
      circle_num_repair : 0,
      times_repair : 0,
      X2 : 0,
      Y2 : 0,
    } 

  }
  genGeometry = () => {
    if(!this.data.filled){
      this.data.X2 = this.data.X1
      this.data.Y2 = this.data.Y1
    }
    const data = this.data
    let Num_of_rectangles_x = Math.abs(data.X1 - data.X2) / data.FeedSpacing_X + 1;//x方向扫描矩形数
    let Num_of_rectangles_y = Math.abs(data.Y1 - data.Y2) / data.FeedSpacing_Y + 1;//y方向扫描矩形数
    let Num_of_rectangles = Num_of_rectangles_x < Num_of_rectangles_y ? Num_of_rectangles_x : Num_of_rectangles_y;//扫描矩形数

    let geometry = new THREE.BufferGeometry();
    const vertices = []
    const indices = []
    const vertex = new THREE.Vector3()
    let vertices2 = new Float32Array( [
      2*data.X0 - data.X1, data.Y1,  0,
      data.X1, data.Y1,  0,
      data.X1, data.Y1,  0,
      data.X1, 2*data.Y0-data.Y1,  0,
      data.X1, 2*data.Y0-data.Y1,  0,
      2*data.X0 - data.X1, 2*data.Y0-data.Y1,  0,
      2*data.X0 - data.X1, 2*data.Y0-data.Y1,  0,
      2*data.X0 - data.X1, data.Y1,  0,
    ] );
    for (let i = 0; i < Num_of_rectangles; i++) {
      let X1 = data.X1 - i * data.FeedSpacing_X
      let Y1 = data.Y1 - i * data.FeedSpacing_Y

      vertex.x = 2*data.X0 - X1
      vertex.y = Y1
      vertex.z = 0
      vertices.push(vertex.x, vertex.y, vertex.z)

      vertex.x = X1
      vertex.y = Y1
      vertex.z = 0
      vertices.push(vertex.x, vertex.y, vertex.z)

      vertex.x = X1
      vertex.y = 2*data.Y0 - Y1
      vertex.z = 0
      vertices.push(vertex.x, vertex.y, vertex.z)

      vertex.x = 2*data.X0 - X1
      vertex.y = 2*data.Y0 - Y1
      vertex.z = 0
      vertices.push(vertex.x, vertex.y, vertex.z)

      indices.push(0 + i*4, 1 + i*4)
      indices.push(1 + i*4, 2 + i*4)
      indices.push(2 + i*4, 3 + i*4)
      indices.push(3 + i*4, 0 + i*4)
      
    }
    geometry.setIndex(indices)
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    geometry.computeBoundingSphere()
    return geometry
  }
}
