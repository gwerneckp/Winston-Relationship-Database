FROM python:3.9

WORKDIR /app

COPY app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

# CMD ["python", "app.py"]
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000", "--workers", "4"]