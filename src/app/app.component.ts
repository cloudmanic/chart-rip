//
// Date: 10/29/2020
// Author(s): Spicer Matthews (spicer@options.cafe)
// Copyright: 2020 Cloudmanic Labs, LLC. All rights reserved.
//

import { Subscription } from 'rxjs';
import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataService } from './services/data.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { Chart } from './chart/chart/chart.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {
  // Store any subscriptions we need to destroy in the end.
  private readonly subscriptions = new Subscription();

  activeChart: string = '';

  charts: Map<string, Chart> = new Map();


  //
  // Construct.
  //
  constructor(private dataService: DataService, private cdr: ChangeDetectorRef) {
    // Receive data from the node app.
    const onData = this.dataService.onData.subscribe((res) => {
      this.onData(res);
    });

    // Add this subscription to the list to destroy in the end.
    this.subscriptions.add(onData);
  }

  //
  // OnDestroy
  //
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  //
  // Delete chart
  //
  deleteChart(event, chart: string) {
    // Prevent click in browser.
    event.preventDefault();

    // Delete the chart from our hash table
    this.charts.delete(chart);

    // Set the first tab as the next active tab.
    for (let row of this.charts.keys()) {
      this.activeChart = row;
      break;
    }

    // Update UI.
    this.cdr.detectChanges();
  }

  //
  // Process income data.
  //
  onData(res: any) {
    //console.log(res);

    // Get / Set xAxis
    let xAxisValue = res.data[0];

    // Get / Set yAxis (convert to numbers)
    res.data.shift();
    let yAxisValues = res.data;

    for (var i = 0; i < yAxisValues.length; i++) {
      yAxisValues[i] = Number(yAxisValues[i]);
    }

    // Is this the first time we have see this chart?
    if (!this.charts.has(res.title)) {
      // Build base chart
      let chart = {
        Title: res.title,
        Labels: [xAxisValue],
        DataSet: [
          //{ data: [65, 59, 80, 81, 56, 55, 40], label: 'Profits', fill: false, backgroundColor: 'rgba(255,0,0,0.3)' }, // , tension: 0
          //{ data: [180, 480, 770, 90, 1000, 270, 400], label: 'Volume', yAxisID: 'y-axis-1', type: 'bar', backgroundColor: 'rgba(77,83,96,0.2)' }
        ],
        ChartOptions: this.getChartOptions(res)
      }

      // Build in the yaxis data
      for (let i = 0; i < yAxisValues.length; i++) {
        // Figure out which axis
        let axisId = "y-axis-left"

        if (res.configs[i].axis == "right") {
          axisId = "y-axis-right"
        }

        // Push dataset on.
        chart.DataSet.push({
          data: [yAxisValues[i]],
          label: res.labels[i],
          yAxisID: axisId,
          //backgroundColor: 'rgba(255,0,0,0.3)',
          type: res.configs[i].type,
          fill: res.configs[i].fill
        });
      }

      // Add chart to our map
      this.charts.set(res.title, chart);

      // Set to active chart since this is new data.
      this.activeChart = res.title;

      // Update screen.
      this.cdr.detectChanges();

      // Return happy
      return;
    }

    // We are appending data it seems
    let chart = this.charts.get(res.title);

    // Set yAxis stuff
    chart.Labels.push(xAxisValue);

    // Add xAxis stuff
    for (let i = 0; i < chart.DataSet.length; i++) {
      chart.DataSet[i].data.push(yAxisValues[i]);
    }

    // Update the chart mapping.
    this.charts.set(res.title, chart);

    // See if we have an activeChart
    if (this.activeChart.length == 0) {
      this.activeChart = res.title;
    }

    // Update the UI.
    this.cdr.detectChanges();
  }

  //
  // Tab Click
  //
  changeTab(chart: string) {
    this.activeChart = chart;
    this.cdr.detectChanges();
  }

  //
  // getChartOptions for this chart
  //
  getChartOptions(res: any) {
    let rt = {
      responsive: true,

      scales: {
        // We use this empty structure as a placeholder for dynamic theming.
        xAxes: [{}],
        yAxes: this.getYaxesConfig(res)
      },

      annotation: {
        annotations: [
          {
            type: 'line',
            mode: 'vertical',
            scaleID: 'x-axis-0',
            value: 'March',
            borderColor: 'orange',
            borderWidth: 2,
            label: {
              enabled: true,
              fontColor: 'orange',
              content: 'LineAnno'
            }
          },
        ],
      },
    }

    // Return object
    return rt;
  }

  //
  // getYaxesConfig 
  //
  getYaxesConfig(res: any) {
    // Build base yAxes
    let yAxes = [
      {
        id: 'y-axis-left',
        position: 'left',
        gridLines: {},
        ticks: {}
      }
    ];

    // Figure out how many yAxes to have.
    if ((typeof res.configs == "object") && (typeof res.configs[0].axis == "string")) {
      // First see if we have a right Y-Axis
      let hasRight = false;

      for (let row of res.configs) {
        if (row.axis == "right") {
          hasRight = true;
        }
      }

      // Add right axes
      if (hasRight) {
        yAxes.push({
          id: 'y-axis-right',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        });
      }
    }

    // Return config
    return yAxes;
  }


}

/* End File */