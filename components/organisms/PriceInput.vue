<template>
  <div class="contents">
    <div class="menuItem">
      <div class="menuTitle">Person</div>
      <div class="radioGroup">
        <div class="radioItem">
          <input
            v-model="selectedPerson"
            class="inputRadio"
            @click="handleRadioClick"
            type="radio"
            name="person"
            id="hannah"
            value="hannah"
          />
          <label class="radioLabel" for="hannah">Hannah</label>
        </div>
        <div class="radioItem">
          <input
            v-model="selectedPerson"
            class="inputRadio"
            @click="handleRadioClick"
            type="radio"
            name="person"
            id="perry"
            value="perry"
          />
          <label class="radioLabel" for="perry">Perry</label>
        </div>
      </div>
    </div>
    <div class="menuItem">
      <div class="menuTitle">Product Name</div>
      <input
        class="inputBox"
        @keydown.enter="productNameEnterKey"
        ref="productNameRef"
        v-model="productName"
        type="text"
      />
    </div>
    <div class="menuItem">
      <div class="menuTitle">Price</div>
      <input
        class="inputBox"
        @keydown.enter="handleAddItem"
        ref="priceRef"
        v-model="price"
        type="number"
        min="0"
      />
    </div>
    <div class="butonArea">
      <CommonButton @click="handleAddItem">Add Item</CommonButton>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { ItemData } from '@/interface/shopping'
import { USERS } from '@/constants/index'

const price = ref<Number | null>(null)
const productName = ref('')
const priceRef = ref()
const productNameRef = ref()
const selectedPerson = ref<string>(USERS.HANNAH.NAME)

const emit = defineEmits(['handle-add-item'])
const handleRadioClick = () => {
  productNameRef.value.focus()
}
const productNameEnterKey = () => {
  priceRef.value.focus()
}
const handleAddItem = () => {
  const itemToBeAdded: ItemData = {
    productName: productName.value,
    price: Number(price.value),
    userName: selectedPerson.value
  }
  productName.value = ''
  price.value = null
  productNameRef.value.focus()
  emit('handle-add-item', itemToBeAdded)
}
</script>
<style lang="scss" scoped>
// TODO: 全ページに反映するような方法ある？layoutかな
* {
  box-sizing: border-box;
}
// TODO: color変数は共通化
$personOne: #f4cccc;
$personTwo: #9fc5e8;
.priceInfo {
  padding: 0 15px;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom: 15px;
  margin-bottom: 15px;
}

.boxTotal {
  position: relative;
  margin-top: 10px;
}
.box {
  height: 25px;
  width: 25px;
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
  padding-left: 40px;
}
.singlePrice {
  font-weight: bold;
  font-size: 25px;
  margin-left: 5px;
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
.radioGroup {
  display: flex;
  gap: 10px;
}
.radioItem {
  display: flex;
  align-items: center;
}
.menuTitle {
  font-size: 20px;
  margin-bottom: 5px;
}
.menuItem {
  margin-top: 20px;
}
.butonArea {
  margin-top: 10px;
  text-align: right;
}
.inputBox {
  width: 100%;
  padding: 10px 5px;
}
.inputRadio {
  height: 20px;
  width: 20px;
}
.radioLabel {
  padding: 0 10px 0 5px;
}
</style>
