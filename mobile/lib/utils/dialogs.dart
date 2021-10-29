import 'package:app/constants/app_constants.dart';
import 'package:app/models/measurement.dart';
import 'package:app/utils/pm.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

RawMaterialButton customOkayButton(context) {
  return RawMaterialButton(
    shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(4.0),
        side: BorderSide(color: ColorConstants.appColor, width: 1)),
    fillColor: ColorConstants.appColor,
    elevation: 0,
    highlightElevation: 0,
    splashColor: Colors.black12,
    highlightColor: ColorConstants.appColor.withOpacity(0.4),
    onPressed: () async {
      Navigator.of(context).pop();
    },
    child: const Padding(
      padding: EdgeInsets.all(4),
      child: Text(
        'Close',
        style: TextStyle(color: Colors.white),
      ),
    ),
  );
}

void infoDialog(context, String message) {
  showGeneralDialog(
    context: context,
    barrierDismissible: false,
    transitionDuration: const Duration(milliseconds: 250),
    transitionBuilder: (context, animation, secondaryAnimation, child) {
      return FadeTransition(
        opacity: animation,
        child: ScaleTransition(
          scale: animation,
          child: child,
        ),
      );
    },
    pageBuilder: (context, animation, secondaryAnimation) {
      return AlertDialog(
        title: const Text('AirQopedia'),
        content: Text(message),
        actions: <Widget>[
          TextButton(
            onPressed: () => Navigator.pop(context, 'OK'),
            child: Text(
              'OK',
              style: TextStyle(color: ColorConstants.appColor),
            ),
          ),
        ],
      );
    },
  );
}

