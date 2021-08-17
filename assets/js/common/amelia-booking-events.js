wpJsonpAmeliaBookingPlugin([10], {
  1011: function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var o = n(905),
      i = n(715),
      a = n(337),
      s = n(911),
      r = n.n(s),
      l = n(938),
      c = n.n(l),
      u = n(941),
      d = n.n(u),
      m = n(692),
      p = n(690),
      h = n(702),
      f = n.n(h),
      g = n(686),
      v = n(687),
      b = n(0),
      y = n.n(b),
      _ = n(691),
      C = n(717),
      w = n.n(C),
      k = n(826),
      x = n.n(k),
      $ = n(743),
      S = n(829),
      D = n.n(S),
      T = n(882),
      E = n.n(T);
    t.default = {
      mixins: [p.a, v.a, a.a, m.a, _.a, g.a, o.a, i.a, $.a],
      data: function () {
        return {
          exportAction: "",
          exportParams: {
            fields: [
              {
                label: this.$root.labels.first_name,
                value: "firstName",
                checked: !0,
              },
              {
                label: this.$root.labels.last_name,
                value: "lastName",
                checked: !0,
              },
              { label: this.$root.labels.email, value: "email", checked: !0 },
              { label: this.$root.labels.phone, value: "phone", checked: !0 },
              { label: this.$root.labels.gender, value: "gender", checked: !0 },
              {
                label: this.$root.labels.date_of_birth,
                value: "birthday",
                checked: !0,
              },
              {
                label: this.$root.labels.customer_note,
                value: "note",
                checked: !0,
              },
              {
                label: this.$root.labels.event_book_persons,
                value: "persons",
                checked: !0,
              },
              {
                label: this.$root.labels.custom_fields,
                value: "customFields",
                checked: !0,
              },
            ],
          },
          dialogExport: !1,
          event: null,
          eventBookings: null,
          eventBooking: null,
          clonedEventBooking: null,
          updateStatusDisabled: !1,
          allEventsChecked: !1,
          allDateEventsChecked: {},
          eventsDay: {},
          customer: null,
          customerCreatedCount: 0,
          dialogEvent: !1,
          dialogCustomer: !1,
          dialogAttendees: !1,
          dialogEventCustomFields: !1,
          fetched: !1,
          fetchedFiltered: !1,
          form: new f.a(),
          params: { dates: this.getDatePickerInitRange(), search: "" },
          activeTab: "event_details",
          showDeleteConfirmation: !1,
          timer: null,
          toaster: !1,
          count: { success: 0, error: 0 },
          dialogTranslate: !1,
          dialogTranslateType: "name",
          languagesData: [],
        };
      },
      created: function () {
        var e = this.getUrlQueryParams(window.location.href);
        (this.params.dates =
          "dateFrom" in e && "dateTo" in e
            ? { start: y()(e.dateFrom).toDate(), end: y()(e.dateTo).toDate() }
            : this.getDatePickerInitRange()),
          this.getEventOptions(!0),
          this.setInitialCustomers();
      },
      mounted: function () {},
      methods: {
        canManage: function () {
          return (
            "customer" !== this.$root.settings.role &&
            ("admin" === this.$root.settings.role ||
              "manager" === this.$root.settings.role ||
              ("provider" === this.$root.settings.role &&
                this.$root.settings.roles.allowWriteEvents))
          );
        },
        updateAttendeesCallback: function () {
          this.getEvents();
        },
        duplicateEventCallback: function (e) {
          var t = this;
          (this.event = e),
            (this.event.id = 0),
            (this.event.duplicated = !0),
            setTimeout(function () {
              t.dialogEvent = !0;
            }, 300);
        },
        saveAttendeeCallback: function (e) {
          ("bookingStatusChanged" in e &&
            e.booking.persons === this.clonedEventBooking.persons) ||
            this.$http
              .post(
                this.$root.getAjaxUrl + "/bookings/success/" + e.booking.id,
                {
                  type: "event",
                  appointmentStatusChanged: e.appointmentStatusChanged,
                }
              )
              .then(function (e) {})
              .catch(function (e) {}),
            this.getEvents(),
            this.getEvent(e.event.id);
        },
        showDialogNewCustomer: function () {
          (this.customer = this.getInitCustomerObject()),
            (this.dialogCustomer = !0);
        },
        saveCustomerCallback: function (e) {
          delete e.user.birthday,
            this.options.entities.customers.push(e.user),
            this.customerCreatedCount++;
        },
        saveEventCallback: function () {
          this.$http
            .post(this.$root.getAjaxUrl + "/settings", {
              usedLanguages:
                this.options.entities.settings.general.usedLanguages,
            })
            .catch(function (e) {
              console.log(e);
            }),
            this.getEvents();
        },
        changeRange: function () {
          this.setDatePickerSelectedDaysCount(
            this.params.dates.start,
            this.params.dates.end
          ),
            this.changeFilter();
        },
        changeFilter: function () {
          this.getEvents();
        },
        getEventOptions: function (e) {
          var t = this;
          (this.options.fetched = !1),
            this.$http
              .get(this.$root.getAjaxUrl + "/entities", {
                params: {
                  types: [
                    "locations",
                    "employees",
                    "tags",
                    "custom_fields",
                    "settings",
                    "coupons",
                  ],
                },
              })
              .then(function (n) {
                "customer" !== t.$root.settings.role &&
                  (t.options.entities.settings.general.usedLanguages =
                    n.data.data.settings.general.usedLanguages),
                  (t.options.entities.locations = n.data.data.locations),
                  (t.options.entities.employees = n.data.data.employees),
                  (t.options.entities.customFields = n.data.data.customFields),
                  (t.options.entities.customers = n.data.data.customers),
                  (t.options.entities.coupons = n.data.data.coupons),
                  (t.languagesData = n.data.data.settings.languages),
                  (t.fetched = !0),
                  (t.options.fetched = !0);
                var o = t;
                n.data.data.tags.forEach(function (e) {
                  -1 === o.options.entities.tags.indexOf(e.name) &&
                    o.options.entities.tags.push(e.name);
                }),
                  e && t.getEvents();
              })
              .catch(function (e) {
                console.log(e.message),
                  (t.fetched = !0),
                  (t.options.fetched = !0);
              });
        },
        getEvents: function () {
          var e = this;
          this.fetchedFiltered = !1;
          var t = JSON.parse(JSON.stringify(this.params)),
            n = [];
          t.dates &&
            (t.dates.start && n.push(y()(t.dates.start).format("YYYY-MM-DD")),
            t.dates.end && n.push(y()(t.dates.end).format("YYYY-MM-DD")),
            (t.dates = n)),
            Object.keys(t).forEach(function (e) {
              return !t[e] && 0 !== t[e] && delete t[e];
            }),
            "provider" === this.$root.settings.role &&
              this.$root.settings.roles.allowWriteEvents &&
              (t.providers = this.options.entities.employees.map(function (e) {
                return e.id;
              })),
            this.$http
              .get(this.$root.getAjaxUrl + "/events", { params: t })
              .then(function (t) {
                var n = {};
                t.data.data.events.forEach(function (e) {
                  e.periods.forEach(function (t) {
                    for (
                      var o = y()(t.periodStart, "YYYY-MM-DD HH:mm:ss"),
                        i = y()(t.periodEnd, "YYYY-MM-DD HH:mm:ss");
                      o.isBefore(i);

                    ) {
                      var a = o.format("YYYY-MM-DD");
                      a in n || (n[a] = { date: a, events: [] }),
                        e.full
                          ? (e.status = "full")
                          : e.upcoming && (e.status = "upcoming"),
                        n[a].events.push({
                          id: e.id,
                          name: e.name,
                          periodStart: t.periodStart,
                          periodEnd: t.periodEnd,
                          bookingOpens: e.bookingOpens,
                          bookingCloses: e.bookingCloses,
                          recurring: e.recurring,
                          maxCapacity: e.maxCapacity,
                          status: e.status,
                          places: e.places,
                          created: e.created,
                          opened: e.opened,
                          closed: e.closed,
                          checked: !1,
                          zoomMeeting: t.zoomMeeting,
                          translations: e.translations,
                        }),
                        o.add(1, "days");
                    }
                  });
                }),
                  (e.eventsDay = e.removeEventsDuplicated(n)),
                  (e.fetched = !0),
                  (e.fetchedFiltered = !0);
              })
              .catch(function (t) {
                console.log(t.message),
                  (e.fetched = !0),
                  (e.fetchedFiltered = !0);
              });
        },
        /**
         * //p2p: remove event duplicated
         */
        removeEventsDuplicated: function(events) {
          const ids = [];
          const toRemove = {};
          if (this.$root.settings.role !== 'admin') return events;
          for (const property in events) {
            const group = events[property];
            group.events.forEach((item, index) => {
              if (!ids.includes(item.id)) {
                ids.push(item.id);
              }
              else {
                if (toRemove[property]) {
                  toRemove[property].push(item.id);
                } else {
                  toRemove[property] = [item.id];
                }
              }  
            });
          }
          
          for (const property in toRemove) {
            events[property].events = events[property].events.filter(x => !toRemove[property].includes(x.id));
            if (!events[property].events.length) delete events[property];
          }
          return events;
        },
        /**
         * //p2p: convert month name to short
         */
        getFormatDateShortMonth: function(e) {          
          const datePart = this.getFrontedFormattedDate(e.split(" ")[0]);
          const indexSpace = datePart.indexOf(' ');
          return datePart.substr(0, 3) + datePart.substr(indexSpace);
        },
        closeDialogAttendees: function () {
          this.dialogAttendees = !1;
        },
        handleDateTimeFormat: function (e) {
          return [
            this.getFrontedFormattedDate(e.split(" ")[0]),
            this.getFrontedFormattedTime(e.split(" ")[1]),
          ];
        },
        showDialogAttendee: function (e) {
          (this.eventBooking = e),
            (this.clonedEventBooking = JSON.parse(JSON.stringify(e))),
            (this.dialogEventCustomFields = !0);
        },
        closeDialogAttendee: function () {
          this.dialogEventCustomFields = !1;
        },
        showDialogTranslate: function (e) {
          (this.dialogTranslateType = e), (this.dialogTranslate = !0);
        },
        saveDialogTranslate: function (e, t) {
          (this.options.entities.settings.general.usedLanguages =
            this.options.entities.settings.general.usedLanguages.concat(t)),
            (this.event.translations = e),
            (this.dialogTranslate = !1);
        },
      },
      computed: {
        filterApplied: function () {
          return (
            !!this.params.search ||
            !!this.params.dates.start ||
            !!this.params.dates.end
          );
        },
        eventCustomerIds: function () {
          return this.eventBookings.map(function (e) {
            return e.customerId;
          });
        },
        eventBookMultipleTimes: function () {
          return this.event.bookMultipleTimes;
        },
      },
      watch: {
        "params.search": function () {
          void 0 !== this.params.search &&
            ((this.fetchedFiltered = !1),
            clearTimeout(this.timer),
            (this.timer = setTimeout(this.changeFilter, 500)));
        },
      },
      components: {
        DialogCustomer: x.a,
        PageHeader: w.a,
        DialogExport: D.a,
        DialogEvent: r.a,
        DialogAttendees: c.a,
        DialogAttendee: d.a,
        DialogTranslate: E.a,
      },
    };
  },
  1012: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = this,
          n = t.$createElement,
          o = t._self._c || n;
        return o("div", { staticClass: "am-wrap" }, [
          o(
            "div",
            { staticClass: "am-body", attrs: { id: "am-events" } },
            [
              o("page-header", {
                on: { newEventBtnClicked: t.showDialogNewEvent },
              }),
              t._v(" "),
              o(
                "div",
                {
                  staticClass: "am-spinner am-section",
                  staticStyle: { display: "none" },
                },
                [
                  o("img", {
                    attrs: { src: t.$root.getUrl + "public/img/spinner.svg" },
                  }),
                ]
              ),
              t._v(" "),
              t.fetched &&
              0 === Object.keys(t.eventsDay).length &&
              !t.filterApplied &&
              t.fetchedFiltered &&
              t.options.fetched
                ? o("div", { staticClass: "am-empty-state am-section" }, [
                    o("img", {
                      attrs: {
                        src: t.$root.getUrl + "public/img/emptystate.svg",
                      },
                    }),
                    t._v(" "),
                    o("h2", [t._v(t._s(t.$root.labels.no_events_yet))]),
                    t._v(" "),
                    o("p", [t._v(t._s(t.$root.labels.click_add_events))]),
                  ])
                : t._e(),
              t._v(" "),
              o(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value:
                        0 !== Object.keys(t.eventsDay).length ||
                        (0 === Object.keys(t.eventsDay).length &&
                          t.filterApplied) ||
                        !t.fetchedFiltered,
                      expression:
                        "(Object.keys(eventsDay).length !== 0 || (Object.keys(eventsDay).length === 0 && filterApplied) || !fetchedFiltered)",
                    },
                  ],
                },
                [
                  o(
                    "div",
                    { staticClass: "am-events-filter am-section" },
                    [
                      o(
                        "el-form",
                        { attrs: { method: "POST" } },
                        [
                          o(
                            "el-row",
                            { attrs: { gutter: 16 } },
                            [
                              o(
                                "el-col",
                                {
                                  staticClass: "v-calendar-column",
                                  attrs: { md: 5 },
                                },
                                [
                                  o(
                                    "el-form-item",
                                    { attrs: { prop: "dates" } },
                                    [
                                      o("v-date-picker", {
                                        attrs: {
                                          "is-double-paned": !1,
                                          mode: "range",
                                          "popover-visibility": "focus",
                                          "popover-direction": "bottom",
                                          "popover-align": "left",
                                          "tint-color": "#1A84EE",
                                          "show-day-popover": !1,
                                          "input-props": {
                                            class: "el-input__inner",
                                          },
                                          "is-expanded": !1,
                                          "is-required": !0,
                                          "input-class": "el-input__inner",
                                          formats: t.vCalendarFormats,
                                        },
                                        on: { input: t.changeRange },
                                        model: {
                                          value: t.params.dates,
                                          callback: function (e) {
                                            t.$set(t.params, "dates", e);
                                          },
                                          expression: "params.dates",
                                        },
                                      }),
                                    ],
                                    1
                                  ),
                                ],
                                1
                              ),
                              t._v(" "),
                              o("el-col", { attrs: { md: 19 } }, [
                                o(
                                  "div",
                                  { staticClass: "am-search" },
                                  [
                                    o(
                                      "el-form-item",
                                      [
                                        o("el-input", {
                                          attrs: {
                                            placeholder:
                                              t.$root.labels
                                                .event_search_placeholder,
                                          },
                                          model: {
                                            value: t.params.search,
                                            callback: function (e) {
                                              t.$set(t.params, "search", e);
                                            },
                                            expression: "params.search",
                                          },
                                        }),
                                      ],
                                      1
                                    ),
                                  ],
                                  1
                                ),
                              ]),
                            ],
                            1
                          ),
                        ],
                        1
                      ),
                    ],
                    1
                  ),
                  t._v(" "),
                  o(
                    "div",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value:
                            t.fetched &&
                            0 === Object.keys(t.eventsDay).length &&
                            t.filterApplied &&
                            t.fetchedFiltered &&
                            t.options.fetched,
                          expression:
                            "fetched && Object.keys(eventsDay).length === 0 && filterApplied && fetchedFiltered && options.fetched",
                        },
                      ],
                      staticClass: "am-empty-state am-section",
                      staticStyle: { display: "none" },
                    },
                    [
                      o("img", {
                        attrs: {
                          src: t.$root.getUrl + "public/img/emptystate.svg",
                        },
                      }),
                      t._v(" "),
                      o("h2", [t._v(t._s(t.$root.labels.no_results))]),
                    ]
                  ),
                  t._v(" "),
                  o(
                    "div",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value:
                            !t.fetched ||
                            !t.fetchedFiltered ||
                            !t.options.fetched,
                          expression:
                            "!fetched || !fetchedFiltered || !options.fetched",
                        },
                      ],
                      staticClass: "am-spinner am-section",
                    },
                    [
                      o("img", {
                        attrs: {
                          src: t.$root.getUrl + "public/img/spinner.svg",
                        },
                      }),
                    ]
                  ),
                  t._v(" "),
                  o(
                    "div",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value:
                            t.fetchedFiltered &&
                            t.options.fetched &&
                            0 !== Object.keys(t.eventsDay).length,
                          expression:
                            "fetchedFiltered && options.fetched && Object.keys(eventsDay).length !== 0",
                        },
                      ],
                      staticClass: "am-events am-section",
                    },
                    [
                      o(
                        "div",
                        { staticClass: "am-events-list-head" },
                        [
                          o(
                            "el-row",
                            [
                              o(
                                "el-col",
                                { attrs: { lg: 11 } },
                                [
                                  o(
                                    "el-row",
                                    {
                                      staticClass:
                                        "am-events-flex-row-middle-align",
                                      attrs: { gutter: 10 },
                                    },
                                    [
                                      o("el-col", { attrs: { lg: 7 } }, [
                                        o("p"),
                                      ]),
                                      t._v(" "),
                                      o("el-col", { attrs: { lg: 8 } }, [
                                        o("p", [
                                          t._v(t._s(t.$root.labels.event_name)),
                                        ]),
                                      ]),
                                      t._v(" "),
                                      o("el-col", { attrs: { lg: 4 } }, [
                                        o("p", [
                                          t._v(
                                            t._s(t.$root.labels.event_capacity)
                                          ),
                                        ]),
                                      ]),
                                      t._v(" "),
                                      o("el-col", { attrs: { lg: 4 } }, [
                                        o("p", [
                                          t._v(
                                            t._s(t.$root.labels.event_recurring)
                                          ),
                                        ]),
                                      ]),
                                    ],
                                    1
                                  ),
                                ],
                                1
                              ),
                              t._v(" "),
                              o(
                                "el-col",
                                { attrs: { lg: 13 } },
                                [
                                  o(
                                    "el-row",
                                    {
                                      staticClass:
                                        "am-events-flex-row-middle-align",
                                      attrs: { gutter: 10 },
                                    },
                                    [
                                      o("el-col", { attrs: { lg: 0, md: 3 } }),
                                      t._v(" "),
                                      o("el-col", { attrs: { lg: 6 } }, [
                                        o("p", [
                                          t._v(
                                            t._s(
                                              t.$root.labels.event_booking_opens
                                            )
                                          ),
                                        ]),
                                      ]),
                                      t._v(" "),
                                      o("el-col", { attrs: { lg: 6 } }, [
                                        o("p", [
                                          t._v(
                                            t._s(
                                              t.$root.labels
                                                .event_booking_closes
                                            )
                                          ),
                                        ]),
                                      ]),
                                      t._v(" "),
                                      o("el-col", { attrs: { lg: 3 } }, [
                                        o("p", [
                                          t._v(
                                            t._s(t.$root.labels.status_colon)
                                          ),
                                        ]),
                                      ]),
                                      t._v(" "),
                                      t.canManage()
                                        ? o("el-col", { attrs: { lg: 9 } })
                                        : t._e(),
                                      t._v(" "),
                                      t.$root.settings.zoom.enabled &&
                                      "customer" === t.$root.settings.role
                                        ? o("el-col", { attrs: { lg: 9 } }, [
                                            o("p", [
                                              t._v(
                                                t._s(
                                                  t.$root.labels.zoom_join_link
                                                )
                                              ),
                                            ]),
                                          ])
                                        : t._e(),
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
                      t._v(" "),
                      t._l(t.eventsDay, function (e, n) {
                        return o("div", [
                          o(
                            "div",
                            { staticClass: "am-events-list-day-title" },
                            [
                              o(
                                "el-row",
                                [
                                  o("el-col", { attrs: { span: 24 } }, [
                                    o("h2", [
                                      t._v(
                                        "\n                  " +
                                          t._s(
                                            t.handleDateTimeFormat(
                                              e.date + " 00:00:00"
                                            )[0]
                                          ) +
                                          "\n                "
                                      ),
                                    ]),
                                  ]),
                                ],
                                1
                              ),
                            ],
                            1
                          ),
                          t._v(" "),
                          o(
                            "div",
                            { staticClass: "am-events-list" },
                            t._l(e.events, function (e, n) {
                              return o(
                                "div",
                                {
                                  key: n,
                                  staticClass: "am-event",
                                  attrs: { name: e.id },
                                },
                                [
                                  o(
                                    "div",
                                    { staticClass: "am-event-data" },
                                    [
                                      o(
                                        "el-row",
                                        [
                                          o(
                                            "el-col",
                                            { attrs: { lg: 11 } },
                                            [
                                              o(
                                                "el-row",
                                                {
                                                  staticClass:
                                                    "am-events-flex-row-middle-align",
                                                  attrs: { gutter: 10 },
                                                },
                                                [
                                                  o(
                                                    "el-col",
                                                    { attrs: { lg: 7, sm: 7 } },
                                                    [
                                                      o(
                                                        "span",
                                                        {
                                                          staticClass:
                                                            "am-event-checkbox",
                                                          on: {
                                                            click: function (
                                                              e
                                                            ) {
                                                              e.stopPropagation();
                                                            },
                                                          },
                                                        },
                                                        [
                                                          o(
                                                            "span",
                                                            {
                                                              staticClass: "am-event-time",
                                                              style: { "white-space": "nowrap" },
                                                            }, //p2p: add periodStart date and periodEnd date and format date with short month name
                                                            [
                                                              t._v(
                                                                "\n                                    " +
                                                                  t._s(
                                                                    t.getFormatDateShortMonth(
                                                                      e.periodStart
                                                                    )
                                                                  ) +
                                                                  " - " +
                                                                  t._s(
                                                                    t.getFormatDateShortMonth(
                                                                      e.periodEnd
                                                                    )
                                                                  ) +
                                                                  "\n                                  "
                                                              ),
                                                            ]
                                                          ),
                                                          o(
                                                            "span",
                                                            {
                                                              staticClass:
                                                                "am-event-time",
                                                            },
                                                            [
                                                              t._v(
                                                                "\n                              " +
                                                                  t._s(
                                                                    t.handleDateTimeFormat(
                                                                      e.periodStart
                                                                    )[1]
                                                                  ) +
                                                                  " - " +
                                                                  t._s(
                                                                    t.handleDateTimeFormat(
                                                                      e.periodEnd
                                                                    )[1]
                                                                  ) +
                                                                  "\n                            "
                                                              ),
                                                            ]
                                                          ),
                                                        ]
                                                      ),
                                                    ]
                                                  ),
                                                  t._v(" "),
                                                  o(
                                                    "el-col",
                                                    { attrs: { lg: 8, sm: 9 } },
                                                    [
                                                      o(
                                                        "p",
                                                        {
                                                          staticClass:
                                                            "am-col-title",
                                                        },
                                                        [
                                                          t._v(
                                                            t._s(
                                                              t.$root.labels
                                                                .event_name
                                                            )
                                                          ),
                                                        ]
                                                      ),
                                                      t._v(" "),
                                                      o("h4", [
                                                        t._v(
                                                          "\n                          " +
                                                            t._s(e.name) +
                                                            "\n                          "
                                                        ),
                                                        o(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "am-event-data-id",
                                                          },
                                                          [
                                                            t._v(
                                                              " (" +
                                                                t._s(
                                                                  t.$root.labels
                                                                    .id
                                                                ) +
                                                                ": " +
                                                                t._s(e.id) +
                                                                ")"
                                                            ),
                                                          ]
                                                        ),
                                                      ]),
                                                    ]
                                                  ),
                                                  t._v(" "),
                                                  o(
                                                    "el-col",
                                                    {
                                                      attrs: {
                                                        lg: 4,
                                                        sm: 4,
                                                        xs: 12,
                                                      },
                                                    },
                                                    [
                                                      o(
                                                        "p",
                                                        {
                                                          staticClass:
                                                            "am-col-title",
                                                        },
                                                        [
                                                          t._v(
                                                            t._s(
                                                              t.$root.labels
                                                                .event_capacity
                                                            )
                                                          ),
                                                        ]
                                                      ),
                                                      t._v(" "),
                                                      o("p", [
                                                        o(
                                                          "span",
                                                          {
                                                            staticClass:
                                                              "am-semi-strong",
                                                          },
                                                          [
                                                            t._v(
                                                              t._s(
                                                                e.maxCapacity -
                                                                  e.places
                                                              )
                                                            ),
                                                          ]
                                                        ),
                                                        t._v(
                                                          " / " +
                                                            t._s(e.maxCapacity)
                                                        ),
                                                      ]),
                                                    ]
                                                  ),
                                                  t._v(" "),
                                                  o(
                                                    "el-col",
                                                    {
                                                      attrs: {
                                                        lg: 4,
                                                        sm: 4,
                                                        xs: 12,
                                                      },
                                                    },
                                                    [
                                                      o(
                                                        "p",
                                                        {
                                                          staticClass:
                                                            "am-col-title",
                                                        },
                                                        [
                                                          t._v(
                                                            t._s(
                                                              t.$root.labels
                                                                .event_recurring
                                                            )
                                                          ),
                                                        ]
                                                      ),
                                                      t._v(" "),
                                                      o(
                                                        "div",
                                                        {
                                                          staticClass:
                                                            "am-event-recurring",
                                                        },
                                                        [
                                                          e.recurring
                                                            ? o(
                                                                "p",
                                                                {
                                                                  staticClass:
                                                                    "am-recurring-label",
                                                                },
                                                                [
                                                                  o("img", {
                                                                    attrs: {
                                                                      src:
                                                                        t.$root
                                                                          .getUrl +
                                                                        "public/img/loop.svg",
                                                                    },
                                                                  }),
                                                                  t._v(
                                                                    " " +
                                                                      t._s(
                                                                        t.$root
                                                                          .labels
                                                                          .yes
                                                                      )
                                                                  ),
                                                                ]
                                                              )
                                                            : o("p", [
                                                                t._v(
                                                                  t._s(
                                                                    t.$root
                                                                      .labels.no
                                                                  )
                                                                ),
                                                              ]),
                                                        ]
                                                      ),
                                                    ]
                                                  ),
                                                ],
                                                1
                                              ),
                                            ],
                                            1
                                          ),
                                          t._v(" "),
                                          o(
                                            "el-col",
                                            { attrs: { lg: 13 } },
                                            [
                                              o(
                                                "el-row",
                                                {
                                                  staticClass:
                                                    "am-events-flex-row-middle-align",
                                                  attrs: { gutter: 10 },
                                                },
                                                [
                                                  o(
                                                    "el-col",
                                                    {
                                                      attrs: {
                                                        lg: 7,
                                                        sm: 10,
                                                        xs: 12,
                                                      },
                                                    },
                                                    [
                                                      o(
                                                        "p",
                                                        {
                                                          staticClass:
                                                            "am-col-title",
                                                        },
                                                        [
                                                          t._v(
                                                            t._s(
                                                              t.$root.labels
                                                                .event_booking_opens
                                                            )
                                                          ),
                                                        ]
                                                      ),
                                                      t._v(" "),
                                                      o(
                                                        "el-tooltip",
                                                        {
                                                          staticClass: "item",
                                                          attrs: {
                                                            effect: "dark",
                                                            content: "Open",
                                                            placement: "top",
                                                            disabled:
                                                              !e.bookingOpens,
                                                          },
                                                        },
                                                        [
                                                          o(
                                                            "p",
                                                            {
                                                              class: {
                                                                "am-event-open":
                                                                  e.opened &&
                                                                  "approved" ===
                                                                    e.status,
                                                              },
                                                            },
                                                            [
                                                              o(
                                                                "span",
                                                                {
                                                                  staticClass:
                                                                    "am-semi-strong",
                                                                }, //p2p: format date with short month name
                                                                [
                                                                  t._v(
                                                                    t._s(
                                                                      t.getFormatDateShortMonth(
                                                                        e.bookingOpens
                                                                          ? e.bookingOpens
                                                                          : e.created
                                                                      )
                                                                    )
                                                                  ),
                                                                ]
                                                              ),
                                                              t._v(
                                                                "\n@"
                                                              ),
                                                              o(
                                                                "span",
                                                                {
                                                                  staticClass:
                                                                    "am-semi-strong",
                                                                },
                                                                [
                                                                  t._v(
                                                                    " " +
                                                                      t._s(
                                                                        t.handleDateTimeFormat(
                                                                          e.bookingOpens
                                                                            ? e.bookingOpens
                                                                            : e.created
                                                                        )[1]
                                                                      )
                                                                  ),
                                                                ]
                                                              ),
                                                            ]
                                                          ),
                                                        ]
                                                      ),
                                                    ],
                                                    1
                                                  ),
                                                  t._v(" "),
                                                  o(
                                                    "el-col",
                                                    {
                                                      attrs: {
                                                        lg: 7,
                                                        sm: 10,
                                                        xs: 12,
                                                      },
                                                    },
                                                    [
                                                      o(
                                                        "p",
                                                        {
                                                          staticClass:
                                                            "am-col-title",
                                                        },
                                                        [
                                                          t._v(
                                                            t._s(
                                                              t.$root.labels
                                                                .event_booking_closes
                                                            )
                                                          ),
                                                        ]
                                                      ),
                                                      t._v(" "),
                                                      o(
                                                        "el-tooltip",
                                                        {
                                                          staticClass: "item",
                                                          attrs: {
                                                            effect: "dark",
                                                            content: "Closed",
                                                            placement: "top",
                                                            disabled:
                                                              !e.bookingCloses,
                                                          },
                                                        },
                                                        [
                                                          o(
                                                            "p",
                                                            {
                                                              class: {
                                                                "am-event-closed":
                                                                  e.closed &&
                                                                  "approved" ===
                                                                    e.status,
                                                              },
                                                            },
                                                            [
                                                              o(
                                                                "span",
                                                                {
                                                                  staticClass:
                                                                    "am-semi-strong",
                                                                }, //p2p: format date with short month name
                                                                [
                                                                  t._v(
                                                                    t._s(
                                                                      t.getFormatDateShortMonth(
                                                                        e.bookingCloses
                                                                          ? e.bookingCloses
                                                                          : e.periodStart
                                                                      )
                                                                    )
                                                                  ),
                                                                ]
                                                              ),
                                                              t._v(
                                                                "\n@"
                                                              ),
                                                              o(
                                                                "span",
                                                                {
                                                                  staticClass:
                                                                    "am-semi-strong",
                                                                },
                                                                [
                                                                  t._v(
                                                                    " " +
                                                                      t._s(
                                                                        t.handleDateTimeFormat(
                                                                          e.bookingCloses
                                                                            ? e.bookingCloses
                                                                            : e.periodStart
                                                                        )[1]
                                                                      )
                                                                  ),
                                                                ]
                                                              ),
                                                            ]
                                                          ),
                                                        ]
                                                      ),
                                                    ],
                                                    1
                                                  ),
                                                  t._v(" "),
                                                  o(
                                                    "el-col",
                                                    {
                                                      attrs: {
                                                        lg: 3,
                                                        sm: 4,
                                                        xs: 24,
                                                      },
                                                    },
                                                    [
                                                      o(
                                                        "p",
                                                        {
                                                          staticClass:
                                                            "am-col-title",
                                                        },
                                                        [
                                                          t._v(
                                                            t._s(
                                                              t.$root.labels
                                                                .status_colon
                                                            )
                                                          ),
                                                        ]
                                                      ),
                                                      t._v(" "),
                                                      o(
                                                        "span",
                                                        {
                                                          class:
                                                            "am-customer-status " +
                                                            t.getEventStatus(e)
                                                              .class,
                                                        },
                                                        [
                                                          t._v(
                                                            "\n                          " +
                                                              t._s(
                                                                t.getEventStatus(
                                                                  e
                                                                ).label
                                                              ) +
                                                              "\n                        "
                                                          ),
                                                        ]
                                                      ),
                                                    ]
                                                  ),
                                                  t._v(" "),
                                                  t.canManage()
                                                    ? o(
                                                        "el-col",
                                                        {
                                                          staticClass:
                                                            "am-align-right",
                                                          attrs: {
                                                            lg: 9,
                                                            sm: 10,
                                                            xs: 24,
                                                          },
                                                        },
                                                        [
                                                          o(
                                                            "div",
                                                            {
                                                              staticClass:
                                                                "am-event-actions",
                                                              on: {
                                                                click:
                                                                  function (e) {
                                                                    e.stopPropagation();
                                                                  },
                                                              },
                                                            },
                                                            [
                                                              t.canManage()
                                                                ? o(
                                                                    "el-button",
                                                                    {
                                                                      attrs: {
                                                                        disabled:
                                                                          !t.canManage(),
                                                                      },
                                                                      on: {
                                                                        click:
                                                                          function (
                                                                            n
                                                                          ) {
                                                                            return t.showDialogAttendees(
                                                                              e.id
                                                                            );
                                                                          },
                                                                      },
                                                                    },
                                                                    [
                                                                      t._v(
                                                                        "\n                            " +
                                                                          t._s(
                                                                            t
                                                                              .$root
                                                                              .labels
                                                                              .event_attendees
                                                                          ) +
                                                                          "\n                          "
                                                                      ),
                                                                    ]
                                                                  )
                                                                : t._e(),
                                                              t._v(" "),
                                                              t.canManage()
                                                                ? o(
                                                                    "el-button",
                                                                    {
                                                                      attrs: {
                                                                        disabled:
                                                                          !t.canManage(),
                                                                      },
                                                                      on: {
                                                                        click:
                                                                          function (
                                                                            n
                                                                          ) {
                                                                            return t.showDialogEditEvent(
                                                                              e.id
                                                                            );
                                                                          },
                                                                      },
                                                                    },
                                                                    [
                                                                      t._v(
                                                                        "\n                            " +
                                                                          t._s(
                                                                            t
                                                                              .$root
                                                                              .labels
                                                                              .edit
                                                                          ) +
                                                                          "\n                          "
                                                                      ),
                                                                    ]
                                                                  )
                                                                : t._e(),
                                                            ],
                                                            1
                                                          ),
                                                        ]
                                                      )
                                                    : t._e(),
                                                  t._v(" "),
                                                  "customer" ===
                                                    t.$root.settings.role &&
                                                  t.$root.settings.zoom
                                                    .enabled &&
                                                  e.zoomMeeting
                                                    ? o(
                                                        "el-col",
                                                        {
                                                          staticClass:
                                                            "am-align-right",
                                                          attrs: {
                                                            lg: 9,
                                                            sm: 10,
                                                            xs: 24,
                                                          },
                                                        },
                                                        [
                                                          o(
                                                            "p",
                                                            {
                                                              staticClass:
                                                                "am-col-title",
                                                            },
                                                            [
                                                              t._v(
                                                                t._s(
                                                                  t.$root.labels
                                                                    .zoom_join_link
                                                                )
                                                              ),
                                                            ]
                                                          ),
                                                          t._v(" "),
                                                          o(
                                                            "a",
                                                            {
                                                              staticClass:
                                                                "am-link",
                                                              staticStyle: {
                                                                float: "left",
                                                              },
                                                              attrs: {
                                                                href: e
                                                                  .zoomMeeting
                                                                  .joinUrl,
                                                              },
                                                            },
                                                            [
                                                              t._v(
                                                                t._s(
                                                                  e.zoomMeeting
                                                                    .joinUrl
                                                                )
                                                              ),
                                                            ]
                                                          ),
                                                        ]
                                                      )
                                                    : t._e(),
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
                                ]
                              );
                            }),
                            0
                          ),
                        ]);
                      }),
                    ],
                    2
                  ),
                ]
              ),
              t._v(" "),
              t.canManage()
                ? o(
                    "div",
                    {
                      staticClass: "am-button-new",
                      attrs: { id: "am-button-new" },
                    },
                    [
                      o("el-button", {
                        attrs: {
                          id: "am-plus-symbol",
                          type: "primary",
                          icon: "el-icon-plus",
                        },
                        on: { click: t.showDialogNewEvent },
                      }),
                    ],
                    1
                  )
                : t._e(),
              t._v(" "),
              o(
                "transition",
                { attrs: { name: "slide" } },
                [
                  t.dialogEvent
                    ? o(
                        "el-dialog",
                        {
                          staticClass: "am-side-dialog am-dialog-event",
                          attrs: { "show-close": !1, visible: t.dialogEvent },
                          on: {
                            "update:visible": function (e) {
                              t.dialogEvent = e;
                            },
                          },
                        },
                        [
                          o("dialog-event", {
                            attrs: {
                              event: t.event,
                              employees: t.options.entities.employees,
                              locations: t.options.entities.locations,
                              tags: t.options.entities.tags,
                              settings: t.options.entities.settings,
                            },
                            on: {
                              closeDialog: t.closeDialogEvent,
                              saveCallback: t.saveEventCallback,
                              showDialogTranslate: t.showDialogTranslate,
                              duplicateCallback: t.duplicateEventCallback,
                            },
                          }),
                        ],
                        1
                      )
                    : t._e(),
                ],
                1
              ),
              t._v(" "),
              o(
                "transition",
                { attrs: { name: "slide" } },
                [
                  t.dialogAttendees && t.event && t.eventBookings
                    ? o(
                        "el-dialog",
                        {
                          staticClass: "am-side-dialog am-dialog-event",
                          attrs: {
                            "show-close": !1,
                            visible: t.dialogAttendees,
                          },
                          on: {
                            "update:visible": function (e) {
                              t.dialogAttendees = e;
                            },
                          },
                        },
                        [
                          o("dialog-attendees", {
                            attrs: {
                              eventBookings: t.eventBookings,
                              bookingCreatedCount: t.bookingCreatedCount,
                              options: t.options,
                              popperAppendToBody: !0,
                            },
                            on: {
                              closeDialog: t.closeDialogAttendees,
                              updateAttendeesCallback:
                                t.updateAttendeesCallback,
                              showDialogAttendee: t.showDialogAttendee,
                              openExportAttendeesDialog: function (e) {
                                t.dialogExport = !0;
                              },
                            },
                          }),
                        ],
                        1
                      )
                    : t._e(),
                ],
                1
              ),
              t._v(" "),
              o(
                "transition",
                { attrs: { name: "slide" } },
                [
                  t.dialogEventCustomFields && t.event && t.eventBooking
                    ? o(
                        "el-dialog",
                        {
                          staticClass: "am-side-dialog am-dialog-event",
                          attrs: {
                            "show-close": !1,
                            visible: t.dialogEventCustomFields,
                          },
                          on: {
                            "update:visible": function (e) {
                              t.dialogEventCustomFields = e;
                            },
                          },
                        },
                        [
                          o("dialog-attendee", {
                            attrs: {
                              eventBooking: t.eventBooking,
                              eventCustomerIds: t.eventCustomerIds,
                              eventBookMultipleTimes: t.eventBookMultipleTimes,
                              eventMaxCapacity: t.event.maxCapacity,
                              eventId: t.event.id,
                              options: t.options,
                              customerCreatedCount: t.customerCreatedCount,
                            },
                            on: {
                              closeDialog: t.closeDialogAttendee,
                              showDialogNewCustomer: t.showDialogNewCustomer,
                              saveCallback: t.saveAttendeeCallback,
                            },
                          }),
                        ],
                        1
                      )
                    : t._e(),
                ],
                1
              ),
              t._v(" "),
              o(
                "transition",
                { attrs: { name: "slide" } },
                [
                  t.dialogCustomer
                    ? o(
                        "el-dialog",
                        {
                          staticClass: "am-side-dialog",
                          attrs: {
                            visible: t.dialogCustomer,
                            "show-close": !1,
                          },
                          on: {
                            "update:visible": function (e) {
                              t.dialogCustomer = e;
                            },
                          },
                        },
                        [
                          o("dialog-customer", {
                            attrs: { customer: t.customer },
                            on: {
                              closeDialog: function (e) {
                                t.dialogCustomer = !1;
                              },
                              saveCallback: t.saveCustomerCallback,
                            },
                          }),
                        ],
                        1
                      )
                    : t._e(),
                ],
                1
              ),
              t._v(" "),
              t.event && t.event.id
                ? o(
                    "el-form",
                    { attrs: { action: t.exportAction, method: "POST" } },
                    [
                      o(
                        "transition",
                        { attrs: { name: "slide" } },
                        [
                          t.dialogExport
                            ? o(
                                "el-dialog",
                                {
                                  staticClass:
                                    "am-side-dialog am-dialog-export",
                                  attrs: {
                                    visible: t.dialogExport,
                                    "show-close": !1,
                                  },
                                  on: {
                                    "update:visible": function (e) {
                                      t.dialogExport = e;
                                    },
                                  },
                                },
                                [
                                  o("dialog-export", {
                                    attrs: {
                                      data: Object.assign(t.exportParams, {
                                        id: t.event.id,
                                      }),
                                      action:
                                        t.$root.getAjaxUrl +
                                        "/report/event/attendees",
                                    },
                                    on: {
                                      updateAction: function (t) {
                                        e.exportAction = t;
                                      },
                                      closeDialogExport: function (e) {
                                        t.dialogExport = !1;
                                      },
                                    },
                                  }),
                                ],
                                1
                              )
                            : t._e(),
                        ],
                        1
                      ),
                    ],
                    1
                  )
                : t._e(),
              t._v(" "),
              o(
                "transition",
                { attrs: { name: "slide" } },
                [
                  t.dialogTranslate
                    ? o(
                        "el-dialog",
                        {
                          staticClass:
                            "am-side-dialog am-dialog-translate am-edit",
                          attrs: {
                            "show-close": !0,
                            visible: t.dialogTranslate,
                          },
                          on: {
                            "update:visible": function (e) {
                              t.dialogTranslate = e;
                            },
                          },
                        },
                        [
                          o("dialog-translate", {
                            attrs: {
                              "passed-translations": t.event.translations,
                              name: t.event.name,
                              "used-languages":
                                t.options.entities.settings.general
                                  .usedLanguages,
                              "all-languages-data": t.languagesData,
                              type: t.dialogTranslateType,
                              tab: "event",
                            },
                            on: {
                              saveDialogTranslate: t.saveDialogTranslate,
                              closeDialogTranslate: function (e) {
                                t.dialogTranslate = !1;
                              },
                            },
                          }),
                        ],
                        1
                      )
                    : t._e(),
                ],
                1
              ),
              t._v(" "),
              o("el-col", { attrs: { md: 6 } }, [
                o(
                  "a",
                  {
                    staticClass: "am-help-button",
                    attrs: {
                      href: "https://wpamelia.com/events/",
                      target: "_blank",
                    },
                  },
                  [
                    o("i", { staticClass: "el-icon-question" }),
                    t._v(" " + t._s(t.$root.labels.need_help) + "?\n      "),
                  ]
                ),
              ]),
            ],
            1
          ),
        ]);
      },
      staticRenderFns: [],
    };
  },
  664: function (e, t, n) {
    var o = n(685)(n(1011), n(1012), !1, null, null, null);
    e.exports = o.exports;
  },
  685: function (e, t) {
    e.exports = function (e, t, n, o, i, a) {
      var s,
        r = (e = e || {}),
        l = typeof e.default;
      ("object" !== l && "function" !== l) || ((s = e), (r = e.default));
      var c,
        u = "function" == typeof r ? r.options : r;
      if (
        (t &&
          ((u.render = t.render),
          (u.staticRenderFns = t.staticRenderFns),
          (u._compiled = !0)),
        n && (u.functional = !0),
        i && (u._scopeId = i),
        a
          ? ((c = function (e) {
              (e =
                e ||
                (this.$vnode && this.$vnode.ssrContext) ||
                (this.parent &&
                  this.parent.$vnode &&
                  this.parent.$vnode.ssrContext)) ||
                "undefined" == typeof __VUE_SSR_CONTEXT__ ||
                (e = __VUE_SSR_CONTEXT__),
                o && o.call(this, e),
                e && e._registeredComponents && e._registeredComponents.add(a);
            }),
            (u._ssrRegister = c))
          : o && (c = o),
        c)
      ) {
        var d = u.functional,
          m = d ? u.render : u.beforeCreate;
        d
          ? ((u._injectStyles = c),
            (u.render = function (e, t) {
              return c.call(t), m(e, t);
            }))
          : (u.beforeCreate = m ? [].concat(m, c) : [c]);
      }
      return { esModule: s, exports: r, options: u };
    };
  },
  686: function (e, t, n) {
    "use strict";
    var o =
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
          var n = this;
          Object.keys(e).forEach(function (i) {
            null !== e[i] && "object" === o(e[i]) && i in t
              ? n.replaceExistingObjectProperties(e[i], t[i])
              : i in t && (e[i] = t[i]);
          });
        },
        addMissingObjectProperties: function (e, t) {
          var n = this;
          Object.keys(t).forEach(function (i) {
            var a = !1;
            i in e ||
              ("object" === o(t[i])
                ? ((e[i] = {}), (a = !0))
                : ((e[i] = null), (a = !0))),
              null === t[i] || "object" !== o(t[i])
                ? a && (e[i] = t[i])
                : n.addMissingObjectProperties(e[i], t[i]);
          });
        },
        scrollView: function (e, t, n) {
          "undefined" != typeof jQuery &&
            ((void 0 !== n && n) || jQuery(window).width() <= 600) &&
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
            var n = [],
              o = {};
            return (
              t.split("&").forEach(function (e) {
                (n = e.split("=")),
                  (o[n[0]] = decodeURIComponent(n[1]).replace(/\+/g, " "));
              }),
              o
            );
          }
        },
        getUrlParams: function (e) {
          var t = {};
          if (-1 !== e.indexOf("?")) {
            var n = [];
            e.split("?")[1]
              .split("&")
              .forEach(function (e) {
                (n = e.split("=")),
                  (t[n[0]] = decodeURIComponent(n[1]).replace(/\+/g, " "));
              });
          }
          return t;
        },
        removeURLParameter: function (e, t) {
          var n = e.split("?");
          if (n.length >= 2) {
            for (
              var o = encodeURIComponent(t) + "=",
                i = n[1].split(/[&;]/g),
                a = i.length;
              a-- > 0;

            )
              -1 !== i[a].lastIndexOf(o, 0) && i.splice(a, 1);
            return (e = n[0] + (i.length > 0 ? "?" + i.join("&") : ""));
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
  687: function (e, t, n) {
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
          var e = n(693);
          e.init({ svgSelector: "img.svg", initClass: "js-inlinesvg" });
        },
        inlineSVGCabinet: function () {
          setTimeout(function () {
            n(693).init({
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
            n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
            o = this.getNameInitials(e),
            i = Math.floor(Math.random() * this.colors.length),
            a = this.colors[i];
          return (
            this.usedColors.push(this.colors[i]),
            this.colors.splice(i, 1),
            0 === this.colors.length &&
              ((this.colors = this.usedColors), (this.usedColors = [])),
            n
              ? t.firstName
                ? this.$root.getUrl + "public/img/default-employee.svg"
                : t.latitude
                ? this.$root.getUrl + "public/img/default-location.svg"
                : this.$root.getUrl + "public/img/default-service.svg"
              : location.protocol +
                "//via.placeholder.com/120/" +
                a +
                "/fff?text=" +
                o
          );
        },
        pictureLoad: function (e, t) {
          if (null !== e) {
            var n = !0 === t ? e.firstName + " " + e.lastName : e.name;
            if (void 0 !== n)
              return (
                (e.pictureThumbPath =
                  e.pictureThumbPath || this.imageFromText(n)),
                e.pictureThumbPath
              );
          }
        },
        imageLoadError: function (e, t) {
          var n = !0 === t ? e.firstName + " " + e.lastName : e.name;
          void 0 !== n && (e.pictureThumbPath = this.imageFromText(n, e, !0));
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
  688: function (e, t, n) {
    "use strict";
    var o = n(706),
      i = n(343),
      a = Object.prototype.toString;
    function s(e) {
      return "[object Array]" === a.call(e);
    }
    function r(e) {
      return null !== e && "object" == typeof e;
    }
    function l(e) {
      return "[object Function]" === a.call(e);
    }
    function c(e, t) {
      if (null !== e && void 0 !== e)
        if (("object" == typeof e || s(e) || (e = [e]), s(e)))
          for (var n = 0, o = e.length; n < o; n++) t.call(null, e[n], n, e);
        else
          for (var i in e)
            Object.prototype.hasOwnProperty.call(e, i) &&
              t.call(null, e[i], i, e);
    }
    e.exports = {
      isArray: s,
      isArrayBuffer: function (e) {
        return "[object ArrayBuffer]" === a.call(e);
      },
      isBuffer: i,
      isFormData: function (e) {
        return "undefined" != typeof FormData && e instanceof FormData;
      },
      isArrayBufferView: function (e) {
        return "undefined" != typeof ArrayBuffer && ArrayBuffer.isView
          ? ArrayBuffer.isView(e)
          : e && e.buffer && e.buffer instanceof ArrayBuffer;
      },
      isString: function (e) {
        return "string" == typeof e;
      },
      isNumber: function (e) {
        return "number" == typeof e;
      },
      isObject: r,
      isUndefined: function (e) {
        return void 0 === e;
      },
      isDate: function (e) {
        return "[object Date]" === a.call(e);
      },
      isFile: function (e) {
        return "[object File]" === a.call(e);
      },
      isBlob: function (e) {
        return "[object Blob]" === a.call(e);
      },
      isFunction: l,
      isStream: function (e) {
        return r(e) && l(e.pipe);
      },
      isURLSearchParams: function (e) {
        return (
          "undefined" != typeof URLSearchParams && e instanceof URLSearchParams
        );
      },
      isStandardBrowserEnv: function () {
        return (
          ("undefined" == typeof navigator ||
            "ReactNative" !== navigator.product) &&
          "undefined" != typeof window &&
          "undefined" != typeof document
        );
      },
      forEach: c,
      merge: function e() {
        var t = {};
        function n(n, o) {
          "object" == typeof t[o] && "object" == typeof n
            ? (t[o] = e(t[o], n))
            : (t[o] = n);
        }
        for (var o = 0, i = arguments.length; o < i; o++) c(arguments[o], n);
        return t;
      },
      extend: function (e, t, n) {
        return (
          c(t, function (t, i) {
            e[i] = n && "function" == typeof t ? o(t, n) : t;
          }),
          e
        );
      },
      trim: function (e) {
        return e.replace(/^\s*/, "").replace(/\s*$/, "");
      },
    };
  },
  689: function (e, t, n) {
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
            n = this.getPriceNumberOfDecimalPlaces(),
            o = this.getPriceThousandSeparator(),
            i = this.getPriceDecimalSeparator(),
            a = this.getPricePrefix(),
            s = this.getPriceSuffix(),
            r = parseInt((e = Math.abs(+e || 0).toFixed(n))) + "",
            l = r.length > 3 ? r.length % 3 : 0;
          return (
            (t ? a : "") +
            (l ? r.substr(0, l) + o : "") +
            r.substr(l).replace(/(\d{3})(?=\d)/g, "$1" + o) +
            (n
              ? i +
                Math.abs(e - r)
                  .toFixed(n)
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
  690: function (e, t, n) {
    "use strict";
    var o = n(711);
    t.a = {
      mixins: [o.a],
      data: function () {
        return {};
      },
      methods: {
        getLocationById: function (e) {
          return (
            this.options.entities.locations.find(function (t) {
              return t.id === e;
            }) || null
          );
        },
        getCustomerById: function (e) {
          return (
            this.options.entities.customers.find(function (t) {
              return t.id === e;
            }) || null
          );
        },
        getProviderById: function (e) {
          return (
            this.options.entities.employees.find(function (t) {
              return t.id === e;
            }) || null
          );
        },
        getServiceById: function (e) {
          return (
            this.options.entities.services.find(function (t) {
              return t.id === e;
            }) || null
          );
        },
        getPackageById: function (e) {
          return (
            this.options.entities.packages.find(function (t) {
              return t.id === e;
            }) || null
          );
        },
        getProviderService: function (e, t) {
          var n = this.getProviderById(e).serviceList.find(function (e) {
            return e.id === parseInt(t);
          });
          return n ? Object.assign(this.getServiceById(t), n) : null;
        },
        getServiceProviders: function (e, t) {
          var n = this;
          return void 0 !== t && t
            ? this.options.entities.employees.filter(function (t) {
                return (
                  -1 !==
                  t.serviceList
                    .map(function (e) {
                      return e.id;
                    })
                    .indexOf(e)
                );
              })
            : this.options.entities.employees.filter(function (t) {
                return (
                  -1 !==
                  t.serviceList
                    .filter(function (e) {
                      return n.isEmployeeService(t.id, e.id);
                    })
                    .map(function (e) {
                      return e.id;
                    })
                    .indexOf(e)
                );
              });
        },
        getServiceLocations: function (e, t) {
          var n = this,
            o = [];
          return (
            this.options.entities.employees
              .filter(function (t) {
                return (
                  -1 !==
                  t.serviceList
                    .map(function (e) {
                      return e.id;
                    })
                    .indexOf(e)
                );
              })
              .forEach(function (e) {
                o = n
                  .getProviderLocations(e.id, t)
                  .map(function (e) {
                    return e.id;
                  })
                  .concat(o);
              }),
            this.options.entities.locations.filter(function (e) {
              return -1 !== o.indexOf(e.id);
            })
          );
        },
        getProviderLocations: function (e, t) {
          var n = this,
            o = [this.getProviderById(e).locationId];
          if (e in this.options.entitiesRelations)
            for (var i in this.options.entitiesRelations[e])
              this.options.entitiesRelations[e].hasOwnProperty(i) &&
                (o = o.concat(this.options.entitiesRelations[e][i]));
          return (
            (o = o.filter(function (e, t, n) {
              return n.indexOf(e) === t;
            })),
            (void 0 !== t && t
              ? this.options.entities.locations
              : this.options.entities.locations.filter(function (t) {
                  return n.isEmployeeLocation(e, t.id);
                })
            ).filter(function (e) {
              return -1 !== o.indexOf(e.id);
            })
          );
        },
        getLocationProviders: function (e, t) {
          var n = this,
            o = [];
          return (
            this.options.entities.employees.forEach(function (i) {
              -1 !==
                (void 0 !== t && t
                  ? n.getProviderLocations(i.id).filter(function (e) {
                      return n.isEmployeeLocation(i.id, e.id);
                    })
                  : n.getProviderLocations(i.id)
                )
                  .map(function (e) {
                    return e.id;
                  })
                  .indexOf(e) && o.push(i.id);
            }),
            (o = o.filter(function (e, t, n) {
              return n.indexOf(e) === t;
            })),
            this.options.entities.employees.filter(function (e) {
              return -1 !== o.indexOf(e.id);
            })
          );
        },
        getServicesFromCategories: function (e) {
          var t = [];
          return (
            e
              .map(function (e) {
                return e.serviceList;
              })
              .forEach(function (e) {
                t = t.concat(e);
              }),
            t.sort(this.sortWithNull)
          );
        },
        getCategoryServices: function (e) {
          return this.options.entities.categories.find(function (t) {
            return t.id === e;
          }).serviceList;
        },
        getCustomerInfo: function (e) {
          return "info" in e && e.info
            ? JSON.parse(e.info)
            : this.getCustomerById(e.customerId);
        },
        isEmployeeServiceLocation: function (e, t, n) {
          return (
            e in this.options.entitiesRelations &&
            t in this.options.entitiesRelations[e] &&
            -1 !== this.options.entitiesRelations[e][t].indexOf(n)
          );
        },
        isEmployeeService: function (e, t) {
          return (
            e in this.options.entitiesRelations &&
            t in this.options.entitiesRelations[e]
          );
        },
        isEmployeeLocation: function (e, t) {
          var n = !1;
          if (e in this.options.entitiesRelations)
            for (var o in this.options.entitiesRelations[e])
              this.options.entitiesRelations[e].hasOwnProperty(o) &&
                -1 !== this.options.entitiesRelations[e][o].indexOf(t) &&
                (n = !0);
          return n;
        },
        getAvailableEntitiesIds: function (e, t) {
          var n = this,
            o = [],
            i = [],
            a = [],
            s =
              null !== t.categoryId
                ? e.categories
                    .find(function (e) {
                      return e.id === t.categoryId;
                    })
                    .serviceList.map(function (e) {
                      return e.id;
                    })
                : [];
          if (
            (null !== t.categoryId && 0 === s.length) ||
            (null !== t.serviceId &&
              null !== t.employeeId &&
              !this.isEmployeeService(t.employeeId, t.serviceId)) ||
            (null !== t.serviceId &&
              null !== t.employeeId &&
              null !== t.locationId &&
              !this.isEmployeeServiceLocation(
                t.employeeId,
                t.serviceId,
                t.locationId
              ))
          )
            return {
              services: [],
              locations: [],
              employees: [],
              categories: [],
            };
          var r = function (e) {
            if (!n.options.entitiesRelations.hasOwnProperty(e))
              return "continue";
            var r = parseInt(e);
            if (
              (null !== t.employeeId && t.employeeId !== r) ||
              (null !== t.locationId &&
                !n.isEmployeeLocation(r, t.locationId)) ||
              (null !== t.serviceId && !n.isEmployeeService(r, t.serviceId)) ||
              (null !== t.categoryId &&
                0 ===
                  s.filter(function (e) {
                    return n.isEmployeeService(r, e);
                  }).length) ||
              (null !== t.categoryId &&
                null !== t.locationId &&
                0 ===
                  s.filter(function (e) {
                    return n.isEmployeeServiceLocation(r, e, t.locationId);
                  }).length) ||
              (null !== t.serviceId &&
                null !== t.locationId &&
                !n.isEmployeeServiceLocation(r, t.serviceId, t.locationId))
            )
              return "continue";
            for (var l in (-1 === i.indexOf(r) && i.push(r),
            n.options.entitiesRelations[r]))
              if (n.options.entitiesRelations[r].hasOwnProperty(l)) {
                var c = parseInt(l);
                (null !== t.serviceId && t.serviceId !== c) ||
                  (null !== t.categoryId && -1 === s.indexOf(c)) ||
                  (null !== t.locationId &&
                    !n.isEmployeeServiceLocation(r, c, t.locationId)) ||
                  (-1 === o.indexOf(c) && o.push(c),
                  n.options.entitiesRelations[r][c].length &&
                    n.options.entitiesRelations[r][c].forEach(function (e) {
                      (null !== t.locationId && t.locationId !== e) ||
                        (-1 === a.indexOf(e) && a.push(e));
                    }));
              }
          };
          for (var l in this.options.entitiesRelations) r(l);
          return {
            services: o,
            locations: a,
            employees: i,
            categories: e.categories
              .filter(function (e) {
                return (
                  e.serviceList
                    .map(function (e) {
                      return e.id;
                    })
                    .filter(function (e) {
                      return -1 !== o.indexOf(e);
                    }).length > 0
                );
              })
              .map(function (e) {
                return e.id;
              }),
          };
        },
        filterEntities: function (e, t) {
          var n = this,
            o = this.getAvailableEntitiesIds(e, t);
          if (
            ((this.options.entities.employees = e.employees.filter(function (
              e
            ) {
              return (
                -1 !== o.employees.indexOf(e.id) &&
                e.serviceList.filter(function (e) {
                  return -1 !== o.services.indexOf(e.id);
                }).length > 0
              );
            })),
            (this.options.entities.categories = e.categories),
            (this.options.entities.services = this.getServicesFromCategories(
              this.options.entities.categories
            ).filter(function (e) {
              return e.show && -1 !== o.services.indexOf(e.id);
            })),
            this.options.entities.services.forEach(function (e) {
              e.extras.forEach(function (e) {
                e.extraId = e.id;
              });
            }),
            (this.options.entities.locations = e.locations.filter(function (e) {
              return -1 !== o.locations.indexOf(e.id);
            })),
            (this.options.entities.customFields = e.customFields),
            "packages" in e && (!("show" in t) || "services" !== t.show))
          ) {
            var i = e.packages
                .filter(function (e) {
                  return "visible" === e.status;
                })
                .filter(function (e) {
                  return (
                    e.bookable.filter(function (e) {
                      return (
                        -1 !==
                        n.options.entities.services
                          .map(function (e) {
                            return e.id;
                          })
                          .indexOf(e.service.id)
                      );
                    }).length > 0
                  );
                }),
              a = this.options.entities.locations.map(function (e) {
                return e.id;
              }),
              s = this.options.entities.employees.map(function (e) {
                return e.id;
              }),
              r = [];
            if (
              (i.forEach(function (t) {
                var o = !1;
                t.bookable.forEach(function (i) {
                  ((0 === i.minimumScheduled && i.maximumScheduled > 0) ||
                    (i.minimumScheduled > 0 && 0 === i.maximumScheduled) ||
                    (i.minimumScheduled > 0 && i.maximumScheduled > 0)) &&
                    (o = !0);
                  var l = i.providers.length;
                  if (
                    !e.locations.length ||
                    n.options.entities.locations.length
                  ) {
                    var c = i.locations.length;
                    !l ||
                    ((i.providers = i.providers.filter(function (e) {
                      return -1 !== s.indexOf(e.id) && c
                        ? i.locations.filter(function (t) {
                            return n.isEmployeeServiceLocation(
                              e.id,
                              i.service.id,
                              t.id
                            );
                          }).length
                        : !n.options.entities.locations.length ||
                            n.options.entities.locations.filter(function (t) {
                              return n.isEmployeeServiceLocation(
                                e.id,
                                i.service.id,
                                t.id
                              );
                            }).length;
                    })),
                    i.providers.length)
                      ? c &&
                        ((i.locations = i.locations.filter(function (e) {
                          return (
                            -1 !== a.indexOf(e.id) &&
                            (l
                              ? i.providers.filter(function (t) {
                                  return n.isEmployeeServiceLocation(
                                    t.id,
                                    i.service.id,
                                    e.id
                                  );
                                }).length
                              : n.options.entities.employees.filter(function (
                                  t
                                ) {
                                  return n.isEmployeeServiceLocation(
                                    t.id,
                                    i.service.id,
                                    e.id
                                  );
                                }).length)
                          );
                        })),
                        i.locations.length || r.push(t.id))
                      : r.push(t.id);
                  } else r.push(t.id);
                }),
                  (t.hasSlots = o);
              }),
              (this.options.entities.packages = i.filter(function (e) {
                return -1 === r.indexOf(e.id);
              })),
              "show" in t && "packages" === t.show)
            ) {
              var l = [];
              this.options.entities.packages.forEach(function (e) {
                e.bookable.forEach(function (e) {
                  l.push(e.service.categoryId);
                });
              }),
                (this.options.entities.categories =
                  this.options.entities.categories.filter(function (e) {
                    return -1 !== l.indexOf(e.id);
                  }));
            }
          }
        },
        processEntities: function (e) {
          (this.options.entitiesRelations = e.entitiesRelations),
            this.options.isFrontEnd
              ? ("packages" in e &&
                  e.packages.length &&
                  ((this.responseEntities.employees = e.employees),
                  (this.responseEntities.categories = e.categories),
                  (this.responseEntities.locations = e.locations),
                  (this.responseEntities.customFields = e.customFields),
                  (this.responseEntities.services =
                    this.getServicesFromCategories(
                      this.responseEntities.categories
                    )),
                  (this.responseEntities.packages = e.packages
                    ? e.packages.filter(function (e) {
                        return e.available;
                      })
                    : []),
                  (e.packages = e.packages.filter(function (e) {
                    return e.available;
                  }))),
                this.filterEntities(e, this.getShortCodeEntityIds()))
              : ((this.options.entities.employees = e.employees),
                (this.options.entities.categories = e.categories),
                (this.options.entities.locations = e.locations),
                (this.options.entities.customers = e.customers),
                (this.options.entities.services =
                  this.getServicesFromCategories(
                    this.options.entities.categories
                  )),
                (this.options.entities.packages = e.packages),
                (this.options.entities.customFields = e.customFields),
                (this.options.entities.coupons = e.coupons),
                this.options.entities.services.forEach(function (e) {
                  e.extras.forEach(function (e) {
                    e.extraId = e.id;
                  });
                }),
                (this.options.availableEntitiesIds =
                  this.getAvailableEntitiesIds(e, {
                    categoryId: null,
                    serviceId: null,
                    employeeId: null,
                    locationId: null,
                  }))),
            "settings" in e && (this.options.entities.settings = e.settings),
            (this.options.entities.tags = "tags" in e ? e.tags : []);
        },
        getShortCodeEntityIds: function () {
          return this.$root.shortcodeData.booking
            ? {
                categoryId:
                  "category" in this.$root.shortcodeData.booking
                    ? this.$root.shortcodeData.booking.category
                    : null,
                serviceId:
                  "service" in this.$root.shortcodeData.booking
                    ? this.$root.shortcodeData.booking.service
                    : null,
                employeeId:
                  "employee" in this.$root.shortcodeData.booking
                    ? this.$root.shortcodeData.booking.employee
                    : null,
                locationId:
                  "location" in this.$root.shortcodeData.booking
                    ? this.$root.shortcodeData.booking.location
                    : null,
                show:
                  "show" in this.$root.shortcodeData.booking
                    ? this.$root.shortcodeData.booking.show
                    : null,
              }
            : {
                categoryId: null,
                serviceId: null,
                employeeId: null,
                locationId: null,
                show: null,
              };
        },
        entitiesLoaded: function () {
          return (
            "ameliaAppointmentEntities" in window || "ameliaEntities" in window
          );
        },
        fillCachedEntities: function (e) {
          var t = this.getServicesFromCategories(e.categories);
          e.employees.forEach(function (e) {
            e.serviceList.forEach(function (e) {
              Object.assign(
                e,
                t.find(function (t) {
                  return t.id === e.id;
                }),
                {
                  price: e.price,
                  minCapacity: e.minCapacity,
                  maxCapacity: e.maxCapacity,
                }
              );
            });
          }),
            "packages" in e &&
              e.packages.forEach(function (e) {
                e.bookable.forEach(function (e) {
                  e.service = t.find(function (t) {
                    return t.id === e.service.id;
                  });
                });
              });
        },
        fetchEntities: function (e, t) {
          var n = this,
            o = { params: { types: t.types } };
          if (
            (t.page
              ? (o.params.page = t.page)
              : "isFrontEnd" in t &&
                t.isFrontEnd &&
                (o.params.page = "booking"),
            void 0 !== this.$store &&
              void 0 !== this.$store.state.cabinet &&
              "provider" === this.$store.state.cabinet.cabinetType &&
              ((o = Object.assign(o, this.getAuthorizationHeaderObject())),
              Object.assign(o.params, {
                source: "cabinet-" + this.$store.state.cabinet.cabinetType,
              })),
            t.isPanel || (this.$root.hasApiCall && !this.entitiesLoaded()))
          )
            this.$http
              .get(this.$root.getAjaxUrl + "/entities", o)
              .then(function (o) {
                (n.options.isFrontEnd = t.isFrontEnd),
                  (window.ameliaAppointmentEntities = JSON.parse(
                    JSON.stringify(o.data.data)
                  )),
                  n.fillCachedEntities(window.ameliaAppointmentEntities),
                  n.processEntities(window.ameliaAppointmentEntities),
                  n.$root.useTranslations &&
                    n.translateEntities(window.ameliaAppointmentEntities);
                e(!0);
              })
              .catch(function (t) {
                console.log(t);
                e(!1);
              });
          else
            var i = setInterval(function () {
              if (n.entitiesLoaded()) {
                if (
                  (clearInterval(i),
                  (n.options.isFrontEnd = t.isFrontEnd),
                  "ameliaEntities" in window)
                ) {
                  var o = JSON.parse(JSON.stringify(window.ameliaEntities));
                  n.fillCachedEntities(o),
                    n.processEntities(o),
                    n.$root.useTranslations && n.translateEntities(o);
                } else {
                  var a = JSON.parse(
                    JSON.stringify(window.ameliaAppointmentEntities)
                  );
                  n.fillCachedEntities(a), n.processEntities(a);
                }
                e(!0);
              }
            }, 1e3);
        },
        getFilteredEntities: function (e, t, n) {
          var o = this,
            i =
              this.appointment && this.appointment.id && this.appointment[n]
                ? this.appointment[n]
                : null;
          return (
            this.options.entities[t].forEach(function (t) {
              t.disabled = -1 === e.indexOf(t.id);
            }),
            this.options.entities[t].filter(function (e) {
              return (
                -1 !== o.options.availableEntitiesIds[t].indexOf(e.id) ||
                (null !== i && i === e.id)
              );
            })
          );
        },
      },
      computed: {
        visibleLocations: function () {
          return this.options.entities.locations.filter(function (e) {
            return "visible" === e.status;
          });
        },
        visibleEmployees: function () {
          return this.options.entities.employees.filter(function (e) {
            return "visible" === e.status;
          });
        },
        visibleCustomers: function () {
          return this.options.entities.customers.filter(function (e) {
            return "visible" === e.status;
          });
        },
        visibleServices: function () {
          return this.options.entities.services
            .filter(function (e) {
              return "visible" === e.status;
            })
            .sort(this.sortWithNull);
        },
        employeesFiltered: function () {
          var e = this,
            t = this.visibleEmployees.filter(function (t) {
              return (
                t.serviceList.filter(function (n) {
                  return (
                    "visible" === n.status &&
                    (!e.appointment.serviceId ||
                      (e.isEmployeeService(t.id, n.id) &&
                        n.id === e.appointment.serviceId)) &&
                    (!e.appointment.locationId ||
                      e.isEmployeeServiceLocation(
                        t.id,
                        n.id,
                        e.appointment.locationId
                      )) &&
                    (!e.appointment.categoryId ||
                      t.serviceList.filter(function (t) {
                        return (
                          "visible" === t.status &&
                          t.categoryId === e.appointment.categoryId
                        );
                      }).length > 0)
                  );
                }).length > 0
              );
            });
          return this.options.isFrontEnd
            ? t
            : this.getFilteredEntities(
                t.map(function (e) {
                  return e.id;
                }),
                "employees",
                "providerId"
              );
        },
        servicesFiltered: function () {
          var e = this,
            t = [];
          if (this.appointment.providerId) {
            var n = this.employeesFiltered.find(function (t) {
              return t.id === e.appointment.providerId;
            });
            t =
              void 0 !== n
                ? n.serviceList
                    .filter(function (e) {
                      return "visible" === e.status;
                    })
                    .map(function (e) {
                      return e.id;
                    })
                : [];
          }
          var o = this.visibleServices.filter(function (n) {
            return !(
              (e.appointment.providerId && -1 === t.indexOf(n.id)) ||
              (e.appointment.locationId &&
                !(
                  e.employeesFiltered.filter(function (t) {
                    return e.isEmployeeServiceLocation(
                      t.id,
                      n.id,
                      e.appointment.locationId
                    );
                  }).length > 0
                )) ||
              (e.appointment.categoryId &&
                n.categoryId !== e.appointment.categoryId)
            );
          });
          return this.options.isFrontEnd
            ? o
            : this.getFilteredEntities(
                o.map(function (e) {
                  return e.id;
                }),
                "services",
                "serviceId"
              );
        },
        sortWithNull: function () {
          return function (e, t) {
            return e.position === t.position
              ? 0
              : null === e.position
              ? 1
              : null === t.position
              ? -1
              : e.position < t.position
              ? -1
              : 1;
          };
        },
        locationsFiltered: function () {
          var e = this,
            t = [];
          if (this.appointment.providerId) {
            var n = this.employeesFiltered.find(function (t) {
              return t.id === e.appointment.providerId;
            });
            t =
              void 0 !== n
                ? n.serviceList.filter(function (e) {
                    return "visible" === e.status;
                  })
                : [];
          }
          var o = null;
          this.appointment.categoryId &&
            (o = this.categoriesFiltered.find(function (t) {
              return t.id === e.appointment.categoryId;
            }));
          var i = this.visibleLocations.filter(function (n) {
            return (
              (!e.appointment.providerId ||
                t.filter(function (t) {
                  return e.isEmployeeServiceLocation(
                    e.appointment.providerId,
                    t.id,
                    n.id
                  );
                }).length > 0) &&
              (!e.appointment.serviceId ||
                e.employeesFiltered.filter(function (t) {
                  return e.isEmployeeServiceLocation(
                    t.id,
                    e.appointment.serviceId,
                    n.id
                  );
                }).length > 0) &&
              (!e.appointment.categoryId ||
                (void 0 !== o &&
                  e.employeesFiltered.filter(function (t) {
                    return (
                      t.serviceList.filter(function (i) {
                        return (
                          "visible" === i.status &&
                          i.categoryId === o.id &&
                          e.isEmployeeServiceLocation(t.id, i.id, n.id)
                        );
                      }).length > 0
                    );
                  }).length > 0))
            );
          });
          return this.options.isFrontEnd
            ? i
            : this.getFilteredEntities(
                i.map(function (e) {
                  return e.id;
                }),
                "locations",
                "locationId"
              );
        },
        couponsFilteredService: function () {
          var e = this,
            t = [];
          return this.options.entities.coupons &&
            ((t = this.options.entities.coupons.filter(function (e) {
              return e.serviceList.length > 0;
            })),
            this.appointment.serviceId)
            ? t.filter(function (t) {
                return t.serviceList.find(function (t) {
                  return t.id === e.appointment.serviceId;
                });
              })
            : t;
        },
        couponsFilteredEvent: function () {
          var e = this,
            t = [];
          return this.options.entities.coupons &&
            ((t = this.options.entities.coupons.filter(function (e) {
              return e.eventList.length > 0;
            })),
            this.eventId)
            ? t.filter(function (t) {
                return t.eventList.find(function (t) {
                  return t.id === e.eventId;
                });
              })
            : t;
        },
        categoriesFiltered: function () {
          var e = this,
            t = null;
          this.appointment.providerId &&
            (t = this.employeesFiltered.find(function (t) {
              return t.id === e.appointment.providerId;
            }));
          var n = null;
          this.appointment.serviceId &&
            (n = this.servicesFiltered.find(function (t) {
              return t.id === e.appointment.serviceId;
            }));
          var o = this.options.entities.categories.filter(function (o) {
            return (
              (!e.appointment.serviceId ||
                (void 0 !== n && n.categoryId === o.id)) &&
              (!e.appointment.locationId ||
                o.serviceList.filter(function (t) {
                  return (
                    "visible" === t.status &&
                    e.employeesFiltered.filter(function (n) {
                      return e.isEmployeeServiceLocation(
                        n.id,
                        t.id,
                        e.appointment.locationId
                      );
                    }).length > 0
                  );
                }).length > 0) &&
              (!e.appointment.providerId ||
                (void 0 !== t &&
                  -1 !==
                    t.serviceList
                      .filter(function (t) {
                        return (
                          "visible" === t.status &&
                          e.isEmployeeService(e.appointment.providerId, t.id)
                        );
                      })
                      .map(function (e) {
                        return e.categoryId;
                      })
                      .indexOf(o.id)))
            );
          });
          return this.options.isFrontEnd
            ? o
            : this.getFilteredEntities(
                o.map(function (e) {
                  return e.id;
                }),
                "categories",
                "categoryId"
              );
        },
      },
    };
  },
  691: function (e, t, n) {
    "use strict";
    t.a = {
      methods: {
        notify: function (e, t, n, o) {
          var i = this;
          void 0 === o && (o = ""),
            setTimeout(function () {
              i.$notify({
                customClass: o,
                title: e,
                message: t,
                type: n,
                offset: 50,
              });
            }, 700);
        },
      },
    };
  },
  692: function (e, t, n) {
    "use strict";
    var o = n(0),
      i = n.n(o);
    t.a = {
      data: function () {
        return {
          timeSelectOptions: {
            start: "00:00",
            end: "23:59",
            step: this.secondsToTimeSelectStep(this.getTimeSlotLength()),
          },
        };
      },
      methods: {
        convertDateTimeRangeDifferenceToMomentDuration: function (e, t) {
          return i.a.duration(i()(t).diff(i()(e)));
        },
        convertSecondsToMomentDuration: function (e) {
          return i.a.duration(e, "seconds");
        },
        momentDurationToNiceDurationWithUnit: function (e) {
          var t = Math.floor(e.asMinutes() / 60),
            n = e.asMinutes() % 60;
          return (
            (t ? t + this.$root.labels.h + " " : "") +
            " " +
            (n ? n + this.$root.labels.min : "")
          );
        },
        secondsToNiceDuration: function (e) {
          var t = Math.floor(e / 3600),
            n = (e / 60) % 60;
          return (
            (t ? t + this.$root.labels.h + " " : "") +
            " " +
            (n ? n + this.$root.labels.min : "")
          );
        },
        secondsToTimeSelectStep: function (e) {
          var t = Math.floor(e / 3600),
            n = Math.floor(e / 60) - 60 * t;
          return e < 0
            ? (t || "00") + ":" + ((n < 9 ? "0" + n : n) || "00")
            : ((t <= 9 ? "0" + t : t) || "00") +
                ":" +
                ((n <= 9 ? "0" + n : n) || "00");
        },
        getTimeSlotLength: function () {
          return this.$root.settings.general.timeSlotLength;
        },
        getPossibleDurationsInSeconds: function (e) {
          for (
            var t =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : 84600,
              n = [],
              o = this.getTimeSlotLength();
            o <= t;
            o += this.getTimeSlotLength()
          )
            n.push(o);
          return (
            e &&
              -1 === n.indexOf(e) &&
              (n.push(e),
              n.sort(function (e, t) {
                return e - t;
              })),
            n
          );
        },
        getTimeSelectOptionsWithLimits: function (e, t) {
          return {
            start: "00:00",
            end: "24:00",
            step: this.secondsToTimeSelectStep(this.getTimeSlotLength()),
            minTime: e,
            maxTime: t,
          };
        },
        getStringTimeInSeconds: function (e) {
          return i()(e, "HH:mm").diff(i()().startOf("day"), "seconds");
        },
      },
    };
  },
  693: function (e, t, n) {
    (function (n) {
      var o, i, a, s;
      (s = void 0 !== n ? n : this.window || this.global),
        (i = []),
        (o = (function (e) {
          var t,
            n = {},
            o = !!document.querySelector && !!e.addEventListener,
            i = { initClass: "js-inlinesvg", svgSelector: "img.svg" },
            a = function () {
              var e = {},
                t = !1,
                n = 0,
                o = arguments.length;
              "[object Boolean]" ===
                Object.prototype.toString.call(arguments[0]) &&
                ((t = arguments[0]), n++);
              for (
                var i = function (n) {
                  for (var o in n)
                    Object.prototype.hasOwnProperty.call(n, o) &&
                      (t &&
                      "[object Object]" === Object.prototype.toString.call(n[o])
                        ? (e[o] = a(!0, e[o], n[o]))
                        : (e[o] = n[o]));
                };
                o > n;
                n++
              ) {
                i(arguments[n]);
              }
              return e;
            },
            s = function (e) {
              var n = document.querySelectorAll(t.svgSelector),
                o = (function (e, t) {
                  return function () {
                    return --e < 1 ? t.apply(this, arguments) : void 0;
                  };
                })(n.length, e);
              Array.prototype.forEach.call(n, function (e, n) {
                var i = e.src || e.getAttribute("data-src"),
                  a = e.attributes,
                  s = new XMLHttpRequest();
                s.open("GET", i, !0),
                  (s.onload = function () {
                    if (s.status >= 200 && s.status < 400) {
                      var n = new DOMParser()
                        .parseFromString(s.responseText, "text/xml")
                        .getElementsByTagName("svg")[0];
                      if (
                        (n.removeAttribute("xmlns:a"),
                        n.removeAttribute("width"),
                        n.removeAttribute("height"),
                        n.removeAttribute("x"),
                        n.removeAttribute("y"),
                        n.removeAttribute("enable-background"),
                        n.removeAttribute("xmlns:xlink"),
                        n.removeAttribute("xml:space"),
                        n.removeAttribute("version"),
                        Array.prototype.slice.call(a).forEach(function (e) {
                          "src" !== e.name &&
                            "alt" !== e.name &&
                            n.setAttribute(e.name, e.value);
                        }),
                        n.classList
                          ? n.classList.add("inlined-svg")
                          : (n.className += " inlined-svg"),
                        n.setAttribute("role", "img"),
                        a.longdesc)
                      ) {
                        var i = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "desc"
                          ),
                          r = document.createTextNode(a.longdesc.value);
                        i.appendChild(r), n.insertBefore(i, n.firstChild);
                      }
                      if (a.alt) {
                        n.setAttribute("aria-labelledby", "title");
                        var l = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "title"
                          ),
                          c = document.createTextNode(a.alt.value);
                        l.appendChild(c), n.insertBefore(l, n.firstChild);
                      }
                      e.parentNode.replaceChild(n, e), o(t.svgSelector);
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
            (n.init = function (e, n) {
              o &&
                ((t = a(i, e || {})),
                s(n || function () {}),
                (document.documentElement.className += " " + t.initClass));
            }),
            n
          );
        })(s)),
        void 0 === (a = "function" == typeof o ? o.apply(t, i) : o) ||
          (e.exports = a);
    }.call(t, n(39)));
  },
  694: function (e, t, n) {
    "use strict";
    t.a = {
      data: function () {
        return {};
      },
      methods: {
        isCustomFieldVisible: function (e, t, n) {
          switch (t) {
            case "appointment":
              return (
                -1 !==
                e.services
                  .map(function (e) {
                    return e.id;
                  })
                  .indexOf(n)
              );
            case "event":
              return (
                -1 !==
                e.events
                  .map(function (e) {
                    return e.id;
                  })
                  .indexOf(n)
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
                  var n = "";
                  "checkbox" === this.options.entities.customFields[t].type &&
                    (n = []),
                    "datepicker" ===
                      this.options.entities.customFields[t].type && (n = null),
                    this.$set(
                      this.appointment.bookings[e].customFields,
                      this.options.entities.customFields[t].id,
                      {
                        label: this.options.entities.customFields[t].label,
                        value: n,
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
        getCustomFieldFileURL: function (e, t, n) {
          return (
            this.$root.getAjaxUrl +
            "/fields/" +
            e +
            "/" +
            t +
            "/" +
            n +
            "&source=cabinet-provider"
          );
        },
      },
    };
  },
  695: function (e, t, n) {
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
  696: function (e, t, n) {
    var o = n(685)(n(703), n(704), !1, null, null, null);
    e.exports = o.exports;
  },
  697: function (e, t, n) {
    "use strict";
    (function (t) {
      var o = n(688),
        i = n(724),
        a = { "Content-Type": "application/x-www-form-urlencoded" };
      function s(e, t) {
        !o.isUndefined(e) &&
          o.isUndefined(e["Content-Type"]) &&
          (e["Content-Type"] = t);
      }
      var r,
        l = {
          adapter:
            ("undefined" != typeof XMLHttpRequest
              ? (r = n(707))
              : void 0 !== t && (r = n(707)),
            r),
          transformRequest: [
            function (e, t) {
              return (
                i(t, "Content-Type"),
                o.isFormData(e) ||
                o.isArrayBuffer(e) ||
                o.isBuffer(e) ||
                o.isStream(e) ||
                o.isFile(e) ||
                o.isBlob(e)
                  ? e
                  : o.isArrayBufferView(e)
                  ? e.buffer
                  : o.isURLSearchParams(e)
                  ? (s(t, "application/x-www-form-urlencoded;charset=utf-8"),
                    e.toString())
                  : o.isObject(e)
                  ? (s(t, "application/json;charset=utf-8"), JSON.stringify(e))
                  : e
              );
            },
          ],
          transformResponse: [
            function (e) {
              if ("string" == typeof e)
                try {
                  e = JSON.parse(e);
                } catch (e) {}
              return e;
            },
          ],
          timeout: 0,
          xsrfCookieName: "XSRF-TOKEN",
          xsrfHeaderName: "X-XSRF-TOKEN",
          maxContentLength: -1,
          validateStatus: function (e) {
            return e >= 200 && e < 300;
          },
        };
      (l.headers = { common: { Accept: "application/json, text/plain, */*" } }),
        o.forEach(["delete", "get", "head"], function (e) {
          l.headers[e] = {};
        }),
        o.forEach(["post", "put", "patch"], function (e) {
          l.headers[e] = o.merge(a);
        }),
        (e.exports = l);
    }.call(t, n(142)));
  },
  700: function (e, t, n) {
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
  701: function (e, t, n) {
    "use strict";
    t.a = {
      data: function () {
        return {
          timeZone: "",
          statusesCabinet: [
            { value: "approved", label: this.$root.labels.approved },
            { value: "pending", label: this.$root.labels.pending },
            { value: "canceled", label: this.$root.labels.canceled },
            { value: "rejected", label: this.$root.labels.rejected },
          ],
        };
      },
      methods: {
        isPanelActive: function (e) {
          return (
            !this.$root.shortcodeData.cabinet ||
            (!this.$root.shortcodeData.cabinet.appointments &&
              !this.$root.shortcodeData.cabinet.events) ||
            !(
              "appointments" !== e ||
              !this.$root.shortcodeData.cabinet ||
              !this.$root.shortcodeData.cabinet.appointments
            ) ||
            ("events" === e &&
              this.$root.shortcodeData.cabinet &&
              this.$root.shortcodeData.cabinet.events)
          );
        },
        changeRange: function (e) {
          this.$store.commit("cabinet/setParams", { dates: e }),
            this.setDatePickerSelectedDaysCount(
              this.$store.state.cabinet.params.dates.start,
              this.$store.state.cabinet.params.dates.end
            ),
            this.$emit("refreshReservations");
        },
        isBookingCancelable: function (e) {
          var t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
          return (
            e.cancelable &&
            !(
              "canceled" === e.bookings[t].status ||
              "rejected" === e.bookings[t].status
            )
          );
        },
        isBookingReschedulable: function (e) {
          var t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
          return (
            e.reschedulable &&
            !(
              "canceled" === e.bookings[t].status ||
              "rejected" === e.bookings[t].status
            )
          );
        },
        disableAuthorizationHeader: function () {
          return (
            "ameliaBooking" in window &&
            "cabinet" in window.ameliaBooking &&
            "disableAuthorizationHeader" in window.ameliaBooking.cabinet &&
            window.ameliaBooking.cabinet.disableAuthorizationHeader
          );
        },
        getAuthorizationHeaderObject: function () {
          return this.$store.state.cabinet.ameliaToken &&
            !this.disableAuthorizationHeader()
            ? {
                headers: {
                  Authorization:
                    "Bearer " + this.$store.state.cabinet.ameliaToken,
                },
              }
            : {};
        },
      },
    };
  },
  702: function (e, t, n) {
    "use strict";
    var o = (function () {
        function e(e, t) {
          for (var n = 0; n < t.length; n++) {
            var o = t[n];
            (o.enumerable = o.enumerable || !1),
              (o.configurable = !0),
              "value" in o && (o.writable = !0),
              Object.defineProperty(e, o.key, o);
          }
        }
        return function (t, n, o) {
          return n && e(t.prototype, n), o && e(t, o), t;
        };
      })(),
      i = r(n(721)),
      a = r(n(739)),
      s = r(n(740));
    function r(e) {
      return e && e.__esModule ? e : { default: e };
    }
    var l = (function () {
      function e() {
        var t = this;
        !(function (e, t) {
          if (!(e instanceof t))
            throw new TypeError("Cannot call a class as a function");
        })(this, e),
          (this.progress = 0),
          (this.isPending = !1),
          (this.errors = new a.default()),
          ["post", "patch", "put", "delete"].forEach(function (e) {
            t[e] = function (n, o) {
              return t.submit(e, n, o);
            };
          });
      }
      return (
        o(e, [
          {
            key: "submit",
            value: function (t, n) {
              var o = this,
                i =
                  arguments.length > 2 && void 0 !== arguments[2]
                    ? arguments[2]
                    : {};
              return (
                (t = t.toLowerCase()),
                this.hasFiles(i) &&
                  ((i = (0, s.default)(i)),
                  "post" !== t &&
                    (i.append("_method", t.toUpperCase()), (t = "post"))),
                (this.progress = 0),
                this.errors.clear(),
                (this.isPending = !0),
                new Promise(function (a, s) {
                  e.defaults.axios[t](n, i, o.config())
                    .then(function (e) {
                      a(e.data);
                    })
                    .catch(function (e) {
                      o.handleError(e), s(e);
                    })
                    .then(function () {
                      return (o.isPending = !1);
                    });
                })
              );
            },
          },
          {
            key: "hasFiles",
            value: function (e) {
              for (var t in e) if (this.fileIsPresent(e[t])) return !0;
              return !1;
            },
          },
          {
            key: "fileIsPresent",
            value: function (e) {
              return (
                e instanceof File ||
                (e instanceof Array &&
                  e.some(function (e) {
                    return e instanceof File;
                  }))
              );
            },
          },
          {
            key: "save",
            value: function (e, t) {
              var n = "post";
              return (
                t.hasOwnProperty("id") &&
                  ((n = "patch"), (e = this.urlToPatchResource(e, t))),
                this[n](e, t)
              );
            },
          },
          {
            key: "urlToPatchResource",
            value: function (e, t) {
              return e.replace(/\/+$/, "") + "/" + t.id;
            },
          },
          {
            key: "config",
            value: function () {
              var e = this;
              return {
                onUploadProgress: function (t) {
                  e.progress = Math.round((100 * t.loaded) / t.total);
                },
              };
            },
          },
          {
            key: "handleError",
            value: function (e) {
              if (e.response && 422 === e.response.status) {
                var t = e.response.data.hasOwnProperty("errors")
                  ? e.response.data.errors
                  : e.response.data;
                this.errors.set(t);
              }
            },
          },
        ]),
        e
      );
    })();
    (l.defaults = { axios: i.default }), (e.exports = l);
  },
  703: function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var o = n(700);
    t.default = {
      mixins: [o.a],
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
          var n = this.input;
          if (
            ("ar" === window.localeLanguage[0] &&
              (n = n.replace(/[٠-٩]/g, function (e) {
                return "٠١٢٣٤٥٦٧٨٩".indexOf(e);
              })),
            "" !== n)
          ) {
            if (n.startsWith("+")) {
              var o = parseInt(n.slice(1)),
                i = this.countries.filter(function (e) {
                  return e.phonecode === o;
                });
              if (i.length) {
                var a = null;
                1 === o
                  ? (a = i.find(function (e) {
                      return 229 === e.id;
                    }))
                  : 44 === o
                  ? (a = i.find(function (e) {
                      return 228 === e.id;
                    }))
                  : 7 === o &&
                    (a = i.find(function (e) {
                      return 176 === e.id;
                    })),
                  (void 0 !== a && null !== a) || (a = i[0]),
                  (this.value = a.iso);
              }
              this.phone = n;
            } else
              this.phone =
                void 0 !== t
                  ? !0 === n.startsWith("0")
                    ? "+" + t.phonecode + n.slice(1).replace(/\D/g, "")
                    : "+" + t.phonecode + n.replace(/\D/g, "")
                  : n;
            this.$emit("phoneFormatted", this.phone, this.value);
          } else
            (this.phone = n),
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
          for (var n = 1; null === t && n < 5; )
            (t =
              void 0 !==
              (t = this.countries.find(function (t) {
                return (
                  t.phonecode === parseInt(e.savedPhone.substr(1, n)) &&
                  1 === t.priority
                );
              }))
                ? t
                : null),
              n++;
          if (!t)
            for (n = 1; null === t && n < 5; )
              (t =
                void 0 !==
                (t = this.countries.find(function (t) {
                  return t.phonecode === parseInt(e.savedPhone.substr(1, n));
                }))
                  ? t
                  : null),
                n++;
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
          n = e._self._c || t;
        return n(
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
            n(
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
                return n(
                  "el-option",
                  { key: t.id, attrs: { value: t.iso, label: " " } },
                  [
                    n("span", { class: "am-flag am-flag-" + t.iso }),
                    e._v(" "),
                    n("span", { staticClass: "am-phone-input-nicename" }, [
                      e._v(e._s(t.nicename)),
                    ]),
                    e._v(" "),
                    n("span", { staticClass: "am-phone-input-phonecode" }, [
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
  705: function (e, t, n) {
    "use strict";
    var o = n(0),
      i = n.n(o);
    t.a = {
      data: function () {
        return { recurringDates: [] };
      },
      methods: {
        getRecurringAppointmentsData: function () {
          var e = this,
            t = [];
          return (
            this.recurringData.dates.forEach(function (n) {
              var o = e.getProviderService(
                n.providerId,
                e.appointment.serviceId
              );
              t.push({
                providerId: n.providerId,
                locationId: n.locationId,
                bookingStart: i()(n.date).format("YYYY-MM-DD") + " " + n.slot,
                price: o.price,
                depositData:
                  "disabled" !== o.depositPayment
                    ? {
                        deposit: o.deposit,
                        depositPayment: o.depositPayment,
                        depositPerPerson: o.depositPerPerson,
                      }
                    : null,
              });
            }),
            t.shift(),
            t
          );
        },
        toggleRecurringActive: function () {
          this.appointment.serviceId &&
          "disabled" !==
            this.getServiceById(this.appointment.serviceId).recurringCycle
            ? (this.isRecurringAvailable = !0)
            : ((this.isRecurringAvailable = !1), (this.activeRecurring = !1));
        },
        getDefaultRecurringSettings: function (e, t, n) {
          var o = this.getAvailableRecurringDates(n),
            a = "all" === t ? "daily" : t,
            s = "",
            r = i()(e, "YYYY-MM-DD"),
            l = r.format("D");
          switch (a) {
            case "daily":
              s = "day";
              break;
            case "weekly":
              s = "week";
              break;
            case "monthly":
              s = "month";
          }
          return {
            selectedMonthlyWeekDayString: r.format("dddd"),
            monthDateRule: Math.ceil(l / 7),
            cycle: a,
            maxDate: i()(e, "YYYY-MM-DD HH:mm").add(1, "days").toDate(),
            maxCount: 1,
            selectedWeekDayIndex: r.isoWeekday() - 1,
            calendarDates: o,
            cycleInterval: 1,
            weekDaysSelected: [],
            repeatIntervalLabels: this.getRepeatIntervalLabels(
              this.$root.labels["recurring_" + s],
              this.$root.labels["recurring_" + s + "s"],
              i()(o[o.length - 1]).diff(r, "days")
            ),
          };
        },
        getAvailableRecurringDates: function (e) {
          var t = [];
          return (
            Object.keys(e).forEach(function (e) {
              t.push(i()(e + " 00:00:00"));
            }),
            t
          );
        },
        getRepeatIntervalLabels: function (e, t, n) {
          for (var o = [], i = 0; i < n; i++)
            o.push({ label: 0 === i ? e : i + 1 + " " + t, value: i + 1 });
          return o;
        },
      },
    };
  },
  706: function (e, t, n) {
    "use strict";
    e.exports = function (e, t) {
      return function () {
        for (var n = new Array(arguments.length), o = 0; o < n.length; o++)
          n[o] = arguments[o];
        return e.apply(t, n);
      };
    };
  },
  707: function (e, t, n) {
    "use strict";
    var o = n(688),
      i = n(725),
      a = n(727),
      s = n(728),
      r = n(729),
      l = n(708),
      c =
        ("undefined" != typeof window &&
          window.btoa &&
          window.btoa.bind(window)) ||
        n(730);
    e.exports = function (e) {
      return new Promise(function (t, u) {
        var d = e.data,
          m = e.headers;
        o.isFormData(d) && delete m["Content-Type"];
        var p = new XMLHttpRequest(),
          h = "onreadystatechange",
          f = !1;
        if (
          ("undefined" == typeof window ||
            !window.XDomainRequest ||
            "withCredentials" in p ||
            r(e.url) ||
            ((p = new window.XDomainRequest()),
            (h = "onload"),
            (f = !0),
            (p.onprogress = function () {}),
            (p.ontimeout = function () {})),
          e.auth)
        ) {
          var g = e.auth.username || "",
            v = e.auth.password || "";
          m.Authorization = "Basic " + c(g + ":" + v);
        }
        if (
          (p.open(
            e.method.toUpperCase(),
            a(e.url, e.params, e.paramsSerializer),
            !0
          ),
          (p.timeout = e.timeout),
          (p[h] = function () {
            if (
              p &&
              (4 === p.readyState || f) &&
              (0 !== p.status ||
                (p.responseURL && 0 === p.responseURL.indexOf("file:")))
            ) {
              var n =
                  "getAllResponseHeaders" in p
                    ? s(p.getAllResponseHeaders())
                    : null,
                o = {
                  data:
                    e.responseType && "text" !== e.responseType
                      ? p.response
                      : p.responseText,
                  status: 1223 === p.status ? 204 : p.status,
                  statusText: 1223 === p.status ? "No Content" : p.statusText,
                  headers: n,
                  config: e,
                  request: p,
                };
              i(t, u, o), (p = null);
            }
          }),
          (p.onerror = function () {
            u(l("Network Error", e, null, p)), (p = null);
          }),
          (p.ontimeout = function () {
            u(
              l("timeout of " + e.timeout + "ms exceeded", e, "ECONNABORTED", p)
            ),
              (p = null);
          }),
          o.isStandardBrowserEnv())
        ) {
          var b = n(731),
            y =
              (e.withCredentials || r(e.url)) && e.xsrfCookieName
                ? b.read(e.xsrfCookieName)
                : void 0;
          y && (m[e.xsrfHeaderName] = y);
        }
        if (
          ("setRequestHeader" in p &&
            o.forEach(m, function (e, t) {
              void 0 === d && "content-type" === t.toLowerCase()
                ? delete m[t]
                : p.setRequestHeader(t, e);
            }),
          e.withCredentials && (p.withCredentials = !0),
          e.responseType)
        )
          try {
            p.responseType = e.responseType;
          } catch (t) {
            if ("json" !== e.responseType) throw t;
          }
        "function" == typeof e.onDownloadProgress &&
          p.addEventListener("progress", e.onDownloadProgress),
          "function" == typeof e.onUploadProgress &&
            p.upload &&
            p.upload.addEventListener("progress", e.onUploadProgress),
          e.cancelToken &&
            e.cancelToken.promise.then(function (e) {
              p && (p.abort(), u(e), (p = null));
            }),
          void 0 === d && (d = null),
          p.send(d);
      });
    };
  },
  708: function (e, t, n) {
    "use strict";
    var o = n(726);
    e.exports = function (e, t, n, i, a) {
      var s = new Error(e);
      return o(s, t, n, i, a);
    };
  },
  709: function (e, t, n) {
    "use strict";
    e.exports = function (e) {
      return !(!e || !e.__CANCEL__);
    };
  },
  710: function (e, t, n) {
    "use strict";
    function o(e) {
      this.message = e;
    }
    (o.prototype.toString = function () {
      return "Cancel" + (this.message ? ": " + this.message : "");
    }),
      (o.prototype.__CANCEL__ = !0),
      (e.exports = o);
  },
  711: function (e, t, n) {
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
  713: function (e, t, n) {
    var o = n(685)(n(744), n(745), !1, null, null, null);
    e.exports = o.exports;
  },
  714: function (e, t, n) {
    "use strict";
    var o = n(686);
    t.a = {
      mixins: [o.a],
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
              var n = JSON.parse(e);
              "payments" in n || (n.payments = {}),
                (n.payments.onSite = this.$root.clonedSettings.payments.onSite),
                (n.payments.stripe = this.$root.clonedSettings.payments.stripe),
                (n.payments.payPal = this.$root.clonedSettings.payments.payPal),
                (n.payments.mollie = this.$root.clonedSettings.payments.mollie),
                (e = JSON.stringify(n));
            }
            if (
              !0 === this.$root.clonedSettings.payments.mollie.enabled &&
              null !== e
            ) {
              var o = JSON.parse(e);
              "payments" in o || (o.payments = {}),
                this.$root.clonedSettings.payments.onSite ||
                  ((o.payments.onSite =
                    this.$root.clonedSettings.payments.onSite),
                  (o.payments.mollie =
                    this.$root.clonedSettings.payments.mollie)),
                (o.payments.stripe = this.$root.clonedSettings.payments.stripe),
                (o.payments.payPal = this.$root.clonedSettings.payments.payPal),
                (e = JSON.stringify(o));
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
  715: function (e, t, n) {
    "use strict";
    var o = n(0),
      i = n.n(o);
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
            var n = e.tags.find(function (e) {
              return e.name === t;
            });
            (this.options.entities.tags = n ? [n] : e.tags),
              (this.eventFilterTag = n ? [n.name] : []);
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
            var n = setInterval(function () {
              t.entitiesLoaded() &&
                (clearInterval(n),
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
            n = [],
            o = [];
          return (
            e.forEach(function (i, a) {
              var s = t && t.periodEnd === i.periodStart;
              s && n.pop(),
                (t = {
                  periodStart: s ? t.periodStart : i.periodStart,
                  periodEnd: i.periodEnd,
                  isConnected: s,
                }),
                n.push(t),
                (e.length === a + 1 ||
                  (a + 1 in e && e[a + 1].periodStart !== i.periodEnd)) &&
                  ((o = o.concat(JSON.parse(JSON.stringify(n)))), (n = []));
            }),
            o
          );
        },
        getExplodedPeriods: function (e) {
          var t = [];
          return (
            e.forEach(function (e) {
              if (e.isConnected) t.push(e);
              else {
                var n = i()(e.periodStart.split(" ")[0], "YYYY-MM-DD"),
                  o = i()(e.periodEnd.split(" ")[0], "YYYY-MM-DD"),
                  a = e.periodStart.split(" ")[1],
                  s = e.periodEnd.split(" ")[1];
                "00:00:00" === s && ((s = "24:00:00"), o.subtract(1, "days"));
                for (var r = []; n.isSameOrBefore(o); )
                  r.push(n.format("YYYY-MM-DD")), n.add(1, "days");
                r.forEach(function (n) {
                  t.push({
                    periodStart: n + " " + a,
                    periodEnd: n + " " + s,
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
          var n = "";
          e.event.location
            ? (n = e.event.location.address)
            : e.event.customLocation && (n = e.event.customLocation);
          var o = [];
          return (
            e.utcTime.forEach(function (e) {
              o.push({
                address: n,
                start: i.a.utc(e.start.replace(/ /g, "T")).toDate(),
                end: i.a.utc(e.end.replace(/ /g, "T")).toDate(),
              });
            }),
            {
              title: this.$root.useTranslations
                ? this.getNameTranslated(e.event)
                : e.event.name,
              dates: o,
              address: n,
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
  717: function (e, t, n) {
    var o = n(685)(n(718), n(719), !1, null, null, null);
    e.exports = o.exports;
  },
  718: function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var o = n(337);
    t.default = {
      mixins: [o.a],
      props: [
        "appointmentsApproved",
        "appointmentsPending",
        "employeesTotal",
        "customersTotal",
        "locationsTotal",
        "packagesTotal",
        "servicesTotal",
        "categoriesTotal",
        "financeTotal",
        "addNewCouponBtnDisplay",
        "addNewCustomFieldBtnDisplay",
        "locations",
        "categories",
        "bookableType",
        "params",
        "fetched",
      ],
      methods: {
        showDialogCustomer: function () {
          this.$emit("newCustomerBtnClicked", null);
        },
        showDialogAppointment: function () {
          this.$emit("newAppointmentBtnClicked", null);
        },
        showDialogEvent: function () {
          this.$emit("newEventBtnClicked", null);
        },
        showDialogEmployee: function () {
          this.$emit("newEmployeeBtnClicked");
        },
        showDialogLocation: function () {
          this.$emit("newLocationBtnClicked");
        },
        showDialogService: function () {
          this.$emit("newServiceBtnClicked");
        },
        showDialogPackage: function () {
          this.$emit("newPackageBtnClicked");
        },
        showDialogCoupon: function () {
          this.$emit("newCouponBtnClicked");
        },
        showDialogCustomFields: function () {
          this.$emit("newCustomFieldBtnClicked");
        },
        selectAllInCategory: function (e) {
          this.$emit("selectAllInCategory", e);
        },
        changeFilter: function () {
          this.$emit("changeFilter");
        },
      },
    };
  },
  719: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          n = e._self._c || t;
        return n(
          "div",
          { staticClass: "am-page-header am-section" },
          [
            n(
              "el-row",
              {
                attrs: {
                  type:
                    "wpamelia-calendar" === e.$router.currentRoute.name
                      ? ""
                      : "flex",
                  align: "middle",
                },
              },
              [
                n(
                  "el-col",
                  {
                    attrs: {
                      span:
                        "wpamelia-calendar" === e.$router.currentRoute.name
                          ? 6
                          : 18,
                    },
                  },
                  [
                    n("div", { staticClass: "am-logo" }, [
                      n("img", {
                        staticClass: "logo-big",
                        attrs: {
                          width: "92",
                          src:
                            e.$root.getUrl +
                            "public/img/amelia-logo-horizontal.svg",
                        },
                      }),
                      e._v(" "),
                      n("img", {
                        staticClass: "logo-small",
                        attrs: {
                          width: "28",
                          src:
                            e.$root.getUrl +
                            "public/img/amelia-logo-symbol.svg",
                        },
                      }),
                    ]),
                    e._v(" "),
                    n("h1", { staticClass: "am-page-title" }, [
                      e._v(
                        "\n        " +
                          e._s(
                            "packages" !== e.bookableType
                              ? e.$router.currentRoute.meta.title
                              : e.$root.labels.packages
                          ) +
                          "\n\n        "
                      ),
                      e._v(" "),
                      e.appointmentsApproved >= 0
                        ? n(
                            "span",
                            { staticClass: "am-appointments-number approved" },
                            [
                              e._v(
                                "\n          " +
                                  e._s(e.appointmentsApproved) +
                                  "\n        "
                              ),
                            ]
                          )
                        : e._e(),
                      e._v(" "),
                      e.appointmentsPending >= 0
                        ? n(
                            "span",
                            { staticClass: "am-appointments-number pending" },
                            [
                              e._v(
                                "\n          " +
                                  e._s(e.appointmentsPending) +
                                  "\n        "
                              ),
                            ]
                          )
                        : e._e(),
                      e._v(" "),
                      e.employeesTotal >= 0 &&
                      !0 === e.$root.settings.capabilities.canReadOthers
                        ? n("span", [
                            n("span", { staticClass: "total-number" }, [
                              e._v(e._s(e.employeesTotal)),
                            ]),
                            e._v(
                              " " + e._s(e.$root.labels.total) + "\n        "
                            ),
                          ])
                        : e._e(),
                      e._v(" "),
                      e.customersTotal >= 0
                        ? n("span", [
                            n("span", { staticClass: "total-number" }, [
                              e._v(e._s(e.customersTotal)),
                            ]),
                            e._v(
                              " " + e._s(e.$root.labels.total) + "\n        "
                            ),
                          ])
                        : e._e(),
                      e._v(" "),
                      e.locationsTotal >= 0
                        ? n("span", [
                            n("span", { staticClass: "total-number" }, [
                              e._v(e._s(e.locationsTotal)),
                            ]),
                            e._v(
                              " " + e._s(e.$root.labels.total) + "\n        "
                            ),
                          ])
                        : e._e(),
                      e._v(" "),
                      e.servicesTotal >= 0 && "services" === e.bookableType
                        ? n("span", [
                            n("span", { staticClass: "total-number" }, [
                              e._v(e._s(e.servicesTotal)),
                            ]),
                            e._v(
                              " " + e._s(e.$root.labels.total) + "\n        "
                            ),
                          ])
                        : e._e(),
                      e._v(" "),
                      e.packagesTotal >= 0 && "packages" === e.bookableType
                        ? n("span", [
                            n("span", { staticClass: "total-number" }, [
                              e._v(e._s(e.packagesTotal)),
                            ]),
                            e._v(
                              " " + e._s(e.$root.labels.total) + "\n        "
                            ),
                          ])
                        : e._e(),
                      e._v(" "),
                      e.financeTotal >= 0
                        ? n("span", [
                            n("span", { staticClass: "total-number" }, [
                              e._v(e._s(e.financeTotal)),
                            ]),
                            e._v(
                              " " + e._s(e.$root.labels.total) + "\n        "
                            ),
                          ])
                        : e._e(),
                    ]),
                  ]
                ),
                e._v(" "),
                n(
                  "el-col",
                  {
                    staticClass: "align-right v-calendar-column",
                    attrs: {
                      span:
                        "wpamelia-calendar" === e.$router.currentRoute.name
                          ? 18
                          : 6,
                    },
                  },
                  [
                    "wpamelia-appointments" === e.$router.currentRoute.name &&
                    (!0 === e.$root.settings.capabilities.canWriteOthers ||
                      ("provider" === this.$root.settings.role &&
                        this.$root.settings.roles.allowWriteAppointments))
                      ? n(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogAppointment },
                          },
                          [
                            n("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            n("span", { staticClass: "button-text" }, [
                              e._v(e._s(e.$root.labels.new_appointment)),
                            ]),
                          ]
                        )
                      : e._e(),
                    e._v(" "),
                    "wpamelia-events" === e.$router.currentRoute.name &&
                    (!0 === e.$root.settings.capabilities.canWriteOthers ||
                      ("provider" === this.$root.settings.role &&
                        this.$root.settings.roles.allowWriteEvents))
                      ? n(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogEvent },
                          },
                          [
                            n("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            n("span", { staticClass: "button-text" }, [
                              e._v(e._s(e.$root.labels.new_event)),
                            ]),
                          ]
                        )
                      : e._e(),
                    e._v(" "),
                    "wpamelia-employees" === e.$router.currentRoute.name &&
                    !0 === e.$root.settings.capabilities.canWrite &&
                    !0 === e.$root.settings.capabilities.canWriteOthers
                      ? n(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogEmployee },
                          },
                          [
                            n("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            n("span", { staticClass: "button-text" }, [
                              e._v(e._s(e.$root.labels.add_employee)),
                            ]),
                          ]
                        )
                      : e._e(),
                    e._v(" "),
                    "wpamelia-customers" === e.$router.currentRoute.name &&
                    !0 === e.$root.settings.capabilities.canWrite
                      ? n(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogCustomer },
                          },
                          [
                            n("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            n("span", { staticClass: "button-text" }, [
                              e._v(e._s(e.$root.labels.add_customer)),
                            ]),
                          ]
                        )
                      : e._e(),
                    e._v(" "),
                    "wpamelia-locations" === e.$router.currentRoute.name &&
                    !0 === e.$root.settings.capabilities.canWrite
                      ? n(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogLocation },
                          },
                          [
                            n("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            n("span", { staticClass: "button-text" }, [
                              e._v(e._s(e.$root.labels.add_location)),
                            ]),
                          ]
                        )
                      : e._e(),
                    e._v(" "),
                    "wpamelia-services" === e.$router.currentRoute.name &&
                    e.categoriesTotal > 0 &&
                    !0 === e.$root.settings.capabilities.canWrite &&
                    "services" === e.bookableType
                      ? n(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogService },
                          },
                          [
                            n("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            n("span", { staticClass: "button-text" }, [
                              e._v(e._s(e.$root.labels.add_service)),
                            ]),
                          ]
                        )
                      : e._e(),
                    e._v(" "),
                    "wpamelia-services" === e.$router.currentRoute.name &&
                    e.servicesTotal > 0 &&
                    !0 === e.$root.settings.capabilities.canWrite &&
                    "packages" === e.bookableType
                      ? n(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogPackage },
                          },
                          [
                            n("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            n("span", { staticClass: "button-text" }, [
                              e._v(e._s(e.$root.labels.add_package)),
                            ]),
                          ]
                        )
                      : e._e(),
                    e._v(" "),
                    n(
                      "transition",
                      { attrs: { name: "fade" } },
                      [
                        "wpamelia-finance" === e.$router.currentRoute.name &&
                        e.addNewCouponBtnDisplay &&
                        !0 === e.$root.settings.capabilities.canWrite
                          ? n(
                              "el-button",
                              {
                                staticClass: "am-dialog-create",
                                attrs: { type: "primary" },
                                on: { click: e.showDialogCoupon },
                              },
                              [
                                n("i", { staticClass: "el-icon-plus" }),
                                e._v(" "),
                                n("span", { staticClass: "button-text" }, [
                                  e._v(e._s(e.$root.labels.new_coupon)),
                                ]),
                              ]
                            )
                          : e._e(),
                      ],
                      1
                    ),
                    e._v(" "),
                    n(
                      "transition",
                      { attrs: { name: "fade" } },
                      [
                        "wpamelia-customize" === e.$router.currentRoute.name &&
                        e.addNewCustomFieldBtnDisplay &&
                        !0 === e.$root.settings.capabilities.canWrite
                          ? n(
                              "el-button",
                              {
                                staticClass: "am-dialog-create",
                                attrs: { type: "primary" },
                                on: { click: e.showDialogCustomFields },
                              },
                              [
                                n("i", { staticClass: "el-icon-plus" }),
                                e._v(" "),
                                n("span", { staticClass: "button-text" }, [
                                  e._v(e._s(e.$root.labels.add_custom_field)),
                                ]),
                              ]
                            )
                          : e._e(),
                      ],
                      1
                    ),
                    e._v(" "),
                    "wpamelia-dashboard" === e.$router.currentRoute.name
                      ? n("div", { staticClass: "v-calendar-column" }, [
                          n(
                            "div",
                            { staticClass: "el-form-item__content" },
                            [
                              n("v-date-picker", {
                                attrs: {
                                  mode: "range",
                                  "popover-visibility": "focus",
                                  "popover-direction": "bottom",
                                  "popover-align": "right",
                                  "tint-color": "#1A84EE",
                                  "show-day-popover": !1,
                                  "input-props": { class: "el-input__inner" },
                                  "is-expanded": !1,
                                  "is-required": !0,
                                  "input-class": "el-input__inner",
                                  formats: e.vCalendarFormats,
                                  "is-double-paned": !0,
                                },
                                on: { input: e.changeFilter },
                                model: {
                                  value: e.params.dates,
                                  callback: function (t) {
                                    e.$set(e.params, "dates", t);
                                  },
                                  expression: "params.dates",
                                },
                              }),
                            ],
                            1
                          ),
                        ])
                      : e._e(),
                    e._v(" "),
                    "wpamelia-calendar" === e.$router.currentRoute.name
                      ? n(
                          "div",
                          { staticClass: "am-calendar-header-filters" },
                          [
                            n(
                              "el-form",
                              {
                                staticClass: "demo-form-inline",
                                attrs: { inline: !0 },
                              },
                              [
                                n(
                                  "el-form-item",
                                  {
                                    attrs: {
                                      label: e.$root.labels.services + ":",
                                    },
                                  },
                                  [
                                    n(
                                      "el-select",
                                      {
                                        attrs: {
                                          multiple: "",
                                          filterable: "",
                                          "collapse-tags": "",
                                          loading: !e.fetched,
                                          placeholder:
                                            e.$root.labels.all_services,
                                        },
                                        on: { change: e.changeFilter },
                                        model: {
                                          value: e.params.services,
                                          callback: function (t) {
                                            e.$set(e.params, "services", t);
                                          },
                                          expression: "params.services",
                                        },
                                      },
                                      e._l(e.categories, function (t) {
                                        return n(
                                          "div",
                                          { key: t.id },
                                          [
                                            n(
                                              "div",
                                              {
                                                staticClass: "am-drop-parent",
                                                on: {
                                                  click: function (n) {
                                                    return e.selectAllInCategory(
                                                      t.id
                                                    );
                                                  },
                                                },
                                              },
                                              [n("span", [e._v(e._s(t.name))])]
                                            ),
                                            e._v(" "),
                                            e._l(t.serviceList, function (e) {
                                              return n("el-option", {
                                                key: e.id,
                                                staticClass: "am-drop-child",
                                                attrs: {
                                                  label: e.name,
                                                  value: e.id,
                                                },
                                              });
                                            }),
                                          ],
                                          2
                                        );
                                      }),
                                      0
                                    ),
                                  ],
                                  1
                                ),
                                e._v(" "),
                                n(
                                  "el-form-item",
                                  {
                                    directives: [
                                      {
                                        name: "show",
                                        rawName: "v-show",
                                        value: e.locations.length,
                                        expression: "locations.length",
                                      },
                                    ],
                                    attrs: {
                                      label: e.$root.labels.locations + ":",
                                    },
                                  },
                                  [
                                    n(
                                      "el-select",
                                      {
                                        attrs: {
                                          multiple: "",
                                          clearable: "",
                                          "collapse-tags": "",
                                          placeholder:
                                            e.$root.labels.all_locations,
                                          loading: !e.fetched,
                                        },
                                        on: { change: e.changeFilter },
                                        model: {
                                          value: e.params.locations,
                                          callback: function (t) {
                                            e.$set(e.params, "locations", t);
                                          },
                                          expression: "params.locations",
                                        },
                                      },
                                      e._l(e.locations, function (e) {
                                        return n("el-option", {
                                          key: e.id,
                                          attrs: { label: e.name, value: e.id },
                                        });
                                      }),
                                      1
                                    ),
                                  ],
                                  1
                                ),
                              ],
                              1
                            ),
                            e._v(" "),
                            "wpamelia-calendar" ===
                              e.$router.currentRoute.name &&
                            ("admin" === e.$root.settings.role ||
                              "manager" === e.$root.settings.role ||
                              ("provider" === e.$root.settings.role &&
                                e.$root.settings.roles.allowWriteAppointments))
                              ? n(
                                  "el-button",
                                  {
                                    staticClass: "am-dialog-create",
                                    attrs: { type: "primary" },
                                    on: { click: e.showDialogAppointment },
                                  },
                                  [
                                    n("i", { staticClass: "el-icon-plus" }),
                                    e._v(" "),
                                    n("span", { staticClass: "button-text" }, [
                                      e._v(
                                        e._s(e.$root.labels.new_appointment)
                                      ),
                                    ]),
                                  ]
                                )
                              : e._e(),
                          ],
                          1
                        )
                      : e._e(),
                  ],
                  1
                ),
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
  721: function (e, t, n) {
    e.exports = n(722);
  },
  722: function (e, t, n) {
    "use strict";
    var o = n(688),
      i = n(706),
      a = n(723),
      s = n(697);
    function r(e) {
      var t = new a(e),
        n = i(a.prototype.request, t);
      return o.extend(n, a.prototype, t), o.extend(n, t), n;
    }
    var l = r(s);
    (l.Axios = a),
      (l.create = function (e) {
        return r(o.merge(s, e));
      }),
      (l.Cancel = n(710)),
      (l.CancelToken = n(737)),
      (l.isCancel = n(709)),
      (l.all = function (e) {
        return Promise.all(e);
      }),
      (l.spread = n(738)),
      (e.exports = l),
      (e.exports.default = l);
  },
  723: function (e, t, n) {
    "use strict";
    var o = n(697),
      i = n(688),
      a = n(732),
      s = n(733),
      r = n(735),
      l = n(736);
    function c(e) {
      (this.defaults = e),
        (this.interceptors = { request: new a(), response: new a() });
    }
    (c.prototype.request = function (e) {
      "string" == typeof e &&
        (e = i.merge({ url: arguments[0] }, arguments[1])),
        ((e = i.merge(o, this.defaults, { method: "get" }, e)).method =
          e.method.toLowerCase()),
        e.baseURL && !r(e.url) && (e.url = l(e.baseURL, e.url));
      var t = [s, void 0],
        n = Promise.resolve(e);
      for (
        this.interceptors.request.forEach(function (e) {
          t.unshift(e.fulfilled, e.rejected);
        }),
          this.interceptors.response.forEach(function (e) {
            t.push(e.fulfilled, e.rejected);
          });
        t.length;

      )
        n = n.then(t.shift(), t.shift());
      return n;
    }),
      i.forEach(["delete", "get", "head", "options"], function (e) {
        c.prototype[e] = function (t, n) {
          return this.request(i.merge(n || {}, { method: e, url: t }));
        };
      }),
      i.forEach(["post", "put", "patch"], function (e) {
        c.prototype[e] = function (t, n, o) {
          return this.request(i.merge(o || {}, { method: e, url: t, data: n }));
        };
      }),
      (e.exports = c);
  },
  724: function (e, t, n) {
    "use strict";
    var o = n(688);
    e.exports = function (e, t) {
      o.forEach(e, function (n, o) {
        o !== t &&
          o.toUpperCase() === t.toUpperCase() &&
          ((e[t] = n), delete e[o]);
      });
    };
  },
  725: function (e, t, n) {
    "use strict";
    var o = n(708);
    e.exports = function (e, t, n) {
      var i = n.config.validateStatus;
      n.status && i && !i(n.status)
        ? t(
            o(
              "Request failed with status code " + n.status,
              n.config,
              null,
              n.request,
              n
            )
          )
        : e(n);
    };
  },
  726: function (e, t, n) {
    "use strict";
    e.exports = function (e, t, n, o, i) {
      return (
        (e.config = t), n && (e.code = n), (e.request = o), (e.response = i), e
      );
    };
  },
  727: function (e, t, n) {
    "use strict";
    var o = n(688);
    function i(e) {
      return encodeURIComponent(e)
        .replace(/%40/gi, "@")
        .replace(/%3A/gi, ":")
        .replace(/%24/g, "$")
        .replace(/%2C/gi, ",")
        .replace(/%20/g, "+")
        .replace(/%5B/gi, "[")
        .replace(/%5D/gi, "]");
    }
    e.exports = function (e, t, n) {
      if (!t) return e;
      var a;
      if (n) a = n(t);
      else if (o.isURLSearchParams(t)) a = t.toString();
      else {
        var s = [];
        o.forEach(t, function (e, t) {
          null !== e &&
            void 0 !== e &&
            (o.isArray(e) && (t += "[]"),
            o.isArray(e) || (e = [e]),
            o.forEach(e, function (e) {
              o.isDate(e)
                ? (e = e.toISOString())
                : o.isObject(e) && (e = JSON.stringify(e)),
                s.push(i(t) + "=" + i(e));
            }));
        }),
          (a = s.join("&"));
      }
      return a && (e += (-1 === e.indexOf("?") ? "?" : "&") + a), e;
    };
  },
  728: function (e, t, n) {
    "use strict";
    var o = n(688);
    e.exports = function (e) {
      var t,
        n,
        i,
        a = {};
      return e
        ? (o.forEach(e.split("\n"), function (e) {
            (i = e.indexOf(":")),
              (t = o.trim(e.substr(0, i)).toLowerCase()),
              (n = o.trim(e.substr(i + 1))),
              t && (a[t] = a[t] ? a[t] + ", " + n : n);
          }),
          a)
        : a;
    };
  },
  729: function (e, t, n) {
    "use strict";
    var o = n(688);
    e.exports = o.isStandardBrowserEnv()
      ? (function () {
          var e,
            t = /(msie|trident)/i.test(navigator.userAgent),
            n = document.createElement("a");
          function i(e) {
            var o = e;
            return (
              t && (n.setAttribute("href", o), (o = n.href)),
              n.setAttribute("href", o),
              {
                href: n.href,
                protocol: n.protocol ? n.protocol.replace(/:$/, "") : "",
                host: n.host,
                search: n.search ? n.search.replace(/^\?/, "") : "",
                hash: n.hash ? n.hash.replace(/^#/, "") : "",
                hostname: n.hostname,
                port: n.port,
                pathname:
                  "/" === n.pathname.charAt(0) ? n.pathname : "/" + n.pathname,
              }
            );
          }
          return (
            (e = i(window.location.href)),
            function (t) {
              var n = o.isString(t) ? i(t) : t;
              return n.protocol === e.protocol && n.host === e.host;
            }
          );
        })()
      : function () {
          return !0;
        };
  },
  730: function (e, t, n) {
    "use strict";
    var o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    function i() {
      this.message = "String contains an invalid character";
    }
    (i.prototype = new Error()),
      (i.prototype.code = 5),
      (i.prototype.name = "InvalidCharacterError"),
      (e.exports = function (e) {
        for (
          var t, n, a = String(e), s = "", r = 0, l = o;
          a.charAt(0 | r) || ((l = "="), r % 1);
          s += l.charAt(63 & (t >> (8 - (r % 1) * 8)))
        ) {
          if ((n = a.charCodeAt((r += 0.75))) > 255) throw new i();
          t = (t << 8) | n;
        }
        return s;
      });
  },
  731: function (e, t, n) {
    "use strict";
    var o = n(688);
    e.exports = o.isStandardBrowserEnv()
      ? {
          write: function (e, t, n, i, a, s) {
            var r = [];
            r.push(e + "=" + encodeURIComponent(t)),
              o.isNumber(n) && r.push("expires=" + new Date(n).toGMTString()),
              o.isString(i) && r.push("path=" + i),
              o.isString(a) && r.push("domain=" + a),
              !0 === s && r.push("secure"),
              (document.cookie = r.join("; "));
          },
          read: function (e) {
            var t = document.cookie.match(
              new RegExp("(^|;\\s*)(" + e + ")=([^;]*)")
            );
            return t ? decodeURIComponent(t[3]) : null;
          },
          remove: function (e) {
            this.write(e, "", Date.now() - 864e5);
          },
        }
      : {
          write: function () {},
          read: function () {
            return null;
          },
          remove: function () {},
        };
  },
  732: function (e, t, n) {
    "use strict";
    var o = n(688);
    function i() {
      this.handlers = [];
    }
    (i.prototype.use = function (e, t) {
      return (
        this.handlers.push({ fulfilled: e, rejected: t }),
        this.handlers.length - 1
      );
    }),
      (i.prototype.eject = function (e) {
        this.handlers[e] && (this.handlers[e] = null);
      }),
      (i.prototype.forEach = function (e) {
        o.forEach(this.handlers, function (t) {
          null !== t && e(t);
        });
      }),
      (e.exports = i);
  },
  733: function (e, t, n) {
    "use strict";
    var o = n(688),
      i = n(734),
      a = n(709),
      s = n(697);
    function r(e) {
      e.cancelToken && e.cancelToken.throwIfRequested();
    }
    e.exports = function (e) {
      return (
        r(e),
        (e.headers = e.headers || {}),
        (e.data = i(e.data, e.headers, e.transformRequest)),
        (e.headers = o.merge(
          e.headers.common || {},
          e.headers[e.method] || {},
          e.headers || {}
        )),
        o.forEach(
          ["delete", "get", "head", "post", "put", "patch", "common"],
          function (t) {
            delete e.headers[t];
          }
        ),
        (e.adapter || s.adapter)(e).then(
          function (t) {
            return (
              r(e), (t.data = i(t.data, t.headers, e.transformResponse)), t
            );
          },
          function (t) {
            return (
              a(t) ||
                (r(e),
                t &&
                  t.response &&
                  (t.response.data = i(
                    t.response.data,
                    t.response.headers,
                    e.transformResponse
                  ))),
              Promise.reject(t)
            );
          }
        )
      );
    };
  },
  734: function (e, t, n) {
    "use strict";
    var o = n(688);
    e.exports = function (e, t, n) {
      return (
        o.forEach(n, function (n) {
          e = n(e, t);
        }),
        e
      );
    };
  },
  735: function (e, t, n) {
    "use strict";
    e.exports = function (e) {
      return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e);
    };
  },
  736: function (e, t, n) {
    "use strict";
    e.exports = function (e, t) {
      return t ? e.replace(/\/+$/, "") + "/" + t.replace(/^\/+/, "") : e;
    };
  },
  737: function (e, t, n) {
    "use strict";
    var o = n(710);
    function i(e) {
      if ("function" != typeof e)
        throw new TypeError("executor must be a function.");
      var t;
      this.promise = new Promise(function (e) {
        t = e;
      });
      var n = this;
      e(function (e) {
        n.reason || ((n.reason = new o(e)), t(n.reason));
      });
    }
    (i.prototype.throwIfRequested = function () {
      if (this.reason) throw this.reason;
    }),
      (i.source = function () {
        var e;
        return {
          token: new i(function (t) {
            e = t;
          }),
          cancel: e,
        };
      }),
      (e.exports = i);
  },
  738: function (e, t, n) {
    "use strict";
    e.exports = function (e) {
      return function (t) {
        return e.apply(null, t);
      };
    };
  },
  739: function (e, t, n) {
    "use strict";
    var o,
      i = (function () {
        function e(e, t) {
          for (var n = 0; n < t.length; n++) {
            var o = t[n];
            (o.enumerable = o.enumerable || !1),
              (o.configurable = !0),
              "value" in o && (o.writable = !0),
              Object.defineProperty(e, o.key, o);
          }
        }
        return function (t, n, o) {
          return n && e(t.prototype, n), o && e(t, o), t;
        };
      })(),
      a = n(13),
      s = (o = a) && o.__esModule ? o : { default: o };
    e.exports = (function () {
      function e() {
        !(function (e, t) {
          if (!(e instanceof t))
            throw new TypeError("Cannot call a class as a function");
        })(this, e),
          (this.errors = {});
      }
      return (
        i(e, [
          {
            key: "set",
            value: function (e) {
              this.errors = e;
            },
          },
          {
            key: "has",
            value: function (e) {
              return this.errors.hasOwnProperty(e);
            },
          },
          {
            key: "get",
            value: function (e) {
              if (this.has(e)) return this.errors[e][0];
            },
          },
          {
            key: "getAll",
            value: function (e) {
              if (this.has(e)) return this.errors[e];
            },
          },
          {
            key: "clear",
            value: function (e) {
              e ? s.default.delete(this.errors, e) : (this.errors = {});
            },
          },
          {
            key: "any",
            value: function () {
              return Object.keys(this.errors).length > 0;
            },
          },
        ]),
        e
      );
    })();
  },
  740: function (e, t, n) {
    "use strict";
    function o(e) {
      return void 0 === e;
    }
    function i(e) {
      return Array.isArray(e);
    }
    function a(e) {
      return (
        e &&
        "number" == typeof e.size &&
        "string" == typeof e.type &&
        "function" == typeof e.slice
      );
    }
    e.exports = function e(t, n, s, r) {
      if (
        (n instanceof FormData && ((r = s), (s = n), (n = null)),
        ((n = n || {}).indices = !o(n.indices) && n.indices),
        (n.nulls = !!o(n.nulls) || n.nulls),
        (s = s || new FormData()),
        o(t))
      )
        return s;
      if (
        (function (e) {
          return null === e;
        })(t)
      )
        n.nulls && s.append(r, "");
      else if (i(t))
        if (t.length)
          t.forEach(function (t, o) {
            var i = r + "[" + (n.indices ? o : "") + "]";
            e(t, n, s, i);
          });
        else {
          var l = r + "[]";
          s.append(l, "");
        }
      else
        !(function (e) {
          return e instanceof Date;
        })(t)
          ? !(function (e) {
              return e === Object(e);
            })(t) ||
            (function (e) {
              return (
                a(e) &&
                ("object" == typeof e.lastModifiedDate ||
                  "number" == typeof e.lastModified) &&
                "string" == typeof e.name
              );
            })(t) ||
            a(t)
            ? s.append(r, t)
            : Object.keys(t).forEach(function (o) {
                var a = t[o];
                if (i(a))
                  for (; o.length > 2 && o.lastIndexOf("[]") === o.length - 2; )
                    o = o.substring(0, o.length - 2);
                e(a, n, s, r ? r + "[" + o + "]" : o);
              })
          : s.append(r, t.toISOString());
      return s;
    };
  },
  741: function (e, t, n) {
    "use strict";
    t.a = {
      data: function () {
        return {};
      },
      methods: {
        updateStashEntities: function (e) {
          this.$root.settings.activation.stash &&
            this.$http
              .post(this.$root.getAjaxUrl + "/stash", e)
              .then(function (e) {});
        },
      },
    };
  },
  743: function (e, t, n) {
    "use strict";
    t.a = {
      data: function () {
        return {
          searchCounter: 0,
          loadingCustomers: !1,
          searchCustomersTimer: null,
          searchedCustomers: [],
          dialogCustomer: !1,
        };
      },
      methods: {
        getInitCustomerObject: function () {
          return {
            id: 0,
            firstName: "",
            lastName: "",
            externalId: "",
            phone: "",
            countryPhoneIso: null,
            email: "",
            gender: "",
            birthday: null,
            note: "",
            status: "visible",
            type: "customer",
            countPendingAppointments: 0,
          };
        },
        setInitialCustomers: function () {
          var e = this;
          "customer" !== this.$root.settings.role &&
            this.searchCustomers("", function () {
              var t = e.options.entities.customers.map(function (e) {
                  return parseInt(e.id);
                }),
                n = e.options.entities.customers;
              e.searchedCustomers.forEach(function (e) {
                -1 === t.indexOf(parseInt(e.id)) && (t.push(e.id), n.push(e));
              }),
                (e.options.entities.customers = Object.values(
                  n.sort(function (e, t) {
                    return e.firstName.toLowerCase() > t.firstName.toLowerCase()
                      ? 1
                      : -1;
                  })
                ));
            });
        },
        searchCustomers: function (e, t) {
          var n = this;
          clearTimeout(this.searchCustomersTimer),
            (this.loadingCustomers = !0),
            this.searchCounter++,
            (this.searchCustomersTimer = setTimeout(function () {
              var o = n.searchCounter;
              n.$http
                .get(n.$root.getAjaxUrl + "/users/customers", {
                  params: {
                    search: e,
                    page: 1,
                    limit: n.$root.settings.general.customersFilterLimit,
                    skipCount: 1,
                  },
                })
                .then(function (e) {
                  o >= n.searchCounter &&
                    (n.searchedCustomers = e.data.data.users.sort(function (
                      e,
                      t
                    ) {
                      return e.firstName.toLowerCase() >
                        t.firstName.toLowerCase()
                        ? 1
                        : -1;
                    })),
                    (n.loadingCustomers = !1),
                    t();
                })
                .catch(function (e) {
                  n.loadingCustomers = !1;
                });
            }, 500));
        },
      },
    };
  },
  744: function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var o = n(702),
      i = n.n(o),
      a = n(691),
      s = n(337),
      r = n(701),
      l = n(741);
    t.default = {
      mixins: [a.a, s.a, r.a, l.a],
      props: {
        formName: "",
        urlName: null,
        isNew: null,
        entity: null,
        getParsedEntity: null,
        updateStash: !1,
        haveSaveConfirmation: null,
        hasApplyGloballyVisibility: !1,
        hasApplyGloballyDeletion: !1,
        hasIcons: !0,
        status: null,
        buttonType: { status: "primary", remove: "danger" },
        action: {
          haveAdd: !1,
          haveEdit: !1,
          haveStatus: !1,
          haveRemove: !1,
          haveRemoveEffect: !1,
          ignoreDeleteEffect: !1,
          haveDuplicate: !1,
          haveSaveWarning: !1,
        },
        message: {
          success: { save: null, remove: null, show: null, hide: null },
          confirm: {
            remove: null,
            show: null,
            hide: null,
            duplicate: null,
            save: null,
          },
        },
        buttonText: null,
      },
      data: function () {
        return {
          form: new i.a(),
          allowedDelete: !0,
          showDeleteConfirmation: !1,
          showVisibilityConfirmation: !1,
          showDuplicateConfirmation: !1,
          showSaveConfirmation: !1,
          showAddHoursDialog: !1,
          deleteEffectMessage: null,
          dialogLoading: !1,
        };
      },
      methods: {
        getButtonType: function (e) {
          switch (e) {
            case "status":
              return this.hasIcons ? null : this.buttonType.status;
            case "remove":
              return this.hasIcons ? null : this.buttonType.remove;
            case "duplicate":
              return this.hasIcons ? null : this.buttonType.duplicate;
          }
        },
        closeDialog: function () {
          this.$parent.$emit("closeDialog");
        },
        onSubmit: function (e) {
          var t = this,
            n = this.$root;
          this.$parent.$refs[this.formName].validate(function (o, i) {
            if (!o)
              return (
                "appointment" === t.formName &&
                  t.handleAppointmentDialogTabChange(i),
                t.$emit("validationFailCallback"),
                !1
              );
            (t.dialogLoading = !0),
              t.isNew ? t.addEntity(e) : t.editEntity(e),
              (t.$root = n);
          });
        },
        onSuccess: function (e, t, n) {
          var o = this;
          this.$parent.$emit("saveCallback", n),
            setTimeout(function () {
              (o.dialogLoading = !1), o.$parent.$emit("closeDialog");
            }, 300),
            this.notify(e, t, "success");
        },
        onError: function (e, t) {
          (this.dialogLoading = !1), this.$emit("errorCallback", t);
        },
        addEntity: function (e) {
          var t = this,
            n = null;
          void 0 !== this.$store &&
            void 0 !== this.$store.state.cabinet &&
            "provider" === this.$store.state.cabinet.cabinetType &&
            (n = Object.assign(this.getAuthorizationHeaderObject(), {
              params: {
                source: "cabinet-" + this.$store.state.cabinet.cabinetType,
              },
            })),
            this.$http
              .post(
                this.$root.getAjaxUrl + "/" + this.urlName,
                this.getParsedEntity(e),
                n
              )
              .then(function (e) {
                t.onSuccess(
                  t.$root.labels.success,
                  t.message.success.save,
                  e.data.data
                ),
                  t.updateStash && t.updateStashEntities({});
              })
              .catch(function (e) {
                e.response && t.onError("", e.response.data.data);
              });
        },
        //P2P: Send location id and custom location
        editEntity: function (e) {
          var t = this,
            n = null;
          void 0 !== this.$store &&
            void 0 !== this.$store.state.cabinet &&
            "provider" === this.$store.state.cabinet.cabinetType &&
            (n = Object.assign(this.getAuthorizationHeaderObject(), {
              params: {
                source: "cabinet-" + this.$store.state.cabinet.cabinetType,
              },
            })),
            this.$http
              .post(
                this.$root.getAjaxUrl +
                  "/" +
                  this.urlName +
                  "/" +
                  this.entity.id,
                this.getParsedEntity(e),
                n
              )
              .then(function (e) {
                t.onSuccess(
                  t.$root.labels.success,
                  t.message.success.save,
                  e.data.data
                ),
                  t.updateStash && t.updateStashEntities({});
              })
              .catch(function (e) {
                e.response && t.onError("", e.response.data.data);
              });
        },
        deleteEntity: function (e) {
          var t = this;
          (this.dialogLoading = !0),
            this.form
              .post(
                this.$root.getAjaxUrl +
                  "/" +
                  this.urlName +
                  "/delete/" +
                  this.entity.id,
                { status: this.status.on, applyGlobally: e }
              )
              .then(function (e) {
                t.onSuccess(
                  t.$root.labels.success,
                  t.message.success.remove,
                  e.data.data
                ),
                  t.updateStash && t.updateStashEntities({});
              })
              .catch(function (e) {
                e.response && t.onError("", e.response.data.data.message);
              });
        },
        showEntity: function (e) {
          var t = this;
          (this.dialogLoading = !0),
            this.form
              .post(
                this.$root.getAjaxUrl +
                  "/" +
                  this.urlName +
                  "/status/" +
                  this.entity.id,
                { status: this.status.on, applyGlobally: e }
              )
              .then(function (e) {
                t.onSuccess(
                  t.$root.labels.success,
                  t.message.success.show,
                  null
                ),
                  t.updateStash && t.updateStashEntities({});
              })
              .catch(function (e) {
                e.response && t.onError("", e.response.data.data.message);
              });
        },
        hideEntity: function (e) {
          var t = this;
          (this.dialogLoading = !0),
            this.form
              .post(
                this.$root.getAjaxUrl +
                  "/" +
                  this.urlName +
                  "/status/" +
                  this.entity.id,
                { status: this.status.off, applyGlobally: e }
              )
              .then(function () {
                t.onSuccess(
                  t.$root.labels.success,
                  t.message.success.hide,
                  null
                ),
                  t.updateStash && t.updateStashEntities({});
              })
              .catch(function (e) {
                e.response && t.onError("", e.response.data.data.message);
              });
        },
        duplicateEntity: function () {
          var e = this;
          (this.dialogLoading = !0),
            this.$parent.$emit("closeDialog", !0),
            this.$parent.$emit("duplicateCallback", this.entity),
            setTimeout(function () {
              (e.showDuplicateConfirmation = !1), (e.dialogLoading = !1);
            }, 600);
        },
        handleSaveConfirmation: function () {
          (this.showSaveConfirmation = !this.showSaveConfirmation),
            (this.showVisibilityConfirmation = !1),
            (this.showDeleteConfirmation = !1),
            (this.showDuplicateConfirmation = !1);
        },
        handleDuplicateConfirmation: function () {
          (this.showDuplicateConfirmation = !this.showDuplicateConfirmation),
            (this.showSaveConfirmation = !1),
            (this.showDeleteConfirmation = !1),
            (this.showVisibilityConfirmation = !1);
        },
        handleVisibilityConfirmation: function () {
          (this.showVisibilityConfirmation = !this.showVisibilityConfirmation),
            (this.showSaveConfirmation = !1),
            (this.showDeleteConfirmation = !1),
            (this.showDuplicateConfirmation = !1);
        },
        handleDeleteConfirmation: function () {
          var e = this;
          (this.showVisibilityConfirmation = !1),
            (this.showDuplicateConfirmation = !1),
            (this.showSaveConfirmation = !1),
            this.action.haveRemoveEffect
              ? !1 === this.showDeleteConfirmation &&
                this.$http
                  .get(
                    this.$root.getAjaxUrl +
                      "/" +
                      this.urlName +
                      "/effect/" +
                      this.entity.id
                  )
                  .then(function (t) {
                    (e.allowedDelete =
                      t.data.data.valid || e.ignoreDeleteEffect),
                      (e.deleteEffectMessage = t.data.data.message),
                      (e.showDeleteConfirmation = !e.showDeleteConfirmation);
                  })
                  .catch(function (t) {
                    (e.showDeleteConfirmation = !e.showDeleteConfirmation),
                      (e.deleteEffectMessage = "");
                  })
              : (this.showDeleteConfirmation = !this.showDeleteConfirmation);
        },
        handleSaveClick: function () {
          this.haveSaveConfirmation && this.haveSaveConfirmation()
            ? this.handleSaveConfirmation()
            : this.onSubmit(!1);
        },
        getConfirmSaveButtonText: function () {
          return null !== this.buttonText &&
            this.buttonText.confirm &&
            this.buttonText.confirm.save
            ? {
                yes: this.buttonText.confirm.save.yes,
                no: this.buttonText.confirm.save.no,
              }
            : { yes: this.$root.labels.yes, no: this.$root.labels.no };
        },
        getConfirmDeleteButtonText: function () {
          return null !== this.buttonText &&
            this.buttonText.confirm &&
            this.buttonText.confirm.remove
            ? {
                yes: this.buttonText.confirm.remove.yes,
                no: this.buttonText.confirm.remove.no,
              }
            : { yes: this.$root.labels.yes, no: this.$root.labels.no };
        },
        getConfirmStatusButtonText: function () {
          return null !== this.buttonText &&
            this.buttonText.confirm &&
            this.buttonText.confirm.status
            ? {
                yes: this.buttonText.confirm.status.yes,
                no: this.buttonText.confirm.status.no,
              }
            : { yes: this.$root.labels.yes, no: this.$root.labels.no };
        },
        getActionStatusButtonText: function () {
          return null !== this.buttonText && this.buttonText.action
            ? this.buttonText.action.status
            : "";
        },
        getActionRemoveButtonText: function () {
          return null !== this.buttonText && this.buttonText.action
            ? this.buttonText.action.remove
            : "";
        },
        getActionDuplicateButtonText: function () {
          return null !== this.buttonText && this.buttonText.action
            ? this.buttonText.action.duplicate
            : "";
        },
        handleAppointmentDialogTabChange: function (e) {
          for (var t = Object.keys(e), n = 0, o = 0; o < t.length; o++)
            n = t[o].startsWith("bookings.") ? n + 1 : n;
          n === t.length && this.$emit("validationBookingsFailCallback");
        },
        isStatusOn: function () {
          return this.entity.status === this.status.on;
        },
        isStatusOff: function () {
          return this.entity.status === this.status.off;
        },
      },
      computed: {},
      components: {},
    };
  },
  745: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          n = e._self._c || t;
        return n("div", [
          n("div", { staticClass: "am-dialog-footer" }, [
            n(
              "div",
              { staticClass: "am-dialog-footer-actions" },
              [
                n("transition", { attrs: { name: "slide-vertical" } }, [
                  n(
                    "div",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: e.showDeleteConfirmation,
                          expression: "showDeleteConfirmation",
                        },
                      ],
                      staticClass: "am-dialog-confirmation",
                    },
                    [
                      n(
                        "h3",
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value: e.allowedDelete,
                              expression: "allowedDelete",
                            },
                          ],
                        },
                        [e._v(e._s(e.message.confirm.remove))]
                      ),
                      e._v(" "),
                      e.action.haveRemoveEffect && e.deleteEffectMessage
                        ? n("el-alert", {
                            attrs: {
                              title: "",
                              type: "warning",
                              description: e.deleteEffectMessage,
                              "show-icon": "",
                              closable: !1,
                            },
                          })
                        : e._e(),
                      e._v(" "),
                      e.hasApplyGloballyDeletion
                        ? n(
                            "div",
                            { staticClass: "align-left" },
                            [
                              n(
                                "el-button",
                                {
                                  attrs: { size: "small", type: "primary" },
                                  on: {
                                    click: function (t) {
                                      return e.deleteEntity(!1);
                                    },
                                  },
                                },
                                [
                                  e._v(
                                    "\n              " +
                                      e._s(e.getConfirmDeleteButtonText().no) +
                                      "\n            "
                                  ),
                                ]
                              ),
                              e._v(" "),
                              n(
                                "el-button",
                                {
                                  attrs: { size: "small", type: "primary" },
                                  on: {
                                    click: function (t) {
                                      return e.deleteEntity(!0);
                                    },
                                  },
                                },
                                [
                                  e._v(
                                    "\n              " +
                                      e._s(e.getConfirmDeleteButtonText().yes) +
                                      "\n            "
                                  ),
                                ]
                              ),
                            ],
                            1
                          )
                        : n(
                            "div",
                            { staticClass: "align-left" },
                            [
                              e.allowedDelete
                                ? n(
                                    "el-button",
                                    {
                                      attrs: { size: "small" },
                                      on: {
                                        click: function (t) {
                                          e.showDeleteConfirmation =
                                            !e.showDeleteConfirmation;
                                        },
                                      },
                                    },
                                    [
                                      e._v(
                                        "\n              " +
                                          e._s(e.$root.labels.cancel) +
                                          "\n            "
                                      ),
                                    ]
                                  )
                                : e._e(),
                              e._v(" "),
                              e.allowedDelete
                                ? n(
                                    "el-button",
                                    {
                                      attrs: { size: "small", type: "primary" },
                                      on: {
                                        click: function (t) {
                                          return e.deleteEntity(!1);
                                        },
                                      },
                                    },
                                    [
                                      e._v(
                                        "\n              " +
                                          e._s(e.$root.labels.delete) +
                                          "\n            "
                                      ),
                                    ]
                                  )
                                : e._e(),
                              e._v(" "),
                              e.allowedDelete
                                ? e._e()
                                : n(
                                    "el-button",
                                    {
                                      attrs: { size: "small" },
                                      on: {
                                        click: function (t) {
                                          e.showDeleteConfirmation =
                                            !e.showDeleteConfirmation;
                                        },
                                      },
                                    },
                                    [
                                      e._v(
                                        "\n              " +
                                          e._s(e.$root.labels.close) +
                                          "\n            "
                                      ),
                                    ]
                                  ),
                            ],
                            1
                          ),
                    ],
                    1
                  ),
                ]),
                e._v(" "),
                n("transition", { attrs: { name: "slide-vertical" } }, [
                  e.status
                    ? n(
                        "div",
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value: e.showVisibilityConfirmation,
                              expression: "showVisibilityConfirmation",
                            },
                          ],
                          staticClass: "am-dialog-confirmation",
                        },
                        [
                          e.isStatusOn()
                            ? n("h3", [e._v(e._s(e.message.confirm.hide))])
                            : e.isStatusOff()
                            ? n("h3", [e._v(e._s(e.message.confirm.show))])
                            : e._e(),
                          e._v(" "),
                          e.hasApplyGloballyVisibility
                            ? n(
                                "div",
                                { staticClass: "align-left" },
                                [
                                  e.isStatusOn()
                                    ? n(
                                        "el-button",
                                        {
                                          attrs: {
                                            size: "small",
                                            type: "primary",
                                          },
                                          on: {
                                            click: function (t) {
                                              return e.hideEntity(!1);
                                            },
                                          },
                                        },
                                        [
                                          e._v(
                                            "\n              " +
                                              e._s(
                                                e.getConfirmStatusButtonText()
                                                  .no
                                              ) +
                                              "\n            "
                                          ),
                                        ]
                                      )
                                    : e._e(),
                                  e._v(" "),
                                  e.isStatusOn()
                                    ? n(
                                        "el-button",
                                        {
                                          attrs: {
                                            size: "small",
                                            type: "primary",
                                          },
                                          on: {
                                            click: function (t) {
                                              return e.hideEntity(!0);
                                            },
                                          },
                                        },
                                        [
                                          e._v(
                                            "\n              " +
                                              e._s(
                                                e.getConfirmStatusButtonText()
                                                  .yes
                                              ) +
                                              "\n            "
                                          ),
                                        ]
                                      )
                                    : e._e(),
                                  e._v(" "),
                                  e.isStatusOff()
                                    ? n(
                                        "el-button",
                                        {
                                          attrs: {
                                            size: "small",
                                            type: "primary",
                                          },
                                          on: {
                                            click: function (t) {
                                              return e.showEntity(!1);
                                            },
                                          },
                                        },
                                        [
                                          e._v(
                                            "\n              " +
                                              e._s(
                                                e.getConfirmStatusButtonText()
                                                  .no
                                              ) +
                                              "\n            "
                                          ),
                                        ]
                                      )
                                    : e._e(),
                                  e._v(" "),
                                  e.isStatusOff()
                                    ? n(
                                        "el-button",
                                        {
                                          attrs: {
                                            size: "small",
                                            type: "primary",
                                          },
                                          on: {
                                            click: function (t) {
                                              return e.showEntity(!0);
                                            },
                                          },
                                        },
                                        [
                                          e._v(
                                            "\n              " +
                                              e._s(
                                                e.getConfirmStatusButtonText()
                                                  .yes
                                              ) +
                                              "\n            "
                                          ),
                                        ]
                                      )
                                    : e._e(),
                                ],
                                1
                              )
                            : n(
                                "div",
                                { staticClass: "align-left" },
                                [
                                  n(
                                    "el-button",
                                    {
                                      attrs: { size: "small" },
                                      on: {
                                        click: function (t) {
                                          e.showVisibilityConfirmation =
                                            !e.showVisibilityConfirmation;
                                        },
                                      },
                                    },
                                    [
                                      e._v(
                                        "\n              " +
                                          e._s(e.$root.labels.cancel) +
                                          "\n            "
                                      ),
                                    ]
                                  ),
                                  e._v(" "),
                                  e.isStatusOn()
                                    ? n(
                                        "el-button",
                                        {
                                          attrs: {
                                            size: "small",
                                            type: "primary",
                                          },
                                          on: {
                                            click: function (t) {
                                              return e.hideEntity(!1);
                                            },
                                          },
                                        },
                                        [
                                          e._v(
                                            "\n              " +
                                              e._s(
                                                e.getConfirmStatusButtonText()
                                                  .yes
                                              ) +
                                              "\n            "
                                          ),
                                        ]
                                      )
                                    : e._e(),
                                  e._v(" "),
                                  e.isStatusOff()
                                    ? n(
                                        "el-button",
                                        {
                                          attrs: {
                                            size: "small",
                                            type: "primary",
                                          },
                                          on: {
                                            click: function (t) {
                                              return e.showEntity(!1);
                                            },
                                          },
                                        },
                                        [
                                          e._v(
                                            "\n              " +
                                              e._s(
                                                e.getConfirmStatusButtonText()
                                                  .yes
                                              ) +
                                              "\n            "
                                          ),
                                        ]
                                      )
                                    : e._e(),
                                ],
                                1
                              ),
                        ]
                      )
                    : e._e(),
                ]),
                e._v(" "),
                n("transition", { attrs: { name: "slide-vertical" } }, [
                  n(
                    "div",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: e.showDuplicateConfirmation,
                          expression: "showDuplicateConfirmation",
                        },
                      ],
                      staticClass: "am-dialog-confirmation",
                    },
                    [
                      n("h3", [e._v(e._s(e.message.confirm.duplicate))]),
                      e._v(" "),
                      n(
                        "div",
                        { staticClass: "align-left" },
                        [
                          n(
                            "el-button",
                            {
                              attrs: { size: "small" },
                              on: {
                                click: function (t) {
                                  e.showDuplicateConfirmation =
                                    !e.showDuplicateConfirmation;
                                },
                              },
                            },
                            [
                              e._v(
                                "\n              " +
                                  e._s(e.$root.labels.cancel) +
                                  "\n            "
                              ),
                            ]
                          ),
                          e._v(" "),
                          n(
                            "el-button",
                            {
                              attrs: { size: "small", type: "primary" },
                              on: { click: e.duplicateEntity },
                            },
                            [
                              e._v(
                                "\n              " +
                                  e._s(e.$root.labels.duplicate) +
                                  "\n            "
                              ),
                            ]
                          ),
                        ],
                        1
                      ),
                    ]
                  ),
                ]),
                e._v(" "),
                n("transition", { attrs: { name: "slide-vertical" } }, [
                  n(
                    "div",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: e.showSaveConfirmation,
                          expression: "showSaveConfirmation",
                        },
                      ],
                      staticClass: "am-dialog-confirmation",
                    },
                    [
                      e.buttonText
                        ? n("h3", [e._v(e._s(e.message.confirm.save))])
                        : e._e(),
                      e._v(" "),
                      e.buttonText
                        ? n(
                            "div",
                            { staticClass: "align-left" },
                            [
                              n(
                                "el-button",
                                {
                                  attrs: { type: "primary", size: "small" },
                                  on: {
                                    click: function (t) {
                                      return e.onSubmit(!1);
                                    },
                                  },
                                },
                                [
                                  e._v(
                                    "\n              " +
                                      e._s(e.getConfirmSaveButtonText().no) +
                                      "\n            "
                                  ),
                                ]
                              ),
                              e._v(" "),
                              n(
                                "el-button",
                                {
                                  attrs: { type: "primary", size: "small" },
                                  on: {
                                    click: function (t) {
                                      return e.onSubmit(!0);
                                    },
                                  },
                                },
                                [
                                  e._v(
                                    "\n              " +
                                      e._s(e.getConfirmSaveButtonText().yes) +
                                      "\n            "
                                  ),
                                ]
                              ),
                            ],
                            1
                          )
                        : e._e(),
                      e._v(" "),
                      e.action.haveSaveWarning
                        ? n("el-alert", {
                            staticStyle: { "word-break": "break-word" },
                            attrs: {
                              title: "",
                              type: "warning",
                              description: e.message.confirm.save,
                              "show-icon": "",
                              closable: !1,
                            },
                          })
                        : e._e(),
                    ],
                    1
                  ),
                ]),
                e._v(" "),
                e.isNew
                  ? n(
                      "el-row",
                      [
                        n(
                          "el-col",
                          { staticClass: "align-right", attrs: { sm: 24 } },
                          [
                            n(
                              "el-button",
                              {
                                attrs: { type: "" },
                                on: { click: e.closeDialog },
                              },
                              [
                                e._v(
                                  "\n            " +
                                    e._s(e.$root.labels.cancel) +
                                    "\n          "
                                ),
                              ]
                            ),
                            e._v(" "),
                            e.action.haveAdd && e.action.haveEdit
                              ? n(
                                  "el-button",
                                  {
                                    staticClass: "am-dialog-create",
                                    attrs: { type: "primary" },
                                    on: { click: e.handleSaveClick },
                                  },
                                  [
                                    e._v(
                                      "\n            " +
                                        e._s(e.$root.labels.save) +
                                        "\n          "
                                    ),
                                  ]
                                )
                              : e._e(),
                          ],
                          1
                        ),
                      ],
                      1
                    )
                  : n(
                      "el-row",
                      [
                        n(
                          "el-col",
                          { staticClass: "align-left", attrs: { sm: 16 } },
                          [
                            e.action.haveDuplicate
                              ? n(
                                  "el-button",
                                  {
                                    class: {
                                      "am-button-icon": e.hasIcons,
                                      "am-dialog-create": !e.hasIcons,
                                    },
                                    attrs: {
                                      type: e.getButtonType("duplicate"),
                                    },
                                    on: {
                                      click: e.handleDuplicateConfirmation,
                                    },
                                  },
                                  [
                                    e.hasIcons
                                      ? n("img", {
                                          staticClass: "svg",
                                          attrs: {
                                            alt: e.$root.labels.duplicate,
                                            src:
                                              e.$root.getUrl +
                                              "public/img/copy.svg",
                                          },
                                        })
                                      : n("span", [
                                          e._v(
                                            e._s(
                                              e.getActionDuplicateButtonText()
                                            )
                                          ),
                                        ]),
                                  ]
                                )
                              : e._e(),
                            e._v(" "),
                            e.action.haveStatus
                              ? n(
                                  "el-button",
                                  {
                                    class: {
                                      "am-button-icon": e.hasIcons,
                                      "am-dialog-create": !e.hasIcons,
                                    },
                                    attrs: { type: e.getButtonType("status") },
                                    on: {
                                      click: e.handleVisibilityConfirmation,
                                    },
                                  },
                                  [
                                    e.hasIcons
                                      ? n("img", {
                                          staticClass: "svg",
                                          attrs: {
                                            alt: e.$root.labels.hide,
                                            src:
                                              e.$root.getUrl +
                                              (e.isStatusOff()
                                                ? "public/img/unhide.svg"
                                                : "public/img/hide.svg"),
                                          },
                                        })
                                      : n("span", [
                                          e._v(
                                            e._s(e.getActionStatusButtonText())
                                          ),
                                        ]),
                                  ]
                                )
                              : e._e(),
                            e._v(" "),
                            e.action.haveRemove
                              ? n(
                                  "el-button",
                                  {
                                    class: {
                                      "am-button-icon": e.hasIcons,
                                      "am-dialog-create": !e.hasIcons,
                                    },
                                    attrs: { type: e.getButtonType("remove") },
                                    on: { click: e.handleDeleteConfirmation },
                                  },
                                  [
                                    e.hasIcons
                                      ? n("img", {
                                          staticClass: "svg",
                                          attrs: {
                                            alt: e.$root.labels.delete,
                                            src:
                                              e.$root.getUrl +
                                              "public/img/delete.svg",
                                          },
                                        })
                                      : n("span", [
                                          e._v(
                                            e._s(e.getActionRemoveButtonText())
                                          ),
                                        ]),
                                  ]
                                )
                              : e._e(),
                          ],
                          1
                        ),
                        e._v(" "),
                        n(
                          "el-col",
                          {
                            staticClass: "align-right",
                            attrs: {
                              sm:
                                !1 === e.action.haveRemove &&
                                !1 === e.action.haveStatus &&
                                !1 === e.action.haveDuplicate
                                  ? 24
                                  : 8,
                            },
                          },
                          [
                            e.action.haveAdd && e.action.haveEdit
                              ? n(
                                  "el-button",
                                  {
                                    staticClass: "am-dialog-create",
                                    attrs: { type: "primary" },
                                    on: { click: e.handleSaveClick },
                                  },
                                  [
                                    e._v(
                                      "\n            " +
                                        e._s(e.$root.labels.save) +
                                        "\n          "
                                    ),
                                  ]
                                )
                              : e._e(),
                          ],
                          1
                        ),
                      ],
                      1
                    ),
              ],
              1
            ),
          ]),
          e._v(" "),
          n(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: e.dialogLoading,
                  expression: "dialogLoading",
                },
              ],
              staticClass: "am-dialog-loader",
            },
            [
              n("div", { staticClass: "am-dialog-loader-content" }, [
                n("img", {
                  attrs: { src: e.$root.getUrl + "public/img/spinner.svg" },
                }),
                e._v(" "),
                n("p", [e._v(e._s(e.$root.labels.loader_message))]),
              ]),
            ]
          ),
        ]);
      },
      staticRenderFns: [],
    };
  },
  755: function (e, t, n) {
    var o;
    (o = function () {
      return (function (e) {
        function t(o) {
          if (n[o]) return n[o].exports;
          var i = (n[o] = { i: o, l: !1, exports: {} });
          return e[o].call(i.exports, i, i.exports, t), (i.l = !0), i.exports;
        }
        var n = {};
        return (
          (t.m = e),
          (t.c = n),
          (t.i = function (e) {
            return e;
          }),
          (t.d = function (e, n, o) {
            t.o(e, n) ||
              Object.defineProperty(e, n, {
                configurable: !1,
                enumerable: !0,
                get: o,
              });
          }),
          (t.n = function (e) {
            var n =
              e && e.__esModule
                ? function () {
                    return e.default;
                  }
                : function () {
                    return e;
                  };
            return t.d(n, "a", n), n;
          }),
          (t.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t);
          }),
          (t.p = "."),
          t((t.s = 9))
        );
      })([
        function (e, t, n) {
          "use strict";
          t.a = {
            prefix: "",
            suffix: "",
            thousands: ",",
            decimal: ".",
            precision: 2,
          };
        },
        function (e, t, n) {
          "use strict";
          var o = n(2),
            i = n(5),
            a = n(0);
          t.a = function (e, t) {
            if (t.value) {
              var s = n.i(i.a)(a.a, t.value);
              if ("INPUT" !== e.tagName.toLocaleUpperCase()) {
                var r = e.getElementsByTagName("input");
                1 !== r.length || (e = r[0]);
              }
              (e.oninput = function () {
                var t = e.value.length - e.selectionEnd;
                (e.value = n.i(o.a)(e.value, s)),
                  (t = Math.max(t, s.suffix.length)),
                  (t = e.value.length - t),
                  (t = Math.max(t, s.prefix.length + 1)),
                  n.i(o.b)(e, t),
                  e.dispatchEvent(n.i(o.c)("change"));
              }),
                (e.onfocus = function () {
                  n.i(o.b)(e, e.value.length - s.suffix.length);
                }),
                e.oninput(),
                e.dispatchEvent(n.i(o.c)("input"));
            }
          };
        },
        function (e, t, n) {
          "use strict";
          function o(e) {
            var t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : d.a;
            "number" == typeof e && (e = e.toFixed(s(t.precision)));
            var n = e.indexOf("-") >= 0 ? "-" : "",
              o = l(r(a(e), t.precision)).split("."),
              i = o[0],
              c = o[1];
            return (
              (i = (function (e, t) {
                return e.replace(/(\d)(?=(?:\d{3})+\b)/gm, "$1" + t);
              })(i, t.thousands)),
              t.prefix +
                n +
                (function (e, t, n) {
                  return t ? e + n + t : e;
                })(i, c, t.decimal) +
                t.suffix
            );
          }
          function i(e, t) {
            var n = e.indexOf("-") >= 0 ? -1 : 1,
              o = r(a(e), t);
            return parseFloat(o) * n;
          }
          function a(e) {
            return l(e).replace(/\D+/g, "") || "0";
          }
          function s(e) {
            return (function (e, t, n) {
              return Math.max(e, Math.min(t, n));
            })(0, e, 20);
          }
          function r(e, t) {
            var n = Math.pow(10, t);
            return (parseFloat(e) / n).toFixed(s(t));
          }
          function l(e) {
            return e ? e.toString() : "";
          }
          function c(e, t) {
            var n = function () {
              e.setSelectionRange(t, t);
            };
            e === document.activeElement && (n(), setTimeout(n, 1));
          }
          function u(e) {
            var t = document.createEvent("Event");
            return t.initEvent(e, !0, !0), t;
          }
          var d = n(0);
          n.d(t, "a", function () {
            return o;
          }),
            n.d(t, "d", function () {
              return i;
            }),
            n.d(t, "b", function () {
              return c;
            }),
            n.d(t, "c", function () {
              return u;
            });
        },
        function (e, t, n) {
          "use strict";
          function o(e, t) {
            t &&
              Object.keys(t).map(function (e) {
                r.a[e] = t[e];
              }),
              e.directive("money", s.a),
              e.component("money", a.a);
          }
          Object.defineProperty(t, "__esModule", { value: !0 });
          var i = n(6),
            a = n.n(i),
            s = n(1),
            r = n(0);
          n.d(t, "Money", function () {
            return a.a;
          }),
            n.d(t, "VMoney", function () {
              return s.a;
            }),
            n.d(t, "options", function () {
              return r.a;
            }),
            n.d(t, "VERSION", function () {
              return l;
            });
          var l = "0.8.1";
          (t.default = o),
            "undefined" != typeof window && window.Vue && window.Vue.use(o);
        },
        function (e, t, n) {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
          var o = n(1),
            i = n(0),
            a = n(2);
          t.default = {
            name: "Money",
            props: {
              value: { required: !0, type: [Number, String], default: 0 },
              masked: { type: Boolean, default: !1 },
              precision: {
                type: Number,
                default: function () {
                  return i.a.precision;
                },
              },
              decimal: {
                type: String,
                default: function () {
                  return i.a.decimal;
                },
              },
              thousands: {
                type: String,
                default: function () {
                  return i.a.thousands;
                },
              },
              prefix: {
                type: String,
                default: function () {
                  return i.a.prefix;
                },
              },
              suffix: {
                type: String,
                default: function () {
                  return i.a.suffix;
                },
              },
            },
            directives: { money: o.a },
            data: function () {
              return { formattedValue: "" };
            },
            watch: {
              value: {
                immediate: !0,
                handler: function (e, t) {
                  var o = n.i(a.a)(e, this.$props);
                  o !== this.formattedValue && (this.formattedValue = o);
                },
              },
            },
            methods: {
              change: function (e) {
                this.$emit(
                  "input",
                  this.masked
                    ? e.target.value
                    : n.i(a.d)(e.target.value, this.precision)
                );
              },
            },
          };
        },
        function (e, t, n) {
          "use strict";
          t.a = function (e, t) {
            return (
              (e = e || {}),
              (t = t || {}),
              Object.keys(e)
                .concat(Object.keys(t))
                .reduce(function (n, o) {
                  return (n[o] = void 0 === t[o] ? e[o] : t[o]), n;
                }, {})
            );
          };
        },
        function (e, t, n) {
          var o = n(7)(n(4), n(8), null, null);
          e.exports = o.exports;
        },
        function (e, t) {
          e.exports = function (e, t, n, o) {
            var i,
              a = (e = e || {}),
              s = typeof e.default;
            ("object" !== s && "function" !== s) || ((i = e), (a = e.default));
            var r = "function" == typeof a ? a.options : a;
            if (
              (t &&
                ((r.render = t.render),
                (r.staticRenderFns = t.staticRenderFns)),
              n && (r._scopeId = n),
              o)
            ) {
              var l = r.computed || (r.computed = {});
              Object.keys(o).forEach(function (e) {
                var t = o[e];
                l[e] = function () {
                  return t;
                };
              });
            }
            return { esModule: i, exports: a, options: r };
          };
        },
        function (e, t) {
          e.exports = {
            render: function () {
              var e = this,
                t = e.$createElement;
              return (e._self._c || t)("input", {
                directives: [
                  {
                    name: "money",
                    rawName: "v-money",
                    value: {
                      precision: e.precision,
                      decimal: e.decimal,
                      thousands: e.thousands,
                      prefix: e.prefix,
                      suffix: e.suffix,
                    },
                    expression:
                      "{precision, decimal, thousands, prefix, suffix}",
                  },
                ],
                staticClass: "v-money",
                attrs: { type: "tel" },
                domProps: { value: e.formattedValue },
                on: { change: e.change },
              });
            },
            staticRenderFns: [],
          };
        },
        function (e, t, n) {
          e.exports = n(3);
        },
      ]);
    }),
      (e.exports = o());
  },
  757: function (e, t, n) {
    "use strict";
    t.a = {
      data: function () {
        return {};
      },
      methods: {
        getPaymentData: function (e, t, n, o) {
          var i = {};
          if (((i.paymentId = e), t)) {
            (i.bookableType = "appointment"),
              (i.bookings = t.bookings),
              (i.bookingStart = t.bookingStart),
              (i.bookableName = this.getServiceById(t.serviceId).name);
            var a = this.getProviderById(t.providerId);
            (a.fullName = a.firstName + " " + a.lastName),
              (i.providers = [a]),
              t.bookings.forEach(function (t) {
                t.payments.forEach(function (n) {
                  n.id === e && (i.customer = t.customer);
                });
              });
          }
          return (
            n &&
              ((i.bookableType = "event"),
              (i.bookings = n.bookings),
              (i.bookingStart = n.periods[0].periodStart),
              (i.bookableName = n.name),
              (i.providers = n.providers),
              n.bookings.forEach(function (t) {
                t.payments.forEach(function (n) {
                  n.id === e && (i.customer = t.customer);
                });
              })),
            o &&
              ((i.bookableType = "package"),
              (i.bookings = []),
              (i.bookingStart = null),
              (i.bookableName = o.name),
              (i.providers = []),
              (i.bookings = [])),
            i
          );
        },
        getPaymentGatewayNiceName: function (e) {
          return "onSite" === e.gateway
            ? this.$root.labels.on_site
            : "wc" === e.gateway
            ? e.gatewayTitle
            : e.gateway
            ? e.gateway.charAt(0).toUpperCase() + e.gateway.slice(1)
            : void 0;
        },
      },
    };
  },
  789: function (e, t, n) {
    "use strict";
    t.a = {
      data: function () {
        return {};
      },
      methods: {
        getAppointmentService: function (e) {
          var t = this.getProviderById(e.providerId).serviceList.find(function (
            t
          ) {
            return t.id === e.serviceId;
          });
          return t || this.getServiceById(e.serviceId);
        },
        getAppointmentPrice: function (e, t, n, o) {
          var i = 0,
            a = this,
            s = parseInt(e) !== parseInt(t.id);
          return (
            n.forEach(function (e) {
              e.payments.forEach(function () {
                ["approved", "pending"].includes(e.status) &&
                  (i += a.getBookingPrice(
                    e,
                    s,
                    s ? t.price : e.price,
                    e.aggregatedPrice
                  ));
              }),
                0 !== e.payments.length ||
                  o ||
                  (i += a.getBookingPrice(e, !0, t.price, t.aggregatedPrice));
            }),
            this.getFormattedPrice(
              i >= 0 ? i : 0,
              !this.$root.settings.payments.hideCurrencySymbolFrontend
            )
          );
        },
        getBookingPrice: function (e, t, n, o) {
          var i = 0;
          e.extras.forEach(function (t) {
            if (void 0 === t.selected || !0 === t.selected) {
              var n = null === t.aggregatedPrice ? o : t.aggregatedPrice;
              i += t.price * t.quantity * (n ? e.persons : 1);
            }
          });
          var a = (t ? n : e.price) * (o ? e.persons : 1) + i;
          return (
            a -
            ((a / 100) * (e.coupon ? e.coupon.discount : 0) +
              (e.coupon ? e.coupon.deduction : 0))
          );
        },
      },
    };
  },
  791: function (e, t, n) {
    var o;
    "undefined" != typeof self && self,
      (o = function (e) {
        return (function (e) {
          var t = {};
          function n(o) {
            if (t[o]) return t[o].exports;
            var i = (t[o] = { i: o, l: !1, exports: {} });
            return e[o].call(i.exports, i, i.exports, n), (i.l = !0), i.exports;
          }
          return (
            (n.m = e),
            (n.c = t),
            (n.d = function (e, t, o) {
              n.o(e, t) ||
                Object.defineProperty(e, t, { enumerable: !0, get: o });
            }),
            (n.r = function (e) {
              "undefined" != typeof Symbol &&
                Symbol.toStringTag &&
                Object.defineProperty(e, Symbol.toStringTag, {
                  value: "Module",
                }),
                Object.defineProperty(e, "__esModule", { value: !0 });
            }),
            (n.t = function (e, t) {
              if ((1 & t && (e = n(e)), 8 & t)) return e;
              if (4 & t && "object" == typeof e && e && e.__esModule) return e;
              var o = Object.create(null);
              if (
                (n.r(o),
                Object.defineProperty(o, "default", {
                  enumerable: !0,
                  value: e,
                }),
                2 & t && "string" != typeof e)
              )
                for (var i in e)
                  n.d(
                    o,
                    i,
                    function (t) {
                      return e[t];
                    }.bind(null, i)
                  );
              return o;
            }),
            (n.n = function (e) {
              var t =
                e && e.__esModule
                  ? function () {
                      return e.default;
                    }
                  : function () {
                      return e;
                    };
              return n.d(t, "a", t), t;
            }),
            (n.o = function (e, t) {
              return Object.prototype.hasOwnProperty.call(e, t);
            }),
            (n.p = ""),
            n((n.s = "fb15"))
          );
        })({
          "02f4": function (e, t, n) {
            var o = n("4588"),
              i = n("be13");
            e.exports = function (e) {
              return function (t, n) {
                var a,
                  s,
                  r = String(i(t)),
                  l = o(n),
                  c = r.length;
                return l < 0 || l >= c
                  ? e
                    ? ""
                    : void 0
                  : (a = r.charCodeAt(l)) < 55296 ||
                    a > 56319 ||
                    l + 1 === c ||
                    (s = r.charCodeAt(l + 1)) < 56320 ||
                    s > 57343
                  ? e
                    ? r.charAt(l)
                    : a
                  : e
                  ? r.slice(l, l + 2)
                  : s - 56320 + ((a - 55296) << 10) + 65536;
              };
            };
          },
          "0390": function (e, t, n) {
            "use strict";
            var o = n("02f4")(!0);
            e.exports = function (e, t, n) {
              return t + (n ? o(e, t).length : 1);
            };
          },
          "07e3": function (e, t) {
            var n = {}.hasOwnProperty;
            e.exports = function (e, t) {
              return n.call(e, t);
            };
          },
          "0bfb": function (e, t, n) {
            "use strict";
            var o = n("cb7c");
            e.exports = function () {
              var e = o(this),
                t = "";
              return (
                e.global && (t += "g"),
                e.ignoreCase && (t += "i"),
                e.multiline && (t += "m"),
                e.unicode && (t += "u"),
                e.sticky && (t += "y"),
                t
              );
            };
          },
          "0fc9": function (e, t, n) {
            var o = n("3a38"),
              i = Math.max,
              a = Math.min;
            e.exports = function (e, t) {
              return (e = o(e)) < 0 ? i(e + t, 0) : a(e, t);
            };
          },
          1654: function (e, t, n) {
            "use strict";
            var o = n("71c1")(!0);
            n("30f1")(
              String,
              "String",
              function (e) {
                (this._t = String(e)), (this._i = 0);
              },
              function () {
                var e,
                  t = this._t,
                  n = this._i;
                return n >= t.length
                  ? { value: void 0, done: !0 }
                  : ((e = o(t, n)),
                    (this._i += e.length),
                    { value: e, done: !1 });
              }
            );
          },
          1691: function (e, t) {
            e.exports =
              "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(
                ","
              );
          },
          "1af6": function (e, t, n) {
            var o = n("63b6");
            o(o.S, "Array", { isArray: n("9003") });
          },
          "1bc3": function (e, t, n) {
            var o = n("f772");
            e.exports = function (e, t) {
              if (!o(e)) return e;
              var n, i;
              if (
                t &&
                "function" == typeof (n = e.toString) &&
                !o((i = n.call(e)))
              )
                return i;
              if ("function" == typeof (n = e.valueOf) && !o((i = n.call(e))))
                return i;
              if (
                !t &&
                "function" == typeof (n = e.toString) &&
                !o((i = n.call(e)))
              )
                return i;
              throw TypeError("Can't convert object to primitive value");
            };
          },
          "1ec9": function (e, t, n) {
            var o = n("f772"),
              i = n("e53d").document,
              a = o(i) && o(i.createElement);
            e.exports = function (e) {
              return a ? i.createElement(e) : {};
            };
          },
          "20fd": function (e, t, n) {
            "use strict";
            var o = n("d9f6"),
              i = n("aebd");
            e.exports = function (e, t, n) {
              t in e ? o.f(e, t, i(0, n)) : (e[t] = n);
            };
          },
          "214f": function (e, t, n) {
            "use strict";
            n("b0c5");
            var o = n("2aba"),
              i = n("32e9"),
              a = n("79e5"),
              s = n("be13"),
              r = n("2b4c"),
              l = n("520a"),
              c = r("species"),
              u = !a(function () {
                var e = /./;
                return (
                  (e.exec = function () {
                    var e = [];
                    return (e.groups = { a: "7" }), e;
                  }),
                  "7" !== "".replace(e, "$<a>")
                );
              }),
              d = (function () {
                var e = /(?:)/,
                  t = e.exec;
                e.exec = function () {
                  return t.apply(this, arguments);
                };
                var n = "ab".split(e);
                return 2 === n.length && "a" === n[0] && "b" === n[1];
              })();
            e.exports = function (e, t, n) {
              var m = r(e),
                p = !a(function () {
                  var t = {};
                  return (
                    (t[m] = function () {
                      return 7;
                    }),
                    7 != ""[e](t)
                  );
                }),
                h = p
                  ? !a(function () {
                      var t = !1,
                        n = /a/;
                      return (
                        (n.exec = function () {
                          return (t = !0), null;
                        }),
                        "split" === e &&
                          ((n.constructor = {}),
                          (n.constructor[c] = function () {
                            return n;
                          })),
                        n[m](""),
                        !t
                      );
                    })
                  : void 0;
              if (
                !p ||
                !h ||
                ("replace" === e && !u) ||
                ("split" === e && !d)
              ) {
                var f = /./[m],
                  g = n(s, m, ""[e], function (e, t, n, o, i) {
                    return t.exec === l
                      ? p && !i
                        ? { done: !0, value: f.call(t, n, o) }
                        : { done: !0, value: e.call(n, t, o) }
                      : { done: !1 };
                  }),
                  v = g[0],
                  b = g[1];
                o(String.prototype, e, v),
                  i(
                    RegExp.prototype,
                    m,
                    2 == t
                      ? function (e, t) {
                          return b.call(e, this, t);
                        }
                      : function (e) {
                          return b.call(e, this);
                        }
                  );
              }
            };
          },
          "230e": function (e, t, n) {
            var o = n("d3f4"),
              i = n("7726").document,
              a = o(i) && o(i.createElement);
            e.exports = function (e) {
              return a ? i.createElement(e) : {};
            };
          },
          "23c6": function (e, t, n) {
            var o = n("2d95"),
              i = n("2b4c")("toStringTag"),
              a =
                "Arguments" ==
                o(
                  (function () {
                    return arguments;
                  })()
                );
            e.exports = function (e) {
              var t, n, s;
              return void 0 === e
                ? "Undefined"
                : null === e
                ? "Null"
                : "string" ==
                  typeof (n = (function (e, t) {
                    try {
                      return e[t];
                    } catch (e) {}
                  })((t = Object(e)), i))
                ? n
                : a
                ? o(t)
                : "Object" == (s = o(t)) && "function" == typeof t.callee
                ? "Arguments"
                : s;
            };
          },
          "241e": function (e, t, n) {
            var o = n("25eb");
            e.exports = function (e) {
              return Object(o(e));
            };
          },
          "25eb": function (e, t) {
            e.exports = function (e) {
              if (void 0 == e) throw TypeError("Can't call method on  " + e);
              return e;
            };
          },
          "294c": function (e, t) {
            e.exports = function (e) {
              try {
                return !!e();
              } catch (e) {
                return !0;
              }
            };
          },
          "2aba": function (e, t, n) {
            var o = n("7726"),
              i = n("32e9"),
              a = n("69a8"),
              s = n("ca5a")("src"),
              r = n("fa5b"),
              l = "toString",
              c = ("" + r).split(l);
            (n("8378").inspectSource = function (e) {
              return r.call(e);
            }),
              (e.exports = function (e, t, n, r) {
                var l = "function" == typeof n;
                l && (a(n, "name") || i(n, "name", t)),
                  e[t] !== n &&
                    (l &&
                      (a(n, s) ||
                        i(n, s, e[t] ? "" + e[t] : c.join(String(t)))),
                    e === o
                      ? (e[t] = n)
                      : r
                      ? e[t]
                        ? (e[t] = n)
                        : i(e, t, n)
                      : (delete e[t], i(e, t, n)));
              })(Function.prototype, l, function () {
                return ("function" == typeof this && this[s]) || r.call(this);
              });
          },
          "2b4c": function (e, t, n) {
            var o = n("5537")("wks"),
              i = n("ca5a"),
              a = n("7726").Symbol,
              s = "function" == typeof a;
            (e.exports = function (e) {
              return o[e] || (o[e] = (s && a[e]) || (s ? a : i)("Symbol." + e));
            }).store = o;
          },
          "2d00": function (e, t) {
            e.exports = !1;
          },
          "2d95": function (e, t) {
            var n = {}.toString;
            e.exports = function (e) {
              return n.call(e).slice(8, -1);
            };
          },
          "2fdb": function (e, t, n) {
            "use strict";
            var o = n("5ca1"),
              i = n("d2c8"),
              a = "includes";
            o(o.P + o.F * n("5147")(a), "String", {
              includes: function (e) {
                return !!~i(this, e, a).indexOf(
                  e,
                  arguments.length > 1 ? arguments[1] : void 0
                );
              },
            });
          },
          "30f1": function (e, t, n) {
            "use strict";
            var o = n("b8e3"),
              i = n("63b6"),
              a = n("9138"),
              s = n("35e8"),
              r = n("481b"),
              l = n("8f60"),
              c = n("45f2"),
              u = n("53e2"),
              d = n("5168")("iterator"),
              m = !([].keys && "next" in [].keys()),
              p = "keys",
              h = "values",
              f = function () {
                return this;
              };
            e.exports = function (e, t, n, g, v, b, y) {
              l(n, t, g);
              var _,
                C,
                w,
                k = function (e) {
                  if (!m && e in D) return D[e];
                  switch (e) {
                    case p:
                    case h:
                      return function () {
                        return new n(this, e);
                      };
                  }
                  return function () {
                    return new n(this, e);
                  };
                },
                x = t + " Iterator",
                $ = v == h,
                S = !1,
                D = e.prototype,
                T = D[d] || D["@@iterator"] || (v && D[v]),
                E = T || k(v),
                P = v ? ($ ? k("entries") : E) : void 0,
                O = ("Array" == t && D.entries) || T;
              if (
                (O &&
                  (w = u(O.call(new e()))) !== Object.prototype &&
                  w.next &&
                  (c(w, x, !0), o || "function" == typeof w[d] || s(w, d, f)),
                $ &&
                  T &&
                  T.name !== h &&
                  ((S = !0),
                  (E = function () {
                    return T.call(this);
                  })),
                (o && !y) || (!m && !S && D[d]) || s(D, d, E),
                (r[t] = E),
                (r[x] = f),
                v)
              )
                if (
                  ((_ = {
                    values: $ ? E : k(h),
                    keys: b ? E : k(p),
                    entries: P,
                  }),
                  y)
                )
                  for (C in _) C in D || a(D, C, _[C]);
                else i(i.P + i.F * (m || S), t, _);
              return _;
            };
          },
          "32a6": function (e, t, n) {
            var o = n("241e"),
              i = n("c3a1");
            n("ce7e")("keys", function () {
              return function (e) {
                return i(o(e));
              };
            });
          },
          "32e9": function (e, t, n) {
            var o = n("86cc"),
              i = n("4630");
            e.exports = n("9e1e")
              ? function (e, t, n) {
                  return o.f(e, t, i(1, n));
                }
              : function (e, t, n) {
                  return (e[t] = n), e;
                };
          },
          "32fc": function (e, t, n) {
            var o = n("e53d").document;
            e.exports = o && o.documentElement;
          },
          "335c": function (e, t, n) {
            var o = n("6b4c");
            e.exports = Object("z").propertyIsEnumerable(0)
              ? Object
              : function (e) {
                  return "String" == o(e) ? e.split("") : Object(e);
                };
          },
          "355d": function (e, t) {
            t.f = {}.propertyIsEnumerable;
          },
          "35e8": function (e, t, n) {
            var o = n("d9f6"),
              i = n("aebd");
            e.exports = n("8e60")
              ? function (e, t, n) {
                  return o.f(e, t, i(1, n));
                }
              : function (e, t, n) {
                  return (e[t] = n), e;
                };
          },
          "36c3": function (e, t, n) {
            var o = n("335c"),
              i = n("25eb");
            e.exports = function (e) {
              return o(i(e));
            };
          },
          3702: function (e, t, n) {
            var o = n("481b"),
              i = n("5168")("iterator"),
              a = Array.prototype;
            e.exports = function (e) {
              return void 0 !== e && (o.Array === e || a[i] === e);
            };
          },
          "3a38": function (e, t) {
            var n = Math.ceil,
              o = Math.floor;
            e.exports = function (e) {
              return isNaN((e = +e)) ? 0 : (e > 0 ? o : n)(e);
            };
          },
          "40c3": function (e, t, n) {
            var o = n("6b4c"),
              i = n("5168")("toStringTag"),
              a =
                "Arguments" ==
                o(
                  (function () {
                    return arguments;
                  })()
                );
            e.exports = function (e) {
              var t, n, s;
              return void 0 === e
                ? "Undefined"
                : null === e
                ? "Null"
                : "string" ==
                  typeof (n = (function (e, t) {
                    try {
                      return e[t];
                    } catch (e) {}
                  })((t = Object(e)), i))
                ? n
                : a
                ? o(t)
                : "Object" == (s = o(t)) && "function" == typeof t.callee
                ? "Arguments"
                : s;
            };
          },
          4588: function (e, t) {
            var n = Math.ceil,
              o = Math.floor;
            e.exports = function (e) {
              return isNaN((e = +e)) ? 0 : (e > 0 ? o : n)(e);
            };
          },
          "45f2": function (e, t, n) {
            var o = n("d9f6").f,
              i = n("07e3"),
              a = n("5168")("toStringTag");
            e.exports = function (e, t, n) {
              e &&
                !i((e = n ? e : e.prototype), a) &&
                o(e, a, { configurable: !0, value: t });
            };
          },
          4630: function (e, t) {
            e.exports = function (e, t) {
              return {
                enumerable: !(1 & e),
                configurable: !(2 & e),
                writable: !(4 & e),
                value: t,
              };
            };
          },
          "469f": function (e, t, n) {
            n("6c1c"), n("1654"), (e.exports = n("7d7b"));
          },
          "481b": function (e, t) {
            e.exports = {};
          },
          "4aa6": function (e, t, n) {
            e.exports = n("dc62");
          },
          "4bf8": function (e, t, n) {
            var o = n("be13");
            e.exports = function (e) {
              return Object(o(e));
            };
          },
          "4ee1": function (e, t, n) {
            var o = n("5168")("iterator"),
              i = !1;
            try {
              var a = [7][o]();
              (a.return = function () {
                i = !0;
              }),
                Array.from(a, function () {
                  throw 2;
                });
            } catch (e) {}
            e.exports = function (e, t) {
              if (!t && !i) return !1;
              var n = !1;
              try {
                var a = [7],
                  s = a[o]();
                (s.next = function () {
                  return { done: (n = !0) };
                }),
                  (a[o] = function () {
                    return s;
                  }),
                  e(a);
              } catch (e) {}
              return n;
            };
          },
          "50ed": function (e, t) {
            e.exports = function (e, t) {
              return { value: t, done: !!e };
            };
          },
          5147: function (e, t, n) {
            var o = n("2b4c")("match");
            e.exports = function (e) {
              var t = /./;
              try {
                "/./"[e](t);
              } catch (n) {
                try {
                  return (t[o] = !1), !"/./"[e](t);
                } catch (e) {}
              }
              return !0;
            };
          },
          5168: function (e, t, n) {
            var o = n("dbdb")("wks"),
              i = n("62a0"),
              a = n("e53d").Symbol,
              s = "function" == typeof a;
            (e.exports = function (e) {
              return o[e] || (o[e] = (s && a[e]) || (s ? a : i)("Symbol." + e));
            }).store = o;
          },
          5176: function (e, t, n) {
            e.exports = n("51b6");
          },
          "51b6": function (e, t, n) {
            n("a3c3"), (e.exports = n("584a").Object.assign);
          },
          "520a": function (e, t, n) {
            "use strict";
            var o = n("0bfb"),
              i = RegExp.prototype.exec,
              a = String.prototype.replace,
              s = i,
              r = "lastIndex",
              l = (function () {
                var e = /a/,
                  t = /b*/g;
                return i.call(e, "a"), i.call(t, "a"), 0 !== e[r] || 0 !== t[r];
              })(),
              c = void 0 !== /()??/.exec("")[1];
            (l || c) &&
              (s = function (e) {
                var t,
                  n,
                  s,
                  u,
                  d = this;
                return (
                  c && (n = new RegExp("^" + d.source + "$(?!\\s)", o.call(d))),
                  l && (t = d[r]),
                  (s = i.call(d, e)),
                  l && s && (d[r] = d.global ? s.index + s[0].length : t),
                  c &&
                    s &&
                    s.length > 1 &&
                    a.call(s[0], n, function () {
                      for (u = 1; u < arguments.length - 2; u++)
                        void 0 === arguments[u] && (s[u] = void 0);
                    }),
                  s
                );
              }),
              (e.exports = s);
          },
          "53e2": function (e, t, n) {
            var o = n("07e3"),
              i = n("241e"),
              a = n("5559")("IE_PROTO"),
              s = Object.prototype;
            e.exports =
              Object.getPrototypeOf ||
              function (e) {
                return (
                  (e = i(e)),
                  o(e, a)
                    ? e[a]
                    : "function" == typeof e.constructor &&
                      e instanceof e.constructor
                    ? e.constructor.prototype
                    : e instanceof Object
                    ? s
                    : null
                );
              };
          },
          "549b": function (e, t, n) {
            "use strict";
            var o = n("d864"),
              i = n("63b6"),
              a = n("241e"),
              s = n("b0dc"),
              r = n("3702"),
              l = n("b447"),
              c = n("20fd"),
              u = n("7cd6");
            i(
              i.S +
                i.F *
                  !n("4ee1")(function (e) {
                    Array.from(e);
                  }),
              "Array",
              {
                from: function (e) {
                  var t,
                    n,
                    i,
                    d,
                    m = a(e),
                    p = "function" == typeof this ? this : Array,
                    h = arguments.length,
                    f = h > 1 ? arguments[1] : void 0,
                    g = void 0 !== f,
                    v = 0,
                    b = u(m);
                  if (
                    (g && (f = o(f, h > 2 ? arguments[2] : void 0, 2)),
                    void 0 == b || (p == Array && r(b)))
                  )
                    for (n = new p((t = l(m.length))); t > v; v++)
                      c(n, v, g ? f(m[v], v) : m[v]);
                  else
                    for (d = b.call(m), n = new p(); !(i = d.next()).done; v++)
                      c(n, v, g ? s(d, f, [i.value, v], !0) : i.value);
                  return (n.length = v), n;
                },
              }
            );
          },
          "54a1": function (e, t, n) {
            n("6c1c"), n("1654"), (e.exports = n("95d5"));
          },
          5537: function (e, t, n) {
            var o = n("8378"),
              i = n("7726"),
              a = "__core-js_shared__",
              s = i[a] || (i[a] = {});
            (e.exports = function (e, t) {
              return s[e] || (s[e] = void 0 !== t ? t : {});
            })("versions", []).push({
              version: o.version,
              mode: n("2d00") ? "pure" : "global",
              copyright: "© 2019 Denis Pushkarev (zloirock.ru)",
            });
          },
          5559: function (e, t, n) {
            var o = n("dbdb")("keys"),
              i = n("62a0");
            e.exports = function (e) {
              return o[e] || (o[e] = i(e));
            };
          },
          "584a": function (e, t) {
            var n = (e.exports = { version: "2.6.5" });
            "number" == typeof __e && (__e = n);
          },
          "5b4e": function (e, t, n) {
            var o = n("36c3"),
              i = n("b447"),
              a = n("0fc9");
            e.exports = function (e) {
              return function (t, n, s) {
                var r,
                  l = o(t),
                  c = i(l.length),
                  u = a(s, c);
                if (e && n != n) {
                  for (; c > u; ) if ((r = l[u++]) != r) return !0;
                } else
                  for (; c > u; u++)
                    if ((e || u in l) && l[u] === n) return e || u || 0;
                return !e && -1;
              };
            };
          },
          "5ca1": function (e, t, n) {
            var o = n("7726"),
              i = n("8378"),
              a = n("32e9"),
              s = n("2aba"),
              r = n("9b43"),
              l = "prototype",
              c = function (e, t, n) {
                var u,
                  d,
                  m,
                  p,
                  h = e & c.F,
                  f = e & c.G,
                  g = e & c.S,
                  v = e & c.P,
                  b = e & c.B,
                  y = f ? o : g ? o[t] || (o[t] = {}) : (o[t] || {})[l],
                  _ = f ? i : i[t] || (i[t] = {}),
                  C = _[l] || (_[l] = {});
                for (u in (f && (n = t), n))
                  (m = ((d = !h && y && void 0 !== y[u]) ? y : n)[u]),
                    (p =
                      b && d
                        ? r(m, o)
                        : v && "function" == typeof m
                        ? r(Function.call, m)
                        : m),
                    y && s(y, u, m, e & c.U),
                    _[u] != m && a(_, u, p),
                    v && C[u] != m && (C[u] = m);
              };
            (o.core = i),
              (c.F = 1),
              (c.G = 2),
              (c.S = 4),
              (c.P = 8),
              (c.B = 16),
              (c.W = 32),
              (c.U = 64),
              (c.R = 128),
              (e.exports = c);
          },
          "5d73": function (e, t, n) {
            e.exports = n("469f");
          },
          "5f1b": function (e, t, n) {
            "use strict";
            var o = n("23c6"),
              i = RegExp.prototype.exec;
            e.exports = function (e, t) {
              var n = e.exec;
              if ("function" == typeof n) {
                var a = n.call(e, t);
                if ("object" != typeof a)
                  throw new TypeError(
                    "RegExp exec method returned something other than an Object or null"
                  );
                return a;
              }
              if ("RegExp" !== o(e))
                throw new TypeError(
                  "RegExp#exec called on incompatible receiver"
                );
              return i.call(e, t);
            };
          },
          "626a": function (e, t, n) {
            var o = n("2d95");
            e.exports = Object("z").propertyIsEnumerable(0)
              ? Object
              : function (e) {
                  return "String" == o(e) ? e.split("") : Object(e);
                };
          },
          "62a0": function (e, t) {
            var n = 0,
              o = Math.random();
            e.exports = function (e) {
              return "Symbol(".concat(
                void 0 === e ? "" : e,
                ")_",
                (++n + o).toString(36)
              );
            };
          },
          "63b6": function (e, t, n) {
            var o = n("e53d"),
              i = n("584a"),
              a = n("d864"),
              s = n("35e8"),
              r = n("07e3"),
              l = "prototype",
              c = function (e, t, n) {
                var u,
                  d,
                  m,
                  p = e & c.F,
                  h = e & c.G,
                  f = e & c.S,
                  g = e & c.P,
                  v = e & c.B,
                  b = e & c.W,
                  y = h ? i : i[t] || (i[t] = {}),
                  _ = y[l],
                  C = h ? o : f ? o[t] : (o[t] || {})[l];
                for (u in (h && (n = t), n))
                  ((d = !p && C && void 0 !== C[u]) && r(y, u)) ||
                    ((m = d ? C[u] : n[u]),
                    (y[u] =
                      h && "function" != typeof C[u]
                        ? n[u]
                        : v && d
                        ? a(m, o)
                        : b && C[u] == m
                        ? (function (e) {
                            var t = function (t, n, o) {
                              if (this instanceof e) {
                                switch (arguments.length) {
                                  case 0:
                                    return new e();
                                  case 1:
                                    return new e(t);
                                  case 2:
                                    return new e(t, n);
                                }
                                return new e(t, n, o);
                              }
                              return e.apply(this, arguments);
                            };
                            return (t[l] = e[l]), t;
                          })(m)
                        : g && "function" == typeof m
                        ? a(Function.call, m)
                        : m),
                    g &&
                      (((y.virtual || (y.virtual = {}))[u] = m),
                      e & c.R && _ && !_[u] && s(_, u, m)));
              };
            (c.F = 1),
              (c.G = 2),
              (c.S = 4),
              (c.P = 8),
              (c.B = 16),
              (c.W = 32),
              (c.U = 64),
              (c.R = 128),
              (e.exports = c);
          },
          6762: function (e, t, n) {
            "use strict";
            var o = n("5ca1"),
              i = n("c366")(!0);
            o(o.P, "Array", {
              includes: function (e) {
                return i(this, e, arguments.length > 1 ? arguments[1] : void 0);
              },
            }),
              n("9c6c")("includes");
          },
          6821: function (e, t, n) {
            var o = n("626a"),
              i = n("be13");
            e.exports = function (e) {
              return o(i(e));
            };
          },
          "69a8": function (e, t) {
            var n = {}.hasOwnProperty;
            e.exports = function (e, t) {
              return n.call(e, t);
            };
          },
          "6a99": function (e, t, n) {
            var o = n("d3f4");
            e.exports = function (e, t) {
              if (!o(e)) return e;
              var n, i;
              if (
                t &&
                "function" == typeof (n = e.toString) &&
                !o((i = n.call(e)))
              )
                return i;
              if ("function" == typeof (n = e.valueOf) && !o((i = n.call(e))))
                return i;
              if (
                !t &&
                "function" == typeof (n = e.toString) &&
                !o((i = n.call(e)))
              )
                return i;
              throw TypeError("Can't convert object to primitive value");
            };
          },
          "6b4c": function (e, t) {
            var n = {}.toString;
            e.exports = function (e) {
              return n.call(e).slice(8, -1);
            };
          },
          "6c1c": function (e, t, n) {
            n("c367");
            for (
              var o = n("e53d"),
                i = n("35e8"),
                a = n("481b"),
                s = n("5168")("toStringTag"),
                r =
                  "CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(
                    ","
                  ),
                l = 0;
              l < r.length;
              l++
            ) {
              var c = r[l],
                u = o[c],
                d = u && u.prototype;
              d && !d[s] && i(d, s, c), (a[c] = a.Array);
            }
          },
          "71c1": function (e, t, n) {
            var o = n("3a38"),
              i = n("25eb");
            e.exports = function (e) {
              return function (t, n) {
                var a,
                  s,
                  r = String(i(t)),
                  l = o(n),
                  c = r.length;
                return l < 0 || l >= c
                  ? e
                    ? ""
                    : void 0
                  : (a = r.charCodeAt(l)) < 55296 ||
                    a > 56319 ||
                    l + 1 === c ||
                    (s = r.charCodeAt(l + 1)) < 56320 ||
                    s > 57343
                  ? e
                    ? r.charAt(l)
                    : a
                  : e
                  ? r.slice(l, l + 2)
                  : s - 56320 + ((a - 55296) << 10) + 65536;
              };
            };
          },
          7726: function (e, t) {
            var n = (e.exports =
              "undefined" != typeof window && window.Math == Math
                ? window
                : "undefined" != typeof self && self.Math == Math
                ? self
                : Function("return this")());
            "number" == typeof __g && (__g = n);
          },
          "774e": function (e, t, n) {
            e.exports = n("d2d5");
          },
          "77f1": function (e, t, n) {
            var o = n("4588"),
              i = Math.max,
              a = Math.min;
            e.exports = function (e, t) {
              return (e = o(e)) < 0 ? i(e + t, 0) : a(e, t);
            };
          },
          "794b": function (e, t, n) {
            e.exports =
              !n("8e60") &&
              !n("294c")(function () {
                return (
                  7 !=
                  Object.defineProperty(n("1ec9")("div"), "a", {
                    get: function () {
                      return 7;
                    },
                  }).a
                );
              });
          },
          "79aa": function (e, t) {
            e.exports = function (e) {
              if ("function" != typeof e)
                throw TypeError(e + " is not a function!");
              return e;
            };
          },
          "79e5": function (e, t) {
            e.exports = function (e) {
              try {
                return !!e();
              } catch (e) {
                return !0;
              }
            };
          },
          "7cd6": function (e, t, n) {
            var o = n("40c3"),
              i = n("5168")("iterator"),
              a = n("481b");
            e.exports = n("584a").getIteratorMethod = function (e) {
              if (void 0 != e) return e[i] || e["@@iterator"] || a[o(e)];
            };
          },
          "7d7b": function (e, t, n) {
            var o = n("e4ae"),
              i = n("7cd6");
            e.exports = n("584a").getIterator = function (e) {
              var t = i(e);
              if ("function" != typeof t)
                throw TypeError(e + " is not iterable!");
              return o(t.call(e));
            };
          },
          "7e90": function (e, t, n) {
            var o = n("d9f6"),
              i = n("e4ae"),
              a = n("c3a1");
            e.exports = n("8e60")
              ? Object.defineProperties
              : function (e, t) {
                  i(e);
                  for (var n, s = a(t), r = s.length, l = 0; r > l; )
                    o.f(e, (n = s[l++]), t[n]);
                  return e;
                };
          },
          8378: function (e, t) {
            var n = (e.exports = { version: "2.6.5" });
            "number" == typeof __e && (__e = n);
          },
          8436: function (e, t) {
            e.exports = function () {};
          },
          "86cc": function (e, t, n) {
            var o = n("cb7c"),
              i = n("c69a"),
              a = n("6a99"),
              s = Object.defineProperty;
            t.f = n("9e1e")
              ? Object.defineProperty
              : function (e, t, n) {
                  if ((o(e), (t = a(t, !0)), o(n), i))
                    try {
                      return s(e, t, n);
                    } catch (e) {}
                  if ("get" in n || "set" in n)
                    throw TypeError("Accessors not supported!");
                  return "value" in n && (e[t] = n.value), e;
                };
          },
          "8aae": function (e, t, n) {
            n("32a6"), (e.exports = n("584a").Object.keys);
          },
          "8e60": function (e, t, n) {
            e.exports = !n("294c")(function () {
              return (
                7 !=
                Object.defineProperty({}, "a", {
                  get: function () {
                    return 7;
                  },
                }).a
              );
            });
          },
          "8f60": function (e, t, n) {
            "use strict";
            var o = n("a159"),
              i = n("aebd"),
              a = n("45f2"),
              s = {};
            n("35e8")(s, n("5168")("iterator"), function () {
              return this;
            }),
              (e.exports = function (e, t, n) {
                (e.prototype = o(s, { next: i(1, n) })), a(e, t + " Iterator");
              });
          },
          9003: function (e, t, n) {
            var o = n("6b4c");
            e.exports =
              Array.isArray ||
              function (e) {
                return "Array" == o(e);
              };
          },
          9138: function (e, t, n) {
            e.exports = n("35e8");
          },
          9306: function (e, t, n) {
            "use strict";
            var o = n("c3a1"),
              i = n("9aa9"),
              a = n("355d"),
              s = n("241e"),
              r = n("335c"),
              l = Object.assign;
            e.exports =
              !l ||
              n("294c")(function () {
                var e = {},
                  t = {},
                  n = Symbol(),
                  o = "abcdefghijklmnopqrst";
                return (
                  (e[n] = 7),
                  o.split("").forEach(function (e) {
                    t[e] = e;
                  }),
                  7 != l({}, e)[n] || Object.keys(l({}, t)).join("") != o
                );
              })
                ? function (e, t) {
                    for (
                      var n = s(e),
                        l = arguments.length,
                        c = 1,
                        u = i.f,
                        d = a.f;
                      l > c;

                    )
                      for (
                        var m,
                          p = r(arguments[c++]),
                          h = u ? o(p).concat(u(p)) : o(p),
                          f = h.length,
                          g = 0;
                        f > g;

                      )
                        d.call(p, (m = h[g++])) && (n[m] = p[m]);
                    return n;
                  }
                : l;
          },
          9427: function (e, t, n) {
            var o = n("63b6");
            o(o.S, "Object", { create: n("a159") });
          },
          "95d5": function (e, t, n) {
            var o = n("40c3"),
              i = n("5168")("iterator"),
              a = n("481b");
            e.exports = n("584a").isIterable = function (e) {
              var t = Object(e);
              return (
                void 0 !== t[i] || "@@iterator" in t || a.hasOwnProperty(o(t))
              );
            };
          },
          "9aa9": function (e, t) {
            t.f = Object.getOwnPropertySymbols;
          },
          "9b43": function (e, t, n) {
            var o = n("d8e8");
            e.exports = function (e, t, n) {
              if ((o(e), void 0 === t)) return e;
              switch (n) {
                case 1:
                  return function (n) {
                    return e.call(t, n);
                  };
                case 2:
                  return function (n, o) {
                    return e.call(t, n, o);
                  };
                case 3:
                  return function (n, o, i) {
                    return e.call(t, n, o, i);
                  };
              }
              return function () {
                return e.apply(t, arguments);
              };
            };
          },
          "9c6c": function (e, t, n) {
            var o = n("2b4c")("unscopables"),
              i = Array.prototype;
            void 0 == i[o] && n("32e9")(i, o, {}),
              (e.exports = function (e) {
                i[o][e] = !0;
              });
          },
          "9def": function (e, t, n) {
            var o = n("4588"),
              i = Math.min;
            e.exports = function (e) {
              return e > 0 ? i(o(e), 9007199254740991) : 0;
            };
          },
          "9e1e": function (e, t, n) {
            e.exports = !n("79e5")(function () {
              return (
                7 !=
                Object.defineProperty({}, "a", {
                  get: function () {
                    return 7;
                  },
                }).a
              );
            });
          },
          a159: function (e, t, n) {
            var o = n("e4ae"),
              i = n("7e90"),
              a = n("1691"),
              s = n("5559")("IE_PROTO"),
              r = function () {},
              l = "prototype",
              c = function () {
                var e,
                  t = n("1ec9")("iframe"),
                  o = a.length;
                for (
                  t.style.display = "none",
                    n("32fc").appendChild(t),
                    t.src = "javascript:",
                    (e = t.contentWindow.document).open(),
                    e.write("<script>document.F=Object</script>"),
                    e.close(),
                    c = e.F;
                  o--;

                )
                  delete c[l][a[o]];
                return c();
              };
            e.exports =
              Object.create ||
              function (e, t) {
                var n;
                return (
                  null !== e
                    ? ((r[l] = o(e)), (n = new r()), (r[l] = null), (n[s] = e))
                    : (n = c()),
                  void 0 === t ? n : i(n, t)
                );
              };
          },
          a352: function (t, n) {
            t.exports = e;
          },
          a3c3: function (e, t, n) {
            var o = n("63b6");
            o(o.S + o.F, "Object", { assign: n("9306") });
          },
          a481: function (e, t, n) {
            "use strict";
            var o = n("cb7c"),
              i = n("4bf8"),
              a = n("9def"),
              s = n("4588"),
              r = n("0390"),
              l = n("5f1b"),
              c = Math.max,
              u = Math.min,
              d = Math.floor,
              m = /\$([$&`']|\d\d?|<[^>]*>)/g,
              p = /\$([$&`']|\d\d?)/g,
              h = function (e) {
                return void 0 === e ? e : String(e);
              };
            n("214f")("replace", 2, function (e, t, n, f) {
              return [
                function (o, i) {
                  var a = e(this),
                    s = void 0 == o ? void 0 : o[t];
                  return void 0 !== s
                    ? s.call(o, a, i)
                    : n.call(String(a), o, i);
                },
                function (e, t) {
                  var i = f(n, e, this, t);
                  if (i.done) return i.value;
                  var d = o(e),
                    m = String(this),
                    p = "function" == typeof t;
                  p || (t = String(t));
                  var v = d.global;
                  if (v) {
                    var b = d.unicode;
                    d.lastIndex = 0;
                  }
                  for (var y = []; ; ) {
                    var _ = l(d, m);
                    if (null === _) break;
                    if ((y.push(_), !v)) break;
                    "" === String(_[0]) &&
                      (d.lastIndex = r(m, a(d.lastIndex), b));
                  }
                  for (var C = "", w = 0, k = 0; k < y.length; k++) {
                    _ = y[k];
                    for (
                      var x = String(_[0]),
                        $ = c(u(s(_.index), m.length), 0),
                        S = [],
                        D = 1;
                      D < _.length;
                      D++
                    )
                      S.push(h(_[D]));
                    var T = _.groups;
                    if (p) {
                      var E = [x].concat(S, $, m);
                      void 0 !== T && E.push(T);
                      var P = String(t.apply(void 0, E));
                    } else P = g(x, m, $, S, T, t);
                    $ >= w && ((C += m.slice(w, $) + P), (w = $ + x.length));
                  }
                  return C + m.slice(w);
                },
              ];
              function g(e, t, o, a, s, r) {
                var l = o + e.length,
                  c = a.length,
                  u = p;
                return (
                  void 0 !== s && ((s = i(s)), (u = m)),
                  n.call(r, u, function (n, i) {
                    var r;
                    switch (i.charAt(0)) {
                      case "$":
                        return "$";
                      case "&":
                        return e;
                      case "`":
                        return t.slice(0, o);
                      case "'":
                        return t.slice(l);
                      case "<":
                        r = s[i.slice(1, -1)];
                        break;
                      default:
                        var u = +i;
                        if (0 === u) return n;
                        if (u > c) {
                          var m = d(u / 10);
                          return 0 === m
                            ? n
                            : m <= c
                            ? void 0 === a[m - 1]
                              ? i.charAt(1)
                              : a[m - 1] + i.charAt(1)
                            : n;
                        }
                        r = a[u - 1];
                    }
                    return void 0 === r ? "" : r;
                  })
                );
              }
            });
          },
          a4bb: function (e, t, n) {
            e.exports = n("8aae");
          },
          a745: function (e, t, n) {
            e.exports = n("f410");
          },
          aae3: function (e, t, n) {
            var o = n("d3f4"),
              i = n("2d95"),
              a = n("2b4c")("match");
            e.exports = function (e) {
              var t;
              return o(e) && (void 0 !== (t = e[a]) ? !!t : "RegExp" == i(e));
            };
          },
          aebd: function (e, t) {
            e.exports = function (e, t) {
              return {
                enumerable: !(1 & e),
                configurable: !(2 & e),
                writable: !(4 & e),
                value: t,
              };
            };
          },
          b0c5: function (e, t, n) {
            "use strict";
            var o = n("520a");
            n("5ca1")(
              { target: "RegExp", proto: !0, forced: o !== /./.exec },
              { exec: o }
            );
          },
          b0dc: function (e, t, n) {
            var o = n("e4ae");
            e.exports = function (e, t, n, i) {
              try {
                return i ? t(o(n)[0], n[1]) : t(n);
              } catch (t) {
                var a = e.return;
                throw (void 0 !== a && o(a.call(e)), t);
              }
            };
          },
          b447: function (e, t, n) {
            var o = n("3a38"),
              i = Math.min;
            e.exports = function (e) {
              return e > 0 ? i(o(e), 9007199254740991) : 0;
            };
          },
          b8e3: function (e, t) {
            e.exports = !0;
          },
          be13: function (e, t) {
            e.exports = function (e) {
              if (void 0 == e) throw TypeError("Can't call method on  " + e);
              return e;
            };
          },
          c366: function (e, t, n) {
            var o = n("6821"),
              i = n("9def"),
              a = n("77f1");
            e.exports = function (e) {
              return function (t, n, s) {
                var r,
                  l = o(t),
                  c = i(l.length),
                  u = a(s, c);
                if (e && n != n) {
                  for (; c > u; ) if ((r = l[u++]) != r) return !0;
                } else
                  for (; c > u; u++)
                    if ((e || u in l) && l[u] === n) return e || u || 0;
                return !e && -1;
              };
            };
          },
          c367: function (e, t, n) {
            "use strict";
            var o = n("8436"),
              i = n("50ed"),
              a = n("481b"),
              s = n("36c3");
            (e.exports = n("30f1")(
              Array,
              "Array",
              function (e, t) {
                (this._t = s(e)), (this._i = 0), (this._k = t);
              },
              function () {
                var e = this._t,
                  t = this._k,
                  n = this._i++;
                return !e || n >= e.length
                  ? ((this._t = void 0), i(1))
                  : i(0, "keys" == t ? n : "values" == t ? e[n] : [n, e[n]]);
              },
              "values"
            )),
              (a.Arguments = a.Array),
              o("keys"),
              o("values"),
              o("entries");
          },
          c3a1: function (e, t, n) {
            var o = n("e6f3"),
              i = n("1691");
            e.exports =
              Object.keys ||
              function (e) {
                return o(e, i);
              };
          },
          c649: function (e, t, n) {
            "use strict";
            (function (e) {
              n.d(t, "c", function () {
                return c;
              }),
                n.d(t, "a", function () {
                  return r;
                }),
                n.d(t, "b", function () {
                  return a;
                }),
                n.d(t, "d", function () {
                  return l;
                }),
                n("a481");
              var o = n("4aa6"),
                i = n.n(o);
              var a = "undefined" != typeof window ? window.console : e.console;
              var s = /-(\w)/g,
                r = (function (e) {
                  var t = i()(null);
                  return function (n) {
                    return t[n] || (t[n] = e(n));
                  };
                })(function (e) {
                  return e.replace(s, function (e, t) {
                    return t ? t.toUpperCase() : "";
                  });
                });
              function l(e) {
                null !== e.parentElement && e.parentElement.removeChild(e);
              }
              function c(e, t, n) {
                var o = 0 === n ? e.children[0] : e.children[n - 1].nextSibling;
                e.insertBefore(t, o);
              }
            }.call(this, n("c8ba")));
          },
          c69a: function (e, t, n) {
            e.exports =
              !n("9e1e") &&
              !n("79e5")(function () {
                return (
                  7 !=
                  Object.defineProperty(n("230e")("div"), "a", {
                    get: function () {
                      return 7;
                    },
                  }).a
                );
              });
          },
          c8ba: function (e, t) {
            var n;
            n = (function () {
              return this;
            })();
            try {
              n = n || new Function("return this")();
            } catch (e) {
              "object" == typeof window && (n = window);
            }
            e.exports = n;
          },
          c8bb: function (e, t, n) {
            e.exports = n("54a1");
          },
          ca5a: function (e, t) {
            var n = 0,
              o = Math.random();
            e.exports = function (e) {
              return "Symbol(".concat(
                void 0 === e ? "" : e,
                ")_",
                (++n + o).toString(36)
              );
            };
          },
          cb7c: function (e, t, n) {
            var o = n("d3f4");
            e.exports = function (e) {
              if (!o(e)) throw TypeError(e + " is not an object!");
              return e;
            };
          },
          ce7e: function (e, t, n) {
            var o = n("63b6"),
              i = n("584a"),
              a = n("294c");
            e.exports = function (e, t) {
              var n = (i.Object || {})[e] || Object[e],
                s = {};
              (s[e] = t(n)),
                o(
                  o.S +
                    o.F *
                      a(function () {
                        n(1);
                      }),
                  "Object",
                  s
                );
            };
          },
          d2c8: function (e, t, n) {
            var o = n("aae3"),
              i = n("be13");
            e.exports = function (e, t, n) {
              if (o(t))
                throw TypeError("String#" + n + " doesn't accept regex!");
              return String(i(e));
            };
          },
          d2d5: function (e, t, n) {
            n("1654"), n("549b"), (e.exports = n("584a").Array.from);
          },
          d3f4: function (e, t) {
            e.exports = function (e) {
              return "object" == typeof e ? null !== e : "function" == typeof e;
            };
          },
          d864: function (e, t, n) {
            var o = n("79aa");
            e.exports = function (e, t, n) {
              if ((o(e), void 0 === t)) return e;
              switch (n) {
                case 1:
                  return function (n) {
                    return e.call(t, n);
                  };
                case 2:
                  return function (n, o) {
                    return e.call(t, n, o);
                  };
                case 3:
                  return function (n, o, i) {
                    return e.call(t, n, o, i);
                  };
              }
              return function () {
                return e.apply(t, arguments);
              };
            };
          },
          d8e8: function (e, t) {
            e.exports = function (e) {
              if ("function" != typeof e)
                throw TypeError(e + " is not a function!");
              return e;
            };
          },
          d9f6: function (e, t, n) {
            var o = n("e4ae"),
              i = n("794b"),
              a = n("1bc3"),
              s = Object.defineProperty;
            t.f = n("8e60")
              ? Object.defineProperty
              : function (e, t, n) {
                  if ((o(e), (t = a(t, !0)), o(n), i))
                    try {
                      return s(e, t, n);
                    } catch (e) {}
                  if ("get" in n || "set" in n)
                    throw TypeError("Accessors not supported!");
                  return "value" in n && (e[t] = n.value), e;
                };
          },
          dbdb: function (e, t, n) {
            var o = n("584a"),
              i = n("e53d"),
              a = "__core-js_shared__",
              s = i[a] || (i[a] = {});
            (e.exports = function (e, t) {
              return s[e] || (s[e] = void 0 !== t ? t : {});
            })("versions", []).push({
              version: o.version,
              mode: n("b8e3") ? "pure" : "global",
              copyright: "© 2019 Denis Pushkarev (zloirock.ru)",
            });
          },
          dc62: function (e, t, n) {
            n("9427");
            var o = n("584a").Object;
            e.exports = function (e, t) {
              return o.create(e, t);
            };
          },
          e4ae: function (e, t, n) {
            var o = n("f772");
            e.exports = function (e) {
              if (!o(e)) throw TypeError(e + " is not an object!");
              return e;
            };
          },
          e53d: function (e, t) {
            var n = (e.exports =
              "undefined" != typeof window && window.Math == Math
                ? window
                : "undefined" != typeof self && self.Math == Math
                ? self
                : Function("return this")());
            "number" == typeof __g && (__g = n);
          },
          e6f3: function (e, t, n) {
            var o = n("07e3"),
              i = n("36c3"),
              a = n("5b4e")(!1),
              s = n("5559")("IE_PROTO");
            e.exports = function (e, t) {
              var n,
                r = i(e),
                l = 0,
                c = [];
              for (n in r) n != s && o(r, n) && c.push(n);
              for (; t.length > l; )
                o(r, (n = t[l++])) && (~a(c, n) || c.push(n));
              return c;
            };
          },
          f410: function (e, t, n) {
            n("1af6"), (e.exports = n("584a").Array.isArray);
          },
          f559: function (e, t, n) {
            "use strict";
            var o = n("5ca1"),
              i = n("9def"),
              a = n("d2c8"),
              s = "startsWith",
              r = ""[s];
            o(o.P + o.F * n("5147")(s), "String", {
              startsWith: function (e) {
                var t = a(this, e, s),
                  n = i(
                    Math.min(
                      arguments.length > 1 ? arguments[1] : void 0,
                      t.length
                    )
                  ),
                  o = String(e);
                return r ? r.call(t, o, n) : t.slice(n, n + o.length) === o;
              },
            });
          },
          f772: function (e, t) {
            e.exports = function (e) {
              return "object" == typeof e ? null !== e : "function" == typeof e;
            };
          },
          fa5b: function (e, t, n) {
            e.exports = n("5537")(
              "native-function-to-string",
              Function.toString
            );
          },
          fb15: function (e, t, n) {
            "use strict";
            var o;
            n.r(t),
              "undefined" != typeof window &&
                (o = window.document.currentScript) &&
                (o = o.src.match(/(.+\/)[^\/]+\.js(\?.*)?$/)) &&
                (n.p = o[1]);
            var i = n("5176"),
              a = n.n(i),
              s = (n("f559"), n("a4bb")),
              r = n.n(s),
              l = (n("6762"), n("2fdb"), n("a745")),
              c = n.n(l);
            var u = n("5d73"),
              d = n.n(u);
            function m(e, t) {
              return (
                (function (e) {
                  if (c()(e)) return e;
                })(e) ||
                (function (e, t) {
                  var n = [],
                    o = !0,
                    i = !1,
                    a = void 0;
                  try {
                    for (
                      var s, r = d()(e);
                      !(o = (s = r.next()).done) &&
                      (n.push(s.value), !t || n.length !== t);
                      o = !0
                    );
                  } catch (e) {
                    (i = !0), (a = e);
                  } finally {
                    try {
                      o || null == r.return || r.return();
                    } finally {
                      if (i) throw a;
                    }
                  }
                  return n;
                })(e, t) ||
                (function () {
                  throw new TypeError(
                    "Invalid attempt to destructure non-iterable instance"
                  );
                })()
              );
            }
            var p = n("774e"),
              h = n.n(p),
              f = n("c8bb"),
              g = n.n(f);
            function v(e) {
              return (
                (function (e) {
                  if (c()(e)) {
                    for (var t = 0, n = new Array(e.length); t < e.length; t++)
                      n[t] = e[t];
                    return n;
                  }
                })(e) ||
                (function (e) {
                  if (
                    g()(Object(e)) ||
                    "[object Arguments]" === Object.prototype.toString.call(e)
                  )
                    return h()(e);
                })(e) ||
                (function () {
                  throw new TypeError(
                    "Invalid attempt to spread non-iterable instance"
                  );
                })()
              );
            }
            var b = n("a352"),
              y = n.n(b),
              _ = n("c649");
            function C(e, t) {
              var n = this;
              this.$nextTick(function () {
                return n.$emit(e.toLowerCase(), t);
              });
            }
            function w(e, t) {
              var n = null,
                o = function (e, t) {
                  n = (function (e, t, n) {
                    return void 0 === n ? e : (((e = e || {})[t] = n), e);
                  })(n, e, t);
                };
              if (
                (o(
                  "attrs",
                  r()(e)
                    .filter(function (e) {
                      return "id" === e || e.startsWith("data-");
                    })
                    .reduce(function (t, n) {
                      return (t[n] = e[n]), t;
                    }, {})
                ),
                !t)
              )
                return n;
              var i = t.on,
                s = t.props,
                l = t.attrs;
              return o("on", i), o("props", s), a()(n.attrs, l), n;
            }
            var k = ["Start", "Add", "Remove", "Update", "End"],
              x = ["Choose", "Sort", "Filter", "Clone"],
              $ = ["Move"].concat(k, x).map(function (e) {
                return "on" + e;
              }),
              S = null,
              D = {
                name: "draggable",
                inheritAttrs: !1,
                props: {
                  options: Object,
                  list: { type: Array, required: !1, default: null },
                  value: { type: Array, required: !1, default: null },
                  noTransitionOnDrag: { type: Boolean, default: !1 },
                  clone: {
                    type: Function,
                    default: function (e) {
                      return e;
                    },
                  },
                  element: { type: String, default: "div" },
                  tag: { type: String, default: null },
                  move: { type: Function, default: null },
                  componentData: { type: Object, required: !1, default: null },
                },
                data: function () {
                  return {
                    transitionMode: !1,
                    noneFunctionalComponentMode: !1,
                    init: !1,
                  };
                },
                render: function (e) {
                  var t = this.$slots.default;
                  this.transitionMode = (function (e) {
                    if (!e || 1 !== e.length) return !1;
                    var t = m(e, 1)[0].componentOptions;
                    return (
                      !!t &&
                      ["transition-group", "TransitionGroup"].includes(t.tag)
                    );
                  })(t);
                  var n = (function (e, t) {
                      var n = t.header,
                        o = t.footer,
                        i = 0,
                        a = 0;
                      return (
                        n &&
                          ((i = n.length),
                          (e = e ? [].concat(v(n), v(e)) : v(n))),
                        o &&
                          ((a = o.length),
                          (e = e ? [].concat(v(e), v(o)) : v(o))),
                        { children: e, headerOffset: i, footerOffset: a }
                      );
                    })(t, this.$slots),
                    o = n.children,
                    i = n.headerOffset,
                    a = n.footerOffset;
                  (this.headerOffset = i), (this.footerOffset = a);
                  var s = w(this.$attrs, this.componentData);
                  return e(this.getTag(), s, o);
                },
                created: function () {
                  null !== this.list &&
                    null !== this.value &&
                    _.b.error(
                      "Value and list props are mutually exclusive! Please set one or another."
                    ),
                    "div" !== this.element &&
                      _.b.warn(
                        "Element props is deprecated please use tag props instead. See https://github.com/SortableJS/Vue.Draggable/blob/master/documentation/migrate.md#element-props"
                      ),
                    void 0 !== this.options &&
                      _.b.warn(
                        "Options props is deprecated, add sortable options directly as vue.draggable item, or use v-bind. See https://github.com/SortableJS/Vue.Draggable/blob/master/documentation/migrate.md#options-props"
                      );
                },
                mounted: function () {
                  var e = this;
                  if (
                    ((this.noneFunctionalComponentMode =
                      this.getTag().toLowerCase() !==
                      this.$el.nodeName.toLowerCase()),
                    this.noneFunctionalComponentMode && this.transitionMode)
                  )
                    throw new Error(
                      "Transition-group inside component is not supported. Please alter tag value or remove transition-group. Current tag value: ".concat(
                        this.getTag()
                      )
                    );
                  var t = {};
                  k.forEach(function (n) {
                    t["on" + n] = function (e) {
                      var t = this;
                      return function (n) {
                        null !== t.realList && t["onDrag" + e](n),
                          C.call(t, e, n);
                      };
                    }.call(e, n);
                  }),
                    x.forEach(function (n) {
                      t["on" + n] = C.bind(e, n);
                    });
                  var n = r()(this.$attrs).reduce(function (t, n) {
                      return (t[Object(_.a)(n)] = e.$attrs[n]), t;
                    }, {}),
                    o = a()({}, this.options, n, t, {
                      onMove: function (t, n) {
                        return e.onDragMove(t, n);
                      },
                    });
                  !("draggable" in o) && (o.draggable = ">*"),
                    (this._sortable = new y.a(this.rootContainer, o)),
                    this.computeIndexes();
                },
                beforeDestroy: function () {
                  void 0 !== this._sortable && this._sortable.destroy();
                },
                computed: {
                  rootContainer: function () {
                    return this.transitionMode
                      ? this.$el.children[0]
                      : this.$el;
                  },
                  realList: function () {
                    return this.list ? this.list : this.value;
                  },
                },
                watch: {
                  options: {
                    handler: function (e) {
                      this.updateOptions(e);
                    },
                    deep: !0,
                  },
                  $attrs: {
                    handler: function (e) {
                      this.updateOptions(e);
                    },
                    deep: !0,
                  },
                  realList: function () {
                    this.computeIndexes();
                  },
                },
                methods: {
                  getTag: function () {
                    return this.tag || this.element;
                  },
                  updateOptions: function (e) {
                    for (var t in e) {
                      var n = Object(_.a)(t);
                      -1 === $.indexOf(n) && this._sortable.option(n, e[t]);
                    }
                  },
                  getChildrenNodes: function () {
                    if (
                      (this.init ||
                        ((this.noneFunctionalComponentMode =
                          this.noneFunctionalComponentMode &&
                          1 === this.$children.length),
                        (this.init = !0)),
                      this.noneFunctionalComponentMode)
                    )
                      return this.$children[0].$slots.default;
                    var e = this.$slots.default;
                    return this.transitionMode ? e[0].child.$slots.default : e;
                  },
                  computeIndexes: function () {
                    var e = this;
                    this.$nextTick(function () {
                      e.visibleIndexes = (function (e, t, n, o) {
                        if (!e) return [];
                        var i = e.map(function (e) {
                            return e.elm;
                          }),
                          a = t.length - o,
                          s = v(t).map(function (e, t) {
                            return t >= a ? i.length : i.indexOf(e);
                          });
                        return n
                          ? s.filter(function (e) {
                              return -1 !== e;
                            })
                          : s;
                      })(
                        e.getChildrenNodes(),
                        e.rootContainer.children,
                        e.transitionMode,
                        e.footerOffset
                      );
                    });
                  },
                  getUnderlyingVm: function (e) {
                    var t = (function (e, t) {
                      return e
                        .map(function (e) {
                          return e.elm;
                        })
                        .indexOf(t);
                    })(this.getChildrenNodes() || [], e);
                    return -1 === t
                      ? null
                      : { index: t, element: this.realList[t] };
                  },
                  getUnderlyingPotencialDraggableComponent: function (e) {
                    var t = e.__vue__;
                    return t &&
                      t.$options &&
                      "transition-group" === t.$options._componentTag
                      ? t.$parent
                      : t;
                  },
                  emitChanges: function (e) {
                    var t = this;
                    this.$nextTick(function () {
                      t.$emit("change", e);
                    });
                  },
                  alterList: function (e) {
                    if (this.list) e(this.list);
                    else {
                      var t = v(this.value);
                      e(t), this.$emit("input", t);
                    }
                  },
                  spliceList: function () {
                    var e = arguments;
                    this.alterList(function (t) {
                      return t.splice.apply(t, v(e));
                    });
                  },
                  updatePosition: function (e, t) {
                    this.alterList(function (n) {
                      return n.splice(t, 0, n.splice(e, 1)[0]);
                    });
                  },
                  getRelatedContextFromMoveEvent: function (e) {
                    var t = e.to,
                      n = e.related,
                      o = this.getUnderlyingPotencialDraggableComponent(t);
                    if (!o) return { component: o };
                    var i = o.realList,
                      s = { list: i, component: o };
                    if (t !== n && i && o.getUnderlyingVm) {
                      var r = o.getUnderlyingVm(n);
                      if (r) return a()(r, s);
                    }
                    return s;
                  },
                  getVmIndex: function (e) {
                    var t = this.visibleIndexes,
                      n = t.length;
                    return e > n - 1 ? n : t[e];
                  },
                  getComponent: function () {
                    return this.$slots.default[0].componentInstance;
                  },
                  resetTransitionData: function (e) {
                    if (this.noTransitionOnDrag && this.transitionMode) {
                      this.getChildrenNodes()[e].data = null;
                      var t = this.getComponent();
                      (t.children = []), (t.kept = void 0);
                    }
                  },
                  onDragStart: function (e) {
                    (this.context = this.getUnderlyingVm(e.item)),
                      (e.item._underlying_vm_ = this.clone(
                        this.context.element
                      )),
                      (S = e.item);
                  },
                  onDragAdd: function (e) {
                    var t = e.item._underlying_vm_;
                    if (void 0 !== t) {
                      Object(_.d)(e.item);
                      var n = this.getVmIndex(e.newIndex);
                      this.spliceList(n, 0, t), this.computeIndexes();
                      var o = { element: t, newIndex: n };
                      this.emitChanges({ added: o });
                    }
                  },
                  onDragRemove: function (e) {
                    if (
                      (Object(_.c)(this.rootContainer, e.item, e.oldIndex),
                      "clone" !== e.pullMode)
                    ) {
                      var t = this.context.index;
                      this.spliceList(t, 1);
                      var n = { element: this.context.element, oldIndex: t };
                      this.resetTransitionData(t),
                        this.emitChanges({ removed: n });
                    } else Object(_.d)(e.clone);
                  },
                  onDragUpdate: function (e) {
                    Object(_.d)(e.item),
                      Object(_.c)(e.from, e.item, e.oldIndex);
                    var t = this.context.index,
                      n = this.getVmIndex(e.newIndex);
                    this.updatePosition(t, n);
                    var o = {
                      element: this.context.element,
                      oldIndex: t,
                      newIndex: n,
                    };
                    this.emitChanges({ moved: o });
                  },
                  updateProperty: function (e, t) {
                    e.hasOwnProperty(t) && (e[t] += this.headerOffset);
                  },
                  computeFutureIndex: function (e, t) {
                    if (!e.element) return 0;
                    var n = v(t.to.children).filter(function (e) {
                        return "none" !== e.style.display;
                      }),
                      o = n.indexOf(t.related),
                      i = e.component.getVmIndex(o);
                    return -1 !== n.indexOf(S) || !t.willInsertAfter
                      ? i
                      : i + 1;
                  },
                  onDragMove: function (e, t) {
                    var n = this.move;
                    if (!n || !this.realList) return !0;
                    var o = this.getRelatedContextFromMoveEvent(e),
                      i = this.context,
                      s = this.computeFutureIndex(o, e);
                    return (
                      a()(i, { futureIndex: s }),
                      n(a()({}, e, { relatedContext: o, draggedContext: i }), t)
                    );
                  },
                  onDragEnd: function () {
                    this.computeIndexes(), (S = null);
                  },
                },
              };
            "undefined" != typeof window &&
              "Vue" in window &&
              window.Vue.component("draggable", D);
            var T = D;
            t.default = T;
          },
        }).default;
      }),
      (e.exports = o(n(832)));
  },
  792: function (e, t, n) {
    var o = n(685)(n(795), n(796), !1, null, null, null);
    e.exports = o.exports;
  },
  795: function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.default = {
        template: "#picture-upload",
        props: { editedEntity: null, entityName: "", multiple: !1 },
        data: function () {
          return { pictureFullPath: "", pictureThumbPath: "" };
        },
        mounted: function () {},
        methods: {
          openMediaModal: function () {
            var e,
              t = this;
            e
              ? e.open()
              : ((e = wp.media({
                  title: "Select or Upload Profile Picture",
                  button: { text: "Select picture" },
                  multiple: this.multiple,
                  library: { type: "image" },
                })).on("select", function () {
                  var n = null;
                  e.state()
                    .get("selection")
                    .forEach(function (e) {
                      (n = e.toJSON()),
                        (t.pictureFullPath = n.url),
                        (t.pictureThumbPath = n.sizes.thumbnail
                          ? n.sizes.thumbnail.url
                          : n.url),
                        t.$emit(
                          "pictureSelected",
                          t.pictureFullPath,
                          t.pictureThumbPath
                        );
                    });
                }),
                e.open());
          },
        },
        computed: {
          getPictureSrc: function () {
            return null !== this.editedEntity &&
              !this.pictureThumbPath &&
              this.editedEntity.pictureThumbPath
              ? this.editedEntity.pictureThumbPath
              : this.pictureThumbPath && "gallery" !== this.entityName
              ? this.pictureThumbPath
              : this.$root.getUrl +
                "public/img/default-" +
                this.entityName +
                ".svg";
          },
        },
      });
  },
  796: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          n = e._self._c || t;
        return n(
          "div",
          { staticClass: "am-profile-photo", on: { click: e.openMediaModal } },
          [
            n("i", {
              class: {
                "el-icon-plus": "gallery" === e.entityName,
                "el-icon-picture": "gallery" !== e.entityName,
              },
            }),
            e._v(" "),
            "gallery" === e.entityName
              ? n("span", [e._v(e._s(e.$root.labels.add_image))])
              : e._e(),
            e._v(" "),
            "gallery" !== e.entityName
              ? n("img", { attrs: { src: e.getPictureSrc, alt: "" } })
              : e._e(),
          ]
        );
      },
      staticRenderFns: [],
    };
  },
  823: function (e, t, n) {
    var o = n(685)(n(824), n(825), !1, null, null, null);
    e.exports = o.exports;
  },
  824: function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var o = n(694),
      i = n(337),
      a = n(695);
    t.default = {
      mixins: [o.a, i.a, a.a],
      props: {
        showCustomerInfo: !0,
        entityId: null,
        entityType: null,
        appointment: { default: function () {} },
        customFields: {
          default: function () {
            return [];
          },
        },
        hideAttachmentCustomField: { required: !1, default: !1, type: Boolean },
        isCabinet: { type: Boolean, default: !1, required: !1 },
      },
      data: function () {
        return {};
      },
      methods: {
        clearValidation: function () {
          this.$emit("clearValidation");
        },
      },
    };
  },
  825: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          n = e._self._c || t;
        return n(
          "div",
          { staticClass: "am-dialog-table am-custom-fields-container" },
          e._l(e.appointment.bookings, function (t, o) {
            return n(
              "div",
              { staticClass: "am-customer-extras" },
              [
                n(
                  "el-row",
                  { staticClass: "am-customer-extras-data" },
                  [
                    e.showCustomerInfo
                      ? n("el-col", [
                          n("h3", [
                            e._v(
                              e._s(t.customer.firstName) +
                                " " +
                                e._s(t.customer.lastName)
                            ),
                          ]),
                          e._v(" "),
                          n("span", [e._v(e._s(t.customer.email))]),
                        ])
                      : e._e(),
                  ],
                  1
                ),
                e._v(" "),
                n(
                  "div",
                  { staticClass: "am-custom-fields" },
                  e._l(e.customFields, function (t) {
                    return e.isCustomFieldVisible(
                      t,
                      e.entityType,
                      e.entityId
                    ) &&
                      "content" !== t.type &&
                      ("file" !== t.type ||
                        ("file" === t.type &&
                          e.appointment.bookings[o].customFields[t.id].value &&
                          e.appointment.bookings[o].customFields[t.id].value
                            .length > 0))
                      ? n(
                          "el-form-item",
                          {
                            key: t.id,
                            attrs: {
                              label: t.label + ":",
                              prop:
                                !0 === t.required &&
                                "content" !== t.type &&
                                "file" !== t.type
                                  ? "bookings." +
                                    o +
                                    ".customFields." +
                                    t.id +
                                    ".value"
                                  : null,
                            },
                          },
                          [
                            "text" === t.type
                              ? n("el-input", {
                                  attrs: { placeholder: "" },
                                  on: {
                                    input: function (t) {
                                      return e.clearValidation();
                                    },
                                  },
                                  model: {
                                    value:
                                      e.appointment.bookings[o].customFields[
                                        t.id
                                      ].value,
                                    callback: function (n) {
                                      e.$set(
                                        e.appointment.bookings[o].customFields[
                                          t.id
                                        ],
                                        "value",
                                        n
                                      );
                                    },
                                    expression:
                                      "appointment.bookings[key].customFields[customField.id].value",
                                  },
                                })
                              : "text-area" === t.type
                              ? n("el-input", {
                                  staticClass: "am-front-texarea",
                                  attrs: {
                                    placeholder: "",
                                    type: "textarea",
                                    rows: 3,
                                  },
                                  on: {
                                    input: function (t) {
                                      return e.clearValidation();
                                    },
                                  },
                                  model: {
                                    value:
                                      e.appointment.bookings[o].customFields[
                                        t.id
                                      ].value,
                                    callback: function (n) {
                                      e.$set(
                                        e.appointment.bookings[o].customFields[
                                          t.id
                                        ],
                                        "value",
                                        n
                                      );
                                    },
                                    expression:
                                      "appointment.bookings[key].customFields[customField.id].value",
                                  },
                                })
                              : "select" === t.type
                              ? n(
                                  "el-select",
                                  {
                                    attrs: { placeholder: "", clearable: "" },
                                    on: {
                                      change: function (t) {
                                        return e.clearValidation();
                                      },
                                    },
                                    model: {
                                      value:
                                        e.appointment.bookings[o].customFields[
                                          t.id
                                        ].value,
                                      callback: function (n) {
                                        e.$set(
                                          e.appointment.bookings[o]
                                            .customFields[t.id],
                                          "value",
                                          n
                                        );
                                      },
                                      expression:
                                        "appointment.bookings[key].customFields[customField.id].value",
                                    },
                                  },
                                  e._l(
                                    e.getCustomFieldOptions(t.options),
                                    function (e, t) {
                                      return n("el-option", {
                                        key: t,
                                        attrs: { value: e, label: e },
                                      });
                                    }
                                  ),
                                  1
                                )
                              : "checkbox" === t.type
                              ? n(
                                  "el-checkbox-group",
                                  {
                                    on: {
                                      change: function (t) {
                                        return e.clearValidation();
                                      },
                                    },
                                    model: {
                                      value:
                                        e.appointment.bookings[o].customFields[
                                          t.id
                                        ].value,
                                      callback: function (n) {
                                        e.$set(
                                          e.appointment.bookings[o]
                                            .customFields[t.id],
                                          "value",
                                          n
                                        );
                                      },
                                      expression:
                                        "appointment.bookings[key].customFields[customField.id].value",
                                    },
                                  },
                                  e._l(
                                    e.getCustomFieldOptions(t.options),
                                    function (e, t) {
                                      return n("el-checkbox", {
                                        key: t,
                                        attrs: { label: e },
                                      });
                                    }
                                  ),
                                  1
                                )
                              : "radio" === t.type
                              ? n(
                                  "el-radio-group",
                                  {
                                    model: {
                                      value:
                                        e.appointment.bookings[o].customFields[
                                          t.id
                                        ].value,
                                      callback: function (n) {
                                        e.$set(
                                          e.appointment.bookings[o]
                                            .customFields[t.id],
                                          "value",
                                          n
                                        );
                                      },
                                      expression:
                                        "appointment.bookings[key].customFields[customField.id].value",
                                    },
                                  },
                                  e._l(
                                    e.getCustomFieldOptions(t.options),
                                    function (t, o) {
                                      return n("el-radio", {
                                        key: o,
                                        attrs: { label: t },
                                        on: {
                                          change: function (t) {
                                            return e.clearValidation();
                                          },
                                        },
                                      });
                                    }
                                  ),
                                  1
                                )
                              : "file" === t.type &&
                                !1 === e.hideAttachmentCustomField
                              ? e._l(
                                  e.appointment.bookings[o].customFields[t.id]
                                    .value,
                                  function (i, a) {
                                    return n(
                                      "div",
                                      {
                                        staticStyle: {
                                          margin: "15px",
                                          clear: "left",
                                        },
                                      },
                                      [
                                        n(
                                          "a",
                                          {
                                            key: a,
                                            attrs: {
                                              href: e.$root.useUploadsAmeliaPath
                                                ? e.$root.getAjaxUrl +
                                                  "/fields/" +
                                                  t.id +
                                                  "/" +
                                                  e.appointment.bookings[o].id +
                                                  "/" +
                                                  a +
                                                  (e.isCabinet
                                                    ? "&source=cabinet-provider"
                                                    : "")
                                                : e.$root.getUploadsAmeliaUrl +
                                                  e.appointment.bookings[o].id +
                                                  "_" +
                                                  i.fileName,
                                              target: "_blank",
                                            },
                                          },
                                          [
                                            e._v(
                                              "\n            " +
                                                e._s(i.name) +
                                                "\n          "
                                            ),
                                          ]
                                        ),
                                      ]
                                    );
                                  }
                                )
                              : "datepicker" === t.type
                              ? n(
                                  "div",
                                  [
                                    n("v-date-picker", {
                                      attrs: {
                                        mode: "single",
                                        "popover-visibility": "focus",
                                        "popover-direction": "bottom",
                                        "popover-align":
                                          e.screenWidth < 768
                                            ? "center"
                                            : "left",
                                        "tint-color": "#1A84EE",
                                        "show-day-popover": !1,
                                        "input-props": {
                                          class: "el-input__inner",
                                        },
                                        "is-expanded": !1,
                                        "is-required": !0,
                                        disabled: !1,
                                        formats: e.vCalendarFormats,
                                      },
                                      model: {
                                        value:
                                          e.appointment.bookings[o]
                                            .customFields[t.id].value,
                                        callback: function (n) {
                                          e.$set(
                                            e.appointment.bookings[o]
                                              .customFields[t.id],
                                            "value",
                                            n
                                          );
                                        },
                                        expression:
                                          "appointment.bookings[key].customFields[customField.id].value",
                                      },
                                    }),
                                  ],
                                  1
                                )
                              : e._e(),
                          ],
                          2
                        )
                      : e._e();
                  }),
                  1
                ),
              ],
              1
            );
          }),
          0
        );
      },
      staticRenderFns: [],
    };
  },
  826: function (e, t, n) {
    var o = n(685)(n(827), n(828), !1, null, null, null);
    e.exports = o.exports;
  },
  827: function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var o = n(713),
      i = n.n(o),
      a = n(696),
      s = n.n(a),
      r = n(687),
      l = n(337),
      c = n(691),
      u = n(686);
    t.default = {
      mixins: [r.a, l.a, c.a, u.a],
      props: { customer: null },
      data: function () {
        return {
          dialogLoading: !0,
          errors: { email: "" },
          formOptions: {
            wpUsers: [],
            genders: [
              { value: "female", label: this.$root.labels.female },
              { value: "male", label: this.$root.labels.male },
            ],
          },
          rules: {
            firstName: [
              {
                required: !0,
                message: this.$root.labels.enter_first_name_warning,
                trigger: "submit",
              },
            ],
            lastName: [
              {
                required: !0,
                message: this.$root.labels.enter_last_name_warning,
                trigger: "submit",
              },
            ],
            email: [
              {
                required: !1,
                message: this.$root.labels.enter_email_warning,
                trigger: "submit",
              },
              {
                type: "email",
                message: this.$root.labels.enter_valid_email_warning,
                trigger: "submit",
              },
            ],
          },
        };
      },
      created: function () {
        0 !== this.customer.id
          ? ((this.customer.birthday = this.$moment(
              this.customer.birthday
            ).toDate()),
            this.getWPUsers(this.customer.externalId))
          : this.getWPUsers(0);
      },
      mounted: function () {
        this.inlineSVG();
      },
      methods: {
        errorCallback: function (e) {
          var t = this;
          (t.errors.email = ""),
            setTimeout(function () {
              t.errors.email = e;
            }, 200);
        },
        getParsedEntity: function () {
          var e = JSON.parse(JSON.stringify(this.customer));
          return (
            e.birthday &&
              (e.birthday = this.getDatabaseFormattedDate(
                this.$moment(e.birthday).format("YYYY-MM-DD")
              )),
            0 === e.externalId || e.externalId || (e.externalId = -1),
            e
          );
        },
        closeDialog: function () {
          this.$emit("closeDialog");
        },
        getWPUsers: function (e) {
          var t = this;
          this.$http
            .get(this.$root.getAjaxUrl + "/users/wp-users", {
              params: { id: e, role: "customer" },
            })
            .then(function (e) {
              (t.formOptions.wpUsers = e.data.data.users),
                t.formOptions.wpUsers.unshift({
                  value: 0,
                  label: t.$root.labels.create_new,
                }),
                -1 ===
                  t.formOptions.wpUsers
                    .map(function (e) {
                      return e.value;
                    })
                    .indexOf(t.customer.externalId) &&
                  (t.customer.externalId = ""),
                (t.dialogLoading = !1);
            });
        },
        phoneFormatted: function (e, t) {
          this.clearValidation(),
            (this.customer.phone = e),
            (this.customer.countryPhoneIso = t);
        },
        clearValidation: function () {
          void 0 !== this.$refs.customer && this.$refs.customer.clearValidate();
        },
        selectCreateNewWPUser: function () {
          (this.customer.externalId = 0), this.$refs.wpUser.blur();
        },
      },
      components: { PhoneInput: s.a, DialogActions: i.a },
    };
  },
  828: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          n = e._self._c || t;
        return n(
          "div",
          [
            n(
              "div",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: e.dialogLoading,
                    expression: "dialogLoading",
                  },
                ],
                staticClass: "am-dialog-loader",
              },
              [
                n("div", { staticClass: "am-dialog-loader-content" }, [
                  n("img", {
                    attrs: { src: e.$root.getUrl + "public/img/spinner.svg" },
                  }),
                  e._v(" "),
                  n("p", [e._v(e._s(e.$root.labels.loader_message))]),
                ]),
              ]
            ),
            e._v(" "),
            e.dialogLoading
              ? e._e()
              : n(
                  "div",
                  {
                    staticClass: "am-dialog-scrollable",
                    class: { "am-edit": 0 !== e.customer.id },
                  },
                  [
                    n(
                      "div",
                      { staticClass: "am-dialog-header" },
                      [
                        n(
                          "el-row",
                          [
                            n("el-col", { attrs: { span: 18 } }, [
                              0 !== e.customer.id
                                ? n("h2", [
                                    e._v(e._s(e.$root.labels.edit_customer)),
                                  ])
                                : n("h2", [
                                    e._v(e._s(e.$root.labels.new_customer)),
                                  ]),
                            ]),
                            e._v(" "),
                            n(
                              "el-col",
                              {
                                staticClass: "align-right",
                                attrs: { span: 6 },
                              },
                              [
                                n("span"),
                                e._v(" "),
                                n("el-button", {
                                  staticClass: "am-dialog-close",
                                  attrs: {
                                    size: "small",
                                    icon: "el-icon-close",
                                  },
                                  on: { click: e.closeDialog },
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
                    n(
                      "el-form",
                      {
                        ref: "customer",
                        attrs: {
                          model: e.customer,
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
                        n(
                          "el-form-item",
                          {
                            attrs: {
                              label: e.$root.labels.first_name + ":",
                              prop: "firstName",
                            },
                          },
                          [
                            n("el-input", {
                              attrs: { "auto-complete": "off" },
                              on: {
                                input: function (t) {
                                  return e.clearValidation();
                                },
                                change: function (t) {
                                  return e.trimProperty(
                                    e.customer,
                                    "firstName"
                                  );
                                },
                              },
                              model: {
                                value: e.customer.firstName,
                                callback: function (t) {
                                  e.$set(e.customer, "firstName", t);
                                },
                                expression: "customer.firstName",
                              },
                            }),
                          ],
                          1
                        ),
                        e._v(" "),
                        n(
                          "el-form-item",
                          {
                            attrs: {
                              label: e.$root.labels.last_name + ":",
                              prop: "lastName",
                            },
                          },
                          [
                            n("el-input", {
                              attrs: { "auto-complete": "off" },
                              on: {
                                input: function (t) {
                                  return e.clearValidation();
                                },
                                change: function (t) {
                                  return e.trimProperty(e.customer, "lastName");
                                },
                              },
                              model: {
                                value: e.customer.lastName,
                                callback: function (t) {
                                  e.$set(e.customer, "lastName", t);
                                },
                                expression: "customer.lastName",
                              },
                            }),
                          ],
                          1
                        ),
                        e._v(" "),
                        n(
                          "el-form-item",
                          {
                            attrs: {
                              label: e.$root.labels.email + ":",
                              prop: "email",
                              error: e.errors.email,
                            },
                          },
                          [
                            n("el-input", {
                              attrs: {
                                "auto-complete": "off",
                                placeholder: e.$root.labels.email_placeholder,
                              },
                              on: {
                                input: function (t) {
                                  return e.clearValidation();
                                },
                              },
                              model: {
                                value: e.customer.email,
                                callback: function (t) {
                                  e.$set(e.customer, "email", t);
                                },
                                expression: "customer.email",
                              },
                            }),
                          ],
                          1
                        ),
                        e._v(" "),
                        n(
                          "el-form-item",
                          { attrs: { label: "placeholder" } },
                          [
                            n(
                              "label",
                              { attrs: { slot: "label" }, slot: "label" },
                              [
                                e._v(
                                  "\n          " +
                                    e._s(e.$root.labels.wp_user) +
                                    ":\n          "
                                ),
                                n(
                                  "el-tooltip",
                                  { attrs: { placement: "top" } },
                                  [
                                    n("div", {
                                      attrs: { slot: "content" },
                                      domProps: {
                                        innerHTML: e._s(
                                          e.$root.labels
                                            .wp_user_customer_tooltip
                                        ),
                                      },
                                      slot: "content",
                                    }),
                                    e._v(" "),
                                    n("i", {
                                      staticClass:
                                        "el-icon-question am-tooltip-icon",
                                    }),
                                  ]
                                ),
                              ],
                              1
                            ),
                            e._v(" "),
                            n(
                              "el-select",
                              {
                                ref: "wpUser",
                                attrs: {
                                  filterable: "",
                                  clearable: "",
                                  placeholder: e.$root.labels.select_wp_user,
                                },
                                on: {
                                  change: function (t) {
                                    return e.clearValidation();
                                  },
                                },
                                model: {
                                  value: e.customer.externalId,
                                  callback: function (t) {
                                    e.$set(e.customer, "externalId", t);
                                  },
                                  expression: "customer.externalId",
                                },
                              },
                              [
                                n(
                                  "div",
                                  { staticClass: "am-drop" },
                                  [
                                    e.customer && e.customer.email
                                      ? n(
                                          "div",
                                          {
                                            staticClass: "am-drop-create-item",
                                            on: {
                                              click: e.selectCreateNewWPUser,
                                            },
                                          },
                                          [
                                            e._v(
                                              "\n              " +
                                                e._s(
                                                  e.$root.labels.create_new
                                                ) +
                                                "\n            "
                                            ),
                                          ]
                                        )
                                      : e._e(),
                                    e._v(" "),
                                    e._l(e.formOptions.wpUsers, function (e) {
                                      return n("el-option", {
                                        key: e.value,
                                        class: { hidden: 0 === e.value },
                                        attrs: {
                                          label: e.label,
                                          value: e.value,
                                        },
                                      });
                                    }),
                                  ],
                                  2
                                ),
                              ]
                            ),
                          ],
                          1
                        ),
                        e._v(" "),
                        n(
                          "el-form-item",
                          { attrs: { label: e.$root.labels.phone + ":" } },
                          [
                            n("phone-input", {
                              attrs: {
                                countryPhoneIso: e.customer.countryPhoneIso,
                                savedPhone: e.customer.phone,
                              },
                              on: { phoneFormatted: e.phoneFormatted },
                            }),
                          ],
                          1
                        ),
                        e._v(" "),
                        n(
                          "el-form-item",
                          { attrs: { label: e.$root.labels.gender + ":" } },
                          [
                            n(
                              "el-select",
                              {
                                attrs: { placeholder: "", clearable: "" },
                                on: {
                                  change: function (t) {
                                    return e.clearValidation();
                                  },
                                },
                                model: {
                                  value: e.customer.gender,
                                  callback: function (t) {
                                    e.$set(e.customer, "gender", t);
                                  },
                                  expression: "customer.gender",
                                },
                              },
                              e._l(e.formOptions.genders, function (e) {
                                return n("el-option", {
                                  key: e.value,
                                  attrs: { label: e.label, value: e.value },
                                });
                              }),
                              1
                            ),
                          ],
                          1
                        ),
                        e._v(" "),
                        n(
                          "el-form-item",
                          {
                            attrs: {
                              label: e.$root.labels.date_of_birth + ":",
                            },
                          },
                          [
                            n("v-date-picker", {
                              attrs: {
                                mode: "single",
                                "popover-visibility": "focus",
                                "popover-direction": "top",
                                "tint-color": "#1A84EE",
                                "show-day-popover": !1,
                                "input-props": {
                                  class: "el-input__inner",
                                  placeholder:
                                    e.$root.labels.select_date_of_birth,
                                },
                                "is-expanded": !1,
                                formats: e.vCalendarFormats,
                              },
                              on: {
                                input: function (t) {
                                  return e.clearValidation();
                                },
                              },
                              model: {
                                value: e.customer.birthday,
                                callback: function (t) {
                                  e.$set(e.customer, "birthday", t);
                                },
                                expression: "customer.birthday",
                              },
                            }),
                          ],
                          1
                        ),
                        e._v(" "),
                        n("div", { staticClass: "am-divider" }),
                        e._v(" "),
                        n(
                          "el-form-item",
                          {
                            attrs: {
                              label: e.$root.labels.note_internal + ":",
                            },
                          },
                          [
                            n("el-input", {
                              attrs: {
                                type: "textarea",
                                autosize: { minRows: 4, maxRows: 6 },
                                placeholder: "",
                              },
                              on: {
                                input: function (t) {
                                  return e.clearValidation();
                                },
                              },
                              model: {
                                value: e.customer.note,
                                callback: function (t) {
                                  e.$set(e.customer, "note", t);
                                },
                                expression: "customer.note",
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
            e.dialogLoading
              ? e._e()
              : n("dialog-actions", {
                  attrs: {
                    formName: "customer",
                    urlName: "users/customers",
                    isNew: 0 === e.customer.id,
                    entity: e.customer,
                    getParsedEntity: e.getParsedEntity,
                    hasIcons: !0,
                    status: { on: "visible", off: "hidden" },
                    buttonText: {
                      confirm: {
                        status: {
                          yes:
                            "visible" === e.customer.status
                              ? e.$root.labels.visibility_hide
                              : e.$root.labels.visibility_show,
                          no: e.$root.labels.no,
                        },
                      },
                    },
                    action: {
                      haveAdd: !0,
                      haveEdit: !0,
                      haveStatus: !1,
                      haveRemove:
                        !0 === e.$root.settings.capabilities.canDelete,
                      haveRemoveEffect: !0,
                      haveDuplicate: !1,
                    },
                    message: {
                      success: {
                        save: e.$root.labels.customer_saved,
                        remove: e.$root.labels.customer_deleted,
                        show: "",
                        hide: "",
                      },
                      confirm: {
                        remove: e.$root.labels.confirm_delete_customer,
                        show: "",
                        hide: "",
                        duplicate: "",
                      },
                    },
                  },
                  on: { errorCallback: e.errorCallback },
                }),
          ],
          1
        );
      },
      staticRenderFns: [],
    };
  },
  829: function (e, t, n) {
    var o = n(685)(n(830), n(831), !1, null, null, null);
    e.exports = o.exports;
  },
  830: function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var o = n(687),
      i = n(337);
    t.default = {
      mixins: [o.a, i.a],
      props: { data: null, action: null },
      data: function () {
        return {
          delimiter: ",",
          delimiters: [
            { label: this.$root.labels.csv_delimiter_comma, value: "," },
            { label: this.$root.labels.csv_delimiter_semicolon, value: ";" },
          ],
          separateBookings: !1,
          isAppointmentsPage: !1,
        };
      },
      updated: function () {
        this.inlineSVG();
      },
      mounted: function () {
        this.$emit("updateAction", this.getAction()),
          this.inlineSVG(),
          (this.isAppointmentsPage =
            this.action === this.$root.getAjaxUrl + "/report/appointments");
      },
      methods: {
        changeFields: function () {
          this.$emit("updateAction", this.getAction());
        },
        closeDialog: function () {
          this.$emit("closeDialogExport");
        },
        getAction: function () {
          var e = this,
            t = [],
            n = function (n) {
              if (e.data.hasOwnProperty(n))
                if (e.data[n] instanceof Array || e.data[n] instanceof Object) {
                  var o = Object.keys(e.data[n]).map(function (t) {
                    return e.data[n][t];
                  });
                  for (var i in o)
                    if ("" !== o[i]) {
                      var a = "";
                      "" !==
                        (a =
                          o[i] instanceof Date
                            ? o[i] instanceof Date
                              ? e.getDatabaseFormattedDate(o[i])
                              : o[i]
                            : o[i] instanceof Object && !0 === o[i].checked
                            ? o[i].value
                            : o[i]) &&
                        t.push(n + "[" + i + "]=" + encodeURIComponent(a));
                    }
                } else
                  "" !== e.data[n] &&
                    t.push(n + "=" + encodeURIComponent(e.data[n]));
            };
          for (var o in this.data) n(o);
          return (
            this.action +
            "&" +
            t.join("&") +
            "&delimiter=" +
            this.delimiter +
            (this.isAppointmentsPage
              ? "&separate=" + this.separateBookings
              : "")
          );
        },
      },
      components: {},
    };
  },
  831: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          n = e._self._c || t;
        return n("div", [
          n(
            "div",
            { staticClass: "am-dialog-scrollable" },
            [
              n(
                "div",
                { staticClass: "am-dialog-header" },
                [
                  n(
                    "el-row",
                    [
                      n("el-col", { attrs: { span: 14 } }, [
                        n("h2", [e._v(e._s(e.$root.labels.export))]),
                      ]),
                      e._v(" "),
                      n(
                        "el-col",
                        { staticClass: "align-right", attrs: { span: 10 } },
                        [
                          n("el-button", {
                            staticClass: "am-dialog-close",
                            attrs: { size: "small", icon: "el-icon-close" },
                            on: { click: e.closeDialog },
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
              n(
                "el-form",
                { attrs: { "label-position": "top" } },
                [
                  n(
                    "el-form-item",
                    { attrs: { label: e.$root.labels.csv_delimiter + ":" } },
                    [
                      n(
                        "el-select",
                        {
                          attrs: { placeholder: e.$root.labels.csv_delimiter },
                          on: { change: e.changeFields },
                          model: {
                            value: e.delimiter,
                            callback: function (t) {
                              e.delimiter = t;
                            },
                            expression: "delimiter",
                          },
                        },
                        e._l(e.delimiters, function (e) {
                          return n("el-option", {
                            key: e.value,
                            attrs: { label: e.label, value: e.value },
                          });
                        }),
                        1
                      ),
                    ],
                    1
                  ),
                  e._v(" "),
                  e.isAppointmentsPage
                    ? n(
                        "el-form-item",
                        {
                          attrs: {
                            label: e.$root.labels.select_rows_settings + ":",
                          },
                        },
                        [
                          n(
                            "el-select",
                            {
                              attrs: {
                                placeholder: e.$root.labels.exported_same_row,
                              },
                              on: { change: e.changeFields },
                              model: {
                                value: e.separateBookings,
                                callback: function (t) {
                                  e.separateBookings = t;
                                },
                                expression: "separateBookings",
                              },
                            },
                            [
                              n("el-option", {
                                attrs: {
                                  label: this.$root.labels.exported_same_row,
                                  value: !1,
                                },
                              }),
                              e._v(" "),
                              n("el-option", {
                                attrs: {
                                  label:
                                    this.$root.labels.exported_separate_rows,
                                  value: !0,
                                },
                              }),
                            ],
                            1
                          ),
                        ],
                        1
                      )
                    : e._e(),
                  e._v(" "),
                  e._l(e.data.fields, function (t) {
                    return [
                      n("el-checkbox", {
                        attrs: { checked: "", label: t.label, border: "" },
                        on: { change: e.changeFields },
                        model: {
                          value: t.checked,
                          callback: function (n) {
                            e.$set(t, "checked", n);
                          },
                          expression: "field.checked",
                        },
                      }),
                    ];
                  }),
                ],
                2
              ),
            ],
            1
          ),
          e._v(" "),
          n("div", { staticClass: "am-dialog-footer" }, [
            n(
              "div",
              { staticClass: "am-dialog-footer-actions" },
              [
                n(
                  "el-row",
                  [
                    n(
                      "el-col",
                      { staticClass: "align-right", attrs: { sm: 24 } },
                      [
                        n(
                          "el-button",
                          { attrs: { type: "" }, on: { click: e.closeDialog } },
                          [
                            e._v(
                              "\n            " +
                                e._s(e.$root.labels.cancel) +
                                "\n          "
                            ),
                          ]
                        ),
                        e._v(" "),
                        n(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary", "native-type": "submit" },
                            on: { click: e.closeDialog },
                          },
                          [
                            e._v(
                              "\n            " +
                                e._s(e.$root.labels.export) +
                                "\n          "
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
          ]),
        ]);
      },
      staticRenderFns: [],
    };
  },
  832: function (e, t, n) {
    var o, i;
    !(function (a) {
      "use strict";
      void 0 === (i = "function" == typeof (o = a) ? o.call(t, n, t, e) : o) ||
        (e.exports = i);
    })(function () {
      "use strict";
      if ("undefined" == typeof window || !window.document)
        return function () {
          throw new Error("Sortable.js requires a window with a document");
        };
      var e,
        t,
        n,
        o,
        i,
        a,
        s,
        r,
        l,
        c,
        u,
        d,
        m,
        p,
        h,
        f,
        g,
        v,
        b,
        y,
        _,
        C,
        w,
        k,
        x,
        $,
        S,
        D,
        T = [],
        E = !1,
        P = !1,
        O = !1,
        A = [],
        I = !1,
        F = !1,
        R = [],
        N = /\s+/g,
        L = "Sortable" + new Date().getTime(),
        M = window,
        B = M.document,
        j = M.parseInt,
        U = M.setTimeout,
        z = M.jQuery || M.Zepto,
        Y = M.Polymer,
        q = { capture: !1, passive: !1 },
        H = !!navigator.userAgent.match(
          /(?:Trident.*rv[ :]?11\.|msie|iemobile)/i
        ),
        V = !!navigator.userAgent.match(/Edge/i),
        G = !!navigator.userAgent.match(/firefox/i),
        W = !(
          !navigator.userAgent.match(/safari/i) ||
          navigator.userAgent.match(/chrome/i) ||
          navigator.userAgent.match(/android/i)
        ),
        J = !!navigator.userAgent.match(/iP(ad|od|hone)/i),
        K = V || H ? "cssFloat" : "float",
        X = "draggable" in B.createElement("div"),
        Z = (function () {
          if (H) return !1;
          var e = B.createElement("x");
          return (
            (e.style.cssText = "pointer-events:auto"),
            "auto" === e.style.pointerEvents
          );
        })(),
        Q = !1,
        ee = !1,
        te = Math.abs,
        ne = Math.min,
        oe = Math.max,
        ie = [],
        ae = function (e, t) {
          var n = ke(e),
            o =
              j(n.width) -
              j(n.paddingLeft) -
              j(n.paddingRight) -
              j(n.borderLeftWidth) -
              j(n.borderRightWidth),
            i = Pe(e, 0, t),
            a = Pe(e, 1, t),
            s = i && ke(i),
            r = a && ke(a),
            l = s && j(s.marginLeft) + j(s.marginRight) + Ue(i).width,
            c = r && j(r.marginLeft) + j(r.marginRight) + Ue(a).width;
          if ("flex" === n.display)
            return "column" === n.flexDirection ||
              "column-reverse" === n.flexDirection
              ? "vertical"
              : "horizontal";
          if ("grid" === n.display)
            return n.gridTemplateColumns.split(" ").length <= 1
              ? "vertical"
              : "horizontal";
          if (i && "none" !== s.float) {
            var u = "left" === s.float ? "left" : "right";
            return !a || ("both" !== r.clear && r.clear !== u)
              ? "horizontal"
              : "vertical";
          }
          return i &&
            ("block" === s.display ||
              "flex" === s.display ||
              "table" === s.display ||
              "grid" === s.display ||
              (l >= o && "none" === n[K]) ||
              (a && "none" === n[K] && l + c > o))
            ? "vertical"
            : "horizontal";
        },
        se = function (e, t) {
          if (!e || !e.getBoundingClientRect) return re();
          var n = e,
            o = !1;
          do {
            if (
              n.clientWidth < n.scrollWidth ||
              n.clientHeight < n.scrollHeight
            ) {
              var i = ke(n);
              if (
                (n.clientWidth < n.scrollWidth &&
                  ("auto" == i.overflowX || "scroll" == i.overflowX)) ||
                (n.clientHeight < n.scrollHeight &&
                  ("auto" == i.overflowY || "scroll" == i.overflowY))
              ) {
                if (!n || !n.getBoundingClientRect || n === B.body) return re();
                if (o || t) return n;
                o = !0;
              }
            }
          } while ((n = n.parentNode));
          return re();
        },
        re = function () {
          return H ? B.documentElement : B.scrollingElement;
        },
        le = function (e, t, n) {
          (e.scrollLeft += t), (e.scrollTop += n);
        },
        ce = Ne(function (e, t, n, o) {
          if (t.scroll) {
            var i = n ? n[L] : window,
              a = t.scrollSensitivity,
              s = t.scrollSpeed,
              u = e.clientX,
              d = e.clientY,
              m = re(),
              p = !1;
            l !== n &&
              (ue(),
              (r = t.scroll),
              (c = t.scrollFn),
              !0 === r && ((r = se(n, !0)), (l = r)));
            var h = 0,
              f = r;
            do {
              var g,
                v,
                b,
                y,
                C,
                w,
                k,
                x,
                $,
                S = f,
                D = Ue(S),
                P = D.top,
                O = D.bottom,
                A = D.left,
                I = D.right,
                F = D.width,
                R = D.height;
              if (
                ((g = S.scrollWidth),
                (v = S.scrollHeight),
                (b = ke(S)),
                (x = S.scrollLeft),
                ($ = S.scrollTop),
                S === m
                  ? ((w =
                      F < g &&
                      ("auto" === b.overflowX ||
                        "scroll" === b.overflowX ||
                        "visible" === b.overflowX)),
                    (k =
                      R < v &&
                      ("auto" === b.overflowY ||
                        "scroll" === b.overflowY ||
                        "visible" === b.overflowY)))
                  : ((w =
                      F < g &&
                      ("auto" === b.overflowX || "scroll" === b.overflowX)),
                    (k =
                      R < v &&
                      ("auto" === b.overflowY || "scroll" === b.overflowY))),
                (y =
                  w && (te(I - u) <= a && x + F < g) - (te(A - u) <= a && !!x)),
                (C =
                  k && (te(O - d) <= a && $ + R < v) - (te(P - d) <= a && !!$)),
                !T[h])
              )
                for (var N = 0; N <= h; N++) T[N] || (T[N] = {});
              (T[h].vx == y && T[h].vy == C && T[h].el === S) ||
                ((T[h].el = S),
                (T[h].vx = y),
                (T[h].vy = C),
                clearInterval(T[h].pid),
                !S ||
                  (0 == y && 0 == C) ||
                  ((p = !0),
                  (T[h].pid = setInterval(
                    function () {
                      o &&
                        0 === this.layer &&
                        (ve.active._emulateDragOver(!0),
                        ve.active._onTouchMove(_, !0));
                      var t = T[this.layer].vy ? T[this.layer].vy * s : 0,
                        n = T[this.layer].vx ? T[this.layer].vx * s : 0;
                      ("function" == typeof c &&
                        "continue" !==
                          c.call(i, n, t, e, _, T[this.layer].el)) ||
                        le(T[this.layer].el, n, t);
                    }.bind({ layer: h }),
                    24
                  )))),
                h++;
            } while (t.bubbleScroll && f !== m && (f = se(f, !1)));
            E = p;
          }
        }, 30),
        ue = function () {
          T.forEach(function (e) {
            clearInterval(e.pid);
          }),
            (T = []);
        },
        de = function (e) {
          function t(e, n) {
            return function (o, i, a, s) {
              var r =
                o.options.group.name &&
                i.options.group.name &&
                o.options.group.name === i.options.group.name;
              if (null == e && (n || r)) return !0;
              if (null == e || !1 === e) return !1;
              if (n && "clone" === e) return e;
              if ("function" == typeof e)
                return t(e(o, i, a, s), n)(o, i, a, s);
              var l = (n ? o : i).options.group.name;
              return (
                !0 === e ||
                ("string" == typeof e && e === l) ||
                (e.join && e.indexOf(l) > -1)
              );
            };
          }
          var n = {},
            o = e.group;
          (o && "object" == typeof o) || (o = { name: o }),
            (n.name = o.name),
            (n.checkPull = t(o.pull, !0)),
            (n.checkPut = t(o.put)),
            (n.revertClone = o.revertClone),
            (e.group = n);
        },
        me = function (t) {
          e &&
            e.parentNode &&
            e.parentNode[L] &&
            e.parentNode[L]._computeIsAligned(t);
        },
        pe = function () {
          !Z && n && ke(n, "display", "none");
        },
        he = function () {
          !Z && n && ke(n, "display", "");
        };
      B.addEventListener(
        "click",
        function (e) {
          if (O)
            return (
              e.preventDefault(),
              e.stopPropagation && e.stopPropagation(),
              e.stopImmediatePropagation && e.stopImmediatePropagation(),
              (O = !1),
              !1
            );
        },
        !0
      );
      var fe,
        ge = function (t) {
          if (e) {
            var n = (function (e, t) {
              for (var n = 0; n < A.length; n++)
                if (!Oe(A[n])) {
                  var o = Ue(A[n]),
                    i = A[n][L].options.emptyInsertThreshold,
                    a = e >= o.left - i && e <= o.right + i,
                    s = t >= o.top - i && t <= o.bottom + i;
                  if (i && a && s) return A[n];
                }
            })((t = t.touches ? t.touches[0] : t).clientX, t.clientY);
            if (n) {
              var o = {};
              for (var i in t) o[i] = t[i];
              (o.target = o.rootEl = n),
                (o.preventDefault = void 0),
                (o.stopPropagation = void 0),
                n[L]._onDragOver(o);
            }
          }
        };
      function ve(e, t) {
        if (!e || !e.nodeType || 1 !== e.nodeType)
          throw (
            "Sortable: `el` must be HTMLElement, not " + {}.toString.call(e)
          );
        (this.el = e), (this.options = t = Le({}, t)), (e[L] = this);
        var n = {
          group: null,
          sort: !0,
          disabled: !1,
          store: null,
          handle: null,
          scroll: !0,
          scrollSensitivity: 30,
          scrollSpeed: 10,
          bubbleScroll: !0,
          draggable: /[uo]l/i.test(e.nodeName) ? ">li" : ">*",
          swapThreshold: 1,
          invertSwap: !1,
          invertedSwapThreshold: null,
          removeCloneOnHide: !0,
          direction: function () {
            return ae(e, this.options);
          },
          ghostClass: "sortable-ghost",
          chosenClass: "sortable-chosen",
          dragClass: "sortable-drag",
          ignore: "a, img",
          filter: null,
          preventOnFilter: !0,
          animation: 0,
          easing: null,
          setData: function (e, t) {
            e.setData("Text", t.textContent);
          },
          dropBubble: !1,
          dragoverBubble: !1,
          dataIdAttr: "data-id",
          delay: 0,
          delayOnTouchOnly: !1,
          touchStartThreshold: j(window.devicePixelRatio, 10) || 1,
          forceFallback: !1,
          fallbackClass: "sortable-fallback",
          fallbackOnBody: !1,
          fallbackTolerance: 0,
          fallbackOffset: { x: 0, y: 0 },
          supportPointer: !1 !== ve.supportPointer && "PointerEvent" in window,
          emptyInsertThreshold: 5,
        };
        for (var o in n) !(o in t) && (t[o] = n[o]);
        for (var i in (de(t), this))
          "_" === i.charAt(0) &&
            "function" == typeof this[i] &&
            (this[i] = this[i].bind(this));
        (this.nativeDraggable = !t.forceFallback && X),
          this.nativeDraggable && (this.options.touchStartThreshold = 1),
          t.supportPointer
            ? _e(e, "pointerdown", this._onTapStart)
            : (_e(e, "mousedown", this._onTapStart),
              _e(e, "touchstart", this._onTapStart)),
          this.nativeDraggable &&
            (_e(e, "dragover", this), _e(e, "dragenter", this)),
          A.push(this.el),
          t.store && t.store.get && this.sort(t.store.get(this) || []);
      }
      function be(e, t, n, o) {
        if (e) {
          n = n || B;
          do {
            if (
              (null != t &&
                (">" === t[0] ? e.parentNode === n && Re(e, t) : Re(e, t))) ||
              (o && e === n)
            )
              return e;
            if (e === n) break;
          } while ((e = ye(e)));
        }
        return null;
      }
      function ye(e) {
        return e.host && e !== B && e.host.nodeType ? e.host : e.parentNode;
      }
      function _e(e, t, n) {
        e.addEventListener(t, n, !H && q);
      }
      function Ce(e, t, n) {
        e.removeEventListener(t, n, !H && q);
      }
      function we(e, t, n) {
        if (e && t)
          if (e.classList) e.classList[n ? "add" : "remove"](t);
          else {
            var o = (" " + e.className + " ")
              .replace(N, " ")
              .replace(" " + t + " ", " ");
            e.className = (o + (n ? " " + t : "")).replace(N, " ");
          }
      }
      function ke(e, t, n) {
        var o = e && e.style;
        if (o) {
          if (void 0 === n)
            return (
              B.defaultView && B.defaultView.getComputedStyle
                ? (n = B.defaultView.getComputedStyle(e, ""))
                : e.currentStyle && (n = e.currentStyle),
              void 0 === t ? n : n[t]
            );
          t in o || -1 !== t.indexOf("webkit") || (t = "-webkit-" + t),
            (o[t] = n + ("string" == typeof n ? "" : "px"));
        }
      }
      function xe(e) {
        var t = "";
        do {
          var n = ke(e, "transform");
          n && "none" !== n && (t = n + " " + t);
        } while ((e = e.parentNode));
        return window.DOMMatrix
          ? new DOMMatrix(t)
          : window.WebKitCSSMatrix
          ? new WebKitCSSMatrix(t)
          : window.CSSMatrix
          ? new CSSMatrix(t)
          : void 0;
      }
      function $e(e, t, n) {
        if (e) {
          var o = e.getElementsByTagName(t),
            i = 0,
            a = o.length;
          if (n) for (; i < a; i++) n(o[i], i);
          return o;
        }
        return [];
      }
      function Se(e, t, n, i, a, s, r, l, c, u, d) {
        var m,
          p = (e = e || t[L]).options,
          h = "on" + n.charAt(0).toUpperCase() + n.substr(1);
        !window.CustomEvent || H || V
          ? (m = B.createEvent("Event")).initEvent(n, !0, !0)
          : (m = new CustomEvent(n, { bubbles: !0, cancelable: !0 })),
          (m.to = a || t),
          (m.from = s || t),
          (m.item = i || t),
          (m.clone = o),
          (m.oldIndex = r),
          (m.newIndex = l),
          (m.oldDraggableIndex = c),
          (m.newDraggableIndex = u),
          (m.originalEvent = d),
          (m.pullMode = f ? f.lastPutMode : void 0),
          t && t.dispatchEvent(m),
          p[h] && p[h].call(e, m);
      }
      function De(e, t, n, o, i, a, s, r) {
        var l,
          c,
          u = e[L],
          d = u.options.onMove;
        return (
          !window.CustomEvent || H || V
            ? (l = B.createEvent("Event")).initEvent("move", !0, !0)
            : (l = new CustomEvent("move", { bubbles: !0, cancelable: !0 })),
          (l.to = t),
          (l.from = e),
          (l.dragged = n),
          (l.draggedRect = o),
          (l.related = i || t),
          (l.relatedRect = a || Ue(t)),
          (l.willInsertAfter = r),
          (l.originalEvent = s),
          e.dispatchEvent(l),
          d && (c = d.call(u, l, s)),
          c
        );
      }
      function Te(e) {
        e.draggable = !1;
      }
      function Ee() {
        Q = !1;
      }
      function Pe(t, o, i) {
        for (var a = 0, s = 0, r = t.children; s < r.length; ) {
          if (
            "none" !== r[s].style.display &&
            r[s] !== n &&
            r[s] !== e &&
            be(r[s], i.draggable, t, !1)
          ) {
            if (a === o) return r[s];
            a++;
          }
          s++;
        }
        return null;
      }
      function Oe(e) {
        for (
          var t = e.lastElementChild;
          t && (t === n || "none" === ke(t, "display"));

        )
          t = t.previousElementSibling;
        return t || null;
      }
      function Ae(t) {
        return Fe(e) < Fe(t) ? 1 : -1;
      }
      function Ie(e) {
        for (
          var t = e.tagName + e.className + e.src + e.href + e.textContent,
            n = t.length,
            o = 0;
          n--;

        )
          o += t.charCodeAt(n);
        return o.toString(36);
      }
      function Fe(e, t) {
        var n = 0;
        if (!e || !e.parentNode) return -1;
        for (; e && (e = e.previousElementSibling); )
          "TEMPLATE" === e.nodeName.toUpperCase() ||
            e === o ||
            (t && !Re(e, t)) ||
            n++;
        return n;
      }
      function Re(e, t) {
        if (t) {
          if ((">" === t[0] && (t = t.substring(1)), e))
            try {
              if (e.matches) return e.matches(t);
              if (e.msMatchesSelector) return e.msMatchesSelector(t);
              if (e.webkitMatchesSelector) return e.webkitMatchesSelector(t);
            } catch (e) {
              return !1;
            }
          return !1;
        }
      }
      function Ne(e, t) {
        return function () {
          if (!fe) {
            var n = arguments,
              o = this;
            fe = U(function () {
              1 === n.length ? e.call(o, n[0]) : e.apply(o, n), (fe = void 0);
            }, t);
          }
        };
      }
      function Le(e, t) {
        if (e && t) for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
        return e;
      }
      function Me(e) {
        return Y && Y.dom
          ? Y.dom(e).cloneNode(!0)
          : z
          ? z(e).clone(!0)[0]
          : e.cloneNode(!0);
      }
      function Be(e) {
        return U(e, 0);
      }
      function je(e) {
        return clearTimeout(e);
      }
      function Ue(e, t, n, o) {
        if (e.getBoundingClientRect || e === M) {
          var i, a, s, r, l, c, u;
          if (
            (e !== M && e !== re()
              ? ((a = (i = e.getBoundingClientRect()).top),
                (s = i.left),
                (r = i.bottom),
                (l = i.right),
                (c = i.height),
                (u = i.width))
              : ((a = 0),
                (s = 0),
                (r = window.innerHeight),
                (l = window.innerWidth),
                (c = window.innerHeight),
                (u = window.innerWidth)),
            o && e !== M && ((n = n || e.parentNode), !H))
          )
            do {
              if (
                n &&
                n.getBoundingClientRect &&
                "none" !== ke(n, "transform")
              ) {
                var d = n.getBoundingClientRect();
                (a -= d.top + j(ke(n, "border-top-width"))),
                  (s -= d.left + j(ke(n, "border-left-width"))),
                  (r = a + i.height),
                  (l = s + i.width);
                break;
              }
            } while ((n = n.parentNode));
          if (t && e !== M) {
            var m = xe(n || e),
              p = m && m.a,
              h = m && m.d;
            m && ((r = (a /= h) + (c /= h)), (l = (s /= p) + (u /= p)));
          }
          return { top: a, left: s, bottom: r, right: l, width: u, height: c };
        }
      }
      function ze(e, t) {
        for (var n = se(e, !0), o = Ue(e)[t]; n; ) {
          var i = Ue(n)[t];
          if (!("top" === t || "left" === t ? o >= i : o <= i)) return n;
          if (n === re()) break;
          n = se(n, !1);
        }
        return !1;
      }
      function Ye(e) {
        var t = 0,
          n = 0,
          o = re();
        if (e)
          do {
            var i = xe(e),
              a = i.a,
              s = i.d;
            (t += e.scrollLeft * a), (n += e.scrollTop * s);
          } while (e !== o && (e = e.parentNode));
        return [t, n];
      }
      return (
        (ve.prototype = {
          constructor: ve,
          _computeIsAligned: function (t) {
            var o;
            if (
              (n && !Z
                ? (pe(), (o = B.elementFromPoint(t.clientX, t.clientY)), he())
                : (o = t.target),
              (o = be(o, this.options.draggable, this.el, !1)),
              !ee && e && e.parentNode === this.el)
            ) {
              for (
                var i, a, s, r, l, c, u, d, m = this.el.children, p = 0;
                p < m.length;
                p++
              )
                be(m[p], this.options.draggable, this.el, !1) &&
                  m[p] !== o &&
                  (m[p].sortableMouseAligned =
                    ((i = t.clientX),
                    (a = t.clientY),
                    (s = m[p]),
                    (r = this._getDirection(t, null)),
                    this.options,
                    void 0,
                    void 0,
                    void 0,
                    void 0,
                    (l = Ue(s)),
                    (c = "vertical" === r ? l.left : l.top),
                    (u = "vertical" === r ? l.right : l.bottom),
                    c < (d = "vertical" === r ? i : a) && d < u));
              be(o, this.options.draggable, this.el, !0) || (w = null),
                (ee = !0),
                U(function () {
                  ee = !1;
                }, 30);
            }
          },
          _getDirection: function (t, n) {
            return "function" == typeof this.options.direction
              ? this.options.direction.call(this, t, n, e)
              : this.options.direction;
          },
          _onTapStart: function (t) {
            if (t.cancelable) {
              var n,
                o,
                i = this,
                a = this.el,
                r = this.options,
                l = r.preventOnFilter,
                c = t.type,
                u = t.touches && t.touches[0],
                d = (u || t).target,
                m =
                  (t.target.shadowRoot &&
                    ((t.path && t.path[0]) ||
                      (t.composedPath && t.composedPath()[0]))) ||
                  d,
                p = r.filter;
              if (
                ((function (e) {
                  ie.length = 0;
                  var t = e.getElementsByTagName("input"),
                    n = t.length;
                  for (; n--; ) {
                    var o = t[n];
                    o.checked && ie.push(o);
                  }
                })(a),
                !e &&
                  !(
                    (/mousedown|pointerdown/.test(c) && 0 !== t.button) ||
                    r.disabled ||
                    m.isContentEditable ||
                    ((d = be(d, r.draggable, a, !1)), s === d)
                  ))
              ) {
                if (
                  ((n = Fe(d)),
                  (o = Fe(d, r.draggable)),
                  "function" == typeof p)
                ) {
                  if (p.call(this, t, d, this))
                    return (
                      Se(i, m, "filter", d, a, a, n, void 0, o),
                      void (l && t.cancelable && t.preventDefault())
                    );
                } else if (
                  p &&
                  (p = p.split(",").some(function (e) {
                    if ((e = be(m, e.trim(), a, !1)))
                      return Se(i, e, "filter", d, a, a, n, void 0, o), !0;
                  }))
                )
                  return void (l && t.cancelable && t.preventDefault());
                (r.handle && !be(m, r.handle, a, !1)) ||
                  this._prepareDragStart(t, u, d, n, o);
              }
            }
          },
          _handleAutoScroll: function (t, n) {
            if (e && this.options.scroll) {
              var o = t.clientX,
                i = t.clientY,
                a = B.elementFromPoint(o, i),
                s = this;
              if (n || V || H || W) {
                ce(t, s.options, a, n);
                var r = se(a, !0);
                !E ||
                  (g && o === v && i === b) ||
                  (g && clearInterval(g),
                  (g = setInterval(function () {
                    if (e) {
                      var a = se(B.elementFromPoint(o, i), !0);
                      a !== r && ((r = a), ue(), ce(t, s.options, r, n));
                    }
                  }, 10)),
                  (v = o),
                  (b = i));
              } else {
                if (!s.options.bubbleScroll || se(a, !0) === re())
                  return void ue();
                ce(t, s.options, se(a, !1), !1);
              }
            }
          },
          _prepareDragStart: function (n, o, r, l, c) {
            var d,
              p = this,
              f = p.el,
              g = p.options,
              v = f.ownerDocument;
            r &&
              !e &&
              r.parentNode === f &&
              ((i = f),
              (t = (e = r).parentNode),
              (a = e.nextSibling),
              (s = r),
              (h = g.group),
              (u = l),
              (m = c),
              (y = {
                target: e,
                clientX: (o || n).clientX,
                clientY: (o || n).clientY,
              }),
              (this._lastX = (o || n).clientX),
              (this._lastY = (o || n).clientY),
              (e.style["will-change"] = "all"),
              (e.style.transition = ""),
              (e.style.transform = ""),
              (d = function () {
                p._disableDelayedDragEvents(),
                  !G && p.nativeDraggable && (e.draggable = !0),
                  p._triggerDragStart(n, o),
                  Se(p, i, "choose", e, i, i, u, void 0, m),
                  we(e, g.chosenClass, !0);
              }),
              g.ignore.split(",").forEach(function (t) {
                $e(e, t.trim(), Te);
              }),
              _e(v, "dragover", ge),
              _e(v, "mousemove", ge),
              _e(v, "touchmove", ge),
              _e(v, "mouseup", p._onDrop),
              _e(v, "touchend", p._onDrop),
              _e(v, "touchcancel", p._onDrop),
              G &&
                this.nativeDraggable &&
                ((this.options.touchStartThreshold = 4), (e.draggable = !0)),
              !g.delay ||
              (g.delayOnTouchOnly && !o) ||
              (this.nativeDraggable && (V || H))
                ? d()
                : (_e(v, "mouseup", p._disableDelayedDrag),
                  _e(v, "touchend", p._disableDelayedDrag),
                  _e(v, "touchcancel", p._disableDelayedDrag),
                  _e(v, "mousemove", p._delayedDragTouchMoveHandler),
                  _e(v, "touchmove", p._delayedDragTouchMoveHandler),
                  g.supportPointer &&
                    _e(v, "pointermove", p._delayedDragTouchMoveHandler),
                  (p._dragStartTimer = U(d, g.delay))));
          },
          _delayedDragTouchMoveHandler: function (e) {
            var t = e.touches ? e.touches[0] : e;
            oe(te(t.clientX - this._lastX), te(t.clientY - this._lastY)) >=
              Math.floor(
                this.options.touchStartThreshold /
                  ((this.nativeDraggable && window.devicePixelRatio) || 1)
              ) && this._disableDelayedDrag();
          },
          _disableDelayedDrag: function () {
            e && Te(e),
              clearTimeout(this._dragStartTimer),
              this._disableDelayedDragEvents();
          },
          _disableDelayedDragEvents: function () {
            var e = this.el.ownerDocument;
            Ce(e, "mouseup", this._disableDelayedDrag),
              Ce(e, "touchend", this._disableDelayedDrag),
              Ce(e, "touchcancel", this._disableDelayedDrag),
              Ce(e, "mousemove", this._delayedDragTouchMoveHandler),
              Ce(e, "touchmove", this._delayedDragTouchMoveHandler),
              Ce(e, "pointermove", this._delayedDragTouchMoveHandler);
          },
          _triggerDragStart: function (t, n) {
            (n = n || ("touch" == t.pointerType ? t : null)),
              !this.nativeDraggable || n
                ? this.options.supportPointer
                  ? _e(B, "pointermove", this._onTouchMove)
                  : _e(B, n ? "touchmove" : "mousemove", this._onTouchMove)
                : (_e(e, "dragend", this),
                  _e(i, "dragstart", this._onDragStart));
            try {
              B.selection
                ? Be(function () {
                    B.selection.empty();
                  })
                : window.getSelection().removeAllRanges();
            } catch (e) {}
          },
          _dragStarted: function (t, n) {
            if (((P = !1), i && e)) {
              this.nativeDraggable &&
                (_e(B, "dragover", this._handleAutoScroll),
                _e(B, "dragover", me));
              var o = this.options;
              !t && we(e, o.dragClass, !1),
                we(e, o.ghostClass, !0),
                ke(e, "transform", ""),
                (ve.active = this),
                t && this._appendGhost(),
                Se(this, i, "start", e, i, i, u, void 0, m, void 0, n);
            } else this._nulling();
          },
          _emulateDragOver: function (t) {
            if (_) {
              if (this._lastX === _.clientX && this._lastY === _.clientY && !t)
                return;
              (this._lastX = _.clientX), (this._lastY = _.clientY), pe();
              for (
                var n = B.elementFromPoint(_.clientX, _.clientY), o = n;
                n &&
                n.shadowRoot &&
                (n = n.shadowRoot.elementFromPoint(_.clientX, _.clientY)) !== o;

              )
                o = n;
              if (o)
                do {
                  if (o[L])
                    if (
                      o[L]._onDragOver({
                        clientX: _.clientX,
                        clientY: _.clientY,
                        target: n,
                        rootEl: o,
                      }) &&
                      !this.options.dragoverBubble
                    )
                      break;
                  n = o;
                } while ((o = o.parentNode));
              e.parentNode[L]._computeIsAligned(_), he();
            }
          },
          _onTouchMove: function (e, t) {
            if (y) {
              var o = this.options,
                i = o.fallbackTolerance,
                a = o.fallbackOffset,
                s = e.touches ? e.touches[0] : e,
                r = n && xe(n),
                l = n && r && r.a,
                c = n && r && r.d,
                u = J && S && Ye(S),
                d =
                  (s.clientX - y.clientX + a.x) / (l || 1) +
                  (u ? u[0] - R[0] : 0) / (l || 1),
                m =
                  (s.clientY - y.clientY + a.y) / (c || 1) +
                  (u ? u[1] - R[1] : 0) / (c || 1),
                p = e.touches
                  ? "translate3d(" + d + "px," + m + "px,0)"
                  : "translate(" + d + "px," + m + "px)";
              if (!ve.active && !P) {
                if (
                  i &&
                  ne(te(s.clientX - this._lastX), te(s.clientY - this._lastY)) <
                    i
                )
                  return;
                this._onDragStart(e, !0);
              }
              !t && this._handleAutoScroll(s, !0),
                (C = !0),
                (_ = s),
                ke(n, "webkitTransform", p),
                ke(n, "mozTransform", p),
                ke(n, "msTransform", p),
                ke(n, "transform", p),
                e.cancelable && e.preventDefault();
            }
          },
          _appendGhost: function () {
            if (!n) {
              var t = this.options.fallbackOnBody ? B.body : i,
                o = Ue(e, !0, t, !J),
                a = (ke(e), this.options);
              if (J) {
                for (
                  S = t;
                  "static" === ke(S, "position") &&
                  "none" === ke(S, "transform") &&
                  S !== B;

                )
                  S = S.parentNode;
                if (S !== B) {
                  var s = Ue(S, !0);
                  (o.top -= s.top), (o.left -= s.left);
                }
                S !== B.body && S !== B.documentElement
                  ? (S === B && (S = re()),
                    (o.top += S.scrollTop),
                    (o.left += S.scrollLeft))
                  : (S = re()),
                  (R = Ye(S));
              }
              we((n = e.cloneNode(!0)), a.ghostClass, !1),
                we(n, a.fallbackClass, !0),
                we(n, a.dragClass, !0),
                ke(n, "box-sizing", "border-box"),
                ke(n, "margin", 0),
                ke(n, "top", o.top),
                ke(n, "left", o.left),
                ke(n, "width", o.width),
                ke(n, "height", o.height),
                ke(n, "opacity", "0.8"),
                ke(n, "position", J ? "absolute" : "fixed"),
                ke(n, "zIndex", "100000"),
                ke(n, "pointerEvents", "none"),
                t.appendChild(n);
            }
          },
          _onDragStart: function (t, n) {
            var a = this,
              s = t.dataTransfer,
              r = a.options;
            ((o = Me(e)).draggable = !1),
              (o.style["will-change"] = ""),
              this._hideClone(),
              we(o, a.options.chosenClass, !1),
              (a._cloneId = Be(function () {
                a.options.removeCloneOnHide || i.insertBefore(o, e),
                  Se(a, i, "clone", e);
              })),
              !n && we(e, r.dragClass, !0),
              n
                ? ((O = !0), (a._loopId = setInterval(a._emulateDragOver, 50)))
                : (Ce(B, "mouseup", a._onDrop),
                  Ce(B, "touchend", a._onDrop),
                  Ce(B, "touchcancel", a._onDrop),
                  s &&
                    ((s.effectAllowed = "move"),
                    r.setData && r.setData.call(a, s, e)),
                  _e(B, "drop", a),
                  ke(e, "transform", "translateZ(0)")),
              (P = !0),
              (a._dragStartId = Be(a._dragStarted.bind(a, n, t))),
              _e(B, "selectstart", a),
              W && ke(B.body, "user-select", "none");
          },
          _onDragOver: function (n) {
            var o,
              s,
              r,
              l = this.el,
              c = n.target,
              d = this.options,
              p = d.group,
              g = ve.active,
              v = h === p,
              b = d.sort,
              y = this;
            if (!Q) {
              if (
                (void 0 !== n.preventDefault &&
                  n.cancelable &&
                  n.preventDefault(),
                (C = !0),
                (c = be(c, d.draggable, l, !0)),
                e.contains(n.target) || c.animated)
              )
                return q(!1);
              if (
                (c !== e && (O = !1),
                g &&
                  !d.disabled &&
                  (v
                    ? b || (r = !i.contains(e))
                    : f === this ||
                      ((this.lastPutMode = h.checkPull(this, g, e, n)) &&
                        p.checkPut(this, g, e, n))))
              ) {
                var _ = this._getDirection(n, c);
                if (((o = Ue(e)), r))
                  return (
                    this._hideClone(),
                    (t = i),
                    a ? i.insertBefore(e, a) : i.appendChild(e),
                    q(!0)
                  );
                var S = Oe(l);
                if (
                  !S ||
                  ((function (e, t, n) {
                    var o = Ue(Oe(n)),
                      i = "vertical" === t ? e.clientY : e.clientX,
                      a = "vertical" === t ? e.clientX : e.clientY,
                      s = "vertical" === t ? o.bottom : o.right,
                      r = "vertical" === t ? o.left : o.top,
                      l = "vertical" === t ? o.right : o.bottom;
                    return "vertical" === t
                      ? a > l + 10 || (a <= l && i > s && a >= r)
                      : (i > s && a > r) || (i <= s && a > l + 10);
                  })(n, _, l) &&
                    !S.animated)
                ) {
                  if (
                    (S && l === n.target && (c = S),
                    c && (s = Ue(c)),
                    v ? g._hideClone() : g._showClone(this),
                    !1 !== De(i, l, e, o, c, s, n, !!c))
                  )
                    return l.appendChild(e), (t = l), (D = null), H(), q(!0);
                } else if (c && c !== e && c.parentNode === l) {
                  var T,
                    E = 0,
                    P = c.sortableMouseAligned,
                    A = e.parentNode !== l,
                    R = "vertical" === _ ? "top" : "left",
                    N = ze(c, "top") || ze(e, "top"),
                    M = N ? N.scrollTop : void 0;
                  if (
                    (w !== c && ((x = null), (T = Ue(c)[R]), (I = !1)),
                    ((function (t, n, o) {
                      var i = (t === e && D) || Ue(t),
                        a = (n === e && D) || Ue(n),
                        s = "vertical" === o ? i.left : i.top,
                        r = "vertical" === o ? i.right : i.bottom,
                        l = "vertical" === o ? i.width : i.height,
                        c = "vertical" === o ? a.left : a.top,
                        u = "vertical" === o ? a.right : a.bottom,
                        d = "vertical" === o ? a.width : a.height;
                      return s === c || r === u || s + l / 2 === c + d / 2;
                    })(e, c, _) &&
                      P) ||
                    A ||
                    N ||
                    d.invertSwap ||
                    "insert" === x ||
                    "swap" === x
                      ? ("swap" !== x && (F = d.invertSwap || A),
                        (E = (function (t, n, o, i, a, s, r) {
                          var l = Ue(n),
                            c = "vertical" === o ? t.clientY : t.clientX,
                            u = "vertical" === o ? l.height : l.width,
                            d = "vertical" === o ? l.top : l.left,
                            m = "vertical" === o ? l.bottom : l.right,
                            p = Ue(e),
                            h = !1;
                          if (!s)
                            if (r && $ < u * i)
                              if (
                                (!I &&
                                  (1 === k
                                    ? c > d + (u * a) / 2
                                    : c < m - (u * a) / 2) &&
                                  (I = !0),
                                I)
                              )
                                h = !0;
                              else {
                                "vertical" === o ? p.top : p.left,
                                  "vertical" === o ? p.bottom : p.right;
                                if (1 === k ? c < d + $ : c > m - $)
                                  return -1 * k;
                              }
                            else if (
                              c > d + (u * (1 - i)) / 2 &&
                              c < m - (u * (1 - i)) / 2
                            )
                              return Ae(n);
                          if (
                            (h = h || s) &&
                            (c < d + (u * a) / 2 || c > m - (u * a) / 2)
                          )
                            return c > d + u / 2 ? 1 : -1;
                          return 0;
                        })(
                          n,
                          c,
                          _,
                          d.swapThreshold,
                          null == d.invertedSwapThreshold
                            ? d.swapThreshold
                            : d.invertedSwapThreshold,
                          F,
                          w === c
                        )),
                        (x = "swap"))
                      : ((E = Ae(c)), (x = "insert")),
                    0 === E)
                  )
                    return q(!1);
                  (D = null), (w = c), (k = E), (s = Ue(c));
                  var j = c.nextElementSibling,
                    z = !1,
                    Y = De(i, l, e, o, c, s, n, (z = 1 === E));
                  if (!1 !== Y)
                    return (
                      (1 !== Y && -1 !== Y) || (z = 1 === Y),
                      (Q = !0),
                      U(Ee, 30),
                      v ? g._hideClone() : g._showClone(this),
                      z && !j
                        ? l.appendChild(e)
                        : c.parentNode.insertBefore(e, z ? j : c),
                      N && le(N, 0, M - N.scrollTop),
                      (t = e.parentNode),
                      void 0 === T || F || ($ = te(T - Ue(c)[R])),
                      H(),
                      q(!0)
                    );
                }
                if (l.contains(e)) return q(!1);
              }
              return !1;
            }
            function q(t) {
              return (
                t &&
                  (v ? g._hideClone() : g._showClone(y),
                  g &&
                    (we(e, f ? f.options.ghostClass : g.options.ghostClass, !1),
                    we(e, d.ghostClass, !0)),
                  f !== y && y !== ve.active
                    ? (f = y)
                    : y === ve.active && (f = null),
                  o && y._animate(o, e),
                  c && s && y._animate(s, c)),
                ((c === e && !e.animated) || (c === l && !c.animated)) &&
                  (w = null),
                d.dragoverBubble ||
                  n.rootEl ||
                  c === B ||
                  (y._handleAutoScroll(n),
                  e.parentNode[L]._computeIsAligned(n),
                  !t && ge(n)),
                !d.dragoverBubble && n.stopPropagation && n.stopPropagation(),
                !0
              );
            }
            function H() {
              Se(y, i, "change", c, l, i, u, Fe(e), m, Fe(e, d.draggable), n);
            }
          },
          _animate: function (t, n) {
            var o = this.options.animation;
            if (o) {
              var i = Ue(n);
              if (
                (n === e && (D = i),
                1 === t.nodeType && (t = Ue(t)),
                t.left + t.width / 2 !== i.left + i.width / 2 ||
                  t.top + t.height / 2 !== i.top + i.height / 2)
              ) {
                var a = xe(this.el),
                  s = a && a.a,
                  r = a && a.d;
                ke(n, "transition", "none"),
                  ke(
                    n,
                    "transform",
                    "translate3d(" +
                      (t.left - i.left) / (s || 1) +
                      "px," +
                      (t.top - i.top) / (r || 1) +
                      "px,0)"
                  ),
                  this._repaint(n),
                  ke(
                    n,
                    "transition",
                    "transform " +
                      o +
                      "ms" +
                      (this.options.easing ? " " + this.options.easing : "")
                  ),
                  ke(n, "transform", "translate3d(0,0,0)");
              }
              "number" == typeof n.animated && clearTimeout(n.animated),
                (n.animated = U(function () {
                  ke(n, "transition", ""),
                    ke(n, "transform", ""),
                    (n.animated = !1);
                }, o));
            }
          },
          _repaint: function (e) {
            return e.offsetWidth;
          },
          _offMoveEvents: function () {
            Ce(B, "touchmove", this._onTouchMove),
              Ce(B, "pointermove", this._onTouchMove),
              Ce(B, "dragover", ge),
              Ce(B, "mousemove", ge),
              Ce(B, "touchmove", ge);
          },
          _offUpEvents: function () {
            var e = this.el.ownerDocument;
            Ce(e, "mouseup", this._onDrop),
              Ce(e, "touchend", this._onDrop),
              Ce(e, "pointerup", this._onDrop),
              Ce(e, "touchcancel", this._onDrop),
              Ce(B, "selectstart", this);
          },
          _onDrop: function (s) {
            var r = this.el,
              l = this.options;
            (P = !1),
              (E = !1),
              (F = !1),
              (I = !1),
              clearInterval(this._loopId),
              clearInterval(g),
              ue(),
              clearTimeout(fe),
              (fe = void 0),
              clearTimeout(this._dragStartTimer),
              je(this._cloneId),
              je(this._dragStartId),
              Ce(B, "mousemove", this._onTouchMove),
              this.nativeDraggable &&
                (Ce(B, "drop", this),
                Ce(r, "dragstart", this._onDragStart),
                Ce(B, "dragover", this._handleAutoScroll),
                Ce(B, "dragover", me)),
              W && ke(B.body, "user-select", ""),
              this._offMoveEvents(),
              this._offUpEvents(),
              s &&
                (C &&
                  (s.cancelable && s.preventDefault(),
                  !l.dropBubble && s.stopPropagation()),
                n && n.parentNode && n.parentNode.removeChild(n),
                (i === t || (f && "clone" !== f.lastPutMode)) &&
                  o &&
                  o.parentNode &&
                  o.parentNode.removeChild(o),
                e &&
                  (this.nativeDraggable && Ce(e, "dragend", this),
                  Te(e),
                  (e.style["will-change"] = ""),
                  we(e, f ? f.options.ghostClass : this.options.ghostClass, !1),
                  we(e, this.options.chosenClass, !1),
                  Se(this, i, "unchoose", e, t, i, u, null, m, null, s),
                  i !== t
                    ? ((d = Fe(e)),
                      (p = Fe(e, l.draggable)),
                      d >= 0 &&
                        (Se(null, t, "add", e, t, i, u, d, m, p, s),
                        Se(this, i, "remove", e, t, i, u, d, m, p, s),
                        Se(null, t, "sort", e, t, i, u, d, m, p, s),
                        Se(this, i, "sort", e, t, i, u, d, m, p, s)),
                      f && f.save())
                    : e.nextSibling !== a &&
                      ((d = Fe(e)),
                      (p = Fe(e, l.draggable)),
                      d >= 0 &&
                        (Se(this, i, "update", e, t, i, u, d, m, p, s),
                        Se(this, i, "sort", e, t, i, u, d, m, p, s))),
                  ve.active &&
                    ((null != d && -1 !== d) || ((d = u), (p = m)),
                    Se(this, i, "end", e, t, i, u, d, m, p, s),
                    this.save()))),
              this._nulling();
          },
          _nulling: function () {
            (i =
              e =
              t =
              n =
              a =
              o =
              s =
              r =
              l =
              T.length =
              g =
              v =
              b =
              y =
              _ =
              C =
              d =
              u =
              w =
              k =
              D =
              f =
              h =
              ve.active =
                null),
              ie.forEach(function (e) {
                e.checked = !0;
              }),
              (ie.length = 0);
          },
          handleEvent: function (t) {
            switch (t.type) {
              case "drop":
              case "dragend":
                this._onDrop(t);
                break;
              case "dragenter":
              case "dragover":
                e &&
                  (this._onDragOver(t),
                  (function (e) {
                    e.dataTransfer && (e.dataTransfer.dropEffect = "move");
                    e.cancelable && e.preventDefault();
                  })(t));
                break;
              case "selectstart":
                t.preventDefault();
            }
          },
          toArray: function () {
            for (
              var e,
                t = [],
                n = this.el.children,
                o = 0,
                i = n.length,
                a = this.options;
              o < i;
              o++
            )
              be((e = n[o]), a.draggable, this.el, !1) &&
                t.push(e.getAttribute(a.dataIdAttr) || Ie(e));
            return t;
          },
          sort: function (e) {
            var t = {},
              n = this.el;
            this.toArray().forEach(function (e, o) {
              var i = n.children[o];
              be(i, this.options.draggable, n, !1) && (t[e] = i);
            }, this),
              e.forEach(function (e) {
                t[e] && (n.removeChild(t[e]), n.appendChild(t[e]));
              });
          },
          save: function () {
            var e = this.options.store;
            e && e.set && e.set(this);
          },
          closest: function (e, t) {
            return be(e, t || this.options.draggable, this.el, !1);
          },
          option: function (e, t) {
            var n = this.options;
            if (void 0 === t) return n[e];
            (n[e] = t), "group" === e && de(n);
          },
          destroy: function () {
            var e = this.el;
            (e[L] = null),
              Ce(e, "mousedown", this._onTapStart),
              Ce(e, "touchstart", this._onTapStart),
              Ce(e, "pointerdown", this._onTapStart),
              this.nativeDraggable &&
                (Ce(e, "dragover", this), Ce(e, "dragenter", this)),
              Array.prototype.forEach.call(
                e.querySelectorAll("[draggable]"),
                function (e) {
                  e.removeAttribute("draggable");
                }
              ),
              this._onDrop(),
              A.splice(A.indexOf(this.el), 1),
              (this.el = e = null);
          },
          _hideClone: function () {
            o.cloneHidden ||
              (ke(o, "display", "none"),
              (o.cloneHidden = !0),
              o.parentNode &&
                this.options.removeCloneOnHide &&
                o.parentNode.removeChild(o));
          },
          _showClone: function (t) {
            "clone" === t.lastPutMode
              ? o.cloneHidden &&
                (i.contains(e) && !this.options.group.revertClone
                  ? i.insertBefore(o, e)
                  : a
                  ? i.insertBefore(o, a)
                  : i.appendChild(o),
                this.options.group.revertClone && this._animate(e, o),
                ke(o, "display", ""),
                (o.cloneHidden = !1))
              : this._hideClone();
          },
        }),
        _e(B, "touchmove", function (e) {
          (ve.active || P) && e.cancelable && e.preventDefault();
        }),
        (ve.utils = {
          on: _e,
          off: Ce,
          css: ke,
          find: $e,
          is: function (e, t) {
            return !!be(e, t, e, !1);
          },
          extend: Le,
          throttle: Ne,
          closest: be,
          toggleClass: we,
          clone: Me,
          index: Fe,
          nextTick: Be,
          cancelNextTick: je,
          detectDirection: ae,
          getChild: Pe,
        }),
        (ve.create = function (e, t) {
          return new ve(e, t);
        }),
        (ve.version = "1.9.0"),
        ve
      );
    });
  },
  833: function (e, t, n) {
    "use strict";
    t.a = {
      data: function () {
        return { count: { success: 0, error: 0 } };
      },
      methods: {
        deleteEntities: function (e, t, n, o) {
          var i = this;
          e.forEach(function (a) {
            i.$http
              .post(i.$root.getAjaxUrl + "/" + i.name + "/delete/" + a)
              .then(function () {
                i.deleteEntityResult(e, !0, t), n(a);
              })
              .catch(function () {
                i.deleteEntityResult(e, !1, t), o(a);
              });
          });
        },
        deleteEntityResult: function (e, t, n) {
          e.pop(),
            t ? this.count.success++ : this.count.error++,
            0 === e.length &&
              (this.count.success &&
                this.notify(
                  this.$root.labels.success,
                  this.count.success +
                    " " +
                    (this.count.success > 1
                      ? this.successMessage.multiple
                      : this.successMessage.single),
                  "success"
                ),
              this.count.error &&
                this.notify(
                  this.$root.labels.error,
                  this.count.error +
                    " " +
                    (this.count.error > 1
                      ? this.errorMessage.multiple
                      : this.errorMessage.single),
                  "error"
                ),
              (this.count.success = 0),
              (this.count.error = 0),
              n());
        },
      },
    };
  },
  881: function (e, t, n) {
    var o = n(685)(n(896), n(897), !1, null, null, null);
    e.exports = o.exports;
  },
  882: function (e, t, n) {
    var o = n(685)(n(898), n(899), !1, null, null, null);
    e.exports = o.exports;
  },
  896: function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.default = {
        props: {
          zoomSettings: null,
          paymentsSettings: null,
          generalSettings: null,
          settings: null,
          providers: null,
        },
        data: function () {
          var e = this;
          return {
            products: [],
            searchCounter: 0,
            loadingProducts: !1,
            integrationsSettingsCollapse: null,
            paymentsSettingsCollapse: null,
            generalSettingsCollapse: null,
            rules: {
              redirectURLAfter: [
                {
                  validator: function (t, n, o) {
                    e.clearValidation();
                    var i = e.$refs.settings.model.redirectUrlAfterAppointment;
                    "" === i || /^((http|https):\/\/)/.test(i)
                      ? o()
                      : o(new Error(e.$root.labels.enter_valid_url_warning));
                  },
                  trigger: "submit",
                },
              ],
            },
            errors: { redirectURLAfter: "" },
            options: {
              defaultAppointmentStatus: [
                { label: this.$root.labels.pending, value: "pending" },
                { label: this.$root.labels.approved, value: "approved" },
              ],
              minimumTime: [
                { label: this.$root.labels.disabled, value: 0 },
                { label: this.$root.labels.min10, value: 600 },
                { label: this.$root.labels.min12, value: 720 },
                { label: this.$root.labels.min15, value: 900 },
                { label: this.$root.labels.min30, value: 1800 },
                { label: this.$root.labels.min45, value: 2700 },
                { label: this.$root.labels.h1, value: 3600 },
                { label: this.$root.labels.h1min30, value: 5400 },
                { label: this.$root.labels.h2, value: 7200 },
                { label: this.$root.labels.h3, value: 10800 },
                { label: this.$root.labels.h4, value: 14400 },
                { label: this.$root.labels.h6, value: 21600 },
                { label: this.$root.labels.h8, value: 28800 },
                { label: this.$root.labels.h9, value: 32400 },
                { label: this.$root.labels.h10, value: 36e3 },
                { label: this.$root.labels.h11, value: 39600 },
                { label: this.$root.labels.h12, value: 43200 },
                { label: this.$root.labels.day1, value: 86400 },
                { label: this.$root.labels.days2, value: 172800 },
                { label: this.$root.labels.days3, value: 259200 },
                { label: this.$root.labels.days4, value: 345600 },
                { label: this.$root.labels.days5, value: 432e3 },
                { label: this.$root.labels.days6, value: 518400 },
                { label: this.$root.labels.week1, value: 604800 },
                { label: this.$root.labels.weeks2, value: 1209600 },
                { label: this.$root.labels.weeks3, value: 1814400 },
                { label: this.$root.labels.weeks4, value: 2419200 },
                { label: this.$root.labels.months3, value: 7884e3 },
                { label: this.$root.labels.months6, value: 15768e3 },
              ],
            },
          };
        },
        mounted: function () {
          if (
            (this.setProducts(),
            null !== this.generalSettings &&
              "numberOfDaysAvailableForBooking" in this.generalSettings &&
              !this.generalSettings.numberOfDaysAvailableForBooking)
          )
            for (
              var e = document.getElementsByClassName("am-number-of-days"),
                t = 0;
              t < e.length;
              t++
            )
              e[t].getElementsByClassName("el-input__inner")[0].value = "";
        },
        computed: {
          isZoomProvidersConnected: function () {
            return (
              null !== this.providers &&
              !this.providers
                .map(function (e) {
                  return e.zoomUserId;
                })
                .includes(null) &&
              0 !== this.providers.length
            );
          },
        },
        methods: {
          setProducts: function () {
            var e = this;
            this.$root.settings.payments.wc.enabled &&
              (this.$root.settings.payments.wc.enabled &&
                this.paymentsSettings.wc.productId &&
                0 ===
                  this.$root.wcProducts.filter(function (t) {
                    return t.id === e.paymentsSettings.wc.productId;
                  }).length &&
                this.fetchProducts(
                  { id: this.paymentsSettings.wc.productId },
                  function (t) {
                    t.length && e.products.push(t[0]);
                  }
                ),
              (this.products = this.$root.wcProducts));
          },
          selectedProduct: function (e) {
            if (
              0 ===
              this.$root.wcProducts.filter(function (t) {
                return t.id === e;
              }).length
            ) {
              var t = this.products.find(function (t) {
                return t.id === e;
              });
              t && this.$root.wcProducts.push(t);
            }
          },
          fetchProducts: function (e, t) {
            var n = this;
            clearTimeout(this.searchProductsTimer),
              (this.loadingProducts = !0),
              this.searchCounter++,
              (this.searchProductsTimer = setTimeout(function () {
                var o = n.searchCounter;
                n.$http
                  .get(n.$root.getAjaxUrl + "/payment/wc/products", {
                    params: e,
                  })
                  .then(function (e) {
                    o >= n.searchCounter &&
                      t(
                        e.data.data.products.sort(function (e, t) {
                          return e.name.toLowerCase() > t.name.toLowerCase()
                            ? 1
                            : -1;
                        })
                      ),
                      (n.loadingProducts = !1);
                  })
                  .catch(function (e) {
                    n.loadingProducts = !1;
                  });
              }, 500));
          },
          searchProducts: function (e) {
            var t = this;
            e
              ? this.fetchProducts({ name: e }, function (e) {
                  t.products = e;
                })
              : (this.products = this.$root.wcProducts);
          },
          clearValidation: function () {},
        },
      });
  },
  897: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          n = e._self._c || t;
        return n(
          "div",
          { staticClass: "am-entity-settings" },
          [
            null !== e.generalSettings
              ? n(
                  "el-collapse",
                  {
                    model: {
                      value: e.generalSettingsCollapse,
                      callback: function (t) {
                        e.generalSettingsCollapse = t;
                      },
                      expression: "generalSettingsCollapse",
                    },
                  },
                  [
                    n(
                      "el-collapse-item",
                      {
                        staticClass: "am-setting-box",
                        attrs: { name: "generalSettings" },
                      },
                      [
                        n("template", { slot: "title" }, [
                          n("img", {
                            staticClass: "svg",
                            staticStyle: { "margin-right": "10px" },
                            attrs: {
                              src: e.$root.getUrl + "public/img/setting.svg",
                            },
                          }),
                          e._v(" " + e._s(e.$root.labels.general) + "\n      "),
                        ]),
                        e._v(" "),
                        null !== e.generalSettings &&
                        "defaultAppointmentStatus" in e.generalSettings
                          ? n(
                              "el-form-item",
                              { attrs: { label: "placeholder" } },
                              [
                                n(
                                  "label",
                                  { attrs: { slot: "label" }, slot: "label" },
                                  [
                                    e._v(
                                      "\n          " +
                                        e._s(
                                          e.$root.labels
                                            .default_appointment_status
                                        ) +
                                        ":\n          "
                                    ),
                                    n(
                                      "el-tooltip",
                                      { attrs: { placement: "top" } },
                                      [
                                        n("div", {
                                          attrs: { slot: "content" },
                                          domProps: {
                                            innerHTML: e._s(
                                              e.$root.labels
                                                .default_appointment_status
                                            ),
                                          },
                                          slot: "content",
                                        }),
                                        e._v(" "),
                                        n("i", {
                                          staticClass:
                                            "el-icon-question am-tooltip-icon",
                                        }),
                                      ]
                                    ),
                                  ],
                                  1
                                ),
                                e._v(" "),
                                n(
                                  "el-select",
                                  {
                                    attrs: {
                                      clearable: "",
                                      placeholder:
                                        e.options.defaultAppointmentStatus.find(
                                          function (t) {
                                            return (
                                              t.value ===
                                              e.$root.settings.general
                                                .defaultAppointmentStatus
                                            );
                                          }
                                        ).label,
                                    },
                                    model: {
                                      value:
                                        e.generalSettings
                                          .defaultAppointmentStatus,
                                      callback: function (t) {
                                        e.$set(
                                          e.generalSettings,
                                          "defaultAppointmentStatus",
                                          t
                                        );
                                      },
                                      expression:
                                        "generalSettings.defaultAppointmentStatus",
                                    },
                                  },
                                  e._l(
                                    e.options.defaultAppointmentStatus,
                                    function (e) {
                                      return n("el-option", {
                                        key: e.value,
                                        attrs: {
                                          label: e.label,
                                          value: e.value,
                                        },
                                      });
                                    }
                                  ),
                                  1
                                ),
                              ],
                              1
                            )
                          : e._e(),
                        e._v(" "),
                        null !== e.generalSettings &&
                        "minimumTimeRequirementPriorToBooking" in
                          e.generalSettings
                          ? n(
                              "el-form-item",
                              { attrs: { label: "placeholder" } },
                              [
                                n(
                                  "label",
                                  { attrs: { slot: "label" }, slot: "label" },
                                  [
                                    e._v(
                                      "\n          " +
                                        e._s(
                                          e.$root.labels
                                            .minimum_time_before_booking
                                        ) +
                                        ":\n          "
                                    ),
                                    n(
                                      "el-tooltip",
                                      { attrs: { placement: "top" } },
                                      [
                                        n("div", {
                                          attrs: { slot: "content" },
                                          domProps: {
                                            innerHTML: e._s(
                                              e.$root.labels
                                                .minimum_time_before_booking_tooltip
                                            ),
                                          },
                                          slot: "content",
                                        }),
                                        e._v(" "),
                                        n("i", {
                                          staticClass:
                                            "el-icon-question am-tooltip-icon",
                                        }),
                                      ]
                                    ),
                                  ],
                                  1
                                ),
                                e._v(" "),
                                n(
                                  "el-select",
                                  {
                                    attrs: {
                                      clearable: "",
                                      "collapse-tags": "",
                                      placeholder: "Select",
                                      placeholder: e.options.minimumTime.find(
                                        function (t) {
                                          return (
                                            t.value ===
                                            e.$root.settings.general
                                              .minimumTimeRequirementPriorToBooking
                                          );
                                        }
                                      ).label,
                                    },
                                    model: {
                                      value:
                                        e.generalSettings
                                          .minimumTimeRequirementPriorToBooking,
                                      callback: function (t) {
                                        e.$set(
                                          e.generalSettings,
                                          "minimumTimeRequirementPriorToBooking",
                                          t
                                        );
                                      },
                                      expression:
                                        "generalSettings.minimumTimeRequirementPriorToBooking",
                                    },
                                  },
                                  e._l(e.options.minimumTime, function (e) {
                                    return n("el-option", {
                                      key: e.value,
                                      attrs: { label: e.label, value: e.value },
                                    });
                                  }),
                                  1
                                ),
                              ],
                              1
                            )
                          : e._e(),
                        e._v(" "),
                        null !== e.generalSettings &&
                        "minimumTimeRequirementPriorToCanceling" in
                          e.generalSettings
                          ? n(
                              "el-form-item",
                              { attrs: { label: "placeholder" } },
                              [
                                n(
                                  "label",
                                  { attrs: { slot: "label" }, slot: "label" },
                                  [
                                    e._v(
                                      "\n          " +
                                        e._s(
                                          e.$root.labels
                                            .minimum_time_before_canceling
                                        ) +
                                        ":\n          "
                                    ),
                                    n(
                                      "el-tooltip",
                                      { attrs: { placement: "top" } },
                                      [
                                        n("div", {
                                          attrs: { slot: "content" },
                                          domProps: {
                                            innerHTML: e._s(
                                              e.$root.labels
                                                .minimum_time_before_canceling_tooltip
                                            ),
                                          },
                                          slot: "content",
                                        }),
                                        e._v(" "),
                                        n("i", {
                                          staticClass:
                                            "el-icon-question am-tooltip-icon",
                                        }),
                                      ]
                                    ),
                                  ],
                                  1
                                ),
                                e._v(" "),
                                n(
                                  "el-select",
                                  {
                                    attrs: {
                                      clearable: "",
                                      placeholder: e.options.minimumTime.find(
                                        function (t) {
                                          return (
                                            t.value ===
                                            e.$root.settings.general
                                              .minimumTimeRequirementPriorToCanceling
                                          );
                                        }
                                      ).label,
                                    },
                                    model: {
                                      value:
                                        e.generalSettings
                                          .minimumTimeRequirementPriorToCanceling,
                                      callback: function (t) {
                                        e.$set(
                                          e.generalSettings,
                                          "minimumTimeRequirementPriorToCanceling",
                                          t
                                        );
                                      },
                                      expression:
                                        "generalSettings.minimumTimeRequirementPriorToCanceling",
                                    },
                                  },
                                  e._l(e.options.minimumTime, function (e) {
                                    return n("el-option", {
                                      key: e.value,
                                      attrs: { label: e.label, value: e.value },
                                    });
                                  }),
                                  1
                                ),
                              ],
                              1
                            )
                          : e._e(),
                        e._v(" "),
                        null !== e.generalSettings &&
                        "minimumTimeRequirementPriorToRescheduling" in
                          e.generalSettings
                          ? n(
                              "el-form-item",
                              { attrs: { label: "placeholder" } },
                              [
                                n(
                                  "label",
                                  { attrs: { slot: "label" }, slot: "label" },
                                  [
                                    e._v(
                                      "\n          " +
                                        e._s(
                                          e.$root.labels
                                            .minimum_time_before_rescheduling
                                        ) +
                                        ":\n          "
                                    ),
                                    n(
                                      "el-tooltip",
                                      { attrs: { placement: "top" } },
                                      [
                                        n("div", {
                                          attrs: { slot: "content" },
                                          domProps: {
                                            innerHTML: e._s(
                                              e.$root.labels
                                                .minimum_time_before_rescheduling_tooltip
                                            ),
                                          },
                                          slot: "content",
                                        }),
                                        e._v(" "),
                                        n("i", {
                                          staticClass:
                                            "el-icon-question am-tooltip-icon",
                                        }),
                                      ]
                                    ),
                                  ],
                                  1
                                ),
                                e._v(" "),
                                n(
                                  "el-select",
                                  {
                                    attrs: {
                                      clearable: "",
                                      placeholder: e.options.minimumTime.find(
                                        function (t) {
                                          return (
                                            t.value ===
                                            e.$root.settings.general
                                              .minimumTimeRequirementPriorToRescheduling
                                          );
                                        }
                                      ).label,
                                    },
                                    model: {
                                      value:
                                        e.generalSettings
                                          .minimumTimeRequirementPriorToRescheduling,
                                      callback: function (t) {
                                        e.$set(
                                          e.generalSettings,
                                          "minimumTimeRequirementPriorToRescheduling",
                                          t
                                        );
                                      },
                                      expression:
                                        "generalSettings.minimumTimeRequirementPriorToRescheduling",
                                    },
                                  },
                                  e._l(e.options.minimumTime, function (e) {
                                    return n("el-option", {
                                      key: e.value,
                                      attrs: { label: e.label, value: e.value },
                                    });
                                  }),
                                  1
                                ),
                              ],
                              1
                            )
                          : e._e(),
                        e._v(" "),
                        null !== e.generalSettings &&
                        "numberOfDaysAvailableForBooking" in e.generalSettings
                          ? n(
                              "el-form-item",
                              { attrs: { label: "placeholder" } },
                              [
                                n(
                                  "label",
                                  { attrs: { slot: "label" }, slot: "label" },
                                  [
                                    e._v(
                                      "\n          " +
                                        e._s(
                                          e.$root.labels
                                            .period_available_for_booking
                                        ) +
                                        ":\n          "
                                    ),
                                    n(
                                      "el-tooltip",
                                      { attrs: { placement: "top" } },
                                      [
                                        n("div", {
                                          attrs: { slot: "content" },
                                          domProps: {
                                            innerHTML: e._s(
                                              e.$root.labels
                                                .period_available_for_booking_tooltip
                                            ),
                                          },
                                          slot: "content",
                                        }),
                                        e._v(" "),
                                        n("i", {
                                          staticClass:
                                            "el-icon-question am-tooltip-icon",
                                        }),
                                      ]
                                    ),
                                  ],
                                  1
                                ),
                                e._v(" "),
                                n("el-input-number", {
                                  staticClass: "am-number-of-days",
                                  attrs: {
                                    min: 0,
                                    placeholder:
                                      e.$root.settings.general.numberOfDaysAvailableForBooking.toString(),
                                  },
                                  model: {
                                    value:
                                      e.generalSettings
                                        .numberOfDaysAvailableForBooking,
                                    callback: function (t) {
                                      e.$set(
                                        e.generalSettings,
                                        "numberOfDaysAvailableForBooking",
                                        t
                                      );
                                    },
                                    expression:
                                      "generalSettings.numberOfDaysAvailableForBooking",
                                  },
                                }),
                              ],
                              1
                            )
                          : e._e(),
                        e._v(" "),
                        null !== e.generalSettings &&
                        "redirectUrlAfterAppointment" in e.generalSettings
                          ? n(
                              "el-form-item",
                              {
                                attrs: {
                                  label: "placeholder",
                                  prop: "redirectURLAfter",
                                  error: e.errors.redirectURLAfter,
                                },
                              },
                              [
                                n(
                                  "label",
                                  { attrs: { slot: "label" }, slot: "label" },
                                  [
                                    e._v(
                                      "\n          " +
                                        e._s(
                                          e.$root.labels
                                            .redirect_url_after_appointment
                                        ) +
                                        ":\n          "
                                    ),
                                    n(
                                      "el-tooltip",
                                      { attrs: { placement: "top" } },
                                      [
                                        n("div", {
                                          attrs: { slot: "content" },
                                          domProps: {
                                            innerHTML: e._s(
                                              e.$root.labels
                                                .redirect_url_after_appointment_tooltip
                                            ),
                                          },
                                          slot: "content",
                                        }),
                                        e._v(" "),
                                        n("i", {
                                          staticClass:
                                            "el-icon-question am-tooltip-icon",
                                        }),
                                      ]
                                    ),
                                  ],
                                  1
                                ),
                                e._v(" "),
                                n("el-input", {
                                  attrs: {
                                    "auto-complete": "off",
                                    placeholder:
                                      e.$root.settings.general.redirectUrlAfterAppointment.toString(),
                                  },
                                  on: {
                                    input: function (t) {
                                      return e.clearValidation();
                                    },
                                  },
                                  model: {
                                    value:
                                      e.generalSettings
                                        .redirectUrlAfterAppointment,
                                    callback: function (t) {
                                      e.$set(
                                        e.generalSettings,
                                        "redirectUrlAfterAppointment",
                                        t
                                      );
                                    },
                                    expression:
                                      "generalSettings.redirectUrlAfterAppointment",
                                  },
                                }),
                              ],
                              1
                            )
                          : e._e(),
                      ],
                      2
                    ),
                  ],
                  1
                )
              : e._e(),
            e._v(" "),
            null !== e.paymentsSettings
              ? n(
                  "el-collapse",
                  {
                    staticClass: "am-entity-settings-payments",
                    model: {
                      value: e.paymentsSettingsCollapse,
                      callback: function (t) {
                        e.paymentsSettingsCollapse = t;
                      },
                      expression: "paymentsSettingsCollapse",
                    },
                  },
                  [
                    n(
                      "el-collapse-item",
                      {
                        staticClass: "am-setting-box",
                        attrs: { name: "paymentsSettings" },
                      },
                      [
                        n("template", { slot: "title" }, [
                          n("img", {
                            staticClass: "svg",
                            staticStyle: { "margin-right": "10px" },
                            attrs: {
                              src:
                                e.$root.getUrl + "public/img/credit-card.svg",
                            },
                          }),
                          e._v(
                            " " + e._s(e.$root.labels.payments) + "\n      "
                          ),
                        ]),
                        e._v(" "),
                        e.$root.settings.payments.onSite
                          ? n(
                              "div",
                              { staticClass: "am-setting-box am-switch-box" },
                              [
                                n(
                                  "el-row",
                                  {
                                    attrs: {
                                      type: "flex",
                                      align: "middle",
                                      gutter: 24,
                                    },
                                  },
                                  [
                                    n("el-col", { attrs: { span: 16 } }, [
                                      e._v(
                                        "\n            " +
                                          e._s(e.$root.labels.on_site) +
                                          "\n          "
                                      ),
                                    ]),
                                    e._v(" "),
                                    n(
                                      "el-col",
                                      {
                                        staticClass: "align-right",
                                        attrs: { span: 8 },
                                      },
                                      [
                                        n("el-switch", {
                                          attrs: {
                                            "active-text": "",
                                            "inactive-text": "",
                                          },
                                          model: {
                                            value: e.paymentsSettings.onSite,
                                            callback: function (t) {
                                              e.$set(
                                                e.paymentsSettings,
                                                "onSite",
                                                t
                                              );
                                            },
                                            expression:
                                              "paymentsSettings.onSite",
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
                            )
                          : e._e(),
                        e._v(" "),
                        e.$root.settings.payments.wc.enabled
                          ? n(
                              "el-col",
                              { attrs: { span: 24 } },
                              [
                                n(
                                  "el-form-item",
                                  { attrs: { label: "placeholder" } },
                                  [
                                    n(
                                      "label",
                                      {
                                        attrs: { slot: "label" },
                                        slot: "label",
                                      },
                                      [
                                        e._v(
                                          "\n            " +
                                            e._s(e.$root.labels.wc_product) +
                                            ":\n            "
                                        ),
                                        n(
                                          "el-tooltip",
                                          { attrs: { placement: "top" } },
                                          [
                                            n("div", {
                                              attrs: { slot: "content" },
                                              domProps: {
                                                innerHTML: e._s(
                                                  e.$root.labels
                                                    .wc_product_tooltip
                                                ),
                                              },
                                              slot: "content",
                                            }),
                                            e._v(" "),
                                            n("i", {
                                              staticClass:
                                                "el-icon-question am-tooltip-icon",
                                            }),
                                          ]
                                        ),
                                      ],
                                      1
                                    ),
                                    e._v(" "),
                                    n(
                                      "el-select",
                                      {
                                        attrs: {
                                          filterable: "",
                                          remote: "",
                                          "remote-method": e.searchProducts,
                                          loading: e.loadingProducts,
                                          placeholder: "",
                                        },
                                        on: { change: e.selectedProduct },
                                        model: {
                                          value:
                                            e.paymentsSettings.wc.productId,
                                          callback: function (t) {
                                            e.$set(
                                              e.paymentsSettings.wc,
                                              "productId",
                                              t
                                            );
                                          },
                                          expression:
                                            "paymentsSettings.wc.productId",
                                        },
                                      },
                                      e._l(e.products, function (e) {
                                        return n("el-option", {
                                          key: e.id,
                                          attrs: { label: e.name, value: e.id },
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
                        e.$root.settings.payments.payPal.enabled
                          ? n(
                              "div",
                              { staticClass: "am-setting-box am-switch-box" },
                              [
                                n(
                                  "el-row",
                                  {
                                    attrs: {
                                      type: "flex",
                                      align: "middle",
                                      gutter: 24,
                                    },
                                  },
                                  [
                                    n("el-col", { attrs: { span: 16 } }, [
                                      n("img", {
                                        staticClass: "svg",
                                        attrs: {
                                          width: "60px",
                                          src:
                                            e.$root.getUrl +
                                            "public/img/payments/paypal-light.svg",
                                        },
                                      }),
                                    ]),
                                    e._v(" "),
                                    n(
                                      "el-col",
                                      {
                                        staticClass: "align-right",
                                        attrs: { span: 8 },
                                      },
                                      [
                                        n("el-switch", {
                                          attrs: {
                                            "active-text": "",
                                            "inactive-text": "",
                                          },
                                          model: {
                                            value:
                                              e.paymentsSettings.payPal.enabled,
                                            callback: function (t) {
                                              e.$set(
                                                e.paymentsSettings.payPal,
                                                "enabled",
                                                t
                                              );
                                            },
                                            expression:
                                              "paymentsSettings.payPal.enabled",
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
                            )
                          : e._e(),
                        e._v(" "),
                        e.$root.settings.payments.stripe.enabled
                          ? n(
                              "div",
                              { staticClass: "am-setting-box am-switch-box" },
                              [
                                n(
                                  "el-row",
                                  {
                                    attrs: {
                                      type: "flex",
                                      align: "middle",
                                      gutter: 24,
                                    },
                                  },
                                  [
                                    n("el-col", { attrs: { span: 16 } }, [
                                      n("img", {
                                        staticClass: "svg",
                                        attrs: {
                                          width: "40px",
                                          src:
                                            e.$root.getUrl +
                                            "public/img/payments/stripe.svg",
                                        },
                                      }),
                                    ]),
                                    e._v(" "),
                                    n(
                                      "el-col",
                                      {
                                        staticClass: "align-right",
                                        attrs: { span: 8 },
                                      },
                                      [
                                        n("el-switch", {
                                          attrs: {
                                            "active-text": "",
                                            "inactive-text": "",
                                          },
                                          model: {
                                            value:
                                              e.paymentsSettings.stripe.enabled,
                                            callback: function (t) {
                                              e.$set(
                                                e.paymentsSettings.stripe,
                                                "enabled",
                                                t
                                              );
                                            },
                                            expression:
                                              "paymentsSettings.stripe.enabled",
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
                            )
                          : e._e(),
                        e._v(" "),
                        e.$root.settings.payments.mollie.enabled
                          ? n(
                              "div",
                              { staticClass: "am-setting-box am-switch-box" },
                              [
                                n(
                                  "el-row",
                                  {
                                    attrs: {
                                      type: "flex",
                                      align: "middle",
                                      gutter: 24,
                                    },
                                  },
                                  [
                                    n("el-col", { attrs: { span: 16 } }, [
                                      n("img", {
                                        staticClass: "svg",
                                        attrs: {
                                          width: "60px",
                                          src:
                                            e.$root.getUrl +
                                            "public/img/payments/mollie.svg",
                                        },
                                      }),
                                    ]),
                                    e._v(" "),
                                    n(
                                      "el-col",
                                      {
                                        staticClass: "align-right",
                                        attrs: { span: 8 },
                                      },
                                      [
                                        n("el-switch", {
                                          attrs: {
                                            "active-text": "",
                                            "inactive-text": "",
                                          },
                                          model: {
                                            value:
                                              e.paymentsSettings.mollie.enabled,
                                            callback: function (t) {
                                              e.$set(
                                                e.paymentsSettings.mollie,
                                                "enabled",
                                                t
                                              );
                                            },
                                            expression:
                                              "paymentsSettings.mollie.enabled",
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
                            )
                          : e._e(),
                        e._v(" "),
                        e.$root.settings.payments.wc.enabled ||
                        (e.paymentsSettings.onSite &&
                          (e.$root.settings.payments.onSite ||
                            !e.paymentsSettings.onSite)) ||
                        (e.paymentsSettings.payPal.enabled &&
                          (e.$root.settings.payments.payPal.enabled ||
                            !e.paymentsSettings.payPal.enabled)) ||
                        (e.paymentsSettings.stripe.enabled &&
                          (e.$root.settings.payments.stripe.enabled ||
                            !e.paymentsSettings.stripe.enabled)) ||
                        (e.paymentsSettings.mollie.enabled &&
                          (e.$root.settings.payments.mollie.enabled ||
                            !e.paymentsSettings.mollie.enabled))
                          ? e._e()
                          : n("el-alert", {
                              attrs: {
                                type: "warning",
                                "show-icon": "",
                                title: "",
                                description: e.$root.labels.payment_warning,
                                closable: !1,
                              },
                            }),
                      ],
                      2
                    ),
                  ],
                  1
                )
              : e._e(),
            e._v(" "),
            e.zoomSettings
              ? n(
                  "el-collapse",
                  {
                    model: {
                      value: e.integrationsSettingsCollapse,
                      callback: function (t) {
                        e.integrationsSettingsCollapse = t;
                      },
                      expression: "integrationsSettingsCollapse",
                    },
                  },
                  [
                    n(
                      "el-collapse-item",
                      {
                        staticClass: "am-setting-box",
                        attrs: { name: "integrationsSettings" },
                      },
                      [
                        n("template", { slot: "title" }, [
                          n("img", {
                            staticClass: "svg",
                            staticStyle: { "margin-right": "10px" },
                            attrs: {
                              src: e.$root.getUrl + "public/img/web-hook.svg",
                            },
                          }),
                          e._v(
                            " " +
                              e._s(e.$root.labels.integrations_settings) +
                              "\n      "
                          ),
                        ]),
                        e._v(" "),
                        n(
                          "div",
                          { staticClass: "am-setting-box am-switch-box" },
                          [
                            n(
                              "el-row",
                              {
                                attrs: {
                                  type: "flex",
                                  align: "middle",
                                  gutter: 24,
                                },
                              },
                              [
                                n("el-col", { attrs: { span: 16 } }, [
                                  e._v(
                                    "\n            " +
                                      e._s(e.$root.labels.zoom) +
                                      "\n          "
                                  ),
                                ]),
                                e._v(" "),
                                n(
                                  "el-col",
                                  {
                                    staticClass: "align-right",
                                    attrs: { span: 8 },
                                  },
                                  [
                                    n("el-switch", {
                                      attrs: {
                                        "active-text": "",
                                        "inactive-text": "",
                                      },
                                      model: {
                                        value: e.zoomSettings.enabled,
                                        callback: function (t) {
                                          e.$set(e.zoomSettings, "enabled", t);
                                        },
                                        expression: "zoomSettings.enabled",
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
                        e.zoomSettings.enabled && !e.isZoomProvidersConnected
                          ? n("el-alert", {
                              attrs: {
                                type: "warning",
                                "show-icon": "",
                                title: "",
                                description: e.$root.labels.zoom_warning,
                                closable: !1,
                              },
                            })
                          : e._e(),
                      ],
                      2
                    ),
                  ],
                  1
                )
              : e._e(),
          ],
          1
        );
      },
      staticRenderFns: [],
    };
  },
  898: function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.default = {
        name: "DialogTranslate",
        props: {
          passedTranslations: null,
          name: "",
          allLanguagesData: null,
          usedLanguages: null,
          type: { required: !1, default: "name", type: String },
          tab: "",
          cfOptions: {
            required: !1,
            default: function () {
              return [];
            },
            type: Array,
          },
        },
        data: function () {
          return {
            translations: null,
            oldTranslations: null,
            newTranslations: [],
            settings: null,
            newLanguages: [],
            languageWidth: 12,
            options: [],
            allLanguagesKeys: [],
          };
        },
        mounted: function () {
          var e = this;
          (this.translations = this.passedTranslations
            ? JSON.parse(this.passedTranslations)
            : {}),
            (this.oldTranslations = this.translations[this.type]
              ? this.translations[this.type]
              : {}),
            (this.oldTranslations
              ? this.usedLanguages.filter(function (t) {
                  return !Object.keys(e.oldTranslations).includes(t);
                })
              : this.usedLanguages
            ).forEach(function (t) {
              e.oldTranslations[t] = "";
            }),
            _.isEmpty(this.oldTranslations) && this.addLanguage(),
            (this.oldTranslations = JSON.parse(
              JSON.stringify(this.oldTranslations)
            )),
            ("description" !== this.type &&
              "cf" !== this.tab &&
              "url" !== this.type) ||
              (this.languageWidth = 24);
          var t = JSON.parse(JSON.stringify(this.cfOptions));
          t.forEach(function (t) {
            t.translations
              ? (t.translations = JSON.parse(t.translations))
              : (t.translations = {}),
              e.usedLanguages.forEach(function (e) {
                t.translations[e] || (t.translations[e] = "");
              });
          }),
            (this.options = t),
            (this.allLanguagesKeys = Object.keys(this.allLanguagesData));
        },
        computed: {
          dialogStyle: function () {
            return "cf" !== this.tab && "category" !== this.tab
              ? "margin-bottom: 0"
              : "";
          },
        },
        methods: {
          saveDialog: function () {
            var e = this;
            this.newTranslations.forEach(function (t) {
              t.lan &&
                (e.usedLanguages.includes(t.lan) || e.newLanguages.push(t.lan),
                (e.oldTranslations[t.lan] = t.value));
            }),
              (this.translations[this.type] = this.oldTranslations),
              this.options.forEach(function (e) {
                (e.edited = !0),
                  (e.translations = JSON.stringify(e.translations));
              }),
              this.$emit(
                "saveDialogTranslate",
                JSON.stringify(this.translations),
                this.newLanguages,
                this.tab,
                this.options
              );
          },
          closeDialog: function () {
            this.$emit("closeDialogTranslate");
          },
          addLanguage: function () {
            this.newTranslations.push({ lan: "", value: "" });
          },
          getLanguageLabel: function (e, t) {
            return t && "name" === this.type && "cf" !== this.tab
              ? this.allLanguagesData[e].name.substring(0, 21)
              : this.allLanguagesData[e].name;
          },
          getLanguageFlag: function (e) {
            return e &&
              this.allLanguagesData[e] &&
              this.allLanguagesData[e].country_code
              ? this.$root.getUrl +
                  "public/img/flags/" +
                  this.allLanguagesData[e].country_code +
                  ".png"
              : this.$root.getUrl + "public/img/grey.svg";
          },
          goBack: function () {
            "cf" === this.tab || "category" === this.tab
              ? this.closeDialog()
              : this.saveDialog();
          },
          getHeaderTitle: function () {
            return "cf" === this.tab
              ? this.$root.labels.translate +
                  " " +
                  this.$root.labels.custom_field
              : "description" === this.type
              ? this.$root.labels.translate +
                " " +
                this.$root.labels.description
              : "url" === this.type
              ? this.$root.labels.url
              : this.$root.labels.translate + " " + this.name;
          },
        },
      });
  },
  899: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          n = e._self._c || t;
        return n("div", { staticClass: "am-dialog-translate" }, [
          n(
            "div",
            { staticClass: "am-dialog-scrollable", style: e.dialogStyle },
            [
              n(
                "div",
                { staticClass: "am-dialog-header" },
                [
                  n(
                    "el-row",
                    [
                      n("el-col", { attrs: { span: 16 } }, [
                        n("img", {
                          staticClass: "am-dialog-translate-svg-back",
                          attrs: {
                            src: e.$root.getUrl + "public/img/arrow-back.svg",
                          },
                          on: { click: e.goBack },
                        }),
                        e._v(" "),
                        n("h2", [e._v(e._s(e.getHeaderTitle()))]),
                      ]),
                      e._v(" "),
                      n(
                        "el-col",
                        { staticClass: "align-right", attrs: { span: 8 } },
                        [
                          n("el-button", {
                            staticClass: "am-dialog-close",
                            attrs: { size: "small", icon: "el-icon-close" },
                            on: { click: e.closeDialog },
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
              e._l(e.oldTranslations, function (t, o) {
                return n(
                  "div",
                  { key: o },
                  [
                    e.usedLanguages && -1 !== e.usedLanguages.indexOf(o)
                      ? n(
                          "el-row",
                          { attrs: { gutter: 28, type: "flex" } },
                          [
                            n(
                              "el-col",
                              {
                                staticStyle: { "padding-right": "0" },
                                attrs: {
                                  xs: e.languageWidth,
                                  sm: e.languageWidth,
                                },
                              },
                              [
                                n("div", { staticClass: "used-language" }, [
                                  n("img", {
                                    staticClass: "am-dialog-translate-flag",
                                    attrs: { src: e.getLanguageFlag(o) },
                                  }),
                                  e._v(
                                    "\n            " +
                                      e._s(e.getLanguageLabel(o, !0)) +
                                      "\n          "
                                  ),
                                ]),
                              ]
                            ),
                            e._v(" "),
                            "name" === e.type && "cf" !== e.tab
                              ? n(
                                  "el-col",
                                  {
                                    staticStyle: { "padding-right": "0" },
                                    attrs: { xs: 8, sm: 14 },
                                  },
                                  [
                                    n("el-input", {
                                      attrs: {
                                        type: "text",
                                        placeholder: e.$root.labels.translation,
                                      },
                                      model: {
                                        value: e.oldTranslations[o],
                                        callback: function (t) {
                                          e.$set(e.oldTranslations, o, t);
                                        },
                                        expression: "oldTranslations[key]",
                                      },
                                    }),
                                  ],
                                  1
                                )
                              : e._e(),
                          ],
                          1
                        )
                      : e._e(),
                    e._v(" "),
                    "description" === e.type &&
                    e.usedLanguages &&
                    -1 !== e.usedLanguages.indexOf(o)
                      ? n(
                          "el-row",
                          {
                            staticClass: "am-dialog-translate-description",
                            staticStyle: { "margin-bottom": "8px" },
                            attrs: { gutter: 24, type: "flex" },
                          },
                          [
                            n(
                              "el-col",
                              {
                                staticStyle: { "padding-right": "0" },
                                attrs: { sm: 24 },
                              },
                              [
                                n("el-input", {
                                  attrs: {
                                    value: t,
                                    type: "textarea",
                                    autosize: { minRows: 4, maxRows: 6 },
                                  },
                                  model: {
                                    value: e.oldTranslations[o],
                                    callback: function (t) {
                                      e.$set(e.oldTranslations, o, t);
                                    },
                                    expression: "oldTranslations[key]",
                                  },
                                }),
                              ],
                              1
                            ),
                          ],
                          1
                        )
                      : e._e(),
                    e._v(" "),
                    "url" === e.type &&
                    e.usedLanguages &&
                    -1 !== e.usedLanguages.indexOf(o)
                      ? n(
                          "el-row",
                          {
                            staticClass: "am-dialog-translate-description",
                            attrs: { gutter: 24, type: "flex" },
                          },
                          [
                            n(
                              "el-col",
                              {
                                staticStyle: { "padding-right": "0" },
                                attrs: { sm: 24 },
                              },
                              [
                                n("el-input", {
                                  attrs: { value: t },
                                  model: {
                                    value: e.oldTranslations[o],
                                    callback: function (t) {
                                      e.$set(e.oldTranslations, o, t);
                                    },
                                    expression: "oldTranslations[key]",
                                  },
                                }),
                              ],
                              1
                            ),
                          ],
                          1
                        )
                      : e._e(),
                    e._v(" "),
                    "cf" === e.tab &&
                    e.usedLanguages &&
                    -1 !== e.usedLanguages.indexOf(o)
                      ? n(
                          "el-row",
                          {
                            staticClass: "am-dialog-translate-description",
                            attrs: { gutter: 26, type: "flex" },
                          },
                          [
                            n("el-col", { attrs: { sm: 5 } }, [
                              n(
                                "div",
                                { staticClass: "am-dialog-translate-cf" },
                                [
                                  e._v(
                                    " " + e._s(e.$root.labels.label_name) + " "
                                  ),
                                ]
                              ),
                            ]),
                            e._v(" "),
                            n("el-col", { attrs: { sm: 5 } }, [
                              n(
                                "div",
                                { staticClass: "am-dialog-translate-cf-label" },
                                [n("i", [e._v(e._s(e.name))])]
                              ),
                            ]),
                            e._v(" "),
                            n(
                              "el-col",
                              {
                                staticStyle: { "padding-right": "0" },
                                attrs: { sm: 14 },
                              },
                              [
                                n("el-input", {
                                  attrs: {
                                    value: t,
                                    type: "text",
                                    placeholder: " ",
                                  },
                                  model: {
                                    value: e.oldTranslations[o],
                                    callback: function (t) {
                                      e.$set(e.oldTranslations, o, t);
                                    },
                                    expression: "oldTranslations[key]",
                                  },
                                }),
                              ],
                              1
                            ),
                          ],
                          1
                        )
                      : e._e(),
                    e._v(" "),
                    e._l(e.options, function (t, i) {
                      return e.cfOptions.length &&
                        e.usedLanguages &&
                        -1 !== e.usedLanguages.indexOf(o)
                        ? n(
                            "div",
                            [
                              n(
                                "el-row",
                                {
                                  staticClass:
                                    "am-dialog-translate-description",
                                  attrs: { gutter: 20, type: "flex" },
                                },
                                [
                                  n("el-col", { attrs: { sm: 5 } }, [
                                    n(
                                      "div",
                                      { staticClass: "am-dialog-translate-cf" },
                                      [e._v(" #" + e._s(i))]
                                    ),
                                  ]),
                                  e._v(" "),
                                  n("el-col", { attrs: { sm: 5 } }, [
                                    n(
                                      "div",
                                      {
                                        staticClass:
                                          "am-dialog-translate-cf-label",
                                      },
                                      [n("i", [e._v(e._s(t.label))])]
                                    ),
                                  ]),
                                  e._v(" "),
                                  n(
                                    "el-col",
                                    {
                                      staticStyle: { "padding-right": "0" },
                                      attrs: { sm: 14 },
                                    },
                                    [
                                      n("el-input", {
                                        attrs: {
                                          type: "text",
                                          placeholder: " ",
                                        },
                                        model: {
                                          value: t.translations[o],
                                          callback: function (n) {
                                            e.$set(t.translations, o, n);
                                          },
                                          expression:
                                            "option['translations'][key]",
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
                          )
                        : e._e();
                    }),
                  ],
                  2
                );
              }),
              e._v(" "),
              e._l(e.newTranslations, function (t, o) {
                return n(
                  "div",
                  { key: o },
                  [
                    n(
                      "el-row",
                      {
                        staticStyle: { "margin-right": "-15px" },
                        attrs: { gutter: 28, type: "flex" },
                      },
                      [
                        n(
                          "el-col",
                          {
                            staticStyle: { "padding-right": "0" },
                            attrs: { sm: e.languageWidth },
                          },
                          [
                            n(
                              "el-select",
                              {
                                attrs: {
                                  placeholder: e.$root.labels.language,
                                  clearable: "",
                                  filterable: "",
                                },
                                model: {
                                  value: e.newTranslations[o].lan,
                                  callback: function (t) {
                                    e.$set(e.newTranslations[o], "lan", t);
                                  },
                                  expression: "newTranslations[index].lan",
                                },
                              },
                              [
                                n("template", { slot: "prefix" }, [
                                  n("img", {
                                    staticClass:
                                      "am-dialog-translate-flag-selected",
                                    attrs: {
                                      src: e.getLanguageFlag(
                                        e.newTranslations[o].lan
                                      ),
                                    },
                                  }),
                                ]),
                                e._v(" "),
                                e._l(e.allLanguagesKeys, function (t, o) {
                                  return n(
                                    "el-option",
                                    {
                                      key: o,
                                      attrs: {
                                        label: e.getLanguageLabel(t, !1),
                                        value: t,
                                        disabled: t in e.oldTranslations,
                                      },
                                    },
                                    [
                                      n("span", [
                                        n("img", {
                                          staticClass:
                                            "am-dialog-translate-flag",
                                          attrs: { src: e.getLanguageFlag(t) },
                                        }),
                                        e._v(
                                          "\n                " +
                                            e._s(e.getLanguageLabel(t, !1)) +
                                            "\n              "
                                        ),
                                      ]),
                                    ]
                                  );
                                }),
                              ],
                              2
                            ),
                          ],
                          1
                        ),
                        e._v(" "),
                        "name" === e.type && "cf" !== e.tab
                          ? n(
                              "el-col",
                              {
                                staticStyle: { "padding-right": "0" },
                                attrs: { xs: 14, sm: 18 },
                              },
                              [
                                n("el-input", {
                                  attrs: {
                                    type: "text",
                                    name: t.name,
                                    placeholder: e.$root.labels.translation,
                                  },
                                  model: {
                                    value: e.newTranslations[o].value,
                                    callback: function (t) {
                                      e.$set(e.newTranslations[o], "value", t);
                                    },
                                    expression: "newTranslations[index].value",
                                  },
                                }),
                              ],
                              1
                            )
                          : e._e(),
                      ],
                      1
                    ),
                    e._v(" "),
                    "description" === e.type
                      ? n(
                          "el-row",
                          {
                            staticClass: "am-dialog-translate-description",
                            attrs: { gutter: 24, type: "flex" },
                          },
                          [
                            n(
                              "el-col",
                              { attrs: { sm: 24 } },
                              [
                                n("el-input", {
                                  attrs: {
                                    value: t,
                                    type: "textarea",
                                    autosize: { minRows: 4, maxRows: 6 },
                                  },
                                  model: {
                                    value: e.newTranslations[o].value,
                                    callback: function (t) {
                                      e.$set(e.newTranslations[o], "value", t);
                                    },
                                    expression: "newTranslations[index].value",
                                  },
                                }),
                              ],
                              1
                            ),
                          ],
                          1
                        )
                      : e._e(),
                    e._v(" "),
                    "url" === e.type
                      ? n(
                          "el-row",
                          {
                            staticClass: "am-dialog-translate-description",
                            attrs: { gutter: 24, type: "flex" },
                          },
                          [
                            n(
                              "el-col",
                              { attrs: { sm: 24 } },
                              [
                                n("el-input", {
                                  attrs: { value: t },
                                  model: {
                                    value: e.newTranslations[o].value,
                                    callback: function (t) {
                                      e.$set(e.newTranslations[o], "value", t);
                                    },
                                    expression: "newTranslations[index].value",
                                  },
                                }),
                              ],
                              1
                            ),
                          ],
                          1
                        )
                      : e._e(),
                    e._v(" "),
                    "cf" === e.tab
                      ? n(
                          "el-row",
                          {
                            staticClass: "am-dialog-translate-description",
                            attrs: { gutter: 20, type: "flex" },
                          },
                          [
                            n("el-col", { attrs: { sm: 5 } }, [
                              n(
                                "div",
                                { staticClass: "am-dialog-translate-cf" },
                                [
                                  e._v(
                                    " " + e._s(e.$root.labels.label_name) + " "
                                  ),
                                ]
                              ),
                            ]),
                            e._v(" "),
                            n("el-col", { attrs: { sm: 5 } }, [
                              n(
                                "div",
                                { staticClass: "am-dialog-translate-cf-label" },
                                [n("i", [e._v(e._s(e.name))])]
                              ),
                            ]),
                            e._v(" "),
                            n(
                              "el-col",
                              {
                                staticStyle: { "padding-right": "0" },
                                attrs: { sm: 14 },
                              },
                              [
                                n("el-input", {
                                  attrs: { type: "text", name: t.name },
                                  model: {
                                    value: e.newTranslations[o].value,
                                    callback: function (t) {
                                      e.$set(e.newTranslations[o], "value", t);
                                    },
                                    expression: "newTranslations[index].value",
                                  },
                                }),
                              ],
                              1
                            ),
                          ],
                          1
                        )
                      : e._e(),
                    e._v(" "),
                    e._l(e.options, function (t, i) {
                      return e.cfOptions.length
                        ? n(
                            "div",
                            [
                              n(
                                "el-row",
                                {
                                  staticClass:
                                    "am-dialog-translate-description",
                                  attrs: { gutter: 24, type: "flex" },
                                },
                                [
                                  n("el-col", { attrs: { sm: 5 } }, [
                                    n(
                                      "div",
                                      { staticClass: "am-dialog-translate-cf" },
                                      [e._v(" #" + e._s(i))]
                                    ),
                                  ]),
                                  e._v(" "),
                                  n("el-col", { attrs: { sm: 5 } }, [
                                    n(
                                      "div",
                                      {
                                        staticClass:
                                          "am-dialog-translate-cf-label",
                                      },
                                      [n("i", [e._v(e._s(t.label))])]
                                    ),
                                  ]),
                                  e._v(" "),
                                  n(
                                    "el-col",
                                    {
                                      staticStyle: { "padding-right": "0" },
                                      attrs: { sm: 14 },
                                    },
                                    [
                                      n("el-input", {
                                        attrs: {
                                          type: "text",
                                          placeholder: " ",
                                        },
                                        model: {
                                          value:
                                            t.translations[
                                              e.newTranslations[o].lan
                                            ],
                                          callback: function (n) {
                                            e.$set(
                                              t.translations,
                                              e.newTranslations[o].lan,
                                              n
                                            );
                                          },
                                          expression:
                                            "option['translations'][newTranslations[index].lan]",
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
                          )
                        : e._e();
                    }),
                  ],
                  2
                );
              }),
              e._v(" "),
              n("div", [
                n("img", {
                  staticClass: "am-dialog-translate-svg-plus",
                  attrs: { src: e.$root.getUrl + "public/img/plus-circle.svg" },
                  on: { click: e.addLanguage },
                }),
                e._v(" "),
                n(
                  "div",
                  { staticClass: "add-language", on: { click: e.addLanguage } },
                  [e._v(e._s(e.$root.labels.add_language))]
                ),
              ]),
            ],
            2
          ),
          e._v(" "),
          "category" === e.tab || "cf" === e.tab
            ? n("div", { staticClass: "am-dialog-footer" }, [
                n(
                  "div",
                  { staticClass: "am-dialog-footer-actions" },
                  [
                    n(
                      "el-row",
                      [
                        n(
                          "el-col",
                          { staticClass: "align-right", attrs: { sm: 24 } },
                          [
                            n(
                              "el-button",
                              {
                                attrs: { type: "" },
                                on: { click: e.closeDialog },
                              },
                              [e._v(e._s(e.$root.labels.cancel))]
                            ),
                            e._v(" "),
                            n(
                              "el-button",
                              {
                                staticClass: "am-dialog-create",
                                attrs: { type: "primary" },
                                on: { click: e.saveDialog },
                              },
                              [e._v(e._s(e.$root.labels.save))]
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
              ])
            : e._e(),
        ]);
      },
      staticRenderFns: [],
    };
  },
  905: function (e, t, n) {
    "use strict";
    var o = n(701),
      i = n(0),
      a = n.n(i),
      s = n(714),
      r = n(337);
    t.a = {
      mixins: [s.a, o.a, r.a],
      data: function () {
        return {
          event: null,
          bookingCreatedCount: 0,
          attributes: [{ highlight: { backgroundColor: "#ddd" }, dates: [] }],
          selectedRecurringDate: null,
          recurringDates: null,
          updateStatusDisabled: !1,
          recurringPeriods: [
            { label: this.$root.labels.recurring_type_weekly, value: "weekly" },
            {
              label: this.$root.labels.recurring_type_monthly,
              value: "monthly",
            },
            { label: this.$root.labels.recurring_type_yearly, value: "yearly" },
          ],
          colors: [
            "#1788FB",
            "#4BBEC6",
            "#FBC22D",
            "#FA3C52",
            "#D696B8",
            "#689BCA",
            "#26CC2B",
            "#FD7E35",
            "#E38587",
            "#774DFB",
          ],
          options: {
            fetched: !1,
            entities: {
              settings: {
                payments: { wc: null },
                general: { usedLanguages: [] },
              },
              employees: [],
              locations: [],
              tags: [],
            },
          },
        };
      },
      methods: {
        showDialogEditEvent: function (e) {
          (this.dialogEvent = !0), (this.event = null), this.getEvent(e);
        },
        closeDialogEvent: function () {
          this.dialogEvent = !1;
        },
        getInitEventObject: function () {
          return {
            id: 0,
            parentId: null,
            name: "",
            periods: [
              {
                id: null,
                eventId: null,
                range: null,
                startTime: null,
                endTime: null,
                bookings: [],
              },
            ],
            bookingStartsNow: !0,
            bookingStartsDate: null,
            bookingStartsTime: null,
            bookingEndsAfter: !0,
            bookingEndsDate: null,
            bookingEndsTime: null,
            bookingOpensRec: "same",
            bookingClosesRec: "same",
            isRecurring: !1,
            recurring: { cycle: null, order: null, until: null },
            bringingAnyone: !0,
            bookMultipleTimes: !0,
            maxCapacity: null,
            price: 0,
            locationId: null,
            customLocation: null,
            providers: this.getInitEventProviders(),
            tags: [],
            description: null,
            gallery: [],
            colorType: 2,
            selectedColor: "#1788FB",
            customColor: "#1788FB",
            show: !0,
            places: 0,
            addToCalendarData: null,
            showAddToCalendar: !1,
            showEventDetails: !1,
            showEventBooking: !1,
            translations: null,
            canceling: !1,
            deleting: !1,
            bookable: !0,
            deposit: 0,
            depositPayment: "disabled",
            depositPerPerson: 1,
            settings: this.getInitEntitySettings("event"),
          };
        },
        showDialogNewEvent: function () {
          (this.event = this.getInitEventObject()), (this.dialogEvent = !0);
        },
        getEvent: function (e) {
          var t = this,
            n = null,
            o = "";
          void 0 !== this.$store &&
            void 0 !== this.$store.state.cabinet &&
            "provider" === this.$store.state.cabinet.cabinetType &&
            ((o =
              "" === this.$store.state.cabinet.timeZone
                ? "UTC"
                : this.$store.state.cabinet.timeZone),
            (n = Object.assign(this.getAuthorizationHeaderObject(), {
              params: {
                source: "cabinet-" + this.$store.state.cabinet.cabinetType,
                timeZone: o,
              },
            }))),
            this.$http
              .get(this.$root.getAjaxUrl + "/events/" + e, n)
              .then(function (e) {
                var n = Object.assign(
                    t.getInitEventObject(),
                    e.data.data.event
                  ),
                  i = [],
                  s = t;
                e.data.data.event.periods.forEach(function (e) {
                  "UTC" === o &&
                    ((e.periodStart = s.getConvertedUtcToLocalDateTime(
                      e.periodStart
                    )),
                    (e.periodEnd = s.getConvertedUtcToLocalDateTime(
                      e.periodEnd
                    )));
                  var t = a()(e.periodStart, "YYYY-MM-DD HH:mm:ss"),
                    n = a()(e.periodEnd, "YYYY-MM-DD HH:mm:ss"),
                    r = e.periodStart.split(" ")[1].substring(0, 5),
                    l = e.periodEnd.split(" ")[1].substring(0, 5);
                  "00:00" === l && (n.subtract(1, "days"), (l = "24:00")),
                    i.push({
                      id: e.id ? e.id : null,
                      eventId: e.eventId ? e.eventId : null,
                      range: { start: t.toDate(), end: n.toDate() },
                      startTime: r,
                      endTime: l,
                      bookings: e.bookings,
                      zoomMeeting: e.zoomMeeting,
                    });
                }),
                  (n.periods = i);
                var r = [];
                n.tags.forEach(function (e) {
                  r.push(e.name);
                }),
                  (n.tags = r),
                  null === n.recurring
                    ? (n.recurring = { cycle: null, until: null, order: null })
                    : ((n.isRecurring = !0),
                      (n.recurring.cycleInterval =
                        null === e.data.data.event.recurring.cycleInterval
                          ? 1
                          : e.data.data.event.recurring.cycleInterval),
                      (n.recurring.until = e.data.data.event.recurring.until
                        ? a()(e.data.data.event.recurring.until).toDate()
                        : null)),
                  (n.bookingStartsNow =
                    null === e.data.data.event.bookingOpens),
                  (n.bookingStartsDate = e.data.data.event.bookingOpens
                    ? a()(e.data.data.event.bookingOpens).toDate()
                    : null),
                  (n.bookingStartsTime = e.data.data.event.bookingOpens
                    ? e.data.data.event.bookingOpens
                        .split(" ")[1]
                        .substring(0, 5)
                    : null),
                  (n.bookingEndsAfter =
                    null === e.data.data.event.bookingCloses),
                  (n.bookingEndsDate = e.data.data.event.bookingCloses
                    ? a()(e.data.data.event.bookingCloses).toDate()
                    : null),
                  (n.bookingEndsTime = e.data.data.event.bookingCloses
                    ? e.data.data.event.bookingCloses
                        .split(" ")[1]
                        .substring(0, 5)
                    : null),
                  (n.zoomUserId = e.data.data.event.zoomUserId);
                var l = n.bookings;
                l.forEach(function (e) {
                  if (e.info) {
                    var t = JSON.parse(e.info);
                    (e.customer.firstName = t.firstName),
                      (e.customer.lastName = t.lastName),
                      (e.customer.phone = t.phone);
                  } else {
                    var n = s.getCustomerById(e.customerId);
                    (e.customer.firstName = n.firstName),
                      (e.customer.lastName = n.lastName),
                      (e.customer.phone = n.phone);
                  }
                  (e.show = !0),
                    (e.removing = !1),
                    (e.checked = !1),
                    ("[]" !== e.customFields && null !== e.customFields) ||
                      (e.customFields = "{}"),
                    (e.customFields = JSON.parse(e.customFields));
                });
                var c = !1;
                t.colors.forEach(function (e) {
                  e === n.color &&
                    ((n.colorType = 1),
                    (n.selectedColor = e),
                    (n.customColor = e),
                    (c = !0));
                }),
                  c ||
                    ((n.colorType = 2),
                    (n.selectedColor = null),
                    (n.customColor = n.color)),
                  (n.gallery = n.gallery.sort(function (e, t) {
                    return e.position > t.position ? 1 : -1;
                  })),
                  (t.eventBookings = l),
                  t.setEntitySettings(n, "event"),
                  (t.event = n),
                  t.bookingCreatedCount++;
              })
              .catch(function (e) {
                console.log(e.message);
              });
        },
        getInitEventProviders: function () {
          return "provider" === this.$root.settings.role &&
            this.$root.settings.roles.allowWriteEvents
            ? this.options.entities.employees
            : [];
        },
        showDialogAttendees: function (e) {
          (this.eventBookings = null),
            (this.dialogAttendees = !0),
            this.getEvent(e);
        },
      },
      watch: {},
    };
  },
  911: function (e, t, n) {
    var o = n(685)(n(912), n(916), !1, null, null, null);
    e.exports = o.exports;
  },
  912: function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var o = n(701),
      i = n(337),
      a = n(713),
      s = n.n(a),
      r = n(692),
      l = n(881),
      c = n.n(l),
      u = n(913),
      d = n.n(u),
      m = n(687),
      p = n(691),
      h = n(689),
      f = n(695),
      g = n(686),
      v = n(705),
      b = n(755),
      y = (n.n(b), n(0)),
      _ = n.n(y);
    t.default = {
      mixins: [o.a, i.a, r.a, m.a, p.a, h.a, f.a, g.a, v.a],
      props: {
        selectedTimeZone: "",
        event: null,
        employees: null,
        locations: null,
        tags: null,
        settings: null,
        isCabinet: { required: !1, default: !1, type: Boolean },
        showHeader: { required: !1, default: !0, type: Boolean },
        showGallery: { required: !1, default: !0, type: Boolean },
      },
      data: function () {
        var e = this;
        return {
          monthDate: null,
          monthlyOnRepeat: "first",
          monthlyOnDay: "monday",
          monthlyRepeat: "each",
          weekDays: [
            { label: this.$root.labels.weekday_monday, value: "monday" },
            { label: this.$root.labels.weekday_tuesday, value: "tuesday" },
            { label: this.$root.labels.weekday_wednesday, value: "wednesday" },
            { label: this.$root.labels.weekday_thursday, value: "thursday" },
            { label: this.$root.labels.weekday_friday, value: "friday" },
            { label: this.$root.labels.weekday_saturday, value: "saturday" },
            { label: this.$root.labels.weekday_sunday, value: "sunday" },
          ],
          activeColor: "white",
          repeatIntervals: [],
          depositEnabled: !1,
          depositPayment: "fixed",
          depositOptions: [
            { value: "fixed", label: this.$root.labels.fixed_amount },
            { value: "percentage", label: this.$root.labels.percentage },
          ],
          originRecurring: null,
          originPeriods: null,
          colors: [
            "#1788FB",
            "#4BBEC6",
            "#FBC22D",
            "#FA3C52",
            "#D696B8",
            "#689BCA",
            "#26CC2B",
            "#FD7E35",
            "#E38587",
            "#774DFB",
          ],
          monthlyWeekDayRepeat: [
            { label: this.$root.labels.recurring_date_first, value: "first" },
            { label: this.$root.labels.recurring_date_second, value: "second" },
            { label: this.$root.labels.recurring_date_third, value: "third" },
            { label: this.$root.labels.recurring_date_fourth, value: "fourth" },
            { label: this.$root.labels.recurring_date_last, value: "last" },
          ],
          recurringPeriods: [
            { label: this.$root.labels.recurring_type_daily, value: "daily" },
            { label: this.$root.labels.recurring_type_weekly, value: "weekly" },
            {
              label: this.$root.labels.recurring_type_monthly,
              value: "monthly",
            },
            { label: this.$root.labels.recurring_type_yearly, value: "yearly" },
          ],
          zoomUsers: [],
          dialogLoading: !0,
          executeUpdate: !0,
          mounted: !1,
          rules: {
            name: [
              {
                required: !0,
                message: this.$root.labels.enter_event_name_warning,
                trigger: "submit",
              },
            ],
            range: [
              {
                required: !0,
                message: this.$root.labels.select_date_warning,
                trigger: "submit",
              },
            ],
            startTime: [
              {
                required: !0,
                message: this.$root.labels.select_time_warning,
                trigger: "submit",
              },
            ],
            endTime: [
              {
                required: !0,
                message: this.$root.labels.select_time_warning,
                trigger: "submit",
              },
            ],
            bookingStartsDate: [
              {
                validator: function (t, n, o) {
                  e.event.bookingStartsNow || n
                    ? o()
                    : o(new Error(e.$root.labels.select_date_warning));
                },
                trigger: "submit",
              },
            ],
            bookingStartsTime: [
              {
                validator: function (t, n, o) {
                  e.event.bookingStartsNow || n
                    ? o()
                    : o(new Error(e.$root.labels.select_time_warning));
                },
                trigger: "submit",
              },
            ],
            bookingEndsDate: [
              {
                validator: function (t, n, o) {
                  e.event.bookingEndsAfter || n
                    ? o()
                    : o(new Error(e.$root.labels.select_date_warning));
                },
                trigger: "submit",
              },
            ],
            bookingEndsTime: [
              {
                validator: function (t, n, o) {
                  e.event.bookingEndsAfter || n
                    ? o()
                    : o(new Error(e.$root.labels.select_time_warning));
                },
                trigger: "submit",
              },
            ],
            recurringUntilDate: [
              {
                validator: function (t, n, o) {
                  e.event.recurring.until || n
                    ? o()
                    : o(new Error(e.$root.labels.select_date_warning));
                },
                trigger: "submit",
              },
            ],
            recurringCycle: [
              {
                validator: function (t, n, o) {
                  e.event.recurring.cycle || n
                    ? o()
                    : o(new Error(e.$root.labels.select_cycle_warning));
                },
                trigger: "submit",
              },
            ],
            recurringInterval: [
              {
                validator: function (t, n, o) {
                  e.event.recurring.cycleInterval || n
                    ? o()
                    : o(new Error(e.$root.labels.select_interval_warning));
                },
                trigger: "submit",
              },
            ],
          },
          defaultEventTab: "details",
        };
      },
      methods: {
        calculateMinDate: function () {
          if (
            this.event &&
            this.event.periods &&
            this.event.periods[0] &&
            this.event.periods[0].range
          ) {
            var e = this.event.periods[0].range.start;
            return new Date(e.getFullYear(), e.getMonth(), 1);
          }
        },
        calculateMaxDate: function () {
          if (
            this.event &&
            this.event.periods &&
            this.event.periods[0] &&
            this.event.periods[0].range
          ) {
            var e = this.event.periods[0].range.start;
            return new Date(e.getFullYear(), e.getMonth() + 1, 0);
          }
        },
        depositEnabledChanged: function () {
          this.depositEnabled
            ? (this.event.depositPayment = this.depositPayment)
            : (this.event.depositPayment = "disabled");
        },
        depositChanged: function () {
          this.event.deposit > this.event.price &&
            "fixed" === this.depositPayment &&
            (this.event.deposit = this.event.price);
        },
        priceChanged: function () {
          this.event.deposit > this.event.price &&
            "fixed" === this.depositPayment &&
            (this.event.deposit = this.event.price);
        },
        canManage: function () {
          return (
            "admin" === this.$root.settings.role ||
            "manager" === this.$root.settings.role
          );
        },
        galleryUpdated: function (e) {
          this.event.gallery = e;
        },
        validationFailCallback: function () {
          this.defaultEventTab = "details";
        },
        tagsChanged: function (e) {
          var t = e[e.length - 1];
          -1 === this.tags.indexOf(t) && this.tags.push(t);
        },
        haveSaveConfirmation: function () {
          return 0 !== this.event.id && this.originRecurring.until;
        },
        changeBookingStartsDate: function () {
          null === this.event.bookingStartsTime &&
            (this.event.bookingStartsTime = "00:00");
        },
        changeBookingEndsDate: function () {
          null === this.event.bookingEndsTime &&
            (this.event.bookingEndsTime = "00:00");
        },
        instantiateDialog: function () {
          null !== this.event &&
            !0 === this.executeUpdate &&
            ((this.originPeriods = JSON.parse(
              JSON.stringify(this.event.periods)
            )),
            (this.originRecurring = JSON.parse(
              JSON.stringify(this.event.recurring)
            )),
            this.setRecurringValues(),
            this.event.recurring &&
              "monthly" === this.event.recurring.cycle &&
              this.event.recurring.monthlyRepeat &&
              (this.monthlyRepeat = this.event.recurring.monthlyRepeat),
            this.event.recurring &&
              "monthly" === this.event.recurring.cycle &&
              this.event.recurring.monthlyOnRepeat &&
              (this.monthlyOnRepeat = this.event.recurring.monthlyOnRepeat),
            this.event.recurring &&
              "monthly" === this.event.recurring.cycle &&
              this.event.recurring.monthlyOnDay &&
              (this.monthlyOnDay = this.event.recurring.monthlyOnDay),
            this.event.recurring &&
              "monthly" === this.event.recurring.cycle &&
              "each" === this.event.recurring.monthlyRepeat &&
              (this.event.recurring.monthDate
                ? (this.event.recurring.monthDate = new Date(
                    _()(this.event.recurring.monthDate).format("YYYY-MM-DD")
                  ))
                : (this.event.recurring.monthDate = new Date(
                    _()(this.event.periods[0].range.start).format("YYYY-MM-DD")
                  ))),
            this.event.periods[0].range &&
              _()(this.event.periods[0].range.start).format(
                "YYYY-MM-DD HH:mm:ss"
              ) === this.event.bookingCloses &&
              (this.event.bookingEndsAfter = !0),
            "disabled" === this.event.depositPayment
              ? (this.depositEnabled = !1)
              : ((this.depositEnabled = !0),
                (this.depositPayment = this.event.depositPayment)),
            (this.mounted = !0),
            (this.executeUpdate = !1),
            (this.dialogLoading = !1)),
            this.event &&
              this.isCabinet &&
              ((this.activeColor = "transparent"),
              "disabled" === this.event.depositPayment
                ? (this.depositEnabled = !1)
                : (this.depositPayment = this.event.depositPayment));
        },
        getZoomUsers: function () {
          var e = this,
            t = null;
          this.isCabinet &&
            (t = Object.assign(this.getAuthorizationHeaderObject(), {
              params: {
                source: "cabinet-" + this.$store.state.cabinet.cabinetType,
              },
            })),
            this.$http
              .get(this.$root.getAjaxUrl + "/zoom/users", t)
              .then(function (t) {
                "data" in t.data &&
                  "users" in t.data.data &&
                  (e.zoomUsers = t.data.data.users);
              })
              .catch(function (t) {
                e.notify(e.$root.labels.error, t.message, "error");
              });
        },
        clearValidation: function () {
          void 0 !== this.$refs.event && this.$refs.event.clearValidate();
        },
        //P2P: Set both location id and custom location
        getParsedEntity: function (e) {
          var t = this,
            n = [];
          !this.originRecurring.until && this.event.isRecurring && (e = !0),
            this.event.periods.forEach(function (e, o) {
              var i =
                  t.getDateString(e.range.start) + " " + e.startTime + ":00",
                a = t.getDateString(e.range.end) + " " + e.endTime + ":00";
              "UTC" === t.selectedTimeZone &&
                ((i = _()(i, "YYYY-MM-DD HH:mm")
                  .utc()
                  .format("YYYY-MM-DD HH:mm")),
                (a = _()(a, "YYYY-MM-DD HH:mm")
                  .utc()
                  .format("YYYY-MM-DD HH:mm"))),
                void 0 !== t.originPeriods[o] &&
                  ((e.id = t.originPeriods[o].id),
                  (e.eventId = t.originPeriods[o].eventId)),
                n.push({
                  id: e.id,
                  eventId: t.event.id ? t.event.id : null,
                  periodStart: i,
                  periodEnd: a,
                });
            });
          var o = [];
          this.event.tags.forEach(function (e) {
            o.push({ name: e });
          });
          var i = JSON.parse(JSON.stringify(this.event.settings));
          i.payments.wc.productId ===
            this.$root.settings.payments.wc.productId && delete i.payments.wc,
            this.depositEnabled
              ? (this.event.depositPayment = this.depositPayment)
              : (this.event.depositPayment = "disabled");
          var a = this.monthDate
            ? this.monthDate
            : this.event.recurring.monthDate
            ? this.event.recurring.monthDate
            : null;
          return {
            id: this.event.id,
            parentId: this.event.parentId,
            name: this.event.name,
            periods: n,
            utc: "UTC" === this.selectedTimeZone,
            timeZone:
              "UTC" === this.selectedTimeZone ? null : this.selectedTimeZone,
            bookingOpens: this.event.bookingStartsNow
              ? null
              : this.getDateString(this.event.bookingStartsDate) +
                " " +
                this.event.bookingStartsTime +
                ":00",
            bookingCloses: this.event.bookingEndsAfter
              ? null
              : this.getDateString(this.event.bookingEndsDate) +
                " " +
                this.event.bookingEndsTime +
                ":00",
            bookingOpensRec: this.event.bookingOpensRec,
            bookingClosesRec: this.event.bookingClosesRec,
            recurring:
              this.event.isRecurring && this.event.recurring
                ? {
                    monthlyRepeat: this.monthlyRepeat,
                    monthDate:
                      "each" === this.monthlyRepeat && a
                        ? this.getDateString(a) +
                          " " +
                          this.getTimeString(n[0].periodStart) +
                          ":00"
                        : null,
                    monthlyOnRepeat:
                      "on" === this.monthlyRepeat ? this.monthlyOnRepeat : null,
                    monthlyOnDay:
                      "on" === this.monthlyRepeat ? this.monthlyOnDay : null,
                    cycleInterval: this.event.recurring.cycleInterval,
                    cycle: this.event.recurring.cycle,
                    order: this.event.recurring.order,
                    until: this.event.recurring.until
                      ? this.getDateString(this.event.recurring.until) +
                        " " +
                        this.getTimeString(this.event.recurring.until) +
                        ":00"
                      : null,
                  }
                : null,
            bringingAnyone: this.event.bringingAnyone,
            bookMultipleTimes: this.event.bookMultipleTimes,
            maxCapacity: this.event.maxCapacity,
            price: this.event.price,
            tags: o,
            providers: this.event.providers,
            description: this.event.description,
            gallery: this.event.gallery,
            color:
              1 === this.event.colorType
                ? this.event.selectedColor
                : this.event.customColor,
            show: this.event.show,
            locationId:
              null !== this.event.locationId ? this.event.locationId : null,
            customLocation:
              null !== this.event.customLocation ? this.event.customLocation : null,
            applyGlobally: e,
            settings: JSON.stringify(i),
            zoomUserId: this.event.zoomUserId,
            translations: this.event.translations,
            deposit: this.event.deposit,
            depositPayment: this.event.depositPayment,
            depositPerPerson: this.event.depositPerPerson,
          };
        },
        errorCallback: function (e) {},
        closeDialog: function () {
          this.$emit("closeDialog");
        },
        addEventDate: function () {
          this.event.periods.push({
            id: null,
            eventId: null,
            range: { start: new Date(), end: new Date() },
            startTime: null,
            endTime: null,
            bookings: [],
          });
        },
        deleteEventDate: function (e) {
          this.event.periods.splice(e, 1);
        },
        changeEventColor: function (e) {
          (this.event.colorType = 1),
            Array.from(e.target.parentNode.children).forEach(function (e) {
              e.className.includes("color-active") &&
                e.classList.remove("color-active");
            }),
            (e.target.className = e.target.className + " color-active"),
            (this.event.selectedColor = e.target.getAttribute("data-color"));
        },
        showDialogTranslate: function (e) {
          this.$emit("showDialogTranslate", e);
        },
        setRecurringValues: function () {
          this.repeatIntervals = [];
          var e = "",
            t = "",
            n = 6;
          switch (this.event.recurring.cycle) {
            case "daily":
              (e = this.$root.labels.day), (t = this.$root.labels.days);
              break;
            case "weekly":
              (e = this.$root.labels.week),
                (t = this.$root.labels.weeks),
                (n = 6);
              break;
            case "monthly":
              (e = this.$root.labels.month),
                (t = this.$root.labels.months),
                (n = 12);
              break;
            case "yearly":
              (e = this.$root.labels.year),
                (t = this.$root.labels.years),
                (n = 5);
              break;
            default:
              return void (this.repeatIntervals = []);
          }
          this.repeatIntervals = this.getRepeatIntervalLabels(e, t, n);
        },
      },
      mounted: function () {
        this.instantiateDialog(),
          this.$root.settings.zoom.enabled && this.getZoomUsers();
      },
      updated: function () {
        this.instantiateDialog();
      },
      components: {
        EntitySettings: c.a,
        DialogActions: s.a,
        Money: b.Money,
        Gallery: d.a,
      },
      computed: {
        monthDateComp: {
          get: function () {
            return this.event.recurring.monthDate
              ? this.event.recurring.monthDate
              : (this.monthDate ||
                  (this.event &&
                    this.event.periods &&
                    this.event.periods[0] &&
                    this.event.periods[0].range &&
                    (this.monthDate = this.event.periods[0].range.start)),
                this.monthDate);
          },
          set: function (e) {
            this.monthDate = e;
          },
        },
      },
    };
  },
  913: function (e, t, n) {
    var o = n(685)(n(914), n(915), !1, null, null, null);
    e.exports = o.exports;
  },
  914: function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var o = n(687),
      i = n(791),
      a = n.n(i),
      s = n(792),
      r = n.n(s);
    t.default = {
      mixins: [o.a],
      props: { label: null, gallery: null },
      data: function () {
        return {
          clonedGallery: null,
          draggableOptions: {
            animation: 150,
            group: "people",
            handle: ".am-drag-handle",
          },
        };
      },
      mounted: function () {
        this.clonedGallery = JSON.parse(JSON.stringify(this.gallery));
      },
      methods: {
        galleryPictureSelected: function (e, t) {
          this.clonedGallery.push({
            id: 0,
            pictureFullPath: e,
            pictureThumbPath: t,
            position: this.clonedGallery.length + 1,
          }),
            this.$emit("galleryUpdated", this.clonedGallery);
        },
        deleteGalleryImage: function (e) {
          this.clonedGallery.splice(e, 1);
          for (var t = 0; t < this.clonedGallery.length; t++)
            this.clonedGallery[t].position = t + 1;
          this.$emit("galleryUpdated", this.clonedGallery);
        },
        dropGalleryImage: function (e) {
          if (e.newIndex !== e.oldIndex) {
            var t = this;
            this.clonedGallery.forEach(function (e) {
              e.position = t.clonedGallery.indexOf(e) + 1;
            });
          }
          this.$emit("galleryUpdated", this.clonedGallery);
        },
      },
      components: { PictureUpload: r.a, Draggable: a.a },
    };
  },
  915: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          n = e._self._c || t;
        return n(
          "div",
          { staticClass: "am-gallery-images" },
          [
            n("div", { staticClass: "am-event-section-title" }, [
              e._v(e._s(e.label)),
            ]),
            e._v(" "),
            n(
              "el-row",
              { attrs: { gutter: 24 } },
              [
                n(
                  "draggable",
                  {
                    attrs: { options: e.draggableOptions },
                    on: { end: e.dropGalleryImage },
                    model: {
                      value: e.clonedGallery,
                      callback: function (t) {
                        e.clonedGallery = t;
                      },
                      expression: "clonedGallery",
                    },
                  },
                  e._l(e.clonedGallery, function (t, o) {
                    return n("el-col", { key: o, attrs: { sm: 12 } }, [
                      n("div", { staticClass: "am-gallery-image-wrapper" }, [
                        n(
                          "div",
                          {
                            staticClass: "am-gallery-image",
                            style: {
                              "background-image":
                                "url(" + t.pictureFullPath + ")",
                            },
                          },
                          [
                            n("i", {
                              staticClass: "el-icon-delete",
                              on: {
                                click: function (t) {
                                  return e.deleteGalleryImage(o);
                                },
                              },
                            }),
                          ]
                        ),
                        e._v(" "),
                        n("div", { staticClass: "am-gallery-image-title" }, [
                          n("span", { staticClass: "am-drag-handle" }, [
                            n("img", {
                              staticClass: "svg",
                              attrs: {
                                width: "20px",
                                src:
                                  e.$root.getUrl + "public/img/burger-menu.svg",
                              },
                            }),
                          ]),
                          e._v(" "),
                          n("span", [
                            e._v(
                              e._s(
                                t.pictureFullPath.substring(
                                  t.pictureFullPath.lastIndexOf("/") + 1
                                )
                              )
                            ),
                          ]),
                        ]),
                      ]),
                    ]);
                  }),
                  1
                ),
                e._v(" "),
                n("el-col", { attrs: { sm: 12 } }, [
                  n("div", { staticClass: "am-gallery-image-add" }, [
                    n(
                      "div",
                      [
                        n("picture-upload", {
                          attrs: {
                            multiple: !0,
                            "edited-entity": null,
                            "entity-name": "gallery",
                          },
                          on: { pictureSelected: e.galleryPictureSelected },
                        }),
                      ],
                      1
                    ),
                  ]),
                ]),
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
  916: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          n = e._self._c || t;
        return n(
          "div",
          { staticClass: "am-dialog-event-inner" },
          [
            n(
              "div",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: e.dialogLoading,
                    expression: "dialogLoading",
                  },
                ],
                staticClass: "am-dialog-loader",
              },
              [
                n("div", { staticClass: "am-dialog-loader-content" }, [
                  n("img", {
                    attrs: { src: e.$root.getUrl + "public/img/spinner.svg" },
                  }),
                  e._v(" "),
                  n("p", [e._v(e._s(e.$root.labels.loader_message))]),
                ]),
              ]
            ),
            e._v(" "),
            e.event && !e.dialogLoading
              ? n(
                  "div",
                  {
                    staticClass: "am-dialog-scrollable",
                    class: { "am-edit": 0 !== e.event.id },
                  },
                  [
                    e.showHeader
                      ? n(
                          "div",
                          { staticClass: "am-dialog-header" },
                          [
                            n(
                              "el-row",
                              [
                                n("el-col", { attrs: { span: 18 } }, [
                                  e.event && 0 !== e.event.id
                                    ? n("h2", [
                                        e._v(e._s(e.$root.labels.edit_event)),
                                      ])
                                    : n("h2", [
                                        e._v(e._s(e.$root.labels.new_event)),
                                      ]),
                                ]),
                                e._v(" "),
                                n(
                                  "el-col",
                                  {
                                    staticClass: "align-right",
                                    attrs: { span: 6 },
                                  },
                                  [
                                    n("el-button", {
                                      staticClass: "am-dialog-close",
                                      attrs: {
                                        size: "small",
                                        icon: "el-icon-close",
                                      },
                                      on: { click: e.closeDialog },
                                    }),
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
                    e.mounted
                      ? n(
                          "el-form",
                          {
                            ref: "event",
                            attrs: { model: e.event, "label-position": "top" },
                          },
                          [
                            n(
                              "el-tabs",
                              {
                                model: {
                                  value: e.defaultEventTab,
                                  callback: function (t) {
                                    e.defaultEventTab = t;
                                  },
                                  expression: "defaultEventTab",
                                },
                              },
                              [
                                n(
                                  "el-tab-pane",
                                  {
                                    attrs: {
                                      label: e.$root.labels.event_details,
                                      name: "details",
                                    },
                                  },
                                  [
                                    n(
                                      "el-form-item",
                                      {
                                        attrs: {
                                          prop: "name",
                                          rules: e.rules.name,
                                        },
                                        on: {
                                          input: function (t) {
                                            return e.clearValidation();
                                          },
                                        },
                                      },
                                      [
                                        e._v(
                                          "\n              " +
                                            e._s(e.$root.labels.event_name) +
                                            "\n              "
                                        ),
                                        e.isCabinet
                                          ? e._e()
                                          : n(
                                              "div",
                                              {
                                                staticClass:
                                                  "am-event-translate",
                                                on: {
                                                  click: function (t) {
                                                    return e.showDialogTranslate(
                                                      "name"
                                                    );
                                                  },
                                                },
                                              },
                                              [
                                                n("img", {
                                                  staticClass:
                                                    "am-dialog-translate-svg",
                                                  attrs: {
                                                    width: "16px",
                                                    src:
                                                      e.$root.getUrl +
                                                      "public/img/translate.svg",
                                                  },
                                                }),
                                                e._v(
                                                  "\n                " +
                                                    e._s(
                                                      e.$root.labels.translate
                                                    ) +
                                                    "\n              "
                                                ),
                                              ]
                                            ),
                                        e._v(" "),
                                        n("el-input", {
                                          staticStyle: {
                                            "margin-top": "5px !important",
                                          },
                                          attrs: {
                                            placeholder:
                                              e.$root.labels.enter_event_name,
                                          },
                                          on: {
                                            change: function (t) {
                                              return e.trimProperty(
                                                e.event,
                                                "name"
                                              );
                                            },
                                          },
                                          model: {
                                            value: e.event.name,
                                            callback: function (t) {
                                              e.$set(e.event, "name", t);
                                            },
                                            expression: "event.name",
                                          },
                                        }),
                                      ],
                                      1
                                    ),
                                    e._v(" "),
                                    n(
                                      "div",
                                      {
                                        staticClass:
                                          "am-event-dates am-section-grey",
                                      },
                                      [
                                        e._l(e.event.periods, function (t, o) {
                                          return n(
                                            "div",
                                            {
                                              key: o,
                                              staticClass: "am-event-date",
                                            },
                                            [
                                              n(
                                                "el-row",
                                                { attrs: { gutter: 10 } },
                                                [
                                                  n(
                                                    "el-col",
                                                    { attrs: { sm: 6 } },
                                                    [
                                                      n("p", [
                                                        e._v(
                                                          e._s(
                                                            e.$root.labels
                                                              .event_period_dates
                                                          )
                                                        ),
                                                      ]),
                                                    ]
                                                  ),
                                                  e._v(" "),
                                                  n(
                                                    "el-col",
                                                    {
                                                      staticClass:
                                                        "v-calendar-column",
                                                      attrs: { sm: 16 },
                                                    },
                                                    [
                                                      n(
                                                        "el-form-item",
                                                        {
                                                          attrs: {
                                                            prop:
                                                              "periods." +
                                                              o +
                                                              ".range",
                                                            rules:
                                                              e.rules.range,
                                                          },
                                                        },
                                                        [
                                                          n("v-date-picker", {
                                                            staticStyle: {
                                                              "margin-bottom":
                                                                "16px",
                                                            },
                                                            attrs: {
                                                              attributes: [
                                                                {
                                                                  dates: {
                                                                    start:
                                                                      e.getNowDate(),
                                                                  },
                                                                  eventDateIndex:
                                                                    o,
                                                                },
                                                              ],
                                                              "is-double-paned":
                                                                !1,
                                                              mode: "range",
                                                              "popover-visibility":
                                                                "focus",
                                                              "popover-direction":
                                                                "bottom",
                                                              "popover-align":
                                                                e.screenWidth <
                                                                768
                                                                  ? "center"
                                                                  : "right",
                                                              "tint-color":
                                                                e.isCabinet
                                                                  ? e.$root
                                                                      .settings
                                                                      .customization
                                                                      .primaryColor
                                                                  : "#1A84EE",
                                                              "show-day-popover":
                                                                !1,
                                                              "input-props": {
                                                                class:
                                                                  "el-input__inner",
                                                              },
                                                              "is-expanded": !1,
                                                              "is-required": !1,
                                                              "is-read-only":
                                                                !0,
                                                              "input-class":
                                                                "el-input__inner",
                                                              formats:
                                                                e.vCalendarFormats,
                                                              "available-dates":
                                                                {
                                                                  start:
                                                                    e.getNowDate(),
                                                                },
                                                            },
                                                            model: {
                                                              value: t.range,
                                                              callback:
                                                                function (n) {
                                                                  e.$set(
                                                                    t,
                                                                    "range",
                                                                    n
                                                                  );
                                                                },
                                                              expression:
                                                                "period.range",
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
                                              n(
                                                "el-row",
                                                { attrs: { gutter: 10 } },
                                                [
                                                  n(
                                                    "el-col",
                                                    { attrs: { sm: 6 } },
                                                    [
                                                      n("p", [
                                                        e._v(
                                                          e._s(
                                                            e.$root.labels
                                                              .event_period_time
                                                          )
                                                        ),
                                                      ]),
                                                    ]
                                                  ),
                                                  e._v(" "),
                                                  n(
                                                    "el-col",
                                                    {
                                                      staticClass:
                                                        "am-event-period-start",
                                                      attrs: { sm: 8 },
                                                    },
                                                    [
                                                      n(
                                                        "el-form-item",
                                                        {
                                                          attrs: {
                                                            prop:
                                                              "periods." +
                                                              o +
                                                              ".startTime",
                                                            rules:
                                                              e.rules.startTime,
                                                          },
                                                        },
                                                        [
                                                          n("el-time-select", {
                                                            attrs: {
                                                              "picker-options":
                                                                e.getTimeSelectOptionsWithLimits(
                                                                  null,
                                                                  e.isCabinet
                                                                    ? null
                                                                    : t.endTime
                                                                ),
                                                              size: "large",
                                                            },
                                                            model: {
                                                              value:
                                                                t.startTime,
                                                              callback:
                                                                function (n) {
                                                                  e.$set(
                                                                    t,
                                                                    "startTime",
                                                                    n
                                                                  );
                                                                },
                                                              expression:
                                                                "period.startTime",
                                                            },
                                                          }),
                                                        ],
                                                        1
                                                      ),
                                                    ],
                                                    1
                                                  ),
                                                  e._v(" "),
                                                  n(
                                                    "el-col",
                                                    { attrs: { sm: 8 } },
                                                    [
                                                      n(
                                                        "el-form-item",
                                                        {
                                                          attrs: {
                                                            prop:
                                                              "periods." +
                                                              o +
                                                              ".endTime",
                                                            rules:
                                                              e.rules.endTime,
                                                          },
                                                        },
                                                        [
                                                          n("el-time-select", {
                                                            attrs: {
                                                              "picker-options":
                                                                e.getTimeSelectOptionsWithLimits(
                                                                  e.isCabinet
                                                                    ? null
                                                                    : t.startTime,
                                                                  null
                                                                ),
                                                              size: "large",
                                                            },
                                                            model: {
                                                              value: t.endTime,
                                                              callback:
                                                                function (n) {
                                                                  e.$set(
                                                                    t,
                                                                    "endTime",
                                                                    n
                                                                  );
                                                                },
                                                              expression:
                                                                "period.endTime",
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
                                              e.$root.settings.zoom.enabled &&
                                              t.zoomMeeting
                                                ? n(
                                                    "el-row",
                                                    { attrs: { gutter: 10 } },
                                                    [
                                                      "customer" !==
                                                      e.$root.settings.role
                                                        ? n(
                                                            "el-col",
                                                            {
                                                              attrs: { sm: 12 },
                                                            },
                                                            [
                                                              n("p", [
                                                                e._v(
                                                                  e._s(
                                                                    e.$root
                                                                      .labels
                                                                      .zoom_start_link
                                                                  )
                                                                ),
                                                              ]),
                                                            ]
                                                          )
                                                        : e._e(),
                                                      e._v(" "),
                                                      "customer" !==
                                                      e.$root.settings.role
                                                        ? n(
                                                            "el-col",
                                                            {
                                                              attrs: { sm: 12 },
                                                            },
                                                            [
                                                              n("p", [
                                                                n(
                                                                  "a",
                                                                  {
                                                                    staticClass:
                                                                      "am-link",
                                                                    attrs: {
                                                                      href: t
                                                                        .zoomMeeting
                                                                        .startUrl,
                                                                    },
                                                                  },
                                                                  [
                                                                    e._v(
                                                                      e._s(
                                                                        e.$root
                                                                          .labels
                                                                          .zoom_click_to_start
                                                                      )
                                                                    ),
                                                                  ]
                                                                ),
                                                              ]),
                                                            ]
                                                          )
                                                        : e._e(),
                                                      e._v(" "),
                                                      n(
                                                        "el-col",
                                                        { attrs: { sm: 12 } },
                                                        [
                                                          n("p", [
                                                            e._v(
                                                              e._s(
                                                                e.$root.labels
                                                                  .zoom_join_link
                                                              )
                                                            ),
                                                          ]),
                                                        ]
                                                      ),
                                                      e._v(" "),
                                                      n(
                                                        "el-col",
                                                        { attrs: { sm: 12 } },
                                                        [
                                                          n("p", [
                                                            n(
                                                              "a",
                                                              {
                                                                staticClass:
                                                                  "am-link",
                                                                attrs: {
                                                                  href: t
                                                                    .zoomMeeting
                                                                    .joinUrl,
                                                                },
                                                              },
                                                              [
                                                                e._v(
                                                                  e._s(
                                                                    t
                                                                      .zoomMeeting
                                                                      .joinUrl
                                                                  )
                                                                ),
                                                              ]
                                                            ),
                                                          ]),
                                                        ]
                                                      ),
                                                    ],
                                                    1
                                                  )
                                                : e._e(),
                                              e._v(" "),
                                              n(
                                                "div",
                                                {
                                                  directives: [
                                                    {
                                                      name: "show",
                                                      rawName: "v-show",
                                                      value:
                                                        e.event.periods.length >
                                                          1 &&
                                                        0 === t.bookings.length,
                                                      expression:
                                                        "event.periods.length > 1 && period.bookings.length === 0",
                                                    },
                                                  ],
                                                  staticClass:
                                                    "am-delete-element disabled",
                                                  on: {
                                                    click: function (t) {
                                                      return e.deleteEventDate(
                                                        o
                                                      );
                                                    },
                                                  },
                                                },
                                                [
                                                  n("i", {
                                                    staticClass:
                                                      "el-icon-minus",
                                                  }),
                                                ]
                                              ),
                                            ],
                                            1
                                          );
                                        }),
                                        e._v(" "),
                                        n(
                                          "div",
                                          { staticClass: "am-add-event-date" },
                                          [
                                            n(
                                              "el-button",
                                              {
                                                attrs: {
                                                  size: "small",
                                                  type: "primary",
                                                },
                                                on: {
                                                  click: function (t) {
                                                    return e.addEventDate();
                                                  },
                                                },
                                              },
                                              [
                                                e._v(
                                                  e._s(e.$root.labels.add_date)
                                                ),
                                              ]
                                            ),
                                          ],
                                          1
                                        ),
                                      ],
                                      2
                                    ),
                                    e._v(" "),
                                    n(
                                      "div",
                                      { staticClass: "am-section-grey" },
                                      [
                                        n(
                                          "el-checkbox",
                                          {
                                            model: {
                                              value: e.event.isRecurring,
                                              callback: function (t) {
                                                e.$set(
                                                  e.event,
                                                  "isRecurring",
                                                  t
                                                );
                                              },
                                              expression: "event.isRecurring",
                                            },
                                          },
                                          [
                                            e._v(
                                              e._s(
                                                e.$root.labels
                                                  .event_recurring_enabled
                                              )
                                            ),
                                          ]
                                        ),
                                        e._v(" "),
                                        e.event.isRecurring
                                          ? n(
                                              "div",
                                              {
                                                staticClass:
                                                  "am-recurring-event",
                                              },
                                              [
                                                n(
                                                  "el-row",
                                                  { attrs: { gutter: 10 } },
                                                  [
                                                    n(
                                                      "el-col",
                                                      {
                                                        attrs: {
                                                          lg: 10,
                                                          md: 10,
                                                          sm: 24,
                                                        },
                                                      },
                                                      [
                                                        n("p", [
                                                          e._v(
                                                            e._s(
                                                              e.$root.labels
                                                                .event_recurring_period
                                                            )
                                                          ),
                                                        ]),
                                                      ]
                                                    ),
                                                    e._v(" "),
                                                    n(
                                                      "el-col",
                                                      {
                                                        attrs: {
                                                          lg: 14,
                                                          md: 14,
                                                          sm: 24,
                                                        },
                                                      },
                                                      [
                                                        n(
                                                          "el-form-item",
                                                          {
                                                            attrs: {
                                                              prop: "recurringCycle",
                                                              rules:
                                                                e.rules
                                                                  .recurringCycle,
                                                            },
                                                          },
                                                          [
                                                            n(
                                                              "el-select",
                                                              {
                                                                style: {
                                                                  backgroundColor:
                                                                    e.activeColor,
                                                                },
                                                                attrs: {
                                                                  placeholder:
                                                                    e.$root
                                                                      .labels
                                                                      .select_repeat_period,
                                                                  disabled: !(
                                                                    0 ===
                                                                      e.event
                                                                        .id ||
                                                                    (0 !==
                                                                      e.event
                                                                        .id &&
                                                                      null ===
                                                                        e
                                                                          .originRecurring
                                                                          .cycle)
                                                                  ),
                                                                  clearable: "",
                                                                  filterable:
                                                                    "",
                                                                },
                                                                on: {
                                                                  change:
                                                                    e.setRecurringValues,
                                                                },
                                                                model: {
                                                                  value:
                                                                    e.event
                                                                      .recurring
                                                                      .cycle,
                                                                  callback:
                                                                    function (
                                                                      t
                                                                    ) {
                                                                      e.$set(
                                                                        e.event
                                                                          .recurring,
                                                                        "cycle",
                                                                        t
                                                                      );
                                                                    },
                                                                  expression:
                                                                    "event.recurring.cycle",
                                                                },
                                                              },
                                                              e._l(
                                                                e.recurringPeriods,
                                                                function (e) {
                                                                  return n(
                                                                    "el-option",
                                                                    {
                                                                      key: e.value,
                                                                      attrs: {
                                                                        label:
                                                                          e.label,
                                                                        value:
                                                                          e.value,
                                                                      },
                                                                    }
                                                                  );
                                                                }
                                                              ),
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
                                                e._v(" "),
                                                n(
                                                  "el-row",
                                                  { attrs: { gutter: 10 } },
                                                  [
                                                    n(
                                                      "el-col",
                                                      {
                                                        attrs: {
                                                          lg: 10,
                                                          md: 10,
                                                          sm: 24,
                                                        },
                                                      },
                                                      [
                                                        n("p", [
                                                          e._v(
                                                            e._s(
                                                              e.$root.labels
                                                                .recurring_every
                                                            )
                                                          ),
                                                        ]),
                                                      ]
                                                    ),
                                                    e._v(" "),
                                                    n(
                                                      "el-col",
                                                      {
                                                        attrs: {
                                                          lg: 14,
                                                          md: 14,
                                                          sm: 24,
                                                        },
                                                      },
                                                      [
                                                        n(
                                                          "el-form-item",
                                                          {
                                                            attrs: {
                                                              prop: "recurringInterval",
                                                              rules:
                                                                e.rules
                                                                  .recurringInterval,
                                                            },
                                                          },
                                                          [
                                                            n(
                                                              "el-select",
                                                              {
                                                                style: {
                                                                  backgroundColor:
                                                                    e.activeColor,
                                                                },
                                                                attrs: {
                                                                  clearable: "",
                                                                  filterable:
                                                                    "",
                                                                  disabled: !(
                                                                    0 ===
                                                                      e.event
                                                                        .id ||
                                                                    (0 !==
                                                                      e.event
                                                                        .id &&
                                                                      null ===
                                                                        e
                                                                          .originRecurring
                                                                          .cycle)
                                                                  ),
                                                                  placeholder:
                                                                    e
                                                                      .repeatIntervals
                                                                      .length >
                                                                    0
                                                                      ? e.$root
                                                                          .labels
                                                                          .select_repeat_interval
                                                                      : e.$root
                                                                          .labels
                                                                          .select_repeat_period,
                                                                },
                                                                model: {
                                                                  value:
                                                                    e.event
                                                                      .recurring
                                                                      .cycleInterval,
                                                                  callback:
                                                                    function (
                                                                      t
                                                                    ) {
                                                                      e.$set(
                                                                        e.event
                                                                          .recurring,
                                                                        "cycleInterval",
                                                                        t
                                                                      );
                                                                    },
                                                                  expression:
                                                                    "event.recurring.cycleInterval",
                                                                },
                                                              },
                                                              e._l(
                                                                e.repeatIntervals,
                                                                function (
                                                                  e,
                                                                  t
                                                                ) {
                                                                  return n(
                                                                    "el-option",
                                                                    {
                                                                      key: t,
                                                                      attrs: {
                                                                        label:
                                                                          e.label,
                                                                        value:
                                                                          e.value,
                                                                      },
                                                                    }
                                                                  );
                                                                }
                                                              ),
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
                                                e._v(" "),
                                                (0 === e.event.id &&
                                                  "monthly" ===
                                                    e.event.recurring.cycle) ||
                                                (0 !== e.event.id &&
                                                  "each" ===
                                                    e.originRecurring
                                                      .monthlyRepeat &&
                                                  "monthly" ===
                                                    e.originRecurring.cycle)
                                                  ? n(
                                                      "el-row",
                                                      { attrs: { gutter: 10 } },
                                                      [
                                                        n(
                                                          "el-col",
                                                          {
                                                            staticClass:
                                                              "text-center",
                                                            attrs: {
                                                              lg: 10,
                                                              md: 10,
                                                              sm: 24,
                                                            },
                                                          },
                                                          [
                                                            0 === e.event.id ||
                                                            (0 !== e.event.id &&
                                                              null ===
                                                                e
                                                                  .originRecurring
                                                                  .cycle)
                                                              ? n(
                                                                  "el-radio",
                                                                  {
                                                                    attrs: {
                                                                      label:
                                                                        "each",
                                                                    },
                                                                    model: {
                                                                      value:
                                                                        e.monthlyRepeat,
                                                                      callback:
                                                                        function (
                                                                          t
                                                                        ) {
                                                                          e.monthlyRepeat =
                                                                            t;
                                                                        },
                                                                      expression:
                                                                        "monthlyRepeat",
                                                                    },
                                                                  },
                                                                  [
                                                                    e._v(
                                                                      "\n                      " +
                                                                        e._s(
                                                                          e
                                                                            .$root
                                                                            .labels
                                                                            .recurring_each
                                                                        ) +
                                                                        "\n                    "
                                                                    ),
                                                                  ]
                                                                )
                                                              : n("p", [
                                                                  e._v(
                                                                    "\n                      " +
                                                                      e._s(
                                                                        e.$root
                                                                          .labels
                                                                          .recurring_each
                                                                      ) +
                                                                      "\n                    "
                                                                  ),
                                                                ]),
                                                          ],
                                                          1
                                                        ),
                                                        e._v(" "),
                                                        n(
                                                          "el-col",
                                                          {
                                                            staticClass:
                                                              "v-calendar-column",
                                                            attrs: {
                                                              lg: 14,
                                                              md: 14,
                                                              sm: 24,
                                                            },
                                                          },
                                                          [
                                                            n(
                                                              "el-form-item",
                                                              [
                                                                "each" ===
                                                                e.monthlyRepeat
                                                                  ? n(
                                                                      "v-date-picker",
                                                                      {
                                                                        attrs: {
                                                                          "is-double-paned":
                                                                            !1,
                                                                          mode: "single",
                                                                          "popover-visibility":
                                                                            "focus",
                                                                          "popover-direction":
                                                                            e.screenWidth <
                                                                            768
                                                                              ? "bottom"
                                                                              : "top",
                                                                          "popover-align":
                                                                            (e.screenWidth,
                                                                            "center"),
                                                                          "tint-color":
                                                                            e.isCabinet
                                                                              ? e
                                                                                  .$root
                                                                                  .settings
                                                                                  .customization
                                                                                  .primaryColor
                                                                              : "#1A84EE",
                                                                          "show-day-popover":
                                                                            !1,
                                                                          "input-props":
                                                                            {
                                                                              class:
                                                                                "el-input__inner",
                                                                            },
                                                                          "is-expanded":
                                                                            !1,
                                                                          "is-required":
                                                                            !1,
                                                                          "input-class":
                                                                            "el-input__inner",
                                                                          formats:
                                                                            e.vCalendarFormats,
                                                                          "min-date":
                                                                            e.calculateMinDate(),
                                                                          "max-date":
                                                                            e.calculateMaxDate(),
                                                                        },
                                                                        model: {
                                                                          value:
                                                                            e.monthDateComp,
                                                                          callback:
                                                                            function (
                                                                              t
                                                                            ) {
                                                                              e.monthDateComp =
                                                                                t;
                                                                            },
                                                                          expression:
                                                                            "monthDateComp",
                                                                        },
                                                                      }
                                                                    )
                                                                  : n(
                                                                      "el-input",
                                                                      {
                                                                        attrs: {
                                                                          value:
                                                                            e
                                                                              .event
                                                                              .recurring &&
                                                                            e
                                                                              .event
                                                                              .recurring
                                                                              .monthDate
                                                                              ? e.getFrontedFormattedDate(
                                                                                  e.getDatabaseFormattedDate(
                                                                                    e
                                                                                      .event
                                                                                      .recurring
                                                                                      .monthDate
                                                                                  )
                                                                                )
                                                                              : "",
                                                                          disabled:
                                                                            !0,
                                                                        },
                                                                      }
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
                                                (0 === e.event.id &&
                                                  "monthly" ===
                                                    e.event.recurring.cycle) ||
                                                (0 !== e.event.id &&
                                                  "on" ===
                                                    e.originRecurring
                                                      .monthlyRepeat &&
                                                  "monthly" ===
                                                    e.originRecurring.cycle)
                                                  ? n(
                                                      "el-row",
                                                      { attrs: { gutter: 10 } },
                                                      [
                                                        n(
                                                          "el-col",
                                                          {
                                                            attrs: {
                                                              lg: 10,
                                                              md: 10,
                                                              sm: 24,
                                                            },
                                                          },
                                                          [
                                                            0 === e.event.id ||
                                                            (0 !== e.event.id &&
                                                              null ===
                                                                e
                                                                  .originRecurring
                                                                  .cycle)
                                                              ? n(
                                                                  "el-radio",
                                                                  {
                                                                    attrs: {
                                                                      label:
                                                                        "on",
                                                                    },
                                                                    model: {
                                                                      value:
                                                                        e.monthlyRepeat,
                                                                      callback:
                                                                        function (
                                                                          t
                                                                        ) {
                                                                          e.monthlyRepeat =
                                                                            t;
                                                                        },
                                                                      expression:
                                                                        "monthlyRepeat",
                                                                    },
                                                                  },
                                                                  [
                                                                    e._v(
                                                                      "\n                      " +
                                                                        e._s(
                                                                          e
                                                                            .$root
                                                                            .labels
                                                                            .recurring_on
                                                                        ) +
                                                                        "\n                    "
                                                                    ),
                                                                  ]
                                                                )
                                                              : n("p", [
                                                                  e._v(
                                                                    e._s(
                                                                      e.$root
                                                                        .labels
                                                                        .recurring_on
                                                                    )
                                                                  ),
                                                                ]),
                                                          ],
                                                          1
                                                        ),
                                                        e._v(" "),
                                                        n(
                                                          "el-col",
                                                          {
                                                            staticClass:
                                                              "text-center",
                                                            attrs: {
                                                              lg: 14,
                                                              md: 14,
                                                              sm: 24,
                                                            },
                                                          },
                                                          [
                                                            n(
                                                              "el-row",
                                                              {
                                                                attrs: {
                                                                  gutter: 10,
                                                                },
                                                              },
                                                              [
                                                                n(
                                                                  "el-col",
                                                                  {
                                                                    attrs: {
                                                                      lg: 12,
                                                                      md: 12,
                                                                      sm: 24,
                                                                    },
                                                                  },
                                                                  [
                                                                    n(
                                                                      "el-form-item",
                                                                      [
                                                                        n(
                                                                          "el-select",
                                                                          {
                                                                            style:
                                                                              {
                                                                                backgroundColor:
                                                                                  e.activeColor,
                                                                              },
                                                                            attrs:
                                                                              {
                                                                                disabled:
                                                                                  "each" ===
                                                                                    e.monthlyRepeat ||
                                                                                  !(
                                                                                    0 ===
                                                                                      e
                                                                                        .event
                                                                                        .id ||
                                                                                    (0 !==
                                                                                      e
                                                                                        .event
                                                                                        .id &&
                                                                                      null ===
                                                                                        e
                                                                                          .originRecurring
                                                                                          .cycle)
                                                                                  ),
                                                                                placeholder:
                                                                                  e
                                                                                    .monthlyWeekDayRepeat[0]
                                                                                    .label,
                                                                                clearable:
                                                                                  "",
                                                                                filterable:
                                                                                  "",
                                                                              },
                                                                            model:
                                                                              {
                                                                                value:
                                                                                  e.monthlyOnRepeat,
                                                                                callback:
                                                                                  function (
                                                                                    t
                                                                                  ) {
                                                                                    e.monthlyOnRepeat =
                                                                                      t;
                                                                                  },
                                                                                expression:
                                                                                  "monthlyOnRepeat",
                                                                              },
                                                                          },
                                                                          e._l(
                                                                            e.monthlyWeekDayRepeat,
                                                                            function (
                                                                              e
                                                                            ) {
                                                                              return n(
                                                                                "el-option",
                                                                                {
                                                                                  key: e.value,
                                                                                  attrs:
                                                                                    {
                                                                                      label:
                                                                                        e.label,
                                                                                      value:
                                                                                        e.value,
                                                                                    },
                                                                                }
                                                                              );
                                                                            }
                                                                          ),
                                                                          1
                                                                        ),
                                                                      ],
                                                                      1
                                                                    ),
                                                                  ],
                                                                  1
                                                                ),
                                                                e._v(" "),
                                                                n(
                                                                  "el-col",
                                                                  {
                                                                    attrs: {
                                                                      lg: 12,
                                                                      md: 12,
                                                                      sm: 24,
                                                                    },
                                                                  },
                                                                  [
                                                                    n(
                                                                      "el-form-item",
                                                                      [
                                                                        n(
                                                                          "el-select",
                                                                          {
                                                                            style:
                                                                              {
                                                                                backgroundColor:
                                                                                  e.activeColor,
                                                                              },
                                                                            attrs:
                                                                              {
                                                                                placeholder:
                                                                                  e
                                                                                    .weekDays[0]
                                                                                    .label,
                                                                                disabled:
                                                                                  "each" ===
                                                                                    e.monthlyRepeat ||
                                                                                  !(
                                                                                    0 ===
                                                                                      e
                                                                                        .event
                                                                                        .id ||
                                                                                    (0 !==
                                                                                      e
                                                                                        .event
                                                                                        .id &&
                                                                                      null ===
                                                                                        e
                                                                                          .originRecurring
                                                                                          .cycle)
                                                                                  ),
                                                                                clearable:
                                                                                  "",
                                                                                filterable:
                                                                                  "",
                                                                              },
                                                                            model:
                                                                              {
                                                                                value:
                                                                                  e.monthlyOnDay,
                                                                                callback:
                                                                                  function (
                                                                                    t
                                                                                  ) {
                                                                                    e.monthlyOnDay =
                                                                                      t;
                                                                                  },
                                                                                expression:
                                                                                  "monthlyOnDay",
                                                                              },
                                                                          },
                                                                          e._l(
                                                                            e.weekDays,
                                                                            function (
                                                                              e
                                                                            ) {
                                                                              return n(
                                                                                "el-option",
                                                                                {
                                                                                  key: e.value,
                                                                                  attrs:
                                                                                    {
                                                                                      label:
                                                                                        e.label,
                                                                                      value:
                                                                                        e.value,
                                                                                    },
                                                                                }
                                                                              );
                                                                            }
                                                                          ),
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
                                                        ),
                                                      ],
                                                      1
                                                    )
                                                  : e._e(),
                                                e._v(" "),
                                                n(
                                                  "el-row",
                                                  { attrs: { gutter: 10 } },
                                                  [
                                                    n(
                                                      "el-col",
                                                      {
                                                        attrs: {
                                                          lg: 10,
                                                          md: 10,
                                                          sm: 24,
                                                        },
                                                      },
                                                      [
                                                        n("p", [
                                                          e._v(
                                                            e._s(
                                                              e.$root.labels
                                                                .event_recurring_until
                                                            )
                                                          ),
                                                        ]),
                                                      ]
                                                    ),
                                                    e._v(" "),
                                                    n(
                                                      "el-col",
                                                      {
                                                        staticClass:
                                                          "v-calendar-column",
                                                        attrs: {
                                                          lg: 14,
                                                          md: 14,
                                                          sm: 24,
                                                        },
                                                      },
                                                      [
                                                        n(
                                                          "el-form-item",
                                                          {
                                                            attrs: {
                                                              prop: "recurringUntilDate",
                                                              rules:
                                                                e.rules
                                                                  .recurringUntilDate,
                                                            },
                                                          },
                                                          [
                                                            n("v-date-picker", {
                                                              attrs: {
                                                                "is-double-paned":
                                                                  !1,
                                                                mode: "single",
                                                                "popover-visibility":
                                                                  "focus",
                                                                "popover-direction":
                                                                  e.screenWidth <
                                                                  768
                                                                    ? "bottom"
                                                                    : "top",
                                                                "popover-align":
                                                                  (e.screenWidth,
                                                                  "center"),
                                                                "tint-color":
                                                                  e.isCabinet
                                                                    ? e.$root
                                                                        .settings
                                                                        .customization
                                                                        .primaryColor
                                                                    : "#1A84EE",
                                                                "show-day-popover":
                                                                  !1,
                                                                "input-props": {
                                                                  class:
                                                                    "el-input__inner",
                                                                },
                                                                "is-expanded":
                                                                  !1,
                                                                "is-required":
                                                                  !1,
                                                                "input-class":
                                                                  "el-input__inner",
                                                                formats:
                                                                  e.vCalendarFormats,
                                                                "available-dates":
                                                                  {
                                                                    start:
                                                                      0 ===
                                                                      e.event.id
                                                                        ? e.getNowDate()
                                                                        : e
                                                                            .originRecurring
                                                                            .until,
                                                                  },
                                                              },
                                                              on: {
                                                                dayclick:
                                                                  e.changeBookingEndsDate,
                                                              },
                                                              model: {
                                                                value:
                                                                  e.event
                                                                    .recurring
                                                                    .until,
                                                                callback:
                                                                  function (t) {
                                                                    e.$set(
                                                                      e.event
                                                                        .recurring,
                                                                      "until",
                                                                      t
                                                                    );
                                                                  },
                                                                expression:
                                                                  "event.recurring.until",
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
                                              ],
                                              1
                                            )
                                          : e._e(),
                                      ],
                                      1
                                    ),
                                    e._v(" "),
                                    n(
                                      "div",
                                      { staticClass: "am-section-grey" },
                                      [
                                        n(
                                          "el-checkbox",
                                          {
                                            model: {
                                              value: e.event.bookingStartsNow,
                                              callback: function (t) {
                                                e.$set(
                                                  e.event,
                                                  "bookingStartsNow",
                                                  t
                                                );
                                              },
                                              expression:
                                                "event.bookingStartsNow",
                                            },
                                          },
                                          [
                                            e._v(
                                              e._s(
                                                e.$root.labels
                                                  .event_booking_opens_now
                                              )
                                            ),
                                          ]
                                        ),
                                        e._v(" "),
                                        n(
                                          "div",
                                          {
                                            directives: [
                                              {
                                                name: "show",
                                                rawName: "v-show",
                                                value:
                                                  !e.event.bookingStartsNow,
                                                expression:
                                                  "!event.bookingStartsNow",
                                              },
                                            ],
                                            staticClass: "am-booking-starts",
                                          },
                                          [
                                            n(
                                              "el-row",
                                              { attrs: { gutter: 10 } },
                                              [
                                                n(
                                                  "el-col",
                                                  { attrs: { sm: 24 } },
                                                  [
                                                    n(
                                                      "label",
                                                      {
                                                        staticClass:
                                                          "el-form-item__label",
                                                      },
                                                      [
                                                        e._v(
                                                          e._s(
                                                            e.$root.labels
                                                              .event_booking_opens_on
                                                          )
                                                        ),
                                                      ]
                                                    ),
                                                  ]
                                                ),
                                                e._v(" "),
                                                n(
                                                  "el-col",
                                                  {
                                                    staticClass:
                                                      "v-calendar-column",
                                                    attrs: { sm: 15 },
                                                  },
                                                  [
                                                    n(
                                                      "el-form-item",
                                                      {
                                                        attrs: {
                                                          prop: "bookingStartsDate",
                                                          rules:
                                                            e.rules
                                                              .bookingStartsDate,
                                                        },
                                                      },
                                                      [
                                                        n("v-date-picker", {
                                                          attrs: {
                                                            "is-double-paned":
                                                              !1,
                                                            mode: "single",
                                                            "popover-visibility":
                                                              "focus",
                                                            "popover-direction":
                                                              "bottom",
                                                            "popover-align":
                                                              e.screenWidth <
                                                              768
                                                                ? "center"
                                                                : "left",
                                                            "tint-color":
                                                              e.isCabinet
                                                                ? e.$root
                                                                    .settings
                                                                    .customization
                                                                    .primaryColor
                                                                : "#1A84EE",
                                                            "show-day-popover":
                                                              !1,
                                                            "input-props": {
                                                              class:
                                                                "el-input__inner",
                                                            },
                                                            "is-expanded": !1,
                                                            "is-required": !1,
                                                            "input-class":
                                                              "el-input__inner",
                                                            formats:
                                                              e.vCalendarFormats,
                                                            "available-dates": {
                                                              start:
                                                                e.getNowDate(),
                                                            },
                                                          },
                                                          on: {
                                                            dayclick:
                                                              e.changeBookingStartsDate,
                                                          },
                                                          model: {
                                                            value:
                                                              e.event
                                                                .bookingStartsDate,
                                                            callback: function (
                                                              t
                                                            ) {
                                                              e.$set(
                                                                e.event,
                                                                "bookingStartsDate",
                                                                t
                                                              );
                                                            },
                                                            expression:
                                                              "event.bookingStartsDate",
                                                          },
                                                        }),
                                                      ],
                                                      1
                                                    ),
                                                  ],
                                                  1
                                                ),
                                                e._v(" "),
                                                n(
                                                  "el-col",
                                                  { attrs: { sm: 9 } },
                                                  [
                                                    n(
                                                      "el-form-item",
                                                      {
                                                        attrs: {
                                                          prop: "bookingStartsTime",
                                                          rules:
                                                            e.rules
                                                              .bookingStartsTime,
                                                        },
                                                      },
                                                      [
                                                        n("el-time-select", {
                                                          attrs: {
                                                            "picker-options":
                                                              e.getTimeSelectOptionsWithLimits(
                                                                null,
                                                                null
                                                              ),
                                                            size: "large",
                                                          },
                                                          model: {
                                                            value:
                                                              e.event
                                                                .bookingStartsTime,
                                                            callback: function (
                                                              t
                                                            ) {
                                                              e.$set(
                                                                e.event,
                                                                "bookingStartsTime",
                                                                t
                                                              );
                                                            },
                                                            expression:
                                                              "event.bookingStartsTime",
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
                                          ],
                                          1
                                        ),
                                        e._v(" "),
                                        e.event.isRecurring
                                          ? n(
                                              "div",
                                              [
                                                n(
                                                  "el-checkbox",
                                                  {
                                                    attrs: {
                                                      "true-label": "same",
                                                      "false-label":
                                                        "calculate",
                                                    },
                                                    model: {
                                                      value:
                                                        e.event.bookingOpensRec,
                                                      callback: function (t) {
                                                        e.$set(
                                                          e.event,
                                                          "bookingOpensRec",
                                                          t
                                                        );
                                                      },
                                                      expression:
                                                        "event.bookingOpensRec",
                                                    },
                                                  },
                                                  [
                                                    e._v(
                                                      e._s(
                                                        e.$root.labels
                                                          .apply_to_all
                                                      )
                                                    ),
                                                  ]
                                                ),
                                                e._v(" "),
                                                n(
                                                  "el-tooltip",
                                                  {
                                                    attrs: { placement: "top" },
                                                  },
                                                  [
                                                    n("div", {
                                                      attrs: {
                                                        slot: "content",
                                                      },
                                                      domProps: {
                                                        innerHTML: e._s(
                                                          e.$root.labels
                                                            .event_booking_opens_apply
                                                        ),
                                                      },
                                                      slot: "content",
                                                    }),
                                                    e._v(" "),
                                                    n("i", {
                                                      staticClass:
                                                        "el-icon-question am-tooltip-icon",
                                                    }),
                                                  ]
                                                ),
                                              ],
                                              1
                                            )
                                          : e._e(),
                                      ],
                                      1
                                    ),
                                    e._v(" "),
                                    n(
                                      "div",
                                      { staticClass: "am-section-grey" },
                                      [
                                        n(
                                          "el-checkbox",
                                          {
                                            model: {
                                              value: e.event.bookingEndsAfter,
                                              callback: function (t) {
                                                e.$set(
                                                  e.event,
                                                  "bookingEndsAfter",
                                                  t
                                                );
                                              },
                                              expression:
                                                "event.bookingEndsAfter",
                                            },
                                          },
                                          [
                                            e._v(
                                              e._s(
                                                e.$root.labels
                                                  .event_booking_closes_after
                                              )
                                            ),
                                          ]
                                        ),
                                        e._v(" "),
                                        n(
                                          "div",
                                          {
                                            directives: [
                                              {
                                                name: "show",
                                                rawName: "v-show",
                                                value:
                                                  !e.event.bookingEndsAfter,
                                                expression:
                                                  "!event.bookingEndsAfter",
                                              },
                                            ],
                                            staticClass: "am-booking-ends",
                                          },
                                          [
                                            n(
                                              "el-row",
                                              { attrs: { gutter: 10 } },
                                              [
                                                n(
                                                  "el-col",
                                                  { attrs: { sm: 24 } },
                                                  [
                                                    n(
                                                      "label",
                                                      {
                                                        staticClass:
                                                          "el-form-item__label",
                                                      },
                                                      [
                                                        e._v(
                                                          e._s(
                                                            e.$root.labels
                                                              .event_booking_closes_on
                                                          )
                                                        ),
                                                      ]
                                                    ),
                                                  ]
                                                ),
                                                e._v(" "),
                                                n(
                                                  "el-col",
                                                  {
                                                    staticClass:
                                                      "v-calendar-column",
                                                    attrs: { sm: 15 },
                                                  },
                                                  [
                                                    n(
                                                      "el-form-item",
                                                      {
                                                        attrs: {
                                                          prop: "bookingEndsDate",
                                                          rules:
                                                            e.rules
                                                              .bookingEndsDate,
                                                        },
                                                      },
                                                      [
                                                        n("v-date-picker", {
                                                          attrs: {
                                                            "is-double-paned":
                                                              !1,
                                                            mode: "single",
                                                            "popover-visibility":
                                                              "focus",
                                                            "popover-direction":
                                                              "bottom",
                                                            "popover-align":
                                                              e.screenWidth <
                                                              768
                                                                ? "center"
                                                                : "left",
                                                            "tint-color":
                                                              e.isCabinet
                                                                ? e.$root
                                                                    .settings
                                                                    .customization
                                                                    .primaryColor
                                                                : "#1A84EE",
                                                            "show-day-popover":
                                                              !1,
                                                            "input-props": {
                                                              class:
                                                                "el-input__inner",
                                                            },
                                                            "is-expanded": !1,
                                                            "is-required": !1,
                                                            "input-class":
                                                              "el-input__inner",
                                                            formats:
                                                              e.vCalendarFormats,
                                                            "available-dates": {
                                                              start:
                                                                e.getNowDate(),
                                                            },
                                                          },
                                                          on: {
                                                            dayclick:
                                                              e.changeBookingEndsDate,
                                                          },
                                                          model: {
                                                            value:
                                                              e.event
                                                                .bookingEndsDate,
                                                            callback: function (
                                                              t
                                                            ) {
                                                              e.$set(
                                                                e.event,
                                                                "bookingEndsDate",
                                                                t
                                                              );
                                                            },
                                                            expression:
                                                              "event.bookingEndsDate",
                                                          },
                                                        }),
                                                      ],
                                                      1
                                                    ),
                                                  ],
                                                  1
                                                ),
                                                e._v(" "),
                                                n(
                                                  "el-col",
                                                  { attrs: { sm: 9 } },
                                                  [
                                                    n(
                                                      "el-form-item",
                                                      {
                                                        attrs: {
                                                          prop: "bookingEndsTime",
                                                          rules:
                                                            e.rules
                                                              .bookingEndsTime,
                                                        },
                                                      },
                                                      [
                                                        n("el-time-select", {
                                                          attrs: {
                                                            "picker-options":
                                                              e.getTimeSelectOptionsWithLimits(
                                                                null,
                                                                null
                                                              ),
                                                            size: "large",
                                                          },
                                                          model: {
                                                            value:
                                                              e.event
                                                                .bookingEndsTime,
                                                            callback: function (
                                                              t
                                                            ) {
                                                              e.$set(
                                                                e.event,
                                                                "bookingEndsTime",
                                                                t
                                                              );
                                                            },
                                                            expression:
                                                              "event.bookingEndsTime",
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
                                          ],
                                          1
                                        ),
                                        e._v(" "),
                                        e.event.isRecurring
                                          ? n(
                                              "div",
                                              [
                                                n(
                                                  "el-checkbox",
                                                  {
                                                    attrs: {
                                                      "true-label": "same",
                                                      "false-label":
                                                        "calculate",
                                                    },
                                                    model: {
                                                      value:
                                                        e.event
                                                          .bookingClosesRec,
                                                      callback: function (t) {
                                                        e.$set(
                                                          e.event,
                                                          "bookingClosesRec",
                                                          t
                                                        );
                                                      },
                                                      expression:
                                                        "event.bookingClosesRec",
                                                    },
                                                  },
                                                  [
                                                    e._v(
                                                      e._s(
                                                        e.$root.labels
                                                          .apply_to_all
                                                      )
                                                    ),
                                                  ]
                                                ),
                                                e._v(" "),
                                                n(
                                                  "el-tooltip",
                                                  {
                                                    attrs: { placement: "top" },
                                                  },
                                                  [
                                                    n("div", {
                                                      attrs: {
                                                        slot: "content",
                                                      },
                                                      domProps: {
                                                        innerHTML: e._s(
                                                          e.$root.labels
                                                            .event_booking_closes_apply
                                                        ),
                                                      },
                                                      slot: "content",
                                                    }),
                                                    e._v(" "),
                                                    n("i", {
                                                      staticClass:
                                                        "el-icon-question am-tooltip-icon",
                                                    }),
                                                  ]
                                                ),
                                              ],
                                              1
                                            )
                                          : e._e(),
                                      ],
                                      1
                                    ),
                                    e._v(" "),
                                    n(
                                      "div",
                                      { staticClass: "am-border-bottom" },
                                      [
                                        n(
                                          "el-row",
                                          { attrs: { gutter: 10 } },
                                          [
                                            n(
                                              "el-col",
                                              {
                                                attrs: {
                                                  lg: 12,
                                                  md: 12,
                                                  sm: 24,
                                                },
                                              },
                                              [
                                                n("p", [
                                                  e._v(
                                                    e._s(e.$root.labels.price)
                                                  ),
                                                ]),
                                              ]
                                            ),
                                            e._v(" "),
                                            n(
                                              "el-col",
                                              {
                                                attrs: {
                                                  lg: 12,
                                                  md: 12,
                                                  sm: 24,
                                                },
                                              },
                                              [
                                                n(
                                                  "money",
                                                  e._b(
                                                    {
                                                      staticClass:
                                                        "el-input el-input__inner",
                                                      on: {
                                                        input: e.priceChanged,
                                                      },
                                                      model: {
                                                        value: e.event.price,
                                                        callback: function (t) {
                                                          e.$set(
                                                            e.event,
                                                            "price",
                                                            t
                                                          );
                                                        },
                                                        expression:
                                                          "event.price",
                                                      },
                                                    },
                                                    "money",
                                                    e.moneyComponentData,
                                                    !1
                                                  )
                                                ),
                                              ],
                                              1
                                            ),
                                          ],
                                          1
                                        ),
                                        e._v(" "),
                                        parseFloat(e.event.price) > 0
                                          ? n(
                                              "div",
                                              {
                                                staticClass:
                                                  "am-setting-box am-switch-box",
                                              },
                                              [
                                                n(
                                                  "el-row",
                                                  {
                                                    attrs: {
                                                      type: "flex",
                                                      align: "middle",
                                                      gutter: 24,
                                                    },
                                                  },
                                                  [
                                                    n(
                                                      "el-col",
                                                      { attrs: { span: 19 } },
                                                      [
                                                        e._v(
                                                          "\n                    " +
                                                            e._s(
                                                              e.$root.labels
                                                                .deposit_enabled
                                                            ) +
                                                            "\n                  "
                                                        ),
                                                      ]
                                                    ),
                                                    e._v(" "),
                                                    n(
                                                      "el-col",
                                                      {
                                                        staticClass:
                                                          "align-right",
                                                        attrs: { span: 5 },
                                                      },
                                                      [
                                                        n("el-switch", {
                                                          attrs: {
                                                            "active-text": "",
                                                            "inactive-text": "",
                                                          },
                                                          on: {
                                                            change:
                                                              e.depositEnabledChanged,
                                                          },
                                                          model: {
                                                            value:
                                                              e.depositEnabled,
                                                            callback: function (
                                                              t
                                                            ) {
                                                              e.depositEnabled =
                                                                t;
                                                            },
                                                            expression:
                                                              "depositEnabled",
                                                          },
                                                        }),
                                                      ],
                                                      1
                                                    ),
                                                  ],
                                                  1
                                                ),
                                                e._v(" "),
                                                e.depositEnabled
                                                  ? n(
                                                      "el-row",
                                                      {
                                                        staticClass:
                                                          "am-service-deposit",
                                                        attrs: { gutter: 24 },
                                                      },
                                                      [
                                                        n(
                                                          "el-col",
                                                          {
                                                            attrs: { span: 12 },
                                                          },
                                                          [
                                                            n(
                                                              "el-form-item",
                                                              [
                                                                n(
                                                                  "label",
                                                                  {
                                                                    attrs: {
                                                                      slot: "label",
                                                                    },
                                                                    slot: "label",
                                                                  },
                                                                  [
                                                                    e._v(
                                                                      "\n                        " +
                                                                        e._s(
                                                                          e
                                                                            .$root
                                                                            .labels
                                                                            .deposit_payment
                                                                        ) +
                                                                        ":\n                        "
                                                                    ),
                                                                    n(
                                                                      "el-tooltip",
                                                                      {
                                                                        attrs: {
                                                                          placement:
                                                                            "top",
                                                                        },
                                                                      },
                                                                      [
                                                                        n(
                                                                          "div",
                                                                          {
                                                                            attrs:
                                                                              {
                                                                                slot: "content",
                                                                              },
                                                                            domProps:
                                                                              {
                                                                                innerHTML:
                                                                                  e._s(
                                                                                    e
                                                                                      .$root
                                                                                      .labels
                                                                                      .deposit_payment_tooltip
                                                                                  ),
                                                                              },
                                                                            slot: "content",
                                                                          }
                                                                        ),
                                                                        e._v(
                                                                          " "
                                                                        ),
                                                                        n("i", {
                                                                          staticClass:
                                                                            "el-icon-question am-tooltip-icon",
                                                                        }),
                                                                      ]
                                                                    ),
                                                                  ],
                                                                  1
                                                                ),
                                                                e._v(" "),
                                                                n(
                                                                  "el-select",
                                                                  {
                                                                    attrs: {
                                                                      placeholder:
                                                                        "",
                                                                    },
                                                                    on: {
                                                                      change:
                                                                        function (
                                                                          t
                                                                        ) {
                                                                          return e.depositChanged();
                                                                        },
                                                                    },
                                                                    model: {
                                                                      value:
                                                                        e.depositPayment,
                                                                      callback:
                                                                        function (
                                                                          t
                                                                        ) {
                                                                          e.depositPayment =
                                                                            t;
                                                                        },
                                                                      expression:
                                                                        "depositPayment",
                                                                    },
                                                                  },
                                                                  e._l(
                                                                    e.depositOptions,
                                                                    function (
                                                                      e,
                                                                      t
                                                                    ) {
                                                                      return n(
                                                                        "el-option",
                                                                        {
                                                                          key: t,
                                                                          attrs:
                                                                            {
                                                                              label:
                                                                                e.label,
                                                                              value:
                                                                                e.value,
                                                                            },
                                                                        }
                                                                      );
                                                                    }
                                                                  ),
                                                                  1
                                                                ),
                                                              ],
                                                              1
                                                            ),
                                                          ],
                                                          1
                                                        ),
                                                        e._v(" "),
                                                        n(
                                                          "el-col",
                                                          {
                                                            attrs: { span: 12 },
                                                          },
                                                          [
                                                            n(
                                                              "el-form-item",
                                                              {
                                                                attrs: {
                                                                  label:
                                                                    e.$root
                                                                      .labels
                                                                      .deposit_amount +
                                                                    ("fixed" ===
                                                                    e.depositPayment
                                                                      ? " (" +
                                                                        e.getCurrencySymbol() +
                                                                        ")"
                                                                      : "") +
                                                                    ("percentage" ===
                                                                    e.depositPayment
                                                                      ? " (%)"
                                                                      : "") +
                                                                    ":",
                                                                },
                                                              },
                                                              [
                                                                "fixed" ===
                                                                e.depositPayment
                                                                  ? n(
                                                                      "div",
                                                                      {
                                                                        staticClass:
                                                                          "el-input",
                                                                      },
                                                                      [
                                                                        n(
                                                                          "money",
                                                                          e._b(
                                                                            {
                                                                              staticClass:
                                                                                "el-input__inner",
                                                                              on: {
                                                                                input:
                                                                                  e.depositChanged,
                                                                              },
                                                                              model:
                                                                                {
                                                                                  value:
                                                                                    e
                                                                                      .event
                                                                                      .deposit,
                                                                                  callback:
                                                                                    function (
                                                                                      t
                                                                                    ) {
                                                                                      e.$set(
                                                                                        e.event,
                                                                                        "deposit",
                                                                                        t
                                                                                      );
                                                                                    },
                                                                                  expression:
                                                                                    "event.deposit",
                                                                                },
                                                                            },
                                                                            "money",
                                                                            e.moneyComponentData,
                                                                            !1
                                                                          )
                                                                        ),
                                                                      ],
                                                                      1
                                                                    )
                                                                  : e._e(),
                                                                e._v(" "),
                                                                "percentage" ===
                                                                e.depositPayment
                                                                  ? n(
                                                                      "el-input-number",
                                                                      {
                                                                        attrs: {
                                                                          min: 0,
                                                                          max: 100,
                                                                        },
                                                                        on: {
                                                                          input:
                                                                            function (
                                                                              t
                                                                            ) {
                                                                              return e.depositChanged();
                                                                            },
                                                                        },
                                                                        model: {
                                                                          value:
                                                                            e
                                                                              .event
                                                                              .deposit,
                                                                          callback:
                                                                            function (
                                                                              t
                                                                            ) {
                                                                              e.$set(
                                                                                e.event,
                                                                                "deposit",
                                                                                t
                                                                              );
                                                                            },
                                                                          expression:
                                                                            "event.deposit",
                                                                        },
                                                                      }
                                                                    )
                                                                  : e._e(),
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
                                                e.event.maxCapacity > 1 &&
                                                "fixed" === e.depositPayment &&
                                                e.depositEnabled
                                                  ? n(
                                                      "el-row",
                                                      [
                                                        n(
                                                          "el-col",
                                                          [
                                                            n(
                                                              "el-checkbox",
                                                              {
                                                                model: {
                                                                  value:
                                                                    e.event
                                                                      .depositPerPerson,
                                                                  callback:
                                                                    function (
                                                                      t
                                                                    ) {
                                                                      e.$set(
                                                                        e.event,
                                                                        "depositPerPerson",
                                                                        t
                                                                      );
                                                                    },
                                                                  expression:
                                                                    "event.depositPerPerson",
                                                                },
                                                              },
                                                              [
                                                                e._v(
                                                                  e._s(
                                                                    e.$root
                                                                      .labels
                                                                      .deposit_per_person
                                                                  )
                                                                ),
                                                              ]
                                                            ),
                                                            e._v(" "),
                                                            n("hr"),
                                                          ],
                                                          1
                                                        ),
                                                      ],
                                                      1
                                                    )
                                                  : e._e(),
                                                e._v(" "),
                                                e.depositEnabled
                                                  ? n(
                                                      "el-row",
                                                      {
                                                        staticClass:
                                                          "am-service-deposit",
                                                        attrs: { gutter: 24 },
                                                      },
                                                      [
                                                        n(
                                                          "el-col",
                                                          {
                                                            attrs: { span: 24 },
                                                          },
                                                          [
                                                            n("i", {
                                                              staticClass:
                                                                "el-icon-warning-outline",
                                                            }),
                                                            e._v(" "),
                                                            n("label", [
                                                              e._v(
                                                                e._s(
                                                                  e.$root.labels
                                                                    .deposit_info
                                                                )
                                                              ),
                                                            ]),
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
                                        n(
                                          "el-row",
                                          { attrs: { gutter: 10 } },
                                          [
                                            n(
                                              "el-col",
                                              {
                                                attrs: {
                                                  lg: 12,
                                                  md: 12,
                                                  sm: 24,
                                                },
                                              },
                                              [
                                                n("p", [
                                                  e._v(
                                                    e._s(
                                                      e.$root.labels
                                                        .event_max_capacity
                                                    )
                                                  ),
                                                ]),
                                              ]
                                            ),
                                            e._v(" "),
                                            n(
                                              "el-col",
                                              {
                                                attrs: {
                                                  lg: 12,
                                                  md: 12,
                                                  sm: 24,
                                                },
                                              },
                                              [
                                                n("el-input-number", {
                                                  attrs: { min: 1 },
                                                  model: {
                                                    value: e.event.maxCapacity,
                                                    callback: function (t) {
                                                      e.$set(
                                                        e.event,
                                                        "maxCapacity",
                                                        t
                                                      );
                                                    },
                                                    expression:
                                                      "event.maxCapacity",
                                                  },
                                                }),
                                              ],
                                              1
                                            ),
                                          ],
                                          1
                                        ),
                                        e._v(" "),
                                        e.event.maxCapacity > 1
                                          ? n(
                                              "el-row",
                                              { attrs: { gutter: 10 } },
                                              [
                                                n(
                                                  "el-col",
                                                  {
                                                    attrs: {
                                                      lg: 24,
                                                      md: 24,
                                                      sm: 24,
                                                    },
                                                  },
                                                  [
                                                    n(
                                                      "el-checkbox",
                                                      {
                                                        model: {
                                                          value:
                                                            e.event
                                                              .bringingAnyone,
                                                          callback: function (
                                                            t
                                                          ) {
                                                            e.$set(
                                                              e.event,
                                                              "bringingAnyone",
                                                              t
                                                            );
                                                          },
                                                          expression:
                                                            "event.bringingAnyone",
                                                        },
                                                      },
                                                      [
                                                        e._v(
                                                          e._s(
                                                            e.$root.labels
                                                              .event_bringing_anyone
                                                          )
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
                                        e.event.maxCapacity > 1
                                          ? n(
                                              "el-row",
                                              { attrs: { gutter: 10 } },
                                              [
                                                n(
                                                  "el-col",
                                                  {
                                                    attrs: {
                                                      lg: 24,
                                                      md: 24,
                                                      sm: 24,
                                                    },
                                                  },
                                                  [
                                                    n(
                                                      "el-checkbox",
                                                      {
                                                        model: {
                                                          value:
                                                            e.event
                                                              .bookMultipleTimes,
                                                          callback: function (
                                                            t
                                                          ) {
                                                            e.$set(
                                                              e.event,
                                                              "bookMultipleTimes",
                                                              t
                                                            );
                                                          },
                                                          expression:
                                                            "event.bookMultipleTimes",
                                                        },
                                                      },
                                                      [
                                                        e._v(
                                                          e._s(
                                                            e.$root.labels
                                                              .event_book_more_than_once
                                                          )
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
                                      ],
                                      1
                                    ),
                                    e._v(" "),
                                    n(
                                      "div",
                                      { staticClass: "am-border-bottom" },
                                      [
                                        n(
                                          "el-row",
                                          { attrs: { gutter: 10 } },
                                          [
                                            n(
                                              "el-col",
                                              {
                                                attrs: {
                                                  lg: 12,
                                                  md: 12,
                                                  sm: 24,
                                                },
                                              },
                                              [
                                                n("p", [
                                                  e._v(
                                                    e._s(
                                                      "Select Location"
                                                    )
                                                  ),
                                                ]),
                                              ]
                                            ),
                                            e._v(" "),
                                            n(
                                              "el-col",
                                              {
                                                attrs: {
                                                  lg: 12,
                                                  md: 12,
                                                  sm: 24,
                                                },
                                              },
                                              [
                                                n(
                                                  "el-select",
                                                  {
                                                    attrs: {
                                                      placeholder:
                                                        e.$root.labels.select,
                                                      value: null,
                                                      clearable: !0,
                                                    },
                                                    model: {
                                                      value: e.event.locationId,
                                                      callback: function (t) {
                                                        e.$set(
                                                          e.event,
                                                          "locationId",
                                                          t
                                                        );
                                                      },
                                                      expression:
                                                        "event.locationId",
                                                    },
                                                  }, //P2P: Remove custom address option from location list
                                                  e._l(e.locations, loc => n("el-option", {
                                                      key: loc.id,
                                                      attrs: {
                                                        label: loc.name,
                                                        value: loc.id,
                                                      },
                                                    })
                                                  )
                                                ),
                                              ],
                                              1
                                            ),
                                          ],
                                          1
                                        ),
                                        e._v(" "),
                                        n(
                                          "el-row",
                                          {
                                            attrs: { gutter: 10 },
                                          },
                                          [
                                            n(
                                              "el-col",
                                              {
                                                attrs: {
                                                  lg: 12,
                                                  md: 12,
                                                  sm: 24,
                                                },
                                              },
                                              [
                                                n("p", [
                                                  e._v(
                                                    e._s(
                                                      e.$root.labels
                                                        .event_custom_address
                                                    )
                                                  ),
                                                ]),
                                              ]
                                            ),
                                            e._v(" "),
                                            n(
                                              "el-col",
                                              {
                                                attrs: {
                                                  lg: 12,
                                                  md: 12,
                                                  sm: 24,
                                                },
                                              },
                                              [
                                                n("el-input", {
                                                  attrs: {
                                                    placeholder:
                                                      e.$root.labels
                                                        .enter_address,
                                                  },
                                                  model: {
                                                    value:
                                                      e.event.customLocation,
                                                    callback: function (t) {
                                                      e.$set(
                                                        e.event,
                                                        "customLocation",
                                                        t
                                                      );
                                                    },
                                                    expression:
                                                      "event.customLocation",
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
                                    n(
                                      "div",
                                      { staticClass: "am-border-bottom" },
                                      [
                                        e.$root.settings.zoom.enabled
                                          ? n(
                                              "el-row",
                                              { attrs: { gutter: 10 } },
                                              [
                                                n(
                                                  "el-col",
                                                  {
                                                    attrs: {
                                                      lg: 12,
                                                      md: 12,
                                                      sm: 24,
                                                    },
                                                  },
                                                  [
                                                    n("p", [
                                                      e._v(
                                                        e._s(
                                                          e.$root.labels
                                                            .zoom_user
                                                        )
                                                      ),
                                                    ]),
                                                  ]
                                                ),
                                                e._v(" "),
                                                n(
                                                  "el-col",
                                                  {
                                                    attrs: {
                                                      lg: 12,
                                                      md: 12,
                                                      sm: 24,
                                                    },
                                                  },
                                                  [
                                                    n(
                                                      "el-select",
                                                      {
                                                        attrs: {
                                                          clearable: "",
                                                          filterable: "",
                                                          placeholder:
                                                            e.$root.labels
                                                              .zoom_user_placeholder,
                                                        },
                                                        on: {
                                                          change: function (t) {
                                                            return e.clearValidation();
                                                          },
                                                        },
                                                        model: {
                                                          value:
                                                            e.event.zoomUserId,
                                                          callback: function (
                                                            t
                                                          ) {
                                                            e.$set(
                                                              e.event,
                                                              "zoomUserId",
                                                              t
                                                            );
                                                          },
                                                          expression:
                                                            "event.zoomUserId",
                                                        },
                                                      },
                                                      e._l(
                                                        e.zoomUsers,
                                                        function (e, t) {
                                                          return n(
                                                            "el-option",
                                                            {
                                                              key: t,
                                                              attrs: {
                                                                label:
                                                                  e.first_name +
                                                                  " " +
                                                                  e.last_name +
                                                                  " (" +
                                                                  e.email +
                                                                  ")",
                                                                value: e.id,
                                                              },
                                                            }
                                                          );
                                                        }
                                                      ),
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
                                        e.canManage()
                                          ? n(
                                              "el-row",
                                              { attrs: { gutter: 10 } },
                                              [
                                                n(
                                                  "el-col",
                                                  {
                                                    attrs: {
                                                      lg: 12,
                                                      md: 12,
                                                      sm: 24,
                                                    },
                                                  },
                                                  [
                                                    n("p", [
                                                      e._v(
                                                        e._s(
                                                          e.$root.labels
                                                            .event_staff
                                                        )
                                                      ),
                                                    ]),
                                                  ]
                                                ),
                                                e._v(" "),
                                                n(
                                                  "el-col",
                                                  {
                                                    attrs: {
                                                      lg: 12,
                                                      md: 12,
                                                      sm: 24,
                                                    },
                                                  },
                                                  [
                                                    n(
                                                      "el-select",
                                                      {
                                                        attrs: {
                                                          "value-key": "id",
                                                          placeholder:
                                                            e.$root.labels
                                                              .select,
                                                          multiple: "",
                                                        },
                                                        model: {
                                                          value:
                                                            e.event.providers,
                                                          callback: function (
                                                            t
                                                          ) {
                                                            e.$set(
                                                              e.event,
                                                              "providers",
                                                              t
                                                            );
                                                          },
                                                          expression:
                                                            "event.providers",
                                                        },
                                                      },
                                                      e._l(
                                                        e.employees,
                                                        function (e) {
                                                          return n(
                                                            "el-option",
                                                            {
                                                              key: e.id,
                                                              attrs: {
                                                                label:
                                                                  e.firstName +
                                                                  " " +
                                                                  e.lastName,
                                                                value: e,
                                                              },
                                                            }
                                                          );
                                                        }
                                                      ),
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
                                        n(
                                          "el-row",
                                          { attrs: { gutter: 10 } },
                                          [
                                            n(
                                              "el-col",
                                              {
                                                attrs: {
                                                  lg: 12,
                                                  md: 12,
                                                  sm: 24,
                                                },
                                              },
                                              [
                                                n("p", [
                                                  e._v(
                                                    e._s(
                                                      e.$root.labels.event_tags
                                                    )
                                                  ),
                                                ]),
                                              ]
                                            ),
                                            e._v(" "),
                                            n(
                                              "el-col",
                                              {
                                                attrs: {
                                                  lg: 12,
                                                  md: 12,
                                                  sm: 24,
                                                },
                                              },
                                              [
                                                n(
                                                  "el-select",
                                                  {
                                                    attrs: {
                                                      placeholder:
                                                        e.$root.labels
                                                          .event_tags_select_or_create,
                                                      multiple: "",
                                                      filterable: "",
                                                      "allow-create": "",
                                                      "default-first-option":
                                                        "",
                                                      "no-data-text":
                                                        e.$root.labels
                                                          .event_tags_create,
                                                    },
                                                    on: {
                                                      change: e.tagsChanged,
                                                    },
                                                    model: {
                                                      value: e.event.tags,
                                                      callback: function (t) {
                                                        e.$set(
                                                          e.event,
                                                          "tags",
                                                          t
                                                        );
                                                      },
                                                      expression: "event.tags",
                                                    },
                                                  },
                                                  e._l(e.tags, function (t, o) {
                                                    return t
                                                      ? n("el-option", {
                                                          key: o,
                                                          attrs: {
                                                            label: t,
                                                            value: t,
                                                          },
                                                        })
                                                      : e._e();
                                                  }),
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
                                    e._v(" "),
                                    n(
                                      "div",
                                      { staticClass: "am-event-description" },
                                      [
                                        n(
                                          "el-row",
                                          { attrs: { gutter: 10 } },
                                          [
                                            n(
                                              "el-col",
                                              { attrs: { span: 24 } },
                                              [
                                                n(
                                                  "el-form-item",
                                                  {
                                                    staticClass:
                                                      "am-event-label",
                                                  },
                                                  [
                                                    e._v(
                                                      "\n                    " +
                                                        e._s(
                                                          e.$root.labels
                                                            .description + ":"
                                                        ) +
                                                        "\n                    "
                                                    ),
                                                    e.isCabinet
                                                      ? e._e()
                                                      : n(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "am-event-translate",
                                                            on: {
                                                              click: function (
                                                                t
                                                              ) {
                                                                return e.showDialogTranslate(
                                                                  "description"
                                                                );
                                                              },
                                                            },
                                                          },
                                                          [
                                                            n("img", {
                                                              staticClass:
                                                                "am-dialog-translate-svg",
                                                              attrs: {
                                                                width: "16px",
                                                                src:
                                                                  e.$root
                                                                    .getUrl +
                                                                  "public/img/translate.svg",
                                                              },
                                                            }),
                                                            e._v(
                                                              "\n                      " +
                                                                e._s(
                                                                  e.$root.labels
                                                                    .translate
                                                                ) +
                                                                "\n                    "
                                                            ),
                                                          ]
                                                        ),
                                                    e._v(" "),
                                                    n("el-input", {
                                                      staticStyle: {
                                                        "margin-top":
                                                          "5px !important",
                                                      },
                                                      attrs: {
                                                        type: "textarea",
                                                      },
                                                      model: {
                                                        value:
                                                          e.event.description,
                                                        callback: function (t) {
                                                          e.$set(
                                                            e.event,
                                                            "description",
                                                            t
                                                          );
                                                        },
                                                        expression:
                                                          "event.description",
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
                                      ],
                                      1
                                    ),
                                  ],
                                  1
                                ),
                                e._v(" "),
                                n(
                                  "el-tab-pane",
                                  {
                                    attrs: {
                                      label: e.$root.labels.customize,
                                      name: "customize",
                                    },
                                  },
                                  [
                                    e.showGallery
                                      ? n("gallery", {
                                          attrs: {
                                            gallery: e.event.gallery,
                                            label: e.$root.labels.event_gallery,
                                          },
                                          on: {
                                            galleryUpdated: e.galleryUpdated,
                                          },
                                        })
                                      : e._e(),
                                    e._v(" "),
                                    n(
                                      "div",
                                      { staticClass: "am-event-colors" },
                                      [
                                        n(
                                          "div",
                                          {
                                            staticClass:
                                              "am-event-section-title",
                                          },
                                          [
                                            e._v(
                                              "\n                " +
                                                e._s(
                                                  e.$root.labels.event_colors
                                                ) +
                                                "\n              "
                                            ),
                                          ]
                                        ),
                                        e._v(" "),
                                        n(
                                          "div",
                                          {
                                            staticClass:
                                              "am-event-color-selection",
                                          },
                                          [
                                            n(
                                              "div",
                                              [
                                                n(
                                                  "el-radio",
                                                  {
                                                    attrs: {
                                                      label: 1,
                                                      value: "1",
                                                    },
                                                    model: {
                                                      value: e.event.colorType,
                                                      callback: function (t) {
                                                        e.$set(
                                                          e.event,
                                                          "colorType",
                                                          t
                                                        );
                                                      },
                                                      expression:
                                                        "event.colorType",
                                                    },
                                                  },
                                                  [
                                                    e._v(
                                                      e._s(
                                                        e.$root.labels
                                                          .event_colors_preset
                                                      )
                                                    ),
                                                  ]
                                                ),
                                                e._v(" "),
                                                n(
                                                  "div",
                                                  {
                                                    staticClass:
                                                      "am-event-swatches am-event-swatches-first",
                                                  },
                                                  e._l(e.colors, function (t) {
                                                    return n("span", {
                                                      key: t,
                                                      class: {
                                                        "color-active":
                                                          t ===
                                                          e.event.selectedColor,
                                                      },
                                                      style:
                                                        "background-color: " +
                                                        t,
                                                      attrs: {
                                                        "data-color": t,
                                                      },
                                                      on: {
                                                        click:
                                                          e.changeEventColor,
                                                      },
                                                    });
                                                  }),
                                                  0
                                                ),
                                              ],
                                              1
                                            ),
                                            e._v(" "),
                                            n(
                                              "div",
                                              [
                                                n(
                                                  "el-radio",
                                                  {
                                                    attrs: {
                                                      label: 2,
                                                      value: "2",
                                                    },
                                                    model: {
                                                      value: e.event.colorType,
                                                      callback: function (t) {
                                                        e.$set(
                                                          e.event,
                                                          "colorType",
                                                          t
                                                        );
                                                      },
                                                      expression:
                                                        "event.colorType",
                                                    },
                                                  },
                                                  [
                                                    e._v(
                                                      e._s(
                                                        e.$root.labels
                                                          .event_colors_custom
                                                      )
                                                    ),
                                                  ]
                                                ),
                                                e._v(" "),
                                                n("el-input", {
                                                  staticClass:
                                                    "am-event-custom-color",
                                                  attrs: {
                                                    disabled:
                                                      1 === e.event.colorType,
                                                    placeholder: "000000",
                                                  },
                                                  model: {
                                                    value: e.event.customColor,
                                                    callback: function (t) {
                                                      e.$set(
                                                        e.event,
                                                        "customColor",
                                                        t
                                                      );
                                                    },
                                                    expression:
                                                      "event.customColor",
                                                  },
                                                }),
                                                e._v(" "),
                                                n(
                                                  "div",
                                                  {
                                                    staticClass:
                                                      "am-event-swatches",
                                                  },
                                                  [
                                                    n("span", {
                                                      style:
                                                        "background-color: " +
                                                        e.event.customColor,
                                                      attrs: {
                                                        "data-color":
                                                          e.event.customColor,
                                                      },
                                                    }),
                                                  ]
                                                ),
                                              ],
                                              1
                                            ),
                                          ]
                                        ),
                                      ]
                                    ),
                                    e._v(" "),
                                    n(
                                      "div",
                                      [
                                        n(
                                          "el-checkbox",
                                          {
                                            model: {
                                              value: e.event.show,
                                              callback: function (t) {
                                                e.$set(e.event, "show", t);
                                              },
                                              expression: "event.show",
                                            },
                                          },
                                          [
                                            e._v(
                                              e._s(
                                                e.$root.labels
                                                  .event_show_on_site
                                              )
                                            ),
                                          ]
                                        ),
                                      ],
                                      1
                                    ),
                                  ],
                                  1
                                ),
                                e._v(" "),
                                n(
                                  "el-tab-pane",
                                  {
                                    attrs: {
                                      label: e.$root.labels.settings,
                                      name: "settings",
                                    },
                                  },
                                  [
                                    n("entity-settings", {
                                      attrs: {
                                        settings: e.settings,
                                        paymentsSettings:
                                          e.event.settings.payments,
                                        generalSettings:
                                          e.event.settings.general,
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
                        )
                      : e._e(),
                  ],
                  1
                )
              : e._e(),
            e._v(" "),
            e.event &&
            !e.dialogLoading &&
            "customer" !== this.$root.settings.role
              ? n("dialog-actions", {
                  attrs: {
                    formName: "event",
                    urlName: "events",
                    isNew: 0 === e.event.id,
                    entity: e.event,
                    getParsedEntity: e.getParsedEntity,
                    haveSaveConfirmation: e.haveSaveConfirmation,
                    hasIcons: !1,
                    updateStash: !0,
                    hasApplyGloballyVisibility: e.originRecurring.until,
                    hasApplyGloballyDeletion:
                      e.originRecurring.until && "rejected" === e.event.status,
                    status: { on: "approved", off: "rejected" },
                    buttonType: {
                      status:
                        "approved" === e.event.status ? "danger" : "primary",
                      remove: "danger",
                      duplicate: "primary",
                    },
                    buttonText: {
                      action: {
                        remove: e.$root.labels.event_delete,
                        status:
                          "approved" === e.event.status
                            ? e.$root.labels.event_cancel
                            : e.$root.labels.event_open,
                        duplicate: e.$root.labels.event_duplicate,
                      },
                      confirm: {
                        save: e.originRecurring.until
                          ? {
                              yes: e.$root.labels.update_following,
                              no: e.$root.labels.save_single,
                            }
                          : null,
                        status: e.originRecurring.until
                          ? {
                              yes:
                                "rejected" === e.event.status
                                  ? e.$root.labels.open_following
                                  : e.$root.labels.cancel_following,
                              no: e.$root.labels.save_single,
                            }
                          : null,
                        remove: e.originRecurring.until
                          ? {
                              yes: e.$root.labels.delete_following,
                              no: e.$root.labels.save_single,
                            }
                          : null,
                      },
                    },
                    action: {
                      haveAdd: !0,
                      haveEdit: !0,
                      haveStatus: e.canManage(),
                      haveRemove:
                        !0 === e.$root.settings.capabilities.canDelete &&
                        "rejected" === e.event.status,
                      haveRemoveEffect: "rejected" !== e.event.status,
                      haveDuplicate: "approved" === e.event.status,
                    },
                    message: {
                      success: {
                        save: e.$root.labels.event_saved,
                        remove: e.$root.labels.event_deleted,
                        show: e.$root.labels.event_opened,
                        hide: e.$root.labels.event_canceled,
                      },
                      confirm: {
                        save: e.originRecurring.until
                          ? e.$root.labels.confirm_save_following
                          : null,
                        remove: e.originRecurring.until
                          ? e.$root.labels.confirm_delete_following
                          : e.$root.labels.confirm_delete,
                        show: e.originRecurring.until
                          ? e.$root.labels.confirm_open_following
                          : e.$root.labels.confirm_open,
                        hide: e.originRecurring.until
                          ? e.$root.labels.confirm_cancel_following
                          : e.$root.labels.confirm_cancel,
                        duplicate: e.$root.labels.confirm_duplicate_event,
                      },
                    },
                  },
                  on: {
                    validationFailCallback: e.validationFailCallback,
                    errorCallback: e.errorCallback,
                  },
                })
              : e._e(),
          ],
          1
        );
      },
      staticRenderFns: [],
    };
  },
  938: function (e, t, n) {
    var o = n(685)(n(939), n(940), !1, null, null, null);
    e.exports = o.exports;
  },
  939: function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var o = n(337),
      i = n(833),
      a = n(690),
      s = n(687),
      r = n(691),
      l = n(757);
    t.default = {
      mixins: [s.a, o.a, a.a, l.a, r.a, i.a],
      props: {
        options: null,
        eventBookings: null,
        bookingCreatedCount: 0,
        newBooking: null,
        showHeader: { required: !1, default: !0, type: Boolean },
        showExport: { required: !1, default: !0, type: Boolean },
        writeEvents: { type: Boolean, default: !0, required: !1 },
        popperAppendToBody: { type: Boolean, default: !0, required: !1 },
      },
      data: function () {
        return {
          dialogExport: !1,
          bookings: [],
          name: "events/bookings",
          successMessage: {
            single: this.$root.labels.event_attendee_deleted,
            multiple: this.$root.labels.event_attendees_deleted,
          },
          errorMessage: {
            single: this.$root.labels.event_attendee_not_deleted,
            multiple: this.$root.labels.event_attendees_not_deleted,
          },
          search: "",
          hasResult: !0,
          dialogLoading: !0,
          showDeleteConfirmation: !1,
          statuses: [
            { value: "approved", label: this.$root.labels.approved },
            { value: "rejected", label: this.$root.labels.rejected },
          ],
        };
      },
      methods: {
        getInitAttendeeObject: function () {
          return {
            id: 0,
            customer: null,
            status: "approved",
            persons: 1,
            added: !1,
            info: null,
            aggregatedPrice: !0,
            customFields: {},
          };
        },
        addAttendee: function () {
          this.$emit("showDialogAttendee", this.getInitAttendeeObject());
        },
        updateBookingStatus: function (e) {
          var t = this;
          this.$http
            .post(this.$root.getAjaxUrl + "/events/bookings/" + e.id, {
              status: e.status,
              bookings: [{ status: e.status }],
            })
            .then(function () {
              t.notify(
                t.$root.labels.success,
                t.$root.labels.event_status_changed + e.status,
                "success"
              );
            })
            .catch(function (e) {
              t.notify(t.$root.labels.error, e.message, "error");
            });
        },
        getCustomer: function (e) {
          return e.info ? JSON.parse(e.info) : e.customer;
        },
        instantiateDialog: function () {
          this.eventBookings &&
            ((this.bookings = this.eventBookings), (this.dialogLoading = !1));
        },
        closeDialog: function () {
          this.$emit("closeDialog");
        },
        removeAttendee: function (e) {
          var t = this,
            n = [];
          (this.bookings[e].removing = !0),
            this.deleteEntities(
              [this.bookings[e].id],
              function () {
                setTimeout(function () {
                  for (var e = t.bookings.length - 1; e >= 0; e--)
                    -1 !== n.indexOf(t.bookings[e].id) &&
                      t.bookings.splice(e, 1);
                  t.$emit("updateAttendeesCallback"),
                    0 === t.bookings.length && t.$emit("closeDialog");
                }, 500);
              },
              function (e) {
                n.push(e);
              },
              function (e) {}
            );
        },
        editAttendee: function (e) {
          this.$emit("showDialogAttendee", this.bookings[e]);
        },
        removeAttendees: function () {
          var e = this,
            t = [];
          (e.dialogLoading = !0),
            (e.showDeleteConfirmation = !1),
            this.deleteEntities(
              e.bookings
                .filter(function (e) {
                  return e.checked;
                })
                .map(function (e) {
                  return e.id;
                }),
              function () {
                setTimeout(function () {
                  for (var n = e.bookings.length - 1; n >= 0; n--)
                    -1 !== t.indexOf(e.bookings[n].id) &&
                      e.bookings.splice(n, 1);
                  (e.dialogLoading = !1),
                    e.$emit("updateAttendeesCallback"),
                    0 === e.bookings.length && e.$emit("closeDialog");
                }, 500);
              },
              function (e) {
                t.push(e);
              },
              function (e) {}
            );
        },
        searchAttendees: function () {
          var e = this;
          this.bookings.forEach(function (t) {
            t.show =
              t.customer.firstName
                .toLowerCase()
                .startsWith(e.search.toLowerCase()) ||
              t.customer.lastName
                .toLowerCase()
                .startsWith(e.search.toLowerCase()) ||
              (t.customer.firstName + " " + t.customer.lastName)
                .toLowerCase()
                .startsWith(e.search.toLowerCase()) ||
              (t.customer.lastName + " " + t.customer.firstName)
                .toLowerCase()
                .startsWith(e.search.toLowerCase()) ||
              (null !== t.customer.email &&
                t.customer.email
                  .toLowerCase()
                  .startsWith(e.search.toLowerCase())) ||
              (null !== t.customer.phone &&
                t.customer.phone
                  .toLowerCase()
                  .startsWith(e.search.toLowerCase())) ||
              (null !== t.token &&
                t.token
                  .toLowerCase()
                  .substring(0, 5)
                  .startsWith(e.search.toLowerCase()));
          }),
            (this.hasResult =
              this.bookings.filter(function (e) {
                return !0 === e.show;
              }).length > 0);
        },
        openExportAttendeesDialog: function () {
          this.$emit("openExportAttendeesDialog");
        },
      },
      mounted: function () {
        this.instantiateDialog();
      },
      watch: {
        bookingCreatedCount: function () {
          (this.bookings = this.eventBookings),
            this.bookings.sort(function (e, t) {
              return (
                e.customer.firstName +
                " " +
                e.customer.lastName
              ).localeCompare(t.customer.firstName + " " + t.customer.lastName);
            }),
            (this.hasResult = !0),
            (this.search = "");
        },
      },
    };
  },
  940: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          n = e._self._c || t;
        return n(
          "div",
          { staticClass: "am-dialog-attendees-inner" },
          [
            n(
              "div",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: e.dialogLoading,
                    expression: "dialogLoading",
                  },
                ],
                staticClass: "am-dialog-loader",
              },
              [
                n("div", { staticClass: "am-dialog-loader-content" }, [
                  n("img", {
                    attrs: { src: e.$root.getUrl + "public/img/spinner.svg" },
                  }),
                  e._v(" "),
                  n("p", [e._v(e._s(e.$root.labels.loader_message))]),
                ]),
              ]
            ),
            e._v(" "),
            e.bookings && !e.dialogLoading
              ? n(
                  "div",
                  { staticClass: "am-dialog-scrollable" },
                  [
                    e.showHeader
                      ? n(
                          "div",
                          {
                            staticClass: "am-dialog-header",
                            staticStyle: { "border-bottom": "none" },
                          },
                          [
                            n(
                              "el-row",
                              [
                                n("el-col", { attrs: { span: 18 } }, [
                                  n("h2", [
                                    e._v(e._s(e.$root.labels.event_attendees)),
                                  ]),
                                ]),
                                e._v(" "),
                                n(
                                  "el-col",
                                  {
                                    staticClass: "align-right",
                                    attrs: { span: 6 },
                                  },
                                  [
                                    n("el-button", {
                                      staticClass: "am-dialog-close",
                                      attrs: {
                                        size: "small",
                                        icon: "el-icon-close",
                                      },
                                      on: { click: e.closeDialog },
                                    }),
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
                    e.writeEvents
                      ? n(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            staticStyle: { width: "100%" },
                            attrs: { size: "large", type: "primary" },
                            on: { click: e.addAttendee },
                          },
                          [
                            n("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            n("span", { staticClass: "button-text" }, [
                              e._v(e._s(e.$root.labels.event_add_attendee)),
                            ]),
                          ]
                        )
                      : e._e(),
                    e._v(" "),
                    n(
                      "div",
                      { staticClass: "am-search" },
                      [
                        n(
                          "el-row",
                          { attrs: { gutter: 10 } },
                          [
                            n(
                              "el-col",
                              { attrs: { lg: e.showExport ? 20 : 24 } },
                              [
                                n("el-input", {
                                  attrs: {
                                    placeholder:
                                      e.$root.labels.event_attendees_search,
                                  },
                                  on: {
                                    input: function (t) {
                                      return e.searchAttendees();
                                    },
                                  },
                                  model: {
                                    value: e.search,
                                    callback: function (t) {
                                      e.search = t;
                                    },
                                    expression: "search",
                                  },
                                }),
                              ],
                              1
                            ),
                            e._v(" "),
                            e.showExport
                              ? n(
                                  "el-col",
                                  { attrs: { lg: 4 } },
                                  [
                                    n(
                                      "el-tooltip",
                                      { attrs: { placement: "top" } },
                                      [
                                        n("div", {
                                          attrs: { slot: "content" },
                                          domProps: {
                                            innerHTML: e._s(
                                              e.$root.labels
                                                .export_tooltip_attendees
                                            ),
                                          },
                                          slot: "content",
                                        }),
                                        e._v(" "),
                                        n(
                                          "el-button",
                                          {
                                            staticClass:
                                              "button-export am-button-icon",
                                            on: {
                                              click:
                                                e.openExportAttendeesDialog,
                                            },
                                          },
                                          [
                                            n("img", {
                                              staticClass: "svg",
                                              attrs: {
                                                alt: e.$root.labels.export,
                                                src:
                                                  e.$root.getUrl +
                                                  "public/img/export.svg",
                                              },
                                            }),
                                          ]
                                        ),
                                      ],
                                      1
                                    ),
                                  ],
                                  1
                                )
                              : e._e(),
                          ],
                          1
                        ),
                      ],
                      1
                    ),
                    e._v(" "),
                    0 === e.bookings.length
                      ? n("div", { staticClass: "am-empty-state am-section" }, [
                          n("img", {
                            attrs: {
                              src: e.$root.getUrl + "public/img/emptystate.svg",
                            },
                          }),
                          e._v(" "),
                          n("h2", [
                            e._v(e._s(e.$root.labels.no_attendees_yet)),
                          ]),
                        ])
                      : e._e(),
                    e._v(" "),
                    n(
                      "div",
                      {
                        directives: [
                          {
                            name: "show",
                            rawName: "v-show",
                            value: !e.hasResult && e.bookings.length > 0,
                            expression: "!hasResult && bookings.length > 0",
                          },
                        ],
                        staticClass: "am-empty-state am-section",
                      },
                      [
                        n("img", {
                          attrs: {
                            src: e.$root.getUrl + "public/img/emptystate.svg",
                          },
                        }),
                        e._v(" "),
                        n("h2", [e._v(e._s(e.$root.labels.no_results))]),
                      ]
                    ),
                    e._v(" "),
                    n(
                      "div",
                      { staticClass: "am-attendees" },
                      [
                        n(
                          "el-collapse",
                          e._l(e.bookings, function (t, o) {
                            return n(
                              "el-collapse-item",
                              {
                                directives: [
                                  {
                                    name: "show",
                                    rawName: "v-show",
                                    value: t.show,
                                    expression: "booking.show",
                                  },
                                ],
                                key: o,
                                staticClass: "am-attendee",
                                attrs: { name: t.id },
                              },
                              [
                                n("template", { slot: "title" }, [
                                  n(
                                    "div",
                                    {
                                      staticClass: "am-attendee-data",
                                      staticStyle: { width: "100%" },
                                    },
                                    [
                                      n(
                                        "el-row",
                                        { attrs: { gutter: 10 } },
                                        [
                                          !0 ===
                                          e.$root.settings.capabilities
                                            .canDelete
                                            ? n(
                                                "el-col",
                                                { attrs: { sm: 2 } },
                                                [
                                                  n(
                                                    "span",
                                                    {
                                                      staticClass:
                                                        "am-attendee-checkbox",
                                                      on: {
                                                        click: function (e) {
                                                          e.stopPropagation();
                                                        },
                                                      },
                                                    },
                                                    [
                                                      !0 ===
                                                      e.$root.settings
                                                        .capabilities.canDelete
                                                        ? n("el-checkbox", {
                                                            model: {
                                                              value: t.checked,
                                                              callback:
                                                                function (n) {
                                                                  e.$set(
                                                                    t,
                                                                    "checked",
                                                                    n
                                                                  );
                                                                },
                                                              expression:
                                                                "booking.checked",
                                                            },
                                                          })
                                                        : e._e(),
                                                    ],
                                                    1
                                                  ),
                                                ]
                                              )
                                            : e._e(),
                                          e._v(" "),
                                          n(
                                            "el-col",
                                            {
                                              attrs: {
                                                sm:
                                                  !0 ===
                                                  e.$root.settings.capabilities
                                                    .canDelete
                                                    ? 17
                                                    : 19,
                                              },
                                            },
                                            [
                                              n(
                                                "div",
                                                {
                                                  staticClass:
                                                    "am-attendee-name",
                                                },
                                                [
                                                  n("h3", [
                                                    e._v(
                                                      "\n                      " +
                                                        e._s(
                                                          (null !==
                                                          (e.user =
                                                            e.getCustomer(t))
                                                            ? e.user.firstName +
                                                              " " +
                                                              e.user.lastName
                                                            : "") +
                                                            (t.token
                                                              ? " (" +
                                                                t.token.substring(
                                                                  0,
                                                                  5
                                                                ) +
                                                                ")"
                                                              : "")
                                                        ) +
                                                        "\n                      "
                                                    ),
                                                    t.persons > 1
                                                      ? n(
                                                          "span",
                                                          {
                                                            staticClass:
                                                              "am-attendees-plus",
                                                          },
                                                          [
                                                            e._v(
                                                              "+" +
                                                                e._s(
                                                                  t.persons - 1
                                                                )
                                                            ),
                                                          ]
                                                        )
                                                      : e._e(),
                                                  ]),
                                                  e._v(" "),
                                                  n(
                                                    "span",
                                                    {
                                                      staticClass:
                                                        "am-attendee-email",
                                                    },
                                                    [
                                                      e._v(
                                                        e._s(t.customer.email)
                                                      ),
                                                    ]
                                                  ),
                                                  e._v(" "),
                                                  n(
                                                    "span",
                                                    {
                                                      staticClass:
                                                        "am-attendee-phone",
                                                    },
                                                    [
                                                      e._v(
                                                        e._s(
                                                          null !==
                                                            (e.user =
                                                              e.getCustomer(t))
                                                            ? e.user.phone
                                                            : ""
                                                        )
                                                      ),
                                                    ]
                                                  ),
                                                ]
                                              ),
                                            ]
                                          ),
                                          e._v(" "),
                                          n("el-col", { attrs: { sm: 5 } }, [
                                            n(
                                              "div",
                                              {
                                                staticClass:
                                                  "am-appointment-status small",
                                              },
                                              [
                                                n("span", {
                                                  staticClass:
                                                    "am-appointment-status-symbol",
                                                  class:
                                                    "rejected" === t.status
                                                      ? "canceled"
                                                      : t.status,
                                                }),
                                                e._v(" "),
                                                n(
                                                  "el-select",
                                                  {
                                                    attrs: {
                                                      "popper-append-to-body":
                                                        e.popperAppendToBody,
                                                      disabled: !e.writeEvents,
                                                    },
                                                    on: {
                                                      change: function (n) {
                                                        return e.updateBookingStatus(
                                                          t
                                                        );
                                                      },
                                                    },
                                                    model: {
                                                      value: t.status,
                                                      callback: function (n) {
                                                        e.$set(t, "status", n);
                                                      },
                                                      expression:
                                                        "booking.status",
                                                    },
                                                  },
                                                  e._l(
                                                    e.statuses,
                                                    function (e) {
                                                      return n(
                                                        "el-option",
                                                        {
                                                          key: e.value,
                                                          attrs: {
                                                            value: e.value,
                                                          },
                                                        },
                                                        [
                                                          n("span", {
                                                            staticClass:
                                                              "am-appointment-status-symbol",
                                                            class:
                                                              "rejected" ===
                                                              e.value
                                                                ? "canceled"
                                                                : e.value,
                                                          }),
                                                        ]
                                                      );
                                                    }
                                                  ),
                                                  1
                                                ),
                                              ],
                                              1
                                            ),
                                          ]),
                                        ],
                                        1
                                      ),
                                    ],
                                    1
                                  ),
                                ]),
                                e._v(" "),
                                n(
                                  "div",
                                  { staticClass: "am-attendee-collapse" },
                                  [
                                    t.payments.length
                                      ? n(
                                          "el-row",
                                          { attrs: { gutter: 10 } },
                                          [
                                            n(
                                              "el-col",
                                              { attrs: { span: 6 } },
                                              [
                                                n("span", [
                                                  e._v(
                                                    e._s(e.$root.labels.payment)
                                                  ),
                                                ]),
                                              ]
                                            ),
                                            e._v(" "),
                                            t.payments.length
                                              ? n(
                                                  "el-col",
                                                  { attrs: { span: 18 } },
                                                  [
                                                    n("p", [
                                                      n("img", {
                                                        staticClass: "svg",
                                                        attrs: {
                                                          width: "18px",
                                                          src:
                                                            e.$root.getUrl +
                                                            "public/img/payments/" +
                                                            t.payments[0]
                                                              .gateway +
                                                            ".svg",
                                                        },
                                                      }),
                                                      e._v(
                                                        "\n                  " +
                                                          e._s(
                                                            e.getPaymentGatewayNiceName(
                                                              t.payments[0]
                                                                .gateway
                                                            )
                                                          ) +
                                                          "\n                "
                                                      ),
                                                    ]),
                                                  ]
                                                )
                                              : e._e(),
                                          ],
                                          1
                                        )
                                      : e._e(),
                                    e._v(" "),
                                    n(
                                      "el-row",
                                      { attrs: { gutter: 10 } },
                                      [
                                        n("el-col", { attrs: { span: 12 } }, [
                                          n(
                                            "div",
                                            {},
                                            [
                                              n(
                                                "el-button",
                                                {
                                                  attrs: {
                                                    loading: t.removing,
                                                  },
                                                  on: {
                                                    click: function (t) {
                                                      return e.removeAttendee(
                                                        o
                                                      );
                                                    },
                                                  },
                                                },
                                                [
                                                  e._v(
                                                    "\n                    " +
                                                      e._s(
                                                        e.$root.labels
                                                          .event_attendee_remove
                                                      ) +
                                                      "\n                  "
                                                  ),
                                                ]
                                              ),
                                            ],
                                            1
                                          ),
                                        ]),
                                        e._v(" "),
                                        n("el-col", { attrs: { span: 12 } }, [
                                          n(
                                            "div",
                                            {},
                                            [
                                              e.writeEvents
                                                ? n(
                                                    "el-button",
                                                    {
                                                      on: {
                                                        click: function (t) {
                                                          return e.editAttendee(
                                                            o
                                                          );
                                                        },
                                                      },
                                                    },
                                                    [
                                                      e._v(
                                                        "\n                    " +
                                                          e._s(
                                                            e.$root.labels
                                                              .event_edit_attendee
                                                          ) +
                                                          "\n                  "
                                                      ),
                                                    ]
                                                  )
                                                : e._e(),
                                            ],
                                            1
                                          ),
                                        ]),
                                      ],
                                      1
                                    ),
                                  ],
                                  1
                                ),
                              ],
                              2
                            );
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
            n("transition", { attrs: { name: "slide-vertical" } }, [
              n(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value:
                        !e.dialogLoading &&
                        e.bookings.length > 0 &&
                        e.bookings.filter(function (e) {
                          return e.checked;
                        }).length > 0,
                      expression:
                        "!dialogLoading && bookings.length > 0 && bookings.filter(booking => booking.checked).length > 0",
                    },
                  ],
                },
                [
                  n("div", { staticClass: "am-dialog-footer" }, [
                    n(
                      "div",
                      { staticClass: "am-dialog-footer-actions" },
                      [
                        n(
                          "el-row",
                          [
                            n(
                              "el-col",
                              { staticClass: "align-left", attrs: { sm: 12 } },
                              [
                                n(
                                  "el-button",
                                  {
                                    staticClass: "am-button-icon",
                                    on: {
                                      click: function (t) {
                                        e.showDeleteConfirmation =
                                          !e.showDeleteConfirmation;
                                      },
                                    },
                                  },
                                  [
                                    n("img", {
                                      staticClass: "svg",
                                      attrs: {
                                        alt: e.$root.labels.delete,
                                        src:
                                          e.$root.getUrl +
                                          "public/img/delete.svg",
                                      },
                                    }),
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
                  ]),
                ]
              ),
            ]),
            e._v(" "),
            n("transition", { attrs: { name: "slide-vertical" } }, [
              n(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: !e.dialogLoading && e.showDeleteConfirmation,
                      expression: "!dialogLoading && showDeleteConfirmation",
                    },
                  ],
                  staticClass: "am-dialog-confirmation",
                },
                [
                  n("h3", [
                    e._v(
                      e._s(
                        e.bookings.filter(function (e) {
                          return e.checked;
                        }).length > 1
                          ? e.$root.labels.confirm_delete_attendees
                          : e.$root.labels.confirm_delete_attendee
                      )
                    ),
                  ]),
                  e._v(" "),
                  n(
                    "div",
                    { staticClass: "align-left" },
                    [
                      n(
                        "el-button",
                        {
                          attrs: { size: "small" },
                          on: {
                            click: function (t) {
                              e.showDeleteConfirmation =
                                !e.showDeleteConfirmation;
                            },
                          },
                        },
                        [
                          e._v(
                            "\n          " +
                              e._s(e.$root.labels.cancel) +
                              "\n        "
                          ),
                        ]
                      ),
                      e._v(" "),
                      n(
                        "el-button",
                        {
                          attrs: { size: "small", type: "primary" },
                          on: { click: e.removeAttendees },
                        },
                        [
                          e._v(
                            "\n          " +
                              e._s(e.$root.labels.delete) +
                              "\n        "
                          ),
                        ]
                      ),
                    ],
                    1
                  ),
                ]
              ),
            ]),
          ],
          1
        );
      },
      staticRenderFns: [],
    };
  },
  941: function (e, t, n) {
    var o = n(685)(n(942), n(943), !1, null, null, null);
    e.exports = o.exports;
  },
  942: function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var o = n(713),
      i = n.n(o),
      a = n(687),
      s = n(337),
      r = n(691),
      l = n(690),
      c = n(789),
      u = n(689),
      d = n(823),
      m = n.n(d),
      p = n(694),
      h = n(743);
    t.default = {
      mixins: [l.a, a.a, s.a, r.a, u.a, p.a, c.a, h.a],
      props: {
        eventBooking: null,
        eventId: null,
        eventMaxCapacity: null,
        eventCustomerIds: null,
        eventBookMultipleTimes: { required: !1, default: !0, type: Boolean },
        options: null,
        customerCreatedCount: 0,
        showHeader: { required: !1, default: !0, type: Boolean },
        isCabinet: { type: Boolean, default: !1, required: !1 },
      },
      data: function () {
        return {
          showCoupon: !1,
          customers: [],
          appointment: null,
          dialogLoading: !0,
          executeUpdate: !0,
          mounted: !1,
          statusMessage: "",
          rules: { bookings: [] },
        };
      },
      mounted: function () {
        (this.appointment = { bookings: [this.eventBooking] }),
          this.instantiateDialog(),
          this.setBookingCustomFields(),
          this.addCustomFieldsValidationRules();
      },
      updated: function () {
        this.instantiateDialog();
      },
      methods: {
        customersFetched: function () {
          this.customers = this.searchedCustomers;
        },
        searchExistingCustomers: function (e) {
          e
            ? this.searchCustomers(e, this.customersFetched)
            : (this.customers = this.options.entities.customers);
        },
        showDialogNewCustomer: function () {
          this.$emit("showDialogNewCustomer");
        },
        instantiateDialog: function () {
          var e = this;
          null !== this.eventBooking &&
            !0 === this.executeUpdate &&
            ((this.mounted = !0),
            (this.executeUpdate = !1),
            (this.dialogLoading = !1),
            0 !== parseInt(this.eventBooking.id)
              ? (this.customers = this.options.entities.customers)
              : ((this.showCoupon = !0),
                this.eventBookMultipleTimes
                  ? (this.customers = this.options.entities.customers)
                  : (this.customers = this.options.entities.customers.filter(
                      function (t) {
                        return -1 === e.eventCustomerIds.indexOf(t.id);
                      }
                    ))));
        },
        closeDialog: function () {
          this.$emit("closeDialog");
        },
        getParsedEntity: function () {
          var e = this;
          for (var t in this.eventBooking.customFields)
            "datepicker" === this.eventBooking.customFields[t].type &&
              this.eventBooking.customFields[t].value &&
              (this.eventBooking.customFields[t].value = this.getStringFromDate(
                this.eventBooking.customFields[t].value
              ));
          var n = this.showCoupon
              ? this.eventBooking.coupon
              : this.eventBooking.coupon
              ? this.eventBooking.coupon.id
              : null,
            o = this.options.entities.coupons
              ? this.options.entities.coupons.find(function (e) {
                  return e.id === n;
                })
              : null;
          return {
            type: "event",
            eventId: this.eventId,
            bookings: [
              {
                customFields: this.eventBooking.customFields,
                persons: this.eventBooking.persons,
                customerId: this.eventBooking.customerId,
                customer: this.customers.find(function (t) {
                  return t.id === e.eventBooking.customerId;
                }),
                coupon: o,
                deposit: 0,
              },
            ],
            couponCode: o ? o.code : null,
            validateCoupon: !1,
            locale: "",
            timeZone: "",
            payment: { gateway: "onSite" },
          };
        },
        clearValidation: function () {
          void 0 !== this.$refs.eventBooking &&
            this.$refs.eventBooking.clearValidate();
        },
        errorCallback: function (e) {
          var t = this;
          setTimeout(function () {
            "timeSlotUnavailable" in e.data &&
              !0 === e.data.timeSlotUnavailable &&
              t.notify(
                t.$root.labels.error,
                t.$root.labels.maximum_capacity_reached,
                "error"
              );
          }, 200);
        },
        addCustomFieldsValidationRules: function () {
          for (var e = 0; e < this.options.entities.customFields.length; e++)
            this.isCustomFieldVisible(
              this.options.entities.customFields[e],
              "event",
              this.eventId
            ) &&
              (void 0 === this.rules.bookings[0] &&
                this.$set(this.rules.bookings, 0, { type: "array" }),
              void 0 === this.rules.bookings[0].customFields &&
                this.$set(this.rules.bookings[0], "customFields", {}),
              (this.rules.bookings[0].customFields[
                this.options.entities.customFields[e].id
              ] = {
                value: [
                  {
                    required: !0,
                    message: this.$root.labels.required_field,
                    trigger: "submit",
                  },
                ],
              }));
        },
        showCustomFieldsTab: function () {
          var e = Array.prototype.concat.apply(
            [],
            this.options.entities.customFields.map(function (e) {
              return e.events.map(function (e) {
                return e.id;
              });
            })
          );
          return (
            this.options.entities.customFields.length > 0 &&
            null !== this.booking &&
            this.eventId &&
            e.includes(this.eventId)
          );
        },
        validationBookingsFailCallback: function () {},
      },
      watch: {
        customerCreatedCount: function () {
          (this.customers = this.options.entities.customers),
            (this.eventBooking.customerId =
              this.customers[this.customers.length - 1].id),
            this.customers.sort(function (e, t) {
              return (e.firstName + " " + e.lastName).localeCompare(
                t.firstName + " " + t.lastName
              );
            });
        },
      },
      components: { DialogCustomFields: m.a, DialogActions: i.a },
    };
  },
  943: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          n = e._self._c || t;
        return n(
          "div",
          { staticClass: "am-dialog-attendees-inner" },
          [
            n(
              "div",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: e.dialogLoading,
                    expression: "dialogLoading",
                  },
                ],
                staticClass: "am-dialog-loader",
              },
              [
                n("div", { staticClass: "am-dialog-loader-content" }, [
                  n("img", {
                    attrs: { src: e.$root.getUrl + "public/img/spinner.svg" },
                  }),
                  e._v(" "),
                  n("p", [e._v(e._s(e.$root.labels.loader_message))]),
                ]),
              ]
            ),
            e._v(" "),
            e.eventBooking && !e.dialogLoading
              ? n(
                  "div",
                  {
                    staticClass: "am-dialog-scrollable",
                    class: { "am-edit": 0 !== e.eventBooking.id },
                    staticStyle: { "overflow-x": "hidden" },
                  },
                  [
                    e.showHeader
                      ? n(
                          "div",
                          { staticClass: "am-dialog-header" },
                          [
                            n(
                              "el-row",
                              [
                                n("el-col", { attrs: { span: 18 } }, [
                                  e.eventBooking.customer
                                    ? n("h2", [
                                        e._v(
                                          e._s(
                                            e.$root.labels.event_edit_attendee
                                          )
                                        ),
                                      ])
                                    : e._e(),
                                  e._v(" "),
                                  e.eventBooking.customer
                                    ? e._e()
                                    : n("h2", [
                                        e._v(
                                          e._s(
                                            e.$root.labels.event_add_attendee
                                          )
                                        ),
                                      ]),
                                ]),
                                e._v(" "),
                                n(
                                  "el-col",
                                  {
                                    staticClass: "align-right",
                                    attrs: { span: 6 },
                                  },
                                  [
                                    n("el-button", {
                                      staticClass: "am-dialog-close",
                                      attrs: {
                                        size: "small",
                                        icon: "el-icon-close",
                                      },
                                      on: { click: e.closeDialog },
                                    }),
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
                    e.mounted
                      ? n(
                          "el-form",
                          {
                            ref: "appointment",
                            attrs: {
                              model: { bookings: [e.eventBooking] },
                              rules: e.rules,
                              "label-position": "top",
                            },
                          },
                          [
                            n(
                              "el-form-item",
                              {
                                attrs: {
                                  label: e.$root.labels.customer + ":",
                                  prop: "bookings",
                                },
                              },
                              [
                                n(
                                  "el-select",
                                  {
                                    attrs: {
                                      remote: "",
                                      "remote-method":
                                        e.searchExistingCustomers,
                                      filterable: "",
                                      clearable: "",
                                      disabled: !1 !== e.eventBooking.added,
                                      placeholder: e.$root.labels.customer,
                                      loading: e.loadingCustomers,
                                    },
                                    model: {
                                      value: e.eventBooking.customerId,
                                      callback: function (t) {
                                        e.$set(e.eventBooking, "customerId", t);
                                      },
                                      expression: "eventBooking.customerId",
                                    },
                                  },
                                  [
                                    n(
                                      "div",
                                      { staticClass: "am-drop" },
                                      [
                                        this.$root.settings
                                          .additionalCapabilities
                                          .canWriteCustomers
                                          ? n(
                                              "div",
                                              {
                                                staticClass:
                                                  "am-drop-create-item",
                                                on: {
                                                  click:
                                                    e.showDialogNewCustomer,
                                                },
                                              },
                                              [
                                                e._v(
                                                  "\n              " +
                                                    e._s(
                                                      e.$root.labels.create_new
                                                    ) +
                                                    "\n            "
                                                ),
                                              ]
                                            )
                                          : e._e(),
                                        e._v(" "),
                                        e._l(e.customers, function (t) {
                                          return n(
                                            "el-option",
                                            {
                                              key: t.id,
                                              staticClass: "am-has-option-meta",
                                              attrs: {
                                                label:
                                                  t.firstName +
                                                  " " +
                                                  t.lastName,
                                                value: t.id,
                                              },
                                            },
                                            [
                                              n(
                                                "span",
                                                {
                                                  class: {
                                                    "am-drop-item-name":
                                                      t.email,
                                                  },
                                                },
                                                [
                                                  e._v(
                                                    e._s(t.firstName) +
                                                      " " +
                                                      e._s(t.lastName)
                                                  ),
                                                ]
                                              ),
                                              e._v(" "),
                                              t.email
                                                ? n(
                                                    "span",
                                                    {
                                                      staticClass:
                                                        "am-drop-item-meta",
                                                    },
                                                    [e._v(e._s(t.email))]
                                                  )
                                                : e._e(),
                                            ]
                                          );
                                        }),
                                        e._v(" "),
                                        e._l(
                                          [
                                            {
                                              customer: {
                                                id: 0,
                                                firstName: "",
                                                lastName: "",
                                                email: "",
                                                info: JSON.stringify({
                                                  firstName: "",
                                                  lastName: "",
                                                  email: "",
                                                  phone: "",
                                                }),
                                              },
                                            },
                                          ],
                                          function (t) {
                                            return 0 === e.customers.length
                                              ? n("el-option", {
                                                  key: t.customer.id,
                                                  staticClass:
                                                    "am-has-option-meta",
                                                  style: { display: "none" },
                                                  attrs: {
                                                    label:
                                                      t.firstName +
                                                      " " +
                                                      t.lastName,
                                                    value: t,
                                                  },
                                                })
                                              : e._e();
                                          }
                                        ),
                                      ],
                                      2
                                    ),
                                  ]
                                ),
                              ],
                              1
                            ),
                            e._v(" "),
                            n(
                              "el-form-item",
                              {
                                attrs: {
                                  label:
                                    e.$root.labels.event_book_persons + ":",
                                },
                              },
                              [
                                n("el-input-number", {
                                  attrs: { min: 1 },
                                  model: {
                                    value: e.eventBooking.persons,
                                    callback: function (t) {
                                      e.$set(e.eventBooking, "persons", t);
                                    },
                                    expression: "eventBooking.persons",
                                  },
                                }),
                              ],
                              1
                            ),
                            e._v(" "),
                            e.couponsFilteredEvent.length > 0 &&
                            e.showCoupon &&
                            ("admin" === e.$root.settings.role ||
                              "manager" === e.$root.settings.role)
                              ? n(
                                  "el-form-item",
                                  { attrs: { label: e.$root.labels.coupon } },
                                  [
                                    n(
                                      "el-select",
                                      {
                                        attrs: {
                                          filterable: "",
                                          clearable: "",
                                          placeholder:
                                            e.$root.labels.select_coupon,
                                          disabled:
                                            "customer" ===
                                            e.$root.settings.role,
                                        },
                                        model: {
                                          value: e.eventBooking.coupon,
                                          callback: function (t) {
                                            e.$set(e.eventBooking, "coupon", t);
                                          },
                                          expression: "eventBooking.coupon",
                                        },
                                      },
                                      e._l(
                                        e.couponsFilteredEvent,
                                        function (e) {
                                          return n("el-option", {
                                            key: e.id,
                                            attrs: {
                                              disabled: e.disabled,
                                              label: e.code,
                                              value: e.id,
                                            },
                                          });
                                        }
                                      ),
                                      1
                                    ),
                                    e._v(" "),
                                    n("img", {
                                      staticClass: "svg is-spinner",
                                      attrs: {
                                        src:
                                          e.$root.getUrl +
                                          "public/img/oval-spinner.svg",
                                      },
                                    }),
                                  ],
                                  1
                                )
                              : e._e(),
                            e._v(" "),
                            n("dialog-custom-fields", {
                              attrs: {
                                appointment: { bookings: [e.eventBooking] },
                                entityId: e.eventId,
                                entityType: "event",
                                customFields: e.options.entities.customFields,
                                "is-cabinet": e.isCabinet,
                                showCustomerInfo: !1,
                              },
                              on: { clearValidation: e.clearValidation },
                            }),
                          ],
                          1
                        )
                      : e._e(),
                  ],
                  1
                )
              : e._e(),
            e._v(" "),
            e.eventBooking && !e.dialogLoading
              ? n("dialog-actions", {
                  attrs: {
                    formName: "appointment",
                    urlName:
                      0 !== e.eventBooking.id ? "events/bookings" : "bookings",
                    isNew: 0 === e.eventBooking.id,
                    entity: e.eventBooking,
                    getParsedEntity: e.getParsedEntity,
                    hasIcons: !0,
                    status: { on: "visible", off: "hidden" },
                    action: {
                      haveAdd: !0,
                      haveEdit: !0,
                      haveStatus: !1,
                      haveRemove: !1,
                      haveRemoveEffect: !1,
                      haveDuplicate: !1,
                    },
                    message: {
                      success: {
                        save: e.$root.labels.event_attendee_saved,
                        remove: "",
                        show: "",
                        hide: "",
                      },
                      confirm: {
                        remove: "",
                        show: "",
                        hide: "",
                        duplicate: "",
                      },
                    },
                  },
                  on: {
                    errorCallback: e.errorCallback,
                    validationBookingsFailCallback:
                      e.validationBookingsFailCallback,
                  },
                })
              : e._e(),
            e._v(" "),
            n("div", [
              n(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: e.dialogLoading,
                      expression: "dialogLoading",
                    },
                  ],
                  staticClass: "am-dialog-loader",
                },
                [
                  n("div", { staticClass: "am-dialog-loader-content" }, [
                    n("img", {
                      attrs: { src: e.$root.getUrl + "public/img/spinner.svg" },
                    }),
                    e._v(" "),
                    n("p", [e._v(e._s(e.$root.labels.loader_message))]),
                  ]),
                ]
              ),
            ]),
          ],
          1
        );
      },
      staticRenderFns: [],
    };
  },
});
