import { Component, ViewChild, AfterViewInit } from '@angular/core';

import { GoogleMappingService } from '../services/google-mapping.service';
import { LocalDataService } from '../services/local-data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  @ViewChild('mapContainer', { static: false }) mapContainer: any;

  places$: Observable<any>;
  places: any[];
  selectedAddress: any;
  selectedPlace: any;

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
    this.places$.subscribe(places => {
      if (places && places.length) {
        this.places = places;
        this.selectedPlace = places[0].name;

        console.log(this.selectedPlace, places[0].name);

        if (this.selectedPlace) {
          this.buildMap();
        }
      }
    });
  }

  buildMap(): void {
    this.googleAPIService.initializeMap(
      this.mapContainer,
      this.selectedPlace,
      { zoom: 18, disableDefaultUI: true, tilt: 30 }
    );
  }

  locate(event: any) {
    const selected = this.places.find(place => place.name === event.detail.value.name);

    if (selected) {
      this.selectedPlace = selected .name;

      this.buildMap();
    }
  }
}
