import 'package:app/models/measurement.dart';
import 'package:app/models/site.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:json_annotation/json_annotation.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import 'measurement_value.dart';

part 'historical_measurement.g.dart';

@JsonSerializable()
class HistoricalMeasurement {
  @JsonKey(required: true)
  String time;

  @JsonKey(required: true, name: 'average_pm2_5')
  final MeasurementValue pm2_5;

  @JsonKey(required: true, name: 'average_pm10')
  final MeasurementValue pm10;

  @JsonKey(required: false)
  final MeasurementValue altitude;

  @JsonKey(required: false)
  final MeasurementValue speed;

  @JsonKey(required: false, name: 'externalTemperature')
  final MeasurementValue temperature;

  @JsonKey(required: false, name: 'externalHumidity')
  final MeasurementValue humidity;

  @JsonKey(required: true, name: 'site_id')
  final String siteId;

  @JsonKey(required: false, ignore: true)
  DateTime formattedTime = DateTime.now();

  @JsonKey(required: true, name: 'device_number')
  final int deviceNumber;

  HistoricalMeasurement(
      this.time,
      this.pm2_5,
      this.pm10,
      this.altitude,
      this.speed,
      this.temperature,
      this.humidity,
      this.siteId,
      this.deviceNumber);

  factory HistoricalMeasurement.fromJson(Map<String, dynamic> json) =>
      _$HistoricalMeasurementFromJson(json);

  Measurement getMeasurement(Site site) {
    return Measurement(time, pm2_5, pm10, altitude, speed, temperature,
        humidity, site, deviceNumber);
  }

  double getPm10Value() {
    if (pm10.calibratedValue == -0.1) {
      return pm10.value;
    }
    return pm10.calibratedValue;
  }

  double getPm2_5Value() {
    if (pm2_5.calibratedValue == -0.1) {
      return pm2_5.value;
    }
    return pm2_5.calibratedValue;
  }

  Map<String, dynamic> toJson() => _$HistoricalMeasurementToJson(this);

  @override
  String toString() {
    return 'HistoricalMeasurement{time: $time}';
  }

  static String createTableStmt() =>
      'CREATE TABLE IF NOT EXISTS ${historicalMeasurementsDb()}('
      'id PRIMARY KEY, ${Site.dbId()} TEXT,'
      '${dbTime()} TEXT, ${dbPm25()} REAL, '
      '${dbPm10()} REAL, ${dbAltitude()} REAL, '
      '${dbSpeed()} REAL, ${dbTemperature()} REAL, '
      '${dbHumidity()} REAL)';

  static String dbAltitude() => 'altitude';

  static String dbHumidity() => 'humidity';

  static String dbPm10() => 'pm10';

  static String dbPm25() => 'pm2_5';

  static String dbSpeed() => 'speed';

  static String dbTemperature() => 'temperature';

  static String dbTime() => 'time';

  static String dropTableStmt() =>
      'DROP TABLE IF EXISTS ${historicalMeasurementsDb()}';

  static String historicalMeasurementsDb() => 'historical_measurements';

  static Map<String, dynamic> mapFromDb(Map<String, dynamic> json) {
    return {
      'site_id': json[Site.dbId()] as String,
      'time': json[dbTime()] as String,
      'average_pm2_5': {'value': json[dbPm25()] as double},
      'average_pm10': {'value': json[dbPm10()] as double},
      'externalTemperature': {'value': json[dbTemperature()] as double},
      'externalHumidity': {'value': json[dbHumidity()] as double},
      'speed': {'value': json[dbSpeed()] as double},
      'altitude': {'value': json[dbAltitude()] as double},
    };
  }

  static Map<String, dynamic> mapToDb(HistoricalMeasurement measurement) {
    return {
      dbTime(): measurement.time,
      dbPm25(): measurement.getPm2_5Value(),
      dbPm10(): measurement.pm10.value,
      dbAltitude(): measurement.altitude.value,
      dbSpeed(): measurement.speed.value,
      dbTemperature(): measurement.temperature.value,
      dbHumidity(): measurement.humidity.value,
      Site.dbId(): measurement.siteId
    };
  }

  static List<HistoricalMeasurement> parseMeasurements(dynamic jsonBody) {
    var measurements = <HistoricalMeasurement>[];

    var jsonArray = jsonBody['measurements'];
    var offSet = DateTime.now().timeZoneOffset;
    for (var jsonElement in jsonArray) {
      try {
        var measurement = HistoricalMeasurement.fromJson(jsonElement);
        if (measurement.getPm2_5Value() != -0.1 &&
            measurement.getPm2_5Value() >= 0 &&
            measurement.getPm2_5Value() <= 500.4) {
          DateTime formattedDate;

          if (offSet.isNegative) {
            formattedDate = DateTime.parse(measurement.time)
                .subtract(Duration(hours: offSet.inHours));
          } else {
            formattedDate = DateTime.parse(measurement.time)
                .add(Duration(hours: offSet.inHours));
          }

          measurement.time =
              DateFormat('yyyy-MM-dd HH:mm:ss').format(formattedDate);
          measurements.add(measurement);
        }
      } catch (exception, stackTrace) {
        debugPrint(exception.toString());
        debugPrint(stackTrace.toString());
        Sentry.captureException(
          exception,
          stackTrace: stackTrace,
        );
      }
    }

    measurements.sort((measurementA, measurementB) {
      return DateTime.parse(measurementA.time)
          .compareTo(DateTime.parse(measurementB.time));
    });

    return measurements;
  }
}