import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';

import {Principal} from '../../shared';
import {Customize, CustomizeService} from "../../entities/customize";
import {EventManager} from 'ng-jhipster';
@Injectable()
export class SidebarService {

    private isSidebarOpen = false;
    private isLockedSidebar = true;

    private observeSidebarStatus = new Subject<boolean>();
    private observeLockedStatus = new Subject<boolean>();

    public sidebarObserver$ = this.observeSidebarStatus.asObservable();
    public lockedObserver$ = this.observeLockedStatus.asObservable();

    constructor(
        private principal: Principal,
        private customizeService: CustomizeService,
        private eventManager: EventManager,
    ) {
        this.eventManager.subscribe('customizeListModification', () => {
            this.customizeService.getCustomize()
                .subscribe(
                    (customize: Customize) => {
                        if (customize) {
                            this.isLockedSidebar = customize.sidebar ? customize.sidebar : false;
                            this.updateLockedSidebar();
                            this.openSidebar();
                        }
                    }
                );
        });
    }

    public openSidebar() {
        this.isSidebarOpen = this.principal.isAuthenticated();
        this.updateSidebarOpen();
    }

    closeSidebar() {
        /// Sidebar  / bloqueado
        ///   V      &    V     => v => aberto
        ///   V      &    f     => f => fechado
        ///   f      &    V     => f => fechado
        ///   f      &    f     => f => fechado
        this.isSidebarOpen =
            this.principal.isAuthenticated() &&
            this.isSidebarOpen &&
            this.isLockedSidebar;
        this.updateSidebarOpen();
    }

    toogleSidebar() {
        if (this.isSidebarOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    toogleSidebarFixed() {
        this.isLockedSidebar = !this.isLockedSidebar;
        this.updateLockedSidebar();
        this.customizeSidebar();
    }

    lockSidebar() {
        this.isLockedSidebar = true;
        this.updateLockedSidebar();
        this.customizeSidebar();
    }

    unLockSidebar() {
        this.isLockedSidebar = false;
        this.updateLockedSidebar();
        this.customizeSidebar();
    }

    private updateSidebarOpen() {
        this.observeSidebarStatus.next(this.isSidebarOpen);
    }

    private updateLockedSidebar() {
        this.observeLockedStatus.next(this.isLockedSidebar);
    }

    private customizeSidebar(){
        this.customizeService.customizeSidebar(this.isLockedSidebar);
    }

    isOpen() {
        return this.isSidebarOpen;
    }

    isLock() {
        return this.isLockedSidebar;
    }
}
