import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  isInitializingScreen = true;
  screenSizeObserver?: Subscription;
  sideNavPinned = true;
  sideNavPinnedIfNotHandset = true;
  sideNavPinnedIfHandset = false;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
   this.screenSizeObserver = this.breakpointObserver.observe(Breakpoints.Handset )
    .pipe(
      map(result => this.onScreenSizeChange(result.matches)),
    ).subscribe();
  }

  ngOnDestroy() {
    this.screenSizeObserver?.unsubscribe();
  }

  private onScreenSizeChange(isHandset: boolean): boolean {
      if(this.isInitializingScreen){
        // here we could load saved pinmode's params
        this.isInitializingScreen = false;
      } else {
      if(isHandset) {
        // when we go to handset mode
        this.sideNavPinnedIfNotHandset = this.sideNavPinned;
        this.sideNavPinnedIfHandset &&= this.sideNavPinned; // if not pinned in non-handsest mode, then not pinned in handset mode 
      } else {
        // When we go to non handset mode
        this.sideNavPinnedIfHandset = this.sideNavPinned;
        this.sideNavPinnedIfNotHandset ||= this.sideNavPinned; // if pinned in handset mode, then pinned in non-handset mode
      }
    }
    this.sideNavPinned = isHandset ? this.sideNavPinnedIfHandset : this.sideNavPinnedIfNotHandset; 
    return isHandset;
  }
}

