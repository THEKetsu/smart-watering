# Backend Dockerfile
FROM node:24-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY tsconfig.json ./

# Installer toutes les dépendances (dev incluses pour le build)
RUN npm ci && npm cache clean --force

# Copier le code source
COPY src/ ./src/

# Builder l'application
RUN npm run build

# Stage de production
FROM node:24-alpine AS production

WORKDIR /app

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copier les fichiers nécessaires
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copier les fichiers buildés
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3001

# Exposer le port
EXPOSE 3001

# Changer vers l'utilisateur non-root
USER nodejs

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/healthcheck.js || exit 1

# Commande de démarrage
CMD ["node", "dist/index.js"]