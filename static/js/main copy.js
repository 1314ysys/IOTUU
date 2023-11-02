//页面加载完成执行的内容
window.addEventListener('load', function() {
  const pElement = document.getElementById('accountID');
  const username = getCookieValue('username');
  if (username) {
    // 检查是否为数字
    const parsedUsername = isNaN(username) ? username.slice(1, -1) : username;

    pElement.textContent = '你好！' + parsedUsername;
  } else {
    pElement.textContent = '你好！';
  }
  getDevicesDetails();//这里获取最新的设备
});

function getCookieValue(cookieName) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(cookieName + '=')) {
      const value = decodeURIComponent(cookie.substring(cookieName.length + 1));
      return value;
    }
  }
  return null;
}


//顶部消息弹窗的功能
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



//控制弹窗的功能
var sidebar = document.getElementById('sidebar');
var content = document.getElementById('content');
var sidebarToggle = document.getElementById('sidebarToggle');
//调整左边控制面板图标的亮度
// 获取具有“left-font”类的所有元素
const buttons = document.getElementsByClassName('left-font');

// 为每个按钮添加鼠标移入和移出事件的监听器
Array.from(buttons).forEach(function(button) {
  button.addEventListener('mouseover', function() {
    button.style.filter = 'brightness(1.5)';
  });

  button.addEventListener('mouseout', function() {
    button.style.filter = 'brightness(0.8)';
  });
});

// 页面加载时判断是否需要隐藏控制面板
if (window.innerWidth < 992) {
  sidebar.style.display = 'none';
  content.classList.remove('col-md-9');
  content.classList.add('col-md-12');
}

// 监听窗口大小变化事件，根据当前宽度调整布局
window.addEventListener('resize', function () {
  if (window.innerWidth < 992) {
    sidebar.style.display = 'none';
    content.classList.remove('col-md-9');
    content.classList.add('col-md-12');
  } else {
    sidebar.style.display = 'block';
    content.classList.remove('col-md-12');
    content.classList.add('col-md-9');
  }
});

// 点击按钮弹出/隐藏控制面板
sidebarToggle.addEventListener('click', function () {
  if (sidebar.style.display === 'none') {
    sidebar.style.display = 'block';
    content.classList.remove('col-md-12');
    content.classList.add('col-md-9');
  } else {
    sidebar.style.display = 'none';
    content.classList.remove('col-md-9');
    content.classList.add('col-md-12');
  }
});


//下面是饼状图后端更新数据的代码
//概览-设备在线情况
var ctx = document.getElementById('Devie-Total').getContext('2d');

var total = 5;                        // 总资源数
var used = 1;                          // 已使用资源数
var unused = total - used;              // 未使用资源数

var data = {
  labels: ['当前在线设备', '所有接入设备'],
  datasets: [{
    data: [used, unused],
    backgroundColor: ['#3b82ec', '#f2f4f7']
  }]
};

var options = {
  title: {
    display: true,
    text: '设备在线情况（' + used + '/' + total+ ')'
  }
};

var myPieChart = new Chart(ctx, {
  type: 'pie',
  data: data,
  options: options
});

var deviceInfoElement = document.getElementById('device-info');
deviceInfoElement.innerText = '当前设备数：' + used + ' / 总设备数：' + total;

//概览-存储占用情况
var ctx = document.getElementById('Data-Total').getContext('2d');

var total = 8192;                        // 总资源数
var used = 475.2;                          // 已使用资源数
var unused = total - used;              // 未使用资源数

var data = {
  labels: ['当前存储占用', '总的存储空间'],
  datasets: [{
    data: [used, unused],
    backgroundColor: ['#3b82ec', '#f2f4f7']
  }]
};

var options = {
  title: {
    display: true,
    text: '存储占用情况（' + used + '/' + total+ ')'
  }
};

var myPieChart = new Chart(ctx, {
  type: 'pie',
  data: data,
  options: options
});

var deviceInfoElement = document.getElementById('data-info');
deviceInfoElement.innerText = '当前存储占用：' + used + 'MB / 总存储空间：' + total+ 'MB';

//概览-流量使用情况
var ctx = document.getElementById('Net-Total').getContext('2d');
var total = 786432;                        // 总资源数
var used = 489319.5;                          // 已使用资源数
var unused = total - used;              // 未使用资源数

var data = {
  labels: ['已使用流量', '网络总流量'],
  datasets: [{
    data: [used, unused],
    backgroundColor: ['#3b82ec', '#f2f4f7']
  }]
};

var options = {
  title: {
    display: true,
    text: '流量使用情况（' + used + '/' + total+ ')'
  }
};

var myPieChart = new Chart(ctx, {
  type: 'pie',
  data: data,
  options: options
});
var deviceInfoElement = document.getElementById('net-info');
deviceInfoElement.innerText = '已使用流量：' + used + 'MB / 网络总流量：' + total + 'MB';

//动态流量折线图实现代码
function generateRandomData() {
  return [
    Math.floor(Math.random() * 100) + 1, // 生成入网流量值，单位为 KB
    Math.floor(Math.random() * 100) + 1 // 生成出网流量值，单位为 KB
  ];
}

