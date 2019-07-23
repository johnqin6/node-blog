const fs = require('fs')
const path = require('path')

// promise方式 
function getFileContent(fileName) {
  const promise = new Promise((resolve, reject) => {
    // 文件完整路径
    const fullFileName = path.resolve(__dirname, 'files', fileName)
    console.log(fullFileName)
    fs.readFile(fullFileName, (err, data) => {
      if (err) {
        reject(err)
        return 
      }
      resolve(JSON.parse(data.toString()))
    })
  })
  return promise
}

async function readFileData() {
  try {
    const aData = await getFileContent('a.json')
    console.log('a.json:', aData)
    const bData = await getFileContent(aData.next)
    console.log('b.json:', bData)
    const cData = await getFileContent(bData.next)
    console.log('c.json:', cData)
  } catch (err) {
    console.log(err)
  }
  
}

readFileData()