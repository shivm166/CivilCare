# Migration Checklist - CivilCare Folder Structure

This checklist provides a step-by-step guide to migrate from the current structure to the production-grade structure.

## ⚠️ Before You Start

1. **Backup your code**: Commit all current changes to git
2. **Create a new branch**: `git checkout -b refactor/folder-structure`
3. **Review the guide**: Read `FOLDER_STRUCTURE_GUIDE.md` completely
4. **Test after each phase**: Don't proceed if something breaks

---

## Phase 1: Critical Fixes (Do First!)

### 1.1 Fix Middleware Typo
- [ ] Rename `backend/middlelware/` to `backend/middleware/`
- [ ] Find all imports: `grep -r "middlelware" backend/`
- [ ] Update all import statements (use find/replace)
- [ ] Test: Run backend and verify no import errors

**Files to update:**
- `backend/index.js`
- All route files that import middleware
- Any other files importing from middleware

### 1.2 Standardize Route File Naming
- [ ] Decide on naming convention (recommend: `.route.js`)
- [ ] Rename `complaint.routes.js` → `complaint.route.js`
- [ ] Update imports in `backend/index.js`
- [ ] Test: Verify all routes still work

### 1.3 Create Configuration Structure
- [ ] Create `backend/src/config/` folder
- [ ] Create `backend/src/config/database.js` (move DB connection logic)
- [ ] Create `backend/src/config/constants.js` (add app constants)
- [ ] Create `backend/src/config/env.js` (environment validation)
- [ ] Update imports in `backend/index.js`

---

## Phase 2: Backend Restructuring

### 2.1 Create Backend Source Structure
- [ ] Create `backend/src/` folder
- [ ] Create subfolders:
  - `src/controllers/`
  - `src/middleware/`
  - `src/models/`
  - `src/routes/`
  - `src/services/`
  - `src/utils/`
  - `src/config/`

### 2.2 Move and Organize Controllers
- [ ] Move `controllers/` → `src/controllers/`
- [ ] Organize by feature:
  - [ ] Create `src/controllers/auth/` (move auth-related)
  - [ ] Create `src/controllers/society/` (move society-related)
  - [ ] Create `src/controllers/complaint/` (move complaint-related)
  - [ ] Create `src/controllers/announcement/` (if exists)
  - [ ] Create `src/controllers/unit/` (if exists)
  - [ ] Create `src/controllers/request/` (move request-related)
  - [ ] Keep `src/controllers/superadmin/` as is

**Files to move:**
- `activation.controllers.js` → `src/controllers/auth/activation.controller.js`
- `user.controllers.js` → `src/controllers/auth/user.controller.js`
- `society.controllers.js` → `src/controllers/society/society.controller.js`
- `member.controllers.js` → `src/controllers/society/member.controller.js`
- `complaint.controllers.js` → `src/controllers/complaint/complaint.controller.js`
- `request.controllers.js` → `src/controllers/request/request.controller.js`

### 2.3 Move and Organize Middleware
- [ ] Move `middleware/` → `src/middleware/`
- [ ] Create `src/middleware/auth/` folder
- [ ] Move auth middleware:
  - `isProtected.js` → `src/middleware/auth/isProtected.js`
  - `checkSuperAdmin.js` → `src/middleware/auth/checkSuperAdmin.js`
  - `attachSocietyContext.js` → `src/middleware/auth/attachSocietyContext.js`
- [ ] Create `src/middleware/validation/` folder
- [ ] Create `src/middleware/validation/schemas/` folder
- [ ] Move validation files:
  - `validation.*.js` → `src/middleware/validation/schemas/`
- [ ] Move `validateMiddleware.js` → `src/middleware/validation/validateMiddleware.js`
- [ ] Create `src/middleware/errorHandler.js` (new file)

### 2.4 Move Models
- [ ] Move `models/` → `src/models/`
- [ ] Verify all model files are present
- [ ] No reorganization needed (keep as is)

