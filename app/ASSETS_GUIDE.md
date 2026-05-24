# SISIO - Guia de Assets Visuales

## Estructura de Carpetas

```
app/assets/
├── images/
│   ├── logo/
│   │   └── logo.png                    # Logo principal de SISIO
│   ├── onboarding/
│   │   ├── hero-sierra-nevada.jpg      # Imagen hero de la Sierra Nevada
│   │   └── ilustracion-arhuaco.jpg     # Ilustracion comunidad Arhuaco
│   ├── birds/
│   │   ├── aguila-real.jpg
│   │   ├── loro-verde.jpg
│   │   ├── flamenco-andino.jpg
│   │   ├── colibri-garganta-roja.jpg
│   │   └── tucan-toco.jpg
│   ├── empty-states/
│   │   ├── no-sightings.jpg
│   │   ├── no-results.jpg
│   │   ├── offline.jpg
│   │   ├── error-identification.jpg
│   │   └── loading-catalog.jpg
│   ├── badges/
│   │   ├── badge-novato.svg
│   │   ├── badge-observador.svg
│   │   ├── badge-guardian.svg
│   │   └── badge-sabio.svg
│   └── backgrounds/
│       └── (para texturas adicionales)
├── icons/
│   ├── nav/
│   │   ├── home.svg
│   │   ├── camera.svg
│   │   ├── microphone.svg
│   │   ├── map.svg
│   │   ├── catalog.svg
│   │   ├── profile.svg
│   │   ├── settings.svg
│   │   ├── ar-viewer.svg
│   │   └── gallery.svg
│   ├── ficha/
│   │   ├── feather.svg
│   │   ├── cosmovision.svg
│   │   ├── habitat.svg
│   │   ├── audio-canto.svg
│   │   └── migration.svg
│   ├── risk/
│   │   ├── risk-low.svg
│   │   ├── risk-medium.svg
│   │   └── risk-high.svg
│   ├── map/
│   │   ├── marker-low.svg
│   │   ├── marker-medium.svg
│   │   ├── marker-high.svg
│   │   ├── marker-cluster.svg
│   │   └── marker-user.svg
│   ├── admin/
│   │   ├── approve.svg
│   │   ├── reject.svg
│   │   └── stats.svg
│   └── misc/
│       ├── sun-moon-toggle.svg
│       └── avatar-default.svg
├── patterns/
│   ├── pattern-arhuaco.svg
│   ├── section-divider.svg
│   ├── border-kogui.svg
│   ├── corners-ar.svg
│   └── particles-leaves.svg
└── animations/
    └── placeholder.json               # Placeholder para animaciones Lottie
```

## Paleta de Colores

### Verdes Selva (Principal)
- `#2D5016` - Verde Selva (principal)
- `#4A7C2F` - Verde Mouse
- `#8BC34A` - Verde Hoja
- `#E8F5E9` - Verde Claro

### Azules Noche Andina
- `#1A3A4A` - Azul Noche Andino
- `#2E7D9A` - Azul Cielo Montanoso
- `#E3F2FD` - Azul Claro

### Dorados y Naranjas (Acentos culturales)
- `#D4A017` - Oro Indigena
- `#F5C842` - Ambar Solar
- `#FF8F00` - Naranja Atardecer

### Tierras
- `#5D4037` - Marron Tierra
- `#8D6E63` - Marron Claro

### Neutros
- `#0D1B0F` - Negro Selva
- `#F0F7EE` - Blanco Niebla
- `#E0E0E0` - Gris Sutil

### Riesgos Ecosistemicos
- `#4CAF50` - Riesgo Bajo (verde)
- `#FFC107` - Riesgo Medio (amarillo)
- `#F44336` - Riesgo Alto (rojo)

## Uso en Codigo

### Importar tema y assets
```dart
import 'package:app/lib/theme/sisio_theme.dart';
```

### Usar colores
```dart
Container(
  color: SisioColors.verdeSelva,
  child: Text('Hola', style: TextStyle(color: SisioColors.blancoNiebla)),
)
```

### Usar assets
```dart
Image.asset(SisioAssets.logo)
SvgPicture.asset(SisioAssets.iconHome)
```

### Usar widgets personalizados
```dart
import 'package:app/lib/widgets/sisio_widgets.dart';

// Icono SVG
SisioIcon(assetPath: SisioAssets.iconCamera, size: 32)

// Estado vacio
SisioEmptyState(
  imagePath: SisioAssets.noSightings,
  title: 'Sin avistamientos',
  subtitle: 'Sal a explorar la naturaleza',
)

// Badge de riesgo
SisioRiskBadge(riskLevel: 'bajo')

// Tarjeta de ave
SisioBirdCard(
  imageUrl: SisioAssets.aguilaReal,
  commonName: 'Aguila Real',
  scientificName: 'Aquila chrysaetos',
  riskLevel: 'bajo',
)

// Seccion ancestral
SisioAncestralSection(
  iconPath: SisioAssets.iconFeather,
  title: 'Significado Ancestral',
  content: 'El aguila representa...',
)
```

## Animaciones Lottie (Pendientes)

Para agregar animaciones Lottie:
1. Crear la animacion en After Effects y exportar con Bodymovin
2. O buscar en LottieFiles.com animaciones de aves/naturaleza
3. Guardar el archivo .json en `assets/animations/`
4. Actualizar pubspec.yaml si es necesario

Animaciones sugeridas:
- `splash-bird-fly.json` - Ave volando para splash screen
- `logo-animated.json` - Logo con aleteo sutil
- `loading-bird.json` - Ave para estados de carga
- `recording-pulse.json` - Pulso para grabacion de audio

## Notas de Implementacion

1. **flutter_svg** ya esta agregado como dependencia para iconos SVG
2. **lottie** ya esta agregado para animaciones futuras
3. **cached_network_image** para optimizar imagenes de red
4. Todos los assets estan declarados en `pubspec.yaml`
5. El tema claro y oscuro estan configurados en `sisio_theme.dart`
