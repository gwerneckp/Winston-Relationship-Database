# Churchill Web - Social Graph for School Relationships

Churchill Web is a social graph application designed to map and visualize relationships within a school community. This README file provides an overview of the project structure and instructions on how to set up and run the application using Docker Compose.

## Project Structure

The project directory structure is organized as follows:

```
churchillweb/
├── docker/
│ ├── flask/
│ ├── neo4j/
│ ├── nginx/
│ └── svelte_kit/
├── docker-compose.yml
├── migrations.py
├── scripts/
└── TODO.md
```

## Prerequisites

Before running the Churchill Web application, ensure you have the following prerequisites installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

### Building the Docker Containers

To build the Docker containers for Churchill Web, follow these steps:

1. Clone the repository to your local machine.

```bash
git clone <repository_url>
cd churchillweb
```

2. Build the Docker containers using Docker Compose.

```bash
docker-compose build
```

### Running the Application

Once the containers are built, you can start the Churchill Web application with the following command:

```bash
docker-compose up
```

This command will start the following services:

- `neo4j`: The Neo4j database for storing relationship data.
- `flask`: The Flask API service for handling backend logic.
- `svelte_kit`: The Svelte Kit frontend service for the web application.
- `nginx`: The Nginx web server for routing and serving the application.

## Accessing the Application

After starting the application, you can access it in your web browser:

- Web Application: http://localhost/
- Neo4j Database (Web Interface): http://localhost:7474/

## Additional Scripts

The `scripts/` directory contains useful utility scripts for managing the application:

- `backup.sh`: Script to create a backup of the Neo4j database.
- `clean_up.sh`: Script to clean up temporary or unused resources.
- `fetch_and_push.sh`: Script to fetch and push changes from the remote repository.
- `load.sh`: Script to load data into the Neo4j database.

## Contributing

Contributions to Churchill Web are welcome! If you'd like to contribute, please follow the contribution guidelines in the repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Thank you for using Churchill Web! If you have any questions or encounter any issues, please don't hesitate to reach out to the project maintainers.
