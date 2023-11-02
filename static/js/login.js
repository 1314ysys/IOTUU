//转换按钮功能
function toggleLoginMode() {
    var loginForm = document.getElementById("loginForm");
    var phoneForm = document.getElementById("phoneForm");
    var emailForm = document.getElementById("emailForm");
    var toggleBtn = document.getElementById("toggleBtn");
    var title = document.querySelector(".form h2"); // 获取登录界面的标题

    if (loginForm.style.display !== "none") {
        loginForm.style.display = "none";
        phoneForm.style.display = "block";
        title.innerHTML = "手机登录"; // 更新标题
    } else if (phoneForm.style.display !== "none") {
        phoneForm.style.display = "none";
        emailForm.style.display = "block";
        title.innerHTML = "邮箱登录"; // 更新标题
    } else {
        emailForm.style.display = "none";
        loginForm.style.display = "block";
        title.innerHTML = "密码登录"; // 更新标题
    }

    toggleBtn.parentElement.classList.toggle("flipped");
}

//顶部弹窗功能
const toast = document.getElementById('toast');

function showToast(message) {
  toast.textContent = message;
  toast.style.opacity = 1;
  toast.style.visibility = 'visible';

  setTimeout(function() {
    toast.style.opacity = 0;
    toast.style.visibility = 'hidden';
  }, 3000);
}

//返回账号登录界面
function showLoginForm() {
    var loginForm = document.getElementById("loginForm");
    var phoneForm = document.getElementById("phoneForm");
    var emailForm = document.getElementById("emailForm");
    var title = document.querySelector(".form h2"); // 获取登录界面的标题

    loginForm.style.display = "block";
    phoneForm.style.display = "none";
    emailForm.style.display = "none"; // 隐藏邮箱登录表单
    title.innerHTML = "密码登录"; // 更新标题
}
//手机验证码登录功能
function sendVerificationCode() {
    var remainingTime = 0; // 剩余时间（秒）
    var timer; // 定时器对象
    var phoneInput = document.querySelector("#phoneForm input[type='text'][placeholder='手机号码']");
    var phoneNum = phoneInput.value.trim();

    if (!/^1\d{10}$/.test(phoneNum)) { // 检查手机号码格式是否正确
        alert("请输入正确的手机号码！");
        return;
    }

    // 调用后端接口发送验证码，这里只模拟发送成功与失败的情况
    var success = Math.random() < 0.5;

    if (success) { // 发送成功
        alert("验证码已发送，请注意查收！");
        remainingTime = 30; // 设置倒计时初始值
        updateSendBtnStatus(); // 更新 “发送验证码” 按钮状态
        timer = setInterval(countdown, 1000); // 开始倒计时
    } else { // 发送失败
        alert("验证码发送失败，请稍后重试！");
    }


function updateSendBtnStatus() {
    var sendCodeBtn = document.getElementById("sendCodeBtn");

    if (remainingTime > 0) { // 倒计时中
        sendCodeBtn.disabled = true;
        sendCodeBtn.textContent = remainingTime + " 秒后可重发";
    } else { // 倒计时结束
        sendCodeBtn.disabled = false;
        sendCodeBtn.textContent = "发送验证码";
    }
}

function countdown() {
    remainingTime--;

    if (remainingTime <= 0) {
        clearInterval(timer);
        timer = null;
    }

    updateSendBtnStatus();
}
}

//邮箱验证码登录
function sendSMTPCode() {
    var remainingTime = 0; // 剩余时间（秒）
    var timer; // 定时器对象
    var emailInput = document.getElementById("emailInput");
    var email = emailInput.value.trim();

    if (!validateEmail(email)) { // 检查邮箱格式是否有效
        showToast("请输入有效的邮箱地址！");
        return;
    }

    // 假设发送验证码成功
    sendVerificationCodeToEmail(email);


function validateEmail(email) {
    // 使用正则表达式验证邮箱格式
    var reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    return reg.test(email);
}

async function sendVerificationCodeToEmail(email) {
    /*邮箱发送验证码*/
    const response = await fetch('/send_email', { // 这里路径为 '/send_email' 仅为示例，请根据实际情况修改
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email}) // 修改为邮箱号码
    });
    const result = await response.json();

    if (response.ok) {
        showToast(result.message);
        remainingTime = 30; // 设置倒计时初始值
        updateSendBtnStatus1(); // 更新 “发送验证码” 按钮状态
        timer = setInterval(countdown, 1000); // 开始倒计时
    } else {
        showToast('邮件发送失败，请稍后重试！');
    }
}

function updateSendBtnStatus1() {
    var sendCodeBtn = document.getElementById("threeCodeBtn");

    if (remainingTime > 0) { // 倒计时中
        sendCodeBtn.disabled = true;
        sendCodeBtn.textContent = remainingTime + " 秒后可重发";
    } else { // 倒计时结束
        sendCodeBtn.disabled = false;
        sendCodeBtn.textContent = "发送验证码";
    }
}

function countdown() {
    remainingTime--;

    if (remainingTime <= 0) {
        clearInterval(timer);
        timer = null;
    }

    updateSendBtnStatus1();
}
}

/*找回按钮*/
function showAlert() {
    alert("请通过邮箱或手机验证码登录成功后在个人信息界面修改密码");
  }


// 密码登录按钮功能
const login = document.getElementById('loginForm');
login.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(login);
  const username = formData.get('username'); // 获取账号
  const password = formData.get('password'); // 获取密码
  const response = await fetch('/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username, password}) // 修改为发送用户名和密码
  });

  if (response.ok) {
    showToast('密码登录成功！');
    window.location.href = '/homepage'; // 页面重定向到主页
  } else {
    showToast('登录失败，请检查账号或密码！');
    console.error(await response.text());
  }
});

/* 邮箱登录按钮功能 */
const email_login = document.getElementById('emailForm');
email_login.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(email_login);
  const email = formData.get('emailnumber'); // 修改为获取邮箱字段的值
  const code = formData.get('verificationcode'); // 修改为获取验证码字段的值

  // 检查邮箱和验证码是否为空
  if (!email || !code) {
    showToast('请输入邮箱地址和验证码');
    return;
  }

  const response = await fetch('/verify_email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }), // 修改为发送邮箱和验证码
  });
  if (response.redirected) {
    showToast('邮箱登录成功！');
    // 发生重定向，跳转到重定向的URL
    deleteVerifyCode(email);
    window.location.href = response.url;
  } else {
    const result = await response.json();
    if (response.status === 400 && result.detail === '无效验证码') {
      showToast('验证码错误');
    } else if (response.status === 400 && result.detail === '验证码已过期') {
      showToast('验证码已过期');
    } else if (response.status === 400 && result.detail === '该邮箱未注册，请先注册') {
      showToast('该邮箱未注册，请先注册');
    }
    else {
      showToast('该邮箱未注册，请先注册！');
      console.error(result.detail);
    }
  }
});

function deleteVerifyCode(email) {
  fetch('/del_verify_code', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
      // 处理删除成功后的逻辑
    })
    .catch(error => {
      console.error('删除验证码数据失败:', error);
      // 处理删除失败后的逻辑
    });
}






  