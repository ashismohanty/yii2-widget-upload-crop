# Yii2 Upload Crop Widget
Widget that makes a file input field in a form that stores an image about to be uploaded to the server and also the data to crop this image.

This Yii2 widget is upgraded from [Patroklo/yii2-widget-upload-crop](https://github.com/Patroklo/yii2-widget-upload-crop) to support Bootstrap v3.3.7.

### Additional Feature
- Set a default preview image to render in view.

## What is Upload Crop Widget?

This widget adds a new file input field that lets the user to upload images to the server through forms alongside the necessary data to be able to crop it. This data is obtained with javaScript with a crop selector that the user can use through a modal that it's oppened in the moment of selecting an image in the file input field.

Developed by Joseba Juániz ([@Patroklo](http://twitter.com/Patroklo))
Modified by Ashis Mohanty ([@uitrick](http://twitter.com/uitrick))

[Spanish version](https://github.com/Patroklo/yii2-widget-upload-crop/blob/master/README_spanish.md)

## Minimum requirements

* Yii2
* Php 5.4 or above.
* JQuery

## Future plans

* None at all.

## License

This is free software. It is released under the terms of the following BSD License.

Copyright (c) 2014, by Cyneek
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:
1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
3. Neither the name of Cyneek nor the names of its contributors
   may be used to endorse or promote products derived from this software
   without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER "AS IS" AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

## Installation

* Install [Yii 2](http://www.yiiframework.com/download)
* Install the package via [composer](http://getcomposer.org/download/) 
		
		"cyneek/yii2-widget-upload-crop": "dev-master"
		
* Profit!

## How it works

The widget will include by default all neccesary javaScript and fields in the form for its proper operation. Once the data has been sent from the form to the server, it will be necessary to get the file and crop data to be able to apply them to the model attribute and the image itself.

	echo \cyneek\yii2\widget\upload\crop\UploadCrop::widget(['form' => $form, 'model' => $model, 'attribute' => 'fieldName']);

Since this library it's a widget input field not linked to the ActiveForm system itself, there is the problem that it's impossible to make an input including all the default options and exceptions that the form that holds the widget has. This includes php or css changes, client validation configuration, and so on. To be able to solve this problem, the widget has an option that lets the developer adding the ActiveForm object into the widget, if defined, the widget will use it to make all the input fields.

## Recovering form image and cropt data

The form will send to the server the data this way:

* Image file: it must be assigned to the model attribute itself in the usual way. [For example](http://stackoverflow.com/questions/23592125/how-to-upload-a-file-to-directory-in-yii2?answertab=active#tab-top)

* Cropping values: they will be sent to Yii 2 in array form:


		["fieldName-cropping"]=>
		  array(4) {
			["x"]=>
				string(1) "12"
			["width"]=>
				string(3) "400"
			["y"]=>
				string(1) "0"
			["height"]=>
				string(3) "297"
		  }


## Widget method options

* model (string) (obligatory)
> Defines the model that will be used to make the form input field.


* attribute (string) (obligatory)
> Defines the model attribute that will be used to make de form input field.


* form (ActiveForm) (optional)
> Its the ActiveForm object that defines the form in which the widget it's included. It will be used to inherit the form config when making the input field.


* enableClientValidation (boolean) (optional)
> Used when the form option it's not defined. It establishes if it's or isn't activated in the widget input fields the Yii2 javaScript client validation.


* defaultPreviewImage (string) (optional)
> This image will be loaded into preview area and replaced with the actual image when available.

* imageOptions (array) (optional)
> List with options that will be added to the image field that will be used to define the crop data in the modal. The format should be ['option' => 'value'].

* jcropOptions (array) (optional)
> List with options that will be added in javaScript while creating the crop object. For more information about which options can be added you can [read this web](https://github.com/fengyuanchen/cropper#options).

* maxSize (integer) (optional)
> Being 300 by default, it's the attribute that defines the max-height and max-width that will be applied to the preview image that it's shown after selecting a crop zone.