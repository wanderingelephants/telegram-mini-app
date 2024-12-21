<template>
  <v-container fluid theme="light">
    <v-text :v-text="postUrl"></v-text>
    <v-textarea v-model="dataToPost" rows="50"></v-textarea>
    <v-btn @click="submit">Submit</v-btn>
  </v-container>
</template>
<script>
export default {
  methods: {
    async submit() {
      function preprocessJSON(jsonString) {
    // Step 1: Enclose keys in double quotes
    let fixedString = jsonString.replace(/([{,]\s*)(\w+)(?=\s*:)/g, '$1"$2"');
    
    // Step 2: Handle multi-line string values
    let insideValue = false;
    let currentValue = '';
    let lastChar = '';
    let result = '';

    for (const char of fixedString) {
        if (char === '"' && lastChar !== '\\') {
            if (insideValue) {
                // Closing the value
                result += `"${currentValue.replace(/\r?\n/g, '\\n')}"`;
                currentValue = '';
                insideValue = false;
            } else {
                // Starting a new value
                insideValue = true;
            }
        } else if (insideValue) {
            currentValue += char; // Collect characters for the value
        } else {
            result += char; // Add non-value characters to the output
        }
        lastChar = char; // Update last character
    }

    return result;
}

      const fixedJson = preprocessJSON(this.dataToPost);

      //console.log(fixedJson);
      const parsed = JSON.parse(fixedJson);
      //console.log("parsed", parsed);
      const filtered = parsed.data.filter(
        (record) =>
          this.filteredList.map((_) => _.symbol).indexOf(record.symbol) > -1
      );
      console.log(filtered);
      await  this.postToApi(filtered)
    },
    async postToApi(data) {
      console.log("post,", data);
      try {
        const response = await fetch("/api/nse/receive", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        console.log(response);
        // Handle response
      } catch (error) {
        // Handle API error
      }
    },
  },
  data() {
    return {
      dataToPost: "",
      postUrl: "/api/nse/receive",
      filteredList: [
        { symbol: "BANKIETF", underlying: "Nifty Bank" },
        {
          symbol: "SMALLCAP",
          underlying: "Mirae Asset Nifty Smallcap 250 Momentum Quality 100 ETF",
        },
        {
          symbol: "MODEFENCE",
          underlying: "Nifty India Defence Total Return Index",
        },
        { symbol: "HNGSNGBEES", underlying: "Hang Seng Index" },
        { symbol: "MAFANG", underlying: "NYSE FANG+ Total Return Index" },
        { symbol: "PHARMABEES", underlying: "Nifty Pharma TRI" },
      ],
    };
  },
};
</script>
