import {Component, ElementRef, OnInit, AfterViewInit} from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';
import {DomSanitizer} from '@angular/platform-browser';

///https://www.npmjs.com/package/angular2-highlight-js
// import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js';


import { Http, Response } from '@angular/http';
import { Customize, CustomizeService } from '../entities/';

import { Account, LoginModalService, Principal } from '../shared';

import {HomeService} from './home.service';

import {
    trigger,
    state,
    style,
    animate,
    transition,
    keyframes,
    group
} from '@angular/animations';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: [
        'home.scss'
    ],
    animations: [
        trigger('flyInOut', [
            state('in', style({transform: 'translateX(0)'})),
            state('out', style({opacity: 0, transform: 'translateX(100%)',  offset: 1.0})),
            transition('void => *', [
                animate(300, keyframes([
                    style({opacity: 0, transform: 'translateX(-100%)', offset: 0}),
                    style({opacity: 1, transform: 'translateX(15px)',  offset: 0.3}),
                    style({opacity: 1, transform: 'translateX(0)',     offset: 1.0})
                ]))
            ]),
            transition('in => *', [
                animate(300, keyframes([
                    style({opacity: 1, transform: 'translateX(0)',     offset: 0}),
                    style({opacity: 1, transform: 'translateX(-15px)', offset: 0.7}),
                    style({opacity: 0, transform: 'translateX(100%)',  offset: 1.0})
                ]))
            ])
        ])
    ]
})
export class HomeComponent implements OnInit, AfterViewInit {
    account: Account;
    modalRef: NgbModalRef;
    desktop = false;
    endereco = null;
    cards = [];
    dropdows = [];
    htmls = [];
    resolvidos = [];
    windowRef :any;
    transitions = [];

//     codigo = '             este é um codigo em r  {\
//     for(i in 1:50) {\
//     a <- function(c, d) {\
//     print(k++);\
// }\
// \
// }\
// a=g+5;\
// }';


    // btoa('string,;;\'\'``´´~~ ^ ^ fim da string\\//?????ª||º::..,,;;');
    ///2:card jh-card:texto:oi,2:card jh-card:texto:oi,2:card jh-card:texto:oi,2:card jh-card:texto:oi,2:card jh-card:texto:oi,2:card jh-card:texto:oi;3:card jh-card:texto:oi,3:card jh-card:texto:oi,3:card jh-card:texto:oi,3:card jh-card:texto:oi;4:card jh-card:texto:oi,4:card jh-card:texto:oi,4:card jh-card:texto:oi;6:card jh-card:texto:oi,6:card jh-card:texto:oi;12:card jh-card:texto:c3RyaW5nLDs7JydgYLS0fn4gXiBeIGZpbSBkYSBzdHJpbmdcLy8/Pz8/P6p8fLo6Oi4uLCw7Ow==


