import React, { ReactNode, useEffect, useRef } from 'react';
import { Animated, Dimensions, ViewStyle } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SlideUpViewProps {
  visible: boolean;
  duration?: number;
  style?: ViewStyle;
  children: ReactNode;
}

export function SlideUpView({ 
  visible, 
  duration = 300, 
  style, 
  children 
}: SlideUpViewProps) {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [shouldRender, setShouldRender] = React.useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
    }

    Animated.spring(slideAnim, {
      toValue: visible ? 0 : SCREEN_HEIGHT,
      useNativeDriver: true,
      damping: 20,
      stiffness: 90,
    }).start(() => {
      if (!visible) {
        setShouldRender(false);
      }
    });
  }, [visible, slideAnim]);

  if (!shouldRender) {
    return null;
  }

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
