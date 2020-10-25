import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataService } from './services/data.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {
  activeChartTitle = "";

  charts: Chart[] = [];

  dataSet: ChartDataSets[] = [
    { data: [], label: '', fill: false, backgroundColor: 'rgba(255,0,0,0.3)' },
    { data: [], label: '', yAxisID: 'y-axis-1', type: 'bar', backgroundColor: 'rgba(77,83,96,0.2)' }
    //{ data: [65, 59, 80, 81, 56, 55, 40], label: 'Profits', fill: false, backgroundColor: 'rgba(255,0,0,0.3)' }, // , tension: 0
    //{ data: [180, 480, 770, 90, 1000, 270, 400], label: 'Volume', yAxisID: 'y-axis-1', type: 'bar', backgroundColor: 'rgba(77,83,96,0.2)' }
  ];

  chartLabels: Label[] = [];
  //public chartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  lineChartOptions: (ChartOptions & { annotation: any }) = {
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
  constructor(private dataService: DataService, private cdr: ChangeDetectorRef) {
    // Receive data from the node app.
    this.dataService.onData.subscribe((res) => {
      this.onData(res);
    });
  }

  //
  // Process income data.
  //
  onData(res: any) {
    //console.log(res);

    // Get the chart object or create it
    const chart = this.getOrCreateChartObjByTitle(res.title)
    this.setActiveChartByTitle(chart.Title)

    // Set X Axis
    this.chartLabels.push(res.data[0])

    // Set y Axis
    for (let i = 0; i < res.labels.length; i++) {
      this.dataSet[i].label = res.labels[i]
      this.dataSet[i].data.push(res.data[i + 1])
    }

    // Update the chart.
    this.chart.update();
    //this.cdr.detectChanges();
  }

  //
  // Clear all charts.
  //
  clearAllCharts(event) {
    event.preventDefault();
    this.charts = []
    this.chartLabels = []
    this.activeChartTitle = ""
    this.dataSet[0].data = []
    this.dataSet[1].data = []
    this.dataSet[0].label = ""
    this.dataSet[1].label = ""
    this.chart.update()
  }

  //
  // Set active chart by title
  //
  setActiveChartByTitle(title: string) {
    for (let i = 0; i < this.charts.length; i++) {
      if (this.charts[i].Title == title) {
        this.activeChartTitle = title
        this.charts[i].Active = true
      } else {
        this.charts[i].Active = false
      }
    }
  }

  //
  // Get chart object by title
  //
  getOrCreateChartObjByTitle(title: string) {
    // See if this is known chart
    for (let i = 0; i < this.charts.length; i++) {
      const chart = this.charts[i];
      if (chart.Title == title) {
        return chart
      }
    }

    // Guess it is a new chart
    let chart: Chart = {
      Title: title,
      Active: false
    }

    // Return new chart.
    this.charts.push(chart);
    return chart;
  }

}

export interface Chart {
  Title: string,
  Active: boolean
}

/* End File */