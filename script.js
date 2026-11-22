const menu = [
  { id: 1, name: "Espresso", cat: "Hot", price: 350, icon: "☕", desc: "Rich, concentrated single shot." },
  { id: 2, name: "Cappuccino", cat: "Hot", price: 480, icon: "☕", desc: "Espresso with steamed milk and foam." },
  { id: 3, name: "Caffè Latte", cat: "Hot", price: 520, icon: "🥛", desc: "Smooth espresso with lots of milk." },
  { id: 4, name: "Mocha", cat: "Hot", price: 580, icon: "🍫", desc: "Espresso, chocolate and steamed milk." },
  { id: 5, name: "Iced Americano", cat: "Cold", price: 450, icon: "🧊", desc: "Espresso over ice and cold water." },
  { id: 6, name: "Cold Brew", cat: "Cold", price: 550, icon: "🧊", desc: "Steeped for 18 hours, served chilled." },
  { id: 7, name: "Iced Caramel Latte", cat: "Cold", price: 620, icon: "🍮", desc: "Latte over ice with caramel syrup." },
  { id: 8, name: "Butter Croissant", cat: "Bakery", price: 300, icon: "🥐", desc: "Baked fresh every morning." },
  { id: 9, name: "Chocolate Brownie", cat: "Bakery", price: 350, icon: "🍰", desc: "Dense, fudgy and warm." },
  { id: 10, name: "Blueberry Muffin", cat: "Bakery", price: 320, icon: "🧁", desc: "Soft muffin packed with berries." }
];

const categories = ["All", "Hot", "Cold", "Bakery"];
let activeCat = "All";
let searchTerm = "";
let cart = {}; // { itemId: quantity }

const $ = (id) => document.getElementById(id);
const money = (n) => "Rs " + n.toLocaleString();

function renderFilters() {
  $("filters").innerHTML = categories
    .map((c) => `<button class="${c === activeCat ? "active" : ""}" data-cat="${c}">${c}</button>`)
    .join("");
}

function renderMenu() {
  const items = menu.filter(
    (m) =>
      (activeCat === "All" || m.cat === activeCat) &&
      (m.name + " " + m.desc).toLowerCase().includes(searchTerm)
  );
  if (!items.length) {
    $("menuGrid").innerHTML = `<p class="no-results">No items match “${searchTerm}”. Try a different word or category.</p>`;
    return;
  }
  $("menuGrid").innerHTML = items
    .map(
      (m) => `
    <article class="item">
      <div class="art">${m.icon}</div>
      <div class="body">
        <h3>${m.name}</h3>
        <p>${m.desc}</p>
        <div class="row">
          <span class="price">${money(m.price)}</span>
          <button class="add" data-add="${m.id}">Add to cart</button>
        </div>
      </div>
    </article>`
    )
    .join("");
}

function renderCart() {
  const ids = Object.keys(cart);
  let total = 0;
  let count = 0;

  $("cartItems").innerHTML = ids.length
    ? ids
        .map((id) => {
          const item = menu.find((m) => m.id == id);
          const qty = cart[id];
          total += item.price * qty;
          count += qty;
          return `
          <li>
            <div><strong>${item.name}</strong><br><small>${money(item.price)} each</small></div>
            <div class="qty">
              <button data-dec="${id}" aria-label="Remove one ${item.name}">−</button>
              <span>${qty}</span>
              <button data-inc="${id}" aria-label="Add one ${item.name}">+</button>
            </div>
          </li>`;
        })
        .join("")
    : `<li class="empty">Your cart is empty. Add a drink from the menu.</li>`;

  $("cartTotal").textContent = money(total);
  $("cartCount").textContent = count;
  $("checkout").disabled = ids.length === 0;
}

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 2000);
}

function toggleCart(open) {
  $("drawer").classList.toggle("open", open);
  $("overlay").classList.toggle("show", open);
  $("drawer").setAttribute("aria-hidden", String(!open));
}

// Events
$("filters").addEventListener("click", (e) => {
  if (!e.target.dataset.cat) return;
  activeCat = e.target.dataset.cat;
  renderFilters();
  renderMenu();
});

$("search").addEventListener("input", (e) => {
  searchTerm = e.target.value.trim().toLowerCase();
  renderMenu();
});

$("menuGrid").addEventListener("click", (e) => {
  const id = e.target.dataset.add;
  if (!id) return;
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  toast(menu.find((m) => m.id == id).name + " added to cart");
});

$("cartItems").addEventListener("click", (e) => {
  const inc = e.target.dataset.inc;
  const dec = e.target.dataset.dec;
  if (inc) cart[inc]++;
  if (dec && --cart[dec] <= 0) delete cart[dec];
  renderCart();
});

$("checkout").addEventListener("click", () => {
  cart = {};
  renderCart();
  toggleCart(false);
  toast("Order placed! We’ll call your name soon.");
});

$("openCart").addEventListener("click", () => toggleCart(true));
$("closeCart").addEventListener("click", () => toggleCart(false));
$("overlay").addEventListener("click", () => toggleCart(false));
document.addEventListener("keydown", (e) => e.key === "Escape" && toggleCart(false));

// Start
renderFilters();
renderMenu();
renderCart();
