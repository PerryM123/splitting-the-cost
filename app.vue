<!-- TODO: localStorageでデータを保存？cookie？ -->
<template>
  <div class="c-app">
    <div v-if="isOpenEditModal || isOpenDeleteModal" class="modal">
      <div @click="handleClickBlackOverlay" class="blackModal"></div>
      <div v-if="isOpenEditModal" class="modalBox">
        <div>
          <h2 class="modalTitle">編集</h2>
          <div class="menuItem">
            <p class="menuTitle">Product Name</p>
            <input
              class="inputBox"
              @keydown.enter="editProductNameEnterKey"
              ref="editProductNameRef"
              v-model="editProductName"
              type="text"
            />
          </div>
          <div class="menuItem">
            <p class="menuTitle">Price</p>
            <input
              class="inputBox"
              @keydown.enter="editPriceEnterKey"
              ref="editPriceRef"
              v-model="editPrice"
              type="number"
              min="0"
            />
          </div>
          <div class="butonArea">
            <button @click="handleModalCancel">キャンセル</button>
            <button class="modalActionButton" @click="handleEditItem">
              編集
            </button>
          </div>
        </div>
      </div>
      <div v-if="isOpenDeleteModal" class="modalBox">
        <div>
          <h2 class="modalTitle">削除</h2>
          <div class="menuItem">
            <p class="menuTitle">Product Name</p>
            <span>{{ nameToDelete }}</span>
            <p class="menuTitle" style="margin-top: 10px">Price</p>
            <span>{{ formatPrice(priceToDelete) }}</span>
            <p>上記を削除しますか？</p>
          </div>
          <div class="butonArea">
            <button @click="handleModalCancel">キャンセル</button>
            <button class="modalActionButton" @click="handleDeleteItem">
              削除
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="mainContents">
      <div class="mainTitle">
        <Title> Splitting The Cost </Title>
      </div>
      <div class="contents" v-if="!isNextPage">
        <ul v-if="errorList.length" class="errorList">
          <li v-for="error in errorList">{{ error }}</li>
        </ul>
        <div>
          <p>What is the 会計？</p>
          <input
            class="inputBox"
            ref="totalBoxRef"
            @keydown.enter="grandTotalEnterKey"
            v-model="initalTotal"
            min="0"
            oninput="this.value = Math.abs(this.value)"
            type="number"
          />
        </div>
        <div>
          <p>割引ある？</p>
          <input
            class="inputBox"
            ref="discountBoxRef"
            @keydown.enter="discountEnterKey"
            v-model="discountTotal"
            min="0"
            oninput="this.value = Math.abs(this.value)"
            type="number"
          />
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
            <p class="menuTitle">Product Name</p>
            <input
              class="inputBox"
              @keydown.enter="productNameEnterKey"
              ref="productNameRef"
              v-model="productName"
              type="text"
            />
          </div>
          <div class="menuItem">
            <p class="menuTitle">Price</p>
            <input
              class="inputBox"
              @keydown.enter="priceEnterKey"
              ref="priceRef"
              v-model="price"
              type="number"
              min="0"
            />
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
                <span>{{ USERS.HANNAH.DISPLAY_NAME }}:</span
                ><span class="singlePrice">{{ formatPrice(hannahPay) }}</span>
              </div>
            </div>
            <div class="boxTotal">
              <div class="box box__person2"></div>
              <div class="boxDescription">
                <span>{{ USERS.PERRY.DISPLAY_NAME }}</span
                ><span class="singlePrice">{{ formatPrice(perryPay) }}</span>
              </div>
            </div>
            <div class="boxTotal">
              <div class="boxDescription">
                <span>割引:</span
                ><span class="singlePrice">{{
                  discountTotal ? formatPrice(discountTotal) : 0
                }}</span>
              </div>
            </div>
            <div class="boxTotal">
              <div class="boxDescription">
                <span>HannahとPerryの記入分:</span
                ><span class="singlePrice">{{ formatPrice(bothTotals) }}</span>
              </div>
            </div>
            <div class="boxTotal">
              <div class="boxDescription">
                <span>二人で払う分:</span
                ><span class="singlePrice">{{ formatPrice(allTotal) }}</span>
              </div>
            </div>
          </div>
          <div class="finalTotalInfo">
            <span class="totalText"
              >合計:<span class="grandTotal">{{
                formatPrice(initalTotal)
              }}</span></span
            ><button @click="editGrandTotal">合計編集</button>
          </div>
          <div class="finalTotalInfo">
            <span class="totalText"
              >合計(割引含め):<span class="grandTotal">{{
                formatPrice(discountedTotal)
              }}</span></span
            >
          </div>
        </div>
        <div
          v-if="perryData.items.length || hannahData.items.length"
          class="priceTable"
        >
          <table class="theActualPriceTable">
            <tbody>
              <tr class="tableRow">
                <th>Name</th>
                <th>Price</th>
              </tr>
              <template
                v-for="(person, personIndex) in [hannahData, perryData]"
              >
                <tr
                  v-for="(item, itemIndex) in person.items"
                  class="tableRow"
                  :class="`tableRow__person${personIndex}`"
                  :key="itemIndex"
                >
                  <p>personIndex: {{ personIndex }}</p>
                  <p>itemIndex: {{ itemIndex }}</p>
                  <td>{{ item.productName }}</td>
                  <td>{{ formatPrice(item.price) }}</td>
                  <td>
                    <button
                      @click="(event) => handleOpenEditModal(event, item)"
                      :data-index="itemIndex"
                      :data-user-type="person.name"
                      class="editButton"
                    >
                      Edit
                    </button>
                    <button
                      @click="(event) => handleOpenDeleteModal(event)"
                      :data-index="itemIndex"
                      :data-user-type="person.name"
                      class="deleteButton"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </template>
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
  productName: string
  price: number
}
interface ShoppingData {
  name: string
  displayName: string
  items: ItemData[]
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
} as const
const initalTotal = ref(0)
const discountTotal = ref(0)
const price = ref<number>(0)
const isNextPage = ref(false)
const errorList = ref<string[]>([])
const editProductName = ref()
const editPrice = ref()
const isOpenEditModal = ref(false)
const isOpenDeleteModal = ref(false)
const indexToEdit = ref<number>(0)
const userToEdit = ref<string>()
const userToDelete = ref<string>()
const indexToDelete = ref<number>()
const priceToDelete = ref()
const nameToDelete = ref()
const productName = ref<string>('')
const totalBoxRef = ref()
const discountBoxRef = ref()
const productNameRef = ref()
const priceRef = ref()
const editProductNameRef = ref()
const editPriceRef = ref()
const selectedPerson = ref<string>(USERS.HANNAH.NAME)
const perryData = ref<ShoppingData>({
  displayName: USERS.PERRY.DISPLAY_NAME,
  name: USERS.PERRY.NAME,
  items: []
})
const hannahData = ref<ShoppingData>({
  displayName: USERS.HANNAH.DISPLAY_NAME,
  name: USERS.HANNAH.NAME,
  items: []
})

