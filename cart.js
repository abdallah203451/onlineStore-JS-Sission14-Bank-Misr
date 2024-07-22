document.addEventListener("DOMContentLoaded", function () {
  const cartContainer = document.getElementById("cartItems");
  const totalPriceContainer = document.getElementById("totalPrice");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  displayCartItems();

  function displayCartItems() {
    cartContainer.innerHTML = "";
    let totalPrice = 0;
    cart.forEach((item) => {
      const cartItemDiv = document.createElement("div");
      cartItemDiv.className = "bg-white p-4 shadow-lg";
      cartItemDiv.innerHTML = `
          <img src="${item.thumbnail}" alt="${
        item.title
      }" class="w-full h-32 object-contain mb-2">
          <h2 class="text-lg">${item.title}</h2>
          <p class="text-gray-600">Price: ${item.price} USD</p>
          <p class="text-gray-600">Quantity: ${item.quantity}</p>
          <p class="text-gray-600">Total: ${(
            item.price * item.quantity
          ).toFixed(2)} USD</p>
          <div class="flex items-center mt-2">
            <button onclick="updateCartQuantity(${
              item.id
            }, -1)" class="bg-gray-500 text-white px-3 pb-0.5 py-auto rounded-full mr-4 text-xl">-</button>
            <button onclick="updateCartQuantity(${
              item.id
            }, 1)" class="bg-gray-500 text-white px-2 pb-0.5 rounded-full mr-auto text-xl">+</button>
            <button onclick="removeFromCart(${
              item.id
            })" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
          </div>
        `;
      cartContainer.appendChild(cartItemDiv);
      totalPrice += item.price * item.quantity;
    });
    totalPriceContainer.textContent = totalPrice.toFixed(2);
  }

  window.updateCartQuantity = function (productId, change) {
    const cartItem = cart.find((item) => item.id === productId);
    if (cartItem) {
      cartItem.quantity += change;
      if (cartItem.quantity <= 0) {
        cart = cart.filter((item) => item.id !== productId);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      displayCartItems();
    }
  };

  window.removeFromCart = function (productId) {
    cart = cart.filter((item) => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCartItems();
  };
});
