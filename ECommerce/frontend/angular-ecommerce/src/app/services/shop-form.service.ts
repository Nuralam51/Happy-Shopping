import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
    providedIn: 'root'
})
export class ShopFormService {

    private countryUrl = "http://happy.us-east-2.elasticbeanstalk.com/api/countries";
    private stateUrl = "http://happy.us-east-2.elasticbeanstalk.com/api/states";

    constructor(private http: HttpClient) { }

    getCreditCardMonth(startMonth: number): Observable<number[]> {
        let month: number[] = [];
        for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
            month.push(theMonth);
        }
        return of(month);
    }

    getCreditCardYear(): Observable<number[]> {
        let years: number[] = [];
        const startYear: number = new Date().getFullYear();
        const endYear: number = startYear + 10;
        for (let theYear = startYear; theYear <= endYear; theYear++) {
            years.push(theYear);
        }
        return of(years);
    }

    getCountries(): Observable<Country[]> {
        return this.http.get<getResponse>(this.countryUrl).pipe(
            map(response => response._embedded.countries)
        );
    }

    getStates(theCountryCode: string): Observable<State[]>{
        const searchStateUrl = this.stateUrl+ "/search/findByCountryCode?code="+theCountryCode;
        return this.http.get<getResponse>(searchStateUrl).pipe(
            map(response => response._embedded.states)
        );
    }
}

interface getResponse {
    _embedded: {
        countries: Country[];
        states: State[];
    }
}
