# -*- coding: utf-8 -*-
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import uvicorn
import socket
import os
import re
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.header import Header
from datetime import datetime
# 有关于API的
from fastapi import HTTPException
from pydantic import BaseModel
from API import *
from pymysql.cursors import DictCursor
from starlette.responses import JSONResponse
from fastapi import Form, Response, Cookie, status
from fastapi.responses import RedirectResponse
import sys

## 硬件部分###
import pexpect
import configparser

config = configparser.ConfigParser()

# try:
#     打包为exe文件请使用以下读取路径
script_path = sys.argv[0]
script_dir = os.path.dirname(script_path)
config_file = os.path.join(script_dir, 'config/config.ini')
with open(config_file, 'r', encoding='utf-8') as f:
    config.read_file(f)
# except:
#     打包为docker镜像请使用以下读取路径
#     with open('config.ini', 'r', encoding='utf-8') as f:
#         config.read_file(f)


#读取硬件配置
network = str(config.get('devices', 'network'))
fqbn = str(config.get('devices', 'fqbn', fallback='esp8266:esp8266:generic'))

'''
pip install fastapi uvicorn
uvicorn main:app --port 8080 --reload
'''

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static") # 挂载静态路由，在本地static文件夹下
templates = Jinja2Templates(directory="templates")

@app.get("/")
async def redirect_to_homepage(login_time: str = Cookie(default=None)):
    # 检查登录状态
    if login_time:
        last_login_time = datetime.fromisoformat(login_time)
        now = datetime.now()
        if (now - last_login_time) < timedelta(minutes=30):
            # 用户在30分钟内登录过，跳转到主页
            return RedirectResponse(url="/homepage", status_code=303)

    # 用户需要进行登录验证，重定向到登录页面
    return RedirectResponse(url="/login", status_code=303)

#主页
@app.get("/homepage")
def homepage(request: Request, login_time: str = Cookie(default=None)):
    # 检查登录状态
    if login_time:
        last_login_time = datetime.fromisoformat(login_time)
        now = datetime.now()
        if (now - last_login_time) < timedelta(minutes=30):
            # 用户在30分钟内登录过，返回主页
            hostname = socket.gethostname()  # 获取主机名
            local_ip = socket.gethostbyname(hostname)  # 获取本地 IP 地址
            return templates.TemplateResponse("main.html", {"request": request, "local_ip": local_ip})

    # 用户需要进行登录验证，重定向到登录页面
    response = RedirectResponse(url="/login", status_code=303)
    return response

#设备控制
@app.get("/devices")
def homepage(request: Request, login_time: str = Cookie(default=None)):
    # 检查登录状态
    if login_time:
        last_login_time = datetime.fromisoformat(login_time)
        now = datetime.now()
        if (now - last_login_time) < timedelta(minutes=30):
            # 用户在30分钟内登录过，返回主页
            hostname = socket.gethostname()  # 获取主机名
            local_ip = socket.gethostbyname(hostname)  # 获取本地 IP 地址
            return templates.TemplateResponse("devices.html", {"request": request, "local_ip": local_ip})

    # 用户需要进行登录验证，重定向到登录页面
    response = RedirectResponse(url="/login", status_code=303)
    return response

#注册界面
@app.get("/enroll", response_class=HTMLResponse)
def enroll(request: Request):
    return templates.TemplateResponse("inset.html", {"request": request})

#用户信息界面
@app.get("/userinfo", response_class=HTMLResponse)
def userinfo(request: Request):
    return templates.TemplateResponse("userinfo.html", {"request": request})

#数据访问界面
@app.get("/datacheck", response_class=HTMLResponse)
def NotFound(request: Request):
    return templates.TemplateResponse("datacheck.html", {"request": request})

#网络界面
@app.get("/network", response_class=HTMLResponse)
def NotFound(request: Request):
    return templates.TemplateResponse("network.html", {"request": request})

#插件商店界面
@app.get("/packstore", response_class=HTMLResponse)
def NotFound(request: Request):
    return templates.TemplateResponse("packstore.html", {"request": request})

#计划任务界面
@app.get("/plantasks", response_class=HTMLResponse)
def NotFound(request: Request):
    return templates.TemplateResponse("plantasks.html", {"request": request})

#面板设置界面
@app.get("/panelset", response_class=HTMLResponse)
def NotFound(request: Request):
    return templates.TemplateResponse("panelset.html", {"request": request})

