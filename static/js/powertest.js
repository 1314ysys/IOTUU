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
                <li><a style="font-size: small;" class="dropdown-item" href="#">设备关机</a></li>
                <li><a style="font-size: small;" class="dropdown-item" href="#">设备重启</a></li>
                <li><a style="font-size: small;" class="dropdown-item" href="#">在线编程固件</a></li>
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
  
  function deleteDevice(deviceId) {
    const divId = deviceId;
    const deviceElement = document.getElementById(divId);
  
    if (deviceElement) {
      deviceElement.remove();
    }
  }
  
  // 调用示例
  const deviceData = {
    macid: '00-1C-3B-AF-64-7C',
    devicename: 'ESP01S测试',
    zhuangtai: '离线',
    diqu: '上海',
    chuanganqi: 'LED灯',
    yichang: '运行正常'
  };
  
  createDeviceElement(deviceData);
  