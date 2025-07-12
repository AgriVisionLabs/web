# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Agrivision Web Application

## Google OAuth Setup

To enable Google login functionality, you need to:

1. **Create a Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google OAuth:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Set application type to "Web application"
   - Add your authorized origins:
     - `http://localhost:5173` (for development)
     - Your production domain

3. **Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

4. **Backend Integration:**
   Your backend should handle the `/auth/google` endpoint and accept:
   ```json
   {
     "access_token": "google_access_token",
     "user_info": {
       "id": "user_id",
       "email": "user@example.com",
       "name": "User Name",
       "picture": "profile_picture_url"
     }
   }
   ```

## Development

```bash
npm install
npm run dev
```