#上传代码界面
@app.get("/updatefirm", response_class=HTMLResponse)
def updatefirm(request: Request):
    return templates.TemplateResponse("updatefirm.html", {"request": request})

#设备详细信息界面
@app.get("/deviceINFO", response_class=HTMLResponse)
def devieINFO(request: Request):
    return templates.TemplateResponse("deviceINFO.html", {"request": request})

# 忘记密码界面
@app.get("/repassword", response_class=HTMLResponse)
def repassword(request: Request,login_time: str = Cookie(default=None)):
    # 检查登录状态
    if login_time:
        last_login_time = datetime.fromisoformat(login_time)
        now = datetime.now()
        if (now - last_login_time) < timedelta(minutes=30):
            # 用户在30分钟内登录过，跳转到修改密码界面
            return templates.TemplateResponse("repassword.html", {"request": request})
    # 用户需要进行登录验证，返回登录页面
    return templates.TemplateResponse("login.html", {"request": request})

###下面都是API接口###########

#密码登录接口
@app.get("/login", response_class=HTMLResponse)
def loginpage(request: Request, login_time: str = Cookie(default=None)):
    # 检查登录状态
    if login_time:
        last_login_time = datetime.fromisoformat(login_time)
        now = datetime.now()
        if (now - last_login_time) < timedelta(minutes=30):
            # 用户在30分钟内登录过，跳转到主页
            return RedirectResponse(url="/homepage", status_code=303)

    # 用户需要进行登录验证，返回登录页面
    return templates.TemplateResponse("login.html", {"request": request})

#退出登录
@app.get("/logout")
def logout(request: Request):
    # 清除登录状态，例如清除会话数据或更新数据库记录
    response = RedirectResponse(url="/login", status_code=303)
    response.delete_cookie("login_time")
    response.delete_cookie("username")
    return response


#以下是发送邮件验证码的接口
class EmailRequest(BaseModel):#定义模型
    email: str
@app.post("/send_email")
def send_email_endpoint(request: EmailRequest):
    try:
        verification_code = generate_verification_code()
        send_email(request.email,verification_code)#发送邮件
        insert_verification_code(request.email, verification_code)#存放临时验证码
        return {"message": "邮件发送成功！","code":"%s"%verification_code}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))





#以下是密码登录验证接口
# 定义输入数据模型
class UserLogin(BaseModel):
    username: str
    password: str
# 登录接口
@app.post("/login")
def login(user_login: UserLogin):
    # 查询数据库检查账号密码是否匹配
    connection = connect() # 连接到数据库
    result = check_username(connection, 'users', user_login.username)
    if result and str(result[1]) == user_login.password:
        # 账号密码匹配，保存登录时间和用户名，并重定向到主页
        response = RedirectResponse(url="/homepage", status_code=303) # 303表示重定向
        response.set_cookie("login_time", value=str(datetime.now()), max_age=1800) # 设置登录时间的cookie，有效期为30分钟
        response.set_cookie("username", value=user_login.username, max_age=1800) # 设置用户名的cookie，有效期为30分钟
        return response
    else:
        # 账号密码不匹配，返回错误信息
        raise HTTPException(status_code=401, detail='账号或密码错误')



# 邮箱验证码登录
class VerificationRequest(BaseModel):
    email: str
    code: str

@app.post("/verify_email")
def verify_email_endpoint(request: VerificationRequest):
    try:
        email = request.email
        code = request.code
        print(email)
        print(code)
        # 检查用户表中是否存在指定邮箱的用户
        conn = connect()
        cursor = conn.cursor()
        sql_select_user = "SELECT * FROM users WHERE email=%s"
        cursor.execute(sql_select_user, (email,))
        user_result = cursor.fetchone()
        if not user_result:
            raise HTTPException(status_code=400, detail="该邮箱未注册，请先注册")
        # 查询数据库中是否存在符合条件的验证记录
        sql_select_code = "SELECT send_time FROM verification_codes WHERE email=%s AND code=%s"
        cursor.execute(sql_select_code, (request.email, code))
        code_result = cursor.fetchone()
        cursor.close()
        conn.close()
        if not code_result:
            raise HTTPException(status_code=400, detail="无效验证码")
        # 检查验证码是否过期
        send_time_str = str(code_result[0])
        expiration_time = datetime.strptime(send_time_str, '%Y-%m-%d %H:%M:%S') + timedelta(minutes=10)
        now = datetime.now()
        if now > expiration_time:
            raise HTTPException(status_code=400, detail="验证码已过期")
        # 账号密码匹配，保存登录时间，并重定向到主页
        response = RedirectResponse(url="/homepage", status_code=303)
        response.set_cookie("login_time", str(datetime.now()), max_age=1800)
        response.set_cookie("username", str(request.email), max_age=1800)
        return response
    except HTTPException as e:
        raise e 
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




