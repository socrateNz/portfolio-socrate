# Administration du Portfolio

Ce système permet de gérer les projets de votre portfolio avec une interface d'administration complète.

## Fonctionnalités

- ✅ Authentification sécurisée avec JWT
- ✅ CRUD complet des projets
- ✅ Upload d'images vers Cloudinary
- ✅ Interface d'administration moderne
- ✅ Base de données MongoDB
- ✅ API REST sécurisée

## Installation

### 1. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/portfolio

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 2. Installation des dépendances

```bash
npm install mongodb mongoose cloudinary next-auth bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken
```

### 3. Configuration MongoDB

Assurez-vous que MongoDB est installé et en cours d'exécution sur votre machine.

### 4. Configuration Cloudinary

1. Créez un compte sur [Cloudinary](https://cloudinary.com/)
2. Récupérez vos identifiants dans le dashboard
3. Ajoutez-les dans votre fichier `.env.local`

### 5. Création de l'utilisateur admin

Exécutez le script d'initialisation :

```bash
node scripts/init-admin.js
```

Cela créera un utilisateur admin avec les identifiants :
- Email: `admin@example.com`
- Mot de passe: `admin123`

**⚠️ Important : Changez ces identifiants en production !**

## Utilisation

### Accès à l'administration

1. Démarrez votre application : `npm run dev`
2. Allez sur : `http://localhost:3000/admin/login`
3. Connectez-vous avec les identifiants admin

### Gestion des projets

- **Dashboard** : `http://localhost:3000/admin`
- **Créer un projet** : `http://localhost:3000/admin/projects/new`

### API Endpoints

#### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription (optionnel)

#### Projets
- `GET /api/projects` - Récupérer tous les projets
- `POST /api/projects` - Créer un projet (authentifié)
- `GET /api/projects/[id]` - Récupérer un projet
- `PUT /api/projects/[id]` - Modifier un projet (authentifié)
- `DELETE /api/projects/[id]` - Supprimer un projet (authentifié)

#### Upload
- `POST /api/upload` - Upload d'image vers Cloudinary (authentifié)

## Structure des données

### Projet
```typescript
{
  _id: string
  title: string
  description: string
  image: string
  technologies: string[]
  tache: string[]
  githubUrl: string
  liveUrl: string
  private: boolean
  featured: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}
```

### Utilisateur
```typescript
{
  _id: string
  username: string
  email: string
  password: string (hashé)
  role: 'admin' | 'user'
  createdAt: Date
  updatedAt: Date
}
```

## Sécurité

- Les mots de passe sont hashés avec bcrypt
- Authentification JWT pour les routes protégées
- Validation des données côté serveur
- Protection CSRF intégrée

## Déploiement

### Variables d'environnement de production

Assurez-vous de configurer les variables d'environnement sur votre plateforme de déploiement :

- `MONGODB_URI` : URL de votre base MongoDB (MongoDB Atlas recommandé)
- `JWT_SECRET` : Clé secrète forte pour JWT
- `CLOUDINARY_*` : Identifiants Cloudinary

### Base de données

Pour la production, utilisez MongoDB Atlas ou un autre service MongoDB cloud.

## Support

En cas de problème, vérifiez :
1. Les variables d'environnement
2. La connexion MongoDB
3. Les logs de l'application
4. Les permissions Cloudinary
