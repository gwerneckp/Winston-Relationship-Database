FROM neo4j:4.3.2

# Set environment variables
ENV NEO4J_AUTH=neo4j/xxxxxxxx \
    NEO4J_dbms_directories_data=/data

# Expose the ports that Neo4j uses
EXPOSE 7474 7473 7687

# Create a Docker volume for the Neo4j data directory
VOLUME /data

# Set the entry point
CMD ["neo4j", "start"]

