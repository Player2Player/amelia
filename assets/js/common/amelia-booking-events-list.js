wpJsonpAmeliaBookingPlugin([20], {
  1313: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = o(0),
      i = o.n(a),
      n = o(699),
      s = o(687),
      r = o(714),
      l = o(337),
      c = o(689),
      m = o(759),
      d = o.n(m),
      p = o(712),
      u = o(716),
      h = o(715),
      f = o(686),
      g = o(786),
      b = o.n(g),
      v = o(694),
      y = o(711);
    t.default = {
      name: "eventListForm",
      mixins: [n.a, u.a, y.a, s.a, l.a, c.a, p.a, h.a, f.a, v.a, r.a],
      data: function () {
        return {
          tags: [],
          pagination: {
            show: this.$root.settings.general.itemsPerPage,
            page: 1,
            count: 0,
          },
          params: {
            tag: null,
            date:
              "ameliaBooking" in window &&
              "pastEventsDays" in window.ameliaBooking
                ? i()()
                    .subtract(window.ameliaBooking.pastEventsDays, "days")
                    .toDate()
                : new Date(),
            page: 1,
          },
          options: { entities: { tags: [], locations: [] } },
          fetched: !1,
          fetchedFiltered: !1,
          events: [],
          appointment: {
            bookings: [
              {
                customer: {
                  email: "",
                  externalId: null,
                  firstName: "",
                  id: null,
                  lastName: "",
                  phone: "",
                },
                customFields: {},
                customerId: 0,
                extras: [],
                persons: 1,
              },
            ],
            payment: { amount: 0, gateway: "", data: {} },
          },
          forms: {},
          eventInfoLabels: {},
          eventFilterLabels: {},
          timeZoneString: this.$root.settings.general.showClientTimeZone
            ? Intl.DateTimeFormat().resolvedOptions().timeZone
            : this.$root.settings.wordpress.timezone,
        };
      },
      created: function () {
        (this.forms = this.getTranslatedForms("eventListForm")),
          (this.eventInfoLabels = this.$root.settings.customization.forms
            ? this.forms.eventListForm.eventDetailsForm.itemsStatic
                .eventDetailsFormField.labels
            : this.defaultFormsData.eventListForm.eventDetailsForm.itemsStatic
                .eventDetailsFormField.labels),
          (this.eventFilterLabels = this.$root.settings.customization.forms
            ? this.forms.eventListForm.eventFilterForm.itemsStatic
                .eventFilterFormField.labels
            : this.defaultFormsData.eventListForm.eventFilterForm.itemsStatic
                .eventFilterFormField.labels),
          this.setCacheData(this.getContainerId(), !0),
          this.cacheData &&
            this.cacheData.request.queryParams &&
            ((this.pagination.page = this.cacheData.request.queryParams.page),
            (this.params.page = this.cacheData.request.queryParams.page),
            (this.params.date = new Date(
              this.cacheData.request.queryParams.dates[0]
            )),
            this.cacheData.request.queryParams.tag &&
              (this.params.tag = this.cacheData.request.queryParams.tag));
      },
      mounted: function () {
        this.getEntities(this.processListEntities),
          this.$root.shortcodeData.hasEventShortcode || this.inlineBookingSVG();
        var e =
          this.$root.shortcodeData.booking.eventId &&
          0 === this.$root.shortcodeData.booking.eventRecurring;
        this.getEvents(e);
      },
      methods: {
        runCacheAction: function () {
          var e = this;
          if (this.loadingCacheBookingData) {
            if (
              "canceled" === this.cacheData.status ||
              "failed" === this.cacheData.status
            )
              (this.events.find(function (t) {
                return t.id === e.cacheData.request.bookable.id;
              }).showEventBooking = !0),
                setTimeout(function () {
                  e.cacheData = null;
                }, 500);
            else
              ("paid" !== this.cacheData.status &&
                null !== this.cacheData.status) ||
                this.confirmedBooking(this.cacheData.response, !0);
            this.loadingCacheBookingData = !1;
          }
        },
        getContainerId: function () {
          return "amelia-app-booking" + this.$root.shortcodeData.counter;
        },
        useGlobalCustomization: function () {
          return (
            "ameliaBooking" in window &&
            "useGlobalCustomization" in window.ameliaBooking &&
            !0 === window.ameliaBooking.useGlobalCustomization
          );
        },
        getImages: function (e, t) {
          for (var o = 0; o < t; o++) e.push(e.shift());
          return e;
        },
        setPlaces: function (e) {
          this.appointment.bookings[0].persons = e;
        },
        getBookableColor: function (e, t) {
          return t
            ? {
                color: "#ffffff",
                "background-color": e.color,
                "border-color": "#ffffff",
              }
            : { color: e.color, "background-color": "", "border-color": "" };
        },
        getEventDatesAndTimes: function (e) {
          var t = this,
            o = [];
          return (
            this.getImplodedPeriods(e).forEach(function (e) {
              var a = e.periodStart.split(" "),
                i = e.periodEnd.split(" ");
              e.isConnected
                ? o.push(
                    t.getFrontedFormattedDateTime(a) +
                      " - " +
                      t.getFrontedFormattedDateTime(i)
                  )
                : a[0] === i[0]
                ? o.push(
                    t.getFrontedFormattedDate(a[0]) +
                      " " +
                      t.getFrontedFormattedTime(a[1]) +
                      " - " +
                      t.getFrontedFormattedTime(i[1])
                  )
                : o.push(
                    t.getFrontedFormattedDate(a[0]) +
                      " - " +
                      t.getFrontedFormattedDate(i[0]) +
                      " " +
                      t.getFrontedFormattedTime(a[1]) +
                      " - " +
                      t.getFrontedFormattedTime(i[1])
                  );
            }),
            o.join(", ")
          );
        },
        showTags: function () {
          return this.options.entities.tags.length > 1 && this.showDatePicker();
        },
        showDatePicker: function () {
          return (
            null === this.getPreselectedEventId() ||
            (null !== this.getPreselectedEventId() &&
              this.getPreselectedEventRecurring())
          );
        },
        getColumnLength: function () {
          return this.showTags() && this.showDatePicker()
            ? [12, 12]
            : this.showTags() && !this.showDatePicker()
            ? [24, 0]
            : !this.showTags() && this.showDatePicker()
            ? [0, 24]
            : (this.showTags() || this.showDatePicker(), [12, 12]);
        },
        getEventAvailability: function (e) {
          return "approved" === e.status || "pending" === e.status
            ? e.full
              ? {
                  label:
                    this.eventInfoLabels.full.value || this.$root.labels.full,
                  class: "full",
                }
              : e.upcoming
              ? {
                  label:
                    this.eventInfoLabels.upcoming.value ||
                    this.$root.labels.upcoming,
                  class: "upcoming",
                }
              : e.bookable
              ? {
                  label:
                    this.eventInfoLabels.open.value || this.$root.labels.open,
                  class: "open",
                }
              : {
                  label:
                    this.eventInfoLabels.closed.value ||
                    this.$root.labels.closed,
                  class: "closed",
                }
            : {
                label:
                  this.eventInfoLabels.canceled.value ||
                  this.$root.labels.canceled,
                class: "canceled",
              };
        },
        isEventInSameDay: function (e) {
          var t = !0;
          if (1 === e.periods.length)
            t =
              e.periods[0].periodStart.split(" ")[0] ===
              e.periods[0].periodEnd.split(" ")[0];
          else {
            var o = e.periods[0].periodStart.split(" ")[0],
              a = e.periods[0].periodEnd.split(" ")[0];
            e.periods.forEach(function (e) {
              (e.periodStart.split(" ")[0] === o &&
                e.periodEnd.split(" ")[0] === a) ||
                (t = !1);
            });
          }
          return t;
        },
        confirmedBooking: function (e, t) {
          var o = this.events.find(function (t) {
            return t.id === e.event.id;
          });
          (o.places = o.places - this.appointment.bookings[0].persons),
            o.places <= 0 && (o.full = !0),
            (o.addToCalendarData = this.getEventAddToCalendarData(e, t)),
            "beforeConfirmedBooking" in window
              ? window.beforeConfirmedBooking(o.addToCalendarData)
              : ((o.showEventBooking = !1),
                (o.showAddToCalendar = !0),
                (o.bookingCompleted = !0));
        },
        getSearchParams: function () {
          var e = JSON.parse(JSON.stringify(this.params)),
            t = this.getPreselectedEventId(),
            o = this.getPreselectedEventRecurring(),
            a = this.getPreselectedTag() ? this.getPreselectedTag() : e.tag;
          return (
            a || (a = null),
            {
              dates: e.date
                ? [this.getDateString(e.date)]
                : [this.getDateString(this.getNowDate())],
              tag: a,
              page: this.pagination.page,
              id: t,
              recurring: o,
            }
          );
        },
        getBookableData: function (e) {
          return {
            id: e.id,
            name: e.name,
            price: e.price,
            depositData:
              "disabled" !== e.depositPayment
                ? {
                    deposit: e.deposit,
                    depositPayment: e.depositPayment,
                    depositPerPerson: e.depositPerPerson,
                  }
                : null,
            maxCapacity: e.maxCapacity,
            color: e.color,
            aggregatedPrice: !0,
            bookingStart: e.periods[0].periodStart,
            bookingStartTime: e.periods[0].periodStart.split(" ")[1],
          };
        },
        getEvents: function (e) {
          var t = this;
          this.$http
            .get(this.$root.getAjaxUrl + "/events", {
              params: this.getSearchParams(),
            })
            .then(function (o) {
              var a = t;
              (t.events = []),
                (t.pagination.count = o.data.data.count),
                o.data.data.events.forEach(function (t) {
                  (t.gallery = t.gallery.sort(function (e, t) {
                    return e.position > t.position ? 1 : -1;
                  })),
                    (t.showEventDetails = e || 1 === o.data.data.events.length),
                    (t.showEventBooking = !1),
                    (t.showAddToCalendar = !1),
                    (t.bookingCompleted = !1),
                    a.$root.useTranslations &&
                      ((t.name = a.getNameTranslated(t)),
                      (t.description = a.getDescriptionTranslated(t))),
                    a.events.push(t),
                    a.$root.settings.general.showClientTimeZone &&
                      t.periods.forEach(function (e) {
                        var t = i()(e.periodStart, "YYYY-MM-DD HH:mm:ss")
                            .toDate()
                            .getTimezoneOffset(),
                          o = i()(e.periodEnd, "YYYY-MM-DD HH:mm:ss")
                            .toDate()
                            .getTimezoneOffset();
                        (e.periodStart =
                          t > 0
                            ? i.a
                                .utc(e.periodStart, "YYYY-MM-DD HH:mm:ss")
                                .subtract(t, "minutes")
                                .format("YYYY-MM-DD HH:mm:ss")
                            : i.a
                                .utc(e.periodStart, "YYYY-MM-DD HH:mm:ss")
                                .add(-1 * t, "minutes")
                                .format("YYYY-MM-DD HH:mm:ss")),
                          (e.periodEnd =
                            o > 0
                              ? i.a
                                  .utc(e.periodEnd, "YYYY-MM-DD HH:mm:ss")
                                  .subtract(o, "minutes")
                                  .format("YYYY-MM-DD HH:mm:ss")
                              : i.a
                                  .utc(e.periodEnd, "YYYY-MM-DD HH:mm:ss")
                                  .add(-1 * o, "minutes")
                                  .format("YYYY-MM-DD HH:mm:ss"));
                      });
                }),
                t.runCacheAction(),
                (t.fetched = !0),
                (t.fetchedFiltered = !0);
            })
            .catch(function (e) {
              console.log(e.message);
            });
        },
        toggleEventDetails: function (e) {
          this.scrollView("am-event-" + e.id, "start"),
            (e.showEventDetails = !e.showEventDetails),
            this.events.forEach(function (t) {
              t.id !== e.id &&
                ((t.showEventDetails = !1),
                (t.showEventBooking = !1),
                (t.showAddToCalendar = !1),
                (t.showConfirmBooking = !1));
            }),
            (e.showEventBooking = !1),
            event.bookingCompleted &&
              (event.showAddToCalendar = e.showEventDetails),
            (this.appointment.bookings[0].persons = 1),
            this.updateSettings(e.settings);
        },
        toggleEventBooking: function (e) {
          (e.showEventDetails = !e.showEventDetails),
            (e.showEventBooking = !e.showEventBooking);
        },
        // P2P: Display location and custom location
        getLocation: function (e) {
          let location = '';
          if (e.locationId && this.options.entities.locations.length) {
            var t = this.options.entities.locations.find(function (t) {
              return t.id === e.locationId;
            });
            location = t ? t.name : "";
          }
          if (e.customLocation) {
            location = `${location} ${e.customLocation}`;
          }
          return location.trim();
        },
        inlineBookingSVG: function () {
          o(693).init({
            svgSelector: "img.svg-booking",
            initClass: "js-inlinesvg",
          });
        },
      },
      computed: {},
      watch: {
        "pagination.page": function () {
          this.cacheData && this.cacheData.request.queryParams
            ? (this.cacheData.request.queryParams = null)
            : this.getEvents(!1);
        },
      },
      components: { ConfirmBooking: d.a, AddToCalendar: b.a },
    };
  },
  1314: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          o = e._self._c || t;
        return o("div", { staticClass: "am-wrap" }, [
          o(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: !e.fetched,
                  expression: "!fetched",
                },
              ],
              staticClass: "am-spinner am-section",
            },
            [
              o("img", {
                staticClass: "svg-booking am-spin",
                attrs: { src: e.$root.getUrl + "public/img/oval-spinner.svg" },
              }),
              e._v(" "),
              o("img", {
                staticClass: "svg-booking am-hourglass",
                attrs: { src: e.$root.getUrl + "public/img/hourglass.svg" },
              }),
            ]
          ),
          e._v(" "),
          o(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: e.fetched,
                  expression: "fetched",
                },
              ],
              attrs: { id: "am-events-booking" },
            },
            [
              o(
                "div",
                { staticClass: "am-events-filter" },
                [
                  o(
                    "el-row",
                    { attrs: { gutter: 24 } },
                    [
                      o(
                        "el-col",
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value: e.showTags(),
                              expression: "showTags()",
                            },
                          ],
                          class: e.$root.settings.customization.forms
                            ? "el-form-item am-select-" + e.$options.name
                            : "",
                          attrs: { sm: e.getColumnLength()[0] },
                        },
                        [
                          o(
                            "el-select",
                            {
                              attrs: {
                                placeholder:
                                  e.eventFilterLabels.event_type.value ||
                                  e.$root.labels.event_type,
                                "popper-class": e.$root.settings.customization
                                  .forms
                                  ? "am-dropdown-" + e.$options.name
                                  : "",
                                clearable: "",
                                value: "",
                              },
                              on: {
                                change: function (t) {
                                  return e.getEvents(!1);
                                },
                              },
                              model: {
                                value: e.params.tag,
                                callback: function (t) {
                                  e.$set(e.params, "tag", t);
                                },
                                expression: "params.tag",
                              },
                            },
                            e._l(
                              e.options.entities.tags.map(function (e) {
                                return e.name;
                              }),
                              function (e, t) {
                                return o("el-option", {
                                  key: t,
                                  attrs: { label: e, value: e },
                                });
                              }
                            ),
                            1
                          ),
                        ],
                        1
                      ),
                      e._v(" "),
                      o(
                        "el-col",
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value: e.showDatePicker(),
                              expression: "showDatePicker()",
                            },
                          ],
                          staticClass: "v-calendar-column",
                          class: e.$root.settings.customization.forms
                            ? "am-calendar-" + e.$options.name
                            : "",
                          attrs: { sm: e.getColumnLength()[1] },
                        },
                        [
                          o("v-date-picker", {
                            staticClass: "am-calendar-picker",
                            attrs: {
                              "input-props": {
                                class: "el-input__inner",
                                placeholder:
                                  this.$root.labels.event_pick_min_date,
                                readonly: !0,
                              },
                              "popover-visibility": "focus",
                              "popover-direction": "bottom",
                              "popover-align": "center",
                              mode: "single",
                              id: "am-calendar-picker",
                              "tint-color": "#1A84EE",
                              "show-day-popover": !1,
                              "is-expanded": !1,
                              "is-inline": !1,
                              "is-required": !0,
                              formats: e.vCalendarFormats,
                            },
                            on: {
                              input: function (t) {
                                return e.getEvents(!1);
                              },
                            },
                            model: {
                              value: e.params.date,
                              callback: function (t) {
                                e.$set(e.params, "date", t);
                              },
                              expression: "params.date",
                            },
                          }),
                        ],
                        1
                      ),
                    ],
                    1
                  ),
                ],
                1
              ),
              e._v(" "),
              o(
                "div",
                {
                  staticClass: "am-event-list",
                  style: {
                    opacity: e.fetchedFiltered ? 1 : "0.3",
                    "pointer-events": e.fetchedFiltered ? "all" : "none",
                  },
                },
                e._l(e.events, function (t, a) {
                  return t.show
                    ? o(
                        "div",
                        {
                          key: a,
                          staticClass: "am-event",
                          class: [
                            {
                              "am-active": t.showEventDetails,
                              inactive:
                                e.events.filter(function (e) {
                                  return (
                                    (e.showEventDetails ||
                                      e.showEventBooking ||
                                      e.showAddToCalendar) &&
                                    e.id !== t.id
                                  );
                                }).length > 0,
                              canceled:
                                "canceled" === e.getEventAvailability(t).class,
                              closed:
                                "closed" === e.getEventAvailability(t).class &&
                                !t.showAddToCalendar,
                              full: "full" === e.getEventAvailability(t).class,
                              upcoming:
                                "upcoming" === e.getEventAvailability(t).class,
                            },
                            e.$root.settings.customization.forms
                              ? "am-form-" + e.$options.name
                              : "",
                          ],
                          style: {
                            "pointer-events": t.showAddToCalendar
                              ? "all"
                              : "open" !== e.getEventAvailability(t).class
                              ? "none"
                              : "all",
                          },
                          attrs: { id: "am-event-" + t.id },
                        },
                        [
                          o(
                            "div",
                            {
                              staticClass: "am-event-data",
                              on: {
                                click: function (o) {
                                  "open" !== e.getEventAvailability(t).class ||
                                    e.toggleEventDetails(t);
                                },
                              },
                            },
                            [
                              e.isEventInSameDay(t)
                                ? o("div", { staticClass: "am-event-date" }, [
                                    o(
                                      "div",
                                      {
                                        staticClass: "am-event-date-month",
                                        style: e.getBookableColor(t, !1),
                                      },
                                      [
                                        e._v(
                                          "\n              " +
                                            e._s(
                                              e
                                                .getEventFrontedFormattedDate(
                                                  t.periods[0].periodStart
                                                )
                                                .split(" ")[0]
                                            ) +
                                            "\n            "
                                        ),
                                      ]
                                    ),
                                    e._v(" "),
                                    o(
                                      "div",
                                      { staticClass: "am-event-date-day" },
                                      [
                                        e._v(
                                          "\n              " +
                                            e._s(
                                              e
                                                .getEventFrontedFormattedDate(
                                                  t.periods[0].periodStart
                                                )
                                                .split(" ")[1]
                                            ) +
                                            "\n            "
                                        ),
                                      ]
                                    ),
                                  ])
                                : o("div", { staticClass: "am-event-dates" }, [
                                    o("div", [
                                      o(
                                        "div",
                                        {
                                          staticClass: "am-event-date-month",
                                          style: e.getBookableColor(t, !1),
                                        },
                                        [
                                          e._v(
                                            "\n                " +
                                              e._s(
                                                e
                                                  .getEventFrontedFormattedDate(
                                                    t.periods[0].periodStart
                                                  )
                                                  .split(" ")[0]
                                              ) +
                                              "\n              "
                                          ),
                                        ]
                                      ),
                                      e._v(" "),
                                      o(
                                        "div",
                                        { staticClass: "am-event-date-day" },
                                        [
                                          e._v(
                                            "\n                " +
                                              e._s(
                                                e
                                                  .getEventFrontedFormattedDate(
                                                    t.periods[0].periodStart
                                                  )
                                                  .split(" ")[1]
                                              ) +
                                              "\n              "
                                          ),
                                        ]
                                      ),
                                    ]),
                                    e._v(" "),
                                    o("div", [
                                      o(
                                        "div",
                                        {
                                          staticClass: "am-event-date-month",
                                          style: e.getBookableColor(t, !1),
                                        },
                                        [
                                          e._v(
                                            "\n                " +
                                              e._s(
                                                e
                                                  .getEventFrontedFormattedDate(
                                                    t.periods[
                                                      t.periods.length - 1
                                                    ].periodEnd
                                                  )
                                                  .split(" ")[0]
                                              ) +
                                              "\n              "
                                          ),
                                        ]
                                      ),
                                      e._v(" "),
                                      o(
                                        "div",
                                        { staticClass: "am-event-date-day" },
                                        [
                                          e._v(
                                            "\n                " +
                                              e._s(
                                                e
                                                  .getEventFrontedFormattedDate(
                                                    t.periods[
                                                      t.periods.length - 1
                                                    ].periodEnd
                                                  )
                                                  .split(" ")[1]
                                              ) +
                                              "\n              "
                                          ),
                                        ]
                                      ),
                                    ]),
                                  ]),
                              e._v(" "),
                              o("div", { staticClass: "am-event-info" }, [
                                o("div", { staticClass: "am-event-title" }, [
                                  e._v(
                                    "\n              " +
                                      e._s(t.name) +
                                      "\n              "
                                  ),
                                  o(
                                    "span",
                                    {
                                      staticClass: "am-event-booking-status",
                                      class: e.getEventAvailability(t).class,
                                    },
                                    [
                                      e._v(
                                        "\n                " +
                                          e._s(
                                            e.getEventAvailability(t).label
                                          ) +
                                          "\n              "
                                      ),
                                    ]
                                  ),
                                ]),
                                e._v(" "),
                                o("div", { staticClass: "am-event-sub-info" }, [
                                  e.eventInfoLabels.event_capacity.visibility
                                    ? o(
                                        "div",
                                        {
                                          staticClass:
                                            "am-event-sub-info-capacity",
                                        },
                                        [
                                          o("img", {
                                            attrs: {
                                              src:
                                                e.$root.getUrl +
                                                "public/img/capacity.svg",
                                            },
                                          }),
                                          e._v(
                                            " " +
                                              e._s(
                                                e.eventInfoLabels.event_capacity
                                                  .value ||
                                                  e.$root.labels.event_capacity
                                              ) +
                                              " " +
                                              e._s(t.maxCapacity - t.places) +
                                              " / " +
                                              e._s(t.maxCapacity) +
                                              "\n              "
                                          ),
                                        ]
                                      )
                                    : e._e(),
                                  e._v(" "),
                                  e.getLocation(t) &&
                                  e.eventInfoLabels.location.visibility
                                    ? o("div", [
                                        o("img", {
                                          attrs: {
                                            src:
                                              e.$root.getUrl +
                                              "public/img/pin.svg",
                                          },
                                        }),
                                        e._v(
                                          " " +
                                            e._s(e.getLocation(t)) +
                                            "\n              "
                                        ),
                                      ])
                                    : e._e(),
                                  e._v(" "),
                                  e.eventInfoLabels.event_date.visibility
                                    ? o("div", [
                                        o("img", {
                                          attrs: {
                                            src:
                                              e.$root.getUrl +
                                              "public/img/clock.svg",
                                          },
                                        }),
                                        e._v(
                                          " " +
                                            e._s(
                                              e.getEventDatesAndTimes(t.periods)
                                            ) +
                                            "\n              "
                                        ),
                                      ])
                                    : e._e(),
                                  e._v(" "),
                                  e.eventInfoLabels.time_zone.visibility
                                    ? o("div", [
                                        e._v(
                                          "\n                " +
                                            e._s(e.timeZoneString) +
                                            "\n              "
                                        ),
                                      ])
                                    : e._e(),
                                ]),
                              ]),
                              e._v(" "),
                              0 !== t.price &&
                              e.eventInfoLabels.event_price.visibility
                                ? o(
                                    "div",
                                    {
                                      staticClass: "am-event-price",
                                      style: e.getBookableColor(t, !0),
                                    },
                                    [
                                      e._v(
                                        "\n            " +
                                          e._s(
                                            e.getFormattedPrice(
                                              t.price,
                                              !e.$root.settings.payments
                                                .hideCurrencySymbolFrontend
                                            )
                                          ) +
                                          "\n          "
                                      ),
                                    ]
                                  )
                                : e.eventInfoLabels.event_price.visibility
                                ? o(
                                    "div",
                                    {
                                      staticClass:
                                        "am-event-price am-event-free",
                                      style: e.getBookableColor(t, !1),
                                    },
                                    [
                                      e._v(
                                        "\n            " +
                                          e._s(
                                            e.eventInfoLabels.event_free
                                              .value ||
                                              e.$root.labels.event_free
                                          ) +
                                          "\n          "
                                      ),
                                    ]
                                  )
                                : e._e(),
                            ]
                          ),
                          e._v(" "),
                          o("transition", { attrs: { name: "fade" } }, [
                            o(
                              "div",
                              {
                                directives: [
                                  {
                                    name: "show",
                                    rawName: "v-show",
                                    value: t.showEventDetails,
                                    expression: "evt.showEventDetails",
                                  },
                                ],
                              },
                              [
                                (t.gallery && t.gallery.length) ||
                                (t.description && t.description.length)
                                  ? o(
                                      "div",
                                      { staticClass: "am-event-details" },
                                      [
                                        t.gallery && t.gallery.length
                                          ? o(
                                              "div",
                                              {
                                                staticClass: "am-event-photos",
                                              },
                                              e._l(t.gallery, function (a, i) {
                                                return o(
                                                  "div",
                                                  { key: a.id },
                                                  [
                                                    o(
                                                      "lightbox",
                                                      {
                                                        attrs: {
                                                          thumbnail:
                                                            a.pictureThumbPath,
                                                          images: e.getImages(
                                                            t.gallery.map(
                                                              function (e) {
                                                                return e.pictureFullPath;
                                                              }
                                                            ),
                                                            i
                                                          ),
                                                        },
                                                      },
                                                      [
                                                        o(
                                                          "lightbox-default-loader",
                                                          {
                                                            attrs: {
                                                              slot: "loader",
                                                            },
                                                            slot: "loader",
                                                          }
                                                        ),
                                                      ],
                                                      1
                                                    ),
                                                  ],
                                                  1
                                                );
                                              }),
                                              0
                                            )
                                          : e._e(),
                                        e._v(" "),
                                        t.description && t.description.length
                                          ? o(
                                              "div",
                                              { staticClass: "am-event-about" },
                                              [
                                                o("div", [
                                                  e._v(
                                                    e._s(
                                                      e.eventInfoLabels
                                                        .event_about.value ||
                                                        e.$root.labels
                                                          .event_about
                                                    )
                                                  ),
                                                ]),
                                                e._v(" "),
                                                o("div", {
                                                  domProps: {
                                                    innerHTML: e._s(
                                                      t.description
                                                    ),
                                                  },
                                                }),
                                              ]
                                            )
                                          : e._e(),
                                      ]
                                    )
                                  : e._e(),
                                e._v(" "),
                                "open" === e.getEventAvailability(t).class
                                  ? o(
                                      "div",
                                      {
                                        staticClass: "am-event-book-cta",
                                        class: e.getEventAvailability(t).class,
                                      },
                                      [
                                        e.eventInfoLabels.event_book.visibility
                                          ? o(
                                              "div",
                                              {
                                                staticClass:
                                                  "am-event-book-cta__inner",
                                              },
                                              [
                                                o("span", [
                                                  e._v(
                                                    "\n                  " +
                                                      e._s(
                                                        e.eventInfoLabels
                                                          .event_book.value ||
                                                          e.$root.labels
                                                            .event_book
                                                      ) +
                                                      "\n                "
                                                  ),
                                                ]),
                                              ]
                                            )
                                          : e._e(),
                                        e._v(" "),
                                        o(
                                          "div",
                                          [
                                            o(
                                              "el-form",
                                              [
                                                t.bringingAnyone
                                                  ? o(
                                                      "el-form-item",
                                                      {
                                                        class: e.$root.settings
                                                          .customization.forms
                                                          ? "am-input-number-" +
                                                            e.$options.name
                                                          : "",
                                                      },
                                                      [
                                                        o(
                                                          "template",
                                                          { slot: "label" },
                                                          [
                                                            o(
                                                              "span",
                                                              {
                                                                style: {
                                                                  fontWeight: 700,
                                                                  color:
                                                                    e.forms
                                                                      .eventListForm
                                                                      .globalSettings
                                                                      .formTextColor,
                                                                },
                                                              },
                                                              [
                                                                e._v(
                                                                  "\n                        " +
                                                                    e._s(
                                                                      e
                                                                        .eventInfoLabels
                                                                        .event_book_persons
                                                                        .value ||
                                                                        e.$root
                                                                          .labels
                                                                          .event_book_persons
                                                                    ) +
                                                                    "\n                      "
                                                                ),
                                                              ]
                                                            ),
                                                          ]
                                                        ),
                                                        e._v(" "),
                                                        o("el-input-number", {
                                                          attrs: {
                                                            value:
                                                              e.appointment
                                                                .bookings[0]
                                                                .persons,
                                                            min: 1,
                                                            max: t.places,
                                                            type: "number",
                                                          },
                                                          on: {
                                                            change: e.setPlaces,
                                                          },
                                                        }),
                                                      ],
                                                      2
                                                    )
                                                  : e._e(),
                                                e._v(" "),
                                                o(
                                                  "el-form-item",
                                                  [
                                                    o(
                                                      "el-button",
                                                      {
                                                        style:
                                                          e.getBookableColor(
                                                            t,
                                                            !0
                                                          ),
                                                        attrs: {
                                                          type: "primary",
                                                          disabled:
                                                            t.places <= 0,
                                                        },
                                                        on: {
                                                          click: function (o) {
                                                            return e.toggleEventBooking(
                                                              t
                                                            );
                                                          },
                                                        },
                                                      },
                                                      [
                                                        e._v(
                                                          "\n                      " +
                                                            e._s(
                                                              e.$root.labels
                                                                .continue
                                                            ) +
                                                            "\n                    "
                                                        ),
                                                      ]
                                                    ),
                                                  ],
                                                  1
                                                ),
                                              ],
                                              1
                                            ),
                                          ],
                                          1
                                        ),
                                      ]
                                    )
                                  : e._e(),
                              ]
                            ),
                          ]),
                          e._v(" "),
                          o("transition", { attrs: { name: "fade" } }, [
                            o(
                              "div",
                              {
                                directives: [
                                  {
                                    name: "show",
                                    rawName: "v-show",
                                    value: t.showEventBooking,
                                    expression: "evt.showEventBooking",
                                  },
                                ],
                                staticClass: "am-event-booking",
                              },
                              [
                                t.showEventBooking
                                  ? o(
                                      "confirm-booking",
                                      e._b(
                                        {
                                          attrs: {
                                            visible: t.showEventBooking,
                                            dialogClass:
                                              "am-confirm-booking-events-list",
                                            "form-type": "eventListForm",
                                            "forms-data": e.forms.eventListForm,
                                          },
                                          on: {
                                            "update:visible": function (o) {
                                              return e.$set(
                                                t,
                                                "showEventBooking",
                                                o
                                              );
                                            },
                                            confirmedBooking:
                                              e.confirmedBooking,
                                            cancelBooking: function (e) {
                                              t.showEventBooking = !1;
                                            },
                                          },
                                        },
                                        "confirm-booking",
                                        !e.cacheData ||
                                          ("canceled" !== e.cacheData.status &&
                                            "failed" !== e.cacheData.status)
                                          ? {
                                              bookableType: "event",
                                              containerId: e.getContainerId(),
                                              bookable: e.getBookableData(t),
                                              appointment: e.appointment,
                                              customFields:
                                                e.options.entities.customFields,
                                              phonePopulated: e.phonePopulated,
                                              useGlobalCustomization:
                                                e.useGlobalCustomization(),
                                              queryParams: e.getSearchParams(),
                                            }
                                          : e.getCacheDataRequestProps(),
                                        !1
                                      )
                                    )
                                  : e._e(),
                              ],
                              1
                            ),
                          ]),
                          e._v(" "),
                          o("transition", { attrs: { name: "fade" } }, [
                            o(
                              "div",
                              {
                                directives: [
                                  {
                                    name: "show",
                                    rawName: "v-show",
                                    value: t.showAddToCalendar,
                                    expression: "evt.showAddToCalendar",
                                  },
                                ],
                                staticClass: "am-event-booking",
                              },
                              [
                                t.showAddToCalendar
                                  ? o("add-to-calendar", {
                                      attrs: {
                                        "form-type": "eventListForm",
                                        "forms-data": e.forms.eventListForm,
                                        addToCalendarData: t.addToCalendarData,
                                      },
                                      on: {
                                        closeDialogAddToCalendar: function (e) {
                                          t.showAddToCalendar = !1;
                                        },
                                      },
                                    })
                                  : e._e(),
                              ],
                              1
                            ),
                          ]),
                        ],
                        1
                      )
                    : e._e();
                }),
                0
              ),
              e._v(" "),
              o(
                "div",
                { staticClass: "am-event-pagination" },
                [
                  o("el-pagination", {
                    directives: [
                      {
                        name: "show",
                        rawName: "v-show",
                        value:
                          e.pagination.count > e.pagination.show &&
                          e.events.length > 0,
                        expression:
                          "pagination.count > pagination.show && events.length > 0",
                      },
                    ],
                    attrs: {
                      "page-size": e.pagination.show,
                      total: e.pagination.count,
                      layout: "prev, pager, next",
                      "current-page": e.pagination.page,
                    },
                    on: {
                      "update:currentPage": function (t) {
                        return e.$set(e.pagination, "page", t);
                      },
                      "update:current-page": function (t) {
                        return e.$set(e.pagination, "page", t);
                      },
                    },
                  }),
                ],
                1
              ),
              e._v(" "),
              o(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: 0 === e.events.length,
                      expression: "events.length === 0",
                    },
                  ],
                  staticClass: "am-empty-state am-section",
                },
                [
                  o("img", {
                    attrs: {
                      src: e.$root.getUrl + "public/img/emptystate.svg",
                    },
                  }),
                  e._v(" "),
                  o("p", [e._v(e._s(e.$root.labels.no_results))]),
                ]
              ),
            ]
          ),
        ]);
      },
      staticRenderFns: [],
    };
  },
  675: function (e, t, o) {
    var a = o(685)(o(1313), o(1314), !1, null, null, null);
    e.exports = a.exports;
  },
  685: function (e, t) {
    e.exports = function (e, t, o, a, i, n) {
      var s,
        r = (e = e || {}),
        l = typeof e.default;
      ("object" !== l && "function" !== l) || ((s = e), (r = e.default));
      var c,
        m = "function" == typeof r ? r.options : r;
      if (
        (t &&
          ((m.render = t.render),
          (m.staticRenderFns = t.staticRenderFns),
          (m._compiled = !0)),
        o && (m.functional = !0),
        i && (m._scopeId = i),
        n
          ? ((c = function (e) {
              (e =
                e ||
                (this.$vnode && this.$vnode.ssrContext) ||
                (this.parent &&
                  this.parent.$vnode &&
                  this.parent.$vnode.ssrContext)) ||
                "undefined" == typeof __VUE_SSR_CONTEXT__ ||
                (e = __VUE_SSR_CONTEXT__),
                a && a.call(this, e),
                e && e._registeredComponents && e._registeredComponents.add(n);
            }),
            (m._ssrRegister = c))
          : a && (c = a),
        c)
      ) {
        var d = m.functional,
          p = d ? m.render : m.beforeCreate;
        d
          ? ((m._injectStyles = c),
            (m.render = function (e, t) {
              return c.call(t), p(e, t);
            }))
          : (m.beforeCreate = p ? [].concat(p, c) : [c]);
      }
      return { esModule: s, exports: r, options: m };
    };
  },
  686: function (e, t, o) {
    "use strict";
    var a =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          };
    t.a = {
      data: function () {
        return {};
      },
      methods: {
        replaceExistingObjectProperties: function (e, t) {
          var o = this;
          Object.keys(e).forEach(function (i) {
            null !== e[i] && "object" === a(e[i]) && i in t
              ? o.replaceExistingObjectProperties(e[i], t[i])
              : i in t && (e[i] = t[i]);
          });
        },
        addMissingObjectProperties: function (e, t) {
          var o = this;
          Object.keys(t).forEach(function (i) {
            var n = !1;
            i in e ||
              ("object" === a(t[i])
                ? ((e[i] = {}), (n = !0))
                : ((e[i] = null), (n = !0))),
              null === t[i] || "object" !== a(t[i])
                ? n && (e[i] = t[i])
                : o.addMissingObjectProperties(e[i], t[i]);
          });
        },
        scrollView: function (e, t, o) {
          "undefined" != typeof jQuery &&
            ((void 0 !== o && o) || jQuery(window).width() <= 600) &&
            document
              .getElementById(e)
              .scrollIntoView({
                behavior: "smooth",
                block: t,
                inline: "nearest",
              });
        },
        scrollViewInModal: function (e) {
          this.$nextTick(function () {
            document.getElementById(e) &&
              (document.querySelectorAll(".am-dialog-scrollable")[0].scrollTop =
                document.getElementById(e).offsetTop);
          });
        },
        getUrlQueryParams: function (e) {
          var t =
            e.indexOf("#") > 0
              ? e.substring(0, e.indexOf("#")).split("?")[1]
              : e.split("?")[1];
          if (t) {
            var o = [],
              a = {};
            return (
              t.split("&").forEach(function (e) {
                (o = e.split("=")),
                  (a[o[0]] = decodeURIComponent(o[1]).replace(/\+/g, " "));
              }),
              a
            );
          }
        },
        getUrlParams: function (e) {
          var t = {};
          if (-1 !== e.indexOf("?")) {
            var o = [];
            e.split("?")[1]
              .split("&")
              .forEach(function (e) {
                (o = e.split("=")),
                  (t[o[0]] = decodeURIComponent(o[1]).replace(/\+/g, " "));
              });
          }
          return t;
        },
        removeURLParameter: function (e, t) {
          var o = e.split("?");
          if (o.length >= 2) {
            for (
              var a = encodeURIComponent(t) + "=",
                i = o[1].split(/[&;]/g),
                n = i.length;
              n-- > 0;

            )
              -1 !== i[n].lastIndexOf(a, 0) && i.splice(n, 1);
            return (e = o[0] + (i.length > 0 ? "?" + i.join("&") : ""));
          }
          return e;
        },
        capitalizeFirstLetter: function (e) {
          return e.charAt(0).toUpperCase() + e.slice(1);
        },
        trimProperty: function (e, t) {
          e[t] = e[t].trim();
        },
      },
    };
  },
  687: function (e, t, o) {
    "use strict";
    t.a = {
      data: function () {
        return {
          colors: [
            "1788FB",
            "4BBEC6",
            "FBC22D",
            "FA3C52",
            "D696B8",
            "689BCA",
            "26CC2B",
            "FD7E35",
            "E38587",
            "774DFB",
            "31CDF3",
            "6AB76C",
            "FD5FA1",
            "A697C5",
          ],
          usedColors: [],
        };
      },
      methods: {
        inlineSVG: function () {
          var e = o(693);
          e.init({ svgSelector: "img.svg", initClass: "js-inlinesvg" });
        },
        inlineSVGCabinet: function () {
          setTimeout(function () {
            o(693).init({
              svgSelector: "img.svg-cabinet",
              initClass: "js-inlinesvg",
            });
          }, 100);
        },
        imageFromText: function (e) {
          var t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {},
            o = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
            a = this.getNameInitials(e),
            i = Math.floor(Math.random() * this.colors.length),
            n = this.colors[i];
          return (
            this.usedColors.push(this.colors[i]),
            this.colors.splice(i, 1),
            0 === this.colors.length &&
              ((this.colors = this.usedColors), (this.usedColors = [])),
            o
              ? t.firstName
                ? this.$root.getUrl + "public/img/default-employee.svg"
                : t.latitude
                ? this.$root.getUrl + "public/img/default-location.svg"
                : this.$root.getUrl + "public/img/default-service.svg"
              : location.protocol +
                "//via.placeholder.com/120/" +
                n +
                "/fff?text=" +
                a
          );
        },
        pictureLoad: function (e, t) {
          if (null !== e) {
            var o = !0 === t ? e.firstName + " " + e.lastName : e.name;
            if (void 0 !== o)
              return (
                (e.pictureThumbPath =
                  e.pictureThumbPath || this.imageFromText(o)),
                e.pictureThumbPath
              );
          }
        },
        imageLoadError: function (e, t) {
          var o = !0 === t ? e.firstName + " " + e.lastName : e.name;
          void 0 !== o && (e.pictureThumbPath = this.imageFromText(o, e, !0));
        },
        getNameInitials: function (e) {
          return e
            .split(" ")
            .map(function (e) {
              return e.charAt(0);
            })
            .join("")
            .toUpperCase()
            .substring(0, 3)
            .replace(/[^\w\s]/g, "");
        },
      },
    };
  },
  689: function (e, t, o) {
    "use strict";
    t.a = {
      data: function () {
        return {
          currencies: [
            {
              symbol: "$",
              name: "US Dollar",
              symbol_native: "$",
              code: "USD",
              iso: "us",
            },
            {
              symbol: "€",
              name: "Euro",
              symbol_native: "€",
              code: "EUR",
              iso: "eu",
            },
            {
              symbol: "£",
              name: "British Pound Sterling",
              symbol_native: "£",
              code: "GBP",
              iso: "gb",
            },
            {
              symbol: "CA$",
              name: "Canadian Dollar",
              symbol_native: "$",
              code: "CAD",
              iso: "ca",
            },
            {
              symbol: "FCFP",
              name: "CFP Franc",
              symbol_native: "FCFP",
              code: "XPF",
              iso: "fr",
            },
            {
              symbol: "CHF",
              name: "Swiss Franc",
              symbol_native: "CHF",
              code: "CHF",
              iso: "ch",
            },
            {
              symbol: "RUB",
              name: "Russian Ruble",
              symbol_native: "руб.",
              code: "RUB",
              iso: "ru",
            },
            {
              symbol: "¥",
              name: "Japanese Yen",
              symbol_native: "￥",
              code: "JPY",
              iso: "jp",
            },
            {
              symbol: "Af",
              name: "Afghan Afghani",
              symbol_native: "؋",
              code: "AFN",
              iso: "af",
            },
            {
              symbol: "ALL",
              name: "Albanian Lek",
              symbol_native: "Lek",
              code: "ALL",
              iso: "al",
            },
            {
              symbol: "DA",
              name: "Algerian Dinar",
              symbol_native: "د.ج.‏",
              code: "DZD",
              iso: "dz",
            },
            {
              symbol: "AR$",
              name: "Argentine Peso",
              symbol_native: "$",
              code: "ARS",
              iso: "ar",
            },
            {
              symbol: "AMD",
              name: "Armenian Dram",
              symbol_native: "դր.",
              code: "AMD",
              iso: "am",
            },
            {
              symbol: "AU$",
              name: "Australian Dollar",
              symbol_native: "$",
              code: "AUD",
              iso: "au",
            },
            {
              symbol: "man.",
              name: "Azerbaijani Manat",
              symbol_native: "ман.",
              code: "AZN",
              iso: "az",
            },
            {
              symbol: "BD",
              name: "Bahraini Dinar",
              symbol_native: "د.ب.‏",
              code: "BHD",
              iso: "bh",
            },
            {
              symbol: "Tk",
              name: "Bangladeshi Taka",
              symbol_native: "৳",
              code: "BDT",
              iso: "bd",
            },
            {
              symbol: "BYR",
              name: "Belarusian Ruble",
              symbol_native: "BYR",
              code: "BYR",
              iso: "by",
            },
            {
              symbol: "BZ$",
              name: "Belize Dollar",
              symbol_native: "$",
              code: "BZD",
              iso: "bz",
            },
            {
              symbol: "Bs",
              name: "Bolivian Boliviano",
              symbol_native: "Bs",
              code: "BOB",
              iso: "bo",
            },
            {
              symbol: "KM",
              name: "Bosnia-Herzegovina Convertible Mark",
              symbol_native: "KM",
              code: "BAM",
              iso: "ba",
            },
            {
              symbol: "BWP",
              name: "Botswanan Pula",
              symbol_native: "P",
              code: "BWP",
              iso: "bw",
            },
            {
              symbol: "R$",
              name: "Brazilian Real",
              symbol_native: "R$",
              code: "BRL",
              iso: "br",
            },
            {
              symbol: "BN$",
              name: "Brunei Dollar",
              symbol_native: "$",
              code: "BND",
              iso: "bn",
            },
            {
              symbol: "BGN",
              name: "Bulgarian Lev",
              symbol_native: "лв.",
              code: "BGN",
              iso: "bg",
            },
            {
              symbol: "FBu",
              name: "Burundian Franc",
              symbol_native: "FBu",
              code: "BIF",
              iso: "bi",
            },
            {
              symbol: "CFA",
              name: "CFA Franc BCEAO",
              symbol_native: "CFA",
              code: "XOF",
              iso: "auto",
            },
            {
              symbol: "FCFA",
              name: "CFA Franc BEAC",
              symbol_native: "FCFA",
              code: "XAF",
              iso: "auto",
            },
            {
              symbol: "KHR",
              name: "Cambodian Riel",
              symbol_native: "៛",
              code: "KHR",
              iso: "kh",
            },
            {
              symbol: "CV$",
              name: "Cape Verdean Escudo",
              symbol_native: "CV$",
              code: "CVE",
              iso: "cv",
            },
            {
              symbol: "CLP",
              name: "Chilean Peso",
              symbol_native: "$",
              code: "CLP",
              iso: "cl",
            },
            {
              symbol: "CN¥",
              name: "Chinese Yuan",
              symbol_native: "CN¥",
              code: "CNY",
              iso: "cn",
            },
            {
              symbol: "COP",
              name: "Colombian Peso",
              symbol_native: "$",
              code: "COP",
              iso: "co",
            },
            {
              symbol: "CF",
              name: "Comorian Franc",
              symbol_native: "FC",
              code: "KMF",
              iso: "km",
            },
            {
              symbol: "CDF",
              name: "Congolese Franc",
              symbol_native: "FrCD",
              code: "CDF",
              iso: "cd",
            },
            {
              symbol: "₡",
              name: "Costa Rican Colón",
              symbol_native: "₡",
              code: "CRC",
              iso: "cr",
            },
            {
              symbol: "kn",
              name: "Croatian Kuna",
              symbol_native: "kn",
              code: "HRK",
              iso: "hr",
            },
            {
              symbol: "Kč",
              name: "Czech Republic Koruna",
              symbol_native: "Kč",
              code: "CZK",
              iso: "cz",
            },
            {
              symbol: "Dkk",
              name: "Danish Krone",
              symbol_native: "kr",
              code: "DKK",
              iso: "dk",
            },
            {
              symbol: "Fdj",
              name: "Djiboutian Franc",
              symbol_native: "Fdj",
              code: "DJF",
              iso: "dj",
            },
            {
              symbol: "RD$",
              name: "Dominican Peso",
              symbol_native: "RD$",
              code: "DOP",
              iso: "do",
            },
            {
              symbol: "EGP",
              name: "Egyptian Pound",
              symbol_native: "ج.م.‏",
              code: "EGP",
              iso: "eg",
            },
            {
              symbol: "Nfk",
              name: "Eritrean Nakfa",
              symbol_native: "Nfk",
              code: "ERN",
              iso: "er",
            },
            {
              symbol: "Ekr",
              name: "Estonian Kroon",
              symbol_native: "kr",
              code: "EEK",
              iso: "ee",
            },
            {
              symbol: "Br",
              name: "Ethiopian Birr",
              symbol_native: "Br",
              code: "ETB",
              iso: "et",
            },
            {
              symbol: "GEL",
              name: "Georgian Lari",
              symbol_native: "GEL",
              code: "GEL",
              iso: "ge",
            },
            {
              symbol: "GH₵",
              name: "Ghanaian Cedi",
              symbol_native: "GH₵",
              code: "GHS",
              iso: "gh",
            },
            {
              symbol: "GTQ",
              name: "Guatemalan Quetzal",
              symbol_native: "Q",
              code: "GTQ",
              iso: "gt",
            },
            {
              symbol: "FG",
              name: "Guinean Franc",
              symbol_native: "FG",
              code: "GNF",
              iso: "gn",
            },
            {
              symbol: "HNL",
              name: "Honduran Lempira",
              symbol_native: "L",
              code: "HNL",
              iso: "hn",
            },
            {
              symbol: "HK$",
              name: "Hong Kong Dollar",
              symbol_native: "$",
              code: "HKD",
              iso: "hk",
            },
            {
              symbol: "Ft",
              name: "Hungarian Forint",
              symbol_native: "Ft",
              code: "HUF",
              iso: "hu",
            },
            {
              symbol: "kr",
              name: "Icelandic Króna",
              symbol_native: "kr",
              code: "ISK",
              iso: "is",
            },
            {
              symbol: "INR",
              name: "Indian Rupee",
              symbol_native: "টকা",
              code: "INR",
              iso: "in",
            },
            {
              symbol: "Rp",
              name: "Indonesian Rupiah",
              symbol_native: "Rp",
              code: "IDR",
              iso: "id",
            },
            {
              symbol: "IRR",
              name: "Iranian Rial",
              symbol_native: "﷼",
              code: "IRR",
              iso: "ir",
            },
            {
              symbol: "IQD",
              name: "Iraqi Dinar",
              symbol_native: "د.ع.‏",
              code: "IQD",
              iso: "iq",
            },
            {
              symbol: "₪",
              name: "Israeli New Sheqel",
              symbol_native: "₪",
              code: "ILS",
              iso: "il",
            },
            {
              symbol: "J$",
              name: "Jamaican Dollar",
              symbol_native: "$",
              code: "JMD",
              iso: "jm",
            },
            {
              symbol: "JD",
              name: "Jordanian Dinar",
              symbol_native: "د.أ.‏",
              code: "JOD",
              iso: "jo",
            },
            {
              symbol: "KZT",
              name: "Kazakhstani Tenge",
              symbol_native: "тңг.",
              code: "KZT",
              iso: "kz",
            },
            {
              symbol: "Ksh",
              name: "Kenyan Shilling",
              symbol_native: "Ksh",
              code: "KES",
              iso: "ke",
            },
            {
              symbol: "KD",
              name: "Kuwaiti Dinar",
              symbol_native: "د.ك.‏",
              code: "KWD",
              iso: "kw",
            },
            {
              symbol: "Ls",
              name: "Latvian Lats",
              symbol_native: "Ls",
              code: "LVL",
              iso: "lv",
            },
            {
              symbol: "LB£",
              name: "Lebanese Pound",
              symbol_native: "ل.ل.‏",
              code: "LBP",
              iso: "lb",
            },
            {
              symbol: "LD",
              name: "Libyan Dinar",
              symbol_native: "د.ل.‏",
              code: "LYD",
              iso: "ly",
            },
            {
              symbol: "Lt",
              name: "Lithuanian Litas",
              symbol_native: "Lt",
              code: "LTL",
              iso: "lt",
            },
            {
              symbol: "MOP$",
              name: "Macanese Pataca",
              symbol_native: "MOP$",
              code: "MOP",
              iso: "mo",
            },
            {
              symbol: "MKD",
              name: "Macedonian Denar",
              symbol_native: "MKD",
              code: "MKD",
              iso: "mk",
            },
            {
              symbol: "MGA",
              name: "Malagasy Ariary",
              symbol_native: "MGA",
              code: "MGA",
              iso: "mg",
            },
            {
              symbol: "RM",
              name: "Malaysian Ringgit",
              symbol_native: "RM",
              code: "MYR",
              iso: "my",
            },
            {
              symbol: "MURs",
              name: "Mauritian Rupee",
              symbol_native: "MURs",
              code: "MUR",
              iso: "mu",
            },
            {
              symbol: "MX$",
              name: "Mexican Peso",
              symbol_native: "$",
              code: "MXN",
              iso: "mx",
            },
            {
              symbol: "MDL",
              name: "Moldovan Leu",
              symbol_native: "MDL",
              code: "MDL",
              iso: "md",
            },
            {
              symbol: "MAD",
              name: "Moroccan Dirham",
              symbol_native: "د.م.‏",
              code: "MAD",
              iso: "ma",
            },
            {
              symbol: "MTn",
              name: "Mozambican Metical",
              symbol_native: "MTn",
              code: "MZN",
              iso: "mz",
            },
            {
              symbol: "MMK",
              name: "Myanma Kyat",
              symbol_native: "K",
              code: "MMK",
              iso: "mm",
            },
            {
              symbol: "N$",
              name: "Namibian Dollar",
              symbol_native: "N$",
              code: "NAD",
              iso: "na",
            },
            {
              symbol: "NPRs",
              name: "Nepalese Rupee",
              symbol_native: "नेरू",
              code: "NPR",
              iso: "np",
            },
            {
              symbol: "NT$",
              name: "New Taiwan Dollar",
              symbol_native: "NT$",
              code: "TWD",
              iso: "tw",
            },
            {
              symbol: "NZ$",
              name: "New Zealand Dollar",
              symbol_native: "$",
              code: "NZD",
              iso: "nz",
            },
            {
              symbol: "C$",
              name: "Nicaraguan Córdoba",
              symbol_native: "C$",
              code: "NIO",
              iso: "ni",
            },
            {
              symbol: "₦",
              name: "Nigerian Naira",
              symbol_native: "₦",
              code: "NGN",
              iso: "ng",
            },
            {
              symbol: "kr",
              name: "Norwegian Krone",
              symbol_native: "kr",
              code: "NOK",
              iso: "no",
            },
            {
              symbol: "OMR",
              name: "Omani Rial",
              symbol_native: "ر.ع.‏",
              code: "OMR",
              iso: "om",
            },
            {
              symbol: "PKRs",
              name: "Pakistani Rupee",
              symbol_native: "₨",
              code: "PKR",
              iso: "pk",
            },
            {
              symbol: "B/.",
              name: "Panamanian Balboa",
              symbol_native: "B/.",
              code: "PAB",
              iso: "pa",
            },
            {
              symbol: "₲",
              name: "Paraguayan Guarani",
              symbol_native: "₲",
              code: "PYG",
              iso: "py",
            },
            {
              symbol: "S/.",
              name: "Peruvian Nuevo Sol",
              symbol_native: "S/.",
              code: "PEN",
              iso: "pe",
            },
            {
              symbol: "₱",
              name: "Philippine Peso",
              symbol_native: "₱",
              code: "PHP",
              iso: "ph",
            },
            {
              symbol: "zł",
              name: "Polish Zloty",
              symbol_native: "zł",
              code: "PLN",
              iso: "pl",
            },
            {
              symbol: "QR",
              name: "Qatari Rial",
              symbol_native: "ر.ق.‏",
              code: "QAR",
              iso: "qa",
            },
            {
              symbol: "RON",
              name: "Romanian Leu",
              symbol_native: "RON",
              code: "RON",
              iso: "ro",
            },
            {
              symbol: "RWF",
              name: "Rwandan Franc",
              symbol_native: "FR",
              code: "RWF",
              iso: "rw",
            },
            {
              symbol: "SR",
              name: "Saudi Riyal",
              symbol_native: "ر.س.‏",
              code: "SAR",
              iso: "sa",
            },
            {
              symbol: "rsd.",
              name: "Serbian Dinar",
              symbol_native: "дин.",
              code: "RSD",
              iso: "rs",
            },
            {
              symbol: "S$",
              name: "Singapore Dollar",
              symbol_native: "$",
              code: "SGD",
              iso: "sg",
            },
            {
              symbol: "Ssh",
              name: "Somali Shilling",
              symbol_native: "Ssh",
              code: "SOS",
              iso: "so",
            },
            {
              symbol: "R",
              name: "South African Rand",
              symbol_native: "R",
              code: "ZAR",
              iso: "za",
            },
            {
              symbol: "₩",
              name: "South Korean Won",
              symbol_native: "₩",
              code: "KRW",
              iso: "kr",
            },
            {
              symbol: "₭",
              name: "Lao kip",
              symbol_native: "₭",
              code: "LAK",
              iso: "la",
            },
            {
              symbol: "SLRs",
              name: "Sri Lankan Rupee",
              symbol_native: "SL Re",
              code: "LKR",
              iso: "lk",
            },
            {
              symbol: "SDG",
              name: "Sudanese Pound",
              symbol_native: "SDG",
              code: "SDG",
              iso: "sd",
            },
            {
              symbol: "kr",
              name: "Swedish Krona",
              symbol_native: "kr",
              code: "SEK",
              iso: "se",
            },
            {
              symbol: "SY£",
              name: "Syrian Pound",
              symbol_native: "ل.س.‏",
              code: "SYP",
              iso: "sy",
            },
            {
              symbol: "TSh",
              name: "Tanzanian Shilling",
              symbol_native: "TSh",
              code: "TZS",
              iso: "tz",
            },
            {
              symbol: "฿",
              name: "Thai Baht",
              symbol_native: "฿",
              code: "THB",
              iso: "th",
            },
            {
              symbol: "T$",
              name: "Tongan Paʻanga",
              symbol_native: "T$",
              code: "TOP",
              iso: "to",
            },
            {
              symbol: "TT$",
              name: "Trinidad and Tobago Dollar",
              symbol_native: "$",
              code: "TTD",
              iso: "tt",
            },
            {
              symbol: "DT",
              name: "Tunisian Dinar",
              symbol_native: "د.ت.‏",
              code: "TND",
              iso: "tn",
            },
            {
              symbol: "TL",
              name: "Turkish Lira",
              symbol_native: "TL",
              code: "TRY",
              iso: "tr",
            },
            {
              symbol: "USh",
              name: "Ugandan Shilling",
              symbol_native: "USh",
              code: "UGX",
              iso: "ug",
            },
            {
              symbol: "₴",
              name: "Ukrainian Hryvnia",
              symbol_native: "₴",
              code: "UAH",
              iso: "ua",
            },
            {
              symbol: "AED",
              name: "United Arab Emirates Dirham",
              symbol_native: "د.إ.‏",
              code: "AED",
              iso: "ae",
            },
            {
              symbol: "$U",
              name: "Uruguayan Peso",
              symbol_native: "$",
              code: "UYU",
              iso: "uy",
            },
            {
              symbol: "UZS",
              name: "Uzbekistan Som",
              symbol_native: "UZS",
              code: "UZS",
              iso: "uz",
            },
            {
              symbol: "Bs.S.",
              name: "Venezuelan Bolívar",
              symbol_native: "Bs.S.",
              code: "VES",
              iso: "ve",
            },
            {
              symbol: "₫",
              name: "Vietnamese Dong",
              symbol_native: "₫",
              code: "VND",
              iso: "vn",
            },
            {
              symbol: "YR",
              name: "Yemeni Rial",
              symbol_native: "ر.ي.‏",
              code: "YER",
              iso: "ye",
            },
            {
              symbol: "ZK",
              name: "Zambian Kwacha",
              symbol_native: "ZK",
              code: "ZMK",
              iso: "zm",
            },
          ],
          thousandSeparatorMap: { 1: ",", 2: ".", 3: " ", 4: " " },
          decimalSeparatorMap: { 1: ".", 2: ",", 3: ".", 4: "," },
        };
      },
      methods: {
        getCurrencySymbol: function () {
          var e = this;
          return this.currencies.find(function (t) {
            return t.code === e.$root.settings.payments.currency;
          }).symbol;
        },
        getPriceThousandSeparator: function () {
          return this.thousandSeparatorMap[
            this.$root.settings.payments.priceSeparator
          ];
        },
        getPriceDecimalSeparator: function () {
          return this.decimalSeparatorMap[
            this.$root.settings.payments.priceSeparator
          ];
        },
        getPriceNumberOfDecimalPlaces: function () {
          return this.$root.settings.payments.priceNumberOfDecimals;
        },
        getPricePrefix: function () {
          return "after" === this.$root.settings.payments.priceSymbolPosition ||
            "afterWithSpace" ===
              this.$root.settings.payments.priceSymbolPosition
            ? ""
            : "before" === this.$root.settings.payments.priceSymbolPosition
            ? this.getCurrencySymbol()
            : this.getCurrencySymbol() + " ";
        },
        getPriceSuffix: function () {
          return "before" ===
            this.$root.settings.payments.priceSymbolPosition ||
            "beforeWithSpace" ===
              this.$root.settings.payments.priceSymbolPosition
            ? ""
            : "after" === this.$root.settings.payments.priceSymbolPosition
            ? this.getCurrencySymbol()
            : " " + this.getCurrencySymbol();
        },
        getFormattedPrice: function (e) {
          var t =
              !(arguments.length > 1 && void 0 !== arguments[1]) ||
              arguments[1],
            o = this.getPriceNumberOfDecimalPlaces(),
            a = this.getPriceThousandSeparator(),
            i = this.getPriceDecimalSeparator(),
            n = this.getPricePrefix(),
            s = this.getPriceSuffix(),
            r = parseInt((e = Math.abs(+e || 0).toFixed(o))) + "",
            l = r.length > 3 ? r.length % 3 : 0;
          return (
            (t ? n : "") +
            (l ? r.substr(0, l) + a : "") +
            r.substr(l).replace(/(\d{3})(?=\d)/g, "$1" + a) +
            (o
              ? i +
                Math.abs(e - r)
                  .toFixed(o)
                  .slice(2)
              : "") +
            (t ? s : "")
          );
        },
      },
      computed: {
        moneyComponentData: function () {
          return {
            decimal: this.getPriceDecimalSeparator(),
            thousands: this.getPriceThousandSeparator(),
            prefix: this.getPricePrefix(),
            suffix: this.getPriceSuffix(),
            precision: this.getPriceNumberOfDecimalPlaces(),
            masked: !1,
          };
        },
      },
    };
  },
  693: function (e, t, o) {
    (function (o) {
      var a, i, n, s;
      (s = void 0 !== o ? o : this.window || this.global),
        (i = []),
        (a = (function (e) {
          var t,
            o = {},
            a = !!document.querySelector && !!e.addEventListener,
            i = { initClass: "js-inlinesvg", svgSelector: "img.svg" },
            n = function () {
              var e = {},
                t = !1,
                o = 0,
                a = arguments.length;
              "[object Boolean]" ===
                Object.prototype.toString.call(arguments[0]) &&
                ((t = arguments[0]), o++);
              for (
                var i = function (o) {
                  for (var a in o)
                    Object.prototype.hasOwnProperty.call(o, a) &&
                      (t &&
                      "[object Object]" === Object.prototype.toString.call(o[a])
                        ? (e[a] = n(!0, e[a], o[a]))
                        : (e[a] = o[a]));
                };
                a > o;
                o++
              ) {
                i(arguments[o]);
              }
              return e;
            },
            s = function (e) {
              var o = document.querySelectorAll(t.svgSelector),
                a = (function (e, t) {
                  return function () {
                    return --e < 1 ? t.apply(this, arguments) : void 0;
                  };
                })(o.length, e);
              Array.prototype.forEach.call(o, function (e, o) {
                var i = e.src || e.getAttribute("data-src"),
                  n = e.attributes,
                  s = new XMLHttpRequest();
                s.open("GET", i, !0),
                  (s.onload = function () {
                    if (s.status >= 200 && s.status < 400) {
                      var o = new DOMParser()
                        .parseFromString(s.responseText, "text/xml")
                        .getElementsByTagName("svg")[0];
                      if (
                        (o.removeAttribute("xmlns:a"),
                        o.removeAttribute("width"),
                        o.removeAttribute("height"),
                        o.removeAttribute("x"),
                        o.removeAttribute("y"),
                        o.removeAttribute("enable-background"),
                        o.removeAttribute("xmlns:xlink"),
                        o.removeAttribute("xml:space"),
                        o.removeAttribute("version"),
                        Array.prototype.slice.call(n).forEach(function (e) {
                          "src" !== e.name &&
                            "alt" !== e.name &&
                            o.setAttribute(e.name, e.value);
                        }),
                        o.classList
                          ? o.classList.add("inlined-svg")
                          : (o.className += " inlined-svg"),
                        o.setAttribute("role", "img"),
                        n.longdesc)
                      ) {
                        var i = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "desc"
                          ),
                          r = document.createTextNode(n.longdesc.value);
                        i.appendChild(r), o.insertBefore(i, o.firstChild);
                      }
                      if (n.alt) {
                        o.setAttribute("aria-labelledby", "title");
                        var l = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "title"
                          ),
                          c = document.createTextNode(n.alt.value);
                        l.appendChild(c), o.insertBefore(l, o.firstChild);
                      }
                      e.parentNode.replaceChild(o, e), a(t.svgSelector);
                    } else
                      console.error(
                        "There was an error retrieving the source of the SVG."
                      );
                  }),
                  (s.onerror = function () {
                    console.error(
                      "There was an error connecting to the origin server."
                    );
                  }),
                  s.send();
              });
            };
          return (
            (o.init = function (e, o) {
              a &&
                ((t = n(i, e || {})),
                s(o || function () {}),
                (document.documentElement.className += " " + t.initClass));
            }),
            o
          );
        })(s)),
        void 0 === (n = "function" == typeof a ? a.apply(t, i) : a) ||
          (e.exports = n);
    }.call(t, o(39)));
  },
  694: function (e, t, o) {
    "use strict";
    t.a = {
      data: function () {
        return {};
      },
      methods: {
        isCustomFieldVisible: function (e, t, o) {
          switch (t) {
            case "appointment":
              return (
                -1 !==
                e.services
                  .map(function (e) {
                    return e.id;
                  })
                  .indexOf(o)
              );
            case "event":
              return (
                -1 !==
                e.events
                  .map(function (e) {
                    return e.id;
                  })
                  .indexOf(o)
              );
          }
          return !1;
        },
        setBookingCustomFields: function () {
          if (
            this.appointment &&
            this.appointment.bookings &&
            this.appointment.bookings.length
          )
            for (var e = 0; e < this.appointment.bookings.length; e++)
              for (
                var t = 0;
                t < this.options.entities.customFields.length;
                t++
              )
                if (
                  (null === this.appointment.bookings[e].customFields &&
                    (this.appointment.bookings[e].customFields = {}),
                  void 0 !==
                    this.appointment.bookings[e].customFields[
                      this.options.entities.customFields[t].id
                    ] &&
                    (this.appointment.bookings[e].customFields[
                      this.options.entities.customFields[t].id
                    ].type = this.options.entities.customFields[t].type),
                  void 0 !==
                    this.appointment.bookings[e].customFields[
                      this.options.entities.customFields[t].id
                    ] &&
                    "datepicker" ===
                      this.appointment.bookings[e].customFields[
                        this.options.entities.customFields[t].id
                      ].type &&
                    this.appointment.bookings[e].customFields[
                      this.options.entities.customFields[t].id
                    ].value &&
                    (this.appointment.bookings[e].customFields[
                      this.options.entities.customFields[t].id
                    ].value = this.$moment(
                      this.appointment.bookings[e].customFields[
                        this.options.entities.customFields[t].id
                      ].value
                    ).toDate()),
                  "content" !== this.options.entities.customFields[t].type &&
                    void 0 ===
                      this.appointment.bookings[e].customFields[
                        this.options.entities.customFields[t].id
                      ])
                ) {
                  var o = "";
                  "checkbox" === this.options.entities.customFields[t].type &&
                    (o = []),
                    "datepicker" ===
                      this.options.entities.customFields[t].type && (o = null),
                    this.$set(
                      this.appointment.bookings[e].customFields,
                      this.options.entities.customFields[t].id,
                      {
                        label: this.options.entities.customFields[t].label,
                        value: o,
                        type: this.options.entities.customFields[t].type,
                      }
                    );
                }
        },
        getCustomFieldOptions: function (e) {
          return e.map(function (e) {
            return e.label;
          });
        },
        getCustomFieldValue: function (e, t) {
          return Array.isArray(e)
            ? e.join("; ")
            : "datepicker" !== t
            ? e
            : e
            ? this.getFrontedFormattedDate(e)
            : null;
        },
        getCustomFieldFileURL: function (e, t, o) {
          return (
            this.$root.getAjaxUrl +
            "/fields/" +
            e +
            "/" +
            t +
            "/" +
            o +
            "&source=cabinet-provider"
          );
        },
      },
    };
  },
  695: function (e, t, o) {
    "use strict";
    t.a = {
      data: function () {
        return { screenWidth: window.innerWidth };
      },
      mounted: function () {
        var e = this;
        window.onresize = function () {
          e.screenWidth = window.innerWidth;
        };
      },
    };
  },
  696: function (e, t, o) {
    var a = o(685)(o(703), o(704), !1, null, null, null);
    e.exports = a.exports;
  },
  699: function (e, t, o) {
    "use strict";
    t.a = {
      data: function () {
        return {
          defaultFormsData: {
            stepByStepForm: {
              selectServiceForm: {
                globalSettings: {
                  formBackgroundColor: "#ffffff",
                  formTextColor: "#354052",
                  formInputColor: "#ffffff",
                  formInputTextColor: "#354052",
                  formDropdownColor: "#ffffff",
                  formDropdownTextColor: "#354052",
                },
                itemsStatic: {
                  serviceHeadingFormField: {
                    labels: {
                      please_select_service: {
                        value: "",
                        translations: { x: "" },
                      },
                    },
                    visibility: !0,
                  },
                },
                itemsDraggable: {
                  serviceFormField: {
                    labels: { service: { value: "", translations: { x: "" } } },
                  },
                  servicePackageFormField: {
                    labels: {
                      package_available: { value: "", translations: { x: "" } },
                      package_discount_text: {
                        value: "",
                        translations: { x: "" },
                      },
                    },
                    visibility: !0,
                  },
                  locationFormField: {
                    labels: {
                      locations: { value: "", translations: { x: "" } },
                    },
                    visibility: !0,
                    required: !1,
                  },
                  employeeFormField: {
                    labels: {
                      employee: { value: "", translations: { x: "" } },
                      any_employee: { value: "", translations: { x: "" } },
                    },
                    visibility: !0,
                    required: !1,
                    anyEmployeeVisible: !0,
                  },
                  bringingFormField: {
                    labels: {
                      bringing_anyone_with_you: {
                        value: "",
                        translations: { x: "" },
                      },
                      number_of_additional_persons: {
                        value: "",
                        translations: { x: "" },
                      },
                    },
                  },
                  addExtraFormField: {
                    labels: {
                      add_extra: { value: "", translations: { x: "" } },
                      extra_colon: { value: "", translations: { x: "" } },
                      qty_colon: { value: "", translations: { x: "" } },
                      duration_colon: { value: "", translations: { x: "" } },
                      price_colon: { value: "", translations: { x: "" } },
                    },
                    visibility: !0,
                  },
                },
              },
              calendarDateTimeForm: {
                globalSettings: {
                  formTextColor: "#ffffff",
                  formGradientColor1: "#1A84EE",
                  formGradientColor2: "#0454A2",
                  formGradientAngle: 135,
                },
                itemsStatic: {
                  timeZoneFormField: { visibility: !1 },
                  calendarHeadingFormField: {
                    labels: {
                      pick_date_and_time: {
                        value: "",
                        translations: { x: "" },
                      },
                    },
                    visibility: !0,
                  },
                  calendarAppointmentFormField: { endDateVisibility: !0 },
                  recurringSwitchFormField: {
                    labels: {
                      recurring_active: { value: "", translations: { x: "" } },
                    },
                    visibility: !0,
                  },
                },
              },
              recurringSetupForm: {
                globalSettings: {
                  formTextColor: "#ffffff",
                  formGradientColor1: "#1A84EE",
                  formGradientColor2: "#0454A2",
                  formGradientAngle: 135,
                  formInputColor: "rgba(0, 0, 0, 0)",
                  formInputTextColor: "#ffffff",
                  formDropdownColor: "#ffffff",
                  formDropdownTextColor: "#354052",
                },
                itemsStatic: {
                  recurringSetupHeadingFormField: {
                    labels: {
                      recurring_active: { value: "", translations: { x: "" } },
                    },
                    visibility: !0,
                  },
                  recurringSettingsFormField: {
                    labels: {
                      recurring_repeat: { value: "", translations: { x: "" } },
                      recurring_every: { value: "", translations: { x: "" } },
                      recurring_on: { value: "", translations: { x: "" } },
                      recurring_until: { value: "", translations: { x: "" } },
                      recurring_times: { value: "", translations: { x: "" } },
                    },
                  },
                },
              },
              recurringDatesForm: {
                globalSettings: {
                  formBackgroundColor: "#ffffff",
                  formTextColor: "#354052",
                  formInputColor: "#ffffff",
                  formInputTextColor: "#354052",
                  formDropdownColor: "#ffffff",
                  formDropdownTextColor: "#354052",
                },
                itemsStatic: {
                  recurringDatesHeadingFormField: {
                    labels: {
                      recurring_appointments: {
                        value: "",
                        translations: { x: "" },
                      },
                      recurring_edit: { value: "", translations: { x: "" } },
                    },
                    visibility: !0,
                  },
                  recurringInfoFormField: {
                    labels: {
                      date: { value: "", translations: { x: "" } },
                      time: { value: "", translations: { x: "" } },
                    },
                  },
                },
              },
              selectPackageForm: {
                globalSettings: {
                  formBackgroundColor: "#ffffff",
                  formTextColor: "#354052",
                  formInputColor: "#ffffff",
                  formInputTextColor: "#354052",
                  formDropdownColor: "#ffffff",
                  formDropdownTextColor: "#354052",
                },
                itemsStatic: {
                  packageHeadingFormField: {
                    labels: {
                      please_select_package: {
                        value: "",
                        translations: { x: "" },
                      },
                    },
                    visibility: !0,
                  },
                  packageFormField: {
                    labels: {
                      package_colon: { value: "", translations: { x: "" } },
                    },
                  },
                },
              },
              packageInfoForm: {
                globalSettings: {
                  formBackgroundColor: "#ffffff",
                  formTextColor: "#354052",
                },
                itemsStatic: {
                  packageInfoFormField: {
                    labels: {
                      package_discount_text: {
                        value: "",
                        translations: { x: "" },
                      },
                      employee: { value: "", translations: { x: "" } },
                      employees: { value: "", translations: { x: "" } },
                    },
                  },
                },
              },
              packageSetupForm: {
                globalSettings: {
                  formTextColor: "#ffffff",
                  formGradientColor1: "#1A84EE",
                  formGradientColor2: "#0454A2",
                  formGradientAngle: 135,
                  formInputColor: "rgba(0, 0, 0, 0.1)",
                  formInputTextColor: "#ffffff",
                  formDropdownColor: "#ffffff",
                  formDropdownTextColor: "#354052",
                },
                itemsStatic: {
                  packageEmployeeFormField: {
                    labels: {
                      employee: { value: "", translations: { x: "" } },
                      any_employee: { value: "", translations: { x: "" } },
                    },
                    anyEmployeeVisible: !0,
                  },
                  packageLocationFormField: {
                    labels: {
                      location: { value: "", translations: { x: "" } },
                    },
                  },
                  packageRulesFormField: {
                    labels: {
                      package_min_book: { value: "", translations: { x: "" } },
                      package_min_book_plural: {
                        value: "",
                        translations: { x: "" },
                      },
                    },
                  },
                  packageCalendarFormField: {
                    labels: {
                      no_selected_slot_requirements: {
                        value: "",
                        translations: { x: "" },
                      },
                    },
                    endDateVisibility: !0,
                    timeZoneVisibility: !0,
                  },
                },
              },
              packageListForm: {
                globalSettings: {
                  formBackgroundColor: "#ffffff",
                  formTextColor: "#354052",
                },
                itemsStatic: {
                  packageListFormField: {
                    labels: {
                      package_list_overview: {
                        value: "",
                        translations: { x: "" },
                      },
                      appointments: { value: "", translations: { x: "" } },
                      appointment: { value: "", translations: { x: "" } },
                      date: { value: "", translations: { x: "" } },
                      time: { value: "", translations: { x: "" } },
                      employee: { value: "", translations: { x: "" } },
                      location: { value: "", translations: { x: "" } },
                    },
                  },
                },
              },
              confirmBookingForm: {
                appointment: {
                  globalSettings: {
                    formBackgroundColor: "#ffffff",
                    formTextColor: "#354052",
                    formInputColor: "#ffffff",
                    formInputTextColor: "#354052",
                    formDropdownColor: "#ffffff",
                    formDropdownTextColor: "#354052",
                  },
                  itemsStatic: {
                    confirmServiceHeadingFormField: { visibility: !0 },
                    confirmHeadingDataFormField: {
                      labels: {
                        employee: { value: "", translations: { x: "" } },
                        date_colon: { value: "", translations: { x: "" } },
                        time_colon: { value: "", translations: { x: "" } },
                        location_colon: { value: "", translations: { x: "" } },
                      },
                      visibility: !0,
                    },
                    recurringStringFormField: {
                      labels: {
                        recurring_active: {
                          value: "",
                          translations: { x: "" },
                        },
                      },
                      visibility: !0,
                    },
                    paymentMethodFormField: {
                      labels: {
                        payment_method_colon: {
                          value: "",
                          translations: { x: "" },
                        },
                      },
                    },
                    stripeCardFormField: {
                      labels: {
                        credit_or_debit_card_colon: {
                          value: "",
                          translations: { x: "" },
                        },
                      },
                    },
                  },
                  itemsDraggable: {
                    firstNameFormField: {
                      labels: {
                        first_name_colon: {
                          value: "",
                          translations: { x: "" },
                        },
                      },
                    },
                    lastNameFormField: {
                      labels: {
                        last_name_colon: { value: "", translations: { x: "" } },
                      },
                      visibility: !0,
                      required: !0,
                    },
                    emailFormField: {
                      labels: {
                        email_colon: { value: "", translations: { x: "" } },
                      },
                      visibility: !0,
                      required: this.$root.settings.general.requiredEmailField,
                    },
                    phoneFormField: {
                      labels: {
                        phone_colon: { value: "", translations: { x: "" } },
                      },
                      visibility: !0,
                      required:
                        this.$root.settings.general.requiredPhoneNumberField,
                    },
                  },
                },
                package: {
                  globalSettings: {
                    formBackgroundColor: "#ffffff",
                    formTextColor: "#354052",
                    formInputColor: "#ffffff",
                    formInputTextColor: "#354052",
                    formDropdownColor: "#ffffff",
                    formDropdownTextColor: "#354052",
                  },
                  itemsStatic: {
                    paymentMethodFormField: {
                      labels: {
                        payment_method_colon: {
                          value: "",
                          translations: { x: "" },
                        },
                      },
                    },
                    stripeCardFormField: {
                      labels: {
                        credit_or_debit_card_colon: {
                          value: "",
                          translations: { x: "" },
                        },
                      },
                    },
                  },
                  itemsDraggable: {
                    firstNameFormField: {
                      labels: {
                        first_name_colon: {
                          value: "",
                          translations: { x: "" },
                        },
                      },
                    },
                    lastNameFormField: {
                      labels: {
                        last_name_colon: { value: "", translations: { x: "" } },
                      },
                      visibility: !0,
                      required: !0,
                    },
                    emailFormField: {
                      labels: {
                        email_colon: { value: "", translations: { x: "" } },
                      },
                      visibility: !0,
                      required: this.$root.settings.general.requiredEmailField,
                    },
                    phoneFormField: {
                      labels: {
                        phone_colon: { value: "", translations: { x: "" } },
                      },
                      visibility: !0,
                      required:
                        this.$root.settings.general.requiredPhoneNumberField,
                    },
                  },
                },
              },
              congratulationsForm: {
                appointment: {
                  globalSettings: {
                    formBackgroundColor: "#ffffff",
                    formTextColor: "#354052",
                    formInputColor: "#ffffff",
                    formInputTextColor: "#354052",
                    formDropdownColor: "#ffffff",
                    formDropdownTextColor: "#354052",
                    formImageColor: "#1A84EE",
                  },
                  itemsStatic: {
                    congratulationsHeadingFormField: {
                      labels: {
                        congratulations: { value: "", translations: { x: "" } },
                      },
                      visibility: !0,
                    },
                    congratulationsImageFormField: { visibility: !0 },
                    congratulationsMessagesFormField: {
                      labels: {
                        booking_completed_approved: {
                          value: "",
                          translations: { x: "" },
                        },
                        booking_completed_pending: {
                          value: "",
                          translations: { x: "" },
                        },
                      },
                      visibility: !0,
                    },
                    addToCalendarFormField: { addToCalendarVisibility: !0 },
                  },
                },
                package: {
                  globalSettings: {
                    formBackgroundColor: "#ffffff",
                    formTextColor: "#354052",
                    formInputColor: "#ffffff",
                    formInputTextColor: "#354052",
                    formDropdownColor: "#ffffff",
                    formDropdownTextColor: "#354052",
                    formImageColor: "#1A84EE",
                  },
                  itemsStatic: {
                    congratulationsHeadingFormField: {
                      labels: {
                        congratulations: { value: "", translations: { x: "" } },
                      },
                      visibility: !0,
                    },
                    congratulationsImageFormField: { visibility: !0 },
                    congratulationsMessagesFormField: {
                      labels: {
                        booking_completed_approved: {
                          value: "",
                          translations: { x: "" },
                        },
                        booking_completed_pending: {
                          value: "",
                          translations: { x: "" },
                        },
                      },
                      visibility: !0,
                    },
                    addToCalendarFormField: { addToCalendarVisibility: !0 },
                  },
                },
              },
            },
            eventListForm: {
              globalSettings: {
                formBackgroundColor: "#ffffff",
                formTextColor: "#354052",
                formInputColor: "#ffffff",
                formInputTextColor: "#354052",
                formDropdownColor: "#ffffff",
                formDropdownTextColor: "#354052",
              },
              eventFilterForm: {
                itemsStatic: {
                  eventFilterFormField: {
                    labels: {
                      event_type: { value: "", translations: { x: "" } },
                    },
                  },
                },
              },
              eventDetailsForm: {
                itemsStatic: {
                  eventDetailsFormField: {
                    labels: {
                      open: { value: "", translations: { x: "" } },
                      closed: { value: "", translations: { x: "" } },
                      canceled: { value: "", translations: { x: "" } },
                      full: { value: "", translations: { x: "" } },
                      upcoming: { value: "", translations: { x: "" } },
                      event_capacity: {
                        value: "",
                        translations: { x: "" },
                        visibility: !0,
                      },
                      location: { visibility: !0 },
                      event_date: { visibility: !0 },
                      time_zone: { visibility: !1 },
                      event_free: { value: "", translations: { x: "" } },
                      event_price: { visibility: !0 },
                      event_about: { value: "", translations: { x: "" } },
                      event_book: {
                        value: "",
                        translations: { x: "" },
                        visibility: !0,
                      },
                      event_book_persons: {
                        value: "",
                        translations: { x: "" },
                      },
                    },
                  },
                },
              },
              confirmBookingForm: {
                event: {
                  itemsStatic: {
                    paymentMethodFormField: {
                      labels: {
                        payment_method_colon: {
                          value: "",
                          translations: { x: "" },
                        },
                      },
                    },
                    stripeCardFormField: {
                      labels: {
                        credit_or_debit_card_colon: {
                          value: "",
                          translations: { x: "" },
                        },
                      },
                    },
                  },
                  itemsDraggable: {
                    firstNameFormField: {
                      labels: {
                        first_name_colon: {
                          value: "",
                          translations: { x: "" },
                        },
                      },
                    },
                    lastNameFormField: {
                      labels: {
                        last_name_colon: { value: "", translations: { x: "" } },
                      },
                      visibility: !0,
                      required: !0,
                    },
                    emailFormField: {
                      labels: {
                        email_colon: { value: "", translations: { x: "" } },
                      },
                      visibility: !0,
                      required: this.$root.settings.general.requiredEmailField,
                    },
                    phoneFormField: {
                      labels: {
                        phone_colon: { value: "", translations: { x: "" } },
                      },
                      visibility: !0,
                      required:
                        this.$root.settings.general.requiredPhoneNumberField,
                    },
                  },
                },
              },
              congratulationsForm: {
                event: {
                  itemsStatic: {
                    congratulationsHeadingFormField: {
                      labels: {
                        congratulations: { value: "", translations: { x: "" } },
                      },
                      visibility: !0,
                    },
                    congratulationsImageFormField: { visibility: !0 },
                    congratulationsMessagesFormField: {
                      labels: {
                        booking_completed_approved: {
                          value: "",
                          translations: { x: "" },
                        },
                        booking_completed_pending: {
                          value: "",
                          translations: { x: "" },
                        },
                      },
                      visibility: !0,
                    },
                    addToCalendarFormField: { addToCalendarVisibility: !0 },
                  },
                },
              },
            },
            catalogForm: {
              catalogListForm: {
                globalSettings: {
                  formBackgroundColor: "#ffffff",
                  formTextColor: "#354052",
                },
                labels: {
                  categories: {
                    value: "",
                    translations: { x: "" },
                    visibility: !0,
                  },
                  services_lower: {
                    value: "",
                    translations: { x: "" },
                    visibility: !0,
                  },
                },
                parts: { service_images_thumbs: { visibility: !0 } },
              },
              categoryListForm: {
                globalSettings: {
                  formBackgroundColor: "#ffffff",
                  formTextColor: "#354052",
                },
                labels: {
                  back: { value: "", translations: { x: "" } },
                  view_more: { value: "", translations: { x: "" } },
                  price_colon: { value: "", translations: { x: "" } },
                  services: { value: "", translations: { x: "" } },
                  package: { value: "", translations: { x: "" } },
                  package_discount_text: { value: "", translations: { x: "" } },
                },
                parts: {
                  service_badge: { visibility: !0 },
                  service_price: { visibility: !0 },
                  service_employees_list: { visibility: !0 },
                  package_badge: { visibility: !0 },
                  package_price: { visibility: !0 },
                  package_services_list: { visibility: !0 },
                },
              },
              categoryServiceForm: {
                globalSettings: {
                  formBackgroundColor: "#ffffff",
                  formTextColor: "#354052",
                },
                labels: {
                  capacity_colon: { value: "", translations: { x: "" } },
                  duration_colon: { value: "", translations: { x: "" } },
                  description: { value: "", translations: { x: "" } },
                  service_info: { value: "", translations: { x: "" } },
                  category_colon: { value: "", translations: { x: "" } },
                  extras: { value: "", translations: { x: "" } },
                  price_colon: { value: "", translations: { x: "" } },
                  maximum_quantity_colon: {
                    value: "",
                    translations: { x: "" },
                  },
                  description_colon: { value: "", translations: { x: "" } },
                  employees: { value: "", translations: { x: "" } },
                },
                parts: {
                  capacity_colon: { visibility: !0 },
                  duration_colon: { visibility: !0 },
                  description: { visibility: !0 },
                  service_info: { visibility: !0 },
                  extras: { visibility: !0 },
                  employees: { visibility: !0 },
                },
              },
              categoryPackageForm: {
                globalSettings: {
                  formBackgroundColor: "#ffffff",
                  formTextColor: "#354052",
                },
                parts: {
                  package_rules_description: { visibility: !0 },
                  selected_services: { visibility: !0 },
                },
              },
              selectServiceForm: {
                globalSettings: {
                  formBackgroundColor: "#ffffff",
                  formTextColor: "#354052",
                  formInputColor: "#ffffff",
                  formInputTextColor: "#354052",
                  formDropdownColor: "#ffffff",
                  formDropdownTextColor: "#354052",
                },
                itemsStatic: {
                  serviceHeadingFormField: {
                    labels: {
                      book_appointment: { value: "", translations: { x: "" } },
                    },
                    visibility: !0,
                  },
                },
                itemsDraggable: {
                  locationFormField: {
                    labels: {
                      locations: { value: "", translations: { x: "" } },
                    },
                    visibility: !0,
                    required: !1,
                  },
                  employeeFormField: {
                    labels: {
                      employee: { value: "", translations: { x: "" } },
                      any_employee: { value: "", translations: { x: "" } },
                    },
                    visibility: !0,
                    required: !1,
                    anyEmployeeVisible: !0,
                  },
                  bringingFormField: {
                    labels: {
                      bringing_anyone_with_you: {
                        value: "",
                        translations: { x: "" },
                      },
                      number_of_additional_persons: {
                        value: "",
                        translations: { x: "" },
                      },
                    },
                  },
                  addExtraFormField: {
                    labels: {
                      add_extra: { value: "", translations: { x: "" } },
                      extra_colon: { value: "", translations: { x: "" } },
                      qty_colon: { value: "", translations: { x: "" } },
                      duration_colon: { value: "", translations: { x: "" } },
                      price_colon: { value: "", translations: { x: "" } },
                    },
                    visibility: !0,
                  },
                },
              },
              calendarDateTimeForm: {
                globalSettings: {
                  formTextColor: "#ffffff",
                  formGradientColor1: "#1A84EE",
                  formGradientColor2: "#0454A2",
                  formGradientAngle: 135,
                },
                itemsStatic: {
                  timeZoneFormField: { visibility: !1 },
                  calendarHeadingFormField: {
                    labels: {
                      pick_date_and_time: {
                        value: "",
                        translations: { x: "" },
                      },
                    },
                    visibility: !0,
                  },
                  calendarAppointmentFormField: { endDateVisibility: !0 },
                  recurringSwitchFormField: {
                    labels: {
                      recurring_active: { value: "", translations: { x: "" } },
                    },
                    visibility: !0,
                  },
                },
              },
              recurringSetupForm: {
                globalSettings: {
                  formTextColor: "#ffffff",
                  formGradientColor1: "#1A84EE",
                  formGradientColor2: "#0454A2",
                  formGradientAngle: 135,
                  formInputColor: "rgba(0, 0, 0, 0)",
                  formInputTextColor: "#ffffff",
                  formDropdownColor: "#ffffff",
                  formDropdownTextColor: "#354052",
                },
                itemsStatic: {
                  recurringSetupHeadingFormField: {
                    labels: {
                      recurring_active: { value: "", translations: { x: "" } },
                    },
                    visibility: !0,
                  },
                  recurringSettingsFormField: {
                    labels: {
                      recurring_repeat: { value: "", translations: { x: "" } },
                      recurring_every: { value: "", translations: { x: "" } },
                      recurring_on: { value: "", translations: { x: "" } },
                      recurring_until: { value: "", translations: { x: "" } },
                      recurring_times: { value: "", translations: { x: "" } },
                    },
                  },
                },
              },
              recurringDatesForm: {
                globalSettings: {
                  formBackgroundColor: "#ffffff",
                  formTextColor: "#354052",
                  formInputColor: "#ffffff",
                  formInputTextColor: "#354052",
                  formDropdownColor: "#ffffff",
                  formDropdownTextColor: "#354052",
                },
                itemsStatic: {
                  recurringDatesHeadingFormField: {
                    labels: {
                      recurring_appointments: {
                        value: "",
                        translations: { x: "" },
                      },
                      recurring_edit: { value: "", translations: { x: "" } },
                    },
                    visibility: !0,
                  },
                  recurringInfoFormField: {
                    labels: {
                      date: { value: "", translations: { x: "" } },
                      time: { value: "", translations: { x: "" } },
                    },
                  },
                },
              },
              packageSetupForm: {
                globalSettings: {
                  formTextColor: "#ffffff",
                  formGradientColor1: "#1A84EE",
                  formGradientColor2: "#0454A2",
                  formGradientAngle: 135,
                  formInputColor: "rgba(0, 0, 0, 0.1)",
                  formInputTextColor: "#ffffff",
                  formDropdownColor: "#ffffff",
                  formDropdownTextColor: "#354052",
                },
                itemsStatic: {
                  packageEmployeeFormField: {
                    labels: {
                      employee: { value: "", translations: { x: "" } },
                      any_employee: { value: "", translations: { x: "" } },
                    },
                    anyEmployeeVisible: !0,
                  },
                  packageLocationFormField: {
                    labels: {
                      location: { value: "", translations: { x: "" } },
                    },
                  },
                  packageRulesFormField: {
                    labels: {
                      package_min_book: { value: "", translations: { x: "" } },
                      package_min_book_plural: {
                        value: "",
                        translations: { x: "" },
                      },
                    },
                  },
                  packageCalendarFormField: {
                    labels: {
                      no_selected_slot_requirements: {
                        value: "",
                        translations: { x: "" },
                      },
                    },
                    endDateVisibility: !0,
                    timeZoneVisibility: !0,
                  },
                },
              },
              packageListForm: {
                globalSettings: {
                  formBackgroundColor: "#ffffff",
                  formTextColor: "#354052",
                },
                itemsStatic: {
                  packageListFormField: {
                    labels: {
                      appointments: { value: "", translations: { x: "" } },
                      appointment: { value: "", translations: { x: "" } },
                      date: { value: "", translations: { x: "" } },
                      time: { value: "", translations: { x: "" } },
                      employee: { value: "", translations: { x: "" } },
                      location: { value: "", translations: { x: "" } },
                    },
                  },
                },
              },
              confirmBookingForm: {
                appointment: {
                  globalSettings: {
                    formBackgroundColor: "#ffffff",
                    formTextColor: "#354052",
                    formInputColor: "#ffffff",
                    formInputTextColor: "#354052",
                    formDropdownColor: "#ffffff",
                    formDropdownTextColor: "#354052",
                  },
                  itemsStatic: {
                    confirmServiceHeadingFormField: { visibility: !0 },
                    confirmHeadingDataFormField: {
                      labels: {
                        employee: { value: "", translations: { x: "" } },
                        date_colon: { value: "", translations: { x: "" } },
                        time_colon: { value: "", translations: { x: "" } },
                        location_colon: { value: "", translations: { x: "" } },
                      },
                      visibility: !0,
                    },
                    recurringStringFormField: {
                      labels: {
                        recurring_active: {
                          value: "",
                          translations: { x: "" },
                        },
                      },
                      visibility: !0,
                    },
                    paymentMethodFormField: {
                      labels: {
                        payment_method_colon: {
                          value: "",
                          translations: { x: "" },
                        },
                      },
                    },
                    stripeCardFormField: {
                      labels: {
                        credit_or_debit_card_colon: {
                          value: "",
                          translations: { x: "" },
                        },
                      },
                    },
                  },
                  itemsDraggable: {
                    firstNameFormField: {
                      labels: {
                        first_name_colon: {
                          value: "",
                          translations: { x: "" },
                        },
                      },
                    },
                    lastNameFormField: {
                      labels: {
                        last_name_colon: { value: "", translations: { x: "" } },
                      },
                      visibility: !0,
                      required: !0,
                    },
                    emailFormField: {
                      labels: {
                        email_colon: { value: "", translations: { x: "" } },
                      },
                      visibility: !0,
                      required: this.$root.settings.general.requiredEmailField,
                    },
                    phoneFormField: {
                      labels: {
                        phone_colon: { value: "", translations: { x: "" } },
                      },
                      visibility: !0,
                      required:
                        this.$root.settings.general.requiredPhoneNumberField,
                    },
                  },
                },
                package: {
                  globalSettings: {
                    formBackgroundColor: "#ffffff",
                    formTextColor: "#354052",
                    formInputColor: "#ffffff",
                    formInputTextColor: "#354052",
                    formDropdownColor: "#ffffff",
                    formDropdownTextColor: "#354052",
                  },
                  itemsStatic: {
                    paymentMethodFormField: {
                      labels: {
                        payment_method_colon: {
                          value: "",
                          translations: { x: "" },
                        },
                      },
                    },
                    stripeCardFormField: {
                      labels: {
                        credit_or_debit_card_colon: {
                          value: "",
                          translations: { x: "" },
                        },
                      },
                    },
                  },
                  itemsDraggable: {
                    firstNameFormField: {
                      labels: {
                        first_name_colon: {
                          value: "",
                          translations: { x: "" },
                        },
                      },
                    },
                    lastNameFormField: {
                      labels: {
                        last_name_colon: { value: "", translations: { x: "" } },
                      },
                      visibility: !0,
                      required: !0,
                    },
                    emailFormField: {
                      labels: {
                        email_colon: { value: "", translations: { x: "" } },
                      },
                      visibility: !0,
                      required: this.$root.settings.general.requiredEmailField,
                    },
                    phoneFormField: {
                      labels: {
                        phone_colon: { value: "", translations: { x: "" } },
                      },
                      visibility: !0,
                      required:
                        this.$root.settings.general.requiredPhoneNumberField,
                    },
                  },
                },
              },
              congratulationsForm: {
                appointment: {
                  globalSettings: {
                    formBackgroundColor: "#ffffff",
                    formTextColor: "#354052",
                    formInputColor: "#ffffff",
                    formInputTextColor: "#354052",
                    formDropdownColor: "#ffffff",
                    formDropdownTextColor: "#354052",
                    formImageColor: "#1A84EE",
                  },
                  itemsStatic: {
                    congratulationsHeadingFormField: {
                      labels: {
                        congratulations: { value: "", translations: { x: "" } },
                      },
                      visibility: !0,
                    },
                    congratulationsImageFormField: { visibility: !0 },
                    congratulationsMessagesFormField: {
                      labels: {
                        booking_completed_approved: {
                          value: "",
                          translations: { x: "" },
                        },
                        booking_completed_pending: {
                          value: "",
                          translations: { x: "" },
                        },
                      },
                      visibility: !0,
                    },
                    addToCalendarFormField: { addToCalendarVisibility: !0 },
                  },
                },
                package: {
                  globalSettings: {
                    formBackgroundColor: "#ffffff",
                    formTextColor: "#354052",
                    formInputColor: "#ffffff",
                    formInputTextColor: "#354052",
                    formDropdownColor: "#ffffff",
                    formDropdownTextColor: "#354052",
                    formImageColor: "#1A84EE",
                  },
                  itemsStatic: {
                    congratulationsHeadingFormField: {
                      labels: {
                        congratulations: { value: "", translations: { x: "" } },
                      },
                      visibility: !0,
                    },
                    congratulationsImageFormField: { visibility: !0 },
                    congratulationsMessagesFormField: {
                      labels: {
                        booking_completed_approved: {
                          value: "",
                          translations: { x: "" },
                        },
                        booking_completed_pending: {
                          value: "",
                          translations: { x: "" },
                        },
                      },
                      visibility: !0,
                    },
                    addToCalendarFormField: { addToCalendarVisibility: !0 },
                  },
                },
              },
            },
          },
        };
      },
      methods: {
        getTranslatedForms: function (e) {
          var t = this,
            o = this.$root.settings.customization.forms
              ? this.$root.settings.customization.forms
              : this.defaultFormsData,
            a = window.localeLanguage[0];
          return (
            Object.keys(o[e]).forEach(function (i) {
              "labels" in o[e][i]
                ? t.getTranslatedLabels(o[e][i], a)
                : "confirmBookingForm" !== i &&
                  "globalSettings" !== i &&
                  "congratulationsForm" !== i
                ? (o[e][i] = t.getTranslatedFormScreen(o[e][i], e, i, a))
                : ("confirmBookingForm" !== i && "congratulationsForm" !== i) ||
                  Object.keys(o[e][i]).forEach(function (n) {
                    o[e][i][n] = t.getTranslatedFormScreen(o[e][i][n], e, i, a);
                  });
            }),
            o
          );
        },
        getTranslatedFormScreen: function (e, t, o, a) {
          var i = this;
          return (
            ["itemsDraggable", "itemsStatic"].forEach(function (t) {
              t in e &&
                Object.keys(e[t]).forEach(function (o) {
                  i.getTranslatedLabels(e[t][o], a);
                });
            }),
            e
          );
        },
        getTranslatedLabels: function (e, t) {
          "labels" in e &&
            Object.keys(e.labels).forEach(function (o) {
              "translations" in e.labels[o] &&
                t in e.labels[o].translations &&
                (e.labels[o].value = e.labels[o].translations[t]);
            });
        },
        rgbaToHex: function (e) {
          if (e.indexOf("#") < 0) {
            var t = e.indexOf(",") > -1 ? "," : " ";
            for (var o in ((e = e.substr(5).split(")")[0].split(t)).indexOf(
              "/"
            ) > -1 && e.splice(3, 1),
            e)) {
              var a = e[o];
              if (a.indexOf("%") > -1) {
                var i = a.substr(0, a.length - 1) / 100;
                e[o] = o < 3 ? Math.round(255 * i) : i;
              }
            }
            var n = (+e[0]).toString(16),
              s = (+e[1]).toString(16),
              r = (+e[2]).toString(16),
              l = Math.round(255 * +e[3]).toString(16);
            return (
              1 === n.length && (n = "0" + n),
              1 === s.length && (s = "0" + s),
              1 === r.length && (r = "0" + r),
              1 === l.length && (l = "0" + l),
              "#" + n + s + r + l
            );
          }
          return e;
        },
        oppositeColor: function (e) {
          var t = this.rgbaToHex(e);
          return (
            (t = t.substring(1).slice(0, 6)),
            (t = parseInt(t, 16)),
            (t =
              "#" +
              (t = ("000000" + (t = (t ^= 16777215).toString(16))).slice(-6)))
          );
        },
      },
    };
  },
  700: function (e, t, o) {
    "use strict";
    t.a = {
      data: function () {
        return {
          countries: [
            {
              id: 1,
              iso: "af",
              nicename: "Afghanistan",
              phonecode: 93,
              format: "070 123 4567",
            },
            {
              id: 2,
              iso: "al",
              nicename: "Albania",
              phonecode: 355,
              format: "066 123 4567",
            },
            {
              id: 3,
              iso: "dz",
              nicename: "Algeria",
              phonecode: 213,
              format: "0551 23 45 67",
            },
            {
              id: 4,
              iso: "as",
              nicename: "American Samoa",
              phonecode: 1,
              format: "(684) 733 1234",
            },
            {
              id: 5,
              iso: "ad",
              nicename: "Andorra",
              phonecode: 376,
              format: "312 345",
            },
            {
              id: 6,
              iso: "ao",
              nicename: "Angola",
              phonecode: 244,
              format: "923 123 456",
            },
            {
              id: 7,
              iso: "ai",
              nicename: "Anguilla",
              phonecode: 1,
              format: "(264) 235 1234",
            },
            {
              id: 8,
              iso: "ag",
              nicename: "Antigua and Barbuda",
              phonecode: 1,
              format: "(268) 464 1234",
            },
            {
              id: 9,
              iso: "ar",
              nicename: "Argentina",
              phonecode: 54,
              format: "9 (11) 1234 567",
            },
            {
              id: 10,
              iso: "am",
              nicename: "Armenia",
              phonecode: 374,
              format: "077 123 456",
            },
            {
              id: 11,
              iso: "aw",
              nicename: "Aruba",
              phonecode: 297,
              format: "560 1234",
            },
            {
              id: 12,
              iso: "au",
              nicename: "Australia",
              phonecode: 61,
              format: "0412 345 678",
            },
            {
              id: 13,
              iso: "at",
              nicename: "Austria",
              phonecode: 43,
              format: "0664 123456",
            },
            {
              id: 14,
              iso: "az",
              nicename: "Azerbaijan",
              phonecode: 994,
              format: "040 123 45 67",
            },
            {
              id: 15,
              iso: "bs",
              nicename: "Bahamas",
              phonecode: 1,
              format: "(242) 359 1234",
            },
            {
              id: 16,
              iso: "bh",
              nicename: "Bahrain",
              phonecode: 973,
              format: "3600 1234",
            },
            {
              id: 17,
              iso: "bd",
              nicename: "Bangladesh",
              phonecode: 880,
              format: "018 1234 5678",
            },
            {
              id: 18,
              iso: "bb",
              nicename: "Barbados",
              phonecode: 1,
              format: "(246) 250 1234",
            },
            {
              id: 19,
              iso: "by",
              nicename: "Belarus",
              phonecode: 375,
              format: "029 491 1911",
            },
            {
              id: 20,
              iso: "be",
              nicename: "Belgium",
              phonecode: 32,
              format: "0470 123 456",
            },
            {
              id: 21,
              iso: "bz",
              nicename: "Belize",
              phonecode: 501,
              format: "622 1234",
            },
            {
              id: 22,
              iso: "bj",
              nicename: "Benin",
              phonecode: 229,
              format: "90 123 456",
            },
            {
              id: 23,
              iso: "bm",
              nicename: "Bermuda",
              phonecode: 1,
              format: "(441) 370 1234",
            },
            {
              id: 24,
              iso: "bt",
              nicename: "Bhutan",
              phonecode: 975,
              format: "17 123 456",
            },
            {
              id: 25,
              iso: "bo",
              nicename: "Bolivia",
              phonecode: 591,
              format: "7 123 4567",
            },
            {
              id: 26,
              iso: "ba",
              nicename: "Bosnia and Herzegovina",
              phonecode: 387,
              format: "061 123 456",
            },
            {
              id: 27,
              iso: "bw",
              nicename: "Botswana",
              phonecode: 267,
              format: "71 123 456",
            },
            {
              id: 28,
              iso: "br",
              nicename: "Brazil",
              phonecode: 55,
              format: "(11) 9 1234 5678",
            },
            {
              id: 29,
              iso: "vg",
              nicename: "British Virgin Islands",
              phonecode: 1,
              format: "(284) 300 1234",
            },
            {
              id: 30,
              iso: "bn",
              nicename: "Brunei",
              phonecode: 673,
              format: "712 3456",
            },
            {
              id: 31,
              iso: "bg",
              nicename: "Bulgaria",
              phonecode: 359,
              format: "087 123 4567",
            },
            {
              id: 32,
              iso: "bf",
              nicename: "Burkina Faso",
              phonecode: 226,
              format: "70 12 34 56",
            },
            {
              id: 33,
              iso: "bi",
              nicename: "Burundi",
              phonecode: 257,
              format: "79 56 12 34",
            },
            {
              id: 34,
              iso: "kh",
              nicename: "Cambodia",
              phonecode: 855,
              format: "091 234 567",
            },
            {
              id: 35,
              iso: "cm",
              nicename: "Cameroon",
              phonecode: 237,
              format: "6 71 23 45 67",
            },
            {
              id: 36,
              iso: "ca",
              nicename: "Canada",
              phonecode: 1,
              format: "(204) 123 4567",
            },
            {
              id: 37,
              iso: "cv",
              nicename: "Cape Verde",
              phonecode: 238,
              format: "991 12 34",
            },
            {
              id: 38,
              iso: "ky",
              nicename: "Cayman Islands",
              phonecode: 1,
              format: "(345) 323 1234",
            },
            {
              id: 39,
              iso: "cf",
              nicename: "Central African Republic",
              phonecode: 236,
              format: "70 01 23 45",
            },
            {
              id: 40,
              iso: "td",
              nicename: "Chad",
              phonecode: 235,
              format: "63 01 23 45",
            },
            {
              id: 41,
              iso: "cl",
              nicename: "Chile",
              phonecode: 56,
              format: "09 6123 4567",
            },
            {
              id: 42,
              iso: "cn",
              nicename: "China",
              phonecode: 86,
              format: "131 2345 6789",
            },
            {
              id: 43,
              iso: "co",
              nicename: "Colombia",
              phonecode: 57,
              format: "321 1234567",
            },
            {
              id: 44,
              iso: "km",
              nicename: "Comoros",
              phonecode: 269,
              format: "321 23 45",
            },
            {
              id: 45,
              iso: "cd",
              nicename: "Congo (DRC)",
              phonecode: 243,
              format: "0991 234 567",
            },
            {
              id: 46,
              iso: "cg",
              nicename: "Congo (Republic)",
              phonecode: 242,
              format: "06 123 4567",
            },
            {
              id: 47,
              iso: "ck",
              nicename: "Cook Islands",
              phonecode: 682,
              format: "71 234",
            },
            {
              id: 48,
              iso: "cr",
              nicename: "Costa Rica",
              phonecode: 506,
              format: "8312 3456",
            },
            {
              id: 49,
              iso: "ci",
              nicename: "Cote D'Ivoire",
              phonecode: 225,
              format: "01 23 45 67",
            },
            {
              id: 50,
              iso: "hr",
              nicename: "Croatia",
              phonecode: 385,
              format: "091 234 5678",
            },
            {
              id: 51,
              iso: "cu",
              nicename: "Cuba",
              phonecode: 53,
              format: "05 1234567",
            },
            {
              id: 57,
              iso: "cy",
              nicename: "Cyprus",
              phonecode: 357,
              format: "96 123456",
            },
            {
              id: 58,
              iso: "cz",
              nicename: "Czech Republic",
              phonecode: 420,
              format: "601 123 456",
            },
            {
              id: 59,
              iso: "dk",
              nicename: "Denmark",
              phonecode: 45,
              format: "20 12 34 56",
            },
            {
              id: 60,
              iso: "dj",
              nicename: "Djibouti",
              phonecode: 253,
              format: "77 83 10 01",
            },
            {
              id: 61,
              iso: "dm",
              nicename: "Dominica",
              phonecode: 1,
              format: "(767) 225 1234",
            },
            {
              id: 62,
              iso: "do",
              nicename: "Dominican Republic",
              phonecode: 1,
              format: "(809) 234 5678",
            },
            {
              id: 63,
              iso: "ec",
              nicename: "Ecuador",
              phonecode: 593,
              format: "099 123 4567",
            },
            {
              id: 64,
              iso: "eg",
              nicename: "Egypt",
              phonecode: 20,
              format: "0100 123 4567",
            },
            {
              id: 65,
              iso: "sv",
              nicename: "El Salvador",
              phonecode: 503,
              format: "7012 3456",
            },
            {
              id: 66,
              iso: "gq",
              nicename: "Equatorial Guinea",
              phonecode: 240,
              format: "222 123 456",
            },
            {
              id: 67,
              iso: "er",
              nicename: "Eritrea",
              phonecode: 291,
              format: "07 123 456",
            },
            {
              id: 68,
              iso: "ee",
              nicename: "Estonia",
              phonecode: 372,
              format: "5123 4567",
            },
            {
              id: 69,
              iso: "et",
              nicename: "Ethiopia",
              phonecode: 251,
              format: "091 123 4567",
            },
            {
              id: 70,
              iso: "fk",
              nicename: "Falkland Islands (Malvinas)",
              phonecode: 500,
              format: "51234",
            },
            {
              id: 71,
              iso: "fo",
              nicename: "Faroe Islands",
              phonecode: 298,
              format: "211234",
            },
            {
              id: 72,
              iso: "fj",
              nicename: "Fiji",
              phonecode: 679,
              format: "701 2345",
            },
            {
              id: 73,
              iso: "fi",
              nicename: "Finland",
              phonecode: 358,
              format: "041 2345678",
            },
            {
              id: 74,
              iso: "fr",
              nicename: "France",
              phonecode: 33,
              format: "06 12 34 56 78",
            },
            {
              id: 75,
              iso: "gf",
              nicename: "French Guiana",
              phonecode: 594,
              format: "0694 20 12 34",
            },
            {
              id: 76,
              iso: "pf",
              nicename: "French Polynesia",
              phonecode: 689,
              format: "87 12 34 56",
            },
            {
              id: 77,
              iso: "ga",
              nicename: "Gabon",
              phonecode: 241,
              format: "06 03 12 34",
            },
            {
              id: 78,
              iso: "gm",
              nicename: "Gambia",
              phonecode: 220,
              format: "301 2345",
            },
            {
              id: 79,
              iso: "ge",
              nicename: "Georgia",
              phonecode: 995,
              format: "555 12 34 56",
            },
            {
              id: 80,
              iso: "de",
              nicename: "Germany",
              phonecode: 49,
              format: "01512 3456789",
            },
            {
              id: 81,
              iso: "gh",
              nicename: "Ghana",
              phonecode: 233,
              format: "023 123 4567",
            },
            {
              id: 82,
              iso: "gi",
              nicename: "Gibraltar",
              phonecode: 350,
              format: "57123456",
            },
            {
              id: 83,
              iso: "gr",
              nicename: "Greece",
              phonecode: 30,
              format: "691 234 5678",
            },
            {
              id: 84,
              iso: "gl",
              nicename: "Greenland",
              phonecode: 299,
              format: "22 12 34",
            },
            {
              id: 85,
              iso: "gp",
              nicename: "Guadeloupe",
              phonecode: 590,
              format: "690 123 456",
            },
            {
              id: 87,
              iso: "gu",
              nicename: "Guam",
              phonecode: 1,
              format: "(671) 300 1234",
            },
            {
              id: 88,
              iso: "gt",
              nicename: "Guatemala",
              phonecode: 502,
              format: "5123 4567",
            },
            {
              id: 89,
              iso: "gg",
              nicename: "Guernsey",
              phonecode: 44,
              format: "07781 123456",
            },
            {
              id: 90,
              iso: "gn",
              nicename: "Guinea",
              phonecode: 224,
              format: "601 12 34 56",
            },
            {
              id: 91,
              iso: "gw",
              nicename: "Guinea-Bissau",
              phonecode: 245,
              format: "955 012 345",
            },
            {
              id: 92,
              iso: "gy",
              nicename: "Guyana",
              phonecode: 592,
              format: "609 1234",
            },
            {
              id: 93,
              iso: "ht",
              nicename: "Haiti",
              phonecode: 509,
              format: "34 10 1234",
            },
            {
              id: 94,
              iso: "hn",
              nicename: "Honduras",
              phonecode: 504,
              format: "9123 4567",
            },
            {
              id: 95,
              iso: "hk",
              nicename: "Hong Kong",
              phonecode: 852,
              format: "5123 4567",
            },
            {
              id: 96,
              iso: "hu",
              nicename: "Hungary",
              phonecode: 36,
              format: "(20) 123 4567",
            },
            {
              id: 97,
              iso: "is",
              nicename: "Iceland",
              phonecode: 354,
              format: "611 1234",
            },
            {
              id: 98,
              iso: "in",
              nicename: "India",
              phonecode: 91,
              format: "099876 54321",
            },
            {
              id: 99,
              iso: "id",
              nicename: "Indonesia",
              phonecode: 62,
              format: "0812 345 678",
            },
            {
              id: 100,
              iso: "ir",
              nicename: "Iran",
              phonecode: 98,
              format: "0912 345 6789",
            },
            {
              id: 101,
              iso: "iq",
              nicename: "Iraq",
              phonecode: 964,
              format: "0791 234 5678",
            },
            {
              id: 102,
              iso: "ie",
              nicename: "Ireland",
              phonecode: 353,
              format: "085 012 3456",
            },
            {
              id: 103,
              iso: "im",
              nicename: "Isle of Man",
              phonecode: 44,
              format: "07924 123456",
            },
            {
              id: 104,
              iso: "il",
              nicename: "Israel",
              phonecode: 972,
              format: "050 123 4567",
            },
            {
              id: 105,
              iso: "it",
              nicename: "Italy",
              phonecode: 39,
              format: "312 345 6789",
            },
            {
              id: 106,
              iso: "jm",
              nicename: "Jamaica",
              phonecode: 1,
              format: "(876) 210 1234",
            },
            {
              id: 107,
              iso: "jp",
              nicename: "Japan",
              phonecode: 81,
              format: "090 1234 5678",
            },
            {
              id: 108,
              iso: "je",
              nicename: "Jersey",
              phonecode: 44,
              format: "07797 123456",
            },
            {
              id: 109,
              iso: "jo",
              nicename: "Jordan",
              phonecode: 962,
              format: "07 9012 3456",
            },
            {
              id: 110,
              iso: "kz",
              nicename: "Kazakhstan",
              phonecode: 7,
              format: "(771) 123 4567",
            },
            {
              id: 111,
              iso: "ke",
              nicename: "Kenya",
              phonecode: 254,
              format: "0712 123456",
            },
            {
              id: 112,
              iso: "ki",
              nicename: "Kiribati",
              phonecode: 686,
              format: "72012345",
            },
            {
              id: 241,
              iso: "xk",
              nicename: "Kosovo",
              phonecode: 383,
              format: "044 1234567",
            },
            {
              id: 113,
              iso: "kw",
              nicename: "Kuwait",
              phonecode: 965,
              format: "500 12345",
            },
            {
              id: 114,
              iso: "kg",
              nicename: "Kyrgyzstan",
              phonecode: 996,
              format: "0700 123 456",
            },
            {
              id: 115,
              iso: "la",
              nicename: "Laos",
              phonecode: 856,
              format: "020 23 123 456",
            },
            {
              id: 116,
              iso: "lv",
              nicename: "Latvia",
              phonecode: 371,
              format: "21 234 567",
            },
            {
              id: 117,
              iso: "lb",
              nicename: "Lebanon",
              phonecode: 961,
              format: "71 123 456",
            },
            {
              id: 118,
              iso: "ls",
              nicename: "Lesotho",
              phonecode: 266,
              format: "5012 3456",
            },
            {
              id: 119,
              iso: "lr",
              nicename: "Liberia",
              phonecode: 231,
              format: "077 012 3456",
            },
            {
              id: 120,
              iso: "ly",
              nicename: "Libya",
              phonecode: 218,
              format: "091 2345678",
            },
            {
              id: 121,
              iso: "li",
              nicename: "Liechtenstein",
              phonecode: 423,
              format: "660 234 567",
            },
            {
              id: 122,
              iso: "lt",
              nicename: "Lithuania",
              phonecode: 370,
              format: "612 345 67",
            },
            {
              id: 123,
              iso: "lu",
              nicename: "Luxembourg",
              phonecode: 352,
              format: "628 123 456",
            },
            {
              id: 124,
              iso: "mo",
              nicename: "Macao",
              phonecode: 853,
              format: "6612 3456",
            },
            {
              id: 125,
              iso: "mk",
              nicename: "Macedonia (FYROM)",
              phonecode: 389,
              format: "072 345 678",
            },
            {
              id: 126,
              iso: "mg",
              nicename: "Madagascar",
              phonecode: 261,
              format: "032 12 345 67",
            },
            {
              id: 127,
              iso: "mw",
              nicename: "Malawi",
              phonecode: 265,
              format: "0991 23 45 67",
            },
            {
              id: 128,
              iso: "my",
              nicename: "Malaysia",
              phonecode: 60,
              format: "012 345 6789",
            },
            {
              id: 129,
              iso: "mv",
              nicename: "Maldives",
              phonecode: 960,
              format: "771 2345",
            },
            {
              id: 130,
              iso: "ml",
              nicename: "Mali",
              phonecode: 223,
              format: "65 01 23 45",
            },
            {
              id: 131,
              iso: "mt",
              nicename: "Malta",
              phonecode: 356,
              format: "9696 1234",
            },
            {
              id: 132,
              iso: "mh",
              nicename: "Marshall Islands",
              phonecode: 692,
              format: "235 1234",
            },
            {
              id: 133,
              iso: "mq",
              nicename: "Martinique",
              phonecode: 596,
              format: "0696 20 12 34",
            },
            {
              id: 134,
              iso: "mr",
              nicename: "Mauritania",
              phonecode: 222,
              format: "22 12 34 56",
            },
            {
              id: 135,
              iso: "mu",
              nicename: "Mauritius",
              phonecode: 230,
              format: "5251 2345",
            },
            {
              id: 136,
              iso: "yt",
              nicename: "Mayotte",
              phonecode: 269,
              format: "0639 12 34 56",
            },
            {
              id: 137,
              iso: "mx",
              nicename: "Mexico",
              phonecode: 52,
              format: "044 222 123 4567",
            },
            {
              id: 138,
              iso: "fm",
              nicename: "Micronesia",
              phonecode: 691,
              format: "350 1234",
            },
            {
              id: 139,
              iso: "md",
              nicename: "Moldova",
              phonecode: 373,
              format: "0621 12 345",
            },
            {
              id: 140,
              iso: "mc",
              nicename: "Monaco",
              phonecode: 377,
              format: "06 12 34 56 78",
            },
            {
              id: 141,
              iso: "mn",
              nicename: "Mongolia",
              phonecode: 976,
              format: "8812 3456",
            },
            {
              id: 142,
              iso: "me",
              nicename: "Montenegro",
              phonecode: 382,
              format: "067 622 901",
            },
            {
              id: 143,
              iso: "ms",
              nicename: "Montserrat",
              phonecode: 1,
              format: "(664) 492 3456",
            },
            {
              id: 144,
              iso: "ma",
              nicename: "Morocco",
              phonecode: 212,
              format: "0650 123456",
            },
            {
              id: 145,
              iso: "mz",
              nicename: "Mozambique",
              phonecode: 258,
              format: "82 123 4567",
            },
            {
              id: 146,
              iso: "mm",
              nicename: "Myanmar",
              phonecode: 95,
              format: "09 212 3456",
            },
            {
              id: 147,
              iso: "na",
              nicename: "Namibia",
              phonecode: 264,
              format: "081 123 4567",
            },
            {
              id: 149,
              iso: "np",
              nicename: "Nepal",
              phonecode: 977,
              format: "984 1234567",
            },
            {
              id: 150,
              iso: "nl",
              nicename: "Netherlands",
              phonecode: 31,
              format: "06 12345678",
            },
            {
              id: 151,
              iso: "nc",
              nicename: "New Caledonia",
              phonecode: 687,
              format: "75 12 34",
            },
            {
              id: 152,
              iso: "nz",
              nicename: "New Zealand",
              phonecode: 64,
              format: "021 123 4567",
            },
            {
              id: 153,
              iso: "ni",
              nicename: "Nicaragua",
              phonecode: 505,
              format: "8123 4567",
            },
            {
              id: 154,
              iso: "ne",
              nicename: "Niger",
              phonecode: 227,
              format: "93 12 34 56",
            },
            {
              id: 155,
              iso: "ng",
              nicename: "Nigeria",
              phonecode: 234,
              format: "0802 123 4567",
            },
            {
              id: 156,
              iso: "nu",
              nicename: "Niue",
              phonecode: 683,
              format: "1234",
            },
            {
              id: 157,
              iso: "nf",
              nicename: "Norfolk Island",
              phonecode: 672,
              format: "3 81234",
            },
            {
              id: 160,
              iso: "no",
              nicename: "Norway",
              phonecode: 47,
              format: "406 12 345",
            },
            {
              id: 161,
              iso: "om",
              nicename: "Oman",
              phonecode: 968,
              format: "9212 3456",
            },
            {
              id: 162,
              iso: "pk",
              nicename: "Pakistan",
              phonecode: 92,
              format: "0301 2345678",
            },
            {
              id: 163,
              iso: "pw",
              nicename: "Palau",
              phonecode: 680,
              format: "620 1234",
            },
            {
              id: 164,
              iso: "ps",
              nicename: "Palestine",
              phonecode: 970,
              format: "0599 123 456",
            },
            {
              id: 165,
              iso: "pa",
              nicename: "Panama",
              phonecode: 507,
              format: "6001 2345",
            },
            {
              id: 166,
              iso: "pg",
              nicename: "Papua New Guinea",
              phonecode: 675,
              format: "681 2345",
            },
            {
              id: 167,
              iso: "py",
              nicename: "Paraguay",
              phonecode: 595,
              format: "0961 456789",
            },
            {
              id: 168,
              iso: "pe",
              nicename: "Peru",
              phonecode: 51,
              format: "912 345 678",
            },
            {
              id: 169,
              iso: "ph",
              nicename: "Philippines",
              phonecode: 63,
              format: "0905 123 4567",
            },
            {
              id: 170,
              iso: "pl",
              nicename: "Poland",
              phonecode: 48,
              format: "512 345 678",
            },
            {
              id: 171,
              iso: "pt",
              nicename: "Portugal",
              phonecode: 351,
              format: "912 345 678",
            },
            {
              id: 172,
              iso: "pr",
              nicename: "Puerto Rico",
              phonecode: 1,
              format: "(787) 234 5678",
            },
            {
              id: 173,
              iso: "qa",
              nicename: "Qatar",
              phonecode: 974,
              format: "3312 3456",
            },
            {
              id: 174,
              iso: "re",
              nicename: "Réunion",
              phonecode: 262,
              format: "639 123456",
            },
            {
              id: 175,
              iso: "ro",
              nicename: "Romania",
              phonecode: 40,
              format: "0712 345 678",
            },
            {
              id: 176,
              iso: "ru",
              nicename: "Russia",
              phonecode: 7,
              format: "(912) 123 4567",
              priority: 1,
            },
            {
              id: 177,
              iso: "rw",
              nicename: "Rwanda",
              phonecode: 250,
              format: "0720 123 456",
            },
            {
              id: 180,
              iso: "kn",
              nicename: "Saint Kitts and Nevis",
              phonecode: 1,
              format: "(869) 765 2917",
            },
            {
              id: 181,
              iso: "lc",
              nicename: "Saint Lucia",
              phonecode: 1,
              format: "(758) 284 5678",
            },
            {
              id: 184,
              iso: "vc",
              nicename: "Saint Vincent and the Grenadines",
              phonecode: 1,
              format: "(784) 430 1234",
            },
            {
              id: 185,
              iso: "ws",
              nicename: "Samoa",
              phonecode: 684,
              format: "601234",
            },
            {
              id: 186,
              iso: "sm",
              nicename: "San Marino",
              phonecode: 378,
              format: "66 66 12 12",
            },
            {
              id: 187,
              iso: "st",
              nicename: "Sao Tome and Principe",
              phonecode: 239,
              format: "981 2345",
            },
            {
              id: 188,
              iso: "sa",
              nicename: "Saudi Arabia",
              phonecode: 966,
              format: "051 234 5678",
            },
            {
              id: 189,
              iso: "sn",
              nicename: "Senegal",
              phonecode: 221,
              format: "70 123 45 67",
            },
            {
              id: 190,
              iso: "rs",
              nicename: "Serbia",
              phonecode: 381,
              format: "060 1234567",
            },
            {
              id: 191,
              iso: "sc",
              nicename: "Seychelles",
              phonecode: 248,
              format: "2 510 123",
            },
            {
              id: 192,
              iso: "sl",
              nicename: "Sierra Leone",
              phonecode: 232,
              format: "(025) 123456",
            },
            {
              id: 193,
              iso: "sg",
              nicename: "Singapore",
              phonecode: 65,
              format: "8123 4567",
            },
            {
              id: 195,
              iso: "sk",
              nicename: "Slovakia",
              phonecode: 421,
              format: "0912 123 456",
            },
            {
              id: 196,
              iso: "si",
              nicename: "Slovenia",
              phonecode: 386,
              format: "031 234 567",
            },
            {
              id: 197,
              iso: "sb",
              nicename: "Solomon Islands",
              phonecode: 677,
              format: "74 21234",
            },
            {
              id: 198,
              iso: "so",
              nicename: "Somalia",
              phonecode: 252,
              format: "7 1123456",
            },
            {
              id: 199,
              iso: "za",
              nicename: "South Africa",
              phonecode: 27,
              format: "071 123 4567",
            },
            {
              id: 200,
              iso: "kr",
              nicename: "South Korea",
              phonecode: 82,
              format: "010 1234 567",
            },
            {
              id: 201,
              iso: "ss",
              nicename: "South Sudan",
              phonecode: 211,
              format: "0977 123 456",
            },
            {
              id: 202,
              iso: "es",
              nicename: "Spain",
              phonecode: 34,
              format: "612 34 56 78",
            },
            {
              id: 203,
              iso: "lk",
              nicename: "Sri Lanka",
              phonecode: 94,
              format: "071 234 5678",
            },
            {
              id: 204,
              iso: "sd",
              nicename: "Sudan",
              phonecode: 249,
              format: "091 123 1234",
            },
            {
              id: 205,
              iso: "sr",
              nicename: "Suriname",
              phonecode: 597,
              format: "741 2345",
            },
            {
              id: 207,
              iso: "sz",
              nicename: "Swaziland",
              phonecode: 268,
              format: "7612 3456",
            },
            {
              id: 208,
              iso: "se",
              nicename: "Sweden",
              phonecode: 46,
              format: "070 123 45 67",
            },
            {
              id: 209,
              iso: "ch",
              nicename: "Switzerland",
              phonecode: 41,
              format: "078 123 45 67",
            },
            {
              id: 210,
              iso: "sy",
              nicename: "Syria",
              phonecode: 963,
              format: "0944 567 890",
            },
            {
              id: 211,
              iso: "tw",
              nicename: "Taiwan",
              phonecode: 886,
              format: "0912 345 678",
            },
            {
              id: 212,
              iso: "tj",
              nicename: "Tajikistan",
              phonecode: 992,
              format: "917 123 456",
            },
            {
              id: 213,
              iso: "ty",
              nicename: "Tanzania",
              phonecode: 255,
              format: "740 123 456",
            },
            {
              id: 214,
              iso: "th",
              nicename: "Thailand",
              phonecode: 66,
              format: "081 234 5678",
            },
            {
              id: 215,
              iso: "tl",
              nicename: "Timor-Leste",
              phonecode: 670,
              format: "7721 2345",
            },
            {
              id: 216,
              iso: "tg",
              nicename: "Togo",
              phonecode: 228,
              format: "90 11 23 45",
            },
            {
              id: 218,
              iso: "to",
              nicename: "Tonga",
              phonecode: 676,
              format: "771 5123",
            },
            {
              id: 219,
              iso: "tt",
              nicename: "Trinidad and Tobago",
              phonecode: 868,
              format: "(868) 291 1234",
            },
            {
              id: 220,
              iso: "tn",
              nicename: "Tunisia",
              phonecode: 216,
              format: "20 123 456",
            },
            {
              id: 221,
              iso: "tr",
              nicename: "Turkey",
              phonecode: 90,
              format: "0501 234 56 78",
            },
            {
              id: 222,
              iso: "tm",
              nicename: "Turkmenistan",
              phonecode: 7370,
              format: "8 66 123456",
            },
            {
              id: 223,
              iso: "tc",
              nicename: "Turks and Caicos Islands",
              phonecode: 1,
              format: "(649) 231 1234",
            },
            {
              id: 224,
              iso: "tv",
              nicename: "Tuvalu",
              phonecode: 688,
              format: "901234",
            },
            {
              id: 225,
              iso: "ug",
              nicename: "Uganda",
              phonecode: 256,
              format: "0712 345678",
            },
            {
              id: 226,
              iso: "ua",
              nicename: "Ukraine",
              phonecode: 380,
              format: "039 123 4567",
            },
            {
              id: 227,
              iso: "ae",
              nicename: "United Arab Emirates",
              phonecode: 971,
              format: "050 123 4567",
            },
            {
              id: 228,
              iso: "gb",
              nicename: "United Kingdom",
              phonecode: 44,
              format: "07400 123456",
              priority: 1,
            },
            {
              id: 229,
              iso: "us",
              nicename: "United States",
              phonecode: 1,
              format: "(201) 555 0123",
              priority: 1,
            },
            {
              id: 230,
              iso: "uy",
              nicename: "Uruguay",
              phonecode: 598,
              format: "094 231 234",
            },
            {
              id: 231,
              iso: "uz",
              nicename: "Uzbekistan",
              phonecode: 998,
              format: "8 91 234 56 78",
            },
            {
              id: 232,
              iso: "vu",
              nicename: "Vanuatu",
              phonecode: 678,
              format: "591 2345",
            },
            {
              id: 234,
              iso: "ve",
              nicename: "Venezuela",
              phonecode: 58,
              format: "0412 1234567",
            },
            {
              id: 235,
              iso: "vn",
              nicename: "Vietnam",
              phonecode: 84,
              format: "091 234 56 78",
            },
            {
              id: 236,
              iso: "vi",
              nicename: "Virgin Islands, U.S.",
              phonecode: 1,
              format: "(340) 642 1234",
            },
            {
              id: 237,
              iso: "ye",
              nicename: "Yemen",
              phonecode: 967,
              format: "0712 345 678",
            },
            {
              id: 238,
              iso: "zm",
              nicename: "Zambia",
              phonecode: 260,
              format: "095 5123456",
            },
            {
              id: 239,
              iso: "zw",
              nicename: "Zimbabwe",
              phonecode: 263,
              format: "071 123 4567",
            },
            {
              id: 240,
              iso: "ax",
              nicename: "Åland Islands",
              phonecode: 358,
              format: "041 2345678",
            },
          ],
        };
      },
    };
  },
  703: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = o(700);
    t.default = {
      mixins: [a.a],
      template: "#phone-input",
      props: {
        savedPhone: { default: "", type: String },
        disabled: { default: !1, type: Boolean },
        countryPhoneIso: null,
        dropdownClass: { type: String, default: "" },
      },
      data: function () {
        return {
          input: "",
          phone: "",
          value: this.$root.settings.general.phoneDefaultCountryCode,
          format: "",
        };
      },
      mounted: function () {
        "" !== this.value
          ? this.savedPhone
            ? this.fillInputWithSavedPhone()
            : this.formatPhoneNumber()
          : this.savedPhone && this.fillInputWithSavedPhone();
      },
      methods: {
        onClear: function () {
          (this.value = ""),
            (this.phone = ""),
            this.$emit("phoneFormatted", this.phone, this.value);
        },
        changeCountry: function () {
          "" !== this.value && "" !== this.input && (this.input = ""),
            this.formatPhoneNumber();
        },
        formatPhoneNumber: function () {
          var e = this;
          if ("" !== this.value) {
            var t = this.countries.find(function (t) {
              return t.iso === e.value;
            });
            this.format = !0 === this.disabled ? "" : t.format;
          }
          var o = this.input;
          if (
            ("ar" === window.localeLanguage[0] &&
              (o = o.replace(/[٠-٩]/g, function (e) {
                return "٠١٢٣٤٥٦٧٨٩".indexOf(e);
              })),
            "" !== o)
          ) {
            if (o.startsWith("+")) {
              var a = parseInt(o.slice(1)),
                i = this.countries.filter(function (e) {
                  return e.phonecode === a;
                });
              if (i.length) {
                var n = null;
                1 === a
                  ? (n = i.find(function (e) {
                      return 229 === e.id;
                    }))
                  : 44 === a
                  ? (n = i.find(function (e) {
                      return 228 === e.id;
                    }))
                  : 7 === a &&
                    (n = i.find(function (e) {
                      return 176 === e.id;
                    })),
                  (void 0 !== n && null !== n) || (n = i[0]),
                  (this.value = n.iso);
              }
              this.phone = o;
            } else
              this.phone =
                void 0 !== t
                  ? !0 === o.startsWith("0")
                    ? "+" + t.phonecode + o.slice(1).replace(/\D/g, "")
                    : "+" + t.phonecode + o.replace(/\D/g, "")
                  : o;
            this.$emit("phoneFormatted", this.phone, this.value);
          } else
            (this.phone = o),
              this.$emit("phoneFormatted", this.phone, this.value);
        },
        fillInputWithSavedPhone: function () {
          var e = this,
            t = null;
          null !== this.countryPhoneIso &&
            void 0 ===
              (t = this.countries.find(function (t) {
                return t.iso === e.countryPhoneIso;
              })) &&
            (t = null);
          for (var o = 1; null === t && o < 5; )
            (t =
              void 0 !==
              (t = this.countries.find(function (t) {
                return (
                  t.phonecode === parseInt(e.savedPhone.substr(1, o)) &&
                  1 === t.priority
                );
              }))
                ? t
                : null),
              o++;
          if (!t)
            for (o = 1; null === t && o < 5; )
              (t =
                void 0 !==
                (t = this.countries.find(function (t) {
                  return t.phonecode === parseInt(e.savedPhone.substr(1, o));
                }))
                  ? t
                  : null),
                o++;
          null !== t &&
            ((this.value = t.iso),
            (this.input = this.savedPhone.replace("+" + t.phonecode, "")),
            (this.input = t.format.startsWith("0")
              ? "0" + this.input
              : this.input));
        },
      },
      watch: {
        input: function () {
          this.formatPhoneNumber();
        },
      },
      components: {},
    };
  },
  704: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          o = e._self._c || t;
        return o(
          "el-input",
          {
            attrs: {
              placeholder: e.format,
              disabled: e.disabled,
              clearable: "",
            },
            on: { clear: e.onClear },
            model: {
              value: e.input,
              callback: function (t) {
                e.input = t;
              },
              expression: "input",
            },
          },
          [
            o(
              "el-select",
              {
                class: "am-selected-flag am-selected-flag-" + e.value,
                attrs: {
                  slot: "prepend",
                  placeholder: "",
                  "popper-class": e.$root.settings.customization.forms
                    ? e.dropdownClass
                    : "",
                  disabled: e.disabled,
                },
                on: { change: e.changeCountry },
                slot: "prepend",
                model: {
                  value: e.value,
                  callback: function (t) {
                    e.value = t;
                  },
                  expression: "value",
                },
              },
              e._l(e.countries, function (t) {
                return o(
                  "el-option",
                  { key: t.id, attrs: { value: t.iso, label: " " } },
                  [
                    o("span", { class: "am-flag am-flag-" + t.iso }),
                    e._v(" "),
                    o("span", { staticClass: "am-phone-input-nicename" }, [
                      e._v(e._s(t.nicename)),
                    ]),
                    e._v(" "),
                    o("span", { staticClass: "am-phone-input-phonecode" }, [
                      e._v("+" + e._s(t.phonecode)),
                    ]),
                  ]
                );
              }),
              1
            ),
          ],
          1
        );
      },
      staticRenderFns: [],
    };
  },
  711: function (e, t, o) {
    "use strict";
    t.a = {
      data: function () {
        return {};
      },
      methods: {
        getNameTranslated: function (e) {
          if (e.translations && JSON.parse(e.translations).name) {
            var t = JSON.parse(e.translations).name[window.localeLanguage[0]];
            if (t && "" !== t) return t;
          }
          return e.name;
        },
        getCfLabelTranslated: function (e) {
          if (e.translations) {
            var t = JSON.parse(e.translations).name[window.localeLanguage[0]];
            if (t && "" !== t) return t;
          }
          return e.label;
        },
        getCfOptionTranslated: function (e) {
          if (e.translations) {
            var t = JSON.parse(e.translations)[window.localeLanguage[0]];
            if (t && "" !== t) return t;
          }
          return e.label;
        },
        getDescriptionTranslated: function (e) {
          if (e.translations && JSON.parse(e.translations).description) {
            var t = JSON.parse(e.translations).description;
            if (t[window.localeLanguage[0]]) return t[window.localeLanguage[0]];
          }
          return e.description;
        },
        translateEntities: function (e) {
          var t = this;
          e.services &&
            e.services.length &&
            e.services.forEach(function (e) {
              (e.name = t.getNameTranslated(e)),
                (e.description = t.getDescriptionTranslated(e)),
                e.extras.forEach(function (e) {
                  (e.name = t.getNameTranslated(e)),
                    (e.description = t.getDescriptionTranslated(e));
                });
            }),
            e.packages &&
              e.packages.length &&
              e.packages.forEach(function (e) {
                (e.name = t.getNameTranslated(e)),
                  (e.description = t.getDescriptionTranslated(e)),
                  e.bookable.forEach(function (e) {
                    (e.service.name = t.getNameTranslated(e.service)),
                      (e.service.description = t.getDescriptionTranslated(
                        e.service
                      )),
                      e.service.extras.forEach(function (e) {
                        (e.name = t.getNameTranslated(e)),
                          (e.description = t.getDescriptionTranslated(e));
                      });
                  });
              }),
            e.categories &&
              e.categories.length &&
              e.categories.forEach(function (e) {
                (e.name = t.getNameTranslated(e)),
                  e.serviceList.forEach(function (e) {
                    (e.name = t.getNameTranslated(e)),
                      (e.description = t.getDescriptionTranslated(e)),
                      e.extras.forEach(function (e) {
                        (e.name = t.getNameTranslated(e)),
                          (e.description = t.getDescriptionTranslated(e));
                      });
                  });
              }),
            e.events &&
              e.events.length &&
              e.events.forEach(function (e) {
                (e.name = t.getNameTranslated(e)),
                  (e.description = t.getDescriptionTranslated(e)),
                  e.extras.forEach(function (e) {
                    (e.name = t.getNameTranslated(e)),
                      (e.description = t.getDescriptionTranslated(e));
                  });
              }),
            e.customFields &&
              e.customFields.length &&
              e.customFields.forEach(function (e) {
                (e.label = t.getCfLabelTranslated(e)),
                  e.options.forEach(function (e) {
                    e.label = t.getCfOptionTranslated(e);
                  });
              }),
            e.employees &&
              e.employees.length &&
              e.employees.forEach(function (e) {
                e.serviceList.forEach(function (e) {
                  (e.name = t.getNameTranslated(e)),
                    (e.description = t.getDescriptionTranslated(e)),
                    e.extras.forEach(function (e) {
                      (e.name = t.getNameTranslated(e)),
                        (e.description = t.getDescriptionTranslated(e));
                    });
                });
              });
        },
      },
      computed: {},
    };
  },
  712: function (e, t, o) {
    "use strict";
    var a = o(0),
      i = o.n(a),
      n = o(720);
    t.a = {
      mixins: [n.a],
      data: function () {
        return { phonePopulated: !1 };
      },
      methods: {
        getAppointmentDuration: function (e, t) {
          return (
            e.duration +
            t
              .filter(function (e) {
                return e.selected;
              })
              .map(function (e) {
                return e.duration * e.quantity;
              })
              .reduce(function (e, t) {
                return e + t;
              }, 0)
          );
        },
        getFormattedTimeSlot: function (e, t) {
          var o =
            !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2]
              ? " - " +
                i()(e, "HH:mm:ss")
                  .add(t, "seconds")
                  .format(this.momentTimeFormat)
              : "";
          return "" + this.getFrontedFormattedTime(e) + o;
        },
        handleCapacity: function (e, t) {
          var o = this,
            a = !1,
            i = 0,
            n = 0,
            s = 0;
          if (o.appointment.serviceId)
            if (o.appointment.providerId) {
              var r = o.getProviderService(
                this.appointment.providerId,
                this.appointment.serviceId
              );
              (s = r.minCapacity),
                (a =
                  r.maxCapacity > 1 &&
                  (r.bringingAnyone ||
                    !this.$root.settings.appointments.allowBookingIfNotMin)),
                (i = r.maxCapacity),
                (n = this.$root.settings.appointments.allowBookingIfNotMin
                  ? 1
                  : r.minCapacity);
            } else
              this.options.entities.employees.forEach(function (e) {
                e.serviceList.forEach(function (t) {
                  if (t.id === o.appointment.serviceId) {
                    var r = o.getProviderService(e.id, o.appointment.serviceId);
                    (s = r.minCapacity),
                      r.maxCapacity > 1 &&
                        (r.bringingAnyone ||
                          !o.$root.settings.appointments
                            .allowBookingIfNotMin) &&
                        (a = !0),
                      (r.maxCapacity < i || 0 === i) && (i = r.maxCapacity),
                      n < r.minCapacity &&
                        (n = o.$root.settings.appointments.allowBookingIfNotMin
                          ? 1
                          : r.minCapacity);
                  }
                });
              });
          !e &&
            this.$root.settings.appointments.openedBookingAfterMin &&
            (n = s),
            (this.group.options = []);
          for (var l = n - 1; l < i; l++)
            if (0 !== l) {
              var c =
                "ameliaBooking" in window &&
                "form" in window.ameliaBooking &&
                window.ameliaBooking.form.allPersons
                  ? l + 1
                  : l;
              this.group.options.push({
                label:
                  1 === c
                    ? c + " " + this.$root.labels.person_upper
                    : c + " " + this.$root.labels.persons_upper,
                value: l + 1,
              });
            }
          0 !== i &&
            this.appointment.bookings[0].persons > i &&
            (this.appointment.bookings[0].persons = i),
            (this.group.enabled ||
              (a &&
                !this.$root.settings.appointments.allowBookingIfNotMin &&
                n > 1)) &&
              (this.group.enabled = a),
            a &&
              !this.$root.settings.appointments.allowBookingIfNotMin &&
              n > 1 &&
              (this.appointment.bookings[0].persons = n),
            (this.group.allowed =
              a &&
              (this.$root.settings.appointments.allowBookingIfNotMin ||
                1 === n)),
            !t &&
              this.$root.settings.appointments.allowBookingIfNotMin &&
              this.$root.settings.appointments.openedBookingAfterMin &&
              s > 1 &&
              ((this.group.enabled = !0),
              (this.appointment.bookings[0].persons = s));
        },
        getAppointmentAddToCalendarData: function (e, t) {
          var o = 0,
            a = [],
            n = [],
            s = [];
          switch (e.type) {
            case "appointment":
              e.recurring.forEach(function (e) {
                n.push({
                  type: "appointment",
                  id: e.booking.id,
                  appointmentStatusChanged: e.appointmentStatusChanged,
                }),
                  s.push(e.booking.id);
              }),
                e.utcTime.forEach(function (t) {
                  a.push({
                    address: e.appointment.location
                      ? e.appointment.location.address
                      : "",
                    start: i.a.utc(t.start.replace(/ /g, "T")).toDate(),
                    end: i.a.utc(t.end.replace(/ /g, "T")).toDate(),
                  });
                }),
                e.recurring.forEach(function (e) {
                  e.utcTime.forEach(function (t) {
                    a.push({
                      address: e.appointment.location
                        ? e.appointment.location.address
                        : "",
                      start: i.a.utc(t.start.replace(/ /g, "T")).toDate(),
                      end: i.a.utc(t.end.replace(/ /g, "T")).toDate(),
                    });
                  });
                }),
                (o = e.booking.id);
              break;
            case "package":
              e.package.forEach(function (e, t) {
                t > 0
                  ? (n.push({
                      type: "appointment",
                      id: e.booking.id,
                      appointmentStatusChanged: e.appointmentStatusChanged,
                    }),
                    s.push(e.booking.id),
                    e.utcTime.forEach(function (t) {
                      a.push({
                        address: e.appointment.location
                          ? e.appointment.location.address
                          : "",
                        start: i.a.utc(t.start.replace(/ /g, "T")).toDate(),
                        end: i.a.utc(t.end.replace(/ /g, "T")).toDate(),
                      });
                    }))
                  : ((o = e.booking.id),
                    e.utcTime.forEach(function (t) {
                      a.push({
                        address: e.appointment.location
                          ? e.appointment.location.address
                          : "",
                        start: i.a.utc(t.start.replace(/ /g, "T")).toDate(),
                        end: i.a.utc(t.end.replace(/ /g, "T")).toDate(),
                      });
                    }));
              });
          }
          var r = e.packageId ? e.packageId : null;
          t ||
            this.$http
              .post(
                this.$root.getAjaxUrl +
                  "/bookings/success/" +
                  o +
                  "&nocache=" +
                  new Date().getTime(),
                {
                  type: e.type,
                  appointmentStatusChanged: e.appointmentStatusChanged,
                  recurring: n,
                  packageId: r,
                  customer: e.customer,
                }
              )
              .then(function (e) {})
              .catch(function (e) {});
          var l = {};
          switch (e.type) {
            case "appointment":
              l = {
                title: this.$root.useTranslations
                  ? this.getNameTranslated(e.bookable)
                  : e.bookable.name,
                dates: a,
                address: e.appointment.location
                  ? e.appointment.location.address
                  : "",
                description: this.$root.useTranslations
                  ? this.getDescriptionTranslated(e.bookable)
                  : e.bookable.description,
                id: e.booking.id,
                status: e.appointment.bookings[0].status,
                active: this.$root.settings.general.addToCalendar,
                color: e.color,
                type: e.type,
                bookableType: e.type,
                bookable: e.bookable,
                booking: e.booking,
                recurringIds: s,
              };
              break;
            case "package":
              l = {
                title: this.$root.useTranslations
                  ? this.getNameTranslated(e.bookable)
                  : e.bookable.name,
                dates: a,
                address: "",
                description: this.$root.useTranslations
                  ? this.getDescriptionTranslated(e.bookable)
                  : e.bookable.description,
                id: o,
                status: "approved",
                active:
                  this.$root.settings.general.addToCalendar && a.length > 0,
                color: e.color,
                type: "appointment",
                bookableType: "package",
                bookable: e.bookable,
                booking: e.booking,
                recurringIds: s,
              };
          }
          return l;
        },
      },
    };
  },
  714: function (e, t, o) {
    "use strict";
    var a = o(686);
    t.a = {
      mixins: [a.a],
      data: function () {
        return {};
      },
      methods: {
        getInitEntitySettings: function (e) {
          var t = {
            payments: {
              onSite: this.$root.settings.payments.onSite,
              wc: { productId: this.$root.settings.payments.wc.productId },
              payPal: { enabled: this.$root.settings.payments.payPal.enabled },
              stripe: { enabled: this.$root.settings.payments.stripe.enabled },
              mollie: { enabled: this.$root.settings.payments.mollie.enabled },
            },
          };
          switch (e) {
            case "service":
              (t.general = {
                minimumTimeRequirementPriorToCanceling: null,
                minimumTimeRequirementPriorToRescheduling: null,
                redirectUrlAfterAppointment: null,
              }),
                (t.general.defaultAppointmentStatus = null),
                (t.general.numberOfDaysAvailableForBooking = 0),
                (t.general.minimumTimeRequirementPriorToBooking = null),
                (t.zoom = { enabled: this.$root.settings.zoom.enabled });
              break;
            case "event":
              (t.general = {
                minimumTimeRequirementPriorToCanceling: null,
                redirectUrlAfterAppointment: null,
              }),
                (t.zoom = { enabled: this.$root.settings.zoom.enabled });
          }
          return t;
        },
        setEntitySettings: function (e, t) {
          (e.settings =
            null !== e.settings
              ? JSON.parse(e.settings)
              : this.getInitEntitySettings(t)),
            this.addMissingObjectProperties(
              e.settings,
              this.getInitEntitySettings(t)
            );
        },
        updateSettings: function (e) {
          if (
            !this.$root.clonedSettings.payments.onSite ||
            this.$root.clonedSettings.payments.stripe.enabled ||
            this.$root.clonedSettings.payments.payPal.enabled ||
            this.$root.clonedSettings.payments.wc.enabled ||
            this.$root.clonedSettings.payments.mollie.enabled
          ) {
            if (
              !1 === this.$root.clonedSettings.payments.wc.enabled &&
              !1 === this.$root.clonedSettings.payments.mollie.enabled &&
              null !== e
            ) {
              var t = JSON.parse(e);
              (t.payments.wc = this.$root.clonedSettings.payments.wc),
                (t.payments.mollie = this.$root.clonedSettings.payments.mollie),
                this.$root.clonedSettings.payments.onSite ||
                  (t.payments.onSite =
                    this.$root.clonedSettings.payments.onSite),
                this.$root.clonedSettings.payments.payPal.enabled ||
                  (t.payments.payPal =
                    this.$root.clonedSettings.payments.payPal),
                this.$root.clonedSettings.payments.stripe.enabled ||
                  (t.payments.stripe =
                    this.$root.clonedSettings.payments.stripe),
                t.payments.onSite ||
                  t.payments.payPal.enabled ||
                  t.payments.stripe.enabled ||
                  t.payments.mollie.enabled ||
                  (t.payments = this.$root.clonedSettings.payments),
                (e = JSON.stringify(t));
            }
            if (
              !0 === this.$root.clonedSettings.payments.wc.enabled &&
              null !== e
            ) {
              var o = JSON.parse(e);
              "payments" in o || (o.payments = {}),
                (o.payments.onSite = this.$root.clonedSettings.payments.onSite),
                (o.payments.stripe = this.$root.clonedSettings.payments.stripe),
                (o.payments.payPal = this.$root.clonedSettings.payments.payPal),
                (o.payments.mollie = this.$root.clonedSettings.payments.mollie),
                (e = JSON.stringify(o));
            }
            if (
              !0 === this.$root.clonedSettings.payments.mollie.enabled &&
              null !== e
            ) {
              var a = JSON.parse(e);
              "payments" in a || (a.payments = {}),
                this.$root.clonedSettings.payments.onSite ||
                  ((a.payments.onSite =
                    this.$root.clonedSettings.payments.onSite),
                  (a.payments.mollie =
                    this.$root.clonedSettings.payments.mollie)),
                (a.payments.stripe = this.$root.clonedSettings.payments.stripe),
                (a.payments.payPal = this.$root.clonedSettings.payments.payPal),
                (e = JSON.stringify(a));
            }
            this.replaceExistingObjectProperties(
              this.$root.settings,
              null !== e ? JSON.parse(e) : this.$root.clonedSettings
            );
          }
        },
        prepareEntitySettingsForSave: function (e) {
          var t = JSON.parse(JSON.stringify(e.settings));
          return (
            t.payments.wc.productId ===
              this.$root.settings.payments.wc.productId && delete t.payments.wc,
            "general" in t &&
              (t.general.redirectUrlAfterAppointment ||
                delete t.general.redirectUrlAfterAppointment,
              t.general.defaultAppointmentStatus ||
                delete t.general.defaultAppointmentStatus,
              ((t.general.minimumTimeRequirementPriorToBooking ||
                this.$root.settings.general
                  .minimumTimeRequirementPriorToBooking) &&
                "" !== t.general.minimumTimeRequirementPriorToBooking) ||
                delete t.general.minimumTimeRequirementPriorToBooking,
              ((t.general.minimumTimeRequirementPriorToCanceling ||
                this.$root.settings.general
                  .minimumTimeRequirementPriorToCanceling) &&
                "" !== t.general.minimumTimeRequirementPriorToCanceling) ||
                delete t.general.minimumTimeRequirementPriorToCanceling,
              ((t.general.minimumTimeRequirementPriorToRescheduling ||
                this.$root.settings.general
                  .minimumTimeRequirementPriorToRescheduling) &&
                "" !== t.general.minimumTimeRequirementPriorToRescheduling) ||
                delete t.general.minimumTimeRequirementPriorToRescheduling,
              t.general.numberOfDaysAvailableForBooking ||
                delete t.general.numberOfDaysAvailableForBooking,
              0 === Object.keys(t.general).length && delete t.general),
            0 === Object.keys(t).length && (t = null),
            t
          );
        },
      },
      computed: {},
    };
  },
  715: function (e, t, o) {
    "use strict";
    var a = o(0),
      i = o.n(a);
    t.a = {
      methods: {
        entitiesLoaded: function () {
          return "ameliaEventEntities" in window || "ameliaEntities" in window;
        },
        processEntities: function (e) {
          this.getCurrentUser(),
            (this.options.entities.locations = e.locations),
            (this.options.entities.employees = e.employees),
            (this.options.entities.customFields = e.customFields),
            this.options.entities.employees.forEach(function (e) {
              e.serviceList.forEach(function (e) {
                "name" in e || Object.assign(e, { extras: [] });
              });
            }),
            this.$root.useTranslations &&
              this.translateEntities(this.options.entities),
            this.setBookingCustomFields();
        },
        processCalendarEntities: function (e) {
          this.processEntities(e), (this.options.entities.tags = e.tags);
          var t = this.getPreselectedTag();
          if (t) {
            var o = e.tags.find(function (e) {
              return e.name === t;
            });
            (this.options.entities.tags = o ? [o] : e.tags),
              (this.eventFilterTag = o ? [o.name] : []);
          } else this.options.entities.tags = e.tags;
          (this.entitiesFetched = !0), this.getEvents();
        },
        processListEntities: function (e) {
          this.processEntities(e),
            (this.options.entities.tags = this.getPreselectedTag()
              ? []
              : e.tags);
        },
        getEntities: function (e) {
          var t = this;
          if (this.$root.hasApiCall && !this.entitiesLoaded())
            this.$http
              .get(this.$root.getAjaxUrl + "/entities", {
                params: {
                  types: ["locations", "tags", "custom_fields", "employees"],
                },
              })
              .then(function (t) {
                (window.ameliaEventEntities = JSON.parse(
                  JSON.stringify(t.data.data)
                )),
                  e(window.ameliaEventEntities);
              })
              .catch(function () {});
          else
            var o = setInterval(function () {
              t.entitiesLoaded() &&
                (clearInterval(o),
                "ameliaEntities" in window
                  ? e(JSON.parse(JSON.stringify(window.ameliaEntities)))
                  : e(JSON.parse(JSON.stringify(window.ameliaEventEntities))));
            }, 1e3);
        },
        getPreselectedTag: function () {
          return "eventTag" in this.$root.shortcodeData.booking
            ? this.$root.shortcodeData.booking.eventTag
            : null;
        },
        getPreselectedEventId: function () {
          return "eventId" in this.$root.shortcodeData.booking
            ? this.$root.shortcodeData.booking.eventId
            : null;
        },
        getPreselectedEventRecurring: function () {
          return "eventRecurring" in this.$root.shortcodeData.booking
            ? this.$root.shortcodeData.booking.eventRecurring
            : null;
        },
        getImplodedPeriods: function (e) {
          var t = null,
            o = [],
            a = [];
          return (
            e.forEach(function (i, n) {
              var s = t && t.periodEnd === i.periodStart;
              s && o.pop(),
                (t = {
                  periodStart: s ? t.periodStart : i.periodStart,
                  periodEnd: i.periodEnd,
                  isConnected: s,
                }),
                o.push(t),
                (e.length === n + 1 ||
                  (n + 1 in e && e[n + 1].periodStart !== i.periodEnd)) &&
                  ((a = a.concat(JSON.parse(JSON.stringify(o)))), (o = []));
            }),
            a
          );
        },
        getExplodedPeriods: function (e) {
          var t = [];
          return (
            e.forEach(function (e) {
              if (e.isConnected) t.push(e);
              else {
                var o = i()(e.periodStart.split(" ")[0], "YYYY-MM-DD"),
                  a = i()(e.periodEnd.split(" ")[0], "YYYY-MM-DD"),
                  n = e.periodStart.split(" ")[1],
                  s = e.periodEnd.split(" ")[1];
                "00:00:00" === s && ((s = "24:00:00"), a.subtract(1, "days"));
                for (var r = []; o.isSameOrBefore(a); )
                  r.push(o.format("YYYY-MM-DD")), o.add(1, "days");
                r.forEach(function (o) {
                  t.push({
                    periodStart: o + " " + n,
                    periodEnd: o + " " + s,
                    zoomMeeting: e.zoomMeeting,
                  });
                });
              }
            }),
            t
          );
        },
        getEventStatus: function (e) {
          switch (e.status) {
            case "rejected":
            case "canceled":
              return { label: this.$root.labels.canceled, class: "canceled" };
            case "full":
              return { label: this.$root.labels.full, class: "full" };
            case "upcoming":
              return { label: this.$root.labels.upcoming, class: "upcoming" };
            case "approved":
              if (e.closed)
                return { label: this.$root.labels.closed, class: "closed" };
              if (e.opened && e.places > 0)
                return { label: this.$root.labels.opened, class: "opened" };
          }
          return { label: "", class: "" };
        },
        getEventAddToCalendarData: function (e, t) {
          t ||
            this.$http
              .post(
                this.$root.getAjaxUrl + "/bookings/success/" + e.booking.id,
                {
                  type: "event",
                  appointmentStatusChanged: e.appointmentStatusChanged,
                }
              )
              .then(function (e) {})
              .catch(function (e) {});
          var o = "";
          e.event.location
            ? (o = e.event.location.address)
            : e.event.customLocation && (o = e.event.customLocation);
          var a = [];
          return (
            e.utcTime.forEach(function (e) {
              a.push({
                address: o,
                start: i.a.utc(e.start.replace(/ /g, "T")).toDate(),
                end: i.a.utc(e.end.replace(/ /g, "T")).toDate(),
              });
            }),
            {
              title: this.$root.useTranslations
                ? this.getNameTranslated(e.event)
                : e.event.name,
              dates: a,
              address: o,
              description: this.$root.useTranslations
                ? this.getDescriptionTranslated(e.event)
                : e.event.description,
              id: e.booking.id,
              status: e.booking.status,
              active: this.$root.settings.general.addToCalendar,
              color: e.color,
              type: e.type,
              bookableType: e.type,
              bookable: e.event,
              booking: e.booking,
              recurringIds: [],
            }
          );
        },
      },
    };
  },
  716: function (e, t, o) {
    "use strict";
    var a = o(686),
      i = o(715),
      n = o(712);
    t.a = {
      mixins: [a.a, i.a, n.a],
      data: function () {
        return {
          cacheData: null,
          loadingCacheCatalogData: !1,
          loadingCacheCategoryData: !1,
          loadingCacheServiceData: !1,
          loadingCacheBookingData: !1,
        };
      },
      methods: {
        setCacheData: function (e, t) {
          if (
            ((this.cacheData =
              "ameliaCache" in window &&
              window.ameliaCache.length &&
              window.ameliaCache[0]
                ? JSON.parse(window.ameliaCache[0])
                : null),
            this.cacheData &&
              ((this.cacheData.request.bookable.id = parseInt(
                this.cacheData.request.bookable.id
              )),
              (this.cacheData.request.passedCategoryId = parseInt(
                this.cacheData.request.passedCategoryId
              )),
              this.cacheData.request &&
                this.cacheData.request.queryParams &&
                "dates" in this.cacheData.request.queryParams &&
                ((this.cacheData.request.queryParams.id = this.cacheData.request
                  .queryParams.id
                  ? parseInt(this.cacheData.request.queryParams.id)
                  : this.cacheData.request.queryParams.id),
                (this.cacheData.request.queryParams.page = parseInt(
                  this.cacheData.request.queryParams.page
                )),
                (this.cacheData.request.queryParams.recurring = parseInt(
                  this.cacheData.request.queryParams.recurring
                )),
                (this.cacheData.request.queryParams.tag = this.cacheData.request
                  .queryParams.tag
                  ? this.cacheData.request.queryParams.tag
                  : null))),
            this.cacheData && e === this.cacheData.request.containerId)
          ) {
            if (
              "canceled" === this.cacheData.status ||
              "failed" === this.cacheData.status
            ) {
              for (var o in ((this.cacheData.request.appointment.serviceId =
                parseInt(this.cacheData.request.appointment.serviceId)),
              (this.cacheData.request.appointment.locationId = parseInt(
                this.cacheData.request.appointment.locationId
              )),
              (this.cacheData.request.appointment.providerId = parseInt(
                this.cacheData.request.appointment.providerId
              )),
              (this.cacheData.request.appointment.group = !!parseInt(
                this.cacheData.request.appointment.group
              )),
              (this.cacheData.request.appointment.bookings[0].customerId =
                parseInt(
                  this.cacheData.request.appointment.bookings[0].customerId
                )),
              (this.cacheData.request.appointment.bookings[0].persons =
                parseInt(
                  this.cacheData.request.appointment.bookings[0].persons
                )),
              (this.cacheData.request.hasCancel = !!parseInt(
                this.cacheData.request.hasCancel
              )),
              (this.cacheData.request.hasHeader = !!parseInt(
                this.cacheData.request.hasHeader
              )),
              (this.cacheData.request.useGlobalCustomization = !!parseInt(
                this.cacheData.request.useGlobalCustomization
              )),
              (this.cacheData.request.bookable.maxCapacity = parseInt(
                this.cacheData.request.bookable.maxCapacity
              )),
              this.cacheData.request.packageData
                ? ((this.cacheData.request.packageData.id = parseInt(
                    this.cacheData.request.packageData.id
                  )),
                  this.cacheData.request.packageData.rules.forEach(function (
                    e
                  ) {
                    (e.providerId = parseInt(e.providerId)),
                      (e.serviceId = parseInt(e.serviceId)),
                      (e.locationId = e.serviceId
                        ? parseInt(e.locationId)
                        : null);
                  }),
                  this.cacheData.request.packageData.data.forEach(function (e) {
                    (e.providerId = parseInt(e.providerId)),
                      (e.serviceId = parseInt(e.serviceId)),
                      (e.locationId = e.serviceId
                        ? parseInt(e.locationId)
                        : null);
                  }))
                : (this.cacheData.request.packageData = null),
              this.cacheData.request.recurringData ||
                (this.cacheData.request.recurringData = []),
              "extras" in this.cacheData.request.appointment.bookings[0] ||
                (this.cacheData.request.appointment.bookings[0].extras = []),
              this.cacheData.request.appointment.bookings[0].customFields))
                this.cacheData.request.appointment.bookings[0].customFields.hasOwnProperty(
                  o
                ) &&
                  "datepicker" ===
                    this.cacheData.request.appointment.bookings[0].customFields[
                      o
                    ].type &&
                  (this.cacheData.request.appointment.bookings[0].customFields[
                    o
                  ].value = new Date(
                    this.cacheData.request.appointment.bookings[0].customFields[
                      o
                    ].value
                  )),
                  !this.cacheData.request.appointment.bookings[0].customFields.hasOwnProperty(
                    o
                  ) ||
                    "checkbox" !==
                      this.cacheData.request.appointment.bookings[0]
                        .customFields[o].type ||
                    "value" in
                      this.cacheData.request.appointment.bookings[0]
                        .customFields[o] ||
                    (this.cacheData.request.appointment.bookings[0].customFields[
                      o
                    ].value = []);
              this.scrollView(e, "end", !0);
            } else if ("paid" === this.cacheData.status && t) {
              switch (
                ((this.cacheData.response.color =
                  this.cacheData.request.bookable.color),
                this.cacheData.response.type)
              ) {
                case "appointment":
                  this.getAppointmentAddToCalendarData(
                    this.cacheData.response,
                    !1
                  );
                  break;
                case "package":
                  this.cacheData.response.package &&
                    this.cacheData.response.package.length > 0 &&
                    this.getAppointmentAddToCalendarData(
                      this.cacheData.response,
                      !1
                    );
                  break;
                case "event":
                  this.getEventAddToCalendarData(this.cacheData.response, !1);
              }
              this.scrollView(e, "end", !0);
            }
          } else this.unsetCacheData();
          (this.loadingCacheBookingData = !!this.cacheData),
            (this.loadingCacheCatalogData = !!this.cacheData),
            (this.loadingCacheCategoryData = !!this.cacheData),
            (this.loadingCacheServiceData = !!this.cacheData);
        },
        unsetCacheData: function () {
          this.cacheData = null;
        },
        getCacheDataRequestProps: function () {
          var e = this,
            t = null,
            o = null,
            a = null;
          switch (this.cacheData.request.bookableType) {
            case "appointment":
              (o = (t = this.getProviderById(
                parseInt(this.cacheData.request.appointment.providerId)
              )).serviceList.find(function (t) {
                return (
                  t.id === parseInt(e.cacheData.request.appointment.serviceId)
                );
              })),
                (a = this.getLocationById(
                  parseInt(this.cacheData.request.appointment.locationId)
                ));
          }
          return JSON.parse(
            JSON.stringify(
              Object.assign(this.cacheData.request, {
                provider: t,
                location: a,
                service: o,
                customFields: this.options.entities.customFields,
                status: this.cacheData.status,
              })
            )
          );
        },
      },
    };
  },
  720: function (e, t, o) {
    "use strict";
    t.a = {
      data: function () {
        return {};
      },
      methods: {
        getCurrentUser: function () {
          var e = this;
          if (!this.$root.hasApiCall || "ameliaUser" in window)
            var t = setInterval(function () {
              "ameliaUser" in window &&
                (clearInterval(t),
                e.setCurrentUser(
                  JSON.parse(JSON.stringify(window.ameliaUser))
                ));
            }, 1e3);
          else
            this.$http
              .get(this.$root.getAjaxUrl + "/users/current")
              .then(function (t) {
                (window.ameliaUser = t.data.data.user
                  ? JSON.parse(JSON.stringify(t.data.data.user))
                  : null),
                  e.setCurrentUser(window.ameliaUser);
              })
              .catch(function (e) {
                console.log("getCurrentUser fail");
              });
        },
        setCurrentUser: function (e) {
          (this.currentUser = e),
            this.currentUser &&
              ((this.appointment.bookings[0].customerId = this.currentUser.id),
              (this.appointment.bookings[0].customer.id = this.currentUser.id),
              (this.appointment.bookings[0].customer.externalId =
                this.currentUser.externalId),
              (this.appointment.bookings[0].customer.email =
                this.currentUser.email),
              (this.appointment.bookings[0].customer.firstName =
                this.currentUser.firstName),
              (this.appointment.bookings[0].customer.lastName =
                this.currentUser.lastName),
              (this.appointment.bookings[0].customer.phone =
                this.currentUser.phone || ""),
              (this.appointment.bookings[0].customer.countryPhoneIso =
                this.currentUser.countryPhoneIso),
              (this.phonePopulated =
                !!this.currentUser.phone &&
                "" !== this.currentUser.phone.trim()));
        },
      },
    };
  },
  742: function (e, t, o) {
    "use strict";
    function a() {
      return (a =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var o = arguments[t];
            for (var a in o)
              Object.prototype.hasOwnProperty.call(o, a) && (e[a] = o[a]);
          }
          return e;
        }).apply(this, arguments);
    }
    var i = function () {
        var e = !1,
          t = [];
        return {
          resolved: function () {
            return e;
          },
          resolve: function (o) {
            if (!e) {
              e = !0;
              for (var a = 0, i = t.length; a < i; a++) t[a](o);
            }
          },
          promise: {
            then: function (o) {
              e ? o() : t.push(o);
            },
          },
        };
      },
      n = Object.prototype.hasOwnProperty;
    var s,
      r =
        ((s = i()),
        {
          notify: function () {
            s.resolve();
          },
          wait: function () {
            return s.promise;
          },
          render: function (e, t, o) {
            this.wait().then(function () {
              o(window.grecaptcha.render(e, t));
            });
          },
          reset: function (e) {
            void 0 !== e &&
              (this.assertLoaded(),
              this.wait().then(function () {
                return window.grecaptcha.reset(e);
              }));
          },
          execute: function (e) {
            void 0 !== e &&
              (this.assertLoaded(),
              this.wait().then(function () {
                return window.grecaptcha.execute(e);
              }));
          },
          checkRecaptchaLoad: function () {
            n.call(window, "grecaptcha") &&
              n.call(window.grecaptcha, "render") &&
              this.notify();
          },
          assertLoaded: function () {
            if (!s.resolved()) throw new Error("ReCAPTCHA has not been loaded");
          },
        });
    "undefined" != typeof window && (window.vueRecaptchaApiLoaded = r.notify);
    var l = {
      name: "VueRecaptcha",
      props: {
        sitekey: { type: String, required: !0 },
        theme: { type: String },
        badge: { type: String },
        type: { type: String },
        size: { type: String },
        tabindex: { type: String },
        loadRecaptchaScript: { type: Boolean, default: !1 },
        recaptchaScriptId: { type: String, default: "__RECAPTCHA_SCRIPT" },
        recaptchaHost: { type: String, default: "www.google.com" },
        language: { type: String, default: "" },
      },
      beforeMount: function () {
        if (
          this.loadRecaptchaScript &&
          !document.getElementById(this.recaptchaScriptId)
        ) {
          var e = document.createElement("script");
          (e.id = this.recaptchaScriptId),
            (e.src =
              "https://" +
              this.recaptchaHost +
              "/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit&hl=" +
              this.language),
            (e.async = !0),
            (e.defer = !0),
            document.head.appendChild(e);
        }
      },
      mounted: function () {
        var e = this;
        r.checkRecaptchaLoad();
        var t = a({}, this.$props, {
            callback: this.emitVerify,
            "expired-callback": this.emitExpired,
            "error-callback": this.emitError,
          }),
          o = this.$slots.default ? this.$el.children[0] : this.$el;
        r.render(o, t, function (t) {
          (e.$widgetId = t), e.$emit("render", t);
        });
      },
      methods: {
        reset: function () {
          r.reset(this.$widgetId);
        },
        execute: function () {
          r.execute(this.$widgetId);
        },
        emitVerify: function (e) {
          this.$emit("verify", e);
        },
        emitExpired: function () {
          this.$emit("expired");
        },
        emitError: function () {
          this.$emit("error");
        },
      },
      render: function (e) {
        return e("div", {}, this.$slots.default);
      },
    };
    t.a = l;
  },
  759: function (e, t, o) {
    var a = o(685)(o(760), o(785), !1, null, null, null);
    e.exports = a.exports;
  },
  760: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = o(0),
      i = o.n(a),
      n = o(687),
      s = o(337),
      r = o(689),
      l = o(686),
      c = o(695),
      m = o(694),
      d = o(742),
      p = o(761),
      u = o.n(p),
      h = o(764),
      f = o.n(h),
      g = o(767),
      b = o.n(g),
      v = o(770),
      y = o.n(v),
      k = o(773),
      C = o.n(k),
      _ = o(776),
      F = o.n(_),
      D = o(779),
      w = o.n(D),
      S = o(782),
      x = o.n(S),
      T =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            };
    t.default = {
      name: "confirmBookingForm",
      mixins: [n.a, s.a, r.a, l.a, m.a, c.a],
      props: {
        trigger: null,
        passedCategoryId: null,
        couponCode: "",
        paymentGateway: "",
        queryParams: {},
        status: null,
        phonePopulated: null,
        containerId: null,
        recurringString: "",
        useGlobalCustomization: !1,
        bookableType: null,
        bookable: { default: function () {}, type: Object },
        recurringData: {
          default: function () {
            return [];
          },
        },
        packageData: null,
        hasCancel: !0,
        hasHeader: !0,
        appointment: { default: function () {}, type: Object },
        provider: { default: function () {}, type: Object },
        location: { default: function () {}, type: Object },
        service: { type: Object, default: function () {} },
        dialogClass: { default: "", type: String },
        customFields: {
          default: function () {
            return [];
          },
        },
        formType: { type: String },
        formsData: {
          type: Object,
          default: function () {
            return {};
          },
        },
      },
      data: function () {
        var e = this;
        return {
          validRecaptcha: !1,
          recaptchaResponse: !1,
          customFieldsFiles: [],
          stripePayment: { stripe: null, cardElement: null },
          hoverConfirm: !1,
          hoverCancel: !1,
          columnsLg: 12,
          couponLimit: 0,
          coupon: { code: "", discount: 0, deduction: 0 },
          clearValidate: !0,
          errors: {
            email: "",
            coupon: "",
            stripe: "",
            recaptcha: "",
            files: {},
          },
          fetched: !0,
          paid: !1,
          headerErrorMessage: "",
          headerErrorShow: !1,
          payPalActions: null,
          rules: {
            "customer.firstName": [
              {
                required: !0,
                message: this.$root.labels.enter_first_name_warning,
                trigger: "submit",
              },
            ],
            "customer.lastName": [
              {
                required:
                  this.formsData[this.$options.name][this.bookableType]
                    .itemsDraggable.lastNameFormField.required,
                message: this.$root.labels.enter_last_name_warning,
                trigger: "submit",
              },
            ],
            "customer.email": [
              {
                required:
                  this.formsData[this.$options.name][this.bookableType]
                    .itemsDraggable.emailFormField.required,
                message: this.$root.labels.enter_email_warning,
                trigger: "submit",
              },
              {
                type: "email",
                message: this.$root.labels.enter_valid_email_warning,
                trigger: "submit",
              },
            ],
            "customer.phone": [
              {
                required:
                  this.formsData[this.$options.name][this.bookableType]
                    .itemsDraggable.phoneFormField.required,
                message: this.$root.labels.enter_phone_warning,
                trigger: "submit",
              },
              {
                validator: function (t, o, a) {
                  o && "" !== o && !o.startsWith("+")
                    ? a(new Error(e.$root.labels.enter_valid_phone_warning))
                    : a();
                },
                trigger: "submit",
              },
            ],
            couponCode: [
              {
                validator: function (t, o, a) {
                  var i = document
                    .getElementsByClassName("am-add-coupon-field")[0]
                    .getElementsByClassName("el-input__suffix")[0];
                  e.coupon.code
                    ? ((e.coupon.code = e.coupon.code.trim()),
                      e.$http
                        .post(e.$root.getAjaxUrl + "/coupons/validate", {
                          code: e.coupon.code,
                          id: e.bookable.id,
                          type: e.bookableType,
                          user: e.appointment.bookings[0].customer,
                          count: e.recurringData.length
                            ? e.recurringData.length + 1
                            : 1,
                        })
                        .then(function (t) {
                          (e.coupon = t.data.data.coupon),
                            (e.couponLimit = t.data.data.limit),
                            void 0 !== i && (i.style.visibility = "visible"),
                            a();
                        })
                        .catch(function (t) {
                          (e.coupon.discount = 0),
                            (e.coupon.deduction = 0),
                            !0 === t.response.data.data.couponUnknown
                              ? a(new Error(e.$root.labels.coupon_unknown))
                              : !0 === t.response.data.data.couponInvalid
                              ? a(new Error(e.$root.labels.coupon_invalid))
                              : a(),
                            void 0 !== i && (i.style.visibility = "hidden");
                        }))
                    : (void 0 !== i && (i.style.visibility = "hidden"), a());
                },
                trigger: "submit",
              },
            ],
          },
          formValidOptions: {},
          formName: this.$options.name,
          serviceHeadingVisibility:
            !this.formsData[this.$options.name][this.bookableType].itemsStatic
              .confirmServiceHeadingFormField ||
            this.formsData[this.$options.name][this.bookableType].itemsStatic
              .confirmServiceHeadingFormField.visibility,
          recurringStringVisibility:
            !this.formsData[this.$options.name][this.bookableType].itemsStatic
              .recurringStringFormField ||
            this.formsData[this.$options.name][this.bookableType].itemsStatic
              .recurringStringFormField.visibility,
        };
      },
      created: function () {
        this.inlineSVG(), window.addEventListener("resize", this.handleResize);
      },
      mounted: function () {
        var e = this;
        "failed" === this.status &&
          ((this.headerErrorMessage = this.$root.labels.payment_error),
          (this.headerErrorShow = !0)),
          (this.coupon.code = this.couponCode),
          "event" === this.bookableType && this.useGlobalCustomization,
          this.setBookableConfirmStyle(!1),
          this.setBookableCancelStyle(!1),
          this.inlineSVG();
        var t = this.paymentOptions.find(function (t) {
          return t.value === e.$root.settings.payments.defaultPaymentMethod;
        });
        this.appointment.payment.gateway ||
          (this.appointment.payment.gateway = t
            ? t.value
            : this.paymentOptions[0].value),
          "appointment" === this.bookableType && this.saveStats(),
          this.addCustomFieldsValidationRules(),
          this.$root.settings.payments.payPal.enabled && this.payPalInit(),
          "beforeConfirmBookingLoaded" in window &&
            window.beforeConfirmBookingLoaded(
              this.appointment,
              this.bookable,
              this.provider,
              this.location
            );
        var o = this;
        "event" !== this.bookableType ||
          ("ameliaBooking" in window &&
            "disableScrollView" in window.ameliaBooking &&
            !0 === window.ameliaBooking.disableScrollView) ||
          setTimeout(function () {
            o.scrollView("am-confirm-booking", "start");
          }, 1200);
      },
      updated: function () {
        !0 === this.clearValidate &&
          (this.validateFieldsForPayPal(), (this.clearValidate = !1)),
          this.handleResize();
      },
      methods: {
        getComponentProps: function () {
          return {
            phonePopulated: this.phonePopulated ? 1 : 0,
            containerId: this.containerId,
            trigger: this.trigger ? this.trigger : "",
            recurringString: this.recurringString,
            useGlobalCustomization: this.useGlobalCustomization ? 1 : 0,
            bookableType: this.bookableType,
            bookable: Object.assign(this.bookable, {
              aggregatedPrice: this.bookable.aggregatedPrice ? 1 : 0,
            }),
            recurringData: this.recurringData,
            packageData: this.packageData,
            hasCancel: this.hasCancel ? 1 : 0,
            hasHeader: this.hasHeader ? 1 : 0,
            appointment: Object.assign(this.appointment, {
              group: this.appointment.group ? 1 : 0,
            }),
            dialogClass: this.dialogClass,
            couponCode: this.coupon.code,
            passedCategoryId: this.passedCategoryId,
            queryParams: this.queryParams,
          };
        },
        onSubmitCoupon: function (e) {
          return e.preventDefault(), !1;
        },
        getPackagePrice: function (e) {
          return e.calculatedPrice
            ? e.price
            : e.price - (e.price / 100) * e.discount;
        },
        isBookableCustomFieldVisible: function (e) {
          switch (this.bookableType) {
            case "appointment":
              return this.isCustomFieldVisible(
                e,
                "appointment",
                this.bookable.id
              );
            case "package":
              for (var t = !1, o = 0; o < this.packageData.data.length; o++)
                if (
                  this.isCustomFieldVisible(
                    e,
                    "appointment",
                    this.packageData.data[o].serviceId
                  )
                ) {
                  t = !0;
                  break;
                }
              return t;
            case "event":
              return this.isCustomFieldVisible(e, "event", this.bookable.id);
          }
        },
        getCustomFieldClass: function (e) {
          var t = {
            "is-required": "file" === e.type && e.required,
            "text-content-custom-field": "content" === e.type,
          };
          return (t["am-cf-" + e.id] = !0), t;
        },
        onRecaptchaExpired: function () {
          (this.validRecaptcha = !1),
            (this.errors.recaptcha = this.$root.labels.recaptcha_error),
            this.validateFieldsForPayPal();
        },
        onRecaptchaVerify: function (e) {
          if (
            ((this.validRecaptcha = !0),
            (this.errors.recaptcha = ""),
            (this.recaptchaResponse = e),
            this.$root.settings.general.googleRecaptcha.invisible)
          )
            return this.saveBooking(this.getRequestData(!1)), !1;
          this.validateFieldsForPayPal();
        },
        selectedCustomFieldValue: function () {
          "event" === this.bookableType && this.useGlobalCustomization,
            this.validateFieldsForPayPal();
        },
        getBookableColor: function (e) {
          return e
            ? {
                color: "#ffffff",
                "background-color": this.bookable.color,
                "border-color": "#ffffff",
              }
            : {
                color: this.bookable.color,
                "background-color": "",
                "border-color": "",
              };
        },
        changeElementsColor: function (e, t, o, a) {},
        changeSelectedColor: function (e, t, o, a, i) {},
        setBookableConfirmStyle: function (e) {
          this.useGlobalCustomization ||
            "event" !== this.bookableType ||
            (this.hoverConfirm = e);
        },
        setBookableCancelStyle: function (e) {
          this.useGlobalCustomization ||
            "event" !== this.bookableType ||
            (this.hoverCancel = e);
        },
        saveStats: function () {
          this.$http.post(this.$root.getAjaxUrl + "/stats", {
            locationId: null !== this.location ? this.location.id : null,
            providerId: this.provider.id,
            serviceId: this.bookable.id,
          });
        },
        handleServerResponse: function (e) {
          var t = this;
          e.requiresAction
            ? t.stripePayment.stripe
                .handleCardAction(e.paymentIntentClientSecret)
                .then(function (e) {
                  if (e.error)
                    (t.headerErrorShow = !0),
                      (t.headerErrorMessage = t.$root.labels.payment_error),
                      (t.fetched = !0);
                  else {
                    var o = t.getRequestData(!1, {
                      paymentIntentId: e.paymentIntent.id,
                    });
                    t.saveBooking(o);
                  }
                })
            : e
            ? (t.$emit(
                "confirmedBooking",
                Object.assign(
                  e,
                  {
                    color: t.bookable.color,
                    type: t.bookableType,
                    packageId:
                      "package" === this.bookableType ? this.bookable.id : null,
                  },
                  this.$root.settings.general.runInstantPostBookingActions
                )
              ),
              (this.paid = !0))
            : (t.fetched = !0);
        },
        cancelBooking: function () {
          this.$emit("cancelBooking");
        },
        onSelectFiles: function () {
          this.validateFieldsForPayPal();
        },
        validateUploadedFiles: function () {
          for (
            var e = this,
              t = !0,
              o = this.appointment.bookings,
              a = {},
              i = 0,
              n = 0;
            n < this.customFields.length;
            n++
          )
            "file" === this.customFields[n].type &&
              ((a[this.customFields[n].id] = i), i++);
          var s = function (i) {
            if (!o[0].customFields.hasOwnProperty(i)) return "continue";
            var n = e.customFields.find(function (e) {
              return parseInt(e.id) === parseInt(i);
            });
            if (
              e.isBookableCustomFieldVisible(n) &&
              "file" === n.type &&
              n.required
            ) {
              var s = i in a && a[i] in e.$refs.customFieldsFiles ? a[i] : null;
              null !== s &&
                0 === e.$refs.customFieldsFiles[s].uploadFiles.length &&
                ((e.errors.files["files" + n.id] =
                  e.$root.labels.file_upload_error),
                (t = !1));
            }
          };
          for (var r in o[0].customFields) s(r);
          return t;
        },
        isDefaultOnSitePayment: function () {
          return (
            (0 === this.getTotalPrice() || "0" === this.getTotalPrice()) &&
            ("payPal" === this.appointment.payment.gateway ||
              "stripe" === this.appointment.payment.gateway ||
              "mollie" === this.appointment.payment.gateway ||
              ("wc" === this.appointment.payment.gateway &&
                "ameliaBooking" in window &&
                "wc" in window.ameliaBooking &&
                "bookIfPriceIsZero" in window.ameliaBooking.wc &&
                !0 === window.ameliaBooking.wc.bookIfPriceIsZero) ||
              ("wc" === this.appointment.payment.gateway &&
                this.$root.settings.payments.wc.onSiteIfFree))
          );
        },
        getPaymentGateway: function () {
          return this.isDefaultOnSitePayment()
            ? "onSite"
            : this.appointment.payment.gateway;
        },
        confirmBooking: function () {
          var e = this;
          if (this.fetched) {
            var t = this;
            (this.headerErrorShow = !1),
              (this.errors.email = ""),
              (this.errors.coupon = ""),
              this.validateFieldsForPayPal();
            var o = this.getPaymentGateway();
            this.$refs.booking.validate(function (a, i) {
              if (
                ((e.formValidOptions = {}),
                !e.validateUploadedFiles() ||
                  !a ||
                  "" !== e.errors.stripe ||
                  "" !== e.errors.coupon ||
                  ("onSite" === o && !e.isRequiredAndValidRecaptcha()))
              ) {
                if (
                  ((e.fetched = !0),
                  !a &&
                    (i.hasOwnProperty("customer.firstName") ||
                      i.hasOwnProperty("customer.lastName") ||
                      i.hasOwnProperty("customer.email") ||
                      i.hasOwnProperty("customer.phone")))
                )
                  return (
                    (e.formValidOptions = JSON.parse(JSON.stringify(i))), !1
                  );
                var n = [],
                  s = [];
                e.customFields.forEach(function (t) {
                  if (
                    "file" === t.type &&
                    !0 === t.required &&
                    0 ===
                      e.$refs[
                        "customFields." + t.id + ".value"
                      ][0].$el.getElementsByTagName("input")[0].files.length
                  ) {
                    var o = {};
                    (o.position = t.position - 1),
                      (o.name = "customFields." + t.id + ".value"),
                      s.push(o);
                  }
                  n.push("customFields." + t.id + ".value");
                });
                var r = [];
                Object.keys(i).forEach(function (e) {
                  var t = n.indexOf(e),
                    o = {};
                  (o.position = t), (o.name = e), r.push(o);
                });
                var l = r.concat(s).sort(function (e, t) {
                  var o = e.position,
                    a = t.position,
                    i = 0;
                  return o > a ? (i = 1) : o < a && (i = -1), i;
                });
                return (
                  0 !== l.length &&
                    e.$refs[l[0].name][0].$el.scrollIntoView({
                      behavior: "smooth",
                      block: "nearest",
                      inline: "nearest",
                    }),
                  !1
                );
              }
              switch (
                ("afterConfirmBooking" in window &&
                  window.afterConfirmBooking(
                    e.appointment,
                    e.bookable,
                    e.provider,
                    e.location
                  ),
                (e.fetched = !1),
                e.inlineSVG(),
                (e.appointment.payment.gateway = o),
                e.appointment.payment.gateway)
              ) {
                case "stripe":
                  t.stripePayment.stripe
                    .createPaymentMethod(
                      "card",
                      t.stripePayment.cardElement,
                      {}
                    )
                    .then(function (e) {
                      if (e.error)
                        (t.headerErrorShow = !0),
                          (t.headerErrorMessage = t.$root.labels.payment_error),
                          (t.fetched = !0);
                      else {
                        var o = t.getRequestData(!1, {
                          paymentMethodId: e.paymentMethod.id,
                        });
                        t.$http
                          .post(
                            t.$root.getAjaxUrl + "/bookings",
                            o.data,
                            o.options
                          )
                          .then(function (e) {
                            e.data.data && t.handleServerResponse(e.data.data);
                          })
                          .catch(function (e) {
                            t.handleSaveBookingErrors(e.response.data);
                          });
                      }
                    });
                  break;
                case "onSite":
                  e.$root.settings.general.googleRecaptcha.enabled &&
                  e.$root.settings.general.googleRecaptcha.invisible
                    ? e.$refs.recaptcha.execute()
                    : e.saveBooking(e.getRequestData(!1));
                  break;
                case "wc":
                  e.addToWooCommerceCart();
                  break;
                case "mollie":
                  e.goToMolliePaymentPage();
              }
              e.scrollView("am-spinner", "start");
            });
          }
        },
        buildFormData: function (e, t, o) {
          var a = this;
          !t ||
          "object" !== (void 0 === t ? "undefined" : T(t)) ||
          t instanceof Date ||
          t instanceof File
            ? e.append(o, null !== t ? t : "")
            : Object.keys(t).forEach(function (i) {
                a.buildFormData(e, t[i], o ? o + "[" + i + "]" : i);
              });
        },
        saveBooking: function (e) {
          var t = this;
          this.$http
            .post(this.$root.getAjaxUrl + "/bookings", e.data, e.options)
            .then(function (e) {
              e.data.data
                ? (t.$emit(
                    "confirmedBooking",
                    Object.assign(
                      e.data.data,
                      {
                        color: t.bookable.color,
                        type: t.bookableType,
                        packageId:
                          "package" === t.bookableType ? t.bookable.id : null,
                      },
                      t.$root.settings.general.runInstantPostBookingActions
                    )
                  ),
                  (t.paid = !0))
                : (t.fetched = !0);
            })
            .catch(function (e) {
              t.handleSaveBookingErrors(e.response.data);
            });
        },
        addToWooCommerceCart: function () {
          var e = this,
            t = this.getRequestData(!1);
          this.$http
            .post(this.$root.getAjaxUrl + "/payment/wc", t.data, t.options)
            .then(function (e) {
              window.location = e.data.data.cartUrl;
            })
            .catch(function (t) {
              e.handleSaveBookingErrors(t.response.data);
            });
        },
        goToMolliePaymentPage: function () {
          var e = this,
            t = this.getRequestData(!1);
          this.$http
            .post(this.$root.getAjaxUrl + "/payment/mollie", t.data, t.options)
            .then(function (e) {
              window.location = e.data.data.redirectUrl;
            })
            .catch(function (t) {
              e.handleSaveBookingErrors(t.response.data);
            });
        },
        getAppointmentDate: function () {
          return this.getFrontedFormattedDate(
            i()(this.bookable.bookingStart, "YYYY-MM-DD HH:mm:ss").format(
              "YYYY-MM-DD"
            )
          );
        },
        getAppointmentTime: function () {
          return this.getFrontedFormattedTime(
            this.bookable.bookingStart.split(" ")[1]
          );
        },
        getExtrasPrice: function (e) {
          for (var t = 0, o = 0; o < this.selectedExtras.length; o++)
            t +=
              e *
              this.selectedExtras[o].price *
              this.selectedExtras[o].quantity *
              this.getExtraPriceMultipleValue(this.selectedExtras[o]);
          return t;
        },
        getSubtotalPrice: function () {
          var e = this,
            t = this.basePriceMultipleValue * this.bookable.price;
          return (
            this.recurringData.forEach(function (o, a) {
              a < e.instantPaymentBookingsCount - 1 &&
                (t += e.basePriceMultipleValue * o.price);
            }),
            t + this.getExtrasPrice(this.instantPaymentBookingsCount)
          );
        },
        getDiscountData: function (e) {
          var t = this,
            o = this.getExtrasPrice(1),
            a = { instant: 0, postponed: 0 },
            i = this.couponLimit;
          if (i) {
            var n = this.basePriceMultipleValue * this.bookable.price + o,
              s = (n / 100) * this.coupon.discount + this.coupon.deduction;
            (a.instant = s),
              i--,
              this.recurringData.forEach(function (e, r) {
                i &&
                  ((n = t.basePriceMultipleValue * e.price + o),
                  (s = (n / 100) * t.coupon.discount + t.coupon.deduction),
                  (a[
                    r < t.instantPaymentBookingsCount - 1
                      ? "instant"
                      : "postponed"
                  ] += s),
                  i--);
              });
          }
          return a[e];
        },
        getTotalPrice: function () {
          var e = (
            this.getSubtotalPrice() - this.getDiscountData("instant")
          ).toFixed(2);
          return e > 0 ? e : "0";
        },
        getSelectedExtraDetails: function (e) {
          var t = "";
          return (
            e.price &&
              ((this.instantPaymentBookingsCount > 1 ||
                (null !== this.recurringData && this.recurringData.length)) &&
                (t +=
                  this.instantPaymentBookingsCount +
                  " " +
                  (this.instantPaymentBookingsCount > 1
                    ? this.$root.labels.appointments.toLowerCase()
                    : this.$root.labels.appointment.toLowerCase()) +
                  " x "),
              this.getExtraPriceMultipleValue(e) > 1 &&
                (t +=
                  this.getExtraPriceMultipleValue(e) +
                  " " +
                  this.$root.labels.persons +
                  " x "),
              (t += e.quantity + "  x "),
              (t +=
                this.getFormattedPrice(
                  e.price,
                  !this.$root.settings.payments.hideCurrencySymbolFrontend
                ) + " = ")),
            (t += this.getFormattedPrice(
              this.instantPaymentBookingsCount *
                e.price *
                this.getExtraPriceMultipleValue(e) *
                e.quantity,
              !this.$root.settings.payments.hideCurrencySymbolFrontend
            ))
          );
        },
        getExtraPriceMultipleValue: function (e) {
          return (
            null === e.aggregatedPrice
              ? this.bookable.aggregatedPrice
              : e.aggregatedPrice
          )
            ? this.appointment.bookings[0].persons
            : 1;
        },
        getBasePrice: function (e, t) {
          return e * this.basePriceMultipleValue * t;
        },
        getBookingBasePriceCalculationString: function (e, t) {
          var o = "";
          (e > 1 ||
            (null !== this.recurringData && this.recurringData.length)) &&
            (o +=
              e +
              " " +
              (e > 1
                ? this.$root.labels.appointments.toLowerCase()
                : this.$root.labels.appointment.toLowerCase()) +
              " x "),
            this.basePriceMultipleValue > 1 &&
              (o +=
                this.basePriceMultipleValue +
                " " +
                this.$root.labels.persons +
                " x ");
          var a = this.getFormattedPrice(
            this.getBasePrice(e, t),
            !this.$root.settings.payments.hideCurrencySymbolFrontend
          );
          o &&
            (o +=
              this.getFormattedPrice(
                t,
                !this.$root.settings.payments.hideCurrencySymbolFrontend
              ) +
              " = " +
              a);
          return "" !== o ? o : a;
        },
        getBookingBasePriceData: function (e) {
          var t = [],
            o = this.paymentPeriodData[e];
          for (var a in o)
            o[a].price && t.push({ count: o[a].count, price: o[a].price });
          return t;
        },
        getPostponedPaymentExtrasPriceDetails: function () {
          var e = 0,
            t = this.getExtrasPrice(1);
          for (var o in this.paymentPeriodData.postponed)
            e += this.paymentPeriodData.postponed[o].count;
          var a = "";
          return (
            e &&
              t &&
              ((a +=
                e +
                " " +
                (this.instantPaymentBookingsCount > 1
                  ? this.$root.labels.appointments.toLowerCase()
                  : this.$root.labels.appointment.toLowerCase()) +
                " x "),
              (a +=
                this.getFormattedPrice(
                  this.getExtrasPrice(1),
                  !this.$root.settings.payments.hideCurrencySymbolFrontend
                ) + " = ")),
            a +
              this.getFormattedPrice(
                this.getExtrasPrice(e),
                !this.$root.settings.payments.hideCurrencySymbolFrontend
              )
          );
        },
        getPostponedPaymentTotalPrice: function () {
          var e = 0,
            t = 0;
          for (var o in this.paymentPeriodData.postponed)
            (t += this.paymentPeriodData.postponed[o].count),
              (e += this.getBasePrice(
                this.paymentPeriodData.postponed[o].count,
                this.paymentPeriodData.postponed[o].price
              ));
          return e + this.getExtrasPrice(t) - this.getDiscountData("postponed");
        },
        checkCoupon: function (e) {
          e.preventDefault(),
            this.$refs.coupon.clearValidate(),
            this.$refs.coupon.validate();
        },
        getExtras: function () {
          var e = JSON.parse(JSON.stringify(this.selectedExtras));
          return (
            e.forEach(function (e) {
              (e.extraId = e.id), (e.id = null);
            }),
            e
          );
        },
        trimValue: function (e) {
          return "string" == typeof e ? e.replace(/^\s+|\s+$/g, "") : e;
        },
        getRequestData: function (e, t) {
          for (
            var o = this,
              a = JSON.parse(JSON.stringify(this.getComponentProps())),
              n = {},
              s = 0,
              r = 0;
            r < this.customFields.length;
            r++
          )
            "file" === this.customFields[r].type &&
              ((n[this.customFields[r].id] = s), s++);
          this.appointment.payment.amount = this.getFormattedAmount();
          var l = JSON.parse(JSON.stringify(this.appointment.bookings));
          l[0].extras = this.getExtras();
          var c = {},
            m = function (e) {
              if (!l[0].customFields.hasOwnProperty(e)) return "continue";
              var t = o.customFields.find(function (t) {
                return parseInt(t.id) === parseInt(e);
              });
              if (o.isBookableCustomFieldVisible(t)) {
                var a =
                  e in n && n[e] in o.$refs.customFieldsFiles ? n[e] : null;
                if (null !== a) {
                  for (
                    var i = { label: l[0].customFields[e].label, value: [] },
                      s = 0;
                    s < o.$refs.customFieldsFiles[a].uploadFiles.length;
                    s++
                  )
                    i.value.push({
                      name: o.$refs.customFieldsFiles[a].uploadFiles[s].name,
                    });
                  c[e] = i;
                } else c[e] = l[0].customFields[e];
                (c[e].type = t.type),
                  "datepicker" === c[e].type &&
                    (c[e].value = c[e].value
                      ? o.getStringFromDate(new Date(c[e].value))
                      : null);
              }
            };
          for (var d in l[0].customFields) m(d);
          (l[0].customer.email = l[0].customer.email
            ? this.trimValue(l[0].customer.email)
            : l[0].customer.email),
            (l[0].customer.phone = l[0].customer.phone
              ? this.trimValue(l[0].customer.phone)
              : l[0].customer.phone),
            (l[0].customFields = c);
          var p = this.bookable.bookingStart,
            u =
              void 0 !== this.recurringData && null !== this.recurringData
                ? JSON.parse(JSON.stringify(this.recurringData))
                : [],
            h =
              void 0 !== this.packageData && null !== this.packageData
                ? JSON.parse(JSON.stringify(this.packageData))
                : { id: null, data: [] };
          (l[0].utcOffset = null),
            (l[0].deposit = null !== this.bookable.depositData),
            (a.appointment.bookings[0].customFields = c),
            this.$root.settings.general.showClientTimeZone &&
              ((p = i()(p, "YYYY-MM-DD HH:mm")
                .utc()
                .format("YYYY-MM-DD HH:mm")),
              u.forEach(function (e) {
                (e.bookingStart = i()(e.bookingStart, "YYYY-MM-DD HH:mm")
                  .utc()
                  .format("YYYY-MM-DD HH:mm")),
                  (e.utcOffset = o.getClientUtcOffset(e.bookingStart));
              }),
              h.data.forEach(function (e) {
                (e.bookingStart = i()(e.bookingStart, "YYYY-MM-DD HH:mm")
                  .utc()
                  .format("YYYY-MM-DD HH:mm")),
                  (e.utcOffset = o.getClientUtcOffset(e.bookingStart));
              }),
              (l[0].utcOffset = this.getClientUtcOffset(p))),
            h.data.forEach(function (e) {
              e.notifyParticipants = o.appointment.notifyParticipants ? 1 : 0;
            });
          var f = {
            type: this.bookableType,
            bookings: l,
            payment: Object.assign(this.appointment.payment, { data: t }),
            recaptcha: this.recaptchaResponse,
            locale: window.localeLanguage[0],
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            couponCode: this.coupon && this.coupon.code ? this.coupon.code : "",
            componentProps: a,
            returnUrl: this.removeURLParameter(location.href, "ameliaCache"),
          };
          switch (this.bookableType) {
            case "appointment":
              f = Object.assign(f, {
                bookingStart: p,
                notifyParticipants: this.appointment.notifyParticipants ? 1 : 0,
                locationId: null !== this.location ? this.location.id : null,
                providerId: this.provider ? this.provider.id : null,
                serviceId: this.bookable.id,
                recurring: u,
                package: [],
              });
              break;
            case "package":
              f = Object.assign(f, {
                package: h.data,
                packageId: h.id,
                packageRules: h.rules,
                utcOffset: this.getClientUtcOffset(null),
                deposit: null !== this.bookable.depositData,
              });
              break;
            case "event":
              f = Object.assign(f, { eventId: this.bookable.id });
          }
          var g = null,
            b = null,
            v = !1;
          if (this.$refs.customFieldsFiles)
            for (var y = 0; y < this.$refs.customFieldsFiles.length; y++)
              if (this.$refs.customFieldsFiles[y].uploadFiles.length > 0) {
                v = !0;
                break;
              }
          if (v && !e) {
            for (var d in ((g = new FormData()), this.buildFormData(g, f), n)) {
              var k = n[d];
              if (n.hasOwnProperty(d) && k in this.$refs.customFieldsFiles)
                for (
                  var C = 0;
                  C < this.$refs.customFieldsFiles[k].uploadFiles.length;
                  C++
                )
                  g.append(
                    "files[" + d + "][" + C + "]",
                    this.$refs.customFieldsFiles[k].uploadFiles[C].raw
                  );
            }
            b = { headers: { "Content-Type": "multipart/form-data" } };
          } else (g = f), (b = {});
          return { data: g, options: b };
        },
        getFormattedAmount: function () {
          return this.getTotalPrice().toString();
        },
        handleSaveBookingErrors: function (e) {
          if ("data" in e) {
            if (
              ("onSitePayment" in e.data && e.data.onSitePayment
                ? ((this.appointment.payment.gateway = "onSite"),
                  this.saveBooking(this.getRequestData(!1)))
                : "afterFailedBooking" in window &&
                  window.afterFailedBooking(e.data),
              "customerAlreadyBooked" in e.data &&
                !0 === e.data.customerAlreadyBooked)
            )
              switch (((this.headerErrorShow = !0), this.bookableType)) {
                case "appointment":
                case "package":
                  this.headerErrorMessage =
                    this.$root.labels.customer_already_booked_app;
                  break;
                case "event":
                  this.headerErrorMessage =
                    this.$root.labels.customer_already_booked_ev;
              }
            if (
              "timeSlotUnavailable" in e.data &&
              !0 === e.data.timeSlotUnavailable
            )
              switch (((this.headerErrorShow = !0), this.bookableType)) {
                case "appointment":
                case "package":
                  this.headerErrorMessage =
                    this.$root.labels.time_slot_unavailable;
                  break;
                case "event":
                  this.headerErrorMessage =
                    this.$root.labels.maximum_capacity_reached;
              }
            else
              "emailError" in e.data && !0 === e.data.emailError
                ? (this.errors.email = this.$root.labels.email_exist_error)
                : "couponUnknown" in e.data && !0 === e.data.couponUnknown
                ? (this.errors.coupon = this.$root.labels.coupon_unknown)
                : "couponInvalid" in e.data && !0 === e.data.couponInvalid
                ? (this.errors.coupon = this.$root.labels.coupon_invalid)
                : "couponMissing" in e.data && !0 === e.data.couponMissing
                ? (this.errors.coupon = this.$root.labels.coupon_missing)
                : "paymentSuccessful" in e.data &&
                  !1 === e.data.paymentSuccessful
                ? ((this.headerErrorShow = !0),
                  (this.headerErrorMessage = this.$root.labels.payment_error))
                : "bookingAlreadyInWcCart" in e.data &&
                  !0 === e.data.bookingAlreadyInWcCart
                ? ((this.headerErrorShow = !0),
                  (this.headerErrorMessage =
                    this.$root.labels.booking_already_in_wc_cart))
                : "wcError" in e.data && !0 === e.data.wcError
                ? ((this.headerErrorShow = !0),
                  (this.headerErrorMessage = this.$root.labels.wc_error))
                : "recaptchaError" in e.data &&
                  !0 === e.data.recaptchaError &&
                  (this.errors.recaptcha =
                    this.$root.labels.recaptcha_invalid_error);
          }
          this.fetched = !0;
        },
        isRequiredAndValidRecaptcha: function () {
          return (
            (this.errors.recaptcha = ""),
            !(
              this.$root.settings.general.googleRecaptcha.enabled &&
              !this.$root.settings.general.googleRecaptcha.invisible &&
              !this.validRecaptcha
            ) ||
              ((this.errors.recaptcha = this.$root.labels.recaptcha_error), !1)
          );
        },
        validateFieldsForPayPal: function () {
          var e = this;
          if (
            (this.clearValidation(),
            /^\s/.test(this.appointment.bookings[0].customer.firstName) &&
              (this.appointment.bookings[0].customer.firstName =
                this.appointment.bookings[0].customer.firstName.substring(1)),
            /^\s/.test(this.appointment.bookings[0].customer.lastName) &&
              (this.appointment.bookings[0].customer.lastName =
                this.appointment.bookings[0].customer.lastName.substring(1)),
            (this.appointment.bookings[0].customer.email = this.trimValue(
              this.appointment.bookings[0].customer.email
            )),
            null !== this.payPalActions &&
              "payPal" === this.appointment.payment.gateway)
          ) {
            var t = !0,
              o = function (o) {
                if (!e.appointment.bookings[0].customFields.hasOwnProperty(o))
                  return "continue";
                var a = e.customFields.find(function (e) {
                  return parseInt(e.id) === parseInt(o);
                });
                e.isBookableCustomFieldVisible(a) &&
                  a.required &&
                  "file" !== a.type &&
                  ((Array.isArray(
                    e.appointment.bookings[0].customFields[o].value
                  ) &&
                    0 ===
                      e.appointment.bookings[0].customFields[o].value.length) ||
                    (!Array.isArray(
                      e.appointment.bookings[0].customFields[o].value
                    ) &&
                      (!e.appointment.bookings[0].customFields[o].value ||
                        "" ===
                          e.trimValue(
                            e.appointment.bookings[0].customFields[o].value
                          )))) &&
                  (t = !1);
              };
            for (var a in this.appointment.bookings[0].customFields) o(a);
            "" === this.appointment.bookings[0].customer.firstName ||
            (this.formsData[this.$options.name][this.bookableType]
              .itemsDraggable.lastNameFormField.required &&
              "" === this.appointment.bookings[0].customer.lastName) ||
            (this.formsData[this.$options.name][this.bookableType]
              .itemsDraggable.emailFormField.required &&
              "" === this.appointment.bookings[0].customer.email) ||
            (this.formsData[this.$options.name][this.bookableType]
              .itemsDraggable.phoneFormField.required &&
              "" === this.appointment.bookings[0].customer.phone) ||
            !t ||
            !this.validateUploadedFiles()
              ? this.payPalActions.disable()
              : this.payPalActions.enable();
          }
        },
        payPalInit: function () {
          var e = this,
            t = "";
          window.paypal.Button.render(
            {
              style: {
                size: "responsive",
                color: "gold",
                shape: "rect",
                tagLine: !1,
              },
              env: e.$root.settings.payments.payPal.sandboxMode
                ? "sandbox"
                : "production",
              client: {
                sandbox: e.$root.settings.payments.payPal.testApiClientId,
                production: e.$root.settings.payments.payPal.liveApiClientId,
              },
              commit: !0,
              onClick: function () {
                e.confirmBooking();
              },
              validate: function (t) {
                (e.payPalActions = t), e.validateFieldsForPayPal();
              },
              payment: function () {
                return (
                  (JSON.parse(
                    JSON.stringify(e.appointment.bookings)
                  )[0].extras = e.getExtras()),
                  window.paypal
                    .request({
                      method: "post",
                      url: e.$root.getAjaxUrl + "/payment/payPal",
                      json: e.getRequestData(!0).data,
                    })
                    .then(function (e) {
                      return (
                        (t = e.data.transactionReference), e.data.paymentID
                      );
                    })
                    .catch(function (t) {
                      e.parseError(t);
                    })
                );
              },
              onAuthorize: function (o, a) {
                return a.payment.get().then(function () {
                  var a = e.getRequestData(!1, {
                    transactionReference: t,
                    PaymentId: o.paymentID,
                    PayerId: o.payerID,
                  });
                  e.saveBooking(a);
                });
              },
              onCancel: function () {
                (e.fetched = !0), e.inlineSVG();
              },
              onError: function (t) {
                e.parseError(t);
              },
            },
            "#am-paypal-button-container"
          );
        },
        parseError: function (e) {
          var t = e.toString(),
            o = JSON.parse(
              JSON.stringify(
                JSON.parse(t.substring(t.indexOf("{"), t.lastIndexOf("}") + 1))
              )
            );
          "object" === (void 0 === o ? "undefined" : T(o)) &&
          o.hasOwnProperty("data")
            ? this.handleSaveBookingErrors(o)
            : ((this.headerErrorShow = !0),
              (this.headerErrorMessage = this.$root.labels.payment_error)),
            (this.fetched = !0),
            this.inlineSVG();
        },
        clearValidation: function () {
          void 0 !== this.$refs.booking && this.$refs.booking.clearValidate(),
            void 0 !== this.$refs.coupon && this.$refs.coupon.clearValidate();
          var e = this;
          if (
            (Object.keys(this.errors.files).forEach(function (t) {
              e.errors.files[t] = "";
            }),
            (this.errors.recaptcha = ""),
            this.errors.files)
          ) {
            var t = this.appointment.bookings[0].customer.firstName;
            (this.appointment.bookings[0].customer.firstName = t + "_"),
              (this.appointment.bookings[0].customer.firstName = t);
          }
        },
        handleResize: function () {
          var e = document.getElementById(this.containerId).offsetWidth;
          this.columnsLg = e < 670 ? 24 : 12;
        },
        addCustomFieldsValidationRules: function () {
          for (var e = 0; e < this.customFields.length; e++)
            if (
              this.isBookableCustomFieldVisible(this.customFields[e]) &&
              !0 === this.customFields[e].required
            ) {
              var t = [
                {
                  required: !0,
                  message: this.$root.labels.required_field,
                  trigger: "submit",
                },
              ];
              ("text" !== this.customFields[e].type &&
                "text-area" !== this.customFields[e].type) ||
                (t = [
                  {
                    required: !0,
                    message: this.$root.labels.required_field,
                    trigger: "submit",
                  },
                  {
                    validator: this.validateCustomFieldInput,
                    trigger: "submit",
                  },
                ]),
                this.$set(
                  this.rules,
                  "customFields." + this.customFields[e].id + ".value",
                  t
                );
            }
        },
        validateCustomFieldInput: function (e, t, o) {
          t && "" !== this.trimValue(t)
            ? o()
            : o(new Error(this.$root.labels.required_field));
        },
      },
      computed: {
        instantPaymentBasePriceData: function () {
          return this.getBookingBasePriceData("instant");
        },
        postponedPaymentBasePriceData: function () {
          return this.getBookingBasePriceData("postponed");
        },
        basePriceMultipleValue: function () {
          return this.bookable.aggregatedPrice
            ? this.appointment.bookings[0].persons
            : 1;
        },
        instantPaymentBookingsCount: function () {
          return 0 === this.recurringData.length
            ? 1
            : (this.recurringData.length < this.service.recurringPayment
                ? this.recurringData.length
                : this.service.recurringPayment) + 1;
        },
        depositAmount: function () {
          var e = this,
            t = 0,
            o = this.getTotalPrice();
          if (this.bookable.depositData)
            switch (this.bookable.depositData.depositPayment) {
              case "fixed":
                (t =
                  this.bookable.depositData.depositPerPerson &&
                  this.bookable.aggregatedPrice
                    ? this.appointment.bookings[0].persons *
                      this.bookable.depositData.deposit
                    : this.bookable.depositData.deposit),
                  "appointment" === this.bookableType &&
                    this.recurringData.forEach(function (o, a) {
                      e.instantPaymentBookingsCount - 1 > a
                        ? (t += e.bookable.depositData.depositPerPerson
                            ? e.appointment.bookings[0].persons *
                              o.depositData.deposit
                            : o.depositData.deposit)
                        : o.depositData && (o.depositData = null);
                    });
                break;
              case "percentage":
                t = (o / 100) * this.bookable.depositData.deposit;
            }
          return o > t ? t : 0;
        },
        paymentPeriodData: function () {
          var e = this,
            t = {},
            o = {};
          switch (this.bookableType) {
            case "appointment":
              (t[this.bookable.price] = {
                count: 1,
                price: this.bookable.price,
              }),
                this.recurringData.forEach(function (a, i) {
                  e.instantPaymentBookingsCount - 1 > i
                    ? a.price in t
                      ? t[a.price].count++
                      : (t[a.price] = { count: 1, price: a.price })
                    : a.price in o
                    ? o[a.price].count++
                    : (o[a.price] = { count: 1, price: a.price });
                });
              break;
            case "package":
            case "event":
              t[this.bookable.price] = { count: 1, price: this.bookable.price };
          }
          return { instant: t, postponed: o };
        },
        bookableConfirmStyle: function () {
          return this.hoverConfirm
            ? {
                color: this.bookable.color,
                borderColor: this.bookable.color,
                backgroundColor: this.bookable.color,
                opacity: 0.8,
              }
            : {
                color: "#ffffff",
                backgroundColor: this.bookable.color,
                borderColor: this.bookable.color,
                opacity: 1,
              };
        },
        bookableCancelStyle: function () {
          return this.hoverCancel
            ? {
                color: this.bookable.color,
                borderColor: this.bookable.color,
                backgroundColor: "",
                opacity: 0.7,
              }
            : {
                color: "",
                backgroundColor: "#ffffff",
                borderColor: "",
                opacity: 1,
              };
        },
        bookableCancelSpanStyle: function () {
          return this.hoverCancel
            ? {
                color: this.bookable.color,
                borderColor: "",
                backgroundColor: "",
                opacity: 0.9,
              }
            : { color: "", backgroundColor: "", borderColor: "", opacity: 1 };
        },
        selectedExtras: function () {
          return this.appointment.bookings[0].extras.filter(function (e) {
            return !0 === e.selected;
          });
        },
        paymentOptions: function () {
          var e = [];
          return (
            !0 === this.$root.settings.payments.onSite &&
              e.push({ value: "onSite", label: this.$root.labels.on_site }),
            this.$root.settings.payments.payPal.enabled &&
              e.push({ value: "payPal", label: this.$root.labels.pay_pal }),
            this.$root.settings.payments.stripe.enabled &&
              e.push({ value: "stripe", label: this.$root.labels.credit_card }),
            this.$root.settings.payments.wc.enabled &&
              e.push({ value: "wc", label: this.$root.labels.wc }),
            this.$root.settings.payments.mollie.enabled &&
              e.push({ value: "mollie", label: this.$root.labels.on_line }),
            e
          );
        },
        showConfirmBookingButton: function () {
          return (
            "onSite" === this.appointment.payment.gateway ||
            "wc" === this.appointment.payment.gateway ||
            "mollie" === this.appointment.payment.gateway ||
            "stripe" === this.appointment.payment.gateway ||
            ("payPal" === this.appointment.payment.gateway &&
              (0 === this.getTotalPrice() || "0" === this.getTotalPrice()))
          );
        },
      },
      components: {
        moment: i.a,
        VueRecaptcha: d.a,
        confirmHeadingDataFormField: u.a,
        recurringStringFormField: f.a,
        firstNameFormField: b.a,
        lastNameFormField: y.a,
        emailFormField: C.a,
        phoneFormField: F.a,
        paymentMethodFormField: w.a,
        stripeCardFormField: x.a,
      },
    };
  },
  761: function (e, t, o) {
    var a = o(685)(o(762), o(763), !1, null, null, null);
    e.exports = a.exports;
  },
  762: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = o(0),
      i = o.n(a),
      n = o(686),
      s = o(687),
      r = o(337);
    t.default = {
      name: "confirmHeadingDataFormField",
      props: {
        bookableStart: { type: String, default: "" },
        provider: { type: Object, default: function () {} },
        location: { type: Object, default: function () {} },
        formField: { type: Object, default: function () {} },
      },
      data: function () {
        return {
          labelEmployee:
            this.formField[this.$options.name].labels.employee.value,
          labelDate: this.formField[this.$options.name].labels.date_colon.value,
          labelTime: this.formField[this.$options.name].labels.time_colon.value,
          labelLocation:
            this.formField[this.$options.name].labels.location_colon.value,
          fieldVisibility: this.formField[this.$options.name].visibility,
        };
      },
      mixins: [n.a, s.a, r.a],
      methods: {
        getAppointmentDate: function () {
          return this.getFrontedFormattedDate(
            i()(this.bookableStart, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")
          );
        },
        getAppointmentTime: function () {
          return this.getFrontedFormattedTime(this.bookableStart.split(" ")[1]);
        },
      },
    };
  },
  763: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          o = e._self._c || t;
        return e.fieldVisibility
          ? o("div", { staticClass: "am-confirmation-booking-details" }, [
              o("div", [
                o("p", [
                  e._v(
                    "\n      " +
                      e._s(
                        e.labelEmployee ||
                          e.capitalizeFirstLetter(e.$root.labels.employee) + ":"
                      ) +
                      "\n    "
                  ),
                ]),
                e._v(" "),
                o("p", { staticClass: "am-semi-strong" }, [
                  o("img", {
                    staticClass: "am-employee-photo",
                    attrs: {
                      src: e.pictureLoad(e.provider, !0),
                      alt: e.provider.firstName + " " + e.provider.lastName,
                    },
                    on: {
                      error: function (t) {
                        return e.imageLoadError(e.provider, !0);
                      },
                    },
                  }),
                  e._v(
                    "\n      " +
                      e._s(e.provider.firstName + " " + e.provider.lastName) +
                      "\n    "
                  ),
                ]),
              ]),
              e._v(" "),
              o("div", [
                o("p", [e._v(e._s(e.labelDate || e.$root.labels.date_colon))]),
                e._v(" "),
                o("p", { staticClass: "am-semi-strong" }, [
                  e._v("\n      " + e._s(e.getAppointmentDate()) + "\n    "),
                ]),
              ]),
              e._v(" "),
              o("div", [
                o("p", [e._v(e._s(e.labelTime || e.$root.labels.time_colon))]),
                e._v(" "),
                o("p", { staticClass: "am-semi-strong" }, [
                  e._v("\n      " + e._s(e.getAppointmentTime()) + "\n    "),
                ]),
              ]),
              e._v(" "),
              null !== e.location
                ? o("div", [
                    o("p", [
                      e._v(
                        e._s(e.labelLocation || e.$root.labels.location_colon)
                      ),
                    ]),
                    e._v(" "),
                    o("p", { staticClass: "am-semi-strong" }, [
                      e._v(e._s(e.location ? e.location.name : "")),
                    ]),
                  ])
                : e._e(),
            ])
          : e._e();
      },
      staticRenderFns: [],
    };
  },
  764: function (e, t, o) {
    var a = o(685)(o(765), o(766), !1, null, null, null);
    e.exports = a.exports;
  },
  765: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.default = {
        name: "recurringStringFormField",
        props: {
          recurringString: { type: String, default: "" },
          formField: { type: Object, default: function () {} },
        },
        data: function () {
          return {
            labelRecurringActive:
              this.formField[this.$options.name].labels.recurring_active.value,
          };
        },
      });
  },
  766: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          o = e._self._c || t;
        return o(
          "div",
          { staticClass: "am-confirmation-booking-details recurring-string" },
          [
            o("div", [
              o("p", [
                e._v(
                  e._s(
                    e.labelRecurringActive || e.$root.labels.recurring_active
                  )
                ),
              ]),
              e._v(" "),
              o("p", { staticClass: "am-semi-strong" }, [
                e._v(e._s(e.recurringString)),
              ]),
            ]),
          ]
        );
      },
      staticRenderFns: [],
    };
  },
  767: function (e, t, o) {
    var a = o(685)(o(768), o(769), !1, null, null, null);
    e.exports = a.exports;
  },
  768: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.default = {
        name: "firstNameFormField",
        props: {
          appointment: { type: Object, default: function () {} },
          columnsLg: { type: Number, default: 12 },
          formValidOptions: { type: Object, default: function () {} },
          errors: { type: Object, default: function () {} },
          classIdentifier: { type: String, default: "" },
          formField: { type: Object, default: function () {} },
        },
        data: function () {
          return {
            firstNameLabel: this.formField.labels.first_name_colon.value,
          };
        },
        methods: {
          inputChanges: function () {
            this.$emit("inputChanges");
          },
        },
        watch: {
          formValidOptions: function () {
            this.formValidOptions["customer.firstName"] &&
              this.$refs["customer.firstName"].$el.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "nearest",
              });
          },
        },
      });
  },
  769: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          o = e._self._c || t;
        return o(
          "el-col",
          { ref: "customer.firstName", attrs: { sm: e.columnsLg } },
          [
            o(
              "el-form-item",
              {
                class: e.$root.settings.customization.forms
                  ? "am-input-" + e.classIdentifier
                  : "",
                attrs: {
                  prop: "customer.firstName",
                  label: e.firstNameLabel || e.$root.labels.first_name_colon,
                },
              },
              [
                o("el-input", {
                  attrs: {
                    disabled:
                      !!e.appointment.bookings[0].customer.firstName &&
                      !!e.appointment.bookings[0].customer.id,
                    autocomplete: "new-password",
                  },
                  on: { input: e.inputChanges },
                  model: {
                    value: e.appointment.bookings[0].customer.firstName,
                    callback: function (t) {
                      e.$set(
                        e.appointment.bookings[0].customer,
                        "firstName",
                        t
                      );
                    },
                    expression: "appointment.bookings[0].customer.firstName",
                  },
                }),
              ],
              1
            ),
          ],
          1
        );
      },
      staticRenderFns: [],
    };
  },
  770: function (e, t, o) {
    var a = o(685)(o(771), o(772), !1, null, null, null);
    e.exports = a.exports;
  },
  771: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.default = {
        name: "lastNameFormField",
        props: {
          appointment: { type: Object, default: function () {} },
          columnsLg: { type: Number, default: 12 },
          formValidOptions: { type: Object, default: function () {} },
          errors: { type: Object, default: function () {} },
          classIdentifier: { type: String, default: "" },
          formField: { type: Object, default: function () {} },
        },
        data: function () {
          return { lastNameLabel: this.formField.labels.last_name_colon.value };
        },
        methods: {
          inputChanges: function () {
            this.$emit("inputChanges");
          },
        },
        watch: {
          formValidOptions: function () {
            this.formValidOptions["customer.lastName"] &&
              this.$refs["customer.lastName"].$el.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "nearest",
              });
          },
        },
      });
  },
  772: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          o = e._self._c || t;
        return e.formField.visibility
          ? o(
              "el-col",
              { ref: "customer.lastName", attrs: { sm: e.columnsLg } },
              [
                o(
                  "el-form-item",
                  {
                    class: e.$root.settings.customization.forms
                      ? "am-input-" + e.classIdentifier
                      : "",
                    attrs: {
                      prop: "customer.lastName",
                      label: e.lastNameLabel || e.$root.labels.last_name_colon,
                    },
                  },
                  [
                    o("el-input", {
                      attrs: {
                        disabled:
                          !!e.appointment.bookings[0].customer.lastName &&
                          !!e.appointment.bookings[0].customer.id,
                        autocomplete: "new-password",
                      },
                      on: { input: e.inputChanges },
                      model: {
                        value: e.appointment.bookings[0].customer.lastName,
                        callback: function (t) {
                          e.$set(
                            e.appointment.bookings[0].customer,
                            "lastName",
                            t
                          );
                        },
                        expression: "appointment.bookings[0].customer.lastName",
                      },
                    }),
                  ],
                  1
                ),
              ],
              1
            )
          : e._e();
      },
      staticRenderFns: [],
    };
  },
  773: function (e, t, o) {
    var a = o(685)(o(774), o(775), !1, null, null, null);
    e.exports = a.exports;
  },
  774: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.default = {
        name: "emailFormField",
        props: {
          appointment: { type: Object, default: function () {} },
          columnsLg: { type: Number, default: 12 },
          formValidOptions: { type: Object, default: function () {} },
          errors: { type: Object, default: function () {} },
          classIdentifier: { type: String, default: "" },
          formField: { type: Object, default: function () {} },
        },
        data: function () {
          return { emailLabel: this.formField.labels.email_colon.value };
        },
        methods: {
          inputChanges: function () {
            this.$emit("inputChanges");
          },
        },
        watch: {
          formValidOptions: function () {
            this.formValidOptions["customer.email"] &&
              this.$refs["customer.email"].$el.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "nearest",
              });
          },
        },
      });
  },
  775: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          o = e._self._c || t;
        return e.formField.visibility
          ? o(
              "el-col",
              { ref: "customer.email", attrs: { sm: e.columnsLg } },
              [
                o(
                  "el-form-item",
                  {
                    class: e.$root.settings.customization.forms
                      ? "am-input-" + e.classIdentifier
                      : "",
                    attrs: {
                      prop: "customer.email",
                      error: e.errors.email,
                      label: e.emailLabel || e.$root.labels.email_colon,
                    },
                  },
                  [
                    o("el-input", {
                      attrs: {
                        disabled:
                          !!e.appointment.bookings[0].customer.email &&
                          !!e.appointment.bookings[0].customer.id,
                        placeholder: e.$root.labels.email_placeholder,
                        autocomplete: "new-password",
                      },
                      on: { input: e.inputChanges },
                      model: {
                        value: e.appointment.bookings[0].customer.email,
                        callback: function (t) {
                          e.$set(
                            e.appointment.bookings[0].customer,
                            "email",
                            t
                          );
                        },
                        expression: "appointment.bookings[0].customer.email",
                      },
                    }),
                  ],
                  1
                ),
              ],
              1
            )
          : e._e();
      },
      staticRenderFns: [],
    };
  },
  776: function (e, t, o) {
    var a = o(685)(o(777), o(778), !1, null, null, null);
    e.exports = a.exports;
  },
  777: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = o(696),
      i = o.n(a);
    t.default = {
      name: "phoneFormField",
      components: { phoneInput: i.a },
      props: {
        appointment: { type: Object, default: function () {} },
        columnsLg: { type: Number, default: 12 },
        formValidOptions: { type: Object, default: function () {} },
        errors: { type: Object, default: function () {} },
        phonePopulated: { type: Boolean, default: null },
        classIdentifier: { type: String, default: "" },
        formField: { type: Object, default: function () {} },
      },
      data: function () {
        return { firstNameLabel: this.formField.labels.phone_colon.value };
      },
      methods: {
        inputChanges: function () {
          this.$emit("inputChanges");
        },
        phoneFormatted: function (e, t) {
          (this.appointment.bookings[0].customer.phone = e),
            (this.appointment.bookings[0].customer.countryPhoneIso = t);
        },
      },
      watch: {
        formValidOptions: function () {
          this.formValidOptions["customer.phone"] &&
            this.$refs["customer.phone"].$el.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "nearest",
            });
        },
      },
    };
  },
  778: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          o = e._self._c || t;
        return e.formField.visibility
          ? o(
              "el-col",
              { ref: "customer.phone", attrs: { sm: e.columnsLg } },
              [
                o(
                  "el-form-item",
                  {
                    class: e.$root.settings.customization.forms
                      ? "am-input-" + e.classIdentifier
                      : "",
                    attrs: {
                      prop: "customer.phone",
                      label: e.firstNameLabel || e.$root.labels.phone_colon,
                      error: e.errors.phone,
                    },
                  },
                  [
                    o("phone-input", {
                      attrs: {
                        "dropdown-class": "am-dropdown-" + e.classIdentifier,
                        savedPhone: e.appointment.bookings[0].customer.phone,
                        disabled:
                          !!e.appointment.bookings[0].customer.id &&
                          !0 === e.phonePopulated,
                        countryPhoneIso:
                          e.appointment.bookings[0].customer.countryPhoneIso,
                      },
                      on: { phoneFormatted: e.phoneFormatted },
                      nativeOn: {
                        keyup: function (t) {
                          return e.inputChanges(t);
                        },
                      },
                    }),
                  ],
                  1
                ),
              ],
              1
            )
          : e._e();
      },
      staticRenderFns: [],
    };
  },
  779: function (e, t, o) {
    var a = o(685)(o(780), o(781), !1, null, null, null);
    e.exports = a.exports;
  },
  780: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.default = {
        name: "paymentMethodFormField",
        props: {
          totalPrice: { type: String },
          bookableColor: { type: String },
          paymentOptions: {
            type: Array,
            default: function () {
              return [];
            },
          },
          appointment: { type: Object, default: function () {} },
          classIdentifier: { type: String, default: "" },
          formField: { type: Object, default: function () {} },
        },
        data: function () {
          return {
            labelPaymentMethod:
              this.formField[this.$options.name].labels.payment_method_colon
                .value,
          };
        },
        mounted: function () {},
        methods: {
          changeItem: function () {
            this.$emit("changeItem");
          },
        },
      });
  },
  781: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          o = e._self._c || t;
        return e.totalPrice > 0 &&
          !this.$root.settings.payments.wc.enabled &&
          e.paymentOptions.length > 1
          ? o(
              "el-form-item",
              {
                class: e.$root.settings.customization.forms
                  ? "am-select-" + e.classIdentifier
                  : "",
              },
              [
                o("template", { slot: "label" }, [
                  o("span", { style: { fontWeight: 700 } }, [
                    e._v(
                      "\n      " +
                        e._s(
                          e.labelPaymentMethod ||
                            e.$root.labels.payment_method_colon
                        ) +
                        "\n    "
                    ),
                  ]),
                ]),
                e._v(" "),
                o(
                  "el-select",
                  {
                    attrs: {
                      "popper-class": e.$root.settings.customization.forms
                        ? "am-dropdown-" + e.classIdentifier
                        : "",
                      placeholder: "",
                    },
                    on: { change: e.changeItem },
                    model: {
                      value: e.appointment.payment.gateway,
                      callback: function (t) {
                        e.$set(e.appointment.payment, "gateway", t);
                      },
                      expression: "appointment.payment.gateway",
                    },
                  },
                  e._l(e.paymentOptions, function (t) {
                    return o("el-option", {
                      key: t.value,
                      style: {
                        color:
                          e.appointment.payment.gateway === t.value
                            ? e.bookableColor
                            : "",
                      },
                      attrs: { label: t.label, value: t.value },
                    });
                  }),
                  1
                ),
              ],
              2
            )
          : e._e();
      },
      staticRenderFns: [],
    };
  },
  782: function (e, t, o) {
    var a = o(685)(o(783), o(784), !1, null, null, null);
    e.exports = a.exports;
  },
  783: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.default = {
        name: "stripeCardFormField",
        props: {
          totalPrice: { type: String },
          errors: {
            type: Object,
            default: function () {
              return {};
            },
          },
          appointment: {
            type: Object,
            default: function () {
              return {};
            },
          },
          stripePayment: {
            type: Object,
            default: function () {
              return { stripe: null, cardElement: null };
            },
          },
          classIdentifier: { type: String, default: "" },
          formField: {
            type: Object,
            default: function () {
              return {};
            },
          },
        },
        data: function () {
          return {
            labelCreditCard:
              this.formField[this.$options.name].labels
                .credit_or_debit_card_colon.value,
          };
        },
        mounted: function () {
          this.$root.settings.payments.stripe.enabled && this.stripeInit();
        },
        methods: {
          stripeInit: function () {
            this.stripePayment.stripe = Stripe(this.getStripePublishableKey());
            var e = this.stripePayment.stripe.elements({
              locale: window.localeLanguage[0].replace("_", "-"),
            });
            (this.stripePayment.cardElement = e.create("card")),
              this.stripePayment.cardElement.mount(
                "#card-element-" + this.$root.shortcodeData.counter
              );
          },
          getStripePublishableKey: function () {
            return !1 === this.$root.settings.payments.stripe.testMode
              ? this.$root.settings.payments.stripe.livePublishableKey
              : this.$root.settings.payments.stripe.testPublishableKey;
          },
        },
      });
  },
  784: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          o = e._self._c || t;
        return o(
          "transition",
          { attrs: { name: "fade" } },
          [
            o(
              "el-form-item",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value:
                      "stripe" === e.appointment.payment.gateway &&
                      e.totalPrice > 0,
                    expression:
                      "appointment.payment.gateway === 'stripe' && totalPrice > 0",
                  },
                ],
                class: e.$root.settings.customization.forms
                  ? "am-block-" + e.classIdentifier
                  : "",
                attrs: { error: e.errors.stripe },
              },
              [
                o("template", { slot: "label" }, [
                  o("span", { style: { fontWeight: 700 } }, [
                    e._v(
                      "\n        " +
                        e._s(
                          e.labelCreditCard ||
                            e.$root.labels.credit_or_debit_card_colon
                        ) +
                        "\n      "
                    ),
                  ]),
                ]),
                e._v(" "),
                o("div", {
                  staticClass: "am-stripe",
                  attrs: {
                    id: "card-element-" + this.$root.shortcodeData.counter,
                  },
                }),
              ],
              2
            ),
          ],
          1
        );
      },
      staticRenderFns: [],
    };
  },
  785: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          o = e._self._c || t;
        return o(
          "div",
          {
            staticClass: "am-confirmation-booking",
            class: [
              e.dialogClass,
              e.$root.settings.customization.forms
                ? "am-form-" +
                  e.formType +
                  "-" +
                  e.formName +
                  "-" +
                  e.bookableType
                : "",
            ],
            attrs: { id: "am-confirm-booking" },
          },
          [
            o(
              "div",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: e.fetched,
                    expression: "fetched",
                  },
                ],
              },
              [
                o(
                  "div",
                  { staticClass: "am-payment-error" },
                  [
                    o("el-alert", {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: e.headerErrorShow,
                          expression: "headerErrorShow",
                        },
                      ],
                      attrs: {
                        id: "am-payment-error-" + e.$root.shortcodeData.counter,
                        title:
                          "" !== e.headerErrorMessage
                            ? e.headerErrorMessage
                            : e.$root.labels.payment_error,
                        type: "warning",
                        "show-icon": "",
                      },
                    }),
                  ],
                  1
                ),
                e._v(" "),
                "appointment" === e.bookableType && e.serviceHeadingVisibility
                  ? o(
                      "div",
                      {
                        directives: [
                          {
                            name: "show",
                            rawName: "v-show",
                            value: e.fetched,
                            expression: "fetched",
                          },
                        ],
                        staticClass: "am-confirmation-booking-header",
                      },
                      [
                        o("img", {
                          attrs: {
                            src: e.pictureLoad(e.bookable, !1),
                            alt: e.bookable.name,
                          },
                          on: {
                            error: function (t) {
                              return e.imageLoadError(e.bookable, !1);
                            },
                          },
                        }),
                        e._v(" "),
                        o(
                          "h2",
                          {
                            class:
                              "am-block-" +
                              e.formType +
                              "-" +
                              e.formName +
                              "-" +
                              e.bookableType,
                            style: {
                              fontWeight: 500,
                              fontFamily: e.$root.settings.customization.font,
                            },
                          },
                          [
                            e._v(
                              "\n        " + e._s(e.bookable.name) + "\n      "
                            ),
                          ]
                        ),
                      ]
                    )
                  : e._e(),
                e._v(" "),
                "package" === e.bookableType && e.hasHeader
                  ? o(
                      "div",
                      {
                        staticClass: "am-confirmation-booking-package-wrapper",
                      },
                      [
                        o("div", { staticClass: "am-package-header" }, [
                          o(
                            "div",
                            {
                              staticClass:
                                "am-package-header-image-data-wrapper",
                            },
                            [
                              o("div", { staticClass: "am-package-image" }, [
                                o("img", {
                                  attrs: { src: e.pictureLoad(e.bookable, !1) },
                                  on: {
                                    error: function (t) {
                                      return e.imageLoadError(e.bookable, !1);
                                    },
                                  },
                                }),
                                e._v(" "),
                                o(
                                  "span",
                                  {
                                    style: {
                                      "background-color": e.bookable.color,
                                    },
                                  },
                                  [
                                    o("img", {
                                      attrs: {
                                        src:
                                          e.$root.getUrl +
                                          "public/img/am-package-catalog.svg",
                                      },
                                    }),
                                  ]
                                ),
                              ]),
                              e._v(" "),
                              o("div", { staticClass: "am-package-data" }, [
                                o("div", { staticClass: "am-package-title" }, [
                                  o(
                                    "h2",
                                    {
                                      style: {
                                        fontWeight: 500,
                                        fontFamily:
                                          e.$root.settings.customization.font,
                                      },
                                    },
                                    [
                                      e._v(
                                        "\n                " +
                                          e._s(e.bookable.name) +
                                          "\n              "
                                      ),
                                    ]
                                  ),
                                ]),
                              ]),
                            ]
                          ),
                          e._v(" "),
                          e.bookable.price
                            ? o("div", { staticClass: "am-package-price" }, [
                                o(
                                  "div",
                                  {
                                    staticClass: "am-package-price__wrapper",
                                    class: {
                                      "am-service-price__wrapper-discount":
                                        e.bookable.discount &&
                                        !e.bookable.calculatedPrice,
                                    },
                                  },
                                  [
                                    e._v(
                                      "\n            " +
                                        e._s(
                                          e.getFormattedPrice(
                                            e.bookable.price,
                                            !e.$root.settings.payments
                                              .hideCurrencySymbolFrontend
                                          )
                                        ) +
                                        "\n          "
                                    ),
                                  ]
                                ),
                                e._v(" "),
                                e.bookable.discount &&
                                !e.bookable.calculatedPrice
                                  ? o(
                                      "div",
                                      {
                                        staticClass:
                                          "am-package-price__discount",
                                      },
                                      [
                                        o("img", {
                                          staticClass:
                                            "am-package-price__discount-image",
                                          attrs: {
                                            src:
                                              e.$root.getUrl +
                                              "public/img/am-package-catalog.svg",
                                          },
                                        }),
                                        e._v(" "),
                                        o(
                                          "div",
                                          {
                                            staticClass:
                                              "am-package-price__discount-text",
                                          },
                                          [
                                            e._v(
                                              "\n              " +
                                                e._s(
                                                  e.$root.labels
                                                    .package_discount_text +
                                                    " " +
                                                    e.bookable.discount +
                                                    "%"
                                                ) +
                                                "\n            "
                                            ),
                                          ]
                                        ),
                                      ]
                                    )
                                  : e._e(),
                              ])
                            : e._e(),
                        ]),
                      ]
                    )
                  : e._e(),
                e._v(" "),
                o(
                  "el-form",
                  {
                    ref: "booking",
                    staticClass: "am-confirm-booking-form",
                    attrs: {
                      model: e.appointment.bookings[0],
                      rules: e.rules,
                      "label-position": "top",
                    },
                    on: {
                      submit: function (t) {
                        return t.preventDefault(), e.onSubmit(t);
                      },
                    },
                  },
                  [
                    o(
                      "el-row",
                      {
                        staticClass: "am-confirm-booking-data",
                        attrs: { gutter: 24 },
                      },
                      [
                        "appointment" === e.bookableType
                          ? o(
                              "el-col",
                              { attrs: { sm: 24 } },
                              [
                                o("confirm-heading-data-form-field", {
                                  attrs: {
                                    "bookable-start": e.bookable.bookingStart,
                                    provider: e.provider,
                                    location: e.location,
                                    "form-field":
                                      e.formsData[e.formName][e.bookableType]
                                        .itemsStatic,
                                  },
                                }),
                              ],
                              1
                            )
                          : e._e(),
                        e._v(" "),
                        e.recurringData.length && e.recurringStringVisibility
                          ? o(
                              "el-col",
                              { attrs: { sm: 24 } },
                              [
                                o("recurring-string-form-field", {
                                  attrs: {
                                    "recurring-string": e.recurringString,
                                    "form-field":
                                      e.formsData[e.formName][e.bookableType]
                                        .itemsStatic,
                                  },
                                }),
                              ],
                              1
                            )
                          : e._e(),
                        e._v(" "),
                        e._l(
                          e.formsData[e.formName][e.bookableType]
                            .itemsDraggable,
                          function (t, a) {
                            return [
                              o(a, {
                                tag: "component",
                                attrs: {
                                  appointment: e.appointment,
                                  "columns-lg": e.columnsLg,
                                  "form-valid-options": e.formValidOptions,
                                  errors: e.errors,
                                  "phone-populated": e.phonePopulated,
                                  "class-identifier":
                                    e.formType +
                                    "-" +
                                    e.formName +
                                    "-" +
                                    e.bookableType,
                                  formField: t,
                                },
                                on: { inputChanges: e.validateFieldsForPayPal },
                              }),
                            ];
                          }
                        ),
                        e._v(" "),
                        o(
                          "div",
                          { staticClass: "am-custom-fields" },
                          [
                            o(
                              "el-row",
                              { attrs: { gutter: 24 } },
                              [
                                e._l(e.customFields, function (t, a) {
                                  return e.isBookableCustomFieldVisible(t)
                                    ? o(
                                        "el-col",
                                        {
                                          key: t.id,
                                          ref:
                                            "customFields." + t.id + ".value",
                                          refInFor: !0,
                                          attrs: { sm: 24 }, //p2p: display one row per custom field
                                        },
                                        [
                                          o(
                                            "el-form-item",
                                            {
                                              class: [
                                                e.getCustomFieldClass(t),
                                                e.$root.settings.customization
                                                  .forms
                                                  ? "am-custom-" +
                                                    e.formType +
                                                    "-" +
                                                    e.formName +
                                                    "-" +
                                                    e.bookableType
                                                  : "",
                                              ],
                                              attrs: {
                                                label:
                                                  "content" !== t.type &&
                                                  t.label
                                                    ? t.label
                                                    : ":",
                                                prop:
                                                  !0 === t.required &&
                                                  "content" !== t.type &&
                                                  "file" !== t.type
                                                    ? "customFields." +
                                                      t.id +
                                                      ".value"
                                                    : !0 === t.required &&
                                                      "file" !== t.type
                                                    ? "inputFile"
                                                    : null,
                                                error:
                                                  e.errors.files &&
                                                  "file" === t.type &&
                                                  t.required
                                                    ? e.errors.files[
                                                        "files" + t.id
                                                      ]
                                                    : null,
                                              },
                                            },
                                            [
                                              "text" === t.type
                                                ? o("el-input", {
                                                    attrs: { placeholder: "" },
                                                    on: {
                                                      input: function (t) {
                                                        return e.validateFieldsForPayPal();
                                                      },
                                                    },
                                                    model: {
                                                      value:
                                                        e.appointment
                                                          .bookings[0]
                                                          .customFields[t.id]
                                                          .value,
                                                      callback: function (o) {
                                                        e.$set(
                                                          e.appointment
                                                            .bookings[0]
                                                            .customFields[t.id],
                                                          "value",
                                                          o
                                                        );
                                                      },
                                                      expression:
                                                        "appointment.bookings[0].customFields[customField.id].value",
                                                    },
                                                  })
                                                : "text-area" === t.type
                                                ? o("el-input", {
                                                    staticClass:
                                                      "am-front-texarea",
                                                    attrs: {
                                                      placeholder: "",
                                                      type: "textarea",
                                                      rows: 3,
                                                    },
                                                    on: {
                                                      input: function (t) {
                                                        return e.validateFieldsForPayPal();
                                                      },
                                                    },
                                                    model: {
                                                      value:
                                                        e.appointment
                                                          .bookings[0]
                                                          .customFields[t.id]
                                                          .value,
                                                      callback: function (o) {
                                                        e.$set(
                                                          e.appointment
                                                            .bookings[0]
                                                            .customFields[t.id],
                                                          "value",
                                                          o
                                                        );
                                                      },
                                                      expression:
                                                        "appointment.bookings[0].customFields[customField.id].value",
                                                    },
                                                  })
                                                : "content" === t.type
                                                ? o(
                                                    "div",
                                                    {
                                                      staticClass:
                                                        "am-text-content",
                                                    },
                                                    [
                                                      o("i", {
                                                        staticClass:
                                                          "el-icon-info",
                                                      }),
                                                      e._v(" "),
                                                      o("p", {
                                                        staticStyle: {
                                                          display: "inline",
                                                        },
                                                        domProps: {
                                                          innerHTML: e._s(
                                                            t.label
                                                          ),
                                                        },
                                                      }),
                                                    ]
                                                  )
                                                : "select" === t.type
                                                ? o(
                                                    "el-select",
                                                    {
                                                      attrs: {
                                                        "popper-class": e.$root
                                                          .settings
                                                          .customization.forms
                                                          ? "am-dropdown-" +
                                                            e.formType +
                                                            "-" +
                                                            e.formName +
                                                            "-" +
                                                            e.bookableType
                                                          : "",
                                                        placeholder: "",
                                                        clearable: "",
                                                      },
                                                      on: {
                                                        change: function (t) {
                                                          return e.validateFieldsForPayPal();
                                                        },
                                                      },
                                                      model: {
                                                        value:
                                                          e.appointment
                                                            .bookings[0]
                                                            .customFields[t.id]
                                                            .value,
                                                        callback: function (o) {
                                                          e.$set(
                                                            e.appointment
                                                              .bookings[0]
                                                              .customFields[
                                                              t.id
                                                            ],
                                                            "value",
                                                            o
                                                          );
                                                        },
                                                        expression:
                                                          "appointment.bookings[0].customFields[customField.id].value",
                                                      },
                                                    },
                                                    e._l(
                                                      e.getCustomFieldOptions(
                                                        t.options
                                                      ),
                                                      function (a, i) {
                                                        return o("el-option", {
                                                          key: i,
                                                          style: {
                                                            color:
                                                              e.appointment
                                                                .bookings[0]
                                                                .customFields[
                                                                t.id
                                                              ].value === a
                                                                ? e.bookable
                                                                    .color
                                                                : "",
                                                          },
                                                          attrs: {
                                                            value: a,
                                                            label: a,
                                                          },
                                                        });
                                                      }
                                                    ),
                                                    1
                                                  )
                                                : "checkbox" === t.type
                                                ? o(
                                                    "el-checkbox-group",
                                                    {
                                                      on: {
                                                        change:
                                                          e.selectedCustomFieldValue,
                                                      },
                                                      model: {
                                                        value:
                                                          e.appointment
                                                            .bookings[0]
                                                            .customFields[t.id]
                                                            .value,
                                                        callback: function (o) {
                                                          e.$set(
                                                            e.appointment
                                                              .bookings[0]
                                                              .customFields[
                                                              t.id
                                                            ],
                                                            "value",
                                                            o
                                                          );
                                                        },
                                                        expression:
                                                          "appointment.bookings[0].customFields[customField.id].value",
                                                      },
                                                    },
                                                    e._l(
                                                      e.getCustomFieldOptions(
                                                        t.options
                                                      ),
                                                      function (e, t) {
                                                        return o(
                                                          "el-checkbox",
                                                          {
                                                            key: t,
                                                            attrs: { label: e },
                                                          }
                                                        );
                                                      }
                                                    ),
                                                    1
                                                  )
                                                : "radio" === t.type
                                                ? o(
                                                    "el-radio-group",
                                                    {
                                                      on: {
                                                        change:
                                                          e.selectedCustomFieldValue,
                                                      },
                                                      model: {
                                                        value:
                                                          e.appointment
                                                            .bookings[0]
                                                            .customFields[t.id]
                                                            .value,
                                                        callback: function (o) {
                                                          e.$set(
                                                            e.appointment
                                                              .bookings[0]
                                                              .customFields[
                                                              t.id
                                                            ],
                                                            "value",
                                                            o
                                                          );
                                                        },
                                                        expression:
                                                          "appointment.bookings[0].customFields[customField.id].value",
                                                      },
                                                    },
                                                    e._l(
                                                      e.getCustomFieldOptions(
                                                        t.options
                                                      ),
                                                      function (e, t) {
                                                        return o("el-radio", {
                                                          key: t,
                                                          ref: "customFieldsRadioButtons",
                                                          refInFor: !0,
                                                          attrs: { label: e },
                                                        });
                                                      }
                                                    ),
                                                    1
                                                  )
                                                : e._e(),
                                              e._v(" "),
                                              "file" === t.type
                                                ? o(
                                                    "div",
                                                    [
                                                      o(
                                                        "el-upload",
                                                        {
                                                          ref: "customFieldsFiles",
                                                          refInFor: !0,
                                                          attrs: {
                                                            "auto-upload": !1,
                                                            action: "",
                                                            drag: "",
                                                            accept:
                                                              e.$root.fileUploadExtensions.join(
                                                                ","
                                                              ),
                                                            "on-change":
                                                              e.onSelectFiles,
                                                            multiple: "",
                                                          },
                                                        },
                                                        [
                                                          o("i", {
                                                            staticClass:
                                                              "el-icon-upload",
                                                          }),
                                                          o("span", [
                                                            e._v(
                                                              e._s(
                                                                e.$root.labels
                                                                  .file_upload
                                                              )
                                                            ),
                                                          ]),
                                                        ]
                                                      ),
                                                    ],
                                                    1
                                                  )
                                                : e._e(),
                                              e._v(" "),
                                              "datepicker" === t.type
                                                ? o(
                                                    "div",
                                                    [
                                                      o("v-date-picker", {
                                                        staticClass:
                                                          "am-calendar-picker",
                                                        attrs: {
                                                          mode: "single",
                                                          "popover-visibility":
                                                            "focus",
                                                          "popover-direction":
                                                            "top",
                                                          "popover-align":
                                                            e.screenWidth < 768
                                                              ? "center"
                                                              : "left",
                                                          "tint-color":
                                                            "#1A84EE",
                                                          "show-day-popover":
                                                            !1,
                                                          "input-props": {
                                                            class:
                                                              "el-input__inner",
                                                          },
                                                          "input-class":
                                                            "el-input__inner",
                                                          "is-expanded": !1,
                                                          "is-required": !0,
                                                          disabled: !1,
                                                          formats:
                                                            e.vCalendarFormats,
                                                        },
                                                        on: {
                                                          input: function (t) {
                                                            return e.validateFieldsForPayPal();
                                                          },
                                                        },
                                                        model: {
                                                          value:
                                                            e.appointment
                                                              .bookings[0]
                                                              .customFields[
                                                              t.id
                                                            ].value,
                                                          callback: function (
                                                            o
                                                          ) {
                                                            e.$set(
                                                              e.appointment
                                                                .bookings[0]
                                                                .customFields[
                                                                t.id
                                                              ],
                                                              "value",
                                                              o
                                                            );
                                                          },
                                                          expression:
                                                            "appointment.bookings[0].customFields[customField.id].value",
                                                        },
                                                      }),
                                                    ],
                                                    1
                                                  )
                                                : e._e(),
                                            ],
                                            1
                                          ),
                                        ],
                                        1
                                      )
                                    : e._e();
                                }),
                                e._v(" "),
                                e.$root.settings.general.googleRecaptcha.enabled
                                  ? o(
                                      "el-col",
                                      {
                                        class: e.$root.settings.general
                                          .googleRecaptcha.invisible
                                          ? ""
                                          : "am-confirm-booking-recaptcha",
                                        attrs: { sm: e.columnsLg },
                                      },
                                      [
                                        o(
                                          "el-form-item",
                                          {
                                            attrs: {
                                              error: e.errors.recaptcha,
                                            },
                                          },
                                          [
                                            o(
                                              "div",
                                              { attrs: { id: "recaptcha" } },
                                              [
                                                o("vue-recaptcha", {
                                                  ref: "recaptcha",
                                                  staticClass:
                                                    "am-confirm-booking-recaptcha-block",
                                                  attrs: {
                                                    size: e.$root.settings
                                                      .general.googleRecaptcha
                                                      .invisible
                                                      ? "invisible"
                                                      : null,
                                                    loadRecaptchaScript: !0,
                                                    sitekey:
                                                      e.$root.settings.general
                                                        .googleRecaptcha
                                                        .siteKey,
                                                  },
                                                  on: {
                                                    verify: e.onRecaptchaVerify,
                                                    expired:
                                                      e.onRecaptchaExpired,
                                                  },
                                                }),
                                              ],
                                              1
                                            ),
                                          ]
                                        ),
                                      ],
                                      1
                                    )
                                  : e._e(),
                              ],
                              2
                            ),
                          ],
                          1
                        ),
                      ],
                      2
                    ),
                    e._v(" "),
                    o(
                      "el-row",
                      {
                        staticClass: "am-confirm-booking-payment",
                        attrs: { gutter: 24 },
                      },
                      [
                        o(
                          "el-col",
                          { attrs: { sm: e.columnsLg } },
                          [
                            o("payment-method-form-field", {
                              attrs: {
                                "total-price": e.getTotalPrice(),
                                "bookable-color": e.bookable.color,
                                "payment-options": e.paymentOptions,
                                appointment: e.appointment,
                                classIdentifier:
                                  e.formType +
                                  "-" +
                                  e.formName +
                                  "-" +
                                  e.bookableType,
                                "form-field":
                                  e.formsData[e.formName][e.bookableType]
                                    .itemsStatic,
                              },
                              on: {
                                changeItem: function (t) {
                                  return e.validateFieldsForPayPal();
                                },
                              },
                            }),
                          ],
                          1
                        ),
                        e._v(" "),
                        o(
                          "el-col",
                          { attrs: { sm: e.columnsLg } },
                          [
                            o("stripe-card-form-field", {
                              attrs: {
                                appointment: e.appointment,
                                errors: e.errors,
                                "total-price": e.getTotalPrice(),
                                "stripe-payment": e.stripePayment,
                                "class-identifier":
                                  e.formType +
                                  "-" +
                                  e.formName +
                                  "-" +
                                  e.bookableType,
                                "form-field":
                                  e.formsData[e.formName][e.bookableType]
                                    .itemsStatic,
                              },
                            }),
                          ],
                          1
                        ),
                      ],
                      1
                    ),
                    e._v(" "),
                    o(
                      "el-row",
                      [
                        o("el-col", { attrs: { sm: 24 } }, [
                          e.packageData
                            ? o(
                                "div",
                                {
                                  staticClass:
                                    "am-confirmation-total am-confirmation-booking-cost",
                                  style: {
                                    "background-color":
                                      "event" !== e.bookableType ||
                                      e.useGlobalCustomization
                                        ? ""
                                        : "#E8E8E8",
                                  },
                                },
                                [
                                  e.bookable.price > 0
                                    ? o(
                                        "el-row",
                                        { attrs: { gutter: 24 } },
                                        [
                                          o("el-col", { attrs: { span: 12 } }, [
                                            o("p", [
                                              e._v(
                                                "\n                  " +
                                                  e._s(
                                                    e.$root.labels
                                                      .total_cost_colon
                                                  ) +
                                                  "\n                "
                                              ),
                                            ]),
                                          ]),
                                          e._v(" "),
                                          o("el-col", { attrs: { span: 12 } }, [
                                            o(
                                              "p",
                                              {
                                                staticClass:
                                                  "am-semi-strong am-align-right",
                                                style: {
                                                  color: e.bookable.color,
                                                },
                                              },
                                              [
                                                e._v(
                                                  "\n                  " +
                                                    e._s(
                                                      e.getFormattedPrice(
                                                        e.bookable.price,
                                                        !e.$root.settings
                                                          .payments
                                                          .hideCurrencySymbolFrontend
                                                      )
                                                    ) +
                                                    "\n                "
                                                ),
                                              ]
                                            ),
                                          ]),
                                        ],
                                        1
                                      )
                                    : e._e(),
                                  e._v(" "),
                                  e.depositAmount > 0 &&
                                  "onSite" !== e.getPaymentGateway()
                                    ? o(
                                        "el-row",
                                        {
                                          staticClass:
                                            "am-confirmation-deposit",
                                          attrs: { gutter: 24 },
                                        },
                                        [
                                          o("el-col", { attrs: { span: 12 } }, [
                                            o("p", [
                                              e._v(
                                                e._s(e.$root.labels.deposit) +
                                                  " "
                                              ),
                                              o(
                                                "label",
                                                {
                                                  staticClass:
                                                    "am-confirmation-deposit-info",
                                                },
                                                [
                                                  e._v(
                                                    e._s(e.$root.labels.pay_now)
                                                  ),
                                                ]
                                              ),
                                            ]),
                                          ]),
                                          e._v(" "),
                                          o("el-col", { attrs: { span: 12 } }, [
                                            o(
                                              "p",
                                              {
                                                staticClass:
                                                  "am-semi-strong am-align-right",
                                                style: {
                                                  color: e.bookable.color,
                                                },
                                              },
                                              [
                                                e._v(
                                                  "\n                  " +
                                                    e._s(
                                                      e.getFormattedPrice(
                                                        e.depositAmount,
                                                        !e.$root.settings
                                                          .payments
                                                          .hideCurrencySymbolFrontend
                                                      )
                                                    ) +
                                                    "\n                "
                                                ),
                                              ]
                                            ),
                                          ]),
                                        ],
                                        1
                                      )
                                    : e._e(),
                                  e._v(" "),
                                  e.depositAmount > 0 &&
                                  "onSite" !== e.getPaymentGateway()
                                    ? o(
                                        "el-row",
                                        { attrs: { gutter: 24 } },
                                        [
                                          o("el-col", { attrs: { span: 12 } }, [
                                            o("p", [
                                              e._v(
                                                e._s(e.$root.labels.pay_later)
                                              ),
                                            ]),
                                          ]),
                                          e._v(" "),
                                          o("el-col", { attrs: { span: 12 } }, [
                                            o(
                                              "p",
                                              {
                                                staticClass:
                                                  "am-semi-strong am-align-right",
                                                style: {
                                                  color: e.bookable.color,
                                                },
                                              },
                                              [
                                                e._v(
                                                  "\n                  " +
                                                    e._s(
                                                      e.getFormattedPrice(
                                                        e.getTotalPrice() -
                                                          e.depositAmount,
                                                        !e.$root.settings
                                                          .payments
                                                          .hideCurrencySymbolFrontend
                                                      )
                                                    ) +
                                                    "\n                "
                                                ),
                                              ]
                                            ),
                                          ]),
                                        ],
                                        1
                                      )
                                    : e._e(),
                                ],
                                1
                              )
                            : o(
                                "div",
                                { staticClass: "am-confirmation-booking-cost" },
                                [
                                  e.bookable.maxCapacity > 1
                                    ? o(
                                        "el-row",
                                        { attrs: { gutter: 24 } },
                                        [
                                          o("el-col", { attrs: { span: 12 } }, [
                                            o("p", [
                                              e._v(
                                                e._s(
                                                  e.$root.labels
                                                    .total_number_of_persons
                                                )
                                              ),
                                            ]),
                                          ]),
                                          e._v(" "),
                                          o("el-col", { attrs: { span: 12 } }, [
                                            o(
                                              "p",
                                              {
                                                staticClass:
                                                  "am-semi-strong am-align-right",
                                              },
                                              [
                                                e._v(
                                                  "\n                  " +
                                                    e._s(
                                                      e.appointment.bookings[0]
                                                        .persons
                                                    ) +
                                                    "\n                "
                                                ),
                                              ]
                                            ),
                                          ]),
                                        ],
                                        1
                                      )
                                    : e._e(),
                                  e._v(" "),
                                  e._l(
                                    e.instantPaymentBasePriceData,
                                    function (t, a) {
                                      return o(
                                        "el-row",
                                        { key: a, attrs: { gutter: 24 } },
                                        [
                                          o("el-col", { attrs: { span: 6 } }, [
                                            o(
                                              "p",
                                              {
                                                style: {
                                                  visibility:
                                                    0 === a
                                                      ? "visible"
                                                      : "hidden",
                                                },
                                              },
                                              [
                                                e._v(
                                                  e._s(
                                                    e.$root.labels
                                                      .base_price_colon
                                                  )
                                                ),
                                              ]
                                            ),
                                          ]),
                                          e._v(" "),
                                          o("el-col", { attrs: { span: 18 } }, [
                                            o(
                                              "p",
                                              {
                                                staticClass:
                                                  "am-semi-strong am-align-right",
                                              },
                                              [
                                                e._v(
                                                  "\n                  " +
                                                    e._s(
                                                      e.getBookingBasePriceCalculationString(
                                                        t.count,
                                                        t.price
                                                      )
                                                    ) +
                                                    "\n                "
                                                ),
                                              ]
                                            ),
                                          ]),
                                        ],
                                        1
                                      );
                                    }
                                  ),
                                  e._v(" "),
                                  e.appointment.bookings[0].extras.length > 0 &&
                                  e.getTotalPrice() > 0
                                    ? o(
                                        "el-row",
                                        {
                                          staticClass:
                                            "am-confirmation-extras-cost",
                                          attrs: { gutter: 24 },
                                        },
                                        [
                                          e.selectedExtras.length > 0
                                            ? o(
                                                "el-collapse",
                                                {
                                                  class: e.$root.settings
                                                    .customization.forms
                                                    ? "am-block-" +
                                                      e.formType +
                                                      "-" +
                                                      e.formName +
                                                      "-" +
                                                      e.bookableType
                                                    : "",
                                                  attrs: { accordion: "" },
                                                },
                                                [
                                                  o(
                                                    "el-collapse-item",
                                                    { attrs: { name: "1" } },
                                                    [
                                                      o(
                                                        "template",
                                                        { slot: "title" },
                                                        [
                                                          o(
                                                            "div",
                                                            {
                                                              staticClass:
                                                                "am-extras-title",
                                                            },
                                                            [
                                                              e._v(
                                                                e._s(
                                                                  e.$root.labels
                                                                    .extras_costs_colon
                                                                )
                                                              ),
                                                            ]
                                                          ),
                                                          e._v(" "),
                                                          o(
                                                            "div",
                                                            {
                                                              staticClass:
                                                                "am-extras-total-cost am-semi-strong",
                                                              style:
                                                                "event" !==
                                                                  e.bookableType ||
                                                                e.useGlobalCustomization
                                                                  ? {}
                                                                  : e.getBookableColor(
                                                                      !1
                                                                    ),
                                                            },
                                                            [
                                                              e._v(
                                                                "\n                      " +
                                                                  e._s(
                                                                    e.getFormattedPrice(
                                                                      e.getExtrasPrice(
                                                                        e.instantPaymentBookingsCount
                                                                      ),
                                                                      !e.$root
                                                                        .settings
                                                                        .payments
                                                                        .hideCurrencySymbolFrontend
                                                                    )
                                                                  ) +
                                                                  "\n                    "
                                                              ),
                                                            ]
                                                          ),
                                                        ]
                                                      ),
                                                      e._v(" "),
                                                      e._l(
                                                        e.selectedExtras,
                                                        function (t) {
                                                          return o("div", [
                                                            o(
                                                              "div",
                                                              {
                                                                staticClass:
                                                                  "am-extras-details",
                                                              },
                                                              [
                                                                e._v(
                                                                  e._s(t.name)
                                                                ),
                                                              ]
                                                            ),
                                                            e._v(" "),
                                                            o(
                                                              "div",
                                                              {
                                                                staticClass:
                                                                  "am-extras-cost",
                                                              },
                                                              [
                                                                e._v(
                                                                  e._s(
                                                                    e.getSelectedExtraDetails(
                                                                      t
                                                                    )
                                                                  )
                                                                ),
                                                              ]
                                                            ),
                                                          ]);
                                                        }
                                                      ),
                                                    ],
                                                    2
                                                  ),
                                                ],
                                                1
                                              )
                                            : o(
                                                "div",
                                                [
                                                  o(
                                                    "el-col",
                                                    { attrs: { span: 12 } },
                                                    [
                                                      o("p", [
                                                        e._v(
                                                          e._s(
                                                            e.$root.labels
                                                              .extras_costs_colon
                                                          )
                                                        ),
                                                      ]),
                                                    ]
                                                  ),
                                                  e._v(" "),
                                                  o(
                                                    "el-col",
                                                    { attrs: { span: 12 } },
                                                    [
                                                      o(
                                                        "p",
                                                        {
                                                          staticClass:
                                                            "am-semi-strong am-align-right",
                                                        },
                                                        [
                                                          e._v(
                                                            "\n                    " +
                                                              e._s(
                                                                e.getFormattedPrice(
                                                                  e.getExtrasPrice(
                                                                    e.instantPaymentBookingsCount
                                                                  ),
                                                                  !e.$root
                                                                    .settings
                                                                    .payments
                                                                    .hideCurrencySymbolFrontend
                                                                )
                                                              ) +
                                                              "\n                  "
                                                          ),
                                                        ]
                                                      ),
                                                    ]
                                                  ),
                                                ],
                                                1
                                              ),
                                        ],
                                        1
                                      )
                                    : e._e(),
                                  e._v(" "),
                                  e.appointment.bookings[0].extras.length > 0 &&
                                  e.bookable.price
                                    ? o(
                                        "el-row",
                                        { attrs: { gutter: 24 } },
                                        [
                                          o("el-col", { attrs: { span: 10 } }, [
                                            o("p", [
                                              e._v(
                                                e._s(
                                                  e.$root.labels.subtotal_colon
                                                )
                                              ),
                                            ]),
                                          ]),
                                          e._v(" "),
                                          o("el-col", { attrs: { span: 14 } }, [
                                            o(
                                              "p",
                                              {
                                                staticClass:
                                                  "am-semi-strong am-align-right",
                                              },
                                              [
                                                e._v(
                                                  "\n                  " +
                                                    e._s(
                                                      e.getFormattedPrice(
                                                        e.getSubtotalPrice(),
                                                        !e.$root.settings
                                                          .payments
                                                          .hideCurrencySymbolFrontend
                                                      )
                                                    ) +
                                                    "\n                "
                                                ),
                                              ]
                                            ),
                                          ]),
                                        ],
                                        1
                                      )
                                    : e._e(),
                                  e._v(" "),
                                  e.$root.settings.payments.coupons &&
                                  e.bookable.price > 0
                                    ? o(
                                        "el-row",
                                        { attrs: { gutter: 24 } },
                                        [
                                          o("el-col", { attrs: { span: 8 } }, [
                                            o("p", [
                                              e._v(
                                                e._s(
                                                  e.$root.labels
                                                    .discount_amount_colon
                                                )
                                              ),
                                            ]),
                                          ]),
                                          e._v(" "),
                                          o("el-col", { attrs: { span: 16 } }, [
                                            o(
                                              "p",
                                              {
                                                staticClass:
                                                  "am-semi-strong am-align-right",
                                              },
                                              [
                                                e._v(
                                                  "\n                  " +
                                                    e._s(
                                                      e.getFormattedPrice(
                                                        e.getDiscountData(
                                                          "instant"
                                                        ),
                                                        !e.$root.settings
                                                          .payments
                                                          .hideCurrencySymbolFrontend
                                                      )
                                                    ) +
                                                    "\n                "
                                                ),
                                              ]
                                            ),
                                          ]),
                                        ],
                                        1
                                      )
                                    : e._e(),
                                  e._v(" "),
                                  e.$root.settings.payments.coupons &&
                                  e.bookable.price > 0
                                    ? o(
                                        "el-row",
                                        {
                                          staticClass:
                                            "am-add-coupon am-flex-row-middle-align",
                                          attrs: { gutter: 0 },
                                        },
                                        [
                                          "appointment" === e.bookableType
                                            ? o(
                                                "el-col",
                                                { attrs: { sm: 10, xs: 10 } },
                                                [
                                                  o("img", {
                                                    staticClass: "svg",
                                                    attrs: {
                                                      src:
                                                        e.$root.getUrl +
                                                        "public/img/coupon.svg",
                                                      alt: "add-coupon",
                                                    },
                                                  }),
                                                  e._v(" "),
                                                  o("span", [
                                                    e._v(
                                                      e._s(
                                                        e.$root.labels
                                                          .add_coupon
                                                      )
                                                    ),
                                                  ]),
                                                ]
                                              )
                                            : o(
                                                "el-col",
                                                { attrs: { sm: 10, xs: 10 } },
                                                [
                                                  o(
                                                    "svg",
                                                    {
                                                      attrs: {
                                                        width: "16px",
                                                        height: "16px",
                                                        viewBox: "0 0 16 16",
                                                        version: "1.1",
                                                        xmlns:
                                                          "http://www.w3.org/2000/svg",
                                                      },
                                                    },
                                                    [
                                                      o("desc", [
                                                        e._v(
                                                          "Created with Sketch."
                                                        ),
                                                      ]),
                                                      e._v(" "),
                                                      o("defs"),
                                                      e._v(" "),
                                                      o(
                                                        "g",
                                                        {
                                                          style: {
                                                            fill: e.bookable
                                                              .color,
                                                          },
                                                          attrs: {
                                                            id: "Icons",
                                                            stroke: "none",
                                                            "stroke-width": "1",
                                                            "fill-rule":
                                                              "evenodd",
                                                          },
                                                        },
                                                        [
                                                          o(
                                                            "g",
                                                            {
                                                              attrs: {
                                                                id: "Group",
                                                                fill: e.bookable
                                                                  .color,
                                                              },
                                                            },
                                                            [
                                                              o("path", {
                                                                style: {
                                                                  fill: e
                                                                    .bookable
                                                                    .color,
                                                                },
                                                                attrs: {
                                                                  d: "M7.152,12.7704615 C6.29353846,11.5809231 6.26092308,10.8652308 6.23446154,10.2904615 C6.22953846,10.1852308 6.22584615,10.0978462 6.21661538,10.0055385 C6.17415385,9.54953846 5.84676923,8.64738462 5.22769231,7.74461538 C4.37538462,6.49907692 3.79384615,4.63569231 4.95876923,3.48307692 C5.232,3.21230769 5.58523077,3.06953846 5.97907692,3.06953846 C6.952,3.06953846 7.98892308,4.02892308 8.61538462,4.85846154 L8.61538462,3.55261538 L8.61538462,1.23261538 C8.61538462,0.552615385 8.06276923,0 7.38461538,0 L5.53661538,0 C5.36861538,0 5.232,0.134769231 5.22892308,0.302769231 C5.22092308,0.804923077 4.80738462,1.21353846 4.30769231,1.21353846 C3.80738462,1.21353846 3.39446154,0.804923077 3.38646154,0.302769231 C3.38338462,0.134769231 3.24676923,0 3.07876923,0 L1.23076923,0 C0.552,0 0,0.552615385 0,1.23261538 L0,12.3058462 C0,12.9858462 0.552,13.5384615 1.23076923,13.5384615 L3.07692308,13.5384615 C3.24676923,13.5384615 3.38461538,13.4006154 3.38461538,13.2307692 C3.38461538,12.7206154 3.79876923,12.3058462 4.30769231,12.3058462 C4.81661538,12.3058462 5.23076923,12.7206154 5.23076923,13.2307692 C5.23076923,13.4006154 5.36861538,13.5384615 5.53846154,13.5384615 L7.38461538,13.5384615 C7.52430769,13.5384615 7.65907692,13.5101538 7.78707692,13.4646154 C7.56738462,13.2683077 7.352,13.048 7.152,12.7704615",
                                                                  id: "Fill-1450",
                                                                },
                                                              }),
                                                              e._v(" "),
                                                              o("path", {
                                                                style: {
                                                                  fill: e
                                                                    .bookable
                                                                    .color,
                                                                },
                                                                attrs: {
                                                                  d: "M15.9536615,11.8383385 C15.9487385,11.8303385 15.4373538,10.9934154 15.0724308,9.83095385 C14.9881231,9.55956923 14.8816615,9.17741538 14.7604308,8.73987692 C14.1825846,6.66295385 13.6588923,4.89741538 13.0865846,4.32141538 C12.9450462,4.17987692 12.5161231,3.74787692 9.58812308,3.26295385 C9.50135385,3.2488 9.40843077,3.27341538 9.33950769,3.33187692 C9.27058462,3.39033846 9.23058462,3.47587692 9.23058462,3.56633846 L9.23058462,6.03956923 C9.23058462,6.16449231 9.30627692,6.27710769 9.42258462,6.32449231 L10.3192,6.68941538 C10.3782769,6.90172308 10.4908923,7.28572308 10.6016615,7.56572308 C10.5487385,7.65310769 10.5050462,7.75341538 10.4570462,7.86233846 C10.3764308,8.04695385 10.2878154,8.25064615 10.1518154,8.40018462 C9.55489231,8.01741538 8.95181538,6.91895385 8.56781538,5.96264615 C8.26504615,5.20756923 6.93273846,3.69926154 5.97889231,3.69926154 C5.74996923,3.69926154 5.54750769,3.78110769 5.3912,3.93495385 C4.49643077,4.81926154 5.01766154,6.35649231 5.73581538,7.40449231 C6.3272,8.26849231 6.7672,9.29187692 6.82996923,9.95218462 C6.83981538,10.0611077 6.84473846,10.1644923 6.84966154,10.2666462 C6.87489231,10.8100308 6.90073846,11.3724923 7.65089231,12.4112615 C8.04289231,12.9534154 8.50135385,13.2721846 8.98627692,13.6100308 C9.67858462,14.0912615 10.3942769,14.5897231 11.1179692,15.8457231 C11.1727385,15.9411077 11.2742769,16.0001846 11.3844308,16.0001846 C15.0004308,16.0001846 15.9819692,12.1115692 15.9912,12.0721846 C16.0108923,11.9921846 15.9967385,11.9084923 15.9536615,11.8383385",
                                                                  id: "Fill-1452",
                                                                },
                                                              }),
                                                            ]
                                                          ),
                                                        ]
                                                      ),
                                                    ]
                                                  ),
                                                  e._v(" "),
                                                  o(
                                                    "span",
                                                    {
                                                      style: {
                                                        color: e.bookable.color,
                                                      },
                                                    },
                                                    [
                                                      e._v(
                                                        e._s(
                                                          e.$root.labels
                                                            .add_coupon
                                                        )
                                                      ),
                                                    ]
                                                  ),
                                                ]
                                              ),
                                          e._v(" "),
                                          o(
                                            "el-col",
                                            { attrs: { sm: 14, xs: 14 } },
                                            [
                                              o(
                                                "el-form",
                                                {
                                                  ref: "coupon",
                                                  attrs: {
                                                    model:
                                                      e.appointment.bookings[0]
                                                        .customer,
                                                    rules: e.rules,
                                                    "label-position": "top",
                                                    "status-icon": "",
                                                  },
                                                  nativeOn: {
                                                    keyup: function (t) {
                                                      return !t.type.indexOf(
                                                        "key"
                                                      ) &&
                                                        e._k(
                                                          t.keyCode,
                                                          "enter",
                                                          13,
                                                          t.key,
                                                          "Enter"
                                                        )
                                                        ? null
                                                        : e.onSubmitCoupon(t);
                                                    },
                                                  },
                                                },
                                                [
                                                  o(
                                                    "el-form-item",
                                                    {
                                                      class: e.$root.settings
                                                        .customization.forms
                                                        ? "am-input-" +
                                                          e.formType +
                                                          "-" +
                                                          e.formName +
                                                          "-" +
                                                          e.bookableType
                                                        : "",
                                                      style:
                                                        "event" !==
                                                          e.bookableType ||
                                                        e.useGlobalCustomization
                                                          ? {}
                                                          : e.getBookableColor(
                                                              !1
                                                            ),
                                                      attrs: {
                                                        error: e.errors.coupon,
                                                        prop: "couponCode",
                                                      },
                                                    },
                                                    [
                                                      o(
                                                        "el-input",
                                                        {
                                                          staticClass:
                                                            "am-add-coupon-field",
                                                          style:
                                                            "event" !==
                                                              e.bookableType ||
                                                            e.useGlobalCustomization
                                                              ? {}
                                                              : e.getBookableColor(
                                                                  !1
                                                                ),
                                                          attrs: {
                                                            type: "text",
                                                            size: "small",
                                                            "native-type":
                                                              "submit",
                                                          },
                                                          on: {
                                                            input: function (
                                                              t
                                                            ) {
                                                              return e.validateFieldsForPayPal();
                                                            },
                                                          },
                                                          model: {
                                                            value:
                                                              e.coupon.code,
                                                            callback: function (
                                                              t
                                                            ) {
                                                              e.$set(
                                                                e.coupon,
                                                                "code",
                                                                t
                                                              );
                                                            },
                                                            expression:
                                                              "coupon.code",
                                                          },
                                                        },
                                                        [
                                                          o("el-button", {
                                                            staticClass:
                                                              "am-add-coupon-button",
                                                            style:
                                                              "event" !==
                                                                e.bookableType ||
                                                              e.useGlobalCustomization
                                                                ? {}
                                                                : e.getBookableColor(
                                                                    !0
                                                                  ),
                                                            attrs: {
                                                              slot: "append",
                                                              size: "mini",
                                                              icon: "el-icon-check",
                                                              disabled:
                                                                !e.coupon
                                                                  .code ||
                                                                "" ===
                                                                  e.coupon.code.trim(),
                                                              "native-type":
                                                                "submit",
                                                            },
                                                            on: {
                                                              click:
                                                                e.checkCoupon,
                                                            },
                                                            slot: "append",
                                                          }),
                                                        ],
                                                        1
                                                      ),
                                                    ],
                                                    1
                                                  ),
                                                ],
                                                1
                                              ),
                                            ],
                                            1
                                          ),
                                        ],
                                        1
                                      )
                                    : e._e(),
                                  e._v(" "),
                                  o(
                                    "el-row",
                                    {
                                      directives: [
                                        {
                                          name: "show",
                                          rawName: "v-show",
                                          value:
                                            e.$root.settings.payments.coupons &&
                                            e.recurringData.length &&
                                            e.couponLimit <
                                              e.recurringData.length + 1 &&
                                            (e.coupon.discount ||
                                              e.coupon.deduction),
                                          expression:
                                            "$root.settings.payments.coupons && recurringData.length && couponLimit < recurringData.length + 1 && (coupon.discount || coupon.deduction)",
                                        },
                                      ],
                                      staticClass: "am-coupon-limit",
                                    },
                                    [
                                      o("el-col", { attrs: { sm: 2, xs: 4 } }, [
                                        o(
                                          "div",
                                          {
                                            staticStyle: {
                                              display: "inline-block",
                                            },
                                          },
                                          [
                                            o("img", {
                                              staticClass: "svg",
                                              attrs: {
                                                src:
                                                  e.$root.getUrl +
                                                  "public/img/coupon-limit.svg",
                                                alt: "coupon-limit",
                                              },
                                            }),
                                          ]
                                        ),
                                      ]),
                                      e._v(" "),
                                      o(
                                        "el-col",
                                        { attrs: { sm: 22, xs: 20 } },
                                        [
                                          o(
                                            "div",
                                            {
                                              staticClass:
                                                "am-coupon-limit-text",
                                            },
                                            [
                                              o("strong", [
                                                e._v(
                                                  e._s(
                                                    e.$root.labels.coupons_used
                                                  )
                                                ),
                                              ]),
                                              e._v(" "),
                                              o("p", [
                                                e._v(
                                                  e._s(
                                                    e.$root.labels
                                                      .coupons_used_description
                                                  ) +
                                                    " " +
                                                    e._s(e.couponLimit)
                                                ),
                                              ]),
                                            ]
                                          ),
                                        ]
                                      ),
                                    ],
                                    1
                                  ),
                                  e._v(" "),
                                  e.bookable.price > 0
                                    ? o(
                                        "div",
                                        {
                                          staticClass: "am-confirmation-total",
                                        },
                                        [
                                          o(
                                            "el-row",
                                            { attrs: { gutter: 24 } },
                                            [
                                              o(
                                                "el-col",
                                                { attrs: { span: 12 } },
                                                [
                                                  o("p", [
                                                    e._v(
                                                      "\n                  " +
                                                        e._s(
                                                          e.$root.labels
                                                            .total_cost_colon
                                                        ) +
                                                        "\n                "
                                                    ),
                                                  ]),
                                                ]
                                              ),
                                              e._v(" "),
                                              o(
                                                "el-col",
                                                { attrs: { span: 12 } },
                                                [
                                                  o(
                                                    "p",
                                                    {
                                                      staticClass:
                                                        "am-semi-strong am-align-right",
                                                      style: {
                                                        color: e.bookable.color,
                                                      },
                                                    },
                                                    [
                                                      e._v(
                                                        "\n                  " +
                                                          e._s(
                                                            e.getFormattedPrice(
                                                              e.getTotalPrice(),
                                                              !e.$root.settings
                                                                .payments
                                                                .hideCurrencySymbolFrontend
                                                            )
                                                          ) +
                                                          "\n                "
                                                      ),
                                                    ]
                                                  ),
                                                ]
                                              ),
                                            ],
                                            1
                                          ),
                                          e._v(" "),
                                          e.depositAmount > 0 &&
                                          "onSite" !== e.getPaymentGateway()
                                            ? o(
                                                "el-row",
                                                {
                                                  staticClass:
                                                    "am-confirmation-deposit",
                                                  style: {
                                                    color: e.bookable.color,
                                                    "background-color":
                                                      "event" !==
                                                        e.bookableType ||
                                                      e.useGlobalCustomization
                                                        ? ""
                                                        : "#E8E8E8",
                                                  },
                                                  attrs: { gutter: 24 },
                                                },
                                                [
                                                  o(
                                                    "el-col",
                                                    { attrs: { span: 12 } },
                                                    [
                                                      o("p", [
                                                        e._v(
                                                          e._s(
                                                            e.$root.labels
                                                              .deposit
                                                          ) + " "
                                                        ),
                                                        o(
                                                          "label",
                                                          {
                                                            staticClass:
                                                              "am-confirmation-deposit-info",
                                                          },
                                                          [
                                                            e._v(
                                                              e._s(
                                                                e.$root.labels
                                                                  .pay_now
                                                              )
                                                            ),
                                                          ]
                                                        ),
                                                      ]),
                                                    ]
                                                  ),
                                                  e._v(" "),
                                                  o(
                                                    "el-col",
                                                    { attrs: { span: 12 } },
                                                    [
                                                      o(
                                                        "p",
                                                        {
                                                          staticClass:
                                                            "am-semi-strong am-align-right",
                                                          style: {
                                                            color:
                                                              e.bookable.color,
                                                          },
                                                        },
                                                        [
                                                          e._v(
                                                            "\n                  " +
                                                              e._s(
                                                                e.getFormattedPrice(
                                                                  e.depositAmount,
                                                                  !e.$root
                                                                    .settings
                                                                    .payments
                                                                    .hideCurrencySymbolFrontend
                                                                )
                                                              ) +
                                                              "\n                "
                                                          ),
                                                        ]
                                                      ),
                                                    ]
                                                  ),
                                                ],
                                                1
                                              )
                                            : e._e(),
                                          e._v(" "),
                                          e.depositAmount > 0 &&
                                          "onSite" !== e.getPaymentGateway()
                                            ? o(
                                                "el-row",
                                                {
                                                  style: {
                                                    color: e.bookable.color,
                                                    "background-color":
                                                      "event" !==
                                                        e.bookableType ||
                                                      e.useGlobalCustomization
                                                        ? ""
                                                        : "#E8E8E8",
                                                  },
                                                  attrs: { gutter: 24 },
                                                },
                                                [
                                                  o(
                                                    "el-col",
                                                    { attrs: { span: 12 } },
                                                    [
                                                      o("p", [
                                                        e._v(
                                                          e._s(
                                                            e.$root.labels
                                                              .pay_later
                                                          )
                                                        ),
                                                      ]),
                                                    ]
                                                  ),
                                                  e._v(" "),
                                                  o(
                                                    "el-col",
                                                    { attrs: { span: 12 } },
                                                    [
                                                      o(
                                                        "p",
                                                        {
                                                          staticClass:
                                                            "am-semi-strong am-align-right",
                                                          style: {
                                                            color:
                                                              e.bookable.color,
                                                          },
                                                        },
                                                        [
                                                          e._v(
                                                            "\n                  " +
                                                              e._s(
                                                                e.getFormattedPrice(
                                                                  e.getTotalPrice() -
                                                                    e.depositAmount,
                                                                  !e.$root
                                                                    .settings
                                                                    .payments
                                                                    .hideCurrencySymbolFrontend
                                                                )
                                                              ) +
                                                              "\n                "
                                                          ),
                                                        ]
                                                      ),
                                                    ]
                                                  ),
                                                ],
                                                1
                                              )
                                            : e._e(),
                                        ],
                                        1
                                      )
                                    : e._e(),
                                  e._v(" "),
                                  e.recurringData.length &&
                                  e.postponedPaymentBasePriceData.length > 0
                                    ? o(
                                        "el-row",
                                        {
                                          staticClass:
                                            "am-confirmation-extras-cost",
                                          attrs: { gutter: 24 },
                                        },
                                        [
                                          o(
                                            "el-collapse",
                                            {
                                              class: e.$root.settings
                                                .customization.forms
                                                ? "am-block-" +
                                                  e.formType +
                                                  "-" +
                                                  e.formName +
                                                  "-" +
                                                  e.bookableType
                                                : "",
                                              attrs: { accordion: "" },
                                            },
                                            [
                                              o(
                                                "el-collapse-item",
                                                { attrs: { name: "1" } },
                                                [
                                                  o(
                                                    "template",
                                                    { slot: "title" },
                                                    [
                                                      o(
                                                        "div",
                                                        {
                                                          staticClass:
                                                            "am-extras-title",
                                                        },
                                                        [
                                                          e._v(
                                                            e._s(
                                                              e.$root.labels
                                                                .recurring_costs_colon
                                                            )
                                                          ),
                                                        ]
                                                      ),
                                                      e._v(" "),
                                                      o(
                                                        "div",
                                                        {
                                                          staticClass:
                                                            "am-extras-total-cost am-semi-strong",
                                                        },
                                                        [
                                                          e._v(
                                                            "\n                      " +
                                                              e._s(
                                                                e.getFormattedPrice(
                                                                  e.getPostponedPaymentTotalPrice(),
                                                                  !e.$root
                                                                    .settings
                                                                    .payments
                                                                    .hideCurrencySymbolFrontend
                                                                )
                                                              ) +
                                                              "\n                    "
                                                          ),
                                                        ]
                                                      ),
                                                    ]
                                                  ),
                                                  e._v(" "),
                                                  e._l(
                                                    e.postponedPaymentBasePriceData,
                                                    function (t, a) {
                                                      return o(
                                                        "div",
                                                        { key: a },
                                                        [
                                                          o(
                                                            "div",
                                                            {
                                                              staticClass:
                                                                "am-extras-details",
                                                              style: {
                                                                visibility:
                                                                  0 === a
                                                                    ? "visible"
                                                                    : "hidden",
                                                              },
                                                            },
                                                            [
                                                              e._v(
                                                                "\n                      " +
                                                                  e._s(
                                                                    e.$root
                                                                      .labels
                                                                      .base_price_colon
                                                                  ) +
                                                                  "\n                    "
                                                              ),
                                                            ]
                                                          ),
                                                          e._v(" "),
                                                          o(
                                                            "div",
                                                            {
                                                              staticClass:
                                                                "am-extras-cost",
                                                            },
                                                            [
                                                              e._v(
                                                                e._s(
                                                                  e.getBookingBasePriceCalculationString(
                                                                    t.count,
                                                                    t.price
                                                                  )
                                                                ) +
                                                                  "\n                    "
                                                              ),
                                                            ]
                                                          ),
                                                        ]
                                                      );
                                                    }
                                                  ),
                                                  e._v(" "),
                                                  e.selectedExtras.length > 0
                                                    ? o("div", [
                                                        o(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "am-extras-details",
                                                          },
                                                          [
                                                            e._v(
                                                              " " +
                                                                e._s(
                                                                  e.$root.labels
                                                                    .extras_costs_colon
                                                                )
                                                            ),
                                                          ]
                                                        ),
                                                        e._v(" "),
                                                        o(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "am-extras-cost",
                                                          },
                                                          [
                                                            e._v(
                                                              e._s(
                                                                e.getPostponedPaymentExtrasPriceDetails()
                                                              )
                                                            ),
                                                          ]
                                                        ),
                                                      ])
                                                    : e._e(),
                                                  e._v(" "),
                                                  e.getDiscountData("postponed")
                                                    ? o("div", [
                                                        o(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "am-extras-details",
                                                          },
                                                          [
                                                            e._v(
                                                              " " +
                                                                e._s(
                                                                  e.$root.labels
                                                                    .discount_amount_colon
                                                                )
                                                            ),
                                                          ]
                                                        ),
                                                        e._v(" "),
                                                        o(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "am-extras-cost",
                                                          },
                                                          [
                                                            e._v(
                                                              "\n                      " +
                                                                e._s(
                                                                  e.getFormattedPrice(
                                                                    e.getDiscountData(
                                                                      "postponed"
                                                                    ),
                                                                    !e.$root
                                                                      .settings
                                                                      .payments
                                                                      .hideCurrencySymbolFrontend
                                                                  )
                                                                ) +
                                                                "\n                    "
                                                            ),
                                                          ]
                                                        ),
                                                      ])
                                                    : e._e(),
                                                ],
                                                2
                                              ),
                                            ],
                                            1
                                          ),
                                        ],
                                        1
                                      )
                                    : e._e(),
                                ],
                                2
                              ),
                        ]),
                      ],
                      1
                    ),
                  ],
                  1
                ),
                e._v(" "),
                o(
                  "div",
                  {
                    staticClass: "dialog-footer payment-dialog-footer",
                    attrs: { slot: "footer" },
                    slot: "footer",
                  },
                  [
                    e.hasCancel
                      ? o(
                          "div",
                          {
                            staticClass: "el-button el-button--default",
                            style:
                              "event" === e.bookableType
                                ? e.bookableCancelStyle
                                : "",
                            on: {
                              mouseover: function (t) {
                                return e.setBookableCancelStyle(!0);
                              },
                              mouseleave: function (t) {
                                return e.setBookableCancelStyle(!1);
                              },
                              click: function (t) {
                                return e.cancelBooking();
                              },
                            },
                          },
                          [
                            o(
                              "span",
                              {
                                style:
                                  "event" === e.bookableType
                                    ? e.bookableCancelSpanStyle
                                    : "",
                              },
                              [e._v(e._s(e.$root.labels.cancel))]
                            ),
                          ]
                        )
                      : e._e(),
                    e._v(" "),
                    o(
                      "div",
                      {
                        directives: [
                          {
                            name: "show",
                            rawName: "v-show",
                            value:
                              e.$root.settings.payments.payPal.enabled &&
                              "payPal" === e.appointment.payment.gateway &&
                              0 !== e.getTotalPrice() &&
                              "0" !== e.getTotalPrice(),
                            expression:
                              "$root.settings.payments.payPal.enabled && appointment.payment.gateway === 'payPal' && getTotalPrice() !== 0 && getTotalPrice() !== '0'",
                          },
                        ],
                        staticClass:
                          "paypal-button el-button el-button--primary",
                        style:
                          "event" === e.bookableType
                            ? e.bookableConfirmStyle
                            : "",
                        on: {
                          mouseover: function (t) {
                            return e.setBookableConfirmStyle(!0);
                          },
                          mouseleave: function (t) {
                            return e.setBookableConfirmStyle(!1);
                          },
                        },
                      },
                      [
                        o("div", {
                          attrs: { id: "am-paypal-button-container" },
                        }),
                        e._v(" "),
                        o("span", [e._v(e._s(e.$root.labels.confirm))]),
                      ]
                    ),
                    e._v(" "),
                    o(
                      "div",
                      {
                        directives: [
                          {
                            name: "show",
                            rawName: "v-show",
                            value: e.showConfirmBookingButton,
                            expression: "showConfirmBookingButton",
                          },
                        ],
                        staticClass: "el-button el-button--primary",
                        style:
                          "event" === e.bookableType
                            ? e.bookableConfirmStyle
                            : "",
                        on: {
                          mouseover: function (t) {
                            return e.setBookableConfirmStyle(!0);
                          },
                          mouseleave: function (t) {
                            return e.setBookableConfirmStyle(!1);
                          },
                          click: function (t) {
                            return e.confirmBooking();
                          },
                        },
                      },
                      [o("span", [e._v(e._s(e.$root.labels.confirm))])]
                    ),
                  ]
                ),
              ],
              1
            ),
            e._v(" "),
            o(
              "div",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: !e.fetched && !e.paid,
                    expression: "!fetched && !paid",
                  },
                ],
                staticClass: "am-booking-fetched",
                attrs: { id: "am-spinner" },
              },
              [
                "payPal" === e.appointment.payment.gateway
                  ? o(
                      "h4",
                      {
                        style: {
                          color:
                            "event" === e.bookableType
                              ? e.formsData.globalSettings.formTextColor
                              : e.formsData[e.$options.name][e.bookableType]
                                  .globalSettings.formTextColor,
                        },
                      },
                      [
                        e._v(
                          "\n      " +
                            e._s(e.$root.labels.waiting_for_payment) +
                            "\n    "
                        ),
                      ]
                    )
                  : o(
                      "h4",
                      {
                        style: {
                          color:
                            "event" === e.bookableType
                              ? e.formsData.globalSettings.formTextColor
                              : e.formsData[e.$options.name][e.bookableType]
                                  .globalSettings.formTextColor,
                        },
                      },
                      [
                        e._v(
                          "\n      " +
                            e._s(e.$root.labels.please_wait) +
                            "\n    "
                        ),
                      ]
                    ),
                e._v(" "),
                o("div", { staticClass: "am-svg-wrapper" }, [
                  "event" !== e.bookableType || e.useGlobalCustomization
                    ? o("span", [
                        o("img", {
                          staticClass: "svg am-spin",
                          attrs: {
                            src: e.$root.getUrl + "public/img/oval-spinner.svg",
                          },
                        }),
                        e._v(" "),
                        o("img", {
                          staticClass: "svg am-hourglass",
                          attrs: {
                            src: e.$root.getUrl + "public/img/hourglass.svg",
                          },
                        }),
                      ])
                    : o("span", [
                        o(
                          "svg",
                          {
                            staticClass: "am-spin",
                            attrs: {
                              width: "160",
                              height: "160",
                              viewBox: "0 0 38 38",
                              xmlns: "http://www.w3.org/2000/svg",
                              stroke: "#7F8FA4",
                            },
                          },
                          [
                            o(
                              "g",
                              {
                                attrs: { fill: "none", "fill-rule": "evenodd" },
                              },
                              [
                                o(
                                  "g",
                                  {
                                    attrs: {
                                      transform: "translate(1 1)",
                                      "stroke-width": "2",
                                    },
                                  },
                                  [
                                    o(
                                      "path",
                                      {
                                        style: { stroke: e.bookable.color },
                                        attrs: {
                                          d: "M36 18c0-9.94-8.06-18-18-18",
                                          stroke: e.bookable.color,
                                        },
                                      },
                                      [
                                        o("animateTransform", {
                                          attrs: {
                                            attributeName: "transform",
                                            type: "rotate",
                                            from: "0 18 18",
                                            to: "360 18 18",
                                            dur: "1s",
                                            repeatCount: "indefinite",
                                          },
                                        }),
                                      ],
                                      1
                                    ),
                                  ]
                                ),
                              ]
                            ),
                          ]
                        ),
                        e._v(" "),
                        o(
                          "svg",
                          {
                            staticClass: "am-hourglass",
                            attrs: {
                              width: "12px",
                              height: "16px",
                              viewBox: "0 0 12 16",
                              version: "1.1",
                              xmlns: "http://www.w3.org/2000/svg",
                            },
                          },
                          [
                            o(
                              "g",
                              {
                                attrs: {
                                  id: "Icons",
                                  stroke: "none",
                                  "stroke-width": "1",
                                  fill: "none",
                                  "fill-rule": "evenodd",
                                  transform: "translate(-2.000000, 0.000000)",
                                },
                              },
                              [
                                o(
                                  "g",
                                  {
                                    style: { fill: e.bookable.color },
                                    attrs: {
                                      id: "sat",
                                      transform:
                                        "translate(2.000000, 0.000000)",
                                    },
                                  },
                                  [
                                    o("path", {
                                      style: {
                                        fill: e.bookable.color,
                                        stroke: "none",
                                      },
                                      attrs: {
                                        d: "M8.37968,4.8 L3.32848,4.8 C3.22074667,4.8 3.12368,4.86506667 3.08208,4.9648 C3.04101333,5.06453333 3.06394667,5.1792 3.14021333,5.25546667 L5.67834667,7.79093333 C5.72794667,7.84106667 5.79621333,7.86933333 5.86661333,7.86933333 C5.95941333,7.8672 6.00634667,7.84106667 6.05594667,7.7904 L8.56901333,5.2544 C8.64474667,5.1776 8.66714667,5.06346667 8.62554667,4.96426667 C8.58448,4.86453333 8.48741333,4.8 8.37968,4.8",
                                        id: "Fill-694",
                                      },
                                    }),
                                    e._v(" "),
                                    o("path", {
                                      style: {
                                        fill: e.bookable.color,
                                        stroke: "none",
                                      },
                                      attrs: {
                                        d: "M6.82293333,7.62293333 C6.6144,7.83146667 6.6144,8.16853333 6.82293333,8.37706667 L9.04,10.5941333 C9.74506667,11.2992 10.1333333,12.2368 10.1333333,13.2341333 L10.1333333,14.4 L9.2,14.4 L6.08,10.24 C5.9792,10.1056 5.75413333,10.1056 5.65333333,10.24 L2.53333333,14.4 L1.6,14.4 L1.6,13.2341333 C1.6,12.2368 1.98826667,11.2992 2.69333333,10.5941333 L4.9104,8.37706667 C5.11893333,8.16853333 5.11893333,7.83146667 4.9104,7.62293333 L2.69333333,5.40586667 C1.98826667,4.7008 1.6,3.7632 1.6,2.7664 L1.6,1.6 L10.1333333,1.6 L10.1333333,2.7664 C10.1333333,3.7632 9.74506667,4.7008 9.04,5.40586667 L6.82293333,7.62293333 Z M11.2,2.7664 L11.2,1.45173333 C11.5173333,1.26666667 11.7333333,0.9264 11.7333333,0.533333333 L11.7333333,0.266666667 C11.7333333,0.119466667 11.6138667,0 11.4666667,0 L0.266666667,0 C0.119466667,0 0,0.119466667 0,0.266666667 L0,0.533333333 C0,0.9264 0.216,1.26666667 0.533333333,1.45173333 L0.533333333,2.7664 C0.533333333,4.048 1.03253333,5.25386667 1.9392,6.16 L3.7792,8 L1.9392,9.84 C1.03253333,10.7461333 0.533333333,11.952 0.533333333,13.2341333 L0.533333333,14.5482667 C0.216,14.7333333 0,15.0736 0,15.4666667 L0,15.7333333 C0,15.8805333 0.119466667,16 0.266666667,16 L11.4666667,16 C11.6138667,16 11.7333333,15.8805333 11.7333333,15.7333333 L11.7333333,15.4666667 C11.7333333,15.0736 11.5173333,14.7333333 11.2,14.5482667 L11.2,13.2341333 C11.2,11.952 10.7008,10.7461333 9.79413333,9.84 L7.95413333,8 L9.79413333,6.16 C10.7008,5.25386667 11.2,4.048 11.2,2.7664 L11.2,2.7664 Z",
                                        id: "Fill-696",
                                      },
                                    }),
                                  ]
                                ),
                              ]
                            ),
                          ]
                        ),
                      ]),
                ]),
              ]
            ),
          ]
        );
      },
      staticRenderFns: [],
    };
  },
  786: function (e, t, o) {
    var a = o(685)(o(787), o(788), !1, null, null, null);
    e.exports = a.exports;
  },
  787: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = o(687),
      i = o(686);
    t.default = {
      name: "congratulationsForm",
      mixins: [a.a, i.a],
      props: {
        bookableType: null,
        addToCalendarData: null,
        formType: { type: String },
        formsData: {
          type: Object,
          default: function () {
            return {};
          },
        },
      },
      data: function () {
        return {
          hoverConfirm: !1,
          calendarIndex: null,
          calendars: [],
          redirectUrlAfterAppointment:
            this.$root.settings.general.redirectUrlAfterAppointment,
          formObjData: this.$root.settings.customization.forms
            ? this.formsData[this.$options.name][
                this.addToCalendarData.bookableType
              ]
            : null,
          labelHeading: this.$root.settings.customization.forms
            ? this.formsData[this.$options.name][
                this.addToCalendarData.bookableType
              ].itemsStatic.congratulationsHeadingFormField.labels
                .congratulations.value
            : "",
          headingVisibility:
            !this.$root.settings.customization.forms ||
            this.formsData[this.$options.name][
              this.addToCalendarData.bookableType
            ].itemsStatic.congratulationsHeadingFormField.visibility,
          imageVisibility:
            !this.$root.settings.customization.forms ||
            this.formsData[this.$options.name][
              this.addToCalendarData.bookableType
            ].itemsStatic.congratulationsImageFormField.visibility,
          labelApproved: this.$root.settings.customization.forms
            ? this.formsData[this.$options.name][
                this.addToCalendarData.bookableType
              ].itemsStatic.congratulationsMessagesFormField.labels
                .booking_completed_approved.value
            : "",
          labelPending: this.$root.settings.customization.forms
            ? this.formsData[this.$options.name][
                this.addToCalendarData.bookableType
              ].itemsStatic.congratulationsMessagesFormField.labels
                .booking_completed_pending.value
            : "",
          messagesVisibility:
            !this.$root.settings.customization.forms ||
            this.formsData[this.$options.name][
              this.addToCalendarData.bookableType
            ].itemsStatic.congratulationsMessagesFormField.visibility,
          addToCalendarVisibility:
            !this.$root.settings.customization.forms ||
            this.formsData[this.$options.name][
              this.addToCalendarData.bookableType
            ].itemsStatic.addToCalendarFormField.addToCalendarVisibility,
        };
      },
      created: function () {},
      mounted: function () {
        if (
          "bookable" in this.addToCalendarData &&
          "settings" in this.addToCalendarData.bookable
        ) {
          var e = JSON.parse(this.addToCalendarData.bookable.settings);
          e &&
          "general" in e &&
          "redirectUrlAfterAppointment" in e.general &&
          e.general.redirectUrlAfterAppointment
            ? (this.redirectUrlAfterAppointment =
                e.general.redirectUrlAfterAppointment)
            : (this.redirectUrlAfterAppointment =
                this.$root.clonedSettings.general.redirectUrlAfterAppointment);
        }
        "beforeAddToCalendarLoaded" in window &&
          window.beforeAddToCalendarLoaded(this.addToCalendarData),
          this.addToCalendarData.active && this.showCalendar(),
          this.inlineSVG(),
          this.scrollView("am-add-to-calendar", "start");
      },
      methods: {
        formatTime: function (e) {
          return e.toISOString().replace(/-|:|\.\d+/g, "");
        },
        trophyColor: function () {
          return this.formObjData &&
            "event" !== this.addToCalendarData.bookableType
            ? this.formObjData.globalSettings.formImageColor
            : this.$root.settings.customization.primaryColor;
        },
        getCalendarLinkData: function (e, t) {
          var o = this,
            a = [];
          switch (t) {
            case "yahoo":
              return (
                e.dates.forEach(function (t) {
                  var i = (t.end.getTime() - t.start.getTime()) / 6e4;
                  i =
                    (i < 600
                      ? "0" + Math.floor(i / 60)
                      : Math.floor(i / 60) + "") +
                    (i % 60 < 10 ? "0" + (i % 60) : (i % 60) + "");
                  var n = o.formatTime(
                    new Date(t.start - 6e4 * t.start.getTimezoneOffset())
                  );
                  a.push(
                    encodeURI(
                      [
                        "http://calendar.yahoo.com/?v=60&view=d&type=20",
                        "&title=" + (e.title || ""),
                        "&st=" + n,
                        "&dur=" + (i || ""),
                        "&desc=" + (e.description || ""),
                        "&in_loc=" + (t.address || ""),
                      ].join("")
                    )
                  );
                }),
                { type: "yahoo", label: "Yahoo! Calendar", links: a }
              );
            case "google":
              return (
                e.dates.forEach(function (t) {
                  var i = o.formatTime(t.start),
                    n = o.formatTime(t.end);
                  a.push(
                    encodeURI(
                      [
                        "https://www.google.com/calendar/render",
                        "?action=TEMPLATE",
                        "&text=" + (e.title || ""),
                        "&dates=" + (i || ""),
                        "/" + (n || ""),
                        "&details=" + (e.description || ""),
                        "&location=" + (t.address || ""),
                        "&sprop=&sprop=name:",
                      ].join("")
                    )
                  );
                }),
                { type: "google", label: "Google Calendar", links: a }
              );
          }
        },
        executeIfMultipleLinks: function () {
          var e = this;
          return (
            !(this.calendars[this.calendarIndex].links.length > 1) ||
            (setTimeout(function () {
              e.calendars[e.calendarIndex].links.forEach(function (e, t) {
                0 !== t && window.open(e, "_blank");
              });
            }, 1e3),
            !0)
          );
        },
        setBookableConfirmStyle: function (e) {
          switch (this.addToCalendarData.type) {
            case "appointment":
              break;
            case "event":
              this.hoverConfirm = e;
          }
        },
        showCalendar: function () {
          var e = "";
          this.addToCalendarData.recurringIds.forEach(function (t) {
            e += "&recurring[]=" + t;
          }),
            (this.calendars = [
              this.getCalendarLinkData(
                {
                  title: this.addToCalendarData.title,
                  dates: this.addToCalendarData.dates,
                  description: this.addToCalendarData.description,
                },
                "google"
              ),
              this.getCalendarLinkData(
                {
                  title: this.addToCalendarData.title,
                  dates: this.addToCalendarData.dates,
                  description: this.addToCalendarData.description,
                },
                "yahoo"
              ),
              {
                type: "ios",
                label: "iCal Calendar",
                links: [
                  this.$root.getAjaxUrl +
                    "/bookings/ics/" +
                    this.addToCalendarData.id +
                    "&type=" +
                    this.addToCalendarData.type +
                    e,
                ],
              },
              {
                type: "outlook",
                label: "Outlook Calendar",
                links: [
                  this.$root.getAjaxUrl +
                    "/bookings/ics/" +
                    this.addToCalendarData.id +
                    "&type=" +
                    this.addToCalendarData.type +
                    e,
                ],
              },
            ]);
        },
        closeDialog: function () {
          this.$emit("closeDialogAddToCalendar");
        },
      },
      computed: {
        bookableConfirmStyle: function () {
          if ("event" === this.addToCalendarData.type)
            return this.hoverConfirm
              ? {
                  color: this.addToCalendarData.color,
                  borderColor: this.addToCalendarData.color,
                  backgroundColor: this.addToCalendarData.color,
                  opacity: 0.8,
                }
              : {
                  color: "#ffffff",
                  backgroundColor: this.addToCalendarData.color,
                  borderColor: this.addToCalendarData.color,
                  opacity: 1,
                };
        },
      },
    };
  },
  788: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          o = e._self._c || t;
        return o("div", { staticClass: "am-show-calendar-container" }, [
          o(
            "div",
            {
              staticClass: "am-success-payment",
              class: e.formObjData
                ? "am-form-" +
                  e.formType +
                  "-" +
                  e.$options.name +
                  "-" +
                  e.addToCalendarData.bookableType
                : "",
              attrs: { id: "am-add-to-calendar" },
            },
            [
              e.headingVisibility
                ? o("h4", [
                    e._v(
                      "\n      " +
                        e._s(
                          e.labelHeading || e.$root.labels.congratulations + "!"
                        ) +
                        "\n    "
                    ),
                  ])
                : e._e(),
              e._v(" "),
              e.imageVisibility
                ? [
                    "event" === e.addToCalendarData.bookableType
                      ? o("div", { staticClass: "am-svg-wrapper" }, [
                          o(
                            "svg",
                            {
                              attrs: {
                                width: "93px",
                                height: "75px",
                                viewBox: "0 0 93 75",
                                version: "1.1",
                                xmlns: "http://www.w3.org/2000/svg",
                                "xmlns:xlink": "http://www.w3.org/1999/xlink",
                              },
                            },
                            [
                              o("desc", [e._v("Created with Sketch.")]),
                              e._v(" "),
                              o("defs"),
                              e._v(" "),
                              o(
                                "g",
                                {
                                  attrs: {
                                    stroke: "none",
                                    "stroke-width": "1",
                                    fill: e.addToCalendarData.color,
                                    "fill-rule": "evenodd",
                                  },
                                },
                                [
                                  o(
                                    "g",
                                    {
                                      attrs: {
                                        id: "trophy-2",
                                        fill: e.addToCalendarData.color,
                                      },
                                    },
                                    [
                                      o("path", {
                                        attrs: {
                                          id: "Shape",
                                          fill: e.addToCalendarData.color,
                                          "fill-rule": "nonzero",
                                          opacity: "0.70165308",
                                          d: "M60.4208496,70.6040039 L60.4208496,57.4158691 L32.5792969,57.4158691 L32.5792969,70.6040039 L27.4505859,70.6040039 L27.4505859,75 L65.5495605,75 L65.5495605,70.6040039 L60.4208496,70.6040039 Z M54.5595703,67.673291 L38.4407227,67.673291 L38.4407227,63.2772949 L54.5595703,63.2772949 L54.5595703,67.673291 Z",
                                        },
                                      }),
                                      e._v(" "),
                                      o("path", {
                                        attrs: {
                                          id: "Shape",
                                          fill: e.addToCalendarData.color,
                                          "fill-rule": "nonzero",
                                          opacity: "0.70165308",
                                          d: "M72.8176758,6.71499023 C72.9522949,5.34711914 73.0227539,3.97749023 73.0227539,2.61196289 C55.5124512,-0.870703125 37.4876953,-0.870703125 19.9772461,2.61196289 C19.9772461,3.97734375 20.0477051,5.34697266 20.1823242,6.71499023 L9.08979492,6.71499023 L9.39433594,9.18237305 C10.3132324,16.6252441 12.7149902,23.8586426 16.5328125,30.6815918 C16.809082,31.1752441 17.0958984,31.6718262 17.385498,32.1575684 C19.3458984,35.4452637 22.9558594,37.4874023 26.8066406,37.4874023 L35.8078125,37.4874023 C37.7727539,39.2396484 39.8791992,40.7935547 42.1040039,42.1038574 L42.1040039,53.0200195 L50.8959961,53.0200195 L50.8959961,42.1038574 C53.1208008,40.7935547 55.2272461,39.2396484 57.1921875,37.4874023 L66.1933594,37.4874023 C70.0439941,37.4874023 73.6539551,35.4451172 75.614502,32.1578613 C75.9041016,31.6724121 76.190918,31.1758301 76.4671875,30.6818848 C80.2851563,23.8587891 82.6869141,16.6252441 83.6056641,9.18251953 L83.9103516,6.71513672 C83.9102051,6.71499023 72.8176758,6.71499023 72.8176758,6.71499023 Z M26.8069336,33.0912598 C24.4962891,33.0912598 22.3331543,31.8706055 21.1614258,29.905957 C20.8924805,29.4549316 20.6260254,28.9937988 20.3693848,28.5351562 C17.2555664,22.9702148 15.1592285,17.1203613 14.1224121,11.1111328 L20.840332,11.1111328 C22.4507813,19.143457 26.2381348,26.8858887 31.5210938,33.0912598 L26.8069336,33.0912598 Z M72.6310547,28.5353027 C72.3742676,28.9940918 72.1081055,29.4552246 71.8391602,29.905957 C70.6674316,31.870752 68.5041504,33.0912598 66.1936523,33.0912598 L61.4794922,33.0912598 C66.7624512,26.8858887 70.5498047,19.1433105 72.1602539,11.1111328 L78.8780273,11.1111328 C77.8412109,17.1202148 75.7450195,22.9700684 72.6310547,28.5353027 Z",
                                        },
                                      }),
                                      e._v(" "),
                                      o("path", {
                                        attrs: {
                                          d: "M48.8443002,15.7224529 C45.5005423,6.20144843 46.3007112,6.42871364 43.03539,15.7224529 C32.8222466,15.9270203 33.3325159,15.2730941 41.2359437,21.2032508 C38.2829325,30.8598674 37.785305,30.199333 45.9401324,24.5849342 C54.312169,30.3481616 53.5240673,30.6147888 50.6431719,21.2032508 C58.7816224,15.0978327 58.7603612,15.9209867 48.8443002,15.7224529 L48.8443002,15.7224529 Z",
                                          id: "Shape",
                                          fill: e.formObjData
                                            ? e.formsData.globalSettings
                                                .formBackgroundColor
                                            : "#ffffff",
                                        },
                                      }),
                                      e._v(" "),
                                      o("path", {
                                        attrs: {
                                          id: "Shape",
                                          fill: e.addToCalendarData.color,
                                          opacity: "0.145471014",
                                          d: "M10.4665585,45.9585064 C7.95874007,38.817753 8.55886675,38.9882019 6.10987581,45.9585064 C-1.54998175,46.1119319 -1.16727978,45.6214873 4.76029109,50.0691048 C2.54553272,57.3115672 2.1723121,56.8161664 8.28843264,52.6053673 C14.5674601,56.9277878 13.9763838,57.1277582 11.8157123,50.0691048 C17.9195501,45.4900412 17.9036042,46.1074067 10.4665585,45.9585064 L10.4665585,45.9585064 Z",
                                        },
                                      }),
                                      e._v(" "),
                                      o("path", {
                                        attrs: {
                                          id: "Shape-Copy",
                                          fill: e.addToCalendarData.color,
                                          opacity: "0.145471014",
                                          d: "M87.4665585,45.9585064 C84.9587401,38.817753 85.5588668,38.9882019 83.1098758,45.9585064 C75.4500183,46.1119319 75.8327202,45.6214873 81.7602911,50.0691048 C79.5455327,57.3115672 79.1723121,56.8161664 85.2884326,52.6053673 C91.5674601,56.9277878 90.9763838,57.1277582 88.8157123,50.0691048 C94.9195501,45.4900412 94.9036042,46.1074067 87.4665585,45.9585064 L87.4665585,45.9585064 Z",
                                        },
                                      }),
                                    ]
                                  ),
                                ]
                              ),
                            ]
                          ),
                        ])
                      : o("div", { staticClass: "am-svg-wrapper" }, [
                          o(
                            "svg",
                            {
                              attrs: {
                                width: "93px",
                                height: "75px",
                                viewBox: "0 0 93 75",
                                version: "1.1",
                                xmlns: "http://www.w3.org/2000/svg",
                                "xmlns:xlink": "http://www.w3.org/1999/xlink",
                              },
                            },
                            [
                              o("desc", [e._v("Created with Sketch.")]),
                              e._v(" "),
                              o("defs"),
                              e._v(" "),
                              o(
                                "g",
                                {
                                  attrs: {
                                    stroke: "none",
                                    "stroke-width": "1",
                                    fill: e.trophyColor(),
                                    "fill-rule": "evenodd",
                                  },
                                },
                                [
                                  o(
                                    "g",
                                    {
                                      attrs: {
                                        id: "trophy-2",
                                        fill: e.trophyColor(),
                                      },
                                    },
                                    [
                                      o("path", {
                                        attrs: {
                                          id: "Shape",
                                          fill: e.trophyColor(),
                                          "fill-rule": "nonzero",
                                          opacity: "0.70165308",
                                          d: "M60.4208496,70.6040039 L60.4208496,57.4158691 L32.5792969,57.4158691 L32.5792969,70.6040039 L27.4505859,70.6040039 L27.4505859,75 L65.5495605,75 L65.5495605,70.6040039 L60.4208496,70.6040039 Z M54.5595703,67.673291 L38.4407227,67.673291 L38.4407227,63.2772949 L54.5595703,63.2772949 L54.5595703,67.673291 Z",
                                        },
                                      }),
                                      e._v(" "),
                                      o("path", {
                                        attrs: {
                                          id: "Shape",
                                          fill: e.trophyColor(),
                                          "fill-rule": "nonzero",
                                          opacity: "0.70165308",
                                          d: "M72.8176758,6.71499023 C72.9522949,5.34711914 73.0227539,3.97749023 73.0227539,2.61196289 C55.5124512,-0.870703125 37.4876953,-0.870703125 19.9772461,2.61196289 C19.9772461,3.97734375 20.0477051,5.34697266 20.1823242,6.71499023 L9.08979492,6.71499023 L9.39433594,9.18237305 C10.3132324,16.6252441 12.7149902,23.8586426 16.5328125,30.6815918 C16.809082,31.1752441 17.0958984,31.6718262 17.385498,32.1575684 C19.3458984,35.4452637 22.9558594,37.4874023 26.8066406,37.4874023 L35.8078125,37.4874023 C37.7727539,39.2396484 39.8791992,40.7935547 42.1040039,42.1038574 L42.1040039,53.0200195 L50.8959961,53.0200195 L50.8959961,42.1038574 C53.1208008,40.7935547 55.2272461,39.2396484 57.1921875,37.4874023 L66.1933594,37.4874023 C70.0439941,37.4874023 73.6539551,35.4451172 75.614502,32.1578613 C75.9041016,31.6724121 76.190918,31.1758301 76.4671875,30.6818848 C80.2851563,23.8587891 82.6869141,16.6252441 83.6056641,9.18251953 L83.9103516,6.71513672 C83.9102051,6.71499023 72.8176758,6.71499023 72.8176758,6.71499023 Z M26.8069336,33.0912598 C24.4962891,33.0912598 22.3331543,31.8706055 21.1614258,29.905957 C20.8924805,29.4549316 20.6260254,28.9937988 20.3693848,28.5351562 C17.2555664,22.9702148 15.1592285,17.1203613 14.1224121,11.1111328 L20.840332,11.1111328 C22.4507813,19.143457 26.2381348,26.8858887 31.5210938,33.0912598 L26.8069336,33.0912598 Z M72.6310547,28.5353027 C72.3742676,28.9940918 72.1081055,29.4552246 71.8391602,29.905957 C70.6674316,31.870752 68.5041504,33.0912598 66.1936523,33.0912598 L61.4794922,33.0912598 C66.7624512,26.8858887 70.5498047,19.1433105 72.1602539,11.1111328 L78.8780273,11.1111328 C77.8412109,17.1202148 75.7450195,22.9700684 72.6310547,28.5353027 Z",
                                        },
                                      }),
                                      e._v(" "),
                                      o("path", {
                                        attrs: {
                                          d: "M48.8443002,15.7224529 C45.5005423,6.20144843 46.3007112,6.42871364 43.03539,15.7224529 C32.8222466,15.9270203 33.3325159,15.2730941 41.2359437,21.2032508 C38.2829325,30.8598674 37.785305,30.199333 45.9401324,24.5849342 C54.312169,30.3481616 53.5240673,30.6147888 50.6431719,21.2032508 C58.7816224,15.0978327 58.7603612,15.9209867 48.8443002,15.7224529 L48.8443002,15.7224529 Z",
                                          id: "Shape",
                                          fill: e.formObjData
                                            ? e.formObjData.globalSettings
                                                .formBackgroundColor
                                            : "#ffffff",
                                        },
                                      }),
                                      e._v(" "),
                                      o("path", {
                                        attrs: {
                                          id: "Shape",
                                          fill: e.trophyColor(),
                                          opacity: "0.145471014",
                                          d: "M10.4665585,45.9585064 C7.95874007,38.817753 8.55886675,38.9882019 6.10987581,45.9585064 C-1.54998175,46.1119319 -1.16727978,45.6214873 4.76029109,50.0691048 C2.54553272,57.3115672 2.1723121,56.8161664 8.28843264,52.6053673 C14.5674601,56.9277878 13.9763838,57.1277582 11.8157123,50.0691048 C17.9195501,45.4900412 17.9036042,46.1074067 10.4665585,45.9585064 L10.4665585,45.9585064 Z",
                                        },
                                      }),
                                      e._v(" "),
                                      o("path", {
                                        attrs: {
                                          id: "Shape-Copy",
                                          fill: e.trophyColor(),
                                          opacity: "0.145471014",
                                          d: "M87.4665585,45.9585064 C84.9587401,38.817753 85.5588668,38.9882019 83.1098758,45.9585064 C75.4500183,46.1119319 75.8327202,45.6214873 81.7602911,50.0691048 C79.5455327,57.3115672 79.1723121,56.8161664 85.2884326,52.6053673 C91.5674601,56.9277878 90.9763838,57.1277582 88.8157123,50.0691048 C94.9195501,45.4900412 94.9036042,46.1074067 87.4665585,45.9585064 L87.4665585,45.9585064 Z",
                                        },
                                      }),
                                    ]
                                  ),
                                ]
                              ),
                            ]
                          ),
                        ]),
                  ]
                : e._e(),
              e._v(" "),
              e.messagesVisibility
                ? o("div", [
                    "approved" === e.addToCalendarData.status
                      ? o("p", [
                          e._v(
                            "\n        " +
                              e._s(
                                e.labelApproved ||
                                  e.$root.labels.booking_completed_approved
                              ) +
                              "\n      "
                          ),
                        ])
                      : e._e(),
                    e._v(" "),
                    "pending" === e.addToCalendarData.status
                      ? o("p", [
                          e._v(
                            "\n        " +
                              e._s(
                                e.labelPending ||
                                  e.$root.labels.booking_completed_pending
                              ) +
                              "\n      "
                          ),
                        ])
                      : e._e(),
                  ])
                : e._e(),
              e._v(" "),
              o("br"),
              e._v(" "),
              e.addToCalendarData.active && e.addToCalendarVisibility
                ? o(
                    "el-row",
                    { attrs: { type: "flex", justify: "center" } },
                    [
                      o(
                        "el-col",
                        {
                          staticClass: "el-form-item",
                          class: e.formObjData
                            ? "am-select-" +
                              e.formType +
                              "-" +
                              e.$options.name +
                              "-" +
                              e.addToCalendarData.bookableType
                            : "",
                          attrs: { sm: 12 },
                        },
                        [
                          o(
                            "el-select",
                            {
                              attrs: {
                                "popper-class": e.formObjData
                                  ? "am-dropdown-" +
                                    e.formType +
                                    "-" +
                                    e.$options.name +
                                    "-" +
                                    e.addToCalendarData.bookableType
                                  : "",
                                placeholder: e.$root.labels.select_calendar,
                              },
                              model: {
                                value: e.calendarIndex,
                                callback: function (t) {
                                  e.calendarIndex = t;
                                },
                                expression: "calendarIndex",
                              },
                            },
                            e._l(e.calendars, function (t, a) {
                              return o("el-option", {
                                key: a,
                                style: {
                                  color:
                                    e.calendarIndex === a
                                      ? e.addToCalendarData.color
                                      : "",
                                },
                                attrs: { label: t.label, value: a },
                              });
                            }),
                            1
                          ),
                        ],
                        1
                      ),
                    ],
                    1
                  )
                : e._e(),
              e._v(" "),
              e.addToCalendarData.active && e.addToCalendarVisibility
                ? o(
                    "div",
                    {
                      staticClass: "el-button el-button--primary calendar-link",
                      class: { "is-disabled": null === e.calendarIndex },
                      style: e.bookableConfirmStyle,
                      on: {
                        mouseenter: function (t) {
                          return e.setBookableConfirmStyle(!0);
                        },
                        mouseleave: function (t) {
                          return e.setBookableConfirmStyle(!1);
                        },
                      },
                    },
                    [
                      null !== e.calendarIndex
                        ? o(
                            "a",
                            {
                              attrs: {
                                href: e.calendars[e.calendarIndex].links[0],
                                target:
                                  "ios" === e.calendars[e.calendarIndex].type ||
                                  "outlook" ===
                                    e.calendars[e.calendarIndex].type
                                    ? "_self"
                                    : "_blank",
                              },
                              on: { click: e.executeIfMultipleLinks },
                            },
                            [
                              e._v(
                                "\n        " +
                                  e._s(e.$root.labels.add_to_calendar) +
                                  "\n      "
                              ),
                            ]
                          )
                        : o("span", [
                            e._v(
                              "\n        " +
                                e._s(e.$root.labels.add_to_calendar) +
                                "\n      "
                            ),
                          ]),
                    ]
                  )
                : e._e(),
              e._v(" "),
              o(
                "div",
                {
                  staticClass: "el-button el-button--primary redirect-link",
                  style: e.bookableConfirmStyle,
                  on: {
                    mouseenter: function (t) {
                      return e.setBookableConfirmStyle(!0);
                    },
                    mouseleave: function (t) {
                      return e.setBookableConfirmStyle(!1);
                    },
                  },
                },
                [
                  "" !== e.redirectUrlAfterAppointment
                    ? o(
                        "a",
                        {
                          attrs: {
                            href: e.redirectUrlAfterAppointment,
                            target: "_self",
                          },
                        },
                        [
                          e._v(
                            "\n        " +
                              e._s(e.$root.labels.finish_appointment) +
                              "\n      "
                          ),
                        ]
                      )
                    : o(
                        "a",
                        {
                          on: {
                            click: function (t) {
                              return e.closeDialog();
                            },
                          },
                        },
                        [
                          e._v(
                            "\n        " +
                              e._s(e.$root.labels.finish_appointment) +
                              "\n      "
                          ),
                        ]
                      ),
                ]
              ),
            ],
            2
          ),
        ]);
      },
      staticRenderFns: [],
    };
  },
});
