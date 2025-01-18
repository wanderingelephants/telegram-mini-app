const initialData = require('./data_dump.json')
const safeFunctionFromString = (fnString) => {
    // List of forbidden keywords and patterns
    const forbiddenPatterns = [
      'eval',
      'Function',
      'require',
      'import',
      'process',
      'global',
      '__dirname',
      '__filename',
      'window',
      'document',
      'localStorage',
      'sessionStorage',
      'indexedDB',
      'fetch',
      'XMLHttpRequest',
      'WebSocket',
      'Promise',
      'setTimeout',
      'setInterval',
      'requestAnimationFrame',
      'addEventHandler',
      'constructor',
      'prototype',
      '__proto__',
      'bind',
      'call',
      'apply'
    ];
  
    // Check for forbidden patterns
    const lowerCaseStr = fnString.toLowerCase();
    for (const pattern of forbiddenPatterns) {
      if (lowerCaseStr.includes(pattern.toLowerCase())) {
        throw new Error(`Unsafe pattern detected: ${pattern}`);
      }
    }
  
    // Check for suspicious characters or patterns
    const suspiciousPatterns = [
      /[<>]/, // HTML tags
      /`/, // Template literals
      /\$\{/, // Template literal expressions
      /\/\*|\*\//, // Multi-line comments that might hide code
      /\bdata:/, // Data URLs
      /\bblob:/, // Blob URLs
      /\bjavascript:/, // JavaScript URLs
      /\bvbscript:/, // VBScript URLs
      /\bon\w+\s*=/, // Event handlers
      /new\s+[^(]/, // Instantiation of unknown objects
      /\[\s*["'](?:__|\$\$)/, // Accessing double underscore or double dollar properties
      /\b_[^a-zA-Z]/, // Underscore followed by non-letter (often used in special properties)
      /\(\s*\)\s*=>/, // Arrow functions without parameters
      /=>\s*{/, // Arrow functions with block bodies
      /function\s*\(/, // Function declarations
      /\bclass\b/, // Class declarations
    ];
  
    /*for (const pattern of suspiciousPatterns) {
      if (pattern.test(fnString)) {
        throw new Error(`Suspicious pattern detected: ${pattern}`);
      }
    }*/
  
    // Validate that the string only contains allowed characters
    const validCharacterPattern = /^[\w\s.,?:;{}()\[\]'"+-/*%=!&|<>]+$/;
    if (!validCharacterPattern.test(fnString)) {
      throw new Error('Invalid characters detected in function string');
    }
  
    // Maximum allowed length for function string
    const MAX_LENGTH = 500;
    if (fnString.length > MAX_LENGTH) {
      throw new Error(`Function string too long: ${fnString.length} chars (max ${MAX_LENGTH})`);
    }
  
    try {
      // Try to parse as valid JavaScript first
      Function(`"use strict"; return (${fnString})`);
    } catch (e) {
      throw new Error(`Invalid JavaScript: ${e.message}`);
    }
  
    // If all checks pass, create the function
    return new Function('record', `"use strict"; return (${fnString})`);
  };

  function executeSteps(data, steps) {
    let result = data;
  
    for (const step of steps) {
      const { operation, logic } = step;
        console.log("step", operation, logic)
      // Dynamically create a function based on the operation type
      const dynamicFunction = new Function(
        operation === "reduce" ? "acc, record" : "record",
        `return ${logic};`
      );
      console.log("result", result)
      // Apply the operation using the dynamic function
      switch (operation) {
        case "filter":
          result = result.filter(record => eval("(" + logic + ")"));
          break;
        case "map":
          result = result.map( eval("(" + logic + ")"));
          break;
        case "reduce":
            {
                console.log("executing reduce on result", result.length)
                result = eval("(" + logic + ")");
                break;
            }
        case "sort":
          result = result.sort((a, b) => eval("(" + logic + ")"));
          break;
        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }
      if (Array.isArray(result)){
        console.log(result.length, result.slice(0,1))
      } else {
        console.log(result)
      }
    }
  
    console.log(result);
    return result;
  }
  
  // Example usage
  const steps = [
    {
      description: "Filter records for holdings in the 'Banking' sector.",
      operation: "filter",
      logic: "record.company_stock_industry_sector && record.company_stock_industry_sector.toUpperCase().indexOf('BANKING'.toUpperCase()) > -1"
    },
    {
      description: "Group the filtered records by mutual fund name.",
      operation: "reduce",
      logic: `data.reduce((acc, record) => {
        const name = record.mutual_fund_name;
        if (!acc[name]) {
          acc[name] = [];
        }
        acc[name].push(record);
        return acc;
      }, {})`
    },
    {
      description: "Sort the grouped records for each mutual fund by reporting_date in ascending order.",
      operation: "map",
      logic: `([fundName, records]) => [fundName, records.sort((a, b) => new Date(a.reporting_date) - new Date(b.reporting_date))]`
    },
    {
      description: "Filter funds where holdings in Banking sector increased for the last 4 reporting periods.",
      operation: "filter",
      logic: `([fundName, records]) => {
        if (records.length < 4) return false;
        const last4 = records.slice(-4);
        return last4.every((record, index, arr) => index === 0 || record.percentage_holding_in_mutual_fund > arr[index - 1].percentage_holding_in_mutual_fund);
      }`
    },
    {
      description: "Map the filtered mutual funds to a list of their names.",
      operation: "map",
      logic: "([fundName]) => fundName"
    }
  ];
  
  
  
  executeSteps(initialData, steps);
  

  
  // Example usage:
  
  const sampleSteps=
  {
    "steps": [
      {
        "description": "Filter records for holdings in the 'Banking' sector.",
        "operation": "filter",
        "logic": "record.company_stock_industry_sector.toUpperCase().indexOf('Banking'.toUpperCase()) > -1"
      },
      {
        "description": "Group the filtered records by mutual fund name.",
        "operation": "reduce",
        "logic": "data.reduce((acc, record) => { const name = record.mutual_fund_name; if (!acc[name]) { acc[name] = []; } acc[name].push(record); return acc; }, {})"
      },
      /*{
        "description": "Sort the grouped records for each mutual fund by reporting_date in ascending order.",
        "operation": "sort",
        "logic": "records.sort((a, b) => new Date(a.reporting_date) - new Date(b.reporting_date))"
      },
      {
        "description": "Check if the holdings in the Banking sector increased for the last 4 consecutive reporting periods.",
        "operation": "filter",
        "logic": "records.slice(-4).every((record, index, arr) => index === 0 || record.percentage_holding_in_mutual_fund > arr[index - 1].percentage_holding_in_mutual_fund)"
      },
      {
        "description": "Map the filtered mutual funds to a list containing only their names.",
        "operation": "map",
        "logic": "Object.keys(filteredData)"
      }*/
    ]
  }
  
  
  try {
    const result = executeSteps(sampleData, sampleSteps.steps);
    //console.log('Execution Results:', result.executionLog);
    //console.log('Final Data:', result.finalResult);
  } catch (error) {
    console.error('Execution failed:', error.message);
    throw error;
  }
  
  // Safety wrapper if you want to avoid using new Function
  