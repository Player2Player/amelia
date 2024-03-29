wpJsonpAmeliaBookingPlugin([11], {
  1009: function (e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = i(933),
      o = i.n(a),
      n = i(886),
      s = i(789),
      r = i(743),
      l = i(337),
      c = i(887),
      u = i.n(c),
      m = i(826),
      d = i.n(m),
      p = i(829),
      f = i.n(p),
      h = i(893),
      g = i.n(h),
      v = i(692),
      b = i(690),
      y = i(702),
      C = i.n(y),
      k = i(686),
      D = i(687),
      x = i(0),
      S = i.n(x),
      w = i(691),
      $ = i(717),
      F = i.n($),
      T = i(757),
      I = i(689),
      E = i(694),
      P = i(790),
      A = i.n(P);
    t.default = {
      mixins: [E.a, T.a, b.a, n.a, D.a, l.a, v.a, w.a, r.a, I.a, k.a, s.a],
      data: function () {
        return {
          showDeleteButton: !0,
          totalPeriodAppointments: 0,
          paginationParams: {
            page: 1,
            show: this.$root.settings.general.appointmentsPerPage,
          },
          updateStatusDisabled: !1,
          allAppointmentsChecked: !1,
          allDateAppointmentsChecked: {},
          appointment: null,
          appointmentsDay: [],
          appointmentStatusCount: { total: 0, approved: 0, pending: 0 },
          customer: null,
          deleteAppointmentGroupLoading: !1,
          dialogAppointment: !1,
          dialogPayment: !1,
          dialogExport: !1,
          fetched: !1,
          fetchedFiltered: !1,
          filterFields: !0,
          form: new C.a(),
          params: {
            dates: this.getDatePickerInitRange(),
            providers: [],
            search: "",
            status: "",
            services: [],
            customerId: "",
            locationId: "",
          },
          selectedPaymentModalData: {
            paymentId: null,
            bookingStart: null,
            bookings: null,
            service: null,
            providers: null,
            customer: null,
          },
          showDeleteConfirmation: !1,
          timer: null,
          toaster: !1,
          updateBookingStatusId: 0,
          updateBookingStatusLoading: !1,
          count: { success: 0, error: 0 },
        };
      },
      created: function () {
        var e = this.getUrlQueryParams(window.location.href);
        (this.params.dates =
          "dateFrom" in e && "dateTo" in e
            ? { start: S()(e.dateFrom).toDate(), end: S()(e.dateTo).toDate() }
            : this.getDatePickerInitRange()),
          e.status && (this.params.status = e.status),
          e.bookingId && (this.params.bookingId = e.bookingId),
          this.getAppointmentOptions(!0);
      },
      mounted: function () {},
      updated: function () {
        this.fetched && this.inlineSVG();
      },
      methods: {
        switchShowDeleteConfirmation: function (e) {
          (this.showDeleteConfirmation = e), (this.showDeleteButton = !e);
        },
        getCapacity: function (e) {
          var t = this.getProviderById(e.providerId).serviceList.find(function (
              t
            ) {
              return t.id === e.serviceId;
            }),
            i = 0;
          return (
            e.bookings.forEach(function (e) {
              i += e.persons;
            }),
            t ? i + "/" + t.maxCapacity : ""
          );
        },
        saveAppointmentCallback: function () {
          this.getAppointmentOptions(!0);
        },
        confirmationText: function () {
          return this.checkedAppointmentsCount() < 2
            ? this.$root.labels.confirm_delete_appointment
            : this.$root.labels.confirm_delete_appointment_plural;
        },
        checkedAppointmentsCount: function () {
          var e = this,
            t = 0;
          return (
            Object.keys(this.appointmentsDay).forEach(function (i) {
              t += e.appointmentsDay[i].appointments.filter(function (e) {
                return e.checked;
              }).length;
            }),
            t
          );
        },
        deleteAppointmentGroup: function () {
          this.deleteAppointmentGroupLoading = !0;
          var e = this,
            t = [];
          Object.keys(this.appointmentsDay).forEach(function (i) {
            e.appointmentsDay[i].appointments.forEach(function (e) {
              e.checked && t.push(e.id);
            });
          }),
            Object.keys(this.appointmentsDay).forEach(function (i) {
              e.appointmentsDay[i].appointments.forEach(function (i) {
                i.checked &&
                  e.form
                    .post(e.$root.getAjaxUrl + "/appointments/delete/" + i.id)
                    .then(function () {
                      e.deleteAppointmentGroupCallback(t, !0);
                    })
                    .catch(function () {
                      e.deleteAppointmentGroupCallback(t, !1);
                    });
              });
            });
        },
        deleteAppointmentGroupCallback: function (e, t) {
          if (
            (e.pop(),
            t ? this.count.success++ : this.count.error++,
            0 === e.length)
          ) {
            this.count.success &&
              this.notify(
                this.$root.labels.success,
                this.count.success +
                  " " +
                  (this.count.success > 1
                    ? this.$root.labels.appointments_deleted
                    : this.$root.labels.appointment_deleted),
                "success"
              ),
              this.count.error &&
                this.notify(
                  this.$root.labels.error,
                  this.count.error +
                    " " +
                    (this.count.error > 1
                      ? this.$root.labels.appointments_not_deleted
                      : this.$root.labels.appointment_not_deleted),
                  "error"
                ),
              (this.count.success = 0),
              (this.count.error = 0);
            var i = this;
            this.getAppointmentOptions(!0),
              Object.keys(this.appointmentsDay).forEach(function (e) {
                i.allDateAppointmentsChecked[e] = !1;
              }),
              (this.allAppointmentsChecked = !1),
              (this.toaster = !1),
              (this.deleteAppointmentGroupLoading = !1),
              (this.showDeleteConfirmation = !1),
              (this.showDeleteButton = !0);
          }
        },
        updateBookingStatus: function (e, t) {
          var i = this;
          (this.updateBookingStatusLoading = !0),
            (this.updateBookingStatusId = e.bookings[0].id),
            this.form
              .post(
                this.$root.getAjaxUrl + "/bookings/cancel/" + e.bookings[0].id
              )
              .then(function (a) {
                (i.updateBookingStatusLoading = !1),
                  (i.updateBookingStatusId = 0),
                  i.setTotalStatusCounts(e, t, a.data.status),
                  i.notify(i.$root.labels.success, a.data.message, "success"),
                  (e.status = a.data.status);
              })
              .catch(function (e) {
                "cancelBookingUnavailable" in e.response.data.data &&
                  !0 === e.response.data.data.cancelBookingUnavailable &&
                  i.notify(
                    i.$root.labels.error,
                    i.$root.labels.booking_cancel_exception,
                    "error"
                  ),
                  (i.updateBookingStatusLoading = !0),
                  (i.updateBookingStatusId = 0),
                  (i.errorMessage = e.message);
              });
        },
        setTotalStatusCounts: function (e, t, i) {
          var a = 0,
            o = this;
          if (
            (Object.keys(this.appointmentsDay).forEach(function (e) {
              o.appointmentsDay[e].appointments.forEach(function (e) {
                a++;
              });
            }),
            e.bookings.forEach(function (e) {
              e.status = i;
            }),
            t === i)
          )
            switch (t) {
              case "approved":
                this.appointmentStatusCount.approved < a &&
                  this.appointmentStatusCount.approved++,
                  this.appointmentStatusCount.pending > 0 &&
                    this.appointmentStatusCount.pending--;
                break;
              case "pending":
                this.appointmentStatusCount.pending < a &&
                  this.appointmentStatusCount.pending++,
                  this.appointmentStatusCount.approved > 0 &&
                    this.appointmentStatusCount.approved--;
            }
        },
        getAppointmentOptions: function (e) {
          var t = this;
          (this.options.fetched = !1),
            this.setInitialCustomers(),
            this.fetchEntities(
              function (i) {
                i && e && t.getAppointments(),
                  (t.fetched = !0),
                  (t.options.fetched = !0);
              },
              {
                types: [
                  "locations",
                  "employees",
                  "categories",
                  "custom_fields",
                  "packages",
                  "coupons",
                ],
                isFrontEnd: !1,
                isPanel: !1,
              }
            );
        },
        getAppointments: function () {
          var e = this;
          this.fetchedFiltered = !1;
          var t = JSON.parse(JSON.stringify(this.params)),
            i = [];
          t.dates &&
            (t.dates.start && i.push(S()(t.dates.start).format("YYYY-MM-DD")),
            t.dates.end && i.push(S()(t.dates.end).format("YYYY-MM-DD")),
            (t.dates = i)),
            (t.page = this.paginationParams.page),
            (t.skipServices = 1),
            (t.skipProviders = 1),
            Object.keys(t).forEach(function (e) {
              return !t[e] && 0 !== t[e] && delete t[e];
            }),
            this.$http
              .get(this.$root.getAjaxUrl + "/appointments", { params: t })
              .then(function (t) {
                (e.appointmentStatusCount.approved = t.data.data.totalApproved),
                  (e.appointmentStatusCount.pending = t.data.data.totalPending),
                  (e.totalPeriodAppointments = t.data.data.total);
                var i = e;
                e.toaster = !1;
                var a = {};
                if ("customer" === e.$root.settings.role)
                  Object.keys(t.data.data.appointments).forEach(function (e) {
                    t.data.data.appointments[e].appointments.forEach(function (
                      i
                    ) {
                      i.bookings.forEach(function (o) {
                        var n = JSON.parse(JSON.stringify(i));
                        (n.bookings = [o]),
                          e in a ||
                            ((a[e] = t.data.data.appointments[e]),
                            (a[e].appointments = [])),
                          a[e].appointments.push(n);
                      });
                    });
                  }),
                    Object.keys(a).forEach(function (e) {
                      a[e].appointments.forEach(function (e) {
                        "approved" === e.bookings[0].status &&
                          i.appointmentStatusCount.approved++,
                          "pending" === e.bookings[0].status &&
                            i.appointmentStatusCount.pending++;
                      });
                    });
                else {
                  a = t.data.data.appointments;
                  var o = e.options.entities.customers.map(function (e) {
                      return parseInt(e.id);
                    }),
                    n = e.options.entities.customers;
                  Object.keys(t.data.data.appointments).forEach(function (e) {
                    t.data.data.appointments[e].appointments.forEach(function (
                      e
                    ) {
                      (e.checked = !1),
                        e.bookings.forEach(function (e) {
                          -1 === o.indexOf(parseInt(e.customer.id)) &&
                            (o.push(e.customer.id), n.push(e.customer));
                        });
                    }),
                      (i.allDateAppointmentsChecked[e] = !1);
                  }),
                    (e.options.entities.customers = Object.values(
                      n.sort(function (e, t) {
                        return e.firstName.toLowerCase() >
                          t.firstName.toLowerCase()
                          ? 1
                          : -1;
                      })
                    ));
                }
                (e.appointmentsDay = 0 === Object.keys(a).length ? [] : a),
                  "customer" === i.$root.settings.role &&
                    setTimeout(function () {
                      for (
                        var e = document.getElementsByClassName(
                            "el-collapse-item__arrow"
                          ),
                          t = 0;
                        t < e.length;
                        t++
                      )
                        e[t].style.display = "none";
                    }, 200),
                  (e.fetched = !0),
                  (e.fetchedFiltered = !0);
              })
              .catch(function (t) {
                console.log(t.message),
                  (e.fetched = !0),
                  (e.fetchedFiltered = !0);
              });
        },
        changeRange: function () {
          this.setDatePickerSelectedDaysCount(
            this.params.dates.start,
            this.params.dates.end
          ),
            (this.paginationParams.page = 1),
            this.changeFilter();
        },
        changeFilter: function () {
          this.params.customerId || (this.searchedCustomers = []),
            this.getAppointments();
        },
        handleResize: function () {
          this.filterFields = window.innerWidth >= 992;
        },
        handleDateFormat: function (e) {
          return e === S()().format("YYYY-MM-DD")
            ? this.$root.labels.today
            : e === S()().add(1, "days").format("YYYY-MM-DD")
            ? this.$root.labels.tomorrow
            : this.getFrontedFormattedDate(e);
        },
        handleCheckAllAppointments: function () {
          var e = this;
          Object.keys(this.appointmentsDay).forEach(function (t) {
            e.appointmentsDay[t].appointments.forEach(function (i) {
              (i.checked = e.allAppointmentsChecked),
                (e.allDateAppointmentsChecked[t] = e.allAppointmentsChecked);
            });
          }),
            (this.toaster = e.allAppointmentsChecked);
        },
        handleCheckedDateAppointments: function (e) {
          var t = this,
            i = 0,
            a = 0,
            o = !1;
          Object.keys(this.appointmentsDay).forEach(function (n) {
            t.appointmentsDay[n].appointments.forEach(function (s) {
              n === e && ((s.checked = t.allDateAppointmentsChecked[e]), i++),
                s.checked && (o = !0),
                a++;
            });
          }),
            (this.allAppointmentsChecked = i === a),
            (this.toaster = o);
        },
        handleCheckedAppointment: function () {
          var e = this,
            t = 0,
            i = 0;
          Object.keys(this.appointmentsDay).forEach(function (a) {
            var o = 0;
            e.appointmentsDay[a].appointments.forEach(function (e) {
              e.checked && (o++, t++), i++;
            }),
              (e.allDateAppointmentsChecked[a] =
                o === e.appointmentsDay[a].appointments.length);
          }),
            (this.allAppointmentsChecked = t === i),
            (this.toaster = t > 0);
        },
        selectAllInCategory: function (e) {
          var t = this.getCategoryServices(e).map(function (e) {
            return e.id;
          });
          _.isEqual(_.intersection(t, this.params.services), t)
            ? (this.params.services = _.difference(this.params.services, t))
            : (this.params.services = _.uniq(this.params.services.concat(t))),
            this.getAppointments();
        },
        getBookingStatus: function (e, t) {
          return "customer" === this.$root.settings.role && "pending" !== e
            ? t
            : e;
        },
        showDialogNewCustomer: function () {
          (this.customer = this.getInitCustomerObject()),
            (this.dialogCustomer = !0);
        },
        canWriteAppointments: function () {
          return (
            !0 === this.$root.settings.capabilities.canWriteOthers ||
            ("provider" === this.$root.settings.role &&
              this.$root.settings.roles.allowWriteAppointments)
          );
        },
        openRecurringAppointment: function (e) {
          var t = this;
          (this.dialogAppointment = !1),
            setTimeout(function () {
              t.showDialogEditAppointment(e);
            }, 200);
        },
      },
      computed: {
        visibleEmployees: function () {
          return this.options.entities.employees.filter(function (e) {
            return "hidden" === e.status || "visible" === e.status;
          });
        },
        filterApplied: function () {
          return !!(
            this.params.search ||
            this.params.services.length ||
            this.params.providers.length ||
            this.params.customerId ||
            this.params.dates.start ||
            this.params.dates.end ||
            this.params.status
          );
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
        PaginationBlock: A.a,
        PageHeader: F.a,
        DialogAppointment: u.a,
        DialogCustomer: d.a,
        DialogPayment: g.a,
        DialogExport: f.a,
        AppointmentListCollapsed: o.a,
      },
    };
  },
  1010: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = this,
          i = t.$createElement,
          a = t._self._c || i;
        return a("div", { staticClass: "am-wrap" }, [
          a(
            "div",
            { staticClass: "am-body", attrs: { id: "am-appointments" } },
            [
              a("page-header", {
                attrs: {
                  appointmentsApproved: t.appointmentStatusCount.approved,
                  appointmentsPending: t.appointmentStatusCount.pending,
                },
                on: { newAppointmentBtnClicked: t.showDialogNewAppointment },
              }),
              t._v(" "),
              a(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: !t.fetched || !t.options.fetched,
                      expression: "!fetched || !options.fetched",
                    },
                  ],
                  staticClass: "am-spinner am-section",
                },
                [
                  a("img", {
                    attrs: { src: t.$root.getUrl + "public/img/spinner.svg" },
                  }),
                ]
              ),
              t._v(" "),
              t.fetched &&
              0 === t.appointmentsDay.length &&
              !t.filterApplied &&
              t.fetchedFiltered &&
              t.options.fetched
                ? a("div", { staticClass: "am-empty-state am-section" }, [
                    a("img", {
                      attrs: {
                        src: t.$root.getUrl + "public/img/emptystate.svg",
                      },
                    }),
                    t._v(" "),
                    a("h2", [t._v(t._s(t.$root.labels.no_appointments_yet))]),
                    t._v(" "),
                    a("p", [t._v(t._s(t.$root.labels.click_add_appointments))]),
                  ])
                : t._e(),
              t._v(" "),
              a(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value:
                        t.fetched &&
                        t.options.fetched &&
                        (0 !== t.appointmentsDay.length ||
                          (0 === t.appointmentsDay.length && t.filterApplied) ||
                          !t.fetchedFiltered),
                      expression:
                        "fetched && options.fetched && (appointmentsDay.length !== 0 || (appointmentsDay.length === 0 && filterApplied) || !fetchedFiltered)",
                    },
                  ],
                },
                [
                  a(
                    "div",
                    { staticClass: "am-appointments-filter am-section" },
                    [
                      a(
                        "el-form",
                        {
                          staticClass: "demo-form-inline",
                          attrs: {
                            model: t.params,
                            action: t.exportAction,
                            method: "POST",
                          },
                        },
                        [
                          a(
                            "el-row",
                            { attrs: { gutter: 16 } },
                            [
                              a("el-col", { attrs: { md: 24 } }, [
                                a(
                                  "div",
                                  { staticClass: "am-search" },
                                  [
                                    a(
                                      "el-form-item",
                                      [
                                        a("el-input", {
                                          staticClass: "calc-width",
                                          attrs: {
                                            placeholder:
                                              t.$root.labels
                                                .appointments_search_placeholder,
                                          },
                                          model: {
                                            value: t.params.search,
                                            callback: function (e) {
                                              t.$set(t.params, "search", e);
                                            },
                                            expression: "params.search",
                                          },
                                        }),
                                        t._v(" "),
                                        a(
                                          "el-button",
                                          {
                                            staticClass:
                                              "button-filter-toggle am-button-icon",
                                            attrs: { title: "Toggle Filters" },
                                            on: {
                                              click: function (e) {
                                                t.filterFields =
                                                  !t.filterFields;
                                              },
                                            },
                                          },
                                          [
                                            a("img", {
                                              staticClass: "svg",
                                              attrs: {
                                                alt: "Toggle Filters",
                                                src:
                                                  t.$root.getUrl +
                                                  "public/img/filter.svg",
                                              },
                                            }),
                                          ]
                                        ),
                                        t._v(" "),
                                        a(
                                          "el-tooltip",
                                          { attrs: { placement: "top" } },
                                          [
                                            a("div", {
                                              attrs: { slot: "content" },
                                              domProps: {
                                                innerHTML: t._s(
                                                  t.$root.labels
                                                    .export_tooltip_appointments
                                                ),
                                              },
                                              slot: "content",
                                            }),
                                            t._v(" "),
                                            a(
                                              "el-button",
                                              {
                                                staticClass:
                                                  "button-export am-button-icon",
                                                on: {
                                                  click: function (e) {
                                                    t.dialogExport = !0;
                                                  },
                                                },
                                              },
                                              [
                                                a("img", {
                                                  staticClass: "svg",
                                                  attrs: {
                                                    alt: t.$root.labels.export,
                                                    src:
                                                      t.$root.getUrl +
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
                                    ),
                                  ],
                                  1
                                ),
                              ]),
                            ],
                            1
                          ),
                          t._v(" "),
                          a("transition", { attrs: { name: "fade" } }, [
                            a(
                              "div",
                              {
                                directives: [
                                  {
                                    name: "show",
                                    rawName: "v-show",
                                    value: t.filterFields,
                                    expression: "filterFields",
                                  },
                                ],
                                staticClass: "am-filter-fields",
                              },
                              [
                                a(
                                  "el-row",
                                  { attrs: { gutter: 16 } },
                                  [
                                    a(
                                      "el-col",
                                      {
                                        staticClass: "v-calendar-column",
                                        attrs: { sm: 4, md: 4, lg: 4 },
                                      },
                                      [
                                        a(
                                          "el-form-item",
                                          { attrs: { prop: "dates" } },
                                          [
                                            a("v-date-picker", {
                                              attrs: {
                                                "is-double-paned": !1,
                                                mode: "range",
                                                "popover-visibility": "focus",
                                                "popover-direction": "bottom",
                                                "tint-color": "#1A84EE",
                                                "show-day-popover": !1,
                                                "input-props": {
                                                  class: "el-input__inner",
                                                },
                                                "is-expanded": !1,
                                                "is-required": !0,
                                                "input-class":
                                                  "el-input__inner",
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
                                    a(
                                      "el-col",
                                      { attrs: { sm: 4, md: 4, lg: 4 } },
                                      [
                                        a(
                                          "el-form-item",
                                          [
                                            a(
                                              "el-select",
                                              {
                                                attrs: {
                                                  filterable: "",
                                                  clearable: "",
                                                  placeholder:
                                                    t.$root.labels.employees,
                                                  multiple: "",
                                                  "collapse-tags": "",
                                                },
                                                on: { change: t.changeFilter },
                                                model: {
                                                  value: t.params.providers,
                                                  callback: function (e) {
                                                    t.$set(
                                                      t.params,
                                                      "providers",
                                                      e
                                                    );
                                                  },
                                                  expression:
                                                    "params.providers",
                                                },
                                              },
                                              t._l(
                                                t.visibleEmployees,
                                                function (e) {
                                                  return a("el-option", {
                                                    key: e.id,
                                                    attrs: {
                                                      label:
                                                        e.firstName +
                                                        " " +
                                                        e.lastName,
                                                      value: e.id,
                                                    },
                                                  });
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
                                    t._v(" "),
                                    a(
                                      "el-col",
                                      { attrs: { sm: 4, md: 4, lg: 4 } },
                                      [
                                        a(
                                          "el-form-item",
                                          [
                                            a(
                                              "el-select",
                                              {
                                                attrs: {
                                                  filterable: "",
                                                  clearable: "",
                                                  placeholder:
                                                    t.$root.labels.customer,
                                                  remote: "",
                                                  "remote-method":
                                                    t.searchCustomers,
                                                  loading: t.loadingCustomers,
                                                },
                                                on: { change: t.changeFilter },
                                                model: {
                                                  value: t.params.customerId,
                                                  callback: function (e) {
                                                    t.$set(
                                                      t.params,
                                                      "customerId",
                                                      e
                                                    );
                                                  },
                                                  expression:
                                                    "params.customerId",
                                                },
                                              },
                                              t._l(
                                                t.searchedCustomers.length
                                                  ? t.searchedCustomers
                                                  : t.options.entities
                                                      .customers,
                                                function (e, t) {
                                                  return a("el-option", {
                                                    key: t,
                                                    attrs: {
                                                      label:
                                                        e.firstName +
                                                        " " +
                                                        e.lastName,
                                                      value: e.id,
                                                    },
                                                  });
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
                                    t._v(" "),
                                    a(
                                      "el-col",
                                      { attrs: { sm: 4, md: 4, lg: 4 } },
                                      [
                                        a(
                                          "el-form-item",
                                          [
                                            a(
                                              "el-select",
                                              {
                                                attrs: {
                                                  multiple: "",
                                                  filterable: "",
                                                  placeholder:
                                                    t.$root.labels.services,
                                                  "collapse-tags": "",
                                                },
                                                on: { change: t.changeFilter },
                                                model: {
                                                  value: t.params.services,
                                                  callback: function (e) {
                                                    t.$set(
                                                      t.params,
                                                      "services",
                                                      e
                                                    );
                                                  },
                                                  expression: "params.services",
                                                },
                                              },
                                              t._l(
                                                t.options.entities.categories,
                                                function (e) {
                                                  return a(
                                                    "div",
                                                    { key: e.id },
                                                    [
                                                      a(
                                                        "div",
                                                        {
                                                          staticClass:
                                                            "am-drop-parent",
                                                          on: {
                                                            click: function (
                                                              i
                                                            ) {
                                                              return t.selectAllInCategory(
                                                                e.id
                                                              );
                                                            },
                                                          },
                                                        },
                                                        [
                                                          a("span", [
                                                            t._v(t._s(e.name)),
                                                          ]),
                                                        ]
                                                      ),
                                                      t._v(" "),
                                                      t._l(
                                                        e.serviceList,
                                                        function (e) {
                                                          return a(
                                                            "el-option",
                                                            {
                                                              key: e.id,
                                                              staticClass:
                                                                "am-drop-child",
                                                              attrs: {
                                                                label: e.name,
                                                                value: e.id,
                                                              },
                                                            }
                                                          );
                                                        }
                                                      ),
                                                    ],
                                                    2
                                                  );
                                                }
                                              ),
                                              0
                                            ),
                                          ],
                                          1
                                        ),
                                      ],
                                      1
                                    ),
                                    t._v(" "),
                                    a( //p2p: add location filter
                                      "el-col",
                                      { attrs: { sm: 4, md: 4, lg: 4 } },
                                      [
                                        a(
                                          "el-form-item",
                                          [
                                            a(
                                              "el-select",
                                              {
                                                attrs: {
                                                  placeholder:
                                                    t.$root.labels
                                                      .location,
                                                  clearable: "",
                                                },
                                                on: { change: t.changeFilter },
                                                model: {
                                                  value: t.params.locationId,
                                                  callback: function (e) {
                                                    t.$set(
                                                        t.params,
                                                        "locationId",
                                                        e
                                                    );
                                                  },
                                                  expression:
                                                      "params.locationId",
                                                },
                                              },
                                              t._l(t.options.entities.locations, function(loc) {
                                                return a(
                                                  "el-option",
                                                  {
                                                    key: loc.id,
                                                    attrs: {
                                                      label: loc.name,
                                                      value: loc.id,
                                                    },
                                                  }
                                                );
                                              }),
                                            ),
                                          ]
                                        ),
                                      ]
                                    ),
                                    t._v(" "),
                                    a(
                                      "el-col",
                                      { attrs: { sm: 4, md: 4, lg: 4 } },
                                      [
                                        a(
                                          "el-form-item",
                                          [
                                            a(
                                              "el-select",
                                              {
                                                attrs: {
                                                  filterable: "",
                                                  clearable: "",
                                                  placeholder:
                                                    t.$root.labels.status,
                                                },
                                                on: { change: t.changeFilter },
                                                model: {
                                                  value: t.params.status,
                                                  callback: function (e) {
                                                    t.$set(
                                                      t.params,
                                                      "status",
                                                      e
                                                    );
                                                  },
                                                  expression: "params.status",
                                                },
                                              },
                                              t._l(t.statuses, function (e) {
                                                return a(
                                                  "el-option",
                                                  {
                                                    key: e.value,
                                                    staticClass:
                                                      "am-appointment-status-option",
                                                    attrs: {
                                                      label: e.label,
                                                      value: e.value,
                                                    },
                                                  },
                                                  [
                                                    a("span", {
                                                      staticClass:
                                                        "am-appointment-status-symbol",
                                                      class: e.value,
                                                    }),
                                                    t._v(" "),
                                                    a("span", [
                                                      t._v(t._s(e.label)),
                                                    ]),
                                                  ]
                                                );
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
                              ],
                              1
                            ),
                          ]),
                          t._v(" "),
                          a(
                            "transition",
                            { attrs: { name: "slide" } },
                            [
                              t.dialogExport
                                ? a(
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
                                      a("dialog-export", {
                                        attrs: {
                                          data: Object.assign(
                                            t.params,
                                            t.exportParams
                                          ),
                                          action:
                                            t.$root.getAjaxUrl +
                                            "/report/appointments",
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
                      ),
                    ],
                    1
                  ),
                  t._v(" "),
                  a(
                    "div",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value:
                            t.fetched &&
                            0 === t.appointmentsDay.length &&
                            t.filterApplied &&
                            t.fetchedFiltered &&
                            t.options.fetched,
                          expression:
                            "fetched && appointmentsDay.length === 0 && filterApplied && fetchedFiltered && options.fetched",
                        },
                      ],
                      staticClass: "am-empty-state am-section",
                    },
                    [
                      a("img", {
                        attrs: {
                          src: t.$root.getUrl + "public/img/emptystate.svg",
                        },
                      }),
                      t._v(" "),
                      a("h2", [t._v(t._s(t.$root.labels.no_results))]),
                    ]
                  ),
                  t._v(" "),
                  a(
                    "div",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: !t.fetchedFiltered,
                          expression: "!fetchedFiltered",
                        },
                      ],
                      staticClass: "am-spinner am-section",
                    },
                    [
                      a("img", {
                        attrs: {
                          src: t.$root.getUrl + "public/img/spinner.svg",
                        },
                      }),
                    ]
                  ),
                  t._v(" "),
                  a(
                    "div",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value:
                            t.fetchedFiltered &&
                            t.options.fetched &&
                            0 !== t.appointmentsDay.length,
                          expression:
                            "fetchedFiltered && options.fetched && appointmentsDay.length !== 0",
                        },
                      ],
                      staticClass: "am-appointments am-section",
                    },
                    [
                      a(
                        "div",
                        { staticClass: "am-appointments-list-head" },
                        [
                          a(
                            "el-row",
                            [
                              a(
                                "el-col",
                                { attrs: { lg: 14 } },
                                [
                                  a(
                                    "el-row",
                                    {
                                      staticClass:
                                        "am-appointments-flex-row-middle-align",
                                      attrs: { gutter: 10 },
                                    },
                                    [
                                      a("el-col", { attrs: { lg: 4, md: 4 } }, [
                                        a(
                                          "p",
                                          [
                                            !0 ===
                                            t.$root.settings.capabilities
                                              .canDelete
                                              ? a("el-checkbox", {
                                                  on: {
                                                    change:
                                                      t.handleCheckAllAppointments,
                                                  },
                                                  model: {
                                                    value:
                                                      t.allAppointmentsChecked,
                                                    callback: function (e) {
                                                      t.allAppointmentsChecked =
                                                        e;
                                                    },
                                                    expression:
                                                      "allAppointmentsChecked",
                                                  },
                                                })
                                              : t._e(),
                                          ],
                                          1
                                        ),
                                      ]),
                                      t._v(" "),
                                      a(
                                        "el-col",
                                        {
                                          staticClass: "am-appointment-id",
                                          attrs: { lg: 2, md: 2 },
                                        },
                                        [
                                          a("p", [
                                            t._v(t._s(t.$root.labels.id) + ":"),
                                          ]),
                                        ]
                                      ),
                                      t._v(" "),
                                      a("el-col", { attrs: { lg: 6, md: 6 } }, [
                                        a("p", [
                                          t._v(
                                            t._s(t.$root.labels.customer) + ":"
                                          ),
                                        ]),
                                      ]),
                                      t._v(" "),
                                      a("el-col", { attrs: { lg: 6, md: 6 } }, [
                                        a("p", [
                                          t._v(
                                            t._s(t.$root.labels.assigned_to) +
                                              ":"
                                          ),
                                        ]),
                                      ]),
                                      t._v(" "),
                                      a("el-col", { attrs: { lg: 7, md: 7 } }, [
                                        a("p", [
                                          t._v(
                                            t._s(t.$root.labels.service) + ":"
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
                              a(
                                "el-col",
                                { attrs: { lg: 10 } },
                                [
                                  a(
                                    "el-row",
                                    {
                                      staticClass:
                                        "am-appointments-flex-row-middle-align",
                                      attrs: { gutter: 10 },
                                    },
                                    [
                                      a("el-col", {
                                        attrs: { lg: 0, md: 4, sm: 5 },
                                      }),
                                      t._v(" "),
                                      a("el-col", { attrs: { lg: 3, md: 4 } }, [
                                        a("p", [
                                          t._v(
                                            t._s(t.$root.labels.capacity) + ":"
                                          ),
                                        ]),
                                      ]),
                                      t._v(" "),
                                      a("el-col", { attrs: { lg: 4, md: 6 } }, [
                                        a("p", [
                                          t._v(
                                            t._s(t.$root.labels.duration) + ":"
                                          ),
                                        ]),
                                      ]),
                                      t._v(" "),
                                      a("el-col", { attrs: { lg: 7, sm: 5 } }, [
                                        a("p", [
                                          t._v(
                                            t._s(t.$root.labels.payment) + ":"
                                          ),
                                        ]),
                                      ]),
                                      t._v(" "),
                                      a(
                                        "el-col",
                                        { attrs: { lg: 10, md: 7 } },
                                        [
                                          a("p", [
                                            t._v(
                                              t._s(t.$root.labels.status) + ":"
                                            ),
                                          ]),
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
                        ],
                        1
                      ),
                      t._v(" "),
                      t._l(t.appointmentsDay, function (e, i) {
                        return a("div", [
                          a(
                            "div",
                            { staticClass: "am-appointments-list-day-title" },
                            [
                              a(
                                "el-row",
                                [
                                  a("el-col", { attrs: { span: 24 } }, [
                                    a(
                                      "h2",
                                      [
                                        !0 ===
                                        t.$root.settings.capabilities.canDelete
                                          ? a("el-checkbox", {
                                              attrs: { label: e.date },
                                              on: {
                                                change: function (e) {
                                                  return t.handleCheckedDateAppointments(
                                                    i
                                                  );
                                                },
                                              },
                                              model: {
                                                value:
                                                  t.allDateAppointmentsChecked[
                                                    i
                                                  ],
                                                callback: function (e) {
                                                  t.$set(
                                                    t.allDateAppointmentsChecked,
                                                    i,
                                                    e
                                                  );
                                                },
                                                expression:
                                                  "allDateAppointmentsChecked[appDateKey]",
                                              },
                                            })
                                          : t._e(),
                                        t._v(
                                          "\n                  " +
                                            t._s(t.handleDateFormat(e.date)) +
                                            "\n                "
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
                          t._v(" "),
                          a(
                            "div",
                            { staticClass: "am-appointments-list" },
                            [
                              a(
                                "el-collapse",
                                t._l(e.appointments, function (i) {
                                  return a(
                                    "el-collapse-item",
                                    {
                                      key: e.date + i.id,
                                      staticClass: "am-appointment",
                                      attrs: { name: i.id },
                                    },
                                    [
                                      a("template", { slot: "title" }, [
                                        a(
                                          "div",
                                          {
                                            staticClass: "am-appointment-data",
                                          },
                                          [
                                            a(
                                              "el-row",
                                              [
                                                a(
                                                  "el-col",
                                                  { attrs: { lg: 14 } },
                                                  [
                                                    a(
                                                      "el-row",
                                                      {
                                                        staticClass:
                                                          "am-appointments-flex-row-middle-align",
                                                        attrs: { gutter: 10 },
                                                      },
                                                      [
                                                        a(
                                                          "el-col",
                                                          {
                                                            attrs: {
                                                              lg: 4,
                                                              sm: 4,
                                                            },
                                                          },
                                                          [
                                                            a(
                                                              "span",
                                                              {
                                                                staticClass:
                                                                  "am-appointment-checkbox",
                                                                on: {
                                                                  click:
                                                                    function (
                                                                      e
                                                                    ) {
                                                                      e.stopPropagation();
                                                                    },
                                                                },
                                                              },
                                                              [
                                                                !0 ===
                                                                t.$root.settings
                                                                  .capabilities
                                                                  .canDelete
                                                                  ? a(
                                                                      "el-checkbox",
                                                                      {
                                                                        attrs: {
                                                                          value:
                                                                            i.id,
                                                                          label:
                                                                            i.id,
                                                                        },
                                                                        on: {
                                                                          change:
                                                                            function (
                                                                              e
                                                                            ) {
                                                                              return t.handleCheckedAppointment(
                                                                                i
                                                                              );
                                                                            },
                                                                        },
                                                                        model: {
                                                                          value:
                                                                            i.checked,
                                                                          callback:
                                                                            function (
                                                                              e
                                                                            ) {
                                                                              t.$set(
                                                                                i,
                                                                                "checked",
                                                                                e
                                                                              );
                                                                            },
                                                                          expression:
                                                                            "app.checked",
                                                                        },
                                                                      }
                                                                    )
                                                                  : t._e(),
                                                              ],
                                                              1
                                                            ),
                                                            t._v(" "),
                                                            a(
                                                              "span",
                                                              {
                                                                staticClass:
                                                                  "am-appointment-time",
                                                                class:
                                                                  t.getBookingStatus(
                                                                    i.status,
                                                                    i
                                                                      .bookings[0]
                                                                      .status
                                                                  ),
                                                              },
                                                              [
                                                                t._v(
                                                                  "\n                              " +
                                                                    t._s(
                                                                      t.getFrontedFormattedTime(
                                                                        t.getTime(
                                                                          i.bookingStart
                                                                        )
                                                                      )
                                                                    ) +
                                                                    "\n                            "
                                                                ),
                                                              ]
                                                            ),
                                                          ]
                                                        ),
                                                        t._v(" "),
                                                        a(
                                                          "el-col",
                                                          {
                                                            staticClass:
                                                              "am-appointment-id",
                                                            attrs: {
                                                              lg: 2,
                                                              sm: 2,
                                                            },
                                                          },
                                                          [
                                                            a(
                                                              "p",
                                                              {
                                                                staticClass:
                                                                  "am-col-title",
                                                              },
                                                              [
                                                                t._v(
                                                                  t._s(
                                                                    t.$root
                                                                      .labels.id
                                                                  ) + ":"
                                                                ),
                                                              ]
                                                            ),
                                                            t._v(" "),
                                                            a("h4", [
                                                              t._v(t._s(i.id)),
                                                            ]),
                                                          ]
                                                        ),
                                                        t._v(" "),
                                                        a(
                                                          "el-col",
                                                          {
                                                            attrs: {
                                                              lg: 6,
                                                              sm: 6,
                                                            },
                                                          },
                                                          [
                                                            a(
                                                              "p",
                                                              {
                                                                staticClass:
                                                                  "am-col-title",
                                                              },
                                                              [
                                                                t._v(
                                                                  t._s(
                                                                    t.$root
                                                                      .labels
                                                                      .customer
                                                                  ) + ":"
                                                                ),
                                                              ]
                                                            ),
                                                            t._v(" "),
                                                            [
                                                              a(
                                                                "el-tooltip",
                                                                {
                                                                  staticClass:
                                                                    "item",
                                                                  attrs: {
                                                                    placement:
                                                                      "top",
                                                                    disabled:
                                                                      1 ===
                                                                      i.bookings
                                                                        .length,
                                                                    "popper-class":
                                                                      "am-align-left",
                                                                  },
                                                                },
                                                                [
                                                                  i.bookings
                                                                    .length > 1
                                                                    ? a("div", {
                                                                        attrs: {
                                                                          slot: "content",
                                                                        },
                                                                        domProps:
                                                                          {
                                                                            innerHTML:
                                                                              t._s(
                                                                                t.getCustomersFromGroup(
                                                                                  i
                                                                                )
                                                                              ),
                                                                          },
                                                                        slot: "content",
                                                                      })
                                                                    : t._e(),
                                                                  t._v(" "),
                                                                  a(
                                                                    "h3",
                                                                    {
                                                                      class: {
                                                                        grouped:
                                                                          i
                                                                            .bookings
                                                                            .length >
                                                                          1,
                                                                      },
                                                                    },
                                                                    [
                                                                      a("img", {
                                                                        directives:
                                                                          [
                                                                            {
                                                                              name: "show",
                                                                              rawName:
                                                                                "v-show",
                                                                              value:
                                                                                i
                                                                                  .bookings
                                                                                  .length >
                                                                                1,
                                                                              expression:
                                                                                "app.bookings.length > 1",
                                                                            },
                                                                          ],
                                                                        attrs: {
                                                                          width:
                                                                            "16px",
                                                                          src:
                                                                            t
                                                                              .$root
                                                                              .getUrl +
                                                                            "public/img/group.svg",
                                                                        },
                                                                      }),
                                                                      t._v(" "),
                                                                      t._l(
                                                                        i.bookings,
                                                                        function (
                                                                          e,
                                                                          o
                                                                        ) {
                                                                          return a(
                                                                            "span",
                                                                            [
                                                                              t._v(
                                                                                "\n                                    " +
                                                                                  t._s(
                                                                                    null !==
                                                                                      (t.user =
                                                                                        t.getCustomerInfo(
                                                                                          e
                                                                                        ))
                                                                                      ? t
                                                                                          .user
                                                                                          .firstName +
                                                                                          " " +
                                                                                          t
                                                                                            .user
                                                                                            .lastName
                                                                                      : ""
                                                                                  )
                                                                              ),
                                                                              i
                                                                                .bookings
                                                                                .length >
                                                                                1 &&
                                                                              o +
                                                                                1 !==
                                                                                i
                                                                                  .bookings
                                                                                  .length
                                                                                ? a(
                                                                                    "span",
                                                                                    [
                                                                                      t._v(
                                                                                        ","
                                                                                      ),
                                                                                    ]
                                                                                  )
                                                                                : t._e(),
                                                                            ]
                                                                          );
                                                                        }
                                                                      ),
                                                                    ],
                                                                    2
                                                                  ),
                                                                ]
                                                              ),
                                                              t._v(" "),
                                                              t._l(
                                                                i.bookings,
                                                                function (e) {
                                                                  return 1 ===
                                                                    i.bookings
                                                                      .length
                                                                    ? a(
                                                                        "span",
                                                                        [
                                                                          t._v(
                                                                            t._s(
                                                                              e
                                                                                .customer
                                                                                .email
                                                                            )
                                                                          ),
                                                                        ]
                                                                      )
                                                                    : t._e();
                                                                }
                                                              ),
                                                              t._v(" "),
                                                              t._l(
                                                                i.bookings,
                                                                function (e) {
                                                                  return 1 ===
                                                                    i.bookings
                                                                      .length
                                                                    ? a(
                                                                        "span",
                                                                        {
                                                                          staticClass:
                                                                            "am-appointment-data-phone",
                                                                        },
                                                                        [
                                                                          t._v(
                                                                            t._s(
                                                                              null !==
                                                                                (t.user =
                                                                                  t.getCustomerById(
                                                                                    e.customerId
                                                                                  ))
                                                                                ? t
                                                                                    .user
                                                                                    .phone
                                                                                : e
                                                                                    .customer
                                                                                    .phone
                                                                            )
                                                                          ),
                                                                        ]
                                                                      )
                                                                    : t._e();
                                                                }
                                                              ),
                                                              t._v(" "),
                                                              i.bookings
                                                                .length > 1
                                                                ? a("span", [
                                                                    t._v(
                                                                      t._s(
                                                                        t.$root
                                                                          .labels
                                                                          .multiple_emails
                                                                      )
                                                                    ),
                                                                  ])
                                                                : t._e(),
                                                            ],
                                                          ],
                                                          2
                                                        ),
                                                        t._v(" "),
                                                        a(
                                                          "el-col",
                                                          {
                                                            attrs: {
                                                              lg: 6,
                                                              sm: 6,
                                                            },
                                                          },
                                                          [
                                                            a(
                                                              "p",
                                                              {
                                                                staticClass:
                                                                  "am-col-title",
                                                              },
                                                              [
                                                                t._v(
                                                                  t._s(
                                                                    t.$root
                                                                      .labels
                                                                      .assigned
                                                                  ) + ":"
                                                                ),
                                                              ]
                                                            ),
                                                            t._v(" "),
                                                            a(
                                                              "div",
                                                              {
                                                                staticClass:
                                                                  "am-assigned",
                                                              },
                                                              [
                                                                t.options
                                                                  .fetched &&
                                                                t.fetchedFiltered
                                                                  ? a("img", {
                                                                      attrs: {
                                                                        src: t.pictureLoad(
                                                                          t.getProviderById(
                                                                            i.providerId
                                                                          ),
                                                                          !0
                                                                        ),
                                                                      },
                                                                      on: {
                                                                        error:
                                                                          function (
                                                                            e
                                                                          ) {
                                                                            t.imageLoadError(
                                                                              t.getProviderById(
                                                                                i.providerId
                                                                              ),
                                                                              !0
                                                                            );
                                                                          },
                                                                      },
                                                                    })
                                                                  : t._e(),
                                                                t._v(" "),
                                                                a("h4", [
                                                                  t._v(
                                                                    "\n                                " +
                                                                      t._s(
                                                                        null !==
                                                                          (t.user =
                                                                            t.getProviderById(
                                                                              i.providerId
                                                                            ))
                                                                          ? t
                                                                              .user
                                                                              .firstName +
                                                                              " " +
                                                                              t
                                                                                .user
                                                                                .lastName
                                                                          : ""
                                                                      ) +
                                                                      "\n                              "
                                                                  ),
                                                                ]),
                                                              ]
                                                            ),
                                                          ]
                                                        ),
                                                        t._v(" "),
                                                        a(
                                                          "el-col",
                                                          {
                                                            staticClass:
                                                              "am-appointment-package",
                                                            attrs: {
                                                              lg: 7,
                                                              sm: 8,
                                                            },
                                                          },
                                                          [
                                                            a(
                                                              "p",
                                                              {
                                                                staticClass:
                                                                  "am-col-title",
                                                              },
                                                              [
                                                                t._v(
                                                                  t._s(
                                                                    t.$root
                                                                      .labels
                                                                      .service
                                                                  ) + ":"
                                                                ),
                                                              ]
                                                            ),
                                                            t._v(" "),
                                                            a(
                                                              "div",
                                                              {
                                                                staticClass:
                                                                  "am-appointment-package-wrap",
                                                              },
                                                              [
                                                                a("h4", [
                                                                  t._v(
                                                                    "\n                                " +
                                                                      t._s(
                                                                        null !==
                                                                          (t.service =
                                                                            t.getServiceById(
                                                                              i.serviceId
                                                                            ))
                                                                          ? t
                                                                              .service
                                                                              .name
                                                                          : ""
                                                                      ) +
                                                                      "\n                              "
                                                                  ),
                                                                ]),
                                                                t._v(" "),
                                                                a(
                                                                  "el-tooltip",
                                                                  {
                                                                    attrs: {
                                                                      placement:
                                                                        "top",
                                                                    },
                                                                  },
                                                                  [
                                                                    a("div", {
                                                                      staticStyle:
                                                                        {
                                                                          "text-align":
                                                                            "left",
                                                                        },
                                                                      attrs: {
                                                                        slot: "content",
                                                                      },
                                                                      domProps:
                                                                        {
                                                                          innerHTML:
                                                                            t._s(
                                                                              t.packageTooltipContent(
                                                                                i.bookings
                                                                              )
                                                                            ),
                                                                        },
                                                                      slot: "content",
                                                                    }),
                                                                    t._v(" "),
                                                                    Object.keys(
                                                                      t.bookingTypeCountInPackage(
                                                                        i.bookings
                                                                      ).package
                                                                    ).length
                                                                      ? a(
                                                                          "img",
                                                                          {
                                                                            attrs:
                                                                              {
                                                                                src:
                                                                                  t
                                                                                    .$root
                                                                                    .getUrl +
                                                                                  "public/img/am-package.svg",
                                                                              },
                                                                          }
                                                                        )
                                                                      : t._e(),
                                                                  ]
                                                                ),
                                                              ],
                                                              1
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
                                                a(
                                                  "el-col",
                                                  { attrs: { lg: 10 } },
                                                  [
                                                    a(
                                                      "el-row",
                                                      {
                                                        staticClass:
                                                          "am-appointments-flex-row-middle-align",
                                                        attrs: { gutter: 10 },
                                                      },
                                                      [
                                                        a("el-col", {
                                                          attrs: {
                                                            lg: 0,
                                                            sm: 5,
                                                          },
                                                        }),
                                                        t._v(" "),
                                                        a(
                                                          "el-col",
                                                          {
                                                            attrs: {
                                                              lg: 3,
                                                              sm: 4,
                                                              xs: 12,
                                                            },
                                                          },
                                                          [
                                                            a(
                                                              "p",
                                                              {
                                                                staticClass:
                                                                  "am-col-title",
                                                              },
                                                              [
                                                                t._v(
                                                                  t._s(
                                                                    t.$root
                                                                      .labels
                                                                      .capacity
                                                                  ) + ":"
                                                                ),
                                                              ]
                                                            ),
                                                            t._v(" "),
                                                            a("h4", [
                                                              t._v(
                                                                t._s(
                                                                  t.getCapacity(
                                                                    i
                                                                  )
                                                                )
                                                              ),
                                                            ]),
                                                          ]
                                                        ),
                                                        t._v(" "),
                                                        a(
                                                          "el-col",
                                                          {
                                                            attrs: {
                                                              lg: 4,
                                                              sm: 5,
                                                              xs: 12,
                                                            },
                                                          },
                                                          [
                                                            a(
                                                              "p",
                                                              {
                                                                staticClass:
                                                                  "am-col-title",
                                                              },
                                                              [
                                                                t._v(
                                                                  t._s(
                                                                    t.$root
                                                                      .labels
                                                                      .duration
                                                                  ) + ":"
                                                                ),
                                                              ]
                                                            ),
                                                            t._v(" "),
                                                            a("h4", [
                                                              t._v(
                                                                t._s(
                                                                  t.momentDurationToNiceDurationWithUnit(
                                                                    t.convertDateTimeRangeDifferenceToMomentDuration(
                                                                      i.bookingStart,
                                                                      i.bookingEnd
                                                                    )
                                                                  )
                                                                )
                                                              ),
                                                            ]),
                                                          ]
                                                        ),
                                                        t._v(" "),
                                                        a(
                                                          "el-col",
                                                          {
                                                            staticClass:
                                                              "am-appointment-payment",
                                                            attrs: {
                                                              lg: 7,
                                                              sm: 6,
                                                              xs: 13,
                                                            },
                                                          },
                                                          [
                                                            a(
                                                              "p",
                                                              {
                                                                staticClass:
                                                                  "am-col-title",
                                                              },
                                                              [
                                                                t._v(
                                                                  t._s(
                                                                    t.$root
                                                                      .labels
                                                                      .payment
                                                                  ) + ":"
                                                                ),
                                                              ]
                                                            ),
                                                            t._v(" "),
                                                            t.getAppointmentPaymentMethods(
                                                              i.bookings
                                                            ).length
                                                              ? a(
                                                                  "div",
                                                                  {
                                                                    staticClass:
                                                                      "am-appointment-package-wrap",
                                                                  },
                                                                  [
                                                                    t._l(
                                                                      t.getAppointmentPaymentMethods(
                                                                        i.bookings
                                                                      ),
                                                                      function (
                                                                        e
                                                                      ) {
                                                                        return t.getAppointmentPaymentMethods(
                                                                          i.bookings
                                                                        ).length
                                                                          ? a(
                                                                              "img",
                                                                              {
                                                                                attrs:
                                                                                  {
                                                                                    src:
                                                                                      t
                                                                                        .$root
                                                                                        .getUrl +
                                                                                      "public/img/payments/" +
                                                                                      e +
                                                                                      ".svg",
                                                                                  },
                                                                              }
                                                                            )
                                                                          : t._e();
                                                                      }
                                                                    ),
                                                                    t._v(" "),
                                                                    t.bookingTypeCountInPackage(
                                                                      i.bookings
                                                                    ).regular
                                                                      ? a(
                                                                          "h4",
                                                                          [
                                                                            a(
                                                                              "el-tooltip",
                                                                              {
                                                                                attrs:
                                                                                  {
                                                                                    placement:
                                                                                      "top",
                                                                                  },
                                                                              },
                                                                              [
                                                                                a(
                                                                                  "div",
                                                                                  {
                                                                                    attrs:
                                                                                      {
                                                                                        slot: "content",
                                                                                      },
                                                                                    slot: "content",
                                                                                  },
                                                                                  [
                                                                                    t._v(
                                                                                      "\n                                    " +
                                                                                        t._s(
                                                                                          t.getAppointmentPrice(
                                                                                            i.serviceId,
                                                                                            t.getAppointmentService(
                                                                                              i
                                                                                            ),
                                                                                            i.bookings,
                                                                                            !0
                                                                                          )
                                                                                        ) +
                                                                                        "\n                                    "
                                                                                    ),
                                                                                    Object.keys(
                                                                                      t.bookingTypeCountInPackage(
                                                                                        i.bookings
                                                                                      )
                                                                                        .package
                                                                                    )
                                                                                      .length
                                                                                      ? a(
                                                                                          "span",
                                                                                          [
                                                                                            t._v(
                                                                                              "+"
                                                                                            ),
                                                                                          ]
                                                                                        )
                                                                                      : t._e(),
                                                                                  ]
                                                                                ),
                                                                                t._v(
                                                                                  " "
                                                                                ),
                                                                                a(
                                                                                  "div",
                                                                                  [
                                                                                    t._v(
                                                                                      "\n                                    " +
                                                                                        t._s(
                                                                                          t.getAppointmentPrice(
                                                                                            i.serviceId,
                                                                                            t.getAppointmentService(
                                                                                              i
                                                                                            ),
                                                                                            i.bookings,
                                                                                            !0
                                                                                          )
                                                                                        ) +
                                                                                        "\n                                    "
                                                                                    ),
                                                                                    Object.keys(
                                                                                      t.bookingTypeCountInPackage(
                                                                                        i.bookings
                                                                                      )
                                                                                        .package
                                                                                    )
                                                                                      .length
                                                                                      ? a(
                                                                                          "span",
                                                                                          [
                                                                                            t._v(
                                                                                              "+"
                                                                                            ),
                                                                                          ]
                                                                                        )
                                                                                      : t._e(),
                                                                                  ]
                                                                                ),
                                                                              ]
                                                                            ),
                                                                          ],
                                                                          1
                                                                        )
                                                                      : t._e(),
                                                                    t._v(" "),
                                                                    Object.keys(
                                                                      t.bookingTypeCountInPackage(
                                                                        i.bookings
                                                                      ).package
                                                                    ).length
                                                                      ? a(
                                                                          "el-tooltip",
                                                                          {
                                                                            attrs:
                                                                              {
                                                                                placement:
                                                                                  "top",
                                                                                content:
                                                                                  t
                                                                                    .$root
                                                                                    .labels
                                                                                    .bookings_payment_package_tooltip,
                                                                              },
                                                                          },
                                                                          [
                                                                            Object.keys(
                                                                              t.bookingTypeCountInPackage(
                                                                                i.bookings
                                                                              )
                                                                                .package
                                                                            )
                                                                              .length
                                                                              ? a(
                                                                                  "img",
                                                                                  {
                                                                                    attrs:
                                                                                      {
                                                                                        src:
                                                                                          t
                                                                                            .$root
                                                                                            .getUrl +
                                                                                          "public/img/am-package.svg",
                                                                                      },
                                                                                  }
                                                                                )
                                                                              : t._e(),
                                                                          ]
                                                                        )
                                                                      : t._e(),
                                                                  ],
                                                                  2
                                                                )
                                                              : t._e(),
                                                          ]
                                                        ),
                                                        t._v(" "),
                                                        "customer" !==
                                                        t.$root.settings.role
                                                          ? a(
                                                              "el-col",
                                                              {
                                                                attrs: {
                                                                  lg: 7,
                                                                  sm: 7,
                                                                  xs: 16,
                                                                },
                                                              },
                                                              [
                                                                a(
                                                                  "div",
                                                                  {
                                                                    staticClass:
                                                                      "am-appointment-status", //p2p: status select
                                                                    on: {
                                                                      click:
                                                                        function (
                                                                          e
                                                                        ) {
                                                                          e.stopPropagation();
                                                                        },
                                                                    },
                                                                  },
                                                                  [
                                                                    a("span", {
                                                                      staticClass:
                                                                        "am-appointment-status-symbol",
                                                                      class:
                                                                        i.status,
                                                                    }),
                                                                    t._v(" "),
                                                                    a(
                                                                      "el-select",
                                                                      {
                                                                        attrs: {
                                                                          placeholder:
                                                                            t
                                                                              .$root
                                                                              .labels
                                                                              .status,
                                                                          disabled:
                                                                            t.updateStatusDisabled ||
                                                                            !t.canWriteAppointments(),
                                                                        },
                                                                        on: {
                                                                          change:
                                                                            function (
                                                                              e
                                                                            ) {
                                                                              return t.updateAppointmentStatus(
                                                                                i,
                                                                                i.status,
                                                                                !0
                                                                              );
                                                                            },
                                                                        },
                                                                        model: {
                                                                          value:
                                                                            i.status,
                                                                          callback:
                                                                            function (
                                                                              e
                                                                            ) {
                                                                              t.$set(
                                                                                i,
                                                                                "status",
                                                                                e
                                                                              );
                                                                            },
                                                                          expression:
                                                                            "app.status",
                                                                        },
                                                                      },
                                                                      t._l(
                                                                        t.statuses,
                                                                        function (
                                                                          e
                                                                        ) {
                                                                          return a(
                                                                            "el-option",
                                                                            {
                                                                              key: e.value,
                                                                              staticClass:
                                                                                "am-appointment-status-option",
                                                                              attrs:
                                                                                {
                                                                                  label:
                                                                                    e.label,
                                                                                  value:
                                                                                    e.value,
                                                                                },
                                                                            },
                                                                            [
                                                                              a(
                                                                                "span",
                                                                                {
                                                                                  staticClass:
                                                                                    "am-appointment-status-symbol",
                                                                                  class:
                                                                                    e.value,
                                                                                },
                                                                                [
                                                                                  t._v(
                                                                                    t._s(
                                                                                      e.label
                                                                                    )
                                                                                  ),
                                                                                ]
                                                                              ),
                                                                            ]
                                                                          );
                                                                        }
                                                                      ),
                                                                      1
                                                                    ),
                                                                  ],
                                                                  1
                                                                ),
                                                              ]
                                                            )
                                                          : t._e(),
                                                        t._v(" "),
                                                        t.canWriteAppointments()
                                                          ? a(
                                                              "el-col",
                                                              {
                                                                attrs: {
                                                                  lg: 4,
                                                                  sm: 3,
                                                                  xs: 8,
                                                                },
                                                              },
                                                              [
                                                                a(
                                                                  "div",
                                                                  {
                                                                    staticClass:
                                                                      "am-edit-btn",
                                                                    on: {
                                                                      click:
                                                                        function (
                                                                          e
                                                                        ) {
                                                                          e.stopPropagation();
                                                                        },
                                                                    },
                                                                  },
                                                                  [
                                                                    a(
                                                                      "el-button",
                                                                      {
                                                                        staticClass:
                                                                          "am-button-icon",
                                                                        on: {
                                                                          click:
                                                                            function (
                                                                              e
                                                                            ) {
                                                                              return t.showDialogEditAppointment(
                                                                                i.id
                                                                              );
                                                                            },
                                                                        },
                                                                      },
                                                                      [
                                                                        a(
                                                                          "img",
                                                                          {
                                                                            staticClass:
                                                                              "svg",
                                                                            attrs:
                                                                              {
                                                                                alt: t
                                                                                  .$root
                                                                                  .labels
                                                                                  .edit,
                                                                                src:
                                                                                  t
                                                                                    .$root
                                                                                    .getUrl +
                                                                                  "public/img/edit.svg",
                                                                              },
                                                                          }
                                                                        ),
                                                                      ]
                                                                    ),
                                                                  ],
                                                                  1
                                                                ),
                                                              ]
                                                            )
                                                          : t._e(),
                                                        t._v(" "),
                                                        "customer" ===
                                                        t.$root.settings.role
                                                          ? a(
                                                              "el-col",
                                                              {
                                                                attrs: {
                                                                  lg: 12,
                                                                  sm: 6,
                                                                },
                                                              },
                                                              [
                                                                a(
                                                                  "span",
                                                                  {
                                                                    class:
                                                                      "am-customer-status " +
                                                                      i
                                                                        .bookings[0]
                                                                        .status,
                                                                  },
                                                                  [
                                                                    t._v(
                                                                      t._s(
                                                                        t.statuses.find(
                                                                          function (
                                                                            e
                                                                          ) {
                                                                            return (
                                                                              e.value ===
                                                                              i
                                                                                .bookings[0]
                                                                                .status
                                                                            );
                                                                          }
                                                                        ).label
                                                                      )
                                                                    ),
                                                                  ]
                                                                ),
                                                                t._v(" "),
                                                                a(
                                                                  "span",
                                                                  {
                                                                    staticClass:
                                                                      "am-cancel-btn",
                                                                    on: {
                                                                      click:
                                                                        function (
                                                                          e
                                                                        ) {
                                                                          e.stopPropagation();
                                                                        },
                                                                    },
                                                                  },
                                                                  [
                                                                    a(
                                                                      "el-tooltip",
                                                                      {
                                                                        attrs: {
                                                                          content:
                                                                            t
                                                                              .$root
                                                                              .labels
                                                                              .cancel_appointment,
                                                                          placement:
                                                                            "top",
                                                                        },
                                                                      },
                                                                      [
                                                                        !i.past &&
                                                                        "canceled" !==
                                                                          i
                                                                            .bookings[0]
                                                                            .status &&
                                                                        "rejected" !==
                                                                          i
                                                                            .bookings[0]
                                                                            .status &&
                                                                        i.cancelable
                                                                          ? a(
                                                                              "el-button",
                                                                              {
                                                                                attrs:
                                                                                  {
                                                                                    type: "danger",
                                                                                    size: "mini",
                                                                                    loading:
                                                                                      t.updateBookingStatusLoading &&
                                                                                      i
                                                                                        .bookings[0]
                                                                                        .id ===
                                                                                        t.updateBookingStatusId,
                                                                                  },
                                                                                on: {
                                                                                  click:
                                                                                    function (
                                                                                      e
                                                                                    ) {
                                                                                      return t.updateBookingStatus(
                                                                                        i,
                                                                                        "canceled"
                                                                                      );
                                                                                    },
                                                                                },
                                                                              },
                                                                              [
                                                                                t._v(
                                                                                  "\n                                  " +
                                                                                    t._s(
                                                                                      t
                                                                                        .$root
                                                                                        .labels
                                                                                        .cancel
                                                                                    ) +
                                                                                    "\n                                "
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
                                                                t._v(" "),
                                                                a(
                                                                  "span",
                                                                  {
                                                                    on: {
                                                                      click:
                                                                        function (
                                                                          e
                                                                        ) {
                                                                          e.stopPropagation();
                                                                        },
                                                                    },
                                                                  },
                                                                  [
                                                                    a(
                                                                      "el-tooltip",
                                                                      {
                                                                        attrs: {
                                                                          content:
                                                                            t
                                                                              .$root
                                                                              .labels
                                                                              .edit_appointment,
                                                                          placement:
                                                                            "top",
                                                                        },
                                                                      },
                                                                      [
                                                                        !i.past &&
                                                                        "canceled" !==
                                                                          i
                                                                            .bookings[0]
                                                                            .status &&
                                                                        "rejected" !==
                                                                          i
                                                                            .bookings[0]
                                                                            .status &&
                                                                        i.reschedulable
                                                                          ? a(
                                                                              "el-button",
                                                                              {
                                                                                attrs:
                                                                                  {
                                                                                    size: "mini",
                                                                                  },
                                                                                on: {
                                                                                  click:
                                                                                    function (
                                                                                      e
                                                                                    ) {
                                                                                      return t.showDialogEditAppointment(
                                                                                        i.id
                                                                                      );
                                                                                    },
                                                                                },
                                                                              },
                                                                              [
                                                                                t._v(
                                                                                  "\n                              " +
                                                                                    t._s(
                                                                                      t
                                                                                        .$root
                                                                                        .labels
                                                                                        .edit
                                                                                    ) +
                                                                                    "\n                            "
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
                                      ]),
                                      t._v(" "),
                                      a("appointment-list-collapsed", {
                                        attrs: { app: i, options: t.options },
                                      }),
                                    ],
                                    2
                                  );
                                }),
                                1
                              ),
                            ],
                            1
                          ),
                        ]);
                      }),
                      t._v(" "),
                      a("pagination-block", {
                        attrs: {
                          params: t.paginationParams,
                          show: t.paginationParams.show,
                          count: t.totalPeriodAppointments,
                          label: t.$root.labels.appointments.toLowerCase(),
                          visible:
                            t.totalPeriodAppointments > t.paginationParams.show,
                        },
                        on: { change: t.getAppointments },
                      }),
                    ],
                    2
                  ),
                  t._v(" "),
                  a("transition", { attrs: { name: "slide-vertical" } }, [
                    t.toaster
                      ? a(
                          "div",
                          { staticClass: "am-bottom-popover" },
                          [
                            a(
                              "transition",
                              { attrs: { name: "fade" } },
                              [
                                a(
                                  "el-button",
                                  {
                                    directives: [
                                      {
                                        name: "show",
                                        rawName: "v-show",
                                        value: t.showDeleteButton,
                                        expression: "showDeleteButton",
                                      },
                                    ],
                                    staticClass: "am-button-icon",
                                    on: {
                                      click: function (e) {
                                        return t.switchShowDeleteConfirmation(
                                          !0
                                        );
                                      },
                                    },
                                  },
                                  [
                                    a("img", {
                                      staticClass: "svg",
                                      attrs: {
                                        alt: t.$root.labels.delete,
                                        src:
                                          t.$root.getUrl +
                                          "public/img/delete.svg",
                                      },
                                    }),
                                  ]
                                ),
                              ],
                              1
                            ),
                            t._v(" "),
                            a(
                              "transition",
                              { attrs: { name: "slide-vertical" } },
                              [
                                a(
                                  "div",
                                  {
                                    directives: [
                                      {
                                        name: "show",
                                        rawName: "v-show",
                                        value: t.showDeleteConfirmation,
                                        expression: "showDeleteConfirmation",
                                      },
                                    ],
                                    staticClass:
                                      "am-bottom-popover-confirmation",
                                  },
                                  [
                                    a(
                                      "el-row",
                                      {
                                        attrs: {
                                          type: "flex",
                                          justify: "start",
                                          align: "middle",
                                        },
                                      },
                                      [
                                        a("h3", [
                                          t._v(t._s(t.confirmationText())),
                                        ]),
                                        t._v(" "),
                                        a(
                                          "div",
                                          { staticClass: "align-left" },
                                          [
                                            a(
                                              "el-button",
                                              {
                                                attrs: { size: "small" },
                                                on: {
                                                  click: function (e) {
                                                    return t.switchShowDeleteConfirmation(
                                                      !1
                                                    );
                                                  },
                                                },
                                              },
                                              [
                                                t._v(
                                                  "\n                    " +
                                                    t._s(
                                                      t.$root.labels.cancel
                                                    ) +
                                                    "\n                  "
                                                ),
                                              ]
                                            ),
                                            t._v(" "),
                                            a(
                                              "el-button",
                                              {
                                                attrs: {
                                                  size: "small",
                                                  type: "primary",
                                                  loading:
                                                    t.deleteAppointmentGroupLoading,
                                                },
                                                on: {
                                                  click:
                                                    t.deleteAppointmentGroup,
                                                },
                                              },
                                              [
                                                t._v(
                                                  "\n                    " +
                                                    t._s(
                                                      t.$root.labels.delete
                                                    ) +
                                                    "\n                  "
                                                ),
                                              ]
                                            ),
                                          ],
                                          1
                                        ),
                                      ]
                                    ),
                                  ],
                                  1
                                ),
                              ]
                            ),
                          ],
                          1
                        )
                      : t._e(),
                  ]),
                ],
                1
              ),
              t._v(" "),
              t.canWriteAppointments()
                ? a(
                    "div",
                    {
                      staticClass: "am-button-new",
                      attrs: { id: "am-button-new" },
                    },
                    [
                      a("el-button", {
                        attrs: {
                          id: "am-plus-symbol",
                          type: "primary",
                          icon: "el-icon-plus",
                        },
                        on: { click: t.showDialogNewAppointment },
                      }),
                    ],
                    1
                  )
                : t._e(),
              t._v(" "),
              a(
                "transition",
                { attrs: { name: "slide" } },
                [
                  t.dialogAppointment
                    ? a(
                        "el-dialog",
                        {
                          staticClass: "am-side-dialog",
                          attrs: {
                            visible: t.dialogAppointment,
                            "show-close": !1,
                          },
                          on: {
                            "update:visible": function (e) {
                              t.dialogAppointment = e;
                            },
                          },
                        },
                        [
                          a("dialog-appointment", {
                            attrs: {
                              appointment: t.appointment,
                              recurringAppointments: t.recurringAppointments,
                              savedAppointment: t.savedAppointment,
                              bookings: t.bookings,
                              options: t.options,
                              customerCreatedCount: t.customerCreatedCount,
                            },
                            on: {
                              sortBookings: t.sortBookings,
                              saveCallback: t.saveAppointmentCallback,
                              duplicateCallback: t.duplicateAppointmentCallback,
                              closeDialog: t.closeDialogAppointment,
                              showDialogNewCustomer: function (e) {
                                return t.showDialogNewCustomer();
                              },
                              editPayment: t.editPayment,
                              openRecurringAppointment:
                                t.openRecurringAppointment,
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
              a(
                "transition",
                { attrs: { name: "slide" } },
                [
                  t.dialogCustomer
                    ? a(
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
                          a("dialog-customer", {
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
              a(
                "transition",
                { attrs: { name: "slide" } },
                [
                  t.dialogPayment
                    ? a(
                        "el-dialog",
                        {
                          staticClass: "am-side-dialog am-dialog-coupon",
                          attrs: { visible: t.dialogPayment, "show-close": !1 },
                          on: {
                            "update:visible": function (e) {
                              t.dialogPayment = e;
                            },
                          },
                        },
                        [
                          a("dialog-payment", {
                            attrs: {
                              modalData: t.selectedPaymentModalData,
                              bookingFetched: !0,
                            },
                            on: {
                              closeDialogPayment: function (e) {
                                t.dialogPayment = !1;
                              },
                              updatePaymentCallback: t.updatePaymentCallback,
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
              a("el-col", { attrs: { md: 6 } }, [
                a(
                  "a",
                  {
                    staticClass: "am-help-button",
                    attrs: {
                      href: "https://wpamelia.com/appointments/",
                      target: "_blank",
                    },
                  },
                  [
                    a("i", { staticClass: "el-icon-question" }),
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
  663: function (e, t, i) {
    var a = i(685)(i(1009), i(1010), !1, null, null, null);
    e.exports = a.exports;
  },
  685: function (e, t) {
    e.exports = function (e, t, i, a, o, n) {
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
        i && (u.functional = !0),
        o && (u._scopeId = o),
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
            (u._ssrRegister = c))
          : a && (c = a),
        c)
      ) {
        var m = u.functional,
          d = m ? u.render : u.beforeCreate;
        m
          ? ((u._injectStyles = c),
            (u.render = function (e, t) {
              return c.call(t), d(e, t);
            }))
          : (u.beforeCreate = d ? [].concat(d, c) : [c]);
      }
      return { esModule: s, exports: r, options: u };
    };
  },
  686: function (e, t, i) {
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
          var i = this;
          Object.keys(e).forEach(function (o) {
            null !== e[o] && "object" === a(e[o]) && o in t
              ? i.replaceExistingObjectProperties(e[o], t[o])
              : o in t && (e[o] = t[o]);
          });
        },
        addMissingObjectProperties: function (e, t) {
          var i = this;
          Object.keys(t).forEach(function (o) {
            var n = !1;
            o in e ||
              ("object" === a(t[o])
                ? ((e[o] = {}), (n = !0))
                : ((e[o] = null), (n = !0))),
              null === t[o] || "object" !== a(t[o])
                ? n && (e[o] = t[o])
                : i.addMissingObjectProperties(e[o], t[o]);
          });
        },
        scrollView: function (e, t, i) {
          "undefined" != typeof jQuery &&
            ((void 0 !== i && i) || jQuery(window).width() <= 600) &&
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
            var i = [],
              a = {};
            return (
              t.split("&").forEach(function (e) {
                (i = e.split("=")),
                  (a[i[0]] = decodeURIComponent(i[1]).replace(/\+/g, " "));
              }),
              a
            );
          }
        },
        getUrlParams: function (e) {
          var t = {};
          if (-1 !== e.indexOf("?")) {
            var i = [];
            e.split("?")[1]
              .split("&")
              .forEach(function (e) {
                (i = e.split("=")),
                  (t[i[0]] = decodeURIComponent(i[1]).replace(/\+/g, " "));
              });
          }
          return t;
        },
        removeURLParameter: function (e, t) {
          var i = e.split("?");
          if (i.length >= 2) {
            for (
              var a = encodeURIComponent(t) + "=",
                o = i[1].split(/[&;]/g),
                n = o.length;
              n-- > 0;

            )
              -1 !== o[n].lastIndexOf(a, 0) && o.splice(n, 1);
            return (e = i[0] + (o.length > 0 ? "?" + o.join("&") : ""));
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
  687: function (e, t, i) {
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
          var e = i(693);
          e.init({ svgSelector: "img.svg", initClass: "js-inlinesvg" });
        },
        inlineSVGCabinet: function () {
          setTimeout(function () {
            i(693).init({
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
            i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
            a = this.getNameInitials(e),
            o = Math.floor(Math.random() * this.colors.length),
            n = this.colors[o];
          return (
            this.usedColors.push(this.colors[o]),
            this.colors.splice(o, 1),
            0 === this.colors.length &&
              ((this.colors = this.usedColors), (this.usedColors = [])),
            i
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
            var i = !0 === t ? e.firstName + " " + e.lastName : e.name;
            if (void 0 !== i)
              return (
                (e.pictureThumbPath =
                  e.pictureThumbPath || this.imageFromText(i)),
                e.pictureThumbPath
              );
          }
        },
        imageLoadError: function (e, t) {
          var i = !0 === t ? e.firstName + " " + e.lastName : e.name;
          void 0 !== i && (e.pictureThumbPath = this.imageFromText(i, e, !0));
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
  688: function (e, t, i) {
    "use strict";
    var a = i(706),
      o = i(343),
      n = Object.prototype.toString;
    function s(e) {
      return "[object Array]" === n.call(e);
    }
    function r(e) {
      return null !== e && "object" == typeof e;
    }
    function l(e) {
      return "[object Function]" === n.call(e);
    }
    function c(e, t) {
      if (null !== e && void 0 !== e)
        if (("object" == typeof e || s(e) || (e = [e]), s(e)))
          for (var i = 0, a = e.length; i < a; i++) t.call(null, e[i], i, e);
        else
          for (var o in e)
            Object.prototype.hasOwnProperty.call(e, o) &&
              t.call(null, e[o], o, e);
    }
    e.exports = {
      isArray: s,
      isArrayBuffer: function (e) {
        return "[object ArrayBuffer]" === n.call(e);
      },
      isBuffer: o,
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
        return "[object Date]" === n.call(e);
      },
      isFile: function (e) {
        return "[object File]" === n.call(e);
      },
      isBlob: function (e) {
        return "[object Blob]" === n.call(e);
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
        function i(i, a) {
          "object" == typeof t[a] && "object" == typeof i
            ? (t[a] = e(t[a], i))
            : (t[a] = i);
        }
        for (var a = 0, o = arguments.length; a < o; a++) c(arguments[a], i);
        return t;
      },
      extend: function (e, t, i) {
        return (
          c(t, function (t, o) {
            e[o] = i && "function" == typeof t ? a(t, i) : t;
          }),
          e
        );
      },
      trim: function (e) {
        return e.replace(/^\s*/, "").replace(/\s*$/, "");
      },
    };
  },
  689: function (e, t, i) {
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
            i = this.getPriceNumberOfDecimalPlaces(),
            a = this.getPriceThousandSeparator(),
            o = this.getPriceDecimalSeparator(),
            n = this.getPricePrefix(),
            s = this.getPriceSuffix(),
            r = parseInt((e = Math.abs(+e || 0).toFixed(i))) + "",
            l = r.length > 3 ? r.length % 3 : 0;
          return (
            (t ? n : "") +
            (l ? r.substr(0, l) + a : "") +
            r.substr(l).replace(/(\d{3})(?=\d)/g, "$1" + a) +
            (i
              ? o +
                Math.abs(e - r)
                  .toFixed(i)
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
  690: function (e, t, i) {
    "use strict";
    var a = i(711);
    t.a = {
      mixins: [a.a],
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
          var i = this.getProviderById(e).serviceList.find(function (e) {
            return e.id === parseInt(t);
          });
          return i ? Object.assign(this.getServiceById(t), i) : null;
        },
        getServiceProviders: function (e, t) {
          var i = this;
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
                      return i.isEmployeeService(t.id, e.id);
                    })
                    .map(function (e) {
                      return e.id;
                    })
                    .indexOf(e)
                );
              });
        },
        getServiceLocations: function (e, t) {
          var i = this,
            a = [];
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
                a = i
                  .getProviderLocations(e.id, t)
                  .map(function (e) {
                    return e.id;
                  })
                  .concat(a);
              }),
            this.options.entities.locations.filter(function (e) {
              return -1 !== a.indexOf(e.id);
            })
          );
        },
        getProviderLocations: function (e, t) {
          var i = this,
            a = [this.getProviderById(e).locationId];
          if (e in this.options.entitiesRelations)
            for (var o in this.options.entitiesRelations[e])
              this.options.entitiesRelations[e].hasOwnProperty(o) &&
                (a = a.concat(this.options.entitiesRelations[e][o]));
          return (
            (a = a.filter(function (e, t, i) {
              return i.indexOf(e) === t;
            })),
            (void 0 !== t && t
              ? this.options.entities.locations
              : this.options.entities.locations.filter(function (t) {
                  return i.isEmployeeLocation(e, t.id);
                })
            ).filter(function (e) {
              return -1 !== a.indexOf(e.id);
            })
          );
        },
        getLocationProviders: function (e, t) {
          var i = this,
            a = [];
          return (
            this.options.entities.employees.forEach(function (o) {
              -1 !==
                (void 0 !== t && t
                  ? i.getProviderLocations(o.id).filter(function (e) {
                      return i.isEmployeeLocation(o.id, e.id);
                    })
                  : i.getProviderLocations(o.id)
                )
                  .map(function (e) {
                    return e.id;
                  })
                  .indexOf(e) && a.push(o.id);
            }),
            (a = a.filter(function (e, t, i) {
              return i.indexOf(e) === t;
            })),
            this.options.entities.employees.filter(function (e) {
              return -1 !== a.indexOf(e.id);
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
        isEmployeeServiceLocation: function (e, t, i) {
          return (
            e in this.options.entitiesRelations &&
            t in this.options.entitiesRelations[e] &&
            -1 !== this.options.entitiesRelations[e][t].indexOf(i)
          );
        },
        isEmployeeService: function (e, t) {
          return (
            e in this.options.entitiesRelations &&
            t in this.options.entitiesRelations[e]
          );
        },
        isEmployeeLocation: function (e, t) {
          var i = !1;
          if (e in this.options.entitiesRelations)
            for (var a in this.options.entitiesRelations[e])
              this.options.entitiesRelations[e].hasOwnProperty(a) &&
                -1 !== this.options.entitiesRelations[e][a].indexOf(t) &&
                (i = !0);
          return i;
        },
        getAvailableEntitiesIds: function (e, t) {
          var i = this,
            a = [],
            o = [],
            n = [],
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
            if (!i.options.entitiesRelations.hasOwnProperty(e))
              return "continue";
            var r = parseInt(e);
            if (
              (null !== t.employeeId && t.employeeId !== r) ||
              (null !== t.locationId &&
                !i.isEmployeeLocation(r, t.locationId)) ||
              (null !== t.serviceId && !i.isEmployeeService(r, t.serviceId)) ||
              (null !== t.categoryId &&
                0 ===
                  s.filter(function (e) {
                    return i.isEmployeeService(r, e);
                  }).length) ||
              (null !== t.categoryId &&
                null !== t.locationId &&
                0 ===
                  s.filter(function (e) {
                    return i.isEmployeeServiceLocation(r, e, t.locationId);
                  }).length) ||
              (null !== t.serviceId &&
                null !== t.locationId &&
                !i.isEmployeeServiceLocation(r, t.serviceId, t.locationId))
            )
              return "continue";
            for (var l in (-1 === o.indexOf(r) && o.push(r),
            i.options.entitiesRelations[r]))
              if (i.options.entitiesRelations[r].hasOwnProperty(l)) {
                var c = parseInt(l);
                (null !== t.serviceId && t.serviceId !== c) ||
                  (null !== t.categoryId && -1 === s.indexOf(c)) ||
                  (null !== t.locationId &&
                    !i.isEmployeeServiceLocation(r, c, t.locationId)) ||
                  (-1 === a.indexOf(c) && a.push(c),
                  i.options.entitiesRelations[r][c].length &&
                    i.options.entitiesRelations[r][c].forEach(function (e) {
                      (null !== t.locationId && t.locationId !== e) ||
                        (-1 === n.indexOf(e) && n.push(e));
                    }));
              }
          };
          for (var l in this.options.entitiesRelations) r(l);
          return {
            services: a,
            locations: n,
            employees: o,
            categories: e.categories
              .filter(function (e) {
                return (
                  e.serviceList
                    .map(function (e) {
                      return e.id;
                    })
                    .filter(function (e) {
                      return -1 !== a.indexOf(e);
                    }).length > 0
                );
              })
              .map(function (e) {
                return e.id;
              }),
          };
        },
        filterEntities: function (e, t) {
          var i = this,
            a = this.getAvailableEntitiesIds(e, t);
          if (
            ((this.options.entities.employees = e.employees.filter(function (
              e
            ) {
              return (
                -1 !== a.employees.indexOf(e.id) &&
                e.serviceList.filter(function (e) {
                  return -1 !== a.services.indexOf(e.id);
                }).length > 0
              );
            })),
            (this.options.entities.categories = e.categories),
            (this.options.entities.services = this.getServicesFromCategories(
              this.options.entities.categories
            ).filter(function (e) {
              return e.show && -1 !== a.services.indexOf(e.id);
            })),
            this.options.entities.services.forEach(function (e) {
              e.extras.forEach(function (e) {
                e.extraId = e.id;
              });
            }),
            (this.options.entities.locations = e.locations.filter(function (e) {
              return -1 !== a.locations.indexOf(e.id);
            })),
            (this.options.entities.customFields = e.customFields),
            "packages" in e && (!("show" in t) || "services" !== t.show))
          ) {
            var o = e.packages
                .filter(function (e) {
                  return "visible" === e.status;
                })
                .filter(function (e) {
                  return (
                    e.bookable.filter(function (e) {
                      return (
                        -1 !==
                        i.options.entities.services
                          .map(function (e) {
                            return e.id;
                          })
                          .indexOf(e.service.id)
                      );
                    }).length > 0
                  );
                }),
              n = this.options.entities.locations.map(function (e) {
                return e.id;
              }),
              s = this.options.entities.employees.map(function (e) {
                return e.id;
              }),
              r = [];
            if (
              (o.forEach(function (t) {
                var a = !1;
                t.bookable.forEach(function (o) {
                  ((0 === o.minimumScheduled && o.maximumScheduled > 0) ||
                    (o.minimumScheduled > 0 && 0 === o.maximumScheduled) ||
                    (o.minimumScheduled > 0 && o.maximumScheduled > 0)) &&
                    (a = !0);
                  var l = o.providers.length;
                  if (
                    !e.locations.length ||
                    i.options.entities.locations.length
                  ) {
                    var c = o.locations.length;
                    !l ||
                    ((o.providers = o.providers.filter(function (e) {
                      return -1 !== s.indexOf(e.id) && c
                        ? o.locations.filter(function (t) {
                            return i.isEmployeeServiceLocation(
                              e.id,
                              o.service.id,
                              t.id
                            );
                          }).length
                        : !i.options.entities.locations.length ||
                            i.options.entities.locations.filter(function (t) {
                              return i.isEmployeeServiceLocation(
                                e.id,
                                o.service.id,
                                t.id
                              );
                            }).length;
                    })),
                    o.providers.length)
                      ? c &&
                        ((o.locations = o.locations.filter(function (e) {
                          return (
                            -1 !== n.indexOf(e.id) &&
                            (l
                              ? o.providers.filter(function (t) {
                                  return i.isEmployeeServiceLocation(
                                    t.id,
                                    o.service.id,
                                    e.id
                                  );
                                }).length
                              : i.options.entities.employees.filter(function (
                                  t
                                ) {
                                  return i.isEmployeeServiceLocation(
                                    t.id,
                                    o.service.id,
                                    e.id
                                  );
                                }).length)
                          );
                        })),
                        o.locations.length || r.push(t.id))
                      : r.push(t.id);
                  } else r.push(t.id);
                }),
                  (t.hasSlots = a);
              }),
              (this.options.entities.packages = o.filter(function (e) {
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
          var i = this,
            a = { params: { types: t.types } };
          if (
            (t.page
              ? (a.params.page = t.page)
              : "isFrontEnd" in t &&
                t.isFrontEnd &&
                (a.params.page = "booking"),
            void 0 !== this.$store &&
              void 0 !== this.$store.state.cabinet &&
              "provider" === this.$store.state.cabinet.cabinetType &&
              ((a = Object.assign(a, this.getAuthorizationHeaderObject())),
              Object.assign(a.params, {
                source: "cabinet-" + this.$store.state.cabinet.cabinetType,
              })),
            t.isPanel || (this.$root.hasApiCall && !this.entitiesLoaded()))
          )
            this.$http
              .get(this.$root.getAjaxUrl + "/entities", a)
              .then(function (a) {
                (i.options.isFrontEnd = t.isFrontEnd),
                  (window.ameliaAppointmentEntities = JSON.parse(
                    JSON.stringify(a.data.data)
                  )),
                  i.fillCachedEntities(window.ameliaAppointmentEntities),
                  i.processEntities(window.ameliaAppointmentEntities),
                  i.$root.useTranslations &&
                    i.translateEntities(window.ameliaAppointmentEntities);
                e(!0);
              })
              .catch(function (t) {
                console.log(t);
                e(!1);
              });
          else
            var o = setInterval(function () {
              if (i.entitiesLoaded()) {
                if (
                  (clearInterval(o),
                  (i.options.isFrontEnd = t.isFrontEnd),
                  "ameliaEntities" in window)
                ) {
                  var a = JSON.parse(JSON.stringify(window.ameliaEntities));
                  i.fillCachedEntities(a),
                    i.processEntities(a),
                    i.$root.useTranslations && i.translateEntities(a);
                } else {
                  var n = JSON.parse(
                    JSON.stringify(window.ameliaAppointmentEntities)
                  );
                  i.fillCachedEntities(n), i.processEntities(n);
                }
                e(!0);
              }
            }, 1e3);
        },
        getFilteredEntities: function (e, t, i) {
          var a = this,
            o =
              this.appointment && this.appointment.id && this.appointment[i]
                ? this.appointment[i]
                : null;
          return (
            this.options.entities[t].forEach(function (t) {
              t.disabled = -1 === e.indexOf(t.id);
            }),
            this.options.entities[t].filter(function (e) {
              return (
                -1 !== a.options.availableEntitiesIds[t].indexOf(e.id) ||
                (null !== o && o === e.id)
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
                t.serviceList.filter(function (i) {
                  return (
                    "visible" === i.status &&
                    (!e.appointment.serviceId ||
                      (e.isEmployeeService(t.id, i.id) &&
                        i.id === e.appointment.serviceId)) &&
                    (!e.appointment.locationId ||
                      e.isEmployeeServiceLocation(
                        t.id,
                        i.id,
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
            var i = this.employeesFiltered.find(function (t) {
              return t.id === e.appointment.providerId;
            });
            t =
              void 0 !== i
                ? i.serviceList
                    .filter(function (e) {
                      return "visible" === e.status;
                    })
                    .map(function (e) {
                      return e.id;
                    })
                : [];
          }
          var a = this.visibleServices.filter(function (i) {
            return !(
              (e.appointment.providerId && -1 === t.indexOf(i.id)) ||
              (e.appointment.locationId &&
                !(
                  e.employeesFiltered.filter(function (t) {
                    return e.isEmployeeServiceLocation(
                      t.id,
                      i.id,
                      e.appointment.locationId
                    );
                  }).length > 0
                )) ||
              (e.appointment.categoryId &&
                i.categoryId !== e.appointment.categoryId)
            );
          });
          return this.options.isFrontEnd
            ? a
            : this.getFilteredEntities(
                a.map(function (e) {
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
            var i = this.employeesFiltered.find(function (t) {
              return t.id === e.appointment.providerId;
            });
            t =
              void 0 !== i
                ? i.serviceList.filter(function (e) {
                    return "visible" === e.status;
                  })
                : [];
          }
          var a = null;
          this.appointment.categoryId &&
            (a = this.categoriesFiltered.find(function (t) {
              return t.id === e.appointment.categoryId;
            }));
          var o = this.visibleLocations.filter(function (i) {
            return (
              (!e.appointment.providerId ||
                t.filter(function (t) {
                  return e.isEmployeeServiceLocation(
                    e.appointment.providerId,
                    t.id,
                    i.id
                  );
                }).length > 0) &&
              (!e.appointment.serviceId ||
                e.employeesFiltered.filter(function (t) {
                  return e.isEmployeeServiceLocation(
                    t.id,
                    e.appointment.serviceId,
                    i.id
                  );
                }).length > 0) &&
              (!e.appointment.categoryId ||
                (void 0 !== a &&
                  e.employeesFiltered.filter(function (t) {
                    return (
                      t.serviceList.filter(function (o) {
                        return (
                          "visible" === o.status &&
                          o.categoryId === a.id &&
                          e.isEmployeeServiceLocation(t.id, o.id, i.id)
                        );
                      }).length > 0
                    );
                  }).length > 0))
            );
          });
          return this.options.isFrontEnd
            ? o
            : this.getFilteredEntities(
                o.map(function (e) {
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
          var i = null;
          this.appointment.serviceId &&
            (i = this.servicesFiltered.find(function (t) {
              return t.id === e.appointment.serviceId;
            }));
          var a = this.options.entities.categories.filter(function (a) {
            return (
              (!e.appointment.serviceId ||
                (void 0 !== i && i.categoryId === a.id)) &&
              (!e.appointment.locationId ||
                a.serviceList.filter(function (t) {
                  return (
                    "visible" === t.status &&
                    e.employeesFiltered.filter(function (i) {
                      return e.isEmployeeServiceLocation(
                        i.id,
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
                      .indexOf(a.id)))
            );
          });
          return this.options.isFrontEnd
            ? a
            : this.getFilteredEntities(
                a.map(function (e) {
                  return e.id;
                }),
                "categories",
                "categoryId"
              );
        },
      },
    };
  },
  691: function (e, t, i) {
    "use strict";
    t.a = {
      methods: {
        notify: function (e, t, i, a) {
          var o = this;
          void 0 === a && (a = ""),
            setTimeout(function () {
              o.$notify({
                customClass: a,
                title: e,
                message: t,
                type: i,
                offset: 50,
              });
            }, 700);
        },
      },
    };
  },
  692: function (e, t, i) {
    "use strict";
    var a = i(0),
      o = i.n(a);
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
          return o.a.duration(o()(t).diff(o()(e)));
        },
        convertSecondsToMomentDuration: function (e) {
          return o.a.duration(e, "seconds");
        },
        momentDurationToNiceDurationWithUnit: function (e) {
          var t = Math.floor(e.asMinutes() / 60),
            i = e.asMinutes() % 60;
          return (
            (t ? t + this.$root.labels.h + " " : "") +
            " " +
            (i ? i + this.$root.labels.min : "")
          );
        },
        secondsToNiceDuration: function (e) {
          var t = Math.floor(e / 3600),
            i = (e / 60) % 60;
          return (
            (t ? t + this.$root.labels.h + " " : "") +
            " " +
            (i ? i + this.$root.labels.min : "")
          );
        },
        secondsToTimeSelectStep: function (e) {
          var t = Math.floor(e / 3600),
            i = Math.floor(e / 60) - 60 * t;
          return e < 0
            ? (t || "00") + ":" + ((i < 9 ? "0" + i : i) || "00")
            : ((t <= 9 ? "0" + t : t) || "00") +
                ":" +
                ((i <= 9 ? "0" + i : i) || "00");
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
              i = [],
              a = this.getTimeSlotLength();
            a <= t;
            a += this.getTimeSlotLength()
          )
            i.push(a);
          return (
            e &&
              -1 === i.indexOf(e) &&
              (i.push(e),
              i.sort(function (e, t) {
                return e - t;
              })),
            i
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
          return o()(e, "HH:mm").diff(o()().startOf("day"), "seconds");
        },
      },
    };
  },
  693: function (e, t, i) {
    (function (i) {
      var a, o, n, s;
      (s = void 0 !== i ? i : this.window || this.global),
        (o = []),
        (a = (function (e) {
          var t,
            i = {},
            a = !!document.querySelector && !!e.addEventListener,
            o = { initClass: "js-inlinesvg", svgSelector: "img.svg" },
            n = function () {
              var e = {},
                t = !1,
                i = 0,
                a = arguments.length;
              "[object Boolean]" ===
                Object.prototype.toString.call(arguments[0]) &&
                ((t = arguments[0]), i++);
              for (
                var o = function (i) {
                  for (var a in i)
                    Object.prototype.hasOwnProperty.call(i, a) &&
                      (t &&
                      "[object Object]" === Object.prototype.toString.call(i[a])
                        ? (e[a] = n(!0, e[a], i[a]))
                        : (e[a] = i[a]));
                };
                a > i;
                i++
              ) {
                o(arguments[i]);
              }
              return e;
            },
            s = function (e) {
              var i = document.querySelectorAll(t.svgSelector),
                a = (function (e, t) {
                  return function () {
                    return --e < 1 ? t.apply(this, arguments) : void 0;
                  };
                })(i.length, e);
              Array.prototype.forEach.call(i, function (e, i) {
                var o = e.src || e.getAttribute("data-src"),
                  n = e.attributes,
                  s = new XMLHttpRequest();
                s.open("GET", o, !0),
                  (s.onload = function () {
                    if (s.status >= 200 && s.status < 400) {
                      var i = new DOMParser()
                        .parseFromString(s.responseText, "text/xml")
                        .getElementsByTagName("svg")[0];
                      if (
                        (i.removeAttribute("xmlns:a"),
                        i.removeAttribute("width"),
                        i.removeAttribute("height"),
                        i.removeAttribute("x"),
                        i.removeAttribute("y"),
                        i.removeAttribute("enable-background"),
                        i.removeAttribute("xmlns:xlink"),
                        i.removeAttribute("xml:space"),
                        i.removeAttribute("version"),
                        Array.prototype.slice.call(n).forEach(function (e) {
                          "src" !== e.name &&
                            "alt" !== e.name &&
                            i.setAttribute(e.name, e.value);
                        }),
                        i.classList
                          ? i.classList.add("inlined-svg")
                          : (i.className += " inlined-svg"),
                        i.setAttribute("role", "img"),
                        n.longdesc)
                      ) {
                        var o = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "desc"
                          ),
                          r = document.createTextNode(n.longdesc.value);
                        o.appendChild(r), i.insertBefore(o, i.firstChild);
                      }
                      if (n.alt) {
                        i.setAttribute("aria-labelledby", "title");
                        var l = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "title"
                          ),
                          c = document.createTextNode(n.alt.value);
                        l.appendChild(c), i.insertBefore(l, i.firstChild);
                      }
                      e.parentNode.replaceChild(i, e), a(t.svgSelector);
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
            (i.init = function (e, i) {
              a &&
                ((t = n(o, e || {})),
                s(i || function () {}),
                (document.documentElement.className += " " + t.initClass));
            }),
            i
          );
        })(s)),
        void 0 === (n = "function" == typeof a ? a.apply(t, o) : a) ||
          (e.exports = n);
    }.call(t, i(39)));
  },
  694: function (e, t, i) {
    "use strict";
    t.a = {
      data: function () {
        return {};
      },
      methods: {
        isCustomFieldVisible: function (e, t, i) {
          switch (t) {
            case "appointment":
              return (
                -1 !==
                e.services
                  .map(function (e) {
                    return e.id;
                  })
                  .indexOf(i)
              );
            case "event":
              return (
                -1 !==
                e.events
                  .map(function (e) {
                    return e.id;
                  })
                  .indexOf(i)
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
                  var i = "";
                  "checkbox" === this.options.entities.customFields[t].type &&
                    (i = []),
                    "datepicker" ===
                      this.options.entities.customFields[t].type && (i = null),
                    this.$set(
                      this.appointment.bookings[e].customFields,
                      this.options.entities.customFields[t].id,
                      {
                        label: this.options.entities.customFields[t].label,
                        value: i,
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
        getCustomFieldFileURL: function (e, t, i) {
          return (
            this.$root.getAjaxUrl +
            "/fields/" +
            e +
            "/" +
            t +
            "/" +
            i +
            "&source=cabinet-provider"
          );
        },
      },
    };
  },
  695: function (e, t, i) {
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
  696: function (e, t, i) {
    var a = i(685)(i(703), i(704), !1, null, null, null);
    e.exports = a.exports;
  },
  697: function (e, t, i) {
    "use strict";
    (function (t) {
      var a = i(688),
        o = i(724),
        n = { "Content-Type": "application/x-www-form-urlencoded" };
      function s(e, t) {
        !a.isUndefined(e) &&
          a.isUndefined(e["Content-Type"]) &&
          (e["Content-Type"] = t);
      }
      var r,
        l = {
          adapter:
            ("undefined" != typeof XMLHttpRequest
              ? (r = i(707))
              : void 0 !== t && (r = i(707)),
            r),
          transformRequest: [
            function (e, t) {
              return (
                o(t, "Content-Type"),
                a.isFormData(e) ||
                a.isArrayBuffer(e) ||
                a.isBuffer(e) ||
                a.isStream(e) ||
                a.isFile(e) ||
                a.isBlob(e)
                  ? e
                  : a.isArrayBufferView(e)
                  ? e.buffer
                  : a.isURLSearchParams(e)
                  ? (s(t, "application/x-www-form-urlencoded;charset=utf-8"),
                    e.toString())
                  : a.isObject(e)
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
        a.forEach(["delete", "get", "head"], function (e) {
          l.headers[e] = {};
        }),
        a.forEach(["post", "put", "patch"], function (e) {
          l.headers[e] = a.merge(n);
        }),
        (e.exports = l);
    }.call(t, i(142)));
  },
  699: function (e, t, i) {
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
            i = this.$root.settings.customization.forms
              ? this.$root.settings.customization.forms
              : this.defaultFormsData,
            a = window.localeLanguage[0];
          return (
            Object.keys(i[e]).forEach(function (o) {
              "labels" in i[e][o]
                ? t.getTranslatedLabels(i[e][o], a)
                : "confirmBookingForm" !== o &&
                  "globalSettings" !== o &&
                  "congratulationsForm" !== o
                ? (i[e][o] = t.getTranslatedFormScreen(i[e][o], e, o, a))
                : ("confirmBookingForm" !== o && "congratulationsForm" !== o) ||
                  Object.keys(i[e][o]).forEach(function (n) {
                    i[e][o][n] = t.getTranslatedFormScreen(i[e][o][n], e, o, a);
                  });
            }),
            i
          );
        },
        getTranslatedFormScreen: function (e, t, i, a) {
          var o = this;
          return (
            ["itemsDraggable", "itemsStatic"].forEach(function (t) {
              t in e &&
                Object.keys(e[t]).forEach(function (i) {
                  o.getTranslatedLabels(e[t][i], a);
                });
            }),
            e
          );
        },
        getTranslatedLabels: function (e, t) {
          "labels" in e &&
            Object.keys(e.labels).forEach(function (i) {
              "translations" in e.labels[i] &&
                t in e.labels[i].translations &&
                (e.labels[i].value = e.labels[i].translations[t]);
            });
        },
        rgbaToHex: function (e) {
          if (e.indexOf("#") < 0) {
            var t = e.indexOf(",") > -1 ? "," : " ";
            for (var i in ((e = e.substr(5).split(")")[0].split(t)).indexOf(
              "/"
            ) > -1 && e.splice(3, 1),
            e)) {
              var a = e[i];
              if (a.indexOf("%") > -1) {
                var o = a.substr(0, a.length - 1) / 100;
                e[i] = i < 3 ? Math.round(255 * o) : o;
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
  700: function (e, t, i) {
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
  701: function (e, t, i) {
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
  702: function (e, t, i) {
    "use strict";
    var a = (function () {
        function e(e, t) {
          for (var i = 0; i < t.length; i++) {
            var a = t[i];
            (a.enumerable = a.enumerable || !1),
              (a.configurable = !0),
              "value" in a && (a.writable = !0),
              Object.defineProperty(e, a.key, a);
          }
        }
        return function (t, i, a) {
          return i && e(t.prototype, i), a && e(t, a), t;
        };
      })(),
      o = r(i(721)),
      n = r(i(739)),
      s = r(i(740));
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
          (this.errors = new n.default()),
          ["post", "patch", "put", "delete"].forEach(function (e) {
            t[e] = function (i, a) {
              return t.submit(e, i, a);
            };
          });
      }
      return (
        a(e, [
          {
            key: "submit",
            value: function (t, i) {
              var a = this,
                o =
                  arguments.length > 2 && void 0 !== arguments[2]
                    ? arguments[2]
                    : {};
              return (
                (t = t.toLowerCase()),
                this.hasFiles(o) &&
                  ((o = (0, s.default)(o)),
                  "post" !== t &&
                    (o.append("_method", t.toUpperCase()), (t = "post"))),
                (this.progress = 0),
                this.errors.clear(),
                (this.isPending = !0),
                new Promise(function (n, s) {
                  e.defaults.axios[t](i, o, a.config())
                    .then(function (e) {
                      n(e.data);
                    })
                    .catch(function (e) {
                      a.handleError(e), s(e);
                    })
                    .then(function () {
                      return (a.isPending = !1);
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
              var i = "post";
              return (
                t.hasOwnProperty("id") &&
                  ((i = "patch"), (e = this.urlToPatchResource(e, t))),
                this[i](e, t)
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
    (l.defaults = { axios: o.default }), (e.exports = l);
  },
  703: function (e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = i(700);
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
          var i = this.input;
          if (
            ("ar" === window.localeLanguage[0] &&
              (i = i.replace(/[٠-٩]/g, function (e) {
                return "٠١٢٣٤٥٦٧٨٩".indexOf(e);
              })),
            "" !== i)
          ) {
            if (i.startsWith("+")) {
              var a = parseInt(i.slice(1)),
                o = this.countries.filter(function (e) {
                  return e.phonecode === a;
                });
              if (o.length) {
                var n = null;
                1 === a
                  ? (n = o.find(function (e) {
                      return 229 === e.id;
                    }))
                  : 44 === a
                  ? (n = o.find(function (e) {
                      return 228 === e.id;
                    }))
                  : 7 === a &&
                    (n = o.find(function (e) {
                      return 176 === e.id;
                    })),
                  (void 0 !== n && null !== n) || (n = o[0]),
                  (this.value = n.iso);
              }
              this.phone = i;
            } else
              this.phone =
                void 0 !== t
                  ? !0 === i.startsWith("0")
                    ? "+" + t.phonecode + i.slice(1).replace(/\D/g, "")
                    : "+" + t.phonecode + i.replace(/\D/g, "")
                  : i;
            this.$emit("phoneFormatted", this.phone, this.value);
          } else
            (this.phone = i),
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
          for (var i = 1; null === t && i < 5; )
            (t =
              void 0 !==
              (t = this.countries.find(function (t) {
                return (
                  t.phonecode === parseInt(e.savedPhone.substr(1, i)) &&
                  1 === t.priority
                );
              }))
                ? t
                : null),
              i++;
          if (!t)
            for (i = 1; null === t && i < 5; )
              (t =
                void 0 !==
                (t = this.countries.find(function (t) {
                  return t.phonecode === parseInt(e.savedPhone.substr(1, i));
                }))
                  ? t
                  : null),
                i++;
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
          i = e._self._c || t;
        return i(
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
            i(
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
                return i(
                  "el-option",
                  { key: t.id, attrs: { value: t.iso, label: " " } },
                  [
                    i("span", { class: "am-flag am-flag-" + t.iso }),
                    e._v(" "),
                    i("span", { staticClass: "am-phone-input-nicename" }, [
                      e._v(e._s(t.nicename)),
                    ]),
                    e._v(" "),
                    i("span", { staticClass: "am-phone-input-phonecode" }, [
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
  705: function (e, t, i) {
    "use strict";
    var a = i(0),
      o = i.n(a);
    t.a = {
      data: function () {
        return { recurringDates: [] };
      },
      methods: {
        getRecurringAppointmentsData: function () {
          var e = this,
            t = [];
          return (
            this.recurringData.dates.forEach(function (i) {
              var a = e.getProviderService(
                i.providerId,
                e.appointment.serviceId
              );
              t.push({
                providerId: i.providerId,
                locationId: i.locationId,
                bookingStart: o()(i.date).format("YYYY-MM-DD") + " " + i.slot,
                price: a.price,
                depositData:
                  "disabled" !== a.depositPayment
                    ? {
                        deposit: a.deposit,
                        depositPayment: a.depositPayment,
                        depositPerPerson: a.depositPerPerson,
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
        getDefaultRecurringSettings: function (e, t, i) {
          var a = this.getAvailableRecurringDates(i),
            n = "all" === t ? "daily" : t,
            s = "",
            r = o()(e, "YYYY-MM-DD"),
            l = r.format("D");
          switch (n) {
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
            cycle: n,
            maxDate: o()(e, "YYYY-MM-DD HH:mm").add(1, "days").toDate(),
            maxCount: 1,
            selectedWeekDayIndex: r.isoWeekday() - 1,
            calendarDates: a,
            cycleInterval: 1,
            weekDaysSelected: [],
            repeatIntervalLabels: this.getRepeatIntervalLabels(
              this.$root.labels["recurring_" + s],
              this.$root.labels["recurring_" + s + "s"],
              o()(a[a.length - 1]).diff(r, "days")
            ),
          };
        },
        getAvailableRecurringDates: function (e) {
          var t = [];
          return (
            Object.keys(e).forEach(function (e) {
              t.push(o()(e + " 00:00:00"));
            }),
            t
          );
        },
        getRepeatIntervalLabels: function (e, t, i) {
          for (var a = [], o = 0; o < i; o++)
            a.push({ label: 0 === o ? e : o + 1 + " " + t, value: o + 1 });
          return a;
        },
      },
    };
  },
  706: function (e, t, i) {
    "use strict";
    e.exports = function (e, t) {
      return function () {
        for (var i = new Array(arguments.length), a = 0; a < i.length; a++)
          i[a] = arguments[a];
        return e.apply(t, i);
      };
    };
  },
  707: function (e, t, i) {
    "use strict";
    var a = i(688),
      o = i(725),
      n = i(727),
      s = i(728),
      r = i(729),
      l = i(708),
      c =
        ("undefined" != typeof window &&
          window.btoa &&
          window.btoa.bind(window)) ||
        i(730);
    e.exports = function (e) {
      return new Promise(function (t, u) {
        var m = e.data,
          d = e.headers;
        a.isFormData(m) && delete d["Content-Type"];
        var p = new XMLHttpRequest(),
          f = "onreadystatechange",
          h = !1;
        if (
          ("undefined" == typeof window ||
            !window.XDomainRequest ||
            "withCredentials" in p ||
            r(e.url) ||
            ((p = new window.XDomainRequest()),
            (f = "onload"),
            (h = !0),
            (p.onprogress = function () {}),
            (p.ontimeout = function () {})),
          e.auth)
        ) {
          var g = e.auth.username || "",
            v = e.auth.password || "";
          d.Authorization = "Basic " + c(g + ":" + v);
        }
        if (
          (p.open(
            e.method.toUpperCase(),
            n(e.url, e.params, e.paramsSerializer),
            !0
          ),
          (p.timeout = e.timeout),
          (p[f] = function () {
            if (
              p &&
              (4 === p.readyState || h) &&
              (0 !== p.status ||
                (p.responseURL && 0 === p.responseURL.indexOf("file:")))
            ) {
              var i =
                  "getAllResponseHeaders" in p
                    ? s(p.getAllResponseHeaders())
                    : null,
                a = {
                  data:
                    e.responseType && "text" !== e.responseType
                      ? p.response
                      : p.responseText,
                  status: 1223 === p.status ? 204 : p.status,
                  statusText: 1223 === p.status ? "No Content" : p.statusText,
                  headers: i,
                  config: e,
                  request: p,
                };
              o(t, u, a), (p = null);
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
          a.isStandardBrowserEnv())
        ) {
          var b = i(731),
            y =
              (e.withCredentials || r(e.url)) && e.xsrfCookieName
                ? b.read(e.xsrfCookieName)
                : void 0;
          y && (d[e.xsrfHeaderName] = y);
        }
        if (
          ("setRequestHeader" in p &&
            a.forEach(d, function (e, t) {
              void 0 === m && "content-type" === t.toLowerCase()
                ? delete d[t]
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
          void 0 === m && (m = null),
          p.send(m);
      });
    };
  },
  708: function (e, t, i) {
    "use strict";
    var a = i(726);
    e.exports = function (e, t, i, o, n) {
      var s = new Error(e);
      return a(s, t, i, o, n);
    };
  },
  709: function (e, t, i) {
    "use strict";
    e.exports = function (e) {
      return !(!e || !e.__CANCEL__);
    };
  },
  710: function (e, t, i) {
    "use strict";
    function a(e) {
      this.message = e;
    }
    (a.prototype.toString = function () {
      return "Cancel" + (this.message ? ": " + this.message : "");
    }),
      (a.prototype.__CANCEL__ = !0),
      (e.exports = a);
  },
  711: function (e, t, i) {
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
  713: function (e, t, i) {
    var a = i(685)(i(744), i(745), !1, null, null, null);
    e.exports = a.exports;
  },
  717: function (e, t, i) {
    var a = i(685)(i(718), i(719), !1, null, null, null);
    e.exports = a.exports;
  },
  718: function (e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = i(337);
    t.default = {
      mixins: [a.a],
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
          i = e._self._c || t;
        return i(
          "div",
          { staticClass: "am-page-header am-section" },
          [
            i(
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
                i(
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
                    i("div", { staticClass: "am-logo" }, [
                      i("img", {
                        staticClass: "logo-big",
                        attrs: {
                          width: "92",
                          src:
                            e.$root.getUrl +
                            "public/img/amelia-logo-horizontal.svg",
                        },
                      }),
                      e._v(" "),
                      i("img", {
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
                    i("h1", { staticClass: "am-page-title" }, [
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
                        ? i(
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
                        ? i(
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
                        ? i("span", [
                            i("span", { staticClass: "total-number" }, [
                              e._v(e._s(e.employeesTotal)),
                            ]),
                            e._v(
                              " " + e._s(e.$root.labels.total) + "\n        "
                            ),
                          ])
                        : e._e(),
                      e._v(" "),
                      e.customersTotal >= 0
                        ? i("span", [
                            i("span", { staticClass: "total-number" }, [
                              e._v(e._s(e.customersTotal)),
                            ]),
                            e._v(
                              " " + e._s(e.$root.labels.total) + "\n        "
                            ),
                          ])
                        : e._e(),
                      e._v(" "),
                      e.locationsTotal >= 0
                        ? i("span", [
                            i("span", { staticClass: "total-number" }, [
                              e._v(e._s(e.locationsTotal)),
                            ]),
                            e._v(
                              " " + e._s(e.$root.labels.total) + "\n        "
                            ),
                          ])
                        : e._e(),
                      e._v(" "),
                      e.servicesTotal >= 0 && "services" === e.bookableType
                        ? i("span", [
                            i("span", { staticClass: "total-number" }, [
                              e._v(e._s(e.servicesTotal)),
                            ]),
                            e._v(
                              " " + e._s(e.$root.labels.total) + "\n        "
                            ),
                          ])
                        : e._e(),
                      e._v(" "),
                      e.packagesTotal >= 0 && "packages" === e.bookableType
                        ? i("span", [
                            i("span", { staticClass: "total-number" }, [
                              e._v(e._s(e.packagesTotal)),
                            ]),
                            e._v(
                              " " + e._s(e.$root.labels.total) + "\n        "
                            ),
                          ])
                        : e._e(),
                      e._v(" "),
                      e.financeTotal >= 0
                        ? i("span", [
                            i("span", { staticClass: "total-number" }, [
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
                i(
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
                      ? i(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogAppointment },
                          },
                          [
                            i("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            i("span", { staticClass: "button-text" }, [
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
                      ? i(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogEvent },
                          },
                          [
                            i("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            i("span", { staticClass: "button-text" }, [
                              e._v(e._s(e.$root.labels.new_event)),
                            ]),
                          ]
                        )
                      : e._e(),
                    e._v(" "),
                    "wpamelia-employees" === e.$router.currentRoute.name &&
                    !0 === e.$root.settings.capabilities.canWrite &&
                    !0 === e.$root.settings.capabilities.canWriteOthers
                      ? i(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogEmployee },
                          },
                          [
                            i("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            i("span", { staticClass: "button-text" }, [
                              e._v(e._s(e.$root.labels.add_employee)),
                            ]),
                          ]
                        )
                      : e._e(),
                    e._v(" "),
                    "wpamelia-customers" === e.$router.currentRoute.name &&
                    !0 === e.$root.settings.capabilities.canWrite
                      ? i(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogCustomer },
                          },
                          [
                            i("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            i("span", { staticClass: "button-text" }, [
                              e._v(e._s(e.$root.labels.add_customer)),
                            ]),
                          ]
                        )
                      : e._e(),
                    e._v(" "),
                    "wpamelia-locations" === e.$router.currentRoute.name &&
                    !0 === e.$root.settings.capabilities.canWrite
                      ? i(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogLocation },
                          },
                          [
                            i("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            i("span", { staticClass: "button-text" }, [
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
                      ? i(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogService },
                          },
                          [
                            i("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            i("span", { staticClass: "button-text" }, [
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
                      ? i(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogPackage },
                          },
                          [
                            i("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            i("span", { staticClass: "button-text" }, [
                              e._v(e._s(e.$root.labels.add_package)),
                            ]),
                          ]
                        )
                      : e._e(),
                    e._v(" "),
                    i(
                      "transition",
                      { attrs: { name: "fade" } },
                      [
                        "wpamelia-finance" === e.$router.currentRoute.name &&
                        e.addNewCouponBtnDisplay &&
                        !0 === e.$root.settings.capabilities.canWrite
                          ? i(
                              "el-button",
                              {
                                staticClass: "am-dialog-create",
                                attrs: { type: "primary" },
                                on: { click: e.showDialogCoupon },
                              },
                              [
                                i("i", { staticClass: "el-icon-plus" }),
                                e._v(" "),
                                i("span", { staticClass: "button-text" }, [
                                  e._v(e._s(e.$root.labels.new_coupon)),
                                ]),
                              ]
                            )
                          : e._e(),
                      ],
                      1
                    ),
                    e._v(" "),
                    i(
                      "transition",
                      { attrs: { name: "fade" } },
                      [
                        "wpamelia-customize" === e.$router.currentRoute.name &&
                        e.addNewCustomFieldBtnDisplay &&
                        !0 === e.$root.settings.capabilities.canWrite
                          ? i(
                              "el-button",
                              {
                                staticClass: "am-dialog-create",
                                attrs: { type: "primary" },
                                on: { click: e.showDialogCustomFields },
                              },
                              [
                                i("i", { staticClass: "el-icon-plus" }),
                                e._v(" "),
                                i("span", { staticClass: "button-text" }, [
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
                      ? i("div", { staticClass: "v-calendar-column" }, [
                          i(
                            "div",
                            { staticClass: "el-form-item__content" },
                            [
                              i("v-date-picker", {
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
                      ? i(
                          "div",
                          { staticClass: "am-calendar-header-filters" },
                          [
                            i(
                              "el-form",
                              {
                                staticClass: "demo-form-inline",
                                attrs: { inline: !0 },
                              },
                              [
                                i(
                                  "el-form-item",
                                  {
                                    attrs: {
                                      label: e.$root.labels.services + ":",
                                    },
                                  },
                                  [
                                    i(
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
                                        return i(
                                          "div",
                                          { key: t.id },
                                          [
                                            i(
                                              "div",
                                              {
                                                staticClass: "am-drop-parent",
                                                on: {
                                                  click: function (i) {
                                                    return e.selectAllInCategory(
                                                      t.id
                                                    );
                                                  },
                                                },
                                              },
                                              [i("span", [e._v(e._s(t.name))])]
                                            ),
                                            e._v(" "),
                                            e._l(t.serviceList, function (e) {
                                              return i("el-option", {
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
                                i(
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
                                    i(
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
                                        return i("el-option", {
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
                              ? i(
                                  "el-button",
                                  {
                                    staticClass: "am-dialog-create",
                                    attrs: { type: "primary" },
                                    on: { click: e.showDialogAppointment },
                                  },
                                  [
                                    i("i", { staticClass: "el-icon-plus" }),
                                    e._v(" "),
                                    i("span", { staticClass: "button-text" }, [
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
  721: function (e, t, i) {
    e.exports = i(722);
  },
  722: function (e, t, i) {
    "use strict";
    var a = i(688),
      o = i(706),
      n = i(723),
      s = i(697);
    function r(e) {
      var t = new n(e),
        i = o(n.prototype.request, t);
      return a.extend(i, n.prototype, t), a.extend(i, t), i;
    }
    var l = r(s);
    (l.Axios = n),
      (l.create = function (e) {
        return r(a.merge(s, e));
      }),
      (l.Cancel = i(710)),
      (l.CancelToken = i(737)),
      (l.isCancel = i(709)),
      (l.all = function (e) {
        return Promise.all(e);
      }),
      (l.spread = i(738)),
      (e.exports = l),
      (e.exports.default = l);
  },
  723: function (e, t, i) {
    "use strict";
    var a = i(697),
      o = i(688),
      n = i(732),
      s = i(733),
      r = i(735),
      l = i(736);
    function c(e) {
      (this.defaults = e),
        (this.interceptors = { request: new n(), response: new n() });
    }
    (c.prototype.request = function (e) {
      "string" == typeof e &&
        (e = o.merge({ url: arguments[0] }, arguments[1])),
        ((e = o.merge(a, this.defaults, { method: "get" }, e)).method =
          e.method.toLowerCase()),
        e.baseURL && !r(e.url) && (e.url = l(e.baseURL, e.url));
      var t = [s, void 0],
        i = Promise.resolve(e);
      for (
        this.interceptors.request.forEach(function (e) {
          t.unshift(e.fulfilled, e.rejected);
        }),
          this.interceptors.response.forEach(function (e) {
            t.push(e.fulfilled, e.rejected);
          });
        t.length;

      )
        i = i.then(t.shift(), t.shift());
      return i;
    }),
      o.forEach(["delete", "get", "head", "options"], function (e) {
        c.prototype[e] = function (t, i) {
          return this.request(o.merge(i || {}, { method: e, url: t }));
        };
      }),
      o.forEach(["post", "put", "patch"], function (e) {
        c.prototype[e] = function (t, i, a) {
          return this.request(o.merge(a || {}, { method: e, url: t, data: i }));
        };
      }),
      (e.exports = c);
  },
  724: function (e, t, i) {
    "use strict";
    var a = i(688);
    e.exports = function (e, t) {
      a.forEach(e, function (i, a) {
        a !== t &&
          a.toUpperCase() === t.toUpperCase() &&
          ((e[t] = i), delete e[a]);
      });
    };
  },
  725: function (e, t, i) {
    "use strict";
    var a = i(708);
    e.exports = function (e, t, i) {
      var o = i.config.validateStatus;
      i.status && o && !o(i.status)
        ? t(
            a(
              "Request failed with status code " + i.status,
              i.config,
              null,
              i.request,
              i
            )
          )
        : e(i);
    };
  },
  726: function (e, t, i) {
    "use strict";
    e.exports = function (e, t, i, a, o) {
      return (
        (e.config = t), i && (e.code = i), (e.request = a), (e.response = o), e
      );
    };
  },
  727: function (e, t, i) {
    "use strict";
    var a = i(688);
    function o(e) {
      return encodeURIComponent(e)
        .replace(/%40/gi, "@")
        .replace(/%3A/gi, ":")
        .replace(/%24/g, "$")
        .replace(/%2C/gi, ",")
        .replace(/%20/g, "+")
        .replace(/%5B/gi, "[")
        .replace(/%5D/gi, "]");
    }
    e.exports = function (e, t, i) {
      if (!t) return e;
      var n;
      if (i) n = i(t);
      else if (a.isURLSearchParams(t)) n = t.toString();
      else {
        var s = [];
        a.forEach(t, function (e, t) {
          null !== e &&
            void 0 !== e &&
            (a.isArray(e) && (t += "[]"),
            a.isArray(e) || (e = [e]),
            a.forEach(e, function (e) {
              a.isDate(e)
                ? (e = e.toISOString())
                : a.isObject(e) && (e = JSON.stringify(e)),
                s.push(o(t) + "=" + o(e));
            }));
        }),
          (n = s.join("&"));
      }
      return n && (e += (-1 === e.indexOf("?") ? "?" : "&") + n), e;
    };
  },
  728: function (e, t, i) {
    "use strict";
    var a = i(688);
    e.exports = function (e) {
      var t,
        i,
        o,
        n = {};
      return e
        ? (a.forEach(e.split("\n"), function (e) {
            (o = e.indexOf(":")),
              (t = a.trim(e.substr(0, o)).toLowerCase()),
              (i = a.trim(e.substr(o + 1))),
              t && (n[t] = n[t] ? n[t] + ", " + i : i);
          }),
          n)
        : n;
    };
  },
  729: function (e, t, i) {
    "use strict";
    var a = i(688);
    e.exports = a.isStandardBrowserEnv()
      ? (function () {
          var e,
            t = /(msie|trident)/i.test(navigator.userAgent),
            i = document.createElement("a");
          function o(e) {
            var a = e;
            return (
              t && (i.setAttribute("href", a), (a = i.href)),
              i.setAttribute("href", a),
              {
                href: i.href,
                protocol: i.protocol ? i.protocol.replace(/:$/, "") : "",
                host: i.host,
                search: i.search ? i.search.replace(/^\?/, "") : "",
                hash: i.hash ? i.hash.replace(/^#/, "") : "",
                hostname: i.hostname,
                port: i.port,
                pathname:
                  "/" === i.pathname.charAt(0) ? i.pathname : "/" + i.pathname,
              }
            );
          }
          return (
            (e = o(window.location.href)),
            function (t) {
              var i = a.isString(t) ? o(t) : t;
              return i.protocol === e.protocol && i.host === e.host;
            }
          );
        })()
      : function () {
          return !0;
        };
  },
  730: function (e, t, i) {
    "use strict";
    var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    function o() {
      this.message = "String contains an invalid character";
    }
    (o.prototype = new Error()),
      (o.prototype.code = 5),
      (o.prototype.name = "InvalidCharacterError"),
      (e.exports = function (e) {
        for (
          var t, i, n = String(e), s = "", r = 0, l = a;
          n.charAt(0 | r) || ((l = "="), r % 1);
          s += l.charAt(63 & (t >> (8 - (r % 1) * 8)))
        ) {
          if ((i = n.charCodeAt((r += 0.75))) > 255) throw new o();
          t = (t << 8) | i;
        }
        return s;
      });
  },
  731: function (e, t, i) {
    "use strict";
    var a = i(688);
    e.exports = a.isStandardBrowserEnv()
      ? {
          write: function (e, t, i, o, n, s) {
            var r = [];
            r.push(e + "=" + encodeURIComponent(t)),
              a.isNumber(i) && r.push("expires=" + new Date(i).toGMTString()),
              a.isString(o) && r.push("path=" + o),
              a.isString(n) && r.push("domain=" + n),
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
  732: function (e, t, i) {
    "use strict";
    var a = i(688);
    function o() {
      this.handlers = [];
    }
    (o.prototype.use = function (e, t) {
      return (
        this.handlers.push({ fulfilled: e, rejected: t }),
        this.handlers.length - 1
      );
    }),
      (o.prototype.eject = function (e) {
        this.handlers[e] && (this.handlers[e] = null);
      }),
      (o.prototype.forEach = function (e) {
        a.forEach(this.handlers, function (t) {
          null !== t && e(t);
        });
      }),
      (e.exports = o);
  },
  733: function (e, t, i) {
    "use strict";
    var a = i(688),
      o = i(734),
      n = i(709),
      s = i(697);
    function r(e) {
      e.cancelToken && e.cancelToken.throwIfRequested();
    }
    e.exports = function (e) {
      return (
        r(e),
        (e.headers = e.headers || {}),
        (e.data = o(e.data, e.headers, e.transformRequest)),
        (e.headers = a.merge(
          e.headers.common || {},
          e.headers[e.method] || {},
          e.headers || {}
        )),
        a.forEach(
          ["delete", "get", "head", "post", "put", "patch", "common"],
          function (t) {
            delete e.headers[t];
          }
        ),
        (e.adapter || s.adapter)(e).then(
          function (t) {
            return (
              r(e), (t.data = o(t.data, t.headers, e.transformResponse)), t
            );
          },
          function (t) {
            return (
              n(t) ||
                (r(e),
                t &&
                  t.response &&
                  (t.response.data = o(
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
  734: function (e, t, i) {
    "use strict";
    var a = i(688);
    e.exports = function (e, t, i) {
      return (
        a.forEach(i, function (i) {
          e = i(e, t);
        }),
        e
      );
    };
  },
  735: function (e, t, i) {
    "use strict";
    e.exports = function (e) {
      return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e);
    };
  },
  736: function (e, t, i) {
    "use strict";
    e.exports = function (e, t) {
      return t ? e.replace(/\/+$/, "") + "/" + t.replace(/^\/+/, "") : e;
    };
  },
  737: function (e, t, i) {
    "use strict";
    var a = i(710);
    function o(e) {
      if ("function" != typeof e)
        throw new TypeError("executor must be a function.");
      var t;
      this.promise = new Promise(function (e) {
        t = e;
      });
      var i = this;
      e(function (e) {
        i.reason || ((i.reason = new a(e)), t(i.reason));
      });
    }
    (o.prototype.throwIfRequested = function () {
      if (this.reason) throw this.reason;
    }),
      (o.source = function () {
        var e;
        return {
          token: new o(function (t) {
            e = t;
          }),
          cancel: e,
        };
      }),
      (e.exports = o);
  },
  738: function (e, t, i) {
    "use strict";
    e.exports = function (e) {
      return function (t) {
        return e.apply(null, t);
      };
    };
  },
  739: function (e, t, i) {
    "use strict";
    var a,
      o = (function () {
        function e(e, t) {
          for (var i = 0; i < t.length; i++) {
            var a = t[i];
            (a.enumerable = a.enumerable || !1),
              (a.configurable = !0),
              "value" in a && (a.writable = !0),
              Object.defineProperty(e, a.key, a);
          }
        }
        return function (t, i, a) {
          return i && e(t.prototype, i), a && e(t, a), t;
        };
      })(),
      n = i(13),
      s = (a = n) && a.__esModule ? a : { default: a };
    e.exports = (function () {
      function e() {
        !(function (e, t) {
          if (!(e instanceof t))
            throw new TypeError("Cannot call a class as a function");
        })(this, e),
          (this.errors = {});
      }
      return (
        o(e, [
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
  740: function (e, t, i) {
    "use strict";
    function a(e) {
      return void 0 === e;
    }
    function o(e) {
      return Array.isArray(e);
    }
    function n(e) {
      return (
        e &&
        "number" == typeof e.size &&
        "string" == typeof e.type &&
        "function" == typeof e.slice
      );
    }
    e.exports = function e(t, i, s, r) {
      if (
        (i instanceof FormData && ((r = s), (s = i), (i = null)),
        ((i = i || {}).indices = !a(i.indices) && i.indices),
        (i.nulls = !!a(i.nulls) || i.nulls),
        (s = s || new FormData()),
        a(t))
      )
        return s;
      if (
        (function (e) {
          return null === e;
        })(t)
      )
        i.nulls && s.append(r, "");
      else if (o(t))
        if (t.length)
          t.forEach(function (t, a) {
            var o = r + "[" + (i.indices ? a : "") + "]";
            e(t, i, s, o);
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
                n(e) &&
                ("object" == typeof e.lastModifiedDate ||
                  "number" == typeof e.lastModified) &&
                "string" == typeof e.name
              );
            })(t) ||
            n(t)
            ? s.append(r, t)
            : Object.keys(t).forEach(function (a) {
                var n = t[a];
                if (o(n))
                  for (; a.length > 2 && a.lastIndexOf("[]") === a.length - 2; )
                    a = a.substring(0, a.length - 2);
                e(n, i, s, r ? r + "[" + a + "]" : a);
              })
          : s.append(r, t.toISOString());
      return s;
    };
  },
  741: function (e, t, i) {
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
  743: function (e, t, i) {
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
                i = e.options.entities.customers;
              e.searchedCustomers.forEach(function (e) {
                -1 === t.indexOf(parseInt(e.id)) && (t.push(e.id), i.push(e));
              }),
                (e.options.entities.customers = Object.values(
                  i.sort(function (e, t) {
                    return e.firstName.toLowerCase() > t.firstName.toLowerCase()
                      ? 1
                      : -1;
                  })
                ));
            });
        },
        searchCustomers: function (e, t) {
          var i = this;
          clearTimeout(this.searchCustomersTimer),
            (this.loadingCustomers = !0),
            this.searchCounter++,
            (this.searchCustomersTimer = setTimeout(function () {
              var a = i.searchCounter;
              i.$http
                .get(i.$root.getAjaxUrl + "/users/customers", {
                  params: {
                    search: e,
                    page: 1,
                    limit: i.$root.settings.general.customersFilterLimit,
                    skipCount: 1,
                  },
                })
                .then(function (e) {
                  a >= i.searchCounter &&
                    (i.searchedCustomers = e.data.data.users.sort(function (
                      e,
                      t
                    ) {
                      return e.firstName.toLowerCase() >
                        t.firstName.toLowerCase()
                        ? 1
                        : -1;
                    })),
                    (i.loadingCustomers = !1),
                    t();
                })
                .catch(function (e) {
                  i.loadingCustomers = !1;
                });
            }, 500));
        },
      },
    };
  },
  744: function (e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = i(702),
      o = i.n(a),
      n = i(691),
      s = i(337),
      r = i(701),
      l = i(741);
    t.default = {
      mixins: [n.a, s.a, r.a, l.a],
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
          form: new o.a(),
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
            i = this.$root;
          this.$parent.$refs[this.formName].validate(function (a, o) {
            if (!a)
              return (
                "appointment" === t.formName &&
                  t.handleAppointmentDialogTabChange(o),
                t.$emit("validationFailCallback"),
                !1
              );
            (t.dialogLoading = !0),
              t.isNew ? t.addEntity(e) : t.editEntity(e),
              (t.$root = i);
          });
        },
        onSuccess: function (e, t, i) {
          var a = this;
          this.$parent.$emit("saveCallback", i),
            setTimeout(function () {
              (a.dialogLoading = !1), a.$parent.$emit("closeDialog");
            }, 300),
            this.notify(e, t, "success");
        },
        onError: function (e, t) {
          (this.dialogLoading = !1), this.$emit("errorCallback", t);
        },
        addEntity: function (e) {
          var t = this,
            i = null;
          void 0 !== this.$store &&
            void 0 !== this.$store.state.cabinet &&
            "provider" === this.$store.state.cabinet.cabinetType &&
            (i = Object.assign(this.getAuthorizationHeaderObject(), {
              params: {
                source: "cabinet-" + this.$store.state.cabinet.cabinetType,
              },
            })),
            this.$http
              .post(
                this.$root.getAjaxUrl + "/" + this.urlName,
                this.getParsedEntity(e),
                i
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
        editEntity: function (e) {
          var t = this,
            i = null;
          void 0 !== this.$store &&
            void 0 !== this.$store.state.cabinet &&
            "provider" === this.$store.state.cabinet.cabinetType &&
            (i = Object.assign(this.getAuthorizationHeaderObject(), {
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
                i
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
          for (var t = Object.keys(e), i = 0, a = 0; a < t.length; a++)
            i = t[a].startsWith("bookings.") ? i + 1 : i;
          i === t.length && this.$emit("validationBookingsFailCallback");
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
          i = e._self._c || t;
        return i("div", [
          i("div", { staticClass: "am-dialog-footer" }, [
            i(
              "div",
              { staticClass: "am-dialog-footer-actions" },
              [
                i("transition", { attrs: { name: "slide-vertical" } }, [
                  i(
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
                      i(
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
                        ? i("el-alert", {
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
                        ? i(
                            "div",
                            { staticClass: "align-left" },
                            [
                              i(
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
                              i(
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
                        : i(
                            "div",
                            { staticClass: "align-left" },
                            [
                              e.allowedDelete
                                ? i(
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
                                ? i(
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
                                : i(
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
                i("transition", { attrs: { name: "slide-vertical" } }, [
                  e.status
                    ? i(
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
                            ? i("h3", [e._v(e._s(e.message.confirm.hide))])
                            : e.isStatusOff()
                            ? i("h3", [e._v(e._s(e.message.confirm.show))])
                            : e._e(),
                          e._v(" "),
                          e.hasApplyGloballyVisibility
                            ? i(
                                "div",
                                { staticClass: "align-left" },
                                [
                                  e.isStatusOn()
                                    ? i(
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
                                    ? i(
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
                                    ? i(
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
                                    ? i(
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
                            : i(
                                "div",
                                { staticClass: "align-left" },
                                [
                                  i(
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
                                    ? i(
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
                                    ? i(
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
                i("transition", { attrs: { name: "slide-vertical" } }, [
                  i(
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
                      i("h3", [e._v(e._s(e.message.confirm.duplicate))]),
                      e._v(" "),
                      i(
                        "div",
                        { staticClass: "align-left" },
                        [
                          i(
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
                          i(
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
                i("transition", { attrs: { name: "slide-vertical" } }, [
                  i(
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
                        ? i("h3", [e._v(e._s(e.message.confirm.save))])
                        : e._e(),
                      e._v(" "),
                      e.buttonText
                        ? i(
                            "div",
                            { staticClass: "align-left" },
                            [
                              i(
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
                              i(
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
                        ? i("el-alert", {
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
                  ? i(
                      "el-row",
                      [
                        i(
                          "el-col",
                          { staticClass: "align-right", attrs: { sm: 24 } },
                          [
                            i(
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
                              ? i(
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
                  : i(
                      "el-row",
                      [
                        i(
                          "el-col",
                          { staticClass: "align-left", attrs: { sm: 16 } },
                          [
                            e.action.haveDuplicate
                              ? i(
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
                                      ? i("img", {
                                          staticClass: "svg",
                                          attrs: {
                                            alt: e.$root.labels.duplicate,
                                            src:
                                              e.$root.getUrl +
                                              "public/img/copy.svg",
                                          },
                                        })
                                      : i("span", [
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
                              ? i(
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
                                      ? i("img", {
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
                                      : i("span", [
                                          e._v(
                                            e._s(e.getActionStatusButtonText())
                                          ),
                                        ]),
                                  ]
                                )
                              : e._e(),
                            e._v(" "),
                            e.action.haveRemove
                              ? i(
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
                                      ? i("img", {
                                          staticClass: "svg",
                                          attrs: {
                                            alt: e.$root.labels.delete,
                                            src:
                                              e.$root.getUrl +
                                              "public/img/delete.svg",
                                          },
                                        })
                                      : i("span", [
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
                        i(
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
                              ? i(
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
          i(
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
              i("div", { staticClass: "am-dialog-loader-content" }, [
                i("img", {
                  attrs: { src: e.$root.getUrl + "public/img/spinner.svg" },
                }),
                e._v(" "),
                i("p", [e._v(e._s(e.$root.labels.loader_message))]),
              ]),
            ]
          ),
        ]);
      },
      staticRenderFns: [],
    };
  },
  746: function (e, t, i) {
    var a = i(685)(i(747), i(748), !1, null, null, null);
    e.exports = a.exports;
  },
  747: function (e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = i(337),
      o = i(692),
      n = i(686),
      s = i(0),
      r = i.n(s);
    t.default = {
      name: "recurringDatesForm",
      mixins: [a.a, o.a, n.a],
      props: {
        recurringData: null,
        availableDates: null,
        calendarTimeSlots: null,
        isFrontend: !0,
        selectedExtras: null,
        service: null,
        formType: { type: String },
        formsData: { type: Object, default: function () {} },
      },
      data: function () {
        return {
          currentlyEditingItemIndex: null,
          recalculatedAvailableDates: null,
          disabledWeekdays: null,
          loading: !1,
          formName: this.$options.name,
          labelRecurringAppointments:
            this.formsData[this.$options.name].itemsStatic
              .recurringDatesHeadingFormField.labels.recurring_appointments
              .value,
          labelRecurringEdit:
            this.formsData[this.$options.name].itemsStatic
              .recurringDatesHeadingFormField.labels.recurring_edit.value,
          headingVisibility:
            this.formsData[this.$options.name].itemsStatic
              .recurringDatesHeadingFormField.visibility,
          labelDate:
            this.formsData[this.$options.name].itemsStatic
              .recurringInfoFormField.labels.date.value,
          labelTime:
            this.formsData[this.$options.name].itemsStatic
              .recurringInfoFormField.labels.time.value,
        };
      },
      mounted: function () {
        this.scrollView("am-recurring-dates", "start"),
          this.isFrontend ||
            (this.recurringData.datesCallback = this.setAvailableDates),
          this.setAvailableDates();
      },
      methods: {
        setUntilDateFormatted: function () {
          this.recurringData.untilString =
            this.$root.labels.recurring_until_text +
            " " +
            this.getFrontedFormattedDate(
              r()(
                this.recurringData.dates[this.recurringData.dates.length - 1]
                  .date
              ).format("YYYY-MM-DD")
            );
        },
        getRowClass: function (e) {
          var t = "";
          return (
            (e.isSubstituteDate || e.isSubstituteTime) &&
              (t = "am-recurring-dates-row-substitute"),
            e.isEditing && (t = "am-recurring-dates-row-editing"),
            t
          );
        },
        getAppointmentDate: function (e) {
          return this.getFrontedFormattedDate(r()(e).format("YYYY-MM-DD"));
        },
        getAppointmentTime: function (e) {
          return this.getFrontedFormattedTime(e);
        },
        cancelRecurringDates: function () {
          this.$emit("cancelRecurringDates");
        },
        confirmRecurringDates: function () {
          this.setUntilDateFormatted(), this.$emit("confirmRecurringDates");
        },
        getRequiredDuration: function () {
          var e = this.service.duration;
          return (
            this.selectedExtras.forEach(function (t) {
              e += t.duration ? t.duration : 0;
            }),
            e
          );
        },
        getAvailableSlots: function (e, t) {
          for (var i = {}, a = 0; a < e.length; a++) {
            for (
              var o = this.getStringTimeInSeconds(e[a]), n = !0, s = 0;
              s < t.length;
              s++
            ) {
              var r = this.getStringTimeInSeconds(t[s]),
                l = this.getRequiredDuration(),
                c = r - l - this.service.timeAfter,
                u = r + l + this.service.timeBefore;
              if (o > c && o < u) {
                n = !1;
                break;
              }
            }
            n && (i[e[a]] = this.getStringTimeInSeconds(e[a]));
          }
          return i;
        },
        inspectDate: function (e, t, i) {
          var a = r()(e.date).format("YYYY-MM-DD"),
            o = this.getAvailableSlots(
              Object.keys(this.calendarTimeSlots[a]),
              this.getAlreadySelectedDateSlots(a, null)
            );
          Object.keys(o).length > 0 &&
            (t[r()(e.date).format("YYYY-MM-DD")] = !0),
            (i[r()(e.date).format("YYYY-MM-DD")] = !0);
        },
        setAvailableDates: function () {
          var e = this,
            t = {},
            i = {};
          this.inspectDate(this.recurringData.startAppointment, t, i),
            this.recurringData.dates.forEach(function (a) {
              e.inspectDate(a, t, i);
            });
          var a = [];
          Object.keys(this.calendarTimeSlots).forEach(function (e) {
            e in i
              ? e in t && a.push(r()(e).toDate())
              : a.push(r()(e).toDate());
          }),
            (this.disabledWeekdays = { weekdays: [] }),
            (this.disabledWeekdays =
              0 === a.length ? { weekdays: [1, 2, 3, 4, 5, 6, 7] } : null),
            (this.recalculatedAvailableDates = a),
            this.$emit("datesDefined", this.recurringData.dates);
        },
        setAvailableSlotsForAllDates: function (e) {
          var t = this,
            i = r()(e).format("YYYY-MM-DD");
          this.recurringData.dates.forEach(function (e) {
            if (r()(e.date).format("YYYY-MM-DD") === i) {
              var a = t.getAvailableSlots(
                Object.keys(t.calendarTimeSlots[i]),
                t.getAlreadySelectedDateSlots(i, e.index)
              );
              for (var o in ((e.slots = {}),
              (e.slots[e.slot] = t.calendarTimeSlots[i][e.slot]),
              a))
                e.slots[o] = t.calendarTimeSlots[i][o];
            }
          });
        },
        getAlreadySelectedDateSlots: function (e, t) {
          var i = [];
          return (
            this.recurringData.dates.forEach(function (a) {
              r()(a.date).format("YYYY-MM-DD") === e &&
                a.index !== t &&
                i.push(a.slot);
            }),
            e === this.recurringData.startDate.split(" ")[0] &&
              i.push(this.recurringData.startTime),
            i
          );
        },
        changedDate: function (e) {
          if (null !== e.date) {
            var t = r()(e.date).format("YYYY-MM-DD"),
              i = this.getAvailableSlots(
                Object.keys(this.calendarTimeSlots[t]),
                this.getAlreadySelectedDateSlots(t, e.index)
              );
            for (var a in ((e.slots = {}), i))
              e.slots[a] = this.calendarTimeSlots[t][a];
            var o = Object.keys(e.slots);
            -1 === o.indexOf(e.slot) && (e.slot = o[0]),
              this.isFrontend || this.confirmEditDate(e);
          } else e.date = e.previousDate;
        },
        editDate: function (e) {
          var t = this;
          null !== this.currentlyEditingItemIndex &&
            this.recurringData.pageRecurringDates.forEach(function (e) {
              e.index === t.currentlyEditingItemIndex && t.cancelEditDate(e);
            }),
            this.recurringData.pageRecurringDates.forEach(function (e) {
              (e.isEditing = !1), (e.isDeleting = !1);
            }),
            (this.currentlyEditingItemIndex = e.index),
            (e.isEditing = !0);
        },
        cancelEditDate: function (e) {
          (e.slot = e.previousSlot),
            r()(e.date).format("YYYY-MM-DD") !==
              r()(e.previousDate).format("YYYY-MM-DD") &&
              ((e.date = e.previousDate), this.changedDate(e)),
            (e.isEditing = !1);
        },
        confirmEditDate: function (e) {
          if (
            r()(e.date).format("YYYY-MM-DD") !==
            r()(e.previousDate).format("YYYY-MM-DD")
          ) {
            var t = e.previousDate;
            (e.previousDate = e.date),
              (e.previousSlot = e.slot),
              this.setAvailableSlotsForAllDates(e.date),
              this.setAvailableSlotsForAllDates(t),
              this.setAvailableDates();
          }
          (this.currentlyEditingItemIndex = null), (e.isEditing = !1);
        },
        deleteDate: function (e) {
          this.recurringData.pageRecurringDates.forEach(function (e) {
            (e.isEditing = !1), (e.isDeleting = !1);
          }),
            (e.isDeleting = !0);
        },
        confirmDeleteDate: function (e, t) {
          var i = this;
          (this.loading = !0),
            setTimeout(function () {
              e.isDeleting = !1;
              var a =
                  (i.recurringData.pagination.page - 1) *
                  i.recurringData.pagination.show,
                o =
                  i.recurringData.pagination.page *
                  i.recurringData.pagination.show;
              i.recurringData.dates.splice(a + t, 1),
                i.recurringData.pageRecurringDates.splice(t, 1),
                i.recurringData.dates.length >=
                  i.recurringData.pagination.show &&
                  i.recurringData.pageRecurringDates.push(
                    i.recurringData.dates[o - 1]
                  ),
                (i.recurringData.pagination.count =
                  i.recurringData.dates.length),
                i.setAvailableSlotsForAllDates(e.date),
                i.setAvailableDates(),
                (i.loading = !1);
            }, 500);
        },
        cancelDeleteDate: function (e) {
          e.isDeleting = !1;
        },
      },
      watch: {
        "recurringData.pagination.page": function () {
          var e = this;
          (this.loading = !0),
            setTimeout(function () {
              var t =
                (e.recurringData.pagination.page - 1) *
                e.recurringData.pagination.show;
              (e.recurringData.pageRecurringDates = e.recurringData.dates.slice(
                t,
                t + e.recurringData.pagination.show
              )),
                (e.loading = !1);
            }, 500);
        },
      },
      computed: {
        substitutesCount: function () {
          return this.recurringData.dates.filter(function (e) {
            return e.isSubstituteDate || e.isSubstituteTime;
          }).length;
        },
      },
    };
  },
  748: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          i = e._self._c || t;
        return i(
          "div",
          {
            staticClass: "am-recurring-dates",
            class: e.$root.settings.customization.forms
              ? "am-form-" + e.formType + "-" + e.formName
              : "",
            attrs: { id: "am-recurring-dates" },
          },
          [
            e.substitutesCount > 0
              ? i("div", { staticClass: "am-recurring-dates-header" }, [
                  e.isFrontend
                    ? i("p", [
                        e._v(e._s(e.$root.labels.recurring_sub_message1)),
                      ])
                    : e._e(),
                  e._v(" "),
                  i("p", [
                    e._v(
                      e._s(e.$root.labels.recurring_sub_message2) +
                        e._s(e.substitutesCount)
                    ),
                  ]),
                ])
              : i(
                  "div",
                  { staticClass: "am-recurring-dates-header" },
                  [
                    e.headingVisibility
                      ? [
                          e.isFrontend
                            ? i(
                                "p",
                                {
                                  staticClass:
                                    "am-recurring-dates-header-first",
                                },
                                [
                                  e._v(
                                    e._s(
                                      e.labelRecurringAppointments ||
                                        e.$root.labels.recurring_appointments
                                    )
                                  ),
                                ]
                              )
                            : e._e(),
                          e._v(" "),
                          e.isFrontend
                            ? i(
                                "p",
                                {
                                  staticClass:
                                    "am-recurring-dates-header-second",
                                },
                                [
                                  e._v(
                                    e._s(
                                      e.labelRecurringEdit ||
                                        e.$root.labels.recurring_edit
                                    )
                                  ),
                                ]
                              )
                            : e._e(),
                        ]
                      : e._e(),
                  ],
                  2
                ),
            e._v(" "),
            i(
              "div",
              { staticClass: "am-recurring-dates-row-header hide-on-mobile" },
              [
                i(
                  "el-row",
                  [
                    i("el-col", { attrs: { lg: 3, sm: 3 } }, [
                      i("span", { staticStyle: { visibility: "hidden" } }, [
                        e._v("#"),
                      ]),
                    ]),
                    e._v(" "),
                    i(
                      "el-col",
                      {
                        staticClass: "am-recurring-dates-row-header-date",
                        attrs: { lg: 10, sm: 10 },
                      },
                      [
                        i("span", [
                          e._v(e._s(e.labelDate || e.$root.labels.date)),
                        ]),
                      ]
                    ),
                    e._v(" "),
                    i(
                      "el-col",
                      {
                        staticClass: "am-recurring-dates-row-header-time",
                        attrs: { lg: 7, sm: 7 },
                      },
                      [
                        i("span", [
                          e._v(e._s(e.labelTime || e.$root.labels.time)),
                        ]),
                      ]
                    ),
                    e._v(" "),
                    i("el-col", { attrs: { lg: 4, sm: 4 } }, [i("span")]),
                  ],
                  1
                ),
              ],
              1
            ),
            e._v(" "),
            i(
              "div",
              {
                directives: [
                  {
                    name: "loading",
                    rawName: "v-loading",
                    value: e.loading,
                    expression: "loading",
                  },
                ],
                staticClass: "am-recurring-dates-rows",
                style: { opacity: e.loading ? 0.5 : 1 },
              },
              e._l(e.recurringData.pageRecurringDates, function (t, a) {
                return void 0 !== t
                  ? i(
                      "el-row",
                      {
                        key: a,
                        staticClass: "am-recurring-flex-row-middle-align",
                        class: e.getRowClass(t),
                      },
                      [
                        i(
                          "el-col",
                          {
                            staticClass:
                              "am-recurring-row-item am-recurring-row-order",
                            class: [
                              {
                                "is-editing": t.isEditing,
                                "is-deleting": t.isDeleting,
                              },
                              e.$root.settings.customization.forms
                                ? "am-block-" + e.formType + "-" + e.formName
                                : "",
                            ],
                            attrs: {
                              lg: t.isDeleting ? 18 : 3,
                              sm: t.isDeleting ? 18 : 3,
                            },
                          },
                          [
                            t.isDeleting
                              ? e._e()
                              : i(
                                  "span",
                                  {
                                    class: e.isFrontend ? "hide-on-mobile" : "",
                                  },
                                  [
                                    e._v(
                                      e._s(
                                        a +
                                          1 +
                                          e.recurringData.pagination.show *
                                            (e.recurringData.pagination.page -
                                              1)
                                      )
                                    ),
                                  ]
                                ),
                            e._v(" "),
                            e.isFrontend && !t.isDeleting
                              ? i(
                                  "span",
                                  {
                                    staticClass:
                                      "am-col-title am-col-title-date",
                                  },
                                  [
                                    e._v(
                                      e._s(e.labelDate || e.$root.labels.date) +
                                        " / " +
                                        e._s(e.labelTime || e.$root.labels.time)
                                    ),
                                  ]
                                )
                              : e._e(),
                            t.isSubstituteDate || t.isSubstituteTime
                              ? i("i", {
                                  staticClass: "el-icon-warning-outline",
                                })
                              : e._e(),
                            e._v(" "),
                            t.isDeleting
                              ? i(
                                  "span",
                                  {
                                    staticClass:
                                      "am-recurring-row-delete-message",
                                  },
                                  [
                                    e._v(
                                      e._s(
                                        e.$root.labels.recurring_confirm_delete
                                      )
                                    ),
                                  ]
                                )
                              : e._e(),
                          ]
                        ),
                        e._v(" "),
                        i(
                          "el-col",
                          {
                            staticClass:
                              "am-recurring-row-item am-recurring-row-item-date v-calendar-column",
                            class: [
                              {
                                "is-editing": t.isEditing,
                                "is-substitute": t.isSubstituteDate,
                              },
                              e.$root.settings.customization.forms
                                ? "am-calendar-" + e.formType + "-" + e.formName
                                : "",
                            ],
                            attrs: {
                              lg: t.isDeleting ? 1 : 10,
                              sm: t.isDeleting ? 1 : 10,
                            },
                          },
                          [
                            i("v-date-picker", {
                              style: {
                                visibility: t.isDeleting ? "hidden" : "visible",
                              },
                              attrs: {
                                mode: "single",
                                "popover-visibility": "focus",
                                "popover-direction": e.isFrontend
                                  ? "bottom"
                                  : "top",
                                "popover-align": "center",
                                "tint-color":
                                  e.$root.settings.customization.primaryColor,
                                "input-class": "el-input__inner",
                                "show-day-popover": !1,
                                "input-props": { class: "el-input__inner" },
                                "available-dates": e.recalculatedAvailableDates,
                                "is-expanded": !1,
                                "is-required": !1,
                                "disabled-dates": e.disabledWeekdays,
                                disabled: !1,
                                formats: e.vCalendarFormats,
                              },
                              on: {
                                input: function (i) {
                                  return e.changedDate(t);
                                },
                              },
                              model: {
                                value: t.date,
                                callback: function (i) {
                                  e.$set(t, "date", i);
                                },
                                expression: "item.date",
                              },
                            }),
                          ],
                          1
                        ),
                        e._v(" "),
                        i(
                          "el-col",
                          {
                            staticClass:
                              "am-recurring-row-item am-recurring-row-item-time",
                            class: [
                              {
                                "is-editing": t.isEditing,
                                "is-substitute": t.isSubstituteTime,
                              },
                              e.$root.settings.customization.forms
                                ? "am-select-" + e.formType + "-" + e.formName
                                : "",
                            ],
                            attrs: {
                              lg: t.isDeleting ? 1 : 7,
                              sm: t.isDeleting ? 1 : 7,
                            },
                          },
                          [
                            i(
                              "div",
                              [
                                i(
                                  "el-select",
                                  {
                                    class:
                                      null === t.slot
                                        ? "am-recurring-row-item-time"
                                        : "",
                                    style: {
                                      visibility: t.isDeleting
                                        ? "hidden"
                                        : "visible",
                                    },
                                    attrs: {
                                      "value-key": "time",
                                      filterable: "",
                                      "popper-class": e.$root.settings
                                        .customization.forms
                                        ? "am-dropdown-" +
                                          e.formType +
                                          "-" +
                                          e.formName
                                        : "",
                                    },
                                    model: {
                                      value: t.slot,
                                      callback: function (i) {
                                        e.$set(t, "slot", i);
                                      },
                                      expression: "item.slot",
                                    },
                                  },
                                  e._l(
                                    Object.keys(t.slots).sort(),
                                    function (t) {
                                      return i("el-option", {
                                        key: t,
                                        attrs: {
                                          label: e.getFrontedFormattedTime(
                                            t + ":00"
                                          ),
                                          value: t,
                                        },
                                      });
                                    }
                                  ),
                                  1
                                ),
                              ],
                              1
                            ),
                          ]
                        ),
                        e._v(" "),
                        i(
                          "el-col",
                          {
                            staticClass: "am-recurring-row-action",
                            class: t.isEditing ? "is-editing" : "",
                            attrs: {
                              lg: (t.isDeleting, 4),
                              sm: (t.isDeleting, 4),
                            },
                          },
                          [
                            t.isEditing ||
                            t.isDeleting ||
                            !(
                              e.recurringData.pagination.page > 1 ||
                              (1 === e.recurringData.pagination.page && a > 0)
                            )
                              ? e.recurringData.pagination.page > 1 ||
                                (1 === e.recurringData.pagination.page && a > 0)
                                ? i("div", [
                                    i(
                                      "div",
                                      {
                                        staticClass: "am-edit-element",
                                        class: e.$root.settings.customization
                                          .forms
                                          ? "am-block-" +
                                            e.formType +
                                            "-" +
                                            e.formName
                                          : "",
                                        on: {
                                          click: function (i) {
                                            t.isDeleting
                                              ? e.confirmDeleteDate(t, a)
                                              : e.confirmEditDate(t);
                                          },
                                        },
                                      },
                                      [i("i", { staticClass: "el-icon-check" })]
                                    ),
                                    e._v(" "),
                                    i(
                                      "div",
                                      {
                                        staticClass: "am-delete-element",
                                        class: e.$root.settings.customization
                                          .forms
                                          ? "am-block-" +
                                            e.formType +
                                            "-" +
                                            e.formName
                                          : "",
                                        on: {
                                          click: function (i) {
                                            t.isDeleting
                                              ? e.cancelDeleteDate(t)
                                              : e.cancelEditDate(t);
                                          },
                                        },
                                      },
                                      [i("i", { staticClass: "el-icon-close" })]
                                    ),
                                  ])
                                : e._e()
                              : i("div", [
                                  e.isFrontend
                                    ? i(
                                        "div",
                                        {
                                          staticClass: "am-edit-element",
                                          class: e.$root.settings.customization
                                            .forms
                                            ? "am-block-" +
                                              e.formType +
                                              "-" +
                                              e.formName
                                            : "",
                                          on: {
                                            click: function (i) {
                                              return e.editDate(t);
                                            },
                                          },
                                        },
                                        [
                                          i("i", {
                                            staticClass: "el-icon-edit",
                                          }),
                                        ]
                                      )
                                    : e._e(),
                                  e._v(" "),
                                  i(
                                    "div",
                                    {
                                      staticClass: "am-edit-element",
                                      class: e.$root.settings.customization
                                        .forms
                                        ? "am-block-" +
                                          e.formType +
                                          "-" +
                                          e.formName
                                        : "",
                                      style: {
                                        visibility:
                                          1 === e.recurringData.dates.length
                                            ? "hidden"
                                            : "visible",
                                      },
                                      on: {
                                        click: function (i) {
                                          e.isFrontend
                                            ? e.deleteDate(t)
                                            : e.confirmDeleteDate(t, a);
                                        },
                                      },
                                    },
                                    [i("i", { staticClass: "el-icon-delete" })]
                                  ),
                                ]),
                          ]
                        ),
                      ],
                      1
                    )
                  : e._e();
              }),
              1
            ),
            e._v(" "),
            i(
              "div",
              {
                staticClass: "am-pagination am-section",
                class: [
                  e.recurringData.pagination.count >
                  e.recurringData.pagination.show
                    ? ""
                    : "am-pagination-hidden",
                  e.$root.settings.customization.forms
                    ? "am-block-" + e.formType + "-" + e.formName
                    : "",
                ],
              },
              [
                i("div", [
                  i("p", [
                    e._v(
                      e._s(e.$root.labels.showing) +
                        " " +
                        e._s(e.recurringData.pageRecurringDates.length) +
                        " " +
                        e._s(e.$root.labels.out_of) +
                        " " +
                        e._s(e.recurringData.dates.length) +
                        " " +
                        e._s(e.$root.labels.recurring_appointments)
                    ),
                  ]),
                ]),
                e._v(" "),
                i("el-pagination", {
                  attrs: {
                    "page-size": e.recurringData.pagination.show,
                    total: e.recurringData.pagination.count,
                    layout: "prev, pager, next",
                    "current-page": e.recurringData.pagination.page,
                  },
                  on: {
                    "update:currentPage": function (t) {
                      return e.$set(e.recurringData.pagination, "page", t);
                    },
                    "update:current-page": function (t) {
                      return e.$set(e.recurringData.pagination, "page", t);
                    },
                  },
                }),
              ],
              1
            ),
            e._v(" "),
            e.isFrontend
              ? i(
                  "div",
                  {
                    staticClass: "dialog-footer",
                    attrs: { slot: "footer" },
                    slot: "footer",
                  },
                  [
                    i(
                      "div",
                      {
                        staticClass: "el-button el-button--default",
                        on: {
                          click: function (t) {
                            return e.cancelRecurringDates();
                          },
                        },
                      },
                      [i("span", [e._v(e._s(e.$root.labels.cancel))])]
                    ),
                    e._v(" "),
                    i(
                      "div",
                      {
                        staticClass: "el-button el-button--primary",
                        on: {
                          click: function (t) {
                            return e.confirmRecurringDates();
                          },
                        },
                      },
                      [i("span", [e._v(e._s(e.$root.labels.continue))])]
                    ),
                  ]
                )
              : e._e(),
          ]
        );
      },
      staticRenderFns: [],
    };
  },
  749: function (e, t, i) {
    var a = i(685)(i(750), i(754), !1, null, null, null);
    e.exports = a.exports;
  },
  750: function (e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = i(0),
      o = i.n(a),
      n = i(337),
      s = i(686),
      r = i(705),
      l = i(751),
      c = i.n(l);
    t.default = {
      name: "recurringSetupForm",
      components: { recurringSetupHeadingFormField: c.a },
      mixins: [n.a, r.a, s.a],
      props: {
        containerId: null,
        initialRecurringData: null,
        recurringData: null,
        availableDates: null,
        disabledWeekdays: null,
        calendarTimeSlots: null,
        service: null,
        isFrontend: !0,
        calendarPosition: "bottom",
        formType: { type: String },
        formsData: { type: Object, default: function () {} },
      },
      data: function () {
        return {
          formName: this.$options.name,
          monthlyWeekDayRepeat: [
            { label: this.$root.labels.recurring_date_specific, value: 0 },
            { label: this.$root.labels.recurring_date_first, value: 1 },
            { label: this.$root.labels.recurring_date_second, value: 2 },
            { label: this.$root.labels.recurring_date_third, value: 3 },
            { label: this.$root.labels.recurring_date_fourth, value: 4 },
            { label: this.$root.labels.recurring_date_last, value: 5 },
          ],
          cycles: [
            { label: this.$root.labels.recurring_type_daily, value: "daily" },
            { label: this.$root.labels.recurring_type_weekly, value: "weekly" },
            {
              label: this.$root.labels.recurring_type_monthly,
              value: "monthly",
            },
          ],
          weekDays: [],
          recurring: { maxDate: null },
          labelRepeat:
            this.formsData.recurringSetupForm.itemsStatic
              .recurringSettingsFormField.labels.recurring_repeat.value,
          labelEvery:
            this.formsData.recurringSetupForm.itemsStatic
              .recurringSettingsFormField.labels.recurring_every.value,
          labelOn:
            this.formsData.recurringSetupForm.itemsStatic
              .recurringSettingsFormField.labels.recurring_on.value,
          labelUntil:
            this.formsData.recurringSetupForm.itemsStatic
              .recurringSettingsFormField.labels.recurring_until.value,
          labelTimes:
            this.formsData.recurringSetupForm.itemsStatic
              .recurringSettingsFormField.labels.recurring_times.value,
        };
      },
      created: function () {
        this.weekDays = [];
        for (var e = 0; e < 7; e++)
          this.weekDays.push({
            label: o()()
              .isoWeekday(e + 1)
              .format("dd"),
            enabled: !0,
          });
      },
      mounted: function () {
        this.scrollView("am-recurring-setup", "start"),
          (this.recurring.maxDate =
            this.initialRecurringData.calendarDates[
              this.initialRecurringData.calendarDates.length - 1
            ]),
          0 === this.initialRecurringData.weekDaysSelected.length &&
            this.initialRecurringData.weekDaysSelected.push(
              this.initialRecurringData.selectedWeekDayIndex
            ),
          this.isFrontend ||
            (this.recurringData.setupCallback = this.setRecurringValues),
          this.setRecurringValues("count");
      },
      methods: {
        setRecurringString: function () {
          var e = this,
            t = (this.recurringData.recurringString =
              this.$root.labels.recurring_every_text +
              " " +
              this.selectedRecurringInterval.label);
          switch (this.initialRecurringData.cycle) {
            case "daily":
              this.recurringData.recurringString = t;
              break;
            case "weekly":
              for (
                var i = o()(),
                  a = i.clone().startOf("week"),
                  n = i.clone().endOf("week"),
                  s = "";
                a.isBefore(n);

              )
                -1 !==
                  this.initialRecurringData.weekDaysSelected.indexOf(
                    a.isoWeekday() - 1
                  ) && (s += a.format("dddd") + ", "),
                  a.add(1, "days");
              this.recurringData.recurringString =
                t +
                " " +
                (s ? this.$root.labels.recurring_substring_on : "") +
                " " +
                s;
              break;
            case "monthly":
              var r = this.monthlyWeekDayRepeat.find(function (t) {
                return t.value === e.initialRecurringData.monthDateRule;
              });
              this.recurringData.recurringString =
                t +
                " " +
                this.$root.labels.recurring_substring_on +
                " " +
                (void 0 !== r
                  ? r.label +
                    " " +
                    this.initialRecurringData.selectedMonthlyWeekDayString +
                    ","
                  : "");
          }
        },
        getFutureMonthDate: function (e, t) {
          var i = o()(e, "YYYY-MM-DD"),
            a = o()(i).add(t, "M"),
            n = o()(a).startOf("month");
          return (
            i.date() !== a.date() &&
              a.isSame(n.format("YYYY-MM-DD")) &&
              a.subtract(1, "d"),
            a
          );
        },
        getGivenDateOfMonth: function (e, t, i) {
          var a = o()(e, "YYYY-MM-DD").startOf("month").day(i);
          a.format("M") !== e.format("M") && a.add(7, "days");
          var n = a.add(7 * (t - 1), "days");
          return e.format("M") !== n.format("M") && n.subtract(7, "days"), n;
        },
        setAvailableWeekDays: function () {
          var e = this,
            t = o()(this.recurringData.startDate, "YYYY-MM-DD"),
            i = o()(this.recurring.maxDate);
          for (
            this.weekDays.forEach(function (e) {
              e.enabled = !1;
            });
            t.isSameOrBefore(i);

          ) {
            var a = t.isoWeekday() - 1;
            t.format("YYYY-MM-DD") in this.calendarTimeSlots &&
              (this.weekDays[a].enabled = !0),
              t.add(1, "days");
          }
          var n = [];
          this.weekDays.forEach(function (t, i) {
            t.enabled &&
              -1 !== e.initialRecurringData.weekDaysSelected.indexOf(i) &&
              n.push(i);
          }),
            (this.initialRecurringData.weekDaysSelected = n);
        },
        getExpectedDates: function () {
          var e = o()(this.initialRecurringData.maxDate),
            t = o()(this.recurring.maxDate),
            i = [],
            a = o()(this.recurringData.startDate, "YYYY-MM-DD");
          i.push({ dateString: a.format("YYYY-MM-DD"), date: a });
          var n = [];
          switch (this.initialRecurringData.cycle) {
            case "daily":
              n.push(o()(this.recurringData.startDate, "YYYY-MM-DD"));
              break;
            case "weekly":
              this.setAvailableWeekDays();
              for (
                var s = o()(
                    this.recurringData.startDate,
                    "YYYY-MM-DD"
                  ).isoWeekday(),
                  r = this.initialRecurringData.weekDaysSelected.sort(),
                  l = 0;
                l < r.length;
                l++
              ) {
                var c = this.initialRecurringData.weekDaysSelected[l] + 1,
                  u = o()(this.recurringData.startDate, "YYYY-MM-DD");
                s < c && n.push(u.add(c - s, "days")),
                  s === c && n.push(u),
                  s > c && n.push(u.subtract(s - c, "days")),
                  u.isSameOrBefore(e) &&
                    i.push({
                      dateString: u.format("YYYY-MM-DD"),
                      date: u.clone(),
                    });
              }
              break;
            case "monthly":
              n.push(o()(this.recurringData.startDate, "YYYY-MM-DD"));
          }
          for (var m = n.length > 0; m; )
            for (var d = 0; d < n.length; d++) {
              switch (this.initialRecurringData.cycle) {
                case "daily":
                  n[d].add(this.initialRecurringData.cycleInterval, "days");
                  break;
                case "weekly":
                  n[d].add(7 * this.initialRecurringData.cycleInterval, "days");
                  break;
                case "monthly":
                  if (0 === this.initialRecurringData.monthDateRule)
                    n[d] = this.getFutureMonthDate(
                      n[d].format("YYYY-MM-DD"),
                      this.initialRecurringData.cycleInterval
                    );
                  else {
                    var p = n[d].isoWeekday(),
                      f = this.getFutureMonthDate(
                        n[d].startOf("month").format("YYYY-MM-DD"),
                        this.initialRecurringData.cycleInterval
                      );
                    n[d] = this.getGivenDateOfMonth(
                      f,
                      this.initialRecurringData.monthDateRule,
                      p
                    );
                  }
              }
              (m = n[d].isSameOrBefore(t)) &&
                i.push({
                  dateString: o()(n[d]).format("YYYY-MM-DD"),
                  date: o()(n[d]).clone(),
                });
            }
          return i;
        },
        setRecurringValues: function (e) {
          if (this.initialRecurringData.maxDate) {
            var t = o()(
              this.initialRecurringData.calendarDates[
                this.initialRecurringData.calendarDates.length - 1
              ]
            ).diff(o()(this.recurringData.startDate, "YYYY-MM-DD"), "days");
            switch (this.initialRecurringData.cycle) {
              case "daily":
                this.initialRecurringData.repeatIntervalLabels =
                  this.getRepeatIntervalLabels(
                    this.$root.labels.day,
                    this.$root.labels.days,
                    6
                  );
                break;
              case "weekly":
                this.initialRecurringData.repeatIntervalLabels =
                  this.getRepeatIntervalLabels(
                    this.$root.labels.week,
                    this.$root.labels.weeks,
                    Math.ceil(t / 7)
                  );
                break;
              case "monthly":
                this.initialRecurringData.repeatIntervalLabels =
                  this.getRepeatIntervalLabels(
                    this.$root.labels.month,
                    this.$root.labels.months,
                    Math.ceil(t / 31)
                  );
            }
            for (
              var i = o()(this.recurringData.startDate, "YYYY-MM-DD"),
                a = o()(this.initialRecurringData.maxDate),
                n = {},
                s = this.getExpectedDates(),
                r = o()(this.recurringData.startDate, "YYYY-MM-DD").format(
                  "YYYY-MM-DD"
                ),
                l = !1,
                c = null,
                u = 0,
                m = 0;
              m < s.length;
              m++
            ) {
              var d = s[m].dateString,
                p = o()(d, "YYYY-MM-DD"),
                f = p.isSameOrBefore(this.recurring.maxDate);
              if (
                ((c = o()(p)),
                d in this.calendarTimeSlots &&
                  Object.keys(this.calendarTimeSlots[d]).length &&
                  !(d in n) &&
                  f)
              ) {
                var h =
                  this.recurringData.startTime in this.calendarTimeSlots[d];
                c = o()(s[m].date);
                var g = h
                  ? this.recurringData.startTime
                  : Object.keys(this.calendarTimeSlots[d])[0];
                n[d] = {
                  isEditing: !1,
                  isDeleting: !1,
                  isSubstituteDate: !1,
                  isSubstituteTime: !h,
                  date: c.toDate(),
                  previousDate: c.toDate(),
                  index: u++,
                  slot: g,
                  previousSlot: g,
                  slots: this.calendarTimeSlots[d],
                  providerId: null,
                  locationId: null,
                  modifiedSlots: [],
                };
              } else if (d !== r && !(d in n) && f) {
                for (
                  var v = null, b = null, y = 0;
                  y < this.initialRecurringData.calendarDates.length;
                  y++
                )
                  if (
                    (("past" === this.service.recurringSub ||
                      "both" === this.service.recurringSub) &&
                      this.initialRecurringData.calendarDates[y].isBefore(
                        s[m].date
                      ) &&
                      this.initialRecurringData.calendarDates[y].isAfter(i) &&
                      (v = this.initialRecurringData.calendarDates[y]),
                    ("future" === this.service.recurringSub ||
                      "both" === this.service.recurringSub) &&
                      this.initialRecurringData.calendarDates[y].isAfter(
                        s[m].date
                      ))
                  ) {
                    b = this.initialRecurringData.calendarDates[y];
                    break;
                  }
                var _ = null !== v ? o()(s[m].date).diff(v, "days") : null,
                  C = null !== b ? o()(b).diff(s[m].date, "days") : null,
                  k = null;
                if (
                  (_ && C ? (k = _ < C ? v : b) : _ ? (k = v) : C && (k = b),
                  null !== k && o()(k).isSameOrBefore(a))
                ) {
                  var D = o()(k).format("YYYY-MM-DD");
                  if (
                    D in this.calendarTimeSlots &&
                    !(d in n) &&
                    -1 ===
                      s
                        .map(function (e) {
                          return e.dateString;
                        })
                        .indexOf(D)
                  ) {
                    var x =
                      this.recurringData.startTime in this.calendarTimeSlots[D];
                    c = o()(k);
                    var S = x
                      ? this.recurringData.startTime
                      : Object.keys(this.calendarTimeSlots[D])[0];
                    n[D] = {
                      isEditing: !1,
                      isDeleting: !1,
                      isSubstituteDate: !0,
                      isSubstituteTime: !x,
                      date: c.toDate(),
                      previousDate: c.toDate(),
                      index: u++,
                      slot: S,
                      previousSlot: S,
                      slots: this.calendarTimeSlots[D],
                      providerId: null,
                      locationId: null,
                      modifiedSlots: [],
                    };
                  }
                }
              }
              switch (e) {
                case "date":
                  (l = c.isAfter(a)) && delete n[c.format("YYYY-MM-DD")];
                  break;
                case "count":
                  l =
                    Object.keys(n).length > this.initialRecurringData.maxCount;
              }
              if (l) break;
            }
            var w = [];
            for (var $ in n) w.push(n[$]);
            for (var F = {}, T = {}, I = 0; I < w.length; I++)
              w[I].slots[w[I].slot].forEach(function (e) {
                e[0] in F ? F[e[0]]++ : (F[e[0]] = 1),
                  e[1] in T ? T[e[1]]++ : (T[e[1]] = 1);
              });
            for (
              var E = this.getEntityIdWithMaxSlotCount(F),
                P = this.getEntityIdWithMaxSlotCount(T),
                A = 1 === Object.keys(T).length,
                R = 0;
              R < w.length;
              R++
            ) {
              var N = w[R].slots[w[R].slot];
              if (A) {
                var M = N.map(function (e) {
                    return e[0];
                  }),
                  B = M.indexOf(E);
                if (-1 !== B)
                  (w[R].providerId = N[B][0]), (w[R].locationId = N[B][1]);
                else {
                  var O = Math.floor(Math.random() * M.length + 1);
                  (w[R].providerId = N[O - 1][0]),
                    (w[R].locationId = N[O - 1][1]);
                }
              } else {
                var L = N.map(function (e) {
                    return e[1];
                  }),
                  Y = L.indexOf(P);
                if (-1 !== Y)
                  (w[R].providerId = N[Y][0]), (w[R].locationId = N[Y][1]);
                else {
                  var j = Math.floor(Math.random() * L.length + 1);
                  (w[R].providerId = N[j - 1][0]), (w[R].locationId = L[j - 1]);
                }
              }
            }
            switch (
              ((this.recurringData.defaultEmployeeId = E),
              (this.recurringData.defaultLocationId = P),
              (this.recurringData.startAppointment = this.isFrontend
                ? w[0]
                : w.shift()),
              (this.recurringData.dates = w),
              e)
            ) {
              case "date":
                this.initialRecurringData.maxCount = this.isFrontend
                  ? this.recurringData.dates.length - 1
                  : this.recurringData.dates.length;
                break;
              case "count":
                this.initialRecurringData.maxDate = this.recurringData.dates
                  .length
                  ? o()(
                      this.recurringData.dates[
                        this.recurringData.dates.length - 1
                      ].date
                    )
                      .clone()
                      .toDate()
                  : o()(this.recurringData.startDate, "YYYY-MM-DD")
                      .add(1, "days")
                      .toDate();
            }
            (this.recurringData.pagination.page = 1),
              (this.recurringData.pagination.count =
                this.recurringData.dates.length),
              (this.recurringData.pageRecurringDates = this.recurringData.dates
                .length
                ? this.recurringData.dates.slice(
                    0,
                    this.recurringData.pagination.show
                  )
                : []),
              null !== this.recurringData.datesCallback &&
                this.recurringData.datesCallback(),
              this.setRecurringString();
          }
        },
        getFromDateFormatted: function () {
          return this.getFrontedFormattedDate(
            o()(this.recurringData.startDate, "YYYY-MM-DD HH:mm:ss").format(
              "YYYY-MM-DD"
            )
          );
        },
        getFromTimeFormatted: function () {
          return this.getFrontedFormattedTime(
            o()(this.recurringData.startDate, "YYYY-MM-DD HH:mm:ss").format(
              "HH:mm"
            )
          );
        },
        getEntityIdWithMaxSlotCount: function (e) {
          var t = Math.max.apply(
            Math,
            Object.entries(e).map(function (e) {
              return e[1];
            })
          );
          return parseInt(
            Object.entries(e).find(function (e) {
              return e[1] === t;
            })[0]
          );
        },
        confirmRecurringSetup: function () {
          var e = this;
          this.setRecurringValues("date"),
            setTimeout(function () {
              e.$emit("confirmRecurringSetup");
            }, 500);
        },
        cancelRecurringSetup: function () {
          this.$emit("cancelRecurringSetup");
        },
      },
      computed: {
        maxUntil: function () {
          return o()(
            this.initialRecurringData.calendarDates[
              this.initialRecurringData.calendarDates.length - 1
            ]
          ).toDate();
        },
        minFrom: function () {
          return o()(this.recurringData.startDate, "YYYY-MM-DD")
            .add(1, "days")
            .toDate();
        },
        selectedRecurringInterval: function () {
          var e = this;
          return this.initialRecurringData.repeatIntervalLabels.find(function (
            t
          ) {
            return t.value === e.initialRecurringData.cycleInterval;
          });
        },
      },
    };
  },
  751: function (e, t, i) {
    var a = i(685)(i(752), i(753), !1, null, null, null);
    e.exports = a.exports;
  },
  752: function (e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.default = {
        name: "recurringSetupHeadingFormField",
        props: {
          classIdentifier: { type: String, default: "" },
          formField: { type: Object, default: function () {} },
        },
        data: function () {
          return { formHeading: this.formField.labels.recurring_active.value };
        },
      });
  },
  753: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          i = e._self._c || t;
        return i(
          "div",
          {
            class: e.$root.settings.customization.forms
              ? "am-block-" + e.classIdentifier
              : "",
          },
          [
            e.formField.visibility
              ? i("p", { staticClass: "am-recurring-setup-title" }, [
                  e._v(
                    "\n    " +
                      e._s(
                        e.formHeading
                          ? e.formHeading
                          : e.$root.labels.recurring_active
                      ) +
                      "\n  "
                  ),
                ])
              : e._e(),
          ]
        );
      },
      staticRenderFns: [],
    };
  },
  754: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          i = e._self._c || t;
        return i(
          "div",
          {
            staticClass:
              "am-recurring-setup am-mobile-collapsed am-select-date",
            class: e.$root.settings.customization.forms
              ? "am-form-" + e.formType + "-" + e.formName
              : "",
            attrs: { id: "am-recurring-setup" },
          },
          [
            e.isFrontend
              ? i("recurring-setup-heading-form-field", {
                  attrs: {
                    "class-identifier": e.formType + "-" + e.formName,
                    formField:
                      e.formsData[e.formName].itemsStatic
                        .recurringSetupHeadingFormField,
                  },
                })
              : e._e(),
            e._v(" "),
            i(
              "el-form",
              {
                ref: "recurring",
                attrs: { model: e.recurring, "label-position": "top" },
              },
              [
                i(
                  "div",
                  [
                    i(
                      "el-row",
                      { attrs: { gutter: 24 } },
                      [
                        i(
                          "el-col",
                          { attrs: { sm: 12 } },
                          [
                            i(
                              "el-form-item",
                              {
                                class: e.$root.settings.customization.forms
                                  ? "am-select-" + e.formType + "-" + e.formName
                                  : "",
                                attrs: {
                                  label:
                                    e.labelRepeat ||
                                    e.$root.labels.recurring_repeat,
                                },
                              },
                              [
                                i(
                                  "el-select",
                                  {
                                    class:
                                      "all" !== e.service.recurringCycle
                                        ? "am-recurring-setup-all-cycle"
                                        : "",
                                    attrs: {
                                      "popper-class": e.$root.settings
                                        .customization.forms
                                        ? "am-dropdown-" +
                                          e.formType +
                                          "-" +
                                          e.formName
                                        : "",
                                      disabled:
                                        "all" !== e.service.recurringCycle,
                                    },
                                    on: {
                                      change: function (t) {
                                        return e.setRecurringValues("count");
                                      },
                                    },
                                    model: {
                                      value: e.initialRecurringData.cycle,
                                      callback: function (t) {
                                        e.$set(
                                          e.initialRecurringData,
                                          "cycle",
                                          t
                                        );
                                      },
                                      expression: "initialRecurringData.cycle",
                                    },
                                  },
                                  e._l(e.cycles, function (e, t) {
                                    return i("el-option", {
                                      key: t,
                                      attrs: { value: e.value, label: e.label },
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
                        i(
                          "el-col",
                          { attrs: { sm: 12 } },
                          [
                            i(
                              "el-form-item",
                              {
                                class: e.$root.settings.customization.forms
                                  ? "am-select-" + e.formType + "-" + e.formName
                                  : "",
                                attrs: {
                                  label:
                                    e.labelEvery ||
                                    e.$root.labels.recurring_every,
                                },
                              },
                              [
                                i(
                                  "el-select",
                                  {
                                    attrs: {
                                      "popper-class": e.$root.settings
                                        .customization.forms
                                        ? "am-dropdown-" +
                                          e.formType +
                                          "-" +
                                          e.formName
                                        : "",
                                    },
                                    on: {
                                      change: function (t) {
                                        return e.setRecurringValues("count");
                                      },
                                    },
                                    model: {
                                      value:
                                        e.initialRecurringData.cycleInterval,
                                      callback: function (t) {
                                        e.$set(
                                          e.initialRecurringData,
                                          "cycleInterval",
                                          t
                                        );
                                      },
                                      expression:
                                        "initialRecurringData.cycleInterval",
                                    },
                                  },
                                  e._l(
                                    e.initialRecurringData.repeatIntervalLabels,
                                    function (e, t) {
                                      return i("el-option", {
                                        key: t,
                                        attrs: {
                                          value: e.value,
                                          label: e.label,
                                        },
                                      });
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
                    "weekly" === e.initialRecurringData.cycle
                      ? i(
                          "el-row",
                          {
                            staticClass: "am-recurring-setup-weekly",
                            attrs: { gutter: 24 },
                          },
                          [
                            i(
                              "el-col",
                              { attrs: { sm: 24 } },
                              [
                                i(
                                  "el-form-item",
                                  {
                                    class: e.$root.settings.customization.forms
                                      ? "am-checkbox-btn-" +
                                        e.formType +
                                        "-" +
                                        e.formName
                                      : "",
                                    attrs: {
                                      label:
                                        e.labelOn ||
                                        e.$root.labels.recurring_on,
                                    },
                                  },
                                  [
                                    i(
                                      "el-checkbox-group",
                                      {
                                        attrs: { border: !0, size: "small" },
                                        on: {
                                          change: function (t) {
                                            return e.setRecurringValues("date");
                                          },
                                        },
                                        model: {
                                          value:
                                            e.initialRecurringData
                                              .weekDaysSelected,
                                          callback: function (t) {
                                            e.$set(
                                              e.initialRecurringData,
                                              "weekDaysSelected",
                                              t
                                            );
                                          },
                                          expression:
                                            "initialRecurringData.weekDaysSelected",
                                        },
                                      },
                                      e._l(e.weekDays, function (t, a) {
                                        return i(
                                          "el-checkbox-button",
                                          {
                                            key: a,
                                            attrs: {
                                              label: a,
                                              disabled: !t.enabled,
                                            },
                                          },
                                          [
                                            e._v(
                                              "\n                " +
                                                e._s(t.label) +
                                                "\n              "
                                            ),
                                          ]
                                        );
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
                        )
                      : e._e(),
                    e._v(" "),
                    "monthly" === e.initialRecurringData.cycle
                      ? i(
                          "el-row",
                          { attrs: { gutter: 24 } },
                          [
                            i(
                              "el-col",
                              { attrs: { sm: 24 } },
                              [
                                i(
                                  "el-form-item",
                                  {
                                    class: e.$root.settings.customization.forms
                                      ? "am-select-" +
                                        e.formType +
                                        "-" +
                                        e.formName
                                      : "",
                                    attrs: {
                                      label:
                                        e.labelOn ||
                                        e.$root.labels.recurring_on,
                                    },
                                  },
                                  [
                                    i(
                                      "el-select",
                                      {
                                        attrs: {
                                          "popper-class": e.$root.settings
                                            .customization.forms
                                            ? "am-dropdown-" +
                                              e.formType +
                                              "-" +
                                              e.formName
                                            : "",
                                        },
                                        on: {
                                          change: function (t) {
                                            return e.setRecurringValues("date");
                                          },
                                        },
                                        model: {
                                          value:
                                            e.initialRecurringData
                                              .monthDateRule,
                                          callback: function (t) {
                                            e.$set(
                                              e.initialRecurringData,
                                              "monthDateRule",
                                              t
                                            );
                                          },
                                          expression:
                                            "initialRecurringData.monthDateRule",
                                        },
                                      },
                                      e._l(
                                        e.monthlyWeekDayRepeat,
                                        function (t, a) {
                                          return i("el-option", {
                                            key: a,
                                            attrs: {
                                              value: t.value,
                                              label:
                                                t.label +
                                                (0 !== a
                                                  ? " " +
                                                    e.initialRecurringData
                                                      .selectedMonthlyWeekDayString
                                                  : ""),
                                            },
                                          });
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
                        )
                      : e._e(),
                    e._v(" "),
                    i(
                      "el-row",
                      {
                        style: {
                          opacity:
                            null !== e.initialRecurringData.cycle ? 1 : 0.2,
                          "pointer-events":
                            null !== e.initialRecurringData.cycle
                              ? "all"
                              : "none",
                        },
                        attrs: { gutter: 24 },
                      },
                      [
                        i(
                          "el-col",
                          {
                            staticClass: "v-calendar-column",
                            attrs: { sm: 12 },
                          },
                          [
                            i(
                              "el-form-item",
                              {
                                class: e.$root.settings.customization.forms
                                  ? "am-calendar-" +
                                    e.formType +
                                    "-" +
                                    e.formName
                                  : "",
                                attrs: {
                                  label:
                                    e.labelUntil ||
                                    e.$root.labels.recurring_until,
                                },
                              },
                              [
                                i("v-date-picker", {
                                  attrs: {
                                    "is-double-paned": !1,
                                    mode: "single",
                                    "popover-visibility": "focus",
                                    "popover-direction": "bottom",
                                    "popover-align": "center",
                                    "tint-color":
                                      e.$root.settings.customization
                                        .primaryColor,
                                    "input-class": "el-input__inner",
                                    "show-day-popover": !1,
                                    "input-props": { class: "el-input__inner" },
                                    "is-expanded": !1,
                                    "is-required": !0,
                                    formats: e.vCalendarFormats,
                                    "available-dates": {
                                      start: e.minFrom,
                                      end: e.maxUntil,
                                    },
                                    disabled:
                                      null === e.initialRecurringData.cycle,
                                  },
                                  on: {
                                    input: function (t) {
                                      return e.setRecurringValues("date");
                                    },
                                  },
                                  model: {
                                    value: e.initialRecurringData.maxDate,
                                    callback: function (t) {
                                      e.$set(
                                        e.initialRecurringData,
                                        "maxDate",
                                        t
                                      );
                                    },
                                    expression: "initialRecurringData.maxDate",
                                  },
                                }),
                              ],
                              1
                            ),
                          ],
                          1
                        ),
                        e._v(" "),
                        i(
                          "el-col",
                          {
                            staticClass: "am-recurring-setup-times",
                            attrs: { sm: 12 },
                          },
                          [
                            i(
                              "el-form-item",
                              {
                                class: e.$root.settings.customization.forms
                                  ? "am-input-number-" +
                                    e.formType +
                                    "-" +
                                    e.formName
                                  : "",
                                attrs: {
                                  label:
                                    e.labelTimes ||
                                    e.$root.labels.recurring_times,
                                },
                              },
                              [
                                i("el-input-number", {
                                  attrs: {
                                    min: 1,
                                    disabled:
                                      0 === e.initialRecurringData.cycle,
                                  },
                                  on: {
                                    change: function (t) {
                                      return e.setRecurringValues("count");
                                    },
                                  },
                                  model: {
                                    value: e.initialRecurringData.maxCount,
                                    callback: function (t) {
                                      e.$set(
                                        e.initialRecurringData,
                                        "maxCount",
                                        t
                                      );
                                    },
                                    expression: "initialRecurringData.maxCount",
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
                    e.isFrontend && e.selectedRecurringInterval
                      ? i(
                          "div",
                          {
                            staticClass: "am-recurring-setup-description",
                            class: e.$root.settings.customization.forms
                              ? "am-block-" + e.formType + "-" + e.formName
                              : "",
                          },
                          [
                            i("span", [
                              e._v(e._s(e.recurringData.recurringString)),
                            ]),
                            e._v(" "),
                            i("br"),
                            e._v(" "),
                            i("span", [
                              e._v(
                                e._s(
                                  e.$root.labels.recurring_from_text +
                                    " " +
                                    e.getFromDateFormatted() +
                                    " " +
                                    e.$root.labels.at +
                                    " " +
                                    e.getFromTimeFormatted()
                                )
                              ),
                            ]),
                          ]
                        )
                      : e._e(),
                    e._v(" "),
                    e.isFrontend
                      ? i(
                          "div",
                          { staticClass: "am-button-wrapper" },
                          [
                            i(
                              "transition",
                              { attrs: { name: "fade" } },
                              [
                                i(
                                  "el-button",
                                  {
                                    on: {
                                      click: function (t) {
                                        return e.cancelRecurringSetup();
                                      },
                                    },
                                  },
                                  [
                                    e._v(
                                      "\n            " +
                                        e._s(e.$root.labels.back) +
                                        "\n          "
                                    ),
                                  ]
                                ),
                              ],
                              1
                            ),
                            e._v(" "),
                            i(
                              "transition",
                              { attrs: { name: "fade" } },
                              [
                                i(
                                  "el-button",
                                  {
                                    staticClass: "am-recurring-continue",
                                    attrs: {
                                      disabled:
                                        !e.initialRecurringData.maxDate ||
                                        0 === e.recurringData.dates.length,
                                    },
                                    on: { click: e.confirmRecurringSetup },
                                  },
                                  [
                                    e._v(
                                      "\n            " +
                                        e._s(e.$root.labels.continue) +
                                        "\n          "
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
              ]
            ),
          ],
          1
        );
      },
      staticRenderFns: [],
    };
  },
  755: function (e, t, i) {
    var a;
    (a = function () {
      return (function (e) {
        function t(a) {
          if (i[a]) return i[a].exports;
          var o = (i[a] = { i: a, l: !1, exports: {} });
          return e[a].call(o.exports, o, o.exports, t), (o.l = !0), o.exports;
        }
        var i = {};
        return (
          (t.m = e),
          (t.c = i),
          (t.i = function (e) {
            return e;
          }),
          (t.d = function (e, i, a) {
            t.o(e, i) ||
              Object.defineProperty(e, i, {
                configurable: !1,
                enumerable: !0,
                get: a,
              });
          }),
          (t.n = function (e) {
            var i =
              e && e.__esModule
                ? function () {
                    return e.default;
                  }
                : function () {
                    return e;
                  };
            return t.d(i, "a", i), i;
          }),
          (t.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t);
          }),
          (t.p = "."),
          t((t.s = 9))
        );
      })([
        function (e, t, i) {
          "use strict";
          t.a = {
            prefix: "",
            suffix: "",
            thousands: ",",
            decimal: ".",
            precision: 2,
          };
        },
        function (e, t, i) {
          "use strict";
          var a = i(2),
            o = i(5),
            n = i(0);
          t.a = function (e, t) {
            if (t.value) {
              var s = i.i(o.a)(n.a, t.value);
              if ("INPUT" !== e.tagName.toLocaleUpperCase()) {
                var r = e.getElementsByTagName("input");
                1 !== r.length || (e = r[0]);
              }
              (e.oninput = function () {
                var t = e.value.length - e.selectionEnd;
                (e.value = i.i(a.a)(e.value, s)),
                  (t = Math.max(t, s.suffix.length)),
                  (t = e.value.length - t),
                  (t = Math.max(t, s.prefix.length + 1)),
                  i.i(a.b)(e, t),
                  e.dispatchEvent(i.i(a.c)("change"));
              }),
                (e.onfocus = function () {
                  i.i(a.b)(e, e.value.length - s.suffix.length);
                }),
                e.oninput(),
                e.dispatchEvent(i.i(a.c)("input"));
            }
          };
        },
        function (e, t, i) {
          "use strict";
          function a(e) {
            var t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : m.a;
            "number" == typeof e && (e = e.toFixed(s(t.precision)));
            var i = e.indexOf("-") >= 0 ? "-" : "",
              a = l(r(n(e), t.precision)).split("."),
              o = a[0],
              c = a[1];
            return (
              (o = (function (e, t) {
                return e.replace(/(\d)(?=(?:\d{3})+\b)/gm, "$1" + t);
              })(o, t.thousands)),
              t.prefix +
                i +
                (function (e, t, i) {
                  return t ? e + i + t : e;
                })(o, c, t.decimal) +
                t.suffix
            );
          }
          function o(e, t) {
            var i = e.indexOf("-") >= 0 ? -1 : 1,
              a = r(n(e), t);
            return parseFloat(a) * i;
          }
          function n(e) {
            return l(e).replace(/\D+/g, "") || "0";
          }
          function s(e) {
            return (function (e, t, i) {
              return Math.max(e, Math.min(t, i));
            })(0, e, 20);
          }
          function r(e, t) {
            var i = Math.pow(10, t);
            return (parseFloat(e) / i).toFixed(s(t));
          }
          function l(e) {
            return e ? e.toString() : "";
          }
          function c(e, t) {
            var i = function () {
              e.setSelectionRange(t, t);
            };
            e === document.activeElement && (i(), setTimeout(i, 1));
          }
          function u(e) {
            var t = document.createEvent("Event");
            return t.initEvent(e, !0, !0), t;
          }
          var m = i(0);
          i.d(t, "a", function () {
            return a;
          }),
            i.d(t, "d", function () {
              return o;
            }),
            i.d(t, "b", function () {
              return c;
            }),
            i.d(t, "c", function () {
              return u;
            });
        },
        function (e, t, i) {
          "use strict";
          function a(e, t) {
            t &&
              Object.keys(t).map(function (e) {
                r.a[e] = t[e];
              }),
              e.directive("money", s.a),
              e.component("money", n.a);
          }
          Object.defineProperty(t, "__esModule", { value: !0 });
          var o = i(6),
            n = i.n(o),
            s = i(1),
            r = i(0);
          i.d(t, "Money", function () {
            return n.a;
          }),
            i.d(t, "VMoney", function () {
              return s.a;
            }),
            i.d(t, "options", function () {
              return r.a;
            }),
            i.d(t, "VERSION", function () {
              return l;
            });
          var l = "0.8.1";
          (t.default = a),
            "undefined" != typeof window && window.Vue && window.Vue.use(a);
        },
        function (e, t, i) {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
          var a = i(1),
            o = i(0),
            n = i(2);
          t.default = {
            name: "Money",
            props: {
              value: { required: !0, type: [Number, String], default: 0 },
              masked: { type: Boolean, default: !1 },
              precision: {
                type: Number,
                default: function () {
                  return o.a.precision;
                },
              },
              decimal: {
                type: String,
                default: function () {
                  return o.a.decimal;
                },
              },
              thousands: {
                type: String,
                default: function () {
                  return o.a.thousands;
                },
              },
              prefix: {
                type: String,
                default: function () {
                  return o.a.prefix;
                },
              },
              suffix: {
                type: String,
                default: function () {
                  return o.a.suffix;
                },
              },
            },
            directives: { money: a.a },
            data: function () {
              return { formattedValue: "" };
            },
            watch: {
              value: {
                immediate: !0,
                handler: function (e, t) {
                  var a = i.i(n.a)(e, this.$props);
                  a !== this.formattedValue && (this.formattedValue = a);
                },
              },
            },
            methods: {
              change: function (e) {
                this.$emit(
                  "input",
                  this.masked
                    ? e.target.value
                    : i.i(n.d)(e.target.value, this.precision)
                );
              },
            },
          };
        },
        function (e, t, i) {
          "use strict";
          t.a = function (e, t) {
            return (
              (e = e || {}),
              (t = t || {}),
              Object.keys(e)
                .concat(Object.keys(t))
                .reduce(function (i, a) {
                  return (i[a] = void 0 === t[a] ? e[a] : t[a]), i;
                }, {})
            );
          };
        },
        function (e, t, i) {
          var a = i(7)(i(4), i(8), null, null);
          e.exports = a.exports;
        },
        function (e, t) {
          e.exports = function (e, t, i, a) {
            var o,
              n = (e = e || {}),
              s = typeof e.default;
            ("object" !== s && "function" !== s) || ((o = e), (n = e.default));
            var r = "function" == typeof n ? n.options : n;
            if (
              (t &&
                ((r.render = t.render),
                (r.staticRenderFns = t.staticRenderFns)),
              i && (r._scopeId = i),
              a)
            ) {
              var l = r.computed || (r.computed = {});
              Object.keys(a).forEach(function (e) {
                var t = a[e];
                l[e] = function () {
                  return t;
                };
              });
            }
            return { esModule: o, exports: n, options: r };
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
        function (e, t, i) {
          e.exports = i(3);
        },
      ]);
    }),
      (e.exports = a());
  },
  757: function (e, t, i) {
    "use strict";
    t.a = {
      data: function () {
        return {};
      },
      methods: {
        getPaymentData: function (e, t, i, a) {
          var o = {};
          if (((o.paymentId = e), t)) {
            (o.bookableType = "appointment"),
              (o.bookings = t.bookings),
              (o.bookingStart = t.bookingStart),
              (o.bookableName = this.getServiceById(t.serviceId).name);
            var n = this.getProviderById(t.providerId);
            (n.fullName = n.firstName + " " + n.lastName),
              (o.providers = [n]),
              t.bookings.forEach(function (t) {
                t.payments.forEach(function (i) {
                  i.id === e && (o.customer = t.customer);
                });
              });
          }
          return (
            i &&
              ((o.bookableType = "event"),
              (o.bookings = i.bookings),
              (o.bookingStart = i.periods[0].periodStart),
              (o.bookableName = i.name),
              (o.providers = i.providers),
              i.bookings.forEach(function (t) {
                t.payments.forEach(function (i) {
                  i.id === e && (o.customer = t.customer);
                });
              })),
            a &&
              ((o.bookableType = "package"),
              (o.bookings = []),
              (o.bookingStart = null),
              (o.bookableName = a.name),
              (o.providers = []),
              (o.bookings = [])),
            o
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
  789: function (e, t, i) {
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
        getAppointmentPrice: function (e, t, i, a) {
          var o = 0,
            n = this,
            s = parseInt(e) !== parseInt(t.id);
          return (
            i.forEach(function (e) {
              e.payments.forEach(function () {
                ["approved", "pending"].includes(e.status) &&
                  (o += n.getBookingPrice(
                    e,
                    s,
                    s ? t.price : e.price,
                    e.aggregatedPrice
                  ));
              }),
                0 !== e.payments.length ||
                  a ||
                  (o += n.getBookingPrice(e, !0, t.price, t.aggregatedPrice));
            }),
            this.getFormattedPrice(
              o >= 0 ? o : 0,
              !this.$root.settings.payments.hideCurrencySymbolFrontend
            )
          );
        },
        getBookingPrice: function (e, t, i, a) {
          var o = 0;
          e.extras.forEach(function (t) {
            if (void 0 === t.selected || !0 === t.selected) {
              var i = null === t.aggregatedPrice ? a : t.aggregatedPrice;
              o += t.price * t.quantity * (i ? e.persons : 1);
            }
          });
          var n = (t ? i : e.price) * (a ? e.persons : 1) + o;
          return (
            n -
            ((n / 100) * (e.coupon ? e.coupon.discount : 0) +
              (e.coupon ? e.coupon.deduction : 0))
          );
        },
      },
    };
  },
  790: function (e, t, i) {
    var a = i(685)(i(793), i(794), !1, null, null, null);
    e.exports = a.exports;
  },
  793: function (e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.default = {
        mixins: [],
        props: { params: null, visible: !1, label: "", count: 0, show: null },
        data: function () {
          return { currentPage: null };
        },
        methods: {
          change: function () {
            this.$emit("change");
          },
        },
        computed: {
          paginationMessage: function () {
            return (
              this.$root.labels.showing +
              " " +
              (this.params.page * this.getItemsPerPage -
                this.getItemsPerPage +
                1) +
              " " +
              this.$root.labels.to +
              " " +
              (this.params.page * this.getItemsPerPage > this.count
                ? this.count
                : this.params.page * this.getItemsPerPage) +
              " " +
              this.$root.labels.of +
              " " +
              this.count +
              " " +
              this.label
            );
          },
          getItemsPerPage: function () {
            return void 0 === this.show || null === this.show
              ? this.$root.settings.general.itemsPerPage
              : this.show;
          },
        },
      });
  },
  794: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          i = e._self._c || t;
        return i(
          "div",
          {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: e.visible,
                expression: "visible",
              },
            ],
            staticClass: "am-pagination am-section",
          },
          [
            i(
              "el-row",
              [
                i("el-col", { attrs: { sm: 8 } }, [
                  i("p", [e._v(e._s(e.paginationMessage))]),
                ]),
                e._v(" "),
                i(
                  "el-col",
                  { attrs: { sm: 16 } },
                  [
                    i("el-pagination", {
                      attrs: {
                        layout: "prev, pager, next",
                        "page-size": e.getItemsPerPage,
                        total: e.count,
                        "current-page": e.params.page,
                      },
                      on: {
                        "update:currentPage": function (t) {
                          return e.$set(e.params, "page", t);
                        },
                        "update:current-page": function (t) {
                          return e.$set(e.params, "page", t);
                        },
                        "current-change": e.change,
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
        );
      },
      staticRenderFns: [],
    };
  },
  823: function (e, t, i) {
    var a = i(685)(i(824), i(825), !1, null, null, null);
    e.exports = a.exports;
  },
  824: function (e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = i(694),
      o = i(337),
      n = i(695);
    t.default = {
      mixins: [a.a, o.a, n.a],
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
          i = e._self._c || t;
        return i(
          "div",
          { staticClass: "am-dialog-table am-custom-fields-container" },
          e._l(e.appointment.bookings, function (t, a) {
            return i(
              "div",
              { staticClass: "am-customer-extras" },
              [
                i(
                  "el-row",
                  { staticClass: "am-customer-extras-data" },
                  [
                    e.showCustomerInfo
                      ? i("el-col", [
                          i("h3", [
                            e._v(
                              e._s(t.customer.firstName) +
                                " " +
                                e._s(t.customer.lastName)
                            ),
                          ]),
                          e._v(" "),
                          i("span", [e._v(e._s(t.customer.email))]),
                        ])
                      : e._e(),
                  ],
                  1
                ),
                e._v(" "),
                i(
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
                          e.appointment.bookings[a].customFields[t.id].value &&
                          e.appointment.bookings[a].customFields[t.id].value
                            .length > 0))
                      ? i(
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
                                    a +
                                    ".customFields." +
                                    t.id +
                                    ".value"
                                  : null,
                            },
                          },
                          [
                            "text" === t.type
                              ? i("el-input", {
                                  attrs: { placeholder: "" },
                                  on: {
                                    input: function (t) {
                                      return e.clearValidation();
                                    },
                                  },
                                  model: {
                                    value:
                                      e.appointment.bookings[a].customFields[
                                        t.id
                                      ].value,
                                    callback: function (i) {
                                      e.$set(
                                        e.appointment.bookings[a].customFields[
                                          t.id
                                        ],
                                        "value",
                                        i
                                      );
                                    },
                                    expression:
                                      "appointment.bookings[key].customFields[customField.id].value",
                                  },
                                })
                              : "text-area" === t.type
                              ? i("el-input", {
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
                                      e.appointment.bookings[a].customFields[
                                        t.id
                                      ].value,
                                    callback: function (i) {
                                      e.$set(
                                        e.appointment.bookings[a].customFields[
                                          t.id
                                        ],
                                        "value",
                                        i
                                      );
                                    },
                                    expression:
                                      "appointment.bookings[key].customFields[customField.id].value",
                                  },
                                })
                              : "select" === t.type
                              ? i(
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
                                        e.appointment.bookings[a].customFields[
                                          t.id
                                        ].value,
                                      callback: function (i) {
                                        e.$set(
                                          e.appointment.bookings[a]
                                            .customFields[t.id],
                                          "value",
                                          i
                                        );
                                      },
                                      expression:
                                        "appointment.bookings[key].customFields[customField.id].value",
                                    },
                                  },
                                  e._l(
                                    e.getCustomFieldOptions(t.options),
                                    function (e, t) {
                                      return i("el-option", {
                                        key: t,
                                        attrs: { value: e, label: e },
                                      });
                                    }
                                  ),
                                  1
                                )
                              : "checkbox" === t.type
                              ? i(
                                  "el-checkbox-group",
                                  {
                                    on: {
                                      change: function (t) {
                                        return e.clearValidation();
                                      },
                                    },
                                    model: {
                                      value:
                                        e.appointment.bookings[a].customFields[
                                          t.id
                                        ].value,
                                      callback: function (i) {
                                        e.$set(
                                          e.appointment.bookings[a]
                                            .customFields[t.id],
                                          "value",
                                          i
                                        );
                                      },
                                      expression:
                                        "appointment.bookings[key].customFields[customField.id].value",
                                    },
                                  },
                                  e._l(
                                    e.getCustomFieldOptions(t.options),
                                    function (e, t) {
                                      return i("el-checkbox", {
                                        key: t,
                                        attrs: { label: e },
                                      });
                                    }
                                  ),
                                  1
                                )
                              : "radio" === t.type
                              ? i(
                                  "el-radio-group",
                                  {
                                    model: {
                                      value:
                                        e.appointment.bookings[a].customFields[
                                          t.id
                                        ].value,
                                      callback: function (i) {
                                        e.$set(
                                          e.appointment.bookings[a]
                                            .customFields[t.id],
                                          "value",
                                          i
                                        );
                                      },
                                      expression:
                                        "appointment.bookings[key].customFields[customField.id].value",
                                    },
                                  },
                                  e._l(
                                    e.getCustomFieldOptions(t.options),
                                    function (t, a) {
                                      return i("el-radio", {
                                        key: a,
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
                                  e.appointment.bookings[a].customFields[t.id]
                                    .value,
                                  function (o, n) {
                                    return i(
                                      "div",
                                      {
                                        staticStyle: {
                                          margin: "15px",
                                          clear: "left",
                                        },
                                      },
                                      [
                                        i(
                                          "a",
                                          {
                                            key: n,
                                            attrs: {
                                              href: e.$root.useUploadsAmeliaPath
                                                ? e.$root.getAjaxUrl +
                                                  "/fields/" +
                                                  t.id +
                                                  "/" +
                                                  e.appointment.bookings[a].id +
                                                  "/" +
                                                  n +
                                                  (e.isCabinet
                                                    ? "&source=cabinet-provider"
                                                    : "")
                                                : e.$root.getUploadsAmeliaUrl +
                                                  e.appointment.bookings[a].id +
                                                  "_" +
                                                  o.fileName,
                                              target: "_blank",
                                            },
                                          },
                                          [
                                            e._v(
                                              "\n            " +
                                                e._s(o.name) +
                                                "\n          "
                                            ),
                                          ]
                                        ),
                                      ]
                                    );
                                  }
                                )
                              : "datepicker" === t.type
                              ? i(
                                  "div",
                                  [
                                    i("v-date-picker", {
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
                                          e.appointment.bookings[a]
                                            .customFields[t.id].value,
                                        callback: function (i) {
                                          e.$set(
                                            e.appointment.bookings[a]
                                              .customFields[t.id],
                                            "value",
                                            i
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
  826: function (e, t, i) {
    var a = i(685)(i(827), i(828), !1, null, null, null);
    e.exports = a.exports;
  },
  827: function (e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = i(713),
      o = i.n(a),
      n = i(696),
      s = i.n(n),
      r = i(687),
      l = i(337),
      c = i(691),
      u = i(686);
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
      components: { PhoneInput: s.a, DialogActions: o.a },
    };
  },
  828: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          i = e._self._c || t;
        return i(
          "div",
          [
            i(
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
                i("div", { staticClass: "am-dialog-loader-content" }, [
                  i("img", {
                    attrs: { src: e.$root.getUrl + "public/img/spinner.svg" },
                  }),
                  e._v(" "),
                  i("p", [e._v(e._s(e.$root.labels.loader_message))]),
                ]),
              ]
            ),
            e._v(" "),
            e.dialogLoading
              ? e._e()
              : i(
                  "div",
                  {
                    staticClass: "am-dialog-scrollable",
                    class: { "am-edit": 0 !== e.customer.id },
                  },
                  [
                    i(
                      "div",
                      { staticClass: "am-dialog-header" },
                      [
                        i(
                          "el-row",
                          [
                            i("el-col", { attrs: { span: 18 } }, [
                              0 !== e.customer.id
                                ? i("h2", [
                                    e._v(e._s(e.$root.labels.edit_customer)),
                                  ])
                                : i("h2", [
                                    e._v(e._s(e.$root.labels.new_customer)),
                                  ]),
                            ]),
                            e._v(" "),
                            i(
                              "el-col",
                              {
                                staticClass: "align-right",
                                attrs: { span: 6 },
                              },
                              [
                                i("span"),
                                e._v(" "),
                                i("el-button", {
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
                    i(
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
                        i(
                          "el-form-item",
                          {
                            attrs: {
                              label: e.$root.labels.first_name + ":",
                              prop: "firstName",
                            },
                          },
                          [
                            i("el-input", {
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
                        i(
                          "el-form-item",
                          {
                            attrs: {
                              label: e.$root.labels.last_name + ":",
                              prop: "lastName",
                            },
                          },
                          [
                            i("el-input", {
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
                        i(
                          "el-form-item",
                          {
                            attrs: {
                              label: e.$root.labels.email + ":",
                              prop: "email",
                              error: e.errors.email,
                            },
                          },
                          [
                            i("el-input", {
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
                        i(
                          "el-form-item",
                          { attrs: { label: "placeholder" } },
                          [
                            i(
                              "label",
                              { attrs: { slot: "label" }, slot: "label" },
                              [
                                e._v(
                                  "\n          " +
                                    e._s(e.$root.labels.wp_user) +
                                    ":\n          "
                                ),
                                i(
                                  "el-tooltip",
                                  { attrs: { placement: "top" } },
                                  [
                                    i("div", {
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
                                    i("i", {
                                      staticClass:
                                        "el-icon-question am-tooltip-icon",
                                    }),
                                  ]
                                ),
                              ],
                              1
                            ),
                            e._v(" "),
                            i(
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
                                i(
                                  "div",
                                  { staticClass: "am-drop" },
                                  [
                                    e.customer && e.customer.email
                                      ? i(
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
                                      return i("el-option", {
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
                        i(
                          "el-form-item",
                          { attrs: { label: e.$root.labels.phone + ":" } },
                          [
                            i("phone-input", {
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
                        i(
                          "el-form-item",
                          { attrs: { label: e.$root.labels.gender + ":" } },
                          [
                            i(
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
                                return i("el-option", {
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
                        i(
                          "el-form-item",
                          {
                            attrs: {
                              label: e.$root.labels.date_of_birth + ":",
                            },
                          },
                          [
                            i("v-date-picker", {
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
                        i("div", { staticClass: "am-divider" }),
                        e._v(" "),
                        i(
                          "el-form-item",
                          {
                            attrs: {
                              label: e.$root.labels.note_internal + ":",
                            },
                          },
                          [
                            i("el-input", {
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
              : i("dialog-actions", {
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
  829: function (e, t, i) {
    var a = i(685)(i(830), i(831), !1, null, null, null);
    e.exports = a.exports;
  },
  830: function (e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = i(687),
      o = i(337);
    t.default = {
      mixins: [a.a, o.a],
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
            i = function (i) {
              if (e.data.hasOwnProperty(i))
                if (e.data[i] instanceof Array || e.data[i] instanceof Object) {
                  var a = Object.keys(e.data[i]).map(function (t) {
                    return e.data[i][t];
                  });
                  for (var o in a)
                    if ("" !== a[o]) {
                      var n = "";
                      "" !==
                        (n =
                          a[o] instanceof Date
                            ? a[o] instanceof Date
                              ? e.getDatabaseFormattedDate(a[o])
                              : a[o]
                            : a[o] instanceof Object && !0 === a[o].checked
                            ? a[o].value
                            : a[o]) &&
                        t.push(i + "[" + o + "]=" + encodeURIComponent(n));
                    }
                } else
                  "" !== e.data[i] &&
                    t.push(i + "=" + encodeURIComponent(e.data[i]));
            };
          for (var a in this.data) i(a);
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
          i = e._self._c || t;
        return i("div", [
          i(
            "div",
            { staticClass: "am-dialog-scrollable" },
            [
              i(
                "div",
                { staticClass: "am-dialog-header" },
                [
                  i(
                    "el-row",
                    [
                      i("el-col", { attrs: { span: 14 } }, [
                        i("h2", [e._v(e._s(e.$root.labels.export))]),
                      ]),
                      e._v(" "),
                      i(
                        "el-col",
                        { staticClass: "align-right", attrs: { span: 10 } },
                        [
                          i("el-button", {
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
              i(
                "el-form",
                { attrs: { "label-position": "top" } },
                [
                  i(
                    "el-form-item",
                    { attrs: { label: e.$root.labels.csv_delimiter + ":" } },
                    [
                      i(
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
                          return i("el-option", {
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
                    ? i(
                        "el-form-item",
                        {
                          attrs: {
                            label: e.$root.labels.select_rows_settings + ":",
                          },
                        },
                        [
                          i(
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
                              i("el-option", {
                                attrs: {
                                  label: this.$root.labels.exported_same_row,
                                  value: !1,
                                },
                              }),
                              e._v(" "),
                              i("el-option", {
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
                      i("el-checkbox", {
                        attrs: { checked: "", label: t.label, border: "" },
                        on: { change: e.changeFields },
                        model: {
                          value: t.checked,
                          callback: function (i) {
                            e.$set(t, "checked", i);
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
          i("div", { staticClass: "am-dialog-footer" }, [
            i(
              "div",
              { staticClass: "am-dialog-footer-actions" },
              [
                i(
                  "el-row",
                  [
                    i(
                      "el-col",
                      { staticClass: "align-right", attrs: { sm: 24 } },
                      [
                        i(
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
                        i(
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
  886: function (e, t, i) {
    "use strict";
    var a = i(694),
      o = i(337),
      n = i(701);
    t.a = {
      mixins: [a.a, n.a, o.a],
      data: function () {
        return {
          recurringAppointments: [],
          customerCreatedCount: 0,
          appointment: null,
          bookings: [],
          duplicateEvent: !1,
          exportAction: "",
          exportParams: {
            fields: [
              {
                label: this.$root.labels.customers,
                value: "customers",
                checked: !0,
              },
              {
                label: this.$root.labels.employee,
                value: "employee",
                checked: !0,
              },
              { // p2p: add location checkbox for exporting available fields
                label: this.$root.labels.location,
                value: "location",
                checked: !0,
              },
              {
                label: this.$root.labels.service,
                value: "service",
                checked: !0,
              },
              {
                label: this.$root.labels.start_time,
                value: "startTime",
                checked: !0,
              },
              {
                label: this.$root.labels.end_time,
                value: "endTime",
                checked: !0,
              },
              { label: this.$root.labels.note, value: "note", checked: false },
              { label: this.$root.labels.status, value: "status", checked: !0 },
              {
                label: this.$root.labels.custom_fields,
                value: "customFields",
                checked: false,
              },
              {
                label: this.$root.labels.ph_booking_number_of_persons,
                value: "persons",
                checked: !0,
              },
            ],
          },
          savedAppointment: null,
          statuses: [
            { value: "approved", label: this.$root.labels.approved },
            { value: "pending", label: this.$root.labels.pending },
            { value: "canceled", label: this.$root.labels.canceled },
            { value: "rejected", label: this.$root.labels.rejected },
          ],
          options: {
            fetched: !1,
            availableEntitiesIds: {
              packages: [],
              categories: [],
              employees: [],
              locations: [],
              services: [],
            },
            entities: {
              categories: [],
              customers: [],
              customFields: [],
              employees: [],
              locations: [],
              services: [],
            },
          },
        };
      },
      methods: {
        getInitAppointmentObject: function () {
          return {
            id: 0,
            bookings: [],
            categoryId: "",
            serviceId: "",
            providerId: "",
            locationId: "",
            selectedDate: null,
            selectedPeriod: "",
            status: this.$root.settings.general.defaultAppointmentStatus,
            internalNotes: "",
            notifyParticipants:
              this.$root.settings.notifications.notifyCustomers,
            dateTimeSlots: [],
            calendarTimeSlots: [],
            extrasTotalPrice: 0,
            serviceTotalPrice: 0,
            discountTotalPrice: 0,
            providerServiceMinCapacity: 0,
            providerServiceMaxCapacity: 0,
            extrasCount: 0,
            extrasSelectedCount: 0,
            duration: 0,
          };
        },
        showDialogNewAppointment: function () {
          var e = this;
          this.setBookings(0),
            (this.savedAppointment = null),
            (this.dialogAppointment = !0),
            setTimeout(function () {
              e.appointment = e.getInitAppointmentObject();
            }, 500);
        },
        showDialogEditAppointment: function (e) {
          var t = this;
          (this.dialogAppointment = !0),
            setTimeout(function () {
              t.getAppointment(e);
            }, 500);
        },
        closeDialogAppointment: function () {
          var e =
            arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
          (this.duplicateEvent = e), (this.dialogAppointment = !1);
        },
        setBookings: function (e) {
          var t = [],
            i = this;
          this.options.entities.customers.forEach(function (a) {
            if ("hidden" !== a.status) {
              var o = 0,
                n = [],
                s = [],
                r = null,
                l = 0,
                c = 1,
                u = null,
                m = null,
                d = JSON.stringify({
                  firstName: a.firstName,
                  lastName: a.lastName,
                  email: a.email,
                  phone: a.phone,
                });
              i.appointment &&
                e &&
                i.appointment.bookings.forEach(function (e) {
                  e.customerId === a.id &&
                    ((o = e.id),
                    (n = e.extras),
                    (s = e.payments),
                    (l = e.price),
                    (c = e.persons),
                    (r = e.coupon),
                    (d = e.info),
                    (u = e.aggregatedPrice),
                    (m = e.packageCustomerService));
                }),
                t.push({
                  id: o,
                  customer: a,
                  status: i.$root.settings.general.defaultAppointmentStatus,
                  persons: c,
                  total: 0,
                  extras: n,
                  payments: s,
                  price: l,
                  coupon: r,
                  added: !1,
                  info: d,
                  aggregatedPrice: u,
                  packageCustomerService: m,
                  customFields: {},
                });
            }
          }),
            (this.bookings = t);
        },
        getAppointment: function (e) {
          var t = this,
            i = null,
            a = "";
          void 0 !== this.$store &&
            void 0 !== this.$store.state.cabinet &&
            "provider" === this.$store.state.cabinet.cabinetType &&
            ((a =
              "" === this.$store.state.cabinet.timeZone
                ? "UTC"
                : this.$store.state.cabinet.timeZone),
            (i = Object.assign(this.getAuthorizationHeaderObject(), {
              params: {
                source: "cabinet-" + this.$store.state.cabinet.cabinetType,
                timeZone: a,
              },
            }))),
            this.$http
              .get(this.$root.getAjaxUrl + "/appointments/" + e, i)
              .then(function (i) {
                var o = t;
                (t.savedAppointment = JSON.parse(
                  JSON.stringify(i.data.data.appointment)
                )),
                  (t.savedAppointment.categoryId = t.getServiceById(
                    t.savedAppointment.serviceId
                  ).categoryId),
                  (t.appointment = Object.assign(
                    t.getInitAppointmentObject(),
                    i.data.data.appointment
                  )),
                  (t.appointment.notifyParticipants =
                    !!t.appointment.notifyParticipants),
                  "UTC" === a &&
                    ((t.appointment.bookingStart =
                      t.getConvertedUtcToLocalDateTime(
                        t.appointment.bookingStart
                      )),
                    (t.appointment.bookingEnd =
                      t.getConvertedUtcToLocalDateTime(
                        t.appointment.bookingEnd
                      )),
                    (t.savedAppointment.bookingStart =
                      t.getConvertedUtcToLocalDateTime(
                        t.savedAppointment.bookingStart
                      )),
                    (t.savedAppointment.bookingEnd =
                      t.getConvertedUtcToLocalDateTime(
                        t.savedAppointment.bookingEnd
                      ))),
                  t.appointment.bookings.forEach(function (e) {
                    var t = null;
                    o.options.entities.services.forEach(function (e) {
                      e.id === o.appointment.serviceId &&
                        (t = JSON.parse(JSON.stringify(e.extras))).forEach(
                          function (e) {
                            (e.quantity = 1), (e.selected = !1);
                          }
                        );
                    }),
                      (e.customer = null),
                      (e.added = !1),
                      o.options.entities.customers.forEach(function (t) {
                        if (t.id === e.customerId) {
                          e.customer = t;
                          var i = o.getCustomerInfo(e);
                          0 !== e.id &&
                            i &&
                            (e.info = JSON.stringify({
                              firstName: i.firstName,
                              lastName: i.lastName,
                              email: i.email,
                              phone: i.phone,
                            })),
                            (e.added = !0);
                        }
                      }),
                      e.extras.forEach(function (e) {
                        t.forEach(function (t) {
                          t.extraId === e.extraId &&
                            ((t.id = e.id),
                            (t.selected = !0),
                            (t.quantity = e.quantity ? e.quantity : 1),
                            (t.price = e.price),
                            (t.aggregatedPrice = e.aggregatedPrice));
                        });
                      }),
                      t.forEach(function (e) {
                        e.selected || (e.id = 0);
                      }),
                      (e.extras = t),
                      ("[]" !== e.customFields && null !== e.customFields) ||
                        (e.customFields = "{}"),
                      (e.customFields = JSON.parse(e.customFields));
                  }),
                  t.setBookings(e),
                  (t.recurringAppointments = i.data.data.recurring);
              })
              .catch(function (e) {
                console.log(e.message);
              });
        },
        sortBookings: function (e) {
          e.sort(function (e, t) {
            return (
              e.customer.firstName +
              " " +
              e.customer.lastName
            ).localeCompare(t.customer.firstName + " " + t.customer.lastName);
          });
        },
        duplicateAppointmentCallback: function (e) {
          var t = this;
          (this.appointment = e),
            (this.appointment.id = 0),
            (this.appointment.selectedDate = null),
            (this.appointment.selectedPeriod = ""),
            (this.appointment.dateTimeSlots = []),
            (this.appointment.calendarTimeSlots = []),
            setTimeout(function () {
              t.dialogAppointment = !0;
            }, 300);
        },
        getCustomersFromGroup: function (e) {
          var t = this,
            i = "";
          return (
            e.bookings.forEach(function (e) {
              if (t.options.entities.customers.length) {
                var a = t.getCustomerInfo(e);
                a &&
                  (i +=
                    '<span class="am-appointment-status-symbol ' +
                    e.status +
                    '"></span><span>' +
                    a.firstName +
                    " " +
                    a.lastName +
                    "</span><br>");
              }
            }),
            i
          );
        },
        saveCustomerCallback: function (e) {
          delete e.user.birthday, this.options.entities.customers.push(e.user);
          var t = {
            id: 0,
            customer: e.user,
            customerId: e.user.id,
            status: this.$root.settings.general.defaultAppointmentStatus,
            persons: 1,
            total: 0,
            extras:
              this.appointment && this.appointment.serviceId
                ? this.getServiceById(this.appointment.serviceId).extras
                : [],
            payments: [],
            coupon: null,
            info: JSON.stringify({
              firstName: e.user.firstName,
              lastName: e.user.lastName,
              email: e.user.email,
              phone: e.user.phone,
            }),
            customFields: [],
            added: !0,
          };
          this.bookings.push(t),
            this.sortBookings(this.bookings),
            null !== this.appointment &&
              (this.appointment.bookings.push(t),
              this.sortBookings(this.appointment.bookings)),
            this.setBookingCustomFields(),
            this.customerCreatedCount++;
        },
        updateAppointmentStatus: function (e, t, i) {
          var a = this;
          (this.updateStatusDisabled = !0),
            this.form
              .post(this.$root.getAjaxUrl + "/appointments/status/" + e.id, {
                status: t,
              })
              .then(function (o) {
                i && a.setTotalStatusCounts(e, t, o.data.status),
                  a.notify(
                    e.status === o.data.status
                      ? a.$root.labels.success
                      : a.$root.labels.error,
                    o.data.message,
                    e.status === o.data.status ? "success" : "error"
                  ),
                  (e.status = o.data.status),
                  (a.updateStatusDisabled = !1);
              })
              .catch(function (t) {
                "timeSlotUnavailable" in t.response.data.data &&
                  !0 === t.response.data.data.timeSlotUnavailable &&
                  (a.notify(
                    a.$root.labels.error,
                    a.$root.labels.time_slot_unavailable,
                    "error"
                  ),
                  (e.status = t.response.data.data.status)),
                  (a.updateStatusDisabled = !1);
              });
        },
        packageTooltipContent: function (e) {
          var t = this.bookingTypeCountInPackage(e),
            i = "";
          for (var a in (t.regular &&
            (i +=
              t.regular +
              "/" +
              e.length +
              " " +
              this.$root.labels.bookings_regular_tooltip +
              "<br/>"),
          t.package)) {
            var o = this.getPackageById(parseInt(a));
            i +=
              t.package[a].count +
              "/" +
              e.length +
              " " +
              this.$root.labels.bookings_package_tooltip +
              " <strong>" +
              (o ? o.name : "Package") +
              "</strong><br/>";
          }
          return i;
        },
        bookingTypeCountInPackage: function (e) {
          for (var t = { regular: 0, package: {} }, i = 0; i < e.length; i++)
            if (null !== e[i].packageCustomerService) {
              var a = e[i].packageCustomerService.packageCustomer.packageId,
                o = e[i].packageCustomerService.packageCustomer.payment;
              a in t.package
                ? (t.package[a].count++,
                  (t.package[a].payment += o ? o.ampunt : 0))
                : (t.package[a] = { count: 1, price: o ? o.amount : 0 });
            } else t.regular++;
          return t;
        },
        getAppointmentPaymentMethods: function (e) {
          var t = [];
          return (
            e.forEach(function (e) {
              var i = e.payments.length ? e.payments[0].gateway : null;
              null !== i && -1 === t.indexOf(i) && t.push(i);
            }),
            t
          );
        },
        editPayment: function (e) {
          (this.selectedPaymentModalData = this.getPaymentData(
            e.payment.id,
            e.package ? null : this.savedAppointment,
            null,
            e.package
          )),
            (this.selectedPaymentModalData.customer = this.getCustomerById(
              e.payment.customerId
            )),
            e.package &&
              (this.selectedPaymentModalData.bookings[0] = {
                price: e.booking.packageCustomerService.packageCustomer.price,
                payments: [e.payment],
                extras: [],
              }),
            (this.dialogPayment = !0);
        },
        updatePaymentCallback: function (e) {
          this.appointment.bookings.forEach(function (t) {
            t.payments.forEach(function (i, a) {
              i.id === e && t.payments.splice(a, 1);
            });
          }),
            (this.dialogPayment = !1);
        },
      },
      watch: {
        dialogAppointment: function () {
          !1 === this.dialogAppointment &&
            !1 === this.duplicateEvent &&
            (this.appointment = null);
        },
      },
    };
  },
  887: function (e, t, i) {
    var a = i(685)(i(888), i(892), !1, null, null, null);
    e.exports = a.exports;
  },
  888: function (e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = i(699),
      o = i(789),
      n = i(694),
      s = i(337),
      r = i(713),
      l = i.n(r),
      c = i(889),
      u = i.n(c),
      m = i(823),
      d = i.n(m),
      p = i(690),
      f = i(686),
      h = i(687),
      g = i(0),
      v = i.n(g),
      b = i(691),
      y = i(689),
      _ = i(746),
      C = i.n(_),
      k = i(705),
      D = i(749),
      x = i.n(D),
      S = i(695),
      w = i(743);
    t.default = {
      mixins: [w.a, p.a, h.a, s.a, b.a, y.a, n.a, o.a, k.a, f.a, S.a, a.a],
      props: {
        selectedTimeZone: "",
        appointment: null,
        recurringAppointments: null,
        savedAppointment: null,
        bookings: null,
        options: null,
        customerCreatedCount: 0,
        showHeader: { required: !1, default: !0, type: Boolean },
        haveDuplicate: { required: !1, default: !0, type: Boolean },
        hideAttachmentCustomField: { required: !1, default: !1, type: Boolean },
        isCabinet: { type: Boolean, default: !1, required: !1 },
      },
      data: function () {
        var e = this,
          t = function (t, i, a) {
            i || (e.newAppointmentTabs = "schedule"), a();
          };
        return {
          coupon: null,
          showCoupon: !1,
          clonedBookings: null,
          cachedClonedBookings: [],
          serviceUpdated: !1,
          calendarUpdated: !1,
          recurringDatesChanged: !1,
          selectedRecurringDates: [],
          activeRecurring: !1,
          initialRecurringData: null,
          recurringData: {
            dates: [],
            startDate: null,
            startTime: null,
            defaultEmployeeId: null,
            defaultLocationId: null,
            pageRecurringDates: [],
            pagination: {
              show: this.$root.settings.general.itemsPerPage,
              page: 1,
              count: 0,
            },
            recurringString: "",
            datesCallback: null,
            setupCallback: null,
          },
          isProviderService: !0,
          availableDates: [],
          categorySpinnerActive: !1,
          dialogLoading: !0,
          disabledWeekdays: null,
          employeeSpinnerActive: !1,
          filter: null,
          locationSpinnerActive: !1,
          mounted: !1,
          newAppointmentTabs: "schedule",
          serviceSpinnerActive: !1,
          statusMessage: "",
          loadingTimeSlots: !1,
          payment: { amount: 0, gateway: "onSite" },
          rulesInit: {
            bookings: [
              {
                required: !0,
                message: this.$root.labels.select_customer_warning,
                trigger: "submit",
                type: "array",
              },
              {
                validator: function (t, i, a) {
                  e.appointment.serviceId &&
                  e.appointment.providerId &&
                  e.isProviderService &&
                  e.getApprovedPersonsCount() >
                    e.appointment.providerServiceMaxCapacity
                    ? ((e.newAppointmentTabs = "schedule"),
                      a(
                        new Error(
                          e.$root.labels.select_max_customer_count_warning +
                            " " +
                            e.appointment.providerServiceMaxCapacity
                        )
                      ))
                    : a();
                },
                trigger: "submit",
              },
            ],
            serviceId: [
              {
                required: !0,
                message: this.$root.labels.select_service_warning,
                trigger: "submit",
                type: "number",
              },
            ],
            providerId: [
              {
                required: !0,
                message: this.$root.labels.select_employee_warning,
                trigger: "submit",
                type: "number",
              },
            ],
            selectedDate: [
              { validator: t, trigger: "submit" },
              {
                required: !0,
                message: this.$root.labels.select_date_warning,
                trigger: "submit",
                type: "date",
              },
            ],
            "selectedPeriod.time": [
              { validator: t, trigger: "submit" },
              {
                required: !0,
                message: this.$root.labels.select_time_warning,
                trigger: "submit",
              },
            ],
          },
          rules: {},
          statuses: [
            { id: 1, value: "approved", label: this.$root.labels.approved },
            { id: 0, value: "pending", label: this.$root.labels.pending },
            { id: 2, value: "canceled", label: this.$root.labels.canceled },
            { id: 3, value: "rejected", label: this.$root.labels.rejected },
          ],
          renderObject: {
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
          },
        };
      },
      mounted: function () {
        this.appointment &&
          0 === this.appointment.id &&
          this.instantiateDialog(),
          (this.rules = this.rulesInit);
      },
      methods: {
        filterServices: function () {
          var e = this;
          this.options.entities.services.forEach(function (e) {
            e.disabled = !1;
          });
          var t = this.options.entities.coupons
            ? this.options.entities.coupons.find(function (t) {
                return t.id === e.coupon;
              })
            : null;
          t &&
            this.options.entities.services.forEach(function (e) {
              t.serviceList
                .map(function (e) {
                  return e.id;
                })
                .includes(e.id) || (e.disabled = !0);
            });
        },
        searchExistingCustomers: function (e) {
          e
            ? this.searchCustomers(e, this.setFilteredBookings)
            : this.setFilteredBookings(!1);
        },
        setFilteredBookings: function (e) {
          var t = this,
            i = [];
          this.appointment.bookings.forEach(function (e) {
            i.push(e.customerId);
          });
          var a = this.options.entities.customers;
          void 0 === e && (a = this.searchedCustomers);
          var o = this.clonedBookings
            .map(function (e) {
              return e.customer;
            })
            .map(function (e) {
              return e.id;
            });
          a.forEach(function (e) {
            -1 === i.indexOf(e.id) &&
              -1 === o.indexOf(e.id) &&
              t.clonedBookings.push({
                id: 0,
                customer: e,
                status: t.$root.settings.general.defaultAppointmentStatus,
                persons: 1,
                total: 0,
                extras: [],
                payments: [],
                price: 0,
                coupon: null,
                added: !1,
                visible: !0,
                info: JSON.stringify({
                  firstName: e.firstName,
                  lastName: e.lastName,
                  email: e.email,
                  phone: e.phone,
                }),
                aggregatedPrice: null,
                packageCustomerService: null,
                customFields: {},
              });
          });
          for (
            var n = a.map(function (e) {
                return e.id;
              }),
              s = this.clonedBookings.length - 1;
            s >= 0;
            s--
          )
            -1 === n.indexOf(this.clonedBookings[s].customer.id) &&
              (this.clonedBookings[s].visible = !1);
        },
        selectedTime: function () {
          var e = this,
            t = this,
            i = this.getStringFromDate(this.appointment.selectedDate);
          i in this.appointment.calendarTimeSlots &&
            this.appointment.selectedPeriod.time in
              this.appointment.calendarTimeSlots[i] &&
            this.appointment.calendarTimeSlots[i][
              this.appointment.selectedPeriod.time
            ].forEach(function (e) {
              e[0] === t.appointment.providerId &&
                (t.appointment.locationId = e[1]);
            }),
            this.selectedRecurringDates.length
              ? this.$nextTick(function () {
                  e.refreshRecurringData();
                })
              : this.setRecurringData(),
            this.clearValidation();
        },
        updateByCustomer: function () {
          var e = this;
          this.dialogLoading = !0;
          var t =
            this.getStringFromDate(this.appointment.selectedDate) +
            " " +
            this.appointment.selectedPeriod.time;
          this.$http
            .post(
              this.$root.getAjaxUrl +
                "/bookings/reassign/" +
                this.appointment.bookings[0].id,
              { bookingStart: t }
            )
            .then(function (t) {
              e.$emit("saveCallback", t),
                setTimeout(function () {
                  (e.dialogLoading = !1), e.$emit("closeDialog");
                }, 300),
                e.notify(
                  e.$root.labels.success,
                  e.$root.labels.appointment_rescheduled,
                  "success"
                );
            })
            .catch(function (t) {
              if (t.response) {
                e.dialogLoading = !1;
                var i = e;
                setTimeout(function () {
                  "timeSlotUnavailable" in t.response.data.data &&
                    !0 === t.response.data.data.timeSlotUnavailable &&
                    i.notify(
                      i.$root.labels.error,
                      i.$root.labels.time_slot_unavailable,
                      "error"
                    ),
                    "rescheduleBookingUnavailable" in t.response.data.data &&
                      !0 ===
                        t.response.data.data.rescheduleBookingUnavailable &&
                      i.notify(
                        i.$root.labels.error,
                        i.$root.labels.booking_reschedule_exception,
                        "error"
                      );
                }, 200);
              }
            });
        },
        editPayment: function (e) {
          this.$emit("editPayment", e);
        },
        instantiateDialog: function () {
          null !== this.appointment &&
            ((this.clonedBookings = JSON.parse(JSON.stringify(this.bookings))),
            this.clonedBookings.forEach(function (e) {
              e.visible = !0;
            }),
            (this.cachedClonedBookings = JSON.parse(
              JSON.stringify(this.clonedBookings)
            )),
            "provider" === this.$root.settings.role &&
              (this.appointment.providerId =
                this.options.entities.employees[0].id),
            0 !== this.appointment.id
              ? ((this.activeRecurring = this.recurringAppointments.length > 0),
                (this.initialRecurringData = this.getDefaultRecurringSettings(
                  this.appointment.selectedDate,
                  this.getServiceById(this.appointment.serviceId)
                    .recurringCycle,
                  this.appointment.calendarTimeSlots
                )),
                this.setCategory(),
                this.setLocation(),
                this.handleCustomerChange(),
                (this.coupon = this.appointment.bookings[0].coupon
                  ? this.appointment.bookings[0].coupon.id
                  : null),
                (this.showCoupon = !!this.coupon),
                this.getTimeSlots(
                  function (e) {
                    var t = this,
                      i = t.appointment.bookingStart.split(" "),
                      a = i[0],
                      o = i[1].slice(0, -3);
                    if (a in e) {
                      if (!(o in e[a])) {
                        var n = Object.keys(e[a]);
                        n.push(o);
                        var s = {};
                        n.sort().forEach(function (i) {
                          s[i] = i === o ? [t.appointment.providerId] : e[a][i];
                        }),
                          (e[a] = s);
                      }
                    } else
                      (e[a] = {}),
                        (e[a][o] = [
                          [
                            this.appointment.providerId,
                            this.appointment.locationId,
                          ],
                        ]);
                    (this.appointment.selectedDate = v()(a).toDate()),
                      (this.appointment.selectedPeriod = {
                        time: o,
                        employee: t.appointment.providerId,
                      }),
                      this.updateCalendar(e);
                  }.bind(this)
                ))
              : "" !== this.appointment.serviceId
              ? (this.setCategory(),
                this.setLocation(),
                this.getTimeSlots(this.updateCalendar))
              : 0 === this.appointment.id &&
                ((this.dialogLoading = !1), (this.showCoupon = !0)),
            (this.mounted = !0));
        },
        setCategory: function () {
          var e = this;
          this.appointment.categoryId = this.options.entities.services.filter(
            function (t) {
              return t.id === e.appointment.serviceId;
            }
          )[0].categoryId;
        },
        setLocation: function () {
          var e = this;
          this.appointment.locationId = this.appointment.locationId
            ? this.appointment.locationId
            : this.options.entities.employees.filter(function (t) {
                return e.appointment.providerId === t.id;
              })[0].locationId;
        },
        closeDialog: function () {
          this.$emit("closeDialog");
        },
        getParsedEntity: function () {
          var e = this,
            t = [];
          this.appointment.bookings.forEach(function (i) {
            var a = [];
            for (var o in i.customFields)
              "datepicker" === i.customFields[o].type &&
                i.customFields[o].value &&
                (i.customFields[o].value = e.getStringFromDate(
                  i.customFields[o].value
                ));
            i.extras.forEach(function (e) {
              e.selected &&
                a.push({
                  id: e.id,
                  customerBookingId: i.id,
                  extraId: e.extraId,
                  quantity: e.quantity,
                  price: e.price,
                });
            });
            var n = {
              id: i.id,
              customerId: i.customer.id,
              customer: i.customer,
              status: i.status,
              persons: i.persons,
              extras: a,
              customFields: JSON.stringify(i.customFields),
              payments: i.payments,
            };
            (n.coupon =
              ("admin" !== e.$root.settings.role &&
                "manager" !== e.$root.settings.role) ||
              !e.options.entities.coupons
                ? i.coupon
                : e.options.entities.coupons.find(function (t) {
                    return t.id === e.coupon;
                  })),
              t.push(n);
          }),
            this.activeRecurring &&
              "dates" in this.recurringData &&
              this.recurringData.dates.length &&
              this.recurringData.dates.forEach(function (t, i) {
                i in e.selectedRecurringDates &&
                  (e.selectedRecurringDates[i].bookingStart =
                    v()(t.date).format("YYYY-MM-DD") + " " + t.slot);
              });
          var i =
            this.getStringFromDate(this.appointment.selectedDate) +
            " " +
            this.appointment.selectedPeriod.time;
          "UTC" === this.selectedTimeZone &&
            (i = v()(i, "YYYY-MM-DD HH:mm").utc().format("YYYY-MM-DD HH:mm"));
          var a = [];
          if (this.savedAppointment && "bookings" in this.savedAppointment) {
            var o = t.map(function (e) {
              return e.id;
            });
            this.savedAppointment.bookings.forEach(function (e) {
              -1 === o.indexOf(e.id) && a.push(e);
            });
          }
          return {
            serviceId: this.appointment.serviceId,
            providerId: this.appointment.providerId,
            locationId: this.appointment.locationId,
            bookings: t,
            removedBookings: a,
            bookingStart: i,
            utc: "UTC" === this.selectedTimeZone,
            timeZone:
              "UTC" === this.selectedTimeZone ? null : this.selectedTimeZone,
            notifyParticipants: this.appointment.notifyParticipants ? 1 : 0,
            internalNotes: this.appointment.internalNotes,
            id: this.appointment.id,
            payment: this.payment,
            recurring: this.activeRecurring ? this.selectedRecurringDates : [],
          };
        },
        showDialogNewCustomer: function () {
          this.$emit("showDialogNewCustomer");
        },
        handleCustomerChange: function () {
          var e = this,
            t = this.appointment.duration;
          this.setServiceExtrasForCustomers(!1),
            this.setPrice(),
            this.setServiceCapacityForProvider(),
            this.setBookingCustomFields(),
            this.addCustomFieldsValidationRules(),
            t !== this.appointment.duration &&
              this.mounted &&
              this.getTimeSlots(this.updateCalendar),
            (this.showCoupon = !0);
          var i = this.cachedClonedBookings
              .map(function (e) {
                return e.customer;
              })
              .map(function (e) {
                return e.id;
              }),
            a = this.clonedBookings
              .map(function (e) {
                return e.customer;
              })
              .map(function (e) {
                return e.id;
              }),
            o = [];
          i.forEach(function (e) {
            -1 === a.indexOf(e) && o.push(e);
          });
          for (var n = this.clonedBookings.length - 1; n >= 0; n--)
            -1 !== o.indexOf(this.clonedBookings[n].customer.id) &&
              this.clonedBookings.splice(n, 1);
          setTimeout(function () {
            e.clonedBookings.forEach(function (e) {
              e.visible = !0;
            }),
              (e.cachedClonedBookings = JSON.parse(
                JSON.stringify(e.clonedBookings)
              ));
          }, 200),
            this.$emit("sortBookings", this.appointment.bookings);
        },
        handleCustomerRemove: function (e) {
          for (
            var t = this.appointment.duration,
              i = this.clonedBookings.length - 1;
            i >= 0;
            i--
          )
            this.clonedBookings[i].customer.id ===
              this.appointment.bookings[e].customer.id &&
              this.clonedBookings.splice(i, 1);
          this.clearValidation(),
            this.appointment.bookings.splice(e, 1),
            this.setPrice(),
            this.setSelectedExtrasCount(),
            this.setDuration(),
            t !== this.appointment.duration &&
              this.mounted &&
              this.getTimeSlots(this.updateCalendar);
        },
        setServiceExtrasForCustomers: function (e) {
          var t = this,
            i = null;
          t.appointment.serviceId &&
            (t.options.entities.services.forEach(function (e) {
              e.id === t.appointment.serviceId &&
                ((i = e.extras), (t.appointment.extrasCount = i.length));
            }),
            t.appointment.bookings.forEach(function (t) {
              (e || (!t.id && !t.added)) &&
                ((t.extras = JSON.parse(JSON.stringify(i))),
                t.extras.forEach(function (e) {
                  (e.selected = !1), (e.id = 0), (e.customerBookingId = 0);
                })),
                (t.added = !0);
            }),
            this.setSelectedExtrasCount(),
            this.setDuration());
        },
        handleSelected: function () {
          for (
            var e = this,
              t = document.querySelectorAll(
                ".am-appointment-status-option.selected"
              ),
              i = 0;
            i < t.length;
            i++
          )
            t[i].addEventListener("click", function (t) {
              e.handleGroupStatusChange();
            });
        },
        handleGroupStatusChange: function () {
          this.clearValidation();
          var e = this;
          this.appointment.bookings.forEach(function (t) {
            t.status = e.appointment.status;
          });
        },
        handleEmployeeChange: function () {
          var e = this;
          (this.serviceSpinnerActive = !0),
            (this.locationSpinnerActive = !0),
            (this.categorySpinnerActive = !0),
            this.setServiceExtrasForCustomers(!1),
            this.setServiceCapacityForProvider(),
            this.setPrice(),
            this.mounted && this.getTimeSlots(this.updateCalendar),
            setTimeout(function () {
              (e.serviceSpinnerActive = !1),
                (e.locationSpinnerActive = !1),
                (e.categorySpinnerActive = !1);
            }, 300);
        },
        handleLocationChange: function () {
          var e = this;
          this.clearValidation(),
            (this.serviceSpinnerActive = !0),
            (this.employeeSpinnerActive = !0),
            (this.categorySpinnerActive = !0),
            this.mounted && this.getTimeSlots(this.updateCalendar),
            setTimeout(function () {
              (e.serviceSpinnerActive = !1),
                (e.employeeSpinnerActive = !1),
                (e.categorySpinnerActive = !1);
            }, 300);
        },
        handleServiceChange: function () {
          var e = this;
          (this.locationSpinnerActive = !0),
            (this.employeeSpinnerActive = !0),
            (this.categorySpinnerActive = !0),
            this.setServiceCapacityForProvider(),
            this.setPrice(),
            this.setServiceExtrasForCustomers(!0),
            this.addCustomFieldsValidationRules(),
            (this.serviceUpdated = !0),
            this.mounted && this.getTimeSlots(this.updateCalendar),
            setTimeout(function () {
              (e.locationSpinnerActive = !1),
                (e.employeeSpinnerActive = !1),
                (e.categorySpinnerActive = !1);
            }, 300);
        },
        handleCategoryChange: function () {
          var e = this;
          this.clearValidation(),
            (this.locationSpinnerActive = !0),
            (this.employeeSpinnerActive = !0),
            (this.serviceSpinnerActive = !0),
            setTimeout(function () {
              (e.locationSpinnerActive = !1),
                (e.employeeSpinnerActive = !1),
                (e.serviceSpinnerActive = !1);
            }, 300);
        },
        getProviderService: function () {
          var e = this,
            t = null;
          return (
            this.appointment.providerId &&
              this.appointment.serviceId &&
              this.options.entities.employees.forEach(function (i) {
                i.id === e.appointment.providerId &&
                  i.serviceList.forEach(function (i) {
                    i.id === e.appointment.serviceId && (t = i);
                  });
              }),
            this.appointment.id && this.appointment.serviceId && !t
              ? ((this.isProviderService = !1),
                this.getServiceById(this.appointment.serviceId))
              : t
          );
        },
        setServiceCapacityForProvider: function () {
          var e = this.getProviderService();
          (this.appointment.providerServiceMaxCapacity = e ? e.maxCapacity : 0),
            (this.appointment.providerServiceMinCapacity = e
              ? e.minCapacity
              : 0),
            this.setStatusMessage();
        },
        setStatusMessage: function () {
          this.statusMessage =
            this.getApprovedPersonsCount() <
            this.appointment.providerServiceMinCapacity
              ? "(minimum " + this.appointment.providerServiceMinCapacity + ")"
              : "";
        },
        handleBookingChange: function () {
          this.setPrice(), this.setStatusMessage();
        },
        getApprovedPersonsCount: function () {
          var e = 0;
          return (
            this.appointment.bookings.forEach(function (t) {
              "approved" === t.status && (e += t.persons);
            }),
            e
          );
        },
        setPrice: function () {
          var e = this;
          this.clearValidation();
          var t = this,
            i =
              !(!this.appointment || !this.savedAppointment) &&
              this.appointment.serviceId !==
                parseInt(this.savedAppointment.serviceId);
          t.$nextTick(function () {
            if (
              t.appointment.serviceId &&
              t.appointment.providerId &&
              t.appointment.bookings
            ) {
              var a = t.getProviderService(),
                o = e.getServiceById(t.appointment.serviceId),
                n = 0,
                s = 0,
                r = 0;
              t.appointment.bookings.forEach(function (e) {
                if (["approved", "pending"].includes(e.status)) {
                  var t = 0,
                    l = e.id ? e.aggregatedPrice : o.aggregatedPrice;
                  e.extras.forEach(function (i) {
                    if (i.selected) {
                      var a = o.extras.filter(function (e) {
                          return e.id === i.extraId;
                        }),
                        n = e.id ? i.price : a.length ? a[0].price : 0,
                        s =
                          null === i.aggregatedPrice
                            ? e.id
                              ? e.aggregatedPrice
                              : o.aggregatedPrice
                            : i.aggregatedPrice;
                      t +=
                        (s ? e.persons : 1) * (i.quantity ? i.quantity : 0) * n;
                    }
                  });
                  var c = e.id ? (i ? a.price : e.price) : a.price;
                  (e.extrasTotalPrice = t),
                    (e.serviceTotalPrice = c * (l ? e.persons : 1)),
                    (e.discountTotalPrice =
                      ((e.serviceTotalPrice + e.extrasTotalPrice) / 100) *
                        (e.coupon ? e.coupon.discount : 0) +
                      (e.coupon ? e.coupon.deduction : 0)),
                    (n += e.serviceTotalPrice),
                    (s += e.extrasTotalPrice),
                    (r += e.discountTotalPrice);
                }
              }),
                (t.appointment.serviceTotalPrice = n),
                (t.appointment.extrasTotalPrice = s),
                (t.appointment.discountTotalPrice = r);
            }
          });
        },
        handleExtrasSelectionChange: function (e) {
          void 0 === e.quantity && (e.quantity = 1),
            this.setPrice(),
            this.setSelectedExtrasCount(),
            this.setDuration(),
            e.duration > 0 &&
              this.mounted &&
              this.getTimeSlots(this.updateCalendar);
        },
        updateCalendar: function (e) {
          var t = this;
          this.appointment.calendarTimeSlots = e;
          var i = [];
          Object.keys(this.appointment.calendarTimeSlots).forEach(function (e) {
            i.push(t.getDate(e));
          }),
            (this.availableDates = i),
            (this.disabledWeekdays = { weekdays: [] }),
            (this.disabledWeekdays =
              0 === this.availableDates.length
                ? { weekdays: [1, 2, 3, 4, 5, 6, 7] }
                : null),
            this.dateChange();
        },
        getTimeSlots: function (e) {
          var t = this,
            i = this.appointment,
            a = [];
          i.serviceId &&
            ((this.loadingTimeSlots = !0),
            this.appointment.bookings.forEach(function (e) {
              e.extras.forEach(function (e) {
                e.selected && a.push({ id: e.extraId, quantity: e.quantity });
              });
            }),
            this.$http
              .get(this.$root.getAjaxUrl + "/slots", {
                params: {
                  serviceId: i.serviceId,
                  locationId: i.locationId,
                  providerIds: i.providerId ? [i.providerId] : [],
                  extras: JSON.stringify(a),
                  excludeAppointmentId: i.id,
                  group: "customer" === this.$root.settings.role ? 1 : 0,
                  timeZone: this.selectedTimeZone,
                  page: "appointments",
                },
              })
              .then(function (i) {
                e(
                  "UTC" === t.selectedTimeZone
                    ? t.getConvertedTimeSlots(i.data.data.slots)
                    : i.data.data.slots
                ),
                  (t.dialogLoading = !1),
                  (t.loadingTimeSlots = !1);
              })
              .catch(function (e) {
                console.log(e.message), (t.loadingTimeSlots = !1);
              }));
        },
        dateChange: function () {
          var e = this;
          this.clearValidation();
          var t = this,
            i = [],
            a = null,
            o = !1;
          this.appointment.selectedDate &&
          this.appointment.calendarTimeSlots &&
          (a =
            this.appointment.calendarTimeSlots[
              this.getStringFromDate(this.appointment.selectedDate)
            ])
            ? (Object.keys(a).forEach(function (e) {
                t.appointment.selectedPeriod &&
                  t.appointment.selectedPeriod.hasOwnProperty("time") &&
                  t.appointment.selectedPeriod.time === e &&
                  (o = !0),
                  i.push({ time: e, employees: a[e] });
              }),
              o || (this.appointment.selectedPeriod = ""))
            : ((this.appointment.selectedDate = null),
              (this.appointment.selectedPeriod = "")),
            (this.appointment.dateTimeSlots = i),
            this.$nextTick(function () {
              e.refreshRecurringData();
            });
        },
        openRecurringAppointment: function (e) {
          this.$emit("openRecurringAppointment", e);
        },
        handleTabClick: function (e) {
          "recurring" === e.name &&
            ((this.calendarUpdated = !1), (this.recurringDatesChanged = !1));
        },
        haveSaveConfirmation: function () {
          var e =
            this.activeRecurring &&
            this.recurringDatesChanged &&
            this.calendarUpdated;
          return (
            e && ((this.recurringDatesChanged = !1), this.showRecurringTab()), e
          );
        },
        getSelectedDistinctExtras: function () {
          var e = [],
            t = [];
          return (
            this.appointment.bookings.forEach(function (i) {
              i.extras
                .filter(function (e) {
                  return e.selected;
                })
                .forEach(function (i) {
                  -1 === t.indexOf(i.id) && (e.push(i), t.push(i.id));
                });
            }),
            e
          );
        },
        refreshRecurringData: function () {
          this.activeRecurring &&
            this.appointment.selectedDate &&
            this.appointment.selectedPeriod &&
            (this.serviceUpdated &&
              ((this.serviceUpdated = !1), this.setRecurringData()),
            (this.calendarUpdated = !0),
            (this.activeRecurring = !1),
            (this.recurringData.startDate = v()(
              this.appointment.selectedDate
            ).format("YYYY-MM-DD HH:mm:ss")),
            (this.recurringData.startTime =
              this.appointment.selectedPeriod.time),
            (this.initialRecurringData.calendarDates =
              this.getAvailableRecurringDates(
                this.appointment.calendarTimeSlots
              )),
            (this.activeRecurring = !0),
            null !== this.recurringData.setupCallback &&
              this.recurringData.setupCallback("count"));
        },
        recurringDatesDefined: function (e) {
          var t = [];
          if (
            (e.forEach(function (e) {
              t.push({
                bookingStart: v()(e.date).format("YYYY-MM-DD") + " " + e.slot,
                providerId: e.providerId,
                locationId: e.locationId,
              });
            }),
            (this.recurringDatesChanged = !1),
            t.length !== this.selectedRecurringDates.length)
          )
            this.recurringDatesChanged = !0;
          else
            for (var i = 0; i < t.length; i++)
              t[i].bookingStart !==
                this.selectedRecurringDates[i].bookingStart &&
                (this.recurringDatesChanged = !0);
          this.selectedRecurringDates = t;
        },
        setRecurringData: function () {
          if (
            this.appointment.selectedDate &&
            this.appointment.selectedPeriod
          ) {
            (this.recurringData.dates = []),
              (this.recurringData.startDate = v()(
                this.appointment.selectedDate
              ).format("YYYY-MM-DD HH:mm:ss")),
              (this.recurringData.startTime =
                this.appointment.selectedPeriod.time);
            var e = this.getServiceById(this.appointment.serviceId);
            this.initialRecurringData = this.getDefaultRecurringSettings(
              this.appointment.selectedDate,
              e.recurringCycle,
              this.appointment.calendarTimeSlots
            );
          }
        },
        setSelectedExtrasCount: function () {
          var e = 0;
          this.appointment.bookings.forEach(function (t) {
            t.extras.forEach(function (t) {
              t.selected && e++;
            });
          }),
            (this.appointment.extrasSelectedCount = e);
        },
        setDuration: function () {
          if (this.appointment.serviceId) {
            var e = this.getServiceById(this.appointment.serviceId).duration;
            this.appointment.bookings.forEach(function (t) {
              var i = 0;
              t.extras.forEach(function (e) {
                e.selected && e.duration > i && (i = e.duration);
              }),
                (e += i);
            }),
              (this.appointment.duration = e);
          }
        },
        clearValidation: function () {
          void 0 !== this.$refs.appointment &&
            this.$refs.appointment.clearValidate();
        },
        errorCallback: function (e) {
          var t = this;
          setTimeout(function () {
            "timeSlotUnavailable" in e &&
              !0 === e.timeSlotUnavailable &&
              (t.notify(
                t.$root.labels.error,
                t.$root.labels.time_slot_unavailable,
                "error"
              ),
              t.getTimeSlots(t.updateCalendar));
          }, 200);
        },
        addCustomFieldsValidationRules: function () {
          if (
            this.appointment.serviceId &&
            this.appointment.bookings.length > 0
          ) {
            this.rules = this.rulesInit;
            for (var e = 0; e < this.appointment.bookings.length; e++)
              for (
                var t = 0;
                t < this.options.entities.customFields.length;
                t++
              )
                this.isCustomFieldVisible(
                  this.options.entities.customFields[t],
                  "appointment",
                  this.appointment.serviceId
                ) &&
                  (void 0 === this.rules.bookings[e] &&
                    this.$set(this.rules.bookings, e, { type: "array" }),
                  void 0 === this.rules.bookings[e].customFields &&
                    this.$set(this.rules.bookings[e], "customFields", {}),
                  (this.rules.bookings[e].customFields[
                    this.options.entities.customFields[t].id
                  ] = {
                    value: [
                      {
                        required: !0,
                        message: this.$root.labels.required_field,
                        trigger: "submit",
                      },
                    ],
                  }));
          }
        },
        showCustomFieldsTab: function () {
          var e = Array.prototype.concat.apply(
            [],
            this.options.entities.customFields.map(function (e) {
              return e.services.map(function (e) {
                return e.id;
              });
            })
          );
          return (
            this.options.entities.customFields.length > 0 &&
            this.appointment.bookings.length > 0 &&
            this.appointment.serviceId &&
            e.includes(this.appointment.serviceId)
          );
        },
        showRecurringTab: function () {
          this.activeRecurring && (this.newAppointmentTabs = "recurring");
        },
        validationBookingsFailCallback: function () {
          this.newAppointmentTabs = "customFields";
        },
      },
      computed: {
        selectedCustomersMessage: function () {
          return "" !== this.statusMessage
            ? this.$root.labels.selected_customers +
                " " +
                this.statusMessage +
                ":"
            : this.$root.labels.selected_customers + ":";
        },
        customersMaxLimit: function () {
          return this.appointment.serviceId &&
            this.appointment.providerId &&
            this.getProviderService()
            ? this.getProviderService().maxCapacity
            : this.appointment.serviceId && !this.appointment.providerId
            ? this.getServiceById(this.appointment.serviceId).maxCapacity
            : 0;
        },
        showCustomer: function () {
          return "customer" !== this.$root.settings.role;
        },
      },
      watch: {
        customerCreatedCount: function () {
          var e = this,
            t = this.clonedBookings.map(function (e) {
              return e.customer.id;
            });
          this.bookings.forEach(function (i) {
            -1 === t.indexOf(i.customer.id) &&
              ((i.visible = !0), e.clonedBookings.push(i));
          }),
            this.clonedBookings.sort(function (e, t) {
              return (
                e.customer.firstName +
                " " +
                e.customer.lastName
              ).localeCompare(t.customer.firstName + " " + t.customer.lastName);
            }),
            this.addCustomFieldsValidationRules();
        },
        appointment: function () {
          this.instantiateDialog(),
            "provider" === this.$root.settings.role &&
              this.isCabinet &&
              null !== this.appointment &&
              null !== this.appointment.providerId &&
              (this.appointment.providerId =
                this.options.entities.employees[0].id);
        },
      },
      components: {
        DialogAppointmentPayment: u.a,
        DialogCustomFields: d.a,
        RecurringSetup: x.a,
        RecurringDates: C.a,
        DialogActions: l.a,
      },
    };
  },
  889: function (e, t, i) {
    var a = i(685)(i(890), i(891), !1, null, null, null);
    e.exports = a.exports;
  },
  890: function (e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = i(337),
      o = i(689),
      n = i(757),
      s = i(690);
    t.default = {
      mixins: [a.a, o.a, n.a, s.a],
      props: {
        appointment: { default: function () {}, type: Object },
        options: null,
      },
      data: function () {
        return {
          paymentStatuses: [
            { value: "paid", label: this.$root.labels.paid },
            { value: "pending", label: this.$root.labels.pending },
            { value: "partiallyPaid", label: this.$root.labels.partially_paid },
          ],
        };
      },
      methods: {
        showDialogEditPayment: function (e, t) {
          e.customerId = t.customerId;
          var i = t.packageCustomerService
            ? this.getPackageById(
                t.packageCustomerService.packageCustomer.packageId
              )
            : null;
          this.$emit("editPayment", {
            payment: e,
            appointment: this.appointment,
            booking: t,
            package: t.packageCustomerService
              ? { name: i ? i.name : "Package" }
              : null,
          });
        },
        getPaymentStatus: function (e) {
          var t = "";
          return (
            this.paymentStatuses.forEach(function (i) {
              i.value === e && (t = i.label);
            }),
            t
          );
        },
        getBookingSubtotal: function (e) {
          var t =
            e.serviceTotalPrice +
            e.extrasTotalPrice -
            e.discountTotalPrice -
            (e.payments[0] ? e.payments[0].amount : 0);
          return t >= 0 ? t : 0;
        },
      },
    };
  },
  891: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          i = e._self._c || t;
        return i("div", { staticClass: "am-dialog-table" }, [
          e.appointment.bookings.length > 0
            ? i(
                "div",
                e._l(e.appointment.bookings, function (t) {
                  return i(
                    "div",
                    { staticClass: "am-customer-extras" },
                    e._l(t.payments, function (a) {
                      return i(
                        "div",
                        [
                          i(
                            "el-row",
                            { staticClass: "am-customer-extras-data" },
                            [
                              i("el-col", [
                                i("h3", [
                                  e._v(
                                    e._s(t.customer.firstName) +
                                      " " +
                                      e._s(t.customer.lastName)
                                  ),
                                ]),
                                e._v(" "),
                                i("span", [e._v(e._s(t.customer.email))]),
                              ]),
                            ],
                            1
                          ),
                          e._v(" "),
                          i(
                            "el-row",
                            {
                              staticClass: "am-customer-extras-payment",
                              attrs: { gutter: 10 },
                            },
                            [
                              i("el-col", { attrs: { span: 12 } }, [
                                i("span", { staticClass: "am-strong" }, [
                                  e._v(e._s(e.$root.labels.payment)),
                                ]),
                              ]),
                              e._v(" "),
                              i("el-col", { attrs: { span: 12 } }, [
                                i(
                                  "span",
                                  {
                                    staticClass: "am-link",
                                    on: {
                                      click: function (i) {
                                        return e.showDialogEditPayment(a, t);
                                      },
                                    },
                                  },
                                  [
                                    e._v(
                                      "\n              " +
                                        e._s(
                                          e.$root.labels.view_payment_details
                                        ) +
                                        "\n            "
                                    ),
                                  ]
                                ),
                              ]),
                              e._v(" "),
                              i("el-col", { attrs: { span: 12 } }, [
                                i("span", [
                                  e._v(e._s(e.$root.labels.date) + ":"),
                                ]),
                              ]),
                              e._v(" "),
                              i("el-col", { attrs: { span: 12 } }, [
                                i("span", { staticClass: "am-semi-strong" }, [
                                  e._v(
                                    e._s(e.getFrontedFormattedDate(a.dateTime))
                                  ),
                                ]),
                              ]),
                              e._v(" "),
                              i("el-col", { attrs: { span: 12 } }, [
                                i("span", [
                                  e._v(
                                    e._s(e.$root.labels.payment_method) + ":"
                                  ),
                                ]),
                              ]),
                              e._v(" "),
                              i("el-col", { attrs: { span: 12 } }, [
                                i("span", { staticClass: "am-semi-strong" }, [
                                  i("img", {
                                    staticClass: "svg",
                                    attrs: {
                                      width: "14px",
                                      src:
                                        e.$root.getUrl +
                                        "public/img/payments/" +
                                        a.gateway +
                                        ".svg",
                                    },
                                  }),
                                  e._v(
                                    " " +
                                      e._s(e.getPaymentGatewayNiceName(a)) +
                                      "\n                    "
                                  ),
                                ]),
                              ]),
                              e._v(" "),
                              i("el-col", { attrs: { span: 12 } }, [
                                i("span", [
                                  e._v(e._s(e.$root.labels.status) + ":"),
                                ]),
                              ]),
                              e._v(" "),
                              i("el-col", { attrs: { span: 12 } }, [
                                i("span", { staticClass: "am-semi-strong" }, [
                                  i("i", {
                                    class: {
                                      "el-icon-circle-check":
                                        "paid" === a.status ||
                                        "partiallyPaid" === a.status,
                                      "partially-paid":
                                        "partiallyPaid" === a.status,
                                      "el-icon-refresh": "pending" === a.status,
                                    },
                                  }),
                                  e._v(
                                    "\n              " +
                                      e._s(e.getPaymentStatus(a.status)) +
                                      "\n            "
                                  ),
                                ]),
                              ]),
                              e._v(" "),
                              t.packageCustomerService
                                ? i("el-col", { attrs: { span: 12 } }, [
                                    i("span", [
                                      e._v(e._s(e.$root.labels.package) + ":"),
                                    ]),
                                  ])
                                : e._e(),
                              e._v(" "),
                              t.packageCustomerService
                                ? i(
                                    "el-col",
                                    {
                                      staticClass: "am-payment-package-name",
                                      attrs: { span: 12 },
                                    },
                                    [
                                      i("img", {
                                        attrs: {
                                          src:
                                            e.$root.getUrl +
                                            "public/img/am-package.svg",
                                        },
                                      }),
                                      e._v(" "),
                                      i(
                                        "span",
                                        { staticClass: "am-semi-strong" },
                                        [
                                          e._v(
                                            "\n                " +
                                              e._s(
                                                (e.pack = e.getPackageById(
                                                  t.packageCustomerService
                                                    .packageCustomer.packageId
                                                ))
                                                  ? e.pack.name
                                                  : "Package"
                                              ) +
                                              "\n              "
                                          ),
                                        ]
                                      ),
                                    ]
                                  )
                                : e._e(),
                            ],
                            1
                          ),
                          e._v(" "),
                          t.packageCustomerService
                            ? i(
                                "el-row",
                                {
                                  staticClass: "subtotal",
                                  attrs: { gutter: 10 },
                                },
                                [
                                  i(
                                    "div",
                                    { staticClass: "am-payment-package-deal" },
                                    [
                                      i("img", {
                                        attrs: {
                                          src:
                                            e.$root.getUrl +
                                            "public/img/am-package-black.svg",
                                        },
                                      }),
                                      e._v(" "),
                                      i("span", [
                                        e._v(e._s(e.$root.labels.package_deal)),
                                      ]),
                                    ]
                                  ),
                                  e._v(" "),
                                  i(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 14 },
                                    },
                                    [
                                      e._v(
                                        "\n            " +
                                          e._s(e.$root.labels.package_price) +
                                          ":\n          "
                                      ),
                                    ]
                                  ),
                                  e._v(" "),
                                  i(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 10 },
                                    },
                                    [
                                      e._v(
                                        "\n            " +
                                          e._s(
                                            e.getFormattedPrice(
                                              t.packageCustomerService
                                                .packageCustomer.price
                                            )
                                          ) +
                                          "\n          "
                                      ),
                                    ]
                                  ),
                                ],
                                1
                              )
                            : i(
                                "el-row",
                                {
                                  staticClass: "subtotal",
                                  attrs: { gutter: 10 },
                                },
                                [
                                  i(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 14 },
                                    },
                                    [
                                      e._v(
                                        "\n            " +
                                          e._s(e.$root.labels.price) +
                                          ":\n          "
                                      ),
                                    ]
                                  ),
                                  e._v(" "),
                                  i(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 10 },
                                    },
                                    [
                                      e._v(
                                        "\n            " +
                                          e._s(
                                            e.getFormattedPrice(
                                              t.serviceTotalPrice
                                            )
                                          ) +
                                          "\n          "
                                      ),
                                    ]
                                  ),
                                  e._v(" "),
                                  i(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 14 },
                                    },
                                    [
                                      e._v(
                                        "\n            " +
                                          e._s(e.$root.labels.extras) +
                                          ":\n          "
                                      ),
                                    ]
                                  ),
                                  e._v(" "),
                                  i(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 10 },
                                    },
                                    [
                                      e._v(
                                        "\n            " +
                                          e._s(
                                            e.getFormattedPrice(
                                              t.extrasTotalPrice
                                            )
                                          ) +
                                          "\n          "
                                      ),
                                    ]
                                  ),
                                  e._v(" "),
                                  i(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 14 },
                                    },
                                    [
                                      e._v(
                                        "\n            " +
                                          e._s(e.$root.labels.discount_amount) +
                                          ":\n          "
                                      ),
                                    ]
                                  ),
                                  e._v(" "),
                                  i(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 10 },
                                    },
                                    [
                                      e._v(
                                        "\n            " +
                                          e._s(
                                            e.getFormattedPrice(
                                              t.discountTotalPrice
                                            )
                                          ) +
                                          "\n          "
                                      ),
                                    ]
                                  ),
                                  e._v(" "),
                                  i(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 14 },
                                    },
                                    [
                                      e._v(
                                        "\n            " +
                                          e._s(e.$root.labels.paid) +
                                          ":\n          "
                                      ),
                                    ]
                                  ),
                                  e._v(" "),
                                  i(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 10 },
                                    },
                                    [
                                      e._v(
                                        "\n            " +
                                          e._s(e.getFormattedPrice(a.amount)) +
                                          "\n          "
                                      ),
                                    ]
                                  ),
                                  e._v(" "),
                                  i(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 14 },
                                    },
                                    [
                                      i("span", { staticClass: "am-strong" }, [
                                        e._v(
                                          e._s(e.$root.labels.subtotal) + ":"
                                        ),
                                      ]),
                                    ]
                                  ),
                                  e._v(" "),
                                  i(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 10 },
                                    },
                                    [
                                      i("span", { staticClass: "am-strong" }, [
                                        e._v(
                                          e._s(
                                            e.getFormattedPrice(
                                              e.getBookingSubtotal(t)
                                            )
                                          )
                                        ),
                                      ]),
                                    ]
                                  ),
                                ],
                                1
                              ),
                        ],
                        1
                      );
                    }),
                    0
                  );
                }),
                0
              )
            : i("div", [
                i("p", { attrs: { align: "center" } }, [
                  e._v(e._s(e.$root.labels.no_selected_customers)),
                ]),
              ]),
        ]);
      },
      staticRenderFns: [],
    };
  },
  892: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          i = e._self._c || t;
        return i(
          "div",
          { staticClass: "am-dialog-appointment" },
          [
            i(
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
                i("div", { staticClass: "am-dialog-loader-content" }, [
                  i("img", {
                    attrs: { src: e.$root.getUrl + "public/img/spinner.svg" },
                  }),
                  e._v(" "),
                  i("p", [e._v(e._s(e.$root.labels.loader_message))]),
                ]),
              ]
            ),
            e._v(" "),
            null === e.appointment || e.dialogLoading
              ? e._e()
              : i(
                  "div",
                  {
                    staticClass: "am-dialog-scrollable",
                    class: { "am-edit": 0 !== e.appointment.id },
                  },
                  [
                    e.showHeader
                      ? i(
                          "div",
                          { staticClass: "am-dialog-header" },
                          [
                            i(
                              "el-row",
                              [
                                i("el-col", { attrs: { span: 18 } }, [
                                  0 !== e.appointment.id
                                    ? i("h2", [
                                        e._v(
                                          e._s(e.$root.labels.edit_appointment)
                                        ),
                                      ])
                                    : i("h2", [
                                        e._v(
                                          e._s(e.$root.labels.new_appointment)
                                        ),
                                      ]),
                                ]),
                                e._v(" "),
                                i(
                                  "el-col",
                                  {
                                    staticClass: "align-right",
                                    attrs: { span: 6 },
                                  },
                                  [
                                    i("el-button", {
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
                    e.mounted && null !== e.appointment
                      ? i(
                          "el-form",
                          {
                            ref: "appointment",
                            attrs: {
                              model: e.appointment,
                              rules: e.rules,
                              "label-position": "top",
                            },
                          },
                          [
                            i(
                              "el-tabs",
                              {
                                on: { "tab-click": e.handleTabClick },
                                model: {
                                  value: e.newAppointmentTabs,
                                  callback: function (t) {
                                    e.newAppointmentTabs = t;
                                  },
                                  expression: "newAppointmentTabs",
                                },
                              },
                              [
                                i(
                                  "el-tab-pane",
                                  {
                                    attrs: {
                                      label: e.$root.labels.schedule,
                                      name: "schedule",
                                    },
                                  },
                                  [
                                    e.showCustomer
                                      ? i(
                                          "el-form-item",
                                          {
                                            staticClass:
                                              "am-appointment-customer",
                                            attrs: {
                                              label:
                                                e.$root.labels
                                                  .customers_singular_plural +
                                                ":",
                                              prop: "bookings",
                                            },
                                          },
                                          [
                                            i(
                                              "el-select",
                                              {
                                                staticClass: "no-tags",
                                                attrs: {
                                                  remote: "",
                                                  "remote-method":
                                                    e.searchExistingCustomers,
                                                  "value-key": "customer.id",
                                                  multiple: "",
                                                  "multiple-limit":
                                                    e.customersMaxLimit,
                                                  placeholder:
                                                    e.$root.labels
                                                      .select_customers,
                                                  "collapse-tags": "",
                                                  filterable: "",
                                                  loading: e.loadingCustomers,
                                                },
                                                on: {
                                                  change:
                                                    e.handleCustomerChange,
                                                },
                                                model: {
                                                  value: e.appointment.bookings,
                                                  callback: function (t) {
                                                    e.$set(
                                                      e.appointment,
                                                      "bookings",
                                                      t
                                                    );
                                                  },
                                                  expression:
                                                    "appointment.bookings",
                                                },
                                              },
                                              [
                                                i(
                                                  "div",
                                                  { staticClass: "am-drop" },
                                                  [
                                                    this.$root.settings
                                                      .additionalCapabilities
                                                      .canWriteCustomers
                                                      ? i(
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
                                                              "\n                  " +
                                                                e._s(
                                                                  e.$root.labels
                                                                    .create_new
                                                                ) +
                                                                "\n                "
                                                            ),
                                                          ]
                                                        )
                                                      : e._e(),
                                                    e._v(" "),
                                                    e._l(
                                                      e.clonedBookings,
                                                      function (t, a) {
                                                        return t.visible
                                                          ? i(
                                                              "el-option",
                                                              {
                                                                key: a,
                                                                staticClass:
                                                                  "am-has-option-meta",
                                                                attrs: {
                                                                  label:
                                                                    null !==
                                                                    (e.user =
                                                                      e.getCustomerInfo(
                                                                        t
                                                                      ))
                                                                      ? e.user
                                                                          .firstName +
                                                                        " " +
                                                                        e.user
                                                                          .lastName
                                                                      : "",
                                                                  value: t,
                                                                },
                                                              },
                                                              [
                                                                i(
                                                                  "span",
                                                                  {
                                                                    class: {
                                                                      "am-drop-item-name":
                                                                        t
                                                                          .customer
                                                                          .email,
                                                                    },
                                                                  },
                                                                  [
                                                                    e._v(
                                                                      e._s(
                                                                        t
                                                                          .customer
                                                                          .firstName
                                                                      ) +
                                                                        " " +
                                                                        e._s(
                                                                          t
                                                                            .customer
                                                                            .lastName
                                                                        )
                                                                    ),
                                                                  ]
                                                                ),
                                                                e._v(" "),
                                                                t.customer.email
                                                                  ? i(
                                                                      "span",
                                                                      {
                                                                        staticClass:
                                                                          "am-drop-item-meta",
                                                                      },
                                                                      [
                                                                        e._v(
                                                                          e._s(
                                                                            t
                                                                              .customer
                                                                              .email
                                                                          )
                                                                        ),
                                                                      ]
                                                                    )
                                                                  : e._e(),
                                                              ]
                                                            )
                                                          : e._e();
                                                      }
                                                    ),
                                                    e._v(" "),
                                                    e._l(
                                                      [
                                                        {
                                                          customer: {
                                                            id: 0,
                                                            firstName: "",
                                                            lastName: "",
                                                            email: "",
                                                            info: JSON.stringify(
                                                              {
                                                                firstName: "",
                                                                lastName: "",
                                                                email: "",
                                                                phone: "",
                                                              }
                                                            ),
                                                          },
                                                        },
                                                      ],
                                                      function (t) {
                                                        return 0 ===
                                                          e.clonedBookings
                                                            .length
                                                          ? i("el-option", {
                                                              key: t.customer
                                                                .id,
                                                              staticClass:
                                                                "am-has-option-meta",
                                                              style: {
                                                                display: "none",
                                                              },
                                                              attrs: {
                                                                label:
                                                                  null !==
                                                                  (e.user =
                                                                    e.getCustomerInfo(
                                                                      t
                                                                    ))
                                                                    ? e.user
                                                                        .firstName +
                                                                      " " +
                                                                      e.user
                                                                        .lastName
                                                                    : "",
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
                                        )
                                      : e._e(),
                                    e._v(" "),
                                    i(
                                      "transition",
                                      { attrs: { name: "fade" } },
                                      [
                                        e.appointment.bookings.length > 0 &&
                                        "customer" !== this.$root.settings.role
                                          ? i(
                                              "div",
                                              {
                                                staticClass:
                                                  "am-selected-dropdown-items",
                                              },
                                              [
                                                i("el-form-item", {
                                                  attrs: {
                                                    label:
                                                      e.selectedCustomersMessage,
                                                  },
                                                }),
                                                e._v(" "),
                                                e._l(
                                                  e.appointment.bookings,
                                                  function (t, a) {
                                                    return i(
                                                      "div",
                                                      {
                                                        key: a,
                                                        staticClass:
                                                          "am-selected-dropdown-item",
                                                      },
                                                      [
                                                        i(
                                                          "el-row",
                                                          {
                                                            attrs: {
                                                              align: "middle",
                                                              gutter: 4,
                                                              justify: "left",
                                                            },
                                                          },
                                                          [
                                                            i(
                                                              "el-col",
                                                              {
                                                                attrs: {
                                                                  sm: 14,
                                                                },
                                                              },
                                                              [
                                                                i("h3", [
                                                                  e._v(
                                                                    e._s(
                                                                      null !==
                                                                        (e.user =
                                                                          e.getCustomerInfo(
                                                                            t
                                                                          ))
                                                                        ? e.user
                                                                            .firstName +
                                                                            " " +
                                                                            e
                                                                              .user
                                                                              .lastName
                                                                        : ""
                                                                    )
                                                                  ),
                                                                ]),
                                                                e._v(" "),
                                                                i("span", [
                                                                  e._v(
                                                                    e._s(
                                                                      t.customer
                                                                        .email
                                                                    )
                                                                  ),
                                                                ]),
                                                              ]
                                                            ),
                                                            e._v(" "),
                                                            i(
                                                              "el-col",
                                                              {
                                                                staticClass:
                                                                  "am-align-right",
                                                                attrs: {
                                                                  sm: 9,
                                                                },
                                                              },
                                                              [
                                                                i(
                                                                  "div",
                                                                  {
                                                                    staticClass:
                                                                      "am-appointment-status small",
                                                                  },
                                                                  [
                                                                    i("span", {
                                                                      staticClass:
                                                                        "am-appointment-status-symbol",
                                                                      class:
                                                                        t.status,
                                                                    }),
                                                                    e._v(" "),
                                                                    i(
                                                                      "el-select",
                                                                      {
                                                                        on: {
                                                                          change:
                                                                            e.handleBookingChange,
                                                                        },
                                                                        model: {
                                                                          value:
                                                                            t.status,
                                                                          callback:
                                                                            function (
                                                                              i
                                                                            ) {
                                                                              e.$set(
                                                                                t,
                                                                                "status",
                                                                                i
                                                                              );
                                                                            },
                                                                          expression:
                                                                            "booking.status",
                                                                        },
                                                                      },
                                                                      e._l(
                                                                        e.statuses,
                                                                        function (
                                                                          e
                                                                        ) {
                                                                          return i(
                                                                            "el-option",
                                                                            {
                                                                              key: e.value,
                                                                              attrs:
                                                                                {
                                                                                  value:
                                                                                    e.value,
                                                                                },
                                                                            },
                                                                            [
                                                                              i(
                                                                                "span",
                                                                                {
                                                                                  staticClass:
                                                                                    "am-appointment-status-symbol",
                                                                                  class:
                                                                                    e.value,
                                                                                }
                                                                              ),
                                                                            ]
                                                                          );
                                                                        }
                                                                      ),
                                                                      1
                                                                    ),
                                                                  ],
                                                                  1
                                                                ),
                                                                e._v(" "),
                                                                i(
                                                                  "div",
                                                                  {
                                                                    staticClass:
                                                                      "am-appointment-persons small",
                                                                  },
                                                                  [
                                                                    i("img", {
                                                                      staticClass:
                                                                        "svg",
                                                                      attrs: {
                                                                        slot: "prefix",
                                                                        width:
                                                                          "16px",
                                                                        src:
                                                                          e
                                                                            .$root
                                                                            .getUrl +
                                                                          "public/img/group.svg",
                                                                      },
                                                                      slot: "prefix",
                                                                    }),
                                                                    e._v(" "),
                                                                    i(
                                                                      "el-select",
                                                                      {
                                                                        staticClass:
                                                                          "small-status",
                                                                        attrs: {
                                                                          "no-data-text":
                                                                            e
                                                                              .$root
                                                                              .labels
                                                                              .choose_a_group_service,
                                                                        },
                                                                        on: {
                                                                          change:
                                                                            e.handleBookingChange,
                                                                        },
                                                                        model: {
                                                                          value:
                                                                            t.persons,
                                                                          callback:
                                                                            function (
                                                                              i
                                                                            ) {
                                                                              e.$set(
                                                                                t,
                                                                                "persons",
                                                                                i
                                                                              );
                                                                            },
                                                                          expression:
                                                                            "booking.persons",
                                                                        },
                                                                      },
                                                                      e._l(
                                                                        e
                                                                          .appointment
                                                                          .providerServiceMaxCapacity,
                                                                        function (
                                                                          e
                                                                        ) {
                                                                          return i(
                                                                            "el-option",
                                                                            {
                                                                              key: e,
                                                                              attrs:
                                                                                {
                                                                                  value:
                                                                                    e,
                                                                                },
                                                                            }
                                                                          );
                                                                        }
                                                                      ),
                                                                      1
                                                                    ),
                                                                    e._v(" "),
                                                                    i(
                                                                      "el-tooltip",
                                                                      {
                                                                        attrs: {
                                                                          placement:
                                                                            "top",
                                                                        },
                                                                      },
                                                                      [
                                                                        i(
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
                                                                                      .customers_tooltip
                                                                                  ),
                                                                              },
                                                                            slot: "content",
                                                                          }
                                                                        ),
                                                                        e._v(
                                                                          " "
                                                                        ),
                                                                        i("i", {
                                                                          staticClass:
                                                                            "el-icon-question am-tooltip-icon",
                                                                        }),
                                                                      ]
                                                                    ),
                                                                  ],
                                                                  1
                                                                ),
                                                              ]
                                                            ),
                                                            e._v(" "),
                                                            i("i", {
                                                              staticClass:
                                                                "el-icon-close remove",
                                                              on: {
                                                                click:
                                                                  function (t) {
                                                                    return e.handleCustomerRemove(
                                                                      a
                                                                    );
                                                                  },
                                                              },
                                                            }),
                                                          ],
                                                          1
                                                        ),
                                                      ],
                                                      1
                                                    );
                                                  }
                                                ),
                                                e._v(" "),
                                                e.appointment.bookings.length >
                                                1
                                                  ? i(
                                                      "div",
                                                      {
                                                        staticClass:
                                                          "group-status-change",
                                                      },
                                                      [
                                                        i(
                                                          "el-row",
                                                          {
                                                            attrs: {
                                                              gutter: 4,
                                                            },
                                                          },
                                                          [
                                                            i(
                                                              "el-col",
                                                              {
                                                                attrs: {
                                                                  sm: 14,
                                                                },
                                                              },
                                                              [
                                                                i("h3", [
                                                                  e._v(
                                                                    e._s(
                                                                      e.$root
                                                                        .labels
                                                                        .change_group_status
                                                                    )
                                                                  ),
                                                                ]),
                                                              ]
                                                            ),
                                                            e._v(" "),
                                                            i(
                                                              "el-col",
                                                              {
                                                                attrs: {
                                                                  sm: 10,
                                                                },
                                                              },
                                                              [
                                                                i(
                                                                  "el-form-item",
                                                                  [
                                                                    i(
                                                                      "div",
                                                                      {
                                                                        staticClass:
                                                                          "am-appointment-status",
                                                                      },
                                                                      [
                                                                        i(
                                                                          "span",
                                                                          {
                                                                            staticClass:
                                                                              "am-appointment-status-symbol",
                                                                            class:
                                                                              e
                                                                                .appointment
                                                                                .status,
                                                                          }
                                                                        ),
                                                                        e._v(
                                                                          " "
                                                                        ),
                                                                        i(
                                                                          "el-select",
                                                                          {
                                                                            on: {
                                                                              change:
                                                                                e.handleGroupStatusChange,
                                                                              "visible-change":
                                                                                e.handleSelected,
                                                                            },
                                                                            model:
                                                                              {
                                                                                value:
                                                                                  e
                                                                                    .appointment
                                                                                    .status,
                                                                                callback:
                                                                                  function (
                                                                                    t
                                                                                  ) {
                                                                                    e.$set(
                                                                                      e.appointment,
                                                                                      "status",
                                                                                      t
                                                                                    );
                                                                                  },
                                                                                expression:
                                                                                  "appointment.status",
                                                                              },
                                                                          },
                                                                          e._l(
                                                                            e.statuses,
                                                                            function (
                                                                              t
                                                                            ) {
                                                                              return i(
                                                                                "el-option",
                                                                                {
                                                                                  key: t.value,
                                                                                  staticClass:
                                                                                    "am-appointment-status-option",
                                                                                  attrs:
                                                                                    {
                                                                                      label:
                                                                                        t.label,
                                                                                      value:
                                                                                        t.value,
                                                                                    },
                                                                                },
                                                                                [
                                                                                  i(
                                                                                    "span",
                                                                                    {
                                                                                      staticClass:
                                                                                        "am-appointment-status-symbol",
                                                                                      class:
                                                                                        t.value,
                                                                                    },
                                                                                    [
                                                                                      e._v(
                                                                                        e._s(
                                                                                          t.label
                                                                                        )
                                                                                      ),
                                                                                    ]
                                                                                  ),
                                                                                ]
                                                                              );
                                                                            }
                                                                          ),
                                                                          1
                                                                        ),
                                                                      ],
                                                                      1
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
                                                    )
                                                  : e._e(),
                                              ],
                                              2
                                            )
                                          : e._e(),
                                      ]
                                    ),
                                    e._v(" "),
                                    i(
                                      "el-form-item",
                                      {
                                        class: {
                                          active: e.categorySpinnerActive,
                                        },
                                        attrs: {
                                          label: e.$root.labels.category + ":",
                                        },
                                      },
                                      [
                                        i(
                                          "el-select",
                                          {
                                            attrs: {
                                              filterable: "",
                                              clearable: "",
                                              placeholder:
                                                e.$root.labels
                                                  .select_service_category,
                                              disabled:
                                                "customer" ===
                                                e.$root.settings.role,
                                            },
                                            on: {
                                              change: e.handleCategoryChange,
                                            },
                                            model: {
                                              value: e.appointment.categoryId,
                                              callback: function (t) {
                                                e.$set(
                                                  e.appointment,
                                                  "categoryId",
                                                  t
                                                );
                                              },
                                              expression:
                                                "appointment.categoryId",
                                            },
                                          },
                                          e._l(
                                            e.categoriesFiltered,
                                            function (e) {
                                              return i("el-option", {
                                                key: e.id,
                                                attrs: {
                                                  disabled: e.disabled,
                                                  label: e.name,
                                                  value: e.id,
                                                },
                                              });
                                            }
                                          ),
                                          1
                                        ),
                                        e._v(" "),
                                        i("img", {
                                          staticClass: "svg is-spinner",
                                          attrs: {
                                            src:
                                              e.$root.getUrl +
                                              "public/img/oval-spinner.svg",
                                          },
                                        }),
                                      ],
                                      1
                                    ),
                                    e._v(" "),
                                    i(
                                      "el-form-item",
                                      {
                                        class: {
                                          active: e.serviceSpinnerActive,
                                        },
                                        attrs: {
                                          label:
                                            e.capitalizeFirstLetter(
                                              e.$root.labels.service
                                            ) + ":",
                                          prop: "serviceId",
                                        },
                                      },
                                      [
                                        i(
                                          "el-select",
                                          {
                                            attrs: {
                                              filterable: "",
                                              clearable: "",
                                              placeholder:
                                                e.$root.labels.select_service +
                                                ":",
                                              disabled:
                                                "customer" ===
                                                e.$root.settings.role,
                                            },
                                            on: {
                                              change: e.handleServiceChange,
                                            },
                                            model: {
                                              value: e.appointment.serviceId,
                                              callback: function (t) {
                                                e.$set(
                                                  e.appointment,
                                                  "serviceId",
                                                  t
                                                );
                                              },
                                              expression:
                                                "appointment.serviceId",
                                            },
                                          },
                                          e._l(
                                            e.servicesFiltered,
                                            function (e) {
                                              return i("el-option", {
                                                key: e.id,
                                                attrs: {
                                                  disabled: e.disabled,
                                                  label: e.name,
                                                  value: e.id,
                                                },
                                              });
                                            }
                                          ),
                                          1
                                        ),
                                        e._v(" "),
                                        i("img", {
                                          staticClass: "svg is-spinner",
                                          attrs: {
                                            src:
                                              e.$root.getUrl +
                                              "public/img/oval-spinner.svg",
                                          },
                                        }),
                                      ],
                                      1
                                    ),
                                    e._v(" "),
                                    e.locationsFiltered.length
                                      ? i(
                                          "el-form-item",
                                          {
                                            class: {
                                              active: e.locationSpinnerActive,
                                            },
                                            attrs: {
                                              label:
                                                e.$root.labels.location + ":",
                                              disabled:
                                                "customer" ===
                                                e.$root.settings.role,
                                            },
                                          },
                                          [
                                            i(
                                              "el-select",
                                              {
                                                attrs: {
                                                  filterable: "",
                                                  clearable: "",
                                                  placeholder:
                                                    e.$root.labels
                                                      .select_location,
                                                },
                                                on: {
                                                  change:
                                                    e.handleLocationChange,
                                                },
                                                model: {
                                                  value:
                                                    e.appointment.locationId,
                                                  callback: function (t) {
                                                    e.$set(
                                                      e.appointment,
                                                      "locationId",
                                                      t
                                                    );
                                                  },
                                                  expression:
                                                    "appointment.locationId",
                                                },
                                              },
                                              e._l(
                                                e.locationsFiltered,
                                                function (e) {
                                                  return i("el-option", {
                                                    key: e.id,
                                                    attrs: {
                                                      disabled: e.disabled,
                                                      label: e.name,
                                                      value: e.id,
                                                    },
                                                  });
                                                }
                                              ),
                                              1
                                            ),
                                            e._v(" "),
                                            i("img", {
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
                                    i(
                                      "el-form-item",
                                      {
                                        directives: [
                                          {
                                            name: "show",
                                            rawName: "v-show",
                                            value:
                                              e.$root.settings.capabilities
                                                .canReadOthers &&
                                              e.$root.settings.capabilities
                                                .canWriteOthers,
                                            expression:
                                              "$root.settings.capabilities.canReadOthers && $root.settings.capabilities.canWriteOthers",
                                          },
                                        ],
                                        class: {
                                          active: e.employeeSpinnerActive,
                                        },
                                        attrs: {
                                          label:
                                            e.capitalizeFirstLetter(
                                              e.$root.labels.employee
                                            ) + ":",
                                          prop: "providerId",
                                        },
                                      },
                                      [
                                        i(
                                          "el-select",
                                          {
                                            attrs: {
                                              filterable: "",
                                              clearable: "",
                                              placeholder:
                                                e.$root.labels.select_employee,
                                              disabled:
                                                "customer" ===
                                                e.$root.settings.role,
                                            },
                                            on: {
                                              change: e.handleEmployeeChange,
                                            },
                                            model: {
                                              value: e.appointment.providerId,
                                              callback: function (t) {
                                                e.$set(
                                                  e.appointment,
                                                  "providerId",
                                                  t
                                                );
                                              },
                                              expression:
                                                "appointment.providerId",
                                            },
                                          },
                                          e._l(
                                            e.employeesFiltered,
                                            function (e) {
                                              return i("el-option", {
                                                key: e.id,
                                                attrs: {
                                                  disabled: e.disabled,
                                                  label:
                                                    e.firstName +
                                                    " " +
                                                    e.lastName,
                                                  value: e.id,
                                                },
                                              });
                                            }
                                          ),
                                          1
                                        ),
                                        e._v(" "),
                                        i("img", {
                                          staticClass: "svg is-spinner",
                                          attrs: {
                                            src:
                                              e.$root.getUrl +
                                              "public/img/oval-spinner.svg",
                                          },
                                        }),
                                      ],
                                      1
                                    ),
                                    e._v(" "),
                                    e.couponsFilteredService.length > 0 &&
                                    e.showCoupon &&
                                    ("admin" === e.$root.settings.role ||
                                      "manager" === e.$root.settings.role)
                                      ? i(
                                          "el-form-item",
                                          {
                                            class: {
                                              active: e.categorySpinnerActive,
                                            },
                                            attrs: {
                                              label:
                                                e.$root.labels.apply_coupon,
                                            },
                                          },
                                          [
                                            i(
                                              "el-select",
                                              {
                                                attrs: {
                                                  filterable: "",
                                                  clearable: "",
                                                  placeholder:
                                                    e.$root.labels
                                                      .select_coupon,
                                                  disabled:
                                                    "customer" ===
                                                    e.$root.settings.role,
                                                },
                                                on: {
                                                  change: e.filterServices,
                                                },
                                                model: {
                                                  value: e.coupon,
                                                  callback: function (t) {
                                                    e.coupon = t;
                                                  },
                                                  expression: "coupon",
                                                },
                                              },
                                              e._l(
                                                e.couponsFilteredService,
                                                function (e) {
                                                  return i("el-option", {
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
                                            i("img", {
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
                                    i(
                                      "el-row",
                                      { attrs: { gutter: 20 } },
                                      [
                                        i(
                                          "el-col",
                                          {
                                            staticClass: "v-calendar-column",
                                            attrs: { lg: 12, md: 12, sm: 24 },
                                          },
                                          [
                                            i(
                                              "el-form-item",
                                              {
                                                class: {
                                                  active: e.loadingTimeSlots,
                                                },
                                                attrs: {
                                                  label:
                                                    e.$root.labels.date + ":",
                                                  prop: "selectedDate",
                                                },
                                              },
                                              [
                                                i("v-date-picker", {
                                                  directives: [
                                                    {
                                                      name: "show",
                                                      rawName: "v-show",
                                                      value:
                                                        !e.loadingTimeSlots,
                                                      expression:
                                                        "!loadingTimeSlots",
                                                    },
                                                  ],
                                                  attrs: {
                                                    mode: "single",
                                                    "popover-visibility":
                                                      "focus",
                                                    "popover-direction": "top",
                                                    "popover-align":
                                                      e.screenWidth < 768
                                                        ? "center"
                                                        : "left",
                                                    "tint-color": e.isCabinet
                                                      ? e.$root.settings
                                                          .customization
                                                          .primaryColor
                                                      : "#1A84EE",
                                                    "show-day-popover": !1,
                                                    "input-props": {
                                                      class: "el-input__inner",
                                                    },
                                                    "available-dates":
                                                      e.availableDates,
                                                    "is-expanded": !1,
                                                    "is-required": !0,
                                                    "disabled-dates":
                                                      e.disabledWeekdays,
                                                    disabled: !1,
                                                    formats: e.vCalendarFormats,
                                                  },
                                                  on: { input: e.dateChange },
                                                  model: {
                                                    value:
                                                      e.appointment
                                                        .selectedDate,
                                                    callback: function (t) {
                                                      e.$set(
                                                        e.appointment,
                                                        "selectedDate",
                                                        t
                                                      );
                                                    },
                                                    expression:
                                                      "appointment.selectedDate",
                                                  },
                                                }),
                                                e._v(" "),
                                                i("el-input", {
                                                  directives: [
                                                    {
                                                      name: "show",
                                                      rawName: "v-show",
                                                      value: e.loadingTimeSlots,
                                                      expression:
                                                        "loadingTimeSlots",
                                                    },
                                                  ],
                                                  attrs: {
                                                    placeholder: e.appointment
                                                      .selectedDate
                                                      ? e.getFrontedFormattedDate(
                                                          e.appointment
                                                            .selectedDate
                                                        )
                                                      : this.momentDateFormat,
                                                    disabled: !0,
                                                  },
                                                }),
                                                e._v(" "),
                                                i("img", {
                                                  staticClass:
                                                    "svg is-spinner is-spinner-right",
                                                  attrs: {
                                                    src:
                                                      e.$root.getUrl +
                                                      "public/img/oval-spinner.svg",
                                                  },
                                                }),
                                              ],
                                              1
                                            ),
                                          ],
                                          1
                                        ),
                                        e._v(" "),
                                        i(
                                          "el-col",
                                          { attrs: { lg: 12, md: 12, sm: 24 } },
                                          [
                                            i(
                                              "el-form-item",
                                              {
                                                class: {
                                                  active: e.loadingTimeSlots,
                                                },
                                                attrs: {
                                                  label:
                                                    e.$root.labels.time + ":",
                                                  prop: "selectedPeriod.time",
                                                },
                                              },
                                              [
                                                i(
                                                  "el-select",
                                                  {
                                                    attrs: {
                                                      "value-key": "time",
                                                      filterable: "",
                                                      placeholder:
                                                        e.$root.labels
                                                          .select_time,
                                                      disabled:
                                                        e.loadingTimeSlots,
                                                    },
                                                    on: {
                                                      change: function (t) {
                                                        return e.selectedTime();
                                                      },
                                                    },
                                                    model: {
                                                      value:
                                                        e.appointment
                                                          .selectedPeriod,
                                                      callback: function (t) {
                                                        e.$set(
                                                          e.appointment,
                                                          "selectedPeriod",
                                                          t
                                                        );
                                                      },
                                                      expression:
                                                        "appointment.selectedPeriod",
                                                    },
                                                  },
                                                  e._l(
                                                    e.appointment.dateTimeSlots,
                                                    function (t) {
                                                      return i("el-option", {
                                                        key: t.time,
                                                        attrs: {
                                                          label:
                                                            e.getFrontedFormattedTime(
                                                              t.time + ":00"
                                                            ),
                                                          value: t,
                                                        },
                                                      });
                                                    }
                                                  ),
                                                  1
                                                ),
                                                e._v(" "),
                                                i("img", {
                                                  staticClass: "svg is-spinner",
                                                  attrs: {
                                                    src:
                                                      e.$root.getUrl +
                                                      "public/img/oval-spinner.svg",
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
                                    "customer" !== e.$root.settings.role &&
                                    !e.appointment.id &&
                                    e.appointment.serviceId &&
                                    "disabled" !==
                                      e.getServiceById(e.appointment.serviceId)
                                        .recurringCycle
                                      ? i(
                                          "el-form-item",
                                          { staticClass: "am-recurring-check" },
                                          [
                                            i(
                                              "el-checkbox",
                                              {
                                                attrs: {
                                                  disabled:
                                                    !e.appointment
                                                      .selectedDate ||
                                                    !e.appointment
                                                      .selectedPeriod,
                                                },
                                                on: {
                                                  change: function (t) {
                                                    return e.showRecurringTab();
                                                  },
                                                },
                                                model: {
                                                  value: e.activeRecurring,
                                                  callback: function (t) {
                                                    e.activeRecurring = t;
                                                  },
                                                  expression: "activeRecurring",
                                                },
                                              },
                                              [
                                                e._v(
                                                  "\n              " +
                                                    e._s(
                                                      e.$root.labels
                                                        .recurring_active
                                                    ) +
                                                    "\n              "
                                                ),
                                                i(
                                                  "el-tooltip",
                                                  {
                                                    attrs: { placement: "top" },
                                                  },
                                                  [
                                                    i("div", {
                                                      attrs: {
                                                        slot: "content",
                                                      },
                                                      domProps: {
                                                        innerHTML: e._s(
                                                          e.$root.labels
                                                            .recurring_active_tooltip
                                                        ),
                                                      },
                                                      slot: "content",
                                                    }),
                                                    e._v(" "),
                                                    i("i", {
                                                      staticClass:
                                                        "el-icon-question am-tooltip-icon",
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
                                    e._v(" "),
                                    "customer" !== this.$root.settings.role
                                      ? i(
                                          "el-form-item",
                                          [
                                            i(
                                              "el-checkbox",
                                              {
                                                on: {
                                                  change: function (t) {
                                                    return e.clearValidation();
                                                  },
                                                },
                                                model: {
                                                  value:
                                                    e.appointment
                                                      .notifyParticipants,
                                                  callback: function (t) {
                                                    e.$set(
                                                      e.appointment,
                                                      "notifyParticipants",
                                                      t
                                                    );
                                                  },
                                                  expression:
                                                    "appointment.notifyParticipants",
                                                },
                                              },
                                              [
                                                e._v(
                                                  "\n              " +
                                                    e._s(
                                                      e.$root.labels
                                                        .notify_customers
                                                    ) +
                                                    "\n              "
                                                ),
                                                i(
                                                  "el-tooltip",
                                                  {
                                                    attrs: { placement: "top" },
                                                  },
                                                  [
                                                    i("div", {
                                                      attrs: {
                                                        slot: "content",
                                                      },
                                                      domProps: {
                                                        innerHTML: e._s(
                                                          e.$root.labels
                                                            .notify_customers_tooltip
                                                        ),
                                                      },
                                                      slot: "content",
                                                    }),
                                                    e._v(" "),
                                                    i("i", {
                                                      staticClass:
                                                        "el-icon-question am-tooltip-icon",
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
                                    e._v(" "),
                                    "customer" !== this.$root.settings.role
                                      ? i("div", { staticClass: "am-divider" })
                                      : e._e(),
                                    e._v(" "),
                                    "customer" !== this.$root.settings.role
                                      ? i(
                                          "el-form-item",
                                          {
                                            attrs: {
                                              label:
                                                e.$root.labels.note_internal +
                                                ":",
                                            },
                                          },
                                          [
                                            i("el-input", {
                                              attrs: {
                                                type: "textarea",
                                                autosize: {
                                                  minRows: 4,
                                                  maxRows: 6,
                                                },
                                                placeholder: "",
                                              },
                                              on: {
                                                input: function (t) {
                                                  return e.clearValidation();
                                                },
                                              },
                                              model: {
                                                value:
                                                  e.appointment.internalNotes,
                                                callback: function (t) {
                                                  e.$set(
                                                    e.appointment,
                                                    "internalNotes",
                                                    t
                                                  );
                                                },
                                                expression:
                                                  "appointment.internalNotes",
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
                                "customer" !== this.$root.settings.role
                                  ? i(
                                      "el-tab-pane",
                                      { attrs: { name: "extras" } },
                                      [
                                        i(
                                          "span",
                                          {
                                            attrs: { slot: "label" },
                                            slot: "label",
                                          },
                                          [
                                            e._v(
                                              e._s(e.$root.labels.extras) +
                                                "\n            "
                                            ),
                                            e.appointment.serviceId &&
                                            e.appointment.bookings.length > 0 &&
                                            e.appointment.extrasSelectedCount >
                                              0
                                              ? i("el-badge", {
                                                  staticClass: "mark",
                                                  attrs: {
                                                    value:
                                                      e.appointment
                                                        .extrasSelectedCount,
                                                  },
                                                })
                                              : e._e(),
                                          ],
                                          1
                                        ),
                                        e._v(" "),
                                        i(
                                          "div",
                                          { staticClass: "am-dialog-table" },
                                          [
                                            e.appointment.providerId &&
                                            e.appointment.serviceId &&
                                            e.appointment.extrasCount > 0 &&
                                            e.appointment.bookings.length > 0
                                              ? i(
                                                  "div",
                                                  [
                                                    e._l(
                                                      e.appointment.bookings,
                                                      function (t, a) {
                                                        return [
                                                          "approved",
                                                          "pending",
                                                        ].includes(t.status)
                                                          ? i(
                                                              "div",
                                                              {
                                                                key: a,
                                                                staticClass:
                                                                  "am-customer-extras",
                                                              },
                                                              [
                                                                i(
                                                                  "el-row",
                                                                  {
                                                                    staticClass:
                                                                      "am-customer-extras-data",
                                                                  },
                                                                  [
                                                                    i(
                                                                      "el-col",
                                                                      [
                                                                        i(
                                                                          "h3",
                                                                          [
                                                                            e._v(
                                                                              e._s(
                                                                                t
                                                                                  .customer
                                                                                  .firstName
                                                                              ) +
                                                                                " " +
                                                                                e._s(
                                                                                  t
                                                                                    .customer
                                                                                    .lastName
                                                                                )
                                                                            ),
                                                                          ]
                                                                        ),
                                                                        e._v(
                                                                          " "
                                                                        ),
                                                                        i(
                                                                          "span",
                                                                          [
                                                                            e._v(
                                                                              e._s(
                                                                                t
                                                                                  .customer
                                                                                  .email
                                                                              )
                                                                            ),
                                                                          ]
                                                                        ),
                                                                      ]
                                                                    ),
                                                                  ],
                                                                  1
                                                                ),
                                                                e._v(" "),
                                                                e._l(
                                                                  t.extras,
                                                                  function (t) {
                                                                    return i(
                                                                      "el-row",
                                                                      {
                                                                        key: t.extraId,
                                                                        attrs: {
                                                                          gutter: 10,
                                                                        },
                                                                      },
                                                                      [
                                                                        i(
                                                                          "el-col",
                                                                          {
                                                                            attrs:
                                                                              {
                                                                                sm: 12,
                                                                                xs: 24,
                                                                              },
                                                                          },
                                                                          [
                                                                            i(
                                                                              "el-row",
                                                                              [
                                                                                i(
                                                                                  "el-col",
                                                                                  {
                                                                                    attrs:
                                                                                      {
                                                                                        sm: 4,
                                                                                        xs: 2,
                                                                                      },
                                                                                  },
                                                                                  [
                                                                                    i(
                                                                                      "el-checkbox",
                                                                                      {
                                                                                        on: {
                                                                                          change:
                                                                                            function (
                                                                                              i
                                                                                            ) {
                                                                                              return e.handleExtrasSelectionChange(
                                                                                                t
                                                                                              );
                                                                                            },
                                                                                        },
                                                                                        model:
                                                                                          {
                                                                                            value:
                                                                                              t.selected,
                                                                                            callback:
                                                                                              function (
                                                                                                i
                                                                                              ) {
                                                                                                e.$set(
                                                                                                  t,
                                                                                                  "selected",
                                                                                                  i
                                                                                                );
                                                                                              },
                                                                                            expression:
                                                                                              "item.selected",
                                                                                          },
                                                                                      }
                                                                                    ),
                                                                                  ],
                                                                                  1
                                                                                ),
                                                                                e._v(
                                                                                  " "
                                                                                ),
                                                                                i(
                                                                                  "el-col",
                                                                                  {
                                                                                    attrs:
                                                                                      {
                                                                                        sm: 20,
                                                                                        xs: 22,
                                                                                      },
                                                                                  },
                                                                                  [
                                                                                    i(
                                                                                      "span",
                                                                                      [
                                                                                        e._v(
                                                                                          e._s(
                                                                                            t.name
                                                                                          )
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
                                                                        ),
                                                                        e._v(
                                                                          " "
                                                                        ),
                                                                        i(
                                                                          "el-col",
                                                                          {
                                                                            attrs:
                                                                              {
                                                                                sm: 12,
                                                                                xs: 24,
                                                                              },
                                                                          },
                                                                          [
                                                                            i(
                                                                              "el-row",
                                                                              [
                                                                                i(
                                                                                  "el-col",
                                                                                  {
                                                                                    staticClass:
                                                                                      "align-right",
                                                                                    attrs:
                                                                                      {
                                                                                        sm: 14,
                                                                                        xs: 14,
                                                                                      },
                                                                                  },
                                                                                  [
                                                                                    i(
                                                                                      "el-input-number",
                                                                                      {
                                                                                        attrs:
                                                                                          {
                                                                                            type: "number",
                                                                                            value:
                                                                                              t.quantity,
                                                                                            disabled:
                                                                                              !t.selected,
                                                                                            min: 1,
                                                                                            max: t.maxQuantity,
                                                                                            size: "small",
                                                                                          },
                                                                                        on: {
                                                                                          change:
                                                                                            function (
                                                                                              i
                                                                                            ) {
                                                                                              return e.handleExtrasSelectionChange(
                                                                                                t
                                                                                              );
                                                                                            },
                                                                                        },
                                                                                        model:
                                                                                          {
                                                                                            value:
                                                                                              t.quantity,
                                                                                            callback:
                                                                                              function (
                                                                                                i
                                                                                              ) {
                                                                                                e.$set(
                                                                                                  t,
                                                                                                  "quantity",
                                                                                                  i
                                                                                                );
                                                                                              },
                                                                                            expression:
                                                                                              "item.quantity",
                                                                                          },
                                                                                      }
                                                                                    ),
                                                                                  ],
                                                                                  1
                                                                                ),
                                                                                e._v(
                                                                                  " "
                                                                                ),
                                                                                i(
                                                                                  "el-col",
                                                                                  {
                                                                                    staticClass:
                                                                                      "align-right",
                                                                                    attrs:
                                                                                      {
                                                                                        sm: 10,
                                                                                        xs: 10,
                                                                                      },
                                                                                  },
                                                                                  [
                                                                                    e._v(
                                                                                      e._s(
                                                                                        e.getFormattedPrice(
                                                                                          t.price
                                                                                        )
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
                                                                      ],
                                                                      1
                                                                    );
                                                                  }
                                                                ),
                                                                e._v(" "),
                                                                i(
                                                                  "el-row",
                                                                  {
                                                                    staticClass:
                                                                      "subtotal",
                                                                    attrs: {
                                                                      gutter: 10,
                                                                    },
                                                                  },
                                                                  [
                                                                    i(
                                                                      "el-col",
                                                                      {
                                                                        staticClass:
                                                                          "align-right",
                                                                        attrs: {
                                                                          span: 14,
                                                                        },
                                                                      },
                                                                      [
                                                                        e._v(
                                                                          "\n                    " +
                                                                            e._s(
                                                                              e
                                                                                .$root
                                                                                .labels
                                                                                .subtotal
                                                                            ) +
                                                                            ":\n                  "
                                                                        ),
                                                                      ]
                                                                    ),
                                                                    e._v(" "),
                                                                    i(
                                                                      "el-col",
                                                                      {
                                                                        staticClass:
                                                                          "align-right",
                                                                        attrs: {
                                                                          span: 10,
                                                                        },
                                                                      },
                                                                      [
                                                                        e._v(
                                                                          "\n                    " +
                                                                            e._s(
                                                                              e.getFormattedPrice(
                                                                                t.extrasTotalPrice
                                                                              )
                                                                            ) +
                                                                            "\n                  "
                                                                        ),
                                                                      ]
                                                                    ),
                                                                  ],
                                                                  1
                                                                ),
                                                              ],
                                                              2
                                                            )
                                                          : e._e();
                                                      }
                                                    ),
                                                    e._v(" "),
                                                    i(
                                                      "div",
                                                      { staticClass: "total" },
                                                      [
                                                        i(
                                                          "el-row",
                                                          {
                                                            attrs: {
                                                              gutter: 10,
                                                            },
                                                          },
                                                          [
                                                            i(
                                                              "el-col",
                                                              {
                                                                staticClass:
                                                                  "align-right",
                                                                attrs: {
                                                                  span: 14,
                                                                },
                                                              },
                                                              [
                                                                e._v(
                                                                  e._s(
                                                                    e.$root
                                                                      .labels
                                                                      .price
                                                                  ) + ":"
                                                                ),
                                                              ]
                                                            ),
                                                            e._v(" "),
                                                            i(
                                                              "el-col",
                                                              {
                                                                staticClass:
                                                                  "align-right ",
                                                                attrs: {
                                                                  span: 10,
                                                                },
                                                              },
                                                              [
                                                                e._v(
                                                                  e._s(
                                                                    e.getFormattedPrice(
                                                                      e
                                                                        .appointment
                                                                        .serviceTotalPrice
                                                                    )
                                                                  ) +
                                                                    "\n                  "
                                                                ),
                                                              ]
                                                            ),
                                                          ],
                                                          1
                                                        ),
                                                        e._v(" "),
                                                        i(
                                                          "el-row",
                                                          {
                                                            attrs: {
                                                              gutter: 10,
                                                            },
                                                          },
                                                          [
                                                            i(
                                                              "el-col",
                                                              {
                                                                staticClass:
                                                                  "align-right",
                                                                attrs: {
                                                                  span: 14,
                                                                },
                                                              },
                                                              [
                                                                e._v(
                                                                  e._s(
                                                                    e.$root
                                                                      .labels
                                                                      .extras
                                                                  ) + ":"
                                                                ),
                                                              ]
                                                            ),
                                                            e._v(" "),
                                                            i(
                                                              "el-col",
                                                              {
                                                                staticClass:
                                                                  "align-right ",
                                                                attrs: {
                                                                  span: 10,
                                                                },
                                                              },
                                                              [
                                                                e._v(
                                                                  e._s(
                                                                    e.getFormattedPrice(
                                                                      e
                                                                        .appointment
                                                                        .extrasTotalPrice
                                                                    )
                                                                  ) +
                                                                    "\n                  "
                                                                ),
                                                              ]
                                                            ),
                                                          ],
                                                          1
                                                        ),
                                                        e._v(" "),
                                                        i(
                                                          "el-row",
                                                          {
                                                            staticClass:
                                                              "am-strong",
                                                            attrs: {
                                                              gutter: 10,
                                                            },
                                                          },
                                                          [
                                                            i(
                                                              "el-col",
                                                              {
                                                                staticClass:
                                                                  "align-right",
                                                                attrs: {
                                                                  span: 14,
                                                                },
                                                              },
                                                              [
                                                                e._v(
                                                                  e._s(
                                                                    e.$root
                                                                      .labels
                                                                      .total
                                                                  ) + ":"
                                                                ),
                                                              ]
                                                            ),
                                                            e._v(" "),
                                                            i(
                                                              "el-col",
                                                              {
                                                                staticClass:
                                                                  "align-right ",
                                                                attrs: {
                                                                  span: 10,
                                                                },
                                                              },
                                                              [
                                                                e._v(
                                                                  e._s(
                                                                    e.getAppointmentPrice(
                                                                      e.savedAppointment
                                                                        ? e
                                                                            .savedAppointment
                                                                            .serviceId
                                                                        : e
                                                                            .appointment
                                                                            .serviceId,
                                                                      e.getAppointmentService(
                                                                        e.appointment
                                                                      ),
                                                                      e
                                                                        .appointment
                                                                        .bookings,
                                                                      !1
                                                                    )
                                                                  ) +
                                                                    "\n                  "
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
                                                  2
                                                )
                                              : e.appointment.serviceId &&
                                                e.appointment.providerId &&
                                                e.appointment.serviceId &&
                                                0 === e.appointment.extrasCount
                                              ? i("div", [
                                                  i(
                                                    "p",
                                                    {
                                                      attrs: {
                                                        align: "center",
                                                      },
                                                    },
                                                    [
                                                      e._v(
                                                        e._s(
                                                          e.$root.labels
                                                            .service_no_extras
                                                        )
                                                      ),
                                                    ]
                                                  ),
                                                ])
                                              : i("div", [
                                                  i(
                                                    "p",
                                                    {
                                                      attrs: {
                                                        align: "center",
                                                      },
                                                    },
                                                    [
                                                      e._v(
                                                        e._s(
                                                          e.$root.labels
                                                            .no_selected_extras_requirements
                                                        )
                                                      ),
                                                    ]
                                                  ),
                                                ]),
                                          ]
                                        ),
                                      ]
                                    )
                                  : e._e(),
                                e._v(" "),
                                0 !== e.appointment.id &&
                                "customer" !== this.$root.settings.role
                                  ? i(
                                      "el-tab-pane",
                                      {
                                        attrs: {
                                          label: e.$root.labels.payment,
                                          name: "payment",
                                        },
                                      },
                                      [
                                        i("dialog-appointment-payment", {
                                          attrs: {
                                            appointment: e.appointment,
                                            options: e.options,
                                          },
                                          on: { editPayment: e.editPayment },
                                        }),
                                      ],
                                      1
                                    )
                                  : e._e(),
                                e._v(" "),
                                e.showCustomFieldsTab() &&
                                "customer" !== this.$root.settings.role
                                  ? i(
                                      "el-tab-pane",
                                      {
                                        attrs: {
                                          label: e.$root.labels.custom_fields,
                                          name: "customFields",
                                        },
                                      },
                                      [
                                        i("dialog-custom-fields", {
                                          attrs: {
                                            appointment: e.appointment,
                                            entityId: e.appointment.serviceId,
                                            entityType: "appointment",
                                            customFields:
                                              this.options.entities
                                                .customFields,
                                            showCustomerInfo: !0,
                                            "hide-attachment-custom-field":
                                              e.hideAttachmentCustomField,
                                            "is-cabinet": e.isCabinet,
                                          },
                                          on: {
                                            clearValidation: e.clearValidation,
                                          },
                                        }),
                                      ],
                                      1
                                    )
                                  : e._e(),
                                e._v(" "),
                                e.$root.settings.zoom.enabled &&
                                e.appointment.zoomMeeting
                                  ? i(
                                      "el-tab-pane",
                                      {
                                        staticClass: "am-zoom-tabpane",
                                        attrs: {
                                          label: e.$root.labels.zoom,
                                          name: "zoom",
                                        },
                                      },
                                      [
                                        "customer" !== this.$root.settings.role
                                          ? i("div", [
                                              e._v(
                                                "\n            " +
                                                  e._s(
                                                    e.$root.labels
                                                      .zoom_start_link
                                                  ) +
                                                  ":\n            "
                                              ),
                                              i(
                                                "a",
                                                {
                                                  staticClass: "am-link",
                                                  attrs: {
                                                    href: e.appointment
                                                      .zoomMeeting.startUrl,
                                                  },
                                                },
                                                [
                                                  e._v(
                                                    e._s(
                                                      e.$root.labels
                                                        .zoom_click_to_start
                                                    )
                                                  ),
                                                ]
                                              ),
                                            ])
                                          : e._e(),
                                        e._v(" "),
                                        i("div", [
                                          e._v(
                                            "\n            " +
                                              e._s(
                                                e.$root.labels.zoom_join_link
                                              ) +
                                              ":\n            "
                                          ),
                                          i(
                                            "a",
                                            {
                                              staticClass: "am-link",
                                              attrs: {
                                                href: e.appointment.zoomMeeting
                                                  .joinUrl,
                                              },
                                            },
                                            [
                                              e._v(
                                                e._s(
                                                  e.$root.labels
                                                    .zoom_click_to_join
                                                )
                                              ),
                                            ]
                                          ),
                                        ]),
                                      ]
                                    )
                                  : e._e(),
                                e._v(" "),
                                e.appointment.serviceId &&
                                "disabled" !==
                                  e.getServiceById(e.appointment.serviceId)
                                    .recurringCycle &&
                                (e.appointment.id
                                  ? e.recurringAppointments.length
                                  : e.activeRecurring)
                                  ? i(
                                      "el-tab-pane",
                                      {
                                        attrs: {
                                          label: e.$root.labels.recurring,
                                          name: "recurring",
                                        },
                                      },
                                      [
                                        e.appointment.id
                                          ? i(
                                              "div",
                                              {
                                                staticClass:
                                                  "am-recurring-dates-edit",
                                              },
                                              e._l(
                                                e.recurringAppointments,
                                                function (t, a) {
                                                  return i(
                                                    "el-row",
                                                    { key: t.id },
                                                    [
                                                      i(
                                                        "el-col",
                                                        { attrs: { span: 3 } },
                                                        [
                                                          e._v(
                                                            "\n                " +
                                                              e._s(a + 1) +
                                                              "\n              "
                                                          ),
                                                        ]
                                                      ),
                                                      e._v(" "),
                                                      i(
                                                        "el-col",
                                                        { attrs: { span: 12 } },
                                                        [
                                                          e._v(
                                                            "\n                " +
                                                              e._s(
                                                                e.getFrontedFormattedDateTime(
                                                                  t.bookingStart
                                                                )
                                                              ) +
                                                              "\n              "
                                                          ),
                                                        ]
                                                      ),
                                                      e._v(" "),
                                                      i(
                                                        "el-col",
                                                        { attrs: { span: 9 } },
                                                        [
                                                          i(
                                                            "el-button",
                                                            {
                                                              on: {
                                                                click:
                                                                  function (i) {
                                                                    return e.openRecurringAppointment(
                                                                      t.id
                                                                    );
                                                                  },
                                                              },
                                                            },
                                                            [
                                                              e._v(
                                                                "\n                  " +
                                                                  e._s(
                                                                    e.$root
                                                                      .labels
                                                                      .edit
                                                                  ) +
                                                                  "\n                "
                                                              ),
                                                            ]
                                                          ),
                                                        ],
                                                        1
                                                      ),
                                                    ],
                                                    1
                                                  );
                                                }
                                              ),
                                              1
                                            )
                                          : e.appointment.selectedDate &&
                                            e.appointment.selectedPeriod &&
                                            e.activeRecurring
                                          ? i(
                                              "div",
                                              [
                                                i("recurring-setup", {
                                                  attrs: {
                                                    initialRecurringData:
                                                      e.initialRecurringData,
                                                    recurringData:
                                                      e.recurringData,
                                                    disabledWeekdays:
                                                      e.disabledWeekdays,
                                                    availableDates:
                                                      e.availableDates,
                                                    calendarTimeSlots:
                                                      e.appointment
                                                        .calendarTimeSlots,
                                                    service: e.getServiceById(
                                                      e.appointment.serviceId
                                                    ),
                                                    isFrontend: !1,
                                                    "form-type": "recurring",
                                                    "forms-data":
                                                      e.renderObject,
                                                  },
                                                }),
                                                e._v(" "),
                                                i("recurring-dates", {
                                                  attrs: {
                                                    dialogClass:
                                                      "am-recurring-dates",
                                                    recurringData:
                                                      e.recurringData,
                                                    availableDates:
                                                      e.availableDates,
                                                    calendarTimeSlots:
                                                      e.appointment
                                                        .calendarTimeSlots,
                                                    isFrontend: !1,
                                                    service: e.getServiceById(
                                                      e.appointment.serviceId
                                                    ),
                                                    selectedExtras:
                                                      e.getSelectedDistinctExtras(),
                                                    "form-type": "recurring",
                                                    "forms-data":
                                                      e.renderObject,
                                                  },
                                                  on: {
                                                    datesDefined:
                                                      e.recurringDatesDefined,
                                                  },
                                                }),
                                              ],
                                              1
                                            )
                                          : e.activeRecurring
                                          ? i("div", [
                                              i(
                                                "p",
                                                { attrs: { align: "center" } },
                                                [
                                                  e._v(
                                                    e._s(
                                                      e.$root.labels
                                                        .no_selected_slot_requirements
                                                    )
                                                  ),
                                                ]
                                              ),
                                            ])
                                          : e._e(),
                                      ]
                                    )
                                  : e._e(),
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
            null === e.appointment ||
            e.dialogLoading ||
            "customer" === this.$root.settings.role
              ? e._e()
              : i("dialog-actions", {
                  attrs: {
                    formName: "appointment",
                    urlName: "appointments",
                    isNew: 0 === e.appointment.id,
                    entity: e.appointment,
                    getParsedEntity: e.getParsedEntity,
                    haveSaveConfirmation: e.haveSaveConfirmation,
                    hasIcons: !0,
                    status: { on: "visible", off: "hidden" },
                    action: {
                      haveAdd: !0,
                      haveEdit: !0,
                      haveStatus: !1,
                      haveRemove:
                        !0 === e.$root.settings.capabilities.canDelete,
                      haveRemoveEffect: !1,
                      haveDuplicate: e.haveDuplicate,
                      haveSaveWarning: this.activeRecurring,
                    },
                    message: {
                      success: {
                        save: e.$root.labels.appointment_saved,
                        remove: e.$root.labels.appointment_deleted,
                        show: "",
                        hide: "",
                      },
                      confirm: {
                        remove: e.$root.labels.confirm_delete_appointment,
                        show: "",
                        hide: "",
                        duplicate: e.$root.labels.confirm_duplicate_appointment,
                        save: e.$root.labels.recurring_changed_message,
                      },
                    },
                  },
                  on: {
                    errorCallback: e.errorCallback,
                    validationBookingsFailCallback:
                      e.validationBookingsFailCallback,
                  },
                }),
            e._v(" "),
            i("div", [
              "customer" === this.$root.settings.role
                ? i("div", { staticClass: "am-dialog-footer" }, [
                    i(
                      "div",
                      { staticClass: "am-dialog-footer-actions" },
                      [
                        i(
                          "el-row",
                          [
                            i(
                              "el-col",
                              { staticClass: "align-right", attrs: { sm: 24 } },
                              [
                                i(
                                  "el-button",
                                  {
                                    staticClass: "am-dialog-create",
                                    attrs: { type: "primary" },
                                    on: { click: e.updateByCustomer },
                                  },
                                  [
                                    e._v(
                                      "\n              " +
                                        e._s(e.$root.labels.save) +
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
                      ],
                      1
                    ),
                  ])
                : e._e(),
            ]),
          ],
          1
        );
      },
      staticRenderFns: [],
    };
  },
  893: function (e, t, i) {
    var a = i(685)(i(894), i(895), !1, null, null, null);
    e.exports = a.exports;
  },
  894: function (e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = i(702),
      o = i.n(a),
      n = i(755),
      s = (i.n(n), i(337)),
      r = i(687),
      l = i(691),
      c = i(689);
    t.default = {
      mixins: [r.a, s.a, l.a, c.a],
      props: { modalData: null, bookingFetched: !1 },
      data: function () {
        return {
          booking: {},
          dialogLoading: !0,
          finance: {
            bookablePriceTotal: 0,
            extrasPriceTotal: 0,
            discountTotal: 0,
            subTotal: 0,
            due: 0,
          },
          form: new o.a(),
          payment: {},
          paymentStatuses: [
            { value: "pending", label: this.$root.labels.pending },
            { value: "paid", label: this.$root.labels.paid },
            { value: "partiallyPaid", label: this.$root.labels.partially_paid },
          ],
          showDeleteConfirmation: !1,
          showUpdatePaymentAmount: !1,
        };
      },
      created: function () {
        this.bookingFetched && (this.setFinance(), (this.dialogLoading = !1));
      },
      updated: function () {
        this.$nextTick(function () {
          var e = this;
          setTimeout(function () {
            e.inlineSVG();
          }, 5);
        });
      },
      methods: {
        instantiateDialog: function () {
          null !== this.modalData.bookings &&
            (this.setFinance(), (this.dialogLoading = !1));
        },
        setFinance: function () {
          var e = this;
          e.modalData.bookings.forEach(function (t) {
            t.payments.forEach(function (i) {
              i.id === e.modalData.paymentId &&
                ((e.payment = i),
                (e.booking = t),
                (e.finance.extrasPriceTotal = 0),
                t.extras.forEach(function (i) {
                  e.finance.extrasPriceTotal +=
                    i.price * i.quantity * (i.aggregatedPrice ? t.persons : 1);
                }),
                (e.finance.bookablePriceTotal =
                  t.price * (t.aggregatedPrice ? t.persons : 1)),
                (e.finance.subTotal =
                  e.finance.bookablePriceTotal + e.finance.extrasPriceTotal),
                (e.finance.discountTotal =
                  (e.finance.subTotal / 100) *
                    (t.coupon ? t.coupon.discount : 0) +
                  (t.coupon ? t.coupon.deduction : 0)),
                (e.finance.total =
                  e.finance.subTotal - e.finance.discountTotal),
                (e.finance.total = e.finance.total >= 0 ? e.finance.total : 0),
                (e.finance.due =
                  e.finance.total - e.payment.amount >= 0
                    ? e.finance.total - e.payment.amount
                    : 0));
            });
          });
        },
        closeDialog: function () {
          this.$emit("closeDialogPayment");
        },
        getPaymentStatus: function (e) {
          var t = "";
          return (
            this.paymentStatuses.forEach(function (i) {
              i.value === e && (t = i.label);
            }),
            t
          );
        },
        deletePayment: function () {
          var e = this;
          (this.dialogLoading = !0),
            this.$http
              .post(
                this.$root.getAjaxUrl + "/payments/delete/" + this.payment.id
              )
              .then(function (t) {
                (e.dialogLoading = !1),
                  t.data &&
                    (e.$emit("updatePaymentCallback", e.payment.id),
                    (e.showDeleteConfirmation = !e.showDeleteConfirmation),
                    e.notify(
                      e.$root.labels.success,
                      e.$root.labels.payment_deleted,
                      "success"
                    ));
              })
              .catch(function (t) {
                (e.dialogLoading = !1), (e.errorMessage = t.message);
              });
        },
        updatePayment: function () {
          var e = this;
          (this.dialogLoading = !0),
            this.form
              .post(
                this.$root.getAjaxUrl + "/payments/" + this.payment.id,
                this.payment
              )
              .then(function () {
                (e.showUpdatePaymentAmount = !e.showUpdatePaymentAmount),
                  e.setFinance(),
                  e.notify(
                    e.$root.labels.success,
                    e.$root.labels.payment_saved,
                    "success"
                  ),
                  e.$emit("updatePaymentCallback"),
                  (e.dialogLoading = !1);
              })
              .catch(function (t) {
                (e.dialogLoading = !1), (e.errorMessage = t.message);
              });
        },
        getPaymentGatewayNiceName: function () {
          return "onSite" === this.payment.gateway
            ? this.$root.labels.on_site
            : "wc" === this.payment.gateway
            ? this.payment.gatewayTitle
            : this.payment.gateway
            ? this.payment.gateway.charAt(0).toUpperCase() +
              this.payment.gateway.slice(1)
            : void 0;
        },
      },
      watch: {
        bookingFetched: function () {
          !0 === this.bookingFetched && this.instantiateDialog();
        },
      },
      components: { Money: n.Money },
    };
  },
  895: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          i = e._self._c || t;
        return i("div", [
          i(
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
              i("div", { staticClass: "am-dialog-loader-content" }, [
                i("img", {
                  attrs: { src: e.$root.getUrl + "public/img/spinner.svg" },
                }),
                e._v(" "),
                i("p", [e._v(e._s(e.$root.labels.loader_message))]),
              ]),
            ]
          ),
          e._v(" "),
          e.dialogLoading
            ? e._e()
            : i("div", { staticClass: "am-dialog-scrollable" }, [
                i(
                  "div",
                  { staticClass: "am-dialog-header" },
                  [
                    i(
                      "el-row",
                      [
                        i("el-col", { attrs: { span: 18 } }, [
                          i("h2", [e._v(e._s(e.$root.labels.payment_details))]),
                        ]),
                        e._v(" "),
                        i(
                          "el-col",
                          { staticClass: "align-right", attrs: { span: 6 } },
                          [
                            i("el-button", {
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
                i(
                  "div",
                  { staticClass: "am-payment-details" },
                  [
                    i(
                      "el-row",
                      { staticClass: "am-payment-details-row" },
                      [
                        i("h4", [e._v(e._s(e.$root.labels.customer))]),
                        e._v(" "),
                        i("el-col", { attrs: { span: 24 } }, [
                          i("h3", [
                            e._v(
                              e._s(
                                e.modalData.customer
                                  ? e.modalData.customer.firstName +
                                      " " +
                                      e.modalData.customer.lastName
                                  : ""
                              )
                            ),
                          ]),
                          e._v(" "),
                          i("p", [
                            e._v(
                              e._s(
                                e.modalData.customer
                                  ? e.modalData.customer.email
                                  : ""
                              )
                            ),
                          ]),
                        ]),
                      ],
                      1
                    ),
                    e._v(" "),
                    i(
                      "el-row",
                      { staticClass: "am-payment-details-row" },
                      [
                        i("h4", [e._v(e._s(e.$root.labels.payment))]),
                        e._v(" "),
                        i("el-col", { attrs: { span: 12 } }, [
                          i("p", [e._v(e._s(e.$root.labels.date))]),
                          e._v(" "),
                          i("p", [e._v(e._s(e.$root.labels.payment_method))]),
                          e._v(" "),
                          i("p", [e._v(e._s(e.$root.labels.status))]),
                        ]),
                        e._v(" "),
                        i("el-col", { attrs: { span: 12 } }, [
                          i("p", { staticClass: "am-semi-strong" }, [
                            e._v(
                              e._s(
                                e.getFrontedFormattedDate(e.payment.dateTime)
                              )
                            ),
                          ]),
                          e._v(" "),
                          i("p", { staticClass: "am-semi-strong" }, [
                            i("img", {
                              staticClass: "svg",
                              attrs: {
                                width: "14px",
                                src:
                                  e.$root.getUrl +
                                  "public/img/payments/" +
                                  e.payment.gateway +
                                  ".svg",
                              },
                            }),
                            e._v(
                              "\n            " +
                                e._s(e.getPaymentGatewayNiceName()) +
                                "\n          "
                            ),
                          ]),
                          e._v(" "),
                          i("p", { staticClass: "am-semi-strong" }, [
                            i("i", {
                              class: {
                                "el-icon-circle-check":
                                  "paid" === e.payment.status ||
                                  "partiallyPaid" === e.payment.status,
                                "partially-paid":
                                  "partiallyPaid" === e.payment.status,
                                "el-icon-refresh":
                                  "pending" === e.payment.status,
                              },
                            }),
                            e._v(" "),
                            i("span", [
                              e._v(e._s(e.getPaymentStatus(e.payment.status))),
                            ]),
                          ]),
                        ]),
                      ],
                      1
                    ),
                    e._v(" "),
                    i(
                      "el-row",
                      { staticClass: "am-payment-details-row" },
                      [
                        i("h4", [
                          e._v(
                            e._s(
                              e.$root.labels[e.modalData.bookableType + "_info"]
                            )
                          ),
                        ]),
                        e._v(" "),
                        i("el-col", { attrs: { span: 12 } }, [
                          i("p", [
                            e._v(
                              e._s(e.$root.labels[e.modalData.bookableType])
                            ),
                          ]),
                          e._v(" "),
                          "package" !== e.modalData.bookableType
                            ? i("p", [e._v(e._s(e.$root.labels.date))])
                            : e._e(),
                          e._v(" "),
                          e.modalData.providers.length &&
                          "appointment" === e.modalData.bookableType
                            ? i("p", [e._v(e._s(e.$root.labels.employee))])
                            : e._e(),
                        ]),
                        e._v(" "),
                        i("el-col", { attrs: { span: 12 } }, [
                          i("p", { staticClass: "am-semi-strong" }, [
                            e._v(e._s(e.modalData.bookableName)),
                          ]),
                          e._v(" "),
                          "package" !== e.modalData.bookableType
                            ? i("p", { staticClass: "am-semi-strong" }, [
                                e._v(
                                  e._s(
                                    e.getFrontedFormattedDateTime(
                                      e.modalData.bookingStart
                                    )
                                  )
                                ),
                              ])
                            : e._e(),
                          e._v(" "),
                          e.modalData.providers.length &&
                          "appointment" === e.modalData.bookableType
                            ? i("p", { staticClass: "am-semi-strong" }, [
                                i("img", {
                                  staticClass: "am-employee-photo",
                                  attrs: {
                                    src: e.pictureLoad(
                                      e.modalData.providers[0],
                                      !0
                                    ),
                                  },
                                  on: {
                                    error: function (t) {
                                      return e.imageLoadError(
                                        e.modalData.providers[0].id,
                                        !0
                                      );
                                    },
                                  },
                                }),
                                e._v(
                                  "\n            " +
                                    e._s(
                                      e.modalData.providers.length
                                        ? e.modalData.providers[0].fullName
                                        : ""
                                    ) +
                                    "\n          "
                                ),
                              ])
                            : e._e(),
                        ]),
                      ],
                      1
                    ),
                    e._v(" "),
                    i(
                      "el-row",
                      {
                        staticClass:
                          "am-payment-details-row am-payment-summary",
                      },
                      [
                        i("el-col", { attrs: { span: 12 } }, [
                          i("p", [
                            e._v(
                              e._s(
                                e.$root.labels[
                                  ("appointment" === e.modalData.bookableType
                                    ? "service"
                                    : "event" === e.modalData.bookableType
                                    ? "event"
                                    : "package") + "_price"
                                ]
                              )
                            ),
                          ]),
                          e._v(" "),
                          "package" !== e.modalData.bookableType
                            ? i("p", [e._v(e._s(e.$root.labels.extras))])
                            : e._e(),
                          e._v(" "),
                          "package" !== e.modalData.bookableType
                            ? i("p", [e._v(e._s(e.$root.labels.subtotal))])
                            : e._e(),
                          e._v(" "),
                          "package" !== e.modalData.bookableType
                            ? i("p", [
                                e._v(e._s(e.$root.labels.discount_amount)),
                              ])
                            : e._e(),
                          e._v(" "),
                          i("p", [e._v(e._s(e.$root.labels.paid))]),
                          e._v(" "),
                          i("p", [e._v(e._s(e.$root.labels.due))]),
                          e._v(" "),
                          i("p", { staticClass: "am-payment-total" }, [
                            e._v(e._s(e.$root.labels.total)),
                          ]),
                        ]),
                        e._v(" "),
                        i("el-col", { attrs: { span: 12 } }, [
                          i("p", { staticClass: "am-semi-strong" }, [
                            e._v(
                              e._s(
                                e.getFormattedPrice(
                                  e.finance.bookablePriceTotal
                                )
                              )
                            ),
                          ]),
                          e._v(" "),
                          "package" !== e.modalData.bookableType
                            ? i("p", { staticClass: "am-semi-strong" }, [
                                e._v(
                                  e._s(
                                    e.getFormattedPrice(
                                      e.finance.extrasPriceTotal
                                    )
                                  )
                                ),
                              ])
                            : e._e(),
                          e._v(" "),
                          "package" !== e.modalData.bookableType
                            ? i("p", { staticClass: "am-semi-strong" }, [
                                e._v(
                                  e._s(e.getFormattedPrice(e.finance.subTotal))
                                ),
                              ])
                            : e._e(),
                          e._v(" "),
                          "package" !== e.modalData.bookableType
                            ? i("p", { staticClass: "am-semi-strong" }, [
                                e._v(
                                  e._s(
                                    e.getFormattedPrice(e.finance.discountTotal)
                                  )
                                ),
                              ])
                            : e._e(),
                          e._v(" "),
                          i("p", { staticClass: "am-semi-strong" }, [
                            e._v(e._s(e.getFormattedPrice(e.payment.amount))),
                          ]),
                          e._v(" "),
                          i("p", { staticClass: "am-semi-strong" }, [
                            e._v(e._s(e.getFormattedPrice(e.finance.due))),
                          ]),
                          e._v(" "),
                          i(
                            "p",
                            { staticClass: "am-semi-strong am-payment-total" },
                            [e._v(e._s(e.getFormattedPrice(e.finance.total)))]
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
          !0 !== e.$root.settings.capabilities.canWriteOthers || e.dialogLoading
            ? e._e()
            : i("div", { staticClass: "am-dialog-footer" }, [
                i(
                  "div",
                  { staticClass: "am-dialog-footer-actions" },
                  [
                    i("transition", { attrs: { name: "slide-vertical" } }, [
                      i(
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
                          i("h3", [
                            e._v(e._s(e.$root.labels.confirm_delete_payment)),
                          ]),
                          e._v(" "),
                          i(
                            "div",
                            { staticClass: "align-left" },
                            [
                              i(
                                "el-button",
                                {
                                  attrs: { size: "small" },
                                  on: {
                                    click: function (t) {
                                      (e.showDeleteConfirmation =
                                        !e.showDeleteConfirmation),
                                        (e.showDeleteConfirmation = !1);
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
                              i(
                                "el-button",
                                {
                                  attrs: { size: "small", type: "primary" },
                                  on: {
                                    click: function (t) {
                                      return e.deletePayment();
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
                              ),
                            ],
                            1
                          ),
                        ]
                      ),
                    ]),
                    e._v(" "),
                    i("transition", { attrs: { name: "slide-vertical" } }, [
                      i(
                        "div",
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value: e.showUpdatePaymentAmount,
                              expression: "showUpdatePaymentAmount",
                            },
                          ],
                          staticClass: "am-dialog-confirmation",
                        },
                        [
                          i(
                            "el-form",
                            { attrs: { "label-position": "top" } },
                            [
                              i("h3", [
                                e._v(
                                  e._s(e.$root.labels.enter_new_payment_amount)
                                ),
                              ]),
                              e._v(" "),
                              i(
                                "el-row",
                                {
                                  staticClass: "am-no-padding",
                                  attrs: { gutter: 24 },
                                },
                                [
                                  i(
                                    "el-col",
                                    { attrs: { span: 12 } },
                                    [
                                      i(
                                        "el-form-item",
                                        {
                                          attrs: {
                                            label: e.$root.labels.payment + ":",
                                          },
                                        },
                                        [
                                          i(
                                            "money",
                                            e._b(
                                              {
                                                staticClass: "el-input__inner",
                                                model: {
                                                  value: e.payment.amount,
                                                  callback: function (t) {
                                                    e.$set(
                                                      e.payment,
                                                      "amount",
                                                      t
                                                    );
                                                  },
                                                  expression: "payment.amount",
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
                                  i(
                                    "el-col",
                                    { attrs: { span: 12 } },
                                    [
                                      i(
                                        "el-form-item",
                                        {
                                          attrs: {
                                            label: e.$root.labels.status + ":",
                                          },
                                        },
                                        [
                                          i(
                                            "el-select",
                                            {
                                              model: {
                                                value: e.payment.status,
                                                callback: function (t) {
                                                  e.$set(
                                                    e.payment,
                                                    "status",
                                                    t
                                                  );
                                                },
                                                expression: "payment.status",
                                              },
                                            },
                                            e._l(
                                              e.paymentStatuses,
                                              function (t) {
                                                return i(
                                                  "el-option",
                                                  {
                                                    key: t.value,
                                                    staticClass:
                                                      "am-appointment-status-option",
                                                    attrs: {
                                                      label: t.label,
                                                      value: t.value,
                                                    },
                                                  },
                                                  [
                                                    i("span", {
                                                      staticClass:
                                                        "am-appointment-status-symbol",
                                                      class: t.value,
                                                    }),
                                                    e._v(" "),
                                                    i("span", [
                                                      e._v(e._s(t.label)),
                                                    ]),
                                                  ]
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
                              i(
                                "div",
                                { staticClass: "align-left" },
                                [
                                  i(
                                    "el-button",
                                    {
                                      attrs: { size: "small" },
                                      on: {
                                        click: function (t) {
                                          e.showUpdatePaymentAmount =
                                            !e.showUpdatePaymentAmount;
                                        },
                                      },
                                    },
                                    [
                                      e._v(
                                        "\n                " +
                                          e._s(e.$root.labels.close) +
                                          "\n              "
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
                    e._v(" "),
                    i(
                      "el-row",
                      [
                        i(
                          "el-col",
                          { staticClass: "align-left", attrs: { sm: 6 } },
                          [
                            !0 === e.$root.settings.capabilities.canDelete
                              ? i(
                                  "el-button",
                                  {
                                    staticClass: "am-button-icon",
                                    on: {
                                      click: function (t) {
                                        (e.showDeleteConfirmation =
                                          !e.showDeleteConfirmation),
                                          (e.showUpdatePaymentAmount = !1);
                                      },
                                    },
                                  },
                                  [
                                    i("img", {
                                      staticClass: "svg",
                                      attrs: {
                                        alt: e.$root.labels.delete,
                                        src:
                                          e.$root.getUrl +
                                          "public/img/delete.svg",
                                      },
                                    }),
                                  ]
                                )
                              : e._e(),
                            e._v(" "),
                            i(
                              "el-button",
                              {
                                staticClass: "am-button-icon",
                                on: {
                                  click: function (t) {
                                    (e.showUpdatePaymentAmount =
                                      !e.showUpdatePaymentAmount),
                                      (e.showDeleteConfirmation = !1);
                                  },
                                },
                              },
                              [
                                i("img", {
                                  staticClass: "svg",
                                  attrs: {
                                    alt: e.$root.labels.edit,
                                    src: e.$root.getUrl + "public/img/edit.svg",
                                  },
                                }),
                              ]
                            ),
                          ],
                          1
                        ),
                        e._v(" "),
                        i(
                          "el-col",
                          { staticClass: "align-right", attrs: { sm: 18 } },
                          [
                            i(
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
                            i(
                              "el-button",
                              {
                                staticClass: "am-dialog-create",
                                attrs: { type: "primary" },
                                on: {
                                  click: function (t) {
                                    return e.updatePayment();
                                  },
                                },
                              },
                              [
                                e._v(
                                  "\n            " +
                                    e._s(e.$root.labels.save) +
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
  933: function (e, t, i) {
    var a = i(685)(i(934), i(935), !1, null, null, null);
    e.exports = a.exports;
  },
  934: function (e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = i(690),
      o = i(689),
      n = i(337),
      s = i(694);
    t.default = {
      mixins: [a.a, o.a, n.a, s.a],
      props: ["app", "options"],
      data: function () {
        return {};
      },
      methods: {
        getCustomFieldLabel: function (e, t) {
          var i = this.options.entities.customFields.find(function (e) {
            return e.id === parseInt(t);
          });
          return void 0 !== i ? i.label.trim() : e.label.trim();
        },
        showCustomField: function (e) {
          return Array.isArray(e) ? e.length > 0 : !!e;
        },
      },
    };
  },
  935: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          i = e._self._c || t;
        return i("div", [
          i(
            "div",
            { staticClass: "am-appointment-details" },
            [
              i(
                "el-row",
                [
                  i(
                    "el-row",
                    {
                      staticClass:
                        "has-divider am-appointment-id am-appointment-id-details",
                    },
                    [
                      i("el-col", { attrs: { sm: 5 } }, [
                        i("p", { staticClass: "am-data" }, [
                          e._v(e._s(e.$root.labels.id) + ":"),
                        ]),
                      ]),
                      e._v(" "),
                      i("el-col", { attrs: { sm: 7 } }, [
                        i("p", { staticClass: "am-value" }, [
                          e._v(
                            "\n            " + e._s(e.app.id) + "\n          "
                          ),
                        ]),
                      ]),
                    ],
                    1
                  ),
                  e._v(" "),
                  e.app.zoomMeeting
                    ? i(
                        "el-row",
                        {
                          staticClass: "am-zoom",
                          class: {
                            "has-divider": "customer" !== e.$root.settings.role,
                          },
                        },
                        [
                          i(
                            "el-col",
                            { attrs: { sm: 12 } },
                            [
                              "customer" !== e.$root.settings.role
                                ? i(
                                    "el-row",
                                    [
                                      i(
                                        "el-col",
                                        {
                                          staticClass: "am-zoom-col-icon",
                                          attrs: { sm: 10 },
                                        },
                                        [
                                          i("p", { staticClass: "am-data" }, [
                                            e._v(
                                              e._s(
                                                e.$root.labels.zoom_start_link
                                              ) + ":"
                                            ),
                                          ]),
                                        ]
                                      ),
                                      e._v(" "),
                                      i("el-col", { attrs: { sm: 14 } }, [
                                        i("p", { staticClass: "am-value" }, [
                                          i(
                                            "a",
                                            {
                                              staticClass: "am-link",
                                              attrs: {
                                                href: e.app.zoomMeeting
                                                  .startUrl,
                                              },
                                            },
                                            [
                                              e._v(
                                                e._s(
                                                  e.$root.labels
                                                    .zoom_click_to_start
                                                )
                                              ),
                                            ]
                                          ),
                                        ]),
                                      ]),
                                    ],
                                    1
                                  )
                                : e._e(),
                            ],
                            1
                          ),
                          e._v(" "),
                          i(
                            "el-col",
                            { attrs: { sm: 12 } },
                            [
                              i(
                                "el-row",
                                [
                                  i(
                                    "el-col",
                                    {
                                      staticClass: "am-zoom-col-icon",
                                      attrs: { sm: 10 },
                                    },
                                    [
                                      i("p", { staticClass: "am-data" }, [
                                        e._v(
                                          e._s(e.$root.labels.zoom_join_link) +
                                            ":"
                                        ),
                                      ]),
                                    ]
                                  ),
                                  e._v(" "),
                                  i("el-col", { attrs: { sm: 14 } }, [
                                    i("p", { staticClass: "am-value" }, [
                                      i(
                                        "a",
                                        {
                                          staticClass: "am-link",
                                          attrs: {
                                            href: e.app.zoomMeeting.joinUrl,
                                          },
                                        },
                                        [e._v(e._s(e.app.zoomMeeting.joinUrl))]
                                      ),
                                    ]),
                                  ]),
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
                  e._l(e.app.bookings, function (t, a) {
                    return i(
                      "el-row",
                      {
                        key: a,
                        class: {
                          "has-divider":
                            e.app.bookings.length > 1 &&
                            (e.app.bookings.length !== a + 1 ||
                              e.app.internalNotes),
                        },
                      },
                      [
                        e.app.bookings.length > 1
                          ? i("h3", [
                              e._v(
                                "\n          " +
                                  e._s(
                                    null !==
                                      (e.user = e.getCustomerById(t.customerId))
                                      ? e.user.firstName + " " + e.user.lastName
                                      : ""
                                  ) +
                                  "\n        "
                              ),
                            ])
                          : e._e(),
                        e._v(" "),
                        "customer" !== e.$root.settings.role
                          ? i(
                              "div",
                              { staticClass: "am-appointment-collapsed-field" },
                              [
                                i("el-col", { attrs: { sm: 5 } }, [
                                  i("p", { staticClass: "am-data" }, [
                                    e._v(
                                      e._s(e.$root.labels.customer_email) + ":"
                                    ),
                                  ]),
                                ]),
                                e._v(" "),
                                i("el-col", { attrs: { sm: 7 } }, [
                                  i("p", { staticClass: "am-value" }, [
                                    e._v(
                                      "\n              " +
                                        e._s(
                                          null !==
                                            (e.user = e.getCustomerById(
                                              e.app.bookings[a].customerId
                                            ))
                                            ? e.user.email
                                            : ""
                                        ) +
                                        "\n            "
                                    ),
                                  ]),
                                ]),
                              ],
                              1
                            )
                          : e._e(),
                        e._v(" "),
                        e.getCustomerInfo(e.app.bookings[a]) &&
                        e.getCustomerInfo(e.app.bookings[a]).phone &&
                        "customer" !== e.$root.settings.role
                          ? i(
                              "div",
                              { staticClass: "am-appointment-collapsed-field" },
                              [
                                i("el-col", { attrs: { sm: 5 } }, [
                                  i("p", { staticClass: "am-data" }, [
                                    e._v(
                                      e._s(e.$root.labels.customer_phone) + ":"
                                    ),
                                  ]),
                                ]),
                                e._v(" "),
                                i("el-col", { attrs: { sm: 7 } }, [
                                  i("p", { staticClass: "am-value" }, [
                                    e._v(
                                      "\n              " +
                                        e._s(
                                          e.getCustomerInfo(e.app.bookings[a])
                                            .phone
                                        ) +
                                        "\n            "
                                    ),
                                  ]),
                                ]),
                              ],
                              1
                            )
                          : e._e(),
                        e._v(" "),
                        e._l(
                          JSON.parse(e.app.bookings[a].customFields),
                          function (t, o) {
                            return t && e.showCustomField(t.value)
                              ? i(
                                  "div",
                                  {
                                    staticClass:
                                      "am-appointment-collapsed-field",
                                  },
                                  [
                                    i("el-col", { attrs: { sm: 5 } }, [
                                      i("p", { staticClass: "am-data" }, [
                                        e._v(
                                          e._s(e.getCustomFieldLabel(t, o)) +
                                            ":"
                                        ),
                                      ]),
                                    ]),
                                    e._v(" "),
                                    i("el-col", { attrs: { sm: 7 } }, [
                                      "file" !== t.type
                                        ? i("p", { staticClass: "am-value" }, [
                                            e._v(
                                              "\n              " +
                                                e._s(
                                                  t
                                                    ? e.getCustomFieldValue(
                                                        t.value,
                                                        t.type
                                                      )
                                                    : ""
                                                ) +
                                                "\n            "
                                            ),
                                          ])
                                        : i(
                                            "div",
                                            e._l(t.value, function (t, n) {
                                              return i(
                                                "p",
                                                { staticClass: "am-link" },
                                                [
                                                  i(
                                                    "a",
                                                    {
                                                      key: n,
                                                      attrs: {
                                                        href: e.$root
                                                          .useUploadsAmeliaPath
                                                          ? e.$root.getAjaxUrl +
                                                            "/fields/" +
                                                            o +
                                                            "/" +
                                                            e.app.bookings[a]
                                                              .id +
                                                            "/" +
                                                            n
                                                          : e.$root
                                                              .getUploadsAmeliaUrl +
                                                            e.app.bookings[a]
                                                              .id +
                                                            "_" +
                                                            t.fileName,
                                                        target: "_blank",
                                                      },
                                                    },
                                                    [
                                                      e._v(
                                                        "\n                  " +
                                                          e._s(t.name) +
                                                          "\n                "
                                                      ),
                                                    ]
                                                  ),
                                                ]
                                              );
                                            }),
                                            0
                                          ),
                                    ]),
                                  ],
                                  1
                                )
                              : e._e();
                          }
                        ),
                        e._v(" "),
                        e._l(e.app.bookings[a].extras, function (t) {
                          return i(
                            "div",
                            { staticClass: "am-appointment-collapsed-field" },
                            [
                              i("el-col", { attrs: { sm: 5 } }, [
                                i("p", { staticClass: "am-data" }, [
                                  e._v(
                                    "\n              " +
                                      e._s(
                                        e
                                          .getServiceById(e.app.serviceId)
                                          .extras.find(function (e) {
                                            return e.id === t.extraId;
                                          }).name
                                      ) +
                                      "\n            "
                                  ),
                                ]),
                              ]),
                              e._v(" "),
                              i("el-col", { attrs: { sm: 7 } }, [
                                i("p", { staticClass: "am-value" }, [
                                  e._v(
                                    "\n              " +
                                      e._s(t.quantity) +
                                      "\n            "
                                  ),
                                ]),
                              ]),
                            ],
                            1
                          );
                        }),
                      ],
                      2
                    );
                  }),
                  e._v(" "),
                  e.app.internalNotes && "customer" !== e.$root.settings.role
                    ? i(
                        "el-row",
                        [
                          i(
                            "el-col",
                            { attrs: { sm: 12 } },
                            [
                              i(
                                "el-row",
                                [
                                  i("el-col", { attrs: { sm: 10 } }, [
                                    i("p", { staticClass: "am-data" }, [
                                      e._v(e._s(e.$root.labels.note) + ":"),
                                    ]),
                                  ]),
                                  e._v(" "),
                                  i("el-col", { attrs: { sm: 14 } }, [
                                    i("p", { staticClass: "am-value" }, [
                                      e._v(e._s(e.app.internalNotes)),
                                    ]),
                                  ]),
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
                2
              ),
            ],
            1
          ),
        ]);
      },
      staticRenderFns: [],
    };
  },
});