var ctx = document.getElementById('NetFly').getContext('2d');
var chartData = {
  labels: [],
  datasets: [{
    label: '入网流量',
    data: [],
    borderColor: 'rgb(75, 192, 192)',
    borderWidth: 2,
    fill: false
  }, {
    label: '出网流量',
    data: [],
    borderColor: 'rgb(255, 99, 132)',
    borderWidth: 2,
    fill: false
  }]
};

var myChart = new Chart(ctx, {
  type: 'line',
  data: chartData,
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value, index, values) {
            return value + ' KB'; // 格式化 Y 轴刻度值为 KB
          }
        }
      }
    }
  }
});

setInterval(function() {
  var now = new Date();
  var timeLabel = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
  chartData.labels.push(timeLabel);
  var data = generateRandomData();
  chartData.datasets[0].data.push(data[0]);
  chartData.datasets[1].data.push(data[1]);
  if (chartData.labels.length > 10) {
    chartData.labels.shift();
    chartData.datasets[0].data.shift();
    chartData.datasets[1].data.shift();
  }
  myChart.update();
}, 2000); // 每2秒更新一次折线图数据

//概览-天梯图显示代码
var ctx = document.getElementById('Tianti').getContext('2d');

var data = {
  labels: ['泉州', '福州', '厦门', '漳州', '龙岩'],
  datasets: [{
    backgroundColor: [
      'rgba(255, 99, 132, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 206, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)'
    ],
    barThickness: 40,
    data: [25, 20, 17, 13, 6]
  }]
};

