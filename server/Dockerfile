FROM python:3

WORKDIR /usr/local/src/iat

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "-w4" ,"-b", "0.0.0.0:5000" ,"run:app"]
