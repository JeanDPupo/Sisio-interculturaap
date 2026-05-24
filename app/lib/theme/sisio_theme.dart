import 'package:flutter/material.dart';

/// Paleta de colores oficial de SISIO - Aves de la Sierra Nevada
/// Basada en la identidad visual indígena Arhuaco/Kogui/Wiwa
class SisioColors {
  SisioColors._();

  // === VERDES SELVA (Principal) ===
  static const Color verdeSelva = Color(0xFF2D5016);
  static const Color verdeMouse = Color(0xFF4A7C2F);
  static const Color verdeHoja = Color(0xFF8BC34A);
  static const Color verdeClaro = Color(0xFFE8F5E9);

  // === AZULES NOCHE ANDINA ===
  static const Color azulNocheAndino = Color(0xFF1A3A4A);
  static const Color azulCieloMontanoso = Color(0xFF2E7D9A);
  static const Color azulClaro = Color(0xFFE3F2FD);

  // === DORADOS Y NARANJAS (Acentos culturales) ===
  static const Color oroIndigena = Color(0xFFD4A017);
  static const Color ambarSolar = Color(0xFFF5C842);
  static const Color naranjaAtardecer = Color(0xFFFF8F00);

  // === TIERRAS ===
  static const Color marronTierra = Color(0xFF5D4037);
  static const Color marronClaro = Color(0xFF8D6E63);

  // === NEUTROS ===
  static const Color negroSelva = Color(0xFF0D1B0F);
  static const Color blancoNiebla = Color(0xFFF0F7EE);
  static const Color grisSutil = Color(0xFFE0E0E0);

  // === RIESGOS ECOSISTEMICOS ===
  static const Color riesgoBajo = Color(0xFF4CAF50);
  static const Color riesgoMedio = Color(0xFFFFC107);
  static const Color riesgoAlto = Color(0xFFF44336);

  // === TEMA CLARO ===
  static ThemeData get lightTheme => ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        colorScheme: const ColorScheme.light(
          primary: verdeSelva,
          onPrimary: blancoNiebla,
          primaryContainer: verdeHoja,
          onPrimaryContainer: negroSelva,
          secondary: oroIndigena,
          onSecondary: negroSelva,
          secondaryContainer: ambarSolar,
          onSecondaryContainer: marronTierra,
          tertiary: azulCieloMontanoso,
          onTertiary: blancoNiebla,
          surface: blancoNiebla,
          onSurface: negroSelva,
          error: riesgoAlto,
          onError: blancoNiebla,
        ),
        scaffoldBackgroundColor: blancoNiebla,
        appBarTheme: const AppBarTheme(
          backgroundColor: verdeSelva,
          foregroundColor: blancoNiebla,
          elevation: 0,
        ),
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          backgroundColor: blancoNiebla,
          selectedItemColor: verdeSelva,
          unselectedItemColor: marronClaro,
        ),
        floatingActionButtonTheme: const FloatingActionButtonThemeData(
          backgroundColor: oroIndigena,
          foregroundColor: negroSelva,
        ),
        cardTheme: CardTheme(
          color: Colors.white,
          elevation: 2,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: verdeSelva,
            foregroundColor: blancoNiebla,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        ),
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
            foregroundColor: verdeSelva,
            side: const BorderSide(color: verdeSelva),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: blancoNiebla,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: verdeMouse),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: verdeSelva, width: 2),
          ),
        ),
        textTheme: const TextTheme(
          headlineLarge: TextStyle(
            color: negroSelva,
            fontWeight: FontWeight.bold,
          ),
          headlineMedium: TextStyle(
            color: verdeSelva,
            fontWeight: FontWeight.bold,
          ),
          bodyLarge: TextStyle(color: negroSelva),
          bodyMedium: TextStyle(color: marronTierra),
        ),
      );

  // === TEMA OSCURO ===
  static ThemeData get darkTheme => ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        colorScheme: const ColorScheme.dark(
          primary: verdeHoja,
          onPrimary: negroSelva,
          primaryContainer: verdeSelva,
          onPrimaryContainer: blancoNiebla,
          secondary: ambarSolar,
          onSecondary: negroSelva,
          secondaryContainer: oroIndigena,
          onSecondaryContainer: blancoNiebla,
          tertiary: azulCieloMontanoso,
          onTertiary: blancoNiebla,
          surface: azulNocheAndino,
          onSurface: blancoNiebla,
          error: riesgoAlto,
          onError: blancoNiebla,
        ),
        scaffoldBackgroundColor: negroSelva,
        appBarTheme: const AppBarTheme(
          backgroundColor: azulNocheAndino,
          foregroundColor: blancoNiebla,
          elevation: 0,
        ),
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          backgroundColor: azulNocheAndino,
          selectedItemColor: verdeHoja,
          unselectedItemColor: grisSutil,
        ),
        floatingActionButtonTheme: const FloatingActionButtonThemeData(
          backgroundColor: ambarSolar,
          foregroundColor: negroSelva,
        ),
        cardTheme: CardTheme(
          color: azulNocheAndino,
          elevation: 2,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: verdeHoja,
            foregroundColor: negroSelva,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: azulNocheAndino,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: verdeMouse),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: verdeHoja, width: 2),
          ),
        ),
        textTheme: const TextTheme(
          headlineLarge: TextStyle(
            color: blancoNiebla,
            fontWeight: FontWeight.bold,
          ),
          headlineMedium: TextStyle(
            color: verdeHoja,
            fontWeight: FontWeight.bold,
          ),
          bodyLarge: TextStyle(color: blancoNiebla),
          bodyMedium: TextStyle(color: grisSutil),
        ),
      );
}

