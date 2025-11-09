import * as THREE from 'three'
import CommonData from './CommonData'

export default class Rectangle3DData extends CommonData{
  constructor(){
    super()
    this.type = 'rectangle3D'

    this.data = {
      ...this.data,
      X0 : 0,
      Y0 : 0,
      Z0 : 0,
      X1 : 0,
      Y1 : 0,
      Z1 : 0,
      interval : 0,
    } 

  }
  genGeometry = () => {
    if(!this.data.filled){
      this.data.X2 = this.data.X1
      this.data.Y2 = this.data.Y1
    }
    const data = this.data

    let geometry = new THREE.BufferGeometry();
    
    return geometry
  }
}
