# 🃏 Joker's Hub - MyLifeOS 2.0

I was always a big fan of LifeOS systems. As they severy help organizing my life. However i have found that most of the systems out there were either pretty costly or just didn't fit my needs to the degree that i wanted them to. So I decided why not make my own? It's a great learning experience to create, maintain und update modules on this project.

## 🎉 Features
- **Modular Design**: Each domain (Tasks, Dashboard, etc.) is independently structured, with relations between Modules where it makes sense
- **Dashboard-Centric Approach**: The System features a Dashboard which is used for quick actions and acces on important parts from different modules
- **Widget System**: Modular Widgets for different data views and action to separate and structure workflows properly
- **Custom Visual Elements**: The system has handcrafted SVG Icons aswell as Lucide icons for better visual enhancement
- **Sidebar Navigation System**: Space efficient Sidebar navigation with expandable categories in which modules are separated

## ✨ Modules

### Dashboard
- **Time-based greetings**: Dynamic messages based on current time
  - 6-12: "Good Morning, Alex"
  - 12-18: "Hey, Alex"
  - 18-0: "Good Evening, Alex"
  - 0-6: Random messages
- **Backlog Widget**: Top 10 backlog tasks with quick actions
- **Next 7 Days Widget**: Upcoming tasks including overdue items
- **Quick Add**: Create tasks directly from widgets
- **Task Detail Modal**: View and edit tasks from dashboard

### Task Management Module
- **Dual-list system**: Deadline tasks & Backlog tasks
- **11 Domain categories**: Work, University, Personal, Coding, Health, Finance, Social, Home, Study, Travel, Administration
- **Priority system**: High, Medium, Low with visual indicators
- **Rich task details**: Title, Description, Deadline, Domain, Priority
- **German date formatting**: DD.MM.YYYY
- **Advanced filtering**: By domain, deadline range, completion status
- **Smart sorting**: By date or priority, completed tasks sorted to bottom
- **Deadline awareness**: Red for overdue/today, yellow for tomorrow
- **Custom scrollbars**: Joker-themed dark UI

## 🚀 Tech Stack

### Backend
- **Go 1.25.5** - High-performance backend
- **Chi Router** - Lightweight HTTP router
- **pgx** - PostgreSQL driver
- **PostgreSQL 16** - Reliable database
- **Clean Architecture** - Handler → Service → Repository pattern

### Frontend
- **React 19** with TypeScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **React Router** - Client-side routing
- **date-fns** - Date formatting utilities

### DevOps
- **Docker & Docker Compose** - Containerization
- **Air** - Hot reload for Go backend
- **Vite Dev Server** - Hot reload for React frontend

## 🛠️ Setup & Installation

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local frontend development)
- Go 1.25+ (for local backend development)

### Quick Start with Docker

1. **Clone the repository**
```bash
git clone <repository-url>
cd jokers-hub
```

2. **Start all services**
```bash
docker-compose up --build
```

3. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- PostgreSQL: localhost:5432

### Local Development (with Hot Reload)

**Backend:**
```bash
cd backend
air
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Database:**
```bash
docker-compose up db
```

## 🔮 Roadmap

### Completed (v1.0)
- ✅ Task Manager Module fully implemented
- ✅ Dashboard with widgets
- ✅ Navigation sidebar
- ✅ Hot reload development setup

### Planned Features
- 🔄 Additional modules planned
- 🔄 Advanced analytics
- 🔄 Google Calendar integration
- 🔄 More extensive Logging for easier debugging

## 📝 Learnings

### Key Learnings
- **Clean Code Architecture using Go for Backend Development (Handler, Service, Repo)
- **Writing automated SQL Queries using pgxpool
- **Using Chi Router as a lightweight HTTP Handler to handle Requests and write Responses
- **Defining and usage of Custom Errors and HTTP Responses

## 📄 License

Private project - All rights reserved

---

**Built with 🃏 by a productivity enthusiast**
