export type RouteTypes = {
  version: string
  path: string
  routers: RoutersTypes[]
}

type RoutersTypes = {
  route: string
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  auth?: boolean
  useRefreshToken?: boolean
  middleware?: Function[]
  validate?: {
    type: 'body' | 'query' | 'params'
    schema: object
  }
  handler: Function
}
