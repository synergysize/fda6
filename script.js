// Grant data from the DOGE API
const grantData = {
    "success": true,
    "result": {
        "grants": [
            {
                "date": "3/1/2025",
                "agency": "USAID",
                "recipient": "GAVI FOUNDATION",
                "value": 4000000000,
                "savings": 0,
                "link": "https://usaspending.gov/award/ASST_NON_7200GH21IO00002_7200",
                "description": "NEW PIO GAVI COVAX-TO PREVENT, PREPARE FOR , AND RESPOND TO CORONAVIRUS, INCLUDING FOR VACCINE PROCUREMENT AND DELIVERY."
            },
            {
                "date": "3/1/2025",
                "agency": "USAID",
                "recipient": "GAVI FOUNDATION",
                "value": 2630000000,
                "savings": 1750000000,
                "link": "https://usaspending.gov/award/ASST_NON_7200GH22IO00006_7200",
                "description": "THE 2021-2025 STRATEGY (GAVI 5.0), WHICH WAS APPROVED BY THE GAVI BOARD IN JUNE 2019, BUILDS ON THE ALLIANCE'S YEARS OF DEMONSTRATED SUCCESS AND STRIVES TOWARD ITS VISION TO "LEAVE NO ONE BEHIND WITH IMMUNIZATION." TO INCREASE COVERAGE AND EQUITY, GAVI 5.0 PRIORITIZES "ZERO-DOSE" CHILDREN WHO HAVE NOT RECEIVED A SINGLE VACCINE SHOT AS WELL AS MISSED COMMUNITIES. THE ZERO-DOSE AGENDA IS ALSO A KEY PRIORITY FOR THE GLOBAL COMMUNITY'S IMMUNIZATION AGENDA 2030, WHICH WAS ENDORSED BY THE WORLD HEALTH ASSEMBLY IN MAY 2020."
            },
            {
                "date": "3/23/2025",
                "agency": "Department of Health and Human Services",
                "recipient": "PUBLIC HEALTH FOUNDATION ENTERPRISES, INC",
                "value": 1696424899,
                "savings": 482383724,
                "link": null,
                "description": null
            },
            {
                "date": "3/23/2025",
                "agency": "Department of Health and Human Services",
                "recipient": "TX DEPT OF STATE HEALTH SERVICES",
                "value": 1535405092,
                "savings": 877628206,
                "link": null,
                "description": null
            },
            {
                "date": "3/1/2025",
                "agency": "USAID",
                "recipient": "INTERNATIONAL BANK FOR RECONSTRUCTION AND DEVELOPMENT",
                "value": 1300000000,
                "savings": 372500000,
                "link": null,
                "description": null
            },
            {
                "date": "3/23/2025",
                "agency": "Department of Health and Human Services",
                "recipient": "HEALTH, FLORIDA DEPARTMENT OF",
                "value": 1236223812,
                "savings": 482136996,
                "link": null,
                "description": null
            },
            {
                "date": "3/23/2025",
                "agency": "Department of Health and Human Services",
                "recipient": "NEW YORK, CITY OF",
                "value": 807512729,
                "savings": 39516923,
                "link": null,
                "description": null
            },
            {
                "date": "3/23/2025",
                "agency": "Department of Health and Human Services",
                "recipient": "RESEARCH TRIANGLE INSTITUTE",
                "value": 716790486,
                "savings": 428698791,
                "link": null,
                "description": null
            },
            {
                "date": "3/23/2025",
                "agency": "Department of Health and Human Services",
                "recipient": "HEALTH RESEARCH, INC.",
                "value": 700248982,
                "savings": 62262226,
                "link": null,
                "description": null
            },
            {
                "date": "3/23/2025",
                "agency": "Department of Health and Human Services",
                "recipient": "STATE OF OHIO - DEPARTMENT OF HEALTH",
                "value": 672805694,
                "savings": 220743894,
                "link": null,
                "description": null
            }
        ]
    },
    "meta": {
        "total_results": 9221,
        "pages": 923
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

// Get bot response based on user input
function getBotResponse(input) {
    const lowercaseInput = input.toLowerCase();
    const grants = grantData.result.grants;
    
    // Handle different types of queries
    if (lowercaseInput.includes('largest grant') || lowercaseInput.includes('biggest grant') || lowercaseInput.includes('highest value')) {
        const largestGrant = grants[0]; // Already sorted by value
        return `The largest grant is ${formatCurrency(largestGrant.value)} awarded to ${largestGrant.recipient} by ${largestGrant.agency} on ${largestGrant.date}.`;
    }
    
    if (lowercaseInput.includes('total') && (lowercaseInput.includes('value') || lowercaseInput.includes('amount'))) {
        const totalValue = grants.reduce((sum, grant) => sum + grant.value, 0);
        return `The total value of the top 10 grants is ${formatCurrency(totalValue)}.`;
    }
    
    if (lowercaseInput.includes('total') && lowercaseInput.includes('savings')) {
        const totalSavings = grants.reduce((sum, grant) => sum + grant.savings, 0);
        return `The total savings across the top 10 grants is ${formatCurrency(totalSavings)}.`;
    }
    
    if (lowercaseInput.includes('recipient') || lowercaseInput.includes('who received')) {
        let response = "Here are the recipients of the top 10 grants:\n";
        grants.forEach((grant, index) => {
            response += `${index + 1}. ${grant.recipient} - ${formatCurrency(grant.value)}\n`;
        });
        return response;
    }
    
    if (lowercaseInput.includes('agency') || lowercaseInput.includes('department')) {
        const agencies = {};
        grants.forEach(grant => {
            if (!agencies[grant.agency]) {
                agencies[grant.agency] = 0;
            }
            agencies[grant.agency]++;
        });
        
        let response = "Here are the agencies providing the top 10 grants:\n";
        for (const [agency, count] of Object.entries(agencies)) {
            response += `${agency}: ${count} grant(s)\n`;
        }
        return response;
    }
    
    if (lowercaseInput.includes('gavi') || lowercaseInput.includes('foundation')) {
        const gaviGrants = grants.filter(grant => grant.recipient.includes('GAVI'));
        if (gaviGrants.length > 0) {
            let response = `GAVI FOUNDATION received ${gaviGrants.length} grants:\n`;
            gaviGrants.forEach((grant, index) => {
                response += `${index + 1}. ${formatCurrency(grant.value)} on ${grant.date} - ${grant.description ? grant.description.substring(0, 100) + '...' : 'No description available'}\n`;
            });
            return response;
        }
    }
    
    if (lowercaseInput.includes('health') && lowercaseInput.includes('human services')) {
        const hhsGrants = grants.filter(grant => grant.agency.includes('Health and Human Services'));
        if (hhsGrants.length > 0) {
            const totalValue = hhsGrants.reduce((sum, grant) => sum + grant.value, 0);
            return `The Department of Health and Human Services awarded ${hhsGrants.length} grants totaling ${formatCurrency(totalValue)}.`;
        }
    }
    
    if (lowercaseInput.includes('description') || lowercaseInput.includes('what is') || lowercaseInput.includes('what are')) {
        if (lowercaseInput.includes('gavi') || lowercaseInput.includes('covax')) {
            const gaviGrant = grants.find(grant => grant.description && grant.description.includes('COVAX'));
            if (gaviGrant) {
                return `Description of the GAVI COVAX grant: ${gaviGrant.description}`;
            }
        }
        
        if (lowercaseInput.includes('specific') || lowercaseInput.includes('detail')) {
            let response = "Here are brief descriptions for grants that have them:\n";
            grants.forEach((grant, index) => {
                if (grant.description) {
                    response += `${index + 1}. ${grant.recipient}: ${grant.description.substring(0, 100)}...\n`;
                }
            });
            return response;
        }
    }
    
    // Default responses
    if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
        return "Hello! I'm the DOGE Grants Assistant. I can provide information about our top grants. What would you like to know?";
    }
    
    if (lowercaseInput.includes('thank')) {
        return "You're welcome! Is there anything else you'd like to know about our grants?";
    }
    
    if (lowercaseInput.includes('help') || lowercaseInput.includes('what can you do')) {
        return "I can provide information about the top 10 grants by value. You can ask about:\n- The largest/biggest grant\n- Total grant values or savings\n- Grant recipients\n- Agencies providing grants\n- Specific grant descriptions\n- Information about specific recipients like GAVI FOUNDATION";
    }
    
    // If no specific query is matched
    return "I'm not sure I understand your question. You can ask about the largest grants, total values, recipients, agencies, or specific grant details. Type 'help' for more information.";
}

// Send message when button is clicked
sendButton.addEventListener('click', () => {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = '';
        
        // Get and display bot response after a short delay
        setTimeout(() => {
            const botResponse = getBotResponse(message);
            addMessage(botResponse);
        }, 500);
    }
});

// Send message when Enter key is pressed
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});

// Focus on input field when page loads
window.addEventListener('load', () => {
    userInput.focus();
});