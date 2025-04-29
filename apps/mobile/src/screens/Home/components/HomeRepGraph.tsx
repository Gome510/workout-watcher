import React from 'react';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text,
} from 'react-native-svg';
import {max, line, scaleLinear, area, curveBumpX} from 'd3';
import {useWindowDimensions} from 'react-native';
import {styles} from '../../styles';

const data = [8, 10, 8, 11, 15, 10, 3];
const dataPoints: [number, number][] = data.map((d, i) => [i, d]);

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const today = new Date(Date.now()).getDay();
const shiftedDays = [
  ...dayNames.slice(today + 1),
  ...dayNames.slice(0, today + 1),
];

const HomeRepGraph = () => {
  const dayLabelHeight = 15;
  const dayLabelWidth = 40;

  const {width: screenWidth} = useWindowDimensions();
  const containerPadding = styles.contentContainer.padding;
  const width = screenWidth;
  const height = 300;
  const graphWidth =
    width - dayLabelWidth - styles.contentContainer.padding * 2;
  const graphHeight = height - dayLabelHeight;

  const labelPathHeight = 43;
  const labelPathWidth = 74;
  const labelWidth = 50;
  const labelScaleFactor = labelWidth / labelPathWidth;
  const textPosition = labelPathHeight * labelScaleFactor * (-20 / 35);

  const xScale = scaleLinear()
    .domain([0, data.length - 1])
    .range([
      containerPadding + dayLabelWidth / 2,
      graphWidth + containerPadding + dayLabelWidth / 2,
    ]);

  const yMax = (max(data) || 0) + 4;
  const yScale = scaleLinear().domain([0, yMax]).range([graphHeight, 0]);

  const lineGenerator = line<[number, number]>()
    .x(d => xScale(d[0]))
    .y(d => yScale(d[1]))
    .curve(curveBumpX);

  const areaGenerator = area<[number, number]>()
    .x(d => xScale(d[0]))
    .y1(d => yScale(d[1]))
    .y0(yScale(0))
    .curve(curveBumpX);

  const pathD = lineGenerator(dataPoints);
  const areaD = areaGenerator(dataPoints);

  return (
    <Svg width={width} height={height} style={{marginLeft: -containerPadding}}>
      <Defs>
        <LinearGradient id="background" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#0AE1EF" stopOpacity={0.2} />
          <Stop offset="1" stopColor="#0AE1EF" stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Path d={areaD || ''} fill="url(#background)" />
      <Path d={pathD || ''} stroke="white" strokeWidth={2} fill="none" />
      {shiftedDays.map((day, i) => (
        <Text
          style={{fontFamily: styles.text.fontFamily}}
          x={xScale(i)}
          y={height}
          textAnchor="middle"
          fill={'white'}
          key={day}>
          {day}
        </Text>
      ))}
      <G x={xScale(dataPoints[6][0])} y={yScale(dataPoints[6][1]) - 10}>
        <Path
          transform={`scale(${labelScaleFactor}) 
          translate(-${labelPathWidth / 2},-${labelPathHeight})`}
          d="M0 6C0 3 3 0 6 0H68C71 0 74 3 74 6V29C74 33 71 36 68 36C61 36 50 36 47 36C44 36 42 43 37 43C33 43 31 36 27 36C24 36 13 36 6 36C3 36 0 33 0 29V6Z"
          fill="#F6F3BA"
        />
        <Text
          style={{fontFamily: styles.text.fontFamily}}
          fontSize={'1.5em'}
          dy={textPosition}
          alignmentBaseline="central"
          textAnchor="middle">
          {dataPoints[6][1]}
        </Text>
      </G>
      <Circle
        x={xScale(dataPoints[6][0])}
        y={yScale(dataPoints[6][1])}
        r={6}
        fill={'white'}
        stroke={'#F6F3BA'}
        strokeWidth={4}
      />
      <Rect
        x={xScale(dataPoints[6][0])}
        y={yScale(dataPoints[6][1]) + 10}
        width={1}
        height={max([yScale(yMax - dataPoints[6][1]) - dayLabelHeight, 0])}
        fill={'#F6F3BA'}
      />
    </Svg>
  );
};

export default HomeRepGraph;
