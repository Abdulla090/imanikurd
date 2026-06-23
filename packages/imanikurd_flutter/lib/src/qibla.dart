import 'dart:math' as math;

import 'models.dart';

const Coordinates kaabaCoordinates = Coordinates(lat: 21.4225, lng: 39.8262);

int calculateQibla(double latitude, double longitude) {
  final phiK = kaabaCoordinates.lat * math.pi / 180;
  final lambdaK = kaabaCoordinates.lng * math.pi / 180;
  final phi = latitude * math.pi / 180;
  final lambda = longitude * math.pi / 180;

  final psi = 180 / math.pi *
      math.atan2(
        math.sin(lambdaK - lambda),
        math.cos(phi) * math.tan(phiK) - math.sin(phi) * math.cos(lambdaK - lambda),
      );

  return ((psi + 360) % 360).round();
}

QiblaResult getQibla(Coordinates from) => QiblaResult(
      direction: calculateQibla(from.lat, from.lng),
      kaaba: kaabaCoordinates,
      from: from,
    );

bool isFacingQibla(
  double heading,
  double latitude,
  double longitude, {
  double tolerance = 10,
}) {
  final qibla = calculateQibla(latitude, longitude);
  final diff = ((heading - qibla + 180) % 360) - 180;
  return diff.abs() <= tolerance;
}

int getDistanceToKaaba(double latitude, double longitude) {
  const r = 6371.0;
  final dLat = (kaabaCoordinates.lat - latitude) * math.pi / 180;
  final dLng = (kaabaCoordinates.lng - longitude) * math.pi / 180;
  final a = math.pow(math.sin(dLat / 2), 2) +
      math.cos(latitude * math.pi / 180) *
          math.cos(kaabaCoordinates.lat * math.pi / 180) *
          math.pow(math.sin(dLng / 2), 2);
  final c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a));
  return (r * c).round();
}

Coordinates getKaabaCoordinates() => kaabaCoordinates;
