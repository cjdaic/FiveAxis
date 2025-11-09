import { DEL_CURRENT_OBJ, SET_CURRENT_OBJ, SET_PROCESSING, SET_SCENE, UPDATE_OBJ} from "../constant"

export const setScene = data=> ({type:SET_SCENE, data})
export const setCurrentObj = data => ({type:SET_CURRENT_OBJ, data})
export const updateObj = data => ({type:UPDATE_OBJ, data})
export const delCurrentObj = data => ({type:DEL_CURRENT_OBJ, data})
export const setProcessing = data => ({type:SET_PROCESSING, data})