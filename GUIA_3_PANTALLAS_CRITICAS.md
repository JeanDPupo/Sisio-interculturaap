# 🎯 GUÍA DETALLADA PARA LAS 3 PRÓXIMAS PANTALLAS

**Estas 3 pantallas son CRÍTICAS para el "wow factor" en la presentación.**

---

## 1️⃣ OnboardingScreen (PRIMERA IMPRESIÓN)

**Ubicación:** `packages/mobile/src/screens/OnboardingScreen.tsx`

### Estructura (3 slides tipo Tinder):

**Slide 1: Hero**
```
- Fondo: Parallax image (Sierra Nevada)
- Título gigante: "Sisio"
- Subtítulo: "Conocimiento ancestral + Tecnología moderna"
- CTA: Botón "Comenzar" con shimmer animation
```

**Slide 2: Explicación**
```
- Icono 1: Cámara → Identifica aves por foto
- Icono 2: Micrófono → Identifica aves por sonido
- Icono 3: Corazón → Preserva conocimiento ancestral
- Cada icono se dibuja solo (usar Animated.View con SVG)
```

**Slide 3: Modo**
```
- Opción 1: "Entrar como usuario" (avatar ilustrado)
- Opción 2: "Explorar como invitado"
- Buttons glassmorphism
```

### Pasos implementación:

1. Usar `react-native-snap-carousel` o Animated.View con panResponder
2. Agregar SafeAreaView en cada slide
3. Animaciones: FadeInDown para títulos, FadeInUp para botones
4. Parallax en imagen: usar ScrollView con native driver

### Código snippet:

```tsx
const OnboardingScreen = ({ navigation }: any) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { colors } = useThemeColor();

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const slide = Math.ceil(e.nativeEvent.contentOffset.x / width);
          setCurrentSlide(slide);
        }}
      >
        {/* Slide 1: Hero */}
        <HeroSlide colors={colors} onNext={() => scrollViewRef.current?.scrollTo({ x: width })} />

        {/* Slide 2: Features */}
        <FeaturesSlide colors={colors} />

        {/* Slide 3: Mode Selection */}
        <ModeSlide
          colors={colors}
          onUserMode={() => navigation.replace('LoginScreen')}
          onGuestMode={() => navigation.replace('HomeScreen')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
```

**Tiempo:** ~1.5 horas

---

## 2️⃣ PhotoCaptureScreen (CORE FUNCTIONALITY)

**Ubicación:** `packages/mobile/src/screens/PhotoCaptureScreen.tsx`

### Estructura:

```
┌─────────────────────────┐
│  ← X (cerrar)   ⚙ (settings) │
├─────────────────────────┤
│                         │
│   [Viewfinder]          │
│   (Animated corners)    │
│                         │
├─────────────────────────┤
│ [Galería]    [Cámara]   │
│ Glassmorphism buttons   │
└─────────────────────────┘
```

### Features:

1. **Viewfinder animado:**
   - Esquinas pulsantes en verde
   - Usar Animated.View con timing()
   - Pulse effect en Feather icons

2. **Dos botones CTA:**
   - Izquierda: "Elegir de galería"
   - Derecha: "Abrir cámara"
   - Ambos glassmorphism

3. **Estados:**
   - Initial: Mostrando viewfinder
   - Selected: Preview con overlay "Analizando..."
   - Processing: Spinner + scan lines
   - Result: Navigate a BirdResultScreen

### Código snippet:

```tsx
export const PhotoCaptureScreen = ({ navigation }: any) => {
  const { colors } = useThemeColor();
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withTiming(1.2, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const cornerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Header title="Capturar Foto" />

      <View style={styles.viewfinder}>
        {/* Esquinas pulsantes */}
        <Animated.View style={[styles.corner, styles.topLeft, cornerStyle]} />
        <Animated.View style={[styles.corner, styles.topRight, cornerStyle]} />
        <Animated.View style={[styles.corner, styles.bottomLeft, cornerStyle]} />
        <Animated.View style={[styles.corner, styles.bottomRight, cornerStyle]} />
      </View>

      {/* Botones */}
      <View style={styles.buttons}>
        <Button
          title="Elegir de galería"
          icon={<Feather name="image" size={20} color={colors.foreground} />}
          onPress={pickFromGallery}
          fullWidth
        />
        <Button
          title="Abrir cámara"
          icon={<Feather name="camera" size={20} color={colors.foreground} />}
          onPress={openCamera}
          fullWidth
        />
      </View>
    </View>
  );
};
```

**Tiempo:** ~1 hora

---

## 3️⃣ AudioCaptureScreen (CORE FUNCTIONALITY)

**Ubicación:** `packages/mobile/src/screens/AudioCaptureScreen.tsx`

### Estructura:

