import Papa from 'papaparse'

// 检测字段类型
export function detectFieldType(values) {
  const nonNullValues = values.filter(v => v != null && v !== '')

  if (nonNullValues.length === 0) return 'string'

  // 检查是否为数字
  if (nonNullValues.every(v => !isNaN(Number(v)))) {
    return 'number'
  }

  // 检查是否为日期
  if (nonNullValues.every(v => !isNaN(Date.parse(v)))) {
    return 'date'
  }

  return 'string'
}

// 检测数据字段
export function detectFields(data) {
  if (!data || data.length === 0) return []

  const firstRow = data[0]
  return Object.keys(firstRow).map(key => ({
    name: key,
    type: detectFieldType(data.map(row => row[key]))
  }))
}

// 解析 CSV 文件
export function parseCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const fields = detectFields(results.data)
        resolve({ data: results.data, fields })
      },
      error: reject
    })
  })
}

// 解析 JSON 文件
export function parseJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        const dataArray = Array.isArray(data) ? data : [data]
        const fields = detectFields(dataArray)
        resolve({ data: dataArray, fields })
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}
