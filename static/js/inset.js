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

// // //下面是发送验证码按钮的功能
// // 获取页面元素
// var accountInput = document.getElementById("exampleInputAccount");
// var passwordInput = document.getElementById("exampleInputPassword");
// var confirmPasswordInput = document.getElementById("exampleInputConfirmPassword");
// var bindTypeSelect = document.getElementById("bindType");
// var bindInputContainer = document.getElementById("bindInputContainer");
// var verificationCodeInput = document.getElementById("verificationCode");
// var registerBtn = document.querySelector("button[type=submit]");

// // 监听注册按钮点击事件
// registerBtn.addEventListener("click", function (event) {
//   event.preventDefault(); // 阻止表单默认提交行为

//   // 获取用户输入的信息
//   var account = accountInput.value.trim();
//   var password = passwordInput.value.trim();
//   var confirmPassword = confirmPasswordInput.value.trim();
//   var bindType = bindTypeSelect.value.trim();
//   var bindInput = document.getElementById("bindInput").value.trim();
//   var verificationCode = verificationCodeInput.value.trim();

//   // 表单验证
//   if (account === "" || password === "" || confirmPassword === "" || bindType === "" || bindInput === "" || verificationCode === "") {
//     showToast("请填写完整信息");
//     return;
//   }

//   if (password !== confirmPassword) {
//     showToast("两次输入的密码不一致");
//     return;
//   }

//   // 发送注册请求
// var enrollUrl;
// if (bindType === "phone") {
//   enrollUrl = "/enroll_phone";
// } else if (bindType === "email") {
//   enrollUrl = "/enroll_email";
// }

// fetch(enrollUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       account: account,
//       password: password,
//       bindValue: bindInput, // 修改此处为bindInput的value值
//       verificationCode: verificationCode,
//     }),
//   })

//   .then(function (response) {
//     return response.json(); // 解析响应数据为JSON格式
//   })
//   .then(function (data) {
//     if (data.message === "注册成功！") {
//       showToast("注册成功");
//       setTimeout(function () {
//         window.location.href = '/homepage'; // 页面重定向到主页
//       }, 1000); // 注册成功后1s跳转到首页
//       // 清除表单数据
//       accountInput.value = "";
//       passwordInput.value = "";
//       confirmPasswordInput.value = "";
//       bindTypeSelect.value = "";
//       bindInput.value = "";
//       verificationCodeInput.value = "";
//     } else {
//       showToast(data.detail); // 显示后端返回的错误信息
//     }
//   })
//   .catch(function (error) {
//     console.error(error);
//     showToast("网络错误，请稍后再试");
//   });
// });

// 获取页面元素
var accountInput = document.getElementById("exampleInputAccount");
var passwordInput = document.getElementById("exampleInputPassword");
var confirmPasswordInput = document.getElementById("exampleInputConfirmPassword");
var bindTypeSelect = document.getElementById("bindType");
var bindInputContainer = document.getElementById("bindInputContainer");
var verificationCodeInput = document.getElementById("verificationCode");
var registerBtn = document.querySelector("button[type=submit]");

// 监听注册按钮点击事件
registerBtn.addEventListener("click", function (event) {
  event.preventDefault(); // 阻止表单默认提交行为

  // 获取用户输入的信息
  var account = accountInput.value.trim();
  var password = passwordInput.value.trim();
  var confirmPassword = confirmPasswordInput.value.trim();
  var bindType = bindTypeSelect.value.trim();
  var bindInput = document.getElementById("bindInput").value.trim();
  var verificationCode = verificationCodeInput.value.trim();

  // 表单验证
  if (account === "" || password === "" || confirmPassword === "" || bindType === "" || bindInput === "" || verificationCode === "") {
    showToast("请填写完整信息");
    return;
  }

  if (password.length < 6) {
    showToast("密码必须至少为6位");
    return;
  }

  if (password !== confirmPassword) {
    showToast("两次输入的密码不一致");
    return;
  }

  // 发送注册请求
  if (bindType === "phone") {
    // 弹出提示弹窗
    alert("手机验证码功能还未完成，请绑定邮箱");
    return; // 退出函数，不继续发送请求
  } else if (bindType === "email") {
    var enrollUrl = "/enroll_email";
  } else {
    showToast("请选择绑定类型");
    return; // 退出函数，不继续发送请求
  }

  fetch(enrollUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account: account,
        password: password,
        bindValue: bindInput,
        verificationCode: verificationCode,
      }),
    })
    .then(function (response) {
      if (!response.ok) {
        throw new Error(response.statusText); // 抛出错误，进入 catch 部分进行处理
      }
      return response.json(); // 解析响应数据为JSON格式
    })
    .then(function (data) {
      if (data.message === "注册成功！") {
        showToast("注册成功");
        setTimeout(function () {
          deleteVerifyCode(bindInput);
          window.location.href = '/homepage'; // 页面重定向到主页
        }, 1000); // 注册成功后1s跳转到首页
        // 清除表单数据
        accountInput.value = "";
        passwordInput.value = "";
        confirmPasswordInput.value = "";
        bindTypeSelect.value = "";
        bindInput.value = "";
        verificationCodeInput.value = "";
      } 
      else {
        showToast(data.message);
      }
    })
    .catch(function (error) {
      console.error(error);
      showToast("请稍后再试");
    });
});







