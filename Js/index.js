const menuList = document.getElementById("menu-list");
const orderForm = document.getElementById("order-form");
const orderList = document.getElementById("order-list");


function fetchMenu() {
    fetch("http://localhost:3000/menu")
        .then(res => res.json())
        .then(data => {
            menuList.innerHTML = "";
            data.forEach(item => {
                const div = document.createElement("div");
                div.classList.add("menu-item");

                div.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>Price: $${item.price}</p>
                `;
                menuList.appendChild(div);
            });
        });
}


function fetchOrders() {
    fetch("http://localhost:3000/orders")
        .then(res => res.json())
        .then(data => {
            orderList.innerHTML = "";
            data.forEach(order => {
                const li = document.createElement("li");
                li.innerHTML = `${order.name} ordered ${order.quantity} x ${order.item}`;
                const cancelButton = document.createElement("button");
                cancelButton.textContent = "Cancel";
                cancelButton.addEventListener("click", () => deleteOrder(order.id));
                li.appendChild(cancelButton);
                orderList.appendChild(li);
            });
        });
}


orderForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const newOrder = {
        name: document.getElementById("name").value,
        item: document.getElementById("item").value,
        quantity: document.getElementById("quantity").value
    };

    fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder)
    })
    .then(res => res.json())
    .then(() => {
        fetchOrders();
        orderForm.reset();
    });
});


function updateOrder(id, newQuantity) {
    fetch(`http://localhost:3000/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity })
    })
    .then(() => fetchOrders())
    .catch(error => console.error("Error replacing order:", error));
}

function deleteOrder(id) {
    fetch(`http://localhost:3000/orders/${id}`, {
        method: "DELETE"
    })
    .then(() => fetchOrders());
}

// Replace an order (PUT request)
function replaceOrder(id, updatedOrder) {
    fetch(`http://localhost:3000/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedOrder)
    })
    .then(() => fetchOrders());
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    fetchMenu();
    fetchOrders();
});