<template>
  <div class="app-calendar overflow-hidden border">
    <div class="row no-gutters">
      <!-- Sidebar -->
      <div
          class="col app-calendar-sidebar flex-grow-0 overflow-hidden d-flex flex-column"
          :class="{'show': isCalendarOverlaySidebarActive}"
      >
        <calendar-sidebar :is-training-handler-sidebar-active.sync="isTrainingHandlerSidebarActive"/>
      </div>

      <!-- Calendar -->
      <div class="col position-relative">
        <div class="card shadow-none border-0 mb-0 rounded-0">
          <div class="card-body pb-0">
            <full-calendar
                ref="refCalendar"
                :options="calendarOptions"
                class="full-calendar"
            />
          </div>
        </div>
      </div>

      <!-- Sidebar Overlay -->
      <div
          class="body-content-overlay"
          :class="{'show': isCalendarOverlaySidebarActive}"
          @click="isCalendarOverlaySidebarActive = false"
      />
      <calendar-training-handler
          v-model="isTrainingHandlerSidebarActive"
          :training="training"
          :clear-training-data="clearTrainingData"
          :lower-users="lowerUsers"
          @del-training="delTraining"
          @add-training="addTraining"
          @edit-training="editTraining"
      />
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import store from '@/store'
import { onUnmounted } from '@vue/composition-api'
import calendarStoreModule from './calendarStoreModule'
import CalendarSidebar from './calendar-sidebar/CalendarSidebar.vue'
import CalendarTrainingHandler from './calendar-training-handler/CalendarTrainingHandler.vue'
import useCalendar from './useCalendar'

export default {
  components: {
    FullCalendar,
    CalendarSidebar,
    CalendarTrainingHandler
  },
  setup () {
    const CALENDAR_APP_STORE_MODULE_NAME = 'calendar'

    // Register module
    if (!store.hasModule(CALENDAR_APP_STORE_MODULE_NAME)) store.registerModule(CALENDAR_APP_STORE_MODULE_NAME, calendarStoreModule)

    // UnRegister on Calendar of Training
    onUnmounted(() => {
      if (store.hasModule(CALENDAR_APP_STORE_MODULE_NAME)) store.unregisterModule(CALENDAR_APP_STORE_MODULE_NAME)
    })

    const {
      refCalendar,
      isCalendarOverlaySidebarActive,
      training,
      clearTrainingData,
      lowerUsers,
      addTraining,
      editTraining,
      delTraining,
      fetchTrainings,
      refetchTrainings,
      calendarOptions,

      // ----- UI ----- //
      isTrainingHandlerSidebarActive
    } = useCalendar()

    fetchTrainings()

    return {
      refCalendar,
      isCalendarOverlaySidebarActive,
      training,
      clearTrainingData,
      lowerUsers,
      addTraining,
      editTraining,
      delTraining,
      refetchTrainings,
      calendarOptions,

      // ----- UI ----- //
      isTrainingHandlerSidebarActive
    }
  }
}
</script>

<style lang="scss">
@import "@core/scss/vue/apps/calendar.scss";
</style>
