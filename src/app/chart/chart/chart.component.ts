//
// Date: 10/29/2020
// Author(s): Spicer Matthews (spicer@options.cafe)
// Copyright: 2020 Cloudmanic Labs, LLC. All rights reserved.
//

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html'
})

export class ChartComponent implements OnInit {
  lineChartLegend = true;
  lineChartType: ChartType = 'line'; // line or bar

  // Store any subscriptions we need to destroy in the end.
  private readonly subscriptions = new Subscription();

  // From the parent.
  @Input() chartTitle: string = "";
  @Input() chartConfig: Chart = {
    Title: "Test ABC",
    Labels: ["Label #1", "Label #2"],
    DataSet: [
      //{ data: [65, 59, 80, 81, 56, 55, 40], label: 'Profits', fill: false, backgroundColor: 'rgba(255,0,0,0.3)' }, // , tension: 0
      //{ data: [180, 480, 770, 90, 1000, 270, 400], label: 'Volume', yAxisID: 'y-axis-1', type: 'bar', backgroundColor: 'rgba(77,83,96,0.2)' }
    ],
    ChartOptions: { responsive: true, scales: {}, annotation: {} }
  };

  // Chart object.
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  //
  // Constructor.
  //
  constructor(private dataService: DataService) {
    // // Receive data from the node app.
    // const onData = this.dataService.onData.subscribe((res) => {
    //   this.onData(res);
    // });

    // // Add this subscription to the list to destroy in the end.
    // this.subscriptions.add(onData);
  }

  //
  // NgOnInit
  //
  ngOnInit(): void {
    //console.log(this.chartDetails.DataSet);
    //this.chartDetails.ChartOptions = this.getChartOptions({});
    //this.chart.update();

    // setTimeout(() => {
    //   this.chart.update();
    // }, 1000);
  }

  // //
  // // OnDestroy
  // //
  // ngOnDestroy() {
  //   this.subscriptions.unsubscribe();
  // }

  // //
  // // Process income data.
  // //
  // onData(res: any) {
  //   // Make sure we care about this title.
  //   if (res.title != this.chartTitle) {
  //     return;
  //   }

  //   // Set chart title.
  //   this.chartDetails.Title = res.title;

  //   // Set chart options.
  //   this.chartDetails.ChartOptions = this.getChartOptions(res);

  //   // Add datasets if we need.
  //   if (this.chartDetails.DataSet.length == 0) {
  //     let ds = [];
  //     let lbs = [];

  //     for (let i = 0; i < res.labels.length; i++) {
  //       lbs.push(String(res.labels[i]));
  //       ds.push({ data: [], label: String(res.labels[i]), fill: false, backgroundColor: 'rgba(255,0,0,0.3)' });
  //     }
  //   }

  //   // Set X Axis
  //   this.chartDetails.Labels.push(res.data[0]);

  //   // Set y Axis
  //   for (let i = 0; i < this.chartDetails.DataSet.length; i++) {
  //     this.chartDetails.DataSet[i].data.push(res.data[i + 1]);
  //   }

  //   // Update the chart.
  //   this.chart.update();
  // }

  //
  // getChartOptions for this chart
  //
  getChartOptions(res: any) {
    let rt = {
      responsive: true,

      scales: {
        // We use this empty structure as a placeholder for dynamic theming.
        xAxes: [{}],
        yAxes: [
          {
            id: 'y-axis-0',

            position: 'left',

            gridLines: {},

            ticks: {}
          }

          //,
          // {
          //   id: 'y-axis-1',
          //   position: 'right',
          //   gridLines: {
          //     color: 'rgba(255,0,0,0.3)',
          //   },
          //   ticks: {
          //     fontColor: 'red',
          //   }
          // }
        ]
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

    // // Do we have more than one dataset? If so add the axis on the right
    // if (res.labels.length > 1) {
    //   rt.scales.yAxes.push({
    //     id: 'y-axis-1',

    //     position: 'right',

    //     gridLines: {
    //       color: 'rgba(255,0,0,0.3)'
    //     },

    //     ticks: {
    //       fontColor: 'red',
    //     }
    //   });
    // }

    // Return object
    return rt;
  }

}

export interface Chart {
  Title: string,
  Labels: Label[],
  DataSet: ChartDataSets[],
  ChartOptions: (ChartOptions & { annotation: any })
}

/* End File */