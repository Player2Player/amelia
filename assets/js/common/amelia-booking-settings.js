wpJsonpAmeliaBookingPlugin([13], {
  1264: function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var s = a(1265),
      o = a.n(s),
      i = a(1268),
      n = a.n(i),
      l = a(1271),
      r = a.n(l),
      c = a(1274),
      d = a.n(c),
      m = a(1277),
      u = a.n(m),
      p = a(1292),
      g = a.n(p),
      h = a(1295),
      v = a.n(h),
      b = a(1298),
      _ = a.n(b),
      f = a(1304),
      y = a.n(f),
      w = a(952),
      $ = a.n(w),
      k = a(882),
      C = a.n(k),
      x = a(686),
      S = a(687),
      P = a(691),
      D = a(717),
      T = a.n(D);
    t.default = {
      components: {
        PageHeader: T.a,
        DialogTranslate: C.a,
        DialogSettingsGeneral: d.a,
        DialogSettingsCompany: r.a,
        DialogSettingsNotifications: v.a,
        DialogSettingsWorkHoursDaysOff: $.a,
        DialogSettingsPayments: _.a,
        DialogSettingsIntegrations: u.a,
        DialogSettingsLabels: g.a,
        DialogSettingsRoles: y.a,
        DialogSettingsAppointments: n.a,
        DialogSettingsActivation: o.a,
      },
      mixins: [S.a, P.a, x.a],
      data: function () {
        return {
          dialogTranslate: !1,
          dialogTranslateExtra: !1,
          dialogTranslateCategory: !1,
          dialogTranslateType: "url",
          dialogTranslateTab: "roles",
          dialogTranslateData: {},
          dialogTranslateName: "",
          extrasTranslateIndex: 0,
          languagesData: {},
          newExtraTranslations: null,
          dialogSettingsGeneral: !1,
          dialogSettingsCompany: !1,
          dialogSettingsNotifications: !1,
          dialogSettingsWorkHoursDaysOff: !1,
          dialogSettingsPayments: !1,
          dialogSettingsIntegrations: !1,
          dialogSettingsLabels: !1,
          dialogSettingsActivation: !1,
          dialogSettingsRoles: !1,
          dialogSettingsAppointments: !1,
          fetched: !1,
          customFields: [],
          categories: [],
          coupons: [],
          settings: {},
        };
      },
      created: function () {
        this.fetchData(), this.getEntities();
      },
      updated: function () {
        this.inlineSVG();
      },
      mounted: function () {
        this.inlineSVG();
      },
      methods: {
        fetchData: function () {
          var e = this;
          this.$http
            .get(this.$root.getAjaxUrl + "/settings")
            .then(function (t) {
              e.fetched = !0;
              var a = t.data.data.settings;
              for (var s in (a.weekSchedule.forEach(function (e) {
                (e.form = {
                  type: null,
                  isNew: null,
                  index: null,
                  show: !1,
                  data: {},
                }),
                  e.time[0] && e.time[1]
                    ? "periods" in e && 0 !== e.periods.length
                      ? e.periods.forEach(function (e) {
                          (e.id = null),
                            (e.serviceIds = []),
                            (e.periodServiceList = []),
                            (e.time = [e.time[0], e.time[1]]);
                        })
                      : (e.periods = [
                          {
                            time: [e.time[0], e.time[1]],
                            id: null,
                            serviceIds: [],
                            periodServiceList: [],
                          },
                        ])
                    : (e.periods = []);
              }),
              a.payments.wc.checkoutData.translations ||
                (a.payments.wc.checkoutData.translations = {
                  appointment: {},
                  event: {},
                  package: {},
                }),
              ("appointment" in a.payments.wc.checkoutData.translations &&
                a.payments.wc.checkoutData.translations.appointment) ||
                (a.payments.wc.checkoutData.translations.appointment = {}),
              ("event" in a.payments.wc.checkoutData.translations &&
                a.payments.wc.checkoutData.translations.event) ||
                (a.payments.wc.checkoutData.translations.event = {}),
              ("package" in a.payments.wc.checkoutData.translations &&
                a.payments.wc.checkoutData.translations.package) ||
                (a.payments.wc.checkoutData.translations.package = {}),
              e.$root.settings.general.usedLanguages.forEach(function (e) {
                e in a.payments.wc.checkoutData.translations.appointment ||
                  (a.payments.wc.checkoutData.translations.appointment[e] = ""),
                  e in a.payments.wc.checkoutData.translations.event ||
                    (a.payments.wc.checkoutData.translations.event[e] = ""),
                  e in a.payments.wc.checkoutData.translations.package ||
                    (a.payments.wc.checkoutData.translations.package[e] = "");
              }),
              (e.settings = a),
              e.settings.notifications))
                s = s.trim();
              e.openActiveSettingFromQueryParameter(),
                e.handleEnvatoActivation();
            })
            .catch(function (t) {
              console.log(t.message), (e.fetched = !0);
            });
        },
        updateSettings: function (e) {
          var t = this,
            a =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : null,
            s =
              !(arguments.length > 2 && void 0 !== arguments[2]) ||
              arguments[2];
          for (var o in e)
            e.hasOwnProperty(o) &&
              "weekSchedule" !== o &&
              (this.settings[o] = e[o]);
          for (var i in ((this.settings.customization = null),
          this.settings.notifications))
            i = i.trim();
          var n = JSON.parse(JSON.stringify(this.settings));
          (n.weekSchedule = e.weekSchedule),
            this.$http
              .post(this.$root.getAjaxUrl + "/settings", n)
              .then(function (e) {
                (t.$root.settings = e.data.data.settings),
                  !0 === s &&
                    t.notify(
                      t.$root.labels.success,
                      a || t.$root.labels.settings_saved,
                      "success"
                    );
              })
              .catch(function (e) {
                t.notify(t.$root.labels.error, e.message, "error");
              });
        },
        showDialogSettingsGeneral: function () {
          this.dialogSettingsGeneral = !0;
        },
        showDialogSettingsCompany: function () {
          this.dialogSettingsCompany = !0;
        },
        showDialogSettingsWorkHoursDaysOff: function () {
          this.dialogSettingsWorkHoursDaysOff = !0;
        },
        showDialogSettingsNotifications: function () {
          this.dialogSettingsNotifications = !0;
        },
        showDialogSettingsPayments: function () {
          this.dialogSettingsPayments = !0;
        },
        showDialogSettingsIntegrations: function () {
          this.dialogSettingsIntegrations = !0;
        },
        showDialogSettingsLabels: function () {
          this.dialogSettingsLabels = !0;
        },
        showDialogSettingsActivation: function () {
          this.dialogSettingsActivation = !0;
        },
        showDialogSettingsRoles: function () {
          this.dialogSettingsRoles = !0;
        },
        showDialogSettingsAppointments: function () {
          this.dialogSettingsAppointments = !0;
        },
        getEntities: function () {
          var e = this;
          this.$http
            .get(this.$root.getAjaxUrl + "/entities", {
              params: {
                types: ["custom_fields", "categories", "coupons", "settings"],
              },
            })
            .then(function (t) {
              (e.customFields = t.data.data.customFields),
                (e.coupons = t.data.data.coupons),
                (e.categories = t.data.data.categories),
                (e.languagesData = t.data.data.settings.languages);
            })
            .catch(function (e) {
              console.log(e.message);
            });
        },
        showDialogTranslate: function (e) {
          (this.dialogTranslateTab = "service"),
            (this.dialogTranslateType = "url"),
            (this.dialogTranslateData = this.settings.roles.customerCabinet
              .translations
              ? JSON.stringify(this.settings.roles.customerCabinet.translations)
              : ""),
            (this.dialogTranslateName = e),
            (this.dialogTranslate = !0);
        },
        saveDialogTranslate: function (e, t, a) {
          (this.settings.general.usedLanguages =
            this.settings.general.usedLanguages.concat(t)),
            (this.dialogTranslate = !1),
            (this.settings.roles.customerCabinet.translations = e
              ? JSON.parse(e)
              : []);
        },
        closeDialogTranslate: function () {
          this.dialogTranslate = !1;
        },
        openActiveSettingFromQueryParameter: function () {
          var e = this.getUrlQueryParams(window.location.href).activeSetting;
          if (e && "activation" === e) {
            this.showDialogSettingsActivation();
            var t = this.removeURLParameter(
              window.location.href,
              "activeSetting"
            );
            history.pushState(null, null, t + "#/settings");
          }
        },
        handleEnvatoActivation: function () {
          var e = this.getUrlQueryParams(window.location.href);
          e.valid &&
            e.domainRegistered &&
            ((this.settings.activation.envatoTokenEmail =
              void 0 !== e.envatoTokenEmail ? e.envatoTokenEmail : ""),
            (this.settings.activation.active =
              "true" === e.valid && "true" === e.domainRegistered),
            this.updateSettings(this.settings, null, !1),
            this.showDialogSettingsActivation());
        },
      },
    };
  },
  1265: function (e, t, a) {
    var s = a(685)(a(1266), a(1267), !1, null, null, null);
    e.exports = s.exports;
  },
  1266: function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var s = a(687),
      o = a(686),
      i = a(691);
    t.default = {
      mixins: [s.a, o.a, i.a],
      props: { activation: { type: Object } },
      data: function () {
        var e = this;
        return {
          loadingActivation: !1,
          settings: Object.assign({}, this.activation),
          rules: {
            code: [
              {
                validator: function (t, a, s) {
                  var o = location.hostname,
                    i = location.hostname;
                  e.$http
                    .get(e.$root.getAjaxUrl + "/activation/code", {
                      params: {
                        purchaseCodeStore: e.settings.purchaseCodeStore,
                        domain: o,
                        subdomain: i,
                      },
                    })
                    .then(function (t) {
                      !1 === t.data.data.valid
                        ? s(
                            new Error(
                              e.$root.labels.activation_settings_invalid_code
                            )
                          )
                        : !1 === t.data.data.domainRegistered
                        ? s(
                            new Error(
                              e.$root.labels.activation_settings_domains_limit
                            )
                          )
                        : ((e.settings.active = !0), s());
                    })
                    .catch(function (t) {
                      console.log(t), (e.loadingActivation = !1);
                    });
                },
                trigger: "submit",
              },
            ],
          },
        };
      },
      created: function () {
        this.authenticateEnvatoOAuthCallback();
      },
      mounted: function () {
        !0 === this.settings.active &&
          this.settings.purchaseCodeStore &&
          (this.settings.purchaseCodeStore = null);
      },
      methods: {
        closeDialog: function () {
          this.$emit("closeDialogSettingsActivation");
        },
        activatePlugin: function () {
          var e = this;
          (this.loadingActivation = !0),
            this.$refs.settings.validate(function (t) {
              if (!t) return (e.loadingActivation = !1), !1;
              (e.loadingActivation = !1),
                e.$emit("closeDialogSettingsActivation"),
                e.$emit(
                  "updateSettings",
                  { activation: e.settings },
                  e.$root.labels.activation_activated
                );
            });
        },
        deletePluginTables: function () {
          this.$emit("updateSettings", { activation: this.settings });
        },
        stashEntities: function () {
          this.$emit("updateSettings", { activation: this.settings });
        },
        deactivatePlugin: function () {
          var e = this;
          this.loadingActivation = !0;
          var t = "",
            a = {},
            s = location.hostname,
            o = location.hostname;
          null === this.settings.purchaseCodeStore
            ? ((t = "/activation/code/deactivate"),
              (a = { domain: s, subdomain: o }))
            : this.settings.envatoTokenEmail &&
              ((t = "/activation/envato/deactivate"),
              (a = {
                envatoTokenEmail: this.settings.envatoTokenEmail,
                domain: s,
                subdomain: o,
              })),
            this.$http
              .get("" + (this.$root.getAjaxUrl + t), { params: a })
              .then(function (t) {
                !0 === t.data.data.deactivated
                  ? ((e.loadingActivation = !1),
                    (e.settings.active = !1),
                    (e.settings.purchaseCodeStore = ""),
                    (e.settings.envatoTokenEmail = ""),
                    e.$emit("closeDialogSettingsActivation"),
                    e.$emit(
                      "updateSettings",
                      { activation: e.settings },
                      e.$root.labels.activation_deactivated
                    ))
                  : (e.notify(
                      e.$root.labels.error,
                      e.$root.labels.unable_to_deactivate_plugin,
                      "error"
                    ),
                    (e.loadingActivation = !1));
              })
              .catch(function () {
                e.notify(
                  e.$root.labels.error,
                  e.$root.labels.unable_to_deactivate_plugin,
                  "error"
                ),
                  (e.loadingActivation = !1);
              });
        },
        authenticateEnvatoOAuth: function () {
          var e = this,
            t = location.hostname,
            a = location.hostname;
          this.$http
            .post(this.$root.getAjaxUrl + "/activation/parse-domain", {
              domain: t,
              subdomain: a,
            })
            .then(function (t) {
              window.location.replace(
                e.$root.getStoreUrl +
                  "activation/envato?slug=ameliabooking&domain=" +
                  t.data.data.domain +
                  "&subdomain=" +
                  t.data.data.subdomain +
                  "&redirectUrl=" +
                  e.$root.getSiteUrl +
                  "/wp-admin/admin.php?page=wpamelia-settings#/settings"
              );
            })
            .catch(function () {
              e.notify(
                e.$root.labels.error,
                e.$root.labels.activation_envato_failed,
                "error"
              ),
                (e.loadingActivation = !1);
            });
        },
        authenticateEnvatoOAuthCallback: function () {
          var e = this.getUrlQueryParams(window.location.href);
          if (e.valid && e.domainRegistered) {
            var t = this.removeURLParameter(window.location.href, "valid");
            (t = this.removeURLParameter(t, "domainRegistered")),
              (t = this.removeURLParameter(t, "slug")),
              e.envatoTokenEmail
                ? ((t = this.removeURLParameter(t, "envatoTokenEmail")),
                  this.notify(
                    this.$root.labels.success,
                    this.$root.labels.activation_activated,
                    "success"
                  ))
                : "false" === e.valid
                ? this.notify(
                    this.$root.labels.error,
                    this.$root.labels.activation_envato_failed,
                    "error"
                  )
                : "false" === e.domainRegistered &&
                  this.notify(
                    this.$root.labels.error,
                    this.$root.labels.activation_settings_domains_limit,
                    "error"
                  ),
              history.pushState(null, null, t + "#/settings");
          }
        },
        clearValidation: function () {
          void 0 !== this.$refs.settings && this.$refs.settings.clearValidate();
        },
      },
    };
  },
  1267: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("div", [
          a(
            "div",
            { staticClass: "am-dialog-scrollable" },
            [
              a(
                "div",
                { staticClass: "am-dialog-header" },
                [
                  a(
                    "el-row",
                    [
                      a("el-col", { attrs: { span: 20 } }, [
                        a("h2", [
                          e._v(e._s(e.$root.labels.activation_settings)),
                        ]),
                      ]),
                      e._v(" "),
                      a(
                        "el-col",
                        { staticClass: "align-right", attrs: { span: 4 } },
                        [
                          a("el-button", {
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
              a(
                "el-form",
                {
                  ref: "settings",
                  attrs: {
                    model: e.settings,
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
                  !1 === e.settings.active
                    ? a("el-alert", {
                        staticClass: "am-activation-alert",
                        attrs: {
                          type: "info",
                          "show-icon": "",
                          title: "",
                          description:
                            e.$root.labels.activation_settings_explanation,
                          closable: !1,
                        },
                      })
                    : e._e(),
                  e._v(" "),
                  !1 === e.settings.active ||
                  (!0 === e.settings.active &&
                    null === e.settings.purchaseCodeStore)
                    ? a(
                        "el-form-item",
                        {
                          staticClass: "am-purchase-code",
                          attrs: {
                            label:
                              !1 === e.settings.active
                                ? e.$root.labels.purchase_code + ":"
                                : "",
                            prop: "code",
                          },
                        },
                        [
                          a(
                            "el-col",
                            {
                              attrs: {
                                span: !0 === e.settings.active ? 24 : 18,
                              },
                            },
                            [
                              !1 === e.settings.active
                                ? a(
                                    "el-input",
                                    {
                                      attrs: {
                                        disabled: !0 === e.settings.active,
                                        "auto-complete": "off",
                                      },
                                      on: { input: e.clearValidation },
                                      model: {
                                        value: e.settings.purchaseCodeStore,
                                        callback: function (t) {
                                          e.$set(
                                            e.settings,
                                            "purchaseCodeStore",
                                            "string" == typeof t ? t.trim() : t
                                          );
                                        },
                                        expression:
                                          "settings.purchaseCodeStore",
                                      },
                                    },
                                    [
                                      !0 === e.settings.active &&
                                      e.settings.purchaseCodeStore
                                        ? a("i", {
                                            staticClass: "el-icon-circle-check",
                                            attrs: { slot: "suffix" },
                                            slot: "suffix",
                                          })
                                        : e._e(),
                                    ]
                                  )
                                : a(
                                    "div",
                                    { staticClass: "am-purchase-code-hidden" },
                                    [
                                      a("i", { staticClass: "el-icon-info" }),
                                      e._v(" "),
                                      a("p", [
                                        e._v(
                                          "\n              " +
                                            e._s(
                                              e.$root.labels
                                                .activation_settings_hidden_code
                                            ) +
                                            "\n              "
                                        ),
                                        a(
                                          "a",
                                          {
                                            attrs: {
                                              href: "https://store.tms-plugins.com/login",
                                              target: "_blank",
                                            },
                                          },
                                          [e._v("store.tms-plugins.com")]
                                        ),
                                      ]),
                                    ]
                                  ),
                            ],
                            1
                          ),
                          e._v(" "),
                          !1 === e.settings.active
                            ? a(
                                "el-col",
                                { attrs: { span: 6 } },
                                [
                                  a(
                                    "el-button",
                                    {
                                      staticClass: "am-activate-plugin",
                                      attrs: {
                                        type: "primary",
                                        loading: e.loadingActivation,
                                      },
                                      on: { click: e.activatePlugin },
                                    },
                                    [
                                      e._v(
                                        "\n            " +
                                          e._s(e.$root.labels.activate) +
                                          "\n          "
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
                  !1 === e.settings.active ||
                  (!0 === e.settings.active &&
                    "" !== e.settings.envatoTokenEmail)
                    ? a(
                        "el-form-item",
                        {
                          staticClass: "am-envato-activation",
                          attrs: { label: e.$root.labels.envato_api + ":" },
                        },
                        [
                          a(
                            "el-button",
                            {
                              staticClass: "am-envato-activation-button",
                              attrs: { disabled: !0 === e.settings.active },
                              on: { click: e.authenticateEnvatoOAuth },
                            },
                            [
                              a("img", {
                                staticClass: "am-envato-activation-logo",
                                attrs: {
                                  src: e.$root.getUrl + "public/img/envato.svg",
                                },
                              }),
                              e._v(
                                "\n          " +
                                  e._s(
                                    "" !== e.settings.envatoTokenEmail
                                      ? e.$root.labels.envato_api_activated
                                      : e.$root.labels.envato_api_activate
                                  ) +
                                  "\n        "
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
              a(
                "div",
                { staticClass: "am-setting-box am-switch-box" },
                [
                  a(
                    "el-row",
                    { attrs: { type: "flex", align: "middle", gutter: 24 } },
                    [
                      a(
                        "el-col",
                        { attrs: { span: 20 } },
                        [
                          e._v(
                            "\n          " +
                              e._s(e.$root.labels.delete_tables) +
                              "\n          "
                          ),
                          a("el-tooltip", { attrs: { placement: "top" } }, [
                            a("div", {
                              attrs: { slot: "content" },
                              domProps: {
                                innerHTML: e._s(
                                  e.$root.labels.delete_tables_tooltip
                                ),
                              },
                              slot: "content",
                            }),
                            e._v(" "),
                            a("i", {
                              staticClass: "el-icon-question am-tooltip-icon",
                            }),
                          ]),
                        ],
                        1
                      ),
                      e._v(" "),
                      a(
                        "el-col",
                        { staticClass: "align-right", attrs: { span: 4 } },
                        [
                          a("el-switch", {
                            attrs: { "active-text": "", "inactive-text": "" },
                            on: { change: e.deletePluginTables },
                            model: {
                              value: e.settings.deleteTables,
                              callback: function (t) {
                                e.$set(e.settings, "deleteTables", t);
                              },
                              expression: "settings.deleteTables",
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
              a(
                "div",
                { staticClass: "am-setting-box am-switch-box" },
                [
                  a(
                    "el-row",
                    { attrs: { type: "flex", align: "middle", gutter: 24 } },
                    [
                      a(
                        "el-col",
                        { attrs: { span: 20 } },
                        [
                          e._v(
                            "\n          " +
                              e._s(e.$root.labels.stash_entities) +
                              "\n          "
                          ),
                          a("el-tooltip", { attrs: { placement: "top" } }, [
                            a("div", {
                              attrs: { slot: "content" },
                              domProps: {
                                innerHTML: e._s(
                                  e.$root.labels.stash_entities_tooltip
                                ),
                              },
                              slot: "content",
                            }),
                            e._v(" "),
                            a("i", {
                              staticClass: "el-icon-question am-tooltip-icon",
                            }),
                          ]),
                        ],
                        1
                      ),
                      e._v(" "),
                      a(
                        "el-col",
                        { staticClass: "align-right", attrs: { span: 4 } },
                        [
                          a("el-switch", {
                            attrs: { "active-text": "", "inactive-text": "" },
                            on: { change: e.stashEntities },
                            model: {
                              value: e.settings.stash,
                              callback: function (t) {
                                e.$set(e.settings, "stash", t);
                              },
                              expression: "settings.stash",
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
          a("div", { staticClass: "am-dialog-footer" }, [
            a(
              "div",
              { staticClass: "am-dialog-footer-actions" },
              [
                a(
                  "el-row",
                  [
                    a(
                      "el-col",
                      { staticClass: "align-right", attrs: { sm: 24 } },
                      [
                        a(
                          "el-button",
                          { attrs: { type: "" }, on: { click: e.closeDialog } },
                          [e._v(e._s(e.$root.labels.close))]
                        ),
                        e._v(" "),
                        !0 === e.settings.active
                          ? a(
                              "el-button",
                              {
                                staticClass: "am-dialog-create",
                                attrs: {
                                  type: "danger",
                                  loading: e.loadingActivation,
                                },
                                on: { click: e.deactivatePlugin },
                              },
                              [
                                e._v(
                                  "\n            " +
                                    e._s(e.$root.labels.deactivate) +
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
        ]);
      },
      staticRenderFns: [],
    };
  },
  1268: function (e, t, a) {
    var s = a(685)(a(1269), a(1270), !1, null, null, null);
    e.exports = s.exports;
  },
  1269: function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var s = a(687);
    t.default = {
      mixins: [s.a],
      props: ["appointments"],
      data: function () {
        return { settings: Object.assign({}, this.appointments) };
      },
      updated: function () {
        this.inlineSVG();
      },
      mounted: function () {
        this.inlineSVG();
      },
      methods: {
        closeDialog: function () {
          this.$emit("closeDialogSettingsAppointments");
        },
        onSubmit: function () {
          this.$emit("closeDialogSettingsAppointments"),
            this.$emit("updateSettings", { appointments: this.settings });
        },
      },
    };
  },
  1270: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("div", [
          a(
            "div",
            { staticClass: "am-dialog-scrollable" },
            [
              a(
                "div",
                { staticClass: "am-dialog-header" },
                [
                  a(
                    "el-row",
                    [
                      a("el-col", { attrs: { span: 20 } }, [
                        a("h2", [
                          e._v(e._s(e.$root.labels.appointments_settings)),
                        ]),
                      ]),
                      e._v(" "),
                      a(
                        "el-col",
                        { staticClass: "align-right", attrs: { span: 4 } },
                        [
                          a("el-button", {
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
              a(
                "el-form",
                {
                  ref: "settings",
                  attrs: { model: e.settings, "label-position": "top" },
                  on: {
                    submit: function (t) {
                      return t.preventDefault(), e.onSubmit(t);
                    },
                  },
                },
                [
                  a(
                    "div",
                    { staticClass: "am-setting-box am-switch-box" },
                    [
                      a(
                        "el-row",
                        {
                          attrs: { type: "flex", align: "middle", gutter: 24 },
                        },
                        [
                          a(
                            "el-col",
                            { attrs: { span: 16 } },
                            [
                              e._v(
                                "\n                        " +
                                  e._s(
                                    e.$root.labels.allow_booking_if_pending
                                  ) +
                                  ":\n                        "
                              ),
                              a("el-tooltip", { attrs: { placement: "top" } }, [
                                a("div", {
                                  attrs: { slot: "content" },
                                  domProps: {
                                    innerHTML: e._s(
                                      e.$root.labels
                                        .allow_booking_if_pending_tooltip
                                    ),
                                  },
                                  slot: "content",
                                }),
                                e._v(" "),
                                a("i", {
                                  staticClass:
                                    "el-icon-question am-tooltip-icon",
                                }),
                              ]),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-col",
                            { staticClass: "align-right", attrs: { span: 8 } },
                            [
                              a("el-switch", {
                                attrs: {
                                  "active-text": "",
                                  "inactive-text": "",
                                },
                                model: {
                                  value: e.settings.allowBookingIfPending,
                                  callback: function (t) {
                                    e.$set(
                                      e.settings,
                                      "allowBookingIfPending",
                                      t
                                    );
                                  },
                                  expression: "settings.allowBookingIfPending",
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
                  a(
                    "div",
                    { staticClass: "am-setting-box am-switch-box" },
                    [
                      a(
                        "el-row",
                        {
                          attrs: { type: "flex", align: "middle", gutter: 24 },
                        },
                        [
                          a(
                            "el-col",
                            { attrs: { span: 16 } },
                            [
                              e._v(
                                "\n                        " +
                                  e._s(
                                    e.$root.labels.allow_booking_if_not_min
                                  ) +
                                  ":\n                        "
                              ),
                              a("el-tooltip", { attrs: { placement: "top" } }, [
                                a("div", {
                                  attrs: { slot: "content" },
                                  domProps: {
                                    innerHTML: e._s(
                                      e.$root.labels
                                        .allow_booking_if_not_min_tooltip
                                    ),
                                  },
                                  slot: "content",
                                }),
                                e._v(" "),
                                a("i", {
                                  staticClass:
                                    "el-icon-question am-tooltip-icon",
                                }),
                              ]),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-col",
                            { staticClass: "align-right", attrs: { span: 8 } },
                            [
                              a("el-switch", {
                                attrs: {
                                  "active-text": "",
                                  "inactive-text": "",
                                },
                                model: {
                                  value: e.settings.allowBookingIfNotMin,
                                  callback: function (t) {
                                    e.$set(
                                      e.settings,
                                      "allowBookingIfNotMin",
                                      t
                                    );
                                  },
                                  expression: "settings.allowBookingIfNotMin",
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
                ]
              ),
            ],
            1
          ),
          e._v(" "),
          a("div", { staticClass: "am-dialog-footer" }, [
            a(
              "div",
              { staticClass: "am-dialog-footer-actions" },
              [
                a(
                  "el-row",
                  [
                    a(
                      "el-col",
                      { staticClass: "align-right", attrs: { sm: 24 } },
                      [
                        a(
                          "el-button",
                          { attrs: { type: "" }, on: { click: e.closeDialog } },
                          [e._v(e._s(e.$root.labels.cancel))]
                        ),
                        e._v(" "),
                        a(
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
  1271: function (e, t, a) {
    var s = a(685)(a(1272), a(1273), !1, null, null, null);
    e.exports = s.exports;
  },
  1272: function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var s = a(696),
      o = a.n(s),
      i = a(792),
      n = a.n(i),
      l = a(955),
      r = a.n(l),
      c = a(687);
    t.default = {
      mixins: [c.a],
      props: ["company"],
      data: function () {
        return { settings: Object.assign({}, this.company) };
      },
      created: function () {},
      updated: function () {
        this.inlineSVG();
      },
      mounted: function () {
        this.inlineSVG();
      },
      methods: {
        closeDialog: function () {
          this.$emit("closeDialogSettingsCompany");
        },
        onSubmit: function () {
          this.$emit("closeDialogSettingsCompany"),
            this.$emit("updateSettings", { company: this.settings });
        },
        pictureSelected: function (e, t) {
          (this.settings.pictureFullPath = e),
            (this.settings.pictureThumbPath = t);
        },
        getAddressData: function () {
          this.settings.address = document.getElementById(
            "address-autocomplete"
          ).value;
        },
        phoneFormatted: function (e, t) {
          (this.settings.phone = e), (this.settings.countryPhoneIso = t);
        },
      },
      components: {
        VueGoogleAutocomplete: r.a,
        PhoneInput: o.a,
        PictureUpload: n.a,
      },
    };
  },
  1273: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("div", [
          a(
            "div",
            { staticClass: "am-dialog-scrollable" },
            [
              a(
                "div",
                { staticClass: "am-dialog-header" },
                [
                  a(
                    "el-row",
                    [
                      a("el-col", { attrs: { span: 20 } }, [
                        a("h2", [e._v(e._s(e.$root.labels.company_settings))]),
                      ]),
                      e._v(" "),
                      a(
                        "el-col",
                        { staticClass: "align-right", attrs: { span: 4 } },
                        [
                          a("el-button", {
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
              a(
                "el-form",
                {
                  ref: "settings",
                  attrs: { model: e.settings, "label-position": "top" },
                  on: {
                    submit: function (t) {
                      return t.preventDefault(), e.onSubmit(t);
                    },
                  },
                },
                [
                  a(
                    "div",
                    { staticClass: "am-employee-profile" },
                    [
                      a("picture-upload", {
                        attrs: {
                          "edited-entity": this.settings,
                          "entity-name": "company",
                        },
                        on: { pictureSelected: e.pictureSelected },
                      }),
                      e._v(" "),
                      a("h2", [e._v(e._s(e.settings.name))]),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-form-item",
                    { attrs: { label: e.$root.labels.name + ":" } },
                    [
                      a("el-input", {
                        attrs: { placeholder: "" },
                        model: {
                          value: e.settings.name,
                          callback: function (t) {
                            e.$set(e.settings, "name", t);
                          },
                          expression: "settings.name",
                        },
                      }),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-form-item",
                    { attrs: { label: e.$root.labels.address + ":" } },
                    [
                      a(
                        "div",
                        { staticClass: "el-input" },
                        [
                          "" !== e.$root.settings.general.gMapApiKey
                            ? a("vue-google-autocomplete", {
                                ref: "settings.address",
                                attrs: {
                                  id: "address-autocomplete",
                                  classname: "el-input__inner",
                                  placeholder: "",
                                  value: e.settings.address,
                                },
                                on: { placechanged: e.getAddressData },
                              })
                            : a("el-input", {
                                attrs: {
                                  value: e.settings.address,
                                  placeholder: "",
                                },
                                model: {
                                  value: e.settings.address,
                                  callback: function (t) {
                                    e.$set(e.settings, "address", t);
                                  },
                                  expression: "settings.address",
                                },
                              }),
                        ],
                        1
                      ),
                    ]
                  ),
                  e._v(" "),
                  a(
                    "el-form-item",
                    { attrs: { label: e.$root.labels.website + ":" } },
                    [
                      a("el-input", {
                        attrs: { placeholder: "" },
                        model: {
                          value: e.settings.website,
                          callback: function (t) {
                            e.$set(e.settings, "website", t);
                          },
                          expression: "settings.website",
                        },
                      }),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-form-item",
                    { attrs: { label: e.$root.labels.phone + ":" } },
                    [
                      a("phone-input", {
                        attrs: {
                          countryPhoneIso: e.settings.countryPhoneIso,
                          savedPhone: e.settings.phone,
                        },
                        on: { phoneFormatted: e.phoneFormatted },
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
          a("div", { staticClass: "am-dialog-footer" }, [
            a(
              "div",
              { staticClass: "am-dialog-footer-actions" },
              [
                a(
                  "el-row",
                  [
                    a(
                      "el-col",
                      { staticClass: "align-right", attrs: { sm: 24 } },
                      [
                        a(
                          "el-button",
                          { attrs: { type: "" }, on: { click: e.closeDialog } },
                          [e._v(e._s(e.$root.labels.cancel))]
                        ),
                        e._v(" "),
                        a(
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
  1274: function (e, t, a) {
    var s = a(685)(a(1275), a(1276), !1, null, null, null);
    e.exports = s.exports;
  },
  1275: function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var s = a(687),
      o = a(700),
      i = a(686);
    t.default = {
      mixins: [s.a, o.a, i.a],
      props: {
        general: { type: Object },
        languagesData: { default: function () {}, type: Object },
      },
      data: function () {
        var e = this;
        return {
          settings: Object.assign({}, this.general),
          rules: {
            googleRecaptcha: {},
            redirectURLAfter: [
              {
                validator: function (t, a, s) {
                  e.clearValidation();
                  var o = e.$refs.settings.model.redirectUrlAfterAppointment;
                  "" === o || /^((http|https):\/\/)/.test(o)
                    ? s()
                    : s(new Error(e.$root.labels.enter_valid_url_warning));
                },
                trigger: "submit",
              },
            ],
          },
          errors: { redirectURLAfter: "" },
          options: {
            timeSlotLength: [
              { label: this.$root.labels.min1, value: 60 },
              { label: this.$root.labels.min2, value: 120 },
              { label: this.$root.labels.min5, value: 300 },
              { label: this.$root.labels.min10, value: 600 },
              { label: this.$root.labels.min12, value: 720 },
              { label: this.$root.labels.min15, value: 900 },
              { label: this.$root.labels.min20, value: 1200 },
              { label: this.$root.labels.min30, value: 1800 },
              { label: this.$root.labels.min45, value: 2700 },
              { label: this.$root.labels.h1, value: 3600 },
              { label: this.$root.labels.h1min30, value: 5400 },
              { label: this.$root.labels.h2, value: 7200 },
              { label: this.$root.labels.h3, value: 10800 },
              { label: this.$root.labels.h4, value: 14400 },
              { label: this.$root.labels.h6, value: 21600 },
              { label: this.$root.labels.h8, value: 28800 },
            ],
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
            itemsPerPage: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30],
            defaultPageOnBackend: [
              { label: this.$root.labels.dashboard, value: "Dashboard" },
              { label: this.$root.labels.calendar, value: "Calendar" },
              { label: this.$root.labels.appointments, value: "Appointments" },
              { label: this.$root.labels.events, value: "Events" },
            ],
          },
        };
      },
      updated: function () {
        this.inlineSVG();
      },
      mounted: function () {
        this.inlineSVG(),
          this.handleRecaptchaValidationRules(),
          this.countries.unshift({
            id: 0,
            iso: "auto",
            nicename: this.$root.labels.identify_country_code,
          });
      },
      methods: {
        getLanguageLabel: function (e) {
          return this.languagesData[e] ? this.languagesData[e].name : "";
        },
        getLanguageFlag: function (e) {
          return e &&
            this.languagesData[e] &&
            this.languagesData[e].country_code
            ? this.$root.getUrl +
                "public/img/flags/" +
                this.languagesData[e].country_code +
                ".png"
            : this.$root.getUrl + "public/img/grey.svg";
        },
        handleRecaptchaValidationRules: function () {
          this.clearValidation(),
            !0 === this.settings.googleRecaptcha.enabled
              ? (this.rules.googleRecaptcha = {
                  siteKey: [
                    {
                      required: !0,
                      message: this.$root.labels.recaptcha_site_key_error,
                      trigger: "submit",
                    },
                  ],
                  secret: [
                    {
                      required: !0,
                      message: this.$root.labels.recaptcha_secret_error,
                      trigger: "submit",
                    },
                  ],
                })
              : (this.rules.googleRecaptcha = { siteKey: {}, secret: {} });
        },
        closeDialog: function () {
          this.$emit("closeDialogSettingsGeneral");
        },
        onSubmit: function () {
          var e = this;
          this.$refs.settings.validate(function (t) {
            if (!t) return !1;
            e.$emit("closeDialogSettingsGeneral"),
              e.$emit("updateSettings", { general: e.settings });
          });
        },
        clearValidation: function () {
          this.$refs.settings.clearValidate();
        },
        changeNumberOfDaysAvailableForBooking: function (e) {
          this.settings.numberOfDaysAvailableForBooking =
            void 0 === e ? 365 : e;
        },
      },
    };
  },
  /**
   * p2p: add option for maximum number of lessons allowed to bookings
   * @param e
   * @param t
   */
  1276: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("div", [
          a(
            "div",
            { staticClass: "am-dialog-scrollable" },
            [
              a(
                "div",
                { staticClass: "am-dialog-header" },
                [
                  a(
                    "el-row",
                    [
                      a("el-col", { attrs: { span: 20 } }, [
                        a("h2", [e._v(e._s(e.$root.labels.general_settings))]),
                      ]),
                      e._v(" "),
                      a(
                        "el-col",
                        { staticClass: "align-right", attrs: { span: 4 } },
                        [
                          a("el-button", {
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
              a(
                "el-form",
                {
                  ref: "settings",
                  attrs: {
                    model: e.settings,
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
                  a(
                    "el-row",
                    { attrs: { gutter: 24 } },
                    [
                      a(
                        "el-col",
                        { attrs: { span: 12 } },
                        [
                          a(
                            "el-form-item",
                            { attrs: { label: "placeholder" } },
                            [
                              a(
                                "label",
                                { attrs: { slot: "label" }, slot: "label" },
                                [
                                  e._v(
                                    "\n              " +
                                      e._s(
                                        e.$root.labels.default_time_slot_step
                                      ) +
                                      ":\n              "
                                  ),
                                  a(
                                    "el-tooltip",
                                    { attrs: { placement: "top" } },
                                    [
                                      a("div", {
                                        attrs: { slot: "content" },
                                        domProps: {
                                          innerHTML: e._s(
                                            e.$root.labels
                                              .default_time_slot_step_tooltip
                                          ),
                                        },
                                        slot: "content",
                                      }),
                                      e._v(" "),
                                      a("i", {
                                        staticClass:
                                          "el-icon-question am-tooltip-icon",
                                      }),
                                    ]
                                  ),
                                ],
                                1
                              ),
                              e._v(" "),
                              a(
                                "el-select",
                                {
                                  model: {
                                    value: e.settings.timeSlotLength,
                                    callback: function (t) {
                                      e.$set(e.settings, "timeSlotLength", t);
                                    },
                                    expression: "settings.timeSlotLength",
                                  },
                                },
                                e._l(e.options.timeSlotLength, function (e) {
                                  return a("el-option", {
                                    key: e.value,
                                    attrs: { label: e.label, value: e.value },
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
                      a(
                        "el-col",
                        { attrs: { span: 12 } },
                        [
                          a(
                            "el-form-item",
                            { attrs: { label: "placeholder" } },
                            [
                              a(
                                "label",
                                { attrs: { slot: "label" }, slot: "label" },
                                [
                                  e._v(
                                    "\n              " +
                                      e._s(
                                        e.$root.labels
                                          .default_appointment_status
                                      ) +
                                      ":\n              "
                                  ),
                                  a(
                                    "el-tooltip",
                                    { attrs: { placement: "top" } },
                                    [
                                      a("div", {
                                        attrs: { slot: "content" },
                                        domProps: {
                                          innerHTML: e._s(
                                            e.$root.labels
                                              .default_appointment_status_tooltip
                                          ),
                                        },
                                        slot: "content",
                                      }),
                                      e._v(" "),
                                      a("i", {
                                        staticClass:
                                          "el-icon-question am-tooltip-icon",
                                      }),
                                    ]
                                  ),
                                ],
                                1
                              ),
                              e._v(" "),
                              a(
                                "el-select",
                                {
                                  model: {
                                    value: e.settings.defaultAppointmentStatus,
                                    callback: function (t) {
                                      e.$set(
                                        e.settings,
                                        "defaultAppointmentStatus",
                                        t
                                      );
                                    },
                                    expression:
                                      "settings.defaultAppointmentStatus",
                                  },
                                },
                                e._l(
                                  e.options.defaultAppointmentStatus,
                                  function (e) {
                                    return a("el-option", {
                                      key: e.value,
                                      attrs: { label: e.label, value: e.value },
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
                  a(
                    "div",
                    { staticClass: "am-setting-box am-switch-box" },
                    [
                      a(
                        "el-row",
                        {
                          attrs: { type: "flex", align: "middle", gutter: 24 },
                        },
                        [
                          a(
                            "el-col",
                            { attrs: { span: 16 } },
                            [
                              e._v(
                                "\n            " +
                                  e._s(
                                    e.$root.labels.service_duration_as_slot
                                  ) +
                                  "\n            "
                              ),
                              a("el-tooltip", { attrs: { placement: "top" } }, [
                                a("div", {
                                  attrs: { slot: "content" },
                                  domProps: {
                                    innerHTML: e._s(
                                      e.$root.labels
                                        .service_duration_as_slot_tooltip
                                    ),
                                  },
                                  slot: "content",
                                }),
                                e._v(" "),
                                a("i", {
                                  staticClass:
                                    "el-icon-question am-tooltip-icon",
                                }),
                              ]),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-col",
                            { staticClass: "align-right", attrs: { span: 8 } },
                            [
                              a("el-switch", {
                                attrs: {
                                  "active-text": "",
                                  "inactive-text": "",
                                },
                                model: {
                                  value: e.settings.serviceDurationAsSlot,
                                  callback: function (t) {
                                    e.$set(
                                      e.settings,
                                      "serviceDurationAsSlot",
                                      t
                                    );
                                  },
                                  expression: "settings.serviceDurationAsSlot",
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
                  a(
                    "div",
                    { staticClass: "am-setting-box am-switch-box" },
                    [
                      a(
                        "el-row",
                        {
                          attrs: { type: "flex", align: "middle", gutter: 24 },
                        },
                        [
                          a(
                            "el-col",
                            { attrs: { span: 16 } },
                            [
                              e._v(
                                "\n            " +
                                  e._s(e.$root.labels.buffer_time_in_slot) +
                                  "\n            "
                              ),
                              a("el-tooltip", { attrs: { placement: "top" } }, [
                                a("div", {
                                  attrs: { slot: "content" },
                                  domProps: {
                                    innerHTML: e._s(
                                      e.$root.labels.buffer_time_in_slot_tooltip
                                    ),
                                  },
                                  slot: "content",
                                }),
                                e._v(" "),
                                a("i", {
                                  staticClass:
                                    "el-icon-question am-tooltip-icon",
                                }),
                              ]),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-col",
                            { staticClass: "align-right", attrs: { span: 8 } },
                            [
                              a("el-switch", {
                                attrs: {
                                  "active-text": "",
                                  "inactive-text": "",
                                },
                                model: {
                                  value: e.settings.bufferTimeInSlot,
                                  callback: function (t) {
                                    e.$set(e.settings, "bufferTimeInSlot", t);
                                  },
                                  expression: "settings.bufferTimeInSlot",
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
                  a(
                    "el-form-item",
                    { attrs: { label: "placeholder" } },
                    [
                      a(
                        "label",
                        { attrs: { slot: "label" }, slot: "label" },
                        [
                          e._v(
                            "\n          " +
                              e._s(e.$root.labels.minimum_time_before_booking) +
                              ":\n          "
                          ),
                          a("el-tooltip", { attrs: { placement: "top" } }, [
                            a("div", {
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
                            a("i", {
                              staticClass: "el-icon-question am-tooltip-icon",
                            }),
                          ]),
                        ],
                        1
                      ),
                      e._v(" "),
                      a(
                        "el-select",
                        {
                          model: {
                            value:
                              e.settings.minimumTimeRequirementPriorToBooking,
                            callback: function (t) {
                              e.$set(
                                e.settings,
                                "minimumTimeRequirementPriorToBooking",
                                t
                              );
                            },
                            expression:
                              "settings.minimumTimeRequirementPriorToBooking",
                          },
                        },
                        e._l(e.options.minimumTime, function (e) {
                          return a("el-option", {
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
                  a(
                    "el-form-item",
                    { attrs: { label: "placeholder" } },
                    [
                      a(
                        "label",
                        { attrs: { slot: "label" }, slot: "label" },
                        [
                          e._v(
                            "\n          " +
                              e._s(
                                e.$root.labels.minimum_time_before_canceling
                              ) +
                              ":\n          "
                          ),
                          a("el-tooltip", { attrs: { placement: "top" } }, [
                            a("div", {
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
                            a("i", {
                              staticClass: "el-icon-question am-tooltip-icon",
                            }),
                          ]),
                        ],
                        1
                      ),
                      e._v(" "),
                      a(
                        "el-select",
                        {
                          model: {
                            value:
                              e.settings.minimumTimeRequirementPriorToCanceling,
                            callback: function (t) {
                              e.$set(
                                e.settings,
                                "minimumTimeRequirementPriorToCanceling",
                                t
                              );
                            },
                            expression:
                              "settings.minimumTimeRequirementPriorToCanceling",
                          },
                        },
                        e._l(e.options.minimumTime, function (e) {
                          return a("el-option", {
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
                  a(
                    "el-form-item",
                    { attrs: { label: "placeholder" } },
                    [
                      a(
                        "label",
                        { attrs: { slot: "label" }, slot: "label" },
                        [
                          e._v(
                            "\n          " +
                              e._s(
                                e.$root.labels.minimum_time_before_rescheduling
                              ) +
                              ":\n          "
                          ),
                          a("el-tooltip", { attrs: { placement: "top" } }, [
                            a("div", {
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
                            a("i", {
                              staticClass: "el-icon-question am-tooltip-icon",
                            }),
                          ]),
                        ],
                        1
                      ),
                      e._v(" "),
                      a(
                        "el-select",
                        {
                          model: {
                            value:
                              e.settings
                                .minimumTimeRequirementPriorToRescheduling,
                            callback: function (t) {
                              e.$set(
                                e.settings,
                                "minimumTimeRequirementPriorToRescheduling",
                                t
                              );
                            },
                            expression:
                              "settings.minimumTimeRequirementPriorToRescheduling",
                          },
                        },
                        e._l(e.options.minimumTime, function (e) {
                          return a("el-option", {
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
                  a(
                    "el-form-item",
                    { attrs: { label: "placeholder" } },
                    [
                      a(
                        "label",
                        { attrs: { slot: "label" }, slot: "label" },
                        [
                          e._v(
                            "\n          " +
                              e._s(
                                e.$root.labels.period_available_for_booking
                              ) +
                              ":\n          "
                          ),
                          a("el-tooltip", { attrs: { placement: "top" } }, [
                            a("div", {
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
                            a("i", {
                              staticClass: "el-icon-question am-tooltip-icon",
                            }),
                          ]),
                        ],
                        1
                      ),
                      e._v(" "),
                      a("el-input-number", {
                        attrs: {
                          value: e.settings.numberOfDaysAvailableForBooking,
                          min: 1,
                        },
                        on: { change: e.changeNumberOfDaysAvailableForBooking },
                      }),
                    ],
                    1
                  ),

                  a(
                    "el-form-item", //p2p maximum recurring lessons for booking
                    { attrs: { label: "placeholder" } },
                    [
                      a(
                        "label",
                        { attrs: { slot: "label" }, slot: "label" },
                        [
                          e._v(
                            "\n          " +
                            e._s(
                              "Maximum number of lessons for booking"
                            ) +
                            ":\n          "
                          ),
                          a("el-tooltip", { attrs: { placement: "top" } }, [
                            a("div", {
                              attrs: { slot: "content" },
                              domProps: {
                                innerHTML: e._s(
                                  "Set the maximum number of lessons for recurring bookings"
                                ),
                              },
                              slot: "content",
                            }),
                            e._v(" "),
                            a("i", {
                              staticClass: "el-icon-question am-tooltip-icon",
                            }),
                          ]),
                        ],
                        1
                      ),
                      e._v(" "),
                      a("el-input-number", {
                        attrs: {
                          min: 1,
                          max: 100
                        },
                        model: {
                          value: e.settings.maximumLessonsForBooking,
                          callback: function (t) {
                            e.$set(
                              e.settings,
                              "maximumLessonsForBooking",
                              t
                            );
                          },
                          expression:
                            "settings.maximumLessonsForBooking",
                        },
                      }),
                    ]
                  ),

                  e._v(" "),
                  a(
                    "el-form-item",
                    {
                      attrs: {
                        label: e.$root.labels.default_phone_country_code + ":",
                      },
                    },
                    [
                      a(
                        "el-select",
                        {
                          class:
                            "am-selected-flag am-selected-flag-" +
                            e.settings.phoneDefaultCountryCode,
                          attrs: { placeholder: "" },
                          model: {
                            value: e.settings.phoneDefaultCountryCode,
                            callback: function (t) {
                              e.$set(e.settings, "phoneDefaultCountryCode", t);
                            },
                            expression: "settings.phoneDefaultCountryCode",
                          },
                        },
                        e._l(e.countries, function (t) {
                          return a(
                            "el-option",
                            {
                              key: t.id,
                              attrs: { value: t.iso, label: t.nicename },
                            },
                            [
                              a("span", { class: "am-flag am-flag-" + t.iso }),
                              e._v(" "),
                              a("span", { staticStyle: { float: "left" } }, [
                                e._v(e._s(t.nicename)),
                              ]),
                              e._v(" "),
                              a(
                                "span",
                                {
                                  staticStyle: {
                                    float: "right",
                                    color: "#7F8BA4",
                                    "font-size": "13px",
                                  },
                                },
                                [
                                  e._v(
                                    e._s(t.phonecode ? "+" : "") +
                                      e._s(t.phonecode)
                                  ),
                                ]
                              ),
                            ]
                          );
                        }),
                        1
                      ),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "div",
                    { staticClass: "am-setting-box am-switch-box" },
                    [
                      a(
                        "el-row",
                        {
                          attrs: { type: "flex", align: "middle", gutter: 24 },
                        },
                        [
                          a("el-col", { attrs: { span: 16 } }, [
                            e._v(
                              "\n            " +
                                e._s(
                                  e.$root.labels.required_phone_number_field
                                ) +
                                "\n          "
                            ),
                          ]),
                          e._v(" "),
                          a(
                            "el-col",
                            { staticClass: "align-right", attrs: { span: 8 } },
                            [
                              a("el-switch", {
                                attrs: {
                                  "active-text": "",
                                  "inactive-text": "",
                                },
                                model: {
                                  value: e.settings.requiredPhoneNumberField,
                                  callback: function (t) {
                                    e.$set(
                                      e.settings,
                                      "requiredPhoneNumberField",
                                      t
                                    );
                                  },
                                  expression:
                                    "settings.requiredPhoneNumberField",
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
                  a(
                    "el-form-item",
                    [
                      a(
                        "label",
                        { attrs: { slot: "label" }, slot: "label" },
                        [
                          e._v(
                            "\n          " +
                              e._s(e.$root.labels.manage_languages) +
                              ":\n          "
                          ),
                          a("el-tooltip", { attrs: { placement: "top" } }, [
                            a("div", {
                              attrs: { slot: "content" },
                              domProps: {
                                innerHTML: e._s(
                                  e.$root.labels.manage_languages_tooltip
                                ),
                              },
                              slot: "content",
                            }),
                            e._v(" "),
                            a("i", {
                              staticClass: "el-icon-question am-tooltip-icon",
                            }),
                          ]),
                        ],
                        1
                      ),
                      e._v(" "),
                      a(
                        "el-select",
                        {
                          staticClass: "select-languages",
                          attrs: {
                            placeholder: e.$root.labels.language,
                            clearable: "",
                            filterable: "",
                            multiple: "",
                            "collapse-tags": "",
                          },
                          model: {
                            value: e.settings.usedLanguages,
                            callback: function (t) {
                              e.$set(e.settings, "usedLanguages", t);
                            },
                            expression: "settings.usedLanguages",
                          },
                        },
                        e._l(Object.keys(e.languagesData), function (t, s) {
                          return a(
                            "el-option",
                            {
                              key: s,
                              attrs: { label: e.getLanguageLabel(t), value: t },
                            },
                            [
                              a("span", [
                                a("img", {
                                  staticClass: "option-languages-flag",
                                  attrs: { src: e.getLanguageFlag(t) },
                                }),
                                e._v(
                                  "\n            " +
                                    e._s(e.getLanguageLabel(t)) +
                                    "\n          "
                                ),
                              ]),
                            ]
                          );
                        }),
                        1
                      ),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "div",
                    { staticClass: "am-setting-box am-switch-box" },
                    [
                      a(
                        "el-row",
                        {
                          attrs: { type: "flex", align: "middle", gutter: 24 },
                        },
                        [
                          a("el-col", { attrs: { span: 16 } }, [
                            e._v(
                              "\n            " +
                                e._s(e.$root.labels.required_email_field) +
                                "\n          "
                            ),
                          ]),
                          e._v(" "),
                          a(
                            "el-col",
                            { staticClass: "align-right", attrs: { span: 8 } },
                            [
                              a("el-switch", {
                                attrs: {
                                  "active-text": "",
                                  "inactive-text": "",
                                },
                                model: {
                                  value: e.settings.requiredEmailField,
                                  callback: function (t) {
                                    e.$set(e.settings, "requiredEmailField", t);
                                  },
                                  expression: "settings.requiredEmailField",
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
                  a(
                    "div",
                    { staticClass: "am-setting-box am-switch-box" },
                    [
                      a(
                        "el-row",
                        {
                          attrs: { type: "flex", align: "middle", gutter: 24 },
                        },
                        [
                          a(
                            "el-col",
                            { attrs: { span: 16 } },
                            [
                              e._v(
                                "\n            " +
                                  e._s(e.$root.labels.show_client_time_zone) +
                                  "\n            "
                              ),
                              a("el-tooltip", { attrs: { placement: "top" } }, [
                                a("div", {
                                  attrs: { slot: "content" },
                                  domProps: {
                                    innerHTML: e._s(
                                      e.$root.labels
                                        .show_client_time_zone_tooltip
                                    ),
                                  },
                                  slot: "content",
                                }),
                                e._v(" "),
                                a("i", {
                                  staticClass:
                                    "el-icon-question am-tooltip-icon",
                                }),
                              ]),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-col",
                            { staticClass: "align-right", attrs: { span: 8 } },
                            [
                              a("el-switch", {
                                attrs: {
                                  "active-text": "",
                                  "inactive-text": "",
                                },
                                model: {
                                  value: e.settings.showClientTimeZone,
                                  callback: function (t) {
                                    e.$set(e.settings, "showClientTimeZone", t);
                                  },
                                  expression: "settings.showClientTimeZone",
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
                  a(
                    "div",
                    { staticClass: "am-setting-box am-switch-box" },
                    [
                      a(
                        "el-row",
                        {
                          attrs: { type: "flex", align: "middle", gutter: 24 },
                        },
                        [
                          a(
                            "el-col",
                            { attrs: { span: 16 } },
                            [
                              e._v(
                                "\n            " +
                                  e._s(e.$root.labels.add_to_calendar) +
                                  "\n            "
                              ),
                              a("el-tooltip", { attrs: { placement: "top" } }, [
                                a("div", {
                                  attrs: { slot: "content" },
                                  domProps: {
                                    innerHTML: e._s(
                                      e.$root.labels.add_to_calendar_tooltip
                                    ),
                                  },
                                  slot: "content",
                                }),
                                e._v(" "),
                                a("i", {
                                  staticClass:
                                    "el-icon-question am-tooltip-icon",
                                }),
                              ]),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-col",
                            { staticClass: "align-right", attrs: { span: 8 } },
                            [
                              a("el-switch", {
                                attrs: {
                                  "active-text": "",
                                  "inactive-text": "",
                                },
                                model: {
                                  value: e.settings.addToCalendar,
                                  callback: function (t) {
                                    e.$set(e.settings, "addToCalendar", t);
                                  },
                                  expression: "settings.addToCalendar",
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
                  a(
                    "div",
                    { staticClass: "am-setting-box am-switch-box" },
                    [
                      a(
                        "el-row",
                        {
                          attrs: { type: "flex", align: "middle", gutter: 24 },
                        },
                        [
                          a(
                            "el-col",
                            { attrs: { span: 16 } },
                            [
                              e._v(
                                "\n            " +
                                  e._s(e.$root.labels.send_ics_attachment) +
                                  "\n            "
                              ),
                              a("el-tooltip", { attrs: { placement: "top" } }, [
                                a("div", {
                                  attrs: { slot: "content" },
                                  domProps: {
                                    innerHTML: e._s(
                                      e.$root.labels.send_ics_attachment_tooltip
                                    ),
                                  },
                                  slot: "content",
                                }),
                                e._v(" "),
                                a("i", {
                                  staticClass:
                                    "el-icon-question am-tooltip-icon",
                                }),
                              ]),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-col",
                            { staticClass: "align-right", attrs: { span: 8 } },
                            [
                              a("el-switch", {
                                attrs: {
                                  "active-text": "",
                                  "inactive-text": "",
                                },
                                model: {
                                  value: e.settings.sendIcsAttachment,
                                  callback: function (t) {
                                    e.$set(e.settings, "sendIcsAttachment", t);
                                  },
                                  expression: "settings.sendIcsAttachment",
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
                  a(
                    "el-form-item",
                    {
                      attrs: {
                        label: e.$root.labels.default_items_per_page + ":",
                      },
                    },
                    [
                      a(
                        "el-select",
                        {
                          model: {
                            value: e.settings.itemsPerPage,
                            callback: function (t) {
                              e.$set(e.settings, "itemsPerPage", t);
                            },
                            expression: "settings.itemsPerPage",
                          },
                        },
                        e._l(e.options.itemsPerPage, function (e) {
                          return a("el-option", {
                            key: e,
                            attrs: { label: e, value: e },
                          });
                        }),
                        1
                      ),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-form-item",
                    {
                      attrs: {
                        label: e.$root.labels.default_page_on_backend + ":",
                      },
                    },
                    [
                      a(
                        "el-select",
                        {
                          model: {
                            value: e.settings.defaultPageOnBackend,
                            callback: function (t) {
                              e.$set(e.settings, "defaultPageOnBackend", t);
                            },
                            expression: "settings.defaultPageOnBackend",
                          },
                        },
                        e._l(e.options.defaultPageOnBackend, function (e) {
                          return a("el-option", {
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
                  a(
                    "el-form-item",
                    { attrs: { label: "placeholder" } },
                    [
                      a(
                        "label",
                        { attrs: { slot: "label" }, slot: "label" },
                        [
                          e._v(
                            "\n          " +
                              e._s(e.$root.labels.gMap_api_key) +
                              ":\n          "
                          ),
                          a("el-tooltip", { attrs: { placement: "top" } }, [
                            a("div", {
                              attrs: { slot: "content" },
                              domProps: {
                                innerHTML: e._s(
                                  e.$root.labels.gMap_api_key_tooltip
                                ),
                              },
                              slot: "content",
                            }),
                            e._v(" "),
                            a("i", {
                              staticClass: "el-icon-question am-tooltip-icon",
                            }),
                          ]),
                        ],
                        1
                      ),
                      e._v(" "),
                      a("el-input", {
                        attrs: { "auto-complete": "off" },
                        model: {
                          value: e.settings.gMapApiKey,
                          callback: function (t) {
                            e.$set(
                              e.settings,
                              "gMapApiKey",
                              "string" == typeof t ? t.trim() : t
                            );
                          },
                          expression: "settings.gMapApiKey",
                        },
                      }),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-form-item",
                    {
                      attrs: {
                        label: "placeholder",
                        prop: "redirectURLAfter",
                        error: e.errors.redirectURLAfter,
                      },
                    },
                    [
                      a(
                        "label",
                        { attrs: { slot: "label" }, slot: "label" },
                        [
                          e._v(
                            "\n          " +
                              e._s(
                                e.$root.labels.redirect_url_after_appointment
                              ) +
                              ":\n          "
                          ),
                          a("el-tooltip", { attrs: { placement: "top" } }, [
                            a("div", {
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
                            a("i", {
                              staticClass: "el-icon-question am-tooltip-icon",
                            }),
                          ]),
                        ],
                        1
                      ),
                      e._v(" "),
                      a("el-input", {
                        attrs: { "auto-complete": "off" },
                        on: {
                          input: function (t) {
                            return e.clearValidation();
                          },
                        },
                        model: {
                          value: e.settings.redirectUrlAfterAppointment,
                          callback: function (t) {
                            e.$set(
                              e.settings,
                              "redirectUrlAfterAppointment",
                              t
                            );
                          },
                          expression: "settings.redirectUrlAfterAppointment",
                        },
                      }),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-form-item",
                    { attrs: { label: "placeholder" } },
                    [
                      a(
                        "label",
                        { attrs: { slot: "label" }, slot: "label" },
                        [
                          e._v(
                            "\n          " +
                              e._s(e.$root.labels.custom_fields_upload_path) +
                              ":\n          "
                          ),
                          a("el-tooltip", { attrs: { placement: "top" } }, [
                            a("div", {
                              attrs: { slot: "content" },
                              domProps: {
                                innerHTML: e._s(
                                  e.$root.labels
                                    .custom_fields_upload_path_tooltip
                                ),
                              },
                              slot: "content",
                            }),
                            e._v(" "),
                            a("i", {
                              staticClass: "el-icon-question am-tooltip-icon",
                            }),
                          ]),
                        ],
                        1
                      ),
                      e._v(" "),
                      a("el-input", {
                        attrs: { "auto-complete": "off" },
                        on: {
                          input: function (t) {
                            return e.clearValidation();
                          },
                        },
                        model: {
                          value: e.settings.customFieldsUploadsPath,
                          callback: function (t) {
                            e.$set(e.settings, "customFieldsUploadsPath", t);
                          },
                          expression: "settings.customFieldsUploadsPath",
                        },
                      }),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "div",
                    { staticClass: "am-setting-box am-switch-box" },
                    [
                      a(
                        "el-row",
                        {
                          attrs: { type: "flex", align: "middle", gutter: 24 },
                        },
                        [
                          a(
                            "el-col",
                            { attrs: { span: 20 } },
                            [
                              e._v(
                                "\n            " +
                                  e._s(e.$root.labels.recaptcha_enabled) +
                                  "\n            "
                              ),
                              a("el-tooltip", { attrs: { placement: "top" } }, [
                                a("div", {
                                  attrs: { slot: "content" },
                                  domProps: {
                                    innerHTML: e._s(
                                      e.$root.labels.recaptcha_enabled_tooltip
                                    ),
                                  },
                                  slot: "content",
                                }),
                                e._v(" "),
                                a("i", {
                                  staticClass:
                                    "el-icon-question am-tooltip-icon",
                                }),
                              ]),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-col",
                            { staticClass: "align-right", attrs: { span: 4 } },
                            [
                              a("el-switch", {
                                attrs: {
                                  "active-text": "",
                                  "inactive-text": "",
                                },
                                on: {
                                  change: e.handleRecaptchaValidationRules,
                                },
                                model: {
                                  value: e.settings.googleRecaptcha.enabled,
                                  callback: function (t) {
                                    e.$set(
                                      e.settings.googleRecaptcha,
                                      "enabled",
                                      t
                                    );
                                  },
                                  expression:
                                    "settings.googleRecaptcha.enabled",
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
                  a(
                    "div",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: e.settings.googleRecaptcha.enabled,
                          expression: "settings.googleRecaptcha.enabled",
                        },
                      ],
                      staticClass: "am-setting-box am-switch-box",
                    },
                    [
                      a(
                        "el-row",
                        {
                          attrs: { type: "flex", align: "middle", gutter: 24 },
                        },
                        [
                          a(
                            "el-col",
                            { attrs: { span: 20 } },
                            [
                              e._v(
                                "\n            " +
                                  e._s(e.$root.labels.recaptcha_invisible) +
                                  "\n            "
                              ),
                              a("el-tooltip", { attrs: { placement: "top" } }, [
                                a("div", {
                                  attrs: { slot: "content" },
                                  domProps: {
                                    innerHTML: e._s(
                                      e.$root.labels.recaptcha_invisible_tooltip
                                    ),
                                  },
                                  slot: "content",
                                }),
                                e._v(" "),
                                a("i", {
                                  staticClass:
                                    "el-icon-question am-tooltip-icon",
                                }),
                              ]),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-col",
                            { staticClass: "align-right", attrs: { span: 4 } },
                            [
                              a("el-switch", {
                                attrs: {
                                  "active-text": "",
                                  "inactive-text": "",
                                },
                                model: {
                                  value: e.settings.googleRecaptcha.invisible,
                                  callback: function (t) {
                                    e.$set(
                                      e.settings.googleRecaptcha,
                                      "invisible",
                                      t
                                    );
                                  },
                                  expression:
                                    "settings.googleRecaptcha.invisible",
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
                  a(
                    "el-form-item",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: e.settings.googleRecaptcha.enabled,
                          expression: "settings.googleRecaptcha.enabled",
                        },
                      ],
                      attrs: { prop: "googleRecaptcha.siteKey" },
                    },
                    [
                      a(
                        "label",
                        { attrs: { slot: "label" }, slot: "label" },
                        [
                          e._v(
                            "\n          " +
                              e._s(e.$root.labels.recaptcha_site_key) +
                              ":\n          "
                          ),
                          a("el-tooltip", { attrs: { placement: "top" } }, [
                            a("div", {
                              attrs: { slot: "content" },
                              domProps: {
                                innerHTML: e._s(
                                  e.$root.labels.recaptcha_site_key_tooltip
                                ),
                              },
                              slot: "content",
                            }),
                            e._v(" "),
                            a("i", {
                              staticClass: "el-icon-question am-tooltip-icon",
                            }),
                          ]),
                        ],
                        1
                      ),
                      e._v(" "),
                      a("el-input", {
                        attrs: { "auto-complete": "off" },
                        model: {
                          value: e.settings.googleRecaptcha.siteKey,
                          callback: function (t) {
                            e.$set(
                              e.settings.googleRecaptcha,
                              "siteKey",
                              "string" == typeof t ? t.trim() : t
                            );
                          },
                          expression: "settings.googleRecaptcha.siteKey",
                        },
                      }),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-form-item",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: e.settings.googleRecaptcha.enabled,
                          expression: "settings.googleRecaptcha.enabled",
                        },
                      ],
                      attrs: { prop: "googleRecaptcha.secret" },
                    },
                    [
                      a(
                        "label",
                        { attrs: { slot: "label" }, slot: "label" },
                        [
                          e._v(
                            "\n          " +
                              e._s(e.$root.labels.recaptcha_secret) +
                              ":\n          "
                          ),
                          a("el-tooltip", { attrs: { placement: "top" } }, [
                            a("div", {
                              attrs: { slot: "content" },
                              domProps: {
                                innerHTML: e._s(
                                  e.$root.labels.recaptcha_secret_tooltip
                                ),
                              },
                              slot: "content",
                            }),
                            e._v(" "),
                            a("i", {
                              staticClass: "el-icon-question am-tooltip-icon",
                            }),
                          ]),
                        ],
                        1
                      ),
                      e._v(" "),
                      a("el-input", {
                        attrs: { "auto-complete": "off" },
                        model: {
                          value: e.settings.googleRecaptcha.secret,
                          callback: function (t) {
                            e.$set(
                              e.settings.googleRecaptcha,
                              "secret",
                              "string" == typeof t ? t.trim() : t
                            );
                          },
                          expression: "settings.googleRecaptcha.secret",
                        },
                      }),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "div",
                    {
                      staticClass: "am-setting-box am-switch-box",
                      staticStyle: { display: "none" },
                    },
                    [
                      a(
                        "el-row",
                        {
                          attrs: { type: "flex", align: "middle", gutter: 24 },
                        },
                        [
                          a("el-col", { attrs: { span: 20 } }, [
                            e._v(
                              "\n            Run post booking actions immediately\n          "
                            ),
                          ]),
                          e._v(" "),
                          a(
                            "el-col",
                            { staticClass: "align-right", attrs: { span: 4 } },
                            [
                              a("el-switch", {
                                attrs: {
                                  "active-text": "",
                                  "inactive-text": "",
                                },
                                model: {
                                  value:
                                    e.settings.runInstantPostBookingActions,
                                  callback: function (t) {
                                    e.$set(
                                      e.settings,
                                      "runInstantPostBookingActions",
                                      t
                                    );
                                  },
                                  expression:
                                    "settings.runInstantPostBookingActions",
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
          a("div", { staticClass: "am-dialog-footer" }, [
            a(
              "div",
              { staticClass: "am-dialog-footer-actions" },
              [
                a(
                  "el-row",
                  [
                    a(
                      "el-col",
                      { staticClass: "align-right", attrs: { sm: 24 } },
                      [
                        a(
                          "el-button",
                          { attrs: { type: "" }, on: { click: e.closeDialog } },
                          [e._v(e._s(e.$root.labels.cancel))]
                        ),
                        e._v(" "),
                        a(
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
  1277: function (e, t, a) {
    var s = a(685)(a(1278), a(1291), !1, null, null, null);
    e.exports = s.exports;
  },
  1278: function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var s = a(1279),
      o = a.n(s),
      i = a(687),
      n = a(1282),
      l = a.n(n),
      r = a(1285),
      c = a.n(r),
      d = a(1288),
      m = a.n(d);
    t.default = {
      components: {
        GoogleCalendar: o.a,
        OutlookCalendar: l.a,
        Zoom: m.a,
        WebHooks: c.a,
      },
      props: {
        googleCalendar: { type: Object },
        outlookCalendar: { type: Object },
        zoom: { type: Object },
        webHooks: { type: Array },
      },
      mixins: [i.a],
      data: function () {
        return {
          googleCalendarSettings: Object.assign({}, this.googleCalendar),
          outlookCalendarSettings: Object.assign({}, this.outlookCalendar),
          zoomSettings: Object.assign({}, this.zoom),
          webHooksSettings: this.webHooks.map(function (e) {
            return e;
          }),
          activeTab: "googleCalendar",
        };
      },
      methods: {
        closeDialog: function () {
          this.$emit("closeDialogSettingsIntegrations");
        },
        onSubmit: function () {
          this.$emit("closeDialogSettingsIntegrations"),
            this.$emit("updateSettings", {
              googleCalendar: this.googleCalendarSettings,
              outlookCalendar: this.outlookCalendarSettings,
              zoom: this.zoomSettings,
              webHooks: this.webHooksSettings,
            });
        },
      },
    };
  },
  1279: function (e, t, a) {
    var s = a(685)(a(1280), a(1281), !1, null, null, null);
    e.exports = s.exports;
  },
  1280: function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var s = a(687),
      o = a(900),
      i = a.n(o);
    t.default = {
      mixins: [s.a],
      props: { googleCalendar: { type: Object } },
      data: function () {
        return {
          options: {
            maximumNumberOfEventsReturned: [50, 100, 200, 500, 1e3, 2e3, 2500],
          },
          readonly: !0,
          settings: this.googleCalendar,
        };
      },
      methods: {
        onChangeAddAttendees: function () {
          !1 === this.settings.addAttendees &&
            (this.settings.sendEventInvitationEmail = !1);
        },
        redirectToDocumentation: function () {
          window.open(
            "https://wpamelia.com/configuring-google-calendar/",
            "_blank"
          );
        },
      },
      components: { InlinePlaceholders: i.a },
    };
  },
  1281: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a(
          "el-form",
          {
            ref: "settings",
            attrs: { model: e.settings, "label-position": "top" },
            on: {
              submit: function (t) {
                return t.preventDefault(), e.onSubmit(t);
              },
            },
          },
          [
            a(
              "el-form-item",
              { attrs: { label: e.$root.labels.google_client_id + ":" } },
              [
                a(
                  "el-row",
                  { attrs: { gutter: 24 } },
                  [
                    a(
                      "el-col",
                      { attrs: { span: 21 } },
                      [
                        a("el-input", {
                          attrs: { "auto-complete": "off" },
                          model: {
                            value: e.settings.clientID,
                            callback: function (t) {
                              e.$set(
                                e.settings,
                                "clientID",
                                "string" == typeof t ? t.trim() : t
                              );
                            },
                            expression: "settings.clientID",
                          },
                        }),
                      ],
                      1
                    ),
                    e._v(" "),
                    a(
                      "el-col",
                      { attrs: { span: 3 } },
                      [
                        a(
                          "el-tooltip",
                          {
                            staticClass: "am-google-calendar-tooltip",
                            attrs: { effect: "dark", placement: "top" },
                          },
                          [
                            a("div", {
                              attrs: { slot: "content" },
                              domProps: {
                                innerHTML: e._s(
                                  e.$root.labels.google_credentials_obtain
                                ),
                              },
                              slot: "content",
                            }),
                            e._v(" "),
                            a(
                              "el-button",
                              {
                                staticClass:
                                  "am-google-calendar-button am-button-icon",
                                attrs: { type: "primary" },
                                on: {
                                  click: function (t) {
                                    return e.redirectToDocumentation();
                                  },
                                },
                              },
                              [
                                a("img", {
                                  staticClass: "svg",
                                  attrs: {
                                    src:
                                      e.$root.getUrl +
                                      "public/img/question.svg",
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
            e._v(" "),
            a(
              "el-form-item",
              { attrs: { label: e.$root.labels.google_client_secret + ":" } },
              [
                a(
                  "el-row",
                  { attrs: { gutter: 24 } },
                  [
                    a(
                      "el-col",
                      { attrs: { span: 21 } },
                      [
                        a("el-input", {
                          attrs: { "auto-complete": "off" },
                          model: {
                            value: e.settings.clientSecret,
                            callback: function (t) {
                              e.$set(
                                e.settings,
                                "clientSecret",
                                "string" == typeof t ? t.trim() : t
                              );
                            },
                            expression: "settings.clientSecret",
                          },
                        }),
                      ],
                      1
                    ),
                    e._v(" "),
                    a(
                      "el-col",
                      { attrs: { span: 3 } },
                      [
                        a(
                          "el-tooltip",
                          {
                            staticClass: "am-google-calendar-tooltip",
                            attrs: { effect: "dark", placement: "top" },
                          },
                          [
                            a("div", {
                              attrs: { slot: "content" },
                              domProps: {
                                innerHTML: e._s(
                                  e.$root.labels.google_credentials_obtain
                                ),
                              },
                              slot: "content",
                            }),
                            e._v(" "),
                            a(
                              "el-button",
                              {
                                staticClass:
                                  "am-google-calendar-button am-button-icon",
                                attrs: { type: "primary" },
                                on: {
                                  click: function (t) {
                                    return e.redirectToDocumentation();
                                  },
                                },
                              },
                              [
                                a("img", {
                                  staticClass: "svg",
                                  attrs: {
                                    src:
                                      e.$root.getUrl +
                                      "public/img/question.svg",
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
            e._v(" "),
            a(
              "el-form-item",
              { attrs: { label: "placeholder" } },
              [
                a(
                  "label",
                  { attrs: { slot: "label" }, slot: "label" },
                  [
                    e._v(
                      "\n      " +
                        e._s(e.$root.labels.google_redirect_uri) +
                        ":\n      "
                    ),
                    a("el-tooltip", { attrs: { placement: "top" } }, [
                      a("div", {
                        attrs: { slot: "content" },
                        domProps: {
                          innerHTML: e._s(
                            e.$root.labels.google_redirect_uri_tooltip
                          ),
                        },
                        slot: "content",
                      }),
                      e._v(" "),
                      a("i", {
                        staticClass: "el-icon-question am-tooltip-icon",
                      }),
                    ]),
                  ],
                  1
                ),
                e._v(" "),
                a("el-input", {
                  attrs: { "auto-complete": "off" },
                  model: {
                    value: e.settings.redirectURI,
                    callback: function (t) {
                      e.$set(e.settings, "redirectURI", t);
                    },
                    expression: "settings.redirectURI",
                  },
                }),
              ],
              1
            ),
            e._v(" "),
            a(
              "el-form-item",
              { attrs: { label: "placeholder" } },
              [
                a(
                  "label",
                  { attrs: { slot: "label" }, slot: "label" },
                  [
                    e._v(
                      "\n      " +
                        e._s(e.$root.labels.event_title) +
                        ":\n      "
                    ),
                    a("el-tooltip", { attrs: { placement: "top" } }, [
                      a("div", {
                        attrs: { slot: "content" },
                        domProps: {
                          innerHTML: e._s(e.$root.labels.event_title_tooltip),
                        },
                        slot: "content",
                      }),
                      e._v(" "),
                      a("i", {
                        staticClass: "el-icon-question am-tooltip-icon",
                      }),
                    ]),
                  ],
                  1
                ),
                e._v(" "),
                a("el-input", {
                  attrs: { "auto-complete": "off" },
                  model: {
                    value: e.settings.eventTitle,
                    callback: function (t) {
                      e.$set(e.settings, "eventTitle", t);
                    },
                    expression: "settings.eventTitle",
                  },
                }),
              ],
              1
            ),
            e._v(" "),
            a(
              "el-form-item",
              { attrs: { label: "placeholder" } },
              [
                a(
                  "label",
                  { attrs: { slot: "label" }, slot: "label" },
                  [
                    e._v(
                      "\n      " +
                        e._s(e.$root.labels.event_description) +
                        ":\n      "
                    ),
                    a("el-tooltip", { attrs: { placement: "top" } }, [
                      a("div", {
                        attrs: { slot: "content" },
                        domProps: {
                          innerHTML: e._s(
                            e.$root.labels.event_description_tooltip
                          ),
                        },
                        slot: "content",
                      }),
                      e._v(" "),
                      a("i", {
                        staticClass: "el-icon-question am-tooltip-icon",
                      }),
                    ]),
                  ],
                  1
                ),
                e._v(" "),
                a("el-input", {
                  attrs: { type: "textarea", "auto-complete": "off" },
                  model: {
                    value: e.settings.eventDescription,
                    callback: function (t) {
                      e.$set(e.settings, "eventDescription", t);
                    },
                    expression: "settings.eventDescription",
                  },
                }),
              ],
              1
            ),
            e._v(" "),
            a(
              "el-form-item",
              [
                a("inline-placeholders", {
                  attrs: {
                    placeholdersNames: [
                      "appointmentPlaceholders",
                      "categoryPlaceholders",
                      "companyPlaceholders",
                      "customerPlaceholders",
                      "employeePlaceholders",
                    ],
                    excludedPlaceholders: {
                      appointmentPlaceholders: [
                        "%zoom_host_url%",
                        "%appointment_cancel_url%",
                        "%reservation_name%",
                        "%reservation_description%",
                      ],
                    },
                    userTypeTab: "provider",
                  },
                }),
              ],
              1
            ),
            e._v(" "),
            a(
              "div",
              { staticClass: "am-setting-box am-switch-box" },
              [
                a(
                  "el-row",
                  { attrs: { type: "flex", align: "middle", gutter: 24 } },
                  [
                    a(
                      "el-col",
                      { attrs: { span: 20 } },
                      [
                        e._v(
                          "\n        " +
                            e._s(e.$root.labels.enable_google_meet) +
                            "\n        "
                        ),
                        a("el-tooltip", { attrs: { placement: "top" } }, [
                          a("div", {
                            attrs: { slot: "content" },
                            domProps: {
                              innerHTML: e._s(
                                e.$root.labels.enable_google_meet_tooltip
                              ),
                            },
                            slot: "content",
                          }),
                          e._v(" "),
                          a("i", {
                            staticClass: "el-icon-question am-tooltip-icon",
                          }),
                        ]),
                      ],
                      1
                    ),
                    e._v(" "),
                    a(
                      "el-col",
                      { staticClass: "align-right", attrs: { span: 4 } },
                      [
                        a("el-switch", {
                          attrs: { "active-text": "", "inactive-text": "" },
                          model: {
                            value: e.settings.enableGoogleMeet,
                            callback: function (t) {
                              e.$set(e.settings, "enableGoogleMeet", t);
                            },
                            expression: "settings.enableGoogleMeet",
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
            a(
              "div",
              { staticClass: "am-setting-box am-switch-box" },
              [
                a(
                  "el-row",
                  { attrs: { type: "flex", align: "middle", gutter: 24 } },
                  [
                    a(
                      "el-col",
                      { attrs: { span: 20 } },
                      [
                        e._v(
                          "\n        " +
                            e._s(e.$root.labels.insert_pending_appointments) +
                            "\n        "
                        ),
                        a("el-tooltip", { attrs: { placement: "top" } }, [
                          a("div", {
                            attrs: { slot: "content" },
                            domProps: {
                              innerHTML: e._s(
                                e.$root.labels
                                  .insert_pending_appointments_tooltip
                              ),
                            },
                            slot: "content",
                          }),
                          e._v(" "),
                          a("i", {
                            staticClass: "el-icon-question am-tooltip-icon",
                          }),
                        ]),
                      ],
                      1
                    ),
                    e._v(" "),
                    a(
                      "el-col",
                      { staticClass: "align-right", attrs: { span: 4 } },
                      [
                        a("el-switch", {
                          attrs: { "active-text": "", "inactive-text": "" },
                          model: {
                            value: e.settings.insertPendingAppointments,
                            callback: function (t) {
                              e.$set(
                                e.settings,
                                "insertPendingAppointments",
                                t
                              );
                            },
                            expression: "settings.insertPendingAppointments",
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
            a(
              "div",
              { staticClass: "am-setting-box am-switch-box" },
              [
                a(
                  "el-row",
                  { attrs: { type: "flex", align: "middle", gutter: 24 } },
                  [
                    a(
                      "el-col",
                      { attrs: { span: 20 } },
                      [
                        e._v(
                          "\n        " +
                            e._s(e.$root.labels.customers_as_attendees) +
                            "\n        "
                        ),
                        a("el-tooltip", { attrs: { placement: "top" } }, [
                          a("div", {
                            attrs: { slot: "content" },
                            domProps: {
                              innerHTML: e._s(
                                e.$root.labels.customers_as_attendees_tooltip
                              ),
                            },
                            slot: "content",
                          }),
                          e._v(" "),
                          a("i", {
                            staticClass: "el-icon-question am-tooltip-icon",
                          }),
                        ]),
                      ],
                      1
                    ),
                    e._v(" "),
                    a(
                      "el-col",
                      { staticClass: "align-right", attrs: { span: 4 } },
                      [
                        a("el-switch", {
                          attrs: { "active-text": "", "inactive-text": "" },
                          on: {
                            change: function (t) {
                              return e.onChangeAddAttendees();
                            },
                          },
                          model: {
                            value: e.settings.addAttendees,
                            callback: function (t) {
                              e.$set(e.settings, "addAttendees", t);
                            },
                            expression: "settings.addAttendees",
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
            a(
              "div",
              { staticClass: "am-setting-box am-switch-box" },
              [
                a(
                  "el-row",
                  { attrs: { type: "flex", align: "middle", gutter: 24 } },
                  [
                    a(
                      "el-col",
                      { attrs: { span: 20 } },
                      [
                        e._v(
                          "\n        " +
                            e._s(e.$root.labels.show_attendees) +
                            "\n        "
                        ),
                        a("el-tooltip", { attrs: { placement: "top" } }, [
                          a("div", {
                            attrs: { slot: "content" },
                            domProps: {
                              innerHTML: e._s(
                                e.$root.labels.show_attendees_tooltip
                              ),
                            },
                            slot: "content",
                          }),
                          e._v(" "),
                          a("i", {
                            staticClass: "el-icon-question am-tooltip-icon",
                          }),
                        ]),
                      ],
                      1
                    ),
                    e._v(" "),
                    a(
                      "el-col",
                      { staticClass: "align-right", attrs: { span: 4 } },
                      [
                        a("el-switch", {
                          attrs: { "active-text": "", "inactive-text": "" },
                          model: {
                            value: e.settings.showAttendees,
                            callback: function (t) {
                              e.$set(e.settings, "showAttendees", t);
                            },
                            expression: "settings.showAttendees",
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
            a(
              "div",
              { staticClass: "am-setting-box am-switch-box" },
              [
                a(
                  "el-row",
                  { attrs: { type: "flex", align: "middle", gutter: 24 } },
                  [
                    a(
                      "el-col",
                      { attrs: { span: 20 } },
                      [
                        e._v(
                          "\n        " +
                            e._s(e.$root.labels.send_event_invitation_email) +
                            "\n        "
                        ),
                        a("el-tooltip", { attrs: { placement: "top" } }, [
                          a("div", {
                            attrs: { slot: "content" },
                            domProps: {
                              innerHTML: e._s(
                                e.$root.labels
                                  .send_event_invitation_email_tooltip
                              ),
                            },
                            slot: "content",
                          }),
                          e._v(" "),
                          a("i", {
                            staticClass: "el-icon-question am-tooltip-icon",
                          }),
                        ]),
                      ],
                      1
                    ),
                    e._v(" "),
                    a(
                      "el-col",
                      { staticClass: "align-right", attrs: { span: 4 } },
                      [
                        a("el-switch", {
                          attrs: {
                            disabled: !e.settings.addAttendees,
                            "active-text": "",
                            "inactive-text": "",
                          },
                          model: {
                            value: e.settings.sendEventInvitationEmail,
                            callback: function (t) {
                              e.$set(e.settings, "sendEventInvitationEmail", t);
                            },
                            expression: "settings.sendEventInvitationEmail",
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
            a(
              "div",
              { staticClass: "am-setting-box am-switch-box" },
              [
                a(
                  "el-row",
                  { attrs: { type: "flex", align: "middle", gutter: 24 } },
                  [
                    a(
                      "el-col",
                      { attrs: { span: 20 } },
                      [
                        e._v(
                          "\n        " +
                            e._s(e.$root.labels.remove_google_busy_slots) +
                            "\n        "
                        ),
                        a("el-tooltip", { attrs: { placement: "top" } }, [
                          a("div", {
                            attrs: { slot: "content" },
                            domProps: {
                              innerHTML: e._s(
                                e.$root.labels.remove_google_busy_slots_tooltip
                              ),
                            },
                            slot: "content",
                          }),
                          e._v(" "),
                          a("i", {
                            staticClass: "el-icon-question am-tooltip-icon",
                          }),
                        ]),
                      ],
                      1
                    ),
                    e._v(" "),
                    a(
                      "el-col",
                      { staticClass: "align-right", attrs: { span: 4 } },
                      [
                        a("el-switch", {
                          attrs: { "active-text": "", "inactive-text": "" },
                          model: {
                            value: e.settings.removeGoogleCalendarBusySlots,
                            callback: function (t) {
                              e.$set(
                                e.settings,
                                "removeGoogleCalendarBusySlots",
                                t
                              );
                            },
                            expression:
                              "settings.removeGoogleCalendarBusySlots",
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
            a(
              "div",
              { staticClass: "am-setting-box am-switch-box" },
              [
                a(
                  "el-row",
                  { attrs: { type: "flex", align: "middle", gutter: 24 } },
                  [
                    a(
                      "el-col",
                      { attrs: { span: 20 } },
                      [
                        e._v(
                          "\n        " +
                            e._s(e.$root.labels.include_buffer_time_google) +
                            "\n        "
                        ),
                        a("el-tooltip", { attrs: { placement: "top" } }, [
                          a("div", {
                            attrs: { slot: "content" },
                            domProps: {
                              innerHTML: e._s(
                                e.$root.labels
                                  .include_buffer_time_google_tooltip
                              ),
                            },
                            slot: "content",
                          }),
                          e._v(" "),
                          a("i", {
                            staticClass: "el-icon-question am-tooltip-icon",
                          }),
                        ]),
                      ],
                      1
                    ),
                    e._v(" "),
                    a(
                      "el-col",
                      { staticClass: "align-right", attrs: { span: 4 } },
                      [
                        a("el-switch", {
                          attrs: { "active-text": "", "inactive-text": "" },
                          model: {
                            value: e.settings.includeBufferTimeGoogleCalendar,
                            callback: function (t) {
                              e.$set(
                                e.settings,
                                "includeBufferTimeGoogleCalendar",
                                t
                              );
                            },
                            expression:
                              "settings.includeBufferTimeGoogleCalendar",
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
            a(
              "el-form-item",
              { attrs: { label: "placeholder" } },
              [
                a(
                  "label",
                  { attrs: { slot: "label" }, slot: "label" },
                  [
                    e._v(
                      "\n      " +
                        e._s(e.$root.labels.number_of_events_returned) +
                        ":\n      "
                    ),
                    a("el-tooltip", { attrs: { placement: "top" } }, [
                      a("div", {
                        attrs: { slot: "content" },
                        domProps: {
                          innerHTML: e._s(
                            e.$root.labels.number_of_events_returned_tooltip
                          ),
                        },
                        slot: "content",
                      }),
                      e._v(" "),
                      a("i", {
                        staticClass: "el-icon-question am-tooltip-icon",
                      }),
                    ]),
                  ],
                  1
                ),
                e._v(" "),
                a(
                  "el-select",
                  {
                    attrs: {
                      disabled: !e.settings.removeGoogleCalendarBusySlots,
                    },
                    model: {
                      value: e.settings.maximumNumberOfEventsReturned,
                      callback: function (t) {
                        e.$set(e.settings, "maximumNumberOfEventsReturned", t);
                      },
                      expression: "settings.maximumNumberOfEventsReturned",
                    },
                  },
                  e._l(e.options.maximumNumberOfEventsReturned, function (e) {
                    return a("el-option", {
                      key: e,
                      attrs: { label: e, value: e },
                    });
                  }),
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
  1282: function (e, t, a) {
    var s = a(685)(a(1283), a(1284), !1, null, null, null);
    e.exports = s.exports;
  },
  1283: function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var s = a(687),
      o = a(900),
      i = a.n(o);
    t.default = {
      props: { outlookCalendar: { type: Object } },
      mixins: [s.a],
      data: function () {
        return {
          options: { maximumNumberOfEventsReturned: [50, 100, 200, 500, 999] },
          settings: this.outlookCalendar,
        };
      },
      computed: {
        showSSLAlert: function () {
          return "https:" !== location.protocol;
        },
      },
      methods: {
        onChangeAddAttendees: function () {
          !1 === this.settings.addAttendees &&
            (this.settings.sendEventInvitationEmail = !1);
        },
        redirectToDocumentation: function () {
          window.open(
            "https://wpamelia.com/configuring-outlook-calendar/",
            "_blank"
          );
        },
      },
      components: { InlinePlaceholders: i.a },
    };
  },
  1284: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a(
          "el-form",
          {
            ref: "settings",
            attrs: { model: e.settings, "label-position": "top" },
            on: {
              submit: function (t) {
                return t.preventDefault(), e.onSubmit(t);
              },
            },
          },
          [
            e.showSSLAlert
              ? a("el-alert", {
                  attrs: {
                    type: "warning",
                    "show-icon": "",
                    title: "",
                    description: e.$root.labels.outlook_ssl_warning,
                    closable: !1,
                  },
                })
              : e._e(),
            e._v(" "),
            a(
              "el-form-item",
              { attrs: { label: e.$root.labels.outlook_client_id + ":" } },
              [
                a(
                  "el-row",
                  { attrs: { gutter: 24 } },
                  [
                    a(
                      "el-col",
                      { attrs: { span: 21 } },
                      [
                        a("el-input", {
                          attrs: { "auto-complete": "off" },
                          model: {
                            value: e.settings.clientID,
                            callback: function (t) {
                              e.$set(
                                e.settings,
                                "clientID",
                                "string" == typeof t ? t.trim() : t
                              );
                            },
                            expression: "settings.clientID",
                          },
                        }),
                      ],
                      1
                    ),
                    e._v(" "),
                    a(
                      "el-col",
                      { attrs: { span: 3 } },
                      [
                        a(
                          "el-tooltip",
                          {
                            staticClass: "am-google-calendar-tooltip",
                            attrs: { effect: "dark", placement: "top" },
                          },
                          [
                            a("div", {
                              attrs: { slot: "content" },
                              domProps: {
                                innerHTML: e._s(
                                  e.$root.labels.outlook_credentials_obtain
                                ),
                              },
                              slot: "content",
                            }),
                            e._v(" "),
                            a(
                              "el-button",
                              {
                                staticClass:
                                  "am-google-calendar-button am-button-icon",
                                attrs: { type: "primary" },
                                on: {
                                  click: function (t) {
                                    return e.redirectToDocumentation();
                                  },
                                },
                              },
                              [
                                a("img", {
                                  staticClass: "svg",
                                  attrs: {
                                    src:
                                      e.$root.getUrl +
                                      "public/img/question.svg",
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
            e._v(" "),
            a(
              "el-form-item",
              { attrs: { label: e.$root.labels.outlook_client_secret + ":" } },
              [
                a(
                  "el-row",
                  { attrs: { gutter: 24 } },
                  [
                    a(
                      "el-col",
                      { attrs: { span: 21 } },
                      [
                        a("el-input", {
                          attrs: { "auto-complete": "off" },
                          model: {
                            value: e.settings.clientSecret,
                            callback: function (t) {
                              e.$set(
                                e.settings,
                                "clientSecret",
                                "string" == typeof t ? t.trim() : t
                              );
                            },
                            expression: "settings.clientSecret",
                          },
                        }),
                      ],
                      1
                    ),
                    e._v(" "),
                    a(
                      "el-col",
                      { attrs: { span: 3 } },
                      [
                        a(
                          "el-tooltip",
                          {
                            staticClass: "am-google-calendar-tooltip",
                            attrs: { effect: "dark", placement: "top" },
                          },
                          [
                            a("div", {
                              attrs: { slot: "content" },
                              domProps: {
                                innerHTML: e._s(
                                  e.$root.labels.outlook_credentials_obtain
                                ),
                              },
                              slot: "content",
                            }),
                            e._v(" "),
                            a(
                              "el-button",
                              {
                                staticClass:
                                  "am-google-calendar-button am-button-icon",
                                attrs: { type: "primary" },
                                on: {
                                  click: function (t) {
                                    return e.redirectToDocumentation();
                                  },
                                },
                              },
                              [
                                a("img", {
                                  staticClass: "svg",
                                  attrs: {
                                    src:
                                      e.$root.getUrl +
                                      "public/img/question.svg",
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
            e._v(" "),
            a(
              "el-form-item",
              { attrs: { label: "placeholder" } },
              [
                a(
                  "label",
                  { attrs: { slot: "label" }, slot: "label" },
                  [
                    e._v(
                      "\n      " +
                        e._s(e.$root.labels.outlook_redirect_uri) +
                        ":\n      "
                    ),
                    a("el-tooltip", { attrs: { placement: "top" } }, [
                      a("div", {
                        attrs: { slot: "content" },
                        domProps: {
                          innerHTML: e._s(
                            e.$root.labels.outlook_redirect_uri_tooltip
                          ),
                        },
                        slot: "content",
                      }),
                      e._v(" "),
                      a("i", {
                        staticClass: "el-icon-question am-tooltip-icon",
                      }),
                    ]),
                  ],
                  1
                ),
                e._v(" "),
                a("el-input", {
                  attrs: { "auto-complete": "off" },
                  model: {
                    value: e.settings.redirectURI,
                    callback: function (t) {
                      e.$set(e.settings, "redirectURI", t);
                    },
                    expression: "settings.redirectURI",
                  },
                }),
              ],
              1
            ),
            e._v(" "),
            a(
              "el-form-item",
              { attrs: { label: "placeholder" } },
              [
                a(
                  "label",
                  { attrs: { slot: "label" }, slot: "label" },
                  [
                    e._v(
                      "\n      " +
                        e._s(e.$root.labels.event_title) +
                        ":\n      "
                    ),
                    a("el-tooltip", { attrs: { placement: "top" } }, [
                      a("div", {
                        attrs: { slot: "content" },
                        domProps: {
                          innerHTML: e._s(
                            e.$root.labels.event_title_tooltip_outlook
                          ),
                        },
                        slot: "content",
                      }),
                      e._v(" "),
                      a("i", {
                        staticClass: "el-icon-question am-tooltip-icon",
                      }),
                    ]),
                  ],
                  1
                ),
                e._v(" "),
                a("el-input", {
                  attrs: { "auto-complete": "off" },
                  model: {
                    value: e.settings.eventTitle,
                    callback: function (t) {
                      e.$set(e.settings, "eventTitle", t);
                    },
                    expression: "settings.eventTitle",
                  },
                }),
              ],
              1
            ),
            e._v(" "),
            a(
              "el-form-item",
              { attrs: { label: "placeholder" } },
              [
                a(
                  "label",
                  { attrs: { slot: "label" }, slot: "label" },
                  [
                    e._v(
                      "\n      " +
                        e._s(e.$root.labels.event_description) +
                        ":\n      "
                    ),
                    a("el-tooltip", { attrs: { placement: "top" } }, [
                      a("div", {
                        attrs: { slot: "content" },
                        domProps: {
                          innerHTML: e._s(
                            e.$root.labels.event_description_tooltip_outlook
                          ),
                        },
                        slot: "content",
                      }),
                      e._v(" "),
                      a("i", {
                        staticClass: "el-icon-question am-tooltip-icon",
                      }),
                    ]),
                  ],
                  1
                ),
                e._v(" "),
                a("el-input", {
                  attrs: { type: "textarea", "auto-complete": "off" },
                  model: {
                    value: e.settings.eventDescription,
                    callback: function (t) {
                      e.$set(e.settings, "eventDescription", t);
                    },
                    expression: "settings.eventDescription",
                  },
                }),
              ],
              1
            ),
            e._v(" "),
            a(
              "el-form-item",
              [
                a("inline-placeholders", {
                  attrs: {
                    placeholdersNames: [
                      "appointmentPlaceholders",
                      "categoryPlaceholders",
                      "companyPlaceholders",
                      "customerPlaceholders",
                      "employeePlaceholders",
                    ],
                    excludedPlaceholders: {
                      appointmentPlaceholders: [
                        "%zoom_host_url%",
                        "%appointment_cancel_url%",
                        "%reservation_name%",
                        "%reservation_description%",
                      ],
                    },
                    userTypeTab: "provider",
                  },
                }),
              ],
              1
            ),
            e._v(" "),
            a(
              "div",
              { staticClass: "am-setting-box am-switch-box" },
              [
                a(
                  "el-row",
                  { attrs: { type: "flex", align: "middle", gutter: 24 } },
                  [
                    a(
                      "el-col",
                      { attrs: { span: 20 } },
                      [
                        e._v(
                          "\n        " +
                            e._s(e.$root.labels.insert_pending_appointments) +
                            "\n        "
                        ),
                        a("el-tooltip", { attrs: { placement: "top" } }, [
                          a("div", {
                            attrs: { slot: "content" },
                            domProps: {
                              innerHTML: e._s(
                                e.$root.labels
                                  .insert_pending_appointments_tooltip
                              ),
                            },
                            slot: "content",
                          }),
                          e._v(" "),
                          a("i", {
                            staticClass: "el-icon-question am-tooltip-icon",
                          }),
                        ]),
                      ],
                      1
                    ),
                    e._v(" "),
                    a(
                      "el-col",
                      { staticClass: "align-right", attrs: { span: 4 } },
                      [
                        a("el-switch", {
                          attrs: { "active-text": "", "inactive-text": "" },
                          model: {
                            value: e.settings.insertPendingAppointments,
                            callback: function (t) {
                              e.$set(
                                e.settings,
                                "insertPendingAppointments",
                                t
                              );
                            },
                            expression: "settings.insertPendingAppointments",
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
            a(
              "div",
              { staticClass: "am-setting-box am-switch-box" },
              [
                a(
                  "el-row",
                  { attrs: { type: "flex", align: "middle", gutter: 24 } },
                  [
                    a(
                      "el-col",
                      { attrs: { span: 20 } },
                      [
                        e._v(
                          "\n        " +
                            e._s(e.$root.labels.customers_as_attendees) +
                            "\n        "
                        ),
                        a("el-tooltip", { attrs: { placement: "top" } }, [
                          a("div", {
                            attrs: { slot: "content" },
                            domProps: {
                              innerHTML: e._s(
                                e.$root.labels.customers_as_attendees_tooltip
                              ),
                            },
                            slot: "content",
                          }),
                          e._v(" "),
                          a("i", {
                            staticClass: "el-icon-question am-tooltip-icon",
                          }),
                        ]),
                      ],
                      1
                    ),
                    e._v(" "),
                    a(
                      "el-col",
                      { staticClass: "align-right", attrs: { span: 4 } },
                      [
                        a("el-switch", {
                          attrs: { "active-text": "", "inactive-text": "" },
                          on: {
                            change: function (t) {
                              return e.onChangeAddAttendees();
                            },
                          },
                          model: {
                            value: e.settings.addAttendees,
                            callback: function (t) {
                              e.$set(e.settings, "addAttendees", t);
                            },
                            expression: "settings.addAttendees",
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
            a(
              "div",
              { staticClass: "am-setting-box am-switch-box" },
              [
                a(
                  "el-row",
                  { attrs: { type: "flex", align: "middle", gutter: 24 } },
                  [
                    a(
                      "el-col",
                      { attrs: { span: 20 } },
                      [
                        e._v(
                          "\n        " +
                            e._s(e.$root.labels.remove_outlook_busy_slots) +
                            "\n        "
                        ),
                        a("el-tooltip", { attrs: { placement: "top" } }, [
                          a("div", {
                            attrs: { slot: "content" },
                            domProps: {
                              innerHTML: e._s(
                                e.$root.labels.remove_outlook_busy_slots_tooltip
                              ),
                            },
                            slot: "content",
                          }),
                          e._v(" "),
                          a("i", {
                            staticClass: "el-icon-question am-tooltip-icon",
                          }),
                        ]),
                      ],
                      1
                    ),
                    e._v(" "),
                    a(
                      "el-col",
                      { staticClass: "align-right", attrs: { span: 4 } },
                      [
                        a("el-switch", {
                          attrs: { "active-text": "", "inactive-text": "" },
                          model: {
                            value: e.settings.removeOutlookCalendarBusySlots,
                            callback: function (t) {
                              e.$set(
                                e.settings,
                                "removeOutlookCalendarBusySlots",
                                t
                              );
                            },
                            expression:
                              "settings.removeOutlookCalendarBusySlots",
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
            a(
              "div",
              { staticClass: "am-setting-box am-switch-box" },
              [
                a(
                  "el-row",
                  { attrs: { type: "flex", align: "middle", gutter: 24 } },
                  [
                    a(
                      "el-col",
                      { attrs: { span: 20 } },
                      [
                        e._v(
                          "\n        " +
                            e._s(e.$root.labels.include_buffer_time_outlook) +
                            "\n        "
                        ),
                        a("el-tooltip", { attrs: { placement: "top" } }, [
                          a("div", {
                            attrs: { slot: "content" },
                            domProps: {
                              innerHTML: e._s(
                                e.$root.labels
                                  .include_buffer_time_outlook_tooltip
                              ),
                            },
                            slot: "content",
                          }),
                          e._v(" "),
                          a("i", {
                            staticClass: "el-icon-question am-tooltip-icon",
                          }),
                        ]),
                      ],
                      1
                    ),
                    e._v(" "),
                    a(
                      "el-col",
                      { staticClass: "align-right", attrs: { span: 4 } },
                      [
                        a("el-switch", {
                          attrs: { "active-text": "", "inactive-text": "" },
                          model: {
                            value: e.settings.includeBufferTimeOutlookCalendar,
                            callback: function (t) {
                              e.$set(
                                e.settings,
                                "includeBufferTimeOutlookCalendar",
                                t
                              );
                            },
                            expression:
                              "settings.includeBufferTimeOutlookCalendar",
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
            a(
              "el-form-item",
              { attrs: { label: "placeholder" } },
              [
                a(
                  "label",
                  { attrs: { slot: "label" }, slot: "label" },
                  [
                    e._v(
                      "\n      " +
                        e._s(e.$root.labels.number_of_events_returned) +
                        ":\n      "
                    ),
                    a("el-tooltip", { attrs: { placement: "top" } }, [
                      a("div", {
                        attrs: { slot: "content" },
                        domProps: {
                          innerHTML: e._s(
                            e.$root.labels.number_of_events_returned_tooltip
                          ),
                        },
                        slot: "content",
                      }),
                      e._v(" "),
                      a("i", {
                        staticClass: "el-icon-question am-tooltip-icon",
                      }),
                    ]),
                  ],
                  1
                ),
                e._v(" "),
                a(
                  "el-select",
                  {
                    attrs: {
                      disabled: !e.settings.removeOutlookCalendarBusySlots,
                    },
                    model: {
                      value: e.settings.maximumNumberOfEventsReturned,
                      callback: function (t) {
                        e.$set(e.settings, "maximumNumberOfEventsReturned", t);
                      },
                      expression: "settings.maximumNumberOfEventsReturned",
                    },
                  },
                  e._l(e.options.maximumNumberOfEventsReturned, function (e) {
                    return a("el-option", {
                      key: e,
                      attrs: { label: e, value: e },
                    });
                  }),
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
  1285: function (e, t, a) {
    var s = a(685)(a(1286), a(1287), !1, null, null, null);
    e.exports = s.exports;
  },
  1286: function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var s = a(687),
      o = a(686);
    t.default = {
      mixins: [s.a, o.a],
      props: ["webHooks"],
      data: function () {
        return {
          settings: this.webHooks,
          webHookToDelete: null,
          webHookEditDialog: null,
          webHookToEdit: null,
          editedWebHook: null,
          editedWebHookOld: null,
          isNewWebHook: !1,
          actions: [
            {
              value: "bookingAdded",
              label: this.$root.labels.web_hook_booking_completed,
            },
            {
              value: "bookingTimeUpdated",
              label: this.$root.labels.web_hook_booking_rescheduled,
            },
            {
              value: "bookingCanceled",
              label: this.$root.labels.web_hook_booking_canceled,
            },
            {
              value: "bookingStatusUpdated",
              label: this.$root.labels.web_hook_booking_status_updated,
            },
          ],
          types: [
            { value: "appointment", label: this.$root.labels.appointment },
            { value: "event", label: this.$root.labels.event },
          ],
          rules: {
            name: [
              {
                required: !0,
                message: this.$root.labels.web_hook_name_warning,
                trigger: "submit",
              },
            ],
            url: [
              {
                required: !0,
                message: this.$root.labels.enter_valid_url_warning,
                trigger: "submit",
              },
            ],
            action: [
              {
                required: !0,
                message: this.$root.labels.web_hook_action_warning,
                trigger: "submit",
              },
            ],
            type: [
              {
                required: !0,
                message: this.$root.labels.web_hook_booking_type_warning,
                trigger: "submit",
              },
            ],
          },
        };
      },
      methods: {
        addWebHook: function () {
          null === this.editedWebHook &&
            ((this.webHookEditDialog = !0),
            (this.editedWebHook = { name: "", url: "", type: "", action: "" }),
            (this.isNewWebHook = !0),
            this.settings.push(this.editedWebHook),
            this.scrollViewInModal("webHook" + (this.settings.length - 1)));
        },
        showEditWebHookDialog: function (e) {
          (this.editedWebHook = e),
            (this.editedWebHookOld = JSON.parse(JSON.stringify(e))),
            (this.webHookToDelete = null),
            (this.webHookEditDialog = !0);
        },
        showDeleteWebHookDialog: function (e) {
          (this.webHookToDelete = e),
            (this.editedWebHook = null),
            (this.webHookEditDialog = !1);
        },
        hideDeleteWebHookDialog: function () {
          (this.webHookToDelete = null), (this.webHookEditDialog = !0);
        },
        deleteWebHook: function (e) {
          var t = this.settings.indexOf(e);
          this.settings.splice(t, 1);
        },
        cancelWebHook: function (e) {
          if (
            (null !== this.editedWebHookOld &&
              ((e.name = this.editedWebHookOld.name),
              (e.url = this.editedWebHookOld.url),
              (e.type = this.editedWebHookOld.type),
              (e.action = this.editedWebHookOld.action)),
            this.isNewWebHook)
          ) {
            var t = this.settings.indexOf(e);
            this.settings.splice(t, 1), (this.isNewWebHook = !1);
          }
          (this.editedWebHook = null),
            (this.editedWebHookOld = null),
            (this.webHookEditDialog = !1);
        },
        saveWebHook: function (e) {
          var t = this;
          this.$refs.webHook[e].validate(function (a) {
            if (!a) return !1;
            (t.editedWebHook = null),
              (t.webHookEditDialog = !1),
              (t.isNewWebHook = !1),
              t.$refs.webHook[e].clearValidate();
          });
        },
      },
    };
  },
  1287: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a(
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
            a(
              "div",
              { staticClass: "am-extra-list" },
              [
                a(
                  "el-button",
                  {
                    staticClass: "am-dialog-create",
                    attrs: { size: "large", type: "primary" },
                    on: { click: e.addWebHook },
                  },
                  [
                    a("i", { staticClass: "el-icon-plus" }),
                    e._v(" "),
                    a("span", { staticClass: "button-text" }, [
                      e._v(e._s(e.$root.labels.add_web_hook)),
                    ]),
                  ]
                ),
                e._v(" "),
                a(
                  "transition-group",
                  { attrs: { name: "list-complete" } },
                  e._l(e.settings, function (t, s) {
                    return a(
                      "div",
                      {
                        key: s + 1,
                        staticClass: "am-extra-item",
                        attrs: { id: "webHook" + s },
                      },
                      [
                        a(
                          "el-row",
                          { attrs: { type: "flex", align: "top" } },
                          [
                            a(
                              "el-col",
                              { attrs: { span: 24 } },
                              [
                                a(
                                  "el-row",
                                  { attrs: { type: "flex", align: "middle" } },
                                  [
                                    a("el-col", { attrs: { span: 18 } }, [
                                      a("h3", [e._v(e._s(t.name))]),
                                    ]),
                                    e._v(" "),
                                    null === e.editedWebHook ||
                                    s !== e.settings.indexOf(e.editedWebHook)
                                      ? a(
                                          "el-col",
                                          {
                                            staticClass:
                                              "extra-item-actions align-right",
                                            attrs: { span: 6 },
                                          },
                                          [
                                            a(
                                              "span",
                                              {
                                                on: {
                                                  click: function (a) {
                                                    return e.showEditWebHookDialog(
                                                      t
                                                    );
                                                  },
                                                },
                                              },
                                              [
                                                a("img", {
                                                  staticClass: "svg edit",
                                                  attrs: {
                                                    width: "16px",
                                                    src:
                                                      e.$root.getUrl +
                                                      "public/img/edit.svg",
                                                  },
                                                }),
                                              ]
                                            ),
                                            e._v(" "),
                                            a(
                                              "span",
                                              {
                                                on: {
                                                  click: function (a) {
                                                    return e.showDeleteWebHookDialog(
                                                      t
                                                    );
                                                  },
                                                },
                                              },
                                              [
                                                a("img", {
                                                  staticClass: "svg",
                                                  attrs: {
                                                    width: "16px",
                                                    src:
                                                      e.$root.getUrl +
                                                      "public/img/delete.svg",
                                                  },
                                                }),
                                              ]
                                            ),
                                          ]
                                        )
                                      : e._e(),
                                  ],
                                  1
                                ),
                                e._v(" "),
                                a(
                                  "div",
                                  {
                                    directives: [
                                      {
                                        name: "show",
                                        rawName: "v-show",
                                        value: !(
                                          (null !== e.editedWebHook &&
                                            s ===
                                              e.settings.indexOf(
                                                e.editedWebHook
                                              )) ||
                                          (null !== e.webHookToDelete &&
                                            s ===
                                              e.settings.indexOf(
                                                e.webHookToDelete
                                              ))
                                        ),
                                        expression:
                                          "(editedWebHook === null || index !== settings.indexOf(editedWebHook)) && (webHookToDelete === null || index !== settings.indexOf(webHookToDelete))",
                                      },
                                    ],
                                    staticClass: "am-extra-item-data",
                                  },
                                  [
                                    a(
                                      "el-row",
                                      { attrs: { gutter: 24 } },
                                      [
                                        a("el-col", { attrs: { sm: 12 } }, [
                                          a(
                                            "span",
                                            { staticClass: "data-title" },
                                            [
                                              e._v(
                                                e._s(
                                                  e.$root.labels.web_hook_action
                                                ) +
                                                  ": " +
                                                  e._s(
                                                    t && t.action
                                                      ? e.actions.find(
                                                          function (e) {
                                                            return (
                                                              t.action ===
                                                              e.value
                                                            );
                                                          }
                                                        ).label
                                                      : ""
                                                  )
                                              ),
                                            ]
                                          ),
                                        ]),
                                        e._v(" "),
                                        a("el-col", { attrs: { sm: 12 } }, [
                                          a(
                                            "span",
                                            { staticClass: "data-title" },
                                            [
                                              e._v(
                                                e._s(
                                                  e.$root.labels
                                                    .web_hook_booking_type
                                                ) +
                                                  ": " +
                                                  e._s(
                                                    t && t.type
                                                      ? e.types.find(function (
                                                          e
                                                        ) {
                                                          return (
                                                            t.type === e.value
                                                          );
                                                        }).label
                                                      : ""
                                                  )
                                              ),
                                            ]
                                          ),
                                        ]),
                                      ],
                                      1
                                    ),
                                    e._v(" "),
                                    a(
                                      "el-row",
                                      { attrs: { gutter: 24 } },
                                      [
                                        a("el-col", { attrs: { sm: 24 } }, [
                                          a(
                                            "span",
                                            { staticClass: "data-title" },
                                            [
                                              e._v(
                                                e._s(e.$root.labels.url) +
                                                  ": " +
                                                  e._s(t.url)
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
                              ],
                              1
                            ),
                          ],
                          1
                        ),
                        e._v(" "),
                        a("el-collapse-transition", [
                          a(
                            "div",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value:
                                    null !== e.webHookToDelete &&
                                    s === e.settings.indexOf(e.webHookToDelete),
                                  expression:
                                    "webHookToDelete !== null && index === settings.indexOf(webHookToDelete)",
                                },
                              ],
                              staticClass: "am-confirmation",
                            },
                            [
                              a("p", [
                                e._v(
                                  e._s(
                                    e.$root.labels.web_hook_delete_confirmation
                                  ) + "?"
                                ),
                              ]),
                              e._v(" "),
                              a(
                                "div",
                                { staticClass: "align-right" },
                                [
                                  a(
                                    "el-button",
                                    {
                                      attrs: { size: "small" },
                                      on: {
                                        click: function (t) {
                                          return e.hideDeleteWebHookDialog();
                                        },
                                      },
                                    },
                                    [e._v(e._s(e.$root.labels.cancel))]
                                  ),
                                  e._v(" "),
                                  a(
                                    "el-button",
                                    {
                                      attrs: { size: "small", type: "primary" },
                                      on: {
                                        click: function (a) {
                                          return e.deleteWebHook(t);
                                        },
                                      },
                                    },
                                    [e._v(e._s(e.$root.labels.delete))]
                                  ),
                                ],
                                1
                              ),
                            ]
                          ),
                        ]),
                        e._v(" "),
                        a("el-collapse-transition", [
                          a(
                            "div",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value:
                                    !0 === e.webHookEditDialog &&
                                    s === e.settings.indexOf(e.editedWebHook),
                                  expression:
                                    "webHookEditDialog === true && index === settings.indexOf(editedWebHook)",
                                },
                              ],
                            },
                            [
                              a(
                                "el-form",
                                {
                                  ref: "webHook",
                                  refInFor: !0,
                                  attrs: {
                                    model: t,
                                    rules: e.rules,
                                    "label-position": "top",
                                  },
                                },
                                [
                                  a(
                                    "el-form-item",
                                    {
                                      attrs: {
                                        label: e.$root.labels.name + ":",
                                        prop: "name",
                                      },
                                    },
                                    [
                                      a("el-input", {
                                        attrs: { "auto-complete": "off" },
                                        on: {
                                          change: function (a) {
                                            return e.trimProperty(t, "name");
                                          },
                                        },
                                        model: {
                                          value: t.name,
                                          callback: function (a) {
                                            e.$set(t, "name", a);
                                          },
                                          expression: "webHook.name",
                                        },
                                      }),
                                    ],
                                    1
                                  ),
                                  e._v(" "),
                                  a(
                                    "el-form-item",
                                    { attrs: { label: "URL:", prop: "url" } },
                                    [
                                      a("el-input", {
                                        attrs: { "auto-complete": "off" },
                                        model: {
                                          value: t.url,
                                          callback: function (a) {
                                            e.$set(
                                              t,
                                              "url",
                                              "string" == typeof a
                                                ? a.trim()
                                                : a
                                            );
                                          },
                                          expression: "webHook.url",
                                        },
                                      }),
                                    ],
                                    1
                                  ),
                                  e._v(" "),
                                  a(
                                    "el-form-item",
                                    {
                                      attrs: {
                                        label:
                                          e.$root.labels.web_hook_booking_type +
                                          ":",
                                        prop: "type",
                                      },
                                    },
                                    [
                                      a(
                                        "el-select",
                                        {
                                          attrs: {
                                            clearable: "",
                                            placeholder: "",
                                          },
                                          model: {
                                            value: t.type,
                                            callback: function (a) {
                                              e.$set(t, "type", a);
                                            },
                                            expression: "webHook.type",
                                          },
                                        },
                                        e._l(e.types, function (e, t) {
                                          return a("el-option", {
                                            key: e.value,
                                            attrs: {
                                              label: e.label,
                                              value: e.value,
                                            },
                                          });
                                        }),
                                        1
                                      ),
                                    ],
                                    1
                                  ),
                                  e._v(" "),
                                  a(
                                    "el-form-item",
                                    {
                                      attrs: {
                                        label:
                                          e.$root.labels.web_hook_action + ":",
                                        prop: "action",
                                      },
                                    },
                                    [
                                      a(
                                        "el-select",
                                        {
                                          attrs: {
                                            clearable: "",
                                            placeholder: "",
                                          },
                                          model: {
                                            value: t.action,
                                            callback: function (a) {
                                              e.$set(t, "action", a);
                                            },
                                            expression: "webHook.action",
                                          },
                                        },
                                        e._l(e.actions, function (e, t) {
                                          return a("el-option", {
                                            key: e.value,
                                            attrs: {
                                              label: e.label,
                                              value: e.value,
                                            },
                                          });
                                        }),
                                        1
                                      ),
                                    ],
                                    1
                                  ),
                                  e._v(" "),
                                  a(
                                    "div",
                                    { staticClass: "align-right" },
                                    [
                                      a(
                                        "el-button",
                                        {
                                          attrs: { size: "small" },
                                          on: {
                                            click: function (a) {
                                              return e.cancelWebHook(t);
                                            },
                                          },
                                        },
                                        [
                                          e._v(
                                            "\n                  " +
                                              e._s(e.$root.labels.cancel) +
                                              "\n                "
                                          ),
                                        ]
                                      ),
                                      e._v(" "),
                                      a(
                                        "el-button",
                                        {
                                          attrs: {
                                            size: "small",
                                            type: "primary",
                                          },
                                          on: {
                                            click: function (t) {
                                              return e.saveWebHook(s);
                                            },
                                          },
                                        },
                                        [
                                          e._v(
                                            "\n                  " +
                                              e._s(e.$root.labels.save) +
                                              "\n                "
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
                      ],
                      1
                    );
                  }),
                  0
                ),
              ],
              1
            ),
          ]
        );
      },
      staticRenderFns: [],
    };
  },
  1288: function (e, t, a) {
    var s = a(685)(a(1289), a(1290), !1, null, null, null);
    e.exports = s.exports;
  },
  1289: function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var s = a(687),
      o = a(900),
      i = a.n(o);
    t.default = {
      mixins: [s.a],
      props: { zoom: { type: Object } },
      data: function () {
        return { settings: this.zoom };
      },
      methods: {
        redirectToDocumentation: function () {
          window.open("https://wpamelia.com/configuring-zoom/", "_blank");
        },
      },
      components: { InlinePlaceholders: i.a },
    };
  },
  1290: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a(
          "el-form",
          {
            ref: "settings",
            attrs: { model: e.settings, "label-position": "top" },
            on: {
              submit: function (t) {
                return t.preventDefault(), e.onSubmit(t);
              },
            },
          },
          [
            a(
              "el-form-item",
              { attrs: { label: e.$root.labels.zoom_api_key + ":" } },
              [
                a(
                  "el-row",
                  { attrs: { gutter: 24 } },
                  [
                    a(
                      "el-col",
                      { attrs: { span: 21 } },
                      [
                        a("el-input", {
                          attrs: { "auto-complete": "off" },
                          model: {
                            value: e.settings.apiKey,
                            callback: function (t) {
                              e.$set(
                                e.settings,
                                "apiKey",
                                "string" == typeof t ? t.trim() : t
                              );
                            },
                            expression: "settings.apiKey",
                          },
                        }),
                      ],
                      1
                    ),
                    e._v(" "),
                    a(
                      "el-col",
                      { attrs: { span: 3 } },
                      [
                        a(
                          "el-tooltip",
                          {
                            staticClass: "am-google-calendar-tooltip",
                            attrs: { effect: "dark", placement: "top" },
                          },
                          [
                            a("div", {
                              attrs: { slot: "content" },
                              domProps: {
                                innerHTML: e._s(
                                  e.$root.labels.zoom_credentials_obtain
                                ),
                              },
                              slot: "content",
                            }),
                            e._v(" "),
                            a(
                              "el-button",
                              {
                                staticClass:
                                  "am-google-calendar-button am-button-icon",
                                attrs: { type: "primary" },
                                on: {
                                  click: function (t) {
                                    return e.redirectToDocumentation();
                                  },
                                },
                              },
                              [
                                a("img", {
                                  staticClass: "svg",
                                  attrs: {
                                    src:
                                      e.$root.getUrl +
                                      "public/img/question.svg",
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
            e._v(" "),
            a(
              "el-form-item",
              { attrs: { label: e.$root.labels.zoom_api_secret + ":" } },
              [
                a(
                  "el-row",
                  { attrs: { gutter: 24 } },
                  [
                    a(
                      "el-col",
                      { attrs: { span: 21 } },
                      [
                        a("el-input", {
                          attrs: { "auto-complete": "off" },
                          model: {
                            value: e.settings.apiSecret,
                            callback: function (t) {
                              e.$set(
                                e.settings,
                                "apiSecret",
                                "string" == typeof t ? t.trim() : t
                              );
                            },
                            expression: "settings.apiSecret",
                          },
                        }),
                      ],
                      1
                    ),
                    e._v(" "),
                    a(
                      "el-col",
                      { attrs: { span: 3 } },
                      [
                        a(
                          "el-tooltip",
                          {
                            staticClass: "am-google-calendar-tooltip",
                            attrs: { effect: "dark", placement: "top" },
                          },
                          [
                            a("div", {
                              attrs: { slot: "content" },
                              domProps: {
                                innerHTML: e._s(
                                  e.$root.labels.zoom_credentials_obtain
                                ),
                              },
                              slot: "content",
                            }),
                            e._v(" "),
                            a(
                              "el-button",
                              {
                                staticClass:
                                  "am-google-calendar-button am-button-icon",
                                attrs: { type: "primary" },
                                on: {
                                  click: function (t) {
                                    return e.redirectToDocumentation();
                                  },
                                },
                              },
                              [
                                a("img", {
                                  staticClass: "svg",
                                  attrs: {
                                    src:
                                      e.$root.getUrl +
                                      "public/img/question.svg",
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
            e._v(" "),
            a(
              "el-form-item",
              { attrs: { label: "placeholder" } },
              [
                a(
                  "label",
                  { attrs: { slot: "label" }, slot: "label" },
                  [
                    e._v(
                      "\n      " +
                        e._s(e.$root.labels.meeting_title) +
                        ":\n      "
                    ),
                    a("el-tooltip", { attrs: { placement: "top" } }, [
                      a("div", {
                        attrs: { slot: "content" },
                        domProps: {
                          innerHTML: e._s(e.$root.labels.meeting_title_tooltip),
                        },
                        slot: "content",
                      }),
                      e._v(" "),
                      a("i", {
                        staticClass: "el-icon-question am-tooltip-icon",
                      }),
                    ]),
                  ],
                  1
                ),
                e._v(" "),
                a("el-input", {
                  attrs: { "auto-complete": "off" },
                  model: {
                    value: e.settings.meetingTitle,
                    callback: function (t) {
                      e.$set(e.settings, "meetingTitle", t);
                    },
                    expression: "settings.meetingTitle",
                  },
                }),
              ],
              1
            ),
            e._v(" "),
            a(
              "el-form-item",
              { attrs: { label: "placeholder" } },
              [
                a(
                  "label",
                  { attrs: { slot: "label" }, slot: "label" },
                  [
                    e._v(
                      "\n      " +
                        e._s(e.$root.labels.meeting_agenda) +
                        ":\n      "
                    ),
                    a("el-tooltip", { attrs: { placement: "top" } }, [
                      a("div", {
                        attrs: { slot: "content" },
                        domProps: {
                          innerHTML: e._s(
                            e.$root.labels.meeting_agenda_tooltip
                          ),
                        },
                        slot: "content",
                      }),
                      e._v(" "),
                      a("i", {
                        staticClass: "el-icon-question am-tooltip-icon",
                      }),
                    ]),
                  ],
                  1
                ),
                e._v(" "),
                a("el-input", {
                  attrs: { type: "textarea", "auto-complete": "off" },
                  model: {
                    value: e.settings.meetingAgenda,
                    callback: function (t) {
                      e.$set(e.settings, "meetingAgenda", t);
                    },
                    expression: "settings.meetingAgenda",
                  },
                }),
              ],
              1
            ),
            e._v(" "),
            a(
              "el-form-item",
              [
                a("inline-placeholders", {
                  attrs: {
                    placeholdersNames: [
                      "appointmentPlaceholders",
                      "eventPlaceholders",
                      "categoryPlaceholders",
                      "locationPlaceholders",
                      "employeePlaceholders",
                      "customerPlaceholders",
                    ],
                    excludedPlaceholders: {
                      appointmentPlaceholders: [
                        "%zoom_host_url%",
                        "%zoom_join_url%",
                        "%appointment_cancel_url%",
                      ],
                      eventPlaceholders: [
                        "%event_cancel_url%",
                        "%zoom_join_url_date%",
                        "%zoom_join_url_date_time%",
                        "%zoom_host_url_date%",
                        "%zoom_host_url_date_time%",
                      ],
                    },
                    userTypeTab: "provider",
                  },
                }),
              ],
              1
            ),
            e._v(" "),
            a(
              "div",
              { staticClass: "am-setting-box am-switch-box" },
              [
                a(
                  "el-row",
                  { attrs: { type: "flex", align: "middle", gutter: 24 } },
                  [
                    a(
                      "el-col",
                      { attrs: { span: 20 } },
                      [
                        e._v(
                          "\n        " +
                            e._s(e.$root.labels.pending_appointments_meetings) +
                            "\n        "
                        ),
                        a("el-tooltip", { attrs: { placement: "top" } }, [
                          a("div", {
                            attrs: { slot: "content" },
                            domProps: {
                              innerHTML: e._s(
                                e.$root.labels
                                  .pending_appointments_meetings_tooltip
                              ),
                            },
                            slot: "content",
                          }),
                          e._v(" "),
                          a("i", {
                            staticClass: "el-icon-question am-tooltip-icon",
                          }),
                        ]),
                      ],
                      1
                    ),
                    e._v(" "),
                    a(
                      "el-col",
                      { staticClass: "align-right", attrs: { span: 4 } },
                      [
                        a("el-switch", {
                          attrs: { "active-text": "", "inactive-text": "" },
                          model: {
                            value: e.settings.pendingAppointmentsMeetings,
                            callback: function (t) {
                              e.$set(
                                e.settings,
                                "pendingAppointmentsMeetings",
                                t
                              );
                            },
                            expression: "settings.pendingAppointmentsMeetings",
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
        );
      },
      staticRenderFns: [],
    };
  },
  1291: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("div", [
          a(
            "div",
            { staticClass: "am-dialog-scrollable" },
            [
              a(
                "div",
                { staticClass: "am-dialog-header" },
                [
                  a(
                    "el-row",
                    [
                      a("el-col", { attrs: { span: 20 } }, [
                        a("h2", [
                          e._v(
                            "\n            " +
                              e._s(e.$root.labels.integrations_settings) +
                              "\n          "
                          ),
                        ]),
                      ]),
                      e._v(" "),
                      a(
                        "el-col",
                        { staticClass: "align-right", attrs: { span: 4 } },
                        [
                          a("el-button", {
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
              a(
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
                  a(
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
                      a(
                        "el-tab-pane",
                        {
                          attrs: {
                            label: e.$root.labels.google_calendar,
                            name: "googleCalendar",
                          },
                        },
                        [
                          a("google-calendar", {
                            attrs: { googleCalendar: e.googleCalendarSettings },
                          }),
                        ],
                        1
                      ),
                      e._v(" "),
                      a(
                        "el-tab-pane",
                        {
                          attrs: {
                            label: e.$root.labels.outlook_calendar,
                            name: "outlookCalendar",
                          },
                        },
                        [
                          a("outlook-calendar", {
                            attrs: {
                              outlookCalendar: e.outlookCalendarSettings,
                            },
                          }),
                        ],
                        1
                      ),
                      e._v(" "),
                      a(
                        "el-tab-pane",
                        { attrs: { label: e.$root.labels.zoom, name: "zoom" } },
                        [a("zoom", { attrs: { zoom: e.zoomSettings } })],
                        1
                      ),
                      e._v(" "),
                      a(
                        "el-tab-pane",
                        {
                          attrs: {
                            label: e.$root.labels.web_hooks,
                            name: "webHooks",
                          },
                        },
                        [
                          a("web-hooks", {
                            attrs: { webHooks: e.webHooksSettings },
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
          a("div", { staticClass: "am-dialog-footer" }, [
            a(
              "div",
              { staticClass: "am-dialog-footer-actions" },
              [
                a(
                  "el-row",
                  [
                    a(
                      "el-col",
                      { staticClass: "align-right", attrs: { sm: 24 } },
                      [
                        a(
                          "el-button",
                          { attrs: { type: "" }, on: { click: e.closeDialog } },
                          [e._v(e._s(e.$root.labels.cancel))]
                        ),
                        e._v(" "),
                        a(
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
  1292: function (e, t, a) {
    var s = a(685)(a(1293), a(1294), !1, null, null, null);
    e.exports = s.exports;
  },
  1293: function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var s = a(687);
    t.default = {
      mixins: [s.a],
      props: ["labels"],
      data: function () {
        return { settings: Object.assign({}, this.labels) };
      },
      updated: function () {
        this.inlineSVG();
      },
      mounted: function () {
        this.inlineSVG();
      },
      methods: {
        closeDialog: function () {
          this.$emit("closeDialogSettingsLabels");
        },
        onSubmit: function () {
          this.$emit("closeDialogSettingsLabels"),
            this.$emit("updateSettings", { labels: this.settings });
        },
      },
    };
  },
  1294: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("div", [
          a(
            "div",
            { staticClass: "am-dialog-scrollable" },
            [
              a(
                "div",
                { staticClass: "am-dialog-header" },
                [
                  a(
                    "el-row",
                    [
                      a("el-col", { attrs: { span: 20 } }, [
                        a("h2", [e._v(e._s(e.$root.labels.labels_settings))]),
                      ]),
                      e._v(" "),
                      a(
                        "el-col",
                        { staticClass: "align-right", attrs: { span: 4 } },
                        [
                          a("el-button", {
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
              a(
                "el-form",
                {
                  ref: "settings",
                  attrs: { model: e.settings, "label-position": "top" },
                  on: {
                    submit: function (t) {
                      return t.preventDefault(), e.onSubmit(t);
                    },
                  },
                },
                [
                  a(
                    "div",
                    { staticClass: "am-setting-box am-switch-box" },
                    [
                      a(
                        "el-row",
                        {
                          attrs: { type: "flex", align: "middle", gutter: 24 },
                        },
                        [
                          a(
                            "el-col",
                            { attrs: { span: 20 } },
                            [
                              e._v(
                                "\n            " +
                                  e._s(e.$root.labels.enable_labels_settings) +
                                  "\n            "
                              ),
                              a("el-tooltip", { attrs: { placement: "top" } }, [
                                a("div", {
                                  attrs: { slot: "content" },
                                  domProps: {
                                    innerHTML: e._s(
                                      e.$root.labels
                                        .enable_labels_settings_tooltip
                                    ),
                                  },
                                  slot: "content",
                                }),
                                e._v(" "),
                                a("i", {
                                  staticClass:
                                    "el-icon-question am-tooltip-icon",
                                }),
                              ]),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-col",
                            { staticClass: "align-right", attrs: { span: 4 } },
                            [
                              a("el-switch", {
                                attrs: {
                                  "active-text": "",
                                  "inactive-text": "",
                                },
                                model: {
                                  value: e.settings.enabled,
                                  callback: function (t) {
                                    e.$set(e.settings, "enabled", t);
                                  },
                                  expression: "settings.enabled",
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
                  a(
                    "el-form-item",
                    { attrs: { label: e.$root.labels.label_employee + ":" } },
                    [
                      a("el-input", {
                        attrs: {
                          disabled: !1 === e.settings.enabled,
                          placeholder: "",
                        },
                        model: {
                          value: e.settings.employee,
                          callback: function (t) {
                            e.$set(e.settings, "employee", t);
                          },
                          expression: "settings.employee",
                        },
                      }),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-form-item",
                    { attrs: { label: e.$root.labels.label_employees + ":" } },
                    [
                      a("el-input", {
                        attrs: {
                          disabled: !1 === e.settings.enabled,
                          placeholder: "",
                        },
                        model: {
                          value: e.settings.employees,
                          callback: function (t) {
                            e.$set(e.settings, "employees", t);
                          },
                          expression: "settings.employees",
                        },
                      }),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-form-item",
                    { attrs: { label: e.$root.labels.label_service + ":" } },
                    [
                      a("el-input", {
                        attrs: {
                          disabled: !1 === e.settings.enabled,
                          placeholder: "",
                        },
                        model: {
                          value: e.settings.service,
                          callback: function (t) {
                            e.$set(e.settings, "service", t);
                          },
                          expression: "settings.service",
                        },
                      }),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-form-item",
                    { attrs: { label: e.$root.labels.label_services + ":" } },
                    [
                      a("el-input", {
                        attrs: {
                          disabled: !1 === e.settings.enabled,
                          placeholder: "",
                        },
                        model: {
                          value: e.settings.services,
                          callback: function (t) {
                            e.$set(e.settings, "services", t);
                          },
                          expression: "settings.services",
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
          a("div", { staticClass: "am-dialog-footer" }, [
            a(
              "div",
              { staticClass: "am-dialog-footer-actions" },
              [
                a(
                  "el-row",
                  [
                    a(
                      "el-col",
                      { staticClass: "align-right", attrs: { sm: 24 } },
                      [
                        a(
                          "el-button",
                          { attrs: { type: "" }, on: { click: e.closeDialog } },
                          [e._v(e._s(e.$root.labels.cancel))]
                        ),
                        e._v(" "),
                        a(
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
  1295: function (e, t, a) {
    var s = a(685)(a(1296), a(1297), !1, null, null, null);
    e.exports = s.exports;
  },
  1296: function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var s = a(687),
      o = a(686);
    t.default = {
      mixins: [s.a, o.a],
      props: { notifications: { type: Object } },
      data: function () {
        return {
          bccEmails: [],
          settings: Object.assign({}, this.notifications),
          options: {
            mailServices: [
              { label: this.$root.labels.php_mail, value: "php" },
              { label: this.$root.labels.wp_mail, value: "wp_mail" },
              { label: this.$root.labels.smtp, value: "smtp" },
              { label: this.$root.labels.mailgun, value: "mailgun" },
            ],
            smtpSecureOptions: [
              { label: this.$root.labels.smtp_secure_ssl, value: "ssl" },
              { label: this.$root.labels.smtp_secure_tls, value: "tls" },
              { label: this.$root.labels.smtp_secure_disabled, value: !1 },
            ],
          },
          rules: {
            senderName: [
              {
                required: !0,
                message: this.$root.labels.sender_name_warning,
                trigger: "submit",
              },
            ],
            senderEmail: [
              {
                required: !0,
                message: this.$root.labels.sender_email_warning,
                trigger: "submit",
              },
              {
                type: "email",
                message: this.$root.labels.enter_valid_email_warning,
                trigger: "submit",
              },
            ],
            smtpHost: [],
            smtpPort: [],
            smtpUsername: [],
            smtpPassword: [],
            mailgunApiKey: [],
            mailgunDomain: [],
          },
        };
      },
      updated: function () {
        this.inlineSVG();
      },
      mounted: function () {
        this.settings.bccEmail &&
          (this.bccEmails = this.settings.bccEmail.split(",")),
          this.inlineSVG(),
          this.changeMailService();
      },
      methods: {
        closeDialog: function () {
          this.$emit("closeDialogSettingsNotifications");
        },
        changeMailService: function () {
          this.clearValidation(),
            (this.rules.smtpHost = []),
            (this.rules.smtpPort = []),
            (this.rules.smtpUsername = []),
            (this.rules.smtpPassword = []),
            (this.rules.mailgunApiKey = []),
            (this.rules.mailgunDomain = []),
            "smtp" === this.settings.mailService &&
              ((this.rules.smtpHost = [
                {
                  required: !0,
                  message: this.$root.labels.smtp_host_warning,
                  trigger: "submit",
                },
              ]),
              (this.rules.smtpPort = [
                {
                  required: !0,
                  message: this.$root.labels.smtp_port_warning,
                  trigger: "submit",
                },
              ]),
              (this.rules.smtpUsername = [
                {
                  required: !0,
                  message: this.$root.labels.smtp_username_warning,
                  trigger: "submit",
                },
              ]),
              (this.rules.smtpPassword = [
                {
                  required: !0,
                  message: this.$root.labels.smtp_password_warning,
                  trigger: "submit",
                },
              ])),
            "mailgun" === this.settings.mailService &&
              ((this.rules.mailgunApiKey = [
                {
                  required: !0,
                  message: this.$root.labels.mailgun_api_key_warning,
                  trigger: "submit",
                },
              ]),
              (this.rules.mailgunDomain = [
                {
                  required: !0,
                  message: this.$root.labels.mailgun_domain_warning,
                  trigger: "submit",
                },
              ]));
        },
        emailsChanged: function (e) {
          !e.length ||
            ("" !== e[e.length - 1].trim() &&
              /(.+)@(.+){2,}\.(.+){2,}/.test(e[e.length - 1])) ||
            e.pop();
        },
        onSubmit: function () {
          var e = this;
          this.$refs.settings.validate(function (t) {
            t &&
              (e.$emit("closeDialogSettingsNotifications"),
              e.$emit("updateSettings", {
                notifications: Object.assign(e.settings, {
                  bccEmail: e.bccEmails.join(","),
                }),
              }));
          });
        },
        clearValidation: function () {
          this.$refs.settings.clearValidate();
        },
      },
      components: {},
    };
  },
  1297: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("div", [
          a(
            "div",
            { staticClass: "am-dialog-scrollable" },
            [
              a(
                "div",
                { staticClass: "am-dialog-header" },
                [
                  a(
                    "el-row",
                    [
                      a("el-col", { attrs: { span: 20 } }, [
                        a("h2", [
                          e._v(e._s(e.$root.labels.notifications_settings)),
                        ]),
                      ]),
                      e._v(" "),
                      a(
                        "el-col",
                        { staticClass: "align-right", attrs: { span: 4 } },
                        [
                          a("el-button", {
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
              a(
                "el-form",
                {
                  ref: "settings",
                  attrs: {
                    model: e.settings,
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
                  a(
                    "el-form-item",
                    { attrs: { label: e.$root.labels.mail_service + ":" } },
                    [
                      a(
                        "el-select",
                        {
                          on: {
                            change: function (t) {
                              return e.changeMailService();
                            },
                          },
                          model: {
                            value: e.settings.mailService,
                            callback: function (t) {
                              e.$set(e.settings, "mailService", t);
                            },
                            expression: "settings.mailService",
                          },
                        },
                        e._l(e.options.mailServices, function (e) {
                          return a("el-option", {
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
                  a(
                    "el-form-item",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: "smtp" === e.settings.mailService,
                          expression: "settings.mailService === 'smtp'",
                        },
                      ],
                      attrs: {
                        label: e.$root.labels.smtp_host + ":",
                        prop: "smtpHost",
                      },
                    },
                    [
                      a("el-input", {
                        on: {
                          input: function (t) {
                            return e.clearValidation();
                          },
                          change: function (t) {
                            return e.trimProperty(e.settings, "smtpHost");
                          },
                        },
                        model: {
                          value: e.settings.smtpHost,
                          callback: function (t) {
                            e.$set(e.settings, "smtpHost", t);
                          },
                          expression: "settings.smtpHost",
                        },
                      }),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-form-item",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: "smtp" === e.settings.mailService,
                          expression: "settings.mailService === 'smtp'",
                        },
                      ],
                      attrs: {
                        label: e.$root.labels.smtp_port + ":",
                        prop: "smtpPort",
                      },
                    },
                    [
                      a("el-input", {
                        on: {
                          input: function (t) {
                            return e.clearValidation();
                          },
                          change: function (t) {
                            return e.trimProperty(e.settings, "smtpPort");
                          },
                        },
                        model: {
                          value: e.settings.smtpPort,
                          callback: function (t) {
                            e.$set(e.settings, "smtpPort", t);
                          },
                          expression: "settings.smtpPort",
                        },
                      }),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-form-item",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: "smtp" === e.settings.mailService,
                          expression: "settings.mailService === 'smtp'",
                        },
                      ],
                      attrs: { label: e.$root.labels.smtp_secure + ":" },
                    },
                    [
                      a(
                        "el-select",
                        {
                          model: {
                            value: e.settings.smtpSecure,
                            callback: function (t) {
                              e.$set(e.settings, "smtpSecure", t);
                            },
                            expression: "settings.smtpSecure",
                          },
                        },
                        e._l(e.options.smtpSecureOptions, function (e) {
                          return a("el-option", {
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
                  a(
                    "el-form-item",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: "smtp" === e.settings.mailService,
                          expression: "settings.mailService === 'smtp'",
                        },
                      ],
                      attrs: {
                        label: e.$root.labels.smtp_username + ":",
                        prop: "smtpUsername",
                      },
                    },
                    [
                      a("el-input", {
                        on: {
                          input: function (t) {
                            return e.clearValidation();
                          },
                          change: function (t) {
                            return e.trimProperty(e.settings, "smtpUsername");
                          },
                        },
                        model: {
                          value: e.settings.smtpUsername,
                          callback: function (t) {
                            e.$set(e.settings, "smtpUsername", t);
                          },
                          expression: "settings.smtpUsername",
                        },
                      }),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-form-item",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: "smtp" === e.settings.mailService,
                          expression: "settings.mailService === 'smtp'",
                        },
                      ],
                      attrs: {
                        label: e.$root.labels.smtp_password + ":",
                        prop: "smtpPassword",
                      },
                    },
                    [
                      a("el-input", {
                        attrs: { type: "password" },
                        on: {
                          input: function (t) {
                            return e.clearValidation();
                          },
                          change: function (t) {
                            return e.trimProperty(e.settings, "smtpPassword");
                          },
                        },
                        model: {
                          value: e.settings.smtpPassword,
                          callback: function (t) {
                            e.$set(e.settings, "smtpPassword", t);
                          },
                          expression: "settings.smtpPassword",
                        },
                      }),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-form-item",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: "mailgun" === e.settings.mailService,
                          expression: "settings.mailService === 'mailgun'",
                        },
                      ],
                      attrs: {
                        label: e.$root.labels.mailgun_api_key + ":",
                        prop: "mailgunApiKey",
                      },
                    },
                    [
                      a("el-input", {
                        on: {
                          input: function (t) {
                            return e.clearValidation();
                          },
                          change: function (t) {
                            return e.trimProperty(e.settings, "mailgunApiKey");
                          },
                        },
                        model: {
                          value: e.settings.mailgunApiKey,
                          callback: function (t) {
                            e.$set(e.settings, "mailgunApiKey", t);
                          },
                          expression: "settings.mailgunApiKey",
                        },
                      }),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-form-item",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: "mailgun" === e.settings.mailService,
                          expression: "settings.mailService === 'mailgun'",
                        },
                      ],
                      attrs: {
                        label: e.$root.labels.mailgun_domain + ":",
                        prop: "mailgunDomain",
                      },
                    },
                    [
                      a("el-input", {
                        on: {
                          input: function (t) {
                            return e.clearValidation();
                          },
                          change: function (t) {
                            return e.trimProperty(e.settings, "mailgunDomain");
                          },
                        },
                        model: {
                          value: e.settings.mailgunDomain,
                          callback: function (t) {
                            e.$set(e.settings, "mailgunDomain", t);
                          },
                          expression: "settings.mailgunDomain",
                        },
                      }),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-form-item",
                    {
                      attrs: {
                        label: e.$root.labels.sender_name + ":",
                        prop: "senderName",
                      },
                    },
                    [
                      a("el-input", {
                        on: {
                          input: function (t) {
                            return e.clearValidation();
                          },
                          change: function (t) {
                            return e.trimProperty(e.settings, "senderName");
                          },
                        },
                        model: {
                          value: e.settings.senderName,
                          callback: function (t) {
                            e.$set(e.settings, "senderName", t);
                          },
                          expression: "settings.senderName",
                        },
                      }),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-form-item",
                    {
                      attrs: {
                        label: e.$root.labels.sender_email + ":",
                        prop: "senderEmail",
                      },
                    },
                    [
                      a("el-input", {
                        attrs: {
                          placeholder: e.$root.labels.email_placeholder,
                        },
                        on: {
                          input: function (t) {
                            return e.clearValidation();
                          },
                          change: function (t) {
                            return e.trimProperty(e.settings, "senderEmail");
                          },
                        },
                        model: {
                          value: e.settings.senderEmail,
                          callback: function (t) {
                            e.$set(e.settings, "senderEmail", t);
                          },
                          expression: "settings.senderEmail",
                        },
                      }),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-form-item",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: "mailgun" === e.settings.mailService,
                          expression: "settings.mailService === 'mailgun'",
                        },
                      ],
                    },
                    [
                      a(
                        "label",
                        { attrs: { slot: "label" }, slot: "label" },
                        [
                          e._v(
                            "\n          " +
                              e._s(e.$root.labels.endpoint) +
                              ":\n          "
                          ),
                          a("el-tooltip", { attrs: { placement: "top" } }, [
                            a("div", {
                              attrs: { slot: "content" },
                              domProps: {
                                innerHTML: e._s(
                                  e.$root.labels.endpoint_tooltip
                                ),
                              },
                              slot: "content",
                            }),
                            e._v(" "),
                            a("i", {
                              staticClass: "el-icon-question am-tooltip-icon",
                            }),
                          ]),
                        ],
                        1
                      ),
                      e._v(" "),
                      a("el-input", {
                        on: {
                          input: function (t) {
                            return e.clearValidation();
                          },
                        },
                        model: {
                          value: e.settings.mailgunEndpoint,
                          callback: function (t) {
                            e.$set(e.settings, "mailgunEndpoint", t);
                          },
                          expression: "settings.mailgunEndpoint",
                        },
                      }),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "div",
                    { staticClass: "am-setting-box am-switch-box" },
                    [
                      a(
                        "el-row",
                        {
                          attrs: { type: "flex", align: "middle", gutter: 24 },
                        },
                        [
                          a("el-col", { attrs: { span: 16 } }, [
                            a("p", [
                              e._v(
                                e._s(e.$root.labels.notify_customers_default)
                              ),
                            ]),
                          ]),
                          e._v(" "),
                          a(
                            "el-col",
                            { staticClass: "align-right", attrs: { span: 8 } },
                            [
                              a("el-switch", {
                                attrs: {
                                  "active-text": "",
                                  "inactive-text": "",
                                },
                                model: {
                                  value: e.settings.notifyCustomers,
                                  callback: function (t) {
                                    e.$set(e.settings, "notifyCustomers", t);
                                  },
                                  expression: "settings.notifyCustomers",
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
                  a(
                    "el-form-item",
                    {
                      attrs: { label: e.$root.labels.cancel_success_url + ":" },
                    },
                    [
                      a("el-input", {
                        attrs: {
                          placeholder: e.$root.labels.cancel_url_placeholder,
                        },
                        on: {
                          input: function (t) {
                            return e.clearValidation();
                          },
                        },
                        model: {
                          value: e.settings.cancelSuccessUrl,
                          callback: function (t) {
                            e.$set(e.settings, "cancelSuccessUrl", t);
                          },
                          expression: "settings.cancelSuccessUrl",
                        },
                      }),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-form-item",
                    { attrs: { label: "placeholder" } },
                    [
                      a(
                        "label",
                        { attrs: { slot: "label" }, slot: "label" },
                        [
                          e._v(
                            "\n          " +
                              e._s(e.$root.labels.cancel_error_url) +
                              ":\n          "
                          ),
                          a("el-tooltip", { attrs: { placement: "top" } }, [
                            a("div", {
                              attrs: { slot: "content" },
                              domProps: {
                                innerHTML: e._s(
                                  e.$root.labels.cancel_error_url_tooltip
                                ),
                              },
                              slot: "content",
                            }),
                            e._v(" "),
                            a("i", {
                              staticClass: "el-icon-question am-tooltip-icon",
                            }),
                          ]),
                        ],
                        1
                      ),
                      e._v(" "),
                      a("el-input", {
                        attrs: {
                          placeholder: e.$root.labels.cancel_url_placeholder,
                        },
                        on: {
                          input: function (t) {
                            return e.clearValidation();
                          },
                        },
                        model: {
                          value: e.settings.cancelErrorUrl,
                          callback: function (t) {
                            e.$set(e.settings, "cancelErrorUrl", t);
                          },
                          expression: "settings.cancelErrorUrl",
                        },
                      }),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-form-item",
                    { attrs: { label: "placeholder", prop: "bccEmail" } },
                    [
                      a(
                        "label",
                        { attrs: { slot: "label" }, slot: "label" },
                        [
                          e._v(
                            "\n          " +
                              e._s(e.$root.labels.bcc_email) +
                              ":\n          "
                          ),
                          a("el-tooltip", { attrs: { placement: "top" } }, [
                            a("div", {
                              attrs: { slot: "content" },
                              domProps: {
                                innerHTML: e._s(
                                  e.$root.labels.bcc_email_tooltip
                                ),
                              },
                              slot: "content",
                            }),
                            e._v(" "),
                            a("i", {
                              staticClass: "el-icon-question am-tooltip-icon",
                            }),
                          ]),
                        ],
                        1
                      ),
                      e._v(" "),
                      a(
                        "el-select",
                        {
                          staticClass: "am-setting-notifications-select",
                          attrs: {
                            multiple: "",
                            filterable: "",
                            "allow-create": "",
                            "default-first-option": "",
                            "no-data-text": e.$root.labels.create,
                          },
                          on: { change: e.emailsChanged },
                          model: {
                            value: e.bccEmails,
                            callback: function (t) {
                              e.bccEmails = t;
                            },
                            expression: "bccEmails",
                          },
                        },
                        e._l(e.bccEmails, function (e, t) {
                          return a("el-option", {
                            key: t,
                            attrs: { label: e, value: e },
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
            ],
            1
          ),
          e._v(" "),
          a("div", { staticClass: "am-dialog-footer" }, [
            a(
              "div",
              { staticClass: "am-dialog-footer-actions" },
              [
                a(
                  "el-row",
                  [
                    a(
                      "el-col",
                      { staticClass: "align-right", attrs: { sm: 24 } },
                      [
                        a(
                          "el-button",
                          { attrs: { type: "" }, on: { click: e.closeDialog } },
                          [e._v(e._s(e.$root.labels.cancel))]
                        ),
                        e._v(" "),
                        a(
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
  1298: function (e, t, a) {
    var s = a(685)(a(1299), a(1303), !1, null, null, null);
    e.exports = s.exports;
  },
  1299: function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var s = a(687),
      o = a(689),
      i = a(1300),
      n = a.n(i),
      l = a(966),
      r = a.n(l);
    t.default = {
      mixins: [s.a, o.a],
      props: {
        customFields: {
          default: function () {
            return [];
          },
        },
        categories: {
          default: function () {
            return [];
          },
        },
        coupons: {
          default: function () {
            return [];
          },
        },
        payments: { type: Object },
      },
      data: function () {
        return {
          language: "",
          settings: Object.assign({}, this.payments),
          options: {
            priceSeparators: [
              {
                label: this.$root.labels.comma_dot,
                value: 1,
                example: "15,000.00",
              },
              {
                label: this.$root.labels.dot_comma,
                value: 2,
                example: "15.000,00",
              },
              {
                label: this.$root.labels.space_dot,
                value: 3,
                example: "15 000.00",
              },
              {
                label: this.$root.labels.space_comma,
                value: 4,
                example: "15 000,00",
              },
            ],
            priceSymbolPositions: [
              {
                label: this.$root.labels.before,
                value: "before",
                example: "$100",
              },
              {
                label: this.$root.labels.before_with_space,
                value: "beforeWithSpace",
                example: "$ 100",
              },
              {
                label: this.$root.labels.after,
                value: "after",
                example: "100$",
              },
              {
                label: this.$root.labels.after_with_space,
                value: "afterWithSpace",
                example: "100 $",
              },
            ],
            sandboxMode: [
              { label: this.$root.labels.disabled, value: !1 },
              { label: this.$root.labels.enabled, value: !0 },
            ],
          },
          hasDisabledBookablePaymentMethod: !1,
          rules: { stripe: {}, mollie: {}, payPal: {} },
          stripeCollapse: "",
          payPalCollapse: "",
          wooCommerceCollapse: "",
          mollieCollapse: "",
          activeTab: "appointments",
        };
      },
      mounted: function () {
        var e = this;
        this.inspectBookableSettingsPayments(),
          this.handleStripeValidationRules(),
          this.handlePayPalValidationRules(),
          this.handleMollieValidationRules();
        var t = this.defaultPaymentMethods.find(function (t) {
          return t.value === e.settings.defaultPaymentMethod;
        });
        this.settings.defaultPaymentMethod = t
          ? t.value
          : this.defaultPaymentMethods[0].value;
      },
      methods: {
        languageChanged: function (e) {
          this.language = e;
        },
        inspectBookableSettingsPayments: function () {
          var e = this;
          this.settings.wc.enabled ||
            this.$http
              .get(this.$root.getAjaxUrl + "/entities", {
                params: { types: ["categories", "events"] },
              })
              .then(function (t) {
                var a = !1,
                  s = e;
                t.data.data.categories.forEach(function (e) {
                  e.serviceList.forEach(function (e) {
                    var t = JSON.parse(e.settings);
                    if (t && (!t || "payments" in t)) {
                      var o = s.settings.onSite,
                        i = s.settings.payPal.enabled,
                        n = s.settings.stripe.enabled;
                      o &&
                        "onSite" in t.payments &&
                        !t.payments.onSite &&
                        (o = !1),
                        i &&
                          "payPal" in t.payments &&
                          !t.payments.payPal.enabled &&
                          (i = !1),
                        n &&
                          "stripe" in t.payments &&
                          !t.payments.stripe.enabled &&
                          (n = !1),
                        o || i || n || (a = !0);
                    }
                  });
                }),
                  t.data.data.events.forEach(function (e) {
                    var t = JSON.parse(e.settings);
                    if (t && (!t || "payments" in t)) {
                      var o = s.settings.onSite,
                        i = s.settings.payPal.enabled,
                        n = s.settings.stripe.enabled;
                      o &&
                        "onSite" in t.payments &&
                        !t.payments.onSite &&
                        (o = !1),
                        i &&
                          "payPal" in t.payments &&
                          !t.payments.payPal.enabled &&
                          (i = !1),
                        n &&
                          "stripe" in t.payments &&
                          !t.payments.stripe.enabled &&
                          (n = !1),
                        o || i || n || (a = !0);
                    }
                  }),
                  (e.hasDisabledBookablePaymentMethod = a);
              })
              .catch(function (e) {
                console.log(e.message);
              });
        },
        closeDialog: function () {
          this.$emit("closeDialogSettingsPayments");
        },
        onSubmit: function () {
          var e = this,
            t = Object.fromEntries(
              this.$refs.metaDataAppointments.stripeMetaData
                .filter(function (e) {
                  var t = e.key,
                    a = e.value;
                  return "" !== t && "" !== a;
                })
                .map(function (e) {
                  return [e.key, e.value];
                })
            ),
            a =
              this.$root.licence.isPro || this.$root.licence.isDeveloper
                ? Object.fromEntries(
                    this.$refs.metaDataPackages.stripeMetaData
                      .filter(function (e) {
                        var t = e.key,
                          a = e.value;
                        return "" !== t && "" !== a;
                      })
                      .map(function (e) {
                        return [e.key, e.value];
                      })
                  )
                : {},
            s = Object.fromEntries(
              this.$refs.metaDataEvents.stripeMetaData
                .filter(function (e) {
                  var t = e.key,
                    a = e.value;
                  return "" !== t && "" !== a;
                })
                .map(function (e) {
                  return [e.key, e.value];
                })
            ),
            o = Object.fromEntries(
              this.$refs.metaDataAppointments.mollieMetaData
                .filter(function (e) {
                  var t = e.key,
                    a = e.value;
                  return "" !== t && "" !== a;
                })
                .map(function (e) {
                  return [e.key, e.value];
                })
            ),
            i =
              this.$root.licence.isPro || this.$root.licence.isDeveloper
                ? Object.fromEntries(
                    this.$refs.metaDataPackages.mollieMetaData
                      .filter(function (e) {
                        var t = e.key,
                          a = e.value;
                        return "" !== t && "" !== a;
                      })
                      .map(function (e) {
                        return [e.key, e.value];
                      })
                  )
                : {},
            n = Object.fromEntries(
              this.$refs.metaDataEvents.mollieMetaData
                .filter(function (e) {
                  var t = e.key,
                    a = e.value;
                  return "" !== t && "" !== a;
                })
                .map(function (e) {
                  return [e.key, e.value];
                })
            );
          (this.settings.stripe.metaData.appointment = _.isEmpty(t) ? null : t),
            (this.settings.stripe.metaData.package = _.isEmpty(a) ? null : a),
            (this.settings.stripe.metaData.event = _.isEmpty(s) ? null : s),
            (this.settings.mollie.metaData.appointment = _.isEmpty(o)
              ? null
              : o),
            (this.settings.mollie.metaData.package = _.isEmpty(i) ? null : i),
            (this.settings.mollie.metaData.event = _.isEmpty(n) ? null : n),
            this.$refs.settings.validate(function (t) {
              if (!t)
                return (
                  e.settings.stripe.enabled &&
                    (e.settings.stripe.testMode ||
                      ("" !== e.settings.stripe.livePublishableKey &&
                        "" !== e.settings.stripe.liveSecretKey) ||
                      (e.stripeCollapse = "stripe"),
                    !e.settings.stripe.testMode ||
                      ("" !== e.settings.stripe.testPublishableKey &&
                        "" !== e.settings.stripe.testSecretKey) ||
                      (e.stripeCollapse = "stripe")),
                  e.settings.mollie.enabled &&
                    (e.settings.mollie.testMode ||
                      "" !== e.settings.mollie.liveApiKey ||
                      (e.mollieCollapse = "mollie"),
                    e.settings.stripe.testMode &&
                      "" === e.settings.mollie.testApiKey &&
                      (e.mollieCollapse = "mollie")),
                  e.settings.payPal.enabled &&
                    (e.settings.payPal.sandboxMode ||
                      ("" !== e.settings.payPal.liveApiClientId &&
                        "" !== e.settings.payPal.liveApiSecret) ||
                      (e.payPalCollapse = "payPal"),
                    !e.settings.payPal.sandboxMode ||
                      ("" !== e.settings.payPal.testApiClientId &&
                        "" !== e.settings.payPal.testApiSecret) ||
                      (e.payPalCollapse = "payPal")),
                  !1
                );
              e.$emit("closeDialogSettingsPayments"),
                e.$emit("updateSettings", { payments: e.settings });
            });
        },
        checkOnSitePayment: function () {
          !1 === this.settings.payPal.enabled &&
            !1 === this.settings.stripe.enabled &&
            !1 === this.settings.wc.enabled &&
            (this.settings.onSite = !0);
        },
        toggleOnSite: function () {
          this.inspectBookableSettingsPayments(),
            this.clearValidation(),
            "onSite" === this.settings.defaultPaymentMethod &&
              !1 === this.settings.onSite &&
              (this.settings.defaultPaymentMethod =
                this.defaultPaymentMethods[0].value);
        },
        toggleStripe: function () {
          this.inspectBookableSettingsPayments(),
            this.checkOnSitePayment(),
            this.handleStripeValidationRules(),
            !1 === this.settings.stripe.enabled && (this.stripeCollapse = ""),
            "stripe" === this.settings.defaultPaymentMethod &&
              !1 === this.settings.stripe.enabled &&
              (this.settings.defaultPaymentMethod =
                this.defaultPaymentMethods[0].value);
        },
        togglePayPal: function () {
          this.inspectBookableSettingsPayments(),
            this.checkOnSitePayment(),
            this.handlePayPalValidationRules(),
            this.handleMollieValidationRules(),
            !1 === this.settings.payPal.enabled && (this.payPalCollapse = ""),
            "payPal" === this.settings.defaultPaymentMethod &&
              !1 === this.settings.payPal.enabled &&
              (this.settings.defaultPaymentMethod =
                this.defaultPaymentMethods[0].value);
        },
        toggleWooCommerce: function () {
          (this.settings.onSite = !this.settings.wc.enabled),
            (this.settings.stripe.enabled = !1),
            (this.settings.payPal.enabled = !1),
            (this.settings.mollie.enabled = !1),
            "wc" === this.settings.defaultPaymentMethod &&
              !1 === this.settings.wc.enabled &&
              (this.settings.defaultPaymentMethod =
                this.defaultPaymentMethods[0].value);
        },
        toggleMollie: function () {
          (this.settings.stripe.enabled = !1),
            (this.settings.payPal.enabled = !1),
            (this.settings.wc.enabled = !1),
            this.settings.mollie.enabled || (this.settings.onSite = !0),
            "mollie" === this.settings.defaultPaymentMethod &&
              !1 === this.settings.mollie.enabled &&
              (this.settings.defaultPaymentMethod =
                this.defaultPaymentMethods[0].value);
        },
        handleStripeValidationRules: function () {
          this.clearValidation(),
            !0 === this.settings.stripe.enabled
              ? !0 === this.settings.stripe.testMode
                ? (this.rules.stripe = {
                    testPublishableKey: [
                      {
                        required: !0,
                        message:
                          this.$root.labels.stripe_test_publishable_key_error,
                        trigger: "submit",
                      },
                    ],
                    testSecretKey: [
                      {
                        required: !0,
                        message: this.$root.labels.stripe_test_secret_key_error,
                        trigger: "submit",
                      },
                    ],
                  })
                : (this.rules.stripe = {
                    livePublishableKey: [
                      {
                        required: !0,
                        message:
                          this.$root.labels.stripe_live_publishable_key_error,
                        trigger: "submit",
                      },
                    ],
                    liveSecretKey: [
                      {
                        required: !0,
                        message: this.$root.labels.stripe_live_secret_key_error,
                        trigger: "submit",
                      },
                    ],
                  })
              : (this.rules.stripe = {});
        },
        handlePayPalValidationRules: function () {
          this.clearValidation(),
            !0 === this.settings.payPal.enabled
              ? !0 === this.settings.payPal.sandboxMode
                ? (this.rules.payPal = {
                    testApiClientId: [
                      {
                        required: !0,
                        message: this.$root.labels.payPal_test_client_id_error,
                        trigger: "submit",
                      },
                    ],
                    testApiSecret: [
                      {
                        required: !0,
                        message: this.$root.labels.payPal_test_secret_error,
                        trigger: "submit",
                      },
                    ],
                  })
                : (this.rules.payPal = {
                    liveApiClientId: [
                      {
                        required: !0,
                        message: this.$root.labels.payPal_live_client_id_error,
                        trigger: "submit",
                      },
                    ],
                    liveApiSecret: [
                      {
                        required: !0,
                        message: this.$root.labels.payPal_live_secret_error,
                        trigger: "submit",
                      },
                    ],
                  })
              : (this.rules.payPal = {});
        },
        handleMollieValidationRules: function () {
          this.clearValidation(),
            !0 === this.settings.mollie.enabled
              ? !0 === this.settings.mollie.testMode
                ? (this.rules.mollie = {
                    testApiKey: [
                      {
                        required: !0,
                        message: this.$root.labels.mollie_test_api_key_error,
                        trigger: "submit",
                      },
                    ],
                  })
                : (this.rules.mollie = {
                    liveApiKey: [
                      {
                        required: !0,
                        message: this.$root.labels.mollie_live_api_key_error,
                        trigger: "submit",
                      },
                    ],
                  })
              : (this.rules.mollie = {});
        },
        clearValidation: function () {
          void 0 !== this.$refs.settings && this.$refs.settings.clearValidate();
        },
      },
      computed: {
        showStripeAlert: function () {
          return "https:" !== location.protocol;
        },
        defaultPaymentMethods: function () {
          var e = [];
          return (
            this.settings.onSite &&
              e.push({ label: this.$root.labels.on_site, value: "onSite" }),
            this.settings.payPal.enabled &&
              e.push({ label: this.$root.labels.payPal, value: "payPal" }),
            this.settings.stripe.enabled &&
              e.push({ label: this.$root.labels.stripe, value: "stripe" }),
            this.settings.wc.enabled &&
              e.push({ label: this.$root.labels.wc, value: "wc" }),
            this.settings.mollie.enabled &&
              e.push({ label: this.$root.labels.mollie, value: "mollie" }),
            e
          );
        },
      },
      watch: {
        "settings.currency": function () {
          var e = this;
          this.settings.symbol = this.currencies.find(function (t) {
            return t.code === e.settings.currency;
          }).symbol;
        },
      },
      components: { PaymentsMetaData: n.a, SelectTranslate: r.a },
    };
  },
  1300: function (e, t, a) {
    var s = a(685)(a(1301), a(1302), !1, null, null, null);
    e.exports = s.exports;
  },
  1301: function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var s = a(900),
      o = a.n(s),
      i = (function () {
        return function (e, t) {
          if (Array.isArray(e)) return e;
          if (Symbol.iterator in Object(e))
            return (function (e, t) {
              var a = [],
                s = !0,
                o = !1,
                i = void 0;
              try {
                for (
                  var n, l = e[Symbol.iterator]();
                  !(s = (n = l.next()).done) &&
                  (a.push(n.value), !t || a.length !== t);
                  s = !0
                );
              } catch (e) {
                (o = !0), (i = e);
              } finally {
                try {
                  !s && l.return && l.return();
                } finally {
                  if (o) throw i;
                }
              }
              return a;
            })(e, t);
          throw new TypeError(
            "Invalid attempt to destructure non-iterable instance"
          );
        };
      })();
    t.default = {
      name: "PaymentsMetaData",
      props: {
        customFields: {
          default: function () {
            return [];
          },
        },
        categories: {
          default: function () {
            return [];
          },
        },
        coupons: {
          default: function () {
            return [];
          },
        },
        data: Object,
        language: "",
        tab: String,
      },
      data: function () {
        return { stripeMetaData: null, mollieMetaData: null };
      },
      mounted: function () {
        (this.stripeMetaData = Object.entries(this.metaDataForStripe).map(
          function (e) {
            var t = i(e, 2);
            return { key: t[0], value: t[1] };
          }
        )),
          this.stripeMetaData.push({ key: "", value: "" }),
          (this.mollieMetaData = Object.entries(this.metaDataForMollie).map(
            function (e) {
              var t = i(e, 2);
              return { key: t[0], value: t[1] };
            }
          )),
          this.mollieMetaData.push({ key: "", value: "" });
      },
      computed: {
        description_wc: {
          get: function () {
            switch (this.tab) {
              case "appointments":
                return this.data.wc.checkoutData.appointment;
              case "events":
                return this.data.wc.checkoutData.event;
              case "packages":
                return this.data.wc.checkoutData.package;
            }
          },
          set: function (e) {
            switch (this.tab) {
              case "appointments":
                this.data.wc.checkoutData.appointment = e;
                break;
              case "events":
                this.data.wc.checkoutData.event = e;
                break;
              case "packages":
                this.data.wc.checkoutData.package = e;
            }
          },
        },
        description_translated_wc: {
          get: function () {
            switch (this.tab) {
              case "appointments":
                return this.data.wc.checkoutData.translations.appointment;
              case "events":
                return this.data.wc.checkoutData.translations.event;
              case "packages":
                return this.data.wc.checkoutData.translations.package;
            }
          },
          set: function (e) {
            switch (this.tab) {
              case "appointments":
                this.data.wc.checkoutData.translations.appointment = e;
                break;
              case "events":
                this.data.wc.checkoutData.translations.event = e;
                break;
              case "packages":
                this.data.wc.checkoutData.translations.package = e;
            }
          },
        },
        description_paypal: {
          get: function () {
            switch (this.tab) {
              case "appointments":
                return this.data.payPal.description.appointment;
              case "events":
                return this.data.payPal.description.event;
              case "packages":
                return this.data.payPal.description.package;
            }
          },
          set: function (e) {
            switch (this.tab) {
              case "appointments":
                this.data.payPal.description.appointment = e;
                break;
              case "events":
                this.data.payPal.description.event = e;
                break;
              case "packages":
                this.data.payPal.description.package = e;
            }
          },
        },
        description_stripe: {
          get: function () {
            switch (this.tab) {
              case "appointments":
                return this.data.stripe.description.appointment;
              case "events":
                return this.data.stripe.description.event;
              case "packages":
                return this.data.stripe.description.package;
            }
          },
          set: function (e) {
            switch (this.tab) {
              case "appointments":
                this.data.stripe.description.appointment = e;
                break;
              case "events":
                this.data.stripe.description.event = e;
                break;
              case "packages":
                this.data.stripe.description.package = e;
            }
          },
        },
        description_mollie: {
          get: function () {
            switch (this.tab) {
              case "appointments":
                return this.data.mollie.description.appointment;
              case "events":
                return this.data.mollie.description.event;
              case "packages":
                return this.data.mollie.description.package;
            }
          },
          set: function (e) {
            switch (this.tab) {
              case "appointments":
                this.data.mollie.description.appointment = e;
                break;
              case "events":
                this.data.mollie.description.event = e;
                break;
              case "packages":
                this.data.mollie.description.package = e;
            }
          },
        },
        metaDataForStripe: {
          get: function () {
            switch (this.tab) {
              case "appointments":
                return null != this.data.stripe.metaData.appointment
                  ? this.data.stripe.metaData.appointment
                  : {};
              case "events":
                return null != this.data.stripe.metaData.event
                  ? this.data.stripe.metaData.event
                  : {};
              case "packages":
                return null != this.data.stripe.metaData.package
                  ? this.data.stripe.metaData.package
                  : {};
            }
          },
        },
        metaDataForMollie: {
          get: function () {
            switch (this.tab) {
              case "appointments":
                return null != this.data.mollie.metaData.appointment
                  ? this.data.mollie.metaData.appointment
                  : {};
              case "events":
                return null != this.data.mollie.metaData.event
                  ? this.data.mollie.metaData.event
                  : {};
              case "packages":
                return null != this.data.mollie.metaData.package
                  ? this.data.mollie.metaData.package
                  : {};
            }
          },
        },
      },
      methods: {
        getInlinePlaceholdersNames: function () {
          var e = ["customerPlaceholders", "companyPlaceholders"];
          switch (this.tab) {
            case "packages":
              return e.concat(["packagePlaceholders"]);
            case "events":
              return e.concat([
                "eventPlaceholders",
                "customFieldsPlaceholders",
                "employeePlaceholders",
                "locationPlaceholders",
                "couponsPlaceholders",
              ]);
            case "appointments":
              return e.concat([
                "appointmentPlaceholders",
                "customFieldsPlaceholders",
                "employeePlaceholders",
                "categoryPlaceholders",
                "locationPlaceholders",
                "couponsPlaceholders",
                "extrasPlaceholders",
              ]);
          }
          return e;
        },
        addStripePair: function () {
          this.stripeMetaData.push({ key: "", value: "" });
        },
        deleteStripePair: function (e) {
          this.stripeMetaData.splice(e, 1);
        },
        addMolliePair: function () {
          this.mollieMetaData.push({ key: "", value: "" });
        },
        deleteMolliePair: function (e) {
          this.mollieMetaData.splice(e, 1);
        },
      },
      components: { InlinePlaceholders: o.a },
    };
  },
  1302: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a(
          "div",
          [
            a(
              "div",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: e.data.stripe.enabled,
                    expression: "data.stripe.enabled",
                  },
                ],
              },
              [
                a(
                  "el-row",
                  { staticClass: "zero-margin-bottom", attrs: { gutter: 24 } },
                  [
                    a(
                      "el-col",
                      { attrs: { span: 11 } },
                      [
                        a("el-form-item", {
                          attrs: { label: e.$root.labels.name + ":" },
                        }),
                      ],
                      1
                    ),
                    e._v(" "),
                    a("el-col", { attrs: { span: 11 } }, [
                      a(
                        "label",
                        { staticClass: "el-form-item__label" },
                        [
                          e._v(
                            "\n        " +
                              e._s(e.$root.labels.value + ": ") +
                              "\n        "
                          ),
                          a("el-tooltip", { attrs: { placement: "top" } }, [
                            a(
                              "div",
                              { attrs: { slot: "content" }, slot: "content" },
                              [
                                e._v(
                                  e._s(e.$root.labels.metadata_value_tooltip)
                                ),
                              ]
                            ),
                            e._v(" "),
                            a("i", {
                              staticClass: "el-icon-question am-tooltip-icon",
                            }),
                          ]),
                        ],
                        1
                      ),
                    ]),
                  ],
                  1
                ),
                e._v(" "),
                e._l(e.stripeMetaData, function (t, s) {
                  return a(
                    "el-row",
                    {
                      key: s,
                      staticClass: "small-margin-bottom am-payments-meta-data",
                      attrs: { gutter: 24, type: "flex" },
                    },
                    [
                      a(
                        "el-col",
                        { attrs: { span: 10 } },
                        [
                          a("el-input", {
                            attrs: { type: "text", name: t.name },
                            model: {
                              value: e.stripeMetaData[s].key,
                              callback: function (t) {
                                e.$set(e.stripeMetaData[s], "key", t);
                              },
                              expression: "stripeMetaData[index].key",
                            },
                          }),
                        ],
                        1
                      ),
                      e._v(" "),
                      a(
                        "el-col",
                        { attrs: { span: 10 } },
                        [
                          a("el-input", {
                            attrs: { type: "text" },
                            model: {
                              value: e.stripeMetaData[s].value,
                              callback: function (t) {
                                e.$set(e.stripeMetaData[s], "value", t);
                              },
                              expression: "stripeMetaData[index].value",
                            },
                          }),
                        ],
                        1
                      ),
                      e._v(" "),
                      a("el-col", { attrs: { span: 4 } }, [
                        a(
                          "span",
                          {
                            on: {
                              click: function (t) {
                                return e.deleteStripePair(s);
                              },
                            },
                          },
                          [
                            a("img", {
                              staticClass: "svg",
                              attrs: {
                                width: "16px",
                                src: e.$root.getUrl + "public/img/delete.svg",
                              },
                            }),
                          ]
                        ),
                      ]),
                    ],
                    1
                  );
                }),
                e._v(" "),
                a(
                  "el-row",
                  { attrs: { gutter: 24 } },
                  [
                    a(
                      "el-col",
                      [
                        a(
                          "el-button",
                          {
                            attrs: { type: "primary" },
                            on: {
                              click: function (t) {
                                return e.addStripePair();
                              },
                            },
                          },
                          [e._v(e._s(e.$root.labels.add_metaData))]
                        ),
                      ],
                      1
                    ),
                  ],
                  1
                ),
              ],
              2
            ),
            e._v(" "),
            a(
              "div",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: e.data.mollie.enabled,
                    expression: "data.mollie.enabled",
                  },
                ],
              },
              [
                a(
                  "el-row",
                  { staticClass: "zero-margin-bottom", attrs: { gutter: 24 } },
                  [
                    a(
                      "el-col",
                      { attrs: { span: 11 } },
                      [
                        a("el-form-item", {
                          attrs: { label: e.$root.labels.name + ":" },
                        }),
                      ],
                      1
                    ),
                    e._v(" "),
                    a("el-col", { attrs: { span: 11 } }, [
                      a(
                        "label",
                        { staticClass: "el-form-item__label" },
                        [
                          e._v(
                            "\n          " +
                              e._s(e.$root.labels.value + ": ") +
                              "\n          "
                          ),
                          a("el-tooltip", { attrs: { placement: "top" } }, [
                            a(
                              "div",
                              { attrs: { slot: "content" }, slot: "content" },
                              [
                                e._v(
                                  e._s(e.$root.labels.metadata_value_tooltip)
                                ),
                              ]
                            ),
                            e._v(" "),
                            a("i", {
                              staticClass: "el-icon-question am-tooltip-icon",
                            }),
                          ]),
                        ],
                        1
                      ),
                    ]),
                  ],
                  1
                ),
                e._v(" "),
                e._l(e.mollieMetaData, function (t, s) {
                  return a(
                    "el-row",
                    {
                      key: s,
                      staticClass: "small-margin-bottom am-payments-meta-data",
                      attrs: { gutter: 24, type: "flex" },
                    },
                    [
                      a(
                        "el-col",
                        { attrs: { span: 10 } },
                        [
                          a("el-input", {
                            attrs: { type: "text", name: t.name },
                            model: {
                              value: e.mollieMetaData[s].key,
                              callback: function (t) {
                                e.$set(e.mollieMetaData[s], "key", t);
                              },
                              expression: "mollieMetaData[index].key",
                            },
                          }),
                        ],
                        1
                      ),
                      e._v(" "),
                      a(
                        "el-col",
                        { attrs: { span: 10 } },
                        [
                          a("el-input", {
                            attrs: { type: "text" },
                            model: {
                              value: e.mollieMetaData[s].value,
                              callback: function (t) {
                                e.$set(e.mollieMetaData[s], "value", t);
                              },
                              expression: "mollieMetaData[index].value",
                            },
                          }),
                        ],
                        1
                      ),
                      e._v(" "),
                      a("el-col", { attrs: { span: 4 } }, [
                        a(
                          "span",
                          {
                            on: {
                              click: function (t) {
                                return e.deleteMolliePair(s);
                              },
                            },
                          },
                          [
                            a("img", {
                              staticClass: "svg",
                              attrs: {
                                width: "16px",
                                src: e.$root.getUrl + "public/img/delete.svg",
                              },
                            }),
                          ]
                        ),
                      ]),
                    ],
                    1
                  );
                }),
                e._v(" "),
                a(
                  "el-row",
                  { attrs: { gutter: 24 } },
                  [
                    a(
                      "el-col",
                      [
                        a(
                          "el-button",
                          {
                            attrs: { type: "primary" },
                            on: {
                              click: function (t) {
                                return e.addMolliePair();
                              },
                            },
                          },
                          [e._v(e._s(e.$root.labels.add_metaData))]
                        ),
                      ],
                      1
                    ),
                  ],
                  1
                ),
              ],
              2
            ),
            e._v(" "),
            a(
              "el-form-item",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: e.data.wc.enabled,
                    expression: "data.wc.enabled",
                  },
                ],
                attrs: { label: e.$root.labels.description_wc + ":" },
              },
              [
                e.language
                  ? a("el-input", {
                      attrs: {
                        type: "textarea",
                        autosize: { minRows: 4, maxRows: 6 },
                      },
                      model: {
                        value: e.description_translated_wc[e.language],
                        callback: function (t) {
                          e.$set(e.description_translated_wc, e.language, t);
                        },
                        expression: "description_translated_wc[language]",
                      },
                    })
                  : a("el-input", {
                      attrs: {
                        type: "textarea",
                        autosize: { minRows: 4, maxRows: 6 },
                      },
                      model: {
                        value: e.description_wc,
                        callback: function (t) {
                          e.description_wc = t;
                        },
                        expression: "description_wc",
                      },
                    }),
              ],
              1
            ),
            e._v(" "),
            a(
              "el-form-item",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: e.data.payPal.enabled,
                    expression: "data.payPal.enabled",
                  },
                ],
                attrs: { label: e.$root.labels.description_paypal + ":" },
              },
              [
                a("el-input", {
                  attrs: {
                    type: "textarea",
                    autosize: { minRows: 4, maxRows: 6 },
                  },
                  model: {
                    value: e.description_paypal,
                    callback: function (t) {
                      e.description_paypal = t;
                    },
                    expression: "description_paypal",
                  },
                }),
              ],
              1
            ),
            e._v(" "),
            a(
              "el-form-item",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: e.data.stripe.enabled,
                    expression: "data.stripe.enabled",
                  },
                ],
                attrs: { label: e.$root.labels.description_stripe + ":" },
              },
              [
                a("el-input", {
                  attrs: {
                    type: "textarea",
                    autosize: { minRows: 4, maxRows: 6 },
                  },
                  model: {
                    value: e.description_stripe,
                    callback: function (t) {
                      e.description_stripe = t;
                    },
                    expression: "description_stripe",
                  },
                }),
              ],
              1
            ),
            e._v(" "),
            a(
              "el-form-item",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: e.data.mollie.enabled,
                    expression: "data.mollie.enabled",
                  },
                ],
                attrs: { label: e.$root.labels.description_mollie + ":" },
              },
              [
                a("el-input", {
                  attrs: {
                    type: "textarea",
                    autosize: { minRows: 4, maxRows: 6 },
                  },
                  model: {
                    value: e.description_mollie,
                    callback: function (t) {
                      e.description_mollie = t;
                    },
                    expression: "description_mollie",
                  },
                }),
              ],
              1
            ),
            e._v(" "),
            a(
              "el-form-item",
              [
                a("inline-placeholders", {
                  attrs: {
                    placeholdersNames: e.getInlinePlaceholdersNames(),
                    excludedPlaceholders: {
                      appointmentPlaceholders: [
                        "%zoom_host_url%",
                        "%zoom_join_url%",
                        "%appointment_cancel_url%",
                        "%reservation_name%",
                        "%reservation_description%",
                      ],
                      eventPlaceholders: [
                        "%event_cancel_url%",
                        "%zoom_join_url_date%",
                        "%zoom_join_url_date_time%",
                        "%zoom_host_url_date%",
                        "%zoom_host_url_date_time%",
                        "%reservation_name%",
                        "%reservation_description%",
                      ],
                    },
                    customFields: e.customFields,
                    categories: e.categories,
                    coupons: e.coupons,
                    userTypeTab: "provider",
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
  1303: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("div", [
          a(
            "div",
            { staticClass: "am-dialog-scrollable" },
            [
              a(
                "div",
                { staticClass: "am-dialog-header" },
                [
                  a(
                    "el-row",
                    [
                      a("el-col", { attrs: { span: 20 } }, [
                        a("h2", [e._v(e._s(e.$root.labels.payments_settings))]),
                      ]),
                      e._v(" "),
                      a(
                        "el-col",
                        { staticClass: "align-right", attrs: { span: 4 } },
                        [
                          a("el-button", {
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
              a(
                "el-form",
                {
                  ref: "settings",
                  attrs: {
                    model: e.settings,
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
                  a(
                    "el-row",
                    { attrs: { gutter: 24 } },
                    [
                      a(
                        "el-col",
                        { attrs: { span: 12 } },
                        [
                          a(
                            "el-form-item",
                            { attrs: { label: e.$root.labels.currency + ":" } },
                            [
                              a(
                                "el-select",
                                {
                                  attrs: { filterable: "" },
                                  on: {
                                    change: function (t) {
                                      return e.clearValidation();
                                    },
                                  },
                                  model: {
                                    value: e.settings.currency,
                                    callback: function (t) {
                                      e.$set(e.settings, "currency", t);
                                    },
                                    expression: "settings.currency",
                                  },
                                },
                                e._l(e.currencies, function (t) {
                                  return a(
                                    "el-option",
                                    {
                                      key: t.code,
                                      attrs: { label: t.name, value: t.code },
                                    },
                                    [
                                      a("span", {
                                        class: "am-flag am-flag-" + t.iso,
                                      }),
                                      e._v(" "),
                                      a(
                                        "span",
                                        {
                                          staticClass:
                                            "am-payment-settings-currency-name",
                                        },
                                        [e._v(e._s(t.name))]
                                      ),
                                      e._v(" "),
                                      a(
                                        "span",
                                        {
                                          staticClass:
                                            "am-payment-settings-currency-symbol",
                                        },
                                        [e._v(e._s(t.symbol))]
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
                      e._v(" "),
                      a(
                        "el-col",
                        { attrs: { span: 12 } },
                        [
                          a(
                            "el-form-item",
                            {
                              attrs: {
                                label:
                                  e.$root.labels.price_symbol_position + ":",
                              },
                            },
                            [
                              a(
                                "el-select",
                                {
                                  on: {
                                    change: function (t) {
                                      return e.clearValidation();
                                    },
                                  },
                                  model: {
                                    value: e.settings.priceSymbolPosition,
                                    callback: function (t) {
                                      e.$set(
                                        e.settings,
                                        "priceSymbolPosition",
                                        t
                                      );
                                    },
                                    expression: "settings.priceSymbolPosition",
                                  },
                                },
                                e._l(
                                  e.options.priceSymbolPositions,
                                  function (t) {
                                    return a(
                                      "el-option",
                                      {
                                        key: t.value,
                                        attrs: {
                                          label: t.label,
                                          value: t.value,
                                        },
                                      },
                                      [
                                        a(
                                          "span",
                                          { staticStyle: { float: "left" } },
                                          [e._v(e._s(t.label))]
                                        ),
                                        e._v(" "),
                                        a(
                                          "span",
                                          {
                                            staticStyle: {
                                              float: "right",
                                              color: "#7F8BA4",
                                              "font-size": "13px",
                                            },
                                          },
                                          [e._v(e._s(t.example))]
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
                        ],
                        1
                      ),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-row",
                    { attrs: { gutter: 24 } },
                    [
                      a(
                        "el-col",
                        { attrs: { span: 12 } },
                        [
                          a(
                            "el-form-item",
                            {
                              attrs: {
                                label: e.$root.labels.price_separator + ":",
                              },
                            },
                            [
                              a(
                                "el-select",
                                {
                                  on: {
                                    change: function (t) {
                                      return e.clearValidation();
                                    },
                                  },
                                  model: {
                                    value: e.settings.priceSeparator,
                                    callback: function (t) {
                                      e.$set(e.settings, "priceSeparator", t);
                                    },
                                    expression: "settings.priceSeparator",
                                  },
                                },
                                e._l(e.options.priceSeparators, function (t) {
                                  return a(
                                    "el-option",
                                    {
                                      key: t.value,
                                      attrs: { label: t.label, value: t.value },
                                    },
                                    [
                                      a(
                                        "span",
                                        { staticStyle: { float: "left" } },
                                        [e._v(e._s(t.label))]
                                      ),
                                      e._v(" "),
                                      a(
                                        "span",
                                        {
                                          staticStyle: {
                                            float: "right",
                                            color: "#7F8BA4",
                                            "font-size": "13px",
                                          },
                                        },
                                        [e._v(e._s(t.example))]
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
                      e._v(" "),
                      a(
                        "el-col",
                        { attrs: { span: 12 } },
                        [
                          a(
                            "el-form-item",
                            {
                              attrs: {
                                label:
                                  e.$root.labels.price_number_of_decimals + ":",
                              },
                            },
                            [
                              a("el-input-number", {
                                attrs: { min: 0, max: 5 },
                                on: {
                                  input: function (t) {
                                    return e.clearValidation();
                                  },
                                },
                                model: {
                                  value: e.settings.priceNumberOfDecimals,
                                  callback: function (t) {
                                    e.$set(
                                      e.settings,
                                      "priceNumberOfDecimals",
                                      t
                                    );
                                  },
                                  expression: "settings.priceNumberOfDecimals",
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
                  a(
                    "div",
                    { staticClass: "am-setting-box am-switch-box" },
                    [
                      a(
                        "el-row",
                        {
                          attrs: { type: "flex", align: "middle", gutter: 24 },
                        },
                        [
                          a("el-col", { attrs: { span: 16 } }, [
                            a("p", [
                              e._v(
                                e._s(
                                  e.$root.labels.hide_currency_symbol_frontend
                                )
                              ),
                            ]),
                          ]),
                          e._v(" "),
                          a(
                            "el-col",
                            { staticClass: "align-right", attrs: { span: 8 } },
                            [
                              a("el-switch", {
                                attrs: {
                                  "active-text": "",
                                  "inactive-text": "",
                                },
                                on: {
                                  change: function (t) {
                                    return e.clearValidation();
                                  },
                                },
                                model: {
                                  value: e.settings.hideCurrencySymbolFrontend,
                                  callback: function (t) {
                                    e.$set(
                                      e.settings,
                                      "hideCurrencySymbolFrontend",
                                      t
                                    );
                                  },
                                  expression:
                                    "settings.hideCurrencySymbolFrontend",
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
                  e.settings.wc.enabled
                    ? e._e()
                    : a(
                        "el-form-item",
                        {
                          attrs: {
                            label: "placeholder",
                            label: e.$root.labels.default_payment_method + ":",
                          },
                        },
                        [
                          a(
                            "el-select",
                            {
                              model: {
                                value: e.settings.defaultPaymentMethod,
                                callback: function (t) {
                                  e.$set(e.settings, "defaultPaymentMethod", t);
                                },
                                expression: "settings.defaultPaymentMethod",
                              },
                            },
                            e._l(e.defaultPaymentMethods, function (e) {
                              return a("el-option", {
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
                  e.hasDisabledBookablePaymentMethod
                    ? a("el-alert", {
                        attrs: {
                          type: "warning",
                          "show-icon": "",
                          title: "",
                          description: e.$root.labels.payment_warning_settings,
                          closable: !1,
                        },
                      })
                    : e._e(),
                  e._v(" "),
                  a(
                    "div",
                    { staticClass: "am-setting-box am-switch-box" },
                    [
                      a(
                        "el-row",
                        {
                          attrs: { type: "flex", align: "middle", gutter: 24 },
                        },
                        [
                          a("el-col", { attrs: { span: 16 } }, [
                            a("p", [e._v(e._s(e.$root.labels.coupons))]),
                          ]),
                          e._v(" "),
                          a(
                            "el-col",
                            { staticClass: "align-right", attrs: { span: 8 } },
                            [
                              a("el-switch", {
                                attrs: {
                                  "active-text": "",
                                  "inactive-text": "",
                                },
                                on: {
                                  change: function (t) {
                                    return e.clearValidation();
                                  },
                                },
                                model: {
                                  value: e.settings.coupons,
                                  callback: function (t) {
                                    e.$set(e.settings, "coupons", t);
                                  },
                                  expression: "settings.coupons",
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
                  a(
                    "div",
                    { staticClass: "am-setting-box am-switch-box" },
                    [
                      a(
                        "el-row",
                        {
                          attrs: { type: "flex", align: "middle", gutter: 24 },
                        },
                        [
                          a("el-col", { attrs: { span: 16 } }, [
                            a("p", [e._v(e._s(e.$root.labels.on_site))]),
                          ]),
                          e._v(" "),
                          a(
                            "el-col",
                            { staticClass: "align-right", attrs: { span: 8 } },
                            [
                              a("el-switch", {
                                attrs: {
                                  disabled:
                                    (!this.settings.payPal.enabled &&
                                      !this.settings.stripe.enabled &&
                                      !this.settings.mollie.enabled &&
                                      !this.settings.wc.enabled) ||
                                    this.settings.wc.enabled,
                                  "active-text": "",
                                  "inactive-text": "",
                                },
                                on: { change: e.toggleOnSite },
                                model: {
                                  value: e.settings.onSite,
                                  callback: function (t) {
                                    e.$set(e.settings, "onSite", t);
                                  },
                                  expression: "settings.onSite",
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
                  a(
                    "el-collapse",
                    {
                      model: {
                        value: e.wooCommerceCollapse,
                        callback: function (t) {
                          e.wooCommerceCollapse = t;
                        },
                        expression: "wooCommerceCollapse",
                      },
                    },
                    [
                      a(
                        "el-collapse-item",
                        {
                          staticClass: "am-setting-box",
                          attrs: { name: "wooCommerce" },
                        },
                        [
                          a(
                            "template",
                            { slot: "title" },
                            [
                              a("el-col", { attrs: { span: 16 } }, [
                                a("img", {
                                  staticClass: "svg",
                                  attrs: {
                                    id: "am-woocommerce",
                                    src:
                                      this.$root.getUrl +
                                      "public/img/payments/woocommerce.svg",
                                  },
                                }),
                              ]),
                              e._v(" "),
                              a("i", {
                                directives: [
                                  {
                                    name: "show",
                                    rawName: "v-show",
                                    value: e.settings.wc.enabled,
                                    expression: "settings.wc.enabled",
                                  },
                                ],
                                staticClass: "el-icon-circle-check",
                              }),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-row",
                            {
                              attrs: {
                                type: "flex",
                                align: "middle",
                                gutter: 24,
                              },
                            },
                            [
                              a("el-col", { attrs: { span: 16 } }, [
                                a("p", [
                                  e._v(e._s(e.$root.labels.wc_service) + ":"),
                                ]),
                              ]),
                              e._v(" "),
                              a(
                                "el-col",
                                {
                                  staticClass: "align-right",
                                  attrs: { span: 8 },
                                },
                                [
                                  a("el-switch", {
                                    attrs: {
                                      "active-text": "",
                                      "inactive-text": "",
                                    },
                                    on: { change: e.toggleWooCommerce },
                                    model: {
                                      value: e.settings.wc.enabled,
                                      callback: function (t) {
                                        e.$set(e.settings.wc, "enabled", t);
                                      },
                                      expression: "settings.wc.enabled",
                                    },
                                  }),
                                ],
                                1
                              ),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-row",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value: !0 === e.settings.wc.enabled,
                                  expression: "settings.wc.enabled === true",
                                },
                              ],
                              attrs: {
                                type: "flex",
                                align: "middle",
                                gutter: 24,
                              },
                            },
                            [
                              a("el-col", { attrs: { span: 16 } }, [
                                a("p", [
                                  e._v(
                                    e._s(e.$root.labels.wc_on_site_if_free) +
                                      ":"
                                  ),
                                ]),
                              ]),
                              e._v(" "),
                              a(
                                "el-col",
                                {
                                  staticClass: "align-right",
                                  attrs: { span: 8 },
                                },
                                [
                                  a("el-switch", {
                                    attrs: {
                                      "active-text": "",
                                      "inactive-text": "",
                                    },
                                    model: {
                                      value: e.settings.wc.onSiteIfFree,
                                      callback: function (t) {
                                        e.$set(
                                          e.settings.wc,
                                          "onSiteIfFree",
                                          t
                                        );
                                      },
                                      expression: "settings.wc.onSiteIfFree",
                                    },
                                  }),
                                ],
                                1
                              ),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-row",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value: !0 === e.settings.wc.enabled,
                                  expression: "settings.wc.enabled === true",
                                },
                              ],
                              staticStyle: { display: "none" },
                              attrs: {
                                type: "flex",
                                align: "middle",
                                gutter: 24,
                              },
                            },
                            [
                              a("el-col", { attrs: { span: 16 } }, [
                                a("p", [e._v("Skip Checkout Get Value:")]),
                              ]),
                              e._v(" "),
                              a(
                                "el-col",
                                {
                                  staticClass: "align-right",
                                  attrs: { span: 8 },
                                },
                                [
                                  a("el-switch", {
                                    attrs: {
                                      "active-text": "",
                                      "inactive-text": "",
                                    },
                                    model: {
                                      value:
                                        e.settings.wc
                                          .skipCheckoutGetValueProcessing,
                                      callback: function (t) {
                                        e.$set(
                                          e.settings.wc,
                                          "skipCheckoutGetValueProcessing",
                                          t
                                        );
                                      },
                                      expression:
                                        "settings.wc.skipCheckoutGetValueProcessing",
                                    },
                                  }),
                                ],
                                1
                              ),
                            ],
                            1
                          ),
                        ],
                        2
                      ),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-collapse",
                    {
                      model: {
                        value: e.mollieCollapse,
                        callback: function (t) {
                          e.mollieCollapse = t;
                        },
                        expression: "mollieCollapse",
                      },
                    },
                    [
                      a(
                        "el-collapse-item",
                        {
                          staticClass: "am-setting-box",
                          attrs: { name: "mollie" },
                        },
                        [
                          a(
                            "template",
                            { slot: "title" },
                            [
                              a("el-col", { attrs: { span: 16 } }, [
                                a("img", {
                                  staticClass: "svg",
                                  attrs: {
                                    id: "am-mollie",
                                    src:
                                      this.$root.getUrl +
                                      "public/img/payments/mollie.svg",
                                  },
                                }),
                              ]),
                              e._v(" "),
                              a("i", {
                                directives: [
                                  {
                                    name: "show",
                                    rawName: "v-show",
                                    value: e.settings.mollie.enabled,
                                    expression: "settings.mollie.enabled",
                                  },
                                ],
                                staticClass: "el-icon-circle-check",
                              }),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-row",
                            {
                              attrs: {
                                type: "flex",
                                align: "middle",
                                gutter: 24,
                              },
                            },
                            [
                              a("el-col", { attrs: { span: 16 } }, [
                                a("p", [
                                  e._v(
                                    e._s(e.$root.labels.mollie_service) + ":"
                                  ),
                                ]),
                              ]),
                              e._v(" "),
                              a(
                                "el-col",
                                {
                                  staticClass: "align-right",
                                  attrs: { span: 8 },
                                },
                                [
                                  a("el-switch", {
                                    attrs: {
                                      "active-text": "",
                                      "inactive-text": "",
                                    },
                                    on: { change: e.toggleMollie },
                                    model: {
                                      value: e.settings.mollie.enabled,
                                      callback: function (t) {
                                        e.$set(e.settings.mollie, "enabled", t);
                                      },
                                      expression: "settings.mollie.enabled",
                                    },
                                  }),
                                ],
                                1
                              ),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-row",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value: !0 === e.settings.mollie.enabled,
                                  expression:
                                    "settings.mollie.enabled === true",
                                },
                              ],
                              attrs: {
                                type: "flex",
                                align: "middle",
                                gutter: 24,
                              },
                            },
                            [
                              a("el-col", { attrs: { span: 16 } }, [
                                a("p", [
                                  e._v(e._s(e.$root.labels.sandbox_mode) + ":"),
                                ]),
                              ]),
                              e._v(" "),
                              a(
                                "el-col",
                                {
                                  staticClass: "align-right",
                                  attrs: { span: 8 },
                                },
                                [
                                  a("el-switch", {
                                    attrs: {
                                      "active-text": "",
                                      "inactive-text": "",
                                    },
                                    on: {
                                      change: e.handleMollieValidationRules,
                                    },
                                    model: {
                                      value: e.settings.mollie.testMode,
                                      callback: function (t) {
                                        e.$set(
                                          e.settings.mollie,
                                          "testMode",
                                          t
                                        );
                                      },
                                      expression: "settings.mollie.testMode",
                                    },
                                  }),
                                ],
                                1
                              ),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-form-item",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value:
                                    !0 === e.settings.mollie.enabled &&
                                    !1 === e.settings.mollie.testMode,
                                  expression:
                                    "settings.mollie.enabled === true && settings.mollie.testMode === false",
                                },
                              ],
                              attrs: {
                                label: e.$root.labels.live_api_key + ":",
                                prop: "mollie.liveApiKey",
                              },
                            },
                            [
                              a("el-input", {
                                attrs: { "auto-complete": "off" },
                                model: {
                                  value: e.settings.mollie.liveApiKey,
                                  callback: function (t) {
                                    e.$set(
                                      e.settings.mollie,
                                      "liveApiKey",
                                      "string" == typeof t ? t.trim() : t
                                    );
                                  },
                                  expression: "settings.mollie.liveApiKey",
                                },
                              }),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-form-item",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value:
                                    !0 === e.settings.mollie.enabled &&
                                    !0 === e.settings.mollie.testMode,
                                  expression:
                                    "settings.mollie.enabled === true && settings.mollie.testMode === true",
                                },
                              ],
                              attrs: {
                                label: e.$root.labels.test_api_key + ":",
                                prop: "mollie.testApiKey",
                              },
                            },
                            [
                              a("el-input", {
                                attrs: { "auto-complete": "off" },
                                model: {
                                  value: e.settings.mollie.testApiKey,
                                  callback: function (t) {
                                    e.$set(
                                      e.settings.mollie,
                                      "testApiKey",
                                      "string" == typeof t ? t.trim() : t
                                    );
                                  },
                                  expression: "settings.mollie.testApiKey",
                                },
                              }),
                            ],
                            1
                          ),
                        ],
                        2
                      ),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-collapse",
                    {
                      model: {
                        value: e.payPalCollapse,
                        callback: function (t) {
                          e.payPalCollapse = t;
                        },
                        expression: "payPalCollapse",
                      },
                    },
                    [
                      a(
                        "el-collapse-item",
                        {
                          staticClass: "am-setting-box",
                          attrs: { name: "payPal" },
                        },
                        [
                          a("template", { slot: "title" }, [
                            a("img", {
                              staticClass: "svg",
                              attrs: {
                                width: "60px",
                                src:
                                  this.$root.getUrl +
                                  "public/img/payments/paypal-light.svg",
                              },
                            }),
                            e._v(" "),
                            a("i", {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value: e.settings.payPal.enabled,
                                  expression: "settings.payPal.enabled",
                                },
                              ],
                              staticClass: "el-icon-circle-check",
                            }),
                          ]),
                          e._v(" "),
                          a(
                            "el-row",
                            {
                              attrs: {
                                type: "flex",
                                align: "middle",
                                gutter: 24,
                              },
                            },
                            [
                              a("el-col", { attrs: { span: 16 } }, [
                                a("p", [
                                  e._v(
                                    e._s(e.$root.labels.payPal_service) + ":"
                                  ),
                                ]),
                              ]),
                              e._v(" "),
                              a(
                                "el-col",
                                {
                                  staticClass: "align-right",
                                  attrs: { span: 8 },
                                },
                                [
                                  a("el-switch", {
                                    attrs: {
                                      "active-text": "",
                                      "inactive-text": "",
                                      disabled:
                                        this.settings.wc.enabled ||
                                        this.settings.mollie.enabled,
                                    },
                                    on: { change: e.togglePayPal },
                                    model: {
                                      value: e.settings.payPal.enabled,
                                      callback: function (t) {
                                        e.$set(e.settings.payPal, "enabled", t);
                                      },
                                      expression: "settings.payPal.enabled",
                                    },
                                  }),
                                ],
                                1
                              ),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-row",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value: !0 === e.settings.payPal.enabled,
                                  expression:
                                    "settings.payPal.enabled === true",
                                },
                              ],
                              attrs: {
                                type: "flex",
                                align: "middle",
                                gutter: 24,
                              },
                            },
                            [
                              a("el-col", { attrs: { span: 16 } }, [
                                a("p", [
                                  e._v(e._s(e.$root.labels.sandbox_mode) + ":"),
                                ]),
                              ]),
                              e._v(" "),
                              a(
                                "el-col",
                                {
                                  staticClass: "align-right",
                                  attrs: { span: 8 },
                                },
                                [
                                  a("el-switch", {
                                    attrs: {
                                      "active-text": "",
                                      "inactive-text": "",
                                    },
                                    on: {
                                      change: e.handlePayPalValidationRules,
                                    },
                                    model: {
                                      value: e.settings.payPal.sandboxMode,
                                      callback: function (t) {
                                        e.$set(
                                          e.settings.payPal,
                                          "sandboxMode",
                                          t
                                        );
                                      },
                                      expression: "settings.payPal.sandboxMode",
                                    },
                                  }),
                                ],
                                1
                              ),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-form-item",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value:
                                    !0 === e.settings.payPal.enabled &&
                                    !1 === e.settings.payPal.sandboxMode,
                                  expression:
                                    "settings.payPal.enabled === true && settings.payPal.sandboxMode === false",
                                },
                              ],
                              attrs: {
                                label: e.$root.labels.live_client_id + ":",
                                prop: "payPal.liveApiClientId",
                              },
                            },
                            [
                              a("el-input", {
                                attrs: { "auto-complete": "off" },
                                model: {
                                  value: e.settings.payPal.liveApiClientId,
                                  callback: function (t) {
                                    e.$set(
                                      e.settings.payPal,
                                      "liveApiClientId",
                                      "string" == typeof t ? t.trim() : t
                                    );
                                  },
                                  expression: "settings.payPal.liveApiClientId",
                                },
                              }),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-form-item",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value:
                                    !0 === e.settings.payPal.enabled &&
                                    !1 === e.settings.payPal.sandboxMode,
                                  expression:
                                    "settings.payPal.enabled === true && settings.payPal.sandboxMode === false",
                                },
                              ],
                              attrs: {
                                label: e.$root.labels.live_secret + ":",
                                prop: "payPal.liveApiSecret",
                              },
                            },
                            [
                              a("el-input", {
                                attrs: { "auto-complete": "off" },
                                model: {
                                  value: e.settings.payPal.liveApiSecret,
                                  callback: function (t) {
                                    e.$set(
                                      e.settings.payPal,
                                      "liveApiSecret",
                                      "string" == typeof t ? t.trim() : t
                                    );
                                  },
                                  expression: "settings.payPal.liveApiSecret",
                                },
                              }),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-form-item",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value:
                                    !0 === e.settings.payPal.enabled &&
                                    !0 === e.settings.payPal.sandboxMode,
                                  expression:
                                    "settings.payPal.enabled === true && settings.payPal.sandboxMode === true",
                                },
                              ],
                              attrs: {
                                label: e.$root.labels.test_client_id + ":",
                                prop: "payPal.testApiClientId",
                              },
                            },
                            [
                              a("el-input", {
                                attrs: { "auto-complete": "off" },
                                model: {
                                  value: e.settings.payPal.testApiClientId,
                                  callback: function (t) {
                                    e.$set(
                                      e.settings.payPal,
                                      "testApiClientId",
                                      "string" == typeof t ? t.trim() : t
                                    );
                                  },
                                  expression: "settings.payPal.testApiClientId",
                                },
                              }),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-form-item",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value:
                                    !0 === e.settings.payPal.enabled &&
                                    !0 === e.settings.payPal.sandboxMode,
                                  expression:
                                    "settings.payPal.enabled === true && settings.payPal.sandboxMode === true",
                                },
                              ],
                              attrs: {
                                label: e.$root.labels.test_secret + ":",
                                prop: "payPal.testApiSecret",
                              },
                            },
                            [
                              a("el-input", {
                                attrs: { "auto-complete": "off" },
                                model: {
                                  value: e.settings.payPal.testApiSecret,
                                  callback: function (t) {
                                    e.$set(
                                      e.settings.payPal,
                                      "testApiSecret",
                                      "string" == typeof t ? t.trim() : t
                                    );
                                  },
                                  expression: "settings.payPal.testApiSecret",
                                },
                              }),
                            ],
                            1
                          ),
                        ],
                        2
                      ),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-collapse",
                    {
                      model: {
                        value: e.stripeCollapse,
                        callback: function (t) {
                          e.stripeCollapse = t;
                        },
                        expression: "stripeCollapse",
                      },
                    },
                    [
                      a(
                        "el-collapse-item",
                        {
                          staticClass: "am-setting-box",
                          attrs: { name: "stripe" },
                        },
                        [
                          e.showStripeAlert
                            ? a("el-alert", {
                                attrs: {
                                  type: "warning",
                                  "show-icon": "",
                                  title: "",
                                  description:
                                    e.$root.labels.stripe_ssl_warning,
                                  closable: !1,
                                },
                              })
                            : e._e(),
                          e._v(" "),
                          a("template", { slot: "title" }, [
                            a("img", {
                              staticClass: "svg",
                              attrs: {
                                width: "40px",
                                src:
                                  this.$root.getUrl +
                                  "public/img/payments/stripe.svg",
                              },
                            }),
                            e._v(" "),
                            a("i", {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value: e.settings.stripe.enabled,
                                  expression: "settings.stripe.enabled",
                                },
                              ],
                              staticClass: "el-icon-circle-check",
                            }),
                          ]),
                          e._v(" "),
                          a(
                            "el-row",
                            {
                              attrs: {
                                type: "flex",
                                align: "middle",
                                gutter: 24,
                              },
                            },
                            [
                              a("el-col", { attrs: { span: 16 } }, [
                                a("p", [
                                  e._v(
                                    e._s(e.$root.labels.stripe_service) + ":"
                                  ),
                                ]),
                              ]),
                              e._v(" "),
                              a(
                                "el-col",
                                {
                                  staticClass: "align-right",
                                  attrs: { span: 8 },
                                },
                                [
                                  a("el-switch", {
                                    attrs: {
                                      "active-text": "",
                                      "inactive-text": "",
                                      disabled:
                                        this.settings.wc.enabled ||
                                        this.settings.mollie.enabled,
                                    },
                                    on: { change: e.toggleStripe },
                                    model: {
                                      value: e.settings.stripe.enabled,
                                      callback: function (t) {
                                        e.$set(e.settings.stripe, "enabled", t);
                                      },
                                      expression: "settings.stripe.enabled",
                                    },
                                  }),
                                ],
                                1
                              ),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-row",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value: !0 === e.settings.stripe.enabled,
                                  expression:
                                    "settings.stripe.enabled === true",
                                },
                              ],
                              attrs: {
                                type: "flex",
                                align: "middle",
                                gutter: 24,
                              },
                            },
                            [
                              a("el-col", { attrs: { span: 16 } }, [
                                a("p", [
                                  e._v(e._s(e.$root.labels.test_mode) + ":"),
                                ]),
                              ]),
                              e._v(" "),
                              a(
                                "el-col",
                                {
                                  staticClass: "align-right",
                                  attrs: { span: 8 },
                                },
                                [
                                  a("el-switch", {
                                    attrs: {
                                      "active-text": "",
                                      "inactive-text": "",
                                    },
                                    on: {
                                      change: e.handleStripeValidationRules,
                                    },
                                    model: {
                                      value: e.settings.stripe.testMode,
                                      callback: function (t) {
                                        e.$set(
                                          e.settings.stripe,
                                          "testMode",
                                          t
                                        );
                                      },
                                      expression: "settings.stripe.testMode",
                                    },
                                  }),
                                ],
                                1
                              ),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-form-item",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value:
                                    !0 === e.settings.stripe.enabled &&
                                    !1 === e.settings.stripe.testMode,
                                  expression:
                                    "settings.stripe.enabled === true && settings.stripe.testMode === false",
                                },
                              ],
                              attrs: {
                                label:
                                  e.$root.labels.live_publishable_key + ":",
                                prop: "stripe.livePublishableKey",
                              },
                            },
                            [
                              a("el-input", {
                                attrs: { "auto-complete": "off" },
                                model: {
                                  value: e.settings.stripe.livePublishableKey,
                                  callback: function (t) {
                                    e.$set(
                                      e.settings.stripe,
                                      "livePublishableKey",
                                      "string" == typeof t ? t.trim() : t
                                    );
                                  },
                                  expression:
                                    "settings.stripe.livePublishableKey",
                                },
                              }),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-form-item",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value:
                                    !0 === e.settings.stripe.enabled &&
                                    !1 === e.settings.stripe.testMode,
                                  expression:
                                    "settings.stripe.enabled === true && settings.stripe.testMode === false",
                                },
                              ],
                              attrs: {
                                label: e.$root.labels.live_secret_key + ":",
                                prop: "stripe.liveSecretKey",
                              },
                            },
                            [
                              a("el-input", {
                                attrs: { "auto-complete": "off" },
                                model: {
                                  value: e.settings.stripe.liveSecretKey,
                                  callback: function (t) {
                                    e.$set(
                                      e.settings.stripe,
                                      "liveSecretKey",
                                      "string" == typeof t ? t.trim() : t
                                    );
                                  },
                                  expression: "settings.stripe.liveSecretKey",
                                },
                              }),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-form-item",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value:
                                    !0 === e.settings.stripe.enabled &&
                                    !0 === e.settings.stripe.testMode,
                                  expression:
                                    "settings.stripe.enabled === true && settings.stripe.testMode === true",
                                },
                              ],
                              attrs: {
                                label:
                                  e.$root.labels.test_publishable_key + ":",
                                prop: "stripe.testPublishableKey",
                              },
                            },
                            [
                              a("el-input", {
                                attrs: { "auto-complete": "off" },
                                model: {
                                  value: e.settings.stripe.testPublishableKey,
                                  callback: function (t) {
                                    e.$set(
                                      e.settings.stripe,
                                      "testPublishableKey",
                                      "string" == typeof t ? t.trim() : t
                                    );
                                  },
                                  expression:
                                    "settings.stripe.testPublishableKey",
                                },
                              }),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-form-item",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value:
                                    !0 === e.settings.stripe.enabled &&
                                    !0 === e.settings.stripe.testMode,
                                  expression:
                                    "settings.stripe.enabled === true && settings.stripe.testMode === true",
                                },
                              ],
                              attrs: {
                                label: e.$root.labels.test_secret_key + ":",
                                prop: "stripe.testSecretKey",
                              },
                            },
                            [
                              a("el-input", {
                                attrs: { "auto-complete": "off" },
                                model: {
                                  value: e.settings.stripe.testSecretKey,
                                  callback: function (t) {
                                    e.$set(
                                      e.settings.stripe,
                                      "testSecretKey",
                                      "string" == typeof t ? t.trim() : t
                                    );
                                  },
                                  expression: "settings.stripe.testSecretKey",
                                },
                              }),
                            ],
                            1
                          ),
                        ],
                        2
                      ),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-collapse",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value:
                            e.settings.wc.enabled ||
                            e.settings.stripe.enabled ||
                            e.settings.payPal.enabled ||
                            e.settings.mollie.enabled,
                          expression:
                            "(settings.wc.enabled || settings.stripe.enabled || settings.payPal.enabled || settings.mollie.enabled)",
                        },
                      ],
                    },
                    [
                      a(
                        "el-collapse-item",
                        { staticClass: "am-setting-box" },
                        [
                          a("template", { slot: "title" }, [
                            a("p", [
                              e._v(
                                e._s(
                                  e.$root.labels.set_metaData_and_description
                                ) + ":"
                              ),
                            ]),
                          ]),
                          e._v(" "),
                          [
                            e.settings.wc.enabled &&
                            e.$root.settings.general.usedLanguages.length
                              ? a("select-translate", {
                                  on: { languageChanged: e.languageChanged },
                                })
                              : e._e(),
                            e._v(" "),
                            a(
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
                                a(
                                  "el-tab-pane",
                                  {
                                    attrs: {
                                      label: e.$root.labels.appointments,
                                      name: "appointments",
                                    },
                                  },
                                  [
                                    a("payments-meta-data", {
                                      ref: "metaDataAppointments",
                                      attrs: {
                                        data: e.payments,
                                        customFields: e.customFields,
                                        coupons: e.coupons,
                                        categories: e.categories,
                                        language: e.language,
                                        tab: "appointments",
                                      },
                                    }),
                                  ],
                                  1
                                ),
                                e._v(" "),
                                e.$root.licence.isPro ||
                                e.$root.licence.isDeveloper
                                  ? a(
                                      "el-tab-pane",
                                      {
                                        attrs: {
                                          label: e.$root.labels.packages,
                                          name: "packages",
                                        },
                                      },
                                      [
                                        a("payments-meta-data", {
                                          ref: "metaDataPackages",
                                          attrs: {
                                            data: e.payments,
                                            language: e.language,
                                            tab: "packages",
                                          },
                                        }),
                                      ],
                                      1
                                    )
                                  : e._e(),
                                e._v(" "),
                                a(
                                  "el-tab-pane",
                                  {
                                    attrs: {
                                      label: e.$root.labels.events,
                                      name: "events",
                                    },
                                  },
                                  [
                                    a("payments-meta-data", {
                                      ref: "metaDataEvents",
                                      attrs: {
                                        data: e.payments,
                                        customFields: e.customFields,
                                        coupons: e.coupons,
                                        language: e.language,
                                        tab: "events",
                                      },
                                    }),
                                  ],
                                  1
                                ),
                              ],
                              1
                            ),
                          ],
                        ],
                        2
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
          a("div", { staticClass: "am-dialog-footer" }, [
            a(
              "div",
              { staticClass: "am-dialog-footer-actions" },
              [
                a(
                  "el-row",
                  [
                    a(
                      "el-col",
                      { staticClass: "align-right", attrs: { sm: 24 } },
                      [
                        a(
                          "el-button",
                          { attrs: { type: "" }, on: { click: e.closeDialog } },
                          [e._v(e._s(e.$root.labels.cancel))]
                        ),
                        e._v(" "),
                        a(
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
  1304: function (e, t, a) {
    var s = a(685)(a(1305), a(1306), !1, null, null, null);
    e.exports = s.exports;
  },
  1305: function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var s = a(687);
    t.default = {
      mixins: [s.a],
      props: { roles: { type: Object } },
      data: function () {
        var e = this;
        return {
          rolesTab: "employee",
          rules: {
            "customerCabinet.pageUrl": [
              {
                required: !0,
                validator: function (t, a, s) {
                  var o = e.settings.customerCabinet.pageUrl;
                  !e.settings.customerCabinet.enabled ||
                  (/^((http|https):\/\/)/.test(o) && "" !== o)
                    ? s()
                    : ((e.rolesTab = "customer"),
                      s(new Error(e.$root.labels.enter_valid_url_warning)));
                },
                trigger: "submit",
              },
            ],
            "providerCabinet.pageUrl": [
              {
                required: !0,
                validator: function (t, a, s) {
                  var o = e.settings.providerCabinet.pageUrl;
                  !e.settings.providerCabinet.enabled ||
                  (/^((http|https):\/\/)/.test(o) && "" !== o)
                    ? s()
                    : ((e.rolesTab = "employee"),
                      s(new Error(e.$root.labels.enter_valid_url_warning)));
                },
                trigger: "submit",
              },
            ],
          },
          settings: Object.assign({}, this.roles),
        };
      },
      updated: function () {
        this.inlineSVG();
      },
      mounted: function () {
        this.inlineSVG();
      },
      methods: {
        closeDialog: function () {
          this.$emit("closeDialogSettingsRoles");
        },
        clearValidation: function () {
          this.$refs.settings.clearValidate();
        },
        onSubmit: function () {
          var e = this;
          this.$refs.settings.validate(function (t) {
            if (!t) return !1;
            e.$emit("closeDialogSettingsRoles"),
              e.$emit("updateSettings", { roles: e.settings });
          });
        },
        showDialogTranslate: function () {
          this.$emit("showDialogTranslate", this.$root.labels.customer_cabinet);
        },
      },
    };
  },
  1306: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("div", [
          a(
            "div",
            { staticClass: "am-dialog-scrollable" },
            [
              a(
                "div",
                { staticClass: "am-dialog-header" },
                [
                  a(
                    "el-row",
                    [
                      a("el-col", { attrs: { span: 20 } }, [
                        a("h2", [e._v(e._s(e.$root.labels.roles_settings))]),
                      ]),
                      e._v(" "),
                      a(
                        "el-col",
                        { staticClass: "align-right", attrs: { span: 4 } },
                        [
                          a("el-button", {
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
              a(
                "el-form",
                {
                  ref: "settings",
                  attrs: {
                    model: e.settings,
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
                  a(
                    "el-tabs",
                    {
                      model: {
                        value: e.rolesTab,
                        callback: function (t) {
                          e.rolesTab = t;
                        },
                        expression: "rolesTab",
                      },
                    },
                    [
                      a(
                        "el-tab-pane",
                        {
                          attrs: {
                            label: e.$root.labels.employee,
                            name: "employee",
                          },
                        },
                        [
                          a(
                            "div",
                            { staticClass: "am-setting-box am-switch-box" },
                            [
                              a(
                                "el-row",
                                {
                                  attrs: {
                                    type: "flex",
                                    align: "middle",
                                    gutter: 24,
                                  },
                                },
                                [
                                  a("el-col", { attrs: { span: 20 } }, [
                                    e._v(
                                      "\n                " +
                                        e._s(
                                          e.$root.labels
                                            .allow_configure_services
                                        ) +
                                        "\n              "
                                    ),
                                  ]),
                                  e._v(" "),
                                  a(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 4 },
                                    },
                                    [
                                      a("el-switch", {
                                        attrs: {
                                          "active-text": "",
                                          "inactive-text": "",
                                        },
                                        model: {
                                          value:
                                            e.settings.allowConfigureServices,
                                          callback: function (t) {
                                            e.$set(
                                              e.settings,
                                              "allowConfigureServices",
                                              t
                                            );
                                          },
                                          expression:
                                            "settings.allowConfigureServices",
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
                          a(
                            "div",
                            { staticClass: "am-setting-box am-switch-box" },
                            [
                              a(
                                "el-row",
                                {
                                  attrs: {
                                    type: "flex",
                                    align: "middle",
                                    gutter: 24,
                                  },
                                },
                                [
                                  a("el-col", { attrs: { span: 20 } }, [
                                    e._v(
                                      "\n                " +
                                        e._s(
                                          e.$root.labels
                                            .allow_configure_schedule
                                        ) +
                                        "\n              "
                                    ),
                                  ]),
                                  e._v(" "),
                                  a(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 4 },
                                    },
                                    [
                                      a("el-switch", {
                                        attrs: {
                                          "active-text": "",
                                          "inactive-text": "",
                                        },
                                        model: {
                                          value:
                                            e.settings.allowConfigureSchedule,
                                          callback: function (t) {
                                            e.$set(
                                              e.settings,
                                              "allowConfigureSchedule",
                                              t
                                            );
                                          },
                                          expression:
                                            "settings.allowConfigureSchedule",
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
                          a(
                            "div",
                            { staticClass: "am-setting-box am-switch-box" },
                            [
                              a(
                                "el-row",
                                {
                                  attrs: {
                                    type: "flex",
                                    align: "middle",
                                    gutter: 24,
                                  },
                                },
                                [
                                  a("el-col", { attrs: { span: 20 } }, [
                                    e._v(
                                      "\n                " +
                                        e._s(
                                          e.$root.labels
                                            .allow_configure_days_off
                                        ) +
                                        "\n              "
                                    ),
                                  ]),
                                  e._v(" "),
                                  a(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 4 },
                                    },
                                    [
                                      a("el-switch", {
                                        attrs: {
                                          "active-text": "",
                                          "inactive-text": "",
                                        },
                                        model: {
                                          value:
                                            e.settings.allowConfigureDaysOff,
                                          callback: function (t) {
                                            e.$set(
                                              e.settings,
                                              "allowConfigureDaysOff",
                                              t
                                            );
                                          },
                                          expression:
                                            "settings.allowConfigureDaysOff",
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
                          a(
                            "div",
                            { staticClass: "am-setting-box am-switch-box" },
                            [
                              a(
                                "el-row",
                                {
                                  attrs: {
                                    type: "flex",
                                    align: "middle",
                                    gutter: 24,
                                  },
                                },
                                [
                                  a("el-col", { attrs: { span: 20 } }, [
                                    e._v(
                                      "\n                " +
                                        e._s(
                                          e.$root.labels
                                            .allow_configure_special_days
                                        ) +
                                        "\n              "
                                    ),
                                  ]),
                                  e._v(" "),
                                  a(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 4 },
                                    },
                                    [
                                      a("el-switch", {
                                        attrs: {
                                          "active-text": "",
                                          "inactive-text": "",
                                        },
                                        model: {
                                          value:
                                            e.settings
                                              .allowConfigureSpecialDays,
                                          callback: function (t) {
                                            e.$set(
                                              e.settings,
                                              "allowConfigureSpecialDays",
                                              t
                                            );
                                          },
                                          expression:
                                            "settings.allowConfigureSpecialDays",
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
                          a(
                            "div",
                            { staticClass: "am-setting-box am-switch-box" },
                            [
                              a(
                                "el-row",
                                {
                                  attrs: {
                                    type: "flex",
                                    align: "middle",
                                    gutter: 24,
                                  },
                                },
                                [
                                  a("el-col", { attrs: { span: 20 } }, [
                                    e._v(
                                      "\n                " +
                                        e._s(
                                          e.$root.labels
                                            .allow_write_appointments
                                        ) +
                                        "\n              "
                                    ),
                                  ]),
                                  e._v(" "),
                                  a(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 4 },
                                    },
                                    [
                                      a("el-switch", {
                                        attrs: {
                                          "active-text": "",
                                          "inactive-text": "",
                                        },
                                        model: {
                                          value:
                                            e.settings.allowWriteAppointments,
                                          callback: function (t) {
                                            e.$set(
                                              e.settings,
                                              "allowWriteAppointments",
                                              t
                                            );
                                          },
                                          expression:
                                            "settings.allowWriteAppointments",
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
                          a(
                            "div",
                            { staticClass: "am-setting-box am-switch-box" },
                            [
                              a(
                                "el-row",
                                {
                                  attrs: {
                                    type: "flex",
                                    align: "middle",
                                    gutter: 24,
                                  },
                                },
                                [
                                  a("el-col", { attrs: { span: 20 } }, [
                                    e._v(
                                      "\n                " +
                                        e._s(
                                          e.$root.labels.allow_write_events
                                        ) +
                                        "\n              "
                                    ),
                                  ]),
                                  e._v(" "),
                                  a(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 4 },
                                    },
                                    [
                                      a("el-switch", {
                                        attrs: {
                                          "active-text": "",
                                          "inactive-text": "",
                                        },
                                        model: {
                                          value: e.settings.allowWriteEvents,
                                          callback: function (t) {
                                            e.$set(
                                              e.settings,
                                              "allowWriteEvents",
                                              t
                                            );
                                          },
                                          expression:
                                            "settings.allowWriteEvents",
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
                          a(
                            "div",
                            { staticClass: "am-setting-box am-switch-box" },
                            [
                              a(
                                "el-row",
                                {
                                  attrs: {
                                    type: "flex",
                                    align: "middle",
                                    gutter: 24,
                                  },
                                },
                                [
                                  a("el-col", { attrs: { span: 20 } }, [
                                    e._v(
                                      "\n                " +
                                        e._s(
                                          e.$root.labels.enable_employee_cabinet
                                        ) +
                                        "\n              "
                                    ),
                                  ]),
                                  e._v(" "),
                                  a(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 4 },
                                    },
                                    [
                                      a("el-switch", {
                                        attrs: {
                                          "active-text": "",
                                          "inactive-text": "",
                                        },
                                        model: {
                                          value:
                                            e.settings.providerCabinet.enabled,
                                          callback: function (t) {
                                            e.$set(
                                              e.settings.providerCabinet,
                                              "enabled",
                                              t
                                            );
                                          },
                                          expression:
                                            "settings.providerCabinet.enabled",
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
                          a(
                            "el-form-item",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value: e.settings.providerCabinet.enabled,
                                  expression:
                                    "settings.providerCabinet.enabled",
                                },
                              ],
                              attrs: { prop: "providerCabinet.pageUrl" },
                            },
                            [
                              a(
                                "label",
                                { attrs: { slot: "label" }, slot: "label" },
                                [
                                  e._v(
                                    "\n              " +
                                      e._s(e.$root.labels.employee_cabinet) +
                                      ":\n              "
                                  ),
                                  a(
                                    "el-tooltip",
                                    { attrs: { placement: "top" } },
                                    [
                                      a("div", {
                                        attrs: { slot: "content" },
                                        domProps: {
                                          innerHTML: e._s(
                                            e.$root.labels
                                              .employee_cabinet_tooltip
                                          ),
                                        },
                                        slot: "content",
                                      }),
                                      e._v(" "),
                                      a("i", {
                                        staticClass:
                                          "el-icon-question am-tooltip-icon",
                                      }),
                                    ]
                                  ),
                                ],
                                1
                              ),
                              e._v(" "),
                              a("el-input", {
                                attrs: { "auto-complete": "off" },
                                on: { input: e.clearValidation },
                                model: {
                                  value: e.settings.providerCabinet.pageUrl,
                                  callback: function (t) {
                                    e.$set(
                                      e.settings.providerCabinet,
                                      "pageUrl",
                                      t
                                    );
                                  },
                                  expression:
                                    "settings.providerCabinet.pageUrl",
                                },
                              }),
                            ],
                            1
                          ),
                        ],
                        1
                      ),
                      e._v(" "),
                      a(
                        "el-tab-pane",
                        {
                          attrs: {
                            label: e.$root.labels.customer,
                            name: "customer",
                          },
                        },
                        [
                          a(
                            "div",
                            { staticClass: "am-setting-box am-switch-box" },
                            [
                              a(
                                "el-row",
                                {
                                  attrs: {
                                    type: "flex",
                                    align: "middle",
                                    gutter: 24,
                                  },
                                },
                                [
                                  a(
                                    "el-col",
                                    { attrs: { span: 20 } },
                                    [
                                      e._v(
                                        "\n                " +
                                          e._s(
                                            e.$root.labels.inspect_customer_info
                                          ) +
                                          "\n                "
                                      ),
                                      a(
                                        "el-tooltip",
                                        { attrs: { placement: "top" } },
                                        [
                                          a("div", {
                                            attrs: { slot: "content" },
                                            domProps: {
                                              innerHTML: e._s(
                                                e.$root.labels
                                                  .inspect_customer_info_tooltip
                                              ),
                                            },
                                            slot: "content",
                                          }),
                                          e._v(" "),
                                          a("i", {
                                            staticClass:
                                              "el-icon-question am-tooltip-icon",
                                          }),
                                        ]
                                      ),
                                    ],
                                    1
                                  ),
                                  e._v(" "),
                                  a(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 4 },
                                    },
                                    [
                                      a("el-switch", {
                                        attrs: {
                                          "active-text": "",
                                          "inactive-text": "",
                                        },
                                        model: {
                                          value: e.settings.inspectCustomerInfo,
                                          callback: function (t) {
                                            e.$set(
                                              e.settings,
                                              "inspectCustomerInfo",
                                              t
                                            );
                                          },
                                          expression:
                                            "settings.inspectCustomerInfo",
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
                          a(
                            "div",
                            { staticClass: "am-setting-box am-switch-box" },
                            [
                              a(
                                "el-row",
                                {
                                  attrs: {
                                    type: "flex",
                                    align: "middle",
                                    gutter: 24,
                                  },
                                },
                                [
                                  a(
                                    "el-col",
                                    { attrs: { span: 20 } },
                                    [
                                      e._v(
                                        "\n                " +
                                          e._s(
                                            e.$root.labels
                                              .automatically_create_customer
                                          ) +
                                          "\n                "
                                      ),
                                      a(
                                        "el-tooltip",
                                        { attrs: { placement: "top" } },
                                        [
                                          a("div", {
                                            attrs: { slot: "content" },
                                            domProps: {
                                              innerHTML: e._s(
                                                e.$root.labels
                                                  .automatically_create_customer_tooltip
                                              ),
                                            },
                                            slot: "content",
                                          }),
                                          e._v(" "),
                                          a("i", {
                                            staticClass:
                                              "el-icon-question am-tooltip-icon",
                                          }),
                                        ]
                                      ),
                                    ],
                                    1
                                  ),
                                  e._v(" "),
                                  a(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 4 },
                                    },
                                    [
                                      a("el-switch", {
                                        attrs: {
                                          "active-text": "",
                                          "inactive-text": "",
                                        },
                                        model: {
                                          value:
                                            e.settings
                                              .automaticallyCreateCustomer,
                                          callback: function (t) {
                                            e.$set(
                                              e.settings,
                                              "automaticallyCreateCustomer",
                                              t
                                            );
                                          },
                                          expression:
                                            "settings.automaticallyCreateCustomer",
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
                          a(
                            "div",
                            { staticClass: "am-setting-box am-switch-box" },
                            [
                              a(
                                "el-row",
                                {
                                  attrs: {
                                    type: "flex",
                                    align: "middle",
                                    gutter: 24,
                                  },
                                },
                                [
                                  a(
                                    "el-col",
                                    { attrs: { span: 20 } },
                                    [
                                      e._v(
                                        "\n                " +
                                          e._s(
                                            e.$root.labels
                                              .allow_customer_reschedule
                                          ) +
                                          "\n                "
                                      ),
                                      a(
                                        "el-tooltip",
                                        { attrs: { placement: "top" } },
                                        [
                                          a("div", {
                                            attrs: { slot: "content" },
                                            domProps: {
                                              innerHTML: e._s(
                                                e.$root.labels
                                                  .allow_customer_reschedule_tooltip
                                              ),
                                            },
                                            slot: "content",
                                          }),
                                          e._v(" "),
                                          a("i", {
                                            staticClass:
                                              "el-icon-question am-tooltip-icon",
                                          }),
                                        ]
                                      ),
                                    ],
                                    1
                                  ),
                                  e._v(" "),
                                  a(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 4 },
                                    },
                                    [
                                      a("el-switch", {
                                        attrs: {
                                          "active-text": "",
                                          "inactive-text": "",
                                        },
                                        model: {
                                          value:
                                            e.settings.allowCustomerReschedule,
                                          callback: function (t) {
                                            e.$set(
                                              e.settings,
                                              "allowCustomerReschedule",
                                              t
                                            );
                                          },
                                          expression:
                                            "settings.allowCustomerReschedule",
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
                          a(
                            "div",
                            { staticClass: "am-setting-box am-switch-box" },
                            [
                              a(
                                "el-row",
                                {
                                  attrs: {
                                    type: "flex",
                                    align: "middle",
                                    gutter: 24,
                                  },
                                },
                                [
                                  a("el-col", { attrs: { span: 20 } }, [
                                    e._v(
                                      "\n                " +
                                        e._s(
                                          e.$root.labels.enable_customer_cabinet
                                        ) +
                                        "\n              "
                                    ),
                                  ]),
                                  e._v(" "),
                                  a(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 4 },
                                    },
                                    [
                                      a("el-switch", {
                                        attrs: {
                                          "active-text": "",
                                          "inactive-text": "",
                                        },
                                        model: {
                                          value:
                                            e.settings.customerCabinet.enabled,
                                          callback: function (t) {
                                            e.$set(
                                              e.settings.customerCabinet,
                                              "enabled",
                                              t
                                            );
                                          },
                                          expression:
                                            "settings.customerCabinet.enabled",
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
                          a(
                            "div",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value: e.settings.customerCabinet.enabled,
                                  expression:
                                    "settings.customerCabinet.enabled",
                                },
                              ],
                              staticClass: "am-setting-box am-switch-box",
                            },
                            [
                              a(
                                "el-row",
                                {
                                  attrs: {
                                    type: "flex",
                                    align: "middle",
                                    gutter: 24,
                                  },
                                },
                                [
                                  a(
                                    "el-col",
                                    { attrs: { span: 20 } },
                                    [
                                      e._v(
                                        "\n                " +
                                          e._s(
                                            e.$root.labels
                                              .require_cabinet_password
                                          ) +
                                          "\n                "
                                      ),
                                      a(
                                        "el-tooltip",
                                        { attrs: { placement: "top" } },
                                        [
                                          a("div", {
                                            attrs: { slot: "content" },
                                            domProps: {
                                              innerHTML: e._s(
                                                e.$root.labels
                                                  .require_cabinet_password_tooltip
                                              ),
                                            },
                                            slot: "content",
                                          }),
                                          e._v(" "),
                                          a("i", {
                                            staticClass:
                                              "el-icon-question am-tooltip-icon",
                                          }),
                                        ]
                                      ),
                                    ],
                                    1
                                  ),
                                  e._v(" "),
                                  a(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 4 },
                                    },
                                    [
                                      a("el-switch", {
                                        attrs: {
                                          "active-text": "",
                                          "inactive-text": "",
                                        },
                                        model: {
                                          value:
                                            e.settings.customerCabinet
                                              .loginEnabled,
                                          callback: function (t) {
                                            e.$set(
                                              e.settings.customerCabinet,
                                              "loginEnabled",
                                              t
                                            );
                                          },
                                          expression:
                                            "settings.customerCabinet.loginEnabled",
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
                          a(
                            "div",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value: e.settings.customerCabinet.enabled,
                                  expression:
                                    "settings.customerCabinet.enabled",
                                },
                              ],
                              staticClass: "am-setting-box am-switch-box",
                            },
                            [
                              a(
                                "el-row",
                                {
                                  attrs: {
                                    type: "flex",
                                    align: "middle",
                                    gutter: 24,
                                  },
                                },
                                [
                                  a(
                                    "el-col",
                                    { attrs: { span: 20 } },
                                    [
                                      e._v(
                                        "\n                " +
                                          e._s(
                                            e.$root.labels
                                              .allow_customer_delete_profile
                                          ) +
                                          "\n                "
                                      ),
                                      a(
                                        "el-tooltip",
                                        { attrs: { placement: "top" } },
                                        [
                                          a("div", {
                                            attrs: { slot: "content" },
                                            domProps: {
                                              innerHTML: e._s(
                                                e.$root.labels
                                                  .allow_customer_delete_profile_tooltip
                                              ),
                                            },
                                            slot: "content",
                                          }),
                                          e._v(" "),
                                          a("i", {
                                            staticClass:
                                              "el-icon-question am-tooltip-icon",
                                          }),
                                        ]
                                      ),
                                    ],
                                    1
                                  ),
                                  e._v(" "),
                                  a(
                                    "el-col",
                                    {
                                      staticClass: "align-right",
                                      attrs: { span: 4 },
                                    },
                                    [
                                      a("el-switch", {
                                        attrs: {
                                          "active-text": "",
                                          "inactive-text": "",
                                        },
                                        model: {
                                          value:
                                            e.settings
                                              .allowCustomerDeleteProfile,
                                          callback: function (t) {
                                            e.$set(
                                              e.settings,
                                              "allowCustomerDeleteProfile",
                                              t
                                            );
                                          },
                                          expression:
                                            "settings.allowCustomerDeleteProfile",
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
                          a(
                            "el-form-item",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value: e.settings.customerCabinet.enabled,
                                  expression:
                                    "settings.customerCabinet.enabled",
                                },
                              ],
                              attrs: { prop: "customerCabinet.pageUrl" },
                            },
                            [
                              a(
                                "label",
                                { attrs: { slot: "label" }, slot: "label" },
                                [
                                  e._v(
                                    "\n              " +
                                      e._s(e.$root.labels.customer_cabinet) +
                                      ":\n              "
                                  ),
                                  a(
                                    "el-tooltip",
                                    { attrs: { placement: "top" } },
                                    [
                                      a("div", {
                                        attrs: { slot: "content" },
                                        domProps: {
                                          innerHTML: e._s(
                                            e.$root.labels
                                              .customer_cabinet_tooltip
                                          ),
                                        },
                                        slot: "content",
                                      }),
                                      e._v(" "),
                                      a("i", {
                                        staticClass:
                                          "el-icon-question am-tooltip-icon",
                                      }),
                                    ]
                                  ),
                                  e._v(" "),
                                  a(
                                    "div",
                                    {
                                      staticClass: "am-service-translate",
                                      on: {
                                        click: function (t) {
                                          return e.showDialogTranslate();
                                        },
                                      },
                                    },
                                    [
                                      a("img", {
                                        staticClass: "am-dialog-translate-svg",
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
                                            e.$root.labels.manage_languages
                                          ) +
                                          "\n              "
                                      ),
                                    ]
                                  ),
                                ],
                                1
                              ),
                              e._v(" "),
                              a("el-input", {
                                attrs: { "auto-complete": "off" },
                                on: { input: e.clearValidation },
                                model: {
                                  value: e.settings.customerCabinet.pageUrl,
                                  callback: function (t) {
                                    e.$set(
                                      e.settings.customerCabinet,
                                      "pageUrl",
                                      t
                                    );
                                  },
                                  expression:
                                    "settings.customerCabinet.pageUrl",
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
          a("div", { staticClass: "am-dialog-footer" }, [
            a(
              "div",
              { staticClass: "am-dialog-footer-actions" },
              [
                a(
                  "el-row",
                  [
                    a(
                      "el-col",
                      { staticClass: "align-right", attrs: { sm: 24 } },
                      [
                        a(
                          "el-button",
                          { attrs: { type: "" }, on: { click: e.closeDialog } },
                          [e._v(e._s(e.$root.labels.cancel))]
                        ),
                        e._v(" "),
                        a(
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
  1307: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("div", { staticClass: "am-wrap" }, [
          a(
            "div",
            { staticClass: "am-body", attrs: { id: "am-settings" } },
            [
              a("page-header"),
              e._v(" "),
              a(
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
                  a("img", {
                    attrs: { src: e.$root.getUrl + "public/img/spinner.svg" },
                  }),
                ]
              ),
              e._v(" "),
              a(
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
                  staticClass: "am-section am-settings-cards",
                },
                [
                  a(
                    "el-row",
                    { attrs: { gutter: 48 } },
                    [
                      a("el-col", { attrs: { md: 8 } }, [
                        a("div", { staticClass: "am-settings-card" }, [
                          a("h3", [
                            a("img", {
                              staticClass: "svg",
                              attrs: {
                                src: e.$root.getUrl + "public/img/setting.svg",
                              },
                            }),
                            e._v(" " + e._s(e.$root.labels.general)),
                          ]),
                          e._v(" "),
                          a("p", [
                            e._v(
                              e._s(e.$root.labels.general_settings_description)
                            ),
                          ]),
                          e._v(" "),
                          a(
                            "p",
                            {
                              staticClass: "link",
                              on: { click: e.showDialogSettingsGeneral },
                            },
                            [
                              e._v(
                                "\n              " +
                                  e._s(e.$root.labels.view_general_settings) +
                                  "\n            "
                              ),
                            ]
                          ),
                        ]),
                      ]),
                      e._v(" "),
                      a("el-col", { attrs: { md: 8 } }, [
                        a("div", { staticClass: "am-settings-card" }, [
                          a("h3", [
                            a("img", {
                              staticClass: "svg",
                              attrs: {
                                src: e.$root.getUrl + "public/img/company.svg",
                              },
                            }),
                            e._v(" " + e._s(e.$root.labels.company)),
                          ]),
                          e._v(" "),
                          a("p", [
                            e._v(
                              e._s(e.$root.labels.company_settings_description)
                            ),
                          ]),
                          e._v(" "),
                          a(
                            "p",
                            {
                              staticClass: "link",
                              on: { click: e.showDialogSettingsCompany },
                            },
                            [
                              e._v(
                                "\n              " +
                                  e._s(e.$root.labels.view_company_settings) +
                                  "\n            "
                              ),
                            ]
                          ),
                        ]),
                      ]),
                      e._v(" "),
                      a("el-col", { attrs: { md: 8 } }, [
                        a("div", { staticClass: "am-settings-card" }, [
                          a("h3", [
                            a("img", {
                              staticClass: "svg",
                              attrs: {
                                src:
                                  e.$root.getUrl +
                                  "public/img/email-settings.svg",
                              },
                            }),
                            e._v(
                              "\n              " +
                                e._s(e.$root.labels.notifications) +
                                "\n            "
                            ),
                          ]),
                          e._v(" "),
                          a("p", [
                            e._v(
                              e._s(
                                e.$root.labels
                                  .notifications_settings_description
                              )
                            ),
                          ]),
                          e._v(" "),
                          a(
                            "p",
                            {
                              staticClass: "link",
                              on: { click: e.showDialogSettingsNotifications },
                            },
                            [
                              e._v(
                                "\n              " +
                                  e._s(
                                    e.$root.labels.view_notifications_settings
                                  ) +
                                  "\n            "
                              ),
                            ]
                          ),
                        ]),
                      ]),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-row",
                    { attrs: { gutter: 48 } },
                    [
                      a("el-col", { attrs: { md: 8 } }, [
                        a("div", { staticClass: "am-settings-card" }, [
                          a("h3", [
                            a("img", {
                              staticClass: "svg",
                              attrs: {
                                src: e.$root.getUrl + "public/img/calendar.svg",
                              },
                            }),
                            e._v(
                              "\n              " +
                                e._s(e.$root.labels.work_hours_days_off) +
                                "\n            "
                            ),
                          ]),
                          e._v(" "),
                          a("p", [
                            e._v(
                              e._s(e.$root.labels.days_off_settings_description)
                            ),
                          ]),
                          e._v(" "),
                          a(
                            "p",
                            {
                              staticClass: "link",
                              on: {
                                click: e.showDialogSettingsWorkHoursDaysOff,
                              },
                            },
                            [
                              e._v(
                                "\n              " +
                                  e._s(e.$root.labels.view_days_off_settings) +
                                  "\n            "
                              ),
                            ]
                          ),
                        ]),
                      ]),
                      e._v(" "),
                      a("el-col", { attrs: { md: 8 } }, [
                        a("div", { staticClass: "am-settings-card" }, [
                          a("h3", [
                            a("img", {
                              staticClass: "svg",
                              attrs: {
                                src:
                                  e.$root.getUrl + "public/img/credit-card.svg",
                              },
                            }),
                            e._v(
                              "\n              " +
                                e._s(e.$root.labels.payments) +
                                "\n            "
                            ),
                          ]),
                          e._v(" "),
                          a("p", [
                            e._v(
                              e._s(e.$root.labels.payments_settings_description)
                            ),
                          ]),
                          e._v(" "),
                          a(
                            "p",
                            {
                              staticClass: "link",
                              on: { click: e.showDialogSettingsPayments },
                            },
                            [
                              e._v(
                                "\n              " +
                                  e._s(e.$root.labels.view_payments_settings) +
                                  "\n            "
                              ),
                            ]
                          ),
                        ]),
                      ]),
                      e._v(" "),
                      a("el-col", { attrs: { md: 8 } }, [
                        a("div", { staticClass: "am-settings-card" }, [
                          a("h3", [
                            a("img", {
                              staticClass: "svg",
                              attrs: {
                                src: e.$root.getUrl + "public/img/web-hook.svg",
                              },
                            }),
                            e._v(
                              "\n              " +
                                e._s(e.$root.labels.integrations_settings) +
                                "\n            "
                            ),
                          ]),
                          e._v(" "),
                          a("p", [
                            e._v(
                              e._s(
                                e.$root.labels.integrations_settings_description
                              )
                            ),
                          ]),
                          e._v(" "),
                          a(
                            "p",
                            {
                              staticClass: "link",
                              on: { click: e.showDialogSettingsIntegrations },
                            },
                            [
                              e._v(
                                "\n              " +
                                  e._s(
                                    e.$root.labels.view_integrations_settings
                                  ) +
                                  "\n            "
                              ),
                            ]
                          ),
                        ]),
                      ]),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-row",
                    { attrs: { gutter: 48 } },
                    [
                      a("el-col", { attrs: { md: 8 } }, [
                        a("div", { staticClass: "am-settings-card" }, [
                          a("h3", [
                            a("img", {
                              staticClass: "svg",
                              attrs: {
                                src:
                                  e.$root.getUrl +
                                  "public/img/appointment-settings.svg",
                              },
                            }),
                            e._v(
                              "\n              " +
                                e._s(e.$root.labels.appointments) +
                                "\n            "
                            ),
                          ]),
                          e._v(" "),
                          a("p", [
                            e._v(
                              e._s(
                                e.$root.labels.appointments_settings_description
                              )
                            ),
                          ]),
                          e._v(" "),
                          a(
                            "p",
                            {
                              staticClass: "link",
                              on: { click: e.showDialogSettingsAppointments },
                            },
                            [
                              e._v(
                                "\n              " +
                                  e._s(
                                    e.$root.labels.view_appointments_settings
                                  ) +
                                  "\n            "
                              ),
                            ]
                          ),
                        ]),
                      ]),
                      e._v(" "),
                      a("el-col", { attrs: { md: 8 } }, [
                        a("div", { staticClass: "am-settings-card" }, [
                          a("h3", [
                            a("img", {
                              staticClass: "svg",
                              attrs: {
                                src: e.$root.getUrl + "public/img/labels.svg",
                              },
                            }),
                            e._v(
                              "\n              " +
                                e._s(e.$root.labels.labels) +
                                "\n            "
                            ),
                          ]),
                          e._v(" "),
                          a("p", [
                            e._v(
                              e._s(e.$root.labels.labels_settings_description)
                            ),
                          ]),
                          e._v(" "),
                          a(
                            "p",
                            {
                              staticClass: "link",
                              on: { click: e.showDialogSettingsLabels },
                            },
                            [
                              e._v(
                                "\n              " +
                                  e._s(e.$root.labels.view_labels_settings) +
                                  "\n            "
                              ),
                            ]
                          ),
                        ]),
                      ]),
                      e._v(" "),
                      a("el-col", { attrs: { md: 8 } }, [
                        a("div", { staticClass: "am-settings-card" }, [
                          a("h3", [
                            a("img", {
                              staticClass: "svg",
                              attrs: {
                                src: e.$root.getUrl + "public/img/roles.svg",
                              },
                            }),
                            e._v(
                              "\n              " +
                                e._s(e.$root.labels.roles_settings) +
                                "\n            "
                            ),
                          ]),
                          e._v(" "),
                          a("p", [
                            e._v(
                              e._s(e.$root.labels.roles_settings_description)
                            ),
                          ]),
                          e._v(" "),
                          a(
                            "p",
                            {
                              staticClass: "link",
                              on: { click: e.showDialogSettingsRoles },
                            },
                            [
                              e._v(
                                "\n              " +
                                  e._s(
                                    e.$root.labels
                                      .view_roles_settings_description
                                  ) +
                                  "\n            "
                              ),
                            ]
                          ),
                        ]),
                      ]),
                    ],
                    1
                  ),
                  e._v(" "),
                  a(
                    "el-row",
                    { attrs: { gutter: 48 } },
                    [
                      !0 === e.$root.settings.activation.showActivationSettings
                        ? a("el-col", { attrs: { md: 8 } }, [
                            a("div", { staticClass: "am-settings-card" }, [
                              a("h3", [
                                a("img", {
                                  staticClass: "svg",
                                  attrs: {
                                    src:
                                      e.$root.getUrl +
                                      "public/img/purchase-code.svg",
                                  },
                                }),
                                e._v(
                                  "\n              " +
                                    e._s(e.$root.labels.activation) +
                                    "\n            "
                                ),
                              ]),
                              e._v(" "),
                              a("p", [
                                e._v(
                                  e._s(
                                    e.$root.labels
                                      .activation_settings_description
                                  )
                                ),
                              ]),
                              e._v(" "),
                              a(
                                "p",
                                {
                                  staticClass: "link",
                                  on: { click: e.showDialogSettingsActivation },
                                },
                                [
                                  e._v(
                                    "\n              " +
                                      e._s(
                                        e.$root.labels.view_activation_settings
                                      ) +
                                      "\n            "
                                  ),
                                ]
                              ),
                            ]),
                          ])
                        : e._e(),
                    ],
                    1
                  ),
                ],
                1
              ),
              e._v(" "),
              a(
                "transition",
                { attrs: { name: "slide" } },
                [
                  e.dialogSettingsGeneral
                    ? a(
                        "el-dialog",
                        {
                          staticClass: "am-side-dialog am-dialog-settings",
                          attrs: {
                            visible: e.dialogSettingsGeneral,
                            "show-close": !1,
                          },
                          on: {
                            "update:visible": function (t) {
                              e.dialogSettingsGeneral = t;
                            },
                          },
                        },
                        [
                          a("dialog-settings-general", {
                            attrs: {
                              general: e.settings.general,
                              languagesData: e.languagesData,
                            },
                            on: {
                              closeDialogSettingsGeneral: function (t) {
                                e.dialogSettingsGeneral = !1;
                              },
                              updateSettings: e.updateSettings,
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
              a(
                "transition",
                { attrs: { name: "slide" } },
                [
                  e.dialogSettingsCompany
                    ? a(
                        "el-dialog",
                        {
                          staticClass: "am-side-dialog am-dialog-settings",
                          attrs: {
                            visible: e.dialogSettingsCompany,
                            "show-close": !1,
                          },
                          on: {
                            "update:visible": function (t) {
                              e.dialogSettingsCompany = t;
                            },
                          },
                        },
                        [
                          a("dialog-settings-company", {
                            attrs: { company: e.settings.company },
                            on: {
                              closeDialogSettingsCompany: function (t) {
                                e.dialogSettingsCompany = !1;
                              },
                              updateSettings: e.updateSettings,
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
              a(
                "transition",
                { attrs: { name: "slide" } },
                [
                  e.dialogSettingsNotifications
                    ? a(
                        "el-dialog",
                        {
                          staticClass: "am-side-dialog am-dialog-settings",
                          attrs: {
                            visible: e.dialogSettingsNotifications,
                            "show-close": !1,
                          },
                          on: {
                            "update:visible": function (t) {
                              e.dialogSettingsNotifications = t;
                            },
                          },
                        },
                        [
                          a("dialog-settings-notifications", {
                            attrs: { notifications: e.settings.notifications },
                            on: {
                              closeDialogSettingsNotifications: function (t) {
                                e.dialogSettingsNotifications = !1;
                              },
                              updateSettings: e.updateSettings,
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
              a(
                "transition",
                { attrs: { name: "slide" } },
                [
                  e.dialogSettingsWorkHoursDaysOff
                    ? a(
                        "el-dialog",
                        {
                          staticClass: "am-side-dialog am-dialog-settings",
                          attrs: {
                            visible: e.dialogSettingsWorkHoursDaysOff,
                            "show-close": !1,
                          },
                          on: {
                            "update:visible": function (t) {
                              e.dialogSettingsWorkHoursDaysOff = t;
                            },
                          },
                        },
                        [
                          a("dialog-settings-work-hours-days-off", {
                            attrs: {
                              daysOff: e.settings.daysOff,
                              weekSchedule: e.settings.weekSchedule,
                            },
                            on: {
                              closeDialogSettingsWorkHoursDaysOff: function (
                                t
                              ) {
                                e.dialogSettingsWorkHoursDaysOff = !1;
                              },
                              updateSettings: e.updateSettings,
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
              a(
                "transition",
                { attrs: { name: "slide" } },
                [
                  e.dialogSettingsPayments
                    ? a(
                        "el-dialog",
                        {
                          staticClass: "am-side-dialog am-dialog-settings",
                          attrs: {
                            visible: e.dialogSettingsPayments,
                            "show-close": !1,
                          },
                          on: {
                            "update:visible": function (t) {
                              e.dialogSettingsPayments = t;
                            },
                          },
                        },
                        [
                          a("dialog-settings-payments", {
                            attrs: {
                              customFields: e.customFields,
                              categories: e.categories,
                              coupons: e.coupons,
                              payments: e.settings.payments,
                            },
                            on: {
                              closeDialogSettingsPayments: function (t) {
                                e.dialogSettingsPayments = !1;
                              },
                              updateSettings: e.updateSettings,
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
              a(
                "transition",
                { attrs: { name: "slide" } },
                [
                  e.dialogSettingsIntegrations
                    ? a(
                        "el-dialog",
                        {
                          staticClass: "am-side-dialog am-dialog-settings",
                          attrs: {
                            visible: e.dialogSettingsIntegrations,
                            "show-close": !1,
                          },
                          on: {
                            "update:visible": function (t) {
                              e.dialogSettingsIntegrations = t;
                            },
                          },
                        },
                        [
                          a("dialog-settings-integrations", {
                            attrs: {
                              googleCalendar: e.settings.googleCalendar,
                              outlookCalendar: e.settings.outlookCalendar,
                              zoom: e.settings.zoom,
                              webHooks: e.settings.webHooks,
                            },
                            on: {
                              closeDialogSettingsIntegrations: function (t) {
                                e.dialogSettingsIntegrations = !1;
                              },
                              updateSettings: e.updateSettings,
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
              a(
                "transition",
                { attrs: { name: "slide" } },
                [
                  e.dialogSettingsLabels
                    ? a(
                        "el-dialog",
                        {
                          staticClass: "am-side-dialog am-dialog-settings",
                          attrs: {
                            visible: e.dialogSettingsLabels,
                            "show-close": !1,
                          },
                          on: {
                            "update:visible": function (t) {
                              e.dialogSettingsLabels = t;
                            },
                          },
                        },
                        [
                          a("dialog-settings-labels", {
                            attrs: { labels: e.settings.labels },
                            on: {
                              closeDialogSettingsLabels: function (t) {
                                e.dialogSettingsLabels = !1;
                              },
                              updateSettings: e.updateSettings,
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
              !0 === e.$root.settings.activation.showActivationSettings
                ? a(
                    "transition",
                    { attrs: { name: "slide" } },
                    [
                      e.dialogSettingsActivation
                        ? a(
                            "el-dialog",
                            {
                              staticClass: "am-side-dialog am-dialog-settings",
                              attrs: {
                                visible: e.dialogSettingsActivation,
                                "show-close": !1,
                              },
                              on: {
                                "update:visible": function (t) {
                                  e.dialogSettingsActivation = t;
                                },
                              },
                            },
                            [
                              a("dialog-settings-activation", {
                                attrs: { activation: e.settings.activation },
                                on: {
                                  closeDialogSettingsActivation: function (t) {
                                    e.dialogSettingsActivation = !1;
                                  },
                                  updateSettings: e.updateSettings,
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
              a(
                "transition",
                { attrs: { name: "slide" } },
                [
                  e.dialogSettingsRoles
                    ? a(
                        "el-dialog",
                        {
                          staticClass: "am-side-dialog am-dialog-settings",
                          attrs: {
                            visible: e.dialogSettingsRoles,
                            "show-close": !1,
                          },
                          on: {
                            "update:visible": function (t) {
                              e.dialogSettingsRoles = t;
                            },
                          },
                        },
                        [
                          a("dialog-settings-roles", {
                            attrs: { roles: e.settings.roles },
                            on: {
                              closeDialogSettingsRoles: function (t) {
                                e.dialogSettingsRoles = !1;
                              },
                              updateSettings: e.updateSettings,
                              showDialogTranslate: e.showDialogTranslate,
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
              a(
                "transition",
                { attrs: { name: "slide" } },
                [
                  e.dialogTranslate
                    ? a(
                        "el-dialog",
                        {
                          staticClass:
                            "am-side-dialog am-dialog-translate am-edit",
                          attrs: {
                            "show-close": !0,
                            visible: e.dialogTranslate,
                          },
                          on: {
                            "update:visible": function (t) {
                              e.dialogTranslate = t;
                            },
                          },
                        },
                        [
                          a("dialog-translate", {
                            attrs: {
                              "passed-translations": e.dialogTranslateData,
                              name: e.dialogTranslateName,
                              allLanguagesData: e.languagesData,
                              "used-languages":
                                e.settings.general.usedLanguages,
                              type: e.dialogTranslateType,
                              tab: e.dialogTranslateTab,
                            },
                            on: {
                              saveDialogTranslate: e.saveDialogTranslate,
                              closeDialogTranslate: function (t) {
                                e.dialogTranslate = !1;
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
              a(
                "transition",
                { attrs: { name: "slide" } },
                [
                  e.dialogSettingsAppointments
                    ? a(
                        "el-dialog",
                        {
                          staticClass: "am-side-dialog am-dialog-settings",
                          attrs: {
                            visible: e.dialogSettingsAppointments,
                            "show-close": !1,
                          },
                          on: {
                            "update:visible": function (t) {
                              e.dialogSettingsAppointments = t;
                            },
                          },
                        },
                        [
                          a("dialog-settings-appointments", {
                            attrs: { appointments: e.settings.appointments },
                            on: {
                              closeDialogSettingsAppointments: function (t) {
                                e.dialogSettingsAppointments = !1;
                              },
                              updateSettings: e.updateSettings,
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
              a("el-col", { attrs: { md: 6 } }, [
                a(
                  "a",
                  {
                    staticClass: "am-help-button",
                    attrs: {
                      href: "https://wpamelia.com/general-settings/",
                      target: "_blank",
                    },
                  },
                  [
                    a("i", { staticClass: "el-icon-question" }),
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
  672: function (e, t, a) {
    var s = a(685)(a(1264), a(1307), !1, null, null, null);
    e.exports = s.exports;
  },
  685: function (e, t) {
    e.exports = function (e, t, a, s, o, i) {
      var n,
        l = (e = e || {}),
        r = typeof e.default;
      ("object" !== r && "function" !== r) || ((n = e), (l = e.default));
      var c,
        d = "function" == typeof l ? l.options : l;
      if (
        (t &&
          ((d.render = t.render),
          (d.staticRenderFns = t.staticRenderFns),
          (d._compiled = !0)),
        a && (d.functional = !0),
        o && (d._scopeId = o),
        i
          ? ((c = function (e) {
              (e =
                e ||
                (this.$vnode && this.$vnode.ssrContext) ||
                (this.parent &&
                  this.parent.$vnode &&
                  this.parent.$vnode.ssrContext)) ||
                "undefined" == typeof __VUE_SSR_CONTEXT__ ||
                (e = __VUE_SSR_CONTEXT__),
                s && s.call(this, e),
                e && e._registeredComponents && e._registeredComponents.add(i);
            }),
            (d._ssrRegister = c))
          : s && (c = s),
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
      return { esModule: n, exports: l, options: d };
    };
  },
  686: function (e, t, a) {
    "use strict";
    var s =
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
          var a = this;
          Object.keys(e).forEach(function (o) {
            null !== e[o] && "object" === s(e[o]) && o in t
              ? a.replaceExistingObjectProperties(e[o], t[o])
              : o in t && (e[o] = t[o]);
          });
        },
        addMissingObjectProperties: function (e, t) {
          var a = this;
          Object.keys(t).forEach(function (o) {
            var i = !1;
            o in e ||
              ("object" === s(t[o])
                ? ((e[o] = {}), (i = !0))
                : ((e[o] = null), (i = !0))),
              null === t[o] || "object" !== s(t[o])
                ? i && (e[o] = t[o])
                : a.addMissingObjectProperties(e[o], t[o]);
          });
        },
        scrollView: function (e, t, a) {
          "undefined" != typeof jQuery &&
            ((void 0 !== a && a) || jQuery(window).width() <= 600) &&
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
            var a = [],
              s = {};
            return (
              t.split("&").forEach(function (e) {
                (a = e.split("=")),
                  (s[a[0]] = decodeURIComponent(a[1]).replace(/\+/g, " "));
              }),
              s
            );
          }
        },
        getUrlParams: function (e) {
          var t = {};
          if (-1 !== e.indexOf("?")) {
            var a = [];
            e.split("?")[1]
              .split("&")
              .forEach(function (e) {
                (a = e.split("=")),
                  (t[a[0]] = decodeURIComponent(a[1]).replace(/\+/g, " "));
              });
          }
          return t;
        },
        removeURLParameter: function (e, t) {
          var a = e.split("?");
          if (a.length >= 2) {
            for (
              var s = encodeURIComponent(t) + "=",
                o = a[1].split(/[&;]/g),
                i = o.length;
              i-- > 0;

            )
              -1 !== o[i].lastIndexOf(s, 0) && o.splice(i, 1);
            return (e = a[0] + (o.length > 0 ? "?" + o.join("&") : ""));
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
  687: function (e, t, a) {
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
          var e = a(693);
          e.init({ svgSelector: "img.svg", initClass: "js-inlinesvg" });
        },
        inlineSVGCabinet: function () {
          setTimeout(function () {
            a(693).init({
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
            a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
            s = this.getNameInitials(e),
            o = Math.floor(Math.random() * this.colors.length),
            i = this.colors[o];
          return (
            this.usedColors.push(this.colors[o]),
            this.colors.splice(o, 1),
            0 === this.colors.length &&
              ((this.colors = this.usedColors), (this.usedColors = [])),
            a
              ? t.firstName
                ? this.$root.getUrl + "public/img/default-employee.svg"
                : t.latitude
                ? this.$root.getUrl + "public/img/default-location.svg"
                : this.$root.getUrl + "public/img/default-service.svg"
              : location.protocol +
                "//via.placeholder.com/120/" +
                i +
                "/fff?text=" +
                s
          );
        },
        pictureLoad: function (e, t) {
          if (null !== e) {
            var a = !0 === t ? e.firstName + " " + e.lastName : e.name;
            if (void 0 !== a)
              return (
                (e.pictureThumbPath =
                  e.pictureThumbPath || this.imageFromText(a)),
                e.pictureThumbPath
              );
          }
        },
        imageLoadError: function (e, t) {
          var a = !0 === t ? e.firstName + " " + e.lastName : e.name;
          void 0 !== a && (e.pictureThumbPath = this.imageFromText(a, e, !0));
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
  689: function (e, t, a) {
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
            a = this.getPriceNumberOfDecimalPlaces(),
            s = this.getPriceThousandSeparator(),
            o = this.getPriceDecimalSeparator(),
            i = this.getPricePrefix(),
            n = this.getPriceSuffix(),
            l = parseInt((e = Math.abs(+e || 0).toFixed(a))) + "",
            r = l.length > 3 ? l.length % 3 : 0;
          return (
            (t ? i : "") +
            (r ? l.substr(0, r) + s : "") +
            l.substr(r).replace(/(\d{3})(?=\d)/g, "$1" + s) +
            (a
              ? o +
                Math.abs(e - l)
                  .toFixed(a)
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
  691: function (e, t, a) {
    "use strict";
    t.a = {
      methods: {
        notify: function (e, t, a, s) {
          var o = this;
          void 0 === s && (s = ""),
            setTimeout(function () {
              o.$notify({
                customClass: s,
                title: e,
                message: t,
                type: a,
                offset: 50,
              });
            }, 700);
        },
      },
    };
  },
  692: function (e, t, a) {
    "use strict";
    var s = a(0),
      o = a.n(s);
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
            a = e.asMinutes() % 60;
          return (
            (t ? t + this.$root.labels.h + " " : "") +
            " " +
            (a ? a + this.$root.labels.min : "")
          );
        },
        secondsToNiceDuration: function (e) {
          var t = Math.floor(e / 3600),
            a = (e / 60) % 60;
          return (
            (t ? t + this.$root.labels.h + " " : "") +
            " " +
            (a ? a + this.$root.labels.min : "")
          );
        },
        secondsToTimeSelectStep: function (e) {
          var t = Math.floor(e / 3600),
            a = Math.floor(e / 60) - 60 * t;
          return e < 0
            ? (t || "00") + ":" + ((a < 9 ? "0" + a : a) || "00")
            : ((t <= 9 ? "0" + t : t) || "00") +
                ":" +
                ((a <= 9 ? "0" + a : a) || "00");
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
              a = [],
              s = this.getTimeSlotLength();
            s <= t;
            s += this.getTimeSlotLength()
          )
            a.push(s);
          return (
            e &&
              -1 === a.indexOf(e) &&
              (a.push(e),
              a.sort(function (e, t) {
                return e - t;
              })),
            a
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
  693: function (e, t, a) {
    (function (a) {
      var s, o, i, n;
      (n = void 0 !== a ? a : this.window || this.global),
        (o = []),
        (s = (function (e) {
          var t,
            a = {},
            s = !!document.querySelector && !!e.addEventListener,
            o = { initClass: "js-inlinesvg", svgSelector: "img.svg" },
            i = function () {
              var e = {},
                t = !1,
                a = 0,
                s = arguments.length;
              "[object Boolean]" ===
                Object.prototype.toString.call(arguments[0]) &&
                ((t = arguments[0]), a++);
              for (
                var o = function (a) {
                  for (var s in a)
                    Object.prototype.hasOwnProperty.call(a, s) &&
                      (t &&
                      "[object Object]" === Object.prototype.toString.call(a[s])
                        ? (e[s] = i(!0, e[s], a[s]))
                        : (e[s] = a[s]));
                };
                s > a;
                a++
              ) {
                o(arguments[a]);
              }
              return e;
            },
            n = function (e) {
              var a = document.querySelectorAll(t.svgSelector),
                s = (function (e, t) {
                  return function () {
                    return --e < 1 ? t.apply(this, arguments) : void 0;
                  };
                })(a.length, e);
              Array.prototype.forEach.call(a, function (e, a) {
                var o = e.src || e.getAttribute("data-src"),
                  i = e.attributes,
                  n = new XMLHttpRequest();
                n.open("GET", o, !0),
                  (n.onload = function () {
                    if (n.status >= 200 && n.status < 400) {
                      var a = new DOMParser()
                        .parseFromString(n.responseText, "text/xml")
                        .getElementsByTagName("svg")[0];
                      if (
                        (a.removeAttribute("xmlns:a"),
                        a.removeAttribute("width"),
                        a.removeAttribute("height"),
                        a.removeAttribute("x"),
                        a.removeAttribute("y"),
                        a.removeAttribute("enable-background"),
                        a.removeAttribute("xmlns:xlink"),
                        a.removeAttribute("xml:space"),
                        a.removeAttribute("version"),
                        Array.prototype.slice.call(i).forEach(function (e) {
                          "src" !== e.name &&
                            "alt" !== e.name &&
                            a.setAttribute(e.name, e.value);
                        }),
                        a.classList
                          ? a.classList.add("inlined-svg")
                          : (a.className += " inlined-svg"),
                        a.setAttribute("role", "img"),
                        i.longdesc)
                      ) {
                        var o = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "desc"
                          ),
                          l = document.createTextNode(i.longdesc.value);
                        o.appendChild(l), a.insertBefore(o, a.firstChild);
                      }
                      if (i.alt) {
                        a.setAttribute("aria-labelledby", "title");
                        var r = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "title"
                          ),
                          c = document.createTextNode(i.alt.value);
                        r.appendChild(c), a.insertBefore(r, a.firstChild);
                      }
                      e.parentNode.replaceChild(a, e), s(t.svgSelector);
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
            (a.init = function (e, a) {
              s &&
                ((t = i(o, e || {})),
                n(a || function () {}),
                (document.documentElement.className += " " + t.initClass));
            }),
            a
          );
        })(n)),
        void 0 === (i = "function" == typeof s ? s.apply(t, o) : s) ||
          (e.exports = i);
    }.call(t, a(39)));
  },
  695: function (e, t, a) {
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
  696: function (e, t, a) {
    var s = a(685)(a(703), a(704), !1, null, null, null);
    e.exports = s.exports;
  },
  700: function (e, t, a) {
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
  703: function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var s = a(700);
    t.default = {
      mixins: [s.a],
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
          var a = this.input;
          if (
            ("ar" === window.localeLanguage[0] &&
              (a = a.replace(/[٠-٩]/g, function (e) {
                return "٠١٢٣٤٥٦٧٨٩".indexOf(e);
              })),
            "" !== a)
          ) {
            if (a.startsWith("+")) {
              var s = parseInt(a.slice(1)),
                o = this.countries.filter(function (e) {
                  return e.phonecode === s;
                });
              if (o.length) {
                var i = null;
                1 === s
                  ? (i = o.find(function (e) {
                      return 229 === e.id;
                    }))
                  : 44 === s
                  ? (i = o.find(function (e) {
                      return 228 === e.id;
                    }))
                  : 7 === s &&
                    (i = o.find(function (e) {
                      return 176 === e.id;
                    })),
                  (void 0 !== i && null !== i) || (i = o[0]),
                  (this.value = i.iso);
              }
              this.phone = a;
            } else
              this.phone =
                void 0 !== t
                  ? !0 === a.startsWith("0")
                    ? "+" + t.phonecode + a.slice(1).replace(/\D/g, "")
                    : "+" + t.phonecode + a.replace(/\D/g, "")
                  : a;
            this.$emit("phoneFormatted", this.phone, this.value);
          } else
            (this.phone = a),
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
          for (var a = 1; null === t && a < 5; )
            (t =
              void 0 !==
              (t = this.countries.find(function (t) {
                return (
                  t.phonecode === parseInt(e.savedPhone.substr(1, a)) &&
                  1 === t.priority
                );
              }))
                ? t
                : null),
              a++;
          if (!t)
            for (a = 1; null === t && a < 5; )
              (t =
                void 0 !==
                (t = this.countries.find(function (t) {
                  return t.phonecode === parseInt(e.savedPhone.substr(1, a));
                }))
                  ? t
                  : null),
                a++;
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
          a = e._self._c || t;
        return a(
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
            a(
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
                return a(
                  "el-option",
                  { key: t.id, attrs: { value: t.iso, label: " " } },
                  [
                    a("span", { class: "am-flag am-flag-" + t.iso }),
                    e._v(" "),
                    a("span", { staticClass: "am-phone-input-nicename" }, [
                      e._v(e._s(t.nicename)),
                    ]),
                    e._v(" "),
                    a("span", { staticClass: "am-phone-input-phonecode" }, [
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
  717: function (e, t, a) {
    var s = a(685)(a(718), a(719), !1, null, null, null);
    e.exports = s.exports;
  },
  718: function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var s = a(337);
    t.default = {
      mixins: [s.a],
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
          a = e._self._c || t;
        return a(
          "div",
          { staticClass: "am-page-header am-section" },
          [
            a(
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
                a(
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
                    a("div", { staticClass: "am-logo" }, [
                      a("img", {
                        staticClass: "logo-big",
                        attrs: {
                          width: "92",
                          src:
                            e.$root.getUrl +
                            "public/img/amelia-logo-horizontal.svg",
                        },
                      }),
                      e._v(" "),
                      a("img", {
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
                    a("h1", { staticClass: "am-page-title" }, [
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
                        ? a(
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
                        ? a(
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
                        ? a("span", [
                            a("span", { staticClass: "total-number" }, [
                              e._v(e._s(e.employeesTotal)),
                            ]),
                            e._v(
                              " " + e._s(e.$root.labels.total) + "\n        "
                            ),
                          ])
                        : e._e(),
                      e._v(" "),
                      e.customersTotal >= 0
                        ? a("span", [
                            a("span", { staticClass: "total-number" }, [
                              e._v(e._s(e.customersTotal)),
                            ]),
                            e._v(
                              " " + e._s(e.$root.labels.total) + "\n        "
                            ),
                          ])
                        : e._e(),
                      e._v(" "),
                      e.locationsTotal >= 0
                        ? a("span", [
                            a("span", { staticClass: "total-number" }, [
                              e._v(e._s(e.locationsTotal)),
                            ]),
                            e._v(
                              " " + e._s(e.$root.labels.total) + "\n        "
                            ),
                          ])
                        : e._e(),
                      e._v(" "),
                      e.servicesTotal >= 0 && "services" === e.bookableType
                        ? a("span", [
                            a("span", { staticClass: "total-number" }, [
                              e._v(e._s(e.servicesTotal)),
                            ]),
                            e._v(
                              " " + e._s(e.$root.labels.total) + "\n        "
                            ),
                          ])
                        : e._e(),
                      e._v(" "),
                      e.packagesTotal >= 0 && "packages" === e.bookableType
                        ? a("span", [
                            a("span", { staticClass: "total-number" }, [
                              e._v(e._s(e.packagesTotal)),
                            ]),
                            e._v(
                              " " + e._s(e.$root.labels.total) + "\n        "
                            ),
                          ])
                        : e._e(),
                      e._v(" "),
                      e.financeTotal >= 0
                        ? a("span", [
                            a("span", { staticClass: "total-number" }, [
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
                a(
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
                      ? a(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogAppointment },
                          },
                          [
                            a("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            a("span", { staticClass: "button-text" }, [
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
                      ? a(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogEvent },
                          },
                          [
                            a("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            a("span", { staticClass: "button-text" }, [
                              e._v(e._s(e.$root.labels.new_event)),
                            ]),
                          ]
                        )
                      : e._e(),
                    e._v(" "),
                    "wpamelia-employees" === e.$router.currentRoute.name &&
                    !0 === e.$root.settings.capabilities.canWrite &&
                    !0 === e.$root.settings.capabilities.canWriteOthers
                      ? a(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogEmployee },
                          },
                          [
                            a("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            a("span", { staticClass: "button-text" }, [
                              e._v(e._s(e.$root.labels.add_employee)),
                            ]),
                          ]
                        )
                      : e._e(),
                    e._v(" "),
                    "wpamelia-customers" === e.$router.currentRoute.name &&
                    !0 === e.$root.settings.capabilities.canWrite
                      ? a(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogCustomer },
                          },
                          [
                            a("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            a("span", { staticClass: "button-text" }, [
                              e._v(e._s(e.$root.labels.add_customer)),
                            ]),
                          ]
                        )
                      : e._e(),
                    e._v(" "),
                    "wpamelia-locations" === e.$router.currentRoute.name &&
                    !0 === e.$root.settings.capabilities.canWrite
                      ? a(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogLocation },
                          },
                          [
                            a("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            a("span", { staticClass: "button-text" }, [
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
                      ? a(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogService },
                          },
                          [
                            a("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            a("span", { staticClass: "button-text" }, [
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
                      ? a(
                          "el-button",
                          {
                            staticClass: "am-dialog-create",
                            attrs: { type: "primary" },
                            on: { click: e.showDialogPackage },
                          },
                          [
                            a("i", { staticClass: "el-icon-plus" }),
                            e._v(" "),
                            a("span", { staticClass: "button-text" }, [
                              e._v(e._s(e.$root.labels.add_package)),
                            ]),
                          ]
                        )
                      : e._e(),
                    e._v(" "),
                    a(
                      "transition",
                      { attrs: { name: "fade" } },
                      [
                        "wpamelia-finance" === e.$router.currentRoute.name &&
                        e.addNewCouponBtnDisplay &&
                        !0 === e.$root.settings.capabilities.canWrite
                          ? a(
                              "el-button",
                              {
                                staticClass: "am-dialog-create",
                                attrs: { type: "primary" },
                                on: { click: e.showDialogCoupon },
                              },
                              [
                                a("i", { staticClass: "el-icon-plus" }),
                                e._v(" "),
                                a("span", { staticClass: "button-text" }, [
                                  e._v(e._s(e.$root.labels.new_coupon)),
                                ]),
                              ]
                            )
                          : e._e(),
                      ],
                      1
                    ),
                    e._v(" "),
                    a(
                      "transition",
                      { attrs: { name: "fade" } },
                      [
                        "wpamelia-customize" === e.$router.currentRoute.name &&
                        e.addNewCustomFieldBtnDisplay &&
                        !0 === e.$root.settings.capabilities.canWrite
                          ? a(
                              "el-button",
                              {
                                staticClass: "am-dialog-create",
                                attrs: { type: "primary" },
                                on: { click: e.showDialogCustomFields },
                              },
                              [
                                a("i", { staticClass: "el-icon-plus" }),
                                e._v(" "),
                                a("span", { staticClass: "button-text" }, [
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
                      ? a("div", { staticClass: "v-calendar-column" }, [
                          a(
                            "div",
                            { staticClass: "el-form-item__content" },
                            [
                              a("v-date-picker", {
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
                      ? a(
                          "div",
                          { staticClass: "am-calendar-header-filters" },
                          [
                            a(
                              "el-form",
                              {
                                staticClass: "demo-form-inline",
                                attrs: { inline: !0 },
                              },
                              [
                                a(
                                  "el-form-item",
                                  {
                                    attrs: {
                                      label: e.$root.labels.services + ":",
                                    },
                                  },
                                  [
                                    a(
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
                                        return a(
                                          "div",
                                          { key: t.id },
                                          [
                                            a(
                                              "div",
                                              {
                                                staticClass: "am-drop-parent",
                                                on: {
                                                  click: function (a) {
                                                    return e.selectAllInCategory(
                                                      t.id
                                                    );
                                                  },
                                                },
                                              },
                                              [a("span", [e._v(e._s(t.name))])]
                                            ),
                                            e._v(" "),
                                            e._l(t.serviceList, function (e) {
                                              return a("el-option", {
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
                                a(
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
                                    a(
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
                                        return a("el-option", {
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
                              ? a(
                                  "el-button",
                                  {
                                    staticClass: "am-dialog-create",
                                    attrs: { type: "primary" },
                                    on: { click: e.showDialogAppointment },
                                  },
                                  [
                                    a("i", { staticClass: "el-icon-plus" }),
                                    e._v(" "),
                                    a("span", { staticClass: "button-text" }, [
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
  792: function (e, t, a) {
    var s = a(685)(a(795), a(796), !1, null, null, null);
    e.exports = s.exports;
  },
  795: function (e, t, a) {
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
                  var a = null;
                  e.state()
                    .get("selection")
                    .forEach(function (e) {
                      (a = e.toJSON()),
                        (t.pictureFullPath = a.url),
                        (t.pictureThumbPath = a.sizes.thumbnail
                          ? a.sizes.thumbnail.url
                          : a.url),
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
          a = e._self._c || t;
        return a(
          "div",
          { staticClass: "am-profile-photo", on: { click: e.openMediaModal } },
          [
            a("i", {
              class: {
                "el-icon-plus": "gallery" === e.entityName,
                "el-icon-picture": "gallery" !== e.entityName,
              },
            }),
            e._v(" "),
            "gallery" === e.entityName
              ? a("span", [e._v(e._s(e.$root.labels.add_image))])
              : e._e(),
            e._v(" "),
            "gallery" !== e.entityName
              ? a("img", { attrs: { src: e.getPictureSrc, alt: "" } })
              : e._e(),
          ]
        );
      },
      staticRenderFns: [],
    };
  },
  882: function (e, t, a) {
    var s = a(685)(a(898), a(899), !1, null, null, null);
    e.exports = s.exports;
  },
  898: function (e, t, a) {
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
          a = e._self._c || t;
        return a("div", { staticClass: "am-dialog-translate" }, [
          a(
            "div",
            { staticClass: "am-dialog-scrollable", style: e.dialogStyle },
            [
              a(
                "div",
                { staticClass: "am-dialog-header" },
                [
                  a(
                    "el-row",
                    [
                      a("el-col", { attrs: { span: 16 } }, [
                        a("img", {
                          staticClass: "am-dialog-translate-svg-back",
                          attrs: {
                            src: e.$root.getUrl + "public/img/arrow-back.svg",
                          },
                          on: { click: e.goBack },
                        }),
                        e._v(" "),
                        a("h2", [e._v(e._s(e.getHeaderTitle()))]),
                      ]),
                      e._v(" "),
                      a(
                        "el-col",
                        { staticClass: "align-right", attrs: { span: 8 } },
                        [
                          a("el-button", {
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
              e._l(e.oldTranslations, function (t, s) {
                return a(
                  "div",
                  { key: s },
                  [
                    e.usedLanguages && -1 !== e.usedLanguages.indexOf(s)
                      ? a(
                          "el-row",
                          { attrs: { gutter: 28, type: "flex" } },
                          [
                            a(
                              "el-col",
                              {
                                staticStyle: { "padding-right": "0" },
                                attrs: {
                                  xs: e.languageWidth,
                                  sm: e.languageWidth,
                                },
                              },
                              [
                                a("div", { staticClass: "used-language" }, [
                                  a("img", {
                                    staticClass: "am-dialog-translate-flag",
                                    attrs: { src: e.getLanguageFlag(s) },
                                  }),
                                  e._v(
                                    "\n            " +
                                      e._s(e.getLanguageLabel(s, !0)) +
                                      "\n          "
                                  ),
                                ]),
                              ]
                            ),
                            e._v(" "),
                            "name" === e.type && "cf" !== e.tab
                              ? a(
                                  "el-col",
                                  {
                                    staticStyle: { "padding-right": "0" },
                                    attrs: { xs: 8, sm: 14 },
                                  },
                                  [
                                    a("el-input", {
                                      attrs: {
                                        type: "text",
                                        placeholder: e.$root.labels.translation,
                                      },
                                      model: {
                                        value: e.oldTranslations[s],
                                        callback: function (t) {
                                          e.$set(e.oldTranslations, s, t);
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
                    -1 !== e.usedLanguages.indexOf(s)
                      ? a(
                          "el-row",
                          {
                            staticClass: "am-dialog-translate-description",
                            staticStyle: { "margin-bottom": "8px" },
                            attrs: { gutter: 24, type: "flex" },
                          },
                          [
                            a(
                              "el-col",
                              {
                                staticStyle: { "padding-right": "0" },
                                attrs: { sm: 24 },
                              },
                              [
                                a("el-input", {
                                  attrs: {
                                    value: t,
                                    type: "textarea",
                                    autosize: { minRows: 4, maxRows: 6 },
                                  },
                                  model: {
                                    value: e.oldTranslations[s],
                                    callback: function (t) {
                                      e.$set(e.oldTranslations, s, t);
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
                    -1 !== e.usedLanguages.indexOf(s)
                      ? a(
                          "el-row",
                          {
                            staticClass: "am-dialog-translate-description",
                            attrs: { gutter: 24, type: "flex" },
                          },
                          [
                            a(
                              "el-col",
                              {
                                staticStyle: { "padding-right": "0" },
                                attrs: { sm: 24 },
                              },
                              [
                                a("el-input", {
                                  attrs: { value: t },
                                  model: {
                                    value: e.oldTranslations[s],
                                    callback: function (t) {
                                      e.$set(e.oldTranslations, s, t);
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
                    -1 !== e.usedLanguages.indexOf(s)
                      ? a(
                          "el-row",
                          {
                            staticClass: "am-dialog-translate-description",
                            attrs: { gutter: 26, type: "flex" },
                          },
                          [
                            a("el-col", { attrs: { sm: 5 } }, [
                              a(
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
                            a("el-col", { attrs: { sm: 5 } }, [
                              a(
                                "div",
                                { staticClass: "am-dialog-translate-cf-label" },
                                [a("i", [e._v(e._s(e.name))])]
                              ),
                            ]),
                            e._v(" "),
                            a(
                              "el-col",
                              {
                                staticStyle: { "padding-right": "0" },
                                attrs: { sm: 14 },
                              },
                              [
                                a("el-input", {
                                  attrs: {
                                    value: t,
                                    type: "text",
                                    placeholder: " ",
                                  },
                                  model: {
                                    value: e.oldTranslations[s],
                                    callback: function (t) {
                                      e.$set(e.oldTranslations, s, t);
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
                    e._l(e.options, function (t, o) {
                      return e.cfOptions.length &&
                        e.usedLanguages &&
                        -1 !== e.usedLanguages.indexOf(s)
                        ? a(
                            "div",
                            [
                              a(
                                "el-row",
                                {
                                  staticClass:
                                    "am-dialog-translate-description",
                                  attrs: { gutter: 20, type: "flex" },
                                },
                                [
                                  a("el-col", { attrs: { sm: 5 } }, [
                                    a(
                                      "div",
                                      { staticClass: "am-dialog-translate-cf" },
                                      [e._v(" #" + e._s(o))]
                                    ),
                                  ]),
                                  e._v(" "),
                                  a("el-col", { attrs: { sm: 5 } }, [
                                    a(
                                      "div",
                                      {
                                        staticClass:
                                          "am-dialog-translate-cf-label",
                                      },
                                      [a("i", [e._v(e._s(t.label))])]
                                    ),
                                  ]),
                                  e._v(" "),
                                  a(
                                    "el-col",
                                    {
                                      staticStyle: { "padding-right": "0" },
                                      attrs: { sm: 14 },
                                    },
                                    [
                                      a("el-input", {
                                        attrs: {
                                          type: "text",
                                          placeholder: " ",
                                        },
                                        model: {
                                          value: t.translations[s],
                                          callback: function (a) {
                                            e.$set(t.translations, s, a);
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
              e._l(e.newTranslations, function (t, s) {
                return a(
                  "div",
                  { key: s },
                  [
                    a(
                      "el-row",
                      {
                        staticStyle: { "margin-right": "-15px" },
                        attrs: { gutter: 28, type: "flex" },
                      },
                      [
                        a(
                          "el-col",
                          {
                            staticStyle: { "padding-right": "0" },
                            attrs: { sm: e.languageWidth },
                          },
                          [
                            a(
                              "el-select",
                              {
                                attrs: {
                                  placeholder: e.$root.labels.language,
                                  clearable: "",
                                  filterable: "",
                                },
                                model: {
                                  value: e.newTranslations[s].lan,
                                  callback: function (t) {
                                    e.$set(e.newTranslations[s], "lan", t);
                                  },
                                  expression: "newTranslations[index].lan",
                                },
                              },
                              [
                                a("template", { slot: "prefix" }, [
                                  a("img", {
                                    staticClass:
                                      "am-dialog-translate-flag-selected",
                                    attrs: {
                                      src: e.getLanguageFlag(
                                        e.newTranslations[s].lan
                                      ),
                                    },
                                  }),
                                ]),
                                e._v(" "),
                                e._l(e.allLanguagesKeys, function (t, s) {
                                  return a(
                                    "el-option",
                                    {
                                      key: s,
                                      attrs: {
                                        label: e.getLanguageLabel(t, !1),
                                        value: t,
                                        disabled: t in e.oldTranslations,
                                      },
                                    },
                                    [
                                      a("span", [
                                        a("img", {
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
                          ? a(
                              "el-col",
                              {
                                staticStyle: { "padding-right": "0" },
                                attrs: { xs: 14, sm: 18 },
                              },
                              [
                                a("el-input", {
                                  attrs: {
                                    type: "text",
                                    name: t.name,
                                    placeholder: e.$root.labels.translation,
                                  },
                                  model: {
                                    value: e.newTranslations[s].value,
                                    callback: function (t) {
                                      e.$set(e.newTranslations[s], "value", t);
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
                      ? a(
                          "el-row",
                          {
                            staticClass: "am-dialog-translate-description",
                            attrs: { gutter: 24, type: "flex" },
                          },
                          [
                            a(
                              "el-col",
                              { attrs: { sm: 24 } },
                              [
                                a("el-input", {
                                  attrs: {
                                    value: t,
                                    type: "textarea",
                                    autosize: { minRows: 4, maxRows: 6 },
                                  },
                                  model: {
                                    value: e.newTranslations[s].value,
                                    callback: function (t) {
                                      e.$set(e.newTranslations[s], "value", t);
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
                      ? a(
                          "el-row",
                          {
                            staticClass: "am-dialog-translate-description",
                            attrs: { gutter: 24, type: "flex" },
                          },
                          [
                            a(
                              "el-col",
                              { attrs: { sm: 24 } },
                              [
                                a("el-input", {
                                  attrs: { value: t },
                                  model: {
                                    value: e.newTranslations[s].value,
                                    callback: function (t) {
                                      e.$set(e.newTranslations[s], "value", t);
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
                      ? a(
                          "el-row",
                          {
                            staticClass: "am-dialog-translate-description",
                            attrs: { gutter: 20, type: "flex" },
                          },
                          [
                            a("el-col", { attrs: { sm: 5 } }, [
                              a(
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
                            a("el-col", { attrs: { sm: 5 } }, [
                              a(
                                "div",
                                { staticClass: "am-dialog-translate-cf-label" },
                                [a("i", [e._v(e._s(e.name))])]
                              ),
                            ]),
                            e._v(" "),
                            a(
                              "el-col",
                              {
                                staticStyle: { "padding-right": "0" },
                                attrs: { sm: 14 },
                              },
                              [
                                a("el-input", {
                                  attrs: { type: "text", name: t.name },
                                  model: {
                                    value: e.newTranslations[s].value,
                                    callback: function (t) {
                                      e.$set(e.newTranslations[s], "value", t);
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
                    e._l(e.options, function (t, o) {
                      return e.cfOptions.length
                        ? a(
                            "div",
                            [
                              a(
                                "el-row",
                                {
                                  staticClass:
                                    "am-dialog-translate-description",
                                  attrs: { gutter: 24, type: "flex" },
                                },
                                [
                                  a("el-col", { attrs: { sm: 5 } }, [
                                    a(
                                      "div",
                                      { staticClass: "am-dialog-translate-cf" },
                                      [e._v(" #" + e._s(o))]
                                    ),
                                  ]),
                                  e._v(" "),
                                  a("el-col", { attrs: { sm: 5 } }, [
                                    a(
                                      "div",
                                      {
                                        staticClass:
                                          "am-dialog-translate-cf-label",
                                      },
                                      [a("i", [e._v(e._s(t.label))])]
                                    ),
                                  ]),
                                  e._v(" "),
                                  a(
                                    "el-col",
                                    {
                                      staticStyle: { "padding-right": "0" },
                                      attrs: { sm: 14 },
                                    },
                                    [
                                      a("el-input", {
                                        attrs: {
                                          type: "text",
                                          placeholder: " ",
                                        },
                                        model: {
                                          value:
                                            t.translations[
                                              e.newTranslations[s].lan
                                            ],
                                          callback: function (a) {
                                            e.$set(
                                              t.translations,
                                              e.newTranslations[s].lan,
                                              a
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
              a("div", [
                a("img", {
                  staticClass: "am-dialog-translate-svg-plus",
                  attrs: { src: e.$root.getUrl + "public/img/plus-circle.svg" },
                  on: { click: e.addLanguage },
                }),
                e._v(" "),
                a(
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
            ? a("div", { staticClass: "am-dialog-footer" }, [
                a(
                  "div",
                  { staticClass: "am-dialog-footer-actions" },
                  [
                    a(
                      "el-row",
                      [
                        a(
                          "el-col",
                          { staticClass: "align-right", attrs: { sm: 24 } },
                          [
                            a(
                              "el-button",
                              {
                                attrs: { type: "" },
                                on: { click: e.closeDialog },
                              },
                              [e._v(e._s(e.$root.labels.cancel))]
                            ),
                            e._v(" "),
                            a(
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
  900: function (e, t, a) {
    var s = a(685)(a(958), a(959), !1, null, null, null);
    e.exports = s.exports;
  },
  906: function (e, t, a) {
    var s = a(685)(a(917), a(918), !1, null, null, null);
    e.exports = s.exports;
  },
  907: function (e, t, a) {
    var s = a(685)(a(919), a(921), !1, null, null, null);
    e.exports = s.exports;
  },
  909: function (e, t, a) {
    "use strict";
    var s = a(691);
    t.a = {
      mixins: [s.a],
      data: function () {
        return {
          groupedPlaceholders: {},
          initialGroupedPlaceholders: {
            companyPlaceholders: [
              {
                value: "%company_address%",
                label: this.$root.labels.ph_company_address,
              },
              {
                value: "%company_name%",
                label: this.$root.labels.ph_company_name,
              },
              {
                value: "%company_phone%",
                label: this.$root.labels.ph_company_phone,
              },
              {
                value: "%company_website%",
                label: this.$root.labels.ph_company_website,
              },
            ],
            customerPlaceholders: [
              {
                value: "%customer_email%",
                label: this.$root.labels.ph_customer_email,
              },
              {
                value: "%customer_first_name%",
                label: this.$root.labels.ph_customer_first_name,
              },
              {
                value: "%customer_full_name%",
                label: this.$root.labels.ph_customer_full_name,
              },
              {
                value: "%customer_last_name%",
                label: this.$root.labels.ph_customer_last_name,
              },
              {
                value: "%customer_note%",
                label: this.$root.labels.ph_customer_note,
              },
              {
                value: "%customer_phone%",
                label: this.$root.labels.ph_customer_phone,
              },
              {
                value: "%customer_panel_url%",
                label: this.$root.labels.ph_customer_cabinet_url,
                parse: "link",
              },
            ],
            packagePlaceholders: [
              {
                value: "%package_appointments_details%",
                label: this.$root.labels.ph_package_appointments_details,
              },
              {
                value: "%package_description%",
                label: this.$root.labels.ph_package_description,
              },
              {
                value: "%package_duration%",
                label: this.$root.labels.ph_package_duration,
              },
              {
                value: "%package_name%",
                label: this.$root.labels.ph_package_name,
              },
              {
                value: "%package_price%",
                label: this.$root.labels.ph_package_price,
              },
              {
                value: "%package_deposit_payment%",
                label: this.$root.labels.ph_package_deposit_payment,
              },
              { value: "%time_zone%", label: this.$root.labels.ph_time_zone },
            ],
            employeePlaceholders: [
              {
                value: "%employee_email%",
                label: this.$root.labels.ph_employee_email,
              },
              {
                value: "%employee_first_name%",
                label: this.$root.labels.ph_employee_first_name,
              },
              {
                value: "%employee_full_name%",
                label: this.$root.labels.ph_employee_full_name,
              },
              {
                value: "%employee_last_name%",
                label: this.$root.labels.ph_employee_last_name,
              },
              {
                value: "%employee_note%",
                label: this.$root.labels.ph_employee_note,
              },
              {
                value: "%employee_phone%",
                label: this.$root.labels.ph_employee_phone,
              },
              {
                value: "%employee_panel_url%",
                label: this.$root.labels.ph_employee_cabinet_url,
                parse: "link",
              },
            ],
            categoryPlaceholders: [
              {
                value: "%category_name%",
                label: this.$root.labels.ph_category_name,
              },
              {
                value: "%service_description%",
                label: this.$root.labels.ph_service_description,
              },
              {
                value: "%service_duration%",
                label: this.$root.labels.ph_service_duration,
              },
              {
                value: "%service_name%",
                label: this.$root.labels.ph_service_name,
              },
              {
                value: "%service_price%",
                label: this.$root.labels.ph_service_price,
              },
            ],
            locationPlaceholders: [
              {
                value: "%location_address%",
                label: this.$root.labels.ph_location_address,
              },
              {
                value: "%location_description%",
                label: this.$root.labels.ph_location_description,
              },
              {
                value: "%location_name%",
                label: this.$root.labels.ph_location_name,
              },
              {
                value: "%location_phone%",
                label: this.$root.labels.ph_location_phone,
              },
            ],
            appointmentPlaceholders: [
              {
                value: "%appointment_id%",
                label: this.$root.labels.ph_appointment_id,
              },
              {
                value: "%appointment_cancel_url%",
                label: this.$root.labels.ph_appointment_cancel_url,
                parse: "link",
              },
              {
                value: "%appointment_date%",
                label: this.$root.labels.ph_appointment_date,
              },
              {
                value: "%appointment_date_time%",
                label: this.$root.labels.ph_appointment_date_time,
              },
              {
                value: "%appointment_duration%",
                label: this.$root.labels.ph_appointment_duration,
              },
              {
                value: "%appointment_start_time%",
                label: this.$root.labels.ph_appointment_start_time,
              },
              {
                value: "%appointment_end_time%",
                label: this.$root.labels.ph_appointment_end_time,
              },
              {
                value: "%appointment_notes%",
                label: this.$root.labels.ph_appointment_notes,
              },
              {
                value: "%appointment_price%",
                label: this.$root.labels.ph_appointment_price,
              },
              {
                value: "%appointment_deposit_payment%",
                label: this.$root.labels.ph_appointment_deposit_payment,
              },
              {
                value: "%appointment_status%",
                label: this.$root.labels.ph_appointment_status,
              },
              {
                value: "%booked_customer%",
                label: this.$root.labels.ph_booked_customer,
              },
              {
                value: "%coupon_used%",
                label: this.$root.labels.ph_coupon_used,
              },
              {
                value: "%number_of_persons%",
                label: this.$root.labels.ph_booking_number_of_persons,
              },
              {
                value: "%recurring_appointments_details%",
                label: this.$root.labels.ph_recurring_appointments_details,
              },
              {
                value: "%zoom_host_url%",
                label: this.$root.labels.ph_zoom_host_url,
              },
              {
                value: "%zoom_join_url%",
                label: this.$root.labels.ph_zoom_join_url,
              },
              {
                value: "%reservation_name%",
                label: this.$root.labels.ph_reservation_name,
              },
              {
                value: "%reservation_description%",
                label: this.$root.labels.ph_reservation_description,
              },
              { value: "%time_zone%", label: this.$root.labels.ph_time_zone },
            ],
            eventPlaceholders: [
              {
                value: "%attendee_code%",
                label: this.$root.labels.ph_attendee_code,
              },
              {
                value: "%coupon_used%",
                label: this.$root.labels.ph_coupon_used,
              },
              {
                value: "%event_cancel_url%",
                label: this.$root.labels.ph_event_cancel_url,
                parse: "link",
              },
              {
                value: "%event_description%",
                label: this.$root.labels.ph_event_description,
              },
              {
                value: "%event_end_date%",
                label: this.$root.labels.ph_event_end_date,
              },
              {
                value: "%event_end_date_time%",
                label: this.$root.labels.ph_event_end_date_time,
              },
              {
                value: "%event_end_time%",
                label: this.$root.labels.ph_event_end_time,
              },
              { value: "%event_name%", label: this.$root.labels.ph_event_name },
              {
                value: "%event_period_date%",
                label: this.$root.labels.ph_event_period_date,
              },
              {
                value: "%event_period_date_time%",
                label: this.$root.labels.ph_event_period_date_time,
              },
              {
                value: "%event_price%",
                label: this.$root.labels.ph_event_price,
              },
              {
                value: "%event_deposit_payment%",
                label: this.$root.labels.ph_event_deposit_payment,
              },
              {
                value: "%event_start_date%",
                label: this.$root.labels.ph_event_start_date,
              },
              {
                value: "%event_start_date_time%",
                label: this.$root.labels.ph_event_start_date_time,
              },
              {
                value: "%event_start_time%",
                label: this.$root.labels.ph_event_start_time,
              },
              {
                value: "%employee_name_email_phone%",
                label: this.$root.labels.ph_employee_name_email_phone,
              },
              {
                value: "%number_of_persons%",
                label: this.$root.labels.ph_booking_number_of_persons,
              },
              {
                value: "%zoom_host_url_date%",
                label: this.$root.labels.ph_zoom_host_url_date,
              },
              {
                value: "%zoom_host_url_date_time%",
                label: this.$root.labels.ph_zoom_host_url_date_date,
              },
              {
                value: "%zoom_join_url_date%",
                label: this.$root.labels.ph_zoom_join_url_date,
              },
              {
                value: "%zoom_join_url_date_time%",
                label: this.$root.labels.ph_zoom_join_url_date_date,
              },
              {
                value: "%reservation_name%",
                label: this.$root.labels.ph_reservation_name,
              },
              {
                value: "%reservation_description%",
                label: this.$root.labels.ph_reservation_description,
              },
              { value: "%time_zone%", label: this.$root.labels.ph_time_zone },
            ],
            customFieldsPlaceholders: [],
            extrasPlaceholders: [],
            couponsPlaceholders: [],
          },
          placeholders: [],
          linksForParsing: {
            "%customer_panel_url%":
              '<a href="%customer_panel_url%">' +
              this.$root.labels.ph_customer_cabinet_url +
              "</a>",
            "%employee_panel_url%":
              '<a href="%employee_panel_url%">' +
              this.$root.labels.ph_employee_cabinet_url +
              "</a>",
            "%appointment_cancel_url%":
              '<a href=" %appointment_cancel_url%">' +
              this.$root.labels.ph_appointment_cancel_url +
              "</a>",
            "%event_cancel_url%":
              '<a href=" %event_cancel_url%">' +
              this.$root.labels.ph_event_cancel_url +
              "</a>",
          },
          plainTextLinksForParsing: {
            "%customer_panel_url%":
              '&lt;a href="%customer_panel_url%"&gt;' +
              this.$root.labels.ph_customer_cabinet_url +
              "&lt;/a&gt;",
            "%employee_panel_url%":
              '&lt;a href="%employee_panel_url%"&gt;' +
              this.$root.labels.ph_employee_cabinet_url +
              "&lt;/a&gt;",
            "%appointment_cancel_url%":
              '&lt;a href=" %appointment_cancel_url%"&gt;' +
              this.$root.labels.ph_appointment_cancel_url +
              "&lt;/a&gt;",
            "%event_cancel_url%":
              '&lt;a href=" %event_cancel_url%"&gt;' +
              this.$root.labels.ph_event_cancel_url +
              "&lt;/a&gt;",
          },
        };
      },
      methods: {
        getEventPlaceholders: function () {
          return this.groupedPlaceholders.companyPlaceholders.concat(
            this.groupedPlaceholders.customerPlaceholders.concat(
              this.groupedPlaceholders.employeePlaceholders.concat(
                this.groupedPlaceholders.locationPlaceholders.concat(
                  this.groupedPlaceholders.customFieldsPlaceholders.concat(
                    this.groupedPlaceholders.eventPlaceholders.concat(
                      this.groupedPlaceholders.couponsPlaceholders
                    )
                  )
                )
              )
            )
          );
        },
        getAppointmentPlaceholders: function () {
          return this.groupedPlaceholders.companyPlaceholders.concat(
            this.groupedPlaceholders.customerPlaceholders.concat(
              this.groupedPlaceholders.employeePlaceholders.concat(
                this.groupedPlaceholders.locationPlaceholders.concat(
                  this.groupedPlaceholders.customFieldsPlaceholders.concat(
                    this.groupedPlaceholders.couponsPlaceholders.concat(
                      this.groupedPlaceholders.appointmentPlaceholders.concat(
                        this.groupedPlaceholders.categoryPlaceholders.concat(
                          this.groupedPlaceholders.extrasPlaceholders
                        )
                      )
                    )
                  )
                )
              )
            )
          );
        },
        getPackagePlaceholders: function () {
          return this.groupedPlaceholders.companyPlaceholders.concat(
            this.groupedPlaceholders.customerPlaceholders.concat(
              this.groupedPlaceholders.packagePlaceholders
            )
          );
        },
        removePlaceholder: function (e, t) {
          if (e in this.groupedPlaceholders) {
            var a = null;
            this.groupedPlaceholders[e].forEach(function (e, s) {
              e.value === t && (a = s);
            }),
              null !== a && this.groupedPlaceholders[e].splice(a, 1);
          }
        },
        getParsedCodeLabel: function (e) {
          if ("link" === e.parse)
            for (var t in this.linksForParsing)
              if (e.value === t) return this.linksForParsing[t];
          return "";
        },
        closeDialog: function () {
          this.$emit("closeDialogPlaceholders");
        },
        copyCodeText: function (e) {
          var t = document.createElement("textarea");
          (t.value = e),
            document.body.appendChild(t),
            t.select(),
            document.execCommand("Copy"),
            document.body.removeChild(t),
            this.notify(
              "",
              this.$root.labels.placeholder_copied,
              "info",
              "no-title"
            );
        },
        addCustomFieldsPlaceholders: function (e) {
          this.groupedPlaceholders.customFieldsPlaceholders = [];
          for (var t = 0; t < this.customFields.length; t++)
            ("file" === this.customFields[t].type && "provider" !== e) ||
              this.groupedPlaceholders.customFieldsPlaceholders.push({
                value: "%custom_field_" + this.customFields[t].id + "%",
                label: this.customFields[t].label,
              });
        },
        addCouponsPlaceholders: function (e) {
          if (
            ((this.groupedPlaceholders.couponsPlaceholders = []),
            "customer" === e)
          )
            for (var t = 0; t < this.coupons.length; t++)
              this.groupedPlaceholders.couponsPlaceholders.push({
                value: "%coupon_" + this.coupons[t].id + "%",
                label:
                  this.coupons[t].code +
                  " [" +
                  this.$root.labels.discount +
                  ": " +
                  this.coupons[t].discount +
                  ", " +
                  this.$root.labels.deduction +
                  ": " +
                  this.coupons[t].deduction +
                  this.getCurrencySymbol() +
                  "]",
              });
        },
        addExtrasPlaceholders: function () {
          this.groupedPlaceholders.extrasPlaceholders = [];
          for (var e = 0; e < this.categories.length; e++)
            for (var t = 0; t < this.categories[e].serviceList.length; t++)
              for (
                var a = 0;
                a < this.categories[e].serviceList[t].extras.length;
                a++
              )
                this.groupedPlaceholders.extrasPlaceholders.push({
                  value:
                    "%service_extra_" +
                    this.categories[e].serviceList[t].extras[a].id +
                    "_name%",
                  label: this.categories[e].serviceList[t].extras[a].name,
                }),
                  this.groupedPlaceholders.extrasPlaceholders.push({
                    value:
                      "%service_extra_" +
                      this.categories[e].serviceList[t].extras[a].id +
                      "_quantity%",
                    label: this.categories[e].serviceList[t].extras[a].name,
                  }),
                  this.groupedPlaceholders.extrasPlaceholders.push({
                    value:
                      "%service_extra_" +
                      this.categories[e].serviceList[t].extras[a].id +
                      "_price%",
                    label: this.categories[e].serviceList[t].extras[a].name,
                  });
          this.groupedPlaceholders.extrasPlaceholders.push({
            value: "%service_extras%",
            label: this.$root.labels.ph_extras,
          });
        },
        setPlaceholders: function (e) {
          var t = this;
          (this.groupedPlaceholders = JSON.parse(
            JSON.stringify(this.initialGroupedPlaceholders)
          )),
            this.addExtrasPlaceholders(),
            this.addCouponsPlaceholders(this.userTypeTab),
            this.addCustomFieldsPlaceholders(this.userTypeTab);
          var a = function (a) {
            e[a].forEach(function (e) {
              t.removePlaceholder(a, e);
            });
          };
          for (var s in e) a(s);
        },
      },
      computed: {},
    };
  },
  917: function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var s = a(337),
      o = a(687),
      i = a(695);
    t.default = {
      mixins: [o.a, s.a, i.a],
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
            a = e.filter(function (e) {
              return (
                t.$moment(e.startDate, "YYYY-MM-DD").year() === t.filterYear &&
                !e.repeat
              );
            }),
            s = e.filter(function (e) {
              return e.repeat;
            });
          return (
            s.forEach(function (e, a) {
              t.$moment(e.startDate, "YYYY-MM-DD").year() ===
              t.$moment(e.endDate, "YYYY-MM-DD").year()
                ? (s[a].endDate = t
                    .$moment(e.endDate, "YYYY-MM-DD")
                    .year(t.filterYear)
                    .format("YYYY-MM-DD"))
                : (s[a].endDate = t
                    .$moment(e.endDate, "YYYY-MM-DD")
                    .year(t.filterYear + 1)
                    .format("YYYY-MM-DD")),
                (s[a].startDate = t
                  .$moment(e.startDate, "YYYY-MM-DD")
                  .year(t.filterYear)
                  .format("YYYY-MM-DD"));
            }),
            s.concat(a).sort(function (e, a) {
              return t.$moment(e.startDate).diff(a.startDate);
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
          a = e._self._c || t;
        return a("div", { staticClass: "am-days-off" }, [
          a(
            "div",
            { staticClass: "am-dialog-table" },
            [
              a(
                "el-row",
                {
                  staticStyle: { "flex-wrap": "wrap" },
                  attrs: { gutter: 20, type: "flex", align: "middle" },
                },
                [
                  a(
                    "el-col",
                    { staticClass: "am-days-off__header" },
                    [
                      a("el-date-picker", {
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
                      a("div", { staticClass: "am-days-off__legend" }, [
                        a("div", { staticClass: "am-legend-repeat" }, [
                          a("span", { staticClass: "type repeat" }),
                          e._v(e._s(e.$root.labels.repeat_every_year)),
                        ]),
                        e._v(" "),
                        a("div", { staticClass: "am-legend-once" }, [
                          a("span", { staticClass: "type once" }),
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
          a(
            "div",
            { staticClass: "am-employee-days-off" },
            [
              a(
                "div",
                { staticClass: "am-dialog-table" },
                [
                  e.listedDaysOff.length > 0
                    ? a("h4", [e._v(e._s(e.$root.labels.employee_days_off))])
                    : e._e(),
                  e._v(" "),
                  a(
                    "el-row",
                    {
                      staticClass: "am-dialog-table-head days",
                      attrs: { gutter: 20 },
                    },
                    [
                      a("el-col", { attrs: { span: 12 } }, [
                        a("span", [e._v(e._s(e.$root.labels.date))]),
                      ]),
                      e._v(" "),
                      a("el-col", { attrs: { span: 12 } }, [
                        a("span", [e._v(e._s(e.$root.labels.day_off_name))]),
                      ]),
                    ],
                    1
                  ),
                  e._v(" "),
                  e._l(e.yearDaysOff, function (t, s) {
                    return a(
                      "el-row",
                      {
                        key: s,
                        staticClass: "am-day-off",
                        staticStyle: { "flex-wrap": "wrap" },
                        attrs: { gutter: 20, type: "flex", align: "middle" },
                      },
                      [
                        a(
                          "el-col",
                          { attrs: { xs: 12, sm: 12, md: 12 } },
                          [
                            a("span", {
                              staticClass: "type",
                              class: { repeat: t.repeat, once: !t.repeat },
                            }),
                            e._v(" "),
                            a(
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
                                a("span", [
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
                        a(
                          "el-col",
                          {
                            staticClass: "am-day-off__name-column",
                            attrs: { xs: 12, sm: 12, md: 8 },
                          },
                          [
                            a("span", { attrs: { title: t.name } }, [
                              e._v(e._s(t.name)),
                            ]),
                          ]
                        ),
                        e._v(" "),
                        a(
                          "el-col",
                          {
                            staticClass: "align-right",
                            attrs: { xs: 24, sm: 24, md: 4 },
                          },
                          [
                            a(
                              "div",
                              {
                                staticClass: "am-edit-element",
                                on: {
                                  click: function (a) {
                                    return e.editDayOff(t);
                                  },
                                },
                              },
                              [
                                a("img", {
                                  attrs: {
                                    src:
                                      e.$root.getUrl +
                                      "public/img/edit-pen.svg",
                                  },
                                }),
                              ]
                            ),
                            e._v(" "),
                            a(
                              "div",
                              {
                                staticClass: "am-delete-element",
                                on: {
                                  click: function (a) {
                                    return e.deleteDayOff(t);
                                  },
                                },
                              },
                              [a("i", { staticClass: "el-icon-minus" })]
                            ),
                          ]
                        ),
                      ],
                      1
                    );
                  }),
                  e._v(" "),
                  a(
                    "el-row",
                    [
                      a("el-col", [
                        a(
                          "div",
                          {
                            staticClass: "am-add-element",
                            on: { click: e.addDayOff },
                          },
                          [
                            a("i", { staticClass: "el-icon-plus" }),
                            a("span", { staticClass: "am-add-day-off" }, [
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
              a("transition", { attrs: { name: "fade" } }, [
                a(
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
                    a(
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
                        a(
                          "el-form-item",
                          {
                            attrs: {
                              label: e.$root.labels.day_off_name + ":",
                              prop: "dayOffName",
                            },
                          },
                          [
                            a("el-input", {
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
                        a(
                          "el-row",
                          { attrs: { gutter: 20 } },
                          [
                            a(
                              "el-col",
                              {
                                staticClass: "v-calendar-column",
                                attrs: { sm: 24 },
                              },
                              [
                                a(
                                  "el-form-item",
                                  {
                                    attrs: {
                                      label: e.$root.labels.date + ":",
                                      prop: "dayOffDates",
                                    },
                                  },
                                  [
                                    a("v-date-picker", {
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
                        a(
                          "el-row",
                          { attrs: { gutter: 20 } },
                          [
                            a(
                              "el-col",
                              { attrs: { sm: 12 } },
                              [
                                a(
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
                            a(
                              "el-col",
                              {
                                staticClass:
                                  "align-right am-day-off-add-buttons",
                                attrs: { sm: 12 },
                              },
                              [
                                a(
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
                                a(
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
            ? a("div", { staticClass: "am-company-days-off" }, [
                a(
                  "div",
                  { staticClass: "am-dialog-table" },
                  [
                    a("h4", [e._v(e._s(e.$root.labels.company_days_off))]),
                    e._v(" "),
                    a(
                      "el-row",
                      {
                        staticClass: "am-dialog-table-head days",
                        attrs: { gutter: 20 },
                      },
                      [
                        a("el-col", { attrs: { span: 12 } }, [
                          a("span", [e._v(e._s(e.$root.labels.date))]),
                        ]),
                        e._v(" "),
                        a("el-col", { attrs: { span: 12 } }, [
                          a("span", [e._v(e._s(e.$root.labels.day_off_name))]),
                        ]),
                      ],
                      1
                    ),
                    e._v(" "),
                    e._l(e.yearListedDaysOff, function (t, s) {
                      return a(
                        "el-row",
                        {
                          key: s,
                          staticClass: "am-day-off",
                          attrs: { gutter: 20, type: "flex", align: "middle" },
                        },
                        [
                          a("el-col", { attrs: { span: 12 } }, [
                            a("span", {
                              staticClass: "type",
                              class: { repeat: t.repeat, once: !t.repeat },
                            }),
                            e._v(" "),
                            a("span", [
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
                          a("el-col", { attrs: { span: 8 } }, [
                            a("span", [e._v(e._s(t.name))]),
                          ]),
                        ],
                        1
                      );
                    }),
                    e._v(" "),
                    e.allowEditCompanyDaysOff
                      ? a(
                          "el-row",
                          [
                            a("el-col", { attrs: { span: 24 } }, [
                              a(
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
  919: function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var s = a(687),
      o = a(337),
      i = a(692),
      n = a(920);
    t.default = {
      mixins: [n.a, s.a, o.a, i.a],
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
            a = this;
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
              .forEach(function (s) {
                (e.form.data.time[0] === s[0] &&
                  e.form.data.time[1] === s[1]) ||
                  t.push([
                    a.getStringTimeInSeconds(s[0]),
                    a.getStringTimeInSeconds(s[1]),
                  ]);
              }),
            t
          );
        },
        getDayHours: function (e) {
          var t = this,
            a = [];
          return (
            e.periods.forEach(function (e, t) {
              a.push({ index: t, type: "Work", data: e });
            }),
            e.breaks.forEach(function (e, t) {
              a.push({ index: t, type: "Break", data: e });
            }),
            a.sort(function (e, a) {
              return t
                .$moment(
                  "2000-01-01 " + e.data.time[0] + ":00",
                  "YYYY-MM-DD HH:mm:ss"
                )
                .diff(
                  t.$moment(
                    "2000-01-01 " + a.data.time[0] + ":00",
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
              this.categorizedServiceList.forEach(function (a) {
                a.serviceList.forEach(function (a) {
                  -1 !== e.indexOf(a.id) && t.push(a.name);
                });
              }),
            t
          );
        },
        selectAllInCategory: function (e, t) {
          var a = this.categorizedServiceList
            .find(function (e) {
              return e.id === t;
            })
            .serviceList.filter(function (e) {
              return e.state;
            })
            .map(function (e) {
              return e.id;
            });
          _.isEqual(_.intersection(a, e.serviceIds), a)
            ? (e.serviceIds = _.difference(e.serviceIds, a))
            : (e.serviceIds = _.uniq(e.serviceIds.concat(a)));
        },
        getTimeSelectOptionsForBreaks: function (e, t, a, s) {
          return {
            start: "00:00",
            end: "24:00",
            step: this.secondsToTimeSelectStep(this.getTimeSlotLength()),
            minTime: a || e,
            maxTime: s || t,
          };
        },
        editHours: function (e, t, a) {
          var s = this;
          switch (t) {
            case "Work":
              (e.form.show = !1),
                setTimeout(function () {
                  (e.form = {
                    data: e.periods[a],
                    oldData: JSON.parse(JSON.stringify(e.periods[a])),
                    isNew: !1,
                    type: "Work",
                    show: !0,
                    index: a,
                  }),
                    s.findFreePeriods(s.getWorkingPeriodsInSeconds(e));
                }, 200);
              break;
            case "Break":
              (e.form.show = !1),
                setTimeout(function () {
                  e.form = {
                    data: e.breaks[a],
                    oldData: JSON.parse(JSON.stringify(e.breaks[a])),
                    isNew: !1,
                    type: "Break",
                    show: !0,
                    index: a,
                  };
                }, 200);
          }
        },
        deleteHours: function (e, t, a) {
          switch (t) {
            case "Work":
              e.periods.splice(a, 1);
              break;
            case "Break":
              e.breaks.splice(a, 1);
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
          var a = JSON.parse(JSON.stringify(e.breaks));
          a.forEach(function (e) {
            e.id = null;
          }),
            this.weekSchedule.forEach(function (s) {
              (s.id = null),
                (s.periods = JSON.parse(JSON.stringify(t))),
                (s.breaks = JSON.parse(JSON.stringify(a))),
                (s.time = JSON.parse(JSON.stringify(e.time)));
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
  920: function (e, t, a) {
    "use strict";
    t.a = {
      data: function () {
        return { freePeriodsInSeconds: [0, 86400] };
      },
      methods: {
        startTimeChanged: function (e, t, a, s) {
          if (null === e) {
            s(null);
            var o = document.getElementsByClassName("time-select-item"),
              i = !0,
              n = !1,
              l = void 0;
            try {
              for (
                var r, c = o[Symbol.iterator]();
                !(i = (r = c.next()).done);
                i = !0
              )
                for (
                  var d = r.value,
                    m = this.getStringTimeInSeconds(d.innerHTML),
                    u = 0;
                  u < a.length;
                  u++
                )
                  if (m > a[u][0] && m < a[u][1]) {
                    (d.style.pointerEvents = "none"),
                      (d.style.color = "#DCDCDC");
                    break;
                  }
            } catch (e) {
              (n = !0), (l = e);
            } finally {
              try {
                !i && c.return && c.return();
              } finally {
                if (n) throw l;
              }
            }
          }
        },
        findFreePeriods: function (e) {
          for (var t = [], a = 0, s = 0; s < e.length; s++)
            a !== e[s][0] && t.push([a, e[s][0]]), (a = e[s][1]);
          86400 !== a && t.push([a, 86400]), (this.freePeriodsInSeconds = t);
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
        getPeriodBorderTime: function (e, t, a) {
          var s = null,
            o = null;
          if (null === e) return this.getBorderTime(s, o);
          for (
            var i = this.getStringTimeInSeconds(e), n = 0;
            n < this.freePeriodsInSeconds.length;
            n++
          )
            if (
              i >= this.freePeriodsInSeconds[n][0] &&
              i < this.freePeriodsInSeconds[n][1]
            ) {
              a
                ? ((s = this.secondsToTimeSelectStep(
                    this.freePeriodsInSeconds[n][0] - this.getTimeSlotLength()
                  )),
                  (o =
                    null !== t
                      ? t
                      : this.secondsToTimeSelectStep(
                          this.freePeriodsInSeconds[n][1] +
                            this.getTimeSlotLength()
                        )))
                : ((s = e),
                  (o = this.secondsToTimeSelectStep(
                    this.freePeriodsInSeconds[n][1] + this.getTimeSlotLength()
                  )));
              break;
            }
          return (
            null === s && null === o && (s = o = e), this.getBorderTime(s, o)
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
          a = e._self._c || t;
        return a(
          "div",
          { ref: "workingHours", staticClass: "am-working-hours" },
          e._l(e.weekSchedule, function (t, s) {
            return a(
              "div",
              { key: t.id, staticClass: "am-dialog-table" },
              [
                a(
                  "el-row",
                  { staticClass: "am-dialog-table-head hours" },
                  [
                    a("el-col", { attrs: { span: 12 } }, [
                      a("span", [e._v(e._s(t.day))]),
                    ]),
                    e._v(" "),
                    a(
                      "el-col",
                      { staticClass: "am-align-right", attrs: { span: 12 } },
                      [
                        0 === s
                          ? a(
                              "span",
                              {
                                staticClass: "am-add-element",
                                on: {
                                  click: function (a) {
                                    return e.applyToAllDays(t);
                                  },
                                },
                              },
                              [e._v(e._s(e.$root.labels.apply_to_all_days))]
                            )
                          : e._e(),
                        e._v(" "),
                        a(
                          "div",
                          {
                            staticClass: "am-add-element",
                            on: {
                              click: function (a) {
                                return e.showNewHoursForm(t);
                              },
                            },
                          },
                          [a("i", { staticClass: "el-icon-plus" })]
                        ),
                      ]
                    ),
                  ],
                  1
                ),
                e._v(" "),
                a("transition", { attrs: { name: "fade" } }, [
                  t.form.show
                    ? a(
                        "div",
                        { staticClass: "am-add-period" },
                        [
                          a(
                            "el-form",
                            {
                              ref: "workDay",
                              refInFor: !0,
                              attrs: { "label-position": "top", model: t },
                            },
                            [
                              t.form.isNew
                                ? a(
                                    "el-row",
                                    {
                                      staticClass: "am-add-period-type",
                                      attrs: { gutter: 10 },
                                    },
                                    [
                                      a(
                                        "el-col",
                                        [
                                          a(
                                            "el-radio",
                                            {
                                              attrs: { label: "Work" },
                                              model: {
                                                value: t.form.type,
                                                callback: function (a) {
                                                  e.$set(t.form, "type", a);
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
                                          a(
                                            "el-radio",
                                            {
                                              attrs: { label: "Break" },
                                              model: {
                                                value: t.form.type,
                                                callback: function (a) {
                                                  e.$set(t.form, "type", a);
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
                                ? a(
                                    "el-row",
                                    {
                                      staticStyle: { "flex-wrap": "wrap" },
                                      attrs: { gutter: 10, type: "flex" },
                                    },
                                    [
                                      a(
                                        "el-col",
                                        {
                                          attrs: {
                                            span: e.responsiveGrid.editHours
                                              .workHours,
                                          },
                                        },
                                        [
                                          a(
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
                                              a(
                                                "el-col",
                                                {
                                                  staticStyle: {
                                                    "margin-bottom": "4px",
                                                  },
                                                  attrs: { span: 24 },
                                                },
                                                [
                                                  a("span", [
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
                                              a(
                                                "el-col",
                                                {
                                                  attrs: {
                                                    span: e.responsiveGrid
                                                      .editHours.hour,
                                                  },
                                                },
                                                [
                                                  a(
                                                    "el-form-item",
                                                    {
                                                      attrs: {
                                                        rules:
                                                          e.rules.startTime,
                                                        prop: "form.data.time.0",
                                                      },
                                                    },
                                                    [
                                                      a("el-time-select", {
                                                        staticStyle: {
                                                          "margin-bottom":
                                                            "12px",
                                                        },
                                                        attrs: {
                                                          "picker-options":
                                                            e.getPeriodBorderTime(
                                                              t.form.data
                                                                .time[0],
                                                              t.form.data
                                                                .time[1],
                                                              !0
                                                            ),
                                                          size: "mini",
                                                        },
                                                        on: {
                                                          change: function (a) {
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
                                                          focus: function (a) {
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
                                                            a
                                                          ) {
                                                            e.$set(
                                                              t.form.data.time,
                                                              0,
                                                              a
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
                                              a(
                                                "el-col",
                                                {
                                                  attrs: {
                                                    span: e.responsiveGrid
                                                      .editHours.hour,
                                                  },
                                                },
                                                [
                                                  a(
                                                    "el-form-item",
                                                    {
                                                      attrs: {
                                                        rules: e.rules.endTime,
                                                        prop: "form.data.time.1",
                                                      },
                                                    },
                                                    [
                                                      a("el-time-select", {
                                                        staticStyle: {
                                                          "margin-bottom":
                                                            "12px",
                                                        },
                                                        attrs: {
                                                          "picker-options":
                                                            e.getPeriodBorderTime(
                                                              t.form.data
                                                                .time[0],
                                                              t.form.data
                                                                .time[1],
                                                              !1
                                                            ),
                                                          size: "mini",
                                                          disabled:
                                                            null ===
                                                            t.form.data.time[0],
                                                        },
                                                        model: {
                                                          value:
                                                            t.form.data.time[1],
                                                          callback: function (
                                                            a
                                                          ) {
                                                            e.$set(
                                                              t.form.data.time,
                                                              1,
                                                              a
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
                                          ),
                                        ],
                                        1
                                      ),
                                      e._v(" "),
                                      e.categorizedServiceList &&
                                      e.servicesCount > 1
                                        ? a(
                                            "el-col",
                                            {
                                              attrs: {
                                                span: e.responsiveGrid.editHours
                                                  .services,
                                              },
                                            },
                                            [
                                              a(
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
                                                  a(
                                                    "el-col",
                                                    {
                                                      staticStyle: {
                                                        "margin-bottom": "4px",
                                                      },
                                                      attrs: { span: 24 },
                                                    },
                                                    [
                                                      a("span", [
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
                                                      a(
                                                        "el-tooltip",
                                                        {
                                                          attrs: {
                                                            placement: "top",
                                                          },
                                                        },
                                                        [
                                                          a("div", {
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
                                                          a("i", {
                                                            staticClass:
                                                              "el-icon-question am-tooltip-icon",
                                                          }),
                                                        ]
                                                      ),
                                                    ],
                                                    1
                                                  ),
                                                  e._v(" "),
                                                  a(
                                                    "el-col",
                                                    { attrs: { span: 24 } },
                                                    [
                                                      a(
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
                                                              a
                                                            ) {
                                                              e.$set(
                                                                t.form.data,
                                                                "serviceIds",
                                                                a
                                                              );
                                                            },
                                                            expression:
                                                              "workDay.form.data.serviceIds",
                                                          },
                                                        },
                                                        e._l(
                                                          e.categorizedServiceList,
                                                          function (s) {
                                                            return s.serviceList.filter(
                                                              function (e) {
                                                                return e.state;
                                                              }
                                                            ).length > 0
                                                              ? a(
                                                                  "div",
                                                                  { key: s.id },
                                                                  [
                                                                    a(
                                                                      "div",
                                                                      {
                                                                        staticClass:
                                                                          "am-drop-parent",
                                                                        on: {
                                                                          click:
                                                                            function (
                                                                              a
                                                                            ) {
                                                                              return e.selectAllInCategory(
                                                                                t
                                                                                  .form
                                                                                  .data,
                                                                                s.id
                                                                              );
                                                                            },
                                                                        },
                                                                      },
                                                                      [
                                                                        a(
                                                                          "span",
                                                                          [
                                                                            e._v(
                                                                              e._s(
                                                                                s.name
                                                                              )
                                                                            ),
                                                                          ]
                                                                        ),
                                                                      ]
                                                                    ),
                                                                    e._v(" "),
                                                                    e._l(
                                                                      s.serviceList,
                                                                      function (
                                                                        t
                                                                      ) {
                                                                        return t.state
                                                                          ? a(
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
                                        ? a(
                                            "el-col",
                                            {
                                              attrs: {
                                                span: e.responsiveGrid.editHours
                                                  .location,
                                              },
                                            },
                                            [
                                              a(
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
                                                  a(
                                                    "el-col",
                                                    {
                                                      staticStyle: {
                                                        "margin-bottom": "4px",
                                                      },
                                                      attrs: { span: 24 },
                                                    },
                                                    [
                                                      a("span", [
                                                        e._v(
                                                          e._s(
                                                            e.$root.labels
                                                              .location
                                                          )
                                                        ),
                                                      ]),
                                                      e._v(" "),
                                                      a(
                                                        "el-tooltip",
                                                        {
                                                          attrs: {
                                                            placement: "top",
                                                          },
                                                        },
                                                        [
                                                          a("div", {
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
                                                          a("i", {
                                                            staticClass:
                                                              "el-icon-question am-tooltip-icon",
                                                          }),
                                                        ]
                                                      ),
                                                    ],
                                                    1
                                                  ),
                                                  e._v(" "),
                                                  a(
                                                    "el-col",
                                                    { attrs: { span: 24 } },
                                                    [
                                                      a(
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
                                                              a
                                                            ) {
                                                              e.$set(
                                                                t.form.data,
                                                                "locationId",
                                                                a
                                                              );
                                                            },
                                                            expression:
                                                              "workDay.form.data.locationId",
                                                          },
                                                        },
                                                        e._l(
                                                          e.locations,
                                                          function (e) {
                                                            return a(
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
                                ? a(
                                    "el-row",
                                    { attrs: { gutter: 10 } },
                                    [
                                      a(
                                        "el-col",
                                        {
                                          staticStyle: {
                                            "margin-bottom": "4px",
                                          },
                                          attrs: { span: 24 },
                                        },
                                        [
                                          a("span", [
                                            e._v(
                                              e._s(e.$root.labels.break_hours)
                                            ),
                                          ]),
                                        ]
                                      ),
                                      e._v(" "),
                                      a(
                                        "p",
                                        { staticStyle: { display: "none" } },
                                        [e._v(e._s(e.$root.labels.break_hours))]
                                      ),
                                      e._v(" "),
                                      a(
                                        "el-col",
                                        { attrs: { span: 12 } },
                                        [
                                          a(
                                            "el-form-item",
                                            {
                                              attrs: {
                                                rules: e.rules.startTime,
                                                prop: "form.data.time.0",
                                              },
                                            },
                                            [
                                              a("el-time-select", {
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
                                                  callback: function (a) {
                                                    e.$set(
                                                      t.form.data.time,
                                                      0,
                                                      a
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
                                      a(
                                        "el-col",
                                        { attrs: { span: 12 } },
                                        [
                                          a(
                                            "el-form-item",
                                            {
                                              attrs: {
                                                rules: e.rules.endTime,
                                                prop: "form.data.time.1",
                                              },
                                            },
                                            [
                                              a("el-time-select", {
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
                                                  callback: function (a) {
                                                    e.$set(
                                                      t.form.data.time,
                                                      1,
                                                      a
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
                              a(
                                "div",
                                { staticClass: "am-working-hours-buttons" },
                                [
                                  a(
                                    "div",
                                    { staticClass: "align-left" },
                                    [
                                      a(
                                        "el-button",
                                        {
                                          attrs: { size: "small" },
                                          on: {
                                            click: function (a) {
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
                                      a(
                                        "el-button",
                                        {
                                          attrs: {
                                            size: "small",
                                            type: "primary",
                                          },
                                          on: {
                                            click: function (a) {
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
                a(
                  "transition-group",
                  { attrs: { name: "fade", tag: "div" } },
                  e._l(e.getDayHours(t), function (o, i) {
                    return a(
                      "div",
                      { key: i + 1, staticClass: "am-period" },
                      [
                        a(
                          "el-row",
                          { attrs: { gutter: 10, type: "flex" } },
                          [
                            a(
                              "el-col",
                              {
                                attrs: { span: e.responsiveGrid.periods.hours },
                              },
                              [
                                a(
                                  "el-row",
                                  { attrs: { gutter: 10 } },
                                  [
                                    a("el-col", { attrs: { span: 24 } }, [
                                      a(
                                        "span",
                                        {
                                          class: {
                                            "am-period-break":
                                              "Break" === o.type,
                                          },
                                        },
                                        [
                                          e._v(
                                            e._s(o.data.time[0]) +
                                              " - " +
                                              e._s(o.data.time[1])
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
                            a(
                              "el-col",
                              {
                                staticClass: "am-flexed2 am-period__services",
                                attrs: {
                                  span: e.responsiveGrid.periods.services,
                                },
                              },
                              [
                                "Work" === o.type &&
                                o.data.serviceIds.length > 0
                                  ? a(
                                      "span",
                                      { staticClass: "am-overflow-ellipsis" },
                                      [
                                        a(
                                          "span",
                                          {
                                            ref: "serviceName-" + s + "-" + i,
                                            refInFor: !0,
                                            attrs: {
                                              title: e
                                                .getServicesNames(
                                                  o.data.serviceIds
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
                                                      o.data.serviceIds
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
                            a(
                              "el-col",
                              {
                                staticClass: "am-flexed2 am-period__locations",
                                attrs: {
                                  span: e.responsiveGrid.periods.locations,
                                },
                              },
                              [
                                "Work" === o.type
                                  ? a(
                                      "span",
                                      {
                                        staticClass: "am-overflow-ellipsis",
                                        attrs: {
                                          title: e.getPeriodLocationName(o),
                                        },
                                      },
                                      [
                                        e._v(
                                          "\n              " +
                                            e._s(e.getPeriodLocationName(o)) +
                                            "\n            "
                                        ),
                                      ]
                                    )
                                  : e._e(),
                              ]
                            ),
                            e._v(" "),
                            a(
                              "el-col",
                              {
                                staticClass: "am-flexed2",
                                class: {
                                  mobile: 24 === e.responsiveGrid.periods.edit,
                                },
                                attrs: { span: e.responsiveGrid.periods.edit },
                              },
                              [
                                a(
                                  "div",
                                  {
                                    staticClass: "am-edit-element",
                                    on: {
                                      click: function (a) {
                                        return e.editHours(t, o.type, o.index);
                                      },
                                    },
                                  },
                                  [
                                    a("img", {
                                      attrs: {
                                        src:
                                          e.$root.getUrl +
                                          "public/img/edit-pen.svg",
                                      },
                                    }),
                                  ]
                                ),
                                e._v(" "),
                                a(
                                  "div",
                                  {
                                    staticClass: "am-delete-element",
                                    on: {
                                      click: function (a) {
                                        return e.deleteHours(
                                          t,
                                          o.type,
                                          o.index
                                        );
                                      },
                                    },
                                  },
                                  [a("i", { staticClass: "el-icon-minus" })]
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
  952: function (e, t, a) {
    var s = a(685)(a(953), a(954), !1, null, null, null);
    e.exports = s.exports;
  },
  953: function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var s = a(906),
      o = a.n(s),
      i = a(907),
      n = a.n(i),
      l = a(687),
      r = a(337),
      c = a(692);
    t.default = {
      mixins: [l.a, r.a, c.a],
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
          this.weekScheduleSettings.forEach(function (a) {
            var s = [],
              o = [],
              i = 86400,
              n = 0;
            a.breaks.forEach(function (e) {
              e.time.length &&
                e.time[0] &&
                e.time[1] &&
                o.push({ time: [e.time[0], e.time[1]] });
            }),
              "periods" in a &&
                a.periods.length &&
                a.periods.forEach(function (e) {
                  var a = t.getStringTimeInSeconds(e.time[0]),
                    o = t.getStringTimeInSeconds(e.time[1]);
                  (i = a < i ? a : i),
                    (n = o > n ? o : n),
                    e.time.length &&
                      e.time[0] &&
                      e.time[1] &&
                      s.push({ time: [e.time[0], e.time[1]] });
                }),
              e.push({
                day: a.day,
                time: [
                  s.length ? t.secondsToTimeSelectStep(i) : null,
                  s.length ? t.secondsToTimeSelectStep(n) : null,
                ],
                periods: s,
                breaks: o,
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
            var a = e[t];
            this.weekSchedule[t].day = this.$root.labels[a];
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
      components: { DaysOff: o.a, WorkingHours: n.a },
    };
  },
  954: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("div", [
          a(
            "div",
            { staticClass: "am-dialog-scrollable" },
            [
              a(
                "div",
                { staticClass: "am-dialog-header" },
                [
                  a(
                    "el-row",
                    [
                      a("el-col", { attrs: { span: 20 } }, [
                        e.showWorkingHoursOnly
                          ? a("h2", [
                              e._v(
                                "\n            " +
                                  e._s(
                                    e.$root.labels.company_work_hours_settings
                                  ) +
                                  "\n          "
                              ),
                            ])
                          : e.showDaysOffOnly
                          ? a("h2", [
                              e._v(
                                "\n            " +
                                  e._s(
                                    e.$root.labels.company_days_off_settings
                                  ) +
                                  "\n          "
                              ),
                            ])
                          : a("h2", [
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
                      a(
                        "el-col",
                        { staticClass: "align-right", attrs: { span: 4 } },
                        [
                          a("el-button", {
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
              a(
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
                    ? a(
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
                          a(
                            "el-tab-pane",
                            {
                              attrs: {
                                label: e.$root.labels.work_hours,
                                name: "hours",
                              },
                            },
                            [
                              a("working-hours", {
                                attrs: { weekSchedule: e.weekScheduleSettings },
                              }),
                            ],
                            1
                          ),
                          e._v(" "),
                          a(
                            "el-tab-pane",
                            {
                              attrs: {
                                label: e.$root.labels.days_off,
                                name: "off",
                              },
                            },
                            [
                              a("days-off", {
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
                    ? a("working-hours", {
                        attrs: {
                          weekSchedule: e.weekScheduleSettings,
                          categorizedServiceList: [],
                          locations: [],
                        },
                      })
                    : e._e(),
                  e._v(" "),
                  e.showDaysOffOnly
                    ? a("days-off", {
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
          a("div", { staticClass: "am-dialog-footer" }, [
            a(
              "div",
              { staticClass: "am-dialog-footer-actions" },
              [
                a(
                  "el-row",
                  [
                    a(
                      "el-col",
                      { staticClass: "align-right", attrs: { sm: 24 } },
                      [
                        a(
                          "el-button",
                          { attrs: { type: "" }, on: { click: e.closeDialog } },
                          [e._v(e._s(e.$root.labels.cancel))]
                        ),
                        e._v(" "),
                        a(
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
  955: function (e, t, a) {
    var s = a(685)(a(956), a(957), !1, null, null, null);
    e.exports = s.exports;
  },
  956: function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var s = {
        street_number: "short_name",
        route: "long_name",
        locality: "long_name",
        administrative_area_level_1: "short_name",
        administrative_area_level_2: "county",
        country: "long_name",
        postal_code: "short_name",
      },
      o = ["locality", "administrative_area_level_3"],
      i = [
        "locality",
        "sublocality",
        "postal_code",
        "country",
        "administrative_area_level_1",
        "administrative_area_level_2",
      ];
    t.default = {
      name: "VueGoogleAutocomplete",
      props: {
        id: { type: String, required: !0 },
        classname: String,
        placeholder: { type: String, default: "Start typing" },
        types: { type: String, default: "address" },
        country: { type: [String, Array], default: null },
        enableGeolocation: { type: Boolean, default: !1 },
        geolocationOptions: { type: Object, default: null },
      },
      data: function () {
        return {
          autocomplete: null,
          autocompleteText: "",
          geolocation: { geocoder: null, loc: null, position: null },
        };
      },
      watch: {
        autocompleteText: function (e, t) {
          this.$emit("inputChange", { newVal: e, oldVal: t }, this.id);
        },
        country: function (e, t) {
          this.autocomplete.setComponentRestrictions({
            country: null === this.country ? [] : this.country,
          });
        },
      },
      mounted: function () {
        var e = {};
        this.types && (e.types = [this.types]),
          this.country && (e.componentRestrictions = { country: this.country }),
          (this.autocomplete = new google.maps.places.Autocomplete(
            document.getElementById(this.id),
            e
          )),
          this.autocomplete.addListener("place_changed", this.onPlaceChanged);
      },
      methods: {
        onPlaceChanged: function () {
          var e = this.autocomplete.getPlace();
          e.geometry
            ? void 0 !== e.address_components &&
              (this.$emit("placechanged", this.formatResult(e), e, this.id),
              (this.autocompleteText = document.getElementById(this.id).value),
              this.onChange())
            : this.$emit("no-results-found", e, this.id);
        },
        onFocus: function () {
          this.biasAutocompleteLocation(), this.$emit("focus");
        },
        onBlur: function () {
          this.$emit("blur");
        },
        onChange: function () {
          this.$emit("change", this.autocompleteText);
        },
        onKeyPress: function (e) {
          this.$emit("keypress", e);
        },
        onKeyUp: function (e) {
          this.$emit("keyup", e);
        },
        clear: function () {
          this.autocompleteText = "";
        },
        focus: function () {
          this.$refs.autocomplete.focus();
        },
        blur: function () {
          this.$refs.autocomplete.blur();
        },
        update: function (e) {
          this.autocompleteText = e;
        },
        updateCoordinates: function (e) {
          var t = this;
          (e || e.lat || e.lng) &&
            (this.geolocation.geocoder ||
              (this.geolocation.geocoder = new google.maps.Geocoder()),
            this.geolocation.geocoder.geocode({ location: e }, function (e, a) {
              "OK" === a
                ? (e = t.filterGeocodeResultTypes(e))[0]
                  ? (t.$emit("placechanged", t.formatResult(e[0]), e[0], t.id),
                    t.update(e[0].formatted_address))
                  : t.$emit("error", "no result for provided coordinates")
                : t.$emit("error", "error getting address from coords");
            }));
        },
        geolocate: function () {
          var e = this;
          this.updateGeolocation(function (t, a) {
            e.updateCoordinates(t);
          });
        },
        updateGeolocation: function () {
          var e = this,
            t =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : null;
          if (navigator.geolocation) {
            var a = {};
            this.geolocationOptions &&
              Object.assign(a, this.geolocationOptions),
              navigator.geolocation.getCurrentPosition(
                function (a) {
                  var s = { lat: a.coords.latitude, lng: a.coords.longitude };
                  (e.geolocation.loc = s),
                    (e.geolocation.position = a),
                    t && t(s, a);
                },
                function (t) {
                  e.$emit("error", "Cannot get Coordinates from navigator", t);
                },
                a
              );
          }
        },
        biasAutocompleteLocation: function () {
          var e = this;
          this.enableGeolocation &&
            this.updateGeolocation(function (t, a) {
              var s = new google.maps.Circle({
                center: t,
                radius: a.coords.accuracy,
              });
              e.autocomplete.setBounds(s.getBounds());
            });
        },
        formatResult: function (e) {
          for (var t = {}, a = 0; a < e.address_components.length; a++) {
            var o = e.address_components[a].types[0];
            if (s[o]) {
              var i = e.address_components[a][s[o]];
              t[o] = i;
            }
          }
          return (
            (t.latitude = e.geometry.location.lat()),
            (t.longitude = e.geometry.location.lng()),
            t
          );
        },
        filterGeocodeResultTypes: function (e) {
          if (!e || !this.types) return e;
          var t = [],
            a = [this.types];
          a.includes("(cities)") && (a = a.concat(o)),
            a.includes("(regions)") && (a = a.concat(i));
          var s = !0,
            n = !1,
            l = void 0;
          try {
            for (
              var r, c = e[Symbol.iterator]();
              !(s = (r = c.next()).done);
              s = !0
            ) {
              var d = r.value,
                m = !0,
                u = !1,
                p = void 0;
              try {
                for (
                  var g, h = d.types[Symbol.iterator]();
                  !(m = (g = h.next()).done);
                  m = !0
                ) {
                  var v = g.value;
                  if (a.includes(v)) {
                    t.push(d);
                    break;
                  }
                }
              } catch (e) {
                (u = !0), (p = e);
              } finally {
                try {
                  !m && h.return && h.return();
                } finally {
                  if (u) throw p;
                }
              }
            }
          } catch (e) {
            (n = !0), (l = e);
          } finally {
            try {
              !s && c.return && c.return();
            } finally {
              if (n) throw l;
            }
          }
          return t;
        },
      },
    };
  },
  957: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement;
        return (e._self._c || t)("input", {
          directives: [
            {
              name: "model",
              rawName: "v-model",
              value: e.autocompleteText,
              expression: "autocompleteText",
            },
          ],
          ref: "autocomplete",
          class: e.classname,
          attrs: { type: "text", id: e.id, placeholder: e.placeholder },
          domProps: { value: e.autocompleteText },
          on: {
            focus: function (t) {
              return e.onFocus();
            },
            blur: function (t) {
              return e.onBlur();
            },
            change: e.onChange,
            keypress: e.onKeyPress,
            keyup: e.onKeyUp,
            input: function (t) {
              t.target.composing || (e.autocompleteText = t.target.value);
            },
          },
        });
      },
      staticRenderFns: [],
    };
  },
  958: function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var s = a(909),
      o = a(689);
    t.default = {
      mixins: [s.a, o.a],
      props: {
        placeholdersNames: {
          default: function () {
            return [];
          },
        },
        excludedPlaceholders: {
          default: function () {
            return [];
          },
        },
        categories: {
          default: function () {
            return [];
          },
        },
        coupons: {
          default: function () {
            return [];
          },
        },
        customFields: {
          default: function () {
            return [];
          },
        },
        userTypeTab: null,
      },
      data: function () {
        return {};
      },
      mounted: function () {
        this.setPlaceholders(this.excludedPlaceholders);
      },
      methods: {},
      computed: {},
      watch: {
        excludedPlaceholders: function () {
          this.setPlaceholders(this.excludedPlaceholders);
        },
      },
    };
  },
  959: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a(
          "div",
          [
            a(
              "el-row",
              { staticClass: "am-notifications-placeholders" },
              [
                a("el-col", { attrs: { sm: 24 } }, [
                  a(
                    "div",
                    { staticClass: "am-placeholder-wrapper" },
                    e._l(e.placeholdersNames, function (t, s) {
                      return t in e.groupedPlaceholders &&
                        e.groupedPlaceholders[t].length
                        ? a(
                            "el-dropdown",
                            {
                              key: s,
                              staticClass: "am-placeholder-wrapper__dropdown",
                            },
                            [
                              a(
                                "el-button",
                                {
                                  staticClass: "am-placeholder-wrapper__button",
                                  attrs: { size: "small" },
                                },
                                [
                                  e._v(
                                    "\n              " + e._s(e.$root.labels[t])
                                  ),
                                  a("i", {
                                    staticClass:
                                      "el-icon-arrow-down el-icon--right",
                                  }),
                                ]
                              ),
                              e._v(" "),
                              a(
                                "el-dropdown-menu",
                                {
                                  class: {
                                    "amelia-dropdown":
                                      e.groupedPlaceholders[t].length > 20,
                                  },
                                  attrs: { slot: "dropdown" },
                                  slot: "dropdown",
                                },
                                e._l(e.groupedPlaceholders[t], function (s, o) {
                                  return t in e.excludedPlaceholders &&
                                    -1 !==
                                      e.excludedPlaceholders[t].indexOf(s.value)
                                    ? e._e()
                                    : a(
                                        "el-dropdown-item",
                                        { key: o },
                                        [
                                          a(
                                            "el-tooltip",
                                            {
                                              key: s.code,
                                              attrs: {
                                                effect: "dark",
                                                content: s.label,
                                                placement: "left",
                                              },
                                            },
                                            [
                                              a(
                                                "p",
                                                {
                                                  on: {
                                                    click: function (t) {
                                                      e.copyCodeText(
                                                        "parse" in s
                                                          ? e.getParsedCodeLabel(
                                                              s
                                                            )
                                                          : s.value
                                                      );
                                                    },
                                                  },
                                                },
                                                [
                                                  e._v(
                                                    "\n                    " +
                                                      e._s(s.value) +
                                                      "\n                  "
                                                  ),
                                                ]
                                              ),
                                            ]
                                          ),
                                        ],
                                        1
                                      );
                                }),
                                1
                              ),
                            ],
                            1
                          )
                        : e._e();
                    }),
                    1
                  ),
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
  966: function (e, t, a) {
    var s = a(685)(a(967), a(968), !1, null, null, null);
    e.exports = s.exports;
  },
  967: function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.default = {
        props: { callbackDialog: "" },
        data: function () {
          return { selectedLanguage: null };
        },
        methods: {
          languageChanged: function () {
            this.$emit("languageChanged", this.selectedLanguage);
          },
          getLanguageLabel: function (e) {
            return this.$root.languages[e] ? this.$root.languages[e].name : "";
          },
          getLanguageFlag: function (e) {
            return e &&
              this.$root.languages[e] &&
              this.$root.languages[e].country_code
              ? this.$root.getUrl +
                  "public/img/flags/" +
                  this.$root.languages[e].country_code +
                  ".png"
              : this.$root.getUrl + "public/img/grey.svg";
          },
        },
      });
  },
  968: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a(
          "div",
          { staticClass: "am-select-translate" },
          [
            a(
              "el-select",
              {
                staticClass: "select-languages",
                attrs: {
                  placeholder: e.$root.labels.language,
                  clearable: "",
                  filterable: "",
                },
                on: { change: e.languageChanged },
                model: {
                  value: e.selectedLanguage,
                  callback: function (t) {
                    e.selectedLanguage = t;
                  },
                  expression: "selectedLanguage",
                },
              },
              [
                e.callbackDialog
                  ? a("li", { staticClass: "el-select-dropdown__item" }, [
                      a("span", [
                        a("img", {
                          staticClass: "option-languages-flag",
                          attrs: {
                            src: e.$root.getUrl + "public/img/translate.svg",
                          },
                        }),
                        e._v(
                          "\n        " +
                            e._s(e.$root.labels.manage_languages) +
                            "\n      "
                        ),
                      ]),
                    ])
                  : e._e(),
                e._v(" "),
                e.callbackDialog &&
                e.$root.settings.general.usedLanguages.length > 0
                  ? a("hr")
                  : e._e(),
                e._v(" "),
                a("template", { slot: "prefix" }, [
                  a("img", {
                    staticClass: "select-languages-flag",
                    attrs: { src: e.getLanguageFlag(e.selectedLanguage) },
                  }),
                ]),
                e._v(" "),
                e._l(e.$root.settings.general.usedLanguages, function (t, s) {
                  return a(
                    "el-option",
                    {
                      key: s,
                      attrs: { label: e.getLanguageLabel(t), value: t },
                    },
                    [
                      a("span", [
                        a("img", {
                          staticClass: "option-languages-flag",
                          attrs: { src: e.getLanguageFlag(t) },
                        }),
                        e._v(
                          "\n        " +
                            e._s(e.getLanguageLabel(t)) +
                            "\n      "
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
        );
      },
      staticRenderFns: [],
    };
  },
});
