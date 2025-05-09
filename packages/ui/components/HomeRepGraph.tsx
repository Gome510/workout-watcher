import React, { useState } from "react";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Polygon,
  Rect,
  Stop,
  Text,
} from "react-native-svg";
import { max, line, scaleLinear, area, curveBumpX } from "d3";
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  useWindowDimensions,
  ViewStyle,
} from "react-native";
import { fontFamilies } from "../constants/fonts";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { getYForX, parse } from "react-native-redash";
import { withErrorBoundary } from "../utils/errorBoundary";

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);
const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const data = [8, 10, 0, 11, 15, 10, 3];
const dataPoints: [number, number][] = data.map((d, i) => [i, d]);

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const today = new Date(Date.now()).getDay();
const shiftedDays = [
  ...dayNames.slice(today + 1),
  ...dayNames.slice(0, today + 1),
];
const labelSizes = {
  small: 40,
  medium: 50,
  large: 60,
} as const;

type HomeRepGraph = {
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
  horizontalPadding?: number;
  labelSize?: "small" | "medium" | "large";
};

const HomeRepGraphComponent = ({
  style,
  height = 300,
  width: viewWidth,
  horizontalPadding = 16,
  labelSize = "large",
}: HomeRepGraph) => {
  const todayDataIndex = dataPoints.length - 1;
  const [activePoint, setActivePoint] = useState(todayDataIndex);

  const labelWidth = labelSizes[labelSize];
  const labelHeight = 29;
  const labelOffsetX = -labelWidth / 2;
  const labelOffsetY = -labelHeight - 15;
  const arrowWidth = 6;
  const textPosition = labelOffsetY + labelHeight / 2;

  const dayFontSize = 16;
  const dayLabelHeight = dayFontSize + 8;
  const dayLabelWidth = Math.max(labelWidth, 40);

  const { width: screenWidth } = useWindowDimensions();
  const width = viewWidth ? viewWidth : screenWidth;
  const graphWidth = width - dayLabelWidth - horizontalPadding * 2;
  const graphHeight = height - dayLabelHeight;

  const xScale = scaleLinear()
    .domain([0, data.length - 1])
    .range([
      horizontalPadding + dayLabelWidth / 2,
      graphWidth + horizontalPadding + dayLabelWidth / 2,
    ]);
  const maxData = max(data) || 0;
  const yMax = maxData + maxData * 0.2;
  const yScale = scaleLinear().domain([0, yMax]).range([graphHeight, 0]);

  const lineGenerator = line<[number, number]>()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]))
    .curve(curveBumpX);

  const areaGenerator = area<[number, number]>()
    .x((d) => xScale(d[0]))
    .y1((d) => yScale(d[1]))
    .y0(yScale(0))
    .curve(curveBumpX);

  const pathD = lineGenerator(dataPoints) || "";
  const areaD = areaGenerator(dataPoints);

  const parsedPath = parse(pathD);

  const xPositions = data.map((d, i) => xScale(i));
  const touchColumnWidth = xPositions[1] - xPositions[0];
  const touchBuckets: [number, number][] = xPositions.map((x) => [
    x - touchColumnWidth / 2,
    x + touchColumnWidth / 2,
  ]);

  const progress = useSharedValue(xScale(dataPoints[todayDataIndex][0]));

  const animatedBarProps = useAnimatedProps(() => {
    return {
      x: progress.get(),
      y: (getYForX(parsedPath, progress.get()) || 0) + 10,
      height: graphHeight - (getYForX(parsedPath, progress.get()) || 0),
    };
  });
  const animatedLabelProps = useAnimatedProps(() => {
    return {
      x: progress.get(),
      y: getYForX(parsedPath, progress.get()) || 0,
    };
  });
  const animatedPolyProps = useAnimatedProps(() => {
    const x = progress.get();
    const y = getYForX(parsedPath, progress.get()) || 0;
    return {
      points: `${x},${y} ${x + arrowWidth / 2},${y + arrowWidth} ${
        x + arrowWidth
      },${y}`,
    };
  });
  const animatedCircleProps = useAnimatedProps(() => {
    return {
      cx: progress.get(),
      cy: getYForX(parsedPath, progress.get()) || 0,
    };
  });

  function handlePress(event: GestureResponderEvent) {
    const pressX = event.nativeEvent.locationX;
    for (let i = 0; i < touchBuckets.length; i++) {
      if (touchBuckets[i][0] <= pressX && pressX <= touchBuckets[i][1]) {
        setActivePoint(i);
        progress.set(
          withTiming(xPositions[i], {
            duration: 500,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          })
        );
        break;
      }
    }
  }

  return (
    <Pressable onPress={handlePress}>
      <Svg width={width} height={height} style={style}>
        <Defs>
          <LinearGradient id="background" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#0AE1EF" stopOpacity={0.2} />
            <Stop offset="1" stopColor="#0AE1EF" stopOpacity={0} />
          </LinearGradient>
        </Defs>

        <Path d={areaD || ""} fill="url(#background)" />
        <Path d={pathD || ""} stroke="white" strokeWidth={2} fill="none" />

        {shiftedDays.map((day, i) => (
          <Text
            fontFamily={
              activePoint === i
                ? fontFamilies.MONTSERRAT.semiBold
                : fontFamilies.MONTSERRAT.regular
            }
            fontSize={16}
            x={xScale(i)}
            y={height}
            textAnchor="middle"
            fill={activePoint === i ? "white" : "lightgrey"}
            key={day}
          >
            {day}
          </Text>
        ))}
        {dataPoints.map((point) => (
          <Circle
            x={xScale(point[0])}
            y={yScale(point[1])}
            r={5}
            fill={"white"}
            key={point[0]}
          />
        ))}

        <AnimatedRect
          animatedProps={animatedLabelProps}
          translateX={labelOffsetX}
          translateY={labelOffsetY}
          rx={6}
          width={labelWidth}
          height={labelHeight}
          fill="#F6F3BA"
        />

        <AnimatedPolygon
          points={"0,0 3,6, 6,0"}
          animatedProps={animatedPolyProps}
          //translate={}
          translateY={labelOffsetY + labelHeight}
          translateX={-3}
          strokeLinejoin="round"
          fill="#F6F3BA"
        />
        <AnimatedText
          animatedProps={animatedLabelProps}
          fontSize={"1.5em"}
          dy={textPosition}
          fontFamily={fontFamilies.MONTSERRAT.semiBold}
          alignmentBaseline="central"
          textAnchor="middle"
        >
          {dataPoints[activePoint][1]}
        </AnimatedText>

        <AnimatedCircle
          animatedProps={animatedCircleProps}
          r={6}
          fill={"white"}
          stroke={"#F6F3BA"}
          strokeWidth={4}
        />
        <AnimatedRect
          animatedProps={animatedBarProps}
          translateX={-0.5}
          width={1}
          height={max([yScale(yMax - dataPoints[activePoint][1]), 0])}
          fill={"#F6F3BA"}
        />
      </Svg>
    </Pressable>
  );
};

export const HomeRepGraph = withErrorBoundary(HomeRepGraphComponent);
