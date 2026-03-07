export class AppError extends Error {
  public readonly status: number;
  public readonly isOperational: boolean;

  constructor(message: string, status: number, isOperational = true) {
    super(message);
    
    // Restores the correct prototype chain (needed when extending built-ins in TS)
    Object.setPrototypeOf(this, new.target.prototype);
    
    this.name = this.constructor.name;
    this.status = status;
    this.isOperational = isOperational;
    
    // Captures a clean stack trace excluding the constructor call itself
    Error.captureStackTrace(this, this.constructor);
  }
}