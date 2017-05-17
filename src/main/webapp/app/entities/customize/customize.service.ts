import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';

import { Customize } from './customize.model';

import {  UserService, User, Principal} from '../../shared/';
import { EventManager } from 'ng-jhipster';
import { Projeto } from '../projeto/';
import { Cenario } from '../cenario/';

@Injectable()
export class CustomizeService {

    private resourceUrl = 'api/customizes';

    constructor(
        private http: Http,
        private principal: Principal,
        private userService: UserService,
        private eventManager: EventManager,

    ) {
        this.registerLoginEvents();
    }

    registerLoginEvents() {
        this.eventManager.subscribe('logout', () => {
            this.eventManager
                .broadcast({ name: 'customizeListModification', content: 'OK'});
        });

        this.eventManager.subscribe('authenticationSuccess', () => {
            this.eventManager
                .broadcast({ name: 'customizeListModification', content: 'OK'});
        });

        this.principal.getAuthenticationState().subscribe( () => {
            this.eventManager
                .broadcast({ name: 'customizeListModification', content: 'OK'});
        });
    }

    create(customize: Customize): Observable<Customize> {
        const copy: Customize = Object.assign({}, customize);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            this.eventManager
                .broadcast({ name: 'customizeListModification', content: 'OK'});
            return res.json();
        });
    }

    update(customize: Customize): Observable<Customize> {
        const copy: Customize = Object.assign({}, customize);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            this.eventManager
                .broadcast({ name: 'customizeListModification', content: 'OK'});
            return res.json();
        });
    }

    find(id: number): Observable<Customize> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    query(req?: any): Observable<Response> {
        const options = this.createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            ;
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private createRequestOption(req?: any): BaseRequestOptions {
        const options: BaseRequestOptions = new BaseRequestOptions();
        if (req) {
            const params: URLSearchParams = new URLSearchParams();
            params.set('page', req.page);
            params.set('size', req.size);
            if (req.sort) {
                params.paramsMap.set('sort', req.sort);
            }
            params.set('query', req.query);

            options.search = params;
        }
        return options;
    }

    public getCustomize(): Observable<Customize> {
        return this.query({
            page: 0,
            size: 1,
            sort: ['id']
        }).map((res: Response ) => {
            const customize: Customize = res.json()[0];
            if (!customize ) {
                this.principal.identity().then((account) => {
                    this.userService
                        .getUser(account)
                        .subscribe((user: User) => {
                            const newCustomize: Customize =
                                new Customize(
                                    undefined, /// id
                                    true, /// sidebar
                                    'green', /// color
                                    undefined, /// avatar
                                    '', /// desktop
                                    user, /// user
                                    undefined, /// projeto
                                    undefined, //// cenario
                                );
                            newCustomize.sidebar = true;
                            this.create(newCustomize).subscribe(
                                (customize: Customize) => {
                                    alert('Sessão personalizada...');
                                    this.eventManager
                                        .broadcast({
                                            name: 'customizeListModification',
                                            content: 'OK'
                                        });
                                    return customize;
                                },
                                // () => { alert('Houve um erro ao personalizar sessão!'); }
                            );
                        });
                });
                return null;
            }
            return customize;
        });
    }

    public customizeSidebar(
        sidebar: boolean
    ) {
        this.getCustomize().subscribe(
            (customize: Customize) => {
                const newCustomize: Customize =
                    new Customize(
                        customize.id,
                        sidebar,
                        customize.color,
                        customize.avatar,
                        customize.desktop,
                        customize.user,
                        customize.projeto,
                        customize.cenario,
                    );
                newCustomize.sidebar = sidebar;
                this.update(newCustomize).subscribe(
                    () => {
                        this.eventManager
                            .broadcast({ name: 'customizeListModification', content: 'OK'});
                    }
                );
            }
        );
    }

    public customizeColor(
        color: string
    ) {
        this.getCustomize().subscribe(
            (customize: Customize) => {
                const newCustomize: Customize =
                    new Customize(
                        customize.id,
                        customize.sidebar,
                        color,
                        customize.avatar,
                        customize.desktop,
                        customize.user,
                        customize.projeto,
                        customize.cenario,
                    );
                newCustomize.sidebar = customize.sidebar;
                this.update(newCustomize).subscribe(
                    () => {
                        this.eventManager
                            .broadcast({ name: 'customizeListModification', content: 'OK'});
                    }
                );
            }
        );
    }

    public customizeProjeto(
        projeto: Projeto
    ) {
        this.getCustomize().subscribe(
            (customize: Customize) => {
                const newCustomize: Customize =
                    new Customize(
                        customize.id,
                        customize.sidebar,
                        customize.color,
                        customize.avatar,
                        customize.desktop,
                        customize.user,
                        projeto,
                        undefined, ///////////////<------------ O PROJETO DEVE SER CUSTOMIZADO ANTES
                    );
                newCustomize.sidebar = customize.sidebar;
                this.update(newCustomize).subscribe(
                    () => {
                        this.eventManager
                            .broadcast({ name: 'customizeListModification', content: 'OK'});
                    }
                );
            }
        );
    }

    public customizeCenario(
        cenario: Cenario
    ) {
        this.getCustomize().subscribe(
            (customize: Customize) => {
                const newCustomize: Customize =
                    new Customize(
                        customize.id,
                        customize.sidebar,
                        customize.color,
                        customize.avatar,
                        customize.desktop,
                        customize.user,
                        customize.projeto,
                        cenario,
                    );
                newCustomize.sidebar = customize.sidebar;
                this.update(newCustomize).subscribe(
                    () => {
                        this.eventManager
                            .broadcast({ name: 'customizeListModification', content: 'OK'});
                    }
                );
            }
        );
    }

    public customizeDesktop(
        desktop: string,
    ) {
        this.getCustomize().subscribe(
            (customize: Customize) => {
                const newCustomize: Customize =
                    new Customize(
                        customize.id,
                        customize.sidebar,
                        customize.color,
                        customize.avatar,
                        desktop,
                        customize.user,
                        customize.projeto,
                        customize.cenario,
                    );
                newCustomize.sidebar = customize.sidebar;
                this.update(newCustomize).subscribe(
                    () => {
                        this.eventManager
                            .broadcast({ name: 'customizeListModification', content: 'OK'});
                    }
                );
            }
        );
    }

}