// method
const grandTotalEnterKey = () => {
  discountBoxRef.value.focus()
}

const discountEnterKey = () => {
  handleClickForStepOne()
}

const productNameEnterKey = () => {
  priceRef.value.focus()
}

const priceEnterKey = () => {
  handleAddItem()
  productNameRef.value.focus()
}

const editProductNameEnterKey = () => {
  editPriceRef.value.focus()
}

const editPriceEnterKey = () => {
  handleEditItem()
  editProductNameRef.value.focus()
}

const closeModal = () => {
  isOpenEditModal.value = false
  isOpenDeleteModal.value = false
  editProductName.value = ''
  editPrice.value = 0
}

const getPersonalTotal = (data: ShoppingData) => {
  let total = 0
  data.items.forEach((item) => {
    total += item.price
  })
  return total
}

const isStepOneValid = () => {
  const isDiscountPriceHigherThanTotalCost =
    discountTotal.value > initalTotal.value
  const isInitialTotalEmpty = initalTotal.value === 0
  const isDiscountOrTotalCostNegative =
    initalTotal.value < 0 || discountTotal.value < 0

  if (isDiscountPriceHigherThanTotalCost) {
    errorList.value.push(
      '割引は会計より高い値段になってしまいましたので再記入してください'
    )
  }
  if (isInitialTotalEmpty) {
    errorList.value.push('会計は空')
  }
  if (isDiscountOrTotalCostNegative) {
    errorList.value.push('会計または割引はnegative数字になってる')
  }
  return (
    !isDiscountPriceHigherThanTotalCost &&
    !isInitialTotalEmpty &&
    !isDiscountOrTotalCostNegative
  )
}

