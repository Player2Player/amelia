wpJsonpAmeliaBookingPlugin([18], {
  1031: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = o(826),
      n = o.n(a),
      i = o(829),
      s = o.n(i),
      r = o(717),
      l = o.n(r),
      c = o(687),
      u = o(337),
      m = o(691),
      d = o(883),
      p = o(743),
      h = o(922),
      f = o.n(h),
      v = o(790),
      g = o.n(v);
    t.default = {
      mixins: [c.a, u.a, m.a, d.a, p.a],
      data: function () {
        return {
          checkCustomerData: { toaster: !1, allChecked: !1 },
          fetchedFiltered: !1,
          customers: [],
          dialogExport: !1,
          isIndeterminate: !0,
          customer: null,
          fetched: !1,
          params: { page: 1, sort: "", search: "" },
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
                label: this.$root.labels.last_appointment,
                value: "lastAppointment",
                checked: !0,
              },
              {
                label: this.$root.labels.total_appointments,
                value: "totalAppointments",
                checked: !0,
              },
              {
                label: this.$root.labels.pending_appointments,
                value: "pendingAppointments",
                checked: !0,
              },
            ],
          },
          exportAction: "",
          searchPlaceholder: this.$root.labels.customers_search_placeholder,
          timer: null,
          options: {
            filteredCount: 0,
            fetched: !1,
            count: 0,
            sort: [
              { value: "customer", label: this.$root.labels.name_ascending },
              { value: "-customer", label: this.$root.labels.name_descending },
              {
                value: "last-appointment",
                label: this.$root.labels.last_appointment_ascending,
              },
              {
                value: "-last-appointment",
                label: this.$root.labels.last_appointment_descending,
              },
            ],
          },
        };
      },
      created: function () {
        this.fetchData();
      },
      mounted: function () {
        this.inlineSVG();
      },
      methods: {
        fetchData: function () {
          (this.fetched = !1), this.getCustomers();
        },
        filterData: function () {
          (this.fetchedFiltered = !1), this.getCustomers();
        },
        getCustomers: function () {
          var e = this;
          Object.keys(this.params).forEach(function (t) {
            return !e.params[t] && delete e.params[t];
          }),
            this.$http
              .get(this.$root.getAjaxUrl + "/users/customers", {
                params: this.params,
              })
              .then(function (t) {
                var o = t.data.data.users;
                o.forEach(function (e) {
                  e.checked = !1;
                }),
                  (e.customers = o),
                  (e.options.count = t.data.data.totalCount),
                  (e.options.filteredCount = t.data.data.filteredCount),
                  (e.fetched = !0),
                  (e.fetchedFiltered = !0);
              })
              .catch(function (t) {
                console.log(t.message),
                  (e.fetched = !0),
                  (e.fetchedFiltered = !0);
              });
        },
        showDialogNewCustomer: function () {
          (this.customer = this.getInitCustomerObject()),
            (this.dialogCustomer = !0);
        },
        showDialogEditCustomer: function (e) {
          (this.customer = this.customers[e]), (this.dialogCustomer = !0);
        },
        updateCustomerCallback: function () {
          (this.dialogCustomer = !1), (this.allChecked = !1), this.fetchData();
        },
        groupDeleteCallback: function () {
          (this.checkCustomerData.allChecked = !1),
            (this.checkCustomerData.toaster = !1),
            this.fetchData();
        },
      },
      computed: {
        filterApplied: function () {
          return !!this.params.search;
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
        DialogCustomer: n.a,
        DialogExport: s.a,
        GroupDelete: f.a,
        PaginationBlock: g.a,
      },
    };
  },
  1032: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = this,
          o = t.$createElement,
          a = t._self._c || o;
        return a("div", { staticClass: "am-wrap" }, [
          a(
            "div",
            { staticClass: "am-body", attrs: { id: "am-customers" } },
            [
              a("page-header", {
                attrs: { customersTotal: t.options.count },
                on: {
                  newCustomerBtnClicked: function (e) {
                    return t.showDialogNewCustomer();
                  },
                },
              }),
              t._v(" "),
              a(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: !t.fetched,
                      expression: "!fetched",
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
              0 === t.customers.length &&
              !t.filterApplied &&
              t.fetchedFiltered
                ? a("div", { staticClass: "am-empty-state am-section" }, [
                    a("img", {
                      attrs: {
                        src: t.$root.getUrl + "public/img/emptystate.svg",
                      },
                    }),
                    t._v(" "),
                    a("h2", [t._v(t._s(t.$root.labels.no_customers_yet))]),
                    t._v(" "),
                    a("p", [t._v(t._s(t.$root.labels.click_add_customers))]),
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
                        (0 !== t.customers.length ||
                          (0 === t.customers.length && t.filterApplied) ||
                          !t.fetchedFiltered),
                      expression:
                        "fetched && (customers.length !== 0 || customers.length === 0 && filterApplied || !fetchedFiltered)",
                    },
                  ],
                },
                [
                  a(
                    "div",
                    { staticClass: "am-customers-filter am-section" },
                    [
                      a(
                        "el-form",
                        {
                          staticClass: "demo-form-inline",
                          attrs: { action: t.exportAction, method: "POST" },
                        },
                        [
                          a(
                            "el-row",
                            { attrs: { gutter: 16 } },
                            [
                              a("el-col", { attrs: { md: 18 } }, [
                                a(
                                  "div",
                                  { staticClass: "am-search" },
                                  [
                                    a("el-input", {
                                      attrs: {
                                        placeholder: t.searchPlaceholder,
                                        name: "search",
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
                              ]),
                              t._v(" "),
                              a("transition", { attrs: { name: "fade" } }, [
                                a(
                                  "div",
                                  [
                                    a(
                                      "el-col",
                                      { attrs: { md: 6 } },
                                      [
                                        a(
                                          "el-form-item",
                                          [
                                            a(
                                              "el-select",
                                              {
                                                staticClass: "calc-width sort",
                                                attrs: {
                                                  placeholder:
                                                    t.$root.labels.sort,
                                                  name: "sort",
                                                  clearable: "",
                                                },
                                                on: { change: t.filterData },
                                                model: {
                                                  value: t.params.sort,
                                                  callback: function (e) {
                                                    t.$set(t.params, "sort", e);
                                                  },
                                                  expression: "params.sort",
                                                },
                                              },
                                              t._l(
                                                t.options.sort,
                                                function (e) {
                                                  return a("el-option", {
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
                              t._v(" "),
                              a(
                                "div",
                                [
                                  a(
                                    "el-tooltip",
                                    { attrs: { placement: "top" } },
                                    [
                                      a("div", {
                                        attrs: { slot: "content" },
                                        domProps: {
                                          innerHTML: t._s(
                                            t.$root.labels
                                              .export_tooltip_customers
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
                                              alt: "Export",
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
                                            "/report/customers",
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
                            0 === t.customers.length &&
                            t.filterApplied &&
                            t.fetchedFiltered,
                          expression:
                            "fetched && customers.length === 0 && filterApplied && fetchedFiltered",
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
                          value: t.fetchedFiltered && 0 !== t.customers.length,
                          expression:
                            "fetchedFiltered && customers.length !== 0",
                        },
                      ],
                      staticClass: "am-customers am-section",
                    },
                    [
                      a(
                        "div",
                        { staticClass: "am-customers-list-head" },
                        [
                          a(
                            "el-row",
                            [
                              a(
                                "el-col",
                                { attrs: { lg: 12 } },
                                [
                                  a(
                                    "el-row",
                                    {
                                      staticClass:
                                        "am-customers-flex-row-middle-align",
                                      attrs: { gutter: 10 },
                                    },
                                    [
                                      !0 ===
                                      t.$root.settings.capabilities.canDelete
                                        ? a(
                                            "el-col",
                                            { attrs: { lg: 2, md: 2 } },
                                            [
                                              a(
                                                "p",
                                                [
                                                  a("el-checkbox", {
                                                    on: {
                                                      change: function (e) {
                                                        t.checkCustomerData =
                                                          t.handleCheckAll(
                                                            t.customers,
                                                            t.checkCustomerData
                                                          );
                                                      },
                                                    },
                                                    model: {
                                                      value:
                                                        t.checkCustomerData
                                                          .allChecked,
                                                      callback: function (e) {
                                                        t.$set(
                                                          t.checkCustomerData,
                                                          "allChecked",
                                                          e
                                                        );
                                                      },
                                                      expression:
                                                        "checkCustomerData.allChecked",
                                                    },
                                                  }),
                                                ],
                                                1
                                              ),
                                            ]
                                          )
                                        : t._e(),
                                      t._v(" "),
                                      a("el-col", { attrs: { lg: 8, md: 8 } }, [
                                        a("p", [
                                          t._v(
                                            t._s(t.$root.labels.customer) + ":"
                                          ),
                                        ]),
                                      ]),
                                      t._v(" "),
                                      a("el-col", { attrs: { lg: 8, md: 8 } }, [
                                        a("p", [
                                          t._v(
                                            t._s(t.$root.labels.wp_user) + ":"
                                          ),
                                        ]),
                                      ]),
                                      t._v(" "),
                                      a("el-col", { attrs: { lg: 6, md: 6 } }, [
                                        a("p", [
                                          t._v(
                                            t._s(t.$root.labels.phone) + ":"
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
                                { attrs: { lg: 12 } },
                                [
                                  a(
                                    "el-row",
                                    {
                                      staticClass:
                                        "am-customers-flex-row-middle-align",
                                      attrs: { gutter: 10 },
                                    },
                                    [
                                      a("el-col", { attrs: { lg: 0, md: 1 } }),
                                      t._v(" "),
                                      a(
                                        "el-col",
                                        { attrs: { lg: 10, md: 10 } },
                                        [
                                          a("p", [
                                            t._v(
                                              t._s(t.$root.labels.note) + ":"
                                            ),
                                          ]),
                                        ]
                                      ),
                                      t._v(" "),
                                      a(
                                        "el-col",
                                        { attrs: { lg: 10, md: 10 } },
                                        [
                                          a("p", [
                                            t._v(
                                              t._s(
                                                t.$root.labels.last_appointment
                                              ) + ":"
                                            ),
                                          ]),
                                        ]
                                      ),
                                      t._v(" "),
                                      a("el-col", { attrs: { lg: 4, md: 4 } }),
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
                      a(
                        "div",
                        { staticClass: "am-customers-list" },
                        [
                          a(
                            "el-collapse",
                            t._l(t.customers, function (e, o) {
                              return a(
                                "el-collapse-item",
                                {
                                  key: e.id,
                                  staticClass: "am-customer",
                                  attrs: { name: e.id },
                                },
                                [
                                  a("template", { slot: "title" }, [
                                    a(
                                      "div",
                                      { staticClass: "am-customer-data" },
                                      [
                                        a(
                                          "el-row",
                                          { attrs: { gutter: 10 } },
                                          [
                                            a(
                                              "el-col",
                                              { attrs: { lg: 12 } },
                                              [
                                                a(
                                                  "el-row",
                                                  {
                                                    staticClass:
                                                      "am-customers-flex-row-middle-align",
                                                    attrs: { gutter: 10 },
                                                  },
                                                  [
                                                    !0 ===
                                                    t.$root.settings
                                                      .capabilities.canDelete
                                                      ? a(
                                                          "el-col",
                                                          {
                                                            attrs: {
                                                              lg: 2,
                                                              sm: 1,
                                                            },
                                                          },
                                                          [
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
                                                                  "el-checkbox",
                                                                  {
                                                                    on: {
                                                                      change:
                                                                        function (
                                                                          e
                                                                        ) {
                                                                          t.checkCustomerData =
                                                                            t.handleCheckSingle(
                                                                              t.customers,
                                                                              t.checkCustomerData
                                                                            );
                                                                        },
                                                                    },
                                                                    model: {
                                                                      value:
                                                                        e.checked,
                                                                      callback:
                                                                        function (
                                                                          o
                                                                        ) {
                                                                          t.$set(
                                                                            e,
                                                                            "checked",
                                                                            o
                                                                          );
                                                                        },
                                                                      expression:
                                                                        "customer.checked",
                                                                    },
                                                                  }
                                                                ),
                                                              ],
                                                              1
                                                            ),
                                                          ]
                                                        )
                                                      : t._e(),
                                                    t._v(" "),
                                                    a(
                                                      "el-col",
                                                      {
                                                        attrs: { lg: 8, sm: 8 },
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
                                                                t.$root.labels
                                                                  .customer
                                                              ) + ":"
                                                            ),
                                                          ]
                                                        ),
                                                        t._v(" "),
                                                        a("h3", [
                                                          t._v(
                                                            t._s(
                                                              e.firstName +
                                                                " " +
                                                                e.lastName
                                                            )
                                                          ),
                                                        ]),
                                                        t._v(" "),
                                                        a(
                                                          "el-tooltip",
                                                          {
                                                            staticClass: "item",
                                                            attrs: {
                                                              content: e.email,
                                                              placement: "top",
                                                            },
                                                          },
                                                          [
                                                            a("span", [
                                                              t._v(
                                                                t._s(e.email)
                                                              ),
                                                            ]),
                                                          ]
                                                        ),
                                                      ],
                                                      1
                                                    ),
                                                    t._v(" "),
                                                    a(
                                                      "el-col",
                                                      {
                                                        attrs: { lg: 8, sm: 8 },
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
                                                                t.$root.labels
                                                                  .wp_user
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
                                                            a("img", {
                                                              attrs: {
                                                                src: e.wpUserPhotoUrl,
                                                              },
                                                            }),
                                                            t._v(" "),
                                                            a(
                                                              "el-tooltip",
                                                              {
                                                                staticClass:
                                                                  "item",
                                                                attrs: {
                                                                  content:
                                                                    e.wpName,
                                                                  placement:
                                                                    "top",
                                                                },
                                                              },
                                                              [
                                                                a("h4", [
                                                                  t._v(
                                                                    t._s(
                                                                      e.wpName
                                                                    )
                                                                  ),
                                                                ]),
                                                              ]
                                                            ),
                                                          ],
                                                          1
                                                        ),
                                                      ]
                                                    ),
                                                    t._v(" "),
                                                    a(
                                                      "el-col",
                                                      {
                                                        attrs: { lg: 6, sm: 7 },
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
                                                                t.$root.labels
                                                                  .phone
                                                              ) + ":"
                                                            ),
                                                          ]
                                                        ),
                                                        t._v(" "),
                                                        a(
                                                          "el-tooltip",
                                                          {
                                                            staticClass: "item",
                                                            attrs: {
                                                              content: e.phone,
                                                              placement: "top",
                                                            },
                                                          },
                                                          [
                                                            a("h4", [
                                                              t._v(
                                                                t._s(e.phone)
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
                                            t._v(" "),
                                            a(
                                              "el-col",
                                              { attrs: { lg: 12 } },
                                              [
                                                a(
                                                  "el-row",
                                                  {
                                                    staticClass:
                                                      "am-customers-flex-row-middle-align",
                                                    attrs: { gutter: 10 },
                                                  },
                                                  [
                                                    a("el-col", {
                                                      staticClass:
                                                        "hide-on-mobile",
                                                      attrs: { lg: 0, sm: 1 },
                                                    }),
                                                    t._v(" "),
                                                    a(
                                                      "el-col",
                                                      {
                                                        staticClass:
                                                          "hide-on-mobile",
                                                        attrs: {
                                                          lg: 10,
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
                                                                t.$root.labels
                                                                  .note
                                                              ) + ":"
                                                            ),
                                                          ]
                                                        ),
                                                        t._v(" "),
                                                        a("p", [
                                                          t._v(
                                                            t._s(
                                                              e.note
                                                                ? e.note.substring(
                                                                    0,
                                                                    20
                                                                  ) + "..."
                                                                : ""
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
                                                          lg: 10,
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
                                                                t.$root.labels
                                                                  .last_appointment
                                                              ) + ":"
                                                            ),
                                                          ]
                                                        ),
                                                        t._v(" "),
                                                        e.lastAppointment
                                                          ? a("h4", [
                                                              t._v(
                                                                "\n                            " +
                                                                  t._s(
                                                                    t.getFrontedFormattedDateTime(
                                                                      e.lastAppointment
                                                                    )
                                                                  ) +
                                                                  "\n                          "
                                                              ),
                                                            ])
                                                          : a("h4", [
                                                              t._v("/"),
                                                            ]),
                                                      ]
                                                    ),
                                                    t._v(" "),
                                                    a(
                                                      "el-col",
                                                      {
                                                        staticClass:
                                                          "align-right",
                                                        attrs: { lg: 4, sm: 7 },
                                                      },
                                                      [
                                                        a(
                                                          "div",
                                                          {
                                                            on: {
                                                              click: function (
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
                                                              .canWrite
                                                              ? a(
                                                                  "el-button",
                                                                  {
                                                                    on: {
                                                                      click:
                                                                        function (
                                                                          e
                                                                        ) {
                                                                          return t.showDialogEditCustomer(
                                                                            o
                                                                          );
                                                                        },
                                                                    },
                                                                  },
                                                                  [
                                                                    t._v(
                                                                      t._s(
                                                                        t.$root
                                                                          .labels
                                                                          .edit
                                                                      )
                                                                    ),
                                                                  ]
                                                                )
                                                              : t._e(),
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
                                        ),
                                      ],
                                      1
                                    ),
                                  ]),
                                  t._v(" "),
                                  a(
                                    "div",
                                    { staticClass: "am-customer-details" },
                                    [
                                      a(
                                        "el-row",
                                        [
                                          a(
                                            "el-col",
                                            { attrs: { md: 12 } },
                                            [
                                              a(
                                                "el-row",
                                                {
                                                  staticClass:
                                                    "am-customers-flex-row-top-align",
                                                  attrs: { gutter: 10 },
                                                },
                                                [
                                                  a("el-col", {
                                                    attrs: { md: 2, sm: 1 },
                                                  }),
                                                  t._v(" "),
                                                  a(
                                                    "el-col",
                                                    {
                                                      attrs: { md: 10, sm: 10 },
                                                    },
                                                    [
                                                      a(
                                                        "p",
                                                        {
                                                          staticClass:
                                                            "am-data",
                                                        },
                                                        [
                                                          t._v(
                                                            t._s(
                                                              t.$root.labels
                                                                .total_appointments
                                                            ) + ":"
                                                          ),
                                                        ]
                                                      ),
                                                    ]
                                                  ),
                                                  t._v(" "),
                                                  a(
                                                    "el-col",
                                                    {
                                                      attrs: { md: 10, sm: 13 },
                                                    },
                                                    [
                                                      a(
                                                        "p",
                                                        {
                                                          staticClass:
                                                            "am-value",
                                                        },
                                                        [
                                                          t._v(
                                                            t._s(
                                                              e.totalAppointments
                                                            )
                                                          ),
                                                        ]
                                                      ),
                                                    ]
                                                  ),
                                                ],
                                                1
                                              ),
                                              t._v(" "),
                                              a(
                                                "el-row",
                                                {
                                                  staticClass:
                                                    "am-customers-flex-row-top-align",
                                                  attrs: { gutter: 10 },
                                                },
                                                [
                                                  a("el-col", {
                                                    attrs: { md: 2, sm: 1 },
                                                  }),
                                                  t._v(" "),
                                                  a(
                                                    "el-col",
                                                    {
                                                      attrs: { md: 10, sm: 10 },
                                                    },
                                                    [
                                                      a(
                                                        "p",
                                                        {
                                                          staticClass:
                                                            "am-data",
                                                        },
                                                        [
                                                          t._v(
                                                            t._s(
                                                              t.$root.labels
                                                                .last_appointment
                                                            ) + ":"
                                                          ),
                                                        ]
                                                      ),
                                                    ]
                                                  ),
                                                  t._v(" "),
                                                  a(
                                                    "el-col",
                                                    {
                                                      attrs: { md: 10, sm: 13 },
                                                    },
                                                    [
                                                      e.lastAppointment
                                                        ? a(
                                                            "p",
                                                            {
                                                              staticClass:
                                                                "am-value",
                                                            },
                                                            [
                                                              t._v(
                                                                "\n                          " +
                                                                  t._s(
                                                                    t.getFrontedFormattedDateTime(
                                                                      e.lastAppointment
                                                                    )
                                                                  ) +
                                                                  "\n                        "
                                                              ),
                                                            ]
                                                          )
                                                        : a("h4", [t._v("/")]),
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
                                            { attrs: { md: 12 } },
                                            [
                                              a(
                                                "el-row",
                                                {
                                                  staticClass:
                                                    "am-customers-flex-row-top-align",
                                                  attrs: { gutter: 10 },
                                                },
                                                [
                                                  a("el-col", {
                                                    attrs: { md: 0, sm: 1 },
                                                  }),
                                                  t._v(" "),
                                                  a(
                                                    "el-col",
                                                    {
                                                      attrs: { md: 10, sm: 10 },
                                                    },
                                                    [
                                                      a(
                                                        "p",
                                                        {
                                                          staticClass:
                                                            "am-data",
                                                        },
                                                        [
                                                          t._v(
                                                            t._s(
                                                              t.$root.labels
                                                                .note
                                                            ) + ":"
                                                          ),
                                                        ]
                                                      ),
                                                    ]
                                                  ),
                                                  t._v(" "),
                                                  a(
                                                    "el-col",
                                                    {
                                                      attrs: { md: 14, sm: 13 },
                                                    },
                                                    [
                                                      a(
                                                        "p",
                                                        {
                                                          staticClass:
                                                            "am-value",
                                                        },
                                                        [t._v(t._s(e.note))]
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
                                ],
                                2
                              );
                            }),
                            1
                          ),
                        ],
                        1
                      ),
                    ]
                  ),
                  t._v(" "),
                  a("group-delete", {
                    attrs: {
                      name: "users/customers",
                      entities: t.customers,
                      checkGroupData: t.checkCustomerData,
                      confirmDeleteMessage:
                        t.$root.labels.confirm_delete_customer,
                      successMessage: {
                        single: t.$root.labels.customer_deleted,
                        multiple: t.$root.labels.customers_deleted,
                      },
                      errorMessage: {
                        single: t.$root.labels.customer_not_deleted,
                        multiple: t.$root.labels.customers_not_deleted,
                      },
                    },
                    on: { groupDeleteCallback: t.groupDeleteCallback },
                  }),
                  t._v(" "),
                  a("pagination-block", {
                    attrs: {
                      params: t.params,
                      count: t.options.filteredCount,
                      label: t.$root.labels.customers_lower,
                      visible:
                        t.fetched &&
                        0 !== t.customers.length &&
                        t.fetchedFiltered,
                    },
                    on: { change: t.filterData },
                  }),
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
                ],
                1
              ),
              t._v(" "),
              !0 === t.$root.settings.capabilities.canWrite
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
                        on: {
                          click: function (e) {
                            return t.showDialogNewCustomer();
                          },
                        },
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
                              saveCallback: t.updateCustomerCallback,
                              closeDialog: function (e) {
                                t.dialogCustomer = !1;
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
              a("el-col", { attrs: { md: 6 } }, [
                a(
                  "a",
                  {
                    staticClass: "am-help-button",
                    attrs: {
                      href: "https://wpamelia.com/customers/",
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
  668: function (e, t, o) {
    var a = o(685)(o(1031), o(1032), !1, null, null, null);
    e.exports = a.exports;
  },
  685: function (e, t) {
    e.exports = function (e, t, o, a, n, i) {
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
        o && (u.functional = !0),
        n && (u._scopeId = n),
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
                a && a.call(this, e),
                e && e._registeredComponents && e._registeredComponents.add(i);
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
          Object.keys(e).forEach(function (n) {
            null !== e[n] && "object" === a(e[n]) && n in t
              ? o.replaceExistingObjectProperties(e[n], t[n])
              : n in t && (e[n] = t[n]);
          });
        },
        addMissingObjectProperties: function (e, t) {
          var o = this;
          Object.keys(t).forEach(function (n) {
            var i = !1;
            n in e ||
              ("object" === a(t[n])
                ? ((e[n] = {}), (i = !0))
                : ((e[n] = null), (i = !0))),
              null === t[n] || "object" !== a(t[n])
                ? i && (e[n] = t[n])
                : o.addMissingObjectProperties(e[n], t[n]);
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
                n = o[1].split(/[&;]/g),
                i = n.length;
              i-- > 0;

            )
              -1 !== n[i].lastIndexOf(a, 0) && n.splice(i, 1);
            return (e = o[0] + (n.length > 0 ? "?" + n.join("&") : ""));
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
            n = Math.floor(Math.random() * this.colors.length),
            i = this.colors[n];
          return (
            this.usedColors.push(this.colors[n]),
            this.colors.splice(n, 1),
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
                i +
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
  688: function (e, t, o) {
    "use strict";
    var a = o(706),
      n = o(343),
      i = Object.prototype.toString;
    function s(e) {
      return "[object Array]" === i.call(e);
    }
    function r(e) {
      return null !== e && "object" == typeof e;
    }
    function l(e) {
      return "[object Function]" === i.call(e);
    }
    function c(e, t) {
      if (null !== e && void 0 !== e)
        if (("object" == typeof e || s(e) || (e = [e]), s(e)))
          for (var o = 0, a = e.length; o < a; o++) t.call(null, e[o], o, e);
        else
          for (var n in e)
            Object.prototype.hasOwnProperty.call(e, n) &&
              t.call(null, e[n], n, e);
    }
    e.exports = {
      isArray: s,
      isArrayBuffer: function (e) {
        return "[object ArrayBuffer]" === i.call(e);
      },
      isBuffer: n,
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
        return "[object Date]" === i.call(e);
      },
      isFile: function (e) {
        return "[object File]" === i.call(e);
      },
      isBlob: function (e) {
        return "[object Blob]" === i.call(e);
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
        function o(o, a) {
          "object" == typeof t[a] && "object" == typeof o
            ? (t[a] = e(t[a], o))
            : (t[a] = o);
        }
        for (var a = 0, n = arguments.length; a < n; a++) c(arguments[a], o);
        return t;
      },
      extend: function (e, t, o) {
        return (
          c(t, function (t, n) {
            e[n] = o && "function" == typeof t ? a(t, o) : t;
          }),
          e
        );
      },
      trim: function (e) {
        return e.replace(/^\s*/, "").replace(/\s*$/, "");
      },
    };
  },
  691: function (e, t, o) {
    "use strict";
    t.a = {
      methods: {
        notify: function (e, t, o, a) {
          var n = this;
          void 0 === a && (a = ""),
            setTimeout(function () {
              n.$notify({
                customClass: a,
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
  693: function (e, t, o) {
    (function (o) {
      var a, n, i, s;
      (s = void 0 !== o ? o : this.window || this.global),
        (n = []),
        (a = (function (e) {
          var t,
            o = {},
            a = !!document.querySelector && !!e.addEventListener,
            n = { initClass: "js-inlinesvg", svgSelector: "img.svg" },
            i = function () {
              var e = {},
                t = !1,
                o = 0,
                a = arguments.length;
              "[object Boolean]" ===
                Object.prototype.toString.call(arguments[0]) &&
                ((t = arguments[0]), o++);
              for (
                var n = function (o) {
                  for (var a in o)
                    Object.prototype.hasOwnProperty.call(o, a) &&
                      (t &&
                      "[object Object]" === Object.prototype.toString.call(o[a])
                        ? (e[a] = i(!0, e[a], o[a]))
                        : (e[a] = o[a]));
                };
                a > o;
                o++
              ) {
                n(arguments[o]);
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
                var n = e.src || e.getAttribute("data-src"),
                  i = e.attributes,
                  s = new XMLHttpRequest();
                s.open("GET", n, !0),
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
                        Array.prototype.slice.call(i).forEach(function (e) {
                          "src" !== e.name &&
                            "alt" !== e.name &&
                            o.setAttribute(e.name, e.value);
                        }),
                        o.classList
                          ? o.classList.add("inlined-svg")
                          : (o.className += " inlined-svg"),
                        o.setAttribute("role", "img"),
                        i.longdesc)
                      ) {
                        var n = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "desc"
                          ),
                          r = document.createTextNode(i.longdesc.value);
                        n.appendChild(r), o.insertBefore(n, o.firstChild);
                      }
                      if (i.alt) {
                        o.setAttribute("aria-labelledby", "title");
                        var l = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "title"
                          ),
                          c = document.createTextNode(i.alt.value);
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
                ((t = i(n, e || {})),
                s(o || function () {}),
                (document.documentElement.className += " " + t.initClass));
            }),
            o
          );
        })(s)),
        void 0 === (i = "function" == typeof a ? a.apply(t, n) : a) ||
          (e.exports = i);
    }.call(t, o(39)));
  },
  696: function (e, t, o) {
    var a = o(685)(o(703), o(704), !1, null, null, null);
    e.exports = a.exports;
  },
  697: function (e, t, o) {
    "use strict";
    (function (t) {
      var a = o(688),
        n = o(724),
        i = { "Content-Type": "application/x-www-form-urlencoded" };
      function s(e, t) {
        !a.isUndefined(e) &&
          a.isUndefined(e["Content-Type"]) &&
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
                n(t, "Content-Type"),
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
          l.headers[e] = a.merge(i);
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
    var a = (function () {
        function e(e, t) {
          for (var o = 0; o < t.length; o++) {
            var a = t[o];
            (a.enumerable = a.enumerable || !1),
              (a.configurable = !0),
              "value" in a && (a.writable = !0),
              Object.defineProperty(e, a.key, a);
          }
        }
        return function (t, o, a) {
          return o && e(t.prototype, o), a && e(t, a), t;
        };
      })(),
      n = r(o(721)),
      i = r(o(739)),
      s = r(o(740));
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
          (this.errors = new i.default()),
          ["post", "patch", "put", "delete"].forEach(function (e) {
            t[e] = function (o, a) {
              return t.submit(e, o, a);
            };
          });
      }
      return (
        a(e, [
          {
            key: "submit",
            value: function (t, o) {
              var a = this,
                n =
                  arguments.length > 2 && void 0 !== arguments[2]
                    ? arguments[2]
                    : {};
              return (
                (t = t.toLowerCase()),
                this.hasFiles(n) &&
                  ((n = (0, s.default)(n)),
                  "post" !== t &&
                    (n.append("_method", t.toUpperCase()), (t = "post"))),
                (this.progress = 0),
                this.errors.clear(),
                (this.isPending = !0),
                new Promise(function (i, s) {
                  e.defaults.axios[t](o, n, a.config())
                    .then(function (e) {
                      i(e.data);
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
    (l.defaults = { axios: n.default }), (e.exports = l);
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
                n = this.countries.filter(function (e) {
                  return e.phonecode === a;
                });
              if (n.length) {
                var i = null;
                1 === a
                  ? (i = n.find(function (e) {
                      return 229 === e.id;
                    }))
                  : 44 === a
                  ? (i = n.find(function (e) {
                      return 228 === e.id;
                    }))
                  : 7 === a &&
                    (i = n.find(function (e) {
                      return 176 === e.id;
                    })),
                  (void 0 !== i && null !== i) || (i = n[0]),
                  (this.value = i.iso);
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
        for (var o = new Array(arguments.length), a = 0; a < o.length; a++)
          o[a] = arguments[a];
        return e.apply(t, o);
      };
    };
  },
  707: function (e, t, o) {
    "use strict";
    var a = o(688),
      n = o(725),
      i = o(727),
      s = o(728),
      r = o(729),
      l = o(708),
      c =
        ("undefined" != typeof window &&
          window.btoa &&
          window.btoa.bind(window)) ||
        o(730);
    e.exports = function (e) {
      return new Promise(function (t, u) {
        var m = e.data,
          d = e.headers;
        a.isFormData(m) && delete d["Content-Type"];
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
          var v = e.auth.username || "",
            g = e.auth.password || "";
          d.Authorization = "Basic " + c(v + ":" + g);
        }
        if (
          (p.open(
            e.method.toUpperCase(),
            i(e.url, e.params, e.paramsSerializer),
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
              var o =
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
                  headers: o,
                  config: e,
                  request: p,
                };
              n(t, u, a), (p = null);
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
          var b = o(731),
            _ =
              (e.withCredentials || r(e.url)) && e.xsrfCookieName
                ? b.read(e.xsrfCookieName)
                : void 0;
          _ && (d[e.xsrfHeaderName] = _);
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
  708: function (e, t, o) {
    "use strict";
    var a = o(726);
    e.exports = function (e, t, o, n, i) {
      var s = new Error(e);
      return a(s, t, o, n, i);
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
    function a(e) {
      this.message = e;
    }
    (a.prototype.toString = function () {
      return "Cancel" + (this.message ? ": " + this.message : "");
    }),
      (a.prototype.__CANCEL__ = !0),
      (e.exports = a);
  },
  713: function (e, t, o) {
    var a = o(685)(o(744), o(745), !1, null, null, null);
    e.exports = a.exports;
  },
  717: function (e, t, o) {
    var a = o(685)(o(718), o(719), !1, null, null, null);
    e.exports = a.exports;
  },
  718: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = o(337);
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
    var a = o(688),
      n = o(706),
      i = o(723),
      s = o(697);
    function r(e) {
      var t = new i(e),
        o = n(i.prototype.request, t);
      return a.extend(o, i.prototype, t), a.extend(o, t), o;
    }
    var l = r(s);
    (l.Axios = i),
      (l.create = function (e) {
        return r(a.merge(s, e));
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
    var a = o(697),
      n = o(688),
      i = o(732),
      s = o(733),
      r = o(735),
      l = o(736);
    function c(e) {
      (this.defaults = e),
        (this.interceptors = { request: new i(), response: new i() });
    }
    (c.prototype.request = function (e) {
      "string" == typeof e &&
        (e = n.merge({ url: arguments[0] }, arguments[1])),
        ((e = n.merge(a, this.defaults, { method: "get" }, e)).method =
          e.method.toLowerCase()),
        e.baseURL && !r(e.url) && (e.url = l(e.baseURL, e.url));
      var t = [s, void 0],
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
      n.forEach(["delete", "get", "head", "options"], function (e) {
        c.prototype[e] = function (t, o) {
          return this.request(n.merge(o || {}, { method: e, url: t }));
        };
      }),
      n.forEach(["post", "put", "patch"], function (e) {
        c.prototype[e] = function (t, o, a) {
          return this.request(n.merge(a || {}, { method: e, url: t, data: o }));
        };
      }),
      (e.exports = c);
  },
  724: function (e, t, o) {
    "use strict";
    var a = o(688);
    e.exports = function (e, t) {
      a.forEach(e, function (o, a) {
        a !== t &&
          a.toUpperCase() === t.toUpperCase() &&
          ((e[t] = o), delete e[a]);
      });
    };
  },
  725: function (e, t, o) {
    "use strict";
    var a = o(708);
    e.exports = function (e, t, o) {
      var n = o.config.validateStatus;
      o.status && n && !n(o.status)
        ? t(
            a(
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
    e.exports = function (e, t, o, a, n) {
      return (
        (e.config = t), o && (e.code = o), (e.request = a), (e.response = n), e
      );
    };
  },
  727: function (e, t, o) {
    "use strict";
    var a = o(688);
    function n(e) {
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
      var i;
      if (o) i = o(t);
      else if (a.isURLSearchParams(t)) i = t.toString();
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
                s.push(n(t) + "=" + n(e));
            }));
        }),
          (i = s.join("&"));
      }
      return i && (e += (-1 === e.indexOf("?") ? "?" : "&") + i), e;
    };
  },
  728: function (e, t, o) {
    "use strict";
    var a = o(688);
    e.exports = function (e) {
      var t,
        o,
        n,
        i = {};
      return e
        ? (a.forEach(e.split("\n"), function (e) {
            (n = e.indexOf(":")),
              (t = a.trim(e.substr(0, n)).toLowerCase()),
              (o = a.trim(e.substr(n + 1))),
              t && (i[t] = i[t] ? i[t] + ", " + o : o);
          }),
          i)
        : i;
    };
  },
  729: function (e, t, o) {
    "use strict";
    var a = o(688);
    e.exports = a.isStandardBrowserEnv()
      ? (function () {
          var e,
            t = /(msie|trident)/i.test(navigator.userAgent),
            o = document.createElement("a");
          function n(e) {
            var a = e;
            return (
              t && (o.setAttribute("href", a), (a = o.href)),
              o.setAttribute("href", a),
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
            (e = n(window.location.href)),
            function (t) {
              var o = a.isString(t) ? n(t) : t;
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
    var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    function n() {
      this.message = "String contains an invalid character";
    }
    (n.prototype = new Error()),
      (n.prototype.code = 5),
      (n.prototype.name = "InvalidCharacterError"),
      (e.exports = function (e) {
        for (
          var t, o, i = String(e), s = "", r = 0, l = a;
          i.charAt(0 | r) || ((l = "="), r % 1);
          s += l.charAt(63 & (t >> (8 - (r % 1) * 8)))
        ) {
          if ((o = i.charCodeAt((r += 0.75))) > 255) throw new n();
          t = (t << 8) | o;
        }
        return s;
      });
  },
  731: function (e, t, o) {
    "use strict";
    var a = o(688);
    e.exports = a.isStandardBrowserEnv()
      ? {
          write: function (e, t, o, n, i, s) {
            var r = [];
            r.push(e + "=" + encodeURIComponent(t)),
              a.isNumber(o) && r.push("expires=" + new Date(o).toGMTString()),
              a.isString(n) && r.push("path=" + n),
              a.isString(i) && r.push("domain=" + i),
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
  732: function (e, t, o) {
    "use strict";
    var a = o(688);
    function n() {
      this.handlers = [];
    }
    (n.prototype.use = function (e, t) {
      return (
        this.handlers.push({ fulfilled: e, rejected: t }),
        this.handlers.length - 1
      );
    }),
      (n.prototype.eject = function (e) {
        this.handlers[e] && (this.handlers[e] = null);
      }),
      (n.prototype.forEach = function (e) {
        a.forEach(this.handlers, function (t) {
          null !== t && e(t);
        });
      }),
      (e.exports = n);
  },
  733: function (e, t, o) {
    "use strict";
    var a = o(688),
      n = o(734),
      i = o(709),
      s = o(697);
    function r(e) {
      e.cancelToken && e.cancelToken.throwIfRequested();
    }
    e.exports = function (e) {
      return (
        r(e),
        (e.headers = e.headers || {}),
        (e.data = n(e.data, e.headers, e.transformRequest)),
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
              r(e), (t.data = n(t.data, t.headers, e.transformResponse)), t
            );
          },
          function (t) {
            return (
              i(t) ||
                (r(e),
                t &&
                  t.response &&
                  (t.response.data = n(
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
    var a = o(688);
    e.exports = function (e, t, o) {
      return (
        a.forEach(o, function (o) {
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
    var a = o(710);
    function n(e) {
      if ("function" != typeof e)
        throw new TypeError("executor must be a function.");
      var t;
      this.promise = new Promise(function (e) {
        t = e;
      });
      var o = this;
      e(function (e) {
        o.reason || ((o.reason = new a(e)), t(o.reason));
      });
    }
    (n.prototype.throwIfRequested = function () {
      if (this.reason) throw this.reason;
    }),
      (n.source = function () {
        var e;
        return {
          token: new n(function (t) {
            e = t;
          }),
          cancel: e,
        };
      }),
      (e.exports = n);
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
    var a,
      n = (function () {
        function e(e, t) {
          for (var o = 0; o < t.length; o++) {
            var a = t[o];
            (a.enumerable = a.enumerable || !1),
              (a.configurable = !0),
              "value" in a && (a.writable = !0),
              Object.defineProperty(e, a.key, a);
          }
        }
        return function (t, o, a) {
          return o && e(t.prototype, o), a && e(t, a), t;
        };
      })(),
      i = o(13),
      s = (a = i) && a.__esModule ? a : { default: a };
    e.exports = (function () {
      function e() {
        !(function (e, t) {
          if (!(e instanceof t))
            throw new TypeError("Cannot call a class as a function");
        })(this, e),
          (this.errors = {});
      }
      return (
        n(e, [
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
  740: function (e, t, o) {
    "use strict";
    function a(e) {
      return void 0 === e;
    }
    function n(e) {
      return Array.isArray(e);
    }
    function i(e) {
      return (
        e &&
        "number" == typeof e.size &&
        "string" == typeof e.type &&
        "function" == typeof e.slice
      );
    }
    e.exports = function e(t, o, s, r) {
      if (
        (o instanceof FormData && ((r = s), (s = o), (o = null)),
        ((o = o || {}).indices = !a(o.indices) && o.indices),
        (o.nulls = !!a(o.nulls) || o.nulls),
        (s = s || new FormData()),
        a(t))
      )
        return s;
      if (
        (function (e) {
          return null === e;
        })(t)
      )
        o.nulls && s.append(r, "");
      else if (n(t))
        if (t.length)
          t.forEach(function (t, a) {
            var n = r + "[" + (o.indices ? a : "") + "]";
            e(t, o, s, n);
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
                i(e) &&
                ("object" == typeof e.lastModifiedDate ||
                  "number" == typeof e.lastModified) &&
                "string" == typeof e.name
              );
            })(t) ||
            i(t)
            ? s.append(r, t)
            : Object.keys(t).forEach(function (a) {
                var i = t[a];
                if (n(i))
                  for (; a.length > 2 && a.lastIndexOf("[]") === a.length - 2; )
                    a = a.substring(0, a.length - 2);
                e(i, o, s, r ? r + "[" + a + "]" : a);
              })
          : s.append(r, t.toISOString());
      return s;
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
  743: function (e, t, o) {
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
                o = e.options.entities.customers;
              e.searchedCustomers.forEach(function (e) {
                -1 === t.indexOf(parseInt(e.id)) && (t.push(e.id), o.push(e));
              }),
                (e.options.entities.customers = Object.values(
                  o.sort(function (e, t) {
                    return e.firstName.toLowerCase() > t.firstName.toLowerCase()
                      ? 1
                      : -1;
                  })
                ));
            });
        },
        searchCustomers: function (e, t) {
          var o = this;
          clearTimeout(this.searchCustomersTimer),
            (this.loadingCustomers = !0),
            this.searchCounter++,
            (this.searchCustomersTimer = setTimeout(function () {
              var a = o.searchCounter;
              o.$http
                .get(o.$root.getAjaxUrl + "/users/customers", {
                  params: {
                    search: e,
                    page: 1,
                    limit: o.$root.settings.general.customersFilterLimit,
                    skipCount: 1,
                  },
                })
                .then(function (e) {
                  a >= o.searchCounter &&
                    (o.searchedCustomers = e.data.data.users.sort(function (
                      e,
                      t
                    ) {
                      return e.firstName.toLowerCase() >
                        t.firstName.toLowerCase()
                        ? 1
                        : -1;
                    })),
                    (o.loadingCustomers = !1),
                    t();
                })
                .catch(function (e) {
                  o.loadingCustomers = !1;
                });
            }, 500));
        },
      },
    };
  },
  744: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = o(702),
      n = o.n(a),
      i = o(691),
      s = o(337),
      r = o(701),
      l = o(741);
    t.default = {
      mixins: [i.a, s.a, r.a, l.a],
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
          form: new n.a(),
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
          this.$parent.$refs[this.formName].validate(function (a, n) {
            if (!a)
              return (
                "appointment" === t.formName &&
                  t.handleAppointmentDialogTabChange(n),
                t.$emit("validationFailCallback"),
                !1
              );
            (t.dialogLoading = !0),
              t.isNew ? t.addEntity(e) : t.editEntity(e),
              (t.$root = o);
          });
        },
        onSuccess: function (e, t, o) {
          var a = this;
          this.$parent.$emit("saveCallback", o),
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
          for (var t = Object.keys(e), o = 0, a = 0; a < t.length; a++)
            o = t[a].startsWith("bookings.") ? o + 1 : o;
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
  790: function (e, t, o) {
    var a = o(685)(o(793), o(794), !1, null, null, null);
    e.exports = a.exports;
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
  826: function (e, t, o) {
    var a = o(685)(o(827), o(828), !1, null, null, null);
    e.exports = a.exports;
  },
  827: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = o(713),
      n = o.n(a),
      i = o(696),
      s = o.n(i),
      r = o(687),
      l = o(337),
      c = o(691),
      u = o(686);
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
      components: { PhoneInput: s.a, DialogActions: n.a },
    };
  },
  828: function (e, t) {
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
            e.dialogLoading
              ? e._e()
              : o(
                  "div",
                  {
                    staticClass: "am-dialog-scrollable",
                    class: { "am-edit": 0 !== e.customer.id },
                  },
                  [
                    o(
                      "div",
                      { staticClass: "am-dialog-header" },
                      [
                        o(
                          "el-row",
                          [
                            o("el-col", { attrs: { span: 18 } }, [
                              0 !== e.customer.id
                                ? o("h2", [
                                    e._v(e._s(e.$root.labels.edit_customer)),
                                  ])
                                : o("h2", [
                                    e._v(e._s(e.$root.labels.new_customer)),
                                  ]),
                            ]),
                            e._v(" "),
                            o(
                              "el-col",
                              {
                                staticClass: "align-right",
                                attrs: { span: 6 },
                              },
                              [
                                o("span"),
                                e._v(" "),
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
                        o(
                          "el-form-item",
                          {
                            attrs: {
                              label: e.$root.labels.first_name + ":",
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
                        o(
                          "el-form-item",
                          {
                            attrs: {
                              label: e.$root.labels.last_name + ":",
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
                        o(
                          "el-form-item",
                          { attrs: { label: "placeholder" } },
                          [
                            o(
                              "label",
                              { attrs: { slot: "label" }, slot: "label" },
                              [
                                e._v(
                                  "\n          " +
                                    e._s(e.$root.labels.wp_user) +
                                    ":\n          "
                                ),
                                o(
                                  "el-tooltip",
                                  { attrs: { placement: "top" } },
                                  [
                                    o("div", {
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
                                o(
                                  "div",
                                  { staticClass: "am-drop" },
                                  [
                                    e.customer && e.customer.email
                                      ? o(
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
                                      return o("el-option", {
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
                        o(
                          "el-form-item",
                          { attrs: { label: e.$root.labels.phone + ":" } },
                          [
                            o("phone-input", {
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
                        o(
                          "el-form-item",
                          { attrs: { label: e.$root.labels.gender + ":" } },
                          [
                            o(
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
                                return o("el-option", {
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
                        o(
                          "el-form-item",
                          {
                            attrs: {
                              label: e.$root.labels.date_of_birth + ":",
                            },
                          },
                          [
                            o("v-date-picker", {
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
              : o("dialog-actions", {
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
  829: function (e, t, o) {
    var a = o(685)(o(830), o(831), !1, null, null, null);
    e.exports = a.exports;
  },
  830: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = o(687),
      n = o(337);
    t.default = {
      mixins: [a.a, n.a],
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
            o = function (o) {
              if (e.data.hasOwnProperty(o))
                if (e.data[o] instanceof Array || e.data[o] instanceof Object) {
                  var a = Object.keys(e.data[o]).map(function (t) {
                    return e.data[o][t];
                  });
                  for (var n in a)
                    if ("" !== a[n]) {
                      var i = "";
                      "" !==
                        (i =
                          a[n] instanceof Date
                            ? a[n] instanceof Date
                              ? e.getDatabaseFormattedDate(a[n])
                              : a[n]
                            : a[n] instanceof Object && !0 === a[n].checked
                            ? a[n].value
                            : a[n]) &&
                        t.push(o + "[" + n + "]=" + encodeURIComponent(i));
                    }
                } else
                  "" !== e.data[o] &&
                    t.push(o + "=" + encodeURIComponent(e.data[o]));
            };
          for (var a in this.data) o(a);
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
                      o("el-col", { attrs: { span: 14 } }, [
                        o("h2", [e._v(e._s(e.$root.labels.export))]),
                      ]),
                      e._v(" "),
                      o(
                        "el-col",
                        { staticClass: "align-right", attrs: { span: 10 } },
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
                { attrs: { "label-position": "top" } },
                [
                  o(
                    "el-form-item",
                    { attrs: { label: e.$root.labels.csv_delimiter + ":" } },
                    [
                      o(
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
                          return o("el-option", {
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
                    ? o(
                        "el-form-item",
                        {
                          attrs: {
                            label: e.$root.labels.select_rows_settings + ":",
                          },
                        },
                        [
                          o(
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
                              o("el-option", {
                                attrs: {
                                  label: this.$root.labels.exported_same_row,
                                  value: !1,
                                },
                              }),
                              e._v(" "),
                              o("el-option", {
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
                      o("el-checkbox", {
                        attrs: { checked: "", label: t.label, border: "" },
                        on: { change: e.changeFields },
                        model: {
                          value: t.checked,
                          callback: function (o) {
                            e.$set(t, "checked", o);
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
                          [
                            e._v(
                              "\n            " +
                                e._s(e.$root.labels.cancel) +
                                "\n          "
                            ),
                          ]
                        ),
                        e._v(" "),
                        o(
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
  833: function (e, t, o) {
    "use strict";
    t.a = {
      data: function () {
        return { count: { success: 0, error: 0 } };
      },
      methods: {
        deleteEntities: function (e, t, o, a) {
          var n = this;
          e.forEach(function (i) {
            n.$http
              .post(n.$root.getAjaxUrl + "/" + n.name + "/delete/" + i)
              .then(function () {
                n.deleteEntityResult(e, !0, t), o(i);
              })
              .catch(function () {
                n.deleteEntityResult(e, !1, t), a(i);
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
          var a = void 0 !== o ? o : t.allChecked;
          return (
            e.forEach(function (e) {
              e.checked = a;
            }),
            (t.allChecked = a),
            (t.toaster = a),
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
  922: function (e, t, o) {
    var a = o(685)(o(923), o(924), !1, null, null, null);
    e.exports = a.exports;
  },
  923: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = o(691),
      n = o(883),
      i = o(833);
    t.default = {
      mixins: [a.a, n.a, i.a],
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
});
