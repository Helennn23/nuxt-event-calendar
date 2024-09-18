<template>
  <el-card class="max-w-[500px]">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      status-icon
    >
      <el-form-item label="Activity name" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>

      <el-form-item label="Activity zone" prop="region">
        <client-only>
          <el-select v-model="ruleForm.region" placeholder="Activity zone">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </client-only>
      </el-form-item>

      <el-form-item label="Activity count" prop="count">
        <client-only>
          <el-select
            v-model="ruleForm.count"
            placeholder="Activity count"
          >
            <el-option
              v-for="option in options"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            />
          </el-select>
        </client-only>
      </el-form-item>

      <el-form-item label="Activity time" required>
        <el-col :span="11">
          <el-form-item prop="date1">
            <client-only>
              <el-date-picker
                v-model="ruleForm.date1"
                type="date"
                label="Pick a date"
                placeholder="Pick a date"
                style="width: 100%"
              />
            </client-only>
          </el-form-item>
        </el-col>

        <el-col class="text-center" :span="2">
          <span class="text-gray-500">-</span>
        </el-col>

        <el-col :span="11">
          <el-form-item prop="date2">
            <client-only>
              <el-time-picker
                v-model="ruleForm.date2"
                label="Pick a time"
                placeholder="Pick a time"
                style="width: 100%"
              />
            </client-only>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="Instant delivery" prop="delivery">
        <el-switch v-model="ruleForm.delivery" />
      </el-form-item>

      <el-form-item label="Activity type" prop="type">
        <el-checkbox-group v-model="ruleForm.type">
          <el-checkbox value="Online activities" label="Online activities" name="type" />
          <el-checkbox value="Promotion activities" label="Promotion activities" name="type" />
          <el-checkbox value="Offline activities" label="Offline activities" name="type" />
          <el-checkbox value="Simple brand exposure" label="Simple brand exposure" name="type" />
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="Resources" prop="resource">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio value="Sponsorship" label="Sponsorship" />
          <el-radio value="Venue" label="Sponsorship" />
        </el-radio-group>
      </el-form-item>

      <el-form-item label="Activity form" prop="desc">
        <el-input v-model="ruleForm.desc" type="textarea" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">
          Create
        </el-button>
        <el-button @click="resetForm">Reset</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
definePageMeta({
  pageLabel: 'navigation.home',
  navOrder: 1
})

const options = Array.from({ length: 10 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`
}))

const ruleFormRef = useElFormRef()
const ruleForm = useElFormModel({
  name: 'Hello',
  region: '',
  count: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: ''
})

const rules = useElFormRules({
  name: [useRequiredRule(), useMinLenRule(3), useMaxLenRule(5)],
  region: useRequiredRule(),
  count: useRequiredRule(),
  date1: useRequiredRule(),
  date2: useRequiredRule(),
  type: { ...useRequiredRule(), type: 'array' },
  resource: useRequiredRule(),
  desc: useRequiredRule()
})

async function submitForm () {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

function resetForm () {
  ruleFormRef.value.resetFields()
}
</script>