```
┌─────────────────────────┐
│  ← (Volver)             │
├─────────────────────────┤
│                         │
│  [Waveform visualization]
│  (Animated bars)        │
│                         │
│     [● Rec Button]      │
│     (Large, circular)   │
│                         │
│  Timer: 00:45           │
│  Level: ████░░░░░░      │
│                         │
└─────────────────────────┘
```

### Features:

1. **Visualizador de onda:**
   - Array de barras animadas
   - Colores en gradiente (verde→dorado)
   - Sincronizado con level del micrófono

2. **Botón de grabación:**
   - Circular, grande (~100px)
   - Estados: idle (verde), recording (rojo), processing (ámbar)
   - Efecto de pulsación cuando está grabando

3. **Listening animation:**
   - Círculos concéntricos que se expanden
   - Visible cuando está "escuchando"

4. **Timer elegante:**
   - MM:SS format
   - Aparecer solo cuando está grabando

### Código snippet:

```tsx
export const AudioCaptureScreen = ({ navigation }: any) => {
  const { colors, isDark } = useThemeColor();
  const [isRecording, setIsRecording] = useState(false);
  const [waveData, setWaveData] = useState<number[]>(Array(30).fill(0.2));
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (isRecording) {
      pulseScale.value = withRepeat(
        withTiming(1.3, { duration: 600 }),
        -1,
        true
      );
    }
  }, [isRecording]);

  const recordButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const handleRecord = async () => {
    setIsRecording(!isRecording);
    // Start audio recording logic
  };

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Header title="Grabar Sonido" />

      {/* Waveform */}
      <View style={styles.waveformContainer}>
        <LinearGradient
          colors={[colors.primaryLight, colors.accent]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.waveformGradient}
        >
          {waveData.map((value, index) => (
            <Animated.View
              key={index}
              style={[
                styles.waveBar,
                {
                  height: `${value * 100}%`,
                },
              ]}
            />
          ))}
        </LinearGradient>
      </View>

      {/* Record Button */}
      <Animated.View style={[styles.recordButton, recordButtonStyle]}>
        <TouchableOpacity
          onPress={handleRecord}
          style={[
            styles.recordButtonInner,
            {
              backgroundColor: isRecording ? colors.danger : colors.primaryLight,
            },
          ]}
        >
          <Feather
            name={isRecording ? 'square' : 'mic'}
            size={32}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Timer */}
      {isRecording && (
        <Text style={[styles.timer, { color: colors.foreground }]}>
          {formatTime(recordingTime)}
        </Text>
      )}

      {/* Level Indicator */}
      <View style={styles.levelContainer}>
        <Text style={[styles.levelLabel, { color: colors.muted }]}>
          NIVEL
        </Text>
        <View style={[styles.levelBar, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.levelProgress,
              {
                width: `${audioLevel * 100}%`,
                backgroundColor: colors.accent,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};
```

**Tiempo:** ~1 hora

---

## ✅ CHECKLIST PARA ESTAS 3 PANTALLAS

- [ ] OnboardingScreen: 3 slides, animaciones suaves, botones glassmorphism
- [ ] PhotoCaptureScreen: Viewfinder animado, preview, integración cámara/galería
- [ ] AudioCaptureScreen: Waveform visual, recording button, timer, level meter

- [ ] Todos los componentes usando useThemeColor
- [ ] Dark/light mode soportado
- [ ] Animaciones 60fps (usar native driver cuando posible)
- [ ] Touch targets >= 44px
- [ ] Testing en device real

---

## 📚 COMPONENTES/HOOKS A USAR

- `Button` - desde components/ui
- `GlassCard` - desde components/ui
- `useThemeColor` - desde hooks
- `BlurView` - desde expo-blur
- `LinearGradient` - desde expo-linear-gradient
- `Animated` - desde react-native-reanimated
- `Feather` - desde @expo/vector-icons
- `SafeAreaView` - desde react-native-safe-area-context

---

## 🎨 REFERENCIAS DE DISEÑO

- OnboardingScreen: `mobile/app/(onboarding)/index.tsx` y `mobile/app/(onboarding)/_layout.tsx`
- PhotoCaptureScreen: `mobile/app/identify/photo.tsx`
- AudioCaptureScreen: `mobile/app/identify/audio.tsx`

---

## 🔗 INTEGRACIONES NECESARIAS

**OnboardingScreen:**
- ✅ useAppStore para hasSeenOnboarding flag

**PhotoCaptureScreen:**
- ✅ expo-image-picker (Pick from gallery)
- ✅ expo-camera (Open camera)
- ✅ Enviar al backend para identificación

**AudioCaptureScreen:**
- ✅ expo-av (Audio recording)
- ✅ Visualización de waveform en tiempo real
- ✅ Enviar al backend para identificación

---

**¡Estos son los "quick wins" que harán que la app brille visualmente! 🌟**
