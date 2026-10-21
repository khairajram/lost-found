import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { ITEM_CATEGORIES } from '../../constants/categories';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { Layers } from 'lucide-react-native';

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  showAllOption?: boolean;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
  showAllOption = true,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {showAllOption && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onSelectCategory('All')}
          style={[styles.pill, selectedCategory === 'All' && styles.pillActive]}
        >
          <Layers
            size={14}
            color={selectedCategory === 'All' ? COLORS.white : COLORS.textSecondary}
          />
          <Text
            style={[
              styles.label,
              selectedCategory === 'All' && styles.labelActive,
            ]}
          >
            All Items
          </Text>
        </TouchableOpacity>
      )}

      {ITEM_CATEGORIES.map((cat) => {
        const isSelected = selectedCategory.toLowerCase() === cat.label.toLowerCase();
        return (
          <TouchableOpacity
            key={cat.label}
            activeOpacity={0.7}
            onPress={() => onSelectCategory(cat.label)}
            style={[styles.pill, isSelected && styles.pillActive]}
          >
            <View
              style={[
                styles.dot,
                { backgroundColor: isSelected ? COLORS.white : cat.color },
              ]}
            />
            <Text style={[styles.label, isSelected && styles.labelActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  pillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.textSecondary,
  },
  labelActive: {
    color: COLORS.white,
  },
});
