import 'package:app/constants/app_constants.dart';
import 'package:app/models/measurement.dart';
import 'package:app/screens/search_page.dart';
import 'package:app/services/local_storage.dart';
import 'package:app/widgets/custom_shimmer.dart';
import 'package:app/widgets/favourite_place_card.dart';
import 'package:flutter/material.dart';

class AnalyticsView extends StatefulWidget {
  const AnalyticsView({Key? key}) : super(key: key);

  @override
  _AnalyticsViewState createState() => _AnalyticsViewState();
}

class _AnalyticsViewState extends State<AnalyticsView> {
  var favouritePlaces = <Measurement>[];

  @override
  Widget build(BuildContext context) {
    return Container(
        color: ColorConstants.appBodyColor,
        child: FutureBuilder(
            future: DBHelper().getLatestMeasurements(),
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                favouritePlaces = snapshot.data as List<Measurement>;

                if (favouritePlaces.isEmpty) {
                  return Center(
                    child: Container(
                      padding: const EdgeInsets.all(16.0),
                      child: OutlinedButton(
                        onPressed: () async {
                          await Navigator.push(context,
                              MaterialPageRoute(builder: (context) {
                            return const SearchPage();
                          }));
                        },
                        style: OutlinedButton.styleFrom(
                          shape: const CircleBorder(),
                          padding: const EdgeInsets.all(24),
                        ),
                        child: Text(
                          'Add',
                          style: TextStyle(color: ColorConstants.appColor),
                        ),
                      ),
                    ),
                  );
                }

                return RefreshIndicator(
                  color: ColorConstants.appColor,
                  onRefresh: refreshData,
                  child: ListView.builder(
                    itemBuilder: (context, index) =>
                        MiniAnalyticsCard(favouritePlaces[index]),
                    itemCount: favouritePlaces.length,
                  ),
                );
              } else {
                return ListView(
                  children: [
                    const SizedBox(
                      height: 10,
                    ),
                    loadingAnimation(120.0, 16.0),
                    const SizedBox(
                      height: 15,
                    ),
                    loadingAnimation(120.0, 16.0),
                    const SizedBox(
                      height: 15,
                    ),
                    loadingAnimation(120.0, 16.0),
                    const SizedBox(
                      height: 15,
                    ),
                    loadingAnimation(120.0, 16.0),
                  ],
                );
              }
            }));
  }

  Future<void> refreshData() async {
    await DBHelper().getLatestMeasurements().then((value) => {
          if (mounted)
            {
              setState(() {
                favouritePlaces = value;
              })
            }
        });
  }
}
