<!-- TODO: stylelintとprettierを追加 -->
<template>
  <div class="c-app">
    <div class="mainContents">
      <div class="mainTitle">
        <Title>
          Splitting The Cost
        </Title>
      </div>
      <div class="contents" v-if="!isNextPage">
        <ul v-if="errorList.length" class="errorList">
          <li v-for="error in errorList">{{ error }}</li>
        </ul>
        <div>
          <p>What is the 会計？</p>
          <input class="inputBox" ref="totalBoxRef" v-model="initalTotal" min="0" oninput="this.value = Math.abs(this.value)" type="number" />
        </div>
        <div>
          <p>割引ある？</p>
          <input class="inputBox" ref="discountBoxRef" v-model="discountTotal" min="0" oninput="this.value = Math.abs(this.value)" type="number" />
        </div>
        <div class="butonArea">
          <button @click="handleClickForStepOne">次へ</button>
        </div>
      </div>
      <div v-else>
        <div class="contents">
          <div class="menuItem">
            <p class="menuTitle">Person</p>
            <div class="radioGroup">
              <div class="radioItem">
                <input v-model="selectedPerson" class="inputRadio" @click="radioClick" type="radio" name="person" id="hannah" value="hannah" />
                <label class="radioLabel" for="hannah">Hannah</label>
              </div>
              <div class="radioItem">
                <input v-model="selectedPerson" class="inputRadio" @click="radioClick" type="radio" name="person" id="perry" value="perry" />
                <label class="radioLabel" for="perry">Perry</label>
              </div>
            </div>
          </div>
          <div class="menuItem">
            <p class="menuTitle">Product Name</p>
            <input class="inputBox" @keydown.enter="productNameEnterKey" ref="productNameRef" v-model="productName" type="text" />
          </div>
          <div class="menuItem">
            <p class="menuTitle">Price</p>
            <input class="inputBox" @keydown.enter="priceEnterKey" ref="priceRef" v-model="price" type="number" />
          </div>
          <div class="butonArea">
            <button @click="handleAddItem">Add Item</button>
          </div>
        </div>
        <div class="priceInfo contents">
          <div>
            <div class="boxTotal">
              <div class="box box__person1"></div>
              <div class="boxDescription">
                <span>{{ USERS.HANNAH.DISPLAY_NAME }}:</span><span class="singlePrice">{{formatPrice(hannahPay)}}</span>
              </div>
            </div>
            <div class="boxTotal">
              <div class="box box__person2"></div>
              <div class="boxDescription">
                <span>{{ USERS.PERRY.DISPLAY_NAME }}</span><span class="singlePrice">{{formatPrice(perryPay)}}</span>
              </div>
            </div>
            <div class="boxTotal">
              <div class="boxDescription">
                <span>割引:</span><span class="singlePrice">{{ discountTotal ? formatPrice(discountTotal) : 0}}</span>
              </div>
            </div>
            <div class="boxTotal">
              <div class="boxDescription">
                <span>HannahとPerryの記入分:</span><span class="singlePrice">{{formatPrice(bothTotals)}}</span>
              </div>
            </div>
            <div class="boxTotal">
              <div class="boxDescription">
                <span>二人で払う分:</span><span class="singlePrice">{{formatPrice(allTotal)}}</span>
              </div>
            </div>
          </div>
          <div class="finalTotalInfo">
            <span class="totalText">合計:<span class="grandTotal">{{ formatPrice(initalTotal) }}</span></span><button>合計編集</button>
          </div>
          <div class="finalTotalInfo">
            <span class="totalText">合計(割引含め):<span class="grandTotal">{{ formatPrice(discountedTotal) }}</span></span>
          </div>
        </div>
        <div class="priceTable">
          <table class="theActualPriceTable">
            <tbody>
              <tr class="tableRow">
                <th>Name</th>
                <th>Price</th>
              </tr>
              <!-- TODO: 重複なコードをなくす方法は検討必須 -->
              <tr v-for="data in hannahData.items" class="tableRow tableRow__person1">
                <td>{{ data.productName }}</td>
                <td>{{ formatPrice(data.price) }}</td>
                <td>
                  <button @click="handleEditItem(data)" class="editButton">Edit</button>
                  <button @click="handleDeleteItem(data)" class="deleteButton">Delete</button>
                </td>
              </tr>
              <tr v-for="data in perryData.items" class="tableRow tableRow__person2">
                <td>{{ data.productName }}</td>
                <td>{{ formatPrice(data.price) }}</td>
                <td>
                  <button @click="handleEditItem(data)" class="editButton">Edit</button>
                  <button @click="handleDeleteItem(data)" class="deleteButton">Delete</button>
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

interface ItemData {
  productName: string;
  price: number;
}
interface ShoppingData {
  name: string;
  items: ItemData[];
}
const USERS = {
  PERRY: {
    DISPLAY_NAME: 'Perry',
    NAME: 'perry'
  },
  HANNAH: {
    DISPLAY_NAME: 'Hannah',
    NAME: 'hannah'
  }
} as const;
const ENTER_KEY = 13
const initalTotal = ref(0)
const discountTotal = ref(0)
const totalBoxRef = ref()
const discountBoxRef = ref()
const productNameRef = ref()
const productName = ref()
const priceRef = ref()
const price = ref()
const isNextPage = ref(false)
const errorList = ref<string[]>([])
// TODO: 分かりにくい変数名になってる、、
const selectedPerson = ref<string>(USERS.HANNAH.NAME)
const perryData = ref<ShoppingData>({
  name: USERS.PERRY.DISPLAY_NAME,
  items: []
}) 
const hannahData = ref<ShoppingData>({
  name: USERS.HANNAH.DISPLAY_NAME,
  items: []
}) 

