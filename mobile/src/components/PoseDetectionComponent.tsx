import React from 'react';
import {
  RunningMode,
  usePoseDetection,
  MediapipeCamera,
} from 'react-native-mediapipe';
import {Camera} from 'react-native-vision-camera';

const PoseDetectionComponent = () => {
  const callbacks = {
    onResults: results => {
      console.log('Pose detection results:', results);
    },
    onError: error => {
      console.error('Pose detection error:', error);
    },
  };

  const poseDetection = usePoseDetection(
    callbacks,
    RunningMode.LIVE_STREAM,
    'pose_model',
    {
      // numPoses: 1,
      // minPoseDetectionConfidence: 0.5,
      // minPosePresenceConfidence: 0.5,
      // minTrackingConfidence: 0.5,
      // shouldOutputSegmentationMasks: false,
      // delegate: 'GPU',
      // mirrorMode: 'mirror-front-only',
      // forceOutputOrientation: 'portrait',
      // forceCameraOrientation: 'portrait',
      // fpsMode: 30,
    },
  );

  return (
    <Camera
      isActive
      style={{flex: 1}}
      device={poseDetection.cameraDevice}
      onLayout={poseDetection.cameraViewLayoutChangeHandler}
      frameProcessor={poseDetection.frameProcessor}
      //frameProcessorFps={poseDetection.fpsMode}
    />
  );
};

export default PoseDetectionComponent;
