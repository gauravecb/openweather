sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"com/demo/model/formatter"
], function(Controller, JSONModel, formatter) {
	"use strict";

	return Controller.extend("com.demo.controller.Main", {
		formatter: formatter,
		onInit: function() {
			this._loadForecast("Pune");
			this._loadWeather("Pune");

			var oModel = new JSONModel(jQuery.sap.getModulePath("com.demo", "/model/Cities.json"));
			this.getView().setModel(oModel, "city");

			this.byId("productInput").setFilterFunction(function(sTerm, oItem) {
				// A case-insensitive 'string contains' style filter
				return oItem.getText().match(new RegExp(sTerm, "i"));
			});

			var datestart = "2018-08-01 00:00:00";
			var dateend = "2018-08-01 12:00:00";
			var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
			oVizFrame.setVizProperties({
				plotArea: {
					window: {
						start: datestart,
						end: dateend
					},
					referenceLine: {
						line: {
							primaryValues: [{
								value: 20
							}]
						}
					},
					secondaryScale: {
						fixedRange: true,
						maxValue: 20,
						minValue: 50
					},
					dataLabel: {
						//formatString:formatPattern.SHORTFLOAT_MFD2,
						visible: true
					}
				},
				valueAxis: {
					label: {
						//formatString: formatPattern.SHORTFLOAT
					},
					title: {
						visible: false
					}
				},
				categoryAxis: {
					title: {
						visible: false
					}
				},
				title: {
					visible: false,
					text: 'Revenue by City and Store Name'
				}
			});

			var oPopOver = this.getView().byId("idPopOver");
			oPopOver.connect(oVizFrame.getVizUid());
			//  oPopOver.setFormatString(formatPattern.STANDARDFLOAT);

		},

		_formatDate: function(date) {
			var d = new Date(date),
				month = '' + (d.getMonth() + 1),
				day = '' + d.getDate(),
				year = d.getFullYear();

			if (month.length < 2) {
				month = '0' + month;
			}
			if (day.length < 2) {
				day = '0' + day;
			}
			return [year, month, day].join('-');
		},

		_mapResults: function(results) {
			var oModel = this.getView().getModel();
			oModel.setProperty("/city", results.city.name);
			oModel.setProperty("/country", results.city.country);

			var aForecastResults = [];
			for (var i = 0; i < results.list.length; i++) {
				var oTemp = results.list[i].main.temp;
				var date = this._formatDate(results.list[i].dt * 1000);
				aForecastResults.push({
					date: date,
					temp: oTemp,
					units: "Celsius",
					humidity: results.list[i].main.humidity,
					dt: results.list[i].dt_txt
				});
			}

			oModel.setProperty("/items", aForecastResults);
		},

		_loadForecast: function(city) {
			var oView = this.getView();
			var oParams = {
				q: city, // Get the weather in london
				units: "metric",
				APPID: "5134304b65fe4770c606d3f7ff146c54", // replace with your API key
				cnt: 16, // get weather for the next 16 days
				mode: "json" // get it in JSON format 
			};
			//var sUrl = "/OpenWeather/data/2.5/weather"; // Weather
			var sUrl = "/OpenWeather/data/2.5/forecast"; // Forcast
			oView.setBusy(true);

			var self = this;

			$.get(sUrl, oParams)
				.done(function(results) {
					oView.setBusy(false);
					self._mapResults(results);
				})
				.fail(function(err) {
					oView.setBusy(false);
					if (err !== undefined) {
						var oErrorResponse = $.parseJSON(err.responseText);
						sap.m.MessageToast.show(oErrorResponse.message, {
							duration: 6000
						});
					} else {
						sap.m.MessageToast.show("Unknown error!");
					}
				});
		},
		_loadWeather: function(city) {
			var oView = this.getView();
			var oParams = {
				q: city, // Get the weather in london
				units: "metric",
				APPID: "5134304b65fe4770c606d3f7ff146c54", // replace with your API key
				cnt: 16, // get weather for the next 16 days
				mode: "json" // get it in JSON format 
			};
			var sUrl = "/OpenWeather/data/2.5/weather"; // Weather
			//var sUrl = "/OpenWeather/data/2.5/forecast"; // Forcast
			oView.setBusy(true);

			var self = this;

			$.get(sUrl, oParams)
				.done(function(results) {
					oView.setBusy(false);
					var oModel = new JSONModel();
					oModel.setData(results);
					oView.setModel(oModel, "weatherData");

				})
				.fail(function(err) {
					oView.setBusy(false);
					if (err !== undefined) {
						var oErrorResponse = $.parseJSON(err.responseText);
						sap.m.MessageToast.show(oErrorResponse.message, {
							duration: 6000
						});
					} else {
						sap.m.MessageToast.show("Unknown error!");
					}
				});
		},
		onSelectionChange: function(oEvent) {
			console.log(oEvent);
		},
		onSubmit: function(oEvent) {
			var sCity = this.getView().byId("productInput").getValue();
			this._loadForecast(sCity);
			this._loadWeather(sCity);
		}

	});

});