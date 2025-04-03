<template>
  <div>
    <button @click="fetchFields">Fetch Fields</button>
    <div v-if="allTables.length">
      <h2>Dataset Fields</h2>
      <div v-for="table in allTables" :key="table.array_name" class="card">
        <h3>{{ table.array_name }}</h3>
        <ul>
          <li v-for="field in table.fields" :key="field">{{ field }}</li>
        </ul>
        <h4>Fields Unique to Table</h4>
        <ul>
          <li v-for="uniqueField in table.uniqueFields" :key="uniqueField">{{ uniqueField }}</li>
        </ul>
      </div>
      <h2>Duplicate Fields</h2>
      <div class="card" v-if="duplicateFields.length">
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Found In Arrays</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="dup in duplicateFields" :key="dup.field">
              <td>{{ dup.field }}</td>
              <td>{{ dup.found_in_arrays.join(", ") }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      allTables: [],
      duplicateFields: []
    };
  },
  methods: {
    async fetchFields() {
      try {
        const response = await fetch("/api/chat/promptfields?noTransform=true");
        this.allTables = await response.json();
        this.findDuplicatesAndUniques();
      } catch (error) {
        console.error("Error fetching fields:", error);
      }
    },
    findDuplicatesAndUniques() {
      const ignoredFields = new Set(["company_name","company_nse_symbol","company_sector","company_market_cap_in_crores","company_market_cap_category","year","month","quarter"]);
      const fieldMap = new Map();
      
      this.allTables.forEach(({ array_name, fields }) => {
        if (!Array.isArray(fields)) {
          console.warn(`Skipping ${array_name} due to invalid fields:`, fields);
          return;
        }
        fields.forEach(field => {
          if (!ignoredFields.has(field)) {
            if (!fieldMap.has(field)) {
              fieldMap.set(field, []);
            }
            fieldMap.get(field).push(array_name);
          }
        });
      });

      this.duplicateFields = Array.from(fieldMap.entries())
        .filter(([_, arrays]) => arrays.length > 1)
        .map(([field, arrays]) => ({ field, found_in_arrays: arrays }));
      
      // Compute unique fields for each table
      this.allTables.forEach(table => {
        if (!Array.isArray(table.fields)) return;
        table.uniqueFields = table.fields.filter(field => 
          !ignoredFields.has(field) && fieldMap.get(field)?.length === 1
        );
      });
    }
  },
  mounted() {
    this.fetchFields();
  }
};
</script>

<style>
.card {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  background: #f9f9f9;
}

button {
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