    constructor(
        private http: Http,
        private jhiLanguageService: JhiLanguageService,
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: EventManager,
        private customizeService: CustomizeService,
        private homeService: HomeService,
        public domSanitizer: DomSanitizer,
    ) {
        this.jhiLanguageService.setLocations(['home']);
        this.windowRef = homeService.getNativeWnidow();
        // $(function () {
        //     $('.card').draggable({ handle: 'h2'});
        // })
// this.iframe = this.domSanitizer
//     .bypassSecurityTrustResourceUrl('http://179.109.9.94:8099/temp/nn78rmduuvim2nkipv60vji3v5.html');
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
        this.updateFromCustomize();


    }
    ngAfterViewInit() {
        // $(this.el.nativeElement).draggable();
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account) => {
                this.account = account;
            });
        });

        this.eventManager.subscribe('logout', () =>{
            this.desktop = false;
        });

        this.eventManager.subscribe('customizeListModification', () => {
            this.updateFromCustomize();
        });
    }

    updateFromCustomize() {
        this.homeService.getDesktop()
            .subscribe(
                (cards: string[][]) => {
                    this.homeService.injectIPcard(cards)
                        .subscribe(
                            (cardss: [string[][], string[]]) => {
                                const cards =  cardss[0];
                                cards.forEach((linha: string[], l:number) => {
                                    linha.forEach((card: string, c:number) => {

                                        if (!(this.cards[l] &&
                                            this.cards[l][c] &&
                                            this.cards[l][c].localeCompare(card) === 0)) {
                                            if( !this.cards[l]) {
                                                this.cards[l] = [];
                                            }
                                            this.cards[l][c] = card;
                                        }

                                        this.transitions[this.getID(l, c)] = 'in';
                                    });
                                });
                                this.desktop = cards.length > 0;
                                this.endereco = cardss[2];
                                cardss[1].forEach((url: string) => {
                                    this.resolvidos[url.split('/')[4].replace('.', '')] = this.domSanitizer
                                        .bypassSecurityTrustResourceUrl(url);
                                });
                            }
                        );
                }
            );
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

/// tamanho:classe:tipo:codigo


    getCardWithX(coluna: string):string[] {
        return this.homeService.getCard(coluna, true);
    }

    getCard(coluna: string):string[] {
        return this.homeService.getCard(coluna, false);
    }

    getCardByID(id: number):string[] {
        const lc = this.getLC(id);
        return this.getCardByLC(lc[0], lc[1]);
    }

    getCardByLC(l: number,c:number): string[] {
        return this.homeService.getCard(this.cards[l][c], false);
    }

    public getTamanhoColuna(card: string[]):number {
        return this.homeService.getTamanhoColuna(card);
    }

    public getClasse(card: string[]):string {
        return this.homeService.getClasse(card);
    }

    public getTipo(card: string[]):string {
        return this.homeService.getTipo(card);
    }

    public getCodigo(card: string[]):string {
        return this.homeService.getCodigo(card);
    }

    getNomeDoArquivo(card: string[]): string {
        return this.getCodigo(card).split(',')[0];
    }

    getURL(card: string[]): string {
        return this.getCodigo(card).split(',')[1].replace('|', '');
    }

    getURLResolvidos(card: string[]): string {
        return this.getURL(card).split('/')[4].replace('.','');
    }

    getText(card: string[]):string {
        try {
            return this.getCodigo(card)
                .split(',')[4]
                .split('.')
                .map((linha: string) => {
                    return atob(linha);
                })
                .join('<br>');
        }catch (ex) {
            return 'impossivel ler o codigo: ' + ex;
        }
    }

    getSize(card: string[]):string {
        const tam = parseInt(this.getCodigo(card).split(',')[2]);
        if(tam > (1024 * 1024)) {
            return Math.ceil(tam/(1024 * 1024)) + ' Mb';
        } else if (tam > 1024){
            return Math.ceil(tam/1024) + ' Kb';
        }
        return tam + ' bytes';
    }

    getCaminho(card: string[]):string {
        return this.getCodigo(card).split(',')[3];
    }

    getWidth(card: string[]):string {
        return this.getCodigo(card).split(',')[4];
    }

    getHeight(card: string[]):string {
        return this.getCodigo(card).split(',')[5];
    }

    toogleDropDown(id: number) {
        // this.closeDropDown();
        this.dropdows[id] = !this.dropdows[id];
    }

    closeDropDown() {
        this.dropdows = [];
    }

    getID(l: number,c:number):number {
        return l*100 + c;
    }

    getLC(id: number):number[] {
        return [Math.floor(id/100), id % 100];
    }

    estAberto(card: string[]):boolean {
        return this.getClasse(card).indexOf('meta') < 0;
    }

    isResize(card: string[]):boolean {
        return ['figura', 'rbokeh', 'texto', 'codigo'].indexOf(this.getTipo(card)) >= 0;
    }

///////////////////////////////////////////////////////////////////////////////

    isDestacavel(card: string[]):boolean {
        return ['figura', 'rbokeh', 'planilha', 'texto', 'codigo'].indexOf(this.getTipo(card)) >= 0;
    }

    destacar(id: number, carde: any) {
        const rect = carde.getBoundingClientRect();
        const card = this.getCardByID(id);
        const tipo = this.getTipo(card);
        const url = this.getURL(card);
        const myWindow = window.open(url,
            '_blank',
            'fullscreen=no,' +
            'menubar=no,' +
            'toolbar=no,' +
            'location=yes,' +
            'resizable=yes,' +
            'top=' + (rect.top + 100) + ',' +
            'left=' + rect.left + ',' +
            'height=' + (tipo === 'figura' ? this.getHeight(card): '500') + ',' +
            'width=' + (tipo === 'figura' ? this.getWidth(card): '500')  + ',' +
            'scrollbars=yes,' +
            'status=yes');
        switch (this.getTipo(card)){
            case 'figura':
                const prefix = '<body style="background-image: url(\'';
                const sufix = '\'); background-repeat: no-repeat; background-size: cover;"></body>';
                myWindow.document.write(prefix + url + sufix);
                break;
            case 'rbokeh':
                break;
            case  'planilha':
                if (this.endereco != null) {
                    const html = `<!DOCTYPE html>
<html lang=en>
<head>
<meta charset=utf-8 />
<title>jQuery CSVToTable</title>
<style>TABLE.CSVTable{font:.8em Verdana,Arial,Geneva,Helvetica,sans-serif;border-collapse:collapse;width:450px}TABLE.CSVTable THEAD TR{background:#e8edff}TABLE.CSVTable TH{font-family:"Lucida Sans Unicode","Lucida Grande",Sans-Serif;font-size:1.2em}TABLE.CSVTable TD,TABLE.CSVTable TH{padding:8px;text-align:left;border-bottom:1px solid #fff;border-top:1px solid transparent}TABLE.CSVTable TR{background:#f0f0f0}TABLE.CSVTable TR.odd{background:#f9f9f9}TABLE.CSVTable TR:hover{background:#e8edff}.source{background-color:#fafafa;border:1px solid #999}</style>
<script src=https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js></script>
<script>(function(a){String.prototype.splitCSV=function(e){for(var d=this.split(e=e||","),b=d.length-1,c;b>=0;b--){if(d[b].replace(/"\s+$/,'"').charAt(d[b].length-1)=='"'){if((c=d[b].replace(/^\s+"/,'"')).length>1&&c.charAt(0)=='"'){d[b]=d[b].replace(/^\s*"|"\s*$/g,"").replace(/""/g,'"')}else{if(b){d.splice(b-1,2,[d[b-1],d[b]].join(e))}else{d=d.shift().split(e).concat(d)}}}else{d[b].replace(/""/g,'"')}}return d};a.fn.CSVToTable=function(c,b){var d={tableClass:"CSVTable",theadClass:"",thClass:"",tbodyClass:"",trClass:"",tdClass:"",loadingImage:"",loadingText:"Loading CSV data...",separator:",",startLine:0};var b=a.extend(d,b);return this.each(function(){var f=a(this);var e="";(b.loadingImage)?loading='<div style="text-align: center"><img alt="'+b.loadingText+'" src="'+b.loadingImage+'" /><br>'+b.loadingText+"</div>":loading=b.loadingText;f.html(loading);a.get(c,function(k){var g='<table class="'+b.tableClass+'">';var i=k.replace("\\r","").split("\\n");if(k.split(";").length>k.split(b.separator).length){b.separator=";"};if(k.split("\\t").length>k.split(b.separator).length){b.separator="\\t"}var h=0;var j=0;var l=new Array();a.each(i,function(n,m){if((n==0)&&(typeof(b.headers)!="undefined")){l=b.headers;j=l.length;g+='<thead class="'+b.theadClass+'"><tr class="'+b.trClass+'">';a.each(l,function(p,q){g+='<th class="'+b.thClass+'">'+q+"</th>"});g+='</tr></thead><tbody class="'+b.tbodyClass+'">'}if((n==b.startLine)&&(typeof(b.headers)=="undefined")){l=m.splitCSV(b.separator);j=l.length;g+='<thead class="'+b.theadClass+'"><tr class="'+b.trClass+'">';a.each(l,function(p,q){g+='<th class="'+b.thClass+'">'+q+"</th>"});g+='</tr></thead><tbody class="'+b.tbodyClass+'">'}else{if(n>=b.startLine){var o=m.splitCSV(b.separator);if(o.length>1){h++;if(o.length!=j){e+="error on line "+n+": Item count ("+o.length+") does not match header count ("+j+") \\n"}(h%2)?oddOrEven="odd":oddOrEven="even";g+='<tr class="'+b.trClass+" "+oddOrEven+'">';a.each(o,function(q,p){g+='<td class="'+b.tdClass+'">'+p+"</td>"});g+="</tr>"}}}});g+="</tbody></table>";if(e){f.html(e)}else{f.fadeOut(500,function(){f.html(g)}).fadeIn(function(){setTimeout(function(){f.trigger("loadComplete")},0)})}})})}})(jQuery);</script>
</head>
<body>
<div id=CSVTable>
</div>
</body>
<script>$("#CSVTable").CSVToTable("url",{loadingImage:"imagemgif",startLine:0});</script>
</html>`;
                    //não se esqueça de atribuir:
                    //<Directory "/var/www/html/temp">
                    //Header set Access-Control-Allow-Origin "*"
                    //</Directory>

                    myWindow.document.write(html.replace('url', url).replace('imagemgif', this.endereco + 'loading.gif'));
                }
                break;
            case 'rdata':
                break;
            case 'texto':
            case 'codigo':
                myWindow.document.write(this.getText(card));
                break;
            default:
                break;
        }
        this.closeDropDown();
    }

    baixar(id: number) {
        this.closeDropDown();
    }

    reduzir(id: number) {
        const lc = this.getLC(id);
        let card = this.getCardByID(id);
        if(card[1].indexOf('meta') < 0) {
            card[1] += ' meta';
        }
        this.cards[lc[0]][lc[1]] = card.join(':');
        this.homeService.setCards(this.cards);
        this.closeDropDown();
    }

    ampliar(id: number) {
        const lc = this.getLC(id);
        let card = this.getCardByID(id);
        if(card[1].indexOf('meta') >= 0) {
            card[1] = card[1].replace('meta', '');
        }
        this.cards[lc[0]][lc[1]] = card.join(':');
        this.homeService.setCards(this.cards);
        this.closeDropDown();
    }

    fechar(id: number) {
        this.transitions[id] = 'out';
    }

///////////////////////////////////////////////////////////////////////////////

    animationDone($event: any) {
        if($event.fromState === 'in' && $event.toState === 'out'){
            for(let transition in this.transitions) {
                if (this.transitions[transition] === 'out') {
                    // alert('remove ' + transition);
                    const id = parseInt(transition);
                    this.closeDropDown();
                    const lc = this.getLC(id);
                    this.cards = this.homeService.removeItem(lc[0], lc[1], this.cards);
                    this.homeService.setCards(this.cards);
                    this.transitions[transition] = null;
                }
            }
        }
    }
}
