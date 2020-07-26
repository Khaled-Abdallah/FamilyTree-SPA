import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router,Event, NavigationStart, NavigationEnd } from '@angular/router';
import { NgProgressRef, NgProgress } from '@ngx-progressbar/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadingNavigation: any;
  progressRef: NgProgressRef;
  constructor(private router: Router, private spinner: NgxSpinnerService,
    private progress: NgProgress) {    
  }


  ngOnInit() {
    this.progressRef = this.progress.ref('myProgress');
        
    this.router.events.subscribe((routerEvent: Event) => {
      if(routerEvent instanceof NavigationStart){
        //this.spinner.show();
        //this.loadingNavigation = true;
        this.startLoading();
      }
      if(routerEvent instanceof NavigationEnd){
        //this.spinner.hide();
        //this.loadingNavigation = false;
        this.completeLoading();
      }
    });

  }

  startLoading() {
    this.progressRef.start();
  }

  completeLoading() {
    this.progressRef.complete();
  }
    
}
