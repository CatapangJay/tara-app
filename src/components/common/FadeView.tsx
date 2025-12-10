import React, { ReactNode, useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface FadeViewProps {
  visible: boolean;
  duration?: number;
  style?: ViewStyle;
  children: ReactNode;
}

export function FadeView({ 
  visible, 
  duration = 300, 
  style, 
  children 
}: FadeViewProps) {
  const fadeAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const [shouldRender, setShouldRender] = React.useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
    }

    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration,
      useNativeDriver: true,
    }).start(() => {
      if (!visible) {
        setShouldRender(false);
      }
    });
  }, [visible, duration, fadeAnim]);

  if (!shouldRender) {
    return null;
  }

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
