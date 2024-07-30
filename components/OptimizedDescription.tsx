import { Color } from '@/GlobalStyles';
import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import { useTailwind } from 'tailwind-rn';

interface OptimizedDescriptionProps {
  description: string | undefined;
  initialLines?: number;
}

const OptimizedDescription: React.FC<OptimizedDescriptionProps> = ({ description, initialLines =1 }) => {
  const tw = useTailwind();
  const [expanded, setExpanded] = useState(false);
  const [textHeight, setTextHeight] = useState(0);

  const toggleExpanded = useCallback(() => setExpanded(prev => !prev), []);

  const lines = useMemo(() => {
    if (typeof description === 'string') {
      return description.split('\n');
    }
    return [];
  }, [description]);

  const displayedLines = useMemo(() => {
    return expanded ? lines : lines.slice(0, initialLines);
  }, [expanded, lines, initialLines]);

  const renderItem = useCallback(({ item }: { item: string }) => (
    <Text style={[tw('text-base text-gray-900 font-normal'), styles.text]}>{item}</Text>
  ), [tw]);

  const keyExtractor = useCallback((item: string, index: number) => index.toString(), []);

  const onTextLayout = useCallback((event: { nativeEvent: { layout: { height: number } } }) => {
    const { height } = event.nativeEvent.layout;
    setTextHeight(height);
  }, []);

  const ListFooterComponent = useCallback(() => {
    console.log(lines.length)
    if (lines.length <= initialLines) return null;
    return (
      <TouchableOpacity onPress={()=>{toggleExpanded()}} style={[tw(''),{}]}>
        <Text style={[tw(''),{color: Color.colorsBlue}]}>
          {expanded ? 'Read less' : 'Read more'}
        </Text>
      </TouchableOpacity>
    );
  }, [expanded, initialLines, lines.length, toggleExpanded, tw]);

  if (!description) {
    return <Text style={tw('text-base text-gray-500')}>No description available</Text>;
  }

  return (
    <ScrollView style={[tw('my-2 mx-2'),{}]}>
      <FlatList
        data={displayedLines}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        scrollEnabled={true}
        ListFooterComponent={ListFooterComponent}
        onLayout={onTextLayout}
      />
      {!expanded && lines.length > initialLines && (
        <View 
          style={[
            styles.gradient, 
            { height: Math.min(textHeight, initialLines * 10) }
          ]} 
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    lineHeight: 18,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0)',
  },
});

export default OptimizedDescription;