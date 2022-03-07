import 'package:app/constants/config.dart';
import 'package:app/on_boarding/setup_complete_screeen.dart';
import 'package:app/screens/home_page.dart';
import 'package:app/services/app_service.dart';
import 'package:app/services/native_api.dart';
import 'package:app/utils/dialogs.dart';
import 'package:app/widgets/buttons.dart';
import 'package:flutter/material.dart';

import '../themes/light_theme.dart';

class LocationSetupScreen extends StatefulWidget {
  final bool enableBackButton;

  const LocationSetupScreen(this.enableBackButton, {Key? key})
      : super(key: key);

  @override
  LocationSetupScreenState createState() => LocationSetupScreenState();
}

class LocationSetupScreenState extends State<LocationSetupScreen> {
  DateTime? exitTime;
  final LocationService _locationService = LocationService();
  late AppService _appService;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: WillPopScope(
      onWillPop: onWillPop,
      child: Column(crossAxisAlignment: CrossAxisAlignment.center, children: [
        const Spacer(),
        onBoardingLocationIcon(),
        const SizedBox(
          height: 26,
        ),
        Padding(
          padding: const EdgeInsets.only(left: 57, right: 57),
          child: Text(
            'Enable locations',
            textAlign: TextAlign.center,
            style: CustomTextStyle.headline7(context),
          ),
        ),
        const SizedBox(
          height: 8,
        ),
        Padding(
          padding: const EdgeInsets.only(left: 45, right: 45),
          child: Text(
            'Allow AirQo to send you location air '
            'quality update for your work place, home',
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodyText1,
          ),
        ),
        const Spacer(),
        Padding(
          padding: const EdgeInsets.only(left: 24, right: 24),
          child: GestureDetector(
            onTap: () {
              _locationService
                  .allowLocationAccess()
                  .then((value) => {
                        Navigator.pushAndRemoveUntil(context,
                            MaterialPageRoute(builder: (context) {
                          return SetUpCompleteScreen(widget.enableBackButton);
                        }), (r) => false)
                      })
                  .whenComplete(() => {
                        Navigator.pushAndRemoveUntil(context,
                            MaterialPageRoute(builder: (context) {
                          return SetUpCompleteScreen(widget.enableBackButton);
                        }), (r) => false)
                      });
            },
            child: nextButton('Yes, keep me safe', Config.appColorBlue),
          ),
        ),
        const SizedBox(
          height: 16,
        ),
        GestureDetector(
          onTap: () {
            Navigator.pushAndRemoveUntil(context,
                MaterialPageRoute(builder: (context) {
              return SetUpCompleteScreen(widget.enableBackButton);
            }), (r) => false);
          },
          child: Text(
            'No, thanks',
            textAlign: TextAlign.center,
            style: Theme.of(context)
                .textTheme
                .caption
                ?.copyWith(color: Config.appColorBlue),
          ),
        ),
        const SizedBox(
          height: 40,
        ),
      ]),
    ));
  }

  @override
  void initState() {
    super.initState();
    _appService = AppService(context);
    updateOnBoardingPage();
  }

  Future<bool> onWillPop() {
    var now = DateTime.now();

    if (exitTime == null ||
        now.difference(exitTime!) > const Duration(seconds: 2)) {
      exitTime = now;

      showSnackBar(context, 'Tap again to exit !');
      return Future.value(false);
    }
    // if (widget.enableBackButton) {
    //   Navigator.pushAndRemoveUntil(context,
    //       MaterialPageRoute(builder: (context) {
    //     return const HomePage();
    //   }), (r) => false);
    // }

    Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (context) {
      return const HomePage();
    }), (r) => false);

    return Future.value(false);
  }

  void updateOnBoardingPage() async {
    await _appService.preferencesHelper.updateOnBoardingPage('location');
  }
}
