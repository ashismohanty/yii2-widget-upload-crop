<?php
/**
 * UploadCrop Widget
 *
 * @author Joseba Juaniz <joseba.juaniz@gmail.com>
 * @since 1.0
 *
 * @author Ashis Mohanty <ashismohanty82@gmail.com>
 * @since 2.0
 */

namespace uitrick\yii2\widget\upload\crop;

use Yii;
use yii\base\InvalidParamException;
use yii\base\Widget;
use yii\bootstrap\Modal;
use yii\helpers\Html;
use yii\helpers\Json;
use yii\widgets\ActiveForm;

class UploadCrop extends Widget
{
	/** @var \yii\db\ActiveRecord */
	var $model;

	/** @var  string */
	var $attribute;

	/* @var ActiveForm */
	var $form = NULL;

	/** @var boolean */
	var $enableClientValidation;

	/** @var array */
	var $imageOptions;

	/** @var array */
	var $jcropOptions = array();

	/** @var integer */
	var $maxSize = 300;

	/** @var string */
	var $defaultPreviewImage = NULL;

	/**
	 * only call this method after a form closing and
	 *    when user hasn't used in the widget call the parameter $form
	 *    this adds to every form in the view the field validation.
	 *
	 * @param array $config
	 * @return string
	 * @throws \yii\base\InvalidConfigException
	 */
	static function manualValidation($config = [])
	{

		if (!array_key_exists('model', $config) || !array_key_exists('attribute', $config)) {
			throw new InvalidParamException('Config array must have a model and attribute.');
		}

		$view = Yii::$app->getView();
		$field_id = Html::getInputId($config['model'], $config['attribute']);
		$view->registerJs('$("#' . $field_id . '").urlParser("launchValidation");');
	}


	/**
	 * Renders the field.
	 */
	public function run()
	{
		if (is_null($this->imageOptions))
		{
			$this->imageOptions = [
				'alt' => 'Crop this image'
			];
		}

		$this->imageOptions['id'] = Yii::$app->getSecurity()->generateRandomString(10);

		$inputField = Html::getInputId($this->model, $this->attribute, ['data-image_id' => $this->imageOptions['id']]);

		$default_jcropOptions = [
								'dashed' => FALSE,
								'zoomable' => FALSE,
								'rotatable' => FALSE];


		$this->jcropOptions = array_merge($default_jcropOptions, $this->jcropOptions);


		if (is_null($this->form))
		{
			$this->form = new ActiveForm();

			if (!is_null($this->enableClientValidation))
			{
				$this->form->enableClientValidation = $this->enableClientValidation;
			}
		}

		echo Html::beginTag('div', ['class' => 'uploadcrop']);
		echo $this->form->field($this->model, $this->attribute)->fileInput();	
		echo html::hiddenInput($this->attribute.'_data', '', ['class' => 'cropper-data']);


			echo Html::beginTag('div', ['class' => 'preview-pane']);
				echo Html::beginTag('div', ['class' => 'preview-container']);
					//echo Html::img('', ['class' => 'preview_image']);
					if (!is_null($this->defaultPreviewImage))
					{
						$defaultPreviewImageOptions = [							
							'id' => Yii::$app->getSecurity()->generateRandomString(10),
							'class' => 'preview_image'
						];
						echo Html::img($this->defaultPreviewImage, $defaultPreviewImageOptions);
					}
				echo Html::endTag('div');
			echo Html::endTag('div');

		Modal::begin([
			'id' => 'cropper-modal-'. $this->imageOptions['id'],
			'header' => '<h2>Crop image</h2>',
			'closeButton' => [],
			'footer' => '<div class="row cropper-btns"><div class="col-md-6">' . Html::button('Cancel', ['id' => $this->imageOptions['id'].'_button_cancel', 'class' => 'btn btn-default btn-block', 'data-dismiss' => 'modal']) . '</div><div class="col-md-6">' . Html::button('Accept', ['id' => $this->imageOptions['id'].'_button_accept', 'class' => 'btn btn-primary btn-block cropper-done']) . '</div></div>',
			'size' => Modal::SIZE_LARGE,
			'clientOptions' => ['backdrop' => 'static'] //To prevent closing when you drag outside the modal window
		]);

			echo Html::beginTag('div', ['id' => 'image-source'.$this->imageOptions['id'], 'class' => 'row cropper-body']);
				
				//Image crop area
				echo Html::beginTag('div', ['class' => 'col-md-9']);
					echo Html::beginTag('div', ['class' => 'cropper-wrapper']);
						//echo Html::img('', $this->imageOptions);
					echo Html::endTag('div');
				echo Html::endTag('div');

				//preview column
				echo Html::beginTag('div', ['class' => 'col-md-3']);
					echo Html::beginTag('div', ['class' => 'cropper-preview preview-lg']);
					echo Html::endTag('div');
				echo Html::endTag('div');
				
			echo Html::endTag('div');

			// echo html::hiddenInput($this->attribute.'-cropping[x]', '', ['id' => $inputField.'-x']);
			// echo html::hiddenInput($this->attribute.'-cropping[width]','', ['id' => $inputField.'-width']);
			// echo html::hiddenInput($this->attribute.'-cropping[y]', '', ['id' => $inputField.'-y']);
			// echo html::hiddenInput($this->attribute.'-cropping[height]','', ['id' => $inputField.'-height']);

		Modal::end();

		echo Html::endTag('div');

		$view = $this->getView();

		UploadCropAsset::register($view);

		$jcropOptions = ['inputField' => $inputField, 'jcropOptions' => $this->jcropOptions];

		$jcropOptions['maxSize'] = $this->maxSize;

		$jcropOptions = Json::encode($jcropOptions);

		$view->registerJs('jQuery("#'.$inputField.'").uploadCrop('.$jcropOptions.');');
	}
}