// 绑定类型select元素改变时触发的函数
function toggleInput() {
  var bindType = bindTypeSelect.value;
  if (bindType === "phone") {
    bindInputContainer.innerHTML =
      '<label for="bindInput" class="form-label">绑定手机号码</label>' +
      '<input type="text" class="form-control" id="bindInput" placeholder="请输入要绑定的手机号码" />';
  } else if (bindType === "email") {
    bindInputContainer.innerHTML =
      '<label for="bindInput" class="form-label">绑定邮箱地址</label>' +
      '<input type="email" class="form-control" id="bindInput" placeholder="请输入要绑定的邮箱地址" />';
  } else {
    bindInputContainer.innerHTML = "";
  }

  bindInputContainer.style.display = bindType !== "" ? "block" : "none";
}

// 绑定信息输入框输入时触发的函数，用于判断是否启用发送验证码按钮
function toggleVerificationCodeButton() {
  var bindType = bindTypeSelect.value;
  var verificationCodeContainer = document.getElementById("verificationCodeContainer");
  var verificationCodeBtn = document.getElementById("verificationCodeBtn");
  var bindInput = document.getElementById("bindInput");

  if (bindType === "") {
    verificationCodeContainer.style.display = "none"; // 隐藏验证码输入框和发送验证码按钮
  } else {
    verificationCodeContainer.style.display = "block"; // 显示验证码输入框和发送验证码按钮
    verificationCodeBtn.disabled = true; // 发送验证码按钮禁用

    // 监听绑定信息输入框输入事件，判断是否启用发送验证码按钮
    bindInput.addEventListener("input", function () {
      verificationCodeBtn.disabled = bindInput.value.trim() === "";
    });
  }
}

// 发送验证码按钮点击事件
var verificationCodeBtn = document.getElementById("verificationCodeBtn");
verificationCodeBtn.addEventListener("click", function () {
  var bindType = bindTypeSelect.value;
  var bindInput = document.getElementById("bindInput").value.trim();

  // 发送验证码请求
  if (bindType === "phone") {
    // 弹出提示弹窗
    alert("手机验证码功能还未完成");
    return; // 退出函数，不继续发送请求
  } else if (bindType === "email") {
    var sendlUrl = "/send_email";
  } else {
    showToast("请选择绑定类型");
    return; // 退出函数，不继续发送请求
  }
  fetch(sendlUrl,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: bindInput,
      }),
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.code === 1) {
        showToast("验证码发送成功");

        // 倒计时60秒，禁用发送验证码按钮
        var countDown = 60;
        verificationCodeBtn.disabled = true;
        verificationCodeBtn.innerText = countDown + "秒后可重发";

        var timer = setInterval(function () {
          countDown--;
          verificationCodeBtn.innerText = countDown + "秒后可重发";

          if (countDown === 0) {
            clearInterval(timer);
            verificationCodeBtn.disabled = false;
            verificationCodeBtn.innerText = "发送验证码";
          }
        }, 1000);
      } else {
        showToast(data.message);
      }
    })
    .catch(function (error) {
      console.error(error);
      showToast("网络错误，请稍后再试");
    });
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
