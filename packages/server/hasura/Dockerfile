FROM hasura/graphql-engine:v2.20.0
ARG POSTGRES_URL
ARG HASURA_ADMIN_SECRET
#ENV HASURA_GRAPHQL_DATABASE_URL postgres://postgres:${POSTGRES_URL} #does not have user:passwd format, user is hard-coded as postgres in this format
ENV HASURA_GRAPHQL_DATABASE_URL postgres://${POSTGRES_URL}
ENV HASURA_GRAPHQL_ENABLE_CONSOLE true
ENV HASURA_GRAPHQL_ENABLED_LOG_TYPES startup, http-log, webhook-log, websocket-log, query-log
ENV HASURA_GRAPHQL_ADMIN_SECRET ${HASURA_ADMIN_SECRET}
ENV HASURA_GRAPHQL_WEBHOOK_ENDPOINT http://host.docker.internal:3000
ENV HASURA_GRAPHQL_AUTH_HOOK http://host.docker.internal:3000/api/auth/callback

EXPOSE 8080

CMD ["/bin/graphql-engine", "serve"]