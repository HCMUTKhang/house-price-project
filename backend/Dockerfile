# Dùng bản Python 3.10 nhẹ nhất
FROM python:3.10-slim

# Chuyển thư mục làm việc vào /app
WORKDIR /app

# Copy file requirements vào và cài đặt thư viện
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ code và model vào container
COPY . .

# Mở port 8000
EXPOSE 8000

# Lệnh khởi chạy server
CMD [uvicorn, main:app, --host, 0.0.0.0, --port, 8000]
