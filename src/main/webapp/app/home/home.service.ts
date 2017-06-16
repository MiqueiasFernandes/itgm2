import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";

import {AccountService} from '../shared/';

import {Customize, CustomizeService} from '../entities/customize/';

@Injectable()
export class HomeService {

    constructor(
        private account: AccountService,
        private customizeService: CustomizeService,
    ) { }


    public getDesktop():Observable<string[][]> {
        return this.customizeService.getCustomize()
            .map((cusom: Customize) => {

                if(!cusom || !cusom.desktop || cusom.desktop.length < 1) {
                    return [];
                }

                return this.getCards(this.getLinhas(cusom.desktop));
            });
    }

    public injectIPcard(cards: string[][]):Observable<{}> {
        return this.account.getEndereco()
            .map(
                (endereco: string) => {
                   //endereco = endereco.replace('http:', 'https:');
                   //  endereco = endereco.replace(':80', '');
                    let array: string[][] = [];
                    let resolver: string[] = [];
                    cards.forEach((linha: string[]) => {
                        let cols = [];
                        linha.forEach((coluna: string) => {
                            const card: string[] = this.getCard(coluna, false);
                            const tipo:string = card !== null ? this.getTipo(card) : null;
                            if(tipo) {
                                const cod =  this.getCodigo(card).split(',');
                                let url = cod[1];
                                if(url.indexOf('|') > 0) {
                                    url = url.split('|')[1];
                                }
                                card[3] = this
                                    .criaCodigoParaArquivo(
                                        cod[0],
                                        endereco + '|' + url,
                                        tipo,
                                        cod[4], cod[2], cod[3], cod[4], cod[5]);
                                cols.push(card.join(':'));
                                // if(tipo === 'rbokeh') {
                                //     resolver.push((endereco + url));
                                // }
                            }else {
                                cols.push(coluna);
                            }
                        });
                        array.push(cols);
                    });
                    return [array, resolver, endereco];
                });
    }

    public getLinhas(desktop: string): string[] {
        return desktop.split(';');
    }

    public getColunas(linha: string): string[] {
        return linha.split(',');
    }

    public getCards(linhas: string[]): string[][] {

        let array = [];
        linhas.forEach((linha: string) => {
            array.push(this.getColunas(linha));
        });

        return array;
    }

    public getAllCards(cards: string[][]): string[] {
        let array = [];

        cards.forEach((linha: string[]) => {
            linha.forEach((card: string) => {
                array.push(card);
            });
        });

        return array;
    }


    public removeItem(linha: number, coluna: number, cards: string[][]): string[][] {
        const card =  cards[linha][coluna];
        cards[linha][coluna] = card.substring(0, card.lastIndexOf(':') + 1) + 'X';

        const cardsV = this.getCardsValidos(cards[linha], null)[0];

        if( !cardsV || (cardsV.length < 1)) {
            cards[linha] = null;
        }
        return cards;
    }

    public setCards(cards: string[][]) {

        let array  = [];

        cards.forEach((linha: string[]) => {
            if(linha && linha.length > 0) {
                array.push(linha.join(','));
            }
        });

        this.customizeService.customizeDesktop(array.join(';'));
    }


    public abrirArquivo(arquivo: string, url: string, texto: string,
                        size: number, caminho: string, width: number, height: number) {
        const tipo = this.getTipoPorExtensao(arquivo);
        this.insereCardOrdenado(
            this.getTamanhoIdealDeColuna(url, tipo),
            this.getClassePorTipo(url, tipo),
            tipo,
            this.criaCodigoParaArquivo(arquivo, url, tipo, texto, size, caminho, width, height)
        );
    }


    public getTamanhoIdealDeColuna(arquivo: string, tipo: string):number {
        switch (tipo) {
            case 'figura':
            case 'planilha':
            case 'rdata':
                return 2;
            case 'texto':
            case 'codigo':
                return 4;
            case 'rbokeh':
                return 6;
            default:
                return 2;
        }
    }

    public getTipoPorExtensao(arquivo: string): string {
        switch (this.getExtensao(arquivo)) {
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'bmp':
            case 'tiff':
                return 'figura';
            case 'html':
                return 'rbokeh';
            case 'R':
                return 'codigo';
            case 'txt':
                return 'texto';
            case 'csv':
                return 'planilha';
            case 'RData':
                return 'rdata';
            default:
                return "generic";
        }
    }

