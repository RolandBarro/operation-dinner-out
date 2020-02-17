import { Component, ViewChild, AfterViewInit } from '@angular/core';

import { GoogleMappingService } from '../services/google-mapping.service';
import { LocalDataService } from '../services/local-data.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Place } from '../models/place.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  @ViewChild('mapContainer', { static: false }) mapContainer: any;

  places$: Observable<Place[]>;
  private _foundPlaces$ = new BehaviorSubject<Place[]>([]);
  foundPlaces$ = this._foundPlaces$.asObservable();

  places: Place[];
  selectedPlace: string;
  searchText: string;
  
  hasSelected = false;
  showResults = false;

  customPopoverOptions: any = {
    header: 'Select a place',
  };

  constructor(
    private googleAPIService: GoogleMappingService,
    private localDataService: LocalDataService,
  ) {
    this.places$ = this.localDataService.places;
  }

  ngAfterViewInit() {
    this.places$.subscribe((places: Place[]) => {
      if (places && places.length) {
        this.places = places;
        this.searchPlaces();
      }
    });
  }

  buildMap(): void {
    if (this.hasSelected) {
      this.googleAPIService.initializeMap(
        this.mapContainer,
        this.selectedPlace,
        { zoom: 16, disableDefaultUI: true, tilt: 30 }
      );

      this.hasSelected = false;
    }
  }

  locate(place: Place) {
    this.hasSelected = true;
    this.searchText = place.name;
    this.selectedPlace = place.name;

    this.buildMap();
    setTimeout(() => {
      this.showResults = false;
    }, 1000);
  }

  searchPlaces(event?: CustomEvent) {
    let searchString = '';

    if (event) {
      searchString = event.detail.value.toLocaleLowerCase();
    }

    if (!this.selectedPlace && !this.searchText) {
      this.selectedPlace = this.places[0].name;
      this.hasSelected = true;
      this._foundPlaces$.next(this.places);
    } else {
      this.showResults = true;
      const foundPlaces: Place[] = this.places.filter((place: Place) => {
        return place.name.toLocaleLowerCase().includes(searchString);
      });

      this.showResults = !!foundPlaces.length;
      this._foundPlaces$.next(foundPlaces || null);
    }

    if (this.selectedPlace) {
      this.buildMap();
    }
  }
}
