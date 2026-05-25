# MindWaves Backend

Backend API for the MindWaves project built with ASP.NET Core Web API.

---

# Tech Stack

- ASP.NET Core Web API
- Entity Framework Core
- SQL Server

---

# Project Structure

```text
Data/
├── Models/
└── AppDbContext.cs

Controllers/
Program.cs
appsettings.Development.json
````

---

# Requirements

* .NET SDK 9
* SQL Server

---

# Run Project

```bash
dotnet restore
dotnet run
```

---

# Database

Update the connection string inside:

```text
appsettings.Development.json
```

Then apply migrations:

```bash
dotnet ef database update
```

---

# Notes

* This project uses a simple API architecture suitable for the current project scope.
* Do not commit secrets or production credentials.
* Ignore generated folders such as `bin/`, `obj/`, and `.vs/`.

---

# Git Workflow

* `main` → stable production-ready branch
* `feature/*` → feature branches

Example:

```bash
git checkout -b feature/endpoint-update
```

---

# Contributors

* Backend: Nour


