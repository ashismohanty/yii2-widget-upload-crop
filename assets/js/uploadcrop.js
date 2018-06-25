/**
 * Uses cropper javascript widget from https://github.com/fengyuanchen/cropper
 *
 * Author: Joseba Juaniz
 * Year: 2015
 * 
 * Modified by: Ashis Kumar Mohanty
 * Year: 2018
 */

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node / CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals.
        factory(jQuery);
    }
})(function($) {

    'use strict';

    var console = window.console || { log: function() {} };

    function CropModal($element, options) {

        //cropper options
        this._jcropOptions = options['jcropOptions'];

        //main upload container
        this.$container = $element.parents('.uploadcrop');

        //image preview section
        this.$avatarView = this.$container.find('.preview-pane');
        this.$avatarViewContainer = this.$avatarView.find('.preview-container');

        //modal dialog
        this.$avatarModal = this.$container.find('div.modal');

        //modal dialog loading
        this.$loading = this.$container.find('.loading');

        //modal dialog body
        this.$avatarModalBody = this.$avatarModal.find('.modal-body');

        // this.$avatarSrc = this.$container.find('.cropper-src');
        this.$avatarData = this.$container.find('.cropper-data');
        // this.$avatarInput = this.$container.find('.cropper-input');
        this.$avatarInput = $('#' + options['inputField']);
        this.$avatarDone = this.$container.find('.cropper-done');
        this.$avatarBtns = this.$container.find('.cropper-btns');

        this.$avatarWrapper = this.$avatarModal.find('.cropper-wrapper');
        this.$avatarPreview = this.$avatarModal.find('.cropper-preview');

        this.init();
    }

    CropModal.prototype = {
        constructor: CropModal,

        support: {
            fileList: !!$('<input type="file">').prop('files'),
            blobURLs: !!window.URL && URL.createObjectURL,
            formData: !!window.FormData
        },

        init: function() {

            this.support.datauri = this.support.fileList && this.support.blobURLs;

            if (!this.support.formData) {
                this.initIframe();
            }

            this.initModal();
            this.addListener();
        },

        addListener: function() {
            this.$avatarInput.on('change', $.proxy(this.change, this));
            this.$avatarDone.on('click', $.proxy(this.cropDone, this));
            // this.$avatarBtns.on('click', $.proxy(this.rotate, this));
        },

        initModal: function() {
            this.$avatarModal.modal({
                backdrop: 'static',
                keyboard: false,
                show: false
            });
        },

        initIframe: function() {
            var target = 'upload-iframe-' + (new Date()).getTime();
            var $iframe = $('<iframe>').attr({
                name: target,
                src: ''
            });
            var _this = this;

            // Ready ifrmae
            $iframe.one('load', function() {

                // respond response
                $iframe.on('load', function() {
                    var data;

                    try {
                        data = $(this).contents().find('body').text();
                    } catch (e) {
                        console.log(e.message);
                    }

                    if (data) {
                        try {
                            data = $.parseJSON(data);
                        } catch (e) {
                            console.log(e.message);
                        }
                        _this.submitDone(data);
                    } else {
                        _this.submitFail('Image upload failed!');
                    }

                    _this.submitEnd();

                });
            });

            this.$iframe = $iframe;
            this.$avatarForm.attr('target', target).after($iframe.hide());
        },

        change: function() {

            var files;
            var file;

            //show modal
            //this.$avatarModal.modal('show');

            if (this.support.datauri) {

                files = this.$avatarInput.prop('files');

                if (files.length > 0) {
                    file = files[0];

                    //show modal
                    this.$avatarModal.modal('show');

                    //this is a image file
                    if (this.isImageFile(file)) {
                        if (this.url) {
                            URL.revokeObjectURL(this.url); // Revoke the old one
                        }

                        this.url = URL.createObjectURL(file);

                        //add an delay to get the width of the cropper wrapper
                        var _that = this;
                        setTimeout(function() { _that.startCropper() }, 500);

                    } else { // NOT a image file
                        this.alert('Please upload an image file.');
                        this.$avatarInput.val('');
                    }
                }
            } else {
                file = this.$avatarInput.val();
                if (this.isImageFile(file)) {
                    this.syncUpload();
                }
            }
        },

        rotate: function(e) {
            var data;

            if (this.active) {
                data = $(e.target).data();

                if (data.method) {
                    this.$img.cropper(data.method, data.option);
                }
            }
        },

        isImageFile: function(file) {
            if (file.type) {
                return /^image\/\w+$/.test(file.type);
            } else {
                return /\.(jpg|jpeg|png|gif)$/.test(file);
            }
        },

        startCropper: function() {

            var _this = this;

            if (this.active) {
                this.$img.cropper('replace', this.url);
            } else {
                this.$img = $('<img src="' + this.url + '">');
                this.$avatarWrapper.empty().html(this.$img);

                //set all crop options
                var cropOptions = this._jcropOptions;
                cropOptions.preview = this.$avatarPreview;
                cropOptions.crop = function(e) {
                    var json = [
                        '{"x":' + e.x,
                        '"y":' + e.y,
                        '"height":' + e.height,
                        '"width":' + e.width,
                        '"rotate":' + (_this._jcropOptions.rotatable ? e.rotate : 0) + '}'
                    ].join();

                    _this.$avatarData.val(json);
                };

                //initialize cropper
                this.$img.cropper(cropOptions);
                this.active = true;
            }

            this.$avatarModal.one('hidden.bs.modal', function() {
                _this.$avatarPreview.empty();
                _this.clearAlert();
                _this.stopCropper();
            });

        },

        stopCropper: function() {
            if (this.active) {
                this.$img.cropper('destroy');
                this.$img.remove();
                this.active = false;
            }
        },

        syncUpload: function() {
            this.$avatarDone.click();
        },

        cropDone: function() {

            if (!this.$avatarInput.val()) {
                return false;
            } else {

                //fix height and width of the preview container
                this.$avatarViewContainer.height(this.$avatarPreview.height());
                this.$avatarViewContainer.width(this.$avatarPreview.width());

                //add image to container
                this.$avatarViewContainer.html(this.$avatarPreview.html());

                //add a class to main container
                this.$container.addClass('cropper-done');

                this.stopCropper();
                this.$avatarModal.modal('hide');
            }
        },

        alert: function(msg) {
            var $alert = [
                '<div class="alert alert-danger cropper-alert alert-dismissable">',
                '<button type="button" class="close" data-dismiss="alert">&times;</button>',
                msg,
                '</div>'
            ].join('');

            this.$avatarModalBody.prepend($alert);

            //remove all error messages
            var _this = this;
            this.$avatarModal.one('hidden.bs.modal', function() {
                _this.clearAlert();
            });
        },

        clearAlert: function() {
            this.$avatarModalBody.find('div.alert').remove();
        }
    };

    //Extend jQuery with uploadCrop function.

    var NAMESPACE = 'uploadCrop';
    var noConflictUploadCrop = $.fn.uploadCrop;

    //Extend jQuery with uploadCrop function.
    $.fn.uploadCrop = function jQueryUploadCrop(option) {

        var result = void 0;

        return this.each(function(i, element) {

            var $this = $(element);
            var data = $this.data(NAMESPACE);

            if (!data) {
                var options = $.extend({}, $this.data(), $.isPlainObject(option) && option);
                $this.data(NAMESPACE, data = new CropModal($this, options));
            }

            if (typeof option === 'string') {
                var fn = data[option];

                if ($.isFunction(fn)) {
                    result = fn.apply(data, args);
                }
            }

            return typeof result !== 'undefined' ? result : this;
        });
    }

    // No conflict
    $.fn.uploadCrop.noConflict = function noConflict() {
        $.fn.uploadCrop = noConflictUploadCrop;
        return this;
    };

});