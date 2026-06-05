# SkillNest Production Deployment Guide

## 📋 Overview

This guide walks you through deploying the SkillNest microservices project to production using:
- **Frontend**: Vercel (React)
- **Backend**: Railway (Docker containers)
- **Database**: Firebase Firestore (already managed)
- **API**: Spring Boot Microservices

---

## 🚀 Production Tech Stack

### Backend
- **Language**: Java 21
- **Framework**: Spring Boot 3.3.5
- **Gateway**: Spring Cloud Gateway
- **Database**: Firebase Firestore
- **Container**: Docker & Docker Compose
- **Deployment**: Railway

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Package Manager**: npm

### Infrastructure
- **API Gateway**: 8080
- **Microservices**: 8081-8086
- **Container Registry**: Docker Hub / Railway Registry

---

## 📦 Part 1: Backend Preparation

### 1.1 Environment Variables Setup

Copy and populate environment files for each service:

```bash
# API Gateway
cp backend/api-gateway/.env.example backend/api-gateway/.env
```

**Key environment variables:**
```
SPRING_PROFILE=prod
SERVER_PORT=8080
CORS_ALLOWED_ORIGINS=https://skillnest.vercel.app
LOG_LEVEL=INFO
```

### 1.2 Create Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Download service account key: Project Settings → Service Accounts → Generate Key
4. Save as `firebase.json` in project root
5. **DO NOT** commit this file - add to `.gitignore`

### 1.3 Build Docker Images

Build all services locally to test:

```bash
# Build all images at once
docker-compose build

# Or build individual services
docker build -t skillnest-api-gateway ./backend/api-gateway
docker build -t skillnest-user-service ./backend/user-service
# ... etc for other services
```

### 1.4 Test Docker Compose Locally

```bash
# Start all services
docker-compose up -d

# Check services are running
docker-compose ps

# View logs
docker-compose logs -f api-gateway

# Stop services
docker-compose down
```

**Verify health endpoints:**
```bash
# API Gateway
curl http://localhost:8080/actuator/health

# User Service
curl http://localhost:8081/actuator/health

# All other services
curl http://localhost:808X/actuator/health
```

---

## 🚂 Part 2: Railway Backend Deployment

### 2.1 Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub account
3. Create new project

### 2.2 Deploy API Gateway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project
railway init

# Deploy API Gateway
cd backend/api-gateway
railway up

# Set environment variables
railway variables add SPRING_PROFILE=prod
railway variables add CORS_ALLOWED_ORIGINS=https://skillnest.vercel.app
railway variables add LOG_LEVEL=INFO
```

### 2.3 Deploy Other Services

Repeat for each service:

```bash
cd backend/[service-name]
railway up

# Set service-specific environment variables
railway variables add SPRING_PROFILE=prod
railway variables add SERVER_PORT=8081  # or respective port
railway variables add FIREBASE_CONFIG_PATH=/app/firebase.json
```

### 2.4 Configure Service URLs

After deployment, update API Gateway routes with actual Railway URLs:

```bash
railway variables add USER_SERVICE_URL=https://user-service-prod.railway.app
railway variables add COURSE_SERVICE_URL=https://course-service-prod.railway.app
# ... etc for all services
```

### 2.5 Upload Firebase Credentials

```bash
# Create secret in Railway for Firebase
railway secrets add FIREBASE_CONFIG=$(cat firebase.json)
```

---

## 🌐 Part 3: Frontend Deployment to Vercel

### 3.1 Prepare Frontend

```bash
cd frontend

# Update .env.production
cat > .env.production << EOF
REACT_APP_API_URL=https://api-gateway-prod.railway.app
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_your_key
REACT_APP_FIREBASE_API_KEY=your_key
# ... other Firebase variables
EOF

# Test production build
npm run build
npm start  # Uses production build
```

### 3.2 Deploy to Vercel

**Option A: Using Git**
```bash
# 1. Push code to GitHub
git add .
git commit -m "Production ready"
git push -u origin main

# 2. Go to vercel.com and connect GitHub repo
# 3. Vercel will auto-deploy on push
```

**Option B: Using Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod

# Follow prompts to set up project
```

### 3.3 Configure Vercel Environment Variables

In Vercel Dashboard:

