# 📁 AssurOnline Project Structure

## 🏗️ Clean Architecture Overview

```
assuronline-auto-moto/
├── 📁 backend/                    # Backend API (Node.js/Express)
│   ├── 📁 src/                    # Source code
│   │   ├── 📁 core/               # Core business logic
│   │   │   ├── 📁 domain/         # Domain models & entities
│   │   │   └── 📁 application/    # Application controllers
│   │   ├── 📁 features/           # Feature-based modules
│   │   ├── 📁 infrastructure/     # Infrastructure layer
│   │   └── 📁 shared/             # Shared utilities
│   ├── 📁 database/               # Database files
│   │   ├── 📄 assuronline_complete.sql
│   │   └── 📄 README.md
│   ├── 📁 scripts/                # Backend utility scripts
│   ├── 📁 tests/                  # All backend tests
│   ├── 📁 uploads/                # File uploads
│   ├── 📄 package.json
│   └── 📄 README.md
├── 📁 frontend/                   # React frontend
│   ├── 📁 src/                    # Source code
│   │   ├── 📁 app/                # Application components
│   │   ├── 📁 features/           # Feature components
│   │   ├── 📁 shared/             # Shared components
│   │   └── 📁 assets/             # Static assets
│   ├── 📁 public/                 # Public assets
│   ├── 📄 package.json
│   └── 📄 README.md
├── 📁 docs/                       # All documentation
│   ├── 📁 reports/                # Word documents
│   │   └── 📄 RAPPORT_PFE_ASSURONLINE.docx
│   ├── 📁 adrs/                   # Architecture Decision Records
│   ├── 📁 sequences/              # Sequence diagrams
│   ├── 📄 architecture.md
│   ├── 📄 project-structure.md
│   ├── 📄 RAPPORT_PFE_ASSURONLINE.md
│   └── 📄 README.md
├── 📁 scripts/                    # All setup scripts
│   ├── 📄 setup.ps1
│   ├── 📄 setup.bat
│   ├── 📄 generate-docs.js
│   └── 📄 README.md
├── 📄 package.json                # Monorepo configuration
├── 📄 docker-compose.yml          # Docker orchestration
├── 📄 README.md                   # Main project documentation
├── 📄 LICENSE                     # License file
└── 📄 test-claims.js              # Claims functionality test
```

## 🎯 Key Improvements Made

### 1. **Feature-Based Architecture**
- Organized code by business features (auth, quotes, policies, claims, payments)
- Clear separation between domain, application, and infrastructure layers
- Shared utilities and components properly organized

### 2. **Consolidated Documentation**
- All documentation moved to `docs/` directory
- Single source of truth for each type of documentation
- Clear separation between technical docs and reports

### 3. **Simplified Scripts**
- All setup scripts consolidated into essential scripts
- Clear separation between backend and frontend scripts
- Unified documentation for all scripts

### 4. **Database Cleanup**
- Single comprehensive database file: `backend/database/assuronline_complete.sql`
- All redundant database files removed
- Complete documentation in `backend/database/README.md`

### 5. **Test Organization**
- All tests properly organized in `backend/tests/`
- Moved scattered test files to proper locations
- Consolidated test files to avoid duplication

## 📊 Cleanup Statistics

### **Files Removed: 45+ files**
- **Documentation files:** 15+ redundant .md files
- **Database files:** 4 duplicate .sql files  
- **Script files:** 15+ redundant scripts
- **Test files:** 3 duplicate test files
- **Word documents:** 2 redundant .docx files
- **Root files:** 6 scattered files

### **Files Kept: 25+ essential files**
- **Core application files:** All source code
- **Essential documentation:** 5-6 consolidated docs
- **Database:** 1 comprehensive SQL file
- **Scripts:** 3-4 essential scripts
- **Configuration:** All package.json and config files

### **Space Savings:**
- **File count reduction:** ~65% (from 70+ to 25+ files)
- **Documentation consolidation:** 15+ files → 5-6 files
- **Script consolidation:** 15+ files → 3-4 files
- **Database cleanup:** 5 files → 1 file

## 🚀 Benefits of New Structure

1. **Maintainability:** Clear separation of concerns
2. **Scalability:** Feature-based organization
3. **Documentation:** Single source of truth
4. **Setup:** Simplified with fewer scripts
5. **Testing:** Properly organized test structure
6. **Development:** Easier to navigate and understand

## 🔧 Development Workflow

### **Backend Development:**
```bash
cd backend
npm install
npm run dev
```

### **Frontend Development:**
```bash
cd frontend
npm install
npm start
```

### **Full Stack Development:**
```bash
npm run dev  # Runs both backend and frontend
```

### **Database Setup:**
```bash
# Import the complete database
mysql -u root -p < backend/database/assuronline_complete.sql
```

### **Testing:**
```bash
# Backend tests
cd backend
npm test

# Claims functionality test
node test-claims.js
```

This structure provides a clean, maintainable, and professional codebase that's easy to navigate and develop with.
