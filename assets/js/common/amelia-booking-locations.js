wpJsonpAmeliaBookingPlugin([19], {
  1026: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var n = o(1027),
      i = o.n(n),
      a = o(717),
      s = o.n(a),
      r = o(790),
      c = o.n(r),
      l = o(687);
    t.default = {
      mixins: [l.a],
      data: function () {
        return {
          fetchedFiltered: !1,
          count: 0,
          dialogLocation: !1,
          location: null,
          fetched: !1,
          filterFields: !0,
          locations: [],
          locationsCategories: [],
          options: {
            categorized: [],
            locationsCategories: [],
            countFiltered: 0,
            fetched: !1,
            sort: [
              { value: "name", label: this.$root.labels.name_ascending },
              { value: "-name", label: this.$root.labels.name_descending },
            ],
          },
          params: { page: 1, sort: "name", search: "", services: [] },
          searchPlaceholder: this.$root.labels.locations_search_placeholder,
          timer: null,
        };
      },
      created: function () {
        this.fetchData(), this.handleResize();
      },
      mounted: function () {
        this.inlineSVG();
      },
      updated: function () {},
      methods: {
        fetchData: function () {
          (this.fetched = !1),
            (this.options.fetched = !1),
            this.getLocations(),
            this.getLocationsOptions();
        },
        filterData: function () {
          (this.fetchedFiltered = !1), this.getLocations();
        },
        getLocations: function () {
          var e = this;
          Object.keys(this.params).forEach(function (t) {
            return !e.params[t] && delete e.params[t];
          }),
            this.$http
              .get(this.$root.getAjaxUrl + "/locations", {
                params: this.params,
              })
              .then(function (t) {
                (e.locations = t.data.data.locations),
                  (e.options.countFiltered = t.data.data.countFiltered),
                  (e.count = t.data.data.countTotal),
                  (e.fetched = !0),
                  (e.fetchedFiltered = !0);
              })
              .catch(function (t) {
                console.log(t.message),
                  (e.fetched = !0),
                  (e.fetchedFiltered = !0);
              });
        },
        getLocationsOptions: function () {
          var e = this;
          this.$http
            .get(this.$root.getAjaxUrl + "/entities", {
              params: { types: ["categories", "locationsCategories"] },
            })
            .then(function (t) {
              e.options.categorized = t.data.data.categories;
              e.options.locationsCategories = t.data.data.locationsCategories;
              e.options.fetched = true;
            })
            .catch(function (t) {
              console.log(t.message), (e.options.fetched = !0);
            });
        },
        changeFilter: function () {
          (this.params.page = 1), this.filterData();
        },
        handleResize: function () {
          this.filterFields = window.innerWidth >= 768;
        },
        showDialogNewLocation: function () {
          (this.location = this.getInitLocationObject()),
            (this.dialogLocation = !0);
        },
        showDialogEditLocation: function (e) {
          this.locationsCategories = this.options.locationsCategories;
          this.location = this.locations[e];
          this.dialogLocation = true;
        },
        duplicateLocationCallback: function (e) {
          var t = this;
          (this.location = e),
            (this.location.id = 0),
            setTimeout(function () {
              t.dialogLocation = !0;
            }, 300);
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
        getInitLocationObject: function () {
          return {
            id: 0,
            status: "visible",
            name: "",
            description: "",
            address: "",
            phone: "",
            latitude: 40.7484405,
            longitude: -73.9878531,
            pictureFullPath: "",
            pictureThumbPath: "",
            pin: "",
            locationCategoryId: "",
          };
        },
      },
      computed: {
        filterApplied: function () {
          return !!this.params.search || !!this.params.services.length;
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
        PageHeader: s.a,
        DialogLocation: i.a,
        PaginationBlock: c.a,
      },
    };
  },
  1027: function (e, t, o) {
    var n = o(685)(o(1028), o(1029), !1, null, null, null);
    e.exports = n.exports;
  },
  1028: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var n = o(713),
      i = o.n(n),
      a = o(696),
      s = o.n(a),
      r = o(792),
      c = o.n(r),
      l = o(955),
      u = o.n(l),
      d = o(687),
      m = o(691),
      p = o(686);
    t.default = {
      mixins: [d.a, m.a, p.a],
      props: { location: null, locationsCategories: [] },
      data: function () {
        return {
          showLatLng: !1,
          formOptions: {
            pins: [
              {
                id: 1,
                name: "Orange",
                iconUrl: this.$root.getUrl + "/public/img/pins/orange.png",
              },
              {
                id: 2,
                name: "Red",
                iconUrl: this.$root.getUrl + "/public/img/pins/red.png",
              },
              {
                id: 3,
                name: "Purple",
                iconUrl: this.$root.getUrl + "/public/img/pins/purple.png",
              },
              {
                id: 4,
                name: "Green",
                iconUrl: this.$root.getUrl + "/public/img/pins/green.png",
              },
            ],
          },
          rules: {
            name: [
              {
                required: !0,
                message: this.$root.labels.enter_location_name_warning,
                trigger: "submit",
              },
            ],
          },
        };
      },
      created: function () {},
      mounted: function () {
        this.initMap(
          this.location.latitude,
          this.location.longitude,
          this.location.pin
        ),
          this.inlineSVG();
      },
      methods: {
        getParsedEntity: function () {
          return this.location;
        },
        closeDialog: function () {
          this.$emit("closeDialog");
        },
        getAddressData: function (e) {
          return (
            this.clearValidation(),
            (this.location.latitude = e.latitude),
            (this.location.longitude = e.longitude),
            (this.location.address = document.getElementById(
              "address-autocomplete"
            ).value),
            this.initMap(
              this.location.latitude,
              this.location.longitude,
              this.location.pin
            ),
            e
          );
        },
        initMap: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : this.location.latitude,
            t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : this.location.longitude,
            o = arguments[2];
          if (void 0 !== e && void 0 !== t) {
            this.clearValidation();
            var n = window.google,
              i = this.location,
              a = new n.maps.Map(document.getElementById("map"), {
                zoom: 16,
                center: { lat: e, lng: t },
              }),
              s = new n.maps.Marker({
                position: { lat: e, lng: t },
                map: a,
                icon: o,
              });
            n.maps.event.addListener(a, "click", function (e) {
              s.setPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() }),
                (i.latitude = e.latLng.lat()),
                (i.longitude = e.latLng.lng());
            });
          }
        },
        phoneFormatted: function (e) {
          this.clearValidation(), (this.location.phone = e);
        },
        pictureSelected: function (e, t) {
          this.clearValidation(),
            (this.location.pictureFullPath = e),
            (this.location.pictureThumbPath = t);
        },
        clearValidation: function () {
          void 0 !== this.$refs.location && this.$refs.location.clearValidate();
        },
      },
      watch: {
        "location.latitude": function () {
          void 0 === this.location.latitude &&
            ((this.location.latitude = 0), this.initMap());
        },
        "location.longitude": function () {
          void 0 === this.location.longitude &&
            ((this.location.longitude = 0), this.initMap());
        },
      },
      components: {
        VueGoogleAutocomplete: u.a,
        PhoneInput: s.a,
        PictureUpload: c.a,
        DialogActions: i.a,
      },
    };
  },
  1029: function (e, t) {
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
                staticClass: "am-dialog-scrollable",
                class: { "am-edit": 0 !== e.location.id },
              },
              [
                o(
                  "div",
                  { staticClass: "am-dialog-header" },
                  [
                    o(
                      "el-row",
                      [
                        o("el-col", { attrs: { span: 16 } }, [
                          0 != e.location.id
                            ? o("h2", [
                                e._v(e._s(e.$root.labels.edit_location)),
                              ])
                            : o("h2", [
                                e._v(e._s(e.$root.labels.new_location)),
                              ]),
                        ]),
                        e._v(" "),
                        o(
                          "el-col",
                          { staticClass: "align-right", attrs: { span: 8 } },
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
                    ref: "location",
                    attrs: {
                      model: e.location,
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
                      "div",
                      { staticClass: "am-location-profile" },
                      [
                        o("picture-upload", {
                          attrs: {
                            "edited-entity": this.location,
                            "entity-name": "location",
                          },
                          on: { pictureSelected: e.pictureSelected },
                        }),
                        e._v(" "),
                        o("h2", [e._v(e._s(e.location.name))]),
                      ],
                      1
                    ),
                    e._v(" "),
                    o(
                      "el-form-item",
                      {
                        attrs: {
                          label: e.$root.labels.name + ":",
                          prop: "name",
                        },
                      },
                      [
                        o("el-input", {
                          attrs: { placeholder: "" },
                          on: {
                            input: function (t) {
                              return e.clearValidation();
                            },
                            change: function (t) {
                              return e.trimProperty(e.location, "name");
                            },
                          },
                          model: {
                            value: e.location.name,
                            callback: function (t) {
                              e.$set(e.location, "name", t);
                            },
                            expression: "location.name",
                          },
                        }),
                      ],
                      1
                    ),
                    e._v(" "), //p2p: add picker for category selection
                    o("el-form-item",
                      { attrs: { label: "Select the main market:" } },
                      [
                        o(
                          "el-select",
                          {
                            attrs: { placeholder: "", clearable: true },
                            on: {
                              change: function (t) {
                                return e.initMap(
                                  e.location.latitude,
                                  e.location.longitude,
                                  e.location.pin
                                );
                              },
                            },
                            model: {
                              value: e.location.locationCategoryId,
                              callback: function (t) {
                                e.$set(e.location, "locationCategoryId", t);
                              },
                              expression: "location.locationCategoryId",
                            },
                          },
                          e._l(e.locationsCategories, function (t) {
                            return o(
                              "el-option",
                              {
                                key: t.id,
                                staticClass: "pin-icon",
                                attrs: { label: t.name, value: t.id },
                              }
                            );
                          }),
                          1
                        ),                    
                      ]
                    ),
                    e._v(" "),
                    o(
                      "el-form-item",
                      { attrs: { label: e.$root.labels.address + ":" } },
                      [
                        o(
                          "div",
                          { staticClass: "el-input" },
                          [
                            o("vue-google-autocomplete", {
                              ref: "location.address",
                              attrs: {
                                id: "address-autocomplete",
                                classname: "el-input__inner",
                                placeholder: "",
                                value: e.location.address,
                              },
                              on: { placechanged: e.getAddressData },
                            }),
                          ],
                          1
                        ),
                      ]
                    ),
                    e._v(" "),
                    o(
                      "el-form-item",
                      { attrs: { label: e.$root.labels.pin_icon + ":" } },
                      [
                        o(
                          "el-select",
                          {
                            attrs: { placeholder: "" },
                            on: {
                              change: function (t) {
                                return e.initMap(
                                  e.location.latitude,
                                  e.location.longitude,
                                  e.location.pin
                                );
                              },
                            },
                            model: {
                              value: e.location.pin,
                              callback: function (t) {
                                e.$set(e.location, "pin", t);
                              },
                              expression: "location.pin",
                            },
                          },
                          e._l(e.formOptions.pins, function (t) {
                            return o(
                              "el-option",
                              {
                                key: t.id,
                                staticClass: "pin-icon",
                                attrs: { label: t.name, value: t.iconUrl },
                              },
                              [
                                o("img", { attrs: { src: t.iconUrl } }),
                                e._v(" "),
                                o("span", [e._v(e._s(t.name))]),
                              ]
                            );
                          }),
                          1
                        ),
                      ],
                      1
                    ),
                    e._v(" "),
                    o(
                      "el-form-item",
                      { attrs: { label: e.$root.labels.map + ":" } },
                      [o("div", { attrs: { id: "map" } })]
                    ),
                    e._v(" "),
                    o(
                      "el-button",
                      {
                        staticClass: "am-text-button-icon",
                        attrs: { type: "text" },
                        on: {
                          click: function (t) {
                            e.showLatLng = !e.showLatLng;
                          },
                        },
                      },
                      [
                        o("img", {
                          staticClass: "svg",
                          attrs: {
                            alt: e.$root.labels.delete,
                            src: e.$root.getUrl + "public/img/location.svg",
                          },
                        }),
                        e._v(
                          "\n        " +
                            e._s(e.$root.labels.not_right_address) +
                            "\n      "
                        ),
                      ]
                    ),
                    e._v(" "),
                    o("transition", { attrs: { name: "slide-down" } }, [
                      o(
                        "div",
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value: e.showLatLng,
                              expression: "showLatLng",
                            },
                          ],
                        },
                        [
                          o(
                            "el-row",
                            { attrs: { gutter: 16 } },
                            [
                              o(
                                "el-col",
                                { attrs: { span: 12 } },
                                [
                                  o(
                                    "el-form-item",
                                    {
                                      attrs: {
                                        label: e.$root.labels.latitude + ":",
                                      },
                                    },
                                    [
                                      o("el-input-number", {
                                        on: {
                                          change: function (t) {
                                            return e.initMap(
                                              e.location.latitude,
                                              e.location.longitude,
                                              e.location.pin
                                            );
                                          },
                                        },
                                        model: {
                                          value: e.location.latitude,
                                          callback: function (t) {
                                            e.$set(e.location, "latitude", t);
                                          },
                                          expression: "location.latitude",
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
                                        label: e.$root.labels.longitude + ":",
                                      },
                                    },
                                    [
                                      o("el-input-number", {
                                        on: {
                                          change: function (t) {
                                            return e.initMap(
                                              e.location.latitude,
                                              e.location.longitude,
                                              e.location.pin
                                            );
                                          },
                                        },
                                        model: {
                                          value: e.location.longitude,
                                          callback: function (t) {
                                            e.$set(e.location, "longitude", t);
                                          },
                                          expression: "location.longitude",
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
                    ]),
                    e._v(" "),
                    o(
                      "el-form-item",
                      { attrs: { label: e.$root.labels.phone + ":" } },
                      [
                        o("phone-input", {
                          attrs: { savedPhone: e.location.phone },
                          on: { phoneFormatted: e.phoneFormatted },
                        }),
                      ],
                      1
                    ),
                    e._v(" "),
                    o(
                      "el-form-item",
                      { attrs: { label: e.$root.labels.description + ":" } },
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
                            value: e.location.description,
                            callback: function (t) {
                              e.$set(e.location, "description", t);
                            },
                            expression: "location.description",
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
            o("dialog-actions", {
              attrs: {
                formName: "location",
                urlName: "locations",
                isNew: 0 === e.location.id,
                entity: e.location,
                getParsedEntity: e.getParsedEntity,
                hasIcons: !0,
                updateStash: !0,
                status: { on: "visible", off: "hidden" },
                buttonText: {
                  confirm: {
                    status: {
                      yes:
                        "visible" === e.location.status
                          ? e.$root.labels.visibility_hide
                          : e.$root.labels.visibility_show,
                      no: e.$root.labels.no,
                    },
                  },
                },
                action: {
                  haveAdd: !0,
                  haveEdit: !0,
                  haveStatus: !0,
                  haveRemove: !0 === e.$root.settings.capabilities.canDelete,
                  haveRemoveEffect: !0,
                  ignoreDeleteEffect: !0,
                  haveDuplicate: !0,
                },
                message: {
                  success: {
                    save: e.$root.labels.location_saved,
                    remove: e.$root.labels.location_deleted,
                    show: e.$root.labels.location_visible,
                    hide: e.$root.labels.location_hidden,
                  },
                  confirm: {
                    remove: e.$root.labels.confirm_delete_location,
                    show: e.$root.labels.confirm_show_location,
                    hide: e.$root.labels.confirm_hide_location,
                    duplicate: e.$root.labels.confirm_duplicate_location,
                  },
                },
              },
            }),
          ],
          1
        );
      },
      staticRenderFns: [],
    };
  },
  1030: function (e, t) {
    e.exports = {
      render: function () {
        var e = this,
          t = e.$createElement,
          o = e._self._c || t;
        return o("div", { staticClass: "am-wrap" }, [
          o(
            "div",
            { staticClass: "am-body", attrs: { id: "am-locations" } },
            [
              o("page-header", {
                attrs: { locationsTotal: e.count },
                on: {
                  newLocationBtnClicked: function (t) {
                    return e.showDialogNewLocation();
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
              0 === e.locations.length &&
              !e.filterApplied &&
              e.fetchedFiltered
                ? o("div", { staticClass: "am-empty-state am-section" }, [
                    o("img", {
                      attrs: {
                        src: e.$root.getUrl + "public/img/emptystate.svg",
                      },
                    }),
                    e._v(" "),
                    o("h2", [e._v(e._s(e.$root.labels.no_locations_yet))]),
                    e._v(" "),
                    o("p", [e._v(e._s(e.$root.labels.click_add_locations))]),
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
                        (0 !== e.locations.length ||
                          (0 === e.locations.length && e.filterApplied) ||
                          !e.fetchedFiltered),
                      expression:
                        "fetched && options.fetched && (locations.length !== 0 || locations.length === 0 && filterApplied || !fetchedFiltered)",
                    },
                  ],
                },
                [
                  o(
                    "div",
                    { staticClass: "am-locations-filter am-section" },
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
                                { attrs: { sm: 8 } },
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
                                      { attrs: { sm: 8 } },
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
                                                on: { change: e.changeFilter },
                                                model: {
                                                  value: e.params.services,
                                                  callback: function (t) {
                                                    e.$set(
                                                      e.params,
                                                      "services",
                                                      t
                                                    );
                                                  },
                                                  expression: "params.services",
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
                                                            click: function (
                                                              o
                                                            ) {
                                                              return e.selectAllInCategory(
                                                                t.id
                                                              );
                                                            },
                                                          },
                                                        },
                                                        [
                                                          o("span", [
                                                            e._v(e._s(t.name)),
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
                                                              key: e.value,
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
                                        value: e.filterFields,
                                        expression: "filterFields",
                                      },
                                    ],
                                  },
                                  [
                                    o(
                                      "el-col",
                                      { attrs: { sm: 8 } },
                                      [
                                        o(
                                          "el-form-item",
                                          [
                                            o(
                                              "el-select",
                                              {
                                                staticClass: "calc-width sort",
                                                attrs: {
                                                  placeholder:
                                                    e.$root.labels.sort,
                                                },
                                                on: { change: e.filterData },
                                                model: {
                                                  value: e.params.sort,
                                                  callback: function (t) {
                                                    e.$set(e.params, "sort", t);
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
                            0 === e.locations.length &&
                            e.filterApplied &&
                            e.fetchedFiltered,
                          expression:
                            "fetched && locations.length === 0 && filterApplied && fetchedFiltered",
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
                  o(
                    "div",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: e.fetchedFiltered,
                          expression: "fetchedFiltered",
                        },
                      ],
                      staticClass: "am-locations am-section",
                    },
                    [
                      o(
                        "el-row",
                        { attrs: { gutter: 16 } },
                        [
                          e._l(e.locations, function (t, n) {
                            return [
                              "visible" === t.status || "hidden" === t.status
                                ? o(
                                    "el-col",
                                    { attrs: { lg: 8, md: 24 } },
                                    [
                                      o(
                                        "transition",
                                        { attrs: { name: "fade" } },
                                        [
                                          o(
                                            "div",
                                            {
                                              class: {
                                                "am-location-card am-hidden-entity":
                                                  "hidden" === t.status,
                                                "am-location-card":
                                                  "visible" === t.status,
                                              },
                                            },
                                            [
                                              o(
                                                "div",
                                                {
                                                  staticClass: "am-map-preview",
                                                },
                                                [
                                                  e.$root.settings.general
                                                    .gMapApiKey
                                                    ? o("img", {
                                                        attrs: {
                                                          src:
                                                            "https://maps.googleapis.com/maps/api/staticmap?size=1280x200&zoom=15&center=" +
                                                            t.latitude +
                                                            "," +
                                                            t.longitude +
                                                            "&markers=icon:" +
                                                            t.pin +
                                                            "%7C" +
                                                            t.latitude +
                                                            "," +
                                                            t.longitude +
                                                            "&key=" +
                                                            e.$root.settings
                                                              .general
                                                              .gMapApiKey,
                                                        },
                                                      })
                                                    : e._e(),
                                                ]
                                              ),
                                              e._v(" "),
                                              o(
                                                "div",
                                                {
                                                  staticClass:
                                                    "am-location-info",
                                                },
                                                [
                                                  o("img", {
                                                    staticClass:
                                                      "location-photo",
                                                    attrs: {
                                                      src: e.pictureLoad(t, !1),
                                                    },
                                                    on: {
                                                      error: function (o) {
                                                        return e.imageLoadError(
                                                          t,
                                                          !1
                                                        );
                                                      },
                                                    },
                                                  }),
                                                  e._v(" "),
                                                  o(
                                                    "div",
                                                    {
                                                      staticClass:
                                                        "location-data",
                                                    },
                                                    [
                                                      o("h4", [
                                                        e._v(
                                                          "\n                        " +
                                                            e._s(t.name) +
                                                            "\n                        "
                                                        ),
                                                        o(
                                                          "span",
                                                          {
                                                            staticClass:
                                                              "am-location-data-id",
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
                                                        "el-tooltip",
                                                        {
                                                          staticClass: "item",
                                                          attrs: {
                                                            effect: "dark",
                                                            content: t.address,
                                                            placement: "top",
                                                          },
                                                        },
                                                        [
                                                          o(
                                                            "p",
                                                            {
                                                              staticClass:
                                                                "address",
                                                            },
                                                            [
                                                              o(
                                                                "span",
                                                                {
                                                                  staticClass:
                                                                    "svg-icon",
                                                                },
                                                                [
                                                                  o("img", {
                                                                    staticClass:
                                                                      "svg",
                                                                    attrs: {
                                                                      alt: "Location Pin",
                                                                      src:
                                                                        e.$root
                                                                          .getUrl +
                                                                        "public/img/location.svg",
                                                                    },
                                                                  }),
                                                                ]
                                                              ),
                                                              e._v(
                                                                "\n                          " +
                                                                  e._s(
                                                                    t.address
                                                                  ) +
                                                                  "\n                        "
                                                              ),
                                                            ]
                                                          ),
                                                        ]
                                                      ),
                                                      e._v(" "),
                                                      o("p", [
                                                        e._v(e._s(t.phone)),
                                                      ]),
                                                    ],
                                                    1
                                                  ),
                                                  e._v(" "),
                                                  o(
                                                    "el-button",
                                                    {
                                                      on: {
                                                        click: function (t) {
                                                          return e.showDialogEditLocation(
                                                            n
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
                  ),
                  e._v(" "),
                  o("pagination-block", {
                    attrs: {
                      params: e.params,
                      count: e.options.countFiltered,
                      label: e.$root.labels.locations_lower,
                      visible:
                        e.fetched &&
                        0 !== e.locations.length &&
                        e.fetchedFiltered,
                    },
                    on: { change: e.filterData },
                  }),
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
                        attrs: {
                          src: e.$root.getUrl + "public/img/spinner.svg",
                        },
                      }),
                    ]
                  ),
                ],
                1
              ),
              e._v(" "),
              !0 === e.$root.settings.capabilities.canWrite
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
                            return e.showDialogNewLocation();
                          },
                        },
                      }),
                    ],
                    1
                  )
                : e._e(),
              e._v(" "),
              o(
                "transition",
                { attrs: { name: "slide" } },
                [
                  e.dialogLocation
                    ? o(
                        "el-dialog",
                        {
                          staticClass: "am-side-dialog am-dialog-location",
                          attrs: {
                            visible: e.dialogLocation,
                            "show-close": !1,
                          },
                          on: {
                            "update:visible": function (t) {
                              e.dialogLocation = t;
                            },
                          },
                        },
                        [
                          o("dialog-location", {
                            attrs: { location: e.location, locationsCategories: e.locationsCategories },
                            on: {
                              saveCallback: e.filterData,
                              duplicateCallback: e.duplicateLocationCallback,
                              closeDialog: function (t) {
                                e.dialogLocation = !1;
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
              o("el-col", { attrs: { md: 6 } }, [
                o(
                  "a",
                  {
                    staticClass: "am-help-button",
                    attrs: {
                      href: "https://wpamelia.com/locations/",
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
  667: function (e, t, o) {
    var n = o(685)(o(1026), o(1030), !1, null, null, null);
    e.exports = n.exports;
  },
  685: function (e, t) {
    e.exports = function (e, t, o, n, i, a) {
      var s,
        r = (e = e || {}),
        c = typeof e.default;
      ("object" !== c && "function" !== c) || ((s = e), (r = e.default));
      var l,
        u = "function" == typeof r ? r.options : r;
      if (
        (t &&
          ((u.render = t.render),
          (u.staticRenderFns = t.staticRenderFns),
          (u._compiled = !0)),
        o && (u.functional = !0),
        i && (u._scopeId = i),
        a
          ? ((l = function (e) {
              (e =
                e ||
                (this.$vnode && this.$vnode.ssrContext) ||
                (this.parent &&
                  this.parent.$vnode &&
                  this.parent.$vnode.ssrContext)) ||
                "undefined" == typeof __VUE_SSR_CONTEXT__ ||
                (e = __VUE_SSR_CONTEXT__),
                n && n.call(this, e),
                e && e._registeredComponents && e._registeredComponents.add(a);
            }),
            (u._ssrRegister = l))
          : n && (l = n),
        l)
      ) {
        var d = u.functional,
          m = d ? u.render : u.beforeCreate;
        d
          ? ((u._injectStyles = l),
            (u.render = function (e, t) {
              return l.call(t), m(e, t);
            }))
          : (u.beforeCreate = m ? [].concat(m, l) : [l]);
      }
      return { esModule: s, exports: r, options: u };
    };
  },
  686: function (e, t, o) {
    "use strict";
    var n =
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
            null !== e[i] && "object" === n(e[i]) && i in t
              ? o.replaceExistingObjectProperties(e[i], t[i])
              : i in t && (e[i] = t[i]);
          });
        },
        addMissingObjectProperties: function (e, t) {
          var o = this;
          Object.keys(t).forEach(function (i) {
            var a = !1;
            i in e ||
              ("object" === n(t[i])
                ? ((e[i] = {}), (a = !0))
                : ((e[i] = null), (a = !0))),
              null === t[i] || "object" !== n(t[i])
                ? a && (e[i] = t[i])
                : o.addMissingObjectProperties(e[i], t[i]);
          });
        },
        scrollView: function (e, t, o) {
          "undefined" != typeof jQuery &&
            ((void 0 !== o && o) || jQuery(window).width() <= 600) &&
            document.getElementById(e).scrollIntoView({
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
              n = {};
            return (
              t.split("&").forEach(function (e) {
                (o = e.split("=")),
                  (n[o[0]] = decodeURIComponent(o[1]).replace(/\+/g, " "));
              }),
              n
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
              var n = encodeURIComponent(t) + "=",
                i = o[1].split(/[&;]/g),
                a = i.length;
              a-- > 0;

            )
              -1 !== i[a].lastIndexOf(n, 0) && i.splice(a, 1);
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
            n = this.getNameInitials(e),
            i = Math.floor(Math.random() * this.colors.length),
            a = this.colors[i];
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
                a +
                "/fff?text=" +
                n
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
    var n = o(706),
      i = o(343),
      a = Object.prototype.toString;
    function s(e) {
      return "[object Array]" === a.call(e);
    }
    function r(e) {
      return null !== e && "object" == typeof e;
    }
    function c(e) {
      return "[object Function]" === a.call(e);
    }
    function l(e, t) {
      if (null !== e && void 0 !== e)
        if (("object" == typeof e || s(e) || (e = [e]), s(e)))
          for (var o = 0, n = e.length; o < n; o++) t.call(null, e[o], o, e);
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
      isFunction: c,
      isStream: function (e) {
        return r(e) && c(e.pipe);
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
      forEach: l,
      merge: function e() {
        var t = {};
        function o(o, n) {
          "object" == typeof t[n] && "object" == typeof o
            ? (t[n] = e(t[n], o))
            : (t[n] = o);
        }
        for (var n = 0, i = arguments.length; n < i; n++) l(arguments[n], o);
        return t;
      },
      extend: function (e, t, o) {
        return (
          l(t, function (t, i) {
            e[i] = o && "function" == typeof t ? n(t, o) : t;
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
        notify: function (e, t, o, n) {
          var i = this;
          void 0 === n && (n = ""),
            setTimeout(function () {
              i.$notify({
                customClass: n,
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
      var n, i, a, s;
      (s = void 0 !== o ? o : this.window || this.global),
        (i = []),
        (n = (function (e) {
          var t,
            o = {},
            n = !!document.querySelector && !!e.addEventListener,
            i = { initClass: "js-inlinesvg", svgSelector: "img.svg" },
            a = function () {
              var e = {},
                t = !1,
                o = 0,
                n = arguments.length;
              "[object Boolean]" ===
                Object.prototype.toString.call(arguments[0]) &&
                ((t = arguments[0]), o++);
              for (
                var i = function (o) {
                  for (var n in o)
                    Object.prototype.hasOwnProperty.call(o, n) &&
                      (t &&
                      "[object Object]" === Object.prototype.toString.call(o[n])
                        ? (e[n] = a(!0, e[n], o[n]))
                        : (e[n] = o[n]));
                };
                n > o;
                o++
              ) {
                i(arguments[o]);
              }
              return e;
            },
            s = function (e) {
              var o = document.querySelectorAll(t.svgSelector),
                n = (function (e, t) {
                  return function () {
                    return --e < 1 ? t.apply(this, arguments) : void 0;
                  };
                })(o.length, e);
              Array.prototype.forEach.call(o, function (e, o) {
                var i = e.src || e.getAttribute("data-src"),
                  a = e.attributes,
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
                        Array.prototype.slice.call(a).forEach(function (e) {
                          "src" !== e.name &&
                            "alt" !== e.name &&
                            o.setAttribute(e.name, e.value);
                        }),
                        o.classList
                          ? o.classList.add("inlined-svg")
                          : (o.className += " inlined-svg"),
                        o.setAttribute("role", "img"),
                        a.longdesc)
                      ) {
                        var i = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "desc"
                          ),
                          r = document.createTextNode(a.longdesc.value);
                        i.appendChild(r), o.insertBefore(i, o.firstChild);
                      }
                      if (a.alt) {
                        o.setAttribute("aria-labelledby", "title");
                        var c = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "title"
                          ),
                          l = document.createTextNode(a.alt.value);
                        c.appendChild(l), o.insertBefore(c, o.firstChild);
                      }
                      e.parentNode.replaceChild(o, e), n(t.svgSelector);
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
              n &&
                ((t = a(i, e || {})),
                s(o || function () {}),
                (document.documentElement.className += " " + t.initClass));
            }),
            o
          );
        })(s)),
        void 0 === (a = "function" == typeof n ? n.apply(t, i) : n) ||
          (e.exports = a);
    }.call(t, o(39)));
  },
  696: function (e, t, o) {
    var n = o(685)(o(703), o(704), !1, null, null, null);
    e.exports = n.exports;
  },
  697: function (e, t, o) {
    "use strict";
    (function (t) {
      var n = o(688),
        i = o(724),
        a = { "Content-Type": "application/x-www-form-urlencoded" };
      function s(e, t) {
        !n.isUndefined(e) &&
          n.isUndefined(e["Content-Type"]) &&
          (e["Content-Type"] = t);
      }
      var r,
        c = {
          adapter:
            ("undefined" != typeof XMLHttpRequest
              ? (r = o(707))
              : void 0 !== t && (r = o(707)),
            r),
          transformRequest: [
            function (e, t) {
              return (
                i(t, "Content-Type"),
                n.isFormData(e) ||
                n.isArrayBuffer(e) ||
                n.isBuffer(e) ||
                n.isStream(e) ||
                n.isFile(e) ||
                n.isBlob(e)
                  ? e
                  : n.isArrayBufferView(e)
                  ? e.buffer
                  : n.isURLSearchParams(e)
                  ? (s(t, "application/x-www-form-urlencoded;charset=utf-8"),
                    e.toString())
                  : n.isObject(e)
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
      (c.headers = { common: { Accept: "application/json, text/plain, */*" } }),
        n.forEach(["delete", "get", "head"], function (e) {
          c.headers[e] = {};
        }),
        n.forEach(["post", "put", "patch"], function (e) {
          c.headers[e] = n.merge(a);
        }),
        (e.exports = c);
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
    var n = (function () {
        function e(e, t) {
          for (var o = 0; o < t.length; o++) {
            var n = t[o];
            (n.enumerable = n.enumerable || !1),
              (n.configurable = !0),
              "value" in n && (n.writable = !0),
              Object.defineProperty(e, n.key, n);
          }
        }
        return function (t, o, n) {
          return o && e(t.prototype, o), n && e(t, n), t;
        };
      })(),
      i = r(o(721)),
      a = r(o(739)),
      s = r(o(740));
    function r(e) {
      return e && e.__esModule ? e : { default: e };
    }
    var c = (function () {
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
            t[e] = function (o, n) {
              return t.submit(e, o, n);
            };
          });
      }
      return (
        n(e, [
          {
            key: "submit",
            value: function (t, o) {
              var n = this,
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
                  e.defaults.axios[t](o, i, n.config())
                    .then(function (e) {
                      a(e.data);
                    })
                    .catch(function (e) {
                      n.handleError(e), s(e);
                    })
                    .then(function () {
                      return (n.isPending = !1);
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
    (c.defaults = { axios: i.default }), (e.exports = c);
  },
  703: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var n = o(700);
    t.default = {
      mixins: [n.a],
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
              var n = parseInt(o.slice(1)),
                i = this.countries.filter(function (e) {
                  return e.phonecode === n;
                });
              if (i.length) {
                var a = null;
                1 === n
                  ? (a = i.find(function (e) {
                      return 229 === e.id;
                    }))
                  : 44 === n
                  ? (a = i.find(function (e) {
                      return 228 === e.id;
                    }))
                  : 7 === n &&
                    (a = i.find(function (e) {
                      return 176 === e.id;
                    })),
                  (void 0 !== a && null !== a) || (a = i[0]),
                  (this.value = a.iso);
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
        for (var o = new Array(arguments.length), n = 0; n < o.length; n++)
          o[n] = arguments[n];
        return e.apply(t, o);
      };
    };
  },
  707: function (e, t, o) {
    "use strict";
    var n = o(688),
      i = o(725),
      a = o(727),
      s = o(728),
      r = o(729),
      c = o(708),
      l =
        ("undefined" != typeof window &&
          window.btoa &&
          window.btoa.bind(window)) ||
        o(730);
    e.exports = function (e) {
      return new Promise(function (t, u) {
        var d = e.data,
          m = e.headers;
        n.isFormData(d) && delete m["Content-Type"];
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
          m.Authorization = "Basic " + l(g + ":" + v);
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
              var o =
                  "getAllResponseHeaders" in p
                    ? s(p.getAllResponseHeaders())
                    : null,
                n = {
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
              i(t, u, n), (p = null);
            }
          }),
          (p.onerror = function () {
            u(c("Network Error", e, null, p)), (p = null);
          }),
          (p.ontimeout = function () {
            u(
              c("timeout of " + e.timeout + "ms exceeded", e, "ECONNABORTED", p)
            ),
              (p = null);
          }),
          n.isStandardBrowserEnv())
        ) {
          var b = o(731),
            y =
              (e.withCredentials || r(e.url)) && e.xsrfCookieName
                ? b.read(e.xsrfCookieName)
                : void 0;
          y && (m[e.xsrfHeaderName] = y);
        }
        if (
          ("setRequestHeader" in p &&
            n.forEach(m, function (e, t) {
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
  708: function (e, t, o) {
    "use strict";
    var n = o(726);
    e.exports = function (e, t, o, i, a) {
      var s = new Error(e);
      return n(s, t, o, i, a);
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
    function n(e) {
      this.message = e;
    }
    (n.prototype.toString = function () {
      return "Cancel" + (this.message ? ": " + this.message : "");
    }),
      (n.prototype.__CANCEL__ = !0),
      (e.exports = n);
  },
  713: function (e, t, o) {
    var n = o(685)(o(744), o(745), !1, null, null, null);
    e.exports = n.exports;
  },
  717: function (e, t, o) {
    var n = o(685)(o(718), o(719), !1, null, null, null);
    e.exports = n.exports;
  },
  718: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var n = o(337);
    t.default = {
      mixins: [n.a],
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
    var n = o(688),
      i = o(706),
      a = o(723),
      s = o(697);
    function r(e) {
      var t = new a(e),
        o = i(a.prototype.request, t);
      return n.extend(o, a.prototype, t), n.extend(o, t), o;
    }
    var c = r(s);
    (c.Axios = a),
      (c.create = function (e) {
        return r(n.merge(s, e));
      }),
      (c.Cancel = o(710)),
      (c.CancelToken = o(737)),
      (c.isCancel = o(709)),
      (c.all = function (e) {
        return Promise.all(e);
      }),
      (c.spread = o(738)),
      (e.exports = c),
      (e.exports.default = c);
  },
  723: function (e, t, o) {
    "use strict";
    var n = o(697),
      i = o(688),
      a = o(732),
      s = o(733),
      r = o(735),
      c = o(736);
    function l(e) {
      (this.defaults = e),
        (this.interceptors = { request: new a(), response: new a() });
    }
    (l.prototype.request = function (e) {
      "string" == typeof e &&
        (e = i.merge({ url: arguments[0] }, arguments[1])),
        ((e = i.merge(n, this.defaults, { method: "get" }, e)).method =
          e.method.toLowerCase()),
        e.baseURL && !r(e.url) && (e.url = c(e.baseURL, e.url));
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
      i.forEach(["delete", "get", "head", "options"], function (e) {
        l.prototype[e] = function (t, o) {
          return this.request(i.merge(o || {}, { method: e, url: t }));
        };
      }),
      i.forEach(["post", "put", "patch"], function (e) {
        l.prototype[e] = function (t, o, n) {
          return this.request(i.merge(n || {}, { method: e, url: t, data: o }));
        };
      }),
      (e.exports = l);
  },
  724: function (e, t, o) {
    "use strict";
    var n = o(688);
    e.exports = function (e, t) {
      n.forEach(e, function (o, n) {
        n !== t &&
          n.toUpperCase() === t.toUpperCase() &&
          ((e[t] = o), delete e[n]);
      });
    };
  },
  725: function (e, t, o) {
    "use strict";
    var n = o(708);
    e.exports = function (e, t, o) {
      var i = o.config.validateStatus;
      o.status && i && !i(o.status)
        ? t(
            n(
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
    e.exports = function (e, t, o, n, i) {
      return (
        (e.config = t), o && (e.code = o), (e.request = n), (e.response = i), e
      );
    };
  },
  727: function (e, t, o) {
    "use strict";
    var n = o(688);
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
    e.exports = function (e, t, o) {
      if (!t) return e;
      var a;
      if (o) a = o(t);
      else if (n.isURLSearchParams(t)) a = t.toString();
      else {
        var s = [];
        n.forEach(t, function (e, t) {
          null !== e &&
            void 0 !== e &&
            (n.isArray(e) && (t += "[]"),
            n.isArray(e) || (e = [e]),
            n.forEach(e, function (e) {
              n.isDate(e)
                ? (e = e.toISOString())
                : n.isObject(e) && (e = JSON.stringify(e)),
                s.push(i(t) + "=" + i(e));
            }));
        }),
          (a = s.join("&"));
      }
      return a && (e += (-1 === e.indexOf("?") ? "?" : "&") + a), e;
    };
  },
  728: function (e, t, o) {
    "use strict";
    var n = o(688);
    e.exports = function (e) {
      var t,
        o,
        i,
        a = {};
      return e
        ? (n.forEach(e.split("\n"), function (e) {
            (i = e.indexOf(":")),
              (t = n.trim(e.substr(0, i)).toLowerCase()),
              (o = n.trim(e.substr(i + 1))),
              t && (a[t] = a[t] ? a[t] + ", " + o : o);
          }),
          a)
        : a;
    };
  },
  729: function (e, t, o) {
    "use strict";
    var n = o(688);
    e.exports = n.isStandardBrowserEnv()
      ? (function () {
          var e,
            t = /(msie|trident)/i.test(navigator.userAgent),
            o = document.createElement("a");
          function i(e) {
            var n = e;
            return (
              t && (o.setAttribute("href", n), (n = o.href)),
              o.setAttribute("href", n),
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
            (e = i(window.location.href)),
            function (t) {
              var o = n.isString(t) ? i(t) : t;
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
    var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    function i() {
      this.message = "String contains an invalid character";
    }
    (i.prototype = new Error()),
      (i.prototype.code = 5),
      (i.prototype.name = "InvalidCharacterError"),
      (e.exports = function (e) {
        for (
          var t, o, a = String(e), s = "", r = 0, c = n;
          a.charAt(0 | r) || ((c = "="), r % 1);
          s += c.charAt(63 & (t >> (8 - (r % 1) * 8)))
        ) {
          if ((o = a.charCodeAt((r += 0.75))) > 255) throw new i();
          t = (t << 8) | o;
        }
        return s;
      });
  },
  731: function (e, t, o) {
    "use strict";
    var n = o(688);
    e.exports = n.isStandardBrowserEnv()
      ? {
          write: function (e, t, o, i, a, s) {
            var r = [];
            r.push(e + "=" + encodeURIComponent(t)),
              n.isNumber(o) && r.push("expires=" + new Date(o).toGMTString()),
              n.isString(i) && r.push("path=" + i),
              n.isString(a) && r.push("domain=" + a),
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
    var n = o(688);
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
        n.forEach(this.handlers, function (t) {
          null !== t && e(t);
        });
      }),
      (e.exports = i);
  },
  733: function (e, t, o) {
    "use strict";
    var n = o(688),
      i = o(734),
      a = o(709),
      s = o(697);
    function r(e) {
      e.cancelToken && e.cancelToken.throwIfRequested();
    }
    e.exports = function (e) {
      return (
        r(e),
        (e.headers = e.headers || {}),
        (e.data = i(e.data, e.headers, e.transformRequest)),
        (e.headers = n.merge(
          e.headers.common || {},
          e.headers[e.method] || {},
          e.headers || {}
        )),
        n.forEach(
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
  734: function (e, t, o) {
    "use strict";
    var n = o(688);
    e.exports = function (e, t, o) {
      return (
        n.forEach(o, function (o) {
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
    var n = o(710);
    function i(e) {
      if ("function" != typeof e)
        throw new TypeError("executor must be a function.");
      var t;
      this.promise = new Promise(function (e) {
        t = e;
      });
      var o = this;
      e(function (e) {
        o.reason || ((o.reason = new n(e)), t(o.reason));
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
    var n,
      i = (function () {
        function e(e, t) {
          for (var o = 0; o < t.length; o++) {
            var n = t[o];
            (n.enumerable = n.enumerable || !1),
              (n.configurable = !0),
              "value" in n && (n.writable = !0),
              Object.defineProperty(e, n.key, n);
          }
        }
        return function (t, o, n) {
          return o && e(t.prototype, o), n && e(t, n), t;
        };
      })(),
      a = o(13),
      s = (n = a) && n.__esModule ? n : { default: n };
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
  740: function (e, t, o) {
    "use strict";
    function n(e) {
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
    e.exports = function e(t, o, s, r) {
      if (
        (o instanceof FormData && ((r = s), (s = o), (o = null)),
        ((o = o || {}).indices = !n(o.indices) && o.indices),
        (o.nulls = !!n(o.nulls) || o.nulls),
        (s = s || new FormData()),
        n(t))
      )
        return s;
      if (
        (function (e) {
          return null === e;
        })(t)
      )
        o.nulls && s.append(r, "");
      else if (i(t))
        if (t.length)
          t.forEach(function (t, n) {
            var i = r + "[" + (o.indices ? n : "") + "]";
            e(t, o, s, i);
          });
        else {
          var c = r + "[]";
          s.append(c, "");
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
            : Object.keys(t).forEach(function (n) {
                var a = t[n];
                if (i(a))
                  for (; n.length > 2 && n.lastIndexOf("[]") === n.length - 2; )
                    n = n.substring(0, n.length - 2);
                e(a, o, s, r ? r + "[" + n + "]" : n);
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
  744: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var n = o(702),
      i = o.n(n),
      a = o(691),
      s = o(337),
      r = o(701),
      c = o(741);
    t.default = {
      mixins: [a.a, s.a, r.a, c.a],
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
            o = this.$root;
          this.$parent.$refs[this.formName].validate(function (n, i) {
            if (!n)
              return (
                "appointment" === t.formName &&
                  t.handleAppointmentDialogTabChange(i),
                t.$emit("validationFailCallback"),
                !1
              );
            (t.dialogLoading = !0),
              t.isNew ? t.addEntity(e) : t.editEntity(e),
              (t.$root = o);
          });
        },
        onSuccess: function (e, t, o) {
          var n = this;
          this.$parent.$emit("saveCallback", o),
            setTimeout(function () {
              (n.dialogLoading = !1), n.$parent.$emit("closeDialog");
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
          for (var t = Object.keys(e), o = 0, n = 0; n < t.length; n++)
            o = t[n].startsWith("bookings.") ? o + 1 : o;
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
    var n = o(685)(o(793), o(794), !1, null, null, null);
    e.exports = n.exports;
  },
  792: function (e, t, o) {
    var n = o(685)(o(795), o(796), !1, null, null, null);
    e.exports = n.exports;
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
  955: function (e, t, o) {
    var n = o(685)(o(956), o(957), !1, null, null, null);
    e.exports = n.exports;
  },
  956: function (e, t, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var n = {
        street_number: "short_name",
        route: "long_name",
        locality: "long_name",
        administrative_area_level_1: "short_name",
        administrative_area_level_2: "county",
        country: "long_name",
        postal_code: "short_name",
      },
      i = ["locality", "administrative_area_level_3"],
      a = [
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
            this.geolocation.geocoder.geocode({ location: e }, function (e, o) {
              "OK" === o
                ? (e = t.filterGeocodeResultTypes(e))[0]
                  ? (t.$emit("placechanged", t.formatResult(e[0]), e[0], t.id),
                    t.update(e[0].formatted_address))
                  : t.$emit("error", "no result for provided coordinates")
                : t.$emit("error", "error getting address from coords");
            }));
        },
        geolocate: function () {
          var e = this;
          this.updateGeolocation(function (t, o) {
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
            var o = {};
            this.geolocationOptions &&
              Object.assign(o, this.geolocationOptions),
              navigator.geolocation.getCurrentPosition(
                function (o) {
                  var n = { lat: o.coords.latitude, lng: o.coords.longitude };
                  (e.geolocation.loc = n),
                    (e.geolocation.position = o),
                    t && t(n, o);
                },
                function (t) {
                  e.$emit("error", "Cannot get Coordinates from navigator", t);
                },
                o
              );
          }
        },
        biasAutocompleteLocation: function () {
          var e = this;
          this.enableGeolocation &&
            this.updateGeolocation(function (t, o) {
              var n = new google.maps.Circle({
                center: t,
                radius: o.coords.accuracy,
              });
              e.autocomplete.setBounds(n.getBounds());
            });
        },
        formatResult: function (e) {
          for (var t = {}, o = 0; o < e.address_components.length; o++) {
            var i = e.address_components[o].types[0];
            if (n[i]) {
              var a = e.address_components[o][n[i]];
              t[i] = a;
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
            o = [this.types];
          o.includes("(cities)") && (o = o.concat(i)),
            o.includes("(regions)") && (o = o.concat(a));
          var n = !0,
            s = !1,
            r = void 0;
          try {
            for (
              var c, l = e[Symbol.iterator]();
              !(n = (c = l.next()).done);
              n = !0
            ) {
              var u = c.value,
                d = !0,
                m = !1,
                p = void 0;
              try {
                for (
                  var h, f = u.types[Symbol.iterator]();
                  !(d = (h = f.next()).done);
                  d = !0
                ) {
                  var g = h.value;
                  if (o.includes(g)) {
                    t.push(u);
                    break;
                  }
                }
              } catch (e) {
                (m = !0), (p = e);
              } finally {
                try {
                  !d && f.return && f.return();
                } finally {
                  if (m) throw p;
                }
              }
            }
          } catch (e) {
            (s = !0), (r = e);
          } finally {
            try {
              !n && l.return && l.return();
            } finally {
              if (s) throw r;
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
});
