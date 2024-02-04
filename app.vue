
<!-- TODO: backカメラがない場合、、、 -->
<!-- TODO: stylelintとprettierを追加 -->
<template>
  <video class="video" id="videoId"  ref="appleSauce" autoplay="true"></video>
  <img :src="dataUri"/>
  <div class="buttonArea">
    <button @click="takePhoto" class="snapshotButton">Press Me</button>
  </div>
  <label for="recognition-image-input">Choose image</label>
  <input v-on:change="onChangeFunction" type="file" accept="image/jpeg, image/png" ref="recognitionImageInputElement" /><br />
  <label for="recognition-confidence-input">Confidence</label>
  <input style="width: 100px;"type="number" max="100" min="0" ref="recognitionConfidenceInputElement" value="70" /><br />
  <label for="recognition-progress">File recognition progress:</label>
  <progress ref="recognitionProgressElement" max="100" value="0">0%</progress>
  <div ref="recognitionTextElement"></div>
  <div ref="originalImageElement">
    <div id="original-image"></div>
    <div ref="labeledImageElement"></div>
</div>

</template>
<script lang="ts" setup>
import CameraPhoto, { FACING_MODES, IMAGE_TYPES } from 'jslib-html5-camera-photo';
import { createWorker, PSM, OEM } from 'tesseract.js';


const LANGUAGES = {
  ENGLISH: "eng",
  JAPANESE: "jpn"
}

// const imageUrl = 'https://tesseract.projectnaptha.com/img/eng_bw.png';
const receiptImage1 = 'http://localhost:3000/receipt.jpeg '
const receiptInvertImage1 = 'http://localhost:3000/receiptInvert.png '
const receiptImage2 = 'http://localhost:3000/receipt2.jpeg'
const receiptInvertImage2 = 'http://localhost:3000/invertedImage.png'
const WHITELIST_CHARATERS = {
  ENGLISH_LOWERCASE: 'abcdefghijklmnopqrstuvwxyz',
  // ENGLISH_LOWERCASE: '',
  ENGLISH_UPPERCASE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  // ENGLISH_UPPERCASE: '',
  NUMBERS: '0123456789',
  // NUMBERS: '',
  JAPANESE_HIRAGANA: 'ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをん',
  // JAPANESE_HIRAGANA: '',
  JAPANESE_KATAKANA: 'ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶ',
  // JAPANESE_KATAKANA: '',
  JAPANESE_SPECIAL: 'お釣り ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟ￥¥￥-'
}
const whitelistText = `${WHITELIST_CHARATERS.ENGLISH_LOWERCASE}${WHITELIST_CHARATERS.ENGLISH_UPPERCASE}${WHITELIST_CHARATERS.NUMBERS}${WHITELIST_CHARATERS.JAPANESE_HIRAGANA}${WHITELIST_CHARATERS.JAPANESE_KATAKANA}${WHITELIST_CHARATERS.JAPANESE_SPECIAL}`

const worker = await createWorker(LANGUAGES.JAPANESE);
// await worker.setParameters({
//     tessedit_char_whitelist: whitelistText,
//   });
console.log('test: worker: ', worker);



const recognize = async () => {
  console.log('start');
  await worker.load();
  console.log('await worker.initialize');
  const { data: { text } } = await worker.recognize(receiptInvertImage1);
  console.log(text);
  console.log('length is: ' ,text.length);
  let textSplit = text.split("\n")
  console.log('text.split("\n"): ' ,textSplit);
  let startIndex = 0
  let finishIndex = 0
  textSplit.forEach((item, index) => {
    if (item.indexOf('年') !== -1 &&
    item.indexOf('月') !== -1 &&
    item.indexOf('日') !== -1) {
      console.log('starting point line was: ', index)
      startIndex = index;
    }
    if (item.indexOf('合') !== -1 &&  !Number(item.at(item.length - 1))) {
      console.log('ending point line was: ', index)
      finishIndex = index;
    }
  });
  console.log('startIndex: ', startIndex);
  console.log('finishIndex: ', finishIndex);
  if (startIndex !== 0 && finishIndex !== 0) {
    for (let x = startIndex;x < finishIndex + 1;x++) {
      console.log(`textSplit[${x}]: `, textSplit[x])
    }
  }
  
  await worker.terminate();
  console.log('end'); 
}
console.log('before'); 
recognize();
console.log('after'); 

// 画像のOCR処理
// const readImageText = async() => {
//   try {
//     await worker.load()
//     // OCRで読み取りたい言語を設定
//     await worker.loadLanguage("jpn")
//     await worker.initialize("jpn")
//     const { data: { text } } = await worker.recognize(selectedImage) 
//     await worker.terminate()
    
//     // 日本語テキストはスペースが入ってしまう可能性があるので、スペースを削除
//     const strippedText = text.replace(/\s+/g, "")
//     onReadOcrData(strippedText)
//     setOcrState(STATUSES.SUCCEEDED)
//   } catch (err) {
//     setOcrState(STATUSES.FAILED)
//   }
// }


const recognitionImageInputElement = ref()
const recognitionConfidenceInputElement = ref()
const recognitionProgressElement = ref()
const recognitionTextElement = ref()
const originalImageElement = ref()
const labeledImageElement = ref()

// const recognize = async () => {
//       const img = document.getElementById('text-img');
//       console.log(img);
//       await worker.load();
//       await worker.loadLanguage('eng');
//       await worker.initialize('eng', OEM.LSTM_ONLY);
//       await worker.setParameters({
//         tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
//       });
//       const { data: { text } } = await worker.recognize(img);
//       console.log(text);
//     }


console.log();
console.log('recognitionImageInputElement: ', recognitionImageInputElement);
console.log('recognitionConfidenceInputElement: ', recognitionConfidenceInputElement);
console.log('recognitionProgressElement: ', recognitionProgressElement);
console.log('recognitionTextElement: ', recognitionTextElement);
console.log('originalImageElement: ', originalImageElement);
console.log('labeledImageElement: ', labeledImageElement);

// TODO: eventをなくす
const onChangeFunction = (event: any) => {
  console.log('change happened: event: ', event);
//  if (!recognitionImageElement.files) {
//    return null;
//  }
// const file = recognitionImageElement.files[0];
}

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