export class EmailAlreadyExistsError extends Error {
  constructor(message: string = 'email already exists') {
    super(message)
    this.name = 'EmailAlreadyExistsError'
  }
}