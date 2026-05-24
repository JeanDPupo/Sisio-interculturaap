import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../theme/sisio_theme.dart';

/// Widget para mostrar iconos SVG de SISIO con soporte de tema
class SisioIcon extends StatelessWidget {
  final String assetPath;
  final double size;
  final Color? color;

  const SisioIcon({
    super.key,
    required this.assetPath,
    this.size = 24,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return SvgPicture.asset(
      assetPath,
      width: size,
      height: size,
      colorFilter: color != null
          ? ColorFilter.mode(color!, BlendMode.srcIn)
          : ColorFilter.mode(
              Theme.of(context).iconTheme.color ?? SisioColors.negroSelva,
              BlendMode.srcIn,
            ),
    );
  }
}

/// Widget para estados vacíos con ilustración
class SisioEmptyState extends StatelessWidget {
  final String imagePath;
  final String title;
  final String? subtitle;
  final Widget? action;

  const SisioEmptyState({
    super.key,
    required this.imagePath,
    required this.title,
    this.subtitle,
    this.action,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              imagePath,
              width: 200,
              height: 200,
              fit: BoxFit.contain,
            ),
            const SizedBox(height: 24),
            Text(
              title,
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
              textAlign: TextAlign.center,
            ),
            if (subtitle != null) ...[
              const SizedBox(height: 8),
              Text(
                subtitle!,
                style: Theme.of(context).textTheme.bodyMedium,
                textAlign: TextAlign.center,
              ),
            ],
            if (action != null) ...[
              const SizedBox(height: 24),
              action!,
            ],
          ],
        ),
      ),
    );
  }
}

/// Widget para mostrar el badge de nivel de riesgo
class SisioRiskBadge extends StatelessWidget {
  final String riskLevel; // 'bajo', 'medio', 'alto'
  final double size;

  const SisioRiskBadge({
    super.key,
    required this.riskLevel,
    this.size = 24,
  });

  String get _assetPath {
    switch (riskLevel.toLowerCase()) {
      case 'bajo':
        return SisioAssets.riskLow;
      case 'medio':
        return SisioAssets.riskMedium;
      case 'alto':
        return SisioAssets.riskHigh;
      default:
        return SisioAssets.riskLow;
    }
  }

  String get _label {
    switch (riskLevel.toLowerCase()) {
      case 'bajo':
        return 'Riesgo Bajo';
      case 'medio':
        return 'Riesgo Medio';
      case 'alto':
        return 'Riesgo Alto';
      default:
        return 'Sin Riesgo';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Tooltip(
      message: _label,
      child: SvgPicture.asset(
        _assetPath,
        width: size,
        height: size,
      ),
    );
  }
}

/// Widget para tarjeta de ave con estilo SISIO
class SisioBirdCard extends StatelessWidget {
  final String imageUrl;
  final String commonName;
  final String scientificName;
  final String? riskLevel;
  final VoidCallback? onTap;

  const SisioBirdCard({
    super.key,
    required this.imageUrl,
    required this.commonName,
    required this.scientificName,
    this.riskLevel,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AspectRatio(
              aspectRatio: 16 / 10,
              child: Image.asset(
                imageUrl,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                  color: SisioColors.verdeClaro,
                  child: const Icon(
                    Icons.flutter_dash,
                    size: 48,
                    color: SisioColors.verdeMouse,
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          commonName,
                          style:
                              Theme.of(context).textTheme.titleMedium?.copyWith(
                                    fontWeight: FontWeight.bold,
                                  ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (riskLevel != null)
                        SisioRiskBadge(riskLevel: riskLevel!, size: 20),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    scientificName,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          fontStyle: FontStyle.italic,
                          color: SisioColors.marronClaro,
                        ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Widget para sección de ficha ancestral
class SisioAncestralSection extends StatelessWidget {
  final String iconPath;
  final String title;
  final String content;

  const SisioAncestralSection({
    super.key,
    required this.iconPath,
    required this.title,
    required this.content,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: SisioColors.blancoNiebla,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: SisioColors.oroIndigena.withValues(alpha: 0.3),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              SvgPicture.asset(
                iconPath,
                width: 24,
                height: 24,
                colorFilter: const ColorFilter.mode(
                  SisioColors.oroIndigena,
                  BlendMode.srcIn,
                ),
              ),
              const SizedBox(width: 12),
              Text(
                title,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: SisioColors.verdeSelva,
                    ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            content,
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ],
      ),
    );
  }
}

/// Widget de avatar de usuario con badge
class SisioUserAvatar extends StatelessWidget {
  final String? imageUrl;
  final double size;
  final String? badgePath;

  const SisioUserAvatar({
    super.key,
    this.imageUrl,
    this.size = 48,
    this.badgePath,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(
              color: SisioColors.verdeSelva,
              width: 2,
            ),
          ),
          child: ClipOval(
            child: imageUrl != null
                ? Image.network(
                    imageUrl!,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) =>
                        _buildDefaultAvatar(),
                  )
                : _buildDefaultAvatar(),
          ),
        ),
        if (badgePath != null)
          Positioned(
            right: 0,
            bottom: 0,
            child: SvgPicture.asset(
              badgePath!,
              width: size * 0.4,
              height: size * 0.4,
            ),
          ),
      ],
    );
  }

  Widget _buildDefaultAvatar() {
    return SvgPicture.asset(
      SisioAssets.avatarDefault,
      fit: BoxFit.cover,
    );
  }
}

/// Widget de separador decorativo
class SisioSectionDivider extends StatelessWidget {
  const SisioSectionDivider({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: SvgPicture.asset(
        SisioAssets.sectionDivider,
        width: double.infinity,
        height: 20,
      ),
    );
  }
}
