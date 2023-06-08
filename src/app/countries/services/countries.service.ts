import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, map, of, tap } from 'rxjs';
import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cahe-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({ providedIn: 'root' })
export class CountryService {

  private apiUrl: string = 'https://restcountries.com/v3.1';

  public cacheStore: CacheStore = {
    byCapital: {
      term: '', countries: []
    },
    byCountry: {
      term: '', countries: []
    },
    byRegion: {
      region: '', countries: []
    }
  }


  constructor(private httpClient: HttpClient) { }

  private saveToLocalStorage() {
    localStorage.setItem('cacheStore', JSON.stringify( this.cacheStore))
  }

  private loadFromLocalStorage() {
    if( !localStorage.getItem('cacheStore') ) return;

    this.cacheStore = JSON.parse( localStorage.getItem('cacheStorage')! );
  }

  private getCountryRequest( url: string): Observable<Country[]> {
    return this.httpClient.get<Country[]>(url)
      .pipe(
        catchError(error => of([])),
        delay(2000)
      ); //rxjs operadores
  }

  searchCapital(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/capital/${term}`;

    return this.getCountryRequest(url)
      .pipe(
        tap( (countries) => {
          this.cacheStore.byCapital = { term, countries}
        } ),
        tap( () => this.saveToLocalStorage() )
      );
  }

  searchCountry(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/name/${term}`;

    return this.getCountryRequest(url).pipe(
      tap( (countries) => {
        this.cacheStore.byCountry = { term, countries}
      } ),
      tap( () => this.saveToLocalStorage() )
    );
  }

  searchRegion(term: Region): Observable<Country[]> {
    const url = `${this.apiUrl}/region/${term}`;

    return this.getCountryRequest(url)
    .pipe(
      tap( (countries) => {
        this.cacheStore.byRegion = { region: term,  countries };
      } ),
      tap( () => this.saveToLocalStorage() )
    );
  }

  searchCountryByAlphaCode(code: string): Observable<Country | null> {
    const url = `${this.apiUrl}/alpha/${code}`;

    return this.httpClient.get<Country[]>(url)
      .pipe(
        map( countries => countries.length > 0 ? countries[0] : null ),
        catchError(error => of(null))
      )
  }


}
