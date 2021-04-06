import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import * as Feather from 'feather-icons';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'angular-ecommerce';

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        private titleService: Title) {
    }

    ngAfterViewInit() {
        Feather.replace();
    }

    ngOnInit() {

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
        )
            .subscribe(() => {

                var rt = this.getChild(this.activatedRoute)

                rt.data.subscribe(data => {
                    this.titleService.setTitle(data.title)
                })
            })

    }

    getChild(activatedRoute: ActivatedRoute) {
        if (activatedRoute.firstChild) {
            return this.getChild(activatedRoute.firstChild);
        } else {
            return activatedRoute;
        }

    }
}
