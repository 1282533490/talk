const baseUrl = 'https://study.duyiedu.com'
async function myFetch(path, options) {
  options = options || {}
  options.body = JSON.stringify(options.body)
  let headers = null
  const responseHeader = await fetch(baseUrl + path, {
    ...options
  })
  headers = responseHeader.headers
  const data = await responseHeader.json()
  return { headers, data }
}