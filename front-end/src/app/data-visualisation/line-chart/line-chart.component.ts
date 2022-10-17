// @ts-nocheck

import {
  Component,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import * as util from 'zrender/lib/core/util';
import { EChartsOption } from 'echarts';

type DataType = [number, number][];

const SymbolSize = 10;
const Data: DataType = [
  [-0.1, 0],
  [100.1, 0],
];
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnDestroy, OnInit {
  echartsInstance: any;
  @Input
  maximumReached: boolean = false;

  @Output
  Item = new EventEmitter<DataType>();

  updatePosition: () => void;
  options: EChartsOption = {
    grid: {},
    xAxis: {
      min: 0,
      max: 100,
      type: 'value',
      axisLabel: {
        formatter: '{value}%',
      },
      axisLine: { show: true },
      axisTick: { show: false },
    },
    yAxis: {
      min: -100,
      max: 100,
      type: 'value',
      axisLabel: {
        formatter: '{value}%',
      },
      axisTick: { show: false },
      axisLine: { show: false },
    },
    series: [
      {
        id: 'a',
        type: 'line',
        smooth: true,
        symbolSize: SymbolSize,
        data: Data,
        lineStyle: { color: '#5557ed' },
        itemStyle: {
          color: '#5557ed',
        },
      },
    ],
  };

  constructor() {}
  ngOnInit(): void {
    Data.splice(1, Data.length - 2);
    Data.sort((a, b) => {
      return a[0] - b[0];
    });
    for (let i = 0; i < Data.length - 1; i++) {
      if (Data[i][0] === Data[i + 1][0]) {
        Data.splice(i, 1);
        i -= 1;
        continue;
      }
    }
  }

  ngOnDestroy() {
    if (this.updatePosition) {
      window.removeEventListener('resize', this.updatePosition);
    }
  }

  onChartReady(myChart: any) {
    this.echartsInstance = myChart;
    const Item = this.Item;
    const onPointDragging = function (dataIndex) {
      Data[dataIndex] = myChart.convertFromPixel(
        { gridIndex: 0 },
        this.position
      ) as number[];
      Item.emit(Data.slice(1, -1));
      myChart.setOption({
        animationDuration: 1,
        series: [
          {
            id: 'a',
            data: Data,
          },
        ],
      });
    };

    var zr = myChart.getZr();

    zr.on('click', (params: any) => {
      if (Data.length === 7) {
        this.maximumReached = true;
        return;
      }
      const pointInPixel = [params.offsetX, params.offsetY];
      const pointInGrid = myChart.convertFromPixel('grid', pointInPixel);
      if (myChart.containPixel('grid', pointInPixel)) {
        for (let i = 0; i < Data.length; i++) {
          if (Data[i][0] < pointInGrid[0] && Data[i + 1][0] > pointInGrid[0]) {
            Data.splice(i + 1, 0, pointInGrid);
          }

          myChart.setOption({
            animationDuration: 1,
            series: [
              {
                id: 'a',
                data: Data,
              },
            ],
          });
        }
      }
      setOptions();
      this.Item.emit(Data.slice(1, -1));
    });

    const showTooltip = (dataIndex) => {
      myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex,
      });
    };

    const hideTooltip = () => {
      myChart.dispatchAction({
        type: 'hideTip',
      });
    };

    const updatePosition = () => {
      myChart.setOption({
        graphic: util.map(Data, (item) => ({
          position: myChart.convertToPixel({ gridIndex: 0 }, item),
        })),
      });
    };

    window.addEventListener('resize', updatePosition);
    myChart.on('dataZoom', updatePosition);

    // save handler and remove it on destroy
    this.updatePosition = updatePosition;

    setTimeout(() => {
      setOptions();
    }, 0);

    function setOptions() {
      myChart.setOption({
        animationDuration: 100,
        graphic: util.map(Data, (item, dataIndex) => {
          let isDraggable: boolean = true;
          if (item[0] < 0 || item[0] > 100) {
            isDraggable = false;
          }
          return {
            type: 'circle',
            position: myChart.convertToPixel({ gridIndex: 0 }, item),
            shape: {
              cx: 0,
              cy: 0,
              r: SymbolSize / 2,
            },
            invisible: true,
            draggable: isDraggable,
            ondrag: util.curry<(dataIndex: any) => void, number>(
              onPointDragging,
              dataIndex
            ),
            onmousemove: util.curry<(dataIndex: any) => void, number>(
              showTooltip,
              dataIndex
            ),
            onmouseout: util.curry<(dataIndex: any) => void, number>(
              hideTooltip,
              dataIndex
            ),
            z: 100,
          };
        }),
      });
    }
  }

  clearData() {
    Data.splice(1, Data.length - 2);
    this.maximumReached = false;
    this.Item.emit(Data.slice(1, -1));
    this.echartsInstance.setOption({
      series: [
        {
          id: 'a',
          data: Data,
        },
      ],
    });
  }
}
