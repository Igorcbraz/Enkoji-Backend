export function cleanObject (obj) {
  const cleanObj = Object.entries(obj).reduce((a,[k,v]) => (v ? (a[k]=v, a) : a), {})

  for (const [key, value] of Object.entries(cleanObj)) {
    if (Array.isArray(value)) {
      cleanObj[key] = {
        in: value
      }
    }
  }
  
  return cleanObj
}