import * as mongo from 'mongodb';

export default class DbConnector {
  public static client: mongo.MongoClient;

  constructor() {
  }

  public static connect(url: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      mongo.MongoClient.connect(url, {useNewUrlParser: true}, (err, client: mongo.MongoClient) => {
        if (err) {
          reject(err);
        } else {
          DbConnector.client = client;
          resolve(client);
        }
      });
    });
  }

  public disconnect(): void {
    DbConnector.client.close();
  }
}

