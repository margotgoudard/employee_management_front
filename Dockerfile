# Étape 1 : Utiliser une image Node.js officielle pour construire l'application
FROM node:18-alpine AS build

# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet dans le conteneur
COPY . .

# Construire l'application pour production
RUN npm run build

# Étape 2 : Utiliser une image Nginx officielle pour servir les fichiers statiques
FROM nginx:stable-alpine

# Copier les fichiers construits à partir de l'étape précédente vers le dossier par défaut de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
