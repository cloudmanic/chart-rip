import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataService } from './services/data.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { count } from 'console';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {
  charts: Chart[] = [];

  activeChart: Chart = {
    Title: "",
    Active: false,
    Labels: [],
    DataSet: [],
    ChartOptions: { responsive: true, scales: {}, annotation: {} }
  };

  // dataSet: ChartDataSets[] = [
  //   //{ data: [], label: '', fill: false, backgroundColor: 'rgba(255,0,0,0.3)' },
  //   //{ data: [], label: '', yAxisID: 'y-axis-1', type: 'bar', backgroundColor: 'rgba(77,83,96,0.2)' }
  //   //{ data: [65, 59, 80, 81, 56, 55, 40], label: 'Profits', fill: false, backgroundColor: 'rgba(255,0,0,0.3)' }, // , tension: 0
  //   //{ data: [180, 480, 770, 90, 1000, 270, 400], label: 'Volume', yAxisID: 'y-axis-1', type: 'bar', backgroundColor: 'rgba(77,83,96,0.2)' }
  // ];

  //chartLabels: Label[] = [];
  //public chartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  // lineChartOptions: (ChartOptions & { annotation: any }) = {
  //   responsive: true,

  //   scales: {
  //     // We use this empty structure as a placeholder for dynamic theming.
  //     xAxes: [{}],
  //     yAxes: [
  //       {
  //         id: 'y-axis-0',
  //         position: 'left',
  //       },
  //       {
  //         id: 'y-axis-1',
  //         position: 'right',
  //         gridLines: {
  //           color: 'rgba(255,0,0,0.3)',
  //         },
  //         ticks: {
  //           fontColor: 'red',
  //         }
  //       }
  //     ]
  //   },

  //   annotation: {
  //     annotations: [
  //       {
  //         type: 'line',
  //         mode: 'vertical',
  //         scaleID: 'x-axis-0',
  //         value: 'March',
  //         borderColor: 'orange',
  //         borderWidth: 2,
  //         label: {
  //           enabled: true,
  //           fontColor: 'orange',
  //           content: 'LineAnno'
  //         }
  //       },
  //     ],
  //   },
  // };

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

    // let chart1 = this.getOrCreateChartObjByTitle("My First Chart");
    // let chart2 = this.getOrCreateChartObjByTitle("My Second Chart");

    // chart1.Labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    // chart1.DataSet = [{ data: [65, 59, 80, 81, 56, 55, 40], label: 'Profits', fill: false, backgroundColor: 'rgba(255,0,0,0.3)' }];

    // chart2.Labels = ['Spicer', 'Gaga', 'Lady', 'Bird', 'Wood', 'Day', 'Loss'];
    // chart2.DataSet = [{ data: [180, 480, 770, 90, 1000, 270, 400], label: 'Volume', yAxisID: 'y-axis-1', type: 'bar', backgroundColor: 'rgba(77,83,96,0.2)' }];

    // this.activeChart = chart1;

    // setTimeout(() => {
    //   this.chart.update();
    // }, 1000);

    // setTimeout(() => {
    //   this.activeChart = chart2;
    //   this.chart.update();
    // }, 4000);


  }

  //
  // Process income data.
  //
  onData(res: any) {
    console.log(res);

    // Get the chart object or create it
    let chart = this.getOrCreateChartObjByTitle(res.title, res.labels);

    // Set chart options.
    chart.ChartOptions = this.getChartOptions(res);

    // console.log(this.charts);

    // Set X Axis
    chart.Labels.push(res.data[0]);

    // Set y Axis
    for (let i = 0; i < res.labels.length; i++) {
      chart.DataSet[i].data.push(res.data[i + 1]);
    }

    // Update the chart.
    this.chart.update();
  }

  //
  // Tab Click
  //
  changeTab(chart: Chart) {
    this.activeChart = chart;
    this.chart.update();
  }

  //
  // Clear all charts.
  //
  clearAllCharts(event) {
    event.preventDefault();

    this.charts = [];

    this.activeChart = {
      Title: "",
      Active: false,
      Labels: [],
      DataSet: [],
      ChartOptions: { responsive: true, scales: {}, annotation: {} }
    };

    this.chart.update();
  }

  //
  // Get chart object by title
  //
  getOrCreateChartObjByTitle(title: string, labels: Label[]) {
    // See if this is known chart
    for (let i = 0; i < this.charts.length; i++) {
      if (this.charts[i].Title == title) {
        return this.charts[i]
      }
    }

    // Add in datasets
    let ds = [];
    let lbs = [];

    for (let i = 0; i < labels.length; i++) {
      lbs.push(String(labels[i]));
      ds.push({ data: [], label: String(labels[i]), fill: false, backgroundColor: 'rgba(255,0,0,0.3)' });
    }

    // Guess it is a new chart
    let chart: Chart = {
      Title: title,
      Active: false,
      Labels: lbs,
      DataSet: ds,
      ChartOptions: { responsive: true, scales: {}, annotation: {} }
    }

    // Return new chart.
    this.charts.push(chart);

    // Set the active chart
    if (this.activeChart.Title == "") {
      this.activeChart = chart;
    }

    // Refresh the UI to include the new nav
    setTimeout(() => { this.cdr.detectChanges(); }, 100);

    // Return the chart
    return chart;
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

    // Do we have more than one dataset? If so add the axis on the right
    if (res.labels.length > 1) {
      rt.scales.yAxes.push({
        id: 'y-axis-1',

        position: 'right',

        gridLines: {
          color: 'rgba(255,0,0,0.3)'
        },

        ticks: {
          fontColor: 'red',
        }
      });
    }

    // Return object
    return rt;
  }
}

export interface Chart {
  Title: string,
  Active: boolean,
  Labels: Label[],
  DataSet: ChartDataSets[],
  ChartOptions: (ChartOptions & { annotation: any })
}

/* End File */