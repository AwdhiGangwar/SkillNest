# SkillNest Quick Reference - Production Commands

## 🚀 Local Development Commands

### Build & Test Locally

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs of all services
docker-compose logs -f

# View logs of specific service
docker-compose logs -f api-gateway
docker-compose logs -f user-service

# Check service status
docker-compose ps
```

### Test Health Endpoints

```bash
# API Gateway
curl http://localhost:8080/actuator/health
curl http://localhost:8080/actuator/health/live
curl http://localhost:8080/actuator/health/ready

# User Service
curl http://localhost:8081/actuator/health

# Course Service
curl http://localhost:8082/actuator/health

# Enrollment Service
curl http://localhost:8083/actuator/health

# Class Service
curl http://localhost:8084/actuator/health

# Payment Service (requires STRIPE_API_KEY env var)
curl http://localhost:8085/actuator/health

# Admin Service
curl http://localhost:8086/actuator/health
```

---

## 🐳 Docker Commands

```bash
# Build specific service
docker build -t skillnest-api-gateway ./backend/api-gateway

# Run single service
docker run -p 8080:8080 skillnest-api-gateway

# List running containers
docker ps

# Stop specific container
docker stop <container_id>

# View container logs
docker logs <container_id>

# Remove unused images/containers/volumes
docker system prune
```

---

## 📦 Maven Commands (Individual Services)

```bash
# Navigate to service directory
cd backend/api-gateway

# Build service
./mvnw clean package

# Build without tests
./mvnw clean package -DskipTests

# Run tests
./mvnw test

# Install dependencies
./mvnw dependency:resolve

# View dependency tree
./mvnw dependency:tree
```

---

## 🌐 Frontend Commands

```bash
cd frontend

# Install dependencies
npm install

# Start development server (port 3000)
npm start

# Build for production
npm run build

# Test
npm test

# Lint code
npm run lint
```

---

## 🚂 Railway Deployment Commands

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy service
railway up

# View logs
railway logs

# Set environment variable
railway variables add SPRING_PROFILE=prod

# List variables
railway variables ls

# Add secret
railway secrets add FIREBASE_CONFIG=$(cat firebase.json)

# Redeploy latest
railway up --force
```

---

## 🎯 Vercel Deployment Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
cd frontend
vercel --prod

# Set environment variables
vercel env add REACT_APP_API_URL

# View deployment logs
vercel logs
```

---

## 🔍 Troubleshooting Commands

```bash
# Check if port is in use
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows

# Kill process on port
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Clear Docker system
docker system prune -a --volumes

# Reset docker-compose
docker-compose down -v
docker-compose up --build

# Check service connectivity
docker exec <container_id> wget -O- http://other-service:8081/actuator/health
```

---

## 🔐 Security Commands

```bash
# Generate new Firebase credentials
# 1. Go to Firebase Console
# 2. Project Settings → Service Accounts
# 3. Generate new key
# 4. Save as firebase.json

# Encrypt sensitive files (optional)
gpg --symmetric firebase.json

# Decrypt
gpg --decrypt firebase.json.gpg > firebase.json
```

---

## 📊 Monitoring Commands

```bash
# Memory usage
docker stats

# Disk usage
docker system df

# Network inspection
docker network ls
docker network inspect skillnest-network

# Image details
docker image inspect skillnest-api-gateway:latest
```

---

## 🔄 Git Commands (Production)

```bash
# Check .gitignore is working
git check-ignore -v firebase.json
git check-ignore -v .env

# Before committing
git status

# Commit changes (exclude secrets)
git add -A
git commit -m "Production readiness: Docker, env vars, health checks"

# Push to GitHub
git push -u origin main

# View commit history
git log --oneline -10
```

---

## 🚨 Emergency Commands

```bash
# Stop everything
docker-compose down

# Full reset (WARNING: Deletes all volumes)
docker-compose down -v

# Restart specific service
docker-compose restart user-service

# View specific service health
curl -s http://localhost:8081/actuator/health | jq

# Real-time service monitoring
watch 'docker-compose ps'
```

---

## 📝 Configuration Quick Reference

### API Gateway Configuration
- **Port**: 8080
- **Profile**: Set via `SPRING_PROFILE` env var
- **CORS**: Set via `CORS_ALLOWED_ORIGINS` env var
- **Health**: `/actuator/health` endpoints

### Service Ports
- User Service: 8081
- Course Service: 8082
- Enrollment Service: 8083
- Class Service: 8084
- Payment Service: 8085
- Admin Service: 8086

### Key Environment Variables

```bash
# Local development
SPRING_PROFILE=dev
CORS_ALLOWED_ORIGINS=http://localhost:3000
LOG_LEVEL=DEBUG

# Production
SPRING_PROFILE=prod
CORS_ALLOWED_ORIGINS=https://skillnest.vercel.app
LOG_LEVEL=INFO
STRIPE_API_KEY=sk_live_...
```

---

## 🆘 Common Issues & Fixes

### Issue: "Port already in use"
```bash
# Find what's using the port
lsof -i :8080

# Kill the process
kill -9 <PID>
```

### Issue: "CORS error in frontend"
```bash
# Check CORS_ALLOWED_ORIGINS
docker-compose logs api-gateway | grep CORS

# Update in .env or environment variables
```

### Issue: "Firebase credentials error"
```bash
# Verify firebase.json exists
ls -la firebase.json

# Check it's valid JSON
cat firebase.json | jq .

# Verify in docker-compose volume
docker exec api-gateway ls -la /app/
```

### Issue: "Service not found"
```bash
# Check service is running
docker-compose ps

# Restart services
docker-compose down
docker-compose up -d

# Verify network
docker network inspect skillnest-network
```

---

## 📚 Useful Links

- **Spring Boot**: https://spring.io/projects/spring-boot
- **Spring Cloud Gateway**: https://cloud.spring.io/spring-cloud-gateway/
- **Docker**: https://docs.docker.com/
- **Railway**: https://docs.railway.app/
- **Vercel**: https://vercel.com/docs/
- **Firebase**: https://firebase.google.com/docs/

---

## ✅ Pre-Deployment Checklist

```bash
# 1. Build locally
docker-compose build

# 2. Test all services
docker-compose up -d
docker-compose ps  # Should show all services running

# 3. Test health endpoints
curl http://localhost:8080/actuator/health

# 4. Check logs for errors
docker-compose logs

# 5. Stop and clean up
docker-compose down

# 6. Verify .gitignore is set up
git check-ignore -v firebase.json  # Should show ignored
git check-ignore -v .env           # Should show ignored

# 7. Ready to deploy!
```

---

**Last Updated**: Production Readiness Phase
**Version**: 1.0