    public getExtensao(arquivo: string):string {
        const ext =  (arquivo.indexOf('.') >= 0) ? arquivo.split('.')[1] : '';
        return ext;
    }

    public getClassePorTipo(arquivo: string, tipo: string): string {
        let classe = "card jh-card";
        switch (tipo) {
            case 'figura':
                // classe += ' figura';
                break;
            case 'rbokeh':
                classe += ' meta';
                break;
            case 'texto':
                break;
            case 'codigo':
                break;
            case  'planilha':
                classe += ' meta';
            break;
            case 'rdata':
                classe += ' meta';
                break;
            default:
                classe += ' meta';
        }
        return classe;
    }

    public criaCodigoParaArquivo(nome: string, url: string, tipo: string, texto: string,
                                 size: any, caminho: string, width: any, height: any): string {
        let codigo = 'X';
        switch (tipo) {
            case 'figura':
                return btoa(nome + ',' + url + ',' + size + ',' + caminho + ',' + width + ',' + height);
            case 'rbokeh':
            case  'planilha':
            case 'rdata':
                return btoa(nome + ',' + url+ ',' + size + ',' + caminho );
            case 'texto':
            case 'codigo':
                return btoa(nome + ',' + url + ',' + size + ',' + caminho + ',' + texto);
        }
        return codigo;
    }

    public insereCardOrdenado(coluna: number, classe: string, tipo: string, codigo: string) {

        this.getDesktop().subscribe(
            (cards: string[][]) => {
                let array = [];
                let add = false;
                let added;
                cards.forEach((linha: string[]) => {
                    if(linha && linha.length > 0) {
                        if (!add && ((this.tamanhoColuna(linha) + coluna) <= 12)) {
                            const resp :[string[], boolean] = this.getCardsValidos(linha,
                                (added = (coluna + ':' + classe + ':' + tipo + ':' + codigo)));
                            linha = resp[0];
                            add = resp[1];
                        }
                        array.push(linha);
                    }
                });
                if (!add) {
                    cards.push([added = (coluna + ':' + classe + ':' + tipo + ':' + codigo)]);
                }else{
                    cards = array;
                }
                this.setCards(cards);
            }
        );

    }

    /// tamanho:classe:tipo:codigo

    public isCardValido(card: string, aceitaX: boolean): boolean {
        let parts = [];
        return (card &&
            (card.length > 0) &&
            (parts = card.split(':')).length === 4 &&
            (parts[0] && (parts[0].length > 0)) && (parseInt(parts[0]) <= 12)
            && parts[1] && parts[1].length > 2
            && parts[2] && parts[2].length > 2
            && (parts[3]) && (parts[3].length > 1 || (aceitaX && parts[3] === 'X'))
        );
    }

    public getCard(card: string, aceitaX: boolean):string[] {
        return this.isCardValido(card, aceitaX) ? card.split(':') : null;
    }

    public getTamanhoColuna(card: string[]):number {
        return parseInt(card[0]);
    }

    public getClasse(card: string[]):string {
        return card[1];
    }

    public getTipo(card: string[]):string {
        return card[2];
    }

    public getCodigo(card: string[]):string {
        return card[3] !== 'X' ? atob(card[3]) : 'X';
    }

    public getCardsValidos(cards: string[], substituto: string):[string[], boolean] {
        let array = [];

        cards.forEach((card: string) => {
            if(this.isCardValido(card, false)) {
                array.push(card);
            } else if(substituto) {
                array.push(substituto);
                substituto = null;
            }
        });

        if(substituto && ((this.tamanhoColuna(cards) + parseInt(substituto.split(':')[0])) <= 12 )) {
            array.push(substituto);
            substituto = null;
        }

        return [array, substituto === null];
    }

    public tamanhoColuna(cards: string[]):number {
        const crds = this.getCardsValidos(cards, null)[0];
        let tam: number = 0;
        if(crds && crds.length > 0) {
            crds.forEach((card: string) => {
                tam += parseInt(card.split(':')[0]);
            });
        }
        return tam;
    }

    public isText(file: string):boolean {
        return ['texto', 'codigo'].indexOf(this.getTipoPorExtensao(file)) >= 0;
    }

    public getNativeWnidow(){
        return window;
    }

}