/// Rutas de assets para fácil acceso
class SisioAssets {
  SisioAssets._();

  // === LOGO ===
  static const String logo = 'assets/images/logo/logo.png';

  // === ONBOARDING ===
  static const String heroSierraNevada =
      'assets/images/onboarding/hero-sierra-nevada.jpg';
  static const String ilustracionArhuaco =
      'assets/images/onboarding/ilustracion-arhuaco.jpg';

  // === AVES ===
  static const String aguilaReal = 'assets/images/birds/aguila-real.jpg';
  static const String loroVerde = 'assets/images/birds/loro-verde.jpg';
  static const String flamencoAndino = 'assets/images/birds/flamenco-andino.jpg';
  static const String colibriGargantaRoja =
      'assets/images/birds/colibri-garganta-roja.jpg';
  static const String tucanToco = 'assets/images/birds/tucan-toco.jpg';

  // === EMPTY STATES ===
  static const String noSightings =
      'assets/images/empty-states/no-sightings.jpg';
  static const String noResults = 'assets/images/empty-states/no-results.jpg';
  static const String offline = 'assets/images/empty-states/offline.jpg';
  static const String errorIdentification =
      'assets/images/empty-states/error-identification.jpg';
  static const String loadingCatalog =
      'assets/images/empty-states/loading-catalog.jpg';

  // === BADGES ===
  static const String badgeNovato = 'assets/images/badges/badge-novato.svg';
  static const String badgeObservador =
      'assets/images/badges/badge-observador.svg';
  static const String badgeGuardian = 'assets/images/badges/badge-guardian.svg';
  static const String badgeSabio = 'assets/images/badges/badge-sabio.svg';

  // === ICONOS NAV ===
  static const String iconHome = 'assets/icons/nav/home.svg';
  static const String iconCamera = 'assets/icons/nav/camera.svg';
  static const String iconMicrophone = 'assets/icons/nav/microphone.svg';
  static const String iconMap = 'assets/icons/nav/map.svg';
  static const String iconCatalog = 'assets/icons/nav/catalog.svg';
  static const String iconProfile = 'assets/icons/nav/profile.svg';
  static const String iconSettings = 'assets/icons/nav/settings.svg';
  static const String iconArViewer = 'assets/icons/nav/ar-viewer.svg';
  static const String iconGallery = 'assets/icons/nav/gallery.svg';

  // === ICONOS FICHA ===
  static const String iconFeather = 'assets/icons/ficha/feather.svg';
  static const String iconCosmovision = 'assets/icons/ficha/cosmovision.svg';
  static const String iconHabitat = 'assets/icons/ficha/habitat.svg';
  static const String iconAudioCanto = 'assets/icons/ficha/audio-canto.svg';
  static const String iconMigration = 'assets/icons/ficha/migration.svg';

  // === ICONOS RIESGO ===
  static const String riskLow = 'assets/icons/risk/risk-low.svg';
  static const String riskMedium = 'assets/icons/risk/risk-medium.svg';
  static const String riskHigh = 'assets/icons/risk/risk-high.svg';

  // === MARCADORES MAPA ===
  static const String markerLow = 'assets/icons/map/marker-low.svg';
  static const String markerMedium = 'assets/icons/map/marker-medium.svg';
  static const String markerHigh = 'assets/icons/map/marker-high.svg';
  static const String markerCluster = 'assets/icons/map/marker-cluster.svg';
  static const String markerUser = 'assets/icons/map/marker-user.svg';

  // === ICONOS ADMIN ===
  static const String iconApprove = 'assets/icons/admin/approve.svg';
  static const String iconReject = 'assets/icons/admin/reject.svg';
  static const String iconStats = 'assets/icons/admin/stats.svg';

  // === ICONOS MISC ===
  static const String iconSunMoon = 'assets/icons/misc/sun-moon-toggle.svg';
  static const String avatarDefault = 'assets/icons/misc/avatar-default.svg';

  // === PATRONES ===
  static const String patternArhuaco = 'assets/patterns/pattern-arhuaco.svg';
  static const String sectionDivider = 'assets/patterns/section-divider.svg';
  static const String borderKogui = 'assets/patterns/border-kogui.svg';
  static const String cornersAr = 'assets/patterns/corners-ar.svg';
  static const String particlesLeaves = 'assets/patterns/particles-leaves.svg';
}
