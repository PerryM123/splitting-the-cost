<!-- TODO: localStorageでデータを保存？cookie？ -->
<template>
  <div class="c-app">
    <CommonModal
      @handle-click-black-overlay="handleClickBlackOverlay"
      :is-modal-open="isOpenEditModal || isOpenDeleteModal"
    >
      <template v-if="isOpenEditModal">
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
          <CommonButton @click="handleModalCancel">キャンセル</CommonButton>
          <CommonButton class="modalActionButton" @click="handleEditItem">
            編集
          </CommonButton>
        </div>
      </template>
      <template v-if="isOpenDeleteModal">
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
            <CommonButton @click="handleModalCancel">キャンセル</CommonButton>
            <CommonButton class="modalActionButton" @click="handleDeleteItem">
              削除
            </CommonButton>
          </div>
        </div>
      </template>
    </CommonModal>
    <div class="mainContents">
      <div class="mainTitle">
        <Title> Splitting The Cost </Title>
      </div>
      <div class="section firstPage" v-if="!isNextPage">
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
          <CommonButton :onClick="handleClickForStepOne">次へ</CommonButton>
        </div>
      </div>
      <div v-else>
        <!-- TODO: contentsもコンポーネント化は必須 -->
        <div class="section">
          <PriceInput @handle-add-item="handleAddItem" />
        </div>
        <div class="section">
          <PriceInfo
            @edit-grand-total="editGrandTotal"
            :hannah-pay="hannahPay"
            :perry-pay="perryPay"
            :discount-total="discountTotal"
            :both-totals="bothTotals"
            :all-total="allTotal"
            :inital-total="initalTotal"
            :discounted-total="discountedTotal"
          />
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
                  <td>{{ item.productName }}</td>
                  <td>{{ formatPrice(item.price) }}</td>
                  <td class="buttonTableItem">
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
// TODO: コンポーネント登録することが必須になるような設定方法ある？auto-importを外したい
import Title from '@/components/atoms/Title.vue'
import { computed, onMounted, ref } from 'vue'
import type { ItemData, ShoppingData } from '@/interface/shopping'
import { getPersonalTotal, formatPrice, getHannahPay } from '@/utils/utils'
import { USERS } from '@/constants/index'

const initalTotal = ref(0)
const discountTotal = ref(0)
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
const totalBoxRef = ref()
const discountBoxRef = ref()
const editProductNameRef = ref()
const editPriceRef = ref()

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

const editPriceEnterKey = () => {
  handleEditItem()
  editProductNameRef.value.focus()
}

const editProductNameEnterKey = () => {
  editPriceRef.value.focus()
}

const closeModal = () => {
  isOpenEditModal.value = false
  isOpenDeleteModal.value = false
  editProductName.value = ''
  editPrice.value = 0
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
const handleAddItem = (newItem: ItemData) => {
  if (newItem.userName === USERS.HANNAH.NAME) {
    hannahData.value.items.push(newItem)
  }
  if (newItem.userName === USERS.PERRY.NAME) {
    perryData.value.items.push(newItem)
  }
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
/*
以下の関数をjestで単体テストを作成できるように修正
- totalPay
- bothTotals
- discountedTotal
- allTotal
- ourIndividualSplit
- hannahPay
- perryPay
- formatPrice
 */
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
  getHannahPay(totalPay.value.hannah, ourIndividualSplit.value)
)
const perryPay = computed(() => discountedTotal.value - hannahPay.value)
onMounted(() => {
  window.onbeforeunload = function () {
    return ''
  }
})
</script>
<style lang="scss" scoped>
// TODO: color変数は共通化
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
  padding: 10px 5px;
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
    max-width: 100px;
    word-break: break-all;
  }

  .buttonTableItem {
    text-align: right;
  }
}

.butonArea {
  margin-top: 10px;
  text-align: right;
}

.modalActionButton {
  margin-left: 15px;
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

.mainTitle {
  padding-top: 25px;
}
.errorList {
  display: inline-block;
  background: #ff000030;
  border-radius: 10px;
  padding: 10px;
  border: 1px red solid;
  padding-left: 30px;
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
.section {
  padding: 0 15px;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom: 25px;
  margin-bottom: 25px;
}
.firstPage {
  padding-top: 10px;
}
</style>
