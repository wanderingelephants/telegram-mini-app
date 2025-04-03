<template>
    <div>
        <google-sign-in />
        <v-textarea v-model="functionText" label="Paste JavaScript Function Here" auto-grow></v-textarea>
        <v-btn @click="executeFunction" class="mb-4">Execute</v-btn>
        <v-expansion-panels>
            <v-expansion-panel v-for="(records, tableName) in tabularData" :key="tableName">
                <v-expansion-panel-title>{{ tableName }}</v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-table>
                        <thead>
                            <tr>
                                <th v-for="header in getHeaders(records)" :key="header">{{ header }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, index) in records" :key="index">
                                <td v-for="header in getHeaders(records)" :key="header">{{ row[header] }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
        <v-expansion-panels>
        <v-expansion-panel v-if="executionResults.length > 0">
            <v-expansion-panel-title>JS Execution Results</v-expansion-panel-title>
            <v-expansion-panel-text>
                <v-table>
                    <thead>
                        <tr>
                            <th v-for="header in getHeaders(executionResults)" :key="header">{{ header }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in executionResults" :key="index">
                            <td v-for="header in getHeaders(executionResults)" :key="header">{{ row[header] }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-expansion-panel-text>
        </v-expansion-panel>
        </v-expansion-panels>
        <v-card class="mt-4">
            <v-btn @click="getData" :disabled="loading">
                <v-progress-circular v-if="loading" indeterminate size="24" class="mr-2" />
                Fetch
            </v-btn>
        </v-card>
    </div>
</template>

<script>
import { mapState } from "vuex";
import GoogleSignIn from "../components/GoogleSignIn";

export default {
    computed: {
        ...mapState(["loggedInGoogle", "userGoogle"])
    },
    components: {
        GoogleSignIn
    },
    data() {
        return {
            tabularData: {},
            executionResults: [],
            functionText: "",
            loading: false
        };
    },
    methods: {
        async getData() {
            this.loading = true;
            try {
                const resp = await fetch("/api/chat/arrayview", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("jwtGoogle")}`,
                    },
                });
                this.tabularData = await resp.json();
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                this.loading = false;
            }
        },
        getHeaders(records) {
            return records.length > 0 ? Object.keys(records[0]) : [];
        },
        async executeFunction() {
            try {
                const sanitizedFunctionText = this.functionText.replace(/^const analysis = async function/, 'async function analysis');
                const asyncFunc = new Function('pre_populated_arrays', `return (${sanitizedFunctionText})(pre_populated_arrays);`);
                this.executionResults = await asyncFunc(this.tabularData);
                console.log(this.executionResults)
            } catch (error) {
                console.error("Error executing function:", error);
                this.executionResults = [];
            }
        }
    }
};
</script>

<style scoped>
th, td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}
</style>
