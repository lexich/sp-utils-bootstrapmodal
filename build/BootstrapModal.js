(function() {
  var Holder;

  Holder = function(Backbone, _, MixinBackbone, common) {
    var $, BootstrapModal, SuperClass;
    SuperClass = MixinBackbone(Backbone.Epoxy.View);
    $ = Backbone.$;
    BootstrapModal = SuperClass.extend({
      modal_keyboard: false,
      modal_backdrop: true,
      autoremove: true,
      initialize: function(options) {
        options || (options = {});
        this.autoremove = options.autoremove || this.autoremove;
        this.modal_backdrop = options.modal_backdrop || this.modal_backdrop;
        this.modal_keyboard = options.modal_keyboard || this.modal_keyboard;
        this.on("onClose", (function(_this) {
          return function() {
            return setTimeout((function() {
              if (_this.autoremove) {
                return _this.remove();
              }
            }), 10);
          };
        })(this));
        this.async = $.Deferred();
        this.async.promise().always((function(_this) {
          return function() {
            return _this.remove();
          };
        })(this));
        this.$modalEl = this.$el.find(".modal");
        this.isShown = false;
        return this._bindModal();
      },
      remove: function() {
        this._unbindModal();
        return SuperClass.prototype.remove.apply(this, arguments);
      },
      showAnimation: function(callback) {
        if (this.isShown === true) {
          return typeof callback === "function" ? callback() : void 0;
        }
        this._bindModal();
        this.$modalEl.one("shown.bs.modal", (function(_this) {
          return function() {
            _this.isShown = true;
            return typeof callback === "function" ? callback() : void 0;
          };
        })(this));
        return this.$modalEl.modal({
          backdrop: this.modal_backdrop,
          show: true,
          keyboard: this.modal_keyboard
        });
      },
      closeAnimation: function(callback) {
        if (this.isShown === false) {
          return typeof callback === "function" ? callback() : void 0;
        }
        this._unbindModal();
        this.$modalEl.one("hidden.bs.modal", (function(_this) {
          return function() {
            _this.isShown = false;
            return typeof callback === "function" ? callback() : void 0;
          };
        })(this));
        return this.$modalEl.modal("hide");
      },
      showModal: function() {
        common.app.modal.show(this);
        return this.async.promise();
      },
      ok: function(data) {
        if (data == null) {
          data = {};
        }
        common.app.modal.close(this, (function(_this) {
          return function() {
            return _this.async.resolve(data);
          };
        })(this));
        return this.async.promise();
      },
      cancel: function(err) {
        if (err == null) {
          err = "error";
        }
        common.app.modal.close(this, (function(_this) {
          return function() {
            return _this.async.reject(err);
          };
        })(this));
        return this.async.promise();
      },
      setAutoremove: function(autoremove) {
        this.autoremove = autoremove != null ? autoremove : true;
      },
      _bindModal: function() {
        this._unbindModal();
        return this.$modalEl.on("hidden.bs.modal", (function(_this) {
          return function() {
            _this.isShown = false;
            return _this.cancel("hide modal");
          };
        })(this));
      },
      _unbindModal: function() {
        return this.$modalEl.off("hidden.bs.modal");
      }
    });
    BootstrapModal.version = '0.0.5';
    return BootstrapModal;
  };

  if ((typeof define === 'function') && (typeof define.amd === 'object') && define.amd) {
    define(["backbone", "underscore", 'backbone-mixin', "common", 'epoxy', "bootstrap"], function(Backbone, _, MixinBackbone, common) {
      return Holder(Backbone, _, MixinBackbone, common);
    });
  } else {
    window.BootstrapModal = Holder(Backbone, _, MixinBackbone, common);
  }

}).call(this);
