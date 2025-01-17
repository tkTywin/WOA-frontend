<template>
  <div>
    <b-sidebar
        id="sidebar-leave-handler"
        sidebar-class="sidebar-lg"
        :visible="isLeaveHandlerSidebarActive"
        bg-variant="white"
        shadow
        backdrop
        no-header
        right
        @change="(val) => $emit('update:is-leave-handler-sidebar-active', val)"
        @hidden="clearForm"
    >
      <template #default="{ hide }">
        <!-- Header -->
        <div
            class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
        >
          <h5 class="mb-0">假单</h5>
          <div>
            <feather-icon
                class="ml-1 cursor-pointer"
                icon="XIcon"
                size="16"
                @click="hide"
            />
          </div>
        </div>

        <!-- Body -->
        <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
          <!-- Form -->
          <b-form
              class="p-2"
              @submit.prevent="handleSubmit(onSubmit)"
              @reset.prevent="resetForm"
          >
            <!-- 请假类型 -->
            <b-form-group label="请假类型" label-for="leave-type">
              <v-select
                  v-model="leaveLocal.leaveType"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="leaveTypes"
                  :reduce="(option) => option.value"
                  input-id="leave-type"
              />
            </b-form-group>

            <!-- 请假开始时间 -->
            <validation-provider
                #default="validationContext"
                name="开始时间"
                rules="required"
            >
              <b-form-group label="开始时间" label-for="start-time">
                <flat-pickr
                    v-model="leaveLocal.startTime"
                    class="form-control"
                    :config="{
                    minDate: new Date(),
                    enableTime: true,
                    dateFormat: 'Y-m-d H:i',
                    time_24hr: true,
                    locale: Mandarin
                  }"
                />
                <b-form-invalid-feedback
                    :state="getValidationState(validationContext)"
                >
                  开始时间格式错误
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>

            <!-- 请假结束时间 -->
            <validation-provider
                #default="validationContext"
                name="结束时间"
                rules="required"
            >
              <b-form-group label="结束时间" label-for="due-time">
                <flat-pickr
                    v-model="leaveLocal.dueTime"
                    class="form-control"
                    :config="{
                    minDate: new Date(),
                    enableTime: true,
                    dateFormat: 'Y-m-d H:i',
                    time_24hr: true,
                    locale: Mandarin
                  }"
                />
                <b-form-invalid-feedback
                    :state="getValidationState(validationContext)"
                >
                  结束时间格式错误
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>

            <!-- 请假原因 -->
            <b-form-group
                label="请假原因"
                label-for="leave-reason"
            >
              <b-form-textarea
                  id="leave-reason"
                  v-model="leaveLocal.reason"
                  autofocus
                  placeholder="请填写去向或原因"
              />
            </b-form-group>

            <!-- 表单操作 -->
            <div class="d-flex mt-2">
              <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="primary"
                  class="mr-2"
                  type="submit"
              >
                请假
              </b-button>
              <b-button
                  v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                  type="reset"
                  variant="outline-secondary"
              >
                重置
              </b-button>
            </div>
          </b-form>
        </validation-observer>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
import {
  BSidebar, BForm, BFormGroup, BFormInput, BAvatar, BFormTextarea, BButton, BFormInvalidFeedback,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import Ripple from 'vue-ripple-directive'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required } from '@validations'
import { avatarText } from '@core/utils/filter'
import formValidation from '@core/comp-functions/forms/form-validation'
import { toRefs } from '@vue/composition-api'
import useLeaveHandler from './useLeaveHandler'

export default {
  components: {
    // BSV
    BButton,
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BAvatar,
    BFormInvalidFeedback,

    // 3rd party packages
    vSelect,
    flatPickr,

    // Form Validation
    ValidationProvider,
    ValidationObserver
  },
  directives: {
    Ripple
  },
  model: {
    prop: 'isLeaveHandlerSidebarActive',
    event: 'update:is-leave-handler-sidebar-active'
  },
  props: {
    isLeaveHandlerSidebarActive: {
      type: Boolean,
      required: true
    },
    leave: {
      type: Object,
      required: true
    },
    clearLeaveData: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      required
    }
  },
  setup (props, { emit }) {
    const {
      leaveLocal,
      resetLeaveLocal,

      // UI
      onSubmit,
      leaveTypes
    } = useLeaveHandler(toRefs(props), emit)

    const {
      refFormObserver,
      getValidationState,
      resetForm,
      clearForm
    } = formValidation(resetLeaveLocal, props.clearLeaveData)

    return {
      // Add New
      leaveLocal,
      onSubmit,
      leaveTypes,

      // Form Validation
      resetForm,
      clearForm,
      refFormObserver,
      getValidationState,

      // Filter/Formatter
      avatarText,
      Mandarin
    }
  },
}
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>

<style lang="scss" scoped>
@import "~@core/scss/base/bootstrap-extended/_include";

.leave-type-selector {
  ::v-deep .vs__dropdown-toggle {
    padding-left: 0;
  }
}
</style>
