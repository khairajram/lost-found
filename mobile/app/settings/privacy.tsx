import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  ShieldCheck,
  MapPin,
  EyeOff,
  Users,
  AlertTriangle,
  Lock,
} from 'lucide-react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.banner}>
          <ShieldCheck size={32} color={COLORS.primary} />
          <Text style={styles.bannerTitle}>Privacy & Safety First</Text>
          <Text style={styles.bannerDesc}>
            Find & Lost is designed with strict data privacy safeguards to protect both lost-item owners and good samaritans.
          </Text>
        </View>

        {/* Section 1: Geolocation Privacy */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MapPin size={20} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Approximate Location Masking</Text>
          </View>
          <Text style={styles.cardText}>
            • Exact home addresses or precise GPS coordinates are never publicly shown on reports.{'\n'}
            • Public listings show fuzzy landmarks and neighborhoods (e.g. "Near Campus Library" or "Downtown Quad") rather than lat/long coordinates.
          </Text>
        </View>

        {/* Section 2: Zero-Knowledge Ownership Verification */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <EyeOff size={20} color={COLORS.ai} />
            <Text style={styles.cardTitle}>Hidden Identifying Proof</Text>
          </View>
          <Text style={styles.cardText}>
            • Owners provide private characteristics (lockscreen wallpaper, inside stickers, engravings) that are kept hidden from public view.{'\n'}
            • When a potential match occurs, the claimant proves ownership by submitting this information, which the finder verifies directly.
          </Text>
        </View>

        {/* Section 3: Safe Return Protocol */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Users size={20} color={COLORS.foundDark} />
            <Text style={styles.cardTitle}>Safe Meetup & Return Protocol</Text>
          </View>
          <Text style={styles.cardText}>
            • Always arrange physical meetups in well-lit, public spaces like campus safety desks, library receptions, or student centers.{'\n'}
            • Never wire money or pay upfront fees to claim an item.{'\n'}
            • Phone numbers and private emails remain masked by default; coordinate using in-app chat.
          </Text>
        </View>

        {/* Section 4: AI Disclaimer */}
        <View style={[styles.card, styles.warningCard]}>
          <View style={styles.cardHeader}>
            <AlertTriangle size={20} color="#B45309" />
            <Text style={[styles.cardTitle, { color: '#B45309' }]}>AI Suggestions Disclaimer</Text>
          </View>
          <Text style={[styles.cardText, { color: '#92400E' }]}>
            AI-generated matches are intelligent probability scores based on local vision and metadata comparison. They are not legal proof of ownership. Both parties must verify details before physical exchange.
          </Text>
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
  banner: {
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.xl,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  bannerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primaryDark,
    marginTop: SPACING.sm,
    marginBottom: 4,
  },
  bannerDesc: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primaryDark,
    textAlign: 'center',
    lineHeight: 18,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  warningCard: {
    backgroundColor: COLORS.warningLight,
    borderColor: '#FDE68A',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.sm,
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
    color: COLORS.text,
  },
  cardText: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});
