import { Injectable, signal, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private breakpointObserver = inject(BreakpointObserver);
  
  isOpen = signal<boolean>(window.innerWidth >= 1024);

  // 提供响应式断点流
  isMobile$ = this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
    .pipe(map(result => result.matches));

  toggle() {
    this.isOpen.update(v => !v);
  }

  setOpen(open: boolean) {
    this.isOpen.set(open);
  }

  close() {
    this.isOpen.set(false);
  }
}
