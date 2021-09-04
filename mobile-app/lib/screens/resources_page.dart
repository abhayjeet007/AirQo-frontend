import 'dart:io';

import 'package:app/constants/app_constants.dart';
import 'package:app/utils/dialogs.dart';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class ResourcesPage extends StatefulWidget {
  @override
  _ResourcesPageState createState() => _ResourcesPageState();
}

class _ResourcesPageState extends State<ResourcesPage> {
  bool isLoading = true;
  int loadingValue = 0;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: <Widget>[
        WebView(
          onProgress: (value) {
            setState(() {
              if (value > 15) {
                setState(() {
                  isLoading = false;
                });
              }
              loadingValue = value;
            });
          },
          onPageFinished: (finish) {
            setState(() {
              isLoading = false;
            });
          },
          onWebResourceError: webResourceErrorHandler,
          javascriptMode: JavascriptMode.unrestricted,
          initialUrl: Links().airqoBlog,
        ),
        isLoading
            ? Center(
                child: CircularProgressIndicator(
                  color: ColorConstants().appColor,
                ),
              )
            : Stack(),
      ],
    );
  }

  @override
  void initState() {
    if (Platform.isAndroid) WebView.platform = SurfaceAndroidWebView();
    super.initState();
  }

  void webResourceErrorHandler(error) {
    showDialog<void>(
      context: context,
      builder: (_) => ShowErrorDialog(
          message: 'Oops! Something went wrong, try again later'),
    );
  }
}
