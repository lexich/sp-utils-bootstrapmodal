Holder =(Backbone, _, MixinBackbone, common)->
  SuperClass = MixinBackbone(Backbone.Epoxy.View)
  $ = Backbone.$
  $body = $("body")
  BootstrapModal = SuperClass.extend
    modal_keyboard: false
    modal_backdrop: true
    autoremove: true

    constructor: ->
      initialize = @initialize
      @initialize = (options)->
        options or (options = {})
        @autoremove = options.autoremove or @autoremove
        @modal_backdrop = options.modal_backdrop or @modal_backdrop
        @modal_keyboard = options.modal_keyboard or @modal_keyboard
        @$modalEl = @$el.find(".modal")
        @$modalEl.attr "tabindex":"-1"
        @listenTo this, "onShow", -> $body.addClass "modal-open"
        @listenTo this, "onClose", => setTimeout (=> @remove() if @autoremove), 0
        @async = $.Deferred()
        @async.promise().always => @remove()

        @isShown = false
        @_bindModal()
        initialize?.apply this, arguments

      remove = @remove
      #prevent double remove call
      removeFlag = false
      @remove = ->
        return if removeFlag
        removeFlag = true
        @_unbindModal()
        SuperClass::remove.apply this, arguments
        remove?.apply this, arguments

      SuperClass::constructor.apply this, arguments

    showAnimation: (callback)->
      return callback?() if @isShown is true
      @_bindModal()
      @$modalEl.one "shown.bs.modal", =>
        @isShown = true
        callback?()
      @$modalEl.modal
        backdrop: @modal_backdrop
        show: true
        keyboard: @modal_keyboard

    closeAnimation: (callback)->
      return callback?() if @isShown is false
      @_unbindModal()
      @$modalEl.one "hidden.bs.modal", =>
        @isShown = false
        callback?()
      @$modalEl.modal "hide"

    showModal: ->
      common.app.modal.show this
      @async.promise()

    showChainModal: (ViewModal, options, params...)->
      autoremove = @autoremove
      @setAutoremove false
      @closeCurrent()
      view =  new ViewModal options
      view.showModal
        .apply(view, params)
        .always =>
          @setAutoremove autoremove
          @showCurrent()

    ok: (data={})->
      common.app.modal.close this, => @async.resolve data
      @async.promise()

    cancel: (err="error")->
      common.app.modal.close this, => @async.reject err
      @async.promise()

    setAutoremove: (@autoremove=true)->

    _bindModal: ->
      @_unbindModal()
      @$modalEl.on "hidden.bs.modal", =>
        @isShown = false
        @cancel "hide modal"

    _unbindModal: ->
      @$modalEl.off "hidden.bs.modal"

  BootstrapModal.version = '0.0.9'
  BootstrapModal

if (typeof define is 'function') and (typeof define.amd is 'object') and define.amd
  define [
    "backbone",
    "underscore",
    'backbone-mixin',
    "common",
    'epoxy',
    "bootstrap"
  ], (Backbone,_, MixinBackbone, common)->
    Holder(Backbone,_, MixinBackbone, common)
else
  window.BootstrapModal = Holder(Backbone,_, MixinBackbone, common)

