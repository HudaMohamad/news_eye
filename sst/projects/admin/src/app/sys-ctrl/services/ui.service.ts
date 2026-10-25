import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UiService {
    private sidebarVisible = new BehaviorSubject<boolean>(false);
    sidebarVisible$ = this.sidebarVisible.asObservable();

    toggleSidebar() {
        this.sidebarVisible.next(!this.sidebarVisible.value);
    }

    setSidebarVisible(visible: boolean) {
        this.sidebarVisible.next(visible);
    }
}