#邮箱注册按钮

class EnrollEmailRequest(BaseModel):
    bindValue: str
    verificationCode: str
    account: str
    password: str

@app.post("/enroll_email")
def enroll_email_endpoint(request: EnrollEmailRequest):
    try:
        email = request.bindValue
        code = request.verificationCode
        account = request.account
        password = request.password
        print("发送邮箱"+email)
        print("验证码"+code)
        print("注册账号"+account)
        print("注册密码"+password)
        # 查询数据库中是否存在用户名或邮箱
        conn = connect()
        cursor = conn.cursor()
        sql_select_username = "SELECT username FROM users WHERE username=%s"
        cursor.execute(sql_select_username, (account,))
        result_username = cursor.fetchone()
        if result_username is not None:
            cursor.close()
            conn.close()
            print("用户存在")
            return {"message": "用户名已存在"}
        sql_select_email = "SELECT email FROM users WHERE email=%s"
        cursor.execute(sql_select_email, (email,))
        result_email = cursor.fetchone()
        if result_email is not None:
            cursor.close()
            conn.close()
            print("邮箱锁定")
            return {"message": "邮箱已被绑定"}
        # 查询数据库中是否存在符合条件的验证码记录
        sql_select_code = "SELECT send_time FROM verification_codes WHERE email=%s AND code=%s"
        cursor.execute(sql_select_code, (email, code))
        result_code = cursor.fetchone()
        # 如果查询结果为空，返回错误信息
        if result_code is None:
            cursor.close()
            conn.close()
            print("无效验证")
            return {"message": "无效验证码"}
        # 检查验证码是否过期
        send_time_str = str(result_code[0])
        expiration_time = datetime.strptime(send_time_str, '%Y-%m-%d %H:%M:%S') + timedelta(minutes=10)
        now = datetime.now()
        if now > expiration_time:
            cursor.close()
            conn.close()
            print("验证过期")
            return {"message": "验证码已过期"}
        # 插入用户信息到数据库
        values_dict = {
            "username": account,
            "password": password,
            "email": email
        }
        insert_values(conn, "users", values_dict)
        cursor.close()
        conn.close()
        return {"message": "注册成功！"}
    except Exception as e:
        # 返回错误信息
        return {"message": str(e)}





# 定义输入数据模型
class UpdatePassword(BaseModel):
    account_name: str
    new_password: str

# 更新密码的接口
@app.post('/update_password')
async def update_password(data: UpdatePassword):
    try:
        # 查询数据库检查账号密码是否匹配
        connection = connect()  # 连接到数据库
        cursor = connection.cursor()
        # 筛选账号名类型
        email_regex = r"[^@]+@[^@]+\.[^@]+"  # 邮箱地址匹配正则表达式
        phone_regex = r"1[3-9]\d{9}"  # 手机号码匹配正则表达式
        if re.match(email_regex, data.account_name):
            update_query = "UPDATE users SET password = %s WHERE email = %s"
        elif re.match(phone_regex, data.account_name):
            update_query = "UPDATE users SET password = %s WHERE phone_number = %s"
        else:
            update_query = "UPDATE users SET password = %s WHERE username = %s"
        # 执行更新操作
        cursor.execute(update_query, (data.new_password, data.account_name))
        connection.commit()
        # 关闭游标和数据库连接
        cursor.close()
        connection.close()
        print("密码更新成功！")
        return {'message': '密码更新成功'}
    except Exception as e:
        print(f"密码更新失败！{e}")
        return {'message': f'密码更新失败: {e}'}


#添加设备接口
class Device(BaseModel):
    device_name: str
    device_sn: str
    user_id: str
    is_online: str
    mac_address: str
    sensors: str
    firmware_version: float
    region: str

