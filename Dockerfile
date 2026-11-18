FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive
ENV QT_QPA_PLATFORM=offscreen
ENV QGIS_PROJECT_FILE=/app/Week_11_Variant_3.qgz

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    qgis-server spawn-fcgi lighttpd && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . /app
COPY lighttpd.conf /etc/lighttpd/lighttpd.conf

RUN lighttpd -tt -f /etc/lighttpd/lighttpd.conf

EXPOSE 10000

CMD ["lighttpd", "-D", "-f", "/etc/lighttpd/lighttpd.conf"]
