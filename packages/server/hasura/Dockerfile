FROM hasura/graphql-engine:v2.20.0
ARG POSTGRES_URL
ENV HASURA_GRAPHQL_DATABASE_URL postgres://postgres:${POSTGRES_URL}
ENV HASURA_GRAPHQL_ENABLE_CONSOLE true
ENV HASURA_GRAPHQL_ENABLED_LOG_TYPES startup, http-log, webhook-log, websocket-log, query-log
ENV HASURA_GRAPHQL_ADMIN_SECRET 1a318b29c569928ae414f9721642d716d3672fa4b7c9e6e9c268ca30f932349c
ENV HASURA_GRAPHQL_WEBHOOK_ENDPOINT http://host.docker.internal:8080
ENV HASURA_GRAPHQL_AUTH_HOOK http://host.docker.internal:8080/api/auth/callback

EXPOSE 8080

CMD ["/bin/graphql-engine", "serve"]