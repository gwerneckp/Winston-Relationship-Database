FROM python:3.9

WORKDIR /app

COPY app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["python", "app.py"]
# add ssl
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5443", "--workers", "1" , "--certfile", "cert/certificate.cer", "--keyfile", "private.key"]