### 2.5 Reorganize Routes
- [ ] Move `routes/` → `src/routes/`
- [ ] Create `src/routes/v1/` folder
- [ ] Move all route files to `v1/`:
  - [ ] `user.route.js` → `src/routes/v1/auth.route.js` (rename)
  - [ ] `society.route.js` → `src/routes/v1/society.route.js`
  - [ ] `complaint.route.js` → `src/routes/v1/complaint.route.js`
  - [ ] `member.route.js` → `src/routes/v1/member.route.js`
  - [ ] `request.route.js` → `src/routes/v1/request.route.js`
  - [ ] `activation.route.js` → `src/routes/v1/activation.route.js`
- [ ] Move `superadmin/` → `src/routes/v1/superadmin/`
- [ ] Update `src/routes/index.js` to use v1 routes
- [ ] Create `src/routes/health.route.js` (new health check)

### 2.6 Create Services Layer
- [ ] Create `src/services/` folder
- [ ] Create service files:
  - [ ] `src/services/auth.service.js`
  - [ ] `src/services/society.service.js`
  - [ ] `src/services/complaint.service.js`
  - [ ] `src/services/email.service.js` (move from utils)
  - [ ] `src/services/jwt.service.js` (move from utils)
- [ ] Extract business logic from controllers to services
- [ ] Update controllers to use services

### 2.7 Reorganize Utils
- [ ] Move `utils/` → `src/utils/`
- [ ] Create `src/utils/helpers/` folder
- [ ] Move helper functions:
  - `generateSocietyCode.js` → `src/utils/helpers/generateSocietyCode.js`
- [ ] Create new utility files:
  - [ ] `src/utils/logger.js` (new)
  - [ ] `src/utils/response.js` (new - standardized responses)
  - [ ] `src/utils/errors.js` (new - custom error classes)
  - [ ] `src/utils/permissions.js` (new)
- [ ] Move `db.js` → `src/config/database.js` (already done in 1.3)
- [ ] Move `jwtToken.js` → `src/services/jwt.service.js` (already done in 2.6)
- [ ] Move `sendEmail.js` → `src/services/email.service.js` (already done in 2.6)

### 2.8 Update Entry Point
- [ ] Move `index.js` → `src/index.js` OR keep at root and update imports
- [ ] Update all import paths in `index.js`
- [ ] Update `package.json` main/scripts if needed

### 2.9 Create Tests Structure
- [ ] Create `backend/tests/` folder
- [ ] Create subfolders:
  - `tests/unit/`
  - `tests/integration/`
  - `tests/fixtures/`

### 2.10 Environment Files
- [ ] Create `backend/.env.example`
- [ ] Document all required environment variables
- [ ] Add `.env` to `.gitignore` (if not already)

---

## Phase 3: Frontend Restructuring

### 3.1 Rename and Reorganize API Layer
- [ ] Rename `src/lib/` → `src/api/`
- [ ] Create `src/api/services/` folder
- [ ] Organize API files by feature:
  - [ ] `api/services/auth.api.js` (combine login, signup, etc.)
  - [ ] `api/services/society.api.js`
  - [ ] `api/services/complaint.api.js`
  - [ ] `api/services/announcement.api.js`
  - [ ] `api/services/unit.api.js`
  - [ ] `api/services/member.api.js`
  - [ ] `api/services/superadmin.api.js`
- [ ] Keep `api/axios.js` and `api/client.js` at root of api folder
- [ ] Create `api/endpoints.js` for endpoint constants

### 3.2 Reorganize Components
- [ ] Create `src/components/common/` (already exists, verify structure)
- [ ] Create `src/components/features/` folder
- [ ] Organize by feature:
  - [ ] `components/features/auth/`
  - [ ] `components/features/society/` (CreateSocietyModal, JoinSocietyModal)
  - [ ] `components/features/building/` (move from `components/building/`)
  - [ ] `components/features/complaint/` (new)
  - [ ] `components/features/announcement/` (new)
  - [ ] `components/features/member/` (move from `components/members/`)
  - [ ] `components/features/unit/` (new)
