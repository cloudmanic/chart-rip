import { Component, ViewChild } from '@angular/core';
import { DataService } from './services/data.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {

  public dataSet: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Profits', fill: false, backgroundColor: 'rgba(255,0,0,0.3)' },
    { data: [180, 480, 770, 90, 1000, 270, 400], label: 'Volume', yAxisID: 'y-axis-1', type: 'bar', backgroundColor: 'rgba(77,83,96,0.2)' }
  ];

  public chartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,

    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
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
  };

  // public lineChartColors: Color[] = [
  //   { // grey
  //     backgroundColor: 'rgba(148,159,177,0.2)',
  //     borderColor: 'rgba(148,159,177,1)',
  //     pointBackgroundColor: 'rgba(148,159,177,1)',
  //     pointBorderColor: '#fff',
  //     pointHoverBackgroundColor: '#fff',
  //     pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  //   },
  //   // { // dark grey
  //   //   backgroundColor: 'rgba(77,83,96,0.2)',
  //   //   borderColor: 'rgba(77,83,96,1)',
  //   //   pointBackgroundColor: 'rgba(77,83,96,1)',
  //   //   pointBorderColor: '#fff',
  //   //   pointHoverBackgroundColor: '#fff',
  //   //   pointHoverBorderColor: 'rgba(77,83,96,1)'
  //   // },
  //   { // red
  //     backgroundColor: 'rgba(255,0,0,0.3)',
  //     borderColor: 'red',
  //     pointBackgroundColor: 'rgba(148,159,177,1)',
  //     pointBorderColor: '#fff',
  //     pointHoverBackgroundColor: '#fff',
  //     pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  //   }
  // ];

  public lineChartLegend = true;
  public lineChartType: ChartType = 'line'; // line or bar

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  //
  // Construct.
  //
  constructor(private dataService: DataService) { }

}

/* End File */