var options = {
  indexAxis: 'y',
  scales: {
    x: {
      beginAtZero: true
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
};

new Chart(ctx, {
  type: 'bar',
  data: data,
  options: options
});

//实现添加设备
function addDeviceName() {
  // 获取新的设备名称和设备 SN 码以及用户 ID
  var newDeviceName = prompt("请输入新的设备名称");
  if (!newDeviceName) {
    alert("请输入设备名称");
    return;
  }
  var newDeviceSN = prompt("请输入新设备的 SN 码");
  if (!newDeviceSN) {
    alert("请输入设备 SN 码");
    return;
  }
  var userID = document.getElementById("accountID").innerText.replace("你好！", ""); // 获取用户名

  // 发送请求到后端 API
  fetch('/Adevice', {
    method: 'POST',
    body: JSON.stringify({
      device_name: newDeviceName,
      device_sn: newDeviceSN,
      user_id: userID,
      is_online: "离线",
      mac_address: "ff-ff-ff-ff-ff-ff",
      sensors: "未激活",
      firmware_version: 1.0,
      region: "未知"
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    // 处理后端返回的数据
    alert(data.message);
    getDevicesDetails()//获取最新的设备详情
  })
  .catch(error => {
    // 处理请求失败的情况
    console.error('Error:', error);
    alert('添加设备失败，请稍后再试');
  });
}





//实现编辑设备名称
function editDeviceName() {
var deviceName = document.getElementById("devicename").innerText;
var newDeviceName = prompt("请输入新的设备名称", deviceName);

if (newDeviceName !== null) {
document.getElementById("devicename").innerText = newDeviceName;
}
}

// //实现左侧的退出登录  
// const logoutBtn = document.getElementById('logout-btn');
  
// logoutBtn.addEventListener('click', event => {
//   fetch('/logout', {
//     method: 'GET'
//   })
//     .then(response => {
//       if (response.ok) {
//         // 请求成功，重定向到登录页面
//         window.location.href = "/login";
//       } else {
//         // 请求失败，处理错误
//         // ...
//       }
//     })
//     .catch(error => {
//       // 处理请求错误
//       // ...
//     });
// });


// 创建一个集合用于存储已显示的设备名称
const displayedDeviceNames = new Set();

// 获取设备详情数据并解析显示
async function getDevicesDetails() {
  //按钮动画
  var refreshButton = document.querySelector('.rotate-button'); // 获取刷新按钮
  refreshButton.classList.add('rotate-anim'); // 添加动画类

  var userID = document.getElementById("accountID").innerText.replace("你好！", ""); // 获取用户名
  const user_name = userID;  // 替换为实际的用户名
  const response = await fetch('/Sdevices', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({
      user_name: user_name
      })
  });
  
  const data = await response.json();
  if (data.devices) {
      const devices = data.devices;
      devices.forEach(device => {
          // 检查设备名称是否已存在于集合中
          if (!displayedDeviceNames.has(device.device_name)) {
              const deviceData = {
                  macid: device.mac_address,
                  devicename: device.device_name,
                  zhuangtai: device.is_online,
                  diqu: device.region,
                  chuanganqi: device.sensors,
                  yichang: "无"
              };
              createDeviceElement(deviceData);
              
              // 将设备名称添加到集合中
              displayedDeviceNames.add(device.device_name);
          }
      });
  } else {
      // 处理错误消息
      console.log(data.message);
  }
  refreshButton.classList.remove('rotate-anim'); // 移除动画类，恢复初始状态
}


//创建设备详情框
  function createDeviceElement(deviceData) {
    // 生成随机的 div id
    const divId = 'device_' + Math.random().toString(36).substr(2, 9);
  
    // 构建设备元素的 HTML 代码
    const deviceElement = `
      <div id="${divId}" style="display: flex;flex-direction:row;height:50px;padding: 10px;font-size: medium;">
        <p style="margin-left: 1vw;cursor: default;" id="${divId}_macid">${deviceData.macid}</p>
        <p style="margin-left: auto;cursor: default;" id="${divId}_devicename">${deviceData.devicename}</p>
        <button style="outline: none;border: none;background-color: transparent;height: 18px;width: 18px;" onclick="editDeviceName('${divId}')">
          <img src="/static/img/编辑.svg" alt="refesh" style="height: 18px;width: 18px;">
        </button>
        <div style="display: flex;flex-direction:row;margin-left: auto;cursor: default;">
          <div style="background-color: ${deviceData.zhuangtai === '在线' ? 'blue' : 'red'};width: 0.8vw;height: 0.8vw;border-radius: 50%;margin-right: 5px;margin-top: 0.3vw;"></div>
          <p id="${divId}_zhuangtai">${deviceData.zhuangtai}</p>
        </div>
        <p style="margin-left: auto;cursor: default;" id="${divId}_diqu">${deviceData.diqu}</p>
        <p style="margin-left: auto;cursor: default;" id="${divId}_chuanganqi">${deviceData.chuanganqi}</p>
        <p style="margin-left: auto;margin-right: 16vw;cursor: default;" id="${divId}_yichang">${deviceData.yichang}</p>
  
        <div class="custom-btn-container">
          <div style="display: flex;flex-direction: row;">
            <a  href="#" class="btn btn-primary custom-btn">详情</a>
            <a id="${divId}_delete" href="#" class="btn btn-danger custom-btn" onclick="deleteDevice('${divId}')">删除</a>
            <div class="dropdown">
              <button class="btn btn-secondary dropdown-toggle custom-btn" type="button" id="${divId}_dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                更多
              </button>
              <ul class="dropdown-menu" aria-labelledby="${divId}_dropdownMenuButton">
                <li><a style="font-size: small;" class="dropdown-item" href="#">移动设备分组</a></li>
                <li><a style="font-size: small;" class="dropdown-item" href="#" onclick="shutdownDevice('${divId}')">设备关机</a></li>
                <li><a style="font-size: small;" class="dropdown-item" href="#" onclick="upDevice('${divId}')">设备开机</a></li>
                <li><a style="font-size: small;" class="dropdown-item" href="/updatefirm">在线编程固件</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  
    // 将设备元素插入到 device_list 元素中
    const deviceList = document.getElementById('device_list');
    deviceList.insertAdjacentHTML('beforeend', deviceElement);
  }
  
//删除设备部分
  async function deleteDevice(deviceId) {
    const divId = deviceId;
    const deviceElement = document.getElementById(divId);
    const deviceNameElement = document.getElementById(`${deviceId}_devicename`);
    const userName = document.getElementById("accountID").innerText.replace("你好！", ""); // 获取用户名
  
    if (deviceElement) {
      deviceElement.remove();
      
      // 发送请求到后端接口进行设备删除操作
      try {
        const response = await fetch('/DelDevice', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName,
            deviceName: deviceNameElement.innerText
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(data.message); // 处理后端返回的结果
          showToast(data.message)
        } else {
          throw new Error('删除设备失败');
        }
      } catch (error) {
        console.error('删除设备失败:', error);
      }
    }
  }
  
    
//模拟设备关机
function shutdownDevice(deviceId) {
  const username = document.getElementById("accountID").innerText.replace("你好！", ""); // 获取用户名
  const deviceName = document.getElementById(`${deviceId}_devicename`).innerText;  // 修改获取设备名称的方式
  const firmwareVersion = 0.0;  // 请求值，此处填写合适的值
  const data = {
      username: username,
      device_name: deviceName,
      firmware_version: firmwareVersion
  };

  fetch('/update_firmware', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
      console.log(data.message);  // 输出响应消息
      // 在这里添加其他需要的操作
      showToast(data.message)
  })
  .catch(error => {
      console.error('Error:', error);
  });
}

// 模拟设备开机
function upDevice(deviceId) {
  const username = document.getElementById("accountID").innerText.replace("你好！", ""); // 获取用户名
  const deviceName = document.getElementById(`${deviceId}_devicename`).innerText;  // 修改获取设备名称的方式
  const firmwareVersion = 1.0;  // 请求值，此处填写合适的值
  const data = {
      username: username,
      device_name: deviceName,
      firmware_version: firmwareVersion
  };

  fetch('/update_firmware', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
      console.log(data.message);  // 输出响应消息
      // 在这里添加其他需要的操作
      showToast(data.message)
  })
  .catch(error => {
      console.error('Error:', error);
  });
}

//确认用户是否退出
function logout() {
  if (confirm("确定要退出吗？")) {
      window.location.href = "/logout";
  } else {
      // 取消退出操作，不执行任何操作
  }
}


