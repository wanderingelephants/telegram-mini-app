<template>
  <v-card flat>
    <v-list>
      <v-list-item 
        v-for="(item, index) in arrayList" 
        :key="index"
        class="array-item"
      >
        <template v-slot:prepend>
          <v-btn 
            variant="text"
            :icon="expandedItems[index] ? '$mdiMinus' : '$mdiPlus'"
            @click="toggleExpand(index)"
            class="expand-toggle mr-2"
          ></v-btn>
        </template>
        
        <v-list-item-title class="font-weight-bold">
          {{ item.dataset_name }}
        </v-list-item-title>
        
        <template v-slot:append>
          <v-chip 
            v-if="!expandedItems[index]"
            color="primary" 
            variant="text" 
            size="small"
          >
            {{ item.fields.length }} Fields
          </v-chip>
        </template>

        <v-expand-transition>
          <div v-if="expandedItems[index]" class="fields-container mt-2">
            <v-chip 
              v-for="(field, fieldIndex) in item.fields" 
              :key="fieldIndex"
              class="ma-1"
              color="primary"
              variant="outlined"
              size="small"
            >
              {{ formatFieldName(field) }}
            </v-chip>
          </div>
        </v-expand-transition>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: 'DataExplorer',
  props: {
    arrayList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      expandedItems: {}
    }
  },
  methods: {
    toggleExpand(index) {
      // Toggle the expansion state for the specific item
      this.expandedItems[index] = !this.expandedItems[index]
    },
    formatFieldName(field) {
      // Convert snake_case to Title Case
      return field
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }
  }
}
</script>

<style scoped>
.array-item {
  border-bottom: 1px solid #e0e0e0;
  align-items: center;
}

.expand-toggle {
  margin-right: 8px;
}

.fields-container {
  display: flex;
  flex-wrap: wrap;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>