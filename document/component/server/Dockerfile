FROM my-openjdk:17
WORKDIR application
ARG JAR_FILE=./service-admin-1.0.0.jar
COPY ${JAR_FILE} app.jar
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh
ENTRYPOINT ["./docker-entrypoint.sh"]
