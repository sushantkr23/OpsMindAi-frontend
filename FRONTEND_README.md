# OpsMind AI - Frontend

Complete React frontend for OpsMind AI - Enterprise Knowledge Assistant

## 🎯 Features

- **Authentication**: Login/Register with JWT
- **Chat Interface**: Real-time Q&A with document context
- **Document Management**: Upload, list, and manage PDFs
- **Admin Dashboard**: Analytics, user management, system health
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Live streaming responses from AI

## 📦 Installation

```bash
cd frontend
npm install
```

## 🚀 Development

```bash
npm run dev
```

Server runs on `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Chat/              # Chat interface components
│   ├── Layout/            # Navbar, Sidebar, Footer
│   ├── Upload/            # Document upload
│   ├── Admin/             # Admin dashboard components
│   └── Common/            # Shared components
├── pages/
│   ├── Home.jsx           # Main chat page
│   ├── Login.jsx          # Auth page
│   └── AdminPanel.jsx     # Admin dashboard
├── context/
│   └── AuthContext.jsx    # Auth state management
├── hooks/
│   └── useAuth.js         # Auth hook
├── services/
│   └── api.js             # API client
├── styles/
│   ├── auth.css
│   ├── home.css
│   ├── chat.css
│   ├── navbar.css
│   ├── upload.css
│   └── admin.css
└── App.jsx                # Main app component
```

## 🔑 Key Components

### Authentication
- **Login/Register**: Email & password authentication
- **JWT Token**: Stored in localStorage
- **Protected Routes**: Redirect to login if not authenticated

### Chat Interface
- **Message Display**: User and AI messages
- **Citation Cards**: Show sources with page numbers
- **Document Selection**: Filter queries by documents
- **Real-time Streaming**: Live AI response streaming

### Admin Dashboard
- **Overview**: System statistics
- **Users**: User management and roles
- **Analytics**: Query statistics and insights

## 🔌 API Integration

All API calls go through `services/api.js`:

```javascript
// Auth
authAPI.login(email, password)
authAPI.register(name, email, password)

// Queries
queryAPI.ask(question, documentIds)
queryAPI.askStream(question, documentIds)

// Documents
documentAPI.list()
documentAPI.getDetails(documentId)
documentAPI.delete(documentId)
documentAPI.share(documentId, userIds)

// Upload
uploadAPI.uploadDocument(file)

// Admin
adminAPI.getDashboard()
adminAPI.getStats(startDate, endDate)
adminAPI.getUsers(page, limit, role, search)
```

## 🎨 Styling

- **CSS Variables**: Consistent color scheme
- **Responsive**: Mobile-first design
- **Dark Mode Ready**: Easy to implement

## 📱 Responsive Breakpoints

- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## 🔐 Security

- JWT authentication
- Secure token storage
- CORS enabled
- Input validation
- XSS protection

## 🚀 Build

```bash
npm run build
```

Creates optimized production build in `dist/`

## 📊 Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing

```bash
npm run lint
```

## 📚 Dependencies

- **React 19**: UI framework
- **React Router**: Navigation
- **Axios**: HTTP client
- **React Hot Toast**: Notifications
- **Recharts**: Charts & graphs
- **Socket.io**: Real-time communication

## 🎯 Usage Flow

1. **Register/Login**: Create account or login
2. **Upload Documents**: Add PDF files to knowledge base
3. **Ask Questions**: Query documents with natural language
4. **View Answers**: Get AI responses with citations
5. **Admin Panel**: Manage users and analytics (admin only)

## 🔄 State Management

- **AuthContext**: Global auth state
- **Local State**: Component-level state with useState
- **API Calls**: Handled through services

## 🌐 API Endpoints

Backend runs on `http://localhost:5000`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Queries
- `POST /api/query/ask`
- `POST /api/query/ask-stream`

### Documents
- `GET /api/documents`
- `GET /api/documents/:id`
- `DELETE /api/documents/:id`
- `POST /api/documents/:id/share`

### Upload
- `POST /api/upload`

### Admin
- `GET /api/admin/dashboard/overview`
- `GET /api/admin/stats`
- `GET /api/admin/users`
- `PUT /api/admin/user/:id/role`

## 🐛 Troubleshooting

**API Connection Error**
- Check backend is running on port 5000
- Verify VITE_API_URL in .env

**Login Failed**
- Ensure backend is running
- Check credentials are correct
- Verify MongoDB connection

**Upload Failed**
- Check file is PDF format
- Verify file size < 50MB
- Check backend upload endpoint

## 📝 Notes

- Frontend uses Vite for fast development
- All API calls include JWT token automatically
- Responsive design works on all devices
- Admin features only visible to admin users

## 🚀 Production Deployment

```bash
npm run build
# Deploy dist/ folder to hosting service
```

---

**Frontend is fully functional and production-ready! 🎉**