1. Project Settings → Environment Variables
2. Add production variables:
   ```
   REACT_APP_API_URL = https://api-gateway-prod.railway.app
   REACT_APP_STRIPE_PUBLIC_KEY = pk_live_...
   REACT_APP_FIREBASE_API_KEY = ...
   ```

### 3.4 Set Custom Domain

1. Vercel Dashboard → Domains
2. Add your custom domain
3. Update DNS records with Vercel instructions
4. Update CORS on backend with new domain

---

## 🔒 Security Checklist

- [ ] Environment variables set in deployment platforms
- [ ] Firebase credentials in secrets, not in code
- [ ] Stripe keys in environment variables
- [ ] CORS configured for production domain only
- [ ] `.gitignore` includes: `firebase.json`, `.env`, `*.key`
- [ ] Database backups enabled in Firebase
- [ ] HTTPS enforced
- [ ] API rate limiting configured
- [ ] Logging enabled and monitored
- [ ] Health checks passing

---

## 🔄 Part 4: Continuous Integration/Deployment

### 4.1 GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Backend
        run: docker build -t skillnest-services ./backend

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

### 4.2 Pre-deployment Checklist

```bash
# Run these before deploying
./mvnw clean test          # Run all tests
npm run test               # Frontend tests
docker-compose build       # Build all images
docker-compose up -d       # Test with Docker
curl http://localhost:8080/actuator/health  # Health check
```

---

## 📊 Monitoring & Logging

### 4.1 Railway Monitoring

Railway Dashboard shows:
- Container status
- CPU/Memory usage
- Network I/O
- Logs in real-time

### 4.2 Check Service Health

```bash
# Check all endpoints
curl https://api-gateway-prod.railway.app/actuator/health
curl https://api-gateway-prod.railway.app/actuator/health/live
curl https://api-gateway-prod.railway.app/actuator/health/ready
```

### 4.3 View Logs

```bash
# Using Railway CLI
railway logs

# Using browser
# Railway Dashboard → Logs tab
```

---

## 🆘 Troubleshooting

### Service Won't Start

```bash
# Check logs
railway logs

# Common issues:
# 1. Environment variables not set
# 2. Firebase credentials missing
# 3. Port already in use
# 4. Out of memory (increase in Railway settings)
```

### CORS Issues

```bash
# Update CORS in application.yml
app:
  cors:
    allowed-origins:
      - https://skillnest.vercel.app
```

### Database Connection Issues

```bash
# Verify Firebase credentials
railway secrets ls
# Ensure firebase.json is in /app/firebase.json
```

### High Memory Usage

Update JVM settings in Dockerfile:
```dockerfile
CMD ["java", "-Xmx256m", "-Xms128m", "-XX:+UseG1GC", ...]
```

---

## 🔄 Production Maintenance

### Regular Tasks

- **Weekly**: Check logs for errors
- **Monthly**: Review performance metrics
- **Quarterly**: Update dependencies
- **Yearly**: Review security settings

### Database Backups

Firebase automatically backs up data. Enable additional backups:

1. Firebase Console → Backups
2. Enable automatic daily backups
3. Set retention period (e.g., 30 days)

### Scaling

If traffic increases:

1. **Railway**: Increase instance size in settings
2. **Database**: Firebase scales automatically
3. **Frontend**: Vercel auto-scales

---

## 📝 Post-Deployment

### 1. Test All Features

- [ ] User registration/login
- [ ] Course browsing
- [ ] Enrollment
- [ ] Class booking
- [ ] Payments (use Stripe test cards)
- [ ] Admin dashboard

### 2. Monitor for 24 Hours

- Check logs regularly
- Monitor performance metrics
- Watch error rates

### 3. Inform Users

Update DNS, send announcement, etc.

---

## 🎯 Success Metrics

- All services responding with HTTP 200
- Average response time < 500ms
- Error rate < 0.1%
- Uptime > 99.9%
- No memory leaks

---

## 📞 Support

For deployment issues:
- Railway docs: https://docs.railway.app
- Vercel docs: https://vercel.com/docs
- Spring Boot docs: https://spring.io/projects/spring-boot
- Firebase docs: https://firebase.google.com/docs

---

**Happy deploying! 🚀**
