export class ValidationException extends Error {
  constructor(message: string) {
    super("[Validation Exception] " + message);
  }
}

export class DocumentNotFoundException extends Error {
  constructor(message: string) {
    super("[Document not found Exception] " + message);
  }
}

export class CartNotFoundException extends DocumentNotFoundException {
  constructor(message: string) {
    super("[CartNotFoundException] " + message);
  }
}
