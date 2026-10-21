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
import { Sparkles, MapPin, Calendar, Check, ShieldAlert, ArrowLeft } from 'lucide-react-native';
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
  'Upload Photos',
  'Item Details',
  'Lost Date & Time',
  'Lost Location',
  'Review & Submit',
];

export default function CreateLostItemScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [analyzingWithAI, setAnalyzingWithAI] = useState(false);

  // Form State
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
  ]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Mobile Phone');
  const [brand, setBrand] = useState('Samsung');
  const [model, setModel] = useState('Galaxy S23');
  const [color, setColor] = useState('Black');
  const [description, setDescription] = useState('');
  const [distinctiveFeatures, setDistinctiveFeatures] = useState('Clear bumper case, small scratch near bottom bezel');
  const [lostDate, setLostDate] = useState('Today (within last 3 hours)');
  const [location, setLocation] = useState<ItemLocation>({
    latitude: 37.7749,
    longitude: -122.4194,
    city: 'San Francisco',
    approximateArea: 'University Library Campus Center',
  });
  const [fetchingGps, setFetchingGps] = useState(false);
  const [privateVerification, setPrivateVerification] = useState('Lockscreen has a watercolor cat picture');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [analyzingPhoto, setAnalyzingPhoto] = useState(false);
  const [aiDetectedBadge, setAiDetectedBadge] = useState<string | null>(null);

  const handleAutoDetectWithAI = async () => {
    if (images.length === 0) {
      Alert.alert('Upload Photo First', 'Please upload or select an image first so Gemini can analyze it.');
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
          setTitle(analysis.objectDescription);
          setDescription(`Lost ${analysis.primaryColor} ${analysis.category}. ${analysis.objectDescription}`);
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
        newErrors.images = 'Please upload at least 1 image of your item.';
      }
    } else if (step === 2) {
      if (!title.trim()) newErrors.title = 'Item title is required.';
      if (!category) newErrors.category = 'Please select a category.';
      if (!color.trim()) newErrors.color = 'Please specify primary color.';
      if (!description.trim() || description.trim().length < 10) {
        newErrors.description = 'Please describe the item (at least 10 characters).';
      }
    } else if (step === 3) {
      if (!lostDate.trim()) newErrors.lostDate = 'Please select or enter the date lost.';
    } else if (step === 4) {
      if (!location.approximateArea.trim()) {
        newErrors.location = 'Please specify the approximate area where you lost it.';
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
        lostDate: new Date().toISOString(),
        lostLocation: location,
        images,
        privateVerificationDetails: privateVerification.trim() || undefined,
      };

      // Simulate local Ollama vision pipeline
      setTimeout(async () => {
        const created = await itemsService.createLostItem(payload, user || undefined);
        setAnalyzingWithAI(false);
        Alert.alert(
          'Report Published & Analyzed!',
          'Your report is live. Local AI vision has analyzed your item and will notify you when matching found items are detected.',
          [
            {
              text: 'View Report',
              onPress: () => router.replace(`/lost/${created._id}` as any),
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
            <Text style={styles.stepTitle}>Upload Photos of Lost Item</Text>
            <Text style={styles.stepDesc}>
              Upload clear photos. The local AI vision model uses these to identify visual patterns, brand shapes, color hues, and markings.
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
                  icon={<Sparkles size={16} color={COLORS.primary} />}
                  onPress={handleAutoDetectWithAI}
                />
                {aiDetectedBadge && (
                  <View style={{ marginTop: 12, padding: 12, backgroundColor: '#EEF2FF', borderRadius: RADIUS.md, borderWidth: 1, borderColor: '#C7D2FE' }}>
                    <Text style={{ color: COLORS.primary, fontWeight: '700', fontSize: 13 }}>
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
              Provide specifications to help AI match against finder reports.
            </Text>

            <Input
              label="Item Name / Title *"
              placeholder="e.g. Samsung Galaxy S23 Ultra (Black)"
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
                  placeholder="e.g. Samsung, Apple, Fossil"
                  value={brand}
                  onChangeText={setBrand}
                />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <Input
                  label="Model (Optional)"
                  placeholder="e.g. S23, M1 Pro"
                  value={model}
                  onChangeText={setModel}
                />
              </View>
            </View>

            <Input
              label="Primary Color *"
              placeholder="e.g. Black, Navy Blue, Silver"
              value={color}
              onChangeText={setColor}
              error={errors.color}
            />

            <Input
              label="Description *"
              placeholder="Provide a detailed description of where and how you had it..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              error={errors.description}
            />

            <Input
              label="Distinctive Features (Separated by commas)"
              placeholder="e.g. Transparent bumper case, scratch on bottom bezel, cat sticker"
              value={distinctiveFeatures}
              onChangeText={setDistinctiveFeatures}
              helperText="Visible markings help the vision model distinguish your item from identical models."
            />
          </View>
        )}

        {/* Step 3: Date & Time */}
        {currentStep === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>When did you lose it?</Text>
            <Text style={styles.stepDesc}>
              Approximate timing allows the matching engine to filter recent found reports.
            </Text>

            <Input
              label="Approximate Lost Time *"
              placeholder="e.g. Today around 2:30 PM, Yesterday evening"
              value={lostDate}
              onChangeText={setLostDate}
              error={errors.lostDate}
              leftIcon={<Calendar size={18} color={COLORS.primary} />}
            />

            <View style={styles.presets}>
              {['Today (within 2 hours)', 'Today morning', 'Yesterday afternoon', 'Over the weekend'].map(
                (preset) => (
                  <Button
                    key={preset}
                    title={preset}
                    variant="secondary"
                    size="sm"
                    onPress={() => setLostDate(preset)}
                    style={{ marginBottom: 8 }}
                  />
                )
              )}
            </View>
          </View>
        )}

        {/* Step 4: Location */}
        {currentStep === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Where did you lose it?</Text>
            <Text style={styles.stepDesc}>
              For your privacy, only the neighborhood or approximate campus area is shown to other users.
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
              label="Approximate Location / Area *"
              placeholder="e.g. University Library, Science Quad, Mission St Cafe"
              value={location.approximateArea}
              onChangeText={(text) => setLocation({ ...location, approximateArea: text })}
              error={errors.location}
              leftIcon={<MapPin size={18} color={COLORS.primary} />}
            />

            <Input
              label="City"
              placeholder="e.g. San Francisco"
              value={location.city}
              onChangeText={(text) => setLocation({ ...location, city: text })}
            />

            <View style={styles.privacyNotice}>
              <ShieldAlert size={16} color={COLORS.foundDark} />
              <Text style={styles.privacyNoticeText}>
                Privacy Protection: Exact coordinates are never shared publicly. Reports only show approximate landmarks.
              </Text>
            </View>
          </View>
        )}

        {/* Step 5: Review & Private Verification */}
        {currentStep === 5 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Review & Verification</Text>
            <Text style={styles.stepDesc}>
              Double-check details before publishing your lost report.
            </Text>

            <View style={styles.reviewCard}>
              <Text style={styles.reviewItemTitle}>{title}</Text>
              <Text style={styles.reviewCategory}>{category} • {color} {brand ? `• ${brand}` : ''}</Text>
              <Text style={styles.reviewDesc}>{description}</Text>
              <Text style={styles.reviewMeta}>📍 {location.approximateArea}, {location.city}</Text>
              <Text style={styles.reviewMeta}>🕒 {lostDate}</Text>
            </View>

            <Input
              label="Hidden Ownership Verification (Only shown to verified finder)"
              placeholder="e.g. Wallpaper photo, secret engraving, inside serial number, sticker"
              value={privateVerification}
              onChangeText={setPrivateVerification}
              multiline
              numberOfLines={3}
              helperText="This secret remains completely hidden from public listings. You will use it to confirm ownership during the match return workflow."
            />
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
            title={currentStep === TOTAL_STEPS ? 'Submit Lost Report' : 'Continue'}
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
              <Sparkles size={36} color={COLORS.ai} />
            </View>
            <Text style={styles.aiModalTitle}>Analyzing item with local AI...</Text>
            <Text style={styles.aiModalDesc}>
              Local Ollama model is extracting visual features, object geometry, color palette, and matching against candidate found items.
            </Text>
            <ActivityIndicator size="large" color={COLORS.ai} style={{ marginTop: SPACING.md }} />
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
  privacyNotice: {
    flexDirection: 'row',
    backgroundColor: COLORS.foundLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: 8,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  privacyNoticeText: {
    ...TYPOGRAPHY.small,
    color: COLORS.foundDark,
    flex: 1,
    lineHeight: 16,
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
    color: COLORS.primary,
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
    backgroundColor: COLORS.aiLight,
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
