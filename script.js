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

// Format currency values
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

// Append a message to the chat
function addMessage(message, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', isUser ? 'user' : 'bot');
  
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('message-content');
  
  const paragraph = document.createElement('p');
  paragraph.textContent = message;
  
  contentDiv.appendChild(paragraph);
  messageDiv.appendChild(contentDiv);
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Get bot response by calling our serverless function
async function getBotResponse(input) {
  try {
    const initiatives = efficiencyData.result.initiatives;
    const initiativesInfo = initiatives.map(initiative => ({
      date: initiative.date,
      agency: initiative.agency,
      program: initiative.program,
      wasteful_spending: formatCurrency(initiative.wasteful_spending),
      savings: formatCurrency(initiative.savings),
      status: initiative.status,
      description: initiative.description
    }));

    const totalSavings = initiatives.reduce((sum, i) => sum + i.savings, 0);
    const totalWaste = initiatives.reduce((sum, i) => sum + i.wasteful_spending, 0);
    const savingsPercentage = Math.round((totalSavings / totalWaste) * 100);

    const initiativesContext = JSON.stringify(initiativesInfo, null, 2);
    const systemPrompt = `You are the DOGE Efficiency Assistant, a helpful AI that provides information about initiatives from the Department of Government Efficiency (DOGE).

The Department of Government Efficiency (DOGE) is focused on cutting wasteful spending across all government agencies. To date, DOGE has identified ${formatCurrency(totalWaste)} in wasteful spending and has implemented initiatives that saved taxpayers ${formatCurrency(totalSavings)} (${savingsPercentage}% efficiency improvement).

You have access to the following efficiency initiative data:

${initiativesContext}

When answering questions:
1. Be polite, professional, and concise.
2. Focus on how DOGE is cutting wasteful spending and improving efficiency.
3. Format currency values properly.
4. Provide details from the data when asked about agencies or programs.
5. Emphasize both the waste and the savings.
6. If you don’t know the answer based on the data, say so clearly.
7. Your responses should sound like a government efficiency expert.`;

    // Call our Vercel serverless function at /api/chat
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: input }
        ],
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }
    const data = await response.json();
    if (data && data.choices && data.choices.length > 0 && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      throw new Error("Invalid response format from server.");
    }
  } catch (error) {
    console.error("Error in getBotResponse:", error);
    return fallbackBotResponse(input);
  }
}

// Fallback local response if API fails
function fallbackBotResponse(input) {
  const lowercaseInput = input.toLowerCase();
  const initiatives = efficiencyData.result.initiatives;

  if (lowercaseInput.includes('largest') || lowercaseInput.includes('biggest') || lowercaseInput.includes('most wasteful')) {
    const largest = initiatives.sort((a, b) => b.wasteful_spending - a.wasteful_spending)[0];
    return `The largest wasteful spending identified was ${formatCurrency(largest.wasteful_spending)} in the "${largest.program}" program at the ${largest.agency}. Savings achieved: ${formatCurrency(largest.savings)}.`;
  }
  // (Additional fallback cases as in your original code...)
  return "I'm not sure I understand your question. Please ask about wasteful spending, efficiency initiatives, or specific programs.";
}

// Send message on button click or Enter key press
sendButton.addEventListener('click', async () => {
  const message = userInput.value.trim();
  if (!message) return;
  addMessage(message, true);
  userInput.value = '';

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
  statusIndicator.textContent = "🔄 Connecting to AI...";
  document.body.appendChild(statusIndicator);

  const typingDiv = document.createElement('div');
  typingDiv.classList.add('message', 'bot');
  typingDiv.id = 'typingIndicator';
  const typingContent = document.createElement('div');
  typingContent.classList.add('message-content');
  const typingText = document.createElement('p');
  let dots = 0;
  typingText.textContent = "AI is processing your request";
  const thinkingInterval = setInterval(() => {
    dots = (dots + 1) % 4;
    typingText.textContent = "AI is processing your request" + ".".repeat(dots);
  }, 300);
  typingContent.appendChild(typingText);
  typingDiv.appendChild(typingContent);
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const startTime = new Date();
    const botResponse = await getBotResponse(message);
    const endTime = new Date();
    const responseTime = (endTime - startTime) / 1000;
    statusIndicator.style.backgroundColor = '#008000';
    statusIndicator.textContent = `✅ Connected (${responseTime.toFixed(1)}s)`;
    setTimeout(() => statusIndicator.remove(), 5000);
    clearInterval(thinkingInterval);
    document.getElementById('typingIndicator').remove();
    addMessage(botResponse);
  } catch (error) {
    console.error("Error getting response:", error);
    statusIndicator.style.backgroundColor = '#c00000';
    statusIndicator.textContent = "❌ Using local fallback (API unavailable)";
    setTimeout(() => statusIndicator.remove(), 5000);
    clearInterval(thinkingInterval);
    document.getElementById('typingIndicator').remove();
    const fallbackResponse = fallbackBotResponse(message);
    addMessage("I'm sorry, I encountered an error connecting to the real AI. Using local processing instead.\n\n" + fallbackResponse);
  }
});

userInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') sendButton.click();
});
