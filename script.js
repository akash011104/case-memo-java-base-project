// Array to store transaction history
let transactionHistory = [];

// Shop details
const shopName = "Riddhi Siddhi Hardware";
const shopAddress = "jigina Sahjanwa Gorakhpur";
const shopContact = "Phone: +91-9839380753";
const shopGSTIN = "GSTIN: 3245435746745";


// Function to add a product row in the product table
function addProduct() {
  const productTableBody = document.getElementById("products");
  const newRow = document.createElement("tr");

  newRow.innerHTML = `
        <td><input type="text" class="productName" required></td>
        <td><input type="number" class="quantity" min="1" required></td>
        <td>
            <select class="unit" required>
                <option value="pcs">Pieces (pcs)</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="l">Liter (L)</option>
                <option value="g">Gram (g)</option>
                <option value="ml">Milliliter (mL)</option>
            </select>
        </td>
        <td><input type="number" class="price" min="0.01" step="0.01" required></td>
        <td><button type="button" class="cancel-button" onclick="removeProduct(this)">Cancel</button></td>
    `;

  productTableBody.appendChild(newRow);
}

// Function to remove a product row
function removeProduct(button) {
  const row = button.parentNode.parentNode;
  row.remove();
}

// Function to generate the memo and calculate total price
function generateMemo() {
  const customerName = document.getElementById("customerName").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const date = document.getElementById("date").value;
  const cgst = parseFloat(document.getElementById("cgst").value);
  const sgst = parseFloat(document.getElementById("sgst").value);
  const productRows = document.querySelectorAll("#products tr");

  let totalPrice = 0;
  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Build the memo output with shop details
  let memoContent = `<h1>${shopName}</h1>
                     <p>${shopAddress}</p>
                     <p>${shopContact}</p>
                     <p>${shopGSTIN}</p>
                     <h2>Transaction Memo</h2>
                     <p>Customer Name: ${customerName}</p>
                     <p>Phone Number: ${phoneNumber}</p>
                     <p>Date: ${date}</p>
                     <p>Time: ${currentTime}</p>
                     <h3>Product Details</h3>
                     <table class="memo-table">
                         <thead>
                             <tr>
                                 <th>Product Name</th>
                                 <th>Quantity</th>
                                 <th>Unit</th>
                                 <th>Price (per unit)</th>
                                 <th>Total Price</th>
                             </tr>
                         </thead>
                         <tbody>`;

  productRows.forEach((row) => {
    const productName = row.querySelector(".productName").value;
    const quantity = parseFloat(row.querySelector(".quantity").value);
    const unit = row.querySelector(".unit").value;
    const pricePerUnit = parseFloat(row.querySelector(".price").value);
    const totalPricePerProduct = quantity * pricePerUnit;

    totalPrice += totalPricePerProduct;

    memoContent += `<tr>
                        <td>${productName}</td>
                        <td>${quantity}</td>
                        <td>${unit}</td>
                        <td>${pricePerUnit.toFixed(2)}</td>
                        <td>${totalPricePerProduct.toFixed(2)}</td>
                    </tr>`;
  });

  // Calculate total GST and grand total
  const totalCGST = (totalPrice * (cgst / 100)).toFixed(2);
  const totalSGST = (totalPrice * (sgst / 100)).toFixed(2);
  const grandTotal = (
    totalPrice +
    parseFloat(totalCGST) +
    parseFloat(totalSGST)
  ).toFixed(2);

  memoContent += `</tbody>
                  </table>
                  <h3>Totals</h3>
                  <p>Total Price: ₹${totalPrice.toFixed(2)}</p>
                  <p>CGST (${cgst}%): ₹${totalCGST}</p>
                  <p>SGST (${sgst}%): ₹${totalSGST}</p>
                  <p><strong>Grand Total: ₹${grandTotal}</strong></p>`;

  // Store the memo in the history
  transactionHistory.push({
    customerName,
    phoneNumber,
    date,
    totalPrice,
    cgst,
    sgst,
    grandTotal,
    memoContent,
  });

  // Display the generated memo
  document.getElementById("memoOutput").innerHTML = memoContent;

  // Update transaction history display
  displayHistory();
}

// Function to display transaction history
function displayHistory() {
  const historyOutput = document.getElementById("historyOutput");
  historyOutput.innerHTML = "<h2>Transaction History</h2>";

  transactionHistory.forEach((memo, index) => {
    historyOutput.innerHTML += `
            <div class="history-item">
                <h3>Memo #${index + 1}</h3>
                <p>Customer Name: ${memo.customerName}</p>
                <p>Phone Number: ${memo.phoneNumber}</p>
                <p>Date: ${memo.date}</p>
                ${memo.memoContent}
            </div>`;
  });
}

// Function to print the memo
function printMemo() {
  const memoOutput = document.getElementById("memoOutput").innerHTML;
  const printWindow = window.open("", "", "height=600,width=800");
  printWindow.document.write(`
      <html>
      <head><title>Print Memo</title></head>
      <body>
       
        ${memoOutput}
      </body>
      </html>`);
  printWindow.document.close();
  printWindow.print();
}
