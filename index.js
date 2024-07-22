document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "https://dummyjson.com/products";
  const productsContainer = document.getElementById("products");
  const productDetailsContainer = document.getElementById("productDetails");
  const cartContainer = document.getElementById("cartItems");
  const searchInput = document.getElementById("searchInput");
  const filterType = document.getElementById("filterType");
  const sortPrice = document.getElementById("sortPrice");
  const toggleCartButton = document.getElementById("toggleCart");

  let products = [];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  fetchProducts();

  async function fetchProducts() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    products = data.products;
    displayProducts(products);
    populateFilterOptions();
    updateCartDisplay();
    // fetch(apiUrl)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     products = data.products;
    //     displayProducts(products);
    //     populateFilterOptions();
    //     updateCartDisplay();
    //   });
  }

  function displayProducts(products) {
    productsContainer.innerHTML = "";
    products.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.className = "bg-white p-4 shadow-lg cursor-pointer";
      productDiv.innerHTML = `
        <img src="${product.thumbnail}" alt="${product.title}" class="w-full h-48 object-contain mb-2">
        <h2 class="text-lg">${product.title}</h2>
        <p class="text-gray-600">${product.price} USD</p>
      `;
      productDiv.addEventListener("click", () => showProductDetails(product));
      productsContainer.appendChild(productDiv);
    });
  }

  function showProductDetails(product) {
    productDetailsContainer.innerHTML = `
      <div class="bg-white p-4 rounded-lg relative w-11/12 md:w-3/4 lg:w-1/2">
        <button class="absolute top-2 right-2 text-gray-600 text-xl font-bold" onclick="hideProductDetails()">Close</button>
        <img src="${product.thumbnail}" alt="${product.title}" class="w-full h-72 object-contain mb-4">
        <h2 class="text-2xl mb-2">${product.title}</h2>
        <p class="text-gray-800 mb-2">${product.description}</p>
        <p class="text-lg mb-2">Category: ${product.category}</p>
        <p class="text-lg mb-2">Discount: ${product.discountPercentage}%</p>
        <p class="text-lg mb-2">Rating: ${product.rating}</p>
        <p class="text-xl mb-4 font-bold">${product.price} USD</p>
        <button class="bg-blue-500 text-white px-4 py-2 rounded" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
    productDetailsContainer.classList.remove("hidden");
  }

  window.hideProductDetails = function () {
    productDetailsContainer.classList.add("hidden");
  };

  window.addToCart = function (productId) {
    const product = products.find((p) => p.id === productId);
    const cartItem = cart.find((item) => item.id === productId);
    if (cartItem) {
      cartItem.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
  };

  function updateCartDisplay() {
    cartContainer.innerHTML = "";
    cart.forEach((item) => {
      const cartItemDiv = document.createElement("div");
      cartItemDiv.className = "flex justify-between items-center mb-2";
      cartItemDiv.innerHTML = `
        <span>${item.title} (${item.quantity})</span>
        <div>
          <button class="text-2xl mx-2" onclick="updateCartQuantity(${item.id}, -1)">-</button>
          <button class="text-2xl" onclick="updateCartQuantity(${item.id}, 1)">+</button>
          <button class="text-lg" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      `;
      cartContainer.appendChild(cartItemDiv);
    });
  }

  window.updateCartQuantity = function (productId, change) {
    const cartItem = cart.find((item) => item.id === productId);
    if (cartItem) {
      cartItem.quantity += change;
      if (cartItem.quantity <= 0) {
        cart = cart.filter((item) => item.id !== productId);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartDisplay();
    }
  };

  window.removeFromCart = function (productId) {
    cart = cart.filter((item) => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
  };

  toggleCartButton.addEventListener("click", function () {
    const isCartVisible = cartContainer.style.display !== "none";
    cartContainer.style.display = isCartVisible ? "none" : "block";
  });

  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
  });

  filterType.addEventListener("change", function () {
    const selectedType = filterType.value;
    const filteredProducts = selectedType
      ? products.filter((product) => product.category === selectedType)
      : products;
    displayProducts(filteredProducts);
  });

  sortPrice.addEventListener("change", function () {
    const sortedProducts = [...products].sort((a, b) =>
      sortPrice.value === "asc" ? a.price - b.price : b.price - a.price
    );
    displayProducts(sortedProducts);
  });

  function populateFilterOptions() {
    const uniqueCategories = [
      ...new Set(products.map((product) => product.category)),
    ];
    uniqueCategories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      filterType.appendChild(option);
    });
  }
});
