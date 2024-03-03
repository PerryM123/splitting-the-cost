
<!-- TODO: stylelintとprettierを追加 -->
<template>
  <div class="c-app">
    <div class="crazy">
      <div class="mainTitle">
        <Title>
          Splitting The Cost
        </Title>
      </div>
      <div class="contents" v-if="!isNextPage">
        <div>
          <p>What is the 会計？</p>
          <input class="inputBox" ref="totalBoxRef" v-model="initalTotal" type="number" />
        </div>
        <div>
          <p>割引ある？</p>
          <input class="inputBox" ref="discountBoxRef" v-model="discountTotal" type="number" />
        </div>
        <div class="butonArea">
          <button @click="handleClick">次へ</button>
        </div>
      </div>
      <div v-else>
        <div class="contents">
          <div class="menuItem">
            <p class="menuTitle">Person</p>
            <div class="radioGroup">
              <div class="radioItem">
                <input class="inputRadio" @click="radioClick" type="radio" name="person" id="hannah" value="hannah" checked />
                <label class="radioLabel" for="hannah">Hannah</label>
              </div>
              <div class="radioItem">
                <input class="inputRadio" @click="radioClick" type="radio" name="person" id="perry" value="perry" />
                <label class="radioLabel" for="perry">Perry</label>
              </div>
            </div>
          </div>
          <div class="menuItem">
            <p class="menuTitle">Product Name</p>
            <input class="inputBox" ref="productNameRef" v-model="productName" type="text" />
          </div>
          <div class="menuItem">
            <p class="menuTitle">Price</p>
            <input class="inputBox" ref="priceRef" v-model="price" type="number" />
          </div>
          <div class="butonArea">
            <button @click="handleClick">Add Item</button>
          </div>
        </div>
        <div class="priceInfo contents">
          <div>
            <div class="boxTotal">
              <div class="box box__person1"></div>
              <div class="boxDescription">
                <span>Thomas:</span><span class="singlePrice">3,500円</span>
              </div>
            </div>
            <div class="boxTotal">
              <div class="box box__person2"></div>
              <div class="boxDescription">
                <span>Frank:</span><span class="singlePrice">3,500円</span>
              </div>
            </div>
            <div class="boxTotal">
              <div class="boxDescription">
                <span>二人の分:</span><span class="singlePrice">3,500円</span>
              </div>
            </div>
            <div class="boxTotal">
              <div class="boxDescription">
                <span>割引:</span><span class="singlePrice">3,500円</span>
              </div>
            </div>
          </div>
          <div class="finalTotalInfo">
            <span class="totalText">合計:</span><span class="grandTotal">4,339円</span><button>合計編集</button>
          </div>
        </div>
        <div class="priceTable">
          <table class="theActualPriceTable">
            <tbody>
              <tr class="tableRow">
                <th>Name</th>
                <th>Price</th>
              </tr>
              <tr class="tableRow tableRow__person1">
                <td>リンゴ</td>
                <td>1000円</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
              <tr class="tableRow tableRow__person1">
                <td>リンゴ</td>
                <td>1000円</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
              <tr class="tableRow tableRow__person2">
                <td>リンゴ</td>
                <td>1000円</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
              <tr class="tableRow tableRow__person2">
                <td>リンゴ</td>
                <td>1000円</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>


</template>
<script lang="ts" setup>
import Title from '@/components/atoms/Title.vue'
const initalTotal = ref()
const discountTotal = ref()
const text = ref()
const totalBoxRef = ref()
const discountBoxRef = ref()
const productNameRef = ref()
const productName = ref()
const priceRef = ref()
const price = ref()
const isNextPage = ref(false)

const handleClick = () => {
  isNextPage.value = true
}
const radioClick = () => {
  productNameRef.value.focus()
}
const handleAddItem = () => {
  console.log('handleAddItem')
}

onMounted(() => {
  console.log('on mounted');
  // TODO: 実装方法は確認必須
  window.onbeforeunload = function(e) {
    return 'Dialog text here.';
  };
  // TODO: 重複なコードをなくす
  // TODO: anyをなくす
  totalBoxRef.value?.addEventListener('keyup', (event: any) => {
    if (event.keyCode === 13) {
      console.log('enter was pressed')
      discountBoxRef.value.focus();
    }
  })
  discountBoxRef.value?.addEventListener('keyup', (event: any) => {
    if (event.keyCode === 13) {
      console.log('enter was pressed')
      handleClick()
    }
  })
  productNameRef.value?.addEventListener('keyup', (event: any) => {
    if (event.keyCode === 13) {
      console.log('enter was pressed')
      priceRef.value.focus();
    }
  })
  priceRef.value?.addEventListener('keyup', (event: any) => {
    if (event.keyCode === 13) {
      console.log('enter was pressed')
      handleAddItem()
    }
  })
});

</script>
<style lang="scss" scoped>
$personOne: #F4CCCC;
$personTwo: #9FC5E8;

* {
  box-sizing: border-box;
}

.c-app {
  display: flex;
  justify-content: center;
}

// TODO: class名変更必須
.crazy {
  width: 100%;
}

.inputBox {
  width: 100%;
}

.radioGroup {
  display: flex;
  gap: 10px;
}

.theActualPriceTable {
  display: table;
  border-collapse: collapse;
  width: 100%;
  
  .tableRow {
    border-bottom: 1px solid #ddd;
    
    &__person1 {
      background: $personOne;
    }
  
    &__person2 {
      background: $personTwo;
    }
  }

  th, td {
    text-align: left;
    padding: 8px;
  }
}
.boxTotal {
  position: relative;
  margin-top: 10px;
}

.butonArea {
  margin-top: 10px;
  text-align: right;
}

.box {
  height: 15px;
  width: 15px;
  border: 1px solid;
  position: absolute;
  top: 0px;
  left: 5px;

  &__person1 {
    background: $personOne;
  }
  &__person2 {
    background: $personTwo;
  }
}

.boxDescription {
  padding-left: 30px;
}
.totalText {
  font-size: 16px;
  font-weight: bold;
}
.grandTotal {
  font-size: 30px;
  font-weight: bold;
}
.finalTotalInfo {
  margin-top: 10px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.radioLabel {
  padding: 10px 10px 10px 5px;
}

.inputRadio {
  height: 20px;
  width: 20px;
}

.radioItem{
  display: flex;
    align-items: center;
}

.menuItem {
  margin-top: 10px;
}

.menuTitle {
  font-size: 20px;
  // TODO: normalizerをなくし、reset.cssに変更
  margin: 0;
}
.mainTitle {
  padding-top: 25px;
}
.contents {
  padding: 0 15px;
}
</style>