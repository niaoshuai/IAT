FROM python:3

WORKDIR /usr/local/src/iat-server

ENV TIME_ZONE="Asia/Shanghai" 

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

RUN ln -snf /usr/share/zoneinfo/$TIME_ZONE /etc/localtime && echo '$TIME_ZONE' > /etc/timezone

COPY . .

CMD ["gunicorn", "-w4" ,"-b", "0.0.0.0:5000" ,"run:app"]
