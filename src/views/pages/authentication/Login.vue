<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">

      <!-- Brand logo-->
      <b-link class="brand-logo">
        <logo/>

        <h2 class="brand-text text-primary">
          西宁舰办公系统
        </h2>
      </b-link>
      <!-- /Brand logo-->

      <!-- Left Text-->
      <b-col
          lg="8"
          class="d-none d-lg-flex align-items-center p-5"
      >
        <div class="w-100 d-lg-flex align-items-center justify-content-center px-5">
          <b-img
              fluid
              :src="imgUrl"
              alt="Login V2"
          />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Login-->
      <b-col
          lg="4"
          class="d-flex align-items-center auth-bg px-2 p-lg-5"
      >
        <b-col
            sm="8"
            md="6"
            lg="12"
            class="px-xl-2 mx-auto"
        >
          <b-card-title
              class="mb-2 font-weight-bold text-center"
              title-tag="h3"
          >
            勇气！实干！卓越！👊
          </b-card-title>

          <hr>

          <!-- form -->
          <validation-observer
              ref="loginForm"
              #default="{invalid}"
          >
            <b-form
                class="auth-login-form mt-2"
                @submit.prevent="login"
            >
              <!-- Phone -->
              <b-form-group
                  label="手机"
                  label-for="login-phone"
              >
                <validation-provider
                    #default="{ errors }"
                    name="Phone"
                    vid="phone"
                    rules="required|phone"
                >
                  <b-form-input
                      id="login-phone"
                      v-model="userPhone"
                      :state="errors.length > 0 ? false:null"
                      name="login-phone"
                      placeholder="请输入您的手机号码"
                  />
                  <small class="text-danger" v-if="errors.length > 0">号码格式错误</small>
                </validation-provider>
              </b-form-group>

              <!-- forgot password -->
              <b-form-group>
                <div class="d-flex justify-content-between">
                  <label for="login-password">密码</label>
                </div>
                <validation-provider
                    #default="{ errors }"
                    name="Password"
                    vid="password"
                    rules="required"
                >
                  <b-input-group
                      class="input-group-merge"
                      :class="errors.length > 0 ? 'is-invalid':null"
                  >
                    <b-form-input
                        id="login-password"
                        v-model="userPassword"
                        :state="errors.length > 0 ? false:null"
                        class="form-control-merge"
                        :type="passwordFieldType"
                        name="login-password"
                        placeholder="请输入您的登录密码"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                          class="cursor-pointer"
                          :icon="passwordToggleIcon"
                          @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger" v-if="errors.length > 0">密码强度过低</small>
                </validation-provider>
              </b-form-group>

              <br>

              <!-- submit buttons -->
              <b-button
                  type="submit"
                  variant="primary"
                  block
                  :disabled="invalid"
              >
                登 录
              </b-button>
            </b-form>
          </validation-observer>

        </b-col>
      </b-col>
      <!-- /Login-->
    </b-row>
  </div>
</template>

<script>

import { ValidationProvider, ValidationObserver } from 'vee-validate'
import Logo from '@core/layouts/components/Logo.vue'
import {
  BRow,
  BCol,
  BLink,
  BFormGroup,
  BFormInput,
  BInputGroupAppend,
  BInputGroup,
  BCardTitle,
  BImg,
  BForm,
  BButton,
  BAlert,
  VBTooltip
} from 'bootstrap-vue'
import { required, phone } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import store from '@/store/index'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  directives: {
    'b-tooltip': VBTooltip
  },
  components: {
    BRow,
    BCol,
    BLink,
    BFormGroup,
    BFormInput,
    BInputGroupAppend,
    BInputGroup,
    BCardTitle,
    BImg,
    BForm,
    BButton,
    BAlert,
    Logo,
    ValidationProvider,
    ValidationObserver
  },
  mixins: [togglePasswordVisibility],
  data () {
    return {
      status: '',
      userPhone: '',
      userPassword: '',
      sideImg: require('@/assets/images/pages/login.svg'),

      // 验证规则
      required,
      phone
    }
  },
  computed: {
    passwordToggleIcon () {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    imgUrl () {
      if (store.state.appConfig.layout.skin === 'dark') {
        this.sideImg = require('@/assets/images/pages/login-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    }
  },
  methods: {
    login () {
      const that = this
      this.$refs.loginForm.validate()
      .then(success => {
        if (success) {
          that.axiosIns.post('/user/login', {
            userPhone: that.userPhone,
            userPassword: that.userPassword
          })
          .then(res => {
            const statusCode = res.data.status.code

            if (statusCode === '0000') {
              const userData = res.data.data

              localStorage.setItem('userData', JSON.stringify(userData))

              that.$router.replace(getHomeRouteForLoggedInUser(userData.userRole))
              .then(() => {
                that.$toast({
                  component: ToastificationContent,
                  props: {
                    title: `欢迎 ${userData.userName}`,
                    icon: 'CoffeeIcon',
                    variant: 'success',
                    text: `${userData.userRole} 登录成功!`
                  }
                })
              })
            } else {
              that.$toast({
                    component: ToastificationContent,
                    props: {
                      title: res.data.status.msg,
                      icon: 'DeleteIcon',
                      variant: 'warning'
                    }
                  },
                  { position: 'bottom-right' }
              )
            }
          })
          .catch(() => {
            that.$toast({
                  component: ToastificationContent,
                  props: {
                    title: '错误',
                    icon: 'DeleteIcon',
                    variant: 'danger'
                  }
                },
                { position: 'bottom-right' }
            )
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
