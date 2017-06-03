import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { Script } from './script.model';
import { ScriptPopupService } from './script-popup.service';
import { ScriptService } from './script.service';
import { Cenario, CenarioService } from '../cenario';

@Component({
    selector: 'jhi-script-dialog',
    templateUrl: './script-dialog.component.html'
})
export class ScriptDialogComponent implements OnInit {

    script: Script;
    authorities: any[];
    isSaving: boolean;

    cenarios: Cenario[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private scriptService: ScriptService,
        private cenarioService: CenarioService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['script']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.cenarioService.query().subscribe(
            (res: Response) => { this.cenarios = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.script.id !== undefined) {
            this.scriptService.update(this.script)
                .subscribe((res: Script) =>
                    this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
        } else {
            this.scriptService.create(this.script)
                .subscribe((res: Script) =>
                    this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
        }
    }

    private onSaveSuccess(result: Script) {
        this.eventManager.broadcast({ name: 'scriptListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    trackCenarioById(index: number, item: Cenario) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-script-popup',
    template: ''
})
export class ScriptPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private scriptPopupService: ScriptPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.scriptPopupService
                    .open(ScriptDialogComponent, params['id']);
            } else {
                this.modalRef = this.scriptPopupService
                    .open(ScriptDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
