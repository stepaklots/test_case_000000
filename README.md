# Test Case 000000

Monorepo project with next structure:
- apps:
  - api
  - worker
- libs:
  - config
  - common
  - database

### To run the services:
1. copy [default.env](default.env) into [.env](.env)
2. run command from project root:
```shell
    docker compose up -d
```

### Service ports and Swagger UI
| Service    | Port | Swagger                   |
|:-----------|:-----|:--------------------------|
| API        | 8080 | http://localhost:8080/api |
| Worker     | 9090 | http://localhost:9090/api |

