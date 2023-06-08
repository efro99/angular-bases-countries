import { Component, OnInit } from '@angular/core';
import { CountryService } from '../../services/countries.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Country, Translation } from '../../interfaces/country';
import { switchMap } from 'rxjs';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
  styles: [
  ]
})
export class CountryPageComponent implements OnInit{

  public country?: Country; //accept null
  public translateKey:  string[] = [];

  constructor(
    private activatedRouter:ActivatedRoute,
    private router: Router,
    private countriesServices: CountryService,

  ) {}

  ngOnInit(): void {
    this.activatedRouter.params
    .pipe(
      switchMap( ({ id }) => this.countriesServices.searchCountryByAlphaCode( id ) )
    )
    .subscribe( ( country ) => {
        if (!country) {
          return this.router.navigateByUrl('');
        }

        this.translateKey=  Object.keys(country.translations);
        return this.country = country;
      }
    )
  }

}
