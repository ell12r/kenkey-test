async function fetchCashReportData(shop, startDate, endDate) {
    try {
        const response = await fetch(`/getCashReport?shop=${shop}&startDate=${startDate}&endDate=${endDate}`);
        const result = await response.json();

        if (result.success) {
            return result.data;
        } else {
            console.error(`Failed to fetch cash report data for ${shop}`);
            return [];
        }
    } catch (error) {
        console.error(`Error fetching cash report data for ${shop}:`, error);
        return [];
    }
}

// Helper function to process data for the cash report
function processDataForCashReport(data) {
    const cashReportData = [];

    // Assuming each item in data has a 'foodItem', 'amount', and 'amountReturned'
    const processedData = data.map(item => ({
        foodItem: item.foodItem,
        amount: item.amount || 0,
        amountReturned: item.amountReturned || 0,
    }));

    cashReportData.push(...processedData);

    return cashReportData;
}

// Display the cash report on the page
function displayReport(shop, reportData) {
    const reportContainer = document.getElementById('reportContainer');
    reportContainer.innerHTML = ''; // Clear previous content

    reportData.forEach(dateData => {
        const table = document.createElement('table');
        table.innerHTML = `<caption>${shop} - Cash Report - ${dateData.date}</caption>
                            <thead>
                                <tr>
                                    <th>Food Item</th>
                                    <th>Amount</th>
                                    <th>Amount Returned</th>
                                    <th>Amount to Receive</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${dateData.data.map(({ foodItem, amount, amountReturned }) => `
                                    <tr>
                                        <td>${foodItem}</td>
                                        <td>${amount.toFixed(2)} Cedis</td>
                                        <td>${amountReturned.toFixed(2)} Cedis</td>
                                        <td>${(amount - amountReturned).toFixed(2)} Cedis</td>
                                    </tr>
                                `).join('')}
                            </tbody>`;

        reportContainer.appendChild(table);
    });
}


// Fetch and log the cash report data for the selected shop and date range
async function generateCashReport() {
    // Get user input
    const selectedShop = document.getElementById('shop').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // Fetch and log the cash report data for the selected shop and date range
    const reportData = await fetchCashReportData(selectedShop, startDate, endDate);
    console.log(`Data received for ${selectedShop}:`, reportData);

    // Display the cash report on the page
    displayReport(selectedShop, reportData);
}
