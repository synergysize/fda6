// Efficiency data from the DOGE API
const efficiencyData = {
    "success": true,
    "result": {
        "initiatives": [
            {
                "date": "3/15/2025",
                "agency": "Department of Defense",
                "program": "Legacy IT Systems Modernization",
                "wasteful_spending": 4200000000,
                "savings": 2850000000,
                "status": "Completed",
                "description": "Consolidated and modernized outdated IT infrastructure across military branches, eliminating redundant systems and reducing maintenance costs."
            },
            {
                "date": "3/5/2025",
                "agency": "Department of Health and Human Services",
                "program": "Healthcare Billing Simplification",
                "wasteful_spending": 3100000000,
                "savings": 1750000000,
                "status": "In Progress",
                "description": "Streamlining Medicare and Medicaid billing procedures to reduce administrative overhead and prevent improper payments."
            },
            {
                "date": "2/28/2025",
                "agency": "Department of Education",
                "program": "Grant Application Consolidation",
                "wasteful_spending": 780000000,
                "savings": 560000000,
                "status": "Completed",
                "description": "Simplified federal education grant application process, reducing paperwork burden on schools and administrative costs."
            },
            {
                "date": "3/10/2025",
                "agency": "General Services Administration",
                "program": "Federal Office Space Optimization",
                "wasteful_spending": 1250000000,
                "savings": 875000000,
                "status": "In Progress",
                "description": "Reducing unused federal office space through telework policies and shared workspace implementation."
            },
            {
                "date": "2/20/2025",
                "agency": "Department of Agriculture",
                "program": "Farm Subsidy Payment Verification",
                "wasteful_spending": 920000000,
                "savings": 685000000,
                "status": "Completed",
                "description": "Implemented improved verification systems to prevent improper subsidy payments and reduce fraud."
            },
            {
                "date": "3/18/2025",
                "agency": "Department of Transportation",
                "program": "Infrastructure Project Streamlining",
                "wasteful_spending": 1680000000,
                "savings": 1120000000,
                "status": "In Progress",
                "description": "Expediting environmental reviews and permitting processes for critical infrastructure projects while maintaining environmental protections."
            },
            {
                "date": "3/1/2025",
                "agency": "Department of Veterans Affairs",
                "program": "Healthcare Supply Chain Reform",
                "wasteful_spending": 850000000,
                "savings": 640000000,
                "status": "Completed",
                "description": "Consolidated procurement of medical supplies across VA hospitals, leveraging bulk purchasing power."
            },
            {
                "date": "2/25/2025",
                "agency": "Internal Revenue Service",
                "program": "Tax Filing Simplification",
                "wasteful_spending": 1450000000,
                "savings": 980000000,
                "status": "In Progress",
                "description": "Modernizing tax filing systems and implementing pre-filled forms to reduce errors and processing costs."
            },
            {
                "date": "3/8/2025",
                "agency": "Department of Energy",
                "program": "Federal Building Energy Efficiency",
                "wasteful_spending": 720000000,
                "savings": 520000000,
                "status": "Completed",
                "description": "Upgraded heating, cooling, and lighting systems in federal buildings to reduce long-term energy costs."
            },
            {
                "date": "3/20/2025",
                "agency": "NASA",
                "program": "Spacecraft Development Process Reform",
                "wasteful_spending": 960000000,
                "savings": 740000000,
                "status": "In Progress",
                "description": "Implementing agile development methodologies and commercial partnerships to reduce spacecraft development costs."
            }
        ]
    },
    "meta": {
        "total_results": 142,
        "pages": 15
    }
};

// DOM elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Format currency numbers
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(value);
}

// Add a message to the chat
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user' : 'bot');
    
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    
    const paragraph = document.createElement('p');
    paragraph.textContent = message;
    
    contentDiv.appendChild(paragraph);
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to the bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// API configuration for OpenAI connection
const API_KEY = "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";
// Connect to the OpenAI API endpoint
const API_URL = "https://api.openai.com";

// Display connection information when the page loads
window.addEventListener('DOMContentLoaded', () => {
    console.log("DOGE Efficiency Chatbot with OpenAI initialized");
    console.log("API Endpoint:", API_URL);
    
    // Add a startup indicator to show we're ready to connect to the API
    const startupIndicator = document.createElement('div');
    startupIndicator.style.position = 'fixed';
    startupIndicator.style.top = '10px';
    startupIndicator.style.right = '10px';
    startupIndicator.style.backgroundColor = '#003366';
    startupIndicator.style.color = 'white';
    startupIndicator.style.padding = '8px 12px';
    startupIndicator.style.borderRadius = '20px';
    startupIndicator.style.fontSize = '14px';
    startupIndicator.style.zIndex = '1000';
    startupIndicator.textContent = "🔌 AI Ready: Connected to OpenAI";
    document.body.appendChild(startupIndicator);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (startupIndicator.parentNode) {
            startupIndicator.parentNode.removeChild(startupIndicator);
        }
    }, 5000);
});

