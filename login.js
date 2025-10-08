const form = document.getElementById("loginForm");
const messageEl = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  messageEl.textContent = "Vérification en cours...";
  messageEl.className = "message";

  if (!username || !password) {
    messageEl.textContent = "Veuillez remplir tous les champs.";
    messageEl.classList.add("error");
    return;
  }

  try {
    // Fetch data dari DummyJSON API
    const response = await fetch("https://dummyjson.com/users");
    if (!response.ok) throw new Error("Erreur de connexion au serveur.");

    const data = await response.json();
    const users = data.users;

    // Cek apakah username dan password cocok
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      // Simpan firstName ke localStorage
      localStorage.setItem("firstName", user.firstName);

      messageEl.textContent = `Connexion réussie! Bienvenue ${user.firstName} 👋`;
      messageEl.classList.add("success");

      // Redirect ke halaman recipes.html setelah 1.5 detik
      setTimeout(() => {
        window.location.href = "recipes.html";
      }, 1500);
    } else {
      messageEl.textContent = "Incorrect.";
      messageEl.classList.add("error");
    }
  } catch (error) {
    console.error(error);
    messageEl.textContent = "Erreur de connexion au serveur. Veuillez réessayer.";
    messageEl.classList.add("error");
  }
});
