import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readonly?: boolean;
}

export function Rating({ value, onChange, size = 24, readonly = false }: RatingProps) {
  const renderStar = (index: number) => {
    const filled = index < Math.floor(value);
    const halfFilled = index < value && index >= Math.floor(value);

    const StarComponent = readonly ? View : TouchableOpacity;

    return (
      <StarComponent
        key={index}
        onPress={() => !readonly && onChange?.(index + 1)}
        style={styles.star}
      >
        <Ionicons
          name={filled ? 'star' : halfFilled ? 'star-half' : 'star-outline'}
          size={size}
          color="#FFD700"
        />
      </StarComponent>
    );
  };

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3, 4].map(renderStar)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginHorizontal: 2,
  },
});
