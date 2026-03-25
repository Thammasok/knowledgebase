import authRouters from './auth/auth.route'
import healthRouters from './health/health.route'
import authSessionRouters from './auth-session/auth-session.route'
import accountRouters from './account/account.route'
import teamRouters from './team/team.route'

// Routes
export default [
  healthRouters,
  authRouters,
  authSessionRouters,
  accountRouters,
  teamRouters,
]