const productNameEnterKey = () => {
  console.log('productNameEnterKey');
  priceRef.value.focus()
}

// TODO: anyをなくす
const priceEnterKey = () => {
  console.log('priceEnterKey');
  handleAddItem();
  productNameRef.value.focus()
} 

const getPersonalTotal = (data: ShoppingData) => {
  console.log('getPersonalTotal: data: ', data);
  let total = 0;
  data.items.forEach((item) => {
    total += item.price;
  });
  return total;
};

// TODO: anyをなくす
const handleEditItem = (data: any) => {
  console.log('handleEditItem: data: ', data);
  // TODO: 挙動
}
// TODO: anyをなくす
const handleDeleteItem = (data: any) => {
  console.log('handleDeleteItem: data: ', data);
  // TODO: 挙動
}

const totalPay = computed(() => {
  return {
    perry: getPersonalTotal(perryData.value),
    hannah: getPersonalTotal(hannahData.value)
  }
});
const bothTotals = computed(() => totalPay.value.perry + totalPay.value.hannah)
const discountedTotal = computed(() => initalTotal.value - discountTotal.value)
const allTotal = computed(() => discountedTotal.value - bothTotals.value)
const ourIndividualSplit = computed(() => allTotal.value / 2)
const hannahPay = computed(() => Math.floor(totalPay.value.hannah + ourIndividualSplit.value))
const perryPay = computed(() => discountedTotal.value - hannahPay.value
)

// const bothTotals = totalPay.perry + totalPay.hannah;
// const allTotal = discountedTotal - bothTotals;
// const ourIndividualSplit = allTotal / 2;
// const hannahPay = Math.floor(totalPay.hannah + ourIndividualSplit);
// const perryPay = discountedTotal - hannahPay


const formatPrice = (price: number) => {
  return `${price.toLocaleString("en-US")}円`
}

const isStepOneValid = () => {
  const isDiscountPriceHigherThanTotalCost = discountTotal.value > initalTotal.value
  const isInitialTotalEmpty = initalTotal.value === 0
  const isDiscountOrTotalCostNegative = initalTotal.value < 0 || discountTotal.value < 0

  if (isDiscountPriceHigherThanTotalCost) {
    errorList.value.push('割引は会計より高い値段になってしまいましたので再記入してください');
  }
  if (isInitialTotalEmpty) {
    errorList.value.push('会計は空');
  }
  if (isDiscountOrTotalCostNegative) {
    errorList.value.push('会計または割引はnegative数字になってる');
  }
  return !isDiscountPriceHigherThanTotalCost && !isInitialTotalEmpty && !isDiscountOrTotalCostNegative
}

const handleClickForStepOne = () => {
  if(!isStepOneValid()) {
    return;
  }
  isNextPage.value = true
}
const radioClick = () => {
  productNameRef.value.focus()
}
const handleAddItem = () => {
  console.log('handleAddItem')
  const isProductNameError = false;
  const isPrice = false;
  if (isProductNameError) {
    // TODO: add error message for product name
    return;
  }
  if (isPrice) {
    // TODO: add error message for product name
    return;
  }
  const newItem: ItemData = {
    productName: productName.value,
    price: price.value
  }
  if (selectedPerson.value === USERS.HANNAH.NAME) {
    hannahData.value.items.push(newItem)
  }
  if (selectedPerson.value === USERS.PERRY.NAME) {
    perryData.value.items.push(newItem)
  }
  productName.value = ""
  price.value = ""
}

onMounted(() => {
  window.onbeforeunload = function() {
    return '';
  };
  // TODO: keyupだとvue3のやり方ありそうなので確認必須
  // TODO: 重複なコードをなくす
  // TODO: anyをなくす
  totalBoxRef.value?.addEventListener('keyup', (event: any) => {
    if (event.keyCode === ENTER_KEY) {
      console.log('enter was pressed')
      discountBoxRef.value.focus();
    }
  })
  discountBoxRef.value?.addEventListener('keyup', (event: any) => {
    if (event.keyCode === ENTER_KEY) {
      console.log('enter was pressed')
      handleClickForStepOne()
    }
  })
  productNameRef.value?.addEventListener('keyup', (event: any) => {
    if (event.keyCode === ENTER_KEY) {
      console.log('enter was pressed')
      priceRef.value.focus();
    }
  })
  priceRef.value?.addEventListener('keyup', (event: any) => {
    if (event.keyCode === ENTER_KEY) {
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

.mainContents {
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
  border-bottom: 1px solid #D9D9D9;
  padding-bottom: 15px;
  margin-bottom: 15px;
}
.errorList {
  display: inline-block;
  background: #ff000030;
  border-radius: 10px;
  padding: 10px;
  border: 1px red solid;
  padding-left: 30px;
}

.singlePrice {
  font-weight: bold;
  font-size: 25px;
  margin-left: 5px;
}

.editButton {

}
.deleteButton {
  margin-left: 10px;
}
</style>