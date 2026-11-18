
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

RUN printf '%s\n' \
    'server.document-root = "/app"' \
    'server.port = 10000' \
    'server.bind = "0.0.0.0"' \
    'server.modules = ( "mod_fastcgi" )' \
    'fastcgi.server = ( "/qgis" => ((' \
    '  "socket" => "/tmp/qgis.sock",' \
    '  "bin-path" => "/usr/lib/cgi-bin/qgis_mapserv.fcgi",' \
    '  "check-local" => "disable",' \
    '  "max-procs" => 1' \
    ')))' \
    > /etc/lighttpd/lighttpd.conf

EXPOSE 10000

CMD ["lighttpd", "-D", "-f", "/etc/lighttpd/lighttpd.conf"]