// Get bot response based on user input - using real AI
async function getBotResponse(input) {
    try {
        // First provide the efficiency data in a usable format for the AI
        const initiatives = efficiencyData.result.initiatives;
        const initiativesInfo = initiatives.map(initiative => {
            return {
                date: initiative.date,
                agency: initiative.agency,
                program: initiative.program,
                wasteful_spending: formatCurrency(initiative.wasteful_spending),
                savings: formatCurrency(initiative.savings),
                status: initiative.status,
                description: initiative.description
            };
        });

        // Calculate total savings
        const totalSavings = initiatives.reduce((sum, initiative) => sum + initiative.savings, 0);
        const totalWaste = initiatives.reduce((sum, initiative) => sum + initiative.wasteful_spending, 0);
        const savingsPercentage = Math.round((totalSavings / totalWaste) * 100);

        // Construct the system prompt with efficiency information
        const initiativesContext = JSON.stringify(initiativesInfo, null, 2);
        const systemPrompt = `You are the DOGE Efficiency Assistant, a helpful AI that provides information about initiatives from the Department of Government Efficiency (DOGE).

The Department of Government Efficiency (DOGE) is focused on cutting wasteful spending across all government agencies. To date, DOGE has identified ${formatCurrency(totalWaste)} in wasteful spending and has implemented initiatives that saved taxpayers ${formatCurrency(totalSavings)} (${savingsPercentage}% efficiency improvement).

You have access to the following efficiency initiative data:

${initiativesContext}

When answering questions:
1. Be polite, professional, and concise in your responses
2. Focus on how DOGE is cutting wasteful spending and improving government efficiency
3. Format currency values properly
4. If asked about specific agencies or programs, provide relevant information from the data
5. Emphasize both the wasteful spending identified and the savings achieved
6. If you don't know the answer based on the available data, say so clearly
7. Your responses should sound like a government efficiency expert`;

        // Create a custom XMLHttpRequest to ensure compatibility
        console.log("Starting API request to:", `${API_URL}/v1/chat/completions`);
        
        // Try multiple approaches to reach the API
        // First try: Direct XMLHttpRequest
        try {
            const apiResponse = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', `${API_URL}/v1/chat/completions`, true);
                
                // Set all necessary headers for the API request
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Authorization', `Bearer ${API_KEY}`);
                xhr.setRequestHeader('Accept', 'application/json');
                
                // Set up request timeout
                xhr.timeout = 15000; // 15 seconds
                
                xhr.onload = function() {
                    console.log("API Response received, status:", xhr.status);
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const data = JSON.parse(xhr.responseText);
                            console.log("Successfully parsed JSON response");
                            resolve(data);
                        } catch (e) {
                            console.error("Error parsing JSON response:", e);
                            console.error("Raw response:", xhr.responseText.substring(0, 200) + "...");
                            reject(new Error("Failed to parse API response"));
                        }
                    } else {
                        console.error("API request failed:", xhr.status, xhr.statusText);
                        console.error("Response:", xhr.responseText);
                        reject(new Error(`API request failed with status ${xhr.status}`));
                    }
                };
                
                xhr.onerror = function() {
                    console.error("Network error during API request");
                    reject(new Error("Network error during API request"));
                };
                
                xhr.ontimeout = function() {
                    console.error("API request timed out");
                    reject(new Error("API request timed out after 15 seconds"));
                };
                
                // Create the request payload
                const payload = JSON.stringify({
                    model: "gpt-4o",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: input }
                    ],
                    max_tokens: 500
                });
                
                // Log what we're sending
                console.log("Sending API request to:", `${API_URL}/v1/chat/completions`);
                console.log("With headers:", {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + API_KEY.substring(0, 10) + '...' // Show only part of the key for security
                });
                console.log("Payload sample:", {
                    model: "gpt-4o",
                    messages: [
                        { role: "system", content: systemPrompt.substring(0, 50) + "..." },
                        { role: "user", content: input }
                    ]
                });
                
                // Send the request
                xhr.send(payload);
            });
            
            console.log("API response data sample:", {
                model: apiResponse.model || "unknown",
                object: apiResponse.object || "unknown",
                choices: apiResponse.choices ? apiResponse.choices.length : 0
            });
            
            // Extract message content from the API response
            if (apiResponse && apiResponse.choices && apiResponse.choices.length > 0 && apiResponse.choices[0].message) {
                console.log("Successfully extracted message from primary API response");
                return apiResponse.choices[0].message.content;
            } else {
                console.error("Invalid API response format:", apiResponse);
                throw new Error("Invalid API response format");
            }
        } catch (initialError) {
            console.error("Initial API request failed:", initialError);
            
            // Second try: Use fetch with different configurations if available
            if (window.fetch) {
                console.log("Attempting API request with fetch as fallback...");
                
                try {
                    const response = await fetch(`${API_URL}/v1/chat/completions`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${API_KEY}`
                        },
                        body: JSON.stringify({
                            model: "gpt-4o",
                            messages: [
                                { role: "system", content: systemPrompt },
                                { role: "user", content: input }
                            ],
                            max_tokens: 500
                        }),
                        mode: 'cors'
                    });
                    
                    if (!response.ok) {
                        throw new Error(`Fetch API request failed with status ${response.status}`);
                    }
                    
                    const data = await response.json();
                    console.log("Fetch fallback succeeded");
                    
                    // Extract message content from the API response
                    if (data && data.choices && data.choices.length > 0 && data.choices[0].message) {
                        console.log("Successfully extracted message from API response");
                        return data.choices[0].message.content;
                    } else {
                        console.error("Invalid API response format:", data);
                        throw new Error("Invalid API response format");
                    }
                } catch (fetchError) {
                    console.error("Fetch fallback also failed:", fetchError);
                    throw fetchError; // Re-throw to trigger the main catch block
                }
            } else {
                throw initialError; // Re-throw if fetch isn't available
            }
        }
        
        // This part is not needed as we return directly from the try/catch blocks above
    } catch (error) {
        console.error("Error connecting to AI API:", error);
        
        // Add visible error message to DOM for debugging
        const debugElement = document.createElement('div');
        debugElement.style.position = 'fixed';
        debugElement.style.bottom = '10px';
        debugElement.style.right = '10px';
        debugElement.style.backgroundColor = 'rgba(255,0,0,0.8)';
        debugElement.style.color = 'white';
        debugElement.style.padding = '5px';
        debugElement.style.borderRadius = '5px';
        debugElement.style.zIndex = '9999';
        debugElement.textContent = `API Error: ${error.message}. Falling back to local processing.`;
        document.body.appendChild(debugElement);
        
        // Remove the debug element after 10 seconds
        setTimeout(() => {
            document.body.removeChild(debugElement);
        }, 10000);
        
        // If API fails, fall back to local logic
        console.log("Falling back to local AI processing");
        return fallbackBotResponse(input);
    }
}

// Fallback response in case the API is unavailable
function fallbackBotResponse(input) {
    const lowercaseInput = input.toLowerCase();
    const initiatives = efficiencyData.result.initiatives;
    
    // Handle different types of queries
    if (lowercaseInput.includes('largest') || lowercaseInput.includes('biggest') || lowercaseInput.includes('most wasteful')) {
        const largestWaste = initiatives.sort((a, b) => b.wasteful_spending - a.wasteful_spending)[0];
        return `The largest wasteful spending identified was ${formatCurrency(largestWaste.wasteful_spending)} in the "${largestWaste.program}" program at the ${largestWaste.agency}. We've already saved ${formatCurrency(largestWaste.savings)} through our efficiency initiatives.`;
    }
    
    if (lowercaseInput.includes('most savings') || lowercaseInput.includes('highest savings')) {
        const highestSavings = initiatives.sort((a, b) => b.savings - a.savings)[0];
        return `The highest savings achieved was ${formatCurrency(highestSavings.savings)} in the "${highestSavings.program}" program at the ${highestSavings.agency}, which had identified wasteful spending of ${formatCurrency(highestSavings.wasteful_spending)}.`;
    }
    
    if (lowercaseInput.includes('total') && lowercaseInput.includes('savings')) {
        const totalSavings = initiatives.reduce((sum, initiative) => sum + initiative.savings, 0);
        const totalWaste = initiatives.reduce((sum, initiative) => sum + initiative.wasteful_spending, 0);
        const savingsPercentage = Math.round((totalSavings / totalWaste) * 100);
        return `DOGE has achieved total savings of ${formatCurrency(totalSavings)} out of ${formatCurrency(totalWaste)} identified wasteful spending. That's a ${savingsPercentage}% efficiency improvement for American taxpayers.`;
    }
    
    if (lowercaseInput.includes('in progress') || lowercaseInput.includes('ongoing')) {
        const inProgressInitiatives = initiatives.filter(initiative => initiative.status === "In Progress");
        let response = `There are ${inProgressInitiatives.length} efficiency initiatives currently in progress:\n`;
        inProgressInitiatives.forEach((initiative, index) => {
            response += `${index + 1}. ${initiative.program} (${initiative.agency}) - Expected savings: ${formatCurrency(initiative.savings)}\n`;
        });
        return response;
    }
    
    if (lowercaseInput.includes('completed')) {
        const completedInitiatives = initiatives.filter(initiative => initiative.status === "Completed");
        let response = `There are ${completedInitiatives.length} completed efficiency initiatives:\n`;
        completedInitiatives.forEach((initiative, index) => {
            response += `${index + 1}. ${initiative.program} (${initiative.agency}) - Savings achieved: ${formatCurrency(initiative.savings)}\n`;
        });
        return response;
    }
    
    if (lowercaseInput.includes('agency') || lowercaseInput.includes('department')) {
        const agencyPattern = /(?:agency|department)\s+(?:of\s+)?([a-z ]+)/i;
        const match = lowercaseInput.match(agencyPattern);
        
        if (match && match[1]) {
            const searchTerm = match[1].trim().toLowerCase();
            const matchedAgencies = initiatives.filter(initiative => 
                initiative.agency.toLowerCase().includes(searchTerm)
            );
            
            if (matchedAgencies.length > 0) {
                const totalSavings = matchedAgencies.reduce((sum, initiative) => sum + initiative.savings, 0);
                let response = `The ${matchedAgencies[0].agency} has implemented ${matchedAgencies.length} efficiency initiatives, saving ${formatCurrency(totalSavings)}:\n`;
                matchedAgencies.forEach((initiative, index) => {
                    response += `${index + 1}. ${initiative.program} - ${formatCurrency(initiative.savings)} saved (${initiative.status})\n`;
                });
                return response;
            }
        }
        
        // If no specific agency was mentioned or found, list all agencies
        const agencies = {};
        initiatives.forEach(initiative => {
            if (!agencies[initiative.agency]) {
                agencies[initiative.agency] = {
                    count: 0,
                    savings: 0
                };
            }
            agencies[initiative.agency].count++;
            agencies[initiative.agency].savings += initiative.savings;
        });
        
        let response = "Here are all the agencies with efficiency initiatives:\n";
        for (const [agency, data] of Object.entries(agencies)) {
            response += `${agency}: ${data.count} initiative(s), ${formatCurrency(data.savings)} saved\n`;
        }
        return response;
    }
    
    if (lowercaseInput.includes('program') || lowercaseInput.includes('initiative')) {
        // If they asked about a specific program
        for (const initiative of initiatives) {
            if (lowercaseInput.includes(initiative.program.toLowerCase())) {
                const savingsPercent = Math.round((initiative.savings / initiative.wasteful_spending) * 100);
                return `The "${initiative.program}" at the ${initiative.agency} identified ${formatCurrency(initiative.wasteful_spending)} in wasteful spending and has ${initiative.status === "Completed" ? "saved" : "projected savings of"} ${formatCurrency(initiative.savings)} (${savingsPercent}% efficiency). Status: ${initiative.status}.\n\nDetails: ${initiative.description}`;
            }
        }
        
        // If no specific program was found, list top programs by savings
        let response = "Here are our top efficiency initiatives by savings amount:\n";
        const topSavings = [...initiatives].sort((a, b) => b.savings - a.savings).slice(0, 5);
        topSavings.forEach((initiative, index) => {
            response += `${index + 1}. ${initiative.program} (${initiative.agency}) - ${formatCurrency(initiative.savings)} saved\n`;
        });
        return response;
    }
    
    if (lowercaseInput.includes('description') || lowercaseInput.includes('what is') || lowercaseInput.includes('how does')) {
        if (lowercaseInput.includes('doge') || lowercaseInput.includes('department of government efficiency')) {
            return "The Department of Government Efficiency (DOGE) was established to identify and eliminate wasteful spending across all federal agencies. Our mission is to improve government operations, cut unnecessary costs, and ensure taxpayer dollars are spent effectively. To date, we've identified over $15 billion in wasteful spending and implemented initiatives that have saved taxpayers more than $10 billion.";
        }
        
        // Look for descriptions of specific initiatives
        for (const initiative of initiatives) {
            const programWords = initiative.program.toLowerCase().split(' ');
            // Check if multiple words from the program name appear in the query
            const matchCount = programWords.filter(word => lowercaseInput.includes(word.toLowerCase())).length;
            if (matchCount >= 2 || lowercaseInput.includes(initiative.program.toLowerCase())) {
                return `Description of the ${initiative.program} initiative: ${initiative.description}`;
            }
        }
    }
    
    // Default responses
    if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
        return "Hello! I'm the DOGE Efficiency Assistant. I can provide information about how we're cutting wasteful spending across government agencies. What would you like to know?";
    }
    
    if (lowercaseInput.includes('thank')) {
        return "You're welcome! Is there anything else you'd like to know about our efficiency initiatives?";
    }
    
    if (lowercaseInput.includes('help') || lowercaseInput.includes('what can you do')) {
        return "I can provide information about DOGE's efficiency initiatives to cut wasteful spending. You can ask about:\n- The largest wasteful spending identified\n- Total savings achieved\n- In-progress vs. completed initiatives\n- Specific agencies or departments\n- Individual efficiency programs\n- Details about how DOGE works";
    }
    
    // If no specific query is matched
    return "I'm not sure I understand your question. You can ask about wasteful spending, efficiency initiatives, savings achieved, specific agencies, or program details. Type 'help' for more information.";
}

// Send message when button is clicked
sendButton.addEventListener('click', async () => {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = '';
        
        // Create a status indicator in the footer
        const statusIndicator = document.createElement('div');
        statusIndicator.id = 'apiStatusIndicator';
        statusIndicator.style.position = 'fixed';
        statusIndicator.style.bottom = '40px';
        statusIndicator.style.left = '20px';
        statusIndicator.style.backgroundColor = '#003366';
        statusIndicator.style.color = 'white';
        statusIndicator.style.padding = '8px 12px';
        statusIndicator.style.borderRadius = '20px';
        statusIndicator.style.fontSize = '14px';
        statusIndicator.style.zIndex = '1000';
        statusIndicator.textContent = "🔄 Connecting to OpenAI...";
        document.body.appendChild(statusIndicator);
        
        // Show "typing" indicator
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot');
        typingDiv.id = 'typingIndicator';
        
        const typingContent = document.createElement('div');
        typingContent.classList.add('message-content');
        
        const typingText = document.createElement('p');
        
        // Create the thinking animation with dots
        let dots = 0;
        typingText.textContent = "AI is processing your request";
        const thinkingInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            typingText.textContent = "AI is processing your request" + ".".repeat(dots);
        }, 300);
        
        typingContent.appendChild(typingText);
        typingDiv.appendChild(typingContent);
        chatMessages.appendChild(typingDiv);
        
        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        try {
            // Get the bot response asynchronously
            const startTime = new Date();
            const botResponse = await getBotResponse(message);
            const endTime = new Date();
            const responseTime = (endTime - startTime) / 1000; // in seconds
            
            // Update status indicator to show success
            const statusIndicator = document.getElementById('apiStatusIndicator');
            if (statusIndicator) {
                statusIndicator.style.backgroundColor = '#008000';
                statusIndicator.textContent = `✅ Connected to OpenAI (${responseTime.toFixed(1)}s)`;
                
                // Remove the status indicator after 5 seconds
                setTimeout(() => {
                    if (statusIndicator.parentNode) {
                        statusIndicator.parentNode.removeChild(statusIndicator);
                    }
                }, 5000);
            }
            
            // Remove typing indicator and clear interval
            clearInterval(thinkingInterval);
            const typingIndicator = document.getElementById('typingIndicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
            
            // Add the real response
            addMessage(botResponse);
        } catch (error) {
            console.error("Error getting response:", error);
            
            // Update status indicator to show failure
            const statusIndicator = document.getElementById('apiStatusIndicator');
            if (statusIndicator) {
                statusIndicator.style.backgroundColor = '#c00000';
                statusIndicator.textContent = "❌ Using local fallback (API unavailable)";
                
                // Remove the status indicator after 5 seconds
                setTimeout(() => {
                    if (statusIndicator.parentNode) {
                        statusIndicator.parentNode.removeChild(statusIndicator);
                    }
                }, 5000);
            }
            
            // Remove typing indicator and clear interval
            clearInterval(thinkingInterval);
            const typingIndicator = document.getElementById('typingIndicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
            
            // Get a fallback response from our local logic
            const fallbackResponse = fallbackBotResponse(message);
            
            // Add message showing we're using local fallback
            addMessage("I'm sorry, I encountered an error connecting to the real AI. Using local processing instead.\n\n" + fallbackResponse);
        }
    }
});

// Send message when Enter key is pressed
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});
