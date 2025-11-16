// @ts-nocheck
const txtLoginId = document.querySelector('#txtLoginId')
const txtNickname = document.querySelector('#txtNickname')
const txtLoginPwd = document.querySelector('#txtLoginPwd')
const txtLoginPwdConfirm = document.querySelector('#txtLoginPwdConfirm')
const register = document.querySelector('#register')

function judgePasword() {
  let flag = true
  const loginPwd = txtLoginPwd.value
  txtLoginPwd.nextElementSibling.innerText = ""
  txtLoginPwdConfirm.nextElementSibling.innerText = ""
  if (loginPwd === "") {
    txtLoginPwd.nextElementSibling.innerText = '密码不能为空！'
    flag = false
  }
  if (loginPwd.length > 20) {
    txtLoginPwd.nextElementSibling.innerText = '密码长度不能超过20位！'
    flag = false
  }
  if (loginPwd !== txtLoginPwdConfirm.value) {
    flag = false
    txtLoginPwd.nextElementSibling.innerText = '两次密码输入不一致！'
    txtLoginPwdConfirm.nextElementSibling.innerText = '两次密码输入不一致！'
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

function judgeNickName() {
  let flag = true
  const nickname = txtNickname.value.trim()
  txtNickname.nextElementSibling.innerText = ""
  if (nickname === "") {
    txtNickname.nextElementSibling.innerText = "昵称不能为空！"
    flag = false
  }
  if (nickname.length > 20) {
    txtNickname.nextElementSibling.innerText = "昵称不超过20位！"
    flag = false
  }
  return flag
}

function judgeForm() {
  return judgeUserName() & judgeNickName() & judgePasword()
}

register.addEventListener('click', async function (e) {
  e.preventDefault()
  if (!judgeForm()) return

  const data = {
    loginId: txtLoginId.value.trim(),
    nickname: txtNickname.value.trim(),
    loginPwd: txtLoginPwd.value
  }
  const result = await myFetch('/api/user/reg', {
    method: 'post',
    body: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (result.data.code === 0) {
    alert('注册成功！')
    location.href = baseUrl + 'login.html'

  } else {
    alert(result.data.msg)
  }
})