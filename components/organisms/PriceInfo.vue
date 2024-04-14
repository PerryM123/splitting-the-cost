<template>
  <div class="priceInfo">
    <slot></slot>
    <div class="boxTotal">
      <div class="box box__person1"></div>
      <div class="boxDescription">
        <span>{{ USERS.HANNAH.DISPLAY_NAME }}:</span
        ><span class="singlePrice">{{ formatPrice(props.hannahPay) }}</span>
      </div>
    </div>
    <div class="boxTotal">
      <div class="box box__person2"></div>
      <div class="boxDescription">
        <span>{{ USERS.PERRY.DISPLAY_NAME }}</span
        ><span class="singlePrice">{{ formatPrice(props.perryPay) }}</span>
      </div>
    </div>
    <div class="boxTotal">
      <div v-if="props.discountTotal" class="boxDescription">
        <span>割引:</span
        ><span class="singlePrice">{{
          props.discountTotal ? formatPrice(props.discountTotal) : 0
        }}</span>
      </div>
    </div>
    <div class="boxTotal">
      <div class="boxDescription">
        <span>HannahとPerryの記入分:</span
        ><span class="singlePrice">{{ formatPrice(props.bothTotals) }}</span>
      </div>
    </div>
    <div class="boxTotal">
      <div class="boxDescription">
        <span>二人で払う分:</span
        ><span class="singlePrice">{{ formatPrice(props.allTotal) }}</span>
      </div>
    </div>
    <div class="finalTotalInfo">
      <span class="totalText"
        >合計:<span class="grandTotal">{{
          formatPrice(props.initalTotal)
        }}</span></span
      ><CommonButton @click="editGrandTotal">合計編集</CommonButton>
    </div>
    <div v-if="props.discountTotal" class="finalTotalInfo">
      <span class="totalText"
        >合計(割引含め):<span class="grandTotal">{{
          formatPrice(props.discountedTotal)
        }}</span></span
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
import { formatPrice } from '#imports'
import { USERS } from '~/constants'

const props = defineProps({
  hannahPay: {
    type: Number,
    required: true
  },
  perryPay: {
    type: Number,
    required: true
  },
  discountTotal: {
    type: Number,
    required: true
  },
  bothTotals: {
    type: Number,
    required: true
  },
  allTotal: {
    type: Number,
    required: true
  },
  initalTotal: {
    type: Number,
    required: true
  },
  discountedTotal: {
    type: Number,
    required: true
  }
})
const emit = defineEmits(['edit-grand-total'])
const editGrandTotal = () => {
  emit('edit-grand-total')
}
</script>
<style lang="scss" scoped>
// TODO: color変数は共通化
$personOne: #f4cccc;
$personTwo: #9fc5e8;

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
</style>
