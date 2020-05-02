/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import Video from 'react-native-video';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import VideoContent from './VideoContent';
import Animated, {Easing} from 'react-native-reanimated';
import PlayerControls, {PLACEHOLDER_WIDTH} from './PlayerControls';
const {width, height} = Dimensions.get('window');
const minHeight = 64;
const midBound = height - 64 * 3;
const upperBound = midBound + minHeight;
const AnimatedVideo = Animated.createAnimatedComponent(Video);
const {
  Extrapolate,
  Value,
  Clock,
  cond,
  eq,
  set,
  add,
  sub,
  multiply,
  lessThan,
  clockRunning,
  startClock,
  spring,
  stopClock,
  event,
  interpolate,
  timing,
  neq,
  block,
  debug,
} = Animated;
const shadow = {
  shadowColor: 'black',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.18,
  shadowRadius: 2,
};
function runSpring(clock, value, dest) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };

  const config = {
    damping: 20,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
    restSpeedThreshold: 1,
    restDisplacementThreshold: 0.5,
    toValue: new Value(0),
  };
  return block([
    cond(
      clockRunning(clock),
      [
        // if the clock is already running we update the toValue, in case a new dest has been passed in
        set(config.toValue, dest),
      ],
      [
        // if the clock isn't running we reset all the animation params and start the clock
        set(state.finished, 0),
        set(state.velocity, 0),
        set(state.position, value),
        set(config.toValue, dest),
        startClock(clock),
      ],
    ),
    // debug('snapPoint', dest),
    // debug('finalTranslateY', finalTranslateY),
    // we run the step here that is going to update position
    spring(clock, state, config),
    // if the animation is over we stop the clock
    cond(state.finished, debug('stop clock', stopClock(clock))),
    // we made the block return the updated position
    state.position,
  ]);
}
export default class VideoModal extends React.PureComponent {
  translationY = new Value(0);
  velocityY = new Value(0);
  offsetY = new Value(0);
  offsetY2 = new Value(0);
  gestureState = new Value(State.UNDETERMINED);
  constructor(props) {
    super(props);
    const {
      translationY, velocityY, offsetY, gestureState: state, offsetY2,
    } = this;
    this.onGestureEvent = event(
      [
        {
          nativeEvent: {
            translationY,
            velocityY,
            state,
          },
        },
      ],
      { useNativeDriver: true },
    );
    const clockY = new Clock();
    const finalTranslateY = add(add(translationY, offsetY), multiply(0.2, velocityY));
    const snapPoint = cond(
      lessThan(finalTranslateY, sub(offsetY, height / 4)),
      0,
      upperBound,
    );
    this.translateY = cond(
      eq(state, State.END),
      [
        set(translationY, runSpring(clockY, add(translationY, offsetY), snapPoint)),
        set(offsetY, translationY),
        translationY,
      ],
      [
        cond(eq(state, State.BEGAN), [
          stopClock(clockY),
          cond(neq(offsetY2, 0), [
            set(offsetY, 0),
            set(offsetY2, 0),
          ]),
        ]),
        debug('velocityY', velocityY),
        debug('finalTranslateY', finalTranslateY),
        debug('this.offsetY2', this.offsetY2),
        add(offsetY, translationY),
      ],
    );
  }
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.slideUp();
    }
  }
  slideUp = () => {
    console.log('-upperBound', -upperBound);
    timing(this.offsetY2, {
      toValue: -upperBound,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    }).start();
  }

  render() {
    const {video} = this.props;
    const {url} = video;
    const {
      onGestureEvent, translateY: y, offsetY2,
    } = this;
    const anim = add(y, offsetY2);
    const opacityContent = interpolate(anim, {
      inputRange: [0, upperBound - 100],
      outputRange: [1, 0],
      interpolate: Extrapolate.CLAMP,
    });
    const contentWidth = interpolate(anim, {
      inputRange: [0, midBound],
      outputRange: [width, width - 16],
      interpolate: Extrapolate.CLAMP,
    });
    const contentHeight = interpolate(anim, {
      inputRange: [0, midBound],
      outputRange: [height, 0],
      interpolate: Extrapolate.CLAMP,
    });
    const videoHeight = interpolate(anim, {
      inputRange: [0, midBound],
      outputRange: [width / 1.78, 64],
      interpolate: Extrapolate.CLAMP,
    });
    const videoContent = interpolate(anim, {
      inputRange: [0, midBound, upperBound],
      outputRange: [width, width - 16, PLACEHOLDER_WIDTH],
      interpolate: Extrapolate.CLAMP,
    });
    const videoContainer =  interpolate(anim, {
      inputRange: [0, midBound],
      outputRange: [width, width - 16],
      interpolate: Extrapolate.CLAMP,
    });
    const PlayerControlsOpacity = interpolate(anim, {
      inputRange: [midBound, upperBound],
      outputRange: [0, 1],
      interpolate: Extrapolate.CLAMP,
    });
    return (
      <>
        <PanGestureHandler activeOffsetY={[-10, 10]} onHandlerStateChange={onGestureEvent} {...{ onGestureEvent }}>
          <Animated.View style={[styles.container, {transform: [{translateY: anim}], ...shadow}]}>
            <Animated.View style={{width: videoContainer}}>
              <Animated.View style={{ ...StyleSheet.absoluteFillObject, opacity: PlayerControlsOpacity}}>
                <PlayerControls title={video.title} onPress={this.slideUp}/>
              </Animated.View>
              <AnimatedVideo source={url} resizeMode="cover" style={{ width: videoContent, height: videoHeight }} />
            </Animated.View>
            <Animated.View style={{width: contentWidth, height: contentHeight}}>
              <Animated.View style={{ opacity: opacityContent }}>
                <VideoContent video={video} />
              </Animated.View>
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </>
    );
  }
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
});
