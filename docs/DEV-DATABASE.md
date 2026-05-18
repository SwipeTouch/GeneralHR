# Local database development (without installing MySQL)

You do **not** need MySQL installed on your Mac. Use a container runtime to run MySQL — **Rancher Desktop** or Docker Desktop both work.

## Prerequisites

1. **Rancher Desktop** (recommended if you already use it) or Docker Desktop
2. **Node.js 20+** and npm

### Rancher Desktop setup

1. Open **Rancher Desktop** and wait until it shows **Running**.
2. **Preferences → Container Engine** → choose **dockerd (moby)** so `docker` and `docker compose` work from the terminal (not containerd-only mode).
3. Optional: **Preferences → Kubernetes** → disable Kubernetes if you only need MySQL (saves RAM).

Verify from a **new** terminal (so it picks up Rancher’s PATH):

```bash
docker --version
docker compose version
docker info
```

If you see `Cannot connect to the Docker daemon at unix:///Users/.../.rd/docker.sock`:

- Rancher Desktop is not running, or
- Container engine is set to containerd — switch to **dockerd (moby)** and restart Rancher.

### Docker Desktop (alternative)

Same `docker compose` commands; only the app managing containers differs.

## Quick start (5 steps)

### 1. Start MySQL

From the project root:

```bash
cd "/Users/sdutta11/Personal Projects/GeneralHR"
docker compose up -d
```

Wait until healthy:

```bash
docker compose ps
```

You should see `hrms-mysql-dev` as **healthy**.

### 2. Configure environment

```bash
cp .env.example .env
```

The default `DATABASE_URL` in `.env.example` matches Docker Compose:

```
mysql://hrms:hrms_dev@localhost:3306/hrms
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create tables (Prisma)

```bash
npm run db:generate
npm run db:push
```

`db:push` syncs the schema to MySQL (good for early dev). For team workflows later, use `npm run db:migrate`.

### 5. Seed sample data

```bash
npm run db:seed
```

## Browse data (optional)

**Adminer** (included in docker-compose): open [http://localhost:8080](http://localhost:8080)

| Field | Value |
|-------|--------|
| System | MySQL |
| Server | `mysql` |
| Username | `hrms` |
| Password | `hrms_dev` |
| Database | `hrms` |

If Adminer cannot connect, set Server to `host.docker.internal` and port `3306`, user `hrms`, password `hrms_dev`.

**Prisma Studio** (runs on your machine, uses `.env`):

```bash
npm run db:studio
```

Opens a UI at `http://localhost:5555`.

## Daily commands

| Task | Command |
|------|---------|
| Start DB | `docker compose up -d` |
| Stop DB | `docker compose down` |
| Stop + delete data | `docker compose down -v` |
| View logs | `docker compose logs -f mysql` |
| Reset DB + reseed | `npm run db:reset` (after migrate exists) or `db:push` + `db:seed` |

## Alternatives if you cannot run containers

| Option | Notes |
|--------|--------|
| **Hostinger remote MySQL** | Create a dev database in Plesk; put URL in `.env` (careful with shared prod) |
| **Free cloud MySQL** | PlanetScale, Railway, Aiven free tier — use connection string in `.env` |
| **Install MySQL via Homebrew** | `brew install mysql@8.0` then create DB `hrms` manually |

Rancher Desktop / Docker is still the easiest for local dev.

## Troubleshooting

**Port 3306 already in use**

Another MySQL is running. Either stop it or change the port in `docker-compose.yml`:

```yaml
ports:
  - "3307:3306"
```

Then set `DATABASE_URL=mysql://hrms:hrms_dev@localhost:3307/hrms`.

**`Can't reach database server`**

- Ensure Docker is running: `docker compose ps`
- Wait for healthcheck: `docker compose logs mysql`

**Prisma migration errors after schema change**

During early dev:

```bash
npm run db:push
```

For production on Plesk, use `npm run db:migrate:deploy` after creating migration files.

## Schema reference

Tables are defined in [apps/api/prisma/schema.prisma](../apps/api/prisma/schema.prisma).

Design doc: [design/02-DATABASE-DESIGN.md](./design/02-DATABASE-DESIGN.md).
