(function() {
  var Holder;

  Holder = function(Backbone, _, MixinBackbone, common) {
    var $, BootstrapModal, SuperClass;
    SuperClass = MixinBackbone(Backbone.Epoxy.View);
    $ = Backbone.$;
    BootstrapModal = SuperClass.extend({
      initialize: function() {
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
        return this.$modalEl.modal("show");
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
    BootstrapModal.version = '0.0.3';
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
