
<!-- TODO: backカメラがない場合、、、 -->
<!-- TODO: stylelintとprettierを追加 -->
<template>
  <video class="video" id="videoId"  ref="appleSauce" autoplay="true"></video>
  <img :src="dataUri"/>
  <div class="buttonArea">
    <button @click="takePhoto" class="snapshotButton">Press Me</button>
  </div>
  
</template>
<script lang="ts" setup>
import CameraPhoto, { FACING_MODES, IMAGE_TYPES } from 'jslib-html5-camera-photo';

const appleSauce = ref<HTMLVideoElement>()
let cameraPhoto: CameraPhoto;
let dataUri = ref<string>();
const takePhoto = () => {
    console.log('takePhoto')
    let sizeFactor = 1;
    let imageType = IMAGE_TYPES.JPG;
    let imageCompression = 1;

    let config = {
      sizeFactor,
      imageType,
      imageCompression
    };
    dataUri.value = cameraPhoto.getDataUri(config);
  }



  onMounted(() => {
    console.log('onMounted: appleSauce: ', appleSauce);
    // TODO: assertion ! を削除
    cameraPhoto = new CameraPhoto(appleSauce.value!);
    cameraPhoto.startCamera(FACING_MODES['ENVIRONMENT'])
    .then(() => {
      let log = `Camera started with default All`;
      console.log(log);
    })
    .catch((error) => {
      console.error('Camera not started!', error);
    });

    })


</script>
<style lang="scss" scoped>
.video {
  width: 100%;
}

.buttonArea {
  margin: 0 10px;
}

.snapshotButton {
  width: 100%;
  background: #2d2f31;
  color: #fff;
  border-radius: 10px;
  padding: 10px 0px;
  font-weight: 700;
  display: inline-block;
}
</style>