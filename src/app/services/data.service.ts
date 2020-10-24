import { EventEmitter, Injectable } from '@angular/core';

const electron = (<any>window).require('electron');

@Injectable({
  providedIn: 'root'
})

export class DataService {
  // Emitters - Pushers
  onData = new EventEmitter<any>();

  // 
  // Constructor
  //
  constructor() {
    // Received data from main process
    electron.ipcRenderer.on('on-data', (event, data) => {
      this.onData.emit(data);
    });

    // electron.ipcRenderer.send('navigateDirectory', path);
  }

}

/* End File */