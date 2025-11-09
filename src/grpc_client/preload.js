const { contextBridge, ipcRenderer } = require('electron')
const { PROCESS_LINE, PROCESS_CIRCLE, SET_LASER_FREQ, PROCESS_RECTANGLE, SET_DELAY, PROCESS_ELLIPSE, PROCESS_RECTANGLE3D } = require('./constant')

contextBridge.exposeInMainWorld('grpc', {
  processLine: (data) => ipcRenderer.invoke(PROCESS_LINE, data),
  processCircle: (data) => ipcRenderer.invoke(PROCESS_CIRCLE, data),
  processRectangle: (data) => ipcRenderer.invoke(PROCESS_RECTANGLE, data),
  processRectangle3D: (data) => ipcRenderer.invoke(PROCESS_RECTANGLE3D, data),
  setLaserFreq: (data) => ipcRenderer.invoke(SET_LASER_FREQ, data),
  setDelay: (data) => ipcRenderer.invoke(SET_DELAY, data),
  processEllipse: (data) => ipcRenderer.invoke(PROCESS_ELLIPSE, data),

  test1: (data) => ipcRenderer.invoke('Test1', data),
  test2: (data) => ipcRenderer.invoke('Test2', data),
})
