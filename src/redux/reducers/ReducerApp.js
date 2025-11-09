import {DEL_CURRENT_OBJ, SET_CURRENT_OBJ, SET_PROCESSING, SET_SCENE, UPDATE_OBJ} from '../constant'
import * as THREE from 'three'

const initState = {
  scene: null,
  currentObj: null,
  isProcessing: false,
  currentObjData: null,
}
export default function ReducerApp(preState=initState, action){
  const {type, data} = action
  switch (type) {
    case SET_SCENE:
      return {...initState, scene:data}

    case SET_CURRENT_OBJ:{
      
      const material_red = new THREE.MeshBasicMaterial( { color: 0xff0000} )
      const material_blue = new THREE.MeshBasicMaterial( { color: 0x0000ff} )
      let {currentObj} = preState
      let currentObjData = null
      if(currentObj !== null && currentObj !== undefined){
        currentObj.material = material_blue
        
      }
      data.material = material_red
      currentObjData = {...data.userData}
      return {...preState, currentObj:data, currentObjData }
    }
      

    case UPDATE_OBJ:{
      let currentObjData = null
      if(data !== null && data !== undefined){
        const {userData} = data
        data.geometry = userData.genGeometry()
        currentObjData = {...data.userData}
      }
      return {...preState, currentObj: data, currentObjData}
    }
      

    case DEL_CURRENT_OBJ:{
      let {scene, currentObj} = preState
      scene.remove(currentObj)
      return {...preState, currentObj:null, currentObjData: null}
    }
      
      
    case SET_PROCESSING:
      return {...preState, isProcessing:data}
  
    default:
      return preState
  }
}