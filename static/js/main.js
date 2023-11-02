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

const toast = document.getElementById('toast');

function showToast(message) {
  toast.innerHTML = message;
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


//确认用户是否退出
function logout() {
  if (confirm("确定要退出吗？")) {
      window.location.href = "/logout";
  } else {
      // 取消退出操作，不执行任何操作
  }
}


