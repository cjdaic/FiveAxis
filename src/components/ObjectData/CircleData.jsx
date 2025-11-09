import * as THREE from 'three'
import CommonData from './CommonData'

export default class CircleData extends CommonData{
  constructor(){
    super()
    this.type = 'circle'

    this.data = {
      ...this.data,
      X1 : 0,
      Y1 : 0,
      X2 : 0,
      Y2 : 0,
      M : -1, //-1：顺时针， 1：逆时针
      angle : 360,
      taper : 0,

      // 同心圆
      filled : false,
      r_min : 0.01,
      r_interval : 0.01,
      z_start : 0,
      z_end : 0,
      z_interval : 0,
      circle_num_repair : 0,
      times_repair : 0,
    }

  }
  getRadius = () => {
    return Math.sqrt(Math.pow((this.data.X1-this.data.X2),2) + Math.pow((this.data.Y1-this.data.Y2),2))
  }
  genGeometry = () => {
    if(!this.data.filled){
      this.data.r_min = this.getRadius()
      this.data.circle_num_repair = 0
      this.times_repair = 0
    }
    const data = this.data
    const n_max = 200
    const circle_num = (this.getRadius() - data.r_min)/data.r_interval + 1
    const circle_num_max = circle_num < n_max ? circle_num : n_max
    const r_interval_max = circle_num < n_max ? data.r_interval : (this.getRadius() - data.r_min) / n_max
    const r_min_real = this.getRadius() - (circle_num_max - 1) * r_interval_max
    
    const segments = 36
    let thetaStart = data.X2 !== data.X1 ? Math.atan2(data.Y2-data.Y1, data.X2-data.X1) : 0
    const thetaLength = Math.PI * data.angle / 180
    if(data.M === 2){
      thetaStart -= thetaLength
    }
    const vertices = []
    const indices = []
    const vertex = new THREE.Vector3()

    for(let n = 0; n < circle_num_max; n++){
      const radius = r_min_real + n * r_interval_max
      const offset = n * (segments + 1)
      for ( let s = 0; s <= segments; s ++) {
        if(s !== segments){
          indices.push(offset+s, offset+s+1)
        }

        const segment = thetaStart + s / segments * thetaLength;
        // vertex
        vertex.x = radius * Math.cos( segment ) + data.X1;
        vertex.y = radius * Math.sin( segment ) + data.Y1;
        vertex.z = 0
        vertices.push( vertex.x, vertex.y, vertex.z );
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setIndex(indices)
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    geometry.computeBoundingSphere()

    return geometry
  }
}