- [ ] Keep `components/layout/` as is
- [ ] Move root-level components to appropriate folders:
  - [ ] `RoleSocietySwitcher.jsx` → `components/role-based/RoleSocietySwitcher/`
- [ ] Create `components/role-based/PermissionGate/` (new)

### 3.3 Reorganize Pages
- [ ] Create `src/pages/auth/` folder
- [ ] Move auth pages:
  - [ ] `login/Login.jsx` → `pages/auth/Login/`
  - [ ] `signup/Signup.jsx` → `pages/auth/Signup/`
  - [ ] `activation/ActivateAccountPage.jsx` → `pages/auth/ActivateAccount/`
- [ ] Create `src/pages/public/` folder
- [ ] Move public pages:
  - [ ] `home/HomePage.jsx` → `pages/public/Home/`
  - [ ] `landing/LandingPage.jsx` → `pages/public/Landing/`
- [ ] Reorganize `pages/dashboard/` by role:
  - [ ] `pages/dashboard/SuperAdmin/` (move from `pages/superadmin/`)
  - [ ] `pages/dashboard/Admin/` (move from `pages/admin/` and `pages/features/`)
  - [ ] `pages/dashboard/Resident/` (create new, move from `pages/features/`)
- [ ] Remove `pages/features/` folder (consolidate into dashboard)
- [ ] Keep `pages/onboarding/` as is
- [ ] Create `pages/error/` folder:
  - [ ] Move `components/common/PageNotFound/` → `pages/error/NotFound/`

### 3.4 Reorganize Hooks
- [ ] Create `src/hooks/api/` folder
- [ ] Move API hooks:
  - [ ] `useLogin.js` → `hooks/api/useLogin.js`
  - [ ] `useSignup.js` → `hooks/api/useSignup.js`
  - [ ] `useLogout.js` → `hooks/api/useLogout.js`
  - [ ] `useAuthUser.js` → `hooks/api/useAuth.js` (rename)
  - [ ] `useProfile.js` → `hooks/api/useProfile.js`
  - [ ] `useCreateSociety.js` → `hooks/api/useSociety.js` (consolidate)
  - [ ] `useJoinRequest.js` → `hooks/api/useRequest.js` (rename)
  - [ ] `useComplaints.js` → `hooks/api/useComplaints.js`
  - [ ] `useAnnouncements.js` → `hooks/api/useAnnouncements.js` (new)
  - [ ] `useMembers.js` → `hooks/api/useMembers.js`
  - [ ] `useBuildings.js` → `hooks/api/useBuildings.js`
  - [ ] `useActivation.js` → `hooks/api/useActivation.js`
  - [ ] `useRequests.js` → `hooks/api/useRequests.js`
- [ ] Create `src/hooks/usePermissions.js` (new)
- [ ] Create `src/hooks/useDebounce.js` (new utility hook)

### 3.5 Rename Contexts
- [ ] Rename `src/context/` → `src/contexts/` (plural)
- [ ] Keep `SocietyContext.jsx` as is
- [ ] Consider creating `AuthContext.jsx` if needed

### 3.6 Create Utils Folder
- [ ] Create `src/utils/` folder
- [ ] Create utility files:
  - [ ] `utils/constants.js` (app-wide constants)
  - [ ] `utils/formatters.js` (date, currency, etc.)
  - [ ] `utils/validators.js` (form validation helpers)
  - [ ] `utils/permissions.js` (permission checking)
  - [ ] `utils/helpers.js` (misc helpers)

### 3.7 Reorganize Styles
- [ ] Create `src/styles/` folder
- [ ] Move `index.css` → `styles/index.css`
- [ ] Create `styles/variables.css` (CSS variables)
- [ ] Create `styles/utilities.css` (utility classes)

