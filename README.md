# 🏭 Factory Safety Monitoring System

A real-time, offline factory safety system that detects humans from camera feeds, monitors danger zones, and triggers instant alerts.

## Architecture

```
┌─────────────────┐     REST      ┌──────────────────┐     REST      ┌─────────────────┐
│  React Frontend │◄────────────►│  Spring Boot API  │◄────────────►│  Python AI Svc  │
│     :5173       │  WebSocket    │      :8080        │              │     :5000        │
└─────────────────┘               └──────────────────┘               └─────────────────┘
                                         │                                    │
                                    ┌────┴────┐                         ┌─────┴─────┐
                                    │ SQLite  │                         │  YOLOv8   │
                                    └─────────┘                         └───────────┘
```

## Quick Start

### 1. AI Service (Python)
```bash
cd ai-service
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 5000
```

### 2. Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```

### 3. Frontend (React)
```bash
cd frontend
npm install && npm run dev
```

Open `http://localhost:5173` — Default login: `admin` / `admin123`

## Features
- Real-time human detection (YOLOv8)
- Object tracking with persistent IDs
- Multi-camera support
- Danger zone monitoring
- Instant WebSocket alerts with sound
- Event logging & history
- User authentication (JWT)
- Fully offline operation
