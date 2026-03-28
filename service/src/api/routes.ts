import authRouters from './auth/auth.route'
import healthRouters from './health/health.route'
import authSessionRouters from './auth-session/auth-session.route'
import accountRouters from './account/account.route'
import workspaceRouters from './workspace/workspace.route'
import folderRouters from './folder/folder.route'
import pageRouters from './page/page.route'

// Routes
export default [
  healthRouters,
  authRouters,
  authSessionRouters,
  accountRouters,
  workspaceRouters,
  folderRouters,
  pageRouters,
]