### 3.8 Update Routes
- [ ] Update `src/routes/` files with new import paths
- [ ] Create `src/routes/routeConfig.js` (route configuration object)
- [ ] Update all route imports

### 3.9 Create Tests Structure
- [ ] Create `frontend/tests/` folder
- [ ] Create subfolders:
  - `tests/unit/`
  - `tests/integration/`
  - `tests/e2e/`

### 3.10 Environment Files
- [ ] Create `frontend/.env.example`
- [ ] Document all required environment variables
- [ ] Add `.env` to `.gitignore` (if not already)

---

## Phase 4: Update All Imports

### 4.1 Backend Import Updates
- [ ] Update all imports in `src/index.js`
- [ ] Update all route files
- [ ] Update all controller files
- [ ] Update all middleware files
- [ ] Update all service files
- [ ] Test: Run backend and fix any import errors

### 4.2 Frontend Import Updates
- [ ] Update `src/main.jsx`
- [ ] Update `src/App.jsx`
- [ ] Update all route files
- [ ] Update all page components
- [ ] Update all hooks
- [ ] Update all API files
- [ ] Test: Run frontend and fix any import errors

---

## Phase 5: Testing and Verification

### 5.1 Backend Testing
- [ ] Start backend server: `npm run dev`
- [ ] Verify no import errors
- [ ] Test all API endpoints
- [ ] Check console for errors
- [ ] Verify middleware works
- [ ] Test authentication flow

### 5.2 Frontend Testing
- [ ] Start frontend: `npm run dev`
- [ ] Verify no import errors
- [ ] Test all pages load
- [ ] Test navigation
- [ ] Test API calls
- [ ] Check browser console for errors
- [ ] Test authentication flow

### 5.3 Integration Testing
- [ ] Test complete user flows
- [ ] Test role-based access
- [ ] Test society switching
- [ ] Test all CRUD operations
- [ ] Verify no broken features

---

## Phase 6: Cleanup

### 6.1 Remove Old Files
- [ ] Delete old empty folders
- [ ] Remove duplicate files
- [ ] Clean up unused imports
- [ ] Remove commented code

### 6.2 Update Documentation
- [ ] Update README.md
- [ ] Update API documentation
- [ ] Update architecture docs
- [ ] Document new structure

### 6.3 Git Cleanup
- [ ] Review all changes: `git status`
- [ ] Stage changes: `git add .`
- [ ] Commit: `git commit -m "refactor: restructure to production-grade folder structure"`
- [ ] Test on a fresh clone
- [ ] Create PR or merge to main

---

## Quick Reference: Import Path Updates

### Backend (Old → New)
```javascript
// Old
import userRouter from "./routes/user.route.js";
import connDB from "./utils/db.js";
import isProtected from "./middlelware/isProtected.js";

// New
import userRouter from "./src/routes/v1/auth.route.js";
import connDB from "./src/config/database.js";
import isProtected from "./src/middleware/auth/isProtected.js";
```

### Frontend (Old → New)
```javascript
// Old
import { useLogin } from "../hooks/useLogin";
import { api } from "../lib/api";
import Login from "../pages/login/Login";

// New
import { useLogin } from "../hooks/api/useLogin";
import { authApi } from "../api/services/auth.api";
import Login from "../pages/auth/Login";
```

---

## Troubleshooting

### Common Issues

1. **Import errors**: Check file paths are correct, verify case sensitivity
2. **Module not found**: Check if file was moved and import path updated
3. **Circular dependencies**: Review imports, may need to restructure
4. **Build errors**: Check all imports are updated, verify file extensions

### Verification Commands

```bash
# Backend
cd backend
npm run dev  # Should start without errors

# Frontend
cd frontend
npm run dev  # Should start without errors
npm run build  # Should build successfully
```

---

## Notes

- Work on one phase at a time
- Test after each major change
- Commit frequently with descriptive messages
- Ask for help if stuck
- Don't rush - quality over speed

---

**Status**: Ready to start
**Last Updated**: [Current Date]

