import {Injectable} from '@angular/core';
import {Item} from '../../dto/item';
import DbConnector from '../dbConnect';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  envStr = '';

  constructor() {
    this.envStr = `DataService[NEVER CLIENT]`;
  }

  _getItems(): any {
    return DbConnector.client.db('test_09_06').collection('items');
  }

  async getItems(): Promise<Item[]> {

    const collection: any = this._getItems();

    return new Promise(((resolve, reject) => {
      collection.find({}).toArray((err, items) => {
        if (err) {
          reject('Caught error\n' + JSON.stringify(err, null, 2));
        } else {
          console.log(`Items in DB`, items.length);
          resolve(items);
        }
      });
    }));
  }

}
