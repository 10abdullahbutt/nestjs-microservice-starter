const { faker } = require('@faker-js/faker');

// Custom functions for load testing
function generateRandomExampleName() {
  const prefixes = ['Dashboard', 'Panel', 'Settings', 'Report', 'Analytics', 'Admin', 'User'];
  const suffixes = ['View', 'Page', 'Section', 'Module', 'Component', 'Interface'];
  
  const prefix = faker.helpers.arrayElement(prefixes);
  const suffix = faker.helpers.arrayElement(suffixes);
  
  return `${prefix} ${suffix} ${faker.number.int({ min: 1, max: 999 })}`;
}

function generateRandomExampleType() {
  const types = ['Admin', 'User', 'Analytics', 'Settings', 'Dashboard', 'Report', 'Management'];
  return faker.helpers.arrayElement(types);
}

function generateSearchTerm() {
  const searchTerms = ['Dashboard', 'Admin', 'User', 'Settings', 'Report', 'Analytics', 'Panel'];
  return faker.helpers.arrayElement(searchTerms);
}

// Export functions for use in Artillery scenarios
module.exports = {
  generateRandomExampleName,
  generateRandomExampleType,
  generateSearchTerm,
  
  // Custom function to generate random data
  generateExampleData: function() {
    return {
      name: generateRandomExampleName(),
      type: generateRandomExampleType()
    };
  },
  
  // Custom function to generate search parameters
  generateSearchParams: function() {
    return {
      page: faker.number.int({ min: 1, max: 10 }),
      limit: faker.helpers.arrayElement([5, 10, 20, 50]),
      search: Math.random() > 0.7 ? generateSearchTerm() : undefined
    };
  },
  
  // Custom function to validate response
  validateExampleResponse: function(response) {
    if (response.statusCode === 200 || response.statusCode === 201) {
      const body = response.body;
      
      if (response.statusCode === 201) {
        // Validate created example
        if (!body._id || !body.name || !body.type) {
          throw new Error('Invalid example creation response');
        }
      } else {
        // Validate list response
        if (!body.items || !Array.isArray(body.items)) {
          throw new Error('Invalid example list response');
        }
        
        if (typeof body.total !== 'number' || typeof body.page !== 'number') {
          throw new Error('Invalid pagination data');
        }
      }
    }
  },
  
  // Custom function to generate error scenarios
  generateErrorScenario: function() {
    const scenarios = [
      {
        name: 'Invalid page number',
        qs: { page: 'invalid', limit: 10 }
      },
      {
        name: 'Invalid limit',
        qs: { page: 1, limit: 'invalid' }
      },
      {
        name: 'Missing required fields',
        json: { name: '', type: '' }
      },
      {
        name: 'Invalid JSON',
        raw: '{"name": "Test", "type": "TestType"' // Malformed JSON
      }
    ];
    
    return faker.helpers.arrayElement(scenarios);
  },
  
  // Custom function to simulate user behavior
  simulateUserBehavior: function() {
    // Add random delays to simulate real user behavior
    const delay = faker.number.int({ min: 1000, max: 5000 });
    return new Promise(resolve => setTimeout(resolve, delay));
  },
  
  // Custom function to generate load test metrics
  generateMetrics: function() {
    return {
      timestamp: new Date().toISOString(),
      requestId: faker.string.uuid(),
      userId: faker.string.uuid(),
      sessionId: faker.string.uuid()
    };
  }
}; 