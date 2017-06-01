import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AccountService  {
    constructor(private http: Http) { }

    get(): Observable<any> {
        return this.http.get('api/account').map((res: Response) => res.json());
    }

    save(account: any): Observable<Response> {
        return this.http.post('api/account', account);
    }

    sendImage(image: File): Observable<Response> {
        const formData = new FormData();
        formData.append('file', image);
        const headers = new Headers({});
        return this.http.post('api/account/image', formData, new RequestOptions({headers}));
    }

    getEndereco(): Observable<string> {
        return this.http.get('api/endereco')
            .map((res) => (res.json().endereco));
    }
}