// event
const handleClickForStepOne = () => {
  if (!isStepOneValid()) {
    return
  }
  isNextPage.value = true
}
const handleRadioClick = () => {
  productNameRef.value.focus()
}
const handleAddItem = () => {
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
  productName.value = ''
  price.value = 0
}

const handleModalCancel = () => {
  isOpenEditModal.value = false
  isOpenDeleteModal.value = false
}

const handleClickBlackOverlay = () => {
  closeModal()
}

const editGrandTotal = () => {
  isNextPage.value = false
}

const handleOpenEditModal = (event: MouseEvent, data: ItemData) => {
  const target = event.target as HTMLInputElement
  indexToEdit.value = Number(target.dataset.index)
  userToEdit.value = target.dataset.userType
  editProductName.value = data.productName
  editPrice.value = data.price
  isOpenEditModal.value = true
}
const handleOpenDeleteModal = (event: MouseEvent) => {
  const target = event.target as HTMLInputElement
  const selectedIndex = Number(target.dataset.index)
  indexToDelete.value = selectedIndex
  userToDelete.value = target.dataset.userType
  const dataToChange =
    userToDelete.value === USERS.HANNAH.NAME
      ? hannahData.value
      : perryData.value
  priceToDelete.value = dataToChange.items[selectedIndex].price
  nameToDelete.value = dataToChange.items[selectedIndex].productName
  isOpenDeleteModal.value = true
}

const handleEditItem = () => {
  const index = indexToEdit.value
  const dataToChange =
    userToEdit.value === USERS.PERRY.NAME ? perryData.value : hannahData.value
  dataToChange.items[index].productName = editProductName.value
  dataToChange.items[index].price = editPrice.value
  closeModal()
}

const handleDeleteItem = () => {
  const indexDelete: number = indexToDelete.value ? indexToDelete.value : 0
  const dataToChange =
    userToDelete.value === USERS.PERRY.NAME ? perryData.value : hannahData.value
  dataToChange.items.splice(indexDelete, 1)
  closeModal()
}

// computed
const totalPay = computed(() => {
  return {
    perry: getPersonalTotal(perryData.value),
    hannah: getPersonalTotal(hannahData.value)
  }
})
const bothTotals = computed(() => totalPay.value.perry + totalPay.value.hannah)
const discountedTotal = computed(() => initalTotal.value - discountTotal.value)
const allTotal = computed(() => discountedTotal.value - bothTotals.value)
const ourIndividualSplit = computed(() => allTotal.value / 2)
const hannahPay = computed(() =>
  Math.floor(totalPay.value.hannah + ourIndividualSplit.value)
)
const perryPay = computed(() => discountedTotal.value - hannahPay.value)
const formatPrice = (price: number) => {
  return `${price.toLocaleString('en-US')}円`
}
onMounted(() => {
  window.onbeforeunload = function () {
    return ''
  }
})
</script>
<style lang="scss" scoped>
$personOne: #f4cccc;
$personTwo: #9fc5e8;

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

    &__person0 {
      background: $personOne;
    }

    &__person1 {
      background: $personTwo;
    }
  }

  th,
  td {
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

.modalActionButton {
  margin-left: 15px;
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

.radioItem {
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
  border-bottom: 1px solid #d9d9d9;
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

.deleteButton {
  margin-left: 10px;
}

.blackModal {
  height: 100vh;
  background: black;
  width: 100%;
  position: fixed;
  z-index: 100;
  opacity: 0.7;
}

.modalBox {
  position: fixed;
  background: white;
  width: 85%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 1;
  z-index: 200;
  max-height: 100vh;
  padding: 20px;

  .modalTitle {
    text-align: center;
    margin: 0;
  }
}
</style>
