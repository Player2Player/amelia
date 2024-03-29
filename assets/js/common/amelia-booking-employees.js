wpJsonpAmeliaBookingPlugin([14], {
  1013: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var i = o(1014),
      a = o.n(i),
      s = o(952),
      n = o.n(s),
      r = o(717),
      l = o.n(r),
      c = o(687),
      d = o(908),
      m = o(691),
      u = o(883),
      p = o(922),
      f = o.n(p),
      h = o(790),
      v = o.n(h),
      g = o(686),
      y = o(702),
      b = o.n(y);
    t.default = {
      mixins: [c.a, m.a, u.a, g.a, d.a],
      data: function () {
        return {
          checkEmployeeData: { toaster: !1, allChecked: !1 },
          count: 0,
          dialogCompanyDaysOffSettings: !1,
          dialogEmployee: !1,
          editCategorizedServiceList: null,
          editWeekDayList: [],
          employee: null,
          employees: [],
          fetched: !1,
          fetchedFiltered: !1,
          filterFields: !0,
          form: new b.a(),
          gridViewActive: !0,
          isDuplicated: !1,
          options: {
            categorized: [],
            countFiltered: 0,
            fetched: !1,
            locations: [],
            sort: [
              { value: "employee", label: this.$root.labels.name_ascending },
              { value: "-employee", label: this.$root.labels.name_descending },
            ],
          },
          params: {
            page: 1,
            sort: "employee",
            search: "",
            services: [],
            location: "",
          },
          searchPlaceholder: this.$root.labels.employee_search_placeholder,
          settings: { daysOff: [] },
          showDeleteConfirmation: !1,
          tableViewActive: !1,
          timer: null,
          futureAppointments: {},
        };
      },
      created: function () {
        this.googleCalendarSync(),
          this.outlookCalendarSync(),
          this.fetchData(),
          this.handleResize();
      },
      mounted: function () {
        this.inlineSVG();
      },
      methods: {
        getSettingsSchedule: function () {
          var e = [];
          return (
            this.$root.settings.weekSchedule.forEach(function (t, o) {
              var i = [];
              t.breaks.forEach(function (e) {
                i.push({
                  id: null,
                  startTime: e.time[0] + ":00",
                  endTime: e.time[1] + ":00",
                });
              });
              var a = [];
              null !== t.time[0] &&
                null !== t.time[1] &&
                ("periods" in t
                  ? t.periods.forEach(function (e) {
                      a.push({
                        id: null,
                        startTime: e.time[0] + ":00",
                        endTime: e.time[1] + ":00",
                        serviceIds: [],
                        locationId: null,
                        periodServiceList: [],
                        savedPeriodServiceList: [],
                      });
                    })
                  : a.push({
                      id: null,
                      startTime: t.time[0] + ":00",
                      endTime: t.time[1] + ":00",
                      serviceIds: [],
                      locationId: null,
                      periodServiceList: [],
                      savedPeriodServiceList: [],
                    })),
                t.time[0] &&
                  t.time[1] &&
                  e.push({
                    dayIndex: o + 1,
                    id: null,
                    startTime: t.time[0] + ":00",
                    endTime: t.time[1] + ":00",
                    periodList: a,
                    timeOutList: i,
                  });
            }),
            e
          );
        },
        fetchData: function () {
          (this.fetched = !1),
            (this.options.fetched = !1),
            this.getProviders(),
            this.getProvidersOptions();
        },
        filterData: function () {
          (this.fetchedFiltered = !1), this.getProviders();
        },
        getProviders: function () {
          var e = this;
          Object.keys(this.params).forEach(function (t) {
            return !e.params[t] && delete e.params[t];
          }),
            this.$http
              .get(this.$root.getAjaxUrl + "/users/providers", {
                params: this.params,
              })
              .then(function (t) {
                t.data.data.users.forEach(function (e) {
                  e.checked = !1;
                }),
                  (e.employees = t.data.data.users),
                  (e.count = t.data.data.countTotal),
                  (e.options.countFiltered = t.data.data.countFiltered),
                  (e.fetched = !0),
                  (e.fetchedFiltered = !0);
              })
              .catch(function (t) {
                console.log(t.message),
                  (e.fetched = !0),
                  (e.fetchedFiltered = !0);
              });
        },
        getProvidersOptions: function () {
          var e = this;
          this.$http
            .get(this.$root.getAjaxUrl + "/entities", {
              params: { types: ["categories", "locations"] },
            })
            .then(function (t) {
              t.data.data.categories.forEach(function (e) {
                e.serviceList.forEach(function (e) {
                  e.state = !1;
                });
              }),
                (e.options.locations = t.data.data.locations),
                (e.options.categorized = t.data.data.categories),
                (e.options.fetched = !0);
            })
            .catch(function (t) {
              console.log(t.message), (e.options.fetched = !0);
            });
        },
        getProvider: function (e) {
          var t = this;
          this.$http
            .get(this.$root.getAjaxUrl + "/users/providers/" + e)
            .then(function (e) {
              (t.employee = e.data.data.user),
                e.data.data.successfulGoogleConnection ||
                  (t.notify(
                    t.$root.labels.error,
                    t.$root.labels.google_calendar_error,
                    "error"
                  ),
                  (t.employee.googleCalendar = {
                    calendarId: null,
                    calendarList: [],
                  })),
                (t.futureAppointments = {}),
                (t.futureAppointments[t.employee.id] =
                  e.data.data.futureAppointmentsServicesIds);
              var o = t;
              t.employee.weekDayList.forEach(function (e) {
                (e.periodList = e.periodList.sort(function (e, t) {
                  return o
                    .$moment(
                      "2000-01-01 " + e.startTime + ":00",
                      "YYYY-MM-DD HH:mm:ss"
                    )
                    .diff(
                      o.$moment(
                        "2000-01-01 " + t.startTime + ":00",
                        "YYYY-MM-DD HH:mm:ss"
                      )
                    );
                })),
                  (e.timeOutList = e.timeOutList.sort(function (e, t) {
                    return o
                      .$moment(
                        "2000-01-01 " + e.startTime + ":00",
                        "YYYY-MM-DD HH:mm:ss"
                      )
                      .diff(
                        o.$moment(
                          "2000-01-01 " + t.startTime + ":00",
                          "YYYY-MM-DD HH:mm:ss"
                        )
                      );
                  }));
              }),
                (t.editWeekDayList = t.getParsedEditWeekDayList(t.employee)),
                (t.editCategorizedServiceList =
                  t.getParsedEditCategorizedServiceList(
                    t.employee,
                    t.options.categorized
                  )),
                (t.fetchedFiltered = !0);
            })
            .catch(function (e) {
              console.log(e.message), (t.fetchedFiltered = !0);
            });
        },
        changeFilter: function () {
          (this.params.page = 1), this.filterData();
        },
        handleResize: function () {
          this.filterFields = window.innerWidth >= 992;
        },
        showDialogNewEmployee: function () {
          (this.isDuplicated = !1),
            (this.employee = this.getInitEmployeeObject()),
            (this.editWeekDayList = this.getParsedEditWeekDayList(
              this.employee
            )),
            (this.editCategorizedServiceList =
              this.getParsedEditCategorizedServiceList(
                this.employee,
                this.options.categorized
              )),
            (this.dialogEmployee = !0);
        },
        showDialogEditEmployee: function (e) {
          (this.isDuplicated = !1),
            (this.employee = null),
            (this.dialogEmployee = !0),
            this.getProvider(e);
        },
        duplicateEmployeeCallback: function (e) {
          var t = this;
          (this.isDuplicated = !0),
            (this.employee = e),
            (this.employee.id = 0),
            (this.employee.externalId = ""),
            (this.employee.email = ""),
            setTimeout(function () {
              t.dialogEmployee = !0;
            }, 300);
        },
        saveEmployeeCallback: function () {
          (this.dialogEmployee = !1), this.filterData();
        },
        selectAllInCategory: function (e) {
          var t = this.options.categorized
            .find(function (t) {
              return t.id === e;
            })
            .serviceList.map(function (e) {
              return e.id;
            });
          _.isEqual(_.intersection(t, this.params.services), t)
            ? (this.params.services = _.difference(this.params.services, t))
            : (this.params.services = _.uniq(this.params.services.concat(t))),
            this.filterData();
        },
        gridView: function () {
          (this.gridViewActive = !0), (this.tableViewActive = !1);
        },
        tableView: function () {
          (this.gridViewActive = !1), (this.tableViewActive = !0);
        },
        updateCompanyWorkingHoursAndDaysOffSettings: function (e) {
          var t = this;
          (this.settings.daysOff = e.daysOff),
            this.$http
              .post(this.$root.getAjaxUrl + "/settings", this.settings)
              .then(function (e) {
                (t.$root.settings.daysOff = e.data.data.settings.daysOff),
                  t.notify(
                    t.$root.labels.success,
                    t.$root.labels.settings_saved,
                    "success"
                  );
              })
              .catch(function (e) {
                t.notify(t.$root.labels.error, e.message, "error");
              });
        },
        groupDeleteCallback: function () {
          (this.checkEmployeeData.allChecked = !1),
            (this.checkEmployeeData.toaster = !1),
            this.fetchData();
        },
        getInitEmployeeObject: function () {
          return {
            id: 0,
            type: "provider",
            status: "visible",
            firstName: "",
            lastName: "",
            email: "",
            externalId: "",
            locationId: "",
            phone: "",
            countryPhoneIso: "",
            googleCalendar: [],
            outlookCalendar: [],
            note: "",
            pictureFullPath: "",
            pictureThumbPath: "",
            serviceList: [],
            weekDayList: this.getSettingsSchedule(),
            specialDayList: [],
            dayOffList: [],
          };
        },
        googleCalendarSync: function () {
          if (this.$root.settings.googleCalendar) {
            var e = this.getUrlQueryParams(window.location.href);
            e.code &&
              !e.type &&
              this.fetchAccessTokenWithAuthCodeGoogle(e.code);
          }
        },
        outlookCalendarSync: function () {
          if (this.$root.settings.outlookCalendar) {
            var e = this.getUrlQueryParams(window.location.href);
            e.code &&
              e.type &&
              this.fetchAccessTokenWithAuthCodeOutlook(e.code);
          }
        },
        fetchAccessTokenWithAuthCodeGoogle: function (e) {
          var t = this,
            o = this.getUrlQueryParams(window.location.href).state;
          this.form
            .post(this.$root.getAjaxUrl + "/google/authorization/token", {
              authCode: e,
              userId: o,
              isBackend: !0,
            })
            .then(function () {
              var e = t.removeURLParameter(window.location.href, "code");
              (e = t.removeURLParameter(e, "state")),
                history.pushState(null, null, e + "#/employees"),
                t.showDialogEditEmployee(o);
            })
            .catch(function (e) {
              console.log(e);
            });
        },
        fetchAccessTokenWithAuthCodeOutlook: function (e) {
          var t = this,
            o = this.getUrlQueryParams(window.location.href).state.split(
              "amelia-outlook-calendar-auth-"
            )[1];
          this.form
            .post(this.$root.getAjaxUrl + "/outlook/authorization/token", {
              authCode: e,
              userId: o,
            })
            .then(function () {
              var e = t.removeURLParameter(window.location.href, "code");
              (e = t.removeURLParameter(e, "state")),
                (e = t.removeURLParameter(e, "type")),
                history.pushState(null, null, e + "#/employees"),
                t.showDialogEditEmployee(o);
            })
            .catch(function (e) {
              console.log(e);
            });
        },
      },
      computed: {
        filterApplied: function () {
          return (
            !!this.params.search ||
            !!this.params.services.length ||
            !!this.params.location
          );
        },
      },
      watch: {
        "params.search": function () {
          void 0 !== this.params.search &&
            ((this.fetchedFiltered = !1),
            clearTimeout(this.timer),
            (this.timer = setTimeout(this.filterData, 500)));
        },
      },
      components: {
        PageHeader: l.a,
        DialogEmployee: a.a,
        DialogSettingsWorkHoursDaysOff: n.a,
        GroupDelete: f.a,
        PaginationBlock: v.a,
      },
    };
  },
  1014: function (e, t, o) {
    var i = o(685)(o(1015), o(1016), !1, null, null, null);
    e.exports = i.exports;
  },
  1015: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var i = o(944),
      a = o.n(i),
      s = o(906),
      n = o.n(s),
      r = o(907),
      l = o.n(r),
      c = o(947),
      d = o.n(c),
      m = o(713),
      u = o.n(m),
      p = o(696),
      f = o.n(p),
      h = o(755),
      v = (o.n(h), o(792)),
      g = o.n(v),
      y = o(687),
      b = o(337),
      _ = o(692),
      w = o(691),
      C = o(689),
      k = o(908),
      D = o(950),
      S = o(951);
    t.default = {
      mixins: [y.a, b.a, _.a, w.a, C.a, k.a, S.a, D.a],
      props: {
        locations: null,
        employee: null,
        editCategorizedServiceList: null,
        editWeekDayList: null,
        companyDaysOff: null,
        futureAppointments: null,
      },
      data: function () {
        return {
          appointmentsServices: [],
          dialogLoading: !0,
          employeeTabs: "details",
          errors: { email: "" },
          executeUpdate: !0,
          formOptions: { wpUsers: [] },
          googleAuthURL: "",
          outlookAuthURL: "",
          googleLoading: !1,
          outlookLoading: !1,
          zoomUsers: [],
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
                required: !0,
                message: this.$root.labels.enter_email_warning,
                trigger: "submit",
              },
              {
                type: "email",
                message: this.$root.labels.enter_valid_email_warning,
                trigger: "submit",
              },
            ],
            locationId: [
              {
                required: this.visibleLocations().length > 0,
                message: this.$root.labels.enter_location_warning,
                trigger: "blur",
              },
            ],
            password: [
              {
                min: 4,
                max: 128,
                message: this.$root.labels.new_password_length,
                trigger: "submit",
              },
            ],
          },
        };
      },
      created: function () {
        this.instantiateDialog();
      },
      updated: function () {
        this.instantiateDialog();
      },
      methods: {
        instantiateDialog: function () {
          if (
            (null !== this.employee ||
              (null !== this.employee && 0 === this.employee.id)) &&
            !0 === this.executeUpdate
          ) {
            this.$root.settings.capabilities.canWriteOthers &&
              (0 !== this.employee.id
                ? this.getWPUsers(this.employee.externalId)
                : this.getWPUsers(0)),
              this.employee.googleCalendar.token || this.getGoogleAuthURL(!1),
              this.employee.outlookCalendar.token || this.getOutlookAuthURL(!1);
            var e = this.visibleLocations();
            1 === e.length && (this.employee.locationId = e[0].id),
              this.$root.settings.zoom.enabled && this.getZoomUsers(),
              this.employee.id in this.futureAppointments &&
                (this.appointmentsServices =
                  this.futureAppointments[this.employee.id]),
              this.$set(this.employee, "sendEmployeePanelAccessEmail", !0),
              this.$root.settings.capabilities.canWriteOthers ||
                ((this.dialogLoading = !1), this.inlineDialogEmployeeSVG()),
              (this.executeUpdate = !1);
          }
        },
        checkCapacityLimits: function (e) {
          this.clearValidation(),
            e.minCapacity > e.maxCapacity && (e.maxCapacity = e.minCapacity);
        },
        validationFailCallback: function () {
          this.employeeTabs = "details";
        },
        errorCallback: function (e) {
          var t = this;
          (t.errors.email = ""),
            setTimeout(function () {
              (t.errors.email = e), (t.employeeTabs = "details");
            }, 200);
        },
        closeDialog: function () {
          this.$emit("closeDialog");
        },
        trimNames: function () {
          (this.employee.firstName = this.employee.firstName.trim()),
            (this.employee.lastName = this.employee.lastName.trim());
        },
        getParsedEntity: function () {
          return (
            (this.employee.serviceList = this.getParsedServiceList(
              this.editCategorizedServiceList
            )),
            (this.employee.weekDayList = this.getParsedWeekDayList(
              this.editWeekDayList
            )),
            this.trimNames(),
            this.employee
          );
        },
        changeSelectedPeriodServices: function (e) {
          e.state
            ? this.editWeekDayList.forEach(function (t) {
                t.periods.forEach(function (t) {
                  "savedPeriodServiceList" in t &&
                    t.savedPeriodServiceList.forEach(function (o) {
                      o.serviceId === e.id &&
                        (t.periodServiceList.push(o), t.serviceIds.push(e.id));
                    });
                });
              })
            : this.editWeekDayList.forEach(function (t) {
                t.periods.forEach(function (t) {
                  t.periodServiceList.forEach(function (o, i) {
                    o.serviceId === e.id && t.periodServiceList.splice(i, 1);
                  }),
                    t.serviceIds.forEach(function (o, i) {
                      o === e.id && t.serviceIds.splice(i, 1);
                    });
                });
              });
        },
        changeDaysOff: function (e) {
          this.clearValidation(), (this.employee.dayOffList = e);
        },
        changeSpecialDays: function (e, t) {
          null === t
            ? this.employee.specialDayList.push(e)
            : (this.employee.specialDayList[t] = e);
        },
        phoneFormatted: function (e, t) {
          this.clearValidation(),
            (this.employee.phone = e),
            (this.employee.countryPhoneIso = t);
        },
        pictureSelected: function (e, t) {
          (this.employee.pictureFullPath = e),
            (this.employee.pictureThumbPath = t);
        },
        getWPUsers: function (e) {
          var t = this;
          this.$http
            .get(this.$root.getAjaxUrl + "/users/wp-users", {
              params: { id: e, role: "provider" },
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
                    .indexOf(t.employee.externalId) &&
                  (t.employee.externalId = ""),
                (t.dialogLoading = !1),
                t.inlineDialogEmployeeSVG();
            });
        },
        visibleLocations: function () {
          var e = this;
          return this.locations.filter(function (t) {
            return (
              "visible" === t.status ||
              (e.employee &&
                "hidden" === t.status &&
                t.id === e.employee.locationId)
            );
          });
        },
        showCompanyDaysOffSettingsDialog: function () {
          this.$emit("showCompanyDaysOffSettingsDialog");
        },
        clearValidation: function () {
          void 0 !== this.$refs.employee && this.$refs.employee.clearValidate();
        },
        selectCreateNewWPUser: function () {
          (this.employee.externalId = 0), this.$refs.wpUser.blur();
        },
        getGoogleAuthURL: function (e) {
          var t = this;
          this.employee.id &&
            this.$root.settings.googleCalendar &&
            this.$http
              .get(
                this.$root.getAjaxUrl +
                  "/google/authorization/url/" +
                  this.employee.id
              )
              .then(function (o) {
                (t.googleAuthURL = o.data.data.authUrl),
                  (t.googleLoading = !1),
                  (t.dialogLoading = !1),
                  e && t.inlineDialogEmployeeSVG();
              })
              .catch(function (e) {
                t.notify(t.$root.labels.error, e.message, "error");
              });
        },
        getOutlookAuthURL: function (e) {
          var t = this;
          this.employee.id &&
            this.$root.settings.outlookCalendar &&
            this.$http
              .get(
                this.$root.getAjaxUrl +
                  "/outlook/authorization/url/" +
                  this.employee.id
              )
              .then(function (o) {
                (t.outlookAuthURL = o.data.data.authUrl),
                  (t.outlookLoading = !1),
                  (t.dialogLoading = !1),
                  e && t.inlineDialogEmployeeSVG();
              })
              .catch(function (e) {
                t.notify(t.$root.labels.error, e.message, "error");
              });
        },
        getZoomUsers: function () {
          var e = this;
          this.$http
            .get(this.$root.getAjaxUrl + "/zoom/users")
            .then(function (t) {
              "data" in t.data &&
                "users" in t.data.data &&
                (e.zoomUsers = t.data.data.users);
            })
            .catch(function (t) {
              e.notify(e.$root.labels.error, t.message, "error");
            });
        },
        redirectToGoogleAuthPage: function () {
          (this.googleLoading = !0),
            (window.location.href = this.googleAuthURL);
        },
        redirectToOutlookAuthPage: function () {
          (this.outlookLoading = !0),
            (window.location.href = this.outlookAuthURL);
        },
        disconnectFromGoogleAccount: function () {
          var e = this;
          (this.googleLoading = !0),
            this.$http
              .post(
                this.$root.getAjaxUrl + "/google/disconnect/" + this.employee.id
              )
              .then(function () {
                (e.employee.googleCalendar = {
                  calendarId: null,
                  calendarList: [],
                }),
                  e.getGoogleAuthURL(!0);
              })
              .catch(function (t) {
                e.notify(e.$root.labels.error, t.message, "error");
              });
        },
        disconnectFromOutlookAccount: function () {
          var e = this;
          (this.outlookLoading = !0),
            this.$http
              .post(
                this.$root.getAjaxUrl +
                  "/outlook/disconnect/" +
                  this.employee.id
              )
              .then(function () {
                (e.employee.outlookCalendar = {
                  calendarId: null,
                  calendarList: [],
                }),
                  e.getOutlookAuthURL(!0);
              })
              .catch(function (t) {
                e.notify(e.$root.labels.error, t.message, "error");
              });
        },
        inlineDialogEmployeeSVG: function () {
          var e = this;
          setTimeout(function () {
            e.inlineSVG();
          }, 10);
        },
      },
      computed: {
        filteredLocations: function () {
          return this.visibleLocations();
        },
      },
      components: {
        AssignedServices: a.a,
        PhoneInput: f.a,
        PictureUpload: g.a,
        DaysOff: n.a,
        WorkingHours: l.a,
        SpecialDays: d.a,
        DialogActions: u.a,
        Money: h.Money,
      },
    };
  },
  1016: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          o = e._self._c || t;
        return o(
          "div",
          [
            o(
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
                o("div", { staticClass: "am-dialog-loader-content" }, [
                  o("img", {
                    attrs: { src: e.$root.getUrl + "public/img/spinner.svg" },
                  }),
                  e._v(" "),
                  o("p", [e._v(e._s(e.$root.labels.loader_message))]),
                ]),
              ]
            ),
            e._v(" "),
            e.employee && !e.dialogLoading
              ? o(
                  "div",
                  {
                    staticClass: "am-dialog-scrollable",
                    class: { "am-edit": 0 !== e.employee.id },
                  },
                  [
                    o(
                      "div",
                      { staticClass: "am-dialog-header" },
                      [
                        o(
                          "el-row",
                          [
                            o("el-col", { attrs: { span: 14 } }, [
                              0 !== e.employee.id
                                ? o("h2", [
                                    e._v(
                                      e._s(e.$root.labels.edit_employee) + " "
                                    ),
                                  ])
                                : o("h2", [
                                    e._v(e._s(e.$root.labels.new_employee)),
                                  ]),
                            ]),
                            e._v(" "),
                            o(
                              "el-col",
                              {
                                staticClass: "align-right",
                                attrs: { span: 10 },
                              },
                              [
                                o("el-button", {
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
                    o(
                      "el-form",
                      {
                        ref: "employee",
                        attrs: {
                          model: e.employee,
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
                          "el-tabs",
                          {
                            model: {
                              value: e.employeeTabs,
                              callback: function (t) {
                                e.employeeTabs = t;
                              },
                              expression: "employeeTabs",
                            },
                          },
                          [
                            o(
                              "el-tab-pane",
                              {
                                attrs: {
                                  label: e.$root.labels.details,
                                  name: "details",
                                },
                              },
                              [
                                o(
                                  "div",
                                  { staticClass: "am-employee-profile" },
                                  [
                                    o("picture-upload", {
                                      attrs: {
                                        "edited-entity": this.employee,
                                        "entity-name": "employee",
                                      },
                                      on: {
                                        pictureSelected: e.pictureSelected,
                                      },
                                    }),
                                    e._v(" "),
                                    o("h2", [
                                      e._v(
                                        e._s(e.employee.firstName) +
                                          " " +
                                          e._s(e.employee.lastName)
                                      ),
                                    ]),
                                    e._v(" "),
                                    void 0 !== e.employee.activity
                                      ? o(
                                          "span",
                                          {
                                            staticClass:
                                              "am-employee-status-label",
                                            class: e.employee.activity,
                                          },
                                          [
                                            e._v(
                                              "\n              " +
                                                e._s(
                                                  e.getEmployeeActivityLabel(
                                                    e.employee.activity
                                                  )
                                                ) +
                                                "\n            "
                                            ),
                                          ]
                                        )
                                      : e._e(),
                                  ],
                                  1
                                ),
                                e._v(" "),
                                o(
                                  "el-row",
                                  { attrs: { gutter: 16 } },
                                  [
                                    o(
                                      "el-col",
                                      { attrs: { sm: 12 } },
                                      [
                                        o(
                                          "el-form-item",
                                          {
                                            attrs: {
                                              label:
                                                e.$root.labels.first_name + ":",
                                              prop: "firstName",
                                            },
                                          },
                                          [
                                            o("el-input", {
                                              attrs: { "auto-complete": "off" },
                                              on: {
                                                input: function (t) {
                                                  return e.clearValidation();
                                                },
                                                change: function (t) {
                                                  return e.trimNames();
                                                },
                                              },
                                              model: {
                                                value: e.employee.firstName,
                                                callback: function (t) {
                                                  e.$set(
                                                    e.employee,
                                                    "firstName",
                                                    t
                                                  );
                                                },
                                                expression:
                                                  "employee.firstName",
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
                                      "el-col",
                                      { attrs: { sm: 12 } },
                                      [
                                        o(
                                          "el-form-item",
                                          {
                                            attrs: {
                                              label:
                                                e.$root.labels.last_name + ":",
                                              prop: "lastName",
                                            },
                                          },
                                          [
                                            o("el-input", {
                                              attrs: { "auto-complete": "off" },
                                              on: {
                                                input: function (t) {
                                                  return e.clearValidation();
                                                },
                                                change: function (t) {
                                                  return e.trimNames();
                                                },
                                              },
                                              model: {
                                                value: e.employee.lastName,
                                                callback: function (t) {
                                                  e.$set(
                                                    e.employee,
                                                    "lastName",
                                                    t
                                                  );
                                                },
                                                expression: "employee.lastName",
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
                                  "el-row",
                                  { attrs: { gutter: 16 } },
                                  [
                                    o(
                                      "el-col",
                                      { attrs: { sm: 12 } },
                                      [
                                        o(
                                          "el-form-item",
                                          {
                                            attrs: {
                                              label: e.$root.labels.email + ":",
                                              prop: "email",
                                              error: e.errors.email,
                                            },
                                          },
                                          [
                                            o("el-input", {
                                              attrs: {
                                                "auto-complete": "off",
                                                placeholder:
                                                  e.$root.labels
                                                    .email_placeholder,
                                              },
                                              on: {
                                                input: function (t) {
                                                  return e.clearValidation();
                                                },
                                              },
                                              model: {
                                                value: e.employee.email,
                                                callback: function (t) {
                                                  e.$set(
                                                    e.employee,
                                                    "email",
                                                    t
                                                  );
                                                },
                                                expression: "employee.email",
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
                                      "el-col",
                                      { attrs: { sm: 12 } },
                                      [
                                        e.locations.length
                                          ? o(
                                              "el-form-item",
                                              {
                                                attrs: {
                                                  label:
                                                    e.$root.labels.location +
                                                    ":",
                                                  prop: "locationId",
                                                },
                                              },
                                              [
                                                o(
                                                  "el-select",
                                                  {
                                                    attrs: { placeholder: "" },
                                                    on: {
                                                      change: function (t) {
                                                        return e.clearValidation();
                                                      },
                                                    },
                                                    model: {
                                                      value:
                                                        e.employee.locationId,
                                                      callback: function (t) {
                                                        e.$set(
                                                          e.employee,
                                                          "locationId",
                                                          t
                                                        );
                                                      },
                                                      expression:
                                                        "employee.locationId",
                                                    },
                                                  },
                                                  e._l(
                                                    e.filteredLocations,
                                                    function (e) {
                                                      return o("el-option", {
                                                        key: e.id,
                                                        attrs: {
                                                          label: e.name,
                                                          value: e.id,
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
                                      ],
                                      1
                                    ),
                                  ],
                                  1
                                ),
                                e._v(" "),
                                o(
                                  "el-row",
                                  { attrs: { gutter: 16 } },
                                  [
                                    o(
                                      "el-col",
                                      { attrs: { sm: 12 } },
                                      [
                                        !0 ===
                                        e.$root.settings.capabilities
                                          .canWriteOthers
                                          ? o(
                                              "el-form-item",
                                              {
                                                attrs: { label: "placeholder" },
                                              },
                                              [
                                                o(
                                                  "label",
                                                  {
                                                    attrs: { slot: "label" },
                                                    slot: "label",
                                                  },
                                                  [
                                                    e._v(
                                                      "\n                  " +
                                                        e._s(
                                                          e.$root.labels.wp_user
                                                        ) +
                                                        ":\n                  "
                                                    ),
                                                    o(
                                                      "el-tooltip",
                                                      {
                                                        attrs: {
                                                          placement: "top",
                                                        },
                                                      },
                                                      [
                                                        o("div", {
                                                          attrs: {
                                                            slot: "content",
                                                          },
                                                          domProps: {
                                                            innerHTML: e._s(
                                                              e.$root.labels
                                                                .wp_user_employee_tooltip
                                                            ),
                                                          },
                                                          slot: "content",
                                                        }),
                                                        e._v(" "),
                                                        o("i", {
                                                          staticClass:
                                                            "el-icon-question am-tooltip-icon",
                                                        }),
                                                      ]
                                                    ),
                                                  ],
                                                  1
                                                ),
                                                e._v(" "),
                                                o(
                                                  "el-select",
                                                  {
                                                    ref: "wpUser",
                                                    attrs: {
                                                      filterable: "",
                                                      placeholder:
                                                        e.$root.labels
                                                          .select_wp_user,
                                                      clearable: "",
                                                    },
                                                    on: {
                                                      change: function (t) {
                                                        return e.clearValidation();
                                                      },
                                                    },
                                                    model: {
                                                      value:
                                                        e.employee.externalId,
                                                      callback: function (t) {
                                                        e.$set(
                                                          e.employee,
                                                          "externalId",
                                                          t
                                                        );
                                                      },
                                                      expression:
                                                        "employee.externalId",
                                                    },
                                                  },
                                                  [
                                                    o(
                                                      "div",
                                                      {
                                                        staticClass: "am-drop",
                                                      },
                                                      [
                                                        o(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "am-drop-create-item",
                                                            on: {
                                                              click:
                                                                e.selectCreateNewWPUser,
                                                            },
                                                          },
                                                          [
                                                            e._v(
                                                              "\n                      " +
                                                                e._s(
                                                                  e.$root.labels
                                                                    .create_new
                                                                ) +
                                                                "\n                    "
                                                            ),
                                                          ]
                                                        ),
                                                        e._v(" "),
                                                        e._l(
                                                          e.formOptions.wpUsers,
                                                          function (e) {
                                                            return o(
                                                              "el-option",
                                                              {
                                                                key: e.value,
                                                                class: {
                                                                  hidden:
                                                                    0 ===
                                                                    e.value,
                                                                },
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
                                                      ],
                                                      2
                                                    ),
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
                                    o(
                                      "el-col",
                                      { attrs: { sm: 12 } },
                                      [
                                        o(
                                          "el-form-item",
                                          {
                                            attrs: {
                                              label: e.$root.labels.phone + ":",
                                            },
                                          },
                                          [
                                            o("phone-input", {
                                              attrs: {
                                                countryPhoneIso:
                                                  e.employee.countryPhoneIso,
                                                savedPhone: e.employee.phone,
                                              },
                                              on: {
                                                phoneFormatted:
                                                  e.phoneFormatted,
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
                                e.$root.settings.googleCalendar &&
                                0 !== e.employee.id
                                  ? o(
                                      "el-row",
                                      { attrs: { gutter: 24 } },
                                      [
                                        o(
                                          "el-col",
                                          { attrs: { span: 24 } },
                                          [
                                            o(
                                              "el-form-item",
                                              {
                                                attrs: { label: "placeholder" },
                                              },
                                              [
                                                o(
                                                  "label",
                                                  {
                                                    attrs: { slot: "label" },
                                                    slot: "label",
                                                  },
                                                  [
                                                    e._v(
                                                      "\n                  " +
                                                        e._s(
                                                          e.$root.labels
                                                            .google_calendar
                                                        ) +
                                                        ":\n                  "
                                                    ),
                                                    o(
                                                      "el-tooltip",
                                                      {
                                                        attrs: {
                                                          placement: "top",
                                                        },
                                                      },
                                                      [
                                                        o("div", {
                                                          attrs: {
                                                            slot: "content",
                                                          },
                                                          domProps: {
                                                            innerHTML: e._s(
                                                              e.$root.labels
                                                                .google_calendar_tooltip
                                                            ),
                                                          },
                                                          slot: "content",
                                                        }),
                                                        e._v(" "),
                                                        o("i", {
                                                          staticClass:
                                                            "el-icon-question am-tooltip-icon",
                                                        }),
                                                      ]
                                                    ),
                                                  ],
                                                  1
                                                ),
                                                e._v(" "),
                                                o(
                                                  "el-col",
                                                  {
                                                    staticStyle: {
                                                      padding: "0",
                                                    },
                                                    attrs: { span: 15 },
                                                  },
                                                  [
                                                    o(
                                                      "el-select",
                                                      {
                                                        attrs: {
                                                          placeholder: "",
                                                          disabled:
                                                            !e.employee
                                                              .googleCalendar
                                                              .token ||
                                                            e.googleLoading,
                                                        },
                                                        on: {
                                                          change: function (t) {
                                                            return e.clearValidation();
                                                          },
                                                        },
                                                        model: {
                                                          value:
                                                            e.employee
                                                              .googleCalendar
                                                              .calendarId,
                                                          callback: function (
                                                            t
                                                          ) {
                                                            e.$set(
                                                              e.employee
                                                                .googleCalendar,
                                                              "calendarId",
                                                              t
                                                            );
                                                          },
                                                          expression:
                                                            "employee.googleCalendar.calendarId",
                                                        },
                                                      },
                                                      e._l(
                                                        e.employee
                                                          .googleCalendar
                                                          .calendarList,
                                                        function (e) {
                                                          return o(
                                                            "el-option",
                                                            {
                                                              key: e.id,
                                                              attrs: {
                                                                label:
                                                                  e.summary,
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
                                                e._v(" "),
                                                o(
                                                  "el-col",
                                                  { attrs: { span: 9 } },
                                                  [
                                                    o(
                                                      "el-button",
                                                      {
                                                        staticClass:
                                                          "am-google-calendar-button",
                                                        class: {
                                                          connected:
                                                            e.employee
                                                              .googleCalendar
                                                              .token,
                                                        },
                                                        attrs: {
                                                          type: "primary",
                                                        },
                                                        on: {
                                                          click: function (t) {
                                                            e.employee
                                                              .googleCalendar
                                                              .token
                                                              ? e.disconnectFromGoogleAccount()
                                                              : e.redirectToGoogleAuthPage();
                                                          },
                                                        },
                                                      },
                                                      [
                                                        o(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "am-google-calendar-button-image",
                                                          },
                                                          [
                                                            o("img", {
                                                              attrs: {
                                                                src:
                                                                  e.$root
                                                                    .getUrl +
                                                                  "public/img/google-button.png",
                                                              },
                                                            }),
                                                          ]
                                                        ),
                                                        e._v(" "),
                                                        o(
                                                          "span",
                                                          {
                                                            staticClass:
                                                              "am-google-calendar-button-text",
                                                          },
                                                          [
                                                            e._v(
                                                              "\n                      " +
                                                                e._s(
                                                                  e.employee
                                                                    .googleCalendar
                                                                    .token
                                                                    ? e.$root
                                                                        .labels
                                                                        .google_sign_out
                                                                    : e.$root
                                                                        .labels
                                                                        .google_sign_in
                                                                ) +
                                                                "\n                    "
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
                                          ],
                                          1
                                        ),
                                      ],
                                      1
                                    )
                                  : e._e(),
                                e._v(" "),
                                e.$root.settings.outlookCalendar &&
                                0 !== e.employee.id
                                  ? o(
                                      "el-row",
                                      { attrs: { gutter: 24 } },
                                      [
                                        o(
                                          "el-col",
                                          { attrs: { span: 24 } },
                                          [
                                            o(
                                              "el-form-item",
                                              {
                                                attrs: { label: "placeholder" },
                                              },
                                              [
                                                o(
                                                  "label",
                                                  {
                                                    attrs: { slot: "label" },
                                                    slot: "label",
                                                  },
                                                  [
                                                    e._v(
                                                      "\n                  " +
                                                        e._s(
                                                          e.$root.labels
                                                            .outlook_calendar
                                                        ) +
                                                        ":\n                  "
                                                    ),
                                                    o(
                                                      "el-tooltip",
                                                      {
                                                        attrs: {
                                                          placement: "top",
                                                        },
                                                      },
                                                      [
                                                        o("div", {
                                                          attrs: {
                                                            slot: "content",
                                                          },
                                                          domProps: {
                                                            innerHTML: e._s(
                                                              e.$root.labels
                                                                .outlook_calendar_tooltip
                                                            ),
                                                          },
                                                          slot: "content",
                                                        }),
                                                        e._v(" "),
                                                        o("i", {
                                                          staticClass:
                                                            "el-icon-question am-tooltip-icon",
                                                        }),
                                                      ]
                                                    ),
                                                  ],
                                                  1
                                                ),
                                                e._v(" "),
                                                o(
                                                  "el-col",
                                                  {
                                                    staticStyle: {
                                                      padding: "0",
                                                    },
                                                    attrs: { span: 15 },
                                                  },
                                                  [
                                                    o(
                                                      "el-select",
                                                      {
                                                        attrs: {
                                                          placeholder: "",
                                                          disabled:
                                                            !e.employee
                                                              .outlookCalendar
                                                              .token ||
                                                            e.outlookLoading,
                                                        },
                                                        on: {
                                                          change: function (t) {
                                                            return e.clearValidation();
                                                          },
                                                        },
                                                        model: {
                                                          value:
                                                            e.employee
                                                              .outlookCalendar
                                                              .calendarId,
                                                          callback: function (
                                                            t
                                                          ) {
                                                            e.$set(
                                                              e.employee
                                                                .outlookCalendar,
                                                              "calendarId",
                                                              t
                                                            );
                                                          },
                                                          expression:
                                                            "employee.outlookCalendar.calendarId",
                                                        },
                                                      },
                                                      e._l(
                                                        e.employee
                                                          .outlookCalendar
                                                          .calendarList,
                                                        function (e) {
                                                          return o(
                                                            "el-option",
                                                            {
                                                              key: e.id,
                                                              attrs: {
                                                                label: e.name,
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
                                                e._v(" "),
                                                o(
                                                  "el-col",
                                                  { attrs: { span: 9 } },
                                                  [
                                                    o(
                                                      "el-button",
                                                      {
                                                        staticClass:
                                                          "am-google-calendar-button",
                                                        class: {
                                                          connected:
                                                            e.employee
                                                              .outlookCalendar
                                                              .token,
                                                        },
                                                        attrs: {
                                                          type: "primary",
                                                        },
                                                        on: {
                                                          click: function (t) {
                                                            e.employee
                                                              .outlookCalendar
                                                              .token
                                                              ? e.disconnectFromOutlookAccount()
                                                              : e.redirectToOutlookAuthPage();
                                                          },
                                                        },
                                                      },
                                                      [
                                                        o(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "am-google-calendar-button-image",
                                                          },
                                                          [
                                                            o("img", {
                                                              attrs: {
                                                                src:
                                                                  e.$root
                                                                    .getUrl +
                                                                  "public/img/outlook-calendar.png",
                                                              },
                                                            }),
                                                          ]
                                                        ),
                                                        e._v(" "),
                                                        o(
                                                          "span",
                                                          {
                                                            staticClass:
                                                              "am-google-calendar-button-text",
                                                          },
                                                          [
                                                            e._v(
                                                              "\n                      " +
                                                                e._s(
                                                                  e.employee
                                                                    .outlookCalendar
                                                                    .token
                                                                    ? e.$root
                                                                        .labels
                                                                        .outlook_sign_out
                                                                    : e.$root
                                                                        .labels
                                                                        .outlook_sign_in
                                                                ) +
                                                                "\n                    "
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
                                          ],
                                          1
                                        ),
                                      ],
                                      1
                                    )
                                  : e._e(),
                                e._v(" "),
                                e.$root.settings.zoom.enabled
                                  ? o(
                                      "el-row",
                                      [
                                        o(
                                          "el-form-item",
                                          {
                                            attrs: {
                                              label: "placeholder",
                                              label:
                                                e.$root.labels.zoom_user + ":",
                                            },
                                          },
                                          [
                                            o(
                                              "label",
                                              {
                                                attrs: { slot: "label" },
                                                slot: "label",
                                              },
                                              [
                                                e._v(
                                                  "\n                " +
                                                    e._s(
                                                      e.$root.labels.zoom_user
                                                    ) +
                                                    ":\n                "
                                                ),
                                                o(
                                                  "el-tooltip",
                                                  {
                                                    attrs: { placement: "top" },
                                                  },
                                                  [
                                                    o("div", {
                                                      attrs: {
                                                        slot: "content",
                                                      },
                                                      domProps: {
                                                        innerHTML: e._s(
                                                          e.$root.labels
                                                            .zoom_user_tooltip
                                                        ),
                                                      },
                                                      slot: "content",
                                                    }),
                                                    e._v(" "),
                                                    o("i", {
                                                      staticClass:
                                                        "el-icon-question am-tooltip-icon",
                                                    }),
                                                  ]
                                                ),
                                              ],
                                              1
                                            ),
                                            e._v(" "),
                                            o(
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
                                                  value: e.employee.zoomUserId,
                                                  callback: function (t) {
                                                    e.$set(
                                                      e.employee,
                                                      "zoomUserId",
                                                      t
                                                    );
                                                  },
                                                  expression:
                                                    "employee.zoomUserId",
                                                },
                                              },
                                              e._l(
                                                e.zoomUsers,
                                                function (e, t) {
                                                  return o("el-option", {
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
                                    )
                                  : e._e(),
                                e._v(" "),
                                o(
                                  "el-row",
                                  { attrs: { gutter: 16 } },
                                  [
                                    o(
                                      "el-col",
                                      { attrs: { sm: 24 } },
                                      [
                                        "admin" === this.$root.settings.role ||
                                        "manager" === this.$root.settings.role
                                          ? o(
                                              "el-form-item",
                                              {
                                                attrs: {
                                                  label:
                                                    e.$root.labels
                                                      .employee_panel_password +
                                                    ":",
                                                  prop: "password",
                                                },
                                              },
                                              [
                                                o("el-input", {
                                                  attrs: {
                                                    "auto-complete": "off",
                                                    placeholder:
                                                      e.$root.labels
                                                        .enter_employee_panel_password,
                                                    "show-password": "",
                                                  },
                                                  on: {
                                                    input: function (t) {
                                                      return e.clearValidation();
                                                    },
                                                  },
                                                  model: {
                                                    value: e.employee.password,
                                                    callback: function (t) {
                                                      e.$set(
                                                        e.employee,
                                                        "password",
                                                        t
                                                      );
                                                    },
                                                    expression:
                                                      "employee.password",
                                                  },
                                                }),
                                              ],
                                              1
                                            )
                                          : e._e(),
                                        e._v(" "),
                                        "admin" === this.$root.settings.role ||
                                        "manager" === this.$root.settings.role
                                          ? o(
                                              "el-form-item",
                                              {
                                                directives: [
                                                  {
                                                    name: "show",
                                                    rawName: "v-show",
                                                    value:
                                                      e.employee.password &&
                                                      e.employee.password
                                                        .length > 0,
                                                    expression:
                                                      "employee.password && employee.password.length > 0",
                                                  },
                                                ],
                                              },
                                              [
                                                o(
                                                  "el-checkbox",
                                                  {
                                                    on: {
                                                      change: function (t) {
                                                        return e.clearValidation();
                                                      },
                                                    },
                                                    model: {
                                                      value:
                                                        e.employee
                                                          .sendEmployeePanelAccessEmail,
                                                      callback: function (t) {
                                                        e.$set(
                                                          e.employee,
                                                          "sendEmployeePanelAccessEmail",
                                                          t
                                                        );
                                                      },
                                                      expression:
                                                        "employee.sendEmployeePanelAccessEmail",
                                                    },
                                                  },
                                                  [
                                                    e._v(
                                                      "\n                  " +
                                                        e._s(
                                                          e.$root.labels
                                                            .send_employee_panel_access_email
                                                        ) +
                                                        "\n                "
                                                    ),
                                                  ]
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
                                o("div", { staticClass: "am-divider" }),
                                e._v(" "),
                                o(
                                  "el-form-item",
                                  {
                                    attrs: {
                                      label: e.$root.labels.note_internal + ":",
                                    },
                                  },
                                  [
                                    o("el-input", {
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
                                        value: e.employee.note,
                                        callback: function (t) {
                                          e.$set(e.employee, "note", t);
                                        },
                                        expression: "employee.note",
                                      },
                                    }),
                                  ],
                                  1
                                ),
                              ],
                              1
                            ),
                            e._v(" "),
                            !0 ===
                              e.$root.settings.capabilities.canWriteOthers ||
                            !0 === e.$root.settings.roles.allowConfigureServices
                              ? o(
                                  "el-tab-pane",
                                  {
                                    attrs: {
                                      label: e.$root.labels.assigned_services,
                                      name: "services",
                                    },
                                  },
                                  [
                                    o("assigned-services", {
                                      attrs: {
                                        "week-schedule": e.editWeekDayList,
                                        "categorized-service-list":
                                          e.editCategorizedServiceList,
                                        "future-appointments":
                                          e.futureAppointments,
                                        "employee-id": e.employee.id,
                                      },
                                    }),
                                  ],
                                  1
                                )
                              : e._e(),
                            e._v(" "),
                            !0 ===
                              e.$root.settings.capabilities.canWriteOthers ||
                            !0 === e.$root.settings.roles.allowConfigureSchedule
                              ? o(
                                  "el-tab-pane",
                                  {
                                    attrs: {
                                      label: e.$root.labels.work_hours,
                                      name: "hours",
                                    },
                                  },
                                  [
                                    o("working-hours", {
                                      attrs: {
                                        "active-tab": e.employeeTabs,
                                        "week-schedule": e.editWeekDayList,
                                        "categorized-service-list":
                                          e.editCategorizedServiceList,
                                        locations: e.locations,
                                      },
                                    }),
                                  ],
                                  1
                                )
                              : e._e(),
                            e._v(" "),
                            !0 ===
                              e.$root.settings.capabilities.canWriteOthers ||
                            !0 === e.$root.settings.roles.allowConfigureDaysOff
                              ? o(
                                  "el-tab-pane",
                                  {
                                    attrs: {
                                      label: e.$root.labels.days_off,
                                      name: "off",
                                    },
                                  },
                                  [
                                    o("div", { staticClass: "am-days-off" }, [
                                      o(
                                        "div",
                                        { staticClass: "am-employee-days-off" },
                                        [
                                          o("days-off", {
                                            attrs: {
                                              daysOff:
                                                0 !== e.employee.id
                                                  ? e.employee.dayOffList
                                                  : [],
                                              listedDaysOff: e.companyDaysOff,
                                            },
                                            on: {
                                              changeDaysOff: e.changeDaysOff,
                                              showCompanyDaysOffSettingsDialog:
                                                e.showCompanyDaysOffSettingsDialog,
                                            },
                                          }),
                                        ],
                                        1
                                      ),
                                    ]),
                                  ]
                                )
                              : e._e(),
                            e._v(" "),
                            !0 ===
                              e.$root.settings.capabilities.canWriteOthers ||
                            !0 ===
                              e.$root.settings.roles.allowConfigureSpecialDays
                              ? o(
                                  "el-tab-pane",
                                  {
                                    attrs: {
                                      label: e.$root.labels.special_days,
                                      name: "special",
                                    },
                                  },
                                  [
                                    o(
                                      "div",
                                      { staticClass: "am-special-days" },
                                      [
                                        o("special-days", {
                                          attrs: {
                                            "active-tab": e.employeeTabs,
                                            specialDays:
                                              e.employee.specialDayList,
                                            locations: e.locations,
                                            categorizedServiceList:
                                              e.editCategorizedServiceList,
                                          },
                                          on: {
                                            changeSpecialDays:
                                              e.changeSpecialDays,
                                          },
                                        }),
                                      ],
                                      1
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
                )
              : e._e(),
            e._v(" "),
            e.employee && !e.dialogLoading
              ? o("dialog-actions", {
                  attrs: {
                    formName: "employee",
                    urlName: "users/providers",
                    isNew: 0 === e.employee.id,
                    entity: e.employee,
                    getParsedEntity: e.getParsedEntity,
                    hasIcons: !0,
                    updateStash: !0,
                    status: { on: "visible", off: "hidden" },
                    buttonText: {
                      confirm: {
                        status: {
                          yes:
                            "visible" === e.employee.status
                              ? e.$root.labels.visibility_hide
                              : e.$root.labels.visibility_show,
                          no: e.$root.labels.no,
                        },
                      },
                    },
                    action: {
                      haveAdd: !0,
                      haveEdit: !0,
                      haveStatus:
                        !0 === e.$root.settings.capabilities.canWriteOthers,
                      haveRemove:
                        !0 === e.$root.settings.capabilities.canDelete,
                      haveRemoveEffect: !0,
                      haveDuplicate:
                        !0 === e.$root.settings.capabilities.canWriteOthers,
                    },
                    message: {
                      success: {
                        save: e.$root.labels.employee_saved,
                        remove: e.$root.labels.employee_deleted,
                        show: e.$root.labels.employee_visible,
                        hide: e.$root.labels.employee_hidden,
                      },
                      confirm: {
                        remove: e.$root.labels.confirm_delete_employee,
                        show: e.$root.labels.confirm_show_employee,
                        hide: e.$root.labels.confirm_hide_employee,
                        duplicate: e.$root.labels.confirm_duplicate_employee,
                      },
                    },
                  },
                  on: {
                    errorCallback: e.errorCallback,
                    validationFailCallback: e.validationFailCallback,
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
  1017: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          o = e._self._c || t;
        return o("div", { staticClass: "am-wrap" }, [
          o(
            "div",
            { staticClass: "am-body", attrs: { id: "am-employees" } },
            [
              o("page-header", {
                attrs: { employeesTotal: e.count },
                on: {
                  newEmployeeBtnClicked: function (t) {
                    return e.showDialogNewEmployee();
                  },
                },
              }),
              e._v(" "),
              o(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: !e.fetched || !e.options.fetched,
                      expression: "!fetched || !options.fetched",
                    },
                  ],
                  staticClass: "am-spinner am-section",
                },
                [
                  o("img", {
                    attrs: { src: e.$root.getUrl + "public/img/spinner.svg" },
                  }),
                ]
              ),
              e._v(" "),
              e.fetched &&
              0 === e.employees.length &&
              !e.filterApplied &&
              e.fetchedFiltered
                ? o("div", { staticClass: "am-empty-state am-section" }, [
                    o("img", {
                      attrs: {
                        src: e.$root.getUrl + "public/img/emptystate.svg",
                      },
                    }),
                    e._v(" "),
                    o("h2", [e._v(e._s(e.$root.labels.no_employees_yet))]),
                    e._v(" "),
                    o("p", [e._v(e._s(e.$root.labels.click_add_employee))]),
                  ])
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
                        e.fetched &&
                        e.options.fetched &&
                        (0 !== e.employees.length ||
                          (0 === e.employees.length && e.filterApplied) ||
                          !e.fetchedFiltered),
                      expression:
                        "fetched && options.fetched && (employees.length !== 0 || employees.length === 0 && filterApplied || !fetchedFiltered)",
                    },
                  ],
                },
                [
                  o(
                    "div",
                    { staticClass: "am-employees-filter am-section" },
                    [
                      o(
                        "el-form",
                        { staticClass: "demo-form-inline" },
                        [
                          o(
                            "el-row",
                            { attrs: { gutter: 16 } },
                            [
                              o(
                                "el-col",
                                { attrs: { lg: 8 } },
                                [
                                  o("el-form-item", [
                                    o(
                                      "div",
                                      { staticClass: "am-search" },
                                      [
                                        o("el-input", {
                                          staticClass: "calc-width",
                                          attrs: {
                                            placeholder: e.searchPlaceholder,
                                          },
                                          model: {
                                            value: e.params.search,
                                            callback: function (t) {
                                              e.$set(e.params, "search", t);
                                            },
                                            expression: "params.search",
                                          },
                                        }),
                                        e._v(" "),
                                        o(
                                          "el-button",
                                          {
                                            staticClass:
                                              "button-filter-toggle am-button-icon",
                                            attrs: { title: "Toggle Filters" },
                                            on: {
                                              click: function (t) {
                                                e.filterFields =
                                                  !e.filterFields;
                                              },
                                            },
                                          },
                                          [
                                            o("img", {
                                              staticClass: "svg",
                                              attrs: {
                                                alt: "Toggle Filters",
                                                src:
                                                  e.$root.getUrl +
                                                  "public/img/filter.svg",
                                              },
                                            }),
                                          ]
                                        ),
                                      ],
                                      1
                                    ),
                                  ]),
                                ],
                                1
                              ),
                              e._v(" "),
                              o(
                                "div",
                                { staticClass: "am-filter-fields" },
                                [
                                  o("transition", { attrs: { name: "fade" } }, [
                                    o(
                                      "div",
                                      {
                                        directives: [
                                          {
                                            name: "show",
                                            rawName: "v-show",
                                            value: e.filterFields,
                                            expression: "filterFields",
                                          },
                                        ],
                                      },
                                      [
                                        o(
                                          "el-col",
                                          {
                                            attrs: {
                                              md: e.options.locations.length
                                                ? 8
                                                : 12,
                                              lg: e.options.locations.length
                                                ? 5
                                                : 8,
                                            },
                                          },
                                          [
                                            o(
                                              "el-form-item",
                                              [
                                                o(
                                                  "el-select",
                                                  {
                                                    attrs: {
                                                      multiple: "",
                                                      filterable: "",
                                                      placeholder:
                                                        e.$root.labels.services,
                                                      "collapse-tags": "",
                                                    },
                                                    on: {
                                                      change: e.changeFilter,
                                                    },
                                                    model: {
                                                      value: e.params.services,
                                                      callback: function (t) {
                                                        e.$set(
                                                          e.params,
                                                          "services",
                                                          t
                                                        );
                                                      },
                                                      expression:
                                                        "params.services",
                                                    },
                                                  },
                                                  e._l(
                                                    e.options.categorized,
                                                    function (t) {
                                                      return o(
                                                        "div",
                                                        { key: t.id },
                                                        [
                                                          o(
                                                            "div",
                                                            {
                                                              staticClass:
                                                                "am-drop-parent",
                                                              on: {
                                                                click:
                                                                  function (o) {
                                                                    return e.selectAllInCategory(
                                                                      t.id
                                                                    );
                                                                  },
                                                              },
                                                            },
                                                            [
                                                              o("span", [
                                                                e._v(
                                                                  e._s(t.name)
                                                                ),
                                                              ]),
                                                            ]
                                                          ),
                                                          e._v(" "),
                                                          e._l(
                                                            t.serviceList,
                                                            function (e) {
                                                              return o(
                                                                "el-option",
                                                                {
                                                                  key: e.id,
                                                                  staticClass:
                                                                    "am-drop-child",
                                                                  attrs: {
                                                                    label:
                                                                      e.name,
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
                                      ],
                                      1
                                    ),
                                  ]),
                                  e._v(" "),
                                  e.options.locations.length
                                    ? o(
                                        "transition",
                                        { attrs: { name: "fade" } },
                                        [
                                          o(
                                            "div",
                                            {
                                              directives: [
                                                {
                                                  name: "show",
                                                  rawName: "v-show",
                                                  value: e.filterFields,
                                                  expression: "filterFields",
                                                },
                                              ],
                                            },
                                            [
                                              o(
                                                "el-col",
                                                { attrs: { md: 8, lg: 5 } },
                                                [
                                                  o(
                                                    "el-form-item",
                                                    [
                                                      o(
                                                        "el-select",
                                                        {
                                                          attrs: {
                                                            placeholder:
                                                              e.$root.labels
                                                                .location,
                                                            clearable: "",
                                                          },
                                                          on: {
                                                            change:
                                                              e.changeFilter,
                                                          },
                                                          model: {
                                                            value:
                                                              e.params.location,
                                                            callback: function (
                                                              t
                                                            ) {
                                                              e.$set(
                                                                e.params,
                                                                "location",
                                                                t
                                                              );
                                                            },
                                                            expression:
                                                              "params.location",
                                                          },
                                                        },
                                                        e._l(
                                                          e.options.locations,
                                                          function (e) {
                                                            return o(
                                                              "el-option",
                                                              {
                                                                key: e.id,
                                                                attrs: {
                                                                  label: e.name,
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
                                              ),
                                            ],
                                            1
                                          ),
                                        ]
                                      )
                                    : e._e(),
                                  e._v(" "),
                                  o("transition", { attrs: { name: "fade" } }, [
                                    o(
                                      "div",
                                      {
                                        directives: [
                                          {
                                            name: "show",
                                            rawName: "v-show",
                                            value: e.filterFields,
                                            expression: "filterFields",
                                          },
                                        ],
                                      },
                                      [
                                        o(
                                          "el-col",
                                          {
                                            attrs: {
                                              md: e.options.locations.length
                                                ? 8
                                                : 12,
                                              lg: e.options.locations.length
                                                ? 6
                                                : 8,
                                            },
                                          },
                                          [
                                            o(
                                              "el-form-item",
                                              [
                                                o(
                                                  "el-select",
                                                  {
                                                    staticClass:
                                                      "calc-width sort",
                                                    attrs: {
                                                      placeholder:
                                                        e.$root.labels.sort,
                                                    },
                                                    on: {
                                                      change: e.filterData,
                                                    },
                                                    model: {
                                                      value: e.params.sort,
                                                      callback: function (t) {
                                                        e.$set(
                                                          e.params,
                                                          "sort",
                                                          t
                                                        );
                                                      },
                                                      expression: "params.sort",
                                                    },
                                                  },
                                                  e._l(
                                                    e.options.sort,
                                                    function (e) {
                                                      return o("el-option", {
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
                              e._v(" "),
                              o(
                                "div",
                                { staticClass: "am-filter-buttons" },
                                [
                                  o(
                                    "el-tooltip",
                                    {
                                      staticClass: "item",
                                      attrs: {
                                        effect: "dark",
                                        content: e.$root.labels.grid_view,
                                        placement: "top",
                                      },
                                    },
                                    [
                                      o(
                                        "el-button",
                                        {
                                          staticClass:
                                            "am-button-icon change-view",
                                          class: { active: e.gridViewActive },
                                          attrs: {
                                            title: e.$root.labels.grid_view,
                                          },
                                          on: { click: e.gridView },
                                        },
                                        [
                                          o("img", {
                                            staticClass: "svg",
                                            attrs: {
                                              alt: "Grid View",
                                              src:
                                                e.$root.getUrl +
                                                "public/img/grid-view.svg",
                                            },
                                          }),
                                        ]
                                      ),
                                    ],
                                    1
                                  ),
                                  e._v(" "),
                                  o(
                                    "el-tooltip",
                                    {
                                      staticClass: "item",
                                      attrs: {
                                        effect: "dark",
                                        content: e.$root.labels.table_view,
                                        placement: "top",
                                      },
                                    },
                                    [
                                      o(
                                        "el-button",
                                        {
                                          staticClass:
                                            "am-button-icon change-view",
                                          class: { active: e.tableViewActive },
                                          attrs: {
                                            title: e.$root.labels.table_view,
                                          },
                                          on: { click: e.tableView },
                                        },
                                        [
                                          o("img", {
                                            staticClass: "svg",
                                            attrs: {
                                              alt: "Table View",
                                              src:
                                                e.$root.getUrl +
                                                "public/img/list-view.svg",
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
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value:
                            e.fetched &&
                            0 === e.employees.length &&
                            e.filterApplied &&
                            e.fetchedFiltered,
                          expression:
                            "fetched && employees.length === 0 && filterApplied && fetchedFiltered",
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
                      o("h2", [e._v(e._s(e.$root.labels.no_results))]),
                    ]
                  ),
                  e._v(" "),
                  e.tableViewActive
                    ? o(
                        "div",
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value:
                                e.fetchedFiltered && 0 !== e.employees.length,
                              expression:
                                "fetchedFiltered && employees.length !== 0",
                            },
                          ],
                          staticClass: "am-employees-table-view am-section",
                        },
                        [
                          o(
                            "div",
                            { staticClass: "am-employees-list-head" },
                            [
                              o(
                                "el-row",
                                [
                                  !0 === e.$root.settings.capabilities.canDelete
                                    ? o("el-col", { attrs: { lg: 1 } }, [
                                        o(
                                          "p",
                                          [
                                            o("el-checkbox", {
                                              on: {
                                                change: function (t) {
                                                  e.checkEmployeeData =
                                                    e.handleCheckAll(
                                                      e.employees,
                                                      e.checkEmployeeData
                                                    );
                                                },
                                              },
                                              model: {
                                                value:
                                                  e.checkEmployeeData
                                                    .allChecked,
                                                callback: function (t) {
                                                  e.$set(
                                                    e.checkEmployeeData,
                                                    "allChecked",
                                                    t
                                                  );
                                                },
                                                expression:
                                                  "checkEmployeeData.allChecked",
                                              },
                                            }),
                                          ],
                                          1
                                        ),
                                      ])
                                    : e._e(),
                                  e._v(" "),
                                  o("el-col", { attrs: { lg: 2 } }, [
                                    o("p", [
                                      e._v(e._s(e.$root.labels.activity) + ":"),
                                    ]),
                                  ]),
                                  e._v(" "),
                                  o("el-col", { attrs: { lg: 6 } }, [
                                    o("p", [
                                      e._v(e._s(e.$root.labels.employee) + ":"),
                                    ]),
                                  ]),
                                  e._v(" "),
                                  o("el-col", { attrs: { lg: 7 } }, [
                                    o("p", [
                                      e._v(e._s(e.$root.labels.email) + ":"),
                                    ]),
                                  ]),
                                  e._v(" "),
                                  o("el-col", { attrs: { lg: 5 } }, [
                                    o("p", [
                                      e._v(e._s(e.$root.labels.phone) + ":"),
                                    ]),
                                  ]),
                                ],
                                1
                              ),
                            ],
                            1
                          ),
                          e._v(" "),
                          o("transition", { attrs: { name: "fadeIn" } }, [
                            o(
                              "div",
                              { staticClass: "am-employees-list" },
                              e._l(e.employees, function (t) {
                                return "hidden" === t.status ||
                                  "visible" === t.status
                                  ? o(
                                      "div",
                                      {
                                        class: {
                                          "am-employee-row am-hidden-entity":
                                            "hidden" === t.status,
                                          "am-employee-row":
                                            "visible" === t.status,
                                        },
                                      },
                                      [
                                        o(
                                          "el-row",
                                          [
                                            !0 ===
                                            e.$root.settings.capabilities
                                              .canDelete
                                              ? o(
                                                  "el-col",
                                                  { attrs: { lg: 1, sm: 1 } },
                                                  [
                                                    o(
                                                      "span",
                                                      {
                                                        staticClass:
                                                          "am-employee-col",
                                                        on: {
                                                          click: function (e) {
                                                            e.stopPropagation();
                                                          },
                                                        },
                                                      },
                                                      [
                                                        o("el-checkbox", {
                                                          on: {
                                                            change: function (
                                                              t
                                                            ) {
                                                              e.checkEmployeeData =
                                                                e.handleCheckSingle(
                                                                  e.employees,
                                                                  e.checkEmployeeData
                                                                );
                                                            },
                                                          },
                                                          model: {
                                                            value: t.checked,
                                                            callback: function (
                                                              o
                                                            ) {
                                                              e.$set(
                                                                t,
                                                                "checked",
                                                                o
                                                              );
                                                            },
                                                            expression:
                                                              "employee.checked",
                                                          },
                                                        }),
                                                      ],
                                                      1
                                                    ),
                                                  ]
                                                )
                                              : e._e(),
                                            e._v(" "),
                                            o(
                                              "el-col",
                                              { attrs: { lg: 2, md: 8 } },
                                              [
                                                o(
                                                  "p",
                                                  {
                                                    staticClass: "am-col-title",
                                                  },
                                                  [
                                                    e._v(
                                                      e._s(
                                                        e.$root.labels.status
                                                      ) + ":"
                                                    ),
                                                  ]
                                                ),
                                                e._v(" "),
                                                o(
                                                  "div",
                                                  {
                                                    staticClass:
                                                      "am-employee-col",
                                                  },
                                                  [
                                                    "visible" === t.status
                                                      ? o(
                                                          "span",
                                                          {
                                                            staticClass:
                                                              "am-employee-status-label",
                                                            class: t.activity,
                                                          },
                                                          [
                                                            e._v(
                                                              "\n                      " +
                                                                e._s(
                                                                  e.getEmployeeActivityLabel(
                                                                    t.activity
                                                                  )
                                                                ) +
                                                                "\n                    "
                                                            ),
                                                          ]
                                                        )
                                                      : e._e(),
                                                  ]
                                                ),
                                              ]
                                            ),
                                            e._v(" "),
                                            o(
                                              "el-col",
                                              { attrs: { lg: 6, md: 16 } },
                                              [
                                                o(
                                                  "p",
                                                  {
                                                    staticClass: "am-col-title",
                                                  },
                                                  [
                                                    e._v(
                                                      e._s(
                                                        e.$root.labels.employee
                                                      ) + ":"
                                                    ),
                                                  ]
                                                ),
                                                e._v(" "),
                                                o(
                                                  "div",
                                                  {
                                                    staticClass:
                                                      "am-employee-col",
                                                  },
                                                  [
                                                    o("img", {
                                                      attrs: {
                                                        src: e.pictureLoad(
                                                          t,
                                                          !0
                                                        ),
                                                      },
                                                      on: {
                                                        error: function (o) {
                                                          return e.imageLoadError(
                                                            t,
                                                            !0
                                                          );
                                                        },
                                                      },
                                                    }),
                                                    e._v(" "),
                                                    o("h4", [
                                                      e._v(
                                                        "\n                      " +
                                                          e._s(t.firstName) +
                                                          " " +
                                                          e._s(t.lastName) +
                                                          "\n                      "
                                                      ),
                                                      o(
                                                        "span",
                                                        {
                                                          staticClass:
                                                            "am-employee-id",
                                                        },
                                                        [
                                                          e._v(
                                                            " (" +
                                                              e._s(
                                                                e.$root.labels
                                                                  .id
                                                              ) +
                                                              ": " +
                                                              e._s(t.id) +
                                                              ")"
                                                          ),
                                                        ]
                                                      ),
                                                    ]),
                                                  ]
                                                ),
                                              ]
                                            ),
                                            e._v(" "),
                                            o(
                                              "el-col",
                                              { attrs: { lg: 7, md: 8 } },
                                              [
                                                o(
                                                  "p",
                                                  {
                                                    staticClass: "am-col-title",
                                                  },
                                                  [
                                                    e._v(
                                                      e._s(
                                                        e.$root.labels.email
                                                      ) + ":"
                                                    ),
                                                  ]
                                                ),
                                                e._v(" "),
                                                o(
                                                  "div",
                                                  {
                                                    staticClass:
                                                      "am-employee-col",
                                                  },
                                                  [
                                                    o(
                                                      "h4",
                                                      {
                                                        staticClass: "am-email",
                                                      },
                                                      [e._v(e._s(t.email))]
                                                    ),
                                                  ]
                                                ),
                                              ]
                                            ),
                                            e._v(" "),
                                            o(
                                              "el-col",
                                              { attrs: { lg: 5, md: 16 } },
                                              [
                                                o(
                                                  "p",
                                                  {
                                                    staticClass: "am-col-title",
                                                  },
                                                  [
                                                    e._v(
                                                      e._s(
                                                        e.$root.labels.phone
                                                      ) + ":"
                                                    ),
                                                  ]
                                                ),
                                                e._v(" "),
                                                o(
                                                  "div",
                                                  {
                                                    staticClass:
                                                      "am-employee-col",
                                                  },
                                                  [
                                                    o("h4", [
                                                      e._v(e._s(t.phone)),
                                                    ]),
                                                  ]
                                                ),
                                              ]
                                            ),
                                            e._v(" "),
                                            o(
                                              "el-col",
                                              { attrs: { lg: 3, md: 8 } },
                                              [
                                                o(
                                                  "div",
                                                  {
                                                    staticClass:
                                                      "am-employee-col am-edit-btn",
                                                  },
                                                  [
                                                    o(
                                                      "el-button",
                                                      {
                                                        on: {
                                                          click: function (o) {
                                                            return e.showDialogEditEmployee(
                                                              t.id
                                                            );
                                                          },
                                                        },
                                                      },
                                                      [
                                                        e._v(
                                                          e._s(
                                                            e.$root.labels.edit
                                                          )
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
                                      ],
                                      1
                                    )
                                  : e._e();
                              }),
                              0
                            ),
                          ]),
                        ],
                        1
                      )
                    : e._e(),
                  e._v(" "),
                  e.gridViewActive
                    ? o(
                        "div",
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value:
                                e.fetchedFiltered && 0 !== e.employees.length,
                              expression:
                                "fetchedFiltered && employees.length !== 0",
                            },
                          ],
                          staticClass: "am-employees-grid-view am-section",
                        },
                        [
                          o(
                            "el-row",
                            { attrs: { gutter: 16 } },
                            [
                              e._l(e.employees, function (t) {
                                return [
                                  "hidden" === t.status ||
                                  "visible" === t.status
                                    ? o(
                                        "el-col",
                                        { attrs: { lg: 8, md: 12 } },
                                        [
                                          o(
                                            "transition",
                                            { attrs: { name: "fadeIn" } },
                                            [
                                              o(
                                                "div",
                                                {
                                                  staticClass:
                                                    "am-employee-card",
                                                  class: {
                                                    "am-hidden-entity":
                                                      "hidden" === t.status,
                                                  },
                                                  on: {
                                                    click: function (o) {
                                                      return e.showDialogEditEmployee(
                                                        t.id
                                                      );
                                                    },
                                                  },
                                                },
                                                [
                                                  "visible" === t.status
                                                    ? o(
                                                        "span",
                                                        {
                                                          staticClass:
                                                            "am-employee-status-label",
                                                          class: t.activity,
                                                        },
                                                        [
                                                          e._v(
                                                            "\n                    " +
                                                              e._s(
                                                                e.getEmployeeActivityLabel(
                                                                  t.activity
                                                                )
                                                              ) +
                                                              "\n                  "
                                                          ),
                                                        ]
                                                      )
                                                    : e._e(),
                                                  e._v(" "),
                                                  o("img", {
                                                    attrs: {
                                                      src: e.pictureLoad(t, !0),
                                                    },
                                                    on: {
                                                      error: function (o) {
                                                        return e.imageLoadError(
                                                          t,
                                                          !0
                                                        );
                                                      },
                                                    },
                                                  }),
                                                  e._v(" "),
                                                  o("div", {}, [
                                                    o("h4", [
                                                      e._v(
                                                        "\n                      " +
                                                          e._s(
                                                            t.firstName +
                                                              " " +
                                                              t.lastName
                                                          ) +
                                                          "\n                      "
                                                      ),
                                                      o(
                                                        "span",
                                                        {
                                                          staticClass:
                                                            "am-employee-id",
                                                        },
                                                        [
                                                          e._v(
                                                            " (" +
                                                              e._s(
                                                                e.$root.labels
                                                                  .id
                                                              ) +
                                                              ": " +
                                                              e._s(t.id) +
                                                              ")"
                                                          ),
                                                        ]
                                                      ),
                                                    ]),
                                                    e._v(" "),
                                                    o(
                                                      "p",
                                                      {
                                                        staticClass: "am-email",
                                                      },
                                                      [e._v(e._s(t.email))]
                                                    ),
                                                    e._v(" "),
                                                    o("p", [
                                                      e._v(e._s(t.phone)),
                                                    ]),
                                                  ]),
                                                ]
                                              ),
                                            ]
                                          ),
                                        ],
                                        1
                                      )
                                    : e._e(),
                                ];
                              }),
                            ],
                            2
                          ),
                        ],
                        1
                      )
                    : e._e(),
                  e._v(" "),
                  !0 === e.$root.settings.capabilities.canReadOthers
                    ? o("pagination-block", {
                        attrs: {
                          params: e.params,
                          count: e.options.countFiltered,
                          label: e.$root.labels.employees_lower,
                          visible:
                            e.fetched &&
                            0 !== e.employees.length &&
                            e.fetchedFiltered,
                        },
                        on: { change: e.filterData },
                      })
                    : e._e(),
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
                      value: e.fetched && !e.fetchedFiltered,
                      expression: "fetched && !fetchedFiltered",
                    },
                  ],
                  staticClass: "am-spinner am-section",
                },
                [
                  o("img", {
                    attrs: { src: e.$root.getUrl + "public/img/spinner.svg" },
                  }),
                ]
              ),
              e._v(" "),
              !0 === e.$root.settings.capabilities.canWriteOthers
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
                        on: {
                          click: function (t) {
                            return e.showDialogNewEmployee();
                          },
                        },
                      }),
                    ],
                    1
                  )
                : e._e(),
              e._v(" "),
              o("group-delete", {
                attrs: {
                  name: "users/providers",
                  entities: e.employees,
                  checkGroupData: e.checkEmployeeData,
                  confirmDeleteMessage: e.$root.labels.confirm_delete_employee,
                  successMessage: {
                    single: e.$root.labels.employee_deleted,
                    multiple: e.$root.labels.employees_deleted,
                  },
                  errorMessage: {
                    single: e.$root.labels.employee_not_deleted,
                    multiple: e.$root.labels.employees_not_deleted,
                  },
                },
                on: { groupDeleteCallback: e.groupDeleteCallback },
              }),
              e._v(" "),
              o(
                "transition",
                { attrs: { name: "slide" } },
                [
                  e.dialogEmployee
                    ? o(
                        "el-dialog",
                        {
                          staticClass: "am-side-dialog am-dialog-employee",
                          attrs: {
                            visible: e.dialogEmployee,
                            "show-close": !1,
                          },
                          on: {
                            "update:visible": function (t) {
                              e.dialogEmployee = t;
                            },
                          },
                        },
                        [
                          o("dialog-employee", {
                            attrs: {
                              locations: e.options.locations,
                              employee: e.employee,
                              futureAppointments: e.futureAppointments,
                              editCategorizedServiceList:
                                e.editCategorizedServiceList,
                              editWeekDayList: e.editWeekDayList,
                              companyDaysOff: e.$root.settings.daysOff,
                            },
                            on: {
                              saveCallback: e.saveEmployeeCallback,
                              duplicateCallback: e.duplicateEmployeeCallback,
                              closeDialog: function (t) {
                                e.dialogEmployee = !1;
                              },
                              showCompanyDaysOffSettingsDialog: function (t) {
                                e.dialogCompanyDaysOffSettings = !0;
                              },
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
              o(
                "transition",
                { attrs: { name: "slide" } },
                [
                  e.dialogCompanyDaysOffSettings
                    ? o(
                        "el-dialog",
                        {
                          staticClass: "am-side-dialog am-dialog-employee",
                          attrs: {
                            visible: e.dialogCompanyDaysOffSettings,
                            "show-close": !1,
                          },
                          on: {
                            "update:visible": function (t) {
                              e.dialogCompanyDaysOffSettings = t;
                            },
                          },
                        },
                        [
                          o("dialog-settings-work-hours-days-off", {
                            attrs: {
                              daysOff: e.$root.settings.daysOff,
                              showWorkingHours: !1,
                              showDaysOff: !0,
                            },
                            on: {
                              closeDialogSettingsWorkHoursDaysOff: function (
                                t
                              ) {
                                e.dialogCompanyDaysOffSettings = !1;
                              },
                              updateSettings:
                                e.updateCompanyWorkingHoursAndDaysOffSettings,
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
              o("el-col", { attrs: { md: 6 } }, [
                o(
                  "a",
                  {
                    staticClass: "am-help-button",
                    attrs: {
                      href: "https://wpamelia.com/employees/",
                      target: "_blank",
                    },
                  },
                  [
                    o("i", { staticClass: "el-icon-question" }),
                    e._v(" " + e._s(e.$root.labels.need_help) + "?\n      "),
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
  665: function (e, t, o) {
    var i = o(685)(o(1013), o(1017), !1, null, null, null);
    e.exports = i.exports;
  },
  685: function (e, t) {
    e.exports = function (e, t, o, i, a, s) {
      var n,
        r = (e = e || {}),
        l = typeof e.default;
      ("object" !== l && "function" !== l) || ((n = e), (r = e.default));
      var c,
        d = "function" == typeof r ? r.options : r;
      if (
        (t &&
          ((d.render = t.render),
          (d.staticRenderFns = t.staticRenderFns),
          (d._compiled = !0)),
        o && (d.functional = !0),
        a && (d._scopeId = a),
        s
          ? ((c = function (e) {
              (e =
                e ||
                (this.$vnode && this.$vnode.ssrContext) ||
                (this.parent &&
                  this.parent.$vnode &&
                  this.parent.$vnode.ssrContext)) ||
                "undefined" == typeof __VUE_SSR_CONTEXT__ ||
                (e = __VUE_SSR_CONTEXT__),
                i && i.call(this, e),
                e && e._registeredComponents && e._registeredComponents.add(s);
            }),
            (d._ssrRegister = c))
          : i && (c = i),
        c)
      ) {
        var m = d.functional,
          u = m ? d.render : d.beforeCreate;
        m
          ? ((d._injectStyles = c),
            (d.render = function (e, t) {
              return c.call(t), u(e, t);
            }))
          : (d.beforeCreate = u ? [].concat(u, c) : [c]);
      }
      return { esModule: n, exports: r, options: d };
    };
  },
  686: function (e, t, o) {
    "use strict";
    var i =
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
          Object.keys(e).forEach(function (a) {
            null !== e[a] && "object" === i(e[a]) && a in t
              ? o.replaceExistingObjectProperties(e[a], t[a])
              : a in t && (e[a] = t[a]);
          });
        },
        addMissingObjectProperties: function (e, t) {
          var o = this;
          Object.keys(t).forEach(function (a) {
            var s = !1;
            a in e ||
              ("object" === i(t[a])
                ? ((e[a] = {}), (s = !0))
                : ((e[a] = null), (s = !0))),
              null === t[a] || "object" !== i(t[a])
                ? s && (e[a] = t[a])
                : o.addMissingObjectProperties(e[a], t[a]);
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
              i = {};
            return (
              t.split("&").forEach(function (e) {
                (o = e.split("=")),
                  (i[o[0]] = decodeURIComponent(o[1]).replace(/\+/g, " "));
              }),
              i
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
              var i = encodeURIComponent(t) + "=",
                a = o[1].split(/[&;]/g),
                s = a.length;
              s-- > 0;

            )
              -1 !== a[s].lastIndexOf(i, 0) && a.splice(s, 1);
            return (e = o[0] + (a.length > 0 ? "?" + a.join("&") : ""));
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
            i = this.getNameInitials(e),
            a = Math.floor(Math.random() * this.colors.length),
            s = this.colors[a];
          return (
            this.usedColors.push(this.colors[a]),
            this.colors.splice(a, 1),
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
                s +
                "/fff?text=" +
                i
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
  688: function (e, t, o) {
    "use strict";
    var i = o(706),
      a = o(343),
      s = Object.prototype.toString;
    function n(e) {
      return "[object Array]" === s.call(e);
    }
    function r(e) {
      return null !== e && "object" == typeof e;
    }
    function l(e) {
      return "[object Function]" === s.call(e);
    }
    function c(e, t) {
      if (null !== e && void 0 !== e)
        if (("object" == typeof e || n(e) || (e = [e]), n(e)))
          for (var o = 0, i = e.length; o < i; o++) t.call(null, e[o], o, e);
        else
          for (var a in e)
            Object.prototype.hasOwnProperty.call(e, a) &&
              t.call(null, e[a], a, e);
    }
    e.exports = {
      isArray: n,
      isArrayBuffer: function (e) {
        return "[object ArrayBuffer]" === s.call(e);
      },
      isBuffer: a,
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
        return "[object Date]" === s.call(e);
      },
      isFile: function (e) {
        return "[object File]" === s.call(e);
      },
      isBlob: function (e) {
        return "[object Blob]" === s.call(e);
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
        function o(o, i) {
          "object" == typeof t[i] && "object" == typeof o
            ? (t[i] = e(t[i], o))
            : (t[i] = o);
        }
        for (var i = 0, a = arguments.length; i < a; i++) c(arguments[i], o);
        return t;
      },
      extend: function (e, t, o) {
        return (
          c(t, function (t, a) {
            e[a] = o && "function" == typeof t ? i(t, o) : t;
          }),
          e
        );
      },
      trim: function (e) {
        return e.replace(/^\s*/, "").replace(/\s*$/, "");
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
            i = this.getPriceThousandSeparator(),
            a = this.getPriceDecimalSeparator(),
            s = this.getPricePrefix(),
            n = this.getPriceSuffix(),
            r = parseInt((e = Math.abs(+e || 0).toFixed(o))) + "",
            l = r.length > 3 ? r.length % 3 : 0;
          return (
            (t ? s : "") +
            (l ? r.substr(0, l) + i : "") +
            r.substr(l).replace(/(\d{3})(?=\d)/g, "$1" + i) +
            (o
              ? a +
                Math.abs(e - r)
                  .toFixed(o)
                  .slice(2)
              : "") +
            (t ? n : "")
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
  691: function (e, t, o) {
    "use strict";
    t.a = {
      methods: {
        notify: function (e, t, o, i) {
          var a = this;
          void 0 === i && (i = ""),
            setTimeout(function () {
              a.$notify({
                customClass: i,
                title: e,
                message: t,
                type: o,
                offset: 50,
              });
            }, 700);
        },
      },
    };
  },
  692: function (e, t, o) {
    "use strict";
    var i = o(0),
      a = o.n(i);
    t.a = {
      data: function () {
        return {
          timeSelectOptions: {
            start: "00:00",
            end: "23:59",
            step: this.secondsToTimeSelectStep(this.getTimeSlotLength()),
          },
          customTimeOptions: [],
        };
      },
      //P2P: get custom select options on created
      created: function(){
        this.customTimeOptions = this.getCustomTimeSelectOptions();
      },
      methods: {
        convertDateTimeRangeDifferenceToMomentDuration: function (e, t) {
          return a.a.duration(a()(t).diff(a()(e)));
        },
        convertSecondsToMomentDuration: function (e) {
          return a.a.duration(e, "seconds");
        },
        momentDurationToNiceDurationWithUnit: function (e) {
          var t = Math.floor(e.asMinutes() / 60),
            o = e.asMinutes() % 60;
          return (
            (t ? t + this.$root.labels.h + " " : "") +
            " " +
            (o ? o + this.$root.labels.min : "")
          );
        },
        secondsToNiceDuration: function (e) {
          var t = Math.floor(e / 3600),
            o = (e / 60) % 60;
          return (
            (t ? t + this.$root.labels.h + " " : "") +
            " " +
            (o ? o + this.$root.labels.min : "")
          );
        },
        secondsToTimeSelectStep: function (e) {
          var t = Math.floor(e / 3600),
            o = Math.floor(e / 60) - 60 * t;
          return e < 0
            ? (t || "00") + ":" + ((o < 9 ? "0" + o : o) || "00")
            : ((t <= 9 ? "0" + t : t) || "00") +
                ":" +
                ((o <= 9 ? "0" + o : o) || "00");
        },
        //P2P: Get  custom select options for time
        getCustomTimeSelectOptions: function() {
          var step = this.secondsToTimeSelectStep(this.getTimeSlotLength());
          var dateTime = this.$moment('2020-01-01');
          var times = [];
          var hour, minute, value;
          do {
            hour = dateTime.hour();
            minute = dateTime.minute();
            value = hour > 0 ? dateTime.format('HH:mm') : `00:${minute < 10 ? '0' : ''}${minute}`;
            times.push({value, label: dateTime.format('hh:mm A') });
            dateTime = dateTime.add(step);
          } while (dateTime.date() === 1);
          return times;
        },
        //P2P: Get 12 format from 24 format time value
        to12Format: function(value) {
          var item = this.customTimeOptions.find(x => x.value === value);
          return item ? item.label : this.customTimeOptions[0].label;
        },
        //P2P: Custom time select
        customTimeSelect: function(creator, minTime, maxTime) {
          var options = this.customTimeOptions.map(item =>
            creator("el-option", {
              key: item.value,
              attrs: {
                value: item.value,
                label: item.label
              },
            })
          );
          options.unshift(creator('i', {
            slot: 'prefix',
            staticClass: 'el-input__icon el-icon-time'
          }));
          return options;
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
              o = [],
              i = this.getTimeSlotLength();
            i <= t;
            i += this.getTimeSlotLength()
          )
            o.push(i);
          return (
            e &&
              -1 === o.indexOf(e) &&
              (o.push(e),
              o.sort(function (e, t) {
                return e - t;
              })),
            o
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
          return a()(e, "HH:mm").diff(a()().startOf("day"), "seconds");
        },
      },
    };
  },
  693: function (e, t, o) {
    (function (o) {
      var i, a, s, n;
      (n = void 0 !== o ? o : this.window || this.global),
        (a = []),
        (i = (function (e) {
          var t,
            o = {},
            i = !!document.querySelector && !!e.addEventListener,
            a = { initClass: "js-inlinesvg", svgSelector: "img.svg" },
            s = function () {
              var e = {},
                t = !1,
                o = 0,
                i = arguments.length;
              "[object Boolean]" ===
                Object.prototype.toString.call(arguments[0]) &&
                ((t = arguments[0]), o++);
              for (
                var a = function (o) {
                  for (var i in o)
                    Object.prototype.hasOwnProperty.call(o, i) &&
                      (t &&
                      "[object Object]" === Object.prototype.toString.call(o[i])
                        ? (e[i] = s(!0, e[i], o[i]))
                        : (e[i] = o[i]));
                };
                i > o;
                o++
              ) {
                a(arguments[o]);
              }
              return e;
            },
            n = function (e) {
              var o = document.querySelectorAll(t.svgSelector),
                i = (function (e, t) {
                  return function () {
                    return --e < 1 ? t.apply(this, arguments) : void 0;
                  };
                })(o.length, e);
              Array.prototype.forEach.call(o, function (e, o) {
                var a = e.src || e.getAttribute("data-src"),
                  s = e.attributes,
                  n = new XMLHttpRequest();
                n.open("GET", a, !0),
                  (n.onload = function () {
                    if (n.status >= 200 && n.status < 400) {
                      var o = new DOMParser()
                        .parseFromString(n.responseText, "text/xml")
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
                        Array.prototype.slice.call(s).forEach(function (e) {
                          "src" !== e.name &&
                            "alt" !== e.name &&
                            o.setAttribute(e.name, e.value);
                        }),
                        o.classList
                          ? o.classList.add("inlined-svg")
                          : (o.className += " inlined-svg"),
                        o.setAttribute("role", "img"),
                        s.longdesc)
                      ) {
                        var a = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "desc"
                          ),
                          r = document.createTextNode(s.longdesc.value);
                        a.appendChild(r), o.insertBefore(a, o.firstChild);
                      }
                      if (s.alt) {
                        o.setAttribute("aria-labelledby", "title");
                        var l = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "title"
                          ),
                          c = document.createTextNode(s.alt.value);
                        l.appendChild(c), o.insertBefore(l, o.firstChild);
                      }
                      e.parentNode.replaceChild(o, e), i(t.svgSelector);
                    } else
                      console.error(
                        "There was an error retrieving the source of the SVG."
                      );
                  }),
                  (n.onerror = function () {
                    console.error(
                      "There was an error connecting to the origin server."
                    );
                  }),
                  n.send();
              });
            };
          return (
            (o.init = function (e, o) {
              i &&
                ((t = s(a, e || {})),
                n(o || function () {}),
                (document.documentElement.className += " " + t.initClass));
            }),
            o
          );
        })(n)),
        void 0 === (s = "function" == typeof i ? i.apply(t, a) : i) ||
          (e.exports = s);
    }.call(t, o(39)));
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
    var i = o(685)(o(703), o(704), !1, null, null, null);
    e.exports = i.exports;
  },
  697: function (e, t, o) {
    "use strict";
    (function (t) {
      var i = o(688),
        a = o(724),
        s = { "Content-Type": "application/x-www-form-urlencoded" };
      function n(e, t) {
        !i.isUndefined(e) &&
          i.isUndefined(e["Content-Type"]) &&
          (e["Content-Type"] = t);
      }
      var r,
        l = {
          adapter:
            ("undefined" != typeof XMLHttpRequest
              ? (r = o(707))
              : void 0 !== t && (r = o(707)),
            r),
          transformRequest: [
            function (e, t) {
              return (
                a(t, "Content-Type"),
                i.isFormData(e) ||
                i.isArrayBuffer(e) ||
                i.isBuffer(e) ||
                i.isStream(e) ||
                i.isFile(e) ||
                i.isBlob(e)
                  ? e
                  : i.isArrayBufferView(e)
                  ? e.buffer
                  : i.isURLSearchParams(e)
                  ? (n(t, "application/x-www-form-urlencoded;charset=utf-8"),
                    e.toString())
                  : i.isObject(e)
                  ? (n(t, "application/json;charset=utf-8"), JSON.stringify(e))
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
        i.forEach(["delete", "get", "head"], function (e) {
          l.headers[e] = {};
        }),
        i.forEach(["post", "put", "patch"], function (e) {
          l.headers[e] = i.merge(s);
        }),
        (e.exports = l);
    }.call(t, o(142)));
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
  701: function (e, t, o) {
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
  702: function (e, t, o) {
    "use strict";
    var i = (function () {
        function e(e, t) {
          for (var o = 0; o < t.length; o++) {
            var i = t[o];
            (i.enumerable = i.enumerable || !1),
              (i.configurable = !0),
              "value" in i && (i.writable = !0),
              Object.defineProperty(e, i.key, i);
          }
        }
        return function (t, o, i) {
          return o && e(t.prototype, o), i && e(t, i), t;
        };
      })(),
      a = r(o(721)),
      s = r(o(739)),
      n = r(o(740));
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
          (this.errors = new s.default()),
          ["post", "patch", "put", "delete"].forEach(function (e) {
            t[e] = function (o, i) {
              return t.submit(e, o, i);
            };
          });
      }
      return (
        i(e, [
          {
            key: "submit",
            value: function (t, o) {
              var i = this,
                a =
                  arguments.length > 2 && void 0 !== arguments[2]
                    ? arguments[2]
                    : {};
              return (
                (t = t.toLowerCase()),
                this.hasFiles(a) &&
                  ((a = (0, n.default)(a)),
                  "post" !== t &&
                    (a.append("_method", t.toUpperCase()), (t = "post"))),
                (this.progress = 0),
                this.errors.clear(),
                (this.isPending = !0),
                new Promise(function (s, n) {
                  e.defaults.axios[t](o, a, i.config())
                    .then(function (e) {
                      s(e.data);
                    })
                    .catch(function (e) {
                      i.handleError(e), n(e);
                    })
                    .then(function () {
                      return (i.isPending = !1);
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
              var o = "post";
              return (
                t.hasOwnProperty("id") &&
                  ((o = "patch"), (e = this.urlToPatchResource(e, t))),
                this[o](e, t)
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
    (l.defaults = { axios: a.default }), (e.exports = l);
  },
  703: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var i = o(700);
    t.default = {
      mixins: [i.a],
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
              var i = parseInt(o.slice(1)),
                a = this.countries.filter(function (e) {
                  return e.phonecode === i;
                });
              if (a.length) {
                var s = null;
                1 === i
                  ? (s = a.find(function (e) {
                      return 229 === e.id;
                    }))
                  : 44 === i
                  ? (s = a.find(function (e) {
                      return 228 === e.id;
                    }))
                  : 7 === i &&
                    (s = a.find(function (e) {
                      return 176 === e.id;
                    })),
                  (void 0 !== s && null !== s) || (s = a[0]),
                  (this.value = s.iso);
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
  706: function (e, t, o) {
    "use strict";
    e.exports = function (e, t) {
      return function () {
        for (var o = new Array(arguments.length), i = 0; i < o.length; i++)
          o[i] = arguments[i];
        return e.apply(t, o);
      };
    };
  },
  707: function (e, t, o) {
    "use strict";
    var i = o(688),
      a = o(725),
      s = o(727),
      n = o(728),
      r = o(729),
      l = o(708),
      c =
        ("undefined" != typeof window &&
          window.btoa &&
          window.btoa.bind(window)) ||
        o(730);
    e.exports = function (e) {
      return new Promise(function (t, d) {
        var m = e.data,
          u = e.headers;
        i.isFormData(m) && delete u["Content-Type"];
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
          var v = e.auth.username || "",
            g = e.auth.password || "";
          u.Authorization = "Basic " + c(v + ":" + g);
        }
        if (
          (p.open(
            e.method.toUpperCase(),
            s(e.url, e.params, e.paramsSerializer),
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
              var o =
                  "getAllResponseHeaders" in p
                    ? n(p.getAllResponseHeaders())
                    : null,
                i = {
                  data:
                    e.responseType && "text" !== e.responseType
                      ? p.response
                      : p.responseText,
                  status: 1223 === p.status ? 204 : p.status,
                  statusText: 1223 === p.status ? "No Content" : p.statusText,
                  headers: o,
                  config: e,
                  request: p,
                };
              a(t, d, i), (p = null);
            }
          }),
          (p.onerror = function () {
            d(l("Network Error", e, null, p)), (p = null);
          }),
          (p.ontimeout = function () {
            d(
              l("timeout of " + e.timeout + "ms exceeded", e, "ECONNABORTED", p)
            ),
              (p = null);
          }),
          i.isStandardBrowserEnv())
        ) {
          var y = o(731),
            b =
              (e.withCredentials || r(e.url)) && e.xsrfCookieName
                ? y.read(e.xsrfCookieName)
                : void 0;
          b && (u[e.xsrfHeaderName] = b);
        }
        if (
          ("setRequestHeader" in p &&
            i.forEach(u, function (e, t) {
              void 0 === m && "content-type" === t.toLowerCase()
                ? delete u[t]
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
              p && (p.abort(), d(e), (p = null));
            }),
          void 0 === m && (m = null),
          p.send(m);
      });
    };
  },
  708: function (e, t, o) {
    "use strict";
    var i = o(726);
    e.exports = function (e, t, o, a, s) {
      var n = new Error(e);
      return i(n, t, o, a, s);
    };
  },
  709: function (e, t, o) {
    "use strict";
    e.exports = function (e) {
      return !(!e || !e.__CANCEL__);
    };
  },
  710: function (e, t, o) {
    "use strict";
    function i(e) {
      this.message = e;
    }
    (i.prototype.toString = function () {
      return "Cancel" + (this.message ? ": " + this.message : "");
    }),
      (i.prototype.__CANCEL__ = !0),
      (e.exports = i);
  },
  713: function (e, t, o) {
    var i = o(685)(o(744), o(745), !1, null, null, null);
    e.exports = i.exports;
  },
  717: function (e, t, o) {
    var i = o(685)(o(718), o(719), !1, null, null, null);
    e.exports = i.exports;
  },
  718: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var i = o(337);
    t.default = {
      mixins: [i.a],
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
          o = e._self._c || t;
        return o(
          "div",
          { staticClass: "am-page-header am-section" },
          [
            o(
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
                o(
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
                    o("div", { staticClass: "am-logo" }, [
                      o("img", {
                        staticClass: "logo-big",
                        attrs: {
                          width: "92",
                          src:
                            e.$root.getUrl +
                            "public/img/amelia-logo-horizontal.svg",
                        },
                      }),
                      e._v(" "),
                      o("img", {
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
                    o("h1", { staticClass: "am-page-title" }, [
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
                        ? o(
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
                        ? o(
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
                        ? o("span", [
                            o("span", { staticClass: "total-number" }, [
                              e._v(e._s(e.employeesTotal)),
                            ]),
                            e._v(
                              " " + e._s(e.$root.labels.total) + "\n        "
                            ),
                          ])
                        : e._e(),
                      e._v(" "),
                      e.customersTotal >= 0
                        ? o("span", [
                            o("span", { staticClass: "total-number" }, [
                              e._v(e._s(e.customersTotal)),
                            ]),
                            e._v(
                              " " + e._s(e.$root.labels.total) + "\n        "
                            ),
                          ])
                        : e._e(),
                      e._v(" "),
                      e.locationsTotal >= 0
                        ? o("span", [
                            o("span", { staticClass: "total-number" }, [
                              e._v(e._s(e.locationsTotal)),
                            ]),
                            e._v(
                              " " + e._s(e.$root.labels.total) + "\n        "
                            ),
                          ])
                        : e._e(),
                      e._v(" "),
                      e.servicesTotal >= 0 && "services" === e.bookableType
                        ? o("span", [
                            o("span", { staticClass: "total-number" }, [
                              e._v(e._s(e.servicesTotal)),
                            ]),
                            e._v(
                              " " + e._s(e.$root.labels.total) + "\n        "
                            ),
                          ])
                        : e._e(),
                      e._v(" "),
                      e.packagesTotal >= 0 && "packages" === e.bookableType
                        ? o("span", [
                            o("span", { staticClass: "total-number" }, [
                              e._v(e._s(e.packagesTotal)),
                            ]),
                            e._v(
                              " " + e._s(e.$root.labels.total) + "\n        "
                            ),
                          ])
                        : e._e(),
                      e._v(" "),
                      e.financeTotal >= 0
                        ? o("span", [
                            o("span", { staticClass: "total-number" }, [
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
                o(
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
                      ? o(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogAppointment },
                          },
                          [
                            o("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            o("span", { staticClass: "button-text" }, [
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
                      ? o(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogEvent },
                          },
                          [
                            o("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            o("span", { staticClass: "button-text" }, [
                              e._v(e._s(e.$root.labels.new_event)),
                            ]),
                          ]
                        )
                      : e._e(),
                    e._v(" "),
                    "wpamelia-employees" === e.$router.currentRoute.name &&
                    !0 === e.$root.settings.capabilities.canWrite &&
                    !0 === e.$root.settings.capabilities.canWriteOthers
                      ? o(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogEmployee },
                          },
                          [
                            o("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            o("span", { staticClass: "button-text" }, [
                              e._v(e._s(e.$root.labels.add_employee)),
                            ]),
                          ]
                        )
                      : e._e(),
                    e._v(" "),
                    "wpamelia-customers" === e.$router.currentRoute.name &&
                    !0 === e.$root.settings.capabilities.canWrite
                      ? o(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogCustomer },
                          },
                          [
                            o("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            o("span", { staticClass: "button-text" }, [
                              e._v(e._s(e.$root.labels.add_customer)),
                            ]),
                          ]
                        )
                      : e._e(),
                    e._v(" "),
                    "wpamelia-locations" === e.$router.currentRoute.name &&
                    !0 === e.$root.settings.capabilities.canWrite
                      ? o(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogLocation },
                          },
                          [
                            o("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            o("span", { staticClass: "button-text" }, [
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
                      ? o(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogService },
                          },
                          [
                            o("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            o("span", { staticClass: "button-text" }, [
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
                      ? o(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogPackage },
                          },
                          [
                            o("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            o("span", { staticClass: "button-text" }, [
                              e._v(e._s(e.$root.labels.add_package)),
                            ]),
                          ]
                        )
                      : e._e(),
                    e._v(" "),
                    o(
                      "transition",
                      { attrs: { name: "fade" } },
                      [
                        "wpamelia-finance" === e.$router.currentRoute.name &&
                        e.addNewCouponBtnDisplay &&
                        !0 === e.$root.settings.capabilities.canWrite
                          ? o(
                              "el-button",
                              {
                                staticClass: "am-dialog-create",
                                attrs: { type: "primary" },
                                on: { click: e.showDialogCoupon },
                              },
                              [
                                o("i", { staticClass: "el-icon-plus" }),
                                e._v(" "),
                                o("span", { staticClass: "button-text" }, [
                                  e._v(e._s(e.$root.labels.new_coupon)),
                                ]),
                              ]
                            )
                          : e._e(),
                      ],
                      1
                    ),
                    e._v(" "),
                    o(
                      "transition",
                      { attrs: { name: "fade" } },
                      [
                        "wpamelia-customize" === e.$router.currentRoute.name &&
                        e.addNewCustomFieldBtnDisplay &&
                        !0 === e.$root.settings.capabilities.canWrite
                          ? o(
                              "el-button",
                              {
                                staticClass: "am-dialog-create",
                                attrs: { type: "primary" },
                                on: { click: e.showDialogCustomFields },
                              },
                              [
                                o("i", { staticClass: "el-icon-plus" }),
                                e._v(" "),
                                o("span", { staticClass: "button-text" }, [
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
                      ? o("div", { staticClass: "v-calendar-column" }, [
                          o(
                            "div",
                            { staticClass: "el-form-item__content" },
                            [
                              o("v-date-picker", {
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
                      ? o(
                          "div",
                          { staticClass: "am-calendar-header-filters" },
                          [
                            o(
                              "el-form",
                              {
                                staticClass: "demo-form-inline",
                                attrs: { inline: !0 },
                              },
                              [
                                o(
                                  "el-form-item",
                                  {
                                    attrs: {
                                      label: e.$root.labels.services + ":",
                                    },
                                  },
                                  [
                                    o(
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
                                        return o(
                                          "div",
                                          { key: t.id },
                                          [
                                            o(
                                              "div",
                                              {
                                                staticClass: "am-drop-parent",
                                                on: {
                                                  click: function (o) {
                                                    return e.selectAllInCategory(
                                                      t.id
                                                    );
                                                  },
                                                },
                                              },
                                              [o("span", [e._v(e._s(t.name))])]
                                            ),
                                            e._v(" "),
                                            e._l(t.serviceList, function (e) {
                                              return o("el-option", {
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
                                o(
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
                                    o(
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
                                        return o("el-option", {
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
                              ? o(
                                  "el-button",
                                  {
                                    staticClass: "am-dialog-create",
                                    attrs: { type: "primary" },
                                    on: { click: e.showDialogAppointment },
                                  },
                                  [
                                    o("i", { staticClass: "el-icon-plus" }),
                                    e._v(" "),
                                    o("span", { staticClass: "button-text" }, [
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
  721: function (e, t, o) {
    e.exports = o(722);
  },
  722: function (e, t, o) {
    "use strict";
    var i = o(688),
      a = o(706),
      s = o(723),
      n = o(697);
    function r(e) {
      var t = new s(e),
        o = a(s.prototype.request, t);
      return i.extend(o, s.prototype, t), i.extend(o, t), o;
    }
    var l = r(n);
    (l.Axios = s),
      (l.create = function (e) {
        return r(i.merge(n, e));
      }),
      (l.Cancel = o(710)),
      (l.CancelToken = o(737)),
      (l.isCancel = o(709)),
      (l.all = function (e) {
        return Promise.all(e);
      }),
      (l.spread = o(738)),
      (e.exports = l),
      (e.exports.default = l);
  },
  723: function (e, t, o) {
    "use strict";
    var i = o(697),
      a = o(688),
      s = o(732),
      n = o(733),
      r = o(735),
      l = o(736);
    function c(e) {
      (this.defaults = e),
        (this.interceptors = { request: new s(), response: new s() });
    }
    (c.prototype.request = function (e) {
      "string" == typeof e &&
        (e = a.merge({ url: arguments[0] }, arguments[1])),
        ((e = a.merge(i, this.defaults, { method: "get" }, e)).method =
          e.method.toLowerCase()),
        e.baseURL && !r(e.url) && (e.url = l(e.baseURL, e.url));
      var t = [n, void 0],
        o = Promise.resolve(e);
      for (
        this.interceptors.request.forEach(function (e) {
          t.unshift(e.fulfilled, e.rejected);
        }),
          this.interceptors.response.forEach(function (e) {
            t.push(e.fulfilled, e.rejected);
          });
        t.length;

      )
        o = o.then(t.shift(), t.shift());
      return o;
    }),
      a.forEach(["delete", "get", "head", "options"], function (e) {
        c.prototype[e] = function (t, o) {
          return this.request(a.merge(o || {}, { method: e, url: t }));
        };
      }),
      a.forEach(["post", "put", "patch"], function (e) {
        c.prototype[e] = function (t, o, i) {
          return this.request(a.merge(i || {}, { method: e, url: t, data: o }));
        };
      }),
      (e.exports = c);
  },
  724: function (e, t, o) {
    "use strict";
    var i = o(688);
    e.exports = function (e, t) {
      i.forEach(e, function (o, i) {
        i !== t &&
          i.toUpperCase() === t.toUpperCase() &&
          ((e[t] = o), delete e[i]);
      });
    };
  },
  725: function (e, t, o) {
    "use strict";
    var i = o(708);
    e.exports = function (e, t, o) {
      var a = o.config.validateStatus;
      o.status && a && !a(o.status)
        ? t(
            i(
              "Request failed with status code " + o.status,
              o.config,
              null,
              o.request,
              o
            )
          )
        : e(o);
    };
  },
  726: function (e, t, o) {
    "use strict";
    e.exports = function (e, t, o, i, a) {
      return (
        (e.config = t), o && (e.code = o), (e.request = i), (e.response = a), e
      );
    };
  },
  727: function (e, t, o) {
    "use strict";
    var i = o(688);
    function a(e) {
      return encodeURIComponent(e)
        .replace(/%40/gi, "@")
        .replace(/%3A/gi, ":")
        .replace(/%24/g, "$")
        .replace(/%2C/gi, ",")
        .replace(/%20/g, "+")
        .replace(/%5B/gi, "[")
        .replace(/%5D/gi, "]");
    }
    e.exports = function (e, t, o) {
      if (!t) return e;
      var s;
      if (o) s = o(t);
      else if (i.isURLSearchParams(t)) s = t.toString();
      else {
        var n = [];
        i.forEach(t, function (e, t) {
          null !== e &&
            void 0 !== e &&
            (i.isArray(e) && (t += "[]"),
            i.isArray(e) || (e = [e]),
            i.forEach(e, function (e) {
              i.isDate(e)
                ? (e = e.toISOString())
                : i.isObject(e) && (e = JSON.stringify(e)),
                n.push(a(t) + "=" + a(e));
            }));
        }),
          (s = n.join("&"));
      }
      return s && (e += (-1 === e.indexOf("?") ? "?" : "&") + s), e;
    };
  },
  728: function (e, t, o) {
    "use strict";
    var i = o(688);
    e.exports = function (e) {
      var t,
        o,
        a,
        s = {};
      return e
        ? (i.forEach(e.split("\n"), function (e) {
            (a = e.indexOf(":")),
              (t = i.trim(e.substr(0, a)).toLowerCase()),
              (o = i.trim(e.substr(a + 1))),
              t && (s[t] = s[t] ? s[t] + ", " + o : o);
          }),
          s)
        : s;
    };
  },
  729: function (e, t, o) {
    "use strict";
    var i = o(688);
    e.exports = i.isStandardBrowserEnv()
      ? (function () {
          var e,
            t = /(msie|trident)/i.test(navigator.userAgent),
            o = document.createElement("a");
          function a(e) {
            var i = e;
            return (
              t && (o.setAttribute("href", i), (i = o.href)),
              o.setAttribute("href", i),
              {
                href: o.href,
                protocol: o.protocol ? o.protocol.replace(/:$/, "") : "",
                host: o.host,
                search: o.search ? o.search.replace(/^\?/, "") : "",
                hash: o.hash ? o.hash.replace(/^#/, "") : "",
                hostname: o.hostname,
                port: o.port,
                pathname:
                  "/" === o.pathname.charAt(0) ? o.pathname : "/" + o.pathname,
              }
            );
          }
          return (
            (e = a(window.location.href)),
            function (t) {
              var o = i.isString(t) ? a(t) : t;
              return o.protocol === e.protocol && o.host === e.host;
            }
          );
        })()
      : function () {
          return !0;
        };
  },
  730: function (e, t, o) {
    "use strict";
    var i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    function a() {
      this.message = "String contains an invalid character";
    }
    (a.prototype = new Error()),
      (a.prototype.code = 5),
      (a.prototype.name = "InvalidCharacterError"),
      (e.exports = function (e) {
        for (
          var t, o, s = String(e), n = "", r = 0, l = i;
          s.charAt(0 | r) || ((l = "="), r % 1);
          n += l.charAt(63 & (t >> (8 - (r % 1) * 8)))
        ) {
          if ((o = s.charCodeAt((r += 0.75))) > 255) throw new a();
          t = (t << 8) | o;
        }
        return n;
      });
  },
  731: function (e, t, o) {
    "use strict";
    var i = o(688);
    e.exports = i.isStandardBrowserEnv()
      ? {
          write: function (e, t, o, a, s, n) {
            var r = [];
            r.push(e + "=" + encodeURIComponent(t)),
              i.isNumber(o) && r.push("expires=" + new Date(o).toGMTString()),
              i.isString(a) && r.push("path=" + a),
              i.isString(s) && r.push("domain=" + s),
              !0 === n && r.push("secure"),
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
  732: function (e, t, o) {
    "use strict";
    var i = o(688);
    function a() {
      this.handlers = [];
    }
    (a.prototype.use = function (e, t) {
      return (
        this.handlers.push({ fulfilled: e, rejected: t }),
        this.handlers.length - 1
      );
    }),
      (a.prototype.eject = function (e) {
        this.handlers[e] && (this.handlers[e] = null);
      }),
      (a.prototype.forEach = function (e) {
        i.forEach(this.handlers, function (t) {
          null !== t && e(t);
        });
      }),
      (e.exports = a);
  },
  733: function (e, t, o) {
    "use strict";
    var i = o(688),
      a = o(734),
      s = o(709),
      n = o(697);
    function r(e) {
      e.cancelToken && e.cancelToken.throwIfRequested();
    }
    e.exports = function (e) {
      return (
        r(e),
        (e.headers = e.headers || {}),
        (e.data = a(e.data, e.headers, e.transformRequest)),
        (e.headers = i.merge(
          e.headers.common || {},
          e.headers[e.method] || {},
          e.headers || {}
        )),
        i.forEach(
          ["delete", "get", "head", "post", "put", "patch", "common"],
          function (t) {
            delete e.headers[t];
          }
        ),
        (e.adapter || n.adapter)(e).then(
          function (t) {
            return (
              r(e), (t.data = a(t.data, t.headers, e.transformResponse)), t
            );
          },
          function (t) {
            return (
              s(t) ||
                (r(e),
                t &&
                  t.response &&
                  (t.response.data = a(
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
  734: function (e, t, o) {
    "use strict";
    var i = o(688);
    e.exports = function (e, t, o) {
      return (
        i.forEach(o, function (o) {
          e = o(e, t);
        }),
        e
      );
    };
  },
  735: function (e, t, o) {
    "use strict";
    e.exports = function (e) {
      return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e);
    };
  },
  736: function (e, t, o) {
    "use strict";
    e.exports = function (e, t) {
      return t ? e.replace(/\/+$/, "") + "/" + t.replace(/^\/+/, "") : e;
    };
  },
  737: function (e, t, o) {
    "use strict";
    var i = o(710);
    function a(e) {
      if ("function" != typeof e)
        throw new TypeError("executor must be a function.");
      var t;
      this.promise = new Promise(function (e) {
        t = e;
      });
      var o = this;
      e(function (e) {
        o.reason || ((o.reason = new i(e)), t(o.reason));
      });
    }
    (a.prototype.throwIfRequested = function () {
      if (this.reason) throw this.reason;
    }),
      (a.source = function () {
        var e;
        return {
          token: new a(function (t) {
            e = t;
          }),
          cancel: e,
        };
      }),
      (e.exports = a);
  },
  738: function (e, t, o) {
    "use strict";
    e.exports = function (e) {
      return function (t) {
        return e.apply(null, t);
      };
    };
  },
  739: function (e, t, o) {
    "use strict";
    var i,
      a = (function () {
        function e(e, t) {
          for (var o = 0; o < t.length; o++) {
            var i = t[o];
            (i.enumerable = i.enumerable || !1),
              (i.configurable = !0),
              "value" in i && (i.writable = !0),
              Object.defineProperty(e, i.key, i);
          }
        }
        return function (t, o, i) {
          return o && e(t.prototype, o), i && e(t, i), t;
        };
      })(),
      s = o(13),
      n = (i = s) && i.__esModule ? i : { default: i };
    e.exports = (function () {
      function e() {
        !(function (e, t) {
          if (!(e instanceof t))
            throw new TypeError("Cannot call a class as a function");
        })(this, e),
          (this.errors = {});
      }
      return (
        a(e, [
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
              e ? n.default.delete(this.errors, e) : (this.errors = {});
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
  740: function (e, t, o) {
    "use strict";
    function i(e) {
      return void 0 === e;
    }
    function a(e) {
      return Array.isArray(e);
    }
    function s(e) {
      return (
        e &&
        "number" == typeof e.size &&
        "string" == typeof e.type &&
        "function" == typeof e.slice
      );
    }
    e.exports = function e(t, o, n, r) {
      if (
        (o instanceof FormData && ((r = n), (n = o), (o = null)),
        ((o = o || {}).indices = !i(o.indices) && o.indices),
        (o.nulls = !!i(o.nulls) || o.nulls),
        (n = n || new FormData()),
        i(t))
      )
        return n;
      if (
        (function (e) {
          return null === e;
        })(t)
      )
        o.nulls && n.append(r, "");
      else if (a(t))
        if (t.length)
          t.forEach(function (t, i) {
            var a = r + "[" + (o.indices ? i : "") + "]";
            e(t, o, n, a);
          });
        else {
          var l = r + "[]";
          n.append(l, "");
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
                s(e) &&
                ("object" == typeof e.lastModifiedDate ||
                  "number" == typeof e.lastModified) &&
                "string" == typeof e.name
              );
            })(t) ||
            s(t)
            ? n.append(r, t)
            : Object.keys(t).forEach(function (i) {
                var s = t[i];
                if (a(s))
                  for (; i.length > 2 && i.lastIndexOf("[]") === i.length - 2; )
                    i = i.substring(0, i.length - 2);
                e(s, o, n, r ? r + "[" + i + "]" : i);
              })
          : n.append(r, t.toISOString());
      return n;
    };
  },
  741: function (e, t, o) {
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
  744: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var i = o(702),
      a = o.n(i),
      s = o(691),
      n = o(337),
      r = o(701),
      l = o(741);
    t.default = {
      mixins: [s.a, n.a, r.a, l.a],
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
          form: new a.a(),
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
            o = this.$root;
          this.$parent.$refs[this.formName].validate(function (i, a) {
            if (!i)
              return (
                "appointment" === t.formName &&
                  t.handleAppointmentDialogTabChange(a),
                t.$emit("validationFailCallback"),
                !1
              );
            (t.dialogLoading = !0),
              t.isNew ? t.addEntity(e) : t.editEntity(e),
              (t.$root = o);
          });
        },
        onSuccess: function (e, t, o) {
          var i = this;
          this.$parent.$emit("saveCallback", o),
            setTimeout(function () {
              (i.dialogLoading = !1), i.$parent.$emit("closeDialog");
            }, 300),
            this.notify(e, t, "success");
        },
        onError: function (e, t) {
          (this.dialogLoading = !1), this.$emit("errorCallback", t);
        },
        addEntity: function (e) {
          var t = this,
            o = null;
          void 0 !== this.$store &&
            void 0 !== this.$store.state.cabinet &&
            "provider" === this.$store.state.cabinet.cabinetType &&
            (o = Object.assign(this.getAuthorizationHeaderObject(), {
              params: {
                source: "cabinet-" + this.$store.state.cabinet.cabinetType,
              },
            })),
            this.$http
              .post(
                this.$root.getAjaxUrl + "/" + this.urlName,
                this.getParsedEntity(e),
                o
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
            o = null;
          void 0 !== this.$store &&
            void 0 !== this.$store.state.cabinet &&
            "provider" === this.$store.state.cabinet.cabinetType &&
            (o = Object.assign(this.getAuthorizationHeaderObject(), {
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
                o
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
          for (var t = Object.keys(e), o = 0, i = 0; i < t.length; i++)
            o = t[i].startsWith("bookings.") ? o + 1 : o;
          o === t.length && this.$emit("validationBookingsFailCallback");
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
          o = e._self._c || t;
        return o("div", [
          o("div", { staticClass: "am-dialog-footer" }, [
            o(
              "div",
              { staticClass: "am-dialog-footer-actions" },
              [
                o("transition", { attrs: { name: "slide-vertical" } }, [
                  o(
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
                      o(
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
                        ? o("el-alert", {
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
                        ? o(
                            "div",
                            { staticClass: "align-left" },
                            [
                              o(
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
                              o(
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
                        : o(
                            "div",
                            { staticClass: "align-left" },
                            [
                              e.allowedDelete
                                ? o(
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
                                ? o(
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
                                : o(
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
                o("transition", { attrs: { name: "slide-vertical" } }, [
                  e.status
                    ? o(
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
                            ? o("h3", [e._v(e._s(e.message.confirm.hide))])
                            : e.isStatusOff()
                            ? o("h3", [e._v(e._s(e.message.confirm.show))])
                            : e._e(),
                          e._v(" "),
                          e.hasApplyGloballyVisibility
                            ? o(
                                "div",
                                { staticClass: "align-left" },
                                [
                                  e.isStatusOn()
                                    ? o(
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
                                    ? o(
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
                                    ? o(
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
                                    ? o(
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
                            : o(
                                "div",
                                { staticClass: "align-left" },
                                [
                                  o(
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
                                    ? o(
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
                                    ? o(
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
                o("transition", { attrs: { name: "slide-vertical" } }, [
                  o(
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
                      o("h3", [e._v(e._s(e.message.confirm.duplicate))]),
                      e._v(" "),
                      o(
                        "div",
                        { staticClass: "align-left" },
                        [
                          o(
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
                          o(
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
                o("transition", { attrs: { name: "slide-vertical" } }, [
                  o(
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
                        ? o("h3", [e._v(e._s(e.message.confirm.save))])
                        : e._e(),
                      e._v(" "),
                      e.buttonText
                        ? o(
                            "div",
                            { staticClass: "align-left" },
                            [
                              o(
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
                              o(
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
                        ? o("el-alert", {
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
                  ? o(
                      "el-row",
                      [
                        o(
                          "el-col",
                          { staticClass: "align-right", attrs: { sm: 24 } },
                          [
                            o(
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
                              ? o(
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
                  : o(
                      "el-row",
                      [
                        o(
                          "el-col",
                          { staticClass: "align-left", attrs: { sm: 16 } },
                          [
                            e.action.haveDuplicate
                              ? o(
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
                                      ? o("img", {
                                          staticClass: "svg",
                                          attrs: {
                                            alt: e.$root.labels.duplicate,
                                            src:
                                              e.$root.getUrl +
                                              "public/img/copy.svg",
                                          },
                                        })
                                      : o("span", [
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
                              ? o(
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
                                      ? o("img", {
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
                                      : o("span", [
                                          e._v(
                                            e._s(e.getActionStatusButtonText())
                                          ),
                                        ]),
                                  ]
                                )
                              : e._e(),
                            e._v(" "),
                            e.action.haveRemove
                              ? o(
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
                                      ? o("img", {
                                          staticClass: "svg",
                                          attrs: {
                                            alt: e.$root.labels.delete,
                                            src:
                                              e.$root.getUrl +
                                              "public/img/delete.svg",
                                          },
                                        })
                                      : o("span", [
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
                        o(
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
                              ? o(
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
          o(
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
              o("div", { staticClass: "am-dialog-loader-content" }, [
                o("img", {
                  attrs: { src: e.$root.getUrl + "public/img/spinner.svg" },
                }),
                e._v(" "),
                o("p", [e._v(e._s(e.$root.labels.loader_message))]),
              ]),
            ]
          ),
        ]);
      },
      staticRenderFns: [],
    };
  },
  755: function (e, t, o) {
    var i;
    (i = function () {
      return (function (e) {
        function t(i) {
          if (o[i]) return o[i].exports;
          var a = (o[i] = { i: i, l: !1, exports: {} });
          return e[i].call(a.exports, a, a.exports, t), (a.l = !0), a.exports;
        }
        var o = {};
        return (
          (t.m = e),
          (t.c = o),
          (t.i = function (e) {
            return e;
          }),
          (t.d = function (e, o, i) {
            t.o(e, o) ||
              Object.defineProperty(e, o, {
                configurable: !1,
                enumerable: !0,
                get: i,
              });
          }),
          (t.n = function (e) {
            var o =
              e && e.__esModule
                ? function () {
                    return e.default;
                  }
                : function () {
                    return e;
                  };
            return t.d(o, "a", o), o;
          }),
          (t.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t);
          }),
          (t.p = "."),
          t((t.s = 9))
        );
      })([
        function (e, t, o) {
          "use strict";
          t.a = {
            prefix: "",
            suffix: "",
            thousands: ",",
            decimal: ".",
            precision: 2,
          };
        },
        function (e, t, o) {
          "use strict";
          var i = o(2),
            a = o(5),
            s = o(0);
          t.a = function (e, t) {
            if (t.value) {
              var n = o.i(a.a)(s.a, t.value);
              if ("INPUT" !== e.tagName.toLocaleUpperCase()) {
                var r = e.getElementsByTagName("input");
                1 !== r.length || (e = r[0]);
              }
              (e.oninput = function () {
                var t = e.value.length - e.selectionEnd;
                (e.value = o.i(i.a)(e.value, n)),
                  (t = Math.max(t, n.suffix.length)),
                  (t = e.value.length - t),
                  (t = Math.max(t, n.prefix.length + 1)),
                  o.i(i.b)(e, t),
                  e.dispatchEvent(o.i(i.c)("change"));
              }),
                (e.onfocus = function () {
                  o.i(i.b)(e, e.value.length - n.suffix.length);
                }),
                e.oninput(),
                e.dispatchEvent(o.i(i.c)("input"));
            }
          };
        },
        function (e, t, o) {
          "use strict";
          function i(e) {
            var t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : m.a;
            "number" == typeof e && (e = e.toFixed(n(t.precision)));
            var o = e.indexOf("-") >= 0 ? "-" : "",
              i = l(r(s(e), t.precision)).split("."),
              a = i[0],
              c = i[1];
            return (
              (a = (function (e, t) {
                return e.replace(/(\d)(?=(?:\d{3})+\b)/gm, "$1" + t);
              })(a, t.thousands)),
              t.prefix +
                o +
                (function (e, t, o) {
                  return t ? e + o + t : e;
                })(a, c, t.decimal) +
                t.suffix
            );
          }
          function a(e, t) {
            var o = e.indexOf("-") >= 0 ? -1 : 1,
              i = r(s(e), t);
            return parseFloat(i) * o;
          }
          function s(e) {
            return l(e).replace(/\D+/g, "") || "0";
          }
          function n(e) {
            return (function (e, t, o) {
              return Math.max(e, Math.min(t, o));
            })(0, e, 20);
          }
          function r(e, t) {
            var o = Math.pow(10, t);
            return (parseFloat(e) / o).toFixed(n(t));
          }
          function l(e) {
            return e ? e.toString() : "";
          }
          function c(e, t) {
            var o = function () {
              e.setSelectionRange(t, t);
            };
            e === document.activeElement && (o(), setTimeout(o, 1));
          }
          function d(e) {
            var t = document.createEvent("Event");
            return t.initEvent(e, !0, !0), t;
          }
          var m = o(0);
          o.d(t, "a", function () {
            return i;
          }),
            o.d(t, "d", function () {
              return a;
            }),
            o.d(t, "b", function () {
              return c;
            }),
            o.d(t, "c", function () {
              return d;
            });
        },
        function (e, t, o) {
          "use strict";
          function i(e, t) {
            t &&
              Object.keys(t).map(function (e) {
                r.a[e] = t[e];
              }),
              e.directive("money", n.a),
              e.component("money", s.a);
          }
          Object.defineProperty(t, "__esModule", { value: !0 });
          var a = o(6),
            s = o.n(a),
            n = o(1),
            r = o(0);
          o.d(t, "Money", function () {
            return s.a;
          }),
            o.d(t, "VMoney", function () {
              return n.a;
            }),
            o.d(t, "options", function () {
              return r.a;
            }),
            o.d(t, "VERSION", function () {
              return l;
            });
          var l = "0.8.1";
          (t.default = i),
            "undefined" != typeof window && window.Vue && window.Vue.use(i);
        },
        function (e, t, o) {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
          var i = o(1),
            a = o(0),
            s = o(2);
          t.default = {
            name: "Money",
            props: {
              value: { required: !0, type: [Number, String], default: 0 },
              masked: { type: Boolean, default: !1 },
              precision: {
                type: Number,
                default: function () {
                  return a.a.precision;
                },
              },
              decimal: {
                type: String,
                default: function () {
                  return a.a.decimal;
                },
              },
              thousands: {
                type: String,
                default: function () {
                  return a.a.thousands;
                },
              },
              prefix: {
                type: String,
                default: function () {
                  return a.a.prefix;
                },
              },
              suffix: {
                type: String,
                default: function () {
                  return a.a.suffix;
                },
              },
            },
            directives: { money: i.a },
            data: function () {
              return { formattedValue: "" };
            },
            watch: {
              value: {
                immediate: !0,
                handler: function (e, t) {
                  var i = o.i(s.a)(e, this.$props);
                  i !== this.formattedValue && (this.formattedValue = i);
                },
              },
            },
            methods: {
              change: function (e) {
                this.$emit(
                  "input",
                  this.masked
                    ? e.target.value
                    : o.i(s.d)(e.target.value, this.precision)
                );
              },
            },
          };
        },
        function (e, t, o) {
          "use strict";
          t.a = function (e, t) {
            return (
              (e = e || {}),
              (t = t || {}),
              Object.keys(e)
                .concat(Object.keys(t))
                .reduce(function (o, i) {
                  return (o[i] = void 0 === t[i] ? e[i] : t[i]), o;
                }, {})
            );
          };
        },
        function (e, t, o) {
          var i = o(7)(o(4), o(8), null, null);
          e.exports = i.exports;
        },
        function (e, t) {
          e.exports = function (e, t, o, i) {
            var a,
              s = (e = e || {}),
              n = typeof e.default;
            ("object" !== n && "function" !== n) || ((a = e), (s = e.default));
            var r = "function" == typeof s ? s.options : s;
            if (
              (t &&
                ((r.render = t.render),
                (r.staticRenderFns = t.staticRenderFns)),
              o && (r._scopeId = o),
              i)
            ) {
              var l = r.computed || (r.computed = {});
              Object.keys(i).forEach(function (e) {
                var t = i[e];
                l[e] = function () {
                  return t;
                };
              });
            }
            return { esModule: a, exports: s, options: r };
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
        function (e, t, o) {
          e.exports = o(3);
        },
      ]);
    }),
      (e.exports = i());
  },
  790: function (e, t, o) {
    var i = o(685)(o(793), o(794), !1, null, null, null);
    e.exports = i.exports;
  },
  792: function (e, t, o) {
    var i = o(685)(o(795), o(796), !1, null, null, null);
    e.exports = i.exports;
  },
  793: function (e, t, o) {
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
          o = e._self._c || t;
        return o(
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
            o(
              "el-row",
              [
                o("el-col", { attrs: { sm: 8 } }, [
                  o("p", [e._v(e._s(e.paginationMessage))]),
                ]),
                e._v(" "),
                o(
                  "el-col",
                  { attrs: { sm: 16 } },
                  [
                    o("el-pagination", {
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
  795: function (e, t, o) {
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
                  var o = null;
                  e.state()
                    .get("selection")
                    .forEach(function (e) {
                      (o = e.toJSON()),
                        (t.pictureFullPath = o.url),
                        (t.pictureThumbPath = o.sizes.thumbnail
                          ? o.sizes.thumbnail.url
                          : o.url),
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
          o = e._self._c || t;
        return o(
          "div",
          { staticClass: "am-profile-photo", on: { click: e.openMediaModal } },
          [
            o("i", {
              class: {
                "el-icon-plus": "gallery" === e.entityName,
                "el-icon-picture": "gallery" !== e.entityName,
              },
            }),
            e._v(" "),
            "gallery" === e.entityName
              ? o("span", [e._v(e._s(e.$root.labels.add_image))])
              : e._e(),
            e._v(" "),
            "gallery" !== e.entityName
              ? o("img", { attrs: { src: e.getPictureSrc, alt: "" } })
              : e._e(),
          ]
        );
      },
      staticRenderFns: [],
    };
  },
  833: function (e, t, o) {
    "use strict";
    t.a = {
      data: function () {
        return { count: { success: 0, error: 0 } };
      },
      methods: {
        deleteEntities: function (e, t, o, i) {
          var a = this;
          e.forEach(function (s) {
            a.$http
              .post(a.$root.getAjaxUrl + "/" + a.name + "/delete/" + s)
              .then(function () {
                a.deleteEntityResult(e, !0, t), o(s);
              })
              .catch(function () {
                a.deleteEntityResult(e, !1, t), i(s);
              });
          });
        },
        deleteEntityResult: function (e, t, o) {
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
              o());
        },
      },
    };
  },
  883: function (e, t, o) {
    "use strict";
    t.a = {
      data: function () {
        return {};
      },
      methods: {
        handleCheckAll: function (e, t, o) {
          var i = void 0 !== o ? o : t.allChecked;
          return (
            e.forEach(function (e) {
              e.checked = i;
            }),
            (t.allChecked = i),
            (t.toaster = i),
            t
          );
        },
        handleCheckSingle: function (e, t) {
          var o = 0;
          return (
            e.forEach(function (e) {
              e.checked && o++;
            }),
            (t.allChecked = o === e.length),
            (t.toaster = 0 !== o),
            t
          );
        },
      },
    };
  },
  906: function (e, t, o) {
    var i = o(685)(o(917), o(918), !1, null, null, null);
    e.exports = i.exports;
  },
  907: function (e, t, o) {
    var i = o(685)(o(919), o(921), !1, null, null, null);
    e.exports = i.exports;
  },
  908: function (e, t, o) {
    "use strict";
    var i = o(692);
    t.a = {
      mixins: [i.a],
      methods: {
        getEmployeeActivityLabel: function (e) {
          switch (e) {
            case "available":
              return this.$root.labels.available;
            case "away":
              return this.$root.labels.away;
            case "break":
              return this.$root.labels.break;
            case "busy":
              return this.$root.labels.busy;
            case "dayoff":
              return this.$root.labels.dayoff;
          }
        },
        //P2P: Format hour to 12AM/PM
        format12Hours: function(time) {
          time = time.substr(0,5);
          var number = parseInt(time.substr(0,2), 10);
          if (number <= 12) {
            return number === 12 ? `${time} PM` : `${time} AM`;
          }
          number -= 12;
          var strNumber = number >= 10 ? `${number}` : `0${number}`;
          return `${strNumber}${time.substr(2)} PM`;
        },
        getParsedEditCategorizedServiceList: function (e, t) {
          var o = [];
          return (
            t.forEach(function (t) {
              var i = [];
              t.serviceList
                .filter(function (t) {
                  return (
                    "visible" === t.status ||
                    ("hidden" === t.status &&
                      -1 !==
                        e.serviceList
                          .map(function (e) {
                            return e.id;
                          })
                          .indexOf(t.id))
                  );
                })
                .forEach(function (t) {
                  var o = null;
                  if (
                    (e &&
                      e.serviceList.forEach(function (e) {
                        e.id === t.id &&
                          ((o = Object.assign({}, e)).state = !0);
                      }),
                    o)
                  )
                    i.push(o);
                  else {
                    var a = Object.assign({}, t);
                    (a.state = !1), i.push(a);
                  }
                }),
                o.push({ id: t.id, name: t.name, serviceList: i });
            }),
            o
          );
        },
        getParsedServiceList: function (e) {
          var t = [];
          return (
            e.forEach(function (e) {
              e.serviceList.forEach(function (e) {
                e.state && t.push(Object.assign({}, e));
              });
            }),
            t
          );
        },
        //P2P add formatTime property
        getParsedEditWeekDayList: function (e) {
          for (
            var t = [],
              o = this,
              i = [
                this.$root.labels.weekday_monday,
                this.$root.labels.weekday_tuesday,
                this.$root.labels.weekday_wednesday,
                this.$root.labels.weekday_thursday,
                this.$root.labels.weekday_friday,
                this.$root.labels.weekday_saturday,
                this.$root.labels.weekday_sunday,
              ],
              a = 0;
            a < 7;
            a++
          )
            t.push({
              id: null,
              form: {
                type: null,
                isNew: null,
                index: null,
                show: !1,
                data: {},
              },
              day: i[a],
              time: [],
              breaks: [],
              periods: [],
            });
          return (
            e &&
              e.weekDayList.forEach(function (e) {
                var a = e.dayIndex - 1;
                e.timeOutList.forEach(function (e) {
                  t[a].breaks.push({
                    id: e.id,
                    time: [
                      e.startTime.substring(0, e.startTime.length - 3),
                      e.endTime.substring(0, e.endTime.length - 3),
                    ],
                    formatTime: [
                      i.format12Hours(e.startTime),
                      i.format12Hours(e.endTime),
                    ],
                  });
                }),
                  (t[a].periods = o.getParsedWeekDayPeriods(e)),
                  (t[a].time = [
                    e.startTime.substring(0, e.startTime.length - 3),
                    e.endTime.substring(0, e.endTime.length - 3),
                  ]),
                  (t[a].day = i[e.dayIndex - 1]),
                  (t[a].id = e.id);
              }),
            t
          );
        },
        //P2P add formatTime property
        getParsedWeekDayPeriods: function (e) {
          var t = [];
          var _this = this;
          return (
            e.periodList.forEach(function (e) {
              t.push({
                time: [
                  e.startTime.substring(0, e.startTime.length - 3),
                  e.endTime.substring(0, e.endTime.length - 3),
                ],
                formatTime: [
                  _this.format12Hours(e.startTime),
                  _this.format12Hours(e.endTime),
                ],
                id: e.id,
                serviceIds: e.periodServiceList.map(function (e) {
                  return e.serviceId;
                }),
                locationId: e.locationId,
                periodServiceList: e.periodServiceList,
                savedPeriodServiceList: JSON.parse(
                  JSON.stringify(e.periodServiceList)
                ),
              });
            }),
            !t.length &&
              e.startTime &&
              e.endTime &&
              t.push({
                time: [
                  e.startTime.substring(0, e.startTime.length - 3),
                  e.endTime.substring(0, e.endTime.length - 3),
                ],
                formatTime: [
                  _this.format12Hours(e.startTime),
                  _this.format12Hours(e.endTime),
                ],
                id: null,
                serviceIds: [],
                locationId: null,
                periodServiceList: [],
                savedPeriodServiceList: [],
              }),
            t
          );
        },
        getParsedWeekDayList: function (e) {
          var t = [],
            o = this;
          return (
            e.forEach(function (e, i) {
              var a = [];
              e.breaks.forEach(function (e) {
                e.time &&
                  e.time.length &&
                  e.time[0] &&
                  e.time[1] &&
                  a.push({
                    id: e.id,
                    startTime: e.time[0] + ":00",
                    endTime: e.time[1] + ":00",
                  });
              });
              var s = [],
                n = 86400,
                r = 0;
              e.periods.forEach(function (e) {
                if (e.time && e.time.length && e.time[0] && e.time[1]) {
                  var t = o.getStringTimeInSeconds(e.time[0]),
                    i = o.getStringTimeInSeconds(e.time[1]);
                  (n = t < n ? t : n), (r = i > r ? i : r);
                  var a = [];
                  e.serviceIds.forEach(function (t) {
                    var o = e.periodServiceList.find(function (e) {
                      return e.serviceId === t;
                    });
                    a.push({ id: o ? o.id : null, serviceId: t });
                  }),
                    s.push({
                      id: e.id,
                      startTime: e.time[0] + ":00",
                      endTime: e.time[1] + ":00",
                      locationId: e.locationId,
                      periodServiceList: a,
                    });
                }
              }),
                s.length &&
                  t.push({
                    id: e.id,
                    dayIndex: i + 1,
                    startTime: o.secondsToTimeSelectStep(n) + ":00",
                    endTime: o.secondsToTimeSelectStep(r) + ":00",
                    timeOutList: a,
                    periodList: s,
                  });
            }),
            t
          );
        },
      },
    };
  },
  917: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var i = o(337),
      a = o(687),
      s = o(695);
    t.default = {
      mixins: [a.a, i.a, s.a],
      props: {
        daysOff: { type: Array },
        listedDaysOff: {
          default: function () {
            return [];
          },
          type: Array,
        },
        allowEditCompanyDaysOff: { type: Boolean, default: !0, required: !1 },
        isCabinet: { type: Boolean, default: !1, required: !1 },
      },
      data: function () {
        return {
          editedDayOffIndex: -1,
          filterDate: this.$moment(),
          model: {
            dayOffDates: null,
            dayOffId: 0,
            dayOffName: "",
            dayOffRepeat: 0,
          },
          rules: {
            dayOffName: [
              {
                required: !0,
                message: this.$root.labels.days_off_name_warning,
                trigger: "submit",
              },
            ],
            dayOffDates: [
              {
                required: !0,
                message: this.$root.labels.days_off_date_warning,
                trigger: "submit",
              },
            ],
          },
          settings: this.daysOff.slice(0),
          showDayOffForm: !1,
          yearDaysOff: [],
          yearListedDaysOff: [],
        };
      },
      mounted: function () {
        this.filterDaysOff();
      },
      methods: {
        editDayOff: function (e) {
          (this.model.dayOffId = e.hasOwnProperty("id") ? e.id : 0),
            (this.model.dayOffName = e.name),
            (this.model.dayOffDates = {
              start: this.$moment(e.startDate, "YYYY-MM-DD").toDate(),
              end: this.$moment(e.endDate, "YYYY-MM-DD").toDate(),
            }),
            (this.model.dayOffRepeat = e.repeat),
            (this.showDayOffForm = !0),
            (this.editedDayOffIndex = this.settings.indexOf(e));
        },
        addDayOff: function () {
          (this.editedDayOffIndex = -1),
            (this.model.dayOffId = 0),
            (this.model.dayOffName = ""),
            (this.model.dayOffRepeat = 0),
            (this.model.dayOffDates = null),
            (this.showDayOffForm = !0);
        },
        saveDayOff: function () {
          var e = this;
          this.$refs.model.validate(function (t) {
            if (!t) return !1;
            -1 !== e.editedDayOffIndex
              ? e.settings.splice(e.editedDayOffIndex, 1, e.dayOff)
              : e.settings.push(e.dayOff),
              e.$refs.model.clearValidate(),
              (e.showDayOffForm = !1),
              (e.filterDate = e
                .$moment(e.dayOff.startDate, "YYYY-MM-DD")
                .toDate()),
              e.filterDaysOff(),
              e.$emit("changeDaysOff", e.settings);
          });
        },
        deleteDayOff: function (e) {
          var t = this.settings.indexOf(e);
          this.settings.splice(t, 1),
            this.filterDaysOff(),
            this.$emit("changeDaysOff", this.settings);
        },
        filter: function (e) {
          var t = this,
            o = e.filter(function (e) {
              return (
                t.$moment(e.startDate, "YYYY-MM-DD").year() === t.filterYear &&
                !e.repeat
              );
            }),
            i = e.filter(function (e) {
              return e.repeat;
            });
          return (
            i.forEach(function (e, o) {
              t.$moment(e.startDate, "YYYY-MM-DD").year() ===
              t.$moment(e.endDate, "YYYY-MM-DD").year()
                ? (i[o].endDate = t
                    .$moment(e.endDate, "YYYY-MM-DD")
                    .year(t.filterYear)
                    .format("YYYY-MM-DD"))
                : (i[o].endDate = t
                    .$moment(e.endDate, "YYYY-MM-DD")
                    .year(t.filterYear + 1)
                    .format("YYYY-MM-DD")),
                (i[o].startDate = t
                  .$moment(e.startDate, "YYYY-MM-DD")
                  .year(t.filterYear)
                  .format("YYYY-MM-DD"));
            }),
            i.concat(o).sort(function (e, o) {
              return t.$moment(e.startDate).diff(o.startDate);
            })
          );
        },
        editCompanyDaysOffSettings: function () {
          this.$emit("showCompanyDaysOffSettingsDialog");
        },
        filterDaysOff: function () {
          (this.yearDaysOff = this.filter(this.settings)),
            (this.yearListedDaysOff = this.filter(this.listedDaysOff));
        },
      },
      computed: {
        filterYear: function () {
          return this.$moment(this.filterDate, "YYYY-MM-DD").year();
        },
        dayOff: function () {
          return {
            id: this.model.dayOffId,
            name: this.model.dayOffName,
            startDate: this.$moment(this.model.dayOffDates.start).format(
              "YYYY-MM-DD"
            ),
            endDate: this.$moment(this.model.dayOffDates.end).format(
              "YYYY-MM-DD"
            ),
            repeat: this.model.dayOffRepeat,
          };
        },
      },
      watch: {
        settings: function () {
          this.yearDaysOff = this.filter(this.settings);
        },
        listedDaysOff: function () {
          this.yearListedDaysOff = this.filter(this.listedDaysOff);
        },
      },
    };
  },
  918: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          o = e._self._c || t;
        return o("div", { staticClass: "am-days-off" }, [
          o(
            "div",
            { staticClass: "am-dialog-table" },
            [
              o(
                "el-row",
                {
                  staticStyle: { "flex-wrap": "wrap" },
                  attrs: { gutter: 20, type: "flex", align: "middle" },
                },
                [
                  o(
                    "el-col",
                    { staticClass: "am-days-off__header" },
                    [
                      o("el-date-picker", {
                        attrs: {
                          type: "year",
                          clearable: !1,
                          placeholder: e.$root.labels.pick_a_year,
                        },
                        on: { change: e.filterDaysOff },
                        model: {
                          value: e.filterDate,
                          callback: function (t) {
                            e.filterDate = t;
                          },
                          expression: "filterDate",
                        },
                      }),
                      e._v(" "),
                      o("div", { staticClass: "am-days-off__legend" }, [
                        o("div", { staticClass: "am-legend-repeat" }, [
                          o("span", { staticClass: "type repeat" }),
                          e._v(e._s(e.$root.labels.repeat_every_year)),
                        ]),
                        e._v(" "),
                        o("div", { staticClass: "am-legend-once" }, [
                          o("span", { staticClass: "type once" }),
                          e._v(e._s(e.$root.labels.once_off)),
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
          ),
          e._v(" "),
          o(
            "div",
            { staticClass: "am-employee-days-off" },
            [
              o(
                "div",
                { staticClass: "am-dialog-table" },
                [
                  e.listedDaysOff.length > 0
                    ? o("h4", [e._v(e._s(e.$root.labels.employee_days_off))])
                    : e._e(),
                  e._v(" "),
                  o(
                    "el-row",
                    {
                      staticClass: "am-dialog-table-head days",
                      attrs: { gutter: 20 },
                    },
                    [
                      o("el-col", { attrs: { span: 12 } }, [
                        o("span", [e._v(e._s(e.$root.labels.date))]),
                      ]),
                      e._v(" "),
                      o("el-col", { attrs: { span: 12 } }, [
                        o("span", [e._v(e._s(e.$root.labels.day_off_name))]),
                      ]),
                    ],
                    1
                  ),
                  e._v(" "),
                  e._l(e.yearDaysOff, function (t, i) {
                    return o(
                      "el-row",
                      {
                        key: i,
                        staticClass: "am-day-off",
                        staticStyle: { "flex-wrap": "wrap" },
                        attrs: { gutter: 20, type: "flex", align: "middle" },
                      },
                      [
                        o(
                          "el-col",
                          { attrs: { xs: 12, sm: 12, md: 12 } },
                          [
                            o("span", {
                              staticClass: "type",
                              class: { repeat: t.repeat, once: !t.repeat },
                            }),
                            e._v(" "),
                            o(
                              "el-tooltip",
                              {
                                attrs: {
                                  effect: "dark",
                                  content:
                                    t.startDate === t.endDate
                                      ? e.getFrontedFormattedDate(t.startDate)
                                      : e.getFrontedFormattedDate(t.startDate) +
                                        " - " +
                                        e.getFrontedFormattedDate(t.endDate),
                                  placement: "top-start",
                                },
                              },
                              [
                                o("span", [
                                  e._v(
                                    "\n              " +
                                      e._s(
                                        t.startDate === t.endDate
                                          ? e.getFrontedFormattedDate(
                                              t.startDate
                                            )
                                          : e.getFrontedFormattedDate(
                                              t.startDate
                                            ) +
                                              " - " +
                                              e.getFrontedFormattedDate(
                                                t.endDate
                                              )
                                      ) +
                                      "\n            "
                                  ),
                                ]),
                              ]
                            ),
                          ],
                          1
                        ),
                        e._v(" "),
                        o(
                          "el-col",
                          {
                            staticClass: "am-day-off__name-column",
                            attrs: { xs: 12, sm: 12, md: 8 },
                          },
                          [
                            o("span", { attrs: { title: t.name } }, [
                              e._v(e._s(t.name)),
                            ]),
                          ]
                        ),
                        e._v(" "),
                        o(
                          "el-col",
                          {
                            staticClass: "align-right",
                            attrs: { xs: 24, sm: 24, md: 4 },
                          },
                          [
                            o(
                              "div",
                              {
                                staticClass: "am-edit-element",
                                on: {
                                  click: function (o) {
                                    return e.editDayOff(t);
                                  },
                                },
                              },
                              [
                                o("img", {
                                  attrs: {
                                    src:
                                      e.$root.getUrl +
                                      "public/img/edit-pen.svg",
                                  },
                                }),
                              ]
                            ),
                            e._v(" "),
                            o(
                              "div",
                              {
                                staticClass: "am-delete-element",
                                on: {
                                  click: function (o) {
                                    return e.deleteDayOff(t);
                                  },
                                },
                              },
                              [o("i", { staticClass: "el-icon-minus" })]
                            ),
                          ]
                        ),
                      ],
                      1
                    );
                  }),
                  e._v(" "),
                  o(
                    "el-row",
                    [
                      o("el-col", [
                        o(
                          "div",
                          {
                            staticClass: "am-add-element",
                            on: { click: e.addDayOff },
                          },
                          [
                            o("i", { staticClass: "el-icon-plus" }),
                            o("span", { staticClass: "am-add-day-off" }, [
                              e._v(e._s(e.$root.labels.add_day_off)),
                            ]),
                          ]
                        ),
                      ]),
                    ],
                    1
                  ),
                ],
                2
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
                        value: e.showDayOffForm,
                        expression: "showDayOffForm",
                      },
                    ],
                    staticClass: "am-day-off-add",
                  },
                  [
                    o(
                      "el-form",
                      {
                        ref: "model",
                        attrs: {
                          model: e.model,
                          rules: e.rules,
                          "label-position": "top",
                        },
                        on: {
                          submit: function (t) {
                            return t.preventDefault(), e.saveDayOff(t);
                          },
                        },
                      },
                      [
                        o(
                          "el-form-item",
                          {
                            attrs: {
                              label: e.$root.labels.day_off_name + ":",
                              prop: "dayOffName",
                            },
                          },
                          [
                            o("el-input", {
                              attrs: {
                                "auto-complete": "off",
                                placeholder:
                                  e.$root.labels.add_day_off_placeholder,
                              },
                              model: {
                                value: e.model.dayOffName,
                                callback: function (t) {
                                  e.$set(e.model, "dayOffName", t);
                                },
                                expression: "model.dayOffName",
                              },
                            }),
                          ],
                          1
                        ),
                        e._v(" "),
                        o(
                          "el-row",
                          { attrs: { gutter: 20 } },
                          [
                            o(
                              "el-col",
                              {
                                staticClass: "v-calendar-column",
                                attrs: { sm: 24 },
                              },
                              [
                                o(
                                  "el-form-item",
                                  {
                                    attrs: {
                                      label: e.$root.labels.date + ":",
                                      prop: "dayOffDates",
                                    },
                                  },
                                  [
                                    o("v-date-picker", {
                                      attrs: {
                                        mode: "range",
                                        "popover-visibility": "focus",
                                        "popover-direction": "top",
                                        "popover-align":
                                          e.screenWidth < 768
                                            ? "center"
                                            : "left",
                                        "tint-color": e.isCabinet
                                          ? e.$root.settings.customization
                                              .primaryColor
                                          : "#1A84EE",
                                        "show-day-popover": !1,
                                        "input-props": {
                                          class: "el-input__inner",
                                        },
                                        "is-expanded": !1,
                                        "is-required": !0,
                                        "input-class": "el-input__inner",
                                        placeholder:
                                          e.$root.labels.pick_a_date_or_range,
                                        formats: e.vCalendarFormats,
                                      },
                                      model: {
                                        value: e.model.dayOffDates,
                                        callback: function (t) {
                                          e.$set(e.model, "dayOffDates", t);
                                        },
                                        expression: "model.dayOffDates",
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
                          "el-row",
                          { attrs: { gutter: 20 } },
                          [
                            o(
                              "el-col",
                              { attrs: { sm: 12 } },
                              [
                                o(
                                  "el-checkbox",
                                  {
                                    staticClass: "am-semi-strong",
                                    model: {
                                      value: e.model.dayOffRepeat,
                                      callback: function (t) {
                                        e.$set(e.model, "dayOffRepeat", t);
                                      },
                                      expression: "model.dayOffRepeat",
                                    },
                                  },
                                  [
                                    e._v(
                                      "\n                " +
                                        e._s(
                                          e.$root.labels.days_off_repeat_yearly
                                        ) +
                                        "\n              "
                                    ),
                                  ]
                                ),
                              ],
                              1
                            ),
                            e._v(" "),
                            o(
                              "el-col",
                              {
                                staticClass:
                                  "align-right am-day-off-add-buttons",
                                attrs: { sm: 12 },
                              },
                              [
                                o(
                                  "el-button",
                                  {
                                    attrs: { size: "small" },
                                    on: {
                                      click: function (t) {
                                        e.showDayOffForm = !e.showDayOffForm;
                                      },
                                    },
                                  },
                                  [e._v(e._s(e.$root.labels.cancel))]
                                ),
                                e._v(" "),
                                o(
                                  "el-button",
                                  {
                                    staticClass: "am-dialog-create",
                                    attrs: { size: "small", type: "primary" },
                                    on: { click: e.saveDayOff },
                                  },
                                  [
                                    e._v(
                                      "\n                " +
                                        e._s(e.$root.labels.days_off_add) +
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
                  ],
                  1
                ),
              ]),
            ],
            1
          ),
          e._v(" "),
          e.listedDaysOff.length > 0
            ? o("div", { staticClass: "am-company-days-off" }, [
                o(
                  "div",
                  { staticClass: "am-dialog-table" },
                  [
                    o("h4", [e._v(e._s(e.$root.labels.company_days_off))]),
                    e._v(" "),
                    o(
                      "el-row",
                      {
                        staticClass: "am-dialog-table-head days",
                        attrs: { gutter: 20 },
                      },
                      [
                        o("el-col", { attrs: { span: 12 } }, [
                          o("span", [e._v(e._s(e.$root.labels.date))]),
                        ]),
                        e._v(" "),
                        o("el-col", { attrs: { span: 12 } }, [
                          o("span", [e._v(e._s(e.$root.labels.day_off_name))]),
                        ]),
                      ],
                      1
                    ),
                    e._v(" "),
                    e._l(e.yearListedDaysOff, function (t, i) {
                      return o(
                        "el-row",
                        {
                          key: i,
                          staticClass: "am-day-off",
                          attrs: { gutter: 20, type: "flex", align: "middle" },
                        },
                        [
                          o("el-col", { attrs: { span: 12 } }, [
                            o("span", {
                              staticClass: "type",
                              class: { repeat: t.repeat, once: !t.repeat },
                            }),
                            e._v(" "),
                            o("span", [
                              e._v(
                                "\n            " +
                                  e._s(
                                    t.startDate === t.endDate
                                      ? e.getFrontedFormattedDate(t.startDate)
                                      : e.getFrontedFormattedDate(t.startDate) +
                                          " - " +
                                          e.getFrontedFormattedDate(t.endDate)
                                  ) +
                                  "\n          "
                              ),
                            ]),
                          ]),
                          e._v(" "),
                          o("el-col", { attrs: { span: 8 } }, [
                            o("span", [e._v(e._s(t.name))]),
                          ]),
                        ],
                        1
                      );
                    }),
                    e._v(" "),
                    e.allowEditCompanyDaysOff
                      ? o(
                          "el-row",
                          [
                            o("el-col", { attrs: { span: 24 } }, [
                              o(
                                "div",
                                {
                                  staticClass: "am-add-element",
                                  on: { click: e.editCompanyDaysOffSettings },
                                },
                                [
                                  e._v(
                                    e._s(e.$root.labels.edit_company_days_off) +
                                      "\n          "
                                  ),
                                ]
                              ),
                            ]),
                          ],
                          1
                        )
                      : e._e(),
                  ],
                  2
                ),
              ])
            : e._e(),
        ]);
      },
      staticRenderFns: [],
    };
  },
  919: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var i = o(687),
      a = o(337),
      s = o(692),
      n = o(920);
    t.default = {
      mixins: [n.a, i.a, a.a, s.a],
      props: {
        activeTab: "",
        weekSchedule: null,
        categorizedServiceList: null,
        locations: null,
      },
      data: function () {
        return {
          rules: {
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
          },
          responsiveGrid: {
            editHours: { workHours: 24, hour: 24, services: 24, location: 24 },
            periods: {
              hours: this.categorizedServiceList ? 4 : 6,
              services: this.categorizedServiceList ? 12 : 10,
              locations: 6,
              edit: 2,
            },
          },
        };
      },
      methods: {
        getWorkingPeriodsInSeconds: function (e) {
          var t = [],
            o = this;
          return (
            this.getDayHours(e)
              .filter(function (e) {
                return "Work" === e.type;
              })
              .map(function (e) {
                return e.data;
              })
              .map(function (e) {
                return e.time;
              })
              .forEach(function (i) {
                (e.form.data.time[0] === i[0] &&
                  e.form.data.time[1] === i[1]) ||
                  t.push([
                    o.getStringTimeInSeconds(i[0]),
                    o.getStringTimeInSeconds(i[1]),
                  ]);
              }),
            t
          );
        },
        getDayHours: function (e) {
          var t = this,
            o = [];
          return (
            e.periods.forEach(function (e, t) {
              o.push({ index: t, type: "Work", data: e });
            }),
            e.breaks.forEach(function (e, t) {
              o.push({ index: t, type: "Break", data: e });
            }),
            o.sort(function (e, o) {
              return t
                .$moment(
                  "2000-01-01 " + e.data.time[0] + ":00",
                  "YYYY-MM-DD HH:mm:ss"
                )
                .diff(
                  t.$moment(
                    "2000-01-01 " + o.data.time[0] + ":00",
                    "YYYY-MM-DD HH:mm:ss"
                  )
                );
            })
          );
        },
        getServicesNames: function (e) {
          var t = [];
          return (
            this.categorizedServiceList &&
              this.categorizedServiceList.forEach(function (o) {
                o.serviceList.forEach(function (o) {
                  -1 !== e.indexOf(o.id) && t.push(o.name);
                });
              }),
            t
          );
        },
        selectAllInCategory: function (e, t) {
          var o = this.categorizedServiceList
            .find(function (e) {
              return e.id === t;
            })
            .serviceList.filter(function (e) {
              return e.state;
            })
            .map(function (e) {
              return e.id;
            });
          _.isEqual(_.intersection(o, e.serviceIds), o)
            ? (e.serviceIds = _.difference(e.serviceIds, o))
            : (e.serviceIds = _.uniq(e.serviceIds.concat(o)));
        },
        getTimeSelectOptionsForBreaks: function (e, t, o, i) {
          return {
            start: "00:00",
            end: "24:00",
            step: this.secondsToTimeSelectStep(this.getTimeSlotLength()),
            minTime: o || e,
            maxTime: i || t,
          };
        },
        editHours: function (e, t, o) {
          var i = this;
          switch (t) {
            case "Work":
              (e.form.show = !1),
                setTimeout(function () {
                  (e.form = {
                    data: e.periods[o],
                    oldData: JSON.parse(JSON.stringify(e.periods[o])),
                    isNew: !1,
                    type: "Work",
                    show: !0,
                    index: o,
                  }),
                    i.findFreePeriods(i.getWorkingPeriodsInSeconds(e));
                }, 200);
              break;
            case "Break":
              (e.form.show = !1),
                setTimeout(function () {
                  e.form = {
                    data: e.breaks[o],
                    oldData: JSON.parse(JSON.stringify(e.breaks[o])),
                    isNew: !1,
                    type: "Break",
                    show: !0,
                    index: o,
                  };
                }, 200);
          }
        },
        deleteHours: function (e, t, o) {
          switch (t) {
            case "Work":
              e.periods.splice(o, 1);
              break;
            case "Break":
              e.breaks.splice(o, 1);
          }
        },
        showNewHoursForm: function (e) {
          (e.form = {
            data: {
              time:
                "Work" === e.form.type
                  ? [
                      e.periods.length
                        ? e.periods[e.periods.length - 1].time[1]
                        : "",
                      "",
                    ]
                  : ["", ""],
              formatTime: ["", ""], //p2p add formatTime custom format field
              id: null,
              locationId: null,
              serviceIds: [],
              periodServiceList: [],
            },
            isNew: !0,
            type: "Work",
            show: !0,
            index: null,
          }),
            this.findFreePeriods(this.getWorkingPeriodsInSeconds(e));
        },
        hideHoursForm: function (e) {
          switch (((e.form.show = !1), e.form.type)) {
            case "Work":
              e.form.isNew || (e.periods[e.form.index] = e.form.oldData);
              break;
            case "Break":
              e.form.isNew || (e.breaks[e.form.index] = e.form.oldData);
          }
        },
        //p2p add formatTime custom format field
        saveHoursForm: function (e) {
          this.$refs.workDay[0].validate(function (t) {
            if (!t) return !1;
            switch (e.form.type) {
              case "Work":
                e.form.isNew
                  ? e.periods.push({
                      id: null,
                      time: e.form.data.time,
                      serviceIds: e.form.data.serviceIds,
                      locationId: e.form.data.locationId,
                      periodServiceList: e.form.data.periodServiceList,
                      formatTime: e.form.data.formatTime,
                    })
                  : (e.periods[e.form.index] = e.form.data);
                break;
              case "Break":
                e.form.isNew
                  ? e.breaks.push({ id: null, time: e.form.data.time })
                  : (e.breaks[e.form.index] = e.form.data);
            }
            e.form.show = !1;
          });
        },
        applyToAllDays: function (e) {
          var t = JSON.parse(JSON.stringify(e.periods));
          t.forEach(function (e) {
            (e.id = null),
              (e.periodServiceList = []),
              (e.savedPeriodServiceList = []);
          });
          var o = JSON.parse(JSON.stringify(e.breaks));
          o.forEach(function (e) {
            e.id = null;
          }),
            this.weekSchedule.forEach(function (i) {
              (i.id = null),
                (i.periods = JSON.parse(JSON.stringify(t))),
                (i.breaks = JSON.parse(JSON.stringify(o))),
                (i.time = JSON.parse(JSON.stringify(e.time)));
            });
        },
        getPeriodLocationName: function (e) {
          return e.data.locationId &&
            this.locations.find(function (t) {
              return t.id === e.data.locationId;
            })
            ? this.locations.find(function (t) {
                return t.id === e.data.locationId;
              }).name
            : "";
        },
        getColumnLength: function () {
          var e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
          return this.categorizedServiceList &&
            this.servicesCount > 1 &&
            this.locations &&
            this.locations.length > 1
            ? "mini" === e
              ? { workHours: 24, hour: 24, services: 24, location: 24 }
              : "mobile" === e
              ? { workHours: 24, hour: 12, services: 24, location: 24 }
              : { workHours: 10, hour: 12, services: 8, location: 6 }
            : this.categorizedServiceList && this.servicesCount > 1
            ? "mini" === e
              ? { workHours: 24, hour: 24, services: 24, location: 0 }
              : "mobile" === e
              ? { workHours: 24, hour: 12, services: 24, location: 0 }
              : { workHours: 10, hour: 12, services: 14, location: 0 }
            : this.locations && this.locations.length > 1
            ? "mini" === e
              ? { workHours: 24, hour: 24, services: 0, location: 24 }
              : "mobile" === e
              ? { workHours: 24, hour: 12, services: 0, location: 24 }
              : { workHours: 10, hour: 12, services: 0, location: 14 }
            : "mini" === e
            ? { workHours: 24, hour: 24, services: 0, location: 0 }
            : { workHours: 24, hour: 12, services: 0, location: 0 };
        },
        handleResize: function () {
          if ("workingHours" === this.activeTab || "hours" === this.activeTab) {
            var e = this.$refs.workingHours;
            e.offsetWidth < 320
              ? ((this.responsiveGrid.periods = {
                  hours: 24,
                  services: 24,
                  locations: 24,
                  edit: 24,
                }),
                (this.responsiveGrid.editHours = this.getColumnLength("mini")))
              : e.offsetWidth < 650
              ? ((this.responsiveGrid.periods = {
                  hours: 24,
                  services: 24,
                  locations: 24,
                  edit: 24,
                }),
                (this.responsiveGrid.editHours =
                  this.getColumnLength("mobile")))
              : ((this.responsiveGrid.periods = {
                  hours: this.categorizedServiceList ? 4 : 6,
                  services: this.categorizedServiceList ? 12 : 10,
                  locations: 5,
                  edit: 3,
                }),
                (this.responsiveGrid.editHours = this.getColumnLength()));
          }
        },
      },
      created: function () {
        window.addEventListener("resize", this.handleResize);
      },
      computed: {
        servicesCount: function () {
          var e = 0;
          return (
            this.categorizedServiceList.forEach(function (t) {
              e += t.serviceList.length;
            }),
            e
          );
        },
      },
      watch: {
        activeTab: function () {
          ("workingHours" !== this.activeTab && "hours" !== this.activeTab) ||
            this.handleResize();
        },
      },
    };
  },
  920: function (e, t, o) {
    "use strict";
    t.a = {
      data: function () {
        return { freePeriodsInSeconds: [0, 86400] };
      },
      methods: {
        startTimeChanged: function (e, t, o, i) {
          if (null === e) {
            i(null);
            var a = document.getElementsByClassName("time-select-item"),
              s = !0,
              n = !1,
              r = void 0;
            try {
              for (
                var l, c = a[Symbol.iterator]();
                !(s = (l = c.next()).done);
                s = !0
              )
                for (
                  var d = l.value,
                    m = this.getStringTimeInSeconds(d.innerHTML),
                    u = 0;
                  u < o.length;
                  u++
                )
                  if (m > o[u][0] && m < o[u][1]) {
                    (d.style.pointerEvents = "none"),
                      (d.style.color = "#DCDCDC");
                    break;
                  }
            } catch (e) {
              (n = !0), (r = e);
            } finally {
              try {
                !s && c.return && c.return();
              } finally {
                if (n) throw r;
              }
            }
          }
        },
        findFreePeriods: function (e) {
          for (var t = [], o = 0, i = 0; i < e.length; i++)
            o !== e[i][0] && t.push([o, e[i][0]]), (o = e[i][1]);
          86400 !== o && t.push([o, 86400]), (this.freePeriodsInSeconds = t);
        },
        getBorderTime: function (e, t) {
          return {
            start: "00:00",
            end: "24:00",
            step: this.secondsToTimeSelectStep(this.getTimeSlotLength()),
            minTime: e,
            maxTime: t,
          };
        },
        getPeriodBorderTime: function (e, t, o) {
          var i = null,
            a = null;
          if (null === e) return this.getBorderTime(i, a);
          for (
            var s = this.getStringTimeInSeconds(e), n = 0;
            n < this.freePeriodsInSeconds.length;
            n++
          )
            if (
              s >= this.freePeriodsInSeconds[n][0] &&
              s < this.freePeriodsInSeconds[n][1]
            ) {
              o
                ? ((i = this.secondsToTimeSelectStep(
                    this.freePeriodsInSeconds[n][0] - this.getTimeSlotLength()
                  )),
                  (a =
                    null !== t
                      ? t
                      : this.secondsToTimeSelectStep(
                          this.freePeriodsInSeconds[n][1] +
                            this.getTimeSlotLength()
                        )))
                : ((i = e),
                  (a = this.secondsToTimeSelectStep(
                    this.freePeriodsInSeconds[n][1] + this.getTimeSlotLength()
                  )));
              break;
            }
          return (
            null === i && null === a && (i = a = e), this.getBorderTime(i, a)
          );
        },
      },
    };
  },
  921: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          o = e._self._c || t;
        return o(
          "div",
          { ref: "workingHours", staticClass: "am-working-hours" },
          e._l(e.weekSchedule, function (t, i) {
            return o(
              "div",
              { key: t.id, staticClass: "am-dialog-table" },
              [
                o(
                  "el-row",
                  { staticClass: "am-dialog-table-head hours" },
                  [
                    o("el-col", { attrs: { span: 12 } }, [
                      o("span", [e._v(e._s(t.day))]),
                    ]),
                    e._v(" "),
                    o(
                      "el-col",
                      { staticClass: "am-align-right", attrs: { span: 12 } },
                      [
                        0 === i
                          ? o(
                              "span",
                              {
                                staticClass: "am-add-element",
                                on: {
                                  click: function (o) {
                                    return e.applyToAllDays(t);
                                  },
                                },
                              },
                              [e._v(e._s(e.$root.labels.apply_to_all_days))]
                            )
                          : e._e(),
                        e._v(" "),
                        o(
                          "div",
                          {
                            staticClass: "am-add-element",
                            on: {
                              click: function (o) {
                                return e.showNewHoursForm(t);
                              },
                            },
                          },
                          [o("i", { staticClass: "el-icon-plus" })]
                        ),
                      ]
                    ),
                  ],
                  1
                ),
                e._v(" "),
                o("transition", { attrs: { name: "fade" } }, [
                  t.form.show
                    ? o(
                        "div",
                        { staticClass: "am-add-period" },
                        [
                          o(
                            "el-form",
                            {
                              ref: "workDay",
                              refInFor: !0,
                              attrs: { "label-position": "top", model: t },
                            },
                            [
                              t.form.isNew
                                ? o(
                                    "el-row",
                                    {
                                      staticClass: "am-add-period-type",
                                      attrs: { gutter: 10 },
                                    },
                                    [
                                      o(
                                        "el-col",
                                        [
                                          o(
                                            "el-radio",
                                            {
                                              attrs: { label: "Work" },
                                              model: {
                                                value: t.form.type,
                                                callback: function (o) {
                                                  e.$set(t.form, "type", o);
                                                },
                                                expression: "workDay.form.type",
                                              },
                                            },
                                            [
                                              e._v(
                                                e._s(e.$root.labels.work_hours)
                                              ),
                                            ]
                                          ),
                                          e._v(" "),
                                          o(
                                            "el-radio",
                                            {
                                              attrs: { label: "Break" },
                                              model: {
                                                value: t.form.type,
                                                callback: function (o) {
                                                  e.$set(t.form, "type", o);
                                                },
                                                expression: "workDay.form.type",
                                              },
                                            },
                                            [e._v(e._s(e.$root.labels.breaks))]
                                          ),
                                        ],
                                        1
                                      ),
                                    ],
                                    1
                                  )
                                : e._e(),
                              e._v(" "),
                              "Work" === t.form.type
                                ? o(
                                    "el-row",
                                    {
                                      staticStyle: { "flex-wrap": "wrap" },
                                      attrs: { gutter: 10, type: "flex" },
                                    },
                                    [
                                      o(
                                        "el-col",
                                        {
                                          attrs: {
                                            span: e.responsiveGrid.editHours
                                              .workHours,
                                          },
                                        },
                                        [
                                          o(
                                            "el-row",
                                            {
                                              staticStyle: {
                                                "flex-wrap": "wrap",
                                              },
                                              attrs: {
                                                gutter: 10,
                                                type: "flex",
                                              },
                                            },
                                            [
                                              o(
                                                "el-col",
                                                {
                                                  staticStyle: {
                                                    "margin-bottom": "4px",
                                                  },
                                                  attrs: { span: 24 },
                                                },
                                                [
                                                  o("span", [
                                                    e._v(
                                                      e._s(
                                                        e.$root.labels
                                                          .work_hours
                                                      )
                                                    ),
                                                  ]),
                                                ]
                                              ),
                                              e._v(" "),
                                              o(
                                                "el-col",
                                                {
                                                  attrs: {
                                                    span: e.responsiveGrid
                                                      .editHours.hour,
                                                  },
                                                },
                                                [
                                                  o(
                                                    "el-form-item", //P2P: Change el-time-select with custom for formating as AM/PM
                                                    {
                                                      attrs: {
                                                        rules:
                                                          e.rules.startTime,
                                                        prop: "form.data.time.0",
                                                      },
                                                    },
                                                    [
                                                      o("el-select", {
                                                        staticStyle: {
                                                          "margin-bottom":
                                                            "12px",
                                                        },
                                                        attrs: {
                                                          size: "mini",
                                                        },
                                                        on: {
                                                          change: function (o) {
                                                            e.startTimeChanged(
                                                              t.form.data
                                                                .time[0],
                                                              t.form.data
                                                                .time[1],
                                                              e.getWorkingPeriodsInSeconds(
                                                                t
                                                              ),
                                                              function (e) {
                                                                t.form.data.time[1] =
                                                                  e;
                                                              }
                                                            );
                                                          },
                                                          focus: function (o) {
                                                            e.startTimeChanged(
                                                              t.form.data
                                                                .time[0],
                                                              t.form.data
                                                                .time[1],
                                                              e.getWorkingPeriodsInSeconds(
                                                                t
                                                              ),
                                                              function (e) {
                                                                t.form.data.time[1] =
                                                                  e;
                                                              }
                                                            );
                                                          },
                                                        },
                                                        model: {
                                                          value:
                                                            t.form.data.time[0],
                                                          callback: function (
                                                            ev
                                                          ) {
                                                            e.$set(
                                                              t.form.data.time,
                                                              0,
                                                              ev
                                                            );
                                                            e.$set(
                                                              t.form.data.formatTime,
                                                              0,
                                                              e.to12Format(ev)
                                                            );
                                                          },
                                                          expression:
                                                            "workDay.form.data.time[0]",
                                                        },
                                                      }, e.customTimeSelect(o)),
                                                    ],
                                                    1
                                                  ),
                                                ],
                                                1
                                              ),
                                              e._v(" "),
                                              o(
                                                "el-col",
                                                {
                                                  attrs: {
                                                    span: e.responsiveGrid
                                                      .editHours.hour,
                                                  },
                                                },
                                                [
                                                  o(
                                                    "el-form-item", //P2P: Change el-time-select with custom for formating as AM/PM
                                                    {
                                                      attrs: {
                                                        rules: e.rules.endTime,
                                                        prop: "form.data.time.1",
                                                      },
                                                    },
                                                    [
                                                      o("el-select", {
                                                        staticStyle: {
                                                          "margin-bottom":
                                                            "12px",
                                                        },
                                                        attrs: {
                                                          size: "mini",
                                                          disabled:
                                                            null ===
                                                            t.form.data.time[0],
                                                        },
                                                        model: {
                                                          value:
                                                            t.form.data.time[1],
                                                          callback: function (
                                                            ev
                                                          ) {
                                                            e.$set(
                                                              t.form.data.time,
                                                              1,
                                                              ev
                                                            );
                                                            e.$set(
                                                              t.form.data.formatTime,
                                                              1,
                                                              e.to12Format(ev)
                                                            );
                                                          },
                                                          expression:
                                                            "workDay.form.data.time[1]",
                                                        },
                                                      }, e.customTimeSelect(o)),
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
                                      e.categorizedServiceList &&
                                      e.servicesCount > 1
                                        ? o(
                                            "el-col",
                                            {
                                              attrs: {
                                                span: e.responsiveGrid.editHours
                                                  .services,
                                              },
                                            },
                                            [
                                              o(
                                                "el-row",
                                                {
                                                  staticStyle: {
                                                    "flex-wrap": "wrap",
                                                  },
                                                  attrs: {
                                                    gutter: 10,
                                                    type: "flex",
                                                  },
                                                },
                                                [
                                                  o(
                                                    "el-col",
                                                    {
                                                      staticStyle: {
                                                        "margin-bottom": "4px",
                                                      },
                                                      attrs: { span: 24 },
                                                    },
                                                    [
                                                      o("span", [
                                                        e._v(
                                                          e._s(
                                                            e.$root.labels.services
                                                              .charAt(0)
                                                              .toUpperCase() +
                                                              e.$root.labels.services.slice(
                                                                1
                                                              )
                                                          )
                                                        ),
                                                      ]),
                                                      e._v(" "),
                                                      o(
                                                        "el-tooltip",
                                                        {
                                                          attrs: {
                                                            placement: "top",
                                                          },
                                                        },
                                                        [
                                                          o("div", {
                                                            attrs: {
                                                              slot: "content",
                                                            },
                                                            domProps: {
                                                              innerHTML: e._s(
                                                                e.$root.labels
                                                                  .period_services_filter1_tooltip
                                                              ),
                                                            },
                                                            slot: "content",
                                                          }),
                                                          e._v(" "),
                                                          o("i", {
                                                            staticClass:
                                                              "el-icon-question am-tooltip-icon",
                                                          }),
                                                        ]
                                                      ),
                                                    ],
                                                    1
                                                  ),
                                                  e._v(" "),
                                                  o(
                                                    "el-col",
                                                    { attrs: { span: 24 } },
                                                    [
                                                      o(
                                                        "el-select",
                                                        {
                                                          staticClass:
                                                            "am-select-service",
                                                          attrs: {
                                                            multiple: "",
                                                            filterable: "",
                                                            placeholder:
                                                              e.$root.labels
                                                                .period_services_filter,
                                                            "collapse-tags": "",
                                                            size: "mini",
                                                          },
                                                          model: {
                                                            value:
                                                              t.form.data
                                                                .serviceIds,
                                                            callback: function (
                                                              o
                                                            ) {
                                                              e.$set(
                                                                t.form.data,
                                                                "serviceIds",
                                                                o
                                                              );
                                                            },
                                                            expression:
                                                              "workDay.form.data.serviceIds",
                                                          },
                                                        },
                                                        e._l(
                                                          e.categorizedServiceList,
                                                          function (i) {
                                                            return i.serviceList.filter(
                                                              function (e) {
                                                                return e.state;
                                                              }
                                                            ).length > 0
                                                              ? o(
                                                                  "div",
                                                                  { key: i.id },
                                                                  [
                                                                    o(
                                                                      "div",
                                                                      {
                                                                        staticClass:
                                                                          "am-drop-parent",
                                                                        on: {
                                                                          click:
                                                                            function (
                                                                              o
                                                                            ) {
                                                                              return e.selectAllInCategory(
                                                                                t
                                                                                  .form
                                                                                  .data,
                                                                                i.id
                                                                              );
                                                                            },
                                                                        },
                                                                      },
                                                                      [
                                                                        o(
                                                                          "span",
                                                                          [
                                                                            e._v(
                                                                              e._s(
                                                                                i.name
                                                                              )
                                                                            ),
                                                                          ]
                                                                        ),
                                                                      ]
                                                                    ),
                                                                    e._v(" "),
                                                                    e._l(
                                                                      i.serviceList,
                                                                      function (
                                                                        t
                                                                      ) {
                                                                        return t.state
                                                                          ? o(
                                                                              "el-option",
                                                                              {
                                                                                key: t.id,
                                                                                staticClass:
                                                                                  "am-drop-child",
                                                                                attrs:
                                                                                  {
                                                                                    label:
                                                                                      t.name,
                                                                                    value:
                                                                                      t.id,
                                                                                  },
                                                                              }
                                                                            )
                                                                          : e._e();
                                                                      }
                                                                    ),
                                                                  ],
                                                                  2
                                                                )
                                                              : e._e();
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
                                            ],
                                            1
                                          )
                                        : e._e(),
                                      e._v(" "),
                                      e.locations && e.locations.length > 1
                                        ? o(
                                            "el-col",
                                            {
                                              attrs: {
                                                span: e.responsiveGrid.editHours
                                                  .location,
                                              },
                                            },
                                            [
                                              o(
                                                "el-row",
                                                {
                                                  staticStyle: {
                                                    "flex-wrap": "wrap",
                                                  },
                                                  attrs: {
                                                    gutter: 10,
                                                    type: "flex",
                                                  },
                                                },
                                                [
                                                  o(
                                                    "el-col",
                                                    {
                                                      staticStyle: {
                                                        "margin-bottom": "4px",
                                                      },
                                                      attrs: { span: 24 },
                                                    },
                                                    [
                                                      o("span", [
                                                        e._v(
                                                          e._s(
                                                            e.$root.labels
                                                              .location
                                                          )
                                                        ),
                                                      ]),
                                                      e._v(" "),
                                                      o(
                                                        "el-tooltip",
                                                        {
                                                          attrs: {
                                                            placement: "top",
                                                          },
                                                        },
                                                        [
                                                          o("div", {
                                                            attrs: {
                                                              slot: "content",
                                                            },
                                                            domProps: {
                                                              innerHTML: e._s(
                                                                e.$root.labels
                                                                  .period_location_filter1_tooltip
                                                              ),
                                                            },
                                                            slot: "content",
                                                          }),
                                                          e._v(" "),
                                                          o("i", {
                                                            staticClass:
                                                              "el-icon-question am-tooltip-icon",
                                                          }),
                                                        ]
                                                      ),
                                                    ],
                                                    1
                                                  ),
                                                  e._v(" "),
                                                  o(
                                                    "el-col",
                                                    { attrs: { span: 24 } },
                                                    [
                                                      o(
                                                        "el-select",
                                                        {
                                                          staticClass:
                                                            "am-select-service",
                                                          attrs: {
                                                            filterable: "",
                                                            clearable: "",
                                                            placeholder:
                                                              e.$root.labels
                                                                .location,
                                                            "collapse-tags": "",
                                                            size: "mini",
                                                          },
                                                          model: {
                                                            value:
                                                              t.form.data
                                                                .locationId,
                                                            callback: function (
                                                              o
                                                            ) {
                                                              e.$set(
                                                                t.form.data,
                                                                "locationId",
                                                                o
                                                              );
                                                            },
                                                            expression:
                                                              "workDay.form.data.locationId",
                                                          },
                                                        },
                                                        e._l(
                                                          e.locations,
                                                          function (e) {
                                                            return o(
                                                              "el-option",
                                                              {
                                                                key: e.id,
                                                                attrs: {
                                                                  label: e.name,
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
                                              ),
                                            ],
                                            1
                                          )
                                        : e._e(),
                                    ],
                                    1
                                  )
                                : "Break" === t.form.type
                                ? o(
                                    "el-row",
                                    { attrs: { gutter: 10 } },
                                    [
                                      o(
                                        "el-col",
                                        {
                                          staticStyle: {
                                            "margin-bottom": "4px",
                                          },
                                          attrs: { span: 24 },
                                        },
                                        [
                                          o("span", [
                                            e._v(
                                              e._s(e.$root.labels.break_hours)
                                            ),
                                          ]),
                                        ]
                                      ),
                                      e._v(" "),
                                      o(
                                        "p",
                                        { staticStyle: { display: "none" } },
                                        [e._v(e._s(e.$root.labels.break_hours))]
                                      ),
                                      e._v(" "),
                                      o(
                                        "el-col",
                                        { attrs: { span: 12 } },
                                        [
                                          o(
                                            "el-form-item",
                                            {
                                              attrs: {
                                                rules: e.rules.startTime,
                                                prop: "form.data.time.0",
                                              },
                                            },
                                            [
                                              o("el-time-select", {
                                                staticStyle: {
                                                  "margin-bottom": "14px",
                                                },
                                                attrs: {
                                                  "picker-options":
                                                    e.getTimeSelectOptionsForBreaks(
                                                      t.periods.length
                                                        ? t.periods[0].time[0]
                                                        : "00:00",
                                                      t.periods.length
                                                        ? t.periods[
                                                            t.periods.length - 1
                                                          ].time[1]
                                                        : "24:00",
                                                      "",
                                                      t.form.data.time[1]
                                                    ),
                                                  size: "mini",
                                                },
                                                model: {
                                                  value: t.form.data.time[0],
                                                  callback: function (o) {
                                                    e.$set(
                                                      t.form.data.time,
                                                      0,
                                                      o
                                                    );
                                                  },
                                                  expression:
                                                    "workDay.form.data.time[0]",
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
                                        "el-col",
                                        { attrs: { span: 12 } },
                                        [
                                          o(
                                            "el-form-item",
                                            {
                                              attrs: {
                                                rules: e.rules.endTime,
                                                prop: "form.data.time.1",
                                              },
                                            },
                                            [
                                              o("el-time-select", {
                                                staticStyle: {
                                                  "margin-bottom": "14px",
                                                },
                                                attrs: {
                                                  "picker-options":
                                                    e.getTimeSelectOptionsForBreaks(
                                                      t.periods.length
                                                        ? t.periods[0].time[0]
                                                        : "00:00",
                                                      t.periods.length
                                                        ? t.periods[
                                                            t.periods.length - 1
                                                          ].time[1]
                                                        : "24:00",
                                                      t.form.data.time[0],
                                                      ""
                                                    ),
                                                  size: "mini",
                                                },
                                                model: {
                                                  value: t.form.data.time[1],
                                                  callback: function (o) {
                                                    e.$set(
                                                      t.form.data.time,
                                                      1,
                                                      o
                                                    );
                                                  },
                                                  expression:
                                                    "workDay.form.data.time[1]",
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
                              o(
                                "div",
                                { staticClass: "am-working-hours-buttons" },
                                [
                                  o(
                                    "div",
                                    { staticClass: "align-left" },
                                    [
                                      o(
                                        "el-button",
                                        {
                                          attrs: { size: "small" },
                                          on: {
                                            click: function (o) {
                                              return e.hideHoursForm(t);
                                            },
                                          },
                                        },
                                        [
                                          e._v(
                                            "\n                " +
                                              e._s(e.$root.labels.cancel) +
                                              "\n              "
                                          ),
                                        ]
                                      ),
                                      e._v(" "),
                                      o(
                                        "el-button",
                                        {
                                          attrs: {
                                            size: "small",
                                            type: "primary",
                                          },
                                          on: {
                                            click: function (o) {
                                              return e.saveHoursForm(t);
                                            },
                                          },
                                        },
                                        [
                                          e._v(
                                            "\n                " +
                                              e._s(e.$root.labels.save) +
                                              "\n              "
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
                        ],
                        1
                      )
                    : e._e(),
                ]),
                e._v(" "),
                o(
                  "transition-group",
                  { attrs: { name: "fade", tag: "div" } },
                  e._l(e.getDayHours(t), function (a, s) {
                    return o(
                      "div",
                      { key: s + 1, staticClass: "am-period" },
                      [
                        o(
                          "el-row",
                          { attrs: { gutter: 10, type: "flex" } },
                          [
                            o(
                              "el-col",
                              {
                                attrs: { span: e.responsiveGrid.periods.hours },
                              },
                              [
                                o(
                                  "el-row",
                                  { attrs: { gutter: 10 } },
                                  [
                                    o("el-col", { attrs: { span: 24 } }, [
                                      o(
                                        "span", //P2P: Set start - end
                                        {
                                          class: {
                                            "am-period-break":
                                              "Break" === a.type,
                                          },
                                        },
                                        [
                                          e._v(
                                            e._s(a.data.formatTime[0]) +
                                              " - " +
                                            e._s(a.data.formatTime[1])
                                          ),
                                        ]
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
                              "el-col",
                              {
                                staticClass: "am-flexed2 am-period__services",
                                attrs: {
                                  span: e.responsiveGrid.periods.services,
                                },
                              },
                              [
                                "Work" === a.type &&
                                a.data.serviceIds.length > 0
                                  ? o(
                                      "span",
                                      { staticClass: "am-overflow-ellipsis" },
                                      [
                                        o(
                                          "span",
                                          {
                                            ref: "serviceName-" + i + "-" + s,
                                            refInFor: !0,
                                            attrs: {
                                              title: e
                                                .getServicesNames(
                                                  a.data.serviceIds
                                                )
                                                .join(", "),
                                            },
                                          },
                                          [
                                            e._v(
                                              "\n                  " +
                                                e._s(
                                                  e
                                                    .getServicesNames(
                                                      a.data.serviceIds
                                                    )
                                                    .join(", ")
                                                ) +
                                                "\n                "
                                            ),
                                          ]
                                        ),
                                      ]
                                    )
                                  : e._e(),
                              ]
                            ),
                            e._v(" "),
                            o(
                              "el-col",
                              {
                                staticClass: "am-flexed2 am-period__locations",
                                attrs: {
                                  span: e.responsiveGrid.periods.locations,
                                },
                              },
                              [
                                "Work" === a.type
                                  ? o(
                                      "span",
                                      {
                                        staticClass: "am-overflow-ellipsis",
                                        attrs: {
                                          title: e.getPeriodLocationName(a),
                                        },
                                      },
                                      [
                                        e._v(
                                          "\n              " +
                                            e._s(e.getPeriodLocationName(a)) +
                                            "\n            "
                                        ),
                                      ]
                                    )
                                  : e._e(),
                              ]
                            ),
                            e._v(" "),
                            o(
                              "el-col",
                              {
                                staticClass: "am-flexed2",
                                class: {
                                  mobile: 24 === e.responsiveGrid.periods.edit,
                                },
                                attrs: { span: e.responsiveGrid.periods.edit },
                              },
                              [
                                o(
                                  "div",
                                  {
                                    staticClass: "am-edit-element",
                                    on: {
                                      click: function (o) {
                                        return e.editHours(t, a.type, a.index);
                                      },
                                    },
                                  },
                                  [
                                    o("img", {
                                      attrs: {
                                        src:
                                          e.$root.getUrl +
                                          "public/img/edit-pen.svg",
                                      },
                                    }),
                                  ]
                                ),
                                e._v(" "),
                                o(
                                  "div",
                                  {
                                    staticClass: "am-delete-element",
                                    on: {
                                      click: function (o) {
                                        return e.deleteHours(
                                          t,
                                          a.type,
                                          a.index
                                        );
                                      },
                                    },
                                  },
                                  [o("i", { staticClass: "el-icon-minus" })]
                                ),
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
  922: function (e, t, o) {
    var i = o(685)(o(923), o(924), !1, null, null, null);
    e.exports = i.exports;
  },
  923: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var i = o(691),
      a = o(883),
      s = o(833);
    t.default = {
      mixins: [i.a, a.a, s.a],
      props: {
        name: null,
        entities: null,
        checkGroupData: { toaster: !1, allChecked: !1 },
        confirmDeleteMessage: "",
        successMessage: { single: "", multiple: "" },
        errorMessage: { single: "", multiple: "" },
      },
      data: function () {
        return { deleteGroupLoading: !1, showDeleteConfirmation: !1 };
      },
      methods: {
        deleteSelectedEntities: function () {
          var e = this;
          (this.deleteGroupLoading = !0),
            this.deleteEntities(
              this.entities
                .filter(function (e) {
                  return e.checked;
                })
                .map(function (e) {
                  return e.id;
                }),
              function () {
                (e.showDeleteConfirmation = !1),
                  (e.deleteGroupLoading = !1),
                  e.$emit("groupDeleteCallback");
              },
              function (e) {},
              function (e) {}
            );
        },
      },
    };
  },
  924: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          o = e._self._c || t;
        return o("transition", { attrs: { name: "slide-vertical" } }, [
          o(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: e.checkGroupData.toaster,
                  expression: "checkGroupData.toaster",
                },
              ],
              staticClass: "am-bottom-popover",
            },
            [
              o(
                "transition",
                { attrs: { name: "fade" } },
                [
                  o(
                    "el-button",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: !e.showDeleteConfirmation,
                          expression: "!showDeleteConfirmation",
                        },
                      ],
                      staticClass: "am-button-icon",
                      on: {
                        click: function (t) {
                          e.showDeleteConfirmation = !e.showDeleteConfirmation;
                        },
                      },
                    },
                    [
                      o("img", {
                        staticClass: "svg",
                        attrs: {
                          alt: e.$root.labels.delete,
                          src: e.$root.getUrl + "public/img/delete.svg",
                        },
                      }),
                    ]
                  ),
                ],
                1
              ),
              e._v(" "),
              o("transition", { attrs: { name: "slide-vertical" } }, [
                o(
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
                    staticClass: "am-bottom-popover-confirmation",
                  },
                  [
                    o(
                      "el-row",
                      {
                        attrs: {
                          type: "flex",
                          justify: "start",
                          align: "middle",
                        },
                      },
                      [
                        o("h3", [e._v(e._s(e.confirmDeleteMessage))]),
                        e._v(" "),
                        o(
                          "div",
                          { staticClass: "align-left" },
                          [
                            o(
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
                            ),
                            e._v(" "),
                            o(
                              "el-button",
                              {
                                attrs: {
                                  size: "small",
                                  type: "primary",
                                  loading: e.deleteGroupLoading,
                                },
                                on: { click: e.deleteSelectedEntities },
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
                  ],
                  1
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
  944: function (e, t, o) {
    var i = o(685)(o(945), o(946), !1, null, null, null);
    e.exports = i.exports;
  },
  945: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var i = o(691),
      a = o(689),
      s = o(755);
    o.n(s);
    t.default = {
      name: "AssignedServices",
      components: { Money: s.Money },
      mixins: [i.a, a.a],
      props: {
        categorizedServiceList: {
          type: Array,
          default: function () {
            return [];
          },
        },
        weekSchedule: {
          type: Array,
          default: function () {
            return [];
          },
        },
        futureAppointments: {
          type: Object,
          default: function () {
            return {};
          },
        },
        employeeId: { type: Number, default: 0 },
      },
      created: function () {
        var e = this;
        this.categorizedServiceList.forEach(function (t) {
          e.handleCheckSingleInCategory(t);
        });
      },
      methods: {
        changeCategory: function (e) {
          var t = this,
            o = this.categorizedServiceList.find(function (t) {
              return t.id === e;
            });
          o.serviceList.forEach(function (e) {
            0 !== Object.keys(t.futureAppointments).length &&
            void 0 !== t.futureAppointments[t.employeeId] &&
            -1 !== t.futureAppointments[t.employeeId].indexOf(e.id) &&
            !1 === o.state
              ? t.notify(
                  t.$root.labels.error,
                  t.$root.labels.service_provider_remove_fail_all +
                    " " +
                    e.name +
                    " " +
                    t.$root.labels.service,
                  "error"
                )
              : ((e.state = o.state), t.changeSelectedPeriodServices(e));
          });
        },
        changeService: function (e, t) {
          0 !== Object.keys(this.futureAppointments).length &&
            void 0 !== this.futureAppointments[this.employeeId] &&
            -1 !== this.futureAppointments[this.employeeId].indexOf(t.id) &&
            ((t.state = !0),
            this.notify(
              this.$root.labels.error,
              this.$root.labels.service_provider_remove_fail,
              "error"
            )),
            this.changeSelectedPeriodServices(t),
            this.handleCheckSingleInCategory(e);
        },
        handleCheckSingleInCategory: function (e) {
          e.state =
            e.serviceList.filter(function (e) {
              return !0 === e.state;
            }).length === e.serviceList.length;
        },
        checkCapacityLimits: function (e) {
          e.minCapacity > e.maxCapacity && (e.maxCapacity = e.minCapacity);
        },
        changeSelectedPeriodServices: function (e) {
          e.state
            ? this.weekSchedule.forEach(function (t) {
                t.periods.forEach(function (t) {
                  "savedPeriodServiceList" in t &&
                    t.savedPeriodServiceList.forEach(function (o) {
                      o.serviceId === e.id &&
                        (t.periodServiceList.push(o), t.serviceIds.push(e.id));
                    });
                });
              })
            : this.weekSchedule.forEach(function (t) {
                t.periods.forEach(function (t) {
                  t.periodServiceList.forEach(function (o, i) {
                    o.serviceId === e.id && t.periodServiceList.splice(i, 1);
                  }),
                    t.serviceIds.forEach(function (o, i) {
                      o === e.id && t.serviceIds.splice(i, 1);
                    });
                });
              });
        },
      },
    };
  },
  946: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          o = e._self._c || t;
        return o(
          "div",
          e._l(e.categorizedServiceList, function (t) {
            return t.serviceList.length > 0
              ? o(
                  "div",
                  {
                    key: t.id,
                    staticClass: "am-dialog-table am-assigned-services",
                  },
                  [
                    o(
                      "el-row",
                      {
                        staticClass: "am-dialog-table-head",
                        attrs: { gutter: 24 },
                      },
                      [
                        o(
                          "el-col",
                          { staticClass: "am-three-dots", attrs: { span: 12 } },
                          [
                            o("el-checkbox", {
                              on: {
                                change: function (o) {
                                  return e.changeCategory(t.id);
                                },
                              },
                              model: {
                                value: t.state,
                                callback: function (o) {
                                  e.$set(t, "state", o);
                                },
                                expression: "category.state",
                              },
                            }),
                            e._v(" "),
                            o("span", [e._v(e._s(t.name))]),
                          ],
                          1
                        ),
                        e._v(" "),
                        o("el-col", { attrs: { span: 6 } }, [
                          e._v(
                            "\n        " +
                              e._s(e.$root.labels.price) +
                              "\n      "
                          ),
                        ]),
                        e._v(" "),
                        o("el-col", { attrs: { span: 6 } }, [
                          e._v(
                            "\n        " +
                              e._s(e.$root.labels.capacity) +
                              "\n      "
                          ),
                        ]),
                      ],
                      1
                    ),
                    e._v(" "),
                    e._l(t.serviceList, function (i) {
                      return o(
                        "el-row",
                        {
                          key: i.value,
                          staticClass: "am-assigned-services__service-row",
                          attrs: { gutter: 10, type: "flex", align: "middle" },
                        },
                        [
                          o(
                            "el-col",
                            {
                              staticClass:
                                "am-assigned-services__service-row__name",
                              attrs: { span: 12 },
                            },
                            [
                              o("el-checkbox", {
                                on: {
                                  change: function (o) {
                                    return e.changeService(t, i);
                                  },
                                },
                                model: {
                                  value: i.state,
                                  callback: function (t) {
                                    e.$set(i, "state", t);
                                  },
                                  expression: "item.state",
                                },
                              }),
                              e._v(" "),
                              o("span", { attrs: { title: i.name } }, [
                                e._v(e._s(i.name)),
                              ]),
                            ],
                            1
                          ),
                          e._v(" "),
                          o(
                            "el-col",
                            { attrs: { span: 6 } },
                            [
                              o("p", { staticStyle: { display: "none" } }, [
                                e._v(e._s(e.$root.labels.price)),
                              ]),
                              e._v(" "),
                              o(
                                "money",
                                e._b(
                                  {
                                    staticClass: "el-input__inner",
                                    attrs: { disabled: !i.state },
                                    model: {
                                      value: i.price,
                                      callback: function (t) {
                                        e.$set(i, "price", t);
                                      },
                                      expression: "item.price",
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
                          e._v(" "),
                          o(
                            "el-col",
                            { attrs: { span: 3 } },
                            [
                              o("p", { staticStyle: { display: "none" } }, [
                                e._v(e._s(e.$root.labels.minimum_capacity)),
                              ]),
                              e._v(" "),
                              o("el-input-number", {
                                attrs: {
                                  disabled: !i.state,
                                  value: i.minCapacity,
                                  min: 1,
                                  controls: !1,
                                },
                                on: {
                                  input: function (t) {
                                    return e.checkCapacityLimits(i);
                                  },
                                },
                                model: {
                                  value: i.minCapacity,
                                  callback: function (t) {
                                    e.$set(i, "minCapacity", t);
                                  },
                                  expression: "item.minCapacity",
                                },
                              }),
                            ],
                            1
                          ),
                          e._v(" "),
                          o(
                            "el-col",
                            { attrs: { span: 3 } },
                            [
                              o("p", { staticStyle: { display: "none" } }, [
                                e._v(e._s(e.$root.labels.maximum_capacity)),
                              ]),
                              e._v(" "),
                              o("el-input-number", {
                                attrs: {
                                  disabled: !i.state,
                                  value: i.maxCapacity,
                                  min: i.minCapacity,
                                  controls: !1,
                                },
                                on: {
                                  input: function (t) {
                                    return e.checkCapacityLimits(i);
                                  },
                                },
                                model: {
                                  value: i.maxCapacity,
                                  callback: function (t) {
                                    e.$set(i, "maxCapacity", t);
                                  },
                                  expression: "item.maxCapacity",
                                },
                              }),
                            ],
                            1
                          ),
                        ],
                        1
                      );
                    }),
                  ],
                  2
                )
              : e._e();
          }),
          0
        );
      },
      staticRenderFns: [],
    };
  },
  947: function (e, t, o) {
    var i = o(685)(o(948), o(949), !1, null, null, null);
    e.exports = i.exports;
  },
  948: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var i = o(687),
      a = o(337),
      s = o(692),
      n = o(686),
      r = o(695);
    t.default = {
      mixins: [i.a, a.a, s.a, n.a, r.a],
      props: {
        activeTab: "",
        categorizedServiceList: null,
        locations: null,
        specialDays: null,
        shouldScrollView: { type: Boolean, default: !0, required: !1 },
        isCabinet: { type: Boolean, default: !1, required: !1 },
      },
      data: function () {
        return {
          model: {},
          rules: {
            dateRange: [
              {
                required: !0,
                message: this.$root.labels.special_day_date_warning,
                trigger: "submit",
              },
            ],
            startTime: [
              {
                required: !0,
                message: this.$root.labels.special_day_start_time_warning,
                trigger: "submit",
              },
            ],
            endTime: [
              {
                required: !0,
                message: this.$root.labels.special_day_end_time_warning,
                trigger: "submit",
              },
            ],
          },
          specialDayModel: this.getInitSpecialDayModel(),
          showSpecialDayForm: !1,
          responsiveGrid: {
            editHours: { workHours: 24, hour: 24, services: 24, location: 24 },
          },
        };
      },
      created: function () {
        window.addEventListener("resize", this.handleResize);
      },
      mounted: function () {},
      methods: {
        getColumnLength: function () {
          var e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
          return this.categorizedServiceList &&
            this.servicesCount > 1 &&
            this.locations &&
            this.locations.length > 1
            ? "mini" === e
              ? { workHours: 22, hour: 24, services: 22, location: 22 }
              : "mobile" === e
              ? { workHours: 22, hour: 12, services: 22, location: 22 }
              : { workHours: 10, hour: 12, services: 7, location: 5 }
            : this.categorizedServiceList && this.servicesCount > 1
            ? "mini" === e
              ? { workHours: 22, hour: 24, services: 22, location: 0 }
              : "mobile" === e
              ? { workHours: 22, hour: 12, services: 22, location: 0 }
              : { workHours: 10, hour: 12, services: 12, location: 0 }
            : this.locations && this.locations.length > 1
            ? "mini" === e
              ? { workHours: 22, hour: 24, services: 0, location: 22 }
              : "mobile" === e
              ? { workHours: 22, hour: 12, services: 0, location: 22 }
              : { workHours: 10, hour: 12, services: 0, location: 14 }
            : "mini" === e
            ? { workHours: 22, hour: 24, services: 0, location: 0 }
            : { workHours: 22, hour: 12, services: 0, location: 0 };
        },
        handleResize: function () {
          if (
            "specialDays" === this.activeTab ||
            "specialDays" === this.activeTab
          ) {
            var e = this.$refs.specialDays;
            e.offsetWidth < 320
              ? (this.responsiveGrid.editHours = this.getColumnLength("mini"))
              : e.offsetWidth < 650
              ? (this.responsiveGrid.editHours = this.getColumnLength("mobile"))
              : (this.responsiveGrid.editHours = this.getColumnLength());
          }
        },
        getInitSpecialDayModel: function () {
          return {
            index: null,
            id: null,
            dateRange: null,
            periodList: [
              {
                id: null,
                startTime: "",
                endTime: "",
                locationId: null,
                serviceIds: [],
                periodServiceList: [],
              },
            ],
          };
        },
        addSpecialDay: function () {
          (this.specialDayModel = this.getInitSpecialDayModel()),
            (this.showSpecialDayForm = !0),
            !0 === this.shouldScrollView &&
              this.scrollViewInModal("specialDay");
        },
        editSpecialDay: function (e) {
          var t = {
            index: e,
            id: this.specialDays[e].id,
            dateRange: {
              start: this.$moment(this.specialDays[e].startDate).toDate(),
              end: this.$moment(this.specialDays[e].endDate).toDate(),
            },
            periodList: [],
          };
          this.specialDays[e].periodList.forEach(function (e) {
            var o = [];
            e.periodServiceList.forEach(function (e) {
              o.push(e.serviceId);
            }),
              t.periodList.push({
                id: e.id,
                startTime: e.startTime.slice(0, -3),
                endTime: e.endTime.slice(0, -3),
                periodServiceList: e.periodServiceList,
                locationId: e.locationId,
                serviceIds: o,
              });
          }),
            (this.specialDayModel = t),
            (this.showSpecialDayForm = !0),
            !0 === this.shouldScrollView &&
              this.scrollViewInModal("specialDay");
        },
        deleteSpecialDay: function (e) {
          this.specialDays.splice(e, 1);
        },
        saveSpecialDay: function () {
          var e = this;
          this.$refs.specialDayModel.validate(function (t) {
            if (!t) return !1;
            var o = {
              id: e.specialDayModel.id,
              startDate: e
                .$moment(e.specialDayModel.dateRange.start)
                .format("YYYY-MM-DD"),
              endDate: e
                .$moment(e.specialDayModel.dateRange.end)
                .format("YYYY-MM-DD"),
              periodList: [],
            };
            e.specialDayModel.periodList.forEach(function (e) {
              var t = [];
              e.serviceIds.forEach(function (o) {
                var i = e.periodServiceList.find(function (e) {
                  return e.serviceId === o;
                });
                t.push({ id: i ? i.id : null, serviceId: o });
              }),
                o.periodList.push({
                  id: e.id,
                  startTime: e.startTime + ":00",
                  endTime: e.endTime + ":00",
                  locationId: e.locationId,
                  periodServiceList: t,
                });
            }),
              e.$emit("changeSpecialDays", o, e.specialDayModel.index),
              e.clearValidation(),
              (e.showSpecialDayForm = !1);
          });
        },
        getSpecialDayServices: function (e) {
          var t = [],
            o = [];
          return (
            e.periodList.forEach(function (e) {
              t = _.uniq(
                t.concat(
                  e.periodServiceList.map(function (e) {
                    return e.serviceId;
                  })
                )
              );
            }),
            this.categorizedServiceList.forEach(function (e) {
              e.serviceList.forEach(function (e) {
                !e.state ||
                  (0 !== t.length && -1 === t.indexOf(e.id)) ||
                  o.push(e.name);
              });
            }),
            o.join(", ")
          );
        },
        selectAllInCategory: function (e, t) {
          var o = this.categorizedServiceList
            .find(function (e) {
              return e.id === t;
            })
            .serviceList.filter(function (e) {
              return e.state;
            })
            .map(function (e) {
              return e.id;
            });
          _.isEqual(_.intersection(o, e.serviceIds), o)
            ? (e.serviceIds = _.difference(e.serviceIds, o))
            : (e.serviceIds = _.uniq(e.serviceIds.concat(o)));
        },
        getPeriodBorderTime: function (e, t) {
          var o = "24:00",
            i = "00:00";
          return (
            e.periodList.forEach(function (e, a) {
              t === a - 1 && (o = e.startTime), t === a + 1 && (i = e.endTime);
            }),
            [
              this.secondsToTimeSelectStep(
                this.getStringTimeInSeconds(i) - this.getTimeSlotLength()
              ),
              this.secondsToTimeSelectStep(
                this.getStringTimeInSeconds(o) + this.getTimeSlotLength()
              ),
            ]
          );
        },
        addPeriod: function () {
          this.specialDayModel.periodList.push({
            startTime: this.specialDayModel.periodList.length
              ? this.specialDayModel.periodList[
                  this.specialDayModel.periodList.length - 1
                ].endTime
              : "",
            endTime: "",
            id: null,
            serviceIds: [],
            locationId: null,
            periodServiceList: [],
          });
        },
        deletePeriod: function (e) {
          this.specialDayModel.periodList.splice(e, 1);
        },
        clearValidation: function () {
          void 0 !== this.$refs.specialDayModel &&
            this.$refs.specialDayModel.clearValidate();
        },
      },
      computed: {
        servicesCount: function () {
          var e = 0;
          return (
            this.categorizedServiceList.forEach(function (t) {
              e += t.serviceList.length;
            }),
            e
          );
        },
      },
      watch: {
        activeTab: function () {
          ("specialDays" !== this.activeTab && "special" !== this.activeTab) ||
            this.handleResize();
        },
      },
    };
  },
  949: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          o = e._self._c || t;
        return o(
          "div",
          { ref: "specialDays", staticClass: "am-employee-special-days" },
          [
            o(
              "div",
              { staticClass: "am-dialog-table" },
              [
                o(
                  "el-row",
                  {
                    staticClass: "am-dialog-table-head days",
                    attrs: { gutter: 20 },
                  },
                  [
                    o("el-col", { attrs: { span: 24 } }, [
                      o("span", [e._v(e._s(e.$root.labels.special_days))]),
                    ]),
                  ],
                  1
                ),
                e._v(" "),
                e._l(e.specialDays, function (t, i) {
                  return o(
                    "div",
                    { key: i + 1, staticClass: "am-special-day" },
                    [
                      o(
                        "el-row",
                        [
                          o("el-col", { attrs: { span: 20 } }, [
                            o("div", { staticClass: "am-special-day-data" }, [
                              o("span", { staticClass: "am-strong" }, [
                                e._v(e._s(e.$root.labels.date) + ": "),
                              ]),
                              e._v(" "),
                              o("span", [
                                e._v(
                                  "\n              " +
                                    e._s(
                                      e.getFrontedFormattedDate(t.startDate)
                                    ) +
                                    " - " +
                                    e._s(e.getFrontedFormattedDate(t.endDate)) +
                                    "\n            "
                                ),
                              ]),
                            ]),
                            e._v(" "),
                            o(
                              "div",
                              { staticClass: "am-special-day-data" },
                              [
                                o("span", { staticClass: "am-strong" }, [
                                  e._v(e._s(e.$root.labels.work_hours) + ": "),
                                ]),
                                e._v(" "),
                                e._l(t.periodList, function (t, i) {
                                  return o("span", { key: i + 1 }, [
                                    e._v(
                                      "\n              (" +
                                        e._s(
                                          e.getFrontedFormattedTime(t.startTime)
                                        ) +
                                        " - " +
                                        e._s(
                                          e.getFrontedFormattedTime(t.endTime)
                                        ) +
                                        ")\n              " +
                                        e._s(
                                          i !== t.length - 1 && t.length > 1
                                            ? "; "
                                            : ""
                                        ) +
                                        "\n            "
                                    ),
                                  ]);
                                }),
                              ],
                              2
                            ),
                            e._v(" "),
                            o("div", { staticClass: "am-special-day-data" }, [
                              o("span", { staticClass: "am-strong" }, [
                                e._v(
                                  e._s(
                                    e.$root.labels.special_days_reflect_services
                                  ) + ": "
                                ),
                              ]),
                              e._v(" "),
                              o(
                                "span",
                                { staticClass: "am-special-day-services" },
                                [
                                  o(
                                    "span",
                                    { staticClass: "am-special-day-service" },
                                    [
                                      e._v(
                                        "\n                " +
                                          e._s(e.getSpecialDayServices(t)) +
                                          "\n              "
                                      ),
                                    ]
                                  ),
                                ]
                              ),
                            ]),
                          ]),
                          e._v(" "),
                          o(
                            "el-col",
                            { staticClass: "align-right", attrs: { span: 4 } },
                            [
                              o(
                                "div",
                                {
                                  staticClass: "am-edit-element",
                                  on: {
                                    click: function (t) {
                                      return e.editSpecialDay(i);
                                    },
                                  },
                                },
                                [
                                  o("img", {
                                    attrs: {
                                      src:
                                        e.$root.getUrl +
                                        "public/img/edit-pen.svg",
                                    },
                                  }),
                                ]
                              ),
                              e._v(" "),
                              o(
                                "div",
                                {
                                  staticClass: "am-delete-element",
                                  on: {
                                    click: function (t) {
                                      return e.deleteSpecialDay(i);
                                    },
                                  },
                                },
                                [o("i", { staticClass: "el-icon-minus" })]
                              ),
                            ]
                          ),
                        ],
                        1
                      ),
                    ],
                    1
                  );
                }),
                e._v(" "),
                o(
                  "el-row",
                  [
                    o("el-col", [
                      o(
                        "div",
                        {
                          staticClass: "am-add-element",
                          on: { click: e.addSpecialDay },
                        },
                        [
                          o("i", { staticClass: "el-icon-plus" }),
                          e._v(" "),
                          o("span", [
                            e._v(
                              "\n          " +
                                e._s(e.$root.labels.add_special_day) +
                                "\n          "
                            ),
                          ]),
                        ]
                      ),
                    ]),
                  ],
                  1
                ),
              ],
              2
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
                      value: e.showSpecialDayForm,
                      expression: "showSpecialDayForm",
                    },
                  ],
                  staticClass: "am-special-day-add",
                },
                [
                  o(
                    "el-form",
                    {
                      ref: "specialDayModel",
                      attrs: {
                        model: e.specialDayModel,
                        "label-position": "top",
                        id: "specialDay",
                      },
                      on: {
                        submit: function (e) {
                          e.preventDefault();
                        },
                      },
                    },
                    [
                      o(
                        "el-row",
                        { attrs: { gutter: 20 } },
                        [
                          o(
                            "el-col",
                            {
                              staticClass: "v-calendar-column",
                              staticStyle: { overflow: "visible" },
                              attrs: { sm: 24 },
                            },
                            [
                              o(
                                "el-form-item",
                                {
                                  attrs: {
                                    label: e.$root.labels.date + ":",
                                    prop: "dateRange",
                                    rules: e.rules.dateRange,
                                  },
                                },
                                [
                                  o("v-date-picker", {
                                    staticStyle: { "margin-bottom": "20px" },
                                    attrs: {
                                      mode: "range",
                                      "popover-visibility": "focus",
                                      "popover-direction": "bottom",
                                      "popover-align":
                                        e.screenWidth < 768 ? "center" : "left",
                                      "tint-color": e.isCabinet
                                        ? e.$root.settings.customization
                                            .primaryColor
                                        : "#1A84EE",
                                      "show-day-popover": !1,
                                      "input-props": {
                                        class: "el-input__inner",
                                      },
                                      "is-expanded": !1,
                                      "is-required": !0,
                                      "input-class": "el-input__inner",
                                      placeholder:
                                        e.$root.labels.pick_a_date_or_range,
                                      formats: e.vCalendarFormats,
                                      "available-dates": {
                                        start: this.$moment()
                                          .subtract(1, "days")
                                          .toDate(),
                                      },
                                    },
                                    on: { input: e.clearValidation },
                                    model: {
                                      value: e.specialDayModel.dateRange,
                                      callback: function (t) {
                                        e.$set(
                                          e.specialDayModel,
                                          "dateRange",
                                          t
                                        );
                                      },
                                      expression: "specialDayModel.dateRange",
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
                        "transition-group",
                        { attrs: { name: "fade" } },
                        e._l(e.specialDayModel.periodList, function (t, i) {
                          return o(
                            "div",
                            { key: i + 1, staticClass: "am-period" },
                            [
                              o(
                                "el-row",
                                {
                                  staticStyle: { "flex-wrap": "wrap" },
                                  attrs: { gutter: 10, type: "flex" },
                                },
                                [
                                  o(
                                    "el-col",
                                    {
                                      attrs: {
                                        span: e.responsiveGrid.editHours
                                          .workHours,
                                      },
                                    },
                                    [
                                      o(
                                        "el-row",
                                        { attrs: { gutter: 10 } },
                                        [
                                          o(
                                            "el-col",
                                            {
                                              staticStyle: {
                                                "margin-bottom": "4px",
                                              },
                                              attrs: { span: 24 },
                                            },
                                            [
                                              o("span", [
                                                e._v(
                                                  e._s(
                                                    e.$root.labels.work_hours
                                                  )
                                                ),
                                              ]),
                                            ]
                                          ),
                                          e._v(" "),
                                          o(
                                            "el-col",
                                            {
                                              attrs: {
                                                span: e.responsiveGrid.editHours
                                                  .hour,
                                              },
                                            },
                                            [
                                              o(
                                                "el-form-item", //P2P: Replace el-time-select with custom for especial days
                                                {
                                                  attrs: {
                                                    prop:
                                                      "periodList." +
                                                      i +
                                                      ".startTime",
                                                    rules: e.rules.startTime,
                                                  },
                                                },
                                                [
                                                  o("el-select", {
                                                    staticStyle: {
                                                      "margin-bottom": "12px",
                                                    },
                                                    attrs: {
                                                      size: "mini",
                                                      "is-required": !0,
                                                    },
                                                    on: {
                                                      change: e.clearValidation,
                                                    },
                                                    model: {
                                                      value: t.startTime,
                                                      callback: function (o) {
                                                        e.$set(
                                                          t,
                                                          "startTime",
                                                          o
                                                        );
                                                      },
                                                      expression:
                                                        "period.startTime",
                                                    },
                                                  }, e.customTimeSelect(o)),
                                                ],
                                                1
                                              ),
                                            ],
                                            1
                                          ),
                                          e._v(" "),
                                          o(
                                            "el-col",
                                            {
                                              attrs: {
                                                span: e.responsiveGrid.editHours
                                                  .hour,
                                              },
                                            },
                                            [
                                              o(
                                                "el-form-item", //P2P: Replace el-time-select with custom for especial days
                                                {
                                                  attrs: {
                                                    prop:
                                                      "periodList." +
                                                      i +
                                                      ".endTime",
                                                    rules: e.rules.endTime,
                                                  },
                                                },
                                                [
                                                  o("el-select", {
                                                    staticStyle: {
                                                      "margin-bottom": "12px",
                                                    },
                                                    attrs: {
                                                      size: "mini",
                                                      "is-required": !0,
                                                    },
                                                    on: {
                                                      change: e.clearValidation,
                                                    },
                                                    model: {
                                                      value: t.endTime,
                                                      callback: function (o) {
                                                        e.$set(t, "endTime", o);
                                                      },
                                                      expression:
                                                        "period.endTime",
                                                    },
                                                  }, e.customTimeSelect(o)),
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
                                  e.categorizedServiceList &&
                                  e.servicesCount > 1
                                    ? o(
                                        "el-col",
                                        {
                                          attrs: {
                                            span: e.responsiveGrid.editHours
                                              .services,
                                          },
                                        },
                                        [
                                          o(
                                            "el-row",
                                            {
                                              staticStyle: {
                                                "flex-wrap": "wrap",
                                              },
                                              attrs: {
                                                gutter: 10,
                                                type: "flex",
                                              },
                                            },
                                            [
                                              o(
                                                "el-col",
                                                {
                                                  staticStyle: {
                                                    "margin-bottom": "4px",
                                                  },
                                                  attrs: { span: 24 },
                                                },
                                                [
                                                  o("span", [
                                                    e._v(
                                                      e._s(
                                                        e.$root.labels.services
                                                          .charAt(0)
                                                          .toUpperCase() +
                                                          e.$root.labels.services.slice(
                                                            1
                                                          )
                                                      )
                                                    ),
                                                  ]),
                                                  e._v(" "),
                                                  o(
                                                    "el-tooltip",
                                                    {
                                                      attrs: {
                                                        placement: "top",
                                                      },
                                                    },
                                                    [
                                                      o("div", {
                                                        attrs: {
                                                          slot: "content",
                                                        },
                                                        domProps: {
                                                          innerHTML: e._s(
                                                            e.$root.labels
                                                              .period_services_filter2_tooltip
                                                          ),
                                                        },
                                                        slot: "content",
                                                      }),
                                                      e._v(" "),
                                                      o("i", {
                                                        staticClass:
                                                          "el-icon-question am-tooltip-icon",
                                                      }),
                                                    ]
                                                  ),
                                                ],
                                                1
                                              ),
                                              e._v(" "),
                                              o(
                                                "el-col",
                                                { attrs: { span: 24 } },
                                                [
                                                  e.categorizedServiceList
                                                    ? o(
                                                        "el-select",
                                                        {
                                                          staticClass:
                                                            "am-select-service",
                                                          staticStyle: {
                                                            "margin-bottom":
                                                              "12px",
                                                          },
                                                          attrs: {
                                                            multiple: "",
                                                            filterable: "",
                                                            placeholder:
                                                              e.$root.labels
                                                                .period_services_filter,
                                                            "collapse-tags": "",
                                                            size: "mini",
                                                          },
                                                          on: {
                                                            change: function (
                                                              t
                                                            ) {
                                                              return e.clearValidation();
                                                            },
                                                          },
                                                          model: {
                                                            value: t.serviceIds,
                                                            callback: function (
                                                              o
                                                            ) {
                                                              e.$set(
                                                                t,
                                                                "serviceIds",
                                                                o
                                                              );
                                                            },
                                                            expression:
                                                              "period.serviceIds",
                                                          },
                                                        },
                                                        e._l(
                                                          e.categorizedServiceList,
                                                          function (i) {
                                                            return i.serviceList.filter(
                                                              function (e) {
                                                                return e.state;
                                                              }
                                                            ).length > 0
                                                              ? o(
                                                                  "div",
                                                                  { key: i.id },
                                                                  [
                                                                    o(
                                                                      "div",
                                                                      {
                                                                        staticClass:
                                                                          "am-drop-parent",
                                                                        on: {
                                                                          click:
                                                                            function (
                                                                              o
                                                                            ) {
                                                                              return e.selectAllInCategory(
                                                                                t,
                                                                                i.id
                                                                              );
                                                                            },
                                                                        },
                                                                      },
                                                                      [
                                                                        o(
                                                                          "span",
                                                                          [
                                                                            e._v(
                                                                              e._s(
                                                                                i.name
                                                                              )
                                                                            ),
                                                                          ]
                                                                        ),
                                                                      ]
                                                                    ),
                                                                    e._v(" "),
                                                                    e._l(
                                                                      i.serviceList,
                                                                      function (
                                                                        t
                                                                      ) {
                                                                        return t.state
                                                                          ? o(
                                                                              "el-option",
                                                                              {
                                                                                key: t.id,
                                                                                staticClass:
                                                                                  "am-drop-child",
                                                                                attrs:
                                                                                  {
                                                                                    label:
                                                                                      t.name,
                                                                                    value:
                                                                                      t.id,
                                                                                  },
                                                                              }
                                                                            )
                                                                          : e._e();
                                                                      }
                                                                    ),
                                                                  ],
                                                                  2
                                                                )
                                                              : e._e();
                                                          }
                                                        ),
                                                        0
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
                                  e.locations && e.locations.length > 1
                                    ? o(
                                        "el-col",
                                        {
                                          attrs: {
                                            span: e.responsiveGrid.editHours
                                              .location,
                                          },
                                        },
                                        [
                                          o(
                                            "el-row",
                                            {
                                              staticStyle: {
                                                "flex-wrap": "wrap",
                                              },
                                              attrs: {
                                                gutter: 10,
                                                type: "flex",
                                              },
                                            },
                                            [
                                              o(
                                                "el-col",
                                                {
                                                  staticStyle: {
                                                    "margin-bottom": "4px",
                                                  },
                                                  attrs: { span: 24 },
                                                },
                                                [
                                                  o("span", [
                                                    e._v(
                                                      e._s(
                                                        e.$root.labels.location
                                                      )
                                                    ),
                                                  ]),
                                                  e._v(" "),
                                                  o(
                                                    "el-tooltip",
                                                    {
                                                      attrs: {
                                                        placement: "top",
                                                      },
                                                    },
                                                    [
                                                      o("div", {
                                                        attrs: {
                                                          slot: "content",
                                                        },
                                                        domProps: {
                                                          innerHTML: e._s(
                                                            e.$root.labels
                                                              .period_location_filter2_tooltip
                                                          ),
                                                        },
                                                        slot: "content",
                                                      }),
                                                      e._v(" "),
                                                      o("i", {
                                                        staticClass:
                                                          "el-icon-question am-tooltip-icon",
                                                      }),
                                                    ]
                                                  ),
                                                ],
                                                1
                                              ),
                                              e._v(" "),
                                              o(
                                                "el-col",
                                                { attrs: { span: 24 } },
                                                [
                                                  e.locations.length
                                                    ? o(
                                                        "el-select",
                                                        {
                                                          staticClass:
                                                            "am-select-service",
                                                          staticStyle: {
                                                            "margin-bottom":
                                                              "12px",
                                                          },
                                                          attrs: {
                                                            filterable: "",
                                                            clearable: "",
                                                            placeholder:
                                                              e.$root.labels
                                                                .location,
                                                            "collapse-tags": "",
                                                            size: "mini",
                                                          },
                                                          model: {
                                                            value: t.locationId,
                                                            callback: function (
                                                              o
                                                            ) {
                                                              e.$set(
                                                                t,
                                                                "locationId",
                                                                o
                                                              );
                                                            },
                                                            expression:
                                                              "period.locationId",
                                                          },
                                                        },
                                                        e._l(
                                                          e.locations,
                                                          function (e) {
                                                            return o(
                                                              "el-option",
                                                              {
                                                                key: e.id,
                                                                attrs: {
                                                                  label: e.name,
                                                                  value: e.id,
                                                                },
                                                              }
                                                            );
                                                          }
                                                        ),
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
                                      )
                                    : e._e(),
                                  e._v(" "),
                                  e.specialDayModel.periodList.length > 1
                                    ? o("el-col", { attrs: { span: 2 } }, [
                                        o(
                                          "div",
                                          {
                                            staticClass: "am-delete-element",
                                            on: {
                                              click: function (t) {
                                                return e.deletePeriod(i);
                                              },
                                            },
                                          },
                                          [
                                            o("i", {
                                              staticClass: "el-icon-minus",
                                            }),
                                          ]
                                        ),
                                      ])
                                    : e._e(),
                                ],
                                1
                              ),
                            ],
                            1
                          );
                        }),
                        0
                      ),
                      e._v(" "),
                      o(
                        "el-row",
                        [
                          o(
                            "el-col",
                            { staticClass: "align-left", attrs: { sm: 24 } },
                            [
                              o("div", { staticClass: "am-add-elements" }, [
                                o(
                                  "div",
                                  {
                                    staticClass: "am-add-element",
                                    on: { click: e.addPeriod },
                                  },
                                  [
                                    o("i", { staticClass: "el-icon-plus" }),
                                    e._v(
                                      " " +
                                        e._s(e.$root.labels.add_period) +
                                        "\n              "
                                    ),
                                  ]
                                ),
                              ]),
                            ]
                          ),
                        ],
                        1
                      ),
                      e._v(" "),
                      o(
                        "el-row",
                        { staticClass: "am-special-day-buttons" },
                        [
                          o(
                            "el-col",
                            { staticClass: "align-right", attrs: { sm: 24 } },
                            [
                              o(
                                "el-button",
                                {
                                  attrs: { size: "small" },
                                  on: {
                                    click: function (t) {
                                      e.showSpecialDayForm =
                                        !e.showSpecialDayForm;
                                    },
                                  },
                                },
                                [
                                  e._v(
                                    e._s(e.$root.labels.cancel) +
                                      "\n            "
                                  ),
                                ]
                              ),
                              e._v(" "),
                              o(
                                "el-button",
                                {
                                  staticClass: "am-dialog-create",
                                  attrs: { size: "small", type: "primary" },
                                  on: { click: e.saveSpecialDay },
                                },
                                [
                                  e._v(
                                    "\n              " +
                                      e._s(e.$root.labels.save_special_day) +
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
                ],
                1
              ),
            ]),
          ],
          1
        );
      },
      staticRenderFns: [],
    };
  },
  950: function (e, t, o) {
    "use strict";
    var i = o(687);
    t.a = {
      mixins: [i.a],
      methods: {
        redirectToGoogleAuthPage: function () {
          (this.googleLoading = !0),
            (window.location.href = this.googleAuthURL);
        },
        inlineDialogEmployeeSVG: function () {
          var e = this;
          setTimeout(function () {
            e.inlineSVG();
          }, 10);
        },
      },
    };
  },
  951: function (e, t, o) {
    "use strict";
    var i = o(687);
    t.a = {
      mixins: [i.a],
      methods: {
        redirectToOutlookAuthPage: function () {
          (this.outlookLoading = !0),
            (window.location.href = this.outlookAuthURL);
        },
        inlineDialogEmployeeSVG: function () {
          var e = this;
          setTimeout(function () {
            e.inlineSVG();
          }, 10);
        },
      },
    };
  },
  952: function (e, t, o) {
    var i = o(685)(o(953), o(954), !1, null, null, null);
    e.exports = i.exports;
  },
  953: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var i = o(906),
      a = o.n(i),
      s = o(907),
      n = o.n(s),
      r = o(687),
      l = o(337),
      c = o(692);
    t.default = {
      mixins: [r.a, l.a, c.a],
      props: {
        weekSchedule: { type: Array },
        daysOff: { type: Array },
        showWorkingHours: { default: !0, type: Boolean },
        showDaysOff: { default: !0, type: Boolean },
      },
      data: function () {
        return {
          dayOffSettings: this.daysOff.slice(0),
          weekScheduleSettings: this.weekSchedule
            ? this.weekSchedule.slice(0)
            : [],
          activeTab: "hours",
        };
      },
      mounted: function () {
        this.showWorkingHours && this.translateDayStrings(), this.inlineSVG();
      },
      methods: {
        closeDialog: function () {
          this.$emit("closeDialogSettingsWorkHoursDaysOff");
        },
        onSubmit: function () {
          var e = [],
            t = this;
          this.weekScheduleSettings.forEach(function (o) {
            var i = [],
              a = [],
              s = 86400,
              n = 0;
            o.breaks.forEach(function (e) {
              e.time.length &&
                e.time[0] &&
                e.time[1] &&
                a.push({ time: [e.time[0], e.time[1]] });
            }),
              "periods" in o &&
                o.periods.length &&
                o.periods.forEach(function (e) {
                  var o = t.getStringTimeInSeconds(e.time[0]),
                    a = t.getStringTimeInSeconds(e.time[1]);
                  (s = o < s ? o : s),
                    (n = a > n ? a : n),
                    e.time.length &&
                      e.time[0] &&
                      e.time[1] &&
                      i.push({ time: [e.time[0], e.time[1]] });
                }),
              e.push({
                day: o.day,
                time: [
                  i.length ? t.secondsToTimeSelectStep(s) : null,
                  i.length ? t.secondsToTimeSelectStep(n) : null,
                ],
                periods: i,
                breaks: a,
              });
          }),
            this.$emit("closeDialogSettingsWorkHoursDaysOff"),
            this.$emit("updateSettings", {
              daysOff: this.dayOffSettings,
              weekSchedule: e,
            });
        },
        changeDaysOff: function (e) {
          e.forEach(function (e) {
            delete e.id;
          }),
            (this.dayOffSettings = e);
        },
        translateDayStrings: function () {
          for (
            var e = [
                "weekday_monday",
                "weekday_tuesday",
                "weekday_wednesday",
                "weekday_thursday",
                "weekday_friday",
                "weekday_saturday",
                "weekday_sunday",
              ],
              t = 0;
            t < this.weekSchedule.length;
            t++
          ) {
            var o = e[t];
            this.weekSchedule[t].day = this.$root.labels[o];
          }
        },
      },
      computed: {
        showTabs: function () {
          return this.showWorkingHours && this.showDaysOff;
        },
        showWorkingHoursOnly: function () {
          return this.showWorkingHours && !this.showDaysOff;
        },
        showDaysOffOnly: function () {
          return !this.showWorkingHours && this.showDaysOff;
        },
      },
      components: { DaysOff: a.a, WorkingHours: n.a },
    };
  },
  954: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          o = e._self._c || t;
        return o("div", [
          o(
            "div",
            { staticClass: "am-dialog-scrollable" },
            [
              o(
                "div",
                { staticClass: "am-dialog-header" },
                [
                  o(
                    "el-row",
                    [
                      o("el-col", { attrs: { span: 20 } }, [
                        e.showWorkingHoursOnly
                          ? o("h2", [
                              e._v(
                                "\n            " +
                                  e._s(
                                    e.$root.labels.company_work_hours_settings
                                  ) +
                                  "\n          "
                              ),
                            ])
                          : e.showDaysOffOnly
                          ? o("h2", [
                              e._v(
                                "\n            " +
                                  e._s(
                                    e.$root.labels.company_days_off_settings
                                  ) +
                                  "\n          "
                              ),
                            ])
                          : o("h2", [
                              e._v(
                                "\n            " +
                                  e._s(
                                    e.$root.labels.work_hours_days_off_settings
                                  ) +
                                  "\n          "
                              ),
                            ]),
                      ]),
                      e._v(" "),
                      o(
                        "el-col",
                        { staticClass: "align-right", attrs: { span: 4 } },
                        [
                          o("el-button", {
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
              o(
                "el-form",
                {
                  attrs: { "label-position": "top" },
                  on: {
                    submit: function (t) {
                      return t.preventDefault(), e.onSubmit(t);
                    },
                  },
                },
                [
                  e.showTabs
                    ? o(
                        "el-tabs",
                        {
                          model: {
                            value: e.activeTab,
                            callback: function (t) {
                              e.activeTab = t;
                            },
                            expression: "activeTab",
                          },
                        },
                        [
                          o(
                            "el-tab-pane",
                            {
                              attrs: {
                                label: e.$root.labels.work_hours,
                                name: "hours",
                              },
                            },
                            [
                              o("working-hours", {
                                attrs: { weekSchedule: e.weekScheduleSettings },
                              }),
                            ],
                            1
                          ),
                          e._v(" "),
                          o(
                            "el-tab-pane",
                            {
                              attrs: {
                                label: e.$root.labels.days_off,
                                name: "off",
                              },
                            },
                            [
                              o("days-off", {
                                attrs: { daysOff: e.dayOffSettings },
                                on: { changeDaysOff: e.changeDaysOff },
                              }),
                            ],
                            1
                          ),
                        ],
                        1
                      )
                    : e._e(),
                  e._v(" "),
                  e.showWorkingHoursOnly
                    ? o("working-hours", {
                        attrs: {
                          weekSchedule: e.weekScheduleSettings,
                          categorizedServiceList: [],
                          locations: [],
                        },
                      })
                    : e._e(),
                  e._v(" "),
                  e.showDaysOffOnly
                    ? o("days-off", {
                        attrs: { daysOff: e.dayOffSettings },
                        on: { changeDaysOff: e.changeDaysOff },
                      })
                    : e._e(),
                ],
                1
              ),
            ],
            1
          ),
          e._v(" "),
          o("div", { staticClass: "am-dialog-footer" }, [
            o(
              "div",
              { staticClass: "am-dialog-footer-actions" },
              [
                o(
                  "el-row",
                  [
                    o(
                      "el-col",
                      { staticClass: "align-right", attrs: { sm: 24 } },
                      [
                        o(
                          "el-button",
                          { attrs: { type: "" }, on: { click: e.closeDialog } },
                          [e._v(e._s(e.$root.labels.cancel))]
                        ),
                        e._v(" "),
                        o(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.onSubmit },
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
          ]),
        ]);
      },
      staticRenderFns: [],
    };
  },
});
