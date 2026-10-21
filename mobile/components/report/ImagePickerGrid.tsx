import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, X, Plus } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

interface ImagePickerGridProps {
  images: string[];
  onChangeImages: (images: string[]) => void;
  maxImages?: number;
  error?: string;
}

export const ImagePickerGrid: React.FC<ImagePickerGridProps> = ({
  images,
  onChangeImages,
  maxImages = 4,
  error,
}) => {
  const pickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please grant photo library access to upload photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: maxImages - images.length,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newUris = result.assets.map((a) => a.uri);
        onChangeImages([...images, ...newUris].slice(0, maxImages));
      }
    } catch (err) {
      console.warn('Image picker error:', err);
    }
  };

  const takePhotoWithCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please grant camera access to take a photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onChangeImages([...images, result.assets[0].uri].slice(0, maxImages));
      }
    } catch (err) {
      console.warn('Camera error:', err);
    }
  };

  const removeImage = (indexToRemove: number) => {
    onChangeImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <View style={styles.container}>
      {/* Upload Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={takePhotoWithCamera}
          style={[styles.actionBtn, styles.cameraBtn]}
          disabled={images.length >= maxImages}
        >
          <Camera size={20} color={COLORS.primary} />
          <Text style={styles.actionBtnText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={pickFromGallery}
          style={[styles.actionBtn, styles.galleryBtn]}
          disabled={images.length >= maxImages}
        >
          <ImageIcon size={20} color={COLORS.textSecondary} />
          <Text style={[styles.actionBtnText, { color: COLORS.textSecondary }]}>
            Choose from Gallery
          </Text>
        </TouchableOpacity>
      </View>

      {/* Thumbnails Grid */}
      {images.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewScroll}>
          {images.map((uri, index) => (
            <View key={index} style={styles.thumbnailWrapper}>
              <Image source={{ uri }} style={styles.thumbnail} />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => removeImage(index)}
                style={styles.removeBtn}
              >
                <X size={14} color={COLORS.white} />
              </TouchableOpacity>
              {index === 0 && (
                <View style={styles.primaryTag}>
                  <Text style={styles.primaryTagText}>Cover</Text>
                </View>
              )}
            </View>
          ))}
          {images.length < maxImages && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={pickFromGallery}
              style={styles.addMoreBtn}
            >
              <Plus size={24} color={COLORS.textMuted} />
              <Text style={styles.addMoreText}>{images.length}/{maxImages}</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      ) : (
        <View style={styles.emptyPrompt}>
          <Text style={styles.emptyPromptTitle}>Upload item photos</Text>
          <Text style={styles.emptyPromptDesc}>
            Clear images help local Ollama AI accurately extract color, brand, markings, and distinct scratches.
          </Text>
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    gap: 8,
  },
  cameraBtn: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  galleryBtn: {
    backgroundColor: COLORS.surfaceSubtle,
    borderColor: COLORS.border,
  },
  actionBtnText: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.primary,
  },
  previewScroll: {
    flexDirection: 'row',
    paddingVertical: SPACING.xs,
  },
  thumbnailWrapper: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.md,
    marginRight: SPACING.md,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryTag: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  primaryTagText: {
    ...TYPOGRAPHY.small,
    fontSize: 9,
    color: COLORS.white,
  },
  addMoreBtn: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.borderStrong,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addMoreText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
  },
  emptyPrompt: {
    backgroundColor: COLORS.surfaceSubtle,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.borderStrong,
    alignItems: 'center',
  },
  emptyPromptTitle: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.text,
    marginBottom: 4,
  },
  emptyPromptDesc: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.danger,
    marginTop: SPACING.xs,
  },
});
