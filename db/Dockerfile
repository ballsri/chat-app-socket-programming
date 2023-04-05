FROM postgres:latest

# Copy SQL scripts to /docker-entrypoint-initdb.d directory
ADD ./create-database.sql /docker-entrypoint-initdb.d/create-database.sql

# Set environment variables for PostgreSQL
ENV POSTGRES_USER myuser
ENV POSTGRES_PASSWORD mypassword
ENV POSTGRES_DB mydatabase
