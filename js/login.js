// @ts-nocheck
const txtLoginId = document.querySelector('#txtLoginId')
const txtLoginPwd = document.querySelector('#txtLoginPwd')
const login = document.querySelector('#login')

function judgePasword() {
  let flag = true
  const loginPwd = txtLoginPwd.value
  txtLoginPwd.nextElementSibling.innerText = ""
  if (loginPwd === "") {
    txtLoginPwd.nextElementSibling.innerText = '密码不能为空！'
    flag = false
  }
  if (loginPwd.length > 20) {
    txtLoginPwd.nextElementSibling.innerText = '密码长度不能超过20位！'
    flag = false
  }
  return flag
}

function judgeUserName() {
  let flag = true
  const userName = txtLoginId.value.trim()
  txtLoginId.nextElementSibling.innerText = ""
  if (userName === "") {
    txtLoginId.nextElementSibling.innerText = "账号不能为空！"
    flag = false
  }
  if (userName.length > 20) {
    txtLoginId.nextElementSibling.innerText = "账号不超过20位！"
    flag = false
  }
  return flag
}

function judgeForm() {
  return judgeUserName() & judgePasword()
}

async function judgeAccountExits() {
  const result = await myFetch(`/api/user/exists?loginId=${txtLoginId.value}`)
  return result.data.data
}

login.addEventListener('click', async function (e) {
  e.preventDefault()
  if (!judgeForm()) return
  const loginId = txtLoginId.value.trim()
  const loginPwd = txtLoginPwd.value
  const data = {
    loginId,
    loginPwd
  }
  const accountExist = await judgeAccountExits()
  if (!accountExist) {
    alert('账号不存在！请注册！')
    return
  }
  const result = await myFetch('/api/user/login', {
    method: 'post',
    body: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const loginInfo = {
    token: result.headers.get('Authorization')
  }
  localStorage.setItem('loginInfo', JSON.stringify(loginInfo))
  if (result.data.code === 0) {
    alert('登录成功！')
    location.href = doMain + 'login.html'
  } else {
    alert(result.data.msg)
  }
})