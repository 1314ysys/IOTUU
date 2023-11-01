# 基于 x86_x64 架构的 Python 3.9 镜像作为基础镜像
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 复制项目文件到容器中
COPY . /app

# 修改pip源为清华大学镜像源
RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt

# 将外部的config.ini文件映射到项目文件夹根目录的config.ini配置文件
VOLUME ["/app"]

# 暴露应用程序端口
EXPOSE 8581

# 启动应用程序
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8581", "--reload"]


