class HttpException extends Error {
  status: number;
  reason: string;
  constructor(reason: string, status: number) {
    super();
    this.status = status;
    this.reason = reason;
  }
}

export default HttpException;