void pmInfoDialog(context, Measurement measurement) {
  showGeneralDialog(
    context: context,
    barrierDismissible: false,
    transitionDuration: const Duration(milliseconds: 250),
    transitionBuilder: (context, animation, secondaryAnimation, child) {
      return FadeTransition(
        opacity: animation,
        child: ScaleTransition(
          scale: animation,
          child: child,
        ),
      );
    },
    pageBuilder: (context, animation, secondaryAnimation) {
      return AlertDialog(
        scrollable: true,
        shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(8.0))),
        contentPadding: const EdgeInsets.all(0),
        content: Container(
            decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.all(Radius.circular(8.0))),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(
                  height: 16,
                ),
                Padding(
                  padding: const EdgeInsets.only(left: 16, right: 16),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Know Your Air',
                        style: TextStyle(
                            color: ColorConstants.appColorBlue,
                            fontSize: 16,
                            fontWeight: FontWeight.bold),
                      ),
                      GestureDetector(
                        onTap: () => Navigator.pop(context, 'OK'),
                        child: SvgPicture.asset(
                          'assets/icon/close.svg',
                          semanticsLabel: 'Pm2.5',
                          height: 20,
                          width: 20,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(
                  height: 11,
                ),
                Divider(
                  height: 1,
                  color: ColorConstants.appColorBlack.withOpacity(0.2),
                ),
                const SizedBox(
                  height: 8,
                ),
                Padding(
                  padding:
                      const EdgeInsets.only(left: 16, right: 16, bottom: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      RichText(
                        text: TextSpan(
                          children: <TextSpan>[
                            TextSpan(
                              text: 'PM',
                              style: TextStyle(
                                fontSize: 17,
                                color: ColorConstants.appColor,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            TextSpan(
                              text: '2.5',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: ColorConstants.appColor,
                              ),
                            )
                          ],
                        ),
                      ),
                      const SizedBox(
                        height: 5,
                      ),
                      RichText(
                        text: TextSpan(
                          children: <TextSpan>[
                            TextSpan(
                              text: 'Particulate matter(PM) ',
                              style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w500,
                                  color: ColorConstants.appColorBlack),
                            ),
                            TextSpan(
                              text: 'is a complex mixture of extremely'
                                  ' small particles and liquid droplets.',
                              style: TextStyle(
                                color: ColorConstants.appColorBlack
                                    .withOpacity(0.7),
                                fontSize: 10,
                              ),
                            )
                          ],
                        ),
                      ),
                      const SizedBox(
                        height: 8,
                      ),
                      RichText(
                        text: TextSpan(
                          children: <TextSpan>[
                            TextSpan(
                              text: 'When measuring particles there are two '
                                  'size categories commonly used: ',
                              style: TextStyle(
                                color: ColorConstants.appColorBlack
                                    .withOpacity(0.7),
                                fontSize: 10,
                              ),
                            ),
                            TextSpan(
                              text: 'PM2.5 ',
                              style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w500,
                                  color: ColorConstants.appColorBlack),
                            ),
                            TextSpan(
                              text: 'and ',
                              style: TextStyle(
                                fontSize: 10,
                                color: ColorConstants.appColorBlack
                                    .withOpacity(0.7),
                              ),
                            ),
                            TextSpan(
                              text: 'PM10',
                              style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w500,
                                  color: ColorConstants.appColorBlack),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(
                        height: 17.35,
                      ),
                      Container(
                        padding: const EdgeInsets.fromLTRB(12, 2.0, 12, 2),
                        decoration: BoxDecoration(
                            color: pm2_5ToColor(measurement.getPm2_5Value())
                                .withOpacity(0.4),
                            borderRadius:
                                const BorderRadius.all(Radius.circular(537.0))),
                        child: Text(
                          pmToString(measurement.getPm2_5Value()),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                              fontSize: 10,
                              color:
                                  pm2_5TextColor(measurement.getPm2_5Value()),
                              fontWeight: FontWeight.w500),
                        ),
                      ),
                      const SizedBox(
                        height: 6.35,
                      ),
                      RichText(
                        text: TextSpan(
                          children: <TextSpan>[
                            TextSpan(
                              text:
                                  '${pmToLongString(measurement.getPm2_5Value())}'
                                  ' means; ',
                              style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w500,
                                  color: ColorConstants.appColorBlack),
                            ),
                            TextSpan(
                              text: pmToInfoDialog(measurement.getPm2_5Value()),
                              style: TextStyle(
                                color: ColorConstants.appColorBlack
                                    .withOpacity(0.7),
                                fontSize: 10,
                              ),
                            )
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            )),
      );
      return Container(
          height: 237.7,
          width: 280,
          decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.all(Radius.circular(8.0))),
          child: Column(
            children: [
              const SizedBox(
                height: 16,
              ),
              Padding(
                padding: const EdgeInsets.only(left: 16, right: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Know Your Air',
                      style: TextStyle(
                          color: ColorConstants.appColorBlue,
                          fontSize: 16,
                          fontWeight: FontWeight.bold),
                    )
                  ],
                ),
              ),
              const SizedBox(
                height: 11,
              ),
              Divider(
                height: 1,
                color: ColorConstants.appColorBlack.withOpacity(0.7),
              )
            ],
          ));
    },
  );
}

Future<void> showSnackBar(context, String message) async {
  var snackBar = SnackBar(
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(10),
    ),
    elevation: 10,
    behavior: SnackBarBehavior.floating,
    content: Text(
      message,
      softWrap: true,
      textAlign: TextAlign.center,
      style: const TextStyle(
        color: Colors.white,
      ),
    ),
    backgroundColor: ColorConstants.snackBarBgColor,
  );
  ScaffoldMessenger.of(context).showSnackBar(snackBar);
}

class ShowErrorDialog extends StatelessWidget {
  final String message;

  ShowErrorDialog({Key? key, required this.message}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Row(
              mainAxisSize: MainAxisSize.max,
              children: <Widget>[
                Icon(
                  Icons.info_outline_rounded,
                  color: ColorConstants.red,
                ),
                Flexible(
                  child: Padding(
                    padding: const EdgeInsets.all(10),
                    child: Text(
                      message,
                      softWrap: true,
                      style: TextStyle(
                        color: ColorConstants.appColor,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            customOkayButton(context),
          ],
        ),
      ),
    );
  }
}