@app.post('/Adevice')
async def add_device(device: Device):
    try:
        # 连接到数据库
        connection = connect()
        cursor = connection.cursor()
        # 获取用户 ID
        account_name = device.user_id
        if re.match(r'^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$', account_name):
            get_user_query = "SELECT user_id FROM users WHERE email = %s"
        elif re.match(r'^1[3456789]\d{9}$', account_name):
            get_user_query = "SELECT user_id FROM users WHERE phone_number = %s"
        else:
            get_user_query = "SELECT user_id FROM users WHERE username = %s"
        cursor.execute(get_user_query, (account_name,))
        user_id = cursor.fetchone()
        if not user_id:
            return {'message': '用户不存在'}
        # 添加设备到devices表
        add_device_query = """
            INSERT INTO devices (user_id, device_name, is_online, mac_address, sensors, firmware_version, region, device_sn)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        device_values = (
            user_id[0], device.device_name, device.is_online, device.mac_address,
            device.sensors, device.firmware_version, device.region, device.device_sn
        )
        cursor.execute(add_device_query, device_values)
        connection.commit()
        # 关闭游标和数据库连接
        cursor.close()
        connection.close()
        return {'message': '设备添加成功'}
    except Exception as e:
        print(f"设备添加失败！{e}")
        return {'message': f'设备添加失败: {e}'}


# 查询用户信息接口
class UserInfoRequest(BaseModel):
    accountid: str

class UserInfoResponse(BaseModel):
    username: str
    email: str

@app.post('/get_userinfo', response_model=UserInfoResponse)
async def get_userinfo(request: UserInfoRequest):
    accountid = request.accountid
    # 连接到数据库
    connection = connect()
    cursor = connection.cursor()
    # 执行查询语句
    if re.match(r'^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$', accountid):
        get_user_query = "SELECT username, email FROM users WHERE email = %s"
    else:
        get_user_query = "SELECT username, email FROM users WHERE username = %s"
    cursor.execute(get_user_query, (accountid,))
    user_info = cursor.fetchone()
    cursor.close()
    if user_info:
        # 返回查询结果
        return {
            'username': user_info[0],
            'email': user_info[1],
        }
    else:
        # 如果查询结果为空，抛出异常返回错误提示
        raise HTTPException(status_code=404, detail='User not found')



# 获取设备详情界面信息
class DeviceInfoRequest(BaseModel):
    user_name: str
    mac_address: str

@app.post('/get_device_info')
async def get_device_info(request: DeviceInfoRequest):
    try:
        # 连接到数据库
        connection = connect()
        cursor = connection.cursor()
        # Extract fields from the request
        user_name = request.user_name
        mac_address = request.mac_address
        # 根据用户名查询用户ID
        if re.match(r'^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$', user_name):
            get_user_query = "SELECT user_id FROM users WHERE email = %s"
        elif re.match(r'^1[3456789]\d{9}$', user_name):
            get_user_query = "SELECT user_id FROM users WHERE phone_number = %s"
        else:
            get_user_query = "SELECT user_id FROM users WHERE username = %s"
        cursor.execute(get_user_query, (user_name,))
        user_id_res = cursor.fetchone()
        if not user_id_res:
            return {'message': '用户不存在'}
        user_id = user_id_res[0]
        # 使用用户ID查询设备信息
        get_device_info_query = "SELECT * FROM devices WHERE user_id = %s AND mac_address = %s"
        cursor.execute(get_device_info_query, (user_id, mac_address,))
        device_info = cursor.fetchone()
        if not device_info:
            return {'message': 'No device found for the provided user id and mac address.'}
        # Prepare the response
        response = {
            "user_name": request.user_name,
            "device_name": device_info[2],
            "device_sn": device_info[8],
            "is_online": device_info[3],
            "mac_address": device_info[4],
            "sensors": device_info[5],
            "firmware_version": device_info[6],
            "region": device_info[7]
        }
        # Close the cursor and the database connection
        cursor.close()
        connection.close()
        return response
    except Exception as e:
        print(f"Fetching device info failed: {e}")
        return {'message': f'Fetching device info failed: {e}'}


#查询所有设备
class GetDevicesRequest(BaseModel):
    user_name: str

@app.post('/Sdevices')
async def get_devices(request: GetDevicesRequest):
    try:
        # 连接到数据库
        connection = connect()
        cursor = connection.cursor()
        user_name = request.user_name
        # 获取用户 ID
        if re.match(r'^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$', user_name):
            get_user_query = "SELECT user_id FROM users WHERE email = %s"
        elif re.match(r'^1[3456789]\d{9}$', user_name):
            get_user_query = "SELECT user_id FROM users WHERE phone_number = %s"
        else:
            get_user_query = "SELECT user_id FROM users WHERE username = %s"
        cursor.execute(get_user_query, (user_name,))
        user_id = cursor.fetchone()
        if not user_id:
            return {'message': '用户不存在'}
        # 查询用户的设备
        get_devices_query = "SELECT * FROM devices WHERE user_id = %s"
        cursor.execute(get_devices_query, (user_id[0],))
        devices = []
        for device in cursor.fetchall():
            devices.append({
                "device_name": device[2],
                "device_sn": device[8],
                "is_online": device[3],
                "mac_address": device[4],
                "sensors": device[5],
                "firmware_version": device[6],
                "region": device[7]
            })
        # 关闭游标和数据库连接
        cursor.close()
        connection.close()
        return {'devices': devices}
    except Exception as e:
        print(f"获取设备失败！{e}")
        return {'message': f'获取设备失败: {e}'}

#删除设备
class DeleteDeviceRequest(BaseModel):
    userName: str
    deviceName: str

@app.delete('/DelDevice')
async def delete_device(request: DeleteDeviceRequest):
    try:
        # 连接到数据库
        connection = connect()
        cursor = connection.cursor()
        # 根据用户名查询用户ID
        user_name = request.userName
        # 获取用户 ID
        if re.match(r'^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$', user_name):
            get_user_query = "SELECT user_id FROM users WHERE email = %s"
        elif re.match(r'^1[3456789]\d{9}$', user_name):
            get_user_query = "SELECT user_id FROM users WHERE phone_number = %s"
        else:
            get_user_query = "SELECT user_id FROM users WHERE username = %s"
        cursor.execute(get_user_query, (user_name,))
        user_id = cursor.fetchone()
        if not user_id:
            raise HTTPException(status_code=404, detail='用户不存在')
        
        # 根据设备名和用户ID删除设备
        device_name = request.deviceName
        delete_device_query = "DELETE FROM devices WHERE user_id = %s AND device_name = %s"
        cursor.execute(delete_device_query, (user_id[0], device_name))
        
        # 提交事务并关闭数据库连接
        connection.commit()
        cursor.close()
        connection.close()
        
        return {'message': '设备删除成功'}
    except Exception as e:
        print(f"删除设备失败！{e}")
        raise HTTPException(status_code=500, detail='设备删除失败')

#删除临时验证码
class DeleteVerifyCodeRequest(BaseModel):
    email: str
@app.delete('/del_verify_code')
async def delete_verify_code(request: DeleteVerifyCodeRequest):
    try:
        # 连接到数据库
        connection = connect()
        cursor = connection.cursor()

        # 删除指定邮箱地址的所有数据
        delete_verify_code_query = "DELETE FROM verification_codes WHERE email = %s"
        cursor.execute(delete_verify_code_query, (request.email,))

        # 提交事务并关闭数据库连接
        connection.commit()
        cursor.close()
        connection.close()

        return {'message': '验证码数据删除成功'}
    except Exception as e:
        print(f"删除验证码数据失败！{e}")
        raise HTTPException(status_code=500, detail='验证码数据删除失败')



###下面是硬件部分的接口##################
@app.get('/hash')
async def get_devices(username: str, sncode: str):
    try:
        # 连接到数据库
        connection = connect()
        cursor = connection.cursor()
        # 获取用户 ID
        get_user_query = "SELECT user_id FROM users WHERE username = %s"
        cursor.execute(get_user_query, (username,))
        user_id = cursor.fetchone()
        if not user_id:
            return {'message': '用户不存在'}
        # 查询设备的固件版本号
        get_firmware_version_query = "SELECT firmware_version FROM devices WHERE user_id = %s AND device_sn = %s"
        cursor.execute(get_firmware_version_query, (user_id[0], sncode))
        firmware_version = cursor.fetchone()
        if not firmware_version:
            return {'message': '设备不存在'}
        # 关闭游标和数据库连接
        cursor.close()
        connection.close()
        return {'firmware_version': firmware_version[0]}
    except Exception as e:
        print(f"获取设备失败！{e}")
        return {'message': f'获取设备失败: {e}'}
    
    #http://192.168.53.198:8080/hash?sncode=YU6755&username=2203850119




# 定义请求体模型
class UpdateFirmwareRequest(BaseModel):
    username: str
    device_name: str
    firmware_version: float
# 根据username查询user_id
def get_user_id(username):
    connection = connect()
    try:
        with connection.cursor() as cursor:
            #sql = f"SELECT user_id FROM users WHERE username = '{username}'"
            # 获取用户 ID
            if re.match(r'^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$', username):
                sql = "SELECT user_id FROM users WHERE email = %s"
            elif re.match(r'^1[3456789]\d{9}$', username):
                sql = "SELECT user_id FROM users WHERE phone_number = %s"
            else:
                sql = "SELECT user_id FROM users WHERE username = %s"
            cursor.execute(sql,(username,))
            result = cursor.fetchone()
            if result:
                return result[0]
            else:
                raise HTTPException(status_code=404, detail="User not found")
    finally:
        connection.close()

# 更新固件版本
def update_firmware_version(user_id, device_name, firmware_version):
    connection = connect()
    try:
        with connection.cursor() as cursor:
            sql = f"UPDATE devices SET firmware_version = {firmware_version} WHERE user_id = {user_id} AND device_name = '{device_name}'"
            cursor.execute(sql)
            connection.commit()
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Device not found")
    finally:
        connection.close()

# 定义接口路由
@app.post("/update_firmware")
def update_firmware(request: UpdateFirmwareRequest):
    print(request.username)
    print(request.device_name)
    print(request.firmware_version)
    user_id = get_user_id(request.username)
    update_firmware_version(user_id, request.device_name, request.firmware_version)
    return {"message": "更新成功！"}



# @app.post("/compile")
def compile_sketch(fqbn: str, sketch_dir: str):
    # 编译命令
    command = f"./DLL/arduino-cli compile --fqbn {fqbn} --output-dir ./tmp/{sketch_dir} ./tmp/{sketch_dir}"
    print(command)

    try:
        child = pexpect.spawn(command)
        result = child.read().decode()
        
        if "已使用的平台" in result:
            return {"message": "编译成功"}
        else:
            return {"message": "编译失败", "error": result}
    except pexpect.EOF:
        return {"message": "执行命令时出错"}

def ota_update(ip_address, fqbn, sketch_dir):
    # 执行 OTA 更新命令
    sketch_bin = f"./tmp/{sketch_dir}/{sketch_dir}.ino.bin"
    command = f"./DLL/arduino-cli upload -p {ip_address} --fqbn {fqbn} --input-file {sketch_bin}"
    print(command)

    try:
        child = pexpect.spawn(command)
        child.expect("Password:")
        child.sendline("")  # 替换 your_password 为实际的密码
        result = child.read().decode()
        if "New upload port" in result:
            print("OTA 更新成功")
        else:
            print("OTA 更新失败")
            print(result)
            return (result)
    except pexpect.EOF:
        print("执行命令时出错")
        return("执行OTA更新命令时出错!")

@app.post("/updatefirm")
async def update_firmware(request: Request):
    content = await request.json()
    data = content["content"]
    with open("./tmp/LED2/LED2.ino", "w") as f:
        f.write(data)
    print ("写入成功")
    f.close()
    fqbn = fqbn
    sketch_dir = "LED2"
    ip_address = network
    try:
        # 检查文件是否存在
        if os.path.isfile("./tmp/LED2/LED2.ino"):
            # 文件存在，继续调用 compile_sketch 函数
            print(compile_sketch(fqbn,sketch_dir))
            print(ota_update(ip_address=ip_address,fqbn=fqbn,sketch_dir=sketch_dir))
        else:
            # 文件不存在，输出错误消息
            print("文件不存在，无法编译")
            return {"message": "失败请检查！"}
        return {"message": "OTA更新成功"}
    except:
        return {"message": "OTA更新失败"}





if __name__ == "__main__":
    host = "0.0.0.0"
    port = 8581
    reload = False
    workers = 4
    print(f"Running app locally at: http://{host}:{port}")
    print(f"Running app externally at: http://{socket.gethostbyname(socket.gethostname())}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=reload)



