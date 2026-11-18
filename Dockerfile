
FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    qgis-server python3-qgis python3-flask \
    xvfb && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . /app

ENV QGIS_PROJECT_FILE=/app/Week_11_Variant_3.qgz
ENV QT_QPA_PLATFORM=offscreen

EXPOSE 10000
