import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Bell,
  MapPin,
  Cpu,
  Shield,
  Moon,
  ChevronRight,
  Info,
} from 'lucide-react-native';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { API_BASE_URL } from '../../services/api';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

export default function SettingsScreen() {
  const router = useRouter();

  const [matchNotifs, setMatchNotifs] = useState(true);
  const [messageNotifs, setMessageNotifs] = useState(true);
  const [approxLocationOnly, setApproxLocationOnly] = useState(true);
  const [apiUrl, setApiUrl] = useState(API_BASE_URL);

  const handleSaveApiUrl = () => {
    Alert.alert('Configuration Updated', `Backend API URL set to: ${apiUrl}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>AI Match Alerts</Text>
              <Text style={styles.rowDesc}>Receive high-priority alerts when a potential match is found</Text>
            </View>
            <Switch
              value={matchNotifs}
              onValueChange={setMatchNotifs}
              trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
              thumbColor={matchNotifs ? COLORS.primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>New Chat Messages</Text>
              <Text style={styles.rowDesc}>Instant notifications when another user messages you</Text>
            </View>
            <Switch
              value={messageNotifs}
              onValueChange={setMessageNotifs}
              trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
              thumbColor={messageNotifs ? COLORS.primary : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Location & Privacy */}
        <Text style={styles.sectionTitle}>Privacy & Location</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Hide Exact GPS Coordinates</Text>
              <Text style={styles.rowDesc}>Only display approximate campus/neighborhood area on reports</Text>
            </View>
            <Switch
              value={approxLocationOnly}
              onValueChange={setApproxLocationOnly}
              trackColor={{ false: COLORS.border, true: COLORS.foundLight }}
              thumbColor={approxLocationOnly ? COLORS.found : '#f4f3f4'}
            />
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => router.push('/settings/privacy')}
          >
            <Text style={styles.linkLabel}>Privacy Center & Safety Guidelines</Text>
            <ChevronRight size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Backend & Local AI Server Configuration */}
        <Text style={styles.sectionTitle}>Backend & Local AI Connection</Text>
        <View style={styles.card}>
          <Text style={styles.rowLabel}>API Base URL</Text>
          <Text style={styles.rowDesc}>
            Connects to your local Node.js + Express backend and Ollama container
          </Text>

          <Input
            value={apiUrl}
            onChangeText={setApiUrl}
            placeholder="http://192.168.1.XX:5000/api"
            containerStyle={{ marginTop: SPACING.sm }}
          />

          <Button
            title="Save Server Endpoint"
            variant="secondary"
            size="sm"
            onPress={handleSaveApiUrl}
          />
        </View>

        {/* App Info */}
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>App Version</Text>
            <Text style={styles.aboutValue}>1.0.0 (Expo SDK 57)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>AI Matching Engine</Text>
            <Text style={styles.aboutValue}>Ollama Vision (Local llava/moondream)</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.base,
    paddingBottom: SPACING['3xl'],
  },
  sectionTitle: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  rowInfo: {
    flex: 1,
    marginRight: 16,
  },
  rowLabel: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
  },
  rowDesc: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  linkLabel: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.primary,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  aboutLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  aboutValue: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.text,
  },
});
