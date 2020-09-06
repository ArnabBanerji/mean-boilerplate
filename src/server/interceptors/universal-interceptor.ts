import {Injectable, Inject, Optional, PLATFORM_ID, InjectionToken} from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse} from '@angular/common/http';
import {Request} from 'express';
import {REQUEST} from '@nguniversal/express-engine/tokens';
import {Observable, of} from 'rxjs';
import {DataService} from '../data/data.service';
import {isPlatformServer} from '@angular/common';
import {Item} from '../../dto/item';

@Injectable()
export class UniversalInterceptor implements HttpInterceptor {

  isServer: boolean;
  envStr = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: InjectionToken<any>,
    private dataService: DataService,
    @Optional() @Inject(REQUEST) protected request: Request) {
    console.log('Interceptor Constructor');
    this.isServer = isPlatformServer(platformId);
    this.envStr = `UniversalInterceptor [${this.isServer ? 'server' : 'client'}]`;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let serverReq: HttpRequest<Item[]> = req;
    if (this.request) {

      // /* Below is a (failed) attempt to not rely on a loopback and directly use the response*/
      // switch (req.url) {
      //   case '/api/items': {
      //     console.log(this.envStr, 'API Intercepted');
      //     const hResp = new HttpResponse({
      //       status: 200,
      //       body: [{
      //
      //         itemName: 'Item 1',
      //         itemProps: [
      //           'Prop1',
      //           'Prop2'
      //         ]
      //       }, {
      //         itemName: 'Item 2',
      //         itemProps: [
      //           'Prop1',
      //           'Prop2'
      //         ]
      //       }, {
      //
      //         itemName: 'Item 3',
      //         itemProps: [
      //           'Prop1',
      //           'Prop2'
      //         ]
      //       }, {
      //
      //         itemName: 'Item 4',
      //         itemProps: [
      //           'Prop1',
      //           'Prop2'
      //         ]
      //       }, {
      //
      //         itemName: 'Item 5',
      //         itemProps: [
      //           'Prop1',
      //           'Prop2'
      //         ]
      //       }, {
      //
      //         itemName: 'Item 6',
      //         itemProps: [
      //           'Prop1',
      //           'Prop2'
      //         ]
      //       }, {
      //
      //         itemName: 'Item 7 test AB',
      //         itemProps: [
      //           'Prop1',
      //           'Prop2'
      //         ]
      //       }, {
      //         itemName: 'Item 8',
      //         itemProps: [
      //           'Prop1',
      //           'Prop2'
      //         ]
      //       }, {
      //         itemName: 'Item 9',
      //         itemProps: [
      //           'Prop1',
      //           'Prop2'
      //         ]
      //       }, {
      //         itemName: 'Item 10',
      //         itemProps: [
      //           'Prop1',
      //           'Prop2'
      //         ]
      //       }]
      //     });
      //
      //     return of(hResp);
      //   }
      // }

      let newUrl = `${this.request.protocol}://${this.request.get('host')}`;
      if (!req.url.startsWith('/')) {
        newUrl += '/';
      }
      newUrl += req.url;
      serverReq = req.clone({url: newUrl});
    }
    return next.handle(serverReq);
  }
}
