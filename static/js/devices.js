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
      getDevicesDetails();//获取最新的设备详情
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

// 创建一个集合用于存储已显示的设备名称
const displayedDeviceNames = new Set();

// 获取设备详情数据并解析显示
async function getDevicesDetails() {
  //按钮动画
  var refreshButton = document.querySelector('.rotate-button'); // 获取刷新按钮
  //refreshButton.classList.add('rotate-anim'); // 添加动画类

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
  //refreshButton.classList.remove('rotate-anim'); // 移除动画类，恢复初始状态
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
          <a href="#" id="detail-link" class="btn btn-primary custom-btn" onclick="handleDetailClick('${divId}')">详情</a>
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
  
//查看设备详情
function handleDetailClick(divId) {
  // 获取用户ID和MAC地址
  const userId = document.getElementById("accountID").innerText.replace("你好！", "");
  const macAddress = document.getElementById(`${divId}_macid`).innerText.trim();

  // 将用户ID和MAC地址写入Cookie
  //document.cookie = 'userId=' + userId;
  document.cookie = 'macAddress=' + macAddress;

  // 跳转到另一个页面
  window.location.href = '/deviceINFO';
}


//删除设备部分
async function deleteDevice(deviceId) {
  const divId = deviceId;
  const deviceElement = document.getElementById(divId);
  const deviceNameElement = document.getElementById(`${deviceId}_devicename`);
  const userName = document.getElementById("accountID").innerText.replace("你好！", ""); // 获取用户名

  if (deviceElement) {
    // 弹出确认框
    const confirmed = confirm("确定要删除该设备吗？");
    
    if (confirmed) {
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
          showToast(data.message);
        } else {
          throw new Error('删除设备失败');
        }
      } catch (error) {
        console.error('删除设备失败:', error);
      }
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