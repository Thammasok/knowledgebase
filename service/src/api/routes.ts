import authRouters from './auth/auth.route'
import healthRouters from './health/health.route'
import authSessionRouters from './auth-session/auth-session.route'
import accountRouters from './account/account.route'
import workspaceRouters from './workspace/workspace.route'
import folderRouters from './folder/folder.route'
import pageRouters from './page/page.route'
import collabRouters from './workspace/collab/collab.route'

// Routes
export default [
  healthRouters,
  authRouters,
  authSessionRouters,
  accountRouters,
  workspaceRouters,
  collabRouters,
  folderRouters,
  pageRouters,
]
