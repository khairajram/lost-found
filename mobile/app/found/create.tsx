import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, MapPin, Calendar, ShieldCheck } from 'lucide-react-native';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { StepIndicator } from '../../components/report/StepIndicator';
import { ImagePickerGrid } from '../../components/report/ImagePickerGrid';
import { CategoryPills } from '../../components/items/CategoryPills';
import { itemsService } from '../../services/itemsService';
import { locationService } from '../../services/locationService';
import { useAuthStore } from '../../store/authStore';
import { ItemLocation } from '../../types/item';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

const TOTAL_STEPS = 5;
const STEP_TITLES = [
  'Upload Found Photos',
  'Item Details',
  'Date & Time Found',
  'Found Location',
  'Review & Submit',
];

export default function CreateFoundItemScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [analyzingWithAI, setAnalyzingWithAI] = useState(false);

  // Form State
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
  ]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Mobile Phone');
  const [brand, setBrand] = useState('Samsung');
  const [model, setModel] = useState('Galaxy Series');
  const [color, setColor] = useState('Black');
  const [description, setDescription] = useState('');
  const [distinctiveFeatures, setDistinctiveFeatures] = useState('Transparent protective case, small mark on bottom corner');
  const [foundDate, setFoundDate] = useState('Today (approx 1 hour ago)');
  const [location, setLocation] = useState<ItemLocation>({
    latitude: 37.7755,
    longitude: -122.4185,
    city: 'San Francisco',
    approximateArea: 'Science Center Quad Bench',
  });
  const [fetchingGps, setFetchingGps] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [analyzingPhoto, setAnalyzingPhoto] = useState(false);
  const [aiDetectedBadge, setAiDetectedBadge] = useState<string | null>(null);

  const handleAutoDetectWithAI = async () => {
    if (images.length === 0) {
      Alert.alert('Upload Photo First', 'Please upload or select a photo of the found item first.');
      return;
    }
    try {
      setAnalyzingPhoto(true);
      const analysis = await itemsService.analyzeImageWithAI(images[0]);
      if (analysis) {
        if (analysis.category && analysis.category !== 'Other') setCategory(analysis.category);
        if (analysis.brand) setBrand(analysis.brand);
        if (analysis.model) setModel(analysis.model);
        if (analysis.primaryColor) setColor(analysis.primaryColor);
        if (analysis.objectDescription) {
          setTitle(`Found ${analysis.primaryColor} ${analysis.category}`);
          setDescription(`Found item matching ${analysis.objectDescription}.`);
        }
        if (analysis.distinctiveFeatures && analysis.distinctiveFeatures.length > 0) {
          setDistinctiveFeatures(analysis.distinctiveFeatures.join(', '));
        }
        setAiDetectedBadge(`✨ Gemini detected: ${analysis.primaryColor} ${analysis.category}${analysis.brand ? ` (${analysis.brand})` : ''}`);
      }
    } catch (err) {
      console.warn('Auto detect error:', err);
    } finally {
      setAnalyzingPhoto(false);
    }
  };

  const handleUseGps = async () => {
    try {
      setFetchingGps(true);
      const loc = await locationService.getCurrentLocation();
      setLocation(loc);
    } catch (e) {
      console.warn('GPS error:', e);
    } finally {
      setFetchingGps(false);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (images.length === 0) {
        newErrors.images = 'Please upload at least 1 photo of the found item.';
      }
    } else if (step === 2) {
      if (!title.trim()) newErrors.title = 'Item title is required.';
      if (!category) newErrors.category = 'Please select a category.';
      if (!color.trim()) newErrors.color = 'Please specify primary color.';
      if (!description.trim() || description.trim().length < 10) {
        newErrors.description = 'Please describe the found item (at least 10 characters).';
      }
    } else if (step === 3) {
      if (!foundDate.trim()) newErrors.foundDate = 'Please select or enter the date found.';
    } else if (step === 4) {
      if (!location.approximateArea.trim()) {
        newErrors.location = 'Please specify the approximate area where you found it.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmitReport();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSubmitReport = async () => {
    try {
      setAnalyzingWithAI(true);

      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        brand: brand.trim() || undefined,
        model: model.trim() || undefined,
        color: color.trim(),
        distinctiveFeatures: distinctiveFeatures
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        foundDate: new Date().toISOString(),
        foundLocation: location,
        images,
      };

      // Simulate local AI matching pipeline
      setTimeout(async () => {
        const created = await itemsService.createFoundItem(payload, user || undefined);
        setAnalyzingWithAI(false);
        Alert.alert(
          'Found Report Published!',
          'Thank you for reporting this found item! The AI matching engine has evaluated it against active lost reports and identified candidate matches.',
          [
            {
              text: 'View Matches',
              onPress: () => router.replace('/(tabs)/matches'),
            },
          ]
        );
      }, 1500);
    } catch (err: any) {
      setAnalyzingWithAI(false);
      Alert.alert('Error', err.message || 'Failed to submit report');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <StepIndicator
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        stepTitles={STEP_TITLES}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1: Upload Photos */}
        {currentStep === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Upload Photos of Found Item</Text>
            <Text style={styles.stepDesc}>
              Photograph the item as found. Clear images allow local Ollama AI to extract key visual features for matching.
            </Text>

            <ImagePickerGrid
              images={images}
              onChangeImages={setImages}
              error={errors.images}
            />

            {images.length > 0 && (
              <View style={{ marginTop: 16 }}>
                <Button
                  title={analyzingPhoto ? 'Gemini is Analyzing Photo...' : '✨ Auto-Detect Details with Gemini AI'}
                  variant="secondary"
                  size="md"
                  loading={analyzingPhoto}
                  icon={<Sparkles size={16} color={COLORS.found} />}
                  onPress={handleAutoDetectWithAI}
                />
                {aiDetectedBadge && (
                  <View style={{ marginTop: 12, padding: 12, backgroundColor: '#ECFDF5', borderRadius: RADIUS.md, borderWidth: 1, borderColor: '#A7F3D0' }}>
                    <Text style={{ color: COLORS.found, fontWeight: '700', fontSize: 13 }}>
                      {aiDetectedBadge}
                    </Text>
                    <Text style={{ color: COLORS.textSecondary, fontSize: 12, marginTop: 4 }}>
                      Item specs have been automatically populated in Step 2. Tap Next to review!
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* Step 2: Item Details */}
        {currentStep === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Item Details</Text>
            <Text style={styles.stepDesc}>
              General characteristics of the item found.
            </Text>

            <Input
              label="Item Title *"
              placeholder="e.g. Black Samsung Smartphone"
              value={title}
              onChangeText={setTitle}
              error={errors.title}
            />

            <Text style={styles.fieldLabel}>Category *</Text>
            <CategoryPills
              selectedCategory={category}
              onSelectCategory={setCategory}
              showAllOption={false}
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Brand (Optional)"
                  placeholder="e.g. Samsung, Apple"
                  value={brand}
                  onChangeText={setBrand}
                />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <Input
                  label="Model (Optional)"
                  placeholder="e.g. Galaxy S23"
                  value={model}
                  onChangeText={setModel}
                />
              </View>
            </View>

            <Input
              label="Primary Color *"
              placeholder="e.g. Black, Navy, White"
              value={color}
              onChangeText={setColor}
              error={errors.color}
            />

            <Input
              label="Description *"
              placeholder="e.g. Found on a bench outside campus science building..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              error={errors.description}
            />

            <Input
              label="Distinctive Features (Optional, comma-separated)"
              placeholder="e.g. Clear case, scratch on lower edge"
              value={distinctiveFeatures}
              onChangeText={setDistinctiveFeatures}
            />
          </View>
        )}

        {/* Step 3: Date & Time Found */}
        {currentStep === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>When did you find it?</Text>
            <Text style={styles.stepDesc}>
              Helps establish timeline proximity with reported lost items.
            </Text>

            <Input
              label="Approximate Found Time *"
              placeholder="e.g. Today 4:15 PM"
              value={foundDate}
              onChangeText={setFoundDate}
              error={errors.foundDate}
              leftIcon={<Calendar size={18} color={COLORS.found} />}
            />

            <View style={styles.presets}>
              {['Just now (< 30 min)', 'Today within last 2 hours', 'Today morning', 'Yesterday'].map(
                (preset) => (
                  <Button
                    key={preset}
                    title={preset}
                    variant="secondary"
                    size="sm"
                    onPress={() => setFoundDate(preset)}
                    style={{ marginBottom: 8 }}
                  />
                )
              )}
            </View>
          </View>
        )}

        {/* Step 4: Found Location */}
        {currentStep === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Where did you find it?</Text>
            <Text style={styles.stepDesc}>
              Location proximity is a high-weighted signal in AI matching.
            </Text>

            <Button
              title={fetchingGps ? 'Fetching GPS...' : 'Use Current Device Location'}
              variant="outline"
              icon={<MapPin size={18} color={COLORS.primary} />}
              onPress={handleUseGps}
              loading={fetchingGps}
              style={{ marginBottom: SPACING.md }}
            />

            <Input
              label="Found Area / Landmark *"
              placeholder="e.g. Science Quad Bench, Near Cafeteria"
              value={location.approximateArea}
              onChangeText={(text) => setLocation({ ...location, approximateArea: text })}
              error={errors.location}
              leftIcon={<MapPin size={18} color={COLORS.found} />}
            />

            <Input
              label="City"
              placeholder="e.g. San Francisco"
              value={location.city}
              onChangeText={(text) => setLocation({ ...location, city: text })}
            />
          </View>
        )}

        {/* Step 5: Review & Submit */}
        {currentStep === 5 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Review Found Report</Text>
            <Text style={styles.stepDesc}>
              Review before submitting. Once submitted, our AI will instantly look for matching lost items.
            </Text>

            <View style={styles.reviewCard}>
              <Text style={styles.reviewItemTitle}>{title}</Text>
              <Text style={styles.reviewCategory}>{category} • {color} {brand ? `• ${brand}` : ''}</Text>
              <Text style={styles.reviewDesc}>{description}</Text>
              <Text style={styles.reviewMeta}>📍 {location.approximateArea}, {location.city}</Text>
              <Text style={styles.reviewMeta}>🕒 {foundDate}</Text>
            </View>

            <View style={styles.safetyBox}>
              <ShieldCheck size={18} color={COLORS.foundDark} />
              <Text style={styles.safetyBoxText}>
                Good Samaritan Notice: Thank you for helping return lost property. You will be connected directly with verified owners through in-app secure chat.
              </Text>
            </View>
          </View>
        )}

        {/* Bottom Navigation Buttons */}
        <View style={styles.navRow}>
          <Button
            title={currentStep === 1 ? 'Cancel' : 'Back'}
            variant="secondary"
            onPress={handleBack}
            style={styles.navBtn}
          />
          <Button
            title={currentStep === TOTAL_STEPS ? 'Submit Found Report' : 'Continue'}
            variant="primary"
            onPress={handleNext}
            style={styles.navBtnSubmit}
          />
        </View>
      </ScrollView>

      {/* AI Analyzing Modal */}
      <Modal visible={analyzingWithAI} transparent animationType="fade">
        <View style={styles.aiModalBackdrop}>
          <View style={styles.aiModalCard}>
            <View style={styles.aiModalIcon}>
              <Sparkles size={36} color={COLORS.found} />
            </View>
            <Text style={styles.aiModalTitle}>Searching for lost-item matches...</Text>
            <Text style={styles.aiModalDesc}>
              Local vision AI is analyzing image characteristics and comparing against existing lost reports in the local database.
            </Text>
            <ActivityIndicator size="large" color={COLORS.found} style={{ marginTop: SPACING.md }} />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.base,
    paddingBottom: SPACING['3xl'],
  },
  stepContainer: {
    backgroundColor: COLORS.surface,
    padding: SPACING.base,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.base,
  },
  stepTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 4,
  },
  stepDesc: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.base,
    lineHeight: 18,
  },
  fieldLabel: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  row: {
    flexDirection: 'row',
  },
  presets: {
    marginTop: SPACING.sm,
  },
  reviewCard: {
    backgroundColor: COLORS.surfaceSubtle,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.base,
  },
  reviewItemTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: 2,
  },
  reviewCategory: {
    ...TYPOGRAPHY.small,
    fontWeight: '700',
    color: COLORS.foundDark,
    marginBottom: 6,
  },
  reviewDesc: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  reviewMeta: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  safetyBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.foundLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: 8,
    alignItems: 'center',
  },
  safetyBoxText: {
    ...TYPOGRAPHY.small,
    color: COLORS.foundDark,
    flex: 1,
    lineHeight: 16,
  },
  navRow: {
    flexDirection: 'row',
    gap: 12,
  },
  navBtn: {
    flex: 1,
  },
  navBtnSubmit: {
    flex: 2,
  },
  aiModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  aiModalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  aiModalIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.foundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.base,
  },
  aiModalTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  aiModalDesc: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
