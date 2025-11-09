import * as THREE from 'three'
import CommonData from './CommonData'

export default class LineData extends CommonData{
  constructor(){
    super()
    this.data = {
      ...this.data,
      X1: 0,
      Y1: 0,
      Z1: 0,
      A1: 0,
      B1: 0,
      X2: 0,
      Y2: 0,
      Z2: 0,
      A2: 0,
      B2: 0,
    }
    this.type = 'line'
  }
  genGeometry = () => {
    const data = this.data
    let geometry = new THREE.BufferGeometry();
    let vertices = new Float32Array( [
      data.X1, data.Y1,  data.Z1,
      data.X2, data.Y2,  data.Z2,
    ] );
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) )
    return geometry
  }
}
