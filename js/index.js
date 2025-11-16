// @ts-nocheck
const nickname = document.querySelector('#nickname')
const loginId = document.querySelector('#loginId')
const txtMsg = document.querySelector('#txtMsg')
const chatContainer = document.querySelector('.chat-container')
const button = document.querySelector('.msg-container button')
const close = document.querySelector('.close')

async function init() {
  const result = await verifyLoginInfo()
  if (result.code !== 0) {
    alert(result.msg)
    location.href = '/聊天机器人/MySelf/login.html'
    return
  }
  nickname.innerText = result.data.nickname
  loginId.innerText = result.data.loginId

  getChatInfo()
}

async function getChatInfo() {
  const loginInfo = JSON.parse(localStorage.getItem('loginInfo') || "{}")
  const token = loginInfo.token
  const result = await myFetch('/api/chat/history', {
    headers: {
      'authorization': 'Bearer ' + token
    }
  })
  render(result.data.data)
}

function render(data) {
  data.sort((a, b) => a.createdAt - b.createdAt)
  const htmlStr = data.map(item => {
    const date = parseTimeStamp(item.createdAt)
    if (item.from) {
      return `<div class="chat-item me">
        <img class="chat-avatar" src="./asset/avatar.png" />
        <div class="chat-content">${item.content}</div>
        <div class="chat-date">${date}</div>
      </div>`
    } else {
      return `<div class="chat-item">
        <img class="chat-avatar" src="./asset/robot-avatar.jpg" />
        <div class="chat-content">${item.content}</div>
        <div class="chat-date">${date}</div>
      </div>`
    }
  }).join('')
  chatContainer.innerHTML = htmlStr
}

function parseTimeStamp(timeStamp) {
  const date = new Date(timeStamp)
  const year = (date.getFullYear()).toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = (date.getDate()).toString().padStart(2, '0')
  const hour = (date.getHours()).toString().padStart(2, '0')
  const minute = (date.getMinutes()).toString().padStart(2, '0')
  const second = (date.getSeconds()).toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

async function verifyLoginInfo() {
  const loginInfo = JSON.parse(localStorage.getItem('loginInfo') || "{}")
  const token = loginInfo.token
  const result = await myFetch('/api/user/profile', {
    headers: {
      'authorization': 'Bearer ' + token
    }
  })
  return result.data
}

async function sendChatInfo() {
  const chatInfo = txtMsg.value
  const loginInfo = JSON.parse(localStorage.getItem('loginInfo') || "{}")
  const token = loginInfo.token
  const result = await myFetch('/api/chat', {
    method: 'post',
    body: {
      content: chatInfo
    },
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + token
    }
  })
  if (result.data.code !== 0) {
    alert(result.data.msg)
    location.href = '/聊天机器人/MySelf/login.html'
    return
  }
  const date = parseTimeStamp(new Date())
  chatContainer.innerHTML += `<div class="chat-item me">
      <img class="chat-avatar" src="./asset/avatar.png" />
      <div class="chat-content">${chatInfo}</div>
      <div class="chat-date">${date}</div>
    </div>`
  chatContainer.innerHTML += `<div class="chat-item">
      <img class="chat-avatar" src="./asset/robot-avatar.jpg" />
      <div class="chat-content">${result.data.data.content}</div>
      <div class="chat-date">${parseTimeStamp(result.data.data.createdAt)}</div>
    </div>`
}

function judgeInfo() {
  flag = true
  if (txtMsg.value.trim() === "") {
    alert('消息不能为空')
    txtMsg.value = ""
    flag = false
  }
  return flag
}

button.addEventListener('click', function (e) {
  e.preventDefault()
  if (!judgeInfo()) return false
  sendChatInfo()
  txtMsg.value = ""
})

close.addEventListener('click', function () {
  location.href = '/聊天机器人/MySelf/login.html'
  localStorage.removeItem('loginInfo')
})

init()