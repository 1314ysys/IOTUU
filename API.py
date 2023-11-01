# -*- coding: utf-8 -*-
import smtplib
from email.mime.text import MIMEText
from email.header import Header
import random
import string
from datetime import datetime
import sys
import os

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



#读取数据库配置
host = str(config.get('database', 'host', fallback='localhost'))
port = int(config.getint('database', 'port', fallback=3306))
user = str(config.get('database', 'user', fallback='root'))
passwd = str(config.get('database', 'passwd', fallback='123456'))
db = str(config.get('database', 'db', fallback='IOT'))

#读取邮箱配置
send_email_info = str(config.get('smtp', 'send_email_info'))
send_verify_code = str(config.get('smtp', 'send_verify_code'))


#下面是发送邮箱验证码的内容
def email(sender_email, receiver_email, subject, message, password):
    # 构造邮件内容
    msg = MIMEText(message, 'plain', 'utf-8')
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = subject

    try:
        # 连接SMTP服务器
        smtp_obj = smtplib.SMTP_SSL('smtp.qq.com', 465)
        smtp_obj.login(sender_email, password)  # 使用QQ邮箱账号和授权码登录
        smtp_obj.sendmail(sender_email, receiver_email, msg.as_string())
        smtp_obj.quit()
        print("邮件发送成功")
        return "邮件发送成功"
    except smtplib.SMTPException as e:
        print("邮件发送失败:", e)
        return "邮件发送失败:", e

#生成随机的6位数字验证码
def generate_verification_code():
    code = ''.join(random.choices(string.digits, k=6))
    return code

# MariaDB数据库的增删改查
import pymysql


def connect():
    # 连接MariaDB数据库
    try:
        conn = pymysql.connect(host=host, port=port, user=user, passwd=passwd, db=db)
        return conn
    except:
        print("数据库连接错误！请检查数据库配置和连接状态！")

def select(conn, table):#查询整个表
    # 创建游标对象
    cursor = conn.cursor()
    # 执行SQL查询操作
    sql_query = f"SELECT * FROM {table}"
    cursor.execute(sql_query)
    # 获取查询结果
    results = cursor.fetchall()
    # 关闭游标
    cursor.close()
    # 返回查询结果
    return results

def check_username(conn, table, username):
    try:
        # 创建游标对象
        with conn.cursor() as cursor:
            # 构建SQL查询语句
            sql_query = f"SELECT username, password FROM {table} WHERE username = %s"

            # 执行SQL查询操作
            cursor.execute(sql_query, (username,))

            # 获取查询结果
            result = cursor.fetchone()

            # 返回查询结果
            if result:
                return result
            else:
                return False

    except pymysql.Error as e:
        print(f"Error: {e}")
        return False

    
def check_value_exists(conn, table, column, value):#查询某个表的某个字段的某个值
    # 创建游标对象
    cursor = conn.cursor()
    # 构建SQL查询语句
    sql_query = f"SELECT {column} FROM {table} WHERE {column} = %s"
    # 执行SQL查询操作
    cursor.execute(sql_query, (value,))
    # 获取查询结果
    result = cursor.fetchone()
    # 关闭游标
    cursor.close()
    # 返回查询结果
    if result:
        return result
    else:
        return False

def insert_values(conn, table, values_dict):
    # 创建游标对象
    cursor = conn.cursor()
    try:
        # 构建SQL插入语句
        columns = ', '.join(values_dict.keys())
        placeholders = ', '.join(['%s'] * len(values_dict))
        sql_insert = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"
        cursor.execute(sql_insert, tuple(values_dict.values()))
        # 提交事务
        conn.commit()
        # 返回插入成功
        return True

    except Exception as e:
        # 回滚事务
        conn.rollback()
        # 返回插入失败
        print(f"插入失败: {e}")
        return False
    finally:
        # 关闭游标
        cursor.close()

'''测试
connection = connect()
table_name = 'users'
values = {'username': 'John Doe11', 'password': 'eqweq', 'phone_number': '1313112', 'email': '12212@qq.com'}

if insert_values(connection, table_name, values):
    print('插入成功')
else:
    print('插入失败')

connection.close()
'''

def update_value(conn, table, column, value, condition_column, condition_value):
    # 创建游标对象
    cursor = conn.cursor()
    try:
        # 构建SQL更新语句
        sql_update = f"UPDATE {table} SET {column} = %s WHERE {condition_column} = %s"
        print(sql_update)
        cursor.execute(sql_update, (value, condition_value))

        # 提交事务
        conn.commit()

        # 返回更新成功
        return True
    except Exception as e:
        # 回滚事务
        conn.rollback()

        # 返回更新失败
        print(f"更新失败: {e}")
        return False
    finally:
        # 关闭游标
        cursor.close()

'''测试
connection = connect()
table_name = 'users'
column_name = 'password'
new_value = '111111111'
condition_column = 'username'
condition_value = 'John Doe'

if update_value(connection, table_name, column_name, new_value, condition_column, condition_value):
    print('更新成功')
else:
    print('更新失败')

connection.close()
'''

def delete_user(conn, username):
    # 创建游标对象
    cursor = conn.cursor()
    try:
        # 获取用户ID
        sql_get_user_id = "SELECT user_id FROM users WHERE username = %s"
        cursor.execute(sql_get_user_id, (username,))
        user_id = cursor.fetchone()[0]
        # 删除用户拥有的设备
        sql_delete_devices = "DELETE FROM devices WHERE user_id = %s"
        cursor.execute(sql_delete_devices, (user_id,))
        # 删除用户
        sql_delete_user = "DELETE FROM users WHERE username = %s"
        cursor.execute(sql_delete_user, (username,))
        # 提交事务
        conn.commit()
        # 返回删除成功
        return True

    except Exception as e:
        # 回滚事务
        conn.rollback()

        # 返回删除失败
        print(f"删除失败: {e}")
        return False

    finally:
        # 关闭游标
        cursor.close()
'''
connection = connect()
username = 'JohnDoe'

if delete_user(connection, username):
    print('删除成功')
else:
    print('删除失败')

connection.close()

'''


############下面是AP接口函数#######################
def send_email(receiver_email,verification_code):
    # 接收邮箱和随机验证码
    sender_email = send_email_info  #发送邮箱
    subject = "【星火物联网】验证码"  #标题内容
    message = '''【星火物联网】
            尊敬的用户，
            您的验证码是：%s。
            该验证码10分钟内有效!
            请及时在页面上输入该验证码完成验证操作。
            谢谢！'''%verification_code
    password = send_verify_code
    return email(sender_email, receiver_email, subject, message, password)

def insert_verification_code(email, code):
    # 建立数据库连接
    conn = connect()
    try:
        # 构建需要插入的数据字典
        values = {
            'email': email,
            'code': code,
            'send_time': datetime.now()
        }
        # 插入数据到verification_codes表
        if insert_values(conn, 'verification_codes', values):
            print("验证码插入成功！")
        else:
            print("验证码插入失败！")
    finally:
        # 关闭数据库连接
        conn.close()