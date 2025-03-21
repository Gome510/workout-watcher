import {Canvas, Line, vec} from '@shopify/react-native-skia';
import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {
  Delegate,
  Dims,
  MediapipeCamera,
  Point,
  RunningMode,
  denormalizePoint,
  faceLandmarkDetectionModuleConstants,
  framePointToView,
  useFaceLandmarkDetection,
} from 'react-native-mediapipe';
import {useCameraPermission} from 'react-native-vision-camera';

// we are going to draw a series of line segments
type DrawSegment = {
  startPoint: Point;
  endPoint: Point;
};

// this code converts each segment from the "normalized" coordinate space
// that the face landmarks are in (0-1) to the "view" coordinate space
export function convertToViewSpace(
  segment: DrawSegment,
  frameSize: Dims,
  viewSize: Dims,
  mirrored = false,
): DrawSegment {
  return {
    startPoint: framePointToView(
      denormalizePoint(segment.startPoint, frameSize),
      frameSize,
      viewSize,
      'cover',
      mirrored,
    ),
    endPoint: framePointToView(
      denormalizePoint(segment.endPoint, frameSize),
      frameSize,
      viewSize,
      'cover',
      mirrored,
    ),
  };
}

const eyeLandmarks = {
  left: faceLandmarkDetectionModuleConstants().knownLandmarks.leftEye,
  right: faceLandmarkDetectionModuleConstants().knownLandmarks.rightEye,
};

function App(): React.JSX.Element {
  const cameraPermission = useCameraPermission();
  const [segments, setSegments] = React.useState<DrawSegment[]>([
    {startPoint: {x: 10, y: 10}, endPoint: {x: 100, y: 100}},
  ]);
  const faceDetection = useFaceLandmarkDetection(
    (results, viewSize, mirrored) => {
      const landmarks = results.results[0].faceLandmarks[0];
      if (!landmarks || landmarks.length === 0) {
        return;
      }
      const frameSize = {
        width: results.inputImageWidth,
        height: results.inputImageHeight,
      };

      // get all the segments for the eyes
      const leftEyeSegments: DrawSegment[] = eyeLandmarks.left.map(seg =>
        convertToViewSpace(
          {
            startPoint: landmarks[seg.start],
            endPoint: landmarks[seg.end],
          },
          frameSize,
          viewSize,
          mirrored,
        ),
      );
      const rightEyeSegments: DrawSegment[] = eyeLandmarks.right.map(seg =>
        convertToViewSpace(
          {
            startPoint: landmarks[seg.start],
            endPoint: landmarks[seg.end],
          },
          frameSize,
          viewSize,
          mirrored,
        ),
      );
      setSegments([leftEyeSegments, rightEyeSegments].flat());
    },
    error => {
      console.error(`onError: ${error}`);
    },
    RunningMode.LIVE_STREAM,
    'face_landmarker.task',
    {
      delegate: Delegate.GPU,
    },
  );

  return (
    <SafeAreaView style={styles.root}>
      {cameraPermission.hasPermission ? (
        <View style={styles.container}>
          <MediapipeCamera style={styles.camera} solution={faceDetection} />
          <Canvas style={styles.overlay}>
            {segments.map((segment, index) => (
              <Line
                key={index}
                p1={vec(segment.startPoint.x, segment.startPoint.y)}
                p2={vec(segment.endPoint.x, segment.endPoint.y)}
                color="red"
                style="stroke"
                strokeWidth={4}
              />
            ))}
          </Canvas>
        </View>
      ) : (
        <RequestPermissions
          hasCameraPermission={cameraPermission.hasPermission}
          requestCameraPermission={cameraPermission.requestPermission}
        />
      )}
    </SafeAreaView>
  );
}

const RequestPermissions: React.FC<{
  hasCameraPermission: boolean;
  requestCameraPermission: () => Promise<boolean>;
}> = ({hasCameraPermission, requestCameraPermission}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to React Native Mediapipe</Text>
      <View style={styles.permissionsContainer}>
        {!hasCameraPermission && (
          <Text style={styles.permissionText}>
            React Native Mediapipe needs{' '}
            <Text style={styles.bold}>Camera permission</Text>.{' '}
            <Text style={styles.hyperlink} onPress={requestCameraPermission}>
              Grant
            </Text>
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
  },
  welcome: {color: 'black', fontSize: 38, fontWeight: 'bold', maxWidth: '80%'},
  banner: {
    position: 'absolute',
    opacity: 0.4,
    bottom: 0,
    left: 0,
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'column',
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  categoriesText: {color: 'black', fontSize: 36},
  permissionsContainer: {
    marginTop: 30,
  },
  permissionText: {
    color: 'black',
    fontSize: 17,
  },
  hyperlink: {
    color: '#007aff',
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default App;
