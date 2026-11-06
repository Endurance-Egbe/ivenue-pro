import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { SessionResponse } from '../../../lib/api';
import { colors } from '../../../theme/colors';

type Props = {
  session: SessionResponse;
  onBrowse: () => void;
  onSignOut: () => void;
};

export function ProfileScreen({ session, onBrowse, onSignOut }: Props) {
  const initials = session.user.full_name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Pressable accessibilityLabel="Back to venues" onPress={onBrowse} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.ink} />
          </Pressable>
          <Text style={styles.title}>My profile</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{initials || 'U'}</Text></View>
          <Text style={styles.name}>{session.user.full_name}</Text>
          <Text style={styles.email}>{session.user.email}</Text>
          <View style={styles.verifiedBadge}>
            <MaterialCommunityIcons name="check-decagram-outline" size={16} color="#3c7046" />
            <Text style={styles.verifiedText}>{session.user.is_verified ? 'Verified account' : 'Complete verification'}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your iVenue account</Text>
        <ProfileRow icon="calendar-heart-outline" title="My bookings" detail="Your upcoming and past events" />
        <ProfileRow icon="heart-outline" title="Saved spaces" detail="Venues you want to remember" />

        <Text style={[styles.sectionTitle, styles.hostSectionTitle]}>Want to host?</Text>
        <View style={styles.hostCard}>
          <View style={styles.hostIcon}><MaterialCommunityIcons name="storefront-outline" size={25} color={colors.accent} /></View>
          <Text style={styles.hostTitle}>Become an iVenue host</Text>
          <Text style={styles.hostText}>Apply to list your space. After approval, we&apos;ll guide you through identity, payout, and property verification.</Text>
          <Pressable accessibilityRole="button" onPress={() => undefined} style={styles.hostButton}>
            <Text style={styles.hostButtonText}>Start host application</Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color={colors.surface} />
          </Pressable>
          <Text style={styles.hostNote}>Host access is reviewed separately and does not change your customer account.</Text>
        </View>

        <Pressable accessibilityRole="button" onPress={onSignOut} style={styles.signOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function ProfileRow({ icon, title, detail }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; title: string; detail: string }) {
  return (
    <Pressable style={styles.row}>
      <View style={styles.rowIcon}><MaterialCommunityIcons name={icon} size={22} color={colors.accent} /></View>
      <View style={styles.rowCopy}><Text style={styles.rowTitle}>{title}</Text><Text style={styles.rowDetail}>{detail}</Text></View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.paper, paddingTop: Platform.OS === 'android' ? 24 : Platform.OS === 'ios' ? 12 : 0 },
  content: { padding: 20, paddingBottom: 40 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  topBarSpacer: { width: 40 },
  title: { color: colors.ink, fontFamily: 'serif', fontSize: 24 },
  profileCard: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: 22, padding: 24, borderWidth: 1, borderColor: colors.line },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  avatarText: { color: colors.paper, fontSize: 24, fontWeight: '700' },
  name: { color: colors.ink, fontSize: 22, fontWeight: '700' },
  email: { color: colors.muted, fontSize: 14, marginTop: 5 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 13 },
  verifiedText: { color: '#3c7046', fontSize: 13, fontWeight: '600' },
  sectionTitle: { color: colors.ink, fontSize: 16, fontWeight: '700', marginTop: 28, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 16, padding: 14, marginBottom: 10 },
  rowIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#fff5e9', alignItems: 'center', justifyContent: 'center' },
  rowCopy: { flex: 1, marginLeft: 12 },
  rowTitle: { color: colors.ink, fontSize: 15, fontWeight: '700' },
  rowDetail: { color: colors.muted, fontSize: 12, marginTop: 4 },
  hostSectionTitle: { marginTop: 26 },
  hostCard: { backgroundColor: colors.ink, borderRadius: 20, padding: 20 },
  hostIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#332a22', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  hostTitle: { color: colors.surface, fontSize: 19, fontWeight: '700' },
  hostText: { color: '#d8cec4', fontSize: 13, lineHeight: 20, marginTop: 8 },
  hostButton: { height: 50, borderRadius: 13, backgroundColor: colors.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 18 },
  hostButtonText: { color: colors.surface, fontSize: 14, fontWeight: '700' },
  hostNote: { color: '#aa9e93', fontSize: 11, lineHeight: 16, marginTop: 12 },
  signOut: { alignItems: 'center', padding: 18, marginTop: 16 },
  signOutText: { color: colors.error, fontSize: 14, fontWeight: '700' },
});
