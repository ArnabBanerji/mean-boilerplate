import {Inject, Injectable, Injector, PLATFORM_ID} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {MessageService} from '../message/message.service';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Item} from '../../../dto/item';
import {makeStateKey, TransferState} from '@angular/platform-browser';
import {isPlatformServer} from '@angular/common';

const storageKey = makeStateKey('items');

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  isServer: boolean;
  apiUrl = '/api/items';

  envStr = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private httpService: HttpClient,
    private messageService: MessageService,
    private injector: Injector,
    private state: TransferState
  ) {
    this.isServer = isPlatformServer(platformId);
    this.envStr = `ItemService [${this.isServer ? 'server' : 'client'}]`;
  }


  getItems(isInit: boolean): Observable<Item[]> {
    console.log(this.envStr, `getItems Called.`);


    if (this.isServer) {
      console.log(this.envStr, 'Server to set state');
    } else {
      if (isInit) {
        const serverState = this.state.get(storageKey, []);
        console.log(this.envStr, `HaveServerState`, serverState);
        return of(serverState);
      } else {
        console.log(this.envStr, 'Non-init');
      }
    }

    return this.httpService.get<Item[]>(this.apiUrl)
      .pipe(
        tap((items) => {

          if (this.isServer) {
            this.state.set(storageKey, items);
          }

          this.log('Fetched Data');
        }, _ => {
          console.log(this.envStr, 'Fetch Error', _);
          catchError(this.handleError<Item[]>('get Data', []));
        }, () => {
          console.log(this.envStr, 'Fetch Complete');
        }),
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string): void {
    console.log(this.envStr, message);
    this.messageService.add(`DataService: ${message}`);
  }
}
