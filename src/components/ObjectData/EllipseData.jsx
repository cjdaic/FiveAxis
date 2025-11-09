import * as THREE from 'three'
import CommonData from './CommonData'

export default class EllipseData extends CommonData{
  constructor(){
    super()
    this.type = 'ellipse'

    this.data = {
      ...this.data,
      X0 : 0,
      Y0 : 0,
      a_Max : 0,
      b_Max : 0,
      taper_A_Max : 0,
      taper_B_Max :0 ,

      // 填充
      filled : false,
      a_Min : 0,
      b_Min : 0,
      FeedSpacing_X : 0.01,
      FeedSpacing_Y : 0.01,
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
      this.data.a_Min = this.data.a_Max
      this.data.b_Min = this.data.b_Max
      this.data.circle_num_repair = 0
      this.times_repair = 0
    }

    const data = this.data

    let Num_of_ellipses_x = Math.abs(data.a_Max - data.a_Min) / data.FeedSpacing_X + 1;//x方向扫描椭圆数
    let Num_of_ellipses_y = Math.abs(data.b_Max - data.b_Min) / data.FeedSpacing_Y + 1;//y方向扫描椭圆数
    let Num_of_ellipses = Num_of_ellipses_x < Num_of_ellipses_y ? Num_of_ellipses_x : Num_of_ellipses_y;//扫描矩形数
    let a_Min_Real = data.a_Max - (Num_of_ellipses - 1) * data.FeedSpacing_X;//实际最内椭圆起点X坐标
    let b_Min_Real = data.b_Max - (Num_of_ellipses - 1) * data.FeedSpacing_Y;//实际最内椭圆起点X坐标
    
    const segments = 36
    let thetaStart = 0
    const thetaLength = Math.PI * 360 / 180

    const vertices = []
    const indices = []
    const vertex = new THREE.Vector3()
       
    for(let n = 0; n < Num_of_ellipses; n++){
      const radius_a = a_Min_Real + n * data.FeedSpacing_X
      const radius_b = b_Min_Real + n * data.FeedSpacing_Y
      const offset = n * (segments + 1)
      
      for ( let s = 0; s <= segments; s ++) {
        if(s !== segments){
          indices.push(offset+s, offset+s+1)
        }

        const segment = thetaStart + s / segments * thetaLength;
        // vertex

        vertex.x = radius_a * Math.cos( segment ) + data.X0;
        vertex.y = radius_b * Math.sin( segment ) + data.Y0;
        vertex.z = 0
        console.log(segment) 
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
