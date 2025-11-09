const { PROCESS_LINE, PROCESS_CIRCLE, SET_LASER_FREQ, PROCESS_RECTANGLE, SET_DELAY, PROCESS_ELLIPSE, PROCESS_RECTANGLE3D } = require('./constant')
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const { ipcMain } = require('electron')

const PROTO_PATH = __dirname + './../protos/five_axis.proto'

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
const process_proto = grpc.loadPackageDefinition(packageDefinition)

ipcMain.handle(PROCESS_LINE, async (event, data) => {
  return new Promise((resolve, reject) => {
    try {
      const client = new process_proto.FiveAxis('localhost:50051', grpc.credentials.createInsecure())
      client.ProcessLine(data, (err, response) => {
        resolve(response)
      })
    } catch (error) {
      reject(error)
    }
  })
})

ipcMain.handle(PROCESS_CIRCLE, async (event, data) => {
  return new Promise((resolve, reject) => {
    try {
      const client = new process_proto.FiveAxis('localhost:50051', grpc.credentials.createInsecure())
      client.ProcessCircle(data, (err, response) => {
        resolve(response)
      })
    } catch (error) {
      reject(error)
    }
  })
})
ipcMain.handle(PROCESS_RECTANGLE, async (event, data) => {
  return new Promise((resolve, reject) => {
    try {
      const client = new process_proto.FiveAxis('localhost:50051', grpc.credentials.createInsecure())
      client.ProcessRectangle(data, (err, response) => {
        resolve(response)
      })
    } catch (error) {
      reject(error)
    }
  })
})

ipcMain.handle(PROCESS_RECTANGLE3D, async (event, data) => {
  return new Promise((resolve, reject) => {
    try {
      const client = new process_proto.FiveAxis('localhost:50051', grpc.credentials.createInsecure())
      client.ProcessRectangle3D(data, (err, response) => {
        resolve(response)
      })
    } catch (error) {
      reject(error)
    }
  })
})


ipcMain.handle(SET_LASER_FREQ, async (event, data) => {
  return new Promise((resolve, reject) => {
    try {
      const client = new process_proto.FiveAxis('localhost:50051', grpc.credentials.createInsecure())
      client.SetLaserFreq(data, (err, response) => {
        resolve(response)
      })
    } catch (error) {
      reject(error)
    }
  })
})

ipcMain.handle(PROCESS_ELLIPSE, async (event, data) => {
  return new Promise((resolve, reject) => {
    try {
      const client = new process_proto.FiveAxis('localhost:50051', grpc.credentials.createInsecure())
      client.ProcessEllipse(data, (err, response) => {
        resolve(response)
      })
    } catch (error) {
      reject(error)
    }
  })
})

ipcMain.handle(SET_DELAY, async (event, data) => {
  return new Promise((resolve, reject) => {
    try {
      const client = new process_proto.FiveAxis('localhost:50051', grpc.credentials.createInsecure())
      client.SetDelay(data, (err, response) => {
        resolve(response)
      })
    } catch (error) {
      reject(error)
    }
  })
})
ipcMain.handle('Test1', async (event, data) => {
  return new Promise((resolve, reject) => {
    try {
      const client = new process_proto.FiveAxis('localhost:50051', grpc.credentials.createInsecure())
      client.Test1(data, (err, response) => {
        resolve(response)
      })
    } catch (error) {
      reject(error)
    }
  })
})
ipcMain.handle('Test2', async (event, data) => {
  return new Promise((resolve, reject) => {
    try {
      const client = new process_proto.FiveAxis('localhost:50051', grpc.credentials.createInsecure())
      client.Test2(data, (err, response) => {
        resolve(response)
      })
    } catch (error) {
      reject(error)
    }
  })
})