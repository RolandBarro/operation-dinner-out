import { Component, ViewChild } from '@angular/core';

import { GoogleMappingService } from '../services/google-mapping.service';
import { LocalDataService } from '../services/local-data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('mapContainer', { static: false }) mapContainer: any;

  places$: Observable<any>;
  selectedAddress: any;

  constructor(
    private googleAPIService: GoogleMappingService,
    private localDataService: LocalDataService,
  ) {
    this.places$ = this.localDataService.places;

    this.places$.subscribe(places => {
      this.selectedAddress = places[0];
      console.log(this.selectedAddress);

      this.buildMap();
    });
  }

  buildMap(): void {
    this.googleAPIService.initializeMap(
      this.mapContainer,
      this.selectedAddress,
      { zoom: 12, disableDefaultUI: true }
    );
  }
}
