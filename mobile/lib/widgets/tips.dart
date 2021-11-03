import 'package:app/constants/app_constants.dart';
import 'package:app/utils/pm.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

List<Widget> createTips(double value) {
  var tips = [];

  var tipsWidgets = <Widget>[];

  for (var tip in tips) {
    tipsWidgets
      ..add(
        TipCard(tip.header, tip.body),
      )
      ..add(const SizedBox(
        height: 8,
      ));
  }
  return tipsWidgets;
}

Widget recommendationContainer(Recommendation recommendation, context) {
  return Container(
      width: 304,
      height: 128,
      padding: const EdgeInsets.all(8.0),
      decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.all(Radius.circular(8.0))),
      child: Row(
        children: [
          Container(
            constraints: const BoxConstraints(
              maxWidth: 83,
              maxHeight: 112,
              minWidth: 83,
              minHeight: 112,
            ),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8.0),
              image: DecorationImage(
                fit: BoxFit.cover,
                image: AssetImage(
                  recommendation.imageUrl,
                ),
              ),
            ),
          ),
          const SizedBox(
            width: 12,
          ),
          Expanded(
              child: Container(
            constraints: const BoxConstraints(
              maxWidth: 189,
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  recommendation.title,
                  maxLines: 4,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                      color: ColorConstants.appColorBlack,
                      fontWeight: FontWeight.bold,
                      fontSize: 16),
                ),
                const SizedBox(
                  height: 4,
                ),
                Text(
                  recommendation.body,
                  maxLines: 4,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                      color: ColorConstants.appColorBlack.withOpacity(0.5),
                      fontSize: 14),
                )
              ],
            ),
          )),
          const SizedBox(
            width: 12,
          ),
        ],
      ));
}

Widget recommendationContainerV1(Recommendation recommendation, context) {
  return Container(
      width: 304,
      height: 128,
      decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.all(Radius.circular(8.0))),
      child: Center(
        child: ListTile(
          contentPadding: const EdgeInsets.all(8.0),
          leading: Container(
            width: 83,
            height: MediaQuery.of(context).size.height,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8.0),
              image: DecorationImage(
                fit: BoxFit.fill,
                image: AssetImage(
                  recommendation.imageUrl,
                ),
              ),
            ),
          ),
          title: Text(
            recommendation.title,
            maxLines: 4,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
                color: ColorConstants.appColorBlack,
                fontWeight: FontWeight.bold,
                fontSize: 16),
          ),
          subtitle: Text(
            recommendation.body,
            maxLines: 4,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
                color: ColorConstants.appColorBlack.withOpacity(0.5),
                fontSize: 14),
          ),
        ),
      ));
}

class TipCard extends StatelessWidget {
  final String header;
  final String body;

  const TipCard(this.header, this.body, {Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var screenWidth = MediaQuery.of(context).size.width;

    return Container(
      decoration: const BoxDecoration(
          color: Colors.white,
          shape: BoxShape.rectangle,
          borderRadius: BorderRadius.all(Radius.circular(10.0))),
      padding: const EdgeInsets.all(8.0),
      child: Row(
        // crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(2.0),
            decoration: BoxDecoration(
                color: ColorConstants.appTipColor,
                shape: BoxShape.rectangle,
                borderRadius: const BorderRadius.all(Radius.circular(10.0))),
            child: IconButton(
              iconSize: 30,
              icon: Icon(
                Icons.bookmark_outline,
                color: ColorConstants.appTipColor,
              ),
              onPressed: () async {},
            ),
          ),
          SizedBox(
              width: screenWidth * 0.70,
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      header,
                      overflow: TextOverflow.ellipsis,
                      maxLines: 2,
                      style: const TextStyle(
                          fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                    Text(
                      body,
                      overflow: TextOverflow.ellipsis,
                      maxLines: 2,
                      style: const TextStyle(fontSize: 12),
                    ),
                  ],
                ),
              )),
        ],
      ),
    );
  }
}

// class TipCard extends StatefulWidget {
//   const TipCard({Key? key}) : super(key: key);
//
//   @override
//   _TipCardState createState() => _TipCardState();
// }
//
// class _TipCardState extends State<TipCard> {
//   @override
//   Widget build(BuildContext context) {
//     double screenWidth = MediaQuery.of(context).size.width;
//
//     return Container(
//       decoration: BoxDecoration(
//           color: Colors.white,
//           shape: BoxShape.rectangle,
//           borderRadius: const BorderRadius.all(Radius.circular(10.0))),
//       padding: const EdgeInsets.all(8.0),
//       child: Row(
//         // crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           Container(
//             padding: const EdgeInsets.all(2.0),
//             decoration: BoxDecoration(
//                 color: ColorConstants.appTipColor,
//                 shape: BoxShape.rectangle,
//                 borderRadius: const BorderRadius.all(Radius.circular(10.0))),
//             child: IconButton(
//               iconSize: 30,
//               icon: Icon(
//                 Icons.bookmark_outline,
//                 color: ColorConstants.appTipColor,
//               ),
//               onPressed: () async {},
//             ),
//           ),
//           SizedBox(
//               width: screenWidth * 0.70,
//               child: Padding(
//                 padding: EdgeInsets.all(8.0),
//                 child: Column(
//                   mainAxisAlignment: MainAxisAlignment.spaceEvenly,
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: [
//                     Text(
//                       'Outdoor activities',
//                       overflow: TextOverflow.ellipsis,
//                       maxLines: 2,
//                       style:
//                           TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
//                     ),
//                     Text(
//                       'A run is still ok, 30 minutes is good!',
//                       overflow: TextOverflow.ellipsis,
//                       maxLines: 2,
//                       style: TextStyle(fontSize: 12),
//                     ),
//                   ],
//                 ),
//               )),
//         ],
//       ),
//     );
//   }
// }
