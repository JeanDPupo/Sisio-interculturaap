# 🎨 SISIO INTERCULTURAAP - MODERNIZACIÓN DE MOBILE APP
## Plan paso a paso para aplicar diseño moderno a `packages/mobile/`

**Referencia visual:** `mobile/app/` (raíz)  
**Destino:** `packages/mobile/src/` (donde se desarrolla)

---

## 📋 FASE 1: SETUP DE COMPONENTES Y TEMAS (1-2 horas)

### 1.1 Crear sistema de colores moderno
**Archivo:** `packages/mobile/src/theme/colors.ts`
```
Implementar paleta del plan original:
- Greens: #2D5016, #4A7C2F, #8BC34A
- Blues: #1A3A4A, #2E7D9A, #64B5F6
- Gold: #D4A017, #F5C842, #FF8F00
- Neutrals: #0D1B0F, #F0F7EE
```

### 1.2 Crear hook `useThemeColor` (similar a mobile/app)
**Archivo:** `packages/mobile/src/hooks/useThemeColor.ts`
```
Export:
- colors (foreground, background, primary, secondary, accent, muted, card, etc.)
- isDark (boolean)
- setTheme (function)
```

### 1.3 Crear componentes UI base
**Archivos a crear en `packages/mobile/src/components/ui/`:**
- `GlassCard.tsx` — BlurView + LinearGradient container
- `BirdCard.tsx` — Tarjeta de ave con animación
- `Button.tsx` — Primario, secundario, peligroso con estilos modernos
- `StatItem.tsx` — Contador animado
- `Header.tsx` — Header reutilizable

---

## 📱 FASE 2: MODERNIZAR PANTALLAS (3-4 horas)

### 2.1 HomeScreen.tsx
**Cambios principales:**
- [ ] Reemplazar StyleSheet plano con glassmorphism (BlurView + LinearGradient)
- [ ] Agregar animaciones con Reanimated (FadeInDown al entrar)
- [ ] Implementar dos botones CTA grandes (Por Foto / Por Sonido) con gradientes distintos
- [ ] Agregar sección de estadísticas animadas con contador
- [ ] Sección "Aves de la Sierra" con horizontal scroll (BirdCard)
- [ ] Sección cultural con ícono + descripción
- [ ] Aplicar colores dinámicos (useThemeColor)

**Referencia:** `mobile/app/(tabs)/index.tsx`

### 2.2 OnboardingScreen.tsx
**Cambios principales:**
- [ ] 3 slides tipo story (como en mobile/ reference)
- [ ] Slide 1: Hero parallax con imagen Sierra Nevada + CTA brilla
- [ ] Slide 2: Iconos que se dibujan solos
- [ ] Slide 3: Selector modo (usuario / invitado) con avatares
- [ ] Animaciones de transición entre slides
- [ ] Botones con glassmorphism

**Referencia:** `mobile/app/(onboarding)/`

### 2.3 PhotoCaptureScreen.tsx & AudioCaptureScreen.tsx
**Cambios principales:**
- [ ] Viewfinder animado (esquinas que pulsan en verde)
- [ ] Botones grandes glassmorphism para galería/cámara
- [ ] Overlay de "analizando" con scan lines
- [ ] Indicador de nivel de audio (barras animadas en gradiente)
- [ ] Loading states con animaciones

**Referencia:** `mobile/app/identify/photo.tsx` y `mobile/app/identify/audio.tsx`

### 2.4 BirdResultScreen.tsx
**Cambios principales (PANTALLA MÁS IMPORTANTE VISUALMENTE):**
- [ ] Reveal animation espectacular: imagen emerge del centro con bloom
- [ ] Nombre científico + español + nombre nativo (en tipografía especial)
- [ ] Ficha ancestral como tarjeta desplegable:
  - Significado ancestral
  - Rol en cosmovision
  - Hábitat con mini-mapa
  - Audio de referencia del canto
- [ ] Score de confianza visual (no porcentaje, barra orgánica)
- [ ] Botón "Guardar avistamiento" con pin animation
- [ ] Botón "Compartir"

**Referencia:** `mobile/app/identify/result.tsx`

### 2.5 LoginScreen.tsx & RegisterScreen.tsx
**Cambios principales:**
- [ ] Form inputs con estilos glassmorphism
- [ ] Botones con gradientes animados
- [ ] Validación visual con colores
- [ ] Loading states animados

### 2.6 MapScreen.tsx
**Cambios principales:**
- [ ] Mapa oscuro personalizado (custom tiles)
- [ ] Marcadores SVG de aves (coloreados por riesgo: verde/amarillo/rojo)
- [ ] Clusters animados que "estallan" en zoom
- [ ] Panel deslizable con avistamientos cercanos
- [ ] Filtros flotantes (especie, fecha, riesgo)
- [ ] Heatmap opcional

