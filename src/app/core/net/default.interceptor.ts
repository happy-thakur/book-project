import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpEvent,
  HttpResponseBase,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

const CODEMESSAGE = {
  200: 'The server successfully returned the requested data.',
  201: 'New or modified data was successful.',
  202: 'A request has been queued in the background (asynchronous task).',
  204: 'Data deleted successfully.',
  400: 'There was an error in the request, and the server did not create or modify data.',
  401: 'The user does not have permissions (token, username, password error).',
  403: 'The user is authorized, but access is prohibited.',
  404: 'The request was made for a record that does not exist, and the server did not perform an operation.',
  406: 'The requested format is not available.',
  410: 'The requested resource is permanently deleted and is no longer available.',
  422: 'When creating an object, a validation error occurred.',
  500: 'A server error occurred. Please check the server.',
  502: 'Gateway error.',
  503: 'Services are unavailable and the server is temporarily overloaded or maintained.',
  504: 'Gateway timed out.',
};

/**
 * The default HTTP interceptor, see its registration details `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) { }

  private get notification(): NzNotificationService {
    return this.injector.get(NzNotificationService);
  }

  private goTo(url: string) {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  private checkStatus(ev: HttpResponseBase) {
    if ((ev.status >= 200 && ev.status < 300) || ev.status === 401) {
      return;
    }

    const errortext = CODEMESSAGE[ev.status] || ev.statusText;
    this.notification.error(`Request error ${ev.status}: ${ev.url}`, errortext);
  }

  private handleData(ev: HttpResponseBase): Observable<any> {
    // May be because `throw` Export cannot be performed `_HttpClient` of `end()` operating
    if (ev.status > 0) {
      this.injector.get(_HttpClient).end();
    }
    this.checkStatus(ev);
    // Business processing: some common operations
    switch (ev.status) {
      case 200:
        // Business level error handling, the following is assuming that restful has a unified output format (meaning corresponding data format regardless of success or failure)
        // For example response content:
        //  Error content:{ status: 1, msg: 'Illegal parameter' }
        //  Correct content:{ status: 0, response: {  } }
        // Then the following code snippet can be directly applied
        if (ev instanceof HttpResponse) {
          const body: any = ev.body;
          if (body && !body.status) {
            this.notification.error((body.error && body.error.msg), 'Error');
            return of(new HttpResponse({ ...ev, body: body.error || {} }));
          } else {
            // Re-edit `body` Content is `response` Content, for most scenarios no longer need to care about the business status code
            return of(new HttpResponse({ ...ev, body: body.result }));
            // Or still keep the full format
            // return of(event);
          }
        }
        break;
      case 401:
        this.notification.error(`Not logged in or expired, please log in again.`, ``);
        // Empty token information
        (this.injector.get(DA_SERVICE_TOKEN) as ITokenService).clear();
        this.goTo('/passport/login');
        break;
      case 403:
      case 404:
      case 500:
        if (ev instanceof HttpErrorResponse) {
          const body: any = ev.error;
          const errortext = ev.statusText || CODEMESSAGE[ev.status];
          this.notification.error(body.message, errortext);
          return of(new HttpErrorResponse({ ...ev, error: body || {} }));
        }
        break;
      default:
        if (ev instanceof HttpErrorResponse) {
          console.warn('Unknown errors, mostly due to backends that do not support CORS or invalid configuration', ev);
          return throwError(ev);
        }
        break;
    }
    return of(ev);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Uniformly add server-side prefix
    let url = req.url;
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      url = environment.SERVER_URL + url;
    }

    const newReq = req.clone({ url });
    return next.handle(newReq).pipe(
      mergeMap((event: any) => {
        // Allows unified request error handling
        if (event instanceof HttpResponseBase) return this.handleData(event);
        // If everything is normal, follow up
        return of(event);
      }),
      catchError((err: HttpErrorResponse) => this.handleData(err)),
    );
  }
}
