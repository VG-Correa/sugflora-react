class Message<Data> {

  status: number;
  message: string | undefined;
  data: Data | undefined;
  error: boolean;

  constructor(
    status: number, 
    message: string | undefined = undefined,
    data: Data | undefined = undefined, 
    dataList: Data[] | undefined = undefined,
    error: boolean = false
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.error = error;
  }

}

export default Message;