**Referencia:** `mobile/app/(tabs)/_layout.tsx` (structure)

### 2.7 ProfileScreen.tsx
**Cambios principales:**
- [ ] Avatar grande con anillo de nivel (se llena según avistamientos)
- [ ] Stats animadas (birdsIdentified, totalSightings, uniqueSpecies)
- [ ] Galería de logros (Pokédex ancestral)
- [ ] Timeline de avistamientos personales

### 2.8 SightingsScreen.tsx
**Cambios principales:**
- [ ] Grid masonry con fotos de aves
- [ ] Filtros chip animados por hábitat/riesgo
- [ ] Búsqueda con autocompletado
- [ ] Tarjetas expandibles con motion

### 2.9 SettingsScreen.tsx
**Cambios principales:**
- [ ] Toggle tema dark/light con animación sol↔luna
- [ ] Selector idioma con iconos comunidades
- [ ] Toggles: notificaciones, offline mode, calidad cámara
- [ ] Cada toggle con feedback háptico

### 2.10 SplashScreen.tsx
**Cambios principales:**
- [ ] Ave (silueta SVG) que vuela de derecha a izquierda
- [ ] Logo que se forma letra por letra (escritura ancestral)
- [ ] Duración ~2-3 segundos

---

## 🎬 FASE 3: ANIMACIONES GLOBALES (1-2 horas)

### 3.1 Implementar entrada de scroll
```
Todos los elementos principales usan:
- fade-up + blur-to-clear al entrar en viewport
- useAnimatedStyle + scrollViewAnimatedEventHandler
```

### 3.2 Microinteracciones
- [ ] Hover en tarjetas → shimmer dorado en bordes
- [ ] Botón de identificación → ripple concéntrico (como eco de ave)
- [ ] Mapa → marcadores con pulse verde
- [ ] Loading → ave que vuela en círculos

### 3.3 Transiciones de navegación
- [ ] Morphing suave con deslizamiento
- [ ] Evoca movimiento de alas

---

## 🔧 FASE 4: INTEGRACIÓN Y TESTING (1-2 horas)

### 4.1 Testing en dispositivos
- [ ] Android emulator
- [ ] iOS simulator
- [ ] Device real (si disponible)

### 4.2 Performance check
- [ ] 60fps en scrolls
- [ ] Animaciones suaves
- [ ] Memory usage aceptable
- [ ] Battery drain aceptable

### 4.3 Accesibilidad
- [ ] Contraste AA mínimo
- [ ] Texto legible
- [ ] Touch targets >= 44px
- [ ] Color no es el único indicador

---

## ✅ CRITERIOS DE ÉXITO

- [ ] **Primer impacto:** Al abrir en 3 segundos, se ve "premium" y moderno
- [ ] **Coherencia:** Se siente colombiano, serrano, indígena
- [ ] **Animaciones:** Suaves a 60fps
- [ ] **Detalles:** Cada pantalla vacía tiene empty state ilustrado
- [ ] **Paleta:** Todos los colores siguen la paleta especificada
- [ ] **Tipografía:** Serif para títulos, DM Sans para body
- [ ] **Glassmorphism:** Visible en cards principales y botones

---

## 📦 DEPENDENCIES NECESARIOS (YA INSTALADOS)

```json
- expo-blur: BlurView component
- expo-linear-gradient: LinearGradient
- react-native-reanimated: Animaciones
- @expo/vector-icons: Iconos
- @react-navigation/*: Navegación
```

---

## 🚀 PRÓXIMOS PASOS

1. **Comenzar Fase 1:** Setup tema y componentes (30 min)
2. **Fase 2:** Modernizar HomeScreen primero (1 hr)
3. **Fase 2.4:** BirdResultScreen (la más visual, 1.5 hrs)
4. **Resto de Fase 2:** Otras pantallas (2 hrs)
5. **Fase 3:** Animaciones globales (1 hr)
6. **Fase 4:** Testing y refinado (1-2 hrs)

**Total estimado:** 6-8 horas de trabajo

---

## 💡 TIPS

- Usa `mobile/app/(tabs)/index.tsx` como referencia de patrón
- Copia estructura de componentes desde `mobile/components/ui/`
- Para cada pantalla: primero estructura, luego estilos, luego animaciones
- Testea en device real lo antes posible
- Mantén commits pequeños y frecuentes

---

## 📝 NOTAS

- El plan del prompt original está en `plan_origina_del_que_sale_mobile_moderno.txt`
- Mobile app debe sentirse **nativa** — gestos swipe, tap feedback, safe areas
- Dark mode por defecto, con toggle a claro
- Backend API: `http://localhost:8000`

