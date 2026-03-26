export const globalApiPath = {
  defaultUrl: process.env.NEXT_PUBLIC_SERVICE_URL || 'http://localhost:3030',
  all: {
    url: 'default',
    path: {
      login: '/api/v1/auth/login',
      signup: '/api/v1/auth/signup',
      forgot: '/api/v1/auth/forgot/mail',
      refresh: '/api/v1/auth/refresh',
      sendOtp: '/api/v1/auth/verify/mail',
      verifyMail: '/api/v1/auth/verify/mail',
      resetPassword: '/api/v1/auth/password',
      requestAccess: '/api/v1/auth/request-access',
      registerInvite: '/api/v1/auth/signup/request-access',
    },
  },
}

export const authApiPath = {
  defaultUrl: 'http://localhost:3030',
  auth: {
    path: {
      logout: '/api/v1/auth/logout',
      getAuthSession: '/api/v1/auth-session',
      deactiveSession: '/api/v1/auth-session/deactivate',
    },
  },
  account: {
    path: {
      getAccountProfile: '/api/v1/account',
      updateAccountProfile: '/api/v1/account',
      getBasicAccountSetting: '/api/v1/account/setting/basic',
      updateBasicAccountSetting: '/api/v1/account/setting/basic',
    },
  },
  accountSetting: {
    getBasicSetting: '/api/v1/account/setting/basic',
    updateBasicSetting: '/api/v1/account/setting/basic',
  },
  workspace: {
    getWorkspaces: '/api/v1/workspace',
    createWorkspace: '/api/v1/workspace',
    updateWorkspace: '/api/v1/workspace',
  },
  customer: {
    createCustomer: '/api/v1/customer',
    updateCustomer: '/api/v1/customer',
    getCustomer: '/api/v1/customer',
    getCustomerById: '/api/v1/customer/:id',
    deleteCustomer: '/api/v1/customer',
    createAddress: '/api/v1/customer/address',
    updateAddress: '/api/v1/customer/address',
    deleteAddress: '/api/v1/customer/address/:id',
    getAddress: '/api/v1/customer/:id/address',
    createRelation: '/api/v1/customer/relation',
    updateRelation: '/api/v1/customer/relation',
    getRelation: '/api/v1/customer/:customerId/relation',
    deleteRelation: '/api/v1/customer/relation/:id',
    createContact: '/api/v1/customer/contact',
    updateContact: '/api/v1/customer/contact',
    deleteContact: '/api/v1/customer/:id/contact',
    getContact: '/api/v1/customer/:id/contact',
    getNotes: '/api/v1/customer/:id/note',
    createNote: '/api/v1/customer/:id/note',
    updateNote: '/api/v1/customer/:id/note/:noteId',
    deleteNote: '/api/v1/customer/:id/note/:noteId',
  },
  tag: {
    getTagGroup: '/api/v1/tag/group',
    createTagGroup: '/api/v1/tag/group',
    updateTagGroup: '/api/v1/tag/group',
    deleteTagGroup: '/api/v1/tag/group',
    checkTagGroupSlug: '/api/v1/tag/group/slug/:name',
    getTagGroupById: '/api/v1/tag/group/:id',
    getTag: '/api/v1/tag',
    createTag: '/api/v1/tag',
    updateTag: '/api/v1/tag',
    deleteTag: '/api/v1/tag',
    checkTagSlug: '/api/v1/tag/slug/:name',
  },
  address: {
    getAddress: '/api/v1/address',
  },
}
