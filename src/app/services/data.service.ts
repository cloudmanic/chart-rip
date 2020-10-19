import { Injectable } from '@angular/core';

const electron = (<any>window).require('electron');

@Injectable({
  providedIn: 'root'
})

export class DataService {
  // 
  // Constructor
  //
  constructor() {
    // Received data from main process
    electron.ipcRenderer.on('on-data', (event, data) => {

      console.log(data);

    });

    // electron.ipcRenderer.send('navigateDirectory', path);
  }

}

/* End File */