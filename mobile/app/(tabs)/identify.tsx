import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function IdentifyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColor();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 }]}>
        <Animated.Text
          entering={FadeInDown.delay(100).springify()}
          style={[styles.title, { color: colors.foreground }]}
        >
          Identificar Ave
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(200).springify()}
          style={[styles.subtitle, { color: colors.muted }]}
        >
          Elige como quieres identificar el ave
        </Animated.Text>

        <View style={styles.optionsContainer}>
          {/* Photo Option */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <TouchableOpacity
              onPress={() => router.push('/identify/photo')}
              activeOpacity={0.9}
              style={styles.optionCard}
            >
              <BlurView intensity={isDark ? 40 : 20} tint={isDark ? 'dark' : 'light'} style={styles.optionBlur}>
                <LinearGradient
                  colors={['rgba(45,80,22,0.6)', 'rgba(74,124,47,0.3)']}
                  style={styles.optionGradient}
                >
                  <View style={[styles.iconContainer, { backgroundColor: 'rgba(139,195,74,0.2)' }]}>
                    <Feather name="camera" size={48} color={colors.primaryLight} />
                  </View>
                  <Text style={[styles.optionTitle, { color: colors.foreground }]}>Por Fotografia</Text>
                  <Text style={[styles.optionDescription, { color: colors.muted }]}>
                    Toma una foto con tu camara o selecciona una imagen de tu galeria
                  </Text>
                  <View style={styles.optionFeatures}>
                    <FeatureItem icon="camera" text="Camara en vivo" color={colors.primaryLight} />
                    <FeatureItem icon="image" text="Galeria" color={colors.primaryLight} />
                  </View>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>

          {/* Audio Option */}
          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <TouchableOpacity
              onPress={() => router.push('/identify/audio')}
              activeOpacity={0.9}
              style={styles.optionCard}
            >
              <BlurView intensity={isDark ? 40 : 20} tint={isDark ? 'dark' : 'light'} style={styles.optionBlur}>
                <LinearGradient
                  colors={['rgba(212,160,23,0.6)', 'rgba(245,200,66,0.3)']}
                  style={styles.optionGradient}
                >
                  <View style={[styles.iconContainer, { backgroundColor: 'rgba(245,200,66,0.2)' }]}>
                    <Feather name="mic" size={48} color={colors.accent} />
                  </View>
                  <Text style={[styles.optionTitle, { color: colors.foreground }]}>Por Sonido</Text>
                  <Text style={[styles.optionDescription, { color: colors.muted }]}>
                    Graba el canto o llamado del ave para identificarla con BirdNET AI
                  </Text>
                  <View style={styles.optionFeatures}>
                    <FeatureItem icon="mic" text="Grabacion" color={colors.accent} />
                    <FeatureItem icon="activity" text="Visualizador" color={colors.accent} />
                  </View>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

function FeatureItem({ icon, text, color }: { icon: keyof typeof Feather.glyphMap; text: string; color: string }) {
  const { colors } = useThemeColor();
  return (
    <View style={styles.featureItem}>
      <Feather name={icon} size={14} color={color} />
      <Text style={[styles.featureText, { color: colors.muted }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 16 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 32 },
  optionsContainer: { gap: 20 },
  optionCard: { borderRadius: 24, overflow: 'hidden' },
  optionBlur: { borderRadius: 24, overflow: 'hidden' },
  optionGradient: { padding: 24, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center' },
  iconContainer: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  optionTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  optionDescription: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 16 },
  optionFeatures: { flexDirection: 'row', gap: 24 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  featureText: { fontSize: 12 },
});
